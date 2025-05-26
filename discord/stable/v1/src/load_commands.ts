import { SlashCommandBuilder, CommandInteraction, Collection, REST, Routes } from "discord.js"
import { readdirSync as readDirSync } from "fs"

interface Command {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}

interface ExportedCommand {
  default: Command
}

/**
 * Reads the commands folder and loads them.
 */
export async function loadCommands(): Promise<Collection<string, ExportedCommand["default"]>> {
  const commands = new Collection<string, ExportedCommand["default"]>()
  for (const file of readDirSync("./src/commands")) {
    const command: ExportedCommand = await import(`./commands/${file}`)
    commands.set(command.default.data.name, command.default)
  }
  return commands
}

/**
 * Uploads the commands to the Discord API.
 */
export async function uploadCommands(token: string, clientId: string) {
  const rest = new REST().setToken(token)
  const commands = await loadCommands()
  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands.map((command) => command.data.toJSON()) }
  )
}
