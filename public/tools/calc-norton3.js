// KEVOS® MAKEOS calculations from mechanism kinematics topics (batch norton3). SI units are explicit at each boundary.
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
    "inverted-slider-crank-kinematics": (v) => {
      const t2 = rad(v.t2), g = rad(v.g), sg = v.circ === 'open' ? 1 : -1, ac = v.a * Math.cos(t2) - v.d, as = v.a * Math.sin(t2);
      const P = as * Math.sin(g) + ac * Math.cos(g), Q = -as * Math.cos(g) + ac * Math.sin(g), Rr = -v.c * Math.sin(g), Ss = Rr - Q, Tt = 2 * P, U = Q + Rr, disc = Tt * Tt - 4 * Ss * U;
      if (disc < -1e-12) return invalid('The links cannot be assembled at this crank angle.');
      const pick = [-1, 1].map((pm) => { const t4 = Math.abs(Ss) < 1e-14 ? 2 * Math.atan(-U / Tt) : 2 * Math.atan((-Tt + pm * Math.sqrt(Math.max(0, disc))) / (2 * Ss)); const t3 = t4 + sg * g; const s3 = Math.sin(t3), c3 = Math.cos(t3);
        const b = Math.abs(s3) > Math.abs(c3) ? (as - v.c * Math.sin(t4)) / s3 : (v.a * Math.cos(t2) - v.c * Math.cos(t4) - v.d) / c3; return { t4, t3, b }; }).filter((o) => o.b > 1e-9);
      if (!pick.length) return invalid('No assembly with the slider between A and the block was found for this circuit.');
      const { t4, t3, b } = pick[0], dn = b + v.c * Math.cos(t4 - t3); if (Math.abs(dn) < 1e-12) return invalid('The linkage is at a toggle position here.');
      const w = v.a * v.w2 * Math.cos(t2 - t3) / dn, s3 = Math.sin(t3), c3 = Math.cos(t3);
      const bd = Math.abs(c3) > Math.abs(s3) ? (-v.a * v.w2 * Math.sin(t2) + w * (b * s3 + v.c * Math.sin(t4))) / c3 : (v.a * v.w2 * Math.cos(t2) - w * (b * c3 + v.c * Math.cos(t4))) / s3;
      const K1 = v.a * v.a2 * Math.sin(t2) + v.a * v.w2 ** 2 * Math.cos(t2) - b * w * w * c3 - 2 * bd * w * s3 - v.c * w * w * Math.cos(t4);
      const K2 = -v.a * v.a2 * Math.cos(t2) + v.a * v.w2 ** 2 * Math.sin(t2) - b * w * w * s3 + 2 * bd * w * c3 - v.c * w * w * Math.sin(t4);
      const m11 = b * s3 + v.c * Math.sin(t4), m12 = -c3, m21 = -b * c3 - v.c * Math.cos(t4), m22 = -s3, det = m11 * m22 - m12 * m21;
      const al = (K1 * m22 - m12 * K2) / det, bdd = (m11 * K2 - m21 * K1) / det, cor = 2 * bd * w, n360 = (x) => ((deg(x) % 360) + 360) % 360;
      return output({ t4: n360(t4), t3: n360(t3), b, w4: w, bd, a4: al, bdd, cor }, 'Output angle θ4 (°)', n360(t4),
        [m('Output / coupler angle θ4 / θ3', `${q(n360(t4), '°', 5)} / ${q(n360(t3), '°', 5)}`), m('Slider position b (A to block)', q(b, 'mm', 5)), m('Angular velocity ω4 = ω3', q(w, 'rad/s', 5)), m('Slip velocity ḃ', q(bd, 'mm/s', 5)),
          m('Angular acceleration α4 = α3', q(al, 'rad/s²', 5)), m('Slip acceleration b̈', q(bdd, 'mm/s²', 5)), m('Coriolis acceleration 2ḃω3', q(cor, 'mm/s²', 5))],
        `Inverted slider-crank at θ2 = ${q(v.t2, '°', 4)}, ${v.circ} circuit.`, 'Norton’s analytical solution of the inverted slider-crank.', {
          checks: [check('Coriolis term', Math.abs(cor) > 0 ? 'verify' : 'pass', 'Include the Coriolis component when drawing or checking acceleration polygons.'), check('Circuit', 'verify', 'Check the circuit matches how the slider block is assembled.')],
        });
    },
    "cam-svaj-functions": (v) => {
      const B = rad(v.beta), h = v.h, w = v.rpm * 2 * PI / 60;
      if (v.th > v.beta + 1e-9) return invalid('The cam angle must lie within the segment (0 to β).');
      const ev = (x) => { const s1 = Math.sin, c1 = Math.cos, B2 = B * B, B3 = B2 * B; let s, vv, a, j;
        switch (v.law) {
          case 'shm': s = h / 2 * (1 - c1(PI * x)); vv = PI * h / (2 * B) * s1(PI * x); a = PI * PI * h / (2 * B2) * c1(PI * x); j = -(PI ** 3) * h / (2 * B3) * s1(PI * x); break;
          case 'cyc': s = h * (x - s1(2 * PI * x) / (2 * PI)); vv = h / B * (1 - c1(2 * PI * x)); a = 2 * PI * h / B2 * s1(2 * PI * x); j = 4 * PI * PI * h / B3 * c1(2 * PI * x); break;
          case 'p345': s = h * (10 * x ** 3 - 15 * x ** 4 + 6 * x ** 5); vv = h / B * (30 * x ** 2 - 60 * x ** 3 + 30 * x ** 4); a = h / B2 * (60 * x - 180 * x ** 2 + 120 * x ** 3); j = h / B3 * (60 - 360 * x + 360 * x ** 2); break;
          case 'p4567': s = h * (35 * x ** 4 - 84 * x ** 5 + 70 * x ** 6 - 20 * x ** 7); vv = h / B * (140 * x ** 3 - 420 * x ** 4 + 420 * x ** 5 - 140 * x ** 6); a = h / B2 * (420 * x ** 2 - 1680 * x ** 3 + 2100 * x ** 4 - 840 * x ** 5); j = h / B3 * (840 * x - 5040 * x ** 2 + 8400 * x ** 3 - 4200 * x ** 4); break;
          case 'mtrap':
            if (x < 1 / 8) { s = h * (0.38898448 * x - 0.0309544 * s1(4 * PI * x)); vv = 0.38898448 * h / B * (1 - c1(4 * PI * x)); a = 4.888124 * h / B2 * s1(4 * PI * x); j = 61.425769 * h / B3 * c1(4 * PI * x); }
            else if (x < 3 / 8) { s = h * (2.44406184 * x * x - 0.22203097 * x + 0.00723407); vv = h / B * (4.888124 * x - 0.22203097); a = 4.888124 * h / B2; j = 0; }
            else if (x < 5 / 8) { s = h * (1.6110154 * x - 0.0309544 * s1(4 * PI * x - PI) - 0.3055077); vv = h / B * (1.6110154 - 0.38898448 * c1(4 * PI * x - PI)); a = 4.888124 * h / B2 * s1(4 * PI * x - PI); j = 61.425769 * h / B3 * c1(4 * PI * x - PI); }
            else if (x < 7 / 8) { s = h * (-2.44406184 * x * x + 4.6660917 * x - 1.2292648); vv = h / B * (-4.888124 * x + 4.6660917); a = -4.888124 * h / B2; j = 0; }
            else { s = h * (0.6110154 + 0.38898448 * x + 0.0309544 * s1(4 * PI * x - 3 * PI)); vv = 0.38898448 * h / B * (1 + c1(4 * PI * x - 3 * PI)); a = -4.888124 * h / B2 * s1(4 * PI * x - 3 * PI); j = -61.425769 * h / B3 * c1(4 * PI * x - 3 * PI); }
            break;
          default:
            if (x < 1 / 8) { s = h * (0.43990085 * x - 0.0350062 * s1(4 * PI * x)); vv = 0.43990085 * h / B * (1 - c1(4 * PI * x)); a = 5.5279571 * h / B2 * s1(4 * PI * x); j = 69.4663577 * h / B3 * c1(4 * PI * x); }
            else if (x < 7 / 8) { s = h * (0.28004957 + 0.43990085 * x - 0.31505577 * c1(4 * PI * x / 3 - PI / 6)); vv = 0.43990085 * h / B * (1 + 3 * s1(4 * PI * x / 3 - PI / 6)); a = 5.5279571 * h / B2 * c1(4 * PI * x / 3 - PI / 6); j = -23.1553 * h / B3 * s1(4 * PI * x / 3 - PI / 6); }
            else { s = h * (0.56009915 + 0.43990085 * x - 0.0350062 * s1(2 * PI * (2 * x - 1))); vv = 0.43990085 * h / B * (1 - c1(2 * PI * (2 * x - 1))); a = 5.5279571 * h / B2 * s1(2 * PI * (2 * x - 1)); j = 69.4663577 * h / B3 * c1(2 * PI * (2 * x - 1)); }
        }
        return v.dir === 'fall' ? { s: h - s, v: -vv, a: -a, j: -j } : { s, v: vv, a, j }; };
      const p = ev(Math.min(1, v.th / v.beta)); let vPk = 0, aPk = 0, jPk = 0;
      for (let i = 0; i <= 4000; i++) { const e = ev(i / 4000); vPk = Math.max(vPk, Math.abs(e.v)); aPk = Math.max(aPk, Math.abs(e.a)); jPk = Math.max(jPk, Math.abs(e.j)); }
      const cz = (x, pk) => (Math.abs(x) < 1e-9 * pk ? 0 : x); p.v = cz(p.v, vPk); p.a = cz(p.a, aPk); p.j = cz(p.j, jPk);
      return output({ s: p.s, vr: p.v, ar: p.a, jr: p.j, vt: p.v * w, at: p.a * w * w, jt: p.j * w ** 3, vPk: vPk * w, aPk: aPk * w * w, jPk: jPk * w ** 3, Cv: vPk * B / h, Ca: aPk * B * B / h, Cj: jPk * B ** 3 / h }, 'Follower displacement s (mm)', p.s,
        [m('Displacement s', q(p.s, 'mm', 5)), m('Velocity', `${q(p.v * w, 'mm/s', 5)} (${q(p.v, 'mm/rad', 5)})`), m('Acceleration', `${q(p.a * w * w, 'mm/s²', 5)} (${q(p.a, 'mm/rad²', 5)})`), m('Jerk', `${q(p.j * w ** 3, 'mm/s³', 5)} (${q(p.j, 'mm/rad³', 5)})`),
          m('Peak velocity / acceleration / jerk', `${q(vPk * w, 'mm/s', 4)} / ${q(aPk * w * w, 'mm/s²', 4)} / ${q(jPk * w ** 3, 'mm/s³', 4)}`), m('Peak factors (× h/β, h/β², h/β³)', `${q(vPk * B / h, '', 4)}, ${q(aPk * B * B / h, '', 4)}, ${q(jPk * B ** 3 / h, '', 4)}`)],
        `${{ shm: 'Simple harmonic', cyc: 'Cycloidal', mtrap: 'Modified trapezoid', msine: 'Modified sine', p345: '3-4-5 polynomial', p4567: '4-5-6-7 polynomial' }[v.law]} ${v.dir} of ${q(h, 'mm', 4)} over ${q(v.beta, '°', 4)}.`, 'Norton’s double-dwell cam functions.', {
          checks: [check('Fundamental law', v.law === 'shm' ? 'fail' : 'pass', v.law === 'shm' ? 'Simple harmonic acceleration is not zero at the dwells, giving infinite jerk spikes.' : 'Displacement, velocity and acceleration are continuous with the dwells.'), check('Dynamic force', 'verify', 'Multiply the follower train mass by the acceleration for the inertia force.')],
        });
    },
    "fourbar-force-balance": (v) => {
      const p3 = rad(v.p3), k2 = v.l2 / v.l3, k4 = v.l4 / v.l3;
      const r2 = [v.m3 * (v.b3 * k2 * Math.cos(p3) - v.l2), v.m3 * v.b3 * k2 * Math.sin(p3)], r4 = [-v.m3 * v.b3 * k4 * Math.cos(p3), -v.m3 * v.b3 * k4 * Math.sin(p3)];
      const e2 = [v.m2b2 * Math.cos(rad(v.p2)), v.m2b2 * Math.sin(rad(v.p2))], e4 = [v.m4b4 * Math.cos(rad(v.p4)), v.m4b4 * Math.sin(rad(v.p4))];
      const c2 = [r2[0] - e2[0], r2[1] - e2[1]], c4 = [r4[0] - e4[0], r4[1] - e4[1]], mg = (u) => Math.hypot(u[0], u[1]), an = (u) => ((deg(Math.atan2(u[1], u[0])) % 360) + 360) % 360;
      return output({ req2x: r2[0], req2y: r2[1], req4x: r4[0], req4y: r4[1], req2: mg(r2), req4: mg(r4), add2: mg(c2), ang2: an(c2), add4: mg(c4), ang4: an(c4) }, 'Crank counterweight to add (kg·mm)', mg(c2),
        [m('Required on crank: total m2b2 / angle', `${q(mg(r2), 'kg·mm', 5)} / ${q(an(r2), '°', 4)}`), m('Required on rocker: total m4b4 / angle', `${q(mg(r4), 'kg·mm', 5)} / ${q(an(r4), '°', 4)}`),
          m('Add to crank / angle from O2A', `${q(mg(c2), 'kg·mm', 5)} / ${q(an(c2), '°', 4)}`), m('Add to rocker / angle from O4B', `${q(mg(c4), 'kg·mm', 5)} / ${q(an(c4), '°', 4)}`), m('Crank x / y components', `${q(r2[0], '', 5)} / ${q(r2[1], '', 5)}`), m('Rocker x / y components', `${q(r4[0], '', 5)} / ${q(r4[1], '', 5)}`)],
        `Force balance for a coupler of ${q(v.m3, 'kg', 4)}.`, 'Norton’s complete force balance equations (Berkof-Lowen).', {
          checks: [check('Shaking moment', 'verify', 'Force balance usually raises the shaking moment and input torque; check them after adding the counterweights.'), check('Counterweight size', 'verify', 'Choose mass and radius to give the product within the space available on each link.')],
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
