import { useEffect, useRef } from "react"
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/stat-card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { TransactionTable } from "@/features/transactions/components/transaction-table"
import { TransactionCard } from "@/features/transactions/components/transaction-card"
import { TransactionFilters } from "@/features/transactions/components/transaction-filters"
import { TransactionPagination } from "@/features/transactions/components/transaction-pagination"
import { useTransactions } from "@/features/transactions/hooks/use-transactions"
import { useTransactionFilters } from "@/features/transactions/hooks/use-transaction-filters"
import { useTransactionTotals } from "@/features/transactions/hooks/use-transaction-totals"
import { useUpdateTransaction, useDeleteTransaction } from "@/features/transactions/hooks/use-transaction-mutations"
import { formatCurrency } from "@/lib/format"

export function TransactionsPage() {
  const filters = useTransactionFilters()
  const tableRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError, error, refetch } = useTransactions({
    type: filters.type,
    categories: filters.categories,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    page: filters.page,
  })

  const { data: totals } = useTransactionTotals({
    type: filters.type,
    categories: filters.categories,
  })

  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  // Scroll to top of table on page change
  const pageRef = useRef(filters.page)
  useEffect(() => {
    if (pageRef.current !== filters.page) {
      pageRef.current = filters.page
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [filters.page])

  const summary = totals ?? { income: 0, expenses: 0, savings: 0 }

  // Derive available categories from the current page data for filter suggestions
  const availableCategories = data
    ? Array.from(new Set(data.data.map((tx) => tx.category))).sort()
    : []

  return (
    <div>
      <Header title="Transactions" />

      <div className="space-y-[var(--space-4)]">
        <TransactionFilters
          type={filters.type}
          categories={filters.categories}
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          availableCategories={availableCategories}
          onTypeChange={filters.setType}
          onCategoriesChange={filters.setCategories}
          onDateRangeChange={filters.setDateRange}
        />

        {isLoading && (
          <div className="space-y-[var(--space-4)]">
            <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-3">
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </div>
            <LoadingSkeleton variant="table-row" count={5} />
          </div>
        )}

        {isError && (
          <ErrorState
            message={error?.message ?? "Failed to load transactions."}
            onRetry={() => void refetch()}
          />
        )}

        {!isLoading && !isError && data && data.data.length === 0 && (
          <EmptyState message="No transactions for this period." />
        )}

        {!isLoading && !isError && data && data.data.length > 0 && (
          <div className="space-y-[var(--space-4)]">
            <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-3">
              <StatCard
                type="income"
                label="Income"
                value={formatCurrency(summary.income, "income")}
              />
              <StatCard
                type="expense"
                label="Expenses"
                value={formatCurrency(summary.expenses, "expense")}
              />
              <StatCard
                type="savings"
                label="Savings"
                value={formatCurrency(summary.savings, "savings")}
              />
            </div>

            <div ref={tableRef}>
              {/* Desktop: table view */}
              <div className="hidden md:block">
                <TransactionTable
                  transactions={data.data}
                  total={data.total}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSortChange={filters.setSortBy}
                  page={data.page}
                  pageSize={data.pageSize}
                  onUpdate={(id, updates) => updateMutation.mutate({ id, data: updates })}
                  onDelete={(id) => deleteMutation.mutate(id)}
                />
              </div>

              {/* Mobile: card view */}
              <div className="flex flex-col gap-[var(--space-3)] md:hidden">
                {data.data.map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    tx={tx}
                    onUpdate={(id, updates) => updateMutation.mutate({ id, data: updates })}
                    onDelete={(id) => deleteMutation.mutate(id)}
                  />
                ))}
              </div>
            </div>

            <TransactionPagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={filters.setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
