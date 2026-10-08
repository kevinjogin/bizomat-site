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
| Content | `src/content/insights/` (Insights), `src/content/work/` (Work) |

## 2. Verified baseline

| Item | Value |
|---|---|
| Baseline commit | `3dd21f6` (Docs: record approved KEVOS orange branding and safe recovery from legacy GoCore deploys), 8 Oct 2026 |
| Verification | `npm ci` + `npm run verify`: 36/36 tests, 330 pages verified |
| Build output | 708 files in `dist/`; full SHA-256 manifest in `docs/baseline/kevos-build-manifest-3dd21f6.sha256` (manifest SHA-256 `8afc3c9bb0692517…`; paths relative to `dist/`) |
| Live check | `/`, `/insights/`, `/about/`, `/services/`, `/contact/`, `/privacy/`, `/terms/` and `/insights/category/business/` on kevos.com were byte-identical to this build on 8 Oct 2026 |
| Key asset hashes (first 16 hex) | `brand/kevos-wordmark-orange-light.svg` f3607e97916ae13d · `brand/kevos-wordmark-orange-dark.svg` b5e02ee5e21e8714 · `brand/kevos-favicon-k-orange.svg` and `favicon.svg` ae1232c658ae94be |

Later commits that add Insights will legitimately change article pages, listings, tag and category pages, the homepage article previews, `sitemap-0.xml`, `rss.xml`, the Pagefind index and `assistant-knowledge.json`. They must not change the brand assets, CSS, layouts or non-Insights pages beyond those generated lists.

## 3. Site architecture

```
src/
  pages/        /, /services/, /tools/, /how-it-works/, /industries/, /factory-fix/, /about/,
                /insights/ (+ page/, category/, tag/, [slug]), /contact/ (+ sent/, error/),
                /privacy/, /terms/, /disclaimer/, /search/, /chat/, 404, rss.xml, robots.txt,
                assistant-knowledge.json
  layouts/      BaseLayout (shell, theme, header/footer), InsightsIndex, LegalLayout (full-width legal pages)
  components/   Header, Footer, SiteWordmark, Logo, ThemeToggle, ServiceMap (four-square orbit),
                MotionVisual (purpose-built diagrams), Hero, ArticleCard, InsightsListing,
                TableOfContents, ContactForm, BookingCard, ChatWidget (KEVOS Assistant), SEO, …
  config/       site.ts (SITE, NAV, QUOTE_CTA, footer nav, contact, booking, assistant)
                taxonomy.ts (categories, tags) · work.ts
  data/         services.ts (Services page source of truth), faq.ts (assistant FAQ), brand.ts
  server/       contact and chat handlers (run in the Worker, tested in Node)
  styles/       global.css (tokens, typography, prose, light/dark themes)
  worker.ts     Worker entry: static assets, /api/chat, /api/contact, HTTPS and preview-host handling
public/brand/   approved KEVOS logos and icons (plus legacy gocore-* files that are not used)
scripts/        build-kevos-icons.mjs (icons, runs in every build), postbuild.mjs (quality gate),
                reading-time.mjs, prepare-brand.mjs (KEVOS shim), brand/ (retired GoCore generators)
tests/          brand-wordmark, chat, contact, heading-font, insights-editorial, motion-scenes,
                tools-calculators, worker
```

### Navigation (src/config/site.ts)

Header: Home, Services, Tools, How It Works, Industries, Insights, About, plus the corporate call to action **"Discuss Your Requirements"** → `/contact/`. Footer adds service anchors, Factory Fix, Free Tools, and Privacy, Terms, Disclaimer.

## 4. Brand system (frozen)

- **Wordmark:** fixed SVG paths, `public/brand/kevos-wordmark-orange-light.svg` and `-dark.svg`, used by `SiteWordmark.astro` and `Logo.astro`. Not rebuilt from a font.
- **Favicon and app icons:** orange angular K. Master `public/brand/kevos-chat-k-mark.svg`; `scripts/build-kevos-icons.mjs` generates `kevos-favicon-k-orange.svg`, PNG sizes 32/180/192/512 and `favicon.ico`.
- **Colours:** `--brand-orange: #ff6a13`; light-theme accent `#c2410c`; dark-theme accent `#ff7a29` (`src/styles/global.css`). No blue brand accents.
- **Typography:** KEVOS Display (Oxanium-based, self-hosted) for H1–H6; Inter Tight for body; Source Serif 4 for article prose.
- **Themes:** light and dark, toggled by `ThemeToggle.astro`, stored in `localStorage` key `kevos-theme`.
- **Motion:** `ServiceMap.astro` is the shared four-square orbit with orange core on Home, Services, Insights and About. `MotionVisual.astro` holds the purpose-built Industries, How It Works, Tools and Contact diagrams. All respect reduced-motion preferences.
- **Legal pages:** Privacy, Terms and Disclaimer use `LegalLayout` aligned to the shared full-width header container.

Retired and not to be used: blue GoCore logo, GC favicon, `scripts/brand/build_brand.py`, `brand-source/generated/gocore-*`.

## 5. Insights system

- Schema: `src/content.config.ts`. Title 5–120 characters, description 50–200, `publishDate` required (future dates hidden), `category` one of Engineering, Manufacturing, Operations, Projects, Ideas, Products, Technology, Business; 1–5 tags from `src/config/taxonomy.ts`; `author` defaults to KEVOS; `draft` defaults to false.
- Dates stay in frontmatter, JSON-LD and RSS, but cards and article pages do not display them (evergreen editorial presentation, enforced by `tests/insights-editorial.test.ts`).
- Older articles carry `author: "GoCore"`; `insightAuthor()` in `src/utils/content.ts` displays these as KEVOS. New articles use `author: "KEVOS"`.
- Publishing rules and workflow: `docs/KEVOS_INSIGHTS_PUBLISHING.md`.

## 6. SEO, search and feeds

Per-page titles, descriptions and canonical URLs on `https://kevos.com`; Open Graph and X cards; JSON-LD (Organization, WebSite, Article, BreadcrumbList, ContactPage); `sitemap-index.xml`; `robots.txt`; RSS at `/rss.xml`; Pagefind search at `/search/`. `scripts/postbuild.mjs` fails the build on missing or duplicate metadata, multiple H1s, broken links or images, invalid JSON-LD, inline styles, leaked drafts, and writes `_headers` with a strict CSP.

## 7. Contact, booking and assistant

- Contact and quotation forms post to Web3Forms (public access key in `site.ts`) with hCaptcha and spam checks; no-JS fallback to `/contact/sent/`.
- Booking link: Proton Calendar booking page (`SITE.booking`).
- KEVOS Assistant: `ChatWidget.astro` + `/chat/` pop-out; answers only from `assistant-knowledge.json` (built from published content) via Workers AI binding `AI`.

## 8. Deployment and CI

- `wrangler.toml`: Worker `throbbing-block-6c61`, `main = "src/worker.ts"`, assets from `./dist` (binding `ASSETS`, 404 page), `[ai]` binding, observability on, route `kevos.com/*` in zone `kevos.com`.
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
