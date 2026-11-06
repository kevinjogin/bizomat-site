// Google Search Console, read-only. Authenticates as a service account that the property owner has added
// as a user in Search Console. Credentials come only from the environment:
//   GSC_SERVICE_ACCOUNT_JSON  the service account key (JSON), stored as a GitHub Actions secret
//   GSC_PROPERTY              the exact verified property, e.g. "sc-domain:bizomat.ai" or "https://bizomat.ai/"
// Search Console data is delayed by about two to three days, aggregated and anonymised; average position is
// an impression-weighted average, not a fixed ranking.
import crypto from 'node:crypto';
import { fetchJson, skipped, failed } from './http.mjs';

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

const b64url = (input) => Buffer.from(input).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

/** Signed JWT assertion for the OAuth 2.0 service-account flow (RS256). */
export function serviceAccountAssertion(account, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({ iss: account.client_email, scope: SCOPE, aud: TOKEN_URL, iat: nowSeconds, exp: nowSeconds + 3600 }));
  const signature = crypto.createSign('RSA-SHA256').update(`${header}.${claims}`).sign(account.private_key);
  return `${header}.${claims}.${b64url(signature)}`;
}

async function accessToken(account, fetchImpl) {
  const body = new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: serviceAccountAssertion(account) });
  const data = await fetchJson(TOKEN_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body, fetchImpl });
  if (!data.access_token) throw new Error('Search Console token response had no access token');
  return data.access_token;
}

/** Sydney-calendar date string offset by `days` from `now`. */
export function sydneyDate(days = 0, now = new Date()) {
  const d = new Date(now.getTime() + days * 86_400_000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Sydney' }).format(d);
}

/**
 * Fetch daily rows for the window ending three days ago (Search Console's usual delay).
 * Returns { source, status: 'OK', window, rows: [{ date, query, page, country, device, clicks, impressions, ctr, position }] }
 */
export async function collectSearchConsole({ env = process.env, days = 28, fetchImpl = globalThis.fetch, now = new Date() } = {}) {
  if (!env.GSC_SERVICE_ACCOUNT_JSON || !env.GSC_PROPERTY) return skipped('google-search-console', 'GSC_SERVICE_ACCOUNT_JSON or GSC_PROPERTY is not configured');
  try {
    const account = JSON.parse(env.GSC_SERVICE_ACCOUNT_JSON);
    const token = await accessToken(account, fetchImpl);
    const endDate = sydneyDate(-3, now);
    const startDate = sydneyDate(-3 - (days - 1), now);
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(env.GSC_PROPERTY)}/searchAnalytics/query`;
    const rows = [];
    for (let startRow = 0; startRow < 100_000; startRow += 25_000) {
      const data = await fetchJson(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, dimensions: ['date', 'query', 'page', 'country', 'device'], rowLimit: 25_000, startRow, dataState: 'final' }),
        fetchImpl,
      });
      const batch = data.rows ?? [];
      for (const r of batch) {
        const [date, query, page, country, device] = r.keys;
        rows.push({ date, query, page, country, device, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position });
      }
      if (batch.length < 25_000) break;
    }
    return { source: 'google-search-console', status: 'OK', property: env.GSC_PROPERTY, window: { startDate, endDate }, fetchedAt: new Date().toISOString(), rows };
  } catch (error) {
    return failed('google-search-console', error);
  }
}
