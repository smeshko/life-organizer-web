import { describe, it, expect, vi, beforeEach } from "vitest"
import { getBudgetPlan } from "@/api/budget-plan"
import type { BudgetPlan } from "@/api/types"

const mockBudgetPlan: BudgetPlan = {
  year: 2026,
  entries: [
    {
      category: "Salary",
      type: "income",
      amounts: { 1: 3000, 2: 3000, 3: 3000 },
    },
    {
      category: "Rent",
      type: "expense",
      amounts: { 1: 1200, 2: 1200, 3: 1200 },
    },
  ],
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("getBudgetPlan", () => {
  it("calls the budget-plans endpoint with year param", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    await getBudgetPlan(2026)

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("/budget-plans")
    expect(calledUrl).toContain("year=2026")
  })

  it("returns budget plan data", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    const result = await getBudgetPlan(2026)

    expect(result.year).toBe(2026)
    expect(result.entries).toHaveLength(2)
  })

  it("throws ApiError on network failure", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    )

    await expect(getBudgetPlan(2026)).rejects.toThrow(
      "Unable to connect to the server",
    )
  })

  it("throws ApiError on non-ok response", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Internal server error" }),
    })

    await expect(getBudgetPlan(2026)).rejects.toThrow(
      "Internal server error",
    )
  })
})
