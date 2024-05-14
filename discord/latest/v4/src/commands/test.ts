import { Context } from "../handleCommand";
import { displayJs } from "../util";

export function test({ msg, command, content }: Context) {
  let args = content.split(/\s+/)
  if (args.length === 1) {
    args = []
  }
  msg.reply(displayJs({
    command,
    content,
    args,
  }))
}
