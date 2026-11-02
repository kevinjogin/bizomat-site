import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CRUMB, FOOTER_NAV, NAV, QUOTE_CTA } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts|md|mdx)$/.test(f) ? [p] : []; });

test('the main navigation reads Tools, Library, About, Contact, on the same URLs', () => {
  assert.deepEqual(NAV.map((n) => [n.label, n.href]), [['Tools', '/tools/'], ['Library', '/reados/'], ['About', '/about/'], ['Contact', '/contact/']]);
  assert.deepEqual(CRUMB, { tools: 'Tools', library: 'Library' });
  assert.deepEqual(QUOTE_CTA, { href: '/contact/', label: 'Contact' });
  // One list serves desktop, tablet and mobile; header and footer share the site's capitals style.
  assert.match(read('src/components/Header.astro'), /NAV\.map/);
});

test('the footer uses the same labels, and "Guides" is not a navigation label', () => {
  const company = FOOTER_NAV.company.map((n) => [n.label, n.href]);
  for (const pair of [['Tools', '/tools/'], ['Library', '/reados/'], ['About', '/about/'], ['Contact', '/contact/']]) assert.ok(company.some(([l, h]) => l === pair[0] && h === pair[1]), `footer has ${pair[0]}`);
  const labels = [...NAV, ...FOOTER_NAV.company, ...FOOTER_NAV.services, ...FOOTER_NAV.legal].map((n) => n.label);
  for (const old of ['WORKOS', 'READOS', 'REACHOS', 'Guides']) assert.ok(!labels.includes(old as never), `no "${old}" navigation label`);
  assert.match(read('src/components/Footer.astro'), /<h2 class="site-footer__heading">Contact<\/h2>/);
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
  assert.match(home, /<span>01<\/span> Tools<\/p>/);
  assert.match(home, /<span>02<\/span> Library<\/p>/);
  assert.match(home, />Explore Tools<\/Button>/);
  assert.match(home, />Explore Library<\/Button>/);
  const markup = home.slice(home.indexOf('<BaseLayout'), home.indexOf('</BaseLayout>'));
  assert.doesNotMatch(markup, /WORKOS|READOS|REACHOS/, 'homepage markup uses the plain names');
  assert.match(read('src/components/Footer.astro'), />Library RSS feed</);
  assert.match(read('src/pages/contact/index.astro'), /\{ label: 'Contact', href: '\/contact\/' \}/);
  for (const f of ['src/components/discovery/DiscoveryResults.astro', 'src/components/knowledge/ApplyInPractice.astro', 'src/components/knowledge/LearnConcepts.astro', 'src/components/ContactForm.astro', 'src/pages/about.astro', 'src/pages/search.astro', 'src/pages/contact/sent.astro']) {
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
