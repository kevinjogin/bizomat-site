// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook89). SI units are explicit at each boundary.
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
    "grinding-wheel-life-plan": (v) => {
      const cal = v.cal === 'yes', CU = cal ? v.VU * v.TU ** 0.26 : NaN, ratio = cal ? CU / v.CshopStd : 1, Cuse = v.C * ratio;
      const V = Cuse / v.T ** 0.26, V10 = Cuse / 10 ** 0.26, V100 = Cuse / 100 ** 0.26, SMRR = 1000 * v.ECT * V, Vw = SMRR / (1000 * v.ar);
      const rpm = 1000 * V / (PI * v.D), rpmw = 1000 * Vw / (PI * v.dw), fs = v.frac * v.width, FR = fs * rpmw, MRR = SMRR * fs, tc = v.dist / FR + v.tsp, vs = V / 60, ok = vs <= v.vmax + 1e-9;
      const vals = { Cuse, ratio, V, V10, V100, SMRR, Vw, rpm, rpmw, fs, FR, MRR, tc, vs };
      if (cal) vals.CU = CU;
      return output(vals, 'Wheel speed for the wheel life (m/min)', V,
        [m('Taylor constant used', `${q(Cuse, 'm/min', 5)}${cal ? ` (shop CU ${q(CU, 'm/min', 5)}, ratio ${q(ratio, '', 4)})` : ' (standard)'}`), m('Wheel speed for the wheel life', `${q(V, 'm/min', 5)} (${q(vs, 'm/s', 4)})`), m('V10 / V100', `${q(V10, 'm/min', 5)} / ${q(V100, 'm/min', 5)}`), m('Specific removal rate SMRR', q(SMRR, 'mm³/mm/min', 5)), m('Work speed', `${q(Vw, 'm/min', 4)} (${q(rpmw, 'rpm', 4)})`), m('Wheel speed', q(rpm, 'rpm', 5)), m('Side feed / feed rate', `${q(fs, 'mm/rev', 4)} / ${q(FR, 'mm/min', 5)}`), m('Removal rate', q(MRR, 'mm³/min', 5)), m('Time per pass', q(tc, 'min', 4))],
        'Grinding wheel life and removal rate plan.', 'Handbook grinding data machinability system (Taylor lines at constant ECT).', {
          text: ok ? 'WHEEL SPEED WITHIN THE WHEEL RATING' : 'WHEEL SPEED ABOVE THE WHEEL RATING', tone: ok ? 'good' : 'bad',
          checks: [check('Wheel rating', ok ? 'pass' : 'fail', `${q(vs, 'm/s', 4)} against ${q(v.vmax, 'm/s', 4)} marked on the wheel${ok ? '.' : ': choose a shorter wheel life only within the rating, or a wheel rated for the speed.'}`), check('Chip thickness', v.ECT >= 0.0001 ? 'pass' : 'verify', `ECT ${q(v.ECT, 'mm', 4)}${v.ECT >= 0.0001 ? '.' : ' is below 0.0001 mm, which the handbook does not recommend for steels.'}`), check('Calibration', cal ? 'pass' : 'verify', cal ? `Standard data corrected by ${q(ratio, '', 4)} from the shop result.` : 'Standard data; calibrate with one shop result when available.')],
        });
    },
    "thread-tool-relief-angles": (v) => {
      if (!(v.Kmin < v.Dmaj)) return invalid('The minor diameter must be smaller than the major diameter.');
      const psi = deg(Math.atan(v.lead / (PI * v.Kmin))), phi = deg(Math.atan(v.lead / (PI * v.Dmaj))), a = v.ae + psi, at = v.ae - phi, h = rad(v.ang / 2);
      if (!(a < 89)) return invalid('The leading side relief would reach 90°: the helix angle is too large for this effective relief.');
      const b = deg(Math.atan(Math.tan(rad(a)) * Math.cos(h))), bt = deg(Math.atan(Math.tan(rad(at)) * Math.cos(h))), n = deg(Math.atan((Math.tan(rad(a)) - Math.tan(rad(at))) / (2 * Math.tan(h))));
      const ok = at > 0;
      return output({ psi, phi, a, at, b, bt, n }, 'Relief below the leading edge b (°)', b,
        [m('Helix angle at minor / major diameter', `${q(psi, '°', 4)} / ${q(phi, '°', 4)}`), m('Side relief parallel to axis: leading / trailing', `${q(a, '°', 4)} / ${q(at, '°', 4)}`), m('Relief to grind, perpendicular to the leading edge', q(b, '°', 4)), m('Relief to grind, perpendicular to the trailing edge', q(bt, '°', 4)), m('Nose angle n', q(n, '°', 4))],
        'Thread cutting tool relief angles.', 'Handbook relief angle formulas for single-point thread cutting tools.', {
          text: ok ? 'TOOL ANGLES SET' : 'TRAILING FLANK WOULD RUB', tone: ok ? 'good' : 'bad',
          checks: [check('Trailing relief', ok ? 'pass' : 'fail', `${q(at, '°', 4)} parallel to the axis${ok ? '.' : ': increase the effective relief angle.'}`), check('Effective relief', v.ae >= 5 && v.ae <= 14 ? 'pass' : 'verify', `${q(v.ae, '°', 3)} against 8 to 14° (high-speed steel) or 5 to 10° (carbide).`)],
        });
    },
    "milling-chip-thickness-ect": (v) => {
      if (!(v.ar <= v.D + 1e-9)) return invalid('The radial depth of cut cannot exceed the cutter diameter.');
      const r = v.ar / v.D, face = v.mode === 'face';
      const AEr = Math.acos(Math.max(-1, Math.min(1, face ? 1 - 2 * r * r : 1 - 2 * r)));
      const ratioOf = (aer) => (face ? 2 * Math.sin(aer / 2) / aer : (1 - Math.cos(aer)) / aer);
      const hf = ratioOf(AEr), hm = v.fz * hf, ECT = v.fz * v.z / PI * r * v.aaCEL;
      const refR = face ? 0.7355 : 1, refAE = Math.acos(face ? 1 - 2 * refR * refR : 1 - 2 * refR), feedRatio = ratioOf(refAE) / hf, fzNeed = v.hTarget / hf, vf = fzNeed * v.z * v.n, ok = hm >= v.hMin - 1e-12;
      return output({ AE: deg(AEr), hf, hm, ECT, feedRatio, fzNeed, vf }, 'Mean chip thickness hm (mm)', hm,
        [m('Angle of engagement AE', q(deg(AEr), '°', 5)), m('hm ÷ fz', q(hf, '', 4)), m('Mean chip thickness hm', q(hm, 'mm', 4)), m('Equivalent chip thickness ECT', q(ECT, 'mm', 4)), m('Feed per tooth for the chip wanted', `${q(fzNeed, 'mm', 4)} (${q(feedRatio, '', 4)} × the reference feed)`), m('Feed rate at that feed', q(vf, 'mm/min', 5))],
        'Milling chip thickness and equivalent chip thickness.', 'Handbook chip geometry for end and face milling.', {
          text: ok ? 'CHIP THICK ENOUGH' : 'RAISE THE FEED PER TOOTH', tone: ok ? 'good' : 'bad',
          checks: [check('Mean chip thickness', ok ? 'pass' : 'fail', `${q(hm, 'mm', 4)} against ${q(v.hMin, 'mm', 4)} least accepted${ok ? '.' : `: about ${q(v.hMin / hf, 'mm', 4)} per tooth reaches it.`}`), check('Cutter limits', 'verify', 'Check the raised feed per tooth against the cutter maker’s maximum and the machine’s feed rate.')],
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
