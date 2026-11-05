# KEVOS WorkOS — work management platform

WorkOS is part of **KEVOS**: an original, self-hosted work management platform (boards, items, automations, dashboards, docs, goals) built entirely on Cloudflare: **Workers** (API + static app), **D1** (relational data), **R2** (files), **KV** (cache/config), **Durable Objects** (realtime) and **Cron Triggers** (scheduled jobs).

> Branded as **KEVOS WorkOS** (KEVOS orange `#F97316`). Brand constants live in `src/client/lib/brand.ts`, the mark and wordmark in `src/client/components/ui/Icon.tsx`, colour tokens in `src/client/styles/app.css`, and the server-side name in the `APP_NAME` variable (wrangler.jsonc).

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

For front-end hot reload run `npm run dev:client` (Vite on :5173, proxies `/api` to the Worker on :8787).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run lint` / `npm run typecheck` | ESLint + strict TypeScript (client and worker) |
| `npm test` | 168 integration/unit tests running **inside the Workers runtime** (real D1/R2/DO via Miniflare) |
| `npm run test:e2e` | Playwright end-to-end tests against a local Worker (desktop + mobile) |
| `npm run build` | Production client build + Worker dry-run bundle |
| `npm run check` | Everything above except e2e |
| `scripts/check-conflicts.sh` | **Read-only** check that WorkOS resource names are free in your Cloudflare account |
| `scripts/provision.sh <env>` | Creates the new isolated D1/R2/KV for one environment (aborts on any name conflict) |
| `node scripts/smoke.mjs <url>` | Post-deployment smoke test |

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — system design, modules, decisions
- [DATABASE.md](DATABASE.md) — schema, tenancy, migrations, backups
- [SECURITY.md](SECURITY.md) — threat model, controls, audit results
- [DEPLOYMENT.md](DEPLOYMENT.md) — environments, resource names, CI/CD, Google OAuth setup, rollback
- [CONTRIBUTING.md](CONTRIBUTING.md) — workflow and conventions
- [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) — backlog, feature checklist, known issues, deployment history, test results
