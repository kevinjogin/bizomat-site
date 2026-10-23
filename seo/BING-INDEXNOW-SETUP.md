# Bing Webmaster Tools and IndexNow

## Bing Webmaster Tools (one-time, owner)

The connector (`scripts/seo/lib/bing.mjs`) reads query, page, traffic and crawl statistics. It is **not connected** until:

1. Sign in to [Bing Webmaster Tools](https://www.bing.com/webmasters). Add `https://kevos.com/`. The quickest verification is **Import from Google Search Console** once that is set up; DNS (CNAME in Cloudflare) also works.
2. Submit `https://kevos.com/sitemap-index.xml` under Sitemaps.
3. Settings → **API access** → generate an API key.
4. GitHub → Settings → Secrets and variables → Actions: **secret** `BING_WEBMASTER_API_KEY`; optional **variable** `BING_SITE_URL` (default `https://kevos.com/`).
5. Run **SEO daily** by hand and check that the summary shows `bing-webmaster | OK`.

## IndexNow (ready on deploy, no secret needed)

IndexNow tells participating engines (Bing, Yandex, Seznam, Naver and others) that a URL changed. **Google does not use IndexNow**, and a submission never guarantees crawling or indexing.

- **Key:** `fd01839eaa4fee7a857f7b3bf15516a8`, in `seo/config.json` and served at `https://kevos.com/fd01839eaa4fee7a857f7b3bf15516a8.txt`. The protocol requires the key to be public, so it is not a secret. To rotate it, replace both the file in `public/` and the value in `seo/config.json`.
- **When:** after each push to `main`, the `indexnow` job in `seo-validate.yml` runs after the release gate.
- **What:** only canonical, indexable URLs from the built sitemap whose content hash (title, description and `<main>`) changed since the last submission, plus URLs that disappeared. Unchanged pages are never resubmitted.
- **Safety:**
  - The job waits until production serves the new sitemap before submitting; if production doesn't catch up within 15 minutes, it submits nothing and fails visibly.
  - The first run only records a baseline, so the whole site is never mass-submitted.
  - Submissions go only to `kevos.com` URLs, deduplicated.
- **Log:** `.seo-data/indexnow-log.jsonl` in the run artifact.

Dry run locally: `npm run build && node scripts/seo/run.mjs indexnow --dry-run`.
