import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { CompletionBar } from "@/features/budget-vs-actual/completion-bar"
import type { BudgetVsActualEntry } from "@/api/types"

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatAmount(amount: number): string {
  return `€ ${numberFormatter.format(amount)}`
}

function formatExcess(amount: number): string {
  return `−€ ${numberFormatter.format(amount)}`
}

interface ComparisonTableProps {
  entries: BudgetVsActualEntry[]
  type: "income" | "expense" | "savings"
}

function ComparisonTable({ entries, type }: ComparisonTableProps) {
  const filtered = entries
    .filter((e) => e.type === type)
    .sort((a, b) => (b.actual - b.budgeted) - (a.actual - a.budgeted))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead style={{ width: 160 }} className="font-sans text-[13px] font-medium text-[var(--text-primary)]">
            Category
          </TableHead>
          <TableHead style={{ width: 100 }} className="font-mono text-[13px] text-[var(--text-secondary)]">
            Budget
          </TableHead>
          <TableHead style={{ width: 100 }} className="font-mono text-[13px] text-[var(--text-secondary)]">
            Actual
          </TableHead>
          <TableHead style={{ width: 200 }} className="text-[13px] text-[var(--text-secondary)]">
            Progress
          </TableHead>
          <TableHead style={{ width: 80 }} className="text-[13px] text-[var(--text-secondary)]">
            %
          </TableHead>
          <TableHead style={{ width: 110 }} className="text-[13px] text-[var(--text-secondary)]">
            Remaining
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((entry) => {
          const isOverBudget = entry.excess > 0
          const isZeroBudget = entry.budgeted === 0

          return (
            <TableRow key={entry.category}>
              <TableCell className="font-sans text-[13px] font-medium text-[var(--text-primary)]" style={{ width: 160 }}>
                {entry.category}
              </TableCell>
              <TableCell className="font-mono text-[13px] text-[var(--text-secondary)]" style={{ width: 100 }}>
                {formatAmount(entry.budgeted)}
              </TableCell>
              <TableCell className="font-mono text-[13px] text-[var(--text-secondary)]" style={{ width: 100 }}>
                {formatAmount(entry.actual)}
              </TableCell>
              <TableCell style={{ width: 200 }}>
                <CompletionBar percentage={entry.percentComplete} />
              </TableCell>
              <TableCell style={{ width: 80 }}>
                {isZeroBudget ? (
                  <span className="font-mono text-[13px] text-[var(--text-secondary)]">
                    —
                  </span>
                ) : (
                  <span
                    className={`font-mono text-[13px] ${
                      entry.percentComplete > 100
                        ? "text-[var(--expense-400)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {Math.round(entry.percentComplete)}%
                  </span>
                )}
              </TableCell>
              <TableCell style={{ width: 110 }}>
                {isOverBudget ? (
                  <span className="font-mono text-[13px] text-[var(--expense-400)]">
                    {formatExcess(entry.excess)}
                  </span>
                ) : (
                  <span className="font-mono text-[13px] text-[var(--income-400)]">
                    {formatAmount(entry.remaining)}
                  </span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export { ComparisonTable }
export type { ComparisonTableProps }
