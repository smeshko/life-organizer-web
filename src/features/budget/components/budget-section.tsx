import type { BudgetPlanEntry } from "@/api/types"
import { formatCurrency } from "@/lib/format"

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

const SECTION_CONFIG = {
  income: { label: "INCOME", color: "var(--income-300)" },
  expense: { label: "EXPENSES", color: "var(--expense-300)" },
  savings: { label: "SAVINGS", color: "var(--savings-300)" },
} as const

interface BudgetSectionProps {
  type: "income" | "expense" | "savings"
  entries: BudgetPlanEntry[]
}

export function BudgetSection({ type, entries }: BudgetSectionProps) {
  const config = SECTION_CONFIG[type]

  // Compute monthly totals for the section
  const monthlyTotals = MONTHS.map((month) =>
    entries.reduce((sum, entry) => sum + (entry.amounts[month] ?? 0), 0),
  )

  const sectionAnnualTotal = monthlyTotals.reduce((sum, v) => sum + v, 0)

  return (
    <>
      {/* Section header row */}
      <tr>
        <td
          colSpan={14}
          className="px-[var(--space-3)] py-[var(--space-2)]"
          style={{
            fontSize: "11px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: config.color,
            fontWeight: 600,
          }}
        >
          {config.label}
        </td>
      </tr>

      {/* Category rows */}
      {entries.map((entry) => {
        const annualTotal = MONTHS.reduce(
          (sum, month) => sum + (entry.amounts[month] ?? 0),
          0,
        )

        return (
          <tr key={entry.category} className="group">
            <td
              className="sticky left-0 z-10 bg-[var(--bg-root)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-[var(--text-primary)]"
            >
              {entry.category}
            </td>
            {MONTHS.map((month) => {
              const amount = entry.amounts[month] ?? 0
              return (
                <td
                  key={month}
                  className="px-[var(--space-3)] py-[var(--space-2)] text-right font-mono text-xs text-[var(--text-secondary)] group-hover:outline group-hover:outline-1 group-hover:outline-[var(--border-default)]"
                >
                  {amount === 0 ? "—" : formatCurrency(amount)}
                </td>
              )
            })}
            <td
              className="px-[var(--space-3)] py-[var(--space-2)] text-right font-mono text-xs font-bold text-[var(--text-primary)]"
            >
              {annualTotal === 0 ? "—" : formatCurrency(annualTotal)}
            </td>
          </tr>
        )
      })}

      {/* Section total row */}
      <tr
        className="bg-[var(--bg-raised)] font-bold"
        style={{ borderBottom: "2px double var(--border-default)" }}
      >
        <td
          className="sticky left-0 z-10 bg-[var(--bg-raised)] px-[var(--space-3)] py-[var(--space-2)] text-sm"
          style={{ color: config.color }}
        >
          Total {config.label.charAt(0) + config.label.slice(1).toLowerCase()}
        </td>
        {monthlyTotals.map((total, i) => (
          <td
            key={i}
            className="px-[var(--space-3)] py-[var(--space-2)] text-right font-mono text-xs"
            style={{ color: config.color }}
          >
            {total === 0 ? "—" : formatCurrency(total)}
          </td>
        ))}
        <td
          className="px-[var(--space-3)] py-[var(--space-2)] text-right font-mono text-xs"
          style={{ color: config.color }}
        >
          {sectionAnnualTotal === 0 ? "—" : formatCurrency(sectionAnnualTotal)}
        </td>
      </tr>
    </>
  )
}
