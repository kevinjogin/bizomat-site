// BIZOMAT MAKEOS calculations from thermodynamics topics after Linder, Thermodynamics and Introductory Statistical Mechanics (batch handbook70).
// SI units are explicit at each boundary. Methods are standard thermodynamic relations; no source tables, examples or data are reproduced.
// Material properties, ratings, factors and limits are always entered by the user.
(() => {
  const R = 8.314462618; // molar gas constant, J/(mol·K)
  const K0 = 273.15; // 0 °C in kelvin
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
  /** Integrated Clausius–Clapeyron: vapour pressure at T (K) from P1 at T1 (K), molar enthalpy dH in J/mol. */
  const ccPressure = (P1, T1, dH, T) => P1 * Math.exp(-dH / R * (1 / T - 1 / T1));
  /** Inverse: the temperature (K) at which the vapour pressure is P, or NaN when it lies beyond absolute zero. */
  const ccTemperature = (P1, T1, dH, P) => { const inv = 1 / T1 - R * Math.log(P / P1) / dH; return inv > 0 ? 1 / inv : NaN; };
  /** Isenthalpic outlet temperature (K): dT/dP = μ_JT, integrated from P1 to P2 (Pa) by fourth-order Runge–Kutta. */
  function throttle(muOf, T1, P1, P2, steps = 400) {
    const h = (P2 - P1) / steps; let T = T1;
    for (let k = 0; k < steps; k++) {
      const k1 = muOf(T), k2 = muOf(T + h * k1 / 2), k3 = muOf(T + h * k2 / 2), k4 = muOf(T + h * k3);
      T += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
      if (!(T > 0)) return NaN;
    }
    return T;
  }
  const methods = {
    "heat-engine-second-law-check": (v) => {
      const Th = v.Th + K0, Tc = v.Tc + K0;
      if (Tc <= 0) return invalid('The cold reservoir must be above absolute zero (−273.15 °C).');
      if (Th <= Tc) return invalid('The hot reservoir must be hotter than the cold reservoir.');
      if (v.mode === 'pump' && v.W > v.Q) return invalid('A heat pump delivers at least its power input as heat: the heating must not be less than the power input.');
      let eff, carnot, Qo, Sgen, Wrev, lost;
      if (v.mode === 'engine') {
        eff = v.W / v.Q; carnot = 1 - Tc / Th; Qo = v.Q - v.W; Sgen = Qo / Tc - v.Q / Th; Wrev = v.Q * carnot; lost = Wrev - v.W;
      } else if (v.mode === 'fridge') {
        eff = v.Q / v.W; carnot = Tc / (Th - Tc); Qo = v.Q + v.W; Sgen = Qo / Th - v.Q / Tc; Wrev = v.Q / carnot; lost = v.W - Wrev;
      } else {
        eff = v.Q / v.W; carnot = Th / (Th - Tc); Qo = v.Q - v.W; Sgen = v.Q / Th - Qo / Tc; Wrev = v.Q / carnot; lost = v.W - Wrev;
      }
      const share = 100 * eff / carnot, possible = share <= 100 + 1e-9, credible = share <= v.share + 1e-9;
      const engine = v.mode === 'engine', name = engine ? 'Efficiency' : 'COP', fmtE = (x) => (engine ? q(100 * x, '%', 2) : q(x, '', 3));
      const otherLabel = engine ? 'Heat rejected to the cold reservoir' : v.mode === 'fridge' ? 'Heat rejected to the hot reservoir' : 'Heat taken from the cold reservoir';
      return output({ eff, carnot, share, Qo, Sgen: Sgen * 1000, Wrev, lost }, 'Share of the Carnot limit (%)', share,
        [m(`${name}: actual / Carnot limit`, `${fmtE(eff)} / ${fmtE(carnot)}`), m('Share of the Carnot limit', q(share, '%', 1)), m(otherLabel, q(Qo, 'kW', 3)), m('Entropy generated', q(Sgen * 1000, 'W/K', 3)), m(engine ? 'Reversible work for the same heat' : 'Reversible power for the same duty', q(Wrev, 'kW', 3)), m('Lost work rate', q(lost, 'kW', 3))],
        'Heat engine and heat pump second-law check.', 'Two constant-temperature reservoirs; steady operation.', {
          text: !possible ? 'CLAIM BREAKS THE SECOND LAW' : credible ? 'CLAIM WITHIN THE LIMIT' : 'CLAIM CLOSE TO THE CARNOT LIMIT', tone: !possible ? 'bad' : credible ? 'good' : 'warn',
          checks: [check('Second law', possible ? 'pass' : 'fail', possible ? `${fmtE(eff)} does not exceed the Carnot limit of ${fmtE(carnot)}; entropy generated ${q(Sgen * 1000, 'W/K', 3)}.` : `${fmtE(eff)} exceeds the Carnot limit of ${fmtE(carnot)}: entropy would be destroyed, so the figures or temperatures are wrong.`),
            check('Credibility', !possible ? 'fail' : credible ? 'pass' : 'warn', `${q(share, '%', 1)} of the Carnot limit against the ${q(v.share, '%', 0)} you treat as credible${credible || !possible ? '.' : ': ask for measured test data before relying on the claim.'}`),
            check('Temperatures', 'verify', 'Use the temperatures the machine actually works between, including the approach in its heat exchangers, not the room or process set points.')],
        });
    },
    "gas-throttling-cooling-check": (v) => {
      if (v.P2 >= v.P1) return invalid('The outlet pressure must be lower than the inlet pressure.');
      const T1 = v.T1 + K0, P1 = v.P1 * 1e5, P2 = v.P2 * 1e5, aSI = v.a * 0.1, bSI = v.b * 1e-3, vdw = v.model === 'vdw';
      if (T1 <= 0) return invalid('The inlet temperature must be above absolute zero.');
      // van der Waals at low pressure: (∂H/∂P)_T = b − 2a/RT, so μ_JT = (2a/RT − b)/Cp (K/Pa).
      const muOf = vdw ? (T) => (2 * aSI / (R * T) - bSI) / v.Cp : () => v.mu / 1e5;
      const outlet = (Tin) => throttle(muOf, Tin, P1, P2);
      const T2 = outlet(T1);
      if (!Number.isFinite(T2)) return invalid('The gas would cool past absolute zero in this model: the pressure drop is outside its range.');
      const muIn = muOf(T1) * 1e5, drop = T1 - T2, Tmin = v.Tmin + K0, ok = T2 >= Tmin - 1e-9;
      let Tneed = T1;
      if (!ok) {
        let lo = T1, hi = T1 + 50;
        while (outlet(hi) < Tmin && hi < T1 + 5000) { lo = hi; hi += 200; }
        for (let k = 0; k < 100; k++) { const mid = (lo + hi) / 2; if (outlet(mid) < Tmin) lo = mid; else hi = mid; }
        Tneed = (lo + hi) / 2;
      }
      const ndot = v.mdot / 3600 / (v.M / 1000), Qpre = ndot * v.Cp * (Tneed - T1) / 1000; // mol/s and kW
      const values = { muIn, drop, T2C: T2 - K0, TneedC: Tneed - K0, ndot, Qpre };
      if (vdw && v.a > 0 && v.b > 0) values.TinvC = 2 * aSI / (R * bSI) - K0;
      const warms = drop < 0;
      return output(values, 'Outlet temperature (°C)', T2 - K0,
        [m('Joule–Thomson coefficient at the inlet', q(muIn, 'K/bar', 4)), m(warms ? 'Temperature rise' : 'Temperature drop', q(Math.abs(drop), 'K', 2)), m('Outlet temperature', q(T2 - K0, '°C', 2)), ...(values.TinvC != null ? [m('Inversion temperature (van der Waals)', q(values.TinvC, '°C', 0))] : []), m('Inlet temperature needed', q(Tneed - K0, '°C', 2)), m('Preheat power', q(Qpre, 'kW', 3))],
        'Gas pressure reduction cooling check.', vdw ? 'Constant enthalpy; low-pressure van der Waals coefficient; ideal-gas heat capacity.' : 'Constant enthalpy; constant entered coefficient.', {
          text: ok ? 'OUTLET ABOVE THE LIMIT' : 'PREHEAT NEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Outlet temperature', ok ? 'pass' : 'fail', `${q(T2 - K0, '°C', 1)} against the ${q(v.Tmin, '°C', 1)} allowed${ok ? '.' : `: preheat the gas to ${q(Tneed - K0, '°C', 1)} (${q(Qpre, 'kW', 2)}).`}`),
            check('Condensation and hydrates', 'verify', 'Check that the outlet stays above the dew point of the gas and any hydrate, frost or ice temperature for its moisture content.'),
            ...(vdw ? [check('Model range', 'verify', 'The van der Waals coefficient is a low-pressure estimate; compare it with measured Joule–Thomson data or a real-gas property program for high inlet pressures.')] : [])],
        });
    },
    "vacuum-boiling-point": (v) => {
      const T1 = v.T1 + K0, dH = v.dH * 1000, Tmax = v.Tmax + K0;
      if (T1 <= 0 || Tmax <= 0) return invalid('Temperatures must be above absolute zero (−273.15 °C).');
      const Tb = ccTemperature(v.P1, T1, dH, v.P);
      if (!Number.isFinite(Tb)) return invalid('The pressure ratio is too large for this enthalpy of vaporisation: the model gives no boiling temperature.');
      const Pneed = ccPressure(v.P1, T1, dH, Tmax), ok = Tb <= Tmax + 1e-9, span = Tb - T1;
      return output({ TbC: Tb - K0, Pneed, span, ratio: v.P / v.P1 }, 'Boiling temperature (°C)', Tb - K0,
        [m('Boiling temperature at the operating pressure', q(Tb - K0, '°C', 2)), m('Shift from the known boiling point', q(span, 'K', 2)), m('Pressure to boil at the temperature limit', q(Pneed, 'kPa', 3)), m('Operating pressure / known pressure', q(v.P / v.P1, '', 4))],
        'Boiling point under vacuum.', 'Clausius–Clapeyron: ideal vapour, constant enthalpy of vaporisation.', {
          text: ok ? 'BOILS BELOW THE LIMIT' : 'PRESSURE TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Temperature limit', ok ? 'pass' : 'fail', `Boils at ${q(Tb - K0, '°C', 1)} against the ${q(v.Tmax, '°C', 1)} limit${ok ? '.' : `: pull the pressure down to ${q(Pneed, 'kPa', 2)} absolute or less.`}`),
            check('Extrapolation', 'verify', `The result is ${q(Math.abs(span), 'K', 1)} from the known boiling point; the error grows with that distance because the enthalpy of vaporisation changes with temperature.`),
            check('Liquid depth and solutes', 'verify', 'Liquid below the surface boils hotter by its hydrostatic head, and dissolved solids raise the boiling point.')],
        });
    },
    "solvent-headspace-lel-check": (v) => {
      const Tref = v.Tref + K0, T = v.T + K0, dH = v.dH * 1000;
      const Pstar = ccPressure(v.Ps, Tref, dH, T), Pi = v.x * Pstar, y = 100 * Pi / v.Ptot, shareLEL = 100 * y / v.LEL;
      const Plim = v.lim / 100 * v.LEL / 100 * v.Ptot / v.x, PLEL = v.LEL / 100 * v.Ptot / v.x;
      const TlimK = ccTemperature(v.Ps, Tref, dH, Plim), TLELK = ccTemperature(v.Ps, Tref, dH, PLEL);
      const boiling = Pi >= v.Ptot, ok = !boiling && shareLEL <= v.lim + 1e-9, flammable = !boiling && y >= v.LEL - 1e-9;
      const values = { Pstar, Pi, y: Math.min(y, 100), shareLEL }, tShow = (TK) => (Number.isFinite(TK) ? q(TK - K0, '°C', 1) : 'Beyond the model range');
      if (Number.isFinite(TlimK)) values.TlimC = TlimK - K0;
      if (Number.isFinite(TLELK)) values.TLELC = TLELK - K0;
      return output(values, 'Headspace share of the LEL (%)', shareLEL,
        [m('Pure-solvent vapour pressure at the liquid temperature', q(Pstar, 'kPa', 3)), m('Solvent partial pressure', q(Pi, 'kPa', 3)), m('Saturated headspace concentration', boiling ? 'Liquid boiling: all vapour' : q(y, '% v/v', 3)), m('Share of the LEL', q(shareLEL, '%', 1)), m('Liquid temperature reaching your limit', tShow(TlimK)), m('Liquid temperature reaching the LEL', tShow(TLELK))],
        'Solvent vapour headspace check.', 'Equilibrium (saturated) headspace; Raoult’s law; Clausius–Clapeyron vapour pressure.', {
          text: boiling ? 'LIQUID BOILING' : ok ? 'BELOW THE LIMIT' : flammable ? 'FLAMMABLE HEADSPACE POSSIBLE' : 'ABOVE THE LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Share of LEL', ok ? 'pass' : 'fail', boiling ? 'The solvent partial pressure reaches the total pressure: the liquid boils and the space fills with vapour.' : `${q(shareLEL, '%', 1)} of the LEL against the ${q(v.lim, '%', 0)} allowed${ok ? '.' : `: keep the liquid below ${tShow(TlimK)}, ventilate or inert the space.`}`),
            check('Screening only', 'verify', 'This is a screening aid. Hazardous area classification, ventilation design and any work in the space need a competent person and the solvent’s safety data sheet.')],
        });
    },
    "ro-osmotic-pressure-check": (v) => {
      if (v.dp >= v.pf) return invalid('The pressure drop must be smaller than the feed pressure.');
      const T = v.T + K0, r = v.r / 100, cp = v.sp / 100 * v.c, cc = (v.c - r * cp) / (1 - r);
      const pi = (c) => v.phi * v.i * (c / v.M * 1000) * R * T / 1e5; // bar, from g/L
      const piF = pi(v.c), piC = pi(cc), piP = pi(cp);
      const ndpFeed = v.pf - v.pp - (piF - piP), ndpTail = v.pf - v.dp - v.pp - (piC - piP), pfMin = v.ndpMin + v.dp + v.pp + piC - piP, ok = ndpTail >= v.ndpMin - 1e-9;
      return output({ cp, cc, piF, piC, piP, ndpFeed, ndpTail, pfMin }, 'Net driving pressure at the concentrate end (bar)', ndpTail,
        [m('Concentrate / permeate strength', `${q(cc, '', 3)} / ${q(cp, 'g/L', 4)}`), m('Osmotic pressure: feed / concentrate', `${q(piF, '', 3)} / ${q(piC, 'bar', 3)}`), m('Osmotic pressure of the permeate', q(piP, 'bar', 4)), m('Net driving pressure: feed end', q(ndpFeed, 'bar', 3)), m('Net driving pressure: concentrate end', q(ndpTail, 'bar', 3)), m('Least feed pressure', q(pfMin, 'bar', 3))],
        'Reverse osmosis pressure check.', 'van ’t Hoff osmotic pressure with a constant osmotic coefficient; solute mass balance.', {
          text: ok ? 'FEED PRESSURE ENOUGH' : 'CONCENTRATE END STARVED', tone: ok ? 'good' : 'bad',
          checks: [check('Concentrate end', ok ? 'pass' : 'fail', `${q(ndpTail, 'bar', 2)} of net driving pressure against the ${q(v.ndpMin, 'bar', 2)} required${ok ? '.' : `: raise the feed to ${q(pfMin, 'bar', 2)} or lower the recovery.`}`),
            check('Scaling and fouling', 'verify', `The concentrate is ${q(cc / v.c, '', 2)} times as strong as the feed; check the scaling limits of its salts with the membrane maker’s software.`)],
        });
    },
    "hot-cold-water-blend-check": (v) => {
      if (!(v.Th > v.Tc)) return invalid('The hot supply must be hotter than the cold supply.');
      if (!(v.Tt > v.Tc && v.Tt < v.Th)) return invalid('The target temperature must lie between the cold and hot supply temperatures.');
      const Th = v.Th + K0, Tc = v.Tc + K0, Tt = v.Tt + K0, T0 = v.T0 + K0;
      const f = (v.Tt - v.Tc) / (v.Th - v.Tc), Qh = f * v.Q, Qc = v.Q - Qh, mh = v.rho * Qh / 60000, mc = v.rho * Qc / 60000;
      const P = mh * v.cp * (v.Th - v.Tc), Sgen = v.cp * (mh * Math.log(Tt / Th) + mc * Math.log(Tt / Tc)), lost = T0 * Sgen, ok = Qh <= v.hotCap + 1e-9; // kW, kW/K, kW
      return output({ f: 100 * f, Qh, Qc, P, Sgen: Sgen * 1000, lost }, 'Hot water flow (L/min)', Qh,
        [m('Hot share of the mixed flow', q(100 * f, '%', 2)), m('Hot / cold flow', `${q(Qh, '', 2)} / ${q(Qc, 'L/min', 2)}`), m('Heating power in the hot flow above the cold supply', q(P, 'kW', 3)), m('Entropy generated by mixing', q(Sgen * 1000, 'W/K', 3)), m('Lost work rate', q(lost, 'kW', 3))],
        'Hot and cold water blending check.', 'Adiabatic steady mixing; constant specific heat; incompressible liquid.', {
          text: ok ? 'HOT SUPPLY ENOUGH' : 'HOT SUPPLY SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Hot supply', ok ? 'pass' : 'fail', `${q(Qh, 'L/min', 2)} of hot water needed against ${q(v.hotCap, 'L/min', 2)} available${ok ? '.' : ': raise the hot supply temperature, add hot capacity or reduce the mixed flow.'}`),
            check('Outlet temperature rules', 'verify', 'For any outlet used for personal hygiene, check the delivery temperature limits of AS/NZS 3500.4 and local plumbing rules.')],
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
