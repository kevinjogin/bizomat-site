# KEVOS source of truth

The authoritative description of the KEVOS website for future maintainers and AI sessions. The Git repository is the full snapshot; this document records structure, decisions and the verified baseline. When this document and the code disagree, the code on `origin/main` wins and this document should be corrected.

## 1. Identity and ownership

| Item | Value |
|---|---|
| Website | https://kevos.com |
| Business identity | KEVOS (active). GoCore is retired. |
| Repository | `jogkev-creator/gocore-website` (historical name, current KEVOS site) |
| Production branch | `main` |
| Framework | Astro (static output) + Cloudflare Worker (`src/worker.ts`) |
| Hosting | Cloudflare Workers, Worker `throbbing-block-6c61` |
| Content | `src/content/reados-chapters/` (READOS chapters), `src/content/reados-publications/`, `src/content/work/` (Work) |

## 2. Verified baseline

| Item | Value |
|---|---|
| Baseline commit | `3dd21f6` (Docs: record approved KEVOS orange branding and safe recovery from legacy GoCore deploys), 8 Oct 2026 |
| Verification | `npm ci` + `npm run verify`: 36/36 tests, 330 pages verified |
| Build output | 708 files in `dist/`; full SHA-256 manifest in `docs/baseline/kevos-build-manifest-3dd21f6.sha256` (manifest SHA-256 `8afc3c9bb0692517…`; paths relative to `dist/`) |
| Live check | `/`, `/insights/`, `/about/`, `/services/`, `/contact/`, `/privacy/`, `/terms/` and `/insights/category/business/` on kevos.com were byte-identical to this build on 8 Oct 2026 |
| Key asset hashes (first 16 hex) | `brand/kevos-wordmark-orange-light.svg` f3607e97916ae13d · `brand/kevos-wordmark-orange-dark.svg` b5e02ee5e21e8714 · `brand/kevos-favicon-k-orange.svg` and `favicon.svg` ae1232c658ae94be |

(The baseline above predates the retirement of Insights on 17 Oct 2026.) Later commits that add READOS chapters will legitimately change READOS chapter and book pages, the `/reados/` listing, `sitemap-0.xml`, `rss.xml`, the Pagefind index and `assistant-knowledge.json`. They must not change the brand assets, CSS, layouts or non-READOS pages beyond those generated lists.

## 3. Site architecture

```
src/
  pages/        /, /products/, /solutions/, /resources/, /services/, /tools/, /how-it-works/, /industries/, /factory-fix/, /assessment/ (+ received/), /about/,
                /reados/ (+ collections/[book]/[chapter], books/[volume]/[chapter], publications/), /tools/, /contact/ (+ sent/, error/),
                /privacy/, /terms/, /disclaimer/, /search/, /chat/, 404, rss.xml, robots.txt,
                assistant-knowledge.json
  layouts/      BaseLayout (shell, theme, header/footer), LegalLayout (full-width legal pages)
  components/   Header, Footer, SiteWordmark, Logo, ThemeToggle, ServiceMap (four-square orbit),
                MotionVisual (purpose-built diagrams), Hero, ReadOSAnimatedCover, ContactForm, BookingCard, ChatWidget (KEVOS Assistant), SEO, …
  config/       site.ts (SITE, NAV, QUOTE_CTA, footer nav, contact, booking, assistant)
                taxonomy.ts (categories, tags) · work.ts
  data/         services.ts (Services page source of truth), faq.ts (assistant FAQ), brand.ts
  server/       contact and chat handlers (run in the Worker, tested in Node)
  styles/       global.css (tokens, typography, prose, light/dark themes)
  worker.ts     Worker entry: static assets, /api/chat, /api/contact, HTTPS, preview-host handling and the /insights/ redirect fallback
public/brand/   approved KEVOS logos and icons (plus legacy gocore-* files that are not used)
scripts/        build-kevos-icons.mjs (icons, runs in every build), postbuild.mjs (quality gate),
                reading-time.mjs, prepare-brand.mjs (KEVOS shim), brand/ (retired GoCore generators)
tests/          brand-wordmark, chat, contact, heading-font, reados-chapters, motion-scenes,
                tools-calculators, tool-input-guides, tools-on-demand, knowledge-links, worker
```

### READOS ↔ WORKOS connections

