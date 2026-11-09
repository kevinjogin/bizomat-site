# BIZOMAT platform: permanent project instructions

Read this file, `docs/BIZOMAT-PROJECT-STATUS.md`, `docs/BIZOMAT-ARCHITECTURE.md` and, for Library content,
`docs/KEVOS_READOS_PUBLISHING.md` before any change. Each application has its own instructions too:
`apps/cad/CLAUDE.md` (CAD Automation) and the docs in `apps/work/` (Project Management).

## Identity

- **BIZOMAT is the active brand** (owner decision, 5 Nov 2026), the parent corporate brand of every product. Corporate
  language (owner, 8 Nov 2026; one source, `src/config/platform.ts`): descriptor "Business Intelligence & Automation";
  slogan "Connecting Intelligence. Empowering Progress."; supporting message "Technology Connected. Progress
  Delivered."; the corporate introduction, description and footer line there. The logo, layout, colours (navy and
  teal) and product names stay as they are (owner, 8 Nov 2026). Products: **CAD Automation** (formerly CADOS),
  **Project Management** (formerly KEVOS Work / WorkOS) and **Resources** (formerly the kevos.com Tools and Library).
  Every site's footer carries the slogan, the short description and "© <year> BIZOMAT. All rights reserved."
- **KEVOS is the former name.** KEVOS® is a registered Australian trade mark (No. 2469816); BIZOMAT is **not**
  registered. Never write "®" or "TM" after BIZOMAT and never call it registered. KEVOS appears only as the former
  name (footer, trade mark notice, "Formerly" labels) and in historical docs.
- **GoCore is retired** for good: no GoCore branding, blue logos, the GC favicon, gocore.com.au or old templates.
  Never run `python scripts/brand/build_brand.py`.
- The founder, **Kevin Jogin**, is named only on The Engine Room (`/engine-room/`, which joined the About and Proof of
  Work pages on the owner's request, 5 Nov 2026), signing his message as "Founder, BIZOMAT" (owner decision,
  5 Nov 2026). Never invent biography, qualifications, employers, awards, clients, projects, results,
  statistics, prices, partnerships, testimonials or customer logos. Product claims come only from the code
  (`src/data/platform-catalog.ts` records where each comes from).
- The legal entity, ABN, address and a BIZOMAT contact email are not recorded yet: never invent them.

## Repository layout

| Path | What |
| --- | --- |
| `/` | The website (Astro): `src/`, `public/`, `tests/`, `scripts/`; Node server in `src/node/` |
| `apps/cad/` | CAD Automation (Python server, C# add-in and Companion, installer): an exact copy of one CADOS commit, pinned in `apps/cad-source.json` (`scripts/sync-cad.mjs check` proves it by git's tree hash; CI runs it). Never edit it here: change kevinjogin/bizomat-cad, then `node scripts/sync-cad.mjs to <commit>` (or the laptop's `bizomat.ps1 sync cad`) in a pull request of its own |
| `apps/work/` | Project Management (Hono Worker + React SPA, Node runtime, migrations, migration tooling); PMO history |
| `shared/brand/` | Logo geometry, generated assets, tokens, components, fonts (`build.mjs` copies them into every product) |
| `infrastructure/`, `fly.toml` | The single Fly.io app `bizomat`: proxy, Dockerfile, entrypoint, compose stack, smoke tests, migration scripts |
| `docs/BIZOMAT-*.md` | Architecture, data inventory, migration, deployment, security, rollback, operations, status |

## Source of truth

- **GitHub `kevinjogin/bizomat-site`, branch `main`** (since 9 Nov 2026; its history is `jogkev-creator/gocore-website`,
  which is kept unchanged as an archive: never push there). Every repository is
  private (owner, 7 Nov 2026): nothing public may link to GitHub, the laptop works from its signed-in clones, and public
  files are published on bizomat.ai (`/downloads/`, the R2 bucket `bizomat-downloads`, `src/server/downloads.ts`). Before any work:
  `git fetch origin`, and confirm the working branch is at or ahead of `origin/main` with no unexplained local changes.
  Preserve uncommitted work on a backup branch before anything else.
- `kevinjogin/bizomat-cad` (formerly `jogkev-creator/CADOS`, same commits) is where CAD Automation is changed and
  tested (and its add-in and installer released); the `cad` group of `fly.website.toml` would be built from
  `apps/cad`, its exact copy. Production CAD is the Fly app `cados`, deployed from bizomat-cad; do not change that
  deployment from here. How the two apps work together: `docs/SITE-CAD-INTEGRATION.md`.
  `jogkev-creator/PMO` is where Project Management came from.
- Never merge older GoCore branches into `main`.

## Deployment

- **Two repositories, two Fly apps (owner, 9 Nov 2026):** this repository deploys only the Fly app `bizomat`
  (website, router, Project Management), with `fly.website.toml`, through `.github/workflows/bizomat-deploy.yml`: by
  hand, `confirm` = `DEPLOY`, repository secret `FLY_BIZOMAT_TOKEN` (a deploy token for `bizomat` only). Its preflight
  (`.github/scripts/fly-preflight.py`) stops any deploy that would add, remove or resize a Machine. Production, read
  from Fly on 9 Nov 2026: three Machines in syd (proxy shared-cpu-1x 256 MB, web and work shared-cpu-1x 512 MB) and
  the volume `work_data` (3 GB); `fly.website.toml` matches it exactly (the `cad` group of the earlier plan never ran
  and was removed). Never add a Machine, a process group or memory without the owner's approval. `fly.toml` and `wrangler.toml` are not deployed; the notes below about the single app
  and Cloudflare describe earlier plans.
- **CAD Automation into `bizomat` (6 Nov 2026; an earlier plan, not carried out: the `cad` group was removed from
  `fly.website.toml` on 9 Nov 2026 and CAD stays in the app `cados`, in ams):** the plan gave `fly.website.toml` a `cad`
  group (performance-1x, 2 GB, volume `cad_data` in syd, cados's settings). The cad role never starts the CAD server on a volume without CAD data (a
  holding page instead) and needs no server password. The data moves with `bizomat.ps1 move cad`
  (`infrastructure/migrate/cad/to-fly.mjs`, rehearsed by `infrastructure/migrate/test/cad-move/rehearse.sh` in CI); it
  switches the router's `UPSTREAM_CAD` itself, and `fly.website.toml` follows in a pull request (until then
  `deploy website` refuses). Retiring `cados` (`retire cados`, `delete cados`) is irreversible: only with the owner's
  go-ahead. Steps: `infrastructure/migrate/cad/README.md`.
