// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook10). SI units are explicit at each boundary.
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
    "rect-bar-torsion": (v) => {
      const b = Math.max(v.b, v.c), c = Math.min(v.b, v.c), Tn = v.T * 1000, tau = Tn * (3 * b + 1.8 * c) / (b * b * c * c);
      const K = b * c ** 3 * (1 / 3 - 0.21 * (c / b) * (1 - c ** 4 / (12 * b ** 4))), twist = deg(Tn * v.L / (K * v.G * 1000)), ok = tau <= v.allow;
      return output({ tau, K, twist }, 'Maximum shear stress (MPa)', tau,
        [m('Maximum shear stress', q(tau, 'MPa', 1)), m('Torsional constant K', q(K, 'mm⁴', 0)), m('Angle of twist', q(twist, '°', 3)), m('Stress / allowable', q(tau / v.allow, '', 3))],
        'Torsion of a solid rectangular bar.', 'Roark approximations; free warping.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Shear stress', ok ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`)],
        });
    },
    "curved-beam": (v) => {
      const ro = v.ri + v.h, rc = v.ri + v.h / 2, rn = v.h / Math.log(ro / v.ri), e = rc - rn, A = v.b * v.h, M = v.P * rc;
      const si = v.P / A + M * (rn - v.ri) / (A * e * v.ri), so = v.P / A - M * (ro - rn) / (A * e * ro), sStraight = v.P / A + 6 * M / (v.b * v.h * v.h), ok = Math.max(Math.abs(si), Math.abs(so)) <= v.allow;
      return output({ si, so, e, sStraight, factor: (si - v.P / A) / (6 * M / (v.b * v.h * v.h)) }, 'Inner fibre stress (MPa)', si,
        [m('Inner fibre stress', q(si, 'MPa', 1)), m('Outer fibre stress', q(so, 'MPa', 1)), m('Neutral axis shift e', q(e, 'mm', 3)), m('Straight-beam inner stress', q(sStraight, 'MPa', 1)), m('Curvature factor (bending)', q((si - v.P / A) / (6 * M / (v.b * v.h * v.h)), '', 3))],
        'Winkler–Bach stresses in the curved section.', 'Rectangular section, elastic.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Maximum fibre stress', ok ? 'pass' : 'fail', `${q(Math.max(Math.abs(si), Math.abs(so)), 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('Lifting standard', 'verify', 'Lifting hooks must be rated and proof-tested to their standard.')],
        });
    },
    "tube-collapse": (v) => {
      if (v.t >= v.D / 2) return invalid('The wall is too thick for this diameter.');
      const Dm = v.D - v.t, pcr = 2 * v.E * 1000 / (1 - v.nu ** 2) * (v.t / Dm) ** 3, py = 2 * v.Sy * v.t / Dm, gov = Math.min(pcr, py), n = gov / v.p, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ pcr, py, gov, n }, 'Safety factor', n,
        [m('Elastic collapse pressure', q(pcr, 'MPa', 3)), m('Yield-limited pressure', q(py, 'MPa', 2)), m('Governing', pcr < py ? 'Elastic buckling' : 'Yield'), m('Safety factor', q(n, '', 2)), m('D/t ratio', q(v.D / v.t, '', 1))],
        `Collapse of a long tube governed by ${pcr < py ? 'elastic buckling' : 'yield'}.`, 'Long, round tube; code design required for vessels.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Out-of-roundness and stiffener spacing', 'verify', 'Use the code charts for the actual length and ovality.')],
        });
    },
    "eccentric-column": (v) => {
      const E = v.E * 1000, r = Math.sqrt(v.I / v.A), Le = v.K * v.L, PE = PI * PI * E * v.I / (Le * Le);
      const smax = (P) => P / v.A * (1 + v.e * v.c / (r * r) / Math.cos(Le / (2 * r) * Math.sqrt(P / (v.A * E))));
      if (v.P >= PE) return invalid('The load is at or above the Euler buckling load.');
      const s0 = smax(v.P); let lo = 0, hi = PE / v.P * 0.999999;
      if (smax(hi * v.P) < v.Sy) lo = hi; else for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (smax(mid * v.P) < v.Sy) lo = mid; else hi = mid; }
      const n = lo, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ smax: s0, PE, n }, 'Load factor to yield', n,
        [m('Maximum stress', q(s0, 'MPa', 1)), m('Direct stress P/A', q(v.P / v.A, 'MPa', 1)), m('Euler load', q(PE / 1000, 'kN', 2)), m('Load factor to first yield', q(n, '', 3))],
        'Secant-formula peak stress for the offset load.', 'Elastic member with equal end eccentricities.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Load factor to yield', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 2)}.`), check('Stress at applied load', s0 <= v.Sy ? 'pass' : 'fail', `${q(s0, 'MPa', 1)} against ${q(v.Sy, 'MPa')}.`)],
        });
    },
    "beam-impact": (v) => {
      const W = v.mass * 9.80665, EI = v.E * 1000 * v.I, ss = v.support === 'ss', dst = ss ? W * v.L ** 3 / (48 * EI) : W * v.L ** 3 / (3 * EI), M = ss ? W * v.L / 4 : W * v.L, sst = M * v.c / v.I;
      const k = 1 + Math.sqrt(1 + 2 * v.h / dst), sd = k * sst, ok = sd <= v.allow;
      return output({ dst, sst, k, dd: k * dst, sd }, 'Dynamic stress (MPa)', sd,
        [m('Static deflection', q(dst, 'mm', 4)), m('Static stress', q(sst, 'MPa', 2)), m('Impact factor', q(k, '', 2)), m('Dynamic deflection', q(k * dst, 'mm', 3)), m('Dynamic stress', q(sd, 'MPa', 1))],
        'Energy-method impact on an elastic beam.', 'Beam mass and local effects ignored.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Dynamic stress', ok ? 'pass' : 'fail', `${q(sd, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`)],
        });
    },
    "section-shapes": (v) => {
      const { H, B, tf, tw } = v; let R;
      if (v.shape === 'I') { if (2 * tf >= H || tw >= B) return invalid('Flanges and web do not fit inside the overall size.'); R = [[0, 0, B, tf], [0, H - tf, B, tf], [(B - tw) / 2, tf, tw, H - 2 * tf]]; }
      else if (v.shape === 'T') { if (tf >= H || tw >= B) return invalid('Flange and web do not fit inside the overall size.'); R = [[0, H - tf, B, tf], [(B - tw) / 2, 0, tw, H - tf]]; }
      else if (v.shape === 'C') { if (2 * tf >= H || tw >= B) return invalid('Flanges and web do not fit inside the overall size.'); R = [[0, 0, tw, H], [tw, H - tf, B - tw, tf], [tw, 0, B - tw, tf]]; }
      else { if (tf >= H || tw >= B) return invalid('Leg thicknesses must be less than the leg lengths.'); R = [[0, 0, tw, H], [tw, 0, B - tw, tf]]; }
      const A = R.reduce((s, r) => s + r[2] * r[3], 0), xb = R.reduce((s, r) => s + r[2] * r[3] * (r[0] + r[2] / 2), 0) / A, yb = R.reduce((s, r) => s + r[2] * r[3] * (r[1] + r[3] / 2), 0) / A;
      let Ix = 0, Iy = 0, Ixy = 0;
      for (const [x0, y0, w, h] of R) { const a = w * h, dx = x0 + w / 2 - xb, dy = y0 + h / 2 - yb; Ix += w * h ** 3 / 12 + a * dy * dy; Iy += h * w ** 3 / 12 + a * dx * dx; Ixy += a * dx * dy; }
      const avg = (Ix + Iy) / 2, rr = Math.sqrt(((Ix - Iy) / 2) ** 2 + Ixy * Ixy), I1 = avg + rr, I2 = avg - rr, Zx = Ix / Math.max(yb, H - yb), Zy = Iy / Math.max(xb, B - xb);
      return output({ A, xb, yb, Ix, Iy, Ixy, I1, I2, Zx, Zy }, 'Ix (mm⁴)', Ix,
        [m('Area', q(A, 'mm²', 1)), m('Mass per metre', q(A * 1e-6 * v.rho, 'kg/m', 2)), m('Centroid from bottom-left', `x ${q(xb, '', 2)}, y ${q(yb, 'mm', 2)}`), m('Ix / Iy', `${q(Ix, '', 0)} / ${q(Iy, 'mm⁴', 0)}`), m('Principal I₁ / I₂', `${q(I1, '', 0)} / ${q(I2, 'mm⁴', 0)}`), m('Zx / Zy (minimum)', `${q(Zx, '', 0)} / ${q(Zy, 'mm³', 0)}`), m('rx / ry', `${q(Math.sqrt(Ix / A), '', 2)} / ${q(Math.sqrt(Iy / A), 'mm', 2)}`), m('Least radius of gyration', q(Math.sqrt(I2 / A), 'mm', 2))],
        'Section properties from rectangular parts.', 'Root radii ignored.', {
          checks: [check('Rolled sections', 'verify', 'For rolled sections, use the maker’s tables, which include root radii.')],
        });
    },
    "thin-tube-torsion": (v) => {
      const round = v.shape === 'round', bm = v.b - v.t, hm = v.h - v.t;
      if (bm <= 0 || (!round && hm <= 0)) return invalid('The wall is too thick for the section size.');
      const Am = round ? PI * bm * bm / 4 : bm * hm, s = round ? PI * bm : 2 * (bm + hm), Tn = v.T * 1000, tau = Tn / (2 * Am * v.t), J = 4 * Am * Am * v.t / s, twist = deg(Tn * v.L / (v.G * 1000 * J)), ok = tau <= v.allow;
      return output({ Am, tau, J, twist }, 'Shear stress (MPa)', tau,
        [m('Enclosed mid-line area', q(Am, 'mm²', 1)), m('Shear stress', q(tau, 'MPa', 1)), m('Torsional constant J', q(J, 'mm⁴', 0)), m('Angle of twist', q(twist, '°', 3))],
        'Closed thin-walled section in torsion.', 'Thin walls; corner radii ignored.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Shear stress', ok ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('Thin-wall assumption', v.t <= 0.1 * Math.min(v.b, round ? v.b : v.h) ? 'pass' : 'warn', 'Accurate when the wall is under about a tenth of the section size.')],
        });
    },
    "rotating-disc": (v) => {
      if (v.Di >= v.Do) return invalid('The bore must be smaller than the outside diameter.');
      const w = 2 * PI * v.rpm / 60, b = v.Do / 2000, a = v.Di / 2000, solid = v.Di === 0;
      const smax = (solid ? (3 + v.nu) / 8 * v.rho * w * w * b * b : (3 + v.nu) / 4 * v.rho * w * w * (b * b + (1 - v.nu) / (3 + v.nu) * a * a)) / 1e6, n = v.Sy / smax, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ smax, n, rim: w * b, ny: v.rpm * Math.sqrt(v.Sy / smax) }, 'Maximum stress (MPa)', smax,
        [m('Maximum stress', `${q(smax, 'MPa', 1)} ${solid ? 'at the centre' : 'at the bore (hoop)'}`), m('Rim speed', q(w * b, 'm/s', 1)), m('Safety factor against yield', q(n, '', 2)), m('Speed at which yield is reached', q(v.rpm * Math.sqrt(v.Sy / smax), 'rpm', 0))],
        `Centrifugal stress in a ${solid ? 'solid' : 'bored'} disc.`, 'Flat, uniform disc; no holes or blades.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Stress raisers', 'verify', 'Keyways, holes and slots raise local stress.')],
        });
    },
    "axial-bending-stress": (v) => {
      const A = v.b * v.h, Zx = v.b * v.h * v.h / 6, Zy = v.h * v.b * v.b / 6, s0 = v.P * 1000 / A, sx = v.Mx * 1e6 / Zx, sy = v.My * 1e6 / Zy;
      const corners = [['+X, +Y', s0 + sx + sy], ['−X, +Y', s0 + sx - sy], ['+X, −Y', s0 - sx + sy], ['−X, −Y', s0 - sx - sy]], vals = corners.map((c) => c[1]);
      const max = Math.max(...vals), min = Math.min(...vals), peak = Math.max(Math.abs(max), Math.abs(min)), ok = peak <= v.allow;
      return output({ max, min, peak }, 'Peak stress magnitude (MPa)', peak,
        [m('Direct stress P/A', q(s0, 'MPa', 2)), m('Bending stress Mx/Zx', q(sx, 'MPa', 2)), m('Bending stress My/Zy', q(sy, 'MPa', 2)), m('Highest corner stress', q(max, 'MPa', 2)), m('Lowest corner stress', q(min, 'MPa', 2))],
        'Linear superposition of axial and bending stresses.', 'Solid rectangle, elastic.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          table: tbl('Corner stresses', ['Corner', 'Stress (MPa)'], corners.map((c) => [c[0], q(c[1], '', 2)])),
          checks: [check('Peak stress', ok ? 'pass' : 'fail', `${q(peak, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('Sign of stress', max <= 0 || min >= 0 ? 'pass' : 'warn', max <= 0 || min >= 0 ? 'The whole section has one sign of stress.' : 'Part of the section is in tension and part in compression; check bearing surfaces for lift-off.')],
        });
    },
    "leaf-spring": (v) => {
      const E = v.E * 1000, I = v.b * v.t ** 3; let sigma, defl;
      if (v.type === 'single') { sigma = 6 * v.F * v.L / (v.b * v.t * v.t); defl = 4 * v.F * v.L ** 3 / (E * I); }
      else if (v.type === 'multi') { sigma = 6 * v.F * v.L / (v.n * v.b * v.t * v.t); defl = 6 * v.F * v.L ** 3 / (v.n * E * I); }
      else { sigma = 3 * v.F * v.L / (2 * v.n * v.b * v.t * v.t); defl = 3 * v.F * v.L ** 3 / (8 * v.n * E * I); }
      const ok = sigma <= v.allow;
      return output({ sigma, defl, k: v.F / defl }, 'Deflection (mm)', defl,
        [m('Deflection', q(defl, 'mm', 3)), m('Spring rate', q(v.F / defl, 'N/mm', 3)), m('Maximum bending stress', q(sigma, 'MPa', 0)), m('Deflection / length', q(defl / v.L, '', 3))],
        'Leaf spring under the stated load.', 'Small deflections; inter-leaf friction ignored.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(sigma, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Small deflection', defl / v.L <= 0.3 ? 'pass' : 'warn', defl / v.L <= 0.3 ? 'Within the small-deflection range.' : 'Large deflection: the linear formula becomes inaccurate.')],
        });
    },
    "torsion-bar": (v) => {
      const T = v.F * v.arm, J = PI * v.d ** 4 / 32, th = T * v.L / (v.G * 1000 * J), rate = v.G * 1000 * J / v.L, tau = 16 * T / (PI * v.d ** 3), ok = tau <= v.allow;
      return output({ deg: deg(th), rate, tau, tip: v.arm * th }, 'Twist (°)', deg(th),
        [m('Torque', q(T / 1000, 'N·m', 2)), m('Twist', q(deg(th), '°', 3)), m('Torsional rate', q(rate / 1000 * PI / 180, 'N·m/°', 3)), m('Arm-tip deflection', q(v.arm * th, 'mm', 2)), m('Shear stress', q(tau, 'MPa', 0))],
        'Torsion bar under the arm load.', 'Solid round bar; ends not modelled.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Shear stress', ok ? 'pass' : 'fail', `${q(tau, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('End fittings', 'verify', 'Check splines or hexes and their transitions.')],
        });
    },
    "grain-size": (v) => {
      const G = v.mode === 'n100' ? 1 + Math.log2(v.value) : v.mode === 'na' ? 3.321928 * Math.log10(v.value) - 2.954 : -6.643856 * Math.log10(v.value / 1000) - 3.288;
      const NA = Math.pow(2, G - 1) * 15.5, n100 = Math.pow(2, G - 1), lbar = Math.pow(10, -(G + 3.288) / 6.643856) * 1000;
      return output({ G, NA, n100, lbar }, 'ASTM grain size number G', G,
        [m('ASTM grain size number G', q(G, '', 2)), m('Grains per mm² at 1×', q(NA, '', 1)), m('Grains per in² at 100×', q(n100, '', 2)), m('Mean lineal intercept', q(lbar, 'µm', 2))],
        'Grain size number from the measurement.', 'Equiaxed grains.', {
          checks: [check('Method reporting', 'verify', 'Report the measurement method and number of fields with the result.')],
        });
    },
    "corrosion-rate": (v) => {
      const mmy = 87.6 * v.W / (v.rho * v.A * v.hours), life = mmy > 0 ? v.allowance / mmy : 0;
      return output({ mmy, mpy: mmy * 39.37, life }, 'Corrosion rate (mm/y)', mmy,
        [m('Corrosion rate', q(mmy, 'mm/y', 4)), m('Corrosion rate', q(mmy * 39.37, 'mpy', 2)), m('Remaining life of allowance', mmy > 0 ? q(life, 'years', 1) : 'No measurable loss')],
        'Uniform corrosion rate from the coupon.', 'Uniform corrosion; pitting not captured.', {
          checks: [check('Localised corrosion', 'verify', 'Inspect coupons for pitting; uniform rates do not capture it.')],
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
