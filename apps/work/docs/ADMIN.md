# Founder admin console (BIZOMAT Project Management)

**URL:** `https://work.kevos.com/admin` (served by the `workos-platform-preview` Worker, which `work.kevos.com` is attached to). The same backend is also to be served at `https://bizomat.ai/tasks/admin`.

## Who can open it

- Access is controlled by the `platform_admins` table (roles `founder` and `admin`), checked **on the server for every admin request** (`src/worker/services/platform-admin.ts`).
- Requirements: a signed-in **browser session** (API tokens are refused), a non-disabled account, and a `platform_admins` row.
- Everyone else gets **404** from `/api/admin/*` and from the `/admin` page itself; signed-out visitors are redirected to `/login`. The admin link in the profile menu only appears for admins, but hiding it is not what protects the data.
- There is no way to sign up as an admin. Workspace owners/admins have **no** platform-admin rights.

### How the founder account is authorised

Migration `0004_founder_admin.sql` grants `founder` to the account that **already** had the email `kevin@kevos.com` when the migration ran (verified by the read-only audit: registered 2026-11-04 04:05 UTC, the first account on the platform). Because email addresses are not verified at sign-up, a later sign-up with that address would **not** become an admin.

Other ways to manage admins:

- **Settings → Platform administrators** (founder only): grant `admin` to an existing account by email, or revoke it.
- **GitHub → Actions → "Admin operations"**: `grant-founder` / `revoke-admin` for a given email, `audit` (read-only status) and `backup`. Requires write access to the repository, so it is a strong, auditable path for recovery.

All grants and revocations are written to `audit_log`.

## What is tracked

| Signal | Where | Notes |
| --- | --- | --- |
| Registrations, logins, logouts | `user_activity_events`, `sessions`, `users.last_login_at/login_count` | Each sign-in creates a session row, kept as login history |
| Live activity | `sessions.last_activity_at` via `POST /api/heartbeat` | Sent at most once a minute from a **visible** tab with keyboard/pointer/scroll/touch input in the last 5 minutes |
| Daily activity (DAU/WAU/MAU) | `user_daily_activity` | One row per user per UTC day; updated by heartbeats and by any authenticated request (every 5 min at most) |
| Product events | `user_activity_events` | `user.registered`, `user.login`, `user.logout`, `workspace.created`, `project.created/updated/archived/deleted`, `task.created/updated/completed`, `member.invited`, `member.joined`, `settings.changed` — IDs and small flags only, never names, descriptions or comments |
| Anonymous visitors | `analytics_daily` (`pageview_anonymous`) | Daily totals only: no cookie, no identifier, no IP stored |
| API health | `analytics_daily` (`api_5xx`, `api_4xx`, `api_401`, `api_403`, `api_429`, `auth_login_failed`) and `app_errors` | Errors keep method, route pattern (ids replaced), status, error name and a one-line message with long tokens/emails masked; no stack traces |
| Device | parsed from the stored User-Agent at read time | Category (desktop/mobile/tablet), browser + major version, OS. No fingerprinting |

**Active now** = a valid (not ended, not expired) session whose last heartbeat is within 5 minutes. An unexpired login alone counts as *logged in*, not *active*.

**Projects** = boards (excluding templates). **Tasks** = items on those boards (including subitems). **Completed** = items whose status is a "done" label.

Historical data before the console existed was **backfilled from real records** (users, sessions that still existed, workspaces, boards, items, memberships, invitations, edit history) and is flagged `{"backfilled": true}`. The previous version deleted expired/revoked sessions, so login history before 2026-11-04 is incomplete.

## Retention (enforced by the 15-minute maintenance cron)

| Data | Kept |
| --- | --- |
| Activity events, daily activity, daily counters | Indefinitely |
| Sessions (login history) | 365 days after they end |
| Session token hashes | Removed as soon as the session ends |
| Session IP addresses | 30 days (never shown in the console) |
| Sanitised error records | 90 days |

All timestamps are stored as UTC epoch milliseconds; the console renders them in the viewer's local time zone.

## Security controls

- Server-side RBAC (`requirePlatformAdmin`) on every `/api/admin/*` route, plus the HTML guard for `/admin`.
- Existing session security: hashed session tokens, `HttpOnly`/`Secure`/`SameSite` cookies, CSRF token + Origin check on every mutation.
- Rate limits: 600 admin requests/minute per admin, 30 exports/hour per admin.
- Parameterised SQL; filter inputs validated with zod; LIKE wildcards escaped.
- CSV exports protect against spreadsheet formula injection and contain no password hashes, tokens or IPs.
- Audit log entries for user-detail views, exports and admin grants/revocations.
- Errors shown in the console are sanitised; no secrets or stack traces are exposed.

## Deployment safety

`publish-cloudflare.yml` now: records a D1 Time Travel restore point (bookmark in the job summary) → copies the live data onto the runner (never uploaded, deleted at the end) and **rehearses** pending migrations, aborting if core row counts change → applies migrations → deploys → smoke-tests (including the admin protections).

### Restoring a backup

Use the restore point a deploy or the `backup` operation recorded: `npx wrangler d1 time-travel restore <db>
--bookmark=<id> --env <env>` (or `--timestamp <ISO>` for any minute in the retention window). A database export made by
hand with `wrangler d1 export` stays on your own machine, encrypted, and is never committed or uploaded as a workflow
artifact. To import one: `node scripts/reorder-dump.mjs backup.sql restore.sql`, then import `restore.sql` into a
**new, empty** D1 database (`npx wrangler d1 execute <db> --remote --file restore.sql`) and point the Worker at it.
Never import over a live database.
