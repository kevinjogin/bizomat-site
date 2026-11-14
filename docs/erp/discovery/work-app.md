# Discovery: the work application (`apps/work`)

Read-only discovery for the ERP architecture assessment, 13 Nov 2026. Source: the repository at the commit checked out
for this work (`dbc61282`, "Docs: Finance Stage 1"). Every statement points to the file it comes from. Nothing in the
application was changed. Paths are relative to `apps/work/` unless they start with `docs/`, `infrastructure/` or another
top-level folder.

## 0. Key facts

| Topic | Fact |
| --- | --- |
| What it is | One Hono app plus one React SPA. It serves four products under four paths of bizomat.ai: `/tasks` (Project Management and task management), `/crm` (Customer Relationship Management), `/finance` (Finance), `/company` (company accounts and the BIZOMAT sign-in provider). |
| Runtimes | The same Worker code runs on Cloudflare Workers (`src/worker/index.ts`) and on Node 22 with `node:sqlite` (`src/node/server.ts`). Production today is Node on the Fly app `bizomat`, Machine group `work` (shared-cpu-1x, 512 MB, volume `work_data` 3 GB, `fly.website.toml`). Nothing is deployed on Cloudflare (`CLAUDE.md`). |
| Database | One SQLite database for all four products: D1 on Cloudflare, `/data/work/db.sqlite` on Node. 15 migrations, 144 application tables (61 without prefix, 32 `crm_*`, 38 `fin_*`, 11 `co_*`, 2 `id_*`), 194 indexes, 6 triggers (all on the Finance ledger). |
| Tenancy | Each tool has its own tenant: Project Management `workspaces`, CRM `crm_orgs`, Finance `fin_orgs`, Company `co_companies`. A company links at most one of each (`co_tools`). |
| Identity | One `users` table, one session cookie written for all four paths, one CSRF token. Personal API tokens (`wos_` prefix) work across all four products. |
| Permissions | Four separate role models, each checked on the server: Project Management (workspace role, project level and capabilities, task grants), CRM (6 roles, per-module scopes), Finance (6 roles, per-module scopes, approvals), Company (3 roles plus a role per tool). Platform admins are separate (`platform_admins`). |
| Integration | Company links (`src/worker/company/links.ts`), role and department sync (`sync.ts`), CRM activity to Project Management task, Finance quote events on the CRM deal timeline, the company control centre totals, the BIZOMAT ID provider. |

## 1. Architecture

### 1.1 One app, four mounts

| Path on bizomat.ai | Product | Server code | Screens | Constant (`src/worker/mount.ts`) |
| --- | --- | --- | --- | --- |
| `/tasks` | Project Management (and task management) | `src/worker/routes/`, `src/worker/services/` | `src/client/pages/`, `src/client/board/` | `MOUNT` |
| `/crm` | Customer Relationship Management | `src/worker/crm/` | `src/client/crm/` | `CRM_MOUNT` |
| `/finance` | Finance | `src/worker/fin/` (API at `/api/fin`) | `src/client/fin/` | `FIN_MOUNT` |
| `/company` | Company accounts, control centre, BIZOMAT sign-in | `src/worker/company/` | `src/client/company/` | `COMPANY_MOUNT` |

Routing to the app happens outside it:

- On Fly, the edge proxy sends `/tasks`, `/crm`, `/finance` and `/company` to the work process
  (`infrastructure/proxy/routes.mjs`: `TASKS_PATHS`, `CRM_PATHS`, `FINANCE_PATHS`, `COMPANY_PATHS`, line 166).
- On Cloudflare, the website Worker sends the same four paths to the `TASKS` service binding (`src/worker.ts`, lines
  67 to 73 at the repository root).
- Without a mount (for example `work.kevos.com`) the app answers at the root of its host.

Server code size, for scale (lines of TypeScript): `src/worker/routes` 7,595; `services` 9,693; `crm` 5,474; `fin`
8,348; `company` 2,618; `src/node` 3,235; `src/shared` 5,306. Client: `fin` 13,855; `board` 7,995; `pages` 6,344; `crm`
5,477; `admin` 4,053; `company` 1,793. Tests: 46 files in `test/` (suites and helpers, run in workerd and on Node),
17 files and 2 folders in `test-node/`, 7 Playwright specs in `e2e/`.

### 1.2 Runtimes and entry points

| | Cloudflare Worker | Node (production today) |
| --- | --- | --- |
| Entry | `src/worker/index.ts` (default export `fetch` and `scheduled`; exports the `BoardRoom` Durable Object) | `src/node/server.ts` -> `startServer()` in `src/node/runtime.ts` |
| Config | `wrangler.jsonc` (envs `development`, `preview`, `production`, `bizomat`) | Environment variables, `src/node/config.ts` (`configFromEnv`), passed through `infrastructure/fly/entrypoint.sh` (role `work`) |
| Request handling | Workers runtime | `node:http` server; every request goes through the Worker's own `fetch(request, env, ctx)` (`runtime.ts`, `createRuntime().fetch`) |
| `DB` | D1 | `NodeD1Database` over `node:sqlite` (`src/node/bindings/d1.ts`), file `db.sqlite` |
| `FILES` | R2 bucket | `NodeR2Bucket` (`src/node/bindings/r2.ts`) over `FileStore` (`src/node/store/file-store.ts`): bodies in `files/<bucket>/<aa>/<bb>/<sha256(key)>.<version>`, index in `runtime.sqlite` |
| `CACHE` | KV namespace | `NodeKVNamespace` (`src/node/bindings/kv.ts`), table `kv_entries` in `runtime.sqlite` |
| `ASSETS` | Workers Static Assets, `dist/client`, `run_worker_first: true` | `StaticAssets` (`src/node/assets.ts`), `WORK_STATIC_DIR` |
| `BOARD_ROOMS` | Durable Object `BoardRoom` (`src/worker/realtime/board-room.ts`) | In-process `BoardHub` (`src/node/realtime.ts`) |
| Cron | `triggers.crons: ["*/15 * * * *"]` | `QuarterHourScheduler` (`src/node/scheduler.ts`): minutes 0, 15, 30, 45 UTC; skips a slot while the previous run is still going; no catch-up |
| Data folder | n/a | `WORK_DATA_DIR` (`/data/work` on Fly): `db.sqlite`, `runtime.sqlite`, `files/`, `settings.key`, `server.lock`, `pre-migration-backups/` (`src/node/store/layout.ts`) |

The Node D1 binding copies D1's behaviour, not `node:sqlite`'s defaults (`src/node/bindings/d1.ts` header, checked
against Miniflare in `test-node/d1-parity.test.ts`): every call is one transaction, `batch()` is atomic, `BEGIN` and
`COMMIT` are refused, only D1's PRAGMA allow-list runs. `node:sqlite` is synchronous: a statement runs to completion
before any other JavaScript runs. The database uses WAL with `synchronous=FULL` and enforced foreign keys
(`src/node/store/sqlite.ts`). Startup runs `PRAGMA quick_check` and refuses a damaged file (`runtime.ts`).

### 1.3 Request path

1. `src/worker/index.ts` `fetch`: `mountOf(url)` finds the mount (`/tasks`, `/crm`, `/finance`, `/company` or none).
2. Pages asked for on another host answer 301 to `CANONICAL_URL` (`canonicalRedirect`, `crmCanonicalRedirect` in
   `mount.ts`). `/api/` keeps working on every host.
3. `unmount()` takes the mount off the path. The Hono app sees `/api/...` and `/login` exactly as on a host of its own.
   `env.BASE_PATH` carries the mount.
4. `createApp()` (`src/worker/app.ts`) routes the request.
5. `withSecurityHeaders()` adds CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, COOP and `Cache-Control: no-store` on
   `/api/` (`app.ts`, `applySecurityHeaders`). No CORS headers; preflights to `/api/*` answer 403.
6. `remount()` puts the mount back on `Location` headers and writes every `Set-Cookie` with `Path=/` once per mount
   (`cookieForMounts`), so one sign-in sets the cookie for `/tasks`, `/crm`, `/finance` and `/company`.
7. API failures are counted per day (`apiFailureMetric`, `bumpMetric` into `analytics_daily`).

### 1.4 Mounts, base path and the session carry

- Every HTML page gets `<base href="/tasks/">` (or `/crm/`, `/finance/`, `/company/`) as the first element of its head
  (`withBaseHref`, `mount.ts`). On Cloudflare through `HTMLRewriter`; on Node by rewriting the small page text. The page
  title is set per product.
- The client reads its base from that tag (`src/client/lib/base.ts`, `BASE`) and picks the product from it
  (`src/client/lib/brand.ts`: `IS_CRM`, `IS_FINANCE`, `IS_COMPANY`). One SPA build serves all four products; CRM,
  Finance and Company code are lazily loaded chunks (`src/client/App.tsx`).
- Session carry: a CRM, Finance or Company page with no cookie and no marker cookie is sent once to
  `/tasks/api/crm-carry` or `/tasks/api/app-carry` (`app.ts`, `carry`). With a valid session the cookie is rewritten for
  every path and the browser returns; without one, it goes to that product's `/login`. A 60-second marker cookie
  (`crm_carry`, `fin_carry`, `co_carry`) stops loops. The target must match the product's own path.

### 1.5 Structure of the Hono app (`src/worker/app.ts`)

| Order | Mounted at | What | Auth |
| --- | --- | --- | --- |
| 1 | `GET /api/health` | Database check | none |
| 2 | `/api/auth` | Sign-up, sign-in, sign-out, email confirmation, Google OAuth, Project Management invitations (`routes/auth.ts`) | mixed |
| 3 | `/api/crm-public` | CRM invitation preview, calendar feed (`crm/routes-orgs.ts`, `crm/routes-work.ts`) | token in URL |
| 4 | `/api/fin-public` | Finance invitation preview, customer document view, quote accept and decline (`fin/routes-orgs.ts`, `fin/routes-public.ts`) | token or signature in URL |
| 5 | `/api/company-public` | Company email confirmation, invitation preview (`company/routes.ts`) | token in URL |
| 6 | `/api/id` | BIZOMAT ID token and userinfo (`company/id-provider.ts`) | client secret or bearer |
| 7 | `/api/crm-carry`, `/api/app-carry` | Session carry | cookie |
| 8 | `/api/email-webhooks` | Brevo webhook (`routes/email.ts`) | provider token |
| 9 | `/api/*` (sub-app `api`) | Every Project Management route, plus `/api/crm`, `/api/fin`, `/api/company`, `/api/admin` | `requireAuth` |
| 10 | `/api/live` | WebSocket for boards (`routes/realtime.ts`) | own check |
| 11 | `GET *` | SPA: server-side redirect to `/login` for signed-out navigations; `/admin` returns 404 to non-admins | cookie |

### 1.6 Static assets and the SPA

