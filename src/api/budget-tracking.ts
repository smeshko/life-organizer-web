import { get } from "@/api/client"
import type { BudgetVsActualEntry } from "@/api/types"

export async function getBudgetVsActual(
  year: number,
  period: "total" | number,
): Promise<BudgetVsActualEntry[]> {
  return get<BudgetVsActualEntry[]>(
    `/budget-vs-actual?year=${year}&period=${period}`,
  )
}
