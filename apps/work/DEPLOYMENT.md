# Deployment

## Environments and resource names

All names are new and prefixed `workos-platform-`. Nothing is shared between environments.

| Environment | Worker | D1 database | R2 bucket | KV namespace | Durable Object | Cron |
| --- | --- | --- | --- | --- | --- | --- |
| development (local by default) | `workos-platform-dev` | `workos-platform-dev-db` | `workos-platform-dev-files` | `workos-platform-dev-cache` | `BoardRoom` (in `workos-platform-dev`) | `*/15 * * * *` |
| preview | `workos-platform-preview` | `workos-platform-preview-db` | `workos-platform-preview-files` | `workos-platform-preview-cache` | `BoardRoom` (in `workos-platform-preview`) | `*/15 * * * *` |
| production | `workos-platform-production` | `workos-platform-production-db` | `workos-platform-production-files` | `workos-platform-production-cache` | `BoardRoom` (in `workos-platform-production`) | `*/15 * * * *` |

Feature-branch previews are **versions** of `workos-platform-preview` with a branch alias URL (`<branch>-workos-platform-preview.<subdomain>.workers.dev`). They read/write only the preview database and bucket.

### How isolation is guaranteed

1. Every binding is declared per environment in `wrangler.jsonc` (bindings are not inherited by Wrangler environments), with distinct names and IDs.
2. `scripts/check-conflicts.sh` is read-only and fails if any target name already exists; `scripts/provision.sh` runs it first and only issues `create` commands.
3. The preview workflow passes `--env preview`; only the production workflow (on `main`, behind the protected `production` GitHub environment) passes `--env production`.
4. No custom domains or routes are configured, so no existing zone or route is touched. Add one deliberately later if wanted.
5. Workflows are inert until the repository variable `CLOUDFLARE_DEPLOY_ENABLED=true` is set.

## One-time setup

### 1. GitHub repository

Create a new **private** repository (suggested `workos-platform`) and push this code to it:

```bash
git remote add workos git@github.com:<you>/workos-platform.git
```

```bash
git push workos HEAD:main
```

Then in the repository settings:

- **Branch protection on `main`:** require a pull request, passing `CI` checks and at least one approval.
- **Environments:** create `preview` and `production`. On `production`, add required reviewers and restrict deployments to the `main` branch.
- **Secrets** (both environments): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- **Variables:** `CLOUDFLARE_DEPLOY_ENABLED=true`, `PRODUCTION_URL=https://workos-platform-production.<subdomain>.workers.dev`.

### 2. Cloudflare API token

Create a token scoped to the target account with: *Workers Scripts: Edit*, *D1: Edit*, *Workers R2 Storage: Edit*, *Workers KV Storage: Edit*, *Account Settings: Read*. Do not grant zone or DNS permissions — the app does not need them.

### 3. Provision resources (per environment)

```bash
export CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=...
```

```bash
scripts/check-conflicts.sh preview production
```

```bash
scripts/provision.sh preview
```

```bash
scripts/provision.sh production
```

Paste the printed D1 `database_id` and KV `id` values into the matching `env` block of `wrangler.jsonc`, replace `REPLACE_WITH_SUBDOMAIN` in `APP_URL` with your workers.dev subdomain, commit, and open a PR.

### 4. Secrets on the Workers (optional, for Google sign-in)

```bash
npx wrangler secret put GOOGLE_CLIENT_ID --env production
```

```bash
npx wrangler secret put GOOGLE_CLIENT_SECRET --env production
```

## Google OAuth setup (when you have credentials)

1. Google Cloud Console → APIs & Services → **OAuth consent screen**: type *External* (or *Internal* for Workspace orgs), app name, support email, scopes `openid`, `email`, `profile`.
2. **Credentials → Create credentials → OAuth client ID → Web application.**
3. **Authorized JavaScript origins:**
   - `https://workos-platform-production.<subdomain>.workers.dev`
   - `https://workos-platform-preview.<subdomain>.workers.dev`
   - `http://localhost:8787` (local development)
