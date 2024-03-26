import { Client, GatewayIntentBits, Collection } from "discord.js";
import("dotenv/config");
import fs from "node:fs";
import path from "node:path";

class ExtendedClient extends Client {
  commands: Collection<string, any> = new Collection();
  textCommands: Collection<string, any> = new Collection();
  modals: Collection<string, any> = new Collection();
}

const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// reading in all commands from the commands folder
let foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

//Registers commands
for (const folder of commandFolders) {
  if (!fs.lstatSync(path.join(foldersPath, folder)).isDirectory()) {
    continue;
  }
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// Registers events
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.TOKEN);
