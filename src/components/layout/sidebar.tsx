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
    </aside>
  )
}