- **Target:** one Fly.io app `bizomat` (Sydney) with process groups proxy, web, work and cad, deployed by
  a deploy workflow with an org-scoped token (earlier plan; the workflow now deploys `fly.website.toml`, see above). See `docs/BIZOMAT-DEPLOYMENT.md`.
  DNS changes (bizomat.ai, www.bizomat.ai, kevos.com, cados.kevos.com, work.kevos.com) are made by hand only after the
  new app passes its smoke tests; never automate them from CI. Its proxy routes bizomat.ai by path as the Worker does
  (`infrastructure/proxy/routes.mjs`; `CAD_PATHS` is one list, checked equal by the proxy's tests): `/cad` to cad,
  `/tasks` to work, the rest to web; `cados.kevos.com` and `work.kevos.com` (the old addresses) by host. The apps take
  their prefix off themselves (`apps/cad/opensketch/canonical.py`, `apps/work/src/worker/mount.ts`).
- **kevos.com is the KEVOS site again (Stage 0, owner's decision of 6 Nov 2026):** Cloudflare Worker
  `throbbing-block-6c61` (account `Kevinjogin@protonmail.com's Account`, route `kevos.com/*`) runs the KEVOS site built
  from `c79e297`, put back with the laptop's `bizomat.ps1 restore kevos`. Nothing from this repository publishes there:
  `wrangler.toml` is the Worker `bizomat`, and `scripts/deploy-guard.mjs` (its `[build]`) refuses any other name and any
  kevos.com route. Today the BIZOMAT website runs on Fly (`fly.website.toml`, `bizomat.ps1 deploy website`).
- **Cloudflare migration (owner's request, 6 Nov 2026; plan and progress in `docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`):**
  bizomat.ai, CAD Automation in a Cloudflare Container, Project Management as its own Worker. **Production addresses
  (owner, 7 Nov 2026), the single source of truth (that doc, "Production addresses"):** the website `https://bizomat.ai`
  (Worker `bizomat`; www answers 301 there), CAD Automation `https://bizomat.ai/cad`, its MCP endpoint
  `https://mcp.bizomat.ai/mcp` (Worker `bizomat-mcp`, its own subdomain: the one exception to "no subdomains"),
  Project Management `https://bizomat.ai/tasks`. bizomat.ai only, no other domain. `wrangler.toml` is the
  Worker `bizomat`: zone routes `bizomat.ai/*` and `www.bizomat.ai/*`, which do nothing while those records are DNS only
  (the switch is turning them to Proxied; the way back is turning them back), `workers_dev` for checks before that,
  `TASKS` bound to `bizomat-tasks` and `CAD` to `bizomat-mcp` (CADOS `cloudflare/mcp`: the CAD server's container,
  its data folder in R2). `src/worker.ts` sends `CAD_PATHS` to the `CAD` binding when bound, else to the origin.
  `apps/work/wrangler.jsonc` env `bizomat` is the Worker `bizomat-tasks` (no workers.dev address; D1
  `bizomat-tasks-db`, R2 `bizomat-tasks-files` and KV created by name on its first deploy); its data comes from Fly
  with `apps/work/scripts/migrate/to-cloudflare.mjs`. `scripts/deploy-guard.mjs` runs before every wrangler build: it
  lets `npm run preview` through, refuses Workers Builds, and deploys only from the laptop tool
  (`BIZOMAT_DEPLOY=website`) from a clean checkout that is exactly origin/main. Nothing on Cloudflare is deployed yet;
  both Fly apps stay running until the owner approves their retirement.
- **Hosts (owner's decision, 5 Nov 2026): everything under bizomat.ai, no subdomains.** The website is the root;
  CAD Automation is `/cad` and Project Management `/tasks`. `src/worker.ts` (`routeApps`) passes `/cad/...` (and
  the CAD app's OAuth discovery and root program paths, `CAD_PATHS`) to the CAD app (the `CAD` binding, else the
  origin with `fetch(request)`), and `/tasks/...` to Project Management (the `TASKS` service binding, a redirect to
  work.kevos.com where it is not bound).
  The CAD Automation product page is `/cad-automation/`, because `/cad` is the application. No page or file of the site
  may take an application's path (tests/worker.test.ts). Today bizomat.ai's record still points (DNS only) at the
  `cados` Fly app; the Worker answers once the records are proxied. The steps, in order, are in
  `docs/BIZOMAT-DEPLOYMENT.md`, section 6a (today) and section 6 (the single app).
- **Incident, 8 Oct 2026:** a manual `wrangler deploy` from a stale checkout (145 commits behind) replaced the site
  with the old GoCore design. That is why manual deploys are restricted as above.
- Keep the old deployments (the kevos.com Worker, the `workos-platform-preview` Worker behind work.kevos.com, the
  `cados` Fly app) running until BIZOMAT is verified and the rollback window has passed (`docs/BIZOMAT-ROLLBACK.md`).

## Change control

- A Library content request changes only `src/content/reados-chapters/` (and its images) and, to place a chapter in a
  book, `src/utils/reados-collections.ts`. Never recreate `/insights/`. Website-level changes (layouts, components,
  CSS, logos, navigation, legal pages) need the owner's request.
- Stage files by explicit path; never `git add -A` or `git add .` for a release; inspect `git diff --cached --stat`.
- Documentation and project-memory changes go in their own commit.
- `npm run build` regenerates brand assets with `shared/brand/build.mjs`; it writes only files whose content changed.
  Never hand-edit the copies in the apps: change `shared/brand/` and run `npm run brand`. Its copies in `apps/cad` are CADOS's
  files too: a brand change that touches them goes to CADOS in the same form, then comes back with a sync (CI checks
  both `brand:check` and `scripts/sync-cad.mjs check`).
- No personal, client or confidential data in code, tests or docs. Never commit database dumps, data folders,
  uploaded files or secrets. Migration tooling prints counts, never row content.

## Rules for every page

- Plain language, short sentences, no emojis. Light theme by default (dark only for the session).
- One design system: tokens and components from `shared/brand/` (navy `#0a1f33`, teal `#0f766e`, mark `#14b8a6`,
  Oxanium headings, Inter Tight body). No third-party fonts, scripts or trackers.
- The CSP forbids inline styles: no `style=""`; scripts are hashed by `scripts/postbuild.mjs`.
- Animations explain a product, carry an "Illustration" label, and show a finished still under reduced motion
  (`src/components/visuals/`, `src/styles/visuals.css`). Real screenshots carry "Product screen" and use example data.
- Every page has one H1, a description of 50 to 200 characters, a canonical URL and valid JSON-LD (the build fails
  otherwise).

## Commands

```bash
npm ci                 # website dependencies
npm run verify         # astro check + tests + build (brand assets, Astro, Pagefind, postbuild checks)
npm run build:server   # Node server bundle for the Fly web process (after npm run build)
npm run brand:check    # brand copies in step across the website and both apps
```

Applications: `cd apps/work && npm run check` (and `npm run test:node`, `npm run test:e2e`);
`cd apps/cad && pytest -q && npm test` (and `bash solidworks/build.sh test` with the .NET 8 SDK).
Platform: `docker compose -f infrastructure/local/compose.yml up --build`, then `node infrastructure/smoke/smoke.mjs`.

## After any production change

Check the public site, not just the build: `/`, `/cad-automation/`, `/work/`, `/resources/`, `/tools/`, `/reados/`,
`/engine-room/` (and that `/about/` and `/proof-of-work/` redirect to it), `/privacy/`, `/terms/`, `/disclaimer/`, and
every new chapter URL. Confirm the BIZOMAT wordmark and favicon, the navigation **CAD Automation, Project Management,
Resources, Engine Room** with **AI Search** and **Sign in**, that a new session opens in the light theme, and that AI
search answers. For the apps (`/cad/` and `/tasks/` on bizomat.ai, and their old hosts),
run the smoke test (`infrastructure/smoke/smoke.mjs`) against each host. Do not report anything as live until its
public URL has been checked.
