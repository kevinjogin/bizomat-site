import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { AI_SEARCH, CRUMB, FOOTER_NAV, LEARN_LINKS, NAV, QUOTE_CTA, SIGN_IN, menuLinks } from '../src/config/site.ts';
import { SECTIONS } from '../src/data/learn/types.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts|md|mdx)$/.test(f) ? [p] : []; });

// BIZOMAT navigation (owner, 14 Nov 2026; 20 Nov 2026: "SYSTEMS as a single menu item, with LEARN as a submenu under
// SYSTEMS"): Home | Systems | Resources | About | Contact, with AI Search and Sign in on the right (one sign-in, BIZOMAT
// ERP, owner 20 Nov 2026). Systems is BIZOMAT's business software on one page (src/config/systems.ts); its menu holds
// two groups, the systems and Learn (the ERP Knowledge Centre, one page at /learn/, src/data/learn/), with Open BIZOMAT
// ERP across its foot. The applications open inside BIZOMAT ERP. Resources stay free and public. (Before: Learn was a
// top-level menu of its own, 20 Nov 2026; one menu per product, 13 Nov 2026.)
test('the main navigation reads Home, Systems, Resources, About, Contact, with Learn inside the Systems menu', () => {
  assert.deepEqual(NAV.map((n) => [n.label, n.href]), [['Home', '/'], ['Systems', '/systems/'], ['Resources', '/resources/'], ['About', '/engine-room/'], ['Contact', '/contact/']]);
  const menu = (label: string) => (NAV.find((n) => n.label === label)?.children ?? []).map((c) => [c.label, c.href]);
  const systems = NAV.find((n) => n.label === 'Systems')!;
  const group = (label: string) => (systems.groups?.find((g) => g.label === label)?.children ?? []);
  const pairs = (label: string) => group(label).map((c) => [c.label, c.href]);
  assert.deepEqual(systems.groups!.map((g) => g.label), ['Systems', 'Learn']);
  assert.equal(systems.children, undefined, 'the Systems menu is its two groups');
  assert.deepEqual(pairs('Systems'), [['All systems', '/systems/'], ['BIZOMAT ERP', '/systems/#erp'], ['BIZOMAT CRM', '/systems/#crm'], ['BIZOMAT Finance', '/systems/#finance'], ['BIZOMAT Projects', '/systems/#projects'], ['BIZOMAT Engineering Automation', '/systems/#engineering'], ['BIZOMAT Manufacturing and Operations', '/systems/#manufacturing'], ['BIZOMAT WHS', '/systems/#whs']]);
  assert.deepEqual([systems.action!.label, systems.action!.href, systems.action!.external], ['Open BIZOMAT ERP', 'https://bizomat.ai/erp/', true]);
  // A planned system says so in its menu entry. Manufacturing and Operations became Available with ERP Release 5 part A
  // (supply chain), the last of its modules: no system is labelled Planned now.
  assert.equal(group('Systems').find((c) => c.href === '/systems/#manufacturing')!.status, undefined);
  // Learn: the Knowledge Centre, then each section of /learn/ in its order, so every anchor is real and none is missed.
  assert.deepEqual(pairs('Learn'), [['Knowledge Centre', '/learn/'], ['Getting started', '/learn/#getting-started'], ['ERP modules', '/learn/#modules'], ['Workflows', '/learn/#workflows'], ['AI and integrations', '/learn/#ai'], ['CAD and engineering', '/learn/#cad'], ['Administrator guide', '/learn/#admin'], ['Troubleshooting', '/learn/#troubleshooting']]);
  assert.equal(group('Learn'), LEARN_LINKS, 'one list for the menu and the Learn section of /systems/');
  assert.deepEqual(LEARN_LINKS.slice(1).map((l) => l.href!.split('#')[1]), SECTIONS.map((x) => x.id));
  // Every entry of the Systems menu has a short description, so the menu stays compact.
  for (const c of menuLinks(systems)) assert.ok(c.description && c.description.length <= 50, `${c.label}: a description of at most 50 characters`);
  // No top-level Learn; /learn/ marks Systems as the current section (the header reads menuLinks).
  assert.ok(!NAV.some((n) => n.label === 'Learn' || n.href === '/learn/'), 'Learn is inside the Systems menu, not beside it');
  assert.ok(menuLinks(systems).some((c) => c.href === '/learn/'));
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
  // A menu with groups shows each under its heading, with its action across the foot.
  assert.match(header, /'nav-menu__panel--groups': item\.groups/);
  assert.match(header, /<p class="nav-menu__group-title"/);
  assert.match(header, /<a class="nav-menu__action" href=\{item\.action\.href\}/);
  assert.match(header, /menuLinks\(item\)\.some/);
  assert.match(header, /<a class="site-header__cta site-header__signin" href=\{SIGN_IN\.href\}/);
  assert.match(header, /AI_SEARCH\.label/);
  assert.match(header, /aria-expanded="false" data-nav-toggle/);
  // Learn is under Systems on the pages too: /learn/'s trail goes through Systems, and /systems/ has a Learn section built
  // from the menu's own list. Both stay one page each.
  const learnPage = read('src/pages/learn/index.astro');
  assert.match(learnPage, /const crumbs = \[\{ label: 'Home', href: '\/' \}, \{ label: 'Systems', href: '\/systems\/' \}, \{ label: 'Knowledge Centre', href: LEARN_HOME \}\]/);
  const systemsPage = read('src/pages/systems/index.astro');
  assert.match(systemsPage, /<section class="pp-section" id="learn" aria-labelledby="learn-title">/);
  assert.match(systemsPage, /LEARN_LINKS\.map/);
  assert.match(systemsPage, /<Button href="#learn" variant="text" data-cta="systems-learn">Guides and tutorials<\/Button>/);
  for (const dir of ['systems', 'learn']) assert.deepEqual(readdirSync(join(process.cwd(), 'src/pages', dir)).filter((f) => f.endsWith('.astro')), ['index.astro'], `/${dir}/ is one page`);
  for (const page of ['systems/index.astro', 'learn/index.astro', 'engine-room.astro', 'sign-in.astro', 'solutions.astro', 'resources/index.astro', 'contact/index.astro', 'library/index.astro', 'reados/index.astro', 'tools/index.astro']) assert.ok(read(`src/pages/${page}`).length > 0, `${page} exists`);
  // Every system is on one page (owner, 20 Nov 2026): each system page's content is a component shown in a toggle on
  // /systems/, and the old pages answer 301 to their section.
  for (const c of ['Erp', 'Crm', 'Finance', 'Projects', 'Engineering', 'Manufacturing', 'Whs']) assert.ok(read(`src/components/systems/full/${c}.astro`).length > 0, `${c} is on /systems/`);
  for (const sid of ['erp', 'crm', 'finance', 'projects', 'engineering', 'manufacturing', 'whs']) {
    assert.ok(!existsSync(join(process.cwd(), `src/pages/systems/${sid}/index.astro`)), `/systems/${sid}/ has no page of its own`);
    assert.match(read('public/_redirects'), new RegExp(`^/systems/${sid}/ /systems/#${sid} 301$`, 'm'), `/systems/${sid}/ answers 301 to its section`);
  }
  // The product pages moved under /systems/ with permanent redirects (their old addresses keep working).
  const redirects = read('public/_redirects');
  // The systems' user guides moved into the Knowledge Centre (owner, 20 Nov 2026); their old addresses answer 301 there.
  for (const [from, to] of [['/products/', '/systems/'], ['/work/', '/systems/#projects'], ['/cad-automation/', '/systems/#engineering'], ['/crm-platform/', '/systems/#crm'], ['/crm-platform/guide/', '/learn/#crm'], ['/finance-platform/', '/systems/#finance'], ['/finance-platform/guide/', '/learn/#finance'], ['/systems/erp/guide/', '/learn/#getting-started'], ['/systems/crm/guide/', '/learn/#crm'], ['/systems/finance/guide/', '/learn/#finance'], ['/systems/projects/guide/', '/learn/#projects'], ['/systems/engineering/guide/', '/learn/#cad-automation'], ['/systems/manufacturing/guide/', '/learn/#manufacturing'], ['/systems/whs/guide/', '/learn/#whs'], ['/erp/learn/', '/learn/'], ['/help/', '/learn/'], ['/knowledge-centre/', '/learn/']]) {
    assert.match(redirects, new RegExp(`^${from.replace(/\//g, '\\/')} ${to.replace(/\//g, '\\/')} 301$`, 'm'), `${from} -> ${to}`);
  }
});

