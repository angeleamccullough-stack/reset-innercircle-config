-- Proposal only. Not executed. Existing customer access and transaction history remain unchanged.
UPDATE public.rms_studio_service_catalog SET active=true,founder_approved=true,updated_at=now()
WHERE service_key IN ('remote_recording','remote_own_setup','podcast_interview','performance_capture','open_mic_production','poetry_slam_production','workshop_listening','launch_showcase_event');
-- Keep automatic fulfillment disabled. Public quote requests still require project-specific approval.
-- The live ingress change must be tested against the actual Stripe tax/discount configuration before deployment.
CREATE FUNCTION private.rms_validate_reset_stripe_payload(p_external_event_id text,p_event_type text,p_payload jsonb) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $fn$
DECLARE v_lane text; v_type text; v_min integer; v_max integer; v_amount numeric;
BEGIN
 IF p_event_type IS NULL OR p_event_type NOT IN ('checkout.session.completed','checkout.session.async_payment_succeeded') THEN RAISE EXCEPTION 'Unsupported Stripe communications event type'; END IF;
 IF p_external_event_id IS NULL OR p_external_event_id !~ '^evt_' OR p_payload->>'stripe_event_id' IS DISTINCT FROM p_external_event_id THEN RAISE EXCEPTION 'Stripe event reference mismatch'; END IF;
 IF p_payload->>'scope' IS DISTINCT FROM 'resetinnercircle' OR p_payload->>'source' IS DISTINCT FROM 'stripe' THEN RAISE EXCEPTION 'Invalid Reset Stripe communications scope'; END IF;
 IF p_payload->>'payment_status' IS DISTINCT FROM 'paid' THEN RAISE EXCEPTION 'Only paid Stripe events may enter'; END IF;
 IF coalesce(p_payload->>'stripe_checkout_session_id','') !~ '^cs_' THEN RAISE EXCEPTION 'Checkout session reference required'; END IF;
 CASE p_payload->>'stripe_payment_link_id'
 WHEN 'plink_1UG8HHLlKcswOpj9aJJoRmGd' THEN v_lane:='reset_media_studios';v_type:='project_deposit';v_min:=25000;v_max:=500000;
 WHEN 'plink_1UG8HNLlKcswOpj9oTj7dBbn' THEN v_lane:='reset_live_events';v_type:='booking_deposit';v_min:=50000;v_max:=1000000;
 WHEN 'plink_1UG7sdLlKcswOpj9H69f92AA' THEN v_lane:='reset_society_support';v_type:='optional_support';v_min:=1;v_max:=NULL;
 ELSE RAISE EXCEPTION 'Unrecognized Reset payment link';
 END CASE;
 IF p_payload->>'lane' IS DISTINCT FROM v_lane OR p_payload->>'payment_type' IS DISTINCT FROM v_type THEN RAISE EXCEPTION 'Reset payment lane mismatch'; END IF;
 IF p_payload->>'currency' IS DISTINCT FROM 'usd' OR jsonb_typeof(p_payload->'amount_total_cents') IS DISTINCT FROM 'number' THEN RAISE EXCEPTION 'USD numeric payment amount required'; END IF;
 v_amount:=(p_payload->>'amount_total_cents')::numeric;
 IF v_amount <> trunc(v_amount) OR v_amount < v_min OR (v_max IS NOT NULL AND v_amount > v_max) THEN RAISE EXCEPTION 'Payment amount outside verified lane limits'; END IF;
END;
$fn$;
REVOKE ALL ON FUNCTION private.rms_validate_reset_stripe_payload(text,text,jsonb) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION private.rms_validate_reset_stripe_payload(text,text,jsonb) TO service_role;

-- Once validator tests pass, add this invocation after the ingress-secret and scope checks in
-- private.rms_record_reset_stripe_ingress_internal without changing or exporting its credential hash:
-- PERFORM private.rms_validate_reset_stripe_payload(p_external_event_id,p_event_type,p_payload);
