import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadWorkosTools } from '../src/utils/workos-tools.ts';
import { HOME_DISCOVERY_EXAMPLES, HOME_ERP_GROUPS, HOME_FEATURED_BOOKS, HOME_FEATURED_TOOLS, HOME_LEARN_STARTS } from '../src/config/home.ts';
import { WORKFLOWS, guideById } from '../src/data/learn/index.ts';
import { NAV, SITE } from '../src/config/site.ts';
import { PRODUCTS, SOLUTIONS } from '../src/config/products.ts';
import { SYSTEMS } from '../src/config/systems.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const home = read('src/pages/index.astro');

// BIZOMAT homepage: the corporate slogan "Connecting Intelligence. Empowering Progress." (owner, 8 Nov 2026; it replaced
// "Automate work. Connect systems. Get business done." of 5 Nov). Redesigned around BIZOMAT ERP and learning it (owner's
// brief of 20 Nov 2026): the hero with Open BIZOMAT ERP, Explore modules, Learn BIZOMAT and Tools and Resources; the
// Knowledge Centre's search and where to start; the ERP's modules; then the systems, AI Search, proof, tools and the Library.
test('the homepage leads with the BIZOMAT message, then learning, the ERP modules, systems, AI search, proof, tools and resources', () => {
  assert.match(home, /<p class="bz-eyebrow">\{SITE\.tagline\}<\/p>/);
  assert.match(home, /<h1 id="home-title"><span class="home-hero__line">Connecting Intelligence\.<\/span> <span class="home-hero__line">Empowering Progress\.<\/span><\/h1>/);
  assert.match(home, /<p class="home-hero__lead">\{SITE\.introduction\}<\/p>/);
  assert.equal(SITE.tagline, 'Business Intelligence & Automation');
  assert.equal(SITE.statement, 'Connecting Intelligence. Empowering Progress.');
  assert.equal(SITE.support, 'Technology Connected. Progress Delivered.');
  // The hero's four ways in.
  const hero = home.slice(home.indexOf('<section class="home-hero"'), home.indexOf('<section class="home-learn"'));
  assert.match(hero, /<Button href=\{APP_LINKS\.erp\.home\} variant="accent" rel="noopener" data-cta="home-open-erp">Open BIZOMAT ERP<\/Button>/);
  assert.match(hero, /<Button href="#modules"[^>]*>Explore modules<\/Button>/);
  assert.match(hero, /<Button href=\{LEARN_HOME\}[^>]*>Learn BIZOMAT<\/Button>/);
  assert.match(hero, /<Button href="#tools"[^>]*>Tools and Resources<\/Button>/);
  assert.match(home, /<ConnectedOps id="hero-ops" \/>/, 'the hero shows connected operations');
  const order = ['home-title', 'id="learn"', 'id="modules"', 'id="products"', 'id="ai-search"', '<DiscoveryResults />', 'id="proof-title"', 'id="tools"', 'id="resources"'].map((m) => home.indexOf(m));
  assert.ok(order.every((n, i) => n > 0 && (i === 0 || n > order[i - 1])), 'sections in the agreed order');
  // The learning entry: the question the brief asked for, the Knowledge Centre's own search (it opens /learn/?q= and
  // works without JavaScript) and where to start, by who you are.
  assert.match(home, /<h2 id="learn-title">Need help using BIZOMAT\?<\/h2>/);
  assert.match(home, /Find a tutorial, search a question, or learn any module\./);
  assert.match(home, /<LearnSearch \/>/);
  assert.match(read('src/components/learn/LearnSearch.astro'), /<form action="\/learn\/" method="get"/);
  assert.match(home, /HOME_LEARN_STARTS\.map/);
  assert.match(home, /<h2 id="ai-title">Ask BIZOMAT<\/h2>/);
  assert.match(home, /<Button href="\/tools\/" arrow data-cta="home-tools">Explore Tools<\/Button>/);
  assert.match(home, /<Button href="\/reados\/" arrow data-cta="home-library">Explore Library<\/Button>/);
  assert.match(home, /<form class="home-search" role="search" action="\/tools\/" method="get">/, 'tool search works without JavaScript');
  assert.equal(SITE.title, 'BIZOMAT | Business Intelligence & Automation');
  assert.deepEqual(NAV.map((n) => n.label), ['Home', 'Systems', 'Learn', 'Resources', 'About', 'Contact']);
  assert.deepEqual(NAV.map((n) => n.href), ['/', '/systems/', '/learn/', '/resources/', '/engine-room/', '/contact/']);
});

