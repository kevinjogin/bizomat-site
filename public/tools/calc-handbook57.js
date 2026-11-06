// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook57). SI units are explicit at each boundary.
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
    "acme-lead-screw-check": (v) => {
      const ac = v.P <= 1.5 ? 0.15 : v.P <= 5 ? 0.25 : v.P <= 12 ? 0.5 : 1, h = 0.5 * v.P + ac, d2 = v.d - 0.5 * v.P, d3 = v.d - 2 * h;
      if (d3 <= 0) return invalid('The pitch is too coarse for this diameter.');
      const lead = v.starts * v.P, area = PI * d3 * d3 / 4, sec = 1 / Math.cos(rad(15)), den = PI * d2 - v.mu * lead * sec;
      if (den <= 0) return invalid('The lead is too large for this diameter and friction.');
      const collar = v.F * v.muc * v.dc / 2, thrR = v.F * d2 / 2 * (lead + PI * v.mu * d2 * sec) / den, thrL = v.F * d2 / 2 * (PI * v.mu * d2 * sec - lead) / (PI * d2 + v.mu * lead * sec);
      const Tr = (thrR + collar) / 1000, Tl = (thrL + collar) / 1000, eff = 100 * v.F * lead / (2 * PI * (thrR + collar)), locks = thrL > 0, sRoot = v.F / area, nThr = v.Lnut / v.P, pNut = v.F / (PI * d2 * 0.5 * v.P * nThr);
      const okS = sRoot <= v.sAllow, okP = pNut <= v.pAllow, ok = okS && okP && locks, Lneed = v.F / (PI * d2 * 0.5 * v.P * v.pAllow) * v.P;
      return output({ d2, d3, lead, area, Tr, Tl, eff, locks: locks ? 1 : 0, sRoot, nThr, pNut, Lneed }, 'Raising torque (N·m)', Tr,
        [m('Pitch / root diameter', `${q(d2, '', 3)} / ${q(d3, 'mm', 3)}`), m('Lead / root area', `${q(lead, 'mm', 2)} / ${q(area, 'mm²', 1)}`), m('Raising / lowering torque', `${q(Tr, '', 2)} / ${q(Tl, 'N·m', 2)}`), m('Efficiency raising', q(eff, '%', 1)), m('Root stress', q(sRoot, 'MPa', 1)), m('Nut bearing pressure', `${q(pNut, 'MPa', 2)} over ${q(nThr, '', 1)} threads`), m('Nut length for the allowable pressure', q(Lneed, 'mm', 1))],
        'Trapezoidal lead screw check.', 'Static load; uniform nut pressure.', {
          text: ok ? 'LEAD SCREW ADEQUATE' : !locks ? 'SCREW BACKDRIVES' : 'LEAD SCREW NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Self-locking', locks ? 'pass' : 'fail', locks ? 'The load cannot drive the screw back.' : 'The load drives the screw back: add a brake.'), check('Root stress', okS ? 'pass' : 'fail', `${q(sRoot, 'MPa', 1)} against ${q(v.sAllow, 'MPa', 0)}.`), check('Nut pressure', okP ? 'pass' : 'fail', `${q(pNut, 'MPa', 2)} against ${q(v.pAllow, 'MPa', 1)}${okP ? '.' : `: make the nut at least ${q(Lneed, 'mm', 0)} long.`}`)],
        });
    },
    "gear-shaft-sizing": (v) => {
      const T = 9549.2966 * v.kW / v.rpm, Ft = 2 * T * 1000 / v.dg, b = rad(v.beta), Fr = Ft * Math.tan(rad(v.alphan)) / Math.cos(b), Fa = Ft * Math.tan(b), M = Math.hypot(Ft * v.a, Fr * v.a + Fa * v.dg / 2) / 1000;
      const Te = Math.sqrt((v.Km * M) ** 2 + (v.Kt * T) ** 2) * 1000, tau = v.keyway === 'yes' ? 0.75 * v.tauA : v.tauA, dreq = Math.cbrt(16 * Te / (PI * tau));
      const A = PI * v.d ** 2 / 4, Z = PI * v.d ** 3 / 32, sig = -Fa / A - M * 1000 / Z, tz = T * 1000 / (2 * Z), vm = Math.sqrt(sig * sig + 3 * tz * tz), n = v.Sy / vm, okD = v.d >= dreq, okS = n >= v.req, ok = okD && okS;
      return output({ T, Ft, Fr, Fa, M, Te: Te / 1000, dreq, sig, tz, vm, n }, 'Diameter needed (mm)', dreq,
        [m('Torque', q(T, 'N·m', 2)), m('Gear forces: tangential / radial / axial', `${q(Ft, '', 0)} / ${q(Fr, '', 0)} / ${q(Fa, 'N', 0)}`), m('Bending moment at the bearing', q(M, 'N·m', 1)), m('Diameter needed', q(dreq, 'mm', 2)), m('von Mises stress at the chosen diameter', q(vm, 'MPa', 1)), m('Safety factor on yield', q(n, '', 2))],
        'Overhung gear shaft sizing.', 'Section at the bearing; shock-factor method.', {
          text: ok ? 'SHAFT ADEQUATE' : 'SHAFT TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Diameter', okD ? 'pass' : 'fail', `${q(v.d, 'mm', 1)} against ${q(dreq, 'mm', 1)} needed.`), check('Combined stress', okS ? 'pass' : 'fail', `Factor ${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Deflection and bearings', 'verify', 'Check shaft slope at the gear and the bearing loads.')],
        });
    },
    "face-milling-power-plan": (v) => {
      if (v.W > v.D) return invalid('The width of cut cannot exceed the cutter diameter.');
      const Tt = 6.3 * v.D / v.W * v.zc / 2, z = v.zUse || Math.max(1, Math.round(Tt)), n = 1000 * v.vc / (PI * v.D), vf = v.fz * z * n;
      const phi = deg(Math.acos(1 - 2 * v.W / v.D)), hm = 360 * v.fz * Math.sin(rad(v.kappa)) * v.W / (PI * v.D * phi), kc = v.kc1 * Math.pow(hm, -v.mc) * (1 - v.rake / 100);
      const Q = v.W * v.ap * vf / 1000, Pc = v.W * v.ap * vf * kc / 6e7, Pm = Pc / (v.eta / 100), T = Pc * 30000 / (PI * n), ok = Pm <= v.Pavail;
      return output({ Tt, z, n, vf, phi, hm, kc, Q, Pc, Pm, T }, 'Motor power (kW)', Pm,
        [m('Teeth suggested / used', `${q(Tt, '', 1)} / ${q(z, '', 0)}`), m('Spindle speed / table feed', `${q(n, 'rpm', 0)} / ${q(vf, 'mm/min', 0)}`), m('Engagement angle', q(phi, '°', 1)), m('Mean chip thickness', q(hm, 'mm', 4)), m('Specific cutting force', q(kc, 'N/mm²', 0)), m('Removal rate', q(Q, 'cm³/min', 1)), m('Cutting / motor power', `${q(Pc, '', 2)} / ${q(Pm, 'kW', 2)}`), m('Spindle torque', q(T, 'N·m', 1))],
        'Face milling power plan.', 'Centred face milling; kc from chip thickness.', {
          text: ok ? 'WITHIN SPINDLE POWER' : 'EXCEEDS SPINDLE POWER', tone: ok ? 'good' : 'bad',
          checks: [check('Spindle power', ok ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pavail, 'kW', 1)}${ok ? '.' : `: reduce depth to ${q(v.ap * v.Pavail / Pm, 'mm', 2)}.`}`), check('Teeth in cut', z >= Tt * 0.8 ? 'pass' : 'warn', z >= Tt * 0.8 ? 'Enough teeth engaged for smooth cutting.' : 'Fewer teeth than suggested: cutting may be interrupted and rough.'), check('Spindle torque at low speed', 'verify', 'Check the spindle’s torque curve at this speed.')],
        });
    },
    "ballscrew-duty-life": (v) => {
      const steps = [1, 2, 3, 4].map((i) => [v['P' + i], v['n' + i], v['t' + i]]).filter((s) => s[1] > 0 && s[2] > 0);
      if (!steps.length) return invalid('Enter at least one step with speed and time.');
      const st = steps.reduce((s, x) => s + x[2], 0), snt = steps.reduce((s, x) => s + x[1] * x[2], 0), nm = snt / st, Fm = Math.pow(steps.reduce((s, x) => s + x[0] ** 3 * x[1] * x[2], 0) / snt, 1 / 3);
      if (Fm <= 0) return invalid('Enter a load in at least one step.');
      const L = (v.Ca / (v.fw * Fm)) ** 3 * 1e6, hours = L / (60 * nm), km = L * v.lead / 1e6, share = steps.map((s) => s[0] ** 3 * s[1] * s[2] / (Fm ** 3 * snt) * 100), ok = hours >= v.req;
      return output({ nm, Fm, L, hours, km, st }, 'Life (h)', hours,
        [m('Mean speed', q(nm, 'rpm', 0)), m('Cubic mean load', q(Fm, 'kN', 3)), m('Life', `${q(L / 1e6, 'million rev', 1)}, ${q(hours, 'h', 0)}`), m('Travel over the life', q(km, 'km', 0)), m('Share of life used by each step', share.map((p) => q(p, '%', 0)).join(' / '))],
        'Ball screw duty-cycle life.', 'Cubic mean load; basic rating life.', {
          text: ok ? 'LIFE ADEQUATE' : 'LIFE TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Life', ok ? 'pass' : 'fail', `${q(hours, 'h', 0)} against ${q(v.req, 'h', 0)}.`), check('Time shares', Math.abs(st - 100) < 0.5 ? 'pass' : 'warn', Math.abs(st - 100) < 0.5 ? 'Time shares add to 100%.' : `Time shares add to ${q(st, '%', 1)}; they are normalised.`), check('Static and buckling', 'verify', 'Check the static rating, critical speed and buckling of the screw separately.')],
        });
    },
    "turn-of-nut-fatigue-check": (v) => {
      if (v.Ls + v.Lt <= 0) return invalid('Enter the shank and/or threaded length in the grip.');
      const As = PI * v.d * v.d / 4, Eb = v.E * 1000, flex = (v.Ls / As + v.Lt / v.At) / Eb, kb = 1 / flex, kj = v.kj * 1000, Fn = v.theta / 360 * v.lead / (flex + 1 / kj), F = Fn / 1000, C = kb / (kb + kj), si = Fn / v.At, pct = si / v.Sp * 100;
      if (si >= v.Sut) return invalid('The preload stress is at or above the tensile strength.');
      const sa = C * v.P * 1000 / (2 * v.At), sm = sa + si, n = v.Se * (v.Sut - si) / (v.Sut * sa + v.Se * (sm - si)), okP = pct <= v.pMax, okF = n >= v.req, ok = okP && okF;
      return output({ kb: kb / 1000, F, C, si, pct, sa, sm, n }, 'Fatigue safety factor', n,
        [m('Bolt stiffness', q(kb / 1000, 'kN/mm', 1)), m('Preload', q(F, 'kN', 2)), m('Preload stress / share of proof', `${q(si, 'MPa', 0)} / ${q(pct, '%', 0)}`), m('Joint constant', q(C, '', 3)), m('Alternating / mean stress', `${q(sa, '', 1)} / ${q(sm, 'MPa', 0)}`), m('Fatigue safety factor', q(n, '', 2))],
        'Turn-of-nut preload and fatigue check.', 'Angle from snug; Goodman line.', {
          text: ok ? 'JOINT ADEQUATE' : !okP ? 'PRELOAD TOO HIGH' : 'FATIGUE RISK', tone: ok ? 'good' : 'bad',
          checks: [check('Preload', okP ? 'pass' : 'fail', `${q(pct, '%', 0)} of proof against ${q(v.pMax, '%', 0)}.`), check('Fatigue', okF ? 'pass' : 'fail', `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Snug point', 'verify', 'Define snug (e.g. full effort with a short spanner) and mark nut and bolt before turning.')],
        });
    },
    "unified-thread-wire-limits": (v) => {
      const r4 = (x) => Math.round(x * 1e4) / 1e4, r6 = (x) => Math.round(x * 1e6) / 1e6, P = Math.round(1e8 / v.n) / 1e8, LE = v.LE || Math.min(9 * P, v.D);
      const base = r6(0.0015 * Math.cbrt(v.D) + 0.0015 * Math.sqrt(LE) + 0.015 * Math.cbrt(P * P)), fac = { 1: 1.5, 2: 1, 3: 0.75 }[v.cls], Td2 = r6(base * fac), es = v.cls === '3' ? 0 : r4(0.3 * base), has2 = r6(0.64951905 * P);
      const dmax = r4(v.D - es), d2max = r4(dmax - has2), d2min = r4(d2max - Td2), d3max = r4(dmax - 1.19078493 * P);
      if (d3max <= 0) return invalid('Too few threads per inch for this diameter.');
      const a = rad(30), best = (P / 2) / Math.cos(a), W = v.W || best, k = W * (1 + 1 / Math.sin(a)) - (P / 2) / Math.tan(a), Mmax = d2max + k, Mmin = d2min + k, E = v.Mmeas - k, ratio = W / P, okW = ratio >= 0.505 && ratio <= 1.01, ok = E >= d2min - 1e-9 && E <= d2max + 1e-9;
      return output({ P, d2max, d2min, best, W, k, Mmax, Mmin, E, dev: E - (d2max + d2min) / 2 }, 'Pitch diameter from the reading (in)', E,
        [m('Pitch diameter limits', `${q(d2min, '', 4)} – ${q(d2max, 'in', 4)}`), m('Best wire size / wire used', `${q(best, '', 5)} / ${q(W, 'in', 5)}`), m('Reading over wires: min / max', `${q(Mmin, '', 4)} / ${q(Mmax, 'in', 4)}`), m('Pitch diameter from the reading', q(E, 'in', 4))],
        'Unified thread over-wire limits.', 'Best-size wires; small lead and angle errors.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch diameter', ok ? 'pass' : 'fail', `${q(E, 'in', 4)} against ${q(d2min, '', 4)}–${q(d2max, 'in', 4)}${ok ? '.' : E > d2max ? ': oversize.' : ': undersize.'}`), check('Wire size', okW ? 'pass' : 'fail', okW ? 'Wires touch the flanks near the pitch line.' : 'Wires outside the usable range for this pitch.'), check('Measuring force', 'verify', 'Use the specified measuring force; small wires deform under high force.')],
        });
    },
    "change-gear-threading-setup": (v) => {
      const lead = (unit, val) => (unit === 'mm' ? val : 25.4 / val), req = v.P / (lead(v.screwUnit, v.screw) * v.fixed);
      const gears = v.set === 'g5' ? [...Array.from({ length: 21 }, (_, i) => 20 + 5 * i), 127] : [...Array.from({ length: 19 }, (_, i) => 24 + 4 * i), 127];
      let b2 = null, b4 = null;
      for (const A of gears) for (const B of gears) { if (A === B) continue; const e = Math.abs(A / B / req - 1); if (!b2 || e < b2.e) b2 = { A, B, e }; }
      for (let i = 0; i < gears.length; i++) for (let j = 0; j < gears.length; j++) { if (j === i) continue; for (let k = 0; k < gears.length; k++) { if (k === i || k === j) continue; for (let l = 0; l < gears.length; l++) { if (l === i || l === j || l === k) continue; const r = gears[i] * gears[k] / (gears[j] * gears[l]), e = Math.abs(r / req - 1); if (!b4 || e < b4.e - 1e-15) b4 = { A: gears[i], B: gears[j], C: gears[k], D: gears[l], e }; } } }
      const clean = (e) => (Math.abs(e) < 1e-9 ? 0 : e), err2 = clean(100 * (b2.A / b2.B / req - 1)), err4 = clean(100 * (b4.A * b4.C / (b4.B * b4.D) / req - 1)), best2 = `driver ${b2.A}, driven ${b2.B}`, best4 = `drivers ${b4.A} and ${b4.C}, driven ${b4.B} and ${b4.D}`;
      const d2 = v.d - 0.649519053 * v.P, d3 = v.d - 1.226869322 * v.P, h3 = 0.613435 * v.P;
      if (d3 <= 0) return invalid('The pitch is too coarse for this diameter.');
      const passes = Math.ceil((h3 / v.a1) ** 2 - 1e-9), use4 = Math.abs(err2) > v.tolPct, errUse = use4 ? err4 : err2, ok = Math.abs(errUse) <= v.tolPct + 1e-12;
      return output({ req, err2, err4, best2, best4, d2, h3, passes }, 'Thread height (mm)', h3,
        [m('Ratio needed (driven ÷ driver)', q(req, '', 6)), m('Best simple train / error', `${best2} / ${q(err2, '%', 4)}`), m('Best compound train / error', `${best4} / ${q(err4, '%', 4)}`), m('Pitch diameter / thread height', `${q(d2, '', 3)} / ${q(h3, 'mm', 3)}`), m('Passes (constant-area infeed)', q(passes, '', 0))],
        'Change-gear threading set-up.', 'Single-point threading; constant-area infeed.', {
          text: ok ? 'GEAR TRAIN FOUND' : 'NO ACCURATE TRAIN', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch error', ok ? 'pass' : 'fail', `${q(errUse, '%', 4)} with the ${use4 ? 'compound' : 'simple'} train against ±${q(v.tolPct, '%', 3)}.`), check('Gear fit', 'verify', 'Check the gears fit the banjo and add an idler for the right hand of thread.'), check('Thread chasing', 'verify', 'With a metric thread on an inch leadscrew, keep the half-nut engaged and reverse the spindle.')],
        });
    },
    "panel-material-substitution": (v) => {
      const tStiff = v.t1 * Math.cbrt(v.E1 / v.E2), tStr = v.t1 * Math.sqrt(v.S1 / v.S2), t2 = Math.max(tStiff, tStr), mr = v.rho2 * t2 / (v.rho1 * v.t1);
      const m1 = v.rho1 * v.t1 / 1000, m2 = v.rho2 * t2 / 1000, c1 = m1 * v.p1 * v.area, c2 = m2 * v.p2 * v.area, okT = t2 <= v.tMax, okW = mr < 1, ok = okT && okW;
      return output({ tStiff, tStr, t2, mr, m1, m2, c1, c2 }, 'Governing thickness (mm)', t2,
        [m('Thickness for equal stiffness / strength', `${q(tStiff, '', 2)} / ${q(tStr, 'mm', 2)}`), m('Governing thickness', `${q(t2, 'mm', 2)} (${tStiff >= tStr ? 'stiffness' : 'strength'})`), m('Mass per m²: old / new', `${q(m1, '', 2)} / ${q(m2, 'kg', 2)}`), m('Mass ratio new ÷ old', q(mr, '', 3)), m('Panel mass: old / new', `${q(m1 * v.area, '', 1)} / ${q(m2 * v.area, 'kg', 1)}`), m('Panel material cost: old / new', `${money(c1)} / ${money(c2)}`)],
        'Panel material substitution.', 'Flat bending panel; same shape and supports.', {
          text: ok ? 'SUBSTITUTION SAVES WEIGHT' : !okT ? 'TOO THICK FOR AVAILABLE STOCK' : 'NO WEIGHT SAVING', tone: ok ? 'good' : 'bad',
          checks: [check('Stock', okT ? 'pass' : 'fail', `${q(t2, 'mm', 2)} needed against ${q(v.tMax, 'mm', 1)} available.`), check('Weight', okW ? 'pass' : 'fail', `${q(mr * 100, '%', 0)} of the original mass.`), check('Cost', c2 <= c1 ? 'pass' : 'warn', `${money(c2)} against ${money(c1)} in material.`)],
        });
    },
    "cone-clutch-engagement": (v) => {
      if (v.Di >= v.Do) return invalid('The small diameter must be less than the large diameter.');
      const s = Math.sin(rad(v.alpha)), T = v.mu * v.F * (v.Do + v.Di) / 4000 / s, Fe = v.F * (s + v.mu * Math.cos(rad(v.alpha))) / s;
      if (T <= v.Tl) return invalid('The clutch torque does not exceed the load torque: the load would not accelerate.');
      const w = 2 * PI * v.n / 60, ts = v.J * w / (T - v.Tl), E = T * w * ts / 2, Ek = v.J * w * w / 2, dT = E / (v.mc * v.cpc * 1000), okT = T >= v.Treq, okH = dT <= v.dTmax, ok = okT && okH;
      return output({ T, Fe, w, ts, E, Ek, dT }, 'Torque capacity (N·m)', T,
        [m('Torque capacity', q(T, 'N·m', 1)), m('Engaging force', q(Fe, 'N', 0)), m('Slip time', q(ts, 's', 2)), m('Slip energy / load kinetic energy', `${q(E / 1000, '', 2)} / ${q(Ek / 1000, 'kJ', 2)}`), m('Temperature rise per engagement', q(dT, 'K', 2))],
        'Cone clutch engagement check.', 'Constant friction; heat into the cone.', {
          text: ok ? 'CLUTCH ADEQUATE' : !okT ? 'CLUTCH SLIPS UNDER LOAD' : 'CLUTCH OVERHEATS', tone: ok ? 'good' : 'bad',
          checks: [check('Torque', okT ? 'pass' : 'fail', `${q(T, 'N·m', 1)} against ${q(v.Treq, 'N·m', 0)} required.`), check('Heat per start', okH ? 'pass' : 'fail', `${q(dT, 'K', 2)} against ${q(v.dTmax, 'K', 0)}.`), check('Starts per hour', 'verify', 'Check the cone cools between starts at your start frequency.')],
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
