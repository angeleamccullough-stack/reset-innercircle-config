
BEGIN;
SET LOCAL ROLE service_role;
DO $test$
DECLARE req uuid; passed integer:=0; e bigint; before_count bigint;
BEGIN
 SELECT count(*) INTO before_count FROM public.rms_studio_service_requests;
 INSERT INTO public.rms_studio_service_requests(request_reference,service_key,quoted_price_cents,requester_reference,requester_user_id)
 VALUES('rms-approval-transaction-test-'||gen_random_uuid()::text,'custom_production',35000,'synthetic-transaction-test',gen_random_uuid()) RETURNING id INTO req;
 IF NOT EXISTS(SELECT 1 FROM public.rms_creator_work_receipts WHERE source_table='rms_studio_service_requests' AND source_key=req::text AND state='verifying') THEN RAISE EXCEPTION 'FAIL expected verifying receipt'; END IF; passed:=passed+1;
 IF NOT EXISTS(SELECT 1 FROM public.rms_studio_project_approval_health WHERE request_id=req AND approval_health='awaiting_project_approval' AND NOT approval_current) THEN RAISE EXCEPTION 'FAIL health omitted pending approval'; END IF; passed:=passed+1;
 BEGIN UPDATE public.rms_studio_service_requests SET request_status='in_progress' WHERE id=req; RAISE EXCEPTION 'FAIL missing approval accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Current matching project approval required' THEN RAISE; END IF; END; passed:=passed+1;
 BEGIN PERFORM public.rms_record_studio_project_approval(req,'approved','synthetic-auditor','founder','synthetic-test-evidence','rollback-only test'); RAISE EXCEPTION 'FAIL incomplete approval accepted'; EXCEPTION WHEN check_violation THEN NULL; END; passed:=passed+1;
 e:=public.rms_record_studio_project_approval(req,'approved','synthetic-auditor','founder','synthetic-test-evidence','rollback-only test',true,true,true,true,now()+interval '1 hour'); passed:=passed+1;
 UPDATE public.rms_studio_service_requests SET request_status='payment_pending' WHERE id=req; passed:=passed+1;
 BEGIN UPDATE public.rms_studio_service_requests SET session_id=gen_random_uuid() WHERE id=req; RAISE EXCEPTION 'FAIL reassigned session accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Current matching project approval required' THEN RAISE; END IF; END; passed:=passed+1;

 BEGIN UPDATE public.rms_studio_service_requests SET requester_user_id=gen_random_uuid() WHERE id=req; RAISE EXCEPTION 'FAIL reassigned approval accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Current matching project approval required' THEN RAISE; END IF; END; passed:=passed+1;
 BEGIN UPDATE public.rms_studio_service_requests SET requester_reference='changed-requester' WHERE id=req; RAISE EXCEPTION 'FAIL reassigned approval accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Current matching project approval required' THEN RAISE; END IF; END; passed:=passed+1;
 BEGIN UPDATE public.rms_studio_service_requests SET request_reference='changed-request-reference' WHERE id=req; RAISE EXCEPTION 'FAIL reassigned approval accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Current matching project approval required' THEN RAISE; END IF; END; passed:=passed+1;

 IF NOT EXISTS(SELECT 1 FROM public.rms_creator_work_receipts WHERE source_table='rms_studio_service_requests' AND source_key=req::text AND state='waiting_on_you') THEN RAISE EXCEPTION 'FAIL expected waiting_on_you receipt'; END IF; passed:=passed+1;

 BEGIN UPDATE public.rms_studio_service_requests SET request_status='in_progress' WHERE id=req; RAISE EXCEPTION 'FAIL unpaid production accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Paid production requires payment evidence' THEN RAISE; END IF; END; passed:=passed+1;
 BEGIN UPDATE public.rms_studio_service_requests SET quoted_price_cents=36000 WHERE id=req; RAISE EXCEPTION 'FAIL changed quote accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Current matching project approval required' THEN RAISE; END IF; END; passed:=passed+1;
 BEGIN UPDATE public.rms_studio_project_approval_events SET reason='tampered' WHERE approval_id=e; RAISE EXCEPTION 'FAIL mutable approval accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Approval history is append-only; record a new decision' THEN RAISE; END IF; END; passed:=passed+1;
 BEGIN DELETE FROM public.rms_studio_project_approval_events WHERE approval_id=e; RAISE EXCEPTION 'FAIL approval deletion accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Approval history is append-only; record a new decision' THEN RAISE; END IF; END; passed:=passed+1;
 UPDATE public.rms_studio_service_requests SET request_status='review' WHERE id=req;
 PERFORM public.rms_record_studio_project_approval(req,'revoked','synthetic-auditor','founder','synthetic-revocation','rollback-only test');
 BEGIN UPDATE public.rms_studio_service_requests SET request_status='payment_pending' WHERE id=req; RAISE EXCEPTION 'FAIL revoked approval accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Current matching project approval required' THEN RAISE; END IF; END; passed:=passed+1;
 UPDATE public.rms_studio_service_requests SET quoted_price_cents=0 WHERE id=req;
 PERFORM public.rms_record_studio_project_approval(req,'approved','synthetic-auditor','founder','synthetic-free-scope','rollback-only test',true,true,true,true);
 UPDATE public.rms_studio_service_requests SET request_status='in_progress' WHERE id=req; passed:=passed+1;
 IF NOT EXISTS(SELECT 1 FROM public.rms_creator_work_receipts WHERE source_table='rms_studio_service_requests' AND source_key=req::text AND state='working') THEN RAISE EXCEPTION 'FAIL expected working receipt'; END IF; passed:=passed+1;

 BEGIN UPDATE public.rms_studio_service_requests SET request_status='delivered' WHERE id=req; RAISE EXCEPTION 'FAIL evidence-free delivery accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM <> 'Delivery evidence required' THEN RAISE; END IF; END; passed:=passed+1;
 UPDATE public.rms_studio_service_requests SET request_status='delivered',delivery_evidence_reference='synthetic-delivery-evidence' WHERE id=req; passed:=passed+1;
 IF NOT EXISTS(SELECT 1 FROM public.rms_creator_work_receipts WHERE source_table='rms_studio_service_requests' AND source_key=req::text AND state='complete') THEN RAISE EXCEPTION 'FAIL expected complete receipt'; END IF; passed:=passed+1;
 UPDATE public.rms_studio_service_requests SET request_status='canceled' WHERE id=req;
 IF NOT EXISTS(SELECT 1 FROM public.rms_creator_work_receipts WHERE source_table='rms_studio_service_requests' AND source_key=req::text AND state='blocked_safely') THEN RAISE EXCEPTION 'FAIL expected blocked_safely receipt'; END IF; passed:=passed+1;

 BEGIN INSERT INTO public.rms_studio_rights_reviews(asset_id,review_status) VALUES('synthetic-missing-asset','cleared'); RAISE EXCEPTION 'FAIL incomplete rights cleared'; EXCEPTION WHEN check_violation THEN NULL; END; passed:=passed+1;
 IF has_table_privilege('anon','public.rms_studio_project_approval_events','SELECT') OR has_table_privilege('authenticated','public.rms_studio_project_approval_events','INSERT') OR has_function_privilege('authenticated','public.rms_record_studio_project_approval(uuid,text,text,text,text,text,boolean,boolean,boolean,boolean,timestamptz)','EXECUTE') THEN RAISE EXCEPTION 'FAIL customer approval access exists'; END IF; passed:=passed+1;
 IF passed<>24 THEN RAISE EXCEPTION 'FAIL test count %',passed; END IF;
END;
$test$;
ROLLBACK;
