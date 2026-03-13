import { describe, it, expect, vi, beforeEach } from "vitest"
import { getBudgetPlan } from "@/api/budget-plan"

const mockBackendResponse = {
  year: 2026,
  entries: [
    {
      transaction_type: "Income",
      category: "Salary",
      amounts: { "1": 3000, "2": 3000, "3": 3000 },
    },
    {
      transaction_type: "Expenses",
      category: "Rent",
      amounts: { "1": 1200, "2": 1200, "3": 1200 },
    },
  ],
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("getBudgetPlan", () => {
  it("calls the budget/plan/{year} endpoint", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    await getBudgetPlan(2026)

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("/budget/plan/2026")
  })

  it("transforms backend response to frontend format", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    const result = await getBudgetPlan(2026)

    expect(result.year).toBe(2026)
    expect(result.entries).toHaveLength(2)
    expect(result.entries[0].type).toBe("income")
    expect(result.entries[1].type).toBe("expense")
    expect(result.entries[0].amounts[1]).toBe(3000)
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
