// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook42). SI units are explicit at each boundary.
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
    "hydraulic-filter-selection": (v) => {
      if (v.c4 < v.c6 || v.c6 < v.c14) return invalid('Counts must not increase with particle size (≥4 µm includes the larger particles).');
      const code = (c) => (c <= 0.01 ? 0 : Math.ceil(Math.log2(c / 0.01) - 1e-12)), ins = [v.c4, v.c6, v.c14], betas = [v.b4, v.b6, v.b14], outs = ins.map((c, i) => c / betas[i]), cin = ins.map(code), cout = outs.map(code), tgt = [v.t4, v.t6, v.t14];
      const eff = betas.map((b) => (1 - 1 / b) * 100), dp = v.dpR * (v.Q / v.QR) * (v.nu / v.nuR), okC = cout.every((c, i) => c <= tgt[i]), okP = dp <= v.dpMax, ok = okC && okP;
      return output({ d4: outs[0], d6: outs[1], d14: outs[2], e4: eff[0], e6: eff[1], e14: eff[2], R4: cout[0], R6: cout[1], R14: cout[2], codeIn: cin.join('/'), codeOut: cout.join('/'), dp }, 'Element pressure drop (bar)', dp,
        [m('Code upstream', cin.join('/')), m('Code downstream', cout.join('/')), m('Target code', tgt.join('/')), m('Downstream counts per mL', outs.map((c) => q(c, '', 1)).join(' / ')), m('Efficiency at 4 / 6 / 14 µm', eff.map((e) => q(e, '%', 1)).join(' / ')), m('Element pressure drop', q(dp, 'bar', 3))],
        'Hydraulic filter selection.', 'Single pass; laminar element drop.', {
          text: ok ? 'FILTER SUITABLE' : 'FILTER NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Cleanliness', okC ? 'pass' : 'fail', okC ? `${cout.join('/')} meets ${tgt.join('/')}.` : `${cout.join('/')} misses ${tgt.join('/')}: use a finer element or add off-line filtration.`), check('Pressure drop', okP ? 'pass' : 'fail', `${q(dp, 'bar', 2)} against ${q(v.dpMax, 'bar', 2)}.`), check('Ingression', 'verify', 'Check breathers and seals: ingression sets the long-term cleanliness.')],
        });
    },
    "submerged-tank-flotation": (v) => {
      const g = 9.80665, Fb = v.rhoW * g * v.V, Wt = v.mT * g, Ws = v.gs * 1000 * v.Atop * v.hs, k = 1 - v.rhoW / v.rhoC, Wb = v.mB * g * k, R = Wt + Ws + Wb, sf = R / Fb, mBreq = Math.max((v.SF * Fb - Wt - Ws) / (g * k), 0), ok = sf >= v.SF;
      return output({ Fb, Wt, Ws, Wb, R, sf, mBreq }, 'Safety factor against flotation', sf,
        [m('Buoyant uplift', q(Fb / 1000, 'kN', 2)), m('Tank weight', q(Wt / 1000, 'kN', 2)), m('Soil cover (submerged)', q(Ws / 1000, 'kN', 2)), m('Ballast (submerged)', q(Wb / 1000, 'kN', 2)), m('Safety factor', q(sf, '', 2)), m('Ballast needed for the factor', q(mBreq, 'kg', 0))],
        'Tank flotation check.', 'Empty tank; water at ground level; side friction ignored.', {
          text: ok ? 'TANK HELD DOWN' : 'TANK WILL FLOAT', tone: ok ? 'good' : 'bad',
          checks: [check('Flotation', ok ? 'pass' : 'fail', `Factor ${q(sf, '', 2)} against ${q(v.SF, '', 2)}${ok ? '.' : `: add ballast to ${q(mBreq, 'kg', 0)}.`}`), check('Hold-down straps', 'verify', 'Check the straps or anchors that tie the tank to the ballast for the full uplift.')],
        });
    },
    "cable-span-design": (v) => {
      if (v.d >= v.S) return invalid('Use a sag smaller than the span for this method.');
      const f = (a) => a * (Math.cosh(v.S / (2 * a)) - 1) - v.d; let lo = v.S / 1400, hi = v.S * v.S / v.d;
      for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
      const a = (lo + hi) / 2, Hh = v.w * a, Tmax = v.w * (a + v.d), L = 2 * a * Math.sinh(v.S / (2 * a)), ang = deg(Math.atan(Math.sinh(v.S / (2 * a)))), Vr = v.w * L / 2, sf = v.MBL * 1000 / Tmax, clearance = v.hSup - v.d, stretch = Hh * L / (v.EA * 1000);
      const okS = sf >= v.SF, okC = clearance >= v.clr, ok = okS && okC;
      return output({ a, H: Hh, Tmax, L, ang, Vr, sf, clearance, stretch }, 'Maximum tension (N)', Tmax,
        [m('Catenary parameter', q(a, 'm', 2)), m('Horizontal / end tension', `${q(Hh, '', 0)} / ${q(Tmax, 'N', 0)}`), m('Cable length', q(L, 'm', 3)), m('End angle from horizontal', q(ang, '°', 2)), m('Vertical reaction per support', q(Vr, 'N', 0)), m('Safety factor', q(sf, '', 2)), m('Low-point clearance', q(clearance, 'm', 2)), m('Elastic stretch', q(stretch * 1000, 'mm', 1))],
        'Cable span design.', 'Level supports; uniform load.', {
          text: ok ? 'SPAN ADEQUATE' : 'SPAN NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Cable strength', okS ? 'pass' : 'fail', `Factor ${q(sf, '', 2)} against ${q(v.SF, '', 1)}.`), check('Clearance', okC ? 'pass' : 'fail', `${q(clearance, 'm', 2)} against ${q(v.clr, 'm', 1)}.`), check('Temperature and creep', 'verify', 'Sag grows with temperature and creep: check the hottest case for clearance.')],
        });
    },
    "system-reliability": (v) => {
      const blocks = [1, 2, 3, 4].filter((i) => v['e' + i] > 0).map((i) => ({ i, b: v['b' + i], e: v['e' + i], k: v['k' + i] }));
      if (!blocks.length) return invalid('Enter at least one block with a characteristic life.');
      const Ru = (bl, t) => Math.exp(-Math.pow(t / bl.e, bl.b)), Rb = (bl, t) => 1 - (1 - Ru(bl, t)) ** bl.k, Rs = (t) => blocks.reduce((p, bl) => p * Rb(bl, t), 1);
      const rs = Rs(v.t), rbs = blocks.map((bl) => Rb(bl, v.t)), weakIdx = rbs.indexOf(Math.min(...rbs)), Tend = 10 * Math.max(...blocks.map((bl) => bl.e)), n = 4000, h = Tend / n;
      let mttf = Rs(0) + Rs(Tend); for (let j = 1; j < n; j++) mttf += (j % 2 ? 4 : 2) * Rs(j * h); mttf *= h / 3;
      const ok = rs * 100 >= v.target;
      return output({ Rs: rs, mttf, weak: blocks[weakIdx].i, R1: blocks[0] ? Ru(blocks[0], v.t) : 0 }, 'System reliability (%)', rs * 100,
        [...blocks.map((bl, j) => m(`Block ${bl.i}`, `unit ${q(Ru(bl, v.t) * 100, '%', 3)}, block ${q(rbs[j] * 100, '%', 3)}${bl.k > 1 ? ` (${bl.k} in parallel)` : ''}`)), m('System reliability', q(rs * 100, '%', 3)), m('Weakest block', `Block ${blocks[weakIdx].i}`), m('System mean time to failure', q(mttf, 'h', 0))],
        'System reliability.', 'Independent failures; active redundancy.', {
          text: ok ? 'TARGET MET' : 'TARGET NOT MET', tone: ok ? 'good' : 'bad',
          checks: [check('Reliability', ok ? 'pass' : 'fail', `${q(rs * 100, '%', 2)} against ${q(v.target, '%', 2)}${ok ? '.' : `: improve block ${blocks[weakIdx].i} first.`}`), check('Common cause', 'verify', 'Check shared supplies, controls and environment that could fail redundant units together.')],
        });
    },
    "learning-curve-quote": (v) => {
      const b = Math.log2(v.rate / 100); let cum = 0; for (let i = 1; i <= v.n; i++) cum += v.T1 * Math.pow(i, b);
      const Tn = v.T1 * Math.pow(v.n, b), avg = cum / v.n, labour = (cum + v.setup) * v.hr, material = v.mat * v.n, direct = labour + material, total = direct * (1 + v.oh / 100), unit = total / v.n, price = unit / (1 - v.margin / 100), mOffer = v.offer > 0 ? (1 - unit / v.offer) * 100 : -Infinity, ok = mOffer >= v.margin;
      return output({ b, Tn, cum, avg, labour, material, total, unit, price, mOffer: Number.isFinite(mOffer) ? mOffer : -100 }, 'Unit cost ($)', unit,
        [m('First / last unit hours', `${q(v.T1, '', 2)} / ${q(Tn, 'h', 2)}`), m('Cumulative / average hours', `${q(cum, '', 1)} / ${q(avg, 'h', 2)}`), m('Labour and machine cost', money(labour)), m('Material', money(material)), m('Total cost with overhead', money(total)), m('Unit cost', money(unit)), m('Price for the margin', money(price)), m('Margin at the offered price', q(mOffer, '%', 1))],
        'Learning-curve quote.', 'Unit learning curve.', {
          text: ok ? 'OFFER ACCEPTABLE' : 'OFFER BELOW TARGET', tone: ok ? 'good' : 'bad',
          checks: [check('Margin', ok ? 'pass' : 'fail', `${q(mOffer, '%', 1)} against ${q(v.margin, '%', 0)} wanted.`), check('Learning rate', 'verify', 'Base the learning rate on similar past work.')],
        });
    },
    "acceptance-sampling-plan": (v) => {
      if (v.rql <= v.aql) return invalid('The rejectable level must be above the acceptable level.');
      const lnC = (n, k) => { let s = 0; for (let i = 1; i <= k; i++) s += Math.log((n - k + i) / i); return s; };
      const Pa = (n, c, pp) => { if (pp <= 0) return 1; if (pp >= 1) return 0; let s = 0; for (let k = 0; k <= Math.min(c, n); k++) s += Math.exp(lnC(n, k) + k * Math.log(pp) + (n - k) * Math.log(1 - pp)); return Math.min(1, s); };
      const p1 = v.aql / 100, p2 = v.rql / 100, a = v.alpha / 100, bb = v.beta / 100; let n = 0, c = 0;
      for (let cc = 0; cc <= 60 && !n; cc++) { let lo = cc + 1, hi = 5000; if (Pa(hi, cc, p2) > bb) continue; while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (Pa(mid, cc, p2) <= bb) hi = mid; else lo = mid + 1; } if (Pa(lo, cc, p1) >= 1 - a) { n = lo; c = cc; } }
      if (!n) return invalid('No single sampling plan up to 5000 samples meets both risks: widen the gap between AQL and RQL.');
      const nU = v.nU || n, cU = v.nU ? v.cU : c;
      if (cU >= nU) return invalid('The acceptance number must be less than the sample size.');
      const aoql = (nn, cc) => { let best = 0; for (let j = 1; j <= 400; j++) { const pp = j / 400 * 0.3; best = Math.max(best, pp * Pa(nn, cc, pp)); } return best * 100; };
      const paA = Pa(nU, cU, p1), paR = Pa(nU, cU, p2), okA = paA >= 1 - a - 1e-12, okB = paR <= bb + 1e-12, ok = okA && okB;
      return output({ n, c, paA, paR, aoql: aoql(nU, cU), nU, cU, paDesA: Pa(n, c, p1), paDesR: Pa(n, c, p2) }, 'Designed sample size', n,
        [m('Designed plan', `n = ${q(n, '', 0)}, c = ${q(c, '', 0)}`), m('Designed plan P_a at AQL / RQL', `${q(Pa(n, c, p1) * 100, '', 2)} / ${q(Pa(n, c, p2) * 100, '%', 2)}`), m('Plan checked', `n = ${q(nU, '', 0)}, c = ${q(cU, '', 0)}`), m('P_a at AQL / RQL', `${q(paA * 100, '', 2)} / ${q(paR * 100, '%', 2)}`), m('Average outgoing quality limit', q(aoql(nU, cU), '%', 3))],
        'Acceptance sampling plan.', 'Binomial model; single sampling.', {
          text: ok ? 'PLAN PROTECTS BOTH' : 'PLAN DOES NOT PROTECT BOTH', tone: ok ? 'good' : 'bad',
          checks: [check('Producer’s risk', okA ? 'pass' : 'fail', `Accepts ${q(paA * 100, '%', 1)} of AQL lots against ${q((1 - a) * 100, '%', 1)} needed.`), check('Consumer’s risk', okB ? 'pass' : 'fail', `Accepts ${q(paR * 100, '%', 1)} of RQL lots against ${q(bb * 100, '%', 1)} allowed.`)],
        });
    },
    "measurement-uncertainty-budget": (v) => {
      const abbe = v.offset * Math.tan(rad(v.tilt / 3600)) * 1000, temp = v.L / 1000 * v.alpha * v.dT, us = [['Calibration', v.Ucal / 2], ['Resolution', v.res / Math.sqrt(12)], ['Repeatability', v.srep], ['Abbe error', abbe / Math.sqrt(3)], ['Temperature', temp / Math.sqrt(3)]];
      const uc = Math.sqrt(us.reduce((s, [, u]) => s + u * u, 0)), U = v.k * uc, tolUm = v.tol * 1000, tur = U > 0 ? tolUm / (2 * U) : Infinity, accHalf = tolUm / 2 - U, top = us.reduce((a, b) => (b[1] > a[1] ? b : a)), ok = tur >= v.turMin;
      return output({ abbe, temp, uc, U, tur: Number.isFinite(tur) ? tur : 0, accHalf }, 'Expanded uncertainty (µm)', U,
        [...us.map(([n, u]) => m(n, q(u, 'µm', 3))), m('Combined standard uncertainty', q(uc, 'µm', 3)), m('Expanded uncertainty', q(U, 'µm', 2)), m('Test uncertainty ratio', Number.isFinite(tur) ? q(tur, '', 2) : 'No uncertainty'), m('Guard-banded acceptance (from mid-tolerance)', accHalf > 0 ? `±${q(accHalf, 'µm', 1)}` : 'None: the uncertainty exceeds half the tolerance'), m('Largest contributor', top[0])],
        'Measurement uncertainty budget.', 'Uncorrelated contributors.', {
          text: ok ? 'MEASUREMENT CAPABLE' : 'MEASUREMENT NOT CAPABLE', tone: ok ? 'good' : 'bad',
          table: tbl('Uncertainty budget', ['Contributor', 'Standard uncertainty', 'Share of variance'], us.map(([n, u]) => [n, q(u, 'µm', 3), q(Math.round(u * u / (uc * uc) * 1000) / 10, '%', 1)])),
          checks: [check('Test uncertainty ratio', ok ? 'pass' : 'fail', `${Number.isFinite(tur) ? q(tur, '', 2) : '∞'} against ${q(v.turMin, '', 1)}${ok ? '.' : `: reduce ${top[0].toLowerCase()} first.`}`), check('Guard band', accHalf > 0 ? 'pass' : 'fail', accHalf > 0 ? `Accept parts within ±${q(accHalf, 'µm', 1)} of mid-tolerance.` : 'The gauge cannot decide conformance with this tolerance.')],
        });
    },
    "furnace-wall-design": (v) => {
      if (v.Thot <= v.Ta) return invalid('The hot face must be hotter than the ambient air.');
      const R = [[v.t1, v.k1], [v.t2, v.k2], [v.t3, v.k3]].reduce((s, [t, k]) => s + t / 1000 / k, 0), sig = 5.670374e-8, Ta = v.Ta + 273.15;
      if (R <= 0) return invalid('Enter at least one layer.');
      const g = (Ts) => (v.Thot - Ts) / R - (v.hc * (Ts - v.Ta) + v.eps * sig * ((Ts + 273.15) ** 4 - Ta ** 4));
      let lo = v.Ta, hi = v.Thot; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
      const Ts = (lo + hi) / 2, flux = (v.Thot - Ts) / R, Q = flux * v.area, qrad = v.eps * sig * ((Ts + 273.15) ** 4 - Ta ** 4), hcomb = flux / (Ts - v.Ta), T12 = v.Thot - flux * v.t1 / 1000 / v.k1, T23 = T12 - flux * v.t2 / 1000 / v.k2, kWh = Q / 1000 * v.hours, cost = kWh * v.price;
      const okS = Ts <= v.TsMax, okI = T12 <= v.T12Max, ok = okS && okI;
      return output({ R, Ts, flux, Q, qrad, hcomb, T12, T23, kWh, cost }, 'Surface temperature (°C)', Ts,
        [m('Conduction resistance', q(R, 'm²·K/W', 3)), m('Outside surface temperature', q(Ts, '°C', 1)), m('Heat flux (convection + radiation)', `${q(flux, 'W/m²', 0)} (radiation ${q(qrad, 'W/m²', 0)})`), m('Combined surface coefficient', q(hcomb, 'W/m²·K', 2)), m('Heat loss', q(Q / 1000, 'kW', 2)), m('Interface 1–2 / 2–3 temperature', `${q(T12, '', 0)} / ${q(T23, '°C', 0)}`), m('Energy per year', q(kWh, 'kWh', 0)), m('Cost per year', money(cost))],
        'Furnace wall design.', 'Steady state; constant conductivities.', {
          text: ok ? 'WALL ADEQUATE' : 'WALL NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Surface temperature', okS ? 'pass' : 'fail', `${q(Ts, '°C', 1)} against ${q(v.TsMax, '°C', 0)}.`), check('Insulation service limit', okI ? 'pass' : 'fail', `${q(T12, '°C', 0)} against ${q(v.T12Max, '°C', 0)}.`), check('Conductivity data', 'verify', 'Use conductivities at each layer’s mean temperature and repeat.')],
        });
    },
    "fastener-position-tolerance": (v) => {
      if (v.H <= v.F) return invalid('The clearance hole must be larger than the fastener.');
      if (v.upper < v.H) return invalid('The upper size limit must not be below the MMC size.');
      const tot = v.H - v.F, Thole = v.mode === 'floating' ? tot : tot * v.share / 100, Tthread = v.mode === 'floating' ? tot : tot - Thole;
      const pos = 2 * Math.hypot(v.dx, v.dy), inSize = v.size >= v.H && v.size <= v.upper, bonus = Math.max(0, v.size - v.H), allowed = Thole + bonus, okP = pos <= allowed + 1e-12, ok = okP && inSize;
      return output({ tot, Thole, Tthread, pos, bonus, allowed }, 'Position tolerance for the clearance holes (mm)', Thole,
        [m('Total available H − F', q(tot, 'mm', 3)), m('Position tolerance, clearance-hole part', `⌀${q(Thole, 'mm', 3)} at MMC`), m(v.mode === 'floating' ? 'Position tolerance, other part' : 'Position tolerance, threaded part (projected)', `⌀${q(Tthread, 'mm', 3)} at MMC`), m('Measured position', `⌀${q(pos, 'mm', 3)}`), m('Bonus tolerance', q(bonus, 'mm', 3)), m('Allowed for this hole', `⌀${q(allowed, 'mm', 3)}`)],
        'Fastener position tolerance.', 'Zero-clearance assembly condition.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Position', okP ? 'pass' : 'fail', `⌀${q(pos, 'mm', 3)} against ⌀${q(allowed, 'mm', 3)} allowed.`), check('Size', inSize ? 'pass' : 'fail', inSize ? 'Hole size within limits.' : 'Hole size outside its limits.'), check('Projected zone', v.mode === 'fixed' ? 'verify' : 'pass', v.mode === 'fixed' ? 'Project the threaded part’s tolerance zone by the thickness of the mating part.' : 'Floating fasteners.')],
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
