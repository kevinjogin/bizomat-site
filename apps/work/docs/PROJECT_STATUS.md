# Project status: BIZOMAT Project Management

_Last updated: 2026-11-05_

## 2026-11-05: renamed to BIZOMAT Project Management

KEVOS WorkOS ("Work by KEVOS") is now **BIZOMAT Project Management**, part of the BIZOMAT platform ("Automate work. Connect systems. Get business done."). The app is to be served at https://work.bizomat.ai and still at https://work.kevos.com (same backend). In this change (not deployed yet):

- **Brand:** BIZOMAT wordmark, mark (navy tile, white B, teal connector bar) and the "Project Management" lockup drawn from the generated `bizomat-brand.ts`; page titles "<page> · BIZOMAT Project Management"; `index.html` title, description, theme colour (follows the light or dark theme), favicon, touch icon and Open Graph tags (`/og.png`); `APP_NAME` "BIZOMAT Project Management" in all three environments (preview keeps "(Preview)").
- **Visual system:** `app.css` imports the BIZOMAT tokens and sets every app variable from `--bz-*` (paper, surfaces, ink, teal accent, focus ring, status colours, 8 px buttons and inputs, 12 px cards) in light and dark; headings, page, board and document titles in Oxanium, body in Inter Tight, both served from `/fonts/`. The founder console has a navy sidebar with teal accents. Layout, density and features are unchanged.
- **Words:** sign-in ("Sign in to BIZOMAT") and sign-up pages with the product lockup, the platform's Privacy, Terms and Disclaimer and a link to this app's own privacy notice; "Part of the BIZOMAT platform" with links to the platform website, CAD Automation, Resources and the legal pages in the sidebar (same tab, `rel="noopener"` for other hosts; all addresses in `src/client/lib/brand.ts`); founder console, privacy notice, integration test messages, webhook placeholder, API token help and CSV/JSON download names.
- **Data:** new workspaces and folders get BIZOMAT teal `#0f766e`; existing workspaces and folders keep their colours (no migration). Identifiers are unchanged: `workos-platform-*` resources, `workos_sid` cookie, `X-WorkOS-*` headers, `workos-export-v1`, `workos:*` storage keys.
- **Fixes found in visual QA:** timeline cell labels stay readable at any progress and on dark; calendar and Gantt bars use a teal that keeps white text readable in both themes; the first page's tab title is no longer overwritten on load; long document titles fit a phone screen.
- **Demo content:** `npm run seed:local` (`scripts/seed-local.mjs`) fills a local Worker with the fictional "Acme Studio" workspace; used for the platform's Proof of Work screenshots.
- **Tests:** 195 / 195 in workerd (3 new: product name, teal default with chosen colours kept, no migration rewrites workspace colours); 9 / 9 Playwright (1 new: brand on sign-in and in the shell).

Owner decisions still open: a BIZOMAT address for privacy requests (the notice still names the only verified inbox, `BRAND.privacyContact`), and `APP_URL` for production once work.bizomat.ai is the primary address.

## Phase summary

| Phase | Status |
| --- | --- |
| 0. Environment inspection | Done. Node 22, npm/pnpm, Wrangler 4.157, Playwright/Chromium available. GitHub reachable via the session's GitHub integration (repository creation not permitted from the build session). Cloudflare API and docs **blocked by the build environment's network policy**; no Cloudflare credentials present. |
| 1. Architecture & resource plan | Done — see ARCHITECTURE.md / DEPLOYMENT.md. |
| 2. Backend | Done and tested (195 tests in the Workers runtime). |
| 3. Frontend | Done; typechecked, built, driven by Playwright e2e and visual QA (light, dark, phone). BIZOMAT brand and design tokens since 2026-11-05. |
| 4. CI/CD | Workflows written (CI, preview, gated production with backup, smoke test, auto-rollback). Inert until Cloudflare is configured. |
| 5. Cloudflare provisioning & deployment | **Preview live** at https://workos-platform-preview.kevinjogincom.workers.dev (provisioned and published by the `publish-cloudflare.yml` workflow). Production not yet provisioned. |

## Required from the owner

