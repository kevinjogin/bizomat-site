# Database

Cloudflare D1 (SQLite). Schema: [`migrations/0001_initial.sql`](migrations/0001_initial.sql). Each environment has its **own** database (`workos-platform-{dev,preview,production}-db`).

## Conventions

- IDs are random URL-safe strings (96 bits). Timestamps are integer milliseconds (UTC). Calendar dates in column values are `YYYY-MM-DD`.
- Every workspace-owned table has `workspace_id`; every query filters on it after the caller's membership is verified. Foreign keys with `ON DELETE CASCADE` keep children consistent.

## Entities

```
users ─┬─ user_identities (provider logins)      sessions, api_tokens, oauth_states, rate_limits
       └─ workspace_members ── workspaces ─┬─ invitations, teams ── team_members
                                           ├─ boards ─┬─ board_members
                                           │          ├─ groups ── items (parent_item_id → subitems)
                                           │          ├─ columns           │  ├─ updates (replies via parent_update_id)
                                           │          ├─ views             │  ├─ attachments (R2 keys)
                                           │          └─ automations ── automation_runs   time_entries, planner_entries
                                           ├─ dashboards ── dashboard_widgets
                                           ├─ documents ── document_versions, document_comments, document_members
                                           ├─ goals, saved_filters, favourites, recents
                                           ├─ notifications (+ notification_preferences per user)
                                           ├─ integrations ── integration_deliveries
                                           └─ activity_log, audit_log
```

Highlights:

| Table | Notes |
| --- | --- |
| `items.values_json` | Map `columnId → value`, validated by `src/shared/columns.ts`. Computed columns (formula, created/updated date, derived progress) are never stored. |
| `items.search_text` | Lower-cased text projection maintained on write for search. |
| `items.position` / `groups.position` / `columns.position` | Fractional ordering (`positionBetween`) so drag & drop updates exactly one row. |
| `automation_runs.event_key` | `UNIQUE` — the duplicate-prevention guarantee for automations. |
| `notifications.dedupe_key` | `UNIQUE` — due/overdue reminders are sent at most once per item/date/user. |
| `sessions.token_hash`, `api_tokens.token_hash`, `invitations.token_hash` | Only SHA-256 hashes of bearer secrets are stored. |
| `folders` | Nestable, colourable folders per workspace and scope (`documents` / `boards` / `dashboards`); entities reference them via `folder_id`. Deleting a folder moves its content up a level — nothing is deleted. |
| `platform_admins` | Founder/admin rights for the founder console (separate from workspace roles). |
| `user_activity_events` | Persistent product events (IDs only, no content); indexed by time, user, type, workspace and board. |
| `user_daily_activity` | One row per user per UTC day of activity — DAU/WAU/MAU history. |
| `analytics_daily` | Aggregate daily counters (anonymous page views, API failures). No identifiers. |
| `app_errors` / `system_kv` | Sanitised server errors (90 days) and small system state (last maintenance run). |
| `sessions` (+ `last_activity_at`, `ended_at`, `end_reason`) | Login history retained 365 days after ending; heartbeat-based activity. See docs/ADMIN.md. |
| `document_versions` | Snapshot on title change, explicit snapshot, author change or ≥5 min since the last snapshot. |

## Migrations

```bash
npx wrangler d1 migrations create DB <name>     # new file in migrations/
```

```bash
npm run db:migrate:local
```

CI applies migrations to **preview** on every feature-branch deploy and to **production** only in the protected production workflow, after taking a backup. Migrations must be backward compatible with the previous Worker version (expand → migrate → contract) so a rollback of the Worker never meets an incompatible schema.

## Backups & export

- **Point-in-time recovery:** D1 Time Travel (restore to any minute within the retention window): `npx wrangler d1 time-travel restore workos-platform-production-db --timestamp <ISO> --env production`.
- **Pre-deploy snapshot:** the production workflow runs `wrangler d1 export` and stores the SQL dump as a 30-day workflow artifact before migrating.
- **Workspace export:** admins can download a JSON export (`GET /api/workspaces/:id/export`, Settings → Admin). File binaries stay in R2 (keys are listed).
- **R2:** enable bucket versioning/lifecycle in the dashboard if long-term file recovery is required.
