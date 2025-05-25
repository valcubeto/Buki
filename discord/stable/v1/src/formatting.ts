
/** Perfectionist stuff. Please ignore. */
export function selectByQuantity(num: number, singular: string, plural: string): string {
  return num === 1 ? singular : plural
}

/** Adds an ordinal suffix to a number. (1st, 2nd, 3rd, 4th, 5th, etc) */
export function addOrdinal(num: number | string): string {
  let ten = num.toString().at(-1)
  let suffix = ten === "1" ? "st"
    : ten === "2" ? "nd"
    : ten === "3" ? "rd"
    : "th"
  return `${num}${suffix}`
}

/** Formats the date using the English locale. (Sunday, January 1st, 2023. 12:00 PM) */
export function formatTimeLong(time: Date): string {
  let month = time.toLocaleString("en-US", { month: "long" })
  let dayName = time.toLocaleString("en-US", { weekday: "long" })
  let day = time.getDate()
  let year = time.getFullYear()
  let hour = (time.getHours() % 12 || 12).toString().padStart(2, "0")
  let minute = time.getMinutes().toString().padStart(2, "0")
  console.log({minute})
  let meridiem = time.getHours() < 12 ? "AM" : "PM"
  return `${dayName}, ${month} ${addOrdinal(day)}, ${year}. ${hour}:${minute} ${meridiem}`
}

/** Formats the date using a short format. (01-01-2023 12:00:00) */
export function formatTimeShort(time: Date): string {
  let day = time.getDate().toString().padStart(2, "0")
  let month = (time.getMonth() + 1).toString().padStart(2, "0")
  let year = time.getFullYear()
  let hour = (time.getHours() % 12 || 12).toString().padStart(2, "0")
  let minute = time.getMinutes().toString().padStart(2, "0")
  let second = time.getSeconds().toString().padStart(2, "0")
  return `${day}-${month}-${year} ${hour}:${minute}:${second}`
}