import { get, patch, del } from "@/api/client"
import { getCategoryBreakdown } from "@/api/budget-tracking"
import type { Transaction, TransactionFilters, PaginatedResponse } from "@/api/types"

export interface TransactionSummary {
  income: number
  expenses: number
  savings: number
}

const TYPE_TO_BACKEND: Record<string, string> = {
  income: "Income",
  expense: "Expenses",
  savings: "Savings",
}

const BACKEND_TYPE_TO_FRONTEND: Record<string, Transaction["type"]> = {
  Income: "income",
  Expenses: "expense",
  Savings: "savings",
}

interface BackendTransaction {
  id: number
  amount: number
  currency: string
  amount_eur: number | null
  date: string
  transaction_type: string
  category: string
  details: string | null
}

interface BackendPaginatedResponse {
  items: BackendTransaction[]
  total: number
  page: number
  page_size: number
}

function getDateRange(
  year: number,
  period: "total" | number,
): { start_date: string; end_date: string } {
  if (period === "total") {
    return {
      start_date: `${year}-01-01`,
      end_date: `${year}-12-31`,
    }
  }
  const month = String(period).padStart(2, "0")
  const lastDay = new Date(year, period, 0).getDate()
  return {
    start_date: `${year}-${month}-01`,
    end_date: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
  }
}

export async function getTransactions(
  params: TransactionFilters,
): Promise<PaginatedResponse<Transaction>> {
  const searchParams = new URLSearchParams()

  if (params.year !== undefined && params.period !== undefined) {
    const { start_date, end_date } = getDateRange(params.year, params.period)
    if (params.date_from === undefined) searchParams.set("start_date", start_date)
    if (params.date_to === undefined) searchParams.set("end_date", end_date)
  }

  if (params.type !== undefined) {
    const backendType = TYPE_TO_BACKEND[params.type]
    if (backendType) searchParams.set("transaction_type", backendType)
  }
  if (params.category !== undefined && params.category.length > 0)
    searchParams.set("category", params.category[0])
  if (params.date_from !== undefined) searchParams.set("start_date", params.date_from)
  if (params.date_to !== undefined) searchParams.set("end_date", params.date_to)
  if (params.sortBy !== undefined) searchParams.set("sort_by", params.sortBy)
  if (params.sortOrder !== undefined) searchParams.set("sort_order", params.sortOrder)
  if (params.page !== undefined) searchParams.set("page", String(params.page))
  if (params.pageSize !== undefined) searchParams.set("page_size", String(params.pageSize))

  const query = searchParams.toString()
  const path = query ? `/budget/transactions?${query}` : "/budget/transactions"

  const raw = await get<BackendPaginatedResponse>(path)

  return {
    data: raw.items.map((item) => ({
      id: String(item.id),
      date: item.date,
      type: BACKEND_TYPE_TO_FRONTEND[item.transaction_type] ?? "expense",
      category: item.category,
      amount:
        item.transaction_type === "Expenses"
          ? -(item.amount_eur ?? item.amount)
          : (item.amount_eur ?? item.amount),
      details: item.details ?? "",
    })),
    total: raw.total,
    page: raw.page,
    pageSize: raw.page_size,
    totalPages: Math.ceil(raw.total / raw.page_size),
  }
}

export function getTransactionSummary(transactions: Transaction[]): TransactionSummary {
  return transactions.reduce<TransactionSummary>(
    (acc, tx) => {
      const abs = Math.abs(tx.amount)
      switch (tx.type) {
        case "income":
          acc.income += abs
          break
        case "expense":
          acc.expenses += abs
          break
        case "savings":
          acc.savings += abs
          break
      }
      return acc
    },
    { income: 0, expenses: 0, savings: 0 },
  )
}

export async function getTransactionTotals(
  year: number,
  period: "total" | number,
  filters?: {
    type?: Transaction["type"]
    categories?: string[]
    dateFrom?: string
    dateTo?: string
  },
): Promise<TransactionSummary> {
  const [income, expenses, savings] = await Promise.all([
    (!filters?.type || filters.type === "income")
      ? getCategoryBreakdown(year, period, "income")
      : Promise.resolve([]),
    (!filters?.type || filters.type === "expense")
      ? getCategoryBreakdown(year, period, "expense")
      : Promise.resolve([]),
    (!filters?.type || filters.type === "savings")
      ? getCategoryBreakdown(year, period, "savings")
      : Promise.resolve([]),
  ])

  const filterCats = filters?.categories?.length ? new Set(filters.categories) : null

  const sumFiltered = (items: Array<{ category: string; amount: number }>) =>
    items
      .filter((item) => !filterCats || filterCats.has(item.category))
      .reduce((sum, item) => sum + item.amount, 0)

  return {
    income: sumFiltered(income),
    expenses: sumFiltered(expenses),
    savings: sumFiltered(savings),
  }
}

export async function updateTransaction(
  id: string,
  data: Partial<Pick<Transaction, "date" | "category" | "amount" | "details">>,
): Promise<void> {
  await patch(`/budget/transactions/${id}`, data)
}

export async function deleteTransaction(id: string): Promise<void> {
  await del(`/budget/transactions/${id}`)
}