4. **Authorized redirect URIs:**
   - `https://workos-platform-production.<subdomain>.workers.dev/api/auth/oauth/google/callback`
   - `https://workos-platform-preview.<subdomain>.workers.dev/api/auth/oauth/google/callback`
   - `http://localhost:8787/api/auth/oauth/google/callback`
   - `https://bizomat.ai/tasks/api/auth/oauth/google/callback` (under the BIZOMAT website's address, below)
5. Store the client ID/secret as Worker secrets (above) or, locally, in `.dev.vars` (see `.dev.vars.example`). The "Continue with Google" button appears automatically once both are set.

Branch alias URLs change per branch, so Google sign-in is only available on the fixed preview and production URLs; password sign-in works everywhere.

## Under bizomat.ai/tasks

The BIZOMAT website owns bizomat.ai and hands `/tasks/...` to this Worker through a service binding (`TASKS` in the
website's `wrangler.toml`), with the address unchanged. The same build answers both there and at the root of its own
host (`work.kevos.com`): `src/worker/mount.ts` serves a request under `/tasks` with the path taken off, and gives the
root paths it writes the path back (Location headers, cookie paths, invitation links, the Google return address).
Every page starts with `<base href>` (`/` or `/tasks/`), and the client builds its addresses from it
(`src/client/lib/base.ts`; the build's own files are relative, `vite.config.ts` `base: './'`). Under `/tasks` the
session cookie is `__Secure-workos_sid` with `Path=/tasks`, so the website and the other applications on bizomat.ai
never receive it. People sign in once more there: a session belongs to the host it was made on.

Order (the owner's steps; each is reversible):

1. Deploy this version to the Worker that serves `work.kevos.com` (`workos-platform-preview`). `work.kevos.com` keeps
   working as before. If Google sign-in is on, add the redirect URI above first.
2. In the website repository, uncomment the `TASKS` service binding (`service = "workos-platform-preview"`) and
   publish the website: `https://bizomat.ai/tasks/` is then this app (until then the website redirects there).
3. When `bizomat.ai/tasks` is checked, set the variable `CANONICAL_URL = "https://bizomat.ai/tasks"` on this Worker:
   pages asked for on `work.kevos.com` then answer 301 to the same path under `bizomat.ai/tasks`, while `/api/` and
   the static files keep answering there for tabs already open.

On the BIZOMAT platform (the one Fly.io app, `fly.toml` at the repository root) the same build runs on Node
(`docs/NODE-RUNTIME.md`): the edge proxy sends `bizomat.ai/tasks` and `/tasks/...` to the work process with the path
unchanged, and `work.kevos.com` at the root (`infrastructure/proxy/routes.mjs`). There `APP_URL` is
`https://bizomat.ai/tasks` (`WORK_APP_URL`), and `CANONICAL_URL` is `WORK_CANONICAL_URL`, left unset until the cutover
is checked. The steps: `docs/BIZOMAT-DEPLOYMENT.md`, section 6.

## Continuous delivery

| Trigger | Workflow | Result |
| --- | --- | --- |
| Any push / PR | `ci.yml` | lint, typecheck, Workers-runtime tests, builds, secret scan, Playwright e2e |
| Push to a non-`main` branch | `deploy-preview.yml` | preview DB migrations → `wrangler versions upload --env preview --preview-alias <branch>` → smoke test → URL in job summary |
| Merge to `main` | `deploy-production.yml` | full validation → D1 Time Travel restore point (bookmark in the job summary) → migrations → `wrangler deploy --env production` → smoke test → automatic `wrangler rollback` if the smoke test fails |

## Health checks and smoke tests

- `GET /api/health` → `{ status, db, version, environment }` (503 if D1 is unreachable).
- `node scripts/smoke.mjs <url>` checks health, security headers, 401 on private APIs, login page, server-side redirect for private pages and CORS refusal.

## Rollback

- **Code:** `npx wrangler deployments list --env production`, then `npx wrangler rollback <version-id> --env production`. Every deploy is an immutable version.
- **Data:** D1 Time Travel (`npx wrangler d1 time-travel restore workos-platform-production-db --timestamp <ISO> --env production`) or `--bookmark <id>` with the restore point the deploy recorded. Database exports are never uploaded as workflow artifacts (this repository is public).
- Migrations are written to be backward compatible so a code rollback never requires a schema rollback.

## Moving the data from Fly back to Cloudflare

Since 6 Nov 2026 the data lives on the work Machine of the Fly app `bizomat` (`/data/work`). To run Project Management
as its own Worker `bizomat-tasks` again, `scripts/migrate/to-cloudflare.mjs` (the reverse of `to-fly.mjs`) moves it
to a new D1 database `bizomat-tasks-db` and a new R2 bucket `bizomat-tasks-files`. Run it from `apps/work` on the
owner's computer, where `fly` and `wrangler` are signed in (Windows, macOS or Linux; Node 22.19 or later; `npm ci`
first). It prints names, counts and checksums only. The folder it writes holds real data: keep it on that computer.

Once, create the targets: `npx wrangler d1 create bizomat-tasks-db` and `npx wrangler r2 bucket create bizomat-tasks-files`.
If the wrangler login has several accounts, set `CLOUDFLARE_ACCOUNT_ID`.

```bash
node scripts/migrate/to-cloudflare.mjs prepare <new folder> [--app bizomat]
```

Only reads Fly. On the work Machine it copies `db.sqlite` and `runtime.sqlite` with `VACUUM INTO` (consistent while
the server runs) and links the stored files, streams the copy here (file by file in base64 if the stream arrives
damaged), checks every SHA-256 and removes the copy from the Machine. It refuses a database that is not at the
latest migration in `migrations/` or whose schema differs, and data that fails SQLite's integrity or foreign key
checks. It writes the copy (`snapshot/`), `files.json` (key, size, SHA-256, content type), `counts.json`, the rows as
SQL in parts (`sql/part-*.sql`: tables and self-referencing rows parents first, every value exact, each statement
under D1's 100,000 bytes, parts of 4 MiB by default; no schema), and `MANIFEST.sha256`. The SQL is checked by loading
it into an empty database at the same migrations.

```bash
node scripts/migrate/to-cloudflare.mjs apply <folder> [--db bizomat-tasks-db] [--bucket bizomat-tasks-files] [--replace]
```

Checks the folder against `MANIFEST.sha256` and that the bucket exists, runs `wrangler d1 migrations apply` with the
folder's migrations, and refuses a database that already has rows beyond the ones the migrations make. With
`--replace` it records a Time Travel bookmark (and prints the restore command), then deletes those rows, children
first. Then `wrangler d1 execute --remote --file` for each part (it stops at the first that fails and names it),
`wrangler r2 object put --remote` for each file with its content type, and checks: every table's rows, NULLs, REAL
values, text and blob bytes and an integer checksum in D1 against `counts.json`, and every file read back from R2 by
size and SHA-256. After a failure, fix the cause and run `apply` again with `--replace`.

- **Final copy:** stop Project Management first, or what people save after `prepare` stays behind on Fly. Put the
  work Machine in maintenance (`fly ssh console -a bizomat --machine <id> -C "touch /data/.bizomat-maintenance"`, then
  `fly machine restart <id> -a bizomat`); remove the file and restart to undo.
- **Rehearsals:** `prepare <folder> --from-db <copy>/db.sqlite --from-dir <copy>` reads a copy of `/data/work` (for
  example from `backup-data-dir.mjs`) instead of Fly; `apply <folder> --local <dir>` writes to wrangler's local D1 and
  R2 in `<dir>` instead of Cloudflare.
- **Not moved:** the KV namespace (`CACHE` holds only a health check) and the files' custom metadata (the uploader id,
  which wrangler cannot set and the Worker never reads).
- Tests: `test-node/to-cloudflare.test.ts` (stand-ins for flyctl and wrangler, and one rehearsal into the real
  wrangler's local D1 and R2).

## Local development

```bash
cp .dev.vars.example .dev.vars
```

```bash
npm run db:migrate:local
```

```bash
npm run dev
```
