import { describe, it, expect, vi, beforeEach } from "vitest"
import { getCategoryBreakdown } from "@/api/category-breakdown"

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("getCategoryBreakdown", () => {
  it("calls aggregation endpoint with correct type and computes percentages", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          period: { year: 2026, month: 3 },
          aggregations: [
            { category: "Groceries", total_eur: 300, count: 10 },
            { category: "Transport", total_eur: 100, count: 5 },
          ],
        }),
    })

    const result = await getCategoryBreakdown(2026, 3, "expense")

    expect(result).toHaveLength(2)
    expect(result[0].amount).toBe(300)
    expect(result[0].percentage).toBe(75)
    expect(result[1].percentage).toBe(25)

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("transaction_type=Expenses")
    expect(calledUrl).toContain("month=3")
  })
})
