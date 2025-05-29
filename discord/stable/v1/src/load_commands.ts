import { SlashCommandBuilder, CommandInteraction, Collection, REST, Routes } from "discord.js"
import { readdirSync as readDirSync } from "fs"

interface Command {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}

/**
 * Reads the commands folder and loads them.
 */
export async function loadCommands(): Promise<Collection<string, Command>> {
  const commands = new Collection<string, Command>()
  for (const file of readDirSync("./src/commands")) {
    const command: Command = await import(`./commands/${file}`)
    commands.set(command.data.name, command)
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
