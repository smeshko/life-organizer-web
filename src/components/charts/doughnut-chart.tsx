import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Sector,
  type PieSectorDataItem,
} from "recharts"
import type { CategoryBreakdown } from "@/api/types"
import { CHART_COLORS } from "@/components/charts/chart-colors"
import { formatCurrency } from "@/lib/format"

export interface DoughnutChartProps {
  data: CategoryBreakdown[]
  totalAmount: number
}

function ActiveShape({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
}: PieSectorDataItem) {
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={(outerRadius ?? 0) + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  )
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: CategoryBreakdown }>
}) {
  if (!active || !payload?.length) return null

  const item = payload[0].payload

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-[var(--space-3)] py-[var(--space-2)] shadow-[var(--shadow-md)]">
      <p className="text-xs font-medium text-[var(--text-primary)]">
        {item.category}
      </p>
      <p className="font-mono text-xs text-[var(--text-secondary)]">
        {formatCurrency(item.amount)} · {item.percentage}%
      </p>
    </div>
  )
}

function DoughnutChart({ data, totalAmount }: DoughnutChartProps) {
  return (
    <div className="relative size-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            animationDuration={300}
            animationEasing="ease"
            activeShape={ActiveShape}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[18px] text-[var(--text-primary)]">
          {formatCurrency(totalAmount)}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
          Total
        </span>
      </div>
    </div>
  )
}

export { DoughnutChart }
