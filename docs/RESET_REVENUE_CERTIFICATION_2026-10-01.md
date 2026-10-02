# RESET revenue certification — October 1, 2026

Owner: Angelea McCullough, Founder of RMS Global Publishing

## Verified this pass

- Connected Stripe account: acct_1TelSkLlKcswOpj9, live mode.
- Existing Member, Pro, Executive products and all six monthly/annual prices match approved USD pricing. Existing membership payment links also exist. No duplicate products, prices, links, or subscriptions were created.
- Canonical price IDs and membership activation gates: `config/reset-membership-certification.json`.
- All five existing repository contract tests passed.
- Public homepage, /live.html, /arena.html, /partner.html, /now-playing.json returned HTTP 200.
- /support redirects to the existing support function and reaches Stripe Checkout.
- Existing Studio and Event deposit payment links are active in Stripe and match `config/reset-payment-buckets.json`.

## Production failure requiring repair

Both /checkout/studio and /checkout/events returned the application-authored HTTP 503 checkout-unconnected page before and after deployment.

The Netlify connector accepted these production-context, functions-scope updates:
- RESET_STRIPE_STUDIO_SERVICES_URL: existing approved Studio deposit URL.
- RESET_STRIPE_EVENT_SERVICES_URL: existing approved Event booking deposit URL.

Deployment 6abef36a5d09d75f0fd5e230 reached ready and was published. This did not repair either checkout route. Connector success is not proof of runtime fulfillment.

Do not treat the historical `active_verified` payment manifest as fresh end-to-end certification. Product/link existence is verified; the two gateway service routes are degraded. Direct function requests with bucket query parameters subsequently returned 302 to the correct existing Stripe links. The root cause is that public-path rewrites preserve the original Request URL, so the query-only lane resolver does not identify the lane. PR #6 resolves the lane from the public pathname and gives it precedence over caller query values. Five contract tests pass, including exact public paths, conflicting queries and HEAD requests. The fix is prepared, not deployed. Do not broaden contexts or scopes without specific approval.

Automatic approval review rejected reading all Netlify environment variables and rejected all-context/all-scope updates. No rejected changes were executed.

## Membership remains gated

Do not expose membership payment links or activate gateway membership buttons until authenticated CreatorHub fulfillment, explicit Discord identity binding, approved Drive scope, lifecycle reconciliation and all required tests pass.

Stripe products reference `public.rms_studio_membership_plans` as entitlement authority. That database and its execution workers were not inspected or changed this pass. Stripe product metadata does not prove runtime functionality.

Cancel-at-period-end must retain access until the paid-through boundary. Preserve separately purchased perpetual licenses. No email-only Discord matching.

## Other unverified surfaces

- Carl dashboard redirected to a signed-out landing page; Login opened Discord authentication. Premium assignment and community modules were not changed.
- The supplied Discord invite DWyT4vskVW differs from repository invite PAHFE5mGV. Discord invite API requests returned 403 in this environment; neither invite was certified or replaced.
- CreatorHub /create returned 403 from this environment. This is not proof of a customer-facing outage.
- GitHub repository discovery found rms-creator-portal, but clone and file retrieval did not provide its source. No CreatorHub code/database changes.
- Vercel project connector rejected its own projectId/teamId call shape with an input-validation error. Bridge deployment/runtime not certified.
- No private Drive entitlement changes, Discord paid-role grants, bot retirements, message purges, purchases or paid automation.

## No-cost execution order

1. Repair and verify the two production checkout bindings, then verify intake/fulfillment routing.
2. Obtain usable CreatorHub source/database access; inspect existing entitlement implementation before adding anything.
3. Implement missing verified identity binding and idempotent membership reconciliation in that existing system.
4. Run monthly/annual/upgrade/downgrade/cancel/failed-payment/revoke/resubscribe and adversarial identity/retry tests in an existing non-production environment. Do not charge real customers for testing.
5. Activate membership CTAs only when certification passes.
6. Authenticate Carl once, confirm the existing Premium slot, apply one module at a time with live evidence.
7. Verify invite/onboarding, event gates, slash commands, role expiry and private logging. Preserve VoiceMaster until Carl temporary-room lifecycle passes.
8. Verify deduplication and aggregated funnel analytics across actual owners before scheduling additional posts.

Incremental recurring cost introduced: $0.00.
Overall public product: DEGRADED (homepage works; Studio/Event gateway checkout routes fail).

## Approval boundary

Automatic approval review rejected squash-merging PR #6 into main because it may trigger production deployment and requires approval for this exact merge. No merge or indirect deployment of that code fix was executed. Approve merging PR #6 and deploying the tested fix to continue production verification.
