# BIZOMAT data migration

How the data of Project Management (formerly KEVOS Work) and CAD Automation (formerly CADOS) moves into the single
BIZOMAT Fly.io app, how it is checked, and what the reports contain. What exists where: `BIZOMAT-DATA-INVENTORY.md`.
Going back: `BIZOMAT-ROLLBACK.md`. The website has no data to migrate (it is built from Git).

**Status (5 Nov 2026): tooling built and dry-run on representative data; the live migration has not run.** It needs
a Cloudflare API token (Project Management export) and a Fly.io token (both apps), which this session did not have.

## 1. Rules

These rules come from the project brief and are enforced by the tooling, not only by procedure:

- **Copy, never move.** The sources (D1 `workos-platform-preview-db`, R2 `workos-platform-preview-files`, the `cados`
  volume) are only read. Nothing is deleted or rewritten in them.
- **Never overwrite.** An existing target is replaced only with an explicit `--replace` or `--force`, and is first
  moved aside to a timestamped copy (`/data/backups/<role>-<time>/` on the Machine), never deleted.
- **Repeatable.** Running a step again on the same input gives the same result (per-table checksums are compared with
  the last run; objects already copied with the same content are skipped).
- **Nothing silently dropped.** Rows that fail to insert, duplicate primary keys, foreign-key violations, missing
  files and size mismatches are listed (by table and id, never content) and fail the step unless explicitly accepted.
- **Same identities.** Primary keys, foreign keys, password hashes, roles, timestamps and file keys are kept exactly.
  No account is merged with another, in a product or across products.
- **No data in logs, Git or CI artifacts.** Tools print table names, counts, ids and checksums only. Dumps and
  archives stay on the operator's machine or the target volume; workflows never upload them as artifacts.

## 2. Project Management: D1 and R2 to the work volume

Source: Cloudflare D1 `workos-platform-preview-db` (46 tables) and R2 `workos-platform-preview-files` (attachments,
avatars, workspace logos). Target: `/data/work/db.sqlite` (the exact D1 schema, including `d1_migrations`),
`/data/work/files/` and `/data/work/runtime.sqlite` (file index). Tooling: `apps/work/scripts/migrate/`
(details in `apps/work/docs/migration/`), packing and applying on Fly: `infrastructure/migrate/work/`.

| Step | Command (from `apps/work/` unless noted) | Checks |
| --- | --- | --- |
| 1. Export D1 (read only) | `npx wrangler d1 export workos-platform-preview-db --remote --output work-d1.sql` | Needs `CLOUDFLARE_API_TOKEN` (D1 read) and `CLOUDFLARE_ACCOUNT_ID` |
| 2. Import into a new data folder | `node scripts/migrate/import-d1-dump.mjs work-d1.sql <dir>` | Integrity check; foreign-key check (every violation listed; the import fails unless `--accept-fk-violations` keeps them exactly as D1 had them); applied migrations and schema against `migrations/`; rows per table in the dump against rows imported; failed rows and duplicate keys |
| 3. Repair multi-line text | `node scripts/migrate/repair-text-from-d1.mjs <dir> --remote --database workos-platform-preview-db --env preview` | `wrangler d1 export` writes text containing a line break as `replace(...,'\n',char(10))`, so a literal backslash-n already in such text would come back as a line break. Each multi-line value is re-read from D1 as hex and restored exactly |
| 4. Copy referenced files | `node scripts/migrate/copy-r2-objects.mjs <dir> --bucket workos-platform-preview-files --remote` | Every key in `attachments.r2_key`, `users.avatar_key`, `workspaces.logo_key`; SHA-256 of each object, size against the database, read back after writing; missing objects reported by kind and row id |
| 5. Verify | `node scripts/migrate/verify-data-dir.mjs <dir>` | Database checks again, every referenced file present with matching size, SHA-256 and MD5; unreferenced objects listed |
| 6. Pack | `bash infrastructure/migrate/work/pack.sh <dir> work-<time>.tar` (repository root) | SHA-256 manifest of every file |
| 7. Put in place | `fly ssh sftp put` to `/data/incoming/`, then `apply.sh` on the work Machine in maintenance mode | Manifest checked before and after, SQLite integrity check, row counts per table; the previous folder moved to `/data/backups/` |

The workflow `.github/workflows/bizomat-migrate-work.yml` (run by hand; dry run first, then apply with the word
APPLY) runs steps 1 to 7 on a GitHub runner with repository secrets, takes a snapshot of the work volume before it
applies, writes only counts to the job summary and uploads no artifact. A server lock stops the scripts from
changing a data folder that a running server uses.

**Cutover order:** announce a short pause to the people who use work.kevos.com; run the workflow; check the report;
sign in on `https://bizomat.fly.dev/__preview/work` with a real account and compare a board, a document and a file
with work.kevos.com; then make the DNS change (`BIZOMAT-DEPLOYMENT.md`, step 3). Changes made on work.kevos.com after
the export and before DNS moves would be lost: export again (the steps are repeatable) if anything was written.

**Rollback export:** `node scripts/migrate/export-for-d1.mjs <dir> out.sql [--files <dir>]` writes the BIZOMAT
database as SQL for a new D1 database (checked by a round trip), and the files with an upload script for R2.

## 3. CAD Automation: the cados volume to the cad volume

