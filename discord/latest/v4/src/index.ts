import { Client, GatewayIntentBits, Message, PermissionsBitField } from "discord.js"
import { isInvalidContent } from "./util.ts"
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
    return
  }

  let msgMatch = msg.content.slice(PREFIX.length).match(PARSE_MSG_EXP)
  if (msgMatch === null) {
    console.error(`"${msg.content}" didn't match`)
    return
  }
  const command: string = msgMatch[1];
  const args: string[] = msgMatch[2]?.split(/\s+/) ?? []

  handleCommand({ client, msg, command, args })
})

function destroy_success() {
  console.log("Client destroyed")
  process.exit(0)
}
function destroy_failed(err: any) {
  console.error("Failed to destroy the client:", err)
  process.exit(1)
}

process.on("SIGINT", () => {
  console.log("Shutting down...")
  client.destroy()
    .then(destroy_success)
    .catch(destroy_failed)
})


console.log("Logging in...")

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`)
  console.log()
})

client.login(process.env.TOKEN)

