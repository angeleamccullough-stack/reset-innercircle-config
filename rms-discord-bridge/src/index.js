import http from 'node:http';
import {
  Client,
  Events,
  GatewayIntentBits,
} from 'discord.js';
import { buildCommandResponse } from './commands.js';

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
const alertsChannelId = process.env.AUTOMATION_ALERTS_CHANNEL_ID;
const port = Number(process.env.PORT || 3000);

if (!token || !guildId) {
  console.error('Missing DISCORD_TOKEN or DISCORD_GUILD_ID.');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

async function sendPrivateOperationalAlert(message) {
  if (!alertsChannelId) return;
  try {
    const channel = await client.channels.fetch(alertsChannelId);
    if (channel?.isTextBased()) {
      await channel.send({
        content: `RMS automation alert: ${String(message).slice(0, 1500)}`,
        allowedMentions: { parse: [] },
      });
    }
  } catch (error) {
    console.error('Unable to deliver automation alert:', error?.message || error);
  }
}

client.once(Events.ClientReady, (readyClient) => {
  console.log(`RMS CreatorHub Discord bridge ready as ${readyClient.user.tag}.`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.guildId !== guildId) {
    await interaction.reply({ content: 'This RMS command is available only inside Reset Inner Circle.', ephemeral: true });
    return;
  }

  try {
    const response = buildCommandResponse(interaction.commandName);
    await interaction.reply({
      ...response,
      allowedMentions: { parse: [] },
    });
  } catch (error) {
    console.error(`Command ${interaction.commandName} failed:`, error?.message || error);
    await sendPrivateOperationalAlert(`Command /${interaction.commandName} failed.`);
    const failure = { content: 'That RMS command could not complete. Please use the support route while the automation is checked.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(failure).catch(() => undefined);
    } else {
      await interaction.reply(failure).catch(() => undefined);
    }
  }
});

client.on(Events.Error, async (error) => {
  console.error('Discord client error:', error?.message || error);
  await sendPrivateOperationalAlert('Discord client error detected. Manual RMS fallback remains available.');
});

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    const ready = client.isReady();
    res.writeHead(ready ? 200 : 503, { 'content-type': 'application/json' });
    res.end(JSON.stringify({
      service: 'rms-discord-bridge',
      status: ready ? 'ready' : 'starting',
      guild: guildId,
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(port, () => {
  console.log(`Health endpoint listening on port ${port}.`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down RMS Discord bridge.`);
  server.close();
  client.destroy();
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

client.login(token).catch(async (error) => {
  console.error('Discord login failed:', error?.message || error);
  await sendPrivateOperationalAlert('Discord login failed.');
  process.exit(1);
});
