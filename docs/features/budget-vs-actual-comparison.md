# Budget vs Actual Comparison View

**Story:** LIFE-49 | **Epic:** LIFE-48 (Budget vs Actual Tracking)

## Overview

The Budget vs Actual page (`/budget-vs-actual`) displays a side-by-side comparison of budgeted amounts versus actual spending for each category, grouped into Expenses, Income, and Savings sections.

## Architecture

### File Structure

```
src/
├── api/budget-tracking.ts                          # API: getBudgetVsActual(year, period)
├── features/budget-vs-actual/
│   ├── hooks/use-budget-vs-actual.ts               # React Query hook
│   ├── comparison-table.tsx                         # Table component per section
│   ├── completion-bar.tsx                           # Progress bar with corrected colors
│   └── budget-vs-actual-skeleton.tsx                # Loading skeleton
└── pages/budget-vs-actual-page.tsx                  # Page orchestrator
```

### Data Flow

1. `BudgetVsActualPage` reads filter context (year, period) via `useBudgetVsActual` hook
2. Hook calls `getBudgetVsActual(year, period)` → `GET /budget-vs-actual?year={year}&period={period}`
3. API returns `BudgetVsActualEntry[]` with pre-calculated `remaining`, `excess`, `percentComplete`
4. Page renders three `ComparisonTable` instances filtered by type

### Key Decisions

- **Pre-calculated values**: The API returns `remaining`, `excess`, and `percentComplete` — the frontend displays them directly without client-side recalculation.
- **CompletionBar vs ProgressBar**: A separate `CompletionBar` was created because the shared `ProgressBar` has different color thresholds (amber <80%, green 80-100%) while this feature requires (green/sage <80%, amber 80-100%, terracotta >100%).
- **Per-section sorting**: Rows within each section are sorted by `(actual - budgeted)` descending, so overspent categories appear first.

## Component API

### ComparisonTable

```tsx
<ComparisonTable entries={BudgetVsActualEntry[]} type="expense" | "income" | "savings" />
```

Filters entries by type, sorts by overspend, renders columns: Category, Budget, Actual, Progress, %, Remaining.

### CompletionBar

```tsx
<CompletionBar percentage={number} />
```

6px progress bar: green (income-400) <80%, amber (savings-400) 80-100%, terracotta (expense-400) >100%. Width capped at 100%.

## Visual Spec

- **Category column**: DM Sans, weight 500, `--text-primary`, 160px
- **Budget/Actual columns**: DM Mono, 13px, `--text-secondary`, 100px each
- **Percentage**: DM Mono, terracotta when >100%, "—" when budget is 0
- **Remaining**: Sage (income-400) when under budget, terracotta with "−€" prefix when over budget
- **Section cards**: `--bg-surface`, `--border-subtle`, `--radius-lg`

## Test Coverage

- **API tests** (5): URL construction, parameter passing, error handling
- **Hook tests** (5): Filter context integration, loading/error states
- **ComparisonTable tests** (12): Rendering, sorting, color coding, zero-budget handling, type filtering
- **Page tests** (8): Loading skeleton, error/retry, empty state, section rendering order
