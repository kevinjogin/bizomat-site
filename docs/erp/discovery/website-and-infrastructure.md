# ERP discovery: the website and the infrastructure

Status: read-only discovery for the ERP architecture assessment, 13 Nov 2026. Nothing was changed, deployed or run
against production.

How this was written:

- From branch `claude/keen-bardeen-tb2f86` (commit `dbc6128`). Production runs `main` at `91f76be` (deploy run 21,
  13 Nov 2026). This branch is ahead of `main` by Finance Stage 1 (migration `0015_finance_sales.sql`).
- This session could not reach Fly.io (no token; the Fly connector did not connect). Production facts come from the
  repository: `fly.website.toml` (Machines and volume as read from Fly on 9 Nov 2026), `docs/SITE-CAD-INTEGRATION.md`
  (both Fly apps, read on 9 Nov 2026) and the release log in `docs/BIZOMAT-PROJECT-STATUS.md`.
- Local figures (build sizes, file and schema counts) were measured in this checkout, not in the production image.
- Where the repository says nothing, this file says "not recorded" and lists the measurement to take (section 8.10).
- Older documents describe an earlier plan (section 9, item 20). Where they disagree, this file follows
  `fly.website.toml`, `.github/workflows/bizomat-deploy.yml` and `CLAUDE.md`.

---

## Summary for the architect

- **Production is one Fly app, `bizomat`, in Sydney (`syd`), with three Machines:** proxy (shared-cpu-1x, 256 MB),
  web (shared-cpu-1x, 512 MB) and work (shared-cpu-1x, 512 MB). One volume, `work_data` (3 GB), on work
  (`fly.website.toml`, read from Fly on 9 Nov 2026).
- **The work Machine already runs four products in one Node.js process:** Project Management (`/tasks`), the CRM
  (`/crm`), Finance (`/finance`) and Company accounts (`/company`). An ERP module in `apps/work` would be the fifth, on
  the same 512 MB, the same shared vCPU, the same event loop and the same SQLite file.
- **The database is one SQLite file** (`/data/work/db.sqlite`), opened with Node's synchronous `node:sqlite` driver. Every
  query runs on the one JavaScript thread. A slow query or a large report pauses every other request on that Machine.
- **Production schema:** 136 tables, 182 named indexes and 6 triggers through migration 0014 (144 tables with 0015,
  which is on this branch only). Counted by applying `apps/work/migrations/*.sql` to an in-memory SQLite database.
- **Only one data size is recorded:** at the move from Cloudflare on 6 Nov 2026 the database held 47 tables, 270 rows
  and 4 files (`docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`, section 3). Live memory, CPU, database size and disk use are
  not recorded anywhere. They must be measured on Fly (section 8.10).
- **No Machine may be added, removed or resized without the owner's approval.** The deploy preflight
  (`.github/scripts/fly-preflight.py`) stops any deploy that would do so. work can never have a second Machine (its
  volume and SQLite file belong to one Machine).
- **There is no staging environment, no swap, no load test and no memory metric** in the repository.
- **The image is built from scratch on a GitHub runner for every deploy** and still contains CAD Automation
  (Python, OpenCascade, the .NET add-in), which this app no longer runs. Recorded sizes: about 2.6 GB as an image
  (CI, 5 Nov 2026) and 601 MB pushed (deploy, 12 Nov 2026).
- **AI Search** ranks results in the browser over a static index (`/discovery-index.json`). The server only asks
  Cloudflare Workers AI for search terms and picks by number. Without an AI key it falls back to keywords; without
  JavaScript it falls back to Pagefind.
- **CAD Automation is a separate Fly app, `cados`, in Amsterdam (`ams`)**, reached by the router over Fly's private
  network. It is not deployed from this repository.
- **Configuration gap found:** the settings `ABR_GUID` and `BIZOMAT_ID_CLIENTS`, which `docs/company/README.md` says
  to set as Fly secrets, cannot reach the work app on Fly (section 9). Any new ERP setting must be added to the
  entrypoint's allow-list and to the Node config, or it will be silently ignored.

---

## 1. Website architecture

### 1.1 What it is

The website is a static Astro 7 site, served by a small Node.js server on the `web` Machine. It holds no customer data
and no database. Every page is built from Git at build time.

| Part | Path |
| --- | --- |
| Pages | `src/pages/` (Astro), content in `src/content/` (Library chapters and books) and `public/tools/` (Tools) |
| Layout and components | `src/layouts/`, `src/components/`, `src/components/visuals/` (illustrations) |
| Site settings and navigation | `src/config/site.ts` |
| Corporate language and app addresses | `src/config/platform.ts` |
| Public product facts | `src/data/platform-catalog.ts` (each claim names its source file in `apps/`) |
| Server code for the site's APIs | `src/worker.ts`, `src/server/` |
| Node host for that code | `src/node/server.ts`, `src/node/assets.ts`, `src/node/bindings.ts` |
| Brand assets | `shared/brand/` (copied into every product by `shared/brand/build.mjs`) |

### 1.2 Build

`npm run build` (`package.json`) runs four steps in order:

| Step | Command | What it does |
| --- | --- | --- |
| 1 | `node shared/brand/build.mjs` | Writes the logos, icons, tokens and fonts into the site and both apps (only files whose content changed) |
| 2 | `astro build` | Static output, one folder per page (`build.format: 'directory'`, `trailingSlash: 'always'`), stylesheets always external (`inlineStylesheets: 'never'`) so the CSP can forbid inline styles (`astro.config.mjs`) |
| 3 | `pagefind --site dist` | The full-text index for `/search/` (`dist/pagefind/`) |
| 4 | `node scripts/postbuild.mjs` | Writes `dist/_headers` with a strict Content-Security-Policy that lists a hash for every inline script; bundles `dist/_worker.js`; then a quality gate that fails the build on missing metadata, more or fewer than one H1, broken internal links, invalid JSON-LD, drafts, feeds or the search index |

`npm run build:server` (`scripts/build-server.mjs`) then bundles `src/node/server.ts` into `dist-server/server.mjs`.

Size of the build in this checkout: `dist/` 392 MB in 8,742 files and 4,632 HTML pages (Library 238 MB, Tools 88 MB,
Pagefind 35 MB, `assistant-knowledge.json` 14 MB for the switched-off assistant, `discovery-index.json` 2.1 MB);
`dist-server/` 108 KB. The status log records 4,633 pages verified on 13 Nov 2026. The Dockerfile notes about
3 minutes for this build (stage `web-static`).

### 1.3 The Node server (the `web` process)

`src/node/server.ts` runs the same request handler as the Cloudflare Worker (`src/worker.ts`) on Node 22. It replaces
Cloudflare's bindings with Node versions:

| Binding | On Node (Fly) | Source |
| --- | --- | --- |
| `ASSETS` (static files) | Served from `dist/` with Cloudflare's `_headers` and `_redirects` rules, `404.html` for unknown paths, brotli or gzip compressed on first request and kept in a 64 MB in-memory cache, ETags | `src/node/assets.ts` |
| `CHAT_LIMITER`, `FORM_LIMITER` | In-memory fixed windows per client address: 10 and 5 requests a minute | `src/node/bindings.ts` |
| `AI` | Cloudflare Workers AI over its REST API, only when `CF_ACCOUNT_ID` and `CF_AI_TOKEN` are set; 20 s per call | `src/node/bindings.ts` |
| `DOWNLOADS` (R2), `EMAIL`, `CONTACT_RATE_LIMIT` (KV), `DISCOVERY_EVENTS`, `TASKS`, `CAD` | Not provided | `buildEnv()` in `src/node/server.ts` |

What it serves:

- `GET /healthz`: `{status, service, version, ai}`. The `ai` field says whether an AI provider is configured. It does not
  touch the rest of the code.
- Every page and file of `dist/`. `public/_redirects` holds 1,638 lines of redirects for retired URLs.
- The site's own APIs (`src/worker.ts`):

| Path | Handler | Purpose |
| --- | --- | --- |
| `POST /api/discover` | `src/server/discover/handler.ts` | AI Search: search terms and picks (section 2) |
| `POST /api/discover/event` | same file | Anonymous search statistics; on Fly accepted and discarded (no binding) |
| `POST /api/learn/{intent,plan,lesson,ask}` | `src/server/learn/handler.ts` | Learning paths built from the Library and Tools |
| `POST /api/chat` | `src/server/chat/handler.ts` | The old assistant. The widget is off (`SITE.assistant.enabled = false`), but the endpoint answers |
| `POST /api/contact` | `src/server/contact/handler.ts` | Contact form. On Fly it asks people to email info@bizomat.ai (no mail binding) |
| `POST /api/assessment`, `/api/assessment/stripe-webhook` | `src/server/assessment/` | Problem Assessment enquiries; optional Stripe check |
| `GET /downloads/<folder>/<file>` | `src/server/downloads.ts` | Public downloads from the R2 bucket `bizomat-downloads`. On Fly there is no bucket binding, so the code answers 404 |

