import { useState, useCallback } from "react"
import type { Transaction } from "@/api/types"
import { formatCurrency, formatDate } from "@/lib/format"
import { TypeBadge } from "@/components/type-badge"
import { Check, X, Trash2 } from "lucide-react"

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

interface TransactionCardProps {
  tx: Transaction
  onUpdate?: (id: string, data: Partial<Pick<Transaction, "date" | "category" | "amount" | "details">>) => void
  onDelete?: (id: string) => void
}

function EditableCard({
  tx,
  onSave,
  onCancel,
  onDelete,
}: {
  tx: Transaction
  onSave: (data: Partial<Pick<Transaction, "date" | "category" | "amount" | "details">>) => void
  onCancel: () => void
  onDelete: () => void
}) {
  const [date, setDate] = useState(tx.date.slice(0, 10))
  const [category, setCategory] = useState(tx.category)
  const [details, setDetails] = useState(tx.details)
  const [amount, setAmount] = useState(String(Math.abs(tx.amount)))

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

  const inputClass =
    "w-full rounded-[var(--radius-sm)] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-[var(--space-3)] py-[var(--space-2)] text-[14px] text-[var(--text-primary)] outline-none focus:ring-1 focus:ring-[var(--accent-400)]"

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--accent-400)] bg-[var(--bg-elevated)] p-[var(--space-4)]">
      <div className="flex flex-col gap-[var(--space-3)]">
        <div className="grid grid-cols-2 gap-[var(--space-3)]">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">Amount</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className={`${inputClass} text-right font-mono ${amountColorMap[tx.type]}`}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">Category</span>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">Details</span>
          <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} className={inputClass} />
        </label>
      </div>

      <div className="mt-[var(--space-4)] flex items-center justify-end gap-[var(--space-2)]">
        <button
          onClick={onDelete}
          className="mr-auto rounded-[var(--radius-sm)] p-[var(--space-2)] text-[var(--expense-300)] hover:bg-[var(--expense-bg-strong)] transition-colors"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={onCancel}
          className="rounded-[var(--radius-sm)] p-[var(--space-2)] text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
          title="Cancel"
        >
          <X size={18} />
        </button>
        <button
          onClick={handleSave}
          className="rounded-[var(--radius-sm)] p-[var(--space-2)] text-[var(--income-300)] hover:bg-[var(--income-bg-strong)] transition-colors"
          title="Save"
        >
          <Check size={18} />
        </button>
      </div>
    </div>
  )
}

export function TransactionCard({ tx, onUpdate, onDelete }: TransactionCardProps) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <EditableCard
        tx={tx}
        onSave={(updates) => {
          onUpdate?.(tx.id, updates)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
        onDelete={() => {
          onDelete?.(tx.id)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="cursor-pointer rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-[var(--space-4)] transition-colors active:bg-[var(--bg-hover)]"
    >
      <div className="flex items-start justify-between">
        <span className="text-[13px] text-[var(--text-secondary)]">
          {formatDate(tx.date)}
        </span>
        <span className={`font-mono text-[16px] font-medium ${amountColorMap[tx.type]}`}>
          {formatCurrency(tx.amount, tx.type)}
        </span>
      </div>
      <div className="mt-[var(--space-2)] flex items-center gap-[var(--space-2)]">
        <span className="text-[13px] text-[var(--text-secondary)]">{tx.category}</span>
        <TypeBadge variant={tx.type}>{typeLabel[tx.type]}</TypeBadge>
      </div>
      {tx.details && (
        <div className="mt-[var(--space-1)] text-[13px] text-[var(--text-primary)] truncate">
          {tx.details}
        </div>
      )}
    </div>
  )
}
