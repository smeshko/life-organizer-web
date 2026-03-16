import { NavLink } from "react-router"
import { LayoutList, PieChart, Grid3X3, BarChart3, Sun, Moon, Monitor } from "lucide-react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { useTheme } from "@/components/theme-provider"
import { getTransactionTotals } from "@/api/transactions"
import { formatCurrency } from "@/lib/format"

export interface SidebarProps {
  collapsed: boolean
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const NAV_ITEMS = [
  { to: "/transactions", label: "Transactions", icon: LayoutList },
  { to: "/spending", label: "Spending", icon: PieChart },
  { to: "/budget", label: "Budget", icon: Grid3X3 },
  { to: "/budget-vs-actual", label: "Budget vs Actual", icon: BarChart3 },
]

function SidebarStats() {
  const { selectedYear, selectedPeriod } = useFilter()

  const { data } = useQuery({
    queryKey: ["sidebarTotals", selectedYear, selectedPeriod],
    queryFn: () => getTransactionTotals(selectedYear, selectedPeriod),
    placeholderData: keepPreviousData,
  })

  const income = data?.income ?? 0
  const expenses = data?.expenses ?? 0
  const savings = data?.savings ?? 0
  const remaining = income - expenses - savings

  const stats = [
    { label: "INCOME", amount: formatCurrency(income), color: "--income-300" },
    { label: "SPENT", amount: formatCurrency(expenses, "expense"), color: "--expense-300" },
    { label: "SAVED", amount: formatCurrency(savings), color: "--savings-300" },
    { label: "REMAINING", amount: formatCurrency(remaining, remaining < 0 ? "expense" : undefined), color: remaining < 0 ? "--expense-300" : "--text-primary" },
  ]

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      {stats.map(({ label, amount, color }) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-[11px] uppercase text-[var(--text-tertiary)]">
            {label}
          </span>
          <span
            className="font-mono text-[13px]"
            style={{ color: `var(${color})` }}
          >
            {amount}
          </span>
        </div>
      ))}
    </div>
  )
}

const THEME_OPTIONS = [
  { value: "light" as const, icon: Sun, label: "Light" },
  { value: "dark" as const, icon: Moon, label: "Dark" },
  { value: "system" as const, icon: Monitor, label: "System" },
]

function ThemeToggle({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme()

  if (collapsed) {
    const current = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[2]
    const next = THEME_OPTIONS[(THEME_OPTIONS.indexOf(current) + 1) % THEME_OPTIONS.length]
    return (
      <button
        onClick={() => setTheme(next.value)}
        title={`Theme: ${current.label}`}
        className="flex items-center justify-center rounded-[var(--radius-sm)] p-[var(--space-2)] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
      >
        <current.icon size={16} />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-[var(--space-1)] rounded-[var(--radius-md)] bg-[var(--bg-raised)] p-[var(--space-1)] border border-[var(--border-subtle)]">
      {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={[
            "flex flex-1 items-center justify-center gap-[var(--space-1)] rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1)] text-[11px] font-medium transition-colors",
            theme === value
              ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
          ].join(" ")}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  )
}

export function Sidebar({ collapsed }: SidebarProps) {
  const { selectedPeriod } = useFilter()

  const glanceHeading =
    selectedPeriod === "total"
      ? "YEAR AT A GLANCE"
      : `${MONTH_NAMES[selectedPeriod - 1].toUpperCase()} AT A GLANCE`

  return (
    <aside
      className="sticky top-0 flex h-screen shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-[width] duration-200 ease-in-out"
      style={{ width: collapsed ? "52px" : "240px" }}
    >
      <div className="flex items-center gap-[var(--space-2)] px-[var(--space-4)] py-[var(--space-5)] overflow-hidden">
        <span
          className="inline-block h-[8px] w-[8px] shrink-0 rounded-full"
          style={{ backgroundColor: "var(--income-300)" }}
        />
        {!collapsed && (
          <span className="font-serif text-[18px] text-[var(--text-primary)] whitespace-nowrap">
            Life Organizer
          </span>
        )}
      </div>

      <nav aria-label="Main navigation" className="flex flex-col gap-[var(--space-1)] px-[var(--space-2)]">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            aria-label={collapsed ? label : undefined}
            className={({ isActive }) =>
              [
                "flex items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] px-[var(--space-3)] py-[var(--space-2)] text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "border border-[var(--income-border)] bg-[var(--income-bg-strong)] text-[var(--income-300)]"
                  : "border border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
                collapsed ? "justify-center px-0" : "",
              ].join(" ")
            }
          >
            <Icon size={16} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col">
        {!collapsed && (
          <div className="border-t border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-4)]">
            <h3 className="mb-[var(--space-3)] text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text-tertiary)]">
              {glanceHeading}
            </h3>
            <SidebarStats />
          </div>
        )}
        <div className={`border-t border-[var(--border-subtle)] ${collapsed ? "flex justify-center py-[var(--space-2)]" : "px-[var(--space-4)] py-[var(--space-3)]"}`}>
          <ThemeToggle collapsed={collapsed} />
        </div>
      </div>
    </aside>
  )
}
