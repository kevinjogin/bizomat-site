# BIZOMAT: permanent project instructions

Read this file, `README.md` and `docs/BIZOMAT-SINGLE-APP.md` before any change. CAD MCP has its own instructions in
`apps/cad/CLAUDE.md`; Task Management's docs are in `apps/work/`.

## Identity

- **BIZOMAT is the brand** (owner, 5 Nov 2026), the parent of every product. Corporate language (owner, 8 Nov 2026;
  one source, `src/config/platform.ts`): descriptor "Business Intelligence & Automation"; slogan "Connecting
  Intelligence. Empowering Progress."; supporting message "Technology Connected. Progress Delivered."; the corporate
  introduction, description and footer line there. Logo, layout, colours (navy and teal) and product names stay.
  Products: **CAD Automation** (CAD MCP; the Windows add-in is **BIZOMAT CAD**, owner 8 Nov 2026; formerly CADOS) and
  **Project Management** (Task Management; formerly KEVOS Work). Resources was retired on 8 Nov 2026.
- **KEVOS is the former name.** KEVOS® is a registered Australian trade mark (No. 2469816); BIZOMAT is **not**
  registered. Never write "®" or "TM" after BIZOMAT and never call it registered.
- **GoCore is retired** for good: no GoCore branding, logos or templates.
- The founder, **Kevin Jogin**, is named only on The Engine Room (`/engine-room/`), signing as "Founder, BIZOMAT".
  Never invent biography, qualifications, employers, awards, clients, projects, results, statistics, prices,
  partnerships, testimonials or customer logos. Product claims come only from the code
  (`src/data/platform-catalog.ts` says where each comes from).
- The legal entity, ABN and address are not recorded: never invent them.

## Source of truth and production

- **GitHub `jogkev-creator/bizomat`, branch `main`**, private. `jogkev-creator/CADOS` and
  `jogkev-creator/gocore-website` are history only (CADOS also keeps the old installer backups): do not change them
  for new work, do not delete them.
- **Production is one Fly.io app, `cados`, with one Machine in `syd` of 1 GB** (`fly.toml`, checked by
  `infrastructure/fly/test/check-config.py`). It runs `bizomat-entrypoint all`: CAD MCP (`apps/cad`, :8001), Task
  Management (`apps/work`, :8002) and the proxy (:8080, the only public port) with the website inside it.
  Never add a Machine, a process group or memory without the owner's approval; never set
  `OPENSKETCH_CAD_WORKERS` above 0 at 1 GB (each CAD worker process is about 400 MB).
- **Deploys only through GitHub Actions** (`deploy.yml`, on push to `main`, after the whole CI). Nothing is deployed
  from a laptop. Secrets live in GitHub Secrets (`FLY_API_TOKEN`, ...) and Fly secrets; never in the repository.
- Domains: `bizomat.ai` (primary; `www` 301 there), `cados.fly.dev` (every path to CAD MCP: connectors and paired
  computers use its root paths). DNS changes are the owner's, by hand, after the checks pass.
- Routing (`infrastructure/proxy/routes.mjs`, the same `CAD_PATHS` as `src/server/platform-paths.ts`, checked equal by
  the tests): on bizomat.ai `/cad/...` and CAD's root program paths (`/mcp`, `/solidworks/mcp`, `/oauth/...`, `/v2/...`,
  `/healthz`, `/.well-known/oauth-*`) to CAD MCP, `/tasks/...` to Task Management, the rest to the website. No page of
  the website may take an application's path (`tests/worker.test.ts`). Never change MCP endpoints, OAuth paths or the
  device API: AI clients and SOLIDWORKS computers depend on them.
- Data: one volume, `opensketch_data`, at `/data`: `/data/cad` (CAD MCP: accounts, OAuth, the bridge signing key,
  `bridge.sqlite`, installer record) and `/data/work` (Task Management's SQLite and files). Deploys snapshot it first.
  Never delete data, keys or backups; restores move what was there to `/data/backups` (infrastructure/migrate).

## Repository layout

| Path | What |
| --- | --- |
| `/` | The website (Astro): `src/`, `public/`, `tests/`, `scripts/`; Node server in `src/node/` |
| `apps/cad/` | CAD MCP and BIZOMAT CAD for Windows; changed here (imported from CADOS e669cc6, `apps/cad-source.json`) |
| `apps/work/` | Task Management (Project Management) |
| `shared/brand/` | Brand system copied into every product (`npm run brand`; `npm run brand:check` in CI) |
| `infrastructure/` | Image, entrypoint, proxy, migration tools, smoke test, local compose stack |
| `docs/` | `BIZOMAT-SINGLE-APP.md` (current), and the earlier platform docs (architecture, security, rollback) |

## Change control

- Website-level changes (layouts, components, CSS, logos, navigation, legal pages) need the owner's request. The site
  has four sections (Home, CAD Automation, Work, The Engine Room) plus contact, sign-in and legal pages; do not add
  sections or bring back Resources pages (`tests/site-structure.test.ts`).
- Legal pages (privacy, terms, disclaimer) changed on 8 Nov 2026 only to remove the retired features; their content
  still needs a lawyer's review (`docs/BIZOMAT-PROJECT-STATUS.md`, "Legal review").
- Stage files by explicit path; inspect `git diff --cached --stat` before committing. Documentation changes in their
  own commit where practical.
- `npm run build` regenerates brand assets; never hand-edit the copies in the apps: change `shared/brand/`.
- No personal, client or confidential data in code, tests or docs. Never commit database dumps, data folders,
  uploaded files or secrets. Migration tooling prints counts, never row content. No workflow uploads data as an
  artifact (`tests/artifact-policy.test.ts`).

## Rules for every page

- Plain language, short sentences, no emojis. Light theme by default (dark only for the session).
- One design system: tokens and components from `shared/brand/` (navy `#0a1f33`, teal `#0f766e`, mark `#14b8a6`,
  Oxanium headings, Inter Tight body). No third-party fonts, scripts or trackers.
- The CSP forbids inline styles: no `style=""`; scripts are hashed by `scripts/postbuild.mjs`.
- Animations explain a product, carry an "Illustration" label and show a still under reduced motion; keep them few.
- Every page has one H1, a description of 50 to 200 characters, a canonical URL and valid JSON-LD (the build fails
  otherwise). Retired sections must not be built again (the post-build check fails).

## Commands

```bash
npm ci && npm run verify          # website: astro check, tests, build with its quality gate
npm run build:server              # the website's Node bundle (the proxy hosts it)
node --test 'infrastructure/proxy/test/*.test.mjs'
sudo bash infrastructure/fly/test/single-app.test.sh
python3 infrastructure/fly/test/check-config.py fly.toml
```

Applications: `cd apps/work && npm run check` (and `npm run test:node`); `cd apps/cad && pytest -q && npm test`, and
`bash solidworks/build.sh test` (.NET 8 SDK) for the add-in.

## After any production change

The Deploy workflow's summary is the first check (one Machine, syd, 1024 MB, version, smoke test, memory, public
checks). Then the public site: `/`, `/cad-automation/`, `/work/`, `/engine-room/`, that `/resources/` answers 301,
`/tasks/` sign-in, `/cad/` sign-in, and an MCP connection from an AI app. Do not report anything as live until its
public URL has been checked.
