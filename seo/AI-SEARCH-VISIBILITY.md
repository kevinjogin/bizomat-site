# AI search visibility

Covers Google AI Overviews and AI Mode, Bing and Copilot, ChatGPT search, Perplexity and similar systems. None of them guarantees inclusion or citation, and none publishes a ranking formula. This plan only makes BIZOMAT content accessible, clear and accurate. It never makes promises about outcomes.

## Current state

- **Crawler access:** `robots.txt` allows all user agents except `/api/`, `/search/` and `/chat/`. A user-agent test of Googlebot, Bingbot, OAI-SearchBot and PerplexityBot returned 200 on `/services/`. Whether Cloudflare's bot settings challenge any verified crawler can only be confirmed in the dashboard (Security → Bots → AI Scrapers and Crawlers, and Security Events filtered by bot).
- **Content:** static semantic HTML with one H1, clear H2/H3 structure, tables and figures with text alternatives, and visible methods and limitations on READOS and tool pages. That is the format AI search systems can quote accurately.
- **Provenance:**
  - Organization JSON-LD on every page (published facts only).
  - Chapter and Book types on READOS.
  - WebApplication on tool pages.
  - Books carry a BIZOMAT author line and reference lists.
  - Tool pages show their references and limitations.

## Search crawlers versus training crawlers

Some operators run separate user agents for search and for model training. Examples from published documentation, which should be rechecked before acting because names change:

- Google-Extended controls Gemini training use but not Google Search.
- OpenAI uses OAI-SearchBot for search and GPTBot for training.
- Perplexity uses PerplexityBot.

Today BIZOMAT allows all of them. Blocking training crawlers while allowing search crawlers is a content-protection decision, already listed as an owner decision in `docs/security/CLOUDFLARE-SECURITY-CONFIGURATION.md`. This work does not change it. If the decision is made, add named `User-agent` groups to `src/pages/robots.txt.ts`. The SEO gate keeps checking that search crawlers and key sections remain allowed.

## What helps, in order

1. **Pages that answer one question well.** Each tool page states what it calculates, the formula, a worked example and its limits. That is a precise, citable unit.
2. **Accurate, specific claims with sources.** READOS references and tool references are visible on the page.
3. **Clear entity information.** One organisation, one name, consistent service names (WORKOS, READOS, REACHOS) and an About page that is actually linked (see the orphan finding).
4. **Fast, crawlable HTML.** Already true.

## Not done, deliberately

- **No `llms.txt`.** It is optional and experimental, and no major search system documents using it for ranking. It can be added later at low cost if the owner wants it.
- **No AI-visibility score.** There is no reliable cross-provider measure, and an invented score would mislead.
- **No automated querying of ChatGPT, Perplexity or Google AI** to "check citations". Provider terms restrict automated use, and results vary by user and session.

## A manual check that is allowed

Once a quarter, a person can ask a short, fixed list of questions in each assistant's normal interface. Record the date, product, exact question, whether BIZOMAT was cited and which URL. Keep the record in `seo/ai-visibility-checks.md`. Suggested questions:

- "How do I calculate spindle RPM from cutting speed?"
- "What does a jig and fixture designer in Sydney do?"
- "How do I estimate machining cycle time?"
