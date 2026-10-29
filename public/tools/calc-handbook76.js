// KEVOS® MAKEOS calculations for quality, reliability, maintenance, operations and fabrication tools (batch handbook76). SI units are explicit at each boundary.
// Methods are standard engineering relations; no source tables, ratings or recommended settings are reproduced.
// Material properties, ratings, factors and limits are always entered by the user.
(() => {
  const PI = Math.PI;
  const rad = (degrees) => degrees * PI / 180;
  const deg = (radians) => radians * 180 / PI;
  const area = (d) => PI * d * d / 4;
  const ATM = 1.01325; // standard atmosphere, bar
  const q = (value, unit, digits = 4) => {
    if (value === 0) value = 0; // no negative zero
    const formatted = value !== 0 && Math.abs(value) < 10 ** -digits
      ? fmtPrimary('engineering', value) : num(value, digits);
    return `${formatted}${unit ? ` ${unit}` : ''}`;
  };
  const tbl = (caption, head, rows) => ({ caption, head, rows });
  function invalid(message) {
    return result('CHECK INPUTS', 'bad', message,
      [m('Calculation', 'Not evaluated'), m('Next step', 'Correct the inputs')],
      'No calculated value is reported until the input conditions are met.', {
        checks: [check('Input validity', 'fail', message)],
        actions: ['Correct the reported condition and analyse again.'],
      });
  }
  function read(tool) {
    const values = {};
    for (const f of tool.fields) {
      if (f.type === 'heading') continue;
      const override = window.WORKOS_OVERRIDE;
      const raw = override && Object.prototype.hasOwnProperty.call(override, f.key)
        ? override[f.key] : document.querySelector(`[name="${f.key}"]`)?.value;
      if (f.type === 'select') {
        if (!f.options.some((o) => o[0] === String(raw))) return { error: `${f.label}: choose a listed option.` };
        values[f.key] = String(raw);
      } else {
        const v = Number(raw);
        if (raw == null || String(raw).trim() === '' || !Number.isFinite(v)) return { error: `${f.label}: enter a finite number.` };
        if (v < f.min || v > f.max) return { error: `${f.label}: enter a value from ${f.min} to ${f.max}${f.unit ? ` ${f.unit}` : ''}.` };
        if (f.integer && !Number.isInteger(v)) return { error: `${f.label}: enter a whole number.` };
        values[f.key] = v;
      }
    }
    return { values };
  }
  /** Result with the model check always last. extra may set text, tone, checks, actions, table, risks, guidance. */
  function output(values, label, value, metrics, summary, limit, extra = {}) {
    const finite = (x) => typeof x !== 'number' || Number.isFinite(x);
    if (!Number.isFinite(value) || !Object.values(values).every(finite)) {
      return invalid('The calculation is outside the supported numeric range. Review the dimensions and units.');
    }
    const { checks = [], actions = [], ...rest } = extra;
    return result('CALCULATED', 'warn', summary, metrics, limit, {
      primary: primary(label, value, 'engineering'), values,
      checks: [...checks, check('Model and application', 'verify', limit)],
      actions: [...actions, 'Check the method, input sources and limitations below before using this result.'],
      ...rest,
    });
  }
  /** A ratio-against-requirement verdict: capacity ÷ demand compared with a user-entered required factor. */
  function verdict(factor, required, okText, badText) {
    return factor >= required ? { text: okText, tone: 'good', st: 'pass' } : { text: badText, tone: 'bad', st: 'fail' };
  }
  const methods = {
    "bearing-defect-frequency-check": (v) => {
      if (v.d >= v.D) return invalid('The rolling element diameter must be smaller than the pitch diameter.');
      const fr = v.rpm / 60, r = v.d / v.D * Math.cos(rad(v.phi)), bpfo = v.nb * fr / 2 * (1 - r), bpfi = v.nb * fr / 2 * (1 + r), ftf = fr / 2 * (1 - r), bsf = v.D * fr / (2 * v.d) * (1 - r * r);
      const list = [['Outer race (BPFO)', bpfo], ['Inner race (BPFI)', bpfi], ['Ball spin (BSF)', bsf], ['Cage (FTF)', ftf]];
      let best = null;
      for (const [name, fq] of list) for (const h of [1, 2, 3]) { const e = Math.abs(v.fm - h * fq) / (h * fq) * 100; if (e <= v.tol + 1e-9 && (!best || e < best.e)) best = { name, h, e }; }
      const match = best ? 1 : 0;
      const rows = list.map(([name, fq]) => [name, q(fq, 'Hz', 2), q(fq * 60, 'cpm', 0), q(fq / fr, '×', 3), `${q(2 * fq, '', 2)} / ${q(3 * fq, 'Hz', 2)}`]);
      return output({ fr, r, bpfo, bpfi, bsf, ftf, match, err: best ? best.e : 0 }, 'BPFO (Hz)', bpfo,
        [m('Shaft frequency', q(fr, 'Hz', 3)), m('BPFO / BPFI', `${q(bpfo, '', 2)} / ${q(bpfi, 'Hz', 2)}`), m('BSF / FTF', `${q(bsf, '', 2)} / ${q(ftf, 'Hz', 3)}`), m('Measured peak', best ? `${best.h === 1 ? '' : `${best.h} × `}${best.name}, ${q(best.e, '%', 2)} off` : 'no defect frequency within the tolerance')],
        'Bearing defect frequency check.', 'Kinematic frequencies with no slip.', {
          text: best ? `PEAK MATCHES ${best.name.replace(/ \(.*\)/, '').toUpperCase()} DEFECT` : 'NO BEARING FREQUENCY MATCH', tone: best ? 'bad' : 'good',
          checks: [check('Measured peak', best ? 'fail' : 'pass', best ? `${q(v.fm, 'Hz', 2)} is within ${q(best.e, '%', 2)} of ${best.h === 1 ? '' : `${best.h} × `}${best.name}.` : `${q(v.fm, 'Hz', 2)} is not within ${q(v.tol, '%', 1)} of any defect frequency or its harmonics.`), check('Confirmation', 'verify', 'Confirm with the envelope spectrum, sidebands, the trend over time and physical inspection before replacing the bearing.')],
          table: tbl('Defect frequencies', ['Defect', 'Frequency', 'Per minute', 'Order of shaft speed', '2× / 3×'], rows),
        });
    },
    "individuals-chart-check": (v) => {
      const xs = Array.from({ length: v.k }, (_, i) => v[`x${i + 1}`]), n = xs.length, mean = xs.reduce((a, b) => a + b, 0) / n;
      const mrs = xs.slice(1).map((x, i) => Math.abs(x - xs[i])), mrbar = mrs.reduce((a, b) => a + b, 0) / mrs.length, sigma = mrbar / 1.128, ucl = mean + 3 * sigma, lcl = mean - 3 * sigma;
      if (mrbar === 0) return invalid('All readings are identical: there is no variation to chart.');
      const out = xs.map((x, i) => [i + 1, x]).filter(([, x]) => x > ucl + 1e-12 || x < lcl - 1e-12), nOut = out.length, ok = nOut === 0;
      const rows = xs.map((x, i) => [String(i + 1), q(x, '', 5), i ? q(mrs[i - 1], '', 5) : '—', x > ucl + 1e-12 ? 'above UCL' : x < lcl - 1e-12 ? 'below LCL' : 'in control']);
      return output({ mean, mrbar, sigma, ucl, lcl, nOut }, 'Upper control limit', ucl,
        [m('Mean', q(mean, '', 5)), m('Average moving range', q(mrbar, '', 5)), m('Estimated standard deviation', q(sigma, '', 5)), m('Control limits', `${q(lcl, '', 5)} to ${q(ucl, '', 5)}`), m('Readings outside the limits', ok ? 'none' : out.map(([i]) => `reading ${i}`).join(', '))],
        'Individuals control chart check.', 'Limits from the average moving range of two.', {
          text: ok ? 'PROCESS IN CONTROL' : 'POINT OUT OF CONTROL', tone: ok ? 'good' : 'bad',
          checks: [check('Points beyond the limits', ok ? 'pass' : 'fail', ok ? `All ${n} readings lie within the limits.` : `${nOut} reading(s) outside the limits: look for a special cause.`), check('Number of readings', n >= 12 ? 'verify' : 'warn', 'Limits from few readings are rough; recalculate with 20 to 25 readings and apply the run rules too.')],
          table: tbl('Readings and moving ranges', ['Reading', 'Value', 'Moving range', 'Status'], rows),
        });
    },
    "p-chart-check": (v) => {
      const ds = Array.from({ length: v.k }, (_, i) => v[`d${i + 1}`]);
      if (ds.some((d) => d > v.n)) return invalid('A sample cannot have more defectives than items inspected.');
      const tot = ds.reduce((a, b) => a + b, 0), pbar = tot / (v.k * v.n);
      if (pbar === 0) return invalid('No defectives in any sample: a p-chart needs some defectives to set limits.');
      if (pbar === 1) return invalid('Every item is defective: a p-chart cannot be drawn.');
      const s = Math.sqrt(pbar * (1 - pbar) / v.n), ucl = Math.min(1, pbar + 3 * s), lclRaw = pbar - 3 * s, lcl = Math.max(0, lclRaw), thr = Math.floor(ucl * v.n + 1e-9) + 1;
      const ps = ds.map((d) => d / v.n), out = ps.map((p, i) => [i + 1, p]).filter(([, p]) => p > ucl + 1e-12 || (lcl > 0 && p < lcl - 1e-12)), nOut = out.length, ok = nOut === 0;
      const rows = ds.map((d, i) => [String(i + 1), String(d), q(Math.round(ps[i] * 1e6) / 1e4, '%', 2), ps[i] > ucl + 1e-12 ? 'above UCL' : lcl > 0 && ps[i] < lcl - 1e-12 ? 'below LCL' : 'in control']);
      return output({ pbar, s, ucl, lcl, lclRaw, thr, nOut }, 'Upper control limit (fraction)', ucl,
        [m('Average fraction defective', q(Math.round(pbar * 1e6) / 1e4, '%', 3)), m('Standard deviation of p', q(s, '', 5)), m('Control limits', `${q(Math.round(lcl * 1e6) / 1e4, '', 3)} % to ${q(Math.round(ucl * 1e6) / 1e4, '%', 3)}`), m('Defectives per sample that signal', `${q(thr, 'or more', 0)}`), m('Samples outside the limits', ok ? 'none' : out.map(([i]) => `sample ${i}`).join(', '))],
        'p-chart check.', 'Equal sample sizes; binomial limits.', {
          text: ok ? 'PROCESS IN CONTROL' : 'SAMPLE OUT OF CONTROL', tone: ok ? 'good' : 'bad',
          checks: [check('Samples beyond the limits', ok ? 'pass' : 'fail', ok ? `All ${v.k} samples lie within the limits.` : `${nOut} sample(s) outside the limits: look for a special cause.`), check('Lower limit', lclRaw > 0 ? 'pass' : 'warn', lclRaw > 0 ? 'The lower limit is above zero, so improvements can show.' : 'The lower limit is zero: larger samples are needed to detect improvement.')],
          table: tbl('Samples', ['Sample', 'Defectives', 'Fraction', 'Status'], rows),
        });
    },
    "reliability-demonstration-test": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const gP = (a, x) => { if (x <= 0) return 0; if (x < a + 1) { let s = 1 / a, d = s, ap = a; for (let k = 0; k < 2000; k++) { ap += 1; d *= x / ap; s += d; if (Math.abs(d) < Math.abs(s) * 1e-16) break; } return s * Math.exp(-x + a * Math.log(x) - lg(a)); } let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let k = 1; k < 2000; k++) { const an = -k * (k - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; } return 1 - Math.exp(-x + a * Math.log(x) - lg(a)) * h; };
      const chiq = (p, nu) => { let lo = 0, hi = nu + 50 * Math.sqrt(2 * nu) + 100; for (let k = 0; k < 300; k++) { const mid = (lo + hi) / 2; if (gP(nu / 2, mid / 2) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const p = v.conf / 100, fac = (rr) => 0.5 * chiq(p, 2 * (rr + 1)), factor = fac(v.r), T = v.M * factor, perUnit = T / v.units, daysNeed = perUnit / v.hpd, more = fac(v.r + 1), fewer = v.r > 0 ? fac(v.r - 1) : null, ok = daysNeed <= v.days + 1e-9;
      return output({ factor, T, perUnit, daysNeed, more, fewer }, 'Total unit-hours needed', T,
        [m('Test-length factor', q(factor, '', 3)), m('Total unit-hours needed', q(T, 'h', 0)), m('Hours per unit', q(perUnit, 'h', 0)), m('Calendar days needed', q(daysNeed, 'days', 1)), m('Factor with one more / one fewer failure allowed', `${q(more, '', 3)} / ${fewer == null ? '—' : q(fewer, '', 3)}`)],
        'Reliability demonstration test plan.', 'Exponential (constant failure rate) model.', {
          text: ok ? 'TEST FITS THE TIME AVAILABLE' : 'TEST TOO LONG FOR THE TIME AVAILABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Calendar time', ok ? 'pass' : 'fail', `${q(daysNeed, 'days', 1)} needed against ${q(v.days, 'days', 0)} available${ok ? '.' : `: put ${q(Math.ceil(T / (v.hpd * v.days)), 'units', 0)} on test or allow fewer failures.`}`), check('Failure model', 'verify', 'Confirm the failure rate is roughly constant (no early-life or wear-out failures in the test window).')],
        });
    },
    "queue-wait-check": (v) => {
      const mu = 60 / v.ts, a = v.lam / mu;
      const erl = (c) => { if (a >= c) return null; let term = 1, sum = 1; for (let k = 1; k < c; k++) { term *= a / k; sum += term; } const top = term * a / c / (1 - a / c); return top / (sum + top); };
      const rho = a / v.c, Pw = erl(v.c);
      if (Pw == null) return invalid(`The servers are overloaded (utilisation ${q(rho * 100, '%', 1)}): the queue grows without limit. Add servers or cut the service time.`);
      const Wq = Pw / (v.c * mu - v.lam), W = Wq + 1 / mu, Lq = v.lam * Wq, WqMin = Wq * 60, WMin = W * 60;
      let cNeed = null;
      for (let c = Math.max(1, Math.floor(a) + 1); c <= 1000; c++) { const p = erl(c); if (p != null && p / (c * mu - v.lam) * 60 <= v.target + 1e-9) { cNeed = c; break; } }
      const ok = WqMin <= v.target + 1e-9;
      return output({ mu, a, rho, Pw, WqMin, WMin, Lq, cNeed }, 'Average wait in the queue (min)', WqMin,
        [m('Utilisation', q(rho * 100, '%', 1)), m('Chance an arriving job waits', q(Pw * 100, '%', 1)), m('Average wait in the queue', q(WqMin, 'min', 2)), m('Average time in the system', q(WMin, 'min', 2)), m('Average number waiting', q(Lq, 'jobs', 2)), m('Fewest servers for the target wait', cNeed == null ? 'more than 1000' : q(cNeed, 'servers', 0))],
        'Queue wait check.', 'M/M/c queue in steady state.', {
          text: ok ? 'WAIT WITHIN TARGET' : 'WAIT TOO LONG', tone: ok ? 'good' : 'bad',
          checks: [check('Average wait', ok ? 'pass' : 'fail', `${q(WqMin, 'min', 1)} against ${q(v.target, 'min', 1)}${ok ? '.' : `: ${cNeed == null ? 'add servers' : `${q(cNeed, 'servers', 0)} needed`} or cut the service time.`}`), check('Utilisation', rho <= 0.85 ? 'pass' : 'warn', rho <= 0.85 ? `${q(rho * 100, '%', 0)} busy.` : `${q(rho * 100, '%', 0)} busy: waits are very sensitive to any rise in demand.`), check('Arrival pattern', 'verify', 'Check arrivals are roughly random; scheduled or batched arrivals change the waits.')],
        });
    },
    "sheet-nesting-yield": (v) => {
      const L = v.SL - 2 * v.edge, W = v.SW - 2 * v.edge;
      if (L <= 0 || W <= 0) return invalid('The edge margin leaves no usable sheet.');
      const fit = (len, size) => len >= size ? Math.floor((len + v.gap) / (size + v.gap) + 1e-9) : 0, grid = (l, w, a, b) => fit(l, a) * fit(w, b);
      const A = grid(L, W, v.pl, v.pw), B = grid(L, W, v.pw, v.pl);
      const split = (l, w, a, b) => { let best = 0; const rowsMax = fit(w, b); for (let k = 0; k <= rowsMax; k++) { const used = k > 0 ? k * (b + v.gap) : 0, rest = w - used; const n = fit(l, a) * k + (rest > 0 ? grid(l, rest, b, a) : 0); if (n > best) best = n; } return best; };
      const M1 = Math.max(split(L, W, v.pl, v.pw), split(L, W, v.pw, v.pl)), M2 = Math.max(split(W, L, v.pl, v.pw), split(W, L, v.pw, v.pl));
      const best = Math.max(A, B, M1, M2);
      if (best === 0) return invalid('The blank does not fit on the usable sheet in either direction.');
      const util = best * v.pl * v.pw / (v.SL * v.SW) * 100, sheets = Math.ceil(v.qty / best), spare = sheets * best - v.qty, cpp = sheets * v.price / v.qty, ok = util >= v.umin - 1e-9;
      const layout = best === A ? 'straight grid, blank lengthways' : best === B ? 'straight grid, blank turned 90°' : 'two-block layout';
      return output({ A, B, M1, M2, best, util, sheets, spare, cpp }, 'Blanks per sheet', best,
        [m('Straight grid lengthways / turned', `${q(A, '', 0)} / ${q(B, '', 0)}`), m('Two-block layouts', `${q(M1, '', 0)} / ${q(M2, '', 0)}`), m('Best of these layouts', `${q(best, 'blanks', 0)} (${layout})`), m('Material utilisation', q(util, '%', 1)), m('Sheets needed / spare blanks', `${q(sheets, '', 0)} / ${q(spare, '', 0)}`), m('Material cost per blank', `A\u0024${num(Math.round(cpp * 100) / 100, 2)}`)],
        'Sheet nesting yield check.', 'Rectangular blanks; grid and two-block layouts.', {
          text: ok ? 'LAYOUT ACCEPTABLE' : 'UTILISATION TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Material utilisation', ok ? 'pass' : 'fail', `${q(util, '%', 1)} against ${q(v.umin, '%', 0)}${ok ? '.' : ': try another sheet size, blank orientation or mixing with other parts.'}`), check('Shape and process', 'verify', 'Check grain direction, lead-ins and the cutting process’s minimum web before committing to the layout.')],
        });
    },
  };
  window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
  window.GOCORE_CALC_PARTS.push((id) => {
    if (!Object.prototype.hasOwnProperty.call(methods, id)) return;
    const tool = window.GOCORE_TOOLS.find((t) => t.id === id);
    const inputs = read(tool);
    return inputs.error ? invalid(inputs.error) : methods[id](inputs.values);
  });
})();
