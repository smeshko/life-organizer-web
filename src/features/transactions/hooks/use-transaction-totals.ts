import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getTransactionTotals } from "@/api/transactions"
import type { TransactionTypeFilter } from "@/features/transactions/hooks/use-transaction-filters"

export function useTransactionTotals(params?: {
  type?: TransactionTypeFilter
  categories?: string[]
  dateFrom?: string
  dateTo?: string
}) {
  const { selectedYear, selectedPeriod } = useFilter()

  const normalizedType = params?.type && params.type !== "all" ? params.type : undefined

  return useQuery({
    queryKey: [
      "transactionTotals",
      selectedYear,
      selectedPeriod,
      normalizedType,
      params?.categories,
    ],
    queryFn: () =>
      getTransactionTotals(selectedYear, selectedPeriod, {
        type: normalizedType,
        categories: params?.categories?.length ? params.categories : undefined,
      }),
    placeholderData: keepPreviousData,
  })
}
