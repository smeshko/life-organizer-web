import { Header } from "@/components/layout/header"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { ComparisonTable } from "@/features/budget-vs-actual/comparison-table"
import { BudgetVsActualSkeleton } from "@/features/budget-vs-actual/budget-vs-actual-skeleton"
import { useBudgetVsActual } from "@/features/budget-vs-actual/hooks/use-budget-vs-actual"
import { useFilter } from "@/contexts/filter-context"

const SECTIONS = [
  { key: "expense", label: "Expenses" },
  { key: "income", label: "Income" },
  { key: "savings", label: "Savings" },
] as const

export function BudgetVsActualPage() {
  const { selectedYear } = useFilter()
  const { data, isLoading, isError, error, refetch } = useBudgetVsActual()

  return (
    <div>
      <Header title="Budget vs Actual" />

      {isLoading && <BudgetVsActualSkeleton />}

      {isError && (
        <ErrorState
          message={error?.message ?? "Failed to load budget vs actual data."}
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <EmptyState
          message={`No budget plan for ${selectedYear}. Create one in Budget Planning.`}
        />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <div className="flex flex-col gap-[var(--space-6)]">
          {SECTIONS.map(({ key, label }) => (
            <section
              key={key}
              className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-[var(--space-4)]"
            >
              <h2 className="mb-[var(--space-3)] font-sans text-sm font-semibold text-[var(--text-primary)]">
                {label}
              </h2>
              <ComparisonTable entries={data} type={key} />
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
