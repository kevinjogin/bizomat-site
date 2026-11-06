// Bing Webmaster Tools, read-only, using the API key generated in Bing Webmaster Tools (Settings → API access).
//   BING_WEBMASTER_API_KEY  stored as a GitHub Actions secret
//   BING_SITE_URL           the verified site, default the site address (seo/config.json)
import { fetchJson, skipped, failed } from './http.mjs';
import { SITE } from './site.mjs';

const BASE = 'https://ssl.bing.com/webmaster/api.svc/json';
const METHODS = { queries: 'GetQueryStats', pages: 'GetPageStats', traffic: 'GetRankAndTrafficStats', crawl: 'GetCrawlStats' };

/** Bing returns dates as "/Date(1700000000000-0800)/"; convert to ISO dates. */
export function bingDate(value) {
  const ms = /\/Date\((-?\d+)/.exec(String(value))?.[1];
  return ms ? new Date(Number(ms)).toISOString().slice(0, 10) : null;
}

export async function collectBing({ env = process.env, fetchImpl = globalThis.fetch } = {}) {
  if (!env.BING_WEBMASTER_API_KEY) return skipped('bing-webmaster', 'BING_WEBMASTER_API_KEY is not configured');
  const site = env.BING_SITE_URL || `${SITE}/`;
  const out = { source: 'bing-webmaster', status: 'OK', site, fetchedAt: new Date().toISOString() };
  try {
    for (const [name, method] of Object.entries(METHODS)) {
      const url = `${BASE}/${method}?siteUrl=${encodeURIComponent(site)}&apikey=${encodeURIComponent(env.BING_WEBMASTER_API_KEY)}`;
      const data = await fetchJson(url, { fetchImpl });
      out[name] = (data.d ?? []).map((r) => ({ ...r, Date: r.Date ? bingDate(r.Date) : undefined }));
    }
    return out;
  } catch (error) {
    return failed('bing-webmaster', error);
  }
}
