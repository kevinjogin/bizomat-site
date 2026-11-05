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

Create a token scoped to the target account with: *Workers Scripts: Edit*, *D1: Edit*, *Workers R2 Storage: Edit*, *Workers KV Storage: Edit*, *Account Settings: Read*. Do not grant zone or DNS permissions — WorkOS does not need them.

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
5. Store the client ID/secret as Worker secrets (above) or, locally, in `.dev.vars` (see `.dev.vars.example`). The "Continue with Google" button appears automatically once both are set.

Branch alias URLs change per branch, so Google sign-in is only available on the fixed preview and production URLs; password sign-in works everywhere.

## Continuous delivery

| Trigger | Workflow | Result |
| --- | --- | --- |
| Any push / PR | `ci.yml` | lint, typecheck, Workers-runtime tests, builds, secret scan, Playwright e2e |
| Push to a non-`main` branch | `deploy-preview.yml` | preview DB migrations → `wrangler versions upload --env preview --preview-alias <branch>` → smoke test → URL in job summary |
| Merge to `main` | `deploy-production.yml` | full validation → D1 export backup (artifact) → migrations → `wrangler deploy --env production` → smoke test → automatic `wrangler rollback` if the smoke test fails |

## Health checks and smoke tests

- `GET /api/health` → `{ status, db, version, environment }` (503 if D1 is unreachable).
- `node scripts/smoke.mjs <url>` checks health, security headers, 401 on private APIs, login page, server-side redirect for private pages and CORS refusal.

## Rollback

- **Code:** `npx wrangler deployments list --env production`, then `npx wrangler rollback <version-id> --env production`. Every deploy is an immutable version.
- **Data:** D1 Time Travel (`npx wrangler d1 time-travel restore workos-platform-production-db --timestamp <ISO> --env production`) or re-import the pre-deploy SQL artifact into a new database.
- Migrations are written to be backward compatible so a code rollback never requires a schema rollback.

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
