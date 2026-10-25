// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook16). SI units are explicit at each boundary.
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
    "unified-thread-limits": (v) => {
      const r4 = (x) => Math.round(x * 1e4) / 1e4, r6 = (x) => Math.round(x * 1e6) / 1e6, P = Math.round(1e8 / v.n) / 1e8, LE = v.LE || Math.min(9 * P, v.D);
      const base = r6(0.0015 * Math.cbrt(v.D) + 0.0015 * Math.sqrt(LE) + 0.015 * Math.cbrt(P * P)), fac = { 1: 1.5, 2: 1, 3: 0.75 }[v.cls];
      const Td2 = r6(base * fac), TD2 = r6(1.3 * Td2), es = v.cls === '3' ? 0 : r4(0.3 * base), Td = (v.cls === '1' ? 0.09 : 0.06) * Math.cbrt(P * P), has2 = r6(0.64951905 * P);
      const dmax = r4(v.D - es), dmin = r4(dmax - Td), d2max = r4(dmax - has2), d2min = r4(d2max - Td2), d3max = r4(dmax - 1.19078493 * P), D2min = r4(v.D - has2), D2max = r4(D2min + TD2), D1min = Math.round((v.D - 1.08253175 * P) * 1000) / 1000;
      if (d3max <= 0) return invalid('Too few threads per inch for this diameter.');
      const majText = `${q(dmax, '', 4)} / ${q(dmin, 'in', 4)}`, pitchText = `${q(d2max, '', 4)} / ${q(d2min, 'in', 4)}`;
      return output({ es, dmax, dmin, d2max, d2min, d3max, D2min, D2max, D1min, Td2, majText, pitchText }, 'External pitch diameter max (in)', d2max,
        [m('Allowance', q(es, 'in', 4)), m(`External major (${v.cls}A) max / min`, majText), m(`External pitch (${v.cls}A) max / min`, pitchText), m('External UNR minor max', q(d3max, 'in', 4)), m(`Internal pitch (${v.cls}B) min / max`, `${q(D2min, '', 4)} / ${q(D2max, 'in', 4)}`), m('Internal minor min', q(D1min, 'in', 3)), m('Pitch tolerances external / internal', `${q(Td2, '', 6)} / ${q(TD2, 'in', 6)}`)],
        `Limits of size for ${q(v.D, '', 4)}-${q(v.n, '', 1)} UN class ${v.cls}A/${v.cls}B.`, 'ASME B1.1 formulas; internal minor maximum from tables.', {
          table: tbl('Limits in millimetres', ['Feature', 'Max (mm)', 'Min (mm)'], [['External major', q(dmax * 25.4, '', 4), q(dmin * 25.4, '', 4)], ['External pitch', q(d2max * 25.4, '', 4), q(d2min * 25.4, '', 4)], ['Internal pitch', q(D2max * 25.4, '', 4), q(D2min * 25.4, '', 4)]]),
          checks: [check('Internal minor maximum', 'verify', 'Take the maximum internal minor diameter from the ASME B1.1 tables.')],
        });
    },
    "metric-thread-limits": (v) => {
      const ranges = [1.4, 2.8, 5.6, 11.2, 22.4, 45, 90, 180, 355, 600]; let lo = 0.99, hi = 1.4; for (let i = 0; i < ranges.length; i++) { if (v.d <= ranges[i]) { hi = ranges[i]; lo = i ? ranges[i - 1] : 0.99; break; } }
      const dm = Math.sqrt(lo * hi), gf = { 4: 0.63, 5: 0.8, 6: 1, 7: 1.25, 8: 1.6 }, eg = Number(v.ext[0]), ig = Number(v.int[0]), P = v.P;
      const esMap = { e: -(50 + 11 * P), f: -(30 + 11 * P), g: -(15 + 11 * P), h: 0 }, EIMap = { G: 15 + 11 * P, H: 0 };
      const R40 = [100, 106, 112, 118, 125, 132, 140, 150, 160, 170, 180, 190, 200, 212, 224, 236, 250, 265, 280, 300, 315, 335, 355, 375, 400, 425, 450, 475, 500, 530, 560, 600, 630, 670, 710, 750, 800, 850, 900, 950];
      const r40 = (um) => { const e = Math.pow(10, Math.floor(Math.log10(um)) - 2); let best = R40[0] * e; for (const k of [...R40.map((x) => x * e), 1000 * e]) if (Math.abs(Math.log(k / um)) < Math.abs(Math.log(best / um))) best = k; return best / 1000; };
      const es = -Math.round(-esMap[v.ext[1]]) / 1000, EI = Math.round(EIMap[v.int[1]]) / 1000, Td = r40(gf[eg] * (180 * Math.pow(P, 2 / 3) - 3.15 / Math.sqrt(P))), Td2 = r40(gf[eg] * 90 * Math.pow(P, 0.4) * Math.pow(dm, 0.1));
      const TD2 = r40(gf[ig] * 1.32 * 90 * Math.pow(P, 0.4) * Math.pow(dm, 0.1)), TD1 = r40(gf[ig] * (P < 1 ? 433 * P - 190 * Math.pow(P, 1.22) : 230 * Math.pow(P, 0.7)));
      const d2 = v.d - 0.649519 * P, D1 = v.d - 1.082532 * P, r3 = (x) => Math.round(x * 1000) / 1000;
      const dmax = r3(v.d + es), dmin = r3(dmax - Td), d2max = r3(d2 + es), d2min = r3(d2max - Td2), D2min = r3(d2 + EI), D2max = r3(D2min + TD2), D1min = r3(D1 + EI), D1max = r3(D1min + TD1);
      const d2Text = `${q(d2max, '', 3)} / ${q(d2min, 'mm', 3)}`, D2Text = `${q(D2min, '', 3)} / ${q(D2max, 'mm', 3)}`;
      return output({ es, EI, Td2, TD2, TD1, dmax, dmin, d2max, d2min, D2min, D2max, D1min, D1max, d2Text, D2Text }, 'External pitch diameter max (mm)', d2max,
        [m(`External ${v.ext}: major max / min`, `${q(dmax, '', 3)} / ${q(dmin, 'mm', 3)}`), m(`External ${v.ext}: pitch max / min`, d2Text), m(`Internal ${v.int}: minor min / max`, `${q(D1min, '', 3)} / ${q(D1max, 'mm', 3)}`), m(`Internal ${v.int}: pitch min / max`, D2Text), m('Deviations es / EI', `${q(es * 1000, '', 0)} / ${q(EI * 1000, 'µm', 0)}`), m('Tolerances Td2 / TD2 / TD1', `${q(Td2 * 1000, '', 0)} / ${q(TD2 * 1000, '', 0)} / ${q(TD1 * 1000, 'µm', 0)}`)],
        `Limits of size for M${q(v.d, '', 3)} × ${q(P, '', 3)}.`, 'ISO 965-1 formulas; tables round slightly differently.', {
          checks: [check('Table values', 'verify', 'Confirm against ISO 965-2/-3 tables for acceptance inspection.')],
        });
    },
    "whitworth-thread": (v) => {
      const p = 1 / v.n, h = 0.640327 * p, d2 = v.D - h, d1 = v.D - 2 * h;
      if (d1 <= 0) return invalid('Too few threads per inch for this diameter.');
      return output({ h, d2, d1, r: 0.137329 * p }, 'Pitch diameter (in)', d2,
        [m('Pitch', `${q(p, 'in', 5)} (${q(p * 25.4, 'mm', 4)})`), m('Thread depth', `${q(h, 'in', 5)} (${q(h * 25.4, 'mm', 4)})`), m('Pitch diameter', `${q(d2, 'in', 5)} (${q(d2 * 25.4, 'mm', 3)})`), m('Minor diameter', `${q(d1, 'in', 5)} (${q(d1 * 25.4, 'mm', 3)})`), m('Crest and root radius', q(0.137329 * p, 'in', 5))],
        'Basic Whitworth form dimensions.', 'Basic sizes; tolerances from the standard.', { checks: [check('Thread form', 'verify', 'Confirm the 55° form with a thread gauge before machining a mating part.')] });
    },
    "three-wire-lead-angle": (v) => {
      const A = rad(v.angle / 2), lead = v.starts * v.P, B = Math.atan(lead / (PI * v.E)), An = v.plane === 'axial' ? Math.atan(Math.tan(A) * Math.cos(B)) : A, Tt = v.P / 2;
      const W = Tt * Math.cos(B) / Math.cos(An), M = v.E + W * (1 + Math.sin(An)), Msimple = v.E - (v.P / 2) / Math.tan(A) + W * (1 + 1 / Math.sin(A));
      return output({ B: deg(B), An: deg(An), W, M, Msimple }, 'Measurement over wires', M,
        [m('Lead angle', q(deg(B), '°', 4)), m('Normal half-angle', q(deg(An), '°', 4)), m('Wire diameter required', q(W, '', 5)), m('Measurement over wires (Buckingham)', q(M, '', 5)), m('Simple formula (no lead correction)', q(Msimple, '', 5)), m('Difference', q(M - Msimple, '', 5))],
        'Wire measurement corrected for lead angle.', 'Buckingham simplified formula.', {
          checks: [check('Lead angle range', deg(B) <= 10 ? 'pass' : 'warn', deg(B) <= 10 ? 'Within the formula’s accurate range.' : 'Lead angle over 10°: consider the involute helicoid method.')],
        });
    },
    "involute-spline": (v) => {
      const P = v.Pd, Nn = v.Nt, D = Nn / P, phi = v.type === '37fillet' ? 37.5 : 30, cF = Math.min(0.01, Math.max(0.002, 0.001 * D));
      const sv = v.type === '37fillet' ? (0.5 * PI + 0.1) / P : PI / (2 * P); let Dri, Di, Dre, DFi, DFe;
      if (v.type === '30flat') { Dri = (Nn + 1.35) / P; Di = (Nn - 1) / P; Dre = (Nn - 1.35) / P; DFi = (Nn + 1) / P + 2 * cF; DFe = (Nn - 1) / P - 2 * cF; }
      else if (v.type === '30major') { Dri = (Nn + 1) / P; Di = (Nn - 1) / P; Dre = (Nn - 1.35) / P; DFi = (Nn + 0.8) / P - 0.004 + 2 * cF; DFe = (Nn - 1) / P - 2 * cF; }
      else if (v.type === '30fillet') { Dri = (Nn + 1.8) / P; Di = (Nn - 1) / P; Dre = (Nn - (P <= 12 ? 1.8 : 2)) / P; DFi = (Nn + 1) / P + 2 * cF; DFe = (Nn - 1) / P - 2 * cF; }
      else { Dri = (Nn + 1.6) / P; Di = (Nn - 0.8) / P; Dre = (Nn - 1.3) / P; DFi = (Nn + 1) / P + 2 * cF; DFe = (Nn - 0.8) / P - 2 * cF; }
      const Do = (Nn + 1) / P, f4 = (x) => q(x, '', 4);
      return output({ D, Db: D * Math.cos(rad(phi)), Do, Dri, Di, Dre, DFi, DFe, sv, cF }, 'Pitch diameter (in)', D,
        [m('Pitch diameter / base diameter', `${f4(D)} / ${q(D * Math.cos(rad(phi)), 'in', 4)}`), m('Major diameter internal / external', `${f4(Dri)} / ${q(Do, 'in', 4)}`), m('Minor diameter internal / external', `${f4(Di)} / ${q(Dre, 'in', 4)}`), m('Form diameter internal / external', `${f4(DFi)} / ${q(DFe, 'in', 4)}`), m('Circular pitch', q(PI / P, 'in', 4)), m('Minimum effective space width', q(sv, 'in', 4)), m('Form clearance', q(cF, 'in', 4))],
        `${phi}° involute spline, ${Nn} teeth, ${P}/${2 * P} pitch.`, 'Basic dimensions; tolerances from ANSI B92.1.', { checks: [check('Fit class tolerances', 'verify', 'Apply the tolerance class from ANSI B92.1 for manufacture and inspection.')] });
    },
    "gear-cutter-number": (v) => {
      const Nf = v.type === 'spur' ? v.Nt : v.type === 'helical' ? v.Nt / Math.cos(rad(v.helix)) ** 3 : v.Nt / Math.cos(rad(v.pitchAngle)), n = Math.round(Nf * 1e6) / 1e6;
      const reg = [[135, '1'], [55, '2'], [35, '3'], [26, '4'], [21, '5'], [17, '6'], [14, '7'], [12, '8']], half = [[135, '—'], [80, '1½'], [55, '—'], [42, '2½'], [35, '—'], [30, '3½'], [26, '—'], [23, '4½'], [21, '—'], [19, '5½'], [17, '—'], [15, '6½'], [14, '—'], [13, '7½'], [12, '—']];
      const cutter = (reg.find((r) => n >= r[0]) || [0, 'below range'])[1], halfC = (half.find((r) => n >= r[0]) || [0, '—'])[1];
      if (n < 12) return invalid('Fewer than 12 formative teeth is below the standard cutter range.');
      return output({ Nf, cutter, halfC }, 'Formative teeth', Nf,
        [m('Formative (equivalent) teeth', q(Nf, '', 2)), m('Regular cutter', `No. ${cutter}`), m('Half-number cutter', halfC === '—' ? 'Not needed (use the regular cutter)' : `No. ${halfC}`)],
        `Use a No. ${cutter} involute cutter.`, 'Form-cutter approximation.', { checks: [check('Cutter pitch', 'verify', 'Use the cutter of the same diametral pitch or module (normal pitch for helical gears).')] });
    },
    "crossed-helical-gears": (v) => {
      const g = rad(v.psi), p = PI / 2 - g, D = v.Nt / (v.Pn * Math.cos(g)), d = v.n / (v.Pn * Math.cos(p)), C = (D + d) / 2;
      return output({ D, d, C, LG: PI * D / Math.tan(g), LP: PI * d / Math.tan(p) }, 'Centre distance (in)', C,
        [m('Gear / pinion pitch diameter', `${q(D, '', 4)} / ${q(d, 'in', 4)}`), m('Gear / pinion outside diameter', `${q(D + 2 / v.Pn, '', 4)} / ${q(d + 2 / v.Pn, 'in', 4)}`), m('Centre distance', `${q(C, 'in', 4)} (${q(C * 25.4, 'mm', 2)})`), m('Gear / pinion lead', `${q(PI * D / Math.tan(g), '', 3)} / ${q(PI * d / Math.tan(p), 'in', 3)}`), m('Ratio', q(v.Nt / v.n, '', 4))],
        'Crossed helical pair at 90°.', 'Light-load, point-contact drive.', { checks: [check('Hand of helix', 'verify', 'Both gears need the same hand for shafts at right angles.')] });
    },
    "keyseat-depth": (v) => {
      if (v.w >= v.D) return invalid('The key width must be smaller than the shaft diameter.');
      const Y = (v.D - Math.sqrt(v.D * v.D - v.w * v.w)) / 2, S = v.D - Y - v.t, Tm = S + v.h;
      return output({ Y, depth: Y + v.t, S, T: Tm }, 'Measurement S', S,
        [m('Chordal height Y', q(Y, '', 4)), m('Depth at centre-line', q(Y + v.t, '', 4)), m('S: keyseat floor to opposite side', q(S, '', 4)), m('T: top of key to opposite side', q(Tm, '', 4)), m('Key projection above shaft', q(v.h - v.t - Y, '', 4))],
        'Keyseat measurements for the shaft.', 'Flat-bottomed keyseat.', { checks: [check('Key standard', 'verify', 'Take keyseat depth and tolerances from the key standard.')] });
    },
    "arc-radius-rolls": (v) => {
      const cb = (v.L - v.D) / 2, ce = v.type === 'concave' ? v.Hh - v.D : v.D - v.Hh;
      if (cb <= 0) return invalid('The measurement over rolls must exceed the roll diameter.');
      if (ce <= 0) return invalid(v.type === 'concave' ? 'For a concave arc the height must exceed the roll diameter.' : 'For a convex arc the height must be less than the roll diameter.');
      const ab = (cb * cb + ce * ce) / (2 * ce), R = v.type === 'concave' ? ab + v.D / 2 : ab - v.D / 2;
      return output({ cb, ce, R }, 'Radius (mm)', R, [m('Arc radius', q(R, 'mm', 4)), m('Roll centre distance', q(2 * cb, 'mm', 3)), m('Construction values cb / ce', `${q(cb, '', 3)} / ${q(ce, 'mm', 3)}`)], 'Radius from the roll measurement.', 'Rolls contact the true arc.', { checks: [check('Sensitivity', ce / cb > 0.05 ? 'pass' : 'warn', ce / cb > 0.05 ? 'Reasonable geometry.' : 'Shallow arc: small height errors change the radius strongly.')] });
    },
    "bolt-circle-pins": (v) => {
      const th = rad(360 / v.n);
      if (v.mode === 'alt' && (v.n % 2 || v.n <= 4)) return invalid('Measurement over alternate plugs applies to an even number of holes greater than 4.');
      if (v.m <= v.d) return invalid('The measurement must exceed the plug diameter.');
      const pcd = v.mode === 'alt' ? (v.m - v.d) / Math.sin(th) : (v.m - v.d) / Math.sin(th / 2), even = v.n % 2 === 0, x = even ? pcd + v.d : pcd * Math.cos(th / 4) + v.d;
      return output({ pcd, x }, 'Distance across (mm or in)', x, [m('Bolt circle diameter', q(pcd, '', 4)), m(even ? 'Over opposite plugs' : 'Over most widely spaced plugs', q(x, '', 4))], 'Bolt circle from the plug measurement.', 'Equally spaced holes, close-fitting plugs.', { checks: [check('Plug fit', 'verify', 'Plug clearance in the holes adds directly to the error.')] });
    },
    "taper-discs": (v) => {
      let K, C = v.C, D = v.D;
      if (v.mode === 'angle') K = (v.D - v.d) / (2 * v.C);
      else if (v.mode === 'cTaper') { C = (v.D - v.d) / 2 * Math.sqrt(1 + (v.T / 24) ** 2) / (v.T / 24); K = (v.D - v.d) / (2 * C); }
      else if (v.mode === 'cAngle') { C = (v.D - v.d) / (2 * Math.sin(rad(v.angle / 2))); K = (v.D - v.d) / (2 * C); }
      else if (v.mode === 'cSide') { C = (v.D - v.d) / Math.sqrt(2 - 2 / Math.sqrt(1 + (v.T / 12) ** 2)); K = (v.D - v.d) / (2 * C); }
      else { const s = Math.sin(rad(v.angle / 2)); D = v.d * (1 + s) / (1 - s); K = s; }
      if (!(K > 0 && K < 0.7)) return invalid('The discs and distance do not give a valid taper (the large disc must be larger and the distance long enough).');
      const angleOut = 2 * deg(Math.asin(K)), Tc = 24 * K / Math.sqrt(1 - K * K), Ts = 24 * K * Math.sqrt(1 - K * K) / (1 - 2 * K * K);
      return output({ K, angleOut, Tc, Ts, C, D }, v.mode === 'disk' ? 'Large disc diameter (in)' : v.mode === 'angle' ? 'Included angle (°)' : 'Centre distance (in)', v.mode === 'disk' ? D : v.mode === 'angle' ? angleOut : C,
        [m('Included angle', q(angleOut, '°', 4)), m('Taper per foot (centre-line)', q(Tc, 'in/ft', 4)), m('Taper per foot (from one side)', q(Ts, 'in/ft', 4)), m('Centre distance', q(C, 'in', 4)), m('Large disc diameter', q(D, 'in', 4))],
        'Disc gauge geometry.', 'Handbook disc rules (inch, taper per foot).', { checks: [check('Set-up accuracy', 'verify', 'Set the centre distance with gauge blocks; disc size errors change the angle.')] });
    },
    "drill-size-lookup": (v) => {
      const num = (k) => [0.228, 0.221, 0.213, 0.209, 0.2055, 0.204, 0.201, 0.199, 0.196, 0.1935, 0.191, 0.189, 0.185, 0.182, 0.18, 0.177, 0.173, 0.1695, 0.166, 0.161, 0.159, 0.157, 0.154, 0.152, 0.1495, 0.147, 0.144, 0.1405, 0.136, 0.1285, 0.12, 0.116, 0.113, 0.111, 0.11, 0.1065, 0.104, 0.1015, 0.0995, 0.098, 0.096, 0.0935, 0.089, 0.086, 0.082, 0.081, 0.0785, 0.076, 0.073, 0.07, 0.067, 0.0635, 0.0595, 0.055, 0.052, 0.0465, 0.043, 0.042, 0.041, 0.04, 0.039, 0.038, 0.037, 0.036, 0.035, 0.033, 0.032, 0.031, 0.0292, 0.028, 0.026, 0.025, 0.024, 0.0225, 0.021, 0.02, 0.018, 0.016, 0.0145, 0.0135][k - 1];
      const LETTERS = { A: 0.234, B: 0.238, C: 0.242, D: 0.246, E: 0.25, F: 0.257, G: 0.261, H: 0.266, I: 0.272, J: 0.277, K: 0.281, L: 0.29, M: 0.295, N: 0.302, O: 0.316, P: 0.323, Q: 0.332, R: 0.339, S: 0.348, T: 0.358, U: 0.368, V: 0.377, W: 0.386, X: 0.397, Y: 0.404, Z: 0.413 };
      if (v.mode === 'code') { const inch = v.code[0] === '#' ? num(Number(v.code.slice(1))) : LETTERS[v.code]; return output({ inch, mm: inch * 25.4 }, 'Diameter (in)', inch, [m(`Drill ${v.code}`, `${q(inch, 'in', 4)} (${q(inch * 25.4, 'mm', 3)})`), m('Nearest fraction', `${Math.round(inch * 64)}/64 in`)], 'Decimal size of the drill.', 'Standard drill sizes.', { text: 'FOUND', tone: 'good', checks: [check('Standard size', 'pass', 'ASME B94.11M decimal equivalent.')] }); }
      const inch = v.unit === 'mm' ? v.dia / 25.4 : v.dia, all = [];
      for (let k = 1; k <= 80; k++) all.push(['Number', `No. ${k}`, num(k)]);
      for (const [c, s] of Object.entries(LETTERS)) all.push(['Letter', c, s]);
      const best = (series) => all.filter((r) => r[0] === series).reduce((a, b) => (Math.abs(b[2] - inch) < Math.abs(a[2] - inch) ? b : a));
      const nb = best('Number'), lb = best('Letter'), fr = Math.max(1, Math.round(inch * 64)), mm = Math.max(0.1, Math.round(inch * 25.4 * 10) / 10);
      const g = (a, b) => (b ? g(b, a % b) : a), frs = `${fr / g(fr, 64)}/${64 / g(fr, 64)} in`;
      const rows = [['Number', nb[1], nb[2]], ['Letter', `Letter ${lb[1]}`, lb[2]], ['Fractional', frs, fr / 64], ['Metric', `${q(mm, 'mm', 1)}`, mm / 25.4]].map((r) => [r[0], r[1], q(r[2], 'in', 4), q(r[2] * 25.4, 'mm', 3), q((r[2] - inch) * 25.4, 'mm', 3)]);
      const closest = rows.reduce((a, b) => (Math.abs(Number(b[4].split(' ')[0].replace('−', '-'))) < Math.abs(Number(a[4].split(' ')[0].replace('−', '-'))) ? b : a));
      const summary = rows.map((r) => r[1]).join(', ');
      return output({ inch, summary }, 'Diameter (in)', inch, [m('Required size', `${q(inch, 'in', 4)} (${q(inch * 25.4, 'mm', 3)})`), m('Nearest number / letter', `${nb[1]} / Letter ${lb[1]}`), m('Nearest fractional / metric', `${frs} / ${q(mm, 'mm', 1)}`)], 'Nearest drill in each series.', 'Standard drill sizes.', { table: tbl('Nearest drills', ['Series', 'Drill', 'Inch', 'mm', 'Difference (mm)'], rows), checks: [check('Hole tolerance', 'verify', 'Drills cut oversize; ream or bore for close tolerances.')] });
    },
    "full-power-cutting-speed": (v) => {
      const Pc = v.P * v.eta / 100, Q = Pc * 60000 / v.kc;
      if (v.op === 'turn') { const vc = Pc * 60000 / (v.kc * v.ap * v.f), n = 1000 * vc / (PI * v.D); return output({ vc, n, Q }, 'Maximum cutting speed (m/min)', vc, [m('Maximum cutting speed', q(vc, 'm/min', 0)), m('Spindle speed at that speed', q(n, 'rpm', 0)), m('Removal rate at the limit', q(Q, 'cm³/min', 1))], 'Power-limited turning speed.', 'Tool and machine speed limits checked separately.', { checks: [check('Tool speed limit', 'verify', 'Use the lower of this and the tool supplier’s recommended speed.')] }); }
      const vf = Pc * 6e7 / (v.ae * v.ap * v.kc);
      return output({ vf, Q }, 'Maximum table feed (mm/min)', vf, [m('Maximum table feed', q(vf, 'mm/min', 0)), m('Removal rate at the limit', q(Q, 'cm³/min', 1))], 'Power-limited milling feed.', 'Tool and machine limits checked separately.', { checks: [check('Tool chip load', 'verify', 'Check the feed per tooth this implies against the tool’s limits.')] });
    },
    "belt-length-crossed-three": (v) => {
      if (v.mode === 'crossed') {
        const s = (v.D1 + v.D2) / 2; if (s >= v.C) return invalid('The centre distance is too small for a crossed belt.');
        const L = 2 * Math.sqrt(v.C * v.C - s * s) + s * (PI + 2 * Math.asin(s / v.C)), dd = (v.D1 - v.D2) / 2, Lopen = 2 * Math.sqrt(v.C * v.C - dd * dd) + PI * s + 2 * dd * Math.asin(dd / v.C), wrap = 180 + 2 * deg(Math.asin(s / v.C));
        return output({ L, Lopen, wrap }, 'Belt length (mm)', L, [m('Crossed belt length', q(L, 'mm', 1)), m('Open belt length (comparison)', q(Lopen, 'mm', 1)), m('Wrap on each pulley', q(wrap, '°', 1))], 'Crossed belt geometry.', 'Pitch-line length.', { checks: [check('Belt twist', 'verify', 'Crossed drives suit flat and round belts; check the belt maker allows crossing.')] });
      }
      const P = [[0, 0, v.D1 / 2], [v.x2, v.y2, v.D2 / 2], [v.x3, v.y3, v.D3 / 2]], cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
      const area = (P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]);
      if (Math.abs(area) < 1e-6) return invalid('The three pulleys must not be in a straight line.');
      const idx = [0, 1, 2].sort((a, b) => Math.atan2(P[a][1] - cy, P[a][0] - cx) - Math.atan2(P[b][1] - cy, P[b][0] - cx)), ring = idx.map((i) => P[i]);
      let L = 0; const nu = [];
      for (let i = 0; i < 3; i++) { const a = ring[i], b = ring[(i + 1) % 3], dx = b[0] - a[0], dy = b[1] - a[1], dist = Math.hypot(dx, dy); if (dist <= Math.abs(a[2] - b[2])) return invalid('Two pulleys overlap or one sits inside the other.'); L += Math.sqrt(dist * dist - (a[2] - b[2]) ** 2); nu.push(Math.atan2(dy, dx) - Math.acos((a[2] - b[2]) / dist)); }
      const wraps = []; for (let i = 0; i < 3; i++) { const j = (i + 1) % 3; let w = nu[j] - nu[i]; while (w < 0) w += 2 * PI; while (w >= 2 * PI) w -= 2 * PI; wraps.push([idx[j] + 1, w]); L += ring[j][2] * w; }
      wraps.sort((a, b) => a[0] - b[0]);
      return output({ L }, 'Belt length (mm)', L, [m('Belt length', q(L, 'mm', 1)), ...wraps.map(([k, w]) => m(`Wrap on pulley ${k}`, q(deg(w), '°', 1)))], 'Open belt around three pulleys.', 'Pitch-line length; all pulleys outside the loop.', { checks: [check('Minimum wrap', wraps.every((w) => deg(w[1]) >= 90) ? 'pass' : 'warn', 'Check the driving pulley has enough wrap (about 120° or more).')] });
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
