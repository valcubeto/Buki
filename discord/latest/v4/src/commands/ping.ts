import { Message } from "discord.js";
import { Context } from "../handleCommand.ts";

export function ping({ msg }: Context) {
  let sendTask: Promise<Message> = msg.channel.send("Calculating ping...")

  let start = Date.now()
  sendTask.then((sentMsg: Message) => {
    let elapsed: number = Date.now() - start
    sentMsg.edit(`Ping: ~${elapsed} ms`)
  })

  // What should I do?
  sendTask.catch((_err) => {})
}
