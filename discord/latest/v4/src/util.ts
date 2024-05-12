import { EmbedBuilder, User } from "discord.js"
import { PREFIX } from "./constants.ts"

export function isInvalidContent(content: string) {
  return !content.startsWith(PREFIX) || content === PREFIX
}

export function displayJson(json: any): string {
  return `\`\`\`json\n${JSON.stringify(json, null, 2)}\`\`\``
}
let letters = []
function displayFunction(func: Function): string {
  const patt = /^(?:function\s*(?:\w+\s*)?)?\(\s*(?:(\{)|(\[))?((?:\s*\w(?:\s*,)?)*)\s*(?:\}\s*|\]\s*)?\s*\)/
  let argsMatch = func.toString().match(patt)
  if (argsMatch === null) {
    return "/* not displayable */"
  }
  function rejoin(args: string): string {
    return args.split(",").map(arg => arg.trim()).join(", ")
  }
  if (argsMatch[1] !== undefined) {
    return `fun ${func.name}({ ${rejoin(argsMatch[3])} })`
  }
  if (argsMatch[2]!== undefined) {
    return `fun ${func.name}([${rejoin(argsMatch[3])}])`
  }
  return `fun ${func.name}(${rejoin(argsMatch[3])})`
}

function _displayJs(data: any, indent: number): string {
  if (["number", "boolean"].includes(typeof data)) {
    return `${data}`
  }
  if (typeof data === "string") {
    return JSON.stringify(data)
  }
  if (typeof data === "bigint") {
    return `BigInt(${data})`
  }
  if (typeof data === "function") {
    return displayFunction(data)
  }
  if (typeof data === "undefined") {
    if (data !== undefined) {
      return "/* not displayable */"
    }
    return "undefined"
  }
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      let props = Object.getOwnPropertyNames(data)
      let acc: string[] = ["["]
      for (const prop of props) {
        let value = data[prop]
        if (value === data) {
          continue
        }
        if (typeof value === "function" && value.name === prop) {
          acc.push(`fun ${value.name}(${letters.slice(0, value.length).join(", ")})`)
          continue
        }
        acc.push(`${JSON.stringify(prop)} => ${_displayJs(value, indent + 2)}`)
      }
      let mid = acc.join(`\n${" ".repeat(indent + 2)}`)
      return `${mid}${" ".repeat(indent)}\n${" ".repeat(indent)}]`
    }
    if (data === null) {
      return "null"
    }
    let props = Object.getOwnPropertyNames(data)
    let acc: string[] = ["{"]
    for (const prop of props) {
      let value = data[prop]
      if (value === data) {
        continue
      }
      if (typeof value === "function" && value.name === prop) {
        acc.push(`fun ${value.name}(${letters.slice(0, value.length).join(", ")})`)
        continue
      }
      acc.push(`${JSON.stringify(prop)} => ${_displayJs(value, indent + 2)}`)
    }
    let mid = acc.join(`\n${" ".repeat(indent + 2)}`)
    return `${mid}${" ".repeat(indent)}\n${" ".repeat(indent)}}`
  }
  if (typeof data === "symbol") {
    return `Symbol(${JSON.stringify(data.description)})`
  }
  return "/* not displayable */"
}
export function displayJs(data: any) {
  return `\`\`\`kt\n${_displayJs(data, 0)}\`\`\``
}


export function defaultEmbed(author: User): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5050ff)
    .setAuthor({
      iconURL: author.displayAvatarURL(),
      name: `» requested by ${author.tag}`
    })
}
