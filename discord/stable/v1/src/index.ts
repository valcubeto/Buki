import { Client, Collection, Events, GatewayIntentBits, PresenceUpdateStatus, type Interaction } from "discord.js"
import { debug, debugError } from "./debugging"
import { loadCommands, uploadCommands } from "./load_commands"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})


client.once(Events.ClientReady, (_client) => {
  debug(`Logged in as ${client.user!.username}. Bot ready.`)
  client.user?.setStatus(PresenceUpdateStatus.Idle)
})

export let globalCommands = await loadCommands()
if (process.argv.includes("--upload")) {
  uploadCommands(Bun.env["BOT_TOKEN"]!, Bun.env["APP_ID"]!)
}

// user id => number representing the time in ms
let cooldown = new Collection<string, number>()
const DEFAULT_COOLDOWN = 2_000

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  // Ensure interaction is CommandInteraction
  if (!interaction.isCommand()) return
  const cd = cooldown.get(interaction.user.id)
  if (cd !== undefined && Date.now() - cd < DEFAULT_COOLDOWN) {
    // Wait until the cooldown is over
    await Bun.sleep(Date.now() - cd)
  }
  cooldown.set(interaction.user.id, Date.now())
  const command = globalCommands.get(interaction.commandName)
  if (command === undefined) {
    debugError(`Received command interaction for unknown command ${interaction.commandName}`)
    return
  }
  command.execute(interaction)
})

// Accept only commands for now
// client.on(Events.MessageCreate, (msg: Message) => {
//   if (msg.author.bot) return
//   debug(`Received message from @${msg.author.username}: ${msg.content}`)
// })

// Sometimes the SIGINT event is emitted multiple times.
process.once("SIGINT", () => {
  // Leave the ^C alone
  console.log('')
  debug("Received SIGINT, closing the connection...")
  client.destroy()
})

client.login(Bun.env["BOT_TOKEN"])
