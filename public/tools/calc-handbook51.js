// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook51). SI units are explicit at each boundary.
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
    "c-frame-throat-check": (v) => {
      const sec = (h) => { const ro = v.ri + h, rc = v.ri + h / 2, rn = h / Math.log(ro / v.ri), e = rc - rn, A = v.b * h, F = v.P * 1000, M = F * (v.a + h / 2); return { ro, rc, rn, e, A, M, si: F / A + M * (rn - v.ri) / (A * e * v.ri), so: F / A - M * (ro - rn) / (A * e * ro), st: F / A + 6 * M / (v.b * h * h) }; };
      const s = sec(v.h);
      let lo = 1e-3, hi = 1e5, hReq = Infinity;
      if (sec(hi).si <= v.allow) { for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (sec(mid).si > v.allow) lo = mid; else hi = mid; } hReq = hi; }
      const peak = Math.max(Math.abs(s.si), Math.abs(s.so)), ok = peak <= v.allow;
      return output({ A: s.A, M: s.M, rn: s.rn, e: s.e, si: s.si, so: s.so, sStraight: s.st, factor: s.si / s.st, hReq: Number.isFinite(hReq) ? hReq : 0 }, 'Inner fibre stress (MPa)', s.si,
        [m('Bending moment at the throat', q(s.M / 1e6, 'kN·m', 2)), m('Neutral-axis shift e', q(s.e, 'mm', 2)), m('Inner fibre stress (curved)', q(s.si, 'MPa', 1)), m('Outer fibre stress (curved)', q(s.so, 'MPa', 1)), m('Straight-beam stress', q(s.st, 'MPa', 1)), m('Curvature factor (inner ÷ straight)', q(s.si / s.st, '', 3)), m('Throat depth needed', Number.isFinite(hReq) ? q(hReq, 'mm', 1) : 'Not reachable by depth alone')],
        'C-frame throat check.', 'Rectangular throat; static load.', {
          text: ok ? 'THROAT ADEQUATE' : 'THROAT OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Inner fibre', s.si <= v.allow ? 'pass' : 'fail', `${q(s.si, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}${s.si <= v.allow ? '.' : Number.isFinite(hReq) ? `: deepen the throat to ${q(hReq, 'mm', 0)}.` : ': widen the section or reduce the gap.'}`), check('Outer fibre', Math.abs(s.so) <= v.allow ? 'pass' : 'fail', `${q(s.so, 'MPa', 1)} (compression) against ${q(v.allow, 'MPa', 0)}.`), check('Fatigue and deflection', 'verify', 'Check gap opening and fatigue for cyclic press loads.')],
        });
    },
    "bolt-pattern-hole-plan": (v) => {
      if (v.Hm <= v.F) return invalid('The clearance hole must be larger than the fastener.');
      if (v.Hl < v.Hm) return invalid('The largest hole must not be smaller than the smallest hole.');
      if (v.OD <= v.BCD || (v.ID > 0 && v.ID >= v.BCD)) return invalid('The bolt circle must lie between the bore and the outside diameter.');
      const step = 360 / v.n, chord = v.BCD * Math.sin(PI / v.n), lig = chord - v.Hl, eOut = (v.OD - v.BCD) / 2 - v.Hl / 2, eIn = v.ID > 0 ? (v.BCD - v.ID) / 2 - v.Hl / 2 : Infinity;
      const tot = v.Hm - v.F, Thole = v.mode === 'floating' ? tot : tot * v.share / 100, Tthread = v.mode === 'floating' ? tot : tot - Thole, bonus = v.Hl - v.Hm;
      const okL = lig >= v.minLig, okE = eOut >= v.minEdge && eIn >= v.minEdge, okW = chord >= v.wrench, okT = Math.min(Thole, Tthread) >= v.minTol - 1e-12, ok = okL && okE && okW && okT;
      const rows = Array.from({ length: Math.min(v.n, 60) }, (_, i) => { const a = v.start + i * step, x = v.BCD / 2 * Math.cos(rad(a)), y = v.BCD / 2 * Math.sin(rad(a)); return [String(i + 1), q(a, '°', 2), q(Math.abs(x) < 1e-9 ? 0 : x, 'mm', 3), q(Math.abs(y) < 1e-9 ? 0 : y, 'mm', 3)]; });
      return output({ step, chord, lig, eOut, eIn: Number.isFinite(eIn) ? eIn : 0, tot, Thole, Tthread, bonus, x1: v.BCD / 2 * Math.cos(rad(v.start)), y1: v.BCD / 2 * Math.sin(rad(v.start)) }, 'Position tolerance for the clearance holes (mm)', Thole,
        [m('Angle between holes', q(step, '°', 3)), m('Chord between adjacent holes', q(chord, 'mm', 3)), m('Ligament at the largest hole', q(lig, 'mm', 2)), m('Edge distance: outside / bore', `${q(eOut, '', 2)} / ${Number.isFinite(eIn) ? q(eIn, 'mm', 2) : 'no bore'}`), m('Position tolerance: clearance holes / other part', `${q(Thole, '', 3)} / ${q(Tthread, 'mm', 3)} at MMC`), m('Bonus at the largest hole', q(bonus, 'mm', 3))],
        'Bolt pattern hole plan.', 'Equal spacing; MMC tolerancing.', {
          text: ok ? 'PATTERN WORKS' : 'PATTERN DOES NOT WORK', tone: ok ? 'good' : 'bad',
          table: tbl('Hole coordinates', ['Hole', 'Angle', 'X', 'Y'], rows),
          checks: [check('Ligament', okL ? 'pass' : 'fail', `${q(lig, 'mm', 2)} against ${q(v.minLig, 'mm', 1)}.`), check('Edge distance', okE ? 'pass' : 'fail', `${q(Math.min(eOut, eIn), 'mm', 2)} against ${q(v.minEdge, 'mm', 1)}.`), check('Wrench clearance', okW ? 'pass' : 'fail', `Chord ${q(chord, 'mm', 1)} against ${q(v.wrench, 'mm', 1)} wrench.`), check('Position tolerance', okT ? 'pass' : 'fail', `${q(Math.min(Thole, Tthread), 'mm', 3)} against ${q(v.minTol, 'mm', 2)} the shop can hold.`)],
        });
    },
    "interference-fit-limits-check": (v) => {
      if (!(v.D > v.d) || !(v.d > v.di)) return invalid('Diameters must satisfy hub outside > interface > shaft bore.');
      const steps = [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500]; let k = 1; while (k < steps.length - 1 && v.d > steps[k]) k++;
      const lo = steps[k - 1], hi = steps[k], Dg = Math.sqrt((lo || 1) * hi), iu = 0.45 * Math.cbrt(Dg) + 0.001 * Dg, mult = { 5: 7, 6: 10, 7: 16, 8: 25, 9: 40, 10: 64, 11: 100, 12: 160, 13: 250, 14: 400, 15: 640, 16: 1000 }, ITh = mult[v.gh] * iu, ITs = mult[v.gs] * iu;
      const dMin = (v.ei - ITh) / 1000, dMax = (v.ei + ITs) / 1000;
      const Eh = v.Eh * 1000, Es = v.Es * 1000, kh = (v.D ** 2 + v.d ** 2) / (v.D ** 2 - v.d ** 2), ks = (v.d ** 2 + v.di ** 2) / (v.d ** 2 - v.di ** 2), pOf = (dl) => dl / (v.d * ((kh + v.nuh) / Eh + (ks - v.nus) / Es));
      const pMin = Math.max(0, pOf(dMin)), pMax = pOf(dMax), Tmin = v.mu * pMin * PI * v.d * v.d * v.L / 2 / 1000, hoop = pMax * kh, vm = Math.sqrt(hoop * hoop + hoop * pMax + pMax * pMax), nMax = v.Sy / vm;
      const Fmax = v.mu * pMax * PI * v.d * v.L, dT = (dMax + v.clear) / (v.alpha * 1e-6 * v.d), need = v.Treq * v.SF, okI = dMin > 0, okT = Tmin >= need, okS = nMax >= v.req, ok = okI && okT && okS;
      return output({ ITh, ITs, dMin, dMax, pMin, pMax, Tmin, hoop, vm, nMax, Fmax, dT }, 'Holding torque at least interference (N·m)', Tmin,
        [m('Hole limits', `0 to +${q(ITh, 'µm', 1)} (IT${v.gh})`), m('Shaft limits', `+${q(v.ei, '', 1)} to +${q(v.ei + ITs, 'µm', 1)} (IT${v.gs})`), m('Interference: least / most', `${q(dMin * 1000, '', 1)} / ${q(dMax * 1000, 'µm', 1)}`), m('Pressure: least / most', `${q(pMin, '', 1)} / ${q(pMax, 'MPa', 1)}`), m('Holding torque at least interference', q(Tmin, 'N·m', 0)), m('Hub von Mises stress at most', q(vm, 'MPa', 0)), m('Hub safety factor at most', q(nMax, '', 2)), m('Press force / heating at most', `${q(Fmax / 1000, 'kN', 1)} / ${q(dT, 'K', 0)} rise`)],
        'Interference fit limits check.', 'Thick-cylinder theory; basic hole.', {
          text: ok ? 'FIT WORKS OVER ITS LIMITS' : 'FIT DOES NOT WORK', tone: ok ? 'good' : 'bad',
          checks: [check('Interference', okI ? 'pass' : 'fail', okI ? 'Interference at both limits.' : 'The least-material parts would have clearance.'), check('Grip at least interference', okT ? 'pass' : 'fail', `${q(Tmin, 'N·m', 0)} against ${q(need, 'N·m', 0)} (torque × slip factor).`), check('Hub at most interference', okS ? 'pass' : 'fail', `Safety factor ${q(nMax, '', 2)} against ${q(v.req, '', 1)}.`)],
        });
    },
    "pontoon-float-check": (v) => {
      const r = v.D / 2, Vfull = v.n * PI * (v.D / 1000) ** 2 / 4 * (v.L / 1000), mass = v.n * v.mDrum + v.mDeck + v.pay, Vd = mass / v.rho, g = 9.80665;
      if (Vd >= Vfull) return invalid('The weight exceeds the full buoyancy of the drums: the raft sinks.');
      const Aimm = Vd / (v.n * v.L / 1000) * 1e6, seg = (h) => { const th = 2 * Math.acos((r - h) / r); return r * r * (th - Math.sin(th)) / 2; };
      let lo = 0, hi = v.D; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (seg(mid) < Aimm) lo = mid; else hi = mid; }
      const h = (lo + hi) / 2, fb = v.D - h, res = (Vfull - Vd) / Vd * 100, Fb = v.rho * g * Vfull, W = mass * g, payMax = Vfull * v.rho / (1 + v.minRes / 100) - (v.n * v.mDrum + v.mDeck), okF = fb >= v.minFb, okR = res >= v.minRes - 1e-9, ok = okF && okR;
      return output({ Vfull, mass, Vd, Aimm, h, fb, res, Fb, W, payMax }, 'Freeboard (mm)', fb,
        [m('Total mass afloat', q(mass, 'kg', 0)), m('Full buoyancy of the drums', `${q(Fb / 1000, 'kN', 2)} (${q(Vfull, 'm³', 3)})`), m('Displaced volume', q(Vd, 'm³', 3)), m('Draft', q(h, 'mm', 0)), m('Freeboard', q(fb, 'mm', 0)), m('Reserve buoyancy', q(res, '%', 0)), m('Largest payload for the reserve wanted', q(Math.max(0, payMax), 'kg', 0))],
        'Pontoon float check.', 'Level float; sealed drums.', {
          text: ok ? 'FLOAT ADEQUATE' : 'FLOAT NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Freeboard', okF ? 'pass' : 'fail', `${q(fb, 'mm', 0)} against ${q(v.minFb, 'mm', 0)}.`), check('Reserve buoyancy', okR ? 'pass' : 'fail', `${q(res, '%', 0)} against ${q(v.minRes, '%', 0)}${okR ? '.' : `: carry no more than ${q(Math.max(0, payMax), 'kg', 0)}.`}`), check('Stability', 'verify', 'Check heel with the load to one side and the drums’ spacing.')],
        });
    },
    "spade-drilling-plan": (v) => {
      const n0 = 1000 * v.vc / (PI * v.D), n = Math.min(n0, v.nmax), k = 1 + v.dull / 100, MRR = PI * v.D * v.D / 4 * v.f * n, kWc = v.ukw * MRR / 1000 * k, kWm = kWc / v.em, Bs = 22500 * v.ukw * v.f * v.D * k, time = (v.depth + v.appr) / (v.f * n);
      const fMaxT = v.thrustMax / (22500 * v.ukw * v.D * k), okP = kWm <= v.avail, okT = Bs <= v.thrustMax, ok = okP && okT;
      return output({ n, MRR, kWc, kWm, Bs, time, fMaxT }, 'Motor power (kW)', kWm,
        [m('Spindle speed', `${q(n, 'rpm', 0)}${n < n0 ? ' (held to the machine maximum)' : ''}`), m('Metal removal rate', q(MRR / 1000, 'cm³/min', 1)), m('Cutting / motor power', `${q(kWc, '', 2)} / ${q(kWm, 'kW', 2)}`), m('Thrust', q(Bs, 'N', 0)), m('Largest feed for the thrust limit', q(fMaxT, 'mm/rev', 3)), m('Drilling time per hole', q(time * 60, 's', 1))],
        'Spade drilling plan.', 'Unit power method with wear allowance.', {
          text: ok ? 'MACHINE CAN DRILL IT' : 'MACHINE CANNOT DRILL IT', tone: ok ? 'good' : 'bad',
          checks: [check('Power', okP ? 'pass' : 'fail', `${q(kWm, 'kW', 2)} against ${q(v.avail, 'kW', 1)}.`), check('Thrust', okT ? 'pass' : 'fail', `${q(Bs, 'N', 0)} against ${q(v.thrustMax, 'N', 0)}${okT ? '.' : `: feed at ${q(fMaxT, 'mm/rev', 3)} or less.`}`), check('Chip removal', 'verify', 'Use coolant and chip breakers; peck deep holes.')],
        });
    },
    "thrust-pad-bearing-check": (v) => {
      if (v.Di >= v.Do) return invalid('The inside diameter must be smaller.');
      const A = PI * (v.Do ** 2 - v.Di ** 2) / 4 * v.fill / 100, P = v.W / A, V = PI * (v.Do + v.Di) / 2 * v.rpm / 60000, PV = P * V, Pf = v.mu * v.W * V, Q = Pf / 1000 / (v.rho * v.cp / 60000 * v.dT);
      const okP = P <= v.Pallow, okPV = PV <= v.PVallow, okQ = Q <= v.supply, ok = okP && okPV && okQ;
      return output({ A, P, V, PV, Pf, Q }, 'Unit load (MPa)', P,
        [m('Pad area', q(A, 'mm²', 0)), m('Unit load', q(P, 'MPa', 3)), m('Mean sliding velocity', q(V, 'm/s', 2)), m('PV', q(PV, 'MPa·m/s', 2)), m('Friction power loss', q(Pf, 'W', 0)), m('Oil flow needed', q(Q, 'L/min', 2))],
        'Thrust pad bearing check.', 'Uniform pad load; friction coefficient as entered.', {
          text: ok ? 'BEARING ADEQUATE' : 'BEARING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Unit load', okP ? 'pass' : 'fail', `${q(P, 'MPa', 2)} against ${q(v.Pallow, 'MPa', 2)}.`), check('PV', okPV ? 'pass' : 'fail', `${q(PV, 'MPa·m/s', 1)} against ${q(v.PVallow, 'MPa·m/s', 1)}.`), check('Oil supply', okQ ? 'pass' : 'fail', `${q(Q, 'L/min', 2)} needed against ${q(v.supply, 'L/min', 2)}.`)],
        });
    },
    "tube-post-eccentric-check": (v) => {
      if (2 * v.t >= v.OD) return invalid('The wall is too thick for this diameter.');
      const id = v.OD - 2 * v.t, A = PI * (v.OD ** 2 - id ** 2) / 4, I = PI * (v.OD ** 4 - id ** 4) / 64, c = v.OD / 2, r = Math.sqrt(I / A), E = v.E * 1000, Le = v.K * v.L, sl = Le / r, PE = PI * PI * E * I / (Le * Le);
      if (v.P >= PE) return invalid('The load is at or above the Euler buckling load.');
      const smax = (P) => P / A * (1 + v.e * c / (r * r) / Math.cos(Le / (2 * r) * Math.sqrt(P / (A * E)))), s0 = smax(v.P); let lo = 0, hi = PE / v.P * 0.999999;
      if (smax(hi * v.P) < v.Sy) lo = hi; else for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (smax(mid * v.P) < v.Sy) lo = mid; else hi = mid; }
      const n = lo, okN = n >= v.req, okS = sl <= v.slMax, ok = okN && okS;
      return output({ A, I, r, c, sl, PE, smax: s0, n }, 'Load factor to yield', n,
        [m('Area / second moment', `${q(A, 'mm²', 0)} / ${q(I, 'mm⁴', 0)}`), m('Radius of gyration', q(r, 'mm', 2)), m('Slenderness KL/r', q(sl, '', 0)), m('Euler load', q(PE / 1000, 'kN', 1)), m('Peak stress', q(s0, 'MPa', 1)), m('Load factor to first yield', q(n, '', 2))],
        'Tube post with eccentric load.', 'Secant formula; elastic to first yield.', {
          text: ok ? 'POST ADEQUATE' : 'POST NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Load factor', okN ? 'pass' : 'fail', `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Slenderness', okS ? 'pass' : 'fail', `${q(sl, '', 0)} against ${q(v.slMax, '', 0)}.`), check('Base and connection', 'verify', 'Check the base plate, bolts and the bracket connection for the moment P × e.')],
        });
    },
    "hot-surface-insulation-check": (v) => {
      if (v.Ts <= v.Ta) return invalid('The surface must be hotter than the surroundings.');
      const s = 5.670374e-8, Tk = v.Ts + 273.15, Tak = v.Ta + 273.15, Qr = v.eps * s * v.area * (Tk ** 4 - Tak ** 4), Qc = v.hc * v.area * (v.Ts - v.Ta), Qbare = Qr + Qc;
      const U = 1 / (v.t / 1000 / v.k + 1 / v.hout), dT = v.Ts - v.Ta, qf = U * dT, Qins = qf * v.area, To = v.Ta + qf / v.hout, save = (Qbare - Qins) / 1000 * v.hours * v.price, invest = v.cost * v.area, pay = save > 0 ? invest / save : Infinity;
      const okT = To <= v.touch, okP = pay <= v.payMax, ok = okT && okP;
      return output({ Qr, Qc, Qbare, U, qf, Qins, To, save, invest, pay: Number.isFinite(pay) ? pay : 0 }, 'Outer surface temperature (°C)', To,
        [m('Bare loss: radiation / convection', `${q(Qr / 1000, '', 2)} / ${q(Qc / 1000, 'kW', 2)}`), m('Bare loss total', q(Qbare / 1000, 'kW', 2)), m('Insulated loss', q(Qins / 1000, 'kW', 3)), m('Outer surface temperature', q(To, '°C', 1)), m('Yearly saving', money(save)), m('Insulation cost', money(invest)), m('Payback', Number.isFinite(pay) ? q(pay * 12, 'months', 1) : 'No saving')],
        'Hot surface insulation check.', 'Flat surface; steady state.', {
          text: ok ? 'INSULATION ADEQUATE' : 'INSULATION NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Touch temperature', okT ? 'pass' : 'fail', `${q(To, '°C', 1)} against ${q(v.touch, '°C', 0)}${okT ? '.' : ': add thickness or a guard.'}`), check('Payback', okP ? 'pass' : 'fail', Number.isFinite(pay) ? `${q(pay, 'years', 2)} against ${q(v.payMax, 'years', 1)}.` : 'No saving.'), check('Insulation rating', 'verify', 'Confirm the insulation is rated for the hot-face temperature.')],
        });
    },
    "plug-gauge-plan": (v) => {
      const steps = [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500]; let k = 1; while (k < steps.length - 1 && v.size > steps[k]) k++;
      const lo = steps[k - 1], hi = steps[k], Dg = Math.sqrt((lo || 1) * hi), iu = 0.45 * Math.cbrt(Dg) + 0.001 * Dg, it = { 5: 7, 6: 10, 7: 16, 8: 25, 9: 40, 10: 64, 11: 100, 12: 160, 13: 250, 14: 400, 15: 640, 16: 1000 }[v.grade] * iu;
      const hole = v.feature === 'hole', lower = hole ? v.size + v.dev / 1000 : v.size + v.dev / 1000 - it / 1000, upper = lower + it / 1000;
      const T = upper - lower, G = T * v.gpct / 100, W = T * v.wpct / 100;
      if (G + W >= T) return invalid('Gauge tolerance plus wear allowance must be less than the work tolerance.');
      const go = hole ? [lower + W, lower + W + G] : [upper - W - G, upper - W], nogo = hole ? [upper - G, upper] : [lower, lower + G], ok = G * 1000 >= v.minG - 1e-9;
      return output({ it, lower, upper, T, G, W, goLo: go[0], goHi: go[1], nogoLo: nogo[0], nogoHi: nogo[1] }, 'Work tolerance (µm)', it,
        [m('Work limits', `${q(lower, '', 4)} to ${q(upper, 'mm', 4)}`), m('Work tolerance', q(it, 'µm', 1)), m('Go gauge', `${q(go[0], '', 4)} to ${q(go[1], 'mm', 4)}`), m('No-go gauge', `${q(nogo[0], '', 4)} to ${q(nogo[1], 'mm', 4)}`), m('Gauge tolerance / wear allowance', `${q(G * 1000, '', 2)} / ${q(W * 1000, 'µm', 2)}`)],
        'Limit gauge plan.', 'Gauge tolerance inside the work limits.', {
          text: ok ? 'GAUGES MAKEABLE' : 'GAUGE TOLERANCE TOO TIGHT', tone: ok ? 'good' : 'bad',
          checks: [check('Gauge tolerance', ok ? 'pass' : 'fail', `${q(G * 1000, 'µm', 2)} against ${q(v.minG, 'µm', 1)} the maker holds${ok ? '.' : ': use a comparator or air gauge instead.'}`), check('Gauge form', 'verify', 'Go gauges full form (Taylor principle); no-go gauges check one dimension at a time.')],
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
