// WORKOS input guides: coverage check and field-level inventory.
//
//   node scripts/tools/input-guides.mjs check [--file handbook30 ...]   report fields without a usable guide (exit 1 if any)
//   node scripts/tools/input-guides.mjs inventory                       also write docs/tool-input-guides-inventory.json
//
// A field counts as covered only when inputs-<file>.js gives it a definition that passes checkEntry() in
// public/tools/input-guides.js (not empty, not the label repeated, not a generic instruction or placeholder),
// or an explicit `unclear` note explaining why its meaning could not be established.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';

const ROOT = process.cwd();
const DIR = join(ROOT, 'public', 'tools');
const loader = readFileSync(join(ROOT, 'src', 'utils', 'workos-tools.ts'), 'utf8');
const FILES = /export const TOOL_FILES = \[([^\]]+)\]/.exec(loader)[1].match(/'([a-z0-9]+)'/g).map((s) => s.slice(1, -1));

export function load() {
  const sb = { window: {} };
  const fileOf = {};
  for (const f of FILES) {
    const before = (sb.window.GOCORE_TOOLS || []).length;
    runInNewContext(readFileSync(join(DIR, `data-${f}.js`), 'utf8'), sb, { filename: `data-${f}.js` });
    for (const t of sb.window.GOCORE_TOOLS.slice(before)) fileOf[t.id] = f;
  }
  for (const f of FILES) runInNewContext(readFileSync(join(DIR, `guides-${f}.js`), 'utf8'), sb, { filename: `guides-${f}.js` });
  const inputFiles = {};
  for (const f of FILES) {
    const p = join(DIR, `inputs-${f}.js`);
    inputFiles[f] = existsSync(p);
    if (inputFiles[f]) runInNewContext(readFileSync(p, 'utf8'), sb, { filename: `inputs-${f}.js` });
  }
  runInNewContext(readFileSync(join(DIR, 'input-guides.js'), 'utf8'), sb, { filename: 'input-guides.js' });
  return { tools: sb.window.GOCORE_TOOLS, guides: sb.window.WORKOS_GUIDES, inputs: sb.window.WORKOS_INPUTS || {}, ig: sb.window.WORKOS_INPUT_GUIDE, fileOf, inputFiles };
}

const standalone = (g) => Boolean(g?.purpose && g.inputs && (g.method?.length ?? 0) >= 2 && (g.limitations?.length ?? 0) >= 1);

export function audit(only) {
  const { tools, guides, inputs, ig, fileOf, inputFiles } = load();
  const rows = [];
  const problems = [];
  for (const t of tools) {
    const file = fileOf[t.id];
    if (only && !only.includes(file)) continue;
    const entries = inputs[t.id] || {};
    const keys = new Set(t.fields.filter((f) => f.type !== 'heading').map((f) => f.key));
    for (const k of Object.keys(entries)) if (!keys.has(k)) problems.push(`${file} ${t.id}.${k}: entry for a field that does not exist`);
    const fields = [];
    const whatSeen = new Map();
    for (const f of t.fields) {
      if (f.type === 'heading') continue;
      const e = entries[f.key];
      const p = ig.checkEntry(f, e);
      // The same definition for two differently named fields of one tool is a sign of copy-paste, not explanation.
      if (e?.what) {
        const prev = whatSeen.get(e.what);
        if (prev && prev.label.replace(/\b[A-D1-4]\b/g, '') !== f.label.replace(/\b[A-D1-4]\b/g, '')) p.push(`same definition as "${prev.label}"`);
        whatSeen.set(e.what, f);
      }
      for (const x of p) problems.push(`${file} ${t.id}.${f.key} (${f.label}): ${x}`);
      const fig = e && !e.unclear ? (e.fig === 'none' ? null : e.fig || ig.autoKind(f)) : null;
      fields.push({
        key: f.key, label: f.label, type: f.type || 'number', unit: f.unit || '', min: f.min ?? null, max: f.max ?? null, default: f.default ?? null,
        options: f.type === 'select' ? f.options.length : undefined,
        existingSource: Boolean(guides[t.id]?.inputs?.[f.key]), existingHint: Boolean(f.hint),
        status: p.length ? 'missing' : e.unclear ? 'exception' : 'covered',
        illustration: fig, effect: Boolean(e?.effect), tip: Boolean(e?.tip),
        issue: p.length ? p.join('; ') : e?.unclear || undefined,
      });
    }
    const covered = fields.filter((f) => f.status === 'covered').length;
    const exceptions = fields.filter((f) => f.status === 'exception').length;
    rows.push({
      id: t.id, name: t.name, category: t.category, collection: t.collection || 'WORKOS',
      route: `/tools/?tool=${t.id}`, page: standalone(guides[t.id]) ? `/tools/${t.id}/` : null,
      source: { data: `public/tools/data-${file}.js`, calc: `public/tools/calc-${file}.js`, guide: `public/tools/guides-${file}.js`, inputs: inputFiles[file] ? `public/tools/inputs-${file}.js` : null },
      headings: t.fields.filter((f) => f.type === 'heading').length,
      inputs: fields.length, covered, exceptions, illustrated: fields.filter((f) => f.illustration).length,
      status: covered + exceptions === fields.length ? 'complete' : covered ? 'partial' : 'not started',
      fields,
    });
  }
  return { rows, problems, files: FILES };
}

