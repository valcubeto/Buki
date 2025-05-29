import { CommandInteraction, SlashCommandBuilder, MessageFlags, Locale } from "discord.js"
import { getCommandDescription, getCommandName, getReply } from "../strings"
import { debug } from "../debugging"
import { globalCommands } from "../index"
import { uploadCommands } from "../load_commands"

const description = getCommandDescription("reload")
export const data = new SlashCommandBuilder()
  .setName("reload")
  .setNameLocalizations(getCommandName("reload"))
  .setDescription(description[Locale.EnglishUS]!)
  .setDescriptionLocalizations(description)

export async function execute(interaction: CommandInteraction) {
  if (interaction.user.id !== Bun.env["OWNER_ID"]) return
  if (interaction.guild === null) {
    interaction.reply("This command can only be used in a server.")
    return
  }
  debug("Reloading slash commands...")
  await uploadCommands(interaction.client.token, interaction.client.user!.id)
  interaction.reply({
    content: getReply("reload_done", interaction.locale),
    flags: MessageFlags.Ephemeral,
  })
}
