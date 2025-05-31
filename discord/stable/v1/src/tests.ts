import { expect, test } from "bun:test"
import { addOrdinal, formatTimeLong, formatTimeShort } from "./formatting"
import { Commands } from "./commands"
import { getCommandDescription, getReply } from "./strings"
import { Locale } from "discord.js"
import { debug, debugError } from "./debugging"

test("time formatting", () => {
  expect(formatTimeLong(new Date("2023-01-01T12:00:00Z"))).toBe("Sunday, January 1st, 2023. 12:00 PM")
  expect(formatTimeLong(new Date("2025-03-02T14:36:54Z"))).toBe("Sunday, March 2nd, 2025. 02:36 PM")
  expect(formatTimeShort(new Date("2023-01-01T12:00:00Z"))).toBe("01-01-2023 12:00:00")
})

test("load .env file", () => {
  expect(Bun.env.ENV_LOADS).toBe("OK")
})

test("command loading", async () => {
  expect((await new Commands().reload()).get("ping")).toBeDefined()
  expect(getCommandDescription("ping")[Locale.SpanishES]).toBe("Responde con \"Pong!\"")
})

// This won't fail but anyways.
test("add ordinals", () => {
  expect(addOrdinal(1)).toBe("1st")
  expect(addOrdinal(2)).toBe("2nd")
  expect(addOrdinal(3)).toBe("3rd")
  expect(addOrdinal(4)).toBe("4th")
})

test("reply loading and formatting", () => {
  expect(getReply("ping_took", Locale.SpanishES, [100])).toBe("Pong! Tomó 100 ms.")
})

test("debugging", () => {
  debug("This is a debug message")
  debugError("This is an error message")
  // BUG: `bun test` gets the wrong timezone.
  // expect(new Date().getHours()).toBe(16)
})
