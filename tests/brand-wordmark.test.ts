import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

// BIZOMAT brand (5 Nov 2026): one wordmark drawn from shared/brand/glyphs.mjs, built into every product by
// shared/brand/build.mjs. KEVOS artwork is retired; its trade mark is mentioned only as the former name.
test('the BIZOMAT wordmark is used in the header, footer and diagrams, with a variant per theme', () => {
  for (const component of ['src/components/SiteWordmark.astro', 'src/components/Logo.astro']) {
    const source = read(component);
    assert.match(source, /bizomat-logo-light\.svg/);
    assert.match(source, /bizomat-logo-dark\.svg/);
    assert.doesNotMatch(source, /kevos-wordmark/);
    assert.match(source, /:root\[data-theme='dark'\]/);
  }
  assert.match(read('src/components/Header.astro'), /<SiteWordmark/);
  assert.match(read('src/components/Footer.astro'), /<SiteWordmark/);
});

test('logos, icons and the favicon come from the one brand source and are in step', () => {
  const light = read('public/brand/bizomat-logo-light.svg');
  const dark = read('public/brand/bizomat-logo-dark.svg');
  const config = read('src/config/site.ts');
  const layout = read('src/layouts/BaseLayout.astro');
  const manifest = JSON.parse(read('public/site.webmanifest'));
  const pkg = JSON.parse(read('package.json'));
  assert.match(light, /viewBox="0 0 2329 241"/);
  assert.match(light, /fill="#0a1f33"/, 'navy word on light backgrounds');
  assert.match(light, /fill="#0f766e"/, 'teal connector bar');
  assert.match(dark, /fill="#ffffff"/);
  assert.equal(read('public/favicon.svg'), read('public/brand/bizomat-mark.svg'));
  assert.match(config, /ogImage: '\/brand\/bizomat-social\.png'/);
  assert.match(config, /icon: '\/brand\/bizomat-icon-192\.png'/);
  assert.match(layout, /href="\/favicon\.svg"/);
  assert.match(layout, /bizomat-icon-180\.png/);
  assert.ok(pkg.scripts.build.startsWith('node shared/brand/build.mjs && '), 'every build regenerates the brand assets');
  assert.deepEqual(manifest.icons.map((entry: { sizes: string }) => entry.sizes), ['192x192', '512x512', '512x512']);
  assert.equal(manifest.name, 'BIZOMAT');
  for (const file of ['public/brand/bizomat-social.png', 'public/brand/bizomat-icon-512.png', 'public/favicon.ico', 'public/fonts/oxanium-latin.woff2']) assert.ok(existsSync(file), `${file} present`);
});

test('no page calls BIZOMAT a registered trade mark, and no ® follows it', () => {
  for (const file of ['src/components/Footer.astro', 'src/components/TradeMarkNotice.astro', 'src/pages/terms.astro', 'src/pages/privacy.astro', 'src/pages/disclaimer.astro', 'src/pages/engine-room.astro', 'src/pages/assistant-knowledge.json.ts']) {
    const text = read(file);
    assert.doesNotMatch(text, /BIZOMAT®|\{SITE\.name\} is a registered|registration applies to BIZOMAT/, file);
  }
  assert.match(read('src/components/TradeMarkNotice.astro'), /formerly called \{tm\.name\}/);
});