test('the footer covers products, resources, company and the applications, with the legal pages on every page', () => {
  const pairs = [...FOOTER_NAV.products, ...FOOTER_NAV.resources, ...FOOTER_NAV.company, ...FOOTER_NAV.apps, ...FOOTER_NAV.legal].map((n) => [n.label, n.href]);
  for (const pair of [['All systems', '/systems/'], ['Knowledge Centre', '/learn/'], ['BIZOMAT ERP', '/systems/#erp'], ['BIZOMAT CRM', '/systems/#crm'], ['BIZOMAT Finance', '/systems/#finance'], ['BIZOMAT Projects', '/systems/#projects'], ['BIZOMAT Engineering Automation', '/systems/#engineering'], ['Sign in to BIZOMAT ERP', 'https://bizomat.ai/erp/login'], ['Resources (free)', '/resources/'], ['Tools', '/tools/'], ['Library', '/reados/'], ['Home', '/'], ['About', '/engine-room/'], ['Contact', '/contact/'], ['Solutions', '/solutions/'], ['Privacy Policy', '/privacy/'], ['Terms of Use', '/terms/'], ['Disclaimer', '/disclaimer/']]) {
    assert.ok(pairs.some(([l, h]) => l === pair[0] && h === pair[1]), `footer has ${pair[0]}`);
  }
  const labels = [...NAV, ...NAV.flatMap((n) => menuLinks(n)), ...pairs.map(([label]) => ({ label }))].map((n) => n.label);
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
