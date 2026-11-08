import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { NAMED_ORGANISATIONS, PROJECTS, PROJECT_SECTORS, PROJECT_SERVICES, projectEnquiryHref } from '../src/data/projects.ts';

const read = (path: string) => readFileSync(path, 'utf8');

test('the proof of work keeps every published record, the 3 capital projects and the 11 hardware programs, newest first', () => {
  assert.equal(PROJECTS.length, 40);
  assert.equal(PROJECTS.filter((p) => p.sector === 'capital').length, 3);
  assert.equal(PROJECTS.filter((p) => p.sector === 'hardware').length, 11);
  assert.ok(!PROJECTS.some((p) => p.id === 'multi-project-coordination'), 'multi-project coordination is part of the capital projects');
  assert.ok(PROJECTS.filter((p) => p.sector === 'capital').every((p) => /toolroom/.test(p.brief)), 'each capital project covers the shared-toolroom coordination');
  assert.equal(new Set(PROJECTS.map((p) => p.id)).size, PROJECTS.length, 'ids are unique');
  const start = (p: (typeof PROJECTS)[number]) => Number(p.years.slice(0, 4));
  for (let i = 1; i < PROJECTS.length; i++) assert.ok(start(PROJECTS[i - 1]) >= start(PROJECTS[i]), `${PROJECTS[i].id} is in date order`);
  for (const sector of PROJECT_SECTORS) assert.ok(PROJECTS.some((p) => p.sector === sector.id), `${sector.label} has projects`);
  for (const org of NAMED_ORGANISATIONS) assert.ok(PROJECTS.some((p) => p.client.startsWith(org) || p.customer?.startsWith(org)), `${org} appears in a project`);
  const ids = new Set(PROJECTS.map((p) => p.id));
  for (const p of PROJECTS) for (const id of p.related ?? []) assert.ok(ids.has(id) && id !== p.id, `${p.id} links to related case study ${id}`);
  assert.ok(PROJECTS.filter((p) => p.featured).length >= 6, 'enough featured projects');
});

test('employer work is attributed as track record, and statuses never claim more than the schedule records', () => {
  for (const p of PROJECTS.filter((x) => x.client === 'Alchin Long Group')) {
    assert.match(p.employment ?? '', /founder of BIZOMAT.*employed by Alchin Long Group.*not a BIZOMAT client engagement/, `${p.id} states its employment context`);
    assert.doesNotMatch(JSON.stringify(p), /AZ[DT]\d|31-JS|\bpatent|\binvent|under budget|\d+ ?days? to/i, `${p.id} leaks nothing internal`);
  }
  for (const p of PROJECTS.filter((x) => x.sector === 'hardware')) {
    assert.ok(p.path && p.path.length >= 4 && p.objectives && p.challenges && p.validation && p.contribution, `${p.id} has the full case-study structure`);
    if (p.status === 'approved') {
      assert.equal(p.statusLabel, 'Customer approved');
      assert.match(p.outcome, /production release is not claimed/, `${p.id} does not claim production`);
    } else assert.equal(p.statusLabel, 'Released to production');
  }
  for (const held of ['abh', 'friction', 'dh60', 'ds2400', 'ds10', 'paraflow', 'link-arm', 'laser']) assert.ok(!PROJECTS.some((p) => p.id.includes(held)), `${held} stays a private draft`);
});

test('every case study is complete, written in the BIZOMAT voice and leads to an enquiry', () => {
  for (const p of PROJECTS) {
    for (const field of ['headline', 'title', 'client', 'about', 'industry', 'years', 'role', 'statusLabel', 'summary', 'brief', 'outcome', 'value'] as const) assert.ok(p[field].trim().length > 2, `${p.id}.${field}`);
    assert.ok(p.approach.length >= 4, `${p.id} explains its approach`);
    assert.ok(p.deliverables.length >= 6, `${p.id} lists its deliverables`);
    assert.ok(p.relevantIf.length >= 2 && p.skills.length >= 3, `${p.id} lists when it is relevant and its capabilities`);
    const copy = [p.headline, p.summary, p.brief, p.outcome, p.value, p.note ?? '', ...p.relevantIf, ...p.approach.flatMap((a) => [a.title, a.text])].join(' ');
    assert.doesNotMatch(copy, /(I|my|me|I've|I'm)/, `${p.id} has no first-person copy`);
    assert.doesNotMatch(copy, /GoCore/i);
    assert.doesNotMatch(`${copy} ${p.deliverables.join(' ')}`, /A\$|\$\s?\d|\d+k/, `${p.id} shows no commercial figures`);
    assert.ok(PROJECT_SERVICES[p.service], `${p.id} links to a BIZOMAT service`);
    assert.equal(projectEnquiryHref(p), `/contact/?service=${p.service}&project=${encodeURIComponent(p.title)}`);
  }
  const form = read('src/components/ContactForm.astro');
  assert.match(form, /get\('project'\)/, 'the contact form starts the enquiry from the project name');
});

