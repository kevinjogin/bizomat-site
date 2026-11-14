# Search rules for bizomat.ai

Owner's request, 14 Nov 2026: "clean SEO and create proper rules so nothing is negative for this site", and target the
audience with the right keywords so search engines and AI search can trust it.

## Rules

| What | Rule | Where |
| --- | --- | --- |
| Public pages | The website, Systems, Resources and the Library are open to every search engine and AI search crawler. Googlebot, Bingbot, Applebot, Google-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot and PerplexityBot are named, each with the same rules as everyone else | `src/pages/robots.txt.ts`; `tests/seo-rules.test.ts`; `scripts/seo/validate.mjs` checks every group |
| APIs | Disallowed: `/api/`, `/search/`, `/chat/` and each application's API (`/erp/api/`, `/tasks/api/`, `/crm/api/`, `/finance/api/`, `/company/api/`, `/system/api/`, `/cad/api/`) | `robots.txt` |
| Application pages | `/erp`, `/tasks`, `/crm`, `/finance`, `/company`, `/system`, `/cad` and the old app hosts answer `X-Robots-Tag: noindex, nofollow`, added by the proxy when the app sends none | `infrastructure/proxy/headers.mjs` (`app`), `proxy.mjs` (`isApp`); proxy tests |
| Why a header, not robots.txt | Google only sees a noindex on a page it may crawl. A page blocked in robots.txt can still be listed, without its content, when something links to it | the comments in both files |
| Sitemap | Only canonical pages that answer 200. Redirect sources and app paths are never in it: they are not pages of the build | `astro.config.mjs` (`@astrojs/sitemap` with its filter) |
| Redirects | One hop, 301, to the new page. The website's server applies them before looking for a file | `public/_redirects`, `src/node/assets.ts` |
| Retired design preview | `/system-preview/` and `/erp-design-preview/`, and everything under them, answer 301 to `/systems/erp/`. Nothing links to them | `public/_redirects`; the smoke test and the deploy check |
| AI search | `/llms.txt`: what BIZOMAT is, each system with one line, its status and its guide, what the software does not do, the free Resources. It is built from the same config as the pages, so it never says more than they do | `src/pages/llms.txt.ts` |
| Structured data | Each system page has `SoftwareApplication` (a planned one, `WebPage`), with the publisher. Each guide has `HowTo`, and `FAQPage` appears where there are real questions. No `offers` without a real price, and no `aggregateRating`, `Review`, testimonials or customer counts | each page; checked by the build |
| Metadata | One H1, a description of 50 to 200 characters, a canonical URL and valid JSON-LD on every page | `scripts/postbuild.mjs` (the build fails otherwise) |

## Keywords

**The audience:**
- Australian small and medium businesses;
- manufacturers and workshops;
- engineering firms;
- engineers using SOLIDWORKS.

**Search phrases:** the Systems pages use the natural phrases people search with, in their titles, descriptions and
opening lines:
- cloud ERP for small business;
- CRM for small business;
- sales pipeline;
- quoting and invoicing;
- GST and BAS worksheet;
- project management software;
- maintenance management software (CMMS);
- SOLIDWORKS AI automation;
- SOLIDWORKS MCP.

**Seed list:** the phrases, each with its one canonical page, are seeds in `scripts/seo/keywords.mjs`. Search demand stays
UNKNOWN until Search Console or Bing supplies it (the daily, weekly and monthly SEO workflows collect it).

**Every phrase matches what the software does:**
- Finance never lodges with the ATO, connects to banks or claims certification.
- Planned modules, such as preventive maintenance, inventory and manufacturing, are called planned.

## Reviews and ratings

The site carries no reviews, ratings or testimonials, and must not until real ones exist:
- **CLAUDE.md** forbids invented testimonials and customer claims.
- **Google treats review markup that the page does not genuinely show as spam.** It can remove rich results or take
  manual action.

Honest ways to earn them:
- **Google Business Profile** for BIZOMAT. Customers can review it there, and it can show in local search and Maps.
- **Software directories:** Capterra and GetApp (both Gartner), G2 and Software Advice, for BIZOMAT ERP, CRM, Finance
  and Projects. They verify reviewers and are read by buyers and by AI search.
- **Case studies,** written with a customer's written permission and their real figures, published on the site once
  they exist.
- **Product Hunt** or industry communities (for example SOLIDWORKS user groups) for Engineering Automation.

Once real reviews exist on a third-party site, link to that site. Do not copy ratings into structured data unless the
reviews themselves are shown on the page.
