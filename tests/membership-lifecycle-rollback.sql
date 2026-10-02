-- Rollback-only diagnostic. The final deliberate ROLLBACK_TEST_RESULTS exception aborts all writes.
-- Never remove the final exception; never run portions as committed production operations.
-- Uses synthetic .invalid identity; no Drive or Discord API calls.
DO $test$
DECLARE m text := 'ROWAN_ROLLBACK_CERT_'||gen_random_uuid()::text; results jsonb := '{}'::jsonb; r jsonb; state text;
BEGIN
 r:=public.rms_studio_apply_pi_event(jsonb_build_object('event_key',m||':a','event_type','membership_activated','member_reference',m,'tier','tier_1','principal_email','rowan-test@example.invalid'));
 r:=public.rms_studio_apply_pi_event(jsonb_build_object('event_key',m||':a','event_type','membership_activated','member_reference',m,'tier','tier_1','principal_email','rowan-test@example.invalid'));
 results:=results||jsonb_build_object('duplicate_event_idempotent',coalesce((r->>'duplicate')::boolean,false));
 r:=public.rms_studio_apply_pi_event(jsonb_build_object('event_key',m||':u','event_type','membership_upgraded','member_reference',m,'tier','tier_2','principal_email','rowan-test@example.invalid'));
 results:=results||jsonb_build_object('upgrade_queued',r->>'status'='pending_external_action');
 BEGIN
  r:=public.rms_studio_apply_pi_event(jsonb_build_object('event_key',m||':d','event_type','membership_downgraded','member_reference',m,'tier','tier_1','principal_email','rowan-test@example.invalid'));
  results:=results||jsonb_build_object('explicit_downgrade_event','accepted');
 EXCEPTION WHEN OTHERS THEN results:=results||jsonb_build_object('explicit_downgrade_event',SQLERRM); END;
 r:=public.rms_studio_apply_pi_event(jsonb_build_object('event_key',m||':c','event_type','membership_canceled','member_reference',m,'principal_email','rowan-test@example.invalid','cancel_at_period_end',true,'current_period_end',extract(epoch from now()+interval '30 days')));
 SELECT entitlement_status INTO state FROM public.rms_studio_entitlements WHERE member_reference=m;
 results:=results||jsonb_build_object('cancel_with_future_paid_through_queues_immediate_revoke',state='pending_access_revoke');
 BEGIN
  r:=public.rms_studio_cancel_membership_preserve_licenses(m,m||':helper-c');
  results:=results||jsonb_build_object('license_preserving_cancel_helper','accepted');
 EXCEPTION WHEN OTHERS THEN results:=results||jsonb_build_object('license_preserving_cancel_helper',SQLERRM); END;
 r:=public.rms_studio_apply_pi_event(jsonb_build_object('event_key',m||':late-a','event_type','membership_activated','member_reference',m,'tier','tier_1','principal_email','rowan-test@example.invalid'));
 SELECT entitlement_status INTO state FROM public.rms_studio_entitlements WHERE member_reference=m;
 results:=results||jsonb_build_object('stale_distinct_activation_after_cancel_accepted',state='pending_access_grant');
 RAISE EXCEPTION USING ERRCODE='P0001',MESSAGE='ROLLBACK_TEST_RESULTS: '||results::text;
END $test$;