test('the Engine Room joins About and Proof of Work, and every old address and in-page link reaches it', () => {
  const page = read('src/pages/engine-room.astro');
  assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1, 'one H1');
  assert.match(page, /<h1 id="er-title">The Engine Room<\/h1>/);
  for (const id of ['founder', 'principles', 'glance', 'cad-automation', 'project-management', 'resources', 'technical', 'tests', 'engineering-record', 'limits']) {
    assert.match(page, new RegExp(`id="${id}"`), `section #${id}`);
  }
  assert.match(page, /<ProofOfWork \/>/, 'the engineering record');
  assert.match(page, /Founder, BIZOMAT/, 'the founder letter is signed');
  assert.match(page, /<FounderPortrait name=\{PLATFORM\.founder\} \/>/, 'the founder portrait sits under the founder heading');
  const portrait = read('src/components/visuals/FounderPortrait.astro');
  assert.match(portrait, /prefers-reduced-motion: no-preference/, 'the portrait animates only when motion is welcome');
  assert.match(portrait, /<img class="fp__photo" src="\/engine-room\/founder\.webp" alt=/, 'the founder photo, with alt text');
  assert.ok(existsSync('public/engine-room/founder.webp'), 'the cut-out photo is published');
  assert.doesNotMatch(portrait, /<script|style="/, 'no script or inline style (CSP)');
  assert.match(page, /VERIFICATION\.map/, 'the test record');
  assert.match(page, /'@type': 'AboutPage'/);
  assert.match(read('src/config/site.ts'), /\{ href: '\/engine-room\/', label: 'The Engine Room' \}/);
  for (const gone of ['src/pages/about.astro', 'src/pages/proof-of-work.astro']) assert.ok(!existsSync(gone), `${gone} is merged into the Engine Room`);
  const redirects = read('public/_redirects').split(/\r?\n/).map((l) => l.trim().split(/\s+/));
  for (const from of ['/about', '/about/', '/proof-of-work', '/proof-of-work/']) {
    assert.ok(redirects.some(([f, to, code]) => f === from && to === '/engine-room/' && code === '301'), `${from} redirects to /engine-room/`);
  }
  // Old in-page links keep their #part through the redirect; the two that changed meaning are forwarded.
  assert.ok(page.includes("work: 'engineering-record', cad: 'cad-automation'"), 'old /about/#work and /proof-of-work/#cad links are forwarded');
  const home = read('src/pages/index.astro');
  assert.doesNotMatch(home, /<ProofOfWork/, 'the homepage links to the proof rather than embedding it');
  assert.ok(home.includes("id.startsWith('case-') ? `/engine-room/#${id}`"), 'old /#case-<id> links open the case study');
  assert.ok(home.includes("work: '/engine-room/#engineering-record'"), 'old /#work links open the record');
  assert.ok(home.includes("about: '/engine-room/'"), 'old /#about links open the Engine Room');
  for (const f of ['src/pages/index.astro', 'src/pages/cad-automation.astro', 'src/pages/work.astro', 'src/config/site.ts', 'src/data/platform-catalog.ts', 'src/pages/assistant-knowledge.json.ts', 'apps/cad/opensketch/brand.py']) {
    assert.doesNotMatch(read(f), /["'`(]\/(about|proof-of-work)\//, `${f} links to the Engine Room, not the old pages`);
  }
  const component = read('src/components/ProofOfWork.astro');
  assert.doesNotMatch(component, /\sstyle=/);
  assert.match(component, /aria-pressed/);
  assert.match(component, /id=\{`case-\$\{p\.id\}`\}/, 'every case study has a deep-link anchor');
  assert.match(component, /type="search"/, 'the work can be searched');
  assert.match(component, /hashchange/, 'deep links open the case study');
});

test('every project has its BIZOMAT-coloured animated visual', () => {
  const dimensions = JSON.parse(read('src/data/work-visuals.json')) as Record<string, [number, number]>;
  for (const p of PROJECTS) {
    assert.ok(p.visualAlt.trim().length > 10, `${p.id} describes its image`);
    if (p.illustration) {
      assert.match(read('src/components/WorkIllustration.astro'), new RegExp(`kind === '${p.illustration}'`), `${p.id} has its illustration`);
      assert.match(read('src/components/ProofOfWork.astro'), /Not an image of the actual project/, `${p.id} illustration is labelled`);
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
