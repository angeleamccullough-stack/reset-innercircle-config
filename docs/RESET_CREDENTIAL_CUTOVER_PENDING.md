# Reset payment credential cutover — pending

Owner: Angelea McCullough, Founder of RMS Global Publishing

Repair PR #8 is merged at 20689d57304df7dfd0346a625e3b815572d9c6e2. Vercel production dpl_7jaV8cmBuy6cXTV8z1wt4zsxffHM and Netlify production 6ac065ab4b6cad00088dee05 are READY. Synthetic signature and delayed-payment tests passed; checkout routes reach existing Stripe pages. Live payment ingress remains not configured. No real charge or customer-access mutation was used for testing.

## Exact pending coordinated change

- Preserve existing Stripe endpoint we_1UGANVLlKcswOpj9XFGNTuMw; do not create a duplicate.
- Provision the existing endpoint signing secret directly into RESET_STRIPE_COMMUNICATIONS_WEBHOOK_SECRET, protected production context, functions scope only. Never record its value in chat, source, documents or logs.
- Generate one cryptographic ingress secret, install only its SHA-256 hash in the existing private ingress helper, and install the matching secret in RESET_CREATORHUB_COMMUNICATIONS_INGRESS_SECRET in Netlify, protected production/function scope only. Preserve the function signature, event allowlist, recipients, access controls and other behavior.
- Coordinate both updates with deployment; verify the matching pair without publishing values. If the cutover cannot complete, keep the ingress closed and restore the prior hash/configuration rather than accepting unsigned requests.
- Add checkout.session.async_payment_succeeded to the existing endpoint after configuration passes; preserve checkout.session.completed.
- Verify invalid signatures rejected, an authenticated non-customer probe reaches only the approved ingress, durable event deduplication and retry behavior. Synthetic proof is not a genuine transaction or complete membership certification.

Automatic review rejected a new live webhook because it could duplicate events. It also rejected an uncoordinated ingress-secret write because a matching database hash update was not applied. Neither rejected operation executed. Explicit coordinated authorization remains pending.

## Remaining membership implementation

Authenticated CreatorHub member/subscription mapping, explicit Discord identity binding, approved Drive principal, membership-only grant provenance, lifecycle reconciliation and external worker certification remain required. Public membership checkout stays disabled. Preserve perpetual purchases and paid-through cancellation access.

## Search visibility verified

Search Console for rmsglobalpublishing.com is accessible. The three-month Web report displays June 30–September 29, 2026: 18 clicks, 1.24K impressions, 1.5% CTR, average position 51.6. Access is restored; traffic performance still needs improvement.
