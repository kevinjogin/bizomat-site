# BIZOMAT data inventory

Every place the three products keep data today, what it contains, how it relates, and what the move to the single
BIZOMAT Fly.io app does with it. Compiled from the code on 5 Nov 2026 (`apps/cad/opensketch/*.py`,
`apps/work/migrations/*.sql`, `src/`). Nothing here comes from production data: counts of real records are taken
by the migration tooling at migration time (`docs/BIZOMAT-MIGRATION.md`).

## 1. Summary

| Product | Store | Where it is today | After the move | Migration |
| --- | --- | --- | --- | --- |
| Website and Resources | Static files built from Git (`src/content`, `public`) | Cloudflare Worker `throbbing-block-6c61` (kevos.com) | Built into the image, served by the `web` process | Nothing to migrate: rebuilt from Git |
| Website forms | No database. Messages go to Web3Forms (or Cloudflare Email when the Worker provider is chosen) | Third parties | Unchanged | None |
| Website AI search | No storage (questions are not stored) | Workers AI binding | Workers AI over REST (optional) | None |
| Project Management | Cloudflare D1 `workos-platform-preview-db` (serves work.kevos.com) | Cloudflare | `db.sqlite` on Fly volume `work_data` (`/data/work`) | D1 export, import, verify |
| Project Management files | Cloudflare R2 `workos-platform-preview-files` | Cloudflare | `files/` + `runtime.sqlite` index on `work_data` | Copy each referenced object with SHA-256 |
| Project Management cache | Cloudflare KV `workos-platform-preview-cache` (only a health probe) | Cloudflare | `runtime.sqlite` | None (no state) |
| Project Management realtime | Durable Object `BoardRoom` (no stored data) | Cloudflare | In-process hub | None |
| CAD Automation | Files in the data folder (`OPENSKETCH_DATA`) | Fly app `cados`, volume `opensketch_data` at `/data` | Fly app `bizomat`, volume `cad_data` at `/data/cad` | Byte-for-byte copy with a SHA-256 manifest |
| CAD Automation secret | Fly secret `OPENSKETCH_PASSWORD` | Fly app `cados` | Fly app `bizomat` (same value) | Owner sets it (values cannot be read back from Fly) |
| SOLIDWORKS models | The customer's own computer | Customer PC | Unchanged | Never moved |

Note: the Project Management production environment (`workos-platform-production-*`) was never provisioned
(`apps/work/docs/PROJECT_STATUS.md`); work.kevos.com is served by the **preview** Worker and its D1/R2.

## 2. Project Management (D1 schema, 46 tables)

IDs are random URL-safe strings (96 bits); timestamps are integer milliseconds UTC. Every workspace-owned table has
`workspace_id` and every query filters on it after membership is checked. Foreign keys (all enforced by D1 and by
the Node runtime, `PRAGMA foreign_keys = ON`):

