import { REST, Routes } from 'discord.js';
import { commandData } from './commands.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || !clientId || !guildId) {
  console.error('Missing DISCORD_TOKEN, DISCORD_CLIENT_ID, or DISCORD_GUILD_ID.');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log(`Registering ${commandData.length} RMS commands for guild ${guildId}...`);
  const result = await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commandData },
  );
  console.log(`Registered ${result.length} guild commands.`);
} catch (error) {
  console.error('Discord command registration failed:', error?.message || error);
  process.exitCode = 1;
}
