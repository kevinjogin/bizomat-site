import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { AI_SEARCH, CRUMB, FOOTER_NAV, NAV, QUOTE_CTA, SIGN_IN } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts|md|mdx)$/.test(f) ? [p] : []; });

// BIZOMAT navigation (owner, 14 Nov 2026; Learn added 20 Nov 2026): Home | Systems | Learn | Resources | About | Contact,
// with AI Search and Sign in on the right (one sign-in, BIZOMAT ERP, owner 20 Nov 2026). Learn is the ERP Knowledge Centre
// (/learn/, src/data/learn/), where every system's user guide now lives. Systems is BIZOMAT's business software as one catalogue (src/config/systems.ts); the applications
// open inside BIZOMAT ERP. Resources stay free and public. (Before: one menu per product, 13 Nov 2026.)
test('the main navigation reads Home, Systems, Learn, Resources, About, Contact', () => {
  assert.deepEqual(NAV.map((n) => [n.label, n.href]), [['Home', '/'], ['Systems', '/systems/'], ['Learn', '/learn/'], ['Resources', '/resources/'], ['About', '/engine-room/'], ['Contact', '/contact/']]);
  const menu = (label: string) => (NAV.find((n) => n.label === label)?.children ?? []).map((c) => [c.label, c.href]);
  assert.deepEqual(menu('Systems'), [['All systems', '/systems/'], ['BIZOMAT ERP', '/systems/erp/'], ['BIZOMAT CRM', '/systems/crm/'], ['BIZOMAT Finance', '/systems/finance/'], ['BIZOMAT Projects', '/systems/projects/'], ['BIZOMAT Engineering Automation', '/systems/engineering/'], ['BIZOMAT Manufacturing and Operations', '/systems/manufacturing/'], ['BIZOMAT WHS', '/systems/whs/'], ['Open BIZOMAT ERP', 'https://bizomat.ai/erp/']]);
  // A planned system says so in its menu entry. Manufacturing and Operations became Available with ERP Release 5 part A
  // (supply chain), the last of its modules: no system is labelled Planned now.
  assert.equal(NAV.find((n) => n.label === 'Systems')!.children!.find((c) => c.href === '/systems/manufacturing/')!.status, undefined);
  assert.deepEqual(menu('Learn'), [['Knowledge Centre', '/learn/'], ['Getting started', '/learn/what-is-bizomat/'], ['ERP modules', '/learn/#modules'], ['Workflows', '/learn/workflows/'], ['CAD and engineering', '/learn/cad-automation/'], ['Troubleshooting', '/learn/#troubleshooting']]);
  assert.deepEqual(menu('Resources'), [['Tools', '/tools/'], ['Library', '/reados/'], ['Guides and articles', '/library/'], ['Learning paths', '/resources/#pathways'], ['All resources', '/resources/']]);
  assert.deepEqual(menu('About'), [['The Engine Room', '/engine-room/'], ['From the founder', '/engine-room/#founder'], ['Test record', '/engine-room/#tests']]);
  assert.deepEqual(AI_SEARCH, { href: '/#ai-search', label: 'AI Search' });
  // One account, one sign-in (owner, 20 Nov 2026): BIZOMAT ERP, where every system opens; CAD Automation takes the same
  // account. No sign-in menu, no second sign-in anywhere on the website.
  assert.deepEqual(SIGN_IN, { label: 'Sign in', href: 'https://bizomat.ai/erp/login' });
  assert.doesNotMatch(read('src/components/Header.astro'), /signin-menu|SIGN_IN\.map/);
  assert.ok(!FOOTER_NAV.apps.some((l) => l.href.includes('/cad/')), 'the footer has one sign-in');
  for (const f of walk('src').filter((x) => !x.includes('reados'))) assert.doesNotMatch(read(f), /own sign-in/i, `${f} still says CAD Automation has its own sign-in`);
  assert.deepEqual(CRUMB, { tools: 'Tools', library: 'Library' });
  assert.deepEqual(QUOTE_CTA, { href: '/contact/', label: 'Contact' });
  // One list serves desktop, tablet and mobile; menus work without JavaScript (<details>).
  const header = read('src/components/Header.astro');
  assert.match(header, /NAV\.map/);
  assert.match(header, /<details class="nav-menu"/);
  assert.match(header, /<a class="site-header__cta site-header__signin" href=\{SIGN_IN\.href\}/);
  assert.match(header, /AI_SEARCH\.label/);
  assert.match(header, /aria-expanded="false" data-nav-toggle/);
  for (const page of ['systems/index.astro', 'systems/erp/index.astro', 'systems/crm/index.astro', 'systems/finance/index.astro', 'systems/projects/index.astro', 'systems/engineering/index.astro', 'systems/manufacturing/index.astro', 'systems/whs/index.astro', 'learn/index.astro', 'learn/[guide].astro', 'learn/workflows/index.astro', 'learn/workflows/[workflow].astro', 'engine-room.astro', 'sign-in.astro', 'solutions.astro', 'resources/index.astro', 'contact/index.astro', 'library/index.astro', 'reados/index.astro', 'tools/index.astro']) assert.ok(read(`src/pages/${page}`).length > 0, `${page} exists`);
  // The product pages moved under /systems/ with permanent redirects (their old addresses keep working).
  const redirects = read('public/_redirects');
  // The systems' user guides moved into the Knowledge Centre (owner, 20 Nov 2026); their old addresses answer 301 there.
  for (const [from, to] of [['/products/', '/systems/'], ['/work/', '/systems/projects/'], ['/cad-automation/', '/systems/engineering/'], ['/crm-platform/', '/systems/crm/'], ['/crm-platform/guide/', '/learn/crm/'], ['/finance-platform/', '/systems/finance/'], ['/finance-platform/guide/', '/learn/finance/'], ['/systems/erp/guide/', '/learn/'], ['/systems/crm/guide/', '/learn/crm/'], ['/systems/finance/guide/', '/learn/finance/'], ['/systems/projects/guide/', '/learn/projects/'], ['/systems/engineering/guide/', '/learn/cad-automation/'], ['/systems/manufacturing/guide/', '/learn/manufacturing/'], ['/systems/whs/guide/', '/learn/whs/'], ['/erp/learn/', '/learn/'], ['/help/', '/learn/'], ['/knowledge-centre/', '/learn/']]) {
    assert.match(redirects, new RegExp(`^${from.replace(/\//g, '\\/')} ${to.replace(/\//g, '\\/')} 301$`, 'm'), `${from} -> ${to}`);
  }
});

test('the footer covers products, resources, company and the applications, with the legal pages on every page', () => {
  const pairs = [...FOOTER_NAV.products, ...FOOTER_NAV.resources, ...FOOTER_NAV.company, ...FOOTER_NAV.apps, ...FOOTER_NAV.legal].map((n) => [n.label, n.href]);
  for (const pair of [['All systems', '/systems/'], ['Knowledge Centre', '/learn/'], ['BIZOMAT ERP', '/systems/erp/'], ['BIZOMAT CRM', '/systems/crm/'], ['BIZOMAT Finance', '/systems/finance/'], ['BIZOMAT Projects', '/systems/projects/'], ['BIZOMAT Engineering Automation', '/systems/engineering/'], ['Sign in to BIZOMAT ERP', 'https://bizomat.ai/erp/login'], ['Resources (free)', '/resources/'], ['Tools', '/tools/'], ['Library', '/reados/'], ['Home', '/'], ['About', '/engine-room/'], ['Contact', '/contact/'], ['Solutions', '/solutions/'], ['Privacy Policy', '/privacy/'], ['Terms of Use', '/terms/'], ['Disclaimer', '/disclaimer/']]) {
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
