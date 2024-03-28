import { Events, Message } from "discord.js";
import { prisma } from "../utilities/db";

const name = Events.MessageUpdate;

const execute = async (oldMessage: Message, newMessage: Message) => {
    if (oldMessage.content === newMessage.content) return;
    if (!(oldMessage.guild && newMessage.guild)) return;
    if (oldMessage.channel.isDMBased() || newMessage.channel.isDMBased())
        return;

    try {
        await prisma.guild.upsert({
            where: {
                id: oldMessage.guild.id,
            },
            create: {
                id: oldMessage.guild.id,
            },
            update: {},
        });
        const guild = await prisma.guild.findUnique({
            where: {
                id: oldMessage.guild.id,
            },
        });
        if (!guild || !guild.logging) return;

        await prisma.message.upsert({
            where: { id: oldMessage.id },
            update: { content: newMessage.content },
            create: {
                id: newMessage.id,
                channel: newMessage.channel.id,
                user: {
                    connectOrCreate: {
                        where: { id: newMessage.author.id },
                        create: {
                            id: newMessage.author.id,
                            username: newMessage.author.username,
                        },
                    },
                },
                guild: {
                    connectOrCreate: {
                        where: { id: newMessage.guild.id },
                        create: {
                            id: newMessage.guild.id,
                        },
                    },
                },
                content: newMessage.content,
                timestamp: new Date(oldMessage.createdTimestamp),
            },
        });
    } catch (err) {
        console.error(
            `Failed to update message:
            ID: ${newMessage.id}
            Author: ${newMessage.author.username} | ${newMessage.author.id}
            Guild: ${newMessage.guild.name} | ${newMessage.guild.id}
            Channel: ${newMessage.channel.name} | ${newMessage.channel.id}
            Link: ${newMessage.url}
            Content: ${newMessage.content}\n-------------------------------\n`,
            err
        );
    }
};

export { name, execute };
