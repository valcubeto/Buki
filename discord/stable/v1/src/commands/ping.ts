import { SlashCommandBuilder, CommandInteraction, Locale } from "discord.js"
import { getCommandDescription, getReply } from "../strings"

const description = getCommandDescription("ping")
export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription(description[Locale.EnglishUS]!)
  .setDescriptionLocalizations(description)

export async function execute(interaction: CommandInteraction) {
  const start = Date.now()
  const reply = await interaction.reply(getReply("ping_calculating", interaction.locale))
  const end = Date.now()
  const time = end - start
  reply.edit(getReply("ping_took", interaction.locale, [time]))
}
