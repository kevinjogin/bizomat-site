import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadWorkosTools } from '../src/utils/workos-tools.ts';
import { HOME_DISCOVERY_EXAMPLES, HOME_FEATURED_BOOKS, HOME_FEATURED_TOOLS } from '../src/config/home.ts';
import { NAV, SITE } from '../src/config/site.ts';
import { PRODUCTS, SOLUTIONS } from '../src/config/products.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const home = read('src/pages/index.astro');

// BIZOMAT homepage (5 Nov 2026): "Automate work. Connect systems. Get business done." Hero with Explore Products and
// Explore AI Tools, then the three products, AI Search, proof, tools and the Library.
test('the homepage leads with the BIZOMAT message, then products, AI search, proof, tools and resources', () => {
  assert.match(home, /<p class="bz-eyebrow">Intelligent Business Automation Platform<\/p>/);
  assert.match(home, /<h1 id="home-title">Automate work\. Connect systems\. Get business done\.<\/h1>/);
  assert.match(home, />Explore Products<\/Button>/);
  assert.match(home, />Explore AI Tools<\/Button>/);
  assert.match(home, /<ConnectedOps id="hero-ops" \/>/, 'the hero shows connected operations');
  const order = ['home-title', 'id="products"', 'id="ai-search"', '<DiscoveryResults />', 'id="proof-title"', 'id="tools"', 'id="resources"'].map((m) => home.indexOf(m));
  assert.ok(order.every((n, i) => n > 0 && (i === 0 || n > order[i - 1])), 'sections in the agreed order');
  assert.match(home, /<h2 id="ai-title">Ask BIZOMAT<\/h2>/);
  assert.match(home, /<Button href="\/tools\/" arrow data-cta="home-tools">Explore Tools<\/Button>/);
  assert.match(home, /<Button href="\/reados\/" arrow data-cta="home-library">Explore Library<\/Button>/);
  assert.match(home, /<form class="home-search" role="search" action="\/tools\/" method="get">/, 'tool search works without JavaScript');
  assert.equal(SITE.title, 'BIZOMAT | Intelligent Business Automation Platform');
  assert.deepEqual(NAV.map((n) => n.label), ['CAD Automation', 'Project Management', 'Resources', 'Proof of Work', 'About']);
  assert.deepEqual(NAV.map((n) => n.href), ['/cad/', '/work/', '/resources/', '/proof-of-work/', '/about/']);
});

test('products are described from the catalogue, and every product action leads to a real page', () => {
  assert.deepEqual(PRODUCTS.map((p) => [p.id, p.name, p.status, p.url, p.signIn]), [
    ['cad', 'CAD Automation', 'available', '/cad/', true],
    ['work', 'Project Management', 'available', '/work/', true],
    ['resources', 'Resources', 'available', '/resources/', false],
  ]);
  assert.deepEqual(PRODUCTS.map((p) => p.formerly), ['CADOS', 'KEVOS Work', undefined], 'former names are stated for people who know them');
  for (const p of PRODUCTS) assert.ok(read(`src/pages/${p.url!.replace(/^\/|\/$/g, '')}${p.id === 'resources' ? '/index' : ''}.astro`).length > 0, `${p.url} exists`);
  for (const s of SOLUTIONS) for (const path of s.paths) {
    assert.ok(/^\/(tools|reados|contact|cad|work)\//.test(path.href), `${s.id}: ${path.href} is a real page`);
  }
  const text = JSON.stringify([PRODUCTS, SOLUTIONS]);
  assert.doesNotMatch(text, /\d+\s*%|customers? (say|love)|testimonial|trusted by/i, 'no invented statistics or testimonials');
});

test('the homepage carries no service packages, pricing or fixed-scope offers', () => {
  for (const banned of ['PackageGrid', 'FactoryFixFeature', 'AssessmentFeature', 'PACKAGES', 'PRICING_NOTE', 'A$', 'hourly', 'Discuss Your Requirements']) {
    assert.ok(!home.includes(banned), `homepage still mentions ${banned}`);
  }
  assert.ok(!NAV.some((n) => /services|pricing|assessment|factory-fix/.test(n.href)), 'no service links in the main navigation');
  // The service pages themselves stay.
  for (const page of ['services.astro', 'factory-fix.astro', 'assessment/index.astro']) assert.ok(read(`src/pages/${page}`).length > 0);
});

test('homepage counts come from the catalogues, never from fixed numbers', () => {
  assert.match(home, /fmt\(tools\.length\)/);
  assert.match(home, /fmt\(bookTotal\)/);
  assert.match(home, /fmt\(chapterTotal\)/);
  assert.match(home, /knowledgeGraph\(\)\.live\.length/);
  assert.match(home, /fmt\(connections\)/);
  assert.match(home, /String\(CAD\.toolCount\)/, 'the proof counts come from the catalogue');
  assert.match(home, /String\(WORK\.views\.length\)/);
  const markup = home.slice(home.indexOf('<BaseLayout'), home.indexOf('<script>'));
  assert.doesNotMatch(markup, />\s*\d{2,}\s*(tools|books|chapters)\b/i, 'no hand-typed catalogue counts');
});

test('featured tools and books name real records', () => {
  const { tools } = loadWorkosTools();
  for (const id of HOME_FEATURED_TOOLS) assert.ok(tools.some((t) => t.id === id), `no WORKOS tool ${id}`);
  for (const id of HOME_FEATURED_BOOKS) {
    assert.match(id, /^(publication|collection|guide)-[a-z0-9-]+$/);
    const [, kind, slug] = id.match(/^(publication|collection|guide)-(.+)$/)!;
    if (kind === 'publication') assert.ok(read(`src/content/reados-publications/${slug}/book.md`).length > 0, `no READOS book ${slug}`);
    if (kind === 'collection') assert.ok(read('src/utils/reados-collections.ts').includes(`slug:'${slug}'`), `no READOS collection ${slug}`);
  }
});

test('discovery is a working feature with a no-JavaScript fallback, and no planned-only placeholder remains', () => {
  const box = read('src/components/discovery/DiscoveryBox.astro');
  assert.match(box, /<form class:list=\{\['dq', `dq--\$\{size\}`\]\} role="search" action="\/search\/" method="get"/, 'without JavaScript the box is a site search');
  assert.match(box, /data-discover-autorun=/, 'only a page that asks for it runs ?q= on load');
  assert.match(box, /<textarea id="discover-question" name="q"/);
  assert.match(home, /import '\.\.\/scripts\/discovery\.ts';/);
  assert.match(home, /<DiscoveryResults \/>/);
  assert.doesNotMatch(home, /flow__step--planned|Not yet available/);
  assert.equal(SITE.assistant.enabled, false, 'the floating assistant is retired; the discovery box replaces it');
  assert.doesNotMatch(home, /HomeResourceVisual|home-workos-search/, 'one hero: no second product hero under it');
  assert.deepEqual(HOME_DISCOVERY_EXAMPLES.map((e) => e.question), ['Find a tool to calculate engineering dimensions.', 'How can I automate SolidWorks?', 'Show me project management capabilities.', 'Find guides about business automation.']);
  assert.match(home, /It searches public pages only, never anyone's projects or files\./, 'the box says plainly what it searches');
  assert.match(read('src/components/discovery/DiscoveryExamples.astro'), /data-discover-query=\{s\.question\}/);
  assert.match(read('src/scripts/discovery.ts'), /b\.dataset\.discoverQuery/);
});
