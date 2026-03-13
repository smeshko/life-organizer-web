import { get } from "@/api/client"
import type { BudgetVsActualEntry, CategoryBreakdown } from "@/api/types"
import { getBudgetPlan } from "@/api/budget-plan"

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

export async function getBudgetVsActual(
  year: number,
  period: "total" | number,
): Promise<BudgetVsActualEntry[]> {
  const [plan, expenseAgg, incomeAgg, savingsAgg] = await Promise.all([
    getBudgetPlan(year),
    fetchAggregation(year, period, "Expenses"),
    fetchAggregation(year, period, "Income"),
    fetchAggregation(year, period, "Savings"),
  ])

  const actualMap = new Map<string, { total: number; type: string }>()

  for (const agg of expenseAgg.aggregations) {
    actualMap.set(`Expenses:${agg.category}`, { total: agg.total_eur, type: "expense" })
  }
  for (const agg of incomeAgg.aggregations) {
    actualMap.set(`Income:${agg.category}`, { total: agg.total_eur, type: "income" })
  }
  for (const agg of savingsAgg.aggregations) {
    actualMap.set(`Savings:${agg.category}`, { total: agg.total_eur, type: "savings" })
  }

  const typeMap: Record<string, string> = {
    income: "Income",
    expense: "Expenses",
    savings: "Savings",
  }

  const entries: BudgetVsActualEntry[] = []
  const seen = new Set<string>()

  for (const planEntry of plan.entries) {
    const backendType = typeMap[planEntry.type] ?? planEntry.type
    const key = `${backendType}:${planEntry.category}`
    seen.add(key)

    let budgeted: number
    if (period === "total") {
      budgeted = Object.values(planEntry.amounts).reduce((sum, v) => sum + v, 0)
    } else {
      budgeted = planEntry.amounts[period] ?? 0
    }

    const actual = actualMap.get(key)?.total ?? 0
    const remaining = Math.max(budgeted - actual, 0)
    const excess = Math.max(actual - budgeted, 0)
    const percentComplete = budgeted > 0 ? Math.round((actual / budgeted) * 100) : actual > 0 ? 100 : 0

    entries.push({
      category: planEntry.category,
      type: planEntry.type,
      budgeted,
      actual,
      remaining,
      excess,
      percentComplete,
    })
  }

  for (const [key, value] of actualMap) {
    if (!seen.has(key)) {
      const category = key.split(":").slice(1).join(":")
      entries.push({
        category,
        type: value.type as BudgetVsActualEntry["type"],
        budgeted: 0,
        actual: value.total,
        remaining: 0,
        excess: value.total,
        percentComplete: 100,
      })
    }
  }

  return entries
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
