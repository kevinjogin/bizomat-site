/**
 * BIZOMAT figure system for Library reading pages.
 *
 * Authors write a fenced ```figure block in Markdown; remark-kevos-figures.ts passes it here and the
 * returned HTML replaces the block at build time. Every figure is plain HTML and inline SVG styled only
 * by classes (src/styles/figures.css), so it obeys the site's no-inline-style Content-Security-Policy,
 * follows the light and dark themes through the design tokens and animates only when motion is allowed.
 *
 * Block format:
 *   type: steps                      figure type (see RENDERERS)
 *   title: Short visible title       required; also the accessible name
 *   caption: One-sentence explanation (optional, becomes the figcaption)
 *   key: value                       type-specific settings; repeatable keys collect into a list
 *   - field | field | field          items; indent two spaces per level for trees
 *   body:                            (svg type only) every following line is SVG markup
 */

export type FigureItem = { fields: string[]; depth: number; mark: string };
export type FigureSpec = { type: string; props: Record<string, string[]>; items: FigureItem[]; body: string[] };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Escaped text with **bold** and `code` allowed. */
const txt = (s = '') => esc(s.trim()).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
const num = (s = '') => { const m = /-?\d[\d,]*(?:\.\d+)?/.exec(s.replace(/−/g, '-')); return m ? Number(m[0].replace(/,/g, '')) : NaN; };
const r1 = (n: number) => Math.round(n * 10) / 10;
/** A value with its unit as a reader expects it: "−$83,000", "$1.2m", "$33k", "40%", "2,400 hours". Non-numeric text passes through. */
function qty(raw = '', unit = ''): string {
  const v = raw.trim();
  if (!/^[−-]?\d[\d,]*(?:\.\d+)?$/.test(v)) return txt(v) + (unit ? ` ${esc(unit)}` : '');
  const n = num(v), sign = n < 0 ? '−' : '', a = Math.abs(n);
  const dp = (v.split('.')[1] ?? '').length;
  const fmt = (sep: boolean) => { const [i, f] = a.toFixed(dp).split('.'); return (sep ? i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : i) + (f ? `.${f}` : ''); };
  const cur = /^(A\$|\$)(m|'000)?(?=\s|$)(.*)$/.exec(unit);
  if (cur) return esc(`${sign}${cur[1]}${fmt(true)}${cur[2] === 'm' ? 'm' : cur[2] ? 'k' : ''}${cur[3]}`);
  const s = sign + fmt(a >= 10000 || (unit !== '' && a >= 1000));
  return esc(!unit ? s : /^(%|×)/.test(unit) ? s + unit : `${s} ${unit}`);
}
const d =(i: number) => `kd${Math.min(i, 11) + 1}`;

export function parseFigure(source: string): FigureSpec {
  const spec: FigureSpec = { type: '', props: {}, items: [], body: [] };
  let inBody = false;
  for (const raw of source.replace(/\r/g, '').split('\n')) {
    if (inBody) { spec.body.push(raw); continue; }
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    const item = /^(\s*)- (.*)$/.exec(raw);
    if (item) {
      let text = item[2];
      let mark = '';
      // Item marks: "*" highlights (with or without a space, but not "**bold**"); "+", "x", "?", "!" need a space.
      const m = /^(?:(\*)(?!\*)\s*|([+x?!])\s+)/.exec(text);
      if (m) { mark = m[1] ?? m[2]; text = text.slice(m[0].length); }
      spec.items.push({ fields: text.split(' | ').map((f) => f.trim()), depth: Math.floor(item[1].replace(/\t/g, '  ').length / 2), mark });
      continue;
    }
    const kv = /^([a-z][a-z0-9-]*):\s?(.*)$/.exec(raw.trim());
    if (!kv) throw new Error(`Unrecognised figure line: "${raw}"`);
    if (kv[1] === 'body') { inBody = true; continue; }
    if (kv[1] === 'type') spec.type = kv[2].trim();
    else (spec.props[kv[1]] ??= []).push(kv[2].trim());
  }
  return spec;
}

type Ctx = { id: string; spec: FigureSpec; p: (k: string, fallback?: string) => string; list: (k: string) => string[] };

/* ---------- Text-led layouts ---------- */

function steps({ spec }: Ctx) {
  const li = spec.items.map((it, i) => `<li class="kf-a ${d(i)}${it.mark === '*' ? ' kf-hot' : ''}"><span class="kf-badge" aria-hidden="true">${i + 1}</span><span class="kf-step-text"><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? `<span>${txt(it.fields[1])}</span>` : ''}</span></li>`);
  return `<ol class="kf-steps-list">${li.join('')}</ol>`;
}

function timeline({ spec }: Ctx) {
  const li = spec.items.map((it, i) => `<li class="kf-a ${d(i)}${it.mark === '*' ? ' kf-hot' : ''}"><span class="kf-tl-when">${txt(it.fields[0])}</span><span class="kf-tl-dot" aria-hidden="true"></span><span class="kf-tl-text"><strong>${txt(it.fields[1] ?? '')}</strong>${it.fields[2] ? `<span>${txt(it.fields[2])}</span>` : ''}</span></li>`);
  return `<ol class="kf-tl">${li.join('')}</ol>`;
}

function compare({ spec, list }: Ctx) {
  const cols = (list('cols')[0] ?? '').split(' | ');
  const best = Number(list('best')[0] ?? 0);
  const head = `<thead><tr><th scope="col">${txt(list('rowhead')[0] ?? '')}</th>${cols.map((c, i) => `<th scope="col"${best === i + 1 ? ' class="kf-best"' : ''}>${txt(c)}</th>`).join('')}</tr></thead>`;
  const rows = spec.items.map((it, i) => `<tr class="kf-a ${d(i)}"><th scope="row">${txt(it.fields[0])}</th>${cols.map((_, c) => `<td${best === c + 1 ? ' class="kf-best"' : ''}>${txt(it.fields[c + 1] ?? '')}</td>`).join('')}</tr>`);
  return `<div class="kf-table-wrap"><table class="kf-table">${head}<tbody>${rows.join('')}</tbody></table></div>`;
}

function matrix({ spec, list }: Ctx) {
  const hot = Number(list('hot')[0] ?? 0);
  const cells = spec.items.slice(0, 4).map((it, i) => `<div class="kf-cell kf-a ${d(i)}${hot === i + 1 ? ' kf-hot' : ''}"><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? `<span>${txt(it.fields[1])}</span>` : ''}</div>`);
  return `<div class="kf-matrix"><span class="kf-axis-y">${txt(list('y')[0] ?? '')}</span><div class="kf-grid2">${cells.join('')}</div><span class="kf-axis-x">${txt(list('x')[0] ?? '')}</span></div>`;
}

function tree({ spec }: Ctx) {
  let html = '';
  let depth = -1;
  spec.items.forEach((it, i) => {
    if (it.depth > depth) html += '<ul>'.repeat(it.depth - depth);
    else { html += '</li>'; if (it.depth < depth) html += '</ul></li>'.repeat(depth - it.depth); }
    depth = it.depth;
    html += `<li class="kf-a ${d(i)}"><span class="kf-node${it.mark === '*' ? ' kf-hot' : ''}"><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? `<span>${txt(it.fields[1])}</span>` : ''}</span>`;
  });
  html += '</li>' + '</ul></li>'.repeat(Math.max(0, depth)) + '</ul>';
  return `<div class="kf-tree">${html}</div>`;
}

function stats({ spec }: Ctx) {
  return `<div class="kf-stats">${spec.items.map((it, i) => `<div class="kf-stat kf-a ${d(i)}${it.mark === '*' ? ' kf-hot' : ''}"><span class="kf-stat-val">${txt(it.fields[0])}</span><span class="kf-stat-label">${txt(it.fields[1] ?? '')}</span>${it.fields[2] ? `<span class="kf-stat-note">${txt(it.fields[2])}</span>` : ''}</div>`).join('')}</div>`;
}

function checklist({ spec }: Ctx) {
  const icon = (m: string) => m === 'x'
    ? '<svg class="kf-ico kf-ico-no" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9"/><path class="kf-draw" pathLength="1" d="M6.5 6.5l7 7M13.5 6.5l-7 7"/></svg>'
    : m === '?'
      ? '<svg class="kf-ico kf-ico-q" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9"/><path d="M7.6 7.4a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.6M10 14.6v.1"/></svg>'
      : '<svg class="kf-ico kf-ico-yes" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9"/><path class="kf-draw" pathLength="1" d="M5.8 10.4l2.8 2.8 5.6-6.2"/></svg>';
  const word = (m: string) => (m === 'x' ? 'Avoid: ' : m === '?' ? 'Ask: ' : 'Do: ');
  return `<ul class="kf-check">${spec.items.map((it, i) => `<li class="kf-a ${d(i)}">${icon(it.mark)}<span><span class="visually-hidden">${word(it.mark)}</span><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? `<span>${txt(it.fields[1])}</span>` : ''}</span></li>`).join('')}</ul>`;
}

