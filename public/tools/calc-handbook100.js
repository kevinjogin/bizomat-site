// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook100). SI units are explicit at each boundary.
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
    "cutting-speed-table-adjustment": (v) => {
      const interp = v.op === 'side' || v.op === 'slit2', fmax = v.kmax * v.fopt, fmin = v.kmin * v.fopt;
      if (interp && !(fmax > fmin)) return invalid('The maximum feed factor must be larger than the minimum feed factor.');
      const Ff = interp ? v.Ff2 + (v.f - fmin) / (fmax - fmin) * (v.Ff1 - v.Ff2) : v.Ff, inRange = !interp || (v.f >= fmin - 1e-12 && v.f <= fmax + 1e-12);
      const V = v.Vopt * Ff * ({ face: v.Fd * v.Far, slit1: v.Far, slit2: 1 }[v.op] ?? v.Fd), n = 1000 * V / (PI * v.D), vf = v.f * v.z * n;
      if (!(V > 0)) return invalid('The factors give no cutting speed; check Ff1, Ff2 and the feed.');
      return output({ fr: v.f / v.fopt, vr: v.Vavg / v.Vopt, fmax, fmin, Ff, fRatioMax: v.f / fmax, V, n, vf }, 'Adjusted cutting speed V (m/min)', V,
        [m('Feed ratio f ÷ fopt', q(v.f / v.fopt, '', 4)), m('Speed ratio Vavg ÷ Vopt', q(v.Vavg / v.Vopt, '', 4)), ...(interp ? [m('Feed range fmin to fmax', `${q(fmin, 'mm', 4)} to ${q(fmax, 'mm', 4)}`), m('Interpolated feed factor Ff', q(Ff, '', 4)), m('Feed ratio for Fd, f ÷ fmax', q(v.f / fmax, '', 4))] : []),
          m('Adjusted cutting speed', `${q(V, 'm/min', 4)} (${q(V / 0.3048, 'ft/min', 4)})`), m('Spindle speed', q(n, 'rpm', 4)), m('Feed rate', q(vf, 'mm/min', 4))],
        `Adjusted cutting speed for ${{ turn: 'turning', hss: 'HSS turning', face: 'face milling', slot: 'full slot milling', side: 'end or side milling', slit1: 'slit milling fed into the work', slit2: 'slit or side milling', drill: 'drilling or reaming' }[v.op]}.`, 'Handbook speed table adjustment method.', {
          ...(interp ? { text: inRange ? 'FEED IN THE RECOMMENDED RANGE' : 'FEED OUTSIDE THE RECOMMENDED RANGE', tone: inRange ? 'good' : 'bad' } : {}),
          checks: [check('Feed range', interp ? (inRange ? 'pass' : 'fail') : 'verify', interp ? `${q(v.f, 'mm', 4)} against ${q(fmin, 'mm', 4)} to ${q(fmax, 'mm', 4)}.` : 'Read Ff at the feed ratio and speed ratio shown.'), check('Table speeds', v.Vavg >= v.Vopt ? 'pass' : 'verify', v.Vavg >= v.Vopt ? 'Vopt is the lower table speed, as the method requires.' : 'Vopt should be the lower of the two table speeds.')],
        });
    },
    "grinding-force-and-power": (v) => {
      const A = v.ECT * v.CEL, Fc = v.Kc * A, FH = v.ratio * Fc, Tq = Fc * v.Dw / 2000, P = Fc * v.V / 60000, ok = v.Pav <= 0 || P <= v.Pav + 1e-12;
      return output({ A, Fc, FH, Tq, P }, 'Tangential grinding force Fc (N)', Fc,
        [m('Chip area ECT × CEL', q(A, 'mm²', 4)), m('Tangential force Fc', q(Fc, 'N', 4)), m('Normal force FH', q(FH, 'N', 4)), m('Wheel torque', q(Tq, 'N·m', 4)), m('Power at the wheel', q(P, 'kW', 4))],
        `Grinding force at ECT ${q(v.ECT, 'mm', 4)} over ${q(v.CEL, 'mm', 4)}.`, 'Handbook grinding force relations.', {
          ...(v.Pav > 0 ? { text: ok ? 'WITHIN THE SPINDLE POWER' : 'OVER THE SPINDLE POWER', tone: ok ? 'good' : 'bad' } : {}),
          checks: [check('Spindle power', v.Pav > 0 ? (ok ? 'pass' : 'fail') : 'verify', v.Pav > 0 ? `${q(P, 'kW', 4)} needed against ${q(v.Pav, 'kW', 4)} available.` : 'No spindle power entered.'), check('Force data', 'verify', 'Kc and FH ÷ FC are for the work material, wheel and ECT you entered them for.')],
        });
    },
    "grinding-economic-wheel-life": (v) => {
      const CE = v.Cw + v.Cd, TV = v.TRPL + 60 * CE / v.HR, TE = 3 * TV, V = v.C / TE ** 0.26, SMRR = 1000 * v.ECT * V, Vw = SMRR / (1000 * v.ar);
      return output({ CE, TV, TE, V, SMRR, Vw }, 'Economic wheel life TE (min)', TE,
        [m('Cost per dressing CE', q(CE, 'dollars', 4)), m('Equivalent tooling-cost time TV', q(TV, 'min', 4)), m('Economic wheel life TE = 3 TV', q(TE, 'min', 4)), m('Wheel speed at TE', q(V, 'm/min', 4)), m('Specific removal rate SMRR', q(SMRR, 'mm³/mm/min', 4)), m('Work speed Vw', q(Vw, 'm/min', 4))],
        `Economic wheel life for a ${q(v.HR, 'dollars per hour', 4)} rate.`, 'Handbook grinding economic life and Taylor line relations.', {
          checks: [check('Wheel speed', 'verify', `Check ${q(V, 'm/min', 4)} against the maximum operating speed marked on the wheel.`), check('Tooling-cost time', TV >= 2 && TV <= 5 ? 'pass' : 'verify', `TV = ${q(TV, 'min', 4)}; the handbook gives 2 to 5 minutes as usual for conventional grinders.`)],
        });
    },
    "bolt-torque-thread-friction": (v) => {
      const l = v.starts * v.P, dp = v.d - 0.6495 * v.P, dm = v.d - 1.299 * v.P;
      if (!(dm > 0)) return invalid('The pitch is too coarse for this diameter.');
      const As = PI / 4 * ((dp + dm) / 2) ** 2, PB = v.pre === 'pct' ? v.pct / 100 * v.Sut * As : v.PB * 1000, b = v.b > 0 ? v.b : 1.5 * v.d;
      if (b <= v.d) return invalid('The bearing face diameter must be larger than the bolt diameter.');
      const T1 = PB * l / (2 * PI), T2 = PB * dp * v.mu1 / (2 * Math.cos(rad(v.alpha))), T3 = PB * (v.d + b) * v.mu2 / 4, T22 = T1 + T2 + T3;
      const T23 = PB * (0.159 * l + v.d * (0.531 * v.mu1 + 0.625 * v.mu2)), T24 = PB * (0.159 * l + 1.156 * ((v.mu1 + v.mu2) / 2) * v.d);
      return output({ As, PB, T1, T2, T3, T22, T23, T24, share: T1 / T22 * 100 }, 'Tightening torque by Equation (22) (N·m)', T22 / 1000,
        [m('Stress area As (Equation 9)', q(As, 'mm²', 4)), m('Preload PB', q(PB / 1000, 'kN', 4)), m('Torque to stretch the bolt T1', q(T1 / 1000, 'N·m', 4)), m('Thread friction torque T2', q(T2 / 1000, 'N·m', 4)), m('Bearing friction torque T3', q(T3 / 1000, 'N·m', 4)),
          m('Total torque, Equation (22)', q(T22 / 1000, 'N·m', 4)), m('Equation (23), 60° thread, b = 1.5 d', q(T23 / 1000, 'N·m', 4)), m(`Equation (24) with μ = ${q((v.mu1 + v.mu2) / 2, '', 4)}`, q(T24 / 1000, 'N·m', 4)), m('Share of the torque that stretches the bolt', q(T1 / T22 * 100, '%', 4))],
        `Tightening torque for a ${q(v.d, 'mm', 4)} × ${q(v.P, 'mm', 4)} thread.`, 'Handbook torque and tension Equations (9) and (21) to (24).', {
          checks: [check('Friction coefficients', v.mu1 === v.mu2 ? 'verify' : 'pass', v.mu1 === v.mu2 ? 'Equal coefficients assumed; the handbook notes this is not necessarily so.' : 'Separate thread and bearing coefficients used.'), check('Simplified forms', v.alpha === 30 && v.b === 0 ? 'pass' : 'verify', v.alpha === 30 && v.b === 0 ? 'Equations (23) and (24) apply: 60° thread with no loose washer.' : 'Equations (23) and (24) assume a 60° thread and b = 1.5 d; Equation (22) uses your values.')],
        });
    },
    "power-thread-basic-sizes": (v) => {
      const [hk, ek, kk, Fk, Gk] = { sq: [0.5, 0.5, 1, 0.5, 0.5], ms: [0.5, 0.5, 1, 0.4563, 0.4563], st: [0.433, 0.433, 0.866, 0.25, 0.227] }[v.form];
      const h = hk * v.p, E = v.D - ek * v.p, K = v.D - kk * v.p, F = Fk * v.p, G = v.form === 'ms' ? Gk * v.p - 0.17 * v.C : Gk * v.p, t = 0.5 * v.p, hc = h + v.C;
      if (!(K > 0)) return invalid('The pitch is too coarse for this diameter.');
      if (!(G > 0)) return invalid('The clearance leaves no flat at the root.');
      const lead = v.starts * v.p, la = deg(Math.atan(lead / (PI * E))), stubOK = v.form !== 'st' || v.C >= 0.02 * v.p - 1e-12;
      return output({ h, E, K, F, G, t, hc, lead, la }, 'Basic pitch diameter E (mm)', E,
        [m('Basic pitch diameter E', q(E, 'mm', 4)), m('Basic minor diameter K', q(K, 'mm', 4)), m('Basic depth h / with clearance', `${q(h, 'mm', 4)} / ${q(hc, 'mm', 4)}`), m('Thread thickness at the pitch line t', q(t, 'mm', 4)),
          m(v.form === 'sq' ? 'Width of groove and thread' : 'Crest flat F / root flat G', v.form === 'sq' ? q(0.5 * v.p, 'mm', 4) : `${q(F, 'mm', 4)} / ${q(G, 'mm', 4)}`), m('Lead / lead angle at E', `${q(lead, 'mm', 4)} / ${q(la, '°', 4)}`)],
        `${{ sq: 'Square', ms: '10° modified square', st: '60° stub' }[v.form]} thread, ${q(v.D, 'mm', 4)} × ${q(v.p, 'mm', 4)} pitch.`, 'Handbook basic dimensions of alternative power threads.', {
          checks: [check('Clearance', stubOK ? 'pass' : 'fail', v.form === 'st' ? `${q(v.C, 'mm', 4)} against at least 0.02p = ${q(0.02 * v.p, 'mm', 4)}.` : 'Add a clearance to the depth so the screw root clears the nut crest.'), check('Tolerances', 'verify', 'These are basic sizes; add the allowances and tolerances of your fit.')],
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
