// SEO release gate. Runs on a fresh build (dist/) and exits 1 on anything that would harm indexing.
// Usage: node scripts/seo/validate.mjs [--dist dist]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { HOST, SITE_RE } from './lib/site.mjs';

const args = process.argv.slice(2);
const DIST = path.resolve(args.includes('--dist') ? args[args.indexOf('--dist') + 1] : 'dist');
const OUT = path.join(DIST, '..', '.seo-inventory.json');

// Pages that must always be indexable, self-canonical and in the sitemap.
export const KEY_PAGES = ['/', '/services/', '/factory-fix/', '/assessment/', '/contact/', '/tools/', '/reados/', '/library/', '/tools/cutting-speed/'];
// Warnings that block a release. Others (long titles, description length, orphans) are reported for review.
export const BLOCKING = new Set(['sitemap-non-canonical', 'sitemap-noindex', 'sitemap-url-missing', 'indexable-not-in-sitemap', 'duplicate-title']);

/** Required properties per JSON-LD type, checked on every page that declares the type. */
export const REQUIRED = {
  Organization: ['name', 'url'],
  WebSite: ['name', 'url'],
  BreadcrumbList: ['itemListElement'],
  WebApplication: ['name', 'url', 'applicationCategory'],
  Article: ['headline'],
  Chapter: ['name', 'isPartOf'],
  Book: ['name'],
};

export function checkSchema(doc) {
  const problems = [];
  for (const m of doc.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(m[1]); } catch { problems.push('JSON-LD does not parse'); continue; }
    for (const node of data['@graph'] ?? [data]) {
      for (const type of [].concat(node['@type'] ?? [])) {
        for (const prop of REQUIRED[type] ?? []) if (node[prop] == null || node[prop] === '') problems.push(`${type} missing ${prop}`);
        if (type === 'BreadcrumbList') {
          for (const item of node.itemListElement ?? []) if (!new RegExp(`^${SITE_RE}/`).test(item.item ?? '')) problems.push(`Breadcrumb item without an absolute ${HOST} URL`);
        }
        if (/rating|review/i.test(JSON.stringify(node)) && /aggregateRating|reviewCount|ratingValue/.test(JSON.stringify(node))) problems.push(`${type} contains ratings or reviews; none are published on the site`);
      }
    }
  }
  return problems;
}

export function checkRobots(text) {
  const problems = [];
  if (!new RegExp(`^Sitemap: ${SITE_RE}/sitemap-index\\.xml$`, 'm').test(text)) problems.push('robots.txt does not point to the sitemap index');
  const star = text.split(/\n(?=User-agent:)/i).find((g) => /^User-agent:\s*\*\s*$/im.test(g)) ?? '';
  if (/^Disallow:\s*\/\s*$/im.test(star)) problems.push('robots.txt blocks the whole site for all crawlers');
  for (const p of ['/tools/', '/reados/', '/services/', '/contact/']) {
    if (new RegExp(`^Disallow:\\s*${p.replace(/\//g, '\\/')}`, 'im').test(star)) problems.push(`robots.txt blocks ${p}`);
  }
  return problems;
}

if (process.argv[1]?.endsWith('validate.mjs')) {
  const failures = [];
  execFileSync(process.execPath, [path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), 'inventory.mjs'), '--dist', DIST, '--out', OUT], { stdio: 'ignore' });
  const inv = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  for (const i of inv.issues) if (i.severity === 'error' || BLOCKING.has(i.code)) failures.push(`${i.code} ${i.path ?? ''}: ${i.detail}`);
  const byPath = new Map(inv.pages.map((p) => [p.path, p]));
  const sitemap = new Set(fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8').match(/<loc>[^<]+<\/loc>/g).map((l) => new URL(l.slice(5, -6)).pathname));
  for (const k of KEY_PAGES) {
    const p = byPath.get(k);
    if (!p) failures.push(`Key page missing from the build: ${k}`);
    else if (p.noindex || !p.selfCanonical) failures.push(`Key page is not indexable and self-canonical: ${k}`);
    else if (!sitemap.has(k)) failures.push(`Key page missing from the sitemap: ${k}`);
  }
  failures.push(...checkRobots(fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8')));
  let checked = 0;
  for (const p of inv.pages) {
    const file = path.join(DIST, p.path === '/' ? 'index.html' : p.path.endsWith('/') ? `${p.path}index.html` : p.path);
    if (!fs.existsSync(file)) continue;
    checked++;
    for (const problem of checkSchema(fs.readFileSync(file, 'utf8'))) failures.push(`${p.path}: ${problem}`);
  }
  fs.rmSync(OUT, { force: true });
  const s = inv.summary;
  console.log(`SEO gate: ${s.pages} pages, ${s.indexableSelfCanonical} indexable, ${s.sitemapUrls} in sitemap, ${checked} JSON-LD pages checked; review notes: ${JSON.stringify(s.issuesByCode)}`);
  if (failures.length) {
    console.error(`\n✗ SEO gate failed (${failures.length}):\n  - ${[...new Set(failures)].slice(0, 50).join('\n  - ')}`);
    process.exit(1);
  }
  console.log('✓ SEO gate passed');
}
