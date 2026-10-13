# RMS Shared Assistance v1

Angelea McCullough, Founder of RMS Global Publishing.

## Coverage and authority
This release extends existing RMS infrastructure; it does not install another CRM, payment flow, notification queue or autonomous community agent.

| Consumer | Implemented behavior | Boundary |
| --- | --- | --- |
| Discord HTTP bridge | Signed slash/button/modal help, scoped track count, audio path help, member pause, explicit staff takeover | No ordinary-message listening or unsolicited posting |
| Existing optional Gateway | Same requested-interaction controller | Guilds intent only; no new persistent worker |
| CreatorHub assistance | Authenticated own-state controls and safe next routes | No name/email identity merge with Discord |
| AOS decision engine | Suppresses optional resume/opportunity/notification/room/promo suggestions for paused or human-handled state | Core payment, upload, rights and fulfillment rules remain independent |
| Context handoff | Adds authoritative help context and global pause inheritance | Context is not licensing or payment authority |
| Rowan support API | Adds verified assistance metadata | Existing direct-response logic remains; not a claim every client consumes new metadata |
| Founder control | Private aggregate/recent-state view and protected staff API | No automated host notification or raw transcript storage |
| Sound Stage readiness | Recorded route, host checklist and audience attestation; route change invalidation, 30-minute freshness | No automatic device or physical-audio measurement |

## Entry and operation
Use /helpstudio, /portal or /studio inside the existing Reset Inner Circle application. Requested results are ephemeral. Host audio readiness, human handling and release controls require signed staff permissions. Controls bind the member, room, guild and state version, expire in 15 minutes, and re-read human/pause status before response. Two unsuccessful audio steps surface host attention; only explicit listener confirmation marks it resolved. Continue-other-help retains unconfirmed audio instead of blocking publishing indefinitely.
CreatorHub: /creator/assistance, linked from Support. Founder: /admin/assistance, linked in existing admin navigation.
General invite verified against Discord: https://discord.gg/DWyT4vskVW resolves Reset Inner Circle and its Sound Stage. Do not replace unrelated room-specific invites.

## Database and deployment
Source migration 20261013020427_rms_shared_assistance_v1.sql was applied to production as 20261013022809. Do not reapply under a different timestamp. It reuses rms_intelligence_signals and rms_routing_decisions, adds two indexes, two service-only SECURITY INVOKER RPCs and a private aggregate view, and extends the existing system registry. The schema-only preview lacks these established intelligence tables; PGlite tests plus rolled-back production assertions were used instead of creating a parallel schema.
The rms-assistance-gateway function uses custom authentication validated by the service-only bridge RPC. Existing server-held bridge secret is reused with purpose-separated signed component IDs; no credentials are printed or sent to browsers. No new provider dependency is added. Bridge health probes the authenticated backend without creating any member state.

## Testing and release gates
14 isolated SQL scenario groups, six actual server-module fixture groups, eight signed Discord/controller tests, and eight browser checks accompany existing CI. Tests cover stale revisions, duplicates/payload conflicts, human races, pause, source-specific audio, no false resolution, scope, customer/staff isolation, no autoplay/outbound/financial writes, desktop/mobile bounds and context-only handoffs. Release remains gated by both repository CI and production verification.

## Explicitly not activated
Automatic new-member event replies, reading ordinary channel conversation, automatic host/device detection, Glow Exchange XP changes, website-review task intake, automatic cross-account identity linkage, proactive DMs/reminders, paid offers/bundles and broad external-platform adapters are not activated. Recognition quiet-mode is a decision signal, not a native bot configuration change. Do not represent these as delivered merely because the shared policy exists. Historical transcript replay is shadow evaluation only and does not fabricate a customer or send a message.

## Rollback
Revert the bridge/application release first, then disable assistance_v1.enabled in the existing registry if needed. Preserve the additive state, financial records and audit evidence. Never drop legacy intelligence tables or revoke existing essential RPCs to roll this feature back.
