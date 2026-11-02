# KEVOS discovery: architecture audit and design

Audit of the existing site (baseline commit `c2975d3`, 1 November 2026) and the design of the intelligent discovery feature: "What would you like to solve today?" Progress, checklist and test results: `docs/discovery/DEVLOG.md`.

## 1. Existing system (audit)

| Area | Finding |
|---|---|
| Frontend | Astro 7, static output (`astro build`), TypeScript, plain CSS with design tokens (`src/styles/global.css`), dark theme by default. |
| Backend | One Cloudflare Worker (`src/worker.ts`, `throbbing-block-6c61`): serves `dist/` through the `ASSETS` binding and handles `/api/chat`, `/api/contact`, `/api/assessment`, the Stripe webhook and redirects. |
| Hosting and deploy | Cloudflare Workers; Workers Builds deploys pushes to `main`. `wrangler.toml` bindings: `ASSETS`, `AI` (Workers AI), `EMAIL` (send_email), `CHAT_LIMITER` (10/min) and `FORM_LIMITER` (5/min) rate limiters. Observability is off. Comments state the Workers Free plan. |
| AI | `src/server/chat/handler.ts` uses Workers AI: model `@cf/meta/llama-4-scout-17b-16e-instruct`, fallback `@cf/meta/llama-3.1-8b-instruct-fp8` (overridable by `CHAT_MODEL` / `CHAT_FALLBACK_MODEL`). It answers only from `/assistant-knowledge.json`, a build-time digest of published site content, with keyword retrieval (`src/server/chat/retrieve.ts`), a grounding system prompt, link repair, a same-origin check, a bounded body, edge and KV rate limits, and a model fallback. |
| Chatbot UI | `src/components/ChatWidget.astro`: a floating button on every page (`SITE.assistant.enabled`), plus the `/chat/` pop-out. Its scope is questions about KEVOS®, WORKOS, READOS and REACHOS; it refuses general technical help. |
| WORKOS | 1,013 tools defined in `public/tools/data-*.js`, with guides (`guides-*.js`), calculations (`calc-*.js`) and input guides (`inputs-*.js`). The directory is `/tools/`; the calculator is `/tools/?tool=<id>` and loads one tool's files on demand; tools with a complete guide have a static page at `/tools/<id>/`. The topics are `src/utils/workos-topics.ts`. |
| READOS | 208 published books: authored publications (`src/content/reados-publications/<book>/`, with chapters) and edited collections (`src/utils/reados-collections.ts` over `src/content/reados-chapters/`). That is 2,258 published chapters, at `/reados/publications/<book>/<chapter>/` and `/reados/collections/<book>/<chapter>/`. |
| Connections | `src/data/knowledge-links.json`: reviewed READOS ↔ WORKOS relationships, shown on both sides (`src/utils/knowledge.ts`). |
| Storage | Static files only: no database, no CMS at runtime, no authentication. |
| Search | Pagefind static index (`/search/`, built after Astro), and directory search on `/tools/` and `/reados/` (`src/scripts/library-browser.ts`). |
| Analytics | None in the site code. The CSP allows Cloudflare Web Analytics (`static.cloudflareinsights.com`), which Cloudflare can inject. |
| SEO | Per-page titles, descriptions and canonicals; Open Graph and X cards; JSON-LD (Organization, WebSite, WebPage, Article, BreadcrumbList, WebApplication); sitemap; robots; RSS; postbuild gate (`scripts/postbuild.mjs`) and `npm run seo:validate`. |
| Design system | Tokens and components in `src/components/` and `src/styles/`; the homepage (`src/pages/index.astro`, `src/config/home.ts`) leads with WORKOS and READOS, and `tests/homepage.test.ts` guards its structure. |

## 2. Constraints that shape the design

- **Workers Free CPU limit (about 10 ms of CPU per request).** Parsing and ranking a 3,500-item catalogue inside the Worker would risk exceeding it on every cold isolate. Retrieval therefore runs in the browser; the Worker only runs the AI step. Waiting on the AI model is I/O, not CPU.
- **No new paid services.** Vectorize, Workers AI embeddings at index time and Analytics Engine all need new bindings or account setup (production infrastructure), so none is switched on without approval.
- **Calculations stay in WORKOS.** The AI never computes engineering results.
- **No invented resources.** Results are drawn only from the build-time index. The AI's output is used only as search terms, a one-line restatement of the question and picks from a shortlist of catalogue entries, which the Worker accepts only as numbers in that list.

## 3. Design

