// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook68). SI units are explicit at each boundary.
// Methods are standard engineering relations; no handbook tables, ratings or recommended settings are reproduced.
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
    "machine-economic-life": (v) => {
      if (v.MV1 > v.MV0) return invalid('The market value in one year should not be higher than the value now.');
      const i = v.i / 100, money = (x) => `A\u0024${num(Math.round(x), 0)}`, rows = [];
      let nStar = 1, Emin = Infinity, Lstar = 0;
      for (let n = 1; n <= v.Nmax; n++) {
        const f = (1 + i) ** n, AP = i === 0 ? 1 / n : i * f / (f - 1), AF = i === 0 ? 1 / n : i / (f - 1), AG = i === 0 ? (n - 1) / 2 : 1 / i - n / (f - 1);
        const L = v.P * v.s1 / 100 * (1 - v.dS / 100) ** (n - 1), cap = v.P * AP - L * AF, run = v.A1 + v.G * AG, E = cap + run;
        rows.push([String(n), money(L), money(cap), money(run), money(E)]);
        if (E < Emin - 1e-9) { Emin = E; nStar = n; Lstar = L; }
      }
      const MC = v.MV0 - v.MV1 + v.MV0 * i + v.Ad, keep = MC <= Emin + 1e-9, edge = nStar === v.Nmax && v.Nmax > 1;
      return output({ nStar, Emin, Lstar, MC }, 'Lowest equivalent annual cost (AUD/year)', Emin,
        [m('Economic life of the new machine', q(nStar, 'years', 0)), m('Lowest equivalent annual cost', money(Emin)), m('Resale value at the economic life', money(Lstar)), m('Cost of keeping the existing machine one more year', money(MC)), m('Yearly saving from the cheaper choice', money(Math.abs(MC - Emin)))],
        'Machine economic life check.', 'End-of-year cash flows; like-for-like replacement; no tax or inflation.', {
          text: keep ? 'KEEP FOR ANOTHER YEAR' : 'REPLACE NOW', tone: keep ? 'good' : 'warn',
          checks: [check('Existing machine against the new one', keep ? 'pass' : 'fail', `One more year of the existing machine costs ${money(MC)} against ${money(Emin)} a year for the new one${keep ? ': keep it and check again next year.' : ': replacing now is cheaper.'}`), check('Range examined', edge ? 'warn' : 'pass', edge ? 'The lowest cost is at the longest life examined: extend the range.' : `Lowest cost found inside 1 to ${v.Nmax} years.`)],
          table: tbl('Equivalent annual cost by life of the new machine', ['Life (years)', 'Resale value', 'Capital cost per year', 'Running cost per year', 'EUAC'], rows),
        });
    },
    "groove-weld-cost-check": (v) => {
      if (v.c > v.t) return invalid('The root face cannot be larger than the plate thickness.');
      if (v.prep === 'sb' && v.ang >= 80) return invalid('For a single-bevel enter the bevel angle on the prepared plate (less than 80°).');
      const d = v.t - v.c, ta = Math.tan(rad(v.ang / 2)), tb = Math.tan(rad(v.ang)), caps = Number(v.caps);
      const geo = { sv: [v.g * v.t + d * d * ta, v.g + 2 * d * ta], dv: [v.g * v.t + d * d * ta / 2, v.g + d * ta], sb: [v.g * v.t + d * d * tb / 2, v.g + d * tb], sq: [v.g * v.t, v.g] }[v.prep];
      const Ag = geo[0], W = geo[1] + 2 * v.e, Acap = 2 / 3 * W * v.h, At = Ag + caps * Acap;
      if (At <= 0) return invalid('The joint has no weld metal: enter a root gap, a preparation or a cap.');
      const mpm = At * v.rho / 1000, mass = mpm * v.L, filler = mass / (v.eff / 100), arc = mass / v.dep, paid = arc / (v.of / 100), other = v.oth * v.L / 60;
      const labour = (paid + other) * v.rate, fillerCost = filler * v.wire, gas = arc * 60 * v.gasFlow / 1000 * v.gasPrice, total = labour + fillerCost + gas, ok = total <= v.quote + 1e-9, money = (x) => `A\u0024${num(Math.round(x * 100) / 100, 2)}`;
      return output({ Ag, W, Acap, At, mpm, mass, filler, arc, paid, other, labour, fillerCost, gas, total }, 'Welding cost (AUD)', total,
        [m('Groove area / cap width', `${q(Ag, 'mm²', 1)} / ${q(W, 'mm', 1)}`), m('Weld metal area (with caps)', q(At, 'mm²', 1)), m('Weld metal per metre / in total', `${q(mpm, 'kg/m', 3)} / ${q(mass, 'kg', 2)}`), m('Filler to buy', q(filler, 'kg', 2)), m('Arc time / paid time', `${q(arc, 'h', 2)} / ${q(paid + other, 'h', 2)}`), m('Labour / filler / gas', `${money(labour)} / ${money(fillerCost)} / ${money(gas)}`), m('Welding cost', money(total))],
        'Butt weld quantity and cost check.', 'Idealised groove and cap geometry.', {
          text: ok ? 'QUOTE COVERS THE WELDING' : 'QUOTE TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Cost against quote', ok ? 'pass' : 'fail', `${money(total)} against ${money(v.quote)}${ok ? '.' : ': raise the price or change the preparation.'}`), check('Preparation', 'verify', 'Confirm the preparation dimensions against AS/NZS 1554.1 prequalified joints or the qualified welding procedure.')],
        });
    },
    "insert-consumption-reorder-plan": (v) => {
      const Z = { 90: 1.2816, 95: 1.6449, 97.5: 1.96, 99: 2.3263, 99.5: 2.5758 }, z = Z[v.svc];
      const N = 1000 * v.V / (PI * v.D), tc = v.passes * v.Lc / (v.f * N), T = (v.C / v.V) ** (1 / v.n), Tu = T * v.use / 100, ppe = Math.floor(Tu / tc + 1e-9);
      if (ppe < 1) return invalid(`At this speed an edge lasts ${q(Tu, 'min', 2)}, less than the ${q(tc, 'min', 2)} cutting time of one part: lower the speed or check the Taylor constants.`);
      const im = v.parts / (ppe * v.edges), dd = im / v.days, sd = v.cv / 100 * dd, SS = z * sd * Math.sqrt(v.lead), ROP = dd * v.lead + SS, cpp = v.price / (v.edges * ppe), monthly = im * v.price, cover = v.onHand / dd, ok = v.onHand > ROP + 1e-9;
      return output({ N, tc, T, Tu, ppe, im, dd, SS, ROP, cpp, monthly, cover }, 'Reorder point (inserts)', ROP,
        [m('Spindle speed / cutting time per part', `${q(N, 'rpm', 0)} / ${q(tc, 'min', 3)}`), m('Taylor life / life used', `${q(T, 'min', 2)} / ${q(Tu, 'min', 2)}`), m('Parts per edge', q(ppe, '', 0)), m('Inserts per month / per day', `${q(im, '', 1)} / ${q(dd, '', 2)}`), m('Insert cost per part / per month', `A\u0024${num(Math.round(cpp * 1000) / 1000, 3)} / A0024${num(Math.round(monthly), 0)}`), m('Safety stock / reorder point', `${q(SS, '', 1)} / ${q(ROP, 'inserts', 1)}`), m('Days of cover on hand', q(cover, 'days', 1))],
        'Cutting insert consumption and reorder plan.', 'Taylor life; steady demand; fixed lead time.', {
          text: ok ? 'STOCK ABOVE REORDER POINT' : 'ORDER NOW', tone: ok ? 'good' : 'bad',
          checks: [check('Stock on hand', ok ? 'pass' : 'fail', `${q(v.onHand, 'inserts', 0)} against a reorder point of ${q(ROP, '', 1)}${ok ? '.' : ': place an order now.'}`), check('Parts per edge', 'verify', 'Count parts per edge on the machine for a few weeks and correct the Taylor constants or the share of life used.')],
        });
    },
    "bearing-fleet-spares-plan": (v) => {
      if (v.P > v.C) return invalid('The equivalent load exceeds the dynamic rating: the rating-life model does not apply.');
      const p = v.type === 'ball' ? 3 : 10 / 3, L10h = (v.C / v.P) ** p * 1e6 / (60 * v.rpm), eta = L10h / Math.log(1 / 0.9) ** (1 / v.eS), t = v.hpy * v.yrs, F = 1 - Math.exp(-((t / eta) ** v.eS)), expF = v.Nb * F;
      const cdf = []; let acc = 0, lc = 0;
      for (let k = 0; k <= v.Nb; k++) {
        if (k > 0) lc += Math.log(v.Nb - k + 1) - Math.log(k);
        const pk = F <= 0 ? (k === 0 ? 1 : 0) : F >= 1 ? (k === v.Nb ? 1 : 0) : Math.exp(lc + k * Math.log(F) + (v.Nb - k) * Math.log(1 - F));
        acc += pk; cdf.push(Math.min(1, acc));
      }
      const target = v.tgt / 100, si = cdf.findIndex((c) => c >= target - 1e-12), s = si < 0 ? v.Nb : si, cover = cdf[Math.min(v.held, v.Nb)] * 100, ok = v.held >= s;
      return output({ L10h, eta, t, F, expF, s, cover }, 'Spares needed (bearings)', s,
        [m('Basic rating life L₁₀', q(L10h, 'h', 0)), m('Weibull characteristic life', q(eta, 'h', 0)), m('Running hours in the period', q(t, 'h', 0)), m('Chance one bearing fails in the period', q(F * 100, '%', 2)), m('Expected failures in the group', q(expF, '', 2)), m('Spares needed for the service level', q(s, 'bearings', 0)), m('Chance the spares held cover all failures', q(Math.round(cover * 100) / 100, '%', 2))],
        'Bearing fleet spares plan.', 'Rating-life model; all bearings new at the start; independent failures.', {
          text: ok ? 'SPARES ENOUGH' : 'SPARES SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Spares held', ok ? 'pass' : 'fail', `${q(v.held, '', 0)} held against ${q(s, '', 0)} needed for ${q(v.tgt, '%', 2)} cover${ok ? '.' : ': order more spares.'}`), check('Chance of failure per bearing', F > 0.3 ? 'warn' : 'pass', F > 0.3 ? 'More than 30 % of the bearings fail in the period: replaced bearings may fail again, so the spares needed are underestimated; consider planned replacement.' : 'Renewals within the period are negligible.')],
        });
    },
    "hydraulic-press-cycle-check": (v) => {
      if (v.rod >= v.bore) return invalid('The rod must be smaller than the bore.');
      const Ab = PI * v.bore ** 2 / 4, Ar = PI * v.rod ** 2 / 4, Aa = Ab - Ar, qs = v.Q * 1e6 / 60, regen = v.circuit === 'regen', Aapp = regen ? Ar : Ab;
      const vA = qs / Aapp, vP = qs / Ab, vR = qs / Aa, tA = v.sA / vA, tP = v.sP / vP, tR = (v.sA + v.sP) / vR, cyc = tA + tP + tR + v.dwell;
      const F = v.p * Ab / 10 / 1000, pApp = Math.max(0, v.Fapp * 1000 / Aapp * 10), pNeed = v.Freq * 1000 / Ab * 10, Psh = Math.min(pNeed, v.p) * v.Q / 600 / (v.eta / 100), Prel = v.p * v.Q / 600 / (v.eta / 100);
      const okF = F >= v.Freq - 1e-9, okA = pApp <= v.p + 1e-9, okT = cyc <= v.tMax + 1e-9, okP = Psh <= v.Pmot + 1e-9, ok = okF && okA && okT && okP;
      return output({ Ab, Ar, Aa, vA, vP, vR, tA, tP, tR, cyc, F, pApp, pNeed, Psh, Prel }, 'Cycle time (s)', cyc,
        [m('Approach speed / pressure needed', `${q(vA, 'mm/s', 1)} / ${q(pApp, 'bar', 1)}`), m('Pressing speed', q(vP, 'mm/s', 1)), m('Return speed', q(vR, 'mm/s', 1)), m('Pressing force at relief / pressure for the force needed', `${q(F, 'kN', 1)} / ${q(pNeed, 'bar', 1)}`), m('Stroke times: approach / press / return', `${q(tA, '', 2)} / ${q(tP, '', 2)} / ${q(tR, 's', 2)}`), m('Cycle time', q(cyc, 's', 2)), m('Motor power: pressing load / relief', `${q(Psh, '', 2)} / ${q(Prel, 'kW', 2)}`)],
        'Hydraulic press cycle check.', 'Ideal flow; no leakage or valve losses.', {
          text: ok ? 'PRESS CYCLE ADEQUATE' : 'PRESS CYCLE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Pressing force', okF ? 'pass' : 'fail', `${q(F, 'kN', 1)} at relief against ${q(v.Freq, 'kN', 1)} needed.`), check('Approach pressure', okA ? 'pass' : 'fail', `${q(pApp, 'bar', 1)} against ${q(v.p, 'bar', 0)}${okA ? '.' : ': use a standard approach or reduce the resistance.'}`), check('Cycle time', okT ? 'pass' : 'fail', `${q(cyc, 's', 2)} against ${q(v.tMax, 's', 2)}.`), check('Motor power', okP ? 'pass' : 'fail', `${q(Psh, 'kW', 2)} at the pressing load against ${q(v.Pmot, 'kW', 1)} installed.`), check('Stall at relief', Prel > v.Pmot + 1e-9 ? 'warn' : 'pass', Prel > v.Pmot + 1e-9 ? `Holding full flow over relief takes ${q(Prel, 'kW', 2)}: use a pressure-compensated pump, unloading or a pressure switch.` : 'The motor carries full flow at the relief setting.')],
        });
    },
    "vacuum-table-workholding-check": (v) => {
      const A = v.Lp * v.Wp, Fh = v.vac * A / 1000 * v.effA / 100, R = v.mu * (Fh + v.mass * 9.80665), Pc = v.ae * v.ap * v.vf * v.kc / 60e6, vc = PI * v.D * v.rpm / 1000;
      if (v.ae > v.D) return invalid('The width of cut cannot exceed the cutter diameter.');
      const Fc = Pc * 1000 / (vc / 60), pk = Fc * v.dyn, sf = R / pk, vfMax = v.vf * sf / v.SF, ok = sf >= v.SF - 1e-9;
      return output({ A, Fh, R, Pc, vc, Fc, pk, sf, vfMax }, 'Safety factor against sliding', sf,
        [m('Sealed area', q(A / 1e6, 'm²', 4)), m('Vacuum holding force', q(Fh, 'N', 0)), m('Friction resistance', q(R, 'N', 0)), m('Cutting power / cutting speed', `${q(Pc, 'kW', 3)} / ${q(vc, 'm/min', 1)}`), m('Mean / peak cutting force', `${q(Fc, '', 1)} / ${q(pk, 'N', 1)}`), m('Safety factor against sliding', q(sf, '', 2)), m('Largest feed for the required factor', q(vfMax, 'mm/min', 0))],
        'Vacuum table workholding check.', 'Friction holding; mean force from cutting power.', {
          text: ok ? 'PART HELD' : 'PART MAY SLIDE', tone: ok ? 'good' : 'bad',
          checks: [check('Sliding', ok ? 'pass' : 'fail', `Safety factor ${q(sf, '', 2)} against ${q(v.SF, '', 2)}${ok ? '.' : `: feed at or below ${q(vfMax, 'mm/min', 0)}, add stops or clamps, or improve the seal.`}`), check('Lift-off and seal', 'verify', 'Check lifting from helical cutters and loss of vacuum as parts are cut free; leave tabs or use a spoilboard.')],
        });
    },
    "gauge-repeatability-bias-check": (v) => {
      const T = v.USL - v.LSL;
      if (T <= 0) return invalid('The upper specification limit must be above the lower limit.');
      const lgamma = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp); let ser = 1.000000000190015; for (const cj of c) ser += cj / ++y; return -tmp + Math.log(2.5066282746310005 * ser / x); };
      const betacf = (a, b, x) => { let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d; for (let mm = 1; mm <= 300; mm++) { const m2 = 2 * mm; let aa = mm * (b - mm) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c; aa = -(a + mm) * (qab + mm) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break; } return h; };
      const ibeta = (a, b, x) => { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; };
      const bias = v.xbar - v.xref, Cg = v.K / 100 * T / (v.Lm * v.s), Cgk = (v.K / 200 * T - Math.abs(bias)) / (v.Lm / 2 * v.s), varRep = 100 * v.Lm * v.s / T, varRB = Cgk > 0 ? v.K / Cgk : 0;
      const df = v.n - 1, t = bias / (v.s / Math.sqrt(v.n)), p = ibeta(df / 2, 0.5, df / (df + t * t)), alpha = Number(v.alpha), sig = p < alpha, resPct = v.res / T * 100;
      const okG = Cg >= v.cmin - 1e-9, okK = Cgk >= v.cmin - 1e-9, okR = resPct <= v.resMax + 1e-9, inTol = v.xref >= v.LSL && v.xref <= v.USL, ok = okG && okK && okR;
      return output({ T, bias, Cg, Cgk, varRep, varRB, t, df, p, resPct }, 'Cgk', Cgk,
        [m('Tolerance', q(T, '', 6)), m('Bias (mean − reference)', q(bias, '', 6)), m('Cg / Cgk', `${q(Cg, '', 3)} / ${q(Cgk, '', 3)}`), m('Share of tolerance: repeatability / with bias', Cgk > 0 ? `${q(varRep, '', 1)} / ${q(varRB, '%', 1)}` : `${q(varRep, '%', 1)} / bias exceeds the allowance`), m('Bias t statistic / p-value', `${q(t, '', 3)} / ${q(p, '', 4)}`), m('Resolution as a share of tolerance', q(resPct, '%', 2))],
        'Gauge repeatability and bias check.', 'Type 1 study: one master, one operator, normal readings.', {
          text: ok ? 'GAUGE CAPABLE' : 'GAUGE NOT CAPABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Repeatability (Cg)', okG ? 'pass' : 'fail', `${q(Cg, '', 3)} against ${q(v.cmin, '', 2)}.`), check('Repeatability with bias (Cgk)', okK ? 'pass' : 'fail', `${q(Cgk, '', 3)} against ${q(v.cmin, '', 2)}.`), check('Resolution', okR ? 'pass' : 'fail', `${q(resPct, '%', 2)} of the tolerance against ${q(v.resMax, '%', 2)}.`), check('Bias significance', sig ? 'warn' : 'pass', sig ? `p = ${q(p, '', 4)} < ${v.alpha}: the bias is real; correct it or allow for it.` : `p = ${q(p, '', 4)} ≥ ${v.alpha}: no significant bias.`), check('Master value', inTol ? 'pass' : 'warn', inTol ? 'The master lies inside the tolerance.' : 'The master lies outside the tolerance: use a master near the middle of the tolerance.')],
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
