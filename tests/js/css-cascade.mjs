// A small CSS cascade for tests: reads the app's three stylesheets and answers "what colour does this element
// get in this look?" without a browser. It knows class / id / tag / attribute selectors, descendant and child
// combinators, :not() / :is() / :where(), specificity, source order, !important, var() and inheritance of
// custom properties and colour. Rules inside @media and @supports are skipped unless asked for, as are rules
// with state pseudo-classes (:hover, :focus...) or pseudo-elements (unless asked for one).
import { readFileSync } from 'node:fs';

const CSS_DIR = new URL('../../opensketch/static/css/', import.meta.url);
export const FILES = ['app.css', 'linear.css', 'brand.css'];

function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, ''); }

// [{selector, decls: [[prop, value, important]], order, media}]
export function parseRules(text, media = '', out = [], start = 0) {
  const s = stripComments(text);
  let i = 0;
  const rules = out;
  while (i < s.length) {
    const open = s.indexOf('{', i);
    if (open < 0) break;
    const head = s.slice(i, open).trim();
    // find the matching brace
    let depth = 1, j = open + 1;
    while (j < s.length && depth) { if (s[j] === '{') depth++; else if (s[j] === '}') depth--; j++; }
    const body = s.slice(open + 1, j - 1);
    if (head.startsWith('@media') || head.startsWith('@supports')) parseRules(body, head, rules);
    else if (head.startsWith('@')) { /* keyframes, font-face, layer: not style rules */ }
    else {
      const decls = [];
      for (const d of body.split(/;(?![^(]*\))/)) {
        const k = d.indexOf(':');
        if (k < 0) continue;
        const prop = d.slice(0, k).trim();
        let value = d.slice(k + 1).trim();
        const important = /!important\s*$/.test(value);
        value = value.replace(/!important\s*$/, '').trim();
        if (prop) decls.push([prop, value, important]);
      }
      rules.push({ selector: head, decls, order: rules.length, media });
    }
    i = j;
  }
  return rules;
}

export function loadRules(files = FILES) {
  const rules = [];
  for (const f of files) parseRules(readFileSync(new URL(f, CSS_DIR), 'utf8'), '', rules);
  rules.forEach((r, k) => { r.order = k; });
  return rules;
}

// split "a, b:not(c, d)" at top-level commas
export function splitList(sel) {
  const out = []; let depth = 0, cur = '';
  for (const ch of sel) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && !depth) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// "div.a.b#x[type=text]:not(.c)" -> [{kind, ...}]
function compoundParts(c) {
  const parts = []; let i = 0;
  while (i < c.length) {
    const ch = c[i];
    if (ch === '*') { i++; continue; }
    if (ch === '.' || ch === '#') {
      let j = i + 1; while (j < c.length && /[\w-]/.test(c[j])) j++;
      parts.push({ kind: ch === '.' ? 'class' : 'id', name: c.slice(i + 1, j) }); i = j; continue;
    }
    if (ch === '[') {
      const j = c.indexOf(']', i);
      const m = c.slice(i + 1, j).match(/^([\w-]+)(?:([~|^$*]?=)["']?([^"'\]]*)["']?)?$/);
      parts.push({ kind: 'attr', name: m[1], op: m[2], value: m[3] }); i = j + 1; continue;
    }
    if (ch === ':') {
      const el = c[i + 1] === ':';
      let j = i + (el ? 2 : 1); while (j < c.length && /[\w-]/.test(c[j])) j++;
      const name = c.slice(i + (el ? 2 : 1), j);
      let arg = null;
      if (c[j] === '(') { let depth = 1, k = j + 1; while (k < c.length && depth) { if (c[k] === '(') depth++; else if (c[k] === ')') depth--; k++; } arg = c.slice(j + 1, k - 1); j = k; }
      parts.push({ kind: el ? 'pseudoEl' : 'pseudo', name, arg }); i = j; continue;
    }
    let j = i; while (j < c.length && /[\w-]/.test(c[j])) j++;
    parts.push({ kind: 'tag', name: c.slice(i, j).toLowerCase() }); i = j || i + 1;
  }
  return parts;
}

