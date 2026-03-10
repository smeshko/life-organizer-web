import { describe, it, expect } from "vitest"
import { formatCurrency, formatDate } from "@/lib/format"

describe("formatCurrency", () => {
  it("formats a positive income amount with € prefix", () => {
    expect(formatCurrency(1500, "income")).toBe("€ 1,500.00")
  })

  it("formats an expense amount with minus sign and € prefix", () => {
    expect(formatCurrency(250.5, "expense")).toBe("\u2212€ 250.50")
  })

  it("formats a savings amount with € prefix", () => {
    expect(formatCurrency(500, "savings")).toBe("€ 500.00")
  })

  it("formats zero correctly", () => {
    expect(formatCurrency(0)).toBe("€ 0.00")
  })

  it("formats large numbers with comma-separated thousands", () => {
    expect(formatCurrency(1234567.89, "income")).toBe("€ 1,234,567.89")
  })

  it("formats with two decimal places", () => {
    expect(formatCurrency(100)).toBe("€ 100.00")
  })

  it("rounds to two decimal places", () => {
    expect(formatCurrency(99.999)).toBe("€ 100.00")
  })

  it("formats without type as positive", () => {
    expect(formatCurrency(750)).toBe("€ 750.00")
  })

  it("normalizes negative expense amounts to avoid double-negative", () => {
    expect(formatCurrency(-150.5, "expense")).toBe("\u2212€ 150.50")
  })

  it("normalizes negative income amounts", () => {
    expect(formatCurrency(-1000, "income")).toBe("€ 1,000.00")
  })
})

describe("formatDate", () => {
  it("formats a date string to short month and day", () => {
    expect(formatDate("2026-03-08")).toBe("Mar 08")
  })

  it("formats January date", () => {
    expect(formatDate("2026-01-15")).toBe("Jan 15")
  })

  it("formats December date", () => {
    expect(formatDate("2026-12-31")).toBe("Dec 31")
  })

  it("handles ISO datetime strings with time portion", () => {
    expect(formatDate("2026-03-01T00:00:00Z")).toBe("Mar 01")
  })

  it("handles ISO datetime strings with timezone offset", () => {
    expect(formatDate("2026-07-15T14:30:00+02:00")).toBe("Jul 15")
  })
})
