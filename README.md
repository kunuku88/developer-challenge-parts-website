# BAS World — Parts Finder

Internal parts catalogue for BAS World mechanics and workshop managers. Search, filter, compare, and quote truck parts across all major brands.

---

## Tech stack

| Layer           | Tool                      |
| --------------- | ------------------------- |
| Framework       | Nuxt 4 / Vue 3 (SSR)      |
| State           | Pinia                     |
| Styling         | Tailwind CSS v4           |
| Unit tests      | Vitest + @nuxt/test-utils |
| E2E tests       | Playwright                |
| Linting         | ESLint + Prettier         |
| Package manager | pnpm                      |

---

## Package manager

This project uses **pnpm** (pinned in `package.json` via the `packageManager` field). All scripts in this README use pnpm, but you can use npm or yarn if you prefer — just substitute the commands accordingly.

**Installing pnpm (if not already available)**

Install it globally so you can use `pnpm` directly:

```bash
npm install -g pnpm
```

Alternatively, if you prefer not to install globally, you can run all commands via `npx`:

```bash
npx pnpm install
npx pnpm dev
# etc.
```

Or use corepack (ships with Node.js 16.9+):

```bash
corepack enable
# pnpm is now available — no separate install needed
```

---

## Getting started

```bash
(p)npm install
(p)npm exec playwright install   # download browser binaries (first time only)
(p)npm dev                       # http://localhost:3000
```

**Demo credentials**

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `j.devries@basworld.com` |
| Password | `onderdelen123`          |

---

## Scripts

### Development

```bash
(p)npm dev          # start dev server
(p)npm build        # production build
(p)npm preview      # preview production build
(p)npm typecheck    # run TypeScript checks
```

### Code quality

```bash
(p)npm lint          # check for lint errors
(p)npm lint:fix      # auto-fix lint errors
(p)npm format        # format all files with Prettier
(p)npm format:check  # check formatting without writing
```

### Testing

```bash
# Unit tests (Vitest)
(p)npm test:unit            # watch mode — reruns on file changes
(p)npm exec vitest run      # single run & exit
(p)npm test:unit:ui         # interactive browser UI (http://localhost:51204)
(p)npm exec vitest run --coverage   # with coverage report

# E2E tests (Playwright) — requires dev server or starts it automatically
(p)npm test:e2e             # headless
(p)npm test:e2e:ui          # interactive Playwright UI
(p)npm exec playwright test --headed              # watch browser
(p)npm exec playwright test tests/e2e/auth.spec.ts  # single file
```

---

## Project structure

```
app/
├── components/
│   ├── icons/        # extracted SVG icon components
│   ├── parts/        # part cards, filters, search, comparison
│   ├── quote/        # quote drawer, items, PDF export
│   └── ui/           # UButton, UCard, UInput, UModal, …
├── composables/      # usePartsFilter, useRecentlyViewed, useAuth, …
├── pages/            # index, parts/[id], quote, compare, login, settings
├── stores/           # Pinia stores: auth, quote, comparison
└── layouts/          # default, auth

server/
├── api/
│   ├── auth/login.post.ts
│   └── parts/[id].get.ts, index.get.ts
└── data/parts.json   # static parts dataset

tests/
├── unit/
│   ├── stores/       # quote.spec.ts, comparison.spec.ts
│   └── composables/  # usePartsFilter.spec.ts, useRecentlyViewed.spec.ts
└── e2e/              # auth.spec.ts, quote.spec.ts, search-filter.spec.ts, compare.spec.ts

shared/types/         # Part, QuoteItem, User, … (shared between app + server)
```

---

## Key components

- **`UButton`** — unified button/link component. Renders as `<button>` or `<NuxtLink>` via `to` prop. Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`, `unstyled`.
- **`usePartsFilter`** — reactive filter state (search, brand, condition, category, sort) synced to URL query params.
- **`useQuoteStore`** — Pinia store for the quote list, persisted to `localStorage`.
- **`useComparisonStore`** — Pinia store for part comparison, max 3 parts.
- **`useRecentlyViewed`** — composable tracking last 10 viewed part IDs in `localStorage`.
