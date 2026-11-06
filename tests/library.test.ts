import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { editDistance, highlightParts, indexDoc, normalize, queryTokens, scoreDoc, search } from '../src/utils/library-search.ts';
import { WORKOS_TOPICS, groupToolsByTopic, subcategorySlug, topicForCategory } from '../src/utils/workos-topics.ts';
import { loadWorkosTools } from '../src/utils/workos-tools.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const doc = (title: string, extra: Partial<{ tags: string; body: string; extra: string }> = {}) => ({ title, index: indexDoc({ title, ...extra }) });

// ---------------------------------------------------------------- Search engine

test('search is case-insensitive, accent-insensitive and matches word starts', () => {
  assert.equal(normalize('V-Belt Drive® Café'), 'v belt drive cafe');
  const gear = doc('Spur Gear Geometry');
  assert.ok(scoreDoc('SPUR GEAR', gear.index) > 0);
  assert.ok(scoreDoc('geom', gear.index) > 0, 'partial word');
  assert.ok(scoreDoc('load', doc('Bolt Preload').index) > 0, 'inside a longer word');
  assert.equal(scoreDoc('ear', gear.index), 0, 'short fragments must start a word');
  assert.equal(scoreDoc('pump', gear.index), 0);
});

test('every query word must match, and filler words are ignored', () => {
  const d = doc('Hydraulic Cylinder Force', { tags: 'Hydraulics' });
  assert.ok(scoreDoc('how to calculate cylinder force', d.index) > 0);
  assert.equal(scoreDoc('cylinder torque', d.index), 0);
  assert.deepEqual(queryTokens('the of'), ['the', 'of'], 'a query of only filler words is kept');
});

test('minor typos still find the right item', () => {
  assert.equal(editDistance('presure', 'pressure', 1), 1);
  assert.equal(editDistance('gaer', 'gear', 1), 1, 'transposition counts as one edit');
  assert.ok(editDistance('gear', 'pump', 1) > 1);
  assert.ok(scoreDoc('presure', doc('Pressure Drop in Pipes').index) > 0);
  assert.ok(scoreDoc('bering life', doc('Bearing L10 Life').index) > 0);
  assert.ok(scoreDoc('tolerence', doc('Tolerance Stack').index) > 0);
});

test('engineering synonyms widen the search without matching inside unrelated words', () => {
  assert.ok(scoreDoc('bolt', doc('Fastener Preload and Torque').index) > 0);
  assert.ok(scoreDoc('rpm', doc('Cutting Speed', { body: 'spindle speed from surface speed' }).index) > 0);
  assert.ok(scoreDoc('psi', doc('Pressure Drop in Pipes').index) > 0);
  assert.equal(scoreDoc('ram', doc('Program Evaluation').index), 0, '"ram" is not "program"');
});

test('ranking puts title matches first and keeps ties in their original order', () => {
  const items = [doc('Pump Power', { body: 'gear pump' }), doc('Gear Ratio'), doc('Gear Backlash'), doc('Belt Length')];
  const ranked = search('gear', items).map((r) => r.item.index.title);
  assert.deepEqual(ranked, ['gear ratio', 'gear backlash', 'pump power']);
  assert.deepEqual(search('', items), []);
  // Words found together outrank the same words scattered across tags and summary.
  const books = [doc('Setting Up a Welding Shop', { tags: 'cash', body: 'heat flow and floor space' }), doc('Reading Financial Statements', { body: 'the cash flow statement' })];
  assert.equal(search('cash flow', books)[0].item.index.title, 'reading financial statements');
});

test('highlighting splits text into parts and never produces markup', () => {
  const parts = highlightParts('Gear <b>ratio</b> & gearing', 'gear');
  assert.deepEqual(parts.filter((p) => p.mark).map((p) => p.text), ['Gear', 'gear']);
  assert.equal(parts.map((p) => p.text).join(''), 'Gear <b>ratio</b> & gearing', 'text is returned unchanged for text nodes');
  assert.deepEqual(highlightParts('Gear', ''), [{ text: 'Gear', mark: false }]);
});

