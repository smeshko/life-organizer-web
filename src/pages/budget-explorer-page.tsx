import { useState } from "react"

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface BudgetEntry {
  category: string
  type: "income" | "expense" | "savings"
  amounts: number[]
}

const MOCK_DATA: BudgetEntry[] = [
  { category: "Salary Ivo", type: "income", amounts: [3890, 3890, 3890, 3890, 3890, 3890, 3890, 3890, 3890, 3890, 3890, 3890] },
  { category: "Rent", type: "income", amounts: [128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128] },

  { category: "Mortgage", type: "expense", amounts: [1646, 1646, 1646, 1646, 1646, 1646, 1646, 1646, 1646, 1646, 1646, 1646] },
  { category: "Eat out", type: "expense", amounts: [296, 296, 296, 296, 296, 380, 420, 350, 296, 296, 296, 296] },
  { category: "Groceries", type: "expense", amounts: [245, 245, 245, 280, 245, 245, 245, 245, 245, 245, 245, 245] },
  { category: "Utilities", type: "expense", amounts: [271, 271, 271, 220, 180, 150, 140, 145, 170, 220, 260, 271] },
  { category: "Other", type: "expense", amounts: [194, 194, 194, 194, 194, 194, 194, 194, 194, 194, 194, 194] },
  { category: "Baby", type: "expense", amounts: [148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148] },
  { category: "Home improvements", type: "expense", amounts: [148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148, 148] },
  { category: "Body care", type: "expense", amounts: [138, 138, 138, 138, 138, 138, 138, 138, 138, 138, 138, 138] },
  { category: "Clothes", type: "expense", amounts: [107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107, 107] },
  { category: "Subscriptions", type: "expense", amounts: [92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92, 92] },
  { category: "Fun", type: "expense", amounts: [87, 87, 87, 87, 87, 120, 150, 120, 87, 87, 87, 87] },
  { category: "Medical", type: "expense", amounts: [72, 72, 72, 72, 72, 72, 72, 72, 72, 72, 72, 72] },
  { category: "Transport", type: "expense", amounts: [56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56, 56] },
  { category: "Vacation", type: "expense", amounts: [36, 36, 36, 36, 36, 200, 400, 200, 36, 36, 36, 36] },
  { category: "Hobbies", type: "expense", amounts: [26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26] },
  { category: "Maya", type: "expense", amounts: [26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26] },

  { category: "Avi Savings", type: "savings", amounts: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100] },
  { category: "Metlife", type: "savings", amounts: [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40] },
]

function sumByType(type: "income" | "expense" | "savings") {
  return MOCK_DATA.filter((e) => e.type === type)
}

function totalForMonth(entries: BudgetEntry[], month: number) {
  return entries.reduce((sum, e) => sum + e.amounts[month], 0)
}

function totalForYear(entry: BudgetEntry) {
  return entry.amounts.reduce((a, b) => a + b, 0)
}

