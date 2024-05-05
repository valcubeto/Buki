const BOLD = "\x1b[1m";
const BOLD_END = "\x1b[22m"

const BLACK = "\x1b[30m"
const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const BLUE = "\x1b[34m"
const MAGENTA = "\x1b[35m"
const CYAN = "\x1b[36m"
const GRAY = "\x1b[37m"
const COLOR_END = "\x1b[39m"

export function green(text: string): string {
  return `${GREEN}${text}${COLOR_END}`
}

export function red(text: string): string {
  return `${RED}${text}${COLOR_END}`
}

export function yellow(text: string): string {
  return `${YELLOW}${text}${COLOR_END}`
}

export function blue(text: string): string {
  return `${BLUE}${text}${COLOR_END}`
}

export function magenta(text: string): string {
  return `${MAGENTA}${text}${COLOR_END}`
}

export function cyan(text: string): string {
  return `${CYAN}${text}${COLOR_END}`
}

export function gray(text: string): string {
  return `${GRAY}${text}${COLOR_END}`
}

export function black(text: string): string {
  return `${BLACK}${text}${COLOR_END}`
}

export function bold(text: string): string {
  return `${BOLD}${text}${BOLD_END}`
}
