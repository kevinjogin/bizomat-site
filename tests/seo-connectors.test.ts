// @ts-nocheck -- runtime tests with deliberately partial mocks of fetch and API responses.
// AutoSEO connectors and decision engine, tested against mocked HTTP responses. No real API is called.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { fetchJson, redact } from '../scripts/seo/lib/http.mjs';
import { collectSearchConsole, serviceAccountAssertion, sydneyDate } from '../scripts/seo/lib/gsc.mjs';
import { collectBing, bingDate } from '../scripts/seo/lib/bing.mjs';
import { collectCloudflare } from '../scripts/seo/lib/cloudflare.mjs';
import { changedUrls, contentHash, submitIndexNow } from '../scripts/seo/lib/indexnow.mjs';
import { analyse, aggregate } from '../scripts/seo/lib/engine.mjs';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

test('missing credentials give UNKNOWN, never zero or an exception', async () => {
  for (const r of [await collectSearchConsole({ env: {} }), await collectBing({ env: {} }), await collectCloudflare({ env: {} })]) {
    assert.equal(r.status, 'UNKNOWN');
    assert.match(r.reason, /not configured/);
    assert.equal('rows' in r, false);
  }
});

test('fetchJson retries 429 and 5xx with backoff, but not 4xx, and never logs keys', async () => {
  let calls = 0;
  const flaky = async () => (++calls < 3 ? new Response('busy', { status: 503 }) : json({ ok: true }));
  assert.deepEqual(await fetchJson('https://x.test/a', { fetchImpl: flaky, baseDelayMs: 1 }), { ok: true });
  assert.equal(calls, 3);
  calls = 0;
  await assert.rejects(fetchJson('https://x.test/a?apikey=SECRET', { fetchImpl: async () => { calls++; return new Response('no', { status: 403 }); }, baseDelayMs: 1 }), (e: Error) => !e.message.includes('SECRET') && /REDACTED/.test(e.message));
  assert.equal(calls, 1, '403 is not retried');
  assert.equal(redact('https://a.test/?key=abc&x=1'), 'https://a.test/?key=REDACTED&x=1');
});

test('Search Console: signed service-account JWT, paged query, rows mapped by dimension', async () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const account = { client_email: 'seo@kevos.iam.gserviceaccount.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) };
  const jwt = serviceAccountAssertion(account, 1_700_000_000);
  const [h, c, s] = jwt.split('.');
  assert.ok(crypto.createVerify('RSA-SHA256').update(`${h}.${c}`).verify(publicKey, Buffer.from(s, 'base64url')), 'signature verifies');
  assert.equal(JSON.parse(Buffer.from(c, 'base64url').toString()).scope, 'https://www.googleapis.com/auth/webmasters.readonly');
  const seen: string[] = [];
  const fake = async (url: string, init: RequestInit) => {
    seen.push(url);
    if (url.includes('oauth2')) return json({ access_token: 'tok' });
    assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer tok');
    const body = JSON.parse(String(init.body));
    assert.equal(body.dataState, 'final');
    return json({ rows: [{ keys: ['2026-10-01', 'cutting speed calculator', 'https://kevos.com/tools/cutting-speed/', 'aus', 'MOBILE'], clicks: 3, impressions: 120, ctr: 0.025, position: 8.4 }] });
  };
  const r = await collectSearchConsole({ env: { GSC_SERVICE_ACCOUNT_JSON: JSON.stringify(account), GSC_PROPERTY: 'sc-domain:kevos.com' }, fetchImpl: fake, now: new Date('2026-10-24T00:00:00Z') });
  assert.equal(r.status, 'OK');
  assert.equal(r.window.endDate, '2026-10-21', 'ends three days back for Search Console delay');
  assert.deepEqual(r.rows[0], { date: '2026-10-01', query: 'cutting speed calculator', page: 'https://kevos.com/tools/cutting-speed/', country: 'aus', device: 'MOBILE', clicks: 3, impressions: 120, ctr: 0.025, position: 8.4 });
  assert.ok(seen[1].includes(encodeURIComponent('sc-domain:kevos.com')));
  assert.equal(sydneyDate(0, new Date('2026-10-23T14:00:00Z')), '2026-10-24', 'Sydney calendar date');
});

