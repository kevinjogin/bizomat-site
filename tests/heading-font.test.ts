import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const css = () => readFileSync('src/styles/global.css', 'utf8');

test('all H1–H6 headings use the KEVOS angular display family', () => {
  const styles = css();
  assert.match(styles, /font-family:\s*'KEVOS Display'/);
  assert.match(styles, /--font-display:\s*'KEVOS Display'/);
  assert.match(styles, /h1, h2, h3, h4, h5, h6\s*\{[^}]*font-family:\s*var\(--font-display\)\s*!important/s);
  assert.match(styles, /h3, h4, h5, h6\s*\{\s*font-weight:\s*700/);
  assert.match(styles, /--font-sans:\s*'Inter Tight Variable'/);
});

test('KEVOS heading font is self-hosted, licensed and preloaded', () => {
  assert.ok(existsSync('public/fonts/oxanium-variable.ttf'));
  assert.ok(existsSync('public/fonts/OFL-Oxanium.txt'));
  const license = readFileSync('public/fonts/OFL-Oxanium.txt', 'utf8');
  assert.match(license, /SIL OPEN FONT LICENSE/i);
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  assert.match(layout, /fonts\/oxanium-variable\.ttf/);
  assert.doesNotMatch(layout, /preload[^\n]*gocore-display/);
  assert.doesNotMatch(css(), /@font-face[^}]*GoCore Display/s);
});
