// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook90). SI units are explicit at each boundary.
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
    "journal-bearing-lubrication-analysis": (v) => {
      const IN = 25.4, K = v.feed === 'groove' ? 2 : 1, Kp = v.feed === 'groove' ? 2.35e5 : 1.64e5;
      const W = v.W / 4.4482216152605, d = v.d / IN, l = v.l / IN, cd = v.cd / IN, ps = v.ps / 6.894757293168, taF = v.ta * 1.8, r = d / 2;
      if (!(cd < d)) return invalid('The clearance must be smaller than the journal diameter.');
      const pb = W / (K * l * d), m1 = 1000 * cd / d, P = 6.9 * m1 ** 2 * pb / (v.Z * v.n), Cn = (l / d) ** 2 / (60 * P);
      const Tf = v.Tp * r * r * v.Z * v.n / (6900 * m1), Pf = K * Tf * v.n * l / 63000, QR = v.X * Pf / taF;
      const Q1 = v.n * l * cd * v.qf * d / 294, Q2 = Kp * ps * cd ** 3 * d * (1 + 1.5 * v.eps ** 2) / (v.Z * l), Q = Q1 + Q2, tF = v.X * Pf / Q, tC = tF / 1.8, tNewC = (v.ta + tC) / 2;
      const hoIn = cd / 2 * (1 - v.eps), ho = hoIn * IN, hoMin = d < 1 ? 200e-6 : d <= 4 ? 500e-6 : 750e-6;
      const conv = Math.abs(tF - taF) <= 5, okH = hoIn >= hoMin - 1e-12, okT = tF <= 40 + 1e-9;
      const gpm = 3.785411784, Qlpm = Q * gpm;
      return output({ pb, m: cd / d, P, Cn, Tf, Pf, PfkW: Pf * 0.745699872, QR, Q1, Q2, Q, Qlpm, tF, tC, tNewC, ho, hoIn }, 'Actual temperature rise (°C)', tC,
        [m('Unit load pb', `${q(pb * 6.894757293168, 'kPa', 5)} (${q(pb, 'psi', 5)})`), m('Pressure parameter P / capacity number Cn', `${q(P, '', 4)} / ${q(Cn, '', 4)} (l/d ${q(l / d, '', 3)})`), m('Friction torque', `${q(Tf, 'in·lb per in', 4)}`), m('Friction power', `${q(Pf * 0.745699872, 'kW', 4)} (${q(Pf, 'hp', 4)})`), m('Oil flow required / actual', `${q(QR * gpm, 'L/min', 4)} / ${q(Qlpm, 'L/min', 4)} (${q(Q, 'gpm', 4)}: ${q(Q1, 'gpm', 3)} hydrodynamic + ${q(Q2, 'gpm', 3)} pressure)`), m('Temperature rise actual / assumed', `${q(tC, '°C', 4)} / ${q(v.ta, '°C', 4)} (${q(tF, '°F', 4)})`), m('Minimum film thickness', `${q(ho, 'mm', 4)} (${q(hoIn * 1e6, 'µin', 4)})`)],
        'Journal bearing lubrication analysis.', 'Handbook journal bearing lubrication analysis (Wilcock and Booser method).', {
          text: conv ? 'ASSUMED TEMPERATURE RISE CONFIRMED' : 'REPEAT WITH THE NEW ASSUMED RISE', tone: conv ? (okH && okT ? 'good' : 'warn') : 'warn',
          checks: [check('Temperature rise iteration', conv ? 'pass' : 'verify', conv ? `Actual ${q(tF, '°F', 4)} is within 5 °F of the assumed ${q(taF, '°F', 4)}.` : `Repeat with an assumed rise of ${q(tNewC, '°C', 4)} and read Z, ε, T and q again.`), check('Minimum film thickness', okH ? 'pass' : 'fail', `${q(hoIn * 1e6, 'µin', 4)} against the handbook minimum of ${q(hoMin * 1e6, 'µin', 3)} for this diameter.`), check('Temperature rise', okT ? 'pass' : 'fail', `${q(tF, '°F', 4)} against about 40 °F maximum.`), check('Flow', Q >= QR ? 'pass' : 'verify', `Actual flow ${q(Q, 'gpm', 4)} against ${q(QR, 'gpm', 4)} required at the assumed rise.`)],
        });
    },
    "flat-plate-thrust-bearing-design": (v) => {
      const IN = 25.4, W = v.W / 4.4482216152605, D1 = v.D1 / IN, p0 = v.pDesign / 6.894757293168, D2 = v.D2 / IN, s = v.s / IN, ps = v.ps / 6.894757293168, h = v.h / IN, lc = v.lc / IN, tF = v.dT * 1.8;
      const D2req = Math.sqrt(4 * W / (PI * v.Kg * p0) + D1 * D1);
      if (!(D2 > D1)) return invalid('The outside diameter must be larger than the inside diameter.');
      const a = (D2 - D1) / 2, B = PI * (D2 - a), iApp = B / (a + s), b = (B - v.i * s) / v.i;
      if (!(b > 0)) return invalid('The oil grooves take up the whole circumference: use fewer pads or narrower grooves.');
      const pAct = W / (v.i * a * b), U = B * v.n / 12, Pf = v.i * a * b * v.M, c = v.rho * v.cp * 0.003785411784 / (1.05505585262 * 1.8), Q = 42.4 * Pf / (c * tF);
      const QF = 1.5e5 * v.i * (a / b) * h ** 3 * ps / v.Z2, Qc = v.share * Q / v.i, Q0c = Qc / v.kappa, g = (Q0c * lc * v.Z2 / (4.74e4 * ps)) ** 0.25;
      const okD = D2 >= D2req - 1e-9, okP = pAct <= p0 * (1 + 1e-9), okT = tF <= 50 + 1e-9, ok = okD && okP;
      const kPa = 6.894757293168, gpm = 3.785411784;
      return output({ D2req: D2req * IN, a: a * IN, B: B * IN, iApp, i: v.i, b: b * IN, pAct: pAct * kPa, pPsi: pAct, U, Pf, PfkW: Pf * 0.745699872, c, Q, QLpm: Q * gpm, QF, Qc, Q0c, g: g * IN, gIn: g }, 'Actual unit load (kPa)', pAct * kPa,
        [m('Outside diameter required / chosen', `${q(D2req * IN, 'mm', 5)} / ${q(v.D2, 'mm', 5)}`), m('Pad width a / pad length b', `${q(a * IN, 'mm', 4)} / ${q(b * IN, 'mm', 4)}`), m('Pitch-line circumference / approximate pads', `${q(B * IN, 'mm', 5)} / ${q(iApp, '', 3)}`), m('Actual unit load', `${q(pAct * kPa, 'kPa', 4)} (${q(pAct, 'psi', 4)})`), m('Pitch-line velocity', `${q(U * 0.3048 / 60, 'm/s', 4)} (${q(U, 'ft/min', 5)})`), m('Friction power', `${q(Pf * 0.745699872, 'kW', 4)} (${q(Pf, 'hp', 4)})`), m('Oil flow required', `${q(Q * gpm, 'L/min', 4)} (${q(Q, 'gpm', 4)}); film flow ${q(QF, 'gpm', 3)}`), m('Chamfer depth g', `${q(g * IN, 'mm', 4)} (${q(g, 'in', 4)})`)],
        'Flat plate thrust bearing design.', 'Handbook flat plate thrust bearing design procedure (Wilcock and Booser).', {
          text: ok ? 'THRUST BEARING LAID OUT' : 'ENLARGE THE THRUST FACE', tone: ok ? 'good' : 'bad',
          checks: [check('Outside diameter', okD ? 'pass' : 'fail', `${q(v.D2, 'mm', 5)} chosen against ${q(D2req * IN, 'mm', 5)} required for the design unit load.`), check('Unit load', okP ? 'pass' : 'fail', `${q(pAct * kPa, 'kPa', 4)} on the pads against ${q(v.pDesign, 'kPa', 4)} design.`), check('Temperature rise', okT ? 'pass' : 'verify', `${q(tF, '°F', 3)} against 50 °F acceptable maximum.`), check('Chamfer flow', v.share >= 0.5 ? 'pass' : 'verify', `${q(100 * v.share, '%', 3)} of the oil through the chamfers (at least one-half recommended).`), check('Outside to inside diameter', D2 / D1 >= 1.5 && D2 / D1 <= 2.5 ? 'pass' : 'verify', `D2 ÷ D1 = ${q(D2 / D1, '', 3)} (usually 1.5 to 2.5).`)],
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
