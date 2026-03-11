import { get, put } from "@/api/client"
import type { BudgetPlan, UpdateBudgetPlanRequest } from "@/api/types"

export async function getBudgetPlan(year: number): Promise<BudgetPlan> {
  return get<BudgetPlan>(`/budget-plans?year=${year}`)
}

export async function updateBudgetPlan(
  year: number,
  data: UpdateBudgetPlanRequest,
): Promise<BudgetPlan> {
  return put<BudgetPlan>("/budget-plans", data)
}