One relationship file, `src/data/knowledge-links.json`, connects READOS books and chapters with WORKOS tools in both directions: "Apply This in Practice" on READOS pages, "Learn the Concepts Behind This Tool" on tool pages and in the calculator (`/tools/knowledge.json`), plus learning pathways (`src/data/learning-pathways.json`). Only `approved` links between published pages are shown; the build stops on invalid ids. Suggestions (`npm run knowledge:suggest`) are never published. Maintenance: `docs/knowledge-links.md`; review list: `docs/knowledge-links-review.md`.

### WORKOS input guides

Every WORKOS input has a "What this means" panel with an SVG figure: renderer `public/tools/input-guides.js`, words per field in `public/tools/inputs-<file>.js` (one per tool file), rendered by `ui.js` and on the static `/tools/<id>/` pages. Check coverage with `node scripts/tools/input-guides.mjs check`; a new tool or field fails `tests/tool-input-guides.test.ts` until its entry is written. Report, inventory and open tool issues: `docs/tool-input-guides-progress.md`.

The `/tools/` page loads only `core.js`, `input-guides.js`, `ui.js` and a tool-to-file map (`#workos-tool-files`); `ui.js` fetches a tool's `data-`, `guides-`, `inputs-` and `calc-<file>.js` when it opens. A new tool file needs no page change: it is listed in `TOOL_FILES` and the map is built from it. `tests/tools-on-demand.test.ts` checks every tool calculates the same with only its own file loaded.

### Navigation (src/config/site.ts, src/config/products.ts)

