// BIZOMAT AutoSEO command runner, used by the scheduled GitHub Actions workflows.
//   node scripts/seo/run.mjs collect                 fetch Search Console, Bing and Cloudflare data (each optional)
//   node scripts/seo/run.mjs live-check              check production robots.txt, sitemaps and key pages
//   node scripts/seo/run.mjs report --period weekly  write a report (daily | weekly | monthly)
//   node scripts/seo/run.mjs manifest                record the built canonical pages' content hashes
//   node scripts/seo/run.mjs indexnow [--dry-run]    submit changed canonical URLs after deployment
// State lives in .seo-data/ (git-ignored), carried between runs by the Actions cache and kept as artifacts.
import fs from 'node:fs';
import path from 'node:path';
import { collectSearchConsole, sydneyDate } from './lib/gsc.mjs';
import { collectBing } from './lib/bing.mjs';
import { collectCloudflare } from './lib/cloudflare.mjs';
import { analyse } from './lib/engine.mjs';
import { contentHash, changedUrls, submitIndexNow } from './lib/indexnow.mjs';

const ROOT = process.cwd();
const DATA = path.join(ROOT, '.seo-data');
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, 'seo', 'config.json'), 'utf8'));
const SITE = CONFIG.site;
const KEY_PAGES = ['/', '/services/', '/factory-fix/', '/assessment/', '/contact/', '/tools/', '/tools/cutting-speed/', '/reados/', '/library/', '/about/'];
const args = process.argv.slice(3);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : fallback);
const today = sydneyDate(0);
const readJson = (f, fallback = null) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : fallback);
const writeJson = (f, data) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(data, null, 1)); };
const summary = (md) => { if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`); };

function latestSnapshot() {
  const dir = path.join(DATA, 'snapshots');
  if (!fs.existsSync(dir)) return null;
  const days = fs.readdirSync(dir).sort();
  return days.length ? path.join(dir, days[days.length - 1]) : null;
}

async function collect() {
  const results = await Promise.allSettled([collectSearchConsole({ days: 56 }), collectBing(), collectCloudflare()]);
  const dir = path.join(DATA, 'snapshots', today);
  const names = ['gsc', 'bing', 'cloudflare'];
  const lines = ['| Source | Status | Detail |', '|---|---|---|'];
  results.forEach((r, i) => {
    const value = r.status === 'fulfilled' ? r.value : { source: names[i], status: 'FAILED', reason: String(r.reason?.message ?? r.reason) };
    writeJson(path.join(dir, `${names[i]}.json`), value);
    const detail = value.status === 'OK' ? (value.rows ? `${value.rows.length} rows, ${value.window.startDate} to ${value.window.endDate}` : 'collected') : value.reason;
    lines.push(`| ${value.source} | ${value.status} | ${detail} |`);
    console.log(`${value.source}: ${value.status}${value.status === 'OK' ? '' : ` (${value.reason})`}`);
  });
  summary(`## SEO data collection, ${today}\n\n${lines.join('\n')}\n`);
}

