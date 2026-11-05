# Node runtime

The Project Management app (this folder) runs in two places from the same Worker code:

- **Cloudflare** (today, work.kevos.com): Workers, D1, R2, KV, a Durable Object, a cron trigger.
- **Node 22** in a Fly Machine (the BIZOMAT platform): `node dist/node/server.mjs`, data on a persistent volume.

The Node server calls the Worker's own default export, `fetch(request, env, ctx)`, for every request, so routing,
authentication, permissions, security headers and metrics are the Worker's. Only the bindings are replaced. The
Cloudflare deployment is unchanged and stays available for rollback.

## Build and run

```bash
npm ci
npm run build:client   # the SPA -> dist/client
npm run build:node     # src/node/server.ts + the Worker -> dist/node/server.mjs
node dist/node/server.mjs
```

`dist/node/server.mjs` is one ESM file (esbuild, platform node, target node22) with every dependency and the SQL
migrations inside. A deployment needs `dist/node/server.mjs` and `dist/client/` only. No `node_modules`, no flags:
`node:sqlite` works unflagged on Node 22.13 and later.

### Environment

| Variable | Default | Meaning |
| --- | --- | --- |
| `PORT` | `8002` | Port to listen on. |
| `HOST` | `::` | Address to listen on. `::` is IPv4 and IPv6; on a host without IPv6 the server falls back to `0.0.0.0`. |
| `WORK_DATA_DIR` | `./.data/work` | Data folder: `db.sqlite`, `runtime.sqlite`, `files/`. Put it on the persistent volume. |
| `WORK_STATIC_DIR` | `dist/client` | The built SPA. |
| `APP_URL` | (required unless `ENVIRONMENT` is `development` or `test`) | Public origin, for example `https://work.example.com`. Accepted as Origin for CSRF checks. |
| `APP_NAME` | `Work` | Name shown on sign-in pages. |
| `ENVIRONMENT` | `production` | Anything but `development`/`test` gives `__Host-` Secure cookies (as on Cloudflare). |
| `ALLOW_SIGNUP` | `false` | `true` lets anyone create an account. |
| `SESSION_TTL_HOURS` | `336` | Session lifetime. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | unset | Google sign-in, as on Cloudflare. |
| `WORK_TRUST_PROXY` | unset | `1` behind the platform proxy: trust `X-Forwarded-Host`, `X-Forwarded-Proto` and `CF-Connecting-IP`. |
| `WORK_VERSION` | unset | Version shown on the admin health page (in place of Cloudflare's version metadata). |
| `WORK_CRON` | on | `0` turns the 15-minute maintenance off (tests). |
| `WORK_MAX_BODY_BYTES` | 32 MiB | Largest request body (the Worker itself refuses uploads over 25 MB). |
| `WORK_MIGRATIONS_DIR` | embedded | Only for running the TypeScript sources without the bundle. |

Behind the platform proxy set `WORK_TRUST_PROXY=1`, and the proxy must set `X-Forwarded-Proto: https`,
`X-Forwarded-Host: <public host>` and `CF-Connecting-IP: <client address>` (overwriting anything the client sent).
The scheme and host make the Worker's Origin checks and Google's redirect URI (`<origin>/api/auth/oauth/google/callback`)
come out right; the address feeds rate limits and the session list.

## How each Cloudflare feature is replaced

| Cloudflare | Node | Code |
| --- | --- | --- |
| D1 (`env.DB`) | SQLite file `db.sqlite` through `node:sqlite`, behind a D1-compatible class | `src/node/bindings/d1.ts`, `sql-lexer.ts` |
| R2 (`env.FILES`) | Files under `files/`, named by a SHA-256 of the key, indexed in `runtime.sqlite` | `src/node/bindings/r2.ts`, `store/file-store.ts` |
| KV (`env.CACHE`) | Table in `runtime.sqlite` | `src/node/bindings/kv.ts` |
| Workers Static Assets (`env.ASSETS`) | In-memory manifest of `WORK_STATIC_DIR` | `src/node/assets.ts` |
| Durable Object `BoardRoom` (`env.BOARD_ROOMS`) | In-process hub with `ws` sockets | `src/node/realtime.ts` |
| Cron `*/15 * * * *` | Timer on every quarter hour (UTC), calls the Worker's `scheduled()` | `src/node/scheduler.ts` |
| `ctx.waitUntil` | Tracked promises, awaited at shutdown | `src/node/context.ts` |
| `cloudflare:workers` | Shim with the `DurableObject` base class | `src/node/cloudflare-workers-shim.ts` |
| `CF_VERSION_METADATA` | `WORK_VERSION` | `src/node/runtime.ts` |
| Edge (TLS, client IP, compression) | Platform proxy for TLS; client IP rules below; brotli/gzip for static files | `src/node/http.ts`, `assets.ts` |

Nothing in `src/worker/` or `src/shared/` was changed for Node.

### D1 compatibility

`node:sqlite` alone behaves differently from D1 in several ways the code relies on. The binding makes it behave like
D1; `test-node/d1-parity.test.ts` runs about 70 operations against both Miniflare's D1 (workerd) and the Node binding
and requires identical outcomes.

- `?` and `?NNN` parameters, and named ones bound by position (rewritten to their index, as SQLite numbers them).
- `bind()` takes numbers (bound as REAL, as D1 does), strings, booleans (1/0), `null` and byte arrays; `undefined`,
  objects and bigint throw `D1_TYPE_ERROR` at once. Too few or too many bindings fail, as on D1.
- Statements compile when they run. Errors read like D1's: `D1_ERROR: UNIQUE constraint failed: t.c: SQLITE_CONSTRAINT (extended: SQLITE_CONSTRAINT_UNIQUE)`.
- `first()` is `null` without rows; `first(col)` throws `D1_COLUMN_NOTFOUND` for a missing column. `all()`/`run()`
  give `{ success, meta, results }`; `raw()` arrays, with column names on request. A repeated column name keeps the
  last value. BLOBs come back as arrays of numbers, integers past 2^53 lose precision, non-finite numbers are `null`.
- `meta.changes` is the change in `total_changes()` (rows changed by foreign key actions count, as on D1);
  `meta.last_row_id` is `last_insert_rowid()`.
- Every call runs in one transaction, as on D1: a multi-statement string is atomic, `PRAGMA foreign_keys = OFF` has no
  effect, `BEGIN`/`COMMIT`/`SAVEPOINT` and `ATTACH` are refused, only D1's PRAGMA allow-list is authorised.
- `batch()` is one transaction: all statements or none. `exec()` runs one statement per line, atomically.
- Foreign keys are enforced and double-quoted string literals are accepted, as on D1.

### Durability

- `db.sqlite` and `runtime.sqlite` use WAL with `synchronous=FULL`: every commit fsyncs the WAL, so a committed
  transaction survives a power loss as well as a crash. Busy timeout 5 s. Integrity is checked (`quick_check`) at
  start; the server refuses to start on a damaged database.
- Pending migrations are applied at start, each file and its `d1_migrations` row in one transaction, recorded exactly
  as `wrangler d1 migrations apply` records them (same table definition). A migration that fails stops the start.
- A stored file is written to `files/.tmp`, fsynced, renamed into place and its folder fsynced; then one SQLite
  transaction points the index at it, and only then is the previous version deleted. A crash leaves the previous
  object intact (at worst an unreferenced file, which `verify-data-dir.mjs` reports).
- `server.lock` in the data folder marks a running server. The migration scripts refuse to change a folder a live
  server holds. The server itself never refuses to start because of the file (after a crash it stays behind, and its
  pid may be reused in a container); it takes the lock over and logs `lock_taken_over`. If the scripts report a
  server that is not running, delete `server.lock`.

### Requests, addresses and logs

- Bodies stream both ways. A body over `WORK_MAX_BODY_BYTES` gets 413 (from `Content-Length`, or as soon as a
  streamed body passes the limit).
- Without `WORK_TRUST_PROXY=1`, client-supplied `CF-Connecting-IP`, `X-Forwarded-For`, `X-Real-IP`, `True-Client-IP`,
  `Forwarded` and `X-Forwarded-Host/Proto` are removed and the address headers are set from the socket. The host is
  the `Host` header; a request target like `//evil.example/x` stays a path on that host.
- One JSON line per request on stdout: `{"t", "method", "path", "status", "ms"}`. The path has no query string, and
  invitation tokens and other long secret-like segments are replaced. No addresses, headers or bodies are logged.
  Startup, shutdown, cron and failures are JSON lines too.
- Outbound `fetch` (webhooks, Google) refuses destinations whose DNS answers are private, loopback or link-local
  (on Cloudflare a Worker cannot reach the operator's network; on a Fly Machine it could).

### Realtime

`GET /api/live/boards/:id` with `Upgrade: websocket` goes through the Worker's own route (Origin check,
authentication, board permission). The route asks `BOARD_ROOMS` to connect, and the hub answers with an accept
response carrying a private ticket; the server completes the WebSocket handshake only for that response. Anything
else (401, 403, 404) is written back as plain HTTP and the socket is closed. The hub answers `ping` with `pong` and
fans board events out to every socket of the board, like the Durable Object. Protocol pings every 30 s drop dead
connections. On shutdown sockets close with code 1001 and browsers reconnect.

### Shutdown

On SIGTERM or SIGINT the server stops accepting connections, stops the scheduler, closes WebSockets, waits up to 10 s
for requests in flight, `waitUntil` work and a running maintenance, then closes the databases and removes
`server.lock`. A second signal exits at once.

## Data folder

```
WORK_DATA_DIR/
  db.sqlite        the application database: exactly the D1 schema (tables from migrations/ and d1_migrations)
  runtime.sqlite   Node-only state: R2 object index (r2_objects), KV (kv_entries)
  files/FILES/aa/bb/<sha256 of key>.<version>   object bodies
  files/.tmp/      partial uploads (removed after an hour)
  server.lock      present while a server runs
  migration-report.json, migration-report.md    written by the migration scripts
```

`db.sqlite` holds nothing but the D1 schema, so it can go back to D1 (`export-for-d1.mjs`).

### Backup and restore

- **Volume snapshots** (Fly takes daily snapshots of volumes) are the simplest full backup.
- **Online copy** while the server runs:

  ```bash
  node scripts/migrate/backup-data-dir.mjs "$WORK_DATA_DIR" /backup/work-2026-11-05
  ```

  It snapshots both databases with SQLite's `VACUUM INTO` (transaction-consistent), then copies every object the
  snapshot's index lists and checks its SHA-256. Object files are never changed in place, only added and removed, so
  this covers the snapshot; an object deleted in between is reported (it was deleted in the app too).
- **Offline copy**: stop the server and copy the folder.
- **Restore**: stop the server, put the three items back into an empty `WORK_DATA_DIR`, run
  `node scripts/migrate/verify-data-dir.mjs "$WORK_DATA_DIR"`, start the server.

## Migrating the data from Cloudflare

work.kevos.com is served by the **preview** environment: D1 `workos-platform-preview-db`, R2
`workos-platform-preview-files`. The scripts are in `scripts/migrate/`; run them from this folder with the
repository checked out (`npm ci`), Node 22.18 or later. They print and report counts, ids and checksums, never row
content. A rehearsal: `node scripts/migrate/dry-run.mjs` (see `docs/migration/`).

1. Rehearse first with a copy, then pick a quiet time for the final run. Writes made on Cloudflare after the export
   are not migrated.
2. Export D1 (needs `CLOUDFLARE_API_TOKEN` with D1 read and `CLOUDFLARE_ACCOUNT_ID`):

   ```bash
   npx wrangler d1 export workos-platform-preview-db --remote --env preview --output .migration/d1-export.sql
   ```

3. Import into a new data folder (refuses to overwrite an existing `db.sqlite` without `--replace`):

   ```bash
   node scripts/migrate/import-d1-dump.mjs .migration/d1-export.sql .migration/work-data
   ```

   It reorders the dump, loads it into a new database with D1's own CREATE statements, and checks integrity, every
   foreign key (violations listed; `--accept-fk-violations` keeps them as D1 had them), migrations against
   `migrations/`, the schema, rows per table, failed rows and duplicate keys. Only then is `db.sqlite` moved into place.
4. Check multi-line text against D1. `wrangler d1 export` writes text that contains a line break as
   `replace('…\n…','\n',char(10))`, so a backslash-n already inside such text comes back as a line break. This
   re-reads exactly those values from D1 (as hex) and restores them:

   ```bash
   node scripts/migrate/repair-text-from-d1.mjs .migration/work-data --remote --database workos-platform-preview-db --env preview
   ```

5. Copy the R2 objects the database references (attachments, avatars, logos), each hashed, stored, read back and
   verified; missing objects and size mismatches are reported:

   ```bash
   node scripts/migrate/copy-r2-objects.mjs .migration/work-data --bucket workos-platform-preview-files --remote
   ```

   (or `--from-dir <folder>` with objects already downloaded as `<folder>/<key>`).
6. Verify the folder (exit code 0 when sound):

   ```bash
   node scripts/migrate/verify-data-dir.mjs .migration/work-data
   ```

7. Put the folder on the volume as `WORK_DATA_DIR`, start the server, run `node scripts/smoke.mjs <url>`, sign in,
   check a board and an attachment, then move the DNS name.

Accounts move unchanged: password hashes (PBKDF2-SHA256, 100k iterations, WebCrypto) verify the same on Node, and
existing sessions stay valid as long as the host name and `ENVIRONMENT` (cookie name) stay the same.

## Rolling back to Cloudflare

The Cloudflare deployment is not changed by any of this.

- **Before any write on Node** (right after cutover): move the DNS name back. D1 and R2 still hold the data.
- **After writes on Node**: export the Node data and load it into a new D1 database and R2 bucket:

  ```bash
  node scripts/migrate/export-for-d1.mjs "$WORK_DATA_DIR" .migration/rollback.sql --files .migration/rollback-files
  npx wrangler d1 create workos-platform-preview-db-2
  npx wrangler d1 execute workos-platform-preview-db-2 --remote --file .migration/rollback.sql
  cd .migration/rollback-files && BUCKET=workos-platform-preview-files sh upload-to-r2.sh
  ```

  The SQL has every table, row, `sqlite_sequence` and index (including `d1_migrations`, so wrangler sees the
  migrations as applied); the script loads it into an empty database first and requires identical checksums. Then
  point the preview `database_id` in `wrangler.jsonc` at the new database and deploy. Objects already in the bucket
  are overwritten with the same bytes; new ones are added.

## Tests

| Command | What |
| --- | --- |
| `npm test` | The Worker suite in workerd (Miniflare), unchanged. |
| `npm run test:node` | The same suite on the Node bindings (`vitest.node.config.ts`: `cloudflare:test` served by `test-node/shims/cloudflare-test.ts`), plus the Node runtime's own tests in `test-node/`: D1/R2/KV bindings, D1 parity with Miniflare, assets, HTTP bridge, outbound guard, scheduler, the real server over HTTP and WebSockets, and the migration scripts. |
| `npm run test:e2e:node` | The Playwright specs in `e2e/` against `dist/node/server.mjs` on port 8792 with a fresh data folder. |
| `node scripts/migrate/dry-run.mjs` | The whole migration with synthetic data (see `docs/migration/`). |

## Known limits

- `node:sqlite` in Node 22 returns TEXT up to the first NUL character (the stored value is intact). D1 returns the
  whole value. The import and verify reports count such values; the app does not create them in normal use.
- SQLite calls are synchronous: a slow query holds the event loop for its duration. Fine at this size.
- KV is strongly consistent here (eventually consistent on Cloudflare); the Worker never relies on either.
- R2 conditional requests (`onlyIf`), SSE-C keys, multipart uploads and SHA-1/384/512 checks throw instead of being
  ignored. The Worker uses none of them.
- One process per data folder. Sockets live in that process; a restart drops them and browsers reconnect.
- Like Cloudflare's cron, missed quarter hours (machine stopped) are not caught up.
- The outbound guard checks DNS before connecting; certificate checks still apply to the real connection.
