import { stderr, stdout } from "bun"
import { formatTimeShort } from "./formatting"
import chalk from "chalk"

const { cyan, red } = chalk

export function debug(message: string) {
  stdout.write(`[${formatTimeShort(new Date()).replace(/\d+/g, ($0) => cyan($0))}]\n`)
  stdout.write(`${cyan("Info")}: ${message}\n\n`)
}

export function debugError(message: string) {
  stderr.write(`[${formatTimeShort(new Date()).replace(/\d+/g, ($0) => red($0))}]\n`)
  stderr.write(`${red("Error")}: ${message}\n\n`)
}
