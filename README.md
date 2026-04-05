# RupeeDash - Finance Dashboard

RupeeDash is a personal finance dashboard built with React, TypeScript, and Vite. It lets you track income and expenses, explore deeper financial insights, and manage transactions from a sidebar-driven workspace with Home, Insights, and Transactions pages.

## Features

- Sidebar navigation with dedicated `Home`, `Insights`, and `Transactions` pages
- Overview dashboard with balance, income, expense, and savings summary cards
- Monthly balance trend visualization and expense breakdown charts
- Insight-focused analytics for strongest months, spending concentration, and trend signals
- Transactions workspace with search, filters, sorting, CSV export, and CRUD actions
- Admin and viewer role modes with role-aware controls
- Theme toggle with persisted light/dark preference
- Local persistence for transactions and active role using Zustand

## Pages

### Home

The main dashboard view keeps the original structure and surfaces the high-level financial picture:

- Summary cards
- Balance trend chart
- Spending breakdown
- Quick insights panel
- Transaction table

### Insights

The insights page expands on the dashboard with more in-depth analysis:

- Spending concentration and monthly change metrics
- Category deep dive with share-of-spend bars
- Monthly performance table
- Largest income and expense highlights
- Recommendation-style observations derived from transaction history

### Transactions

The transactions page focuses on detailed activity:

- Current dataset summary cards
- Recent activity feed
- Expense hotspot breakdown
- Full transactions table with filters and export
- Admin-only add, edit, and delete actions

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router v6
- Zustand with `persist`
- Tailwind CSS
- shadcn/ui + Radix UI
- Recharts
- Framer Motion
- TanStack Query
- Vitest + Testing Library
- Playwright scaffold

## Project Structure

```text
src/
|-- App.tsx
|-- main.tsx
|-- index.css
|-- components/
|   |-- dashboard/
|   |   |-- DashboardLayout.tsx
|   |   |-- DashboardSidebar.tsx
|   |   |-- Header.tsx
|   |   |-- SummaryCards.tsx
|   |   |-- BalanceTrendChart.tsx
|   |   |-- SpendingBreakdown.tsx
|   |   |-- InsightsPanel.tsx
|   |   |-- TransactionsTable.tsx
|   |   `-- MetricCard.tsx
|   `-- ui/
|-- lib/
|   |-- finance.ts
|   `-- utils.ts
|-- pages/
|   |-- Index.tsx
|   |-- Insights.tsx
|   |-- Transactions.tsx
|   `-- NotFound.tsx
|-- store/
|   `-- useStore.ts
`-- test/
    |-- example.test.ts
    `-- finance.test.ts
```

## State Management

The app uses a single Zustand store in `src/store/useStore.ts` for:

- `transactions`
- `role`
- `filters`

Transactions and role are persisted to local storage. Filter state is intentionally not persisted so each session starts with a clean working view.

## Analytics Layer

Shared derived finance logic lives in `src/lib/finance.ts`. This keeps calculations consistent across the sidebar, charts, insights page, and transactions page.

It includes helpers for:

- summary metrics
- monthly cash flow
- expense category breakdown
- recent transactions
- insight snapshots

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Run lint:

```bash
npm run lint
```

## Notes

- Theme preference is restored through `next-themes`, with legacy theme migration handled in `src/main.tsx`.
- Role-based access in this project is frontend-only and meant to simulate admin versus viewer behavior.
- The current dataset is local and mock-driven, which makes it easy to replace with an API later.

## Future Improvements

- Connect the dashboard to a real backend or API
- Add date-range filtering and budgeting tools
- Introduce authentication for real role enforcement
- Expand automated test coverage
- Split large bundles with route-level code splitting
