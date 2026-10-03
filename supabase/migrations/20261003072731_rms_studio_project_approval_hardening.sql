
ALTER TABLE public.rms_studio_service_catalog ALTER COLUMN founder_approved SET DEFAULT false;
ALTER TABLE public.rms_studio_service_catalog ALTER COLUMN active SET DEFAULT false;
ALTER TABLE public.rms_studio_service_requests ADD COLUMN delivery_evidence_reference text;
ALTER TABLE public.rms_studio_service_requests ADD CONSTRAINT rms_studio_quote_nonnegative CHECK (quoted_price_cents IS NULL OR quoted_price_cents >= 0);
ALTER TABLE public.rms_studio_rights_reviews ADD CONSTRAINT rms_studio_cleared_evidence_required CHECK (
 review_status <> 'cleared' OR (writers_verified AND splits_verified AND master_owner_verified AND composition_owner_verified AND samples_verified AND loops_verified AND third_party_licenses_verified AND metadata_complete AND nullif(btrim(reviewed_by),'') IS NOT NULL AND reviewed_at IS NOT NULL)
);
CREATE TABLE public.rms_studio_project_approval_events (
 approval_id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 request_id uuid NOT NULL REFERENCES public.rms_studio_service_requests(id) ON DELETE RESTRICT,
 decision text NOT NULL CHECK (decision IN ('approved','rejected','revoked')),
 reviewer_reference text NOT NULL CHECK (length(btrim(reviewer_reference)) > 0),
 authority_basis text NOT NULL CHECK (authority_basis IN ('founder','founder_authorized_operator')),
 evidence_reference text NOT NULL CHECK (length(btrim(evidence_reference)) > 0),
 reason text NOT NULL CHECK (length(btrim(reason)) > 0),
 service_key_snapshot text NOT NULL,
 quoted_price_cents_snapshot integer,
 currency_snapshot text NOT NULL,
 scope_confirmed boolean NOT NULL DEFAULT false,
 terms_confirmed boolean NOT NULL DEFAULT false,
 availability_confirmed boolean NOT NULL DEFAULT false,
 rights_scope_confirmed boolean NOT NULL DEFAULT false,
 expires_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT rms_studio_project_approval_complete CHECK (
 decision <> 'approved' OR (scope_confirmed AND terms_confirmed AND availability_confirmed AND rights_scope_confirmed AND quoted_price_cents_snapshot IS NOT NULL AND quoted_price_cents_snapshot >= 0)
 )
);
ALTER TABLE public.rms_studio_project_approval_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.rms_studio_project_approval_events FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT ON public.rms_studio_project_approval_events TO service_role;
GRANT USAGE,SELECT ON SEQUENCE public.rms_studio_project_approval_events_approval_id_seq TO service_role;
CREATE INDEX rms_studio_project_approval_latest_idx ON public.rms_studio_project_approval_events(request_id,approval_id DESC);
CREATE FUNCTION public.rms_studio_project_approval_append_only() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
BEGIN RAISE EXCEPTION 'Approval history is append-only; record a new decision'; END;
$fn$;
REVOKE ALL ON FUNCTION public.rms_studio_project_approval_append_only() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER rms_studio_project_approval_append_only BEFORE UPDATE OR DELETE ON public.rms_studio_project_approval_events FOR EACH ROW EXECUTE FUNCTION public.rms_studio_project_approval_append_only();
CREATE FUNCTION public.rms_record_studio_project_approval(
 p_request_id uuid,p_decision text,p_reviewer_reference text,p_authority_basis text,p_evidence_reference text,p_reason text,
 p_scope_confirmed boolean DEFAULT false,p_terms_confirmed boolean DEFAULT false,p_availability_confirmed boolean DEFAULT false,p_rights_scope_confirmed boolean DEFAULT false,p_expires_at timestamptz DEFAULT NULL
) RETURNS bigint LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
DECLARE r public.rms_studio_service_requests%ROWTYPE; v_id bigint;
BEGIN
 SELECT * INTO r FROM public.rms_studio_service_requests WHERE id=p_request_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Studio request not found'; END IF;
 IF p_decision='approved' AND NOT EXISTS (SELECT 1 FROM public.rms_studio_service_catalog WHERE service_key=r.service_key AND active AND founder_approved) THEN RAISE EXCEPTION 'Service lacks active Founder approval'; END IF;
 IF p_decision='approved' AND p_expires_at IS NOT NULL AND p_expires_at <= now() THEN RAISE EXCEPTION 'Approval expiry must be in the future'; END IF;
 INSERT INTO public.rms_studio_project_approval_events(request_id,decision,reviewer_reference,authority_basis,evidence_reference,reason,service_key_snapshot,quoted_price_cents_snapshot,currency_snapshot,scope_confirmed,terms_confirmed,availability_confirmed,rights_scope_confirmed,expires_at)
 VALUES(r.id,p_decision,p_reviewer_reference,p_authority_basis,p_evidence_reference,p_reason,r.service_key,r.quoted_price_cents,r.currency,p_scope_confirmed,p_terms_confirmed,p_availability_confirmed,p_rights_scope_confirmed,p_expires_at) RETURNING approval_id INTO v_id;
 RETURN v_id;
END;
$fn$;
REVOKE ALL ON FUNCTION public.rms_record_studio_project_approval(uuid,text,text,text,text,text,boolean,boolean,boolean,boolean,timestamptz) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.rms_record_studio_project_approval(uuid,text,text,text,text,text,boolean,boolean,boolean,boolean,timestamptz) TO service_role;
CREATE FUNCTION public.rms_guard_studio_project_approval() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
DECLARE a public.rms_studio_project_approval_events%ROWTYPE;
BEGIN
 IF NEW.request_status IN ('payment_pending','in_progress','delivered') THEN
  SELECT * INTO a FROM public.rms_studio_project_approval_events WHERE request_id=NEW.id ORDER BY approval_id DESC LIMIT 1;
  IF a.approval_id IS NULL OR a.decision <> 'approved' OR a.service_key_snapshot IS DISTINCT FROM NEW.service_key OR a.quoted_price_cents_snapshot IS DISTINCT FROM NEW.quoted_price_cents OR a.currency_snapshot IS DISTINCT FROM NEW.currency OR (a.expires_at IS NOT NULL AND a.expires_at <= now()) THEN RAISE EXCEPTION 'Current matching project approval required'; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.rms_studio_service_catalog WHERE service_key=NEW.service_key AND active AND founder_approved) THEN RAISE EXCEPTION 'Service lacks active Founder approval'; END IF;
  IF NEW.request_status IN ('in_progress','delivered') AND coalesce(NEW.quoted_price_cents,0)>0 AND (NEW.payment_status<>'paid' OR (NEW.stripe_checkout_session_id IS NULL AND NEW.stripe_payment_intent_id IS NULL)) THEN RAISE EXCEPTION 'Paid production requires payment evidence'; END IF;
  IF NEW.request_status='delivered' AND nullif(btrim(NEW.delivery_evidence_reference),'') IS NULL THEN RAISE EXCEPTION 'Delivery evidence required'; END IF;
 END IF;
 RETURN NEW;
END;
$fn$;
REVOKE ALL ON FUNCTION public.rms_guard_studio_project_approval() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER rms_guard_studio_project_approval BEFORE INSERT OR UPDATE ON public.rms_studio_service_requests FOR EACH ROW EXECUTE FUNCTION public.rms_guard_studio_project_approval();
