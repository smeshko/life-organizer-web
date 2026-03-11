import { useState, useMemo } from "react"
import type { BudgetPlan } from "@/api/types"
import { BudgetSection } from "./budget-section"
import { AllocationIndicator } from "./allocation-indicator"
import { useUpdateBudget } from "@/features/budget/hooks/use-update-budget"
import {
  buildCellGrid,
  getNextCell,
} from "@/features/budget/utils/grid-navigation"
import type { NavigationDirection } from "./budget-cell"

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

interface BudgetGridProps {
  budgetPlan: BudgetPlan
}

export function BudgetGrid({ budgetPlan }: BudgetGridProps) {
  const [editingCellId, setEditingCellId] = useState<string | null>(null)
  const mutation = useUpdateBudget(budgetPlan.year)

  const incomeEntries = budgetPlan.entries.filter((e) => e.type === "income")
  const expenseEntries = budgetPlan.entries.filter((e) => e.type === "expense")
  const savingsEntries = budgetPlan.entries.filter((e) => e.type === "savings")

  // Build flat ordered list of all editable cells
  const cellGrid = useMemo(
    () =>
      buildCellGrid([...incomeEntries, ...expenseEntries, ...savingsEntries]),
    [incomeEntries, expenseEntries, savingsEntries],
  )

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

  function handleCellSave(
    category: string,
    type: "income" | "expense" | "savings",
    month: number,
    newValue: number,
  ) {
    mutation.mutate({ category, type, month, value: newValue })
  }

  function handleCellNavigate(cellId: string, direction: NavigationDirection) {
    if (direction === "cancel") {
      setEditingCellId(null)
      return
    }

    const nextCellId = getNextCell(cellId, direction, cellGrid)
    setEditingCellId(nextCellId)
  }

  function handleEditStart(cellId: string) {
    setEditingCellId(cellId)
  }

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
          <BudgetSection
            type="income"
            entries={incomeEntries}
            editingCellId={editingCellId}
            onCellSave={handleCellSave}
            onCellNavigate={handleCellNavigate}
            onEditStart={handleEditStart}
          />
          <BudgetSection
            type="expense"
            entries={expenseEntries}
            editingCellId={editingCellId}
            onCellSave={handleCellSave}
            onCellNavigate={handleCellNavigate}
            onEditStart={handleEditStart}
          />
          <BudgetSection
            type="savings"
            entries={savingsEntries}
            editingCellId={editingCellId}
            onCellSave={handleCellSave}
            onCellNavigate={handleCellNavigate}
            onEditStart={handleEditStart}
          />
          <AllocationIndicator allocations={allocations} />
        </tbody>
      </table>
    </div>
  )
}
