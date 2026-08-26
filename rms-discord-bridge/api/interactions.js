import { verifyKey } from 'discord-interactions';
import { buildCommandResponse } from '../src/commands.js';

const PING = 1;
const APPLICATION_COMMAND = 2;
const CHANNEL_MESSAGE_WITH_SOURCE = 4;
const EPHEMERAL_FLAG = 1 << 6;

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return sendJson(res, 200, {
      ok: true,
      service: 'RMS CreatorHub Discord Bridge',
      mode: 'discord-http-interactions',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { error: 'Method not allowed' });
  }

  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!publicKey) {
    console.error('DISCORD_PUBLIC_KEY is not configured.');
    return sendJson(res, 500, { error: 'Discord verification is not configured.' });
  }

  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  if (!signature || !timestamp) {
    return sendJson(res, 401, { error: 'Missing Discord signature headers.' });
  }

  const rawBody = await readRawBody(req);
  const valid = await verifyKey(rawBody, signature, timestamp, publicKey);
  if (!valid) {
    return sendJson(res, 401, { error: 'Invalid request signature.' });
  }

  let interaction;
  try {
    interaction = JSON.parse(rawBody);
  } catch {
    return sendJson(res, 400, { error: 'Invalid JSON payload.' });
  }

  if (interaction.type === PING) {
    return sendJson(res, 200, { type: PING });
  }

  if (interaction.type !== APPLICATION_COMMAND) {
    return sendJson(res, 200, {
      type: CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'This RMS interaction is not supported.',
        flags: EPHEMERAL_FLAG,
      },
    });
  }

  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) {
    console.error('DISCORD_GUILD_ID is not configured.');
    return sendJson(res, 500, { error: 'Discord guild verification is not configured.' });
  }
  if (interaction.guild_id !== guildId) {
    return sendJson(res, 200, {
      type: CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'This RMS command is available only inside Reset Inner Circle.',
        flags: EPHEMERAL_FLAG,
      },
    });
  }

  const commandName = interaction.data?.name;
  const commandResponse = buildCommandResponse(commandName);
  const data = {};

  if (commandResponse.content) data.content = commandResponse.content;
  if (commandResponse.embeds) data.embeds = commandResponse.embeds;
  if (commandResponse.ephemeral) data.flags = EPHEMERAL_FLAG;

  return sendJson(res, 200, {
    type: CHANNEL_MESSAGE_WITH_SOURCE,
    data,
  });
}
