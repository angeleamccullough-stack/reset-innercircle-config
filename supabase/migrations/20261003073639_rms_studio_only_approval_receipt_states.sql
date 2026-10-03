CREATE FUNCTION public.rms_sync_studio_approval_receipt() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $function$
DECLARE v_user uuid;v_key text;v_type text;v_title text;v_state text;v_role text;v_chain text[];v_message text;v_next text;
BEGIN
      v_user:=NEW.requester_user_id; v_key:=NEW.id::text; v_type:='studio_service_request'; v_title:=coalesce(nullif(NEW.service_key,''),'RMS Studio service request'); v_role:='CARE'; v_chain:=array['ROWAN','CARE','FORGE','WORKER','VERIFY','CARE'];
      if NEW.request_status in ('hold','canceled') then v_state:='blocked_safely'; v_message:='This Studio request is paused or canceled. Production will not advance from this state.'; v_next:='Review the request status with Reset before proceeding.';
      elsif not exists(select 1 from public.rms_studio_project_approval_health h where h.request_id=NEW.id and h.approval_current) then v_state:='verifying'; v_message:='Your Studio request is recorded and awaiting scope, terms, availability and rights-scope approval. Production has not started.'; v_next:='Reset will confirm the project scope and agreed next steps before production.';
      elsif NEW.request_status='delivered' then v_state:='complete'; v_message:='RMS recorded the delivery evidence for your approved Studio request.'; v_next:='Review the final service or delivery information in your workspace.';
      elsif coalesce(NEW.quoted_price_cents,0)>0 and NEW.payment_status<>'paid' then v_state:='waiting_on_you'; v_message:='Your approved Studio request is awaiting payment reconciliation. Paid production has not started.'; v_next:='Complete payment only if you intend to proceed with the agreed service.';
      elsif NEW.request_status='in_progress' then v_state:='working'; v_message:='Your approved Studio request is in production.'; v_next:='Reset will record delivery evidence before marking the service complete.';
      else v_state:='verifying'; v_message:='Your Studio request is in coordination. Payment confirmation is separate from scheduling and production.'; v_next:='Reset will confirm the next production step.';
      end if;
  if v_user is null then return NEW; end if;
  insert into public.rms_creator_work_receipts(actor_user_id,source_table,source_key,workflow_type,public_title,state,assigned_role,role_chain,public_message,next_step,internal_execution_key,first_received_at,last_progress_at,completed_at,created_at,updated_at)
  values(v_user,TG_TABLE_NAME,v_key,v_type,v_title,v_state,v_role,v_chain,v_message,v_next,TG_TABLE_NAME||':'||v_key,coalesce(NEW.created_at,now()),now(),case when v_state='complete' then now() else null end,now(),now())
  on conflict(source_table,source_key) do update set actor_user_id=excluded.actor_user_id,workflow_type=excluded.workflow_type,public_title=excluded.public_title,state=excluded.state,assigned_role=excluded.assigned_role,role_chain=excluded.role_chain,public_message=excluded.public_message,next_step=excluded.next_step,last_progress_at=now(),completed_at=case when excluded.state='complete' then coalesce(public.rms_creator_work_receipts.completed_at,now()) else null end,updated_at=now();
  return NEW;
end;
$function$;
REVOKE ALL ON FUNCTION public.rms_sync_studio_approval_receipt() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.rms_sync_studio_approval_receipt() TO service_role;
DROP TRIGGER rms_receipt_studio_requests ON public.rms_studio_service_requests;
CREATE TRIGGER rms_receipt_studio_requests AFTER INSERT OR UPDATE ON public.rms_studio_service_requests FOR EACH ROW EXECUTE FUNCTION public.rms_sync_studio_approval_receipt();
