import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { NAMED_ORGANISATIONS, PROJECTS, PROJECT_SECTORS, PROJECT_SERVICES, projectEnquiryHref } from '../src/data/projects.ts';

const read = (path: string) => readFileSync(path, 'utf8');

test('the proof of work keeps 26 published project records and the 3 capital projects, newest first', () => {
  assert.equal(PROJECTS.length, 29);
  assert.equal(PROJECTS.filter((p) => p.sector === 'capital').length, 3);
  assert.ok(!PROJECTS.some((p) => p.id === 'multi-project-coordination'), 'multi-project coordination is part of the capital projects');
  assert.ok(PROJECTS.filter((p) => p.sector === 'capital').every((p) => /toolroom/.test(p.brief)), 'each capital project covers the shared-toolroom coordination');
  assert.equal(new Set(PROJECTS.map((p) => p.id)).size, PROJECTS.length, 'ids are unique');
  const start = (p: (typeof PROJECTS)[number]) => Number(p.years.slice(0, 4));
  for (let i = 1; i < PROJECTS.length; i++) assert.ok(start(PROJECTS[i - 1]) >= start(PROJECTS[i]), `${PROJECTS[i].id} is in date order`);
  for (const sector of PROJECT_SECTORS) assert.ok(PROJECTS.some((p) => p.sector === sector.id), `${sector.label} has projects`);
  for (const org of NAMED_ORGANISATIONS) assert.ok(PROJECTS.some((p) => p.client.startsWith(org)), `${org} appears in a project`);
});

test('every case study is complete, written in the KEVOS voice and leads to an enquiry', () => {
  for (const p of PROJECTS) {
    for (const field of ['headline', 'title', 'client', 'about', 'industry', 'years', 'role', 'statusLabel', 'summary', 'brief', 'outcome', 'value'] as const) assert.ok(p[field].trim().length > 2, `${p.id}.${field}`);
    assert.ok(p.approach.length >= 4, `${p.id} explains its approach`);
    assert.ok(p.deliverables.length >= 6, `${p.id} lists its deliverables`);
    assert.ok(p.relevantIf.length >= 2 && p.skills.length >= 3, `${p.id} lists when it is relevant and its capabilities`);
    const copy = [p.headline, p.summary, p.brief, p.outcome, p.value, p.note ?? '', ...p.relevantIf, ...p.approach.flatMap((a) => [a.title, a.text])].join(' ');
    assert.doesNotMatch(copy, /(I|my|me|I've|I'm)/, `${p.id} has no first-person copy`);
    assert.doesNotMatch(copy, /GoCore/i);
    assert.doesNotMatch(`${copy} ${p.deliverables.join(' ')}`, /A\$|\$\s?\d|\d+k/, `${p.id} shows no commercial figures`);
    assert.ok(PROJECT_SERVICES[p.service], `${p.id} links to a KEVOS service`);
    assert.equal(projectEnquiryHref(p), `/contact/?service=${p.service}&project=${encodeURIComponent(p.title)}`);
  }
  const form = read('src/components/ContactForm.astro');
  assert.match(form, /get\('project'\)/, 'the contact form starts the enquiry from the project name');
});

test('the homepage shows the proof of work as a section with its own navigation link', () => {
  const home = read('src/pages/index.astro');
  assert.match(home, /\{id:'resources',label:'Resources'\},\s*\{id:'work',label:'Proof of work'\}/, 'nav link follows Resources');
  assert.match(home, /<Section index="08" label="Proof of work"[^>]*id="work"/);
  assert.match(home, /<ProofOfWork \/>/);
  assert.match(home, /href="#work"/, 'About links to the proof of work');
  assert.match(read('src/config/site.ts'), /\{ href: '\/#work', label: 'Proof of Work' \}/);
  const component = read('src/components/ProofOfWork.astro');
  assert.doesNotMatch(component, /\sstyle=/);
  assert.match(component, /aria-pressed/);
});

test('every project has its KEVOS-coloured animated visual', () => {
  const dimensions = JSON.parse(read('src/data/work-visuals.json')) as Record<string, [number, number]>;
  for (const p of PROJECTS) {
    assert.ok(p.visualAlt.trim().length > 10, `${p.id} describes its image`);
    if (p.illustration) {
      assert.match(read('src/components/WorkIllustration.astro'), new RegExp(`kind === '${p.illustration}'`), `${p.id} has its illustration`);
      continue;
    }
    assert.ok(dimensions[p.id], `${p.id} has visual dimensions`);
    for (const layer of ['base', 'lines']) for (const width of [480, 960]) assert.ok(existsSync(`public/proof-of-work/${p.id}-${layer}-${width}.webp`), `${p.id} ${layer} ${width}`);
  }
  assert.match(read('src/components/ProofOfWork.astro'), /Not an image of the actual project/, 'illustrations are labelled as illustrative');
  assert.match(read('src/components/WorkVisual.astro'), /Illustrative/);
  const visual = read('src/components/WorkVisual.astro');
  assert.match(visual, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(visual, /\sstyle=/);
});
