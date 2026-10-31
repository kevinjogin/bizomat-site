// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook87). SI units are explicit at each boundary.
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
    "area-converter": (v) => {
      const F = {"m2":1,"km2":1000000,"ha":10000,"are":100,"cm2":0.0001,"mm2":0.000001,"um2":1e-12,"in2":0.00064516,"ft2":0.09290304,"yd2":0.83612736,"acre":4046.8564224000006,"mi2":2589988.110336,"mil2":6.451599999999999e-10,"cmil":5.067074790974976e-10,"cin":0.0005067074790974977}, L = {"m2":"m²","km2":"km²","ha":"hectare","are":"are","cm2":"cm²","mm2":"mm²","um2":"µm²","in2":"in²","ft2":"ft²","yd2":"yd²","acre":"acre","mi2":"mile²","mil2":"square mil","cmil":"circular mil","cin":"circular inch"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["m2"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["m2"], q(si, '', 8))],
        'The entered area is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Area in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["m2"] + '.')],
        });
    },
    "volume-converter": (v) => {
      const F = {"m3":1,"L":0.001,"mL":0.000001,"mm3":1e-9,"hL":0.1,"in3":0.000016387064,"ft3":0.028316846592000004,"yd3":0.764554857984,"usgal":0.003785411784,"usqt":0.000946352946,"uspt":0.000473176473,"usfloz":0.0000295735295625,"ukgal":0.00454609,"ukqt":0.0011365225,"ukpt":0.00056826125,"ukfloz":0.0000284130625,"usbu":0.03523907016688,"ukbu":0.03636872}, L = {"m3":"m³","L":"litre (dm³)","mL":"mL (cm³)","mm3":"mm³","hL":"hectolitre","in3":"in³","ft3":"ft³","yd3":"yd³","usgal":"US gallon","usqt":"US quart","uspt":"US pint","usfloz":"US fluid ounce","ukgal":"Imperial gallon","ukqt":"Imperial quart","ukpt":"Imperial pint","ukfloz":"Imperial fluid ounce","usbu":"US bushel (2150.42 in³)","ukbu":"Imperial bushel (8 gal)"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["m3"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["m3"], q(si, '', 8))],
        'The entered volume is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Volume in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["m3"] + '.')],
        });
    },
    "inertia-converter": (v) => {
      const IN = 0.0254, FT = 0.3048, LB = 0.45359237, LBF = LB * 9.80665;
      const U = { kgm2: ['I', 'kg·m²', 1], gcm2: ['I', 'g·cm²', 1e-7], kgmm2: ['I', 'kg·mm²', 1e-6], lbft2: ['I', 'lb·ft²', LB * FT * FT], lbin2: ['I', 'lb·in²', LB * IN * IN], ozin2: ['I', 'oz·in²', LB / 16 * IN * IN], slugft2: ['I', 'slug·ft²', LBF / FT * FT * FT], lbfins2: ['I', 'lbf·in·s²', LBF * IN],
        m4: ['A', 'm⁴', 1], cm4: ['A', 'cm⁴', 1e-8], mm4: ['A', 'mm⁴', 1e-12], in4: ['A', 'in⁴', IN ** 4], ft4: ['A', 'ft⁴', FT ** 4],
        m3: ['Z', 'm³', 1], cm3: ['Z', 'cm³', 1e-6], mm3: ['Z', 'mm³', 1e-9], in3: ['Z', 'in³', IN ** 3], ft3: ['Z', 'ft³', FT ** 3],
        kgms: ['P', 'kg·m/s', 1], lbfts: ['P', 'lb·ft/s', LB * FT], lbins: ['P', 'lb·in/s', LB * IN] };
      const kindName = { I: 'mass moment of inertia', A: 'second moment of area', Z: 'section modulus', P: 'momentum' };
      const [kind, lab, fac] = U[v.from], si = v.value * fac, siKey = Object.keys(U).find((k) => U[k][0] === kind);
      const rows = Object.keys(U).filter((k) => U[k][0] === kind).map((k) => [U[k][1], q(si / U[k][2], '', 8)]);
      return output({ si }, `Value in ${U[siKey][1]}`, si,
        [m('Quantity', kindName[kind]), m('Entered value', `${q(v.value, '', 8)} ${lab}`), m(`In ${U[siKey][1]}`, q(si, '', 8))],
        `The entered ${kindName[kind]} is shown in every listed unit.`, 'Conversion factors are exact by definition; round the result to the precision your source gives.', {
          text: 'CONVERTED', tone: 'good', table: tbl(`${kindName[kind][0].toUpperCase() + kindName[kind].slice(1)} in each unit`, ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', `Exact factors relative to ${U[siKey][1]}.`), check('Kind of quantity', 'verify', 'Confirm the source means a mass moment of inertia or a second moment of area; they are not interchangeable.')],
        });
    },
    "silent-chain-sprocket-inspection": (v) => {
      if (!(v.P >= 9.525 - 0.01)) return invalid('These rules are for 3/8 in (9.525 mm) and larger pitch.');
      const N = v.Nt, t = rad(180 / N), PD = v.P / Math.sin(t), cot = 1 / Math.tan(t), Pin = v.P / 25.4;
      const OD = v.P * (cot + 0.08), blank = OD + 0.02 * 25.4, centre = PD - 0.125 * v.P / Math.sin(rad(30) - t), OPD = N % 2 ? centre * Math.cos(t / 2) + 0.625 * v.P : centre + 0.625 * v.P;
      const tolIn = 0.004 + 0.001 * Pin * Math.sqrt(N), tol = tolIn * 25.4, OPDmin = OPD - tol;
      const tirIn = Math.min(0.032, Math.max(0.006, 0.001 * PD / 25.4)), tir = tirIn * 25.4;
      const G = v.P * (cot - 1.16), Gmin = G - 0.03 * 25.4;
      const okO = v.OPDm <= OPD + 1e-9 && v.OPDm >= OPDmin - 1e-9, okT = v.TIRm <= tir + 1e-9, okG = v.Gm <= G + 1e-9 && v.Gm >= Gmin - 1e-9, ok = okO && okT && okG;
      return output({ PD, OD, blank, OPD, tol, tolIn, OPDmin, tir, G, Gmin }, 'Nominal over-pin diameter (mm)', OPD,
        [m('Pitch diameter', q(PD, 'mm', 6)), m('Outside diameter (rounded teeth) / blank', `${q(OD, 'mm', 6)} / ${q(blank, 'mm', 6)}`), m('Over-pin diameter limits', `${q(OPDmin, 'mm', 6)} to ${q(OPD, 'mm', 6)}`), m('Over-pin tolerance', `−${q(tol, 'mm', 4)} (−${q(tolIn, 'in', 4)})`), m('Eccentricity limit (TIR)', q(tir, 'mm', 4)), m('Guide groove diameter limits', `${q(Gmin, 'mm', 5)} to ${q(G, 'mm', 5)}`)],
        'Silent chain sprocket inspection.', 'ANSI B29.2M sprocket diameters and tolerances as given in the handbook.', {
          text: ok ? 'SPROCKET ACCEPTED' : 'SPROCKET REJECTED', tone: ok ? 'good' : 'bad',
          checks: [check('Over-pin diameter', okO ? 'pass' : 'fail', `${q(v.OPDm, 'mm', 6)} measured against ${q(OPDmin, 'mm', 6)} to ${q(OPD, 'mm', 6)}.`), check('Eccentricity', okT ? 'pass' : 'fail', `${q(v.TIRm, 'mm', 4)} TIR against ${q(tir, 'mm', 4)} allowed.`), check('Guide groove', okG ? 'pass' : 'fail', `${q(v.Gm, 'mm', 5)} against ${q(Gmin, 'mm', 5)} to ${q(G, 'mm', 5)}.`), check('Gauge pins', 'verify', `Measure over pins of ${q(0.625 * v.P, 'mm', 4)} diameter (0.625 × pitch).`)],
        });
    },
    "fuel-oil-heating-value": (v) => {
      const be = v.from === 'be' ? v.be : 140 / v.sg - 130, sg = 140 / (130 + be);
      if (!(be >= 10)) return invalid('The Baumé scale for light liquids starts at 10 degrees (specific gravity 1.0); enter a specific gravity below 1.');
      const hv = 18650 + 40 * (be - 10), MJkg = hv * 2.326 / 1000, rho = sg * 999.0, MJL = MJkg * rho / 1000, BTUgal = hv * rho * 0.003785411784 / 0.45359237;
      const kgh = v.Q * 3.6 / (v.eff / 100) / MJkg, Lh = kgh / rho * 1000, Ltot = Lh * v.hours, kgtot = kgh * v.hours, inRange = hv >= 18500 && hv <= 21100;
      return output({ be, sg, hv, MJkg, rho, MJL, BTUgal, kgh, Lh, Ltot, kgtot }, 'Heating value (MJ/kg)', MJkg,
        [m('Degrees Baumé / specific gravity', `${q(be, '°Bé', 4)} / ${q(sg, '', 5)}`), m('Heating value', `${q(hv, 'BTU/lb', 5)} (${q(MJkg, 'MJ/kg', 4)})`), m('Density', q(rho, 'kg/m³', 4)), m('Heat per litre / per US gallon', `${q(MJL, 'MJ/L', 4)} / ${q(BTUgal, 'BTU', 5)}`), m('Oil burned', `${q(kgh, 'kg/h', 4)} (${q(Lh, 'L/h', 4)})`), m('Oil over the running time', `${q(Ltot, 'L', 5)} (${q(kgtot, 'kg', 5)})`)],
        'Fuel oil heating value and fuel use.', 'Handbook approximate heating value formula and Baumé scale.', {
          text: 'HEATING VALUE ESTIMATED', tone: inRange ? 'good' : 'warn',
          checks: [check('Range of the formula', inRange ? 'pass' : 'verify', `${q(hv, 'BTU/lb', 5)} ${inRange ? 'lies within' : 'lies outside'} the 18,500 to 21,100 BTU/lb range of the oils the formula was fitted to.`), check('Tested value', 'verify', 'Use the supplier’s tested heating value for contracts and efficiency tests.')],
        });
    },
    "surface-roughness-acceptance": (v) => {
      const low = v.lower === 'yes';
      if (v.nAbove + (low ? v.nBelow : 0) > v.n) return invalid('The values above and below the limits cannot outnumber the values measured.');
      if (!(v.vmin <= v.vmax)) return invalid('The smallest value cannot be larger than the largest value.');
      if (low && !(v.Lw < v.U)) return invalid('The lower limit must be below the upper limit.');
      const shareAbove = v.nAbove / v.n * 100, shareBelow = low ? v.nBelow / v.n * 100 : 0, ms1 = v.mean + v.sd, ln = 5 * v.lr;
      let okU, okL, viaExc = false;
      if (v.rule === 'max') { okU = v.vmax <= v.U; okL = !low || v.vmin >= v.Lw; }
      else { okU = shareAbove <= 16; if (!okU && ms1 <= v.U) { okU = true; viaExc = true; } okL = !low || shareBelow <= 16; }
      const ok = okU && okL;
      const checks = v.rule === 'max'
        ? [check('Upper limit (max rule)', okU ? 'pass' : 'fail', `Largest value ${q(v.vmax, 'µm', 4)} against ${q(v.U, 'µm', 4)} max.`)]
        : [check('Upper limit (16 % rule)', viaExc ? 'verify' : okU ? 'pass' : 'fail', `${q(shareAbove, '%', 3)} of values above ${q(v.U, 'µm', 4)}${viaExc ? `; accepted only because mean + σ = ${q(ms1, 'µm', 4)} is within the limit — confirm the values are normally distributed` : ''}.`)];
      if (low) checks.push(check('Lower limit', okL ? 'pass' : 'fail', v.rule === 'max' ? `Smallest value ${q(v.vmin, 'µm', 4)} against ${q(v.Lw, 'µm', 4)}.` : `${q(shareBelow, '%', 3)} of values below ${q(v.Lw, 'µm', 4)}.`));
      checks.push(check('Evaluation length', 'verify', `Measure each value over ${q(ln, 'mm', 4)} (five sampling lengths of ${q(v.lr, 'mm', 4)}).`));
      return output({ shareAbove, shareBelow, ms1, ln }, 'Share of values above the upper limit (%)', shareAbove,
        [m('Rule', v.rule === 'max' ? 'Max rule' : '16 % rule'), m('Values above the upper limit', `${v.nAbove} of ${v.n} (${q(shareAbove, '%', 3)})`), m('Values below the lower limit', low ? `${v.nBelow} of ${v.n} (${q(shareBelow, '%', 3)})` : 'No lower limit'), m('Largest value / upper limit', `${q(v.vmax, 'µm', 4)} / ${q(v.U, 'µm', 4)}`), m('Mean + one standard deviation', q(ms1, 'µm', 4)), m('Evaluation length ln = 5 lr', q(ln, 'mm', 4))],
        'Surface roughness acceptance.', 'ISO 16 % and max rules as described in the handbook.', { text: ok ? 'SURFACE ACCEPTED' : 'SURFACE REJECTED', tone: ok ? (viaExc ? 'warn' : 'good') : 'bad', checks });
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