async function liveCheck() {
  const failures = [];
  const get = async (p, init) => fetch(SITE + p, { redirect: 'manual', signal: AbortSignal.timeout(30_000), headers: { 'User-Agent': 'BIZOMAT-AutoSEO-check/1.0 (+https://kevos.com/)' }, ...init });
  const robots = await get('/robots.txt').then((r) => (r.ok ? r.text() : `HTTP ${r.status}`)).catch((e) => `error ${e.name}`);
  if (!/^Sitemap: https:\/\/kevos\.com\/sitemap-index\.xml$/m.test(robots)) failures.push('robots.txt is missing or does not list the sitemap');
  if (/^User-agent:\s*\*\s*\n(?:.*\n)*?Disallow:\s*\/\s*$/im.test(robots)) failures.push('robots.txt blocks the whole site');
  const index = await get('/sitemap-index.xml').then((r) => (r.ok ? r.text() : '')).catch(() => '');
  const child = index.match(/<loc>([^<]+)<\/loc>/)?.[1];
  const sitemap = child ? await fetch(child, { signal: AbortSignal.timeout(30_000) }).then((r) => (r.ok ? r.text() : '')).catch(() => '') : '';
  const locs = (sitemap.match(/<loc>/g) ?? []).length;
  if (!locs) failures.push('Sitemap index or child sitemap is unreachable or empty');
  for (const p of KEY_PAGES) {
    const res = await get(p).catch((e) => ({ status: 0, error: e.name }));
    if (res.status !== 200) { failures.push(`${p} returned ${res.status}`); continue; }
    const html = await res.text();
    if (/noindex/i.test(res.headers.get('x-robots-tag') ?? '') || /<meta name="robots" content="[^"]*noindex/i.test(html)) failures.push(`${p} is set to noindex`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical !== SITE + p) failures.push(`${p} canonical is ${canonical ?? 'missing'}`);
  }
  const keyFile = await get(`/${CONFIG.indexNowKey}.txt`).then((r) => (r.ok ? r.text() : '')).catch(() => '');
  const keyOk = keyFile.trim() === CONFIG.indexNowKey;
  const status = { checkedAt: new Date().toISOString(), sitemapUrls: locs, keyPages: KEY_PAGES.length, indexNowKeyServed: keyOk, failures };
  writeJson(path.join(DATA, 'snapshots', today, 'live-check.json'), status);
  summary(`## Live SEO check, ${today}\n\n- Sitemap URLs: ${locs}\n- Key pages checked: ${KEY_PAGES.length}\n- IndexNow key file served: ${keyOk ? 'yes' : 'no'}\n- Failures: ${failures.length ? failures.map((f) => `\n  - ${f}`).join('') : 'none'}\n`);
  console.log(JSON.stringify(status, null, 2));
  if (failures.length) process.exit(1);
}

function splitWindows(rows) {
  const dates = [...new Set(rows.map((r) => r.date))].sort();
  const cut = dates[Math.max(0, dates.length - 28)];
  return { current: rows.filter((r) => r.date >= cut), prior: rows.filter((r) => r.date < cut) };
}

