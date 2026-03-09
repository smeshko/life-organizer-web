---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/prd.md
workflowType: 'architecture'
lastStep: 8
project_name: 'life-organizer-frontend'
user_name: 'Ivo'
date: '2026-03-09'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
31 FRs across 6 capability areas:
- **Transaction Management** (FR1–FR7): Filterable, sortable, paginated transaction list
- **Category Spending Visualization** (FR8–FR12): Doughnut charts per type with period/year selection
- **Budget Planning** (FR13–FR19): Editable grid of categories x months with live totals and balance indicators
- **Budget vs Actual** (FR20–FR24): Per-category comparison with remaining/excess calculations
- **Period & Navigation** (FR25–FR27): Global year + period selectors controlling all views
- **Data Integration** (FR28–FR31): REST API consumption, data refresh on load

The application is **read-dominant** — 90% of FRs are data display and filtering. The only write operation is budget plan editing (FR14, FR30).

**Non-Functional Requirements:**
- Performance: < 2s cold load, < 500ms SPA navigation and chart rendering, < 100ms inline edit response
- Integration: Graceful API error handling, defensive parsing, centralized HTTP client
- Maintainability: Component-based architecture, abstracted API client, abstracted charting library

### Scale & Complexity

- **Primary domain:** Frontend web application (SPA)
- **Complexity level:** Low
- **Estimated architectural components:** 6–8 major view components + shared services
- **Single user, no auth, no real-time, no offline, desktop only**

### Technical Constraints & Dependencies

- Must consume existing FastAPI REST API (API contract not yet finalized — mock during development)
- Desktop-only: optimized for 1280px+ viewport
- No SSR/SSG required (no SEO)
- No authentication layer needed
- Backend owns all persistence and business logic

### Cross-Cutting Concerns Identified

- **Global filter state:** Year + Period selectors shared across all views — requires centralized state management
- **API client:** Centralized HTTP client for consistent error handling, loading states, and future auth header injection
- **Error/loading UX:** Consistent loading skeletons and error states across all data-fetching components
- **Chart abstraction:** Charting library wrapped behind an interface for future swappability

## Starter Template Evaluation

### Primary Technology Domain

**Web application (SPA)** — client-side rendered React app consuming REST API. No SSR/SSG needed. Desktop-only viewport.

### Starter Options Considered

| Option | Pros | Cons |
|--------|------|------|
| `create vite@latest --template react-ts` | Minimal, zero-opinion, full control | Requires manual setup of routing, styling, testing |
| Vite + React + shadcn/ui init | Scaffolds Tailwind + component primitives + routing | Slightly more opinionated but saves significant setup |
| Next.js | SSR/SSG capabilities, file-based routing | Overkill — no SEO, no SSR needed, adds server complexity |
| Remix / React Router framework mode | Full-stack framework | Unnecessary — backend is FastAPI, not Node |

### Selected Starter: Vite + React 19 + TypeScript + shadcn/ui

**Rationale:** Vite is the standard build tool for modern React SPAs. shadcn/ui's `init` command scaffolds a complete project with Tailwind CSS v4, React Router v7, and Radix-based accessible components — exactly matching our needs. The app is a data dashboard with tables, grids, charts, and form inputs; shadcn/ui provides production-quality primitives for all of these without the overhead of a full component library.

**Initialization Command:**

```bash
npx shadcn@latest init --template vite
```

This scaffolds: React 19, TypeScript, Vite 7.x, Tailwind CSS v4.2, React Router v7, and the shadcn/ui component system with dark mode support.

**Architectural Decisions Provided by Starter:**

| Decision | Choice |
|----------|--------|
| Language & Runtime | TypeScript (strict mode), React 19, Vite 7.x |
| Styling | Tailwind CSS v4.2 with CSS-native theme variables |
| Component Primitives | shadcn/ui (Radix UI under the hood) — copy-paste, fully ownable |
| Routing | React Router v7 (client-side SPA mode) |
| Build Tooling | Vite with Rollup for production builds |
| Development Experience | HMR, TypeScript checking, ESLint |

