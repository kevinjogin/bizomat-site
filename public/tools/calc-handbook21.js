// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook21). SI units are explicit at each boundary.
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
    "prismoidal-volume": (v) => {
      let A1, Am, A2;
      if (v.mode === 'areas') { A1 = v.A1; Am = v.Am; A2 = v.A2; }
      else if (v.mode === 'rect') { A1 = v.a1 * v.b1; A2 = v.a2 * v.b2; Am = (v.a1 + v.a2) / 2 * (v.b1 + v.b2) / 2; }
      else { A1 = area(v.D1); A2 = area(v.D2); Am = area((v.D1 + v.D2) / 2); }
      if (A1 + Am + A2 <= 0) return invalid('Enter at least one section with area.');
      const V = v.h * (A1 + 4 * Am + A2) / 6;
      return output({ V, A1, Am, A2 }, 'Volume (mm³)', V,
        [m('Volume', q(V, 'mm³', 0)), m('Volume', q(V / 1e6, 'L', 3)), m('End 1 area', q(A1, 'mm²', 0)), m('Middle area', q(Am, 'mm²', 0)), m('End 2 area', q(A2, 'mm²', 0))],
        'Volume by the prismoidal formula.', 'Parallel ends; quadratic area variation.');
    },
    "pappus-revolution": (v) => {
      const k = v.ang / 360; let S, V, pathL, pathA;
      if (v.shape === 'torus') { if (v.d > v.Dp) return invalid('The circle would cross the axis: its diameter must not exceed the path diameter.'); pathL = pathA = PI * v.Dp * k; S = PI * v.d * pathL; V = area(v.d) * pathA; }
      else { pathL = 2 * PI * v.rL * k; pathA = 2 * PI * v.rA * k; S = v.L * pathL; V = v.A * pathA; if (S + V <= 0) return invalid('Enter a profile length or area with a centroid radius.'); }
      return output({ S, V, pathL, pathA }, 'Volume (mm³)', V,
        [m('Surface area', q(S, 'mm²', 2)), m('Volume', q(V, 'mm³', 2)), m('Volume', q(V / 1000, 'cm³', 4)), m('Path of the line centroid', q(pathL, 'mm', 3)), m('Path of the area centroid', q(pathA, 'mm', 3))],
        'Pappus–Guldinus surface and volume.', 'Planar profile on one side of the axis.');
    },
    "simpson-area": (v) => {
      if (v.Ns % 2) return invalid('Simpson’s rule needs an even number of strips.');
      const V = Array.from({ length: v.Ns + 1 }, (_, i) => v[`V${i}`]);
      let s = V[0] + V[v.Ns]; for (let i = 1; i < v.Ns; i++) s += (i % 2 ? 4 : 2) * V[i];
      const A = v.W / 3 * s, At = v.W * ((V[0] + V[v.Ns]) / 2 + V.slice(1, -1).reduce((a, b) => a + b, 0));
      return output({ A, At }, 'Area (mm²)', A,
        [m('Area by Simpson’s rule', q(A, 'mm²', 3)), m('Area by trapezoidal rule', q(At, 'mm²', 3)), m('Difference', q(A !== 0 ? (At - A) / A * 100 : 0, '%', 2)), m('Overall length', q(v.W * v.Ns, 'mm', 2))],
        'Area by Simpson’s rule.', 'Equal strips, smooth outline.');
    },
    "spherical-triangle": (v) => {
      if (v.mode === 'sss') {
        const [a, b, c] = [v.a, v.b, v.c].map(rad);
        if (a + b <= c || a + c <= b || b + c <= a || a + b + c >= 2 * PI) return invalid('These sides cannot form a spherical triangle.');
        const ang = (x, y, z) => Math.acos(Math.max(-1, Math.min(1, (Math.cos(x) - Math.cos(y) * Math.cos(z)) / (Math.sin(y) * Math.sin(z)))));
        const A = ang(a, b, c), B = ang(b, c, a), C = ang(c, a, b), E = A + B + C - PI, areaS = v.R * v.R * E;
        return output({ A: deg(A), B: deg(B), C: deg(C), E: deg(E), area: areaS }, 'Area', areaS,
          [m('Angle A', q(deg(A), '°', 4)), m('Angle B', q(deg(B), '°', 4)), m('Angle C', q(deg(C), '°', 4)), m('Spherical excess', q(deg(E), '°', 4)), m('Area', q(areaS, 'units²', 3)), m('Share of the sphere', q(E / (4 * PI) * 100, '%', 3))],
          'Spherical triangle from three sides.', 'Perfect sphere.');
      }
      const p1 = rad(v.lat1), p2 = rad(v.lat2), dl = rad(v.lon2 - v.lon1);
      const h = Math.sin((p2 - p1) / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2, ca = 2 * Math.asin(Math.min(1, Math.sqrt(h))), dist = v.R * ca;
      const brg = (deg(Math.atan2(Math.sin(dl) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl))) + 360) % 360;
      return output({ ca: deg(ca), dist, brg }, 'Great-circle distance', dist,
        [m('Central angle', q(deg(ca), '°', 4)), m('Great-circle distance', q(dist, 'units', 3)), m('Initial bearing', q(brg, '°', 2))],
        'Great-circle distance.', 'Perfect sphere.');
    },
    "progression": (v) => {
      let last, sum, fit = null;
      if (v.type === 'arith') { last = v.a + (v.n - 1) * v.d; sum = v.n * (v.a + last) / 2; if (v.l !== 0 && v.n > 1) fit = (v.l - v.a) / (v.n - 1); }
      else { last = v.a * v.r ** (v.n - 1); sum = v.r === 1 ? v.n * v.a : v.a * (v.r ** v.n - 1) / (v.r - 1); if (v.l !== 0 && v.n > 1) { if (v.l / v.a <= 0) return invalid('To fit a ratio the first and last terms must have the same sign.'); fit = (v.l / v.a) ** (1 / (v.n - 1)); } }
      const metrics = [m('Last term', q(last, '', 6)), m('Sum of terms', q(sum, '', 6))];
      if (fit !== null) metrics.push(m(v.type === 'arith' ? 'Difference that reaches the last term' : 'Ratio that reaches the last term', q(fit, '', 6)));
      return output({ last, sum, fit: fit ?? 0 }, 'Sum of terms', sum, metrics, 'Progression terms and sum.', 'Exact formulas.');
    },
    "preferred-numbers": (v) => {
      if (v.max <= v.min) return invalid('The highest value must exceed the lowest value.');
      const n = Number(v.series), ratio = 10 ** (1 / n), i0 = Math.ceil(n * Math.log10(v.min) - 1e-9), i1 = Math.floor(n * Math.log10(v.max) + 1e-9);
      if (i1 - i0 + 1 > 200) return invalid('That range gives more than 200 values; narrow it or choose a coarser series.');
      if (i1 < i0) return invalid('No preferred number falls in this range.');
      const vals = []; for (let i = i0; i <= i1; i++) vals.push(10 ** (i / n));
      const r3 = (x) => Number(x.toPrecision(3));
      return output({ count: vals.length, ratio, first: vals[0], last: vals[vals.length - 1] }, 'Values in range', vals.length,
        [m('Step ratio', q(ratio, '', 5)), m('Values in range', q(vals.length, '', 0)), m('First value', q(vals[0], '', 5)), m('Last value', q(vals[vals.length - 1], '', 5))],
        'Renard preferred numbers.', 'Theoretical series values.', {
          table: tbl('Preferred numbers in range', ['#', 'Theoretical', 'Three significant figures'], vals.map((x, k) => [String(k + 1), q(x, '', 5), String(r3(x))])),
        });
    },
    "line-intersection": (v) => {
      const A1 = v.y2 - v.y1, B1 = v.x1 - v.x2, C1 = A1 * v.x1 + B1 * v.y1, A2 = v.y4 - v.y3, B2 = v.x3 - v.x4, C2 = A2 * v.x3 + B2 * v.y3;
      if (Math.hypot(A1, B1) === 0 || Math.hypot(A2, B2) === 0) return invalid('Each line needs two different points.');
      const det = A1 * B2 - A2 * B1, L1 = Math.hypot(A1, B1);
      const dist = Math.abs(A1 * v.px + B1 * v.py - C1) / L1, t = (A1 * v.px + B1 * v.py - C1) / (L1 * L1), fx = v.px - A1 * t, fy = v.py - B1 * t;
      const dot = (-B1) * (-B2) + A1 * A2, angle = deg(Math.acos(Math.max(-1, Math.min(1, Math.abs(dot) / (L1 * Math.hypot(A2, B2))))));
      const slope1 = B1 !== 0 ? -A1 / B1 : Infinity;
      if (Math.abs(det) < 1e-12 * L1 * Math.hypot(A2, B2)) {
        return output({ dist, fx, fy, angle: 0 }, 'Distance from point to line 1 (mm)', dist,
          [m('Intersection', 'Lines are parallel'), m('Distance from point to line 1', q(dist, 'mm', 4)), m('Foot of perpendicular', `${q(fx, '', 4)}, ${q(fy, '', 4)}`)],
          'Parallel lines.', 'Plane geometry.', { checks: [check('Intersection', 'warn', 'The lines are parallel and do not cross.')] });
      }
      const ix = (C1 * B2 - C2 * B1) / det, iy = (A1 * C2 - A2 * C1) / det;
      return output({ ix, iy, angle, dist, fx, fy }, 'Angle between lines (°)', angle,
        [m('Intersection x', q(ix, 'mm', 4)), m('Intersection y', q(iy, 'mm', 4)), m('Angle between the lines', q(angle, '°', 4)), m('Slope of line 1', Number.isFinite(slope1) ? q(slope1, '', 5) : 'Vertical'), m('Distance from point to line 1', q(dist, 'mm', 4)), m('Foot of perpendicular', `${q(fx, '', 4)}, ${q(fy, '', 4)}`)],
        'Line intersection and distances.', 'Plane geometry.');
    },
    "drop-hammer-blow": (v) => {
      const g = 9.80665, dm = v.d / 1000, E = v.m * g * (v.h + dm), F = v.eff / 100 * E / dm, vImp = Math.sqrt(2 * g * v.h);
      return output({ F, E, vImp }, 'Average force (N)', F,
        [m('Average force of the blow', q(F / 1000, 'kN', 3)), m('Ratio to the falling weight', q(F / (v.m * g), '×', 1)), m('Impact speed', q(vImp, 'm/s', 3)), m('Energy of the fall', q(E / 1000, 'kJ', 3))],
        'Average force of a blow.', 'Work balance; losses by efficiency.');
    },
    "mixture-cost": (v) => {
      if (v.mode === 'cost') {
        const qs = [v.q1, v.q2, v.q3, v.q4], ps = [v.p1, v.p2, v.p3, v.p4], Q = qs.reduce((a, b) => a + b, 0);
        if (Q <= 0) return invalid('Enter a quantity for at least one ingredient.');
        const total = qs.reduce((s, x, i) => s + x * ps[i], 0), avg = total / Q;
        return output({ total, Q, avg }, 'Value per unit', avg,
          [m('Total value', q(total, '', 4)), m('Total quantity', q(Q, 'kg', 3)), m('Value per unit', q(avg, '', 5))],
          'Weighted average of the mixture.', 'Linear mixing.', {
            table: tbl('Ingredients', ['#', 'Quantity', 'Share', 'Value'], qs.map((x, i) => [String(i + 1), q(x, '', 3), q(x / Q * 100, '%', 1), q(ps[i], '', 4)]).filter((r, i) => qs[i] > 0)),
          });
      }
      if (v.vA === v.vB) return invalid('The two ingredients must have different values.');
      const sA = (v.vB - v.vT) / (v.vB - v.vA); if (sA < 0 || sA > 1) return invalid('The target must lie between the two ingredient values.');
      return output({ sA, sB: 1 - sA, qA: sA * v.batch, qB: (1 - sA) * v.batch }, 'Share of ingredient A (%)', sA * 100,
        [m('Share of A', q(sA * 100, '%', 2)), m('Share of B', q((1 - sA) * 100, '%', 2)), m('Quantity of A', q(sA * v.batch, 'kg', 3)), m('Quantity of B', q((1 - sA) * v.batch, 'kg', 3))],
        'Blend proportions by alligation.', 'Linear mixing.');
    },
    "column-safe-stress-classic": (v) => {
      const lr = v.L / v.r; if (lr > 200 && v.member === 'main') return invalid('Main members above l/r 200 are outside these formulas.');
      let psi; if (lr <= 120) psi = 17000 - 0.485 * lr * lr; else { psi = 18000 / (1 + lr * lr / 18000); if (v.member === 'main') psi *= 1.6 - lr / 200; }
      const Sa = psi * 0.0068948, Pa = Sa * v.A / 1000, util = v.P / Pa, ok = util <= 1;
      return output({ lr, psi, Sa, Pa }, 'Safe unit stress (MPa)', Sa,
        [m('Slenderness ratio l/r', q(lr, '', 1)), m('Safe unit stress', q(psi, 'psi', 0)), m('Safe unit stress', q(Sa, 'MPa', 2)), m('Safe concentric load', q(Pa, 'kN', 1)), m('Utilisation', q(util * 100, '%', 0))],
        'Classic AISC column formula.', 'Historic working-stress method.', {
          text: ok ? 'WITHIN SAFE LOAD' : 'OVER SAFE LOAD', tone: ok ? 'good' : 'bad',
          checks: [check('Safe load', ok ? 'pass' : 'fail', `${q(v.P, 'kN', 1)} against ${q(Pa, 'kN', 1)}.`), check('Current code', 'verify', 'Confirm new designs to AISC 360 or the local steel code.')],
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
