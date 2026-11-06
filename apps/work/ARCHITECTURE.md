# Architecture

## Overview

```
Browser (React SPA) ──HTTPS──▶ Cloudflare Worker (Hono)
                                 ├─ /api/*        JSON API (auth, RBAC, domain services)
                                 ├─ /api/live/*   WebSocket ─▶ Durable Object BoardRoom (per board)
                                 ├─ *             static assets (Workers Static Assets, SPA fallback)
                                 └─ scheduled()   cron every 15 min: automations, retries, due dates, cleanup
                Bindings:  D1 (DB) · R2 (FILES) · KV (CACHE) · DO (BOARD_ROOMS)
```

One Worker serves both the API and the built SPA (`run_worker_first: true`) so every response, including HTML, gets security headers and unauthenticated navigations are redirected to `/login` server-side.

## Code layout

| Path | Contents |
| --- | --- |
| `src/shared/` | Code used by **both** API and UI: column type registry (`columns.ts`), AND/OR filter engine (`filters.ts`), safe formula language (`formula.ts`), computed values (`items.ts`), DTO types, date helpers |
| `src/worker/` | `index.ts` entry (fetch + scheduled), `app.ts` (routing, headers, SPA), `auth/` (passwords, sessions, CSRF, rate limits, OAuth providers), `services/` (permissions, item operations, automations, notifications, integrations, boards/templates, stats), `routes/` (HTTP handlers), `realtime/` (Durable Object) |
| `src/client/` | React 19 SPA: `components/` (UI kit, layout, charts, automations), `board/` (board page, table, cells, item panel, toolbar, `views/` registry), `pages/`, `lib/` (API client, session, hooks), `styles/` |
| `migrations/` | D1 SQL migrations |
| `test/` | Vitest suites executed inside workerd (`@cloudflare/vitest-plugin`) |
| `e2e/` | Playwright specs |

## Brand and naming

The product is **BIZOMAT Project Management** (short: Project Management), one of the products of the BIZOMAT platform; it was KEVOS WorkOS until 5 November 2026. The brand comes from `shared/brand/` at the repository root: `node shared/brand/build.mjs` generates the logo geometry module (`src/client/lib/bizomat-brand.ts`), the design tokens with the Oxanium and Inter Tight `@font-face` rules (`src/client/styles/bizomat-tokens.css`), the fonts, favicon, touch icon and social image in `public/`; these copies are never edited by hand. `src/client/styles/app.css` imports the tokens first and sets every app variable (surfaces, text, accent, focus, status colours, radii) from the `--bz-*` tokens, so light and dark follow the platform while the app keeps its own layout, density and components. `src/client/lib/brand.ts` holds the names, colours and every platform address (bizomat.ai, its Privacy, Terms and Disclaimer pages, CAD Automation); `src/shared/brand.ts` holds what the Worker also needs (the product name and BIZOMAT teal, the colour of new workspaces and folders). People only see the new name; identifiers stay as they were so live data keeps working: Cloudflare resources `workos-platform-*`, the session cookie `workos_sid`, the OAuth state cookie, the `X-WorkOS-*` webhook headers and the internal `X-WorkOS-User` header, the `workos-export-v1` export format, `workos:*` browser storage keys and drag-and-drop MIME types, and the migration history (including `0002_kevos_brand.sql`). Existing workspaces keep the colour their owners chose; no migration rewrites it.

## Key design decisions (ADRs)

1. **Single Worker + Static Assets** instead of Pages + separate API: one deployable unit per environment, same-origin API (no CORS surface), atomic versions for preview aliases and rollback.
2. **Hono** for routing: tiny, Workers-native, typed context.
3. **D1 as the system of record.** Strong consistency for permissions, rate limiting and automation de-duplication (KV is eventually consistent, so it is never used for security decisions).
4. **Column values stored as a JSON map on the item** (`items.values_json`), validated by the shared registry. Single-column edits use `json_set`/`json_remove` so concurrent edits to different columns never clobber each other. One shared data model feeds every view.
5. **Extensible column registry** (`src/shared/columns.ts`): each type declares validation, conversion targets, filter operators, text and sort representations. Boards never hard-code column behaviour; adding a type is one registry entry plus a cell editor.
6. **View registry** (`src/client/board/views/index.ts`): every view implements `BoardViewProps` and receives the same filtered items and the same mutation API, so changes persist identically everywhere.
7. **Domain services own side effects.** `services/item-ops.ts` performs validation, activity logging, notifications, realtime fan-out and automation dispatch for *every* change — whether it comes from a user, a bulk action, a form or an automation.
8. **Automation engine** (`services/automations.ts`): `Trigger → Conditions (FilterGroup) → Actions`. Each execution writes an `automation_runs` row keyed by a unique `event_key` (duplicate prevention); failures are retried with exponential backoff by cron; loops are prevented by a depth limit (3) and a per-chain `automation:item` fingerprint.
9. **Realtime via Durable Objects** (hibernatable WebSockets). The Worker authenticates and authorises before handing the socket to the per-board object; the object only relays server-generated events. Clients refetch on events, so the DO never holds data.
10. **Cron instead of Queues** for background work (works on every plan, idempotent by design). Queues can be added later behind the same service functions.
11. **Provider-independent auth.** Users ↔ external identities via `user_identities`; providers implement `OAuthProvider`. Google is implemented with OIDC + PKCE + state cookie binding and is enabled purely by configuration.
12. **No fake integrations.** An integration is `connected` only after a real delivery succeeds; OAuth-based providers are shown as "requires setup".

## Request lifecycle (API)

`fetch` → Hono → `requireAuth` (session cookie or Bearer API token; CSRF + Origin check for cookie sessions on unsafe methods) → route → permission helper (`requireWorkspace` / `requireBoard` / `requireItem` / `requireDocument`) → zod validation → domain service → D1 batch → `waitUntil` realtime broadcast → JSON. `withSecurityHeaders` decorates every response.

## Extending

- **New column type:** add to `COLUMN_TYPES` + `defs` in `src/shared/columns.ts`, add display/editor cases in `src/client/board/cells/Cell.tsx`.
- **New view:** create `src/client/board/views/XView.tsx` implementing `BoardViewProps`, register it in `views/index.ts`, add the type to `ViewType` and `VIEW_TYPES` in `routes/boards.ts`.
- **New automation trigger/action:** extend `triggerSchema`/`actionSchema`, `triggerMatches`, `executeAction`, and the builder UI.
- **New integration:** add a `ProviderInfo` and a delivery branch in `services/integrations.ts`.
- **New auth provider:** implement `OAuthProvider` in `src/worker/auth/providers.ts` and add it to `providers`.
