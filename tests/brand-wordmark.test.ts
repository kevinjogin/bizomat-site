import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('KEVOS orange wordmark is used in header, footer and engineering core', () => {
  for (const component of ['src/components/SiteWordmark.astro', 'src/components/Logo.astro']) {
    const source = read(component);
    assert.match(source, /kevos-wordmark-orange-light\.svg/);
    assert.match(source, /kevos-wordmark-orange-dark\.svg/);
    assert.doesNotMatch(source, /src="\/brand\/kevos-logo-light-full\.png"/);
    assert.doesNotMatch(source, /brightness\(0\) invert\(1\)/);
    assert.match(source, /:root\[data-theme='dark'\]/);
  }
  assert.match(read('src/components/Header.astro'), /<SiteWordmark/);
  assert.match(read('src/components/Footer.astro'), /<SiteWordmark/);
  assert.match(read('src/components/ServiceMap.astro'), /<Logo/);
});

test('KEVOS assets use the approved orange logo and matching orange K favicon', () => {
  const light = read('public/brand/kevos-wordmark-orange-light.svg');
  const dark = read('public/brand/kevos-wordmark-orange-dark.svg');
  const icon = read('public/brand/kevos-chat-k-mark.svg');
  const favicon = read('public/brand/kevos-favicon-k-orange.svg');
  const config = read('src/config/site.ts');
  const layout = read('src/layouts/BaseLayout.astro');
  const generator = read('scripts/build-kevos-icons.mjs');
  const manifest = JSON.parse(read('public/site.webmanifest'));
  const pkg = JSON.parse(read('package.json'));

  assert.match(light, /fill="#c2410c"/);
  assert.match(dark, /fill="#ff7a29"/);
  assert.match(light, /viewBox="0 0 2069 284"/);
  assert.match(dark, /viewBox="0 0 2069 284"/);
  assert.match(icon, /fill="#c2410c"/);
  assert.match(favicon, /fill="#c2410c"/);
  assert.match(config, /ogImage: '\/brand\/kevos-social-orange\.png'/);
  assert.match(config, /icon: '\/brand\/kevos-favicon-k-orange-192\.png'/);
  assert.match(config, /iconLarge: '\/brand\/kevos-favicon-k-orange-512\.png'/);
  assert.match(layout, /kevos-favicon-k-orange\.svg/);
  assert.match(layout, /kevos-favicon-k-orange-32\.png/);
  assert.match(layout, /kevos-favicon-k-orange-180\.png/);
  assert.match(generator, /kevos-chat-k-mark\.svg/);
  assert.ok(pkg.scripts.build.startsWith('node scripts/build-kevos-icons.mjs && '));
  assert.deepEqual(manifest.icons.map((entry: { sizes: string }) => entry.sizes), ['192x192', '512x512']);

  for (const file of [
    'public/brand/kevos-wordmark-orange-light.png',
    'public/brand/kevos-wordmark-orange-light.webp',
    'public/brand/kevos-social-orange.png',
  ]) assert.ok(existsSync(file), `${file} present for production`);
});
