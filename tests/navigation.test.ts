import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { AI_SEARCH, CRUMB, FOOTER_NAV, NAV, QUOTE_CTA, SIGN_IN } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts|md|mdx)$/.test(f) ? [p] : []; });

// BIZOMAT navigation (5 Nov 2026): CAD Automation | Project Management | Resources | Engine Room, with AI Search and a
// Sign in menu (one entry per application) on the right. The Engine Room joins what were About and Proof of Work
// (owner request, 5 Nov 2026). Customer Relationship Management joined on 13 Nov 2026 (owner request), spelled out, with
// "CRM" only where the header row is too narrow.
test('the main navigation reads CAD Automation, Project Management, Customer Relationship Management, Resources, Engine Room', () => {
  assert.deepEqual(NAV.map((n) => [n.label, n.href]), [['CAD Automation', '/cad-automation/'], ['Project Management', '/work/'], ['Customer Relationship Management', '/crm-platform/'], ['Resources', '/resources/'], ['Engine Room', '/engine-room/']]);
  assert.deepEqual(NAV.map((n) => n.short), [undefined, undefined, 'CRM', undefined, undefined]);
  const menu = (label: string) => (NAV.find((n) => n.label === label)?.children ?? []).map((c) => [c.label, c.href]);
  assert.deepEqual(menu('Resources'), [['Tools', '/tools/'], ['Library', '/reados/'], ['Guides and articles', '/library/'], ['Learning paths', '/resources/#pathways'], ['All resources', '/resources/']]);
  assert.deepEqual(menu('Customer Relationship Management'), [['Customer Relationship Management', '/crm-platform/'], ['User guide', '/crm-platform/guide/'], ['Open the CRM', 'https://bizomat.ai/crm/login']]);
  assert.deepEqual(menu('Engine Room'), [['The Engine Room', '/engine-room/'], ['From the founder', '/engine-room/#founder'], ['Test record', '/engine-room/#tests'], ['Products', '/products/'], ['Contact', '/contact/']]);
  assert.deepEqual(AI_SEARCH, { href: '/#ai-search', label: 'AI Search' });
  assert.deepEqual(SIGN_IN.map((s) => s.label), ['Project Management', 'CAD Automation', 'Customer Relationship Management']);
  for (const s of SIGN_IN) assert.match(s.href, /^https:\/\/[a-z0-9.-]+(\/[a-z0-9-]+)*\/login$/, `${s.label} signs in on its own application`);
  assert.deepEqual(SIGN_IN.map((s) => s.href), ['https://bizomat.ai/tasks/login', 'https://bizomat.ai/cad/login', 'https://bizomat.ai/crm/login'], 'all under bizomat.ai');
  assert.deepEqual(CRUMB, { tools: 'Tools', library: 'Library' });
  assert.deepEqual(QUOTE_CTA, { href: '/contact/', label: 'Contact' });
  // One list serves desktop, tablet and mobile; menus work without JavaScript (<details>).
  const header = read('src/components/Header.astro');
  assert.match(header, /NAV\.map/);
  assert.match(header, /<details class="nav-menu"/);
  assert.match(header, /<details class="nav-menu signin-menu" data-nav-menu>/);
  assert.match(header, /AI_SEARCH\.label/);
  assert.match(header, /<abbr class="site-nav__short" title=\{item\.label\}>\{item\.short\}<\/abbr>/, 'a short form keeps the full label as its title');
  assert.match(header, /aria-expanded="false" data-nav-toggle/);
  for (const page of ['cad-automation.astro', 'work.astro', 'crm-platform.astro', 'crm-platform/guide.astro', 'engine-room.astro', 'sign-in.astro', 'products.astro', 'solutions.astro', 'resources/index.astro', 'contact/index.astro', 'library/index.astro', 'reados/index.astro', 'tools/index.astro']) assert.ok(read(`src/pages/${page}`).length > 0, `${page} exists`);
});

