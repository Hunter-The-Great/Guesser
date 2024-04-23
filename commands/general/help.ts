import {
    SlashCommandBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
} from "discord.js";

const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Displays help information.")
    .setDMPermission(false)
    .setNSFW(false);

const execute = async (interaction: ChatInputCommandInteraction) => {
    const helpMenu = new EmbedBuilder()
        .setColor(0x00ffff)
        .setTitle("**Commands**:")
        .setThumbnail(process.env.AVATAR || null)
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
        })
        .addFields({
            name: "__**Game**__",
            value: "**guessing-game**: Starts the game.",
            inline: true,
        })
        .addFields({
            name: "__**General**__",
            value: `**help**: Shows this menu.\n\n
                    **feedback**: Provides feedback to the author of the bot.`,
            inline: true,
        })
        .addFields({
            name: "__**Utility**__",
            value: `**channel**: Manages the channels used for the game.\n*(Only applicable with logging disabled)*\n\n
                    **logging**: Toggles message logging on/off.\n*(Off by default)*\n\n
                    **log-messages**: Logs all messages in the server.\n*(Use this sparingly, it takes a long time)*`,
            inline: true,
        });

    await interaction.reply({ embeds: [helpMenu] });
};

const category = "general";

export { data, category, execute };
