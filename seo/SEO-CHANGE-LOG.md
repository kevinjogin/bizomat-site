# SEO change log

Each entry records the date, the change, the evidence that justified it, the expected effect (a hypothesis), risk and how to undo it.

## 2026-10-24: AutoSEO foundation (branch `seo/autoseo`, pending review)

| Change | Evidence | Hypothesis | Risk | Rollback |
|---|---|---|---|---|
| Sitemap excludes category-volume chapter pages (`/reados/books/<volume>/<chapter>/`) | 750 sitemap URLs had a canonical pointing to another URL | Consistent canonical signals; crawl attention goes to canonical READOS chapters | Low: pages remain reachable and canonicalised as before | Revert commit `33bcc7e` (filter in `astro.config.mjs`) |
| Unique descriptions for numbered category volumes | 27 duplicate descriptions | Distinct snippets for distinct pages | Low | Revert `33bcc7e` |
| 105 WORKOS tool pages at `/tools/<id>/`, cards link to them | 115 tools had no indexable page | Calculator queries can land on a page that answers them | Medium: 105 new URLs; content comes only from existing guides | Revert `c1d0509`; `/tools/?tool=<id>` links are unaffected either way |
| SEO release gate, connectors, engine and schedules | No automated SEO checks or data collection existed | Fewer indexing regressions; decisions based on data once connected | Low: read-only, no site edits | Revert `fcfd8bd` |

No titles, H1s, URLs, service claims, prices or calculator results were changed.
