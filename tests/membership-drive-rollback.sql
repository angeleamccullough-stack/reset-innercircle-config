-- Rollback-only diagnostic. The final deliberate ROLLBACK_TEST_RESULTS exception aborts all writes.
-- Never remove the final exception; never run portions as committed production operations.
-- Uses synthetic .invalid identity; no Drive or Discord API calls.
DO $test$
DECLARE m text := 'ROWAN_ROLLBACK_CERT_' || gen_random_uuid()::text; results jsonb := '{}'::jsonb; r jsonb; state text; folder text;
BEGIN
  BEGIN
    BEGIN
      r := public.rms_studio_apply_pi_event(jsonb_build_object('event_key',m||':activate','event_type','membership_activated','member_reference',m,'tier','tier_1','principal_email','rowan-test@example.invalid'));
      results := results || jsonb_build_object('valid_email_activation','accepted');
    EXCEPTION WHEN OTHERS THEN
      results := results || jsonb_build_object('valid_email_activation',SQLERRM);
    END;
    INSERT INTO public.rms_studio_entitlements(member_reference,tier,entitlement_status,drive_folder_id,access_principal_email)
    VALUES(m,'tier_2','active',public.rms_studio_tier_drive_folder('tier_2'),'rowan-test@example.invalid')
    ON CONFLICT(member_reference) DO UPDATE SET tier='tier_2',entitlement_status='active',drive_folder_id=public.rms_studio_tier_drive_folder('tier_2');
    BEGIN
      r := public.rms_studio_set_entitlement_principal(m,'rowan-test@example.invalid');
      results := results || jsonb_build_object('valid_email_principal_update','accepted');
    EXCEPTION WHEN OTHERS THEN results := results || jsonb_build_object('valid_email_principal_update',SQLERRM);
    END;
    INSERT INTO public.rms_studio_drive_actions(action_key,member_reference,action_type,previous_folder_id,target_folder_id,target_tier,source_event_key,principal_email,status)
    VALUES(m||':oldgrant',m,'grant',null,public.rms_studio_tier_drive_folder('tier_1'),'tier_1',m||':old','rowan-test@example.invalid','processing');
    r := public.rms_studio_complete_drive_action(m||':oldgrant',true,null);
    SELECT drive_folder_id INTO folder FROM public.rms_studio_entitlements WHERE member_reference=m;
    results := results || jsonb_build_object('stale_grant_overwrites_newer_tier_folder',folder=public.rms_studio_tier_drive_folder('tier_1'));
    UPDATE public.rms_studio_entitlements SET entitlement_status='archived',drive_folder_id=null WHERE member_reference=m;
    INSERT INTO public.rms_studio_drive_actions(action_key,member_reference,action_type,target_folder_id,target_tier,source_event_key,principal_email,status)
    VALUES(m||':lategrant',m,'grant',public.rms_studio_tier_drive_folder('tier_1'),'tier_1',m||':late','rowan-test@example.invalid','processing');
    r := public.rms_studio_complete_drive_action(m||':lategrant',true,null);
    SELECT entitlement_status INTO state FROM public.rms_studio_entitlements WHERE member_reference=m;
    results := results || jsonb_build_object('late_grant_reactivates_archived_entitlement',state='active');
    r := public.rms_studio_complete_drive_action(m||':lategrant',true,null);
    results := results || jsonb_build_object('duplicate_completion_idempotent',coalesce((r->>'duplicate')::boolean,false));
    INSERT INTO public.rms_studio_drive_actions(action_key,member_reference,action_type,target_folder_id,target_tier,source_event_key,principal_email,status,attempts,max_attempts)
    VALUES(m||':retry',m,'grant',public.rms_studio_tier_drive_folder('tier_1'),'tier_1',m||':retry-event','rowan-test@example.invalid','processing',1,5);
    r := public.rms_studio_complete_drive_action(m||':retry',false,'synthetic retry test');
    results := results || jsonb_build_object('failure_retry_scheduled',r->>'state'='retry_scheduled');
    UPDATE public.rms_studio_drive_actions SET attempts=5,status='processing' WHERE action_key=m||':retry';
    r := public.rms_studio_complete_drive_action(m||':retry',false,'synthetic exhausted test');
    results := results || jsonb_build_object('failure_exhaustion_stops_retry',r->>'state'='failed');
    RAISE EXCEPTION USING ERRCODE='P0001', MESSAGE='ROLLBACK_TEST_RESULTS: '||results::text;
  END;
END $test$;
