import { Events, Message } from "discord.js";
import { prisma } from "../utilities/db";

const name = Events.MessageCreate;

const execute = async (message: Message) => {
    if (!message.guild) return;
    try {
        await prisma.guild.upsert({
            where: {
                id: message.guild.id,
            },
            create: {
                id: message.guild.id,
            },
            update: {},
        });
        const guild = await prisma.guild.findUnique({
            where: {
                id: message.guild.id,
            },
        });

        if (!guild?.logging || message.content === "") {
            return;
        }

        await prisma.message.create({
            data: {
                id: message.id,
                channel: message.channel.id,
                user: {
                    connectOrCreate: {
                        where: { id: message.author.id },
                        create: {
                            id: message.author.id,
                            username: message.author.username,
                            bot: message.author.bot,
                        },
                    },
                },
                guild: {
                    connectOrCreate: {
                        where: { id: message.guild.id },
                        create: {
                            id: message.guild.id,
                        },
                    },
                },
                content: message.content,
                timestamp: new Date(message.createdTimestamp),
            },
        });
    } catch (err) {
        console.error("An error has occurred:\n", err);
    }
};

export { name, execute };
