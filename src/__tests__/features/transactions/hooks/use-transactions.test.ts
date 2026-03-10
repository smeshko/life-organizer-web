import { renderHook, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createElement, type ReactNode } from "react"
import { useTransactions } from "@/features/transactions/hooks/use-transactions"
import { FilterProvider } from "@/contexts/filter-context"
import type { Transaction, PaginatedResponse } from "@/api/types"

const mockResponse: PaginatedResponse<Transaction> = {
  data: [
    {
      id: "1",
      date: "2026-03-01",
      type: "income",
      category: "Salary",
      amount: 3000,
      details: "Monthly salary",
    },
    {
      id: "2",
      date: "2026-03-02",
      type: "expense",
      category: "Groceries",
      amount: 150,
      details: "Weekly groceries",
    },
  ],
  total: 2,
  page: 1,
  pageSize: 50,
  totalPages: 1,
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      createElement(FilterProvider, null, children),
    )
  }
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("useTransactions", () => {
  it("fetches transactions and returns data", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.data?.data).toHaveLength(2)
    expect(result.current.isError).toBe(false)
  })

  it("returns error state on API failure", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: "Server error" }),
    })

    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeDefined()
  })

  it("provides a refetch function", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    const { result } = renderHook(() => useTransactions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(typeof result.current.refetch).toBe("function")
  })
})
