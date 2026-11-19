// The new UI (owner's UI brief of 19 Nov 2026; docs/ui/README.md): the tokens are the brief's values, the generated
// conversions are current, every new rule waits for html[data-ui="new"] (the flag new_ui_enabled), and the colour pairs
// used for text meet WCAG 2.1 AA.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
