// Builds a URL inventory from the built site (dist/) and audits technical SEO.
// Reads only local files: no network, no credentials. Output: seo/url-inventory.json (+ summary on stdout).
// Usage: node scripts/seo/inventory.mjs [--dist dist] [--out seo/url-inventory.json]
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const DIST = path.resolve(opt('dist', 'dist'));
const OUT = path.resolve(opt('out', 'seo/url-inventory.json'));
const SITE = 'https://kevos.com';

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const meta = (doc, attr, name) => {
  const re = new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, 'i');
  const m = doc.match(re);
  return m ? decode(m[1]) : null;
};

/** Area of the site a path belongs to, for grouping and keyword mapping. */
export function sectionOf(p) {
  if (p === '/') return 'home';
  if (p.startsWith('/reados/publications/')) return 'reados-book';
  if (p.startsWith('/reados/collections/')) return 'reados-collection';
  if (p.startsWith('/reados/books/')) return 'reados-volume';
  if (p.startsWith('/reados/')) return 'reados';
  if (p.startsWith('/library/')) return 'library';
  if (p.startsWith('/tools/')) return 'workos';
  if (p.startsWith('/contact/') || p.startsWith('/assessment/')) return 'reachos';
  if (/^\/(services|factory-fix|how-it-works|industries|about|proof-of-work)\//.test(p)) return 'commercial';
  return 'other';
}

/** Parse one built HTML page into an inventory record. */
export function parsePage(doc, urlPath) {
  const title = decode(doc.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const canonical = doc.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null;
  const robots = meta(doc, 'name', 'robots');
  const h1s = [...doc.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()));
  const schemaTypes = new Set();
  let schemaValid = true;
  for (const m of doc.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      const nodes = data['@graph'] ?? [data];
      for (const n of nodes) for (const t of [].concat(n['@type'] ?? [])) schemaTypes.add(t);
    } catch {
      schemaValid = false;
    }
  }
  const links = new Set();
  for (const m of doc.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) links.add(m[1]);
  const imgs = [...doc.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const body = (doc.match(/<main[\s\S]*?<\/main>/)?.[0] ?? doc).replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ');
  const words = body.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  return {
    path: urlPath,
    url: SITE + urlPath,
    section: sectionOf(urlPath),
    title,
    titleLength: title.length,
    description: meta(doc, 'name', 'description') ?? '',
    canonical,
    selfCanonical: canonical === SITE + urlPath,
    noindex: /noindex/i.test(robots ?? ''),
    h1: h1s,
    ogImage: meta(doc, 'property', 'og:image'),
    twitterCard: meta(doc, 'name', 'twitter:card'),
    lang: doc.match(/<html lang="([^"]+)"/)?.[1] ?? null,
    schemaTypes: [...schemaTypes].sort(),
    schemaValid,
    words,
    internalLinks: [...links].sort(),
    images: imgs.length,
    imagesMissingAlt: imgs.filter((i) => !/\balt=/.test(i)).length,
    imagesWithoutLazy: imgs.filter((i) => !/loading="lazy"/.test(i)).length,
  };
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

/** Read every <loc> from the sitemap index and its child sitemaps in dist. */
export function sitemapUrls(dist) {
  const index = path.join(dist, 'sitemap-index.xml');
  if (!fs.existsSync(index)) return [];
  const children = [...fs.readFileSync(index, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => path.join(dist, new URL(m[1]).pathname));
  return children.flatMap((f) => (fs.existsSync(f) ? [...fs.readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : []));
}

/** Technical issues, each with a severity and the evidence behind it. */
export function audit(pages, sitemap) {
  const issues = [];
  const add = (severity, code, pathOrNull, detail) => issues.push({ severity, code, path: pathOrNull, detail });
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const inSitemap = new Set(sitemap.map((u) => new URL(u).pathname));
  const indexable = pages.filter((p) => !p.noindex && p.selfCanonical);
  const titleSeen = new Map();
  const descSeen = new Map();
  for (const p of pages) {
    if (p.path === '/404.html' || p.path === '/404/') continue;
    if (!p.canonical) add('error', 'missing-canonical', p.path, 'No canonical link');
    if (p.h1.length !== 1) add('error', 'h1-count', p.path, `${p.h1.length} H1 elements`);
    if (!p.schemaValid) add('error', 'invalid-json-ld', p.path, 'A JSON-LD block does not parse');
    if (p.imagesMissingAlt) add('error', 'img-alt', p.path, `${p.imagesMissingAlt} image(s) without alt`);
    if (!p.noindex && p.selfCanonical) {
      if (p.titleLength > 65) add('info', 'long-title', p.path, `Title is ${p.titleLength} characters; may be truncated in results`);
      if (p.description.length < 70 || p.description.length > 170) add('info', 'description-length', p.path, `Description is ${p.description.length} characters`);
      const t = titleSeen.get(p.title);
      if (t) add('warn', 'duplicate-title', p.path, `Same title as ${t}`);
      else titleSeen.set(p.title, p.path);
      const d = descSeen.get(p.description);
      if (d) add('warn', 'duplicate-description', p.path, `Same description as ${d}`);
      else descSeen.set(p.description, p.path);
      if (!inSitemap.has(p.path)) add('warn', 'indexable-not-in-sitemap', p.path, 'Indexable, self-canonical page missing from the sitemap');
    }
  }
  for (const u of sitemap) {
    const p = byPath.get(new URL(u).pathname);
    if (!p) add('error', 'sitemap-url-missing', new URL(u).pathname, 'Sitemap lists a URL with no built page');
    else if (p.noindex) add('error', 'sitemap-noindex', p.path, 'Sitemap lists a noindex page');
    else if (!p.selfCanonical) add('warn', 'sitemap-non-canonical', p.path, `Sitemap lists a page whose canonical is ${p.canonical}`);
  }
  // Orphans: indexable pages that no other page links to.
  const inbound = new Map();
  for (const p of pages) for (const l of p.internalLinks) if (l !== p.path) inbound.set(l, (inbound.get(l) ?? 0) + 1);
  for (const p of indexable) if (p.path !== '/' && !inbound.get(p.path)) add('warn', 'orphan', p.path, 'No internal links point to this indexable page');
  return { issues, inbound };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('inventory.mjs')) {
  if (!fs.existsSync(DIST)) {
    console.error(`No build found at ${DIST}. Run npm run build first.`);
    process.exit(1);
  }
  const pages = walk(DIST)
    .filter((f) => f.endsWith('.html') && !f.includes(`${path.sep}pagefind${path.sep}`))
    .map((f) => {
      const rel = path.relative(DIST, f).split(path.sep).join('/');
      const urlPath = rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? `/${rel.slice(0, -'index.html'.length)}` : `/${rel}`;
      return parsePage(fs.readFileSync(f, 'utf8'), urlPath);
    })
    .sort((a, b) => a.path.localeCompare(b.path));
  const sitemap = sitemapUrls(DIST);
  const { issues, inbound } = audit(pages, sitemap);
  for (const p of pages) p.inboundLinks = inbound.get(p.path) ?? 0;
  const count = (fn) => pages.filter(fn).length;
  const summary = {
    generatedAt: new Date().toISOString(),
    source: 'dist/ build output',
    pages: pages.length,
    indexableSelfCanonical: count((p) => !p.noindex && p.selfCanonical),
    noindex: count((p) => p.noindex),
    canonicalElsewhere: count((p) => !p.noindex && !p.selfCanonical),
    sitemapUrls: sitemap.length,
    bySection: Object.fromEntries([...new Set(pages.map((p) => p.section))].sort().map((s) => [s, count((p) => p.section === s)])),
    issuesBySeverity: Object.fromEntries(['error', 'warn', 'info'].map((s) => [s, issues.filter((i) => i.severity === s).length])),
    issuesByCode: issues.reduce((acc, i) => ({ ...acc, [i.code]: (acc[i.code] ?? 0) + 1 }), {}),
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ summary, issues, pages: pages.map(({ internalLinks, ...rest }) => ({ ...rest, outboundInternalLinks: internalLinks.length })) }, null, 1));
  console.log(JSON.stringify(summary, null, 2));
}