test('the footer covers products, resources, company and the applications, with the legal pages on every page', () => {
  const pairs = [...FOOTER_NAV.products, ...FOOTER_NAV.resources, ...FOOTER_NAV.company, ...FOOTER_NAV.apps, ...FOOTER_NAV.legal].map((n) => [n.label, n.href]);
  for (const pair of [['CAD Automation', '/cad-automation/'], ['Project Management', '/work/'], ['Customer Relationship Management', '/crm-platform/'], ['Resources', '/resources/'], ['Tools', '/tools/'], ['Library', '/reados/'], ['Home', '/'], ['About', '/engine-room/'], ['Contact', '/contact/'], ['All products', '/products/'], ['Solutions', '/solutions/'], ['Privacy Policy', '/privacy/'], ['Terms of Use', '/terms/'], ['Disclaimer', '/disclaimer/']]) {
    assert.ok(pairs.some(([l, h]) => l === pair[0] && h === pair[1]), `footer has ${pair[0]}`);
  }
  const labels = [...NAV, ...NAV.flatMap((n) => n.children ?? []), ...pairs.map(([label]) => ({ label }))].map((n) => n.label);
  for (const old of ['WORKOS', 'READOS', 'REACHOS', 'Guides', 'CADOS', 'Work']) assert.ok(!labels.includes(old as never), `no "${old}" navigation label`);
  const footer = read('src/components/Footer.astro');
  for (const h of ['Products', 'Resources', 'Company', 'Applications']) assert.match(footer, new RegExp(`<h2 class="site-footer__heading">${h}</h2>`));
  assert.match(footer, /FOOTER_NAV\.legal\.map/);
  // The corporate footer (owner, 8 Nov 2026): logo, slogan, short description and the copyright line.
  assert.match(footer, /<p class="site-footer__tagline">\{SITE\.statement\}<\/p>/);
  assert.match(footer, /<p>\{SITE\.footer\}<\/p>/);
  assert.match(footer, /© \{year\} \{SITE\.name\}\. All rights reserved\./);
});

test('breadcrumbs say Tools and Library, never WORKOS or READOS', () => {
  const offenders = walk(join(process.cwd(), 'src')).filter((f) => /label: ?'(WORKOS|READOS)'/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(offenders, []);
  assert.match(read('src/pages/tools/[tool].astro'), /aria-label="Breadcrumb"><a href="\/tools\/">← All tools<\/a>/);
  for (const page of ['src/pages/tools/index.astro', 'src/pages/reados/index.astro']) assert.match(read(page), /label=\{CRUMB\.(tools|library)\}/, `${page}: the library browser trail uses the nav label`);
});

test('the Library page has its SEO title, and the names WORKOS and READOS are retired from visible text', () => {
  const page = read('src/pages/reados/index.astro');
  assert.match(page, /exactTitle="Engineering, Manufacturing & Business Knowledge Library \| BIZOMAT"/);
  assert.match(page, /The BIZOMAT Library brings together/);
  assert.match(page, /title="Library"/);
  assert.match(read('src/pages/tools/index.astro'), /title="Tools"/);
});

test('outside their own pages, the libraries are called Tools and Library (no stray WORKOS / READOS / REACHOS labels)', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /<p class="bz-eyebrow">Resources · Tools<\/p>/);
  assert.match(home, /<p class="bz-eyebrow">Resources · Library<\/p>/);
  assert.match(home, />Explore Tools<\/Button>/);
  assert.match(home, />Explore Library<\/Button>/);
  const markup = home.slice(home.indexOf('<BaseLayout'), home.indexOf('</BaseLayout>'));
  assert.doesNotMatch(markup, /WORKOS|READOS|REACHOS/, 'homepage markup uses the plain names');
  assert.ok(FOOTER_NAV.resources.some((n) => n.label === 'Library RSS feed' && n.href === '/rss.xml'));
  assert.match(read('src/pages/contact/index.astro'), /\{ label: 'Contact', href: '\/contact\/' \}/);
  for (const f of ['src/components/discovery/DiscoveryResults.astro', 'src/components/knowledge/ApplyInPractice.astro', 'src/components/knowledge/LearnConcepts.astro', 'src/components/ContactForm.astro', 'src/pages/engine-room.astro', 'src/pages/search.astro', 'src/pages/contact/sent.astro', 'src/pages/products.astro', 'src/pages/solutions.astro', 'src/pages/resources/index.astro', 'src/config/products.ts']) {
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
