// SEO structure: WORKOS tool pages, sitemap canonical rules, unique volume descriptions and the audit helpers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadWorkosTools, hasStandaloneGuide, toolPageHref, toolAppHref } from '../src/utils/workos-tools.ts';
import { parsePage, audit, sectionOf } from '../scripts/seo/inventory.mjs';
import { SITE } from '../scripts/seo/lib/site.mjs';
import { SITE as WEBSITE } from '../src/config/site.ts';

test('tool pages exist only for tools whose guide stands alone, and keep the calculator link', () => {
  const { tools, guides } = loadWorkosTools();
  const eligible = tools.filter((t) => hasStandaloneGuide(guides[t.id]));
  assert.ok(eligible.length >= 100 && eligible.length < tools.length, `${eligible.length} of ${tools.length} tools qualify`);
  assert.equal(hasStandaloneGuide({ purpose: 'x', inputs: {}, method: ['one'], limitations: ['l'] }), false, 'one method step is not enough');
  assert.equal(toolPageHref('cutting-speed'), '/tools/cutting-speed/');
  assert.equal(toolAppHref('cutting-speed'), '/tools/?tool=cutting-speed');
  const page = fs.readFileSync('src/pages/tools/[tool].astro', 'utf8');
  assert.match(page, /href=\{toolAppHref\(tool\.id\)\}/, 'every tool page opens the working calculator');
  assert.match(page, /'@type': 'WebApplication'/);
  assert.doesNotMatch(page, /aggregateRating|ratingValue|reviewCount/, 'no invented ratings');
});

test('the sitemap leaves out non-canonical volume chapters but keeps the volume pages', () => {
  const config = fs.readFileSync('astro.config.mjs', 'utf8');
  const re = new RegExp(config.match(/const NON_CANONICAL = \/(.+)\/;/)![1]);
  assert.ok(re.test('https://kevos.com/reados/books/business-volume-01/some-chapter/'));
  assert.ok(!re.test('https://kevos.com/reados/books/business-volume-01/'));
  assert.ok(!re.test('https://kevos.com/reados/collections/some-book/some-chapter/'));
});

test('category volumes get their own descriptions', () => {
  const page = fs.readFileSync('src/pages/reados/books/[book]/index.astro', 'utf8');
  assert.match(page, /description=\{volumeDescription\(book\)\}/);
  assert.match(page, /Volume \$\{b\.volume\}/);
});

test('the audit flags sitemap, canonical, orphan and duplicate problems', () => {
  const html = (title: string, canonical: string, extra = '') =>
    `<html lang="en-AU"><head><title>${title}</title><meta name="description" content="A description long enough to be counted properly here, over seventy characters."><link rel="canonical" href="${canonical}">${extra}</head><body><main><h1>${title}</h1><a href="/b/">b</a></main></body></html>`;
  const a = parsePage(html('A', `${SITE}/a/`), '/a/');
  const b = parsePage(html('A', `${SITE}/b/`), '/b/');
  const c = parsePage(html('C', `${SITE}/a/`), '/c/');
  const d = parsePage(html('D', `${SITE}/d/`, '<meta name="robots" content="noindex, follow">'), '/d/');
  const { issues } = audit([a, b, c, d], [`${SITE}/a/`, `${SITE}/c/`, `${SITE}/d/`]);
  const codes = issues.map((i: { code: string; path: string }) => `${i.code}:${i.path}`);
  assert.ok(codes.includes('duplicate-title:/b/'));
  assert.ok(codes.includes('sitemap-non-canonical:/c/'));
  assert.ok(codes.includes('sitemap-noindex:/d/'));
  assert.ok(codes.includes('indexable-not-in-sitemap:/b/'));
  assert.ok(codes.includes('orphan:/a/'));
  assert.equal(sectionOf('/tools/cutting-speed/'), 'workos');
  assert.equal(sectionOf('/reados/books/x/y/'), 'reados-volume');
});

test('the SEO scripts use the website\'s own canonical address', () => {
  assert.equal(SITE, WEBSITE.url, 'seo/config.json "site" and src/config/site.ts SITE.url must name the same address');
  for (const f of fs.readdirSync('scripts/seo').filter((n) => n.endsWith('.mjs')).map((n) => `scripts/seo/${n}`).concat(fs.readdirSync('scripts/seo/lib').map((n) => `scripts/seo/lib/${n}`))) {
    assert.doesNotMatch(fs.readFileSync(f, 'utf8').replace(/^\s*\/\/.*$/gm, ''), /https?:\/\/(www\.)?(kevos\.com|bizomat\.ai)/, `${f} names a host itself instead of reading seo/config.json`);
  }
});
