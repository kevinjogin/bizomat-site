# BIZOMAT Project Management

**Project Management** is part of **BIZOMAT**, the Intelligent Business Automation Platform ("Automate work. Connect systems. Get business done."). It is an original, self-hosted work management app (boards, items, automations, dashboards, docs, goals) built entirely on Cloudflare: **Workers** (API + static app), **D1** (relational data), **R2** (files), **KV** (cache/config), **Durable Objects** (realtime) and **Cron Triggers** (scheduled jobs).

Its new address is <https://work.bizomat.ai>; <https://work.kevos.com> keeps working, served by the same backend. Until 5 November 2026 it was called KEVOS WorkOS ("Work by KEVOS"); the Cloudflare resource names (`workos-platform-*`), cookie names and other identifiers keep the original prefix so that live data, sessions and integrations carry on unchanged.

> **Brand.** The BIZOMAT brand system lives in `shared/brand/` at the repository root (logo geometry, tokens, components, fonts); `node shared/brand/build.mjs` copies the generated files into this app: `src/client/lib/bizomat-brand.ts` (logo paths and colours), `src/client/styles/bizomat-tokens.css` (tokens and `@font-face` for Oxanium and Inter Tight), `public/fonts/`, `public/favicon.svg`, `public/apple-touch-icon.png` and `public/og.png`. Never edit those copies by hand. In the app: names, colours and the platform links (website, CAD Automation, Privacy, Terms, Disclaimer) are in `src/client/lib/brand.ts` (one place to change an address), names and the default colour shared with the Worker in `src/shared/brand.ts`, the mark, wordmark and product lockup in `src/client/components/ui/Icon.tsx`, the app's variables mapped onto the `--bz-*` tokens in `src/client/styles/app.css`, and the server-side name in the `APP_NAME` variable (wrangler.jsonc). Colours: navy `#0a1f33` (wordmark), teal `#0f766e` (buttons, links, the default colour of new workspaces; `#2dd4bf` on dark), teal `#14b8a6` (the B's connector bar in the mark). Headings in Oxanium, body in Inter Tight, both served from this app's own origin.

## Features

| Area | What works today |
| --- | --- |
| Auth | Email + password (PBKDF2), secure `__Host-` session cookies, CSRF tokens, rate limiting, lockout, session list/revoke, personal API tokens, provider-independent OAuth with a real Google OIDC provider that activates when credentials are configured |
| Workspaces | Multi-workspace, roles (owner/admin/member/viewer), invitations (copyable link), teams, audit log, JSON export |
| Boards | Groups, items, subitems, 25 column types, inline editing, drag & drop (rows, groups, columns), bulk actions, archive/restore, duplicate, templates, private/workspace visibility, board roles, default values |
| Views | Table, Kanban, Calendar (month/week/day), Timeline/Gantt (dependencies, milestones, drag-to-reschedule), Chart, Workload, Form, Map, Files — all on one shared data model; saved filters/sorts, personal views |
| Items | Detail panel: updates, replies, @mentions, attachments (R2), subitems, activity history, time tracking, linked documents |
| Automations | Trigger → conditions → actions engine, run logs, retries, de-duplication, loop prevention, recurring + date-based triggers |
| Notifications | Assignment, mention, comment, reply, status change, due soon, overdue, automation, invitation; read/unread, preferences, deep links |
| Dashboards | 11 widget types computed from live data, add/remove/resize/reorder, source boards, filters, date ranges |
| Documents | Rich text (headings, lists, checklists, tables, links, images), autosave with conflict detection, version history, comments, sharing, links to boards/items |
| Planning | My Work, My Day + weekly planner, goals (manual or board-driven progress), favourites, recent, global search with AND/OR filters and saved filters |
| Integrations | Signed outgoing webhooks, Slack and Microsoft Teams incoming webhooks (shown as connected only after a successful delivery). Google Drive/Calendar/Gmail and GitHub are listed as "requires setup" — not faked |

## Quick start (local)

```bash
npm ci
```

```bash
npm run db:migrate:local
```

```bash
npm run dev
```

Open <http://localhost:8787>, create an account (sign-up is enabled in development) and start from a template. Everything runs locally against Miniflare's D1/R2/KV/Durable Objects — no Cloudflare account needed.

For a ready-made demo, run `npm run seed:local` while `npm run dev` is running: it creates the fictional workspace "Acme Studio" (four teammates, the boards "Website relaunch" and "Product launch", a dashboard, a document and work assigned to you) through the public API and prints the sign-in details. It only talks to localhost.

For front-end hot reload run `npm run dev:client` (Vite on :5173, proxies `/api` to the Worker on :8787).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run lint` / `npm run typecheck` | ESLint + strict TypeScript (client and worker) |
| `npm test` | 195 integration/unit tests running **inside the Workers runtime** (real D1/R2/DO via Miniflare) |
| `npm run test:e2e` | Playwright end-to-end tests against a local Worker (desktop + mobile) |
| `npm run build` | Production client build + Worker dry-run bundle |
| `npm run check` | Everything above except e2e |
| `npm run seed:local` | Fictional demo content in a running local Worker (`scripts/seed-local.mjs`, localhost only) |
| `scripts/check-conflicts.sh` | **Read-only** check that the `workos-platform-*` resource names are free in your Cloudflare account |
| `scripts/provision.sh <env>` | Creates the new isolated D1/R2/KV for one environment (aborts on any name conflict) |
| `node scripts/smoke.mjs <url>` | Post-deployment smoke test |

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — system design, modules, decisions
- [DATABASE.md](DATABASE.md) — schema, tenancy, migrations, backups
- [SECURITY.md](SECURITY.md) — threat model, controls, audit results
- [DEPLOYMENT.md](DEPLOYMENT.md) — environments, resource names, CI/CD, Google OAuth setup, rollback
- [CONTRIBUTING.md](CONTRIBUTING.md) — workflow and conventions
- [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) — backlog, feature checklist, known issues, deployment history, test results
