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
- **No invented resources.** Results are drawn only from the build-time index. The AI's output is used only as search terms and a one-line restatement of the question.

## 3. Design

```
Visitor question (homepage)
   │
   ├─► POST /api/discover  (Worker) ──► Workers AI: intent JSON {summary, terms, ambiguous, options}
   │        validation · same-origin · edge + KV rate limit · 7 s timeout · model fallback · no catalogue access
   │
   └─► /discovery-index.json (static, built with the site; fetched once, cached)
            src/lib/discovery/search.ts in the browser:
            1. exact keyword matching (BM25 over name, question, description, keywords, category)
            2. synonym matching (src/lib/discovery/synonyms.ts, curated engineering and business vocabulary)
            3. spelling correction against the catalogue's own vocabulary
            4. category and topic matching
            5. AI-assisted intent terms (when the Worker answers)
            → ranked tools, chapters and books, related resources from knowledge-links,
              and a clarification or no-match outcome
```

- **Index:** `src/utils/discovery-index.ts` builds `/discovery-index.json` (`src/pages/discovery-index.json.ts`) from the same sources as the site. That is every tool, book and published chapter, plus the knowledge links. A new tool or book is picked up by the next build, with no manual step.
- **Intent:** `src/server/discover/handler.ts`. It reuses the chat Worker's models, rate limits, origin checks and bounded reads. The prompt asks only for search terms and a short restatement, never for answers, numbers or URLs.
- **Fallback:** if the Worker or the model is unavailable, or slow, the browser searches with the question alone (keywords, synonyms and spelling correction). The visitor still gets grounded results.
- **Analytics:** `/api/discover/event` records anonymous aggregate events (question terms, result clicks, no-result searches, device class) through an optional Analytics Engine binding, `DISCOVERY_EVENTS`. Until that binding is added, which needs approval, the endpoint accepts and discards events, and nothing is stored.
- **Chatbot:** the floating KEVOS® Assistant stays on every page except the homepage, where the discovery box takes its place. `/chat/` and `/api/chat` are unchanged.

## 4. Options not taken (need approval or cost)

| Option | Why not now | What it would need |
|---|---|---|
| Cloudflare Vectorize semantic search | New index resource; free tier limits apply; production infrastructure change | `wrangler vectorize create`, a binding, an embedding job at build or deploy (Workers AI `@cf/baai/bge-small-en-v1.5`) |
| Retrieval inside the Worker | CPU limit on the Free plan | Workers Paid plan, or a precomputed compact index |
| Analytics Engine dataset | New binding; dashboard or API token to read | `[[analytics_engine_datasets]] binding = "DISCOVERY_EVENTS" dataset = "kevos_discovery"` in `wrangler.toml`, plus an API token for `scripts/discovery/analytics-report.mjs` |
