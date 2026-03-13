import { Outlet, useLocation } from "react-router"
import { Sidebar } from "@/components/layout/sidebar"

export function AppLayout() {
  const { pathname } = useLocation()
  const isBudget = pathname === "/budget" || pathname.startsWith("/budget/")

  return (
    <div className="flex min-h-screen bg-[var(--bg-root)]">
      <Sidebar collapsed={isBudget} />
      <div className="flex flex-1 flex-col">
        <main
          data-testid="content-area"
          className="flex-1 px-[var(--space-6)] py-[var(--space-5)]"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
