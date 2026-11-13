import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Owner decision, 13 Nov 2026 (replaces "light by default, dark for the session only" of 5 Nov 2026): every page opens in
// the computer's system theme; a choice made with the theme switch is remembered on that computer only (localStorage
// "bizomat-theme", which the applications under bizomat.ai share), never on the account, so another computer signed in
// to the same account follows its own system theme.
const read = (path: string) => readFileSync(path, 'utf8');

test('pages open in the system theme, or the choice made on this computer, before the first paint', () => {
  for (const file of ['src/layouts/BaseLayout.astro', 'src/pages/chat.astro']) {
    const source = read(file);
    // Without JavaScript the page is light (the attribute); the inline script decides before anything is painted.
    assert.match(source, /<html lang="en-AU" data-theme="light">/, `${file} renders a light fallback`);
    assert.match(source, /localStorage\.getItem\('bizomat-theme'\)/, `${file} reads the choice made on this computer`);
    assert.match(source, /matchMedia\('\(prefers-color-scheme: dark\)'\)\.matches \? 'dark' : 'light'/, `${file} follows the system theme otherwise`);
    assert.doesNotMatch(source, /sessionStorage\.getItem/, `${file} no longer keeps the theme per session`);
    assert.doesNotMatch(source, /gocore-theme/, `${file} must not use the retired theme key`);
  }
  assert.doesNotMatch(read('src/styles/global.css'), /prefers-color-scheme: dark/, 'the stylesheet itself follows data-theme, set by the script');
});

test('a choice is remembered on this computer and kept in step across tabs; without one the system theme is followed', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  const toggle = read('src/components/ThemeToggle.astro');
  assert.match(toggle, /localStorage\.setItem\(KEY, next\)/);
  assert.match(toggle, /const KEY = 'bizomat-theme'/);
  assert.doesNotMatch(toggle, /sessionStorage/);
  assert.match(toggle, /addEventListener\('change'/, 'follows system changes while no choice is made');
  assert.match(toggle, /addEventListener\('storage'/, 'a choice in another tab applies here');
  assert.match(layout, /localStorage\.removeItem\('kevos-theme'\)/, 'the retired key is cleared');
  // Nothing about the theme is sent to the server: it is never stored on an account.
  assert.doesNotMatch(toggle, /fetch\(/);
});
