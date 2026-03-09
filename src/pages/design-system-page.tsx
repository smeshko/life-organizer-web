import { TypeBadge } from "@/components/type-badge"
import { StatCard } from "@/components/stat-card"
import { ProgressBar } from "@/components/progress-bar"
import { ErrorState } from "@/components/error-state"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

/* ------------------------------------------------------------------ */
/*  Local helper components                                           */
/* ------------------------------------------------------------------ */

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-[var(--space-6)]">
      <div>
        <h2 className="font-serif text-[36px] text-[var(--text-primary)]">
          {title}
        </h2>
        {description && (
          <p className="mt-[var(--space-2)] text-sm text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}

function ColorCard({
  name,
  hex,
  cssVar,
  textClass = "text-[var(--text-primary)]",
}: {
  name: string
  hex: string
  cssVar: string
  textClass?: string
}) {
  return (
    <div
      className="flex h-[80px] flex-col justify-end rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-[var(--space-3)]"
      style={{ backgroundColor: `var(${cssVar})` }}
    >
      <span className={`text-xs font-medium ${textClass}`}>{name}</span>
      <span className={`font-mono text-[11px] ${textClass} opacity-70`}>
        {hex}
      </span>
    </div>
  )
}

function SwatchRow({
  label,
  shades,
}: {
  label: string
  shades: { name: string; hex: string; cssVar: string }[]
}) {
  return (
    <div className="space-y-[var(--space-2)]">
      <h4 className="text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </h4>
      <div className="grid grid-cols-4 gap-[var(--space-2)] sm:grid-cols-8">
        {shades.map((s) => (
          <div key={s.name} className="space-y-1">
            <div
              className="h-[40px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
              style={{ backgroundColor: `var(${s.cssVar})` }}
            />
            <div className="text-[10px] text-[var(--text-tertiary)]">
              {s.name}
            </div>
            <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
              {s.hex}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Data constants                                                     */
/* ------------------------------------------------------------------ */

const SURFACES = [
  { name: "--bg-root", hex: "#111010", cssVar: "--bg-root" },
  { name: "--bg-surface", hex: "#1a1816", cssVar: "--bg-surface" },
  { name: "--bg-raised", hex: "#222019", cssVar: "--bg-raised" },
  { name: "--bg-elevated", hex: "#2a2822", cssVar: "--bg-elevated" },
  { name: "--bg-hover", hex: "#33302a", cssVar: "--bg-hover" },
  { name: "--bg-active", hex: "#3d3a33", cssVar: "--bg-active" },
]

const BORDERS = [
  { name: "--border-subtle", hex: "#2e2b25", cssVar: "--border-subtle" },
  { name: "--border-default", hex: "#3d3a33", cssVar: "--border-default" },
  { name: "--border-strong", hex: "#524e46", cssVar: "--border-strong" },
]

const TEXT_LEVELS = [
  { name: "--text-primary", hex: "#e8e2d6", cssVar: "--text-primary" },
  { name: "--text-secondary", hex: "#a69f8f", cssVar: "--text-secondary" },
  { name: "--text-tertiary", hex: "#7a7368", cssVar: "--text-tertiary" },
  { name: "--text-inverse", hex: "#1a1816", cssVar: "--text-inverse" },
]

const INCOME_SHADES = [
  { name: "50", hex: "#eef5f0", cssVar: "--income-50" },
  { name: "100", hex: "#cee5d4", cssVar: "--income-100" },
  { name: "200", hex: "#9dc7a8", cssVar: "--income-200" },
  { name: "300", hex: "#6daa7c", cssVar: "--income-300" },
  { name: "400", hex: "#4d9462", cssVar: "--income-400" },
  { name: "500", hex: "#3a7a4e", cssVar: "--income-500" },
  { name: "600", hex: "#2e613e", cssVar: "--income-600" },
  { name: "700", hex: "#23492f", cssVar: "--income-700" },
]

const EXPENSE_SHADES = [
  { name: "50", hex: "#fdf0ee", cssVar: "--expense-50" },
  { name: "100", hex: "#f8d5cf", cssVar: "--expense-100" },
  { name: "200", hex: "#e8a89e", cssVar: "--expense-200" },
  { name: "300", hex: "#d47b6e", cssVar: "--expense-300" },
  { name: "400", hex: "#c06254", cssVar: "--expense-400" },
  { name: "500", hex: "#a84e40", cssVar: "--expense-500" },
  { name: "600", hex: "#863e33", cssVar: "--expense-600" },
  { name: "700", hex: "#652f26", cssVar: "--expense-700" },
]

const SAVINGS_SHADES = [
  { name: "50", hex: "#fdf4e7", cssVar: "--savings-50" },
  { name: "100", hex: "#f9e4c2", cssVar: "--savings-100" },
  { name: "200", hex: "#f0c878", cssVar: "--savings-200" },
  { name: "300", hex: "#e4a83a", cssVar: "--savings-300" },
  { name: "400", hex: "#d4922a", cssVar: "--savings-400" },
  { name: "500", hex: "#c07d1e", cssVar: "--savings-500" },
  { name: "600", hex: "#9a6318", cssVar: "--savings-600" },
  { name: "700", hex: "#744a12", cssVar: "--savings-700" },
]

const ACCENT_SHADES = [
  { name: "300", hex: "#b0a3d4", cssVar: "--accent-300" },
  { name: "400", hex: "#9488c0", cssVar: "--accent-400" },
  { name: "500", hex: "#7a6eaa", cssVar: "--accent-500" },
]

const WARNING_SHADES = [
  { name: "50", hex: "#fef6e7", cssVar: "--warning-50" },
  { name: "100", hex: "#fbe5b5", cssVar: "--warning-100" },
  { name: "200", hex: "#f5c95e", cssVar: "--warning-200" },
  { name: "300", hex: "#e8a820", cssVar: "--warning-300" },
  { name: "400", hex: "#d49518", cssVar: "--warning-400" },
  { name: "500", hex: "#b07c14", cssVar: "--warning-500" },
]

const CHART_COLORS = [
  { n: 1, hex: "#e4a83a", cssVar: "--chart-1" },
  { n: 2, hex: "#d47b6e", cssVar: "--chart-2" },
  { n: 3, hex: "#6daa7c", cssVar: "--chart-3" },
  { n: 4, hex: "#9488c0", cssVar: "--chart-4" },
  { n: 5, hex: "#c07d1e", cssVar: "--chart-5" },
  { n: 6, hex: "#a84e40", cssVar: "--chart-6" },
  { n: 7, hex: "#4d9462", cssVar: "--chart-7" },
  { n: 8, hex: "#7a6eaa", cssVar: "--chart-8" },
  { n: 9, hex: "#e8c878", cssVar: "--chart-9" },
  { n: 10, hex: "#e8a89e", cssVar: "--chart-10" },
  { n: 11, hex: "#9dc7a8", cssVar: "--chart-11" },
  { n: 12, hex: "#b0a3d4", cssVar: "--chart-12" },
]

const SPACING_TOKENS = [
  { name: "--space-1", px: 4 },
  { name: "--space-2", px: 8 },
  { name: "--space-3", px: 12 },
  { name: "--space-4", px: 16 },
  { name: "--space-5", px: 20 },
  { name: "--space-6", px: 24 },
  { name: "--space-8", px: 32 },
  { name: "--space-10", px: 40 },
  { name: "--space-12", px: 48 },
  { name: "--space-16", px: 64 },
]

const TRANSACTIONS = [
  {
    date: "2026-03-01",
    type: "income" as const,
    category: "Salary",
    details: "March salary — Acme GmbH",
    amount: "€3,200.00",
  },
  {
    date: "2026-03-03",
    type: "expense" as const,
    category: "Rent",
    details: "Monthly rent — Apartment",
    amount: "–€950.00",
  },
  {
    date: "2026-03-05",
    type: "expense" as const,
    category: "Groceries",
    details: "REWE Supermarkt",
    amount: "–€234.50",
  },
  {
    date: "2026-03-07",
    type: "savings" as const,
    category: "Savings",
    details: "Monthly transfer — Emergency fund",
    amount: "€500.00",
  },
  {
    date: "2026-03-08",
    type: "expense" as const,
    category: "Transport",
    details: "BVG Monthly Pass",
    amount: "–€86.00",
  },
]

/* ------------------------------------------------------------------ */
/*  Section components                                                 */
/* ------------------------------------------------------------------ */

function SurfacePaletteSection() {
  return (
    <Section
      title="Surface Palette"
      description="Background and surface color tokens"
    >
      <div>
        <h3 className="mb-[var(--space-3)] text-sm font-semibold text-[var(--text-secondary)]">
          Backgrounds
        </h3>
        <div className="grid grid-cols-2 gap-[var(--space-3)] sm:grid-cols-3 lg:grid-cols-6">
          {SURFACES.map((s) => (
            <ColorCard key={s.name} {...s} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-[var(--space-3)] text-sm font-semibold text-[var(--text-secondary)]">
          Borders
        </h3>
        <div className="grid grid-cols-3 gap-[var(--space-3)]">
          {BORDERS.map((b) => (
            <div
              key={b.name}
              className="flex h-[60px] items-center justify-between rounded-[var(--radius-md)] bg-[var(--bg-surface)] px-[var(--space-4)]"
              style={{ border: `2px solid var(${b.cssVar})` }}
            >
              <span className="text-xs text-[var(--text-primary)]">
                {b.name}
              </span>
              <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                {b.hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-[var(--space-3)] text-sm font-semibold text-[var(--text-secondary)]">
          Text
        </h3>
        <div className="grid grid-cols-2 gap-[var(--space-3)] sm:grid-cols-4">
          {TEXT_LEVELS.map((t) => (
            <div
              key={t.name}
              className="flex h-[60px] flex-col justify-center rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-[var(--space-4)]"
            >
              <span
                className="text-sm font-medium"
                style={{ color: `var(${t.cssVar})` }}
              >
                {t.name === "--text-inverse" ? (
                  <span className="rounded bg-[var(--text-primary)] px-1">
                    Inverse
                  </span>
                ) : (
                  "Sample text"
                )}
              </span>
              <span className="mt-1 text-[11px] text-[var(--text-tertiary)]">
                {t.name} · {t.hex}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function SemanticColorsSection() {
  return (
    <Section
      title="Semantic Colors"
      description="Income, Expenses, Savings, and Accent color groups"
    >
      <SwatchRow label="Income — Sage" shades={INCOME_SHADES} />
      <div className="flex gap-[var(--space-3)]">
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--income-bg)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --income-bg
          </span>
        </div>
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--income-bg-strong)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --income-bg-strong
          </span>
        </div>
        <div
          className="flex-1 rounded-[var(--radius-sm)] border-2 p-[var(--space-3)]"
          style={{ borderColor: "var(--income-border)" }}
        >
          <span className="text-xs text-[var(--text-secondary)]">
            --income-border
          </span>
        </div>
      </div>

      <SwatchRow label="Expenses — Terracotta" shades={EXPENSE_SHADES} />
      <div className="flex gap-[var(--space-3)]">
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--expense-bg)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --expense-bg
          </span>
        </div>
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--expense-bg-strong)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --expense-bg-strong
          </span>
        </div>
        <div
          className="flex-1 rounded-[var(--radius-sm)] border-2 p-[var(--space-3)]"
          style={{ borderColor: "var(--expense-border)" }}
        >
          <span className="text-xs text-[var(--text-secondary)]">
            --expense-border
          </span>
        </div>
      </div>

      <SwatchRow label="Savings — Copper" shades={SAVINGS_SHADES} />
      <div className="flex gap-[var(--space-3)]">
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--savings-bg)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --savings-bg
          </span>
        </div>
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--savings-bg-strong)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --savings-bg-strong
          </span>
        </div>
        <div
          className="flex-1 rounded-[var(--radius-sm)] border-2 p-[var(--space-3)]"
          style={{ borderColor: "var(--savings-border)" }}
        >
          <span className="text-xs text-[var(--text-secondary)]">
            --savings-border
          </span>
        </div>
      </div>

      <SwatchRow label="Accent — Lavender" shades={ACCENT_SHADES} />
      <div className="flex gap-[var(--space-3)]">
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--accent-bg)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --accent-bg
          </span>
        </div>
        <div
          className="flex-1 rounded-[var(--radius-sm)] border-2 p-[var(--space-3)]"
          style={{ borderColor: "var(--accent-border)" }}
        >
          <span className="text-xs text-[var(--text-secondary)]">
            --accent-border
          </span>
        </div>
      </div>

      <SwatchRow label="Warning — Amber" shades={WARNING_SHADES} />
      <div className="flex gap-[var(--space-3)]">
        <div className="flex-1 rounded-[var(--radius-sm)] bg-[var(--warning-bg)] p-[var(--space-3)]">
          <span className="text-xs text-[var(--text-secondary)]">
            --warning-bg
          </span>
        </div>
        <div
          className="flex-1 rounded-[var(--radius-sm)] border-2 p-[var(--space-3)]"
          style={{ borderColor: "var(--warning-border)" }}
        >
          <span className="text-xs text-[var(--text-secondary)]">
            --warning-border
          </span>
        </div>
      </div>
    </Section>
  )
}

function ChartPaletteSection() {
  return (
    <Section
      title="Chart Palette"
      description="Ordered chart color sequence for data visualization"
    >
      <div className="grid grid-cols-4 gap-[var(--space-3)] sm:grid-cols-6 lg:grid-cols-12">
        {CHART_COLORS.map((c) => (
          <div key={c.n} className="space-y-1 text-center">
            <div
              className="mx-auto h-[48px] w-full rounded-[var(--radius-sm)]"
              style={{ backgroundColor: `var(${c.cssVar})` }}
            />
            <div className="text-xs font-medium text-[var(--text-primary)]">
              {c.n}
            </div>
            <div className="font-mono text-[10px] text-[var(--text-tertiary)]">
              {c.hex}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

function TypographySection() {
  return (
    <Section title="Typography" description="Type scale and font families">
      <div className="space-y-[var(--space-6)]">
        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-[var(--space-4)]">
          <span className="font-serif text-[48px] text-[var(--text-primary)]">
            Your Financial Story
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Display XL · Instrument Serif · 48px
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-[var(--space-4)]">
          <span className="font-serif text-[36px] text-[var(--text-primary)]">
            Monthly Overview
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Display · Instrument Serif · 36px
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-[var(--space-4)]">
          <span className="text-[24px] font-semibold text-[var(--text-primary)]">
            Transaction History
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Heading · DM Sans · 24px/600
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-[var(--space-4)]">
          <span className="text-[16px] font-semibold text-[var(--text-primary)]">
            Category Breakdown
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Subheading · DM Sans · 16px/600
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-[var(--space-4)]">
          <span className="text-[14px] text-[var(--text-primary)]">
            Track your daily expenses and income to maintain a clear picture of
            your financial health. Every transaction matters.
          </span>
          <span className="shrink-0 pl-4 text-xs text-[var(--text-tertiary)]">
            Body · DM Sans · 14px/400
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-[var(--space-4)]">
          <span className="text-[12px] text-[var(--text-secondary)]">
            Last updated: March 2026
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Caption · DM Sans · 12px/400
          </span>
        </div>

        <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-[var(--space-4)]">
          <span className="font-mono text-[13px] text-[var(--text-primary)]">
            €2,450.00
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Mono · DM Mono · 13px
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text-secondary)]">
            TOTAL INCOME
          </span>
          <span className="text-xs text-[var(--text-tertiary)]">
            Label · DM Sans · 11px/600 · Uppercase
          </span>
        </div>
      </div>
    </Section>
  )
}

function SpacingSection() {
  return (
    <Section title="Spacing" description="Spacing scale tokens">
      <div className="space-y-[var(--space-3)]">
        {SPACING_TOKENS.map((s) => (
          <div key={s.name} className="flex items-center gap-[var(--space-4)]">
            <span className="w-[120px] shrink-0 font-mono text-xs text-[var(--text-tertiary)]">
              {s.name} — {s.px}px
            </span>
            <div
              className="h-[8px] rounded-[2px] bg-[var(--bg-active)]"
              style={{ width: `${s.px}px` }}
            />
          </div>
        ))}
      </div>
    </Section>
  )
}

function ComponentsSection() {
  return (
    <Section title="Components" description="Shared UI primitives and patterns">
      {/* TypeBadge */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          TypeBadge
        </h3>
        <div className="flex gap-[var(--space-3)]">
          <TypeBadge variant="income">Income</TypeBadge>
          <TypeBadge variant="expense">Expense</TypeBadge>
          <TypeBadge variant="savings">Savings</TypeBadge>
        </div>
      </div>

      {/* StatCard */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          StatCard
        </h3>
        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            type="income"
            label="Total Income"
            value="€3,200.00"
            change="+12% vs last month"
          />
          <StatCard
            type="expense"
            label="Total Expenses"
            value="€2,180.50"
            change="+5% vs last month"
          />
          <StatCard
            type="savings"
            label="Savings"
            value="€850.00"
            change="–3% vs last month"
          />
          <StatCard type="balance" label="Balance" value="€169.50" />
        </div>
      </div>

      {/* ProgressBar */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          ProgressBar
        </h3>
        <div className="max-w-md space-y-[var(--space-4)]">
          <div>
            <div className="mb-1 flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Under budget</span>
              <span>45%</span>
            </div>
            <ProgressBar percentage={45} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Near budget</span>
              <span>92%</span>
            </div>
            <ProgressBar percentage={92} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs text-[var(--text-secondary)]">
              <span>Over budget</span>
              <span>118%</span>
            </div>
            <ProgressBar percentage={118} />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          Transaction Table
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TRANSACTIONS.map((t) => (
              <TableRow key={t.date + t.category}>
                <TableCell className="font-mono text-xs text-[var(--text-secondary)]">
                  {t.date}
                </TableCell>
                <TableCell>
                  <TypeBadge variant={t.type}>
                    {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                  </TypeBadge>
                </TableCell>
                <TableCell className="text-[var(--text-primary)]">
                  {t.category}
                </TableCell>
                <TableCell className="text-[var(--text-secondary)]">
                  {t.details}
                </TableCell>
                <TableCell
                  className={`text-right font-mono ${
                    t.type === "income"
                      ? "text-[var(--income-300)]"
                      : t.type === "savings"
                        ? "text-[var(--savings-300)]"
                        : "text-[var(--expense-300)]"
                  }`}
                >
                  {t.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Budget Grid Cells */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          Budget Grid Cells
        </h3>
        <div className="max-w-lg overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
          {/* Section header - Income */}
          <div className="bg-[var(--income-bg-strong)] px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-xs font-semibold text-[var(--income-300)]">
              Income
            </span>
          </div>
          {/* Regular cell */}
          <div className="flex justify-between border-b border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-3)] hover:bg-[var(--bg-hover)]">
            <span className="text-sm text-[var(--text-primary)]">Salary</span>
            <span className="font-mono text-sm text-[var(--text-primary)]">
              €3,200.00
            </span>
          </div>
          {/* Section header - Expenses */}
          <div className="bg-[var(--expense-bg-strong)] px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-xs font-semibold text-[var(--expense-300)]">
              Expenses
            </span>
          </div>
          {/* Regular cells */}
          <div className="flex justify-between border-b border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-3)] hover:bg-[var(--bg-hover)]">
            <span className="text-sm text-[var(--text-primary)]">Rent</span>
            <span className="font-mono text-sm text-[var(--text-primary)]">
              €950.00
            </span>
          </div>
          <div className="flex justify-between border-b border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-3)] hover:bg-[var(--bg-hover)]">
            <span className="text-sm text-[var(--text-primary)]">
              Groceries
            </span>
            <span className="font-mono text-sm text-[var(--text-primary)]">
              €234.50
            </span>
          </div>
          {/* Section header - Savings */}
          <div className="bg-[var(--savings-bg-strong)] px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-xs font-semibold text-[var(--savings-300)]">
              Savings
            </span>
          </div>
          <div className="flex justify-between border-b border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-3)] hover:bg-[var(--bg-hover)]">
            <span className="text-sm text-[var(--text-primary)]">
              Emergency fund
            </span>
            <span className="font-mono text-sm text-[var(--text-primary)]">
              €500.00
            </span>
          </div>
          {/* Total row */}
          <div className="flex justify-between border-t-2 border-[var(--border-strong)] bg-[var(--bg-raised)] px-[var(--space-4)] py-[var(--space-3)]">
            <span className="text-sm font-bold text-[var(--text-primary)]">
              Total
            </span>
            <span className="font-mono text-sm font-bold text-[var(--text-primary)]">
              €3,200.00
            </span>
          </div>
          {/* Allocation rows */}
          <div className="flex justify-between border-b border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-xs text-[var(--text-secondary)]">
              Remaining (positive)
            </span>
            <span className="font-mono text-xs text-[var(--income-300)]">
              +€515.50
            </span>
          </div>
          <div className="flex justify-between border-b border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-xs text-[var(--text-secondary)]">
              Balanced (zero)
            </span>
            <span className="font-mono text-xs text-[var(--text-tertiary)]">
              €0.00
            </span>
          </div>
          <div className="flex justify-between px-[var(--space-4)] py-[var(--space-2)]">
            <span className="text-xs text-[var(--text-secondary)]">
              Over-allocated (negative)
            </span>
            <span className="font-mono text-xs text-[var(--expense-300)]">
              –€120.00
            </span>
          </div>
        </div>
      </div>

      {/* ErrorState */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          ErrorState
        </h3>
        <ErrorState
          message="Failed to load transactions"
          onRetry={() => {}}
        />
      </div>

      {/* LoadingSkeleton */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          LoadingSkeleton
        </h3>
        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-3">
          <div className="space-y-2">
            <span className="text-xs text-[var(--text-tertiary)]">Card</span>
            <LoadingSkeleton variant="card" />
          </div>
          <div className="space-y-2">
            <span className="text-xs text-[var(--text-tertiary)]">
              Table Row (3)
            </span>
            <LoadingSkeleton variant="table-row" count={3} />
          </div>
          <div className="space-y-2">
            <span className="text-xs text-[var(--text-tertiary)]">Chart</span>
            <LoadingSkeleton variant="chart" />
          </div>
        </div>
      </div>

      {/* EmptyState */}
      <div className="space-y-[var(--space-3)]">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          EmptyState
        </h3>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <EmptyState message="No transactions found for this period" />
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-root)] px-[var(--space-8)] py-[var(--space-12)]">
      <header className="mb-[var(--space-16)]">
        <h1 className="font-serif text-[48px] text-[var(--text-primary)]">
          Quiet Ledger Design System
        </h1>
        <p className="mt-[var(--space-2)] text-[var(--text-secondary)]">
          Visual reference for tokens, typography, and components
        </p>
      </header>

      <div className="mx-auto max-w-5xl space-y-[var(--space-16)]">
        <SurfacePaletteSection />
        <SemanticColorsSection />
        <ChartPaletteSection />
        <TypographySection />
        <SpacingSection />
        <ComponentsSection />
      </div>
    </div>
  )
}
