// Cloudflare zone analytics through the GraphQL Analytics API (daily groups are available on the Free plan).
// This is traffic data, not search data: it cannot show queries, rankings or which visits came from search.
//   CF_API_TOKEN  an API token with only "Zone → Analytics → Read" for the site's zone (GitHub Actions secret)
//   CF_ZONE_ID    the site's zone ID (not secret, but kept beside the token)
import { fetchJson, skipped, failed } from './http.mjs';
import { sydneyDate } from './gsc.mjs';

const QUERY = `query ($zone: String!, $from: Date!, $to: Date!) {
  viewer { zones(filter: { zoneTag: $zone }) {
    httpRequests1dGroups(limit: 40, filter: { date_geq: $from, date_leq: $to }, orderBy: [date_ASC]) {
      dimensions { date }
      sum { requests cachedRequests pageViews threats countryMap { clientCountryName requests } }
      uniq { uniques }
    }
  } }
}`;

export async function collectCloudflare({ env = process.env, days = 28, fetchImpl = globalThis.fetch, now = new Date() } = {}) {
  if (!env.CF_API_TOKEN || !env.CF_ZONE_ID) return skipped('cloudflare-analytics', 'CF_API_TOKEN or CF_ZONE_ID is not configured');
  try {
    const variables = { zone: env.CF_ZONE_ID, from: sydneyDate(-days, now), to: sydneyDate(-1, now) };
    const data = await fetchJson('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.CF_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables }),
      fetchImpl,
    });
    if (data.errors?.length) throw new Error(`GraphQL: ${data.errors.map((e) => e.message).join('; ')}`);
    const groups = data.data?.viewer?.zones?.[0]?.httpRequests1dGroups ?? [];
    const daily = groups.map((g) => ({
      date: g.dimensions.date,
      requests: g.sum.requests,
      cachedRequests: g.sum.cachedRequests,
      pageViews: g.sum.pageViews,
      threats: g.sum.threats,
      uniques: g.uniq.uniques,
      australiaRequests: g.sum.countryMap.find((c) => c.clientCountryName === 'AU')?.requests ?? 0,
    }));
    return { source: 'cloudflare-analytics', status: 'OK', window: { from: variables.from, to: variables.to }, fetchedAt: new Date().toISOString(), daily };
  } catch (error) {
    return failed('cloudflare-analytics', error);
  }
}
