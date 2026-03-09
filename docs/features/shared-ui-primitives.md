# Shared UI Primitives & Component Styling

**Date:** 2026-03-09
**Related Files:** `src/components/type-badge.tsx`, `src/components/stat-card.tsx`, `src/components/progress-bar.tsx`, `src/components/error-state.tsx`, `src/components/loading-skeleton.tsx`, `src/components/empty-state.tsx`, `src/components/ui/select.tsx`, `src/components/ui/table.tsx`

## Overview

Reusable UI primitives styled with the Quiet Ledger design system, providing consistent building blocks for all feature views. These components establish the CVA variant pattern and CSS custom property referencing conventions used throughout the project.

## What Was Built

- **TypeBadge**: Inline badge with 3 financial type variants (income/expense/savings) using semantic colors
- **StatCard**: Summary card with type-colored left border accent, label/value/change layout
- **ProgressBar**: 6px animated bar with color thresholds (sage < 80%, amber 80–100%, terracotta > 100%)
- **ErrorState**: Warm yellow warning banner with optional retry button
- **LoadingSkeleton**: Animated pulse placeholders in card, table-row, and chart variants
- **EmptyState**: Centered tertiary-colored message for empty data states
- **shadcn/ui Select & Table**: Installed and customized with Quiet Ledger surface/border tokens

## Technical Implementation

### Key Files

- `src/components/type-badge.tsx`: CVA-based badge with income/expense/savings variant styles
- `src/components/stat-card.tsx`: Card with type-to-color maps for border accent and value text
- `src/components/progress-bar.tsx`: Threshold-based color fill with visual cap at 100%
- `src/components/error-state.tsx`: Warning banner using `--warning-bg`/`--warning-border` tokens
- `src/components/loading-skeleton.tsx`: Three layout variants (card, table-row, chart) with pulse animation
- `src/components/empty-state.tsx`: Minimal centered message component
- `src/components/ui/select.tsx`: shadcn/ui Select customized for Quiet Ledger
- `src/components/ui/table.tsx`: shadcn/ui Table with `--border-subtle` rows and `--bg-hover` hover

### Key Patterns

- **CVA Variant Pattern**: Use `class-variance-authority` for components with multiple visual variants. Define a `variants` config object with Tailwind classes referencing CSS custom properties. See `type-badge.tsx` for the canonical example.

- **Type-to-Color Mapping**: For components that change color based on financial type (income/expense/savings/balance), define `const` lookup objects mapping type strings to Tailwind classes. See `borderColorMap` and `valueColorMap` in `stat-card.tsx`.

- **CSS Custom Property Referencing**: Always use Tailwind arbitrary value syntax — `bg-[var(--token-name)]`, `text-[var(--token-name)]` — to reference Quiet Ledger design tokens. Never hardcode hex colors.

- **Component API Convention**: All components extend their base HTML element's attributes via `React.HTMLAttributes<HTMLElement>`, accept `className` for composition, and use `cn()` to merge classes. Props are spread with `{...props}`.

### Code Examples

```tsx
// TypeBadge — renders a colored tag for financial types
<TypeBadge variant="income">Income</TypeBadge>
<TypeBadge variant="expense">Expense</TypeBadge>
<TypeBadge variant="savings">Savings</TypeBadge>

// StatCard — summary card with type-colored accent
<StatCard
  type="income"
  label="Total Income"
  value="$4,250.00"
  change="+12.5% vs last month"
  changeColor="var(--income-300)"
/>

// ProgressBar — budget usage with automatic color thresholds
<ProgressBar percentage={65} />   {/* sage green */}
<ProgressBar percentage={90} />   {/* amber */}
<ProgressBar percentage={115} />  {/* terracotta, visually capped at 100% */}

// LoadingSkeleton — layout-aware placeholders
<LoadingSkeleton variant="card" />
<LoadingSkeleton variant="table-row" count={5} />
<LoadingSkeleton variant="chart" />

// ErrorState — warm warning banner with retry
<ErrorState message="Failed to load budget data" onRetry={() => refetch()} />

// EmptyState — no data message
<EmptyState message="No transactions for this period" />
```

## How to Use

1. Import from `@/components/[component-name]` (not from `@/components/ui/`)
2. All components accept `className` for additional styling via Tailwind
3. Use `variant` prop for TypeBadge, `type` prop for StatCard to select financial color
4. ProgressBar auto-selects color based on percentage — just pass the number
5. ErrorState shows retry button only when `onRetry` callback is provided

## Configuration

| Component | Prop | Type | Default | Description |
|-----------|------|------|---------|-------------|
| TypeBadge | variant | `"income" \| "expense" \| "savings"` | `"income"` | Financial type color scheme |
| StatCard | type | `"income" \| "expense" \| "savings" \| "balance"` | — | Card accent and value color |
| StatCard | change | `string` | — | Optional change text below value |
| StatCard | changeColor | `string` | `--text-tertiary` | CSS color for change text |
| ProgressBar | percentage | `number` | — | Fill percentage (visually capped at 100%) |
| LoadingSkeleton | variant | `"card" \| "table-row" \| "chart"` | — | Placeholder shape |
| LoadingSkeleton | count | `number` | `1` | Number of rows (table-row variant only) |
| ErrorState | onRetry | `() => void` | — | Optional retry callback (shows button when provided) |

## Notes

- All components live in `src/components/` (shared) — never in `src/features/`
- Components must NOT import from `src/features/` (dependency rule)
- ProgressBar clamps negative percentages to 0
- StatCard change text defaults to `--text-tertiary` color when no `changeColor` is specified
- shadcn/ui Table rows use `--border-subtle` dividers and `--bg-hover` on hover
