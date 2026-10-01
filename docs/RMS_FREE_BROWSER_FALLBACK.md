# RMS / FMS Worker Free Browser Fallback Standard

**Owner:** Angelea McCullough, Founder of RMS Global Publishing  
**Status:** Active  
**Effective:** 2026-10-01

## Purpose

Provide a no-extra-cost execution path when a browser connector, external browser agent, or paid web-automation service is blocked, unavailable, or unnecessary.

This standard applies to RMS/FMS workers operating Reset Inner Circle, Carl-bot, CreatorHub, Netlify, Stripe, Supabase, GitHub, Discord, and related RMS systems.

## Non-negotiable cost rule

1. **Do not spend money on browser automation by default.**
2. Do not launch TinyFish Agent, paid remote browsers, paid RPA, new SaaS add-ons, premium browser credits, or metered web agents without explicit Founder approval for that exact run.
3. Existing paid product subscriptions already approved by the Founder may be configured, but workers must not purchase an upgrade, add-on, seat, credit pack, or premium tier.
4. If a task can be completed through an existing API, plugin, CLI, repository change, or manual one-time browser configuration, use that route first.
5. Never retry a metered browser loop after an authentication failure. Stop, report the blocker, and switch to the free fallback path.

## Free execution priority

### Tier 1 — Existing first-party or connected service tools

Use service-native tools before browser automation whenever available:

- GitHub connector/API for repository and configuration changes.
- Netlify connector/API for site state and deploy verification.
- Stripe connector/API for products, prices, payment links, portal and billing configuration.
- Supabase connector/API for database state, functions, migrations, and entitlement logic.
- Google Drive connector for RMS operating records.
- RMS CreatorHub Discord app for RMS-owned Discord automation.
- Discord native Events, roles, channels and permissions where a browser is not required.

Do not open a browser merely to reproduce an action that an existing connector/API can perform safely.

### Tier 2 — Free browser connector

If Opera Browser Connector is available and allowed by the browser:

- Use it for page inspection and navigation.
- Do not require Opera AI page-content access if Browser Connector access is sufficient.
- If Opera blocks the connector by policy/security, do not fight the browser or repeatedly toggle settings.
- Record the connector as unavailable and move to Tier 3.

### Tier 3 — Local headed browser automation

Use a local, no-credit browser automation tool only if it is available in the worker environment, such as Playwright or agent-browser.

Rules:

- Run **headed**, not hidden, for authenticated admin work.
- Use a dedicated persistent RMS browser profile.
- The Founder signs in manually once.
- Never ask for passwords, 2FA codes, recovery codes, or session cookies in chat.
- Never export or copy browser cookies into RMS records.
- Never bypass MFA, CAPTCHA, security warnings, account protections, or browser restrictions.
- Keep the profile local to the workstation.
- Reuse the authenticated local profile only for the approved service.
- Use screenshots/snapshots to verify every destructive or access-changing action before committing it.

Recommended profile labels:
- RMS-CARL
- RMS-DISCORD
- RMS-NETLIFY
- RMS-STRIPE
- RMS-SUPABASE

### Tier 4 — Screenshot-guided manual execution

If no free automation transport can interact with the authenticated page:

1. Worker reads the current RMS source-of-truth configuration.
2. Worker gives the Founder the exact click path and exact value to enter.
3. Founder performs the click/change.
4. Founder sends one screenshot of the resulting page.
5. Worker verifies the result.
6. Worker updates RMS records with only what was actually verified.

This is the default fallback for Carl.gg if browser automation is blocked.

## Carl-bot specific rule

Carl Premium is already an approved subscription. The objective is to use the paid features already owned **without paying for a browser agent to configure them**.

For Carl:

1. Treat `config/carl-premium-automation.json` as the desired-state authority.
2. Keep all current public Discord access and working event flows operational.
3. Apply one Carl module at a time in this order:
   - Premium activation verification
   - moderation/logging safety
   - greetings/onboarding
   - self/reaction roles
   - Levels/XP
   - Sticky Messages
   - voice-role links
   - timed event roles
   - suggestions/starboard
   - temporary channels
   - feeds/notifications
   - Advanced TagScript refinements
4. Never delete a working tag, gate, role, channel, or event flow merely to modernize it.
5. Legacy prefixes remain temporarily for backward compatibility, but all new workflows are slash-first.
6. Never enable auto-purge on support history, moderation evidence, automation alerts, decision logs, official event participation records, rights/submission records, or staff audit records.
7. Never grant authority, paid access, membership, moderator, or staff permissions through XP or voice-presence roles.
8. Do not duplicate Zapier, Tatsu, Ticket Tool, Statbot, VoiceMaster, or RMS CreatorHub responsibilities.
9. After Carl temporary rooms are proven, VoiceMaster may be moved to fallback-only; do not remove it before proof.
10. If a Carl feature asks for a new payment, upgrade, credit pack, or subscription, **skip it and mark it COST BLOCKED**.

## Free replacement for repeat automation

If a recurring Carl workflow can be handled by the existing RMS CreatorHub Discord app instead of repeated browser work, prefer the RMS app.

Use RMS-owned automation for:
- secure CreatorHub routing,
- slash commands,
- event status,
- public-safe RMS intelligence,
- CreatorHub/Marketplace/rights/studio pathways,
- structured automation that needs source control and auditability.

Use Carl for:
- community-facing Discord-native functions already included in the approved plan,
- onboarding,
- reaction/self roles,
- moderation,
- levels,
- sticky messages,
- temporary community roles/rooms,
- starboard,
- suggestions,
- approved Discord-native alerts.

## Browser-authentication failure rule

When authentication fails:

- Stop after the first confirmed login-loop diagnosis.
- Do not start a second metered browser run.
- Do not ask the Founder to paste credentials.
- Do not weaken browser security settings.
- Do not install random extensions or remote-control software.
- Switch to local browser/manual screenshot mode.
- Preserve the working public system.

## Verification standard

A worker may mark a setting as COMPLETE only after one of these exists:

- service API/connector returned success,
- repository change passed regression and was merged,
- dashboard state was visibly verified in an authenticated session,
- Founder supplied a post-change screenshot that matches the desired state.

Otherwise use:
- PENDING,
- BLOCKED,
- COST BLOCKED,
- MANUAL VERIFICATION REQUIRED.

## Public-product protection

No browser-workaround task may:
- break `https://resetinnercircle.com/`,
- invalidate the canonical Discord invite,
- remove working public routes,
- alter Stripe money lanes without explicit authorization,
- weaken CreatorHub security,
- expose private rights/payment/member data,
- make Carl-bot a single point of failure.

## Worker closeout format

Every worker closeout must report:

- **Changed**
- **Verified**
- **Left intact**
- **Pending**
- **Blocked**
- **Cost:** $0.00 unless Founder explicitly approved otherwise
- **Public product:** WORKING / DEGRADED / BLOCKED
- **Next manual click**, if one is actually required

The default target is **$0 incremental operating cost**.
