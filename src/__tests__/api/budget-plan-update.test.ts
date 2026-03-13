import { describe, it, expect, vi, beforeEach } from "vitest"
import { updateBudgetPlan } from "@/api/budget-plan"
import type { UpdateBudgetPlanRequest } from "@/api/types"

const mockBackendUpsertResponse = {
  success: true,
  updated: 3,
}

const mockBackendPlanResponse = {
  year: 2026,
  entries: [
    {
      transaction_type: "Income",
      category: "Salary",
      amounts: { "1": 3500, "2": 3000, "3": 3000 },
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
  it("calls PUT /budget/plan/{year} with flattened entries then refetches", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBackendUpsertResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBackendPlanResponse),
      })

    await updateBudgetPlan(2026, updateRequest)

    const [calledUrl, calledOptions] = (
      globalThis.fetch as ReturnType<typeof vi.fn>
    ).mock.calls[0] as [string, RequestInit]
    expect(calledUrl).toContain("/budget/plan/2026")
    expect(calledOptions.method).toBe("PUT")
    const body = JSON.parse(calledOptions.body as string)
    expect(body.entries).toHaveLength(3)
    expect(body.entries[0].transaction_type).toBe("Income")
    expect(body.entries[0].month).toBe(1)
    expect(body.entries[0].planned_amount).toBe(3500)
  })

  it("returns the transformed budget plan after refetch", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBackendUpsertResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockBackendPlanResponse),
      })

    const result = await updateBudgetPlan(2026, updateRequest)
    expect(result.year).toBe(2026)
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0].type).toBe("income")
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
