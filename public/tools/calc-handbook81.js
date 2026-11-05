// BIZOMAT MAKEOS calculations for quality statistics, forecasting and reliability tools (batch handbook81). SI units are explicit at each boundary.
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
    "normal-tolerance-interval-check": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const gp = (a, x) => { if (x <= 0) return 0; if (x > a + 40 * Math.sqrt(a) + 40) return 1; const g = -x + a * Math.log(x) - lg(a); if (x < a + 1) { let ap = a, sum = 1 / a, del = sum; for (let n = 0; n < 100000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(g); } let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let i = 1; i < 100000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (!Number.isFinite(del) || Math.abs(del - 1) < 1e-15) break; } return 1 - Math.exp(g) * h; };
      const chiQ = (pr, nu) => { const F = (x) => gp(nu / 2, x / 2); let lo = 0, hi = Math.max(1, nu); while (F(hi) < pr) hi *= 2; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (F(mid) < pr) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const Phi = (z) => (z >= 0 ? 0.5 + 0.5 * gp(0.5, z * z / 2) : 0.5 - 0.5 * gp(0.5, z * z / 2));
      const zQ = (pr) => { let lo = -40, hi = 40; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (Phi(mid) < pr) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const N_ = v.n, nu = N_ - 1, p = v.p / 100, g = v.conf / 100, zp = zQ(p), zg = zQ(g), z2 = zQ((1 + p) / 2), chi = chiQ(1 - g, nu);
      const k2 = z2 * Math.sqrt(nu * (1 + 1 / N_) / chi), a = 1 - zg * zg / (2 * nu), b = zp * zp - zg * zg / N_, k1nat = a > 0 && zp * zp - a * b >= 0 ? (zp + Math.sqrt(zp * zp - a * b)) / a : NaN;
      const delta = zp * Math.sqrt(N_), M = 400, z0 = -delta, hh = (12 - z0) / M, phi = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
      const ntCdf = (x) => { let s = 0; for (let i = 0; i <= M; i++) { const z = z0 + i * hh; s += phi(z) * (1 - gp(nu / 2, nu * ((z + delta) / x) ** 2 / 2)) * (i === 0 || i === M ? 1 : i % 2 ? 4 : 2); } return Phi(-delta) + s * hh / 3; };
      let xa = 0, fa = Phi(-delta) - g, xb = delta + 10, fb = ntCdf(xb) - g, xr = 0, xp = -1, side = 0; while (fb < 0) { xa = xb; fa = fb; xb *= 2; fb = ntCdf(xb) - g; }
      if (fa < 0) for (let i = 0; i < 100; i++) { xr = (xa * fb - xb * fa) / (fb - fa); if (Math.abs(xr - xp) <= 1e-12 * xr) break; xp = xr; const fr = ntCdf(xr) - g; if (fr === 0) break; if (fr > 0) { xb = xr; fb = fr; if (side === -1) fa /= 2; side = -1; } else { xa = xr; fa = fr; if (side === 1) fb /= 2; side = 1; } }
      const k1 = xr / Math.sqrt(N_), k = v.side === 'two' ? k2 : k1;
      const lo = v.mean - k * v.s, hi = v.mean + k * v.s;
      const okL = v.side === 'upper' || lo >= v.lsl - 1e-12, okU = v.side === 'lower' || hi <= v.usl + 1e-12, ok = okL && okU;
      const lims = v.side === 'two' ? `${q(lo, '', 5)} to ${q(hi, '', 5)}` : v.side === 'lower' ? `at least ${q(lo, '', 5)}` : `at most ${q(hi, '', 5)}`;
      return output({ k, k2, k1, ...(Number.isFinite(k1nat) ? { k1nat } : {}), chi, z2, zp, zg, lo, hi }, 'Tolerance factor k', k,
        [m('Tolerance factor k', `${q(k, '', 4)} (${v.side === 'two' ? 'two-sided, Howe' : 'one-sided, non-central t'})`), m('Tolerance limits', lims), m('Specification', `${v.side === 'upper' ? '—' : q(v.lsl, '', 5)} to ${v.side === 'lower' ? '—' : q(v.usl, '', 5)}`), m('Statement', `${q(v.p, '%', 2)} of all parts lie ${v.side === 'two' ? 'between these limits' : v.side === 'lower' ? 'above this limit' : 'below this limit'}, with ${q(v.conf, '%', 2)} confidence`)],
        'Normal tolerance interval check.', `${v.side === 'two' ? 'Two-sided' : 'One-sided'} tolerance interval.`, {
          text: ok ? 'TOLERANCE INTERVAL WITHIN SPEC' : 'TOLERANCE INTERVAL OUTSIDE SPEC', tone: ok ? 'good' : 'bad',
          checks: [check('Interval against specification', ok ? 'pass' : 'fail', ok ? `The tolerance limits (${lims}) lie inside the specification.` : `The tolerance limits (${lims}) reach outside the specification: more than ${q(100 - v.p, '%', 2)} of parts may be out, or the sample is too small to show otherwise.`), check('Normal distribution', 'verify', 'Check the sample on a normal probability plot; the factor assumes normal data.')],
          table: tbl('Tolerance factors', ['Factor', 'Method', 'Value'], [['k₂ two-sided', 'Howe approximation', q(k2, '', 4)], ['k₁ one-sided', 'Non-central t (exact)', q(k1, '', 4)], ['k₁ one-sided', 'Natrella approximation', Number.isFinite(k1nat) ? q(k1nat, '', 4) : 'not defined']]),
        });
    },
    "one-way-anova-check": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const bcf = (x, a, b) => { const FP = 1e-300, qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d; for (let j = 1; j <= 3000; j++) { const j2 = 2 * j; let aa = j * (b - j) * x / ((qam + j2) * (a + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c; aa = -(a + j) * (qab + j) * x / ((a + j2) * (qap + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; } return h; };
      const ib = (x, a, b) => { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lg(a + b) - lg(a) - lg(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * bcf(x, a, b) / a : 1 - bt * bcf(1 - x, b, a) / b; };
      const fCdf = (x, d1, d2) => (x <= 0 ? 0 : ib(d1 * x / (d1 * x + d2), d1 / 2, d2 / 2));
      const fQ = (pr, d1, d2) => { let lo = 0, hi = 1; while (fCdf(hi, d1, d2) < pr) hi *= 2; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (fCdf(mid, d1, d2) < pr) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const gs = Array.from({ length: v.k }, (_, j) => Array.from({ length: v[`n${j + 1}`] }, (_, i) => v[`g${j + 1}x${i + 1}`])), Nt = gs.reduce((a, g) => a + g.length, 0);
      if (Nt - v.k < 1) return invalid('Too few values: at least one group needs two or more values so there is scatter within groups.');
      const means = gs.map((g) => g.reduce((a, b) => a + b, 0) / g.length), grand = gs.flat().reduce((a, b) => a + b, 0) / Nt;
      const sst = gs.reduce((a, g, j) => a + g.length * (means[j] - grand) ** 2, 0), sse = gs.reduce((a, g, j) => a + g.reduce((b, x) => b + (x - means[j]) ** 2, 0), 0), sstot = sst + sse;
      if (!(sse > 0)) return invalid('No scatter within the groups: every group’s values are identical.');
      const dft = v.k - 1, dfe = Nt - v.k, mst = sst / dft, mse = sse / dfe, F = mst / mse, Fcrit = fQ(1 - v.alpha / 100, dft, dfe), p = 1 - fCdf(F, dft, dfe), diff = F > Fcrit + 1e-12;
      const hiJ = means.indexOf(Math.max(...means)), loJ = means.indexOf(Math.min(...means));
      return output({ grand, sst, sse, sstot, dft, dfe, mst, mse, F, Fcrit, p }, 'F statistic', F,
        [m('Group means', means.map((x, j) => `${j + 1}: ${q(x, '', 4)}`).join('; ')), m('Mean squares (treatment / error)', `${q(mst, '', 4)} / ${q(mse, '', 4)}`), m('F statistic', `${q(F, '', 4)} (${dft} and ${dfe} degrees of freedom)`), m('Critical F / p-value', `${q(Fcrit, '', 4)} / ${(p < 0.0001 ? 'below 0.0001' : q(p, '', 4))}`), m('Largest difference in means', `${q(means[hiJ] - means[loJ], '', 4)} (group ${hiJ + 1} against group ${loJ + 1})`)],
        'One-way ANOVA check.', `F test at ${q(v.alpha, '%', 1)} significance.`, {
          text: diff ? 'GROUP MEANS DIFFER' : 'NO SIGNIFICANT DIFFERENCE', tone: diff ? 'warn' : 'good',
          checks: [check('Difference between group means', diff ? 'warn' : 'pass', diff ? `F = ${q(F, '', 3)} exceeds ${q(Fcrit, '', 3)}: at least one group mean differs (p = ${(p < 0.0001 ? 'below 0.0001' : q(p, '', 4))}).` : `F = ${q(F, '', 3)} is within ${q(Fcrit, '', 3)}: the differences are within the scatter inside the groups.`), check('Equal spread and normality', 'verify', 'Check that the groups have similar spread and no strong skew or outliers.')],
          table: tbl('ANOVA table', ['Source', 'Sum of squares', 'Degrees of freedom', 'Mean square', 'F'], [['Between groups', q(sst, '', 4), String(dft), q(mst, '', 4), q(F, '', 4)], ['Within groups (error)', q(sse, '', 4), String(dfe), q(mse, '', 4), '—'], ['Total (corrected)', q(sstot, '', 4), String(Nt - 1), '—', '—']]),
        });
    },
    "two-variance-f-test": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const bcf = (x, a, b) => { const FP = 1e-300, qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d; for (let j = 1; j <= 3000; j++) { const j2 = 2 * j; let aa = j * (b - j) * x / ((qam + j2) * (a + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c; aa = -(a + j) * (qab + j) * x / ((a + j2) * (qap + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; } return h; };
      const ib = (x, a, b) => { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lg(a + b) - lg(a) - lg(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * bcf(x, a, b) / a : 1 - bt * bcf(1 - x, b, a) / b; };
      const fCdf = (x, d1, d2) => (x <= 0 ? 0 : ib(d1 * x / (d1 * x + d2), d1 / 2, d2 / 2));
      const fQ = (pr, d1, d2) => { let lo = 0, hi = 1; while (fCdf(hi, d1, d2) < pr) hi *= 2; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (fCdf(mid, d1, d2) < pr) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const d1 = v.n1 - 1, d2 = v.n2 - 1, F = (v.s1 / v.s2) ** 2, a = v.alpha / 100, P = fCdf(F, d1, d2);
      const lo = fQ(v.test === 'two' ? a / 2 : a, d1, d2), hi = fQ(v.test === 'two' ? 1 - a / 2 : 1 - a, d1, d2);
      const p = v.test === 'two' ? Math.min(1, 2 * Math.min(P, 1 - P)) : v.test === 'greater' ? 1 - P : P;
      const rej = (v.test !== 'greater' && F < lo - 1e-12) || (v.test !== 'less' && F > hi + 1e-12);
      const ciLo = Math.sqrt(F / fQ(1 - a / 2, d1, d2)), ciHi = Math.sqrt(F / fQ(a / 2, d1, d2));
      const crit = v.test === 'two' ? `${q(lo, '', 4)} and ${q(hi, '', 4)}` : v.test === 'greater' ? `above ${q(hi, '', 4)}` : `below ${q(lo, '', 4)}`;
      const text = !rej ? 'NO EVIDENCE SPREADS DIFFER' : v.test === 'two' ? 'SPREADS DIFFER' : v.test === 'greater' ? 'SAMPLE 1 SPREAD LARGER' : 'SAMPLE 1 SPREAD SMALLER';
      return output({ F, d1, d2, lo, hi, p, ciLo, ciHi, ratio: v.s1 / v.s2 }, 'Variance ratio F', F,
        [m('Variance ratio F', `${q(F, '', 5)} (${d1} and ${d2} degrees of freedom)`), m(v.test === 'two' ? 'Critical values' : 'Rejection region', crit), m('p-value', (p < 0.0001 ? 'below 0.0001' : q(p, '', 4))), m('Ratio of standard deviations σ₁ ÷ σ₂', `${q(v.s1 / v.s2, '', 4)} (${q(100 - v.alpha, '%', 1)} interval ${q(ciLo, '', 4)} to ${q(ciHi, '', 4)})`)],
        'Two-variance F test.', `${v.test === 'two' ? 'Two-sided' : 'One-sided'} F test at ${q(v.alpha, '%', 1)}.`, {
          text, tone: rej ? 'warn' : 'good',
          checks: [check('Variance ratio', rej ? 'warn' : 'pass', rej ? `F = ${q(F, '', 4)} lies in the rejection region (${crit}): the spreads differ (p = ${(p < 0.0001 ? 'below 0.0001' : q(p, '', 4))}).` : `F = ${q(F, '', 4)} is not in the rejection region (${crit}): no evidence that the spreads differ.`), check('Normal data', 'verify', 'Check both samples look roughly normal; the F test is not robust to skewed data or outliers.')],
          table: tbl('Samples', ['Sample', 'Size', 'Standard deviation', 'Variance'], [['1', String(v.n1), q(v.s1, '', 5), q(v.s1 ** 2, '', 5)], ['2', String(v.n2), q(v.s2, '', 5), q(v.s2 ** 2, '', 5)]]),
        });
    },
    "standard-deviation-chi-square-check": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const gp = (a, x) => { if (x <= 0) return 0; if (x > a + 40 * Math.sqrt(a) + 40) return 1; const g = -x + a * Math.log(x) - lg(a); if (x < a + 1) { let ap = a, sum = 1 / a, del = sum; for (let n = 0; n < 100000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(g); } let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let i = 1; i < 100000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (!Number.isFinite(del) || Math.abs(del - 1) < 1e-15) break; } return 1 - Math.exp(g) * h; };
      const chiQ = (pr, nu) => { const F = (x) => gp(nu / 2, x / 2); let lo = 0, hi = Math.max(1, nu); while (F(hi) < pr) hi *= 2; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (F(mid) < pr) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const nu = v.n - 1, a = v.alpha / 100, T_ = nu * (v.s / v.sigma0) ** 2, P = gp(nu / 2, T_ / 2);
      const lo = chiQ(v.test === 'two' ? a / 2 : a, nu), hi = chiQ(v.test === 'two' ? 1 - a / 2 : 1 - a, nu);
      const p = v.test === 'two' ? Math.min(1, 2 * Math.min(P, 1 - P)) : v.test === 'upper' ? 1 - P : P;
      const below = v.test !== 'upper' && T_ < lo - 1e-12, above = v.test !== 'lower' && T_ > hi + 1e-12, rej = below || above;
      const ciLo = Math.sqrt(nu * v.s ** 2 / chiQ(1 - a / 2, nu)), ciHi = Math.sqrt(nu * v.s ** 2 / chiQ(a / 2, nu));
      const crit = v.test === 'two' ? `${q(lo, '', 4)} and ${q(hi, '', 4)}` : v.test === 'upper' ? `above ${q(hi, '', 4)}` : `below ${q(lo, '', 4)}`;
      const text = !rej ? (v.test === 'lower' ? 'SPREAD NOT SHOWN BELOW TARGET' : 'SPREAD CONSISTENT WITH TARGET') : v.test === 'two' ? 'SPREAD DIFFERS FROM TARGET' : v.test === 'upper' ? 'SPREAD ABOVE TARGET' : 'SPREAD BELOW TARGET';
      const tone = v.test === 'lower' ? (rej ? 'good' : 'warn') : rej ? 'bad' : 'good';
      return output({ T: T_, nu, lo, hi, p, ciLo, ciHi }, 'Chi-square statistic', T_,
        [m('Chi-square statistic', `${q(T_, '', 4)} (${nu} degrees of freedom)`), m(v.test === 'two' ? 'Critical values' : 'Rejection region', crit), m('p-value', (p < 0.0001 ? 'below 0.0001' : q(p, '', 4))), m('True standard deviation', `${q(ciLo, '', 5)} to ${q(ciHi, '', 5)} (${q(100 - v.alpha, '%', 1)} confidence; sample ${q(v.s, '', 5)}, target ${q(v.sigma0, '', 5)})`)],
        'Standard deviation chi-square check.', `${v.test === 'two' ? 'Two-sided' : 'One-sided'} chi-square test at ${q(v.alpha, '%', 1)}.`, {
          text, tone,
          checks: [check('Spread against target', tone === 'good' ? 'pass' : tone === 'warn' ? 'warn' : 'fail', rej ? `T = ${q(T_, '', 4)} lies in the rejection region (${crit}), p = ${(p < 0.0001 ? 'below 0.0001' : q(p, '', 4))}.` : `T = ${q(T_, '', 4)} is not in the rejection region (${crit}): the sample cannot show a difference from σ₀ = ${q(v.sigma0, '', 5)}.`), check('Normal data', 'verify', 'Check the sample on a normal probability plot; this test assumes normal data.')],
        });
    },
    "holt-trend-forecast": (v) => {
      const ys = Array.from({ length: v.n }, (_, i) => v[`y${i + 1}`]), n = v.n, avg = ys.reduce((a, b) => a + b, 0) / n;
      if (!(avg > 0)) return invalid('Demand is zero in every period: there is nothing to forecast.');
      const b1 = v.b1 === 'first' ? ys[1] - ys[0] : v.b1 === 'all' ? (ys[n - 1] - ys[0]) / (n - 1) : (ys[3] - ys[0]) / 3;
      const run = (al, ga) => { let S = ys[0], b = b1, sse = 0; const Ss = [S], bs = [b], F = [null]; for (let t = 1; t < n; t++) { const f = S + b; F.push(f); sse += (ys[t] - f) ** 2; const Sn = al * ys[t] + (1 - al) * (S + b); b = ga * (Sn - S) + (1 - ga) * b; S = Sn; Ss.push(S); bs.push(b); } return { S, b, Ss, bs, F, mse: sse / (n - 1) }; };
      const r = run(v.alpha, v.gamma), rmse = Math.sqrt(r.mse), rpct = rmse / avg * 100, fc = r.S + v.m * r.b, fc1 = r.S + r.b;
      let best = null, bestA = 1, bestG = 1; for (let i = 1; i <= 100; i++) for (let j = 1; j <= 100; j++) { const x = run(i / 100, j / 100); if (!best || x.mse < best.mse - 1e-12) { best = x; bestA = i / 100; bestG = j / 100; } }
      const ok = rpct <= v.target + 1e-9, close = best.mse >= r.mse * 0.95 - 1e-12;
      const rows = ys.map((y, t) => [String(t + 1), q(y, '', 2), t ? q(r.F[t], '', 3) : '—', q(r.Ss[t], '', 3), q(r.bs[t], '', 3)]).concat(Array.from({ length: Math.min(v.m, 12) }, (_, k) => [String(n + k + 1), '—', q(r.S + (k + 1) * r.b, '', 3), '—', '—']));
      return output({ S: r.S, b: r.b, b1, fc, fc1, mse: r.mse, rmse, rpct, avg, bestA, bestG, bestMse: best.mse }, 'Forecast at the last period ahead', fc,
        [m(`Forecast ${v.m} period(s) ahead`, q(fc, 'units', 2)), m('Next-period forecast', q(fc1, 'units', 2)), m('Level / trend after period ' + n, `${q(r.S, '', 3)} / ${q(r.b, '', 3)} per period`), m('Mean squared error / RMSE', `${q(r.mse, '', 4)} / ${q(rmse, 'units', 3)} (${q(rpct, '%', 1)} of average)`), m('Best α, γ on this history', `${q(bestA, '', 2)}, ${q(bestG, '', 2)} (MSE ${q(best.mse, '', 4)})`)],
        'Holt trend forecast.', 'Double exponential smoothing.', {
          text: ok ? 'FORECAST ERROR WITHIN TARGET' : 'FORECAST ERROR TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Forecast error', ok ? 'pass' : 'fail', `RMSE ${q(rpct, '%', 1)} of average demand against ${q(v.target, '%', 1)}${ok ? '.' : ': try the best constants, more history, or a seasonal method.'}`), check('Smoothing constants', close ? 'pass' : 'warn', close ? 'The constants used are close to the best on this history.' : `α ${q(bestA, '', 2)}, γ ${q(bestG, '', 2)} gave a smaller error on this history (MSE ${q(best.mse, '', 3)} against ${q(r.mse, '', 3)}).`), check('Trend and season', 'verify', 'Plot the demand: the method projects a straight trend and does not model seasons.')],
          table: tbl('Periods', ['Period', 'Demand', 'Forecast', 'Level', 'Trend'], rows),
        });
    },
    "arrhenius-acceleration-check": (v) => {
      const k = 8.617333262e-5, Tu = v.tu + 273.15, Ts = v.ts + 273.15;
      if (!(Tu > 0 && Ts > 0)) return invalid('Temperatures must be above absolute zero.');
      if (!(Ts > Tu)) return invalid('The test temperature must be higher than the use temperature to accelerate failures.');
      const af = (ea) => Math.exp(ea / k * (1 / Tu - 1 / Ts)), AF = af(v.ea), eqH = AF * v.th, need = v.life / AF, ok = eqH >= v.life - 1e-9;
      const eas = [-0.2, -0.1, 0, 0.1, 0.2].map((d) => Math.round((v.ea + d) * 1000) / 1000).filter((e) => e > 0);
      return output({ AF, eqH, need, th: v.th, Tu, Ts }, 'Acceleration factor', AF,
        [m('Acceleration factor', q(AF, '', 4)), m('Equivalent service hours of the test', q(eqH, 'h', 0)), m('Test hours needed for the target life', q(need, 'h', 1)), m('Temperatures', `${q(Tu, 'K', 2)} use, ${q(Ts, 'K', 2)} test`)],
        'Arrhenius acceleration check.', 'Arrhenius temperature acceleration.', {
          text: ok ? 'TEST COVERS TARGET LIFE' : 'TEST TOO SHORT FOR TARGET LIFE', tone: ok ? 'good' : 'bad',
          checks: [check('Test length', ok ? 'pass' : 'fail', ok ? `${q(v.th, 'h', 0)} at ${q(v.ts, '°C', 0)} represent ${q(eqH, 'h', 0)} of service, covering ${q(v.life, 'h', 0)}.` : `${q(v.th, 'h', 0)} represent only ${q(eqH, 'h', 0)} of service: ${q(need, 'h', 0)} of testing are needed for ${q(v.life, 'h', 0)}.`), check('Activation energy', 'verify', 'Use an activation energy measured for this failure mechanism; the factor changes steeply with it (see the table).'), check('Same failure mechanism', 'verify', 'Confirm the test temperature does not start failure modes that do not occur in service.')],
          table: tbl('Sensitivity to activation energy', ['Activation energy (eV)', 'Acceleration factor', 'Equivalent service hours'], eas.map((e) => [q(e, '', 3), q(af(e), '', 4), q(af(e) * v.th, 'h', 0)])),
        });
    },
    "mtbf-confidence-bounds": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const gp = (a, x) => { if (x <= 0) return 0; if (x > a + 40 * Math.sqrt(a) + 40) return 1; const g = -x + a * Math.log(x) - lg(a); if (x < a + 1) { let ap = a, sum = 1 / a, del = sum; for (let n = 0; n < 100000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(g); } let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let i = 1; i < 100000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (!Number.isFinite(del) || Math.abs(del - 1) < 1e-15) break; } return 1 - Math.exp(g) * h; };
      const chiQ = (pr, nu) => { const F = (x) => gp(nu / 2, x / 2); let lo = 0, hi = Math.max(1, nu); while (F(hi) < pr) hi *= 2; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (F(mid) < pr) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const C = v.conf / 100, r = v.r, c2 = chiQ(C, 2 * (r + 1)), lower = 2 * v.T / c2, upper = r > 0 ? 2 * v.T / chiQ(1 - C, 2 * r) : Infinity;
      const mtbf = r > 0 ? v.T / r : Infinity, lam = r / v.T, zero = v.T / -Math.log(1 - C), more = Math.max(0, v.req * c2 / 2 - v.T), ok = lower >= v.req - 1e-9;
      return output({ ...(r > 0 ? { mtbf, upper } : {}), lam, lower, zero, more, req: v.req, c2 }, 'MTBF lower bound', lower,
        [m('MTBF estimate', r > 0 ? q(mtbf, 'h', 1) : 'no failures recorded'), m('Failure rate', q(lam, 'per h', 6)), m(`Lower bound (${q(v.conf, '%', 1)} one-sided)`, q(lower, 'h', 1)), m(`Two-sided interval (${q(2 * v.conf - 100, '%', 1)})`, `${q(lower, 'h', 1)} to ${r > 0 ? q(upper, 'h', 1) : 'no upper bound'}`), m('Further failure-free hours to demonstrate the requirement', ok ? 'none' : q(more, 'h', 0))],
        'MTBF confidence bounds.', 'Chi-square bounds for a constant failure rate.', {
          text: ok ? 'MTBF REQUIREMENT DEMONSTRATED' : 'MTBF REQUIREMENT NOT DEMONSTRATED', tone: ok ? 'good' : 'bad',
          checks: [check('Lower bound against requirement', ok ? 'pass' : 'fail', ok ? `The ${q(v.conf, '%', 1)} lower bound ${q(lower, 'h', 1)} meets the required ${q(v.req, 'h', 1)}.` : `The ${q(v.conf, '%', 1)} lower bound ${q(lower, 'h', 1)} is below the required ${q(v.req, 'h', 1)}: about ${q(more, 'h', 0)} more operating hours without a failure would demonstrate it.`), check('Constant failure rate', 'verify', 'Check failures are not bunched early (infant mortality) or late (wear-out); the bounds assume a constant rate.')],
          table: tbl('Bounds at other confidence levels', ['One-sided confidence', 'Lower bound (h)', 'Upper bound (h)'], [0.8, 0.9, 0.95, 0.99].map((c) => [q(c * 100, '%', 0), q(2 * v.T / chiQ(c, 2 * (r + 1)), '', 1), r > 0 ? q(2 * v.T / chiQ(1 - c, 2 * r), '', 1) : '—'])),
        });
    },
    "reliability-growth-check": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const gp = (a, x) => { if (x <= 0) return 0; if (x > a + 40 * Math.sqrt(a) + 40) return 1; const g = -x + a * Math.log(x) - lg(a); if (x < a + 1) { let ap = a, sum = 1 / a, del = sum; for (let n = 0; n < 100000; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(g); } let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let i = 1; i < 100000; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (!Number.isFinite(del) || Math.abs(del - 1) < 1e-15) break; } return 1 - Math.exp(g) * h; };
      const Phi = (z) => (z >= 0 ? 0.5 + 0.5 * gp(0.5, z * z / 2) : 0.5 - 0.5 * gp(0.5, z * z / 2));
      const zQ = (pr) => { let lo = -40, hi = 40; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (Phi(mid) < pr) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const r = v.r, ts = Array.from({ length: r }, (_, i) => v[`t${i + 1}`]);
      for (let i = 1; i < r; i++) if (!(ts[i] >= ts[i - 1])) return invalid('Failure times must be cumulative test hours in increasing order.');
      if (ts[r - 1] > v.T + 1e-9) return invalid('The test end time must be at or after the last failure time.');
      const L = ts.reduce((s, t) => s + Math.log(v.T / t), 0);
      if (!(L > 0)) return invalid('All failures occurred at the end of the test: the growth slope cannot be estimated.');
      const b = (r - 1) / L, beta = 1 - b, a = r / v.T ** b, mtbf = v.T / (r * b), cum = v.T / r, z = zQ(v.conf / 100);
      const ML = mtbf * r * (r - 1) / (r + z * z / 4 + Math.sqrt(r * z * z / 2 + z ** 4 / 16)) ** 2, den = r - z * Math.sqrt(r / 2), MU = den > 0 ? mtbf * r * (r - 1) / den ** 2 : Infinity;
      const tGoal = b < 1 ? (v.goal * a * b) ** (1 / (1 - b)) : Infinity, extra = Math.max(0, tGoal - v.T), ok = ML >= v.goal - 1e-9, growing = beta > 0;
      return output({ b, beta, a, mtbf, cum, ML, ...(Number.isFinite(MU) ? { MU } : {}), ...(Number.isFinite(tGoal) ? { tGoal, extra } : {}), L }, 'MTBF at end of test', mtbf,
        [m('Growth slope β', `${q(beta, '', 4)} (b = ${q(b, '', 4)}, a = ${q(a, '', 4)})`), m('MTBF at end of test', q(mtbf, 'h', 1)), m(`Limits (${q(v.conf, '%', 1)} lower, ${q(2 * v.conf - 100, '%', 1)} interval)`, `${q(ML, 'h', 1)} to ${Number.isFinite(MU) ? q(MU, 'h', 1) : 'no upper limit'}`), m('Cumulative MTBF', q(cum, 'h', 1)), m('Test hours for the MTBF estimate to reach the goal', mtbf >= v.goal - 1e-9 ? (Number.isFinite(tGoal) ? `already reached (at about ${q(tGoal, 'h', 0)})` : 'already reached') : Number.isFinite(tGoal) ? `${q(tGoal, 'h', 0)} (${q(extra, 'h', 0)} more at the same growth rate)` : 'not reached: no growth')],
        'Reliability growth check.', 'Power-law (Duane) model, modified maximum likelihood.', {
          text: ok ? 'MTBF GOAL DEMONSTRATED' : 'MTBF GOAL NOT DEMONSTRATED', tone: ok ? 'good' : 'bad',
          checks: [check('Lower limit against goal', ok ? 'pass' : 'fail', ok ? `The ${q(v.conf, '%', 1)} lower limit ${q(ML, 'h', 1)} meets the goal of ${q(v.goal, 'h', 1)}.` : `The ${q(v.conf, '%', 1)} lower limit ${q(ML, 'h', 1)} is below the goal of ${q(v.goal, 'h', 1)}${mtbf >= v.goal - 1e-9 ? `; the point estimate ${q(mtbf, 'h', 1)} already meets it, so more test hours and failures would narrow the limits` : ` (point estimate ${q(mtbf, 'h', 1)})`}.`), check('Reliability growth', growing ? 'pass' : 'warn', growing ? `β = ${q(beta, '', 3)}: the failure rate is falling as faults are fixed.` : `β = ${q(beta, '', 3)}: no growth; the failure rate is steady or rising.`), check('Model fit', 'verify', 'Plot cumulative MTBF (tᵢ ÷ i) against tᵢ on log-log axes: the points should lie near a straight line.')],
          table: tbl('Failures', ['Failure', 'Time (h)', 'Cumulative MTBF (h)', 'ln(T ÷ t)'], ts.map((t, i) => [String(i + 1), q(t, '', 1), q(t / (i + 1), '', 2), q(Math.log(v.T / t), '', 4)])),
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