- Built by Vite into `dist/client` (`package.json`, `build:client`). Served by `ASSETS`.
- `/assets/*` is cached for a year (`immutable`); HTML is `no-cache`. Finance's `/view/...` pages are `noindex`.
- Public SPA paths without a session: `/login`, `/signup`, `/invite/`, `/privacy`, `/verify-email`, `/join/` (CRM,
  Finance, Company), `/confirm-email` (Company), `/view/` (Finance) (`app.ts`, `publicPaths`).

### 1.7 Scheduled jobs (`runMaintenance`, `src/worker/index.ts`)

One cron every 15 minutes runs these steps in order, in one invocation. Each tool step is wrapped in `try`; a failure is
recorded in the result and the next step runs.

| Step | Code | What |
| --- | --- | --- |
| 1 | `services/automations.ts` `runScheduledAutomations` | Project Management scheduled automations (date arrived, recurring) |
| 2 | `retryFailedRuns` | Retries failed automation runs with backoff |
| 3 | `notifyDueDates` | Due-soon and overdue task notifications (deduplicated) |
| 4 | `crm/automations.ts` `runCrmScheduled` | CRM scheduled automations (overdue activities, deals near close); bounded to 1,000 automations, 300 records each (`docs/crm/README.md`) |
| 5 | `fin/scheduled.ts` `runFinanceScheduled` | Recurring transactions, invoices and bills (200 due rows a run, up to 5 catch-ups each); once an hour: alerts for every workspace (up to 2,000 `fin_orgs`), monthly summary, scheduled reports (50 a run) into Documents |
| 6 | `company/routes.ts` `recheckPendingAbns` | Up to 5 ABNs looked up on the ABR, only with `ABR_GUID` |
| 7 | `services/email/outbox.ts` `processOutbox` | Up to 100 queued emails handed to Brevo |
| 8 | one `DB.batch` | Retention: end expired sessions, clear ended token hashes, drop IPs after 30 days, delete ended sessions after 365 days, errors after 90 days, old OAuth states and rate-limit rows, read CRM and Finance notifications after 180 days, CRM automation runs after 180 days, email bodies after 30 days; writes `system_kv.last_maintenance` |

On Node, `runtime.scheduled()` also purges expired KV entries and temporary upload files.

### 1.8 Email outbox

- Table `email_outbox` (migration 0006), shared by every product. Each message has a unique `idempotency_key`, a
  priority (0 critical, 1 normal) and a status (`queued`, `sending`, `sent`, `delivered`, `deferred`, `failed`,
  `bounced`, `blocked`, `suppressed`, `skipped`) (`services/email/outbox.ts`).
- Sent through Brevo (`services/email/provider.ts`). The Brevo key is set in the founder console and stored encrypted
  with `SETTINGS_ENCRYPTION_KEY` (`services/email/settings.ts`), or given as `BREVO_API_KEY`.
- Daily cap `EMAIL_DAILY_LIMIT` (default 250) plus `EMAIL_CRITICAL_RESERVE` (default 40) for invitations and security
  messages. Over the cap, messages wait for the next UTC day.
- Up to 8 attempts with backoff from 1 minute to 12 hours. A row stuck in `sending` is never resent automatically.
- Bodies holding a secret link (`sensitive = 1`) are cleared once handed over. Other bodies are cleared after 30 days.
- Templates (`services/email/templates.ts`): Project Management invitations, assignments, reminders, mentions,
  membership, permission changes, report ready, `verify_email`, `crm_invitation`, `crm_notification`,
  `fin_invitation`, `fin_notification`, `fin_document`, `company_invitation`, `company_email`, `test`.
- `email_events` stores provider events; `email_suppressions` blocks addresses that bounced or complained.

### 1.9 File storage

One `FILES` binding for all products. Key prefixes:

| Product | Key | Code |
| --- | --- | --- |
| Project Management | `ws/<workspace>/boards/<board>/<id>` (task files), `ws/<workspace>/docs/<doc>/<id>`, `ws/<workspace>/logo-<id>`, `users/<user>/avatar-<id>` | `routes/files.ts` |
| Project Management reports | `reports/<workspace>/<board>/<id>/snapshot.json` and `report.<ext>` | `routes/reports.ts` |
| CRM | `crm/<org>/<entity>/<record>/<id>`, `crm/<org>/logo-<id>`, contact photos and company logos | `crm/routes-work.ts`, `crm/routes-orgs.ts`, `crm/index.ts` |
| Finance | `fin/<org>/files/<id>`, `fin/<org>/logo-<id>` | `fin/routes-files.ts`, `fin/routes-orgs.ts`, `fin/scheduled.ts` |

- Uploads are checked by extension allow-list and magic bytes; 25 MB cap, 5 MB for images (`routes/files.ts`,
  `validateUpload`, reused by the CRM and Finance).
- Every download checks the caller's access to the record first.
- On Node, a put writes a new version file, fsyncs, then switches the index in one SQLite transaction
  (`file-store.ts` header). Keys never become file paths.

### 1.10 Realtime

- Only Project Management boards have realtime. `GET /api/live/boards/:id` upgrades to a WebSocket after the Origin
  check, authentication, the password-reset check and the board permission (`routes/realtime.ts`).
- On Cloudflare the socket is handed to the `BoardRoom` Durable Object (hibernatable WebSockets), keyed by board id.
  The object only relays server events (`realtime/board-room.ts`). Clients refetch on events.
- On Node the in-process `BoardHub` plays the same role (`src/node/realtime.ts`). It only works within one process.
- Callers: `services/item-ops.ts`, `routes/boards.ts`, `routes/access.ts`, `routes/files.ts` (`broadcast`).
- The CRM and Finance have no realtime. Their notification counts poll every 60 seconds
  (`src/client/crm/CrmApp.tsx` line 174, `src/client/fin/FinApp.tsx` line 255).

### 1.11 KV (`CACHE`)

Used only for the sign-up MX lookup cache (`services/signup-guard.ts`) and a health probe (`routes/admin.ts`). KV is
never used for security decisions (`ARCHITECTURE.md`, decision 3).

### 1.12 Configuration and secrets (`src/worker/env.ts`)

| Variable | Use |
| --- | --- |
| `ENVIRONMENT`, `APP_NAME`, `APP_URL`, `CANONICAL_URL` | Environment and addresses |
| `ALLOW_SIGNUP` | Open sign-up (`true` in production: `fly.website.toml`, `WORK_ALLOW_SIGNUP`) |
| `SESSION_TTL_HOURS` | Session length (72 in production) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in (off in production: `fly.website.toml` comment, lines 57 to 58) |
| `EMAIL_*`, `BREVO_*`, `APP_BASE_URL` | Email |
| `SETTINGS_ENCRYPTION_KEY` | Encrypts console secrets; signs Finance online links. On Node: a random `settings.key` file in the data folder when not set (`runtime.ts`, `settingsKey`) |
| `ABR_GUID` | ABR lookups for company registration |
| `BIZOMAT_ID_CLIENTS` | Clients of the BIZOMAT ID provider |

Finding: on Node, `configFromEnv` builds the Worker's variables from a fixed list (`src/node/config.ts`, `vars` and
`EMAIL_VARS`). `ABR_GUID` and `BIZOMAT_ID_CLIENTS` are not in that list, and the entrypoint's `work` allow-list
(`infrastructure/fly/entrypoint.sh`, lines 200 to 226) does not map them either. As the code stands, setting them as
Fly secrets would not reach the app on Node. On Cloudflare they are read from `env` directly.

## 2. Routes

All authenticated paths below are under `/api` and are reached as `/<mount>/api/...` from the browser. The API is the
same under every mount (for example `/crm/api/fin/...` works); the client calls its own mount.

### 2.1 Public routes (no session)

| Path | What |
| --- | --- |
| `GET /api/health` | Database check |
| `GET /api/auth/config`, `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/verify-email`, `POST /api/auth/verify-email/resend`, `GET /api/auth/me` | Accounts (`routes/auth.ts`) |
| `GET /api/auth/oauth/:provider/start`, `GET /api/auth/oauth/:provider/callback` | Google OIDC |
| `GET /api/auth/invitations/:token` | Project Management invitation preview |
| `/api/crm-public/invitations/:token`, `/api/crm-public/calendar/:file` | CRM invitation preview, private iCalendar feed |
| `/api/fin-public/invitations/:token` | Finance invitation preview |
| `GET /api/fin-public/view/:kind/:id`, `GET .../pdf`, `POST /api/fin-public/view/quote/:id/accept`, `.../decline` | Customer document page (signed link) |
| `POST /api/company-public/confirm-email`, `GET /api/company-public/invitations/:token` | Company email confirmation and invitation preview |
| `POST /api/id/token`, `GET /api/id/userinfo` | BIZOMAT ID provider |
| `POST /api/email-webhooks/brevo` | Brevo events |

### 2.2 Project Management API (`src/worker/routes/*.ts`)

| Group | Paths | Covers |
| --- | --- | --- |
| Workspaces | `/workspaces`, `/workspaces/:ws`, `/workspaces/:ws/teams`, `/audit`, `/admin/overview`, `/export`, `/activity` | Organisations, teams, audit, JSON export (`workos-export-v1`) |
| Members | `/workspaces/:ws/members`, `/members/directory`, `/members/:userId`, `/suspend`, `/invitations`, `/me/invitations`, `/audit-events` | Roles, suspension, invitations with project or task grants (`routes/org.ts`) |
| Access | `/boards/:id/access`, `/boards/:id/project`, `/items/:id/access`, `/items/:id/assignable`, `/items/:id/context`, `/workspaces/:ws/shared-tasks` | Project and task permissions (`routes/access.ts`) |
| Boards | `/workspaces/:ws/boards`, `/boards/:id` (+ duplicate, save-as-template, archive, restore, members, activity), `/groups/:id`, `/columns/:id`, `/views/:id` | Projects, groups, columns, views (`routes/boards.ts`) |
| Items | `/boards/:id/items`, `/boards/:id/items/bulk`, `/items/:id` (+ move, duplicate, archive, restore, activity, updates), `/updates/:id`, `/items/:id/time/*`, `/time/:id`, `/views/:id/submit` | Tasks, subitems, comments, time tracking, form submissions (`routes/items.ts`) |
| Files | `/files`, `/files/:id`, `/boards/:id/files`, `/users/:id/avatar`, `/workspaces/:ws/logo` | Attachments |
| Me | `/me`, `/me/password`, `/me/sessions`, `/me/identities`, `/me/tokens`, `/me/notification-preferences`, `/workspaces/:ws/favourites`, `/recents`, `/my-work`, `/planner`, `/planner/:id`, `/me/timer`, `/heartbeat` | Profile, security, API tokens, My Work, planner (`routes/me.ts`) |
| Notifications | `/notifications`, `/notifications/:id/read`, `/notifications/read-all` | In-app notifications |
| Dashboards | `/workspaces/:ws/dashboards`, `/dashboards/:id` (+ widgets, data, duplicate, archive), `/widgets/:id`, `/boards/:id/chart` | Dashboards and widgets |
| Documents | `/workspaces/:ws/documents`, `/documents/:id` (+ versions, restore, members, comments, duplicate, archive), `/document-comments/:id` | Rich-text documents |
| Goals | `/workspaces/:ws/goals`, `/goals/:id` | Goals |
| Search | `POST /workspaces/:ws/search`, `/saved-filters` | Boards, items, subitems, documents, comments, users |
| Automations | `/boards/:id/automations`, `/workspaces/:ws/automations`, `/automations/:id`, `/runs`, `/run` | Board automations |
| Integrations | `/integrations/providers`, `/workspaces/:ws/integrations`, `/integrations/:id` (+ test, deliveries) | Webhook, Slack, Teams |
| Templates, folders | `/workspaces/:ws/templates`, `/workspaces/:ws/folders`, `/folders/:id` | Board templates, folders |
| Project finance | `/finance/currencies`, `/workspaces/:ws/finance`, `/workspaces/:ws/finance/columns/:id`, `/boards/:id/finance` | Currency and finance visibility settings, board money summaries (`routes/finance.ts`). Not the Finance product. |
| Reports | `/boards/:id/reports/preview`, `/boards/:id/reports`, `/reports/:id`, `/reports/:id/download/:format` | Immutable project reports (PDF, XLSX, HTML, CSV) |
| Project controls | `/boards/:id/schedule` (+ settings, calendar, apply), `/items/:id/schedule`, `/items/:id/progress`, `/items/:id/costs`, `/boards/:id/links`, `/links/:id`, `/boards/:id/baselines` (+ compare), `/boards/:id/evm`, `/boards/:id/controls` | CPM schedule, dependencies, calendars, baselines, earned value (`routes/schedule.ts`) |
| Email (workspace) | `/workspaces/:ws/email`, `/email/test`, `/email/:id/retry` | Workspace email log |

