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

const commandShape = (command) => ({
  name: command.name,
  description: command.description,
  options: command.options || [],
});

const normalized = (commands) => commands
  .map(commandShape)
  .sort((left, right) => left.name.localeCompare(right.name));

try {
  const route = Routes.applicationGuildCommands(clientId, guildId);
  const existing = await rest.get(route);
  if (JSON.stringify(normalized(existing)) === JSON.stringify(normalized(commandData))) {
    console.log(`${commandData.length} RMS guild commands are already current; no Discord write needed.`);
    process.exit(0);
  }

  console.log(`Updating ${commandData.length} RMS commands for guild ${guildId}...`);
  const result = await rest.put(
    route,
    { body: commandData },
  );
  console.log(`Registered ${result.length} guild commands.`);
} catch (error) {
  console.error('Discord command registration failed:', error?.message || error);
  process.exitCode = 1;
}
