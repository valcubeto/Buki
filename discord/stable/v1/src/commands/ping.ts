import { SlashCommandBuilder, CommandInteraction, Locale } from "discord.js"

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescriptionLocalizations({
      [Locale.EnglishUS]: "Replies with Pong!",
      [Locale.SpanishES]: "Responde con Pong!",
    }),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Pong!")
  }
}
