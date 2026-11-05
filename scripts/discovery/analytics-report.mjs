// Homepage discovery statistics from Workers Analytics Engine (dataset kevos_discovery, binding DISCOVERY_EVENTS).
// Columns written by src/server/discover/handler.ts: blob1 event type (search | none | clarify | click),
// blob2 result kind (tool | chapter | book), blob3 result id or URL, blob4 search keywords, blob5 device.
//
//   CF_API_TOKEN=<token with Account Analytics: Read> node scripts/discovery/analytics-report.mjs [days]
//
// CLOUDFLARE_ACCOUNT_ID overrides the BIZOMAT account. Nothing here identifies a visitor: the dataset holds no IP
// address, cookie or full question.
const token = process.env.CF_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID || '21a5414f507ae268302531c39e888f95';
const days = Math.max(1, Math.min(90, Number(process.argv[2]) || 30));
const DATASET = 'kevos_discovery';

if (!token) {
  console.error('Set CF_API_TOKEN (Cloudflare API token with the Account Analytics: Read permission).');
  process.exit(1);
}

async function sql(query) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/analytics_engine/sql`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: `${query} FORMAT JSON`,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Analytics Engine SQL API ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text).data ?? [];
}

const since = `timestamp > NOW() - INTERVAL '${days}' DAY`;
const table = (title, rows, cols) => {
  console.log(`\n${title}`);
  if (!rows.length) return console.log('  (none yet)');
  for (const r of rows) console.log('  ' + cols.map((c) => String(r[c] ?? '')).join('  ·  '));
};

const [byType, missed, asked, opened, devices] = await Promise.all([
  sql(`SELECT blob1 AS type, SUM(_sample_interval) AS n FROM ${DATASET} WHERE ${since} GROUP BY type ORDER BY n DESC`),
  sql(`SELECT blob4 AS keywords, SUM(_sample_interval) AS n FROM ${DATASET} WHERE ${since} AND blob1 = 'none' GROUP BY keywords ORDER BY n DESC LIMIT 25`),
  sql(`SELECT blob4 AS keywords, SUM(_sample_interval) AS n FROM ${DATASET} WHERE ${since} AND blob1 IN ('search', 'clarify') GROUP BY keywords ORDER BY n DESC LIMIT 25`),
  sql(`SELECT blob2 AS kind, blob3 AS id, SUM(_sample_interval) AS n FROM ${DATASET} WHERE ${since} AND blob1 = 'click' GROUP BY kind, id ORDER BY n DESC LIMIT 25`),
  sql(`SELECT blob5 AS device, SUM(_sample_interval) AS n FROM ${DATASET} WHERE ${since} AND blob1 != 'click' GROUP BY device ORDER BY n DESC`),
]);

console.log(`BIZOMAT discovery statistics, last ${days} day(s)`);
table('Questions by outcome', byType, ['type', 'n']);
table('No result found (candidates for new tools, readings or synonyms)', missed, ['n', 'keywords']);
table('Most asked', asked, ['n', 'keywords']);
table('Most opened resources', opened, ['n', 'kind', 'id']);
table('Device', devices, ['device', 'n']);
