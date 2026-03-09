import { cn } from "@/lib/utils"

const borderColorMap = {
  income: "border-l-[var(--income-400)]",
  expense: "border-l-[var(--expense-400)]",
  savings: "border-l-[var(--savings-400)]",
  balance: "border-l-[var(--accent-400)]",
} as const

const valueColorMap = {
  income: "text-[var(--income-300)]",
  expense: "text-[var(--expense-300)]",
  savings: "text-[var(--savings-300)]",
  balance: "text-[var(--text-primary)]",
} as const

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "income" | "expense" | "savings" | "balance"
  label: string
  value: string
  change?: string
  changeColor?: string
}

function StatCard({
  type,
  label,
  value,
  change,
  changeColor,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-[var(--border-subtle)] border-l-[3px] bg-[var(--bg-surface)] px-[var(--space-5)] py-[var(--space-4)]",
        borderColorMap[type],
        className,
      )}
      {...props}
    >
      <div className="mb-[var(--space-2)] text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text-tertiary)]">
        {label}
      </div>
      <div
        className={cn(
          "font-mono text-[24px] font-medium tracking-[-0.5px]",
          valueColorMap[type],
        )}
      >
        {value}
      </div>
      {change && (
        <div
          data-slot="change"
          className="mt-[var(--space-1)] text-[12px] text-[var(--text-tertiary)]"
          style={changeColor ? { color: changeColor } : undefined}
        >
          {change}
        </div>
      )}
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
