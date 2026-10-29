import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';
import { audit } from '../scripts/tools/input-guides.mjs';

// WORKOS input guides: every input of every tool has a checked, field-specific explanation (inputs-*.js) rendered by
// public/tools/input-guides.js as an accessible <details> panel with an SVG figure that follows the typed value.

const DIR = join(process.cwd(), 'public', 'tools');
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const read = (name: string) => readFileSync(join(DIR, name), 'utf8');
const loader = readFileSync(join(process.cwd(), 'src', 'utils', 'workos-tools.ts'), 'utf8');
const FILES = /export const TOOL_FILES = \[([^\]]+)\]/.exec(loader)![1].match(/'([a-z0-9]+)'/g)!.map((s) => s.slice(1, -1));

/** Data, guides, input guides, engine and calculations in one VM, as the tools page loads them. */
function loadAll(withGuides = true) {
  const inputs: Record<string, string | number> = {};
  const document = { querySelector: (s: string) => { const k = /\[name="([^"]+)"\]/.exec(s)?.[1]; return k && k in inputs ? { value: String(inputs[k]) } : null; } };
  const ctx: any = createContext({ window: {}, document, console });
  for (const kind of ['data', 'guides']) for (const f of FILES) runInContext(read(`${kind}-${f}.js`), ctx);
  if (withGuides) {
    runInContext(read('input-guides.js'), ctx);
    for (const f of FILES) runInContext(read(`inputs-${f}.js`), ctx);
  }
  runInContext(read('core.js'), ctx);
  for (const f of FILES) runInContext(read(`calc-${f}.js`), ctx);
  const run = (t: any) => {
    for (const k of Object.keys(inputs)) delete inputs[k];
    for (const f of t.fields) if (f.type !== 'heading') inputs[f.key] = f.default;
    return runInContext(`calc(${JSON.stringify(t.id)})`, ctx);
  };
  return { ctx, tools: ctx.window.GOCORE_TOOLS as any[], entries: ctx.window.WORKOS_INPUTS as Record<string, Record<string, any>>, ig: ctx.window.WORKOS_INPUT_GUIDE, run };
}
const all = loadAll();

/** Every tag inside the SVG is either self-closing or closed in order: a broken template would fail here. */
function balanced(svg: string) {
  const stack: string[] = [];
  for (const m of svg.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    if (m[3]) continue;
    if (m[1]) { if (stack.pop() !== m[2]) return false; } else stack.push(m[2]);
  }
  return stack.length === 0;
}

test('the tools page loads the renderer before ui.js, and every tool file has its inputs file', () => {
  const page = readFileSync(join(process.cwd(), 'src', 'pages', 'tools', 'index.astro'), 'utf8');
  const order = ['/tools/core.js', '/tools/input-guides.js', '/tools/ui.js'].map((s) => page.indexOf(s));
  assert.ok(order.every((p) => p > 0), 'engine scripts are loaded');
  assert.deepEqual([...order].sort((a, b) => a - b), order, 'scripts load in dependency order');
  for (const f of FILES) assert.doesNotThrow(() => new Function(read(`inputs-${f}.js`)), `inputs-${f}.js parses`);
});

test('coverage: all 866 tools and every input field have a usable, field-specific explanation', () => {
  const { rows, problems } = audit();
  assert.equal(rows.length, 866, 'every tool is audited');
  assert.deepEqual(problems, [], 'no field is missing, generic, duplicated or malformed');
  const inputs = rows.reduce((n: number, r: any) => n + r.inputs, 0);
  const done = rows.reduce((n: number, r: any) => n + r.covered + r.exceptions, 0);
  assert.equal(done, inputs, 'every input is covered or a documented exception');
  assert.ok(rows.every((r: any) => r.status === 'complete'));
  // Exceptions must stay rare: each one is a field whose meaning could not be established from the tool itself.
  assert.ok(rows.reduce((n: number, r: any) => n + r.exceptions, 0) <= 20, 'documented exceptions stay rare');
});

test('the checker rejects placeholders, repeated labels and generic instructions', () => {
  const f = { key: 'd', label: 'Wire diameter', unit: 'mm' };
  // checkEntry runs in the VM, so its arrays come from another realm: compare lengths, not structures.
  assert.equal(all.ig.checkEntry(f, { what: 'The diameter of the spring wire, measured across the wire itself with a micrometer.', fig: 'diameter' }).length, 0);
  assert.ok(all.ig.checkEntry(f, undefined).length);
  assert.ok(all.ig.checkEntry(f, { what: 'Wire diameter' }).length, 'label repeated');
  assert.ok(all.ig.checkEntry(f, { what: 'Enter the value of the wire diameter in the box.' }).length, 'generic instruction');
  assert.ok(all.ig.checkEntry(f, { what: 'TODO: explain this input properly before release.' }).length, 'placeholder');
  assert.ok(all.ig.checkEntry(f, { what: 'The diameter of the spring wire, measured across the wire.', fig: 'sparkle' }).length, 'unknown figure');
  assert.equal(all.ig.checkEntry(f, { unclear: 'The calc never reads this value, so its meaning cannot be confirmed.' }).length, 0);
});

test('every guide renders with its input association, accessible figure and no broken output', () => {
  let figures = 0;
  for (const t of all.tools) {
    for (const f of t.fields) {
      if (f.type === 'heading') continue;
      const e = all.entries[t.id]?.[f.key];
      const html: string = all.ig.fieldGuide(t, f, e);
      const where = `${t.id}.${f.key}`;
      // The entry's own words may say "undefined" (a line through one point is undefined); the generated parts may not.
      const generated = [e.what, e.tip, e.effect, e.unclear].filter(Boolean).reduce((h: string, w: string) => h.split(esc(w)).join(''), html);
      assert.doesNotMatch(generated, /undefined|NaN|\[object/, `${where} renders cleanly`);
      assert.ok(html.includes(`id="ig-${f.key}-what"`), `${where} has the definition the input describes itself with`);
      if (e.unclear) continue;
      assert.ok(html.includes(`data-ig-for="f-${f.key}"`), `${where} names its input`);
      assert.match(html, /<summary class="ig-sum">/, `${where} opens with a native summary`);
      assert.match(html, /<span class="ig-sum__more">: [^<]+<\/span>/, `${where} summary names the field`);
      const svg = /<svg[\s\S]*<\/svg>/.exec(html)?.[0];
      if (!svg) continue;
      figures++;
      assert.match(svg, /role="img"/);
      const [, ids] = /aria-labelledby="([^"]+)"/.exec(svg)!;
      for (const id of ids.split(' ')) assert.match(svg, new RegExp(`id="${id}">[^<]+<`), `${where} figure ${id} has text`);
      assert.ok(balanced(svg), `${where} figure markup is well formed`);
      assert.doesNotMatch(svg, /\sstyle=/, `${where} has no inline style (CSP)`);
    }
  }
  assert.ok(figures > 6000, `most inputs have a figure (${figures})`);
});

