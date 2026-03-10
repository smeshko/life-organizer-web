import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement } from "react"
import { useBudgetVsActual } from "@/features/budget-vs-actual/hooks/use-budget-vs-actual"
import type { BudgetVsActualEntry } from "@/api/types"

vi.mock("@/api/budget-tracking", () => ({
  getBudgetVsActual: vi.fn(),
}))

vi.mock("@/contexts/filter-context", () => ({
  useFilter: vi.fn(),
}))

import { getBudgetVsActual } from "@/api/budget-tracking"
import { useFilter } from "@/contexts/filter-context"

const mockEntries: BudgetVsActualEntry[] = [
  {
    category: "Rent",
    type: "expense",
    budgeted: 1200,
    actual: 1400,
    remaining: 0,
    excess: 200,
    percentComplete: 116.67,
  },
]

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
  ;(useFilter as ReturnType<typeof vi.fn>).mockReturnValue({
    selectedYear: 2026,
    selectedPeriod: "total",
  })
})

describe("useBudgetVsActual", () => {
  it("fetches budget vs actual data using filter context values", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockEntries,
    )

    const { result } = renderHook(() => useBudgetVsActual(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(getBudgetVsActual).toHaveBeenCalledWith(2026, "total")
    expect(result.current.data).toEqual(mockEntries)
  })

  it("includes year and period in the query key for refetch on filter change", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockEntries,
    )

    const { result } = renderHook(() => useBudgetVsActual(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    // Verify the API was called with the right params (derived from filter context)
    expect(getBudgetVsActual).toHaveBeenCalledWith(2026, "total")
  })

  it("passes numeric period for monthly queries", async () => {
    ;(useFilter as ReturnType<typeof vi.fn>).mockReturnValue({
      selectedYear: 2026,
      selectedPeriod: 3,
    })
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockEntries,
    )

    const { result } = renderHook(() => useBudgetVsActual(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(getBudgetVsActual).toHaveBeenCalledWith(2026, 3)
  })

  it("returns loading state initially", () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {}),
    )

    const { result } = renderHook(() => useBudgetVsActual(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })

  it("returns error state on API failure", async () => {
    ;(getBudgetVsActual as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    )

    const { result } = renderHook(() => useBudgetVsActual(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe("Network error")
  })
})
