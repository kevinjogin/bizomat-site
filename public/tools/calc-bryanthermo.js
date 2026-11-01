// KEVOS® MAKEOS calculations for the thermodynamics first-principles tools (batch bryanthermo). SI units are explicit at each boundary.
// Methods follow Bryan’s Thermodynamics (1907) and standard engineering relations; no source tables, ratings or recommended settings are reproduced.
// Material properties, ratings, factors and limits are always entered by the user.
(() => {
  const ABS = 273.15; // °C to K
  const RBAR = 8.314462618; // universal gas constant, kJ/(kmol·K)
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
      return invalid('The calculation is outside the supported numeric range. Review the values and units.');
    }
    const { checks = [], actions = [], ...rest } = extra;
    return result('CALCULATED', 'warn', summary, metrics, limit, {
      primary: primary(label, value, 'engineering'), values,
      checks: [...checks, check('Model and application', 'verify', limit)],
      actions: [...actions, 'Check the method, input sources and limitations below before using this result.'],
      ...rest,
    });
  }
  const methods = {
    "liquid-adiabatic-compression": (v) => {
      const T1 = v.T + ABS;
      if (T1 <= 0) return invalid('The liquid temperature must be above absolute zero (−273.15 °C).');
      const a = v.alpha * 1e-6, cp = v.cp * 1000, KT = v.KT * 1e6, dp = v.dp * 1e6, x = a * dp / (v.rho * cp);
      const T2 = T1 * Math.exp(x), dT = T2 - T1, dTlin = T1 * x, dcv = T1 * a * a * KT / v.rho, cv = cp - dcv;
      if (cv <= 0) return invalid('These properties give no positive specific heat at constant volume: check the expansion coefficient, bulk modulus and specific heat.');
      const g = cp / cv, Ks = g * v.KT, aS = Math.sqrt(Ks * 1e6 / v.rho), aT = Math.sqrt(KT / v.rho), Tend = T2 - ABS, ok = Tend <= v.Tmax + 1e-9;
      return output({ T2, dT, dTlin, dcv, cv, g, Ks, aS, aT, Tend }, 'Temperature rise (K)', dT,
        [m('Temperature rise / final temperature', `${q(dT, 'K', 3)} / ${q(Tend, '°C', 2)}`), m('Small-change estimate T α Δp ÷ (ρ c_p)', q(dTlin, 'K', 3)), m('c_p − c_v / c_v', `${q(dcv / 1000, '', 4)} / ${q(cv / 1000, 'kJ/(kg·K)', 4)}`), m('Ratio of specific heats γ', q(g, '', 4)), m('Bulk modulus: isothermal / adiabatic', `${q(v.KT, '', 0)} / ${q(Ks, 'MPa', 0)}`), m('Wave speed in the free liquid: adiabatic / isothermal', `${q(aS, '', 0)} / ${q(aT, 'm/s', 0)}`)],
        'Liquid adiabatic compression.', 'Constant properties; rapid compression with no heat exchange; free liquid.', {
          text: ok ? 'TEMPERATURE RISE WITHIN LIMIT' : 'TEMPERATURE LIMIT EXCEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Final temperature', ok ? 'pass' : 'fail', `${q(Tend, '°C', 2)} against your limit of ${q(v.Tmax, '°C', 1)}.`), check('Bulk modulus basis', 'verify', `Rapid pressure changes see the adiabatic modulus, ${q((g - 1) * 100, '%', 1)} above the isothermal one; air, hoses and pipe walls lower both in a real circuit.`)],
        });
    },
    "gas-mixture-properties": (v) => {
      const y3 = 100 - v.y1 - v.y2;
      if (y3 < -1e-9) return invalid('The mole fractions of gas 1 and gas 2 add up to more than 100 %.');
      const T = v.T + ABS;
      if (T <= 0) return invalid('The temperature must be above absolute zero (−273.15 °C).');
      const y = [v.y1 / 100, v.y2 / 100, Math.max(0, y3) / 100], M = [v.M1, v.M2, v.M3], cpi = [v.cp1, v.cp2, v.cp3];
      const Mm = y.reduce((s, yi, i) => s + yi * M[i], 0), x = y.map((yi, i) => yi * M[i] / Mm), R = RBAR / Mm;
      const cp = x.reduce((s, xi, i) => s + xi * cpi[i], 0), cv = cp - R;
      if (cv <= 0) return invalid('The specific heats entered are smaller than the gas constant: c_p must exceed R for every perfect gas.');
      const g = cp / cv, rho = v.p / (R * T), a = Math.sqrt(g * R * 1000 * T), pp = y.map((yi) => yi * v.p);
      const ds = R * y.reduce((s, yi) => s - (yi > 0 ? yi * Math.log(yi) : 0), 0), W = T * ds;
      const pc = pp[Number(v.comp) - 1], isMax = v.kind === 'max', ok = isMax ? pc <= v.lim + 1e-9 : pc >= v.lim - 1e-9;
      const rows = [0, 1, 2].map((i) => [`Gas ${i + 1}`, q(y[i] * 100, '%', 3), q(x[i] * 100, '%', 3), q(pp[i], 'kPa', 3)]);
      return output({ y3, Mm, R, cp, cv, g, rho, a, ds, W, pc, x1: x[0], x2: x[1], x3: x[2] }, 'Ratio of specific heats γ', g,
        [m('Molar mass of the mixture', q(Mm, 'kg/kmol', 3)), m('Gas constant', q(R, 'kJ/(kg·K)', 5)), m('c_p / c_v', `${q(cp, '', 4)} / ${q(cv, 'kJ/(kg·K)', 4)}`), m('Ratio of specific heats γ', q(g, '', 4)), m('Density / speed of sound', `${q(rho, 'kg/m³', 4)} / ${q(a, 'm/s', 1)}`), m(`Partial pressure of gas ${v.comp}`, q(pc, 'kPa', 3)), m('Entropy of mixing / least separation work', `${q(ds, 'kJ/(kg·K)', 5)} / ${q(W, 'kJ/kg', 2)}`)],
        'Gas mixture properties.', 'Perfect gases with constant specific heats; Dalton’s law.', {
          text: ok ? 'PARTIAL PRESSURE WITHIN LIMIT' : 'PARTIAL PRESSURE OUTSIDE LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check(`Partial pressure of gas ${v.comp}`, ok ? 'pass' : 'fail', `${q(pc, 'kPa', 3)} against your ${isMax ? 'maximum' : 'minimum'} of ${q(v.lim, 'kPa', 3)}.`), check('Perfect-gas behaviour', 'verify', 'At high pressure, low temperature or near the dew point of a component, use real-gas data.')],
          table: tbl('Composition and partial pressures', ['Gas', 'Mole fraction', 'Mass fraction', 'Partial pressure'], rows),
        });
    },
    "thermoelectric-cooler-check": (v) => {
      const Thr = v.Thr + ABS, Th = v.Th + ABS, Tc = v.Tc + ABS;
      if (Thr <= v.dTmax) return invalid('The rated hot-side temperature must exceed the maximum temperature difference in kelvin.');
      if (Tc <= 0) return invalid('The cold side must be above absolute zero (−273.15 °C).');
      if (Tc > Th) return invalid('The cold side must not be warmer than the hot side.');
      const S = v.Vmax / Thr, R = (Thr - v.dTmax) * v.Vmax / (Thr * v.Imax), K = (Thr - v.dTmax) * v.Vmax * v.Imax / (2 * Thr * v.dTmax);
      const dT = Th - Tc, I = v.I, Qc = S * I * Tc - 0.5 * I * I * R - K * dT, P = S * I * dT + I * I * R, V = S * dT + I * R, Qh = Qc + P;
      const Iopt = S * Tc / R, QcMax = S * Iopt * Tc - 0.5 * Iopt * Iopt * R - K * dT, Qct = v.n * Qc, Pt = v.n * P, Qht = v.n * Qh, cop = P > 0 ? Qc / P : 0;
      const okI = I <= v.Imax + 1e-9, okV = V <= v.Vmax + 1e-9, cools = Qc > 1e-9, okQ = cools && Qct >= v.Qreq - 1e-9, ok = okQ && okI && okV;
      const text = !cools ? 'NO NET COOLING AT THIS TEMPERATURE DIFFERENCE' : ok ? 'MODULES PUMP THE HEAT LOAD' : okQ ? 'OUTSIDE THE MODULE RATINGS' : 'MODULES TOO SMALL FOR THE LOAD';
      return output({ S, R, K, dT, Qc, P, V, Qh, Iopt, QcMax, Qct, Pt, Qht, cop }, 'Heat pumped by all modules (W)', Qct,
        [m('Module constants S / R / K', `${q(S * 1000, 'mV/K', 3)} / ${q(R, 'Ω', 4)} / ${q(K, 'W/K', 4)}`), m('Heat pumped per module / all modules', `${q(Qc, '', 2)} / ${q(Qct, 'W', 2)}`), m('Voltage / power per module', `${q(V, 'V', 3)} / ${q(P, 'W', 2)}`), m('COP', q(cop, '', 3)), m('Hot-side heat to reject (all modules)', q(Qht, 'W', 2)), m('Current for the most heat pumped / heat at that current', `${q(Iopt, 'A', 3)} / ${q(QcMax, 'W', 2)} per module`)],
        'Thermoelectric cooler check.', 'Ideal module model with constant S, R and K fitted at the rated point.', {
          text, tone: ok ? 'good' : 'bad',
          checks: [check('Heat pumped against the load', okQ ? 'pass' : 'fail', cools ? `${q(Qct, 'W', 2)} against ${q(v.Qreq, 'W', 2)} needed.` : 'The modules pump no heat at this current and temperature difference: lower the hot side, raise the cold side or change the current.'), check('Current rating', okI ? 'pass' : 'fail', `${q(I, 'A', 3)} against ${q(v.Imax, 'A', 3)} maximum.`), check('Voltage rating', okV ? 'pass' : 'fail', `${q(V, 'V', 3)} against ${q(v.Vmax, 'V', 3)} maximum.`), check('Hot-side heat sink', 'verify', `The heat sink must reject ${q(Qht, 'W', 1)} while holding the hot side at ${q(v.Th, '°C', 1)}.`)],
        });
    },
    "heat-engine-carnot-limit": (v) => {
      const Th = v.Th + ABS, Tc = v.Tc + ABS;
      if (Tc <= 0) return invalid('The cold sink must be above absolute zero (−273.15 °C).');
      if (Th <= Tc) return invalid('The hot source must be hotter than the cold sink.');
      const etaC = 1 - Tc / Th, eta = v.eff / 100, eta2 = eta / etaC * 100, Wmax = v.Q * etaC, QrMin = v.Q * Tc / Th;
      const W = v.Q * eta, Qr = v.Q - W, Sgen = Qr / Tc - v.Q / Th, lost = Tc * Sgen;
      const possible = eta <= etaC + 1e-12, credible = eta2 <= v.cred + 1e-9;
      const text = !possible ? 'IMPOSSIBLE: ABOVE THE CARNOT LIMIT' : credible ? 'INSIDE THE CARNOT LIMIT' : 'INSIDE THE LIMIT: ASK FOR TEST EVIDENCE';
      return output({ etaC: etaC * 100, eta2, Wmax, QrMin, W, Qr, Sgen, lost }, 'Carnot efficiency (%)', etaC * 100,
        [m('Carnot efficiency 1 − T_C ÷ T_H', q(etaC * 100, '%', 2)), m('Second-law efficiency of the stated figure', q(eta2, '%', 2)), m('Most work / least heat rejected', `${q(Wmax, '', 2)} / ${q(QrMin, 'kW', 2)}`), m('Work / heat rejected at the stated efficiency', `${q(W, '', 2)} / ${q(Qr, 'kW', 2)}`), m('Entropy generated / work lost', `${q(Sgen, 'kW/K', 4)} / ${q(lost, 'kW', 2)}`)],
        'Heat engine Carnot limit.', 'Reversible engine between two reservoirs at fixed temperatures.', {
          text, tone: !possible ? 'bad' : credible ? 'good' : 'warn',
          checks: [check('Stated efficiency against the Carnot limit', possible ? 'pass' : 'fail', `${q(v.eff, '%', 2)} against a limit of ${q(etaC * 100, '%', 2)}.`), check('Second-law efficiency', credible ? 'pass' : 'verify', `${q(eta2, '%', 2)} against your threshold of ${q(v.cred, '%', 1)} for accepting a figure without test evidence.`), check('Reservoir temperatures', 'verify', 'Use the temperatures at which the engine actually takes in and rejects heat; a source that cools as it gives up heat gives a lower limit.')],
        });
    },
    "chilling-least-work-check": (v) => {
      const T1 = v.T1 + ABS, T2 = v.T2 + ABS, T0 = v.T0 + ABS;
      if (T2 <= 0) return invalid('The final temperature must be above absolute zero (−273.15 °C).');
      if (T2 >= T1) return invalid('The final temperature must be below the start temperature.');
      if (T2 >= T0) return invalid('The final temperature must be below the surroundings: cooling that ends above them needs no work in principle.');
      const C = v.mdot * v.cp, Ts = Math.min(T1, T0), Q = C * (T1 - T2), Qa = C * (T1 - Ts), W = C * (T0 * Math.log(Ts / T2) - (Ts - T2));
      const copId = Q / W, cop = Q / v.P, eta2 = W / v.P * 100, lost = v.P - W;
      const Eq = Q * v.hours, Ew = W * v.hours, Ep = v.P * v.hours;
      const possible = v.P >= W - 1e-12, credible = eta2 <= v.cred + 1e-9;
      const text = !possible ? 'IMPOSSIBLE: BELOW THE LEAST WORK' : credible ? 'INSIDE THE SECOND-LAW LIMIT' : 'INSIDE THE LIMIT: ASK FOR TEST EVIDENCE';
      return output({ Q, Qa, W, copId, cop, eta2, lost, Eq, Ew, Ep }, 'Least power to chill (kW)', W,
        [m('Heat removed / above ambient (no work needed)', `${q(Q, '', 2)} / ${q(Qa, 'kW', 2)}`), m('Least power to chill', q(W, 'kW', 3)), m('COP: ideal / stated', `${q(copId, '', 2)} / ${q(cop, '', 2)}`), m('Second-law efficiency of the stated power', q(eta2, '%', 2)), m('Power above the least work', q(lost, 'kW', 2)), m('Per year: heat / least / stated energy', `${q(Eq, '', 0)} / ${q(Ew, '', 0)} / ${q(Ep, 'kWh', 0)}`)],
        'Least work to chill a product.', 'Constant specific heat, constant pressure, no phase change; reversible machines at every product temperature.', {
          text, tone: !possible ? 'bad' : credible ? 'good' : 'warn',
          checks: [check('Stated power against the least work', possible ? 'pass' : 'fail', `${q(v.P, 'kW', 2)} against a least power of ${q(W, 'kW', 3)}.`), check('Second-law efficiency', credible ? 'pass' : 'verify', `${q(eta2, '%', 2)} against your threshold of ${q(v.cred, '%', 1)} for accepting a figure without test evidence.`), check('Phase change', 'verify', 'Freezing the product or condensing moisture adds latent heat that this check leaves out.')],
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
