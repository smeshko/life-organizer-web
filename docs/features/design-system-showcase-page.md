# Design System Showcase Page

**Date:** 2026-03-09
**Related Files:** `src/pages/design-system-page.tsx`, `src/routes.tsx`, `src/main.tsx`

## Overview

A standalone `/design-system` route that renders a visual gallery of all Quiet Ledger design tokens and shared UI components. This page serves as a developer verification tool to ensure the design system matches the UX specification before building features. It also introduces React Router to the project, establishing the routing pattern for all future pages.

## What Was Built

- React Router integration with `BrowserRouter`/`Routes`/`Route` in `src/routes.tsx`
- Full design system showcase page at `src/pages/design-system-page.tsx` (840 lines)
- Sections: Surface Palette, Semantic Colors, Chart Palette, Typography, Spacing, Components
- Live demos of all shared UI primitives (TypeBadge, StatCard, ProgressBar, ErrorState, LoadingSkeleton, EmptyState)
- Budget grid cell style previews and transaction table with realistic financial data

## Technical Implementation

### Key Files

- `src/routes.tsx`: Central route configuration using React Router v7 classic API. Defines all application routes with `BrowserRouter` > `Routes` > `Route` structure.
- `src/pages/design-system-page.tsx`: Standalone page component with local helper components (`Section`, `ColorCard`, `SwatchRow`) and hardcoded sample data arrays.
- `src/main.tsx`: Updated entry point — wraps `AppRouter` in `ThemeProvider` instead of rendering `App` directly.

### Key Patterns

- **Standalone page routing**: The design system page renders without any app shell or layout wrapper. Routes that should be standalone are placed directly in the `Routes` config without a layout parent. Future app pages will be wrapped in `AppLayout` (Epic 2).
- **Local helper components**: Gallery/showcase pages define helper components locally within the file (not exported) to keep them co-located with the data they display. This avoids polluting the shared components directory with single-use presentation components.
- **CSS variable consumption**: All styling references design tokens via `var(--token-name)` in Tailwind arbitrary values (e.g., `bg-[var(--bg-root)]`), ensuring the page visually validates the token system.

### Code Examples

```tsx
// Adding a new route (src/routes.tsx)
import { NewPage } from "@/pages/new-page"

<Routes>
  <Route path="/" element={<App />} />
  <Route path="/design-system" element={<DesignSystemPage />} />
  <Route path="/new-page" element={<NewPage />} />
</Routes>
```

```tsx
// Using the Section helper pattern for gallery pages
function Section({ title, description, children }: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-[var(--space-6)]">
      <h2 className="font-serif text-[36px] text-[var(--text-primary)]">{title}</h2>
      {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
      {children}
    </section>
  )
}
```

## How to Use

1. Run the dev server: `npm run dev`
2. Navigate to `http://localhost:5173/design-system`
3. Visually verify all tokens and components against the UX specification (`_bmad-output/ux-color-themes.html`)
4. Use this page as a reference when building feature views

## Configuration

This page uses no configuration. All data is hardcoded for design verification purposes. The page can be excluded from production builds in a future optimization.

## Notes

- The page is intentionally not wrapped in any app shell — it renders standalone
- React Router v7 is used with the classic `BrowserRouter`/`Routes`/`Route` API (not the data router API), which is suitable for this stage of the project
- All financial amounts use Euro (€) formatting to match the Quiet Ledger target market
- The `/` route currently renders the placeholder `App` component; it will be replaced by the main app layout in Epic 2
