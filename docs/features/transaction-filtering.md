# Transaction Filtering

**Date:** 2026-03-10
**Related Files:** `src/features/transactions/components/transaction-filters.tsx`, `src/features/transactions/hooks/use-transaction-filters.ts`, `src/features/transactions/hooks/use-transactions.ts`, `src/api/types.ts`, `src/api/transactions.ts`

## Overview

Transaction filtering allows users to narrow down their transaction list by type (Income/Expenses/Savings), category (multi-select), and date range. Filters are managed locally on the transactions page using a `useReducer`-based hook that automatically resets when the global year/period changes. All filters apply together with AND logic, and stat card totals update to reflect filtered results.

## What Was Built

- **Type filter tab bar** using shadcn/ui `Tabs` — All | Income | Expenses | Savings
- **Category multi-select dropdown** using `Popover` + `Checkbox` list pattern with "Clear all" reset
- **Date range filter** with native date inputs defaulting to the selected global period
- **`useTransactionFilters` hook** — local filter state management with auto-reset on global context change
- **Updated `useTransactions` hook** — accepts filter params and includes them in TanStack Query key

## Technical Implementation

### Key Files

- `src/features/transactions/hooks/use-transaction-filters.ts`: Local filter state hook using `useReducer`. Computes default date range from global year/period. Auto-resets all filters when global context changes.
- `src/features/transactions/components/transaction-filters.tsx`: Controlled component rendering type tabs, category multi-select popover, and date range inputs. Receives all state and callbacks via props.
- `src/features/transactions/hooks/use-transactions.ts`: TanStack Query hook that normalizes filter params (omitting defaults) and includes them in the query key for proper cache management.
- `src/api/types.ts`: `TransactionFilters` interface with `category: string[]` (array for multi-select) and `date_from`/`date_to` fields.
- `src/api/transactions.ts`: Serializes array-valued `category` param as comma-separated string in query params.

### Key Patterns

- **Local filter state with useReducer**: Filter state lives in a reducer (not React context) to keep it page-local. Actions: `SET_TYPE`, `SET_CATEGORIES`, `SET_DATE_RANGE`, `RESET`. This pattern should be replicated for filtering on other pages (budget, spending).

- **Auto-reset on global context change**: A `useEffect` watches `defaultRange` (derived from `selectedYear`/`selectedPeriod`). An `isInitialMount` ref prevents the reset from firing on first render — only subsequent changes trigger a reset. This is critical to avoid clearing user-set filters on mount.

- **Query key normalization**: Before including filter values in the TanStack Query key, they are normalized — `type: "all"` becomes `undefined`, empty `categories` array becomes `undefined`, empty date strings become `undefined`. This prevents cache misses from semantically-equivalent but structurally-different keys.

- **Controlled filter component**: `TransactionFilters` is fully controlled — it receives state and callbacks via props, with no internal state. This makes it testable, composable, and reusable.

### Code Examples

```typescript
// Using the filter hook in a page component
const filters = useTransactionFilters()

// Pass filter state to the data-fetching hook
const { data } = useTransactions({
  type: filters.type,
  categories: filters.categories,
  dateFrom: filters.dateFrom,
  dateTo: filters.dateTo,
})

// Extract available categories from response data for the dropdown
const availableCategories = useMemo(() => {
  if (!data?.data) return []
  const cats = new Set(data.data.map((tx) => tx.category))
  return Array.from(cats).sort()
}, [data?.data])

// Render the controlled filter component
<TransactionFilters
  type={filters.type}
  categories={filters.categories}
  dateFrom={filters.dateFrom}
  dateTo={filters.dateTo}
  availableCategories={availableCategories}
  onTypeChange={filters.setType}
  onCategoriesChange={filters.setCategories}
  onDateRangeChange={filters.setDateRange}
/>
```

## How to Use

1. Import `useTransactionFilters` in your page component to get local filter state
2. Pass the filter values to `useTransactions` (or equivalent data hook) to include them in the API call
3. Extract available filter options (e.g., categories) from the API response
4. Render `<TransactionFilters>` with state and callbacks as props
5. Stat cards and counts automatically reflect filtered data since they derive from the filtered API response

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | `"all" \| "income" \| "expense" \| "savings"` | `"all"` | Transaction type filter |
| `categories` | `string[]` | `[]` | Selected category names (multi-select) |
| `dateFrom` | `string` | Period start date | Start of date range (YYYY-MM-DD) |
| `dateTo` | `string` | Period end date | End of date range (YYYY-MM-DD) |

## Notes

- Category options are derived from the current API response data, not a static list — categories update dynamically as data changes
- The `computeDateRange` utility converts global year/period into `dateFrom`/`dateTo` strings (e.g., period=3, year=2026 → "2026-03-01" to "2026-03-31")
- Filter state is intentionally NOT in React context — it should remain page-local per the architecture decision
- When replicating this pattern for other pages, follow the same `useReducer` + auto-reset structure