| Table | References (on delete) | Contents |
| --- | --- | --- |
| `users` |  | Name, email, PBKDF2-SHA256 hash (`pbkdf2$100000$salt$hash`), avatar key, locale, settings |
| `user_identities` | users (cascade) | External sign-in (Google OIDC subject) |
| `sessions` | users (cascade) | SHA-256 of the session token, CSRF token, created, last activity, device/browser/OS, IP (removed after 30 days), ended |
| `api_tokens` | users (cascade) | SHA-256 of personal API tokens |
| `oauth_states` |  | Short-lived OAuth state (deleted when expired) |
| `rate_limits` |  | Sign-in and API rate-limit windows (deleted after a day) |
| `platform_admins` | users (cascade) | Founder/admin rights for the founder console |
| `workspaces` | users (created_by) | Name, colour, logo key, settings |
| `workspace_members` | users, workspaces (cascade) | Role: owner, admin, member, viewer |
| `invitations` | users (invited_by), workspaces (cascade) | SHA-256 of invitation tokens |
| `teams`, `team_members` | workspaces / teams, users (cascade) | Teams and their members |
| `folders` | workspaces (cascade), folders (parent, set null) | Nested folders for boards, documents, dashboards |
| `boards` | workspaces (cascade), folders (set null), users (created_by) | Boards and templates |
| `board_members` | boards, users (cascade) | Board roles for private boards |
| `groups` | boards (cascade) | Board groups |
| `columns` | boards (cascade) | 25 column types and settings |
| `items` | boards, groups, items (parent, cascade), users (created_by) | Tasks and subitems; `values_json` holds column values; `search_text` |
| `views` | boards (cascade) | Table, Kanban, Calendar, Timeline, Chart, Workload, Form, Map, Files views |
| `updates` | items, boards, updates (parent, cascade), users (author) | Comments and replies with mentions |
| `attachments` | users (uploader) | File metadata; `r2_key` points into the file store; item/board ids |
| `time_entries`, `planner_entries` | items, users (cascade) | Time tracking, My Day planner |
| `automations` | boards (cascade) | Trigger, conditions, actions |
| `automation_runs` | automations (cascade) | Run log; `event_key` unique (no duplicate runs) |
| `notifications` | users (cascade) | In-app notifications; `dedupe_key` unique |
| `notification_preferences` | users (cascade) | Per-user preferences |
| `dashboards`, `dashboard_widgets` | workspaces / dashboards (cascade), folders (set null) | Dashboards and their 11 widget types |
| `documents` | workspaces (cascade), folders (set null) | Rich-text documents |
| `document_versions`, `document_comments`, `document_members` | documents (cascade), users | History, comments, sharing |
| `goals` | workspaces (cascade) | Goals |
| `favourites`, `recents`, `saved_filters` | users (cascade) | Personal navigation and filters |
| `integrations`, `integration_deliveries` | workspaces / integrations (cascade) | Webhook, Slack and Teams settings and delivery log |
| `activity_log`, `audit_log` |  | Change history and admin audit (ids, no foreign keys) |
| `user_activity_events`, `user_daily_activity`, `analytics_daily` |  | Product events (ids only), daily activity, anonymous daily counters |
| `app_errors`, `system_kv` |  | Sanitised errors (90 days), maintenance state |
| `d1_migrations` |  | Applied migrations (`0001_initial` to `0004_founder_admin`) |

Tables that reference rows without a declared foreign key (`activity_log`, `audit_log`, `user_activity_events`,
`attachments.item_id`/`board_id`, notification targets) are checked by the migration verifier for dangling ids and
reported, never silently dropped.

### Files (R2)

Keys referenced from the database: `attachments.r2_key`, `users.avatar_key`, `workspaces.logo_key`. Objects carry
`httpMetadata.contentType` and, for attachments, `customMetadata.uploader`. After the move: content stored under
`/data/work/files/` by a hash of the key, with key, size, MD5 ETag, SHA-256 and metadata indexed in
`/data/work/runtime.sqlite`.

### Known live volume

`apps/work/docs/PROJECT_STATUS.md` (4 Nov 2026): 2 users, 2 workspaces, 2 boards, 2 items on work.kevos.com; the
founder account is a platform admin. Exact counts per table are produced by the dry run (section 4 of
`BIZOMAT-MIGRATION.md`).

## 3. CAD Automation (data folder)

