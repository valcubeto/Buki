import { Client, Message } from "discord.js";
import { ping } from "./commands/ping.ts";

export interface Context {
  client: Client,
  msg: Message,
  command: string,
  args: string[],
}

const commands: Record<string, (ctx: Context) => void> = {
  "ping": ping,
}

export function handleCommand(ctx: Context) {
  commands[ctx.command]?.(ctx)
}
