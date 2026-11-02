// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook103). SI units are explicit at each boundary.
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
    "planetary-arrangement-ratio": (v) => {
      const { A, B, C, x, y, z, S } = v, k = Number(v.fig), cosE = Math.cos(rad(v.E));
      const r = { 1: ['F', 1 + C / B], 2: ['F', 1 - C / B], 3: ['F', C / B], 4: ['F', cosE + C / B], 5: ['F', 1 + x * C / (y * B)], 6: ['F', 1 + y * C / (x * B)], 7: ['D', 1 + x * C / (y * A)], 8: ['D', 1 + y * C / (x * A)],
        9: ['F', 1 + C / B], 10: ['D', 1 + C / A], 11: ['D', 1 + C / A], 12: ['F', 1 + C / B], 13: ['F', 1 - C * x / (y * B)], 14: ['D', (1 + C / A) / (1 - C * x / (y * B))], 15: ['D', (1 + C / A) / (1 - C * y / (x * B))],
        16: ['D', 1 - C * x / (y * A)], 17: ['F', 1 - C * x / (y * B)], 18: ['D', 1 - C * x / (y * A)], 19: ['F', 1 + z * (1 - S) / B], 20: ['D', (A + z) / (A + S * z)], 21: ['D', (A + z) / (A + S * z)], 22: ['F', 1 + z * (1 - S) / B],
        23: ['D', 1 + C / A], 24: ['D', (1 + C / A) / (1 - C * y / (x * B))] }[k];
      if (!r || !Number.isFinite(r[1])) return invalid('The gear sizes make the formula divide by zero; check the sizes for this figure.');
      const [kind, val] = r;
      if (Math.abs(val) < 1e-12) return invalid(kind === 'F' ? 'The follower does not turn (F = 0) with these sizes.' : 'D = 0: the driver cannot turn with these sizes.');
      const F = kind === 'F' ? val : 1 / val, D = 1 / F, nf = F * v.n, dir = F > 0 ? 'same direction as the driver' : 'opposite direction to the driver';
      return output({ F, D, nf }, 'Follower turns per driver turn F', F,
        [m('Formula of the figure gives', `${kind} = ${q(val, '', 6)}`), m('Follower turns per driver turn F', q(F, '', 6)), m('Driver turns per follower turn D', q(D, '', 6)), m('Follower speed', `${q(nf, 'rpm', 5)} (${dir})`)],
        `Planetary arrangement of Fig. ${k} in the handbook.`, 'Handbook ratios of planetary or epicyclic gearing.', {
          checks: [check('Arrangement', 'verify', `Check that the driver, follower and fixed member are as in Fig. ${k}.`), check('Direction', F > 0 ? 'pass' : 'warn', `The follower turns in the ${dir}.`)],
        });
    },
    "microdroplet-adhesion-check": (v) => {
      const d = v.Dd * 1e-6, mass = v.rho * PI * d ** 3 / 6, Dt = v.Dt / 1000, Vc = PI * Dt * v.n / 60, cent = 2 * mass * Vc * Vc / Dt, adh = v.P * 1e-6 * (1 + Math.cos(rad(v.theta))) * v.sig;
      if (!(adh > 0)) return invalid('With a contact angle of 180° there is no adhesion.');
      const ok = cent <= adh, Vmax = Math.sqrt(adh * Dt / (2 * mass)), nmax = 60 * Vmax / (PI * Dt), ratio = cent > 0 ? adh / cent : Infinity;
      return output({ mass, Vc, cent, adh, ratio: Number.isFinite(ratio) ? ratio : 0, Vmax, nmax }, 'Highest spindle speed for adhesion (rpm)', nmax,
        [m('Droplet mass', q(mass, 'kg', 4)), m('Tool surface speed', `${q(Vc, 'm/s', 4)} (${q(Vc * 60, 'm/min', 4)})`), m('Centrifugal term 2mVc² ÷ Dt', q(cent, 'N', 4)), m('Adhesion term P(1 + cos θ)σL', q(adh, 'N', 4)),
          m('Adhesion ÷ centrifugal', Number.isFinite(ratio) ? q(ratio, '', 4) : 'no centrifugal force'), m('Highest speed for adhesion', `${q(nmax, 'rpm', 4)} (${q(Vmax * 60, 'm/min', 4)})`)],
        `${q(v.Dd, 'µm', 4)} droplet on a ${q(v.Dt, 'mm', 4)} tool at ${q(v.n, 'rpm', 4)}.`, 'Handbook micro-droplet force balance, Equation (18b).', {
          text: ok ? 'DROPLET ADHERES' : 'DROPLET THROWN OFF', tone: ok ? 'good' : 'bad',
          checks: [check('Force balance', ok ? 'pass' : 'fail', `Centrifugal ${q(cent, 'N', 4)} against adhesion ${q(adh, 'N', 4)}.`), check('Reaching the tool', 'verify', 'The droplet must also cross the boundary air layer around the tool.')],
        });
    },
    "force-ratio-tool-life": (v) => {
      const r = v.mode === 'forces' ? v.FH / v.FC : v.r, T = (r / v.a) ** v.k, rT = v.Tt > 0 ? v.a * v.Tt ** (1 / v.k) : 0, ok = v.Tt <= 0 || T >= v.Tt * (1 - 1e-12);
      return output({ r, T, rT }, 'Tool life T (min)', T,
        [m('Force ratio FH ÷ FC', q(r, '', 4)), m('Tool life T', q(T, 'min', 4)), ...(v.Tt > 0 ? [m(`Force ratio for ${q(v.Tt, 'min', 4)} life`, q(rT, '', 4))] : []), m('Constants a / LF ÷ L', `${q(v.a, '', 4)} / ${q(v.k, '', 4)}`)],
        `Colding force-ratio tool life with a = ${q(v.a, '', 4)} and LF/L = ${q(v.k, '', 4)}.`, 'Handbook machining econometrics force-ratio relation.', {
          ...(v.Tt > 0 ? { text: ok ? 'TOOL LIFE MEETS THE TARGET' : 'TOOL LIFE BELOW THE TARGET', tone: ok ? 'good' : 'bad' } : {}),
          checks: [check('Target life', v.Tt > 0 ? (ok ? 'pass' : 'fail') : 'verify', v.Tt > 0 ? `${q(T, 'min', 4)} against ${q(v.Tt, 'min', 4)}.` : 'No target entered.'), check('Constants', 'verify', 'a and LF ÷ L must come from tests on your tool and material.')],
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