Limits: request bodies of 1 MiB (`MAX_BODY`), request timeout 120 s, header timeout 60 s, keep-alive 75 s. The client
address for rate limits comes from the proxy's headers (`WEB_TRUST_PROXY=1`). Each request writes one JSON log line
(method, path without query, status, time in ms).

Every response gets security headers (`withHeaders()` in `src/worker.ts`, `src/server/security.ts`): the build-time
CSP, HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, Permissions-Policy, COOP. API responses get a locked
CSP and `no-store`. `/_astro/` files are cached for a year. Preview hosts (`*.fly.dev`) get `X-Robots-Tag: noindex`.

### 1.4 The Cloudflare Worker (prepared, not deployed)

`wrangler.toml` defines the Worker `bizomat` for a planned move to Cloudflare. Nothing on Cloudflare is deployed
(`CLAUDE.md`). It would serve `dist/` and run `src/worker.ts`, whose `routeApps()` passes `CAD_PATHS` to the Worker
`bizomat-mcp` and `/tasks`, `/crm`, `/finance`, `/company` to the Worker `bizomat-tasks` (service bindings `CAD`,
`TASKS`), with the bindings `DOWNLOADS` (R2 `bizomat-downloads`), `AI`, `EMAIL` and two rate limiters. Its zone routes act
only if the bizomat.ai records are switched to "Proxied". `scripts/deploy-guard.mjs` refuses Workers Builds, any other
Worker name, any kevos.com route, and any deploy but the owner's laptop tool from a clean `origin/main`. The same
handler code runs on Node today, so website changes must keep working on both.

### 1.5 Main routes

| Route | What |
| --- | --- |
| `/` | Homepage: the AI Search box (`#ai-search`), the five products, the corporate introduction |
| `/cad-automation/`, `/work/` | CAD Automation and Project Management product pages (`/cad` is the application) |
| `/crm-platform/`, `/finance-platform/` and their `/guide/` | CRM and Finance product pages and user guides |
| `/resources/`, `/tools/...`, `/reados/...`, `/library/` | Resources hub, Tools, Library, guides and articles |
| `/engine-room/` | The Engine Room (`/about/` and `/proof-of-work/` answer 301 here, `public/_redirects` lines 3 to 6) |
| `/products/`, `/solutions/`, `/services/`, `/how-it-works/`, `/industries/`, `/factory-fix/` | Product and service pages |
| `/assessment/`, `/contact/`, `/sign-in/` | Enquiry forms; the platform's sign-in page |
| `/search/` | Pagefind search; also where AI Search goes without JavaScript |
| `/privacy/`, `/terms/`, `/disclaimer/` | Legal pages |
| `/discovery-index.json`, `/discovery-details.json`, `/learning/<book>.json` | Static data for AI Search and learning paths |

The website must never own an application's path (`/cad`, `/tasks`, `/crm`, `/finance`, `/company`); a test checks
this (`tests/worker.test.ts`).

### 1.6 Navigation

The header (`src/components/Header.astro`) reads three lists from `src/config/site.ts`:

| Header item | Menu entries (from `NAV`) |
| --- | --- |
| CAD Automation | Product page, How it works, What it can build, Tools your assistant can call, Set up in four steps, User guide (`/cad/docs`), Open CAD Automation (`/cad/login`) |
| Project Management | Product page, Plan and track work, Views, Teams and permissions, Automations, Dashboards, Open Project Management (`/tasks/login`) |
| Customer Relationship Management ("CRM" where the row is narrow) | Product page, User guide, Open the CRM (`/crm/login`) |
| Finance | Product page, User guide, Open Finance (`/finance/login`) |
| Resources | Tools, Library, Guides and articles, Learning paths, All resources |
| Engine Room | The Engine Room, From the founder, Test record, Products, Contact |
| AI Search (`AI_SEARCH`) | A link to `/#ai-search` |
| Theme switch | `ThemeToggle.astro`: system theme by default, a choice kept in localStorage `bizomat-theme` on that computer |
| Sign in (`SIGN_IN`) | Project Management, CAD Automation, Customer Relationship Management, Finance |

Up to 1140 px wide the header uses its menu button; between 1141 and 1300 px the links sit closer and AI Search shows
its icon only (`Header.astro`, media queries). The footer (`src/components/Footer.astro`) takes its product, resource,
company, sign-in and legal links from `FOOTER_NAV` in the same file, plus the slogan, the short description and the
copyright line.

### 1.7 The Sign in menu and the apps

- The menu entries come from `APP_LINKS` in `src/config/platform.ts`, built from `APP_URLS`:
  `https://bizomat.ai/tasks/login`, `/cad/login`, `/crm/login`, `/finance/login`. Each can be overridden at build time
  (`PUBLIC_WORK_APP_URL`, `PUBLIC_CAD_APP_URL`, `PUBLIC_CRM_APP_URL`, `PUBLIC_FINANCE_APP_URL`).
- `/sign-in/` (`src/pages/sign-in.astro`) explains the same four choices.
- The proxy sends `bizomat.ai/login`, `/log-in`, `/signin` and `/logon` (any case) to `/sign-in/` with a 301
  (`infrastructure/proxy/routes.mjs`, `SIGN_IN_ALIASES`).
- Project Management, the CRM, Finance and Company accounts share one account store and one session. Under a base
  path the session cookie is `__Secure-workos_sid` (`apps/work/src/worker/auth/session.ts`), written for each mount
  (`/tasks`, `/crm`, `/finance`, `/company`; `apps/work/src/worker/mount.ts`).
- CAD Automation keeps its own accounts on the `cados` app. Single sign-on through the work app is built
  (`/company/authorize`, `docs/company/README.md`) but not configured (section 9).
- Company accounts (`/company/login`) have no entry in the Sign in menu, the footer or `/sign-in/`. An ERP front door
  would be a new navigation decision for the owner (website-level change, `CLAUDE.md`, "Change control").

---

## 2. AI Search

### 2.1 How it works, end to end

Design record: `docs/discovery/ARCHITECTURE.md`. Code: `src/lib/discovery/` (browser), `src/server/discover/handler.ts`
and `src/server/ai/provider.ts` (server).

1. A visitor types a question in the homepage box (`/#ai-search`). The header's "AI Search" link goes there.
2. The browser loads `/discovery-index.json` once (a static file, cached) and makes a shortlist of up to 24 catalogue
   entries close to the question: keywords, synonyms (`src/lib/discovery/synonyms.ts`), spelling correction
   (`src/lib/discovery/search.ts`, `shortlist()`).
3. The browser shows a keyword result and a workflow "solution path" at once (`src/lib/discovery/plan.ts`).
4. It posts `{question, context, candidates}` to `POST /api/discover`.
5. The server checks the request (same origin, JSON, at most 12,000 bytes, question at most 500 characters), applies
   the rate limit, and asks the AI model for one JSON object: a short restatement, 4 to 10 search terms, picks by
   number from the shortlist, the question type, 2 to 5 steps that refer to entries by number, missing information,
   assumptions and the expected outcome (`SYSTEM_PROMPT`).
6. The server validates the reply (`parseIntent()`, `parsePlan()`): plain short text only, no links, no markup, no
   stated numeric results, picks only from the shortlist, mapped back to the catalogue ids the browser sent. The AI
   cannot add a resource.
7. The browser re-ranks with BM25 over name, question, description, keywords and category, puts the AI's picks first
   (labelled as AI picks), and replaces the keyword path with the AI path in place.
8. Any failure, timeout or missing provider returns `{ok: true, ai: false}`. The browser keeps its keyword result.
9. Without JavaScript, the box submits to `/search/`, which uses Pagefind.

Learning paths (`/api/learn/*`, `src/server/learn/handler.ts`) use the same provider and the same validation style,
with per-book chapter outlines from `/learning/<book>.json`.

### 2.2 The index

- Built at build time by `src/utils/discovery-index.ts`, served as `/discovery-index.json`
  (`src/pages/discovery-index.json.ts`). Tool inputs and outputs for the solution path: `/discovery-details.json`.
- Sources: the Tools (`public/tools/`, `src/utils/workos-tools.ts`), the Library (`src/content/`,
  `src/utils/reados-collections.ts`), the reviewed knowledge links (`src/data/knowledge-links.json`) and the public
  platform pages (`src/data/platform-catalog.ts`).
- Counts in this checkout's build: 1,055 tools, 237 books, 2,527 chapters, 1,064 knowledge links, 43 platform pages.
  (`docs/BIZOMAT-ARCHITECTURE.md` still shows older counts.)