// "a b > c" -> [[compound, combinator-to-previous], ...]
function complexParts(sel) {
  const out = []; let depth = 0, cur = '', comb = ' ';
  const push = () => { if (cur.trim()) { out.push({ comb, parts: compoundParts(cur.trim()) }); cur = ''; } };
  for (let i = 0; i < sel.length; i++) {
    const ch = sel[i];
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (!depth && (ch === ' ' || ch === '>' || ch === '+' || ch === '~')) {
      if (ch === ' ') { if (cur.trim()) { push(); comb = ' '; } continue; }
      push(); comb = ch; continue;
    }
    cur += ch;
  }
  push();
  return out;
}

const STATIC_PSEUDO = new Set(['root']);

function specOf(parts) {
  let a = 0, b = 0, c = 0;
  for (const p of parts) {
    if (p.kind === 'id') a++;
    else if (p.kind === 'class' || p.kind === 'attr') b++;
    else if (p.kind === 'tag') c++;
    else if (p.kind === 'pseudoEl') c++;
    else if (p.kind === 'pseudo') {
      if (p.name === 'where') continue;
      if (p.name === 'not' || p.name === 'is' || p.name === 'has') {
        const m = Math.max(...splitList(p.arg).map((x) => { const s = selectorSpec(x); return s[0] * 1e6 + s[1] * 1e3 + s[2]; }));
        a += Math.floor(m / 1e6); b += Math.floor(m / 1e3) % 1e3; c += m % 1e3;
      } else b++;
    }
  }
  return [a, b, c];
}
export function selectorSpec(sel) {
  const t = [0, 0, 0];
  for (const { parts } of complexParts(sel)) { const s = specOf(parts); t[0] += s[0]; t[1] += s[1]; t[2] += s[2]; }
  return t;
}

// element: {tag, id, classes: Set, attrs: {}}; pseudoEl: the pseudo-element asked for (or null)
function matchCompound(parts, el, pseudoEl, isLast) {
  for (const p of parts) {
    if (p.kind === 'tag' && p.name !== el.tag) return false;
    if (p.kind === 'class' && !el.classes.has(p.name)) return false;
    if (p.kind === 'id' && p.name !== el.id) return false;
    if (p.kind === 'attr') {
      const v = el.attrs[p.name];
      if (v === undefined) return false;
      if (p.op === '=' && v !== p.value) return false;
    }
    if (p.kind === 'pseudoEl') { if (!isLast || p.name !== pseudoEl) return false; }
    if (p.kind === 'pseudo') {
      if (p.name === 'not') { if (splitList(p.arg).some((x) => matchesAt(x, [el], 0, null))) return false; continue; }
      if (p.name === 'is' || p.name === 'where') { if (!splitList(p.arg).some((x) => matchesAt(x, [el], 0, null))) return false; continue; }
      if (p.name === 'root') { if (el.tag !== 'html') return false; continue; }
      if (STATIC_PSEUDO.has(p.name)) continue;
      return false; // :hover, :focus, :has... never match a resting element here
    }
  }
  if (isLast && pseudoEl && !parts.some((p) => p.kind === 'pseudoEl')) return false;
  return true;
}

// does selector match chain[idx] (chain = root ... target)?
function matchesAt(sel, chain, idx, pseudoEl) {
  const cx = complexParts(sel);
  const go = (k, i) => {
    if (!matchCompound(cx[k].parts, chain[i], pseudoEl, k === cx.length - 1)) return false;
    if (k === 0) return true;
    if (cx[k].comb === '>') return i > 0 && go(k - 1, i - 1);
    for (let j = i - 1; j >= 0; j--) if (go(k - 1, j)) return true;
    return false;
  };
  return go(cx.length - 1, idx === undefined ? chain.length - 1 : idx);
}

// "div#labels.a.b[type=text]" -> element
export function el(desc) {
  const parts = compoundParts(desc);
  const e = { tag: 'div', id: null, classes: new Set(), attrs: {} };
  for (const p of parts) {
    if (p.kind === 'tag') e.tag = p.name;
    if (p.kind === 'class') e.classes.add(p.name);
    if (p.kind === 'id') e.id = p.name;
    if (p.kind === 'attr') e.attrs[p.name] = p.value ?? '';
  }
  return e;
}

