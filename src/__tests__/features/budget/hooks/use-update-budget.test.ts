import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"
import { useUpdateBudget } from "@/features/budget/hooks/use-update-budget"
import type { BudgetPlan } from "@/api/types"

// Mock the API module
vi.mock("@/api/budget-plan", () => ({
  updateBudgetPlan: vi.fn(),
}))

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import { updateBudgetPlan } from "@/api/budget-plan"
import { toast } from "sonner"

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

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  // Seed the cache with mock data
  queryClient.setQueryData(["budget-plan", 2026], mockBudgetPlan)

  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe("useUpdateBudget", () => {
  it("updates the cache optimistically on mutate", async () => {
    const updatedPlan = {
      ...mockBudgetPlan,
      entries: [
        {
          category: "Salary",
          type: "income" as const,
          amounts: { 1: 3500, 2: 3000, 3: 3000 },
        },
        mockBudgetPlan.entries[1],
      ],
    }

    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      updatedPlan,
    )

    const { queryClient, wrapper } = createWrapper()

    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({
      category: "Salary",
      month: 1,
      value: 3500,
    })

    // Optimistic update should update cache immediately
    await waitFor(() => {
      const cached = queryClient.getQueryData<BudgetPlan>([
        "budget-plan",
        2026,
      ])
      expect(cached?.entries[0].amounts[1]).toBe(3500)
    })
  })

  it("rolls back cache on API error", async () => {
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Server error"),
    )

    const { queryClient, wrapper } = createWrapper()

    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({
      category: "Salary",
      month: 1,
      value: 9999,
    })

    await waitFor(() => {
      // After error, cache should be rolled back to original
      const cached = queryClient.getQueryData<BudgetPlan>([
        "budget-plan",
        2026,
      ])
      expect(cached?.entries[0].amounts[1]).toBe(3000)
    })
  })

  it("shows success toast on API success", async () => {
    const updatedPlan = { ...mockBudgetPlan }
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      updatedPlan,
    )

    const { wrapper } = createWrapper()

    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({
      category: "Salary",
      month: 1,
      value: 3500,
    })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled()
    })
  })

  it("shows error toast on API failure", async () => {
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Update failed"),
    )

    const { wrapper } = createWrapper()

    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({
      category: "Salary",
      month: 1,
      value: 9999,
    })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
  })

  it("builds correct UpdateBudgetPlanRequest from current cache", async () => {
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockBudgetPlan,
    )

    const { wrapper } = createWrapper()

    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({
      category: "Salary",
      month: 1,
      value: 4000,
    })

    await waitFor(() => {
      expect(updateBudgetPlan).toHaveBeenCalledWith(2026, {
        year: 2026,
        entries: [
          {
            category: "Salary",
            type: "income",
            amounts: { 1: 4000, 2: 3000, 3: 3000 },
          },
          {
            category: "Rent",
            type: "expense",
            amounts: { 1: 1200, 2: 1200, 3: 1200 },
          },
        ],
      })
    })
  })
})
