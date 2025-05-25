import { formatTimeShort } from "./formatting"
import chalk from "chalk"

const { cyan } = chalk
export const error = chalk.bold.red

export function debug(message: string) {
  console.log(`[${cyan(formatTimeShort(new Date()))}]`)
  console.log(message)
  console.log('')
}

export function debugError(message: string) {
  console.error(`[${error(formatTimeShort(new Date()))}]`)
  console.error(message)
  console.error('')
}
