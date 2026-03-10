# App Shell & Sidebar Navigation

**Date:** 2026-03-10
**Related Files:** `src/components/layout/app-layout.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/header.tsx`, `src/routes.tsx`

## Overview

The application shell provides a persistent sidebar with navigation links and monthly quick-stats alongside a main content area. The sidebar collapses to icon-only mode on the `/budget` route to maximize grid space, with the collapse state derived entirely from the URL path — no component state management required.

## What Was Built

- **AppLayout**: Flex-row shell wrapping Sidebar + content area via React Router layout routes
- **Sidebar**: 240px navigation panel with logo, 4 nav links (Lucide icons), and "Month at a Glance" quick-stats
- **Header**: Reusable page title component (Instrument Serif 32px) with year/period selector placeholders
- **Route-aware collapse**: Sidebar auto-collapses to 52px on `/budget`, restoring on navigation away
- **4 placeholder pages**: Transactions, Spending, Budget, Budget vs Actual — each wrapped in the app shell

## Technical Implementation

### Key Files

- `src/routes.tsx`: Flat route definitions with `AppLayout` as a layout route wrapper. The `/design-system` route remains outside the shell.
- `src/components/layout/app-layout.tsx`: Reads `useLocation()` to derive `isBudget` flag, passes `collapsed` prop to Sidebar, conditionally removes `maxWidth: 1200px` on budget route.
- `src/components/layout/sidebar.tsx`: Accepts `collapsed: boolean` prop. Uses CSS `transition-[width] duration-200 ease-in-out` for smooth collapse. Hides labels, logo text, and quick-stats when collapsed. Adds `title` and `aria-label` attributes on collapsed nav items for accessibility.
- `src/components/layout/header.tsx`: Stateless component accepting `title` prop. Used by each page to render its heading.

### Key Patterns

- **Route-derived UI state**: The sidebar collapse is computed from `pathname === "/budget"` in AppLayout, not stored in state. This means the sidebar automatically responds to URL changes including back/forward navigation.
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
3. **Route-specific layout changes**: Add conditions in `app-layout.tsx` using `pathname` checks, following the existing `isBudget` pattern
4. **Quick-stats**: Currently hardcoded in `QUICK_STATS` array in `sidebar.tsx` — will be connected to real data in a future story

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| Sidebar width | CSS | 240px | Full sidebar width (set in `sidebar.tsx` inline style) |
| Collapsed width | CSS | 52px | Icon-only sidebar width on `/budget` |
| Collapse transition | CSS | 200ms ease | Width transition timing |
| Content max-width | CSS | 1200px | Max content width (removed on `/budget`) |
| Min viewport | CSS | 1280px | Assumed minimum viewport width |

## Notes

- Quick-stats data is hardcoded for now (€4,250 income, €2,847 spent, €850 saved, €553 remaining) — will be replaced with real API data
- The `/` root path redirects to `/transactions` via `<Navigate to="/transactions" replace />`
- The `/design-system` route intentionally renders outside the app shell layout
- Sidebar collapse is specific to `/budget` — if more routes need collapse behavior, the pattern in `app-layout.tsx` can be extended
