import { expect, test } from "bun:test"
import { formatTimeLong, formatTimeShort } from "./formatting.ts"
import { loadCommands } from "./load_commands.ts"

test("time formatting", () => {
  expect(formatTimeLong(new Date("2023-01-01T12:00:00Z"))).toBe("Sunday, January 1st, 2023. 12:00 PM")
  expect(formatTimeLong(new Date("2025-03-02T14:36:54Z"))).toBe("Sunday, March 2nd, 2025. 02:36 PM")
  expect(formatTimeShort(new Date("2023-01-01T12:00:00Z"))).toBe("01-01-2023 12:00:00")
})

test("env variables", () => {
  expect(Bun.env.ENV_LOADS).toBe("OK")
})

test("command loading", async () => {
  console.log(await loadCommands())
})