### 2.3 CRM API (`/api/crm`, `src/worker/crm/index.ts`)

Every organisation route is `/api/crm/orgs/:org/...` and starts with `requireOrg` (`crm/access.ts`).

| Group | Paths | File |
| --- | --- | --- |
| Organisations and people | `/orgs`, `/orgs/:org`, `/logo`, `/members`, `/members/:userId`, `/leave`, `/transfer`, `/invitations` (+ resend), `/invitations/:token/accept`, `/decline`, `/me/invitations/:id/decline`, `/teams`, `/permissions/:role`, `/audit`, `/me/notification-prefs` | `routes-orgs.ts` |
| Records (per type: `leads`, `contacts`, `companies`, `deals`, `activities`) | `/orgs/:org/<type>` (list, create), `/<type>/bulk`, `/<type>/export`, `/<type>/import` (not deals or activities), `/<type>/:id` (get, patch, delete), `/restore`, `/archive`, `/tags` | `routes-records.ts` |
| Record actions | `/duplicates`, `/leads/:id/score`, `/leads/:id/convert-preview`, `/leads/:id/convert`, `/pipelines/:pid/board`, `/deals/:id/move`, `/close`, `/history`, `/items`, `/contacts`, `/companies/:id/contacts`, `/:kind/:id/deals`, `/:kind/:id/activities` | `routes-records.ts` |
| Configuration | `/pipelines`, `/products`, `/tags`, `/custom-fields`, `/views`, `/email-templates` | `routes-config.ts` |
| Work | `/notes`, `/files`, `/timeline/:entity/:id`, `/notifications`, `/notifications/unread`, `/search`, `/emails` (log), `/activities/:id/ics`, `/calendar-feed`, `/project-targets`, `/activities/:id/project-task` | `routes-work.ts` |
| Insights | `/dashboard`, `/reports`, `/reports/:key` | `routes-insights.ts` |
| Automations | `/automations`, `/automations/:id/enabled`, `/automation-runs` | `routes-automations.ts` |
| Images | `/contacts/:id/avatar`, `/companies/:id/logo` | `index.ts` |
| Integrations | `/integrations` (mailbox status) | `index.ts`, `mailbox.ts` |

### 2.4 Finance API (`/api/fin`, `src/worker/fin/index.ts`)

Every workspace route is `/api/fin/orgs/:org/...` and starts with `requireOrg` (`fin/access.ts`).

| Group | Paths | File |
| --- | --- | --- |
| Workspaces and people | `/orgs`, `/orgs/:org`, `/logo`, `/members`, `/leave`, `/transfer`, `/invitations` (+ resend, accept, decline), `/permissions/:role`, `/notifications`, `/me/unread`, `/me/notification-prefs`, `/audit` | `routes-orgs.ts` |
| Setup and ledger | `/accounts` (+ archive, opening-balance), `/tax-codes`, `/tracking`, `/contacts` (+ import), `/templates` (+ preview), `/rules`, `/numbering/:kind`, `/lock`, `/journals`, `/journals/:id/reverse` | `routes-setup.ts` |
| Money | `/transactions` (+ duplicates, bulk, submit, approve, reject, void, reconciled), `/suggest`, `/history/:type/:id` | `routes-money.ts` |
| Banking | `/accounts/:id/statement/preview`, `/statement/import`, `/statement`, `/statement-lines/:lineId/match`, `/create`, `/ignore`, `/unmatch`, `/accounts/:id/reconcile` | `routes-banking.ts` |
| Documents (invoice, bill, purchase order, expense claim) | `/docs` (+ submit, approve, reject, void, payments, payments/:pid/void, convert, sent, pdf), `/docs/preview` | `routes-docs.ts` |
| Sales | `/quotes` (+ preview, sent, accept, decline, cancel, duplicate, invoice, pdf, versions/:v/pdf), `/credit-notes` (+ from-invoice, preview, approve, void, allocations, refunds, pdf), `/<quotes or docs or credit-notes>/:id/link` (create, withdraw), `/.../:id/email` | `routes-sales.ts` |
| Planning | `/budgets` (+ lines, from-actuals), `/goals`, `/recurring` (+ run), `/report-schedules` | `routes-plan.ts` |
| Files | `/files` (+ download, versions) | `routes-files.ts` |
| Reports | `/reports`, `/reports/:key`, `/dashboard` | `routes-reports.ts` |

### 2.5 Company API (`/api/company`, `src/worker/company/routes.ts`)

| Group | Paths |
| --- | --- |
| Registration | `GET /mine`, `POST /check`, `POST /companies` |
| Invitations | `POST /invitations/:token/accept`, `/decline` |
| One company (`/c/:company`) | `GET /`, `PATCH /`, `DELETE /`, `/email/send-confirmation`, `/abn/recheck`, `/members`, `/members/:userId`, `/leave`, `/transfer`, `/invitations`, `/tools`, `/tools/:app`, `/activity`, `/projects` |
| Departments (`/c/:company/departments`) | list, create, patch, `/:id/members`, `/:id/archive`, `/:id/restore` (`departments.ts`) |
| Overview (`/c/:company/overview`) | Control centre totals (`overview.ts`, `summary.ts`) |
| Links (`/links`) | `GET /crm/:org/companies/:id`, `POST .../customer`, `GET /crm/:org/deals/:id`, `POST .../invoice`, `POST .../quote`, `POST .../project`, `GET /finance/:org/crm-customers`, `POST /finance/:org/crm-customers/:id`, `GET /projects/:board`, `POST /projects/:board/finance` (`links.ts`) |
| ID consent (`/id`) | `GET /client`, `POST /authorize` (`id-provider.ts`) |

### 2.6 Platform admin API (`/api/admin`, `requirePlatformAdmin`)

| Group | Paths | File |
| --- | --- | --- |
| Founder console | `/me`, `/overview`, `/users`, `/users/:id`, `/sessions`, `/activity`, `/lookups`, `/projects`, `/adoption`, `/health`, `/settings`, `/admins`, `/users/:id/password`, `/security-reset`, `/export/*.csv` | `routes/admin.ts` |
| Email and sign-up | `/email`, `/email/*`, `/signup-protection`, `/users/:id/confirm-email` | `routes/admin-email.ts`, `routes/admin-signup.ts` |
| CRM console (`/admin/crm`) | `/overview`, `/orgs`, `/orgs/:id`, `/restore`, `/transfer`, `/users`, `/activity`, `/health` | `routes/admin-products.ts` |
| Finance console (`/admin/fin`) | `/overview`, `/workspaces`, `/workspaces/:id`, `/restore`, `/transfer`, `/users`, `/activity`, `/health` | `routes/admin-products.ts` |

### 2.7 SPA route tables

Project Management (`src/client/App.tsx`): `/login`, `/signup`, `/invite/:token`, `/verify-email`, `/privacy`,
`/admin/*` (founder console, `src/client/admin/AdminApp.tsx`: users, sessions, activity, projects, adoption, health,
email, signup, settings), `/`, `/welcome`, `/invitations`, and `/w/:wsId/*` with `home`, `my-work`, `my-day`, `inbox`,
`notifications`, `workspaces`, `boards`, `boards/:boardId`, `boards/:boardId/views/:viewId`, `tasks/:itemId`,
`favourites`, `recent`, `dashboards`, `dashboards/:dashboardId`, `docs`, `docs/:docId`, `goals`, `templates`,
`automations`, `integrations`, `search`, `settings/:tab`.

CRM (`IS_CRM` in `App.tsx`, then `src/client/crm/CrmApp.tsx`): `/login`, `/signup`, `/verify-email`, `/privacy`,
`/join/:token`, `/admin/*` (CRM console), `/`, `/start`, and `/o/:orgId/*` with `overview`, `leads`, `leads/:id`,
`contacts`, `contacts/:id`, `companies`, `companies/:id`, `deals`, `deals/:id`, `activities`, `activities/:id`, `tasks`,
`calendar`, `reports/:key`, `automations`, `team`, `settings/:tab`, `search`, `notifications`.

Finance (`IS_FINANCE`, then `src/client/fin/FinApp.tsx`): `/login`, `/signup`, `/verify-email`, `/privacy`,
`/join/:token`, `/view/:kind/:id` (customer page, public), `/admin/*` (Finance console), `/`, `/start`, and
`/o/:orgId/*` with `dashboard`, `transactions`, `transactions/:id`, `banking`, `banking/:accountId`, `quotes`,
`quotes/:id`, `credit-notes`, `credit-notes/:id`, `invoices`, `invoices/:id`, `bills`, `bills/:id`, `purchase-orders`,
`purchase-orders/:id`, `expense-claims`, `expense-claims/:id`, `contacts`, `contacts/:id`, `reports`, `reports/:key`,
`budgets`, `budgets/:id`, `goals`, `recurring`, `documents`, `accounting/:tab`, `team`, `settings/:tab`,
`notifications`.

Company (`IS_COMPANY`, then `src/client/company/CompanyApp.tsx`): `/login`, `/signup`, `/verify-email`, `/privacy`,
`/join/:token`, `/confirm-email`, `/`, `/new` (registration), `/authorize` (BIZOMAT ID consent), and
`/c/:companyId/*` with `overview`, `departments`, `people`, `tools`, `projects`, `activity`, `settings`.

