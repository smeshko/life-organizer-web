import { get } from "@/api/client"
import type { CategoryBreakdown } from "@/api/types"

export type CategoryType = "income" | "expense" | "savings"

const FRONTEND_TYPE_TO_BACKEND: Record<string, string> = {
  income: "Income",
  expense: "Expenses",
  savings: "Savings",
}

interface BackendCategoryAggregation {
  category: string
  total_eur: number
  count: number
}

interface BackendAggregationResponse {
  period: { year: number; month: number | null }
  aggregations: BackendCategoryAggregation[]
}

export async function getCategoryBreakdown(
  year: number,
  period: "total" | number,
  type: CategoryType,
): Promise<CategoryBreakdown[]> {
  const backendType = FRONTEND_TYPE_TO_BACKEND[type]
  const raw = await fetchAggregation(year, period, backendType)

  const totalAmount = raw.aggregations.reduce((sum, a) => sum + a.total_eur, 0)

  return raw.aggregations.map((agg) => ({
    category: agg.category,
    amount: agg.total_eur,
    percentage: totalAmount > 0 ? Math.round((agg.total_eur / totalAmount) * 100) : 0,
  }))
}

async function fetchAggregation(
  year: number,
  period: "total" | number,
  transactionType: string,
): Promise<BackendAggregationResponse> {
  const params = new URLSearchParams()
  params.set("year", String(year))
  if (period !== "total") params.set("month", String(period))
  params.set("transaction_type", transactionType)

  return get<BackendAggregationResponse>(
    `/budget/transactions/aggregate?${params.toString()}`,
  )
}
