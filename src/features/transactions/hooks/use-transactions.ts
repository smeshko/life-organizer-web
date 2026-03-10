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

  const normalizedType = params?.type && params.type !== "all" ? params.type : undefined
  const normalizedCategories = params?.categories?.length ? params.categories : undefined
  const normalizedDateFrom = params?.dateFrom || undefined
  const normalizedDateTo = params?.dateTo || undefined

  return useQuery({
    queryKey: [
      "transactions",
      selectedYear,
      selectedPeriod,
      normalizedType,
      normalizedCategories,
      normalizedDateFrom,
      normalizedDateTo,
    ],
    queryFn: () =>
      getTransactions({
        year: selectedYear,
        period: selectedPeriod,
        type: normalizedType,
        category: normalizedCategories,
        date_from: normalizedDateFrom,
        date_to: normalizedDateTo,
      }),
  })
}