**KEVOS 2.0 redesign (owner brief, 5 Nov 2026), replacing the 2 Nov header of Tools, Library, About, Contact.** Header (`NAV`, one list for every screen size, `Header.astro`): **Products** (Work → https://work.kevos.com/, CADOS → https://cados.kevos.com/, Desk shown as "Coming soon" with no link, All products → `/products/`), **Solutions** (`/solutions/#business-productivity`, `#engineering-design`, `#automation-workflows`), **Tools** (`/tools/`), **Resources** (Library → `/reados/`, Guides and articles → `/library/`, All resources → `/resources/`), **About** (Company → `/about/`, Contact → `/contact/`), and the orange **Get Started** button (`GET_STARTED` → `/#ask`, the homepage Ask KEVOS box). Menus are `<details>` elements (they open without JavaScript); on screens up to 1000 px the links move into a panel behind a menu button. Products and solution areas are defined once in `src/config/products.ts` and feed the header, footer, homepage, `/products/` and `/solutions/`; describe products only as the owner has stated, and never link a product that is not available. Footer (`FOOTER_NAV`): Products, Solutions, Resources (Tools, Library, Guides and articles, Search, RSS), Company (About, Contact, Engineering services, Problem Assessment, Factory Fix, Proof of Work, How It Works, Industries, booking) and Privacy, Terms, Disclaimer. **Naming rule (owner's decision, 2 Nov 2026, confirmed 5 Nov 2026):** the names WORKOS and READOS are retired from everything a visitor reads, including books, chapters, tool texts, page titles, the RSS feed and book metadata (`publisher: KEVOS® Library`). Use **Tools** and **Library**. REACHOS remains only as the `/contact/` page title and eyebrow. Unchanged on purpose: the URLs `/tools/` and `/reados/`, file and folder names, and code identifiers (`WORKOS_GUIDES`, `name="WORKOS"`, the collection value `'WORKOS'`). The Library page title is exactly "Engineering, Manufacturing & Business Knowledge Library | KEVOS". `tests/navigation.test.ts` keeps all of this in place.

### Homepage (src/pages/index.astro, since 5 Nov 2026)

KEVOS 2.0: "Make difficult work simple." Hero: label "Intelligence by KEVOS", the headline, "Tell us what you need. We'll help you get it done.", and the **Ask KEVOS** box ("What would you like to accomplish today?"), which is the existing discovery and learning-path pipeline (see **Discovery** and **Learning paths**; the button label is a prop of `DiscoveryBox.astro`, which keeps "Build My Learning Path" on the Tools and Library pages). Four example chips (`HOME_DISCOVERY_EXAMPLES` in `src/config/home.ts`: Analyse a document, Solve an engineering problem, Work with data, Automate a task) put a fuller question in the box; a note under the box says plainly that it recommends tools, chapters and steps and does not open files or do the work. Then **Explore KEVOS** (product cards: Work and CADOS available with launch buttons, Desk "Coming soon" with no product link), **Solutions** (three areas, the problems they address, and where to start), **Tools** ("Useful tools. Less complexity.", a no-JavaScript search form to `/tools/?q=`, topics, popular starting points, "Explore Tools"), **Resources** ("Knowledge that moves you forward.", Library counts, subjects, featured books, "Explore Library", "Guides and articles") and a short close. Every count is read from the catalogues at build time. The learning pathways moved to `/resources/#pathways`. Old homepage anchors (`/#pricing`, `/#case-<id>`, `/#workos`, `/#reados`, `/#connected`, …) are forwarded by a small script. `tests/homepage.test.ts` keeps the order, the wording, and pricing and invented figures off the homepage.

### Discovery (homepage question box, built 1 Nov 2026)

A visitor describes a problem; KEVOS® recommends existing WORKOS tools and READOS chapters and books. `POST /api/discover` (Worker, Workers AI binding `AI`, the assistant's models) returns only search terms and a one-line restatement; the browser ranks entries from `/discovery-index.json` (built from the tool register, the READOS library and `knowledge-links.json`) with `src/lib/discovery/search.ts`. Without AI it falls back to keyword, synonym and spelling search; without JavaScript the box submits to `/search/`. It never invents a resource and never calculates. Since 2 Nov 2026 each answer opens with **Your Solution Path** (`src/lib/discovery/plan.ts`): numbered steps with what to do, why, what to read, which tool, required inputs, expected output and how to check, built from the AI step or from the workflow for the question type (calculation, troubleshooting, design, manufacturing, business, learning); inputs, outputs and checks come from the tools themselves (`/discovery-details.json`). The AI also picks from a shortlist of real catalogue entries (by number only), and the WORKOS directory search (`/tools/`) uses the same pipeline for searches in plain words. The floating assistant is switched off site-wide (`SITE.assistant.enabled = false`). Anonymous usage statistics (keywords, outcome, opened resource, device class; no IP or identifier) are written to the Analytics Engine dataset `kevos_discovery` only when the binding `DISCOVERY_EVENTS` is on. It is **off**: with it, the production deploy failed (2 Nov 2026); switch Analytics Engine on for the account first, then uncomment it in `wrangler.toml` and restore the privacy paragraph; report: `node scripts/discovery/analytics-report.mjs` with `CF_API_TOKEN` (Account Analytics: Read). After a release, run Actions → **Live check** (`scripts/discovery/live-check.mjs`): key pages, branding, navigation and a real `/api/discover` round trip. Missed questions are fixed with a test case and a synonym group, never with a made-up resource. Design: `docs/discovery/ARCHITECTURE.md`; checklist and log: `docs/discovery/DEVLOG.md`; tests: `tests/discovery.test.ts`.

### Learning paths (homepage, since 2 Nov 2026)

The homepage question box (and the same box in the Tools and Library headers) builds a personalised course from the Library and Tools. Site text is Australian English (cited titles, organisation and standard names keep their published spelling). `POST /api/learn/intent` reads the goal (subject, objective, outcome, level, depth, topics); a short question still gets the quick answer (Your Solution Path). Otherwise the browser gathers real chapters and tools for each topic, shows a course arranged from the Library at once, and `POST /api/learn/plan` (Workers AI) rearranges it into modules and lessons by number only. Each lesson has Learn, **THE KEY THINGS TO UNDERSTAND**, Read, Apply, Practise and Verify (knowledge check), follow-up questions and simpler / technical variants, written by `POST /api/learn/lesson` from short excerpts of the chapters (`/learning/<n>.json`, built from the chapter text). Without AI, the course and lessons use the Library's own words. Depth: Quick Understanding, Structured Learning, Complete Course, Professional / Advanced. Progress is kept in `sessionStorage` for the tab only; there is no account. Every reply is validated in the Worker (no links, no invented entries, no stated calculation results); the AI provider is `src/server/ai/provider.ts`. Capacity: the Workers AI free allocation covers roughly 14 full courses a day; more needs the Workers Paid plan (owner approval). Design: `docs/discovery/ARCHITECTURE.md` §5; tests: `tests/learning.test.ts`; the live check plans one real course.

## 4. Brand system (frozen)

- **Wordmark:** fixed SVG paths, `public/brand/kevos-wordmark-orange-light.svg` and `-dark.svg`, used by `SiteWordmark.astro` and `Logo.astro`. Not rebuilt from a font.
- **Favicon and app icons:** orange angular K. Master `public/brand/kevos-chat-k-mark.svg`; `scripts/build-kevos-icons.mjs` generates `kevos-favicon-k-orange.svg`, PNG sizes 32/180/192/512 and `favicon.ico`.
- **Colours:** warm white paper `#fbfaf7`, charcoal ink `#1c1b19`, muted grey `#69665f`, light neutral borders; `--brand-orange: #ff6a13`; light-theme accent `#c2410c` (hover `#9a3412`), dark-theme accent `#ff7a29` (`src/styles/global.css`). Orange is for the main action on a screen (Ask KEVOS, Get Started), links and small highlights. No blue brand accents.
- **Components:** buttons (`Button.astro`: primary charcoal, accent orange, secondary outline, 8 px corners), cards (14 px corners, hairline borders, minimal shadow), section rhythm (eyebrow, heading, one sentence).
- **Typography (owner decision, 5 Nov 2026):** one family, Inter Tight, for headings, body, labels and buttons (`--font-display` is an alias of `--font-sans`); Source Serif 4 stays for long-form Library prose. The Oxanium file remains in `public/fonts/` but is no longer loaded. Scale: `--step--1` labels … `--step-5` homepage hero, set in `src/styles/global.css`.
- **Themes (owner decision, 5 Nov 2026, replacing the 8 Oct 2026 dark default):** the site opens in the **light** theme (`<html data-theme="light">` in `BaseLayout.astro` and `pages/chat.astro`, so it is light even without JavaScript). The visitor can switch to dark with `ThemeToggle.astro`; that choice is kept in `sessionStorage` key `kevos-theme` for the current browser session only, and any old `localStorage` value is removed. The operating-system preference is not followed. Covered by `tests/theme-default.test.ts`.
- **Motion:** `ServiceMap.astro` is the shared four-square orbit with orange core on Home (`platform` variant: design, build, operate, improve, each linking to its WORKOS topic), Services and About. `MotionVisual.astro` holds the purpose-built Industries, How It Works, Tools and Contact diagrams. `FactoryFixArt.astro` (Factory Fix hero: bottleneck → review → rebalanced flow → action plan) and `assessment/AssessmentHeroArt.astro` (assessment hero) are SVG scenes in the same blueprint-panel style on a 16-second timeline, as is `LegalArt.astro` (one scene each for Privacy, Terms and Disclaimer, chosen by `LegalLayout`'s `scene` prop). All respect reduced-motion preferences; the SVG scenes then show every stage as one still.
- **Legal pages:** Privacy, Terms and Disclaimer use `LegalLayout` aligned to the shared full-width header container.

Retired and not to be used: blue GoCore logo, GC favicon, `scripts/brand/build_brand.py`, `brand-source/generated/gocore-*`.

## 5. READOS chapters (formerly Insights)

- **Insights was retired on 17 Oct 2026.** All 750 articles are chapters of the 53 edited READOS books (`src/utils/reados-collections.ts`), read at `/reados/collections/<book>/<slug>/`; the category volumes at `/reados/books/` point their canonical URL there. Every `/insights/<slug>/` URL redirects permanently (one hop) to its chapter through `public/_redirects`; categories go to `/reados/#<category>`, tags and listing pages to `/reados/`, and `src/worker.ts` handles addresses the rules cannot match exactly. `tests/reados-chapters.test.ts` and `scripts/postbuild.mjs` keep it that way.
- Schema (`chapters` collection): `src/content.config.ts`. Title 5–120 characters, description 50–200, `publishDate` required (future dates hidden), `category` one of Engineering, Manufacturing, Operations, Projects, Ideas, Products, Technology, Business; 1–5 tags from `src/config/taxonomy.ts`; `author` defaults to KEVOS; `draft` defaults to false.
- Dates stay in frontmatter, JSON-LD and RSS, but chapter pages do not display them (evergreen editorial presentation).
- Older chapters carry `author: "GoCore"`; `chapterAuthor()` in `src/utils/content.ts` reports these as KEVOS. New chapters use `author: "KEVOS"`.
- Publishing rules and workflow: `docs/KEVOS_READOS_PUBLISHING.md`.

## 6. SEO, search and feeds

Per-page titles, descriptions and canonical URLs on `https://kevos.com`; Open Graph and X cards; JSON-LD (Organization, WebSite, Article, BreadcrumbList, ContactPage); `sitemap-index.xml`; `robots.txt`; RSS at `/rss.xml`; Pagefind search at `/search/`. `scripts/postbuild.mjs` fails the build on missing or duplicate metadata, multiple H1s, broken links or images, invalid JSON-LD, inline styles, leaked drafts, and writes `_headers` with a strict CSP.

## 7. Contact, booking and assistant

- **REACHOS (`/contact/`, redesigned 2 Nov 2026)** is the KEVOS® connection gateway: hero ("Connect with KEVOS."), four enquiry pathways (WORKOS, READOS, Ideas and feedback, Collaboration) that preselect the form category with `?service=<slug>#enquiry`, a "Not sure where to start?" section whose starter buttons (`data-assistant-ask`) open the live KEVOS® Assistant, the enquiry form, "Prefer to talk?" booking and location. No prices or packages.
- REACHOS form (`ContactForm.astro`): posts to the Worker `/api/contact` with Turnstile, honeypot and rate limit. Required: name, email, enquiry category (`service` field), message, privacy consent. Optional: organisation, website, related WORKOS tool or READOS resource (`?resource=<name>` fills it), phone. Categories are `ENQUIRY_CATEGORIES` in `src/lib/contact.ts` plus the service values in `SERVICE_OPTIONS`, so older `?service=factory-fix` (and other service) links still preselect. No attachments (the Worker rejects file fields). Success is shown only when the Worker confirms delivery.
- The assistant's "Leave a message" form still posts to Web3Forms with hCaptcha; no-JS fallback to `/contact/sent/`.
- Booking link: Proton Calendar booking page (`SITE.booking`).
- Engineering Problem Assessment (A$195, `/assessment/`, added 16 Oct 2026): content in `src/config/assessment.ts`; enquiries use the same provider as REACHOS (Web3Forms + hCaptcha); Worker endpoints `/api/assessment` (server-side validation, used when the provider is `worker`) and `/api/assessment/stripe-webhook` (signature-verified, disabled until `STRIPE_WEBHOOK_SECRET` is set). No payment is taken on the site. Operations, configuration and owner approvals: `docs/assessment/README.md`.
- KEVOS Assistant (switched off since 1 Nov 2026 with `SITE.assistant.enabled`; the homepage discovery box replaces it): `ChatWidget.astro` + `/chat/` pop-out; answers only from `assistant-knowledge.json` (built from published content) via Workers AI binding `AI`.

## 8. Deployment and CI

- `wrangler.toml`: Worker `throbbing-block-6c61`, `main = "src/worker.ts"`, assets from `./dist` (binding `ASSETS`, 404 page), `[ai]` binding, observability (Workers Logs) off since 29 Oct 2026 to match the dashboard, route `kevos.com/*` in zone `kevos.com`.
- A Workers custom domain `kevos.com → throbbing-block-6c61` also exists (seen 8 Oct 2026). It points to the same Worker.
- GitHub Actions: `verify.yml` (npm ci, npm run verify, KEVOS homepage branding checks that fail on GoCore titles) and `verify-site.yml` (npm ci, npm run verify). Neither deploys.
- Production deploys come from Cloudflare's GitHub build integration on pushes to `main`, or manually with `npm run deploy`. See `CLAUDE.md` for the rule on manual deploys and the 8 Oct 2026 incident.

## 9. Known legacy residue (not active identity)

Recorded so nobody mistakes it for current direction; changing any of it is a website-level change that needs approval:

- `src/components/TechDrawing.astro` contains the text "GOCORE" in an illustration.
- `src/pages/chat.astro` reads the theme from `localStorage` key `gocore-theme`, while the rest of the site uses `kevos-theme`.
- Identifiers such as `gocoreHcaptchaReady` (`src/lib/captcha.ts`) and the `gocore-assistant` window name in `ChatWidget.astro`.
- Test fixtures use `gocore.com.au` origins; `src/server/contact/handler.ts` comments mention gocore.com.au.
- Older articles: `author: "GoCore"` and phrases such as "GoCore's article" or "GoCore's series".
- Remote branches `gocore-pro-tools`, `kevos-rebrand`, `kevos-uppercase-brand`: historical, never merge into `main` without review.
