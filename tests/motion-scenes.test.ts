import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');

test('all seven KEVOS pages use a purpose-built responsive motion scene', () => {
  const motion = read('src/components/MotionVisual.astro');
  const orbit = read('src/components/ServiceMap.astro');
  assert.match(motion, /<ServiceMap variant=/);
  assert.match(motion, /<figure class:list=/);
  assert.match(motion, /<svg\b/);
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(orbit, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(motion, /<img\b|\/visuals\/kevos-/);

  const pages: Record<string, string> = {
    services: 'src/pages/services.astro',
    'how-it-works': 'src/pages/how-it-works.astro',
    industries: 'src/pages/industries.astro',
    about: 'src/pages/about.astro',
    contact: 'src/pages/contact/index.astro',
    tools: 'src/pages/tools/index.astro',
    reados: 'src/pages/reados/index.astro',
  };
  for (const [name, path] of Object.entries(pages)) {
    assert.ok(read(path).includes('<MotionVisual page="' + name + '"'), path + ' uses the ' + name + ' scene');
  }
  // The WORKOS and READOS libraries use the compact banner version, so search and topics stay above the fold.
  for (const path of ['src/pages/tools/index.astro', 'src/pages/reados/index.astro']) assert.match(read(path), /<MotionVisual page="(tools|reados)" slot="visual" compact/, path);
  assert.match(motion, /prefers-reduced-motion: reduce\)\{\s*\.mv--compact \*/, 'compact scenes stop for reduced motion');
});

test('Factory Fix and the assessment have their own reduced-motion-safe hero scenes', () => {
  const pages = { 'src/pages/factory-fix.astro': ['FactoryFixArt', 'src/components/FactoryFixArt.astro'], 'src/pages/assessment/index.astro': ['AssessmentHeroArt', 'src/components/assessment/AssessmentHeroArt.astro'] };
  for (const [page, [name, file]] of Object.entries(pages)) {
    assert.match(read(page), new RegExp(`<${name}\\b`), `${page} shows ${name}`);
    const art = read(file);
    assert.match(art, /<svg\b/);
    assert.match(art, /prefers-reduced-motion: no-preference/);
    assert.doesNotMatch(art, /<script|<img\b/);
  }
});

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
  assert.match(footer, /<a href=\{SITE\.tradeMark\.record\} target="_blank" rel="noopener noreferrer"/);
  assert.match(footer, /opens in a new tab/);
});

test('home, services and about share the genuine four-square KEVOS orbit', () => {
  const home = read('src/pages/index.astro');
  const orbit = read('src/components/ServiceMap.astro');
  const motion = read('src/components/MotionVisual.astro');
  assert.match(home, /<ServiceMap\s*\/>/);
  assert.match(motion, /page === 'services' \|\| page === 'about'/);
  assert.match(orbit, /--cycle: 8s/);
  assert.match(orbit, /smap__spinner/);
  assert.match(orbit, /smap__head::after/);
  assert.match(orbit, /smap-orbit/);
  assert.match(orbit, /<Logo/);
  assert.match(orbit, /variant === 'services'/);
  assert.doesNotMatch(orbit, /insights/);
  assert.match(orbit, /about: \[/);
});

test('other KEVOS scenes have distinct content for industries, process, tools and contact', () => {
  const motion = read('src/components/MotionVisual.astro');
  assert.match(motion, /INDUSTRIES\.slice\(0, 6\)/);
  assert.match(motion, /PROCESS\.map/);
  assert.match(motion, /mv__sectors/);
  assert.match(motion, /mv__pathway/);
  assert.match(motion, /mv__tool-scene/);
  assert.match(motion, /mv__contact-scene/);
  assert.match(motion, /<Logo label=""/);
});

test('all motion panels share orange branding, neutral grids and both accessible themes', () => {
  const motion = read('src/components/MotionVisual.astro');
  const orbit = read('src/components/ServiceMap.astro');
  assert.match(motion, /--m-panel:#ffffff/);
  assert.match(motion, /--m-panel:#131412/);
  assert.match(motion, /--m-orange:#c2410c/);
  assert.match(motion, /--m-orange:#ff8c47/);
  assert.match(motion, /:root\[data-theme='dark'\]/);
  assert.match(motion, /border-radius:20px/);
  assert.match(motion, /border-radius:14px/);
  assert.match(orbit, /--grid: rgb\(255 106 19 \/ 0\.07\)/);
  assert.doesNotMatch(motion, /#1456e8|#4f95ff|#2d8aff|<text[^>]*>KEVOS<\/text>/i);
  assert.doesNotMatch(motion, /KEVOS \/ 01|SYSTEM ACTIVE/);
});
