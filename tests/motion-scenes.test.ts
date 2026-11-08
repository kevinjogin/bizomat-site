import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

test('privacy, terms and disclaimer each show their own legal scene', () => {
  const art = read('src/components/LegalArt.astro');
  assert.match(read('src/layouts/LegalLayout.astro'), /<LegalArt scene=\{scene\} slot="visual"/);
  for (const scene of ['privacy', 'terms', 'disclaimer']) {
    assert.match(read(`src/pages/${scene}.astro`), new RegExp(`scene="${scene}"`), `${scene} page sets its scene`);
    assert.ok(art.includes(`scene === '${scene}'`), `${scene} scene exists`);
  }
  assert.match(art, /prefers-reduced-motion: no-preference/);
  assert.doesNotMatch(art, /<script|<img\b/);
});

test('the footer trade mark record opens in a new tab safely', () => {
  const footer = read('src/components/Footer.astro');
  assert.match(footer, /<a href=\{tm\.record\} target="_blank" rel="noopener noreferrer"/);
  assert.match(footer, /opens in a new tab/);
});

