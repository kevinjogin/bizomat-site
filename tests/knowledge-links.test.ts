import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';
import { buildGraph, DISCOVERY_TOPIC, readCatalogue, readCollectionSubjects, readLinks, readPathways, validateLinks, validatePathways, type KnowledgeLink } from '../src/utils/knowledge.ts';
import { CATEGORY_SLUGS } from '../src/config/taxonomy.ts';

// READOS ↔ WORKOS knowledge connections: one relationship file (src/data/knowledge-links.json), shown both ways.

const catalogue = readCatalogue();
const links = readLinks();
const graph = buildGraph(links, catalogue);
const ROOT = process.cwd();

test('the catalogues are read from source: 114 publications, every edited collection and 971 tools', () => {
  const books = [...catalogue.books.values()];
  const pubDirs = readdirSync(join(ROOT, 'src', 'content', 'reados-publications')).filter((d) => !d.startsWith('.'));
  assert.equal(books.filter((b) => b.kind === 'publication').length, pubDirs.length);
  assert.equal(books.filter((b) => b.kind === 'collection').length, readCollectionSubjects().length);
  assert.equal(readCollectionSubjects().length, (readFileSync(join(ROOT, 'src', 'utils', 'reados-collections.ts'), 'utf8').match(/\{slug:'/g) ?? []).length, 'every collection is parsed');
  assert.equal(catalogue.tools.size, 971);
});

test('every relationship references an existing READOS book, chapter and WORKOS tool, with valid fields', () => {
  assert.deepEqual(validateLinks(links, catalogue), []);
  assert.ok(links.length > 0);
});

test('only approved links between published pages are shown', () => {
  for (const l of graph.live) assert.equal(l.status, 'approved');
  const hidden = links.filter((l) => l.status !== 'approved');
  for (const l of hidden) {
    assert.ok(!graph.toolsFor(l.reados).some((x) => x.tool.id === l.tool) || links.some((o) => o !== l && o.status === 'approved' && o.reados === l.reados && o.tool === l.tool), `${l.status} ${l.reados} → ${l.tool} is not published`);
  }
  // A suggested link added to the data is validated but never displayed.
  const book = graph.live[0].reados;
  const tool = [...catalogue.tools.keys()].find((id) => !graph.toolsFor(book).some((x) => x.tool.id === id))!;
  const g2 = buildGraph([...links, { reados: book, tool, type: 'applies', note: 'A suggestion that is not yet reviewed.', status: 'suggested', evidence: 'review' }], catalogue);
  assert.ok(!g2.toolsFor(book).some((x) => x.tool.id === tool), 'suggested link is not shown on the book');
  assert.ok(!g2.readingsFor(tool).some((x) => x.book.href === catalogue.books.get(book)!.href), 'nor on the tool');
});

test('each relationship is stored once and appears in both directions', () => {
  for (const l of graph.live) {
    const book = catalogue.books.get(l.reados)!;
    assert.ok(graph.toolsFor(l.reados).some((x) => x.tool.id === l.tool), `${l.reados} shows ${l.tool}`);
    assert.ok(graph.readingsFor(l.tool).some((x) => x.book.href === book.href), `${l.tool} shows ${l.reados}`);
    if (l.chapter) assert.ok(graph.toolsFor(l.reados, l.chapter).some((x) => x.tool.id === l.tool), `chapter ${l.chapter} shows ${l.tool}`);
  }
  // No duplicate cards: one entry per tool on a book, one per book on a tool.
  for (const key of new Set(graph.live.map((l) => l.reados))) {
    const ids = graph.toolsFor(key).map((x) => x.tool.id);
    assert.equal(new Set(ids).size, ids.length, `${key} lists each tool once`);
  }
  for (const id of new Set(graph.live.map((l) => l.tool))) {
    const books = graph.readingsFor(id).map((x) => x.book.href);
    assert.equal(new Set(books).size, books.length, `${id} lists each book once`);
  }
});

test('duplicates, unknown ids and bad fields are reported', () => {
  const ok = graph.live[0];
  const probe = (extra: Partial<KnowledgeLink>[]) => validateLinks([ok, ...extra.map((e) => ({ ...ok, ...e }) as KnowledgeLink)], catalogue);
  assert.ok(probe([{}]).some((p) => p.includes('duplicates')), 'duplicate');
  assert.ok(probe([{ tool: 'no-such-tool' }]).some((p) => p.includes('no WORKOS tool')), 'unknown tool');
  assert.ok(probe([{ reados: 'publication/no-such-book' }]).some((p) => p.includes('no READOS book')), 'unknown book');
  assert.ok(probe([{ chapter: 'no-such-chapter' }]).some((p) => p.includes('has no chapter')), 'unknown chapter');
  assert.ok(probe([{ reados: 'Some Book Title' }]).some((p) => p.includes('must be "publication/<slug>"')), 'titles are not ids');
  assert.ok(probe([{ tool: 'roi', type: 'related' as any }]).some((p) => p.includes('type must be')), 'type');
  assert.ok(probe([{ tool: 'roi', status: 'maybe' as any }]).some((p) => p.includes('status must be')), 'status');
  assert.ok(probe([{ tool: 'roi', note: 'short' }]).some((p) => p.includes('note must be')), 'note');
  assert.ok(probe([{ tool: 'roi', evidence: 'review', reason: undefined }]).some((p) => p.includes('needs a reason')), 'review reason');
  assert.ok(probe([{ tool: 'roi', colour: 'red' } as any]).some((p) => p.includes('unknown field')), 'unknown field');
  assert.throws(() => buildGraph([ok, ok], catalogue), /invalid/, 'the build stops on invalid data');
});

test('every WORKOS link an author wrote in a READOS book has an approved relationship', () => {
  const base = join(ROOT, 'src', 'content', 'reados-publications');
  const missing: string[] = [];
  for (const book of readdirSync(base)) {
    const files = [join(base, book, 'book.md')];
    try { for (const c of readdirSync(join(base, book, 'chapters'))) files.push(join(base, book, 'chapters', c)); } catch { /* no chapters */ }
    for (const f of files) {
      let text = '';
      try { text = readFileSync(f, 'utf8'); } catch { continue; }
      for (const m of text.matchAll(/\]\(\/tools\/(?:\?tool=)?([a-z0-9-]+)\/?\)/g)) {
        const ok = links.some((l) => l.reados === `publication/${book}` && l.tool === m[1] && l.status === 'approved' && l.evidence === 'book-link');
        if (!ok) missing.push(`${book}: ${m[1]}`);
      }
    }
  }
  assert.deepEqual([...new Set(missing)], [], 'add a book-link relationship to src/data/knowledge-links.json');
});

test('routes: chapter and tool links point at pages the site builds', () => {
  for (const x of graph.live.flatMap((l) => graph.toolsFor(l.reados))) assert.match(x.tool.href, /^\/tools\/(\?tool=[a-z0-9-]+|[a-z0-9-]+\/)$/);
  for (const id of new Set(graph.live.map((l) => l.tool))) {
    for (const r of graph.readingsFor(id)) {
      assert.match(r.book.href, /^\/reados\/(publications|collections)\/[a-z0-9-]+\/$/);
      for (const c of r.chapters) assert.ok(c.href.startsWith(r.book.href.replace(/-part-\d+\/$/, '')), `${c.href} is inside ${r.book.href}`);
    }
  }
});

test('suggestions are a separate review file that the site never publishes', () => {
  const s = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'knowledge-link-suggestions.json'), 'utf8'));
  assert.ok(Array.isArray(s.suggestions));
  for (const x of s.suggestions) assert.equal(x.status, 'suggested');
  const decided = new Set(links.map((l) => `${l.reados}|${l.tool}`));
  for (const x of s.suggestions) assert.ok(!decided.has(`${x.reados}|${x.tool}`), `${x.reados} → ${x.tool} is already decided`);
  const srcFiles = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? srcFiles(join(dir, d.name)) : [join(dir, d.name)]));
  for (const f of srcFiles(join(ROOT, 'src')).filter((f) => /\.(ts|astro|js)$/.test(f))) assert.doesNotMatch(readFileSync(f, 'utf8'), /knowledge-link-suggestions/, `${f} must not read suggestions`);
});