function layers({ spec, list }: Ctx) {
  const pyramid = list('shape')[0] === 'pyramid';
  const n = spec.items.length;
  return `<ol class="kf-layers${pyramid ? ' kf-pyramid' : ''}">${spec.items.map((it, i) => `<li class="kf-a ${d(i)} kf-w${pyramid ? Math.round(((i + 1) / n) * 10) : 10}${it.mark === '*' ? ' kf-hot' : ''}"><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? `<span>${txt(it.fields[1])}</span>` : ''}</li>`).join('')}</ol>`;
}

function decision({ spec, list }: Ctx) {
  const q = list('question')[0] ?? '';
  return `<div class="kf-decision"><div class="kf-q kf-a kd1"><span class="kf-q-mark" aria-hidden="true">?</span><strong>${txt(q)}</strong></div><div class="kf-branches">${spec.items.map((it, i) => `<div class="kf-branch kf-a ${d(i + 1)}${it.mark === '*' ? ' kf-hot' : ''}"><span class="kf-answer">${txt(it.fields[0])}</span><strong>${txt(it.fields[1] ?? '')}</strong>${it.fields[2] ? `<span>${txt(it.fields[2])}</span>` : ''}</div>`).join('')}</div></div>`;
}

function formula({ spec, list }: Ctx) {
  const eq = list('formula').map((f) => `<div class="kf-eq"><span>${txt(f)}</span><svg class="kf-eq-line" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true"><rect class="kf-growx" width="100" height="2"/></svg></div>`).join('');
  const legend = spec.items.length ? `<dl class="kf-legend">${spec.items.map((it, i) => `<div class="kf-a ${d(i)}"><dt>${txt(it.fields[0])}</dt><dd>${txt(it.fields[1] ?? '')}</dd></div>`).join('')}</dl>` : '';
  const stepsList = list('step');
  const work = stepsList.length ? `<ol class="kf-work">${stepsList.map((s, i) => `<li class="kf-a ${d(i + spec.items.length)}${i === stepsList.length - 1 ? ' kf-hot' : ''}">${txt(s)}</li>`).join('')}</ol>` : '';
  return `${eq}${legend}${work}`;
}

