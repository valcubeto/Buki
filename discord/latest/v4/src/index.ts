import { Client, GatewayIntentBits, Message } from "discord.js";

const PREFIX: string = ".";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (msg: Message) => {
  if (msg.author.bot) {
    return;
  }

  console.log({ content: msg.content });
});

client.login(process.env.TOKEN);

process.on("SIGINT", () => {
  console.log("Shutting down...");
  client.destroy()
    .then(() => {
      console.log("Client destroyed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Failed to destroy the client:", err);
      process.exit(1);
    });
});
