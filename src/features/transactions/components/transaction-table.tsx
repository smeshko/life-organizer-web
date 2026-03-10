import { forwardRef } from "react"
import type { Transaction } from "@/api/types"
import type { SortField, SortOrder } from "@/features/transactions/hooks/use-transaction-filters"
import { formatCurrency, formatDate } from "@/lib/format"
import { TypeBadge } from "@/components/type-badge"
import { ArrowUp, ArrowDown } from "lucide-react"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface TransactionTableProps {
  transactions: Transaction[]
  total: number
  sortBy: SortField
  sortOrder: SortOrder
  onSortChange: (field: SortField) => void
  page?: number
  pageSize?: number
}

const amountColorMap = {
  income: "text-[var(--income-300)]",
  expense: "text-[var(--expense-300)]",
  savings: "text-[var(--savings-300)]",
} as const

const typeLabel: Record<Transaction["type"], string> = {
  income: "Income",
  expense: "Expense",
  savings: "Savings",
}

const HEAD_CLASS =
  "text-[11px] uppercase tracking-[1px] text-[var(--text-tertiary)] font-semibold"

const SORTABLE_HEAD_CLASS =
  `${HEAD_CLASS} cursor-pointer select-none hover:underline`

function SortIndicator({ field, sortBy, sortOrder }: { field: SortField; sortBy: SortField; sortOrder: SortOrder }) {
  if (field !== sortBy) return null
  const Icon = sortOrder === "asc" ? ArrowUp : ArrowDown
  return <Icon size={14} className="inline ml-1 text-[var(--text-tertiary)]" />
}

export const TransactionTable = forwardRef<HTMLDivElement, TransactionTableProps>(
  function TransactionTable({ transactions, total, sortBy, sortOrder, onSortChange, page, pageSize }, ref) {
  const showingText = page && pageSize
    ? (() => {
        const start = (page - 1) * pageSize + 1
        const end = Math.min(page * pageSize, total)
        return `Showing ${start}–${end} of ${total}`
      })()
    : `Showing ${transactions.length} of ${total}`

  return (
    <div ref={ref} className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="flex items-center justify-between px-[var(--space-5)] py-[var(--space-4)]">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Recent Transactions
        </h2>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          {showingText}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-[var(--border-subtle)]">
            <TableHead className={SORTABLE_HEAD_CLASS} onClick={() => onSortChange("date")}>
              Date
              <SortIndicator field="date" sortBy={sortBy} sortOrder={sortOrder} />
            </TableHead>
            <TableHead className={HEAD_CLASS}>Type</TableHead>
            <TableHead className={HEAD_CLASS}>Category</TableHead>
            <TableHead className={HEAD_CLASS}>Details</TableHead>
            <TableHead className={`${SORTABLE_HEAD_CLASS} text-right`} onClick={() => onSortChange("amount")}>
              Amount
              <SortIndicator field="amount" sortBy={sortBy} sortOrder={sortOrder} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow
              key={tx.id}
              className="border-[var(--border-subtle)] transition-colors duration-150 hover:bg-[var(--bg-hover)]"
            >
              <TableCell className="py-[12px] text-[var(--text-secondary)]">
                {formatDate(tx.date)}
              </TableCell>
              <TableCell className="py-[12px]">
                <TypeBadge variant={tx.type}>{typeLabel[tx.type]}</TypeBadge>
              </TableCell>
              <TableCell className="py-[12px] text-[var(--text-secondary)]">
                {tx.category}
              </TableCell>
              <TableCell className="py-[12px] text-[var(--text-primary)]">
                {tx.details}
              </TableCell>
              <TableCell
                className={`py-[12px] text-right font-mono ${amountColorMap[tx.type]}`}
              >
                {formatCurrency(tx.amount, tx.type)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})
