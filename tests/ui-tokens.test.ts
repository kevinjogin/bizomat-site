// The new UI (owner's UI brief of 19 Nov 2026; docs/ui/README.md): the tokens are the brief's values, the generated
// conversions are current, every new rule waits for html[data-ui="new"] (the flag new_ui_enabled), and the colour pairs
// used for text meet WCAG 2.1 AA.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');
const tokens = read('shared/brand/ui-tokens.css');
const value = (name: string) => new RegExp(`--${name}:\\s*([^;]+);`).exec(tokens.split('[data-theme')[0])?.[1].trim();

test('the tokens are the brief’s scales', () => {
  const space: Record<string, string> = { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px', 16: '64px' };
  for (const [k, v] of Object.entries(space)) assert.equal(value(`bz-space-${k}`), v, `space-${k}`);
  assert.equal(value('bz-radius-sm'), '6px');
  assert.equal(value('bz-radius-md'), '8px');
  assert.equal(value('bz-radius-lg'), '12px');
  assert.equal(value('bz-radius-full'), '9999px');
  assert.equal(value('bz-shadow-xs'), 'rgba(16, 24, 40, 0.05)'.replace(/^/, '0 1px 2px '));
  assert.equal(value('bz-duration-fast'), '120ms');
  assert.equal(value('bz-duration-base'), '200ms');
  assert.equal(value('bz-duration-slow'), '300ms');
  assert.equal(value('bz-ease-standard'), 'cubic-bezier(0.2, 0, 0, 1)');
  assert.equal(value('bz-ease-out'), 'cubic-bezier(0, 0, 0.2, 1)');
  // The owner's button sizes: 32, 40 and 48.
  assert.equal(value('bz-control-sm'), '32px');
  assert.equal(value('bz-control-md'), '40px');
  assert.equal(value('bz-control-lg'), '48px');
  // The copies are in step (shared/brand/build.mjs).
  assert.equal(read('src/styles/bizomat/ui-tokens.css'), tokens);
  assert.equal(read('apps/work/src/client/styles/bizomat-ui-tokens.css'), tokens);
});

test('the generated conversions and the inline spacing are current', () => {
  for (const script of ['scripts/ui/gen-overrides.mjs', 'scripts/ui/inline-styles.mjs']) {
    const r = spawnSync(process.execPath, [script, '--check'], { encoding: 'utf8' });
    assert.equal(r.status, 0, `${script}: ${r.stderr}`);
  }
});

/** A selector list split on its top-level commas (not those inside :is(), :where() or [..]). */
function splitTop(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

/** Every top-level selector of a stylesheet (outside @keyframes). */
function selectors(css: string): string[] {
  const out: string[] = [];
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@keyframes[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const walk = (s: string) => {
    let i = 0;
    while (i < s.length) {
      const open = s.indexOf('{', i);
      if (open < 0) return;
      const head = s.slice(i, open).trim();
      let depth = 1;
      let j = open + 1;
      while (j < s.length && depth > 0) {
        if (s[j] === '{') depth++;
        else if (s[j] === '}') depth--;
        j++;
      }
      if (head.startsWith('@')) walk(s.slice(open + 1, j - 1));
      else out.push(...splitTop(head).map((x) => x.trim()));
      i = j;
    }
  };
  walk(clean);
  return out;
}

test('every new rule waits for the flag (html[data-ui="new"])', () => {
  const allowed = new Set(['.ui-loading', '.ui-skeleton', '.ui-kit-label']);
  for (const file of ['apps/work/src/client/styles/ui-new.css', 'src/styles/ui-new.css', 'apps/work/src/client/styles/ui-new-generated.css', 'src/styles/ui-new-generated.css']) {
    for (const sel of selectors(read(file))) {
      if (allowed.has(sel)) continue;
      assert.ok(sel.startsWith('html[data-ui="new"]'), `${file}: ${sel}`);
    }
  }
});

function luminance(hex: string): number {
  const n = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

test('text colours meet WCAG 2.1 AA (4.5:1) on their surfaces, light and dark', () => {
  const pairs: [string, string, string][] = [
    ['ink on surface', '#0e1726', '#ffffff'],
    ['ink-2 on paper', '#334155', '#f7f9fb'],
    ['muted on surface', '#56657a', '#ffffff'],
    ['teal link on surface', '#0f766e', '#ffffff'],
    ['white on teal button', '#ffffff', '#0f766e'],
    ['white on danger button', '#ffffff', '#b42318'],
    ['dark: ink on surface', '#e6edf5', '#101a28'],
    ['dark: muted on paper', '#9aa8ba', '#0a111c'],
    ['dark: teal link on surface', '#2dd4bf', '#101a28'],
    ['dark: button text on teal', '#0a111c', '#2dd4bf'],
  ];
  for (const [name, fg, bg] of pairs) assert.ok(contrast(fg, bg) >= 4.5, `${name}: ${contrast(fg, bg).toFixed(2)}`);
});

/** The colour a token has in the light (default) or dark block of shared/brand/tokens.css, as [r, g, b, alpha]. */
function tokenColour(name: string, dark: boolean): [number, number, number, number] {
  const css = read('shared/brand/tokens.css');
  const cut = css.indexOf("[data-theme='dark']");
  const block = dark ? css.slice(cut) : css.slice(0, cut);
  const raw = new RegExp(`--${name}:\\s*([^;]+);`).exec(block)?.[1].trim();
  assert.ok(raw, `${name} in the ${dark ? 'dark' : 'light'} tokens`);
  const hex = /^#([0-9a-f]{6})$/i.exec(raw!);
  if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)).concat(1) as [number, number, number, number];
  const rgb = /^rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)$/.exec(raw!);
  assert.ok(rgb, `${name}: ${raw} is a colour this test reads`);
  return [Number(rgb![1]), Number(rgb![2]), Number(rgb![3]), Number(rgb![4])];
}
/** A colour laid over an opaque one, as #rrggbb. */
function over([r, g, b, a]: number[], [R, G, B]: number[]): string {
  return '#' + [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a)].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}
