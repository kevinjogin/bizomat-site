#!/usr/bin/env node
// The new UI's spacing, type and radius conversion (owner's UI brief of 19 Nov 2026; docs/ui/README.md).
//
// Reads the existing stylesheets of the ERP (apps/work/src/client/styles) and the website (src/styles and the <style>
// blocks of src/**/*.astro) and writes override rules that put every hard-coded spacing, font size and radius on the
// token scales of shared/brand/ui-tokens.css, and every transition and short animation on its motion tokens. Every override is scoped to html[data-ui="new"], which the flag
// new_ui_enabled switches on, so with the flag off nothing changes.
//
//   node scripts/ui/gen-overrides.mjs           write the generated files
//   node scripts/ui/gen-overrides.mjs --check   fail when they are out of date (CI: tests/ui-tokens.test.ts)
//
// Outputs: apps/work/src/client/styles/ui-new-generated.css, src/styles/ui-new-generated.css, and a marked block at the
// end of each Astro component's <style> (scoped with :global(html[data-ui="new"])).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const check = process.argv.includes('--check');
const NEW = 'html[data-ui="new"]';
const BEGIN = '/* ui-new:generated begin (scripts/ui/gen-overrides.mjs; do not edit) */';
const END = '/* ui-new:generated end */';

// ---------------------------------------------------------------- the scales
const SPACE = [[4, 1], [8, 2], [12, 3], [16, 4], [20, 5], [24, 6], [32, 8], [40, 10], [48, 12], [64, 16]];
const TYPE = [[11, '2xs'], [12, 'xs'], [13, 'sm'], [14, 'base'], [16, 'md'], [18, 'lg'], [20, 'xl'], [24, '2xl'], [30, '3xl'], [36, '4xl'], [48, '5xl']];
const nearest = (v, list) => list.reduce((best, cur) => (Math.abs(cur[0] - v) < Math.abs(best[0] - v) || (Math.abs(cur[0] - v) === Math.abs(best[0] - v) && cur[0] > best[0]) ? cur : best));

function px(token) {
  const m = /^(-?)(\d*\.?\d+)(px|rem)$/.exec(token);
  if (!m) return null;
  return { neg: m[1] === '-', v: Number(m[2]) * (m[3] === 'rem' ? 16 : 1) };
}

/** One spacing value (a single token) on the grid, or null to keep it. */
function spaceToken(token) {
  const p = px(token);
  if (!p || p.v === 0) return null;
  if (p.v < 4) return null; // hairline nudges (1 to 3px) stay as they are
  let out;
  if (p.v > 64) out = `calc(var(--bz-space-1) * ${Math.round(p.v / 4)})`;
  else out = `var(--bz-space-${nearest(p.v, SPACE)[1]})`;
  return p.neg ? `calc(-1 * ${out})` : out;
}