function fmt(n: number) {
  return `€ ${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// ─── Color helpers ───────────────────────────────────────────────────────────

const typeColor = {
  income: { text: "var(--income-300)", bg: "var(--income-bg)", bgStrong: "var(--income-bg-strong)", border: "var(--income-border)" },
  expense: { text: "var(--expense-300)", bg: "var(--expense-bg)", bgStrong: "var(--expense-bg-strong)", border: "var(--expense-border)" },
  savings: { text: "var(--savings-300)", bg: "var(--savings-bg)", bgStrong: "var(--savings-bg-strong)", border: "var(--savings-border)" },
}

// ─── IDEA 1: Heatmap Grid ────────────────────────────────────────────────────

function HeatmapGrid() {
  const sections: { type: "income" | "expense" | "savings"; label: string }[] = [
    { type: "income", label: "INCOME" },
    { type: "expense", label: "EXPENSES" },
    { type: "savings", label: "SAVINGS" },
  ]

  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-[var(--bg-surface)] px-[var(--space-4)] py-[var(--space-3)] text-left text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">
              Category
            </th>
            {MONTHS.map((m) => (
              <th key={m} className="px-[var(--space-3)] py-[var(--space-3)] text-center text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)] min-w-[80px]">
                {m}
              </th>
            ))}
            <th className="px-[var(--space-4)] py-[var(--space-3)] text-right text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)]">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {sections.map(({ type, label }) => {
            const entries = sumByType(type)
            const maxInSection = Math.max(...entries.flatMap((e) => e.amounts))
            const colors = typeColor[type]

            return (
              <tbody key={type}>
                {/* Section header */}
                <tr>
                  <td
                    colSpan={14}
                    className="px-[var(--space-4)] pt-[var(--space-4)] pb-[var(--space-2)] text-[11px] uppercase tracking-[1px] font-semibold"
                    style={{ color: colors.text }}
                  >
                    {label}
                  </td>
                </tr>

                {/* Category rows with heatmap */}
                {entries.map((entry) => (
                  <tr key={entry.category} className="group hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="sticky left-0 z-10 bg-[var(--bg-surface)] group-hover:bg-[var(--bg-hover)] px-[var(--space-4)] py-[var(--space-2)] text-[var(--text-primary)] font-medium transition-colors">
                      {entry.category}
                    </td>
                    {entry.amounts.map((amount, i) => {
                      const intensity = maxInSection > 0 ? amount / maxInSection : 0
                      const isChanged = entry.amounts.some((a) => a !== entry.amounts[0]) && amount !== entry.amounts[0]
                      return (
                        <td
                          key={i}
                          className="px-[var(--space-3)] py-[var(--space-2)] text-center font-mono text-[var(--text-secondary)] transition-colors"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${colors.text} ${Math.round(intensity * 18)}%, transparent)`,
                            ...(isChanged ? { color: colors.text, fontWeight: 600 } : {}),
                          }}
                        >
                          {fmt(amount)}
                        </td>
                      )
                    })}
                    <td className="px-[var(--space-4)] py-[var(--space-2)] text-right font-mono font-medium text-[var(--text-primary)]">
                      {fmt(totalForYear(entry))}
                    </td>
                  </tr>
                ))}

                {/* Section total */}
                <tr
                  className="border-t"
                  style={{ borderColor: colors.border }}
                >
                  <td
                    className="sticky left-0 z-10 px-[var(--space-4)] py-[var(--space-3)] font-semibold text-[13px]"
                    style={{ color: colors.text, backgroundColor: "var(--bg-surface)" }}
                  >
                    Total {label.charAt(0) + label.slice(1).toLowerCase()}
                  </td>
                  {MONTHS.map((_, i) => (
                    <td
                      key={i}
                      className="px-[var(--space-3)] py-[var(--space-3)] text-center font-mono font-semibold"
                      style={{ color: colors.text }}
                    >
                      {fmt(totalForMonth(entries, i))}
                    </td>
                  ))}
                  <td
                    className="px-[var(--space-4)] py-[var(--space-3)] text-right font-mono font-bold"
                    style={{ color: colors.text }}
                  >
                    {fmt(entries.reduce((s, e) => s + totalForYear(e), 0))}
                  </td>
                </tr>
              </tbody>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── IDEA 2: Category Cards with Sparklines ─────────────────────────────────

