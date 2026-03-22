import { Header } from "@/components/layout/header"
import { ErrorState } from "@/components/error-state"
import { EmptyState } from "@/components/empty-state"
import { BudgetCardView } from "@/features/budget/components/budget-card-view"
import { BudgetGridSkeleton } from "@/features/budget/components/budget-grid-skeleton"
import { useBudgetPlan } from "@/features/budget/hooks/use-budget-plan"

export function BudgetPage() {
  const { data, isLoading, isError, error, refetch } = useBudgetPlan()

  return (
    <div>
      <Header title="Budget Planning" />

      {isLoading && <BudgetGridSkeleton />}

      {isError && (
        <ErrorState
          message={error?.message ?? "Failed to load budget plan."}
          onRetry={() => void refetch()}
        />
      )}

      {!isLoading && !isError && data && data.entries.length === 0 && (
        <EmptyState
          message={`No budget plan for ${data.year}. Create one to get started.`}
        />
      )}

      {!isLoading && !isError && data && data.entries.length > 0 && (
        <BudgetCardView budgetPlan={data} />
      )}
    </div>
  )
}
