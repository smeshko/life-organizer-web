---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments: []
documentCounts:
  briefs: 0
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
lastStep: 11
project_name: 'life-organizer-frontend'
user_name: 'Ivo'
date: '2026-03-09'
---

# Product Requirements Document - life-organizer-frontend

**Author:** Ivo
**Date:** 2026-03-09

## Executive Summary

Life-organizer-frontend is a desktop web application that serves as the budgeting module of the broader life-organizer ecosystem. It replaces an Excel-based personal budget tracker with a proper web frontend that consumes the existing FastAPI backend, eliminating the friction of file-based tracking and enabling seamless integration with the voice-driven iOS capture app.

The core value proposition is removing friction from personal budget tracking. Today, transactions must be manually entered into a laptop-bound Excel file. With this frontend, expenses captured via voice on the iOS app flow automatically through the backend and become visible in a purpose-built budgeting interface — no file syncing, no manual data entry, accessible from any machine.

This is a single-user, desktop-only application designed as a long-term financial analysis tool rather than a daily-check dashboard. It prioritizes depth of insight over frequent interaction.

### What Makes This Special

1. **Zero-friction transaction pipeline** — Voice-captured expenses from the iOS app flow through the backend and surface here automatically. The web UI is the "read and analyze" layer; the iOS app is the "capture" layer.
2. **Migration of a battle-tested budgeting model** — The underlying budget logic (3-section planning, budget-vs-actual tracking, late-income shifting, savings rate calculations) has been refined through real daily use in Excel and is being faithfully translated, not reinvented.
3. **Analysis capabilities Excel couldn't deliver** — Trend analysis, historical comparisons, and spending velocity — features that were impractical in a spreadsheet — become first-class citizens.

## Project Classification

**Technical Type:** web_app (SPA)
**Domain:** Personal Finance / Budgeting
**Complexity:** Low-Medium
**Project Context:** Greenfield frontend within a brownfield ecosystem (existing FastAPI backend + iOS app)

The frontend consumes existing backend API endpoints for all budget data operations. No authentication layer is required (single user). Desktop-only — no responsive/mobile considerations. The backend is currently being restructured to properly accommodate budget data models and API surface.

**Feature Priority (user-defined):**
1. Transaction ledger — comprehensive list of all income/expenses/savings entries
2. Category spending visualization — breakdown by category for a given timeframe
3. Budget planning & tracking — overview of under/over budget status per category
4. Trends & analysis — historical patterns, month-over-month comparisons (new capability)

## Success Criteria

### User Success

- **Primary success indicator:** The Excel budget file is never opened again after migration is complete
- **Zero-entry workflow:** Transactions captured via iOS voice flow into the frontend automatically — opening the web app shows up-to-date financial data without manual input
- **Insight on demand:** Within 30 seconds of opening the app, the user can answer "how much did I spend on X this month?" or "am I over budget on Y?"
- **Trust in data:** All transactions from the Excel migration and ongoing voice capture are accurately reflected — no missing or duplicated entries

### Business Success

This is a personal tool — no revenue, user growth, or engagement metrics apply. Success is measured by:

- **Adoption:** Ivo uses the web app as the sole budgeting interface within 2 weeks of launch
- **Consistency:** Budget planning for the upcoming year is done entirely in the web app
- **Reliability:** The app doesn't become a source of friction that drives a return to spreadsheets

### Technical Success

- **Page load:** Dashboard renders with data in under 2 seconds
- **Computation speed:** Budget vs actual calculations, category aggregations, and chart rendering feel instant (<500ms)
- **Data integrity:** Frontend accurately reflects backend state; no stale data after transactions are added via iOS
- **API integration:** Clean separation — frontend owns zero business logic, all data operations go through the FastAPI backend

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Time to answer "how much did I spend on X?" | < 30 seconds |
| Manual data entry required | Zero (all via iOS voice or backend) |
| Excel file opens per month | Zero |
| Page load time | < 2 seconds |
| Data freshness after new transaction | < 5 seconds (on refresh) |

## Product Scope

### MVP - Minimum Viable Product