```
Visitor question (homepage box, or a plain-words search in the WORKOS directory)
   │
   1. /discovery-index.json (static, built with the site; fetched once per page, cached)
   │     shortlist(): the ~20 catalogue entries closest to the question (keywords, synonyms, spelling)
   │
   2. POST /api/discover {question, context, candidates}  (Worker) ──► Workers AI: JSON
   │     {summary, terms, picks: [numbers from the shortlist], inScope, ambiguous, options}
   │     validation · same-origin · edge + KV rate limit · 7 s timeout · model fallback
   │     picks are positions in the shortlist, mapped back to ids by the Worker: the AI cannot add an entry
   │
   3. search() in the browser (src/lib/discovery/search.ts):
         the AI's picks first (marked "chosen by KEVOS® AI"), then
         BM25 over name, question, description, keywords, category; synonyms (synonyms.ts);
         spelling correction; word pairs; the AI's search terms
         → ranked tools, chapters and books, related resources from knowledge-links,
           and a clarification or no-match outcome
```

- **Index:** `src/utils/discovery-index.ts` builds `/discovery-index.json` (`src/pages/discovery-index.json.ts`) from the same sources as the site. That is every tool, book and published chapter, plus the knowledge links. A new tool or book is picked up by the next build, with no manual step.
- **Your Solution Path (Phase 1, 2 Nov 2026):** `src/lib/discovery/plan.ts`. Every answer with results opens with numbered steps: what to do, why, what to read, which tool, required inputs, expected output and how to check it, plus missing information, assumptions and the expected outcome.
  - *Question type* (calculation, troubleshooting, engineering design, manufacturing, business decision, learning) comes from the AI step or from `classify()`. Each type has its own workflow (`WORKFLOWS`), used both to guide the AI and to build the path when there is no AI answer.
  - *Facts vs recommendations:* inputs, outputs and the "how to check" sentence come from the tool's own fields and guide (`/discovery-details.json`, built by `buildDiscoveryDetails()`, loaded only when a path is shown), labelled "from the tool". Readings attached to a tool step come from reviewed knowledge links, labelled "verified link". Steps, order, "why", assumptions and missing information are recommendations, labelled "suggested".
  - *AI step:* the Worker asks for `type`, `steps` (tools and readings by shortlist number only), `missing`, `assumptions` and `outcome`, and drops any reference that is not in the shortlist, any reading number used as a tool and vice versa, any text with a link, and any step that states a result ("= 85 N·m", "to 1200 rpm", "the torque is 85"). Fewer than two usable steps → the workflow path.
  - *Missing resources* are named on the step ("KEVOS® does not have a tool for this step yet") instead of filled.
  - *Speed:* the browser shows the workflow path at once and replaces it in place with the AI path (Worker timeout 15 s, `max_tokens` 900).
- **Intent and picks:** `src/server/discover/handler.ts`. It reuses the chat Worker's models, rate limits, origin checks and bounded reads. The prompt asks for search terms, a short restatement and the numbers of the shortlisted entries that fit, never for answers, calculations, names or URLs. The shared browser pipeline is `src/lib/discovery/client.ts`, used by the homepage (`src/scripts/discovery.ts`) and the WORKOS directory (`src/scripts/library-browser.ts`: a search of three or more words, or one with no match, moves the AI's picks to the top of the results).
- **Fallback:** if the Worker or the model is unavailable, or slow, the browser searches with the question alone (keywords, synonyms and spelling correction). The visitor still gets grounded results.
- **Analytics:** `/api/discover/event` records anonymous aggregate events (question terms, result clicks, no-result searches, device class) through the Analytics Engine binding `DISCOVERY_EVENTS` (dataset `kevos_discovery`). The binding was added on 2 Nov 2026 with the owner's approval, then switched off the same day because the production deploy failed with it; it needs Analytics Engine switched on for the account first. Without the binding the endpoint accepts and discards events. Read the statistics with `CF_API_TOKEN=<Account Analytics: Read> node scripts/discovery/analytics-report.mjs [days]`: outcomes, no-result keywords (candidates for new tools, readings or synonyms), most asked, most opened, device split.
- **Chatbot:** the floating KEVOS® Assistant is switched off everywhere (`SITE.assistant.enabled = false`, 1 Nov 2026); the discovery box replaces it, and the REACHOS page leaves out its assistant section. The code, `/chat/` (noindex, unlinked) and `/api/chat` stay, so it can be switched back on with that one setting.

## 4. Options not taken (need approval or cost)

| Option | Why not now | What it would need |
|---|---|---|
| Cloudflare Vectorize semantic search | New index resource; free tier limits apply; production infrastructure change | `wrangler vectorize create`, a binding, an embedding job at build or deploy (Workers AI `@cf/baai/bge-small-en-v1.5`) |
| Retrieval inside the Worker | CPU limit on the Free plan | Workers Paid plan, or a precomputed compact index |

## 5. Learning paths (2 Nov 2026)

The homepage box asks "What would you like to learn or achieve?" and its button is **Build My Learning Path**. It is the same box and the same results area as before (no second search box, no chatbot). A request becomes a course built only from Library chapters and Tools that exist.

