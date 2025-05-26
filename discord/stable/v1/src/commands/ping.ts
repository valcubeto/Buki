import { SlashCommandBuilder, CommandInteraction } from "discord.js"
import { getCommandDescription, getReply } from "../strings.ts"

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("default")
    .setDescriptionLocalizations(getCommandDescription("ping")),
  async execute(interaction: CommandInteraction) {
    const start = Date.now()
    const reply = await interaction.reply(getReply("ping_calculating", interaction.locale))
    const end = Date.now()
    const time = end - start
    reply.edit(getReply("ping_took", interaction.locale, [time]))
  }
}