| File or folder | Contents | Class | Notes |
| --- | --- | --- | --- |
| `users.json` | Accounts (id, email, name, role, scrypt salt and hash, created, email_verified, Google link, `pw_by`, `pw_at`), invites (hashed), settings (open sign-up, access code) | Critical, personal data | Never readable as "no accounts": `accounts.enabled` makes a missing file fail closed |
| `accounts.enabled` | Marker | Critical | Keeps the server closed if `users.json` disappears |
| `sessions.json` | SHA-256 of session cookies, user, created, expiry (90 days) | Critical | Without it everyone signs in again (acceptable, but copy it) |
| `secret` | Random base secret, used only when no `OPENSKETCH_PASSWORD` is set | Secret | Copy as is |
| `secret.keys` | Random data secret: HMAC base for add-in keys (`oss_...`), private MCP addresses, signed links | Secret, critical | A new one would invalidate every add-in key and private address |
| `bridge-signing-key.pem` | The gateway's ES256 command-signing key | Secret, critical | Companions trust this key; a new one makes every paired computer refuse commands |
| `bridge.sqlite` | Paired computers (name, Windows name and version, public key, last seen), pairings, every command with history, status, result and a hash of its parameters | Critical, personal data | SQLite: copy while the server is stopped or use the backup API |
| `bridge-release.json` | Signed update manifest for the Companion | Config | Copy |
| `bridge-files/` | Chunked command files in flight | Short-lived | Copy (empty when idle) |
| `mcp_oauth.json` | OAuth clients (registered AI apps), grants, SHA-256 of access and refresh tokens | Critical, secret | Without it every connected AI app must sign in again |
| `google_oauth.json` | Google sign-in client id and the encrypted client secret | Secret | Decrypted with `ai_keys.secret` |
| `ai_keys.secret` | Key for `secretbox.py` (encrypts stored secrets) | Secret, critical | Must travel with `google_oauth.json` |
| `swbridge.json` | v1 add-in link state (per-person key counters) | Critical | Changing it changes add-in keys |
| `uploads/` | Upload links and files for import | Short-lived (30 minutes) | Copy or let expire |
| `artifacts/` | Exports (1 hour), previews (10 minutes) | Short-lived | Copy or let expire |

Environment that must match the old app: `OPENSKETCH_PASSWORD` (the owner's server-wide MCP address is derived from
it), `OPENSKETCH_PUBLIC_URL` (`https://cados.kevos.com` until cad.bizomat.ai is verified), optional
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENSKETCH_ACCESS_CODE`.

Relationships: accounts own sessions, OAuth grants (AI app connections), paired computers and their commands, and
add-in keys (derived from `secret.keys` and the counters in `swbridge.json`). Nothing in the CAD data refers to
Project Management data; the products share no database.

## 4. Website and Resources

| Data | Source | Notes |
| --- | --- | --- |
| 750+ Library chapters, publications, books | `src/content/` (Markdown) | Git is the master copy |
| 1,055 tools and calculators | `public/tools/*.js` (data, guides, inputs, calculations) | Git |
| Images, PDFs, downloads | `public/` | Git |
| Redirects for every retired URL | `public/_redirects` (1,600+ rules) | Served by the Node server and by Cloudflare |
| Search index | Pagefind (`dist/pagefind`) and `/discovery-index.json` | Rebuilt by every build |
| AI search questions | Not stored | Sent to Workers AI when configured |
| Contact messages | Web3Forms (default) | Third party; not stored by BIZOMAT's servers |
| Theme and learning progress | Browser session storage | Never leaves the device |

## 5. Tokens, keys and integrations

| Item | Product | Where | Moves? |
| --- | --- | --- | --- |
| Session cookies | Both apps | Hashes in `sessions` (D1) and `sessions.json` | Hashes copied; cookies are per host, so people sign in again on a new host |
| Personal API tokens | Project Management | `api_tokens` (hashes) | Yes, unchanged |
| Webhook secrets, Slack/Teams URLs | Project Management | `integrations` | Yes, unchanged |
| AI app OAuth grants | CAD Automation | `mcp_oauth.json` | Yes, unchanged |
| Add-in keys, private MCP addresses | CAD Automation | Derived from `secret.keys`, `swbridge.json`, `OPENSKETCH_PASSWORD` | Yes, by copying those exactly |
| Device keys | CAD Automation | Public halves in `bridge.sqlite`; private halves stay in each PC's Windows key store | Yes |
| Command-signing key | CAD Automation | `bridge-signing-key.pem` | Yes |
| Google OAuth clients | Both apps | Worker secrets / `google_oauth.json` | Re-enter redirect URIs for new hosts in Google Cloud |
| Cloudflare API token | Project Management CI | GitHub secrets of jogkev-creator/PMO | Needed only to export D1/R2 |
| Fly deploy token | CAD Automation CI | Not set (GitHub secret missing) | A new org token is needed for `bizomat` |

## 6. Personal data at a glance

Names and email addresses (both apps), password hashes (PBKDF2 in Project Management, scrypt in CAD Automation),
session metadata and short-lived IP addresses (Project Management), Windows computer names (CAD Automation), and
whatever people write into tasks, documents, comments and files. The privacy policy (`/privacy/`) lists retention.
