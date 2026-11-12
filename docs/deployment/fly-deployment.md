# Deploying Project Management to Fly.io

Project Management runs in the Fly app **`bizomat`** (region `syd`) as the `work` process group: one Machine
(shared-cpu-1x, 512 MB) with the volume `work_data` (3 GB) mounted at `/data`; its data is `/data/work/db.sqlite`,
`runtime.sqlite` and `files/`. The proxy sends `https://bizomat.ai/tasks/...` to it. `fly.website.toml` describes
exactly the Machines production runs, and the preflight refuses any deploy that would add, remove or resize one. No
staging app exists, and none is created without the owner's approval.

## Pipeline

1. Changes are merged into `main` (pull request).
2. **Actions > "BIZOMAT deploy (bizomat)" > Run workflow** on `main`, `confirm` = `DEPLOY`
   (`.github/workflows/bizomat-deploy.yml`, secret `FLY_BIZOMAT_TOKEN`). Nothing else starts it.
3. The workflow: checks the token; preflight (Machines unchanged); **requests a snapshot of `work_data`** (warns and
   continues if the token cannot); builds the image on the runner and deploys it (rolling, `--ha=false`, one Machine
   per group); waits for `https://bizomat.fly.dev/__proxy/health` to report the new commit; checks bizomat.ai, its API,
   `/cad/` and `/tasks/`.
4. The work Machine restarts on the new image (Project Management is offline 10 to 60 seconds; open boards reconnect).
   At start the server checks the database's integrity, **copies the database to
   `/data/work/pre-migration-backups/db-before-<migration>-<time>.sqlite`** when a migration is pending (`VACUUM INTO`,
   transaction-consistent; the newest five kept), then applies pending migrations, each in one transaction. A failing
   migration stops the start and changes nothing (the Machine restarts and logs the error).

## Database migrations in this release

`0006_platform_upgrade.sql` is additive: new tables (`board_permissions`, `item_permissions`, `audit_events`,
`email_outbox`, `email_events`, `email_suppressions`, `reports`), new nullable columns (`workspaces.default_currency`,
`boards.currency`, `start_date`, `manager_id`), and `workspace_members` and `invitations` rebuilt only to widen their
role constraint (every row and column copied; no table references either). No stored value changes. Verified on a
populated database with foreign keys on and in one transaction (`test-node/pre-migration-backup.test.ts`).

Compatibility: the previous image runs on the new schema (the server ignores migrations it does not know, and every
new column has a default), so an image rollback needs no database change. Before rolling back after guests or project
managers were created, note that the previous version does not know those roles: remove or suspend guests first, or
restore the database copy.

## Backups (three layers)

| Layer | Where | Taken |
| --- | --- | --- |
| Server's own copy | `/data/work/pre-migration-backups/` on the volume | Before any migration, automatically |
| Volume snapshot | Fly, `fly volumes snapshots list <volume id> -a bizomat` | Before each deploy (workflow step) and daily, kept 30 days |
| Portable copy | Anywhere | By hand: `node scripts/migrate/backup-data-dir.mjs /data/work /data/incoming/backup-<date>` inside the Machine (`fly ssh console -a bizomat --process-group work`), then download with `fly ssh sftp` |

## Rollback

Image only (the usual case):

```bash
flyctl releases -a bizomat --image
```

```bash
flyctl deploy --config fly.website.toml -a bizomat --image <the previous image> --ha=false
```

Database (only if data must go back to the moment before the migration; changes made since are lost):

1. Stop the work service with maintenance mode: `fly ssh console -a bizomat --process-group work`, then
   `touch /data/.bizomat-maintenance` and restart the Machine (`fly machine restart <id> -a bizomat`); the Machine stays
   up without the service (`infrastructure/README.md`, "Recovery and maintenance").
2. In `/data/work`: move `db.sqlite` (and `db.sqlite-wal`, `db.sqlite-shm`) aside, copy
   `pre-migration-backups/db-before-0006_platform_upgrade-<time>.sqlite` to `db.sqlite`, owned by the work user.
3. Deploy the previous image (above), remove `/data/.bizomat-maintenance`, restart the Machine, and check
   `https://bizomat.ai/tasks/api/health`.

Or restore a whole volume snapshot: `fly volumes create work_data --snapshot-id <id> -a bizomat --region syd` and
attach it in place of the current one (a Machine change: owner's approval, and the preflight needs
`allow_machine_change` = `YES`).

## Settings this release adds (all optional)

Email: Fly secrets `WORK_BREVO_API_KEY`, `WORK_BREVO_WEBHOOK_TOKEN` and the non-secret `WORK_EMAIL_*` and
`WORK_APP_BASE_URL` (see [docs/email/brevo-setup.md](../email/brevo-setup.md)). Without them the app sends no email and
invitations show their link, as before. Set them with `--stage`, then run the deploy workflow (or
`fly secrets deploy -a bizomat`) so the work Machine restarts with them.

## After a deploy

`https://bizomat.ai/tasks/api/health` answers `"status":"ok"` with `"db":"ok"`; `https://bizomat.fly.dev/__proxy/health`
reports the new commit; sign in at `https://bizomat.ai/tasks`, open an existing board, check the Reports and Finance
buttons, Settings > Members, Finance and Email. The website checks of `CLAUDE.md` ("After any production change")
apply too. Results of this release's deploy: [docs/testing/feature-test-results.md](../testing/feature-test-results.md).
