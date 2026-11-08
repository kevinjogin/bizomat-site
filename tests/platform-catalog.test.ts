// The BIZOMAT platform catalogue (src/data/platform-catalog.ts) and the CAD tool list (src/data/cad-tools.ts): facts the
// product pages rely on. They must match the applications' own code.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CAD, WORK } from '../src/data/platform-catalog.ts';
import { CAD_TOOL_GROUPS } from '../src/data/cad-tools.ts';

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
