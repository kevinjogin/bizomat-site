// BIZOMAT MAKEOS calculations from mechanism kinematics topics (batch norton1). SI units are explicit at each boundary.
// Methods are standard kinematic relations; no source tables, figures or recommended settings are reproduced.
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
    "linkage-mobility": (v) => {
      const planar = v.space === 'planar', M = planar ? 3 * (v.L - 1) - 2 * v.J1 - v.J2 : 6 * (v.L - 1) - 5 * v.J1 - 4 * v.J2 - 3 * v.J3 - 2 * v.J4 - v.J5;
      const kind = M > 0 ? 'MECHANISM' : M === 0 ? 'STRUCTURE' : 'PRELOADED STRUCTURE';
      return output({ M }, 'Degree of freedom M', M,
        [m('Degree of freedom M', String(M)), m('Equation', planar ? 'M = 3(L − 1) − 2J1 − J2' : 'M = 6(L − 1) − 5J1 − 4J2 − 3J3 − 2J4 − J5'), m('Inputs needed', M > 0 ? String(M) : 'none (no motion)')],
        `${planar ? 'Planar' : 'Spatial'} linkage of ${v.L} links.`, 'Gruebler and Kutzbach mobility equations as given by Norton.', {
          text: kind, tone: M === 1 ? 'good' : 'bad',
          checks: [check('Mobility', M === 1 ? 'pass' : M > 1 ? 'warn' : 'fail', M === 1 ? 'One degree of freedom: one input controls the motion.' : M > 1 ? `${M} degrees of freedom: ${M} inputs are needed for predictable motion.` : 'No motion is possible.'), check('Joint count', 'verify', 'Count multiple joints as one less than the links they join, and half joints separately.')],
        });
    },
    "fourbar-grashof-check": (v) => {
      const L4 = [['ground', v.d], ['input', v.a], ['coupler', v.b], ['output', v.c]], sorted = [...L4].sort((x, y) => x[1] - y[1]);
      const Sl = sorted[0][1], Ll = sorted[3][1], P = sorted[1][1], Q = sorted[2][1], SL = Sl + Ll, PQ = P + Q, tol = 1e-9 * Math.max(SL, PQ);
      if (Ll >= v.d + v.a + v.b + v.c - Ll) return invalid('The longest link is as long as the other three together; the linkage cannot be assembled.');
      const cls = SL < PQ - tol ? 'I' : SL > PQ + tol ? 'II' : 'III', shortest = sorted[0][0];
      const type = cls === 'II' ? 'TRIPLE-ROCKER (NON-GRASHOF)' : cls === 'III' ? 'SPECIAL-CASE GRASHOF (CHANGE POINTS)' : shortest === 'ground' ? 'DOUBLE-CRANK' : shortest === 'coupler' ? 'GRASHOF DOUBLE-ROCKER' : 'CRANK-ROCKER';
      const acos = (x) => (Math.abs(x) <= 1 + 1e-12 ? deg(Math.acos(Math.max(-1, Math.min(1, x)))) : NaN);
      const crankIn = cls === 'I' && shortest === 'input', mu1 = crankIn ? acos((v.b ** 2 + v.c ** 2 - (v.d + v.a) ** 2) / (2 * v.b * v.c)) : NaN, mu2 = crankIn ? acos((v.b ** 2 + v.c ** 2 - (v.d - v.a) ** 2) / (2 * v.b * v.c)) : NaN;
      const k = (v.a ** 2 + v.d ** 2 - v.b ** 2 - v.c ** 2) / (2 * v.a * v.d), e = v.b * v.c / (v.a * v.d), tg = cls === 'II' ? [acos(k + e), acos(k - e)].filter((x) => Number.isFinite(x)) : [];
      const muT = cls === 'II' ? acos(((v.a + v.b) ** 2 + v.c ** 2 - v.d ** 2) / (2 * v.c * (v.a + v.b))) : NaN;
      const tr = (x) => (x > 90 ? 180 - x : x), muMin = crankIn ? Math.min(tr(mu1), tr(mu2)) : NaN;
      const fin = (x) => (Number.isFinite(x) ? x : 0);
      return output({ S: Sl, L: Ll, P, Q, SL, PQ, mu1: fin(mu1), mu2: fin(mu2), muMin: fin(muMin), toggle: tg[0] ?? 0, muT: fin(muT) }, 'S + L − (P + Q) (mm)', SL - PQ,
        [m('Shortest / longest link', `${q(Sl, 'mm', 4)} (${shortest}) / ${q(Ll, 'mm', 4)} (${sorted[3][0]})`), m('S + L / P + Q', `${q(SL, 'mm', 4)} / ${q(PQ, 'mm', 4)}`), m('Grashof class', `Class ${cls}${cls === 'I' ? ' (Grashof)' : cls === 'II' ? ' (non-Grashof)' : ' (special case)'}`),
          ...(crankIn ? [m('Extreme transmission angles μ1 / μ2', `${q(mu1, '°', 4)} / ${q(mu2, '°', 4)}`), m('Smallest transmission angle', q(muMin, '°', 4))] : []),
          ...(cls === 'II' ? [m('Input toggle angles θ2', tg.length ? `±${q(tg[0], '°', 4)}` : 'none (input turns fully)'), m('Transmission angle with input and coupler in line', Number.isFinite(muT) ? q(muT, '°', 4) : 'not reached')] : [])],
        `Fourbar d = ${q(v.d, 'mm', 4)}, a = ${q(v.a, 'mm', 4)}, b = ${q(v.b, 'mm', 4)}, c = ${q(v.c, 'mm', 4)}.`, 'Norton’s Grashof condition, classification, transmission and toggle angle equations.', {
          text: type, tone: cls === 'I' ? 'good' : 'bad',
          checks: [check('Full rotation', cls === 'I' ? 'pass' : cls === 'III' ? 'warn' : 'fail', cls === 'I' ? (shortest === 'coupler' ? 'Only the coupler turns fully; both grounded links rock.' : `The shortest link (${shortest}) can turn fully.`) : cls === 'III' ? 'Links become colinear twice per turn (change points).' : 'No link can turn fully.'),
            check('Transmission angle', crankIn ? (muMin >= 40 ? 'pass' : 'warn') : 'verify', crankIn ? `Smallest transmission angle ${q(muMin, '°', 4)}; check it against your limit.` : 'Extreme transmission angles are given for a crank-rocker driven by its crank.')],
        });
    },
    "fourbar-time-ratio": (v) => {
      if (v.mode === 'design') {
        const small = 360 / (1 + v.TR), big = 360 - small, dl = Math.abs(180 - small);
        return output({ big, small, TR: v.TR, delta: dl, swing: 0 }, 'Construction angle δ (°)', dl,
          [m('Faster stroke sweep α', q(small, '°', 4)), m('Slower stroke sweep β', q(big, '°', 4)), m('Time ratio', `1:${q(v.TR, '', 4)}`), m('Construction angle δ', q(dl, '°', 4))],
          `Crank sweeps for a time ratio of 1:${q(v.TR, '', 4)}.`, 'Norton’s time ratio and construction angle equations (3.1, 3.2).', { checks: [check('Practical range', v.TR <= 1.5 ? 'pass' : 'warn', v.TR <= 1.5 ? 'Within the range Norton gives for a fourbar quick-return.' : 'Beyond about 1:1.5 consider a sixbar quick-return for better transmission angles.')] });
      }
      const sorted = [v.a, v.b, v.c, v.d].sort((x, y) => x - y);
      if (!(v.a <= sorted[0] + 1e-12 && sorted[0] + sorted[3] < sorted[1] + sorted[2])) return invalid('This is not a Grashof crank-rocker with the crank as the shortest link.');
      const ang = (r) => deg(Math.acos((r * r + v.d * v.d - v.c * v.c) / (2 * v.d * r))), rock = (r) => deg(Math.acos((v.c * v.c + v.d * v.d - r * r) / (2 * v.c * v.d)));
      const pe = ang(v.a + v.b), po = ang(v.b - v.a), dl = Math.abs(po - pe), big = 180 + dl, small = 180 - dl, swing = Math.abs(rock(v.a + v.b) - rock(v.b - v.a));
      if (![pe, po, swing].every(Number.isFinite)) return invalid('The links cannot reach the toggle positions; check the lengths.');
      return output({ big, small, TR: big / small, delta: dl, swing }, 'Time ratio (slower ÷ faster)', big / small,
        [m('Crank sweeps', `${q(big, '°', 4)} and ${q(small, '°', 4)}`), m('Time ratio', `1:${q(big / small, '', 4)}`), m('Construction angle δ', q(dl, '°', 4)), m('Rocker swing', q(swing, '°', 4))],
        'Time ratio of a Grashof crank-rocker.', 'Norton’s time ratio definitions with the toggle positions by the cosine law.', {
          checks: [check('Quick return', dl > 1e-9 ? 'pass' : 'verify', dl > 1e-9 ? `The strokes differ by ${q(2 * dl, '°', 4)} of crank rotation.` : 'Equal sweeps: no quick return.'), check('Practical range', big / small <= 1.5 ? 'pass' : 'warn', 'Norton gives about 1:1.5 as the practical limit of a fourbar quick-return.')],
        });
    },
    "fourbar-kinematics": (v) => {
      const t2 = rad(v.t2), K1 = v.d / v.a, K2 = v.d / v.c, K3 = (v.a ** 2 - v.b ** 2 + v.c ** 2 + v.d ** 2) / (2 * v.a * v.c);
      const A = Math.cos(t2) - K1 - K2 * Math.cos(t2) + K3, B = -2 * Math.sin(t2), C = K1 - (K2 + 1) * Math.cos(t2) + K3, disc = B * B - 4 * A * C;
      if (disc < -1e-12) return invalid('The links cannot be connected at this input angle (beyond a toggle position or impossible lengths).');
      const sgn = v.circ === 'open' ? -1 : 1, t4 = Math.abs(A) < 1e-14 ? 2 * Math.atan2(-C, B) : 2 * Math.atan((-B + sgn * Math.sqrt(Math.max(0, disc))) / (2 * A));
      const t3 = Math.atan2(-v.a * Math.sin(t2) + v.c * Math.sin(t4), -v.a * Math.cos(t2) + v.c * Math.cos(t4) + v.d);
      const s34 = Math.sin(t3 - t4); if (Math.abs(s34) < 1e-9) return invalid('The linkage is in a toggle position; velocities are not defined.');
      const w3 = v.a * v.w2 / v.b * Math.sin(t4 - t2) / s34, w4 = v.a * v.w2 / v.c * Math.sin(t2 - t3) / Math.sin(t4 - t3);
      const AA = v.c * Math.sin(t4), BB = v.b * Math.sin(t3), CC = v.a * v.a2 * Math.sin(t2) + v.a * v.w2 ** 2 * Math.cos(t2) + v.b * w3 ** 2 * Math.cos(t3) - v.c * w4 ** 2 * Math.cos(t4);
      const DD = v.c * Math.cos(t4), EE = v.b * Math.cos(t3), FF = v.a * v.a2 * Math.cos(t2) - v.a * v.w2 ** 2 * Math.sin(t2) - v.b * w3 ** 2 * Math.sin(t3) + v.c * w4 ** 2 * Math.sin(t4);
      const den = AA * EE - BB * DD, a3 = (CC * DD - AA * FF) / den, a4 = (CC * EE - BB * FF) / den;
      let tt = Math.abs(t3 - t4) % (2 * PI); if (tt > PI) tt = 2 * PI - tt; if (tt > PI / 2) tt = PI - tt;
      const VA = [-v.a * v.w2 * Math.sin(t2), v.a * v.w2 * Math.cos(t2)], VB = [-v.c * w4 * Math.sin(t4), v.c * w4 * Math.cos(t4)], g = t3 + rad(v.d3);
      const P = [v.a * Math.cos(t2) + v.p * Math.cos(g), v.a * Math.sin(t2) + v.p * Math.sin(g)], VP = [VA[0] - v.p * w3 * Math.sin(g), VA[1] + v.p * w3 * Math.cos(g)];
      const n360 = (x) => ((deg(x) % 360) + 360) % 360, mag = (u) => Math.hypot(u[0], u[1]);
      return output({ t3: n360(t3), t4: n360(t4), w3, w4, a3, a4, mu: deg(tt), VA: mag(VA), VB: mag(VB), Px: P[0], Py: P[1], VP: mag(VP) }, 'Output angle θ4 (°)', n360(t4),
        [m('Coupler / output angle θ3 / θ4', `${q(n360(t3), '°', 5)} / ${q(n360(t4), '°', 5)}`), m('Angular velocity ω3 / ω4', `${q(w3, 'rad/s', 5)} / ${q(w4, 'rad/s', 5)}`), m('Angular acceleration α3 / α4', `${q(a3, 'rad/s²', 5)} / ${q(a4, 'rad/s²', 5)}`), m('Transmission angle', q(deg(tt), '°', 4)),
          m('Speed of A / B', `${q(mag(VA), 'mm/s', 4)} / ${q(mag(VB), 'mm/s', 4)}`), ...(v.p > 0 ? [m('Coupler point position x / y', `${q(P[0], 'mm', 5)} / ${q(P[1], 'mm', 5)}`), m('Coupler point speed', q(mag(VP), 'mm/s', 4))] : [])],
        `Fourbar at θ2 = ${q(v.t2, '°', 4)}, ${v.circ} circuit.`, 'Norton’s analytical position, velocity and acceleration solution of the fourbar.', {
          checks: [check('Transmission angle', deg(tt) >= 40 ? 'pass' : 'warn', `Transmission angle ${q(deg(tt), '°', 4)} at this position.`), check('Circuit', 'verify', 'Check the open or crossed circuit matches how your linkage is assembled.')],
        });
    },
    "slider-crank-kinematics": (v) => {
      const t2 = rad(v.t2), s = (v.a * Math.sin(t2) - v.c) / v.b;
      if (Math.abs(s) > 1) return invalid('The connecting rod cannot reach the slide axis at this crank angle.');
      const t3 = v.circ === '1' ? Math.asin(s) : Math.asin(-s) + PI, ct3 = Math.cos(t3);
      if (Math.abs(ct3) < 1e-12) return invalid('The connecting rod is square to the slide; the motion is not defined here.');
      const d = v.a * Math.cos(t2) - v.b * ct3, w3 = v.a * Math.cos(t2) / (v.b * ct3) * v.w2, vd = -v.a * v.w2 * Math.sin(t2) + v.b * w3 * Math.sin(t3);
      const a3 = (v.a * v.a2 * Math.cos(t2) - v.a * v.w2 ** 2 * Math.sin(t2) + v.b * w3 ** 2 * Math.sin(t3)) / (v.b * ct3), ad = -v.a * v.a2 * Math.sin(t2) - v.a * v.w2 ** 2 * Math.cos(t2) + v.b * a3 * Math.sin(t3) + v.b * w3 ** 2 * ct3;
      const n360 = (x) => ((deg(x) % 360) + 360) % 360;
      return output({ t3: n360(t3), d, w3, vd, a3, ad }, 'Slider position d (mm)', d,
        [m('Connecting rod angle θ3', q(n360(t3), '°', 5)), m('Slider position d', q(d, 'mm', 5)), m('Slider velocity', `${q(vd, 'mm/s', 5)} (${q(vd / 1000, 'm/s', 4)})`), m('Slider acceleration', `${q(ad, 'mm/s²', 5)} (${q(ad / 1000, 'm/s²', 4)})`),
          m('Rod angular velocity ω3', q(w3, 'rad/s', 5)), m('Rod angular acceleration α3', q(a3, 'rad/s²', 5))],
        `Slider-crank at θ2 = ${q(v.t2, '°', 4)}${v.c ? `, offset ${q(v.c, 'mm', 4)}` : ''}.`, 'Norton’s analytical slider-crank position, velocity and acceleration equations.', {
          checks: [check('Rod ratio', v.b >= 3 * v.a ? 'pass' : 'verify', `Rod to crank ratio ${q(v.b / v.a, '', 4)}; short rods raise the side load on the slider.`), check('Circuit', 'verify', 'Check the circuit matches the side of the crank pivot the slider is on.')],
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
