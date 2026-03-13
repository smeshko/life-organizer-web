import { useCategoryBreakdown } from "@/features/spending/hooks/use-category-breakdown"
import { ChartContainer } from "@/components/charts/chart-container"
import { CategoryBreakdownBars } from "@/features/spending/components/category-breakdown-bars"
import { ErrorState } from "@/components/error-state"
import type { CategoryType } from "@/api/budget-tracking"

const CHART_SECTIONS: Array<{ type: CategoryType; title: string; label: string }> = [
  { type: "income", title: "Income", label: "income" },
  { type: "expense", title: "Expenses", label: "expenses" },
  { type: "savings", title: "Savings", label: "savings" },
]

function SpendingChartSection({
  type,
  title,
  label,
}: {
  type: CategoryType
  title: string
  label: string
}) {
  const { data, isLoading, isError, error, refetch } = useCategoryBreakdown(type)

  const items = data ?? []
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  if (isError) {
    return (
      <section className="rounded-[var(--radius-lg)] bg-[var(--bg-surface)] p-[var(--space-6)]">
        <h2 className="mb-[var(--space-4)] font-sans text-sm font-medium text-[var(--text-secondary)]">
          {title}
        </h2>
        <ErrorState
          message={error?.message ?? `Failed to load ${label} data.`}
          onRetry={() => void refetch()}
        />
      </section>
    )
  }

  return (
    <ChartContainer
      title={title}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      emptyMessage={`No ${label} data for this period`}
    >
      <CategoryBreakdownBars data={items} totalAmount={totalAmount} type={type} />
    </ChartContainer>
  )
}

function SpendingCharts() {
  return (
    <div className="space-y-[var(--space-4)]">
      {CHART_SECTIONS.map(({ type, title, label }) => (
        <SpendingChartSection
          key={type}
          type={type}
          title={title}
          label={label}
        />
      ))}
    </div>
  )
}

export { SpendingCharts }
