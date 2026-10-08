import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('pages open in the dark theme, even before JavaScript runs', () => {
  for (const file of ['src/layouts/BaseLayout.astro', 'src/pages/chat.astro']) {
    const source = read(file);
    assert.match(source, /<html lang="en-AU" data-theme="dark">/, `${file} should render data-theme="dark"`);
    assert.doesNotMatch(source, /prefers-color-scheme: dark\)'\)\.matches/, `${file} must not follow the OS preference`);
    assert.doesNotMatch(source, /gocore-theme/, `${file} must not use the retired theme key`);
  }
});

test('light theme is remembered only for the current browser session', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const toggle = read('src/components/ThemeToggle.astro');
  assert.match(layout, /sessionStorage\.getItem\('kevos-theme'\) === 'light'/);
  assert.match(toggle, /sessionStorage\.setItem\('kevos-theme', next\)/);
  assert.doesNotMatch(toggle, /localStorage\.setItem/);
  assert.doesNotMatch(layout, /localStorage\.getItem\('kevos-theme'\)/);
});
