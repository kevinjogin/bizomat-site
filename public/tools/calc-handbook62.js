// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook62). SI units are explicit at each boundary.
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
    "intermittent-fillet-weld-plan": (v) => {
      const cost = (leg, L) => { const mass = leg * leg / 2 * (1 + v.excess / 100) * L * v.rho * 1e-9, arc = mass / v.dep, labour = arc / (v.of / 100), filler = mass / (v.eff / 100); return { mass, cost: labour * v.rate + filler * v.wire }; };
      if (v.ls > v.Lj) return invalid('The segment length must not exceed the joint length.');
      const throatC = v.F * 1000 / (v.Lj * v.tau), legReqC = throatC / Math.SQRT1_2, legC = Math.ceil(Math.max(legReqC, v.amin) - 1e-9), cC = cost(legC, v.Lj);
      const LreqI = v.F * 1000 / (Math.SQRT1_2 * v.amin * v.tau), nStr = Math.ceil(LreqI / v.ls - 1e-9), nGap = v.Lj > v.ls ? Math.ceil((v.Lj - v.ls) / (v.gapMax + v.ls) - 1e-9) + 1 : 1, nI = Math.max(nStr, nGap, 1), LI = nI * v.ls;
      const fits = LI < v.Lj - 1e-9, pitch = nI > 1 ? (v.Lj - v.ls) / (nI - 1) : 0, gap = nI > 1 ? pitch - v.ls : 0, legI = Math.ceil(Math.max(v.F * 1000 / (LI * v.tau) / Math.SQRT1_2, v.amin) - 1e-9), cI = cost(legI, LI), saving = fits ? (1 - cI.cost / cC.cost) * 100 : 0;
      const okT = legC <= v.t + 1e-9;
      return output({ throatC, legReqC, legC, costC: cC.cost, LreqI, nI, LI, pitch, gap, legI, costI: cI.cost, saving }, 'Intermittent segments', nI,
        [m('Continuous weld: leg needed / used', `${q(legReqC, '', 2)} / ${q(legC, 'mm', 0)}`), m('Continuous weld cost', money(cC.cost)), m('Intermittent length needed at the minimum leg', q(LreqI, 'mm', 0)), m('Segments / pitch / clear gap', fits ? `${nI} / ${q(pitch, '', 0)} / ${q(gap, 'mm', 0)}` : 'Segments would fill the joint'), m('Intermittent weld cost', fits ? money(cI.cost) : 'Not applicable'), m('Saving', fits ? q(saving, '%', 0) : 'None')],
        'Intermittent fillet weld plan.', 'Static load spread along the joint.', {
          text: !okT ? 'JOINT TOO SHORT' : fits ? 'INTERMITTENT WELD FEASIBLE' : 'CONTINUOUS WELD NEEDED', tone: !okT ? 'bad' : fits ? 'good' : 'warn',
          checks: [check('Leg against plate', okT ? 'pass' : 'fail', okT ? `A ${q(legC, 'mm', 0)} leg suits the ${q(v.t, 'mm', 0)} plate.` : `A ${q(legC, 'mm', 0)} leg is larger than the ${q(v.t, 'mm', 0)} plate: lengthen the joint or weld both sides.`), check('Gap between segments', !fits || gap <= v.gapMax + 1e-9 ? 'pass' : 'fail', fits ? `${q(gap, 'mm', 0)} against ${q(v.gapMax, 'mm', 0)}.` : 'Continuous weld.'), check('Service', 'verify', 'Use continuous welds where the joint must seal, sees fatigue or is exposed to corrosion between segments.')],
        });
    },
    "acme-nut-bore-inspection": (v) => {
      const p = 1 / v.tpi, min = v.cls === 'G' ? v.D - p : v.cls === 'C24' ? v.D - 0.9 * p : v.D - 0.025 * Math.sqrt(v.D) - 0.9 * p, max = min + 0.05 * p;
      if (min <= 0) return invalid('The pitch is too coarse for this diameter.');
      const dmin = min - v.over, dmax = max - v.over, d64 = Math.ceil(dmin * 64 - 1e-9) / 64, fits = d64 <= dmax + 1e-12, ok = v.Bm >= min - 1e-9 && v.Bm <= max + 1e-9;
      return output({ min, max, dmin, dmax, drill64: fits ? d64 : 0 }, 'Maximum minor diameter (in)', max,
        [m('Minor diameter limits', `${q(min, '', 4)} to ${q(max, 'in', 4)}`), m('Drill size range', `${q(dmin, '', 4)} to ${q(dmax, 'in', 4)}`), m('Fractional drill', fits ? `${Math.round(d64 * 64)}/64 in (${q(d64, 'in', 4)})` : 'No 64th falls in the range'), m('Measured bore', q(v.Bm, 'in', 4))],
        'Acme nut bore inspection.', 'Drilled hole with probable oversize.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Bore', ok ? 'pass' : 'fail', `${q(v.Bm, 'in', 4)} against ${q(min, '', 4)}–${q(max, 'in', 4)}${ok ? '.' : v.Bm > max ? ': oversize.' : ': undersize.'}`), check('Drill choice', fits ? 'pass' : 'warn', fits ? `${Math.round(d64 * 64)}/64 in drill fits the range.` : 'No fractional drill fits: bore the hole or use a number or letter drill.')],
        });
    },
    "form-tool-profile-plan": (v) => {
      const steps = [1, 2, 3, 4].map((i) => [i, v['D' + i], v['A' + i]]).filter((s) => s[1] > 0);
      if (!steps.length) return invalid('Enter at least one step depth.');
      const rows = []; let deep = 0, rSmall = Infinity;
      if (v.mode === 'flat') {
        for (const [i, D, A] of steps) { const depth = D * Math.cos(rad(v.C)), Ap = deg(Math.atan(Math.tan(rad(A)) * Math.cos(rad(v.C)))); deep = Math.max(deep, depth); rows.push([String(i), q(D, '', 3), q(depth, '', 4), q(Ap, '', 3)]); }
        const ok = deep <= v.hMax + 1e-9;
        return output({ deep, steps: steps.length }, 'Deepest step on the tool (mm)', deep,
          [m('Steps', String(steps.length)), m('Deepest step on the tool', q(deep, 'mm', 4)), m('Depth factor (cos C)', q(Math.cos(rad(v.C)), '', 5))],
          'Flat form tool profile.', 'Zero rake; clearance on the front.', {
            text: ok ? 'PROFILE FEASIBLE' : 'PROFILE TOO DEEP', tone: ok ? 'good' : 'bad',
            table: tbl('Steps', ['Step', 'Depth on work (mm)', 'Depth on tool (mm)', 'Angle on tool (°)'], rows),
            checks: [check('Profile depth', ok ? 'pass' : 'fail', `${q(deep, 'mm', 3)} against ${q(v.hMax, 'mm', 1)}.`)],
          });
      }
      if (v.off >= v.Rt) return invalid('The face offset must be less than the tool radius.');
      const k = Math.sqrt(v.Rt * v.Rt - v.off * v.off);
      for (const [i, D] of steps) { if (D >= k) return invalid('A step is too deep for this tool radius.'); const rr = Math.sqrt((k - D) ** 2 + v.off * v.off); rSmall = Math.min(rSmall, rr); deep = Math.max(deep, v.Rt - rr); rows.push([String(i), q(D, '', 3), q(rr, '', 4), q(v.Rt - rr, '', 4)]); }
      const ok = rSmall >= v.rMin - 1e-9;
      return output({ deep, rSmall, k, steps: steps.length }, 'Smallest tool radius (mm)', rSmall,
        [m('Steps', String(steps.length)), m('Distance k', q(k, 'mm', 4)), m('Smallest tool radius', q(rSmall, 'mm', 4)), m('Deepest step on the tool', q(deep, 'mm', 4))],
        'Circular form tool profile.', 'Face below centre; zero rake.', {
          text: ok ? 'PROFILE FEASIBLE' : 'PROFILE TOO DEEP', tone: ok ? 'good' : 'bad',
          table: tbl('Steps', ['Step', 'Depth on work (mm)', 'Tool radius (mm)', 'Step on tool (mm)'], rows),
          checks: [check('Smallest radius', ok ? 'pass' : 'fail', `${q(rSmall, 'mm', 3)} against ${q(v.rMin, 'mm', 1)}.`)],
        });
    },
    "taper-disc-gauge-check": (v) => {
      if (v.D <= v.d) return invalid('The large disc must be larger than the small disc.');
      const t24 = v.T / 24, C = (v.D - v.d) / 2 * Math.sqrt(1 + t24 * t24) / t24, Kn = (v.D - v.d) / (2 * C), Mnom = C + (v.D + v.d) / 2, Cm = v.Mm - (v.D + v.d) / 2;
      if (Cm <= 0) return invalid('The measured reading must exceed the half-sum of the disc diameters.');
      const K = (v.D - v.d) / (2 * Cm);
      if (!(K > 0 && K < 0.7)) return invalid('The measured setting does not give a valid taper.');
      const Tm = 24 * K / Math.sqrt(1 - K * K), angle = 2 * deg(Math.asin(K)), angleNom = 2 * deg(Math.asin(Kn)), err = Tm - v.T, ok = Math.abs(err) <= v.tolT + 1e-12;
      const dM = (T2) => { const tt = T2 / 24; return (v.D - v.d) / 2 * Math.sqrt(1 + tt * tt) / tt + (v.D + v.d) / 2; }, Mlo = dM(v.T + v.tolT), Mhi = v.T - v.tolT > 0 ? dM(v.T - v.tolT) : Infinity;
      return output({ C, Mnom, Cm, K, Tm, angle, angleNom, err, Mlo, Mhi: Number.isFinite(Mhi) ? Mhi : 0 }, 'Taper from the setting (in/ft)', Tm,
        [m('Centre distance for the taper', q(C, 'in', 5)), m('Reading over the discs at nominal', q(Mnom, 'in', 5)), m('Readings at the taper limits', Number.isFinite(Mhi) ? `${q(Mlo, '', 5)} to ${q(Mhi, 'in', 5)}` : `From ${q(Mlo, 'in', 5)}`), m('Included angle: nominal / measured', `${q(angleNom, '', 4)} / ${q(angle, '°', 4)}`), m('Taper from the setting', `${q(Tm, 'in/ft', 5)} (${q(err, '', 5)})`)],
        'Taper disc gauge check.', 'Discs and edges taken as true.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Taper', ok ? 'pass' : 'fail', `${q(Tm, 'in/ft', 5)} against ${q(v.T - v.tolT, '', 4)}–${q(v.T + v.tolT, 'in/ft', 4)}.`), check('Discs', 'verify', 'Check the disc diameters and roundness; their errors go straight into the taper.')],
        });
    },
    "composite-rotor-inertia": (v) => {
      const Jof = (shape, M, A, B, C) => { const a = A / 2000, b = B / 2000, c = C / 2000; switch (shape) { case 'cone': return 0.3 * M * a * a; case 'conebase': return M * (3 * a * a / 20 + (B / 1000) ** 2 / 10); case 'hsphere': return b >= a ? null : 2 * M * (a ** 5 - b ** 5) / (5 * (a ** 3 - b ** 3)); case 'shell': return 2 * M * a * a / 3; case 'torus': return M * (a * a + 0.75 * b * b); case 'ellipsoid': return M * (b * b + c * c) / 5; case 'ring': return M * a * a / 2; default: return M * a * a; } };
      const rows = []; let J = 0, mass = 0; const Js = [];
      for (let i = 1; i <= 3; i++) {
        const M = v['m' + i]; if (!M) { Js.push(0); continue; }
        const J0 = Jof(v['shape' + i], M, v['A' + i], v['B' + i], v['C' + i]); if (J0 === null) return invalid(`Body ${i}: the inner diameter must be smaller.`);
        const Jt = J0 + M * (v['o' + i] / 1000) ** 2; J += Jt; mass += M; Js.push(Jt); rows.push([String(i), q(M, '', 2), q(J0, '', 5), q(Jt, '', 5)]);
      }
      if (!mass) return invalid('Enter the mass of at least one body.');
      const w1 = 2 * PI * v.n / 60, w2 = w1 * (1 - v.drop / 100), KE = J * w1 * w1 / 2, dE = J * (w1 * w1 - w2 * w2) / 2, k = Math.sqrt(J / mass) * 1000, ok = dE >= v.Ereq - 1e-9, Jneed = 2 * v.Ereq / (w1 * w1 - w2 * w2);
      return output({ J1: Js[0], J2: Js[1], J3: Js[2], J, mass, k, KE, dE, Jneed }, 'Total inertia (kg·m²)', J,
        [m('Total mass / inertia', `${q(mass, 'kg', 2)} / ${q(J, 'kg·m²', 5)}`), m('Radius of gyration', q(k, 'mm', 1)), m('Stored energy at speed', q(KE, 'J', 0)), m('Energy released for the drop', q(dE, 'J', 0)), m('Inertia needed for the duty', q(Jneed, 'kg·m²', 5))],
        'Composite rotor inertia and energy.', 'Rigid uniform bodies.', {
          text: ok ? 'ENERGY ADEQUATE' : 'ENERGY SHORT', tone: ok ? 'good' : 'bad',
          table: tbl('Bodies', ['Body', 'Mass (kg)', 'J about own axis (kg·m²)', 'J about rotation axis (kg·m²)'], rows),
          checks: [check('Energy per cycle', ok ? 'pass' : 'fail', `${q(dE, 'J', 0)} released against ${q(v.Ereq, 'J', 0)} needed.`), check('Rim speed', 'verify', 'Check the rim speed and stress of the largest body at this speed.')],
        });
    },
    "preferred-size-selection": (v) => {
      const n = Number(v.series), ratio = 10 ** (1 / n), reqs = [v.r1, v.r2, v.r3, v.r4, v.r5].map((r, i) => [i + 1, r]).filter((x) => x[1] > 0);
      if (!reqs.length) return invalid('Enter at least one requirement.');
      const rows = [], sizes = new Set(); let worst = 0;
      for (const [i, r] of reqs) { const k = Math.ceil(n * Math.log10(r) - 1e-9), s = 10 ** (k / n), over = (s / r - 1) * 100; worst = Math.max(worst, over); sizes.add(k); rows.push([String(i), q(r, '', 4), q(s, '', 5), String(Number(s.toPrecision(3))), q(over, '', 1)]); }
      const ok = worst <= v.maxOver + 1e-9;
      return output({ ratio, worst, distinct: sizes.size, count: reqs.length }, 'Largest oversize (%)', worst,
        [m('Series ratio', q(ratio, '', 4)), m('Requirements', String(reqs.length)), m('Distinct sizes', String(sizes.size)), m('Largest oversize', q(worst, '%', 1))],
        'Preferred size selection.', 'Exact Renard series values.', {
          text: ok ? 'SIZES SELECTED' : 'OVERSIZE TOO LARGE', tone: ok ? 'good' : 'bad',
          table: tbl('Chosen sizes', ['Requirement', 'Required', 'Preferred (exact)', 'Preferred (rounded)', 'Oversize (%)'], rows),
          checks: [check('Oversize', ok ? 'pass' : 'fail', `${q(worst, '%', 1)} against ${q(v.maxOver, '%', 0)}${ok ? '.' : ': use a finer series.'}`)],
        });
    },
    "stacked-solid-cg": (v) => {
      const rows = []; let z = 0, mass = 0, mz = 0, used = 0;
      for (let i = 1; i <= 3; i++) {
        const tp = v['type' + i]; if (tp === 'none') continue;
        const D1 = v['Da' + i], D2 = v['Db' + i], h = v['h' + i], R = D1 / 2; let V, cg, ht;
        if (tp === 'cyl') { V = PI * R * R * h; cg = h / 2; ht = h; }
        else if (tp === 'frustum') { const Rb = D1 / 2, Rt = D2 / 2, Rl = Math.max(Rb, Rt), rs = Math.min(Rb, Rt), c = h * (Rl * Rl + 2 * Rl * rs + 3 * rs * rs) / (4 * (Rl * Rl + Rl * rs + rs * rs)); V = PI * h * (Rl * Rl + Rl * rs + rs * rs) / 3; cg = Rb >= Rt ? c : h - c; ht = h; }
        else if (tp === 'coneUp' || tp === 'coneDown') { V = PI * R * R * h / 3; cg = tp === 'coneUp' ? h / 4 : h - h / 4; ht = h; }
        else { V = 2 * PI * R ** 3 / 3; cg = tp === 'hemiUp' ? 3 * R / 8 : R - 3 * R / 8; ht = R; }
        if (!(V > 0)) return invalid(`Part ${i} has no volume: enter its sizes.`);
        const mi = V / 1e9 * v['rho' + i]; used++; mass += mi; mz += mi * (z + cg); rows.push([String(i), q(V / 1e9, '', 4), q(mi, '', 1), q(cg, '', 1), q(z + cg, '', 1)]); z += ht;
      }
      if (!used) return invalid('Choose at least one part.');
      if (!(mass > 0)) return invalid('Enter a density for the parts.');
      const zs = mz / mass, zg = v.z0 + zs, tip = deg(Math.atan((v.Wb / 2) / zg)), ok = tip >= v.thMin - 1e-9;
      return output({ mass, zs, zg, height: z, tip }, 'Centre of gravity height (mm)', zg,
        [m('Total mass', q(mass, 'kg', 1)), m('Stack height', q(z, 'mm', 0)), m('CG above the stack bottom / above the base', `${q(zs, '', 1)} / ${q(zg, 'mm', 1)}`), m('Tipping angle', q(tip, '°', 1))],
        'Stacked solid centre of gravity.', 'Uniform solid parts; static tilt.', {
          text: ok ? 'STABLE' : 'TIPS TOO EASILY', tone: ok ? 'good' : 'bad',
          table: tbl('Parts', ['Part', 'Volume (m³)', 'Mass (kg)', 'Own CG (mm)', 'CG above stack bottom (mm)'], rows),
          checks: [check('Tipping angle', ok ? 'pass' : 'fail', `${q(tip, '°', 1)} against ${q(v.thMin, '°', 0)}${ok ? '.' : ': widen the base or lower the stack.'}`), check('Empty and part-full', 'verify', 'Check the empty vessel and part-full states as well; the CG moves as it fills.')],
        });
    },
    "three-point-support-loads": (v) => {
      const a = [[1, 1, 1], [v.sx1, v.sx2, v.sx3], [v.sy1, v.sy2, v.sy3]];
      const det = a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
      const scale = Math.max(1, ...a.flat().map(Math.abs));
      if (Math.abs(det) <= 1e-12 * scale ** 2) return invalid('The three supports lie on a line; they cannot carry the load.');
      const W = v.W1 + v.W2 + v.W3, Mx = v.W1 * v.wx1 + v.W2 * v.wx2 + v.W3 * v.wx3, My = v.W1 * v.wy1 + v.W2 * v.wy2 + v.W3 * v.wy3;
      if (W <= 0) return invalid('Enter at least one load.');
      const cof = (i, j) => { const r = [0, 1, 2].filter((x) => x !== i), c = [0, 1, 2].filter((x) => x !== j); return ((i + j) % 2 ? -1 : 1) * (a[r[0]][c[0]] * a[r[1]][c[1]] - a[r[0]][c[1]] * a[r[1]][c[0]]); };
      const inv = [0, 1, 2].map((i) => [0, 1, 2].map((j) => cof(j, i) / det)), b = [W, Mx, My], R = inv.map((row) => row[0] * b[0] + row[1] * b[1] + row[2] * b[2]).map((r) => (Math.abs(r) < 1e-9 * W ? 0 : r));
      const lift = R.some((r) => r < 0), okC = R.every((r) => r <= v.cap + 1e-9);
      return output({ W, xg: Mx / W, yg: My / W, R1: R[0], R2: R[1], R3: R[2], det }, 'Largest support reaction (N)', Math.max(...R),
        [m('Total load', q(W, 'N', 1)), m('Load acts at', `X ${q(Mx / W, '', 1)}, Y ${q(My / W, 'mm', 1)}`), m('Support 1 / 2 / 3', `${q(R[0], '', 1)} / ${q(R[1], '', 1)} / ${q(R[2], 'N', 1)}`)],
        'Three-point support loads.', 'Rigid body; vertical loads.', {
          text: lift ? 'SUPPORT LIFTS OFF' : okC ? 'SUPPORTS ADEQUATE' : 'SUPPORT OVERLOADED', tone: !lift && okC ? 'good' : 'bad',
          checks: [check('Uplift', lift ? 'fail' : 'pass', lift ? 'The combined load lies outside the support triangle: a support lifts and the body tips.' : 'All supports carry load.'), check('Capacity', okC ? 'pass' : 'fail', `Largest ${q(Math.max(...R), 'N', 1)} against ${q(v.cap, 'N', 0)}.`)],
        });
    },
    "sine-bar-dms-setup": (v) => {
      const toDms = (x) => { const a = Math.abs(x); let D = Math.floor(a), M = Math.floor((a - D) * 60), Sx = ((a - D) * 60 - M) * 60; if (Sx >= 59.9995) { Sx = 0; M++; } if (M >= 60) { M = 0; D++; } return `${D}° ${M}′ ${q(Sx, '″', 2)}`; };
      const decv = v.d + v.mi / 60 + v.s / 3600;
      if (decv <= 0.01 || decv > 80) return invalid('The angle must be between 0.01° and 80°.');
      const th = rad(decv), Hh = v.L * Math.sin(th), stack = Math.round(Hh / v.res) * v.res, thSet = Math.asin(Math.min(stack / v.L, 1)), errR = deg(thSet - th) * 3600, perUm = deg(0.001 / (v.L * Math.cos(th))) * 3600, errTot = Math.abs(errR) + v.tolS * perUm, ok = errTot <= v.angTol;
      if (v.Hm >= v.L) return invalid('The measured stack must be lower than the bar length.');
      const angM = v.Hm > 0 ? deg(Math.asin(v.Hm / v.L)) : 0;
      return output({ decv, radv: th, height: Hh, stack, angSet: deg(thSet), errR, perUm, errTot, angM }, 'Gauge-block stack (mm)', stack,
        [m('Angle', `${toDms(decv)} = ${q(decv, '°', 6)} = ${q(th, 'rad', 6)}`), m('Exact height difference', q(Hh, 'mm', 5)), m('Stack to build', q(stack, 'mm', 4)), m('Angle set by the stack', `${q(deg(thSet), '°', 5)} (${toDms(deg(thSet))})`), m('Total set-up error', q(errTot, '″', 2)), m('Angle from the measured stack', v.Hm > 0 ? `${q(angM, '°', 5)} (${toDms(angM)})` : 'No stack entered')],
        'Sine bar set-up from degrees, minutes and seconds.', 'Bar, rollers and plate taken as perfect.', {
          text: ok ? 'SET-UP ADEQUATE' : 'SET-UP TOO COARSE', tone: ok ? 'good' : 'bad',
          checks: [check('Angle error', ok ? 'pass' : 'fail', `${q(errTot, '″', 2)} against ±${q(v.angTol, '″', 1)}.`), check('Angle range', decv <= 45 ? 'pass' : 'warn', decv <= 45 ? 'At or below 45°.' : 'Above 45°: set the complement and use an angle plate, or a longer bar.'), check('Stack', 'verify', 'Build the stack with the fewest blocks and wring them clean.')],
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
