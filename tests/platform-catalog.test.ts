// The BIZOMAT platform catalogue (src/data/platform-catalog.ts) and the CAD tool list (src/data/cad-tools.ts): facts the
// product pages and AI search rely on. They must match the applications' own code and point only at public pages.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CAD, PLATFORM_CATALOG, WORK } from '../src/data/platform-catalog.ts';
import { CAD_TOOL_GROUPS } from '../src/data/cad-tools.ts';
import { APP_URLS } from '../src/config/platform.ts';
import { buildDiscoveryIndex } from '../src/utils/discovery-index.ts';
import { prepare, search } from '../src/lib/discovery/search.ts';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

test('the CAD tool list is the CAD application\'s own list, tool for tool', () => {
  const catalog = read('apps/cad/opensketch/catalog.py');
  const names = [...catalog.matchAll(/\("((?:sw_\w+)|request_upload)",/g)].map((m) => m[1]);
  const ours = CAD_TOOL_GROUPS.flatMap((g) => g.tools.map((t) => t.name));
  assert.deepEqual(ours, names);
  assert.equal(ours.length, CAD.toolCount);
  assert.equal(new Set(ours).size, ours.length);
});

test('Project Management facts match the application', () => {
  const readme = read('apps/work/README.md');
  assert.match(readme, /25 column types/);
  assert.match(readme, /11 widget types/);
  for (const v of ['Table', 'Kanban', 'Calendar', 'Chart', 'Workload', 'Form', 'Map', 'Files']) assert.ok(readme.includes(v), `README lists the ${v} view`);
  assert.equal(WORK.views.length, 9);
});

test('every catalogue entry is public and points at a real page or an application\'s public documentation', () => {
  const ids = new Set<string>();
  for (const e of PLATFORM_CATALOG) {
    assert.ok(!ids.has(e.id), `${e.id} is unique`);
    ids.add(e.id);
    assert.ok(e.summary.length >= 30 && e.summary.length <= 300, `${e.id} summary length`);
    assert.equal(e.keywords, e.keywords.toLowerCase(), `${e.id} keywords are lower case`);
    if (e.url.startsWith('/')) {
      const path = e.url.split('#')[0].replace(/^\/|\/$/g, '');
      const page = path ? [`src/pages/${path}.astro`, `src/pages/${path}/index.astro`] : ['src/pages/index.astro'];
      assert.ok(page.some((p) => existsSync(join(process.cwd(), p))), `${e.id}: ${e.url} has a page`);
    } else {
      const u = new URL(e.url);
      assert.ok(Object.values(APP_URLS).some((a) => `${u.origin}${u.pathname}` === `${a}/docs`), `${e.id}: external links go only to an application's public docs`);
    }
    assert.doesNotMatch(`${e.title} ${e.summary}`, /@[a-z0-9-]+\.|password:|token:|\b\d{3}-\d{3}\b/i, `${e.id} holds no personal or secret data`);
  }
});

test('the search index carries the platform pages and nothing private', () => {
  const index = buildDiscoveryIndex();
  assert.equal(index.pages?.length, PLATFORM_CATALOG.length);
  for (const p of index.pages ?? []) assert.ok(p.u.startsWith('/') || Object.values(APP_URLS).some((a) => p.u.startsWith(a)), p.u);
  const text = JSON.stringify(index);
  assert.doesNotMatch(text, /workspace_id|r2_key|users\.json|bridge\.sqlite|oss_[a-z0-9]|osa_|osr_/i, 'no application data or keys');
});

test('the example searches return relevant products, tools and readings, each with a reason', () => {
  const e = prepare(buildDiscoveryIndex());
  const ask = (q: string) => search(e, { question: q });
  const tools = ask('Find a tool to calculate engineering dimensions.');
  assert.equal(tools.mode, 'results');
  assert.equal(tools.platform[0]?.url, '/tools/');
  assert.ok(tools.tools.length >= 3);
  const cad = ask('How can I automate SolidWorks?');
  assert.ok(cad.platform.some((h) => h.url === '/cad-automation/'), 'the CAD Automation page');
  const work = ask('Show me project management capabilities.');
  assert.equal(work.platform[0]?.url, '/work/');
  const guides = ask('Find guides about business automation.');
  assert.ok(guides.platform.some((h) => h.url === '/library/'));
  assert.ok(guides.readings.length >= 1);
  for (const o of [tools, cad, work, guides]) for (const h of [...o.platform, ...o.tools, ...o.readings]) assert.match(h.reason, /^(Matches|Related)/);
  // A product page never crowds out the calculators: a plain engineering question still gets its tools first.
  const bolt = ask('bolt torque');
  assert.equal(bolt.platform.length, 0);
  assert.ok(bolt.tools.length >= 3);
});
