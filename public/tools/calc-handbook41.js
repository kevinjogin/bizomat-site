// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook41). SI units are explicit at each boundary.
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
    "casting-pour-plan": (v) => {
      const D = v.Dr / 10, Hh = v.Hr / 10, Vr = PI * D * D * Hh / 4, Ar = PI * D * Hh + PI * D * D / 4, Mc = v.Vc / v.Ac, Mr = Vr / Ar, tc = v.B * Mc * Mc, tr = v.B * Mr * Mr, ratio = Mr / Mc;
      const mc = v.Vc * v.rho / 1000, mr = Vr * v.rho / 1000, mg = mc * v.gatePct / 100, W = mc + mr + mg, yieldPct = mc / W * 100, feedNeed = v.Vc * v.shrinkV / v.effR;
      const vel = Math.sqrt(2 * 9.80665 * v.h / 1000), A = W / (v.rho * 1000 * v.t * v.Cd * vel) * 1e6, dia = Math.sqrt(4 * A / PI), pattern = v.part * (1 + v.shrink / 100);
      const okM = ratio >= v.ratioReq, okF = Vr >= feedNeed, okL = W <= v.ladle, ok = okM && okF && okL;
      return output({ Mc, Mr, tc, tr, ratio, Vr, feedNeed, mc, mr, W, yieldPct, vel, A, dia, pattern }, 'Metal poured (kg)', W,
        [m('Casting / riser modulus', `${q(Mc, '', 3)} / ${q(Mr, 'cm', 3)}`), m('Solidification time casting / riser', `${q(tc, '', 2)} / ${q(tr, 'min', 2)}`), m('Riser volume / feed volume needed', `${q(Vr, '', 0)} / ${q(feedNeed, 'cm³', 0)}`), m('Casting / riser mass', `${q(mc, '', 2)} / ${q(mr, 'kg', 2)}`), m('Metal poured', q(W, 'kg', 2)), m('Casting yield', q(yieldPct, '%', 1)), m('Choke area / sprue diameter', `${q(A, 'mm²', 0)} / ${q(dia, 'mm', 1)}`), m('Pattern dimension', q(pattern, 'mm', 2))],
        'Casting pour plan.', 'Chvorinov rule; cylindrical riser.', {
          text: ok ? 'POUR PLAN ADEQUATE' : 'REVISE THE PLAN', tone: ok ? 'good' : 'bad',
          checks: [check('Riser modulus', okM ? 'pass' : 'fail', `Ratio ${q(ratio, '', 2)} against ${q(v.ratioReq, '', 2)}.`), check('Feed volume', okF ? 'pass' : 'fail', `Riser ${q(Vr, 'cm³', 0)} against ${q(feedNeed, 'cm³', 0)} needed.`), check('Ladle', okL ? 'pass' : 'fail', `${q(W, 'kg', 1)} against ${q(v.ladle, 'kg', 0)}.`)],
        });
    },
    "coating-job-estimate": (v) => {
      const liquid = v.type === 'liquid', theo = liquid ? 10 * v.vs / v.dft : 1000 / (v.density * v.dft), prac = theo * v.te / 100, qty = v.area / prac, qtyTot = qty * v.coats, thinL = liquid ? qtyTot * v.thin / 100 : 0;
      const wft = liquid ? v.dft * 100 / v.vs * (1 + v.thin / 100) : v.dft, labH = v.coats * v.area / v.rateA, mat = qtyTot * v.price + thinL * v.pThin, lab = labH * v.labour, total = mat + lab, perM2 = total / v.area, okW = !liquid || wft <= v.wftMax;
      return output({ theo, prac, qty, cost: qty * v.price, qtyTot, thinL, wft, labH, mat, lab, total, perM2 }, 'Total cost ($)', total,
        [m('Practical coverage', q(prac, liquid ? 'm²/L' : 'm²/kg', 2)), m('Quantity per coat / total', `${q(qty, '', 2)} / ${q(qtyTot, liquid ? 'L' : 'kg', 2)}`), ...(liquid ? [m('Thinner', q(thinL, 'L', 2)), m('Wet film per coat', q(wft, 'µm', 0))] : []), m('Labour', q(labH, 'h', 1)), m('Material cost', money(mat)), m('Labour cost', money(lab)), m('Total / per m²', `${money(total)} / ${money(perM2)}`)],
        'Coating job estimate.', 'Flat-surface coverage.', {
          text: okW ? 'ESTIMATE READY' : 'WET FILM TOO THICK', tone: okW ? 'good' : 'bad',
          checks: [check('Wet film', okW ? 'pass' : 'fail', liquid ? `${q(wft, 'µm', 0)} wet against ${q(v.wftMax, 'µm', 0)}: ${okW ? 'within the sag limit' : 'apply in more, thinner coats'}.` : 'Powder: film set by the gun and cure.'), check('Transfer efficiency', 'verify', 'Calibrate transfer efficiency from actual consumption.')],
        });
    },
    "valve-closure-surge": (v) => {
      if (v.rating <= v.p) return invalid('The rating must exceed the working pressure.');
      const K = v.K * 1e9, E = v.E * 1e9, a = Math.sqrt((K / v.rho) / (1 + K * v.D / (E * v.t))), tcrit = 2 * v.L / a, dpJ = v.rho * a * v.dv, dpPa = v.tc <= tcrit ? dpJ : dpJ * tcrit / v.tc, dp = dpPa / 1e5, ptot = v.p + dp;
      const allow = v.rating - v.p, tNeed = dpJ / 1e5 <= allow ? 0 : tcrit * (dpJ / 1e5) / allow, ok = ptot <= v.rating;
      return output({ a, tcrit, dpJ: dpJ / 1e5, dp, ptot, tNeed }, 'Total pressure with surge (bar)', ptot,
        [m('Wave speed', q(a, 'm/s', 0)), m('Critical closure time', q(tcrit, 's', 3)), m('Joukowsky surge', q(dpJ / 1e5, 'bar', 2)), m('Surge for this closing time', q(dp, 'bar', 2)), m('Working + surge', q(ptot, 'bar', 2)), m('Closing time needed for the rating', tNeed > 0 ? q(tNeed, 's', 2) : 'Any: even instant closure is within the rating')],
        v.tc <= tcrit ? 'Fast closure: full Joukowsky surge.' : 'Slow closure reduces the surge.', 'Rigid-column estimate.', {
          text: ok ? 'SURGE WITHIN RATING' : 'SURGE EXCEEDS RATING', tone: ok ? 'good' : 'bad',
          checks: [check('Rating', ok ? 'pass' : 'fail', `${q(ptot, 'bar', 1)} against ${q(v.rating, 'bar', 0)}.`), check('Closing time', v.tc >= tNeed ? 'pass' : 'fail', tNeed > 0 ? `Close in at least ${q(tNeed, 's', 2)}.` : 'No minimum needed.'), check('Analysis', 'verify', 'Use a transient analysis for long, high-energy or branched systems.')],
        });
    },
    "control-valve-sizing": (v) => {
      if (v.openMax <= v.openMin) return invalid('The largest opening must exceed the smallest.');
      const Kv = v.Q * Math.sqrt(v.sg / v.dpv), ratio = Kv / v.Kvs, auth = v.dpv / (v.dpv + v.dps), dpt = v.dpv + v.dps, Qopen = Math.sqrt(dpt / (v.sg / (v.Kvs * v.Kvs) + v.dps / (v.Q * v.Q))), dpOpen = v.sg * (Qopen / v.Kvs) ** 2;
      const okO = ratio <= v.openMax && ratio >= v.openMin, okA = auth >= v.authMin - 1e-12, ok = okO && okA;
      return output({ Kv, Cv: 1.156 * Kv, ratio, auth, Qopen, dpOpen }, 'Kv needed (m³/h)', Kv,
        [m('Kv / Cv needed', `${q(Kv, 'm³/h', 2)} / ${q(1.156 * Kv, 'US gpm', 2)}`), m('Opening ratio at design', q(ratio * 100, '%', 0)), m('Valve authority', q(auth, '', 2)), m('Flow with the valve fully open', q(Qopen, 'm³/h', 2)), m('Valve drop fully open', q(dpOpen, 'bar', 3))],
        'Control valve sizing.', 'Liquid; constant circuit differential.', {
          text: ok ? 'VALVE SUITABLE' : 'VALVE NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Opening at design', okO ? 'pass' : 'fail', `${q(ratio * 100, '%', 0)} of Kvs against ${q(v.openMin * 100, '', 0)}–${q(v.openMax * 100, '%', 0)}: ${ratio > v.openMax ? 'valve too small' : ratio < v.openMin ? 'valve oversized' : 'good range'}.`), check('Authority', okA ? 'pass' : 'fail', `${q(auth, '', 2)} against ${q(v.authMin, '', 2)}.`), check('Cavitation', 'verify', 'Check for cavitation where the valve drop is large relative to the inlet pressure.')],
        });
    },
    "vacuum-gripper-sizing": (v) => {
      const per = v.vac * PI * v.D * v.D / 4 / 1000, Fh = per * v.n, base = v.mass * (9.80665 + v.accel), req = (v.orient === 'horizontal' ? base : base / v.mu) * v.sf;
      const Dreq = Math.sqrt(4 * req * 1000 / (PI * v.vac * v.n)), nReq = Math.ceil(req / per - 1e-9), patm = 101.325, tEv = v.Vsys / v.Qp * 60 * Math.log(patm / (patm - v.vac));
      const okH = Fh >= req, okT = tEv <= v.tMax, ok = okH && okT;
      return output({ per, Fh, req, Dreq, nReq, tEv }, 'Holding margin', Fh / req,
        [m('Force per cup / total', `${q(per, '', 1)} / ${q(Fh, 'N', 0)}`), m('Force needed', q(req, 'N', 0)), m('Holding margin', q(Fh / req, '', 2)), m('Cup diameter needed (same count)', q(Dreq, 'mm', 1)), m('Cups needed (same diameter)', q(nReq, '', 0)), m('Evacuation time', q(tEv, 's', 2))],
        'Vacuum gripper sizing.', 'Flat sealed surfaces; ideal pump-down.', {
          text: ok ? 'GRIPPER ADEQUATE' : 'GRIPPER NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Holding', okH ? 'pass' : 'fail', `${q(Fh, 'N', 0)} against ${q(req, 'N', 0)}.`), check('Evacuation time', okT ? 'pass' : 'fail', `${q(tEv, 's', 2)} against ${q(v.tMax, 's', 1)}.`), check('Leakage', 'verify', 'Allow extra flow for porous parts and cup edge leakage.')],
        });
    },
    "wind-load-on-post": (v) => {
      if (2 * v.t >= v.OD) return invalid('The wall is too thick for the diameter.');
      const qd = v.rho * v.V * v.V / 2, p = v.Cd * qd, F = p * v.A, M = F * v.h, di = v.OD - 2 * v.t, I = PI * (v.OD ** 4 - di ** 4) / 64, Z = I / (v.OD / 2), sigma = M * 1000 / Z, hmm = v.h * 1000, defl = F * hmm ** 3 / (3 * v.E * 1000 * I), dMax = hmm / v.dRatio;
      const okS = sigma <= v.allow, okD = defl <= dMax, ok = okS && okD;
      return output({ q: qd, p, F, M, I, Z, sigma, defl, dMax }, 'Base bending stress (MPa)', sigma,
        [m('Dynamic / surface pressure', `${q(qd, '', 0)} / ${q(p, 'Pa', 0)}`), m('Wind force', q(F, 'N', 0)), m('Base moment', q(M, 'N·m', 0)), m('Post section modulus', q(Z / 1000, 'cm³', 1)), m('Base bending stress', q(sigma, 'MPa', 1)), m('Deflection at the panel', `${q(defl, 'mm', 1)} (limit ${q(dMax, 'mm', 0)})`)],
        'Wind load on a post.', 'Single cantilever post; static wind.', {
          text: ok ? 'POST ADEQUATE' : 'POST NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Stress', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Deflection', okD ? 'pass' : 'fail', `${q(defl, 'mm', 1)} against ${q(dMax, 'mm', 0)}.`), check('Base', 'verify', `Design the base plate, anchors and footing for ${q(M, 'N·m', 0)}.`)],
        });
    },
    "noise-exposure-check": (v) => {
      const p = (L) => 10 ** (L / 10), srcs = [v.L1, v.L2, v.L3, v.L4].filter((L) => L > 0);
      if (!srcs.length) return invalid('Enter at least one source level.');
      const Ls = 10 * Math.log10(srcs.reduce((s, L) => s + p(L), 0)), Ld = Ls - 20 * Math.log10(v.r2 / v.r1), Lop = 10 * Math.log10(p(Ld) + (v.LB > 0 ? p(v.LB) : 0));
      const tPerm = v.Tc / 2 ** ((Lop - v.Lc) / v.ER), dose = v.hours / tPerm * 100, Leq = v.Lc + v.ER * Math.log2(dose / 100), ok = dose <= 100;
      return output({ Ls, Ld, Lop, tPerm, dose, Leq }, 'Daily noise dose (%)', dose,
        [m('Combined level at the reference distance', q(Ls, 'dB', 1)), m('Machines at the operator', q(Ld, 'dB', 1)), m('Level at the operator incl. background', q(Lop, 'dB', 1)), m('Permitted time at that level', q(tPerm, 'h', 2)), m('Daily dose', q(dose, '%', 0)), m('Equivalent level for the criterion time', q(Leq, 'dB', 1))],
        'Noise exposure check.', 'Point sources in open space.', {
          text: ok ? 'EXPOSURE WITHIN LIMIT' : 'EXPOSURE OVER LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Dose', ok ? 'pass' : 'fail', ok ? `${q(dose, '%', 0)} of the daily limit.` : `${q(dose, '%', 0)} of the limit: reduce exposure time, move further away, enclose the source or use hearing protection.`), check('Measurement', 'verify', 'Confirm with a dosimeter at the operator’s ear.')],
        });
    },
    "process-capability-check": (v) => {
      if (v.usl <= v.lsl) return invalid('The upper limit must be above the lower limit.');
      const C = { 2: [1.88, 0, 3.267, 1.128], 3: [1.023, 0, 2.574, 1.693], 4: [0.729, 0, 2.282, 2.059], 5: [0.577, 0, 2.114, 2.326], 6: [0.483, 0, 2.004, 2.534], 7: [0.419, 0.076, 1.924, 2.704], 8: [0.373, 0.136, 1.864, 2.847], 9: [0.337, 0.184, 1.816, 2.97], 10: [0.308, 0.223, 1.777, 3.078] }[v.n];
      const sigma = v.rbar / C[3], ucl = v.xbar + C[0] * v.rbar, lcl = v.xbar - C[0] * v.rbar, rucl = C[2] * v.rbar, rlcl = C[1] * v.rbar, Cp = (v.usl - v.lsl) / (6 * sigma), Cpk = Math.min(v.usl - v.xbar, v.xbar - v.lsl) / (3 * sigma);
      const erfc = (x) => { const z = Math.abs(x), t = 1 / (1 + 0.5 * z), r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; };
      const Phi = (x) => 0.5 * erfc(-x / Math.SQRT2), below = Phi(-(v.xbar - v.lsl) / sigma), above = Phi(-(v.usl - v.xbar) / sigma), ppm = (below + above) * 1e6, ok = Cpk >= v.cpkMin;
      return output({ sigma, ucl, lcl, rucl, rlcl, Cp, Cpk, below, above, ppm }, 'Cpk', Cpk,
        [m('Process σ', q(sigma, '', 6)), m('X̄ limits', `${q(lcl, '', 5)} – ${q(ucl, '', 5)}`), m('R limits', `${q(rlcl, '', 5)} – ${q(rucl, '', 5)}`), m('Cp / Cpk', `${q(Cp, '', 3)} / ${q(Cpk, '', 3)}`), m('Predicted out of tolerance', q(ppm, 'ppm', 0))],
        'Process capability check.', 'Stable, normal process.', {
          text: ok ? 'PROCESS CAPABLE' : 'PROCESS NOT CAPABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Cpk', ok ? 'pass' : 'fail', `${q(Cpk, '', 2)} against ${q(v.cpkMin, '', 2)}.`), check('Centring', Cp - Cpk <= 0.2 ? 'pass' : 'warn', Cp - Cpk <= 0.2 ? 'Process well centred.' : 'Off-centre: centring the process would raise Cpk toward Cp.'), check('Stability', 'verify', 'Confirm the chart shows no out-of-control signals before quoting capability.')],
        });
    },
    "corrosion-remaining-life": (v) => {
      const rate = v.mode === 'coupon' ? 87.6 * v.W / (v.rhoM * v.Ac * v.hrs) : (v.t1 - v.tNow) / v.years;
      if (v.mode === 'thick' && v.t1 < v.tNow) return invalid('The earlier reading must not be thinner than the present one.');
      const tP = v.p / 10 * v.D / (2 * v.S * v.Ej), tMin = Math.max(tP, v.tStruct), margin = v.tNow - tMin, life = rate > 0 ? margin / rate : Infinity, next = Math.min(v.share / 100 * life, v.maxInt);
      const okT = margin >= 0, okL = life >= v.lifeReq, ok = okT && okL;
      return output({ rate, tP, tMin, margin, life: Number.isFinite(life) ? life : 0, next: Number.isFinite(next) ? next : v.maxInt }, 'Remaining life (years)', Number.isFinite(life) ? life : 0,
        [m('Corrosion rate', `${q(rate, 'mm/y', 4)} (${q(rate * 39.37, 'mpy', 2)})`), m('Pressure thickness (Barlow)', q(tP, 'mm', 3)), m('Minimum required thickness', q(tMin, 'mm', 2)), m('Thickness above the minimum', q(margin, 'mm', 2)), m('Remaining life', Number.isFinite(life) ? q(life, 'years', 1) : 'No measurable corrosion'), m('Next inspection within', q(Number.isFinite(next) ? next : v.maxInt, 'years', 1))],
        'Corrosion remaining life.', 'Uniform corrosion at a constant rate.', {
          text: !okT ? 'BELOW MINIMUM THICKNESS' : okL ? 'LIFE ADEQUATE' : 'LIFE SHORTER THAN REQUIRED', tone: ok ? 'good' : 'bad',
          checks: [check('Thickness', okT ? 'pass' : 'fail', okT ? `${q(margin, 'mm', 2)} above the minimum.` : 'Already below the minimum required thickness: assess fitness for service now.'), check('Life', okL ? 'pass' : 'fail', `${Number.isFinite(life) ? q(life, 'years', 1) : 'Unlimited'} against ${q(v.lifeReq, 'years', 0)} required.`), check('Localised corrosion', 'verify', 'Check for pitting, erosion and corrosion under insulation.')],
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
