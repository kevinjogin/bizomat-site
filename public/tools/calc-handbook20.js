// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook20). SI units are explicit at each boundary.
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
    "lever-force": (v) => {
      const W = v.W1 + v.W2 + v.W3, Mw = v.W1 * v.a1 + v.W2 * v.a2 + v.W3 * v.a3;
      if (Mw <= 0) return invalid('Enter at least one load with a distance from the fulcrum.');
      const F = v.mode === 'force' ? Mw / v.x : v.F, x = v.mode === 'force' ? v.x : Mw / v.F;
      const R = v.type === 'first' ? F + W : Math.abs(W - F), MA = W / F;
      const third = v.type === 'third', far = Math.max(v.a1, v.a2, v.a3);
      return output({ F, x, MA, R }, v.mode === 'force' ? 'Effort (N)' : 'Effort arm (mm)', v.mode === 'force' ? F : x,
        [m('Effort', q(F, 'N', 2)), m('Effort arm', q(x, 'mm', 1)), m('Total load', q(W, 'N', 1)), m('Load moment', q(Mw / 1000, 'N·m', 3)), m('Mechanical advantage', q(MA, '', 3)), m('Fulcrum reaction', q(R, 'N', 1))],
        'Lever balance about the fulcrum.', 'Static, rigid lever.', {
          checks: [check('Arrangement', third && x > far ? 'warn' : !third && v.type === 'second' && x < far ? 'warn' : 'pass', third && x > far ? 'For a third-class lever the effort lies between the fulcrum and the loads; the arm found lies beyond them.' : v.type === 'second' && x < far ? 'For a second-class lever the effort lies beyond the loads.' : 'Consistent with the lever type.')],
        });
    },
    "hoist-advantage": (v) => {
      let ideal, travel, travelLabel = 'Load travel per turn';
      if (v.type === 'wheel') { ideal = v.W * v.r / v.R; travel = 2 * PI * v.r; }
      else if (v.type === 'geared') { ideal = v.W * v.r / (v.R * v.g1 * v.g2); travel = 2 * PI * v.r / (v.g1 * v.g2); }
      else if (v.type === 'block') { ideal = v.W / v.n; travel = 1000 / v.n; travelLabel = 'Load travel per metre of rope pulled'; }
      else {
        if (v.R <= v.r) return invalid('The large radius must exceed the small radius.');
        if (v.type === 'diff') { ideal = v.W * (v.R - v.r) / (2 * v.R); travel = PI * (v.R - v.r); travelLabel = 'Load travel per turn of the sheave'; }
        else { ideal = v.W * (v.R - v.r) / (2 * v.crank); travel = PI * (v.R - v.r); }
      }
      const F = ideal / (v.eff / 100), MA = v.W / F;
      return output({ ideal, F, MA, travel }, 'Effort with friction (N)', F,
        [m('Ideal effort', q(ideal, 'N', 2)), m('Effort with friction', q(F, 'N', 2)), m('Mechanical advantage', q(MA, '', 2)), m(travelLabel, q(travel, 'mm', 2))],
        'Effort for the lifting machine.', 'Static lift; single efficiency.', {
          checks: [check('Self-sustaining', v.eff < 50 ? 'pass' : 'verify', v.eff < 50 ? 'Below 50% efficiency the machine generally holds the load without a brake.' : 'Above about 50% efficiency the load can run back; provide a brake or pawl.')],
        });
    },
    "agma-bending-stress": (v) => {
      const sF = v.Ft * v.Ko * v.Kv * v.Ks * v.KH * v.KB / (v.b * v.mt * v.J), n = v.allow / sF, cap = v.Ft * n / v.req, vd = verdict(n, v.req, 'BENDING ADEQUATE', 'BENDING OVERSTRESSED');
      return output({ sF, n, cap }, 'Bending stress (MPa)', sF,
        [m('Tooth bending stress', q(sF, 'MPa', 1)), m('Safety factor', q(n, '', 2)), m('Tangential load capacity at required factor', q(cap, 'N', 0))],
        'AGMA tooth bending stress.', 'Factors and allowable from the standard.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Bending safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 2)}.`), check('Pitting', 'verify', 'Check contact (pitting) stress separately.')],
        });
    },
    "spline-torque-capacity": (v) => {
      if (v.Dh >= v.Dre) return invalid('The bore must be smaller than the root diameter.');
      if (v.Dre >= v.D) return invalid('The root diameter must be smaller than the pitch diameter.');
      const Tn = v.T * 1000;
      const sRoot = v.Dh > 0 ? 16 * Tn * v.Dre * v.Ka / (PI * (v.Dre ** 4 - v.Dh ** 4) * v.Kf) : 16 * Tn * v.Ka / (PI * v.Dre ** 3 * v.Kf);
      const kAcc = v.acc === 'good' ? 4 : 6, sPitch = kAcc * Tn * v.Ka * v.Km / (v.D * v.Nt * v.Le * v.t * v.Kf);
      const sComp = v.kind === 'flexible' ? 2 * Tn * v.Km * v.Ka / (v.D * v.Nt * v.Le * v.h * v.Kw) : 2 * Tn * v.Km * v.Ka / (9 * v.D * v.Nt * v.Le * v.h * v.Kf);
      const sMax = Math.max(sRoot, sPitch), okS = sMax <= v.Ss, okC = sComp <= v.Sc, ok = okS && okC;
      return output({ sRoot, sPitch, sComp }, 'Root shear stress (MPa)', sRoot,
        [m('Shear under the roots', q(sRoot, 'MPa', 1)), m('Shear at the pitch diameter', q(sPitch, 'MPa', 1)), m('Compressive stress on the teeth', q(sComp, 'MPa', 2)), m('Shear utilisation', q(sMax / v.Ss * 100, '%', 0)), m('Compression utilisation', q(sComp / v.Sc * 100, '%', 0))],
        'Spline stresses against allowables.', 'Dudley spline formulas.', {
          text: ok ? 'SPLINE ADEQUATE' : 'SPLINE OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Shear', okS ? 'pass' : 'fail', `${q(sMax, 'MPa', 1)} against ${q(v.Ss, 'MPa', 0)}.`), check('Compression', okC ? 'pass' : 'fail', `${q(sComp, 'MPa', 2)} against ${q(v.Sc, 'MPa', 1)}.`)],
        });
    },
    "internal-gear": (v) => {
      if (v.Zp >= v.Zg) return invalid('The internal gear must have more teeth than the pinion.');
      const Dg = v.m * v.Zg, Dp = v.m * v.Zp, C = v.m * (v.Zg - v.Zp) / 2, Di = v.m * (v.Zg - 1.2), DiC = v.m * (v.Zg - 2), Dop = v.m * (v.Zp + 2.5), DopC = v.m * (v.Zp + 2);
      const minDiff = v.form === '20fd' ? 12 : v.form === '20stub' ? 8 : 15, diff = v.Zg - v.Zp, ok = diff >= minDiff;
      return output({ Dg, Dp, C, Di, DiC, Dop, DopC, tg: 1.3888 * v.m, tp: 1.7528 * v.m }, 'Centre distance (mm)', C,
        [m('Internal gear pitch diameter', q(Dg, 'mm', 3)), m('Pinion pitch diameter', q(Dp, 'mm', 3)), m('Centre distance', q(C, 'mm', 3)), m('Internal diameter (enlarged)', q(Di, 'mm', 3)), m('Internal diameter (conventional)', q(DiC, 'mm', 3)), m('Pinion outside diameter (enlarged)', q(Dop, 'mm', 3)), m('Pinion outside diameter (conventional)', q(DopC, 'mm', 3)), m('Internal gear arc tooth thickness', q(1.3888 * v.m, 'mm', 3)), m('Pinion arc tooth thickness', q(1.7528 * v.m, 'mm', 3))],
        'Internal gear proportions.', 'Handbook rules for internal gearing.', {
          text: ok ? 'NUMBERS COMPATIBLE' : 'INTERFERENCE LIKELY', tone: ok ? 'good' : 'bad',
          checks: [check('Tooth-number difference', ok ? 'pass' : 'fail', `${diff} teeth against a minimum of ${minDiff}.`), check('Pinion size', v.Zp >= 16 ? 'pass' : 'warn', v.Zp >= 16 ? 'Enlargement rules apply.' : 'The enlargement rules are stated for pinions of 16 teeth or more.')],
        });
    },
    "film-thickness-ratio": (v) => {
      const f = v.rtype === 'ra' ? 1.25 : 1, Rc = Math.hypot(v.R1 * f, v.R2 * f);
      if (Rc === 0) return invalid('Enter a roughness for at least one surface.');
      const lam = v.h / Rc, regime = lam < 1 ? 'Boundary' : lam < 3 ? 'Mixed' : 'Full film';
      return output({ Rc, lam }, 'Film thickness ratio λ', lam,
        [m('Composite RMS roughness', q(Rc, 'µm', 4)), m('Film thickness ratio λ', q(lam, '', 3)), m('Regime', regime)],
        'Film thickness ratio.', 'Film thickness from your EHL source.', {
          text: regime.toUpperCase(), tone: lam >= 3 ? 'good' : lam >= 1 ? 'warn' : 'bad',
          checks: [check('Separation', lam >= 3 ? 'pass' : lam >= 1 ? 'warn' : 'fail', lam >= 3 ? 'Surfaces are separated by the film.' : lam >= 1 ? 'Partial asperity contact; additives and cleanliness matter.' : 'Asperity contact; expect surface distress and reduced life.')],
        });
    },
    "turn-of-nut-preload": (v) => {
      if (v.Ls + v.Lt <= 0) return invalid('Enter the shank and/or threaded length in the grip.');
      const As = area(v.d), Eb = v.E * 1000, flex = (v.Ls / As + v.Lt / v.At) / Eb, kb = 1 / flex, cj = v.kj > 0 ? 1 / (v.kj * 1000) : 0;
      let F, B, theta;
      if (v.mode === 'angle') { F = v.Ft * 1000; B = F * flex; theta = 360 * (B + F * cj) / v.lead; }
      else { theta = v.theta; F = theta / 360 * v.lead / (flex + cj); B = F * flex; }
      return output({ B, theta, F: F / 1000, kb: kb / 1000 }, v.mode === 'angle' ? 'Turn angle (°)' : 'Preload (kN)', v.mode === 'angle' ? theta : F / 1000,
        [m('Bolt elongation', q(B, 'mm', 4)), m('Turn angle from snug', q(theta, '°', 1)), m('Preload', q(F / 1000, 'kN', 2)), m('Bolt stiffness', q(kb / 1000, 'kN/mm', 1)), m('Thread stress at preload', q(F / v.At, 'MPa', 0))],
        'Turn-of-nut relation.', 'Elastic bolt; joint as entered.', {
          checks: [check('Joint compliance', v.kj > 0 ? 'pass' : 'verify', v.kj > 0 ? 'Joint compression included.' : 'Rigid joint assumed (handbook relation); real joints need more turn.')],
        });
    },
    "deep-draw-force": (v) => {
      let F, metrics;
      if (v.op === 'first') { F = PI * v.dm * v.T * v.UTS; metrics = [m('Mean shell diameter', q(v.dm, 'mm', 1))]; }
      else if (v.op === 'redraw') { if (v.D <= v.dp) return invalid('The blank must be larger than the punch.'); const ratio = v.D / v.dp; F = PI * v.dp * v.T * v.UTS * (ratio - 0.7); metrics = [m('Blank ÷ punch diameter', q(ratio, '', 3))]; }
      else { if (v.c >= v.T) return invalid('The ironed wall (clearance) must be thinner than the incoming wall.'); F = PI * v.d0 * (v.T - v.c) * v.Sc; metrics = [m('Wall reduction', q((v.T - v.c) / v.T * 100, '%', 1))]; }
      const kN = F / 1000, use = kN / v.press * 100, ok = kN <= v.press;
      return output({ F: kN, use }, 'Punch force (kN)', kN,
        [m('Punch force', q(kN, 'kN', 2)), ...metrics, m('Press utilisation', q(use, '%', 0))],
        'Drawing or ironing force.', 'Handbook formulas without friction.', {
          text: ok ? 'WITHIN PRESS CAPACITY' : 'EXCEEDS PRESS CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Press capacity', ok ? 'pass' : 'fail', `${q(kN, 'kN', 1)} against ${q(v.press, 'kN', 0)}.`), check('Blank holder', 'verify', 'Add blank-holder force where a holder is used.')],
        });
    },
    "thread-roll-diameter": (v) => {
      const D = v.Ns * (v.d - v.T / 2) - v.T; if (D <= 0) return invalid('The thread depth is too large for this pitch diameter.');
      return output({ D, lead: v.Ns * v.P, ratio: D / v.d }, 'Roll pitch diameter (mm)', D,
        [m('Roll pitch diameter', q(D, 'mm', 4)), m('Roll pitch diameter', q(D / 25.4, 'in', 4)), m('Roll lead', q(v.Ns * v.P, 'mm', 4)), m('Roll ÷ work pitch diameter', q(D / v.d, '', 4))],
        'Threading roll size.', 'Handbook formula.');
    },
    "hobbing-time": (v) => {
      if (v.h >= v.Dh) return invalid('The tooth depth must be smaller than the hob diameter.');
      const n = 1000 * v.Vc / (PI * v.Dh), nw = n * v.starts / v.z, approach = Math.sqrt(v.h * (v.Dh - v.h)), travel = v.b / Math.cos(rad(v.beta)) + approach + v.over;
      const tStack = travel / (v.f * nw), tCut = tStack / v.stack, tFloor = (tStack + v.load) / v.stack;
      return output({ n, nw, approach, travel, tCut, tFloor }, 'Cutting time per gear (min)', tCut,
        [m('Hob speed', q(n, 'rpm', 0)), m('Work speed', q(nw, 'rpm', 3)), m('Approach', q(approach, 'mm', 2)), m('Total hob travel', q(travel, 'mm', 1)), m('Cutting time per gear', q(tCut, 'min', 2)), m('Floor-to-floor per gear', q(tFloor, 'min', 2))],
        'Hobbing time.', 'Single pass at constant feed.');
    },
    "angle-ring-length": (v) => {
      const sign = v.place === 'inside' ? -1 : 1, corr = v.mode === 'axis' ? 2 * PI * v.x : v.k, L = PI * v.D + sign * corr, Dn = L / PI;
      if (Dn <= 0) return invalid('The correction is larger than the diameter allows.');
      return output({ L, Dn, corr }, 'Cut length (mm)', L,
        [m('Cut length', q(L, 'mm', 1)), m('Neutral-axis diameter', q(Dn, 'mm', 1)), m('Shell circumference', q(PI * v.D, 'mm', 1)), m(v.place === 'inside' ? 'Correction subtracted' : 'Correction added', q(corr, 'mm', 2))],
        'Rolled ring length.', 'Neutral axis at the centroid.');
    },
    "perforated-open-area": (v) => {
      if (v.d >= v.p) return invalid('The hole must be smaller than the pitch.');
      const stag = v.pattern === 'stag60', OA = (stag ? 90.69 : 78.54) * (v.d / v.p) ** 2, perM2 = (stag ? 1.1547 : 1) / (v.p / 1000) ** 2, mass = v.A * v.t / 1000 * v.rho * (1 - OA / 100);
      return output({ OA, perM2, mass }, 'Open area (%)', OA,
        [m('Open area', q(OA, '%', 2)), m('Holes per square metre', q(perM2, '', 0)), m('Holes in the sheet', q(perM2 * v.A, '', 0)), m('Ligament width', q(v.p - v.d, 'mm', 2)), m('Perforated sheet mass', q(mass, 'kg', 2)), m('Mass saved', q(v.A * v.t / 1000 * v.rho - mass, 'kg', 2))],
        'Perforated sheet open area.', 'Full field of holes.', {
          checks: [check('Ligament', v.p - v.d >= v.t ? 'pass' : 'warn', v.p - v.d >= v.t ? 'Ligament at least the sheet thickness.' : 'Ligament thinner than the sheet; confirm the supplier can punch it.')],
        });
    },
    "sound-level": (v) => {
      const p = (L) => 10 ** (L / 10);
      if (v.mode === 'machine') {
        if (v.T <= v.B) return invalid('The total level must exceed the background level.');
        const L = 10 * Math.log10(p(v.T) - p(v.B)), diff = v.T - v.B;
        return output({ L }, 'Machine level (dB)', L,
          [m('Machine level alone', q(L, 'dB', 1)), m('Total minus background', q(diff, 'dB', 1)), m('Correction to the total', q(v.T - L, 'dB', 2))],
          'Machine noise from two readings.', 'Steady noise, same weighting.', {
            checks: [check('Background margin', diff >= 3 ? 'pass' : 'warn', diff >= 3 ? 'Usable difference between readings.' : 'Total and background are within 3 dB; the result is very sensitive to reading error.')],
          });
      }
      if (v.mode === 'sum') {
        const levels = [v.L1, v.L2, v.L3, v.L4].filter((x) => x > 0); if (!levels.length) return invalid('Enter at least one source level.');
        const L = 10 * Math.log10(levels.reduce((s, x) => s + p(x), 0));
        return output({ L }, 'Combined level (dB)', L,
          [m('Combined level', q(L, 'dB', 1)), m('Loudest source', q(Math.max(...levels), 'dB', 1)), m('Increase over loudest', q(L - Math.max(...levels), 'dB', 2)), m('Sources', q(levels.length, '', 0))],
          'Combined noise level.', 'Incoherent sources.');
      }
      const L = v.Lr - 20 * Math.log10(v.r2 / v.r1);
      return output({ L }, 'Level at the new distance (dB)', L,
        [m('Level at new distance', q(L, 'dB', 1)), m('Change', q(L - v.Lr, 'dB', 1)), m('Distance ratio', q(v.r2 / v.r1, '', 3))],
        'Level change with distance.', 'Point source in a free field.');
    },
    "equivalent-stiffness-thickness": (v) => {
      const tStiff = v.t1 * Math.cbrt(v.E1 / v.E2), tStr = v.t1 * Math.sqrt(v.S1 / v.S2), t2 = Math.max(tStiff, tStr), mr = v.rho2 * t2 / (v.rho1 * v.t1);
      return output({ tStiff, tStr, t2, mr }, 'Governing thickness (mm)', t2,
        [m('Thickness for equal stiffness', q(tStiff, 'mm', 3)), m('Thickness for equal strength', q(tStr, 'mm', 3)), m('Governing', tStiff >= tStr ? 'Stiffness' : 'Strength'), m('Mass ratio new ÷ original', q(mr, '', 3))],
        'Equivalent thickness for the substitute material.', 'Same shape, bending only.');
    },
    "matrix-3x3": (v) => {
      const a = [[v.a11, v.a12, v.a13], [v.a21, v.a22, v.a23], [v.a31, v.a32, v.a33]];
      const cof = (i, j) => { const r = [0, 1, 2].filter((x) => x !== i), c = [0, 1, 2].filter((x) => x !== j); return ((i + j) % 2 ? -1 : 1) * (a[r[0]][c[0]] * a[r[1]][c[1]] - a[r[0]][c[1]] * a[r[1]][c[0]]); };
      const C = [0, 1, 2].map((i) => [0, 1, 2].map((j) => cof(i, j))), det = a[0][0] * C[0][0] + a[0][1] * C[0][1] + a[0][2] * C[0][2];
      const scale = Math.max(...a.flat().map(Math.abs));
      if (Math.abs(det) <= 1e-12 * Math.max(1, scale) ** 3) return invalid('The matrix is singular (determinant zero), so it has no inverse.');
      const adj = [0, 1, 2].map((i) => [0, 1, 2].map((j) => C[j][i])), inv = adj.map((row) => row.map((x) => x / det));
      let err = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += a[i][k] * inv[k][j]; err = Math.max(err, Math.abs(s - (i === j ? 1 : 0))); }
      const values = { det, err }; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) values[`i${i + 1}${j + 1}`] = inv[i][j];
      const fmtRow = (r) => r.map((x) => q(x, '', 5));
      return output(values, 'Determinant', det,
        [m('Determinant', q(det, '', 6)), m('Inverse row 1', fmtRow(inv[0]).join('  ')), m('Inverse row 2', fmtRow(inv[1]).join('  ')), m('Inverse row 3', fmtRow(inv[2]).join('  ')), m('Check |A A⁻¹ − I|', q(err, '', 2))],
        'Determinant and inverse.', 'Exact cofactor method in floating point.', {
          table: tbl('Adjoint and inverse', ['Row', 'Adjoint', 'Inverse'], [0, 1, 2].map((i) => [String(i + 1), fmtRow(adj[i]).join('  '), fmtRow(inv[i]).join('  ')])),
        });
    },
    "wood-moisture-density": (v) => {
      if (v.wet < v.dry) return invalid('The tested mass cannot be less than the oven-dry mass.');
      const MC = (v.wet - v.dry) / v.dry * 100, rho = 1000 * v.G * (1 + v.M / 100) / (1 + 0.009 * v.G * v.M), mass = rho * v.V / 1000;
      return output({ MC, rho, mass }, 'Moisture content (%)', MC,
        [m('Moisture content of the sample', q(MC, '%', 1)), m('Density at the moisture content', q(rho, 'kg/m³', 1)), m('Density at the moisture content', q(rho / 16.0185, 'lb/ft³', 2)), m('Mass of the piece', q(mass, 'kg', 2))],
        'Wood moisture and density.', 'Handbook density formula.', {
          checks: [check('Fibre saturation', v.M <= 30 ? 'pass' : 'warn', v.M <= 30 ? 'Within the range of the density formula.' : 'Above fibre saturation the formula is approximate.')],
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
