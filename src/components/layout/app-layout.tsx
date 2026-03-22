import { Outlet, useLocation } from "react-router"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { MobileHeader } from "@/components/layout/mobile-header"

export function AppLayout() {
  const { pathname } = useLocation()
  const isBudget = pathname === "/budget" || pathname.startsWith("/budget/")

  return (
    <div className="flex min-h-screen bg-[var(--bg-root)]">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar collapsed={isBudget} />
      </div>

      <div className="flex flex-1 flex-col">
        {/* Mobile top bar — hidden on desktop */}
        <MobileHeader />

        <main
          data-testid="content-area"
          className="flex-1 px-[var(--space-3)] py-[var(--space-4)] pb-20 md:px-[var(--space-6)] md:py-[var(--space-5)] md:pb-[var(--space-5)]"
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <BottomNav />
    </div>
  )
}
