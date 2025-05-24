import { EmbedBuilder, User } from "discord.js";
import { PREFIX } from "./constants.ts";

export function isInvalidContent(content: string): boolean {
  return PREFIX.length > content.length || !content.startsWith(PREFIX);
}

export function displayJson(json: any): string {
  return `\`\`\`json\n${JSON.stringify(json, null, 2)}\`\`\``;
}

export function fixCommas(args: string): string {
  return args
    .trim()
    .split(/\s*,\s*/)
    .join(", ");
}

/// TODO: accept more destructuring params
const FUNCTION_PATT = /^(?:function\s*(?:\w+\s*)?)?\(\s*(?:(\{)|(\[))?((?:\s*\w(?:\s*,)?)*)\s*(?:\}\s*|\]\s*)?\s*\)/;
const IDENTIFIER_PATT = /^(?:[^0-9]|[\w\d])[\w\d]*$/;
export function displayFunction(func: Function): string {
  let match: RegExpMatchArray | null = func.toString()
    .match(FUNCTION_PATT);
  if (match === null) {
    return "/* not displayable */";
  }
  let name: string = IDENTIFIER_PATT.test(func.name)
    ? func.name
    : JSON.stringify(func.name);
  let params: string = fixCommas(match[3]);
  if (match[1] !== undefined) {
    return `function ${name}({ ${params} }) { ... }`;
  }
  if (match[2] !== undefined) {
    return `function ${name}([${params}]) { ... }`;
  }
  return `function ${name}(${params}) { ... }`;
}

export function displayNumber(data: number): string {
  return data.toString();
}

export function displayBigInt(data: bigint): string {
  return `BigInt(${data})`;
}

function displayBoolean(data: boolean): string {
  return data.toString();
}

export function displayString(data: string): string {
  // Fix default unicode escapes
  return JSON.stringify(data)
    .replace(/(?<=[^\\]?\\u)[0-9a-fA-F]{4}/g, "{$&}");
}

export function displaySymbol(data: symbol): string {
  return `Symbol(${JSON.stringify(data.description)})`;
}

export function isArray(data: any): boolean {
  switch (data.constructor) {
    case Array:
    case Buffer:
      return true;
    default:
      return false;
  }
}

export function displayArray(data: any[], depth: number): string {
  if (data.length === 0) {
    return `${data.constructor}(0) []`;
  }
  let acc: string[] = [`${data.constructor.name}(${data.length}) [`];
  for (let value of data) {
    if (value === data) {
      acc.push(`/* circular */`);
      continue;
    }
    acc.push(_displayJs(value, depth + 1));
  }
  let spaces = " ".repeat(depth * TAB_SIZE);
  let tab = " ".repeat((depth + 1) * TAB_SIZE);
  return `${acc.join(`\n${tab}`)}${spaces}\n${spaces}]`;
}

export function displayObject(data: any, depth: number): string {
  let type: string = typeof data.constructor !== "function"
    ? `${data}`.replace(/^\[object (.*)\]$/, "$1")
    : data.constructor.name;
  if (depth > MAX_DEPTH) {
    return `${type} { ... }`;
  }
  if (data instanceof Error) {
    return `${data.name}(${JSON.stringify(data.message)}, ${JSON.stringify(data.stack?.slice((data.toString().length) + 5))})`;
  }
  if (data instanceof RegExp) {
    return data.toString();
  }
  let props = Object.getOwnPropertyNames(data);
  if (props.length === 0) {
    return `${type} {}`;
  }
  let descriptors = Object.getOwnPropertyDescriptors(data);
  let acc: string[] = [`${type} {`];
  for (const prop of props) {
    let key = JSON.stringify(prop);
    if (descriptors[prop].get !== undefined) {
      acc.push(`${key}: /* getter */`);
      continue;
    }
    let value = data[prop];
    if (typeof value === "function") {
      acc.push(`${displayFunction(value)}`);
      continue;
    }
    if (value === data) {
      acc.push(`${key}: /* circular */`);
      continue;
    }
    acc.push(`${key}: ${_displayJs(value, depth + 1)}`);
  }
  let spaces = " ".repeat(depth * TAB_SIZE);
  let tab = " ".repeat((depth + 1) * TAB_SIZE);
  return `${acc.join(`\n${tab}`)}${spaces}\n${spaces}}`;
}

const TAB_SIZE: number = 2;
const MAX_DEPTH: number = 2;
function _displayJs(data: any, depth: number): string {
  if (data === null) {
    return "null";
  }
  if (typeof data === "undefined") {
    if (data !== undefined) {
      return "/* not displayable */"
    }
    return "undefined"
  }
  if (isArray(data)) {
    return displayArray(data, depth);
  }
  if (typeof data === "object") {
    return displayObject(data, depth);
  }
  const displayers = {
    "number": displayNumber,
    "boolean": displayBoolean,
    "string": displayString,
    "bigint": displayBigInt,
    "function": displayFunction,
    "symbol": displaySymbol,
  };
  return displayers[typeof data]?.(data) ?? "/* not displayable */";
}

export function displayJs(data: any) {
  return `\`\`\`js\n${_displayJs(data, 0)}\`\`\``
}

export function defaultEmbed(author: User): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5050ff)
    .setAuthor({
      iconURL: author.displayAvatarURL(),
      name: `» requested by ${author.tag}`
    })
}
