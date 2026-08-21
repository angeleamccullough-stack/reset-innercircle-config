# RMS Discord Automation Ownership Standard

**Owner:** Angelea McCullough, Founder of RMS Global Publishing  
**Parent system:** RMS Fully Automated Intelligence System  
**Status:** Active

## Purpose

Reset Inner Circle Discord is the live community and activation node of the RMS ecosystem. It is not the authoritative store for creator rights, contracts, payments, unreleased masters, confidential metadata, or professional status. CreatorHub remains the secure system of record for those functions.

## Automation ownership

| System | Primary responsibility |
| --- | --- |
| RMS CreatorHub Discord App | RMS-specific slash commands, CreatorHub routing, public-safe RMS intelligence events, Marketplace/opportunity routing, RMS event status |
| Carl-bot | Code of Law gate, CHOOSE YOUR SIGNALS, self roles, static embeds/tags, moderation, event entry controls |
| Zapier | Calendar/Sheet triggers, announcements, reminders, live-now signals, recaps, cross-platform routing, private failure alerts |
| Tatsu | Verified participation and positive community recognition |
| Ticket Tool | Private support and escalation |
| VoiceMaster | Temporary collaboration rooms |
| Statbot | Community analytics and server-health reporting |

No two systems should own the same routine notification. Routine `@everyone` pings are prohibited.

## Approved notification roles

- Live Events
- OmniLink Power Hour
- RESET Arena Games
- Platform Missions
- Creator Education
- Collaboration Calls

These roles are notification-only and must grant no elevated server permissions.

## RMS CreatorHub command surface

Target command set:

- `/portal` — CreatorHub and creator onboarding routing
- `/submit` — secure submission routing; never collect unreleased masters or private rights data in Discord
- `/marketplace` — RMS Marketplace routing
- `/sync` — licensing-readiness and Global Sync Catalog guidance; never promise placement
- `/rights` — Rights & Metadata Intelligence education and secure routing
- `/events` — RESET LIVE programming
- `/missions` — current Platform Missions
- `/support` — private support routing

## Public-safe RMS event contract

Approved event types:

- `rms.event.created`
- `rms.event.live`
- `rms.event.completed`
- `rms.mission.published`
- `rms.marketplace.public_listing`
- `rms.creator_showcase.approved`
- `rms.education.published`
- `rms.collaboration_call.published`
- `rms.sync_opportunity.public`
- `rms.system.alert`

Every event must carry a stable `correlation_id`. Consumers must suppress a repeat correlation ID to prevent duplicate posts and pings.

Public-safe fields are limited to event ID/type, title, public description/URL, Discord destination, notification role, schedule/status, approved image URL, correlation ID, and source system.

## Privacy boundary

Never publish or log in public Discord:

- passwords or authentication secrets
- banking/payment information
- government identification
- private contracts
- unreleased masters
- confidential rights splits or metadata
- private CreatorHub records
- OAuth, bot, Supabase, or Zapier credentials

Rights, contracts, submissions, payments, private metadata, and professional approval remain inside approved RMS secure systems.

## Event flow

Approved RMS event source → Zapier/RMS automation → Discord event/announcement → opt-in notification role → event calendar → reminder → live-now → event recap → operational analytics.

Carl-bot must not duplicate Zapier timing notifications. Discord native Events provide RSVP/calendar visibility. Tatsu provides recognition only.

## Recognition standard

Tatsu recognition may reflect verified event completion, helpful creator feedback, completed collaborations, community support, event leadership, and completed Platform Missions.

Raw message volume must not be treated as meaningful achievement. Tatsu status must never imply RMS representation, publishing approval, licensing readiness, sync approval, Marketplace acceptance, or contract eligibility.

## Resilience

- Carl-bot failure: Discord Events and manual RMS operations remain available.
- Zapier failure: send one private alert to `automation-alerts`; use the manual event fallback and do not repeatedly retry public messages.
- Tatsu failure: record recognition manually.
- Failure of one automation provider must never make Reset Inner Circle unusable.

## Brand standard

Public presentation uses near-black, warm ivory, restrained rich gold, concise mobile-safe names, minimal emoji clutter, and premium ownership-first language. Music remains one creator pathway inside a multidisciplinary creator campus.

Permanent public metadata should identify **Angelea McCullough, Founder of RMS Global Publishing** where attribution is appropriate.

## Operating loop

**Signal → Activate → Participate → Verify → Recognize → Measure → Improve**
