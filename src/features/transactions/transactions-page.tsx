import { useMemo } from "react"
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/stat-card"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { TransactionTable } from "@/features/transactions/components/transaction-table"
import { TransactionFilters } from "@/features/transactions/components/transaction-filters"
import { useTransactions } from "@/features/transactions/hooks/use-transactions"
import { useTransactionFilters } from "@/features/transactions/hooks/use-transaction-filters"
import { getTransactionSummary } from "@/api/transactions"
import { formatCurrency } from "@/lib/format"

export function TransactionsPage() {
  const filters = useTransactionFilters()

  const { data, isLoading, isError, error, refetch } = useTransactions({
    type: filters.type,
    categories: filters.categories,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
  })

  const summary = data
    ? getTransactionSummary(data.data)
    : { income: 0, expenses: 0, savings: 0 }

  const transactions = data?.data
  const availableCategories = useMemo(() => {
    if (!transactions) return []
    const cats = new Set(transactions.map((tx) => tx.category))
    return Array.from(cats).sort()
  }, [transactions])

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
            <div className="grid grid-cols-3 gap-[var(--space-4)]">
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
            <div className="grid grid-cols-3 gap-[var(--space-4)]">
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

            <TransactionTable
              transactions={data.data}
              total={data.total}
            />
          </div>
        )}
      </div>
    </div>
  )
}
