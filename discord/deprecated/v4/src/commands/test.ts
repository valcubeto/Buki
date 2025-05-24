import { Context } from "../handleCommand.ts";
import { displayJs } from "../util.ts";

export function test({ msg, command, content }: Context) {
  let args = content.length === 0 ? [] : content.split(/\s+/)
  msg.reply(displayJs({
    command,
    content,
    args,
  }))
}