```
question ──► /api/learn/intent (AI: subject, objective, outcome, level, depth, topics, clarify?)   │ fallback: localIntent()
          ──► depth "quick"  → the existing answer (Your Solution Path + resources)
          ──► otherwise      → gatherCandidates() → draftCourse() shown at once
                              → /api/learn/plan (AI arranges R1.. / T1.. into modules and lessons) → courseFromPlan() in place
lesson    ──► /learning/<book>.json outlines → /api/learn/lesson (AI lesson from short excerpts) │ fallback: the Library's own words
follow-up ──► /api/learn/ask (lesson context + excerpts)
```

- **Chapter outlines** (`src/utils/learning-outlines.ts`, served per book by `src/pages/learning/[book].json.ts`, about 4 MB over 210 files, fetched only for the books a lesson uses): reading time, section headings, bold key terms, opening, summary ("Bringing it together"), common mistakes, questions, worked-example opening and exercise, all short excerpts from the chapter's own text. The discovery index carries each chapter's reading time and key terms (`m`, `k`), and search uses the key terms as a fourth field.
- **Intent** (`src/server/learn/handler.ts`, `INTENT_PROMPT`; validated by `parseLearnIntent`): subject, objective, outcome, level (beginner, intermediate, advanced, mixed), depth, application, industry, constraints, 3 to 8 topics with search terms, out of scope, and at most one clarifying question with 2 to 4 options. Without AI, `localIntent()` (`src/lib/learning/retrieve.ts`) reads level and depth from the wording, uses the best-matching Library books as topics, and asks which part of a one-word field ("engineering", "business") is meant. Short questions ("How can I reduce machine downtime?") stay quick answers.
- **Depth:** Quick Understanding (the existing solution path), Structured Learning (up to 4 modules × 3 lessons), Complete Course (up to 7 × 4; the default for learning requests), Professional / Advanced (same size, advanced emphasis). The visitor can switch depth on the course; the same candidates are re-planned.
- **Retrieval and ranking** (`gatherCandidates`): per topic, the best chapters (a book topic takes that book's matching chapters, then the rest in book order; a term topic takes chapter hits and the first chapters of matching books); near-miss "related" hits are not used, so a topic without material becomes a named gap. Tools joined to the chosen chapters by reviewed knowledge links come first, then tools that match a topic. Up to 48 readings and 24 tools.
- **Course** (`src/lib/learning/course.ts`): the draft has one module per topic and one lesson per chapter; the AI plan refers to candidates by number only, and the Worker drops unknown numbers, repeats a reading at most once, and rejects plans with fewer than two lessons or no readings. Duration = reading minutes + 10 per tool exercise + 5 per lesson.
- **Lesson** (`src/scripts/learning-ui.ts`): objective; Learn (AI explanation, why it matters, main concepts); **THE KEY THINGS TO UNDERSTAND** (central principle, essential concept, why it matters, misunderstandings, practical implications, what to remember) labelled as an AI summary of the readings, AI general knowledge, or, without AI, the chapters' own words; Read (book, chapter, why relevant, what to understand, reading time, link); Apply (tool, why, use, outputs and inputs from the tool, link); Practise; Verify (checklist, completion criteria, multiple-choice check with retake, or the chapter's own questions); assumptions; follow-up questions; Previous, Back to course, Course contents, Mark lesson complete, Next.
- **Grounding and safety:** the AI never sees URLs, only numbered titles and short excerpts (lesson requests are under 24 KB; no whole chapter is sent). `src/server/learn/schema.ts` keeps plain text only (no links, markup or code), resolves numbers to the ids the browser sent, and removes any sentence that states a calculated result ("= 85 %", "comes to 3.2"); numbers are worked out in the Tools. Same-origin checks, bounded bodies (6, 24, 24, 16 KB), the per-IP edge limiter (scope `learn`) and the optional hourly KV limit (`LEARN_RATE_LIMIT_MAX`, default 120).
- **AI provider** (`src/server/ai/provider.ts`): `completeJson()` tries the primary and fallback models inside one time budget (the primary gets three quarters), parses and validates the reply, and logs the outcome. Today the provider is the Workers AI binding; another provider can be added there without touching the features. `/api/discover` uses it too. Budgets: intent 12 s, plan 40 s, lesson 40 s, ask 25 s.
- **Progress:** opened and completed lessons, checks taken and the current lesson, in `sessionStorage` (`kevos-learn-<course id>`), for the current tab only, as the course header says. No account, no server storage.
- **Workers AI usage:** roughly 700 neurons for a course plus five lessons (plan ~140, intent ~30, lesson ~105 each). The Workers Free allocation (10,000 neurons a day) covers about 14 such learners a day; beyond that the AI steps fail and every visitor gets the Library-only course and lessons. More capacity needs the Workers Paid plan (owner approval).
