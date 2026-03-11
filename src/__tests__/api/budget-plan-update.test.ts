import { describe, it, expect, vi, beforeEach } from "vitest"
import { updateBudgetPlan } from "@/api/budget-plan"
import type { BudgetPlan, UpdateBudgetPlanRequest } from "@/api/types"

const mockBudgetPlan: BudgetPlan = {
  year: 2026,
  entries: [
    {
      category: "Salary",
      type: "income",
      amounts: { 1: 3000, 2: 3000, 3: 3000 },
    },
  ],
}

const updateRequest: UpdateBudgetPlanRequest = {
  year: 2026,
  entries: [
    {
      category: "Salary",
      type: "income",
      amounts: { 1: 3500, 2: 3000, 3: 3000 },
    },
  ],
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("updateBudgetPlan", () => {
  it("calls PUT /budget-plans with year and entries", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    await updateBudgetPlan(2026, updateRequest)

    const [calledUrl, calledOptions] = (
      globalThis.fetch as ReturnType<typeof vi.fn>
    ).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toContain("/budget-plans")
    expect(calledOptions.method).toBe("PUT")
    const body = JSON.parse(calledOptions.body as string)
    expect(body.year).toBe(2026)
    expect(body.entries).toHaveLength(1)
  })

  it("returns the updated budget plan", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBudgetPlan),
    })

    const result = await updateBudgetPlan(2026, updateRequest)
    expect(result.year).toBe(2026)
    expect(result.entries).toHaveLength(1)
  })

  it("throws ApiError on failure", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Update failed" }),
    })

    await expect(updateBudgetPlan(2026, updateRequest)).rejects.toThrow(
      "Update failed",
    )
  })
})
