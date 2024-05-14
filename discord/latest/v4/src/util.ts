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
  const name = /^(?:[^0-9]|[\w\d])[\w\d]*$/.test(func.name) ? func.name : JSON.stringify(func.name)
  if (argsMatch[1] !== undefined) {
    return `fun ${name}({ ${rejoin(argsMatch[3])} })`
  }
  if (argsMatch[2]!== undefined) {
    return `fun ${name}([${rejoin(argsMatch[3])}])`
  }
  return `fun ${name}(${rejoin(argsMatch[3])})`
}

const TAB_SIZE: number = 2
const MAX_DEPTH: number = 2
function _displayJs(data: any, depth: number): string {
  // TODO: change this to function map
  if (typeof data === "number") {
    if (data > 1e10) {
      return data.toExponential().replace(/e\+/g, "e")
    }
    let [left, right] = `${data}`.split('.')
    left = left.replace(/\B(?=(\d{3})+(?!\d))/g, "_")
    right = right.replace(/(?=(\d{3})+(?!\d))\B/g, "_")
    return `${left}.${right}`
  }
  if (typeof data === "boolean") {
    return `${data}`
  }
  if (typeof data === "string") {
    return JSON.stringify(data).replace(/(?<=[^\\]?\\u)[0-9a-fA-F]{4}/g, "{$&}")
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
    if (data === null) {
      return "null"
    }
    if (data instanceof Error) {
      return `${data.name.replace(/Error$/, "")}(${JSON.stringify(data.message)})`
    }
    if (depth > MAX_DEPTH) {
      return `(${data.constructor.name})`
    }
    let props = Object.getOwnPropertyNames(data)
    let descriptors = Object.getOwnPropertyDescriptors(data)

    if (Array.isArray(data)) {
      let props = Object.getOwnPropertyNames(data)
      if (data.length === 0) {
        return "[]"
      }
      let acc: string[] = ["["]
      for (const prop of props) {
        if (descriptors[prop].get !== undefined) {
          return "(getter)"
        }
        let value = data[prop]
        if (value === data) {
          acc.push(`/* circular */`)
          continue
        }
        if (typeof value === "function" && value.name === prop) {
          acc.push(`fun ${value.name}(${letters.slice(0, value.length).join(", ")})`)
          continue
        }
        if (isNaN(parseInt(prop))) {
          acc.push(`${JSON.stringify(prop)} => ${_displayJs(value, depth + 1)}`)
        } else {
          acc.push(_displayJs(value, depth + 1))
        }
      }
      let spaces = " ".repeat(depth * TAB_SIZE)
      let tab = " ".repeat((depth + 1) * TAB_SIZE)
      return `${acc.join(`\n${tab}`)}${spaces}\n${spaces}]`
    }
    if (props.length === 0) {
      return "{}"
    }
    let acc: string[] = ["{"]
    for (const prop of props) {
      if (descriptors[prop].get !== undefined) {
        return "/* getter */"
      }
      let value = data[prop]
      if (value === data) {
        acc.push(`${JSON.stringify(prop)} => /* circular */`)
        continue
      }
      if (typeof value === "function" && value.name === prop) {
        acc.push(`fun ${value.name}(${letters.slice(0, value.length).join(", ")})`)
        continue
      }
      acc.push(`${JSON.stringify(prop)} => ${_displayJs(value, depth + 1)}`)
    }
    let spaces = " ".repeat(depth * TAB_SIZE)
    let tab = " ".repeat((depth + 1) * TAB_SIZE)
    return `${acc.join(`\n${tab}`)}${spaces}\n${spaces}}`
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
