// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook86). SI units are explicit at each boundary.
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
    "sphere-sections": (v) => {
      const c = 1 - Math.cos(rad(v.phi / 2));
      let area, vol, Rsph = NaN, Fdep = NaN, what;
      if (v.sec === 'sphere') { area = 4 * PI * v.R ** 2; vol = 4 / 3 * PI * v.R ** 3; Rsph = v.R; what = 'Whole sphere'; }
      else if (v.sec === 'fromvol') { Rsph = Math.cbrt(3 * v.Nv * 1e6 / (4 * PI)); area = 4 * PI * Rsph ** 2; vol = v.Nv * 1e6; what = 'Whole sphere from its volume'; }
      else if (v.sec === 'K') { Fdep = v.R * c; area = 2 * PI * v.R ** 2 * c; vol = 2 * PI * v.R ** 2 * Fdep / 3; Rsph = v.R; what = 'Sector K'; }
      else if (v.sec === 'S') { area = PI * (v.F ** 2 + v.E ** 2 / 4); vol = PI * v.F * (v.E ** 2 / 8 + v.F ** 2 / 6); Rsph = (v.E ** 2 / 4 + v.F ** 2) / (2 * v.F); what = 'Segment S'; }
      else if (v.sec === 'T') { Rsph = Math.sqrt(((v.P ** 2 - v.Q ** 2 - 4 * v.H ** 2) / (8 * v.H)) ** 2 + v.P ** 2 / 4); area = 2 * PI * Rsph * v.H; vol = v.H * PI / 6 * (v.H ** 2 + 3 * v.Q ** 2 / 4 + 3 * v.P ** 2 / 4); what = 'Zone T'; }
      else {
        if (!(v.R2 < v.R1)) return invalid(v.sec === 'W' || v.sec === 'Z' ? 'The ring section radius R₂ must be less than the radius R₁ to its centre.' : 'The inner radius R₂ must be less than the outer radius R₁.');
        if (v.sec === 'G') { area = 4 * PI * (v.R1 ** 2 + v.R2 ** 2); vol = 4 / 3 * PI * (v.R1 ** 3 - v.R2 ** 3); what = 'Wall G'; }
        else if (v.sec === 'U') { area = 2 * PI * (v.R1 ** 2 + v.R2 ** 2) * c; vol = 2 * PI / 3 * (v.R1 ** 3 - v.R2 ** 3) * c; what = 'Hollow sector U'; }
        else { const k = v.sec === 'Z' ? v.phi / 360 : 1; area = 4 * PI ** 2 * v.R1 * v.R2 * k; vol = 2 * PI ** 2 * v.R1 * v.R2 ** 2 * k; what = v.sec === 'Z' ? 'Part ring Z' : 'Solid ring W'; }
      }
      const mass = vol * 1e-9 * v.rho, litres = vol * 1e-6;
      const ms = [m('Section', what), m('Surface area', q(area, 'mm²', 6)), m('Volume', `${q(vol, 'mm³', 6)} (${q(litres, 'L', 5)})`), m('Mass', q(mass, 'kg', 5))];
      if (isFinite(Rsph)) ms.push(m('Radius of the sphere', q(Rsph, 'mm', 6)));
      if (isFinite(Fdep)) ms.push(m('Depth F of the sector', q(Fdep, 'mm', 6)));
      const checks = [check('Section', 'pass', `${what}: area ${q(area, 'mm²', 5)}, volume ${q(vol, 'mm³', 5)}.`)];
      if (v.sec === 'S' && v.F > Rsph) checks.push(check('Segment', 'verify', 'The segment is higher than the radius of its sphere: it is more than a hemisphere.'));
      if (v.sec === 'U') checks.push(check('Handbook table', 'verify', `The handbook table prints 2π in place of 2π/3 for this volume, which would give ${q(3 * vol, 'mm³', 5)}.`));
      const vals = { area, vol, mass }; if (isFinite(Rsph)) vals.Rsph = Rsph; if (isFinite(Fdep)) vals.Fdep = Fdep;
      return output(vals, 'Volume (mm³)', vol, ms, 'Areas and volumes of spherical sections.', 'Handbook formulas for spherical areas and volumes.', { text: 'SECTION CALCULATED', tone: 'good', checks });
    },
    "conic-section-equation": (v) => {
      const { A, C, D, E } = v, Fc = v.F;
      const pt = (x, y) => `(${q(x, '', 6)}, ${q(y, '', 6)})`;
      if (A === 0 && C === 0) return invalid('A and C cannot both be zero: the equation is a straight line.');
      let kind, h, k, e, a = NaN, b = NaN, c = NaN, p = NaN, rows = [];
      if (A === 0 || C === 0) {
        kind = 'parabola'; e = 1;
        if (A === 0) {
          if (D === 0) return invalid('With no x² and no x term the equation gives horizontal lines, not a parabola.');
          k = -E / (2 * C); h = (E * E / (4 * C) - Fc) / D; p = -D / (4 * C);
          rows = [['Standard form', `(y − ${q(k, '', 6)})² = ${q(4 * p, '', 6)}(x − ${q(h, '', 6)})`], ['Vertex', pt(h, k)], ['Focus', pt(h + p, k)], ['Directrix', `x = ${q(h - p, '', 6)}`], ['Axis', `y = ${q(k, '', 6)}`], ['Latus rectum', `x = ${q(h + p, '', 6)}, length ${q(Math.abs(4 * p), '', 6)}`]];
        } else {
          if (E === 0) return invalid('With no y² and no y term the equation gives vertical lines, not a parabola.');
          h = -D / (2 * A); k = (D * D / (4 * A) - Fc) / E; p = -E / (4 * A);
          rows = [['Standard form', `(x − ${q(h, '', 6)})² = ${q(4 * p, '', 6)}(y − ${q(k, '', 6)})`], ['Vertex', pt(h, k)], ['Focus', pt(h, k + p)], ['Directrix', `y = ${q(k - p, '', 6)}`], ['Axis', `x = ${q(h, '', 6)}`], ['Latus rectum', `y = ${q(k + p, '', 6)}, length ${q(Math.abs(4 * p), '', 6)}`]];
        }
      } else {
        h = -D / (2 * A); k = -E / (2 * C);
        const G = D * D / (4 * A) + E * E / (4 * C) - Fc;
        if (A * C > 0) {
          if (!(G / A > 0)) return invalid(G === 0 ? 'The equation reduces to a single point.' : 'The equation has no real curve.');
          const ax = Math.sqrt(G / A), by = Math.sqrt(G / C);
          a = Math.max(ax, by); b = Math.min(ax, by); c = Math.sqrt(a * a - b * b); e = c / a;
          kind = Math.abs(ax - by) <= 1e-12 * a ? 'circle' : 'ellipse';
          const alongX = ax >= by;
          rows = [['Standard form', `(x − ${q(h, '', 6)})²/${q(ax * ax, '', 6)} + (y − ${q(k, '', 6)})²/${q(by * by, '', 6)} = 1`], ['Centre', pt(h, k)], ['Semi-axes along x / y', `${q(ax, '', 6)} / ${q(by, '', 6)}`],
            ['Vertices', alongX ? `${pt(h - a, k)} and ${pt(h + a, k)}` : `${pt(h, k - a)} and ${pt(h, k + a)}`], ['Foci', alongX ? `${pt(h - c, k)} and ${pt(h + c, k)}` : `${pt(h, k - c)} and ${pt(h, k + c)}`]];
        } else {
          if (G === 0) return invalid('The equation reduces to a pair of crossing lines.');
          kind = 'hyperbola';
          const alongX = G / A > 0;
          a = Math.sqrt(alongX ? G / A : G / C); b = Math.sqrt(alongX ? -G / C : -G / A); c = Math.sqrt(a * a + b * b); e = c / a;
          const sl = alongX ? b / a : a / b;
          rows = [['Standard form', alongX ? `(x − ${q(h, '', 6)})²/${q(a * a, '', 6)} − (y − ${q(k, '', 6)})²/${q(b * b, '', 6)} = 1` : `(y − ${q(k, '', 6)})²/${q(a * a, '', 6)} − (x − ${q(h, '', 6)})²/${q(b * b, '', 6)} = 1`], ['Centre', pt(h, k)], ['Transverse axis', alongX ? `y = ${q(k, '', 6)}` : `x = ${q(h, '', 6)}`],
            ['Vertices', alongX ? `${pt(h - a, k)} and ${pt(h + a, k)}` : `${pt(h, k - a)} and ${pt(h, k + a)}`], ['Foci', alongX ? `${pt(h - c, k)} and ${pt(h + c, k)}` : `${pt(h, k - c)} and ${pt(h, k + c)}`], ['Asymptotes', `y − ${q(k, '', 6)} = ± ${q(sl, '', 6)}(x − ${q(h, '', 6)})`]];
        }
      }
      const ms = [m('Curve', kind), m(kind === 'parabola' ? 'Vertex (h, k)' : 'Centre (h, k)', pt(h, k)), m('Eccentricity e', q(e, '', 6))];
      if (kind === 'parabola') ms.push(m('p (vertex to focus)', q(p, '', 6)));
      else ms.push(m('a / b / c', `${q(a, '', 6)} / ${q(b, '', 6)} / ${q(c, '', 6)}`));
      const vals = { h, k, e }; if (kind === 'parabola') vals.p = p; else Object.assign(vals, { a, b, c });
      return output(vals, 'Eccentricity e', e, ms, 'Conic section from its general equation.', 'Handbook conic section forms (parabola and hyperbola), completed squares.', {
        text: `${kind.toUpperCase()} IDENTIFIED`, tone: 'good', table: tbl('Standard form and key points', ['Item', 'Value'], rows),
        checks: [check('Curve', 'pass', `The equation is a ${kind}.`), check('Rotated curves', 'verify', 'An equation with an xy term is a rotated conic and is not covered here.')],
      });
    },
    "four-arc-oval": (v) => {
      const A = v.A, B = v.B;
      if (!(A > B)) return invalid('The major axis A must be longer than the minor axis B.');
      const r = v.rFrom === 'eq' ? B * B / (2 * A) * (A / B) ** 0.38 : v.rg;
      if (!(r < B / 2)) return invalid('The end radius must be less than half the width B.');
      const X = (A * A / 4 - A * r + B * r - B * B / 4) / (B - 2 * r);
      if (!(X > 0)) return invalid('This end radius is too large for the oval: the side arcs would not meet the end arcs.');
      const R = B / 2 + X, a2 = A / 2 - r, al = Math.atan(a2 / X), dist = Math.hypot(a2, X);
      const Jx = a2 + r * a2 / dist, Jy = r * X / dist;
      const per = 4 * al * R + 2 * (PI - 2 * al) * r, area = 2 * R * R * al + r * r * (PI - 2 * al) - 2 * a2 * X, aEll = PI * A * B / 4, dA = (area - aEll) / aEll * 100;
      const rows = [['End arcs', `radius ${q(r, 'mm', 5)}`, `(±${q(a2, '', 5)}, 0)`, q(180 - 2 * deg(al), '°', 4)], ['Side arcs', `radius ${q(R, 'mm', 5)}`, `(0, ±${q(X, '', 5)}), opposite the arc drawn`, q(2 * deg(al), '°', 4)], ['Tangent points', '', `(±${q(Jx, '', 5)}, ±${q(Jy, '', 5)})`, '']];
      return output({ r, X, R, alpha: deg(al), per, area, aEll, dA, tang: dist - (R - r) }, 'End radius r (mm)', r,
        [m('End radius r', q(r, 'mm', 5)), m('Side radius R', q(R, 'mm', 5)), m('Side-arc centre beyond the oval centre X', q(X, 'mm', 5)), m('End-arc centre from the oval centre', q(a2, 'mm', 5)), m('Perimeter of the oval', q(per, 'mm', 5)), m('Area: oval / ellipse', `${q(area, 'mm²', 6)} / ${q(aEll, 'mm²', 6)} (${q(dA, '%', 3)})`)],
        'Four-arc oval approximating an ellipse.', 'Handbook four-arc oval equations (1) to (3).', {
          text: 'OVAL LAID OUT', tone: 'good', table: tbl('Arc layout (oval centre at 0, 0; major axis along x)', ['Arcs', 'Radius', 'Centres', 'Arc angle'], rows),
          checks: [check('Arcs meet tangentially', 'pass', `Distance between centres ${q(dist, 'mm', 6)} equals R − r = ${q(R - r, 'mm', 6)}.`), check('Shape', 'pass', `The oval’s area differs from the true ellipse by ${q(dA, '%', 3)}.`)],
        });
    },
    "hole-location-disks": (v) => {
      const rA = (v.x - v.y + v.z) / 2, rB = v.x - rA, rC = v.y - rB;
      if (!(rA > 0 && rB > 0 && rC > 0)) return invalid('These centre distances do not form a triangle in which every disk has a positive radius: each distance must be less than the sum of the other two.');
      const cosA = (v.x ** 2 + v.z ** 2 - v.y ** 2) / (2 * v.x * v.z), cosB = (v.x ** 2 + v.y ** 2 - v.z ** 2) / (2 * v.x * v.y), angA = deg(Math.acos(cosA)), angB = deg(Math.acos(cosB)), angC = 180 - angA - angB;
      const Cx = (v.x ** 2 + v.z ** 2 - v.y ** 2) / (2 * v.x), Cy = Math.sqrt(Math.max(0, v.z ** 2 - Cx ** 2));
      const dA = 2 * rA, dB = 2 * rB, dC = 2 * rC;
      return output({ rA, rB, rC, dA, dB, dC, angA, angB, angC, Cx, Cy }, 'Diameter of disk A (mm)', dA,
        [m('Disk A diameter', q(dA, 'mm', 6)), m('Disk B diameter', q(dB, 'mm', 6)), m('Disk C diameter', q(dC, 'mm', 6)), m('Angles at A / B / C', `${q(angA, '°', 5)} / ${q(angB, '°', 5)} / ${q(angC, '°', 5)}`), m('Hole C from A (B on the x axis)', `(${q(Cx, 'mm', 6)}, ${q(Cy, 'mm', 6)})`)],
        'Disk diameters for locating three holes.', 'Handbook disk method of locating holes.', {
          text: 'DISK SIZES SET', tone: 'good',
          checks: [check('Disks touch', 'pass', `r_A + r_B = ${q(rA + rB, 'mm', 6)}, r_B + r_C = ${q(rB + rC, 'mm', 6)}, r_A + r_C = ${q(rA + rC, 'mm', 6)}.`), check('Disk accuracy', 'verify', 'Grind the disks to size, measure them, and centre each bore truly before locating the holes.')],
        });
    },
    "metal-ball-lot-check": (v) => {
      if (!(v.Dmin <= v.Dmax)) return invalid('The smallest ball cannot be larger than the largest ball.');
      const DwmL = (v.Dmax + v.Dmin) / 2, VL = (v.Dmax - v.Dmin) * 1000, target = v.Dw + v.gage / 1000, lo = target - v.devMinus / 1000, hi = target + v.devPlus / 1000;
      const Sdev = (DwmL - target) * 1000, rounded = Math.round(DwmL * 1000 / v.inc) * v.inc / 1000, spec = (rounded - v.Dw) * 1000;
      const massBall = PI / 6 * (v.Dw / 1000) ** 3 * v.rho, perKg = 1 / massBall, lotMass = massBall * v.qty;
      const okSize = DwmL >= lo - 1e-12 && DwmL <= hi + 1e-12, okVar = VL <= v.VLmax + 1e-9, ok = okSize && okVar;
      return output({ DwmL, VL, target, lo, hi, Sdev, rounded, spec, perKg, lotMass, massBall }, 'Specific diameter (µm)', spec,
        [m('Lot mean diameter DwmL', q(DwmL, 'mm', 7)), m('Lot diameter variation VDwL', q(VL, 'µm', 4)), m('Ordered size (Dw + ball gauge)', q(target, 'mm', 7)), m('Accepted lot mean diameter', `${q(lo, 'mm', 7)} to ${q(hi, 'mm', 7)}`), m('Ball gauge deviation S', q(Sdev, 'µm', 4)), m('Specific diameter to mark', q(spec, 'µm', 4)), m('Balls per kilogram', q(perKg, '', 5)), m('Lot mass', q(lotMass, 'kg', 5))],
        'Standard metal ball lot check.', 'Handbook account of ANSI/AFBMA Std 10 ball definitions, ordering and marking.', {
          text: ok ? 'LOT ACCEPTED' : 'LOT REJECTED', tone: ok ? 'good' : 'bad',
          checks: [check('Lot mean diameter', okSize ? 'pass' : 'fail', `${q(DwmL, 'mm', 7)} against ${q(lo, 'mm', 7)} to ${q(hi, 'mm', 7)}.`), check('Lot diameter variation', okVar ? 'pass' : 'fail', `${q(VL, 'µm', 4)} against ${q(v.VLmax, 'µm', 4)} allowed.`), check('Package marking', 'pass', `Nominal ${q(v.Dw, 'mm', 6)}, ball gauge ${q(v.gage, 'µm', 4)}, specific diameter ${q(spec, 'µm', 4)}.`), check('Individual balls', 'verify', 'Check ball diameter variation, deviation from spherical form and surface roughness for the grade separately.')],
        });
    },
    "engine-flywheel-rim-and-arms": (v) => {
      const Wr = v.given === 'power' ? v.P * 1000 * 60 / v.N : v.Wrev, E = v.c * Wr, n = 100 / v.pct, vr = PI * v.Dm * v.N / 60;
      const mass = n * E / (vr * vr), lb = mass / 0.45359237, Arim = mass / (v.rho * PI * v.Dm) * 1e6;
      const Wa = (v.arms === '8' ? 1.2 : 1.3) * v.ds, ta = Wa / 2, Ahub = PI * Wa * ta / 4, AtipMin = 2 / 3 * Ahub;
      return output({ Wr, E, n, vr, mass, lb, Arim, Wa, ta, Ahub, AtipMin }, 'Rim mass (kg)', mass,
        [m('Work per revolution', q(Wr, 'J', 5)), m('Energy excess E', q(E, 'J', 5)), m('Rim speed at the mean diameter', q(vr, 'm/s', 4)), m('Rim mass', `${q(mass, 'kg', 5)} (${q(lb, 'lb', 5)})`), m('Rim cross-section', q(Arim, 'mm²', 5)), m('Arm width / thickness at the hub', `${q(Wa, 'mm', 4)} / ${q(ta, 'mm', 4)}`), m('Arm area at the hub / least at the rim', `${q(Ahub, 'mm²', 5)} / ${q(AtipMin, 'mm²', 5)}`)],
        'Engine flywheel rim weight and arm proportions.', 'Handbook engine flywheel formulas (1) and (2) and arm proportions.', {
          text: 'RIM AND ARMS SIZED', tone: 'good',
          checks: [check('Speed variation', 'pass', `A rim of ${q(mass, 'kg', 5)} holds the speed within ${q(v.pct, '%', 3)} of ${q(v.N, 'rpm', 5)}.`), check('Rim stress', 'verify', `Check the rim stress and bursting speed at ${q(vr, 'm/s', 4)} for the rim material.`), check('Arms', 'verify', 'Make the arms about three-quarters as strong as the shaft in torsion and taper them to no less than two-thirds of the hub area at the rim.')],
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
