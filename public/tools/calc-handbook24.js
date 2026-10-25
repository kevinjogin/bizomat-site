// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook24). SI units are explicit at each boundary.
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
    "plastic-gear-power": (v) => {
      if (v.type === 'bevel' && v.C <= v.F) return invalid('The cone distance must exceed the face width.');
      const V = PI * v.d * v.rpm / 60000, base = v.F * v.Y * v.m * v.Ss * V;
      const kW = v.type === 'helical' ? base / (179 * (5.56 + V) * v.Cs) : v.type === 'bevel' ? base * (v.C - v.F) / (327 * (3.05 + V) * v.Cs * v.C) : base / (327 * (3.05 + V) * v.Cs);
      const Tq = kW * 1000 / (2 * PI * v.rpm / 60);
      return output({ V, kW, Tq }, 'Power rating (kW)', kW,
        [m('Pitch-line velocity', q(V, 'm/s', 3)), m('Power rating', q(kW * 1000, 'W', 1)), m('Torque at the rating', q(Tq, 'N·m', 3)), m('Tangential load at the rating', q(Tq * 2000 / v.d, 'N', 1))],
        'Plastics gear power rating.', 'Lewis-type bending rating.', {
          checks: [check('Wear and heat', 'verify', 'Check wear rate and running temperature with the material supplier’s data.')],
        });
    },
    "plastic-thermal-mismatch": (v) => {
      const E = v.emode === 'creep' ? v.sc / (v.ec / 100) : v.Ep, sigma = (v.am - v.ap) * 1e-6 * E * v.dT, dLrel = (v.ap - v.am) * 1e-6 * v.L * v.dT, ok = Math.abs(sigma) <= v.allow;
      return output({ E, sigma, dLrel }, 'Thermal stress in the plastic (MPa)', sigma,
        [m('Modulus used', q(E, 'MPa', 0)), m('Thermal stress', q(sigma, 'MPa', 2)), m('Nature', sigma > 0 ? 'Tension in the plastic' : sigma < 0 ? 'Compression in the plastic' : 'None'), m('Relative movement if unrestrained', q(dLrel, 'mm', 4)), m('Plastic free expansion', q(v.ap * 1e-6 * v.L * v.dT, 'mm', 4)), m('Metal free expansion', q(v.am * 1e-6 * v.L * v.dT, 'mm', 4))],
        'Plastic–metal thermal mismatch.', 'Linear elastic, uniform temperature.', {
          text: ok ? 'STRESS ACCEPTABLE' : 'STRESS TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Stress', ok ? 'pass' : 'fail', `${q(Math.abs(sigma), 'MPa', 2)} against ${q(v.allow, 'MPa', 1)}.`), check('Fixings', 'verify', `Allow about ${q(Math.abs(dLrel), 'mm', 3)} of movement with slots or flexible fixings if full restraint is not needed.`)],
        });
    },
    "set-screw-holding": (v) => {
      const Din = v.D / 25.4, din = v.d / 25.4, hp = Din * v.rpm * din ** 2.3 / 50, Tlbin = 1250 * Din * din ** 2.3, T = Tlbin * 0.112985, Fh = Tlbin / (Din / 2) * 4.448222, kW = hp * 0.745700, n = v.P > 0 ? Math.ceil(v.P / kW - 1e-9) : 0;
      return output({ hp, kW, T, Fh, n }, 'Power per set screw (kW)', kW,
        [m('Power per set screw', `${q(kW, 'kW', 3)} (${q(hp, 'hp', 2)})`), m('Torque per set screw', q(T, 'N·m', 2)), m('Holding force at the shaft surface', q(Fh, 'N', 0)), m('Set screws required', v.P > 0 ? q(n, '', 0) : 'No power entered')],
        'Set-screw holding power.', 'Empirical rule.', {
          checks: [check('Number of screws', n <= 2 ? 'pass' : 'warn', n <= 2 ? 'One or two set screws are enough.' : 'More than two set screws: use a key or a clamp collar instead.')],
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
