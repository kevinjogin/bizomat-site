// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook98). SI units are explicit at each boundary.
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
    "general-purpose-acme-limits": (v) => {
      const rangeTop = [3 / 16, 5 / 16, 7 / 16, 9 / 16, 11 / 16, 13 / 16, 15 / 16, 17 / 16, 19 / 16, 21 / 16, 23 / 16, 25 / 16, 1.875, 2.125, 2.375, 2.625, 2.875, 3.25, 3.75, 4.25, 4.75, 5.5];
      const tab = [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 4.5, 5];
      const tpiRec = [16, 14, 12, 10, 8, 6, 5, 4, 3, 2];
      const i = rangeTop.findIndex((t) => v.D <= t + 1e-9), Dm = ((i ? rangeTop[i - 1] : 0) + rangeTop[i]) / 2, Dt = tab.find((t) => t >= v.D - 1e-9);
      const P = 1 / v.n, E = v.D - 0.5 * P, K = v.D - P, cA = { '2G': 0.008, '3G': 0.006, '4G': 0.004 }[v.cls], cD = { '2G': 0.006, '3G': 0.0028, '4G': 0.002 }[v.cls], cP = { '2G': 0.03, '3G': 0.014, '4G': 0.01 }[v.cls];
      const extra = v.LE > 2 * v.D + 1e-9 ? Math.ceil(v.LE - 2 * v.D - 1e-9) : 0, a = cA * Math.sqrt(Dm) * (1 + 0.1 * extra), tol = cD * Math.sqrt(Dt) + cP * Math.sqrt(P);
      const nRec = tpiRec.includes(v.n) || v.n >= 16 || v.n <= 2 ? v.n : tpiRec.filter((t) => t < v.n)[0], Pf = 1 / nRec, ca = v.n <= 10 ? 0.02 : 0.01, fs = v.starts >= 4 ? 1 : v.starts === 3 ? 0.75 : v.starts === 2 ? 0.5 : 0;
      const dmax = v.D, dmin = v.D - Math.max(0.05 * Pf, 0.005), d2max = E - a, d2min = d2max - tol, d1max = K - ca, d1min = d1max - 1.5 * tol;
      const Dmin = v.D + ca, Dmax = Dmin + ca, D2min = E + fs * a, D2max = D2min + tol, D1min = K, D1max = K + Math.max(0.05 * Pf, 0.005);
      if (!(d1min > 0)) return invalid('Too few threads per inch for this diameter.');
      const As = PI * ((d2min + d1min) / 4) ** 2, Ash = PI * D1max * (0.5 + v.n * Math.tan(rad(14.5)) * (d2min - D1max)), lead = v.starts * P, la = deg(Math.atan(lead / (PI * E)));
      const Fcn = 0.3707 * P, Fcs = Fcn - 0.259 * a, Frn = Fcn - 0.259 * ca, Frs = Fcn - 0.259 * (ca - a), r4 = (x) => q(x, '', 4);
      return output({ P, E, K, a, tol, extra, d2max, d2min, dmin, d1max, d1min, Dmin, Dmax, D2min, D2max, D1min, D1max, As, Ash, la, Fcs, Frs }, 'External pitch diameter max (in)', d2max,
        [m('Pitch / lead', `${q(P, 'in', 5)} / ${q(lead, 'in', 5)}`), m('Basic pitch / minor diameter', `${r4(E)} / ${q(K, 'in', 4)}`), m('Lead angle at the basic pitch diameter', q(la, '°', 4)), m('Pitch diameter allowance (external)', `${q(a, 'in', 4)}${extra ? ` (+${10 * extra} % for engagement beyond 2D)` : ''}`), m('Pitch diameter tolerance', `${q(tol, 'in', 4)} (thread thickness ${q(0.259 * tol, 'in', 4)})`),
          m(`Screw ${v.cls}: major max / min`, `${r4(dmax)} / ${q(dmin, 'in', 4)}`), m(`Screw ${v.cls}: pitch max / min`, `${r4(d2max)} / ${q(d2min, 'in', 4)}`), m(`Screw ${v.cls}: minor max / min`, `${r4(d1max)} / ${q(d1min, 'in', 4)}`),
          m(`Nut ${v.cls}: major min / max`, `${r4(Dmin)} / ${q(Dmax, 'in', 4)}`), m(`Nut ${v.cls}: pitch min / max`, `${r4(D2min)} / ${q(D2max, 'in', 4)}`), m(`Nut ${v.cls}: minor min / max`, `${r4(D1min)} / ${q(D1max, 'in', 4)}`),
          m('Crest flats Fcn / Fcs', `${r4(Fcn)} / ${q(Fcs, 'in', 4)}`), m('Root flats Frn / Frs', `${r4(Frn)} / ${q(Frs, 'in', 4)}`), m('Stress area / shear area per inch', `${q(As, 'in²', 4)} / ${q(Ash, 'in²', 4)}`)],
        `Limits of size for ${q(v.D, '', 4)}-${q(v.n, '', 4)} ACME-${v.cls}${v.starts > 1 ? ` (${v.starts} starts)` : ''}.`, 'ASME/ANSI B1.5 general purpose Acme formulas as given in the handbook.', {
          table: tbl('Limits in millimetres', ['Feature', 'Max (mm)', 'Min (mm)'], [['Screw major', q(dmax * 25.4, '', 4), q(dmin * 25.4, '', 4)], ['Screw pitch', q(d2max * 25.4, '', 4), q(d2min * 25.4, '', 4)], ['Screw minor', q(d1max * 25.4, '', 4), q(d1min * 25.4, '', 4)], ['Nut major', q(Dmax * 25.4, '', 4), q(Dmin * 25.4, '', 4)], ['Nut pitch', q(D2max * 25.4, '', 4), q(D2min * 25.4, '', 4)], ['Nut minor', q(D1max * 25.4, '', 4), q(D1min * 25.4, '', 4)]]),
          checks: [check('Multi-start allowance', v.starts > 1 ? 'verify' : 'pass', v.starts > 1 ? `The nut pitch diameter is raised by ${fs * 100} % of the allowance (${q(fs * a, 'in', 4)}); GO gauges and taps rise by the same amount.` : 'Single-start thread: no extra nut allowance.'), check('Recommended series', tpiRec.includes(v.n) ? 'pass' : 'verify', tpiRec.includes(v.n) ? 'The pitch is one of the recommended Acme pitches.' : `The pitch is not a recommended Acme pitch; the 0.05P terms use ${q(nRec, 'TPI', 4)}.`)],
        });
    },
    "centralizing-acme-limits": (v) => {
      const rangeTop = [3 / 16, 5 / 16, 7 / 16, 9 / 16, 11 / 16, 13 / 16, 15 / 16, 17 / 16, 19 / 16, 21 / 16, 23 / 16, 25 / 16, 1.875, 2.125, 2.375, 2.625, 2.875, 3.25, 3.75, 4.25, 4.75, 5.5];
      const tab = [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 4.5, 5];
      const tpiRec = [16, 14, 12, 10, 8, 6, 5, 4, 3, 2];
      const i = rangeTop.findIndex((t) => v.D <= t + 1e-9), Dm = ((i ? rangeTop[i - 1] : 0) + rangeTop[i]) / 2, Dt = tab.find((t) => t >= v.D - 1e-9), sD = Math.sqrt(v.D);
      const P = 1 / v.n, cls = { '2C': 0, '3C': 1, '4C': 2 }, ie = cls[v.ce], ii = cls[v.ci];
      const cA = [0.008, 0.006, 0.004], cD = [0.006, 0.0028, 0.002], cP = [0.03, 0.014, 0.01], cME = [0.0035, 0.0015, 0.001], cMI = [0.0035, 0.0035, 0.002];
      const extra = v.LE > 2 * v.D + 1e-9 ? Math.ceil(v.LE - 2 * v.D - 1e-9) : 0, a = cA[ie] * Math.sqrt(Dm) * (1 + 0.1 * extra);
      const tolE = cD[ie] * Math.sqrt(Dt) + cP[ie] * Math.sqrt(P), tolI = cD[ii] * Math.sqrt(Dt) + cP[ii] * Math.sqrt(P);
      const nRec = tpiRec.includes(v.n) || v.n >= 16 || v.n <= 2 ? v.n : tpiRec.filter((t) => t < v.n)[0], ca = v.n <= 10 ? 0.02 : 0.01;
      const dmax = v.D, dmin = v.D - cME[ie] * sD, d2max = v.D - P / 2 - a, d2min = d2max - tolE, d1max = v.D - P - ca, d1min = d1max - 1.5 * tolE;
      const amaj = 0.001 * sD, Dmin = v.D + amaj, Dmax = Dmin + cMI[ii] * sD, D2min = v.D - P / 2, D2max = D2min + tolI, D1min = v.D - 0.9 * P, D1max = D1min + Math.max(0.05 / nRec, 0.005);
      if (!(d1min > 0)) return invalid('Too few threads per inch for this diameter.');
      const sumC = cMI[ii] + 0.001 + cME[ie], fitOK = sumC <= cA[ie] + 1e-12, classOK = ii >= ie, ok = fitOK && classOK, r4 = (x) => q(x, '', 4);
      const Fcs = 0.3707 * P - 0.259 * a, Fcn = 0.3707 * P + 0.259 * 0.1 * P, Frn = 0.3707 * P - 0.259 * amaj, Frs = 0.3707 * P - 0.259 * (ca - a);
      return output({ P, a, tolE, tolI, dmax, dmin, d2max, d2min, d1max, d1min, Dmin, Dmax, D2min, D2max, D1min, D1max, sum: sumC * sD, allow: cA[ie] * sD, clrMaj: amaj, clrMin: ca + 0.1 * P }, 'External major diameter min (in)', dmin,
        [m('Pitch diameter allowance (screw)', `${q(a, 'in', 4)}${extra ? ` (+${10 * extra} % for engagement beyond 2D)` : ''}`), m(`Pitch diameter tolerance screw ${v.ce} / nut ${v.ci}`, `${r4(tolE)} / ${q(tolI, 'in', 4)}`),
          m(`Screw ${v.ce}: major max / min`, `${r4(dmax)} / ${q(dmin, 'in', 4)}`), m(`Screw ${v.ce}: pitch max / min`, `${r4(d2max)} / ${q(d2min, 'in', 4)}`), m(`Screw ${v.ce}: minor max / min`, `${r4(d1max)} / ${q(d1min, 'in', 4)}`),
          m(`Nut ${v.ci}: major min / max`, `${r4(Dmin)} / ${q(Dmax, 'in', 4)}`), m(`Nut ${v.ci}: pitch min / max`, `${r4(D2min)} / ${q(D2max, 'in', 4)}`), m(`Nut ${v.ci}: minor min / max`, `${r4(D1min)} / ${q(D1max, 'in', 4)}`),
          m('Major clearance sum / pitch diameter allowance', `${r4(sumC * sD)} / ${q(cA[ie] * sD, 'in', 4)} (at √D)`), m('Minimum clearance at major / minor diameter', `${r4(amaj)} / ${q(ca + 0.1 * P, 'in', 4)}`), m('Crest flats Fcn / Fcs', `${r4(Fcn)} / ${q(Fcs, 'in', 4)}`), m('Root flats Frn / Frs', `${r4(Frn)} / ${q(Frs, 'in', 4)}`)],
        `Limits of size for ${q(v.D, '', 4)}-${q(v.n, '', 4)} ACME-${v.ce} screw with an ACME-${v.ci} nut.`, 'ASME/ANSI B1.5 centralizing Acme formulas as given in the handbook.', {
          text: ok ? 'CENTRALIZING FIT MET' : 'NOT A CENTRALIZING FIT', tone: ok ? 'good' : 'bad',
          table: tbl('Limits in millimetres', ['Feature', 'Max (mm)', 'Min (mm)'], [['Screw major', q(dmax * 25.4, '', 4), q(dmin * 25.4, '', 4)], ['Screw pitch', q(d2max * 25.4, '', 4), q(d2min * 25.4, '', 4)], ['Screw minor', q(d1max * 25.4, '', 4), q(d1min * 25.4, '', 4)], ['Nut major', q(Dmax * 25.4, '', 4), q(Dmin * 25.4, '', 4)], ['Nut pitch', q(D2max * 25.4, '', 4), q(D2min * 25.4, '', 4)], ['Nut minor', q(D1max * 25.4, '', 4), q(D1min * 25.4, '', 4)]]),
          checks: [check('Major diameter requirement', fitOK ? 'pass' : 'fail', `Nut major tolerance + allowance + screw major tolerance = ${q(sumC, '', 4)} √D against the screw pitch diameter allowance ${q(cA[ie], '', 4)} √D.`), check('Classes', classOK ? 'pass' : 'fail', classOK ? `A ${v.ce} screw may be used with a ${v.ci} nut.` : `A ${v.ce} screw needs a nut of the same or a closer class.`)],
        });
    },
    "stub-acme-limits": (v) => {
      const rangeTop = [3 / 16, 5 / 16, 7 / 16, 9 / 16, 11 / 16, 13 / 16, 15 / 16, 17 / 16, 19 / 16, 21 / 16, 23 / 16, 25 / 16, 1.875, 2.125, 2.375, 2.625, 2.875, 3.25, 3.75, 4.25, 4.75, 5.5];
      const tab = [0.25, 0.3125, 0.375, 0.4375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.5, 4, 4.5, 5];
      const i = rangeTop.findIndex((t) => v.D <= t + 1e-9), Dm = ((i ? rangeTop[i - 1] : 0) + rangeTop[i]) / 2, Dt = tab.find((t) => t >= v.D - 1e-9);
      const P = 1 / v.n, [hk, Fk] = { std: [0.3, 0.4224], M1: [0.375, 0.403], M2: [0.25, 0.4353] }[v.form], h = hk * P, D2 = v.D - h, D1 = v.D - 2 * h;
      const cA = { '2G': 0.008, '3G': 0.006, '4G': 0.004 }[v.cls], cD = { '2G': 0.006, '3G': 0.0028, '4G': 0.002 }[v.cls], cP = { '2G': 0.03, '3G': 0.014, '4G': 0.01 }[v.cls];
      const extra = v.LE > 2 * v.D + 1e-9 ? Math.ceil(v.LE - 2 * v.D - 1e-9) : 0, a = cA * Math.sqrt(Dm) * (1 + 0.1 * extra), tol = cD * Math.sqrt(Dt) + cP * Math.sqrt(P), ca = v.n <= 10 ? 0.02 : 0.01;
      const dmax = v.D, dmin = v.D - 0.05 * P, d2max = D2 - a, d2min = d2max - tol, d1max = D1 - ca, d1min = d1max - tol;
      const Dmin = v.D + ca, Dmax = Dmin + tol, D2min = D2, D2max = D2 + tol, D1min = D1, D1max = D1 + 0.05 * P;
      if (!(d1min > 0)) return invalid('Too few threads per inch for this diameter.');
      const F = Fk * P, Fcs = F - 0.259 * a, Frn = F - 0.259 * ca, Frs = F - 0.259 * (ca - a), la = deg(Math.atan(P / (PI * D2))), r4 = (x) => q(x, '', 4);
      const name = { std: 'Stub Acme', M1: 'Stub Acme M1', M2: 'Stub Acme M2' }[v.form];
      return output({ P, h, D2, D1, a, tol, dmin, d2max, d2min, d1max, d1min, Dmin, Dmax, D2min, D2max, D1min, D1max, F, Fcs, Frn, Frs, la }, 'External pitch diameter max (in)', d2max,
        [m('Pitch / basic height h', `${q(P, 'in', 5)} / ${q(h, 'in', 5)}`), m('Basic pitch / minor diameter', `${r4(D2)} / ${q(D1, 'in', 4)}`), m('Lead angle at the basic pitch diameter', q(la, '°', 4)), m(`Pitch diameter allowance / tolerance (${v.cls})`, `${r4(a)} / ${q(tol, 'in', 4)}`),
          m('Screw: major max / min', `${r4(dmax)} / ${q(dmin, 'in', 4)}`), m('Screw: pitch max / min', `${r4(d2max)} / ${q(d2min, 'in', 4)}`), m('Screw: minor max / min', `${r4(d1max)} / ${q(d1min, 'in', 4)}`),
          m('Nut: major min / max', `${r4(Dmin)} / ${q(Dmax, 'in', 4)}`), m('Nut: pitch min / max', `${r4(D2min)} / ${q(D2max, 'in', 4)}`), m('Nut: minor min / max', `${r4(D1min)} / ${q(D1max, 'in', 4)}`),
          m('Crest flats Fcn / Fcs', `${r4(F)} / ${q(Fcs, 'in', 4)}`), m('Root flats Frn / Frs', `${r4(Frn)} / ${q(Frs, 'in', 4)}`)],
        `Limits of size for ${q(v.D, '', 4)}-${q(v.n, '', 4)} ${name}.`, 'ASME/ANSI B1.8 Stub Acme formulas as given in the handbook.', {
          table: tbl('Limits in millimetres', ['Feature', 'Max (mm)', 'Min (mm)'], [['Screw major', q(dmax * 25.4, '', 4), q(dmin * 25.4, '', 4)], ['Screw pitch', q(d2max * 25.4, '', 4), q(d2min * 25.4, '', 4)], ['Screw minor', q(d1max * 25.4, '', 4), q(d1min * 25.4, '', 4)], ['Nut major', q(Dmax * 25.4, '', 4), q(Dmin * 25.4, '', 4)], ['Nut pitch', q(D2max * 25.4, '', 4), q(D2min * 25.4, '', 4)], ['Nut minor', q(D1max * 25.4, '', 4), q(D1min * 25.4, '', 4)]]),
          checks: [check('Fit class', v.cls === '2G' ? 'pass' : 'verify', v.cls === '2G' ? 'Standard Stub Acme fit (Class 2G allowances and tolerances).' : `Class ${v.cls} allowances and tolerances give less backlash than the standard Stub Acme fit.`)],
        });
    },
    "whitworth-thread-limits": (v) => {
      const p = 1 / v.n, h = 0.640327 * p, E = v.D - h, d1 = v.D - 2 * h;
      if (!(d1 > 0)) return invalid('Too few threads per inch for this diameter.');
      const Tu = 0.002 * Math.cbrt(v.D) + 0.003 * Math.sqrt(v.L) + 0.005 * Math.sqrt(p), sp = Math.sqrt(p);
      const kb = { close: 2 / 3, medium: 1, free: 1.5 }[v.bc], kn = { close: 2 / 3, medium: 1, normal: 1.5 }[v.nc];
      const tE = kb * Tu, tMaj = kb * Tu + 0.01 * sp, tMin = kb * Tu + (v.bc === 'close' ? 0.013 : 0.02) * sp, sh = v.ss === 'yes' && v.D > 0.75 + 1e-9 ? 0.001 : 0;
      const Dmax = v.D - sh, Dmin = Dmax - tMaj, Emax = E - sh, Emin = Emax - tE, d1max = d1 - sh, d1min = d1max - tMin;
      const nE = kn * Tu, nMin = 0.2 * p + (v.n >= 26 ? 0.004 : v.n > 20 ? 0.005 : 0.007), NEmin = E, NEmax = E + nE, N1min = d1, N1max = d1 + nMin, ssWarn = v.ss === 'yes' && v.D <= 0.75 + 1e-9 && v.bc === 'close', r4 = (x) => q(x, '', 4);
      return output({ p, h, E, d1, Tu, tE, tMaj, tMin, Dmax, Dmin, Emax, Emin, d1max, d1min, NEmin, NEmax, N1min, N1max }, 'Bolt effective diameter max (in)', Emax,
        [m('Pitch / thread depth', `${q(p, 'in', 5)} / ${q(h, 'in', 5)}`), m('Basic effective / minor diameter', `${r4(E)} / ${q(d1, 'in', 4)}`), m('Crest and root radius', q(0.137329 * p, 'in', 4)), m('Tolerance unit T', q(Tu, 'in', 4)),
          m(`Bolt (${v.bc}): major max / min`, `${r4(Dmax)} / ${q(Dmin, 'in', 4)}`), m(`Bolt (${v.bc}): effective max / min`, `${r4(Emax)} / ${q(Emin, 'in', 4)}`), m(`Bolt (${v.bc}): minor max / min`, `${r4(d1max)} / ${q(d1min, 'in', 4)}`),
          m(`Nut (${v.nc}): major min`, q(v.D, 'in', 4)), m(`Nut (${v.nc}): effective min / max`, `${r4(NEmin)} / ${q(NEmax, 'in', 4)}`), m(`Nut (${v.nc}): minor min / max`, `${r4(N1min)} / ${q(N1max, 'in', 4)}`)],
        `BS 84 limits for ${q(v.D, '', 4)} in × ${q(v.n, '', 4)} TPI Whitworth, ${v.bc} bolt and ${v.nc} nut.`, 'BS 84 tolerance formulas as given in the handbook.', {
          table: tbl('Limits in millimetres', ['Feature', 'Max (mm)', 'Min (mm)'], [['Bolt major', q(Dmax * 25.4, '', 4), q(Dmin * 25.4, '', 4)], ['Bolt effective', q(Emax * 25.4, '', 4), q(Emin * 25.4, '', 4)], ['Bolt minor', q(d1max * 25.4, '', 4), q(d1min * 25.4, '', 4)], ['Nut effective', q(NEmax * 25.4, '', 4), q(NEmin * 25.4, '', 4)], ['Nut minor', q(N1max * 25.4, '', 4), q(N1min * 25.4, '', 4)]]),
          checks: [check('Stainless steel bolts', v.ss !== 'yes' ? 'pass' : ssWarn ? 'warn' : 'verify', v.ss !== 'yes' ? 'No stainless steel adjustment.' : ssWarn ? 'Stainless steel bolts of 3/4 in and below should be made to medium or free class limits, not close.' : sh ? 'Bolt limits are 0.001 in smaller for a stainless steel bolt above 3/4 in.' : 'Stainless steel bolt of 3/4 in or below: no adjustment to the limits.'), check('Nut class', v.nc === 'normal' && v.bc === 'close' ? 'verify' : 'pass', v.nc === 'normal' && v.bc === 'close' ? 'Normal class nuts are intended for medium or free class bolts.' : 'Bolt and nut classes as chosen.')],
        });
    },
    "unified-miniature-thread-limits": (v) => {
      const p = v.p, E = v.D - 0.64952 * p, K = v.D - 1.04 * p, Ks = v.D - 1.2 * p;
      if (!(Ks - (0.16 * p + 0.008) > 0)) return invalid('The pitch is too coarse for this diameter.');
      const dmin = v.D - (0.12 * p + 0.006), Emax = E, Emin = E - (0.08 * p + 0.008), d1max = Ks, d1min = Ks - (0.16 * p + 0.008);
      const D1min = K, D1max = K + 0.32 * p + 0.012, E2min = E, E2max = E + 0.08 * p + 0.008, Dnmin = v.D + 0.072 * p, Dnmax = Dnmin + 0.168 * p + 0.008;
      const la = deg(Math.atan(p / (PI * E))), A = PI / 4 * (v.D - 1.28 * p) ** 2, inStd = v.D >= 0.3 - 1e-9 && v.D <= 1.4 + 1e-9, r3 = (x) => q(x, '', 4);
      return output({ E, K, tpi: 25.4 / p, dmin, Emax, Emin, d1max, d1min, D1min, D1max, E2min, E2max, Dnmin, Dnmax, la, A }, 'External pitch diameter max (mm)', Emax,
        [m('Threads per inch', q(25.4 / p, 'TPI', 4)), m('Basic pitch / minor diameter', `${r3(E)} / ${q(K, 'mm', 4)}`), m('External major max / min', `${r3(v.D)} / ${q(dmin, 'mm', 4)}`), m('External pitch max / min', `${r3(Emax)} / ${q(Emin, 'mm', 4)}`), m('External minor max / min', `${r3(d1max)} / ${q(d1min, 'mm', 4)}`),
          m('Internal minor min / max', `${r3(D1min)} / ${q(D1max, 'mm', 4)}`), m('Internal pitch min / max', `${r3(E2min)} / ${q(E2max, 'mm', 4)}`), m('Internal major min / max', `${r3(Dnmin)} / ${q(Dnmax, 'mm', 4)}`), m('Lead angle at the basic pitch diameter', q(la, '°', 4)), m('Sectional area at D − 1.28p', q(A, 'mm²', 4))],
        `UNM limits for ${q(v.D, '', 4)} mm × ${q(p, '', 4)} mm pitch.`, 'ANSI B1.10 unified miniature thread formulas as given in the handbook.', {
          checks: [check('Standard size range', inStd ? 'pass' : 'warn', inStd ? 'Within the 0.30 to 1.40 mm range of the standard.' : 'Outside the 0.30 to 1.40 mm range covered by the standard.'), check('Tool limits', 'verify', 'The internal major maximum and external minor minimum are held by the tap and die, not gauged on the part.')],
        });
    },
    "bearing-static-equivalent-load": (v) => {
      const thrust = v.type === 'thrustball' || v.type === 'thrustroller', dbl = v.rows === 'double', a = rad(v.alpha);
      let X = 1, Y = 0, P0, note = '', valid = 'pass';
      if (thrust) {
        if (!(v.alpha > 0)) return invalid('A thrust bearing needs a contact angle above 0°.');
        if (v.alpha >= 90 - 1e-9) { P0 = v.Fa; if (v.Fr > 0) { valid = 'fail'; note = 'A thrust bearing with α = 90° carries axial load only.'; } else note = 'α = 90°: Poa = Fa.'; }
        else {
          P0 = v.Fa + 2.3 * v.Fr * Math.tan(a); const cot = 1 / Math.tan(a), ratio = v.Fa > 0 ? v.Fr / v.Fa : Infinity;
          if (v.type === 'thrustball' && v.dir === 'single') { valid = ratio <= 0.44 * cot + 1e-12 ? 'pass' : ratio <= 0.67 * cot + 1e-12 ? 'verify' : 'fail'; note = `Fr ÷ Fa = ${q(Number.isFinite(ratio) ? ratio : 0, '', 4)} against 0.44 cot α = ${q(0.44 * cot, '', 4)} (satisfactory up to ${q(0.67 * cot, '', 4)}).`; }
          else if (v.type === 'thrustroller') { valid = v.Fr <= 0.44 * v.Fa * cot + 1e-9 ? 'pass' : 'verify'; note = valid === 'pass' ? 'Fr is within 0.44 Fa cot α.' : 'Fr > 0.44 Fa cot α: the formula is less accurate.'; }
          else note = 'Double direction thrust ball bearing: valid for all load directions.';
        }
      } else {
        if (v.type === 'roller0') { P0 = v.Fr; X = 1; Y = 0; if (v.Fa > 0) { valid = 'verify'; note = 'Radial roller bearings with α = 0° under axial load: ask the bearing maker for the equivalent load.'; } else note = 'Radial load only: Po = Fr.'; }
        else {
          if (v.type === 'radial') { X = 0.6; Y = 0.5; }
          else if (v.type === 'angular') {
            if (v.alpha < 15 - 1e-9 || v.alpha > 40 + 1e-9) return invalid('The handbook gives angular contact factors for 15° to 40° only.');
            const A = [15, 20, 25, 30, 35, 40], Yv = [0.47, 0.42, 0.38, 0.33, 0.29, 0.26]; let k = 0; while (k < 4 && v.alpha > A[k + 1]) k++;
            const y = Yv[k] + (Yv[k + 1] - Yv[k]) * (v.alpha - A[k]) / 5; X = dbl ? 1 : 0.5; Y = dbl ? 2 * y : y;
          } else {
            if (!(v.alpha > 0)) return invalid('Self-aligning and tapered bearings need a contact angle above 0°.');
            X = dbl ? 1 : 0.5; Y = (dbl ? 0.44 : 0.22) / Math.tan(a);
          }
          P0 = Math.max(X * v.Fr + Y * v.Fa, v.Fr); note = X * v.Fr + Y * v.Fa < v.Fr ? 'Xo Fr + Yo Fa is less than Fr, so Po = Fr.' : 'Po = Xo Fr + Yo Fa.';
        }
      }
      if (!(P0 > 0)) return invalid('Enter a radial or axial load.');
      const s = v.Co * 1000 / P0, ok = s >= v.s0 - 1e-12 && valid !== 'fail';
      return output({ X, Y, P0, s }, thrust ? 'Static equivalent axial load Poa (N)' : 'Static equivalent radial load Po (N)', P0,
        [...(thrust ? [] : [m('Static load factors Xo / Yo', `${q(X, '', 4)} / ${q(Y, '', 4)}`)]), m(thrust ? 'Static equivalent axial load Poa' : 'Static equivalent radial load Po', q(P0, 'N', 4)), m('Static safety factor Co ÷ Po', q(s, '', 4)), m('Required static safety factor', q(v.s0, '', 4))],
        `Static equivalent load of a ${v.type === 'roller0' ? 'radial roller' : v.type.replace('ball', ' ball').replace('roller', ' roller')} bearing.`, 'AFBMA static equivalent load formulas as given in the handbook.', {
          text: ok ? 'STATIC SAFETY FACTOR MET' : valid === 'fail' ? 'LOADS OUTSIDE THE FORMULA' : 'BELOW THE REQUIRED STATIC SAFETY FACTOR', tone: ok ? 'good' : 'bad',
          checks: [check('Static safety factor', s >= v.s0 - 1e-12 ? 'pass' : 'fail', `Co ÷ Po = ${q(s, '', 4)} against ${q(v.s0, '', 4)} required.`), check('Formula', valid, note)],
        });
    },
    "rail-and-track-wheel-size": (v) => {
      const lb = v.C * 1000 / 4.4482216, Din = v.D / 25.4, Ain = v.A / 25.4, Kpsi = v.K / 0.0068947573, ysp = v.ys / 0.0068947573;
      const B = lb / (1250 * Din), Areq = B + 0.625, Dmin = lb / (Ain * Kpsi), areaOK = Din < 25, pA = (ysp - 13000) / 20000 * 600 * Din, Lc = pA > 0 ? lb / pA : Infinity;
      const wOK = Ain >= Areq - 1e-9, dOK = Din >= Dmin - 1e-9, cOK = !areaOK || (pA > 0 && Ain >= Lc - 1e-9), ok = wOK && dOK && cOK;
      const pSI = pA * 4.4482216 / 25.4;
      return output({ B: B * 25.4, Areq: Areq * 25.4, Dmin: Dmin * 25.4, p: pSI, Lc: Number.isFinite(Lc) ? Lc * 25.4 : 0 }, 'Smallest safe wheel diameter (mm)', Dmin * 25.4,
        [m('Required tread width B', q(B * 25.4, 'mm', 4)), m('Required head width A = B + 5/8 in', q(Areq * 25.4, 'mm', 4)), m('Smallest safe wheel diameter', q(Dmin * 25.4, 'mm', 4)),
          m('AREA allowable load per unit length', areaOK ? (pA > 0 ? q(pSI, 'N/mm', 4) : 'none (yield strength at or below 13,000 lb/in²)') : 'not applicable (wheel 635 mm or larger)'), m('Contact length needed (AREA)', areaOK && pA > 0 ? q(Lc * 25.4, 'mm', 4) : '—')],
        `Rail and wheel for a ${q(v.C, 'kN', 4)} wheel load on a ${q(v.D, 'mm', 4)} wheel.`, 'Handbook rail size and AREA roller load formulas.', {
          text: ok ? 'RAIL AND WHEEL CARRY THE LOAD' : !wOK || !cOK ? 'RAIL HEAD TOO NARROW' : 'WHEEL TOO SMALL FOR THE LOAD', tone: ok ? 'good' : 'bad',
          checks: [check('Head width', wOK ? 'pass' : 'fail', `${q(v.A, 'mm', 4)} used against ${q(Areq * 25.4, 'mm', 4)} required.`), check('Wheel diameter', dOK ? 'pass' : 'fail', `${q(v.D, 'mm', 4)} against the smallest safe ${q(Dmin * 25.4, 'mm', 4)}.`),
            check('AREA contact length', !areaOK ? 'verify' : cOK ? 'pass' : 'fail', !areaOK ? 'The AREA formula is for wheels below 635 mm diameter.' : pA > 0 ? `Head width ${q(v.A, 'mm', 4)} against ${q(Lc * 25.4, 'mm', 4)} of contact needed.` : 'The yield strength is too low for the AREA formula.')],
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
