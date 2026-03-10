import type { Transaction } from "@/api/types"

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(
  amount: number,
  type?: Transaction["type"],
): string {
  const formatted = numberFormatter.format(amount)
  if (type === "expense") {
    return `\u2212\u20AC ${formatted}`
  }
  return `\u20AC ${formatted}`
}

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

export function formatDate(dateString: string): string {
  const [, monthStr, dayStr] = dateString.split("-")
  const monthIndex = parseInt(monthStr, 10) - 1
  const day = dayStr
  return `${MONTH_SHORT[monthIndex]} ${day}`
}
