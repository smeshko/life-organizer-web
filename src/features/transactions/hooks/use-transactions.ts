import { useQuery } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getTransactions } from "@/api/transactions"

export function useTransactions() {
  const { selectedYear, selectedPeriod } = useFilter()

  return useQuery({
    queryKey: ["transactions", selectedYear, selectedPeriod],
    queryFn: () =>
      getTransactions({
        year: selectedYear,
        period: selectedPeriod,
      }),
  })
}
