---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/prd.md
  - _bmad-output/architecture.md
  - _bmad-output/ux-design-specification.md
---

# life-organizer-frontend - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for life-organizer-frontend, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** User can view a list of all budget transactions (income, expenses, savings)
- **FR2:** User can filter transactions by date range
- **FR3:** User can filter transactions by transaction type (Income, Expenses, Savings)
- **FR4:** User can filter transactions by category
- **FR5:** User can sort transactions by date or amount
- **FR6:** User can view transaction details (date, type, category, amount, details)
- **FR7:** User can navigate paginated transaction results for large datasets
- **FR8:** User can view a doughnut chart showing spending distribution by category for Income
- **FR9:** User can view a doughnut chart showing spending distribution by category for Expenses
- **FR10:** User can view a doughnut chart showing spending distribution by category for Savings
- **FR11:** User can select a specific month or total year to filter chart data
- **FR12:** User can select a year to filter chart data
- **FR13:** User can view a budget planning grid of categories (rows) by months (columns) for a selected year
- **FR14:** User can edit monthly budget amounts inline within the planning grid
- **FR15:** User can view annual totals per category (row sums)
- **FR16:** User can view monthly totals per budget section — Income, Expenses, Savings (column sums)
- **FR17:** User can view a "to be allocated" balance per month (Income - Expenses - Savings)
- **FR18:** User can visually identify months that are fully allocated (balance = 0)
- **FR19:** User can view separate planning sections for Income, Expenses, and Savings
- **FR20:** User can view a per-category comparison of budgeted vs actual (tracked) amounts
- **FR21:** User can view remaining budget per category (budget minus tracked, floored at 0)
- **FR22:** User can view excess spend per category (tracked minus budget when overspent)
- **FR23:** User can view percentage completion per category (tracked / budget)
- **FR24:** User can filter the budget vs actual view by month or total year
- **FR25:** User can select a year from a dropdown to control all views
- **FR26:** User can select a period (total year or specific month) to control all views
- **FR27:** All data views respond to the currently selected year and period
- **FR28:** The application can fetch transaction data from the backend API
- **FR29:** The application can fetch budget plan data from the backend API
- **FR30:** The application can send updated budget plan data to the backend API
- **FR31:** The application reflects the latest backend data on page load or manual refresh

### NonFunctional Requirements

- **NFR-P1:** Page load (cold) < 2 seconds
- **NFR-P2:** SPA navigation between views < 500ms
- **NFR-P3:** Chart rendering (12 months of category data) < 500ms
- **NFR-P4:** Transaction list rendering (paginated, 50–100 items) < 300ms
- **NFR-P5:** Budget grid inline edit response < 100ms (perceived)
- **NFR-P6:** API round-trip for data fetch < 1 second
- **NFR-I1:** Frontend must gracefully handle backend API unavailability (show clear error state, not blank screen)
- **NFR-I2:** Frontend must handle API response format changes without crashing (defensive parsing)
- **NFR-I3:** All API calls use a centralized HTTP client for consistent error handling and future auth header injection
- **NFR-M1:** Component-based architecture — each view is an independent component
- **NFR-M2:** API client layer abstracted from UI components — swapping backend endpoints doesn't require UI changes
- **NFR-M3:** Charting library abstracted behind a wrapper — chart library can be swapped without rewriting views

### Additional Requirements

**From Architecture:**

- Starter template: `npx shadcn@latest init --template vite` scaffolding React 19, TypeScript strict, Vite 7.x, Tailwind CSS v4.2, React Router v7, shadcn/ui with dark mode
- TanStack Query v5 for server state management (fetching, caching, background refetch, cache invalidation)
- React Context with useReducer for global UI state (FilterContext: selectedYear, selectedPeriod)
- Custom fetch wrapper (`api/client.ts`) with per-domain API modules (`transactions.ts`, `budget-plan.ts`, `budget-tracking.ts`, `types.ts`)
- Recharts for charting with abstraction wrappers (`components/charts/doughnut-chart.tsx`, `bar-chart.tsx`, `chart-container.tsx`)
- Feature-based file organization: `features/transactions/`, `features/spending/`, `features/budget/`, `features/budget-vs-actual/`
- Flat route structure: `/` → redirect to `/transactions`, `/spending`, `/budget`, `/budget-vs-actual`
- Single `AppLayout` with sidebar navigation + header with year/period selectors
- Optimistic updates via TanStack Query `useMutation` for budget grid edits
- Vitest + React Testing Library for unit and component testing
- Dependency rules: `api/` imports nothing from other modules; `features/` may not import from other `features/`; `components/` may not import from `features/`

**From UX Design:**

- "Quiet Ledger" design system: warm charcoal surfaces, sage (income), terracotta (expenses), copper (savings), lavender (accent)
- Dark mode primary color tokens: `--bg-root: #111010`, `--bg-surface: #1a1816`, `--bg-raised: #222019`, etc.
- Text tokens: `--text-primary: #e8e2d6`, `--text-secondary: #a69f8f`, `--text-tertiary: #7a7368`
- Journal layout direction: 240px sidebar with labeled nav + inline quick-stats (monthly income/expenses/savings/remaining)
- Sidebar collapses to 52px icon-only on Budget Planning view for maximum grid width
- Typography: Instrument Serif (display 32–48px), DM Sans (body/headings), DM Mono (all monetary amounts)
- Budget grid cell states: Display, Edit, Empty, Hover — with Tab/Shift+Tab/Enter/Escape keyboard navigation
- Allocation indicator row: sage green (positive), dim gray (zero), terracotta (negative)
- Progress bar for budget vs actual: sage (<80%), amber (80–100%), terracotta (>100%)
- Desktop-only: 1280px minimum, content caps at 1200px max-width (except budget grid fills 100%)
- Skeleton loaders matching content shape for initial loads
- Toast notifications for mutation success (auto-dismiss 3s) and failure (persistent with retry)
- Error banner: full-width, warm yellow background, retry button
- Number formatting: € prefix, two decimal places, comma-separated thousands, right-aligned, monospace
- Amounts color-coded by type: sage for income, terracotta for negative/expenses, copper for savings
- Filter persistence across view navigation during session
- Transition timing: 150ms hover, 200ms panel, 300ms chart animations

### FR Coverage Map

