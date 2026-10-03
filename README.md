# GoCore website

The website for **GoCore** (gocore.com.au): a static Astro site hosted free on Cloudflare Pages, with a structured Insights publishing system, a Web3Forms contact form and an AI receptionist powered by Cloudflare Workers AI.

- **No database, no WordPress, no server to maintain.** Pages are built in advance and served from Cloudflare.
- **Publishing is a reviewed file change.** Write Markdown, set `draft: false`, push to Git, and Cloudflare rebuilds the site.
- **Every build checks itself** for broken links, missing metadata, leaked drafts and security headers.

---

## Contents

1. [Local development](#1-local-development)
2. [Project structure](#2-project-structure)
3. [Creating a new Insights post](#3-creating-a-new-insights-post)
4. [Frontmatter fields](#4-frontmatter-fields)
5. [Categories and tags](#5-categories-and-tags)
6. [Work entries](#6-work-entries)
7. [Images](#7-images)
8. [Contact form](#8-contact-form)
9. [GoCore Assistant (AI chat)](#9-gocore-assistant-ai-chat)
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
  components/   Header, Footer, Container, Section, Button, ArticleCard, CategoryBadge, Tag, SEO,
                Breadcrumb, Hero, CallToAction, ContactForm, ChatWidget, Logo, …
  config/       site.ts (name, URL, nav, contact, assistant) · taxonomy.ts (categories, tags) · work.ts
  content/      insights/*.md(x) and work/*.md: all editable content
  data/         brand.ts (exploring areas, principles) · faq.ts (assistant FAQ)
  layouts/      BaseLayout, InsightsIndex, LegalLayout
  lib/          contact.ts (shared validation) · contact-client.ts (form delivery)
  pages/        routes: /, /about/, /work/, /insights/, /contact/, /privacy/, /terms/, /search/, /chat/, 404
  server/       contact + chat handlers (run as Cloudflare functions, tested in Node)
  styles/       global.css (design tokens, typography, prose)
  utils/        content helpers, rehype table wrapper
functions/api/  Cloudflare Pages Functions: contact.ts, chat.ts
public/         static files: brand/, favicons, og-default.png, manifest
brand-source/   original logo artwork (not published)
scripts/        prepare-brand.mjs, make-brand-images.ps1, postbuild.mjs
tests/          contact and chat tests (node --test)
docs/           EDITORIAL_PROMPTS.md: the reusable article-writing prompts
```

## 3. Creating a new Insights post

1. Create `src/content/insights/your-post-slug.md` (or `.mdx`). **The file name becomes the permanent URL** `/insights/your-post-slug/`. Dates never appear in URLs.
2. Add frontmatter (below) with `draft: true`.
3. Write the article in Markdown. Use `##` for main sections; a table of contents appears automatically when there are 4 or more.
4. Run `npm run dev` and review it at its URL.
5. When it is ready, set `draft: false`, run `npm run verify`, commit and push.

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
author: "GoCore"                                        # optional, defaults to GoCore
featured: false                                         # featured posts get the top slot on /insights/
draft: true                                             # true = never in production, RSS, sitemap, search or the assistant
image: ./images/cover.jpg                               # optional, path relative to the post file
imageAlt: "Describe the image"                          # required when image is set
canonicalURL: https://example.com/original              # optional, only for articles first published elsewhere
---
```

The schema (`src/content.config.ts`) rejects unknown categories and tags, missing alt text and invalid dates, so mistakes fail the build instead of reaching the live site.

## 5. Categories and tags

**Categories = navigation. Tags = discovery. Dates = chronology. Search = retrieval.**

- **Adding a category:** add it to `CATEGORIES` in `src/config/taxonomy.ts`. Only add one when enough articles justify it. A category page appears automatically once it has a published article. Empty categories never get a page.
- **Adding a tag:** add it to `TAGS` in the same file, using one canonical lowercase slug (`ai`, never also `AI-tools` or `artificial-intelligence`). A tag page appears once 2 or more articles use it (`INSIGHTS.minPostsForTagPage` in `src/config/site.ts`).
- Monthly or yearly archive pages are intentionally not generated.

## 6. Work entries

Projects, products, experiments, research and concepts live in `src/content/work/`. Copy `_example-entry.md` (files starting with `_` are ignored), remove the underscore and fill it in.

| Field | Notes |
| --- | --- |
| `type` | Project · Product · Experiment · Research · Concept. A type only shows on the site when an entry uses it. |
| `status` | Exploring · Developing · Testing · Released · Completed · Archived |
| `featured` | Shown in "Selected work" on the homepage |
| `image`, `gallery` | Optional; optimised automatically |
| `relatedInsights` | List of Insights slugs to link from the detail page |
| `externalUrl` | Optional outbound link |
| `detailPage` | A detail page is created when the entry has body text, or when this is `true` |

Only add real work. Never invent projects or results.

## 7. Images

- **Article and work images:** put them next to the Markdown file (e.g. `src/content/insights/images/`) and reference them relatively. Astro creates AVIF and WebP versions at several sizes, with lazy loading and correct dimensions. Use JPG/PNG originals at least 2000 px wide.
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

The function (`functions/api/contact.ts` → `src/server/contact/`) validates input, checks origin, enforces the honeypot and rate limits, escapes email HTML and blocks header injection. All of this is covered by `tests/contact.test.ts`.

## 9. GoCore Assistant (AI chat)

A receptionist-style chat sits at the bottom right of every page. Visitors can **minimise** it or **pop it out** into its own window (`/chat/`). It:

- answers **only** from GoCore's published website content: FAQ, About, Work and Insights;
- refuses unrelated requests, never invents products, prices or promises, and ignores attempts to override its rules;
- offers **"Leave a message"**, which sends the visitor's details and the chat transcript through the same contact form system;
- keeps the conversation in the visitor's browser session only (nothing is stored by GoCore).

**How it works:** each build writes `/assistant-knowledge.json` from the site's published content (drafts are never included). `functions/api/chat.ts` picks the most relevant passages and asks a Workers AI model, with strict grounding rules, to answer.

**Free usage:** Workers AI is included in the Cloudflare **Workers Free plan** with a daily allocation (no card required). When the allocation is used up for the day, the assistant politely offers "Leave a message" instead. A 3B fallback model keeps cost per question low.

| Setting | Where | Default |
| --- | --- | --- |
| AI binding `AI` | `wrangler.toml` (`[ai]`), or Pages → Settings → Bindings → Workers AI | required |
| `CHAT_MODEL` | Pages environment variable | `@cf/meta/llama-3.1-8b-instruct-fast` |
| `CHAT_FALLBACK_MODEL` | Pages environment variable | `@cf/meta/llama-3.2-3b-instruct` |
| `CHAT_RATE_LIMIT_MAX` | Pages environment variable (needs the KV binding) | 40 questions per hour per visitor |

Cloudflare occasionally retires models or moves them to the paid plan. If answers stop, run `npx wrangler ai models`, pick a current free text-generation model, and set it as `CHAT_MODEL`. No code change is needed.

**Improve answers:** edit `src/data/faq.ts`. It is the assistant's highest-priority source. To switch the assistant off, set `SITE.assistant.enabled = false`.

## 10. Deploying to Cloudflare

### Recommended: Git integration (auto-deploys on every push)

1. Push this project to GitHub or GitLab. If it lives in a larger repository, note the folder name (`GoCore`).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select the repository.
3. Build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Astro |
   | Root directory | `GoCore` (or blank if this folder is the repository root) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION` = `22` |

4. **Save and Deploy.** `wrangler.toml` supplies the Workers AI binding. If the dashboard asks, add **Settings → Bindings → Workers AI** with the name `AI`.
5. **Custom domain:** project → **Custom domains → Set up a domain** → `gocore.com.au`, then `www.gocore.com.au`. Add a Redirect Rule from `www` to the apex domain. HTTPS is automatic.

### Alternative: direct upload from your computer

```bash
npx wrangler login
npm run deploy     # verify + build + wrangler pages deploy dist
```

Drag-and-drop upload in the dashboard works for the static site, but it does **not** include `functions/`, so the AI assistant would be unavailable (the contact form still works, because Web3Forms runs in the browser).

### What Cloudflare serves

- `_headers` (generated by `scripts/postbuild.mjs`): a strict Content-Security-Policy with hashes for every inline script, HSTS, `nosniff`, frame blocking, referrer and permissions policies, long-term caching for hashed assets, and `noindex` on the `*.pages.dev` address so only gocore.com.au is indexed.
- `404.html` for unknown URLs. Pagefind's search index lives in `/pagefind/`.

## 11. Changing branding

- **Logo and icon:** replace `brand-source/gocore-logo-original.png` (wordmark, transparent PNG) and `brand-source/gocore-icon-original.jpg` (square app icon), then run:

  ```bash
  npm run brand
  powershell -ExecutionPolicy Bypass -File scripts/make-brand-images.ps1
  ```

  The first command cleans the wordmark and creates `public/brand/gocore-logo.(png|webp)`, all favicons and app icons, and the assistant avatar. The second (Windows) regenerates the social card `public/og-default.png`. If the new wordmark's proportions differ, update `SITE.logo.width/height`.
- **Colours and fonts:** design tokens are at the top of `src/styles/global.css` (`--paper`, `--ink`, `--accent`, `--brand-orange`, `--brand-blue`, light and dark sets). `--accent` is the text-safe orange; `--brand-*` colours are for graphics only.
- **Fonts:** Inter Tight (interface and headings) and Source Serif 4 (articles), self-hosted via Fontsource. There are no third-party font requests.

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

1. Google Search Console → add `https://gocore.com.au` → verify with a DNS TXT record (added in Cloudflare DNS).
2. Submit `https://gocore.com.au/sitemap-index.xml`.
3. Optional analytics: Cloudflare → your Pages project → **Metrics → Web Analytics → Enable** (cookieless; already allowed by the CSP).

## 14. Quality checks

`npm run build` ends with `scripts/postbuild.mjs`, which fails the build if any page has:

- zero or several `<h1>`, a missing or duplicate title, or a missing description or canonical URL
- a broken internal link, missing image, broken in-page anchor or `<img>` without `alt`
- invalid JSON-LD or an inline `style` attribute (blocked by the CSP)
- a draft or future-dated entry in the pages, RSS or sitemap
- missing `sitemap-index.xml`, `rss.xml`, `robots.txt`, `404.html`, search index or assistant knowledge

`npm test` runs 16 tests covering the contact function (validation, honeypot, timing, origin, header injection, rate limiting, no-JS fallback) and the assistant (grounding, retrieval, model fallback, limits, input cleaning).