test('Bing and Cloudflare map their responses; API errors become FAILED, not data', async () => {
  const bing = await collectBing({ env: { BING_WEBMASTER_API_KEY: 'k' }, fetchImpl: async () => json({ d: [{ Query: 'kevos', Clicks: 2, Impressions: 10, Date: '/Date(1761264000000-0700)/' }] }) });
  assert.equal(bing.status, 'OK');
  assert.equal(bing.queries[0].Date, '2025-10-24');
  assert.equal(bingDate('nonsense'), null);
  const cf = await collectCloudflare({ env: { CF_API_TOKEN: 't', CF_ZONE_ID: 'z' }, fetchImpl: async () => json({ data: { viewer: { zones: [{ httpRequests1dGroups: [{ dimensions: { date: '2026-10-20' }, sum: { requests: 100, cachedRequests: 60, pageViews: 40, threats: 0, countryMap: [{ clientCountryName: 'AU', requests: 70 }] }, uniq: { uniques: 12 } }] }] } } }) });
  assert.deepEqual(cf.daily[0], { date: '2026-10-20', requests: 100, cachedRequests: 60, pageViews: 40, threats: 0, uniques: 12, australiaRequests: 70 });
  const err = await collectCloudflare({ env: { CF_API_TOKEN: 't', CF_ZONE_ID: 'z' }, fetchImpl: async () => json({ errors: [{ message: 'not authorized' }] }) });
  assert.equal(err.status, 'FAILED');
});

test('IndexNow: no baseline submits nothing; changes and removals are found; only kevos.com is sent', async () => {
  assert.deepEqual(changedUrls(null, { 'https://kevos.com/a/': '1' }), []);
  assert.deepEqual(changedUrls({ 'https://kevos.com/a/': '1', 'https://kevos.com/gone/': '2' }, { 'https://kevos.com/a/': '9', 'https://kevos.com/new/': '3' }), ['https://kevos.com/a/', 'https://kevos.com/gone/', 'https://kevos.com/new/']);
  assert.equal(contentHash('<title>A</title><main>x  y</main><script>1</script>'), contentHash('<title>A</title><main>x y</main>'), 'whitespace and scripts ignored');
  let body: { host: string; urlList: string[]; keyLocation: string } | undefined;
  const r = await submitIndexNow(['https://kevos.com/a/', 'https://kevos.com/a/', 'https://other.example/x'], { key: 'abc', fetchImpl: async (_u: string, init: RequestInit) => { body = JSON.parse(String(init.body)); return new Response('', { status: 202 }); } });
  assert.equal(r.submitted, 1);
  assert.deepEqual(body?.urlList, ['https://kevos.com/a/']);
  assert.equal(body?.keyLocation, 'https://kevos.com/abc.txt');
});

test('engine: evidence thresholds, striking distance, cannibalisation and declines; nothing auto-applied', () => {
  const row = (query: string, page: string, clicks: number, impressions: number, position: number, date = '2026-10-10') => ({ date, query, page, country: 'aus', device: 'DESKTOP', clicks, impressions, ctr: clicks / impressions, position });
  const P = (n: string) => `https://kevos.com/${n}/`;
  const rows = [
    row('a', P('one'), 40, 400, 3), row('b', P('two'), 38, 400, 3), row('c', P('three'), 36, 400, 2.5),
    row('d', P('low-ctr'), 2, 400, 2.8), // far below the band median
    row('cutting speed calculator', P('tools/cutting-speed'), 1, 80, 9),
    row('jig design', P('x'), 0, 60, 7), row('jig design', P('y'), 0, 60, 8),
    row('tiny', P('tiny'), 0, 10, 12), // below thresholds
  ];
  const prior = [row('a', P('one'), 100, 500, 3, '2026-09-10')];
  const { proposals, alerts } = analyse({ rows, priorRows: prior, inventory: [{ url: P('low-ctr'), title: 'Old title', description: 'Old description' }] });
  const types = proposals.map((p: { type: string; url: string }) => `${p.type}:${p.url}`);
  assert.ok(types.includes(`ctr-review:${P('low-ctr')}`));
  assert.ok(types.includes(`striking-distance:${P('tools/cutting-speed')}`));
  assert.ok(proposals.some((p: { type: string; query?: string }) => p.type === 'cannibalisation' && p.query === 'jig design'));
  assert.ok(!types.some((t: string) => t.endsWith(P('tiny'))), 'small samples are ignored');
  assert.ok(proposals.every((p: { approval: string; rollback: string; hypothesis: string }) => p.approval === 'review' && p.rollback && p.hypothesis));
  assert.equal(proposals.find((p: { type: string }) => p.type === 'ctr-review').previousState.title, 'Old title');
  assert.deepEqual(alerts.map((a: { url: string; drop: number }) => [a.url, a.drop]), [[P('one'), 0.6]]);
  assert.deepEqual(analyse({}).proposals, [], 'no data, no proposals');
  assert.equal(aggregate([row('q', P('p'), 1, 10, 2), row('q', P('p'), 1, 30, 6)], () => 'k')[0].position, 5, 'impression-weighted position');
});
