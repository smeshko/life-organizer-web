import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getTransactions } from "@/api/transactions"
import type { TransactionTypeFilter, SortField, SortOrder } from "@/features/transactions/hooks/use-transaction-filters"

const PAGE_SIZE = 50

export interface UseTransactionsParams {
  type?: TransactionTypeFilter
  categories?: string[]
  dateFrom?: string
  dateTo?: string
  sortBy?: SortField
  sortOrder?: SortOrder
  page?: number
}

export function useTransactions(params?: UseTransactionsParams) {
  const { selectedYear, selectedPeriod } = useFilter()

  const normalizedType = params?.type && params.type !== "all" ? params.type : undefined
  const normalizedCategories = params?.categories?.length ? params.categories : undefined
  const normalizedDateFrom = params?.dateFrom || undefined
  const normalizedDateTo = params?.dateTo || undefined
  const sortBy = params?.sortBy
  const sortOrder = params?.sortOrder
  const page = params?.page

  return useQuery({
    queryKey: [
      "transactions",
      selectedYear,
      selectedPeriod,
      normalizedType,
      normalizedCategories,
      normalizedDateFrom,
      normalizedDateTo,
      sortBy,
      sortOrder,
      page,
    ],
    queryFn: () =>
      getTransactions({
        year: selectedYear,
        period: selectedPeriod,
        type: normalizedType,
        category: normalizedCategories,
        date_from: normalizedDateFrom,
        date_to: normalizedDateTo,
        sortBy,
        sortOrder,
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
  })
}
