# Mr. Twin Web

Storefront (SvelteKit) for **Mr. Twin** — a portfolio marketplace project that mirrors real Accurate Online inventory into a local database and sells it through a normal storefront (catalog, cart, checkout). See [`PLANNING.md`](../PLANNING.md) for the full project rationale.

This app is a pure REST API client — all data comes from [`mr-twin-backend`](../mr-twin-backend); it holds no database of its own.

## Tech stack

- SvelteKit 5 (Svelte 5 runes, TypeScript)
- Tailwind CSS v4
- Prettier + ESLint

## Setup

```bash
npm install
cp .env.example .env
```

`.env`:
```
PUBLIC_API_BASE_URL=http://localhost:8000
```
Point this at wherever `mr-twin-backend` is running (`php artisan serve` default is `http://localhost:8000`).

```bash
npm run dev
```

The backend needs at least one product published (`product_display.is_published = true`) for the catalog to show anything — see `mr-twin-backend`'s README for how to curate one manually (no backoffice UI yet).

## Pages

| Route | Auth | Notes |
|---|---|---|
| `/` | — | Katalog (SSR), filter by category/brand/price/search via URL query params |
| `/products/[id]` | — | Detail produk, add to cart (disabled if out of stock) |
| `/cart` | — | Cart review (client-only, localStorage) |
| `/checkout` | customer | Shipping form + order summary; redirects to `/login` if not authed |
| `/login`, `/register` | — | Customer auth, issues a Sanctum token stored in `localStorage` |
| `/orders`, `/orders/[id]` | customer | Order history — `/orders/[id]` is also where checkout redirects on success |

Pages that depend on `localStorage` (cart/auth token) disable SSR (`export const ssr = false`) to avoid a server/client hydration mismatch; the katalog and product-detail pages stay server-rendered since their data is public.

## State (`src/lib/stores/`)

`cart.svelte.ts` and `auth.svelte.ts` are Svelte 5 runes-based singleton stores (`$state`/`$derived` inside a class, not the classic `writable()`/`derived()` from `svelte/store`) — this project was scaffolded with runes mode forced on, so that's the idiomatic fit even though `PLANNING.md`'s original state-management section describes the classic store API (written before runes existed). Both persist to `localStorage` and rehydrate on load, guarded by `$app/environment`'s `browser` check so SSR never touches `localStorage`.

## API client (`src/lib/api/`)

`client.ts` is a thin `fetch` wrapper (`apiFetch`) that resolves against `PUBLIC_API_BASE_URL`, attaches a bearer token when given one, and throws a typed `ApiError` (with the backend's `status`/`message`/body) on non-2xx responses — callers catch `ApiError` to show inline error messages (e.g. checkout's "Insufficient stock" from the backend's live Accurate stock check). `catalog.ts`/`auth.ts`/`orders.ts` are thin per-domain wrappers over it; `types.ts` mirrors the backend's API Resource shapes.

One non-obvious piece of plumbing: `src/hooks.server.ts` explicitly allows the `content-type` response header through SvelteKit's SSR fetch serialization (`filterSerializedResponseHeaders`) — SvelteKit strips all response headers from SSR-captured `fetch` calls by default, but `apiFetch` reads `content-type` to decide whether to parse JSON, so without this the katalog page's SSR `load` throws.

## Routing & typed navigation

This project's ESLint config enforces `svelte/no-navigation-without-resolve` — every `goto()` call and dynamic `href` must be wrapped in `resolve()` from `$app/paths` (SvelteKit's typed-routing helper), not a raw string. For redirect targets that are only known at runtime (the `?redirect=` query param on `/login`/`/register`), see `src/lib/safe-redirect.ts` — it validates the value is an internal relative path before treating it as trusted, since a raw `redirect` query param would otherwise be an open-redirect vector.

## Building

```bash
npm run build
npm run preview
```

## Checks

```bash
npm run check   # svelte-check (TypeScript)
npm run lint    # prettier --check + eslint
npm run format  # prettier --write
```
