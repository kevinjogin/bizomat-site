#!/usr/bin/env node
// Provision the isolated Cloudflare resources for ONE environment of this app via
// the Cloudflare REST API, then write their IDs into wrangler.jsonc (in the
// working copy only).
//
//   CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… node scripts/cf-provision.mjs preview [--reuse]
//
// Safety:
//   * only touches names starting with "workos-platform-<env>";
//   * by default ABORTS if any of those names already exist (never reuses
//     something it did not create). Pass --reuse only to resume a previous
//     provisioning run of this app that was interrupted;
//   * only issues GET and create (POST) calls — never updates or deletes.

import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';

const env = process.argv[2];
const reuse = process.argv.includes('--reuse');
if (!['dev', 'preview', 'production'].includes(env)) {
  console.error('usage: cf-provision.mjs <dev|preview|production> [--reuse]');
  process.exit(1);
}
const token = process.env.CLOUDFLARE_API_TOKEN;
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
if (!token || !account) {
  console.error('CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID must be set (GitHub repository secrets).');
  process.exit(1);
}

const names = {
  worker: `workos-platform-${env}`,
  db: `workos-platform-${env}-db`,
  bucket: `workos-platform-${env}-files`,
  kv: `workos-platform-${env}-cache`,
};

async function cf(method, path, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const errs = (json.errors ?? []).map((e) => `${e.code}: ${e.message}`).join('; ') || res.statusText;
    const err = new Error(`${method} ${path} -> ${res.status} ${errs}`);
    err.codes = (json.errors ?? []).map((e) => e.code);
    throw err;
  }
  return json;
}

async function listAll(path, pick) {
  const out = [];
  for (let page = 1; page < 50; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const j = await cf('GET', `${path}${sep}page=${page}&per_page=100`);
    const items = pick(j.result);
    out.push(...items);
    const info = j.result_info;
    if (!info || !items.length || (info.total_pages && page >= info.total_pages) || items.length < 100) break;
  }
  return out;
}

const conflicts = [];
function existing(kind, name) {
  if (!reuse) conflicts.push(`${kind} "${name}" already exists`);
  else console.log(`  reusing existing ${kind} ${name} (--reuse)`);
}

console.log(`== Read-only inventory for account ${account.slice(0, 6)}…`);
const [workers, dbs, kvs] = await Promise.all([
  listAll('/workers/scripts', (r) => r ?? []).catch((e) => { throw new Error(`Cannot list Workers (token needs "Workers Scripts: Edit"): ${e.message}`); }),
  listAll('/d1/database', (r) => r ?? []),
  listAll('/storage/kv/namespaces', (r) => r ?? []),
]);
let buckets = [];
try {
  const j = await cf('GET', '/r2/buckets?per_page=1000');
  buckets = j.result?.buckets ?? [];
} catch (e) {
  if (e.codes?.includes(10042)) {
    console.error('R2 is not enabled on this account. Enable it once in the Cloudflare dashboard (R2 Object Storage → Purchase/enable the free plan), then re-run.');
    process.exit(3);
  }
  throw e;
}
console.log(`  ${workers.length} Workers, ${dbs.length} D1 databases, ${kvs.length} KV namespaces, ${buckets.length} R2 buckets found (none will be modified).`);

const worker = workers.find((w) => w.id === names.worker);
let db = dbs.find((d) => d.name === names.db);
let kv = kvs.find((k) => k.title === names.kv);
const bucket = buckets.find((b) => b.name === names.bucket);
if (worker) existing('Worker', names.worker);
if (db) existing('D1 database', names.db);
if (kv) existing('KV namespace', names.kv);
if (bucket) existing('R2 bucket', names.bucket);
if (conflicts.length) {
  console.error('Refusing to continue — these names are already taken:\n  - ' + conflicts.join('\n  - '));
  console.error('If they were created by an earlier run of this script, re-run with reuse_existing=true; otherwise pick a new name prefix.');
  process.exit(2);
}

const sub = await cf('GET', '/workers/subdomain').catch(() => null);
const subdomain = sub?.result?.subdomain;
if (!subdomain) {
  console.error('This account has no workers.dev subdomain yet. Open Workers & Pages once in the Cloudflare dashboard to claim one, then re-run.');
  process.exit(4);
}

console.log('== Creating resources');
if (!db) {
  db = (await cf('POST', '/d1/database', { name: names.db })).result;
  console.log(`  created D1 ${names.db} (${db.uuid})`);
}
if (!kv) {
  kv = (await cf('POST', '/storage/kv/namespaces', { title: names.kv })).result;
  console.log(`  created KV ${names.kv} (${kv.id})`);
}
if (!bucket) {
  await cf('POST', '/r2/buckets', { name: names.bucket });
  console.log(`  created R2 ${names.bucket}`);
}

const dbId = db.uuid ?? db.id;
const kvId = kv.id;
const url = `https://${names.worker}.${subdomain}.workers.dev`;

// Patch wrangler.jsonc (working copy) with the real IDs.
let cfg = readFileSync('wrangler.jsonc', 'utf8');
const up = env.toUpperCase();
if (env === 'dev') {
  cfg = cfg.replace('00000000-0000-0000-0000-000000000001', dbId).replace('00000000000000000000000000000001', kvId);
} else {
  cfg = cfg.replace(`REPLACE_WITH_${up}_D1_ID`, dbId).replace(`REPLACE_WITH_${up}_KV_ID`, kvId);
}
cfg = cfg.replaceAll('REPLACE_WITH_SUBDOMAIN', subdomain);
writeFileSync('wrangler.jsonc', cfg);

console.log(`== Done\n  D1 id: ${dbId}\n  KV id: ${kvId}\n  URL:   ${url}`);
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `d1_id=${dbId}\nkv_id=${kvId}\nsubdomain=${subdomain}\nurl=${url}\n`);