- Public content only. `tests/platform-catalog.test.ts` checks that no application data can enter the index.
- No vector index and no embeddings. Vectorize was considered and not taken (`docs/discovery/ARCHITECTURE.md`,
  section 4).

### 2.3 Model provider

- Cloudflare Workers AI. On Fly it is called over the REST API
  (`https://api.cloudflare.com/client/v4/accounts/<id>/ai/run/<model>`, `src/node/bindings.ts`).
- Models: `@cf/meta/llama-4-scout-17b-16e-instruct`, then `@cf/meta/llama-3.1-8b-instruct-fp8` as fallback
  (`DEFAULT_MODELS`, `src/server/ai/provider.ts`). The code accepts `DISCOVER_MODEL`, `CHAT_MODEL` and
  `CHAT_FALLBACK_MODEL` overrides, but on Fly they cannot reach the web process (not on its allow-list, section 5.9),
  so the defaults are what runs.
- Settings that turn it on: the Fly secrets `CF_ACCOUNT_ID` and `CF_AI_TOKEN`, passed to the web role only.
- Whether they are set in production is not recorded. `GET /healthz` on the web process reports it (`"ai": true`).
- `ANTHROPIC_API_KEY` is on the web role's allow-list (`infrastructure/fly/entrypoint.sh`) and in the deploy workflow's
  list of optional secrets, but no website code reads it (`buildEnv()` does not pass it). It has no effect today.

### 2.4 Limits

| Limit | Value | Source |
| --- | --- | --- |
| Question length | 500 characters | `MAX_QUESTION` |
| Request body | 12,000 bytes (discover), 2,000 (event) | `handleDiscover`, `handleDiscoverEvent` |
| Shortlist | 24 entries | `readCandidates()` |
| Time budget for the AI step | 15 s for both models together (primary gets three quarters); `DISCOVER_TIMEOUT_MS` is read on Cloudflare only | `AI_TIMEOUT_MS`, `completeJson()` |
| Reply size | 900 tokens, temperature 0.1 | `handleDiscover` |
| Per-client burst limit on Fly | 10 requests a minute per scope (`discover`, `learn`, `chat`), in memory on the one web Machine | `src/worker.ts`, `memoryLimiter()` |
| Hourly limit | 60 an hour (discover), 120 (learn), only with the KV binding `CONTACT_RATE_LIMIT`; not active on Fly | `src/server/contact/rate-limit.ts` |
| Learning budgets | intent 14 s, plan 70 s, lesson 65 s, ask 30 s | `docs/discovery/ARCHITECTURE.md`, section 5 |
| Provider capacity | Workers Free plan: 10,000 neurons a day (about 14 full learning courses a day); beyond it every visitor gets the non-AI result | `docs/discovery/ARCHITECTURE.md`, section 5 (which plan the account is on now is not recorded) |

### 2.5 Privacy

- Questions are not stored by the site. The statistics endpoint stores nothing on Fly (no `DISCOVERY_EVENTS` binding).
- When AI is configured, the question and the shortlist are sent to Cloudflare Workers AI.
- Logs: the web process logs method, path, status and time; the provider logs the model name, outcome and time
  (`completeJson()`). No question text, IP address or cookie is logged.
- The AI never sees URLs or application data, and its reply is used only as terms and numbers.

### 2.6 Relevance for ERP

AI Search covers public pages only. It cannot search a customer's ERP records, and it must not: the index is public.
Search inside the ERP would be a separate, signed-in feature of `apps/work`.

---

## 3. The Engine Room and Resources

### 3.1 The Engine Room (`/engine-room/`)

- One page, `src/pages/engine-room.astro` (401 lines). It joined the old About and Proof of Work pages on 5 Nov 2026;
  `/about/` and `/proof-of-work/` answer 301 to it.
- Sections (its jump list): the founder, principles, at a glance, CAD Automation, Project Management, Resources, how
  it is built, test record, engineering record, limits.
- The founder's letter, signed "Founder, BIZOMAT", with his photograph (`public/engine-room/founder.webp`,
  `src/components/visuals/FounderPortrait.astro`). He is named on this page only (`CLAUDE.md`, "Identity").
- Facts come from data files: `src/data/brand.ts` (background, principles), `src/data/projects.ts`,
  `src/data/verification.ts` (test record), `src/data/screenshots.ts` (product screens), `src/data/cad-tools.ts`,
  `src/data/platform-catalog.ts`. Counts (tools, books, chapters) are computed at build time.
- Illustrations are SVG and CSS scenes in `src/components/visuals/` with an "Illustration" label and a still image
  under reduced motion; screenshots carry "Product screen".
- It is static: built at build time, no API, no data at run time.

### 3.2 Resources (`/resources/`)

| Part | Address | Source | How it runs |
| --- | --- | --- | --- |
| Hub | `/resources/` | `src/pages/resources/index.astro` | Static page |
| Tools | `/tools/`, `/tools/<id>/` | 491 script files in `public/tools/` (`data-`, `guides-`, `inputs-`, `calc-*.js`), 12 MB; `src/pages/tools/` | Calculators run in the browser; a tool's own files load on demand |
| Library | `/reados/...` | `src/content/reados-chapters/` (14 MB), `src/content/reados-publications/` (33 MB), `src/utils/reados-collections.ts` | Static chapter pages |
| Guides and articles | `/library/` | `src/pages/library/` | Static pages |
| Learning paths | `/resources/#pathways` | `src/data/learning-pathways.json` | Static; AI-built courses through `/api/learn/*` |

Library content changes follow `docs/KEVOS_READOS_PUBLISHING.md` and touch only the chapter folders. Resources need no
sign-in and hold no user data. Progress in a learning course is kept in the browser tab only (`sessionStorage`).

---

## 4. The edge proxy

### 4.1 Role

The proxy is the only public service of the app (`[http_service]` in `fly.website.toml`, `processes = ["proxy"]`).
Fly's edge terminates TLS and sends every request to it on port 8080. It routes each request to web, work or CAD over
Fly's private network and streams both bodies without buffering (uploads, long polls, server-sent events, WebSockets).

Files: `infrastructure/proxy/` (`routes.mjs` routing table, `proxy.mjs` server, `headers.mjs` header rules,
`upstreams.mjs` backends and DNS, `config.mjs` settings, `pages.mjs` its own error pages, `server.mjs` start-up).
Tests: `infrastructure/proxy/test/*.test.mjs` (77 tests at the last recorded run, 13 Nov 2026).

### 4.2 Backends

web `http://web.process.bizomat.internal:8003` and work `http://work.process.bizomat.internal:8002` in this app; cad
`http://cados.internal:8080`, the separate Fly app `cados` (`UPSTREAM_WEB`, `UPSTREAM_WORK`, `UPSTREAM_CAD` in
`fly.website.toml`).

### 4.3 Routing on bizomat.ai (by path)

`decide()` and `platformUpstream()` in `infrastructure/proxy/routes.mjs`. Paths are matched after dot segments are
resolved, as the web server reads them. Paths and Host headers reach the backends unchanged; each app takes its own
prefix off (`apps/work/src/worker/mount.ts`).

| Path | Goes to |
| --- | --- |
| `/cad`, `/cad/...`; `/mcp...`, `/solidworks/mcp...`, `/oauth/...`, `/v2/...`, `/healthz`; `/.well-known/oauth-protected-resource...`, `oauth-authorization-server...`, `openid-configuration...`, `acme-challenge/...` | cad (`CAD_PATHS`; the same expression as `src/server/platform-paths.ts`, checked equal by the tests) |
| `/tasks`, `/tasks/...` | work (or a 302 to `TASKS_REDIRECT_ORIGIN` when that is set; it is not set in production) |
| `/crm...`, `/finance...`, `/company...` | work |
| `/CAD`, `/Tasks/...`, `/CRM`, `/Finance`, `/Company` in any other case, GET or HEAD | 301 to the lowercase path |
| `/login`, `/log-in`, `/signin`, `/logon` (any case), GET or HEAD | 301 to `/sign-in/` |
| Everything else | web |

An ERP mounted inside `apps/work` under a new path (for example `/erp`) would need a new rule here (and in
`src/worker.ts` for the Cloudflare plan), plus the proxy tests. Under an existing mount (for example `/company`) it
would need no proxy change.

### 4.4 Hosts it answers

| Host | Answer |
| --- | --- |
| `bizomat.ai` | By path (above) |
| `www.bizomat.ai` | 301 (GET, HEAD) or 308 to `https://bizomat.ai` with the same path and query |
| `cados.kevos.com` | Every path to cad |
| `work.kevos.com` | Every path to work (pages 301 to `bizomat.ai/tasks` because `WORK_CANONICAL_URL` is set) |
| `kevos.com`, `www.kevos.com` | 301 to bizomat.ai (`/cad` to `/cad-automation/`); POST to `/api/*` to web |
| `*.fly.dev` (`bizomat.fly.dev`) | `/__proxy/health` and `/__proxy/ready`; with `BIZOMAT_PREVIEW_ROUTING=0` (production) everything else 301 or 308 to the same path on bizomat.ai |
| Any other host | `/__proxy/*` only; everything else 421 |

