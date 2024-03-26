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
            name: "__**IDK**__",
            value: "**IDK**: Something here.",
            inline: true,
        })
        .setFooter({
            text: "idk",
            iconURL: process.env.AVATAR,
        });

    await interaction.reply({ embeds: [helpMenu] });
};

const category = "general";

export { data, category, execute };