1. **Transaction ledger** — Filterable list of all income/expenses/savings with date, type, category, amount, and details. Supports filtering by date range, type, and category.
2. **Category spending visualization** — Doughnut charts showing spending breakdown by category for a selected month or year. Separate charts for Income, Expenses, and Savings.
3. **Budget planning grid** — Categories x months grid for a single year. Three sections: Income, Expenses, Savings. Per-cell monthly budget amounts with row/column totals. "To be allocated" balance indicator.
4. **Budget vs Actual overview** — Per-category comparison of planned budget vs tracked spending. Shows remaining budget and excess (overspend) per category. Percentage completion indicator.

### Growth Features (Post-MVP)

- **Trends & analysis** — Month-over-month and year-over-year spending trends. Line charts showing category spending over time. Historical comparisons ("This January vs last January").
- **Spending velocity** — "At your current daily spend rate, you'll use X% of your Groceries budget by month end"
- **Recurring transaction templates** — Define repeating income/expenses that auto-populate or prompt for confirmation
- **CSV/bank statement import** — Bulk import with column mapping and category auto-detection
- **Late-income shifting** — Configurable setting to attribute late-month income to the next month's budget (migrated from Excel)
- **Savings rate KPI** — Configurable calculation method (% allocated to savings vs % not allocated to expenses)

### Vision (Future)

- Expand the frontend beyond budgeting to serve as the web portal for the full life-organizer ecosystem
- Net worth tracking (savings account balances over time, not just flows)
- Multi-currency support with conversion rates
- Export/report generation (PDF monthly/annual budget reports)
- Goal-based budgeting ("save €X for vacation by July")

## User Journeys

### Journey 1: The Weekly Financial Check-in

It's Sunday evening. Ivo has been capturing expenses all week via voice on his iPhone — "Paid 35 at the supermarket", "Netflix charged 15.99", "Salary came in". He opens the budget dashboard on his laptop for the first time this week. The transaction list shows every entry, already categorized. He switches to the category breakdown view for the current month and instantly sees he's overspent on eating out by €40. He clicks into the budget planning grid and adjusts next month's dining allocation upward, pulling from the "Fun" budget. The "to be allocated" indicator updates in real time — still balanced. Total time: 3 minutes. The Excel file stays closed.

**Capabilities revealed:** Transaction list with auto-populated data from backend, category breakdown charts with period selection, budget planning grid with inline editing, real-time "to be allocated" balance calculation.

### Journey 2: Year-End Budget Planning

It's December. Ivo opens the budget dashboard to plan next year's budget. He reviews this year's actuals — the trends view shows groceries crept up 15% since summer, while subscriptions dropped after he cancelled two services in October. He creates next year's budget by copying this year's plan as a starting point and adjusting category by category: bumping groceries to match reality, cutting the subscriptions line, adding a new "Travel" category. The "to be allocated" indicator goes green for each month as income minus expenses minus savings balances out. He's done in 20 minutes — something that used to take an hour of scrolling through 140 Excel columns.

**Capabilities revealed:** Year-over-year trend analysis, copy budget forward functionality, dynamic category management (add/rename), per-month "to be allocated" balance indicator, multi-year data access.

### Journey 3: Investigating a Spending Surprise

Mid-month, Ivo feels like money is disappearing faster than usual. He opens the dashboard, filters the transaction list to this month's expenses, and sorts by amount descending. He spots two large unexpected charges he'd forgotten about — an annual insurance payment and a car service. The budget vs actual view confirms he's €300 over on "Other" but actually under budget overall thanks to a quiet month on dining and entertainment. Crisis averted — no corrective action needed, just awareness.

**Capabilities revealed:** Transaction filtering (by month, by type), sorting (by amount, date), budget vs actual comparison with per-category remaining/excess, overall budget health summary.

### Journey Requirements Summary

| Capability | Journeys |
|------------|----------|
| Transaction list with sort & filter | 1, 3 |
| Auto-populated data from backend (zero manual entry) | 1 |
| Category breakdown charts (doughnut) with period selector | 1 |
| Budget planning grid with inline editing | 1, 2 |
| "To be allocated" real-time balance | 1, 2 |
| Budget vs actual with remaining/excess | 2, 3 |
| Trend visualization (month-over-month) | 2 |
| Copy budget forward (year to year) | 2 |
| Dynamic category management | 2 |
| Multi-year data navigation | 2 |
| Overall budget health summary | 3 |

## Web Application Specific Requirements

