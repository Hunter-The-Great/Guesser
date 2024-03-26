import { Client, Events } from "discord.js";

const name = Events.ClientReady;

const once = true;

const execute = async (client: Client) => {
    console.log(`Logged in as ${client.user!.tag}`);
};

export { name, once, execute };
