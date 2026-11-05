import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import worker, { type Env } from '../src/worker.ts';

// The Insights section is retired: every article is a chapter in an edited READOS book, and every old
// /insights/ URL redirects permanently to that chapter.

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const CHAPTERS = 'src/content/reados-chapters';
const NAMES: Record<string, string> = { Engineering: 'engineering', Manufacturing: 'manufacturing', Operations: 'operations', Projects: 'projects', Ideas: 'ideas', Products: 'products', Technology: 'technology', Business: 'business' };

const chapters = readdirSync(join(process.cwd(), CHAPTERS))
  .filter((f) => /^[^_].*\.mdx?$/.test(f))
  .map((f) => {
    const src = read(`${CHAPTERS}/${f}`);
    const category = /^category:\s*["']?([A-Za-z]+)/m.exec(src)?.[1] ?? '';
    return { id: f.replace(/\.mdx?$/, ''), category: NAMES[category], src };
  });
const subjects = [...read('src/utils/reados-collections.ts').matchAll(/\{slug:'([^']+)',title:'(?:[^'\\]|\\.)*',category:'([a-z]+)'[\s\S]*?ids:\[([^\]]*)\]/g)].map((m) => ({
  slug: m[1],
  category: m[2],
  ids: [...m[3].matchAll(/'([^']+)'/g)].map((x) => x[1]),
}));
const redirects = read('public/_redirects').split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.trim().split(/\s+/));

test('the Insights section and its source folder are gone', () => {
  for (const path of ['src/content/insights', 'src/pages/insights', 'src/layouts/InsightsIndex.astro', 'src/components/InsightsListing.astro', 'src/components/ArticleCard.astro']) {
    assert.ok(!existsSync(join(process.cwd(), path)), `${path} removed`);
  }
  const config = read('src/content.config.ts');
  assert.match(config, /const chapters = defineCollection/);
  assert.match(config, /base: '\.\/src\/content\/reados-chapters'/);
  assert.doesNotMatch(config, /reference\('insights'\)|collections = \{ insights/);
  assert.match(read('.pages.yml'), /path: src\/content\/reados-chapters/);
});

test('every chapter sits in exactly one edited READOS book of its own category', () => {
  assert.ok(chapters.length >= 750, `${chapters.length} chapters`);
  const listed = subjects.flatMap((s) => s.ids.map((id) => ({ id, s })));
  for (const c of chapters) {
    const homes = listed.filter((x) => x.id === c.id);
    assert.equal(homes.length, 1, `${c.id} is in exactly one edited book`);
    assert.equal(homes[0].s.category, c.category, `${c.id} is in a ${c.category} book`);
  }
  for (const x of listed) assert.ok(chapters.some((c) => c.id === x.id), `${x.s.slug} lists ${x.id}, which exists`);
});

test('no page or chapter links to the retired /insights/ section', () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(join(process.cwd(), dir), { withFileTypes: true })) {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(path);
      else if (path !== 'src/worker.ts' && /\.(astro|ts|md|mdx|json)$/.test(entry.name) && /["'(\s]\/insights\//.test(read(path))) offenders.push(path); // the Worker holds the redirect fallback
    }
  };
  walk('src');
  assert.deepEqual(offenders, []);
});

