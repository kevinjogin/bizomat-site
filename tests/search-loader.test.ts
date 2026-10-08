import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(path, 'utf8');

test('search loads Pagefind from an inline module the bundler cannot rewrite', () => {
  const page = read('src/pages/search.astro');
  assert.match(page, /<script is:inline type="module">/);
  assert.match(page, /await import\('\/pagefind\/pagefind\.js'\)/);
  assert.doesNotMatch(page, /<script>/, 'a bundled script wraps import() in a preload helper that breaks once inlined');
  assert.doesNotMatch(page, /npm run build/, 'visitors should not see build instructions');
});

test('the post-build check rejects unresolved Vite preload placeholders', () => {
  assert.match(read('scripts/postbuild.mjs'), /__VITE_PRELOAD__/);
});
