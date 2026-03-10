import { describe, it, expect, vi, beforeEach } from "vitest"
import { getTransactions, getTransactionSummary } from "@/api/transactions"
import type { Transaction, PaginatedResponse } from "@/api/types"

const mockTransactions: Transaction[] = [
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
    amount: 150.5,
    details: "Weekly groceries",
  },
  {
    id: "3",
    date: "2026-03-03",
    type: "savings",
    category: "Emergency Fund",
    amount: 500,
    details: "Monthly savings",
  },
]

const mockResponse: PaginatedResponse<Transaction> = {
  data: mockTransactions,
  total: 3,
  page: 1,
  pageSize: 50,
  totalPages: 1,
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("getTransactions", () => {
  it("calls the transactions endpoint with year and period params", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    await getTransactions({ year: 2026, period: 3 })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("/transactions")
    expect(calledUrl).toContain("year=2026")
    expect(calledUrl).toContain("period=3")
  })

  it("returns paginated transaction data", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getTransactions({ year: 2026, period: 3 })

    expect(result.data).toHaveLength(3)
    expect(result.total).toBe(3)
    expect(result.page).toBe(1)
  })

  it("omits undefined filter params from the query string", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    await getTransactions({ year: 2026 })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("year=2026")
    expect(calledUrl).not.toContain("period=")
    expect(calledUrl).not.toContain("type=")
  })

  it("includes optional filters when provided", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    await getTransactions({
      year: 2026,
      period: 3,
      type: "income",
      sortBy: "date",
      sortOrder: "desc",
      page: 2,
      pageSize: 25,
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("type=income")
    expect(calledUrl).toContain("sortBy=date")
    expect(calledUrl).toContain("sortOrder=desc")
    expect(calledUrl).toContain("page=2")
    expect(calledUrl).toContain("pageSize=25")
  })

  it("throws ApiError on network failure", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    )

    await expect(getTransactions({ year: 2026 })).rejects.toThrow(
      "Unable to connect to the server",
    )
  })

  it("throws ApiError on non-ok response", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () =>
        Promise.resolve({ message: "Internal server error" }),
    })

    await expect(getTransactions({ year: 2026 })).rejects.toThrow(
      "Internal server error",
    )
  })

  it("includes date_from and date_to params when provided", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    await getTransactions({
      year: 2026,
      period: 3,
      date_from: "2026-03-01",
      date_to: "2026-03-31",
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("date_from=2026-03-01")
    expect(calledUrl).toContain("date_to=2026-03-31")
  })

  it("serializes category array as comma-separated string", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    await getTransactions({
      year: 2026,
      category: ["Groceries", "Salary"],
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("category=Groceries%2CSalary")
  })

  it("omits category param when array is empty", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })

    await getTransactions({
      year: 2026,
      category: [],
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).not.toContain("category=")
  })
})

describe("getTransactionSummary", () => {
  it("computes income, expense, and savings totals from transactions", () => {
    const summary = getTransactionSummary(mockTransactions)

    expect(summary.income).toBe(3000)
    expect(summary.expenses).toBe(150.5)
    expect(summary.savings).toBe(500)
  })

  it("returns zeros when no transactions exist", () => {
    const summary = getTransactionSummary([])

    expect(summary.income).toBe(0)
    expect(summary.expenses).toBe(0)
    expect(summary.savings).toBe(0)
  })
})
