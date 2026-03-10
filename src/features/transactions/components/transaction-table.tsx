import type { Transaction } from "@/api/types"
import { formatCurrency, formatDate } from "@/lib/format"
import { TypeBadge } from "@/components/type-badge"
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

export function TransactionTable({ transactions, total }: TransactionTableProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="flex items-center justify-between px-[var(--space-5)] py-[var(--space-4)]">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          Recent Transactions
        </h2>
        <span className="text-[11px] text-[var(--text-tertiary)]">
          Showing {transactions.length} of {total}
        </span>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-[var(--border-subtle)]">
            <TableHead className={HEAD_CLASS}>Date</TableHead>
            <TableHead className={HEAD_CLASS}>Type</TableHead>
            <TableHead className={HEAD_CLASS}>Category</TableHead>
            <TableHead className={HEAD_CLASS}>Details</TableHead>
            <TableHead className={`${HEAD_CLASS} text-right`}>Amount</TableHead>
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
}