Source: the data folder on the `cados` Machine (`/data`, volume `opensketch_data`). Target: `/data/cad` on the
`bizomat` cad Machine. The files are copied byte for byte: accounts (`users.json`), sessions, OAuth grants
(`mcp_oauth.json`), the data key (`secret.keys`), the command-signing key (`bridge-signing-key.pem`), paired
computers and command history (`bridge.sqlite`) and the rest listed in `BIZOMAT-DATA-INVENTORY.md`. Because the keys
travel unchanged, every add-in key, private MCP address, AI app connection and paired computer keeps working.
Scripts: `infrastructure/migrate/cad/` (details in `infrastructure/README.md`).

| Step | Command | Checks |
| --- | --- | --- |
| 1. Pause the old server | `freeze.sh stop` on the `cados` Machine | All its Python processes stopped (SIGSTOP), so the files are still while copied; `freeze.sh cont` resumes exactly where it was |
| 2. Export | `export.sh /data` through `fly ssh console -a cados`, streamed to a local `cados-data.tar` | `MANIFEST.sha256` of every file; the stream's own SHA-256 printed last, to compare with the local file |
| 3. Verify the archive | `bash infrastructure/migrate/cad/verify.sh --archive cados-data.tar --strict` | Every file against the manifest; JSON stores parse; `bridge.sqlite` passes SQLite's integrity check (on a copy); the signing key is a PEM key; counts of accounts, sessions, connected apps and computers |
| 4. Import | upload to `/data/incoming/` with `fly ssh sftp put`, then `import.sh` on the cad Machine in maintenance mode | Refuses while the service runs and refuses to replace data without `--force` (which moves it to `/data/backups/` first); manifest checked before and after |
| 5. Verify in place | `verify.sh --installed /data/cad --strict` | As step 3, on the target |
| 6. Start | Remove the maintenance flag, restart the Machine | `/healthz`, sign in, `sw_status` from an AI app, a Companion shows Connected |

`OPENSKETCH_PASSWORD` must be set on `bizomat` to the same value as on `cados` before step 6 (`BIZOMAT-DEPLOYMENT.md`).
The old server stays paused (not destroyed) after cutover, so that rollback is `freeze.sh cont` plus a DNS change.

## 4. Dry run

The dry runs use representative data made for the purpose, never production data (none was available to this
session, and none may be copied into the repository).

| Product | What was run | Result |
| --- | --- | --- |
| Project Management | `node scripts/migrate/dry-run.mjs` (`apps/work/docs/migration/dry-run-2026-11-05.md`): a local Cloudflare source (`wrangler dev --local`: D1, R2, KV, Durable Objects) running this commit's Worker, filled through the app's own API with 4 example users in 4 workspaces (boards, items, documents, comments, files, automations, time entries); exported with `wrangler d1 export`; imported, repaired, copied, verified; the Node server started on the result; then exported back to a fresh D1 and R2 | **45 of 45 checks passed.** 47 tables, 209 rows: identical counts in every table; 0 failed rows, 0 duplicate keys, 0 foreign-key violations; schema identical to `migrations/`, 4 of 4 migrations recorded. Files: 4 of 4 referenced objects copied and verified by size, SHA-256 and MD5 (a fifth, deleted in the app, correctly reported missing). All 4 users signed in with their original passwords (hashes unchanged) and wrong ones were refused; 31 API responses per user identical to the source; file downloads identical by SHA-256; an outsider refused for 10 of 10 resources of another workspace; a session started on the source still valid; realtime ping and clean shutdown. Repeat runs identical (checksums), and the round trip back to D1 and R2 identical. 2 text values with a literal backslash-n repaired |
| CAD Automation | `infrastructure/migrate/test/roundtrip.sh` in the platform image (export, verify, restore into a fresh volume layout, verify in place) | All checks passed: the stream checksum matches the file; the archive passes `verify.sh --strict`; every file imported byte for byte and owned by the role's user; refusals of a second import without `--force`, of an archive whose files do not match its manifest and of an archive with a link (the data in place unchanged); `--force` keeps a backup and the role's secret files; Project Management archives packed, applied and counted the same way |

The live data sets are small (on 4 Nov 2026: 2 users, 2 workspaces, 2 boards and 2 items in Project Management), so
the live run takes minutes; its reports replace these figures in `BIZOMAT-PROJECT-STATUS.md`.

## 5. Reports

Each run writes `migration-report.json` and `migration-report.md` next to the target database (Project Management)
and prints the CAD counts. Every report has: source and target counts per table (or file kind), rows imported, rows
failed, duplicate keys, foreign-key violations (missing relationships), files expected, copied, missing and
mismatched, the SHA-256 checksums per table and per file, and whether a repeated run matched the previous one. Keep
the reports with the operations log; they contain ids and counts but no personal data.

## 6. Accounts after migration

| | Project Management | CAD Automation |
| --- | --- | --- |
| Passwords | Unchanged (PBKDF2 hashes copied); people sign in with the password they use today | Unchanged (scrypt hashes copied) |
| Sessions | Copied, but cookies are per host: on a new host people sign in once | Copied; same host (`cados.kevos.com`) keeps sessions; `cad.bizomat.ai` needs a new sign-in |
| Roles | Copied (founder and platform admins included) | Copied (owner and members) |
| AI app connections | | Copied; they keep working on the host they were made with |
| Paired computers | | Copied; Companions reconnect on their own to `cados.kevos.com` |

No account is merged across products. People who use both products keep two accounts until single sign-on links them
at their own request (`BIZOMAT-SECURITY.md`, section 5).