Which DNS records point at this app is not recorded in one place. DNS is changed by hand. kevos.com is served by the
Cloudflare Worker `throbbing-block-6c61` (`CLAUDE.md`), so the proxy's kevos.com rules are not in use; `cados.kevos.com`
points at the `cados` app (`docs/BIZOMAT-DEPLOYMENT.md`, section 6b).

### 4.5 Headers

Request side (`upstreamRequestHeaders()`, `clientInfo()` in `headers.mjs`):

- Removes every client-sent forwarding and edge header: `X-Forwarded-*`, `Forwarded`, `X-Real-IP`, `Fly-*`, `CF-*`,
  `X-Bizomat-*` and similar, plus hop-by-hop headers and `Expect`.
- Sets exactly one client address in `X-Forwarded-For`, `X-Real-IP`, `CF-Connecting-IP` and `Fly-Client-IP`, plus
  `X-Forwarded-Proto`, `X-Forwarded-Host` and `X-Bizomat-Request-Id`.
- Trust model: on Fly, the client address is Fly's `Fly-Client-IP`, except for connections from the private network
  (`fdaa::/16`), whose headers are ignored. Cloudflare's `CF-Connecting-IP` is trusted only with
  `PROXY_TRUST_CLOUDFLARE=1` (off).
- The apps believe these headers only in proxy mode (`WEB_TRUST_PROXY=1`, `WORK_TRUST_PROXY=1`, set by the entrypoint).

Response side (`clientResponseHeaders()`): hop-by-hop headers removed; HSTS (`max-age=31536000; includeSubDomains`)
added on production hosts when the backend did not send it; `X-Robots-Tag: noindex` on the preview host.

### 4.6 Timeouts, health and logs

| Setting | Value | Source |
| --- | --- | --- |
| Idle (no bytes either way) | 620 s, just over Fly's `idle_timeout = 600` | `PROXY_IDLE_TIMEOUT_MS` |
| Request headers | 60 s | `PROXY_HEADERS_TIMEOUT_MS` |
| Whole request body | 1 hour (large uploads) | `PROXY_REQUEST_TIMEOUT_MS` |
| Keep-alive from the edge | 75 s | `PROXY_KEEPALIVE_TIMEOUT_MS` |
| Drain on SIGTERM | 10 s (`kill_timeout = 15`) | `PROXY_SHUTDOWN_GRACE_MS` |
| Backend DNS cache | 5 s | `PROXY_DNS_TTL_MS` |
| Backend connection pool | keep-alive, up to 64 idle sockets per backend | `upstreams.mjs` |

- A backend that cannot be reached gets one retry after a fresh DNS lookup, only if nothing was sent yet; then 502.
  A silent backend past the idle timeout gets 504. The proxy then shows its own plain "temporarily unavailable" page.
- `/__proxy/health`: the proxy is alive and reports its version (the deploy workflow waits for this).
  `/__proxy/ready`: each backend's health path answers (`/healthz` web, `/api/health` work, `/healthz` cad), cached
  2 s.
- One JSON log line per request: method, host, path without query, status, time. No IP addresses, cookies or tokens.

---

## 5. Fly.io

### 5.1 The app `bizomat` (production, from `fly.website.toml`, read from Fly on 9 Nov 2026)

| Group | Command | Port | Machine | Volume | Health check | Restart |
| --- | --- | --- | --- | --- | --- | --- |
| proxy | `bizomat-entrypoint proxy` | 8080 (public) | shared-cpu-1x, 256 MB | none | `GET /__proxy/health` every 15 s, timeout 5 s, grace 10 s | Fly default |
| web | `bizomat-entrypoint web` | 8003 (private) | shared-cpu-1x, 512 MB | none | `GET /healthz` every 15 s, timeout 5 s, grace 20 s | Fly default |
| work | `bizomat-entrypoint work` | 8002 (private) | shared-cpu-1x, 512 MB | `work_data` at `/data` | `GET /api/health` (runs `SELECT 1`) every 15 s, timeout 5 s, grace 30 s | `always` |

- Region `syd` (`primary_region`). One Machine per group (deploys use `--ha=false`).
- `[http_service]`: proxy only, `force_https`, `auto_stop_machines = "off"`, `min_machines_running = 1`,
  concurrency by requests with `soft_limit = 800` and `hard_limit = 1500`, `idle_timeout = 600`.
- web and work have no service section, so Fly cannot stop or wake them: they run all the time.
- `[deploy]`: `strategy = "rolling"` (the only one allowed with volumes), `max_unavailable = 1`, `wait_timeout = "10m"`.
  work is offline for 10 to 60 seconds while its Machine is replaced; the proxy answers 502 for its paths meanwhile.
- `kill_signal = "SIGTERM"`, `kill_timeout = 15`.
- No `swap_size_mb` is set. No autoscaling. No second region.
- Cost estimate (`infrastructure/README.md`, "Cost estimate", Fly prices in USD a month, before the cad group was
  dropped): proxy 2.78, web 4.69, work 4.69, volume 0.15 per GB.

### 5.2 The volume `work_data`

From `[[mounts]]` in `fly.website.toml`:

| Setting | Value |
| --- | --- |
| Mount | `/data` on the work Machine only |
| Initial size | 3 GB |
| Scheduled snapshots | daily, kept 30 days (`snapshot_retention = 30`) |
| Auto-extend | at 80 % full, by 1 GB, up to 20 GB |

What it holds: section 6.2.

### 5.3 The image

`infrastructure/fly/Dockerfile` builds one image for all roles (multi-stage):

| Stage | Contents |
| --- | --- |
| `web-static`, `web-build` | `npm ci`, `npm run build` (about 3 minutes), `npm run build:server` |
| `work-client`, `work-build` | `apps/work`: `npm ci`, Vite client build, Node server bundle (`dist/node/server.mjs`), `npm prune --omit=dev` |
| `swaddin` | .NET 8 SDK builds the SOLIDWORKS add-in (best effort) |
| `cad-deps` | Python 3.12 virtual environment with CAD Automation's packages (build123d, OpenCascade) |
| `runtime-base` | Python 3.12 slim, OpenGL and X libraries for OpenCascade, the Node 22 binary, one unprivileged user per role, the CAD code, the proxy, the entrypoint, the migration scripts |
| `runtime` (final) | Adds the website's `dist/` and `dist-server/`, and the work app's `dist/`, `migrations/` and pruned `node_modules/` |

- Base images are pinned by digest; npm trees come from lock files; Python packages are pinned with hashes.
- The bizomat app runs no `cad` role since 9 Nov 2026, but the image still builds and carries the CAD layers.
- Recorded sizes: about 2.6 GB (`docker image ls`, CI on 5 Nov 2026, `docs/BIZOMAT-PROJECT-STATUS.md`); 601 MB "built
  and pushed" (deploy on 12 Nov 2026, `docs/testing/feature-test-results.md`). These are different measures (the
  unpacked image and, most likely, the compressed upload). The CI "Image size" step prints the current figure on every
  run.
- The work server is one esbuild bundle (`apps/work/src/node/build.mjs`, only `bufferutil` and `utf-8-validate`
  external): `dist/node/server.mjs` is 4.1 MB in this checkout. The pruned `node_modules/` copied beside it appears to
  be unused at run time (not verified).

### 5.4 The entrypoint

`infrastructure/fly/entrypoint.sh` (`bizomat-entrypoint <role>`):

- Refuses to run a role on a Machine of another process group. For work, refuses to start unless `/data` is a mounted
  volume. If `/data/.bizomat-maintenance` exists, the Machine stays up without the service (for restores).
- Builds a clean environment for each role from an allow-list, because Fly secrets reach every Machine. proxy:
  `UPSTREAM_*`, `BIZOMAT_PREVIEW_ROUTING`, `TASKS_REDIRECT_ORIGIN`, `PROXY_*`. web: `CF_ACCOUNT_ID`, `CF_AI_TOKEN`,
  `ANTHROPIC_API_KEY`, `TURNSTILE_SECRET_KEY`, `WEB_*`. work: `WORK_*`, mapped to the app's names (`APP_URL`,
  `APP_NAME`, `ENVIRONMENT`, `ALLOW_SIGNUP`, `SESSION_TTL_HOURS`, `CANONICAL_URL`, `GOOGLE_CLIENT_*`, `BREVO_*`,
  `EMAIL_*`, `APP_BASE_URL`). All roles: `FLY_*`, `PRIMARY_REGION`, `BIZOMAT_VERSION`, `TZ`.