test('learning pathways use approved relationships and published pages only', () => {
  const pathways = readPathways();
  assert.ok(pathways.length >= 3);
  assert.deepEqual(validatePathways(pathways, links, catalogue), []);
  const p0 = pathways[0];
  const unlinked = [...catalogue.tools.keys()].find((t) => !links.some((l) => l.reados === p0.learn.reados && l.chapter === p0.learn.chapter && l.tool === t))!;
  const bad = validatePathways([{ ...p0, id: 'probe', apply: { tool: unlinked } }], links, catalogue);
  assert.ok(bad.some((p) => p.includes('not an approved relationship')), 'a pathway cannot invent a link');
});

test('every READOS category has a discovery decision for books without connections', () => {
  assert.deepEqual(Object.keys(DISCOVERY_TOPIC).sort(), [...CATEGORY_SLUGS].sort());
});

test('the calculator shows the readings for the open tool from /tools/knowledge.json', async () => {
  const read = (n: string) => readFileSync(join(ROOT, 'public', 'tools', n), 'utf8');
  const els = new Map<string, any>();
  const element = (sel: string) => {
    if (!els.has(sel)) els.set(sel, { innerHTML: '', textContent: '', hidden: false, dataset: {}, classList: { add() {}, remove() {} }, addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], getBoundingClientRect: () => ({ top: 0, bottom: 0 }), scrollIntoView() {} });
    return els.get(sel);
  };
  const id = graph.live[0].tool;
  const map = { [id]: graph.readingsFor(id).map((r) => ({ title: r.chapters[0]?.title ?? r.book.title, href: r.chapters[0]?.href ?? r.book.href, book: r.book.title, bookHref: r.book.href, kind: r.book.kind, label: r.label, learn: r.learn })) };
  let fetched = '';
  const ctx: any = createContext({
    window: { addEventListener() {} }, console, URL, URLSearchParams, setTimeout, clearTimeout, history: { pushState() {} }, navigator: {},
    location: new URL(`https://kevos.com/tools/?tool=${id}`),
    document: { title: '', querySelector: (s: string) => (/\[name=|\[data-range/.test(s) ? null : element(s)), querySelectorAll: () => [], createElement: () => ({}) },
    fetch: async (u: string) => { fetched = u; return { ok: true, json: async () => map }; },
  });
  const loader = readFileSync(join(ROOT, 'src', 'utils', 'workos-tools.ts'), 'utf8');
  const FILES = /export const TOOL_FILES = \[([^\]]+)\]/.exec(loader)![1].match(/'([a-z0-9]+)'/g)!.map((s) => s.slice(1, -1));
  for (const kind of ['data', 'guides']) for (const f of FILES) runInContext(read(`${kind}-${f}.js`), ctx);
  runInContext(read('core.js'), ctx);
  for (const f of FILES) runInContext(read(`calc-${f}.js`), ctx);
  runInContext(read('ui.js'), ctx);
  await new Promise((r) => setTimeout(r, 0));
  assert.equal(fetched, '/tools/knowledge.json');
  const html: string = element('#tool-learn').innerHTML;
  assert.match(html, /Learn the Concepts Behind This Tool/);
  for (const r of map[id]) assert.ok(html.includes(r.href), `links to ${r.href}`);
  assert.equal(ctx.window.WORKOS_UI.state().t.id, id, 'the calculator still works');
});
