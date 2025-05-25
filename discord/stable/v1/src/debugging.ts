import { formatTimeShort } from "./formatting"
import chalk, { type ChalkInstance } from "chalk-pipe"

export const cyan: ChalkInstance = chalk("cyan")

export function debug(message: string) {
  console.log(`[${cyan(formatTimeShort(new Date()))}]`)
  console.log(message)
  console.log('')
}

export function debugError(message: string) {
  console.error(`[${formatTimeShort(new Date())}]`)
  console.error(message)
  console.error('')
}
