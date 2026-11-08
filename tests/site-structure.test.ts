// The lean BIZOMAT website (8 Nov 2026): four sections (Home, CAD Automation, Work, The Engine Room), minimal
// navigation, and every retired Resources address answering a permanent redirect to a retained page.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { FOOTER_NAV, NAV, QUOTE_CTA, SIGN_IN, SITE } from '../src/config/site.ts';
import { PRODUCTS } from '../src/config/products.ts';
import { CAD_PATHS, retiredTarget } from '../src/server/platform-paths.ts';
import { parseRedirects } from '../src/node/assets.ts';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(join(root, 'src/pages')).map((p) => p.slice(join(root, 'src/pages').length + 1)).sort();

const RETIRED = ['resources', 'tools', 'reados', 'library', 'insights', 'learning', 'search', 'chat', 'products', 'solutions', 'industries', 'services', 'how-it-works', 'factory-fix', 'assessment'];

test('the site has its four sections and only the supporting pages they need', () => {
  assert.deepEqual(pages, [
    '404.astro', 'cad-automation.astro', 'contact/error.astro', 'contact/index.astro', 'contact/sent.astro', 'disclaimer.astro',
    'engine-room.astro', 'index.astro', 'privacy.astro', 'robots.txt.ts', 'sign-in.astro', 'terms.astro', 'work.astro',
  ]);
  for (const dir of RETIRED) assert.ok(!existsSync(join(root, 'src/pages', dir)) && !existsSync(join(root, 'src/pages', `${dir}.astro`)), `${dir} is retired`);
  assert.ok(!existsSync(join(root, 'src/content')), 'no Library content in the repository');
});

test('the navigation is the three other sections, with Sign in; no Resources and no AI Search', () => {
  assert.deepEqual(NAV.map((n) => [n.label, n.href]), [['CAD Automation', '/cad-automation/'], ['Project Management', '/work/'], ['Engine Room', '/engine-room/']]);
  assert.deepEqual(SIGN_IN.map((s) => s.href), ['https://bizomat.ai/tasks/login', 'https://bizomat.ai/cad/login'], 'both applications sign in under bizomat.ai');
  assert.deepEqual(QUOTE_CTA, { href: '/contact/', label: 'Contact' });
  const header = read('src/components/Header.astro');
  assert.match(header, /NAV\.map/);
  assert.match(header, /<details class="nav-menu signin-menu" data-nav-menu>/);
  assert.match(header, /aria-expanded="false" data-nav-toggle/);
  assert.doesNotMatch(header, /AI_SEARCH|Resources|site-header__search/);
});

test('the footer lists the sections, the applications and the legal pages, with the corporate identity', () => {
  const links = [...FOOTER_NAV.sections, ...FOOTER_NAV.apps, ...FOOTER_NAV.legal];
  assert.deepEqual(FOOTER_NAV.sections.map((n) => n.href), ['/', '/cad-automation/', '/work/', '/engine-room/', '/contact/']);
  assert.deepEqual(FOOTER_NAV.legal.map((n) => n.href), ['/privacy/', '/terms/', '/disclaimer/']);
  for (const l of links) if (l.href.startsWith('/')) assert.equal(retiredTarget(l.href), null, `${l.href} is not retired`);
  const footer = read('src/components/Footer.astro');
  assert.match(footer, /<p class="site-footer__tagline">\{SITE\.statement\}<\/p>/);
  assert.match(footer, /<p>\{SITE\.footer\}<\/p>/);
  assert.match(footer, /© \{year\} \{SITE\.name\}\. All rights reserved\./);
  assert.doesNotMatch(footer, /Resources|rss/i);
});

