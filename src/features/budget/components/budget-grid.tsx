import type { BudgetPlan } from "@/api/types"
import { BudgetSection } from "./budget-section"
import { AllocationIndicator } from "./allocation-indicator"

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

interface BudgetGridProps {
  budgetPlan: BudgetPlan
}

export function BudgetGrid({ budgetPlan }: BudgetGridProps) {
  const incomeEntries = budgetPlan.entries.filter((e) => e.type === "income")
  const expenseEntries = budgetPlan.entries.filter((e) => e.type === "expense")
  const savingsEntries = budgetPlan.entries.filter((e) => e.type === "savings")

  // Compute monthly totals per section for allocation row
  const allocations = MONTHS.map((month) => {
    const income = incomeEntries.reduce(
      (sum, e) => sum + (e.amounts[month] ?? 0),
      0,
    )
    const expenses = expenseEntries.reduce(
      (sum, e) => sum + (e.amounts[month] ?? 0),
      0,
    )
    const savings = savingsEntries.reduce(
      (sum, e) => sum + (e.amounts[month] ?? 0),
      0,
    )
    return income - expenses - savings
  })

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th
              className="sticky left-0 z-10 bg-[var(--bg-root)] px-[var(--space-3)] py-[var(--space-2)] text-left text-sm text-[var(--text-secondary)]"
            >
              Category
            </th>
            {MONTH_LABELS.map((label) => (
              <th
                key={label}
                className="px-[var(--space-3)] py-[var(--space-2)] text-right"
                style={{
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                }}
              >
                {label}
              </th>
            ))}
            <th
              className="px-[var(--space-3)] py-[var(--space-2)] text-right"
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
              }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <BudgetSection type="income" entries={incomeEntries} />
          <BudgetSection type="expense" entries={expenseEntries} />
          <BudgetSection type="savings" entries={savingsEntries} />
          <AllocationIndicator allocations={allocations} />
        </tbody>
      </table>
    </div>
  )
}
