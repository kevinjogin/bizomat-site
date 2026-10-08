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
