// KEVOS® MAKEOS calculations from mechanism kinematics topics (batch norton4). SI units are explicit at each boundary.
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
    "vee-engine-balance": (v) => {
      const ph = [0, v.p2, v.p3, v.p4, v.p5, v.p6].slice(0, v.n).map(rad), z = ph.map((_, i) => v.z1 + i * v.sp), g = rad(v.vee / 2), k = v.r / v.l, cg = Math.cos(g), sg = Math.sin(g);
      const at = (wt) => { const o = { R1: 0, L1: 0, R2: 0, L2: 0, zR1: 0, zL1: 0, zR2: 0, zL2: 0, Ti: 0 };
        ph.forEach((p, i) => { const th = wt - p, xr = th + g, xl = th - g, r1 = Math.cos(xr), l1 = Math.cos(xl), r2 = k * Math.cos(2 * xr), l2 = k * Math.cos(2 * xl);
          o.R1 += r1; o.L1 += l1; o.R2 += r2; o.L2 += l2; o.zR1 += z[i] * r1; o.zL1 += z[i] * l1; o.zR2 += z[i] * r2; o.zL2 += z[i] * l2;
          for (const x of [xr, xl]) o.Ti += k / 2 * Math.sin(x) - Math.sin(2 * x) - 1.5 * k * Math.sin(3 * x); });
        const F1 = [(o.L1 + o.R1) * cg, (o.L1 - o.R1) * sg], F2 = [(o.L2 + o.R2) * cg, (o.L2 - o.R2) * sg], M1 = [(o.zL1 - o.zR1) * sg, (-o.zL1 - o.zR1) * cg], M2 = [(o.zL2 - o.zR2) * sg, (-o.zL2 - o.zR2) * cg];
        return { F1, F2, F: [F1[0] + F2[0], F1[1] + F2[1]], M1, M2, M: [M1[0] + M2[0], M1[1] + M2[1]], Ti: o.Ti }; };
      const keys = ['F1', 'F2', 'F', 'M1', 'M2', 'M'], lo = {}, hi = {}; for (const kk of keys) { lo[kk] = Infinity; hi[kk] = 0; } let Tpk = 0;
      for (let i = 0; i < 1440; i++) { const s = at(2 * PI * i / 1440); for (const kk of keys) { const a = Math.hypot(s[kk][0], s[kk][1]); lo[kk] = Math.min(lo[kk], a); hi[kk] = Math.max(hi[kk], a); } Tpk = Math.max(Tpk, Math.abs(s.Ti)); }
      const tolF = 1e-9 * v.n, tolM = tolF * Math.max(1, ...z.map(Math.abs)), cl = (x, t) => (Math.abs(x) < t ? 0 : x);
      for (const kk of keys) { const t = kk[0] === 'F' ? tolF : tolM; lo[kk] = cl(lo[kk], t); hi[kk] = cl(hi[kk], t); } Tpk = cl(Tpk, tolF);
      const bal = (kk) => hi[kk] === 0, rot = (kk) => !bal(kk) && hi[kk] - lo[kk] <= 1e-6 * hi[kk];
      const a0 = at(0).F1, a1 = at(rad(1)).F1, fwd = a0[0] * a1[1] - a0[1] * a1[0] > 0;
      const st = (kk) => (bal(kk) ? 'balanced' : rot(kk) ? 'constant magnitude, rotating' : 'varies in magnitude');
      const s0 = at(rad(v.th)), w = v.rpm * 2 * PI / 60, F0 = v.mB * v.r / 1000 * w * w, T0 = 0.5 * v.mB * (v.r / 1000) ** 2 * w * w;
      const allF = bal('F1') && bal('F2'), allM = bal('M1') && bal('M2');
      const vals = { F1pk: hi.F1, F1min: lo.F1, F2pk: hi.F2, Fpk: hi.F, M1pk: hi.M1, M1min: lo.M1, M2pk: hi.M2, Mpk: hi.M, Tpk, Fx: cl(s0.F[0], tolF), Fy: cl(s0.F[1], tolF), Mx: cl(s0.M[0], tolM), My: cl(s0.M[1], tolM), Ti: cl(s0.Ti, tolF), FpkN: F0 * hi.F, MpkN: F0 * hi.M / 1000, TpkN: T0 * Tpk };
      const p1 = bal('F1') ? 'Balanced over the revolution.' : rot('F1') ? `Constant magnitude ${q(hi.F1, '', 4)} × mB rω², turning ${fwd ? 'with the crank, so a counterweight on the crankshaft can cancel it' : 'against the crank, so a crankshaft counterweight cannot cancel it'}.` : `Peak ${q(hi.F1, '', 4)} × mB rω², changing in size as the crank turns.`;
      return output(vals, 'Peak shaking force (× mB rω²)', hi.F,
        [m('Peak primary / secondary force (× mB rω²)', `${q(hi.F1, '', 4)} / ${q(hi.F2, '', 4)}`), m('Primary / secondary force', `${st('F1')} / ${st('F2')}`),
          m('Peak primary / secondary moment (× mB rω², mm)', `${q(hi.M1, '', 4)} / ${q(hi.M2, '', 4)}`), m('Primary / secondary moment', `${st('M1')} / ${st('M2')}`), m('Peak inertia torque (× ½ mB r²ω²)', q(Tpk, '', 4)),
          m(`At ωt = ${q(v.th, '°', 4)}: force Fx / Fy (× mB rω²)`, `${q(vals.Fx, '', 4)} / ${q(vals.Fy, '', 4)}`), m('At ωt: moment Mx / My (× mB rω², mm)', `${q(vals.Mx, '', 4)} / ${q(vals.My, '', 4)}`), m('At ωt: inertia torque (× ½ mB r²ω²)', q(vals.Ti, '', 4)),
          ...(v.mB > 0 ? [m('Peak shaking force / moment', `${q(vals.FpkN, 'N', 4)} / ${q(vals.MpkN, 'N·m', 4)}`), m('Peak inertia torque', q(vals.TpkN, 'N·m', 4))] : [])],
        `${v.n}-throw ${q(v.vee, '°', 4)} vee engine with phase angles ${[0, v.p2, v.p3, v.p4, v.p5, v.p6].slice(0, v.n).join(', ')}°.`, 'Norton’s vee engine shaking force, moment and inertia torque equations (eqs. 14.10–14.12).', {
          text: allF && allM ? 'FORCES AND MOMENTS BALANCED' : allF ? 'FORCES BALANCED, MOMENTS NOT' : 'SHAKING FORCES NOT BALANCED', tone: allF && allM ? 'good' : 'bad',
          checks: [check('Primary shaking force', bal('F1') ? 'pass' : rot('F1') && fwd ? 'warn' : 'fail', p1), check('Secondary shaking force', bal('F2') ? 'pass' : 'fail', bal('F2') ? 'Balanced over the revolution.' : `Peak ${q(hi.F2, '', 4)} × mB rω² at twice crank speed.`),
            check('Shaking moments', allM ? 'pass' : bal('M2') && rot('M1') ? 'warn' : 'fail', `Primary ${st('M1')}, secondary ${st('M2')}.`)],
        });
    },
    "geared-fivebar-kinematics": (v) => {
      const sgn = v.circ === 'minus' ? -1 : 1, n360 = (x) => ((deg(x) % 360) + 360) % 360;
      const pos = (t2) => { const t5 = v.lam * t2 + rad(v.phi), c2 = Math.cos(t2), s2 = Math.sin(t2), c5 = Math.cos(t5), s5 = Math.sin(t5);
        const A = 2 * v.c * (v.d * c5 - v.a * c2 + v.f), B = 2 * v.c * (v.d * s5 - v.a * s2), C = v.a ** 2 - v.b ** 2 + v.c ** 2 + v.d ** 2 + v.f ** 2 - 2 * v.a * v.f * c2 - 2 * v.d * (v.a * c2 - v.f) * c5 - 2 * v.a * v.d * s2 * s5;
        const D = C - A, E = 2 * B, F = A + C, disc = E * E - 4 * D * F; if (disc < -1e-9 * (E * E + Math.abs(4 * D * F))) return null;
        const t4 = 2 * Math.atan2(-E + sgn * Math.sqrt(Math.max(0, disc)), 2 * D), t3 = Math.atan2(-v.a * s2 + v.c * Math.sin(t4) + v.d * s5, -v.a * c2 + v.c * Math.cos(t4) + v.d * c5 + v.f); return { t3, t4, t5 }; };
      const t2 = rad(v.t2), P0 = pos(t2); if (!P0) return invalid('The links cannot be assembled at this crank angle.');
      const { t3, t4, t5 } = P0, w5 = v.lam * v.w2, a5 = v.lam * v.a2, det = v.b * v.c * Math.sin(t3 - t4);
      if (Math.abs(det) < 1e-9 * v.b * v.c) return invalid('Links 3 and 4 are in line (a toggle position); velocities are not defined here.');
      const R1 = v.a * v.w2 * Math.sin(t2) - v.d * w5 * Math.sin(t5), R2 = -v.a * v.w2 * Math.cos(t2) + v.d * w5 * Math.cos(t5);
      const w3 = (R1 * (-v.c * Math.cos(t4)) - v.c * Math.sin(t4) * R2) / det, w4 = (-v.b * Math.sin(t3) * R2 - v.b * Math.cos(t3) * R1) / det;
      const a3 = (-v.a * v.a2 * Math.sin(t2 - t4) - v.a * v.w2 ** 2 * Math.cos(t2 - t4) - v.b * w3 ** 2 * Math.cos(t3 - t4) + v.d * w5 ** 2 * Math.cos(t5 - t4) + v.d * a5 * Math.sin(t5 - t4) + v.c * w4 ** 2) / (v.b * Math.sin(t3 - t4));
      const a4 = (v.a * v.a2 * Math.sin(t2 - t3) + v.a * v.w2 ** 2 * Math.cos(t2 - t3) - v.c * w4 ** 2 * Math.cos(t3 - t4) - v.d * w5 ** 2 * Math.cos(t3 - t5) + v.d * a5 * Math.sin(t3 - t5) + v.b * w3 ** 2) / (v.c * Math.sin(t4 - t3));
      let tt = Math.abs(t3 - t4) % (2 * PI); if (tt > PI) tt = 2 * PI - tt; if (tt > PI / 2) tt = PI - tt;
      const gq = t3 + rad(v.d3), Pt = [v.a * Math.cos(t2) + v.p * Math.cos(gq), v.a * Math.sin(t2) + v.p * Math.sin(gq)], VP = [-v.a * v.w2 * Math.sin(t2) - v.p * w3 * Math.sin(gq), v.a * v.w2 * Math.cos(t2) + v.p * w3 * Math.cos(gq)];
      let fail = null; for (let i = 0; i < 360 && fail === null; i++) if (!pos(rad(i))) fail = i;
      return output({ t3: n360(t3), t4: n360(t4), t5: n360(t5), w3, w4, w5, a3, a4, a5, mu: deg(tt), Px: Pt[0], Py: Pt[1], VP: Math.hypot(VP[0], VP[1]) }, 'Link 4 angle θ4 (°)', n360(t4),
        [m('Angles θ3 / θ4 / θ5', `${q(n360(t3), '°', 5)} / ${q(n360(t4), '°', 5)} / ${q(n360(t5), '°', 5)}`), m('Angular velocity ω3 / ω4 / ω5', `${q(w3, 'rad/s', 5)} / ${q(w4, 'rad/s', 5)} / ${q(w5, 'rad/s', 5)}`),
          m('Angular acceleration α3 / α4 / α5', `${q(a3, 'rad/s²', 5)} / ${q(a4, 'rad/s²', 5)} / ${q(a5, 'rad/s²', 5)}`), m('Transmission angle (links 3 and 4)', q(deg(tt), '°', 4)),
          ...(v.p > 0 ? [m('Coupler point position x / y', `${q(Pt[0], 'mm', 5)} / ${q(Pt[1], 'mm', 5)}`), m('Coupler point speed', q(Math.hypot(VP[0], VP[1]), 'mm/s', 4))] : [])],
        `Geared fivebar at θ2 = ${q(v.t2, '°', 4)}, λ = ${q(v.lam, '', 4)}, φ = ${q(v.phi, '°', 4)}, ${v.circ} root.`, 'Norton’s analytical position, velocity and acceleration solution of the geared fivebar.', {
          checks: [check('Transmission angle', deg(tt) >= 40 ? 'pass' : 'warn', `Transmission angle ${q(deg(tt), '°', 4)} at this position.`),
            check('Assembly over one crank turn', fail === null ? 'pass' : 'warn', fail === null ? 'The links assemble at every crank angle from 0° to 360°.' : `The links cannot assemble near θ2 = ${fail}°; the linkage cannot turn through a full crank revolution.`),
            check('Assembly', 'verify', 'Check the chosen root matches how links 3 and 4 are assembled.')],
        });
    },
    "fourbar-three-position-synthesis": (v) => {
      const a2 = rad(v.a2), a3 = rad(v.a3), E1 = v.p21 * Math.cos(rad(v.d2)), M1 = v.p21 * Math.sin(rad(v.d2)), L1 = v.p31 * Math.cos(rad(v.d3)), N1 = v.p31 * Math.sin(rad(v.d3));
      const solve = (rows, y) => { const aug = rows.map((r, i) => [...r, y[i]]); for (let c = 0; c < 4; c++) { let p = c; for (let r = c + 1; r < 4; r++) if (Math.abs(aug[r][c]) > Math.abs(aug[p][c])) p = r;
        if (Math.abs(aug[p][c]) < 1e-10) return null; [aug[c], aug[p]] = [aug[p], aug[c]]; for (let r = 0; r < 4; r++) if (r !== c) { const fc = aug[r][c] / aug[c][c]; for (let j = c; j < 5; j++) aug[r][j] -= fc * aug[c][j]; } } return aug.map((r, i) => r[4] / r[i]); };
      const dyad = (x2, x3) => { const cA = Math.cos(x2) - 1, cB = Math.sin(x2), cC = Math.cos(a2) - 1, cD = Math.sin(a2), cF = Math.cos(x3) - 1, cG = Math.sin(x3), cH = Math.cos(a3) - 1, cK = Math.sin(a3);
        return solve([[cA, -cB, cC, -cD], [cF, -cG, cH, -cK], [cB, cA, cD, cC], [cG, cF, cK, cH]], [E1, L1, M1, N1]); };
      const WZ = dyad(rad(v.b2), rad(v.b3)), US = dyad(rad(v.g2), rad(v.g3));
      if (!WZ || !US) return invalid('The equations for one dyad have no unique solution with these free choices; change β2, β3, γ2 or γ3.');
      const [Wx, Wy, Zx, Zy] = WZ, [Ux, Uy, Sx, Sy] = US, Vx = Zx - Sx, Vy = Zy - Sy, Gx = Wx + Vx - Ux, Gy = Wy + Vy - Uy;
      const l1 = Math.hypot(Gx, Gy), l2 = Math.hypot(Wx, Wy), l3 = Math.hypot(Vx, Vy), l4 = Math.hypot(Ux, Uy), small = 1e-9 * (v.p21 + v.p31);
      if (Math.min(l1, l2, l3, l4) < small) return invalid('A link of the solution has zero length; change the free choices.');
      const n360 = (x) => ((deg(x) % 360) + 360) % 360, wrap = (x) => Math.atan2(Math.sin(x), Math.cos(x)), tG = Math.atan2(Gy, Gx), tW = Math.atan2(Wy, Wx), tV = Math.atan2(Vy, Vx), tU = Math.atan2(Uy, Ux);
      const fb = (t2) => { const K1 = l1 / l2, K2 = l1 / l4, K3 = (l2 ** 2 - l3 ** 2 + l4 ** 2 + l1 ** 2) / (2 * l2 * l4), A = Math.cos(t2) - K1 - K2 * Math.cos(t2) + K3, B = -2 * Math.sin(t2), C = K1 - (K2 + 1) * Math.cos(t2) + K3, disc = Math.max(0, B * B - 4 * A * C);
        return [-1, 1].map((sg) => 2 * Math.atan2(-B + sg * Math.sqrt(disc), 2 * A)); };
      const pz = [0, 1, 2].map((kk) => { const bk = [0, rad(v.b2), rad(v.b3)][kk], ak = [0, a2, a3][kk], gk = [0, rad(v.g2), rad(v.g3)][kk];
        const t2 = tW + bk - tG, t3 = tV + ak - tG, t4 = tU + gk - tG, cand = fb(t2), e0 = Math.abs(wrap(t4 - cand[0])), e1 = Math.abs(wrap(t4 - cand[1]));
        let tt = Math.abs(t3 - t4) % (2 * PI); if (tt > PI) tt = 2 * PI - tt; if (tt > PI / 2) tt = PI - tt;
        return { t2: n360(t2), t3: n360(t3), t4: n360(t4), mu: deg(tt), circ: e0 <= e1 ? 'open' : 'crossed' }; });
      const same = pz.every((o) => o.circ === pz[0].circ), muMin = Math.min(...pz.map((o) => o.mu));
      const Ls = [l1, l2, l3, l4], srt = [...Ls].sort((x, y) => x - y), gsum = srt[0] + srt[3] - srt[1] - srt[2], tolL = 1e-9 * srt[3], sh = Ls.indexOf(srt[0]);
      const cls = Math.abs(gsum) <= tolL ? 'special Grashof (change point)' : gsum > 0 ? 'non-Grashof (triple rocker)' : ['Grashof double crank', 'Grashof crank-rocker', 'Grashof double rocker', 'Grashof rocker-crank'][sh];
      const pa = n360(Math.atan2(Zy, Zx) - tV), pzl = Math.hypot(Zx, Zy);
      const vals = { Wx, Wy, Zx, Zy, Ux, Uy, Sx, Sy, Vx, Vy, Gx, Gy, l1, l2, l3, l4, O2x: -Zx - Wx, O2y: -Zy - Wy, O4x: -Sx - Ux, O4y: -Sy - Uy, pz: pzl, pa, t21: pz[0].t2, t22: pz[1].t2, t23: pz[2].t2, t41: pz[0].t4, t42: pz[1].t4, t43: pz[2].t4, mu1: pz[0].mu, mu2: pz[1].mu, mu3: pz[2].mu, cross1: pz[0].circ === 'crossed' ? 1 : 0, cross2: pz[1].circ === 'crossed' ? 1 : 0, cross3: pz[2].circ === 'crossed' ? 1 : 0 };
      const three = (key, u) => pz.map((o) => q(o[key], u, 4)).join(' / ');
      return output(vals, 'Ground link O2O4 length (mm)', l1,
        [m('Links 1 (ground) / 2 / 3 (coupler) / 4', `${q(l1, 'mm', 4)} / ${q(l2, 'mm', 4)} / ${q(l3, 'mm', 4)} / ${q(l4, 'mm', 4)}`), m('Fixed pivot O2 x / y (from P1)', `${q(vals.O2x, 'mm', 4)} / ${q(vals.O2y, 'mm', 4)}`), m('Fixed pivot O4 x / y (from P1)', `${q(vals.O4x, 'mm', 4)} / ${q(vals.O4y, 'mm', 4)}`),
          m('Coupler point from A', `${q(pzl, 'mm', 4)} at ${q(pa, '°', 4)} from line AB`), m('W / Z (x, y)', `${q(Wx, '', 4)}, ${q(Wy, '', 4)} / ${q(Zx, '', 4)}, ${q(Zy, '', 4)} mm`), m('U / S (x, y)', `${q(Ux, '', 4)}, ${q(Uy, '', 4)} / ${q(Sx, '', 4)}, ${q(Sy, '', 4)} mm`),
          m('Crank angle θ2 at positions 1 / 2 / 3', three('t2', '°')), m('Rocker angle θ4 at positions 1 / 2 / 3', three('t4', '°')), m('Transmission angle at positions 1 / 2 / 3', three('mu', '°')), m('Circuit at positions 1 / 2 / 3', pz.map((o) => o.circ).join(' / ')), m('Linkage class', cls)],
        `Three-position synthesis with β2 = ${q(v.b2, '°', 4)}, β3 = ${q(v.b3, '°', 4)}, γ2 = ${q(v.g2, '°', 4)}, γ3 = ${q(v.g3, '°', 4)}.`, 'Norton’s analytical three-position motion synthesis (eqs. 5.24–5.31, 5.2).', {
          text: !same ? 'CIRCUIT DEFECT' : muMin < 40 ? 'SYNTHESISED, POOR TRANSMISSION ANGLE' : 'LINKAGE SYNTHESISED', tone: !same ? 'bad' : muMin < 40 ? 'warn' : 'good',
          table: tbl('The synthesised linkage at its three positions (angles from the ground line O2O4)', ['Position', 'θ2 (°)', 'θ3 (°)', 'θ4 (°)', 'Transmission angle (°)', 'Circuit'], pz.map((o, i) => [String(i + 1), q(o.t2, '', 4), q(o.t3, '', 4), q(o.t4, '', 4), q(o.mu, '', 3), o.circ])),
          checks: [check('Same circuit at all positions', same ? 'pass' : 'fail', same ? `All three positions are on the ${pz[0].circ} circuit.` : 'The positions lie on different circuits, so the linkage cannot move through all three without being taken apart.'),
            check('Transmission angle', muMin >= 40 ? 'pass' : 'warn', `Smallest transmission angle ${q(muMin, '°', 3)} at the three positions.`),
            check('Branch and order', 'verify', 'Run the linkage through its motion in a fourbar analysis and confirm it reaches the positions in order without passing a toggle.')],
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