test('the ERP modules on the homepage are the module rail\'s own, each with its guide and honest status', () => {
  const rail = read('apps/work/src/client/components/layout/SuiteRail.tsx');
  const railLabels = [...rail.matchAll(/\{ id: '[a-z-]+', label: '([^']+)'/g)].map((m) => m[1]);
  for (const g of HOME_ERP_GROUPS) {
    assert.ok(railLabels.includes(g.rail), `${g.rail} is a label of the module rail`);
    for (const id of g.guides) {
      const guide = guideById(id);
      assert.ok(guide, `${g.rail}: guide ${id} exists`);
    }
  }
  // Every group of the rail, apart from My Work (a person's own tasks) and Company Admin (behind a flag that ships off).
  assert.ok(railLabels.filter((l) => l !== 'My Work' && l !== 'Company Admin').every((l) => HOME_ERP_GROUPS.some((g) => g.rail === l)), 'every module group of the rail is shown');
  // A module that is not built says so: the status comes from the guide, never from the homepage.
  assert.match(home, /g\.status !== 'live' && g\.status !== 'connected' \? <StatusLabel status=\{g\.status\} \/>/);
  for (const s of HOME_LEARN_STARTS) {
    const m = s.href.match(/^\/learn\/#(workflow-)?([a-z0-9-]+)$/);
    if (m) assert.ok(m[1] ? WORKFLOWS.some((w) => w.id === m[2]) : guideById(m[2]), `${s.who}: ${s.href} is a real guide`);
    else assert.equal(s.href, '/resources/');
  }
});

test('products are described from the catalogue, and every product action leads to a real page', () => {
  assert.deepEqual(PRODUCTS.map((p) => [p.id, p.name, p.status, p.url, p.signIn]), [
    ['erp', 'ERP', 'available', '/systems/#erp', true],
    ['cad', 'Engineering Automation', 'available', '/systems/#engineering', true],
    ['work', 'Projects', 'available', '/systems/#projects', true],
    ['crm', 'Customer Relationship Management', 'available', '/systems/#crm', true],
    ['finance', 'Finance', 'available', '/systems/#finance', true],
    ['resources', 'Resources', 'available', '/resources/', false],
  ]);
  assert.deepEqual(PRODUCTS.map((p) => p.formerly), ['BIZOMAT System', 'CAD Automation (CADOS)', 'Project Management (KEVOS Work)', undefined, undefined, undefined], 'former names are stated for people who know them');
  // Every system is a section of the one Systems page (owner, 20 Nov 2026), with its full content in a toggle there.
  const systemsPage = read('src/pages/systems/index.astro');
  for (const p of PRODUCTS) {
    const sid = p.url!.match(/^\/systems\/#([a-z]+)$/)?.[1];
    if (sid) assert.ok(SYSTEMS.some((s) => s.id === sid) && /FULL\[s\.id\]/.test(systemsPage), `${p.url} is a section of /systems/`);
    else assert.ok(read(`src/pages/${p.url!.replace(/^\/|\/$/g, '')}/index.astro`).length > 0, `${p.url} exists`);
  }
  for (const s of SOLUTIONS) for (const path of s.paths) {
    assert.ok(/^\/(tools|reados|contact|systems)\//.test(path.href), `${s.id}: ${path.href} is a real page`);
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
