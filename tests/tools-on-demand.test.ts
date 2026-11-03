import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';

// WORKOS loads each tool's data-, guides-, inputs- and calc-<file>.js only when the tool opens, so a phone downloads
// one tool's scripts instead of all 1052 before a calculator link shows anything (see public/tools/ui.js).

const DIR = join(process.cwd(), 'public', 'tools');
const read = (name: string) => readFileSync(join(DIR, name), 'utf8');
const loader = readFileSync(join(process.cwd(), 'src', 'utils', 'workos-tools.ts'), 'utf8');
const FILES = /export const TOOL_FILES = \[([^\]]+)\]/.exec(loader)![1].match(/'([a-z0-9]+)'/g)!.map((s) => s.slice(1, -1));

/** Calculation engine with only the given tool files loaded; run() calculates a tool with its defaults. */
function engine(files: string[]) {
  const inputs: Record<string, unknown> = {};
  const document = { querySelector: (s: string) => { const k = /\[name="([^"]+)"\]/.exec(s)?.[1]; return k && k in inputs ? { value: String(inputs[k]) } : null; } };
  const ctx: any = createContext({ window: {}, document, console });
  for (const kind of ['data', 'guides']) for (const f of files) runInContext(read(`${kind}-${f}.js`), ctx);
  runInContext(read('core.js'), ctx);
  for (const f of files) runInContext(read(`calc-${f}.js`), ctx);
  const run = (t: any) => {
    for (const k of Object.keys(inputs)) delete inputs[k];
    for (const f of t.fields) if (f.type !== 'heading') inputs[f.key] = f.default;
    return JSON.stringify(runInContext(`calc(${JSON.stringify(t.id)})`, ctx));
  };
  return { tools: ctx.window.GOCORE_TOOLS as any[], run };
}

test('every tool calculates the same with only its own file loaded as with all 78 loaded', () => {
  const all = engine(FILES);
  const full = new Map(all.tools.map((t) => [t.id, all.run(t)]));
  let n = 0;
  for (const f of FILES) {
    const one = engine([f]);
    for (const t of one.tools) {
      assert.equal(one.run(t), full.get(t.id), `${t.id} (${f}) needs nothing from another file`);
      n++;
    }
  }
  assert.equal(n, 1052);
});

/** ui.js on a minimal page: scripts it adds are run from public/tools (or fail when listed in `missing`). */
function page(search: string, fileOf: Record<string, string>, missing = new Set<string>()) {
  const els = new Map<string, any>();
  const classes = (set: Set<string>) => ({ add: (c: string) => set.add(c), remove: (c: string) => set.delete(c), contains: (c: string) => set.has(c) });
  const element = (sel: string) => {
    if (!els.has(sel)) {
      const cls = new Set<string>();
      els.set(sel, { sel, cls, classList: classes(cls), innerHTML: '', textContent: '', hidden: sel === '#tool-workspace' || sel === '#tool-loading-failed', dataset: {}, listeners: {} as Record<string, any>, addEventListener(type: string, fn: unknown) { this.listeners[type] = fn; }, querySelector: () => null, querySelectorAll: () => [], getBoundingClientRect: () => ({ top: 0, bottom: 0 }), scrollIntoView() {} });
    }
    return els.get(sel);
  };
  const requested: string[] = [];
  let ctx: any;
  const htmlClasses = new Set(['workos-tool-link']);
  const document = {
    title: '',
    documentElement: { classList: classes(htmlClasses) },
    getElementById: (id: string) => (id === 'workos-tool-files' ? { textContent: JSON.stringify(fileOf) } : null),
    querySelector: (s: string) => (/\[name=|\[data-range/.test(s) ? null : element(s)),
    querySelectorAll: () => [],
    createElement: () => ({}) as any,
    body: {
      append(s: any) {
        requested.push(s.src);
        // Load asynchronously, as a browser does; scripts with async = false run in the order they were added.
        queueMicrotask(() => {
          const name = s.src.replace('/tools/', '');
          if (missing.has(name)) return s.onerror?.();
          runInContext(read(name), ctx, { filename: name });
          s.onload?.();
        });
      },
    },
  };
  const location = new URL(`https://kevos.com/tools/${search}`);
  ctx = createContext({ window: { addEventListener() {} }, document, location, console, URL, URLSearchParams, setTimeout, clearTimeout, queueMicrotask, history: { pushState() {} }, navigator: {} });
  for (const name of ['core.js', 'input-guides.js', 'ui.js']) runInContext(read(name), ctx, { filename: name });
  return { ctx, ui: ctx.window.WORKOS_UI, el: element, requested, htmlClasses };
}
const settle = () => new Promise((r) => setTimeout(r, 0));

test('a calculator link shows the loading state, fetches only that tool\'s four files, then opens the tool', async () => {
  const { tools } = engine(['handbook4']);
  const id = tools[0].id;
  const p = page(`?tool=${id}`, { [id]: 'handbook4' });
  assert.equal(p.ui.state(), null, 'nothing calculated before the files arrive');
  assert.equal(p.el('#tool-workspace').hidden, false, 'the workspace replaces the directory at once');
  assert.equal(p.el('#tool-directory').hidden, true);
  assert.ok(p.el('#tool-workspace').cls.has('is-loading'), 'loading state shown');
  assert.ok(!p.htmlClasses.has('workos-tool-link'), 'ui.js takes over from the early page script');
  await settle();
  assert.deepEqual(p.requested, ['data', 'guides', 'inputs', 'calc'].map((k) => `/tools/${k}-handbook4.js`), 'one tool file set, in order');
  assert.equal(p.ui.state().t.id, id, 'the tool opens once its files have run');
  assert.ok(!p.el('#tool-workspace').cls.has('is-loading'));
  assert.match(p.el('#tool-form').innerHTML, /<details class="ig/, 'with its input guides');
  assert.equal(p.el('#tool-loading').hidden, true);
});

test('a failed download says so and can be retried; it never falls back to the directory silently', async () => {
  const { tools } = engine(['money']);
  const id = tools[0].id;
  const missing = new Set(['calc-money.js']);
  const p = page(`?tool=${id}`, { [id]: 'money' }, missing);
  await settle();
  assert.equal(p.el('#tool-loading-failed').hidden, false, 'failure message shown');
  assert.equal(p.el('#tool-directory').hidden, true);
  assert.equal(p.ui.state(), null);
  missing.clear();
  p.el('#tool-loading-retry').listeners.click();
  await settle();
  assert.equal(p.ui.state().t.id, id, 'retry opens the tool');
  assert.equal(p.el('#tool-loading-failed').hidden, true);
});

test('an unknown tool id leaves the directory alone', async () => {
  const p = page('?tool=no-such-tool', { roi: 'money' });
  await settle();
  assert.equal(p.ui.state(), null);
  assert.equal(p.requested.length, 0);
  assert.equal(p.el('#tool-directory').hidden, false);
});

test('the page hides the directory on calculator links before any tool script loads', () => {
  const src = readFileSync(join(process.cwd(), 'src', 'pages', 'tools', 'index.astro'), 'utf8');
  assert.match(src, /classList\.add\('workos-tool-link'\)/, 'early script marks calculator links');
  assert.match(src, /id="tool-loading"/);
  assert.match(src, /id="tool-loading-failed"/);
  const css = readFileSync(join(process.cwd(), 'src', 'styles', 'tools.css'), 'utf8');
  assert.match(css, /\.workos-tool-link #tool-directory[^{]*\{ display:none !important; \}/);
  assert.match(css, /#tool-workspace\.is-loading > :not\(\.tool-loading\) \{ display:none; \}/);
});
