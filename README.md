# KEVOS website

The website for **KEVOS** (kevos.com): a static Astro site served by a Cloudflare Worker, with the READOS reading library (edited books of Markdown chapters), the WORKOS decision tools, a Web3Forms contact form and an AI receptionist powered by Cloudflare Workers AI.

- **No database, no WordPress, no server to maintain.** Pages are built in advance and served as Worker static assets from Cloudflare.
- **Publishing is a reviewed file change.** Write Markdown, set `draft: false`, push to Git, and Cloudflare rebuilds the site.
- **Every build checks itself** for broken links, missing metadata, leaked drafts and security headers.

---

## Contents

1. [Local development](#1-local-development)
2. [Project structure](#2-project-structure)
3. [Adding a READOS chapter](#3-adding-a-reados-chapter)
4. [Frontmatter fields](#4-frontmatter-fields)
5. [Categories and tags](#5-categories-and-tags)
6. [Work entries](#6-work-entries)
7. [Images](#7-images)
8. [Contact form](#8-contact-form)
9. [KEVOS Assistant (AI chat)](#9-kevos-assistant-ai-chat)
10. [Deploying to Cloudflare](#10-deploying-to-cloudflare)
11. [Changing branding](#11-changing-branding)
12. [Changing navigation and site details](#12-changing-navigation-and-site-details)
13. [SEO workflow](#13-seo-workflow)
14. [Quality checks](#14-quality-checks)

---

## 1. Local development

Requires **Node.js 22.12 or newer**.

```bash
npm install
npm run dev        # http://localhost:4321 — drafts are visible here, marked "Draft"
npm run build      # production build into dist/ (drafts excluded) + search index + checks
npm run preview    # serve dist/ with Cloudflare's runtime, including /api/contact and /api/chat
npm run verify     # type check + tests + build: run this before every push
```

`npm run preview` uses Wrangler. The AI assistant needs `npx wrangler login` once, because Workers AI always runs on Cloudflare.

## 2. Project structure

```
src/
  components/   Header, Footer, Container, Section, Button, SEO, ReadOSAnimatedCover,
                Breadcrumb, Hero, CallToAction, ContactForm, ChatWidget, Logo, …
  config/       site.ts (name, URL, nav, contact, assistant) · taxonomy.ts (categories, tags) · work.ts
  content/      reados-chapters/*.md(x), reados-publications/ and work/*.md: all editable content
  data/         brand.ts (exploring areas, principles) · faq.ts (assistant FAQ)
  layouts/      BaseLayout, LegalLayout
  lib/          contact.ts (shared validation) · contact-client.ts (form delivery)
  pages/        routes: /, /about/, /tools/ (WORKOS), /reados/ (READOS), /contact/, /privacy/, /terms/, /search/, /chat/, 404
  server/       contact + chat handlers (run inside the Cloudflare worker, tested in Node)
  worker.ts     Cloudflare worker: serves the site, /api/chat and /api/contact (built to dist/_worker.js)
  styles/       global.css (design tokens, typography, prose)
  utils/        content helpers, rehype table wrapper
public/         static files: brand/, favicons, og-default.png, manifest
brand-source/   brand typeface (Archivo, OFL), generated artwork, legacy logo files (not published)
scripts/        brand/ (wordmark and heading-font builders), prepare-brand.mjs, postbuild.mjs
tests/          contact and chat tests (node --test)
docs/           EDITORIAL_PROMPTS.md: the reusable article-writing prompts
```

## 3. Adding a READOS chapter

The former Insights section was retired on 17 October 2026. Its 750 articles are now chapters of the edited READOS books, and every old `/insights/` address redirects to its chapter. Full workflow and rules: [docs/KEVOS_READOS_PUBLISHING.md](docs/KEVOS_READOS_PUBLISHING.md).

### Easiest: the online editor (Pages CMS)

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open the **gocore-website** repository. You will see **READOS chapters**, **Work** and **Assistant FAQ**.
3. **READOS chapters → Add an entry.** Fill in the title, description, category and tags, then write the chapter. Images can be uploaded straight into the editor.
4. Leave **Draft** ticked and save while you are still working. Untick **Draft** and save when it is ready.

Every save is a commit to GitHub. Cloudflare rebuilds and redeploys the site automatically within a few minutes. If a save breaks a content rule (for example a missing tag), the Cloudflare build fails and the live site stays as it was: check **Workers & Pages → throbbing-block-6c61 → Deployments** for the error.

### On your computer

1. Create `src/content/reados-chapters/your-chapter-slug.md` (or `.mdx`). **The file name is the chapter's permanent slug.** Dates never appear in URLs.
2. Add frontmatter (below) with `draft: true`.
3. Write the chapter in Markdown. Use `##` for main sections.
4. Add the slug to the right edited book's `ids` list in `src/utils/reados-collections.ts`; until then it appears in its category's "Further Reading" book. The chapter is read at `/reados/collections/<book>/<slug>/`.
5. Run `npm run dev` and review it at its URL.
6. When it is ready, set `draft: false`, run `npm run verify`, commit and push.

For drafting help, use the prompts in [docs/EDITORIAL_PROMPTS.md](docs/EDITORIAL_PROMPTS.md).

**Workflow:** Idea → Draft → Review → Fact check → Publish → Update. Never publish AI output without review.

## 4. Frontmatter fields

```yaml
---
title: "What makes a useful product worth building?"   # required, 5–120 chars
description: "A practical way to judge whether…"          # required, 50–200 chars (meta description)
publishDate: 2026-10-08                                 # required; future dates stay hidden until a build after that date
updatedDate: 2026-11-01                                 # optional, must not be before publishDate
category: "Products"                                    # required: exactly one of Ideas, Products, Technology, Business
tags:                                                   # required: 1–5 (normally 2–5) from the controlled list
  - product-development
  - validation
author: "KEVOS"                                        # optional, defaults to KEVOS
featured: false                                         # reserved; not currently displayed
draft: true                                             # true = never in production, RSS, sitemap, search or the assistant
image: ./images/cover.jpg                               # optional, path relative to the post file
imageAlt: "Describe the image"                          # required when image is set
canonicalURL: https://example.com/original              # optional, only for chapters first published elsewhere
---
```

The schema (`src/content.config.ts`) rejects unknown categories and tags, missing alt text and invalid dates, so mistakes fail the build instead of reaching the live site.

## 5. Categories and tags

**Categories = navigation. Tags = discovery. Dates = chronology. Search = retrieval.**

- **Adding a category:** add it to `CATEGORIES` in `src/config/taxonomy.ts`. Only add one when enough chapters justify it. Each category is a section of `/reados/` with its own edited books.
- **Adding a tag:** add it to `TAGS` in the same file, using one canonical lowercase slug (`ai`, never also `AI-tools` or `artificial-intelligence`). Tags feed site search, the assistant and the RSS feed.
- Monthly or yearly archive pages are intentionally not generated.

## 6. Work entries

Projects, products, experiments, research and concepts live in `src/content/work/`. Copy `_example-entry.md` (files starting with `_` are ignored), remove the underscore and fill it in.

| Field | Notes |
| --- | --- |
| `type` | Project · Product · Experiment · Research · Concept. A type only shows on the site when an entry uses it. |
| `status` | Exploring · Developing · Testing · Released · Completed · Archived |
| `featured` | Shown in "Selected work" on the homepage |
| `image`, `gallery` | Optional; optimised automatically |
| `relatedChapters` | List of READOS chapter slugs related to the entry |
| `externalUrl` | Optional outbound link |
| `detailPage` | A detail page is created when the entry has body text, or when this is `true` |

Only add real work. Never invent projects or results.

## 7. Images

- **Article and work images:** put them next to the Markdown file (e.g. `src/content/reados-chapters/images/`) and reference them relatively. Astro creates AVIF and WebP versions at several sizes, with lazy loading and correct dimensions. Use JPG/PNG originals at least 2000 px wide.
- **Inline images in Markdown:** `![Alt text](./images/diagram.png)` (alt text is required).
- **Social card:** posts with an `image` use it automatically (cropped to 1200×630). Otherwise `public/og-default.png` is used.
- **Static files** that must keep an exact URL go in `public/`.

## 8. Contact form

The form at `/contact/` works from day one through **Web3Forms**, using the access key in `src/config/site.ts` (`SITE.contact.web3formsAccessKey`). Messages arrive at the email address registered with that key.

- The access key is a **public form identifier**, designed to be placed in website HTML. It is not a password. If it is ever abused, regenerate it in the Web3Forms dashboard and update `site.ts`.
- **Spam protection:** Web3Forms' honeypot (`botcheck`), a "too fast to be human" check, and validation of every field. All of these are accessible.
- **Without JavaScript**, the form still posts to Web3Forms and redirects to `/contact/sent/`.
- **Free plan:** 250 submissions per month.
- **Show an email address** next to the form by setting `SITE.email` in `src/config/site.ts`.

### Switching to a Cloudflare Worker later

The UI calls `submitContact()` (`src/lib/contact-client.ts`) and never talks to a provider directly. To move delivery to your own function:

1. Set `PUBLIC_CONTACT_PROVIDER=worker` as a **build** environment variable in Cloudflare.
2. Add the variables from [.dev.vars.example](.dev.vars.example) (`MAIL_PROVIDER`, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`) under **Settings → Variables and Secrets**. Store keys as **Secrets**.
3. Optional rate limiting: create a KV namespace, bind it as `CONTACT_RATE_LIMIT` (see `wrangler.toml`).

The endpoint (`src/worker.ts` → `src/server/contact/`) validates input, checks origin, enforces the honeypot and rate limits, escapes email HTML and blocks header injection. All of this is covered by `tests/contact.test.ts`.

## 9. KEVOS Assistant (AI chat)

A receptionist-style chat sits at the bottom right of every page. Visitors can **minimise** it or **pop it out** into its own window (`/chat/`). It:

- answers **only** from KEVOS's published website content: FAQ, About, Work and READOS chapters;
- refuses unrelated requests, never invents products, prices or promises, and ignores attempts to override its rules;
- offers **"Leave a message"**, which sends the visitor's details and the chat transcript through the same contact form system;
- keeps the conversation in the visitor's browser session only (nothing is stored by KEVOS).

**How it works:** each build writes `/assistant-knowledge.json` from the site's published content (drafts are never included). The site worker (`src/worker.ts` → `src/server/chat/`) picks the most relevant passages and asks a Workers AI model, with strict grounding rules, to answer.

**Free usage:** Workers AI is included in the Cloudflare **Workers Free plan** with a daily allocation (no card required). When the allocation is used up for the day, the assistant politely offers "Leave a message" instead. A 3B fallback model keeps cost per question low.

| Setting | Where | Default |
| --- | --- | --- |
| AI binding `AI` | `wrangler.toml` (`[ai]`), applied by `npm run deploy` | required |
| `CHAT_MODEL` | Worker variable (`[vars]` in wrangler.toml) | `@cf/meta/llama-3.1-8b-instruct-fast` |
| `CHAT_FALLBACK_MODEL` | Worker variable (`[vars]` in wrangler.toml) | `@cf/meta/llama-3.2-3b-instruct` |
| `CHAT_RATE_LIMIT_MAX` | Worker variable (`[vars]` in wrangler.toml; needs the KV binding) | 40 questions per hour per visitor |

Cloudflare occasionally retires models or moves them to the paid plan. If answers stop, run `npx wrangler ai models`, pick a current free text-generation model, and set it as `CHAT_MODEL`. No code change is needed.

**Improve answers:** edit `src/data/faq.ts`. It is the assistant's highest-priority source. To switch the assistant off, set `SITE.assistant.enabled = false`.

## 10. Deploying to Cloudflare

The site runs as a **Cloudflare Worker** (`throbbing-block-6c61`, attached to `kevos.com`). The Worker serves the static files in `dist/` and runs `src/worker.ts` for `/api/chat` (KEVOS Assistant) and `/api/contact`. All settings, including the Workers AI binding and the custom domain, live in [wrangler.toml](wrangler.toml).

### Deploy (recommended)

One-time setup: sign Wrangler in to your Cloudflare account. A browser window opens; approve the access.

```bash
npx wrangler login
```

Then, every time you want to publish:

```bash
npm run deploy     # type check + tests + build + checks, then wrangler deploy
```

`npm run preview` runs the Worker locally (`wrangler dev`), including the assistant, which calls Workers AI remotely.

### Why not drag and drop?

Uploading files in the dashboard creates a Worker with **static assets only**. The website and the Web3Forms contact form work that way, but the Worker never runs `src/worker.ts`, so the **assistant does not work** and adding an AI binding in the dashboard will not change that. Use `npm run deploy` instead. If you ever do drag and drop, upload only the **`dist`** folder (about 110 files), never the whole project (`node_modules` is over 15,000 files).

### Automatic deploys from GitHub (used by the online editor)

Workers & Pages → **throbbing-block-6c61 → Settings → Build → Connect** → GitHub → `jogkev-creator/gocore-website`, branch `main`.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` (blank) |

Every push to `main`, including every save in Pages CMS, then rebuilds and deploys the site. `npm run deploy` from your computer still works too.

### Renaming the Worker

The Worker name in `wrangler.toml` must match the dashboard. If you rename it (Settings → General), update `name` in `wrangler.toml` before the next deploy, or a second Worker will be created.

### What Cloudflare serves

- Static files from `dist/`, with response headers from `dist/_headers` (generated by `scripts/postbuild.mjs`): a strict Content-Security-Policy with hashes for every inline script, HSTS, `nosniff`, frame blocking, referrer and permissions policies, and long-term caching for hashed assets. `dist/404.html` is used for unknown pages.
- `src/worker.ts` for everything that is not a file: `/api/chat`, `/api/contact` and any other non-file request. It keeps `*.workers.dev` and `*.pages.dev` addresses out of search engines.
- `dist/_worker.js` is a bundled copy of the same Worker for Cloudflare Pages deployments. `.assetsignore` keeps it out of the public files when deploying as a Worker.

## 11. Changing branding

**Current approved identity: KEVOS orange.** The former GoCore/GC art generator and its blue logo are retired; do not run `python scripts/brand/build_brand.py` on the production website.

- **Wordmark:** the approved orange vector logos are `public/brand/kevos-wordmark-orange-light.svg` and `public/brand/kevos-wordmark-orange-dark.svg`. The site's `SiteWordmark.astro` and `Logo.astro` use these exact files; the primary identity is not reconstructed from a text font.
- **Favicons, app icons, assistant K:** the master angular orange K is `public/brand/kevos-chat-k-mark.svg`. `npm run brand` safely regenerates `public/brand/kevos-favicon-k-orange.svg`, the PNG sizes and `public/favicon.ico` using `scripts/build-kevos-icons.mjs`. The normal production build also does this before Astro runs.
- **Legacy safety:** `scripts/prepare-brand.mjs` is a compatibility shim for previous build setups; it now calls the KEVOS icon builder rather than generating GoCore artwork. Old `brand-source/generated/gocore-*` files are legacy records, not the live KEVOS identity.
- **Type system:** self-hosted KEVOS Display (Oxanium-based) is used for major headings. Body copy stays readable with Inter Tight and articles use Source Serif 4. The approved KEVOS orange logo itself uses fixed SVG paths.
- **Colours:** `src/styles/global.css` contains the light/dark colour tokens. All blue legacy brand accents are replaced with the approved KEVOS orange.
- **Motion:** `src/components/ServiceMap.astro` is the shared four-square Home/Services/About orbit. `src/components/MotionVisual.astro` contains the purpose-specific Industries/How It Works/Tools/Contact diagrams. Every animation respects reduced-motion preferences.

If the website unexpectedly displays GoCore, **do not roll back GitHub**: confirm the Cloudflare Worker `throbbing-block-6c61` has a successful build from the latest `main` commit and that `kevos.com/*` routes to that deployment.

## 12. Changing navigation and site details

Everything lives in `src/config/site.ts`:

- `NAV`: header links (keep it short). `FOOTER_NAV` adds Privacy and Terms.
- `SITE`: name, URL, default title and description, footer statement, `email` (empty = hidden), `social` links, contact provider, assistant settings, and the jurisdiction shown in Terms.
- Homepage "exploring" areas and principles: `src/data/brand.ts`. Assistant FAQ: `src/data/faq.ts`.

## 13. SEO workflow

Generated automatically on every build:

- Unique `<title>` and meta description per page (the build fails on duplicates or missing descriptions)
- Canonical URLs, Open Graph and X/Twitter cards
- JSON-LD: `Organization` and `WebSite` everywhere, `Article` on posts, `BreadcrumbList` on inner pages, `ContactPage` on Contact, `CreativeWork` for work
- `sitemap-index.xml` (drafts, search, chat and form result pages excluded), `robots.txt`, RSS at `/rss.xml`

**Per article:** write a specific `title` (aim for 50–60 characters) and `description` (140–160), choose one category and 2–5 tags, add alt text to every image, and link to related articles.

**After launch:**

1. Google Search Console → add `https://kevos.com` → verify with a DNS TXT record (added in Cloudflare DNS).
2. Submit `https://kevos.com/sitemap-index.xml`.
3. Optional analytics: Cloudflare → **Analytics & Logs → Web Analytics → Add a site** → kevos.com, then enable automatic setup (cookieless; already allowed by the CSP).

## 14. Quality checks

`npm run build` ends with `scripts/postbuild.mjs`, which fails the build if any page has:

- zero or several `<h1>`, a missing or duplicate title, or a missing description or canonical URL
- a broken internal link, missing image, broken in-page anchor or `<img>` without `alt`
- invalid JSON-LD or an inline `style` attribute (blocked by the CSP)
- a draft or future-dated entry in the pages, RSS or sitemap
- missing `sitemap-index.xml`, `rss.xml`, `robots.txt`, `404.html`, search index or assistant knowledge

`npm test` runs 20 tests covering the contact endpoint (validation, honeypot, timing, origin, header injection, rate limiting, no-JS fallback), the assistant (grounding, retrieval, model fallback, limits, input cleaning) and the site worker (routing, caching and search-engine headers).
