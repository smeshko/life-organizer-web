import { renderHook, act } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { createElement, type ReactNode } from "react"
import { FilterProvider } from "@/contexts/filter-context"
import {
  useTransactionFilters,
  computeDateRange,
} from "@/features/transactions/hooks/use-transaction-filters"

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(FilterProvider, null, children)
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 2, 10)) // March 10, 2026
})

afterEach(() => {
  vi.useRealTimers()
})

describe("useTransactionFilters", () => {
  it("initializes with default filter state", () => {
    const { result } = renderHook(() => useTransactionFilters(), {
      wrapper: createWrapper(),
    })

    expect(result.current.type).toBe("all")
    expect(result.current.categories).toEqual([])
    expect(result.current.dateFrom).toBe("2026-03-01")
    expect(result.current.dateTo).toBe("2026-03-31")
  })

  it("updates type filter via setType", () => {
    const { result } = renderHook(() => useTransactionFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setType("income")
    })

    expect(result.current.type).toBe("income")
  })

  it("updates categories via setCategories", () => {
    const { result } = renderHook(() => useTransactionFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setCategories(["Groceries", "Salary"])
    })

    expect(result.current.categories).toEqual(["Groceries", "Salary"])
  })

  it("updates date range via setDateRange", () => {
    const { result } = renderHook(() => useTransactionFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setDateRange("2026-03-05", "2026-03-20")
    })

    expect(result.current.dateFrom).toBe("2026-03-05")
    expect(result.current.dateTo).toBe("2026-03-20")
  })

  it("resets all filters via resetFilters", () => {
    const { result } = renderHook(() => useTransactionFilters(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.setType("expense")
      result.current.setCategories(["Food"])
      result.current.setDateRange("2026-01-01", "2026-01-31")
    })

    expect(result.current.type).toBe("expense")
    expect(result.current.categories).toEqual(["Food"])

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.type).toBe("all")
    expect(result.current.categories).toEqual([])
    expect(result.current.dateFrom).toBe("2026-03-01")
    expect(result.current.dateTo).toBe("2026-03-31")
  })

  it("computes full year date range when period is 'total'", () => {
    const range = computeDateRange(2026, "total")

    expect(range.dateFrom).toBe("2026-01-01")
    expect(range.dateTo).toBe("2026-12-31")
  })

  it("computes monthly date range for a specific month", () => {
    const range = computeDateRange(2026, 2)

    expect(range.dateFrom).toBe("2026-02-01")
    expect(range.dateTo).toBe("2026-02-28")
  })
})
