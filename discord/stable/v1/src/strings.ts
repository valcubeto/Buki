import { Locale, type LocalizationMap } from "discord.js"

type LocalizedStringMap = Record<string, LocalizationMap>

const descriptions: LocalizedStringMap = await Bun.file("./strings/command_data/descriptions.json").json()
const names: LocalizedStringMap = await Bun.file("./strings/command_data/names.json").json()
const replies: LocalizedStringMap = await Bun.file("./strings/replies.json").json()

/**
 * Returns the command descriptions. If not defined, returns the English description.
 */
export function getCommandDescription(command: string): LocalizationMap {
  const description = descriptions[command]
  if (description === undefined) {
    throw new Error(`"${command}" needs a description.`)
  }
  const en_us = description[Locale.EnglishUS]
  const en_gb = description[Locale.EnglishGB] ?? en_us
  const es_es = description[Locale.SpanishES] ?? en_us
  const es_latam = description[Locale.SpanishLATAM] ?? es_es ?? en_us
  const ja = description[Locale.Japanese] ?? en_us
  return {
    [Locale.EnglishUS]: en_us,
    [Locale.EnglishGB]: en_gb,
    [Locale.SpanishES]: es_es,
    [Locale.SpanishLATAM]: es_latam,
    [Locale.Japanese]: ja
  }
}

// Command names should be snake_case, so it's a bit difficult to translate them.
// English is the default, so no need to include it in the map.
/**
 * Returns the command names, usually defaulting to English.
*/
export function getCommandName(command: string): LocalizationMap {
  const name = { [Locale.EnglishUS]: command, ...(names[command] ?? {}) }
  const en_us = name[Locale.EnglishUS]!
  const en_gb = name[Locale.EnglishGB] ?? en_us
  const es_es = name[Locale.SpanishES] ?? en_us
  const es_latam = name[Locale.SpanishLATAM] ?? es_es ?? en_us
  const ja = en_us
  return {
    [Locale.EnglishUS]: en_us,
    [Locale.EnglishGB]: en_gb,
    [Locale.SpanishES]: es_es,
    [Locale.SpanishLATAM]: es_latam,
    [Locale.Japanese]: ja
  }
}

export function getReply(replyName: string, locale: Locale, formatting?: any[]): string {
  // The reply must exist.
  const locales: LocalizationMap = replies[replyName]!
  let reply: string = ""
  switch (locale) {
    case Locale.EnglishGB:
      reply = locales[Locale.EnglishGB] ?? locales[Locale.EnglishUS]!
      break
    case Locale.SpanishES:
      reply = locales[Locale.SpanishES] ?? locales[Locale.EnglishUS]!
      break
    case Locale.SpanishLATAM:
      reply = locales[Locale.SpanishLATAM] ?? locales[Locale.SpanishES] ?? locales[Locale.EnglishUS]!
      break
    case Locale.Japanese:
      reply = locales[Locale.Japanese] ?? locales[Locale.EnglishUS]!
      break
    default:
      reply = locales[Locale.EnglishUS]!
  }
  if (formatting !== undefined) {
    for (const format of formatting) {
      reply = reply.replace("{}", format)
    }
  }
  if (reply === undefined) {
    throw new Error("Are you for real?")
  }
  return reply
}
