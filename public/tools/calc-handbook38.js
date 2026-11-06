// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook38). SI units are explicit at each boundary.
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
    "rotor-balancing-check": (v) => {
      const w = 2 * PI * v.rpm / 60, e = v.G / w * 1000, U = e * v.mass, perm = U / 2;
      let sx = 0, sy = 0, mx = 0, my = 0;
      for (const i of [1, 2, 3]) { const mr = v['m' + i] * v['r' + i], a = rad(v['a' + i]), x = mr * Math.cos(a), y = mr * Math.sin(a); sx += x; sy += y; mx += x * v['z' + i]; my += y * v['z' + i]; }
      if (Math.hypot(sx, sy) === 0 && Math.hypot(mx, my) === 0) return invalid('Enter at least one unbalance mass.');
      const bx = -mx / v.L, by = -my / v.L, ax = -sx - bx, ay = -sy - by, UA = Math.hypot(ax, ay), UB = Math.hypot(bx, by), mA = UA / v.rA, mB = UB / v.rB;
      const angA = (deg(Math.atan2(ay, ax)) + 360) % 360, angB = (deg(Math.atan2(by, bx)) + 360) % 360, FA = UA * 1e-6 * w * w, FB = UB * 1e-6 * w * w, within = UA <= perm && UB <= perm, fits = mA <= v.mMax && mB <= v.mMax;
      const st = within ? { t: 'WITHIN GRADE', tone: 'good' } : fits ? { t: 'CORRECT AND RE-CHECK', tone: 'warn' } : { t: 'CORRECTIONS TOO LARGE', tone: 'bad' };
      return output({ e, U, perm, UA, UB, mA, mB, angA, angB, FA, FB }, 'Plane A unbalance (g·mm)', UA,
        [m('Permissible eccentricity', q(e, 'µm', 2)), m('Permissible unbalance per plane', q(perm, 'g·mm', 1)), m('Plane A unbalance / correction', `${q(UA, 'g·mm', 0)} / ${q(mA, 'g', 2)} at ${q(angA, '°', 1)}`), m('Plane B unbalance / correction', `${q(UB, 'g·mm', 0)} / ${q(mB, 'g', 2)} at ${q(angB, '°', 1)}`), m('Rotating force at A / B', `${q(FA, '', 1)} / ${q(FB, 'N', 1)}`)],
        'Rotor balancing check.', 'Rigid rotor; equal plane allocation.', {
          text: st.t, tone: st.tone,
          checks: [check('Plane A', UA <= perm ? 'pass' : 'warn', `${q(UA, 'g·mm', 0)} against ${q(perm, 'g·mm', 0)} permitted.`), check('Plane B', UB <= perm ? 'pass' : 'warn', `${q(UB, 'g·mm', 0)} against ${q(perm, 'g·mm', 0)} permitted.`), check('Correction size', fits ? 'pass' : 'fail', fits ? 'Corrections fit within your largest weight.' : 'A correction exceeds your largest weight: use a larger radius or split the weight.')],
        });
    },
    "gear-tooth-measurement": (v) => {
      if (v.jnMax < v.jnMin) return invalid('The largest backlash must not be below the smallest.');
      const inv = (a) => Math.tan(a) - a, an = rad(v.alphan), b = rad(v.beta), at = Math.atan(Math.tan(an) / Math.cos(b));
      const k = Math.max(2, Math.round(v.z / PI * (Math.sqrt((1 + 2 * v.x / v.z) ** 2 - Math.cos(at) ** 2) / Math.cos(at) - inv(at) - 2 * v.x * Math.tan(an) / v.z) + 0.5));
      const W = v.mn * Math.cos(an) * (PI * (k - 0.5) + v.z * inv(at)) + 2 * v.x * v.mn * Math.sin(an), need = W * Math.sin(b) * Math.cos(an), sh = v.share / 100;
      const Wmax = W - sh * v.jnMin, Wmin = W - sh * v.jnMax, thinMin = sh * v.jnMin / Math.cos(an), thinMax = sh * v.jnMax / Math.cos(an);
      const spur = v.beta === 0, dp = v.dp || 1.728 * v.mn;
      const over = (thin) => { const al = an, d = v.mn * v.z, db = d * Math.cos(al), s = v.mn * (PI / 2 + 2 * v.x * Math.tan(al)) - thin, target = s / d + inv(al) + dp / db - PI / v.z; if (target <= 0) return null; let phi = Math.max(0.1, Math.cbrt(3 * target)); for (let i = 0; i < 60; i++) { const fv = inv(phi) - target; phi -= fv / Math.tan(phi) ** 2; if (Math.abs(fv) < 1e-15) break; } return (v.z % 2 === 0 ? db / Math.cos(phi) : db / Math.cos(phi) * Math.cos(PI / (2 * v.z))) + dp; };
      const M = spur ? over(0) : null, Mmax = spur ? over(thinMin) : null, Mmin = spur ? over(thinMax) : null;
      if (spur && (M === null || Mmin === null)) return invalid('The pin is too small for this tooth space.');
      const okB = spur || v.b > need;
      return output({ k, W, Wmax, Wmin, need, thinMin, thinMax, dp, M: M ?? 0, Mmax: Mmax ?? 0, Mmin: Mmin ?? 0 }, 'Nominal span W (mm)', W,
        [m('Teeth spanned', q(k, '', 0)), m('Span: nominal', q(W, 'mm', 4)), m('Span limits for the backlash', `${q(Wmin, '', 4)} – ${q(Wmax, 'mm', 4)}`), m('Tooth thinning (normal)', `${q(thinMin, '', 4)} – ${q(thinMax, 'mm', 4)}`), ...(spur ? [m('Pin diameter', q(dp, 'mm', 3)), m('Over pins: nominal', q(M, 'mm', 4)), m('Over pins limits', `${q(Mmin, '', 4)} – ${q(Mmax, 'mm', 4)}`)] : [m('Face width for the anvils', q(need, 'mm', 2))])],
        `Span over ${k} teeth.`, 'External involute gear.', {
          text: okB ? 'MEASUREMENT SET' : 'SPAN NOT MEASURABLE', tone: okB ? 'good' : 'bad',
          checks: [check('Anvils fit across the face', okB ? 'pass' : 'fail', spur ? 'Spur gear.' : `Face width ${q(v.b, 'mm', 1)} against ${q(need, 'mm', 2)} needed.`), check('Backlash share', 'verify', 'Agree the split of backlash between pinion and gear on both drawings.')],
        });
    },
    "thread-wire-inspection": (v) => {
      if (v.d2max < v.d2min) return invalid('The largest pitch diameter must not be below the smallest.');
      const a = rad(Number(v.angle) / 2), best = (v.P / 2) / Math.cos(a), W = v.W || best, k = W * (1 + 1 / Math.sin(a)) - (v.P / 2) / Math.tan(a), Mmax = v.d2max + k, Mmin = v.d2min + k, E = v.Mmeas - k, ok = E <= v.d2max && E >= v.d2min;
      const ratio = W / v.P, lo = { 60: 0.505, 55: 0.505, 29: 0.487, 30: 0.487 }[v.angle], hi = { 60: 1.01, 55: 0.9, 29: 0.65, 30: 0.65 }[v.angle];
      return output({ best, W, k, Mmax, Mmin, E, dev: E - (v.d2max + v.d2min) / 2 }, 'Pitch diameter from the reading (mm)', E,
        [m('Best wire size', q(best, 'mm', 4)), m('Wire constant', q(k, 'mm', 4)), m('Over-wire limits', `${q(Mmin, '', 4)} – ${q(Mmax, 'mm', 4)}`), m('Pitch diameter from the reading', q(E, 'mm', 4)), m('Position in the tolerance', q((E - v.d2min) / (v.d2max - v.d2min || 1) * 100, '%', 0))],
        'Three-wire inspection.', 'No lead-angle correction.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch diameter', ok ? 'pass' : 'fail', ok ? 'Within the limits.' : E > v.d2max ? 'Oversize: the thread is too full.' : 'Undersize: the thread is too thin.'), check('Wire size', ratio >= lo && ratio <= hi ? 'pass' : 'warn', `Wire = ${q(ratio, '', 3)} × pitch.`)],
        });
    },
    "torsion-bar-design": (v) => {
      const T = v.F * v.arm, G = v.G * 1000, thR = rad(v.thMax), dS = Math.cbrt(16 * T / (PI * v.allow)), dT = Math.pow(32 * T * v.L / (PI * G * thR), 0.25), dReq = Math.max(dS, dT);
      const J = PI * v.d ** 4 / 32, th = T * v.L / (G * J), rate = G * J / v.L, tau = 16 * T / (PI * v.d ** 3), E = T * th / 2 / 1000, okS = tau <= v.allow, okT = th <= thR, ok = okS && okT;
      return output({ T, dS, dT, dReq, tau, deg: deg(th), rate, tip: v.arm * th, E }, 'Diameter needed (mm)', dReq,
        [m('Torque', q(T / 1000, 'N·m', 1)), m('Diameter for stress / for twist', `${q(dS, '', 2)} / ${q(dT, 'mm', 2)}`), m('Diameter needed', q(dReq, 'mm', 2)), m('Shear stress (chosen bar)', q(tau, 'MPa', 0)), m('Twist (chosen bar)', q(deg(th), '°', 2)), m('Rate', q(rate / 1000 * PI / 180, 'N·m/°', 3)), m('Arm-tip travel', q(v.arm * th, 'mm', 1)), m('Energy stored', q(E, 'J', 1))],
        'Torsion bar design.', 'Solid round bar; static.', {
          text: ok ? 'BAR ADEQUATE' : 'BAR NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Shear stress', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Twist', okT ? 'pass' : 'fail', `${q(deg(th), '°', 2)} against ${q(v.thMax, '°', 1)}.`), check('Ends', 'verify', 'Check the splined or hexagon ends and the transition radius.')],
        });
    },
    "tube-bending-plan": (v) => {
      if (v.R <= v.D / 2) return invalid('The centreline radius must exceed half the tube diameter.');
      if (2 * v.t >= v.D) return invalid('The wall is too thick for the diameter.');
      const perBend = PI * v.R * v.angle / 180, length = v.straight + v.bends * perBend, tout = v.t * v.R / (v.R + v.D / 2), tin = v.t * v.R / (v.R - v.D / 2), pct = 100 * (v.t - tout) / v.t;
      const strain = 100 * (v.D / 2) / v.R, RD = v.R / v.D, Dt = v.D / v.t, bendTo = v.angle * (1 + v.spring / 100), okW = tout >= v.tmin, okR = RD >= v.RDmin, okE = strain <= v.elong, ok = okW && okR && okE;
      return output({ perBend, length, tout, tin, pct, strain, RD, Dt, bendTo }, 'Developed length (mm)', length,
        [m('Arc length per bend', q(perBend, 'mm', 1)), m('Developed (cut) length', q(length, 'mm', 1)), m('Outer / inner wall after bending', `${q(tout, '', 3)} / ${q(tin, 'mm', 3)}`), m('Outer wall thinning', q(pct, '%', 1)), m('Outer-fibre strain', q(strain, '%', 1)), m('Bend radius ÷ diameter', q(RD, '', 2)), m('Diameter ÷ wall', q(Dt, '', 1)), m('Bend to', q(bendTo, '°', 1))],
        'Tube bending plan.', 'Simple thinning; no ovality.', {
          text: ok ? 'BEND FEASIBLE' : 'BEND NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Outer wall', okW ? 'pass' : 'fail', `${q(tout, 'mm', 3)} against ${q(v.tmin, 'mm', 2)}.`), check('Bend radius', okR ? 'pass' : 'fail', `${q(RD, '', 2)} × D against ${q(v.RDmin, '', 2)} × D.`), check('Strain', okE ? 'pass' : 'fail', `${q(strain, '%', 1)} against ${q(v.elong, '%', 0)} elongation.`), check('Mandrel', Dt > 20 && RD < 2 ? 'warn' : 'pass', Dt > 20 && RD < 2 ? 'Thin wall at a tight radius: use a mandrel and wiper die.' : 'Proportions suit ordinary tooling.')],
        });
    },
    "shaft-deflection-check": (v) => {
      const L = v.L, I = PI * v.d ** 4 / 64, EI = v.E * 1000 * I, loads = [[v.P1, v.a1], [v.P2, v.a2], [v.P3, v.a3]].filter((x) => x[0] !== 0);
      if (!loads.length) return invalid('Enter at least one load.');
      if (loads.some(([, a]) => a <= 0 || a >= L)) return invalid('Each load must lie between the bearings.');
      const y = (x) => loads.reduce((s, [P, a]) => { const b = L - a; return s + (x <= a ? P * b * x * (L * L - b * b - x * x) : P * a * (L - x) * (2 * L * x - a * a - x * x)) / (6 * EI * L); }, 0);
      const RA = loads.reduce((s, [P, a]) => s + P * (L - a) / L, 0), RB = loads.reduce((s, [P, a]) => s + P * a / L, 0);
      const Mx = (x) => RA * x - loads.reduce((s, [P, a]) => s + (x > a ? P * (x - a) : 0), 0), Mmax = Math.max(...loads.map(([, a]) => Math.abs(Mx(a)))), sigma = 32 * Mmax / (PI * v.d ** 3);
      let yMaxAll = 0; for (let k = 1; k < 1000; k++) yMaxAll = Math.max(yMaxAll, Math.abs(y(L * k / 1000)));
      const ys = loads.map(([, a]) => Math.abs(y(a))), thA = Math.abs(loads.reduce((s, [P, a]) => { const b = L - a; return s + P * b * (L * L - b * b); }, 0) / (6 * EI * L)), thB = Math.abs(loads.reduce((s, [P, a]) => s + P * a * (L * L - a * a), 0) / (6 * EI * L));
      const okY = Math.max(...ys) <= v.yMax, okS = Math.max(thA, thB) <= v.slMax, okB = sigma <= v.allow, ok = okY && okS && okB;
      return output({ RA, RB, Mmax, sigma, y1: ys[0], yMaxAll, thA, thB }, 'Largest deflection (mm)', yMaxAll,
        [m('Reactions A / B', `${q(RA, '', 0)} / ${q(RB, 'N', 0)}`), m('Largest bending moment', q(Mmax / 1000, 'N·m', 1)), m('Bending stress', q(sigma, 'MPa', 1)), ...ys.map((yy, k) => m(`Deflection at load ${k + 1}`, q(yy, 'mm', 4))), m('Largest deflection along the span', q(yMaxAll, 'mm', 4)), m('Slope at A / B', `${q(thA * 1000, '', 3)} / ${q(thB * 1000, 'mrad', 3)}`)],
        'Shaft deflection check.', 'Uniform shaft; simple supports; one plane.', {
          text: ok ? 'SHAFT STIFF ENOUGH' : 'SHAFT TOO FLEXIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Deflection at the loads', okY ? 'pass' : 'fail', `${q(Math.max(...ys), 'mm', 4)} against ${q(v.yMax, 'mm', 3)}.`), check('Bearing slope', okS ? 'pass' : 'fail', `${q(Math.max(thA, thB) * 1000, 'mrad', 3)} against ${q(v.slMax * 1000, 'mrad', 2)}.`), check('Bending stress', okB ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`)],
        });
    },
    "electroplating-plan": (v) => {
      if (v.Jmax <= v.Jmin) return invalid('The high end of the current-density window must exceed the low end.');
      const D = { ni: [58.693, 2, 8.908], cu: [63.546, 2, 8.96], cucn: [63.546, 1, 8.96], zn: [65.38, 2, 7.134], cr: [51.996, 6, 7.19], sn: [118.71, 2, 7.287], ag: [107.868, 1, 10.49], au: [196.967, 1, 19.3] }[v.metal];
      const area = v.ap * v.np, Jm2 = v.J * 100, massRate = Jm2 * (v.eff / 100) * D[0] / (D[1] * 96485.33), rate = massRate / (D[2] * 1e6) * 1e6 * 60, minutes = v.thick / rate, I = v.J * area, massLoad = massRate * (area / 100) * minutes * 60;
      const loads = Math.ceil(v.batch / v.np - 1e-9), hours = loads * (minutes + v.handle) / 60, kWh = v.V * I * minutes / 60 / 1000 * loads, metal = massLoad * loads / 1000, cost = (metal * v.pM + kWh * v.pE + hours * v.rate) / v.batch;
      const okI = I <= v.rect, okJ = v.J >= v.Jmin && v.J <= v.Jmax, ok = okI && okJ;
      return output({ rate, minutes, I, mass: massLoad, loads, hours, kWh, metal, cost }, 'Plating time per load (min)', minutes,
        [m('Deposition rate', q(rate, 'µm/min', 4)), m('Time to thickness', q(minutes, 'min', 1)), m('Current per load', q(I, 'A', 1)), m('Metal per load', q(massLoad, 'g', 1)), m('Loads for the batch', q(loads, '', 0)), m('Line hours', q(hours, 'h', 1)), m('Energy for the batch', q(kWh, 'kWh', 1)), m('Cost per part', money(cost))],
        'Electroplating plan.', 'Faraday’s law; average thickness.', {
          text: ok ? 'PLAN FEASIBLE' : 'PLAN NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Rectifier', okI ? 'pass' : 'fail', `${q(I, 'A', 0)} against ${q(v.rect, 'A', 0)}.`), check('Current density', okJ ? 'pass' : 'fail', `${q(v.J, 'A/dm²', 1)} against ${q(v.Jmin, '', 1)}–${q(v.Jmax, 'A/dm²', 1)}.`), check('Thickness distribution', 'verify', 'Measure at the significant surface; use shields or auxiliary anodes for deep recesses.')],
        });
    },
    "bracket-bolt-tension": (v) => {
      const rows = [1, 2, 3, 4].map((i) => [v['y' + i], v['n' + i]]).filter(([, n]) => n > 0), nb = rows.reduce((s, [, n]) => s + n, 0), sy2 = rows.reduce((s, [y, n]) => s + n * y * y, 0);
      if (!nb) return invalid('Enter at least one bolt row.');
      if (sy2 === 0) return invalid('At least one row must be above the pivot edge.');
      const F = v.P * 1000, M = F * v.e, ymax = Math.max(...rows.map(([y]) => y)), Tmax = M * ymax / sy2, V = F / nb, As = PI / 4 * (v.d - 0.938194 * v.pitch) ** 2, sig = Tmax / As, tau = V / (PI * v.d * v.d / 4), R = (sig / v.sA) ** 2 + (tau / v.tA) ** 2;
      const okT = sig <= v.sA, okV = tau <= v.tA, okR = R <= 1, ok = okT && okV && okR;
      return output({ M, sy2, Tmax, V, As, sig, tau, R, nb }, 'Interaction ratio', R,
        [m('Moment', q(M / 1e6, 'kN·m', 2)), m('Bolts', q(nb, '', 0)), m('Tension in the top bolts', q(Tmax / 1000, 'kN', 2)), m('Shear per bolt', q(V / 1000, 'kN', 2)), m('Tensile stress (stress area)', q(sig, 'MPa', 1)), m('Shear stress (shank)', q(tau, 'MPa', 1)), m('Interaction', q(R, '', 3))],
        'Bracket bolt check.', 'Rigid bracket pivoting about its bottom edge.', {
          text: ok ? 'BOLTS ADEQUATE' : 'BOLTS OVERSTRESSED', tone: ok ? 'good' : 'bad',
          table: tbl('Bolt rows', ['Row height', 'Bolts', 'Tension per bolt'], rows.map(([y, n]) => [q(y, 'mm', 0), q(n, '', 0), q(M * y / sy2 / 1000, 'kN', 2)])),
          checks: [check('Tension', okT ? 'pass' : 'fail', `${q(sig, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Shear', okV ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tA, 'MPa', 0)}.`), check('Combined', okR ? 'pass' : 'fail', `${q(R, '', 3)} against 1.`), check('Prying', 'verify', 'A thin flange adds prying force to the top bolts: keep the flange stiff or allow for it.')],
        });
    },
    "gear-centre-distance-design": (v) => {
      const inv = (a) => Math.tan(a) - a, al = rad(v.alpha), a0 = v.m * (v.z1 + v.z2) / 2, c = a0 * Math.cos(al) / v.aw;
      if (c >= 1) return invalid('The centre distance is too small for these gears.');
      const aw = Math.acos(c), xsum = (inv(aw) - inv(al)) * (v.z1 + v.z2) / (2 * Math.tan(al)), x1 = xsum * v.share / 100, x2 = xsum - x1, y = (v.aw - a0) / v.m, ky = v.short === 'yes' ? xsum - y : 0;
      const ra1 = v.m * (v.z1 / 2 + 1 + x1 - ky), ra2 = v.m * (v.z2 / 2 + 1 + x2 - ky), rb1 = v.m * v.z1 * Math.cos(al) / 2, rb2 = v.m * v.z2 * Math.cos(al) / 2;
      const L = Math.sqrt(ra1 ** 2 - rb1 ** 2) + Math.sqrt(ra2 ** 2 - rb2 ** 2) - v.aw * Math.sin(aw), pb = PI * v.m * Math.cos(al), eps = L / pb, lim = (z) => 1 - z * Math.sin(al) ** 2 / 2;
      const u1 = x1 >= lim(v.z1), u2 = x2 >= lim(v.z2), okE = eps >= v.epsMin, ok = u1 && u2 && okE;
      return output({ a0, awDeg: deg(aw), xsum, x1, x2, y, ky, da1: 2 * ra1, da2: 2 * ra2, eps }, 'Total profile shift Σx', xsum,
        [m('Standard centre distance', q(a0, 'mm', 3)), m('Working pressure angle', q(deg(aw), '°', 3)), m('Total shift / pinion / gear', `${q(xsum, '', 4)} / ${q(x1, '', 4)} / ${q(x2, '', 4)}`), m('Tip shortening coefficient', q(ky, '', 4)), m('Tip diameters', `${q(2 * ra1, '', 3)} / ${q(2 * ra2, 'mm', 3)}`), m('Contact ratio', q(eps, '', 3))],
        'Gear pair to a centre distance.', 'External spur gears.', {
          text: ok ? 'GEAR PAIR FEASIBLE' : 'REVISE THE SHIFTS', tone: ok ? 'good' : 'bad',
          checks: [check('Pinion undercut', u1 ? 'pass' : 'fail', `x₁ = ${q(x1, '', 3)} against ${q(lim(v.z1), '', 3)} needed.`), check('Gear undercut', u2 ? 'pass' : 'fail', `x₂ = ${q(x2, '', 3)} against ${q(lim(v.z2), '', 3)} needed.`), check('Contact ratio', okE ? 'pass' : 'fail', `${q(eps, '', 3)} against ${q(v.epsMin, '', 2)}.`), check('Tip thickness', 'verify', 'Check the tips are not pointed at large positive shifts.')],
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