**Post-Scaffold Additions (manual):**

| Addition | Package | Purpose |
|----------|---------|---------|
| Server State | `@tanstack/react-query` v5 | Data fetching, caching, loading/error states |
| Charting | `recharts` | React-native SVG charts (doughnut, bar) |
| Testing | `vitest` + `@testing-library/react` | Unit and component testing |
| HTTP Client | Native `fetch` with custom wrapper | Centralized API client |

## Core Architectural Decisions

### Decision 1: State Management

**Decision:** TanStack Query v5 for server state + React Context for UI state

**Rationale:**
- The app is **read-dominant** — 90% of operations are data fetching. TanStack Query handles fetching, caching, background refetching, loading/error states, and cache invalidation out of the box.
- The only shared UI state is the **year + period selectors** (FR25–FR27). React Context with `useReducer` is sufficient — no need for Redux, Zustand, or other state libraries for two filter values.
- Budget plan mutations (FR14, FR30) use TanStack Query's `useMutation` with optimistic updates for < 100ms perceived edit response.

**Implementation:**
```
FilterContext (React Context)
├── selectedYear: number
├── selectedPeriod: 'total' | 1..12
└── setYear / setPeriod actions

TanStack Query (Server State)
├── useTransactions(year, period, filters)
├── useCategoryBreakdown(year, period, type)
├── useBudgetPlan(year)
├── useBudgetVsActual(year, period)
└── useUpdateBudgetPlan() — mutation
```

### Decision 2: Routing Architecture

**Decision:** React Router v7 with flat route structure

**Rationale:** The app has 4 primary views and no deep nesting. A shared layout wraps all routes with the year/period selectors in the header/sidebar.

**Route Structure:**
```
/                       → Redirect to /transactions
/transactions           → Transaction list (FR1–FR7)
/spending               → Category spending charts (FR8–FR12)
/budget                 → Budget planning grid (FR13–FR19)
/budget-vs-actual       → Budget vs actual comparison (FR20–FR24)
```

**Layout:** Single `AppLayout` with:
- Sidebar navigation (4 menu items)
- Header with year selector + period selector (FR25–FR27)
- Main content area

### Decision 3: API Client Architecture

**Decision:** Custom fetch wrapper + per-domain API modules

**Rationale:** NFR-I3 requires a centralized HTTP client. A thin wrapper around native `fetch` provides consistent error handling, base URL configuration, and response parsing without adding a dependency like Axios.

**Architecture:**
```
src/api/
├── client.ts           → Base fetch wrapper (error handling, base URL, headers)
├── transactions.ts     → getTransactions(params)
├── budget-plan.ts      → getBudgetPlan(year), updateBudgetPlan(year, data)
├── budget-tracking.ts  → getCategoryBreakdown(params), getBudgetVsActual(params)
└── types.ts            → API request/response TypeScript interfaces
```

**Error Handling Pattern:**
- API client throws typed errors (`ApiError` with status, message, body)
- TanStack Query catches errors and exposes via `error` state
- Components render consistent error UI via shared `<ErrorState />` component

### Decision 4: Charting Library

**Decision:** Recharts

**Rationale:**
- React-native composable API — charts are React components, not imperative canvas calls (NFR-M3 maintainability)
- Excellent doughnut/pie chart support (FR8–FR10) and bar chart support (budget vs actual)
- SVG rendering performs well for our dataset size (12 months × ~80 categories max)
- 3.6M+ weekly downloads, actively maintained, strong ecosystem
- Simple abstraction: wrap chart components in project-specific wrappers for future swappability

**Abstraction Layer:**
```
src/components/charts/
├── DoughnutChart.tsx    → Wraps Recharts PieChart for category breakdowns
├── BarChart.tsx         → Wraps Recharts BarChart for budget vs actual
└── ChartContainer.tsx   → Shared responsive container with loading state
```