/* ---------- Data-led layouts (values drive SVG attributes, never inline styles) ---------- */

function bars({ spec, list }: Ctx) {
  const unit = list('unit')[0] ?? '';
  const vals = spec.items.map((it) => num(it.fields[1]));
  if (vals.some((v) => Number.isNaN(v))) throw new Error('bars: every item needs a numeric value');
  const max = Number(list('max')[0] ?? Math.max(...vals.map(Math.abs)));
  const rows = spec.items.map((it, i) => {
    const pct = Math.max(0.6, Math.min(100, (Math.abs(vals[i]) / max) * 100));
    return `<div class="kf-bar-row kf-a ${d(i)}${it.mark === '*' ? ' kf-hot' : ''}"><span class="kf-bar-label">${txt(it.fields[0])}</span><svg class="kf-bar" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><rect class="kf-track" width="100" height="10"/><rect class="kf-fill kf-growx" width="${r1(pct)}" height="10"/></svg><span class="kf-bar-val">${qty(it.fields[1], unit)}</span>${it.fields[2] ? `<span class="kf-bar-note">${txt(it.fields[2])}</span>` : ''}</div>`;
  });
  return `<div class="kf-bars">${rows.join('')}</div>`;
}

function funnel({ spec }: Ctx) {
  const vals = spec.items.map((it) => num(it.fields[1]));
  const max = Math.max(...vals.filter((v) => !Number.isNaN(v)), 1);
  const w = vals.map((v, i) => (Number.isNaN(v) ? 100 - i * (70 / Math.max(1, vals.length - 1)) : Math.max(8, (v / max) * 100)));
  return `<div class="kf-funnel">${spec.items.map((it, i) => {
    const a = w[i], b = w[i + 1] ?? w[i] * 0.85;
    const pts = `${r1((100 - a) / 2)},0 ${r1((100 + a) / 2)},0 ${r1((100 + b) / 2)},10 ${r1((100 - b) / 2)},10`;
    return `<div class="kf-funnel-row kf-a ${d(i)}"><span class="kf-bar-label">${txt(it.fields[0])}</span><svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><polygon class="kf-fun${i % 2}" points="${pts}"/></svg><span class="kf-bar-val">${txt(it.fields[1] ?? '')}${it.fields[2] ? ` <span class="kf-bar-note">${txt(it.fields[2])}</span>` : ''}</span></div>`;
  }).join('')}</div>`;
}

