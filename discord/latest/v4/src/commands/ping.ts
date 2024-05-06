import { EmbedBuilder, Message } from "discord.js";
import { Context } from "../handleCommand.ts";
import { defaultEmbed } from "../util.ts";

export function ping({ msg }: Context) {
  const embed: EmbedBuilder = defaultEmbed(msg.author)
    .setTitle("Ping")
    .setDescription("Calculating ping...")

  const sendTask: Promise<Message> = msg.channel
    .send({ embeds: [embed,] })

  const start = Date.now()

  sendTask.then((sentMsg: Message) => {
    const elapsed: number = Date.now() - start
    embed
      .setTitle("Pong")
      .setDescription(`Ping: ~${elapsed} ms`)
      .setColor(getColorBasedOnNumber(elapsed))

    sentMsg.edit({ embeds: [embed,] })
  })

  // What should I do?
  sendTask.catch((_err) => {})
}

type Rgb = [r: number, g: number, b: number]

const MIN_PING: number = 300
const MAX_PING: number = 1000
const MIDDLE: number = (MAX_PING + MIN_PING) / 2 + MIN_PING

// Type needed to match ColorResolvable
function getColorBasedOnNumber(input: number): Rgb {
  // 0 - 700
  let normalized = Math.max(MIN_PING, Math.min(input, MAX_PING)) - MIN_PING
  // 350
  let mid = MIDDLE - MIN_PING

  let r = 
  let b = 

  return [r, g, 0];
}
