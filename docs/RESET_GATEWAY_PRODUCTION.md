# Reset Inner Circle Gateway — Production Contract

Owner: Angelea McCullough, Founder of RMS Global Publishing

## Canonical production
- Public gateway: https://resetinnercircle.com/
- Netlify project: resetinnercircle
- Git authority: angeleamccullough-stack/reset-innercircle-config
- Deploy branch: main
- Publish directory: site
- Functions directory: netlify/functions

## Brand
Reset Society | Be You On Purpose
Luxe near-black / warm-gold visual system. The gateway is intentionally cinematic, lightweight, responsive and accessible.

## Experience lanes
- Reset Inner Circle community entry through Discord
- Reset Media Virtual Studio™ remote production and paid service inquiry
- Voluntary Support Reset Society checkout through Stripe when configured
- Public-safe normalized intelligence events to RMS/AOS

## Security and provider boundaries
- Reset communications remain Zoho + Netlify.
- RMS human/company mail remains Google Workspace.
- RMS transactional/system mail remains Resend.
- Do not expose RMS Resend credentials to Netlify, Zoho or browser code.
- Netlify intelligence relay keeps ingress credentials server-side only.
- Public browser events contain only allowlisted, non-sensitive metadata.
- Discord private conversations, credentials, protected creator data, payment records and private rights data do not flow through the public gateway.
- Support checkout fails closed until an approved Stripe-hosted support URL is configured.

## Intelligence event priority
Revenue and qualified action are more meaningful than passive engagement. Current gateway events include entry clicks, studio interest/service inquiry and support checkout initiation. Opens/views are contextual signals only, not purchase intent.

## Production philosophy
Keep the gateway fast and dependency-light. Prefer native HTML/CSS/JavaScript and Netlify Functions unless a stronger framework is demonstrably necessary. Enhancements must preserve the existing Discord, OBS, Wave Link, CreatorHub and AOS boundaries rather than creating duplicate systems of record.
