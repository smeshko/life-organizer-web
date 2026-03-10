import { useQuery } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getBudgetVsActual } from "@/api/budget-tracking"

export function useBudgetVsActual() {
  const { selectedYear, selectedPeriod } = useFilter()

  return useQuery({
    queryKey: ["budget-vs-actual", selectedYear, selectedPeriod],
    queryFn: () => getBudgetVsActual(selectedYear, selectedPeriod),
  })
}