- `NODE_OPTIONS` and `LD_PRELOAD` are dropped (tested in `infrastructure/fly/test/entrypoint.test.sh`), so a Node heap
  size cannot be set through the environment.
- Reads optional secret files from `/data/<role>/.secrets/<NAME>` (root-owned, 0600), only for allowed names.
- Runs the service as its own user (`bzproxy`, `bzweb`, `bzwork`) with `setpriv`: no capabilities, no new privileges.
  Fly's in-VM API socket is made root-only first.

### 5.5 The separate app `cados` (CAD Automation)

From `docs/SITE-CAD-INTEGRATION.md` (read from Fly on 9 Nov 2026):

| Item | Value |
| --- | --- |
| Repository | `kevinjogin/bizomat-cad` (deployed from there with its own workflow and token `FLY_CADOS_TOKEN`) |
| Region | Amsterdam (`ams`) |
| Machine | one, shared CPU, 2 vCPUs, 2048 MB |
| Volume | `opensketch_data`, 1 GB |
| Idle behaviour | `auto_stop_machines = 'suspend'`, `min_machines_running = 0` |
| Reached from bizomat | `http://cados.internal:8080` over the private network; both apps must stay in the same Fly organisation |

`apps/cad/` in this repository is a pinned copy of a CAD commit (`apps/cad-source.json`, checked by
`node scripts/sync-cad.mjs check` in CI). It is never edited here.

### 5.6 The deploy workflow and its preflight

`.github/workflows/bizomat-deploy.yml`, "BIZOMAT deploy (bizomat)":

1. Starts only by hand on `main`, with the input `confirm` = `DEPLOY`. No push, merge, tag or schedule deploys.
   One deploy at a time (`concurrency: bizomat-deploy`). Job timeout 60 minutes.
2. Checks the repository secret `FLY_BIZOMAT_TOKEN` (a deploy token for `bizomat` only).
3. **Preflight** (`python3 .github/scripts/fly-preflight.py --app bizomat --config fly.website.toml`). It reads the live
   Machines (`flyctl machines list --json`) and the wanted CPU kind, CPU count and memory per group from `[processes]`
   and `[[vm]]`. It stops the deploy if a group has no Machine (one would be created), if a live group is missing from
   the file (it would be removed), if a Machine's CPU kind, CPU count or memory differs, or if a Machine is outside
   `primary_region`. Only the input `allow_machine_change` = `YES` lets a change through. It does not compare volumes,
   services, environment, secrets or the number of Machines within a group.
4. Lists which optional secrets are missing (names only): `CF_ACCOUNT_ID`, `CF_AI_TOKEN`, `ANTHROPIC_API_KEY`,
   `TURNSTILE_SECRET_KEY`, `WORK_GOOGLE_CLIENT_ID`, `WORK_GOOGLE_CLIENT_SECRET`.
5. Requests a snapshot of `work_data` (warns and goes on if the token cannot).
6. Frees disk space on the runner, then `flyctl deploy --config fly.website.toml --app bizomat --local-only --ha=false
   --build-arg BIZOMAT_VERSION=<commit> --wait-timeout 10m`. The image is built on the GitHub runner (Fly's remote
   builder stalled on 10 Nov 2026) with no layer cache from earlier runs.
7. Waits up to 3 minutes for `https://bizomat.fly.dev/__proxy/health` to report the new commit.
8. Public checks, each retried for up to 90 s: `https://bizomat.ai/` contains "BIZOMAT"; `POST /api/chat` with `{}`
   answers 422; `/cad/` 200; `/tasks/` 200 or 302; `/crm/login`, `/finance/login`, `/company/login` 200.

It deploys only the app `bizomat`. It never touches `cados`, DNS or Cloudflare, never creates an app, volume or IP
address, and sets no secret.

### 5.7 Smoke tests

`infrastructure/smoke/smoke.mjs` (Node 22, no dependencies) checks every host and path family through the proxy, in
three modes: `hosts` (local stack), `preview` (`*.fly.dev`) and `live` (real host names). It covers the website pages,
redirects and security headers; `/cad` and CAD's program paths (unauthenticated MCP calls must get 401); `/tasks`,
`/crm`, `/finance`, `/company` (APIs and WebSockets must refuse without a session); and the old addresses. Last
recorded production run: `--mode live`, 43 passed (13 Nov 2026); the failures were hosts outside that session's network
allowance and `/__proxy/*`, which the proxy serves only on the preview host.

### 5.8 Rollback

- Image: `flyctl releases -a bizomat --image`, then
  `flyctl deploy --config fly.website.toml -a bizomat --image <previous image> --ha=false`. Deploys never touch volumes.
  An older image runs on a newer schema, because migrations are additive and the server ignores migrations it does not
  know (`docs/deployment/fly-deployment.md`).
- Database: the server's pre-migration copy, or a volume snapshot (`docs/deployment/fly-deployment.md`, "Rollback").
  Restoring a snapshot onto a new volume is a Machine change and needs the owner's approval.
- Whole platform: `docs/BIZOMAT-ROLLBACK.md`, section 6.

### 5.9 Settings and secret names (never values)

Non-secret settings in `fly.website.toml` `[env]`:

| Name | Value | For |
| --- | --- | --- |
| `UPSTREAM_WEB`, `UPSTREAM_WORK`, `UPSTREAM_CAD`; `BIZOMAT_PREVIEW_ROUTING` | private addresses (section 4.2); `"0"` | proxy |
| `WORK_APP_URL`, `WORK_CANONICAL_URL` | `https://bizomat.ai/tasks` | work |
| `WORK_APP_NAME`, `WORK_ENVIRONMENT` | `BIZOMAT Project Management`, `production` | work |
| `WORK_ALLOW_SIGNUP`, `WORK_SESSION_TTL_HOURS` | `"true"` (open sign-up), `"72"` | work |
| `OPENSKETCH_PUBLIC_URL`, `OPENSKETCH_REDIRECT_HOSTS` | CAD addresses | no effect here (no cad role) |

Fly secret names the code knows (whether each is set is not recorded, except where noted):

| Name | Role | Notes |
| --- | --- | --- |
| `CF_ACCOUNT_ID`, `CF_AI_TOKEN` | web | AI Search and learning paths |
| `TURNSTILE_SECRET_KEY` | web | Form protection |
| `ANTHROPIC_API_KEY` | web | On the allow-list, read by no code |
| `WORK_GOOGLE_CLIENT_ID`, `WORK_GOOGLE_CLIENT_SECRET` | work | Google sign-in (off) |
| `WORK_BREVO_API_KEY`, `WORK_BREVO_WEBHOOK_TOKEN`, `WORK_EMAIL_*`, `WORK_APP_BASE_URL` | work | Email; the founder console can store the Brevo key instead, encrypted with `/data/work/settings.key` |
| `ABR_GUID`, `BIZOMAT_ID_CLIENTS` | (work) | Documented in `docs/company/README.md`; cannot reach the app on Fly (section 9) |