test('every figure kind draws, describes itself and states its field', () => {
  const t = { id: 'x', fields: [] };
  for (const kind of all.ig.KINDS) {
    const f = { key: 'k', label: 'Sample field label', unit: kind === 'percent' ? '%' : 'mm', min: 0, max: 100, default: 40, type: kind === 'choice' ? 'select' : kind === 'score' ? 'range' : 'number', options: [['a', 'Option A'], ['b', 'Option B']] };
    const html: string = all.ig.fieldGuide(t, f, { what: 'A sample definition that is long enough to pass.', fig: kind });
    assert.match(html, new RegExp(`ig-svg--${kind}`), kind);
    assert.match(html, /<desc id="ig-k-fd">[^<]*Sample field label/, `${kind} description names the field`);
    assert.ok(balanced(/<svg[\s\S]*<\/svg>/.exec(html)![0]), `${kind} is well formed`);
  }
});

test('units, accepted range and the example come from the field definition, never from the guide text', () => {
  const t = { id: 'x', collection: 'MAKEOS' };
  assert.equal(all.ig.formatText(t, { label: 'Bore', unit: 'mm', min: 1, max: 500, default: 20 }), 'Enter a number in mm: millimetres. The form accepts 1 mm to 500 mm. Required: the tool does not calculate until every input is valid.');
  assert.match(all.ig.formatText({ id: 'y' }, { label: 'Rate', unit: '%', min: 0, max: 50, default: 8 }), /type 8 for 8 %.*0% to 50%/);
  assert.match(all.ig.formatText({ id: 'y' }, { label: 'Mode', type: 'select', options: [['a', 'Alpha'], ['b', 'Beta']], default: 'a' }), /one of 2 options from the list: Alpha; Beta/);
  assert.match(all.ig.exampleText({ label: 'Investment', unit: '$', default: 25000 }), /\$25000 as a worked example\. It is an illustration, not a recommended value/);
  assert.match(all.ig.exampleText({ label: 'Mode', type: 'select', options: [['a', 'Alpha']], default: 'a' }), /“Alpha” selected/);
});

