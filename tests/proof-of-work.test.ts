import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { NAMED_ORGANISATIONS, PROJECTS, PROJECT_SECTORS } from '../src/data/projects.ts';

const read = (path: string) => readFileSync(path, 'utf8');

test('the proof of work keeps all 27 published project records, newest first', () => {
  assert.equal(PROJECTS.length, 27);
  assert.equal(new Set(PROJECTS.map((p) => p.id)).size, PROJECTS.length, 'ids are unique');
  const start = (p: (typeof PROJECTS)[number]) => Number(p.years.slice(0, 4));
  for (let i = 1; i < PROJECTS.length; i++) assert.ok(start(PROJECTS[i - 1]) >= start(PROJECTS[i]), `${PROJECTS[i].id} is in date order`);
  for (const sector of PROJECT_SECTORS) assert.ok(PROJECTS.some((p) => p.sector === sector.id), `${sector.label} has projects`);
  for (const org of NAMED_ORGANISATIONS) assert.ok(PROJECTS.some((p) => p.client.startsWith(org)), `${org} appears in a project`);
});

test('every project record is complete and written in the KEVOS voice', () => {
  for (const p of PROJECTS) {
    for (const field of ['title', 'client', 'industry', 'years', 'role', 'statusLabel', 'summary', 'challenge', 'outcome'] as const) assert.ok(p[field].trim().length > 2, `${p.id}.${field}`);
    assert.ok(p.contribution.length >= 3 && p.skills.length >= 3, `${p.id} lists its work and capabilities`);
    const copy = [p.summary, p.challenge, p.outcome, ...p.contribution].join(' ');
    assert.doesNotMatch(copy, /\b(I|my|me|I've|I'm)\b/, `${p.id} has no first-person copy`);
    assert.doesNotMatch(copy, /GoCore/i);
  }
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
