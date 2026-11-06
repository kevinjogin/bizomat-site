import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { CATEGORY_COVERS, COVER_MOTIFS, TOPIC_COVERS, coverArt, coverLayout, coverSpec, type Shape } from '../src/utils/reados-covers.ts';

const read = (path: string) => readFileSync(path, 'utf8');
const subjectSlugs = [...read('src/utils/reados-collections.ts').matchAll(/\{slug:'([a-z0-9-]+)'/g)].map((m) => m[1]);
const categories = Object.keys(CATEGORY_COVERS);

/** A catalogue at least as large as the live one: every subject in five parts, every category volume, guides and authored books. */
function sampleCatalogue() {
  const books: { slug: string; title: string; category: string; motif?: string }[] = [];
  for (const slug of subjectSlugs) {
    books.push({ slug, title: slug, category: 'Business' });
    for (let p = 1; p <= 5; p++) books.push({ slug: `${slug}-part-0${p}`, title: `${slug} (Part ${p})`, category: 'Business' });
  }
  for (const c of categories) {
    books.push({ slug: `${c}-practical-perspectives`, title: `Practical Perspectives on ${c}`, category: c });
    for (let v = 1; v <= 14; v++) books.push({ slug: `${c}-volume-${String(v).padStart(2, '0')}`, title: `${c}: Volume ${v}`, category: c });
  }
  books.push({ slug: 'read-the-numbers-understand-the-business', title: 'Read the Numbers, Understand the Business', category: 'Finance and Business' });
  books.push({ slug: 'win-work-you-can-deliver', title: 'Win Work You Can Deliver', category: 'Business', motif: 'opportunity-path' });
  return books;
}

function walk(shapes: Shape[], visit: (s: Shape) => void) {
  for (const s of shapes) { visit(s); if (s.t === 'g' || s.t === 'clip') walk(s.kids, visit); }
}

test('every READOS subject and category has its own cover illustration', () => {
  assert.ok(subjectSlugs.length >= 19, 'subjects are read from reados-collections.ts');
  for (const slug of subjectSlugs) assert.ok(TOPIC_COVERS[slug], `${slug} needs a cover motif`);
  for (const c of ['engineering', 'manufacturing', 'operations', 'projects', 'technology', 'business', 'products', 'ideas']) assert.ok(CATEGORY_COVERS[c], `${c} needs a cover motif`);
  const subjectMotifs = subjectSlugs.map((s) => TOPIC_COVERS[s].motif);
  assert.equal(new Set(subjectMotifs).size, subjectMotifs.length, 'no two subjects share an illustration');
});

test('no two covers in the catalogue are the same', () => {
  const seen = new Map<string, string>();
  for (const book of sampleCatalogue()) {
    const spec = coverSpec(book);
    const key = `${spec.tone}|${JSON.stringify(coverArt(spec, 'x'))}`;
    assert.ok(!seen.has(key), `${book.slug} duplicates ${seen.get(key)}`);
    seen.set(key, book.slug);
  }
});

test('no two published authored books share an illustration and colourway', () => {
  const dir = 'src/content/reados-publications';
  const seen = new Map<string, string>();
  for (const slug of readdirSync(dir)) {
    const meta = read(`${dir}/${slug}/book.md`).split('---')[1];
    if (!/^status: published$/m.test(meta)) continue;
    const field = (k: string) => new RegExp(`^${k}: "?(.+?)"?$`, 'm').exec(meta)?.[1] ?? '';
    const spec = coverSpec({ slug, title: field('title'), category: field('category'), motif: field('coverVariant') || undefined });
    const key = `${spec.motif}:${spec.tone}`;
    assert.ok(!seen.has(key), `${slug} has the same ${key} cover as ${seen.get(key)}`);
    seen.set(key, slug);
  }
  assert.ok(seen.size >= 100, 'published books are read from reados-publications');
});

test('parts of a series keep their illustration but change colourway', () => {
  const tones = [1, 2, 3, 4].map((p) => coverSpec({ slug: `competitive-strategy-and-positioning-part-0${p}`, title: 'x', category: 'Business' }));
  assert.equal(new Set(tones.map((t) => t.motif)).size, 1);
  assert.equal(new Set(tones.map((t) => t.tone)).size, 4);
  assert.equal(tones[1].series, 'PART 02');
  const spec = coverSpec({ slug: 'business-volume-04', title: 'Business: Volume 4', category: 'Business' });
  assert.equal(spec.title, 'Business');
  assert.equal(spec.series, 'VOLUME 04');
});

test('illustrations are finite, stay inside the panel and use cover classes only', () => {
  const allowed = /^(ln|lf|la|cl|bx|bxa|rose|fa|fs|ff|fl|fi|fn|dsh|dsh2|wide|xbold|arm|xwide|thick|lnode|o15|o3|o5|o85|tx|txs|txb|txa|rev|d[1-8]|an-[a-z0-9-]+)$/;
  for (const motif of COVER_MOTIFS) for (const seed of [1, 99, 123456, 987654321]) {
    walk(coverArt({ motif, tone: 'graphite', seed, title: 'x' }, 'u'), (s) => {
      for (const c of (('c' in s && s.c) || '').split(' ').filter(Boolean)) assert.match(c, allowed, `${motif}: unknown class ${c}`);
      for (const [k, v] of Object.entries(s)) if (typeof v === 'number') {
        assert.ok(Number.isFinite(v), `${motif}: ${k} is not finite`);
        if (s.t !== 'text' && (k === 'cx' || k === 'x')) assert.ok(v > -70 && v < 330, `${motif}: ${k}=${v}`);
      }
      if (s.t === 'path') assert.doesNotMatch(s.d, /NaN|Infinity|undefined/, `${motif}: bad path data`);
    });
  }
});

test('titles fit the cover without truncation', () => {
  for (const title of ['Business Finance and Financial Statements', 'Read the Numbers, Understand the Business', 'Sales, Marketing and Customer Decisions', 'Practical Perspectives on Manufacturing', 'Business']) {
    const layout = coverLayout(title);
    assert.equal(layout.lines.join(' '), title, 'every word is kept');
    for (const line of layout.lines) assert.ok(line.length * layout.size * 0.6 <= 304, `"${line}" fits`);
    assert.ok(layout.barY > 200 && layout.panelH >= 150);
  }
});

test('the cover component is CSP-safe and respects reduced motion', () => {
  const cover = read('src/components/ReadOSAnimatedCover.astro');
  assert.doesNotMatch(cover, /\sstyle=/);
  assert.match(cover, /prefers-reduced-motion:\s*reduce/);
  assert.match(cover, /--rc-accent: #14b8a6/);
  // Book pages pass their cover through the shared ReadOSBookHero header.
  assert.match(read('src/components/ReadOSBookHero.astro'), /<ReadOSAnimatedCover \{\.\.\.cover\} \/>/);
  for (const page of ['src/pages/reados/index.astro', 'src/pages/reados/collections/[book]/index.astro', 'src/pages/reados/books/[book]/index.astro', 'src/pages/reados/publications/[book]/index.astro', 'src/pages/library/index.astro', 'src/pages/library/read-the-numbers-understand-the-business/index.astro']) {
    const source = read(page);
    assert.ok(/<ReadOSAnimatedCover[^>]*chapters=/.test(source) || /<ReadOSBookHero[\s\S]*?cover=\{\{[^}]*chapters:/.test(source), `${page} shows the animated cover with its chapter count`);
  }
});
