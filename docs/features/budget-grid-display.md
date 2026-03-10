# Budget Grid Display & API Integration

**Date:** 2026-03-10
**Related Files:** `src/features/budget/`, `src/api/budget-plan.ts`, `src/pages/budget-page.tsx`

## Overview

The budget grid displays a categories-by-months table with section totals and an allocation indicator row. It fetches budget plan data via the API, groups entries by type (income/expense/savings), computes all totals client-side, and renders a semantic HTML `<table>` with a sticky first column for horizontal scrolling.

## What Was Built

- Budget plan API layer (`getBudgetPlan`) following the existing `get<T>()` client pattern
- `useBudgetPlan` TanStack Query hook with year-based query key from `FilterContext`
- `BudgetGrid` component: native HTML `<table>` with sticky Category column, 12 month columns, and Total column
- `BudgetSection` component: renders section header, category rows, and section total row with color-coded styling
- `AllocationIndicator` component: "To Allocate" row showing Income - Expenses - Savings per month with conditional coloring
- `BudgetGridSkeleton` component: skeleton loader matching the grid structure
- Updated `BudgetPage` with loading/error/empty/data states

## Technical Implementation

### Key Files

- `src/api/budget-plan.ts`: API module calling `GET /budget-plans?year={year}`
- `src/features/budget/hooks/use-budget-plan.ts`: TanStack Query hook with `["budget-plan", selectedYear]` key
- `src/features/budget/components/budget-grid.tsx`: Main grid orchestrator, filters entries by type, computes allocation values
- `src/features/budget/components/budget-section.tsx`: Renders section header + category rows + section total row
- `src/features/budget/components/allocation-indicator.tsx`: Final "To Allocate" row with color logic
- `src/features/budget/components/budget-grid-skeleton.tsx`: Skeleton loader with 8 animated rows
- `src/pages/budget-page.tsx`: Page component with conditional rendering for all states

### Key Patterns

- **Sticky First Column**: The Category column uses `position: sticky; left: 0; z-index: 10` with a matching `bg-[var(--bg-root)]` (or `bg-[var(--bg-raised)]` for total rows) to cover content during horizontal scroll. Every `<td>` and `<th>` in the first column must include the sticky + background styles.

- **Client-Side Total Computation**: All totals (monthly section totals, annual category totals, allocation values) are computed client-side from `BudgetPlan.entries`. Monthly totals use `MONTHS.map()` with `.reduce()` per section. The allocation row is `income - expenses - savings` per month.

- **Color-Coded Sections**: Each section type maps to a design token color via `SECTION_CONFIG`:
  - Income: `var(--income-300)` (sage)
  - Expenses: `var(--expense-300)` (terracotta)
  - Savings: `var(--savings-300)` (copper)

- **Conditional Value Coloring**: The allocation indicator uses `getAllocationColor()`: positive values use `var(--income-300)`, negative use `var(--expense-300)`, zero uses `var(--text-tertiary)`.

- **Dash for Empty/Zero Cells**: All amount cells display "—" when the value is 0, using `{amount === 0 ? "—" : formatCurrency(amount)}`.

### Code Examples

```tsx
// Using the budget plan hook in a page
import { useBudgetPlan } from "@/features/budget/hooks/use-budget-plan"

const { data, isLoading, isError, error, refetch } = useBudgetPlan()

// Rendering the grid with data
{!isLoading && !isError && data && data.entries.length > 0 && (
  <BudgetGrid budgetPlan={data} />
)}
```

```tsx
// Section total computation pattern (reusable for budget-vs-actual)
const monthlyTotals = MONTHS.map((month) =>
  entries.reduce((sum, entry) => sum + (entry.amounts[month] ?? 0), 0),
)
```

## How to Use

1. Navigate to `/budget` in the application
2. The page fetches budget data for the currently selected year (from the global year filter)
3. Data renders in a grid grouped by INCOME, EXPENSES, and SAVINGS sections
4. Scroll horizontally to view all months; the Category column stays fixed
5. The "To Allocate" row at the bottom shows remaining budget per month

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `year` | number | `selectedYear` from FilterContext | Year to fetch budget plan for |

## Notes

- The grid uses native HTML `<table>` for semantic structure and accessibility
- Hover on data cells shows a subtle outline indicating future editability
- The skeleton loader renders 8 rows to approximate a typical budget layout
- `formatCurrency` is called with `"expense"` type for negative allocation values to ensure correct sign display
- The `BudgetSection` component renders React fragments (`<>...</>`) since `<tbody>` sections are not used for grouping
