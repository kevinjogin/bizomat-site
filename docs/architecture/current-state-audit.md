# Project Management: current-state audit and upgrade plan

_12 Nov 2026. Branch `claude/gallant-mccarthy-eoyq46` of `kevinjogin/bizomat-site`, started from `d485514` (`main`)._

This records what the application was before the platform upgrade (organisations, permissions, finance, reports,
email, audit history), what was found while inspecting it, and how the upgrade was planned. The other documents in
`docs/architecture/`, `docs/email/`, `docs/deployment/` and `docs/testing/` describe the result.

## 1. Repository and production

| Item | Finding |
| --- | --- |
| Repository | `kevinjogin/bizomat-site` (from `git remote -v`), private, default branch `main` |
| Application | `apps/work/`: BIZOMAT Project Management (formerly KEVOS WorkOS). Other folders are the website (`src/`), CAD Automation (`apps/cad/`, a pinned copy of another repository, not touched) and infrastructure |
| Production | Fly.io app `bizomat`, region `syd`, three Machines: proxy (shared-cpu-1x, 256 MB), web (512 MB), work (512 MB). Volume `work_data` (3 GB) on work, daily snapshots kept 30 days (`fly.website.toml`) |
| Deployed commit | `d485514` (merge of #13), deployed 11 Nov 2026 05:44 UTC by GitHub Actions run 42967702937 "BIZOMAT deploy (bizomat)", success |
| Deploy path | `.github/workflows/bizomat-deploy.yml`: started by hand on `main` only (`confirm` = `DEPLOY`), secret `FLY_BIZOMAT_TOKEN`, preflight `.github/scripts/fly-preflight.py` refuses any change to Machines, `flyctl deploy --config fly.website.toml --ha=false`, then public checks. No push or merge deploys anything |
| Routing | `bizomat.ai/tasks/...` goes from the proxy to the work Machine; the app takes the `/tasks` prefix off itself (`src/worker/mount.ts`) |
| Health checks | proxy `/__proxy/health`, web `/healthz`, work `/api/health` (database check) |
| Staging | None exists. Creating one would add a Fly app or Machines, which the project rules forbid without the owner's approval. Verification is local (both runtimes, browser) and then the live checks after deploy |
| Secrets (names only) | Fly: `CF_ACCOUNT_ID`, `CF_AI_TOKEN`, `ANTHROPIC_API_KEY`, `TURNSTILE_SECRET_KEY`, `WORK_GOOGLE_CLIENT_*` (all optional). GitHub: `FLY_BIZOMAT_TOKEN`. No email secret existed. The entrypoint gives each role only its own settings (`infrastructure/fly/entrypoint.sh`) |

## 2. Technology stack

| Layer | Technology |
| --- | --- |
| API | Hono on the Cloudflare Workers API; the same code runs on Node 22 in production (`src/node/`, D1, R2, KV and the Durable Object replaced by SQLite, files, an in-process hub) |
| Client | React 19 single-page app, TanStack Query, React Router, Vite |
| Database | SQLite: Cloudflare D1 schema, on Fly `node:sqlite` in `/data/work/db.sqlite` (WAL, `synchronous=FULL`, integrity check at start) |
| Migrations | `apps/work/migrations/*.sql`, recorded in `d1_migrations` like wrangler; the Node server applies pending ones at start, each in one transaction |
| Files | R2 binding `FILES`; on Fly `/data/work/files/` indexed in `runtime.sqlite` |
| Tests | Vitest in workerd (207) and on Node (322), Playwright end to end (10 on each runtime), lint and three type checks |

## 3. What existed before the upgrade

| Area | State found |
| --- | --- |
| Accounts | Email and password (PBKDF2), sessions with CSRF, rate limits, lockout, API tokens, optional Google sign-in. Open sign-up on production (`WORK_ALLOW_SIGNUP=true`) without email verification |
| Organisations | "Workspaces": name, description, colour, logo, settings. Users can belong to several |
| Roles | `owner`, `admin`, `member`, `viewer` (CHECK constraint on `workspace_members.role`) |
| Invitations | Token hashed (SHA-256), 7 days, revoke. No email: the link was shown to the inviter. **Pending invitations were accepted automatically when someone signed up or signed in with the invited address.** Because sign-up does not verify email addresses, anyone could join an organisation by registering an invited address before its owner did |
| Project access | A project is a board. `board_members` (owner, editor, viewer), visibility `workspace` or `private`. Workspace boards gave every member edit and every viewer view. No per-person denial, no capabilities |
| Task access | None: access was all or nothing per board |
| Owners | `person` and `people` columns; assignees had to be organisation members only (not necessarily able to open the board) |
| Finance | `currency` column type with a code per column (default `USD`, set by the templates). Amounts stored as JSON numbers. Sums in floating point. No organisation or project currency, no permissions on financial data |
| Activity | `activity_log` records every change to a task's columns with the values before and after since the first version; deleted with a board. `audit_log` for organisation actions; `user_activity_events` for analytics |
| Notifications | In-app only, with per-type preferences (an email flag existed but nothing sent email) |
| Exports | Organisation JSON export (admins). No reports, no PDF or Excel |
| My Work / My Day | Assigned items on accessible boards |

## 4. Gaps against the brief, and decisions

1. **Invitation takeover (security).** Automatic acceptance by email address was removed. An invitation now joins
   only with its token (from the email or the shared link), for the signed-in address it was sent to, once.
   Signing up through the link passes the token. Tested both ways (`test/auth.test.ts`).
2. **New roles need a wider CHECK constraint.** SQLite cannot alter one, so migration 0006 rebuilds
   `workspace_members` and `invitations` (copying every row and column; nothing references either table). Verified on
   a populated database with foreign keys on, in one transaction, as the server applies it.
3. **No duplicate systems.** Organisations stay workspaces, projects stay boards, people stay `users`, project
   membership stays `board_members`. New tables only hold what had no home: per-person project overrides
   (`board_permissions`), task grants (`item_permissions`), the permanent audit trail (`audit_events`), email
   (`email_outbox`, `email_events`, `email_suppressions`) and saved reports (`reports`).
4. **Finance without assumptions.** Existing amounts are untouched. Existing currency columns keep their stored code
   but are marked unconfirmed until an administrator decides (keep, follow the project or organisation currency, or
   set another). Number columns such as a "Finance" column can be marked as money. New currency columns follow the
   project's or organisation's currency instead of assuming USD.
5. **Reports from history, not from today.** `activity_log` already holds every column change with before and after
   values since the first version, so past states are reconstructed from it. Where history is incomplete (a board
   with no recorded changes, a converted status column, deleted columns or tasks), the report says so.
6. **Email.** A provider abstraction with Brevo (`POST https://api.brevo.com/v3/smtp/email`, `api-key` header), an
   outbox with idempotency keys, a daily limit with a reserve for invitations, retries, suppression of bounced
   addresses, and an authenticated webhook. Without a key nothing is sent and invitations show their link, as before.
7. **Production data protection.** Additive migration; the server copies the database to
   `/data/work/pre-migration-backups/` before applying any migration; the deploy workflow requests a volume snapshot
   before deploying; Fly's daily snapshots remain. Rollback to the previous image works on the new schema.

## 5. Implementation order (lowest risk first)

1. Migration 0006 (additive), verified on a copy with data.
2. Central permission service (`src/worker/services/access.ts`, rules in `src/shared/permissions.ts`), then every
   route moved onto it; existing tests kept green after each step.
3. Invitations and membership (token-only acceptance, resend, suspend, roles).
4. Email service and templates.
5. Finance (decimal-safe money, currencies, finance roles, hiding).
6. Reports (builder, HTML, PDF, Excel, CSV, history).
7. Interface, then tests, documentation, deployment.

## 6. Baseline before any change

`npm test` 207 of 207, `npm run test:node` 322 of 322 (12 Nov 2026, this branch at `d485514`).
