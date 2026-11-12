# BIZOMAT – Site

The BIZOMAT website and platform: the public website at **bizomat.ai**, the router in front of every BIZOMAT
address, sign-in, and Project Management (Task Management) at `bizomat.ai/tasks`. It runs on the Fly.io app
**`bizomat`** in Sydney.

CAD Automation (the SOLIDWORKS MCP server, the add-in and its Windows installer) is a separate product in a separate
repository, [`kevinjogin/bizomat-cad`](https://github.com/kevinjogin/bizomat-cad), on the Fly app `cados`. How the
two work together: [docs/SITE-CAD-INTEGRATION.md](docs/SITE-CAD-INTEGRATION.md).

- Repository: `kevinjogin/bizomat-site` (private). Default branch `main`.
- Production: Fly app `bizomat`, region `syd`, deployed by hand from `main` with `fly.website.toml`.
- Public address: <https://bizomat.ai> (`www.bizomat.ai` answers 301 there). Fly origin: <https://bizomat.fly.dev>
  (health endpoints only; pages answer 301 to bizomat.ai).
- Project instructions for AI coding agents: [CLAUDE.md](CLAUDE.md). The earlier, detailed website guide (READOS
  chapters, contact form, AI chat, branding, SEO): [docs/README-website-guide.md](docs/README-website-guide.md).

## Contents

1. [Product purpose](#1-product-purpose)
2. [Architecture](#2-architecture)
3. [How the Site and CAD communicate](#3-how-the-site-and-cad-communicate)
4. [Folder structure](#4-folder-structure)
5. [Dependencies](#5-dependencies)
6. [Local setup](#6-local-setup)
7. [Environment variables and secrets](#7-environment-variables-and-secrets)
8. [Testing](#8-testing)
9. [Fly.io deployment](#9-flyio-deployment)
10. [GitHub Actions](#10-github-actions)
11. [Recovery and maintenance](#11-recovery-and-maintenance)
12. [Repository history](#12-repository-history)
13. [Security rules](#13-security-rules)

## 1. Product purpose

BIZOMAT ("Business Intelligence & Automation") is the parent brand of two products: **CAD Automation** and
**Project Management**. This repository holds everything a visitor or member sees on bizomat.ai except the CAD
application itself:

- **The website** (Astro, static pages served by a small Node server): Home, CAD Automation (product page), Work,
  The Engine Room, the READOS library, contact and legal pages, the sign-in page that offers each application's
  sign-in, and the AI chat endpoint (`/api/chat`).
- **Project Management** (`apps/work/`, at `bizomat.ai/tasks`): accounts and sessions, workspaces, boards, projects,
  tasks, files, a founder/admin dashboard; Hono server and React client, SQLite on a Fly volume.
- **The router** (`infrastructure/proxy/`): the only public port of the Fly app. It routes bizomat.ai by path (the
  website, `/tasks` to Project Management, CAD's paths to the `cados` app) and the old addresses by host.
- **Platform services**: the Fly image and entrypoint, migration tooling, smoke tests, the local compose stack.

### Project Management features (12 Nov 2026)

Organisations with members, roles (owner, admin, project manager, member, viewer, guest or contractor), email
invitations, project-level and task-level permissions, currencies and decimal-safe finance, executive and monthly
project reports (preview, PDF, Excel, HTML, CSV, saved versions), a permanent audit trail and Brevo email. Details:
[docs/architecture/current-state-audit.md](docs/architecture/current-state-audit.md),
[organisation-permissions](docs/architecture/organisation-permissions.md),
[reporting-system](docs/architecture/reporting-system.md), [financial-system](docs/architecture/financial-system.md),
[Brevo setup](docs/email/brevo-setup.md), [email templates](docs/email/email-templates.md),
[deployment](docs/deployment/fly-deployment.md) and [test results](docs/testing/feature-test-results.md).

## 2. Architecture

```
                       bizomat.ai, www.bizomat.ai (Cloudflare DNS, DNS only)
                                        |
                                        v
  Fly app bizomat (syd) -----------------------------------------------------------------
  |  proxy  :8080  infrastructure/proxy        the only public port; routes by host and path
  |    |-- web   :8003  the website (Astro build + src/node server: /api/chat, contact)
  |    |-- work  :8002  Project Management (apps/work), volume work_data at /data
  |    '-- CAD paths --> http://cados.internal:8080  (Fly app cados, repository bizomat-cad)
  ---------------------------------------------------------------------------------------
```

- **One image, several process groups.** `infrastructure/fly/Dockerfile` builds one image; `fly.website.toml`
  starts it as one Machine per process group (`bizomat-entrypoint proxy|web|work`). The entrypoint
  (`infrastructure/fly/entrypoint.sh`) starts each service as its own user with only its own settings (an allow-list),
  so no service can read another's secrets.
- **Production, read from Fly on 9 Nov 2026 (`fly scale show`, `fly volumes list`), and `fly.website.toml` matches
  it:** three Machines in `syd`: `proxy` (shared-cpu-1x, 256 MB), `web` (shared-cpu-1x, 512 MB) and `work`
  (shared-cpu-1x, 512 MB), 1.25 GB of memory in all, and one volume, `work_data` (3 GB), on `work`.
- **The `cad` group was removed on 9 Nov 2026.** `fly.website.toml` had a fourth group, `cad` (performance-1x, 2 GB,
  volume `cad_data`), from the earlier plan to run CAD inside this app. It never ran in production: there was no such
  Machine or volume. CAD stays in its own app, `cados`. The image (`infrastructure/fly/Dockerfile`) still builds the
  CAD stages from `apps/cad`; removing them is a later clean-up (section 3).
- **Other configurations in the repository, not deployed:** `fly.toml` (the single-app plan with the preview switch
  on; it routes `/cad` inside this app), `wrangler.toml` and `src/worker.ts` (the planned Cloudflare Worker for
  bizomat.ai; nothing on Cloudflare is deployed), `apps/work/wrangler.jsonc` (Project Management's earlier Cloudflare
  Worker).

## 3. How the Site and CAD communicate

In short (the full contract, with a change checklist: [docs/SITE-CAD-INTEGRATION.md](docs/SITE-CAD-INTEGRATION.md)):

- The router sends CAD's requests on bizomat.ai to the Fly app `cados` over Fly's private network:
  `UPSTREAM_CAD = "http://cados.internal:8080"` in `fly.website.toml`. Both apps must stay in the same Fly
  organization. Paths and the Host header are passed through unchanged.
- Which paths are CAD's is one expression, `CAD_PATHS`, in `infrastructure/proxy/routes.mjs` and
  `src/server/platform-paths.ts` (tests keep them equal): `/cad/...`, `/mcp`, `/solidworks/mcp`, `/oauth/...`,
  `/v2/...`, `/healthz` and CAD's OAuth `/.well-known/...` documents. Never change them without the CAD repository.
- The CAD app serves itself under `https://bizomat.ai/cad` (`OPENSKETCH_PUBLIC_URL`) and takes the prefix off itself.
- The two apps share no database, queue or secret. The brand (`shared/brand/`) and the footer text
  (`src/config/platform.ts`) are repeated in the CAD app.
- `apps/cad/` is a pinned, read-only copy of one CAD commit. The `cad` group is gone (9 Nov 2026), but the image
  (`infrastructure/fly/Dockerfile`) still builds its CAD stages from it, so it stays until those stages are removed
  in a pull request of their own. CAD is changed in `kevinjogin/bizomat-cad`.

## 4. Folder structure

| Path | What |
| --- | --- |
| `src/` | The website (Astro): `pages/`, `layouts/`, `components/`, `content/` (READOS chapters), `config/` (`site.ts`, `platform.ts`), `data/`, `server/` (shared server code, `platform-paths.ts`), `node/` (the Node server of the `web` group), `worker.ts` (the planned Cloudflare Worker) |
| `public/` | Static files served as they are (favicons, brand images, the IndexNow key file) |
| `tests/` | Website tests (`node --test`): routing and paths (`worker.test.ts`), security, navigation, SEO, chat, contact, downloads, the deploy guard, the artifact policy, and more |
| `scripts/` | Build and maintenance scripts: `postbuild.mjs` (CSP hashes, quality gate), `build-server.mjs`, `sync-cad.mjs` (the `apps/cad` pin), `seo/`, `deploy-guard.mjs` |
| `apps/work/` | Project Management: `src/worker/` (Hono server, auth, API), `src/client/` (React), `migrations/` (SQLite schema), `scripts/`, tests (`test/`, `test-node/`, `e2e/`); its own docs (`README.md`, `ARCHITECTURE.md`, `DATABASE.md`, `DEPLOYMENT.md`, `SECURITY.md`) |
| `apps/cad/` | Pinned copy of CAD Automation (commit in `apps/cad-source.json`). Never edited here |
| `shared/brand/` | Logo geometry, tokens, components, fonts; `build.mjs` copies them into every product |
| `infrastructure/fly/` | The Dockerfile, `entrypoint.sh`, the CAD holding page, config checks (`test/check-config.py`) |
| `infrastructure/proxy/` | The router (`server.mjs`, `routes.mjs`) and its tests |
| `infrastructure/migrate/` | Data move tools (Project Management, CAD) and their rehearsals |
| `infrastructure/smoke/` | The smoke test (`smoke.mjs`) for a local stack, the Fly origin or the live hosts |
| `infrastructure/local/` | Docker compose stack for running the whole platform locally |
| `docs/` | Architecture, deployment, security, rollback, operations, status (`BIZOMAT-*.md`), the integration contract, the earlier README |
| `seo/`, `brand-source/` | SEO configuration and brand source files |
| `.github/workflows/` | CI, the deploy, SEO jobs (section 10); `.github/scripts/fly-preflight.py` |
| `fly.website.toml` | **The production Fly configuration** (app `bizomat`) |
| `fly.toml`, `wrangler.toml` | Not deployed (section 2) |

## 5. Dependencies

- **Node.js 22** (`.node-version`; `package.json` needs >= 22.12) and npm. Website: Astro, Pagefind; Project
  Management: Hono, React, Vite, TanStack Query, Tiptap, zod, ws (`apps/work/package.json`). Lock files are committed;
  install with `npm ci`.
- **Python 3.12** for the infrastructure checks and migration tools (standard library), and for the `cad` group.
- **Docker** to build the production image and run the local stack. `flyctl` only for deploys and operations.
- **shellcheck** for the shell scripts (CI).
- **External services used at runtime:** Fly.io (hosting), Cloudflare (DNS only), Web3Forms (contact form, posted
  from the browser, with hCaptcha), Cloudflare Workers AI or Anthropic (the AI chat, when their secrets are set),
  Google sign-in (Project Management, optional).
- Dependabot opens pull requests for npm and GitHub Actions updates (`.github/dependabot.yml`).

## 6. Local setup

```bash
git clone https://github.com/kevinjogin/bizomat-site.git
cd bizomat-site
npm ci
npm run dev                 # the website at http://localhost:4321
```

Project Management on its own:

```bash
cd apps/work
npm ci
cp .dev.vars.example .dev.vars    # optional: Google sign-in for local runs
npm run dev                       # http://localhost:8787
```

The whole platform (router, website, Project Management, and a stand-in or the real CAD group) as in production:

```bash
docker compose -f infrastructure/local/compose.yml up --build
node infrastructure/smoke/smoke.mjs
```

Local secrets live only in ignored files (`.env`, `.dev.vars`): never commit them. The example files list the names.

## 7. Environment variables and secrets

Values are never in the repository. Production secrets are Fly secrets of the app `bizomat` (`fly secrets list -a
bizomat` shows names only); GitHub Actions secrets are repository secrets.

**Fly app `bizomat`: `[env]` in `fly.website.toml` (not secret)**

| Name | Used by | Meaning |
| --- | --- | --- |
| `UPSTREAM_WEB`, `UPSTREAM_WORK` | proxy | The website and Project Management on the private network |
| `UPSTREAM_CAD` | proxy | CAD: `http://cados.internal:8080` (the `cados` app) |
| `BIZOMAT_PREVIEW_ROUTING` | proxy | `0` in production; `1` turns on preview routing on bizomat.fly.dev |
| `WORK_APP_URL`, `WORK_APP_NAME`, `WORK_ENVIRONMENT`, `WORK_ALLOW_SIGNUP`, `WORK_SESSION_TTL_HOURS`, `WORK_CANONICAL_URL` | work | Project Management's address, name, sign-up and session length |
| `OPENSKETCH_PUBLIC_URL`, `OPENSKETCH_REDIRECT_HOSTS` | none since 9 Nov 2026 | CAD's address. Only a `cad` group would use them; kept so the Machines' settings did not change |

**Fly app `bizomat`: secrets (all optional)**

| Name | Used by | Meaning |
| --- | --- | --- |
| `CF_ACCOUNT_ID`, `CF_AI_TOKEN` | web | Cloudflare Workers AI for the AI chat |
| `ANTHROPIC_API_KEY` | web | Anthropic for the AI chat (instead of Workers AI) |
| `TURNSTILE_SECRET_KEY` | web | Cloudflare Turnstile check on forms |
| `WORK_GOOGLE_CLIENT_ID`, `WORK_GOOGLE_CLIENT_SECRET` | work | Google sign-in for Project Management |
| `WORK_BREVO_API_KEY` | work | Brevo transactional email (invitations, assignments, reminders). Without it, invitations show a link to share |
| `WORK_BREVO_WEBHOOK_TOKEN` | work | The bearer token Brevo sends with delivery events to `https://bizomat.ai/tasks/api/email-webhooks/brevo` |
| `WORK_EMAIL_FROM_ADDRESS`, `WORK_EMAIL_FROM_NAME`, `WORK_EMAIL_REPLY_TO`, `WORK_APP_BASE_URL`, `WORK_EMAIL_DAILY_LIMIT`, `WORK_EMAIL_CRITICAL_RESERVE`, `WORK_EMAIL_PROVIDER`, `WORK_EMAIL_SANDBOX` | work | Email settings (not secret; defaults: `notifications@bizomat.ai`, `BIZOMAT`, none, `WORK_APP_URL`, 250, 40, `brevo` when a key is set, off). Setup: [docs/email/brevo-setup.md](docs/email/brevo-setup.md) |

Which role receives which names, and the stronger per-volume secret files: [infrastructure/README.md](infrastructure/README.md),
"Settings and secrets". Fly sets `FLY_*` variables itself.

**Build time (website)**

| Name | Meaning |
| --- | --- |
| `PUBLIC_CONTACT_PROVIDER` | `web3forms` (default) or `worker` |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms form key (a public identifier; a default is in `src/config/site.ts`) |
| `PUBLIC_CONTACT_ENDPOINT` | Contact endpoint when the provider is `worker` |

**Local only**: `.dev.vars` (the planned Cloudflare Worker: `MAIL_PROVIDER`, `RESEND_API_KEY`, `CONTACT_TO`,
`CONTACT_FROM`, `ALLOWED_ORIGINS`, `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW`), `apps/work/.dev.vars` (`GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`), `apps/work/.env` (Cloudflare tooling: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
`CLOUDFLARE_DEPLOY_ENABLED`, `PRODUCTION_URL`).

**GitHub Actions (Settings > Secrets and variables > Actions)**

| Name | Kind | Used by |
| --- | --- | --- |
| `FLY_BIZOMAT_TOKEN` | secret | `bizomat-deploy.yml`, `bizomat-migrate-work.yml`: a deploy token for the `bizomat` app only |
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | secrets | `bizomat-migrate-work.yml` (the one-time move from Cloudflare D1, done 6 Nov 2026) |
| `GSC_SERVICE_ACCOUNT_JSON`, `BING_WEBMASTER_API_KEY`, `CF_API_TOKEN` | secrets | SEO jobs (optional) |
| `GSC_PROPERTY`, `BING_SITE_URL`, `CF_ZONE_ID` | variables | SEO jobs (optional) |

## 8. Testing

```bash
npm ci && npm run verify                                 # astro check, website tests, build with its quality gate
npm run brand:check                                      # brand copies in step across the products
node --test 'infrastructure/proxy/test/*.test.mjs'       # the router
python3 infrastructure/fly/test/check-config.py fly.toml fly.website.toml
node scripts/sync-cad.mjs check                          # apps/cad is exactly the pinned CAD commit
cd apps/work && npm ci && npm run check                  # Project Management: lint, types, tests, build
```

`.github/workflows/bizomat-ci.yml` runs all of these, plus the image build, the local stack's smoke test and the
migration rehearsals. Before a deploy, run it by hand (Actions > BIZOMAT CI > Run workflow).

## 9. Fly.io deployment

**Production is the Fly app `bizomat`, deployed from `main` with `fly.website.toml`.** Nothing deploys
automatically: no push, merge or schedule.

**One-time setup in this repository**

1. Fly dashboard > `bizomat` > Tokens > Create deploy token. GitHub: Settings > Secrets and variables > Actions >
   New repository secret `FLY_BIZOMAT_TOKEN`.
2. Settings > Actions > General: allow Actions (they were turned off for the move, so that copying the branches
   started no workflow).
3. Until 9 Nov 2026 the deploy ran from the owner's laptop (`bizomat.ps1 deploy website` in the CAD repository's
   `tools/laptop/`), from a clone of `jogkev-creator/gocore-website`. Point the laptop's clone at this repository
   (`git remote set-url origin https://github.com/kevinjogin/bizomat-site.git`) or deploy from Actions only.

**Deploy**: Actions > **BIZOMAT deploy (bizomat)** > Run workflow on `main`, `confirm` = `DEPLOY`. It:

1. runs the **preflight** (`.github/scripts/fly-preflight.py`): reads the live Machines and compares them with
   `fly.website.toml`. It stops, deploying nothing, when the deploy would add or remove a Machine or change its size,
   memory or region. `allow_machine_change` = `YES` lets a deliberate change through;
2. lists which optional secrets are set (names only);
3. deploys: builds the image on the runner and pushes it to Fly's registry, `flyctl deploy --config fly.website.toml
   --app bizomat --local-only --ha=false --build-arg BIZOMAT_VERSION=<commit>` (rolling, one Machine per group
   replaced in place). Fly's remote builder is not used: it stopped answering during the website build (10 Nov 2026);
4. waits until `https://bizomat.fly.dev/__proxy/health` reports the new version;
5. checks bizomat.ai: the website, `/api/chat`, `/cad/` (CAD over the private network), `/tasks/`.

**`fly.website.toml` matches production** (9 Nov 2026): the three Machines and the volume in section 2. The
preflight passes for it, so a deploy ships new code onto the same Machines. A change to the Machines (another group,
size, memory or region) is a decision of its own: change `fly.website.toml` in a pull request, then deploy with
`allow_machine_change` = `YES`. To run CAD inside this app after all, follow `infrastructure/migrate/cad/README.md`
(the earlier plan; the `cad` group would have to come back).

The workflow never creates an app, volume or IP address, never sets a secret, and never touches `cados`, DNS or
Cloudflare. DNS for bizomat.ai is changed by hand only, in Cloudflare (`docs/BIZOMAT-DEPLOYMENT.md`).

## 10. GitHub Actions

| Workflow | Starts on | Does |
| --- | --- | --- |
| `bizomat-ci.yml` BIZOMAT CI | push, pull request, by hand | Website, router, Project Management, infrastructure checks, image and local stack |
| `bizomat-deploy.yml` BIZOMAT deploy (bizomat) | by hand only (`DEPLOY`) | Deploys `fly.website.toml` to the app `bizomat` (section 9) |
| `bizomat-migrate-work.yml` | by hand only (`APPLY`) | The one-time move of Project Management's data from Cloudflare D1 (done 6 Nov 2026) |
| `verify.yml` | push to `main`, pull request, by hand | Website checks |
| `seo-validate.yml` | push to `main`, pull request, by hand | SEO checks; on a push to `main` it also submits the changed URLs to IndexNow |
| `seo-daily.yml`, `seo-weekly.yml`, `seo-monthly.yml` | schedule, by hand | SEO data and reports (need the SEO secrets and variables in section 7) |
| `live-check.yml` | by hand | Checks a public site |

GitHub Free gives private repositories a limited number of Actions minutes a month; when they run out every job fails
at once with a billing message (seen on 7-8 Nov 2026 in the old repositories). Turn off the scheduled SEO jobs if
the minutes are short: Actions > the workflow > Disable workflow.

## 11. Recovery and maintenance

- **A bad release:** `flyctl releases -a bizomat --image` lists the releases with their images. Redeploy the
  previous one: `flyctl deploy --config fly.website.toml -a bizomat --image <registry.fly.io/bizomat:deployment-...>
  --ha=false`.
- **Project Management's data:** volume `work_data` on the `work` Machine, with Fly's daily snapshots. To restore:
  `flyctl volumes snapshots list <volume-id> -a bizomat`, make a new volume from a snapshot, move the Machine onto it,
  check it, then remove the old one. Step by step: [infrastructure/README.md](infrastructure/README.md) and
  [docs/BIZOMAT-ROLLBACK.md](docs/BIZOMAT-ROLLBACK.md). Never delete a volume or snapshot during a recovery.
- **Logs and state:** `flyctl status -a bizomat`, `flyctl logs -a bizomat`, `flyctl machines list -a bizomat`.
- **Secrets:** rotate on Fly (`fly secrets set --stage -a bizomat NAME=...`, applied by the next deploy) and in
  GitHub. A deploy token is per app: rotating `FLY_BIZOMAT_TOKEN` never affects `cados`.
- **Dependencies:** review Dependabot pull requests; CI must pass before merging.
- **Operations and status docs:** [docs/BIZOMAT-OPERATIONS.md](docs/BIZOMAT-OPERATIONS.md),
  [docs/BIZOMAT-PROJECT-STATUS.md](docs/BIZOMAT-PROJECT-STATUS.md),
  [docs/BIZOMAT-SECURITY.md](docs/BIZOMAT-SECURITY.md).

## 12. Repository history

This repository was created on 9 Nov 2026 from the source of the live `bizomat` app:

- **`main` and every other branch and tag** are `jogkev-creator/gocore-website` exactly as it was on 9 Nov 2026 (the
  repository name is historical): 52 branches, the tag `pre-b2b-redesign-2026-10-04`, the full history with the
  same commit ids. `main` continues it with the move's own commits.
- **`archive/bizomat-repo/*`**: the website part of `jogkev-creator/bizomat`, the 8-9 Nov 2026 single-app work that
  was never deployed (every one of its deploy runs failed while GitHub Actions was blocked). Each commit keeps its
  author, date and message, with an `Archived-From:` line naming the original commit; its CAD part is in the CAD
  repository under the same branch names. `archive/bizomat-repo/claude/vigilant-johnson-g8ecmi` is the newest
  (9 Nov 2026). Review before merging anything from it: it changes `fly.toml` and the deployment model.
- The old repositories (`jogkev-creator/gocore-website`, `jogkev-creator/bizomat`, `jogkev-creator/CADOS`,
  `jogkev-creator/PMO`) were not changed or deleted.

## 13. Security rules

- Never commit `.env` or `.dev.vars` files, Fly or Cloudflare tokens, database files or dumps, data exports, signing
  keys or certificates with private keys, passwords, or personal data. `.gitignore` covers the usual names; check
  `git diff --cached --stat` before every commit.
- History was scanned with gitleaks on 9 Nov 2026: no secret. The findings it reports are test fixtures and public
  identifiers by design (the Web3Forms form key, the hCaptcha site key, the IndexNow key), listed with reasons in
  `.gitleaksignore`. Run `gitleaks git . --redact` before pushing anything unusual.
- One migration (`apps/work/migrations/0004_founder_admin.sql`) names the founder's own business email to grant the
  founder role; it is not a credential.
- Report a security problem privately to the owner; never in a public place.