- FR1: Epic 3 — View transaction list
- FR2: Epic 3 — Filter transactions by date range
- FR3: Epic 3 — Filter transactions by type
- FR4: Epic 3 — Filter transactions by category
- FR5: Epic 3 — Sort transactions by date or amount
- FR6: Epic 3 — View transaction details
- FR7: Epic 3 — Paginated transaction results
- FR8: Epic 4 — Doughnut chart for Income
- FR9: Epic 4 — Doughnut chart for Expenses
- FR10: Epic 4 — Doughnut chart for Savings
- FR11: Epic 4 — Period selector for chart data
- FR12: Epic 4 — Year selector for chart data
- FR13: Epic 5 — Budget planning grid view
- FR14: Epic 5 — Inline editing of budget amounts
- FR15: Epic 5 — Annual totals per category
- FR16: Epic 5 — Monthly totals per section
- FR17: Epic 5 — "To be allocated" balance per month
- FR18: Epic 5 — Visual indicator for fully allocated months
- FR19: Epic 5 — Separate sections for Income/Expenses/Savings
- FR20: Epic 6 — Per-category budget vs actual comparison
- FR21: Epic 6 — Remaining budget per category
- FR22: Epic 6 — Excess spend per category
- FR23: Epic 6 — Percentage completion per category
- FR24: Epic 6 — Period filter for budget vs actual
- FR25: Epic 2 — Year selector dropdown
- FR26: Epic 2 — Period selector (total year or month)
- FR27: Epic 2 — All views respond to selected year/period
- FR28: Epic 3 — Fetch transaction data from API
- FR29: Epic 5 — Fetch budget plan data from API
- FR30: Epic 5 — Send updated budget plan to API
- FR31: Epic 3 — Reflect latest backend data on load/refresh

## Epic List

### Epic 1: Design System & Visual Foundation
User can view a design system showcase page that demonstrates all Quiet Ledger tokens and components are correctly implemented — colors, typography, spacing, surfaces, badges, stat cards, progress bars, chart palette, and table styling — verifying visual fidelity before building features.
**FRs covered:** None directly (foundational)
**Notes:** Project scaffold (`npx shadcn@latest init --template vite`), Tailwind theme configuration with all CSS custom properties from UX spec, Google Fonts (Instrument Serif, DM Sans, DM Mono), shadcn/ui component customization, and a `/design-system` showcase page inspired by `ux-color-themes.html`. Covers surfaces, semantic colors (sage/terracotta/copper/lavender), chart palette (12 colors), typography scale, spacing scale, type badges, stat cards, progress bars, budget grid cell styles, and table patterns.

### Epic 2: Application Shell & Global Navigation
User can open the app, see the Journal layout with 240px sidebar navigation and quick-stats, select year and period, and navigate between views.
**FRs covered:** FR25, FR26, FR27
**Notes:** AppLayout with sidebar (240px full / 52px collapsed), React Router v7 routing (`/transactions`, `/spending`, `/budget`, `/budget-vs-actual`), FilterContext (year + period), API client foundation (`api/client.ts`). Sidebar shows monthly quick-stats (income/expenses/savings/remaining). Active nav state with copper accent.

### Epic 3: Transaction Ledger
User can view all financial transactions, filter by date range/type/category, sort by date or amount, and paginate through results — answering "what happened with my money?"
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR28, FR31
**Notes:** First data-connected view. Implements `api/transactions.ts`, summary stat cards (income/expenses/savings), type badges, monospace number formatting, transaction table with hover highlights, pagination (50 items per page).

### Epic 4: Category Spending Visualization
User can see where money goes via doughnut charts for Income, Expenses, and Savings, filtered by month or total year — answering "where is my money going?"
**FRs covered:** FR8, FR9, FR10, FR11, FR12
**Notes:** Implements Recharts abstraction layer (`components/charts/`), 3 doughnut charts with center totals, chart legends with category name/amount/percentage, `api/budget-tracking.ts` for category breakdown endpoint.

### Epic 5: Budget Planning
User can plan monthly budgets in an editable grid with three sections (Income/Expenses/Savings), live row/column totals, and a "to be allocated" balance indicator — enabling budget creation and adjustment.
**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR29, FR30
**Notes:** Most complex UI component. Sidebar collapses to 52px. Inline editing with Tab/Enter/Escape keyboard nav. Optimistic updates via TanStack Query mutation. Section headers color-coded (sage/terracotta/copper). Sticky first column. Allocation row: sage (positive), dim gray (zero), terracotta (negative).

### Epic 6: Budget vs Actual Tracking
User can compare planned budget against actual spending per category, see remaining/excess amounts and completion percentages — answering "am I on track?"
**FRs covered:** FR20, FR21, FR22, FR23, FR24
**Notes:** Progress bars with sage (<80%), amber (80–100%), terracotta (>100%) thresholds. Sorted by overspend first. Separate sections for Expenses/Income/Savings. Remaining column: positive in sage, negative in terracotta. `api/budget-tracking.ts` for budget vs actual endpoint.

---

## Epic 1: Design System & Visual Foundation

User can view a design system showcase page that demonstrates all Quiet Ledger tokens and components are correctly implemented — colors, typography, spacing, surfaces, badges, stat cards, progress bars, chart palette, and table styling — verifying visual fidelity before building features.

### Story 1.1: Project Scaffold & Theme Configuration

As a developer,
I want the project scaffolded with Vite + React 19 + TypeScript and all Quiet Ledger design tokens configured,
So that all future components render with the correct visual identity from day one.

**Acceptance Criteria:**