function Sparkline({ data, color, width = 120, height = 28 }: { data: number[]; color: string; width?: number; height?: number }) {
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
        <line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke={color}
          strokeWidth="1.5"
          opacity="0.5"
        />
      ) : (
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function CategoryCard({ entry }: { entry: BudgetEntry }) {
  const [expanded, setExpanded] = useState(false)
  const colors = typeColor[entry.type]
  const yearly = totalForYear(entry)
  const avg = yearly / 12
  const isFlat = entry.amounts.every((a) => a === entry.amounts[0])
  const min = Math.min(...entry.amounts)
  const max = Math.max(...entry.amounts)

  return (
    <div
      className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-colors hover:border-[var(--border-default)] cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-[var(--space-4)] px-[var(--space-5)] py-[var(--space-4)]">
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-[var(--text-primary)]">{entry.category}</div>
          <div className="text-[12px] text-[var(--text-tertiary)] mt-[var(--space-1)]">
            {isFlat ? `${fmt(entry.amounts[0])}/mo (flat)` : `${fmt(min)} – ${fmt(max)}/mo`}
          </div>
        </div>
        <Sparkline data={entry.amounts} color={colors.text} />
        <div className="text-right shrink-0">
          <div className="font-mono text-[16px] font-medium" style={{ color: colors.text }}>{fmt(yearly)}</div>
          <div className="text-[11px] text-[var(--text-tertiary)] mt-[var(--space-1)]">avg {fmt(Math.round(avg))}/mo</div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[var(--border-subtle)] px-[var(--space-5)] py-[var(--space-3)]">
          <div className="grid grid-cols-12 gap-[var(--space-2)]">
            {MONTHS.map((m, i) => {
              const isChanged = entry.amounts[i] !== entry.amounts[0]
              return (
                <div key={m} className="text-center">
                  <div className="text-[10px] uppercase text-[var(--text-tertiary)] mb-[var(--space-1)]">{m}</div>
                  <div
                    className="font-mono text-[12px]"
                    style={{ color: isChanged ? colors.text : "var(--text-secondary)", fontWeight: isChanged ? 600 : 400 }}
                  >
                    {fmt(entry.amounts[i])}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryCardsView() {
  const sections: { type: "income" | "expense" | "savings"; label: string }[] = [
    { type: "income", label: "Income" },
    { type: "expense", label: "Expenses" },
    { type: "savings", label: "Savings" },
  ]

  return (
    <div className="space-y-[var(--space-6)]">
      {sections.map(({ type, label }) => {
        const entries = sumByType(type)
        const colors = typeColor[type]
        const sectionTotal = entries.reduce((s, e) => s + totalForYear(e), 0)

        return (
          <div key={type}>
            <div className="flex items-center justify-between mb-[var(--space-3)]">
              <h3 className="text-[11px] uppercase tracking-[1px] font-semibold" style={{ color: colors.text }}>
                {label}
              </h3>
              <span className="font-mono text-[14px] font-semibold" style={{ color: colors.text }}>
                {fmt(sectionTotal)} /yr
              </span>
            </div>
            <div className="space-y-[var(--space-2)]">
              {entries.map((entry) => (
                <CategoryCard key={entry.category} entry={entry} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── IDEA 3: Stacked Bars + Collapsible Sections ────────────────────────────

function StackedBarChart() {
  const incomeEntries = sumByType("income")
  const expenseEntries = sumByType("expense")
  const savingsEntries = sumByType("savings")

  const monthlyData = MONTHS.map((_, i) => ({
    income: totalForMonth(incomeEntries, i),
    expense: totalForMonth(expenseEntries, i),
    savings: totalForMonth(savingsEntries, i),
  }))

  const maxIncome = Math.max(...monthlyData.map((m) => m.income))

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-[var(--space-5)]">
      <h3 className="text-[11px] uppercase tracking-[1px] font-semibold text-[var(--text-tertiary)] mb-[var(--space-4)]">
        Monthly Allocation Overview
      </h3>
      <div className="flex items-end gap-[var(--space-2)]">
        {monthlyData.map((month, i) => {
          const expensePct = maxIncome > 0 ? (month.expense / maxIncome) * 100 : 0
          const savingsPct = maxIncome > 0 ? (month.savings / maxIncome) * 100 : 0
          const remainPct = maxIncome > 0 ? (Math.max(0, month.income - month.expense - month.savings) / maxIncome) * 100 : 0

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-[var(--space-2)]">
              <div className="w-full flex flex-col justify-end" style={{ height: "160px" }}>
                {/* Remaining */}
                <div
                  className="w-full rounded-t-[2px]"
                  style={{ height: `${remainPct}%`, backgroundColor: "var(--bg-active)" }}
                  title={`Remaining: ${fmt(Math.max(0, month.income - month.expense - month.savings))}`}
                />
                {/* Savings */}
                <div
                  className="w-full"
                  style={{ height: `${savingsPct}%`, backgroundColor: "var(--savings-300)" }}
                  title={`Savings: ${fmt(month.savings)}`}
                />
                {/* Expenses */}
                <div
                  className="w-full rounded-b-[2px]"
                  style={{ height: `${expensePct}%`, backgroundColor: "var(--expense-300)" }}
                  title={`Expenses: ${fmt(month.expense)}`}
                />
              </div>
              <span className="text-[10px] uppercase text-[var(--text-tertiary)]">{MONTHS[i]}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-[var(--space-5)] mt-[var(--space-4)] pt-[var(--space-3)] border-t border-[var(--border-subtle)]">
        <Legend color="var(--expense-300)" label="Expenses" />
        <Legend color="var(--savings-300)" label="Savings" />
        <Legend color="var(--bg-active)" label="Remaining" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <span className="inline-block h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: color }} />
      <span className="text-[11px] text-[var(--text-tertiary)]">{label}</span>
    </div>
  )
}

function CollapsibleSection({ type, label }: { type: "income" | "expense" | "savings"; label: string }) {
  const [expanded, setExpanded] = useState(false)
  const entries = sumByType(type)
  const colors = typeColor[type]

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      {/* Section header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-4)] hover:bg-[var(--bg-hover)] transition-colors text-left"
      >
        <span
          className="text-[14px] font-semibold flex-1"
          style={{ color: colors.text }}
        >
          {expanded ? "▾" : "▸"} {label}
        </span>
        <div className="flex items-center gap-[var(--space-4)] overflow-x-auto">
          {MONTHS.map((m, i) => (
            <div key={m} className="text-center shrink-0 w-[72px]">
              <div className="text-[10px] uppercase text-[var(--text-tertiary)]">{m}</div>
              <div className="font-mono text-[13px] font-semibold" style={{ color: colors.text }}>
                {fmt(totalForMonth(entries, i))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-right shrink-0 w-[90px]">
          <div className="text-[10px] uppercase text-[var(--text-tertiary)]">Year</div>
          <div className="font-mono text-[13px] font-bold" style={{ color: colors.text }}>
            {fmt(entries.reduce((s, e) => s + totalForYear(e), 0))}
          </div>
        </div>
      </button>

      {/* Expanded: individual categories */}
      {expanded && (
        <div className="border-t border-[var(--border-subtle)]">
          {entries.map((entry) => (
            <div key={entry.category} className="flex items-center gap-[var(--space-3)] px-[var(--space-5)] py-[var(--space-3)] hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--border-subtle)] last:border-b-0">
              <span className="text-[13px] text-[var(--text-primary)] flex-1 pl-[var(--space-4)]">
                {entry.category}
              </span>
              <div className="flex items-center gap-[var(--space-4)] overflow-x-auto">
                {MONTHS.map((m, i) => {
                  const isChanged = entry.amounts[i] !== entry.amounts[0]
                  return (
                    <div key={m} className="text-center shrink-0 w-[72px]">
                      <div
                        className="font-mono text-[12px]"
                        style={{
                          color: isChanged ? colors.text : "var(--text-secondary)",
                          fontWeight: isChanged ? 600 : 400,
                        }}
                      >
                        {fmt(entry.amounts[i])}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="text-right shrink-0 w-[90px]">
                <div className="font-mono text-[12px] text-[var(--text-primary)] font-medium">
                  {fmt(totalForYear(entry))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StackedBarsCollapsibleView() {
  return (
    <div className="space-y-[var(--space-4)]">
      <StackedBarChart />
      <CollapsibleSection type="income" label="Income" />
      <CollapsibleSection type="expense" label="Expenses" />
      <CollapsibleSection type="savings" label="Savings" />
    </div>
  )
}

// ─── Explorer Page ───────────────────────────────────────────────────────────

const IDEAS = [
  { id: "heatmap", label: "Heatmap Grid", component: HeatmapGrid },
  { id: "cards", label: "Category Cards + Sparklines", component: CategoryCardsView },
  { id: "stacked", label: "Stacked Bars + Collapsible", component: StackedBarsCollapsibleView },
] as const

export function BudgetExplorerPage() {
  const [activeIdea, setActiveIdea] = useState<string>("heatmap")
  const Active = IDEAS.find((i) => i.id === activeIdea)!.component

  return (
    <div>
      <header className="flex flex-col gap-[var(--space-3)] pb-[var(--space-5)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-[24px] text-[var(--text-primary)] sm:text-[32px]">
            Budget Visualization Explorer
          </h1>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-[var(--space-1)]">
            Compare 3 design ideas for the budget planning page. All use mocked data.
          </p>
        </div>
      </header>

      {/* Idea selector */}
      <div className="flex gap-[var(--space-2)] mb-[var(--space-6)] overflow-x-auto pb-[var(--space-1)]">
        {IDEAS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveIdea(id)}
            className={[
              "shrink-0 rounded-[var(--radius-sm)] px-[var(--space-4)] py-[var(--space-2)] text-[13px] font-medium transition-colors border",
              activeIdea === id
                ? "bg-[var(--bg-active)] text-[var(--text-primary)] border-[var(--border-strong)]"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:bg-[var(--bg-hover)]",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active visualization */}
      <Active />
    </div>
  )
}