test('the figure follows the typed value without touching the calculation', () => {
  const ig = all.ig;
  assert.equal(ig.fraction({ unit: '%', min: 0, max: 50 }, 25), 0.25, 'percent fields scale to 100 %');
  assert.equal(ig.fraction({ min: 10, max: 20 }, 15), 0.5);
  assert.equal(ig.fraction({ min: 10, max: 20 }, 99), 1, 'clamped');
  // A tiny SVG stand-in: the value line, a percent bar and a select highlight.
  const el = (attrs: Record<string, string>) => ({ attrs, textContent: '', getAttribute: (k: string) => attrs[k], setAttribute: (k: string, v: string) => (attrs[k] = String(v)) });
  const text: any = el({}), bar = el({ 'data-ig-bar': '30 260', width: '1' });
  const svg = { querySelector: () => text, querySelectorAll: (s: string) => (s === '[data-ig-bar]' ? [bar] : []) };
  ig.applyValue(svg, { unit: '%', min: 0, max: 100 }, 'percent', '40');
  assert.equal(bar.attrs.width, '104');
  assert.equal(text.textContent, 'Your value: 40%');
  ig.applyValue(svg, { unit: '%', min: 0, max: 50 }, 'percent', '70');
  assert.equal(text.textContent, 'Your value: 70% (out of range)');
});

test('loading the guides changes no calculation result for any tool', () => {
  const plain = loadAll(false);
  for (const t of plain.tools) {
    const a = plain.run(t), b = all.run(all.tools.find((x) => x.id === t.id));
    assert.equal(JSON.stringify(b), JSON.stringify(a), `${t.id} result is identical`);
  }
});

test('the calculator form renders a guide under every input and describes each input with it', () => {
  // ui.js with a minimal document: enough to build a form and read back its markup.
  const els = new Map<string, any>();
  const element = (sel: string) => {
    if (!els.has(sel)) els.set(sel, { sel, innerHTML: '', textContent: '', hidden: false, dataset: {}, classList: { add() {}, remove() {} }, listeners: {} as Record<string, unknown>, addEventListener(type: string, fn: unknown) { this.listeners[type] = fn; }, querySelector: () => null, querySelectorAll: () => [], getBoundingClientRect: () => ({ top: 0, bottom: 0 }), scrollIntoView() {} });
    return els.get(sel);
  };
  const location = { href: 'https://kevos.com/tools/?tool=spring-combination', search: '?tool=spring-combination' };
  const document = { title: '', querySelector: (s: string) => (/\[name=|\[data-range/.test(s) ? null : element(s)), querySelectorAll: () => [], createElement: () => element(`c-${Math.random()}`) };
  const ctx: any = createContext({ window: { addEventListener() {} }, document, location, console, URL, URLSearchParams, setTimeout, clearTimeout, history: { pushState() {} }, navigator: {} });
  for (const kind of ['data', 'guides']) for (const f of FILES) runInContext(read(`${kind}-${f}.js`), ctx);
  runInContext(read('input-guides.js'), ctx);
  for (const f of FILES) runInContext(read(`inputs-${f}.js`), ctx);
  runInContext(read('core.js'), ctx);
  for (const f of FILES) runInContext(read(`calc-${f}.js`), ctx);
  runInContext(read('ui.js'), ctx);
  const form = element('#tool-form');
  const t = ctx.window.GOCORE_TOOLS.find((x: any) => x.id === 'spring-combination');
  for (const f of t.fields) {
    assert.ok(form.innerHTML.includes(`<details class="ig`) && form.innerHTML.includes(`data-ig-for="f-${f.key}"`), `${f.key} has a guide`);
    assert.match(form.innerHTML, new RegExp(`id="f-${f.key}"[^>]*aria-describedby="h-${f.key} ig-${f.key}-what"`), `${f.key} input is described by its hint and definition`);
  }
  assert.ok(form.listeners.input && form.listeners.change, 'figures follow input and change events');
  assert.equal(ctx.window.WORKOS_UI.state().t.id, 'spring-combination', 'the tool still calculates');
});

test('guide motion is decorative and switched off for reduced motion', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'styles', 'tools.css'), 'utf8');
  const start = css.indexOf('/* ---------- Input guides');
  const end = css.indexOf('/* ---------- Result summary');
  const block = css.slice(start, end);
  const motion = /@media \(prefers-reduced-motion:no-preference\) \{([\s\S]*?)\n\}/.exec(block)![1];
  const outside = block.replace(motion, '');
  assert.doesNotMatch(outside, /animation:/, 'every animation sits inside the no-preference block');
  assert.match(css, /\.tool-flash, \.ig(, [^{]+)? \{ display:none !important; \}/, 'guides are left out of printed results');
});

test('static tool pages render the same guides without the form', () => {
  const page = readFileSync(join(process.cwd(), 'src', 'pages', 'tools', '[tool].astro'), 'utf8');
  assert.match(page, /inputGuide\.fieldGuide\(tool, f, inputs\[tool\.id\]\?\.\[f\.key\], \{ prefix: 'p-', inputId: null \}\)/);
  const t = all.tools.find((x) => x.id === 'roi');
  const html: string = all.ig.fieldGuide(t, t.fields[0], all.entries.roi.investment, { prefix: 'p-', inputId: null });
  assert.doesNotMatch(html, /data-ig-for/, 'no reference to an input that is not on the page');
  assert.match(html, /ig--page/);
  assert.match(html, /Example: \$25000/);
});
