# App Shell & Sidebar Navigation

**Date:** 2026-03-10
**Related Files:** `src/components/layout/app-layout.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/header.tsx`, `src/routes.tsx`

## Overview

The application shell provides a persistent sidebar with navigation links and monthly quick-stats alongside a main content area. The sidebar is a fixed 240px panel with the navigation links and the monthly quick-stats.

## What Was Built

- **AppLayout**: Flex-row shell wrapping Sidebar + content area via React Router layout routes
- **Sidebar**: 240px navigation panel with logo, 2 nav links (Lucide icons), and "Month at a Glance" quick-stats
- **Header**: Reusable page title component (Instrument Serif 32px) with year/period selector placeholders
- **2 pages**: Transactions and Spending — each wrapped in the app shell. The former Budget and Budget vs Actual routes redirect to `/transactions`

## Technical Implementation

### Key Files

- `src/routes.tsx`: Flat route definitions with `AppLayout` as a layout route wrapper. The `/design-system` route remains outside the shell.
- `src/components/layout/app-layout.tsx`: Flex-row shell rendering the Sidebar, the mobile header and bottom nav, and the `<Outlet />` content area.
- `src/components/layout/sidebar.tsx`: Accepts `collapsed: boolean` prop. Uses CSS `transition-[width] duration-200 ease-in-out` for smooth collapse. Hides labels, logo text, and quick-stats when collapsed. Adds `title` and `aria-label` attributes on collapsed nav items for accessibility.
- `src/components/layout/header.tsx`: Stateless component accepting `title` prop. Used by each page to render its heading.

### Key Patterns

- **Layout route pattern**: `AppLayout` is rendered via `<Route element={<AppLayout />}>` wrapping child routes, using React Router's `<Outlet />` for content injection.
- **Design token consistency**: All spacing, colors, and borders use CSS custom properties (`var(--space-X)`, `var(--bg-surface)`, etc.) from the Quiet Ledger design system.
- **Active nav styling**: Uses React Router's `<NavLink>` with `isActive` callback for conditional class application — income-themed colors for active state.

### Code Examples

Adding a new route to the app shell:

```tsx
// 1. Create the page component
// src/pages/reports-page.tsx
import { Header } from "@/components/layout/header"

export function ReportsPage() {
  return (
    <>
      <Header title="Reports" />
      <p>Reports content here</p>
    </>
  )
}

// 2. Add to routes.tsx inside the AppLayout wrapper
<Route element={<AppLayout />}>
  {/* ...existing routes... */}
  <Route path="reports" element={<ReportsPage />} />
</Route>

// 3. Add nav item in sidebar.tsx
const NAV_ITEMS = [
  // ...existing items...
  { to: "/reports", label: "Reports", icon: FileText },
]
```

## How to Use

1. **New pages**: Create a page component in `src/pages/`, use `<Header title="..." />` for the page title, add the route inside the `<Route element={<AppLayout />}>` wrapper in `src/routes.tsx`
2. **New nav items**: Add an entry to the `NAV_ITEMS` array in `sidebar.tsx` with `to`, `label`, and `icon` (Lucide icon component)
3. **Route-specific layout changes**: Add conditions in `app-layout.tsx` using `pathname` checks
4. **Quick-stats**: Currently hardcoded in `QUICK_STATS` array in `sidebar.tsx` — will be connected to real data in a future story

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| Sidebar width | CSS | 240px | Full sidebar width (set in `sidebar.tsx` inline style) |
| Min viewport | CSS | 1280px | Assumed minimum viewport width |

## Notes

- Quick-stats data is hardcoded for now (€4,250 income, €2,847 spent, €850 saved, €553 remaining) — will be replaced with real API data
- The `/` root path redirects to `/transactions` via `<Navigate to="/transactions" replace />`
- The `/design-system` route intentionally renders outside the app shell layout