### Project-Type Overview

This is a single-page application (SPA) serving as a personal finance dashboard. It consumes a REST API from an existing FastAPI backend for all data operations. The frontend is purely a visualization, planning, and analysis layer — it owns no business logic and persists no data locally.

### Technical Architecture Considerations

- **Architecture:** SPA consuming REST API endpoints from the life-organizer FastAPI backend
- **Authentication:** None required — single user, private/local network deployment
- **Rendering:** Client-side only — no SSR/SSG needed (no SEO requirement)
- **State management:** Client-side state for UI interactions, budget computations, and chart rendering
- **Data flow:** All CRUD operations go through the backend API. Frontend fetches, displays, and sends user input back to the API.

### Browser Support

| Browser | Support Level |
|---------|--------------|
| Chrome (latest) | Full support |
| Firefox (latest) | Full support |
| Safari (latest) | Full support |
| Edge (latest) | Full support |
| IE / Legacy browsers | Not supported |
| Mobile browsers | Not targeted (desktop only) |

### Performance Targets

| Metric | Target |
|--------|--------|
| Initial page load (cold) | < 2 seconds |
| Subsequent navigation (SPA) | < 500ms |
| Chart rendering | < 500ms |
| API response handling | < 1 second |
| Multi-year dataset support | 10+ years without degradation |
| Bundle size | Reasonable for desktop (no aggressive mobile optimization) |

### Implementation Considerations

- **No SEO requirements** — private personal tool, not indexed by search engines
- **No responsive design** — desktop-only, optimized for wide screens (1280px+ viewport)
- **Accessibility:** Basic semantic HTML and keyboard navigation. No formal WCAG compliance target.
- **Real-time updates:** Not required for MVP. Data refreshes on page load or manual action. Transactions are captured asynchronously via iOS app — no WebSocket/SSE push needed initially.
- **Offline support:** Not required — relies on backend API availability

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — deliver the minimum feature set that makes the Excel spreadsheet permanently redundant. Every feature in Phase 1 must directly contribute to replacing the spreadsheet workflow.

**Resource Requirements:** Solo developer (Ivo). Frontend only — backend API development is a separate workstream.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:** Weekly Financial Check-in (Journey 1), Investigating a Spending Surprise (Journey 3)

**Must-Have Capabilities:**

1. **Transaction List**
   - Display all income/expenses/savings entries from the backend
   - Filter by: date range, transaction type (Income/Expenses/Savings), category
   - Sort by: date (default), amount
   - Show: date, type, category, amount, details
   - Paginated or virtual-scrolled for large datasets

2. **Category Spending Breakdown**
   - Doughnut charts showing spending distribution by category
   - Separate charts for Income, Expenses, and Savings
   - Period selector: specific month or total year
   - Year selector

3. **Budget Planning Grid**
   - Categories (rows) x 12 months (columns) for a single year
   - Three sections: Income, Expenses, Savings
   - Inline editing of monthly budget amounts
   - Row totals (annual sum per category) and column totals (monthly sum per section)
   - "To be allocated" balance per month: Income - (Expenses + Savings)
   - Visual indicator when a month is fully allocated (balance = 0)

4. **Budget vs Actual Overview**
   - Per-category comparison: budgeted amount vs tracked (actual) amount
   - Remaining budget: max(budget - tracked, 0)
   - Excess (overspend): max(tracked - budget, 0)
   - Percentage completion: tracked / budget
   - Period selector: month or total year

5. **Period & Year Navigation**
   - Year selector dropdown
   - Period selector: Total Year, or specific month (Jan–Dec)
   - All views respond to the selected year/period

### Post-MVP Features

**Phase 2 — Enhanced Analysis:**
- Trend charts: line charts showing category spending over months/years
- Month-over-month and year-over-year comparisons
- Copy budget forward: duplicate a year's plan to the next year, or a single month to all months
- Late-income shifting: configurable day threshold to attribute late-month income to next month
- Savings rate KPI: configurable calculation method (% to savings vs % not to expenses)
- Spending velocity: projected end-of-month spend based on daily rate
- Dynamic category management: add, rename, reorder categories without backend changes

