import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { AI_SEARCH, CRUMB, FOOTER_NAV, NAV, QUOTE_CTA, SIGN_IN } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts|md|mdx)$/.test(f) ? [p] : []; });

// BIZOMAT navigation (owner, 14 Nov 2026): Home | Systems | Resources | About | Contact, with AI Search and a Sign in
// menu on the right. Systems is BIZOMAT's business software as one catalogue (src/config/systems.ts); the applications
// open inside BIZOMAT ERP. Resources stay free and public. (Before: one menu per product, 13 Nov 2026.)
test('the main navigation reads Home, Systems, Resources, About, Contact', () => {
  assert.deepEqual(NAV.map((n) => [n.label, n.href]), [['Home', '/'], ['Systems', '/systems/'], ['Resources', '/resources/'], ['About', '/engine-room/'], ['Contact', '/contact/']]);
  const menu = (label: string) => (NAV.find((n) => n.label === label)?.children ?? []).map((c) => [c.label, c.href]);
  assert.deepEqual(menu('Systems'), [['All systems', '/systems/'], ['BIZOMAT ERP', '/systems/erp/'], ['BIZOMAT CRM', '/systems/crm/'], ['BIZOMAT Finance', '/systems/finance/'], ['BIZOMAT Projects', '/systems/projects/'], ['BIZOMAT Engineering Automation', '/systems/engineering/'], ['BIZOMAT Manufacturing and Operations', '/systems/manufacturing/'], ['Open BIZOMAT ERP', 'https://bizomat.ai/erp/']]);
  // A planned system says so in its menu entry.
  assert.equal(NAV.find((n) => n.label === 'Systems')!.children!.find((c) => c.href === '/systems/manufacturing/')!.status, 'Planned');
  assert.deepEqual(menu('Resources'), [['Tools', '/tools/'], ['Library', '/reados/'], ['Guides and articles', '/library/'], ['Learning paths', '/resources/#pathways'], ['All resources', '/resources/']]);
  assert.deepEqual(menu('About'), [['The Engine Room', '/engine-room/'], ['From the founder', '/engine-room/#founder'], ['Test record', '/engine-room/#tests']]);
  assert.deepEqual(AI_SEARCH, { href: '/#ai-search', label: 'AI Search' });
  // One sign-in: BIZOMAT ERP (the CRM, Finance, Projects and company accounts); CAD Automation keeps its own for now.
  assert.deepEqual(SIGN_IN.map((s) => [s.label, s.href]), [['BIZOMAT ERP', 'https://bizomat.ai/erp/login'], ['Engineering Automation', 'https://bizomat.ai/cad/login']]);
  assert.deepEqual(CRUMB, { tools: 'Tools', library: 'Library' });
  assert.deepEqual(QUOTE_CTA, { href: '/contact/', label: 'Contact' });
  // One list serves desktop, tablet and mobile; menus work without JavaScript (<details>).
  const header = read('src/components/Header.astro');
  assert.match(header, /NAV\.map/);
  assert.match(header, /<details class="nav-menu"/);
  assert.match(header, /<details class="nav-menu signin-menu" data-nav-menu>/);
  assert.match(header, /AI_SEARCH\.label/);
  assert.match(header, /aria-expanded="false" data-nav-toggle/);
  for (const page of ['systems/index.astro', 'systems/erp/index.astro', 'systems/erp/guide.astro', 'systems/crm/index.astro', 'systems/crm/guide.astro', 'systems/finance/index.astro', 'systems/finance/guide.astro', 'systems/projects/index.astro', 'systems/projects/guide.astro', 'systems/engineering/index.astro', 'systems/engineering/guide.astro', 'systems/manufacturing/index.astro', 'engine-room.astro', 'sign-in.astro', 'solutions.astro', 'resources/index.astro', 'contact/index.astro', 'library/index.astro', 'reados/index.astro', 'tools/index.astro']) assert.ok(read(`src/pages/${page}`).length > 0, `${page} exists`);
  // The product pages moved under /systems/ with permanent redirects (their old addresses keep working).
  const redirects = read('public/_redirects');
  for (const [from, to] of [['/products/', '/systems/'], ['/work/', '/systems/projects/'], ['/cad-automation/', '/systems/engineering/'], ['/crm-platform/', '/systems/crm/'], ['/crm-platform/guide/', '/systems/crm/guide/'], ['/finance-platform/', '/systems/finance/'], ['/finance-platform/guide/', '/systems/finance/guide/']]) {
    assert.match(redirects, new RegExp(`^${from.replace(/\//g, '\\/')} ${to.replace(/\//g, '\\/')} 301$`, 'm'), `${from} -> ${to}`);
  }
});

test('the footer covers products, resources, company and the applications, with the legal pages on every page', () => {
  const pairs = [...FOOTER_NAV.products, ...FOOTER_NAV.resources, ...FOOTER_NAV.company, ...FOOTER_NAV.apps, ...FOOTER_NAV.legal].map((n) => [n.label, n.href]);
  for (const pair of [['All systems', '/systems/'], ['BIZOMAT ERP', '/systems/erp/'], ['BIZOMAT CRM', '/systems/crm/'], ['BIZOMAT Finance', '/systems/finance/'], ['BIZOMAT Projects', '/systems/projects/'], ['BIZOMAT Engineering Automation', '/systems/engineering/'], ['Sign in to BIZOMAT ERP', 'https://bizomat.ai/erp/login'], ['Resources (free)', '/resources/'], ['Tools', '/tools/'], ['Library', '/reados/'], ['Home', '/'], ['About', '/engine-room/'], ['Contact', '/contact/'], ['Solutions', '/solutions/'], ['Privacy Policy', '/privacy/'], ['Terms of Use', '/terms/'], ['Disclaimer', '/disclaimer/']]) {
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
  for (const f of ['src/components/discovery/DiscoveryResults.astro', 'src/components/knowledge/ApplyInPractice.astro', 'src/components/knowledge/LearnConcepts.astro', 'src/components/ContactForm.astro', 'src/pages/engine-room.astro', 'src/pages/search.astro', 'src/pages/contact/sent.astro', 'src/pages/systems/index.astro', 'src/pages/solutions.astro', 'src/pages/resources/index.astro', 'src/config/products.ts']) {
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
