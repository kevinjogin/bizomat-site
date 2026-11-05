// BIZOMAT MAKEOS calculations for engineering thermodynamics (batch handbook72). SI units are explicit at each boundary.
// Methods are standard ideal-gas, cycle, psychrometric and combustion relations; no textbook tables or examples are reproduced.
// Gas properties, refrigerant enthalpies, limits and targets are always entered by the user.
(() => {
  const K0 = 273.15; // 0 °C in kelvin
  const q = (value, unit, digits = 4) => {
    if (value === 0) value = 0; // no negative zero
    const formatted = value !== 0 && Math.abs(value) < 10 ** -digits
      ? fmtPrimary('engineering', value) : num(value, digits);
    return `${formatted}${unit ? ` ${unit}` : ''}`;
  };
  const tbl = (caption, head, rows) => ({ caption, head, rows });
  // Saturation pressure of water vapour, kPa: Hyland–Wexler (ASHRAE Handbook—Fundamentals, ch. 1), over liquid water
  // from 0 °C and over ice below 0 °C. t in °C.
  const psWater = (t) => { const T = t + K0; return Math.exp(-5.8002206e3 / T + 1.3914993 - 4.8640239e-2 * T + 4.1764768e-5 * T * T - 1.4452093e-8 * T ** 3 + 6.5459673 * Math.log(T)) / 1000; };
  const psIce = (t) => { const T = t + K0; return Math.exp(-5.6745359e3 / T + 6.3925247 - 9.677843e-3 * T + 6.2215701e-7 * T * T + 2.0747825e-9 * T ** 3 - 9.484024e-13 * T ** 4 + 4.1635019 * Math.log(T)) / 1000; };
  const psat = (t) => (t >= 0 ? psWater(t) : psIce(t));
  /** Dew point (frost point below 0 °C), °C: the temperature at which psat equals the vapour pressure pv (kPa). */
  const dewPoint = (pv) => {
    let lo = -100, hi = 200;
    for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (psat(mid) < pv) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  /** Moist air at t (°C), relative humidity rh (%) and total pressure p (kPa): ω = 0.622 pv ÷ (p − pv), h = 1.005 t + ω (2500.9 + 1.82 t). */
  const moist = (t, rh, p) => {
    const pv = rh / 100 * psat(t), w = 0.622 * pv / (p - pv);
    return { pv, w, h: 1.005 * t + w * (2500.9 + 1.82 * t), vol: 0.287 * (t + K0) / (p - pv), Td: dewPoint(pv) };
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
  const methods = {
    "otto-diesel-cycle-check": (v) => {
      const diesel = v.cycle === 'diesel', r = v.r, k = v.k;
      if (diesel && v.rc >= r) return invalid('The cutoff ratio must be smaller than the compression ratio: the gas cannot occupy more than the cylinder volume at the end of heat addition.');
      const T1 = v.T1 + K0, cv = v.R / (k - 1), cp = k * cv;
      const T2 = T1 * r ** (k - 1), P2 = v.P1 * r ** k;
      let T3, P3, qin, T4;
      if (diesel) { T3 = T2 * v.rc; P3 = P2; qin = cp * (T3 - T2); T4 = T3 * (v.rc / r) ** (k - 1); }
      else { qin = v.qin; T3 = T2 + qin / cv; P3 = P2 * T3 / T2; T4 = T3 / r ** (k - 1); }
      const P4 = v.P1 * T4 / T1, qout = cv * (T4 - T1), wnet = qin - qout, eta = 100 * wnet / qin;
      const etaClosed = 100 * (diesel ? 1 - (v.rc ** k - 1) / (k * (v.rc - 1) * r ** (k - 1)) : 1 - r ** (1 - k));
      const v1 = v.R * T1 / v.P1, MEP = wnet / (v1 * (1 - 1 / r)), carnot = 100 * (1 - T1 / T3), ok = P3 <= v.Pmax + 1e-9;
      const st = (T) => `${q(T - K0, '°C', 1)} (${q(T, 'K', 1)})`;
      return output({ T2, P2, T3, P3, T4, P4, qin, qout, wnet, eta, etaClosed, MEP, carnot }, 'Thermal efficiency (%)', eta,
        [m('Thermal efficiency', q(eta, '%', 2)), m('Net work per kilogram of air', q(wnet, 'kJ/kg', 1)), m('Mean effective pressure', q(MEP, 'kPa', 0)), m('Peak pressure (state 3)', q(P3, 'kPa', 0)), m('Peak temperature (state 3)', st(T3)), m('Heat added / rejected', `${q(qin, '', 1)} / ${q(qout, 'kJ/kg', 1)}`), m('Carnot efficiency between T₁ and T₃', q(carnot, '%', 2))],
        `Ideal ${diesel ? 'Diesel' : 'Otto'} cycle on the cold-air standard${diesel ? '; the heat-added input is not used (it follows from the cutoff ratio)' : '; the cutoff ratio is not used'}.`, 'Cold-air standard: ideal gas with constant specific heats, reversible processes, no friction, heat loss, fuel or exhaust.', {
          text: ok ? 'PEAK PRESSURE WITHIN LIMIT' : 'PEAK PRESSURE OVER LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Peak cylinder pressure', ok ? 'pass' : 'fail', `${q(P3, 'kPa', 0)} against an allowable ${q(v.Pmax, 'kPa', 0)}.`), check('Efficiency below the Carnot limit', eta < carnot ? 'pass' : 'fail', `${q(eta, '%', 2)} against ${q(carnot, '%', 2)} for a reversible engine between the lowest and highest cycle temperatures.`), check('Peak temperature', 'verify', `${st(T3)}: real engines peak lower, because specific heats rise with temperature, heat is lost to the walls and combustion is not instantaneous.`)],
          actions: ok ? [] : [diesel ? 'Lower the compression ratio, or check the peak pressure against the engine’s real combustion data.' : 'Lower the compression ratio or the heat added per kilogram, or check the peak pressure against real combustion data.'],
          table: tbl('Cycle states (cold-air standard)', ['State', 'Pressure (kPa)', 'Temperature (°C)', 'Temperature (K)'], [['1 Start of compression', q(v.P1, '', 1), q(T1 - K0, '', 1), q(T1, '', 1)], ['2 End of compression', q(P2, '', 1), q(T2 - K0, '', 1), q(T2, '', 1)], ['3 End of heat addition', q(P3, '', 1), q(T3 - K0, '', 1), q(T3, '', 1)], ['4 End of expansion', q(P4, '', 1), q(T4 - K0, '', 1), q(T4, '', 1)]]),
        });
    },
    "brayton-regenerator-check": (v) => {
      const T1 = v.T1 + K0, T3 = v.T3 + K0, a = (v.k - 1) / v.k, ec = v.etac / 100, et = v.etat / 100, e = v.eps / 100;
      const T2s = T1 * v.rp ** a, T2 = T1 + (T2s - T1) / ec, T4s = T3 / v.rp ** a, T4 = T3 - et * (T3 - T4s);
      if (T3 <= T2) return invalid(`The turbine inlet temperature must be above the compressor outlet temperature (${q(T2 - K0, '°C', 1)}): no heat could be added in the combustor.`);
      const wc = v.cp * (T2 - T1), wt = v.cp * (T3 - T4), wnet = wt - wc, rbw = 100 * wc / wt;
      const useful = T4 > T2, T5 = useful ? T2 + e * (T4 - T2) : T2, Texh = T4 - (T5 - T2);
      const qin = v.cp * (T3 - T5), q0 = v.cp * (T3 - T2), eta = 100 * wnet / qin, eta0 = 100 * wnet / q0;
      const P = v.mdot * wnet, Qin = v.mdot * qin, positive = wnet > 0, ok = positive && P >= v.Preq - 1e-9;
      const regen = e === 0 ? check('Regenerator', 'pass', 'No regenerator entered: the cycle is analysed as a simple gas turbine.')
        : useful ? check('Regenerator', 'pass', `The turbine exhaust (${q(T4 - K0, '°C', 1)}) is hotter than the compressor outlet (${q(T2 - K0, '°C', 1)}): the regenerator lifts the efficiency from ${q(eta0, '%', 2)} to ${q(eta, '%', 2)}.`)
          : check('Regenerator', 'warn', `The turbine exhaust (${q(T4 - K0, '°C', 1)}) is colder than the compressor outlet (${q(T2 - K0, '°C', 1)}): a regenerator would cool the compressed air, so it is left out.`);
      return output({ T2, T4, T5, Texh, wc, wt, wnet, rbw, eta, eta0, P, Qin }, 'Net power (kW)', P,
        [m('Net power', q(P, 'kW', 1)), m('Thermal efficiency with the regenerator / without', `${q(eta, '%', 2)} / ${q(eta0, '%', 2)}`), m('Back-work ratio (compressor ÷ turbine work)', q(rbw, '%', 1)), m('Compressor / turbine / net work', `${q(wc, '', 1)} / ${q(wt, '', 1)} / ${q(wnet, 'kJ/kg', 1)}`), m('Compressor outlet / turbine exhaust', `${q(T2 - K0, '', 1)} / ${q(T4 - K0, '°C', 1)}`), m('Air to the combustor / exhaust after the regenerator', `${q(T5 - K0, '', 1)} / ${q(Texh - K0, '°C', 1)}`), m('Heat input', q(Qin, 'kW', 1))],
        'Gas turbine (Brayton) cycle check.', 'Cold-air standard: ideal gas with constant specific heats, no pressure losses, no fuel mass and no cooling or leakage flows.', {
          text: !positive ? 'NO NET POWER' : ok ? 'NET POWER MEETS DEMAND' : 'NET POWER SHORT OF DEMAND', tone: ok ? 'good' : 'bad',
          checks: [check('Net work', positive ? 'pass' : 'fail', positive ? `The turbine gives ${q(wt, 'kJ/kg', 1)} and the compressor takes ${q(wc, 'kJ/kg', 1)}.` : 'The compressor takes all the turbine work or more: raise the turbine inlet temperature or the component efficiencies.'), check('Power against demand', ok ? 'pass' : 'fail', `${q(P, 'kW', 1)} against ${q(v.Preq, 'kW', 1)} required.`), regen],
          actions: ok ? [] : ['Raise the air flow, the turbine inlet temperature or the component efficiencies, then check again.'],
        });
    },
    "vapour-compression-cycle-check": (v) => {
      if (v.h1 <= v.h3) return invalid('The compressor-inlet enthalpy must be above the condenser-outlet enthalpy: otherwise the evaporator absorbs no heat.');
      if (v.h2s <= v.h1) return invalid('The isentropic discharge enthalpy must be above the compressor-inlet enthalpy: compression adds energy to the refrigerant.');
      if (v.Tc <= v.Te) return invalid('The condensing temperature must be above the evaporating temperature.');
      const heat = v.mode === 'heat', qL = v.h1 - v.h3, w = (v.h2s - v.h1) / (v.etac / 100), h2 = v.h1 + w, qH = h2 - v.h3;
      const COPR = qL / w, COPHP = qH / w, TL = v.Te + K0, TH = v.Tc + K0, CR = TL / (TH - TL), CH = TH / (TH - TL);
      const COP = heat ? COPHP : COPR, COPc = heat ? CH : CR, eta2 = 100 * COP / COPc;
      const mdot = v.Q / (heat ? qH : qL), W = mdot * w, QL = mdot * qL, QH = mdot * qH;
      const over = COP > COPc * (1 + 1e-9), ok = !over && COP >= v.COPreq - 1e-9;
      const name = heat ? 'heat pump' : 'refrigerator';
      return output({ qL, w, h2, qH, COPR, COPHP, CR, CH, eta2, mdot, W, QL, QH }, `COP as a ${name}`, COP,
        [m(`COP as a ${name}`, q(COP, '', 3)), m('Compressor power', q(W, 'kW', 3)), m('Refrigerant mass flow', `${q(mdot, 'kg/s', 4)} (${q(mdot * 3600, 'kg/h', 1)})`), m('Heat absorbed / rejected', `${q(QL, '', 3)} / ${q(QH, 'kW', 3)}`), m('Refrigerating effect / compressor work per kilogram', `${q(qL, '', 2)} / ${q(w, 'kJ/kg', 2)}`), m('Discharge enthalpy (actual)', q(h2, 'kJ/kg', 2)), m('Reversed-Carnot COP / second-law efficiency', `${q(COPc, '', 3)} / ${q(eta2, '%', 1)}`)],
        `Vapour-compression cycle sized for ${heat ? 'heating' : 'cooling'}.`, 'Single-stage cycle, adiabatic compressor and expansion valve, no pressure drops, heat gains or motor and drive losses.', {
          text: over ? 'INPUTS EXCEED THE CARNOT LIMIT' : ok ? 'COP MEETS TARGET' : 'COP BELOW TARGET', tone: ok ? 'good' : 'bad',
          checks: [check('Second law', over ? 'fail' : 'pass', over ? `A COP of ${q(COP, '', 3)} exceeds the reversed-Carnot COP of ${q(COPc, '', 3)} between ${q(v.Te, '°C', 1)} and ${q(v.Tc, '°C', 1)}: the enthalpies and temperatures do not belong to the same cycle.` : `A COP of ${q(COP, '', 3)} is ${q(eta2, '%', 1)} of the reversed-Carnot COP of ${q(COPc, '', 3)}.`), check('COP against target', ok ? 'pass' : 'fail', `${q(COP, '', 3)} against ${q(v.COPreq, '', 2)} required.`)],
          actions: ok ? [] : ['Raise the evaporating temperature or lower the condensing temperature (smaller lift), or choose a more efficient compressor, then check again.'],
          verify: ['Take all three enthalpies from the same refrigerant table or software with the same reference state, and the isentropic discharge at the condensing pressure and the compressor-inlet entropy.'],
        });
    },
    "surface-dew-point-check": (v) => {
      const ps = psat(v.T), pv = v.RH / 100 * ps;
      if (pv >= v.P) return invalid('The water vapour pressure would reach the total pressure: lower the temperature or humidity, or raise the pressure.');
      const a = moist(v.T, v.RH, v.P), gap = v.Ts - a.Td, rhS = 100 * a.pv / psat(v.Ts), frost = v.Ts < 0;
      const ok = gap >= v.margin - 1e-9, wet = gap <= 0;
      return output({ ps, pv: a.pv, w: a.w, h: a.h, vol: a.vol, Td: a.Td, gap, rhS }, 'Margin above the dew point (K)', gap,
        [m(a.Td < 0 ? 'Frost point' : 'Dew point', q(a.Td, '°C', 2)), m('Surface temperature above the dew point', q(gap, 'K', 2)), m('Relative humidity at the surface temperature', q(rhS, '%', 1)), m('Humidity ratio', `${q(a.w * 1000, 'g/kg dry air', 3)}`), m('Enthalpy', q(a.h, 'kJ/kg dry air', 2)), m('Vapour / saturation pressure', `${q(a.pv, '', 4)} / ${q(ps, 'kPa', 4)}`), m('Specific volume', q(a.vol, 'm³/kg dry air', 4))],
        'Moist air dew point and surface condensation check.', 'Ideal-gas moist air at uniform temperature and humidity; the surface temperature is the coldest point; steady conditions.', {
          text: ok ? 'SURFACE STAYS DRY' : !wet ? 'MARGIN TOO SMALL' : frost ? 'FROST WILL FORM' : 'SURFACE WILL SWEAT', tone: ok ? 'good' : wet ? 'bad' : 'warn',
          checks: [check('Surface against the dew point', ok ? 'pass' : wet ? 'fail' : 'warn', `The surface is ${q(gap, 'K', 2)} ${gap >= 0 ? 'above' : 'below'} the ${a.Td < 0 ? 'frost' : 'dew'} point of ${q(a.Td, '°C', 2)}; ${q(v.margin, 'K', 1)} required.`)],
          actions: ok ? [] : ['Raise the surface temperature (insulation, heating) or lower the dew point (ventilation with drier air, dehumidifying, sealing out humid air), then check again.'],
        });
    },
    "cooling-coil-dehumidification-check": (v) => {
      if (v.T2 >= v.T1) return invalid('The outlet temperature must be below the inlet temperature for a cooling coil.');
      const a = moist(v.T1, v.RH1, v.P), b = moist(v.T2, v.RH2, v.P);
      if (b.w > a.w) return invalid(`The outlet air would hold more moisture than the inlet air (${q(b.w * 1000, 'g/kg', 3)} against ${q(a.w * 1000, 'g/kg', 3)}): a cooling coil cannot add moisture. Lower the outlet relative humidity; without condensation the humidity ratio stays the same.`);
      const ma = v.V1 / a.vol, mw = ma * (a.w - b.w), hw = 4.18 * v.T2, Q = ma * (a.h - b.h) - mw * hw;
      const Qs = ma * (1.005 + 1.82 * a.w) * (v.T1 - v.T2), Ql = Q - Qs, SHR = Qs / Q, ok = v.Qcoil >= Q - 1e-9;
      return output({ w1: a.w, h1: a.h, vol1: a.vol, Td1: a.Td, w2: b.w, h2: b.h, Td2: b.Td, ma, mw, Q, Qs, Ql, SHR }, 'Total coil load (kW)', Q,
        [m('Total coil load', q(Q, 'kW', 2)), m('Sensible / latent load', `${q(Qs, '', 2)} / ${q(Ql, 'kW', 2)}`), m('Sensible heat ratio', q(SHR, '', 3)), m('Condensate removed', `${q(mw * 3600, 'kg/h', 2)}`), m('Dry-air mass flow', q(ma, 'kg/s', 4)), m('Humidity ratio in / out', `${q(a.w * 1000, '', 3)} / ${q(b.w * 1000, 'g/kg dry air', 3)}`), m('Enthalpy in / out', `${q(a.h, '', 2)} / ${q(b.h, 'kJ/kg dry air', 2)}`), m('Dew point in / out', `${q(a.Td, '', 2)} / ${q(b.Td, '°C', 2)}`)],
        'Cooling coil load with dehumidification.', 'Steady flow, ideal-gas moist air, condensate leaving at the outlet air temperature, no fan heat or duct gains.', {
          text: ok ? 'COIL CAN MEET THE LOAD' : 'COIL UNDERSIZED', tone: ok ? 'good' : 'bad',
          checks: [check('Coil capacity', ok ? 'pass' : 'fail', `${q(v.Qcoil, 'kW', 2)} rated against ${q(Q, 'kW', 2)} needed.`), check('Condensation', mw > 0 ? 'pass' : 'warn', mw > 0 ? `The coil removes ${q(mw * 3600, 'kg/h', 2)} of water: provide a trapped drain.` : 'No moisture is removed: this is sensible cooling only.'), check('Coil surface', 'verify', `To reach the outlet state the coil surface must be colder than the outlet dew point of ${q(b.Td, '°C', 2)}; confirm with the coil maker’s selection.`)],
          actions: ok ? [] : ['Choose a larger coil, a colder chilled-water or refrigerant temperature, or reduce the air flow or the moisture to be removed.'],
        });
    },
    "combustion-air-flue-gas-check": (v) => {
      const e = v.ex / 100, a = v.x + v.y / 4, nO2 = e * a, nN2 = 3.76 * (1 + e) * a, nH2O = v.y / 2, N = v.x + nH2O + nO2 + nN2, Nd = N - nH2O;
      const M = 12.011 * v.x + 1.008 * v.y, AFRs = 4.76 * a * 28.97 / M, AFR = AFRs * (1 + e), mair = AFR * v.mf, mflue = v.mf + mair;
      const pv = nH2O / N * v.P, Td = dewPoint(pv), O2d = 100 * nO2 / Nd, CO2d = 100 * v.x / Nd, gap = v.Ts - Td;
      const ok = gap >= v.margin - 1e-9, wet = gap <= 0;
      return output({ a, N, Nd, M, AFRs, AFR, mair, mflue, xCO2: v.x / N, xH2O: nH2O / N, xO2: nO2 / N, xN2: nN2 / N, O2d, CO2d, pv, Td, gap }, 'Margin above the flue-gas dew point (K)', gap,
        [m('Air–fuel ratio: stoichiometric / actual', `${q(AFRs, '', 3)} / ${q(AFR, 'kg air/kg fuel', 3)}`), m('Combustion air / flue gas', `${q(mair, '', 2)} / ${q(mflue, 'kg/h', 2)}`), m('Dry flue O₂ / CO₂ (analyser reading)', `${q(O2d, '', 2)} / ${q(CO2d, '%', 2)}`), m('Water vapour in the flue gas', `${q(100 * nH2O / N, '%', 2)} (${q(pv, 'kPa', 3)})`), m('Water dew point of the flue gas', q(Td, '°C', 2)), m('Lowest surface above the dew point', q(gap, 'K', 2)), m('Fuel molar mass', q(M, 'kg/kmol', 3))],
        `Complete combustion of C${num(v.x, 3)}H${num(v.y, 3)} with ${q(v.ex, '%', 1)} excess air.`, 'Complete combustion with dry air; no carbon monoxide, unburnt fuel, sulfur or dissociation; ideal-gas flue.', {
          text: ok ? 'FLUE ABOVE DEW POINT' : !wet ? 'MARGIN TOO SMALL' : 'CONDENSATE WILL FORM', tone: ok ? 'good' : 'warn',
          checks: [check('Lowest surface against the dew point', ok ? 'pass' : 'warn', `${q(v.Ts, '°C', 1)} against a water dew point of ${q(Td, '°C', 2)}; ${q(v.margin, 'K', 1)} margin required.`), check('Excess air', v.ex > 0 ? 'pass' : 'warn', v.ex > 0 ? `${q(v.ex, '%', 1)} above theoretical air.` : 'At theoretical air real burners leave carbon monoxide and unburnt fuel: run with some excess air.'), check('Acid dew point', 'verify', 'Fuels with sulfur condense acid well above the water dew point; check the fuel analysis.')],
          actions: ok ? [] : ['If the flue and exchanger are not built for condensate (corrosion-resistant, drained and neutralised), keep the surfaces hotter or reduce the excess air only within the burner maker’s limits.'],
        });
    },
    "compressor-turbine-efficiency-check": (v) => {
      const comp = v.machine === 'comp', T1 = v.T1 + K0, T2 = v.T2 + K0, a = (v.k - 1) / v.k, R = v.cp * a;
      if (comp && v.P2 <= v.P1) return invalid('For a compressor the outlet pressure must be above the inlet pressure.');
      if (!comp && v.P2 >= v.P1) return invalid('For a turbine the outlet pressure must be below the inlet pressure.');
      if (comp && T2 <= T1) return invalid('For an uncooled compressor the outlet temperature must be above the inlet temperature.');
      if (!comp && T2 >= T1) return invalid('For a turbine the outlet temperature must be below the inlet temperature.');
      const rp = v.P2 / v.P1, T2s = T1 * rp ** a, eta = comp ? 100 * (T2s - T1) / (T2 - T1) : 100 * (T1 - T2) / (T1 - T2s);
      const W = v.mdot * v.cp * Math.abs(T2 - T1), Ws = v.mdot * v.cp * Math.abs(T2s - T1), ds = v.cp * Math.log(T2 / T1) - R * Math.log(rp), Sgen = v.mdot * ds;
      const over = eta > 100 + 1e-9, ok = !over && eta >= v.etamin - 1e-9;
      return output({ T2s, eta, W, Ws, ds, Sgen, R }, 'Isentropic efficiency (%)', eta,
        [m('Isentropic efficiency', q(eta, '%', 2)), m('Isentropic outlet temperature', q(T2s - K0, '°C', 2)), m(comp ? 'Gas power absorbed' : 'Gas power delivered', q(W, 'kW', 3)), m(comp ? 'Isentropic (ideal) power' : 'Isentropic (ideal) power available', q(Ws, 'kW', 3)), m('Pressure ratio', `${q(comp ? rp : 1 / rp, '', 3)}:1`), m('Entropy change / generation rate', `${q(ds, 'kJ/kg·K', 5)} / ${q(Sgen, 'kW/K', 5)}`), m('Gas constant from cp and k', q(R, 'kJ/kg·K', 4))],
        `${comp ? 'Compressor' : 'Turbine'} efficiency from measured temperatures.`, 'Adiabatic machine, ideal gas with constant specific heats, steady flow, kinetic energy changes neglected.', {
          text: over ? 'CHECK THE MEASUREMENTS' : ok ? 'EFFICIENCY ACCEPTABLE' : 'EFFICIENCY BELOW MINIMUM', tone: ok ? 'good' : 'bad',
          checks: [check('Physical limit', over ? 'fail' : 'pass', over ? `An efficiency of ${q(eta, '%', 2)} means entropy fell (${q(ds, 'kJ/kg·K', 5)}) in an adiabatic machine: the machine is cooled or a reading is wrong.` : `Entropy rises by ${q(ds, 'kJ/kg·K', 5)}, as it must in an adiabatic machine.`), check('Efficiency against minimum', ok ? 'pass' : 'fail', `${q(eta, '%', 2)} against ${q(v.etamin, '%', 1)}.`)],
          actions: ok ? [] : over ? ['Check the thermometer and pressure gauge positions and calibration, and whether the machine is cooled (oil-injected or water-jacketed machines cannot be tested this way).'] : ['Inspect for fouling, wear, internal leakage or recirculation, and compare with the maker’s performance curve at this flow.'],
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
