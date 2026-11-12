# BIZOMAT Library chapter publishing

The permanent, content-only workflow for adding or changing chapters of the edited Library books (`src/content/reados-chapters/`), read at https://bizomat.ai/reados/. It never changes the website design. Read `CLAUDE.md` first. The file keeps its former name because `CLAUDE.md` and the `/library-book` command point to it.

Authored books (`src/content/reados-publications/<book>/`) have their own workflow: `docs/reados/AUTHORING.md` and the `/library-book` command (`.claude/commands/library-book.md`), with the checker `node scripts/library/check-book.mjs <book-slug>`. This file's "Chapter rules" apply to both.

## History

- The former Insights section was retired on 17 October 2026: all 750 articles became chapters of the 53 edited READOS books, their files moved from `src/content/insights/` to `src/content/reados-chapters/`, and every `/insights/` URL redirects permanently to its chapter (`public/_redirects`, plus a fallback in `src/worker.ts`; the Node server on Fly reads the same file, `src/node/assets.ts`). Do not recreate `/insights/`.
- The names READOS and WORKOS were retired from visible text on 2 November 2026: they are "the Library" and "Tools".
- Until November 2026 the Library was part of kevos.com (KEVOS), and a push to `main` deployed it through Cloudflare. BIZOMAT has been the brand since 5 November 2026 and `kevinjogin/bizomat-site` the source of truth since 9 November 2026. kevos.com is the KEVOS site again on its own Worker, and nothing from this repository publishes there or to Cloudflare (`scripts/deploy-guard.mjs`; `CLAUDE.md`, "Deployment").
- 208 older chapters carry `author: "GoCore"`. The site shows them as BIZOMAT (`chapterAuthor` in `src/utils/content.ts`); leave them as they are.

## Workflow

**Fetch → read → identify approved chapters → change chapters (and book lists) only → check → build and test → pull request → the owner deploys → check the live site → report.**

