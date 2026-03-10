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
  if (params.category !== undefined) searchParams.set("category", params.category)
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
      switch (tx.type) {
        case "income":
          acc.income += tx.amount
          break
        case "expense":
          acc.expenses += tx.amount
          break
        case "savings":
          acc.savings += tx.amount
          break
      }
      return acc
    },
    { income: 0, expenses: 0, savings: 0 },
  )
}
