import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"
import { useUpdateBudget } from "@/features/budget/hooks/use-update-budget"
import type { BudgetPlan } from "@/api/types"

vi.mock("@/api/budget-plan", () => ({
  updateBudgetPlan: vi.fn(),
}))

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
      amounts: { 1: 3000 },
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

describe("useUpdateBudget toast styling", () => {
  it("success toast auto-dismisses after 3 seconds", async () => {
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockBudgetPlan,
    )

    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({ category: "Salary", type: "income", month: 1, value: 3500 })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Budget updated",
        expect.objectContaining({ duration: 3000 }),
      )
    })
  })

  it("error toast is persistent with retry action", async () => {
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Server error"),
    )

    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({ category: "Salary", type: "income", month: 1, value: 9999 })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update budget",
        expect.objectContaining({
          duration: Infinity,
          action: expect.objectContaining({
            label: "Retry",
          }),
        }),
      )
    })
  })

  it("success toast has savings-border style", async () => {
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockBudgetPlan,
    )

    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({ category: "Salary", type: "income", month: 1, value: 3500 })

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Budget updated",
        expect.objectContaining({
          style: expect.objectContaining({
            borderColor: "var(--savings-border)",
          }),
        }),
      )
    })
  })

  it("error toast has expense-border style", async () => {
    ;(updateBudgetPlan as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Server error"),
    )

    const { wrapper } = createWrapper()
    const { result } = renderHook(() => useUpdateBudget(2026), { wrapper })

    result.current.mutate({ category: "Salary", type: "income", month: 1, value: 9999 })

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update budget",
        expect.objectContaining({
          style: expect.objectContaining({
            borderColor: "var(--expense-border)",
          }),
        }),
      )
    })
  })
})