export const LOOK_CLASSES = { dark: 'html.skin-linear.theme-dark', light: 'html.skin-linear.theme-light', classic: 'html.skin-classic.theme-light' };

const INHERITED = new Set(['color', 'font-size', 'font-family', 'font-weight', 'font-style', 'letter-spacing']);
const later = (a, b) => { for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) return a[k] > b[k]; return false; };

// winning declarations for els[i] (chain = els[0..i])
function cascade(rules, els, i, pseudoEl, media) {
  const win = {};
  for (const r of rules) {
    if (r.media && !media.includes(r.media)) continue;
    for (const s of splitList(r.selector)) {
      if (!matchesAt(s, els.slice(0, i + 1), i, pseudoEl)) continue;
      const spec = selectorSpec(s);
      for (const [prop, value, imp] of r.decls) for (const [p, v] of expand(prop, value)) {
        const rk = [imp ? 1 : 0, ...spec, r.order];
        if (!win[p] || later(rk, win[p].rk)) win[p] = { v, rk };
      }
    }
  }
  return win;
}

/** Computed values for the last element of `chain` (["div.tree", "div.tn.selected", ...]) in a look. */
export function computed(rules, look, chain, { pseudoEl = null, media = [] } = {}) {
  const els = [el(LOOK_CLASSES[look]), el('body'), ...chain.map(el)];
  const vars = {}; let inherited = {}; let out = {};
  for (let i = 0; i < els.length; i++) {
    const win = cascade(rules, els, i, i === els.length - 1 ? pseudoEl : null, media);
    for (const [p, { v }] of Object.entries(win)) if (p.startsWith('--')) vars[p] = v;
    const resolved = {};
    for (const [p, { v }] of Object.entries(win)) if (!p.startsWith('--')) resolved[p] = resolveVar(v, vars);
    out = { ...inherited, ...resolved };
    inherited = Object.fromEntries(Object.entries(out).filter(([k]) => INHERITED.has(k)));
  }
  return out;
}

function expand(prop, value) {
  if (prop === 'background' && !/url\(|gradient/.test(value)) return [['background-color', value.split(/\s+(?![^(]*\))/)[0]], ['background', value]];
  if (prop === 'border' || prop === 'border-left' || prop === 'border-top') {
    const m = value.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|var\([^)]*\)|transparent|currentColor)/);
    return [[prop, value], [prop === 'border' ? 'border-color' : prop + '-color', m ? m[1] : value]];
  }
  return [[prop, value]];
}

export function resolveVar(v, vars, depth = 0) {
  if (depth > 10) return v;
  return v.replace(/var\((--[\w-]+)(?:\s*,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g, (_, name, fb) => {
    if (vars[name] !== undefined) return resolveVar(vars[name], vars, depth + 1);
    return fb !== undefined ? resolveVar(fb.trim(), vars, depth + 1) : '';
  });
}

/** Custom properties set on the root element in a look (the theme tokens), resolved. */
export function tokens(rules, look) {
  const win = cascade(rules, [el(LOOK_CLASSES[look])], 0, null, []);
  const vars = Object.fromEntries(Object.entries(win).filter(([k]) => k.startsWith('--')).map(([k, { v }]) => [k, v]));
  return Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, resolveVar(v, vars)]));
}

// ---------------------------------------------------------------- colour maths (WCAG 2)
export function rgba(c) {
  if (c == null || c === '' || c === 'none') return [0, 0, 0, 0];
  c = c.trim();
  if (c === 'transparent') return [0, 0, 0, 0];
  let m = c.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((x) => x + x).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
  }
  m = c.match(/^rgba?\(([^)]+)\)$/);
  if (m) { const v = m[1].split(/[\s,/]+/).filter(Boolean).map(Number); return [v[0], v[1], v[2], v.length > 3 ? v[3] : 1]; }
  throw new Error('not a colour: ' + c);
}
export const over = (top, bot) => { const a = top[3]; return [0, 1, 2].map((i) => top[i] * a + bot[i] * (1 - a)).concat(1); };
const lum = (c) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
export function contrast(fg, bg) {
  const b = typeof bg === 'string' ? rgba(bg) : bg;
  const f = over(typeof fg === 'string' ? rgba(fg) : fg, b);
  const l1 = lum(f), l2 = lum(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
