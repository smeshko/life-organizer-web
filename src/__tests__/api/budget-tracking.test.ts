import { describe, it, expect, vi, beforeEach } from "vitest"
import { getBudgetVsActual, getCategoryBreakdown } from "@/api/budget-tracking"

const mockPlanResponse = {
  year: 2026,
  entries: [
    {
      transaction_type: "Expenses",
      category: "Rent",
      amounts: { "1": 1200, "2": 1200, "3": 1200 },
    },
    {
      transaction_type: "Income",
      category: "Salary",
      amounts: { "1": 3000, "2": 3000, "3": 3000 },
    },
  ],
}

const mockExpenseAgg = {
  period: { year: 2026, month: null },
  aggregations: [
    { category: "Rent", total_eur: 1200, count: 1 },
  ],
}

const mockIncomeAgg = {
  period: { year: 2026, month: null },
  aggregations: [
    { category: "Salary", total_eur: 2800, count: 1 },
  ],
}

const mockEmptyAgg = {
  period: { year: 2026, month: null },
  aggregations: [],
}

function mockFetchForBudgetVsActual() {
  ;(globalThis.fetch as ReturnType<typeof vi.fn>)
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockPlanResponse),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockExpenseAgg),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockIncomeAgg),
    })
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockEmptyAgg),
    })
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("getBudgetVsActual", () => {
  it("fetches plan and aggregations then computes budget vs actual", async () => {
    mockFetchForBudgetVsActual()

    const result = await getBudgetVsActual(2026, "total")

    expect(result).toHaveLength(2)
    const expense = result.find((e) => e.category === "Rent")
    expect(expense).toBeDefined()
    expect(expense!.budgeted).toBeGreaterThan(0)
    expect(expense!.actual).toBe(1200)
  })

  it("computes correct remaining and percentComplete", async () => {
    mockFetchForBudgetVsActual()

    const result = await getBudgetVsActual(2026, "total")

    const income = result.find((e) => e.category === "Salary")
    expect(income).toBeDefined()
    expect(income!.actual).toBe(2800)
    expect(income!.percentComplete).toBeGreaterThan(0)
  })

  it("calls aggregation endpoints with correct transaction_type params", async () => {
    mockFetchForBudgetVsActual()

    await getBudgetVsActual(2026, 3)

    const calls = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls
    const urls = calls.map((c) => c[0] as string)
    expect(urls.some((u) => u.includes("transaction_type=Expenses"))).toBe(true)
    expect(urls.some((u) => u.includes("transaction_type=Income"))).toBe(true)
    expect(urls.some((u) => u.includes("transaction_type=Savings"))).toBe(true)
  })

  it("throws ApiError on network failure", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    )

    await expect(getBudgetVsActual(2026, "total")).rejects.toThrow(
      "Unable to connect to the server",
    )
  })
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
