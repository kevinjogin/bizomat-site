# KEVOS SEO baseline

Recorded 24 October 2026 (Australia/Sydney) from the repository, the production build and public requests to kevos.com. No Google Search Console, Bing Webmaster Tools or Cloudflare account data was available, so every search metric below is **UNKNOWN**, not zero.

## Site and stack

- Astro 7 static site, 1,696 HTML pages before this work, served by a Cloudflare Worker with static assets (`wrangler.toml`), deployed by Workers Builds on push to `main`.
- Metadata from one component, `src/components/SEO.astro`: title, description, absolute canonical, Open Graph, X card and one JSON-LD graph (Organization + ProfessionalService, WebSite, BreadcrumbList, plus page types such as Chapter, Book and WebApplication). No address, phone, ratings or reviews are invented.
- `@astrojs/sitemap` generates `sitemap-index.xml`; `src/pages/robots.txt.ts` generates `robots.txt`.
- `scripts/postbuild.mjs` already enforced one H1, titles, descriptions of 50–200 characters, absolute canonicals, og:image, `lang`, image alt text, valid JSON-LD, internal links and draft exclusion.

## Search data

| Measure | Value |
|---|---|
| Clicks, impressions, CTR, average position | UNKNOWN (Search Console not connected) |
| Indexed-page coverage | UNKNOWN (Search Console not connected) |
| Bing queries and crawl stats | UNKNOWN (Bing Webmaster API not connected) |
| Conversions from organic search | UNKNOWN (no consent-based conversion tracking found; enquiries arrive by email) |
| Core Web Vitals, real users | UNKNOWN here; Cloudflare Web Analytics is installed and reports them in the dashboard |
| Lighthouse (PageSpeed Insights) | UNKNOWN: the keyless shared quota was exhausted; a free API key is needed |

## Production checks (public requests)

| Check | Result |
|---|---|
| `robots.txt` | 200; allows all crawlers except `/api/`, `/search/`, `/chat/`; lists the sitemap index |
| `sitemap-index.xml`, `sitemap-0.xml` | 200, `application/xml`, 1,690 URLs, no `lastmod` |
| Googlebot, Bingbot, OAI-SearchBot, PerplexityBot user agents on `/services/` | 200 for each (user-agent test only; verified-bot handling in Cloudflare cannot be seen from outside) |
| Home page, one local desktop sample | LCP 432 ms (H1), CLS 0, TTFB 117 ms, 24 requests, 88 KB; only third party: Cloudflare Insights |
| Security headers | Present and unchanged by this work (see `docs/security/`) |

## Build inventory before changes (`dist/` of `main` at `d042f9d`)

| Measure | Value |
|---|---|
| Pages | 1,696 |
| Indexable and self-canonical | 940 |
| Canonical points elsewhere | 750 (category-volume chapters → edited READOS books, by design) |
| Noindex | 6 (404, search, chat, three form confirmations) |
| Sitemap URLs | 1,690 |
| WORKOS indexable pages | 1 (`/tools/`); all 115 tools lived at `/tools/?tool=<id>` |

| Issue | Count | Severity |
|---|---:|---|
| Sitemap lists a page whose canonical is elsewhere | 750 | warning, confirmed defect |
| Duplicate meta descriptions (numbered category volumes) | 27 | warning, confirmed defect |
| Indexable pages with no internal links (`/about/`, `/industries/`, `/resources/`) | 3 | warning, needs a navigation decision |
| Titles over 65 characters | 811 | note only; titles on established pages need review |
| Descriptions outside 70–170 characters | 616 | note only |
| Errors (missing canonical, H1 count, invalid JSON-LD, missing alt) | 0 | |

## After this work (branch `seo/autoseo`)

1,801 pages; 1,045 indexable and self-canonical; **1,045 sitemap URLs, every one its own canonical**; 0 duplicate descriptions; 105 new WORKOS tool pages. Remaining notes: 3 orphans (review), long titles and description lengths (review). The full per-URL record is `seo/url-inventory.json`.
