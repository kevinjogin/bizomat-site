// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook94). SI units are explicit at each boundary.
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
    "milled-bevel-gear-dimensions": (v) => {
      const s = rad(v.sigma), gP = Math.atan2(Math.sin(s), v.NG / v.NP + Math.cos(s)), gG = s - gP;
      if (!(gP > 0 && gG > 0 && gP < PI / 2 && gG < PI / 2)) return invalid('Both pitch cone angles must lie between 0° and 90°; crown and internal bevel gears are not covered.');
      const DP = v.NP * v.m, DG = v.NG * v.m, C = DP / (2 * Math.sin(gP));
      if (!(v.F < C)) return invalid('The face width must be less than the pitch cone radius.');
      const Sa = v.m, Sd = 1.157 * v.m, W = 2.157 * v.m, Tt = PI / 2 * v.m, Fmax = Math.min(C / 3, 8 * v.m), k = (C - v.F) / C;
      const al = Math.atan(Sa / C), de = Math.atan(Sd / C), uni = v.root === 'uniform';
      const gear = (g, D, z) => { const face = g + al, K = Sa * Math.cos(g), O = D + 2 * K, J = O / 2 / Math.tan(face); return { face: deg(face), rest: 90 - deg(face), cut: deg(g - (uni ? al : de)), K, O, J, j: J * k, Nc: z / Math.cos(g) }; };
      const P = gear(gP, DP, v.NP), G = gear(gG, DG, v.NG), okF = v.F <= Fmax + 1e-9, okN = Math.round(P.Nc) >= 12 && Math.round(G.Nc) >= 12;
      const text = !okN ? 'BELOW THE FORMED CUTTER SERIES' : !okF ? 'FACE WIDTH OVER THE MAXIMUM' : 'MILLED BEVEL GEAR DIMENSIONS';
      const two = (a, b, u, n) => `${q(a, u, n)} / ${q(b, u, n)}`;
      return output({ gP: deg(gP), gG: deg(gG), DP, DG, C, Sa, Sd, W, Tt, Fmax, s: Sa * k, t: Tt * k, al: deg(al), de: deg(de),
        faceP: P.face, faceG: G.face, restP: P.rest, restG: G.rest, cutP: P.cut, cutG: G.cut, KP: P.K, KG: G.K, OP: P.O, OG: G.O, JP: P.J, JG: G.J, jP: P.j, jG: G.j, NcP: P.Nc, NcG: G.Nc }, 'Pitch cone radius C (mm)', C,
        [m('Pitch cone angle: pinion / gear', two(deg(gP), deg(gG), '°', 4)), m('Pitch diameter: pinion / gear', two(DP, DG, 'mm', 4)), m('Addendum / dedendum / whole depth', `${q(Sa, 'mm', 4)} / ${q(Sd, 'mm', 4)} / ${q(W, 'mm', 4)}`), m('Tooth thickness at pitch line: large / small end', two(Tt, Tt * k, 'mm', 4)), m('Addendum at small end', q(Sa * k, 'mm', 4)), m('Pitch cone radius / widest face', `${q(C, 'mm', 4)} / ${q(Fmax, 'mm', 4)}`), m('Addendum angle / dedendum angle', two(deg(al), deg(de), '°', 4)), m('Face angle: pinion / gear', two(P.face, G.face, '°', 4)), m('Compound rest angle: pinion / gear', two(P.rest, G.rest, '°', 4)), m(`Cutting angle (${uni ? 'uniform clearance' : 'handbook table'}): pinion / gear`, two(P.cut, G.cut, '°', 4)), m('Outside diameter: pinion / gear', two(P.O, G.O, 'mm', 4)), m('Vertex distance J: pinion / gear', two(P.J, G.J, 'mm', 4)), m('Vertex distance at small end j: pinion / gear', two(P.j, G.j, 'mm', 4)), m('Teeth for selecting the cutter N′: pinion / gear', `${q(P.Nc, '', 4)} (${Math.round(P.Nc)}) / ${q(G.Nc, '', 4)} (${Math.round(G.Nc)})`)],
        'Milled bevel gear dimensions.', 'Handbook rules and formulas for the dimensions of milled bevel gears.', {
          text, tone: !okN ? 'bad' : okF ? 'good' : 'warn',
          checks: [check('Formed cutter series', okN ? 'pass' : 'fail', okN ? `Cutters are selected for ${Math.round(P.Nc)} and ${Math.round(G.Nc)} teeth, within the series from 12 teeth to a rack.` : 'The 8-cutter series starts at 12 teeth; a pinion this small cannot be milled with the standard series.'), check('Face width', okF ? 'pass' : 'warn', `${q(v.F, 'mm', 4)} against the widest allowed, ${q(Fmax, 'mm', 4)} (C ÷ 3 = ${q(C / 3, 'mm', 4)}, 8 m = ${q(8 * v.m, 'mm', 4)}).`), check('Cutter thickness', 'verify', 'Bevel gear cutters are thinner than spur gear cutters so they pass through the small end of the tooth space.')],
        });
    },
    "bevel-gear-milling-offset": (v) => {
      const g = rad(v.gamma), D = v.Nt * v.m, C = D / (2 * Math.sin(g));
      if (!(v.F < C)) return invalid('The face width must be less than the pitch cone radius.');
      const r = C / v.F, k = (C - v.F) / C, Nc = v.Nt / Math.cos(g), depth = 1.157 * v.m, off = v.Tc / 2 - v.factor * v.m, al = Math.atan(v.m / C), cut = deg(g - al);
      const T1 = PI / 2 * v.m, Tc1 = T1 - T1 ** 3 / (6 * D * D), Sc1 = v.m + T1 * T1 * Math.cos(g) / (4 * D), Ds = D - 2 * v.F * Math.sin(g);
      const t = T1 * k, s = v.m * k, tc = t - t ** 3 / (6 * Ds * Ds), sc = s + t * t * Math.cos(g) / (4 * Ds);
      const okO = off > 0, okR = r >= 3 - 1e-9 && r <= 8 + 1e-9;
      const text = !okO ? 'OFFSET NOT POSITIVE: CHECK THE CUTTER' : !okR ? 'RATIO OUTSIDE THE FACTOR TABLE' : 'OFFSET AND CALIPER SETTINGS';
      return output({ D, C, r, Nc, depth, off, al: deg(al), cut, T1, Tc1, Sc1, t, s, tc, sc, Ds }, 'Offset from centre (mm)', off,
        [m('Pitch diameter / pitch cone radius', `${q(D, 'mm', 4)} / ${q(C, 'mm', 4)}`), m('Ratio C ÷ F (for the factor table)', q(r, '', 3)), m('Teeth for selecting the cutter N′', `${q(Nc, '', 4)} (${Math.round(Nc)})`), m('Measure the cutter at depth', q(depth, 'mm', 4)), m('Offset of the blank, each side of centre', q(off, 'mm', 4)), m('Dividing head cutting angle', `${q(cut, '°', 4)} (addendum angle ${q(deg(al), '°', 4)})`), m('Large end: circular / chordal thickness', `${q(T1, 'mm', 4)} / ${q(Tc1, 'mm', 4)}`), m('Large end: chordal addendum', q(Sc1, 'mm', 4)), m('Small end: circular / chordal thickness', `${q(t, 'mm', 4)} / ${q(tc, 'mm', 4)}`), m('Small end: chordal addendum', q(sc, 'mm', 4))],
        'Bevel gear milling offset and caliper settings.', 'Handbook offset rule and chordal thickness formulas for milled bevel gears.', {
          text, tone: !okO ? 'bad' : okR ? 'good' : 'warn',
          checks: [check('Offset', okO ? 'pass' : 'fail', okO ? `T ÷ 2 = ${q(v.Tc / 2, 'mm', 4)} less factor × m = ${q(v.factor * v.m, 'mm', 4)}.` : 'The cutter is too thin for the factor entered: re-measure the cutter and check the factor.'), check('Factor table range', okR ? 'pass' : 'warn', okR ? `C ÷ F = ${q(r, '', 3)}, within the table (3 to 8).` : `C ÷ F = ${q(r, '', 3)} is outside the table (3 to 8); a ratio below 3 also means the face is wider than one third of the cone radius.`), check('Trial cut', 'verify', 'Measure the tooth at both ends after the trial cut and correct the offset or rotation as the handbook describes.')],
        });
    },
    "sae-straight-sided-spline": (v) => {
      const z = Number(v.n), Wf = { 4: 0.241, 6: 0.25, 10: 0.156, 16: 0.098 }[z], ten = { A: [0.045, 0.91], B: [0.07, 0.86], C: [0.095, 0.81] };
      const hd = { 4: { A: [0.075, 0.85], B: [0.125, 0.75] }, 6: { A: [0.05, 0.9], B: [0.075, 0.85], C: [0.1, 0.8] }, 10: ten, 16: ten }[z][v.fit];
      if (!hd) return invalid('The S.A.E. standard has no 4-spline fitting to slide under load; choose 6, 10 or 16 splines.');
      const W = Wf * v.D, h = hd[0] * v.D, d = hd[1] * v.D, R = (v.D + d) / 4, Tl = v.p * z * R * h / 1000, Tcap = Tl * v.L, preq = v.Treq * 1000 / (z * R * h * v.L);
      const range = z === 16 ? [50.8, 152.4] : z === 10 ? [19.05, 152.4] : [19.05, 76.2], inR = v.D >= range[0] - 1e-9 && v.D <= range[1] + 1e-9, ok = Tcap >= v.Treq;
      const text = !ok ? 'TORQUE ABOVE THE SPLINE CAPACITY' : !inR ? 'OUTSIDE THE S.A.E. TABLE SIZES' : 'SPLINE CARRIES THE TORQUE';
      return output({ W, h, d, R, Tl, T: Tcap, preq }, 'Torque capacity (N·m)', Tcap,
        [m('Spline width W', q(W, 'mm', 4)), m('Depth h / minor diameter d', `${q(h, 'mm', 4)} / ${q(d, 'mm', 4)}`), m('Mean radius R', q(R, 'mm', 4)), m('Torque capacity per mm of length', q(Tl, 'N·m', 4)), m('Torque capacity for the length', q(Tcap, 'N·m', 4)), m('Side pressure at your torque', q(preq, 'MPa', 4))],
        'S.A.E. straight-sided spline fitting.', 'Handbook formulas for S.A.E. standard spline dimensions and torque capacity.', {
          text, tone: !ok ? 'bad' : inR ? 'good' : 'warn',
          checks: [check('Torque capacity', ok ? 'pass' : 'fail', `${q(Tcap, 'N·m', 4)} against ${q(v.Treq, 'N·m', 4)} to carry; the side pressure would be ${q(preq, 'MPa', 4)} against ${q(v.p, 'MPa', 4)} allowed.`), check('Table sizes', inR ? 'pass' : 'warn', `The S.A.E. tables for ${z} splines cover ${q(range[0], 'mm', 4)} to ${q(range[1], 'mm', 4)} nominal diameter.`), check('Corners and parallelism', 'verify', 'Corner radii at most 0.38 mm; splines parallel to the axis within 0.5 mm per metre.')],
        });
    },
    "roller-chain-sprocket-tooth-form": (v) => {
      if (!(v.Dr < v.P)) return invalid('The roller diameter must be smaller than the chain pitch.');
      const z = v.Nt, a = (x) => rad(x), Ds = 1.005 * v.Dr + 0.0762, A = 35 + 60 / z, B = 18 - 56 / z, ac = 0.8 * v.Dr, M = ac * Math.cos(a(A)), Tv = ac * Math.sin(a(A)), E = 1.3025 * v.Dr + 0.0381;
      const xy = (2.605 * v.Dr + 0.0762) * Math.sin(a(9 - 28 / z)), yz = v.Dr * (1.4 * Math.sin(a(17 - 64 / z)) - 0.8 * Math.sin(a(B))), ab = 1.4 * v.Dr, th = PI / z, Wv = ab * Math.cos(th), V = ab * Math.sin(th);
      const F = v.Dr * (0.8 * Math.cos(a(B)) + 1.4 * Math.cos(a(17 - 64 / z)) - 1.3025) - 0.0381, H2 = F * F - (1.4 * v.Dr - 0.5 * v.P) ** 2;
      if (!(H2 > 0)) return invalid('For this pitch and roller diameter the topping curve has no solution (F² < (1.4 Dr − 0.5 P)²); check the chain dimensions.');
      const Hv = Math.sqrt(H2), Sv = 0.5 * v.P * Math.cos(th) + Hv * Math.sin(th), cot = 1 / Math.tan(th), ODa = v.P * (0.6 + cot), ODp = v.P * cot + Math.cos(th) * (Ds - v.Dr) + 2 * Hv;
      const paNew = 35 - 120 / z, paMin = 17 - 64 / z, paAvg = 26 - 92 / z;
      const Pn = 1.011 * v.P, hH = 0.27 * v.P, hE = 0.03 * v.P, hOD = 1.7 * (v.bore + v.Dr + 0.7 * v.P), Dh = hOD - Ds, sM = Pn / (PI * Dh);
      if (!(sM > 0 && sM < 1)) return invalid('The hob pitch diameter is too small for the normal pitch; check the hob bore.');
      const hM = Math.asin(sM), lead = Pn / Math.cos(hM), hW = Math.max(2 * v.bore, 6 * v.Dr, 3.2 * v.P), ok = ODa < ODp;
      return output({ Ds, R: Ds / 2, A, B, ac, M, T: Tv, E, xy, yz, ab, W: Wv, V, F, H: Hv, S: Sv, ODa, ODp, paNew, paMin, paAvg, Pn, hH, hE, hOD, Dh, hM: deg(hM), lead, hW }, 'Seating curve diameter Ds (mm)', Ds,
        [m('Seating curve diameter Ds / radius R', `${q(Ds, 'mm', 4)} / ${q(Ds / 2, 'mm', 4)}`), m('Angles A / B', `${q(A, '°', 4)} / ${q(B, '°', 4)}`), m('ac / M / T', `${q(ac, 'mm', 4)} / ${q(M, 'mm', 4)} / ${q(Tv, 'mm', 4)}`), m('E', q(E, 'mm', 4)), m('Chord xy / yz', `${q(xy, 'mm', 4)} / ${q(yz, 'mm', 4)}`), m('ab / W / V', `${q(ab, 'mm', 4)} / ${q(Wv, 'mm', 4)} / ${q(V, 'mm', 4)}`), m('F / H / S', `${q(F, 'mm', 4)} / ${q(Hv, 'mm', 4)} / ${q(Sv, 'mm', 4)}`), m('Outside diameter: approximate / pointed tooth', `${q(ODa, 'mm', 4)} / ${q(ODp, 'mm', 4)}`), m('Pressure angle: new chain / minimum / average', `${q(paNew, '°', 4)} / ${q(paMin, '°', 4)} / ${q(paAvg, '°', 4)}`), m('Hob normal pitch / H / fillet radius E', `${q(Pn, 'mm', 4)} / ${q(hH, 'mm', 4)} / ${q(hE, 'mm', 4)}`), m('Hob outside / pitch diameter', `${q(hOD, 'mm', 4)} / ${q(Dh, 'mm', 4)}`), m('Hob helix angle / lead', `${q(deg(hM), '°', 4)} / ${q(lead, 'mm', 4)}`), m('Least hob width', q(hW, 'mm', 4))],
        'Roller chain sprocket tooth form and hob.', 'ANSI B29.1M sprocket tooth form and standard hob design formulas.', {
          text: ok ? 'SPROCKET TOOTH FORM' : 'TEETH POINTED BELOW THE OUTSIDE DIAMETER', tone: ok ? 'good' : 'bad',
          checks: [check('Tooth tip', ok ? 'pass' : 'fail', `Approximate outside diameter ${q(ODa, 'mm', 4)} against the pointed-tooth diameter ${q(ODp, 'mm', 4)}.`), check('Seating curve tolerance', 'verify', 'The seating curve diameter has a plus tolerance only; take it from the handbook table for the pitch.'), check('Hob', 'verify', 'The hob outside diameter is approximate; confirm the bore and keyway with the hob maker.')],
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
