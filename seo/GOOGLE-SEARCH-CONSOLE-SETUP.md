# Google Search Console setup (one-time, owner)

The connector (`scripts/seo/lib/gsc.mjs`) is built and tested against mocked responses. It is **not connected**: it reports `UNKNOWN` until the steps below are done. It is read-only (`webmasters.readonly` scope) and never uses the Indexing API.

## 1. Confirm the property

In [Search Console](https://search.google.com/search-console), check which property verifies kevos.com:

- a **Domain property**, shown as `kevos.com` (identifier `sc-domain:kevos.com`), or
- a **URL-prefix property**, shown as `https://kevos.com/` (identifier `https://kevos.com/`).

If neither exists, add a Domain property and verify it with the DNS TXT record Google provides, added in Cloudflare DNS. Then submit `https://kevos.com/sitemap-index.xml` under Sitemaps.

## 2. Create a service account (Google Cloud, free)

1. In [Google Cloud Console](https://console.cloud.google.com/), create or choose a project, for example `kevos-seo`.
2. Enable the **Google Search Console API** for the project.
3. Create a **service account** (IAM & Admin → Service Accounts). It needs no Cloud roles.
4. Create a **JSON key** for it and download it once. Treat it as a password.

## 3. Grant it read access in Search Console

Search Console → Settings → Users and permissions → Add user: the service account's email (`…@….iam.gserviceaccount.com`), permission **Restricted**.

## 4. Store the credentials in GitHub, not in the repository

Repository → Settings → Secrets and variables → Actions:

- **Secret** `GSC_SERVICE_ACCOUNT_JSON`: paste the whole JSON key.
- **Variable** `GSC_PROPERTY`: `sc-domain:kevos.com` or `https://kevos.com/`, exactly as in step 1.

Delete the downloaded key file afterwards. Rotate the key once a year (create a new key, update the secret, delete the old key).

## 5. Check it

Actions → **SEO daily** → Run workflow. The run summary should show `google-search-console | OK` with a row count and date window.

## What the data means

- Data lags by about two to three days; the connector stops three days back and asks for `final` data.
- Search Console aggregates and anonymises; rare queries are omitted, so query totals are lower than page totals.
- Average position is impression-weighted across all appearances. It is not a fixed rank.
- The engine needs about four weeks of data before it proposes anything, and acts only above minimum impression thresholds (see `scripts/seo/lib/engine.mjs`).

## URL Inspection

Use the URL Inspection tool in Search Console by hand for specific problems, such as a key page not indexed. The automation does not call it routinely, to stay within quota.
