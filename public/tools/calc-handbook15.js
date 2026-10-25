// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook15). SI units are explicit at each boundary.
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
    "overhanging-beam": (v) => {
      const L = v.L, a = v.a, EI = v.E * 1000 * v.I, w = v.load / 1000; let R1, R2, Mneg, Mpos, tip, mid;
      if (v.case === 'one-point') { const P = v.load; R2 = P * (L + a) / L; R1 = -P * a / L; Mneg = -P * a; Mpos = 0; tip = P * a * a * (L + a) / (3 * EI); mid = -0.0642 * P * a * L * L / EI; }
      else if (v.case === 'two-point') { const P = v.load; R1 = R2 = P; Mneg = -P * a; Mpos = 0; tip = P * a * a * (3 * L + 2 * a) / (6 * EI); mid = -P * a * L * L / (8 * EI); }
      else if (v.case === 'two-udl') { R1 = R2 = w * (L + 2 * a) / 2; Mneg = -w * a * a / 2; Mpos = w * L * L / 8 - w * a * a / 2; mid = w * L * L * (5 * L * L - 24 * a * a) / (384 * EI); tip = w * a * (3 * a ** 3 + 6 * a * a * L - L ** 3) / (24 * EI); }
      else { R1 = w * (L * L - a * a) / (2 * L); R2 = w * (L + a) ** 2 / (2 * L); Mneg = -w * a * a / 2; Mpos = R1 > 0 ? R1 * R1 / (2 * w) : 0; tip = w * a * (4 * a * a * L - L ** 3 + 3 * a ** 3) / (24 * EI); mid = 5 * w * L ** 4 / (384 * EI) - w * a * a * L * L / (32 * EI); }
      const Mmax = Math.max(Math.abs(Mneg), Math.abs(Mpos)), stress = Mmax * v.c / v.I, ok = stress <= v.allow;
      return output({ R1, R2, Mneg, Mpos, tip, mid, stress }, 'Maximum stress (MPa)', stress,
        [m('Reactions', `${q(R1, 'N', 1)} and ${q(R2, 'N', 1)}`), m('Support (negative) moment', q(Mneg / 1e6, 'kN·m', 3)), m('Span (positive) moment', q(Mpos / 1e6, 'kN·m', 3)), m('Maximum bending stress', q(stress, 'MPa', 1)), m('Tip deflection', q(tip, 'mm', 3)), m(v.case === 'one-point' ? 'Largest deflection within span' : 'Mid-span deflection', q(mid, 'mm', 3))],
        'Overhanging beam solution.', 'Linear elastic; deflection positive downward.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('Uplift at a support', R1 < 0 ? 'warn' : 'pass', R1 < 0 ? 'Negative reaction: the far support must hold the beam down.' : 'Both reactions push up.')],
        });
    },
    "two-span-beam": (v) => {
      const EI = v.E * 1000 * v.I, L1 = v.L1, L2 = v.L2, udl = v.case === 'udl', w1 = v.w1 / 1000, w2 = v.w2 / 1000;
      if (!udl && (v.a1 > L1 || v.a2 > L2)) return invalid('Each point load must lie within its span.');
      const b2 = L2 - v.a2, T1 = udl ? w1 * L1 ** 3 / 4 : v.w1 * v.a1 * (L1 * L1 - v.a1 * v.a1) / L1, T2 = udl ? w2 * L2 ** 3 / 4 : v.w2 * b2 * (L2 * L2 - b2 * b2) / L2, MB = -(T1 + T2) / (2 * (L1 + L2));
      const RA0 = udl ? w1 * L1 / 2 : v.w1 * (L1 - v.a1) / L1, RC0 = udl ? w2 * L2 / 2 : v.w2 * v.a2 / L2, RA = RA0 + MB / L1, RC = RC0 + MB / L2, total = udl ? w1 * L1 + w2 * L2 : v.w1 + v.w2, RB = total - RA - RC;
      // Span 1: x from A (0) to B (L1). Span 2: x from C (0) to B (L2), load position from C = b2.
      const span = (L, R, w, P, ap) => { let Mmax = 0, dmax = 0; for (let i = 0; i <= 400; i++) { const x = L * i / 400; const M = R * x - (udl ? w * x * x / 2 : (x > ap ? P * (x - ap) : 0)); Mmax = Math.max(Mmax, M);
        const bb = L - ap, yl = udl ? w * x * (L ** 3 - 2 * L * x * x + x ** 3) / (24 * EI) : (x <= ap ? P * bb * x * (L * L - bb * bb - x * x) / (6 * L * EI) : P * ap * (L - x) * (2 * L * x - x * x - ap * ap) / (6 * L * EI)), ym = MB * x * (L * L - x * x) / (6 * EI * L); dmax = Math.max(dmax, yl + ym); } return { Mmax, dmax }; };
      const s1 = span(L1, RA, w1, v.w1, v.a1), s2 = span(L2, RC, w2, v.w2, b2), Mmax = Math.max(Math.abs(MB), s1.Mmax, s2.Mmax), stress = Mmax * v.c / v.I, ok = stress <= v.allow;
      return output({ RA, RB, RC, MB, M1: s1.Mmax, M2: s2.Mmax, d1: s1.dmax, d2: s2.dmax, stress }, 'Maximum stress (MPa)', stress,
        [m('Reactions A / B / C', `${q(RA, '', 1)} / ${q(RB, '', 1)} / ${q(RC, 'N', 1)}`), m('Centre support moment', q(MB / 1e6, 'kN·m', 3)), m('Maximum span moments', `${q(s1.Mmax / 1e6, '', 3)} / ${q(s2.Mmax / 1e6, 'kN·m', 3)}`), m('Maximum bending stress', q(stress, 'MPa', 1)), m('Maximum deflections', `${q(s1.dmax, '', 3)} / ${q(s2.dmax, 'mm', 3)}`)],
        'Continuous beam over three supports.', 'Rigid, level supports; constant section.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('Pattern loading', 'verify', 'Check with one span unloaded; it can increase span moments and deflection.')],
        });
    },
    "beam-cases-more": (v) => {
      const L = v.L, a = v.a, P = v.load, EI = v.E * 1000 * v.I; let M, d, R1, R2;
      if (v.case === 'ff-offset') { if (a <= 0 || a >= L) return invalid('The load must lie between the supports.'); const b = L - a; R1 = P * b * b * (3 * a + b) / L ** 3; R2 = P - R1; M = Math.max(P * a * b * b / L ** 2, P * a * a * b / L ** 2, 2 * P * a * a * b * b / L ** 3); d = P * a ** 3 * b ** 3 / (3 * EI * L ** 3); }
      else if (v.case === 'guided-point') { R1 = P; R2 = 0; M = P * L / 2; d = P * L ** 3 / (12 * EI); }
      else if (v.case === 'guided-udl') { R1 = P; R2 = 0; M = P * L / 3; d = P * L ** 3 / (24 * EI); }
      else if (v.case === 'prop-point') { if (a <= 0 || a >= L) return invalid('The load must lie within the span.'); R2 = P * a * a * (3 * L - a) / (2 * L ** 3); R1 = P - R2; const MA = P * a - R2 * L; M = Math.max(Math.abs(MA), R2 * (L - a)); d = 0; for (let i = 0; i <= 400; i++) { const x = L * i / 400, yp = x <= a ? P * x * x * (3 * a - x) / (6 * EI) : P * a * a * (3 * x - a) / (6 * EI), yr = R2 * x * x * (3 * L - x) / (6 * EI); d = Math.max(d, yp - yr); } }
      else if (v.case === 'ss-two') { if (2 * a > L) return invalid('The loads must lie within the span (a ≤ L/2).'); R1 = R2 = P; M = P * a; d = P * a * (3 * L * L - 4 * a * a) / (24 * EI); }
      else { if (a + v.cl > L || v.cl <= 0) return invalid('The loaded length must lie within the span.'); const w = P / v.cl; R1 = P * (L - a - v.cl / 2) / L; R2 = P - R1; const Mx = (x) => R1 * x - (x > a ? w * Math.min(x - a, v.cl) * (x - a - Math.min(x - a, v.cl) / 2) : 0);
        const n = 800, h = L / n, Ms = Array.from({ length: n + 1 }, (_, i) => Mx(i * h)); M = Math.max(...Ms); const th = [0]; for (let i = 1; i <= n; i++) th.push(th[i - 1] + (Ms[i - 1] + Ms[i]) / 2 * h / EI); const y = [0]; for (let i = 1; i <= n; i++) y.push(y[i - 1] + (th[i - 1] + th[i]) / 2 * h); const corr = y[n] / L; d = Math.max(...y.map((yy, i) => -(yy - corr * i * h))); }
      const stress = M * v.c / v.I, ok = stress <= v.allow;
      return output({ R1, R2, M, d, stress }, 'Maximum deflection (mm)', d,
        [m('Reactions', `${q(R1, 'N', 1)} and ${q(R2, 'N', 1)}`), m('Maximum bending moment', q(M / 1e6, 'kN·m', 4)), m('Bending stress', q(stress, 'MPa', 1)), m('Maximum deflection', q(d, 'mm', 4)), m('Span / deflection', d > 0 ? `L/${q(L / d, '', 0)}` : 'No deflection')],
        'Elastic beam solution.', 'Rigid fixed ends; constant section.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('End fixity', 'verify', 'Confirm the ends are really fixed or guided.')],
        });
    },
    "shaft-combined-stress": (v) => {
      if (v.di >= v.d) return invalid('The bore must be smaller than the outside diameter.');
      const A = PI * (v.d ** 2 - v.di ** 2) / 4, Z = PI * (v.d ** 4 - v.di ** 4) / (32 * v.d), sig = v.P / A + Math.sign(v.P || 1) * v.M * 1000 / Z, tau = v.T * 1000 / (2 * Z);
      const s1 = sig / 2 + Math.sqrt((sig / 2) ** 2 + tau * tau), s2 = sig / 2 - Math.sqrt((sig / 2) ** 2 + tau * tau), vm = Math.sqrt(sig * sig + 3 * tau * tau), tr = Math.sqrt(sig * sig + 4 * tau * tau), n = vm > 0 ? v.Sy / vm : 1e9, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ sigma: sig, tau, s1, s2, vm, tr, n }, 'von Mises stress (MPa)', vm,
        [m('Combined normal stress', q(sig, 'MPa', 1)), m('Torsional shear stress', q(tau, 'MPa', 1)), m('Principal stresses', `${q(s1, '', 1)} / ${q(s2, 'MPa', 1)}`), m('von Mises / Tresca', `${q(vm, '', 1)} / ${q(tr, 'MPa', 1)}`), m('Safety factor (von Mises)', q(n, '', 2))],
        'Combined stresses at the outer fibre.', 'Static strength; no stress concentration.', {
          text: vd.text, tone: vd.tone,
          checks: [check('von Mises safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Tresca safety factor', v.Sy / tr >= v.req ? 'pass' : 'warn', `${q(v.Sy / tr, '', 2)} by maximum shear.`)],
        });
    },
    "principal-stress-3d": (v) => {
      const I1 = v.sx + v.sy + v.sz, I2 = v.sx * v.sy + v.sy * v.sz + v.sz * v.sx - v.txy ** 2 - v.tyz ** 2 - v.tzx ** 2;
      const I3 = v.sx * v.sy * v.sz + 2 * v.txy * v.tyz * v.tzx - v.sx * v.tyz ** 2 - v.sy * v.tzx ** 2 - v.sz * v.txy ** 2;
      const p = I2 - I1 * I1 / 3, qq = -2 * I1 ** 3 / 27 + I1 * I2 / 3 - I3; let s;
      if (Math.abs(p) < 1e-12) s = [I1 / 3, I1 / 3, I1 / 3]; else { const r = 2 * Math.sqrt(-p / 3), arg = Math.max(-1, Math.min(1, 3 * qq / (p * r))), th = Math.acos(arg) / 3; s = [0, 1, 2].map((k) => r * Math.cos(th - 2 * PI * k / 3) + I1 / 3); }
      s.sort((a, b) => b - a); const [s1, s2, s3] = s, tmax = (s1 - s3) / 2, vm = Math.sqrt(0.5 * ((s1 - s2) ** 2 + (s2 - s3) ** 2 + (s3 - s1) ** 2)), n = vm > 0 ? v.Sy / vm : 1e9;
      return output({ s1, s2, s3, tmax, vm, n }, 'von Mises stress (MPa)', vm,
        [m('Principal stresses', `${q(s1, '', 2)} / ${q(s2, '', 2)} / ${q(s3, 'MPa', 2)}`), m('Maximum shear', q(tmax, 'MPa', 2)), m('von Mises stress', q(vm, 'MPa', 2)), m('Safety factor against yield', q(n, '', 2)), m('Invariants I₁, I₂, I₃', `${q(I1, '', 2)}, ${q(I2, '', 1)}, ${q(I3, '', 0)}`)],
        'Principal stresses of the 3D state.', 'Isotropic material.', { checks: [check('Yield', n >= 1 ? 'pass' : 'fail', `Safety factor ${q(n, '', 2)} by von Mises.`)] });
    },
    "rankine-column": (v) => {
      const r = Math.sqrt(v.I / v.A), lam = v.K * v.L / r, a = v.aRank || v.Sc / (PI * PI * v.E * 1000), Pcr = v.Sc * v.A / (1 + a * lam * lam), n = Pcr / v.P, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ lambda: lam, a, Pcr, n }, 'Safety factor', n,
        [m('Slenderness ratio', q(lam, '', 1)), m('Rankine constant', `1/${q(1 / a, '', 0)}`), m('Crippling load', q(Pcr / 1000, 'kN', 2)), m('Crushing load (short column)', q(v.Sc * v.A / 1000, 'kN', 1)), m('Safety factor', q(n, '', 2))],
        'Rankine–Gordon column load.', 'Empirical formula.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Rankine constant', v.aRank ? 'verify' : 'pass', v.aRank ? 'Confirm the empirical constant suits the material and end conditions.' : 'Theoretical constant used.')],
        });
    },
    "section-shapes-more": (v) => {
      const { A, B, C, D } = v; let area, xb = 0, yb = 0, Ix, Iy, Ixy = 0, H, W;
      const hexI = (af) => { const s = af / Math.sqrt(3); return { a: 1.5 * Math.sqrt(3) * s * s, I: 5 * Math.sqrt(3) * s ** 4 / 16 }; };
      switch (v.shape) {
        case 'ellipse': area = PI * A * B / 4; Ix = PI * A * B ** 3 / 64; Iy = PI * B * A ** 3 / 64; H = B; W = A; break;
        case 'hellipse': if (C >= A || D >= B) return invalid('The inner axes must be smaller than the outer axes.'); area = PI * (A * B - C * D) / 4; Ix = PI * (A * B ** 3 - C * D ** 3) / 64; Iy = PI * (B * A ** 3 - D * C ** 3) / 64; H = B; W = A; break;
        case 'half': { const r = A / 2; area = PI * r * r / 2; yb = 4 * r / (3 * PI); Ix = (PI / 8 - 8 / (9 * PI)) * r ** 4; Iy = PI * r ** 4 / 8; H = r; W = A; break; }
        case 'hex': { const h = hexI(A); area = h.a; Ix = Iy = h.I; H = A; W = 2 * A / Math.sqrt(3); break; }
        case 'tri': area = A * B / 2; yb = B / 3; Ix = A * B ** 3 / 36; Iy = B * A ** 3 / 48; H = B; W = A; break;
        case 'cirhex': { const h = hexI(C); if (2 * C / Math.sqrt(3) >= A) return invalid('The hexagonal hole must fit inside the circle.'); area = PI * A * A / 4 - h.a; Ix = Iy = PI * A ** 4 / 64 - h.I; H = W = A; break; }
        case 'cirsq': if (C * Math.SQRT2 >= A) return invalid('The square hole must fit inside the circle.'); area = PI * A * A / 4 - C * C; Ix = Iy = PI * A ** 4 / 64 - C ** 4 / 12; H = W = A; break;
        default: {
          let R;
          if (v.shape === 'zsec') { if (2 * C >= A || D >= B) return invalid('Flanges and web do not fit the overall size.'); R = [[0, A - C, B, C], [B - D, 0, B, C], [B - D, C, D, A - 2 * C]]; W = 2 * B - D; H = A; }
          else { if (C >= Math.min(A, B)) return invalid('The bar thickness must be less than the height and width.'); R = [[(B - C) / 2, 0, C, A], [0, (A - C) / 2, (B - C) / 2, C], [(B + C) / 2, (A - C) / 2, (B - C) / 2, C]]; W = B; H = A; }
          area = R.reduce((s, r) => s + r[2] * r[3], 0); xb = R.reduce((s, r) => s + r[2] * r[3] * (r[0] + r[2] / 2), 0) / area; yb = R.reduce((s, r) => s + r[2] * r[3] * (r[1] + r[3] / 2), 0) / area; Ix = 0; Iy = 0;
          for (const [x0, y0, w, h] of R) { const aa = w * h, dx = x0 + w / 2 - xb, dy = y0 + h / 2 - yb; Ix += w * h ** 3 / 12 + aa * dy * dy; Iy += h * w ** 3 / 12 + aa * dx * dx; Ixy += aa * dx * dy; }
        }
      }
      if (!(area > 0)) return invalid('The dimensions give no area.');
      const avg = (Ix + Iy) / 2, rr = Math.sqrt(((Ix - Iy) / 2) ** 2 + Ixy * Ixy), ymax = Math.max(yb, H - yb) || H / 2, xmax = Math.max(xb, W - xb) || W / 2;
      const yref = ['ellipse', 'hellipse', 'hex', 'cirhex', 'cirsq'].includes(v.shape) ? H / 2 : ymax, xref = ['ellipse', 'hellipse', 'hex', 'cirhex', 'cirsq', 'half', 'tri'].includes(v.shape) ? W / 2 : xmax;
      return output({ area, Ix, Iy, Ixy, I1: avg + rr, I2: avg - rr }, 'Ix (mm⁴)', Ix,
        [m('Area', q(area, 'mm²', 2)), m('Centroid', ['half', 'tri'].includes(v.shape) ? `${q(yb, 'mm', 3)} from the base` : ['zsec', 'cross'].includes(v.shape) ? `x ${q(xb, '', 3)}, y ${q(yb, 'mm', 3)} from bottom-left` : 'At the geometric centre'), m('Ix / Iy', `${q(Ix, '', 1)} / ${q(Iy, 'mm⁴', 1)}`), m('Principal I₁ / I₂', `${q(avg + rr, '', 1)} / ${q(avg - rr, 'mm⁴', 1)}`), m('Zx / Zy (minimum)', `${q(Ix / yref, '', 1)} / ${q(Iy / xref, 'mm³', 1)}`), m('rx / ry', `${q(Math.sqrt(Ix / area), '', 3)} / ${q(Math.sqrt(Iy / area), 'mm', 3)}`), m('Polar moment Ix + Iy', q(Ix + Iy, 'mm⁴', 1))],
        'Properties of the selected section.', 'Sharp corners.', { checks: [check('Torsion', 'verify', 'For non-circular sections, Ix + Iy is not the torsional constant.')] });
    },
    "mass-inertia-more": (v) => {
      const a = v.A / 2000, b = v.B / 2000, c = v.C / 2000, M = v.mass; let J;
      switch (v.shape) {
        case 'cone': J = 0.3 * M * a * a; break;
        case 'conebase': J = M * (3 * a * a / 20 + (v.B / 1000) ** 2 / 10); break;
        case 'hsphere': if (b >= a) return invalid('The inner diameter must be smaller.'); J = 2 * M * (a ** 5 - b ** 5) / (5 * (a ** 3 - b ** 3)); break;
        case 'shell': J = 2 * M * a * a / 3; break;
        case 'torus': J = M * (a * a + 0.75 * b * b); break;
        case 'ellipsoid': J = M * (b * b + c * c) / 5; break;
        case 'ring': J = M * a * a / 2; break;
        default: J = M * a * a;
      }
      const Jt = J + M * (v.offset / 1000) ** 2;
      return output({ J0: J, J: Jt, k: Math.sqrt(Jt / M) * 1000 }, 'Moment of inertia (kg·m²)', Jt,
        [m('About the body axis', q(J, 'kg·m²', 6)), m('About the rotation axis', q(Jt, 'kg·m²', 6)), m('Radius of gyration', q(Math.sqrt(Jt / M) * 1000, 'mm', 2))],
        'Mass moment of inertia of the body.', 'Uniform density.', { checks: [check('Shape idealisation', 'verify', 'Use CAD mass properties for complex parts.')] });
    },
    "force-system": (v) => {
      let Rx = 0, Ry = 0, M = 0, n = 0;
      for (let i = 1; i <= 4; i++) { const F = v['F' + i]; if (!F) continue; n++; const fx = F * Math.cos(rad(v['a' + i])), fy = F * Math.sin(rad(v['a' + i])); Rx += fx; Ry += fy; M += v['x' + i] * fy - v['y' + i] * fx; }
      if (!n) return invalid('Enter at least one force.');
      const clean = (z) => (Math.abs(z) < 1e-9 ? 0 : z); Rx = clean(Rx); Ry = clean(Ry);
      const R = Math.hypot(Rx, Ry), x0 = Ry !== 0 ? M / Ry : null, y0 = Rx !== 0 ? -M / Rx : null;
      return output({ Rx, Ry, R, M, x0: x0 ?? 0 }, 'Resultant (N)', R,
        [m('Resultant', R > 0 ? `${q(R, 'N', 2)} at ${q(deg(Math.atan2(Ry, Rx)), '°', 3)}` : 'Zero: the system is a couple'), m('Components Rx / Ry', `${q(Rx, '', 2)} / ${q(Ry, 'N', 2)}`), m('Moment about origin', q(M / 1000, 'N·m', 3)), m('Line of action crosses X axis at', x0 === null ? 'Parallel to the X axis' : q(x0, 'mm', 3)), m('Line of action crosses Y axis at', y0 === null ? 'Parallel to the Y axis' : q(y0, 'mm', 3))],
        R > 0 ? 'Single equivalent force and its position.' : 'The forces reduce to a pure couple.', 'Coplanar forces.', { checks: [check('Sign convention', 'verify', 'Directions anticlockwise from +X; moments anticlockwise positive.')] });
    },
    "square-wire-spring": (v) => {
      const C = v.D / v.a;
      if (C <= 1.5) return invalid('The mean diameter is too small for this wire.');
      if (v.Lw > v.L0) return invalid('The working length must not exceed the free length.');
      const k = v.G * 1000 * v.a ** 4 / (5.58 * v.Na * v.D ** 3), F = k * (v.L0 - v.Lw), K = 0.96 * ((4 * C - 1) / (4 * C - 4) + 0.615 / C), S = F * v.D / (0.416 * v.a ** 3), Sc = K * S, ok = Sc <= v.allow;
      return output({ k, F, S, Sc, C }, 'Load at working length (N)', F,
        [m('Spring rate', q(k, 'N/mm', 3)), m('Load at working length', q(F, 'N', 1)), m('Uncorrected stress', q(S, 'MPa', 0)), m('Corrected stress', q(Sc, 'MPa', 0)), m('Spring index D/a', q(C, '', 2))],
        'Square-wire spring at its working length.', 'Square section assumed in the coil.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Corrected stress', ok ? 'pass' : 'fail', `${q(Sc, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Solid length', 'verify', 'Check the working length stays above solid length (coils × wire side).')],
        });
    },
    "journal-bearing-petroff": (v) => {
      const r = v.d / 2000, L = v.L / 1000, c = v.c / 1000, mu = v.mu / 1000, Nn = v.rpm / 60, P = v.W / (2 * r * L);
      const T = 4 * PI * PI * r ** 3 * L * mu * Nn / c, f = 2 * PI * PI * (mu * Nn / P) * (r / c), S = (r / c) ** 2 * mu * Nn / P, Ploss = 2 * PI * Nn * T;
      return output({ P, T, f, S, Ploss }, 'Sommerfeld number', S,
        [m('Unit load', q(P / 1e6, 'MPa', 3)), m('Friction torque (Petroff)', q(T, 'N·m', 4)), m('Coefficient of friction', q(f, '', 5)), m('Power loss', q(Ploss, 'W', 1)), m('Sommerfeld number', q(S, '', 4)), m('Clearance ratio c/r', q(c / r, '', 5))],
        'Petroff friction and Sommerfeld number.', 'Concentric journal approximation.', { checks: [check('Load level', S > 0.15 ? 'pass' : 'verify', S > 0.15 ? 'Lightly loaded: Petroff is a reasonable estimate.' : 'Heavily loaded: use design charts with this Sommerfeld number.')] });
    },
    "thrust-bearing-pads": (v) => {
      if (v.Di >= v.Do) return invalid('The inside diameter must be smaller.');
      const A = PI * (v.Do ** 2 - v.Di ** 2) / 4 * v.fill / 100, P = v.W / A, V = PI * (v.Do + v.Di) / 2 * v.rpm / 60000, PV = P * V, okP = P <= v.Pallow, okPV = !v.PVallow || PV <= v.PVallow;
      return output({ A, P, V, PV }, 'Unit load (MPa)', P,
        [m('Pad area', q(A, 'mm²', 0)), m('Unit load', q(P, 'MPa', 3)), m('Mean sliding velocity', q(V, 'm/s', 2)), m('PV', q(PV, 'MPa·m/s', 3))],
        'Thrust bearing loading.', 'Screening only.', {
          text: okP && okPV ? 'WITHIN LIMITS' : 'OUTSIDE LIMITS', tone: okP && okPV ? 'good' : 'bad',
          checks: [check('Unit load', okP ? 'pass' : 'fail', `${q(P, 'MPa', 2)} against ${q(v.Pallow, 'MPa')}.`), check('PV', !v.PVallow ? 'verify' : okPV ? 'pass' : 'fail', !v.PVallow ? 'No PV limit entered.' : `${q(PV, '', 2)} against ${q(v.PVallow, 'MPa·m/s')}.`)],
        });
    },
    "gas-compression-process": (v) => {
      const n = v.process === 'iso' ? 1 : v.process === 'adi' ? v.k : v.n, P1 = v.p1 * 1e5, P2 = v.p2 * 1e5, V1 = v.V1 / 1000, T1 = v.T1 + 273.15;
      if (T1 <= 0) return invalid('The temperature is below absolute zero.');
      const V2 = V1 * Math.pow(P1 / P2, 1 / n), T2 = n === 1 ? T1 : T1 * Math.pow(P2 / P1, (n - 1) / n), W = n === 1 ? P1 * V1 * Math.log(P2 / P1) : (P2 * V2 - P1 * V1) / (n - 1);
      return output({ V2: V2 * 1000, T2c: T2 - 273.15, W: W / 1000 }, 'Final temperature (°C)', T2 - 273.15,
        [m('Final volume', q(V2 * 1000, 'L', 3)), m('Final temperature', q(T2 - 273.15, '°C', 1)), m(W >= 0 ? 'Work done on the gas' : 'Work done by the gas', q(Math.abs(W) / 1000, 'kJ', 3)), m('Exponent used', q(n, '', 3))],
        `${v.process === 'iso' ? 'Isothermal' : v.process === 'adi' ? 'Adiabatic' : 'Polytropic'} process between the two pressures.`, 'Ideal gas, closed system.', {
          checks: [check('Temperature', T2 - 273.15 < 200 ? 'pass' : 'warn', `Final temperature ${q(T2 - 273.15, '°C', 0)}; check lubricant and seal limits.`)],
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
