# Transaction List Display & API Integration

**Date:** 2026-03-10
**Related Files:** `src/features/transactions/`, `src/api/transactions.ts`, `src/lib/format.ts`, `src/lib/query-client.ts`

## Overview

Implements the first data-driven feature page in Life Organizer — a transaction list with summary stat cards, TanStack Query data fetching, and full loading/error/empty state handling. Establishes the feature module pattern and TanStack Query conventions that all subsequent features should follow.

## What Was Built

- TanStack Query integration with shared `QueryClient` and `QueryClientProvider`
- Transactions API module with paginated fetching and client-side summary computation
- `useTransactions` hook integrating TanStack Query with global year/period filters
- `TransactionTable` component using shadcn/ui Table with Quiet Ledger styling
- `TransactionsPage` with stat cards, loading skeletons, error state with retry, and empty state
- Currency and date formatting utilities

## Technical Implementation

### Key Files

- `src/lib/query-client.ts`: Shared QueryClient instance (5min staleTime, 1 retry, no refetch on focus)
- `src/api/transactions.ts`: `getTransactions(params)` API call and `getTransactionSummary()` reducer
- `src/features/transactions/hooks/use-transactions.ts`: TanStack Query hook with FilterContext integration
- `src/features/transactions/components/transaction-table.tsx`: Styled table with color-coded amounts
- `src/features/transactions/transactions-page.tsx`: Full page with stat cards and state handling
- `src/lib/format.ts`: `formatCurrency()` and `formatDate()` utilities

### Key Patterns

- **Feature Module Structure**: Each feature lives in `src/features/<name>/` with `components/`, `hooks/`, and a top-level page component. The route-level page in `src/pages/` re-exports from the feature module.

- **TanStack Query Hook Pattern**: Hooks in `hooks/use-<resource>.ts` call API functions from `src/api/`, use query keys like `['transactions', year, period]` derived from `useFilter()`, and return the standard `{ data, isLoading, isError, error, refetch }` tuple.

- **Page State Pattern**: Pages handle four states in order: loading (skeleton loaders), error (ErrorState with retry), empty (EmptyState with message), and success (data rendering).

- **Currency Formatting**: Use `formatCurrency(amount, type)` — returns `€ X,XXX.XX` for income/savings, `−€ X,XXX.XX` (U+2212 minus) for expenses. Always uses absolute values internally.

### Code Examples

```tsx
// Creating a new feature hook following the established pattern
import { useQuery } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getBudget } from "@/api/budget"

export function useBudget() {
  const { selectedYear, selectedPeriod } = useFilter()

  return useQuery({
    queryKey: ["budget", selectedYear, selectedPeriod],
    queryFn: () => getBudget({ year: selectedYear, period: selectedPeriod }),
  })
}
```

```tsx
// Page state handling pattern
const { data, isLoading, isError, error, refetch } = useBudget()

return (
  <div>
    <Header title="Budget" />
    {isLoading && <LoadingSkeleton variant="card" />}
    {isError && <ErrorState message={error?.message} onRetry={() => void refetch()} />}
    {!isLoading && !isError && data && data.length === 0 && (
      <EmptyState message="No budget data for this period." />
    )}
    {!isLoading && !isError && data && data.length > 0 && (
      /* render data */
    )}
  </div>
)
```

## How to Use

1. **Add a new feature**: Create `src/features/<name>/` with `components/`, `hooks/`, and a page component
2. **Create an API module**: Add `src/api/<resource>.ts` using `get()` from `src/api/client.ts`
3. **Create a query hook**: Use `useQuery` with a descriptive query key that includes filter params from `useFilter()`
4. **Wire up the page**: Re-export the feature page from `src/pages/<name>-page.tsx` and handle all four states
5. **Format amounts**: Use `formatCurrency(amount, type)` for consistent euro formatting with type-based coloring

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `staleTime` | number | 300000 (5min) | How long query data stays fresh before refetching |
| `retry` | number | 1 | Number of retry attempts on failed queries |
| `refetchOnWindowFocus` | boolean | false | Whether to refetch when window regains focus |

## Notes

- Query keys must include all filter parameters to ensure proper cache invalidation when filters change
- `getTransactionSummary()` computes totals client-side from the paginated response; this may need a dedicated API endpoint for large datasets
- Amount normalization uses `Math.abs()` to handle backend amounts that may be negative for expenses
- Date formatting uses manual month parsing (not `Date` constructor) to avoid timezone issues
