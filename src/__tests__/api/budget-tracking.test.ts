import { describe, it, expect, vi, beforeEach } from "vitest"
import { getBudgetVsActual } from "@/api/budget-tracking"
import type { BudgetVsActualEntry } from "@/api/types"

const mockEntries: BudgetVsActualEntry[] = [
  {
    category: "Rent",
    type: "expense",
    budgeted: 1200,
    actual: 1200,
    remaining: 0,
    excess: 0,
    percentComplete: 100,
  },
  {
    category: "Salary",
    type: "income",
    budgeted: 3000,
    actual: 2800,
    remaining: 200,
    excess: 0,
    percentComplete: 93.33,
  },
]

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("getBudgetVsActual", () => {
  it("calls the budget-vs-actual endpoint with year and period params", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockEntries),
    })

    await getBudgetVsActual(2026, "total")

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("/budget-vs-actual")
    expect(calledUrl).toContain("year=2026")
    expect(calledUrl).toContain("period=total")
  })

  it("passes numeric period for monthly queries", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockEntries),
    })

    await getBudgetVsActual(2026, 3)

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("period=3")
  })

  it("returns budget vs actual entries", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockEntries),
    })

    const result = await getBudgetVsActual(2026, "total")

    expect(result).toHaveLength(2)
    expect(result[0].category).toBe("Rent")
    expect(result[1].category).toBe("Salary")
  })

  it("throws ApiError on network failure", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    )

    await expect(getBudgetVsActual(2026, "total")).rejects.toThrow(
      "Unable to connect to the server",
    )
  })

  it("throws ApiError on non-ok response", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Internal server error" }),
    })

    await expect(getBudgetVsActual(2026, "total")).rejects.toThrow(
      "Internal server error",
    )
  })
})
