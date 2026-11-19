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
  **Project Management** (formerly KEVOS Work / WorkOS), **Resources** (formerly the kevos.com Tools and Library) and
  **Customer Relationship Management** (the CRM; 13 Nov 2026, at `bizomat.ai/crm`, served by the Project Management app
  in `apps/work` with its accounts and session; product page `/crm-platform/` and user guide `/crm-platform/guide/`;
  `docs/crm/README.md`). The name is spelled out wherever there is room, so newcomers know what a CRM is (owner,
  13 Nov 2026); "CRM" is its short form. **Finance** (13 Nov 2026, at `bizomat.ai/finance`, served by the same app with
  the same accounts and session; product page `/finance-platform/` and user guide `/finance-platform/guide/`;
  `docs/finance/README.md`): personal, household and business workspaces on a double-entry ledger. It never connects to
  banks, processes payments or lodges with the ATO, and is not a certified tax, payroll or statutory accounting
  product: never claim otherwise. **Company accounts** (13 Nov 2026, at `bizomat.ai/company`, served by the same app;
  `docs/company/README.md`): people work as a company (a person may register in their own name); a company runs one
  Project Management workspace, one CRM organisation and one Finance business workspace, gives each person a role in
  each, has departments that appear in every tool, and links them (customer record, won deal to draft invoice, deal to
  project, project costs). Registration checks say what they prove: never call an ABN "confirmed with the register"
  unless `ABR_GUID` is set and the lookup ran, or a phone number "verified" (no SMS provider).
  **BIZOMAT ERP** (owner, 14 Nov 2026; "BIZOMAT System" earlier that day, ERP in `docs/erp/`): the one workspace for
  signed-in people, **live at `bizomat.ai/erp`** (`docs/system/README.md`), served by the Project Management app with
  the same accounts and session. Every tool opens inside it, at `/erp/tasks`, `/erp/crm`, `/erp/finance` and
  `/erp/company`, with its module rail on every screen (Dashboard, My Work, Sales and CRM, Finance and Accounting,
  Projects and Tasks, Products and Engineering, Maintenance, Operations, Reports, Administration, and "Report a fault"). A page at a tool's own address, or
  at the earlier `/system`, answers 302 there (the API, files and `/finance/view/` stay); links between tools stay
  inside (`toolUrl`). People's tools are grouped by company (registered companies, plus an own company per person, not
  registered, made for every existing account by migration 0017; tools are worked out, never copied; a tool shared with
  someone shows under its company as "Shared with you"). Products and Engineering is CAD Automation's setup and
  company-scoped computers (owner and administrators see the company's, members their own, other companies nothing);
  computers appear only once CAD Automation reports (`/company/api/id/cad-status`, client `cad`): never present them as
  live before. **Maintenance** (Asset Management and Maintenance, owner's CMMS brief of 14 Nov 2026, MEX a functional
  reference only; `docs/maintenance/README.md`): Stage M1 (asset register and hierarchy, requests with approval, work
  orders, technicians, labour timer, photos and documents) is live at `/erp/c/<company>/maintenance`. Stages M2 and M3
  (ERP Release 4, part B: preventive maintenance by time, meter or condition with idempotent generation by the cron,
  readings, inspections with follow-ups, prestart checks that can set an asset out of service, parts issued through
  ERP Inventory's StockOps, trades and labour costs, downtime, sites, QR scanning and reliability reports; migration
  0024) are live since 15 Nov 2026. M4's AI scheduling assistant
  and offline field work are planned; maintenance costs are not posted to Finance.
  **ERP Release 1** (owner's brief of 14 Nov 2026; `docs/erp/release-1.md`, status by release in
  `docs/erp/STATUS.md`; merged and deployed 14 Nov 2026): the product master
  with variants, revisions with change requests and change orders (approval and release with segregation of duties),
  multi-level bills of materials, engineering documents (files or CAD references, never claimed to be on the server),
  the supplier master (ABN "format checked", linked to Finance, never copied) and their reports, at
  `/erp/c/<company>/products` and `/procurement`. **ERP Release 2** (`docs/erp/release-2.md`; merged and deployed
  15 Nov 2026; migration 0021): requisitions, requests for quotation with the
  comparison, purchase orders (approval limits, amendments, PDF; emailing the PDF is not built), goods receipts,
  supplier performance and one draft bill in Finance per receipt (through Finance's `createDoc`, never writing `fin_*`
  directly), at `/procurement`; inventory (warehouses and locations, stock by lot and serial, an append-only movement
  ledger, reservations, returns, quarantine, scrap, adjustments, counts, weighted average or FIFO valuation, QR labels,
  a warehouse screen for phones) at `/erp/c/<company>/inventory`; warehouse manager and operator roles. Stock value is
  **not** posted to Finance's ledger: it is recorded as planned (Release 3); never call it posted. **ERP Release 3**
  (`docs/erp/release-3.md`; merged and deployed 15 Nov 2026; migration 0022):
  manufacturing at `/erp/c/<company>/manufacturing`: work centres and machines (linked read only to Maintenance assets),
  routings with revisions (released by an engineering approver who did not draft them), manufacturing orders with
  materials issued through StockOps, operations, labour and machine time, output, scrap, rework, downtime, inspection
  points (full Quality is Release 4) and finished goods at actual cost, a shop-floor screen for phones, the master
  production schedule, MRP (suggestions converted to requisitions and draft orders), rough-cut capacity, job costing by
  element and eight reports; production manager and operator roles. Stock and production value are **not** posted to
  Finance's ledger: each posting is recorded as planned; never call them posted. Job profitability came with Release 5
  (no sales orders before it). **ERP Release 4 part A** (`docs/erp/release-4-quality.md`; merged and deployed
  15 Nov 2026; migration 0023): quality at `/erp/c/<company>/quality`:
  inspection plans with versions, inspections of receipts, operations, finished goods and suppliers recorded on a phone
  (the pass or fail worked out on the server from the limits), quarantine and release through StockOps, nonconformance
  reports (a Maintenance asset read only) with a disposition decided once and carried out through StockOps once per
  key, corrective and preventive actions with segregation of duties, traceability and seven reports; quality manager
  and inspector roles. Rework under an NCR is a note, not a manufacturing order; overdue actions show on the Quality
  overview, not in My Work. SPC, calibration and audits are planned.
  **ERP Release 5 part A** (`docs/erp/release-5-supply-chain.md`; migration 0025; merged and deployed
  15 Nov 2026): supply chain at `/erp/c/<company>/supply-chain`:
  sales orders for the company's one customer record (a CRM company and its Finance customer, never copied), priced as
  Finance prices lines, with amendments and a draft order from a won deal; stock allocated through StockOps (soonest
  expiry first); make to order through a linked manufacturing order with job profitability; confirmed orders as MRP
  demand; carriers, shipments with pick lists, packages, dispatch through StockOps (`sales_dispatch`, once), delivery
  with a photo, document or signature, an optional dispatch email (never for the example company), the delivery
  schedule; returns authorised by a sales manager and received through StockOps; one draft invoice per shipment and one
  draft credit note per return through Finance's own code; traceability to the delivery and seven reports; the sales
  manager role. The value of stock sold is **not** posted to Finance's ledger (recorded as planned); carrier bookings,
  landed costs and forecasting are planned.
  **BIZOMAT WHS** (Work Health & Safety Management System, owner's WHS brief of 15 Nov 2026; `docs/whs/README.md`;
  Release 1 merged and deployed 15 Nov 2026, kevinjogin/bizomat-site#74, migration 0026): the
  Health and Safety module at `/erp/c/<company>/whs`: hazards, risk assessments on the company's matrix, incidents with
  investigations, the regulator notification record, actions with evidence, confidential health records (health
  officers only) and jurisdiction packs. Every legal instrument and rule is **Not verified** until a platform
  administrator verifies it in the app: never call the product, its rules or a business using it compliant, certified
  or legally verified (`tests/whs-claims.test.ts`). BIZOMAT never decides reportability and does not submit to
  regulators. Inspections, permits, contractors, training, chemicals, PPE, emergency management, consultation, health
  surveillance and the compliance register are planned. Hours worked by site and month (reasoned, append-only history)
  and LTIFR/TRIFR, which show "Cannot be calculated" when hours are missing, are live since 15 Nov 2026
  (kevinjogin/bizomat-site#77, migration 0028, deploy run 40).
  **Free mode (owner, 19 Nov 2026, Stage 1): BIZOMAT is free for every customer**, and it supersedes the selling
  decisions in the next paragraph. Billing is locked on the server (`BIZOMAT_BILLING_LOCK`; production sets
  `WORK_BIZOMAT_BILLING_LOCK = "true"` and the entrypoint locks it by default): nobody can subscribe or be refused for
  not paying, and the console cannot open subscriptions or turn enforcement on. `/pricing/` answers 301 to `/systems/`
  and no page shows a price. Stripe stays intact and untouched (code, product, prices, tables, webhook still recording
  events); on 19 Nov 2026 Stripe held no customers, subscriptions or charges. Never unlock billing, show a price or
  add an upgrade prompt without the owner's approval (`docs/billing/README.md`, "Free mode"; `tests/pricing.test.ts`).
  **Billing** (owner's brief of 15 Nov 2026; `docs/billing/README.md`; migration 0027, kevinjogin/bizomat-site#77):
  one Stripe customer and subscription per registered company, charged per active member, monthly, AUD; prices only
  from Stripe Price ids in `WORK_STRIPE_*`; embedded Checkout on the ERP's billing page; signed idempotent webhook; seat
  changes after every membership change; entitlements on the server (off by default). **Production takes live Stripe
  settings only** (owner, 15 Nov 2026): the app refuses test mode when ENVIRONMENT is production and the deploy stages
  Stripe keys only for live; never put sandbox keys or test checkout on bizomat.ai. **The price** is the owner's live
  Stripe price (created by the owner, 15 Nov 2026): product `prod_VdED2AiKMDhIgM` "BIZOMAT Business Subscription",
  price `price_1UbyE5Rs74vQph6MdBU51OeG`, AUD 10.00 per user per month; `fly.website.toml` names it and sets live, and
  `src/config/pricing.ts` (the pages' one source) must name the same id (`tests/pricing.test.ts`). **GST exclusive**
  (owner, 15 Nov 2026): Stripe Tax holds an active Australian registration (default exclusive), production sets
  `WORK_STRIPE_AUTOMATIC_TAX = "on"`, and the pages say "plus GST" (A$11.00 including 10% GST in Australia). The app
  refuses to sell a live price whose tax behaviour is not set (`checkPrice`): the live price must say exclusive in
  Stripe. An annual price (`price_1UbyE6Rs74vQph6MNviG9cbJ`, AUD 100.00 a year) exists in Stripe and is not offered. Deployed
  15 Nov 2026 (#77 and #78, deploy run 40, d5ae6ca): billing is **off** in production because none of the three live
  Stripe secrets is a repository secret yet (the run's summary names them). Billing is on only once the live secret key, publishable key and webhook
  signing secret are repository secrets; even then nobody can subscribe until the founder opens subscriptions in the
  console. Never create or change Stripe products or prices without the owner's approval; never charge a real card in
  testing without it; never call BIZOMAT's invoices tax invoices or its billing tax compliant. The example company,
  own companies, CAD Automation and the public Resources are never billed.
  **Example company** (owner, 14 Nov 2026; `src/worker/system/example.ts`, migration 0019): every account gets its own
  "Acme Studio (example)" of invented data in every tool on its first ERP visit, made through the app's own API; only
  its owner sees it, nobody can be invited to it, it sends no email, it is counted apart in the console, and it is
  removed (and made again only on request) in Administration. **Operations** beyond Releases 1 to 5 (stock,
  production and maintenance postings to Finance, carrier systems, landed costs, forecasting) is **planned, not
  built**: never present it as working. The design preview is retired (owner, 14 Nov 2026: no links to previews or demos anywhere): not built into
  the image, and `/system-preview/` and `/erp-design-preview/` answer 301 to `/systems/erp/`. The platform
  console is `/erp/admin` (platform admins only).
  **Systems** (owner, 14 Nov 2026): the public catalogue of the software at `bizomat.ai/systems/`
  (`src/config/systems.ts`, one source), a page and a user guide per system: BIZOMAT ERP (Business Management System,
  `/systems/erp/`), BIZOMAT CRM (Customer Management System, `/systems/crm/`), BIZOMAT Finance (Finance Management
  System, `/systems/finance/`), BIZOMAT Projects (Project Management System, `/systems/projects/`), BIZOMAT Engineering
  Automation (Engineering Automation System, `/systems/engineering/`; the application is CAD Automation, own sign-in
  for now) and BIZOMAT Manufacturing and Operations (`/systems/manufacturing/`, guide `/systems/manufacturing/guide/`:
  Maintenance, Procurement and Inventory work in the ERP today, Manufacturing since Release 3, Quality and Maintenance
  M2 and M3 since Release 4, and Supply Chain with Release 5 part A; the owner asked for it to turn green once every
  tool works, so it is Available since Release 5 part A was deployed (15 Nov 2026), with what is not built inside it labelled Planned). The old product pages
  (`/work/`, `/cad-automation/`, `/crm-platform/`, `/finance-platform/`, their guides, `/products/`) answer 301 there
  (`public/_redirects`). Systems are the software; **Resources stay free and public**, never behind a sign-in.
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
  which is kept unchanged as an archive: never push there). `kevinjogin/bizomat-site` and `kevinjogin/bizomat-cad`
  are public since 14 Nov 2026 (owner; private from 7 Nov): everything committed is readable by anyone, so never commit
  a secret, a token, personal data or a data dump (GitHub's secret scanning watches both; a history scan for keys and
  tokens found none that day). Public Actions minutes are free. Downloads stay on bizomat.ai (`/downloads/`, the R2
  bucket `bizomat-downloads`, `src/server/downloads.ts`; on Fly read with an Object Read only R2 token, 404 until the
  owner adds it: `docs/SITE-CAD-INTEGRATION.md` section 6), not GitHub releases. Before any work:
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

- Plain language, short sentences, no emojis. Theme (owner, 13 Nov 2026): every page and application opens in the
  computer's system theme (light or dark); a choice made with the theme switch is remembered on that computer only
  (localStorage `bizomat-theme`, shared by the website and the apps under bizomat.ai), never on the account, so the same
  account on another computer follows that computer's system theme.
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

Check the public site, not just the build: `/`, `/systems/` and every system's page and guide (`/systems/erp/`,
`/systems/crm/`, `/systems/finance/`, `/systems/projects/`, `/systems/engineering/`, `/systems/manufacturing/`, each
with `guide/`), that the old product pages answer 301 there, `/resources/`, `/tools/`, `/reados/` (open
without signing in),
`/engine-room/` (and that `/about/` and `/proof-of-work/` redirect to it), `/privacy/`, `/terms/`, `/disclaimer/`,
that `/system-preview/` (the retired design preview) answers 301 to `/systems/erp/`, `/robots.txt` and `/llms.txt`
(`docs/seo/README.md`), `/erp/` (BIZOMAT ERP, signed in, answering X-Robots-Tag noindex; the tools inside it at
`/erp/tasks/`, `/erp/crm/`, `/erp/finance/`, `/erp/company/`; `/system/` answers 302 there), and every new chapter URL.
Confirm the BIZOMAT wordmark and favicon, the navigation **Home, Systems, Resources, About, Contact** (owner,
14 Nov 2026) with **AI Search** and **Sign in** (BIZOMAT ERP; Engineering Automation), that a new visit opens in the
computer's system theme, and that AI
search answers. For the apps (`/cad/`, `/erp/`, and `/tasks/`, `/crm/`, `/finance/`, `/company/`, `/system/` on bizomat.ai, and their old hosts),
run the smoke test (`infrastructure/smoke/smoke.mjs`) against each host. Do not report anything as live until its
public URL has been checked.
