// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook91). SI units are explicit at each boundary.
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
    "step-thrust-bearing-design": (v) => {
      const IN = 25.4, W = v.W / 4.4482216152605, D1 = v.D1 / IN, D2 = v.D2 / IN, s = v.s / IN, p0 = v.pDesign / 6.894757293168;
      if (!(D2 > D1)) return invalid('The outside diameter must be larger than the inside diameter.');
      const D2req = Math.sqrt(4 * W / (PI * v.Kg * p0) + D1 * D1), a = (D2 - D1) / 2, B = PI * (D1 + D2) / 2, iApp = B / (a + s), b = B / v.i - s;
      if (!(b > 0)) return invalid('The oil grooves take up the whole circumference: use fewer pads or narrower grooves.');
      const U = B * v.n / 12, pAct = W / (v.i * a * b), h = Math.sqrt(2.09e-9 * v.i * a ** 3 * U * v.Z / W), e = 0.7 * h, Pf = 7.35e-13 * v.i * a * a * U * U * v.Z / h, b2 = 1.2 * b / 2.2, Q = 6.65e-4 * v.i * a * h * U;
      const c = v.rho * v.cp * 0.003785411784 / (1.05505585262 * 1.8), dtF = 42.4 * Pf / (c * Q), dtC = dtF / 1.8, ok = dtC <= v.dTmax + 1e-9;
      return output({ D2req: D2req * IN, a: a * IN, aIn: a, B: B * IN, BIn: B, iApp, b: b * IN, bIn: b, U, pAct: pAct * 6.894757293168, h: h * IN, hIn: h, e: e * IN, eIn: e, b2: b2 * IN, b2In: b2, Pf, PfkW: Pf * 0.745699872, c, Q, QLpm: Q * 3.785411784, dtF, dtC }, 'Film thickness (mm)', h * IN,
        [m('Outside diameter required / chosen', `${q(D2req * IN, 'mm', 4)} / ${q(v.D2, 'mm', 4)}`), m('Pad width a / pad length b', `${q(a * IN, 'mm', 4)} / ${q(b * IN, 'mm', 4)} (${q(iApp, '', 3)} pads approx.)`), m('Pitch-line velocity / unit load', `${q(U * 0.3048 / 60, 'm/s', 4)} (${q(U, 'ft/min', 4)}) / ${q(pAct * 6.894757293168, 'kPa', 4)}`), m('Film thickness h / step depth e', `${q(h * IN, 'mm', 4)} / ${q(e * IN, 'mm', 4)} (${q(h, 'in', 5)} / ${q(e, 'in', 5)})`), m('Step position b2 from the leading edge', q(b2 * IN, 'mm', 4)), m('Friction power', `${q(Pf * 0.745699872, 'kW', 4)} (${q(Pf, 'hp', 4)})`), m('Oil flow / temperature rise', `${q(Q * 3.785411784, 'L/min', 4)} (${q(Q, 'gpm', 3)}) / ${q(dtC, '°C', 4)} (${q(dtF, '°F', 3)})`)],
        'Step thrust bearing design.', 'Handbook step thrust bearing design procedure (Wilcock and Booser).', {
          text: ok ? 'STEP BEARING LAID OUT' : 'TEMPERATURE RISE TOO HIGH: ADD CHAMFERS', tone: ok ? 'good' : 'bad',
          checks: [check('Temperature rise', ok ? 'pass' : 'fail', `${q(dtC, '°C', 4)} against ${q(v.dTmax, '°C', 4)} accepted${ok ? '.' : ': add feed chamfers to raise the oil flow.'}`), check('Outside diameter', v.D2 >= D2req * IN - 1e-6 ? 'pass' : 'verify', `${q(v.D2, 'mm', 4)} chosen against ${q(D2req * IN, 'mm', 4)} for the design unit load.`), check('Pad shape', Math.abs(b / a - 1) <= 0.25 ? 'pass' : 'verify', `Pad length ÷ width = ${q(b / a, '', 3)} (about 1 is optimum).`)],
        });
    },
    "tapered-land-thrust-bearing-design": (v) => {
      const IN = 25.4, W = v.W / 4.4482216152605, D1 = v.D1 / IN, D2 = v.D2 / IN, s = v.s / IN, p0 = v.pDesign / 6.894757293168, d2 = v.d2 / IN, h = v.h / IN, tF = v.dT * 1.8;
      if (!(D2 > D1)) return invalid('The outside diameter must be larger than the inside diameter.');
      const D2req = Math.sqrt(4 * W / (PI * v.Kg * p0) + D1 * D1), a = (D2 - D1) / 2, B = PI * (D1 + D2) / 2, iApp = B / (a + s), b = (B - v.i * s) / v.i;
      if (!(b > 0)) return invalid('The oil grooves take up the whole circumference: use fewer pads or narrower grooves.');
      const pAct = W / (v.i * a * b), U = B * v.n / 12, YL = b / (1 + PI * PI * b * b / (12 * a * a)), K = 5.75e6 * pAct / (U * YL * v.Z);
      const Pf = 8.79e-13 * v.i * a * b * v.J * U * U * v.Z, c = v.rho * v.cp * 0.003785411784 / (1.05505585262 * 1.8), Q = 42.4 * Pf / (c * tF), YS = 8 * a * b / (D2 * D2 - D1 * D1), QF = 8.9e-4 * v.i * d2 * D2 ** 3 * v.n * v.YG * YS * YS / (D2 - D1);
      const okF = QF >= Q, hMin = v.hAccept / IN, okH = h >= hMin - 1e-12, okP = pAct <= 500 + 1e-9;
      return output({ D2req: D2req * IN, D2reqIn: D2req, a: a * IN, aIn: a, B: B * IN, BIn: B, iApp, b: b * IN, bIn: b, pAct: pAct * 6.894757293168, pPsi: pAct, U, YL, K, Pf, PfkW: Pf * 0.745699872, c, Q, QLpm: Q * 3.785411784, YS, QF, QFLpm: QF * 3.785411784, ratio: D1 / D2 }, 'Film flow ÷ flow required', QF / Q,
        [m('Outside diameter required / chosen', `${q(D2req * IN, 'mm', 4)} / ${q(v.D2, 'mm', 4)}`), m('Pad width a / pad length b', `${q(a * IN, 'mm', 4)} / ${q(b * IN, 'mm', 4)} (${q(iApp, '', 3)} pads approx.)`), m('Unit load / pitch-line velocity', `${q(pAct * 6.894757293168, 'kPa', 4)} (${q(pAct, 'psi', 4)}) / ${q(U * 0.3048 / 60, 'm/s', 4)} (${q(U, 'ft/min', 5)})`), m('Leakage factor YL / film-thickness factor K', `${q(YL, '', 4)} / ${q(K, '', 4)}`), m('Friction power', `${q(Pf * 0.745699872, 'kW', 4)} (${q(Pf, 'hp', 4)})`), m('Oil flow required / film flow', `${q(Q * 3.785411784, 'L/min', 4)} / ${q(QF * 3.785411784, 'L/min', 4)} (${q(Q, 'gpm', 3)} / ${q(QF, 'gpm', 3)})`), m('Shape factor YS / D1 ÷ D2', `${q(YS, '', 4)} / ${q(D1 / D2, '', 3)}`)],
        'Tapered land thrust bearing design.', 'Handbook tapered land thrust bearing design procedure (Wilcock and Booser).', {
          text: okF ? 'FILM FLOW CARRIES THE HEAT' : 'ADD CHAMFERS OR MORE TAPER', tone: okF ? (okH && okP ? 'good' : 'warn') : 'bad',
          checks: [check('Oil flow', okF ? 'pass' : 'fail', `Film passes ${q(QF, 'gpm', 3)} against ${q(Q, 'gpm', 3)} needed for the temperature rise${okF ? ': chamfers are not needed.' : '.'}`), check('Film thickness', okH ? 'pass' : 'verify', `${q(v.h, 'mm', 4)} against ${q(v.hAccept, 'mm', 4)} accepted (${q(h, 'in', 5)}).`), check('Unit load', okP ? 'pass' : 'fail', `${q(pAct, 'psi', 4)} against 500 psi maximum for tapered land bearings.`)],
        });
    },
    "tilting-pad-thrust-bearing-design": (v) => {
      const IN = 25.4, W = v.W / 4.4482216152605, D1 = v.D1 / IN, D2 = v.D2 / IN, p0 = v.pDesign / 6.894757293168, b = v.b / IN, al = v.alpha * 1e-3;
      if (!(D2 > D1)) return invalid('The outside diameter must be larger than the inside diameter.');
      const D2req = Math.sqrt(4 * W / (PI * v.Kg * p0) + D1 * D1), a = (D2 - D1) / 2, B = PI * (D1 + D2) / 2, iEst = B * v.Kg / a, bEst = B * v.Kg / v.i;
      if (!(v.i * b <= B + 1e-9)) return invalid('The pads are longer than the pitch circumference allows: use fewer or shorter pads.');
      const U = B * v.n / 12, pAct = W / (v.i * a * b), O = 1.45e-7 * v.Z2 * U / (5 * pAct * b), hmin = al * b, Pf = v.f * W * U / 33000, Q = 0.0591 * al * v.i * a * b * U;
      const c = v.rho * v.cp * 0.003785411784 / (1.05505585262 * 1.8), dtF = 0.0217 * v.f * pAct / (al * c), dtC = dtF / 1.8, ok = dtC <= v.dTmax + 1e-9, hNeed = v.hAccept / IN, okH = hmin >= hNeed - 1e-12;
      return output({ D2req: D2req * IN, D2reqIn: D2req, a: a * IN, aIn: a, B: B * IN, BIn: B, iEst, bEst: bEst * IN, bEstIn: bEst, U, pAct: pAct * 6.894757293168, pPsi: pAct, O, hmin: hmin * IN, hminIn: hmin, Pf, PfkW: Pf * 0.745699872, c, Q, QLpm: Q * 3.785411784, dtF, dtC }, 'Temperature rise (°C)', dtC,
        [m('Outside diameter required / used', `${q(D2req * IN, 'mm', 4)} / ${q(v.D2, 'mm', 4)}`), m('Pad width a / pitch circumference B', `${q(a * IN, 'mm', 4)} / ${q(B * IN, 'mm', 4)}`), m('Pads estimated / pad length estimated', `${q(iEst, '', 3)} / ${q(bEst * IN, 'mm', 4)}`), m('Pitch-line velocity / unit load', `${q(U * 0.3048 / 60, 'm/s', 4)} (${q(U, 'ft/min', 5)}) / ${q(pAct * 6.894757293168, 'kPa', 4)} (${q(pAct, 'psi', 4)})`), m('Operating number O', `${q(O * 1e6, '', 4)} × 10⁻⁶`), m('Minimum film thickness', `${q(hmin * IN, 'mm', 4)} (${q(hmin, 'in', 5)})`), m('Friction power / oil flow', `${q(Pf * 0.745699872, 'kW', 4)} (${q(Pf, 'hp', 4)}) / ${q(Q * 3.785411784, 'L/min', 4)} (${q(Q, 'gpm', 4)})`), m('Temperature rise', `${q(dtC, '°C', 4)} (${q(dtF, '°F', 3)})`)],
        'Tilting pad thrust bearing design.', 'Handbook tilting pad thrust bearing design procedure (Wilcock and Booser).', {
          text: ok ? 'TILTING PAD BEARING SATISFACTORY' : 'TEMPERATURE RISE TOO HIGH', tone: ok ? (okH ? 'good' : 'warn') : 'bad',
          checks: [check('Temperature rise', ok ? 'pass' : 'fail', `${q(dtC, '°C', 4)} against ${q(v.dTmax, '°C', 4)} accepted${ok ? '.' : ': add feed chamfers or enlarge the bearing.'}`), check('Minimum film', okH ? 'pass' : 'verify', `${q(hmin * IN, 'mm', 4)} against ${q(v.hAccept, 'mm', 4)} accepted (${q(hmin, 'in', 5)}).`), check('Unit load', pAct <= 500 + 1e-9 ? 'pass' : 'verify', `${q(pAct, 'psi', 4)} against 500 psi maximum in the handbook’s Table 1.`)],
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
