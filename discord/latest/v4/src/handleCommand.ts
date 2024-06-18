import { Client, Message } from "discord.js";
import { ping } from "./commands/ping.ts";
import { evaluate } from "./commands/eval.ts";
import { test } from "./commands/test.ts";

export interface Context {
  client: Client,
  msg: Message,
  command: string,
  content: string,
}

const COMMANDS: Record<string, (ctx: Context) => void> = {
  "ping": ping,
  "eval": evaluate,
  "test": test,
}

export function handleCommand(ctx: Context): void {
  COMMANDS[ctx.command]?.(ctx);
}
