import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadWorkosTools } from '../src/utils/workos-tools.ts';
import { WORKOS_TOPICS } from '../src/utils/workos-topics.ts';
import { HOME_DISCOVERY_EXAMPLES, HOME_FEATURED_BOOKS, HOME_FEATURED_TOOLS, HOME_ORBIT } from '../src/config/home.ts';
import { NAV, SITE } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const home = read('src/pages/index.astro');

test('the homepage leads with discovery, then WORKOS and READOS', () => {
  assert.match(home, /<h1 id="home-title">What would you like to <em>solve<\/em> today\?<\/h1>/);
  assert.match(home, /<DiscoveryBox suggestions=\{HOME_DISCOVERY_EXAMPLES\} \/>/);
  assert.ok(home.indexOf('<DiscoveryBox') < home.indexOf('data-cta="hero-workos"'), 'the question box comes first in the hero');
  assert.match(home, /<Button href="\/tools\/" arrow data-cta="hero-workos">Explore WORKOS<\/Button>/);
  assert.match(home, /<Button href="\/reados\/" variant="secondary" data-cta="hero-reados">Explore READOS<\/Button>/);
  for (const id of ['workos', 'reados']) assert.match(home, new RegExp(`<div class="home-lib" id="${id}"`), `${id} sits in the side-by-side block under the hero`);
  assert.ok(home.indexOf('id="workos"') < home.indexOf('id="reados"') && home.indexOf('class="home-libs"') > home.indexOf('<DiscoveryResults />'));
  assert.match(home, /\.home-libs__grid\)\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, 'side by side on larger screens');
  assert.match(home, /@media\(max-width:760px\)\{:global\(\.home-libs__grid\)\{grid-template-columns:1fr\}\}/, 'stacked on phones');
  for (const id of ['connected', 'about']) assert.match(home, new RegExp(`<Section [^>]*id="${id}"`));
  assert.equal(SITE.title, 'KEVOS® | Engineering Tools, Technical Knowledge & Technology');
  assert.deepEqual(NAV.map((n) => n.href), ['/tools/', '/reados/', '/about/', '/contact/']);
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
  const markup = home.slice(home.indexOf('<BaseLayout'), home.indexOf('<script>'));
  assert.doesNotMatch(markup, />\s*\d{2,}\s*(tools|books|chapters)\b/i, 'no hand-typed catalogue counts');
});

test('featured tools, books and orbit nodes name real records', () => {
  const { tools } = loadWorkosTools();
  for (const id of HOME_FEATURED_TOOLS) assert.ok(tools.some((t) => t.id === id), `no WORKOS tool ${id}`);
  for (const id of HOME_FEATURED_BOOKS) {
    assert.match(id, /^(publication|collection|guide)-[a-z0-9-]+$/);
    const [, kind, slug] = id.match(/^(publication|collection|guide)-(.+)$/)!;
    if (kind === 'publication') assert.ok(read(`src/content/reados-publications/${slug}/book.md`).length > 0, `no READOS book ${slug}`);
    if (kind === 'collection') assert.ok(read('src/utils/reados-collections.ts').includes(`slug:'${slug}'`), `no READOS collection ${slug}`);
  }
  assert.equal(HOME_ORBIT.length, 4);
  for (const o of HOME_ORBIT) assert.ok(WORKOS_TOPICS.some((t) => t.slug === o.topic), `no WORKOS topic ${o.topic}`);
});

test('discovery is a working feature with a no-JavaScript fallback, and no planned-only placeholder remains', () => {
  const box = read('src/components/discovery/DiscoveryBox.astro');
  assert.match(box, /<form class="dq" role="search" action="\/search\/" method="get"/, 'without JavaScript the box is a site search');
  assert.match(box, /<textarea id="discover-question" name="q"/);
  assert.match(home, /import '\.\.\/scripts\/discovery\.ts';/);
  assert.match(home, /<DiscoveryResults \/>/);
  assert.doesNotMatch(home, /flow__step--planned|Not yet available/);
  assert.equal(SITE.assistant.enabled, false, 'the floating assistant is retired; the discovery box replaces it');
  assert.doesNotMatch(home, /class="product"|HomeResourceVisual|home-workos-search/, 'one hero: no second product hero under it');
  assert.equal(HOME_DISCOVERY_EXAMPLES.length, 6);
});
