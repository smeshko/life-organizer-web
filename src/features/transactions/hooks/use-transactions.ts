import { useQuery } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getTransactions } from "@/api/transactions"
import type { TransactionTypeFilter } from "@/features/transactions/hooks/use-transaction-filters"

export interface UseTransactionsParams {
  type?: TransactionTypeFilter
  categories?: string[]
  dateFrom?: string
  dateTo?: string
}

export function useTransactions(params?: UseTransactionsParams) {
  const { selectedYear, selectedPeriod } = useFilter()

  const type = params?.type
  const categories = params?.categories
  const dateFrom = params?.dateFrom
  const dateTo = params?.dateTo

  return useQuery({
    queryKey: ["transactions", selectedYear, selectedPeriod, type, categories, dateFrom, dateTo],
    queryFn: () =>
      getTransactions({
        year: selectedYear,
        period: selectedPeriod,
        type: type && type !== "all" ? type : undefined,
        category: categories && categories.length > 0 ? categories : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      }),
  })
}
