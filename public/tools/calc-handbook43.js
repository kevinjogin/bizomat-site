// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook43). SI units are explicit at each boundary.
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
    "investment-appraisal": (v) => {
      const i = v.rate / 100, A = v.S - v.C, pa = (r) => (r === 0 ? v.n : (1 - (1 + r) ** -v.n) / r), pf = (r) => (1 + r) ** -v.n, npvAt = (r) => -v.P + A * pa(r) + v.salv * pf(r), npv = npvAt(i);
      let irr = null, lo = -0.99, hi = 10; if (npvAt(lo) * npvAt(hi) < 0) { for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (npvAt(lo) * npvAt(mid) <= 0) hi = mid; else lo = mid; } irr = (lo + hi) / 2 * 100; }
      const pay = A > 0 ? v.P / A : Infinity; let cum = -v.P, dpay = null; for (let t = 1; t <= v.n; t++) { const prev = cum; cum += (A + (t === v.n ? v.salv : 0)) / (1 + i) ** t; if (cum >= 0 && dpay === null) dpay = t - 1 + (-prev) / (cum - prev); }
      const PVB = v.S * pa(i), PVC = v.P + v.C * pa(i) - v.salv * pf(i), bc = PVC > 0 ? PVB / PVC : Infinity, ap = i === 0 ? 1 / v.n : i * (1 + i) ** v.n / ((1 + i) ** v.n - 1), euac = (v.P - v.salv) * ap + v.salv * i + v.C;
      const okN = npv >= 0, okP = pay <= v.payMax, ok = okN && okP;
      return output({ A, npv, irr: irr ?? -100, pay: Number.isFinite(pay) ? pay : 0, dpay: dpay ?? 0, PVB, PVC, bc, ap, euac }, 'Net present value ($)', npv,
        [m('Net yearly flow', money(A)), m('Net present value', money(npv)), m('Internal rate of return', irr === null ? 'No rate gives zero NPV' : q(irr, '%', 2)), m('Simple payback', Number.isFinite(pay) ? q(pay, 'years', 2) : 'Never'), m('Discounted payback', dpay === null ? 'Not within the life' : q(dpay, 'years', 2)), m('Benefit–cost ratio', q(bc, '', 3)), m('Equivalent annual cost of ownership', money(euac))],
        'Investment appraisal.', 'Before tax; uniform flows.', {
          text: ok ? 'INVESTMENT JUSTIFIED' : 'INVESTMENT NOT JUSTIFIED', tone: ok ? 'good' : 'bad',
          checks: [check('NPV at the hurdle rate', okN ? 'pass' : 'fail', `${money(npv)} at ${q(v.rate, '%', 1)}.`), check('Payback', okP ? 'pass' : 'fail', `${Number.isFinite(pay) ? q(pay, 'years', 2) : 'Never'} against ${q(v.payMax, 'years', 1)}.`), check('Sensitivity', 'verify', 'Try lower savings and a shorter life to see how robust the case is.')],
        });
    },
    "air-leak-audit": (v) => {
      const k = 1.4, R = 287.05, p0 = (v.p + ATM) * 1e5, T0 = v.Tair + 273.15, per = (d) => { const A = PI * (d / 1000) ** 2 / 4; return v.Cd * A * p0 * Math.sqrt(k / (R * T0)) * Math.pow(2 / (k + 1), (k + 1) / (2 * (k - 1))) / 1.204 * 1000; };
      const groups = [[v.n1, v.d1], [v.n2, v.d2], [v.n3, v.d3]].filter(([n]) => n > 0);
      if (!groups.length) return invalid('Enter at least one leak.');
      const flows = groups.map(([n, d]) => n * per(d)), Ls = flows.reduce((s, x) => s + x, 0), m3min = Ls * 60 / 1000, pct = m3min / v.Qc * 100, kW = m3min * v.spec, kWh = kW * v.hours, cost = kWh * v.price, nLeaks = groups.reduce((s, [n]) => s + n, 0), repairCost = nLeaks * v.repair, payDays = cost > 0 ? repairCost / cost * 365 : Infinity, ok = pct <= v.maxPct;
      return output({ per1: per(v.d1), Ls, m3min, pct, kW, kWh, cost, repairCost, payDays }, 'Leak cost per year ($)', cost,
        [...groups.map(([n, d], j) => m(`${n} leaks of ${q(d, 'mm', 1)}`, q(flows[j], 'L/s', 2))), m('Total leak flow', `${q(Ls, 'L/s', 1)} (${q(m3min, 'm³/min', 2)})`), m('Share of compressor capacity', q(pct, '%', 1)), m('Compressor power wasted', q(kW, 'kW', 2)), m('Cost per year', money(cost)), m('Repair cost', money(repairCost)), m('Repair payback', Number.isFinite(payDays) ? q(payDays, 'days', 0) : 'No saving')],
        'Compressed-air leak audit.', 'Choked flow through sharp holes.', {
          text: ok ? 'LEAKAGE ACCEPTABLE' : 'LEAKAGE TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Leakage share', ok ? 'pass' : 'fail', `${q(pct, '%', 1)} of capacity against ${q(v.maxPct, '%', 0)}.`), check('Measurement', 'verify', 'Confirm total leakage with a no-load (drawdown) test.')],
        });
    },
    "two-point-lift-plan": (v) => {
      const items = [[v.m1, v.x1], [v.m2, v.x2], [v.m3, v.x3]].filter(([mm]) => mm > 0), M = items.reduce((s, [mm]) => s + mm, 0);
      if (!M) return invalid('Enter at least one item.');
      if (v.xB <= v.xA) return invalid('Lifting point B must be beyond lifting point A.');
      const X = items.reduce((s, [mm, x]) => s + mm * x, 0) / M;
      if (X < v.xA || X > v.xB) return invalid('The centre of gravity lies outside the lifting points: the load would tip.');
      const RA = M * (v.xB - X) / (v.xB - v.xA), RB = M - RA, aA = Math.atan(Math.abs(X - v.xA) / v.h), aB = Math.atan(Math.abs(v.xB - X) / v.h), TA = RA / Math.cos(aA), TB = RB / Math.cos(aB), LA = Math.hypot(X - v.xA, v.h), LB = Math.hypot(v.xB - X, v.h);
      const okW = TA <= v.wll && TB <= v.wll, okA = deg(aA) <= v.angMax && deg(aB) <= v.angMax, ok = okW && okA;
      return output({ M, X, RA, RB, angA: deg(aA), angB: deg(aB), TA, TB, LA, LB }, 'Largest leg tension (kg)', Math.max(TA, TB),
        [m('Combined mass', q(M, 'kg', 0)), m('Centre of gravity position', q(X, 'mm', 1)), m('Weight at A / B', `${q(RA, '', 0)} / ${q(RB, 'kg', 0)}`), m('Leg A: angle, tension, length', `${q(deg(aA), '°', 1)}, ${q(TA, 'kg', 0)}, ${q(LA, 'mm', 0)}`), m('Leg B: angle, tension, length', `${q(deg(aB), '°', 1)}, ${q(TB, 'kg', 0)}, ${q(LB, 'mm', 0)}`)],
        'Two-point lift plan.', 'Rigid planar load; static.', {
          text: ok ? 'LIFT RIGGING ADEQUATE' : 'RIGGING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Leg loads', okW ? 'pass' : 'fail', `${q(Math.max(TA, TB), 'kg', 0)} on the heavier leg against ${q(v.wll, 'kg', 0)}.`), check('Leg angles', okA ? 'pass' : 'fail', `Largest ${q(Math.max(deg(aA), deg(aB)), '°', 1)} against ${q(v.angMax, '°', 0)}.`), check('Lift plan', 'verify', 'Confirm with a full lift plan: crane capacity, dynamic factor and exclusion zone.')],
        });
    },
    "rotor-run-up-time": (v) => {
      if (v.m3 > 0 && v.Di3 >= v.Do3) return invalid('The ring inside diameter must be smaller than the outside diameter.');
      if (v.Tm <= v.TL) return invalid('The motor torque must exceed the load torque or the rotor will not accelerate.');
      const J1 = v.m1 * (v.D1 / 1000) ** 2 / 8, J2 = v.m2 * (v.D2 / 1000) ** 2 / 8, J3 = v.m3 > 0 ? v.m3 * ((v.Do3 / 1000) ** 2 + (v.Di3 / 1000) ** 2) / 8 : 0, J = J1 + J2 + J3 + v.Jm;
      const w = 2 * PI * v.n / 60, t = J * w / (v.Tm - v.TL), revs = w * t / (4 * PI), KE = J * w * w / 2, Erot = KE * v.Tm / (v.Tm - v.TL), Ehr = Erot * v.starts / 1000;
      const okT = t <= v.tMax, okE = Ehr <= v.eMax, ok = okT && okE;
      return output({ J1, J2, J3, J, w, t, revs, KE, Erot, Ehr }, 'Run-up time (s)', t,
        [m('Inertia of disc 1 / disc 2 / ring', `${q(J1, '', 4)} / ${q(J2, '', 4)} / ${q(J3, 'kg·m²', 4)}`), m('Total inertia incl. motor', q(J, 'kg·m²', 4)), m('Run-up time', q(t, 's', 2)), m('Revolutions to speed', q(revs, '', 1)), m('Stored energy', q(KE / 1000, 'kJ', 2)), m('Rotor energy per start', q(Erot / 1000, 'kJ', 2)), m('Rotor energy per hour', q(Ehr, 'kJ', 1))],
        'Rotor run-up.', 'Average torques; direct-on-line induction start.', {
          text: ok ? 'START ACCEPTABLE' : 'START NOT ACCEPTABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Start time', okT ? 'pass' : 'fail', `${q(t, 's', 2)} against ${q(v.tMax, 's', 1)}.`), check('Starts per hour', okE ? 'pass' : 'fail', `${q(Ehr, 'kJ', 0)} per hour against ${q(v.eMax, 'kJ', 0)}.`), check('Supply', 'verify', 'Check voltage dip and protection settings for the long start.')],
        });
    },
    "tensile-test-evaluation": (v) => {
      if (v.df >= v.d0) return invalid('The fracture diameter must be smaller than the original diameter.');
      if (v.Lf < v.L0) return invalid('The final gauge length must not be shorter than the original.');
      if (v.Fy > v.Fmax) return invalid('The yield load cannot exceed the maximum load.');
      const A0 = PI * v.d0 ** 2 / 4, Af = PI * v.df ** 2 / 4, sy = v.Fy * 1000 / A0, uts = v.Fmax * 1000 / A0, el = (v.Lf - v.L0) / v.L0 * 100, RA = (A0 - Af) / A0 * 100, E = (v.Fe * 1000 / A0) / (v.dLe / v.L0) / 1000, sf = v.Ff * 1000 / Af, ef = Math.log(A0 / Af), yr = sy / uts;
      const okY = sy >= v.syMin, okU = uts >= v.utsMin, okE = el >= v.elMin, ok = okY && okU && okE;
      return output({ A0, Af, sy, uts, el, RA, E, sf, ef, yr }, 'Tensile strength (MPa)', uts,
        [m('Yield strength', q(sy, 'MPa', 1)), m('Tensile strength', q(uts, 'MPa', 1)), m('Yield ÷ tensile', q(yr, '', 3)), m('Elongation after fracture', q(el, '%', 1)), m('Reduction of area', q(RA, '%', 1)), m('Elastic modulus', q(E, 'GPa', 1)), m('True fracture stress / strain', `${q(sf, 'MPa', 0)} / ${q(ef, '', 3)}`)],
        'Tensile test evaluation.', 'Round specimen.', {
          text: ok ? 'MEETS SPECIFICATION' : 'DOES NOT MEET SPECIFICATION', tone: ok ? 'good' : 'bad',
          checks: [check('Yield', okY ? 'pass' : 'fail', `${q(sy, 'MPa', 0)} against ${q(v.syMin, 'MPa', 0)}.`), check('Tensile', okU ? 'pass' : 'fail', `${q(uts, 'MPa', 0)} against ${q(v.utsMin, 'MPa', 0)}.`), check('Elongation', okE ? 'pass' : 'fail', `${q(el, '%', 1)} against ${q(v.elMin, '%', 0)}.`), check('Fracture position', 'verify', 'Elongation is only valid if the break is within the middle part of the gauge length.')],
        });
    },
    "brinell-test-check": (v) => {
      const d = (v.d1 + v.d2) / 2;
      if (d >= v.D) return invalid('The indentation must be smaller than the ball.');
      if (v.rHi <= v.rLo || v.hbMax <= v.hbMin) return invalid('Each upper limit must exceed its lower limit.');
      const HB = 2 * v.F / (PI * v.D * (v.D - Math.sqrt(v.D * v.D - d * d))), ratio = d / v.D, fr = v.F / (v.D * v.D), depth = (v.D - Math.sqrt(v.D * v.D - d * d)) / 2, ovality = Math.abs(v.d1 - v.d2) / d * 100;
      const okR = ratio >= v.rLo && ratio <= v.rHi, okT = v.thick >= v.kThick * depth, okE = v.edge >= v.kEdge * d, okS = v.space >= v.kSpace * d, valid = okR && okT && okE && okS, inSpec = HB >= v.hbMin && HB <= v.hbMax, ok = valid && inSpec;
      return output({ d, HB, ratio, fr, depth, ovality, uts: 3.45 * HB, valid: valid ? 1 : 0 }, 'Brinell hardness (HBW)', HB,
        [m('Mean indentation diameter', q(d, 'mm', 3)), m('Brinell hardness', `${q(HB, 'HBW', 0)} ${q(v.D, '', 1)}/${q(v.F, '', 0)}`), m('Indentation ratio d/D', q(ratio, '', 3)), m('Indentation depth', q(depth, 'mm', 3)), m('Difference between diameters', q(ovality, '%', 2)), m('Approximate tensile strength (steel)', q(3.45 * HB, 'MPa', 0))],
        'Brinell test check.', 'Tensile estimate for steels only.', {
          text: !valid ? 'TEST NOT VALID' : inSpec ? 'WITHIN SPECIFICATION' : 'OUT OF SPECIFICATION', tone: ok ? 'good' : 'bad',
          checks: [check('Indentation ratio', okR ? 'pass' : 'fail', `${q(ratio, '', 3)} against ${q(v.rLo, '', 2)}–${q(v.rHi, '', 2)}.`), check('Specimen thickness', okT ? 'pass' : 'fail', `${q(v.thick, 'mm', 1)} against ${q(v.kThick * depth, 'mm', 2)} needed.`), check('Edge distance', okE ? 'pass' : 'fail', `${q(v.edge, 'mm', 1)} against ${q(v.kEdge * d, 'mm', 1)}.`), check('Spacing', okS ? 'pass' : 'fail', `${q(v.space, 'mm', 1)} against ${q(v.kSpace * d, 'mm', 1)}.`), check('Specification', inSpec ? 'pass' : 'fail', `${q(HB, 'HBW', 0)} against ${q(v.hbMin, '', 0)}–${q(v.hbMax, 'HBW', 0)}.`)],
        });
    },
    "compressor-staging-check": (v) => {
      const P1 = v.p1 * 1e5, P2 = (v.p2 + ATM) * 1e5, Qs = v.Q / 60, r = P2 / P1;
      if (r <= 1) return invalid('The discharge pressure must be above the inlet pressure.');
      const ad = (s) => s * v.k / (v.k - 1) * P1 * Qs * (Math.pow(r, (v.k - 1) / (s * v.k)) - 1) / 1000, e = v.eff / 100, P1s = ad(1) / e, P2s = ad(2) / e, save = (1 - P2s / P1s) * 100, pi = Math.sqrt(P1 * P2) / 1e5;
      const T1 = v.T1 + 273.15, Tid = (s) => T1 * Math.pow(Math.pow(r, 1 / s), (v.k - 1) / v.k) - 273.15, Tact = (s) => v.T1 + (Tid(s) - v.T1) / e, Td1 = Tact(1), Td2 = Tact(2), Tchk = v.stages === '1' ? Td1 : Td2, ok = Tchk <= v.Tmax;
      return output({ r, pi, P1s, P2s, save, Ti1: Tid(1), Ti2: Tid(2), Td1, Td2 }, 'Shaft power, chosen arrangement (kW)', v.stages === '1' ? P1s : P2s,
        [m('Overall pressure ratio', q(r, '', 3)), m('Best intermediate pressure (absolute)', q(pi, 'bar', 3)), m('Shaft power, one / two stages', `${q(P1s, '', 2)} / ${q(P2s, 'kW', 2)}`), m('Power saved by two stages', q(save, '%', 1)), m('Discharge temperature, one stage (ideal / actual)', `${q(Tid(1), '', 0)} / ${q(Td1, '°C', 0)}`), m('Discharge temperature per stage, two stages (ideal / actual)', `${q(Tid(2), '', 0)} / ${q(Td2, '°C', 0)}`)],
        'Compressor staging check.', 'Perfect intercooling; ideal gas.', {
          text: ok ? 'DISCHARGE TEMPERATURE OK' : 'DISCHARGE TOO HOT', tone: ok ? 'good' : 'bad',
          checks: [check('Discharge temperature', ok ? 'pass' : 'fail', `${q(Tchk, '°C', 0)} for the ${v.stages === '1' ? 'single-stage' : 'two-stage'} arrangement against ${q(v.Tmax, '°C', 0)}.`), check('Intercooler', v.stages === '2' ? 'verify' : 'pass', v.stages === '2' ? 'Check the intercooler approach temperature and condensate drainage.' : 'Single stage.')],
        });
    },
    "spherical-vessel-design": (v) => {
      const te = v.t - v.ca; if (te <= 0) return invalid('The plate must be thicker than the corrosion allowance.');
      const ri = v.di / 2, ro = ri + te, thin = v.p * v.di / (4 * te), thick = v.p * (ro ** 3 + 2 * ri ** 3) / (2 * (ro ** 3 - ri ** 3)), n = v.Sy / thick, treq = v.p * v.di * v.req / (4 * v.Sy) + v.ca;
      const cap = PI * (v.di / 100) ** 3 / 6, dout = v.di + 2 * v.t, mass = v.rho * PI * ((dout / 1000) ** 3 - (v.di / 1000) ** 3) / 6, sHy = thin * v.hydro, okN = n >= v.req, okH = sHy <= v.Sy * v.hyLim / 100, ok = okN && okH;
      return output({ thin, thick, n, treq, cap, mass, sHy }, 'Safety factor on yield', n,
        [m('Membrane / maximum stress (corroded)', `${q(thin, '', 1)} / ${q(thick, 'MPa', 1)}`), m('Safety factor', q(n, '', 2)), m('Thickness needed incl. allowance', q(treq, 'mm', 2)), m('Capacity', q(cap, 'L', 1)), m('Shell mass', q(mass, 'kg', 1)), m('Hydrotest membrane stress', q(sHy, 'MPa', 1))],
        'Spherical vessel design.', 'Membrane region; screening check.', {
          text: ok ? 'SPHERE ADEQUATE' : 'SPHERE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Safety factor', okN ? 'pass' : 'fail', `${q(n, '', 2)} against ${q(v.req, '', 1)}; ${q(treq, 'mm', 2)} needed.`), check('Hydrotest', okH ? 'pass' : 'fail', `${q(sHy, 'MPa', 0)} against ${q(v.Sy * v.hyLim / 100, 'MPa', 0)}.`), check('Code', 'verify', 'Design and certify to the applicable pressure vessel code.')],
        });
    },
    "motor-efficiency-test": (v) => {
      const W = v.tare - v.zero; if (W <= 0) return invalid('The scale reading must exceed the zero reading.');
      const T = W * v.L, Pout = 2 * PI * v.n / 60 * T, Pin = Math.sqrt(3) * v.V * v.I * v.pf;
      if (Pout >= Pin) return invalid('The output exceeds the electrical input: check the readings.');
      const eff = Pout / Pin * 100, load = Pout / (v.kW * 1000) * 100, dev = eff - v.effN, ok = dev >= -v.tol;
      return output({ W, T, Pout, Pin, eff, load, dev }, 'Efficiency (%)', eff,
        [m('Net brake force', q(W, 'N', 1)), m('Torque', q(T, 'N·m', 2)), m('Shaft output', q(Pout / 1000, 'kW', 3)), m('Electrical input', q(Pin / 1000, 'kW', 3)), m('Efficiency', q(eff, '%', 1)), m('Load share of rated output', q(load, '%', 0)), m('Difference from nameplate', q(dev, 'points', 1))],
        'Motor efficiency test.', 'Steady readings; measured power factor.', {
          text: ok ? 'EFFICIENCY AS RATED' : 'EFFICIENCY BELOW RATING', tone: ok ? 'good' : 'bad',
          checks: [check('Efficiency', ok ? 'pass' : 'fail', `${q(eff, '%', 1)} against ${q(v.effN, '%', 1)} nameplate (−${q(v.tol, '', 1)} points allowed).`), check('Load', load >= 75 && load <= 115 ? 'pass' : 'warn', load >= 75 && load <= 115 ? 'Tested near rated load.' : 'Test well away from rated load: compare with the efficiency at that load.')],
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
