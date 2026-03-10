import { useCategoryBreakdown } from "@/features/spending/hooks/use-category-breakdown"
import { ChartContainer } from "@/components/charts/chart-container"
import { DoughnutChart } from "@/components/charts/doughnut-chart"
import { ChartLegend } from "@/features/spending/components/chart-legend"
import { ErrorState } from "@/components/error-state"
import type { CategoryType } from "@/api/budget-tracking"

const CHART_SECTIONS: Array<{ type: CategoryType; title: string; label: string }> = [
  { type: "income", title: "Income", label: "income" },
  { type: "expense", title: "Expenses", label: "expense" },
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
      <ErrorState
        message={error?.message ?? `Failed to load ${label} data.`}
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <ChartContainer
      title={title}
      isLoading={isLoading}
      isEmpty={items.length === 0}
      emptyMessage={`No ${label} data for this period`}
    >
      <div className="flex items-start gap-[var(--space-6)]">
        <DoughnutChart data={items} totalAmount={totalAmount} />
        <ChartLegend data={items} />
      </div>
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
