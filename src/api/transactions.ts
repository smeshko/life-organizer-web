import { get } from "@/api/client"
import type { Transaction, TransactionFilters, PaginatedResponse } from "@/api/types"

export interface TransactionSummary {
  income: number
  expenses: number
  savings: number
}

export async function getTransactions(
  params: TransactionFilters,
): Promise<PaginatedResponse<Transaction>> {
  const searchParams = new URLSearchParams()

  if (params.year !== undefined) searchParams.set("year", String(params.year))
  if (params.period !== undefined) searchParams.set("period", String(params.period))
  if (params.type !== undefined) searchParams.set("type", params.type)
  if (params.category !== undefined && params.category.length > 0)
    searchParams.set("category", params.category.join(","))
  if (params.date_from !== undefined) searchParams.set("date_from", params.date_from)
  if (params.date_to !== undefined) searchParams.set("date_to", params.date_to)
  if (params.sortBy !== undefined) searchParams.set("sortBy", params.sortBy)
  if (params.sortOrder !== undefined) searchParams.set("sortOrder", params.sortOrder)
  if (params.page !== undefined) searchParams.set("page", String(params.page))
  if (params.pageSize !== undefined) searchParams.set("pageSize", String(params.pageSize))

  const query = searchParams.toString()
  const path = query ? `/transactions?${query}` : "/transactions"

  return get<PaginatedResponse<Transaction>>(path)
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