## 3. Database

### 3.1 Migrations (`migrations/`)

| File | What it does |
| --- | --- |
| `0001_initial.sql` | 39 tables: identity, workspaces, boards, groups, columns, items, views, updates, attachments, logs, favourites, dashboards, documents, goals, automations, notifications, time and planner entries, integrations, `audit_log` |
| `0002_kevos_brand.sql` | Data only: recolours workspaces with the old default colour |
| `0003_folders.sql` | `folders`; `folder_id` on documents, boards, dashboards |
| `0004_founder_admin.sql` | `platform_admins`, `user_activity_events`, `user_daily_activity`, `analytics_daily`, `app_errors`, `system_kv`; columns on `users` and `sessions`; backfills; founder grant |
| `0005_password_reset_required.sql` | `users.password_reset_required` |
| `0006_platform_upgrade.sql` | Rebuilds `workspace_members` and `invitations` to widen their role CHECKs; adds `board_permissions`, `item_permissions`, `audit_events`, `email_outbox`, `email_events`, `email_suppressions`, `reports`; currency columns on workspaces and boards |
| `0007_signup_protection.sql` | `users.email_verified_at`, `email_verifications` |
| `0008_project_controls.sql` | Task keys on boards and items; `task_schedules`, `task_links`, `project_calendars`, `project_baselines`, `baseline_tasks`, `task_progress_entries`, `task_cost_entries` |
| `0009_group_descriptions.sql` | `groups.description` |
| `0010_crm.sql` | 32 `crm_*` tables |
| `0011_finance.sql` | 30 `fin_*` tables and 6 ledger triggers |
| `0012_super_admin.sql` | Data only: founder grant |
| `0013_company.sql` | 8 `co_*` tables and 2 `id_*` tables |
| `0014_company_links.sql` | 3 `co_*` link tables |
| `0015_finance_sales.sql` | 8 `fin_*` tables (quotes, credit notes); new columns on `fin_docs`, `fin_doc_lines`, `fin_doc_templates` |

Conventions (`DATABASE.md`, migration headers): ids are random URL-safe text; timestamps are integer milliseconds UTC;
calendar dates are `YYYY-MM-DD` text. CRM and Finance money is integer minor units of the tenant's currency. Every
migration since 0006 states it is additive and that the previous code keeps working on the new schema.

### 3.2 Identity and platform tables (unprefixed, 16)

| Table | Purpose and links |
| --- | --- |
| `users` | Accounts: email (unique, case-insensitive), name, password hash (null for Google-only), lockout fields, `disabled_at`, `email_verified_at`, `password_reset_required`, login counters, preferences |
| `user_identities` | External logins (provider, subject) -> `users` |
| `sessions` | Session token hash, CSRF token, provider, user agent, IP, expiry, activity, end reason -> `users` |
| `oauth_states` | Google OAuth state and PKCE verifier |
| `api_tokens` | Personal API tokens: hash, prefix, expiry, revocation -> `users` |
| `rate_limits` | Fixed-window counters (key, window, count) |
| `email_verifications` | Email confirmation links (hash only, 24 hours) -> `users` |
| `platform_admins` | Platform roles `founder` or `admin` -> `users` |
| `user_activity_events` | Product events (ids only) |
| `user_daily_activity` | One row per user per UTC day |
| `analytics_daily` | Daily counters without identifiers |
| `app_errors` | Sanitised server errors (90 days) |
| `system_kv` | Small system state: last maintenance run, sign-up policy, analytics start |
| `email_outbox` | Every email of every product (`workspace_id` optional) |
| `email_events` | Provider delivery events |
| `email_suppressions` | Addresses no longer mailed |

### 3.3 Project Management tables (unprefixed, 45)

Workspace level:

