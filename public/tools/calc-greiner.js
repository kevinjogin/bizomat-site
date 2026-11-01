// KEVOS® MAKEOS calculations from thermodynamics and statistical mechanics topics (batch greiner). SI units are explicit at each boundary.
// Methods are standard thermodynamic relations; no source tables, property data or recommended settings are reproduced.
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
    "blocked-in-liquid-pressure-check": (v) => {
      if (v.p0 >= v.pd) return invalid('The blocked-in pressure is already at or above the limit: enter a limit above the starting pressure.');
      const c1 = { rigid: 0, anch: 1 - v.nu * v.nu, free: 1.25 - v.nu, joint: 1 - v.nu / 2 }[v.wall];
      const be = (v.beta - 3 * v.aS) * 1e-6, Cl = 1 / v.K, Cw = c1 * v.D / (v.E * 1000 * v.e), C = Cl + Cw;
      if (be <= 0) return invalid('The container grows at least as fast as the liquid, so no thermal pressure rise is predicted: check both expansion coefficients.');
      const rate = be / C * 10, dp = rate * v.dT, pF = v.p0 + dp, dTa = (v.pd - v.p0) / rate, hoop = pF / 10 * v.D / (2 * v.e), share = Cl / C * 100, ok = pF <= v.pd + 1e-9, pipe = v.wall !== 'rigid', thick = pipe && v.D / v.e < 20;
      return output({ rate, dp, pF, dTa, hoop, share }, 'Final pressure (bar g)', pF,
        [m('Pressure rise per kelvin', q(rate, 'bar/K', 3)), m('Pressure rise', q(dp, 'bar', 2)), m('Final pressure', q(pF, 'bar g', 2)), m('Warming that reaches the limit', q(dTa, 'K', 2)), m('Liquid share of the stiffness', q(share, '%', 1)), m(pipe ? 'Hoop stress at the final pressure' : 'Hoop stress', pipe ? q(hoop, 'MPa', 1) : 'Not calculated for a rigid container')],
        'Blocked-in liquid thermal pressure rise check.', 'Liquid-full section; constant β and K; thin-wall elastic pipe.', {
          text: ok ? 'WITHIN THE LIMIT' : 'EXCEEDS THE LIMIT: PROVIDE THERMAL RELIEF', tone: ok ? 'good' : 'bad',
          checks: [check('Final pressure against the limit', ok ? 'pass' : 'fail', `${q(pF, 'bar g', 2)} against ${q(v.pd, 'bar g', 2)}${ok ? `; ${q(dTa, 'K', 2)} of warming would reach the limit.` : `: the limit is passed after only ${q(dTa, 'K', 2)} of warming.`}`), check('Wall model', thick ? 'warn' : 'pass', thick ? `The wall is thick (D/e = ${num(v.D / v.e, 1)}): thin-wall stretch is only approximate; the rigid option gives the upper bound.` : (pipe ? 'Thin-wall pipe (D/e of 20 or more).' : 'Rigid container: wall stretch ignored, the upper bound of the rise.')), check('Liquid-full section', 'verify', 'Confirm the section is completely full of liquid; any gas pocket makes the real rise much smaller.')],
          actions: ok ? ['Record the allowable warming in the isolation procedure.'] : ['Fit a thermal relief valve, drain or vent the section when it is isolated, or keep one valve open to an expansion space.'],
        });
    },
    "gas-cylinder-real-gas-duration": (v) => {
      const R = 8.314462618, T = v.T + 273.15, pc = v.pc * 1e5, pa = v.pAtm * 1000;
      if (T <= v.Tc) return invalid('At or below the critical temperature the gas can be liquid in the cylinder (for example CO₂ or LPG): weigh the cylinder or use vapour-pressure data instead.');
      if (v.pMin >= v.pFull) return invalid('The lowest usable pressure must be below the cylinder pressure.');
      const Zof = (p, kind) => {
        let c2, c1, c0;
        if (kind === 'vdw') {
          const a = 27 * R * R * v.Tc * v.Tc / (64 * pc), b = R * v.Tc / (8 * pc), A = a * p / (R * T) ** 2, B = b * p / (R * T);
          c2 = -(1 + B); c1 = A; c0 = -A * B;
        } else {
          const k = 0.37464 + 1.54226 * v.w - 0.26992 * v.w * v.w, al = (1 + k * (1 - Math.sqrt(T / v.Tc))) ** 2;
          const a = 0.45724 * R * R * v.Tc * v.Tc / pc * al, b = 0.07780 * R * v.Tc / pc, A = a * p / (R * T) ** 2, B = b * p / (R * T);
          c2 = -(1 - B); c1 = A - 3 * B * B - 2 * B; c0 = -(A * B - B * B - B ** 3);
        }
        // Newton from the Cauchy bound, which lies beyond the largest root and the inflection point, so it descends to the gas root.
        let z = 1 + Math.max(Math.abs(c2), Math.abs(c1), Math.abs(c0));
        for (let i = 0; i < 200; i++) { const f = ((z + c2) * z + c1) * z + c0, d = (3 * z + 2 * c2) * z + c1, s = f / d; z -= s; if (Math.abs(s) < 1e-14) break; }
        return z;
      };
      const V = v.V / 1000, pF = v.pFull * 1e5 + pa, pM = v.pMin * 1e5 + pa, alt = v.eos === 'pr' ? 'vdw' : 'pr';
      const zF = Zof(pF, v.eos), zM = Zof(pM, v.eos), zAlt = Zof(pF, alt), nF = pF * V / (zF * R * T), nM = pM * V / (zM * R * T), nUse = nF - nM;
      const mass = nF * v.M / 1000, massId = pF * V / (R * T) * v.M / 1000, massAlt = pF * V / (zAlt * R * T) * v.M / 1000, use = nUse * v.M / 1000;
      const Vstd = nUse * R * (v.Tref + 273.15) / 101325 * 1000, hours = Vstd / v.Q / 60, ok = hours >= v.need - 1e-9;
      const idealGap = (massId / mass - 1) * 100, spread = Math.abs(massAlt / mass - 1) * 100, name = v.eos === 'pr' ? 'van der Waals' : 'Peng–Robinson';
      return output({ zF, zM, mass, massId, massAlt, use, Vstd, hours, idealGap, spread }, 'Running time at the use rate (h)', hours,
        [m('Compressibility factor Z now / at the lowest pressure', `${num(zF, 4)} / ${num(zM, 4)}`), m('Gas in the cylinder now', q(mass, 'kg', 3)), m('Ideal gas law would say', `${q(massId, 'kg', 3)} (${idealGap >= 0 ? '+' : ''}${num(idealGap, 1)} %)`), m(`${name} would say`, q(massAlt, 'kg', 3)), m('Usable gas down to the lowest pressure', `${q(use, 'kg', 3)} = ${q(Vstd, 'standard L', 0)}`), m('Running time at the use rate', q(hours, 'h', 2))],
        'Gas cylinder contents and duration check.', 'Cubic equation of state; uniform gas temperature; non-liquefied gas.', {
          text: ok ? 'LASTS THE REQUIRED TIME' : 'RUNS OUT TOO SOON', tone: ok ? 'good' : 'bad',
          checks: [check('Running time against the time needed', ok ? 'pass' : 'fail', `${q(hours, 'h', 2)} against ${q(v.need, 'h', 2)}${ok ? '.' : ': have a spare cylinder ready, use a manifold or reduce the use rate.'}`), check('Agreement of the two equations of state', spread > 5 ? 'warn' : 'pass', `The contents differ by ${num(spread, 1)} % between the two equations${spread > 5 ? ': confirm the contents by weighing or with the supplier’s data.' : '.'}`), check('Gas suitability', 'verify', 'Not for hydrogen, helium or liquefied gases; confirm the critical constants and acentric factor for the actual gas or mixture.')],
          actions: ok ? ['Change the cylinder when the gauge reaches the lowest usable pressure.'] : ['Plan a cylinder change or a larger supply before the job starts.'],
        });
    },
    "boiling-point-at-pressure": (v) => {
      const R = 8.314462618, T0 = v.Tb0 + 273.15, Tl = v.Tl + 273.15, k = v.L * v.M / R; // ΔH ÷ R in kelvin (kJ/kg × g/mol = J/mol)
      const inv = 1 / T0 - Math.log(v.p / v.p0) / k;
      if (inv <= 0) return invalid('The operating pressure is too far above the reference point for this estimate: choose a reference boiling point nearer the operating pressure.');
      const Tb = 1 / inv, TbC = Tb - 273.15, pv = v.p0 * Math.exp(-k * (1 / Tl - 1 / T0)), mg = Tb - Tl, span = Math.abs(Tb - T0), slope = v.p * k / (Tb * Tb), ratio = v.p / pv;
      const boils = mg <= 0, ok = mg >= v.margin - 1e-9;
      return output({ TbC, pv, mg, span, slope, ratio }, 'Boiling point at the operating pressure (°C)', TbC,
        [m('Boiling point at the operating pressure', q(TbC, '°C', 1)), m('Vapour pressure at the liquid temperature', q(pv, 'kPa abs', 3)), m('Margin below boiling', q(mg, 'K', 1)), m('Operating pressure ÷ vapour pressure', num(ratio, 3)), m('Slope of the vapour-pressure curve at boiling', q(slope, 'kPa/K', 3)), m('Distance from the reference point', q(span, 'K', 1))],
        'Boiling point and vapour pressure check.', 'Clausius–Clapeyron with constant latent heat and ideal vapour.', {
          text: boils ? 'LIQUID WILL BOIL OR FLASH' : (ok ? 'BELOW BOILING WITH MARGIN' : 'MARGIN TOO SMALL'), tone: boils ? 'bad' : (ok ? 'good' : 'warn'),
          checks: [check('Margin to boiling', ok ? 'pass' : 'fail', `${q(mg, 'K', 1)} against ${q(v.margin, 'K', 1)} required${boils ? ': the liquid boils at these conditions; raise the pressure or lower the temperature.' : (ok ? '.' : ': raise the pressure or lower the temperature.')}`), check('Distance from the reference point', span <= 30 ? 'pass' : 'warn', span <= 30 ? `The boiling point is within ${q(span, 'K', 1)} of the reference point.` : `The estimate is carried ${q(span, 'K', 1)} from its reference point (this tool flags more than 30 K): use a reference point or latent heat nearer the operating condition.`)],
          actions: ok ? ['Keep the pressure at or above the operating value; a deeper vacuum lowers the boiling point.'] : ['Raise the operating pressure or lower the highest liquid temperature, then check again.'],
        });
    },
    "carnot-limit-check": (v) => {
      const TH = v.Th + 273.15, TC = v.Tc + 273.15;
      if (TC <= 0) return invalid('The cold side temperature must be above absolute zero.');
      if (TH <= TC) return invalid('The hot side must be warmer than the cold side.');
      if (v.mode === 'en' && v.out >= v.inp) return invalid('An engine cannot deliver as much work as the heat put into it: check the output and input.');
      const lim = { hp: TH / (TH - TC), ch: TC / (TH - TC), en: 1 - TC / TH }[v.mode], act = v.out / v.inp, eta2 = act / lim * 100;
      const kwh = v.inp * v.hours, cost = kwh * v.price, save = v.out * v.hours * v.price - cost, possible = eta2 <= 100 + 1e-9, okMin = eta2 >= v.etaMin - 1e-9;
      const eng = v.mode === 'en', perf = (x) => (eng ? `${num(x * 100, 1)} %` : num(x, 2)), money = (x) => `A\u0024${num(Math.round(x), 0)}`;
      const metrics = [m(eng ? 'Actual efficiency' : 'Actual COP', perf(act)), m(eng ? 'Carnot efficiency' : 'Carnot COP', perf(lim)), m('Second-law efficiency', q(eta2, '%', 1)), m('Temperature lift', q(TH - TC, 'K', 1)), m('Yearly input energy and cost', `${q(kwh, 'kWh', 0)} / ${money(cost)}`)];
      if (v.mode === 'hp') metrics.push(m('Yearly saving over direct electric heating', money(save)));
      return output({ act, lim, eta2, kwh, cost, save }, 'Second-law efficiency (%)', eta2, metrics,
        'Carnot limit claim check.', 'Reversible (Carnot) limit between the two temperatures entered.', {
          text: !possible ? 'CLAIM EXCEEDS THE CARNOT LIMIT' : (okMin ? 'WITHIN THE LIMIT AND ACCEPTABLE' : 'BELOW YOUR ACCEPTANCE LEVEL'), tone: !possible ? 'bad' : (okMin ? 'good' : 'warn'),
          checks: [check('Second law', possible ? 'pass' : 'fail', possible ? `The claim is ${num(eta2, 1)} % of the Carnot limit.` : `The claim is ${num(eta2, 1)} % of the Carnot limit: impossible as stated; check the temperatures and the test conditions behind it.`), check('Acceptance level', okMin ? 'pass' : 'warn', `${num(eta2, 1)} % against your ${num(v.etaMin, 1)} %${okMin ? '.' : ': ask for the test report or compare another machine.'}`), check('Temperature basis', 'verify', 'Use the source and sink temperatures at the rating point, not yearly averages.')],
          actions: possible ? ['Compare machines at the same temperatures and on second-law efficiency as well as COP.'] : ['Ask the supplier for the rating standard, temperatures and test report behind the claim.'],
        });
    },
    "compressed-gas-stored-energy": (v) => {
      const p0 = v.pa * 1000, p = v.pg * 1e5 + p0, V = v.V / 1000, g = v.k;
      const Wiso = p * V * Math.log(p / p0), X = Wiso - (p - p0) * V, Es = p * V / (g - 1) * (1 - (p0 / p) ** ((g - 1) / g)), Eb = (p - p0) * V / (g - 1);
      const air = (p - p0) * V / p0, fill = v.sp * air / 60, share = X / (fill * 3.6e6) * 100, pV = v.pg / 10 * v.V, ok = pV <= v.pVlim + 1e-9;
      const Xkj = X / 1000, XkWh = X / 3.6e6, Wkj = Wiso / 1000, Eskj = Es / 1000, Ebkj = Eb / 1000;
      return output({ Xkj, XkWh, Wkj, Eskj, Ebkj, air, fill, share, pV }, 'Stored exergy (kJ)', Xkj,
        [m('Absolute pressure', q(p / 1e5, 'bar abs', 3)), m('Isothermal expansion work / exergy', `${q(Wkj, 'kJ', 1)} / ${q(Xkj, 'kJ', 1)} (${q(XkWh, 'kWh', 3)})`), m('Isentropic expansion energy', q(Eskj, 'kJ', 1)), m('Brode burst energy (upper bound)', q(Ebkj, 'kJ', 1)), m('Atmospheric air to fill / compressor energy', `${q(air, 'm³', 3)} / ${q(fill, 'kWh', 3)}`), m('Share of fill energy kept as exergy', q(share, '%', 1)), m('Pressure × volume', q(pV, 'MPa·L', 1))],
        'Compressed gas stored energy check.', 'Ideal gas, rigid vessel, ambient temperature.', {
          text: ok ? 'WITHIN YOUR pV LIMIT' : 'ABOVE YOUR pV LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Pressure × volume against your limit', ok ? 'pass' : 'fail', `${q(pV, 'MPa·L', 1)} against ${q(v.pVlim, 'MPa·L', 1)}${ok ? '.' : ': the rules for the higher category apply; review the classification, design and test method.'}`), check('Ideal gas', 'verify', 'Ideal gas assumed: check real-gas behaviour for high pressures or gases near their critical temperature.')],
          actions: ok ? ['Keep the vessel’s inspection and test records current.'] : ['Confirm the classification and design requirements with a qualified pressure-equipment engineer.'],
        });
    },
    "gas-generator-energy-check": (v) => {
      const R = 8.314462618, T = v.T + 273.15, xF = v.xF / 100, xP = v.xP / 100;
      if (Math.abs(xP - xF) < 1e-9) return invalid('The product has the same oxygen content as the feed: nothing is separated.');
      const AFmin = Math.max((1 - xP) / (1 - xF), xP / xF), xW = (v.AF * xF - xP) / (v.AF - 1);
      if (!(xW > 0 && xW < 1)) return invalid(`The air factor is too low for this purity: it must be more than ${num(AFmin, 3)}.`);
      const g = (x) => x * Math.log(x) + (1 - x) * Math.log(1 - x), molM3 = 101325 / (R * (v.Tref + 273.15));
      const w = R * T * (g(xP) + (v.AF - 1) * g(xW) - v.AF * g(xF)), wInf = R * T * (g(xP) - g(xF) - (xP - xF) * Math.log(xF / (1 - xF)));
      const Wmin = w * molM3 / 3.6e6, WminInf = wInf * molM3 / 3.6e6, eta2 = Wmin / v.SE * 100, rec = (xP < xF ? (1 - xP) / (v.AF * (1 - xF)) : xP / (v.AF * xF)) * 100;
      const kwh = v.Q * v.hours * v.SE, cost = kwh * v.price, possible = v.SE >= Wmin - 1e-15, gas = xP < xF ? 'nitrogen' : 'oxygen', money = (x) => `A\u0024${num(Math.round(x), 0)}`;
      return output({ xW, Wmin, WminInf, eta2, rec, kwh, cost }, 'Second-law efficiency (%)', eta2,
        [m('Oxygen in the waste stream', q(xW * 100, '%', 2)), m(`Recovery of the ${gas}`, q(rec, '%', 1)), m('Minimum work at this air factor', q(Wmin, 'kWh/m³', 5)), m('Minimum with complete recovery', q(WminInf, 'kWh/m³', 5)), m('Second-law efficiency', q(eta2, '%', 2)), m('Yearly energy and cost', `${q(kwh, 'kWh', 0)} / ${money(cost)}`)],
        'Gas separation energy check.', 'Ideal two-part mixture; products and waste at feed temperature and pressure.', {
          text: possible ? 'ABOVE THE THERMODYNAMIC MINIMUM' : 'BELOW THE THERMODYNAMIC MINIMUM: CLAIM NOT POSSIBLE', tone: possible ? 'good' : 'bad',
          checks: [check('Actual against minimum work', possible ? 'pass' : 'fail', possible ? `${q(v.SE, 'kWh/m³', 4)} is ${num(v.SE / Wmin, 1)} times the minimum.` : `${q(v.SE, 'kWh/m³', 4)} is less than the minimum of ${q(Wmin, 'kWh/m³', 5)}: check the units and basis of the claim.`), check('Air factor', 'pass', `${num(v.AF, 3)} against a least possible ${num(AFmin, 3)} for this purity.`), check('Energy basis', 'verify', 'Confirm the specific energy includes the air compressor and dryer and uses the same reference temperature as the flow.')],
          actions: ['Specify the lowest purity the process needs; each step in purity raises the air factor and the energy.'],
        });
    },
    "quench-tank-temperature-check": (v) => {
      if (v.Tl <= v.Tb) return invalid('The load must be hotter than the bath.');
      if (v.Tmax <= v.Tb) return invalid('The bath is already at or above its highest allowed temperature.');
      if (v.Tmax >= v.Tl) return invalid('The highest allowed bath temperature must be below the load temperature.');
      const CL = v.m * v.c, CB = v.Vq / 1000 * v.rho * v.cq, mix = (T) => (CL * v.Tl + CB * T) / (CL + CB);
      const Tf = mix(v.Tb), rise = Tf - v.Tb, Q = CL * (v.Tl - Tf), QMJ = Q / 1e6, P = Q * v.rate / 3600 / 1000;
      const dS = (CL * Math.log((Tf + 273.15) / (v.Tl + 273.15)) + CB * Math.log((Tf + 273.15) / (v.Tb + 273.15))) / 1000;
      let n = 0, Tn = v.Tb;
      while (n < 1000) { const t2 = mix(Tn); if (t2 > v.Tmax + 1e-9) break; Tn = t2; n++; }
      const okOne = Tf <= v.Tmax + 1e-9, okCool = P <= v.cool + 1e-9;
      return output({ Tf, rise, QMJ, P, dS, n }, 'Bath temperature after one load (°C)', Tf,
        [m('Bath temperature after one load', q(Tf, '°C', 1)), m('Rise per load', q(rise, 'K', 2)), m('Heat released per load', q(QMJ, 'MJ', 2)), m('Entropy generated per load', q(dS, 'kJ/K', 2)), m('Loads in a row before the limit, no cooling', n >= 1000 ? '1,000 or more' : num(n, 0)), m('Average heat input / cooler capacity', `${q(P, 'kW', 1)} / ${q(v.cool, 'kW', 1)}`)],
        'Quench tank temperature check.', 'Well-mixed bath; no losses; mean specific heats.', {
          text: !okOne ? 'ONE LOAD OVERHEATS THE BATH' : (okCool ? 'BATH STAYS WITHIN ITS LIMIT' : 'COOLER TOO SMALL FOR THE LOAD RATE'), tone: okOne && okCool ? 'good' : 'bad',
          checks: [check('One load against the bath limit', okOne ? 'pass' : 'fail', `${q(Tf, '°C', 1)} against ${q(v.Tmax, '°C', 1)}${okOne ? '.' : ': use a larger bath, a lighter load or a cooler bath.'}`), check('Cooler against the average heat input', okCool ? 'pass' : 'fail', `${q(P, 'kW', 1)} against ${q(v.cool, 'kW', 1)}${okCool ? '.' : ': the bath will climb from load to load; fit a larger cooler or slow the load rate.'}`), check('Quenchant limits', 'verify', 'Confirm the highest allowed temperature against the quenchant supplier’s data and the flash-point margin.')],
          actions: okOne && okCool ? ['Log the bath temperature before each load to confirm the balance.'] : ['Increase the bath volume or cooling, or reduce the load mass or rate, and check again.'],
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
