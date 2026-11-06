# Technical SEO audit

Method: `scripts/seo/inventory.mjs` parses every built page; `scripts/seo/validate.mjs` turns the findings that would harm indexing into a release gate; production was checked with plain HTTP requests. Dates: 24 October 2026.

## Already working, preserved

- One metadata component for every page: unique title pattern, description, absolute self-referencing canonical, Open Graph and X cards, `lang="en-AU"`.
- JSON-LD graph with Organization/ProfessionalService (only published facts), WebSite and BreadcrumbList on every page; Chapter, Book and Article types on READOS pages. All 1,696 blocks parse.
- Exactly one H1 per page; every image has alt text; internal links checked at build.
- Utility pages are `noindex` and excluded from the sitemap; preview hostnames get `X-Robots-Tag: noindex`.
- Static, server-rendered HTML: content is readable without JavaScript.
- Clean, stable URLs with trailing slashes; retired `/insights/` URLs redirect permanently.
- Fast pages: self-hosted fonts, one third-party script (Cloudflare Web Analytics), no layout shift in the sample.
- Security headers and CSP unchanged.

## Confirmed weaknesses

| # | Finding | Evidence | Action | Status |
|---|---|---|---|---|
| 1 | Sitemap listed 750 non-canonical pages | Category-volume chapters canonicalise to the edited READOS book but were in `sitemap-0.xml` | Sitemap filter excludes `/reados/books/<volume>/<chapter>/` | Fixed on branch; gate blocks recurrence |
| 2 | 27 duplicate meta descriptions | Every volume of a category used the category description | Description adds the volume number and chapter span | Fixed on branch |
| 3 | WORKOS tools had no indexable pages | 115 tools only at `/tools/?tool=<id>`, canonical to `/tools/` | 105 tool pages from existing guides; cards link to them | Built on branch; review requested |
| 4 | `/about/`, `/industries/`, `/resources/` are orphans | No page links to them; the footer links to home-page anchors instead | Decide whether these pages or the anchors are primary; link or retire accordingly | Needs owner decision |
| 5 | All commercial intents share `/services/` | 14 commercial seed keywords map to one page with anchors | Consider dedicated pages for the four services and jig/fixture design | Needs owner decision and new copy |
| 6 | 811 titles over 65 characters | Mostly `Chapter title (Book) \| READOS \| BIZOMAT` | Possible shorter pattern for READOS chapters | Review only: changes established titles |
| 7 | No `lastmod` in the sitemap | Sitemap entries have no dates | Add only if dates can reflect real content changes (publish/updated dates) | Proposal |
| 8 | Ten tools have thin guides | Includes OEE (quick), Takt Time, Reorder Point | Extend guides, then they qualify for pages automatically | Editorial work |
| 9 | Plain HTTP not redirected for pages | `http://kevos.com/about/` returns 200 | Enable *Always Use HTTPS* (security report) | Owner action, open since the security work |

## Release gate (`npm run seo:validate`, run by `seo-validate.yml`)

Fails the build when: any audit error; a sitemap URL is noindex, non-canonical or missing; an indexable self-canonical page is missing from the sitemap; titles are duplicated; a key page (home, services, Factory Fix, assessment, contact, tools, a tool page, READOS, library) stops being indexable or leaves the sitemap; `robots.txt` stops listing the sitemap or blocks the site or key sections; a JSON-LD node lacks required properties; or any node contains ratings or reviews. On the current production build it fails with 751 findings, which is the evidence for fix 1.

## Not changed deliberately

Security headers, CSP, AI-crawler policy, page titles and H1s on established pages, URLs, and calculator code or results.