| Table | Purpose and links |
| --- | --- |
| `workspaces` | The tenant (an "organisation" on screen): name, colour, logo, settings, `default_currency`, soft delete |
| `workspace_members` | (workspace, user) with role `owner`, `admin`, `project_manager`, `member`, `viewer`, `guest` and status `active` or `suspended` |
| `invitations` | Email invitations with role, token hash, `grants_json` (project or task access on acceptance) |
| `teams`, `team_members` | Teams (also written by company departments) |
| `folders` | Nested folders for documents, boards, dashboards (scope CHECK) |
| `favourites`, `recents`, `saved_filters` | Per-person shortcuts and saved searches |
| `notifications`, `notification_preferences` | In-app notifications (unique `dedupe_key`) and per-type in-app and email choices |
| `integrations`, `integration_deliveries` | Webhook, Slack and Teams connections and their delivery log |
| `activity_log` | Every change to a task's columns with old and new value (used to rebuild past states for reports) |
| `audit_log` | Security and admin audit (all products' auth events use it too) |
| `audit_events` | Permanent append-only audit with before and after JSON, no foreign keys |

Projects and tasks (a project is a board):

| Table | Purpose and links |
| --- | --- |
| `boards` | Projects: kind `board`, `personal` or `template`; visibility `workspace` or `private`; currency, start date, manager, `task_prefix`, `task_seq`, folder, archive |
| `board_members` | Board role `owner`, `editor`, `viewer` |
| `board_permissions` | Per person per project: `denied` and seven capability overrides |
| `groups` | Board sections, ordered, with description |
| `columns` | Board columns: type from the column registry, settings JSON |
| `items` | Tasks and subitems (`parent_item_id`): `values_json` (all column values, including people and dates), `search_text`, `task_key` (unique per workspace), completion, archive |
| `item_permissions` | Access to one task (and its subitems) without the project |
| `views` | Board views (shared or personal) |
| `updates` | Comments and replies on a task |
| `attachments` | File records (scope `item`, `document`, `avatar`, `logo`) with storage key |
| `time_entries` | Timer and manual time per task and person |
| `planner_entries` | My Day planner: a task on a person's day |
| `automations`, `automation_runs` | Board automations; runs keyed by unique `event_key`, retries, depth |

Documents, dashboards, goals:

| Table | Purpose |
| --- | --- |
| `documents`, `document_members`, `document_versions`, `document_comments` | Rich-text documents (ProseMirror JSON, sanitised), sharing, versions, comments |
| `dashboards`, `dashboard_widgets` | Dashboards over boards; 11 widget types (`routes/dashboards.ts`, `WIDGET_TYPES`) |
| `goals` | Goals with manual or board-based progress, nested |

Project controls and reports:

| Table | Purpose |
| --- | --- |
| `task_schedules` | Duration, constraints, actuals, percent complete, earning method, planned value profile per task |
| `task_links` | Dependencies FS, SS, FF, SF with lag (CHECK no self-link, unique pair) |
| `project_calendars` | Working calendars per workspace or board |
| `project_baselines`, `baseline_tasks` | Approved, numbered, insert-only baselines and their task copies (no foreign key to `items`) |
| `task_progress_entries` | Dated progress records |
| `task_cost_entries` | Dated actual costs (amount as exact decimal text, currency) |
| `reports` | Finalised project reports: snapshot key and SHA-256, files, version per board |

### 3.4 CRM tables (`crm_*`, 32, migration 0010)

Every table carries `org_id`. Links between CRM records are composite foreign keys `(org_id, x_id) -> table(org_id,
id)`.

| Table | Purpose and links |
| --- | --- |
| `crm_orgs` | The tenant: name, details, currency (default AUD), time zone, settings JSON (lists, scoring), soft delete |
| `crm_members` | (org, user) with role; exactly one owner (unique partial index) |
| `crm_invitations` | Invitations (hash only, 14 days) |
| `crm_role_permissions` | Overrides per configurable role and module (JSON) |
| `crm_teams`, `crm_team_members` | Teams with a lead; members must be org members (composite FK to `crm_members`) |
| `crm_companies` | Customer companies: details, status, owner, custom fields JSON, search text |
| `crm_contacts` | People: emails and phones JSON, company (FK), owner, follow-up date, origin lead |
| `crm_leads` | Leads: status (free text from settings), score, estimated value; FKs to the contact, company and deal it became |
| `crm_pipelines`, `crm_stages` | Pipelines and stages (probability CHECK 0 to 100) |
| `crm_deals` | Deals: pipeline, stage (FK pair that forces the stage into the pipeline), value, currency, status `open`, `won`, `lost`, company |
| `crm_deal_contacts` | Contacts on a deal with role |
| `crm_products`, `crm_deal_items` | Product list and deal lines (quantity in thousandths, discount in basis points) |
| `crm_deal_stage_history` | Every stage or status change with time in stage |
| `crm_activities` | Calls, meetings, tasks and so on: type (free text), assignee, due, status CHECK, links to contact, company, deal, lead; `pm_workspace_id` and `pm_item_id` for the Project Management task |
| `crm_notes` | Notes on exactly one record (CHECK) with mentions |
| `crm_files` | Documents on exactly one record (CHECK), versions, storage key |
| `crm_events` | Timeline history, insert-only (also written by Finance, type `finance_quote`) |
| `crm_audit_log` | Insert-only audit, no foreign key |
| `crm_custom_fields` | Custom fields per entity (11 types, CHECK) |
| `crm_tags`, `crm_record_tags` | Tags and their use (entity CHECK) |
| `crm_saved_views` | Saved list views, private or shared |
| `crm_notifications`, `crm_notification_prefs` | Notifications (unique per user and `dedupe_key`) and preferences |
| `crm_automations`, `crm_automation_runs` | Automations and runs (unique `event_key`) |
| `crm_email_templates` | Email templates |
| `crm_calendar_feeds` | Private iCalendar feed tokens (hash only) |
| `crm_mail_connections` | Mailbox connections (empty: no provider configured) |

### 3.5 Finance tables (`fin_*`, 38, migrations 0011 and 0015)

Every table carries `org_id`. Links between Finance records are composite foreign keys. Links that can point several
ways (a journal's source, a statement line's match, a file's parent, a quote's invoice) are plain columns written by the
server.

| Table | Purpose and links |
| --- | --- |
| `fin_orgs` | The tenant: kind `personal`, `household`, `business`; currency (AUD); country; time zone; financial year start month; GST registration, basis, period, BAS method; legal name; ABN; `lock_date`; settings JSON |
| `fin_members` | (org, user) with role; exactly one owner |
| `fin_invitations` | Invitations (hash only) |
| `fin_role_permissions` | Overrides per role and module |
| `fin_counters` | Last number per document kind |
| `fin_tax_codes` | Tax codes: rate in basis points, direction, BAS labels JSON |
| `fin_accounts` | Chart of accounts: type CHECK (`asset`, `liability`, `equity`, `revenue`, `expense`), subtype, one level of parent, code unique per org, system key (ar, ap, gst, claims, retained, opening, rounding) |
| `fin_tracking` | Departments, projects, cost centres (kind CHECK) |
| `fin_contacts` | Customers and suppliers: kind, terms, ABN, defaults |
| `fin_journals` | General ledger journals: number unique per org, date, `source_type` CHECK, `source_id`, status `draft` or `posted`, reversal pointers |
| `fin_journal_lines` | One-sided lines (CHECK debit or credit), tax amount, contact, department, project, cost centre, person |
| `fin_transactions`, `fin_transaction_lines` | Money in, money out, transfers with split lines; status `draft`, `submitted`, `posted`, `void`; journal and void journal |
| `fin_statement_imports`, `fin_statement_lines` | Imported bank statements (CSV, OFX, QIF) and lines with dedupe key and match (`matched_type` CHECK `transaction` or `payment`) |
| `fin_reconciliations` | Completed reconciliations |
| `fin_rules` | Categorisation rules |
| `fin_doc_templates` | Document templates (layout, font, titles, terms, signature, remittance) |
| `fin_docs`, `fin_doc_lines` | Invoices, bills, purchase orders, expense claims (`kind` CHECK); status CHECK; totals; `amount_paid <= total`; quote link; online link nonce |
| `fin_payments` | Recorded payments against a document, with journal and void journal |
| `fin_quotes`, `fin_quote_lines`, `fin_quote_versions`, `fin_quote_events` | Quotes, lines (optional lines), sent snapshots, history; `crm_deal_id` plain column |
| `fin_credit_notes`, `fin_credit_note_lines`, `fin_credit_allocations`, `fin_credit_refunds` | Credit notes, lines, credit applied to invoices, refunds (CHECK `allocated + refunded <= total`) |
| `fin_recurring` | Recurring transaction, invoice or bill templates and schedule |
| `fin_budgets`, `fin_budget_lines` | Monthly budgets by account and tracking (1 to 36 months) |
| `fin_goals` | Savings goals |
| `fin_files` | Documents with folder, parent (CHECK `none`, `transaction`, `doc`, `journal`, `contact`), versions |
| `fin_report_schedules` | Monthly or quarterly reports into Documents |
| `fin_notifications`, `fin_notification_prefs` | Notifications and preferences |
| `fin_audit_log` | Insert-only audit, no foreign key |

### 3.6 Company and ID tables (`co_*` 11, `id_*` 2, migrations 0013 and 0014)

| Table | Purpose and links |
| --- | --- |
| `co_companies` | The company: kind `business` or `individual`, legal name, `country` CHECK `AU` only, ABN and ACN (format CHECKs, one company per ABN), ABR fields, email, phone and kind, address with state CHECK and postcode, settings, suspension, soft delete |
| `co_members` | (company, user) with company role `owner`, `admin`, `member` (one owner) and a role per tool: `tasks_role`, `crm_role`, `fin_role` (each CHECKed against that tool's roles, null for no access) |
| `co_invitations` | Invitations carrying company role, tool roles and department ids |
| `co_tools` | The tools a company runs: `app` CHECK (`tasks`, `crm`, `finance`), `ref_id`; one per app per company; each tool in at most one company |
| `co_departments` | Nested departments (`parent_id`, composite FK in the same company), head, and the ids they map to: `pm_team_id`, `crm_team_id`, `fin_tracking_id` |
| `co_department_members` | Department members (must be company members) |
| `co_email_confirmations` | Company email confirmation links |
| `co_audit` | The company's activity log |
| `co_customer_links` | CRM company <-> Finance contact (one each way per company) |
| `co_deal_links` | CRM deal -> Finance draft invoice and Project Management board |
| `co_project_links` | Project Management board -> Finance tracking project, with budget |
| `id_auth_codes` | BIZOMAT ID authorization codes (hash, PKCE challenge, 10 minutes, single use) |
| `id_access_tokens` | BIZOMAT ID access tokens (hash, 1 hour) |

### 3.7 Triggers and constraints that matter when extending the schema

Triggers (all six in `0011_finance.sql`, each on one line for the data tools):

| Trigger | Rule |
| --- | --- |
| `fin_journal_post_balanced` | Posting needs two or more lines with debits equal to credits |
| `fin_journal_post_locked` | Nothing dated on or before `fin_orgs.lock_date` can be posted |
| `fin_journal_posted_frozen` | A posted journal keeps date, org, number, status, source and reversal link; only `reversed_by_id` may be set once |
| `fin_journal_posted_no_delete` | A posted journal cannot be deleted |
| `fin_journal_lines_posted_no_update`, `fin_journal_lines_posted_no_delete` | Lines of a posted journal cannot change |

Posting mechanism: `journalStmts()` in `src/worker/fin/ledger.ts` inserts the journal as `draft` (number
`MAX(number)+1` per org in the same statement), inserts its lines, then updates the status to `posted`, all in one
batch. The server validates first (`validateJournal`); the triggers are the second line. No trigger guards INSERT,
so data tools can load posted rows.

CHECK constraints that fix the list of values (a new value needs a table rebuild in SQLite):

| Table.column | Allowed values | Note |
| --- | --- | --- |
| `fin_journals.source_type` | `manual`, `transaction`, `invoice`, `bill`, `expense_claim`, `payment`, `opening`, `reversal` | Credit notes already post as `invoice` and refunds as `payment` because of it (`docs/finance/README.md`) |
| `fin_docs.kind` | `invoice`, `bill`, `purchase_order`, `expense_claim` | Quotes and credit notes got their own tables for this reason (0015 header) |
| `fin_docs.status` | `draft`, `submitted`, `approved`, `part_paid`, `paid`, `billed`, `void` | |
| `fin_statement_lines.matched_type` | `transaction`, `payment` | Credit refunds cannot be matched to statement lines yet (Finance README, "Known gap") |
| `fin_files.parent_type` | `none`, `transaction`, `doc`, `journal`, `contact` | Quotes and credit notes are not in the list |
| `fin_accounts.type`, `fin_tracking.kind`, `fin_recurring.kind`, `fin_transactions.kind`, `fin_orgs.kind` | fixed lists | |
| `co_tools.app` | `tasks`, `crm`, `finance` | A fourth tool needs a rebuild of `co_tools` |
| `co_members.*_role`, `co_invitations.*_role` | each tool's role list | One column per tool; a new tool needs new columns |
| `co_companies.country` | `AU` | |
| `workspace_members.role`, `invitations.role` | widened once by rebuild in 0006 | That rebuild was safe because no table references either one (0006 header) |
| `boards.kind`, `boards.visibility`, `attachments.scope`, `folders.scope` | fixed lists | |
| `crm_members.role`, `crm_deals.status`, `crm_activities.status`, `crm_notes.kind`, `crm_files.kind`, `crm_custom_fields.entity` and `.type`, `crm_record_tags.entity`, `crm_saved_views.entity` | fixed lists | CRM lead statuses, sources and activity types are free text driven by settings |

Other structural rules:

- Composite foreign keys `(org_id, id)` everywhere in CRM and Finance; each referenced table has `UNIQUE (org_id, id)`.
- Unique partial indexes: one owner per tenant (`crm_members_one_owner`, `fin_members_one_owner`,
  `co_members_one_owner`); one company per ABN; one task key per workspace; document numbers per org and kind.
- Insert-only by convention (no trigger): `audit_events`, `project_baselines`, `baseline_tasks`, `crm_events`,
  `crm_audit_log`, `fin_audit_log`. The 0008 header says baselines use no trigger because the data move copies plain
  rows.
- Foreign keys point one way only ("parents first"). The data tool refuses tables that refer to each other in a circle
  (`scripts/migrate/lib/d1-sql.mjs`, line 252). Back-pointers (for example `crm_contacts.lead_id`) are plain columns.
- Tested here in an in-memory copy of the migrations: deleting a `fin_orgs` row that has a posted journal is refused by
  `fin_journal_lines_posted_no_delete` (the cascade fires the trigger). Finance workspaces can only be soft-deleted
  while the triggers exist.

### 3.8 How migrations are applied

- Cloudflare: `wrangler d1 migrations apply DB` (`package.json`: `db:migrate:local`, `db:migrate:preview`,
  `db:migrate:production`). The production plan records a D1 Time Travel bookmark first (`DATABASE.md`).
- Node: at start, `createRuntime()` (`src/node/runtime.ts`) reads the migrations embedded in the build
  (`src/node/build.mjs`, `__WORK_MIGRATIONS__`), compares with `d1_migrations` (`src/node/store/migrations.ts`), and
  when an existing database has pending ones, writes `VACUUM INTO pre-migration-backups/db-before-<name>-<time>.sqlite`
  (newest five kept). Each migration and its `d1_migrations` row run in one `BEGIN IMMEDIATE` transaction; a failure
  rolls back and stops the start.
- `d1_migrations` is created byte for byte as wrangler does, so a Node database can go back to D1.
  `expectedSchema()` and `diffSchema()` compare a database with what the migrations make (used by the data tools).
- Data moves: `scripts/migrate/to-fly.mjs` and `to-cloudflare.mjs`. The Cloudflare tool requires the latest migration
  and the exact schema, writes statements under D1's 100,000-byte limit, loads parents first, and drops and recreates
  the guard triggers inside `clear.sql` (`to-cloudflare.mjs` header, `lib/d1-sql.mjs`).
- Migrations must stay backward compatible with the previous code (expand, migrate, contract) so a rollback never meets
  an incompatible schema (`DATABASE.md`).

## 4. Tenancy

### 4.1 The tenant of each tool

| Tool | Tenant table | Membership table | Roles | Kinds |
| --- | --- | --- | --- | --- |
| Project Management | `workspaces` | `workspace_members` (plus `board_members`, `board_permissions`, `item_permissions`) | owner, admin, project_manager, member, viewer, guest | one kind |
| CRM | `crm_orgs` | `crm_members` | owner, admin, manager, sales, member, viewer | one kind |
| Finance | `fin_orgs` | `fin_members` | owner, admin, accountant, finance_manager, contributor, viewer | personal, household, business |
| Company | `co_companies` | `co_members` | owner, admin, member (plus a role per tool) | business, individual |

- A user can belong to any number of tenants in each tool. Each tool has its own switcher.
- Sign-up without an invitation creates a Project Management workspace named "<first name>'s workspace"
  (`routes/auth.ts`, `createWorkspaceStmts`). CRM and Finance tenants are created from their own Start pages or by
  company registration.
- A person may own at most ten companies and one company in their own name (`company/routes.ts`, `POST /companies`).
- Tenant ids travel in the URL (`/w/:wsId`, `/o/:orgId`, `/c/:companyId`). Non-members get 404 in every tool.

### 4.2 How the company layer joins the tools

```
                         co_companies (one company)
                                  |
          +-----------------------+-------------------------+
          | co_tools (app, ref_id), one per app             |
          v                       v                         v
     workspaces              crm_orgs                    fin_orgs (kind business only)
   (Project Mgmt)              (CRM)                       (Finance)
          ^                       ^                         ^
          | workspace_members     | crm_members             | fin_members
          +---- written from co_members.tasks_role / crm_role / fin_role (sync.ts) ----+

   co_departments (nested) -> teams + team_members   (Project Management)
                           -> crm_teams + crm_team_members, lead = head   (CRM)
                           -> fin_tracking kind 'department'   (Finance)

   co_customer_links: crm_companies.id <-> fin_contacts.id
   co_deal_links:     crm_deals.id -> fin_docs.id (draft invoice), boards.id (project)
   co_project_links:  boards.id -> fin_tracking.id (kind project) + budget
```

- Registration creates a workspace, a CRM organisation and a Finance business workspace in one batch, or links tools
  the owner already owns (`company/routes.ts`, lines 330 to 420; `assertLinkable`). Personal and household Finance
  workspaces are never linked.
- `co_members` holds the role in each tool; `memberToolStmts()` (`company/sync.ts`) upserts the tool's membership row
  (never changing an owner) or removes the person from the tool when the role is null, including Project Management
  board and task grants.
- People who joined a tool directly stay; the company lists them as "in a tool, not in the company".
- Closing a company leaves the tools and records as they are (`docs/company/README.md`).
- All cross-tool ids (`co_tools.ref_id`, every column of the three link tables, `co_departments.pm_team_id`,
  `crm_team_id`, `fin_tracking_id`, `crm_activities.pm_item_id`, `fin_quotes.crm_deal_id`) are plain text columns with
  no foreign key. Consistency is kept by the code (`links.ts` checks both sides on every request).

## 5. Authentication

| Area | How it works | Where |
| --- | --- | --- |
| Accounts | One `users` table for every product. Email unique, case-insensitive. | `migrations/0001_initial.sql` |
| Passwords | PBKDF2-SHA256, 100,000 iterations, per-user salt, NFKC, constant-time compare, dummy hash for unknown users; password rules in `passwordProblems` | `src/worker/auth/password.ts` |
| Lockout and limits | Login: 30 per IP and 10 per email per 15 minutes; account locked 15 minutes after 10 failures (423). Sign-up 10 per IP per hour. Counters in the `rate_limits` table. | `routes/auth.ts`, `auth/rate-limit.ts` |
| Sessions | 256-bit random token; only its SHA-256 is stored with a per-session CSRF token. TTL from `SESSION_TTL_HOURS`. `last_seen_at` touched at most every 5 minutes. | `auth/session.ts` |
| Cookie | `workos_sid` in development; `__Host-workos_sid` at a host root; `__Secure-workos_sid` under a mount. `HttpOnly`, `Secure`, `SameSite=Lax`. Written with `Path=/tasks`, `/crm`, `/finance` and `/company` by `remount()`. | `auth/session.ts`, `mount.ts` |
| Carry | `/api/crm-carry` and `/api/app-carry` copy an older `/tasks` cookie to the other paths (section 1.4). | `app.ts` |
| CSRF | Unsafe methods with a cookie session need `X-CSRF-Token` equal to the session's token, and an `Origin` matching the host or `APP_URL`. Login and sign-up check `Origin`. The client keeps the token from `/api/auth/me` or login and sends it (`src/client/lib/api.ts`). | `auth/session.ts` (`requireAuth`, `checkOrigin`) |
| API tokens | `Authorization: Bearer wos_<random>`; only the hash is stored; optional expiry up to 365 days; created only from an interactive session; no CSRF (no cookie). No scopes: a token acts as the user in every product (Project Management, CRM, Finance, Company). Refused by the admin API. | `auth/session.ts`, `routes/me.ts`, `services/platform-admin.ts` |
| Google | OIDC with PKCE and a state cookie, enabled when `GOOGLE_CLIENT_ID` and `_SECRET` are set; identities in `user_identities`; a verified Google email confirms the account's email. Off in production. | `auth/providers.ts`, `routes/auth.ts` |
| Email confirmation | New accounts confirm by a link (hash only, 24 hours, single use) while the policy asks for it and email can be sent (Brevo connected). Invited sign-ups count as confirmed. | `services/email-verification.ts` |
| Sign-up protection | Disposable domains blocked, MX records required (DNS over HTTPS), founder's block and allow lists, a hidden honeypot field. Policy in `system_kv`. Platform admins are never refused at sign-in. | `services/signup-guard.ts` |
| Forced password change | `users.password_reset_required`: every API call except changing the password and signing out answers 403 `PASSWORD_RESET_REQUIRED`; WebSockets refused. | `auth/session.ts` (`enforcePasswordReset`) |
| Disabled accounts | `users.disabled_at` ends session and token resolution. | `auth/session.ts` |
| BIZOMAT ID provider | OAuth 2.0 authorization code with PKCE S256 for configured clients only (`BIZOMAT_ID_CLIENTS`, exact redirect match). Consent page `/company/authorize`; `POST /api/company/id/authorize` issues a code (10 minutes, once); `POST /api/id/token` swaps it with the client secret and verifier for an opaque access token (1 hour); `GET /api/id/userinfo` returns `sub`, `email`, `email_verified`, `name` and the person's companies. No ID token, no refresh token, no discovery document. | `company/id-provider.ts` |
| Platform admins | `platform_admins` role `founder` or `admin`. `requirePlatformAdmin` accepts interactive sessions only, answers 404 to everyone else, rate-limits 600 a minute. The founder is granted by migrations 0004 and 0012 for a confirmed account. | `services/platform-admin.ts`, `app.ts` |

## 6. Permissions

### 6.1 Project Management (`src/shared/permissions.ts`, `src/worker/services/permissions.ts`, `services/access.ts`)

Three layers:

1. **Workspace role** (`workspace_members.role`, rank guest < viewer < member < project_manager < admin < owner).
   Suspended members count as non-members. `requireWorkspace(db, ws, user, min)` throws 404 for non-members and 403
   below `min`. Organisation-wide areas (documents, dashboards, goals, teams, templates, folders) ask for `viewer`, so
   guests see only what is shared with them.
2. **Project access** (a project is a board). `computeBoardAccess()`: owners and admins always `admin`; `denied` in
   `board_permissions` removes access; personal boards belong to their creator; private boards and guests need a
   `board_members` role; otherwise workspace viewers get `view` and others `edit`. Levels map to `view`, `edit`,
   `manage`. Seven capabilities (`viewFinance`, `editFinance`, `manageMembers`, `createTasks`, `assignTasks`,
   `deleteTasks`, `generateReports`) default from the level and the workspace's finance visibility (`all`, `editors`,
   `managers`) and can be switched per person (`board_permissions`), clamped by `resolveCaps()`. Checked by
   `requireBoard()` and `requireProject(db, board, user, levelOrCapability)`.
3. **Task access** (`item_permissions`): edit, update status, comment, upload, manage assignments, view finances on one
   task and its subitems. `requireTask()` merges project and task rights (`mergeTaskCaps`). `rightsForPatch()` and
   `assertPatchAllowed()` decide which rights a change needs.

Financial columns (currency columns and number columns marked financial) are stripped from responses for people
without `viewFinance` (`stripValues`, `hideFinanceInItems`, `financeHiddenBoards`). Documents use `requireDocument`
(`document_members` roles editor and viewer for private documents).

### 6.2 CRM (`src/shared/crm/roles.ts`, `src/worker/crm/access.ts`)

- `requireOrg(c)` loads the org and the caller's role (404 for non-members) and resolves permissions once per request.
- Record modules `leads`, `contacts`, `companies`, `deals`, `activities` have `view`, `edit`, `delete` as `all`, `own`
  or `none`, and `create`, `export`, `import` as on or off. "Own" means `owner_id` is the caller, or the caller created
  an unowned record; for activities, assigned to or created by the caller.
- Other modules: `reports` (view, export), `automations` (view, manage), `settings` (manage), `members` (invite,
  teams, manage).
- Defaults per role in `DEFAULT_PERMS`. Owner and admin are fixed. Manager, sales, member and viewer can be changed per
  org (`crm_role_permissions`). `resolvePerms()` ignores unknown values and clamps edit and delete to view.
- Server checks: `requirePerm`, `hasPerm`, `assertRecord` (404 if not visible, 403 if visible but not allowed),
  `scopeSql` (adds the scope condition to every list query), `assertMember` for owners and assignees.

### 6.3 Finance (`src/shared/fin/roles.ts`, `src/shared/fin/settings.ts`, `src/worker/fin/access.ts`)

- `requireOrg(c)` as in the CRM (404 for non-members), with the workspace kind and whether GST applies.
- Record modules `banking`, `sales`, `purchases`, `contacts`, `documents`: `view`, `edit`, `delete` as all, own or
  none ("own" = `created_by`, `uploaded_by` or the claimant); `create`, `approve` (post, approve, void, reverse),
  `import`, `export` on or off.
- Other modules: `accounting` (view, manage, journal, lock), `reports` (view, export), `budgets` (view, manage),
  `settings` (manage), `members` (invite, manage).
- Defaults by role and by workspace kind (`defaultPerms`): in personal and household workspaces contributors see all
  transactions, documents, reports and budgets. Overrides per role in `fin_role_permissions`, clamped by
  `resolvePerms()`.
- Approvals (`fin_orgs.settings_json`, `finSettings`): `transactions`, `bills`, `expenseClaims` default on for
  business workspaces, `invoices` off. A person without `approve` submits and waits; approvers are notified
  (`transactions.ts` `postsDirectly`, `docs.ts` `mayApprove`).
- Business-only features (invoices, bills, purchase orders, expense claims) are refused elsewhere by
  `requireBusiness()`. The period lock is enforced by the server (`assertOpenPeriod`) and by a trigger.
- Server checks: `requirePerm`, `hasPerm`, `assertRecord`, `scopeSql`.

### 6.4 Company (`src/worker/company/access.ts`, `overview.ts`)

- `requireCompany(c, min)`: 404 for non-members, 423 when suspended, 403 below `min` (`member` < `admin` < `owner`).
- Owner: link and unlink tools, transfer, close. Admin: people (not the owner), departments, invitations, details.
  Member: sees the company, its people and departments.
- Each person's access inside a tool is that tool's own role, written by `sync.ts`. The company never grants a right a
  tool's role does not give.
- Control centre figures are shown only to people who could see them in the tool: Project Management to the company
  owner and admins and to workspace owners, admins and project managers; CRM to company owner and admins and to roles
  that see every deal; Finance to the company owner and roles that may view reports. A department head sees their
  department's figures in every tool (owner's decision, `overview.ts` header).
