# Membership fulfillment certification — FAILED / LAUNCH BLOCKED

Owner: Angelea McCullough, Founder of RMS Global Publishing
Test date: October 1, 2026 (America/New_York)
Production project: RMS Creator Portal
Public subscription buttons: remain gated
New recurring cost: $0.00

## Executed evidence

Inspected existing production Studio tables, function definitions, function privileges, selected registry fields and approved plan amounts. Existing preview project contains no Studio fulfillment tables or deployed Edge Functions. CreatorHub private GitHub source retrieval remained unavailable (404); no application adapter or webhook handler was certified.

Executed two synthetic SQL diagnostic batches. Each deliberately raises ROLLBACK_TEST_RESULTS, aborting the entire transaction. That expected exception is the result transport, not a failed test runner. Verified zero synthetic residual rows in entitlements, Drive actions and PI events after both batches. No external Drive/Discord API calls or Stripe charges; no schema changes.

## Passed primitive checks

- Activation with valid principal email queues fulfillment.
- Duplicate PI event key is idempotent.
- Upgrade queues an external action.
- Duplicate Drive action completion is idempotent.
- Failed Drive completion schedules a retry.
- Exhausted retry budget stops retries.
- All three approved database plan prices match Member $29/$290, Pro $59/$590 and Executive $99/$990.
- Entitlements, Drive actions and PI events have RLS enabled.
- anon and authenticated cannot execute apply_pi_event, complete_drive_action or set_entitlement_principal.

These are database primitive tests; they do not prove external access, authenticated linking, webhook verification or customer fulfillment.

## Reproduced defects

1. A processing tier_1 grant completion overwrites the folder on an existing tier_2 entitlement. Completion does not validate the current desired generation/tier.
2. A late processing grant completion reactivates an archived entitlement. Completion does not reject superseded work.
3. set_entitlement_principal rejects rowan-test@example.invalid, a valid syntactic email. Its lowercased value is tested against a case-sensitive uppercase character class.
4. cancel_membership_preserve_licenses fails with “Drive action cannot be queued without principal_email”. The helper creates an incomplete PI event for the current queue trigger.

## Uncertified lifecycle behavior

- apply_pi_event receives membership_canceled with cancel_at_period_end=true and a paid-through boundary 30 days in the future, yet immediately queues revocation. The primitive does not enforce billing boundaries. A certified Stripe adapter must emit effective cancellation only at the correct time; no such adapter was verified.
- A distinct activation event after cancellation is accepted. The primitive cannot distinguish stale delivery from legitimate resubscription without authoritative subscription reconciliation.
- Explicit membership_downgraded is unsupported. This alone does not prove downgrade is impossible: an adapter could use the existing change primitive, but scheduling at the correct paid boundary is untested.
- The inspected database exposes no Discord user identity binding or subscription period-end columns. External identity storage may exist in inaccessible application code; it was not verified.
- Drive registry: capability probe passed; scheduler recorded as supabase_pg_cron_every_2_minutes; live_grant_revoke_proof remains pending_controlled_non_customer_identity.
- Monthly and annual end-to-end purchase, authenticated account binding, wrong-account rejection, signed webhook handling, concurrent/out-of-order events, Discord role grant/revoke, live Drive grant/revoke, failed-payment policy, downgrade, resubscribe and perpetual-license preservation are NOT CERTIFIED.

## Required remediation and final tests

1. Obtain usable existing CreatorHub application/worker source. Reuse current implementation.
2. Correct principal validation and cancellation helper event fields.
3. Version desired entitlement changes; obsolete queued actions and reject stale completion. Reconcile authoritative subscription state and generation before external grants and before final status updates.
4. Bind authenticated CreatorHub member to Stripe customer/subscription and separately verified Discord user ID. Validate the approved Google principal; email syntax alone does not verify identity.
5. Implement/review paid-through cancellation, upgrade/downgrade timing, failed-payment policy and independently retryable Drive/Discord outcomes. Preserve separately purchased perpetual licenses.
6. Use an existing non-production environment and a designated controlled non-customer Google/Discord identity for real grant/revoke tests. No paid branch, live customer purchase or newly billed resource.
7. Run every required lifecycle and adversarial test. Record external read-back evidence.
8. Activate subscription buttons only after all required tests PASS.

Reproducible diagnostics:
- tests/membership-drive-rollback.sql
- tests/membership-lifecycle-rollback.sql

Production checkout fix from PR #6 remains separate and is not changed by this certification branch.
