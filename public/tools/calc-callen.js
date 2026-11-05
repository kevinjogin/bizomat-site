// BIZOMAT MAKEOS thermodynamics calculation from Callen, Thermodynamics and an Introduction to Thermostatistics (batch callen). SI units are explicit at each boundary.
// Methods are standard thermodynamic relations; no text, worked examples, problems or tables from the book are reproduced.
// Material properties, ratings, factors and limits are always entered by the user.
(() => {
  const ZERO_C = 273.15; // K at 0 °C
  const kelvin = (celsius) => celsius + ZERO_C;
  const q = (value, unit, digits = 4) => {
    if (value === 0) value = 0; // no negative zero
    const formatted = value !== 0 && Math.abs(value) < 10 ** -digits
      ? fmtPrimary('engineering', value) : num(value, digits);
    return `${formatted}${unit ? ` ${unit}` : ''}`;
  };
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
      return invalid('The calculation is outside the supported numeric range. Review the temperatures and units.');
    }
    const { checks = [], actions = [], ...rest } = extra;
    return result('CALCULATED', 'warn', summary, metrics, limit, {
      primary: primary(label, value, 'engineering'), values,
      checks: [...checks, check('Model and application', 'verify', limit)],
      actions: [...actions, 'Check the method, input sources and limitations below before using this result.'],
      ...rest,
    });
  }
  /** Temperature in kelvin from °C, or null when it is at or below absolute zero. */
  const abs = (celsius) => (kelvin(celsius) > 0 ? kelvin(celsius) : null);
  const methods = {
    "liquid-throttling-temperature-rise": (v) => {
      const T = abs(v.T);
      if (!T) return invalid('The temperature must be above absolute zero (−273.15 °C).');
      const vol = 1 / v.rho, b = v.beta * 1e-6, cp = v.cp * 1000, dp = v.dp * 1e5;
      // Constant enthalpy: dT = (v ÷ cp)(T β − 1) dP (Callen eq. 6.41); a pressure drop Δp gives the rise below.
      const dT = vol * (1 - T * b) * dp / cp, dTsimple = vol * dp / cp, work = vol * dp / 1000, share = 100 * T * b, Tout = v.T + dT;
      const ok = dT <= v.limit + 1e-9, warms = dT > 0;
      return output({ dT, dTsimple, work, share, Tout }, 'Throttling temperature rise (K)', dT,
        [m('Temperature rise across the restriction', q(dT, 'K', 3)), m('Temperature after the restriction', q(Tout, '°C', 2)), m('Pressure energy turned to heat', q(work, 'kJ/kg', 3)),
          m('Simple estimate ignoring expansion', q(dTsimple, 'K', 3)), m('Share removed by the expansion term (T β)', q(share, '%', 1))],
        'Liquid throttled at constant enthalpy.', 'Properties at the inlet; constant enthalpy; no heat loss; the liquid stays liquid.', {
          text: ok ? 'VALVE HEATING WITHIN LIMIT' : 'VALVE HEATING ABOVE LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Throttling heating', ok ? 'pass' : 'fail', `${q(dT, 'K', 2)} against your ${q(v.limit, 'K', 1)}${ok ? '.' : ': reduce the pressure dropped across the valve without doing work, or cool the flow.'}`),
            check('Expansion term', warms ? 'pass' : 'warn', warms ? `Thermal expansion lowers the rise by ${q(share, '%', 1)} against the simple estimate.` : 'T β is 1 or more, so this liquid cools on throttling; check the properties entered.'),
            check('Vapour pressure', 'verify', 'The outlet pressure must stay above the liquid’s vapour pressure at the outlet temperature, or it flashes or cavitates.')],
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