### Decision 5: Component Architecture

**Decision:** Feature-based component organization with shared UI primitives

**Rationale:** Each view (transactions, spending, budget, budget-vs-actual) is an independent feature module. Shared UI primitives come from shadcn/ui. This maps directly to NFR-M1 (component-based architecture).

**Component Hierarchy:**
```
Pages (route-level)
├── TransactionsPage
│   ├── TransactionFilters (date range, type, category dropdowns)
│   ├── TransactionTable (sortable, paginated)
│   └── TransactionPagination
├── SpendingPage
│   ├── SpendingCharts (3 doughnut charts: Income, Expenses, Savings)
│   └── ChartLegend
├── BudgetPage
│   ├── BudgetGrid (categories × 12 months, inline editable)
│   ├── BudgetSectionHeader (Income / Expenses / Savings tabs or sections)
│   └── AllocationIndicator ("to be allocated" balance)
└── BudgetVsActualPage
    ├── BudgetComparisonTable (budgeted vs actual per category)
    └── CompletionBar (percentage indicator)
```

### Decision 6: Data Flow Pattern

**Decision:** Unidirectional data flow with query-based fetching

```
URL params / Context (year, period)
  → TanStack Query hooks (fetch + cache)
    → Page components (orchestrate)
      → Feature components (render)
        → UI primitives (shadcn/ui)
```

- **No prop drilling** for global filters — Context provides year/period
- **No client-side computation** of budget totals — backend provides aggregated data via API
- **Optimistic updates** for budget grid edits only — mutation updates cache immediately, rolls back on error

## Implementation Patterns & Consistency Rules

### Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Files & directories | kebab-case | `budget-plan.ts`, `transaction-filters.tsx` |
| React components | PascalCase | `TransactionTable`, `BudgetGrid` |
| Hooks | camelCase with `use` prefix | `useTransactions`, `useBudgetPlan` |
| API functions | camelCase verb-first | `getTransactions`, `updateBudgetPlan` |
| Types/Interfaces | PascalCase | `Transaction`, `BudgetPlanEntry` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `API_BASE_URL` |
| CSS/Tailwind | Utility-first, no custom CSS unless necessary | — |

### File Structure Patterns

**Component file pattern:**
```tsx
// src/features/transactions/components/transaction-table.tsx

import { type Transaction } from '@/api/types'
// ... imports

interface TransactionTableProps {
  transactions: Transaction[]
  onSort: (field: SortField) => void
  sortBy: SortField
  sortOrder: SortOrder
}

export function TransactionTable({ transactions, onSort, sortBy, sortOrder }: TransactionTableProps) {
  // component logic
  return (/* JSX */)
}
```

**Hook file pattern:**
```tsx
// src/features/transactions/hooks/use-transactions.ts

import { useQuery } from '@tanstack/react-query'
import { getTransactions } from '@/api/transactions'
import { useFilters } from '@/contexts/filter-context'

export function useTransactions(filters: TransactionFilters) {
  const { selectedYear, selectedPeriod } = useFilters()

  return useQuery({
    queryKey: ['transactions', selectedYear, selectedPeriod, filters],
    queryFn: () => getTransactions({ year: selectedYear, period: selectedPeriod, ...filters }),
  })
}
```

### Error Handling Pattern

1. **API layer:** Throws `ApiError` with structured error info
2. **Query layer:** TanStack Query catches and exposes `error` state
3. **Component layer:** Uses shared `<ErrorState />` or `<ErrorBoundary />`
4. **User feedback:** Toast notifications for mutation failures (budget save errors)

### Loading State Pattern

1. **Initial load:** Skeleton components matching the shape of the real content
2. **Refetching:** Subtle loading indicator (spinner in header), data stays visible
3. **Mutation:** Optimistic update — no loading state visible to user