function stack({ id, spec, list }: Ctx) {
  const unit = list('unit')[0] ?? '';
  const vals = spec.items.map((it) => num(it.fields[1]));
  if (vals.some((v) => Number.isNaN(v) || v < 0)) throw new Error('stack: every item needs a positive numeric value');
  const total = vals.reduce((a, b) => a + b, 0);
  // Segments alternate solid and hatched fills so they stay distinguishable without colour.
  const fill = (i: number) => (i % 4 === 1 ? ` fill="url(#${id}-ha)"` : i % 4 === 3 ? ` fill="url(#${id}-hi)"` : '');
  let x = 0;
  const segs = vals.map((v, i) => { const w = (v / total) * 100; const s = `<rect class="kf-seg kf-seg${i % 4} kf-growx ${d(i)}"${fill(i)} x="${r1(x)}" width="${r1(Math.max(0.4, w - 0.6))}" height="10"/>`; x += w; return s; }).join('');
  const defs = `<defs><pattern id="${id}-ha" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect class="kf-hatch-bg" width="2.4" height="2.4"/><rect class="kf-hatch-a" width="1.2" height="2.4"/></pattern><pattern id="${id}-hi" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect class="kf-hatch-bg" width="2.4" height="2.4"/><rect class="kf-hatch-i" width="1.2" height="2.4"/></pattern></defs>`;
  const legend = spec.items.map((it, i) => `<li class="kf-a ${d(i)}"><span class="kf-key kf-seg${i % 4}" aria-hidden="true"></span><strong>${txt(it.fields[0])}</strong><span class="kf-bar-val">${qty(it.fields[1], unit)}${unit === '%' ? '' : ` · ${Math.round((vals[i] / total) * 100)}%`}</span>${it.fields[2] ? `<span class="kf-bar-note">${txt(it.fields[2])}</span>` : ''}</li>`).join('');
  return `<svg class="kf-stackbar" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">${defs}${segs}</svg><ol class="kf-stack-legend">${legend}</ol>`;
}

