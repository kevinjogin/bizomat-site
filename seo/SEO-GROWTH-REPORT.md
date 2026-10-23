# SEO growth report

This is the standing summary. Weekly and monthly reports are generated automatically into each run's GitHub Actions summary and artifact.

## Status at 24 October 2026

| Area | Status |
|---|---|
| Search Console data | Not connected: all search metrics UNKNOWN |
| Bing Webmaster data | Not connected: UNKNOWN |
| Cloudflare analytics connector | Not connected: UNKNOWN (Web Analytics dashboard is live) |
| Release gate | Built and passing on the branch; blocks the 750 non-canonical sitemap entries on current production |
| WORKOS tool pages | 105 built on the branch, awaiting review |
| IndexNow | Ready; activates on first push to `main` after merge (baseline first) |

## 30 / 60 / 90 days

These are activity and evidence targets, not ranking promises.

**By 30 days**
- Connect Search Console, Bing and Cloudflare (owner steps in the setup guides).
- Merge and deploy this branch.
- Submit the sitemap in both consoles.
- Confirm in Search Console that the 105 tool pages are discovered.
- Decide on the orphan pages and the `/services/` structure.
- Turn on *Always Use HTTPS*.

**By 60 days**
- With four or more weeks of data, review the first weekly proposals.
- Act only on those that meet the evidence thresholds.
- Extend the three most valuable thin tool guides (OEE quick, Takt Time, Reorder Point).
- Draft service pages for jig and fixture design and Engineering and CAD for owner review.

**By 90 days**
- Compare 28-day impressions and clicks for tool pages and service pages against the first connected month.
- Keep or roll back each change by its logged hypothesis.
- Publish the RFQ guide if reviewed.
- Run the first quarterly manual AI-search check.

## What success looks like

More qualified enquiries through REACHOS from organic visitors (measured by the source enquirers report, since no tracking cookies are used); growing impressions and clicks on tool and service pages; no indexing regressions caught by the gate reaching production.
