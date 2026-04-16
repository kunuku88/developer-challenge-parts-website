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

## Getting started

```bash
pnpm install
pnpm exec playwright install   # download browser binaries (first time only)
pnpm dev                       # http://localhost:3000
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
pnpm dev          # start dev server
pnpm build        # production build
pnpm preview      # preview production build
pnpm typecheck    # run TypeScript checks
```

### Code quality

```bash
pnpm lint          # check for lint errors
pnpm lint:fix      # auto-fix lint errors
pnpm format        # format all files with Prettier
pnpm format:check  # check formatting without writing
```

### Testing

```bash
# Unit tests (Vitest)
pnpm test:unit            # watch mode — reruns on file changes
pnpm exec vitest run      # single run & exit
pnpm test:unit:ui         # interactive browser UI (http://localhost:51204)
pnpm exec vitest run --coverage   # with coverage report

# E2E tests (Playwright) — requires dev server or starts it automatically
pnpm test:e2e             # headless
pnpm test:e2e:ui          # interactive Playwright UI
pnpm exec playwright test --headed              # watch browser
pnpm exec playwright test tests/e2e/auth.spec.ts  # single file
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
