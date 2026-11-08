import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

// BIZOMAT brand (5 Nov 2026): one wordmark drawn from shared/brand/glyphs.mjs, built into every product by
// shared/brand/build.mjs. KEVOS artwork is retired; its trade mark is mentioned only as the former name.
test('the BIZOMAT logo is used in the header, footer and diagrams, with a variant per theme', () => {
  // the header and footer show the lockup (mark and wordmark); diagrams the wordmark alone
  for (const [component, kind] of [['src/components/SiteWordmark.astro', 'lockup'], ['src/components/Logo.astro', 'logo']]) {
    const source = read(component);
    assert.match(source, new RegExp(`bizomat-${kind}-light\\.svg`));
    assert.match(source, new RegExp(`bizomat-${kind}-dark\\.svg`));
    assert.doesNotMatch(source, /kevos-wordmark|width="2329"/);
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
  assert.match(light, /viewBox="0 0 1626\.6 246"/);
  assert.match(light, /fill="#0a1f33"/, 'navy word on light backgrounds');
  assert.match(light, /fill="#14b8a6"/, 'the teal forward arrow in the B');
  assert.match(dark, /fill="#ffffff"/);
  // M/L/Z only: the SOLIDWORKS add-in draws the same paths with GDI+
  for (const file of ['public/brand/bizomat-logo-light.svg', 'public/brand/bizomat-mark.svg', 'public/brand/bizomat-lockup-light.svg']) {
    const paths = [...read(file).matchAll(/ d="([^"]+)"/g)].map((m) => m[1]).join('');
    assert.match(paths, /^[MLZ0-9. -]+$/, `${file}: straight segments only`);
  }
  for (const file of ['public/brand/bizomat-lockup-light.svg', 'public/brand/bizomat-lockup-dark.svg']) assert.ok(existsSync(file), `${file} present`);
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
  for (const file of ['src/components/Footer.astro', 'src/components/TradeMarkNotice.astro', 'src/pages/terms.astro', 'src/pages/privacy.astro', 'src/pages/disclaimer.astro', 'src/pages/engine-room.astro']) {
    const text = read(file);
    assert.doesNotMatch(text, /BIZOMAT®|\{SITE\.name\} is a registered|registration applies to BIZOMAT/, file);
  }
  assert.match(read('src/components/TradeMarkNotice.astro'), /formerly called \{tm\.name\}/);
});
