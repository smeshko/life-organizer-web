# Transaction Sorting & Pagination

**Story:** LIFE-42 — Story 3.3
**Created:** 2026-03-10

## Overview

Adds column-based sorting and offset-based pagination to the transaction ledger, allowing users to sort by date or amount and navigate through large result sets in pages of 50.

## Architecture

### Sort & Page State

Sort and pagination state is managed in `useTransactionFilters` via the existing `useReducer` pattern:

- `sortBy: "date" | "amount"` — active sort column (default: `"date"`)
- `sortOrder: "asc" | "desc"` — sort direction (default: `"desc"`)
- `page: number` — current page (default: `1`)

**Reducer actions:**
- `SET_SORT` — toggles order if same field, resets to `desc` for new field; always resets page to 1
- `SET_PAGE` — sets page number directly

Page automatically resets to 1 when any filter changes (type, categories, date range, sort field).

### API Integration

`useTransactions` forwards `sortBy`, `sortOrder`, `page`, and a fixed `pageSize: 50` to `getTransactions()`. These are included in the TanStack Query key for proper cache invalidation.

`keepPreviousData` is used as `placeholderData` to prevent loading flashes during pagination.

### Components

#### TransactionTable (`transaction-table.tsx`)

- Date and Amount column headers are clickable with `cursor-pointer` styling
- Active sort column shows an `ArrowUp` or `ArrowDown` icon (14px, Lucide)
- Card header shows range format: "Showing 1–50 of 312" when `page` and `pageSize` props are provided
- Wrapped with `forwardRef` to support scroll-to-top on page change

#### TransactionPagination (`transaction-pagination.tsx`)

- Layout: `← Previous | Page X of Y | Next →`
- Uses shadcn `Button` (variant `ghost`, size `sm`)
- Previous disabled on page 1, Next disabled on last page
- Hidden when `totalPages <= 1`

### Page Integration (`transactions-page.tsx`)

- Passes sort/page state from `useTransactionFilters()` to `useTransactions()`
- Passes sort props + `onSortChange` to `TransactionTable`
- Passes pagination data + `setPage` to `TransactionPagination`
- Scrolls to table top (`scrollIntoView`) on page change via `useEffect`

## File Map

| File | Role |
|------|------|
| `src/features/transactions/hooks/use-transaction-filters.ts` | Sort/page state management |
| `src/features/transactions/hooks/use-transactions.ts` | API integration with sort/page params |
| `src/features/transactions/components/transaction-table.tsx` | Sortable headers, range display |
| `src/features/transactions/components/transaction-pagination.tsx` | Pagination controls |
| `src/features/transactions/transactions-page.tsx` | Orchestration |

## Design Tokens Used

- `var(--border-subtle)` — pagination border-top
- `var(--text-secondary)` — page info text
- `var(--text-tertiary)` — sort indicator icons, table headers
- `var(--space-3)`, `var(--space-4)` — pagination padding

## Testing

- **Hook tests:** sort toggle, page reset on filter change, default values
- **Component tests:** clickable headers, sort indicators, pagination buttons, boundary states
- **Integration tests:** sort triggers re-fetch, pagination navigation, pagination auto-hide
