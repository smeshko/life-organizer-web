import { NavLink } from "react-router"
import { LayoutList, PieChart, Grid3X3, BarChart3 } from "lucide-react"

const NAV_ITEMS = [
  { to: "/transactions", label: "Transactions", icon: LayoutList },
  { to: "/spending", label: "Spending", icon: PieChart },
  { to: "/budget", label: "Budget", icon: Grid3X3 },
  { to: "/budget-vs-actual", label: "Actual", icon: BarChart3 },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] md:hidden"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            [
              "flex flex-1 flex-col items-center gap-1 py-[var(--space-2)] text-[10px] font-medium transition-colors",
              isActive
                ? "text-[var(--income-300)]"
                : "text-[var(--text-tertiary)]",
            ].join(" ")
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
