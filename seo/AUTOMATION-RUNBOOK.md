# AutoSEO automation runbook

## What runs and when (times in Australia/Sydney)

| Workflow | When | What it does | Fails (and emails the owner) when |
|---|---|---|---|
| `seo-validate.yml`, job `gate` | Every pull request and push to `main` | Builds the site, runs the SEO release gate, writes the URL inventory and page manifest | The gate finds anything that would harm indexing |
| `seo-validate.yml`, job `indexnow` | After `gate`, pushes to `main` only | Submits changed canonical URLs to IndexNow once production serves the new build | Production doesn't serve the new build within 15 minutes |
| `seo-daily.yml` | 06:30 AEST / 07:30 AEDT | Collects Search Console, Bing and Cloudflare data; checks live `robots.txt`, sitemaps, key pages and the IndexNow key file; writes a daily report | A live check fails (page down, noindex, wrong canonical, sitemap missing) |
| `seo-weekly.yml` | Monday morning | Builds, gates, inventories, collects, then writes the weekly report with proposals and alerts | Gate or live check fails |
| `seo-monthly.yml` | 2nd of each month | As weekly, with the monthly report | Gate or live check fails |

Missing credentials never fail a job. The source is reported as `UNKNOWN` with the reason.

## Where to look

- **Reports:** each run's **Summary** page in GitHub Actions. The repository is private, so only people with access can see them.
- **Data:** each run's artifact `seo-<period>-<run id>`, kept 90 days. It contains `snapshots/<date>/*.json`, `reports/*.md` and `*.json`, and the IndexNow manifest and log.
- **History** between runs is kept in the Actions cache (`seo-data-*`). If the cache is evicted, the next IndexNow run simply records a new baseline.

## Decision rules

The engine (`scripts/seo/lib/engine.mjs`) only **proposes**. Every proposal includes the URL, evidence, previous state, proposed change, target intent, hypothesis, risk, tests and rollback.

| Proposal | Trigger (current window, 28 days) |
|---|---|
| CTR review | Page has ≥ 200 impressions, average position ≤ 10, and CTR below half the site's own median for its position band (needs at least 3 comparable pages) |
| Striking distance | Query–page pair has ≥ 50 impressions at average position 4–20 |
| Cannibalisation | A query with ≥ 100 impressions where two or more pages each take ≥ 20% |
| Decline alert | Page clicks fell ≥ 30% against the previous 28 days, from at least 20 clicks |

**Applied automatically:** only what the build itself guarantees. The sitemap regenerates on every build, and the release gate blocks technical regressions. The engine never edits content, titles, descriptions, links or settings.

**Needs review:** everything the engine proposes, plus every item listed as review-required in the AutoSEO brief (titles and H1s on ranking pages, page intent, service claims, new content, URL changes, internal-link architecture, crawler policy, template changes).

Keep an experiment in place for at least four weeks before judging it. Record it in `seo/SEO-CHANGE-LOG.md` with the date and the evidence that triggered it.

## Local commands

```bash
npm run build
npm run seo:validate        # release gate
npm run seo:inventory       # writes seo/url-inventory.json
node scripts/seo/keywords.mjs
node scripts/seo/run.mjs collect      # uses env credentials if present
node scripts/seo/run.mjs live-check
npm run seo:report
```

## Troubleshooting

- **A source shows `FAILED`:** read the reason in the summary. Expired or revoked credentials show as 401 or 403; replace the secret. Errors never include tokens.
- **The gate fails after a content change:** read the listed paths. The usual causes are a new page missing from the sitemap, a changed canonical, or a duplicate title.
- **The live check fails:** check the site first (`curl -I https://kevos.com/<path>`). If production is fine, check the Cloudflare deployment.
