ALTER TABLE public.rms_studio_project_approval_events ADD COLUMN session_id_snapshot uuid, ADD COLUMN requester_user_id_snapshot uuid, ADD COLUMN requester_reference_snapshot text, ADD COLUMN request_reference_snapshot text NOT NULL;
CREATE OR REPLACE FUNCTION public.rms_record_studio_project_approval(
 p_request_id uuid,p_decision text,p_reviewer_reference text,p_authority_basis text,p_evidence_reference text,p_reason text,
 p_scope_confirmed boolean DEFAULT false,p_terms_confirmed boolean DEFAULT false,p_availability_confirmed boolean DEFAULT false,p_rights_scope_confirmed boolean DEFAULT false,p_expires_at timestamptz DEFAULT NULL
) RETURNS bigint LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
DECLARE r public.rms_studio_service_requests%ROWTYPE; v_id bigint;
BEGIN
 SELECT * INTO r FROM public.rms_studio_service_requests WHERE id=p_request_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Studio request not found'; END IF;
 IF p_decision='approved' AND NOT EXISTS (SELECT 1 FROM public.rms_studio_service_catalog WHERE service_key=r.service_key AND active AND founder_approved) THEN RAISE EXCEPTION 'Service lacks active Founder approval'; END IF;
 IF p_decision='approved' AND p_expires_at IS NOT NULL AND p_expires_at <= now() THEN RAISE EXCEPTION 'Approval expiry must be in the future'; END IF;
 INSERT INTO public.rms_studio_project_approval_events(request_id,decision,reviewer_reference,authority_basis,evidence_reference,reason,service_key_snapshot,quoted_price_cents_snapshot,currency_snapshot,session_id_snapshot,requester_user_id_snapshot,requester_reference_snapshot,request_reference_snapshot,scope_confirmed,terms_confirmed,availability_confirmed,rights_scope_confirmed,expires_at)
 VALUES(r.id,p_decision,p_reviewer_reference,p_authority_basis,p_evidence_reference,p_reason,r.service_key,r.quoted_price_cents,r.currency,r.session_id,r.requester_user_id,r.requester_reference,r.request_reference,p_scope_confirmed,p_terms_confirmed,p_availability_confirmed,p_rights_scope_confirmed,p_expires_at) RETURNING approval_id INTO v_id;
 RETURN v_id;
END;
$fn$;
CREATE OR REPLACE FUNCTION public.rms_guard_studio_project_approval() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
DECLARE a public.rms_studio_project_approval_events%ROWTYPE;
BEGIN
 IF NEW.request_status IN ('payment_pending','in_progress','delivered') THEN
  SELECT * INTO a FROM public.rms_studio_project_approval_events WHERE request_id=NEW.id ORDER BY approval_id DESC LIMIT 1;
  IF a.approval_id IS NULL OR a.decision <> 'approved' OR a.service_key_snapshot IS DISTINCT FROM NEW.service_key OR a.quoted_price_cents_snapshot IS DISTINCT FROM NEW.quoted_price_cents OR a.currency_snapshot IS DISTINCT FROM NEW.currency OR a.session_id_snapshot IS DISTINCT FROM NEW.session_id OR a.requester_user_id_snapshot IS DISTINCT FROM NEW.requester_user_id OR a.requester_reference_snapshot IS DISTINCT FROM NEW.requester_reference OR a.request_reference_snapshot IS DISTINCT FROM NEW.request_reference OR (a.expires_at IS NOT NULL AND a.expires_at <= now()) THEN RAISE EXCEPTION 'Current matching project approval required'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.rms_studio_service_catalog WHERE service_key=NEW.service_key AND active AND founder_approved) THEN RAISE EXCEPTION 'Service lacks active Founder approval'; END IF;
  IF NEW.request_status IN ('in_progress','delivered') AND coalesce(NEW.quoted_price_cents,0)>0 AND (NEW.payment_status<>'paid' OR (NEW.stripe_checkout_session_id IS NULL AND NEW.stripe_payment_intent_id IS NULL)) THEN RAISE EXCEPTION 'Paid production requires payment evidence'; END IF;
  IF NEW.request_status='delivered' AND nullif(btrim(NEW.delivery_evidence_reference),'') IS NULL THEN RAISE EXCEPTION 'Delivery evidence required'; END IF;
 END IF;
 RETURN NEW;
END;
$fn$;

CREATE OR REPLACE VIEW public.rms_studio_project_approval_health WITH (security_invoker=true) AS
SELECT r.id AS request_id,r.request_reference,r.service_key,r.request_status,r.payment_status,
 a.approval_id,a.decision AS latest_approval_decision,
 (a.decision='approved' AND a.service_key_snapshot=r.service_key AND a.quoted_price_cents_snapshot IS NOT DISTINCT FROM r.quoted_price_cents AND a.currency_snapshot=r.currency AND a.session_id_snapshot IS NOT DISTINCT FROM r.session_id AND a.requester_user_id_snapshot IS NOT DISTINCT FROM r.requester_user_id AND a.requester_reference_snapshot IS NOT DISTINCT FROM r.requester_reference AND a.request_reference_snapshot=r.request_reference AND (a.expires_at IS NULL OR a.expires_at>now()) AND c.active AND c.founder_approved) IS TRUE AS approval_current,
 CASE WHEN a.approval_id IS NULL THEN 'awaiting_project_approval'
 WHEN a.decision<>'approved' THEN a.decision
 WHEN a.expires_at<=now() THEN 'approval_expired'
 WHEN a.service_key_snapshot IS DISTINCT FROM r.service_key OR a.quoted_price_cents_snapshot IS DISTINCT FROM r.quoted_price_cents OR a.currency_snapshot IS DISTINCT FROM r.currency OR a.session_id_snapshot IS DISTINCT FROM r.session_id OR a.requester_user_id_snapshot IS DISTINCT FROM r.requester_user_id OR a.requester_reference_snapshot IS DISTINCT FROM r.requester_reference OR a.request_reference_snapshot IS DISTINCT FROM r.request_reference THEN 'approval_scope_changed'
 WHEN NOT c.active OR NOT c.founder_approved THEN 'catalog_not_approved'
 WHEN r.quoted_price_cents>0 AND (r.payment_status<>'paid' OR (r.stripe_checkout_session_id IS NULL AND r.stripe_payment_intent_id IS NULL)) THEN 'awaiting_payment_reconciliation'
 WHEN r.request_status='delivered' AND nullif(btrim(r.delivery_evidence_reference),'') IS NULL THEN 'delivery_evidence_missing'
 ELSE 'approval_requirements_met' END AS approval_health
FROM public.rms_studio_service_requests r
JOIN public.rms_studio_service_catalog c USING(service_key)
LEFT JOIN LATERAL (SELECT * FROM public.rms_studio_project_approval_events e WHERE e.request_id=r.id ORDER BY e.approval_id DESC LIMIT 1) a ON true;
REVOKE ALL ON public.rms_studio_project_approval_health FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.rms_studio_project_approval_health TO service_role;