The web server also reads `CHAT_MODEL`, `CHAT_FALLBACK_MODEL`, `DISCOVER_MODEL`, `LEARN_MODEL`, the rate-limit
settings, `MAIL_PROVIDER`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` and `STRIPE_WEBHOOK_SECRET` if present
(`buildEnv()`, `src/node/server.ts`). None of them is on the web role's allow-list, so on Fly they cannot be set and the
code defaults apply.

GitHub repository secrets: `FLY_BIZOMAT_TOKEN` (deploy). `bizomat-migrate-work.yml` also names
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and `FLY_API_TOKEN` (the one-off data move from Cloudflare).

---

## 6. Data and storage

### 6.1 Where each product's data lives in production

| Product | Store | Where |
| --- | --- | --- |
| Website, Resources, AI Search index | Static files built from Git | The image (`/app/web/dist`), on the web Machine |
| Project Management, CRM, Finance, Company accounts | One SQLite database | `/data/work/db.sqlite` on `work_data` |
| Their uploaded files and generated documents | Files named by a hash of the key, indexed in SQLite | `/data/work/files/` with the index in `/data/work/runtime.sqlite` |
| Their key-value cache | SQLite | `/data/work/runtime.sqlite` |
| Live board updates | In memory (no storage) | The work process |
| Founder console secrets (Brevo key, webhook token) | Stored encrypted (AES-256-GCM) | The key is the file `/data/work/settings.key`, outside the database |
| CAD Automation | Files and SQLite in its data folder | `cados` app, volume `opensketch_data` (Amsterdam) |
| Public downloads (installer, checksum, update record) | R2 bucket `bizomat-downloads` | Cloudflare; bound only to the undeployed Worker (section 9) |
| Old Project Management data | D1 `workos-platform-preview-db`, R2 `workos-platform-preview-files` | Cloudflare; stale copies from before 6 Nov 2026, kept for the rollback window |

### 6.2 What is on the `work_data` volume

| Path | What | Source |
| --- | --- | --- |
| `/data/work/db.sqlite` (+ `-wal`, `-shm`) | The application database, in the D1 schema | `apps/work/src/node/store/layout.ts` |
| `/data/work/runtime.sqlite` | File index and KV entries | same |
| `/data/work/files/`, `files/.tmp/` | File bodies; partial uploads (cleaned after an hour by the maintenance run) | same, `runtime.ts` |
| `/data/work/settings.key` | Encryption key for console secrets | `docs/BIZOMAT-PROJECT-STATUS.md`, 12 Nov 2026 |
| `/data/work/pre-migration-backups/` | Full database copies made with `VACUUM INTO` before any pending migration; the newest five are kept | `apps/work/src/node/runtime.ts` |
| `/data/work/.secrets/` | Optional root-only secret files | `entrypoint.sh` |
| `/data/backups/work-<time>/` | Whatever was in `/data/work` before a restore or data move (moved, never deleted) | `infrastructure/migrate/work/apply.sh`, `restore.sh` |
| `/data/incoming/` | Uploaded restore archives (root only) | `entrypoint.sh` |
| `/data/.bizomat-maintenance` | Maintenance flag, when present | `entrypoint.sh` |

Database settings (`apps/work/src/node/store/sqlite.ts`): WAL journal, `synchronous = FULL` (every commit is flushed
to disk), foreign keys on, busy timeout 5 s. At every start the server runs `PRAGMA quick_check`, copies the database
if a migration is pending, and applies pending migrations, each in one transaction (`runtime.ts`).

### 6.3 Backups

| Layer | Where | When | Kept |
| --- | --- | --- | --- |
| Fly scheduled snapshot | Fly | Daily | 30 days |
| Pre-deploy snapshot | Fly | Each run of the deploy workflow (if the token allows) | 30 days |
| Pre-migration copy | `/data/work/pre-migration-backups/` on the same volume | At start, when a migration is pending | Newest five |
| Restore and move leftovers | `/data/backups/` on the same volume | Each restore or data move | Until removed by hand |
| Portable copy | Owner's encrypted storage | By hand (`docs/BIZOMAT-OPERATIONS.md`, section 4; `apps/work/scripts/migrate/backup-data-dir.mjs`) | Owner's choice |

The volume copies are on the same disk as the live data: they protect against bad migrations, not against losing the
volume. Snapshots cover that. A quarterly restore test is recommended (`docs/BIZOMAT-OPERATIONS.md`, section 4); no
result is recorded.

### 6.4 Recorded sizes

| What | Figure | When and source |
| --- | --- | --- |
| Database at the move from Cloudflare | 47 tables, 270 rows, 4 files | 6 Nov 2026, `docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`, section 3 |
| People with accounts at that time | 2 | `docs/BIZOMAT-ROLLBACK.md`, section 4 |
| Test data added in production | One test organisation, a test owner and a test contractor on `example.com` addresses | 12 Nov 2026, `docs/testing/feature-test-results.md` |
| Data created by the CRM, Finance and Company releases | None ("No production account or data created") | 13 Nov 2026 release log |
| Schema in production (through 0014) | 136 tables, 182 named indexes, 6 triggers | Counted for this file from `apps/work/migrations/` |
| Schema on this branch (through 0015) | 144 tables | same |
| Volume size | 3 GB (possibly grown by auto-extend) | `fly.website.toml` |
| Current database size, files size, free space | Not recorded | Measure (section 8.10) |

The production database is therefore probably very small today, but this is an inference, not a measurement.

---

## 7. CI

All workflows are in `.github/workflows/`. Every repository is private, so Actions minutes are limited. Runs failed
before a runner started on 7 Nov 2026 (the minutes ran out) and again from 12 to 13 Nov 2026 with the same pattern
(`docs/BIZOMAT-PROJECT-STATUS.md`, section 6, item 9).

| Workflow | Starts on | What it checks or does |
| --- | --- | --- |
| `bizomat-ci.yml` "BIZOMAT CI" | Every push and pull request; by hand | **website**: `npm ci`, brand copies in step (`shared/brand/build.mjs --check`), `npm run verify` (astro check, tests, build with the quality gate), `npm run build:server`. **work**: lint, type check, Vitest in workerd, client build, Vitest on Node, Node server build. **cad**: pytest in two parts (Python 3.12, .NET 8 for the slow part). **cad npm**: the sketch solver tests. **proxy and platform files**: proxy tests, script syntax, shellcheck, the CAD move rehearsal (root, namespaces), `check-config.py` on both Fly files, `sync-cad.mjs check`, compose files. **image and local stack** (after proxy): Docker build of the full image, image size, entrypoint isolation test, migration round trip, the compose stack, the smoke test through the proxy, secret isolation |
| `bizomat-deploy.yml` | By hand on `main`, `confirm` = `DEPLOY` | Section 5.6 |
| `bizomat-migrate-work.yml` | By hand | The one-off move of Project Management data from Cloudflare D1 and R2 to the work Machine (dry run or apply). Counts only; the export never leaves the runner |
| `verify.yml` "Verify KEVOS site" | Every push and pull request | `npm run verify` again, then checks the BIZOMAT logo in the compiled homepage |
| `seo-validate.yml` | Every push and pull request | A full build, then the SEO gate (sitemap, canonicals, indexability, robots, structured data) and a URL inventory; IndexNow after pushes |
| `seo-daily.yml`, `seo-weekly.yml`, `seo-monthly.yml` | Schedules (20:30 UTC daily; Sunday 21:00 UTC; the 1st at 21:00 UTC) | Search Console, Bing and Cloudflare data collection, reports (missing credentials reported as unknown) |
| `live-check.yml` | By hand | `scripts/discovery/live-check.mjs` against a base address; the default is still `https://kevos.com` |

Observations:

- Each push builds the full website (about 4,600 pages) three times (`bizomat-ci.yml`, `verify.yml`,
  `seo-validate.yml`) and the full image once. The image job builds CAD Automation's layers although `bizomat` does not
  run them.
- Nothing deploys on push. The deploy does not run CI itself; CI must be run and green first.
- Recorded test counts (13 Nov 2026 release log): website 1,522; work 408 in workerd (524 on Node at the release
  before); proxy 77.

---

## 8. Capacity: adding an ERP module to the existing work app on the existing Machines

### 8.1 What an ERP module in `apps/work` would share

- The **work Machine**: shared-cpu-1x, 512 MB, one Node.js 22 process (`/app/work/dist/node/server.mjs`).
- The **event loop** of that process, already serving Project Management, the CRM, Finance and Company accounts,
  their WebSockets, their static client files and the 15-minute maintenance run.
- The **database file** `/data/work/db.sqlite`: one writer at a time, synchronous calls.
- The **volume** `work_data` (3 GB, auto-extend to 20 GB) and its backup copies.
- The **deploy**: one image, one rolling deploy; work is down 10 to 60 seconds on each deploy.
- The **routing**: the proxy's work rules (section 4.3).

### 8.2 Memory (512 MB)

Known from the repository:

- No memory figure for any Machine is recorded. There is no swap (`swap_size_mb` is not set). No code reports memory
  use (`process.memoryUsage()` appears nowhere in `apps/work/src`).
- Node's heap limit is Node's default for the Machine's memory. It cannot be changed through `NODE_OPTIONS`, which the
  entrypoint drops; it would need a flag in the entrypoint's command.
- If the process runs out of memory it exits; `[[restart]] policy = "always"` restarts it. All four products on work
  are unavailable meanwhile, and open WebSockets drop.
- Fixed costs in the process: the 4.1 MB server bundle and its parsed code; the client asset manifest and compressed
  copies of the SPA (2.8 MB of client files, compressed once and served from memory); two SQLite connections with their
  page caches; the in-memory WebSocket hub.
- Transient costs that scale with use: request bodies up to 32 MiB are accepted by the Node server and uploads up to
  25 MB by the app; an upload is read whole into memory from the form data and stored from that buffer
  (`apps/work/src/worker/routes/files.ts`); PDF and Excel reports and Finance documents are built in memory
  (`pdf-lib`, `fflate`; `src/worker/services/reports/`, `src/worker/fin/pdf.ts`); CSV, OFX and QIF imports; large JSON
  list responses.
- ERP workloads that add memory pressure: large list and report queries returned as one JSON body, bulk imports,
  multi-page PDFs (invoices, purchase orders, statements), and any in-memory caching.

