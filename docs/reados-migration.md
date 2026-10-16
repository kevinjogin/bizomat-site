# ReadOS migration plan — safe implementation

> **Status, 17 October 2026: Insights retired.** All 750 Insights articles are chapters of the 53 edited READOS books (files moved to `src/content/reados-chapters/`); the `/insights/` pages, listings and feed links are removed, and every old Insights URL redirects permanently to its chapter (`public/_redirects` and `src/worker.ts`). The plan below is kept as the historical record. The `/library/` finance guide is unchanged.

## Goal
Consolidate the existing /insights/ and /library/ experience into /reados/ without losing content, search visibility, reader links, images, tools, forms, or KEVOS Assistant functionality. GitHub and Cloudflare remain the primary code/hosting platform.

## Current verified repository inventory
- 638 Markdown content files in `src/content/insights/` (file count, not a guarantee all are published)
- `src/pages/insights/` handles article/category/tag/page routes
- `src/pages/library/` and `src/data/library.ts` contain the existing book experience
- `src/pages/resources/` links to both Insights and Library
- `src/content.config.ts` declares an Insights collection and a Work collection; Work includes `relatedInsights: reference('insights')`. Preserve those references until converted.
- `src/worker.ts` serves assets, /api/chat and /api/contact
- `wrangler.toml` uses a Cloudflare Worker plus Workers AI
- `src/config/site.ts` still has Web3Forms as the default contact provider, with a populated public access key, and links to a Proton Calendar booking URL. Audit these before any removal.
- Existing build command generates Astro output, Pagefind index and Worker assets.

## Phases and acceptance gates

1. **Inventory and backup**: snapshot main SHA, inventory all article slugs, drafts, internal references, images and existing library URLs. Store a machine-readable manifest and a source-to-destination mapping. Verify that no article is omitted.
2. **Book design**: group by subject, remove genuine duplication only in the new editions, preserve attribution and source history, and create books with chapter ordering and summaries. Do not overwrite the original source material during editorial transformation.
3. **Reader**: develop static Git-backed book/chapter pages, Pagefind-powered search, accessible navigation and browser-local progress/bookmarks; ensure readable rendering without JavaScript for core chapter content.
4. **Link preservation**: implement article-level permanent redirects only after each destination exists and is checked. Maintain relevant legacy routes where semantic equivalence is not possible. Audit category/tag and RSS links, canonical URLs, sitemaps and portfolio `relatedInsights`.
5. **Integrations**: retain Cloudflare Workers AI, existing tools and working APIs; migrate contact delivery only after a confirmed tested provider mechanism. Do not remove the Proton booking link unless an equivalent solution is implemented or its removal is explicitly accepted.
6. **Release**: run `npm ci`, `npm run verify`, link and redirect checks, content manifest reconciliation, responsive/accessibility checks and Cloudflare preview verification. Require review before merging; do not deploy by simply merging an unverified branch.
7. **Retirement**: once all mapped destinations, redirects, references and feed links work, remove Insights and Library from public navigation, then deprecate old page templates if safe. Retain source archives under version control.

## Current implementation on this branch
- Created an initial ReadOS landing page at `src/pages/reados/index.astro`, using existing `LIBRARY_GUIDES` and the existing book URLs. This is only the first non-destructive step: the migration and retirement gates above are NOT yet complete.
- No Insight article was modified or deleted. No redirects, menu cutover, dependency removals or production deployment have occurred.

## Security and reliability notes
- GitHub is source control, not independent disaster recovery. Keep an independent versioned backup of code and non-Git data; secure the repository with least privilege, branch protection and secret scanning.
- A service being hosted by Cloudflare does not mean mail delivery can work without an email destination/provider.
- Preserve the production Worker name/route and Cloudflare bindings during deployment. Test both static and API paths.
