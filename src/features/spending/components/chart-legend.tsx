import type { CategoryBreakdown } from "@/api/types"
import { formatCurrency } from "@/lib/format"
import { CHART_COLORS } from "@/components/charts/doughnut-chart"

export interface ChartLegendProps {
  data: CategoryBreakdown[]
}

function ChartLegend({ data }: ChartLegendProps) {
  const sorted = [...data].sort((a, b) => b.amount - a.amount)

  return (
    <div className="flex flex-1 flex-col gap-[var(--space-2)]">
      {sorted.map((item, index) => (
        <div key={item.category} className="flex items-center gap-[var(--space-2)]">
          <span
            className="inline-block size-[10px] shrink-0 rounded-[2px]"
            style={{
              backgroundColor:
                CHART_COLORS[
                  data.findIndex((d) => d.category === item.category) %
                    CHART_COLORS.length
                ],
            }}
          />
          <span className="flex-1 truncate text-xs text-[var(--text-secondary)]">
            {item.category}
          </span>
          <span className="font-mono text-xs text-[var(--text-primary)]">
            {formatCurrency(item.amount)}
          </span>
          <span className="font-mono text-xs text-[var(--text-tertiary)]">
            {item.percentage}%
          </span>
        </div>
      ))}
    </div>
  )
}

export { ChartLegend }
