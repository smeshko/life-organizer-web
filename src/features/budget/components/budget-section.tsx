import type { BudgetPlanEntry } from "@/api/types"
import { formatCurrency } from "@/lib/format"
import { BudgetCell, type NavigationDirection } from "./budget-cell"

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const

const SECTION_CONFIG = {
  income: { label: "INCOME", color: "var(--income-300)" },
  expense: { label: "EXPENSES", color: "var(--expense-300)" },
  savings: { label: "SAVINGS", color: "var(--savings-300)" },
} as const

interface BudgetSectionProps {
  type: "income" | "expense" | "savings"
  entries: BudgetPlanEntry[]
  editingCellId: string | null
  onCellSave: (category: string, type: "income" | "expense" | "savings", month: number, value: number) => void
  onCellNavigate: (cellId: string, direction: NavigationDirection) => void
  onEditStart: (cellId: string) => void
}

export function BudgetSection({
  type,
  entries,
  editingCellId,
  onCellSave,
  onCellNavigate,
  onEditStart,
}: BudgetSectionProps) {
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
              const cellId = `${type}-${entry.category}-${month}`
              const amount = entry.amounts[month] ?? 0
              return (
                <BudgetCell
                  key={month}
                  value={amount}
                  category={entry.category}
                  month={month}
                  type={type}
                  cellId={cellId}
                  editingCellId={editingCellId}
                  onSave={(value) => onCellSave(entry.category, type, month, value)}
                  onNavigate={(direction) => onCellNavigate(cellId, direction)}
                  onEditStart={onEditStart}
                />
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