**Given** no project exists yet
**When** the developer runs the scaffold command and applies theme configuration
**Then** the project initializes with React 19, TypeScript (strict mode), Vite 7.x, Tailwind CSS v4.2, React Router v7, and shadcn/ui
**And** all Quiet Ledger CSS custom properties are defined in `index.css`:
  - Surface palette: `--bg-root` (#111010), `--bg-surface` (#1a1816), `--bg-raised` (#222019), `--bg-elevated` (#2a2822), `--bg-hover` (#33302a), `--bg-active` (#3d3a33)
  - Border tokens: `--border-subtle` (#2e2b25), `--border-default` (#3d3a33), `--border-strong` (#524e46)
  - Text tokens: `--text-primary` (#e8e2d6), `--text-secondary` (#a69f8f), `--text-tertiary` (#7a7368), `--text-inverse` (#1a1816)
  - Income (sage): `--income-100` through `--income-700`, `--income-bg`, `--income-bg-strong`, `--income-border`
  - Expense (terracotta): `--expense-100` through `--expense-700`, `--expense-bg`, `--expense-bg-strong`, `--expense-border`
  - Savings (copper): `--savings-100` through `--savings-700`, `--savings-bg`, `--savings-bg-strong`, `--savings-border`
  - Warning (amber): `--warning-50` through `--warning-500`, `--warning-bg`, `--warning-border`
  - Accent (lavender): `--accent-300`, `--accent-400`, `--accent-500`, `--accent-bg`, `--accent-border`
  - Chart palette: `--chart-1` through `--chart-12`
  - Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
  - Radii: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px)
  - Spacing: `--space-1` (4px) through `--space-16` (64px)
**And** Google Fonts are loaded: Instrument Serif (400, italic), DM Sans (300–700, italic 400), DM Mono (300–500)
**And** the following additional dependencies are installed: `@tanstack/react-query` v5, `recharts`, `vitest`, `@testing-library/react`
**And** the project builds without errors (`npm run build` succeeds)
**And** dark mode is the default theme

**Architecture Notes:**
- Scaffold command: `npx shadcn@latest init --template vite`
- All CSS custom properties go in `src/index.css` using `:root` selector
- Font imports via `<link>` tags in `index.html` or `@import` in CSS
- shadcn/ui `components.json` configured for the project path aliases
- `.env.example` created with `VITE_API_BASE_URL` placeholder

**UX Notes:**
- Exact hex values from `_bmad-output/ux-color-themes.html` — reference this file for the complete token list
- Dark mode is primary; light mode tokens exist in UX spec but are not required for MVP
- Font loading: use `display=swap` for performance

### Story 1.2: Shared UI Primitives & Component Styling

As a developer,
I want reusable UI primitives styled with the Quiet Ledger design system,
So that all feature views have consistent, pre-built components to compose with.

**Acceptance Criteria:**

**Given** the project scaffold and theme tokens are in place (Story 1.1)
**When** the shared UI primitives are implemented
**Then** the following components exist and render correctly:

**Given** a `TypeBadge` component is rendered with variant "income"
**When** it displays on screen
**Then** it shows text with sage green color (#6daa7c), sage background (rgba(109,170,124,0.15)), and sage border (rgba(109,170,124,0.25))
**And** variant "expense" uses terracotta (#d47b6e) with matching bg/border
**And** variant "savings" uses copper (#e4a83a) with matching bg/border
**And** badge text is 11px, font-weight 500, letter-spacing 0.3px

**Given** a `StatCard` component is rendered with type "income"
**When** it displays on screen
**Then** it shows a card with `--bg-surface` background, `--border-subtle` border, `--radius-md` border-radius
**And** a 3px left border in the type's accent color (sage for income, terracotta for expense, copper for savings, lavender for balance)
**And** label is 11px uppercase with `--text-tertiary` color
**And** value is DM Mono 24px with the type's primary color
**And** optional change text is 12px below the value

**Given** a `ProgressBar` component is rendered with a percentage value
**When** the percentage is below 80%
**Then** the bar fill is sage green (`--savings-400`)
**And** when between 80–100%, the fill is amber (`--income-400`)
**And** when above 100%, the fill is terracotta (`--expense-400`) and visually caps at 100% width
**And** the bar is 6px tall with rounded corners on a `--bg-hover` track

**Given** an `ErrorState` component is rendered
**When** an API error occurs
**Then** it displays a full-width banner with warm yellow background and retry button
**And** the error message is clearly visible

**Given** a `LoadingSkeleton` component is rendered
**When** data is being fetched
**Then** it shows animated placeholder shapes matching the content layout (table rows, card shapes, chart circles)

**Given** an `EmptyState` component is rendered
**When** no data exists for the selected period
**Then** it shows a centered message like "No transactions for this period." with subtle styling

**Architecture Notes:**
- Components live in `src/components/` (shared) — NOT in feature directories
- TypeBadge, StatCard, ProgressBar are custom components using Quiet Ledger tokens
- ErrorState, LoadingSkeleton, EmptyState are shared feedback components
- All components use Tailwind utility classes referencing CSS custom properties
- shadcn/ui base components (Button, Select, Table, etc.) should be customized to match Quiet Ledger surfaces and borders
- Components must NOT import from `src/features/` (dependency rule)

**UX Notes:**
- Stat cards use left-border accent pattern — see `ux-color-themes.html` section "Summary Cards"
- Type badges match the pattern in `ux-color-themes.html` section "Type Badges"
- Progress bar matches `ux-color-themes.html` section "Budget vs Actual"
- Loading skeletons should match the shape of real content (not generic spinners)
- Error banner uses warm yellow, not aggressive red — the app should never feel alarming
- Transition timing: 150ms ease for hover states

### Story 1.3: Design System Showcase Page

As a developer,
I want a `/design-system` route that displays all tokens and components in a visual gallery,
So that I can verify the design system matches the UX specification before building features.

**Acceptance Criteria:**

**Given** the design tokens and shared components are implemented (Stories 1.1, 1.2)
**When** the user navigates to `/design-system`
**Then** a standalone page renders (no app shell/sidebar) showing the complete design system

**Given** the showcase page is loaded
**When** viewing the "Surface Palette" section
**Then** 6 surface color cards are displayed showing `--bg-root` through `--bg-active` with their hex values
**And** each card uses its own color as background, making differences visible

**Given** the showcase page is loaded
**When** viewing the "Semantic Colors" section
**Then** 4 color groups are displayed: Income (sage), Expenses (terracotta), Savings (copper), Accent (lavender)
**And** each group shows its full shade range (100–700) with color swatches and hex values
**And** background and border token variants are demonstrated

**Given** the showcase page is loaded
**When** viewing the "Chart Palette" section
**Then** 12 chart color swatches are displayed in order (`--chart-1` through `--chart-12`) with numbered labels

**Given** the showcase page is loaded
**When** viewing the "Typography" section
**Then** the following type samples are displayed with correct fonts, sizes, and weights:
  - Display XL: Instrument Serif, 48px, 400
  - Display: Instrument Serif, 36px, 400
  - Heading: DM Sans, 24px, 600
  - Subheading: DM Sans, 16px, 600
  - Body: DM Sans, 14px, 400
  - Caption: DM Sans, 12px, 400
  - Mono: DM Mono, 13px, 400 (shown with a currency value like €4,250.00)
  - Label: DM Sans, 11px, 600, uppercase

**Given** the showcase page is loaded
**When** viewing the "Spacing" section
**Then** spacing scale bars are displayed from 4px to 64px with labels

**Given** the showcase page is loaded
**When** viewing the "Components" section
**Then** the following components are displayed with live examples:
  - 3 TypeBadge variants (Income, Expense, Savings)
  - 4 StatCard variants (Income, Expense, Savings, Balance) with sample data
  - 3 ProgressBar variants (under 80%, 80–100%, over 100%)
  - A sample transaction table with 4–6 rows showing all column types, hover highlights, and color-coded amounts
  - Budget grid cell styles showing: display state, hover state, section headers (Income/Expenses/Savings), total row, and allocation row (positive/zero/negative states)
  - ErrorState, LoadingSkeleton, and EmptyState components

**Architecture Notes:**
- Route: `/design-system` — a standalone route, not wrapped in AppLayout
- This page is for development verification only; it can be excluded from production builds or left in
- Page component lives at `src/pages/design-system-page.tsx` or similar
- Uses all the components from Story 1.2 with hardcoded sample data
- Inspired by `_bmad-output/ux-color-themes.html` — use it as the visual reference

**UX Notes:**
- Match the section structure of `ux-color-themes.html`: header with "Quiet Ledger" title, then sections for surfaces, semantic colors, chart palette, typography, spacing, and components
- Use Instrument Serif for section titles on the showcase page itself
- The page should feel like opening a design reference book — clean, organized, comprehensive
- Include the budget grid table sample with realistic financial data (€ amounts, category names like "Rent", "Groceries")

---

## Epic 2: Application Shell & Global Navigation

User can open the app, see the Journal layout with 240px sidebar navigation and quick-stats, select year and period, and navigate between views.

### Story 2.1: API Client Foundation

As a developer,
I want a centralized API client with typed error handling,
So that all feature views have a consistent, reliable way to communicate with the backend.

**Acceptance Criteria:**

**Given** no API client exists
**When** the API client module is implemented
**Then** `src/api/client.ts` exports a base fetch wrapper function
**And** the wrapper reads `VITE_API_BASE_URL` from environment variables
**And** all requests include `Content-Type: application/json` header
**And** responses are parsed as JSON with defensive error handling

**Given** the API returns a non-2xx status code
**When** the client processes the response
**Then** it throws a typed `ApiError` with `status`, `message`, and `body` properties
**And** the error can be caught and inspected by calling code

**Given** the API is unavailable (network error)
**When** the client attempts a request
**Then** it throws an `ApiError` with a clear message indicating connectivity failure (NFR-I1)

**Given** the API returns malformed JSON or unexpected structure
**When** the client parses the response
**Then** it handles the error gracefully without crashing (NFR-I2)
**And** throws a descriptive `ApiError`

**Given** the API client is used by a feature module
**When** importing from `@/api/client`
**Then** helper functions `get()`, `post()`, `put()`, `patch()`, `del()` are available
**And** each accepts a path string and optional body/params
**And** the base URL is automatically prepended

**Given** API type definitions are needed
**When** looking at `src/api/types.ts`
**Then** TypeScript interfaces exist for all API request/response shapes:
  - `Transaction`, `TransactionFilters`, `PaginatedResponse<T>`
  - `BudgetPlan`, `BudgetPlanEntry`, `UpdateBudgetPlanRequest`
  - `CategoryBreakdown`, `BudgetVsActualEntry`
  - `ApiError` class definition

**Architecture Notes:**
- `src/api/client.ts` — thin wrapper around native `fetch` (no Axios dependency)
- `src/api/types.ts` — all shared TypeScript interfaces for API contracts
- Per-domain modules (`transactions.ts`, `budget-plan.ts`, `budget-tracking.ts`) are created in later epics when needed
- `api/` imports nothing from other `src/` modules (dependency rule)
- Base URL configured via `VITE_API_BASE_URL` environment variable
- Future auth header injection point prepared (commented placeholder in client)

**UX Notes:**
- No direct UX impact — this is infrastructure
- Error messages should be user-friendly strings that can be displayed in ErrorState components

### Story 2.2: App Layout with Sidebar Navigation

As a user,
I want a persistent sidebar with navigation links and monthly quick-stats,
So that I can always see my financial summary and switch between views instantly.

**Acceptance Criteria:**

**Given** the user opens the app
**When** the page loads
**Then** a 240px sidebar is displayed on the left with the "Life Organizer" logo (Instrument Serif, with sage green dot)
**And** the main content area fills the remaining width
**And** the sidebar has `--bg-surface` background with `--border-subtle` right border

**Given** the sidebar is visible
**When** looking at the navigation items
**Then** 4 navigation links are displayed: Transactions, Spending, Budget, Budget vs Actual
**And** each link has an icon and label text (DM Sans 13px, font-weight 500)
**And** inactive items use `--text-secondary` color
**And** hovering an item shows `--bg-hover` background and `--text-primary` color (150ms transition)

**Given** the user is on a specific view
**When** looking at the sidebar navigation
**Then** the active navigation item has `--income-bg-strong` background, `--income-300` text color, and `--income-border` 1px border

**Given** the sidebar is visible
**When** looking below the navigation items
**Then** a "MONTH AT A GLANCE" quick-stats section shows:
  - Income total (sage)
  - Spent total (terracotta)
  - Saved total (copper)
  - Remaining amount (primary text)
**And** all amounts use DM Mono font
**And** labels are 11px uppercase DM Sans with `--text-tertiary` color
**And** a subtle divider separates the navigation from stats

**Given** the user clicks a navigation item
**When** the navigation completes
**Then** the URL changes to the corresponding route (`/transactions`, `/spending`, `/budget`, `/budget-vs-actual`)
**And** the main content area renders the correct page component (placeholder for now)
**And** navigation feels instant (< 500ms per NFR-P2)

**Given** the user navigates to the root URL `/`
**When** the page loads
**Then** they are redirected to `/transactions`

**Given** the user is on the Budget Planning view (`/budget`)
**When** the page loads
**Then** the sidebar collapses to 52px icon-only mode (no labels, no quick-stats)
**And** hovering over a collapsed nav icon shows a tooltip with the view name
**And** navigating away from Budget Planning restores the full 240px sidebar

**Given** the page header area
**When** viewing any route
**Then** the page title is displayed in Instrument Serif 32px at the top of the content area
**And** year and period selectors are displayed to the right of the title (placeholder dropdowns for now — Story 2.3 will wire them)

**Architecture Notes:**
- `src/components/layout/app-layout.tsx` — wraps all routes, provides sidebar + header + main content area
- `src/components/layout/sidebar.tsx` — navigation component with collapsed state
- `src/components/layout/header.tsx` — page title + filter area
- React Router v7 with flat route structure in `src/routes.tsx`
- Sidebar collapse state derived from current route (if path is `/budget`, collapse)
- Quick-stats data will be wired to API in later epics — use hardcoded sample data for now
- Each route renders a placeholder page component (e.g., "Transactions coming soon")

**UX Notes:**
- Journal layout direction from UX spec — 240px sidebar with stats
- Logo: "Life Organizer" in Instrument Serif 18px with 8px sage green dot
- Nav items: DM Sans 13px, 16px icons, `--radius-sm` border radius on hover/active
- Sidebar collapse on Budget: 52px width, icons centered, tooltips on hover
- Content area: padding `--space-5` vertical, `--space-6` horizontal
- Viewport minimum 1280px; content caps at 1200px max-width (except `/budget` fills full width)
- Transitions: 200ms ease for sidebar collapse/expand

### Story 2.3: Global Year & Period Filters

As a user,
I want to select a year and period (month or total year) that controls all views,
So that I only need to set my time context once and every view reflects it.

**Acceptance Criteria:**

**Given** the user opens the app
**When** the header renders
**Then** a year selector dropdown shows the current year pre-selected
**And** a period selector dropdown shows the current month pre-selected

**Given** the year selector dropdown is opened
**When** the user views the options
**Then** available years are listed (from API `availableYears` endpoint or hardcoded range)
**And** the current year is highlighted as selected

**Given** the period selector dropdown is opened
**When** the user views the options
**Then** "Total Year" is the first option, followed by January through December
**And** the current month is highlighted as selected

**Given** the user selects a different year
**When** the selection changes
**Then** the FilterContext updates `selectedYear` to the new value
**And** all data views on the current page re-render with the new year's data
**And** the sidebar quick-stats update to reflect the new year's totals
**And** the period selector retains its current value

**Given** the user selects a different period (month or "Total Year")
**When** the selection changes
**Then** the FilterContext updates `selectedPeriod` to the new value (`'total'` or `1..12`)
**And** all data views on the current page re-render with the new period's data
**And** the sidebar quick-stats update to reflect the new period's totals

**Given** the user changes filters and then navigates to another view
**When** the new view loads
**Then** the selected year and period persist (session-level state)
**And** the new view displays data for the persisted year and period

**Given** the FilterContext is consumed by a component
**When** accessing the context
**Then** `selectedYear` (number), `selectedPeriod` (`'total' | 1..12`), `setYear`, and `setPeriod` are available
**And** the context uses `useReducer` for state management

**Architecture Notes:**
- `src/contexts/filter-context.tsx` — React Context with `useReducer`
- Provider wraps all routes in `app.tsx`
- Selector components use shadcn/ui `Select` customized with Quiet Ledger tokens
- Selectors rendered in `src/components/layout/header.tsx`
- Default values: current year, current month
- TanStack Query hooks (in later epics) will use `selectedYear` and `selectedPeriod` as query key parameters — changing them triggers automatic refetch

**UX Notes:**
- Selectors styled as `mockup-select` from UX spec: DM Sans 12px, font-weight 500, `--bg-elevated` background, `--border-default` border, `--radius-sm` border-radius
- Filter pills sit to the right of the Instrument Serif page title in the header
- Active filter should be clearly visible — not easily missed
- Period selector shows month names (January, February, ...) not numbers

---

## Epic 3: Transaction Ledger

User can view all financial transactions, filter by date range/type/category, sort by date or amount, and paginate through results — answering "what happened with my money?"

### Story 3.1: Transaction List Display & API Integration

As a user,
I want to see a list of all my transactions for the selected period with summary stats,
So that I can quickly review what happened with my money.

**Acceptance Criteria:**

**Given** the user navigates to `/transactions`
**When** the page loads
**Then** the Transactions page renders with the Instrument Serif page title "Transactions"
**And** 3 summary stat cards appear at the top: Income (sage), Expenses (terracotta), Savings (copper)
**And** each stat card shows the total amount for the selected year/period in DM Mono

**Given** transaction data exists for the selected year and period
**When** the transaction list renders
**Then** a table displays with columns: Date, Type, Category, Details, Amount
**And** the Date column shows formatted dates
**And** the Type column shows TypeBadge components (Income/Expense/Savings)
**And** the Category column shows category names in `--text-secondary`
**And** the Details column shows descriptions in `--text-primary`
**And** the Amount column is right-aligned, DM Mono font, color-coded: sage for income (€ X.XX), terracotta with minus for expenses (−€ X.XX), copper for savings (€ X.XX)
**And** amounts show € prefix, two decimal places, comma-separated thousands

**Given** the page is loading transaction data
**When** the API request is in progress
**Then** skeleton loaders matching the table shape are displayed (NFR-P4: < 300ms render after data arrives)

**Given** the API is unavailable
**When** the transaction fetch fails
**Then** the ErrorState component is displayed with a retry button (NFR-I1)
**And** clicking retry re-fetches the data

**Given** no transactions exist for the selected period
**When** the data returns empty
**Then** the EmptyState component displays "No transactions for this period."

**Given** table rows are displayed
**When** the user hovers over a row
**Then** the row background changes to `--bg-hover` with 150ms transition

**Architecture Notes:**
- `src/features/transactions/transactions-page.tsx` — page component
- `src/features/transactions/components/transaction-table.tsx` — table component
- `src/features/transactions/hooks/use-transactions.ts` — TanStack Query hook
- `src/api/transactions.ts` — `getTransactions(params)` API function
- TanStack Query key: `['transactions', selectedYear, selectedPeriod, filters]`
- Uses `useFilters()` from FilterContext for year/period
- Table uses shadcn/ui `Table` component customized with Quiet Ledger styling

**UX Notes:**
- Layout matches "View 1: Transactions" wireframe from UX spec
- Stat cards in a 3-column grid above the table
- Table header: 11px uppercase DM Sans, `--text-tertiary`, 1px `--border-default` bottom border
- Table rows: 12px padding, `--border-subtle` bottom border
- Card wrapping the table with header "Recent Transactions" and metadata showing count ("Showing X of Y")

### Story 3.2: Transaction Filtering

As a user,
I want to filter transactions by date range, type, and category,
So that I can quickly find specific transactions or narrow down my view.

**Acceptance Criteria:**

**Given** the transaction list is displayed
**When** looking at the filter area
**Then** filter controls appear: type filter (tab bar), category filter (dropdown), and date range filter

**Given** the type filter tab bar is visible
**When** viewing the options
**Then** tabs show: All | Income | Expenses | Savings
**And** "All" is selected by default
**And** clicking a type tab filters the transaction list to show only that type (FR3)
**And** stat cards update to reflect the filtered totals

**Given** the category filter dropdown is visible
**When** the user opens it
**Then** all categories present in the current data are listed
**And** selecting a category filters the list to show only transactions in that category (FR4)
**And** multiple categories can be selected (multi-select)
**And** a "Clear" option resets the category filter

**Given** the date range filter is visible
**When** the user selects a start and end date
**Then** only transactions within the date range are displayed (FR2)
**And** the date range defaults to the selected period from the global filter

**Given** multiple filters are active simultaneously
**When** viewing the transaction list
**Then** all filters apply together (AND logic)
**And** the transaction count updates to reflect filtered results
**And** stat cards update to reflect filtered totals

**Given** filters are applied
**When** the user changes the global year or period selector
**Then** the type and category filters reset to defaults
**And** the transaction list refreshes for the new year/period

**Architecture Notes:**
- `src/features/transactions/components/transaction-filters.tsx` — filter controls component
- Filter state managed locally in the transactions page (not in global context)
- Type filter: simple local state toggling query parameter
- Category filter: shadcn/ui `Select` with multi-select capability
- Date range: shadcn/ui date picker or simple inputs
- TanStack Query key includes filter parameters — changing filters triggers refetch
- API endpoint accepts `type`, `category`, `date_from`, `date_to` query parameters

**UX Notes:**
- Type filter as tab bar (All | Income | Expenses | Savings) — see UX spec "Filter Pattern"
- Category filter as dropdown multi-select next to the page title
- Date range filter as a more subtle control (not primary — global period handles most cases)
- Active filters should be clearly visible — not easy to miss that filtering is on

### Story 3.3: Transaction Sorting & Pagination

As a user,
I want to sort transactions and navigate through pages of results,
So that I can find specific entries in large datasets and see them in the order I need.

**Acceptance Criteria:**

**Given** the transaction table is displayed
**When** the user clicks the "Date" column header
**Then** transactions sort by date descending (newest first — default)
**And** clicking again toggles to ascending (oldest first) (FR5)
**And** a sort direction indicator (arrow) appears on the active sort column

**Given** the transaction table is displayed
**When** the user clicks the "Amount" column header
**Then** transactions sort by amount descending (largest first)
**And** clicking again toggles to ascending (FR5)

**Given** more than 50 transactions exist for the current filters
**When** the table renders
**Then** only the first 50 transactions are displayed (FR7)
**And** pagination controls appear below the table
**And** pagination shows: current page number, total pages, previous/next buttons
**And** the card header metadata updates (e.g., "Showing 1–50 of 312")

**Given** pagination controls are visible
**When** the user clicks "Next"
**Then** the next 50 transactions load and display
**And** the page scrolls to the top of the table
**And** the URL does not change (client-side pagination state)

**Given** the user is on the last page
**When** viewing pagination controls
**Then** the "Next" button is disabled
**And** the "Previous" button is enabled

**Given** the user applies a filter that reduces results below 50
**When** viewing the table
**Then** pagination controls are hidden
**And** all matching results are displayed on one page

**Architecture Notes:**
- `src/features/transactions/components/transaction-pagination.tsx` — pagination component
- Sort state managed locally in the page component, passed as query params to API
- Pagination: offset-based (`page`, `page_size` params to API) or cursor-based depending on backend
- TanStack Query key includes sort field, sort order, and page number
- Default: sort by date descending, page 1, page size 50
- API response includes total count for pagination calculation

**UX Notes:**
- Sort indicator: subtle arrow icon next to column header text
- Clickable column headers with cursor pointer and hover underline
- Pagination: clean, minimal controls — "← Previous | Page 2 of 7 | Next →"
- Page size fixed at 50 (no user-configurable page size for MVP)
- Smooth transition when loading new page (skeleton or subtle loading indicator)

---

## Epic 4: Category Spending Visualization

User can see where money goes via doughnut charts for Income, Expenses, and Savings, filtered by month or total year — answering "where is my money going?"

### Story 4.1: Category Spending Doughnut Charts

As a user,
I want to see doughnut charts showing how my spending is distributed across categories,
So that I can instantly understand where my money is going.

**Acceptance Criteria:**

**Given** the user navigates to `/spending`
**When** the page loads
**Then** the Spending page renders with the Instrument Serif page title "Category Spending"
**And** the subtitle shows the current period (e.g., "March 2026")

**Given** category spending data exists for the selected period
**When** the page renders
**Then** 3 doughnut charts are displayed in separate card sections: Income, Expenses, Savings (FR8, FR9, FR10)
**And** each card has a section header with the type name
**And** each chart shows category segments with colors from the chart palette (`--chart-1` through `--chart-12`)
**And** the center of each doughnut displays the total amount in DM Mono 18px with a "Total" label below

**Given** a doughnut chart is displayed
**When** the user hovers over a segment
**Then** a tooltip appears showing: category name, amount (€ X.XX), and percentage
**And** the segment visually highlights

**Given** a doughnut chart is displayed
**When** viewing the legend beside it
**Then** each category is listed with: color dot, category name, amount (DM Mono), percentage
**And** categories are sorted by amount descending (largest share first)

**Given** the global year or period selector changes
**When** the charts re-render
**Then** all 3 doughnut charts update to show data for the new year/period (FR11, FR12)
**And** chart animation plays (300ms transition)
**And** center totals update

**Given** no data exists for a particular type (e.g., no savings transactions)
**When** that chart section renders
**Then** an empty state is shown within the card: "No [type] data for this period"

**Given** the page is loading chart data
**When** the API request is in progress
**Then** skeleton loaders matching the chart layout are displayed (circular placeholder for doughnut, lines for legend)

**Architecture Notes:**
- `src/features/spending/spending-page.tsx` — page component
- `src/features/spending/components/spending-charts.tsx` — orchestrates 3 chart sections
- `src/features/spending/components/chart-legend.tsx` — legend component
- `src/features/spending/hooks/use-category-breakdown.ts` — TanStack Query hook
- `src/api/budget-tracking.ts` — `getCategoryBreakdown(year, period, type)` API function
- `src/components/charts/doughnut-chart.tsx` — Recharts PieChart wrapper (NFR-M3 abstraction)
- `src/components/charts/chart-container.tsx` — shared responsive container with loading state
- TanStack Query key: `['categoryBreakdown', selectedYear, selectedPeriod, type]`
- Recharts `PieChart` with `Pie` component, inner/outer radius for doughnut hole

**UX Notes:**
- Layout matches "View 2: Spending" wireframe from UX spec
- Charts arranged vertically in card sections (Income → Expenses → Savings)
- Doughnut size: ~180px diameter with legend to the right
- Center of doughnut: total in DM Mono 18px, "TOTAL" label in 11px uppercase `--text-tertiary`
- Legend items: 13px, color dot (10px, 2px border-radius), category name, amount, percentage
- Chart palette from UX spec: `--chart-1` through `--chart-12` in order
- Hover: segment expands slightly, tooltip with white background and shadow
- Animation: 300ms ease on initial render and data changes

---

## Epic 5: Budget Planning

User can plan monthly budgets in an editable grid with three sections (Income/Expenses/Savings), live row/column totals, and a "to be allocated" balance indicator — enabling budget creation and adjustment.

### Story 5.1: Budget Grid Display & API Integration

As a user,
I want to see my budget plan as a categories-by-months grid with section totals,
So that I can review how my money is allocated across the year.

**Acceptance Criteria:**

**Given** the user navigates to `/budget`
**When** the page loads
**Then** the Budget page renders with the Instrument Serif page title "Budget Planning"
**And** the sidebar collapses to 52px icon-only mode to maximize grid width
**And** the subtitle shows the selected year (e.g., "2026")

**Given** budget plan data exists for the selected year
**When** the grid renders
**Then** a table displays with: Category column (sticky left), 12 month columns (Jan–Dec), Total column (FR13)
**And** the grid is divided into 3 sections: INCOME, EXPENSES, SAVINGS (FR19)
**And** section headers span the full width with color-coded labels (sage/terracotta/copper)

**Given** the grid is displayed
**When** viewing category rows
**Then** each cell shows the budgeted amount in DM Mono 12px, right-aligned
**And** empty cells show "—" (em dash)
**And** the Total column (rightmost) shows the annual sum for each category in bold (FR15)

**Given** the grid is displayed
**When** viewing section totals
**Then** each section has a "Total [Section]" row at the bottom
**And** the Total Income row shows monthly column sums in sage (FR16)
**And** the Total Expenses row shows monthly column sums in terracotta
**And** the Total Savings row shows monthly column sums in copper
**And** total rows have `--bg-raised` background, bold font, and double bottom border

**Given** the grid is displayed
**When** viewing the bottom row
**Then** a "To Allocate" row shows: Income - Expenses - Savings per month (FR17)
**And** positive values are sage green (FR18 — money left to allocate)
**And** zero values are dim gray (`--text-tertiary`) (FR18 — fully allocated)
**And** negative values are terracotta (over-allocated)

**Given** the grid has many categories
**When** the user scrolls horizontally
**Then** the Category column (first column) remains sticky/fixed on the left
**And** month columns scroll underneath it

**Given** the page is loading budget data
**When** the API request is in progress
**Then** skeleton loaders matching the grid shape are displayed

**Given** the API returns no budget plan for the selected year
**When** the grid renders
**Then** an empty grid structure is shown with section headers but no category rows
**And** a prompt suggests creating a budget plan

**Architecture Notes:**
- `src/features/budget/budget-page.tsx` — page component
- `src/features/budget/components/budget-grid.tsx` — main grid component
- `src/features/budget/components/budget-section.tsx` — section with header and rows
- `src/features/budget/components/allocation-indicator.tsx` — "To Allocate" row
- `src/features/budget/hooks/use-budget-plan.ts` — TanStack Query hook
- `src/api/budget-plan.ts` — `getBudgetPlan(year)` API function (FR29)
- Totals computed client-side from the fetched data (simple sums)
- Grid uses native HTML `<table>` for semantic structure, not CSS grid
- First column sticky via `position: sticky; left: 0;` with z-index

**UX Notes:**
- Layout matches "View 3: Budget Planning" wireframe from UX spec
- Sidebar MUST collapse to 52px — this view needs maximum horizontal space
- Section headers: 11px uppercase DM Sans, color-coded (sage/terracotta/copper), collapsible
- Data cells: DM Mono 12px, `--text-secondary`, right-aligned, `--space-2` padding vertical, `--space-3` padding horizontal
- Category column: DM Sans 12px, font-weight 500, `--text-primary`, left-aligned, sticky
- Month column headers: 11px, DM Sans font-weight 500, `--text-tertiary`, right-aligned
- Hover on data cells: subtle outline (`--border-default`) appears — indicating editability
- Total row: `--bg-raised` background, `--border-default` top/bottom borders, bold

### Story 5.2: Inline Budget Editing with Optimistic Updates

As a user,
I want to click a budget cell and edit the amount inline with keyboard navigation,
So that I can quickly adjust my budget without leaving the grid.

**Acceptance Criteria:**

**Given** the budget grid is displayed in read mode
**When** the user clicks a data cell (not header, not total, not allocation row)
**Then** the cell enters edit mode: the display value is replaced by an input field (FR14)
**And** the input is auto-focused with the current value selected
**And** the input has a subtle border glow in `--income-border`

**Given** a cell is in edit mode
**When** the user types a new number and presses Enter
**Then** the cell exits edit mode and displays the new value
**And** the row total (annual sum) updates immediately (FR15)
**And** the section column total updates immediately (FR16)
**And** the "To Allocate" row updates immediately for that month (FR17)
**And** the change is saved to the backend via API (FR30)
**And** the save uses optimistic update — the UI updates before the API confirms (NFR-P5: < 100ms perceived)

**Given** a cell is in edit mode
**When** the user presses Tab
**Then** the current cell saves and the next cell to the right enters edit mode
**And** Shift+Tab moves to the previous cell

**Given** a cell is in edit mode
**When** the user presses Escape
**Then** the cell reverts to its original value and exits edit mode

**Given** a cell is in edit mode
**When** the user presses Enter
**Then** the current cell saves and the cell below (same month, next category) enters edit mode

**Given** the optimistic update is sent to the API
**When** the API returns an error
**Then** the cell value reverts to the previous value
**And** a toast notification appears with the error message (terracotta accent, persistent with retry button)

**Given** the save succeeds
**When** the API confirms the update
**Then** a brief success indicator appears (subtle, auto-dismiss after 3 seconds)
**And** the TanStack Query cache is updated

**Given** the "To Allocate" row shows zero for a month
**When** viewing that cell
**Then** it displays in dim gray (`--text-tertiary`) indicating fully allocated (FR18)

**Architecture Notes:**
- `src/features/budget/components/budget-cell.tsx` — editable cell component with display/edit states
- `src/features/budget/hooks/use-update-budget.ts` — TanStack Query `useMutation` hook
- `src/api/budget-plan.ts` — `updateBudgetPlan(year, data)` mutation function (FR30)
- Optimistic update: use TanStack Query's `onMutate` to update cache immediately, `onError` to rollback
- Cell state machine: Display → (click) → Edit → (Enter/Tab) → Display, (Escape) → Display (revert)
- Keyboard navigation managed by the grid component — Tab/Shift+Tab/Enter change focus between cells
- Debounce not needed — each cell save is a discrete mutation

**UX Notes:**
- Edit mode matches "Budget Grid Cell" spec from UX design: input field with subtle `--income-border` glow
- Keyboard flow must feel like Excel/Airtable: Tab across, Enter down, Escape cancel
- Numbers only in input — prevent non-numeric characters
- Toast for save errors: terracotta accent, persistent, with retry button
- Toast for save success: subtle, copper accent, auto-dismiss 3s
- Cell transitions: 100ms ease between display and edit states

---

## Epic 6: Budget vs Actual Tracking

User can compare planned budget against actual spending per category, see remaining/excess amounts and completion percentages — answering "am I on track?"

### Story 6.1: Budget vs Actual Comparison View

As a user,
I want to see how my actual spending compares to my budget for each category,
So that I can quickly identify where I'm over or under budget.

**Acceptance Criteria:**

**Given** the user navigates to `/budget-vs-actual`
**When** the page loads
**Then** the Budget vs Actual page renders with the Instrument Serif page title "Budget vs Actual"
**And** the subtitle shows the current period (e.g., "March 2026")

**Given** budget and actual data exists for the selected period
**When** the comparison table renders
**Then** separate sections are displayed for Expenses (default/first), Income, and Savings
**And** each section has a card with a section header

**Given** the Expenses section is displayed
**When** viewing the comparison table
**Then** columns show: Category, Budget, Actual, Progress (bar), %, Remaining (FR20)
**And** Budget and Actual columns show amounts in DM Mono (€ X.XX)
**And** rows are sorted by overspend first (most over-budget categories at top)

**Given** a category row is displayed
**When** viewing the progress bar
**Then** the bar width represents percentage of budget used (actual / budget × 100) (FR23)
**And** bar color is sage green when under 80%
**And** bar color is amber when between 80–100%
**And** bar color is terracotta when over 100%
**And** bar visually caps at 100% width even when percentage exceeds 100%
**And** the bar sits on a `--bg-hover` track, is 6px tall with rounded corners

**Given** a category is under budget
**When** viewing the Remaining column
**Then** it shows the remaining amount in sage green (budget - actual) (FR21)

**Given** a category is over budget
**When** viewing the Remaining column
**Then** it shows the excess amount in terracotta with minus prefix (−€ X.XX) (FR22)
**And** the percentage column also shows in terracotta

**Given** the global period selector is set to "Total Year"
**When** viewing the comparison
**Then** all values reflect annual totals: full year budget vs full year actual (FR24)

**Given** the global period selector is set to a specific month
**When** viewing the comparison
**Then** all values reflect that single month: monthly budget vs monthly actual (FR24)

**Given** the page is loading data
**When** the API request is in progress
**Then** skeleton loaders matching the table shape are displayed

**Given** no budget plan exists for the selected period
**When** the page renders
**Then** an EmptyState is shown: "No budget plan for [year]. Create one in Budget Planning."

**Architecture Notes:**
- `src/features/budget-vs-actual/budget-vs-actual-page.tsx` — page component
- `src/features/budget-vs-actual/components/comparison-table.tsx` — comparison table with sections
- `src/features/budget-vs-actual/components/completion-bar.tsx` — progress bar wrapper with threshold logic
- `src/features/budget-vs-actual/hooks/use-budget-vs-actual.ts` — TanStack Query hook
- `src/api/budget-tracking.ts` — `getBudgetVsActual(year, period)` API function
- Sorting logic: sort by (actual - budget) descending, so most over-budget items appear first
- Remaining calculation: `max(budget - actual, 0)` for remaining, `max(actual - budget, 0)` for excess
- Percentage: `(actual / budget * 100).toFixed(0)` — handle division by zero (budget = 0 → show "—")

**UX Notes:**
- Layout matches "View 4: Budget vs Actual" wireframe from UX spec
- Expenses section is shown first and expanded by default (most relevant for overspend tracking)
- Income and Savings sections follow below
- Table header: 11px uppercase, `--text-tertiary`, with column width hints (Category 160px, Budget/Actual 100px, Progress 200px, % 80px, Remaining 110px)
- Progress bar uses the ProgressBar component from Story 1.2
- Row hover: `--bg-hover` background on the full row
- Category name: DM Sans, font-weight 500, `--text-primary`
- Amount columns: DM Mono 13px, `--text-secondary`
- Over-budget percentage: terracotta color to draw attention
