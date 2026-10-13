# RMS Studio Help web entry

Angelea McCullough, Founder of RMS Global Publishing.

## Report
The Founder entered https://resetinnercircle.com/helpstudio after receiving a Discord slash-command instruction and encountered Netlify's generic 404. The command itself and the new shared assistance backend were different interfaces; there was no matching website route.

## Fix and boundaries
- /helpstudio serves site/helpstudio.html via an exact 200 rewrite; /help redirects to that entry with 302. Trailing-slash behavior is verified on Netlify, not inferred from the local fixture.
- The public guide distinguishes a web URL from an in-Discord command. It provides the verified Sound Stage deep link, the Founder-specified general invite, optional clipboard copy with manual fallback, audio troubleshooting, scope-first service routes and links to authenticated CreatorHub assistance/support.
- Native details and all primary links remain usable with JavaScript disabled. Copy is the only enhancement; no account reads, state mutations, payment calls, telemetry, autoplay, unsolicited messages, credential input or identity merging.
- Help is visible in homepage navigation and the mobile-visible hero, and linked from booking. /support remains the existing voluntary financial-support lane; customer assistance links use CreatorHub /creator/support instead.
- site/404.html is Netlify's custom missing-page response. Unknown paths must remain HTTP 404, never a catch-all homepage 200. It contains working help/home/Discord routes, noindex metadata, and no reflection of untrusted URL input.
- Existing payment functions, memberships, APIs, Discord event handlers, backend permissions and XP behavior are unchanged. This does not repair physical audio, certify a paid export or prove a signed-in Discord interaction.

## Verification
Run existing contracts plus tests/reset-help-routing.test.mjs. Run tests/reset-help-browser.mjs with the existing RMS_CREATOR_QA_RUNTIME containing Playwright. With no RMS_HELP_BASE_URL it serves a local CSP-constrained fixture; set RMS_HELP_BASE_URL to the exact Netlify preview/production origin for real deployment acceptance. RMS_HELP_EVIDENCE sets the report/screenshot directory.

The browser suite asserts real 320/390/768/1365 widths, no horizontal/control overflow, native help expansion, command-copy success and denial fallback, no public-page POST requests, correct deep links, direct/trailing/query-safe routes, no open redirect from query input, 404 recovery, existing mix-selection continuity, and JavaScript-disabled navigation. Independently verify public/private destination availability and the original homepage, booking, membership and existing API boundaries after release. Do not mistake fixture route acceptance for Netlify deployment proof.

## Rollback
Revert this web-entry commit using the existing Git deployment workflow. No database or payment rollback is needed. Do not delete member state or undo the shared-assistance release.