## Project Structure & Boundaries

```
life-organizer-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                          # API client layer (NFR-I3, NFR-M2)
│   │   ├── client.ts                 # Base fetch wrapper
│   │   ├── transactions.ts           # Transaction endpoints
│   │   ├── budget-plan.ts            # Budget plan CRUD
│   │   ├── budget-tracking.ts        # Category breakdown, budget vs actual
│   │   └── types.ts                  # Shared API types
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui primitives (auto-generated)
│   │   ├── charts/                   # Chart wrappers (NFR-M3)
│   │   │   ├── doughnut-chart.tsx
│   │   │   ├── bar-chart.tsx
│   │   │   └── chart-container.tsx
│   │   ├── layout/
│   │   │   ├── app-layout.tsx        # Main layout with sidebar + header
│   │   │   ├── sidebar.tsx           # Navigation sidebar
│   │   │   └── header.tsx            # Year/period selectors
│   │   ├── error-state.tsx           # Shared error display
│   │   ├── loading-skeleton.tsx      # Shared skeleton loader
│   │   └── empty-state.tsx           # No data display
│   │
│   ├── contexts/
│   │   └── filter-context.tsx        # Year + Period global state (FR25–FR27)
│   │
│   ├── features/                     # Feature modules (NFR-M1)
│   │   ├── transactions/             # FR1–FR7
│   │   │   ├── components/
│   │   │   │   ├── transaction-table.tsx
│   │   │   │   ├── transaction-filters.tsx
│   │   │   │   └── transaction-pagination.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-transactions.ts
│   │   │   └── transactions-page.tsx
│   │   │
│   │   ├── spending/                 # FR8–FR12
│   │   │   ├── components/
│   │   │   │   ├── spending-charts.tsx
│   │   │   │   └── chart-legend.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-category-breakdown.ts
│   │   │   └── spending-page.tsx
│   │   │
│   │   ├── budget/                   # FR13–FR19
│   │   │   ├── components/
│   │   │   │   ├── budget-grid.tsx
│   │   │   │   ├── budget-cell.tsx
│   │   │   │   ├── budget-section.tsx
│   │   │   │   └── allocation-indicator.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── use-budget-plan.ts
│   │   │   │   └── use-update-budget.ts
│   │   │   └── budget-page.tsx
│   │   │
│   │   └── budget-vs-actual/         # FR20–FR24
│   │       ├── components/
│   │       │   ├── comparison-table.tsx
│   │       │   └── completion-bar.tsx
│   │       ├── hooks/
│   │       │   └── use-budget-vs-actual.ts
│   │       └── budget-vs-actual-page.tsx
│   │
│   ├── hooks/                        # Shared hooks
│   │   └── use-debounce.ts
│   │
│   ├── lib/                          # Utility functions
│   │   ├── utils.ts                  # shadcn/ui cn() helper + general utils
│   │   └── format.ts                 # Currency/date formatting
│   │
│   ├── routes.tsx                    # React Router route definitions
│   ├── app.tsx                       # App root (providers, router)
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Tailwind imports + CSS variables
│
├── tests/                            # Test files mirror src/ structure
│   ├── api/
│   ├── features/
│   └── setup.ts                      # Vitest setup (testing-library, mocks)
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts                # Tailwind v4 config (if needed beyond CSS)
├── components.json                   # shadcn/ui configuration
├── package.json
└── .env.example                      # API_BASE_URL
```

### Module Boundaries

| Module | Responsibility | Dependencies |
|--------|---------------|--------------|
| `api/` | HTTP communication, request/response types | None (standalone) |
| `contexts/` | Global UI state (year, period) | React only |
| `components/` | Shared presentational components | shadcn/ui, recharts |
| `features/*/` | Feature-specific logic, pages, hooks | `api/`, `contexts/`, `components/` |
| `lib/` | Pure utility functions | None |

