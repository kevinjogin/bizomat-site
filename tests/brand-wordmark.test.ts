import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('KEVOS orange wordmark replaces the navy asset across the header, footer and homepage core', () => {
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

test('new wordmark assets match the orange palette without altering the K favicon', () => {
  const light = read('public/brand/kevos-wordmark-orange-light.svg');
  const dark = read('public/brand/kevos-wordmark-orange-dark.svg');
  const config = read('src/config/site.ts');
  assert.match(light, /fill="#c2410c"/);
  assert.match(dark, /fill="#ff7a29"/);
  assert.match(light, /viewBox="0 0 2069 284"/);
  assert.match(dark, /viewBox="0 0 2069 284"/);
  assert.match(config, /ogImage: '\/brand\/kevos-social-orange\.png'/);
  assert.match(config, /icon: '\/brand\/kevos-favicon-k-v4\.png'/);
  for (const file of [
    'public/brand/kevos-wordmark-orange-light.png',
    'public/brand/kevos-wordmark-orange-light.webp',
    'public/brand/kevos-social-orange.png'
  ]) assert.ok(existsSync(file), `${file} present for production`);
});
