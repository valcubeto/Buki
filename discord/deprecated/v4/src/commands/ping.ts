import { EmbedBuilder, Message } from "discord.js";
import { Context } from "../handleCommand.ts";
import { defaultEmbed } from "../util.ts";

export function ping({ msg }: Context) {
  const embed: EmbedBuilder = defaultEmbed(msg.author)
    .setColor(0xff_ff_ff)
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
  sendTask.catch(console.error)
}

type Rgb = [r: number, g: number, b: number]

const MIN_PING: number = 300
const MAX_PING: number = 1000

// Type needed to match ColorResolvable
export function getColorBasedOnNumber(input: number): Rgb {
  // 350
  const middle: number = (MAX_PING + MIN_PING) / 2 - MIN_PING
  
  // 0 - 700
  let normal = Math.max(MIN_PING, Math.min(input, MAX_PING)) - MIN_PING

  let upper = (Math.max(middle, normal) - middle)
  // 0 - 350
  let lower = Math.min(normal, middle)

  // console.log({ input, normal, upper, lower })
  let r = upper / middle * 255
  let g = 255 - lower / middle * 255

  return [r, g, 128];
}
