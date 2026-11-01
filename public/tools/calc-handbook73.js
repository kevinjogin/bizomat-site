// KEVOS® MAKEOS calculations for project, business, operations, maintenance, quality and machining tools (batch handbook73). SI units are explicit at each boundary.
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
    "earned-value-check": (v) => {
      if (v.EV > v.BAC) return invalid('Earned value cannot exceed the budget at completion.');
      if (v.AC <= 0 || v.PV <= 0 || v.EV <= 0) return invalid('Planned value, earned value and actual cost must all be greater than zero.');
      const CV = v.EV - v.AC, SV = v.EV - v.PV, CPI = v.EV / v.AC, SPI = v.EV / v.PV, EAC1 = v.BAC / CPI, EAC2 = v.AC + (v.BAC - v.EV) / (CPI * SPI), ETC = EAC1 - v.AC, VAC = v.BAC - EAC1;
      const spent = v.AC >= v.BAC, TCPI = spent ? null : (v.BAC - v.EV) / (v.BAC - v.AC), pc = v.EV / v.BAC * 100, durF = v.dur / SPI, money = (x) => `${x < 0 ? '−' : ''}A\u0024${num(Math.round(Math.abs(x)), 0)}`;
      const okC = CPI >= v.cpiMin - 1e-12, okS = SPI >= v.spiMin - 1e-12, okT = !spent && TCPI <= v.tcpiMax + 1e-12, ok = okC && okS && okT;
      return output({ CV, SV, CPI, SPI, EAC1, EAC2, ETC, VAC, TCPI, pc, durF }, 'Estimate at completion (AUD)', EAC1,
        [m('Cost variance / schedule variance', `${money(CV)} / ${money(SV)}`), m('CPI / SPI', `${q(CPI, '', 3)} / ${q(SPI, '', 3)}`), m('Estimate at completion (CPI)', money(EAC1)), m('Estimate at completion (CPI × SPI)', money(EAC2)), m('Estimate to complete / variance at completion', `${money(ETC)} / ${money(VAC)}`), m('TCPI to finish on budget', spent ? 'budget already spent' : q(TCPI, '', 3)), m('Per cent complete / forecast duration', `${q(pc, '%', 1)} / ${q(durF, 'months', 1)}`)],
        'Earned value check.', 'Earned value indices at the reporting date.', {
          text: ok ? 'PROJECT ON TRACK' : 'RECOVERY NEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Cost performance', okC ? 'pass' : 'fail', `CPI ${q(CPI, '', 3)} against ${q(v.cpiMin, '', 2)}.`), check('Schedule performance', okS ? 'pass' : 'fail', `SPI ${q(SPI, '', 3)} against ${q(v.spiMin, '', 2)}.`), check('Efficiency needed to finish on budget', okT ? 'pass' : 'fail', spent ? 'The budget is already spent: only a new budget can complete the work.' : `TCPI ${q(TCPI, '', 3)} against ${q(v.tcpiMax, '', 2)}.`), check('Earned value measurement', 'verify', 'Confirm earned value is measured against objective milestones or quantities, not estimated per cent complete.')],
        });
    },
    "pert-schedule-check": (v) => {
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const gP = (a, x) => { if (x <= 0) return 0; if (x < a + 1) { let s = 1 / a, d = s, ap = a; for (let k = 0; k < 500; k++) { ap += 1; d *= x / ap; s += d; if (Math.abs(d) < Math.abs(s) * 1e-16) break; } return s * Math.exp(-x + a * Math.log(x) - lg(a)); } let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let k = 1; k < 500; k++) { const an = -k * (k - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; } return 1 - Math.exp(-x + a * Math.log(x) - lg(a)) * h; };
      const Phi = (z) => 0.5 * (1 + Math.sign(z) * gP(0.5, z * z / 2)), zq = (p) => { let lo = -10, hi = 10; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (Phi(mid) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      let T = 0, V = 0, n = 0;
      for (const k of [1, 2, 3, 4, 5]) {
        const a = v[`a${k}`], mo = v[`m${k}`], b = v[`b${k}`];
        if (a === 0 && mo === 0 && b === 0) continue;
        if (!(a <= mo && mo <= b)) return invalid(`Activity ${k}: optimistic ≤ most likely ≤ pessimistic.`);
        T += (a + 4 * mo + b) / 6; V += ((b - a) / 6) ** 2; n++;
      }
      if (n === 0) return invalid('Enter at least one activity.');
      const sd = Math.sqrt(V), P = sd > 0 ? Phi((v.dl - T) / sd) * 100 : (v.dl >= T ? 100 : 0), zc = zq(v.conf / 100), Tc = T + zc * sd, ok = P >= v.conf - 1e-9;
      return output({ n, T, V, sd, P, zc, Tc }, 'Chance of meeting the deadline (%)', P,
        [m('Activities on the path', q(n, '', 0)), m('Expected path duration', q(T, 'days', 2)), m('Standard deviation of the path', q(sd, 'days', 2)), m('Chance of meeting the deadline', q(P, '%', 1)), m(`Duration to promise at ${q(v.conf, '%', 1)}`, q(Tc, 'days', 1))],
        'PERT schedule check.', 'Single path; independent activities; normal total.', {
          text: ok ? 'DEADLINE ACHIEVABLE' : 'DEADLINE AT RISK', tone: ok ? 'good' : 'bad',
          checks: [check('Chance of meeting the deadline', ok ? 'pass' : 'fail', `${q(P, '%', 1)} against ${q(v.conf, '%', 1)} required${ok ? '.' : `: promise ${q(Tc, 'days', 1)} or shorten the path.`}`), check('Other paths', 'verify', 'Check near-critical parallel paths; they lower the real chance of finishing on time.')],
        });
    },
    "early-payment-discount-check": (v) => {
      const days = v.N - v.nd;
      if (days <= 0) return invalid('The net due date must be later than the discount date.');
      if (v.d <= 0) return invalid('Enter a discount greater than zero.');
      const r = v.d / (100 - v.d), mm = 365 / days, nom = r * mm * 100, eff = ((1 + r) ** mm - 1) * 100, save = v.inv * v.d / 100, pay = v.inv - save, take = eff > v.i + 1e-12, money = (x) => `A\u0024${num(Math.round(x * 100) / 100, 2)}`;
      return output({ r, mm, nom, eff, save, pay }, 'Effective annual rate of the discount (%)', eff,
        [m('Return for paying early', q(r * 100, '%', 3)), m('Days gained by paying net', q(days, 'days', 0)), m('Nominal annual rate', q(nom, '%', 2)), m('Effective annual rate', q(eff, '%', 2)), m('Saving on this invoice / amount to pay early', `${money(save)} / ${money(pay)}`)],
        'Early payment discount check.', 'Effective rate at the payment interval.', {
          text: take ? 'TAKE THE DISCOUNT' : 'PAY ON NET TERMS', tone: take ? 'good' : 'warn',
          checks: [check('Discount against your cost of funds', take ? 'pass' : 'fail', `${q(eff, '%', 1)} a year against ${q(v.i, '%', 1)}${take ? ': borrowing to pay early still pays.' : ': keep the cash until the due date.'}`), check('Cash available', 'verify', 'Confirm the cash or credit is available on the discount date.')],
        });
    },
    "economic-production-quantity": (v) => {
      const d = v.D / v.wd;
      if (v.p <= d) return invalid('The production rate must exceed the daily demand, or stock can never build up.');
      if (v.S <= 0) return invalid('Enter a set-up cost greater than zero.');
      const k = 1 - d / v.p, Qs = Math.sqrt(2 * v.D * v.S / (v.Hc * k)), C = (Q) => v.D * v.S / Q + v.Hc * Q * k / 2, Cs = C(Qs), Cn = C(v.Qnow), extra = (Cn / Cs - 1) * 100;
      const run = Qs / v.p, cycle = Qs / d, peak = Qs * k, runs = v.D / Qs, prodDays = v.D / v.p, ok = extra <= v.tol + 1e-9, money = (x) => `A\u0024${num(Math.round(x), 0)}`;
      return output({ d, Qs, Cs, Cn, extra, run, cycle, peak, runs, prodDays }, 'Economic production quantity (units)', Qs,
        [m('Daily demand', q(d, 'units/day', 2)), m('Economic production quantity', q(Qs, 'units', 0)), m('Run length / cycle length', `${q(run, '', 2)} / ${q(cycle, 'days', 1)}`), m('Peak stock / runs per year', `${q(peak, 'units', 0)} / ${q(runs, '', 2)}`), m('Production days used per year', q(prodDays, 'days', 1)), m('Yearly cost: optimum / current batch', `${money(Cs)} / ${money(Cn)}`), m('Extra cost of the current batch', q(extra, '%', 1))],
        'Economic production quantity check.', 'Steady demand; finite production rate.', {
          text: ok ? 'BATCH SIZE CLOSE TO OPTIMAL' : 'BATCH SIZE COSTLY', tone: ok ? 'good' : 'bad',
          checks: [check('Current batch size', ok ? 'pass' : 'fail', `${q(extra, '%', 1)} above the lowest cost against ${q(v.tol, '%', 0)} accepted${ok ? '.' : `: move towards ${q(Qs, 'units', 0)}.`}`), check('Capacity', prodDays <= v.wd ? 'pass' : 'fail', `${q(prodDays, 'days', 1)} of production a year out of ${q(v.wd, 'days', 0)}.`)],
        });
    },
    "wip-lead-time-check": (v) => {
      const LT = v.wip / v.thr, LTh = LT * v.hpd, fe = v.va / 60 / LTh * 100, wipLim = v.target * v.thr, cut = Math.max(0, v.wip - wipLim), ok = LT <= v.target + 1e-9;
      return output({ LT, LTh, fe, wipLim, cut }, 'Average lead time (days)', LT,
        [m('Average lead time', q(LT, 'days', 2)), m('Lead time in working hours', q(LTh, 'h', 1)), m('Flow efficiency', q(fe, '%', 2)), m('WIP limit for the target', q(wipLim, 'units', 0)), m('WIP reduction needed', q(cut, 'units', 0))],
        'WIP and lead time check.', 'Little’s law for a stable system.', {
          text: ok ? 'LEAD TIME WITHIN TARGET' : 'LEAD TIME TOO LONG', tone: ok ? 'good' : 'bad',
          checks: [check('Lead time', ok ? 'pass' : 'fail', `${q(LT, 'days', 1)} against ${q(v.target, 'days', 1)}${ok ? '.' : `: cap WIP at ${q(wipLim, 'units', 0)} or raise throughput.`}`), check('Stable system', 'verify', 'Measure WIP and throughput over the same period, with no growing backlog.')],
        });
    },
    "critical-spares-poisson-plan": (v) => {
      const lam = v.Nu * v.hpd * v.lead / v.mtbf, target = v.tgt / 100;
      let p = Math.exp(-lam), cdf = p, s = 0;
      const cdfs = [cdf];
      while (cdf < target - 1e-12 && s < 100000) { s++; p *= lam / s; cdf += p; cdfs.push(cdf); }
      let pc = Math.exp(-lam), cov = pc;
      for (let k = 1; k <= v.held; k++) { pc *= lam / k; cov += pc; if (pc < 1e-18 && k > lam) break; }
      cov = Math.min(1, cov) * 100;
      const ok = v.held >= s;
      return output({ lam, s, cov }, 'Spares needed', s,
        [m('Expected failures in the lead time', q(lam, '', 3)), m('Spares needed for the service level', q(s, 'parts', 0)), m('Cover given by the spares held', q(Math.round(cov * 100) / 100, '%', 2)), m('Failure rate across the installed parts', q(v.Nu * v.hpd * 365 / v.mtbf, 'per year', 2))],
        'Critical spares plan.', 'Poisson failures at a constant rate.', {
          text: ok ? 'SPARES ENOUGH' : 'SPARES SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Spares held', ok ? 'pass' : 'fail', `${q(v.held, '', 0)} held against ${q(s, '', 0)} needed for ${q(v.tgt, '%', 2)} cover.`), check('Failure pattern', 'verify', 'Confirm failures are random rather than wear-out before relying on a constant failure rate.')],
        });
    },
    "capability-confidence-check": (v) => {
      const T = v.USL - v.LSL;
      if (T <= 0) return invalid('The upper specification limit must be above the lower limit.');
      const lg = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (const cj of c) s += cj / ++y; return -t + Math.log(2.5066282746310005 * s / x); };
      const gP = (a, x) => { if (x <= 0) return 0; if (x < a + 1) { let s = 1 / a, d = s, ap = a; for (let k = 0; k < 2000; k++) { ap += 1; d *= x / ap; s += d; if (Math.abs(d) < Math.abs(s) * 1e-16) break; } return s * Math.exp(-x + a * Math.log(x) - lg(a)); } let b = x + 1 - a, c = 1e300, d = 1 / b, h = d; for (let k = 1; k < 2000; k++) { const an = -k * (k - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-16) break; } return 1 - Math.exp(-x + a * Math.log(x) - lg(a)) * h; };
      const Phi = (z) => 0.5 * (1 + Math.sign(z) * gP(0.5, z * z / 2)), zq = (p) => { let lo = -10, hi = 10; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (Phi(mid) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const chiq = (p, nu) => { let lo = 0, hi = nu + 50 * Math.sqrt(2 * nu) + 100; for (let k = 0; k < 300; k++) { const mid = (lo + hi) / 2; if (gP(nu / 2, mid / 2) < p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const c = Number(v.conf), alpha = 1 - c, nu = v.n - 1, Cp = T / (6 * v.s), Cpk = Math.min(v.USL - v.xbar, v.xbar - v.LSL) / (3 * v.s), z = zq(c), chi = chiq(alpha, nu), cpL = Cp * Math.sqrt(chi / nu);
      const bound = (n) => Cpk - z * Math.sqrt(1 / (9 * n) + Cpk * Cpk / (2 * (n - 1))), cpkL = bound(v.n);
      let nNeed = null;
      if (Cpk > v.req) { for (let n = 25; n <= 100000; n++) if (bound(n) >= v.req) { nNeed = n; break; } }
      const proven = cpkL >= v.req - 1e-12, possible = Cpk >= v.req - 1e-12, small = v.n < 25;
      return output({ Cp, Cpk, z, chi, cpL, cpkL, nNeed }, 'Lower confidence bound on Cpk', cpkL,
        [m('Cp / Cpk from the sample', `${q(Cp, '', 3)} / ${q(Cpk, '', 3)}`), m('Lower bound on Cp', q(cpL, '', 3)), m('Lower bound on Cpk', q(cpkL, '', 3)), m('Chi-square quantile / z', `${q(chi, '', 3)} / ${q(z, '', 4)}`), m('Parts needed to prove the requirement at this Cpk', nNeed == null ? (possible ? 'more than 100,000' : 'not possible: sample Cpk is below the requirement') : q(nNeed, 'parts', 0))],
        'Capability confidence check.', 'Stable normal process; NIST approximation for the Cpk bound.', {
          text: proven ? 'CAPABILITY PROVEN' : possible ? 'NOT YET PROVEN: MORE DATA NEEDED' : 'NOT CAPABLE', tone: proven ? 'good' : 'bad',
          checks: [check('Cpk lower bound', proven ? 'pass' : 'fail', `${q(cpkL, '', 3)} against ${q(v.req, '', 2)} at ${q(c * 100, '%', 0)} confidence${proven || !possible ? '.' : nNeed ? `: about ${q(nNeed, 'parts', 0)} would prove it if the Cpk holds.` : '.'}`), check('Sample size', small ? 'warn' : 'pass', small ? 'Fewer than 25 parts: the Cpk bound approximation is not reliable.' : 'Sample size is within the range of the approximation.'), check('Stability and normality', 'verify', 'Check the process is in control and roughly normal before relying on capability indices.')],
        });
    },
    "parting-off-plan": (v) => {
      if (v.di >= v.D) return invalid('The bore must be smaller than the outside diameter.');
      const R = v.D / 2, r0 = v.di / 2, dlim = 1000 * v.Vc / (PI * v.nmax), rl = dlim / 2, n0 = Math.min(v.nmax, 1000 * v.Vc / (PI * v.D)), V0 = PI * v.D * n0 / 1000;
      const F = v.kc * v.w * v.f, Pc = F * V0 / 60000, Pm = Pc / (v.eta / 100), Tq = F * R / 1000, r1 = Math.min(R, Math.max(rl, r0));
      const t1 = PI * (R * R - r1 * r1) / (1000 * v.Vc * v.f), t2 = (r1 - r0) / (v.f * v.nmax), tsec = (t1 + t2) * 60, Vend = PI * v.di * v.nmax / 1000;
      const okP = Pm <= v.Pav + 1e-9, okT = tsec <= v.tMax + 1e-9, ok = okP && okT;
      return output({ n0, V0, dlim, F, Pc, Pm, Tq, t1, t2, tsec, Vend }, 'Parting time (s)', tsec,
        [m('Starting spindle speed / cutting speed', `${q(n0, 'rpm', 0)} / ${q(V0, 'm/min', 1)}`), m('Diameter where the speed limit is reached', q(dlim, 'mm', 2)), m('Cutting force', q(F, 'N', 1)), m('Cutting / motor power at the start', `${q(Pc, '', 3)} / ${q(Pm, 'kW', 3)}`), m('Torque at the start', q(Tq, 'N·m', 2)), m('Parting time', q(tsec, 's', 2)), m('Cutting speed at the end of the cut', q(Vend, 'm/min', 1))],
        'Parting-off plan.', 'Constant specific cutting force; constant feed.', {
          text: ok ? 'PARTING PLAN WORKS' : 'PARTING PLAN NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Spindle power', okP ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pav, 'kW', 1)} available.`), check('Parting time', okT ? 'pass' : 'fail', `${q(tsec, 's', 1)} against ${q(v.tMax, 's', 0)} allowed.`), check('Centre of a solid bar', v.di > 0 ? 'pass' : 'verify', v.di > 0 ? 'Tube: the cutting speed stays above zero.' : 'Cutting speed falls to zero at the centre: reduce feed near the centre and check the insert grade for low speed.')],
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
