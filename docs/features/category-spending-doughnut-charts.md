# Category Spending Doughnut Charts

**Date:** 2026-03-10
**Related Files:** `src/features/spending/`, `src/components/charts/`, `src/api/budget-tracking.ts`

## Overview

Implements the Category Spending visualization page with three doughnut charts (Income, Expenses, Savings) that show how spending is distributed across categories. Introduces reusable chart components (`DoughnutChart`, `ChartContainer`) built on Recharts that establish the pattern for all future chart-based features.

## What Was Built

- Budget tracking API module for fetching category breakdown data
- Reusable `DoughnutChart` component wrapping Recharts `PieChart`
- Reusable `ChartContainer` with loading skeleton, empty state, and error handling
- `ChartLegend` component displaying sorted category items with color dots
- `SpendingCharts` orchestrator rendering three chart sections
- `SpendingPage` with period-aware subtitle and filter integration

## Technical Implementation

### Key Files

- `src/api/budget-tracking.ts`: API module for `GET /category-breakdown` with year/period/type params
- `src/components/charts/doughnut-chart.tsx`: Reusable doughnut chart wrapping Recharts `PieChart` with center label, hover expansion, and tooltip
- `src/components/charts/chart-container.tsx`: Shared chart section wrapper with loading skeleton, empty state, and title
- `src/features/spending/components/spending-charts.tsx`: Orchestrator rendering Income/Expenses/Savings sections
- `src/features/spending/components/chart-legend.tsx`: Sorted legend with color dots, amounts, and percentages
- `src/features/spending/hooks/use-category-breakdown.ts`: TanStack Query hook using `FilterContext` for year/period
- `src/features/spending/spending-page.tsx`: Page component with header and period subtitle

### Key Patterns

- **Chart Color Palette**: `CHART_COLORS` array in `doughnut-chart.tsx` contains 12 hex values matching CSS variables `--chart-1` through `--chart-12`. Recharts requires resolved hex values, not CSS variable references. Import and reuse this array for color consistency across chart types.

- **Chart Container Pattern**: Wrap any chart visualization in `ChartContainer` to get consistent card styling, loading skeletons, and empty states. Pass `isLoading`, `isEmpty`, and `emptyMessage` props — the container handles all three states automatically.

- **Center Label via Absolute Positioning**: The doughnut center label (total amount + "TOTAL") uses absolute positioning over the `ResponsiveContainer` rather than Recharts' built-in label, giving full control over typography (DM Mono 18px for amount, 11px uppercase for label).

- **Category Breakdown Query Key**: `['categoryBreakdown', year, period, type]` — invalidate or prefetch using this pattern when category data changes.

### Code Examples

```tsx
// Adding a new chart type using the reusable components
import { ChartContainer } from "@/components/charts/chart-container"
import { DoughnutChart } from "@/components/charts/doughnut-chart"
import { ChartLegend } from "@/features/spending/components/chart-legend"

function MyChartSection({ data, isLoading }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <ChartContainer
      title="My Chart"
      isLoading={isLoading}
      isEmpty={data.length === 0}
      emptyMessage="No data available"
    >
      <div className="flex items-start gap-[var(--space-6)]">
        <DoughnutChart data={data} totalAmount={total} />
        <ChartLegend data={data} />
      </div>
    </ChartContainer>
  )
}
```

```ts
// Creating a new category breakdown query hook
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { useFilter } from "@/contexts/filter-context"
import { getCategoryBreakdown } from "@/api/budget-tracking"

export function useCategoryBreakdown(type: "income" | "expense" | "savings") {
  const { selectedYear, selectedPeriod } = useFilter()
  return useQuery({
    queryKey: ["categoryBreakdown", selectedYear, selectedPeriod, type],
    queryFn: () => getCategoryBreakdown(selectedYear, selectedPeriod, type),
    placeholderData: keepPreviousData,
  })
}
```

## How to Use

1. Import `DoughnutChart` and `ChartContainer` from `src/components/charts/` for any new chart visualization
2. Provide data conforming to `CategoryBreakdown[]` type (category, amount, percentage fields)
3. Wrap in `ChartContainer` for consistent loading/empty/error state handling
4. Use `ChartLegend` for sorted category legends beside charts
5. Colors auto-cycle through the 12-color palette via index modulo

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `CHART_COLORS` | `string[]` | 12 hex values | Color palette for chart segments, matches `--chart-1` to `--chart-12` |
| `innerRadius` | `number` | `50` | Doughnut inner radius in pixels |
| `outerRadius` | `number` | `90` | Doughnut outer radius in pixels (~180px diameter) |
| `animationDuration` | `number` | `300` | Chart animation duration in milliseconds |

## Notes

- Recharts `ResponsiveContainer` has no dimensions in jsdom — tests must mock it with a fixed-size div wrapper
- The `activeShape` hover effect expands the segment by 6px beyond `outerRadius`
- Chart data expects pre-calculated `percentage` from the API — the frontend does not compute percentages
- The legend color-matches segments by finding each item's original index in the unsorted data array