**Phase 3 — Power Features:**
- Recurring transaction templates (define repeating entries)
- CSV/bank statement bulk import with column mapping
- Export: PDF monthly/annual budget reports
- Multi-currency support with conversion rates
- Goal-based budgeting ("save €X for vacation by July")

### Risk Mitigation Strategy

**Technical Risks:**
- Chart performance with 10+ years of data → use aggregated API endpoints for charts, paginate raw transaction lists
- Backend API still being restructured → define frontend data contracts early, mock API during development

**Integration Risks:**
- Frontend/backend API contract misalignment → coordinate API schema design before frontend implementation begins

**Scope Risks:**
- "Life organizer" vision pulling scope beyond budgeting → this PRD strictly covers budgeting module only. Other modules get their own PRDs.

## Functional Requirements

### Transaction Management

- **FR1:** User can view a list of all budget transactions (income, expenses, savings)
- **FR2:** User can filter transactions by date range
- **FR3:** User can filter transactions by transaction type (Income, Expenses, Savings)
- **FR4:** User can filter transactions by category
- **FR5:** User can sort transactions by date or amount
- **FR6:** User can view transaction details (date, type, category, amount, details)
- **FR7:** User can navigate paginated transaction results for large datasets

### Category Spending Visualization

- **FR8:** User can view a doughnut chart showing spending distribution by category for Income
- **FR9:** User can view a doughnut chart showing spending distribution by category for Expenses
- **FR10:** User can view a doughnut chart showing spending distribution by category for Savings
- **FR11:** User can select a specific month or total year to filter chart data
- **FR12:** User can select a year to filter chart data

### Budget Planning

- **FR13:** User can view a budget planning grid of categories (rows) by months (columns) for a selected year
- **FR14:** User can edit monthly budget amounts inline within the planning grid
- **FR15:** User can view annual totals per category (row sums)
- **FR16:** User can view monthly totals per budget section — Income, Expenses, Savings (column sums)
- **FR17:** User can view a "to be allocated" balance per month (Income - Expenses - Savings)
- **FR18:** User can visually identify months that are fully allocated (balance = 0)
- **FR19:** User can view separate planning sections for Income, Expenses, and Savings

### Budget vs Actual

- **FR20:** User can view a per-category comparison of budgeted vs actual (tracked) amounts
- **FR21:** User can view remaining budget per category (budget minus tracked, floored at 0)
- **FR22:** User can view excess spend per category (tracked minus budget when overspent)
- **FR23:** User can view percentage completion per category (tracked / budget)
- **FR24:** User can filter the budget vs actual view by month or total year

### Period & Navigation

- **FR25:** User can select a year from a dropdown to control all views
- **FR26:** User can select a period (total year or specific month) to control all views
- **FR27:** All data views respond to the currently selected year and period

### Data Integration

- **FR28:** The application can fetch transaction data from the backend API
- **FR29:** The application can fetch budget plan data from the backend API
- **FR30:** The application can send updated budget plan data to the backend API
- **FR31:** The application reflects the latest backend data on page load or manual refresh

## Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| Page load (cold) | < 2 seconds |
| SPA navigation between views | < 500ms |
| Chart rendering (12 months of category data) | < 500ms |
| Transaction list rendering (paginated, 50–100 items) | < 300ms |
| Budget grid inline edit response | < 100ms (perceived) |
| API round-trip for data fetch | < 1 second |

### Integration

- **NFR-I1:** Frontend must gracefully handle backend API unavailability (show clear error state, not blank screen)
- **NFR-I2:** Frontend must handle API response format changes without crashing (defensive parsing)
- **NFR-I3:** All API calls use a centralized HTTP client for consistent error handling and future auth header injection

### Maintainability

- **NFR-M1:** Component-based architecture — each view (transactions, charts, planning grid, budget vs actual) is an independent component
- **NFR-M2:** API client layer abstracted from UI components — swapping backend endpoints doesn't require UI changes
- **NFR-M3:** Charting library abstracted behind a wrapper — chart library can be swapped without rewriting views

### Excluded NFR Categories

- **Security:** Skipped for MVP. Single user, no auth, private network. Backend handles data persistence security.
- **Scalability:** Skipped. Single user. Dataset size (10+ years) handled via API pagination and aggregated endpoints.
- **Accessibility:** Minimal — semantic HTML, keyboard-navigable controls. No formal WCAG target.
