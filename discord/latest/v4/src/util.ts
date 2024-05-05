import { PREFIX } from "./constants.ts"

export function isInvalidContent(content: string) {
  return !content.startsWith(PREFIX) || content === PREFIX
}

export function displayJson(json: any): string {
  return `\`\`\`json\n${JSON.stringify(json, null, 2)}\`\`\``
}
