import { get, put } from "@/api/client"
import type { BudgetPlan, BudgetPlanEntry, UpdateBudgetPlanRequest } from "@/api/types"

const BACKEND_TYPE_TO_FRONTEND: Record<string, BudgetPlanEntry["type"]> = {
  Income: "income",
  Expenses: "expense",
  Savings: "savings",
}

const FRONTEND_TYPE_TO_BACKEND: Record<string, string> = {
  income: "Income",
  expense: "Expenses",
  savings: "Savings",
}

interface BackendBudgetPlanAmounts {
  transaction_type: string
  category: string
  amounts: Record<string, number>
}

interface BackendBudgetPlanResponse {
  year: number
  entries: BackendBudgetPlanAmounts[]
}

interface BackendBudgetPlanUpsertResponse {
  success: boolean
  updated: number
}

export async function getBudgetPlan(year: number): Promise<BudgetPlan> {
  const raw = await get<BackendBudgetPlanResponse>(`/budget/plan/${year}`)

  return {
    year: raw.year,
    entries: raw.entries.map((entry) => ({
      category: entry.category,
      type: BACKEND_TYPE_TO_FRONTEND[entry.transaction_type] ?? "expense",
      amounts: Object.fromEntries(
        Object.entries(entry.amounts).map(([k, v]) => [Number(k), v]),
      ),
    })),
  }
}

export async function updateBudgetPlan(
  year: number,
  data: UpdateBudgetPlanRequest,
): Promise<BudgetPlan> {
  const backendEntries = data.entries.flatMap((entry) => {
    const txType = FRONTEND_TYPE_TO_BACKEND[entry.type] ?? entry.type
    return Object.entries(entry.amounts).map(([month, amount]) => ({
      transaction_type: txType,
      category: entry.category,
      month: Number(month),
      planned_amount: amount,
    }))
  })

  await put<BackendBudgetPlanUpsertResponse>(`/budget/plan/${year}`, {
    entries: backendEntries,
  })

  return getBudgetPlan(year)
}
