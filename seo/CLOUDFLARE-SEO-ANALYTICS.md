# Cloudflare analytics for SEO

## What is already there

- **Cloudflare Web Analytics** is installed (the `static.cloudflareinsights.com` beacon loads on every page and is allowed by the CSP). Its dashboard shows page views, referrers, countries and real-user Core Web Vitals (LCP, INP, CLS) without cookies. This is the best available source of real-user performance data today.
- Zone analytics for kevos.com (requests, cache, countries, threats) is in the Cloudflare dashboard.

## The connector

`scripts/seo/lib/cloudflare.mjs` reads daily zone totals through the GraphQL Analytics API (`httpRequests1dGroups`, available on the Free plan): requests, cached requests, page views, unique visitors, threats and requests from Australia. **It is traffic data, not search data.** It cannot show search queries, rankings, or which visits came from search, and reports never present it as such.

### One-time setup (owner)

1. Cloudflare dashboard → My Profile → API Tokens → **Create token** → Custom token.
2. Permission: **Zone → Analytics → Read**. Zone resources: **Include → Specific zone → kevos.com**. Nothing else. Set an expiry date (for example one year).
3. Copy the zone ID from the kevos.com Overview page.
4. GitHub → Settings → Secrets and variables → Actions: **secret** `CF_API_TOKEN`, **variable** `CF_ZONE_ID`.
5. Run **SEO daily** by hand and check that the summary shows `cloudflare-analytics | OK`.

## Scheduling choice

The schedules use **GitHub Actions** rather than Cloudflare Workers Cron Triggers:

- they need no new Cloudflare resources or bindings;
- they keep API credentials out of the production Worker;
- they don't add requests to the Worker's free daily allowance;
- the repository already uses Actions for verification.

History is carried in the Actions cache and each run's data is kept as a 90-day artifact. D1 or KV would add operational parts without a current need.

## Cost and limits

| Workflow | Approximate cost |
|---|---|
| Daily job | No build; a few minutes |
| Weekly and monthly jobs | Build the site, roughly 10–15 minutes each |
| Release gate | Builds once per push or pull request |

On a private repository, these run within GitHub's included Actions minutes (check the account's current allowance under Settings → Billing). No paid Cloudflare feature, Workers AI or third-party service is used.
