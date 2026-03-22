import { useState, useRef, useEffect, useCallback } from "react"
import type { BudgetPlan, BudgetPlanEntry } from "@/api/types"
import { formatCurrency } from "@/lib/format"
import { useUpdateBudget } from "@/features/budget/hooks/use-update-budget"

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const TYPE_CONFIG = {
  income: { label: "Income", color: "var(--income-300)", bg: "var(--income-bg)", border: "var(--income-border)" },
  expense: { label: "Expenses", color: "var(--expense-300)", bg: "var(--expense-bg)", border: "var(--expense-border)" },
  savings: { label: "Savings", color: "var(--savings-300)", bg: "var(--savings-bg)", border: "var(--savings-border)" },
} as const

function totalForYear(entry: BudgetPlanEntry) {
  return MONTHS.reduce((sum, m) => sum + (entry.amounts[m] ?? 0), 0)
}

function fmt(n: number) {
  return formatCurrency(n)
}

// ─── Sparkline ───────────────────────────────────────────────────────────────

function Sparkline({ data, color, width = 80, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 2

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(" ")

  const isFlat = max === min

  return (
    <svg width={width} height={height} className="shrink-0">
      {isFlat ? (
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke={color} strokeWidth="1.5" opacity="0.5" />
      ) : (
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

// ─── Inline Cell Editor ──────────────────────────────────────────────────────

function CellEditor({ value, onSave, onCancel }: { value: number; onSave: (v: number) => void; onCancel: () => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState(value === 0 ? "" : String(value))

  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])

  const save = useCallback(() => {
    const parsed = parseFloat(input) || 0
    if (parsed !== value) onSave(parsed)
    else onCancel()
  }, [input, value, onSave, onCancel])

  return (
    <input
      ref={ref}
      type="text"
      inputMode="decimal"
      value={input}
      onChange={(e) => setInput(e.target.value.replace(/[^0-9.]/g, ""))}
      onKeyDown={(e) => {
        if (e.key === "Enter") { e.preventDefault(); save() }
        if (e.key === "Escape") { e.preventDefault(); onCancel() }
      }}
      onBlur={save}
      className="w-full rounded-[2px] bg-transparent px-1 py-0.5 text-center font-mono text-[12px] text-[var(--text-primary)] outline-none"
      style={{ boxShadow: "0 0 0 1px var(--income-border)" }}
    />
  )
}

// ─── Category Card ───────────────────────────────────────────────────────────

function CategoryCard({
  entry,
  year,
}: {
  entry: BudgetPlanEntry
  year: number
}) {
  const [expanded, setExpanded] = useState(false)
  const [editingMonth, setEditingMonth] = useState<number | null>(null)
  const mutation = useUpdateBudget(year)

  const config = TYPE_CONFIG[entry.type]
  const amounts = MONTHS.map((m) => entry.amounts[m] ?? 0)
  const yearly = totalForYear(entry)
  const avg = yearly / 12
  const isFlat = amounts.every((a) => a === amounts[0])
  const min = Math.min(...amounts)
  const max = Math.max(...amounts)

  function handleSave(month: number, value: number) {
    mutation.mutate({ category: entry.category, type: entry.type, month, value })
    setEditingMonth(null)
  }

  return (
    <div
      className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-colors hover:border-[var(--border-default)]"
    >
      <div
        className="flex cursor-pointer items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)] sm:gap-[var(--space-3)] sm:px-[var(--space-4)]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--text-primary)] sm:w-[140px] sm:flex-none">
          {entry.category}
        </div>
        <div className="hidden w-[110px] shrink-0 text-[11px] text-[var(--text-tertiary)] md:block">
          {isFlat ? `${fmt(amounts[0])}/mo` : `${fmt(min)} – ${fmt(max)}`}
        </div>
        <div className="hidden sm:block">
          <Sparkline data={amounts} color={config.color} />
        </div>
        <div className="ml-auto shrink-0 font-mono text-[13px] font-medium" style={{ color: config.color }}>
          {fmt(yearly)}
        </div>
        <div className="hidden w-[70px] shrink-0 text-right text-[11px] text-[var(--text-tertiary)] md:block">
          {fmt(Math.round(avg))}/mo
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[var(--border-subtle)] px-[var(--space-3)] py-[var(--space-2)] sm:px-[var(--space-4)]">
          <div className="grid grid-cols-4 gap-[var(--space-1)] sm:grid-cols-6 md:grid-cols-12">
            {MONTHS.map((m, i) => {
              const amount = entry.amounts[m] ?? 0
              const isChanged = amount !== amounts[0]
              const isEditing = editingMonth === m

              return (
                <div key={m} className="text-center">
                  <div className="text-[10px] uppercase text-[var(--text-tertiary)] mb-[var(--space-1)]">{MONTH_LABELS[i]}</div>
                  {isEditing ? (
                    <CellEditor
                      value={amount}
                      onSave={(v) => handleSave(m, v)}
                      onCancel={() => setEditingMonth(null)}
                    />
                  ) : (
                    <div
                      className="cursor-pointer rounded-[2px] font-mono text-[12px] transition-colors hover:bg-[var(--bg-hover)]"
                      style={{ color: isChanged ? config.color : "var(--text-secondary)", fontWeight: isChanged ? 600 : 400 }}
                      onClick={(e) => { e.stopPropagation(); setEditingMonth(m) }}
                    >
                      {fmt(amount)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────

function CardSection({ type, entries, year }: { type: "income" | "expense" | "savings"; entries: BudgetPlanEntry[]; year: number }) {
  const config = TYPE_CONFIG[type]
  const sectionTotal = entries.reduce((s, e) => s + totalForYear(e), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-[var(--space-2)]">
        <h3 className="text-[11px] uppercase tracking-[1px] font-semibold" style={{ color: config.color }}>
          {config.label}
        </h3>
        <span className="font-mono text-[13px] font-semibold" style={{ color: config.color }}>
          {fmt(sectionTotal)} /yr
        </span>
      </div>
      <div className="space-y-[var(--space-1)]">
        {entries.map((entry) => (
          <CategoryCard key={entry.category} entry={entry} year={year} />
        ))}
      </div>
    </div>
  )
}

// ─── Allocation Summary ──────────────────────────────────────────────────────

function AllocationSummary({ incomeEntries, expenseEntries, savingsEntries }: {
  incomeEntries: BudgetPlanEntry[]
  expenseEntries: BudgetPlanEntry[]
  savingsEntries: BudgetPlanEntry[]
}) {
  const monthlyAllocations = MONTHS.map((m) => {
    const income = incomeEntries.reduce((s, e) => s + (e.amounts[m] ?? 0), 0)
    const expenses = expenseEntries.reduce((s, e) => s + (e.amounts[m] ?? 0), 0)
    const savings = savingsEntries.reduce((s, e) => s + (e.amounts[m] ?? 0), 0)
    return income - expenses - savings
  })

  const yearlyAllocation = monthlyAllocations.reduce((s, v) => s + v, 0)
  const allocationColor = yearlyAllocation > 0 ? "var(--income-300)" : yearlyAllocation < 0 ? "var(--expense-300)" : "var(--text-tertiary)"

  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--bg-raised)] px-[var(--space-3)] py-[var(--space-2)] sm:px-[var(--space-4)]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[var(--text-primary)]">To Allocate</span>
        <span className="font-mono text-[13px] font-bold" style={{ color: allocationColor }}>
          {formatCurrency(yearlyAllocation, yearlyAllocation < 0 ? "expense" : undefined)} /yr
        </span>
      </div>
      <div className="mt-[var(--space-2)] grid grid-cols-4 gap-[var(--space-1)] sm:grid-cols-6 md:grid-cols-12">
        {MONTHS.map((_, i) => {
          const val = monthlyAllocations[i]
          const color = val > 0 ? "var(--income-300)" : val < 0 ? "var(--expense-300)" : "var(--text-tertiary)"
          return (
            <div key={i} className="text-center">
              <div className="text-[10px] uppercase text-[var(--text-tertiary)]">{MONTH_LABELS[i]}</div>
              <div className="font-mono text-[12px] font-medium" style={{ color }}>
                {formatCurrency(val, val < 0 ? "expense" : undefined)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main View ───────────────────────────────────────────────────────────────

interface BudgetCardViewProps {
  budgetPlan: BudgetPlan
}

export function BudgetCardView({ budgetPlan }: BudgetCardViewProps) {
  const incomeEntries = budgetPlan.entries.filter((e) => e.type === "income")
  const expenseEntries = budgetPlan.entries.filter((e) => e.type === "expense")
  const savingsEntries = budgetPlan.entries.filter((e) => e.type === "savings")

  return (
    <div className="space-y-[var(--space-5)] sm:space-y-[var(--space-6)]">
      <CardSection type="income" entries={incomeEntries} year={budgetPlan.year} />
      <CardSection type="expense" entries={expenseEntries} year={budgetPlan.year} />
      <CardSection type="savings" entries={savingsEntries} year={budgetPlan.year} />
      <AllocationSummary
        incomeEntries={incomeEntries}
        expenseEntries={expenseEntries}
        savingsEntries={savingsEntries}
      />
    </div>
  )
}
