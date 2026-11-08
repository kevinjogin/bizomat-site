import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Owner decision, 5 Nov 2026 (BIZOMAT 2.0 redesign): pages open in the light (warm white) theme. Dark is the visitor's
// choice for the current browser session only. Replaces the 8 Oct 2026 dark-by-default rule.
const read = (path: string) => readFileSync(path, 'utf8');

test('pages open in the light theme, even before JavaScript runs', () => {
  for (const file of ['src/layouts/BaseLayout.astro']) {
    const source = read(file);
    assert.match(source, /<html lang="en-AU" data-theme="light">/, `${file} should render data-theme="light"`);
    assert.doesNotMatch(source, /prefers-color-scheme: dark\)'\)\.matches/, `${file} must not follow the OS preference`);
    assert.doesNotMatch(source, /gocore-theme/, `${file} must not use the retired theme key`);
  }
  assert.doesNotMatch(read('src/styles/global.css'), /prefers-color-scheme: dark/, 'the stylesheet does not switch to dark on its own');
});

test('dark theme is remembered only for the current browser session', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const toggle = read('src/components/ThemeToggle.astro');
  assert.match(layout, /sessionStorage\.getItem\('bizomat-theme'\) === 'dark'/);
  assert.match(toggle, /sessionStorage\.setItem\('bizomat-theme', next\)/);
  assert.doesNotMatch(toggle, /localStorage\.setItem/);
  assert.doesNotMatch(layout, /localStorage\.getItem\('(kevos|bizomat)-theme'\)/);
  assert.match(layout, /localStorage\.removeItem\('kevos-theme'\)/, 'the retired key is cleared');
});
