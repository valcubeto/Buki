import { Client, GatewayIntentBits, Message, PermissionsBitField } from "discord.js"
import { displayJson, isInvalidContent } from "./util.ts"
import { PARSE_MSG_EXP, PREFIX } from "./constants.ts"
import { handleCommand } from "./handleCommand.ts"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})


client.on("messageCreate", async (msg: Message) => {
  if (msg.author.bot || isInvalidContent(msg.content)) {
    return
  }
  if (msg.channel.isDMBased() || msg.guild === null) {
    return
  }

  const clientAsMember = await msg.guild.members.fetchMe();
  const clientPermissions = msg.channel.permissionsFor(clientAsMember)
  if (!clientPermissions.has(PermissionsBitField.Flags.SendMessages)) {
    console.error(`Couldn't send messages to ${JSON.stringify(msg.guild.name)} (${msg.guildId})`)
    return
  }

  let msgMatch = msg.content.slice(PREFIX.length).trimStart().match(PARSE_MSG_EXP)
  if (msgMatch === null) {
    return
  }
  const command: string = msgMatch[1];
  const content: string = msgMatch[2] === undefined ? "" : msgMatch[2].trimStart()

  handleCommand({ client, msg, command, content })
})

function destroy_success() {
  console.info("Client destroyed")
  process.exit(0)
}
function destroy_failed(err: any) {
  console.error("Failed to destroy the client:", err)
  process.exit(1)
}

process.on("SIGINT", () => {
  console.info("Shutting down...")
  client.destroy()
    .then(destroy_success)
    .catch(destroy_failed)
})

console.info("Logging in...")

client.on("ready", () => {
  console.info(`Logged in as ${client.user?.tag}`)
  console.log()
})

client.login(process.env.TOKEN)