**Dependency Rules:**
- `api/` imports nothing from other `src/` modules
- `features/` may import from `api/`, `contexts/`, `components/`, `lib/`
- `components/` may NOT import from `features/` (no circular deps)
- `features/` may NOT import from other `features/` (independence per NFR-M1)

## Architecture Validation

### Requirements Coverage Matrix

| Requirement Group | Architecture Coverage | Key Components |
|-------------------|----------------------|----------------|
| FR1–FR7 (Transactions) | ✅ Full | `features/transactions/`, `api/transactions.ts` |
| FR8–FR12 (Spending Viz) | ✅ Full | `features/spending/`, `components/charts/` |
| FR13–FR19 (Budget Plan) | ✅ Full | `features/budget/`, `api/budget-plan.ts` |
| FR20–FR24 (Budget vs Actual) | ✅ Full | `features/budget-vs-actual/`, `api/budget-tracking.ts` |
| FR25–FR27 (Navigation) | ✅ Full | `contexts/filter-context.tsx`, `components/layout/header.tsx` |
| FR28–FR31 (Data Integration) | ✅ Full | `api/client.ts`, TanStack Query hooks |
| NFR Performance | ✅ Addressed | Vite build, TanStack Query caching, pagination |
| NFR Integration | ✅ Addressed | Centralized API client, typed errors, defensive parsing |
| NFR Maintainability | ✅ Addressed | Feature modules, abstracted API/chart layers |

### Cross-Cutting Concerns Resolution

| Concern | Solution |
|---------|----------|
| Global filter state | `FilterContext` provides year/period to all features |
| Centralized HTTP client | `api/client.ts` with consistent error handling |
| Loading/error UX | Shared `ErrorState`, `LoadingSkeleton` components |
| Chart abstraction | `components/charts/` wrappers around Recharts |

### Risk Assessment

| Risk | Mitigation |
|------|-----------|
| API contract not finalized | Define TypeScript interfaces early in `api/types.ts`; mock API responses during dev |
| Budget grid performance (80 categories × 12 months) | Table virtualization if needed (TanStack Table); unlikely at this scale |
| Recharts bundle size | Tree-shakeable; only import used chart types |
| Tailwind v4 breaking changes from v3 | Using CSS-native config — fewer migration issues |

### Gaps & Decisions Deferred

- **API mocking strategy:** MSW (Mock Service Worker) recommended for development before backend API is ready — decide during implementation
- **E2E testing:** Playwright recommended for post-MVP — not in scope for architecture
- **Dark mode:** shadcn/ui scaffolds dark mode support by default — enable when desired, no architectural impact

## Architecture Completion & Handoff

### Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | React | 19.x |
| Language | TypeScript | 5.x (strict) |
| Build Tool | Vite | 7.x |
| Styling | Tailwind CSS | 4.2.x |
| Components | shadcn/ui (Radix UI) | Latest |
| Routing | React Router | 7.x |
| Server State | TanStack Query | 5.x |
| Charting | Recharts | Latest |
| Testing | Vitest + React Testing Library | 4.x / Latest |

### Key Architectural Principles

1. **Backend owns all business logic** — frontend is purely a display/input layer
2. **Feature independence** — each view is a self-contained module with its own hooks, components, and page
3. **Server state over client state** — TanStack Query manages data lifecycle; React Context only for UI filters
4. **Abstraction at boundaries** — API client and chart components are wrapped for swappability
5. **Type safety end-to-end** — TypeScript interfaces define the API contract; defensive parsing at the boundary

### Recommended Next Steps

1. **Create Epics & User Stories** — break the 31 FRs into implementable stories using the BMAD workflow
2. **Define API contract** — coordinate with backend to finalize endpoint shapes before implementation
3. **Scaffold project** — run `npx shadcn@latest init --template vite` and install additional dependencies
4. **Set up API mocking** — establish MSW or static JSON mocks for development independence