function summary(rows) {
  const s = { tools: rows.length, toolsComplete: 0, inputs: 0, covered: 0, exceptions: 0, illustrated: 0, withEffect: 0, withTip: 0, figures: {} };
  for (const r of rows) {
    if (r.status === 'complete') s.toolsComplete++;
    s.inputs += r.inputs; s.covered += r.covered; s.exceptions += r.exceptions; s.illustrated += r.illustrated;
    for (const f of r.fields) {
      if (f.effect) s.withEffect++;
      if (f.tip) s.withTip++;
      if (f.illustration) s.figures[f.illustration] = (s.figures[f.illustration] || 0) + 1;
    }
  }
  return s;
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const [cmd = 'check', ...rest] = process.argv.slice(2);
  const only = rest.includes('--file') ? rest.filter((x) => x !== '--file') : null;
  const { rows, problems } = audit(only);
  const s = summary(rows);
  if (cmd === 'inventory') {
    // Browser results from input-guides-browser.mjs, when it has been run against a build of the same files.
    const bpath = join(ROOT, 'docs', 'tool-input-guides-browser.json');
    const browser = existsSync(bpath) ? JSON.parse(readFileSync(bpath, 'utf8')) : null;
    const byId = new Map((browser?.results || []).map((r) => [r.id, r]));
    const failures = new Map((browser?.failures || []).map((r) => [r.id, r.issues]));
    for (const r of rows) {
      const b = byId.get(r.id);
      r.tests = {
        coverageCheck: r.status === 'complete' ? 'pass' : 'fail',
        unitTests: 'tests/tool-input-guides.test.ts (render, association, accessibility markup and unchanged results for every tool)',
        browser: b ? (b.ok ? 'pass' : 'fail') : 'not run',
        browserIssues: failures.get(r.id),
      };
    }
    s.browser = browser ? { generated: browser.generated, tools: browser.tools, passed: browser.passed, figures: browser.figures, sample: browser.sample.length } : null;
    const out = {
      generated: new Date().toISOString().slice(0, 10),
      generator: 'node scripts/tools/input-guides.mjs inventory',
      expectedTools: 914,
      summary: s,
      tools: rows,
    };
    // One tool per line keeps the file diffable without pretty-printing every field.
    const head = JSON.stringify({ ...out, tools: [] }, null, 1).replace(/"tools": \[\]\n\}$/, '"tools": [');
    writeFileSync(join(ROOT, 'docs', 'tool-input-guides-inventory.json'), `${head}\n${rows.map((r) => JSON.stringify(r)).join(',\n')}\n]}\n`);
  }
  console.log(`tools ${s.tools} (complete ${s.toolsComplete}) · inputs ${s.inputs} · covered ${s.covered} · exceptions ${s.exceptions} · illustrated ${s.illustrated} · problems ${problems.length}`);
  for (const p of problems.slice(0, 200)) console.log(`  ${p}`);
  if (problems.length > 200) console.log(`  … ${problems.length - 200} more`);
  process.exitCode = problems.length ? 1 : 0;
}
