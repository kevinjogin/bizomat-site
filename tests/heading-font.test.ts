import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// BIZOMAT typography (5 Nov 2026): H1 to H6 use Oxanium, the display face that matches the chamfered BIZOMAT wordmark;
// body text, labels and buttons use Inter Tight; long-form Library prose keeps Source Serif 4. Fonts are self-hosted.
const css = () => readFileSync('src/styles/global.css', 'utf8');
const tokens = () => readFileSync('src/styles/bizomat/tokens.css', 'utf8');

test('all H1–H6 headings use the BIZOMAT display face (Oxanium), body text uses Inter Tight', () => {
  const styles = css();
  assert.match(styles, /--font-sans:\s*'Inter Tight Variable'/);
  assert.match(styles, /--font-display:\s*var\(--bz-font-display\)/);
  assert.match(tokens(), /--bz-font-display:\s*'Oxanium'/);
  assert.match(tokens(), /@font-face\s*\{[^}]*font-family:\s*'Oxanium'[^}]*src:\s*url\('\/fonts\/oxanium-latin\.woff2'\)/s);
  assert.match(styles, /h1, h2, h3, h4, h5, h6\s*\{[^}]*font-family:\s*var\(--font-display\)\s*!important/s);
});

test('the layout loads the shared tokens first and preloads both self-hosted fonts', () => {
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  assert.ok(layout.indexOf("styles/bizomat/tokens.css") < layout.indexOf("styles/global.css"), 'tokens before the site styles');
  assert.match(layout, /rel="preload" href=\{interTight\}/);
  assert.match(layout, /rel="preload" href="\/fonts\/oxanium-latin\.woff2" as="font" type="font\/woff2" crossorigin/);
  assert.doesNotMatch(layout, /fonts\.googleapis|gocore-display/i, 'no third-party or retired fonts');
});
