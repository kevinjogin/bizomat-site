// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook88). SI units are explicit at each boundary.
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
    "bolt-grip-thread-length": (v) => {
      if (!(v.Lt < v.L + 1e-9)) return invalid('The thread length cannot exceed the nominal length; for screws threaded full length enter the nominal length.');
      const Lg = v.L - v.Lt;
      let Lb, LTT = NaN, full = false, fullLim = NaN, rows;
      if (v.std === 'socket') { LTT = v.Lt + 5 * v.P; Lb = Math.max(0, v.L - LTT); rows = [['Grip length LG = L − LT', q(Lg, 'mm', 4)], ['Total thread length LTT = LT + 5P', q(LTT, 'mm', 4)], ['Body length LB = L − LTT', q(Lb, 'mm', 4)]]; }
      else if (v.std === 'metric') { Lb = NaN; rows = [['Grip gauging length Lg max = L − B', q(Lg, 'mm', 4)]]; }
      else { Lb = Lg - v.Y; fullLim = (v.d <= 25.4 + 1e-9 ? 2.5 : 3.5) * v.P; full = Lb <= fullLim + 1e-9; rows = [['Grip gauging length LG max = L − LT', q(Lg, 'mm', 4)], ['Body length LB min = LG max − Y max', q(Lb, 'mm', 4)], ['Full-thread limit', `${q(fullLim, 'mm', 4)} (${v.d <= 25.4 + 1e-9 ? '2.5' : '3.5'} × pitch)`], ['Threaded full length', full ? 'Yes' : 'No']]; }
      const beyond = v.L - v.grip, okGrip = v.grip >= Lg - 1e-9 || full, okLen = beyond >= v.need - 1e-9, ok = okGrip && okLen;
      const vals = { Lg, beyond };
      if (isFinite(Lb)) vals.Lb = Lb; if (isFinite(LTT)) vals.LTT = LTT; if (isFinite(fullLim)) { vals.fullLim = fullLim; vals.full = full ? 1 : 0; }
      return output(vals, 'Grip length (mm)', Lg,
        [m('Grip (gauging) length', q(Lg, 'mm', 4)), m('Body length', isFinite(Lb) ? q(Lb, 'mm', 4) : 'Not defined by this rule'), m('Length beyond the joint', `${q(beyond, 'mm', 4)} against ${q(v.need, 'mm', 4)} needed`), m('Full thread from under the head at', full ? 'Threaded full length' : q(Lg, 'mm', 4))],
        'Bolt and screw grip and thread lengths.', 'Thread length rules of the ASME and BS fastener standards as given in the handbook.', {
          text: ok ? 'LENGTH SUITS THE JOINT' : 'CHOOSE ANOTHER LENGTH', tone: ok ? 'good' : 'bad', table: tbl('Lengths by the standard rule', ['Length', 'Value'], rows),
          checks: [check('Full thread within the joint', okGrip ? 'pass' : 'fail', full ? 'The bolt is threaded full length.' : `Clamped thickness ${q(v.grip, 'mm', 4)} against grip length ${q(Lg, 'mm', 4)}${okGrip ? '.' : `: the ${v.fit === 'nut' ? 'nut' : 'tapped hole'} would meet incomplete thread before the joint is tight.`}`), check(v.fit === 'nut' ? 'Length for the nut' : 'Thread engagement', okLen ? 'pass' : 'fail', `${q(beyond, 'mm', 4)} beyond the joint against ${q(v.need, 'mm', 4)} needed.`), check('Table values', 'verify', 'Take the thread length (and Y for structural bolts) from the standard for this size and length.')],
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
