// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook92). SI units are explicit at each boundary.
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
    "crossed-helical-exact-centre-distance": (v) => {
      const S0 = v.sigma, R = v.Nt / v.n, K = 2 * v.C / (v.n * v.mn), lo = Math.max(0, S0 - 90), hi = Math.min(90, S0);
      if (!(v.alphaA > lo && v.alphaA < hi)) return invalid(`The approximate helix angle must lie between ${q(lo, '°', 4)} and ${q(hi, '°', 4)} for a ${q(S0, '°', 4)} shaft angle.`);
      const g = (a) => R / Math.cos(rad(a)) + 1 / Math.cos(rad(S0 - a));
      let x0 = lo + 1e-9, x1 = hi - 1e-9;
      for (let k = 0; k < 200; k++) { const m1 = x0 + (x1 - x0) / 3, m2 = x1 - (x1 - x0) / 3; if (g(m1) < g(m2)) x1 = m2; else x0 = m1; }
      const am = (x0 + x1) / 2, gm = g(am), Cmin = gm * v.n * v.mn / 2;
      if (!(K >= gm - 1e-12)) return invalid(`No helix angles fit: the centre distance must be at least ${q(Cmin, 'mm', 5)} for these teeth, module and shaft angle.`);
      const root = (a, b) => { let p = a, r = b; const up = g(p) > g(r); for (let k = 0; k < 200; k++) { const mid = (p + r) / 2; if ((g(mid) > K) === up) p = mid; else r = mid; } return (p + r) / 2; };
      const r1 = root(lo + 1e-9, am), r2 = root(am, hi - 1e-9), alpha = Math.abs(r1 - v.alphaA) <= Math.abs(r2 - v.alphaA) ? r1 : r2, beta = S0 - alpha;
      const ca = Math.cos(rad(alpha)), cb = Math.cos(rad(beta)), D = v.Nt * v.mn / ca, d = v.n * v.mn / cb, L = PI * D / Math.tan(rad(alpha)), l = PI * d / Math.tan(rad(beta));
      const caA = Math.cos(rad(v.alphaA)), cbA = Math.cos(rad(S0 - v.alphaA)), nEst = 2 * v.C * caA * cbA / (v.mn * (R * cbA + caA));
      const Q = v.Dc / v.mn, Np = v.Nt / ca ** 3 + Q * Math.tan(rad(alpha)) ** 2, np = v.n / cb ** 3 + Q * Math.tan(rad(beta)) ** 2, Na = v.Nt / ca ** 3, na = v.n / cb ** 3;
      const reg = [[135, '1'], [55, '2'], [35, '3'], [26, '4'], [21, '5'], [17, '6'], [14, '7'], [12, '8']], cut = (x) => (reg.find((r) => Math.round(x) >= r[0]) || [0, 'below range'])[1];
      const Dm = v.Nt * v.mn / Math.cos(rad(am)), dm = v.n * v.mn / Math.cos(rad(S0 - am)), okN = Math.abs(v.n - nEst) <= 1, okC = Math.round(np) >= 12;
      return output({ R, nEst, alpha, beta, D, d, O: D + 2 * v.mn, o: d + 2 * v.mn, Cchk: (D + d) / 2, L, l, Np, np, Na, na, alphaMin: am, Cmin, Dmin: Dm, dmin: dm }, 'Helix angle of gear (°)', alpha,
        [m('Pinion teeth estimated', `${q(nEst, '', 4)} for ${q(v.alphaA, '°', 4)} on the gear (ratio ${q(R, '', 4)})`), m('Exact helix angles: gear / pinion', `${q(alpha, '°', 5)} / ${q(beta, '°', 5)}`), m('Pitch diameters: gear / pinion', `${q(D, 'mm', 5)} / ${q(d, 'mm', 5)}`), m('Outside diameters: gear / pinion', `${q(D + 2 * v.mn, 'mm', 5)} / ${q(d + 2 * v.mn, 'mm', 5)}`), m('Leads: gear / pinion', `${q(L, 'mm', 5)} / ${q(l, 'mm', 5)}`), m('Least centre distance', `${q(Cmin, 'mm', 5)} at ${q(am, '°', 4)} on the gear (D ${q(Dm, 'mm', 4)}, d ${q(dm, 'mm', 4)})`), m('Cutter teeth N′ / n′ (preferred formula)', `${q(Np, '', 4)} / ${q(np, '', 4)}: cutters No. ${cut(Np)} / No. ${cut(np)}`), m('Cutter teeth by N ÷ cos³ (approximate)', `${q(Na, '', 4)} / ${q(na, '', 4)}`)],
        'Crossed helical gears at an exact centre distance.', 'Handbook helical gearing cases 4A, 4B and 6, with the preferred cutter formula.', {
          text: 'HELICAL PAIR FITS THE CENTRE DISTANCE', tone: okN && okC ? 'good' : 'warn',
          checks: [check('Pinion teeth', okN ? 'pass' : 'verify', `${v.n} teeth against ${q(nEst, '', 4)} estimated for the approximate helix angles.`), check('Centre distance', 'pass', `(D + d) ÷ 2 = ${q((D + d) / 2, 'mm', 6)} against ${q(v.C, 'mm', 6)} required.`), check('Cutter range', okC ? 'pass' : 'verify', okC ? 'Both cutter tooth numbers are in the standard cutter series.' : 'A cutter tooth number is below 12, the end of the standard cutter series.'), check('Hand of helix', 'verify', 'Both gears are of the same hand; choose it from the rotation and the direction the thrust must be taken.')],
        });
    },
    "helical-milling-cutter-selection": (v) => {
      const a = rad(v.helix), K = 1 / Math.cos(a) ** 3, Kp = Math.tan(a) ** 2, Q = v.Dc / v.mn, Np = v.Nt * K + Q * Kp, Na = v.Nt * K;
      const reg = [[135, 1], [55, 2], [35, 3], [26, 4], [21, 5], [17, 6], [14, 7], [12, 8]], half = [[135, '—'], [80, '1½'], [55, '—'], [42, '2½'], [35, '—'], [30, '3½'], [26, '—'], [23, '4½'], [21, '—'], [19, '5½'], [17, '—'], [15, '6½'], [14, '—'], [13, '7½'], [12, '—']];
      const NpR = Math.round(Np), NaR = Math.round(Na), cutNo = (reg.find((r) => NpR >= r[0]) || [0, 0])[1], cutA = (reg.find((r) => NaR >= r[0]) || [0, 0])[1], halfNo = (half.find((r) => NpR >= r[0]) || [0, '—'])[1];
      const D = v.Nt * v.mn / Math.cos(a), L = v.helix > 0 ? PI * D / Math.tan(a) : 0, ok = cutNo > 0;
      return output({ K, Kp, Q, Np, Na, NpR, cutNo, cutA, D, L, depth: 2.157 * v.mn, thick: 1.571 * v.mn }, 'Cutter teeth N′', Np,
        [m('Factors K / K′ / Q', `${q(K, '', 4)} / ${q(Kp, '', 4)} / ${q(Q, '', 4)}`), m('Cutter teeth N′: preferred / approximate', `${q(Np, '', 4)} / ${q(Na, '', 4)}`), m('Cutter number: preferred / approximate', `No. ${cutNo || 'below range'} / No. ${cutA || 'below range'}`), m('Half-number cutter for closer accuracy', halfNo === '—' ? 'none between these regular cutters' : `No. ${halfNo}`), m('Pitch diameter / lead', `${q(D, 'mm', 5)} / ${v.helix > 0 ? q(L, 'mm', 5) : 'spur gear (no lead)'}`), m('Whole depth / tooth thickness at the pitch line', `${q(2.157 * v.mn, 'mm', 4)} / ${q(1.571 * v.mn, 'mm', 4)}`)],
        'Helical gear milling cutter selection.', 'Handbook preferred formula for selecting cutters for milling helical gears.', {
          text: ok ? `USE CUTTER No. ${cutNo}` : 'BELOW THE CUTTER SERIES', tone: ok ? 'good' : 'bad',
          checks: [check('Cutter series', ok ? 'pass' : 'fail', ok ? `N′ ≈ ${NpR} lies in the range of cutter No. ${cutNo}.` : `N′ ≈ ${NpR} is below 12, the end of the cutter series.`), check('Approximate formula', cutA === cutNo ? 'pass' : 'verify', cutA === cutNo ? 'The approximate formula picks the same cutter.' : `The approximate formula would pick No. ${cutA || 'below range'}; use No. ${cutNo || 'below range'}.`), check('Cutter diameter', 'verify', 'Use the pitch diameter of the cutter as it is now, after sharpening.')],
        });
    },
    "enlarged-helical-pinion": (v) => {
      const p = rad(v.psi), mt = v.mn / Math.cos(p), d = v.n * mt, ft = Math.atan(Math.tan(rad(20)) / Math.cos(p)), Kh = 2.1 - (v.n / Math.cos(p)) * (Math.sin(ft) - Math.cos(ft) * Math.tan(rad(5))) * Math.sin(ft);
      const enl = Kh > 0, dO = d + (2 + (enl ? Kh : 0)) * v.mn, C = (v.n + v.Nt) * mt / 2, inv = (x) => Math.tan(x) - x, invT = inv(ft), invF = invT + (v.tnP + v.tnG - PI) / (v.n + v.Nt);
      if (!(invF > 0)) return invalid('The tooth thicknesses are too small for the gears to mesh: check tnP and tnG.');
      let lo = 0, hi = PI / 2 - 1e-9; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (inv(mid) < invF) lo = mid; else hi = mid; }
      const phi = (lo + hi) / 2, Cp = C * Math.cos(ft) / Math.cos(phi), IN = 25.4;
      return output({ mt, d, dIn: d / IN, ft: deg(ft), Kh, dO, dOIn: dO / IN, C, CIn: C / IN, invT, invF, phi: deg(phi), Cp, CpIn: Cp / IN, dC: Cp - C }, 'Outside diameter of pinion (mm)', dO,
        [m('Transverse module / pitch diameter', `${q(mt, 'mm', 5)} / ${q(d, 'mm', 5)} (${q(d / IN, 'in', 4)})`), m('Transverse pressure angle φt', q(deg(ft), '°', 5)), m('Enlargement Kh (1 normal diametral pitch)', q(Kh, '', 4)), m('Outside diameter of pinion', `${q(dO, 'mm', 5)} (${q(dO / IN, 'in', 4)})`), m('Standard centre distance', `${q(C, 'mm', 5)} (${q(C / IN, 'in', 4)})`), m('inv φt / inv φ', `${q(invT, '', 5)} / ${q(invF, '', 5)}`), m('Operating pressure angle φ', q(deg(phi), '°', 5)), m('Tight-mesh centre distance', `${q(Cp, 'mm', 5)} (${q(Cp / IN, 'in', 4)}), ${q(Cp - C, 'mm', 4)} more than standard`)],
        'Enlarged helical pinion and tight-mesh centre distance.', 'Handbook formulas for enlarging helical pinions of 20° normal pressure angle.', {
          text: enl ? 'ENLARGE THE PINION' : 'NO ENLARGEMENT NEEDED', tone: 'good',
          checks: [check('Enlargement', enl ? 'verify' : 'pass', enl ? `Kh = ${q(Kh, '', 4)}: cut the pinion to ${q(dO, 'mm', 5)} outside diameter.` : `Kh = ${q(Kh, '', 4)} is not positive: a standard pinion of ${q(dO, 'mm', 5)} outside diameter will do.`), check('Mating gear', 'verify', `Run at ${q(Cp, 'mm', 5)} plus backlash, or reduce the mating gear’s diameter instead.`), check('Tooth thickness', 'verify', 'Take tnP for the enlarged pinion from the handbook’s Table 9c; tnG is 1.5708 for a standard gear.')],
        });
    },
    "helical-hobbing-change-gears": (v) => {
      const minus = (v.hand === 'same') === (v.mode === 'conv'), KT = v.K * v.T, R = v.L / (v.L + (minus ? -v.F : v.F)) * KT / v.Nt, Ri = v.i1 * v.i2 / (v.i3 * v.i4), D = minus ? v.Nt * Ri - KT : KT - v.Nt * Ri;
      if (!(v.F < v.L)) return invalid('The feed per revolution must be smaller than the lead.');
      if (!(D > 0)) return invalid(`The index gears fitted (ratio ${q(Ri, '', 8)}) give no feed in this direction: check the hands and the index gears.`);
      const Fmod = v.L * D / (v.Nt * Ri), rReq = Fmod / v.M, rAct = v.f1 * v.f2 / (v.f3 * v.f4), Fact = rAct * v.M, Lact = Fact * v.Nt * Ri / D, Lun = v.F * v.Nt * Ri / D, err = Lact - v.L, err100 = Math.abs(err) / v.L * 100, errUn = Math.abs(Lun - v.L) / v.L * 100, ok = err100 <= v.errMax + 1e-12;
      return output({ R, Ri, iErr: R - Ri, Fmod, rReq, rAct, Fact, Lact, err, err100, Lun, errUn }, 'Lead error per 100 mm (mm)', err100,
        [m('Index ratio required / fitted', `${q(R, '', 9)} / ${q(Ri, '', 9)} (error ${q(R - Ri, '', 4)})`), m('Feed to compensate / feed gear ratio required', `${q(Fmod, 'mm', 6)} / ${q(rReq, '', 7)}`), m('Feed gear ratio fitted / feed', `${q(rAct, '', 7)} / ${q(Fact, 'mm', 6)}`), m('Lead obtained / required', `${q(Lact, 'mm', 7)} / ${q(v.L, 'mm', 7)} (error ${q(err, 'mm', 4)})`), m('Lead error per 100 mm: corrected / nominal feed', `${q(err100, 'mm', 4)} / ${q(errUn, 'mm', 4)}`)],
        'Helical gear hobbing change gears.', 'Handbook change-gear formulas for hobbing on a machine without a differential.', {
          text: ok ? 'LEAD WITHIN TOLERANCE' : 'LEAD ERROR TOO LARGE', tone: ok ? 'good' : 'bad',
          checks: [check('Lead error', ok ? 'pass' : 'fail', `${q(err100, 'mm', 4)} per 100 mm against ${q(v.errMax, 'mm', 4)} accepted${ok ? '.' : ': choose index or feed gears closer to the ratios required.'}`), check('Feed correction', 'verify', `Without it the nominal feed would give ${q(errUn, 'mm', 4)} per 100 mm.`), check('Machine constants', 'verify', 'Check K, M and the sign rule against the hobbing machine’s manual.')],
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
