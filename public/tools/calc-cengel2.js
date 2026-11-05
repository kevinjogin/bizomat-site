// BIZOMAT MAKEOS calculations for engineering thermodynamics, second Çengel batch (cengel2). SI units are explicit at each boundary.
// Methods are standard steam-cycle, cogeneration and psychrometric relations; no textbook tables or examples are reproduced.
// Steam-table values, efficiencies, capacities, limits and targets are always entered by the user.
(() => {
  const K0 = 273.15; // 0 °C in kelvin
  const q = (value, unit, digits = 4) => {
    if (value === 0) value = 0; // no negative zero
    const formatted = value !== 0 && Math.abs(value) < 10 ** -digits
      ? fmtPrimary('engineering', value) : num(value, digits);
    return `${formatted}${unit ? ` ${unit}` : ''}`;
  };
  // Saturation pressure of water vapour over liquid water, kPa: Hyland–Wexler (ASHRAE Handbook—Fundamentals, ch. 1). t in °C.
  const psWater = (t) => { const T = t + K0; return Math.exp(-5.8002206e3 / T + 1.3914993 - 4.8640239e-2 * T + 4.1764768e-5 * T * T - 1.4452093e-8 * T ** 3 + 6.5459673 * Math.log(T)) / 1000; };
  /** Temperature, °C, at which f (increasing) reaches zero, by bisection on [lo, hi]. */
  const solve = (f, lo, hi) => { for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (f(mid) < 0) lo = mid; else hi = mid; } return (lo + hi) / 2; };
  const dewPoint = (pv) => solve((t) => psWater(t) - pv, -60, 200);
  const hg = (t) => 2500.9 + 1.82 * t; // water vapour enthalpy, kJ/kg, Çengel (14-4)
  const hf = (t) => 4.18 * t; // liquid water enthalpy, kJ/kg, constant specific heat
  /** Moist air at t (°C), relative humidity rh (%) and total pressure p (kPa), per kilogram of dry air. */
  const moist = (t, rh, p) => {
    const pv = rh / 100 * psWater(t), w = 0.622 * pv / (p - pv);
    return { pv, w, h: 1.005 * t + w * hg(t), vol: 0.287 * (t + K0) / (p - pv), Td: dewPoint(pv) };
  };
  /** Moist air from humidity ratio w and enthalpy h: temperature, vapour pressure, relative humidity and dew point. */
  const fromWH = (w, h, p) => {
    const t = (h - 2500.9 * w) / (1.005 + 1.82 * w), pv = w * p / (0.622 + w);
    return { t, pv, rh: 100 * pv / psWater(t), Td: dewPoint(pv) };
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
    "rankine-cycle-check": (v) => {
      if (v.Pb <= v.Pc) return invalid('The boiler pressure must be above the condenser pressure.');
      if (v.h4s >= v.h3) return invalid('The isentropic turbine-exit enthalpy must be below the turbine-inlet enthalpy: expansion releases energy.');
      if (v.h4s <= v.hf) return invalid('The isentropic turbine-exit enthalpy must be above the saturated liquid enthalpy at condenser pressure.');
      const wp = v.vf * (v.Pb - v.Pc) / (v.etap / 100), h2 = v.hf + wp, wt = v.etat / 100 * (v.h3 - v.h4s), h4 = v.h3 - wt;
      const wnet = wt - wp;
      if (wnet <= 0) return invalid('The turbine gives no more work than the feed pump takes: check the enthalpies and efficiencies.');
      const qin = v.h3 - h2, qout = h4 - v.hf, eta = 100 * wnet / qin, bwr = 100 * wp / wt, HR = 3600 / (eta / 100);
      const mdot = v.Pnet / wnet, Qb = mdot * qin, Qc = mdot * qout, x4 = (h4 - v.hf) / v.hfg, ok = x4 >= v.xmin - 1e-9;
      const xs = x4 >= 1 ? 'superheated (no moisture)' : q(x4, '', 4);
      return output({ wp, h2, wt, h4, wnet, qin, qout, eta, bwr, HR, mdot, Qb, Qc, x4 }, 'Thermal efficiency (%)', eta,
        [m('Thermal efficiency', q(eta, '%', 2)), m('Steam flow for the net power', `${q(mdot, 'kg/s', 4)} (${q(mdot * 3.6, 't/h', 2)})`), m('Heat rate', q(HR, 'kJ/kWh', 0)), m('Turbine exhaust dryness', xs), m('Turbine / pump / net work', `${q(wt, '', 1)} / ${q(wp, '', 2)} / ${q(wnet, 'kJ/kg', 1)}`), m('Boiler / condenser duty', `${q(Qb, '', 0)} / ${q(Qc, 'kW', 0)}`), m('Back-work ratio', q(bwr, '%', 2))],
        'Steam Rankine cycle check.', 'Simple cycle with saturated liquid leaving the condenser; adiabatic turbine and pump; no pressure losses, heat losses or auxiliary loads.', {
          text: ok ? 'EXHAUST DRY ENOUGH' : 'EXHAUST TOO WET', tone: ok ? 'good' : 'bad',
          checks: [check('Turbine exhaust dryness', ok ? 'pass' : 'fail', `${xs} against a minimum of ${q(v.xmin, '', 3)}.`), check('Energy balance', 'pass', `Heat added ${q(qin, 'kJ/kg', 1)} = net work ${q(wnet, 'kJ/kg', 1)} + heat rejected ${q(qout, 'kJ/kg', 1)}.`)],
          actions: ok ? [] : ['Raise the turbine inlet superheat, add reheat, or check the turbine maker’s exhaust moisture limit.'],
          verify: ['Take all enthalpies, the liquid specific volume and the saturation values from one steam table or program (IAPWS-IF97).'],
        });
    },
    "steam-dryness-throttling-check": (v) => {
      if (v.P2 >= v.P1) return invalid('The calorimeter pressure must be below the line pressure: the sample is throttled down to it.');
      if (v.T2 < v.Tsat2) return invalid('The calorimeter temperature is below the saturation temperature at its pressure: check the readings or the saturation value.');
      const x = (v.h2 - v.hf1) / v.hfg1, sup = v.T2 - v.Tsat2, valid = sup >= v.sup - 1e-9, moistPct = 100 * Math.max(0, 1 - x);
      const dry = x >= 1, ok = valid && x >= v.xreq - 1e-9;
      return output({ x, sup, moistPct }, 'Dryness fraction', x,
        [m('Dryness fraction of the line steam', dry ? `${q(x, '', 4)} (dry or superheated)` : q(x, '', 4)), m('Moisture in the steam', q(moistPct, '%', 2)), m('Superheat in the calorimeter', q(sup, 'K', 2)), m('Enthalpy (constant through the throttle)', q(v.h2, 'kJ/kg', 1))],
        'Wet steam dryness from a throttling calorimeter.', 'Throttling at constant enthalpy with no heat loss from the sampling line or calorimeter; the sample represents the line.', {
          text: !valid ? 'READING NOT VALID' : ok ? 'STEAM DRY ENOUGH' : 'STEAM TOO WET', tone: !valid ? 'warn' : ok ? 'good' : 'bad',
          checks: [check('Calorimeter superheat', valid ? 'pass' : 'fail', valid ? `${q(sup, 'K', 2)} of superheat: the throttled steam is superheated, so its enthalpy is fixed by pressure and temperature.` : `Only ${q(sup, 'K', 2)} of superheat (${q(v.sup, 'K', 1)} needed): the steam is too wet for a throttling calorimeter; use a separating calorimeter first.`), check('Dryness against requirement', !valid ? 'verify' : ok ? 'pass' : 'fail', `${q(x, '', 4)} against ${q(v.xreq, '', 3)} required.`)],
          actions: ok ? [] : ['Check steam traps, separators and line drainage upstream, and boiler water level and carryover, then test again.'],
        });
    },
    "cogeneration-saving-check": (v) => {
      if (v.We + v.Qh <= 0) return invalid('Enter an electrical output, a useful heat output or both.');
      const etaE = 100 * v.We / v.Qf, etaH = 100 * v.Qh / v.Qf, u = etaE + etaH, Fsep = v.We / (v.etaE / 100) + v.Qh / (v.etaH / 100);
      const saved = Fsep - v.Qf, PES = 100 * saved / Fsep, ok = PES >= v.pesReq - 1e-9, over = u > 100 + 1e-9;
      const PHR = v.Qh > 0 ? v.We / v.Qh : 0, MWh = (x) => q(x * v.hrs / 1000, 'MWh', 0);
      return output({ etaE, etaH, u, Fsep, saved, PES, PHR }, 'Primary energy saving (%)', PES,
        [m('Primary energy saving', q(PES, '%', 2)), m('Utilisation factor', q(u, '%', 2)), m('Electrical / heat efficiency', `${q(etaE, '', 2)} / ${q(etaH, '%', 2)}`), m('Power-to-heat ratio', v.Qh > 0 ? q(PHR, '', 3) : 'no useful heat'), m('Fuel for separate production / for CHP', `${q(Fsep, '', 1)} / ${q(v.Qf, 'kW', 1)}`), m('Fuel saved per year', MWh(saved)), m('Fuel used per year', MWh(v.Qf))],
        'Cogeneration (CHP) utilisation and primary energy saving.', 'Steady operation at one load point; useful heat is heat actually used; fuel and reference efficiencies on the same heating-value basis.', {
          text: ok ? 'CHP SAVES PRIMARY ENERGY' : 'SAVING BELOW TARGET', tone: ok ? 'good' : 'bad',
          checks: [check('Primary energy saving', ok ? 'pass' : 'fail', `${q(PES, '%', 2)} against ${q(v.pesReq, '%', 1)} required.`), check('Energy balance', over ? 'warn' : 'pass', over ? `Power plus useful heat is ${q(u, '%', 1)} of the fuel input: check that all figures use the same heating value (a condensing unit on a lower heating value basis can exceed 100 %).` : `Power plus useful heat is ${q(u, '%', 1)} of the fuel input; the rest is lost.`), check('Useful heat', 'verify', 'Count only heat that displaces boiler fuel; heat dumped through a cooler is not useful heat.')],
          actions: ok ? [] : ['Raise the share of recovered heat that is actually used, or check the size of the unit against the site’s heat demand.'],
        });
    },
    "air-stream-mixing-check": (v) => {
      const a = moist(v.T1, v.RH1, v.P), b = moist(v.T2, v.RH2, v.P), m1 = v.V1 / a.vol, m2 = v.V2 / b.vol, ma = m1 + m2;
      if (ma <= 0) return invalid('Enter a volume flow for at least one stream.');
      const w3 = (m1 * a.w + m2 * b.w) / ma, h3 = (m1 * a.h + m2 * b.h) / ma, c = fromWH(w3, h3, v.P), share = 100 * m1 / ma;
      const fog = c.rh > 100 + 1e-9, ok = c.rh <= v.rhMax + 1e-9;
      return output({ m1, m2, w3, h3, T3: c.t, RH3: c.rh, Td3: c.Td, share }, 'Mixed air temperature (°C)', c.t,
        [m('Mixed air temperature', q(c.t, '°C', 2)), m('Mixed relative humidity', fog ? `${q(c.rh, '%', 1)} (supersaturated)` : q(c.rh, '%', 1)), m('Mixed dew point', q(c.Td, '°C', 2)), m('Mixed humidity ratio', q(w3 * 1000, 'g/kg dry air', 3)), m('Mixed enthalpy', q(h3, 'kJ/kg dry air', 2)), m('Stream 1 share (dry-air mass)', q(share, '%', 1)), m('Dry-air mass flow 1 / 2', `${q(m1, '', 4)} / ${q(m2, 'kg/s', 4)}`)],
        'Adiabatic mixing of two air streams.', 'Steady adiabatic mixing at one pressure; ideal-gas moist air; streams fully mixed.', {
          text: fog ? 'FOG FORMS' : ok ? 'MIXED AIR CLEAR' : 'MIXED AIR NEAR SATURATION', tone: fog ? 'bad' : ok ? 'good' : 'warn',
          checks: [check('Mixed relative humidity', fog ? 'fail' : ok ? 'pass' : 'warn', fog ? 'The mixed state lies beyond saturation: water condenses as fog until the air is saturated.' : `${q(c.rh, '%', 1)} against ${q(v.rhMax, '%', 1)} allowed.`), check('Mixing calculation', 'pass', 'Humidity ratio and enthalpy are dry-air mass-weighted averages; the mixed temperature follows from them.')],
          actions: fog || !ok ? ['Preheat the colder stream, reduce its share, or dry it before mixing.'] : [],
        });
    },
    "evaporative-cooler-check": (v) => {
      const a = moist(v.T1, v.RH1, v.P);
      const ws = (t) => { const ps = psWater(t); return 0.622 * ps / (v.P - ps); };
      const Twb = solve((t) => (1.005 * (t - v.T1) + ws(t) * (hg(t) - hf(t))) / (hg(v.T1) - hf(t)) - a.w, -20, v.T1);
      if (Twb < 0) return invalid('The wet-bulb temperature of this air is below 0 °C: a direct evaporative cooler would freeze, so this tool does not apply.');
      const T2 = v.T1 - v.eps / 100 * (v.T1 - Twb), w2 = (a.h - a.w * hf(Twb) - 1.005 * T2) / (hg(T2) - hf(Twb));
      const c = fromWH(w2, 1.005 * T2 + w2 * hg(T2), v.P), ma = v.V / a.vol, mw = ma * (w2 - a.w), Qs = ma * (1.005 + 1.82 * a.w) * (v.T1 - T2);
      const ok = T2 <= v.Treq + 1e-9, reach = v.Treq >= Twb - 1e-9;
      return output({ Twb, T2, w1: a.w, w2, RH2: c.rh, ma, mw, Qs }, 'Leaving air temperature (°C)', T2,
        [m('Leaving air temperature', q(T2, '°C', 2)), m('Wet-bulb temperature (lowest possible)', q(Twb, '°C', 2)), m('Leaving relative humidity', q(c.rh, '%', 1)), m('Water evaporated', `${q(mw * 3600, 'kg/h', 1)} (about ${q(mw * 3600, 'L/h', 0)})`), m('Sensible cooling of the air', q(Qs, 'kW', 2)), m('Humidity ratio in / out', `${q(a.w * 1000, '', 3)} / ${q(w2 * 1000, 'g/kg dry air', 3)}`), m('Dry-air mass flow', q(ma, 'kg/s', 4))],
        'Direct evaporative cooler check.', 'Adiabatic saturation with make-up water at the wet-bulb temperature; steady flow; no pump or fan heat.', {
          text: ok ? 'COOLER REACHES TARGET' : 'COOLER CANNOT REACH TARGET', tone: ok ? 'good' : 'bad',
          checks: [check('Supply temperature', ok ? 'pass' : 'fail', `${q(T2, '°C', 2)} leaving against ${q(v.Treq, '°C', 1)} needed.`), check('Target against the wet-bulb', reach ? 'pass' : 'fail', reach ? `The target is above the ${q(Twb, '°C', 2)} wet-bulb, the limit of direct evaporative cooling.` : `The target is below the ${q(Twb, '°C', 2)} wet-bulb: no direct evaporative cooler can reach it.`), check('Water and hygiene', 'verify', 'Allow for bleed-off on top of the water evaporated, and maintain pads and sumps to control Legionella risk.')],
          actions: ok ? [] : ['Use pads with higher effectiveness, an indirect or two-stage cooler, or mechanical cooling for the remainder.'],
        });
    },
    "heating-humidification-check": (v) => {
      if (v.T3 <= v.T1) return invalid('The leaving air must be warmer than the entering air for a heating and humidifying process.');
      const a = moist(v.T1, v.RH1, v.P), b = moist(v.T3, v.RH3, v.P);
      if (b.w < a.w) return invalid(`The leaving air holds less moisture than the entering air (${q(b.w * 1000, 'g/kg', 3)} against ${q(a.w * 1000, 'g/kg', 3)}): this process removes moisture, which needs a cooling coil.`);
      const ma = v.V1 / a.vol, mw = ma * (b.w - a.w), Qnet = ma * (b.h - a.h) - mw * v.hw, Q = Math.max(0, Qnet), Mh = mw * 3600;
      const okQ = Q <= v.Qcap + 1e-9, okM = Mh <= v.Mcap + 1e-9, ok = okQ && okM, steam = v.kind === 'steam';
      const plausible = steam ? v.hw >= 2000 : v.hw <= 500;
      return output({ w1: a.w, w3: b.w, h1: a.h, h3: b.h, ma, mw, Qnet, Q, Mh }, 'Heater load (kW)', Q,
        [m('Heater load', q(Q, 'kW', 2)), m('Water or steam added', q(Mh, 'kg/h', 2)), m('Energy brought in by the humidifier', q(mw * v.hw, 'kW', 2)), m('Humidity ratio in / out', `${q(a.w * 1000, '', 3)} / ${q(b.w * 1000, 'g/kg dry air', 3)}`), m('Enthalpy in / out', `${q(a.h, '', 2)} / ${q(b.h, 'kJ/kg dry air', 2)}`), m('Leaving dew point', q(b.Td, '°C', 2)), m('Dry-air mass flow', q(ma, 'kg/s', 4))],
        `Heating with ${steam ? 'steam' : 'water spray'} humidification.`, 'Steady flow, ideal-gas moist air, all added water absorbed by the air, no duct heat gains or losses.', {
          text: ok ? 'EQUIPMENT MEETS THE DUTY' : !okQ && !okM ? 'HEATER AND HUMIDIFIER UNDERSIZED' : !okQ ? 'HEATER UNDERSIZED' : 'HUMIDIFIER UNDERSIZED', tone: ok ? 'good' : 'bad',
          checks: [check('Heater capacity', okQ ? 'pass' : 'fail', `${q(v.Qcap, 'kW', 2)} against ${q(Q, 'kW', 2)} needed.`), check('Humidifier capacity', okM ? 'pass' : 'fail', `${q(v.Mcap, 'kg/h', 2)} against ${q(Mh, 'kg/h', 2)} needed.`), check('Humidifier enthalpy', plausible ? 'pass' : 'warn', plausible ? `${q(v.hw, 'kJ/kg', 0)} suits ${steam ? 'steam' : 'liquid water'}.` : `${q(v.hw, 'kJ/kg', 0)} looks like ${steam ? 'liquid water, not steam' : 'steam, not liquid water'}: check the type and value.`), ...(Qnet < 0 ? [check('Heat from the humidifier', 'warn', 'The steam alone brings more heat than the air needs: no heater load, and the air may overshoot the leaving temperature.')] : [])],
          actions: ok ? [] : ['Choose a larger heater or humidifier, or check the design entering conditions and the air flow.'],
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
