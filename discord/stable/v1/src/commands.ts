import { SlashCommandBuilder, CommandInteraction, Collection, REST, Routes } from "discord.js"
import { readdirSync as readDirSync } from "fs"

interface Command {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<void>
}

export class Commands {
  private _commands: Collection<string, Command> | null = null
  constructor() {}
  /**
   * Reloads the command data.
   **/
  async reload(): Promise<Commands> {
    const commands = new Collection<string, Command>()
    for (const file of readDirSync("./src/commands")) {
      const command: Command = await import(`./commands/${file}`)
      commands.set(command.data.name, command)
    }
    this._commands = commands
    return this
  }

  get(name: string): Command | undefined {
    return this._commands!.get(name)
  }
  set(name: string, command: Command): void {
    void this._commands!.set(name, command)
  }

  // I'm not writing that type
  /**
   * Returns the commands as an array of JSON objects.
   **/
  toJSON(): any[] {
    return this._commands!.map((command, _key) => command.data.toJSON())
  }

  /**
   * Uploads the commands to the Discord API.
   **/
  async uploadAll(token: string, clientId: string) {
    const rest = new REST().setToken(token)
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: this.toJSON() }
    )
  }
}
