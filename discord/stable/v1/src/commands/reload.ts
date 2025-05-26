import { REST, Routes, CommandInteraction, SlashCommandBuilder, MessageFlags, type InteractionReplyOptions } from "discord.js"
import { getCommandDescription, getReply } from "../strings.ts"
import { debug } from "../debugging.ts"
import { commands } from "../index.ts"

export default {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("default")
    .setDescriptionLocalizations(getCommandDescription("reload")),
  async execute(interaction: CommandInteraction) {
    if (interaction.user.id !== Bun.env["OWNER_ID"])
    if (interaction.guild === null) {
      interaction.reply("This command can only be used in a server.")
      return
    }
    debug("Reloading slash commands...")
    await reloadCommands(interaction.client.token, interaction.client.user!.id)
    interaction.reply({
      content: getReply("reload_done", interaction.locale),
      flags: MessageFlags.Ephemeral,
    })
  }
}

// TODO: update the `commands` variable if needed
export async function reloadCommands(token: string, clientId: string) {
  const rest = new REST().setToken(token)
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands.map((command) => command.data.toJSON()) }
  )
}
