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
| 14 | Privacy: calculator inputs are never sent; the question goes only to Workers AI and is not stored; analytics are anonymous terms and clicks, no IP, no question text | Done | `handleDiscoverEvent`; Analytics Engine dataset `kevos_discovery` (binding `DISCOVERY_EVENTS` in `wrangler.toml`); privacy page section "Questions on the homepage" |
| 15 | Performance: the index (about 1.6 MB, compressed by Cloudflare) loads on first focus or first question and is cached; on `/tools/` it loads only when a plain-words search asks the AI; other pages load nothing extra | Done | `loadEngine()` in `client.ts` |
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

## 6. External dependencies still needing approval

| Item | Why | Cost and change |
|---|---|---|
| Vectorize semantic search (optional, later) | Better matching for unusual wording | New index resource and an embedding job |

## 7. Log

- **1 Nov 2026**: audit, design, index, search engine, Worker endpoints, homepage and tests built. Tuning fixes during testing: false spelling corrections of -ing words ("sitting" → "setting"), noisy matches on "losing" (now a stop word with a loss synonym), off-topic related cards (now must match the question), out-of-scope questions returning loose matches (coverage rule plus the AI `inScope` flag), misspelt "brake even" (synonym), AI terms longer than a short phrase now dropped instead of cut, and an AI restatement must share a word with the visitor's question.
- **1 Nov 2026 (browser checks)**: the clear (×) button showed on an empty box (its `display` rule overrode `hidden`), now fixed; the sentence above results listed stray expansion words ("cost, true, job"), now it uses the visitor's words and whole phrases ("cost, manufacturing, true cost").
- **1 Nov 2026 (owner feedback on the live site)**: the AI now chooses the best entries from a shortlist of real catalogue entries (by number, validated in the Worker), and those lead the results; the WORKOS directory search uses the same pipeline for questions in plain words (for example "where is keyhole and how much", which matched nothing before); the floating "Ask KEVOS®" assistant is switched off; the homepage has one hero, with WORKOS and READOS side by side under it (stacked on phones). Checks: `npm run verify` 1,358/1,358 tests, 4,284 pages; browser check 54/54.
- **2 Nov 2026 (statistics)**: owner approved the usage statistics and the privacy update. `wrangler.toml` binds Analytics Engine (`DISCOVERY_EVENTS` → dataset `kevos_discovery`); the privacy page says what is recorded (up to eight keywords, outcome, opened resource, phone or computer; no IP, cookie or identifier; deleted by Cloudflare after about three months). `scripts/discovery/analytics-report.mjs` reads it with an API token (Account Analytics: Read). Released separately from the homepage so a refused binding could not hold back the main release.
- **2 Nov 2026 (live)**: release `12dc213` checked on kevos.com with `scripts/discovery/live-check.mjs` from GitHub Actions: 38/38, Workers AI answered 4/4 (idle machine → Downtime Cost, Machine Hour Rate, OEE; M12 bolt → Bolt Tightening Torque and Preload; weather → out of scope). Found: the model turned "where" and "how much" into "location" and "quantity", which matched unrelated tools; the prompt now forbids that and the Worker drops such generic terms. The check is now a manual workflow (Actions → Live check).
- **2 Nov 2026 (deploy failure)**: the production Workers Build failed for #33 (`f72e8f2`) and #34 (`42ca22c`) while their preview builds passed and #32 (`12dc213`) deployed. The only deploy-relevant change was the Analytics Engine binding (previews do not apply it), so it is commented out in `wrangler.toml` and the privacy page no longer describes statistics. Lesson: a release is live only when the **production** Workers Build on the merge commit succeeds and the live check tests something new in that release; the earlier live check passed on #32's content.
- **2 Nov 2026 (Phase 1: guided solution path)**: "Your Solution Path" above the existing resource groups (kept). Files: `src/lib/discovery/plan.ts` (new: types, workflows, path builder), `src/pages/discovery-details.json.ts` and `buildDiscoveryDetails()` (new: tool inputs, outputs, checks; about 400 KB raw), `src/lib/discovery/search.ts` (`entryById`, `verifiedReadings`; a full sentence with two meaningful words no longer triggers the clarifying question; "keep" is a stop word), `src/lib/discovery/synonyms.ts` (failure words), `src/lib/discovery/client.ts` (`draft()`, details loader, path in `ask()`; the WORKOS directory search skips paths), `src/server/discover/handler.ts` (plan schema, `parsePlan`, result filter, 900 tokens, 15 s), `src/scripts/discovery.ts` (path rendering, progressive replace), `src/styles/discovery.css`. Tests: `tests/solution-path.test.ts` (32 questions across calculation, design, manufacturing, troubleshooting, business and learning; AI plan validation; Worker restrictions), browser check 66/66 (draft then AI path, step fields, links, phone layout). Workers AI use per question rises (a longer reply): roughly 70 to 80 neurons, so the free daily allocation covers on the order of 130 questions a day before the AI step falls back to the workflow path; to be confirmed on the live account.
- **2 Nov 2026 (names)**: owner decision: WORKOS → Tools and READOS → Library in all visible text (books, chapters, tool texts, pages, titles, RSS, book metadata), by grammar-aware rules ("the WORKOS tool" → "the KEVOS® tool", "in READOS" → "in the Library"); URLs, file names and code identifiers unchanged. The AI prompt and result cards use the new names.
- **2 Nov 2026 (learning paths)**: the homepage box became a learning-path generator ("What would you like to learn or achieve?", **Build My Learning Path**, seven example prompts that fill the box). Design in `ARCHITECTURE.md` §5. New: `src/utils/learning-outlines.ts`, `src/pages/learning/[book].json.ts`, `src/lib/learning/{retrieve,course,client}.ts`, `src/scripts/learning-ui.ts`, `src/styles/learning.css`, `src/server/ai/provider.ts`, `src/server/learn/{handler,schema}.ts`, `tests/learning.test.ts`. Changed: `src/worker.ts` (`/api/learn/*`, limiter scope `learn`), `src/server/discover/handler.ts` (uses the provider), `src/utils/discovery-index.ts` and `src/lib/discovery/search.ts` (chapter reading time and key terms), `src/lib/discovery/synonyms.ts` (electrical, mechanical, software, automation), `src/scripts/discovery.ts`, `src/components/discovery/DiscoveryBox.astro`, `src/config/home.ts`, `src/pages/index.astro`, `src/pages/privacy.astro`, `scripts/discovery/{browser-check,live-check}.mjs`. Results on the branch: `npm run verify` passed (0 type errors, 1,446 of 1,446 tests, 4,318 pages verified); browser check 109 of 109 (course flow, AI plan replacing the draft, lesson with the key-things box, quiz and retake, follow-up, simpler lesson, complete and progress, previous, contents focus, depth change, quick answer, repeated request, AI down, clarification, out of scope, 429, very long request, phone at 390 px). The ten specified requests are unit tests on the no-AI path (real chapters and tools only, no duplicates, linked tools first, relevant books). Fixes found while testing: FAQ questions under `###` headings were lost from outlines; "how to …" questions became courses instead of quick answers; near-miss chapters filled courses on unsupported subjects; a lesson title lost focus when the AI version arrived. Known limits: without AI, misspelt subjects ("mechanicle enginering") find little and off-topic books can rank in (the AI step handles both); software development has business-level books only, reported as gaps by the plan.
- **2 Nov 2026 (owner feedback: layout and spelling)**: the homepage hero animation is removed and the question box is large and centred; the Tools and Library headers hold the same learning-path box (`src/components/discovery/LearningPlanner.astro`) instead of their animations, with the course shown under the header (hidden while a tool is open; `?q=` there stays the directory search, so only the homepage box has `autorun`). Example prompts fill the box instead of sending it. Australian English sweep: 95 lines in 50 chapter and tool files (towards, afterwards, anodising, carburising, moulded, analogue, modelled, serialisation); ids, URLs, keywords, cited titles, organisation and standard names kept. `npm test` 1,450 of 1,450, browser check 120 of 120.
- **2 Nov 2026 (live, release `574fe1b`)**: Live check 60/60 from GitHub Actions; `/api/learn/intent` answered with AI in 8.6 s (seven topics), but `/api/learn/plan` returned no AI plan after its 40 s budget (visitors got the Library course). Cause: about 30 tokens a second live, and a 7 × 4 plan needed about 1,500 tokens, the reply cap. Fix: compact plan replies, 6 × 3 at most, 1,000-token caps for plan and lesson, longer budgets (plan 70 s, lesson 65 s) and a status line saying it can take up to a minute. `/api/discover` also fell back on 2 of 7 questions at its 15 s budget the same afternoon.
