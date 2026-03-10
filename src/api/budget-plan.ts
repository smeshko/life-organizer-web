import { get } from "@/api/client"
import type { BudgetPlan } from "@/api/types"

export async function getBudgetPlan(year: number): Promise<BudgetPlan> {
  return get<BudgetPlan>(`/budget-plans?year=${year}`)
}
