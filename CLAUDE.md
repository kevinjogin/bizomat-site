# BIZOMAT platform: permanent project instructions

Read this file, `docs/BIZOMAT-PROJECT-STATUS.md`, `docs/BIZOMAT-ARCHITECTURE.md` and, for Library content,
`docs/KEVOS_READOS_PUBLISHING.md` before any change. Each application has its own instructions too:
`apps/cad/CLAUDE.md` (CAD Automation) and the docs in `apps/work/` (Project Management).

## Identity

- **BIZOMAT is the active brand** (owner decision, 5 Nov 2026): "Intelligent Business Automation Platform";
  statement "Automate work. Connect systems. Get business done." Products: **CAD Automation** (formerly CADOS),
  **Project Management** (formerly KEVOS Work / WorkOS) and **Resources** (formerly the kevos.com Tools and Library).
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
| `apps/cad/` | CAD Automation (Python server, C# add-in and Companion, installer); full CADOS history via `git subtree` |
| `apps/work/` | Project Management (Hono Worker + React SPA, Node runtime, migrations, migration tooling); PMO history |
| `shared/brand/` | Logo geometry, generated assets, tokens, components, fonts (`build.mjs` copies them into every product) |
| `infrastructure/`, `fly.toml` | The single Fly.io app `bizomat`: proxy, Dockerfile, entrypoint, compose stack, smoke tests, migration scripts |
| `docs/BIZOMAT-*.md` | Architecture, data inventory, migration, deployment, security, rollback, operations, status |

## Source of truth

- **GitHub `jogkev-creator/gocore-website`, branch `main`** (the repository name is historical). Before any work:
  `git fetch origin`, and confirm the working branch is at or ahead of `origin/main` with no unexplained local changes.
  Preserve uncommitted work on a backup branch before anything else.
- The original repositories `jogkev-creator/CADOS` and `jogkev-creator/PMO` still deploy the current production
  apps until cutover. Do not change their deployments from here.
- Never merge older GoCore branches into `main`.

## Deployment

- **Target:** one Fly.io app `bizomat` (Sydney) with process groups proxy, web, work and cad, deployed by
  `.github/workflows/bizomat-deploy.yml` (manual) with an org-scoped `FLY_API_TOKEN`. See `docs/BIZOMAT-DEPLOYMENT.md`.
  DNS changes (bizomat.ai, cad/work subdomains, kevos.com, cados.kevos.com, work.kevos.com) are made by hand only
  after the new app passes its smoke tests; never automate them from CI.
- **Current kevos.com:** Cloudflare Worker `throbbing-block-6c61` (account `Kevinjogin@protonmail.com's Account`,
  route `kevos.com/*`). Cloudflare's GitHub integration builds and deploys every push to `main`, so **merging to
  `main` publishes the BIZOMAT website at kevos.com**. Merge only when that is intended (or disconnect the integration
  after bizomat.ai is live). Manual `npm run deploy` only from a clean checkout whose `HEAD` equals `origin/main`,
  right after `npm run verify`.
- **Hosts (owner's decision, 5 Nov 2026): everything under bizomat.ai, no subdomains.** The website is the root;
  CAD Automation is `/cad` and Project Management `/tasks`. `src/worker.ts` (`routeApps`) passes `/cad/...` (and
  the CAD app's OAuth discovery and root program paths, `CAD_PATHS`) to the CAD app with `fetch(request)`, and
  `/tasks/...` to Project Management (the `TASKS` service binding, a redirect to work.kevos.com until it is bound).
  The CAD Automation product page is `/cad-automation/`, because `/cad` is the application. No page or file of the site
  may take an application's path (tests/worker.test.ts). Today bizomat.ai's record still points (DNS only) at the
  `cados` Fly app; the Worker answers once the records are proxied. The steps, in order, are in
  `docs/BIZOMAT-DEPLOYMENT.md`, section 6a.
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
  Never hand-edit the copies in the apps: change `shared/brand/` and run `npm run brand`.
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

Check the public site, not just the build: `/`, `/cad/`, `/work/`, `/resources/`, `/tools/`, `/reados/`,
`/engine-room/` (and that `/about/` and `/proof-of-work/` redirect to it), `/privacy/`, `/terms/`, `/disclaimer/`, and
every new chapter URL. Confirm the BIZOMAT wordmark and favicon, the navigation **CAD Automation, Project Management,
Resources, Engine Room** with **AI Search** and **Sign in**, that a new session opens in the light theme, and that AI
search answers. For the apps,
run the smoke test (`infrastructure/smoke/smoke.mjs`) against each host. Do not report anything as live until its
public URL has been checked.
