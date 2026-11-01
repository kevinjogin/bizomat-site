# KEVOS discovery: development log and checklist

The persistent record for the "What would you like to solve today?" discovery feature (master command: KEVOS Intelligent Discovery and Problem-Solving Platform). Architecture and audit: `docs/discovery/ARCHITECTURE.md`. Update this file whenever the feature changes.

- **Branch:** `claude/loving-mccarthy-oubwh2` (based on `main` at `c2975d3`).
- **Status:** built and tested on the branch. **Not deployed.** Production release needs the owner's approval (see section 6).

## 1. Acceptance checklist (Part 19)

| # | Criterion | Status | Where |
|---|---|---|---|
| 1 | Homepage asks "What would you like to solve today?" with a multi-line question box, examples, Enter to send and Shift+Enter for a new line | Done | `src/pages/index.astro`, `src/components/discovery/DiscoveryBox.astro` |
| 2 | Uses the existing Cloudflare Workers AI binding only (no new paid AI service) | Done | `src/server/discover/handler.ts` (same models as the KEVOS® Assistant) |
| 3 | One index of every WORKOS tool, READOS book and READOS chapter, rebuilt with the site | Done | `src/utils/discovery-index.ts` → `/discovery-index.json` |
| 4 | Hybrid matching: keywords, synonyms, spelling correction, categories and topics, AI intent terms, and AI picks from a shortlist of real entries | Done | `src/lib/discovery/search.ts`, `synonyms.ts`, `client.ts` |
| 5 | Results grouped as Recommended tools, Knowledge and references, Related resources; at most 5 strong matches each; a reason on every card | Done | `src/scripts/discovery.ts` |
| 6 | Follow-up questions use the previous question as context; the last 5 exchanges stay on screen | Done | `src/scripts/discovery.ts` |
| 7 | Clarifying question with choices when a question is too broad ("cost") | Done | `search.ts` clarify rule and the AI `ambiguous` reply |
| 8 | Honest no-match, with the closest resources and a "Suggest a new tool or topic" link | Done | `search.ts` coverage rule, AI `inScope` |
| 9 | Never invents a tool, book, chapter, URL or number | Done | Results come only from the index; the AI reply is filtered to plain search terms (`parseIntent`) |
| 10 | Works without AI (fallback to keyword search) and without JavaScript (the box submits to `/search/`) | Done | `understand()` returns null on failure; `<form action="/search/">` |
| 11 | WORKOS calculations unchanged | Done | No file under `public/tools/` changed; existing calculator tests and sweep pass |
| 12 | Chatbot transition: the floating assistant is switched off site-wide (owner's request, 1 Nov 2026); `/chat/` and `/api/chat` kept but unlinked | Done | `SITE.assistant.enabled` in `src/config/site.ts` |
| 13 | Security: same-origin, JSON only, 4,000-byte body, 500-character question, rate limit (edge limiter: 10 questions a minute per IP, own counter; plus 60 an hour if the KV store `CONTACT_RATE_LIMIT` is bound), 7 s model timeout, prompt-injection filtering, no secrets in the browser | Done | `handler.ts`, `worker.ts` |
| 14 | Privacy: calculator inputs are never sent; the question goes only to Workers AI and is not stored; analytics are anonymous terms and clicks, no IP, no question text | Done | `handleDiscoverEvent`; storage is off until a binding is approved |
| 15 | Performance: the index (about 1.6 MB, compressed by Cloudflare) loads on first focus or first question and is cached; no extra script on other pages | Done | `loadEngine()` |
| 16 | SEO: homepage title, description and H1 updated; WebSite SearchAction points at `/search/?q=`; `/?q=` runs a question | Done | `SEO.astro`, `index.astro` |
| 17 | Accessibility: labelled form, `role=status` messages, focus moves to the results heading, 44 px targets, reduced-motion respected, keyboard only works | Done | `discovery.css`, browser checks |
| 18 | Tests with at least 30 natural-language questions | Done (34 questions plus ambiguous, unsupported and misspelt cases) | `tests/discovery.test.ts` |
| 19 | Development log, checklist and final report | Done | this file |

## 2. Phases

1. **Audit** of the existing site, AI, chatbot, catalogues, search, analytics and constraints → `ARCHITECTURE.md` §1–2.
2. **Index**: compact build-time JSON of 1,013 tools, 208 books, 2,258 chapters and the reviewed knowledge links.
3. **Search engine**: BM25 over weighted fields (name 3, question 1.4, description 1.2, keywords 1, category 0.7, book 0.5), curated synonyms (about 80 groups), spelling correction against the catalogue's own words, word-pair boost, coverage rule for no-match, clarify rule for broad questions, related resources through knowledge links.
4. **Worker** `POST /api/discover` (intent only) and `POST /api/discover/event` (anonymous statistics, discarded until a dataset is bound).
5. **Homepage**: new hero with the question box, results section, chatbot transition.
6. **Tests and checks**: unit tests, Worker tests, homepage structure tests, full `npm run verify`, browser checks.
7. **Documentation**: this log, the architecture note and `docs/KEVOS_SOURCE_OF_TRUTH.md`.

## 3. Files

New:
- `src/utils/discovery-index.ts`, `src/pages/discovery-index.json.ts`
- `src/lib/discovery/search.ts`, `src/lib/discovery/synonyms.ts`, `src/lib/discovery/client.ts`
- `src/server/discover/handler.ts`
- `src/components/discovery/DiscoveryBox.astro`, `src/components/discovery/DiscoveryResults.astro`
- `src/scripts/discovery.ts`, `src/styles/discovery.css`
- `tests/discovery.test.ts`, `scripts/discovery/browser-check.mjs`
- `docs/discovery/ARCHITECTURE.md`, `docs/discovery/DEVLOG.md`

Changed:
- `src/worker.ts` (routes, rate-limit scopes)
- `src/pages/index.astro`, `src/config/home.ts` (one hero with the question box; WORKOS and READOS side by side below it, stacked on phones; examples). `src/components/HomeResourceVisual.astro` removed (no longer used)
- `src/config/site.ts` (assistant off), `src/scripts/library-browser.ts`, `src/components/library/LibraryBrowser.astro`, `src/styles/library.css` (AI help in the WORKOS directory search), `src/pages/privacy.astro`
- `src/components/SEO.astro` (SearchAction)
- `tests/homepage.test.ts`

Not changed: `wrangler.toml`, `public/tools/*`, logos, favicons, navigation, `/chat/`, `/api/chat`.

## 4. Test results (1 Nov 2026, release candidate on the branch)

| Check | Result |
|---|---|
| `npm run verify` (astro check, all unit tests, build, Pagefind, postbuild gate) | Passed: 0 type errors; 1,356 of 1,356 tests; 4,284 pages verified (metadata, one H1, links, images, JSON-LD) |
| `tests/discovery.test.ts` | 44 tests: index integrity; 34 natural-language questions with the expected tools or readings; misspellings; broad ("cost"), unsupported ("weather forecast tomorrow", "wedding") and follow-up questions; AI terms; limits and duplicates; the Worker endpoint's success, fallback, timeout, validation, injection filtering, analytics and routing |
| `tests/homepage.test.ts` | 5 tests: hero order, no pricing, counts from the catalogues, real featured records, discovery present with a no-JavaScript fallback |
| `node scripts/discovery/browser-check.mjs` (Chromium, built `dist/`, API mocked) | 46 of 46: render, dark default and session-only light theme, Enter and Shift+Enter, clear, empty question, results groups, every result link resolves, focus and scroll to results, follow-ups and the 5-exchange limit, AI restatement, clarify choices, honest no-match, AI out of scope, AI failure (500 and network) falls back, 429 message, mobile 390 px with no sideways scroll and 44 px targets, `/?q=`, keyboard, the assistant kept on `/tools/` and `/reados/`, no-JavaScript submit to `/search/`, no console errors |
| WORKOS calculators | No file under `public/tools/` changed; the calculator tests in `npm run verify` pass |
| Not checked here | Safari/WebKit (not installed in this environment) and the live Workers AI model (only reachable after deployment). Both belong in the post-release check. |

## 5. How to extend

- **A new tool or book** is picked up by the next build. No discovery change is needed.
- **A missed question:** add a test case to `CASES` in `tests/discovery.test.ts`, then add a synonym group in `src/lib/discovery/synonyms.ts` (words the visitor uses → words the catalogue uses). Never add a synonym that points at a resource that does not exist.
- **Tuning:** `MIN_SCORE`, the field weights and the clarify and coverage thresholds are at the top of `search.ts`; re-run `node --test tests/discovery.test.ts` after any change.
- **Configuration (Worker variables, optional):** `DISCOVER_MODEL`, `DISCOVER_RATE_LIMIT_MAX` (hourly KV limit, default 60; used only when the KV store is bound), `DISCOVER_TIMEOUT_MS` (default 7000). Without them the chat models and defaults are used.

## 6. External dependencies needing approval

| Item | Why | Cost and change |
|---|---|---|
| Production release (merge to `main`) | The homepage changes for every visitor | Workers Builds deploys automatically |
| Analytics Engine dataset `DISCOVERY_EVENTS` (optional) | Store anonymous search and click counts | `wrangler.toml` binding; free tier has limits; reading the data needs a dashboard or API token |
| Vectorize semantic search (optional, later) | Better matching for unusual wording | New index resource and an embedding job |
| Privacy page note (recommended if analytics are enabled) | Say that homepage questions are processed by Cloudflare Workers AI and not stored | A legal-page edit, so the owner decides the wording |

## 7. Log

- **1 Nov 2026**: audit, design, index, search engine, Worker endpoints, homepage and tests built. Tuning fixes during testing: false spelling corrections of -ing words ("sitting" → "setting"), noisy matches on "losing" (now a stop word with a loss synonym), off-topic related cards (now must match the question), out-of-scope questions returning loose matches (coverage rule plus the AI `inScope` flag), misspelt "brake even" (synonym), AI terms longer than a short phrase now dropped instead of cut, and an AI restatement must share a word with the visitor's question.
- **1 Nov 2026 (browser checks)**: the clear (×) button showed on an empty box (its `display` rule overrode `hidden`), now fixed; the sentence above results listed stray expansion words ("cost, true, job"), now it uses the visitor's words and whole phrases ("cost, manufacturing, true cost").
- **1 Nov 2026 (owner feedback on the live site)**: the AI now chooses the best entries from a shortlist of real catalogue entries (by number, validated in the Worker), and those lead the results; the WORKOS directory search uses the same pipeline for questions in plain words (for example "where is keyhole and how much", which matched nothing before); the floating "Ask KEVOS®" assistant is switched off; the homepage has one hero, with WORKOS and READOS side by side under it (stacked on phones). Checks: `npm run verify` 1,358/1,358 tests, 4,284 pages; browser check 54/54.
