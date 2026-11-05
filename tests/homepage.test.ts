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

// KEVOS 2.0 redesign (owner brief, 5 Nov 2026): "Make difficult work simple." Hero with Ask KEVOS, then products,
// solutions, tools and resources.
test('the homepage leads with the KEVOS message and the Ask KEVOS box, then products, solutions, tools and resources', () => {
  assert.match(home, /<p class="eyebrow home-hero__label">Intelligence by KEVOS<\/p>/);
  assert.match(home, /<h1 id="home-title">Make difficult work simple\.<\/h1>/);
  assert.match(home, /Tell us what you need\. We'll help you get it done\./);
  assert.match(home, /placeholder="What would you like to accomplish today\?"/);
  assert.match(home, /submitLabel="Ask KEVOS"/);
  assert.match(home, /<DiscoveryExamples suggestions=\{HOME_DISCOVERY_EXAMPLES\}/);
  assert.doesNotMatch(home, /ServiceMap|home-hero__visual/, 'no animated picture beside the question');
  const order = ['id="ask"', '<DiscoveryResults />', 'id="products"', 'id="solutions"', 'id="tools"', 'id="resources"'].map((m) => home.indexOf(m));
  assert.ok(order.every((n, i) => n > 0 && (i === 0 || n > order[i - 1])), 'sections in the agreed order');
  assert.match(home, /<h2 id="products-title">Explore KEVOS<\/h2>/);
  assert.match(home, /<h2 id="tools-title">Useful tools\. Less complexity\.<\/h2>/);
  assert.match(home, /<h2 id="resources-title">Knowledge that moves you forward\.<\/h2>/);
  assert.match(home, /<Button href="\/tools\/" arrow data-cta="home-tools">Explore Tools<\/Button>/);
  assert.match(home, /<Button href="\/reados\/" arrow data-cta="home-library">Explore Library<\/Button>/);
  assert.match(home, /<form class="home-search" role="search" action="\/tools\/" method="get">/, 'tool search works without JavaScript');
  assert.equal(SITE.title, 'KEVOS® | Make Difficult Work Simple');
  assert.deepEqual(NAV.map((n) => n.href), ['/products/', '/solutions/', '/tools/', '/resources/', '/about/']);
});

test('products are described only as stated, and a product that is not available is never linked', () => {
  assert.deepEqual(PRODUCTS.map((p) => [p.name, p.tagline, p.status, p.url]), [
    ['Work', 'Get more done. Work smarter.', 'available', 'https://work.kevos.com/'],
    ['CADOS', 'Engineering and CAD intelligence.', 'available', 'https://cados.kevos.com/'],
    ['Desk', 'Your desktop, working smarter.', 'soon', undefined],
  ]);
  assert.match(home, /\{p\.url\s*\?\s*<Button href=\{p\.url\}/, 'only a product with an address gets a launch button');
  for (const s of SOLUTIONS) for (const path of s.paths) {
    assert.ok(/^https:\/\/(work|cados)\.kevos\.com\/$/.test(path.href) || /^\/(tools|reados|contact)\//.test(path.href), `${s.id}: ${path.href} is a real page or an available product`);
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
  assert.deepEqual(HOME_DISCOVERY_EXAMPLES.map((e) => e.label), ['Analyse a document', 'Solve an engineering problem', 'Work with data', 'Automate a task']);
  assert.match(home, /It does not open your files or do the work for you\./, 'the box says plainly what it does not do');
  assert.match(read('src/components/discovery/DiscoveryExamples.astro'), /data-discover-query=\{s\.question\}/);
  assert.match(read('src/scripts/discovery.ts'), /b\.dataset\.discoverQuery/);
});
