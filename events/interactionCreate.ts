import { Events, Interaction } from "discord.js";
import { sentry } from "../utilities/sentry";
import { prisma } from "../utilities/db";
import { posthog } from "../utilities/posthog";

const name = Events.InteractionCreate;

const execute = async (interaction: Interaction) => {
    if (!interaction) {
        console.log("interaction is undefined");
        return;
    }
    await prisma.user.upsert({
        where: {
            id: interaction.user.id,
        },
        create: {
            id: interaction.user.id,
            username: interaction.user.username,
            bot: interaction.user.bot,
        },
        update: {},
    });
    if (interaction.user.bot) {
        return;
    }
    if (interaction.isChatInputCommand()) {
        try {
            //@ts-ignore
            const command = interaction.client.commands.get(
                interaction.commandName
            );
            if (!command) {
                throw new Error(
                    `Command "${interaction.commandName}" not found`
                );
            }
            await command.execute(interaction);
        } catch (err) {
            sentry.captureException(err);
            console.error("An error has occurred:\n", err);
            try {
                if (interaction.isRepliable()) {
                    if (interaction.replied || interaction.deferred) {
                        await interaction.editReply(
                            "An error has occured, please try again later."
                        );
                    } else {
                        await interaction.reply(
                            "An error has occured, please try again later."
                        );
                    }
                }
            } catch (err1) {
                console.log("\nA message could not be sent");
                // Maybe log this with sentry?
                return;
            }
        }
        try {
            posthog.capture({
                event: "guesser-command",
                distinctId: interaction.user.id,
                properties: {
                    user: interaction.user.username,
                    guild: interaction.guild?.name,
                    name: interaction.commandName,
                    //@ts-ignore
                    subcommand: interaction.options._subcommand,
                    //@ts-ignore
                    options: interaction.options._hoistedOptions,
                },
            });
        } catch (err) {
            console.error("Posthog Error:\n", err);
            sentry.captureException(err);
        }
    } else if (interaction.isModalSubmit()) {
        try {
            //@ts-ignore
            const modal = interaction.client.modals.get(interaction.customId);
            await modal.execute(interaction);
        } catch (err) {
            console.error("An error has occurred:\n", err);
            sentry.captureException(err);
        }
    } else {
        return;
    }
};

export { name, execute };
