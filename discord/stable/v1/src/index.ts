import { Client, Events, GatewayIntentBits } from "discord.js"
import { debug } from "./debugging"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
})

client.once(Events.ClientReady, (_client) => {
  debug(`Logged in as ${client.user!.tag}!`)
})

client.login(Bun.env.BOT_TOKEN)
