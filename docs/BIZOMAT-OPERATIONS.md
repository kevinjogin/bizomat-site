# BIZOMAT operations

Day-to-day running of the `bizomat` Fly app: checks, logs, backups, restores, secrets, accounts and incidents.
Command-level detail for the image and the migration scripts is in `infrastructure/README.md`. Every command here
prints names, counts and states only; none prints a secret or a person's data.

## 1. The app at a glance

| Group | Port | Health | Volume | Scale |
| --- | --- | --- | --- | --- |
| proxy | 8080 (public) | `/__proxy/health` (alive), `/__proxy/ready` (upstreams reachable) | none | 1 or more |
| web | 8003 | `/healthz` (also shows whether AI search has a provider) | none | 1 or more |
| work | 8002 | `/api/health` | `work_data` at `/data` (service data in `/data/work`) | **exactly 1** |
| cad | 8001 | `/healthz` | `cad_data` at `/data` (service data in `/data/cad`) | **exactly 1** |

Never scale `work` or `cad` above one Machine: volumes are per Machine and never shared, so a second Machine would
start with an empty volume and split the data. Never give `web`, `work` or `cad` a `[[services]]` section: only the
proxy is public.

## 2. Daily and weekly checks

| When | Check | Command |
| --- | --- | --- |
| Daily | All four Machines started, checks passing | `fly status -a bizomat`, `fly checks list -a bizomat` |
| Daily | The public hosts answer | `node infrastructure/smoke/smoke.mjs https://bizomat.fly.dev --mode live` (options in `infrastructure/README.md`) |
| Weekly | Snapshots exist for both volumes | `fly volumes list -a bizomat`, then `fly volumes snapshots list <volume id>` |
| Weekly | Volume use below 80 % (auto-extend adds 1 GB up to 20 GB) | `fly ssh console -a bizomat -g work -C "df -h /data"` (and `-g cad`) |
| Monthly | Certificates valid for every host | `fly certs list -a bizomat` |
| Monthly | Dependencies: website `npm audit`, Project Management `npm audit`, CAD pins (`apps/cad/requirements*.txt`) | in CI or locally |

## 3. Logs

- `fly logs -a bizomat` (all groups) or with `--machine <id>` for one Machine.
- Each service writes one JSON line per request: method, host, path without query, status, time. No IP addresses,
  cookies, tokens or bodies are logged; do not add them.
- CAD Automation also logs its supervisor (restarts after 120 s without an answer, with a stack dump first).
- Project Management keeps sanitised error records for 90 days, visible to the founder in Admin, Health.

## 4. Backups

| What | How | Kept |
| --- | --- | --- |
| Both volumes | Fly scheduled snapshots (daily, `snapshot_retention = 30` in `fly.toml`) | 30 days |
| Before every deploy or migration | `fly volumes snapshots create <volume id>` for `work_data` and `cad_data` | 30 days |
| Portable copy of either volume | In maintenance mode: `fly ssh console -a bizomat -g <work|cad> -q -C "bash /usr/local/lib/bizomat/migrate/cad/export.sh /data/<work|cad>" > <role>-data.tar` (a tar stream with a SHA-256 manifest; its last line on stderr is the stream checksum to compare with the local file; for `work` it also lists the CAD files as missing, which is expected). Check a Project Management copy with `node apps/work/scripts/migrate/verify-data-dir.mjs <unpacked>/data`, a CAD copy with `infrastructure/migrate/cad/verify.sh --archive` | Owner's encrypted storage |
| Project Management, back to Cloudflare | `apps/work/scripts/migrate/export-for-d1.mjs` writes the database as SQL for a new D1 database and the files with an R2 upload script (`apps/work/docs/NODE-RUNTIME.md`) | Only for a rollback |
| Website | Git | Always |

Portable backups contain personal data, password hashes and secret keys. Keep them encrypted, outside Git and outside
GitHub Actions artifacts, and delete old copies when they are no longer needed. Never attach a database dump to an
issue, a pull request or a workflow artifact of a public repository (`BIZOMAT-SECURITY.md`, F1).

Test a restore once a quarter: create a volume from the latest snapshot in a scratch app or with
`BIZOMAT_ALLOW_EPHEMERAL=1` locally, start the role and run its checks.

## 5. Restores

1. Put the role in maintenance mode: `fly ssh console -a bizomat -g <work|cad> -C "touch /data/.bizomat-maintenance"`
   and restart its Machine (`fly machine restart <id> -a bizomat`). The entrypoint then keeps the Machine up without
   starting the service.
2. Either restore a snapshot (`fly volumes create <work_data|cad_data> --snapshot-id <id> -r syd -a bizomat`, then
   clone the Machine onto the new volume: `fly machine clone <id> --attach-volume <new volume id>:/data`, and destroy
   the old Machine only after the new one passes its checks; keep the old volume until the restore is confirmed),
   or put an archive in place with `infrastructure/migrate/restore.sh <work|cad> /data/incoming/<archive>.tar --force`.
   The script moves the current data to `/data/backups/<role>-<time>/` first; it never deletes it.
3. Remove the maintenance flag and restart the Machine. Run the smoke test.

## 6. Secrets

