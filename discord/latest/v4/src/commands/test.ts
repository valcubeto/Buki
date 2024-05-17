import { Context } from "../handleCommand";
import { displayJs } from "../util";

export function test({ msg, command, content }: Context) {
  let args = content.length === 0 ? [] : content.split(/\s+/)
  msg.reply(displayJs({
    command,
    content,
    args,
  }))
}
