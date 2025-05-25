import { Client, Collection, Events, GatewayIntentBits, PresenceUpdateStatus } from "discord.js"
import { debug } from "./debugging"
import { readdirSync as readDirSync } from "fs"
import { loadCommands } from "./load_commands"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})

const commands = await loadCommands()

client.once(Events.ClientReady, (_client) => {
  debug(`Logged in as ${client.user!.username}. Bot ready.`)
  client.user?.setStatus(PresenceUpdateStatus.Idle)
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

client.login(Bun.env.BOT_TOKEN)