| Rule | How |
| --- | --- |
| Set without printing or keeping in shell history | `fly secrets import -a bizomat` and type `NAME=value` lines, then Ctrl-D; add `--stage` to apply at the next deploy |
| List names only | `fly secrets list -a bizomat` (shows names and digests, never values) |
| Each role sees only its own | The entrypoint's allow-list (`infrastructure/fly/entrypoint.sh`); a new secret must be added there for its role |
| Stronger storage for work and cad | A root-owned file `/data/<role>/.secrets/<NAME>` (mode 0600) on the role's own volume; other Machines never see it |
| CAD keys | `secret.keys`, `bridge-signing-key.pem`, `ai_keys.secret` live only on the CAD volume. Never regenerate them: a new signing key makes every paired computer refuse commands, a new data key changes every add-in key and private MCP address |
| `OPENSKETCH_PASSWORD` | Must stay the same value as on the old `cados` app. Changing it changes the owner's server-wide private MCP address. The cad role refuses to start on Fly without it |
| Rotation | Workers AI token and Turnstile key: rotate in Cloudflare, then `fly secrets import`. Google client secrets: rotate in Google Cloud, then set `WORK_GOOGLE_CLIENT_SECRET` or `CAD_GOOGLE_CLIENT_SECRET` |

## 7. Accounts

### Project Management
- **Forgotten password (no email provider yet):** the founder opens Admin, People, the person, **Set a new
  password**, chooses or suggests a password and tells the person through a trusted channel. The change ends the
  person's sessions and clears any lockout, and is recorded in the audit log (`admin.password_reset`). The person then
  changes it in Settings. API: `POST /api/admin/users/:id/password` (founder only, rate limited).
- **Locked account:** a password set by the founder clears the lockout; otherwise it ends by itself.
- **Founder access:** platform admins are listed in Admin, Settings; the founder role cannot be removed from the UI.
- **Removing a person:** remove them from each workspace (workspace settings, Members). Their authored tasks,
  comments and files stay with the workspace.
- **Erasing a person's personal data** (on request, after removing them from workspaces). There is no feature for it
  yet; until there is, this procedure de-identifies the account while keeping the workspace's records consistent
  (tasks, comments and files they wrote keep pointing at the account, which no longer identifies them):
  1. Snapshot `work_data`, then enter maintenance mode for `work`.
  2. On the Machine, as root, with Python's SQLite module (`python3 -c 'import sqlite3; ...'` on
     `/data/work/db.sqlite`) or locally on a downloaded copy that is then restored, run in one transaction, with
     `:id` the person's user id and `:now` the time in milliseconds:
     ```sql
     PRAGMA foreign_keys = ON;
     BEGIN;
     DELETE FROM sessions WHERE user_id = :id;
     DELETE FROM api_tokens WHERE user_id = :id;
     DELETE FROM user_identities WHERE user_id = :id;
     DELETE FROM notifications WHERE user_id = :id;
     DELETE FROM notification_preferences WHERE user_id = :id;
     DELETE FROM favourites WHERE user_id = :id;
     DELETE FROM recents WHERE user_id = :id;
     DELETE FROM saved_filters WHERE user_id = :id;
     DELETE FROM platform_admins WHERE user_id = :id;
     UPDATE users SET email = 'removed-' || id || '@bizomat.invalid', name = 'Former member', password_hash = NULL,
       avatar_key = NULL, preferences_json = '{}', failed_logins = 0, locked_until = NULL,
       disabled_at = :now, updated_at = :now WHERE id = :id;
     COMMIT;
     ```
     Note the old `avatar_key` before the update and delete that file through the runtime's file store
     (`apps/work/docs/NODE-RUNTIME.md`).
  3. Leave maintenance mode, check the person no longer appears by name or email in Admin, People, and record the
     request and the date (not the data) in the operations log.
  Have this procedure reviewed before its first use; it is not covered by automated tests.

### CAD Automation
- **Forgotten password:** the owner opens Admin, sets a new password for the person (shown once), and tells them
  through a trusted channel. This signs the person out everywhere and ends their AI apps' sign-ins. The person chooses
  their own in Settings.
- **Removing a person:** Admin, Remove. This also revokes their paired computers.
- **Server password:** the owner sees it on Admin (Show, Copy). Nobody else needs it.

### Across products
Accounts are separate per product and are never merged by email address. Linking waits for single sign-on
(`BIZOMAT-SECURITY.md`, section 5).

## 8. Deploys

- Deploy only through Actions, "BIZOMAT deploy" (run by hand), or from a clean checkout whose `HEAD` is the commit to
  deploy (`BIZOMAT-DEPLOYMENT.md`). Take volume snapshots first.
- After each deploy: `fly status`, the smoke test, and the version on each health endpoint.
- Rolling deploys replace one Machine at a time; `work` and `cad` are offline for about 10 to 60 seconds each.
  Paired computers and boards reconnect by themselves.
- The CAD add-in and Companion have their own release process (`apps/cad/docs/KEVOS-BUILD.md`,
  `apps/cad/docs/KEVOS-SIGNING.md`); the installer is built by CI, not by the platform deploy.

## 9. Incidents

| Symptom | First steps |
| --- | --- |
| BIZOMAT page "temporarily unavailable" (proxy 502/504) | `fly status`: which group is down? `fly logs --machine <id>`; restart that Machine |
| CAD Automation slow or not answering | The supervisor restarts the server after 120 s without an answer; check the logs for its stack dump. Heavy CAD work uses the dedicated core; three CAD workers at most |
| Paired computers offline | `fly logs` for `/v2/device` errors; the Companion's own logs on the PC (`%LOCALAPPDATA%\KEVOS\Bridge\logs`) |
| Project Management realtime not updating | WebSockets on `/api/live/boards/:id`: check the proxy logs for upgrades and the work Machine's health |
| Disk full | `df -h /data`; auto-extend should act at 80 %; old `/data/backups/*` can be moved off the Machine after it is confirmed they are not needed |
| Suspected compromise | Rotate the affected secrets, end sessions (Project Management: Admin, Sessions; CAD: set passwords in Admin), take snapshots for analysis, and record what happened. Do not delete data while investigating |

## 10. Operations log

Keep a dated log (outside Git if it names people): deploys, migrations, restores, password resets on request,
erasure requests, incidents. Counts and actions only, never personal data or secrets.