- Department heads may change who is in their department and the ones under it (`departments.ts`).
- Links check both tools' permissions on every request (section 7.1).

### 6.5 Comparison

| | Project Management | CRM | Finance | Company |
| --- | --- | --- | --- | --- |
| Roles | 6 | 6 | 6 | 3 + one role per tool |
| Configurable per tenant | Per person per project (7 capabilities), per task grants | Per role and module | Per role and module, plus approval settings | No |
| Record scope | Board visibility and membership | all, own, none | all, own, none | n/a |
| Non-member answer | 404 | 404 | 404 | 404 |
| Server entry point | `requireWorkspace`, `requireBoard`, `requireProject`, `requireTask`, `requireDocument` | `requireOrg` + `assertRecord`, `scopeSql` | `requireOrg` + `assertRecord`, `scopeSql`, `requireBusiness` | `requireCompany` |

## 7. Integration points, notifications, audit, search, exports

### 7.1 Company links (`src/worker/company/links.ts`, `/api/company/links`)

| Link | Endpoint | Checks | Effect |
| --- | --- | --- | --- |
| One customer record | `POST /crm/:org/companies/:id/customer`; Finance side `GET /finance/:org/crm-customers`, `POST /finance/:org/crm-customers/:id` | CRM view of the company; Finance contacts view or create | Links or creates a `fin_contacts` row; `co_customer_links`. The CRM company shows open invoices and amount owed to people whose Finance role sees sales. |
| Won deal to invoice | `POST /crm/:org/deals/:id/invoice` | Deal must be won; same currency; Finance `sales.create` | Draft `fin_docs` invoice, one line, default sales account; once per deal; `co_deal_links.fin_invoice_id` |
| Deal to quote | `POST /crm/:org/deals/:id/quote` | Same currency, Finance `sales.create`, deal not lost | `fin_quotes` with `crm_deal_id`; the deal lists its quotes |
| Deal to project | `POST /crm/:org/deals/:id/project` | Project Management role member or above | New board from the blank template in the company's workspace; `co_deal_links.pm_board_id` |
| Project costs and budget | `GET /projects/:board`, `POST /projects/:board/finance` | Project view; Finance `accounting.manage` to link, `reports.view` to see figures | `fin_tracking` kind project and `co_project_links` with budget; income and costs read from posted journal lines |