function line({ id, spec, list, p }: Ctx) {
  const W = 640, H = 330, L = 64, R = 20, T = 26, B = 54;
  const xsRaw = spec.items.map((it) => it.fields[0]);
  const numericX = xsRaw.every((s) => !Number.isNaN(num(s)) && /^-?[\d.,\s]+[a-z%°]*$/i.test(s.trim()));
  const xs = numericX ? xsRaw.map(num) : xsRaw.map((_, i) => i);
  const series = Math.max(...spec.items.map((it) => it.fields.length - 1));
  const ys = spec.items.flatMap((it) => it.fields.slice(1).map(num)).filter((v) => !Number.isNaN(v));
  const ymin = Number(p('ymin', String(Math.min(0, ...ys))));
  const ymax = Number(p('ymax', String(Math.max(...ys) * 1.08 || 1)));
  const xmin = Math.min(...xs), xmax = Math.max(...xs);
  const X = (v: number) => L + ((v - xmin) / (xmax - xmin || 1)) * (W - L - R);
  const Y = (v: number) => T + (1 - (v - ymin) / (ymax - ymin || 1)) * (H - T - B);
  const fmt = (v: number) => (Math.abs(v) >= 100 ? String(Math.round(v)) : String(r1(v)));
  let g = '';
  for (let k = 0; k <= 4; k++) { const v = ymin + ((ymax - ymin) * k) / 4; g += `<path class="kf-grid" d="M${L} ${r1(Y(v))}H${W - R}"/><text class="kf-axt" x="${L - 8}" y="${r1(Y(v) + 5)}" text-anchor="end">${fmt(v)}</text>`; }
  const xt = numericX ? [xmin, (xmin + xmax) / 2, xmax] : xs;
  for (const v of xt) g += `<text class="kf-axt" x="${r1(X(v))}" y="${H - B + 22}" text-anchor="middle">${esc(numericX ? fmt(v) : xsRaw[v])}</text>`;
  g += `<path class="kf-axis" d="M${L} ${T - 6}V${H - B}H${W - R}"/>`;
  let paths = '';
  for (let s = 0; s < series; s++) {
    const pts = spec.items.map((it, i) => [X(xs[i]), Y(num(it.fields[s + 1]))]).filter((q) => !Number.isNaN(q[1]));
    const dpath = pts.map((q, i) => `${i ? 'L' : 'M'}${r1(q[0])} ${r1(q[1])}`).join('');
    paths += `<path class="kf-ser kf-ser${s} kf-draw" pathLength="1" d="${dpath}"/>`;
    paths += pts.map((q, i) => (s === 0 ? `<circle class="kf-pt kf-pt0 kf-a ${d(i)}" cx="${r1(q[0])}" cy="${r1(q[1])}" r="5"/>` : `<rect class="kf-pt kf-pt1 kf-a ${d(i)}" x="${r1(q[0] - 4.5)}" y="${r1(q[1] - 4.5)}" width="9" height="9"/>`)).join('');
  }
  let marks = '';
  for (const m of list('mark')) {
    const [mx, label] = m.split(' | ');
    const xv = numericX ? num(mx) : xsRaw.indexOf(mx.trim());
    if (Number.isNaN(xv) || xv < 0) continue;
    marks += `<path class="kf-markline" d="M${r1(X(xv))} ${T - 6}V${H - B}"/><text class="kf-markt" x="${r1(X(xv) + 6)}" y="${T + 8}">${esc(label ?? '')}</text>`;
  }
  const legendNames = (list('legend')[0] ?? '').split(' | ').filter(Boolean);
  const legend = legendNames.length ? `<p class="kf-chart-legend">${legendNames.map((n, i) => `<span><svg viewBox="0 0 26 10" aria-hidden="true"><path class="kf-ser kf-ser${i}" d="M1 5H25"/></svg>${txt(n)}</span>`).join('')}</p>` : '';
  const axes = `<p class="kf-axes"><span>${txt(p('y'))}</span><span>${txt(p('x'))}</span></p>`;
  const table = `<table class="visually-hidden"><caption>${txt(p('title'))} data</caption><thead><tr><th>${txt(p('x', 'x'))}</th>${(legendNames.length ? legendNames : [p('y', 'y')]).map((n) => `<th>${txt(n)}</th>`).join('')}</tr></thead><tbody>${spec.items.map((it) => `<tr>${it.fields.map((f) => `<td>${txt(f)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  return `${legend}<div class="kf-scroll"><svg class="kf-chart" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="${id}-t">${g}${marks}${paths}</svg></div>${axes}${table}`;
}

function range({ spec, list, p }: Ctx) {
  const min = num(p('min', '0')), max = num(p('max', '100')), unit = p('unit');
  const P = (v: number) => Math.max(0, Math.min(100, ((v - min) / (max - min || 1)) * 100));
  const rows = spec.items.map((it, i) => {
    const a = num(it.fields[1]), b = num(it.fields[2] || it.fields[1]);
    const x = P(Math.min(a, b)), w = Math.max(0.8, P(Math.max(a, b)) - x);
    const both = /^(A?\$|%)/.test(unit);
    const label = it.fields[2] && it.fields[2] !== it.fields[1] ? `${qty(it.fields[1], both ? unit : '')} to ${qty(it.fields[2], unit)}` : qty(it.fields[1], unit);
    return `<div class="kf-range-row kf-a ${d(i)}${it.mark === '*' ? ' kf-hot' : ''}"><span class="kf-bar-label">${txt(it.fields[0])}</span><svg class="kf-bar" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><rect class="kf-track" width="100" height="10"/><rect class="kf-band kf-growx" x="${r1(x)}" width="${r1(w)}" height="10"/></svg><span class="kf-bar-val">${label}</span>${it.fields[3] ? `<span class="kf-bar-note">${txt(it.fields[3])}</span>` : ''}</div>`;
  });
  const ticks = list('ticks')[0]?.split(' | ') ?? [String(min), String((min + max) / 2), String(max)];
  return `<div class="kf-bars kf-ranges">${rows.join('')}<div class="kf-range-axis" aria-hidden="true"><span></span><span class="kf-ticks">${ticks.map((t) => `<span>${esc(t)}</span>`).join('')}</span></div></div>`;
}

function gauge({ id, spec, p }: Ctx) {
  const min = num(p('min', '0')), max = num(p('max', '100')), val = num(p('value', '0'));
  const cx = 160, cy = 150, R = 112;
  const ang = (v: number) => Math.PI * (1 - (Math.max(min, Math.min(max, v)) - min) / (max - min || 1));
  const pt = (a: number, rr: number) => `${r1(cx + rr * Math.cos(a))} ${r1(cy - rr * Math.sin(a))}`;
  let zones = '';
  spec.items.forEach((it, i) => {
    const a0 = ang(num(it.fields[0])), a1 = ang(num(it.fields[1]));
    zones += `<path class="kf-zone kf-zone${i % 3}" d="M${pt(a0, R)}A${R} ${R} 0 0 1 ${pt(a1, R)}"/>`;
    const am = (a0 + a1) / 2;
    zones += `<text class="kf-axt" x="${pt(am, R + 24).split(' ')[0]}" y="${pt(am, R + 24).split(' ')[1]}" text-anchor="middle">${esc(it.fields[2] ?? '')}</text>`;
  });
  const a = ang(val);
  const needle = `<g class="kf-needle"><path class="kf-needle-line" d="M${cx} ${cy}L${pt(a, R - 18)}"/><circle class="kf-needle-hub" cx="${cx}" cy="${cy}" r="8"/></g>`;
  const scale = `<text class="kf-axt" x="${cx - R}" y="${cy + 26}" text-anchor="middle">${esc(p('min', '0'))}</text><text class="kf-axt" x="${cx + R}" y="${cy + 26}" text-anchor="middle">${esc(p('max', '100'))}</text>`;
  return `<svg class="kf-gauge" viewBox="0 0 320 190" role="img" aria-labelledby="${id}-t ${id}-v"><path class="kf-track-arc" d="M${pt(Math.PI, R)}A${R} ${R} 0 0 1 ${pt(0, R)}"/>${zones}${scale}${needle}</svg><p class="kf-gauge-val" id="${id}-v"><strong>${qty(p('value'), p('unit'))}</strong> ${txt(p('label'))}</p>`;
}

/* ---------- Diagram layouts ---------- */

function cycle({ spec }: Ctx) {
  const n = spec.items.length, cx = 120, cy = 120, R = 84;
  let nodes = '', arrows = '';
  spec.items.forEach((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    nodes += `<g class="kf-a ${d(i)}"><circle class="kf-node-c" cx="${r1(x)}" cy="${r1(y)}" r="17"/><text class="kf-node-t" x="${r1(x)}" y="${r1(y + 5)}" text-anchor="middle">${i + 1}</text></g>`;
    const am = a + Math.PI / n, ax = cx + R * Math.cos(am), ay = cy + R * Math.sin(am), t = am + Math.PI / 2;
    arrows += `<path class="kf-arrowhead" d="M${r1(ax - 5 * Math.cos(t) - 5 * Math.cos(am))} ${r1(ay - 5 * Math.sin(t) - 5 * Math.sin(am))}L${r1(ax)} ${r1(ay)}L${r1(ax - 5 * Math.cos(t) + 5 * Math.cos(am))} ${r1(ay - 5 * Math.sin(t) + 5 * Math.sin(am))}"/>`;
  });
  const svg = `<svg class="kf-cycle-svg" viewBox="0 0 240 240" aria-hidden="true"><circle class="kf-ring" cx="${cx}" cy="${cy}" r="${R}"/><circle class="kf-ring-run kf-spin" cx="${cx}" cy="${cy}" r="${R}"/>${arrows}${nodes}</svg>`;
  const ol = `<ol class="kf-cycle-list">${spec.items.map((it, i) => `<li class="kf-a ${d(i)}"><span class="kf-badge" aria-hidden="true">${i + 1}</span><span class="kf-step-text"><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? `<span>${txt(it.fields[1])}</span>` : ''}</span></li>`).join('')}</ol>`;
  return `<div class="kf-cycle">${svg}${ol}</div>`;
}

function venn({ id, spec, list }: Ctx) {
  const three = spec.items.length >= 3;
  const circles = three ? [[125, 95], [195, 95], [160, 155]] : [[125, 110], [195, 110]];
  const labelPos = three ? [[92, 78], [228, 78], [160, 196]] : [[96, 112], [224, 112]];
  const svg = `<svg class="kf-venn" viewBox="0 0 320 ${three ? 240 : 220}" role="img" aria-labelledby="${id}-t ${id}-vd"><desc id="${id}-vd">${esc(spec.items.map((it) => it.fields[0]).join(', '))} overlap in ${esc(list('centre')[0] ?? 'the centre')}.</desc>${circles.map(([x, y], i) => `<circle class="kf-vc kf-vc${i} kf-a ${d(i)}" cx="${x}" cy="${y}" r="${three ? 68 : 76}"/>`).join('')}${labelPos.slice(0, circles.length).map(([x, y], i) => `<text class="kf-vt" x="${x}" y="${y}" text-anchor="middle">${esc(spec.items[i].fields[0])}</text>`).join('')}<text class="kf-vt kf-vt-c kf-pulse" x="160" y="${three ? 124 : 115}" text-anchor="middle">${esc(list('centre')[0] ?? '')}</text></svg>`;
  const legend = `<ul class="kf-venn-legend">${spec.items.map((it, i) => `<li class="kf-a ${d(i)}"><span class="kf-key kf-vk${i}" aria-hidden="true"></span><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? `<span>${txt(it.fields[1])}</span>` : ''}</li>`).join('')}</ul>`;
  return `<div class="kf-venn-wrap">${svg}${legend}</div>`;
}

function balance({ spec, list }: Ctx) {
  const lefts = spec.items.map((it) => it.fields[0]).filter(Boolean), rights = spec.items.map((it) => it.fields[1]).filter(Boolean);
  const tilt = list('tilt')[0] === 'right' ? ' kf-tilt-r' : list('tilt')[0] === 'left' ? ' kf-tilt-l' : '';
  const svg = `<svg class="kf-balance-svg" viewBox="0 0 320 120" aria-hidden="true"><path class="kf-base" d="M160 62L138 112H182Z"/><g class="kf-beam${tilt}"><path class="kf-beam-line" d="M40 58H280"/><path class="kf-pan" d="M40 58l-22 30h44zM280 58l-22 30h44z"/></g><circle class="kf-needle-hub" cx="160" cy="58" r="6"/></svg>`;
  const col = (h: string, items: string[]) => `<div><strong class="kf-side">${txt(h)}</strong><ul>${items.map((s, i) => `<li class="kf-a ${d(i)}">${txt(s)}</li>`).join('')}</ul></div>`;
  return `${svg}<div class="kf-balance">${col(list('left')[0] ?? '', lefts)}${col(list('right')[0] ?? '', rights)}</div>`;
}

function svgFigure({ id, spec, p }: Ctx) {
  const body = spec.body.join('\n').replace(/\{id\}/g, id);
  if (/\sstyle\s*=|<script|on[a-z]+\s*=/i.test(body)) throw new Error('svg figure body must not contain style attributes, scripts or event handlers');
  const notes = spec.items.length ? `<ul class="kf-notes">${spec.items.map((it, i) => `<li class="kf-a ${d(i)}"><strong>${txt(it.fields[0])}</strong>${it.fields[1] ? ` ${txt(it.fields[1])}` : ''}</li>`).join('')}</ul>` : '';
  return `<div class="kf-scroll"><svg class="kf-svg" viewBox="${esc(p('viewbox', '0 0 640 320'))}" role="img" aria-labelledby="${id}-t ${id}-d"><desc id="${id}-d">${txt(p('alt'))}</desc>${body}</svg></div>${notes}`;
}

const RENDERERS: Record<string, (c: Ctx) => string> = {
  steps, timeline, compare, matrix, tree, stats, checklist, layers, decision, formula,
  bars, funnel, stack, line, range, gauge, cycle, venn, balance, svg: svgFigure,
};
export const FIGURE_TYPES = Object.keys(RENDERERS);

/** Render one parsed figure. `id` must be unique on the page; `n` is the figure number shown to readers. */
export function renderFigure(spec: FigureSpec, id: string, n: number): string {
  const render = RENDERERS[spec.type];
  if (!render) throw new Error(`Unknown figure type "${spec.type}". Use one of: ${FIGURE_TYPES.join(', ')}`);
  const title = spec.props.title?.[0];
  if (!title) throw new Error(`Figure ${n} (${spec.type}) needs a title`);
  if (spec.type === 'svg' && !spec.props.alt?.[0]) throw new Error(`Figure ${n} (svg) needs alt text`);
  if (spec.type !== 'svg' && spec.type !== 'gauge' && spec.type !== 'formula' && !spec.items.length) throw new Error(`Figure ${n} (${spec.type}) has no items`);
  const ctx: Ctx = {
    id, spec,
    p: (k, fallback = '') => spec.props[k]?.[0] ?? fallback,
    list: (k) => spec.props[k] ?? [],
  };
  const caption = spec.props.caption?.[0];
  return `<figure class="kf kf-${spec.type}" aria-labelledby="${id}-t"${caption ? ` aria-describedby="${id}-c"` : ''} data-pagefind-ignore><div class="kf-head"><span class="kf-num">Figure ${n}</span><span class="kf-title" id="${id}-t">${txt(title)}</span></div><div class="kf-body">${render(ctx)}</div>${caption ? `<figcaption class="kf-cap" id="${id}-c">${txt(caption)}</figcaption>` : ''}</figure>`;
}
