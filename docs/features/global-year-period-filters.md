# Global Year & Period Filters (FilterContext)

**Date:** 2026-03-10
**Related Files:** `src/contexts/filter-context.tsx`, `src/components/layout/header.tsx`, `src/components/layout/sidebar.tsx`, `src/routes.tsx`

## Overview

A global filtering system that lets users select a year and period (month or total year) from the header. The selection persists across all views via React Context, ensuring every page reflects the same time context without re-selecting. This is the first global state context in the application and establishes the pattern for future contexts.

## What Was Built

- `FilterContext` with `useReducer` for year/period state management
- `FilterProvider` wrapping all routes for app-wide access
- `useFilter` hook with provider boundary guard
- shadcn/ui `Select` components in the header bound to filter state
- Dynamic sidebar "AT A GLANCE" heading that responds to period changes

## Technical Implementation

### Key Files

- `src/contexts/filter-context.tsx`: Context definition, reducer, provider, and hook. Exports `FilterProvider`, `useFilter`, `SelectedPeriod`, and `FilterState` types.
- `src/components/layout/header.tsx`: Year and period `Select` dropdowns connected to FilterContext via `useFilter()`.
- `src/components/layout/sidebar.tsx`: Reads `selectedPeriod` to render dynamic "MONTH AT A GLANCE" / "YEAR AT A GLANCE" heading.
- `src/routes.tsx`: `FilterProvider` wraps `<Routes>` inside `BrowserRouter` so all route components share filter state.

### Key Patterns

- **Context + useReducer + useMemo pattern**: State managed via `useReducer` with typed discriminated union actions (`SET_YEAR`, `SET_PERIOD`). The context value is wrapped in `useMemo` keyed on state fields to prevent unnecessary re-renders. This is the canonical pattern for all future app-level contexts.

- **Provider boundary guard**: `useFilter()` throws a descriptive error if called outside `FilterProvider`, making misuse immediately obvious during development.

- **Lazy initializer for default state**: `getDefaultState()` is passed as the third argument to `useReducer` (lazy init), ensuring `new Date()` is called only once on mount rather than on every render.

- **SelectedPeriod union type**: `'total' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12` — uses literal number types instead of a generic `number` for type safety. Conversion helpers `periodToString` / `stringToPeriod` bridge between Select string values and the typed state.

### Code Examples

```tsx
// Reading filter state in any component
import { useFilter } from "@/contexts/filter-context"

function MyComponent() {
  const { selectedYear, selectedPeriod, setYear, setPeriod } = useFilter()

  // selectedPeriod is 'total' | 1..12
  if (selectedPeriod === "total") {
    // Show full year data
  } else {
    // selectedPeriod is a number 1-12
    const monthIndex = selectedPeriod - 1
  }
}
```

```tsx
// Wrapping in tests - FilterProvider must be present
import { FilterProvider } from "@/contexts/filter-context"

render(
  <MemoryRouter>
    <FilterProvider>
      <ComponentUnderTest />
    </FilterProvider>
  </MemoryRouter>
)
```

## How to Use

1. Import `useFilter` from `@/contexts/filter-context` in any component within the route tree
2. Destructure `{ selectedYear, selectedPeriod }` for read access, or `{ setYear, setPeriod }` for write access
3. Use `selectedYear` and `selectedPeriod` as TanStack Query key parameters for automatic refetch when filters change (future epics)
4. In tests, wrap components with `<FilterProvider>` — place it inside `<MemoryRouter>` but outside the component under test

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectedYear` | `number` | `new Date().getFullYear()` | Currently selected year |
| `selectedPeriod` | `'total' \| 1..12` | Current month (1-12) | Selected period — "total" for full year or month number |

Year options are dynamically generated as current year down to 5 years prior.

## Notes

- Quick-stats amounts in the sidebar are hardcoded placeholders — actual data integration comes in later epics when TanStack Query hooks are implemented
- The `MONTH_NAMES` array is duplicated in both `header.tsx` and `sidebar.tsx` — could be extracted to a shared constant if more components need it
- Radix Select dropdown-open tests were removed from the test suite due to jsdom `scrollIntoView` limitation; compensated with trigger value and ARIA role assertions