Not known (measure): resident memory of the work process at idle and under load, the Node heap limit on this Machine,
peaks during a report or an upload, and the Machine's free memory.

### 8.3 CPU (shared-cpu-1x)

- One shared vCPU. Fly throttles shared CPUs under sustained load; the exact quota is in Fly's current documentation and
  is not recorded here.
- All JavaScript runs on one thread. Password hashing (PBKDF2-SHA256, 100,000 iterations at each sign-in and sign-up)
  runs through WebCrypto, off the main thread but on the same vCPU.
- CPU-heavy paths that already exist: Finance reports from posted journals, project reports (PDF, Excel), CPM
  scheduling and earned value (project controls), CRM reports and automations, CSV imports, brotli compression of new
  client files after a deploy.
- An ERP adds more of the same kind (costing, MRP-style planning, stock valuation, period close, consolidated reports).
  Each long computation blocks every other request on work for its duration.

Not known (measure): CPU use and throttling at idle, at the 15-minute run and under load.

### 8.4 Database and disk

- One SQLite file for all products, in WAL mode. Many readers, one writer; `node:sqlite` is synchronous, so a long
  query or write transaction holds the event loop as well as the database.
- `synchronous = FULL` flushes to disk on every commit: safe, but each write waits for the disk.
- Start-up cost grows with the database: `PRAGMA quick_check` reads the whole file at every start, and a pending
  migration first writes a full copy (`VACUUM INTO`). The work health check has a 30 s grace period and the deploy a
  10-minute wait; a large database could make starts slow enough to delay or fail a deploy.
- Disk use per gigabyte of data is more than one gigabyte: the live file, its WAL, up to five pre-migration copies,
  any `/data/backups/` leftovers, and uploaded files. A 400 MB database with its five copies is already 2.4 GB, the
  80 % mark of the 3 GB volume at which auto-extend acts.
- Auto-extend adds 1 GB at 80 % use, up to 20 GB. Beyond that the volume must be resized by hand (a production change).
- Schema scale: 136 tables in production today (144 with 0015). An ERP would add its own tables; the CRM added 32 and
  Finance 30.
- If the Cloudflare plan is kept, every query must also run on D1, which has its own limits (for example at most 100
  aggregate terms in one query, which the data move tool had to work around for the CRM tables: status log,
  13 Nov 2026).

Not known (measure): file size of `db.sqlite` and its WAL, row counts per table, size of `files/`, of
`pre-migration-backups/` and of `/data/backups/`, free space, current volume size, and the slowest queries.

### 8.5 Request concurrency

- The proxy accepts up to 800 requests before Fly's soft limit and 1,500 at the hard limit (`[http_service.concurrency]`).
  These limits are on the one proxy Machine; web and work have none.
- The work process has no limit of its own on concurrent requests. Concurrency is bounded in practice by the single
  thread and the synchronous database: requests are served one JavaScript step at a time.
- Node server timeouts on work: request 300 s, headers 66 s, keep-alive 65 s (`apps/work/src/node/runtime.ts`).
  WebSocket messages up to 1 MiB, no compression.
- Rate limits for sign-in and APIs are stored in the database (`rate_limits` table), so they also cost writes.
- No load test exists for any product. Recorded use is small (two people at the move on 6 Nov, plus test accounts).

### 8.6 Build time and image size

- The deploy builds the whole image on a fresh GitHub runner with no layer cache: the website (about 3 minutes for the
  Astro build alone), the work client and server, the CAD Python environment with OpenCascade and the .NET add-in.
  Total deploy times are not recorded. The job limit is 60 minutes.
- An ERP module adds Vite chunks and a larger server bundle. The work client is already split by route (the largest
  chunks in this checkout: `DocumentPage` 485 KB, the main `index` 285 KB, `BoardPage` 100 KB); 113 files, 2.4 MB of
  JavaScript and CSS.
- Image size: section 5.3. All three Machines run the same image, including the CAD layers they do not use.

### 8.7 Static asset serving

- The work app serves its own single-page app from `/app/work/dist/client` (`apps/work/src/node/assets.ts`): files
  under `/assets/` are cached by browsers for a year (immutable); other files must revalidate; brotli and gzip copies
  are made once and served from memory.
- There is no CDN cache in front: Fly's edge passes every request to the proxy, which passes it to work.
- The website's static files are served the same way by the web Machine, with a 64 MB compression cache.
- After each deploy, every returning browser downloads the changed chunks once from the work Machine.

### 8.8 Background jobs

- One in-process scheduler (`apps/work/src/node/scheduler.ts`) runs the maintenance job at minutes 0, 15, 30 and 45
  (UTC). It skips a slot while the previous run is still going and does not catch up missed slots.
- One run does, in order (`runMaintenance()`, `apps/work/src/worker/index.ts`): Project Management scheduled
  automations, retries and due-date notifications; CRM scheduled automations; Finance recurring records, reminders,
  budget warnings, monthly summaries and scheduled reports; up to 5 ABN lookups (only with `ABR_GUID`); up to 100
  queued emails (Brevo); session and error-log housekeeping; expired KV entries and temporary uploads.
- There is no job queue, no separate worker process and no retry store apart from what each feature keeps in its own
  tables. Every job runs on the same event loop as the web requests.
- ERP jobs (scheduled reports, period close, reorder checks, recurring documents) would join this run or need their
  own scheduling. Long jobs would delay both the run and live requests.

### 8.9 Availability and blast radius

- work is a single point of failure for four products today (five with an ERP). It cannot be scaled out: a second
  Machine would get its own empty volume (`docs/BIZOMAT-OPERATIONS.md`, section 1).
- The proxy is also one Machine. A second proxy or web Machine needs the owner's approval.
- Each deploy, crash or out-of-memory restart takes work offline for about 10 to 60 seconds.

### 8.10 Measurements to take on Fly

All are read-only and are the owner's (or a session with Fly access). They print sizes and counts, never data.