1. **New private repository.** Create `workos-platform` (private) and push this branch to it, or approve keeping it in the current repository. The build session could not create repositories.
2. **Cloudflare access.** Provide a scoped API token + account ID as GitHub secrets (DEPLOYMENT.md §2), then run `scripts/check-conflicts.sh` (read-only) and `scripts/provision.sh preview|production`, and paste the IDs into `wrangler.jsonc`.
3. **Google OAuth (optional).** Create the OAuth client with the redirect URIs in DEPLOYMENT.md and set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` as Worker secrets.
4. **Email provider (optional).** Needed for emailed invitations/notifications; until then invite links are copied manually.

## Feature checklist

Legend: ✅ implemented and covered by automated tests · 🟢 implemented and verified in the browser (e2e or visual QA) · ⚠️ implemented, limited verification · ⛔ blocked/not implemented

| Feature | Status |
| --- | --- |
| Signup/login/logout, sessions, CSRF, rate limiting, lockout, API tokens | ✅ 🟢 |
| Google OAuth provider | ⚠️ implemented; awaits credentials (state/disabled paths tested) |
| Workspaces, roles, invitations, teams, audit log, export | ✅ 🟢 |
| Boards CRUD, duplicate, archive/restore, delete, visibility, board members, defaults, templates | ✅ 🟢 |
| Groups (create, rename, colour, reorder, collapse, duplicate, archive, delete) | ✅ 🟢 |
| Items/subitems (create, inline edit, duplicate, move, archive, delete, bulk) | ✅ 🟢 |
| 25 column types, validation, required, safe type conversion, formulas | ✅ 🟢 |
| Drag & drop persistence (rows, groups, columns, kanban, calendar, gantt) | ✅ (API) 🟢 (table/kanban) |
| Table view: sort, filter (AND/OR), group-by, resize, hide, sticky headers, bulk select | ✅ 🟢 |
| Kanban, Calendar (month/week/day), Timeline/Gantt (deps, milestones), Chart, Workload, Form, Map, Files views | ✅ 🟢 |
| Item panel: updates, replies, mentions, files, subitems, activity, time, docs | ✅ 🟢 |
| Automations engine (triggers, conditions, actions, logs, retries, dedupe, loop prevention) + builder UI | ✅ ⚠️ (builder UI rendered, flows covered by API tests) |
| Notifications (all types), preferences, read/unread, deep links | ✅ 🟢 |
| Dashboards (11 widgets, live data, layout editing) | ✅ 🟢 |
| Documents (rich text, autosave, conflicts, history, comments, sharing, links) | ✅ 🟢 |
| Goals, My Work, My Day, weekly planning, favourites, recent, saved views | ✅ 🟢 |
| Folders (documents, boards, dashboards): nested, colourable, drag-to-file, sidebar grouping | ✅ 🟢 |
| Founder admin console (/admin): overview, users, live sessions, activity, projects, adoption, health, settings, CSV exports — see docs/ADMIN.md | ✅ 🟢 |
| Global search + saved filters | ✅ 🟢 |
| Integrations: webhook, Slack, Teams | ✅ ⚠️ (delivery bookkeeping tested; no real external endpoint used) |
| Integrations: Google Drive/Calendar/Gmail, GitHub | ⛔ shown as "requires setup" by design |
| Realtime board updates (Durable Object) | ⚠️ connection auth tested; live fan-out verified manually ("Live" badge), not asserted |
| Email delivery | ⛔ no provider configured |
| Cloudflare deployment | 🟢 preview published + smoke-tested; ⛔ production pending |

## Backlog (next)

1. Provision Cloudflare resources and run the first preview + production deployment.
2. Email provider adapter (e.g. Cloudflare Email Service or a transactional provider) for invitations and notification emails.
3. MFA (TOTP/WebAuthn).
4. Google Calendar / Drive adapters once OAuth credentials exist.
5. Realtime presence (who is viewing) and fan-out assertions in tests.
6. Item-level permissions and guest (external) access.
7. Internationalisation: locale is stored per user; extract UI strings.
8. Cloudflare Queues for high-volume automation fan-out.

## Known issues

- Wrangler prints a proxy warning in this build environment; harmless.
- The webhook-retry test triggers workerd "Uncaught (in promise)" log lines for the intentionally unreachable host; harmless.
- Calendar multi-day events repeat as bars per day (no single spanning bar).
- Map view uses an offline graticule (no coastline tiles) to keep CSP strict.
- Google sign-in is unavailable on per-branch preview alias URLs (Google requires exact redirect URIs).

## Test results (latest run, 2026-11-05)

| Suite | Result |
| --- | --- |
| `npm run lint` | pass |
| `npm run typecheck` (client + worker) | pass |
| `npm test` — 21 files in workerd | **195 / 195 passed** |
| `npm run test:e2e` — Playwright (desktop + mobile) | **9 / 9 passed** |
| `npm run build` | pass |
| Visual QA (1440px light/dark, 390px; sign-in, home, table, kanban, Gantt, dashboard, document, My Work, item panel, settings, founder console) | no page errors, no horizontal overflow |

## Deployment history

| Date | Environment | Version | Result |
| --- | --- | --- | --- |
| 2026-11-04 | preview | `96d83588-d62d-4d21-b5c2-b6fe02f794ae` (commit 9caec2e) | Success — new Worker `workos-platform-preview`, D1 `workos-platform-preview-db` (36733ff4-5842-4274-a7f9-a0cdd8de2f3b), KV `workos-platform-preview-cache` (129d5d6f69784d91bb67088713ed8364), R2 `workos-platform-preview-files`; migrations applied; 10/10 smoke checks passed |
| 2026-11-04 | preview (serves work.kevos.com) | `1a97c9f6-58c6-434a-b09d-e91b67b94064` (commit 905f174) | Founder console + analytics. Live DB backed up, migration 0004 rehearsed on a copy of live data (row counts unchanged), applied, deployed; 14/14 smoke checks passed; audit confirmed 2 users / 2 workspaces / 2 boards / 2 items preserved and kevin@kevos.com = founder |
| — | production | — | Not deployed: awaiting preview validation |
