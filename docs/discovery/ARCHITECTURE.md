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
- **Intent and picks:** `src/server/discover/handler.ts`. It reuses the chat Worker's models, rate limits, origin checks and bounded reads. The prompt asks for search terms, a short restatement and the numbers of the shortlisted entries that fit, never for answers, calculations, names or URLs. The shared browser pipeline is `src/lib/discovery/client.ts`, used by the homepage (`src/scripts/discovery.ts`) and the WORKOS directory (`src/scripts/library-browser.ts`: a search of three or more words, or one with no match, moves the AI's picks to the top of the results).
- **Fallback:** if the Worker or the model is unavailable, or slow, the browser searches with the question alone (keywords, synonyms and spelling correction). The visitor still gets grounded results.
- **Analytics:** `/api/discover/event` records anonymous aggregate events (question terms, result clicks, no-result searches, device class) through the Analytics Engine binding `DISCOVERY_EVENTS` (dataset `kevos_discovery`). The binding was added on 2 Nov 2026 with the owner's approval, then switched off the same day because the production deploy failed with it; it needs Analytics Engine switched on for the account first. Without the binding the endpoint accepts and discards events. Read the statistics with `CF_API_TOKEN=<Account Analytics: Read> node scripts/discovery/analytics-report.mjs [days]`: outcomes, no-result keywords (candidates for new tools, readings or synonyms), most asked, most opened, device split.
- **Chatbot:** the floating KEVOS® Assistant is switched off everywhere (`SITE.assistant.enabled = false`, 1 Nov 2026); the discovery box replaces it, and the REACHOS page leaves out its assistant section. The code, `/chat/` (noindex, unlinked) and `/api/chat` stay, so it can be switched back on with that one setting.

## 4. Options not taken (need approval or cost)

| Option | Why not now | What it would need |
|---|---|---|
| Cloudflare Vectorize semantic search | New index resource; free tier limits apply; production infrastructure change | `wrangler vectorize create`, a binding, an embedding job at build or deploy (Workers AI `@cf/baai/bge-small-en-v1.5`) |
| Retrieval inside the Worker | CPU limit on the Free plan | Workers Paid plan, or a precomputed compact index |
