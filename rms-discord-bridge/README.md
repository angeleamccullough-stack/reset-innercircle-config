# RMS CreatorHub Discord Bridge

Isolated Discord runtime for the Reset Inner Circle community layer of the RMS Global Publishing ecosystem.

## Why this service is isolated

The RMS Creator Portal production app is not modified by this bridge. The Discord runtime is intentionally separated so Discord SDK upgrades, bot restarts, event outages, or community automation failures cannot break CreatorHub production.

## Dependency

- Node.js 20+
- `discord.js` 14.27.0

The bot uses only the `Guilds` gateway intent. Message Content, Presence, and Server Members privileged intents are not required for the baseline command system.

## Command surface

- `/portal`
- `/submit`
- `/marketplace`
- `/sync`
- `/rights`
- `/events`
- `/missions`
- `/support`

Guild command registration is intentionally scoped to Reset Inner Circle for immediate, controlled updates.

## Security boundary

CreatorHub remains the system of record for private rights, metadata, submissions, contracts, payments, and professional status. Discord receives public-safe routing and community information only.

Never commit or post the Discord token. Configure runtime secrets only through the deployment environment.

## Setup

1. Copy `.env.example` into the hosting provider's environment variable configuration.
2. Set `DISCORD_TOKEN` from the RMS CreatorHub bot application.
3. Confirm `DISCORD_CLIENT_ID=1540169303213609023`.
4. Confirm `DISCORD_GUILD_ID=1429398855681573038`.
5. Fill the support, events, missions, and private automation-alert channel IDs.
6. Install dependencies with `npm install`.
7. Run `npm run check`.
8. Run `npm run register:commands` once after command changes.
9. Run `npm start` under a supervised long-running Node process.
10. Verify `GET /health` returns HTTP 200 before announcing availability.

## Discord permissions

Grant only what this runtime needs:

- View Channels
- Send Messages
- Embed Links
- Read Message History
- Use Application Commands

Do not grant Administrator, Manage Server, Manage Channels, Manage Webhooks, Kick Members, Ban Members, or Manage Messages for the baseline runtime.

Carl-bot remains responsible for admission, self roles, reaction roles, moderation, and event entry controls.

## Production media interoperability

OBS Studio, Elgato Wave Link, and Camera Hub are local production applications. This bot does not attempt to control those applications remotely. Discord live rooms should remain usable whether or not the custom RMS bot is online.

Use the companion `config/rms-live-production-profile.json` as the baseline routing standard for production workstations.

## Health and fallback

If this bridge fails, Discord native Events, Carl-bot, and manual RMS operations must remain available. Operational failures should route privately to `automation-alerts` when configured.
