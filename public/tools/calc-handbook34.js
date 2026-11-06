// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook34). SI units are explicit at each boundary.
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
    "helical-gear-set-design": (v) => {
      const b = rad(v.beta), mt = v.mn / Math.cos(b), d1 = v.z1 * mt, d2 = v.z2 * mt, at = Math.atan(Math.tan(rad(v.alphan)) / Math.cos(b)), a = (d1 + d2) / 2, zv1 = v.z1 / Math.cos(b) ** 3, eb = v.beta > 0 ? v.b * Math.sin(b) / (PI * v.mn) : 0;
      const T1 = v.P * 1000 / (2 * PI * v.n1 / 60), Ft = 2 * T1 * 1000 / d1, Fa = Ft * Math.tan(b), Fr = Ft * Math.tan(at), V = PI * d1 * v.n1 / 60000;
      const Kv = { cast: (3.05 + V) / 3.05, cut: (6.1 + V) / 6.1, hobbed: (3.56 + Math.sqrt(V)) / 3.56, ground: Math.sqrt((5.56 + Math.sqrt(V)) / 5.56) }[v.make], sigma = Kv * Ft / (v.b * v.mn * v.Y);
      const okS = sigma <= v.allow, okE = eb >= v.ebMin;
      return output({ mt, d1, d2, a, at: deg(at), zv1, eb, T1, Ft, Fa, Fr, V, Kv, sigma }, 'Bending stress (MPa)', sigma,
        [m('Pitch diameters', `${q(d1, '', 2)} / ${q(d2, 'mm', 2)}`), m('Centre distance', q(a, 'mm', 3)), m('Virtual teeth (pinion)', q(zv1, '', 1)), m('Overlap ratio', q(eb, '', 2)), m('Pinion torque', q(T1, 'N·m', 1)), m('Tangential / axial / separating force', `${q(Ft, '', 0)} / ${q(Fa, '', 0)} / ${q(Fr, 'N', 0)}`), m('Pitch-line velocity / K_v', `${q(V, 'm/s', 2)} / ${q(Kv, '', 3)}`), m('Bending stress', q(sigma, 'MPa', 1))],
        'Helical gear set design.', 'Lewis bending in the normal plane.', {
          text: okS ? 'GEAR SET ADEQUATE' : 'TEETH OVERSTRESSED', tone: okS ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Overlap ratio', okE ? 'pass' : 'warn', okE ? `${q(eb, '', 2)} gives continuous face contact.` : `${q(eb, '', 2)} is below ${q(v.ebMin, '', 1)}: widen the face or raise the helix angle.`), check('Thrust bearings', 'verify', `Select bearings for ${q(Fa, 'N', 0)} of axial load on each shaft.`)],
        });
    },
    "bevel-gear-set-design": (v) => {
      const S = rad(v.shaft), d1a = Math.atan(Math.sin(S) / (v.z2 / v.z1 + Math.cos(S))), d2a = S - d1a, d1 = v.m * v.z1, d2 = v.m * v.z2, Re = d2 / (2 * Math.sin(d2a)), share = v.b / Re;
      if (v.b >= Re) return invalid('The face width must be shorter than the cone distance.');
      const T1 = v.P * 1000 / (2 * PI * v.n1 / 60), dm1 = d1 * (1 - 0.5 * share), Ft = 2 * T1 * 1000 / dm1, ta = Math.tan(rad(v.alphan)), Fa1 = Ft * ta * Math.sin(d1a), Fr1 = Ft * ta * Math.cos(d1a);
      const V = PI * d1 * v.n1 / 60000, Kv = { cast: (3.05 + V) / 3.05, cut: (6.1 + V) / 6.1, hobbed: (3.56 + Math.sqrt(V)) / 3.56, ground: Math.sqrt((5.56 + Math.sqrt(V)) / 5.56) }[v.make], Fto = 2 * T1 * 1000 / d1, sigma = Kv * Fto * Re / (v.b * v.m * v.Y * (Re - v.b));
      const okS = sigma <= v.allow, okF = share <= v.shareMax, ok = okS && okF;
      return output({ d1a: deg(d1a), d2a: deg(d2a), d1, d2, Re, share, T1, dm1, Ft, Fa1, Fr1, V, Kv, sigma }, 'Bending stress (MPa)', sigma,
        [m('Pitch cone angles', `${q(deg(d1a), '°', 2)} / ${q(deg(d2a), '°', 2)}`), m('Pitch diameters', `${q(d1, '', 1)} / ${q(d2, 'mm', 1)}`), m('Outer cone distance', q(Re, 'mm', 2)), m('Face width ÷ cone distance', q(share, '', 3)), m('Mean pinion diameter', q(dm1, 'mm', 2)), m('Tangential force (mean)', q(Ft, 'N', 0)), m('Pinion axial / radial force', `${q(Fa1, '', 0)} / ${q(Fr1, 'N', 0)}`), m('Gear axial / radial force', `${q(Fr1, '', 0)} / ${q(Fa1, 'N', 0)}`), m('Bending stress', q(sigma, 'MPa', 1))],
        'Straight bevel gear set design.', 'Lewis bending with the bevel correction.', {
          text: ok ? 'GEAR SET ADEQUATE' : 'GEAR SET INADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Face width', okF ? 'pass' : 'fail', `${q(share, '', 3)} of the cone distance against ${q(v.shareMax, '', 2)}.`), check('Mounting', 'verify', 'Bevel gears need rigid, adjustable mountings to keep the contact pattern central.')],
        });
    },
    "journal-bearing-design": (v) => {
      if (v.ldMax <= v.ldMin) return invalid('The largest L/D must exceed the smallest.');
      const r = v.d / 2000, Lm = v.L / 1000, c = v.c / 1000, mu = v.mu / 1000, Nn = v.rpm / 60, P = v.W / (2 * r * Lm);
      const Tf = 4 * PI * PI * r ** 3 * Lm * mu * Nn / c, f = 2 * PI * PI * (mu * Nn / P) * (r / c), S = (r / c) ** 2 * mu * Nn / P, Ploss = 2 * PI * Nn * Tf;
      const ld = v.L / v.d, V = PI * v.d * v.rpm / 60000, Qoil = Ploss / 1000 / (v.rho * v.cp / 60000 * v.dT), okP = P / 1e6 <= v.pMax, okL = ld >= v.ldMin && ld <= v.ldMax, okS = S >= v.Smin, ok = okP && okL && okS;
      return output({ p: P / 1e6, ld, V, S, Tf, f, Ploss, Qoil }, 'Sommerfeld number', S,
        [m('Unit load', q(P / 1e6, 'MPa', 3)), m('L/D', q(ld, '', 2)), m('Surface speed', q(V, 'm/s', 2)), m('Sommerfeld number', q(S, '', 4)), m('Friction torque', q(Tf, 'N·m', 4)), m('Friction coefficient', q(f, '', 5)), m('Power loss', q(Ploss, 'W', 1)), m('Oil flow to carry the heat', q(Qoil, 'L/min', 3))],
        'Journal bearing design.', 'Petroff friction for a concentric journal.', {
          text: ok ? 'BEARING ADEQUATE' : 'REVISE THE BEARING', tone: ok ? 'good' : 'bad',
          checks: [check('Unit load', okP ? 'pass' : 'fail', `${q(P / 1e6, 'MPa', 2)} against ${q(v.pMax, 'MPa', 1)}.`), check('L/D', okL ? 'pass' : 'fail', `${q(ld, '', 2)} against ${q(v.ldMin, '', 2)}–${q(v.ldMax, '', 2)}.`), check('Film', okS ? 'pass' : 'fail', okS ? `Sommerfeld number ${q(S, '', 3)} at or above ${q(v.Smin, '', 3)}.` : 'Film likely too thin: raise viscosity or speed, or reduce clearance or load.'), check('Starting', 'verify', 'Plain bearings run in mixed friction at start-up and low speed; check the material for that.')],
        });
    },
    "extension-spring-designer": (v) => {
      const C = v.D / v.d; if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const C1 = 2 * v.r1 / v.d, C2 = 2 * v.r2 / v.d; if (C1 <= 1 || C2 <= 1) return invalid('The hook radii must be larger than the wire radius.');
      if (v.tiMax <= v.tiMin) return invalid('The high end of the initial-tension range must exceed the low end.');
      const G = v.G * 1000, k = G * v.d ** 4 / (8 * v.D ** 3 * v.Na), K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, F = v.Fi + k * v.x, tau = K * 8 * F * v.D / (PI * v.d ** 3), taui = 8 * v.Fi * v.D / (PI * v.d ** 3);
      const K1 = (4 * C1 * C1 - C1 - 1) / (4 * C1 * (C1 - 1)), K2 = (4 * C2 - 1) / (4 * C2 - 4), sA = F * (K1 * 16 * v.D / (PI * v.d ** 3) + 4 / (PI * v.d * v.d)), tB = K2 * 8 * F * v.D / (PI * v.d ** 3);
      const ma = v.rhoW * PI * PI * (v.d / 1000) ** 2 * (v.D / 1000) * v.Na / 4, fn = 0.5 * Math.sqrt(k * 1000 / ma);
      const okB = tau <= v.allow, okA = sA <= v.sbA, okT = tB <= v.thA, okI = taui >= v.tiMin && taui <= v.tiMax, ok = okB && okA && okT;
      return output({ C, k, F, K, tau, taui, K1, K2, sA, tB, fn }, 'Working load (N)', F,
        [m('Spring index / Wahl factor', `${q(C, '', 2)} / ${q(K, '', 3)}`), m('Rate', q(k, 'N/mm', 3)), m('Load at the working extension', q(F, 'N', 1)), m('Body shear stress', q(tau, 'MPa', 0)), m('Hook bending stress', q(sA, 'MPa', 0)), m('Hook torsional stress', q(tB, 'MPa', 0)), m('Initial-tension stress', q(taui, 'MPa', 0)), m('Natural frequency', q(fn, 'Hz', 0))],
        'Extension spring design.', 'Static stresses; standard loop hooks.', {
          text: ok ? 'SPRING ADEQUATE' : 'SPRING OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Body stress', okB ? 'pass' : 'fail', `${q(tau, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Hook bending', okA ? 'pass' : 'fail', `${q(sA, 'MPa', 0)} against ${q(v.sbA, 'MPa', 0)}.`), check('Hook torsion', okT ? 'pass' : 'fail', `${q(tB, 'MPa', 0)} against ${q(v.thA, 'MPa', 0)}.`), check('Initial tension', okI ? 'pass' : 'warn', okI ? 'Within the range the maker can wind.' : `${q(taui, 'MPa', 0)} is outside ${q(v.tiMin, '', 0)}–${q(v.tiMax, 'MPa', 0)}: change the initial tension or the index.`)],
        });
    },
    "motor-duty-cycle-check": (v) => {
      const w = 2 * PI * v.nmax / 60, Jt = v.J + v.Jm, Ta = Jt * w / v.ta + v.Tf, Tr = v.Tf, Td = v.Tf - Jt * w / v.td, tt = v.ta + v.tr + v.td + v.tw;
      const rms = Math.sqrt((Ta * Ta * v.ta + Tr * Tr * v.tr + Td * Td * v.td + v.Th * v.Th * v.tw) / tt), peak = Math.max(Math.abs(Ta), Math.abs(Tr), Math.abs(Td), v.Th);
      const jr = v.Jm > 0 ? v.J / v.Jm : Infinity, Eregen = Math.max(Jt * w * w / 2 - v.Tf * w * v.td / 2, 0);
      const okC = rms <= v.Tc, okP = peak <= v.Tp, okN = v.nmax <= v.nMot, okJ = jr <= v.jrMax, ok = okC && okP && okN;
      return output({ w, Ta, Tr, Td, rms, peak, tt, jr: v.Jm > 0 ? jr : 0, Eregen }, 'RMS torque (N·m)', rms,
        [m('Acceleration / run / deceleration torque', `${q(Ta, '', 2)} / ${q(Tr, '', 2)} / ${q(Td, 'N·m', 2)}`), m('Cycle time', q(tt, 's', 2)), m('RMS torque', q(rms, 'N·m', 2)), m('Peak torque', q(peak, 'N·m', 2)), m('Inertia ratio', v.Jm > 0 ? q(jr, '', 2) : 'No rotor inertia entered'), m('Energy returned per stop', q(Eregen, 'J', 1))],
        'Motor duty cycle check.', 'Trapezoidal move, constant acceleration.', {
          text: ok ? 'MOTOR SUITABLE' : 'MOTOR NOT SUITABLE', tone: ok ? 'good' : 'bad',
          table: tbl('Duty cycle segments', ['Segment', 'Time', 'Torque'], [['Accelerate', q(v.ta, 's', 3), q(Ta, 'N·m', 2)], ['Run', q(v.tr, 's', 3), q(Tr, 'N·m', 2)], ['Decelerate', q(v.td, 's', 3), q(Td, 'N·m', 2)], ['Dwell', q(v.tw, 's', 3), q(v.Th, 'N·m', 2)]]),
          checks: [check('Continuous (RMS) torque', okC ? 'pass' : 'fail', `${q(rms, 'N·m', 2)} against ${q(v.Tc, 'N·m', 2)}.`), check('Peak torque', okP ? 'pass' : 'fail', `${q(peak, 'N·m', 2)} against ${q(v.Tp, 'N·m', 2)}.`), check('Speed', okN ? 'pass' : 'fail', `${q(v.nmax, 'rpm', 0)} against ${q(v.nMot, 'rpm', 0)}.`), check('Inertia ratio', okJ ? 'pass' : 'warn', okJ ? 'Within your limit.' : 'High inertia ratio: tuning will be soft; add gearing or a larger rotor.')],
        });
    },
    "timing-belt-drive-design": (v) => {
      const d = v.z1 * v.p / PI, D = v.z2 * v.p / PI, Lf = (C) => 2 * Math.sqrt(C * C - ((D - d) / 2) ** 2) + PI * (D + d) / 2 + (D - d) * Math.asin((D - d) / (2 * C));
      if (v.z2 < v.z1) return invalid('Enter the smaller pulley as the small pulley.');
      if (v.C <= (D - d) / 2 + (D + d) / 4) return invalid('The centre distance is too small for these pulleys.');
      const L = Lf(v.C), teeth = Math.round(L / v.p), Lr = teeth * v.p; let lo = (D - d) / 2 + 1e-6, hi = v.C * 3 + Lr; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (Lf(mid) < Lr) lo = mid; else hi = mid; }
      const Cx = (lo + hi) / 2, wrap = 180 - 2 * deg(Math.asin((D - d) / (2 * Cx))), mesh = v.z1 * wrap / 360, vb = PI * d * v.n1 / 60000, Fe = v.P * 1000 * v.SF / vb, bReq = Fe / v.Ta;
      const okW = v.b >= bReq, okM = mesh >= v.meshMin, okV = vb <= v.vMax, ok = okW && okM && okV;
      return output({ d, D, L, teeth, Lr, Cx, wrap, mesh, vb, Fe, bReq, ratio: v.z2 / v.z1 }, 'Belt width needed (mm)', bReq,
        [m('Pitch diameters', `${q(d, '', 2)} / ${q(D, 'mm', 2)}`), m('Ratio', q(v.z2 / v.z1, '', 3)), m('Belt', `${q(teeth, '', 0)} teeth, ${q(Lr, 'mm', 0)} pitch length`), m('Centre distance for that belt', q(Cx, 'mm', 2)), m('Teeth in mesh (small pulley)', q(mesh, '', 1)), m('Belt speed', q(vb, 'm/s', 2)), m('Effective pull with service factor', q(Fe, 'N', 0)), m('Belt width needed', q(bReq, 'mm', 1))],
        'Timing belt drive design.', 'Single allowable tension per mm.', {
          text: ok ? 'DRIVE ADEQUATE' : 'DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Belt width', okW ? 'pass' : 'fail', `${q(v.b, 'mm', 0)} chosen against ${q(bReq, 'mm', 1)} needed.`), check('Teeth in mesh', okM ? 'pass' : 'fail', `${q(mesh, '', 1)} against ${q(v.meshMin, '', 0)}.`), check('Belt speed', okV ? 'pass' : 'fail', `${q(vb, 'm/s', 1)} against ${q(v.vMax, 'm/s', 0)}.`)],
        });
    },
    "heat-exchanger-sizing": (v) => {
      if (v.Tho >= v.Thi) return invalid('The hot outlet must be cooler than the hot inlet.');
      const mh = v.Qh / 60000 * v.rhoh, mc = v.Qc / 60000 * v.rhoc, duty = mh * v.cph * (v.Thi - v.Tho), Tco = v.Tci + duty / (mc * v.cpc), c = v.flow === 'counter';
      const d1 = c ? v.Thi - Tco : v.Thi - v.Tci, d2 = c ? v.Tho - v.Tci : v.Tho - Tco;
      if (d1 <= 0 || d2 <= 0) return invalid('The temperatures cross: more cooling flow or a higher hot outlet is needed.');
      const lmtd = Math.abs(d1 - d2) < 1e-9 ? d1 : (d1 - d2) / Math.log(d1 / d2), A = duty * 1000 / (v.U * lmtd), app = Math.min(d1, d2), okA = v.Ainst >= A, okT = app >= v.appMin, ok = okA && okT;
      return output({ mh, mc, duty, Tco, d1, d2, lmtd, A, app }, 'Area needed (m²)', A,
        [m('Duty', q(duty, 'kW', 2)), m('Cold outlet temperature', q(Tco, '°C', 1)), m('End temperature differences', `${q(d1, '', 1)} / ${q(d2, 'K', 1)}`), m('LMTD', q(lmtd, 'K', 2)), m('Area needed', q(A, 'm²', 3)), m('Installed area margin', q((v.Ainst / A - 1) * 100, '%', 0))],
        'Heat exchanger sizing.', 'Pure counterflow or parallel flow.', {
          text: ok ? 'EXCHANGER ADEQUATE' : 'EXCHANGER UNDERSIZED', tone: ok ? 'good' : 'bad',
          checks: [check('Area', okA ? 'pass' : 'fail', `${q(v.Ainst, 'm²', 2)} installed against ${q(A, 'm²', 2)} needed.`), check('Approach temperature', okT ? 'pass' : 'fail', `${q(app, 'K', 1)} against ${q(v.appMin, 'K', 1)}.`), check('Fouling', 'verify', 'Make sure the coefficient includes fouling for the cooling water quality.')],
        });
    },
    "surface-grinding-planner": (v) => {
      const vs = PI * v.ds * v.ns / 60000, vwm = v.vw / 60, ratio = vs / vwm, lg = Math.sqrt(v.ae * v.ds), heq = v.ae * vwm / vs * 1000, Q = v.ae * v.bw * vwm * 1000, P = v.u * Q / 1000;
      const passes = Math.ceil(v.stock / v.ae - 1e-9) + v.spark, t = passes * (v.L + 2 * v.over) / (v.vw * 1000), Pav = v.Pm * v.eta / 100, okS = vs <= v.vsMax, okP = P <= Pav, ok = okS && okP;
      return output({ vs, ratio, lg, heq, Q, P, passes, t }, 'Grinding power (kW)', P,
        [m('Wheel speed', q(vs, 'm/s', 2)), m('Speed ratio v_s ÷ v_w', q(ratio, '', 0)), m('Contact length', q(lg, 'mm', 3)), m('Equivalent chip thickness', q(heq, 'µm', 4)), m('Removal rate', q(Q, 'mm³/s', 1)), m('Grinding power', q(P, 'kW', 2)), m('Passes (incl. spark-out)', q(passes, '', 0)), m('Grinding time', q(t, 'min', 2))],
        'Surface grinding plan.', 'Specific energy method; one stroke per pass.', {
          text: ok ? 'PLAN FEASIBLE' : 'PLAN NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Wheel speed', okS ? 'pass' : 'fail', okS ? `${q(vs, 'm/s', 1)} within the ${q(v.vsMax, 'm/s', 0)} marked maximum.` : `${q(vs, 'm/s', 1)} exceeds the ${q(v.vsMax, 'm/s', 0)} marked maximum: reduce spindle speed.`), check('Spindle power', okP ? 'pass' : 'fail', `${q(P, 'kW', 2)} against ${q(Pav, 'kW', 2)} available.`), check('Burn', 'verify', 'Watch for burn and chatter; dress the wheel and use ample coolant.')],
        });
    },
    "compression-strut-sizing": (v) => {
      const E = v.E * 1000, Cc = PI * Math.sqrt(2 * E / v.Sy), F = v.P * 1000;
      const sect = (D) => { if (v.sec === 'bar') return { A: PI * D * D / 4, I: PI * D ** 4 / 64 }; const di = D - 2 * D / v.Dt; return { A: PI * (D * D - di * di) / 4, I: PI * (D ** 4 - di ** 4) / 64 }; };
      const evalD = (D) => { const s = sect(D), r = Math.sqrt(s.I / s.A), lam = v.K * v.L / r, eu = lam >= Cc, scr = eu ? PI * PI * E / (lam * lam) : v.Sy - (v.Sy * lam / (2 * PI)) ** 2 / E; return { ...s, r, lam, eu, scr, n: scr * s.A / F }; };
      let lo = 1e-3, hi = 1e4; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (evalD(mid).n < v.SF) lo = mid; else hi = mid; }
      const Dmin = hi, c = evalD(v.Dc), ok = c.n >= v.SF, mass = c.A * 1e-6 * v.rho;
      return output({ Dmin, Cc, A: c.A, I: c.I, r: c.r, lam: c.lam, scr: c.scr, n: c.n, sig: F / c.A, mass }, 'Least outside diameter (mm)', Dmin,
        [m('Least outside diameter for the safety factor', q(Dmin, 'mm', 2)), m('Chosen size: slenderness / C_c', `${q(c.lam, '', 1)} / ${q(Cc, '', 1)}`), m('Buckling mode', c.eu ? 'Euler (slender)' : 'Johnson (intermediate)'), m('Critical stress', q(c.scr, 'MPa', 1)), m('Working stress', q(F / c.A, 'MPa', 1)), m('Safety factor of the chosen size', q(c.n, '', 2)), m('Mass per metre', q(mass, 'kg/m', 2))],
        'Compression strut sizing.', 'Concentric load; Euler or Johnson.', {
          text: ok ? 'STRUT ADEQUATE' : 'STRUT TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Buckling', ok ? 'pass' : 'fail', `Safety factor ${q(c.n, '', 2)} against ${q(v.SF, '', 1)}; at least ${q(Dmin, 'mm', 1)} needed.`), check('Local buckling', v.sec === 'tube' && v.Dt > 50 ? 'warn' : 'pass', v.sec === 'tube' && v.Dt > 50 ? 'Very thin wall: check local buckling of the tube.' : 'Wall proportions are not slender.'), check('End fixity', 'verify', 'Confirm the effective length factor matches how the ends are really held.')],
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