test('the browser script builds highlights with text nodes only', () => {
  const script = read('src/scripts/library-browser.ts');
  assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML|outerHTML/);
  assert.match(script, /createTextNode/);
});

// ---------------------------------------------------------------- WORKOS taxonomy

test('every WORKOS tool belongs to exactly one topic, and counts come from the register', () => {
  const { tools } = loadWorkosTools();
  const categories = new Set(tools.map((t) => t.category));
  for (const c of categories) assert.ok(topicForCategory(c), `${c} has a topic`);
  const all = WORKOS_TOPICS.flatMap((t) => t.categories);
  assert.equal(new Set(all).size, all.length, 'no category is in two topics');
  const topics = groupToolsByTopic(tools, 6);
  const ids = topics.flatMap((t) => t.items.map((i) => i.id));
  assert.equal(ids.length, tools.length, 'every tool is listed once');
  assert.equal(new Set(ids).size, tools.length);
  for (const t of topics) {
    assert.equal(t.subs.reduce((n, s) => n + s.count, 0), t.items.length, `${t.name} subcategory counts add up`);
    assert.ok(t.preview.size === Math.min(6, t.items.length), `${t.name} previews up to six tools`);
    if (t.subs.length > 1) assert.ok(t.subs.every((s) => t.items.some((i) => t.preview.has(i.id) && subcategorySlug(i.category) === s.slug)), `${t.name} preview spans its subcategories`);
  }
  assert.throws(() => topicForCategory('Nonexistent'), /no topic/);
});

// ---------------------------------------------------------------- Shared page structure

test('WORKOS and READOS share the same hero, search, topic grid and sections', () => {
  const workos = read('src/pages/tools/index.astro');
  const reados = read('src/pages/reados/index.astro');
  for (const page of [workos, reados]) {
    for (const part of ['<LibraryHero', '<LibraryBrowser', '<LibrarySection', "import '../../styles/library.css'", '<details class="lib-about"']) assert.ok(page.includes(part), part);
    assert.doesNotMatch(page, /<Hero\b|tools-pill|class="chips"/, 'no large hero, badge row or tag cloud');
    assert.match(page, /<LearningPlanner slot="planner"/, 'the header holds the learning-path box (no animation since 2 Nov 2026)');
    assert.match(page, /<DiscoveryResults \/>/);
    assert.match(page, /import '\.\.\/\.\.\/scripts\/discovery\.ts';/);
  }
  assert.match(workos, /title="Tools"\s+description="Practical engineering, manufacturing and business tools to calculate, analyse and make better decisions\."/);
  assert.match(workos, /placeholder="Search BIZOMAT tools\.\.\."/);
  assert.match(reados, /title="Library"\s+description="Practical books and guides covering engineering, manufacturing, operations, projects and business\."/);
  assert.match(reados, /placeholder="Search Library books\.\.\."/);
  // Counts are derived at build time, never typed into copy.
  for (const page of [workos, reados]) assert.doesNotMatch(page, /\b\d{2,} (tools|books)\b/);
  assert.match(workos, /total=\{tools\.length\}/);
});

test('the library search is labelled, clearable and keeps its state in the URL', () => {
  const search = read('src/components/library/LibrarySearch.astro');
  assert.match(search, /role="search"/);
  assert.match(search, /<label class="visually-hidden" for="lib-search-input">/);
  assert.match(search, /name="q"/, 'works without JavaScript through ?q=');
  assert.match(search, /aria-label="Clear search"/);
  assert.match(search, /aria-live="polite"/);
  const script = read('src/scripts/library-browser.ts');
  for (const key of ["'q'", "'topic'", "'sub'", 'popstate', 'pushState', 'replaceState', 'ArrowDown', 'Escape']) assert.ok(script.includes(key.replace(/'/g, '')) || script.includes(key), key);
});

test('the WORKOS calculator still opens in place from any card and returns to the same view', () => {
  const ui = read('public/tools/ui.js');
  assert.match(ui, /directory\.addEventListener\('click'/, 'cards in topics and in search results open the calculator');
  assert.match(ui, /\[data-library-intro\]/);
  assert.match(ui, /history\.back\(\)/);
  assert.doesNotMatch(ui, /renderCards|data-cat/);
});
