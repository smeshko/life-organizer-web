import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getCategoryBreakdown } from "@/api/budget-tracking"
import type { CategoryType } from "@/api/budget-tracking"

export function useCategoryBreakdown(type: CategoryType) {
  const { selectedYear, selectedPeriod } = useFilter()

  return useQuery({
    queryKey: ["categoryBreakdown", selectedYear, selectedPeriod, type],
    queryFn: () => getCategoryBreakdown(selectedYear, selectedPeriod, type),
    placeholderData: keepPreviousData,
  })
}
