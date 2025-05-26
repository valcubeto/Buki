import { SlashCommandBuilder, CommandInteraction, Collection } from "discord.js"
import { readdirSync as readDirSync } from "fs"

interface ExportedCommand {
  default: {
    data: SlashCommandBuilder
    execute: (interaction: CommandInteraction) => Promise<void>
  }
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
