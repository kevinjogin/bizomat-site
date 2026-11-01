// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook84). SI units are explicit at each boundary.
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
    "compound-indexing": (v) => {
      const gcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) { const t = x % y; x = y; y = t; } return x; };
      const plates = v.plates === 'bs' ? [[15, 16, 17, 18, 19, 20], [21, 23, 27, 29, 31, 33], [37, 39, 41, 43, 47, 49]] : [[24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43], [46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66]];
      const pname = (i) => (v.plates === 'bs' ? 'Plate ' : 'Side ') + (i + 1);
      const Nn = v.N, k = v.ratio;
      const measureOf = (Np) => (Np === Nn ? 0 : 0.001 * Nn / (PI * Math.abs(Nn - Np)));
      const errAt = (Np) => PI * v.dia * Math.abs(Nn - Np) / Nn;
      const turns = (w) => (w === 1 ? '1 turn' : w + ' turns');
      const mv = (o) => { const parts = []; if (o.w) parts.push(turns(o.w)); if (o.a) parts.push(o.a + '/' + o.A); let s = parts.join(' + '); if (o.b) s += (s ? (o.s > 0 ? ' + ' : ' − ') : (o.s > 0 ? '' : '− ')) + o.b + '/' + o.B; return s || '0'; };
      const row = (kind, o) => [kind, mv(o), o.pi >= 0 ? pname(o.pi) : '—', String(o.R), q(o.Np, '', 5), o.exact ? 'Exact' : q(measureOf(o.Np), '', 2), q(errAt(o.Np), 'mm', 3)];
      const head = ['Kind', 'Movement per division', 'Plate', 'Work revolutions', 'Precise divisions', 'Diameter at which error = 0.001', 'Error at your diameter'];
      if (v.mode === 'check') {
        if (v.a >= v.A || v.b >= v.B) return invalid('Holes moved must be fewer than the holes in their circle; count whole turns separately.');
        const s = v.sign === 'plus' ? 1 : -1, M = v.w + v.a / v.A + s * v.b / v.B;
        if (!(M > 0)) return invalid('The movement must turn the crank forward: the subtracted part is larger than the rest.');
        const exact = k * v.R * v.A * v.B === Nn * (v.w * v.A * v.B + v.a * v.B + s * v.b * v.A);
        const Np = exact ? Nn : k * v.R / M, err = errAt(Np), meas = measureOf(Np), co = gcd(v.R, Nn) === 1;
        const onPlate = plates.findIndex((pl) => pl.includes(v.A) && (v.b === 0 || pl.includes(v.B)));
        const ok = co && err <= v.tol + 1e-12;
        return output({ Np, measure: meas, err, exact: exact ? 1 : 0, M, R: v.R }, 'Position error at the workpiece diameter (mm)', err,
          [m('Movement per division', `${mv({ w: v.w, a: v.a, A: v.A, b: v.b, B: v.B, s })} (${q(M, 'crank turns', 6)})`), m('Precise number of divisions', q(Np, '', 5)), m('Diameter at which the error = 0.001', exact ? 'Exact' : q(meas, '', 2)), m('Error at your diameter', q(err, 'mm', 4)), m('Workpiece revolutions', String(v.R))],
          'Check of an indexing movement.', 'Handbook method for simple and compound indexing with standard plates.', {
            text: !co ? 'MOVEMENT REPEATS DIVISIONS' : exact ? 'MOVEMENT IS EXACT' : ok ? 'MOVEMENT WITHIN TOLERANCE' : 'MOVEMENT TOO COARSE', tone: !co ? 'bad' : ok ? 'good' : 'bad',
            table: tbl('Movement checked', head, [row(exact ? 'Exact' : 'Approximate', { w: v.w, a: v.a, A: v.A, b: v.b, B: v.B, s, R: v.R, pi: onPlate, Np, exact })]),
            checks: [check('Revolutions', co ? 'pass' : 'fail', co ? `${v.R} revolution(s) share no factor with ${Nn}, so later revolutions fill the spaces left by earlier ones.` : `${v.R} revolutions share a factor with ${Nn}: the movement would return to divisions already cut.`), check('Accuracy', exact ? 'pass' : err <= v.tol + 1e-12 ? 'pass' : 'fail', exact ? 'The movement gives the number of divisions exactly.' : `The error at ${q(v.dia, 'mm', 4)} is ${q(err, 'mm', 4)} against ${q(v.tol, 'mm', 4)} accepted.`), check('Plate', onPlate >= 0 ? 'pass' : 'verify', onPlate >= 0 ? `Both circles are on ${pname(onPlate)} of the selected plates.` : 'The circles are not both on one of the selected standard plates; check that your plate has them.')],
          });
      }
      const simple = [];
      plates.forEach((pl, pi) => pl.forEach((A) => { if ((k * A) % Nn === 0) { const tot = k * A / Nn; simple.push({ w: Math.floor(tot / A), a: tot % A, A, b: 0, B: 0, s: 1, R: 1, pi, Np: Nn, exact: true }); } }));
      simple.sort((x, y) => x.a - y.a || x.A - y.A);
      const exactC = [], bestR = [];
      for (let R = 1; R <= v.Rmax; R++) {
        if (gcd(R, Nn) !== 1) continue;
        const Tm = k * R / Nn;
        let best = null;
        plates.forEach((pl, pi) => {
          for (const A of pl) for (const B of pl) {
            if (A === B) continue;
            for (let a = 1; a < A; a++) {
              const fa = a / A;
              for (const s of [1, -1]) {
                if (s > 0 && B < A) continue;
                const w = s > 0 ? Math.floor(Tm - fa) : Math.ceil(Tm - fa);
                const b = Math.round(s * (Tm - w - fa) * B);
                if (w < 0 || b < 1 || b >= B) continue;
                const M = w + fa + s * b / B;
                if (!(M > 0)) continue;
                const exact = k * R * A * B === Nn * (w * A * B + a * B + s * b * A);
                const o = { w, a, A, b, B, s, R, pi, Np: exact ? Nn : k * R / M, exact };
                if (exact && R === 1) exactC.push(o);
                const e = Math.abs(o.Np - Nn), cost = a + b + w;
                if (!best || e < best.e - 1e-12 || (Math.abs(e - best.e) <= 1e-12 && cost < best.cost)) best = { ...o, e, cost };
              }
            }
          }
        });
        if (best) bestR.push(best);
      }
      exactC.sort((x, y) => (x.a + x.b) - (y.a + y.b) || y.s - x.s || x.A - y.A);
      const approx = bestR;
      let rec, kind, text, tone;
      if (simple.length) { rec = simple[0]; kind = 0; text = 'SIMPLE INDEXING IS EXACT'; tone = 'good'; }
      else if (exactC.length) { rec = exactC[0]; kind = 1; text = 'COMPOUND INDEXING IS EXACT'; tone = 'good'; }
      else {
        if (!approx.length) return invalid('No compound movement was found on the selected plates; allow more workpiece revolutions or use differential indexing.');
        const within = approx.filter((o) => errAt(o.Np) <= v.tol + 1e-12);
        const mostAcc = approx.slice().sort((x, y) => x.e - y.e)[0];
        rec = within.length ? within[0] : mostAcc; kind = 2;
        text = within.length ? 'APPROXIMATE INDEXING WITHIN TOLERANCE' : 'NO MOVEMENT WITHIN TOLERANCE'; tone = within.length ? 'good' : 'bad';
      }
      const err = errAt(rec.Np), meas = measureOf(rec.Np);
      const rows = [...simple.slice(0, 3).map((o) => row('Simple, exact', o)), ...exactC.slice(0, 3).map((o) => row('Compound, exact', o)), ...(kind === 2 ? approx.map((o) => row(o.exact ? 'Compound, exact' : 'Approximate', o)) : [])];
      return output({ Np: rec.Np, measure: meas, err, exact: kind < 2 ? 1 : 0, kind, R: rec.R, simpleCount: simple.length, exactCount: exactC.length, approxCount: approx.length, w: rec.w, a: rec.a, A: rec.A, b: rec.b, B: rec.B, sign: rec.s }, 'Position error at the workpiece diameter (mm)', err,
        [m('Recommended movement per division', `${mv(rec)} on ${pname(rec.pi)}`), m('Kind', ['Simple indexing, exact', 'Compound indexing, exact', 'Approximate compound indexing'][kind]), m('Workpiece revolutions', String(rec.R)), m('Precise number of divisions', q(rec.Np, '', 5)), m('Diameter at which the error = 0.001', kind < 2 ? 'Exact' : q(meas, '', 2)), m('Error at your diameter', q(err, 'mm', 4))],
        'Simple and compound indexing with standard plates.', 'Handbook method for simple and compound indexing with standard plates.', {
          text, tone,
          table: tbl('Indexing movements found', head, rows),
          checks: [check('Simple indexing', simple.length ? 'pass' : 'verify', simple.length ? `${simple.length} circle(s) divide the crank turns exactly; the one with the fewest holes to count is shown first.` : `No circle on the selected plates divides ${k} × circle ÷ ${Nn} exactly.`),
            check('Exact compound indexing', simple.length || exactC.length ? 'pass' : 'verify', simple.length ? 'Not needed: simple indexing is exact.' : exactC.length ? `${exactC.length} exact two-circle movement(s) found; the one with the fewest holes is shown first.` : 'No exact two-circle movement exists on the selected plates.'),
            check('Accuracy', kind < 2 || err <= v.tol + 1e-12 ? 'pass' : 'fail', kind < 2 ? 'The movement is exact.' : `The best movement within ${v.Rmax} revolutions leaves ${q(err, 'mm', 4)} at ${q(v.dia, 'mm', 4)} against ${q(v.tol, 'mm', 4)} accepted.`),
            check('Set-up', kind === 0 ? 'pass' : 'verify', kind === 0 ? 'Plain indexing with the plate bolted to the head.' : 'Release the index plate on the worm shaft and fit a stationary pin for the second movement; set sector arms for both circles.')],
        });
    },
    "unified-thread-gauge-limits": (v) => {
      const p = 1 / v.n, Hs = 0.866025 * p, trunc = 0.060 * Math.cbrt(p * p) + 0.017 * p;
      if (!(v.eMaj >= v.eMajMin && v.ePDmax > v.ePDmin && v.eMaj > v.ePDmax)) return invalid('External thread: the maximum major diameter must exceed the maximum pitch diameter, and each maximum must exceed its minimum.');
      if (!(v.iPDmax > v.iPDmin && v.iMinMax > v.iMinMin && v.iMaj > v.iPDmax && v.iPDmin > v.iMinMax)) return invalid('Internal thread: the limits must run minor < pitch < major, with each maximum above its minimum.');
      const td2 = v.ePDmax - v.ePDmin, td2i = v.iPDmax - v.iPDmin;
      const dc = v.eMaj + 0.216506 * p - (td2 + 0.0017), crest = dc < v.eMaj;
      const G = [
        ['1', 'GO thread ring, pitch diameter', v.ePDmax, -1, v.xPD], ['2', 'GO thread ring, minor diameter', v.ePDmax - Hs / 2, -1, v.xMaj], ['3', 'NOT GO (LO) thread ring, pitch diameter', v.ePDmin, 1, v.xPD], ['4', 'NOT GO (LO) thread ring, minor diameter', v.ePDmin - Hs / 4, 1, v.xMaj],
        ['5', 'Plain GO gauge, external major diameter', v.eMaj, -1, v.plain], ['6', 'Plain NOT GO gauge, external major diameter', v.eMajMin, 1, v.plain],
        ['7', 'GO thread plug, major diameter', v.iMaj, 1, v.xMaj], ['8', 'GO thread plug, pitch diameter', v.iPDmin, 1, v.xPD], ['9', 'NOT GO (HI) thread plug, major diameter', v.iPDmax + Hs / 2, -1, v.xMaj], ['10', 'NOT GO (HI) thread plug, pitch diameter', v.iPDmax, -1, v.xPD],
        ['11', 'Plain GO plug, internal minor diameter', v.iMinMin, 1, v.plain], ['12', 'Plain NOT GO plug, internal minor diameter', v.iMinMax, -1, v.plain],
        ['13', 'GO setting plug, major diameter (truncated portion)', v.eMaj - trunc, -1, v.wMaj], ['14', 'GO setting plug, major diameter (full portion)', v.eMaj, 1, v.wMaj], ['15', 'GO setting plug, pitch diameter', v.ePDmax, -1, v.wPD],
        ['16', 'NOT GO (LO) setting plug, major diameter (truncated portion)', v.ePDmin + Hs / 2, -1, v.wMaj], ['17', 'NOT GO (LO) setting plug, major diameter (full portion)', crest ? dc : v.eMaj, crest ? -1 : 1, v.wMaj], ['18', 'NOT GO (LO) setting plug, pitch diameter', v.ePDmin, 1, v.wPD],
        ['19', 'GO setting ring, pitch diameter', v.iPDmin, 1, v.wPD], ['20', 'GO setting ring, minor diameter', v.iMinMin, -1, v.wMaj], ['21', 'NOT GO (HI) setting ring, pitch diameter', v.iPDmax, -1, v.wPD], ['22', 'NOT GO (HI) setting ring, minor diameter', v.iMinMax, -1, v.wMaj],
      ];
      const lim = (g) => (g[3] < 0 ? [g[2] - g[4], g[2]] : [g[2], g[2] + g[4]]);
      const rows = G.map((g) => { const [lo, hi] = lim(g); return [g[0], g[1], q(g[2], 'in', 5), g[3] < 0 ? 'minus ' + q(g[4], 'in', 5) : 'plus ' + q(g[4], 'in', 5), `${q(lo, '', 5)} – ${q(hi, '', 5)} in`, `${q(lo * 25.4, '', 4)} – ${q(hi * 25.4, '', 4)} mm`]; });
      const okE = td2 > 2 * v.xPD + 1e-12, okI = td2i > 2 * v.xPD + 1e-12, okMaj = v.eMaj - v.eMajMin > 2 * v.plain + 1e-12, okMin = v.iMinMax - v.iMinMin > 2 * v.plain + 1e-12;
      const ok = okE && okI && okMaj && okMin;
      const val = (i) => G[i][2];
      return output({ p, H: Hs, trunc, dc, crest: crest ? 1 : 0, td2, td2i, goRingPD: val(0), goRingMinor: val(1), ngRingPD: val(2), ngRingMinor: val(3), goSnapMaj: val(4), ngSnapMaj: val(5), goPlugMaj: val(6), goPlugPD: val(7), ngPlugMaj: val(8), ngPlugPD: val(9), goPlainMinor: val(10), ngPlainMinor: val(11), setGoTrunc: val(12), setGoFull: val(13), setGoPD: val(14), setNgTrunc: val(15), setNgFull: val(16), setNgPD: val(17), ringGoPD: val(18), ringGoMinor: val(19), ringNgPD: val(20), ringNgMinor: val(21), sharePD: 2 * v.xPD / td2 * 100 }, 'GO thread plug pitch diameter (in)', val(7),
        [m('Pitch p / sharp-V height H', `${q(p, 'in', 5)} / ${q(Hs, 'in', 5)}`), m('GO / NOT GO thread ring PD', `${q(val(0), 'in', 5)} / ${q(val(2), 'in', 5)}`), m('GO / NOT GO thread ring minor', `${q(val(1), 'in', 5)} / ${q(val(3), 'in', 5)}`), m('GO / NOT GO thread plug PD', `${q(val(7), 'in', 5)} / ${q(val(9), 'in', 5)}`), m('GO / NOT GO thread plug major', `${q(val(6), 'in', 5)} / ${q(val(8), 'in', 5)}`), m('Setting plug truncation 0.060 ∛p² + 0.017 p', q(trunc, 'in', 5)), m('NOT GO setting plug, full portion', `${q(val(16), 'in', 5)} (${crest ? '0.001 in crest rule' : 'maximum major diameter'})`)],
        'Unified inch screw thread gauge sizes.', 'ANSI/ASME B1.2 Table 5 formulas as given in the handbook.', {
          text: ok ? 'GAUGE SIZES SET' : 'GAUGE TOLERANCES OVERLAP', tone: ok ? 'good' : 'bad',
          table: tbl('Gauge sizes (ANSI/ASME B1.2 Table 5)', ['No.', 'Gauge', 'Nominal', 'Gauge tolerance', 'Limits (in)', 'Limits (mm)'], rows),
          checks: [check('External PD tolerance', okE ? 'pass' : 'fail', `The GO and NOT GO ring tolerances use ${q(2 * v.xPD / td2 * 100, '%', 3)} of the ${q(td2, 'in', 5)} pitch diameter tolerance${okE ? '.' : ': the gauge zones meet or cross.'}`), check('Internal PD tolerance', okI ? 'pass' : 'fail', `The GO and NOT GO plug tolerances use ${q(2 * v.xPD / td2i * 100, '%', 3)} of the ${q(td2i, 'in', 5)} pitch diameter tolerance${okI ? '.' : ': the gauge zones meet or cross.'}`), check('Plain gauges', okMaj && okMin ? 'pass' : 'fail', okMaj && okMin ? 'The plain gauge tolerances fit inside the major and minor diameter tolerances.' : 'The plain gauge tolerances fill the major or minor diameter tolerance.'), check('Full-form NOT GO setting plug', 'pass', crest ? `The crest at the maximum major diameter would be narrower than 0.001 in, so the full portion is ${q(dc, 'in', 5)} with the W tolerance minus.` : `The crest at the maximum major diameter is at least 0.001 in wide, so the full portion is the maximum major diameter with the W tolerance plus.`), check('Lead and half-angle', 'verify', 'Order the gauges with the Table 4 lead and half-angle tolerances for the class as well.')],
        });
    },
    "forging-hammer-efficiency": (v) => {
      if (!(v.H1 < v.H0)) return invalid('The height after the blow must be less than the original height.');
      const A = (v.H0 - v.H1) / v.H0, B = 8.85 * A + 13.12 * (A * A + A ** 4), Din = v.D / 25.4;
      const Wft = 36.75 * Din ** 3 * B, WJ = Wft * 1.3558179483, Pu = WJ * v.bpm / 60 / 1000, eff = Pu / v.Pin * 100, ratio = v.H0 / v.D;
      const okR = Math.abs(ratio - 1.5) <= 0.015, okA = A >= 0.1 - 1e-9 && A <= 0.6 + 1e-9, okE = eff <= 100;
      return output({ A, B, Wft, WJ, Pu, PuFt: Wft * v.bpm / 60, eff, ratio }, 'Work per blow (J)', WJ,
        [m('Reduction in height A', q(A, '', 4)), m('Factor B', q(B, '', 4)), m('Work per blow', `${q(WJ, 'J', 4)} (${q(Wft, 'ft·lb', 4)})`), m('Useful power', `${q(Pu, 'kW', 4)} (${q(Wft * v.bpm / 60, 'ft·lb/s', 4)})`), m('Efficiency', q(eff, '%', 3)), m('Cylinder height ÷ diameter', q(ratio, '', 3))],
        'Forging hammer efficiency by the Heim lead cylinder test.', 'Heim empirical formula as given in the handbook.', {
          text: !okE ? 'CHECK THE POWER MEASUREMENT' : 'HAMMER TESTED', tone: !okE ? 'bad' : okR && okA ? 'good' : 'warn',
          checks: [check('Cylinder proportions', okR ? 'pass' : 'warn', `Height ÷ diameter is ${q(ratio, '', 3)}; the Heim constants were found with cylinders 1.5 times as high as their diameter.`), check('Reduction in range', okA ? 'pass' : 'warn', `A = ${q(A, '', 3)}${okA ? ' is inside the 0.10 to 0.60 range of the handbook table.' : ' is outside the 0.10 to 0.60 range of the handbook table; choose a cylinder size that gives a reduction in that range.'}`), check('Efficiency', okE ? 'pass' : 'fail', okE ? `The hammer turns ${q(eff, '%', 3)} of the power supplied into work on the lead.` : 'The useful power exceeds the power supplied; check the power measurement and the blow rate.'), check('Lead', 'verify', 'Use pure lead and measure the height on the axis after the blow.')],
        });
    },
    "press-gauge-pressure-for-work": (v) => {
      const Ar = 0.7854 * v.D * v.D, Ar2 = PI * v.D * v.D / 4, F = v.P * 0.1 * Ar2, Fmax = v.Pmax * 0.1 * Ar2;
      const PaAt = F / v.A, PneedMPa = v.A * v.Pa / Ar2, Pneed = PneedMPa * 10, Fneed = v.Pa * v.A;
      const ok = Pneed <= v.Pmax + 1e-9, okSet = v.P <= v.Pmax + 1e-9;
      return output({ Ar: Ar2, Ar4: Ar, FkN: F / 1000, Ftf: F / 9806.65, Fst: F / 8896.443, FmaxkN: Fmax / 1000, PaAt, Pneed, FneedkN: Fneed / 1000 }, 'Gauge pressure needed (bar)', Pneed,
        [m('Ram area', q(Ar2, 'mm²', 5)), m('Press force at the gauge pressure set', `${q(F / 1000, 'kN', 4)} (${q(F / 9806.65, 'tf', 4)}; ${q(F / 8896.443, 'short tons', 4)})`), m('Capacity at the most pressure allowed', `${q(Fmax / 1000, 'kN', 4)} (${q(Fmax / 9806.65, 'tf', 4)})`), m('Pressure on the work at the gauge pressure set', q(PaAt, 'MPa', 4)), m('Force for the pressure wanted', q(Fneed / 1000, 'kN', 4)), m('Gauge pressure needed', q(Pneed, 'bar', 4))],
        'Hydraulic press gauge pressure for a pressure on the work.', 'Handbook hydraulic press capacity rules in SI units.', {
          text: ok ? 'PRESS REACHES THE PRESSURE ON THE WORK' : 'PRESS CANNOT REACH THE PRESSURE', tone: ok && okSet ? 'good' : 'bad',
          checks: [check('Gauge pressure needed', ok ? 'pass' : 'fail', `${q(v.Pa, 'MPa', 4)} on ${q(v.A, 'mm²', 5)} needs ${q(Pneed, 'bar', 4)} against ${q(v.Pmax, 'bar', 4)} allowed${ok ? '.' : ': use a larger ram, a smaller area of work or a lower process pressure.'}`), check('Gauge pressure set', okSet ? 'pass' : 'fail', okSet ? `The set pressure of ${q(v.P, 'bar', 4)} is within the press limit.` : `The set pressure of ${q(v.P, 'bar', 4)} is above the ${q(v.Pmax, 'bar', 4)} the press may run at.`), check('Pressure at the setting', PaAt >= v.Pa - 1e-9 ? 'pass' : 'warn', `At ${q(v.P, 'bar', 4)} the work sees ${q(PaAt, 'MPa', 4)} against the ${q(v.Pa, 'MPa', 4)} wanted.`), check('Tooling', 'verify', 'Check that the dies and the press frame are rated for the force at the gauge pressure you set.')],
        });
    },
    "pm-dc-motor-constants": (v) => {
      const wNL = v.NL * 2 * PI / 60, Ist = v.V / v.R, KT = v.Tst / Ist, KE = v.V / wNL, KM = KT / Math.sqrt(v.R), DM = v.Tst / wNL, TM = v.JM / DM;
      const TL = Math.min(KT * v.IL, v.Tst), TR = KT * v.IR, spd = (T) => v.NL * (1 - T / v.Tst);
      const TML = (v.JM + v.JL) / DM, fn = Math.sqrt(v.K / v.JL) / (2 * PI), acc = TL / (v.JM + v.JL);
      const okR = fn > v.bw, okI = v.IL <= Ist, okRated = TR < v.Tst;
      return output({ wNL, Ist, KT, KE, KM, DM, TM, TL, TR, nL: spd(TL), nR: spd(TR), TML, fn, acc }, 'Torque constant K_T (N·m/A)', KT,
        [m('Stall current I_STo', q(Ist, 'A', 4)), m('Torque constant K_T / voltage constant K_E', `${q(KT, 'N·m/A', 4)} / ${q(KE, 'V·s/rad', 4)}`), m('Motor constant K_M', q(KM, 'N·m/(A·√Ω)', 4)), m('Damping D_M', q(DM, 'N·m·s/rad', 4)), m('Mechanical time constant: motor / with load', `${q(TM * 1000, 'ms', 4)} / ${q(TML * 1000, 'ms', 4)}`), m('Torque limit T_L and speed there', `${q(TL, 'N·m', 4)} at ${q(spd(TL), 'rpm', 4)}`), m('Rated torque T_R and speed there', `${q(TR, 'N·m', 4)} at ${q(spd(TR), 'rpm', 4)}`), m('Peak acceleration at T_L', q(acc, 'rad/s²', 4)), m('Torsional resonance f_n', q(fn, 'Hz', 4))],
        'Permanent-magnet control motor constants.', 'Handbook definitions for the idealised permanent-magnet motor characteristic.', {
          text: okR ? 'RESONANCE ABOVE THE CONTROL BANDWIDTH' : 'RESONANCE INSIDE THE CONTROL BANDWIDTH', tone: okR ? 'good' : 'bad',
          checks: [check('Torsional resonance', okR ? 'pass' : 'fail', `The resonance of ${q(fn, 'Hz', 4)} is ${okR ? 'above' : 'inside'} the ${q(v.bw, 'Hz', 4)} control bandwidth${okR ? '.' : ': stiffen the drive or add a notch filter at the resonance.'}`), check('Current limit', okI ? 'pass' : 'warn', okI ? `The ${q(v.IL, 'A', 4)} limit caps the torque at ${q(TL, 'N·m', 4)}, below the stall torque.` : `The ${q(v.IL, 'A', 4)} limit is above the stall current of ${q(Ist, 'A', 4)}, so it never acts; the torque is capped by the stall torque.`), check('Rated point', okRated ? 'pass' : 'fail', okRated ? `Rated current gives ${q(TR, 'N·m', 4)} at ${q(spd(TR), 'rpm', 4)} on the characteristic.` : 'Rated current gives a torque at or above the stall torque; check the motor data.'), check('Peak torque', 'verify', 'Confirm with the maker that the motor’s magnets take the peak torque at the current limit.')],
        });
    },
    "silent-chain-sprocket-tooth-form": (v) => {
      const big = v.size === 'big', t = PI / v.Nt, cot = 1 / Math.tan(t), PD = v.P / Math.sin(t);
      const E = big ? v.P * (cot - 0.22) : 0, B = big ? v.P * Math.sqrt(1.515213 + (cot - 1.1) ** 2) : 0;
      const face = (big ? 60 : 70) - 720 / v.Nt, MHD = v.P * (cot - (v.cut === 'hob' ? 1.33 : 1.25));
      const HGD = big ? v.P * Math.sqrt(1 / Math.sin(t) ** 2 + 0.5625 - 1.5 * Math.sin(rad(30) - t) / Math.sin(t)) : 0, depth = big ? 0.6875 * v.P : 0;
      const okP = big ? v.P >= 9.5 : Math.abs(v.P - 4.7625) <= 0.05, okF = face > 0, okHub = v.hub <= MHD + 1e-9, nStat = v.Nt >= 21 ? 'pass' : v.Nt >= 17 ? 'warn' : 'fail';
      const ok = okF && okHub && v.Nt >= 17;
      return output({ PD, E, B, face, side: face / 2, MHD, HGD, depth, cot }, 'Maximum hub diameter (mm)', MHD,
        [m('Pitch diameter', q(PD, 'mm', 5)), m('Topping curve centre diameter E', big ? q(E, 'mm', 5) : 'Not given for 3/16 in pitch'), m('Base of working face diameter B', big ? q(B, 'mm', 5) : 'Not given for 3/16 in pitch'), m('Angle between the tooth faces', q(face, '°', 4)), m(`Maximum hub diameter (${v.cut === 'hob' ? 'hobbed' : 'straddle-cut'} teeth)`, q(MHD, 'mm', 5)), m('Hob generating diameter', big ? q(HGD, 'mm', 5) : 'Not given for 3/16 in pitch'), m('Maximum depth of cut', big ? q(depth, 'mm', 4) : 'Not given for 3/16 in pitch')],
        'Silent chain sprocket tooth form, hub and hob diameters.', 'ANSI B29.2M formulas as given in the handbook.', {
          text: ok ? 'SPROCKET FORM AND HUB FIT' : 'CHANGE THE TEETH OR THE HUB', tone: ok ? (nStat === 'pass' ? 'good' : 'warn') : 'bad',
          checks: [check('Number of teeth', nStat, v.Nt >= 21 ? `${v.Nt} teeth meets the 21 or more the handbook advises for best results.` : v.Nt >= 17 ? `${v.Nt} teeth is usable, but 21 or more give the best results.` : `${v.Nt} teeth is below the 17 the handbook says should be the least used.`), check('Tooth faces', okF ? 'pass' : 'fail', okF ? `The faces of each tooth are ${q(face, '°', 4)} apart.` : 'The tooth faces are parallel or converge outwards: the teeth would be undercut.'), check('Hub clearance', okHub ? 'pass' : 'fail', `The ${q(v.hub, 'mm', 4)} hub against a maximum of ${q(MHD, 'mm', 4)} for ${v.cut === 'hob' ? 'hobbed' : 'straddle-cut'} teeth${okHub ? '.' : ': reduce the hub or add teeth.'}`), check('Pitch', okP ? 'pass' : 'verify', okP ? 'The pitch suits the tooth form selected.' : 'The pitch does not match the tooth form selected: 3/16 in chain uses the 70° form, 3/8 in and larger the 60° form.')],
        });
    },
    "helical-gear-helix-for-centre-distance": (v) => {
      if (!(v.psiMax > v.psiMin)) return invalid('The largest helix angle accepted must exceed the least.');
      const c = v.mn * (v.z1 + v.z2) / (2 * v.C);
      if (!(c < 1 - 1e-9)) return invalid(`The centre distance must exceed the spur centre distance of ${q(v.mn * (v.z1 + v.z2) / 2, 'mm', 5)} for these teeth and module.`);
      const psiR = Math.acos(c), psi = deg(psiR), mt = v.mn / c, d1 = v.z1 * mt, d2 = v.z2 * mt, s = Math.sin(psiR);
      const L1 = PI * v.z1 * v.mn / s, L2 = PI * v.z2 * v.mn / s, da1 = d1 + 2 * v.mn, da2 = d2 + 2 * v.mn;
      const psiA1 = deg(Math.atan(PI * da1 / L1)), psiA2 = deg(Math.atan(PI * da2 / L2)), ok = psi >= v.psiMin - 1e-9 && psi <= v.psiMax + 1e-9;
      return output({ psi, cos: c, mt, d1, d2, L1, L2, da1, da2, psiA1, psiA2, sumD: d1 + d2 }, 'Helix angle (°)', psi,
        [m('Helix angle ψ', q(psi, '°', 5)), m('Transverse module', q(mt, 'mm', 5)), m('Pitch diameters', `${q(d1, 'mm', 5)} / ${q(d2, 'mm', 5)}`), m('Leads (pinion / gear)', `${q(L1, 'mm', 5)} / ${q(L2, 'mm', 5)}`), m('Outside diameters', `${q(da1, 'mm', 5)} / ${q(da2, 'mm', 5)}`), m('Helix angle at the outside diameters', `${q(psiA1, '°', 4)} / ${q(psiA2, '°', 4)}`)],
        'Helical gear helix angle and leads for a fixed centre distance.', 'Handbook helical gear relations in metric form.', {
          text: ok ? 'HELIX ANGLE FITS THE CENTRE DISTANCE' : 'HELIX ANGLE OUTSIDE THE ACCEPTED RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Helix angle range', ok ? 'pass' : 'fail', `${q(psi, '°', 4)} against ${q(v.psiMin, '°', 3)} to ${q(v.psiMax, '°', 3)} accepted${ok ? '.' : ': change the tooth numbers or module, or use profile shift.'}`), check('Centre distance', 'pass', `The pitch diameters add up to ${q(d1 + d2, 'mm', 6)}, twice the centre distance.`), check('Hands', 'verify', 'Cut the pinion and gear with opposite hands of helix for parallel shafts.')],
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
