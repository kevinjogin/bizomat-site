// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook25). SI units are explicit at each boundary.
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
    "forming-tool-depth": (v) => {
      if (v.mode === 'flat') {
        const depth = v.D * Math.cos(rad(v.C)), Ap = deg(Math.atan(Math.tan(rad(v.A)) * Math.cos(rad(v.C))));
        return output({ depth, Ap }, 'Step depth on the tool (mm)', depth,
          [m('Step depth on the tool', q(depth, 'mm', 4)), m('Angle on the tool (plane x-x)', q(Ap, '°', 3)), m('Depth correction', q(v.D - depth, 'mm', 4))],
          'Flat forming tool dimensions.', 'Straight radial steps.');
      }
      if (v.mode === 'rake') {
        if (v.r >= v.R) return invalid('The smaller radius must be less than the larger.');
        if (v.F <= 0) return invalid('Use a rake angle above zero; for zero rake use the flat tool mode.');
        const A = 180 - v.F, sB = v.r * Math.sin(rad(A)) / v.R; if (!(sB > 0 && sB < 1)) return invalid('Use a rake angle above zero for this method.');
        const B = deg(Math.asin(sB)), Cc = 180 - (A + B), y = v.R * Math.sin(rad(Cc)) / Math.sin(rad(A)), Dt = 90 - (v.E + v.F), depth = y * Math.sin(rad(Dt));
        if (Dt <= 0) return invalid('Rake plus clearance must be less than 90°.');
        return output({ depth, y, B, Dt }, 'Step depth on the tool (mm)', depth,
          [m('Angle B', q(B, '°', 3)), m('Length y along the cutting face', q(y, 'mm', 4)), m('Tool angle D', q(Dt, '°', 2)), m('Step depth on the tool', q(depth, 'mm', 4)), m('Radial step on the work', q(v.R - v.r, 'mm', 4))],
          'Forming tool with rake and clearance.', 'Handbook construction.');
      }
      if (v.off >= v.Rt) return invalid('The face offset must be less than the tool radius.');
      const k = Math.sqrt(v.Rt * v.Rt - v.off * v.off); if (v.D >= k) return invalid('The step is too deep for this tool radius.');
      const rr = Math.sqrt((k - v.D) ** 2 + v.off * v.off);
      return output({ rr, k, step: v.Rt - rr }, 'Radius of the stepped portion (mm)', rr,
        [m('Constant √(R² − C²)', q(k, 'mm', 4)), m('Radius of the stepped portion', q(rr, 'mm', 4)), m('Diameter of the stepped portion', q(2 * rr, 'mm', 4)), m('Radial step on the tool', q(v.Rt - rr, 'mm', 4))],
        'Circular forming tool radius.', 'Cutting face below centre by the offset.');
    },
    "spade-drill-power": (v) => {
      const k = 1 + v.dull / 100, MRR = PI * v.D * v.D / 4 * v.f * v.n, kWc = v.ukw * MRR / 1000 * k, kWm = kWc / v.em, Bs = 22500 * v.ukw * v.f * v.D * k, ok = kWm <= v.avail;
      return output({ MRR, kWc, kWm, Bs }, 'Motor power (kW)', kWm,
        [m('Metal removal rate', q(MRR / 1000, 'cm³/min', 1)), m('Power at the cutter', q(kWc, 'kW', 2)), m('Power at the motor', q(kWm, 'kW', 2)), m('Thrust force', q(Bs, 'N', 0)), m('Motor utilisation', q(kWm / v.avail * 100, '%', 0))],
        'Spade drilling power and thrust.', 'Unit-power method.', {
          text: ok ? 'WITHIN MACHINE POWER' : 'EXCEEDS MACHINE POWER', tone: ok ? 'good' : 'bad',
          checks: [check('Machine power', ok ? 'pass' : 'fail', `${q(kWm, 'kW', 2)} against ${q(v.avail, 'kW', 1)}.`)],
        });
    },
    "true-stress-strain": (v) => {
      if (v.l < v.l0) return invalid('This tool is for tension: the current length must not be less than the original.');
      const Acur = v.A > 0 ? v.A : v.A0 * v.l0 / v.l, sN = v.F * 1000 / v.A0, eN = (v.l - v.l0) / v.l0, sT = v.F * 1000 / Acur, eT = Math.log(v.l / v.l0), flow = eT > 0 ? v.K * eT ** v.nexp : 0, RA = (v.A0 - Acur) / v.A0 * 100;
      return output({ sN, eN, sT, eT, flow, RA }, 'True stress (MPa)', sT,
        [m('Nominal stress', q(sN, 'MPa', 1)), m('Nominal strain', q(eN, '', 4)), m('True stress', q(sT, 'MPa', 1)), m('True strain', q(eT, '', 4)), m('Flow stress K εⁿ', q(flow, 'MPa', 1)), m('Elongation', q(eN * 100, '%', 1)), m('Reduction of area', q(RA, '%', 1))],
        'Tensile test stress and strain.', 'Uniform deformation unless areas are measured.');
    },
    "viscosity-units": (v) => {
      const toCst = { cst: v.val, cp: v.val / v.sg, sus40: v.val / 4.632, sus100: v.val / 4.664, reyn: v.val * 6.895e6 / v.sg };
      const cSt = toCst[v.unit], cP = cSt * v.sg;
      return output({ cSt, cP, sus40: cSt * 4.632, sus100: cSt * 4.664, reyn: cP / 6.895e6 }, 'Kinematic viscosity (cSt)', cSt,
        [m('Kinematic viscosity', q(cSt, 'cSt', 4)), m('Dynamic viscosity', q(cP, 'cP', 4)), m('Dynamic viscosity', q(cP / 1000, 'Pa·s', 5)), m('SUS at 40 °C basis', q(cSt * 4.632, 'SUS', 1)), m('SUS at 100 °C basis', q(cSt * 4.664, 'SUS', 1)), m('Dynamic viscosity', q(cP / 6.895e6, 'reyn', 4))],
        'Viscosity conversion.', 'Same temperature throughout.');
    },
    "buttress-thread": (v) => {
      const p = v.p, h = 0.6 * p;
      if (v.D - 1.32542 * p - v.G <= 0) return invalid('The pitch is too coarse for this diameter.');
      const vals = { H: 0.89064 * p, h, r: 0.07141 * p, s: 0.0826 * p, f: 0.14532 * p, F: 0.16316 * p, hn: 0.66271 * p, Dn: v.D + 0.12542 * p, En: v.D - h, Kn: v.D - 2 * h, Ds: v.D - v.G, Es: v.D - h - v.G, Ks: v.D - 1.32542 * p - v.G };
      return output(vals, 'Pitch diameter, internal (mm)', vals.En,
        [m('Sharp-V height H', q(vals.H, 'mm', 4)), m('Height of engagement h', q(h, 'mm', 4)), m('Root radius', q(vals.r, 'mm', 4)), m('Crest width', q(vals.F, 'mm', 4)), m('Internal major / pitch / minor', `${q(vals.Dn, '', 4)} / ${q(vals.En, '', 4)} / ${q(vals.Kn, 'mm', 4)}`), m('External major / pitch / minor', `${q(vals.Ds, '', 4)} / ${q(vals.Es, '', 4)} / ${q(vals.Ks, 'mm', 4)}`)],
        'Buttress thread basic dimensions.', 'ANSI B1.9 formulas.');
    },
    "three-wire-taper-buttress": (v) => {
      let M, E2 = null, wire = null;
      if (v.mode === 'taper') {
        const a = rad(v.ang / 2), b = Math.atan(v.tpf / 2 / 304.8), sec = 1 / Math.cos(b), k = v.P / 2 / Math.tan(a) - v.W * (1 + 1 / Math.sin(a));
        M = (v.E - k) / sec; if (v.Mm > 0) E2 = v.Mm * sec + k;
        return output({ M, sec, E2: E2 ?? 0 }, 'Measurement over wires (mm)', M,
          [m('Measurement over wires', q(M, 'mm', 4)), m('Measurement over wires', q(M / 25.4, 'in', 4)), m('Taper correction sec b', q(sec, '', 6)), m('Pitch diameter for the measured value', E2 !== null ? q(E2, 'mm', 4) : 'No measurement entered')],
          'Three-wire measurement of a taper thread.', 'Tapers up to ¾ in. per foot.');
      }
      if (v.a >= v.A) return invalid('The front face angle must be less than the included angle.');
      const A = rad(v.A), a = rad(v.a), k = v.P / (Math.tan(a) + Math.tan(A - a)) - v.W * (1 + Math.cos(A / 2 - a) / Math.sin(A / 2));
      M = v.E - k; wire = v.P * Math.cos(a) / (1 + Math.cos(A)); if (v.Mm > 0) E2 = v.Mm + k;
      return output({ M, wire, E2: E2 ?? 0 }, 'Measurement over wires (mm)', M,
        [m('Measurement over wires', q(M, 'mm', 4)), m('Wire size for pitch-line contact', q(wire, 'mm', 4)), m('Pitch diameter for the measured value', E2 !== null ? q(E2, 'mm', 4) : 'No measurement entered')],
        'Three-wire measurement of a buttress thread.', 'General buttress formula.');
    },
    "multi-start-threading": (v) => {
      const lead = v.starts * v.P, spacing = 360 / v.starts, helix = deg(Math.atan(lead / (PI * v.d2))), nMax = v.fmax / lead, ok = v.rpm <= nMax;
      return output({ lead, spacing, helix, nMax }, 'Lead (mm)', lead,
        [m('Lead (programmed feed)', q(lead, 'mm', 4)), m('Start spacing', q(spacing, '°', 2)), m('Z shift between starts', q(v.P, 'mm', 4)), m('Number of shifts', q(v.starts - 1, '', 0)), m('Helix angle at pitch diameter', q(helix, '°', 3)), m('Maximum spindle speed for the axis', q(nMax, 'rpm', 0))],
        'Multi-start threading set-up.', 'Synchronised threading cycle.', {
          text: ok ? 'SPEED WITHIN AXIS LIMIT' : 'SPEED EXCEEDS AXIS LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Axis feed', ok ? 'pass' : 'fail', `${q(v.rpm, 'rpm', 0)} against a limit of ${q(nMax, 'rpm', 0)}.`)],
        });
    },
    "shear-spinning": (v) => {
      const T = v.Tw / Math.sin(rad(v.alpha)), red = (1 - v.Tw / T) * 100, Ft = v.sf * (T - v.Tw) * v.f, vs = PI * v.Dr * v.rpm / 60000, P = Ft * vs;
      return output({ T, red, Ft, P }, 'Blank thickness (mm)', T,
        [m('Starting blank thickness', q(T, 'mm', 3)), m('Thickness reduction', q(red, '%', 1)), m('Tangential roller force', q(Ft, 'N', 0)), m('Surface speed at the roller', q(vs, 'm/s', 2)), m('Power at the roller', q(P / 1000, 'kW', 3))],
        'Shear spinning by the sine law.', 'Ideal deformation force.');
    },
    "machine-positioning-accuracy": (v) => {
      const rows = []; let hi = -Infinity, lo = Infinity, rep = 0;
      for (let t = 1; t <= v.nt; t++) {
        const xs = [1, 2, 3, 4, 5].map((r) => v[`t${t}r${r}`]), mean = xs.reduce((a, b) => a + b, 0) / 5, sd = Math.sqrt(xs.reduce((s, x) => s + (x - mean) ** 2, 0) / 4);
        hi = Math.max(hi, mean + 3 * sd); lo = Math.min(lo, mean - 3 * sd); rep = Math.max(rep, 6 * sd);
        rows.push([String(t), q(mean, 'µm', 2), q(sd, 'µm', 2), q(6 * sd, 'µm', 2)]);
      }
      const acc = hi - lo, ok = acc <= v.req, m1 = [1, 2, 3, 4, 5].reduce((s, r) => s + v[`t1r${r}`], 0) / 5;
      return output({ acc, rep, mean1: m1, sd1: Math.sqrt([1, 2, 3, 4, 5].reduce((s, r) => s + (v[`t1r${r}`] - m1) ** 2, 0) / 4) }, 'Axis accuracy (µm)', acc,
        [m('Axis accuracy (spread)', q(acc, 'µm', 2)), m('As ±', q(acc / 2, 'µm', 2)), m('Worst repeatability (6σ)', q(rep, 'µm', 2)), m('Required accuracy', q(v.req, 'µm', 1))],
        'Axis positioning accuracy.', 'Unidirectional runs, normal distribution.', {
          text: ok ? 'MEETS REQUIRED ACCURACY' : 'OUTSIDE REQUIRED ACCURACY', tone: ok ? 'good' : 'bad',
          checks: [check('Accuracy', ok ? 'pass' : 'fail', `${q(acc, 'µm', 1)} against ${q(v.req, 'µm', 1)}.`)],
          table: tbl('Target points', ['Target', 'Mean deviation', 'σ', 'Repeatability 6σ'], rows),
        });
    },
    "acme-tap-drill": (v) => {
      const p = 1 / v.tpi, min = v.cls === 'G' ? v.D - p : v.cls === 'C24' ? v.D - 0.9 * p : v.D - 0.025 * Math.sqrt(v.D) - 0.9 * p, max = min + 0.05 * p;
      if (min <= 0) return invalid('The pitch is too coarse for this diameter.');
      return output({ min, max, dmin: min - v.over, dmax: max - v.over }, 'Maximum hole diameter (in)', max,
        [m('Minimum hole diameter', `${q(min, 'in', 4)} (${q(min * 25.4, 'mm', 3)})`), m('Maximum hole diameter', `${q(max, 'in', 4)} (${q(max * 25.4, 'mm', 3)})`), m('Drill size range allowing oversize', `${q(min - v.over, '', 4)} to ${q(max - v.over, 'in', 4)}`)],
        'Acme tap drill limits.', 'Handbook formulas from ANSI/ASME B1.5.');
    },
    "milling-cutter-teeth": (v) => {
      let Tt, basis;
      if (v.mode === 'face') { Tt = 6.3 * v.D / v.W * v.zc / 2; basis = `${q(v.zc, '', 1)} teeth in the cut`; if (v.W > v.D) return invalid('The width of cut cannot exceed the cutter diameter.'); }
      else if (v.mode === 'periph') { Tt = 12.6 * v.D * Math.cos(rad(v.helix)) / (v.D + 4 * v.d) * v.zc / 2; basis = `${q(v.zc, '', 1)} teeth in the cut`; }
      else { const K = v.mat === 'entered' ? v.K : { steel: 14278, ci: 32950, al: 54930 }[v.mat]; Tt = K * v.H / (v.F * v.n * v.d * v.W); basis = 'Power available'; }
      return output({ T: Tt }, 'Number of teeth', Tt,
        [m('Recommended number of teeth', q(Tt, '', 2)), m('Basis', basis), m('Nearest whole numbers', `${Math.max(1, Math.floor(Tt))} or ${Math.ceil(Tt)}`)],
        'Milling cutter tooth count.', 'Handbook rules of thumb.');
    },
    "angular-cutter-setting": (v) => {
      const dm = (x) => { const d = Math.floor(x + 1e-12), mnt = (x - d) * 60; return `${d}° ${mnt.toFixed(1)}′`; };
      const t = rad(360 / v.Nt), D = v.B === 0 ? 90 : deg(Math.atan(Math.cos(t) / Math.tan(rad(v.B)))), sE = Math.tan(t) / Math.tan(rad(v.C)) * Math.sin(rad(D));
      if (!(sE >= 0 && sE <= 1)) return invalid('No setting angle exists for this combination of teeth, blank and cutter angles.');
      const E = deg(Math.asin(sE)), A = D - E;
      return output({ D, E, A, Atext: dm(A) }, 'Setting angle (°)', A,
        [m('Setting angle A', `${q(A, '°', 3)} (${dm(A)})`), m('Angle D', `${q(D, '°', 3)} (${dm(D)})`), m('Angle E', `${q(E, '°', 3)} (${dm(E)})`), m('Index angle between teeth', q(360 / v.Nt, '°', 3))],
        'Dividing-head setting for fluting.', 'Handbook formulas.');
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
