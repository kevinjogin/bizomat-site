#!/usr/bin/env node
// The new UI audit (docs/ui/AUDIT.md): counts the hard-coded style values the website and BIZOMAT ERP use today, with
// the flag new_ui_enabled off. Read only: it changes no file.
//
//   node scripts/ui/audit.mjs
//
// Counted: the website's stylesheets (src/styles) and the <style> blocks of its Astro components, and the ERP's
// stylesheets (apps/work/src/client/styles). Left out, as scripts/ui/gen-overrides.mjs leaves them out: the token
// files, the new UI's own files (ui-new*.css and the generated blocks), the shared brand components, and illustrations.
// Values are normalised to px (16 px to the rem), so ".9rem" and "0.9rem" are one value.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const walk = (d, ext) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(path.join(d, e.name), ext)) : ext.some((x) => e.name.endsWith(x)) ? [path.join(d, e.name)] : [],
  );
const GENERATED = /\/\* ui-new:generated begin[\s\S]*?ui-new:generated end \*\//g;
const SKIP = /(^|\/)(ui-new[a-z-]*|[a-z-]*tokens|visuals|components)\.css$/;
const ILLUSTRATION = /(^|\/)(visuals\/[^/]+|[A-Za-z]*(Art|Illustration|Visual|Drawing|Cover|Map|Portrait)\.astro)$/;
const rel = (f) => path.relative(root, f).split(path.sep).join('/');

function sources(surface) {
  const out = [];
  if (surface === 'website') {
    for (const f of walk(path.join(root, 'src/styles'), ['.css'])) if (!SKIP.test(rel(f))) out.push([rel(f), fs.readFileSync(f, 'utf8')]);
    for (const f of walk(path.join(root, 'src'), ['.astro'])) {
      if (ILLUSTRATION.test(rel(f))) continue;
      const css = [...fs.readFileSync(f, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n').replace(GENERATED, '');
      if (css.trim()) out.push([rel(f), css]);
    }
  } else {
    for (const f of walk(path.join(root, 'apps/work/src/client/styles'), ['.css'])) if (!SKIP.test(rel(f))) out.push([rel(f), fs.readFileSync(f, 'utf8')]);
  }
  return out;
}

/** "0.9rem" -> "14.4px", "12px" -> "12px"; anything else as written. */
function norm(v) {
  const m = /^(-?)(\d*\.?\d+)(px|rem)$/.exec(v.trim());
  if (!m) return v.trim().toLowerCase();
  const px = Number(m[2]) * (m[3] === 'rem' ? 16 : 1);
  return `${Math.round(px * 10) / 10}px`;
}
const ms = (v) => { const m = /^(\d*\.?\d+)(ms|s)$/.exec(v); return m ? `${Math.round(Number(m[1]) * (m[2] === 's' ? 1000 : 1))}ms` : v; };

function audit(surface) {
  const t = { font: new Map(), space: new Map(), radius: new Map(), shadow: new Map(), colour: new Map(), duration: new Map(), easing: new Map(), breakpoint: new Map(), height: new Map() };
  const add = (m, k) => m.set(k, (m.get(k) ?? 0) + 1);
  let files = 0;
  let declarations = 0;
  for (const [, raw] of sources(surface)) {
    files++;
    const css = raw.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/@media[^{]*?\((?:max|min)-width:\s*([\d.]+(?:px|rem|em))/g)) add(t.breakpoint, norm(m[1].replace(/(\d)em$/, '$1rem')));
    for (const [, prop, v0] of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]+)[;}]/g)) {
      const v = v0.trim();
      declarations++;
      if (prop === 'font-size' && !/var\(/.test(v)) add(t.font, norm(v));
      if (/^(margin|padding|gap|row-gap|column-gap)(-|$)/.test(prop) && !/var\(|calc\(|clamp\(/.test(v))
        for (const x of v.split(/\s+/)) if (/^-?[\d.]+(px|rem)$/.test(x) && Number.parseFloat(x) !== 0) add(t.space, norm(x.replace(/^-/, '')));
      if (/^border(-[a-z]+)*-radius$/.test(prop) && !/var\(/.test(v)) add(t.radius, v.split(/\s+/).map(norm).join(' '));
      if (prop === 'box-shadow' && !/^var\([^)]*\)$/.test(v) && v !== 'none') add(t.shadow, v);
      if (/^(min-)?height$/.test(prop) && /^\d+px$/.test(v)) add(t.height, v);
      if (/^(transition|animation)/.test(prop)) {
        for (const d of v.matchAll(/(\d*\.?\d+)(ms|s)\b/g)) add(t.duration, ms(d[0]));
        for (const e of v.matchAll(/(ease(-in-out|-in|-out)?|linear|cubic-bezier\([^)]*\))/g)) add(t.easing, e[0]);
      }
      if (!prop.startsWith('--')) for (const c of v.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g)) add(t.colour, c[0].toLowerCase());
    }
  }
  return { files, declarations, t };
}

const sum = (m) => [...m.values()].reduce((a, n) => a + n, 0);
const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, c]) => `${k} x${c}`).join(', ');
for (const surface of ['website', 'erp']) {
  const { files, declarations, t } = audit(surface);
  const offGrid = [...t.space.entries()].filter(([k]) => { const px = Number.parseFloat(k); return px >= 4 && px % 4 !== 0; });
  console.log(`\n${surface}: ${files} sources, ${declarations} declarations`);
  for (const [k, m] of Object.entries(t)) console.log(`  ${k.padEnd(10)} ${String(m.size).padStart(3)} distinct, ${String(sum(m)).padStart(4)} uses. Most used: ${top(m, k === 'shadow' ? 4 : 10)}`);
  console.log(`  spacing off the 4px grid: ${offGrid.length} distinct values, ${offGrid.reduce((a, [, c]) => a + c, 0)} uses`);
}
