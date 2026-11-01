// KEVOS® MAKEOS calculations for classical thermodynamics topics (batch handbook71). SI units are explicit at each boundary.
// Methods are standard thermodynamic relations (Guggenheim, Thermodynamics); no book tables or examples are reproduced.
// Material properties, gas constants, ratings and limits are always entered by the user.
(() => {
  const PI = Math.PI;
  const R = 8.31446261815324; // molar gas constant, J/(mol·K); exact since the 2019 SI
  const FARADAY = 96485.33212331002; // Faraday constant, C/mol; exact since the 2019 SI
  const K0 = 273.15; // 0 °C in kelvin
  const P0 = 101325; // standard atmosphere, Pa
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
  /** Root of a monotonic function f on [lo, hi] by bisection; f(lo) and f(hi) must differ in sign. */
  function bisect(f, lo, hi) {
    let flo = f(lo);
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2, fm = f(mid);
      if ((fm <= 0) === (flo <= 0)) { lo = mid; flo = fm; } else hi = mid;
    }
    return (lo + hi) / 2;
  }
  /** x ln x + (1 − x) ln(1 − x): the ideal Gibbs energy of mixing of a binary mixture per mole, divided by RT. */
  const gmix = (x) => (x > 0 ? x * Math.log(x) : 0) + (x < 1 ? (1 - x) * Math.log(1 - x) : 0);
  const methods = {
    "trapped-liquid-pressure-check": (v) => {
      const beta = v.beta * 1e-6, rigid = v.wall === 'rigid', al = rigid ? 0 : v.al * 1e-6;
      const C = rigid ? 0 : v.D / (v.E * 1000 * v.t) * (1.25 - v.nu); // wall stretch, volume strain per MPa
      const kappa = 1 / v.Kb, growth = beta - 3 * al, rate = growth / (kappa + C) * 10; // bar per kelvin
      const dp = rate * v.dT, pf = v.p0 + dp, ok = pf <= v.pd + 1e-9;
      const dTa = rate > 0 ? Math.max(0, (v.pd - v.p0) / rate) : null;
      const V = PI / 4 * (v.D / 1000) ** 2 * v.L * 1000; // trapped volume, L
      const relief = Math.max(0, V * 1000 * (growth * v.dT - (v.pd - v.p0) / 10 * (kappa + C))); // mL
      const sigma = pf / 10 * v.D / (2 * v.t), thin = rigid || v.D / v.t >= 10;
      return output({ C, kappa, rate, dp, pf, dTa, V, relief, sigma }, 'Final pressure (bar g)', pf,
        [m('Pressure rise per kelvin', q(rate, 'bar/K', 4)), m('Pressure rise', q(dp, 'bar', 4)), m('Final pressure', q(pf, 'bar g', 4)), m('Largest rise within the limit', dTa === null ? 'No limit: the liquid grows no faster than the container' : q(dTa, 'K', 4)), m('Trapped volume', q(V, 'L', 4)), m('Volume a relief must release', q(relief, 'mL', 4)), m('Hoop stress at the final pressure', rigid ? 'Not calculated for a rigid container' : q(sigma, 'MPa', 4))],
        'Trapped liquid thermal pressure check.', 'Liquid completely fills the section with no gas; properties constant over the rise; elastic wall.', {
          text: ok ? 'PRESSURE WITHIN DESIGN' : 'THERMAL RELIEF NEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Final pressure', ok ? 'pass' : 'fail', `${q(pf, 'bar g', 2)} against ${q(v.pd, 'bar g', 2)}${ok ? '.' : `: fit a thermal relief valve, keep the section open to an expansion space or limit the rise to ${q(dTa ?? 0, 'K', 2)}.`}`),
            check('Wall model', rigid ? 'verify' : thin ? 'pass' : 'warn', rigid ? 'A rigid container ignores the wall’s stretch and growth, so the rise is an upper bound.' : thin ? 'The thin-walled stretch relation applies.' : `Bore ÷ wall is ${q(v.D / v.t, '', 2)}: the thin-walled stretch is only approximate for thick walls.`),
            check('Gas pockets', 'verify', 'Any trapped air or vapour absorbs expansion and lowers the rise; a liquid-full section is the worst case.'),
            ...(pf < 0 ? [check('Falling pressure', 'warn', 'The pressure falls below atmospheric: the liquid may reach its vapour pressure and the relation then no longer holds.')] : [])],
        });
    },
    "ro-concentrate-pressure-check": (v) => {
      const T = v.T + K0, r = v.rec / 100, Pi = (c) => v.phi * v.nu * c * R * T / 1e5; // bar from mol/m³
      const cf = v.tds * 1000 / v.M, cp = (1 - v.rej / 100) * cf, cc = (cf - r * cp) / (1 - r);
      const Pif = Pi(cf), Pip = Pi(cp), Pic = Pi(cc), tdsP = cp * v.M / 1000, tdsC = cc * v.M / 1000;
      const ndpIn = v.pf - v.pp - (Pif - Pip), ndpOut = v.pf - v.dpe - v.pp - (Pic - Pip), pmin = v.ndp + v.dpe + v.pp + Pic - Pip, ok = ndpOut >= v.ndp - 1e-9;
      return output({ cf, cp, cc, Pif, Pip, Pic, tdsP, tdsC, ndpIn, ndpOut, pmin }, 'Net driving pressure at the concentrate end (bar)', ndpOut,
        [m('Feed concentration / osmotic pressure', `${q(cf, 'mol/m³', 4)} / ${q(Pif, 'bar', 4)}`), m('Concentrate dissolved solids / osmotic pressure', `${q(tdsC, 'g/L', 4)} / ${q(Pic, 'bar', 4)}`), m('Permeate dissolved solids / osmotic pressure', `${q(tdsP, 'g/L', 4)} / ${q(Pip, 'bar', 4)}`), m('Net driving pressure at the feed end', q(ndpIn, 'bar', 4)), m('Net driving pressure at the concentrate end', q(ndpOut, 'bar', 4)), m('Least feed pressure', q(pmin, 'bar g', 4))],
        'Reverse osmosis concentrate-end check.', 'Dilute-solution osmotic pressure with one osmotic coefficient; no concentration polarisation.', {
          text: ok ? 'FEED PRESSURE ADEQUATE' : 'FEED PRESSURE TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Concentrate end', ok ? 'pass' : 'fail', `${q(ndpOut, 'bar', 2)} net driving pressure against ${q(v.ndp, 'bar', 2)}${ok ? '.' : `: raise the feed pressure to at least ${q(pmin, 'bar g', 2)} or lower the recovery.`}`),
            check('Concentration polarisation', 'verify', 'The salt at the membrane surface is higher than in the bulk, so the real osmotic pressure there is higher; use the membrane maker’s design program for the final design.'),
            check('Scaling', 'verify', `The concentrate is ${q(1 / (1 - r), '', 3)} times the feed: check sparingly soluble salts and silica before raising the recovery.`)],
        });
    },
    "ph-electrode-calibration-check": (v) => {
      if (Math.abs(v.pH1 - v.pH2) < 0.5) return invalid('The two buffers must differ by at least 0.5 pH.');
      if (v.sMin > v.sMax) return invalid('The lowest acceptable slope must not exceed the highest.');
      const Tc = v.Tc + K0, Ts = v.Ts + K0, Sth = Math.LN10 * R * Tc / FARADAY * 1000; // mV per pH
      const S = (v.E2 - v.E1) / (v.pH1 - v.pH2), pct = 100 * S / Sth, off = v.E1 + S * (v.pH1 - 7);
      const live = S > 0, pHz = live ? v.pH1 + v.E1 / S : null, Ss = S * Ts / Tc, pHs = live ? pHz - v.Es / Ss : null;
      const okS = live && pct >= v.sMin - 1e-9 && pct <= v.sMax + 1e-9, okO = Math.abs(off) <= v.offMax + 1e-9, ok = okS && okO;
      const lo = Math.min(v.pH1, v.pH2), hi = Math.max(v.pH1, v.pH2), inside = live && pHs >= lo - 1e-9 && pHs <= hi + 1e-9;
      return output({ Sth, S, pct, off, pHz, Ss, pHs }, 'Slope (% of ideal)', pct,
        [m('Ideal slope at calibration', q(Sth, 'mV/pH', 4)), m('Measured slope', q(S, 'mV/pH', 4)), m('Slope as a share of ideal', q(pct, '%', 4)), m('Offset (reading at pH 7)', q(off, 'mV', 4)), m('pH at which the reading is zero', live ? q(pHz, '', 4) : 'Not defined: the slope is not positive'), m('Slope at the sample temperature', q(Ss, 'mV/pH', 4)), m('Sample pH', live ? q(pHs, '', 4) : 'Not calculated')],
        'pH electrode two-buffer calibration check.', 'Straight-line electrode response; slope scaled with absolute temperature about the zero-reading point.', {
          text: ok ? 'ELECTRODE IN LIMITS' : 'ELECTRODE OUT OF LIMITS', tone: ok ? 'good' : 'bad',
          checks: [check('Slope', okS ? 'pass' : 'fail', live ? `${q(pct, '%', 1)} of ideal against ${q(v.sMin, '', 1)}–${q(v.sMax, '%', 1)}${okS ? '.' : ': clean or recondition the electrode, use fresh buffers and calibrate again; replace it if the slope stays out.'}` : 'The slope is zero or negative: the electrode is broken, disconnected or the buffers were swapped.'),
            check('Offset', okO ? 'pass' : 'fail', `${q(off, 'mV', 1)} at pH 7 against ±${q(v.offMax, 'mV', 1)}${okO ? '.' : ': check the reference junction and filling solution.'}`),
            check('Sample within the buffers', inside ? 'pass' : 'warn', inside ? 'The sample pH lies between the two buffers.' : 'The sample lies outside the calibrated range: add a buffer that brackets it.'),
            check('Buffer values', 'verify', 'Use each buffer’s pH at the calibration temperature from its certificate, not its nominal value.')],
        });
    },
    "clausius-boiling-margin-check": (v) => {
      const Tb = v.Tb + K0, Top = v.Top + K0, H = v.H * 1000;
      if (Top <= 0) return invalid('The liquid temperature must be above absolute zero.');
      const pv = (T) => v.pb * Math.exp(-H / R * (1 / T - 1 / Tb)), inv = 1 / Tb - R * Math.log(v.pop / v.pb) / H;
      if (inv <= 0) return invalid('The pressure is too far above the known boiling point for this relation.');
      const Tbo = 1 / inv - K0, pvop = pv(Top), boil = v.goal === 'boil';
      const margin = boil ? v.Top - Tbo : Tbo - v.Top, Tlim = boil ? Top - v.mn : Top + v.mn;
      const pReq = Tlim > 0 ? pv(Tlim) : 0, ok = margin >= v.mn - 1e-9;
      const text = boil ? (ok ? 'BOILING ASSURED' : 'BOILING NOT ASSURED') : ok ? 'NO BOILING EXPECTED' : margin < 0 ? 'LIQUID WILL BOIL OR FLASH' : 'BOILING MARGIN TOO SMALL';
      return output({ pv: pvop, Tbo, margin, pReq, dp: v.pop - pvop }, 'Vapour pressure at the liquid temperature (kPa abs)', pvop,
        [m('Vapour pressure at the liquid temperature', q(pvop, 'kPa abs', 4)), m('Boiling temperature at the pressure above the liquid', q(Tbo, '°C', 4)), m(boil ? 'Temperature above boiling' : 'Temperature below boiling', q(margin, 'K', 4)), m('Pressure above vapour pressure', q(v.pop - pvop, 'kPa', 4)), m(boil ? 'Highest pressure for the margin' : 'Least pressure for the margin', q(pReq, 'kPa abs', 4))],
        'Boiling margin check.', 'Constant enthalpy of vaporisation; perfect vapour; liquid volume neglected.', {
          text, tone: ok ? 'good' : 'bad',
          checks: [check(boil ? 'Boiling margin' : 'Margin to boiling', ok ? 'pass' : 'fail', `${q(margin, 'K', 2)} against ${q(v.mn, 'K', 2)}${ok ? '.' : boil ? `: lower the pressure to ${q(pReq, 'kPa abs', 2)} or heat the liquid.` : `: raise the pressure above the liquid to ${q(pReq, 'kPa abs', 2)} or cool the liquid.`}`),
            check('Temperature range', Math.abs(v.Top - v.Tb) <= 50 ? 'pass' : 'warn', Math.abs(v.Top - v.Tb) <= 50 ? 'The liquid temperature is within 50 K of the known point.' : 'The liquid temperature is far from the known point: the enthalpy of vaporisation changes with temperature, so check against measured vapour pressures.'),
            check('Local pressure', 'verify', 'Pressure drops in suction lines, valves and pumps lower the local pressure below the vessel pressure.')],
        });
    },
    "gas-throttling-temperature-check": (v) => {
      if (v.p2 >= v.p1) return invalid('The outlet pressure must be below the inlet pressure for throttling.');
      const T1 = v.T1 + K0, Tmin = v.Tmin + K0, dpPa = (v.p1 - v.p2) * 1e5, vdw = v.model === 'vdw';
      if (Tmin <= 0) return invalid('The lowest outlet temperature must be above absolute zero.');
      let T2, T1r, mu1, Tinv = null;
      if (vdw) {
        const A = 2 * v.a / R, b = v.b * 1e-6, Ti = A / b; // A in m³·K/mol; inversion temperature Ti
        // Pressure change needed to take the gas from Ta to Tb at constant enthalpy: ∫ Cp T ÷ (A − bT) dT.
        const G = (Ta, Tb) => v.Cp * (-(Tb - Ta) / b - A / (b * b) * Math.log((A - b * Tb) / (A - b * Ta)));
        const solve = (Ta, target) => {
          if (Math.abs(A - b * Ta) <= 1e-12 * A) return Ta;
          if (Ta < Ti) return target < 0 ? (G(Ta, 1) > target ? null : bisect((T) => G(Ta, T) - target, 1, Ta)) : bisect((T) => G(Ta, T) - target, Ta, Ti * (1 - 1e-12));
          if (target > 0) return bisect((T) => G(Ta, T) - target, Ti * (1 + 1e-12), Ta);
          let hi = Ta * 2; while (G(Ta, hi) > target && hi < 1e7) hi *= 2;
          return G(Ta, hi) > target ? null : bisect((T) => G(Ta, T) - target, Ta, hi);
        };
        T2 = solve(T1, -dpPa); T1r = solve(Tmin, dpPa); mu1 = (A / T1 - b) / v.Cp * 1e5; Tinv = Ti - K0;
        if (T2 === null || T1r === null) return invalid('The pressure drop is beyond what this gas model can describe.');
      } else {
        mu1 = v.mu; T2 = T1 - v.mu * (v.p1 - v.p2); T1r = Tmin + v.mu * (v.p1 - v.p2);
        if (T2 <= 0 || T1r <= 0) return invalid('The coefficient and pressure drop give a temperature below absolute zero.');
      }
      const n = v.Q * P0 / (R * 288.15) / 3600, ok = T2 >= Tmin - 1e-9, heat = ok ? 0 : n * v.Cp * (T1r - T1) / 1000;
      return output({ mu1, Tinv, T2: T2 - K0, dT: T2 - T1, T1r: T1r - K0, n, heat }, 'Outlet temperature (°C)', T2 - K0,
        [m('Joule–Thomson coefficient at the inlet', q(mu1, 'K/bar', 4)), m('Inversion temperature of the model', vdw ? q(Tinv, '°C', 4) : 'Not given by a known coefficient'), m('Outlet temperature', q(T2 - K0, '°C', 4)), m('Temperature change', q(T2 - T1, 'K', 4)), m('Inlet temperature for the lowest outlet', q(T1r - K0, '°C', 4)), m('Molar flow', q(n, 'mol/s', 4)), m('Preheat power', q(heat, 'kW', 4))],
        'Gas throttling temperature check.', 'Adiabatic throttling at constant enthalpy; slightly imperfect gas; constant heat capacity.', {
          text: ok ? 'OUTLET TEMPERATURE ACCEPTABLE' : 'PREHEAT NEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Outlet temperature', ok ? 'pass' : 'fail', `${q(T2 - K0, '°C', 2)} against ${q(v.Tmin, '°C', 2)}${ok ? '.' : `: preheat the gas to ${q(T1r - K0, '°C', 2)} (about ${q(heat, 'kW', 2)}) or reduce the pressure in stages with heating between.`}`),
            check('Gas model', 'verify', vdw ? 'The van der Waals second virial coefficient is a two-constant approximation and is least reliable at high pressure: compare with measured Joule–Thomson data for the gas.' : 'A constant coefficient is accurate only over the range it was measured for.'),
            check('Moisture and hydrates', 'verify', 'Water or heavy components in the gas can freeze, form hydrates or condense at the outlet temperature.')],
        });
    },
    "filter-bubble-point-check": (v) => {
      const pmt = v.pmin * v.gt / v.gr, margin = 100 * (v.pb / pmt - 1), d = 4 * v.k * v.gt * 1e-3 / (v.pb * 1e5) * 1e6, dmin = 4 * v.k * v.gt * 1e-3 / (pmt * 1e5) * 1e6, ok = v.pb >= pmt - 1e-9;
      return output({ pmt, margin, d, dmin }, 'Equivalent largest pore (µm)', d,
        [m('Minimum bubble point in your wetting liquid', q(pmt, 'bar', 4)), m('Margin over the minimum', q(margin, '%', 4)), m('Equivalent largest pore at the measured bubble point', q(d, 'µm', 4)), m('Equivalent largest pore at the minimum', q(dmin, 'µm', 4))],
        'Filter membrane bubble point check.', 'Fully wetting liquids; cylindrical capillary pores with the shape factor entered.', {
          text: ok ? 'INTEGRITY TEST PASSED' : 'INTEGRITY TEST FAILED', tone: ok ? 'good' : 'bad',
          checks: [check('Bubble point', ok ? 'pass' : 'fail', `${q(v.pb, 'bar', 3)} against ${q(pmt, 'bar', 3)}${ok ? '.' : ': re-wet the membrane fully and test again; if it fails again, the filter or its seal is damaged.'}`),
            check('Wetting', 'verify', 'An incompletely wetted membrane gives a falsely low bubble point; flush with the wetting liquid as the maker directs.'),
            check('Surface tension', 'verify', 'Surface tension falls as temperature rises: use values at the test temperature for both liquids.')],
        });
    },
    "gas-separation-energy-check": (v) => {
      const xF = v.xF / 100, xP = v.xP / 100, nW = v.AF - 1;
      if (xP <= xF) return invalid('The product purity must be higher than the share of the wanted gas in the feed.');
      const xW = (v.AF * xF - xP) / nW;
      if (xW < 0) return invalid(`The feed per unit of product is too low for this purity: it must be at least ${q(xP / xF, '', 4)}.`);
      const T = v.T + K0, molNm3 = P0 / (R * K0), W = R * T * (gmix(xP) + nW * gmix(xW) - v.AF * gmix(xF)); // J per mol of product
      const Wlim = R * T * (gmix(xP) - gmix(xF) - (xP - xF) * Math.log(xF / (1 - xF))), Emin = W * molNm3 / 3.6e6, Elim = Wlim * molNm3 / 3.6e6;
      if (v.Eact < Emin) return invalid('The actual specific energy is below the thermodynamic least work: check the power and flow readings.');
      const eff = 100 * Emin / v.Eact, rec = 100 * xP / (v.AF * xF), kWh = v.Q * v.hrs * v.Eact, cost = kWh * v.price, costMin = v.Q * v.hrs * Emin * v.price, ok = v.Eact <= v.Etgt + 1e-12;
      return output({ xW: 100 * xW, rec, W, Emin, Wlim, Elim, eff, kWh, cost, costMin }, 'Second-law efficiency (%)', eff,
        [m('Wanted gas in the waste stream', q(100 * xW, '%', 4)), m('Recovery of the wanted gas', q(rec, '%', 4)), m('Least work per mole of product', q(W, 'J/mol', 4)), m('Least specific energy', q(Emin, 'kWh/Nm³', 6)), m('Least specific energy at a very large feed ratio', q(Elim, 'kWh/Nm³', 6)), m('Second-law efficiency', q(eff, '%', 4)), m('Yearly energy / cost (excluding GST)', `${q(kWh, 'kWh', 4)} / ${q(cost, 'AUD', 4)}`), m('Yearly cost at the least work', q(costMin, 'AUD', 4))],
        'Gas separation energy check.', 'Ideal-gas mixing at ambient temperature; two-component feed; isothermal reversible least work.', {
          text: ok ? 'WITHIN TARGET ENERGY' : 'ABOVE TARGET ENERGY', tone: ok ? 'good' : 'bad',
          checks: [check('Specific energy', ok ? 'pass' : 'fail', `${q(v.Eact, 'kWh/Nm³', 4)} against ${q(v.Etgt, 'kWh/Nm³', 4)}${ok ? '.' : ': check the compressor pressure, leaks, the purity set point (higher purity costs more air) and the air factor.'}`),
            check('Purity set point', 'verify', 'Do not make purer gas than the process needs: the air factor, and so the energy, rises steeply with purity.'),
            check('Energy boundary', 'verify', 'Count the same energy as the target: compressor input power, dryers and any booster, at the same reference conditions.')],
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
