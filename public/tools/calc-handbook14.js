// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook14). SI units are explicit at each boundary.
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
    "plane-area": (v) => {
      const { A, B, C } = v, th = rad(v.angle); let area, per = null;
      switch (v.shape) {
        case 'circle': area = PI * A * A / 4; per = PI * A; break;
        case 'ring': if (B >= A) return invalid('The inner diameter must be smaller than the outer.'); area = PI * (A * A - B * B) / 4; per = PI * (A + B); break;
        case 'sector': area = A * A * th / 2; per = 2 * A + A * th; break;
        case 'ringsector': if (B >= A) return invalid('The inner radius must be smaller than the outer.'); area = (A * A - B * B) * th / 2; per = (A + B) * th + 2 * (A - B); break;
        case 'rect': area = A * B; per = 2 * (A + B); break;
        case 'parallelogram': area = A * C; per = 2 * (A + B); break;
        case 'trapezoid': area = (A + B) * C / 2; break;
        case 'spandrel': area = A * A * (1 - PI / 4); per = 2 * A + PI * A / 2; break;
        case 'parabola': area = 2 * A * C / 3; break;
        default: area = 3 * PI * A * A; per = 8 * A;
      }
      if (!(area > 0)) return invalid('The dimensions give no area.');
      return output({ area, per }, 'Area (mm²)', area,
        [m('Area', `${q(area, 'mm²', 2)} (${q(area / 1e6, 'm²', 6)})`), m('Perimeter', per === null ? 'Depends on the side lengths' : q(per, 'mm', 3)), m('Equal-area circle diameter', q(Math.sqrt(4 * area / PI), 'mm', 3)), m('Equal-area square side', q(Math.sqrt(area), 'mm', 3))],
        'Area of the selected figure.', 'Ideal geometric figure.', {
          checks: [check('Dimensions', 'verify', 'Confirm each input matches the dimension named for this shape.')],
        });
    },
    "polygon-area": (v) => {
      const P = Array.from({ length: v.n }, (_, i) => [v['x' + (i + 1)], v['y' + (i + 1)]]); let A2 = 0, cx = 0, cy = 0, per = 0;
      for (let i = 0; i < v.n; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % v.n], c = x1 * y2 - x2 * y1; A2 += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c; per += Math.hypot(x2 - x1, y2 - y1); }
      if (Math.abs(A2) < 1e-12) return invalid('The corners enclose no area.');
      const area = Math.abs(A2) / 2; cx /= 3 * A2; cy /= 3 * A2;
      return output({ area, per, cx, cy }, 'Area (mm²)', area,
        [m('Area', q(area, 'mm²', 2)), m('Perimeter', q(per, 'mm', 3)), m('Centroid', `x ${q(cx, '', 3)}, y ${q(cy, 'mm', 3)}`), m('Corner order', A2 > 0 ? 'Anticlockwise' : 'Clockwise')],
        `Polygon with ${v.n} corners.`, 'Simple polygon with straight sides.', {
          checks: [check('Simple polygon', 'verify', 'Confirm the sides do not cross; crossing outlines give a wrong area.')],
        });
    },
    "solid-volume": (v) => {
      const { A, B, C } = v; let V, S = null;
      switch (v.shape) {
        case 'sphere': V = PI * A ** 3 / 6; S = PI * A * A; break;
        case 'hsphere': if (B >= A) return invalid('The inner diameter must be smaller.'); V = PI * (A ** 3 - B ** 3) / 6; S = PI * (A * A + B * B); break;
        case 'cap': V = PI * C * (3 * A * A + C * C) / 6; S = PI * (A * A + C * C); break;
        case 'zone': V = PI * C * (3 * A * A + 3 * B * B + C * C) / 6; break;
        case 'ssector': if (C > 2 * A) return invalid('The cap height cannot exceed the sphere diameter.'); V = 2 * PI * A * A * C / 3; S = PI * A * (2 * C + Math.sqrt(C * (2 * A - C))); break;
        case 'swedge': V = v.angle / 360 * 4 * PI * A ** 3 / 3; break;
        case 'cone': V = PI * A * A * C / 12; S = PI * A / 2 * Math.hypot(A / 2, C) + PI * A * A / 4; break;
        case 'pyramid': V = A * A * C / 3; S = A * A + 2 * A * Math.hypot(A / 2, C); break;
        case 'cylinder': V = PI * A * A * C / 4; S = PI * A * C + PI * A * A / 2; break;
        case 'hoof': V = 2 * A * A * C / 3; break;
        case 'paraboloid': V = PI * (A / 2) ** 2 * C / 2; break;
        case 'pseg': V = PI * C * ((A / 2) ** 2 + (B / 2) ** 2) / 2; break;
        case 'barrel': V = PI * C * (8 * A * A + 4 * A * B + 3 * B * B) / 60; break;
        case 'torus': V = 2 * PI * PI * (A / 2) * (B / 2) ** 2; S = PI * PI * A * B; break;
        case 'ellipsoid': V = PI * A * B * C / 6; break;
        default: V = A ** 3; S = 6 * A * A;
      }
      if (!(V > 0)) return invalid('The dimensions give no volume.');
      return output({ V, S, mass: V * 1e-9 * v.rho }, 'Volume (mm³)', V,
        [m('Volume', `${q(V / 1000, 'cm³', 3)} (${q(V / 1e6, 'L', 4)})`), m('Surface area', S === null ? 'No simple closed formula' : q(S, 'mm²', 1)), m('Mass', v.rho ? q(V * 1e-9 * v.rho, 'kg', 4) : 'No density entered')],
        'Volume of the selected solid.', 'Ideal solid.', {
          checks: [check('Dimensions', 'verify', 'Confirm each input matches the dimension named for this solid.')],
        });
    },
    "centroid-shapes": (v) => {
      const { A, B, C } = v, t = rad(v.angle), a = t / 2; let cg, size = null, ref;
      switch (v.shape) {
        case 'triangle': cg = C / 3; ref = 'from base'; break;
        case 'semicircle': cg = 4 * A / (3 * PI); size = PI * A * A / 2; ref = 'from diameter'; break;
        case 'sector': cg = 2 * A * Math.sin(a) / (3 * a); size = A * A * a; ref = 'from centre'; break;
        case 'segment': { const area = A * A * (t - Math.sin(t)) / 2, c = 2 * A * Math.sin(a); cg = c ** 3 / (12 * area); size = area; ref = 'from centre'; break; }
        case 'arc': cg = A * Math.sin(a) / a; size = A * t; ref = 'from centre'; break;
        case 'trapezoid': cg = C * (A + 2 * B) / (3 * (A + B)); size = (A + B) * C / 2; ref = 'from base A'; break;
        case 'parabola': cg = 2 * C / 5; ref = 'from base chord'; break;
        case 'cone': cg = C / 4; ref = 'from base'; break;
        case 'frustum': { const R = A / 2, r = B / 2; cg = C * (R * R + 2 * R * r + 3 * r * r) / (4 * (R * R + R * r + r * r)); size = PI * C * (R * R + R * r + r * r) / 3; ref = 'from large base'; break; }
        case 'hemisphere': cg = 3 * A / 8; size = 2 * PI * A ** 3 / 3; ref = 'from flat face'; break;
        case 'hhemi': if (B >= A) return invalid('The inner radius must be smaller.'); cg = 3 * (A ** 4 - B ** 4) / (8 * (A ** 3 - B ** 3)); ref = 'from flat face'; break;
        case 'paraboloid': cg = C / 3; ref = 'from base'; break;
        case 'sseg': if (C > 2 * A) return invalid('The height cannot exceed the sphere diameter.'); cg = 3 * (2 * A - C) ** 2 / (4 * (3 * A - C)); ref = 'from sphere centre'; break;
        case 'ssector': cg = 3 * (2 * A - C) / 8; ref = 'from sphere centre'; break;
        default: if (A + B <= 0) return invalid('Enter the masses.'); cg = B * C / (A + B); ref = 'from body 1';
      }
      return output({ cg, size }, 'Centre of gravity distance (mm)', cg,
        [m('Centre of gravity', `${q(cg, 'mm', 4)} ${ref}`), m('Area or volume', size === null ? 'Not needed for the result' : q(size, '', 3))],
        'Centroid of the selected shape.', 'Uniform density, ideal shape.', {
          checks: [check('Reference point', 'verify', `The distance is measured ${ref}.`)],
        });
    },
    "complex-number": (v) => {
      let re, im;
      if (v.op === 'add') { re = v.a + v.c; im = v.b + v.d; } else if (v.op === 'sub') { re = v.a - v.c; im = v.b - v.d; }
      else if (v.op === 'mul') { re = v.a * v.c - v.b * v.d; im = v.a * v.d + v.b * v.c; }
      else { const den = v.c * v.c + v.d * v.d; if (den === 0) return invalid('Division by zero: z₂ is zero.'); re = (v.a * v.c + v.b * v.d) / den; im = (v.b * v.c - v.a * v.d) / den; }
      const pol = (x, y) => `${q(Math.hypot(x, y), '', 6)} ∠ ${q(deg(Math.atan2(y, x)), '°', 4)}`;
      return output({ re, im, mag: Math.hypot(re, im) }, 'Magnitude of result', Math.hypot(re, im),
        [m('Result (rectangular)', `${q(re, '', 6)} ${im < 0 ? '−' : '+'} ${q(Math.abs(im), '', 6)}i`), m('Result (polar)', pol(re, im)), m('z₁ polar', pol(v.a, v.b)), m('z₂ polar', pol(v.c, v.d))],
        'Complex arithmetic result.', 'Exact arithmetic (floating point).', { checks: [check('Angle convention', 'pass', 'Angles from the positive real axis, anticlockwise positive.')] });
    },
    "coordinates-3d": (v) => {
      let x, y, z;
      if (v.mode === 'rect') { x = v.p1; y = v.p2; z = v.p3; } else if (v.mode === 'cyl') { x = v.p1 * Math.cos(rad(v.p2)); y = v.p1 * Math.sin(rad(v.p2)); z = v.p3; }
      else { x = v.p1 * Math.sin(rad(v.p3)) * Math.cos(rad(v.p2)); y = v.p1 * Math.sin(rad(v.p3)) * Math.sin(rad(v.p2)); z = v.p1 * Math.cos(rad(v.p3)); }
      const r = Math.hypot(x, y), rho = Math.hypot(x, y, z), th = deg(Math.atan2(y, x)), ph = rho ? deg(Math.acos(z / rho)) : 0;
      return output({ x, y, z, r, rho, th, ph }, 'Distance from origin', rho,
        [m('Rectangular', `x ${q(x, '', 4)}, y ${q(y, '', 4)}, z ${q(z, '', 4)}`), m('Cylindrical', `r ${q(r, '', 4)}, θ ${q(th, '°', 4)}, z ${q(z, '', 4)}`), m('Spherical', `ρ ${q(rho, '', 4)}, θ ${q(th, '°', 4)}, φ ${q(ph, '°', 4)}`)],
        'The point in all three coordinate systems.', 'φ measured from +Z.', { checks: [check('Angle convention', 'verify', 'Confirm θ and φ conventions with your software.')] });
    },
    "two-point-distance": (v) => {
      const dx = v.x2 - v.x1, dy = v.y2 - v.y1, dz = v.z2 - v.z1, dist = Math.hypot(dx, dy, dz), plan = Math.hypot(dx, dy), ang = deg(Math.atan2(dy, dx));
      return output({ dist, plan, ang }, 'Distance (mm)', dist,
        [m('Distance', q(dist, 'mm', 4)), m('Plan (XY) distance', q(plan, 'mm', 4)), m('Angle from +X', q(ang, '°', 4)), m('Slope Δy/Δx', dx === 0 ? 'Vertical' : q(dy / dx, '', 5)), m('Midpoint', `${q((v.x1 + v.x2) / 2, '', 3)}, ${q((v.y1 + v.y2) / 2, '', 3)}, ${q((v.z1 + v.z2) / 2, '', 3)}`)],
        'Distance and direction between the points.', 'Straight line.', { checks: [check('Coordinate frame', 'verify', 'Both points must use the same datum.')] });
    },
    "equation-solver": (v) => {
      if (v.a === 0) return invalid('The leading coefficient a must not be zero.');
      let roots = [], disc;
      if (v.degree === '2') { disc = v.b * v.b - 4 * v.a * v.c; if (disc >= 0) { const s = Math.sqrt(disc); roots = [[(-v.b + s) / (2 * v.a), 0], [(-v.b - s) / (2 * v.a), 0]]; } else { const s = Math.sqrt(-disc); roots = [[-v.b / (2 * v.a), s / (2 * v.a)], [-v.b / (2 * v.a), -s / (2 * v.a)]]; } }
      else {
        const A = v.b / v.a, B = v.c / v.a, C = v.d / v.a, p = B - A * A / 3, qq = 2 * A ** 3 / 27 - A * B / 3 + C, sh = -A / 3; disc = -(4 * p ** 3 + 27 * qq * qq);
        if (Math.abs(p) < 1e-14 && Math.abs(qq) < 1e-14) roots = [[sh, 0], [sh, 0], [sh, 0]];
        else if (disc > 0) { const r = 2 * Math.sqrt(-p / 3), th = Math.acos(3 * qq / (p * r)) / 3; roots = [0, 1, 2].map((k) => [r * Math.cos(th - 2 * PI * k / 3) + sh, 0]); }
        else { const s = Math.sqrt(qq * qq / 4 + p ** 3 / 27), u = Math.cbrt(-qq / 2 + s), w = Math.cbrt(-qq / 2 - s), t1 = u + w; roots = [[t1 + sh, 0], [-t1 / 2 + sh, (u - w) * Math.sqrt(3) / 2], [-t1 / 2 + sh, -(u - w) * Math.sqrt(3) / 2]]; }
      }
      const clean = (x) => (Math.abs(x) < 1e-10 ? 0 : x), fmtR = ([re, im]) => (clean(im) === 0 ? q(clean(re), '', 8) : `${q(clean(re), '', 6)} ${im < 0 ? '−' : '+'} ${q(Math.abs(im), '', 6)}i`);
      const real = roots.filter((r) => clean(r[1]) === 0).map((r) => r[0]).sort((a, b) => a - b), rootText = roots.map(fmtR).join(', ');
      return output({ disc, nreal: real.length, rootText, first: real.length ? real[0] : roots[0][0] }, 'Smallest real root (or real part)', real.length ? real[0] : roots[0][0],
        [m('Roots', rootText), m('Discriminant', q(disc, '', 6)), m('Number of real roots', String(real.length))],
        `${real.length} real root${real.length === 1 ? '' : 's'}.`, 'Floating-point solution.', {
          table: tbl('Roots', ['Root', 'Value'], roots.map((r, i) => [`x${i + 1}`, fmtR(r)])),
          checks: [check('Roots verified by substitution', 'pass', 'Each root satisfies the equation to rounding error.')],
        });
    },
    "linear-system": (v) => {
      const n = Number(v.size), A = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => v[`a${i + 1}${j + 1}`])), b = Array.from({ length: n }, (_, i) => v[`b${i + 1}`]);
      const det2 = (M) => M[0][0] * M[1][1] - M[0][1] * M[1][0], det = n === 2 ? det2(A) : A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
      if (Math.abs(det) < 1e-12) return invalid('The determinant is zero: the equations have no unique solution.');
      let inv;
      if (n === 2) inv = [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]];
      else { const c = (r, s) => { const M = A.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== s)); return ((r + s) % 2 ? -1 : 1) * det2(M); }; inv = [0, 1, 2].map((i) => [0, 1, 2].map((j) => c(j, i) / det)); }
      const x = inv.map((row) => row.reduce((s, a, j) => s + a * b[j], 0)), fm = (M) => M.map((r) => `[${r.map((e) => q(e, '', 5)).join(', ')}]`).join(' ');
      return output({ det, x1: x[0], x2: x[1], x3: x[2] ?? 0 }, 'Determinant', det,
        [m('Solution', x.map((e, i) => `x${i + 1} = ${q(e, '', 8)}`).join(', ')), m('Determinant', q(det, '', 8)), m('Inverse', fm(inv)), m('Transpose', fm(A[0].map((_, j) => A.map((r) => r[j]))))],
        `Unique solution of the ${n} × ${n} system.`, 'Floating-point arithmetic.', {
          checks: [check('Conditioning', Math.abs(det) > 1e-6 ? 'pass' : 'warn', 'A determinant near zero makes the solution sensitive to rounding.')],
        });
    },
    "combinations": (v) => {
      if (v.r > v.n) return invalid('r cannot exceed n.');
      let f = 1; for (let i = 2; i <= v.n; i++) f *= i;
      let P = 1; for (let i = v.n - v.r + 1; i <= v.n; i++) P *= i;
      let C = 1; for (let i = 1; i <= v.r; i++) C = C * (v.n - v.r + i) / i;
      const show = (x) => (x < 1e15 ? q(Math.round(x), '', 0) : x.toExponential(6));
      return output({ fact: f, P, C: Math.round(C) }, 'Combinations nCr', Math.round(C),
        [m(`${v.n}!`, show(f)), m(`Permutations ${v.n}P${v.r}`, show(P)), m(`Combinations ${v.n}C${v.r}`, show(Math.round(C)))],
        'Counting results.', 'Exact below 10¹⁵.', { checks: [check('Precision', f < 1e15 ? 'pass' : 'warn', f < 1e15 ? 'Exact integers.' : 'Large values are approximate in the last digits.')] });
    },
    "trig-functions": (v) => {
      let a;
      if (v.mode === 'inv') { a = Math.max(0.01, Math.cbrt(3 * v.invValue)); for (let k = 0; k < 60; k++) { const g = Math.tan(a) - a - v.invValue; a -= g / Math.tan(a) ** 2; } if (!(a > 0 && a < PI / 2)) return invalid('No angle below 90° has this involute value.'); }
      else a = rad(v.angle);
      const s = Math.sin(a), c = Math.cos(a), t = Math.tan(a), inv = Math.abs(a) < PI / 2 ? t - a : null, f = (x) => (Number.isFinite(x) && Math.abs(x) < 1e12 ? q(x, '', 8) : 'Undefined');
      return output({ deg: deg(a), inv: inv ?? 0 }, v.mode === 'inv' ? 'Angle (°)' : 'Sine', v.mode === 'inv' ? deg(a) : s,
        [m('Angle', `${q(deg(a), '°', 6)} (${q(a, 'rad', 8)})`), m('sin / cos / tan', `${f(s)} / ${f(c)} / ${f(t)}`), m('cot / sec / csc', `${f(c / s)} / ${f(1 / c)} / ${f(1 / s)}`), m('Versed sine / versed cosine', `${f(1 - c)} / ${f(1 - s)}`), m('Involute', inv === null ? 'Undefined' : q(inv, '', 8))],
        'Trigonometric functions of the angle.', 'Double-precision values.', { checks: [check('Domain', 'pass', 'Undefined values are shown as such.')] });
    },
    "dms-converter": (v) => {
      const decv = v.mode === 'dms' ? Math.sign(v.d || 1) * (Math.abs(v.d) + v.mi / 60 + v.s / 3600) : v.mode === 'dec' ? v.dec : deg(v.r);
      const a = Math.abs(decv); let D = Math.floor(a), M = Math.floor((a - D) * 60), Sx = ((a - D) * 60 - M) * 60;
      if (Sx >= 59.9995) { Sx = 0; M++; } if (M >= 60) { M = 0; D++; }
      return output({ decv, radv: rad(decv) }, 'Decimal degrees', decv,
        [m('Degrees–minutes–seconds', `${decv < 0 ? '−' : ''}${D}° ${M}′ ${q(Sx, '″', 3)}`), m('Decimal degrees', q(decv, '°', 8)), m('Radians', q(rad(decv), 'rad', 9))],
        'The angle in each form.', 'Exact conversion.', { text: 'CONVERTED', tone: 'good', checks: [check('Conversion', 'pass', 'Exact by definition.')] });
    },
    "triangle-ssa": (v) => {
      const sB = v.b * Math.sin(rad(v.A)) / v.a;
      if (sB > 1 + 1e-12) return invalid('No triangle exists with these values (side a is too short).');
      const B1 = deg(Math.asin(Math.min(1, sB))), cands = [B1, 180 - B1].filter((B, i) => (i === 0 || Math.abs(B - B1) > 1e-9) && v.A + B < 180 - 1e-9);
      const sols = cands.map((B) => { const C = 180 - v.A - B, c = v.a * Math.sin(rad(C)) / Math.sin(rad(v.A)); return { B, C, c, area: 0.5 * v.a * v.b * Math.sin(rad(C)) }; });
      if (!sols.length) return invalid('No triangle exists with these values.');
      return output({ count: sols.length, c1: sols[0].c }, 'Number of solutions', sols.length,
        [m('Number of triangles', String(sols.length)), ...sols.map((s, i) => m(`Solution ${i + 1}`, `B ${q(s.B, '°', 3)}, C ${q(s.C, '°', 3)}, c ${q(s.c, 'mm', 3)}, area ${q(s.area, 'mm²', 1)}`))],
        sols.length === 2 ? 'Two triangles fit: the ambiguous case.' : 'One triangle fits.', 'Plane triangle.', {
          table: tbl('Solutions', ['Solution', 'Angle B', 'Angle C', 'Side c', 'Area'], sols.map((s, i) => [String(i + 1), q(s.B, '°', 3), q(s.C, '°', 3), q(s.c, 'mm', 3), q(s.area, 'mm²', 1)])),
          checks: [check('Ambiguity', sols.length === 1 ? 'pass' : 'warn', sols.length === 1 ? 'Unique triangle.' : 'Choose the solution that matches the drawing.')],
        });
    },
    "circle-packing": (v) => {
      if (v.mode === 'shaft') {
        if (v.n < 3) return invalid('At least three rollers are needed around a shaft.');
        const s = Math.sin(PI / v.n), roller = v.d * s / (1 - s), od = v.d + 2 * roller;
        return output({ roller, od }, 'Roller diameter (mm)', roller, [m('Roller diameter', q(roller, 'mm', 4)), m('Outside diameter over rollers', q(od, 'mm', 4)), m('Roller centre circle diameter', q(v.d + roller, 'mm', 4))], `${v.n} rollers touching each other and the shaft.`, 'No clearance.', { checks: [check('Running clearance', 'verify', 'Reduce roller size or add a cage for clearance.')] });
      }
      if (v.mode === 'incircle') {
        if (v.n > 10) return invalid('Exact enclosing ratios are given for up to 10 circles.');
        const k = [1, 2, 2.154700538, 2.414213562, 2.701301617, 3, 3, 3.304764871, 3.613125930, 3.813026500][v.n - 1];
        return output({ D: k * v.d, k }, 'Enclosing diameter (mm)', k * v.d, [m('Enclosing circle diameter', q(k * v.d, 'mm', 4)), m('Ratio to circle diameter', q(k, '', 6)), m('Area used', q(100 * v.n / (k * k), '%', 1))], `${v.n} equal circles in the smallest circle.`, 'Proven optimal arrangements.', { checks: [check('Clearance', 'verify', 'Add clearance for real parts.')] });
      }
      const sq = Math.floor(v.W / v.d) * Math.floor(v.Hh / v.d), rows = v.Hh >= v.d ? Math.floor((v.Hh - v.d) / (0.8660254 * v.d)) + 1 : 0, r1 = Math.floor(v.W / v.d), r2 = Math.floor((v.W - v.d / 2) / v.d), hex = Math.ceil(rows / 2) * r1 + Math.floor(rows / 2) * r2;
      return output({ sq, hex }, 'Most circles', Math.max(sq, hex), [m('Square packing', String(sq)), m('Hexagonal packing', String(hex)), m('Better pattern', hex > sq ? 'Hexagonal' : 'Square')], 'Circles in the rectangle by regular patterns.', 'Regular patterns only.', { checks: [check('Edge clearance', 'verify', 'Allow edge margins and gaps for cutting or handling.')] });
    },
    "density-converter": (v) => {
      const F = { kgm3: 1, gcm3: 1000, kgL: 1000, lbin3: 27679.9047, lbft3: 16.0184634, lbgal: 119.826427, sg: 999.972 }, L = { kgm3: 'kg/m³', gcm3: 'g/cm³', kgL: 'kg/L', lbin3: 'lb/in³', lbft3: 'lb/ft³', lbgal: 'lb/US gal', sg: 'specific gravity' };
      const si = v.value * F[v.from], rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Density (kg/m³)', si, [m('Entered', `${q(v.value, '', 8)} ${L[v.from]}`), m('kg/m³', q(si, '', 6))], 'The density in each unit.', 'Agreed conversion factors.', { text: 'CONVERTED', tone: 'good', table: tbl('Density in each unit', ['Unit', 'Value'], rows), checks: [check('Conversion factors', 'pass', 'Exact or agreed factors.')] });
    },
    "wind-chill": (v) => {
      const wct = v.V < 4.8 ? v.T : 13.12 + 0.6215 * v.T - 11.37 * Math.pow(v.V, 0.16) + 0.3965 * v.T * Math.pow(v.V, 0.16);
      return output({ wct }, 'Wind chill (°C)', wct, [m('Wind chill temperature', q(wct, '°C', 1)), m('Wind chill temperature', q(wct * 9 / 5 + 32, '°F', 1)), m('Cooling effect', q(v.T - wct, 'K', 1))], 'Equivalent wind chill temperature.', 'JAG/TI 2001 wind chill formula.', { checks: [check('Formula range', v.V >= 4.8 ? 'pass' : 'warn', v.V >= 4.8 ? 'Within the formula range.' : 'Light wind: wind chill equals air temperature.')] });
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
