// BIZOMAT MAKEOS thermodynamics calculations (batch handbook69). SI units are explicit at each boundary.
// Methods are standard engineering relations; no book tables, ratings or recommended settings are reproduced.
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
    "vapour-pressure-boiling-check": (v) => {
      const R = 8.314462618 / v.M, K1 = v.T1 + 273.15, Kw = v.Tw + 273.15, inv = 1 / K1 - R / v.L * Math.log(v.p / v.p1);
      if (inv <= 0) return invalid('The working pressure is too far above the reference point for this model: choose a reference point nearer the working pressure.');
      if (Kw <= 0 || K1 <= 0) return invalid('Temperatures must be above absolute zero.');
      const Tb = 1 / inv, TbC = Tb - 273.15, pv = v.p1 * Math.exp(-v.L / R * (1 / Kw - 1 / K1)), slope = v.L * pv / (R * Kw * Kw), mar = TbC - v.Tw, ok = mar >= v.margin - 1e-9, boils = mar <= 0, far = Math.abs(TbC - v.T1) > 100 || Math.abs(v.Tw - v.T1) > 100;
      return output({ R, Tb, TbC, pv, slope, mar }, 'Boiling temperature at the working pressure (°C)', TbC,
        [m('Specific gas constant', q(R, 'kJ/(kg·K)', 5)), m('Boiling temperature at the working pressure', q(TbC, '°C', 2)), m('Vapour pressure at the liquid temperature', q(pv, 'kPa abs', 3)), m('Slope of the vapour-pressure curve', q(slope, 'kPa/K', 3)), m('Margin to boiling', q(mar, 'K', 2))],
        'Vapour pressure and boiling check.', 'Clausius–Clapeyron with constant latent heat; pure liquid.', {
          text: ok ? 'LIQUID STAYS BELOW BOILING' : boils ? 'LIQUID WILL BOIL' : 'MARGIN TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Margin to boiling', ok ? 'pass' : 'fail', `${q(mar, 'K', 1)} against ${q(v.margin, 'K', 1)} required${ok ? '.' : boils ? ': the liquid boils or flashes at this pressure.' : ': raise the pressure or cool the liquid.'}`), check('Distance from the reference point', far ? 'warn' : 'pass', far ? 'More than 100 K from the reference point: take a reference point nearer the working temperature.' : 'Working and boiling temperatures are within 100 K of the reference point.')],
        });
    },
    "real-gas-cylinder-contents": (v) => {
      const Rg = 8.314462618, p = v.pg * 1e5 + v.patm * 1000, Tk = v.T + 273.15, b = v.b * 1e-6, a = v.a, Vm = v.V / 1000;
      if (Tk <= 0) return invalid('The temperature must be above absolute zero.');
      const f = (x) => p * x ** 3 - (p * b + Rg * Tk) * x * x + a * x - a * b, df = (x) => 3 * p * x * x - 2 * (p * b + Rg * Tk) * x + a;
      let x = b + Rg * Tk / p;
      for (let k = 0; k < 200; k++) { const d = df(x); if (d === 0) break; const nx = x - f(x) / d; if (Math.abs(nx - x) < 1e-15 * Math.max(1, Math.abs(x))) { x = nx; break; } x = nx; }
      if (!(x > b)) return invalid('No gas solution found for these constants: check a and b.');
      const n = Vm / x, mass = n * v.M / 1000, Z = p * x / (Rg * Tk), mIdeal = p * Vm * v.M / 1000 / (Rg * Tk), err = (mIdeal - mass) / mass * 100;
      const Tc = a > 0 && b > 0 ? 8 * a / (27 * Rg * b) : 0, pc = a > 0 && b > 0 ? a / (27 * b * b) : 0, sub = Tc > 0 && Tk < Tc, ok = mass >= v.mreq - 1e-9;
      return output({ p, x, n, mass, Z, mIdeal, err, Tc, pc }, 'Mass of gas held (kg)', mass,
        [m('Absolute pressure', q(p / 1e5, 'bar', 3)), m('Molar volume (van der Waals)', q(x * 1e6, 'cm³/mol', 2)), m('Moles / mass of gas held', `${q(n, 'mol', 1)} / ${q(mass, 'kg', 3)}`), m('Compressibility factor Z', q(Z, '', 4)), m('Ideal-gas mass / error', `${q(mIdeal, 'kg', 3)} / ${q(err, '%', 2)}`), m('Critical temperature / pressure from the constants', Tc > 0 ? `${q(Tc - 273.15, '°C', 1)} / ${q(pc / 1e5, 'bar', 1)}` : 'not defined (a or b is zero)')],
        'Real gas cylinder contents check.', 'Van der Waals equation with the constants entered.', {
          text: ok ? 'CONTENTS SUFFICIENT' : 'CONTENTS SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Mass held', ok ? 'pass' : 'fail', `${q(mass, 'kg', 2)} against ${q(v.mreq, 'kg', 2)} needed.`), check('Critical temperature', sub ? 'warn' : 'pass', sub ? 'The gas is below the critical temperature of these constants: it may be partly liquid; use saturation data instead.' : 'Above the critical temperature: a single gas phase.'), check('Pressure equipment', 'verify', 'Keep within the cylinder or receiver rating; qualified review governs filling and use.')],
        });
    },
    "ro-pressure-check": (v) => {
      const Tk = v.T + 273.15, r = v.rec / 100, pif = v.i * v.Cf / v.Ms * 8.314462618 * Tk / 1e5, CF = Math.log(1 / (1 - r)) / r, pim = CF * pif, NDP = v.Pf - v.dP / 2 - pim - v.Pp, pic = pif / (1 - r), tail = v.Pf - v.dP - v.Pp - pic;
      const Qp = Math.max(0, v.A * NDP * v.Am / 1000), Pneed = v.Qreq * 1000 / (v.A * v.Am) + v.dP / 2 + pim + v.Pp, okT = tail > 0, okQ = Qp >= v.Qreq - 1e-9, ok = okT && okQ;
      return output({ pif, CF, pim, NDP, pic, tail, Qp, Pneed }, 'Net driving pressure (bar)', NDP,
        [m('Feed osmotic pressure', q(pif, 'bar', 3)), m('Concentration factor (log mean) / mean osmotic pressure', `${q(CF, '', 3)} / ${q(pim, 'bar', 3)}`), m('Net driving pressure', q(NDP, 'bar', 2)), m('Concentrate osmotic pressure / end NDP', `${q(pic, '', 2)} / ${q(tail, 'bar', 2)}`), m('Permeate flow', q(Qp, 'm³/h', 2)), m('Feed pressure needed for the flow wanted', q(Pneed, 'bar gauge', 2))],
        'Reverse osmosis pressure check.', 'Dilute-solution osmotic pressure; average NDP model.', {
          text: ok ? 'PRESSURE ADEQUATE' : !okT ? 'CONCENTRATE END STOPS PRODUCING' : 'PERMEATE FLOW SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Concentrate-end driving pressure', okT ? 'pass' : 'fail', `${q(tail, 'bar', 2)}${okT ? ' left at the concentrate end.' : ': the last elements make no water; lower the recovery or raise the feed pressure.'}`), check('Permeate flow', okQ ? 'pass' : 'fail', `${q(Qp, 'm³/h', 2)} against ${q(v.Qreq, 'm³/h', 2)}; feed pressure needed ${q(Pneed, 'bar', 1)}.`), check('Scaling and membrane limits', 'verify', 'Check recovery against scaling limits and the membrane maker’s pressure and flux limits.')],
        });
    },
    "battery-heat-check": (v) => {
      const Tk = v.Tc + 273.15, Id = v.mode === 'dis' ? v.I : -v.I, R = v.Rint / 1000, dUdT = v.dUdT / 1000;
      const qirr = v.I * v.I * R, qrev = -Id * Tk * dUdT, qcell = qirr + qrev, Q = v.Nc * qcell, net = Q - v.Pcool, C = v.Nc * v.mc * v.cp, secs = v.t * 60, dT = net * secs / C, Pneed = Math.max(0, Q - v.dTmax * C / secs), ok = dT <= v.dTmax + 1e-9;
      return output({ qirr, qrev, qcell, Q, net, C, dT, Pneed }, 'Temperature rise over the duty (K)', dT,
        [m('Resistive heat per cell', q(qirr, 'W', 3)), m('Reversible (entropic) heat per cell', q(qrev, 'W', 3)), m('Pack heat', q(Q, 'W', 1)), m('Heat left after cooling', q(net, 'W', 1)), m('Pack heat capacity', q(C / 1000, 'kJ/K', 2)), m('Temperature rise over the duty', q(dT, 'K', 2)), m('Cooling needed for the allowed rise', q(Pneed, 'W', 1))],
        'Battery pack heat check.', 'Lumped pack temperature; Bernardi energy balance.', {
          text: ok ? 'TEMPERATURE RISE ACCEPTABLE' : 'PACK RUNS TOO HOT', tone: ok ? 'good' : 'bad',
          checks: [check('Temperature rise', ok ? 'pass' : 'fail', `${q(dT, 'K', 1)} against ${q(v.dTmax, 'K', 1)}${ok ? '.' : `: remove at least ${q(Pneed, 'W', 0)} or reduce the current.`}`), check('Hot spots and limits', 'verify', 'Check the hottest cell and the cell maker’s temperature limits; qualified review governs battery safety.')],
        });
    },
    "heat-pump-cop-check": (v) => {
      const Te = v.Tsrc - v.dTe + 273.15, Tcd = v.Tsink + v.dTc + 273.15;
      if (Te <= 0) return invalid('The evaporating temperature must be above absolute zero.');
      if (Tcd <= Te) return invalid('The condensing temperature must be above the evaporating temperature: check the source, sink and approaches.');
      const COPc = v.mode === 'heat' ? Tcd / (Tcd - Te) : Te / (Tcd - Te), COP = v.Q / v.P, eta2 = COP / COPc * 100, cost = v.P * v.hrs * v.price, Pmin = v.Q / (v.etaMin / 100 * COPc);
      const impossible = COP > COPc + 1e-9, ok = !impossible && eta2 >= v.etaMin - 1e-9, money = (x) => `A\u0024${num(Math.round(x), 0)}`;
      return output({ Te, Tcd, COPc, COP, eta2, cost, Pmin }, 'Second-law efficiency (%)', eta2,
        [m('Evaporating / condensing temperature', `${q(Te - 273.15, '', 1)} / ${q(Tcd - 273.15, '°C', 1)}`), m('Carnot COP', q(COPc, '', 3)), m('Actual COP', q(COP, '', 3)), m('Second-law efficiency', q(eta2, '%', 1)), m('Yearly electricity cost', money(cost)), m('Input power at your minimum efficiency', q(Pmin, 'kW', 2))],
        'Heat pump and chiller COP check.', 'Reversed Carnot limit at the refrigerant temperatures.', {
          text: impossible ? 'COP EXCEEDS THE CARNOT LIMIT' : ok ? 'COP PLAUSIBLE' : 'COP BELOW EXPECTATION', tone: ok ? 'good' : 'bad',
          checks: [check('Second law', impossible ? 'fail' : 'pass', impossible ? `A COP of ${q(COP, '', 2)} exceeds the Carnot limit of ${q(COPc, '', 2)}: the figures cannot all be right.` : `COP ${q(COP, '', 2)} is within the Carnot limit of ${q(COPc, '', 2)}.`), check('Efficiency against your benchmark', eta2 >= v.etaMin - 1e-9 ? 'pass' : 'fail', `${q(eta2, '%', 1)} against ${q(v.etaMin, '%', 0)}.`), check('Rating condition', 'verify', 'Compare claims at the same source and sink temperatures as the test standard used.')],
        });
    },
    "waste-heat-recovery-limit": (v) => {
      const K1 = v.T1 + 273.15, K2 = v.T2 + 273.15, K0 = v.T0 + 273.15;
      if (v.T2 >= v.T1) return invalid('The outlet temperature must be below the inlet temperature.');
      if (v.T2 < v.T0) return invalid('The stream cannot be cooled below the surroundings by a heat engine: raise the outlet temperature.');
      const C = v.mdot * v.cp, Q = C * (K1 - K2), Ex = C * ((K1 - K2) - K0 * Math.log(K1 / K2)), etaC = Ex / Q * 100, ofQ = v.W / Q * 100, ofEx = Ex > 0 ? v.W / Ex * 100 : Infinity, value = v.W * v.hrs * v.price;
      const over = v.W > Ex + 1e-9, ok = !over && v.W <= v.share / 100 * Ex + 1e-9, money = (x) => `A\u0024${num(Math.round(x), 0)}`;
      if (!Number.isFinite(ofEx)) return invalid('The stream holds no exergy at these temperatures.');
      return output({ Q, Ex, etaC, ofQ, ofEx, value }, 'Exergy of the stream (kW)', Ex,
        [m('Heat released', q(Q, 'kW', 1)), m('Exergy (most power possible)', q(Ex, 'kW', 2)), m('Mean Carnot efficiency', q(etaC, '%', 1)), m('Claim as a share of the heat', q(ofQ, '%', 1)), m('Claim as a share of the exergy', q(ofEx, '%', 1)), m('Yearly value of the claimed power', money(value))],
        'Waste heat recovery limit check.', 'Constant specific heat; surroundings as the cold reservoir.', {
          text: over ? 'EXCEEDS THE SECOND-LAW LIMIT' : ok ? 'CLAIM PLAUSIBLE' : 'CLAIM OPTIMISTIC', tone: ok ? 'good' : 'bad',
          checks: [check('Second law', over ? 'fail' : 'pass', over ? `${q(v.W, 'kW', 1)} is more than the ${q(Ex, 'kW', 1)} any machine could make: the claim is impossible.` : `${q(v.W, 'kW', 1)} is within the ${q(Ex, 'kW', 1)} limit.`), check('Realistic share', ok || over ? (over ? 'fail' : 'pass') : 'fail', `${q(ofEx, '%', 1)} of the exergy against your ${q(v.share, '%', 0)} benchmark.`), check('Net power', 'verify', 'Confirm the claim is net of pumps, fans and other parasitic loads.')],
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
