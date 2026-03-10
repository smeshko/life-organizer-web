# Conditional Documentation Guide

This guide helps you find relevant documentation based on what you're working on.

## Instructions

- Review the task you need to perform
- Check the conditions below
- Read the relevant documentation before proceeding
- Only read documentation if conditions match your task

## Documentation Map

- docs/features/quiet-ledger-design-tokens.md
  - Conditions:
    - When adding new shadcn/ui components to the Life Organizer project
    - When implementing income, expense, or savings-related UI for Quiet Ledger
    - When creating chart visualizations using the Quiet Ledger palette
    - When modifying surface/border/text colors in the Quiet Ledger theme
    - When configuring Tailwind v4 CSS-first setup with shadcn/ui

- docs/features/shared-ui-primitives.md
  - Conditions:
    - When building new feature views that need TypeBadge, StatCard, ProgressBar, or state components for Life Organizer
    - When creating new shared components in `src/components/` for the Quiet Ledger design system
    - When implementing budget-vs-actual progress visualization in Life Organizer features
    - When adding income/expense/savings type-colored UI elements to Life Organizer views

- docs/features/design-system-showcase-page.md
  - Conditions:
    - When adding new routes or pages to the Life Organizer application
    - When modifying the React Router configuration in `src/routes.tsx`
    - When adding new design tokens or components to the Quiet Ledger design system showcase
    - When creating standalone pages that render outside the app shell layout

- docs/features/api-client-foundation.md
  - Conditions:
    - When creating per-domain API modules (e.g., `transactions.ts`, `budget-plan.ts`) in `src/api/`
    - When handling API errors or implementing error UI for Life Organizer backend responses
    - When adding or modifying HTTP request logic for the Life Organizer API client
    - When implementing authentication headers or request interceptors for the API client
    - When adding new TypeScript interfaces for API request/response types in `src/api/types.ts`

- docs/features/app-shell-sidebar-navigation.md
  - Conditions:
    - When adding new routes or pages to the Life Organizer app shell layout
    - When modifying sidebar navigation items or quick-stats in Life Organizer
    - When implementing route-aware UI behavior (e.g., layout changes based on current path)
    - When working with the AppLayout, Sidebar, or Header components in `src/components/layout/`

- docs/features/global-year-period-filters.md
  - Conditions:
    - When creating a new React context or global state provider for Life Organizer
    - When adding components that need to read or modify the selected year/period filters
    - When implementing TanStack Query hooks that depend on year/period for Life Organizer API calls
    - When modifying the header selectors or sidebar quick-stats in the Life Organizer app shell
    - When writing tests for components that depend on FilterContext

- docs/features/transaction-list-api-integration.md
  - Conditions:
    - When creating a new TanStack Query hook or API module for Life Organizer data fetching
    - When building a new feature page under `src/features/` following the feature module pattern
    - When implementing loading, error, or empty states for a Life Organizer data-driven page
    - When formatting currency amounts or dates for display in Life Organizer transaction views
    - When adding or modifying query keys for TanStack Query cache management in Life Organizer

- docs/features/transaction-filtering.md
  - Conditions:
    - When implementing local filter state for a Life Organizer feature page (e.g., budget filters, spending filters)
    - When adding type/category/date filtering to Life Organizer transaction-related views
    - When working with `useTransactionFilters` hook or `TransactionFilters` component
    - When building controlled filter components that reset on global year/period changes
    - When extending the transaction API query parameters for filtering in Life Organizer

- docs/features/transaction-sorting-pagination.md
  - Conditions:
    - When adding sorting or pagination to a Life Organizer feature page
    - When extending `useTransactionFilters` with new filter state or sort fields
    - When building paginated API queries with TanStack Query in Life Organizer
    - When implementing scroll-to-top behavior on page navigation in Life Organizer

- docs/features/budget-grid-display.md
  - Conditions:
    - When building or modifying the budget grid view in `src/features/budget/`
    - When implementing categories-by-months grid layouts with section totals in Life Organizer
    - When adding sticky column tables with horizontal scroll in Life Organizer
    - When computing client-side financial totals or allocation rows for budget features
    - When building the budget-vs-actual comparison view that follows the budget grid pattern
