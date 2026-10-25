// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook19). SI units are explicit at each boundary.
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
    "uniform-acceleration": (v) => {
      const g = 9.80665; let vf, s, a, t;
      if (v.mode === 'time') { a = v.a; t = v.t; vf = v.u + a * t; s = v.u * t + a * t * t / 2; }
      else if (v.mode === 'distance') { s = v.s; vf = v.v; if (v.u + vf <= 0) return invalid('The initial and final velocities cannot both be zero.'); a = (vf * vf - v.u * v.u) / (2 * s); t = 2 * s / (v.u + vf); }
      else { a = g; s = v.h; vf = Math.sqrt(v.u * v.u + 2 * g * v.h); t = (vf - v.u) / g; }
      const reversed = vf < 0;
      return output({ v: vf, s, a, t }, 'Final velocity (m/s)', vf,
        [m('Final velocity', q(vf, 'm/s', 3)), m('Final velocity', q(vf * 3.6, 'km/h', 2)), m('Distance', q(s, 'm', 3)), m('Acceleration', q(a, 'm/s²', 3)), m('Time', q(t, 's', 3))],
        'Constant-acceleration motion.', 'Constant acceleration; no drag.', {
          checks: [check('Direction', reversed ? 'warn' : 'pass', reversed ? 'The body has reversed direction during the time entered; it stopped at ' + q(-v.u / a, 's', 3) + '.' : 'The body keeps its direction.')],
        });
    },
    "angular-acceleration-torque": (v) => {
      const w0 = 2 * PI * v.n0 / 60, w1 = 2 * PI * v.n1 / 60, alpha = (w1 - w0) / v.t, Ta = v.J * alpha, Ttot = Ta + v.Tf, revs = (v.n0 + v.n1) / 2 * v.t / 60, E = v.J * (w1 * w1 - w0 * w0) / 2, P = Ttot * Math.max(w0, w1);
      return output({ alpha, Ta, T: Ttot, revs, E, P }, 'Total torque (N·m)', Ttot,
        [m('Angular acceleration', q(alpha, 'rad/s²', 3)), m('Accelerating torque', q(Ta, 'N·m', 3)), m('Total torque', q(Ttot, 'N·m', 3)), m('Revolutions during the change', q(revs, 'rev', 2)), m('Kinetic energy change', q(E / 1000, 'kJ', 3)), m('Peak power', q(P / 1000, 'kW', 3))],
        'Torque to accelerate the load.', 'Rigid load, constant acceleration.', {
          checks: [check('Braking', alpha < 0 ? 'warn' : 'pass', alpha < 0 ? 'The speed falls: the torque shown is a braking torque.' : 'Accelerating.')],
        });
    },
    "impulse-momentum": (v) => {
      if (v.mode === 'force') {
        const dp = v.m * (v.vf - v.v0), F = dp / v.t, dE = v.m * (v.vf * v.vf - v.v0 * v.v0) / 2;
        return output({ F, dp, dE }, 'Average force (N)', F,
          [m('Change in momentum', q(dp, 'kg·m/s', 3)), m('Average force', q(F, 'N', 3)), m('Average force', q(F / 1000, 'kN', 4)), m('Change in kinetic energy', q(dE, 'J', 3))],
          'Force from the impulse–momentum relation.', 'Average over the time entered.');
      }
      const M = v.m1 + v.m2, P = v.m1 * v.v1 + v.m2 * v.v2, rel = v.v1 - v.v2;
      const v1p = (P - v.m2 * v.e * rel) / M, v2p = (P + v.m1 * v.e * rel) / M;
      const E0 = (v.m1 * v.v1 ** 2 + v.m2 * v.v2 ** 2) / 2, E1 = (v.m1 * v1p ** 2 + v.m2 * v2p ** 2) / 2, loss = E0 - E1;
      return output({ v1p, v2p, P, loss }, 'Velocity of body 2 after impact (m/s)', v2p,
        [m('Body 1 after impact', q(v1p, 'm/s', 4)), m('Body 2 after impact', q(v2p, 'm/s', 4)), m('Total momentum', q(P, 'kg·m/s', 3)), m('Kinetic energy lost', q(loss, 'J', 3)), m('Share of energy lost', q(E0 > 0 ? loss / E0 * 100 : 0, '%', 1))],
        'Velocities after a direct central impact.', 'Direct central impact.', {
          checks: [check('Approach', rel > 0 ? 'pass' : 'fail', rel > 0 ? 'The bodies approach each other.' : 'With these velocities the bodies do not meet.')],
        });
    },
    "pendulum-period": (v) => {
      const g = 9.80665; let T, Leq = null;
      if (v.type === 'simple') { T = 2 * PI * Math.sqrt(v.L / g); Leq = v.L; }
      else if (v.type === 'compound') { if (v.k0 < v.rcg) return invalid('The radius of gyration about the pivot cannot be less than the pivot-to-centre-of-gravity distance.'); Leq = v.k0 * v.k0 / v.rcg; T = 2 * PI * Math.sqrt(Leq / g); }
      else if (v.type === 'conical') T = 2 * PI * Math.sqrt(v.L * Math.cos(rad(v.theta)) / g);
      else { const J = v.M * v.Rd * v.Rd / 2, k = v.G * 1e9 * PI * (v.d / 1000) ** 4 / (32 * v.L); T = 2 * PI * Math.sqrt(J / k); }
      const swing = v.type === 'simple' || v.type === 'compound', th = rad(v.amp), Tc = swing ? T * (1 + th * th / 16) : T;
      const metrics = [m('Period (small amplitude)', q(T, 's', 4)), m('Period corrected for amplitude', q(Tc, 's', 4)), m('Frequency', q(1 / Tc, 'Hz', 4))];
      if (Leq !== null) metrics.push(m('Equivalent simple-pendulum length', q(Leq, 'm', 4)));
      return output({ T, Tc, f: 1 / Tc }, 'Period (s)', Tc, metrics, 'Pendulum period.', 'Undamped; small to moderate amplitude.', {
        checks: [check('Amplitude', !swing || v.amp <= 22 ? 'pass' : 'warn', !swing ? 'Not applicable.' : v.amp <= 22 ? 'Small-angle formula within about 1%.' : 'Large swing: the corrected period is approximate.')],
      });
    },
    "flyball-governor": (v) => {
      if (v.nmax <= v.nmin) return invalid('The maximum speed must exceed the minimum speed.');
      const g = 9.80665, k = (v.c + v.w) / v.w, hAt = (n) => g / (2 * PI * n / 60) ** 2 * k;
      const h = hAt(v.n), dh = hAt(v.nmin) - hAt(v.nmax), mean = (v.nmax + v.nmin) / 2, C = (v.nmax - v.nmin) / mean;
      return output({ h, dh, C }, 'Governor height (mm)', h * 1000,
        [m('Governor height at speed', q(h * 1000, 'mm', 2)), m('Height at minimum speed', q(hAt(v.nmin) * 1000, 'mm', 2)), m('Height at maximum speed', q(hAt(v.nmax) * 1000, 'mm', 2)), m('Sleeve height change', q(dh * 1000, 'mm', 2)), m('Coefficient of speed variation', q(C, '', 4)), m('Load factor (c + w) ÷ w', q(k, '', 3))],
        'Fly-ball governor height and sensitivity.', 'Frictionless, symmetric governor.');
    },
    "geneva-mechanism": (v) => {
      const lam = Math.sin(PI / v.n), a = v.C * lam, b = v.C * Math.cos(PI / v.n), slot = a + b - v.C + v.roller / 2;
      const idxDeg = 180 - 360 / v.n, period = 60 / v.rpm, tIndex = idxDeg / 360 * period, tDwell = period - tIndex, ratio = lam / (1 - lam);
      return output({ a, b, slot, tIndex, tDwell, ratio }, 'Crank radius (mm)', a,
        [m('Crank radius', q(a, 'mm', 3)), m('Wheel radius to slot mouth', q(b, 'mm', 3)), m('Minimum slot length incl. roller radius', q(slot, 'mm', 2)), m('Wheel index per step', q(360 / v.n, '°', 2)), m('Driver angle while indexing', q(idxDeg, '°', 2)), m('Index time', q(tIndex, 's', 4)), m('Dwell time', q(tDwell, 's', 4)), m('Peak wheel speed', q(ratio * v.rpm, 'rpm', 1))],
        'Geneva drive geometry and timing.', 'Ideal geometry; no clearances.', {
          checks: [check('Slot width', 'verify', `Make the slots a sliding fit on the ${q(v.roller, 'mm', 1)} roller.`), check('Entry shock', v.n <= 4 ? 'warn' : 'pass', v.n <= 4 ? 'Few slots give high acceleration; check the load inertia.' : 'Moderate accelerations.')],
        });
    },
    "gyroscope-precession": (v) => {
      const J = v.shape === 'disc' ? v.M * v.R * v.R / 2 : v.shape === 'ring' ? v.M * v.R * v.R : v.J;
      const ws = 2 * PI * v.ns / 60, wp = 2 * PI * v.np / 60, H = J * ws, Tg = H * wp, F = Tg / (v.L / 1000);
      return output({ J, H, Tg, F }, 'Gyroscopic couple (N·m)', Tg,
        [m('Moment of inertia', q(J, 'kg·m²', 4)), m('Angular momentum', q(H, 'kg·m²/s', 3)), m('Gyroscopic couple', q(Tg, 'N·m', 3)), m('Bearing reaction (each, opposite)', q(F, 'N', 2))],
        'Gyroscopic couple from steady precession.', 'Steady precession at right angles.');
    },
    "prony-brake": (v) => {
      const W = v.tare - v.zero; if (W <= 0) return invalid('The scale reading must exceed the zero reading.');
      const T = W * v.L, P = 2 * PI * v.n / 60 * T;
      return output({ W, T, P }, 'Power absorbed (kW)', P / 1000,
        [m('Brake reading', q(W, 'N', 2)), m('Torque', q(T, 'N·m', 3)), m('Power absorbed', q(P / 1000, 'kW', 4)), m('Power absorbed', q(P / 745.7, 'hp', 3)), m('Heat to remove', q(P * 3.6, 'kJ/h', 0))],
        'Power measured by the brake.', 'Steady running.');
    },
    "catenary-cable": (v) => {
      if (v.d >= v.S) return invalid('Use a sag smaller than the span for this method.');
      const f = (a) => a * (Math.cosh(v.S / (2 * a)) - 1) - v.d;
      let lo = v.S / 1400, hi = v.S * v.S / v.d; // f(lo) > 0, f(hi) < 0
      for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
      const a = (lo + hi) / 2, H = v.w * a, Tmax = v.w * (a + v.d), L = 2 * a * Math.sinh(v.S / (2 * a)), ang = deg(Math.atan(Math.sinh(v.S / (2 * a)))), Hp = v.w * v.S * v.S / (8 * v.d);
      return output({ a, H, Tmax, L, ang, Hp }, 'Maximum tension (N)', Tmax,
        [m('Catenary parameter a', q(a, 'm', 4)), m('Horizontal tension', q(H, 'N', 1)), m('Maximum tension at supports', q(Tmax, 'N', 1)), m('Cable length', q(L, 'm', 4)), m('Angle at supports', q(ang, '°', 2)), m('Parabolic estimate of H', q(Hp, 'N', 1))],
        'Catenary of a uniform hanging cable.', 'Level supports; uniform inextensible cable.');
    },
    "rolling-resistance": (v) => {
      const F = v.W * v.f / v.r, P = F * v.v, Fs = v.mu * v.W;
      return output({ F, P, Fs }, 'Rolling resistance (N)', F,
        [m('Rolling resistance', q(F, 'N', 2)), m('Equivalent friction coefficient', q(v.f / v.r, '', 5)), m('Power at the speed', q(P, 'W', 2)), m('Sliding force for comparison', q(Fs, 'N', 1)), m('Sliding ÷ rolling', q(F > 0 ? Fs / F : 0, '×', 1))],
        'Force to keep the load rolling.', 'Level, steady rolling.');
    },
    "rotating-balance-plane": (v) => {
      let ux = 0, uy = 0;
      for (const i of [1, 2, 3, 4]) { const mr = v['m' + i] * v['r' + i], a = rad(v['a' + i]); ux += mr * Math.cos(a); uy += mr * Math.sin(a); }
      const U = Math.hypot(ux, uy); if (U === 0) return invalid('The masses entered are already in balance (or none were entered).');
      const ang = (deg(Math.atan2(uy, ux)) + 360) % 360, ac = (ang + 180) % 360, mc = U / v.rc, F = U * 1e-6 * (2 * PI * v.rpm / 60) ** 2;
      return output({ U, ang, mc, ac, F }, 'Counterweight mass (g)', mc,
        [m('Resultant unbalance', q(U, 'g·mm', 1)), m('Resultant direction', q(ang, '°', 2)), m('Counterweight mass', q(mc, 'g', 3)), m('Counterweight angle', q(ac, '°', 2)), m('Unbalance force before correction', q(F, 'N', 2))],
        'Single-plane counterbalance.', 'Single plane of rotation.');
    },
    "two-plane-balance": (v) => {
      let sx = 0, sy = 0, mx = 0, my = 0;
      for (const i of [1, 2, 3]) { const mr = v['m' + i] * v['r' + i], a = rad(v['a' + i]), x = mr * Math.cos(a), y = mr * Math.sin(a); sx += x; sy += y; mx += x * v['z' + i]; my += y * v['z' + i]; }
      if (Math.hypot(sx, sy) === 0 && Math.hypot(mx, my) === 0) return invalid('The masses entered are already in balance (or none were entered).');
      const bx = -mx / v.L, by = -my / v.L, ax = -sx - bx, ay = -sy - by;
      const UA = Math.hypot(ax, ay), UB = Math.hypot(bx, by), mA = UA / v.rA, mB = UB / v.rB, angA = (deg(Math.atan2(ay, ax)) + 360) % 360, angB = (deg(Math.atan2(by, bx)) + 360) % 360;
      return output({ UA, UB, mA, mB, angA, angB }, 'Correction mass in plane A (g)', mA,
        [m('Plane A correction mass', q(mA, 'g', 3)), m('Plane A angle', q(angA, '°', 2)), m('Plane B correction mass', q(mB, 'g', 3)), m('Plane B angle', q(angB, '°', 2)), m('Static unbalance', q(Math.hypot(sx, sy), 'g·mm', 1))],
        'Two-plane balance corrections.', 'Rigid rotor.');
    },
    "torsional-vibration": (v) => {
      if (v.kMode === 'shaft' && v.di >= v.d) return invalid('The bore must be smaller than the outside diameter.');
      const K = v.kMode === 'shaft' ? v.G * 1e9 * PI * ((v.d / 1000) ** 4 - (v.di / 1000) ** 4) / 32 / (v.Ls / 1000) : v.K;
      const Jeff = v.mode === 'two' ? v.J1 * v.J2 / (v.J1 + v.J2) : v.J2, fn = Math.sqrt(K / Jeff) / (2 * PI), ratio = fn / v.bw;
      return output({ K, Jeff, fn, ratio }, 'Natural frequency (Hz)', fn,
        [m('Torsional stiffness', q(K, 'N·m/rad', 1)), m('Effective inertia', q(Jeff, 'kg·m²', 5)), m('Natural frequency', q(fn, 'Hz', 2)), m('Natural frequency ÷ bandwidth', q(ratio, '', 2))],
        'Torsional natural frequency.', 'Lumped two-inertia model.', {
          text: ratio > 1 ? 'ABOVE BANDWIDTH' : 'WITHIN BANDWIDTH', tone: ratio > 1 ? 'good' : 'bad',
          checks: [check('Resonance against bandwidth', ratio > 1 ? 'pass' : 'fail', ratio > 1 ? 'The resonance lies above the control bandwidth.' : 'Self-sustained oscillation is likely; stiffen the drive or filter the control loop.')],
        });
    },
    "buoyancy": (v) => {
      const g = 9.80665, Vm = v.V / 1000, Fb = v.rho * g * Vm, W = v.mass * g, app = W - Fb, rhoB = v.mass / Vm, floats = rhoB < v.rho;
      return output({ Fb, W, app, rhoB }, 'Apparent weight (N)', app,
        [m('Buoyant force fully submerged', q(Fb, 'N', 2)), m('Weight in air', q(W, 'N', 2)), m('Apparent weight submerged', q(app, 'N', 2)), m('Body density', q(rhoB, 'kg/m³', 1)), m('Fraction submerged when floating', floats ? q(rhoB / v.rho * 100, '%', 1) : 'Sinks')],
        'Buoyancy by Archimedes’ principle.', 'Static fluid.', {
          text: floats ? 'FLOATS' : 'SINKS', tone: 'warn',
          checks: [check('Flotation', floats ? 'pass' : 'warn', floats ? 'The body floats.' : `The body sinks; ${q(app, 'N', 1)} is needed to hold it.`)],
        });
    },
    "wind-pressure": (v) => {
      const qd = v.rho * v.V * v.V / 2, p = v.Cd * qd, F = p * v.A, M = F * v.h;
      return output({ q: qd, p, F, M }, 'Wind force (N)', F,
        [m('Dynamic pressure', q(qd, 'Pa', 1)), m('Pressure on the surface', q(p, 'Pa', 1)), m('Pressure on the surface', q(p / 47.88026, 'lb/ft²', 2)), m('Wind force', q(F, 'N', 1)), m('Overturning moment', q(M, 'N·m', 1))],
        'Wind force on the surface.', 'Steady wind, single coefficient.');
    },
    "escaping-air-velocity": (v) => {
      const R = 287.05, Tk = v.T + 273.15, P1 = (v.p1 + ATM) * 1e5, P2 = v.p2 * 1e5;
      if (P1 <= P2) return invalid('The tank pressure must exceed the outside pressure.');
      const r = P2 / P1, k = v.k, rc = (2 / (k + 1)) ** (k / (k - 1)), choked = r < rc;
      const vFull = Math.sqrt(2 * k / (k - 1) * R * Tk * (1 - r ** ((k - 1) / k))), vSonic = Math.sqrt(2 * k * R * Tk / (k + 1)), vOr = choked ? vSonic : vFull;
      const A = area(v.d / 1000);
      const mdot = choked ? v.Cd * A * P1 * Math.sqrt(k / (R * Tk)) * (2 / (k + 1)) ** ((k + 1) / (2 * (k - 1)))
        : v.Cd * A * P1 * Math.sqrt(2 * k / ((k - 1) * R * Tk) * (r ** (2 / k) - r ** ((k + 1) / k)));
      const rhoStd = ATM * 1e5 / (R * 293.15), Q = mdot / rhoStd * 60000;
      return output({ vFull, vSonic, vOr, mdot, Q, r }, 'Velocity at the orifice (m/s)', vOr,
        [m('Pressure ratio p₂ ÷ p₁', q(r, '', 4)), m('Critical ratio', q(rc, '', 4)), m('Full-expansion velocity (handbook formula)', q(vFull, 'm/s', 1)), m('Velocity at the orifice', q(vOr, 'm/s', 1)), m('Mass flow', q(mdot * 1000, 'g/s', 3)), m('Flow at atmospheric conditions (free air)', q(Q, 'L/min', 1))],
        'Escape of compressed air.', 'Ideal gas, steady flow.', {
          checks: [check('Choked flow', choked ? 'warn' : 'pass', choked ? 'The orifice is choked: velocity is sonic and flow rises in proportion to tank pressure.' : 'Subsonic flow.')],
        });
    },
    "ratchet-wheel-pitch": (v) => {
      const F = v.Nt <= 12 ? 50 : v.Nt <= 20 ? 35 : 20, P = Math.sqrt(F * v.M * 1000 / (v.L * v.S * v.Nt)), D = P * v.Nt / PI;
      return output({ F, P, D }, 'Circular pitch (mm)', P,
        [m('Tooth-number factor F', q(F, '', 0)), m('Circular pitch at outside', q(P, 'mm', 2)), m('Outside diameter', q(D, 'mm', 1)), m('Tooth force at the outside', q(v.M * 2000 / D, 'N', 1))],
        'Ratchet wheel pitch.', 'Handbook crane-ratchet rule.');
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
