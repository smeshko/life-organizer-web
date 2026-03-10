import { NavLink } from "react-router"
import { LayoutList, PieChart, Grid3X3, BarChart3 } from "lucide-react"

export interface SidebarProps {
  collapsed: boolean
}

const NAV_ITEMS = [
  { to: "/transactions", label: "Transactions", icon: LayoutList },
  { to: "/spending", label: "Spending", icon: PieChart },
  { to: "/budget", label: "Budget", icon: Grid3X3 },
  { to: "/budget-vs-actual", label: "Budget vs Actual", icon: BarChart3 },
]

const QUICK_STATS = [
  { label: "INCOME", amount: "€4,250", color: "--income-300" },
  { label: "SPENT", amount: "€2,847", color: "--expense-300" },
  { label: "SAVED", amount: "€850", color: "--savings-300" },
  { label: "REMAINING", amount: "€553", color: "--text-primary" },
]

export function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className="flex shrink-0 flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] transition-[width] duration-200 ease-in-out"
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

      {!collapsed && (
        <div className="mt-auto border-t border-[var(--border-subtle)] px-[var(--space-4)] py-[var(--space-4)]">
          <h3 className="mb-[var(--space-3)] text-[11px] font-semibold uppercase tracking-[1px] text-[var(--text-tertiary)]">
            MONTH AT A GLANCE
          </h3>
          <div className="flex flex-col gap-[var(--space-2)]">
            {QUICK_STATS.map(({ label, amount, color }) => (
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
        </div>
      )}
    </aside>
  )
}
