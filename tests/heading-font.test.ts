import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Owner decision, 5 Nov 2026 (KEVOS 2.0 redesign): one type family across the site. Headings, body, labels and buttons
// use Inter Tight; long-form Library prose keeps Source Serif 4. The KEVOS® wordmark is a fixed SVG, not a font.
const css = () => readFileSync('src/styles/global.css', 'utf8');

test('all H1–H6 headings use the one site family (Inter Tight)', () => {
  const styles = css();
  assert.match(styles, /--font-sans:\s*'Inter Tight Variable'/);
  assert.match(styles, /--font-display:\s*var\(--font-sans\)/);
  assert.match(styles, /h1, h2, h3, h4, h5, h6\s*\{[^}]*font-family:\s*var\(--font-display\)\s*!important/s);
  assert.doesNotMatch(styles, /@font-face[^}]*(KEVOS Display|GoCore Display)/s, 'no second display face is loaded');
});

test('the layout preloads only the site font, not the retired display face', () => {
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  assert.match(layout, /rel="preload" href=\{interTight\}/);
  assert.doesNotMatch(layout, /oxanium|gocore-display/i);
});
