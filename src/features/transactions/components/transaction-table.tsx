import { forwardRef, useState, useRef, useEffect, useCallback } from "react"
import type { Transaction } from "@/api/types"
import type { SortField, SortOrder } from "@/features/transactions/hooks/use-transaction-filters"
import { formatCurrency, formatDate } from "@/lib/format"
import { TypeBadge } from "@/components/type-badge"
import { ArrowUp, ArrowDown, Check, X, Trash2 } from "lucide-react"
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
  onUpdate?: (id: string, data: Partial<Pick<Transaction, "date" | "category" | "amount" | "details">>) => void
  onDelete?: (id: string) => void
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

interface EditableRowProps {
  tx: Transaction
  onSave: (data: Partial<Pick<Transaction, "date" | "category" | "amount" | "details">>) => void
  onCancel: () => void
  onDelete: () => void
}

function EditableRow({ tx, onSave, onCancel, onDelete }: EditableRowProps) {
  const [date, setDate] = useState(tx.date.slice(0, 10))
  const [category, setCategory] = useState(tx.category)
  const [details, setDetails] = useState(tx.details)
  const [amount, setAmount] = useState(String(Math.abs(tx.amount)))
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  const handleSave = useCallback(() => {
    const parsedAmount = parseFloat(amount) || 0
    const updates: Partial<Pick<Transaction, "date" | "category" | "amount" | "details">> = {}

    if (date !== tx.date.slice(0, 10)) updates.date = date
    if (category !== tx.category) updates.category = category
    if (details !== tx.details) updates.details = details
    if (parsedAmount !== Math.abs(tx.amount)) {
      updates.amount = tx.type === "expense" ? -parsedAmount : parsedAmount
    }

    if (Object.keys(updates).length > 0) {
      onSave(updates)
    } else {
      onCancel()
    }
  }, [date, category, details, amount, tx, onSave, onCancel])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      onCancel()
    }
  }

  const inputClass =
    "w-full bg-transparent outline-none rounded-[2px] px-1 py-0.5 transition-shadow duration-100 focus:shadow-[0_0_0_1px_var(--income-border)]"

  return (
    <TableRow className="border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
      <TableCell className="py-[8px]">
        <input
          ref={firstInputRef}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${inputClass} text-[var(--text-secondary)]`}
        />
      </TableCell>
      <TableCell className="py-[8px]">
        <TypeBadge variant={tx.type}>{typeLabel[tx.type]}</TypeBadge>
      </TableCell>
      <TableCell className="py-[8px]">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${inputClass} text-[var(--text-secondary)]`}
        />
      </TableCell>
      <TableCell className="py-[8px]">
        <input
          type="text"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${inputClass} text-[var(--text-primary)]`}
        />
      </TableCell>
      <TableCell className="py-[8px]">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, "")
            setAmount(val)
          }}
          onKeyDown={handleKeyDown}
          className={`${inputClass} text-right font-mono ${amountColorMap[tx.type]}`}
        />
      </TableCell>
      <TableCell className="py-[8px]">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleSave}
            className="rounded-[var(--radius-sm)] p-1 text-[var(--income-300)] hover:bg-[var(--income-bg-strong)] transition-colors"
            title="Save (Enter)"
          >
            <Check size={14} />
          </button>
          <button
            onClick={onCancel}
            className="rounded-[var(--radius-sm)] p-1 text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
            title="Cancel (Esc)"
          >
            <X size={14} />
          </button>
          <button
            onClick={onDelete}
            className="rounded-[var(--radius-sm)] p-1 text-[var(--expense-300)] hover:bg-[var(--expense-bg-strong)] transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export const TransactionTable = forwardRef<HTMLDivElement, TransactionTableProps>(
  function TransactionTable({ transactions, total, sortBy, sortOrder, onSortChange, page, pageSize, onUpdate, onDelete }, ref) {
  const [editingId, setEditingId] = useState<string | null>(null)

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
            {(onUpdate || onDelete) && (
              <TableHead className={`${HEAD_CLASS} w-[80px]`} />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) =>
            editingId === tx.id ? (
              <EditableRow
                key={tx.id}
                tx={tx}
                onSave={(updates) => {
                  onUpdate?.(tx.id, updates)
                  setEditingId(null)
                }}
                onCancel={() => setEditingId(null)}
                onDelete={() => {
                  onDelete?.(tx.id)
                  setEditingId(null)
                }}
              />
            ) : (
              <TableRow
                key={tx.id}
                className="border-[var(--border-subtle)] transition-colors duration-150 hover:bg-[var(--bg-hover)] cursor-pointer"
                onClick={() => setEditingId(tx.id)}
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
                {(onUpdate || onDelete) && (
                  <TableCell className="py-[12px]" />
                )}
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </div>
  )
})