test('the homepage leads with the BIZOMAT message, the two products and the proof, with nothing from Resources', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /<h1 id="home-title"><span class="home-hero__line">Connecting Intelligence\.<\/span> <span class="home-hero__line">Empowering Progress\.<\/span><\/h1>/);
  assert.equal(SITE.tagline, 'Business Intelligence & Automation');
  assert.equal(SITE.statement, 'Connecting Intelligence. Empowering Progress.');
  assert.equal(SITE.support, 'Technology Connected. Progress Delivered.');
  assert.equal(SITE.title, 'BIZOMAT | Business Intelligence & Automation');
  const order = ['home-title', 'id="products"', 'id="proof-title"', 'id="close-title"'].map((m) => home.indexOf(m));
  assert.ok(order.every((n, i) => n > 0 && (i === 0 || n > order[i - 1])), 'sections in order');
  assert.match(home, /String\(CAD\.toolCount\)/, 'counts come from the catalogue');
  assert.match(home, /String\(WORK\.views\.length\)/);
  const markup = home.slice(home.indexOf('<BaseLayout'), home.indexOf('</BaseLayout>'));
  assert.doesNotMatch(markup, /\/tools\/|\/reados\/|\/resources\/|\/library\/|ai-search|Discovery/);
  assert.deepEqual(PRODUCTS.map((p) => [p.id, p.url]), [['cad', '/cad-automation/'], ['work', '/work/']]);
});

test('no retained page or component links to a retired section', () => {
  const files = [...walk(join(root, 'src/pages')), ...walk(join(root, 'src/components')), ...walk(join(root, 'src/layouts')), join(root, 'src/config/site.ts')];
  const re = new RegExp(`href=["{\`']\\/(${RETIRED.join('|')})\\/`);
  assert.deepEqual(files.filter((f) => re.test(readFileSync(f, 'utf8'))).map((f) => f.slice(root.length + 1)), []);
});

test('every retired address answers 301 with a retained page, the same in _redirects and in the Worker', () => {
  const { exact, dynamic } = parseRedirects(read('public/_redirects'));
  const fromFile = (path: string) => exact.get(path) ?? dynamic.find((r) => r.re!.test(path));
  const samples = ['/resources/', '/resources', '/resources/#pathways', '/tools/', '/tools/bolt-torque/', '/reados/', '/reados/books/business-volume-02/x/', '/library/', '/insights/old-post/',
    '/learning/x.json', '/search/', '/chat/', '/products/', '/solutions/', '/industries/', '/rss.xml', '/services/', '/how-it-works/', '/factory-fix/', '/assessment/', '/assessment/received/'];
  for (const raw of samples) {
    const path = raw.split('#')[0];
    const rule = fromFile(path);
    assert.ok(rule, `${path} has a redirect rule`);
    assert.equal(rule.status, 301, `${path} is permanent`);
    assert.equal(retiredTarget(path), rule.to, `${path}: the Worker and _redirects agree`);
    assert.ok(['/', '/engine-room/', '/contact/'].includes(rule.to), `${path} goes to a retained page`);
  }
  for (const kept of ['/', '/cad-automation/', '/work/', '/engine-room/', '/contact/', '/privacy/', '/sign-in/', '/downloads/x/y.msi', '/api/contact']) {
    assert.equal(retiredTarget(kept), null, `${kept} is not retired`);
    assert.equal(fromFile(kept), undefined, `${kept} is not redirected`);
  }
  for (const app of ['/cad', '/cad/login', '/mcp', '/solidworks/mcp', '/oauth/token', '/v2/devices', '/healthz', '/tasks/']) {
    assert.equal(retiredTarget(app), null, `${app} belongs to an application`);
  }
  assert.ok(CAD_PATHS.test('/mcp'));
  assert.equal(exact.get('/about/')?.to, '/engine-room/');
  assert.equal(exact.get('/proof-of-work/')?.to, '/engine-room/');
});

test('no page, component or data file names the retired Resources, Tools, Library or AI search to visitors', () => {
  const files = [...walk(join(root, 'src/pages')), ...walk(join(root, 'src/components')), ...walk(join(root, 'src/data')), ...walk(join(root, 'src/layouts'))];
  const offenders = files.filter((f) => {
    // comments may record history; visible text may not
    const text = readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\/|^\s*\/\/.*$|<!--[\s\S]*?-->/gm, '');
    return /\bResources\b|\bCalculators\b|AI [Ss]earch|'Library'|"Library"|>Library</.test(text);
  }).map((f) => f.slice(root.length + 1));
  assert.deepEqual(offenders, []);
});