1. **Fetch.** `git fetch origin`. Preserve any uncommitted local work on a backup branch before anything else. Work on a branch made from `origin/main` (a cloud session uses the branch it was given) and confirm `git merge-base --is-ancestor origin/main HEAD`.
2. **Read.** `CLAUDE.md`, `docs/BIZOMAT-PROJECT-STATUS.md` (section 6: open owner actions, including deploys and CI), this file, and `docs/knowledge-links.md` when a chapter links a tool.
3. **Identify approved chapters.** Set `draft: false` only on chapters the owner has supplied or approved for this release; write everything else with `draft: true`. Never assume every draft, every untracked file or the newest file is approved. If the scope is unclear, ask.
4. **Change chapters only.** New or updated files in `src/content/reados-chapters/` (images in `src/content/reados-chapters/images/`), plus the chapter's slug in its edited book's `ids` list in `src/utils/reados-collections.ts` (otherwise it appears in its category's "Further Reading" book). The chapter's category must match the book's (`tests/reados-chapters.test.ts`). If a chapter moves between books, add its old chapter URL to `public/_redirects` and update the matching `/insights/<slug>/` rule. A tool link also needs its entry in `src/data/knowledge-links.json` (see "Body and voice"). Nothing else.
5. **Check content** against the rules below; `npm run reading-time -- <slug>` must show `ok`.
6. **Build and test:** `npm ci` (when dependencies may have changed), then `npm run verify` (astro check, every test, the build and its post-build checks). All checks must pass. When a chapter links a tool, also run `npm run knowledge:check`. Then run `git status --short`: it must list only your chapter files and the lines you meant to change. `shared/brand/build.mjs` writes only files whose content changed, so a build leaves the brand files alone (the old step that restored the KEVOS icon files after a build is obsolete). If anything else appears, restore it (`git restore <path>`) and never commit it.
7. **Compare with the baseline.** Build output may change only in generated content lists: Library chapter and book pages, `/reados/` listings, `rss.xml`, `sitemap-*.xml`, `pagefind/`, `assistant-knowledge.json`, `_headers` CSP hashes if inline script hashes change. Logos, favicons, CSS, fonts and pages outside the Library must be unchanged.
8. **Commit** with explicit paths only (`git add -- src/content/reados-chapters/<files> src/utils/reados-collections.ts`), check `git diff --cached --stat`, and keep documentation changes in a separate commit.
9. **Open a pull request to `main`** listing the chapters, their URLs and the check results. Merging is the owner's decision. GitHub Actions may not run (`docs/BIZOMAT-PROJECT-STATUS.md`, section 6): the local checks above are the gate, and the pull request says whether CI ran.
10. **Publishing is the owner's.** Merging does not publish. bizomat.ai is the Fly app `bizomat`, deployed only by the owner: GitHub Actions > "BIZOMAT deploy (bizomat)" > Run workflow on `main` with `confirm` = `DEPLOY`, or the laptop's `.\bizomat.ps1 deploy website`. A deploy ships everything on `main` (website, router and Project Management), including changes already waiting there (section 6 of the status). Never deploy from a content task and never run `npm run deploy` or `wrangler deploy`: `scripts/deploy-guard.mjs` refuses, and nothing publishes to Cloudflare or kevos.com from this repository. Tell the owner what else is waiting on `main`, then wait.
11. **Check live** after the owner reports the deploy, on https://bizomat.ai, as `CLAUDE.md`, "After any production change", lists: `/`, `/reados/`, `/engine-room/` (and that `/about/` redirects there) and every new chapter URL (`/reados/collections/<book>/<slug>/`) return 200 and show the BIZOMAT wordmark and favicon, the navigation (CAD Automation, Project Management, Resources, Engine Room, with AI Search and Sign in), a new session in the light theme, and AI search answering.
12. **Report** the pull request, the merged commit, the chapter URLs, the checks and the deploy (who ran it and when). Nothing is "live" until its public URL has been checked.

## Chapter rules

### Frontmatter

```yaml
---
title: "Specific, useful title"          # 5–120 characters
description: "Plain summary…"            # 50–200 (aim 120–190)
publishDate: 2026-11-12                  # today in Sydney; never a future date
category: "Business"                     # Engineering, Manufacturing, Operations, Projects, Ideas, Products, Technology or Business
tags:                                     # 2–5 from src/config/taxonomy.ts
  - operations
  - strategy
author: "BIZOMAT"                        # always BIZOMAT for new chapters (the schema's default)
featured: false
draft: true                              # false only once the owner approves the chapter
---
```

- Slug = file name: lowercase, hyphenated, under about 60 characters, no dates, not already used.
- No image fields unless an image and alt text are supplied.
- Do not show dates in the body; layouts intentionally hide them.

### Body and voice

- No `# ` (H1) lines; the page title is the only H1. Two or three opening paragraphs before the first `##`.
- Professional, practical Australian English. Typical structure: core idea, method, a worked example that begins "This is an illustration.", "How this applies to a small Australian business", "Common mistakes", "Questions to ask" (bulleted), "Bringing it together", then `---` and an italic source line, e.g. `*Source: BIZOMAT notes, drawing on … This article is general information.*`
- Length normally 2,300–4,000 words. `npm run reading-time -- <slug>` must show `ok` (10 to 20 minutes at 220 words a minute; under 2,090 words it shows SHORT). The build does not check length, so run it.
- 1–3 internal links in the form `[Title](/reados/collections/<book>/<slug>/)`, each to a published chapter at its edited-book address (the build fails on broken links).
- Never imply BIZOMAT offers services, products, prices, clients, partners, results or experience beyond `src/data/services.ts` and `src/data/platform-catalog.ts`. Never invent statistics, studies, quotes, people or case studies; label hypotheticals. Keep law general and refer readers to the ATO, ASIC, ACCC, Fair Work or an adviser.
- Never expose confidential employer, client or supplier information. Never name the founder.
- Avoid "dive in", "game changer", "unlock", "leverage" (verb), "in today's fast-paced world", "revolutionary" and question headings. At most one quote under 15 words.
- Check every calculation in examples.
- **Names in text:** write BIZOMAT, "the Library" and "Tools" (or "the BIZOMAT tool"). Never write the former names READOS, WORKOS, REACHOS, KEVOS, CADOS or GoCore in book text (`tests/navigation.test.ts` fails on READOS and WORKOS). BIZOMAT is not a registered trade mark: never write ® or ™ after it. Internal identifiers keep their old names: the folders `src/content/reados-chapters/` and `src/content/reados-publications/`, the routes `/reados/...` and the key `"reados"` in `src/data/knowledge-links.json`. Authored books (`book.md`) use `author: BIZOMAT` and `publisher: BIZOMAT Library`; the schema in `src/content.config.ts` accepts nothing else.
- A link to a tool (`[Bend allowance](/tools/bend-allowance/)`) needs a matching approved `book-link` entry in `src/data/knowledge-links.json` (for an edited-book chapter, `"reados": "collection/<book>"` and `"chapter": "<slug>"`; see `docs/knowledge-links.md`). `tests/knowledge-links.test.ts` fails until it is added. Describe only what the tool actually calculates.

## Pre-release checklist

- [ ] Only approved files under `src/content/reados-chapters/` (and the book list, and any knowledge-links entries) are staged
- [ ] `author: "BIZOMAT"`, valid category and tags, description within limits, no H1, no former names
- [ ] Internal links resolve; no duplicate slugs; `draft: false` only on approved chapters
- [ ] `npm run reading-time -- <slug>` shows `ok`; `npm run verify` passes; `git status --short` lists only your files
- [ ] Build differences limited to generated content lists
- [ ] Pull request opened; after the owner's deploy, the live URLs on https://bizomat.ai checked
