import { Outlet } from "react-router"

export function AppLayout() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