test('every old Insights URL redirects permanently, in one hop, to its chapter in an edited book', () => {
  const bySource = new Map(redirects.map(([from, to, code]) => [from, { to, code }]));
  for (const c of chapters) {
    const rule = bySource.get(`/insights/${c.id}/`);
    assert.ok(rule, `/insights/${c.id}/ has a redirect`);
    assert.equal(rule.code, '301');
    const m = /^\/reados\/collections\/([a-z0-9-]+)\/([a-z0-9-]+)\/$/.exec(rule.to);
    assert.ok(m && m[2] === c.id, `${c.id} redirects to its own chapter (${rule.to})`);
    const home = subjects.find((s) => s.ids.includes(c.id));
    assert.ok(home && (m[1] === home.slug || m[1].startsWith(`${home.slug}-part-`)), `${c.id} redirects into ${home?.slug}`);
    assert.ok(!bySource.has(rule.to), 'no redirect chain');
  }
  assert.equal(bySource.get('/insights/')?.to, '/reados/');
  for (const cat of Object.values(NAMES)) assert.equal(bySource.get(`/insights/category/${cat}/`)?.to, `/reados/#${cat}`);
  for (const splat of ['/insights/category/*', '/insights/tag/*', '/insights/page/*']) assert.equal(bySource.get(splat)?.to, '/reados/', splat);
  // No /insights/* catch-all: it would capture article URLs typed without the trailing slash (the Worker handles those).
  assert.ok(!bySource.has('/insights/*'));
  // Catch-alls come after every specific rule, and Cloudflare's limits hold.
  const firstSplat = redirects.findIndex(([from]) => from.startsWith('/insights/') && from.includes('*'));
  assert.ok(redirects.slice(firstSplat).every(([from]) => from.includes('*')), 'wildcards are last');
  const dynamic = redirects.filter(([from]) => from.includes('*') || from.includes(':'));
  assert.ok(redirects.length - dynamic.length <= 2000 && dynamic.length <= 100, 'within Cloudflare redirect limits');
  assert.equal(new Set(redirects.map(([from]) => from)).size, redirects.length, 'no duplicate sources');
});

test('chapter pages name READOS as their home and point duplicates at the edited book', () => {
  const edited = read('src/pages/reados/collections/[book]/[chapter].astro');
  const volume = read('src/pages/reados/books/[book]/[chapter].astro');
  for (const page of [edited, volume]) assert.doesNotMatch(page, /Insights|\/insights\//);
  assert.doesNotMatch(edited, /canonical=/, 'edited-book chapters are their own canonical page');
  assert.match(edited, /<ReadOSChapterReader[\s\S]*?\ssearchable[\s>]/);
  assert.match(read('src/components/ReadOSChapterReader.astro'), /data-pagefind-body=\{searchable \|\| undefined\}/);
  assert.match(volume, /canonical=\{canonical\}/);
  assert.doesNotMatch(volume, /data-pagefind-body|\ssearchable[\s>]/, 'category volumes do not duplicate chapters in site search');
});

test('feed, byline and dates use the READOS chapters and the current identity', () => {
  const feed = read('src/pages/rss.xml.ts');
  assert.match(read('src/content.config.ts'), /author: z\.string\(\)\.default\('BIZOMAT'\)/);
  assert.match(read('src/utils/content.ts'), /export const chapterAuthor/);
  assert.match(feed, /title: `\$\{SITE\.name\} Library`/);
  assert.match(feed, /pubDate: post\.data\.publishDate/);
  assert.match(feed, /author: chapterAuthor\(post\.data\.author\)/);
  assert.match(feed, /readosCollectionChapterHref/);
});

test('the Worker completes Insights addresses the redirect rules cannot match exactly', async () => {
  const env = { ASSETS: { fetch: async () => new Response('asset', { status: 200 }) } } as unknown as Env;
  const go = async (path: string) => {
    const r = await worker.fetch(new Request(`https://kevos.com${path}`), env);
    return [r.status, r.headers.get('Location')];
  };
  assert.deepEqual(await go('/insights'), [301, 'https://kevos.com/insights/']);
  assert.deepEqual(await go('/insights/goodwill-in-acquisitions'), [301, 'https://kevos.com/insights/goodwill-in-acquisitions/']);
  assert.deepEqual(await go('/insights/goodwill-in-acquisitions?ref=x'), [301, 'https://kevos.com/insights/goodwill-in-acquisitions/?ref=x']);
  assert.deepEqual(await go('/insights/not-a-real-article/'), [301, 'https://kevos.com/reados/']);
  assert.deepEqual(await go('/insightsx/'), [200, null], 'other paths are untouched');
  assert.deepEqual(await go('/reados/'), [200, null]);
});
