#!/usr/bin/env node
// The new UI and the ERP's inline styles (owner's UI brief of 19 Nov 2026; docs/ui/README.md). React screens set some
// spacing inline (style={{ marginBottom: 12 }}), which no stylesheet can reach. This rewrites each inline spacing number
// as a CSS variable with the old value as its fallback: marginBottom: 'var(--ui-s12, 12px)'. While the flag
// new_ui_enabled is off the variable is not defined, so the old value applies exactly; under html[data-ui="new"]
// (styles/ui-new.css) --ui-s12 is a spacing token. Positions and sizes (left, width, height...) are geometry and stay.
//
//   node scripts/ui/inline-styles.mjs           rewrite apps/work/src/client
//   node scripts/ui/inline-styles.mjs --check   fail when a screen still has a bare inline spacing number
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dir = path.join(root, 'apps/work/src/client');
const check = process.argv.includes('--check');
const PROPS = 'margin|marginTop|marginBottom|marginLeft|marginRight|marginInline|marginBlock|padding|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingInline|paddingBlock|gap|rowGap|columnGap';
const NUMBER = new RegExp(`\\b(${PROPS})(\\s*:\\s*)(-?)(\\d+(?:\\.\\d+)?)(?=\\s*(?:[,}\\n]|$))`, 'g');
const STRING = new RegExp(`\\b(${PROPS})(\\s*:\\s*)(['"])([^'"\\n]*?\\d+px[^'"\\n]*?)\\3`, 'g');
const varOf = (n, neg) => (n === '0' ? '0' : neg ? `calc(-1 * var(--ui-s${n.replace('.', '_')}, ${n}px))` : `var(--ui-s${n.replace('.', '_')}, ${n}px)`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.tsx') ? [path.join(d, e.name)] : []));
const values = new Set();
let changedFiles = 0;
let changes = 0;
let left = 0;
for (const file of walk(dir)) {
  const src = fs.readFileSync(file, 'utf8');
  const next = src.replace(/style=\{\{([\s\S]*?)\}\}/g, (all, body) => {
    let b = body.replace(NUMBER, (m, prop, sep, neg, n) => {
      if (n === '0') return m;
      values.add(n);
      changes++;
      return `${prop}${sep}'${varOf(n, neg === '-')}'`;
    });
    b = b.replace(STRING, (m, prop, sep, q, val) => {
      if (/var\(/.test(val)) return m;
      const v = val.replace(/(-?)(\d+(?:\.\d+)?)px/g, (_x, neg, n) => {
        if (n === '0') return '0';
        values.add(n);
        return varOf(n, neg === '-');
      });
      if (v === val) return m;
      changes++;
      return `${prop}${sep}${q}${v}${q}`;
    });
    return `style={{${b}}}`;
  });
  if (next !== src) {
    changedFiles++;
    if (check) {
      left++;
      console.error(`bare inline spacing: ${path.relative(root, file)}`);
    } else fs.writeFileSync(file, next);
  }
}
if (check && left) {
  console.error(`${left} file(s) with bare inline spacing numbers: run node scripts/ui/inline-styles.mjs`);
  process.exit(1);
}
console.log(`${check ? 'checked' : 'rewrote'}: ${changes} inline spacing values in ${changedFiles} files; values ${[...values].sort((a, b) => a - b).join(', ')}`);