| # | Measure | How |
| --- | --- | --- |
| 1 | Machines, sizes, regions and states as they are now | `fly scale show -a bizomat`; `fly machines list -a bizomat` |
| 2 | Volume size and whether auto-extend has acted | `fly volumes list -a bizomat` |
| 3 | Disk use on the volume | `fly ssh console -a bizomat -g work -C "df -h /data"` |
| 4 | Size of each part of the data | `fly ssh console -a bizomat -g work -C "du -sh /data/work/db.sqlite* /data/work/runtime.sqlite /data/work/files /data/work/pre-migration-backups /data/backups /data/incoming"` |
| 5 | Database pages, free pages and row counts per table (counts only) | `python3` with `sqlite3` on a read-only connection to `/data/work/db.sqlite`, as `docs/BIZOMAT-OPERATIONS.md` section 7 does for erasure: `PRAGMA page_count`, `page_size`, `freelist_count`, `SELECT count(*)` per table |
| 6 | Memory of the Machine and of the work process | `fly ssh console -a bizomat -g work -C "cat /proc/meminfo"`; the work process's `VmRSS` and `VmHWM` in `/proc/<pid>/status`; the same for web and proxy |
| 7 | Node's default heap limit on a 512 MB Machine | `fly ssh console -a bizomat -g work -C "node -e \"console.log(require('v8').getHeapStatistics().heap_size_limit/1048576)\""` |
| 8 | CPU use, throttling, memory over time | The Fly dashboard's metrics for each Machine (a week, including the 15-minute runs and the daily snapshot) |
| 9 | Request latency and slow paths | `fly logs -a bizomat`: the proxy's per-request time; the work server's request logs |
| 10 | Duration of the 15-minute run | `fly logs -a bizomat` lines with `"event":"scheduled"` and their `ms` |
| 11 | Start-up time of work | Time from deploy to `/api/health` 200 in the deploy log; the `pre_migration_backup` log line |
| 12 | Deploy duration and image size | The deploy run's step timings; CI's "Image size" step; `fly releases -a bizomat --image` |
| 13 | Snapshot count and size | `fly volumes snapshots list <volume id> -a bizomat` |
| 14 | Whether AI Search has a provider (`"ai": true`) | `fly ssh console -a bizomat -g web -C "node -e \"fetch('http://127.0.0.1:8003/healthz').then(r=>r.text()).then(console.log)\""` |
| 15 | Behaviour under load | Not on production (no staging exists; creating one needs the owner's approval). Locally: `docker compose -f infrastructure/local/compose.yml up --build` with the work service limited to 512 MB and one CPU, a seeded database of the expected ERP size, and a load tool against the proxy |

Note on item 14: `bizomat.ai/healthz` belongs to CAD (`CAD_PATHS`), so the website's health must be read inside the
app. The image is Debian slim with Python and Node; `curl`, `wget`, `ps` and `sqlite3` may be missing, which is why
the commands above use `node`, `python3` and `/proc`.

### 8.11 Recommended optimisations (not implemented)

None of these is built. Each needs its own change and, where marked, the owner's approval.

1. **Measure first** (section 8.10), then set a budget: ERP memory, database growth per month and longest acceptable
   request.
2. **A memory and timing endpoint for the founder** in `apps/work` (`process.memoryUsage()`, event-loop delay, database
   file sizes), so capacity can be watched without SSH.
3. **Keep long work off the request path:** paginate every ERP list; stream exports; cap report sizes; run heavy
   calculations in short batches across maintenance runs, or in a `worker_threads` worker with its own read-only
   database connection.
4. **A slimmer image for this app:** a final stage without the CAD layers (`cad-deps`, `swaddin`, OpenCascade libraries),
   and no `node_modules/` beside the bundled work server if it is confirmed unused. Smaller pulls, faster deploys.
5. **Build cache for the deploy** (for example a registry or GitHub Actions cache for Docker layers), so unchanged
   stages are not rebuilt.
6. **Fewer full builds per push:** `verify.yml` and `seo-validate.yml` repeat the website build that `bizomat-ci.yml`
   already does. Saves Actions minutes, which ran out on 7 Nov 2026.
7. **Watch the volume copies:** keep fewer pre-migration copies once the database is large, or move old copies off the
   volume after a successful deploy; clear `/data/backups/` and `/data/incoming/` when no longer needed (owner's call).
8. **Swap on work** (Fly's `swap_size_mb` setting) as a cushion against out-of-memory restarts. The preflight does not
   check swap, but it is still a Machine change for the owner to approve.
9. **More memory for work** (for example 1 GB) if measurements show the need. Owner's approval; the deploy then needs
   `allow_machine_change` = `YES`.
10. **Indexes and query plans** for every ERP list and report, checked with `EXPLAIN QUERY PLAN` on a database of the
    expected size, and tests that run on both runtimes (workerd and Node) while the Cloudflare plan stands.

---

## 9. Constraints and risks

| # | Constraint or risk | Source | What it means for an ERP module |
| --- | --- | --- | --- |
| 1 | No Machine, process group or memory may be added without the owner's approval; the preflight enforces it on every deploy | `CLAUDE.md`, "Deployment"; `.github/scripts/fly-preflight.py` | The ERP must fit the existing work Machine, or the owner must approve a change first |
| 2 | work must stay exactly one Machine with one volume | `docs/BIZOMAT-OPERATIONS.md`, section 1 | No horizontal scaling; vertical scaling only with approval |
| 3 | No staging environment | `docs/deployment/fly-deployment.md` | Verification is local (both runtimes, compose stack) and then the live checks after deploy |
| 4 | Deploys only by hand from `main` (`confirm` = `DEPLOY`); stage files by explicit path; documentation in its own commit | `CLAUDE.md`, "Change control" | ERP releases follow the same path as the CRM and Finance |
| 5 | Migrations must be additive; an older image must run on a newer schema | `docs/deployment/fly-deployment.md` | ERP tables and columns are added, never changed in place, so an image rollback needs no database change |
| 6 | The Cloudflare migration is prepared in code but not carried out; `apps/work` must keep running on both Cloudflare Workers (D1, R2, Durable Objects, CPU limits) and Node | `docs/BIZOMAT-CLOUDFLARE-MIGRATION.md`; `apps/work/wrangler.jsonc` env `bizomat`; CI runs both test suites | ERP code must avoid Node-only APIs in the Worker code and respect D1's limits, unless the owner drops the plan |
| 7 | DNS changes are made by hand only, after smoke tests; never from CI | `CLAUDE.md`, "Deployment" | A new ERP address under bizomat.ai needs no DNS; a new host would |
| 8 | kevos.com is the KEVOS site on the Cloudflare Worker `throbbing-block-6c61`; nothing from this repository may publish there (`scripts/deploy-guard.mjs`) | `CLAUDE.md` | No ERP content or redirect on kevos.com |
| 9 | Website-level changes (navigation, layouts, legal pages) need the owner's request | `CLAUDE.md`, "Change control" | Adding ERP to the header, Sign in menu or footer is the owner's decision |
| 10 | Product claims must come from the code (`src/data/platform-catalog.ts`); no invented figures, customers or prices | `CLAUDE.md`, "Identity" | Any ERP product page states only what is built |
| 11 | **Configuration gap:** `ABR_GUID` and `BIZOMAT_ID_CLIENTS` are documented as Fly secrets for the work process, but the entrypoint passes the work role only `WORK_*` names and a fixed list, and `configFromEnv()` copies only named settings into the app. Neither name reaches the app, as a secret or as a secret file | `infrastructure/fly/entrypoint.sh` (work allow-list); `apps/work/src/node/config.ts`; `docs/company/README.md` | The ABN register lookup and BIZOMAT sign-in for CAD cannot be switched on as documented. Every new ERP setting must be added in both places, with a test |
| 12 | Fly secrets are app-wide (every Machine receives them); isolation relies on the entrypoint's allow-list and per-role users | `docs/BIZOMAT-SECURITY.md`, section 3 | ERP secrets (for example a payment or bank provider key) should be `WORK_`-prefixed or held as a secret file on the work volume |
| 13 | `bizomat.ai/cad` depends on the `cados` app in Amsterdam, which suspends when idle; private-network requests do not wake it | `docs/SITE-CAD-INTEGRATION.md`, section 1 | Any ERP link to CAD data crosses regions and may find CAD asleep |
| 14 | Public downloads: the code serves `/downloads/` from R2 only through the Cloudflare binding, which the Fly web process does not have, so it answers 404 on Fly | `src/node/server.ts` (`buildEnv`), `src/server/downloads.ts` | Not an ERP blocker; check the live behaviour before relying on `/downloads/` |
| 15 | The CAD Automation page advertises the connector `https://mcp.bizomat.ai/mcp` (`APP_URLS.cadMcp`), which belongs to the undeployed Worker `bizomat-mcp` | `src/config/platform.ts`; `docs/BIZOMAT-CLOUDFLARE-MIGRATION.md` | Not an ERP blocker; check it live |
| 16 | Open sign-up is on (`WORK_ALLOW_SIGNUP = "true"`) for the app that would hold ERP data | `fly.website.toml` | Role and company checks in the ERP must hold for any new account; closing sign-up is the owner's decision |
| 17 | PBKDF2 at 100,000 iterations (kept for the rollback window) | `docs/BIZOMAT-SECURITY.md`, F4 | Raising it later costs more CPU per sign-in on the shared vCPU |
| 18 | GitHub Actions minutes for the private repositories are limited (they ran out on 7 Nov 2026; runs failed the same way on 12 Nov) | `docs/BIZOMAT-PROJECT-STATUS.md`, section 6, item 9 | Larger test suites and more builds per push increase the risk of blocked CI |
| 19 | Finance and the ERP must not claim bank connections, payment processing, ATO lodgement or certification | `CLAUDE.md`, "Identity" | ERP finance features keep the same limits unless an approved provider is added |
| 20 | **Documentation drift:** `docs/BIZOMAT-ARCHITECTURE.md`, `BIZOMAT-DEPLOYMENT.md`, `BIZOMAT-OPERATIONS.md` and `BIZOMAT-ROLLBACK.md` still describe four process groups with `cad` inside `bizomat`, `fly.toml` as the deployed file, Fly's remote builder and an older repository name; `BIZOMAT-ROLLBACK.md` section 5 describes CAD as already moved. `fly.toml` is not deployed | `fly.website.toml` header; `CLAUDE.md` | ERP planning should rely on `fly.website.toml`, `bizomat-deploy.yml`, `docs/SITE-CAD-INTEGRATION.md` and `CLAUDE.md` |
| 21 | Old deployments stay running until the owner retires them: the kevos.com Worker, the `workos-platform-preview` Worker and its D1 and R2, and `cados` | `CLAUDE.md`; `docs/BIZOMAT-ROLLBACK.md` | The old D1 copy of Project Management is stale and must not be mistaken for current data |

---

## Appendix: sources

Every statement above cites its file. The main sources: `CLAUDE.md`; `docs/BIZOMAT-*.md`; `docs/SITE-CAD-INTEGRATION.md`;
`docs/deployment/fly-deployment.md`; `docs/discovery/ARCHITECTURE.md`; `fly.website.toml`, `fly.toml`, `wrangler.toml`;
`infrastructure/` (Dockerfile, entrypoint, proxy, smoke test, compose, migration scripts); `.github/workflows/` and
`.github/scripts/fly-preflight.py`; `src/config/`, `src/worker.ts`, `src/server/`, `src/node/`, `scripts/postbuild.mjs`;
`apps/work/src/node/`, `apps/work/src/worker/` (index, app, mount, auth, routes) and `apps/work/migrations/`.
