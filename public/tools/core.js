// KEVOS® WORKOS shared calculation engine.
// Each tool is defined in data-*.js (window.GOCORE_TOOLS), calculated in calc-*.js (window.GOCORE_CALC_PARTS)
// and explained in guides-*.js (window.WORKOS_GUIDES). A calculation reads inputs with val()/sel() and returns
// result(...). This file makes no DOM writes, so the same code runs in the browser and in the Node tests.
const $ = (s) => document.querySelector(s);

/** AUD currency. Small non-integer values keep cents so unit prices stay meaningful. */
const money = (n, d) => {
  const v = Number.isFinite(n) ? n : 0;
  const digits = d ?? (Math.abs(v) < 100 && Math.round(v * 100) % 100 !== 0 ? 2 : 0);
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(v);
};
const num = (n, d = 1) => new Intl.NumberFormat('en-AU', { maximumFractionDigits: d }).format(Number.isFinite(n) ? n : 0);
const pct = (n, d = 1) => `${num(n, d)}%`;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** Inputs. window.WORKOS_OVERRIDE lets sensitivity analysis and tests supply values without touching the form. */
const val = (k) => {
  const o = window.WORKOS_OVERRIDE;
  if (o && Object.prototype.hasOwnProperty.call(o, k)) return Number(o[k]);
  const v = Number(document.querySelector(`[name="${k}"]`)?.value ?? 0);
  return Number.isFinite(v) ? v : 0;
};
const sel = (k) => {
  const o = window.WORKOS_OVERRIDE;
  if (o && Object.prototype.hasOwnProperty.call(o, k)) return String(o[k]);
  return String(document.querySelector(`[name="${k}"]`)?.value ?? '');
};

function band(score, good = 70, warn = 45) {
  return score >= good ? 'good' : score >= warn ? 'warn' : 'bad';
}
function status(score, good = 'STRONG', warn = 'WATCH', bad = 'WEAK') {
  return { text: score >= 70 ? good : score >= 45 ? warn : bad, tone: band(score) };
}
function m(label, value) {
  return { label, value };
}
/** A feasibility or verification check. statusText: pass | warn | fail | verify */
function check(label, statusText, detail = '') {
  return { label, status: statusText, detail };
}
/** The number the decision mainly rests on; drives the sensitivity analysis. fmt: money | pct | num | units | years | months | hours | minutes */
function primary(label, value, fmt = 'num') {
  return { label, value, fmt };
}
/**
 * A tool result. extra may contain: primary, checks[], actions[], verify[], risks[{risk, level, response}],
 * table{caption, head[], rows[][]}, guidance[{title, items[]}].
 */
function result(text, tone, summary, metrics = [], recommendation = '', extra = {}) {
  return { text, tone, summary, metrics, recommendation, checks: [], actions: [], verify: [], ...extra };
}
function calc(id) {
  for (const fn of window.GOCORE_CALC_PARTS || []) {
    const r = fn(id);
    if (r) return r;
  }
  return result('READY', 'good', 'Enter your assumptions to see the result.');
}

/** Present value of 1 per year for `years` years at `ratePct` % (ordinary annuity, end-of-year cash flows). */
function annuityFactor(ratePct, years) {
  const r = ratePct / 100;
  return r === 0 ? years : (1 - Math.pow(1 + r, -years)) / r;
}
/** Net present value of an initial outlay followed by a level annual net cash flow. */
function npvLevel(ratePct, initial, annual, years) {
  return annual * annuityFactor(ratePct, years) - initial;
}
/** Discounted payback in years (interpolated within the year), or Infinity if not reached within `years`. */
function discountedPayback(ratePct, initial, annual, years) {
  const r = ratePct / 100;
  let cum = -initial;
  for (let y = 1; y <= years; y++) {
    const pv = annual / Math.pow(1 + r, y);
    if (cum + pv >= 0) return y - 1 + (pv > 0 ? -cum / pv : 0);
    cum += pv;
  }
  return Infinity;
}
/** Standard normal z for the cycle service levels offered in the tools (one-sided). */
const Z_SERVICE = { 90: 1.2816, 95: 1.6449, 97.5: 1.96, 99: 2.3263, 99.5: 2.5758 };
/** Utilisation banding used by the capacity tools: ≤85 % comfortable, ≤100 % tight, above 100 % overloaded. */
function utilTone(u) {
  return u <= 85 ? 'good' : u <= 100 ? 'warn' : 'bad';
}

/** Format a primary value for display. */
function fmtPrimary(fmt, v) {
  switch (fmt) {
    case 'engineering': return new Intl.NumberFormat('en-AU', { maximumSignificantDigits: 8 }).format(v);
    case 'money': return money(v);
    case 'pct': return pct(v);
    case 'years': return `${num(v, 2)} years`;
    case 'months': return `${num(v, 1)} months`;
    case 'hours': return `${num(v, 1)} hr`;
    case 'minutes': return `${num(v, 2)} min`;
    case 'units': return `${num(v, 0)} units`;
    default: return num(v, 2);
  }
}

/**
 * One-at-a-time sensitivity: move each numeric input by ±step % (kept within its allowed range), recalculate,
 * and report the effect on the primary value and whether the decision changes. Sorted by influence.
 */
function sensitivity(tool, base, step = 10) {
  if (!base || !base.primary || !Number.isFinite(base.primary.value)) return [];
  const current = {};
  for (const f of tool.fields) {
    if (f.type === 'number' || f.type === 'range') current[f.key] = val(f.key);
    else if (f.type === 'select') current[f.key] = sel(f.key);
  }
  const rows = [];
  const counts = {};
  for (const f of tool.fields) counts[f.label] = (counts[f.label] || 0) + 1;
  let heading = '';
  for (const f of tool.fields) {
    if (f.type === 'heading') heading = f.label;
    if (f.type !== 'number' || f.sens === false) continue;
    const label = counts[f.label] > 1 && heading ? `${heading} · ${f.label}` : f.label; // e.g. "Candidate B · Part or material cost"
    const v = current[f.key];
    if (!v) continue;
    const run = (mult) => {
      let x = v * mult;
      if (f.min !== undefined) x = Math.max(f.min, x);
      if (f.max !== undefined) x = Math.min(f.max, x);
      window.WORKOS_OVERRIDE = { ...current, [f.key]: x };
      try {
        return { x, r: calc(tool.id) };
      } finally {
        window.WORKOS_OVERRIDE = null;
      }
    };
    const lo = run(1 - step / 100);
    const hi = run(1 + step / 100);
    const l = lo.r.primary?.value;
    const h = hi.r.primary?.value;
    if (!Number.isFinite(l) || !Number.isFinite(h)) continue;
    const flips = lo.r.text !== base.text || hi.r.text !== base.text;
    if (Math.abs(h - l) < 1e-9 && !flips) continue; // no influence: leave it out of the table
    rows.push({
      key: f.key, label, unit: f.unit || '', lowInput: lo.x, highInput: hi.x, low: l, high: h,
      swing: Math.abs(h - l), flips, lowText: lo.r.text, highText: hi.r.text,
    });
  }
  return rows.sort((a, b) => b.swing - a.swing);
}