A link works only when both records' tools belong to the same active company (`companyOf`).

### 7.2 Other cross-tool code paths

| From -> to | What | Where |
| --- | --- | --- |
| Company -> all tools | Memberships, roles, removals; departments as teams and tracking | `company/sync.ts` |
| Company <- all tools | Control centre totals read from `items`, `crm_deals`, `crm_leads`, `crm_activities`, `fin_journal_lines`, `fin_docs` | `company/summary.ts`, `overview.ts` |
| CRM -> Project Management | An activity becomes a task in a board the person can add tasks to (`requireProject(..., 'createTasks')`, `createItem`); `crm_activities.pm_workspace_id`, `pm_item_id`; `GET /api/crm/project-targets` lists boards | `crm/routes-work.ts` |
| Finance -> CRM | Each quote step writes a `crm_events` row (type `finance_quote`, no amounts) on the deal's timeline when both tools belong to one company | `fin/sales.ts` (`dealEventStmt`) |
| Any app -> this app | BIZOMAT ID sign-in (planned client: CAD Automation, change not made there) | `company/id-provider.ts` |
| All tools | Shared `users`, sessions, email outbox, file store, maintenance run | sections 1 and 5 |
| Client | Product switcher links and the "register a company" prompt | `src/client/components/layout/PlatformLinks.tsx`, `CompanyPrompt.tsx`, `src/client/lib/brand.ts` |

### 7.3 Notifications

| Tool | Tables | Types | Delivery |
| --- | --- | --- | --- |
| Project Management | `notifications`, `notification_preferences` | assignment, mention, comment, reply, status_change, due_soon, overdue, automation, invitation, invitation_accepted, project_membership, permission_change, report_generated (`src/shared/types.ts`) | In-app (per workspace), email per type (`services/notify.ts`) |
| CRM | `crm_notifications`, `crm_notification_prefs` | assignment, task, mention, overdue, due, deal, won_lost, invitation, automation (`crm/notify.ts`) | In-app (per org), email via the outbox |
| Finance | `fin_notifications`, `fin_notification_prefs` | approval, approved, invoice_due, bill_due, budget, summary, recurring, report, membership (`fin/util.ts`) | In-app (per workspace), email via the outbox |
| Company | none | Invitation and confirmation emails only | Email |

There is no shared inbox across tools; each app has its own bell.

### 7.4 Audit logs

| Tool | Tables | Notes |
| --- | --- | --- |
| Platform and auth | `audit_log` | Sign-ups, logins, refusals, admin actions (`services/audit.ts`) |
| Project Management | `audit_log` (workspace), `audit_events` (append-only, before and after), `activity_log` (column changes) | `services/audit.ts`, `routes/org.ts` |
| CRM | `crm_audit_log`, `crm_events` (timeline) | `crm/util.ts` |
| Finance | `fin_audit_log`, `fin_quote_events`; record history via `/history/:type/:id` | `fin/util.ts` (`auditStmt`) |
| Company | `co_audit` | `company/access.ts` (`coAuditStmt`) |
| Analytics | `user_activity_events`, `user_daily_activity`, `analytics_daily`, `app_errors` | `services/analytics.ts` |

### 7.5 Search

- Project Management: `POST /api/workspaces/:ws/search` over boards, items, subitems, documents, comments and users,
  with saved filters (`routes/search.ts`). Uses `search_text` and `LIKE`.
- CRM: `GET /api/crm/orgs/:org/search` over contacts, companies, leads, deals, activities and notes
  (`crm/routes-work.ts`); list filters on any field (`src/shared/crm/fields.ts`).
- Finance: `search` columns with `LIKE` in transactions, documents, contacts and files lists
  (`fin/routes-money.ts`, `routes-docs.ts`, `routes-setup.ts`, `routes-files.ts`).
- No full-text index (no FTS5 table in any migration). No search across tools.

### 7.6 Exports and imports

| Tool | Exports | Imports |
| --- | --- | --- |
| Project Management | Workspace JSON (`GET /workspaces/:ws/export`, admin, 10 an hour, format `workos-export-v1`); project reports in PDF, XLSX, HTML, CSV (`services/reports/pdf.ts`, `xlsx.ts`, `html.ts`) | Form view submissions |
| CRM | CSV per record type (10,000 rows, formulas neutralised); report CSV | CSV with column mapping and duplicate handling (leads, contacts, companies) |
| Finance | Report CSV and PDF; document PDFs | Bank statements (CSV, OFX, QIF: `src/shared/fin/statement.ts`); contacts CSV |
| Platform admin | Users, activity, summary CSV (`routes/admin.ts`) | n/a |

### 7.7 PDFs

- Finance documents: one renderer for quotes, invoices, credit notes, bills, purchase orders and expense claims
  (`src/worker/fin/document.ts`, `documentPdf`, pdf-lib with standard fonts). `render.ts` gathers template, logo and
  parties; the live preview posts the unsaved form to `.../preview` and gets the PDF back.
- Finance reports: `src/worker/fin/pdf.ts` (`reportPdf`).
- Project reports: `src/worker/services/reports/pdf.ts`.
- Finance online links: `/finance/view/<kind>/<id>?k=<HMAC>`, key derived from `SETTINGS_ENCRYPTION_KEY`; clearing the
  stored nonce withdraws every link (`fin/render.ts`). Without the key, links answer 503.

### 7.8 Outbound integrations

- Project Management: generic webhook, Slack and Teams incoming webhooks work; Google Drive, Google Calendar, Gmail and
  GitHub are listed as `requires_setup` (`services/integrations.ts`). Outbound HTTPS is checked (https only, no IP
  literals, host allow-lists for Slack and Teams, 10-second timeout). On Node, `src/node/outbound.ts` also refuses
  destinations whose DNS answers are private, loopback or link-local.
- CRM mailbox sync (Gmail, Microsoft 365): not configured; only the table and the integration layer exist
  (`crm/mailbox.ts`).
- Company: ABR JSON web service when `ABR_GUID` is set (`company/verify.ts`).
- Email: Brevo.

## 8. Feature inventory (what works today)

### 8.1 Project Management

- **Organisations (workspaces):** create, rename, colour, logo, description, delete (soft); switch; members with six
  roles; suspend and remove members; invitations by email with resend and withdraw, optional project or task grants;
  teams; audit trail; activity feed; admin overview; JSON export.
- **Projects (boards):** create from blank or five templates (project plan, sprint board, sales pipeline, content
  calendar, request intake); duplicate; save as template; archive and restore; private or shared; personal boards;
  folders; favourites and recents; project details (manager, start date, currency, task prefix).
- **Structure:** groups with colours and plain-text descriptions; 25 column types (text, long text, status, priority,
  person, people, date, timeline, number, currency, percentage, checkbox, tags, dropdown, link, email, phone, progress,
  files, formula, created, updated, dependency, rating, location) (`src/shared/columns.ts`); required columns; safe
  formula language (`src/shared/formula.ts`).
- **Views:** table, kanban, calendar, timeline (Gantt), chart, workload, form, map, files; shared and personal views;
  AND/OR filters (`src/shared/filters.ts`).
- **Project access:** per-person access level, "no access", seven capabilities, private projects.
- **Project controls:** permanent task keys; scheduling data; FS, SS, FF, SF dependencies with lag; working
  calendars; Critical Path Method schedule (`services/schedule/cpm.ts`) and applying its dates; approved baselines and
  comparison; dated progress and cost entries; earned value (PV, EV, AC, CV, SV, CPI, SPI, EAC) (`services/schedule/`).
- **Project finance:** organisation currency and finance visibility; financial columns; board money summaries per
  currency in exact integer arithmetic (`src/shared/finance.ts`, `money.ts`).
- **Reports:** inception to date, previous month, current month, custom range; sections chosen; commentary; immutable
  versions with stored snapshots; PDF, XLSX, HTML, CSV.
- **Dashboards:** dashboards over chosen boards with 11 widget types; duplicate, archive.
- **Documents:** rich-text documents with versions and restore, comments with resolution, private sharing, attachments,
  folders.
- **Goals:** goals with owners, status, manual or board-based progress, parent goals.
- **Automations:** triggers (item created, status changed, column changed, moved to group, update posted, date
  arrived, recurring) and actions (set value, set today, clear, notify, assign, move to group, create item, create
  subitem, archive, duplicate, send webhook); run history; retries; loop prevention.
- **Integrations:** webhook, Slack, Teams with delivery log and test.
- **Search:** workspace search and saved filters.
- **Realtime:** live board updates over WebSockets.

### 8.2 Task management (inside Project Management)

- Tasks and subitems with any column values; drag-and-drop ordering; move between groups and boards; duplicate;
  archive, restore, delete; bulk actions.
- Task page (`/w/:wsId/tasks/:itemId`) with context, activity history and updates (comments, replies, mentions,
  edits).
- Attachments (25 MB, checked by type and content).
- Assignment through person and people columns; assignable people limited to those with access.
- Task-only access for people outside the project (`item_permissions`), and the guest's "shared tasks" list.
- Time tracking: start and stop timer, manual entries, delete; current timer.
- My Work (assigned tasks across boards), My Day planner (tasks placed on days), Inbox and notifications, favourites,
  recents.