function report() {
  const period = opt('period', 'weekly');
  const snap = latestSnapshot();
  const read = (n) => (snap ? readJson(path.join(snap, `${n}.json`)) : null);
  const gsc = read('gsc');
  const bing = read('bing');
  const cf = read('cloudflare');
  const live = read('live-check');
  const inventory = readJson(path.join(ROOT, 'seo', 'url-inventory.json'), { pages: [], summary: null });
  const rows = gsc?.status === 'OK' ? gsc.rows : [];
  const { current, prior } = splitWindows(rows);
  const result = analyse({ rows: current, priorRows: prior, inventory: inventory.pages });
  const fmt = (n, d = 0) => (n == null || Number.isNaN(n) ? 'UNKNOWN' : Number(n).toLocaleString('en-AU', { maximumFractionDigits: d }));
  const pct = (n) => (n == null ? 'UNKNOWN' : `${(n * 100).toFixed(1)}%`);
  const priorTotals = analyse({ rows: prior }).stats;
  const country = (code) => current.filter((r) => r.country === code).reduce((s, r) => s + r.clicks, 0);
  const device = (d) => current.filter((r) => r.device === d).reduce((s, r) => s + r.clicks, 0);
  const top = (keyFn, n = 10) => {
    const m = new Map();
    for (const r of current) m.set(keyFn(r), (m.get(keyFn(r)) ?? 0) + r.clicks);
    return [...m].sort((a, b) => b[1] - a[1]).slice(0, n);
  };
  const statusRow = (name, s) => `| ${name} | ${s?.status ?? 'NOT RUN'} | ${s?.status === 'OK' ? s.fetchedAt : (s?.reason ?? 'no snapshot yet')} |`;
  const cfDays = cf?.status === 'OK' ? cf.daily : [];
  const md = [
    `# BIZOMAT SEO ${period} report, ${today} (Australia/Sydney)`,
    '',
    'Figures come only from the sources marked OK. Anything unavailable is shown as UNKNOWN, never as zero. Average position is Search Console\'s impression-weighted average, not a fixed rank.',
    '',
    '## Data sources',
    '| Source | Status | Last refresh or reason |', '|---|---|---|',
    statusRow('Google Search Console', gsc), statusRow('Bing Webmaster Tools', bing), statusRow('Cloudflare analytics', cf),
    `| Live production check | ${live ? (live.failures.length ? 'FAILED' : 'OK') : 'NOT RUN'} | ${live ? `${live.checkedAt}; ${live.failures.length} failure(s)` : ''} |`,
    '',
    '## Search performance (last 28 days of available data vs the 28 before)',
    '| Measure | Current | Previous |', '|---|---:|---:|',
    `| Clicks | ${rows.length ? fmt(result.stats.clicks) : 'UNKNOWN'} | ${prior.length ? fmt(priorTotals.clicks) : 'UNKNOWN'} |`,
    `| Impressions | ${rows.length ? fmt(result.stats.impressions) : 'UNKNOWN'} | ${prior.length ? fmt(priorTotals.impressions) : 'UNKNOWN'} |`,
    `| CTR | ${rows.length ? pct(result.stats.ctr) : 'UNKNOWN'} | ${prior.length ? pct(priorTotals.ctr) : 'UNKNOWN'} |`,
    `| Average position | ${rows.length ? fmt(result.stats.averagePosition, 1) : 'UNKNOWN'} | ${prior.length ? fmt(priorTotals.averagePosition, 1) : 'UNKNOWN'} |`,
    `| Clicks from Australia | ${rows.length ? fmt(country('aus')) : 'UNKNOWN'} | |`,
    `| Clicks, mobile / desktop | ${rows.length ? `${fmt(device('MOBILE'))} / ${fmt(device('DESKTOP'))}` : 'UNKNOWN'} | |`,
    '',
    '## Top queries and landing pages by clicks',
    rows.length ? top((r) => r.query).map(([q, c]) => `- ${q}: ${c}`).join('\n') : 'UNKNOWN until Search Console is connected.',
    '',
    rows.length ? top((r) => r.page).map(([p, c]) => `- ${p}: ${c}`).join('\n') : '',
    '',
    '## Site traffic (Cloudflare, all visitors, not only search)',
    cfDays.length ? `${cfDays.length} days: ${fmt(cfDays.reduce((s, d) => s + d.pageViews, 0))} page views, ${fmt(cfDays.reduce((s, d) => s + d.australiaRequests, 0))} requests from Australia.` : 'UNKNOWN until Cloudflare analytics is connected.',
    '',
    '## Technical health (latest build inventory)',
    inventory.summary ? `${inventory.summary.pages} pages, ${inventory.summary.indexableSelfCanonical} indexable, ${inventory.summary.sitemapUrls} in sitemap. Review notes: ${Object.entries(inventory.summary.issuesByCode).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}.` : 'Inventory not generated in this run.',
    '',
    `## Proposals needing review (${result.proposals.length})`,
    result.proposals.length ? result.proposals.slice(0, 25).map((p) => `- **${p.type}** ${p.url}${p.query ? ` for “${p.query}”` : ''}: ${JSON.stringify(p.evidence)}. Hypothesis: ${p.hypothesis} Risk: ${p.risk}.`).join('\n') : 'None. Either no data yet, or nothing met the evidence thresholds.',
    '',
    `## Alerts (${result.alerts.length})`,
    result.alerts.length ? result.alerts.map((a) => `- ${a.type} ${a.url}: ${a.previousClicks} → ${a.currentClicks} clicks. ${a.note}`).join('\n') : 'None.',
    '',
    '## Automatic actions',
    'None. The engine proposes; it never edits the site. Technical defects are blocked before release by the SEO gate.',
  ].join('\n');
  writeJson(path.join(DATA, 'reports', `${period}-${today}.json`), result);
  fs.writeFileSync(path.join(DATA, 'reports', `${period}-${today}.md`), md);
  summary(md);
  console.log(md);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

/** url → content hash for every URL in the built sitemap (canonical, indexable pages only). */
function manifestFromDist(dist) {
  const sm = fs.readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8');
  const out = {};
  for (const m of sm.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const p = new URL(m[1]).pathname;
    const file = path.join(dist, p === '/' ? 'index.html' : `${p}index.html`);
    if (fs.existsSync(file)) out[m[1]] = contentHash(fs.readFileSync(file, 'utf8'));
  }
  return out;
}

// The release gate builds the site once and hands the IndexNow job only what it needs: the page manifest
// and the built sitemap, written to .seo-build/ and passed between jobs as a small artifact.
const BUILD = path.join(ROOT, '.seo-build');
function manifest() {
  const dist = path.join(ROOT, 'dist');
  writeJson(path.join(BUILD, 'manifest.json'), manifestFromDist(dist));
  fs.copyFileSync(path.join(dist, 'sitemap-0.xml'), path.join(BUILD, 'sitemap-0.xml'));
  console.log(`Manifest of ${Object.keys(readJson(path.join(BUILD, 'manifest.json'))).length} canonical URLs written to .seo-build/`);
}

async function indexnow() {
  const dist = path.join(ROOT, 'dist');
  const fromBuild = fs.existsSync(path.join(BUILD, 'manifest.json'));
  const current = fromBuild ? readJson(path.join(BUILD, 'manifest.json')) : manifestFromDist(dist);
  const manifestFile = path.join(DATA, 'indexnow-manifest.json');
  const previous = readJson(manifestFile);
  const changed = changedUrls(previous, current);
  const logLine = { at: new Date().toISOString(), baseline: !previous, changed: changed.length };
  if (!previous) {
    console.log(`No previous manifest: recording a baseline of ${Object.keys(current).length} URLs; nothing submitted.`);
  } else if (changed.length) {
    // Submit only once production serves this build: the live sitemap must match the built one.
    // A dry run submits nothing, so it does not wait.
    const built = fs.readFileSync(path.join(fromBuild ? BUILD : dist, 'sitemap-0.xml'), 'utf8');
    let live = flag('dry-run') ? built : '';
    for (let i = 0; i < 30 && live !== built; i++) {
      live = await fetch(`${SITE}/sitemap-0.xml`, { cache: 'no-store' }).then((r) => r.text()).catch(() => '');
      if (live !== built) await new Promise((r) => setTimeout(r, 30_000));
    }
    if (live !== built) {
      console.error('Production does not yet serve this build; nothing submitted. The next run will retry.');
      process.exit(1);
    }
    const result = await submitIndexNow(changed, { key: CONFIG.indexNowKey, dryRun: flag('dry-run') });
    Object.assign(logLine, result, { urls: changed.slice(0, 200) });
    console.log(`IndexNow: ${result.dryRun ? 'would submit' : 'submitted'} ${result.submitted} URL(s).`);
  } else {
    console.log('No canonical URL changed since the last submission.');
  }
  if (!flag('dry-run')) writeJson(manifestFile, current);
  fs.mkdirSync(DATA, { recursive: true });
  fs.appendFileSync(path.join(DATA, 'indexnow-log.jsonl'), `${JSON.stringify(logLine)}\n`);
  summary(`## IndexNow, ${today}\n\n${logLine.baseline ? 'Baseline recorded; nothing submitted.' : `${logLine.changed} changed canonical URL(s)${logLine.dryRun ? ' (dry run)' : ''}.`}\n`);
}

const commands = { collect, 'live-check': liveCheck, report, manifest, indexnow };
const command = commands[process.argv[2]];
if (!command) {
  console.error(`Usage: node scripts/seo/run.mjs <${Object.keys(commands).join(' | ')}>`);
  process.exit(2);
}
await command();
