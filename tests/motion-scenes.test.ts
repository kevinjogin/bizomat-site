import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

test('KEVOS inner-page visuals are native animated SVG, not flattened image cards', () => {
  const scene = read('src/components/MotionVisual.astro');
  assert.match(scene, /<svg\b/);
  assert.match(scene, /<animateMotion\b/);
  assert.match(scene, /ms__stream/);
  assert.match(scene, /prefers-reduced-motion:reduce/);
  assert.doesNotMatch(scene, /<img\b|\/visuals\/kevos-/);
  const pages: Record<string, string> = {
    services: 'src/pages/services.astro',
    'how-it-works': 'src/pages/how-it-works.astro',
    industries: 'src/pages/industries.astro',
    insights: 'src/layouts/InsightsIndex.astro',
    about: 'src/pages/about.astro',
    contact: 'src/pages/contact/index.astro',
    tools: 'src/pages/tools/index.astro',
  };
  for (const [name, path] of Object.entries(pages)) {
    assert.ok(read(path).includes(`<MotionVisual page="${name}"`), `${path} uses the native ${name} scene`);
  }
});

test('home keeps its existing Engineering Core diagram rather than another flat infographic', () => {
  const home = read('src/pages/index.astro');
  const graphic = read('src/components/ServiceMap.astro');
  assert.match(home, /<ServiceMap\s*\/>/);
  assert.doesNotMatch(home, /<MotionVisual page="home"/);
  assert.match(graphic, /smap__head::after/);
  assert.match(graphic, /smap-orbit/);
});

test('all KEVOS motion scenes use the same accessible light and dark palette as the homepage', () => {
  const scene = read('src/components/MotionVisual.astro');
  assert.match(scene, /--ms-bg:#ffffff/);
  assert.match(scene, /--ms-bg:#131412/);
  assert.match(scene, /--ms-blue:#1456e8/);
  assert.match(scene, /--ms-blue:#4f95ff/);
  assert.match(scene, /--ms-orange:#ff6a13/);
  assert.match(scene, /:global\(:root\[data-theme='dark'\]\) \.ms/);
  assert.match(scene, /\.ms__background \{ fill:var\(--ms-bg\)/);
  assert.match(scene, /\.ms__grid-path \{ stroke:var\(--ms-grid\)/);
  assert.match(scene, /ms__halo-start/);
  assert.doesNotMatch(scene, /KEVOS \/ 01|SYSTEM ACTIVE/);
  assert.doesNotMatch(scene, /<rect[^>]+fill="#090f18"/);
});
