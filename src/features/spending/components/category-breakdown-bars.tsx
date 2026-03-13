import { useState } from "react"
import type { CategoryBreakdown } from "@/api/types"
import type { CategoryType } from "@/api/budget-tracking"
import { formatCurrency } from "@/lib/format"

const TYPE_COLORS: Record<CategoryType, { bar: string; barBg: string; hover: string }> = {
  income: {
    bar: "var(--income-300)",
    barBg: "var(--income-bg-strong)",
    hover: "var(--income-400)",
  },
  expense: {
    bar: "var(--expense-300)",
    barBg: "var(--expense-bg-strong)",
    hover: "var(--expense-400)",
  },
  savings: {
    bar: "var(--savings-300)",
    barBg: "var(--savings-bg-strong)",
    hover: "var(--savings-400)",
  },
}

interface CategoryBreakdownBarsProps {
  data: CategoryBreakdown[]
  totalAmount: number
  type: CategoryType
}

function CategoryBreakdownBars({ data, totalAmount, type }: CategoryBreakdownBarsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const sorted = [...data].sort((a, b) => b.amount - a.amount)
  const maxAmount = sorted[0]?.amount ?? 0
  const colors = TYPE_COLORS[type]

  return (
    <div>
      <div className="mb-[var(--space-4)] flex items-baseline gap-[var(--space-2)]">
        <span className="font-mono text-[22px] font-medium text-[var(--text-primary)]">
          {formatCurrency(totalAmount)}
        </span>
        <span className="text-[11px] uppercase tracking-wide text-[var(--text-tertiary)]">
          total across {sorted.length} categories
        </span>
      </div>

      <div className="flex flex-col gap-[var(--space-1)]">
        {sorted.map((item, index) => {
          const widthPercent = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0
          const isHovered = hoveredIndex === index

          return (
            <div
              key={item.category}
              className="group grid items-center gap-[var(--space-3)] transition-colors duration-100"
              style={{ gridTemplateColumns: "140px 1fr 90px 44px" }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span
                className="truncate text-xs text-[var(--text-secondary)]"
                title={item.category}
              >
                {item.category}
              </span>

              <div
                className="relative h-[20px] rounded-[2px] overflow-hidden"
                style={{ backgroundColor: colors.barBg }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-[2px] transition-all duration-200"
                  style={{
                    width: `${Math.max(widthPercent, 1)}%`,
                    backgroundColor: isHovered ? colors.hover : colors.bar,
                  }}
                />
              </div>

              <span className="text-right font-mono text-xs text-[var(--text-primary)]">
                {formatCurrency(item.amount)}
              </span>

              <span className="text-right font-mono text-[11px] text-[var(--text-tertiary)]">
                {item.percentage}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { CategoryBreakdownBars }
