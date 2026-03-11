import { Header } from "@/components/layout/header"
import { SpendingCharts } from "@/features/spending/components/spending-charts"
import { useFilter } from "@/contexts/filter-context"

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatPeriodSubtitle(year: number, period: "total" | number): string {
  if (period === "total") return `${year}`
  return `${MONTH_NAMES[period - 1]} ${year}`
}

export function SpendingPage() {
  const { selectedYear, selectedPeriod } = useFilter()

  return (
    <div>
      <Header title="Category Spending" />
      <p className="pb-[var(--space-4)] text-sm text-[var(--text-secondary)]">
        {formatPeriodSubtitle(selectedYear, selectedPeriod)}
      </p>
      <SpendingCharts />
    </div>
  )
}