- Due-soon and overdue reminders (in-app and email).
- Notification preferences per type for in-app and email.

### 8.3 Customer Relationship Management

- **Organisations:** create (default pipeline and seven automations), details, logo, currency (fixed once deals exist),
  time zone; members and six roles; invitations; teams; ownership transfer; leave; delete (soft); audit trail.
- **Records:** contacts, companies, leads with multiple emails and phones, photos and logos, tags, 11 custom field
  types, duplicate warnings, archive, delete and restore.
- **Leads:** customisable statuses, explainable lead score, conversion to contact, company and deal in one step.
- **Pipelines and deals:** several pipelines, custom stages and probabilities, drag-and-drop board with won and lost
  zones, list view, products with quantity and discount, deal contacts, lost reasons, flags, weighted value, stage
  history.
- **Activities:** many types, assignment, due date and time, priority, outcome, lists (mine, today, overdue,
  upcoming, team, completed), calendar, tasks page, `.ics` download, private calendar feed.
- **Timeline, notes and documents:** unified timeline; notes, comments and meeting notes with mentions and pinning;
  documents with versions.
- **Dashboard and reports:** 11 reports (lead conversion, pipeline, revenue, trends, win-loss, performance, sources,
  activities, forecast, ageing, cycle) with chart, table and CSV (`crm/routes-insights.ts`).
- **Search, filters, views:** organisation search, filters on any field, configurable columns, bulk actions, built-in
  and saved views.
- **CSV:** import with mapping and duplicate handling; export.
- **Automations:** event and scheduled triggers; actions notify, create follow-up, set priority, flag deal, assign
  owner; run history.
- **Email:** templates; email written in the person's own mail program and logged as "logged".
- **Notifications:** in-app and email per type.
- **Links:** activity to Project Management task; company links (section 7.1).

### 8.4 Finance

- **Workspaces:** personal, household and business; switch; settings; logo; members, six roles, permissions;
  invitations; transfer; delete (soft).
- **Chart of accounts:** starting charts per kind; accounts and subcategories; codes; archive at zero; delete if
  unused; opening balances; tax codes with BAS labels; departments, projects, cost centres.
- **Ledger:** manual journals; reversal; period lock; every money record posts a balanced journal; database triggers.
- **Transactions:** receive, spend, transfer; splits; GST inclusive, exclusive or none; tracking; payee, contact,
  attachments; drafts, submission, approval, rejection; edit by reverse and repost; void; bulk actions; duplicate
  warnings; category suggestions from rules and history; change history.
- **Banking:** statement import (CSV with mapping, OFX, QIF) with duplicate detection; match, create, ignore, unmatch;
  rules; reconciliation against the statement balance.
- **Sales:** quotes (versions, online accept and decline, progress invoicing, duplicate, cancel, expiry); invoices;
  credit notes (from an invoice or alone, apply to invoices, refund, void); customers; document templates; numbering;
  secure online links; email with the link.
- **Purchases:** bills, purchase orders (to bill), expense claims; approvals; payments.
- **Payments:** recorded against documents, partial payments, overpayment refused, void.
- **Reports (from posted journals):** profit and loss, balance sheet, cash flow, general ledger, trial balance, account
  transactions, income and expenses by month, budget against actual, cash flow forecast, aged receivables, aged
  payables, GST and BAS worksheet (`fin/reports.ts`, `REPORTS`); CSV and PDF; scheduled monthly or quarterly.
- **Planning:** budgets (from last year's actuals with uplift), savings goals, recurring transactions, invoices and
  bills.
- **Documents:** upload, folders, attach to records, versions, search, download.
- **Dashboard and alerts:** income, expenses, cash, debts, receivables, payables, budget, upcoming payments, approvals
  waiting, statement lines to match, goals, trend; alerts for due and overdue invoices and bills, budgets, monthly
  summary.
- **Not built (stated in the product):** bank feeds, payment processing, BAS lodgement, payroll, multi-currency in one
  workspace, fixed assets, inventory (`docs/finance/README.md`).

### 8.5 Company accounts

- Registration as a business (ABN required) or an individual, with checks: ABN check digits (and the ABR when
  `ABR_GUID` is set), ACN, email (MX, disposable, confirmation link), Australian phone numbering plan, postcode by
  state (`company/verify.ts`).
- Creates or links one Project Management workspace, one CRM organisation and one Finance business workspace.
- People: company role and a role in each tool; invitations with tool roles and departments; role changes reach each
  tool; remove; leave; transfer of the company and every tool.
- Departments: nested, with a head; appear as teams and Finance departments; archive and restore.
- Control centre: totals per tool for the company and each department, by permission.
- Projects page: Project Management projects with Finance tracking and budget.
- Activity log; company checks page; email confirmation; closing the account.
- BIZOMAT sign-in for other applications (consent page, token, userinfo).

### 8.6 Platform administration

- Founder console at `/tasks/admin`: overview, users, sessions, activity, projects, adoption, system health, email
  (Brevo setup, test, process, link check), sign-up protection, settings, admins, password reset, security reset, CSV
  exports.
- CRM console at `/crm/admin` and Finance console at `/finance/admin`: counts and health per tenant, never record
  contents; restore a deleted tenant; hand over ownership (founder only).

## 9. Constraints and risks for adding ERP modules

**One database, one Machine.**

- All four products share one SQLite database, one file store and one process. In production that is one Fly Machine
  (shared-cpu-1x, 512 MB) with a 3 GB volume (`fly.website.toml`; auto-extend up to 20 GB per
  `docs/BIZOMAT-OPERATIONS.md`). `--ha=false`: the work group must never have two Machines, because each would get its
  own empty volume (`fly.website.toml`, line 22).
- `node:sqlite` is synchronous. Every query blocks the event loop for every product until it ends. A long Finance
  report or a large CRM export delays Project Management requests and WebSocket traffic on the same process.
- SQLite has one writer at a time. Every authenticated page view, rate-limited call, session touch and analytics counter
  also writes (`rate_limits`, `analytics_daily`, `sessions`, `user_daily_activity`).
- Machine replacement takes the app offline for 10 to 60 seconds per deploy (`fly.website.toml`, line 34 comment).
- Realtime on Node is in-process (`BoardHub`): it cannot span two processes.

**Cloudflare D1 (if the planned move happens).**

- D1 serialises queries per database. Cloudflare publishes per-database size caps, a statement size cap (the data tool
  keeps statements under 100,000 bytes, `lib/d1-sql.mjs`) and a cap on bound parameters per statement. These limits are
  not in this repository; check Cloudflare's current figures before sizing ERP data.
- 80 call sites build `IN (...)` lists with `placeholders()` (`src/worker/lib/util.ts`). One chunks at 90
  (`services/reports/build.ts`). The Node D1 binding does not emulate a bound-parameter cap, so a list that grows past
  D1's cap would fail only on Cloudflare. Not checked for real data sizes here.
- The Cloudflare `scheduled` handler runs the whole maintenance run in one invocation, subject to Workers CPU limits.

**Background work.**

- One 15-minute run does every tool's work in sequence (section 1.7). Finance's hourly alerts loop over up to 2,000
  workspaces one by one (`fin/scheduled.ts`); recurring records are capped at 200 a run. New modules that add
  scheduled work lengthen the same run. On Node a run that overlaps the next slot makes that slot skip.
- There are no queues. Event-driven work runs in `waitUntil` after the response.

**Schema extension.**

- Table prefixes: Project Management and platform tables have no prefix and use generic names (`items`, `groups`,
  `columns`, `views`, `reports`, `goals`, `teams`, `invitations`, `notifications`, `automations`, `documents`,
  `audit_log`). New modules would need their own prefix to avoid confusion with these. Existing prefixes: `crm_`,
  `fin_`, `co_`, `id_`.
- Fixed CHECK lists (section 3.7) cannot be widened without rebuilding the table. Rebuilding a table that other tables
  reference is harder: 0006 rebuilt two tables only because nothing referenced them. `fin_journals` is referenced by
  six tables and guarded by triggers; `fin_docs` by four. The Finance README records that `fin_journals.source_type`
  "cannot be widened without rebuilding the journal table".
- `co_tools.app` and the per-tool role columns of `co_members` and `co_invitations` assume exactly three tools.
- Foreign keys must point one way; the data tools refuse cycles. Triggers must be written on one line. Rows longer than
  one D1 statement cannot be appended to a table guarded by an UPDATE trigger (`lib/d1-sql.mjs`, line 185).
- Ledger triggers refuse a hard delete of any Finance workspace with posted journals (tested, section 3.7). Purging a
  tenant needs the triggers dropped.
- Migrations run inside one transaction at start on Node. A long data migration delays the start of all four
  products. A failed migration stops the start (the pre-migration copy is kept).

**Duplicated concepts across tools.**

- Customers: `crm_companies` and `crm_contacts` versus `fin_contacts`, joined only by `co_customer_links` for companies.
- Products and prices: `crm_products` only; Finance lines carry free-text item codes; no shared item master.
- Teams and departments: `teams`, `crm_teams`, `fin_tracking` (department), mirrored from `co_departments`.
- Invitations (4 tables), notifications (3 systems), audit logs (5 tables), role models (4).
- Money: CRM and Finance use integer minor units, one currency per tenant. Project Management keeps the entered decimal
  text in JSON and computes with BigInt at four decimal places (`src/shared/money.ts`); `task_cost_entries.amount` is
  decimal text. Currency is per tenant in CRM and Finance; per workspace or board in Project Management.
- Task assignees live inside `items.values_json` (person columns), not in a relational table, so resource or timesheet
  modules would read JSON.
- All cross-tool ids are plain columns without foreign keys (section 4.2).

**Security and identity.**

- API tokens are unscoped and work in every product with the user's full rights.
- Tenant ids are in URLs; isolation relies on `requireOrg`, `requireWorkspace`, `requireCompany` on every route plus
  composite foreign keys in CRM and Finance. Project Management tables use `workspace_id` without composite keys.
- `SETTINGS_ENCRYPTION_KEY` encrypts console secrets and signs Finance links. On Node it is a file in the data folder;
  losing or changing it breaks every Finance link and stored secret. On Cloudflare it must be set as a secret.
- `ABR_GUID` and `BIZOMAT_ID_CLIENTS` do not reach the app on Node as the configuration code stands (section 1.12).
- Resource and cookie names keep the old `workos` prefix (`ARCHITECTURE.md`, "Brand and naming").

**Product scope already fixed in code.**

- Company accounts are Australia only (`co_companies.country` CHECK); Finance tax logic is Australian GST and BAS
  (`src/shared/fin/tax.ts`); defaults are AUD.
- One currency per CRM organisation and per Finance workspace.
- Email is capped by the shared Brevo quota (250 a day by default plus a reserve of 40), shared by every product.
- No full-text search and no search across tools.
- No realtime in the CRM, Finance or Company.
