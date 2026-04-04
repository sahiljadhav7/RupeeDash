# RupeeDash — Finance Dashboard

A personal finance dashboard I built to practice React + TypeScript. You can track income and expenses, visualize spending patterns, and manage transactions with full CRUD. It also has a basic role system (admin vs viewer) and dark mode.

---

## What it does

- Shows a summary of your total balance, income, expenses, and savings rate
- A chart for monthly income/expense trends
- Pie chart breaking down expenses by category
- A transactions table with search, filters, sorting, and CSV export
- Add/edit/delete transactions (admin only)
- Two ways to paginate: infinite scroll or classic page buttons — you can switch between them
- Dark mode that actually remembers your preference across reloads

---

## Tech stack

- **React 18** + **TypeScript**
- **Vite** (with SWC) for the build — way faster than CRA
- **Zustand** for state management. I looked at Redux but it felt like overkill for this, and Context would cause too many re-renders. Zustand's `persist` middleware also handles the localStorage sync automatically which was nice
- **Recharts** for the charts
- **shadcn/ui** for UI components — basically Radix UI primitives with Tailwind styling
- **Tailwind CSS** for styling
- **Framer Motion** for the entrance animations
- **React Router v6** for routing (only two routes right now)
- **TanStack Query** is set up but mostly unused — I added it so it's easier to swap in a real API later
- **Vitest** + **Testing Library** for unit tests
- **Playwright** for E2E (scaffold is there, tests still need to be written)

---

## Folder structure

```
src/
├── main.tsx              # entry point
├── App.tsx               # sets up routing and providers
├── index.css             # all the CSS variables for theming + Tailwind imports
├── pages/
│   ├── Index.tsx         # the main dashboard page
│   └── NotFound.tsx      # 404
├── components/
│   ├── NavLink.tsx       # thin wrapper around react-router's NavLink
│   ├── dashboard/        # all the dashboard widgets
│   │   ├── Header.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── BalanceTrendChart.tsx
│   │   ├── SpendingBreakdown.tsx
│   │   ├── InsightsPanel.tsx
│   │   └── TransactionsTable.tsx
│   └── ui/               # shadcn components (button, dialog, select, etc.)
├── store/
│   └── useStore.ts       # Zustand store + selectors
├── hooks/
│   ├── use-mobile.tsx    # checks if viewport is mobile
│   └── use-toast.ts      # toast notification hook
├── lib/
│   └── utils.ts          # just the cn() helper (clsx + tailwind-merge)
└── test/
    ├── setup.ts
    └── example.test.ts
```

---

## State management

Everything lives in one Zustand store (`src/store/useStore.ts`). The store holds:

- `transactions` — the list of all transactions
- `role` — either `"admin"` or `"viewer"`
- `darkMode` — boolean
- `filters` — search string, type, category, sort field and order

I used Zustand's `persist` middleware but only persisted `transactions`, `darkMode`, and `role`. The filters intentionally don't get saved — felt weird to reload the page and still have a search query from last time.

There's also a `useFilteredTransactions` selector exported from the store that handles all the search/filter/sort logic in one place, so the table component doesn't have to think about it.

```ts
// This was one of my favourite small wins — a single generic action for all filters
// instead of writing setSearchFilter, setTypeFilter, setCategoryFilter, etc.
setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
```

---

## A few things worth mentioning

**Dark mode without flash** — I restore the dark mode class on `<html>` synchronously in `main.tsx` before React even mounts. If I did it in a `useEffect` there'd be a white flash. Easy fix once you know the pattern.

**Dual pagination** — The transactions table has both infinite scroll (using `IntersectionObserver` on a sentinel div at the bottom) and traditional page-number pagination. You can toggle between them live. The infinite scroll triggers 100px before the sentinel enters the viewport so it feels seamless.

**RBAC** — It's purely frontend simulation. Admin users see the Add/Edit/Delete controls, viewers don't. Obviously in a real app this would be enforced server-side too, but for a demo it shows the concept.

**CSV export** — Creates a Blob from the filtered transaction list and fakes a download click. Exports whatever the current filters show, not everything.

---

## Getting started

```bash
npm install
npm run dev
# runs on http://localhost:8080
```

```bash
npm run build    # production build
npm test         # run unit tests
```

---

## What I'd add with more time

- Connect to an actual backend (TanStack Query is already configured for this)
- Date range filter (react-day-picker is already installed, just needs wiring up)
- Budget goals per category
- Proper auth instead of the fake role switcher
- More tests — the Vitest setup is there but coverage is minimal