const hexOf = (c: number[]) => over(c, [0, 0, 0]);

test('badges and status colours meet WCAG 2.1 AA on their soft backgrounds, light and dark', () => {
  for (const dark of [false, true]) {
    const surface = tokenColour('bz-surface', dark);
    for (const status of ['success', 'warning', 'danger', 'info']) {
      const fg = hexOf(tokenColour(`bz-${status}`, dark));
      const bg = over(tokenColour(`bz-${status}-soft`, dark), surface);
      assert.ok(contrast(fg, bg) >= 4.5, `${dark ? 'dark' : 'light'} ${status}: ${contrast(fg, bg).toFixed(2)}`);
    }
    // The accent badge (the ERP's --accent-soft: the teal soft token in light, 16% teal over the surface in dark).
    const teal = tokenColour('bz-teal', dark);
    const soft = dark ? over([teal[0], teal[1], teal[2], 0.16], surface) : over(tokenColour('bz-teal-soft', false), surface);
    assert.ok(contrast(hexOf(teal), soft) >= 4.5, `${dark ? 'dark' : 'light'} accent badge`);
    // The neutral badge: secondary ink on the second paper.
    const ink2 = hexOf(tokenColour('bz-ink-2', dark));
    const paper2 = hexOf(tokenColour('bz-paper-2', dark));
    assert.ok(contrast(ink2, paper2) >= 4.5, `${dark ? 'dark' : 'light'} neutral badge: ${contrast(ink2, paper2).toFixed(2)}`);
  }
});

test('every inline spacing, font size and radius variable of the ERP screens has a token under the new UI', () => {
  const css = read('apps/work/src/client/styles/ui-new.css');
  const walk = (d: string): string[] =>
    readdirSync(join(process.cwd(), d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : e.name.endsWith('.tsx') ? [`${d}/${e.name}`] : []));
  const used = new Set<string>();
  for (const f of walk('apps/work/src/client')) for (const m of read(f).matchAll(/var\(--ui-([sfr])([\d_]+),/g)) used.add(`${m[1]}${m[2]}`);
  assert.ok(used.size > 20, 'the screens use the inline variables');
  for (const v of used) {
    // Spacing of 1 to 3px is a hairline and stays as it is.
    if (v.startsWith('s') && Number(v.slice(1).replace('_', '.')) < 4) continue;
    assert.ok(new RegExp(`--ui-${v}:\\s*var\\(--bz-`).test(css), `--ui-${v} is defined in styles/ui-new.css`);
  }
});

test('every button on the website is in the new UI’s button system', () => {
  const css = read('src/styles/ui-new.css');
  const section = css.slice(css.indexOf('---- buttons */'), css.indexOf('---- links */'));
  const system = new Set([...section.matchAll(/\.([a-z][a-z0-9_-]*)/g)].map((m) => m[1]));
  for (const c of ['button', 'bz-btn', 'btn', 'case__button', 'booking__button', 'site-header__cta', 'msg__button', 'assistant__send-btn', 'lib-link-button']) assert.ok(system.has(c), `${c} in the button rules`);
  // Drawn controls inside illustrations and tutorial screen outlines are pictures of buttons, not buttons.
  const drawn = new Set(['wi-button', 'lv-screen__button']);
  const walk = (d: string): string[] =>
    readdirSync(join(process.cwd(), d), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : e.name.endsWith('.astro') ? [`${d}/${e.name}`] : []));
  const missing: string[] = [];
  for (const f of walk('src')) {
    for (const m of read(f).matchAll(/class="([^"{}]+)"/g)) {
      const tokens = m[1].split(/\s+/).filter(Boolean);
      if (tokens.some((t) => system.has(t))) continue;
      for (const t of tokens) if (/(^|[-_])(button|btn)$/.test(t) && !t.includes('--') && !drawn.has(t)) missing.push(`${f}: ${t}`);
    }
  }
  assert.deepEqual(missing, [], 'add these to the button rules of src/styles/ui-new.css, or say why they are drawn');
});

test('focus from the keyboard is never taken away under the new UI', () => {
  // Each :focus-visible rule draws an outline, or (a field) changes its border colour: an outline is not a shadow, so no
  // hover or variant shadow can hide it, and a solid teal outline has the 3:1 contrast WCAG 2.1 asks of it.
  for (const file of ['apps/work/src/client/styles/ui-new.css', 'src/styles/ui-new.css']) {
    const css = read(file).replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = [...css.matchAll(/([^{}]*:focus-visible[^{}]*)\{([^{}]*)\}/g)];
    assert.ok(rules.length >= 2, `${file} has focus rules`);
    for (const [, sel, body] of rules) {
      const ok = /outline:\s*2px solid/.test(body) || (/outline:\s*none/.test(body) && /border-color:/.test(body));
      assert.ok(ok, `${file}: ${sel.trim().slice(0, 80)} must draw an outline (or change a field's border)`);
    }
  }
});
