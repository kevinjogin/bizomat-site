# KEVOS READOS chapter publishing

The permanent, content-only workflow for publishing READOS chapters on https://kevos.com. It never changes the website design. Read `CLAUDE.md` first.

The former Insights section was retired on 17 October 2026: all 750 articles became chapters of the 53 edited READOS books, their files moved from `src/content/insights/` to `src/content/reados-chapters/`, and every `/insights/` URL redirects permanently to its chapter (`public/_redirects`, plus a fallback in `src/worker.ts`). Do not recreate `/insights/`.

## Workflow

**Fetch latest KEVOS → read project memory → identify approved chapters → update chapters (and book lists) only → verify → build and test → confirm the Cloudflare target → publish → verify the live site → report.**

1. **Fetch.** `git fetch origin`; work on `main` at `origin/main` (fast-forward only). Preserve any uncommitted local work on a backup branch before switching.
2. **Read memory.** `CLAUDE.md`, `docs/KEVOS_SOURCE_OF_TRUTH.md`, this file.
3. **Identify approved chapters.** Publish only chapters the owner has supplied or selected for this release. Never assume every draft, every untracked file or the newest file is approved. If the scope is unclear, ask.
4. **Change chapters only.** New or updated files in `src/content/reados-chapters/` (and images beside them), plus the chapter's slug in its edited book's `ids` list in `src/utils/reados-collections.ts` (otherwise it appears in its category's "Further Reading" book). If a chapter moves between books, add its old READOS URL to `public/_redirects` and update the matching `/insights/<slug>/` rule. Nothing else.
5. **Verify content** against the rules below.
6. **Build and test:** `npm ci` (when dependencies may have changed) and `npm run verify`. All checks must pass. Restore the icon files the build rewrites (`git restore public/brand/kevos-favicon-k-orange.svg public/brand/kevos-icon.svg public/favicon.svg public/favicon.ico`); never commit them.
7. **Compare with the baseline.** Build output may change only in generated content lists: READOS chapter and book pages, `/reados/` listings, `rss.xml`, `sitemap-*.xml`, `pagefind/`, `assistant-knowledge.json`, `_headers` CSP hashes if inline script hashes change. Logos, favicons, CSS, fonts and non-READOS pages must be unchanged.
8. **Commit** with explicit paths only (`git add -- src/content/reados-chapters/<files> src/utils/reados-collections.ts`), check `git diff --cached --stat`, and keep documentation changes in a separate commit.
9. **Publish** by pushing the verified commit to `main` (Cloudflare builds and deploys it). Use `npm run deploy` only from a clean checkout equal to `origin/main`.
10. **Verify live:** `/`, `/reados/`, `/about/` and every new chapter URL return 200 and show the orange KEVOS wordmark, the orange K favicon, unchanged navigation and themes. `npx wrangler deployments list` shows a new deployment after the push.
11. **Report** the commit, chapter URLs, checks and deployment ID. Nothing is "live" until its public URL has been checked.

## Chapter rules

### Frontmatter

```yaml
---
title: "Specific, useful title"          # 5–120 characters
description: "Plain summary…"            # 50–200 (aim 120–190)
publishDate: 2026-10-08                  # today in Sydney; never a future date
category: "Business"                     # Engineering, Manufacturing, Operations, Projects, Ideas, Products, Technology or Business
tags:                                     # 2–5 from src/config/taxonomy.ts
  - operations
  - strategy
author: "KEVOS"                          # always KEVOS for new chapters
featured: false
draft: false
---
```

- Slug = file name: lowercase, hyphenated, under about 60 characters, no dates, not already used.
- No image fields unless an image and alt text are supplied.
- Do not show dates in the body; layouts intentionally hide them.

### Body and voice

- No `# ` (H1) lines; the page title is the only H1. Two or three opening paragraphs before the first `##`.
- Professional, practical Australian English. Typical structure: core idea, method, a worked example that begins "This is an illustration.", "How this applies to a small Australian business", "Common mistakes", "Questions to ask" (bulleted), "Bringing it together", then `---` and an italic source line, e.g. `*Source: KEVOS notes, drawing on … This article is general information.*`
- Length normally 2,300–4,000 words (`npm run reading-time -- <slug>`; under 2,150 fails).
- 1–3 internal links in the form `[Title](/reados/collections/<book>/<slug>/)`, each to a published chapter at its edited-book address (the build fails on broken links).
- Never imply KEVOS offers services, products, prices, clients, partners, results or experience beyond `src/data/services.ts`. Never invent statistics, studies, quotes, people or case studies; label hypotheticals. Keep law general and refer readers to the ATO, ASIC, ACCC, Fair Work or an adviser.
- Never expose confidential employer, client or supplier information. Never name the founder.
- Avoid "dive in", "game changer", "unlock", "leverage" (verb), "in today's fast-paced world", "revolutionary" and question headings. At most one quote under 15 words.
- Check every calculation in examples.
- A link to a WORKOS tool (`[Bend allowance](/tools/bend-allowance/)`) needs a matching `book-link` entry in `src/data/knowledge-links.json` (see `docs/knowledge-links.md`); `npm run verify` fails until it is added. Describe only what the tool actually calculates.

## Pre-release checklist

- [ ] Only approved files under `src/content/reados-chapters/` (and the book list) are staged
- [ ] `author: "KEVOS"`, valid category and tags, description within limits, no H1
- [ ] Internal links resolve; no duplicate slugs; `draft: false` only on approved chapters
- [ ] `npm run verify` passes
- [ ] Build differences limited to generated content lists
- [ ] Pushed commit equals the deployed version; live URLs checked
