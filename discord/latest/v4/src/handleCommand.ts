import { Client, Message } from "discord.js";
import { ping } from "./commands/ping.ts";
import { evaluate } from "./commands/eval.ts";

export interface Context {
  client: Client,
  msg: Message,
  command: string,
  args: string,
}

const commands: Record<string, (ctx: Context) => void> = {
  "ping": ping,
  "eval": evaluate
}

export function handleCommand(ctx: Context) {
  commands[ctx.command]?.(ctx)
}
