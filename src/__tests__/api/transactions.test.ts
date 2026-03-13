import { describe, it, expect, vi, beforeEach } from "vitest"
import { getTransactions, getTransactionSummary } from "@/api/transactions"
import type { Transaction } from "@/api/types"

const mockBackendResponse = {
  items: [
    {
      id: 1,
      amount: 3000,
      currency: "EUR",
      amount_eur: 3000,
      date: "2026-03-01",
      transaction_type: "Income",
      category: "Salary",
      details: "Monthly salary",
    },
    {
      id: 2,
      amount: 150.5,
      currency: "EUR",
      amount_eur: 150.5,
      date: "2026-03-02",
      transaction_type: "Expenses",
      category: "Groceries",
      details: "Weekly groceries",
    },
    {
      id: 3,
      amount: 500,
      currency: "EUR",
      amount_eur: 500,
      date: "2026-03-03",
      transaction_type: "Savings",
      category: "Emergency Fund",
      details: "Monthly savings",
    },
  ],
  total: 3,
  page: 1,
  page_size: 50,
}

beforeEach(() => {
  vi.restoreAllMocks()
  globalThis.fetch = vi.fn()
})

describe("getTransactions", () => {
  it("calls the budget/transactions endpoint with start_date and end_date", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    await getTransactions({ year: 2026, period: 3 })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("/budget/transactions")
    expect(calledUrl).toContain("start_date=2026-03-01")
    expect(calledUrl).toContain("end_date=2026-03-31")
  })

  it("returns transformed paginated transaction data", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    const result = await getTransactions({ year: 2026, period: 3 })

    expect(result.data).toHaveLength(3)
    expect(result.total).toBe(3)
    expect(result.page).toBe(1)
    expect(result.totalPages).toBe(1)
    expect(result.data[0].type).toBe("income")
    expect(result.data[1].type).toBe("expense")
    expect(result.data[2].type).toBe("savings")
  })

  it("maps transaction_type to backend format", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    await getTransactions({
      year: 2026,
      period: 3,
      type: "income",
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("transaction_type=Income")
  })

  it("maps page_size param", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    await getTransactions({
      year: 2026,
      period: 3,
      page: 2,
      pageSize: 25,
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("page=2")
    expect(calledUrl).toContain("page_size=25")
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

  it("uses date_from/date_to as start_date/end_date when provided", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    await getTransactions({
      year: 2026,
      period: 3,
      date_from: "2026-03-10",
      date_to: "2026-03-20",
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("start_date=2026-03-10")
    expect(calledUrl).toContain("end_date=2026-03-20")
  })

  it("sends first category when array provided", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
    })

    await getTransactions({
      year: 2026,
      category: ["Groceries"],
    })

    const calledUrl = (globalThis.fetch as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as string
    expect(calledUrl).toContain("category=Groceries")
  })

  it("omits category param when array is empty", async () => {
    ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockBackendResponse),
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
  const mockTransactions: Transaction[] = [
    { id: "1", date: "2026-03-01", type: "income", category: "Salary", amount: 3000, details: "" },
    { id: "2", date: "2026-03-02", type: "expense", category: "Groceries", amount: -150.5, details: "" },
    { id: "3", date: "2026-03-03", type: "savings", category: "Emergency Fund", amount: 500, details: "" },
  ]

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
