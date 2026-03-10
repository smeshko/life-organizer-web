# Inline Budget Editing with Optimistic Updates

**Date:** 2026-03-10
**Related Files:** `src/features/budget/components/budget-cell.tsx`, `src/features/budget/hooks/use-update-budget.ts`, `src/features/budget/utils/grid-navigation.ts`, `src/features/budget/components/budget-grid.tsx`, `src/features/budget/components/budget-section.tsx`

## Overview

Inline budget editing allows users to click any data cell in the budget grid, type a new value, and navigate between cells using keyboard shortcuts (Enter, Tab, Shift+Tab, Escape). Changes are saved via optimistic mutation — the UI updates immediately while the API call happens in the background. On error, values revert and a persistent toast with retry appears.

## What Was Built

- `BudgetCell` component with display/edit state machine controlled by parent grid
- `BudgetCellEditor` extracted sub-component handling input focus, keyboard events, and blur coordination
- `useUpdateBudget` mutation hook with TanStack Query optimistic update pattern
- Grid navigation utilities (`buildCellGrid`, `getNextCell`) for Excel-like keyboard movement
- Sonner toast integration with design token styling (success: copper/savings, error: terracotta/expense)

## Technical Implementation

### Key Files

- `src/features/budget/components/budget-cell.tsx`: Display/edit state machine with numeric input sanitization
- `src/features/budget/hooks/use-update-budget.ts`: `useMutation` with `onMutate` (optimistic), `onError` (rollback + toast), `onSuccess` (success toast)
- `src/features/budget/utils/grid-navigation.ts`: Pure functions for cell ID generation and directional navigation
- `src/features/budget/components/budget-grid.tsx`: Editing state management, mutation wiring, navigation coordination
- `src/features/budget/components/budget-section.tsx`: Renders `BudgetCell` per data cell, passes editing props from grid
- `src/api/budget-plan.ts`: `updateBudgetPlan(year, data)` calling `PUT /budget-plans`
- `src/main.tsx`: Sonner `<Toaster>` configured with dark theme and design token colors

### Key Patterns

- **Optimistic Mutation with Rollback**: The `useUpdateBudget` hook snapshots the current TanStack Query cache in `onMutate`, applies the update optimistically, and rolls back to the snapshot on `onError`. The `mutationFn` reads current cache (not stale closure data) to build the full API request payload. This pattern should be followed for all future mutations.

- **Controlled Editing State**: The parent `BudgetGrid` owns `editingCellId` state. Cells compare their `cellId` to `editingCellId` to determine display vs edit mode. This avoids multiple cells being in edit mode simultaneously and enables keyboard navigation to directly transition between cells.

- **Blur-vs-Keyboard Coordination**: `BudgetCellEditor` uses two refs (`savedRef` and `navigatedRef`) to prevent double-saves. When a keyboard shortcut (Enter/Tab) fires, it sets `navigatedRef.current = true` before saving, so the subsequent blur event (triggered by focus moving) is suppressed. This is critical — without it, blur fires after keyboard navigation and can override the navigation target.

- **Cell ID Convention**: Cell IDs follow the format `{type}-{category}-{month}` (e.g., `income-Salary-1`). The type prefix prevents collisions when the same category name appears across types.

- **Grid Navigation Model**: `buildCellGrid` creates a flat array of cell IDs ordered by entry then month. `getNextCell` computes directional moves: right/left by ±1 index, down by +12 (one full row of months). Returns `null` at grid boundaries.

- **Numeric Input Sanitization**: Uses `type="text" inputMode="numeric"` (not `type="number"`) to avoid browser scroll-wheel and arrow-key issues. The `sanitizeNumericInput` function strips all non-digit characters except a single decimal point.

- **Toast Styling with Design Tokens**: Success toasts use `--savings-border` (copper accent) with 3s auto-dismiss. Error toasts use `--expense-border` (terracotta accent) with `duration: Infinity` and a Retry action button. Base toast styling is set in `main.tsx` via the Sonner `<Toaster>` component.

### Code Examples

```tsx
// Using the mutation hook in a grid component
import { useUpdateBudget } from "@/features/budget/hooks/use-update-budget"

const mutation = useUpdateBudget(budgetPlan.year)

function handleCellSave(
  category: string,
  type: "income" | "expense" | "savings",
  month: number,
  newValue: number,
) {
  mutation.mutate({ category, type, month, value: newValue })
}
```

```tsx
// Building navigation grid and computing next cell
import { buildCellGrid, getNextCell } from "@/features/budget/utils/grid-navigation"

const cellGrid = buildCellGrid([...incomeEntries, ...expenseEntries, ...savingsEntries])
const nextCellId = getNextCell(currentCellId, "down", cellGrid) // same month, next category
```

## How to Use

1. Click any data cell (not header, total, or allocation rows) to enter edit mode
2. The cell value is auto-selected — type to replace or edit
3. Press **Enter** to save and move down (same month, next category)
4. Press **Tab** to save and move right; **Shift+Tab** to move left
5. Press **Escape** to cancel and revert to the original value
6. Click outside the cell to save and exit edit mode
7. All totals (row, section, allocation) update immediately on save

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `year` | number | `budgetPlan.year` | Year for the mutation API call |
| Toast position | string | `bottom-right` | Set in `main.tsx` Toaster component |
| Success duration | number | `3000` | Auto-dismiss time for success toast (ms) |
| Error duration | number | `Infinity` | Error toasts persist until dismissed |

## Notes

- This is the first `useMutation` pattern in the codebase — use it as the template for future mutations
- `requestAnimationFrame` is used in `BudgetCellEditor` to ensure the input DOM element exists before calling `.focus()` and `.select()`
- The grid navigation utilities are pure functions with no React dependencies, making them easy to unit test
- 41 tests cover the editing feature across 5 test files (cell component, mutation hook, toast styling, grid navigation, budget section integration)
