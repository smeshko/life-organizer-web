import { get } from "@/api/client"
import type { CategoryBreakdown } from "@/api/types"

export type CategoryType = "income" | "expense" | "savings"

export async function getCategoryBreakdown(
  year: number,
  period: "total" | number,
  type: CategoryType,
): Promise<CategoryBreakdown[]> {
  const searchParams = new URLSearchParams()
  searchParams.set("year", String(year))
  searchParams.set("period", String(period))
  searchParams.set("type", type)

  return get<CategoryBreakdown[]>(`/category-breakdown?${searchParams.toString()}`)
}
