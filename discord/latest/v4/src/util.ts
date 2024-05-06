import { EmbedBuilder, User } from "discord.js"
import { PREFIX } from "./constants.ts"

export function isInvalidContent(content: string) {
  return !content.startsWith(PREFIX) || content === PREFIX
}

export function displayJson(json: any): string {
  return `\`\`\`json\n${JSON.stringify(json, null, 2)}\`\`\``
}

export function defaultEmbed(author: User): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5050ff)
    .setAuthor({
      iconURL: author.displayAvatarURL(),
      name: `» requested by ${author.tag}`
    })
}
