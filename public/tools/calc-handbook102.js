// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook102). SI units are explicit at each boundary.
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
    "ba-thread-limits": (v) => {
      const p = v.p, H = 1.13634 * p, h = 0.6 * p, r = 0.18083 * p, s = 0.26817 * p, E = v.D - h, K = v.D - 2 * h, small = v.n <= 10, close = v.cls === 'close';
      if (v.n > 16) return invalid('The BA series runs from 0 to 16 BA.');
      if (close && !small) return invalid('The close class covers 0 to 10 BA only.');
      if (!(K > 0)) return invalid('The pitch is too coarse for this diameter.');
      const al = !close && small ? 0.025 : 0, [tM, tE, tK] = close ? [0.15 * p, 0.08 * p + 0.02, 0.16 * p + 0.04] : [(small ? 0.2 : 0.25) * p, 0.1 * p + 0.025, 0.2 * p + 0.05];
      const Dmax = v.D - al, Dmin = Dmax - tM, Emax = E - al, Emin = Emax - tE, Kmax = K - al, Kmin = Kmax - tK, NE = [E, E + 0.12 * p + 0.03], NK = [K, K + 0.375 * p], r3 = (x) => q(x, 'mm', 4);
      return output({ H, h, r, s, E, K, al, Dmax, Dmin, Emax, Emin, Kmax, Kmin, NEmin: NE[0], NEmax: NE[1], NKmin: NK[0], NKmax: NK[1] }, 'Bolt effective diameter max (mm)', Emax,
        [m('Depth h / H', `${r3(h)} / ${r3(H)}`), m('Radius r / truncation s', `${r3(r)} / ${r3(s)}`), m('Basic effective / minor diameter', `${r3(E)} / ${r3(K)}`), m('Allowance', r3(al)),
          m('Bolt major max / min', `${r3(Dmax)} / ${r3(Dmin)}`), m('Bolt effective max / min', `${r3(Emax)} / ${r3(Emin)}`), m('Bolt minor max / min', `${r3(Kmax)} / ${r3(Kmin)}`),
          m('Nut effective min / max', `${r3(NE[0])} / ${r3(NE[1])}`), m('Nut minor min / max', `${r3(NK[0])} / ${r3(NK[1])}`), m('Threads per inch (approx.)', q(25.4 / p, 'TPI', 4))],
        `${v.n} BA thread, ${q(p, 'mm', 4)} pitch, ${close ? 'close' : 'normal'} class bolt.`, 'Handbook BA thread form and BS 93 tolerance formulas.', {
          checks: [check('Size pair', 'verify', 'Check that the pitch and major diameter are a pair from the BA table.'), check('Standard', 'verify', 'BS 93 is obsolescent; use ISO metric threads for new designs.')],
        });
    },
    "steel-pipe-mass": (v) => {
      if (!(2 * v.t < v.D)) return invalid('The wall is too thick for this diameter.');
      const Dr = Math.round(v.D * 10) / 10, tr = Math.round(v.t * 100) / 100, Wsi = 0.02466 * (Dr - tr) * tr, Di = Math.round(v.D / 25.4 * 1000) / 1000, ti = Math.round(v.t / 25.4 * 1000) / 1000, Win = 10.68 * (Di - ti) * ti;
      const ID = v.D - 2 * v.t, Wc = v.rho * PI * (ID / 1000) ** 2 / 4, ML = Wsi * v.L, MC = Wc * v.L;
      return output({ Wsi, Win, ID, Wc, ML, MC, full: ML + MC }, 'Plain-end mass (kg/m)', Wsi,
        [m('Plain-end mass', q(Wsi, 'kg/m', 4)), m('Plain-end weight (inch formula)', q(Win, 'lb/ft', 4)), m('Inside diameter', q(ID, 'mm', 4)), m(`Mass of ${q(v.L, 'm', 4)} of pipe`, q(ML, 'kg', 4)), ...(v.rho > 0 ? [m('Contents per metre', q(Wc, 'kg/m', 4)), m('Full pipe over the length', q(ML + MC, 'kg', 4))] : [])],
        `Steel pipe ${q(v.D, 'mm', 4)} × ${q(v.t, 'mm', 4)} wall.`, 'ANSI/ASME B36.10M plain-end mass formulas as given in the handbook.', {
          checks: [check('Material', 'verify', 'The formula is for carbon steel; stainless and alloy pipe differ slightly in density.'), check('Wall for pressure', 'verify', 'Choose the wall thickness for pressure by your piping code before weighing.')],
        });
    },
    "ductile-regime-critical-depth": (v) => {
      const dc = v.A * (v.E / v.H) * (v.Kc * 1e6 / (v.H * 1e9)) ** 2 * 1e6, ratio = v.ap / dc, ductile = v.ap <= dc * (1 + 1e-12), plough = v.re > 0 && v.ap < 0.5 * v.re, ok = ductile && !plough;
      return output({ dc, ratio }, 'Critical depth of cut dc (µm)', dc,
        [m('Critical depth of cut dc', `${q(dc, 'µm', 4)} (${q(dc * 1000, 'nm', 4)})`), m('E ÷ H', q(v.E / v.H, '', 4)), m('Planned depth ÷ dc', q(ratio, '', 4)), ...(v.re > 0 ? [m('Half the edge radius', q(v.re / 2, 'µm', 4))] : [])],
        `Ductile-regime threshold for E = ${q(v.E, 'GPa', 4)}, Kc = ${q(v.Kc, 'MPa·√m', 4)}, H = ${q(v.H, 'GPa', 4)}.`, 'Handbook ductile-regime critical depth of cut.', {
          text: ok ? 'DUCTILE-REGIME CUT' : !ductile ? 'DEPTH ABOVE THE CRITICAL DEPTH' : 'DEPTH BELOW HALF THE EDGE RADIUS', tone: ok ? 'good' : 'bad',
          checks: [check('Critical depth', ductile ? 'pass' : 'fail', `${q(v.ap, 'µm', 4)} against dc = ${q(dc, 'µm', 4)}.`), check('Edge radius', v.re > 0 ? (plough ? 'fail' : 'pass') : 'verify', v.re > 0 ? `Depth ${q(v.ap, 'µm', 4)} against half the edge radius ${q(v.re / 2, 'µm', 4)}.` : 'No edge radius entered.')],
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
