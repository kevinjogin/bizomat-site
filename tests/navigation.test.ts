import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CRUMB, FOOTER_NAV, GET_STARTED, NAV, QUOTE_CTA } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts|md|mdx)$/.test(f) ? [p] : []; });

// KEVOS 2.0 redesign (owner brief, 5 Nov 2026): Products | Solutions | Tools | Resources | About, and Get Started.
test('the main navigation reads Products, Solutions, Tools, Resources, About, with short menus', () => {
  assert.deepEqual(NAV.map((n) => [n.label, n.href]), [['Products', '/products/'], ['Solutions', '/solutions/'], ['Tools', '/tools/'], ['Resources', '/resources/'], ['About', '/about/']]);
  const menu = (label: string) => (NAV.find((n) => n.label === label)?.children ?? []).map((c) => [c.label, c.href]);
  assert.deepEqual(menu('Products'), [['Work', 'https://work.kevos.com/'], ['CADOS', 'https://cados.kevos.com/'], ['Desk', undefined], ['All products', '/products/']]);
  assert.equal(NAV[0].children?.find((c) => c.label === 'Desk')?.status, 'Coming soon', 'Desk is labelled, never linked');
  assert.deepEqual(menu('Resources'), [['Library', '/reados/'], ['Guides and articles', '/library/'], ['All resources', '/resources/']]);
  assert.deepEqual(menu('About'), [['Company', '/about/'], ['Contact', '/contact/']]);
  assert.deepEqual(menu('Solutions').map(([, h]) => h), ['/solutions/#business-productivity', '/solutions/#engineering-design', '/solutions/#automation-workflows', '/solutions/']);
  assert.deepEqual(GET_STARTED, { href: '/#ask', label: 'Get Started' });
  assert.deepEqual(CRUMB, { tools: 'Tools', library: 'Library' });
  assert.deepEqual(QUOTE_CTA, { href: '/contact/', label: 'Contact' });
  // One list serves desktop, tablet and mobile; menus work without JavaScript (<details>).
  const header = read('src/components/Header.astro');
  assert.match(header, /NAV\.map/);
  assert.match(header, /<details class="nav-menu"/);
  assert.match(header, /GET_STARTED\.label/);
  assert.match(header, /aria-expanded="false" data-nav-toggle/);
  for (const page of ['products.astro', 'solutions.astro', 'resources/index.astro', 'about.astro', 'contact/index.astro', 'library/index.astro', 'reados/index.astro', 'tools/index.astro']) assert.ok(read(`src/pages/${page}`).length > 0, `${page} exists`);
});

test('the footer covers products, solutions, resources and company, and "Guides" alone is not a navigation label', () => {
  const pairs = [...FOOTER_NAV.products, ...FOOTER_NAV.solutions, ...FOOTER_NAV.resources, ...FOOTER_NAV.company, ...FOOTER_NAV.legal].map((n) => [n.label, n.href]);
  for (const pair of [['Work', 'https://work.kevos.com/'], ['CADOS', 'https://cados.kevos.com/'], ['Tools', '/tools/'], ['Library', '/reados/'], ['About', '/about/'], ['Contact', '/contact/'], ['Privacy', '/privacy/'], ['Terms', '/terms/']]) {
    assert.ok(pairs.some(([l, h]) => l === pair[0] && h === pair[1]), `footer has ${pair[0]}`);
  }
  assert.ok(!pairs.some(([l]) => l === 'Desk'), 'Desk is not a footer link while it is coming soon');
  const labels = [...NAV, ...NAV.flatMap((n) => n.children ?? []), ...pairs.map(([label]) => ({ label }))].map((n) => n.label);
  for (const old of ['WORKOS', 'READOS', 'REACHOS', 'Guides']) assert.ok(!labels.includes(old as never), `no "${old}" navigation label`);
  const footer = read('src/components/Footer.astro');
  for (const h of ['Products', 'Solutions', 'Resources', 'Company']) assert.match(footer, new RegExp(`<h2 class="site-footer__heading">${h}</h2>`));
});

test('breadcrumbs say Tools and Library, never WORKOS or READOS', () => {
  const offenders = walk(join(process.cwd(), 'src')).filter((f) => /label: ?'(WORKOS|READOS)'/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, []);
  assert.match(read('src/pages/tools/[tool].astro'), /aria-label="Breadcrumb"><a href="\/tools\/">← All tools<\/a>/);
  for (const page of ['src/pages/tools/index.astro', 'src/pages/reados/index.astro']) assert.match(read(page), /label=\{CRUMB\.(tools|library)\}/, `${page}: the library browser trail uses the nav label`);
});

test('the Library page has its SEO title, and the names WORKOS and READOS are retired from visible text', () => {
  const page = read('src/pages/reados/index.astro');
  assert.match(page, /exactTitle="Engineering, Manufacturing & Business Knowledge Library \| KEVOS"/);
  assert.match(page, /The KEVOS® Library brings together/);
  assert.match(page, /title="Library"/);
  assert.match(read('src/pages/tools/index.astro'), /title="Tools"/);
});

test('outside their own pages, the libraries are called Tools and Library (no stray WORKOS / READOS / REACHOS labels)', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /<p class="eyebrow">Tools<\/p>/);
  assert.match(home, /<p class="eyebrow">Resources<\/p>/);
  assert.match(home, />Explore Tools<\/Button>/);
  assert.match(home, />Explore Library<\/Button>/);
  const markup = home.slice(home.indexOf('<BaseLayout'), home.indexOf('</BaseLayout>'));
  assert.doesNotMatch(markup, /WORKOS|READOS|REACHOS/, 'homepage markup uses the plain names');
  assert.ok(FOOTER_NAV.resources.some((n) => n.label === 'Library RSS feed' && n.href === '/rss.xml'));
  assert.match(read('src/pages/contact/index.astro'), /\{ label: 'Contact', href: '\/contact\/' \}/);
  for (const f of ['src/components/discovery/DiscoveryResults.astro', 'src/components/knowledge/ApplyInPractice.astro', 'src/components/knowledge/LearnConcepts.astro', 'src/components/ContactForm.astro', 'src/pages/about.astro', 'src/pages/search.astro', 'src/pages/contact/sent.astro', 'src/pages/products.astro', 'src/pages/solutions.astro', 'src/pages/resources/index.astro', 'src/config/products.ts']) {
    assert.doesNotMatch(read(f).replace(/\/\*[\s\S]*?\*\/|\/\/.*$|<!--[\s\S]*?-->/gm, ''), /WORKOS|READOS|REACHOS/, `${f} uses the plain names`);
  }
});

test('the names WORKOS and READOS no longer appear in visible text (books, chapters, tool texts, pages)', () => {
  const files = [...walk(join(process.cwd(), 'src/content')), ...walk(join(process.cwd(), 'src/pages')), ...walk(join(process.cwd(), 'src/components')),
    ...readdirSync(join(process.cwd(), 'public/tools')).filter((f) => /\.js$/.test(f)).map((f) => join(process.cwd(), 'public/tools', f))];
  // Allowed: internal identifiers such as window.WORKOS_GUIDES, name="WORKOS" or the collection value 'WORKOS'.
  const quoted = new RegExp(`(["'])(WORKOS|READOS)\\1`, 'g');
  const name = new RegExp('\\b(WORKOS|READOS)\\b(?!_)');
  const stray = files.filter((f) => name.test(readFileSync(f, 'utf8').replace(quoted, ''))).map((f) => f.replace(process.cwd() + '/', ''));
  assert.deepEqual(stray, []);
});
