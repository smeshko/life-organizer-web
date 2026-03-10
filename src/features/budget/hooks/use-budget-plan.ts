import { useQuery } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getBudgetPlan } from "@/api/budget-plan"

export function useBudgetPlan() {
  const { selectedYear } = useFilter()

  return useQuery({
    queryKey: ["budget-plan", selectedYear],
    queryFn: () => getBudgetPlan(selectedYear),
  })
}
