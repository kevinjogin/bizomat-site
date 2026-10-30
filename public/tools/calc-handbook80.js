// KEVOS® MAKEOS calculations for quality statistics and forecasting tools (batch handbook80). SI units are explicit at each boundary.
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
    "ewma-chart-check": (v) => {
      const xs = Array.from({ length: v.n }, (_, i) => v[`x${i + 1}`]), sd = v.s * Math.sqrt(v.lam / (2 - v.lam)), ucl = v.target + v.L * sd, lcl = v.target - v.L * sd;
      const zs = []; let z = v.target; for (const x of xs) { z = v.lam * x + (1 - v.lam) * z; zs.push(z); }
      const st = zs.map((z) => (z > ucl + 1e-12 ? 'above UCL' : z < lcl - 1e-12 ? 'below LCL' : 'in control')), firstI = st.findIndex((s) => s !== 'in control'), first = firstI + 1, nOut = st.filter((s) => s !== 'in control').length, ok = nOut === 0, last = zs[zs.length - 1];
      const rows = xs.map((x, i) => [String(i + 1), q(x, '', 4), q(zs[i], '', 4), st[i]]);
      return output({ sd, ucl, lcl, last, first, nOut }, 'Upper control limit', ucl,
        [m('Centre line (target)', q(v.target, '', 4)), m('Standard deviation of the EWMA', q(sd, '', 4)), m('Control limits', `${q(lcl, '', 4)} to ${q(ucl, '', 4)}`), m('Final EWMA', q(last, '', 4)), m('First signal', ok ? 'none' : `reading ${first} (${st[firstI]})`)],
        'EWMA control chart check.', 'Steady-state EWMA limits.', {
          text: ok ? 'PROCESS IN CONTROL' : 'EWMA OUT OF CONTROL', tone: ok ? 'good' : 'bad',
          checks: [check('EWMA beyond the limits', ok ? 'pass' : 'fail', ok ? `The EWMA stays within the limits for all ${v.n} readings.` : `The EWMA leaves the limits at reading ${first} (${nOut} reading(s) in all): look for a shift in the process mean.`), check('Historical data', 'verify', 'Confirm the target and standard deviation come from a period when the process was in control.')],
          table: tbl('Readings and EWMA', ['Reading', 'Value', 'EWMA', 'Status'], rows),
        });
    },
    "cusum-chart-check": (v) => {
      const xs = Array.from({ length: v.n }, (_, i) => v[`x${i + 1}`]), k = v.delta * v.sx / 2;
      let hi = 0, lo = 0; const H_ = [], L_ = [];
      for (const x of xs) { hi = Math.max(0, hi + x - v.mu0 - k); lo = Math.max(0, lo + v.mu0 - k - x); H_.push(hi); L_.push(lo); }
      const st = xs.map((_, i) => (H_[i] > v.h + 1e-12 ? 'upper sum above h' : L_[i] > v.h + 1e-12 ? 'lower sum above h' : 'in control')), firstI = st.findIndex((s) => s !== 'in control'), first = firstI + 1, ok = firstI < 0;
      const up = !ok && H_[firstI] > v.h + 1e-12, shi = H_[H_.length - 1], slo = L_[L_.length - 1], start = ok ? 0 : (() => { const S = up ? H_ : L_; let j = firstI; while (j > 0 && S[j - 1] > 0) j--; return j + 1; })();
      const rows = xs.map((x, i) => [String(i + 1), q(x, '', 4), q(H_[i], '', 4), q(L_[i], '', 4), st[i]]);
      return output({ k, shi, slo, first, start, hsig: v.h / v.sx }, 'Reference value k', k,
        [m('Reference value k', q(k, '', 4)), m('Decision interval h', `${q(v.h, '', 4)} (${q(v.h / v.sx, 'σ', 2)})`), m('Final upper / lower sum', `${q(shi, '', 4)} / ${q(slo, '', 4)}`), m('First signal', ok ? 'none' : `reading ${first}, ${up ? 'upward' : 'downward'} shift`), m('Sum last left zero', ok ? '—' : `reading ${start}`)],
        'CUSUM control chart check.', 'Tabular CUSUM.', {
          text: ok ? 'PROCESS IN CONTROL' : up ? 'UPWARD SHIFT SIGNALLED' : 'DOWNWARD SHIFT SIGNALLED', tone: ok ? 'good' : 'bad',
          checks: [check('Sums against the decision interval', ok ? 'pass' : 'fail', ok ? `Neither sum exceeds h over ${v.n} readings.` : `The ${up ? 'upper' : 'lower'} sum exceeds h at reading ${first}; the shift probably began near reading ${start}.`), check('Chart design', 'verify', 'Check that h and the shift to detect give an acceptable false alarm rate and detection speed for this process.')],
          table: tbl('Cumulative sums', ['Reading', 'Value', 'Upper sum', 'Lower sum', 'Status'], rows),
        });
    },
    "c-chart-check": (v) => {
      const cs = Array.from({ length: v.k }, (_, i) => v[`c${i + 1}`]), cbar = cs.reduce((a, b) => a + b, 0) / v.k;
      if (cbar === 0) return invalid('No defects on any unit: a c chart needs some defects to set limits.');
      const ucl = cbar + v.L * Math.sqrt(cbar), lclRaw = cbar - v.L * Math.sqrt(cbar), lcl = Math.max(0, lclRaw), thr = Math.floor(ucl + 1e-9) + 1;
      const st = cs.map((c) => (c > ucl + 1e-12 ? 'above UCL' : lclRaw > 0 && c < lcl - 1e-12 ? 'below LCL' : 'in control')), nOut = st.filter((s) => s !== 'in control').length, ok = nOut === 0;
      return output({ cbar, ucl, lcl, lclRaw, thr, nOut }, 'Upper control limit', ucl,
        [m('Average defects per unit', q(cbar, '', 3)), m('Control limits', `${lclRaw > 0 ? q(lcl, '', 3) : 'no lower limit'} to ${q(ucl, '', 3)}`), m('Defects per unit that signal', q(thr, 'or more', 0)), m('Units outside the limits', ok ? 'none' : st.map((s, i) => (s !== 'in control' ? `unit ${i + 1}` : null)).filter(Boolean).join(', '))],
        'c-chart check.', 'Poisson limits for equal inspection units.', {
          text: ok ? 'PROCESS IN CONTROL' : 'COUNT OUT OF CONTROL', tone: ok ? 'good' : 'bad',
          checks: [check('Units beyond the limits', ok ? 'pass' : 'fail', ok ? `All ${v.k} units lie within the limits.` : `${nOut} unit(s) outside the limits: look for a special cause.`), check('Lower limit', lclRaw > 0 ? 'pass' : 'warn', lclRaw > 0 ? 'There is a lower limit, so an improvement can show.' : 'No lower limit: a larger inspection unit is needed to show an improvement.')],
          table: tbl('Units', ['Unit', 'Defects', 'Status'], cs.map((c, i) => [String(i + 1), String(c), st[i]])),
        });
    },
    "grubbs-outlier-check": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const bcf = (x, a, b) => { const FP = 1e-300, qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d; for (let j = 1; j <= 3000; j++) { const j2 = 2 * j; let aa = j * (b - j) * x / ((qam + j2) * (a + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c; aa = -(a + j) * (qab + j) * x / ((a + j2) * (qap + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; } return h; };
      const ib = (x, a, b) => { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lg(a + b) - lg(a) - lg(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * bcf(x, a, b) / a : 1 - bt * bcf(1 - x, b, a) / b; };
      const tUp = (p, nu) => { const tail = (t) => 0.5 * ib(nu / (nu + t * t), nu / 2, 0.5); let lo = 0, hi = 1; while (tail(hi) > p && hi < 1e12) hi *= 2; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (tail(mid) > p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const N_ = v.n, xs = Array.from({ length: N_ }, (_, i) => v[`x${i + 1}`]), mean = xs.reduce((a, b) => a + b, 0) / N_, s = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / (N_ - 1));
      if (!(s > 0)) return invalid('All values are identical: there is no scatter to test.');
      let idx = 0;
      if (v.test === 'max') idx = xs.indexOf(Math.max(...xs)); else if (v.test === 'min') idx = xs.indexOf(Math.min(...xs)); else xs.forEach((x, i) => { if (Math.abs(x - mean) > Math.abs(xs[idx] - mean)) idx = i; });
      const G = v.test === 'two' ? Math.abs(xs[idx] - mean) / s : v.test === 'max' ? (xs[idx] - mean) / s : (mean - xs[idx]) / s;
      const p = v.alpha / 100 / (v.test === 'two' ? 2 * N_ : N_), nu = N_ - 2, t = tUp(p, nu), Gcrit = (N_ - 1) / Math.sqrt(N_) * Math.sqrt(t * t / (nu + t * t)), out = G > Gcrit + 1e-12 ? 1 : 0;
      return output({ mean, s, G, t, Gcrit, out, suspect: xs[idx] }, 'Grubbs statistic G', G,
        [m('Mean / standard deviation', `${q(mean, '', 5)} / ${q(s, '', 5)}`), m('Suspect value', `${q(xs[idx], '', 5)} (value ${idx + 1})`), m('Grubbs statistic G', q(G, '', 4)), m('Critical value', `${q(Gcrit, '', 4)} (t = ${q(t, '', 4)}, ${nu} degrees of freedom)`)],
        'Grubbs outlier check.', `${v.test === 'two' ? 'Two-sided' : 'One-sided'} Grubbs test at ${q(v.alpha, '%', 1)}.`, {
          text: out ? 'OUTLIER DETECTED' : 'NO OUTLIER DETECTED', tone: out ? 'bad' : 'good',
          checks: [check('Suspect value', out ? 'fail' : 'pass', out ? `G = ${q(G, '', 3)} exceeds ${q(Gcrit, '', 3)}: investigate value ${idx + 1} (${q(xs[idx], '', 5)}) for a cause.` : `G = ${q(G, '', 3)} is within ${q(Gcrit, '', 3)}: the scatter is consistent with a normal sample.`), check('Normality', 'verify', 'Check the other values look roughly normal (a normal probability plot); the test is not valid for skewed data.')],
          table: tbl('Values', ['Value', 'Measurement', '(x − mean) ÷ s'], xs.map((x, i) => [String(i + 1), q(x, '', 5), q((x - mean) / s, '', 3)])),
        });
    },
    "linear-calibration-check": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const bcf = (x, a, b) => { const FP = 1e-300, qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d; for (let j = 1; j <= 3000; j++) { const j2 = 2 * j; let aa = j * (b - j) * x / ((qam + j2) * (a + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c; aa = -(a + j) * (qab + j) * x / ((a + j2) * (qap + j2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; } return h; };
      const ib = (x, a, b) => { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lg(a + b) - lg(a) - lg(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * bcf(x, a, b) / a : 1 - bt * bcf(1 - x, b, a) / b; };
      const tUp = (p, nu) => { const tail = (t) => 0.5 * ib(nu / (nu + t * t), nu / 2, 0.5); let lo = 0, hi = 1; while (tail(hi) > p && hi < 1e12) hi *= 2; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (tail(mid) > p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const n = v.n, X = Array.from({ length: n }, (_, i) => v[`r${i + 1}`]), Y = Array.from({ length: n }, (_, i) => v[`y${i + 1}`]);
      const xb = X.reduce((a, b) => a + b, 0) / n, yb = Y.reduce((a, b) => a + b, 0) / n, Sxx = X.reduce((a, x) => a + (x - xb) ** 2, 0), Sxy = X.reduce((a, x, i) => a + (x - xb) * (Y[i] - yb), 0);
      if (!(Sxx > 0)) return invalid('The reference values are all the same: use standards at different levels.');
      const b = Sxy / Sxx, a = yb - b * xb, res = Y.map((y, i) => y - a - b * X[i]), nu = n - 2, s = Math.sqrt(res.reduce((p, r) => p + r * r, 0) / nu);
      if (!(Math.abs(b) > 0)) return invalid('The readings do not change with the reference value: the slope is zero.');
      if (!(s > 0)) return invalid('The readings lie exactly on a line: there is no scatter to estimate an interval (use more decimals or repeat readings).');
      const conf = Number(v.conf), t = tUp((1 - conf) / 2, nu), sb = s / Math.sqrt(Sxx), sa = s * Math.sqrt(1 / n + xb * xb / Sxx), ta = Math.abs(a) / sa, tb = Math.abs(b - 1) / sb;
      const xstar = (v.ystar - a) / b, D = v.ystar - yb, g = t * t * s * s / Sxx, A = b * b - g;
      if (!(A > 0)) return invalid('The slope is not distinguishable from zero at this confidence: the calibration interval is unbounded. Use more or better-spread standards.');
      const Bq = -2 * b * D, Cq = D * D - t * t * s * s * (1 + 1 / n), disc = Bq * Bq - 4 * A * Cq, r1 = (-Bq - Math.sqrt(disc)) / (2 * A) + xb, r2 = (-Bq + Math.sqrt(disc)) / (2 * A) + xb, lo = Math.min(r1, r2), hi = Math.max(r1, r2), half = (hi - lo) / 2, ok = half <= v.tol + 1e-12;
      const maxRes = Math.max(...res.map(Math.abs));
      return output({ a, b, s, sa, sb, ta, tb, t, xstar, lo, hi, half, maxRes }, 'Calibrated value', xstar,
        [m('Line (reading = a + b × reference)', `a = ${q(a, '', 5)}, b = ${q(b, '', 6)}`), m('Residual standard deviation', `${q(s, '', 4)} (${nu} degrees of freedom)`), m('Intercept test (a = 0) / slope test (b = 1)', `t = ${q(ta, '', 2)} / ${q(tb, '', 2)} against ${q(t, '', 3)}`), m('Calibrated value', q(xstar, '', 5)), m('Calibration interval', `${q(lo, '', 5)} to ${q(hi, '', 5)} (± ${q(half, '', 4)})`)],
        'Linear calibration check.', `Straight-line least squares; ${q(conf * 100, '%', 0)} calibration interval.`, {
          text: ok ? 'CALIBRATION INTERVAL WITHIN TOLERANCE' : 'CALIBRATION INTERVAL TOO WIDE', tone: ok ? 'good' : 'bad',
          checks: [check('Calibration interval', ok ? 'pass' : 'fail', `Half-width ${q(half, '', 4)} against ${q(v.tol, '', 4)}${ok ? '.' : ': add standards near this level, repeat readings or use a better instrument.'}`), check('Offset and gain', ta > t || tb > t ? 'warn' : 'pass', ta > t || tb > t ? `${ta > t ? 'The intercept differs from zero (constant offset)' : ''}${ta > t && tb > t ? '; ' : ''}${tb > t ? 'the slope differs from one (gain error)' : ''}: apply the correction.` : 'Intercept and slope are consistent with 0 and 1: the instrument may not need correcting.'), check('Straight line', 'verify', 'Plot the residuals against the reference values: a curve or a fan shape means the straight line is not adequate.')],
          table: tbl('Standards', ['Standard', 'Reference', 'Reading', 'Residual'], X.map((x, i) => [String(i + 1), q(x, '', 5), q(Y[i], '', 5), q(res[i], '', 4)])),
        });
    },
    "exponential-smoothing-forecast": (v) => {
      const ys = Array.from({ length: v.n }, (_, i) => v[`y${i + 1}`]), avg = ys.reduce((a, b) => a + b, 0) / v.n;
      if (!(avg > 0)) return invalid('Demand is zero in every period: there is nothing to forecast.');
      const run = (al) => { const S = [null, ys[0]]; for (let t = 2; t < ys.length; t++) S.push(al * ys[t - 1] + (1 - al) * S[t - 1]); const e = ys.map((y, t) => (t ? y - S[t] : null)); const sse = e.slice(1).reduce((a, x) => a + x * x, 0); return { S, e, mse: sse / (ys.length - 1), fc: al * ys[ys.length - 1] + (1 - al) * S[ys.length - 1] }; };
      const r = run(v.alpha), rmse = Math.sqrt(r.mse), rpct = rmse / avg * 100;
      let bestA = 1, best = null; for (let k = 1; k <= 100; k++) { const al = k / 100, x = run(al); if (!best || x.mse < best.mse - 1e-12) { best = x; bestA = al; } }
      const ok = rpct <= v.target + 1e-9;
      return output({ fc: r.fc, mse: r.mse, rmse, rpct, avg, bestA, bestMse: best.mse, bestFc: best.fc }, 'Next-period forecast', r.fc,
        [m('Next-period forecast', q(r.fc, 'units', 2)), m('Mean squared error', q(r.mse, '', 3)), m('RMSE', `${q(rmse, 'units', 2)} (${q(rpct, '%', 1)} of average)`), m('Best α on this history', `${q(bestA, '', 2)} (MSE ${q(best.mse, '', 3)}, forecast ${q(best.fc, 'units', 2)})`)],
        'Exponential smoothing forecast.', 'Single exponential smoothing, S₂ = y₁.', {
          text: ok ? 'FORECAST ERROR WITHIN TARGET' : 'FORECAST ERROR TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Forecast error', ok ? 'pass' : 'fail', `RMSE ${q(rpct, '%', 1)} of average demand against ${q(v.target, '%', 1)}${ok ? '.' : ': try the best α, more history, or a method that follows trend.'}`), check('Smoothing constant', Math.abs(bestA - v.alpha) < 0.05 + 1e-9 ? 'pass' : 'warn', Math.abs(bestA - v.alpha) < 0.05 + 1e-9 ? `α ${q(v.alpha, '', 2)} is close to the best on this history.` : `α ${q(bestA, '', 2)} gave a smaller error on this history (MSE ${q(best.mse, '', 2)} against ${q(r.mse, '', 2)}).`), check('Trend and season', 'verify', 'Plot the demand: single smoothing lags any trend or seasonal pattern.')],
          table: tbl('Periods', ['Period', 'Demand', 'Forecast', 'Error'], ys.map((y, t) => [String(t + 1), q(y, '', 2), t ? q(r.S[t], '', 3) : '—', t ? q(r.e[t], '', 3) : '—']).concat([[String(v.n + 1), '—', q(r.fc, '', 3), '—']])),
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
