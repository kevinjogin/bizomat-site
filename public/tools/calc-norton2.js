// BIZOMAT MAKEOS calculations from mechanism kinematics topics (batch norton2). SI units are explicit at each boundary.
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
    "engine-piston-motion": (v) => {
      const k = v.r / v.l;
      if (!(k < 1)) return invalid('The crank radius must be shorter than the connecting rod.');
      const w = v.rpm * 2 * PI / 60, t = rad(v.wt), s = Math.sin(t), c = Math.cos(t), R = Math.sqrt(1 - (k * s) ** 2);
      const x = v.r * c + v.l * R, vEx = -v.r * w * (s + k * Math.sin(2 * t) / (2 * R)), aEx = -v.r * w * w * (c - v.r * (v.l ** 2 * (1 - 2 * c * c) - v.r ** 2 * s ** 4) / (v.l ** 2 - (v.r * s) ** 2) ** 1.5);
      const xAp = v.l - v.r ** 2 / (4 * v.l) + v.r * (c + k / 4 * Math.cos(2 * t)), vAp = -v.r * w * (s + k / 2 * Math.sin(2 * t)), aAp = -v.r * w * w * (c + k * Math.cos(2 * t)), aTDC = v.r * w * w * (1 + k);
      return output({ k, x, vEx, aEx, xAp, vAp, aAp, aTDC }, 'Piston acceleration, exact (mm/s²)', aEx,
        [m('Crank-conrod ratio r/l', `${q(k, '', 4)} (1:${q(1 / k, '', 3)})`), m('Position x (exact / approx.)', `${q(x, 'mm', 5)} / ${q(xAp, 'mm', 5)}`), m('Velocity (exact / approx.)', `${q(vEx / 1000, 'm/s', 5)} / ${q(vAp / 1000, 'm/s', 5)}`),
          m('Acceleration (exact / approx.)', `${q(aEx / 1000, 'm/s²', 5)} / ${q(aAp / 1000, 'm/s²', 5)}`), m('Peak acceleration at TDC', `${q(aTDC / 1000, 'm/s²', 5)} (${q(aTDC / 9806.65, 'g', 4)})`)],
        `Slider-crank r = ${q(v.r, 'mm', 4)}, l = ${q(v.l, 'mm', 4)} at ${q(v.rpm, 'rpm', 4)}.`, 'Norton’s exact and approximate piston motion equations.', {
          checks: [check('Crank-conrod ratio', k <= 1 / 3 + 1e-12 && k >= 1 / 5 - 1e-12 ? 'pass' : k < 0.5 ? 'warn' : 'fail', `r/l = ${q(k, '', 4)}; Norton gives about 1/3 to 1/5 for smooth running.`), check('Approximation', 'pass', `The approximate acceleration differs from the exact by ${q(Math.abs(aAp - aEx) / aTDC * 100, '%', 3)} of the peak.`)],
        });
    },
    "engine-gas-torque": (v) => {
      const k = v.r / v.l; if (!(k < 1)) return invalid('The crank radius must be shorter than the connecting rod.');
      const t = rad(v.wt), Ap = PI * v.B ** 2 / 4, Fg = v.Pg * Ap, sphi = k * Math.sin(t), cphi = Math.sqrt(1 - sphi * sphi), tphi = sphi / cphi, x = v.r * Math.cos(t) + v.l * cphi;
      const Fside = Fg * tphi, Tex = Fside * x / 1000, Tap = Fg * v.r * Math.sin(t) * (1 + k * Math.cos(t)) / 1000;
      return output({ Ap, Fg, phi: deg(Math.asin(sphi)), Fside, Tex, Tap }, 'Gas torque, exact (N·m)', Tex,
        [m('Piston area', q(Ap, 'mm²', 5)), m('Gas force Fg', q(Fg / 1000, 'kN', 5)), m('Conrod angle φ', q(deg(Math.asin(sphi)), '°', 4)), m('Piston side force Fg tan φ', q(Fside / 1000, 'kN', 5)), m('Gas torque exact / approximate', `${q(Tex, 'N·m', 5)} / ${q(Tap, 'N·m', 5)}`)],
        `Gas torque at ${q(v.wt, '°', 4)} after TDC.`, 'Norton’s gas force and gas torque equations.', {
          checks: [check('Approximation', 'pass', `The approximate gas torque differs from the exact by ${q(Math.abs(Tap - Tex), 'N·m', 4)}.`), check('Pressure', 'verify', 'The pressure must be the cylinder pressure at this crank angle.')],
        });
    },
    "engine-inertia-forces": (v) => {
      const k = v.r / v.l; if (!(k < 1)) return invalid('The crank radius must be shorter than the connecting rod.');
      if (!(v.la < v.l)) return invalid('The conrod CG must lie between the crankpin and the wrist pin.');
      const lb = v.l - v.la, m3a = v.m3 * lb / v.l, m3b = v.m3 * v.la / v.l, m2a = v.r > 0 ? v.m2 * v.rG2 / v.r : 0, mA = m2a + m3a, mB = m3b + v.m4, lp = v.IG3 > 0 ? v.IG3 / (v.m3 * lb / 1000) * 1000 : 0;
      const w = v.rpm * 2 * PI / 60, t = rad(v.wt), rw2 = v.r / 1000 * w * w, Fx = mA * rw2 * Math.cos(t) + mB * rw2 * (Math.cos(t) + k * Math.cos(2 * t)), Fy = mA * rw2 * Math.sin(t);
      const Ti = 0.5 * mB * (v.r / 1000) ** 2 * w * w * (k / 2 * Math.sin(t) - Math.sin(2 * t) - 1.5 * k * Math.sin(3 * t));
      return output({ m3a, m3b, m2a, mA, mB, lp, Fx, Fy, F: Math.hypot(Fx, Fy), P1: (mA + mB) * rw2, P2: mB * rw2 * k, Ti }, 'Shaking force magnitude (N)', Math.hypot(Fx, Fy),
        [m('Conrod at crankpin m3a / wrist pin m3b', `${q(m3a, 'kg', 4)} / ${q(m3b, 'kg', 4)}`), m('Rotating mass mA / reciprocating mass mB', `${q(mA, 'kg', 4)} / ${q(mB, 'kg', 4)}`), ...(v.IG3 > 0 ? [m('Centre of percussion lp from the conrod CG', `${q(lp, 'mm', 4)} (crankpin at ${q(v.la, 'mm', 4)})`)] : []),
          m('Shaking force Fx / Fy', `${q(Fx, 'N', 5)} / ${q(Fy, 'N', 5)}`), m('Primary / secondary x amplitude', `${q((mA + mB) * rw2, 'N', 5)} / ${q(mB * rw2 * k, 'N', 5)}`), m('Inertia torque', q(Ti, 'N·m', 5))],
        `Single-cylinder lumped-mass model at ${q(v.rpm, 'rpm', 4)}, ${q(v.wt, '°', 4)} after TDC.`, 'Norton’s lumped-mass engine dynamics equations.', {
          checks: [check('Lumped mass placement', v.IG3 > 0 ? (Math.abs(lp - v.la) <= 0.2 * v.la ? 'pass' : 'warn') : 'verify', v.IG3 > 0 ? `The centre of percussion is ${q(lp, 'mm', 4)} from the CG against ${q(v.la, 'mm', 4)} to the crankpin; the closer, the better the model.` : 'Enter IG3 to compare the centre of percussion with the crankpin.'), check('Balance', m2a > 0 ? 'verify' : 'pass', m2a > 0 ? 'Counterweighting the crank removes the mA terms.' : 'Crank taken as balanced.')],
        });
    },
    "inline-engine-balance": (v) => {
      const ph = [0, v.p2, v.p3, v.p4, v.p5, v.p6, v.p7, v.p8].slice(0, v.n).map(rad), z = ph.map((_, i) => v.z1 + i * v.sp);
      const S_ = (kk, fn, wz) => ph.reduce((a, p, i) => a + (wz ? z[i] : 1) * fn(kk * p), 0), cl = (x) => (Math.abs(x) < 1e-9 ? 0 : x);
      const sums = {}; for (const kk of [1, 2, 3, 4, 6]) { sums[`c${kk}`] = cl(S_(kk, Math.cos)); sums[`s${kk}`] = cl(S_(kk, Math.sin)); sums[`zc${kk}`] = cl(S_(kk, Math.cos, true)); sums[`zs${kk}`] = cl(S_(kk, Math.sin, true)); }
      const ok = (kk, wz) => Math.abs(sums[`${wz ? 'z' : ''}c${kk}`]) < 1e-6 && Math.abs(sums[`${wz ? 'z' : ''}s${kk}`]) < 1e-6, yn = (b) => (b ? 'balanced' : 'not balanced');
      const w = v.rpm * 2 * PI / 60, rw2 = v.r / 1000 * w * w, kr = v.r / v.l, F1 = v.mB * rw2 * Math.hypot(sums.c1, sums.s1), F2 = v.mB * rw2 * kr * Math.hypot(sums.c2, sums.s2);
      const M1 = v.mB * rw2 * Math.hypot(sums.zc1, sums.zs1) / 1000, M2 = v.mB * rw2 * kr * Math.hypot(sums.zc2, sums.zs2) / 1000, fire = (v.cycle === '2' ? 360 : 720) / v.n;
      const allF = ok(1) && ok(2), allM = ok(1, true) && ok(2, true), allT = ok(1) && ok(2) && ok(3);
      return output({ ...sums, F1, F2, M1, M2, fire }, 'Even firing interval (°)', fire,
        [m('Forces Σcos/Σsin φ, 2φ', `${q(sums.c1, '', 4)}, ${q(sums.s1, '', 4)}; ${q(sums.c2, '', 4)}, ${q(sums.s2, '', 4)}`), m('Forces 4φ, 6φ', `${q(sums.c4, '', 4)}, ${q(sums.s4, '', 4)}; ${q(sums.c6, '', 4)}, ${q(sums.s6, '', 4)}`),
          m('Inertia torque harmonics 1 / 2 / 3', `${yn(ok(1))} / ${yn(ok(2))} / ${yn(ok(3))}`), m('Moments Σz cos/Σz sin φ, 2φ', `${q(sums.zc1, '', 4)}, ${q(sums.zs1, '', 4)}; ${q(sums.zc2, '', 4)}, ${q(sums.zs2, '', 4)}`), m('Moments 4φ, 6φ', `${q(sums.zc4, '', 4)}, ${q(sums.zs4, '', 4)}; ${q(sums.zc6, '', 4)}, ${q(sums.zs6, '', 4)}`),
          ...(v.mB > 0 ? [m('Unbalanced primary / secondary force', `${q(F1, 'N', 4)} / ${q(F2, 'N', 4)}`), m('Unbalanced primary / secondary moment', `${q(M1, 'N·m', 4)} / ${q(M2, 'N·m', 4)}`)] : []), m('Even firing interval', q(fire, '°', 4))],
        `${v.n}-cylinder inline ${v.cycle === '2' ? 'two' : 'four'}-stroke with phase angles ${[0, v.p2, v.p3, v.p4, v.p5, v.p6, v.p7, v.p8].slice(0, v.n).join(', ')}°.`, 'Norton’s inline engine balance sums (eqs. 14.3, 14.5, 14.7, 14.8).', {
          text: allF && allM ? 'FORCES AND MOMENTS BALANCED' : allF ? 'FORCES BALANCED, MOMENTS NOT' : 'SHAKING FORCES NOT BALANCED', tone: allF && allM ? 'good' : 'bad',
          checks: [check('Shaking forces (1st, 2nd)', allF ? 'pass' : 'fail', `Primary ${yn(ok(1))}, secondary ${yn(ok(2))}.`), check('Inertia torque (1st–3rd)', allT ? 'pass' : 'warn', `Harmonics 1, 2, 3: ${yn(ok(1))}, ${yn(ok(2))}, ${yn(ok(3))}.`), check('Shaking moments (1st, 2nd)', allM ? 'pass' : 'fail', `Primary ${yn(ok(1, true))}, secondary ${yn(ok(2, true))}.`)],
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
