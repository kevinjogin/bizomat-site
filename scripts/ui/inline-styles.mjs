#!/usr/bin/env node
// The new UI and the ERP's inline styles (owner's UI brief of 19 Nov 2026; docs/ui/README.md). React screens set some
// spacing, font sizes and corners inline (style={{ marginBottom: 12, fontSize: 11 }}), which no stylesheet can reach.
// This rewrites each such number as a CSS variable with the old value as its fallback: marginBottom:
// 'var(--ui-s12, 12px)', fontSize: 'var(--ui-f11, 11px)', borderRadius: 'var(--ui-r10, 10px)'. While the flag
// new_ui_enabled is off the variable is not defined, so the old value applies exactly; under html[data-ui="new"]
// (styles/ui-new.css) each is a token (spacing, type or radius). Positions and sizes (left, width, height...) are
// geometry and stay.
//
//   node scripts/ui/inline-styles.mjs           rewrite apps/work/src/client
//   node scripts/ui/inline-styles.mjs --check   fail when a screen still has a bare inline spacing, font size or radius
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, 'apps/work/src/client');
const check = process.argv.includes('--check');
const SPACING = 'margin|marginTop|marginBottom|marginLeft|marginRight|marginInline|marginBlock|padding|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingInline|paddingBlock|gap|rowGap|columnGap';
// [properties, variable prefix]: s for spacing, f for font size, r for radius.
const KINDS = [
  [SPACING, 's'],
  ['fontSize', 'f'],
  ['borderRadius|borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius', 'r'],
];
const number = (props) => new RegExp(`\\b(${props})(\\s*:\\s*)(-?)(\\d+(?:\\.\\d+)?)(?=\\s*(?:[,}\\n]|$))`, 'g');
const string = (props) => new RegExp(`\\b(${props})(\\s*:\\s*)(['"])([^'"\\n]*?\\d+px[^'"\\n]*?)\\3`, 'g');
const varOf = (k, n, neg) => (n === '0' ? '0' : neg ? `calc(-1 * var(--ui-${k}${n.replace('.', '_')}, ${n}px))` : `var(--ui-${k}${n.replace('.', '_')}, ${n}px)`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.tsx') ? [path.join(d, e.name)] : []));
const values = { s: new Set(), f: new Set(), r: new Set() };
let changedFiles = 0;
let changes = 0;
let left = 0;
for (const file of walk(dir)) {
  const src = fs.readFileSync(file, 'utf8');
  const next = src.replace(/style=\{\{([\s\S]*?)\}\}/g, (all, body) => {
    let b = body;
    for (const [props, k] of KINDS) {
      b = b.replace(number(props), (m, prop, sep, neg, n) => {
        if (n === '0') return m;
        values[k].add(n);
        changes++;
        return `${prop}${sep}'${varOf(k, n, neg === '-')}'`;
      });
      b = b.replace(string(props), (m, prop, sep, q, val) => {
        if (/var\(/.test(val)) return m;
        const v = val.replace(/(-?)(\d+(?:\.\d+)?)px/g, (_x, neg, n) => {
          if (n === '0') return '0';
          values[k].add(n);
          return varOf(k, n, neg === '-');
        });
        if (v === val) return m;
        changes++;
        return `${prop}${sep}${q}${v}${q}`;
      });
    }
    return `style={{${b}}}`;
  });
  if (next !== src) {
    changedFiles++;
    if (check) {
      left++;
      console.error(`bare inline spacing, font size or radius: ${path.relative(root, file)}`);
    } else fs.writeFileSync(file, next);
  }
}
if (check && left) {
  console.error(`${left} file(s) with bare inline spacing, font size or radius numbers: run node scripts/ui/inline-styles.mjs`);
  process.exit(1);
}
const list = (set) => [...set].sort((a, b) => a - b).join(', ') || 'none';
console.log(`${check ? 'checked' : 'rewrote'}: ${changes} inline values in ${changedFiles} files; spacing ${list(values.s)}; font sizes ${list(values.f)}; radii ${list(values.r)}`);
