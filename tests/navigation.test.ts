import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CRUMB, FOOTER_NAV, NAV, QUOTE_CTA } from '../src/config/site.ts';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : /\.(astro|ts)$/.test(f) ? [p] : []; });

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

test('the Library page has its SEO title, and READOS stays the platform name on its pages', () => {
  const page = read('src/pages/reados/index.astro');
  assert.match(page, /exactTitle="Engineering, Manufacturing & Business Knowledge Library \| KEVOS"/);
  assert.match(page, /READOS is the KEVOS® knowledge library/);
});