/** A whole spacing declaration value (up to four tokens), or null when nothing changes. */
function spacing(value) {
  if (/var\(|calc\(|clamp\(|min\(|max\(|!important/.test(value)) return null;
  const parts = value.trim().split(/\s+/);
  if (parts.length > 4) return null;
  let changed = false;
  const out = parts.map((t) => {
    const r = spaceToken(t);
    if (r) changed = true;
    return r ?? t;
  });
  return changed ? out.join(' ') : null;
}

function fontSize(value) {
  const p = px(value.trim());
  // Under 10px is a label inside a drawing (SVG units), not text on the page: it stays.
  if (!p || p.v < 10) return null;
  return `var(--bz-text-${nearest(p.v, TYPE)[1]})`;
}

function radius(value) {
  if (/var\(|calc\(|%|!important/.test(value)) return null;
  const parts = value.trim().split(/\s+/);
  if (parts.length > 4) return null;
  let changed = false;
  const out = parts.map((t) => {
    const p = px(t);
    if (!p || p.v === 0) return t;
    changed = true;
    if (p.v >= 100) return 'var(--bz-radius-full)';
    if (p.v < 8) return 'var(--bz-radius-sm)';
    if (p.v < 10) return 'var(--bz-radius-md)';
    return 'var(--bz-radius-lg)';
  });
  return changed ? out.join(' ') : null;
}

// ---------------------------------------------------------------- motion
// Transitions and short animations on the motion tokens: a duration up to 150ms becomes fast (120), up to 250ms base
// (200), up to 400ms slow (300); the easing becomes ease-standard (transitions) or ease-out (animations). Only the
// longhands are written (transition-duration and -timing-function, animation-duration and -timing-function), so a
// rule of the new UI that names what moves (the buttons' lift, a card's shadow) keeps its list of properties. Longer
// animations (spinners, pulses, drawings) and delays stay as they are.
const EASE = /^(ease|ease-in|ease-out|ease-in-out|cubic-bezier\([^)]*\)|var\(--(bz-)?ease\))$/;
function ms(token) {
  const m = /^(\d*\.?\d+)(ms|s)$/.exec(token);
  return m ? Number(m[1]) * (m[2] === 's' ? 1000 : 1) : null;
}
const durationToken = (v) => `var(--bz-duration-${v <= 150 ? 'fast' : v <= 250 ? 'base' : 'slow'})`;
// Buttons move as the new UI's button rules say (src/styles/ui-new.css, apps/work/src/client/styles/ui-new.css: base
// duration, standard easing); a component's own transition is not converted, so it cannot speed them up or slow them.
const BUTTON = /\.(button|bz-btn|btn|case__button|booking__button|site-header__cta|site-nav__cta|msg__button|assistant__send-btn)\b[^\s>+~]*$/;

/** Declarations for a transition or animation shorthand, or null when nothing changes. */
function motion(prop, value) {
  if (/!important|var\(--bz-duration/.test(value) || /^\s*none\s*$/.test(value)) return null;
  const animation = prop === 'animation';
  const durations = [];
  const eases = [];
  let changed = false;
  for (const item of splitTop(value, ',')) {
    const tokens = item.trim().split(/\s+(?![^(]*\))/);
    const times = tokens.map(ms).filter((t) => t !== null);
    const duration = times.length ? times[0] : 0;
    const ease = tokens.find((t) => EASE.test(t) || t === 'linear' || /^steps\(/.test(t));
    if (duration > 0 && duration <= 400 && ease !== 'linear' && !/^steps\(/.test(ease ?? '')) {
      durations.push(durationToken(duration));
      eases.push(animation ? 'var(--bz-ease-out)' : 'var(--bz-ease-standard)');
      changed = true;
    } else {
      durations.push(`${duration}ms`);
      eases.push(ease ?? 'ease');
    }
  }
  if (!changed) return null;
  const k = animation ? 'animation' : 'transition';
  return [`${k}-duration: ${durations.join(', ')}`, `${k}-timing-function: ${eases.join(', ')}`];
}

const SPACING_PROPS = /^(padding|margin|gap|row-gap|column-gap|padding-(top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end)|margin-(top|right|bottom|left|inline|block|inline-start|inline-end|block-start|block-end))$/;
function convert(prop, value) {
  const p = prop.trim().toLowerCase();
  if (SPACING_PROPS.test(p)) return spacing(value);
  if (p === 'font-size') return fontSize(value);
  if (p === 'border-radius') return radius(value);
  return null;
}

// ---------------------------------------------------------------- a small CSS reader
function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Blocks of a stylesheet: { at: '@media ...' | null, selector, body } with nesting for @media/@supports/@layer. */
function parse(css, at = []) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    // the matching close
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    const lastSemicolon = head.lastIndexOf(';');
    const h = lastSemicolon >= 0 && head.startsWith('@') ? head.slice(lastSemicolon + 1).trim() : head;
    if (/^@(media|supports|layer|container)\b/.test(h)) out.push(...parse(body, [...at, h]));
    else if (!h.startsWith('@')) out.push({ at, selector: h, body });
    i = j;
  }
  return out;
}

function splitTop(s, sep) {
  const out = [];
  let depth = 0;
  let cur = '';
  for (const ch of s) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === sep && depth === 0) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

function prefix(sel, scoped) {
  const s = sel.trim().replace(/\s+/g, ' ');
  if (scoped) {
    const g = /^:global\((.*?)\)(.*)$/.exec(s);
    if (g && /^(html|:root|\[data-)/.test(g[1])) return `:global(${NEW}${g[1].replace(/^(html|:root)/, '')})${g[2]}`;
    if (/^(html|:root)\b/.test(s)) return null; // a scoped style on html itself: not converted
    return `:global(${NEW}) ${s}`;
  }
  if (/^:root\b/.test(s)) return NEW + s.slice(5);
  if (/^html\b/.test(s)) return NEW + s.slice(4);
  if (/^\[data-/.test(s)) return NEW + s;
  return `${NEW} ${s}`;
}

function overrides(css, scoped) {
  const rules = [];
  for (const b of parse(stripComments(css))) {
    if (/^(from|to|\d+%)/.test(b.selector)) continue; // keyframe steps
    const decls = [];
    for (const d of splitTop(b.body, ';')) {
      const k = d.indexOf(':');
      if (k < 0) continue;
      const prop = d.slice(0, k).trim();
      const value = d.slice(k + 1).trim();
      if (!prop || prop.startsWith('--')) continue;
      const lower = prop.toLowerCase();
      if (lower === 'transition' || lower === 'animation') {
        if (lower === 'transition' && splitTop(b.selector, ',').some((x) => BUTTON.test(x.trim().replace(/:global\(([^)]*)\)/g, '$1')))) continue;
        const m = motion(lower, value);
        if (m) decls.push(...m);
        continue;
      }
      const v = convert(prop, value);
      if (v) decls.push(`${prop}: ${v}`);
    }
    if (!decls.length) continue;
    const sels = splitTop(b.selector, ',').map((x) => prefix(x, scoped)).filter(Boolean);
    if (!sels.length) continue;
    let rule = `${sels.join(', ')} { ${decls.join('; ')}; }`;
    for (const at of [...b.at].reverse()) rule = `${at} { ${rule} }`;
    rules.push(rule);
  }
  return rules;
}

// ---------------------------------------------------------------- the files
const header = (what) =>
  `/* Generated by scripts/ui/gen-overrides.mjs from ${what}: the new UI's spacing, type and radius on the token scales
   (shared/brand/ui-tokens.css), only under html[data-ui="new"] (flag new_ui_enabled). Do not edit: change the source
   stylesheet and run node scripts/ui/gen-overrides.mjs. */\n`;

let problems = 0;
const write = (file, text) => {
  const abs = path.join(root, file);
  const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (before === text) return;
  if (check) {
    console.error(`out of date: ${file}`);
    problems++;
  } else fs.writeFileSync(abs, text);
};

function cssFiles(dir, skip) {
  return fs
    .readdirSync(path.join(root, dir))
    .filter((f) => f.endsWith('.css') && !skip.test(f))
    .sort()
    .map((f) => path.join(dir, f));
}

// Illustrations (animated product drawings, art panels, covers, the founder portrait) have their own fixed geometry in
// SVG units: they are not put on the page's grid. Their stylesheets get no overrides (CLAUDE.md: animations explain a
// product and keep their finished still).
const ILLUSTRATION = /(^|\/)(visuals\/[^/]+|[A-Za-z]*(Art|Illustration|Visual|Drawing|Cover|Map|Portrait)\.astro|visuals\.css)$/;

const counts = {};
// ERP
{
  const files = cssFiles('apps/work/src/client/styles', /^(bizomat-|ui-new)/);
  const out = [header('the ERP stylesheets (apps/work/src/client/styles)')];
  let n = 0;
  for (const f of files) {
    const rules = overrides(fs.readFileSync(path.join(root, f), 'utf8'), false);
    if (!rules.length) continue;
    out.push(`\n/* ${path.basename(f)} */\n${rules.join('\n')}\n`);
    n += rules.length;
  }
  counts.erp = n;
  write('apps/work/src/client/styles/ui-new-generated.css', out.join(''));
}
// Website: global stylesheets
{
  const files = cssFiles('src/styles', /^(ui-new|visuals\.css$)/);
  const out = [header('the website stylesheets (src/styles)')];
  let n = 0;
  for (const f of files) {
    const rules = overrides(fs.readFileSync(path.join(root, f), 'utf8'), false);
    if (!rules.length) continue;
    out.push(`\n/* ${path.basename(f)} */\n${rules.join('\n')}\n`);
    n += rules.length;
  }
  counts.website = n;
  write('src/styles/ui-new-generated.css', out.join(''));
}
// Website: Astro components
{
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.astro') ? [path.join(dir, e.name)] : []));
  let n = 0;
  let files = 0;
  for (const abs of walk(path.join(root, 'src'))) {
    const src = fs.readFileSync(abs, 'utf8');
    const illustration = ILLUSTRATION.test(path.relative(root, abs).split(path.sep).join('/'));
    let changed = false;
    const next = src.replace(/(<style\b([^>]*)>)([\s\S]*?)(<\/style>)/g, (all, open, attrs, body, close) => {
      if (/is:inline/.test(attrs)) return all;
      const own = body.includes(BEGIN) ? body.slice(0, body.indexOf(BEGIN)).replace(/\s+$/, '\n') : body;
      const rules = illustration ? [] : overrides(own, !/is:global/.test(attrs));
      const block = rules.length ? `${own.replace(/\s+$/, '\n')}\n  ${BEGIN}\n  ${rules.join('\n  ')}\n  ${END}\n` : own;
      if (block !== body) changed = true;
      n += rules.length;
      return open + block + close;
    });
    if (changed) {
      files++;
      const rel = path.relative(root, abs);
      if (check) {
        console.error(`out of date: ${rel}`);
        problems++;
      } else fs.writeFileSync(abs, next);
    }
  }
  counts.astro = n;
}

if (problems) {
  console.error(`${problems} generated file(s) out of date: run node scripts/ui/gen-overrides.mjs`);
  process.exit(1);
}
console.log(`ui-new overrides ${check ? 'in step' : 'written'}: ERP ${counts.erp} rules, website stylesheets ${counts.website}, Astro components ${counts.astro}`);
