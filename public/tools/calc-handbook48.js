// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook48). SI units are explicit at each boundary.
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
    "water-line-design-check": (v) => {
      if (v.rating <= v.pS) return invalid('The rating must exceed the supply pressure.');
      const d = v.d / 1000, A = PI * d * d / 4, Qs = v.Q / 60000, vel = Qs / A, Re = vel * d / (v.nu * 1e-6);
      let f; const lam = Re < 2300;
      if (Re === 0) f = 0; else if (lam) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const dp = (f * v.L / d + v.K) * v.rho * vel * vel / 2 / 1e5, lift = v.rho * 9.80665 * v.rise / 1e5, pOut = v.pS - dp - lift, dmin = Math.sqrt(4 * Qs / (PI * v.vMax)) * 1000;
      const Kb = v.Kb * 1e9, E = v.E * 1e9, a = Math.sqrt((Kb / v.rho) / (1 + Kb * v.d / (E * v.t))), tcrit = 2 * v.L / a, dpJ = v.rho * a * vel / 1e5, surge = v.tc <= tcrit ? dpJ : dpJ * tcrit / v.tc, ptot = v.pS + surge;
      const okV = vel <= v.vMax, okP = pOut >= v.pMin, okS = ptot <= v.rating, ok = okV && okP && okS;
      return output({ vel, Re, f, dp, lift, pOut, dmin, a, tcrit, dpJ, surge, ptot }, 'Outlet pressure (bar)', pOut,
        [m('Velocity', q(vel, 'm/s', 2)), m('Smallest bore for the velocity limit', q(dmin, 'mm', 1)), m('Reynolds number / friction factor', `${q(Re, '', 0)} / ${q(f, '', 5)}`), m('Friction loss', q(dp, 'bar', 3)), m('Static lift', q(lift, 'bar', 3)), m('Pressure at the outlet', q(pOut, 'bar', 2)), m('Wave speed / critical closing time', `${q(a, 'm/s', 0)} / ${q(tcrit, 's', 3)}`), m('Surge for this closing time', q(surge, 'bar', 2)), m('Peak pressure', q(ptot, 'bar', 2))],
        'Water supply line check.', 'Steady flow; rigid-column surge.', {
          text: ok ? 'LINE ADEQUATE' : 'LINE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Velocity', okV ? 'pass' : 'fail', `${q(vel, 'm/s', 2)} against ${q(v.vMax, 'm/s', 2)}${okV ? '.' : `: use at least ${q(dmin, 'mm', 1)} bore.`}`), check('Outlet pressure', okP ? 'pass' : 'fail', `${q(pOut, 'bar', 2)} against ${q(v.pMin, 'bar', 2)} needed.`), check('Surge', okS ? 'pass' : 'fail', `${q(ptot, 'bar', 1)} peak against ${q(v.rating, 'bar', 0)} rating.`), check('Flow regime', lam || Re > 4000 ? 'pass' : 'warn', lam ? 'Laminar flow.' : Re > 4000 ? 'Turbulent flow.' : 'Transitional flow: the friction factor is uncertain.')],
        });
    },
    "pipe-run-expansion-check": (v) => {
      if (v.wt * 2 >= v.OD) return invalid('The wall is too thick for this diameter.');
      const dT = Math.abs(v.T2 - v.T1), Es = v.E * 1000, growth = v.alpha * 1e-6 * v.L * 1000 * dT, sig = Es * v.alpha * 1e-6 * dT, ID = v.OD - 2 * v.wt, A = PI / 4 * (v.OD ** 2 - ID ** 2), I = PI / 64 * (v.OD ** 4 - ID ** 4), Fa = sig * A;
      const delta = v.type === 'L' ? growth : growth / 2, legReq = Math.sqrt(3 * Es * v.OD * delta / v.Sa), sLeg = 3 * Es * v.OD * delta / v.leg ** 2, Fleg = 12 * Es * I * delta / v.leg ** 3;
      const okS = sLeg <= v.Sa * (1 + 1e-9), okF = Fleg / 1000 <= v.Fallow, ok = okS && okF;
      return output({ growth, sig, A, I, Fa, delta, legReq, sLeg, Fleg }, 'Leg length needed (mm)', legReq,
        [m('Thermal growth of the run', q(growth, 'mm', 1)), m('Stress / anchor force if fully restrained', `${q(sig, 'MPa', 0)} / ${q(Fa / 1000, 'kN', 0)}`), m('Displacement each leg takes', q(delta, 'mm', 1)), m('Leg length needed', q(legReq, 'mm', 0)), m('Bending stress with the leg you have', q(sLeg, 'MPa', 1)), m('Anchor force with the leg you have', q(Fleg / 1000, 'kN', 2))],
        'Pipe run expansion check.', 'Guided-cantilever estimate.', {
          text: ok ? 'LOOP ADEQUATE' : 'LOOP NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Leg stress', okS ? 'pass' : 'fail', `${q(sLeg, 'MPa', 0)} against ${q(v.Sa, 'MPa', 0)}${okS ? '.' : `: make the leg at least ${q(legReq, 'mm', 0)}.`}`), check('Anchor force', okF ? 'pass' : 'fail', `${q(Fleg / 1000, 'kN', 2)} against ${q(v.Fallow, 'kN', 1)}.`), check('Piping code', 'verify', 'Confirm with a flexibility analysis to the applicable piping code.')],
        });
    },
    "pivot-pin-retention-check": (v) => {
      if (2 * v.R <= v.d) return invalid('The edge distance must exceed the pin radius.');
      if (v.dg * 2 >= v.d) return invalid('The groove is too deep for this pin.');
      const F = v.F * 1000, M = F * (v.a + 2 * v.bf + 4 * v.g) / 8, sb = 32 * M / (PI * v.d ** 3), tau = F / (2 * PI * v.d * v.d / 4), be = F / (v.d * v.a), bfk = F / (2 * v.d * v.bf), st = F / ((2 * v.R - v.d) * v.a), tt = F / (2 * v.a * (v.R - v.d / 2));
      const us = [sb / v.sbA, tau / v.tpA, be / v.bA, bfk / v.bA, st / v.stA, tt / v.tA].map((x) => x * 100), umax = Math.max(...us), names = ['Pin bending', 'Pin shear', 'Eye bearing', 'Fork bearing', 'Eye net tension', 'Eye tear-out'];
      const frac = v.ring === 'stamped' ? v.contact / 100 : 1, Ps = PI * v.d * v.rt * v.Ss / v.K, PG = PI * v.d * v.dg * v.Sy / v.K * frac, Pallow = Math.min(Ps, PG), Pn = v.Fax * 1000, Y = v.K * Pn / (PI * v.d * v.Sc);
      const okC = umax <= 100, okR = Pn <= Pallow, okY = Y <= v.ext, ok = okC && okR && okY;
      return output({ M, sb, tau, be, bfk, st, tt, umax, Ps, PG, Pallow, Y }, 'Highest clevis utilisation (%)', umax,
        [m('Pin bending moment', q(M / 1000, 'N·m', 1)), ...names.map((n, k) => m(n, q(us[k], '%', 0))), m('Ring shear / groove yield capacity', `${q(Ps / 1000, '', 2)} / ${q(PG / 1000, 'kN', 2)}`), m('Allowable axial thrust', q(Pallow / 1000, 'kN', 2)), m('Least groove distance from the end', q(Y, 'mm', 2))],
        'Pivot pin and retaining ring check.', 'Static loads; spread bearing.', {
          text: ok ? 'PIN ASSEMBLY ADEQUATE' : 'PIN ASSEMBLY NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          table: tbl('Clevis checks', ['Check', 'Utilisation'], names.map((n, k) => [n, q(us[k], '%', 0)])),
          checks: [check('Clevis', okC ? 'pass' : 'fail', `Highest utilisation ${q(umax, '%', 0)} (${names[us.indexOf(Math.max(...us))]}).`), check('Retaining ring', okR ? 'pass' : 'fail', `${q(v.Fax, 'kN', 2)} against ${q(Pallow / 1000, 'kN', 2)} (${Ps <= PG ? 'ring shear' : 'groove yield'} governs).`), check('Pin projection', okY ? 'pass' : 'fail', `${q(v.ext, 'mm', 1)} against ${q(Y, 'mm', 2)} needed (and usually 2–3 groove depths).`)],
        });
    },
    "maintenance-interval-plan": (v) => {
      const gamma = (z) => { const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (z < 0.5) return PI / (Math.sin(PI * z) * gamma(1 - z)); z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i); const t = z + g + 0.5; return Math.sqrt(2 * PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x; };
      const R = (t) => Math.exp(-Math.pow(t / v.eta, v.beta)), integ = (T) => { const n = 400, h = T / n; let s = R(0) + R(T); for (let j = 1; j < n; j++) s += (j % 2 ? 4 : 2) * R(j * h); return s * h / 3; }, C = (T) => (v.Cp * R(T) + v.Cf * (1 - R(T))) / integ(T);
      const mttf = v.eta * gamma(1 + 1 / v.beta), cRTF = v.Cf / mttf, b10 = v.eta * Math.pow(-Math.log(0.9), 1 / v.beta), tR = v.eta * Math.pow(-Math.log(v.Rt / 100), 1 / v.beta);
      const steps = 300, Tmax = 3 * v.eta; let best = 1, cBest = Infinity;
      for (let i = 1; i <= steps; i++) { const c = C(Tmax * i / steps); if (c < cBest) { cBest = c; best = i; } }
      let lo = Tmax * Math.max(best - 1, 0.01) / steps, hi = Tmax * Math.min(best + 1, steps) / steps; const gr = (Math.sqrt(5) - 1) / 2;
      for (let k = 0; k < 80; k++) { const x1 = hi - gr * (hi - lo), x2 = lo + gr * (hi - lo); if (C(x1) < C(x2)) hi = x2; else lo = x1; }
      const Topt = (lo + hi) / 2, T = v.Tuse || Topt, RT = R(T), cT = C(T), h = v.beta / v.eta * Math.pow(T / v.eta, v.beta - 1), pays = cT < cRTF * (1 - 1e-6), save = (cRTF - cT) * v.hpy, okR = RT * 100 >= v.Rt - 1e-9;
      return output({ R: RT, h, b10, mttf, tR, Topt, T, cT, cRTF, save }, 'Cost per operating hour at the interval ($/h)', cT,
        [m('Interval used', `${q(T, 'h', 0)}${v.Tuse ? '' : ' (lowest cost)'}`), m('Reliability over the interval', q(RT * 100, '%', 2)), m('Interval for the reliability wanted', q(tR, 'h', 0)), m('Lowest-cost interval', q(Topt, 'h', 0)), m('Cost per hour: planned / run to failure', `${money(cT)} / ${money(cRTF)}`), m('Yearly saving against run to failure', money(save)), m('B10 life / mean life', `${q(b10, '', 0)} / ${q(mttf, 'h', 0)}`)],
        pays ? 'Planned replacement costs less per hour than running to failure.' : 'Running to failure costs no more than planned replacement.', 'Age replacement; as-new after replacement.', {
          text: pays ? 'PLANNED REPLACEMENT PAYS' : 'RUN TO FAILURE', tone: pays ? 'good' : 'bad',
          checks: [check('Cost', pays ? 'pass' : 'fail', `${money(cT)} per hour against ${money(cRTF)} run to failure.`), check('Reliability', okR ? 'pass' : 'warn', okR ? `${q(RT * 100, '%', 1)} meets ${q(v.Rt, '%', 1)}.` : `${q(RT * 100, '%', 1)} is below ${q(v.Rt, '%', 1)}: shorten the interval to ${q(tR, 'h', 0)} if reliability matters more than cost.`), check('Failure pattern', v.beta > 1 ? 'pass' : 'warn', v.beta > 1 ? 'Wear-out (β > 1).' : 'No wear-out: planned replacement cannot reduce failures.')],
        });
    },
    "process-change-trial": (v) => {
      const lgamma = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp); let ser = 1.000000000190015; for (const cj of c) ser += cj / ++y; return -tmp + Math.log(2.5066282746310005 * ser / x); };
      const betacf = (a, b, x) => { let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d; for (let mm = 1; mm <= 300; mm++) { const m2 = 2 * mm; let aa = mm * (b - mm) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c; aa = -(a + mm) * (qab + mm) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break; } return h; };
      const ibeta = (a, b, x) => { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; };
      const tcrit = (df, p) => { let lo = 0, hi = 1000; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (ibeta(df / 2, 0.5, df / (df + mid * mid)) > p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const a1 = v.s1 * v.s1 / v.n1, a2 = v.s2 * v.s2 / v.n2, se = Math.sqrt(a1 + a2);
      if (se === 0) return invalid('At least one standard deviation must be greater than zero.');
      const alpha = Number(v.alpha), za = { 0.1: 1.6449, 0.05: 1.96, 0.01: 2.5758 }[v.alpha], zb = { 80: 0.8416, 90: 1.2816, 95: 1.6449 }[v.power], nRaw = 2 * ((za + zb) * v.sd / v.delta) ** 2, nPlan = Math.max(2, Math.ceil(nRaw - 1e-9));
      const diff = v.m1 - v.m2, t = diff / se, df = (a1 + a2) ** 2 / (a1 * a1 / (v.n1 - 1) + a2 * a2 / (v.n2 - 1)), p = ibeta(df / 2, 0.5, df / (df + t * t)), tc = tcrit(df, alpha), lo = diff - tc * se, hi = diff + tc * se;
      const gain = v.goal === 'lower' ? diff : -diff, sig = p < alpha, better = sig && gain > 0, worse = sig && gain < 0, okN = Math.min(v.n1, v.n2) >= nPlan, okD = Math.abs(diff) >= v.delta;
      return output({ nRaw, nPlan, diff, gain, se, t, df, p, lo, hi }, 'p-value (two-sided)', p,
        [m('Parts per group for the trial', `${nPlan} (from ${q(nRaw, '', 2)})`), m('Difference before − after', q(diff, '', 5)), m('Improvement in the better direction', q(gain, '', 5)), m('t statistic / degrees of freedom', `${q(t, '', 4)} / ${q(df, '', 2)}`), m('p-value (two-sided)', q(p, '', 5)), m(`${q(100 * (1 - alpha), '%', 0)} confidence interval`, `${q(lo, '', 5)} to ${q(hi, '', 5)}`)],
        better ? 'The change improved the process mean.' : worse ? 'The change made the process mean worse.' : 'The trial does not prove a difference.', 'Independent, roughly normal samples.', {
          text: better ? 'IMPROVEMENT CONFIRMED' : worse ? 'CHANGE MADE IT WORSE' : 'NO PROVEN DIFFERENCE', tone: better ? 'good' : 'bad',
          checks: [check('Significance', sig ? 'pass' : 'fail', `p = ${q(p, '', 4)} against α = ${v.alpha}.`), check('Sample size', okN ? 'pass' : 'warn', `${Math.min(v.n1, v.n2)} in the smaller group against ${nPlan} planned${okN ? '.' : ': the trial may miss a real difference.'}`), check('Practical size', okD ? 'pass' : 'warn', `${q(Math.abs(diff), '', 4)} against the ${q(v.delta, '', 4)} worth detecting.`)],
        });
    },
    "timber-order-plan": (v) => {
      if (v.wet < v.dry) return invalid('The tested mass cannot be less than the oven-dry mass.');
      const qtyOrder = Math.ceil(v.qty * (1 + v.waste / 100) - 1e-9), bf = (v.t / 25.4) * (v.w / 25.4) * (v.L / 0.3048) / 12 * qtyOrder, vol = v.t * v.w * v.L * qtyOrder / 1e6, cost = v.pmode === 'bf' ? bf * v.price : vol * v.price;
      const MC = (v.wet - v.dry) / v.dry * 100, rho = 1000 * v.G * (1 + MC / 100) / (1 + 0.009 * v.G * MC), mass = vol * rho, trips = Math.ceil(mass / v.payload - 1e-9), ok = MC <= v.MCmax;
      return output({ qtyOrder, bf, vol, cost, MC, rho, mass, trips }, 'Order cost ($)', cost,
        [m('Pieces to order', q(qtyOrder, '', 0)), m('Board feet', q(bf, 'fbm', 1)), m('Volume', q(vol, 'm³', 3)), m('Cost', money(cost)), m('Moisture content', q(MC, '%', 1)), m('Density at that moisture', q(rho, 'kg/m³', 1)), m('Mass of the order', q(mass, 'kg', 0)), m('Deliveries', q(trips, '', 0))],
        'Timber order plan.', 'Sizes as entered; one moisture sample.', {
          text: ok ? 'TIMBER READY TO USE' : 'TIMBER TOO WET', tone: ok ? 'good' : 'bad',
          checks: [check('Moisture content', ok ? 'pass' : 'fail', `${q(MC, '%', 1)} against ${q(v.MCmax, '%', 0)}${ok ? '.' : ': dry or season it before use.'}`), check('Fibre saturation', MC <= 30 ? 'pass' : 'warn', MC <= 30 ? 'Within the range of the density formula.' : 'Above fibre saturation the density formula is approximate.'), check('Sampling', 'verify', 'Test several pieces from different parts of the delivery.')],
        });
    },
    "orifice-restrictor-design": (v) => {
      const Qs = v.Q / 60000, vth = Math.sqrt(2 * v.dp * 1e5 / v.rho), dExact = Math.sqrt(4 * Qs / (PI * v.Cd * vth)) * 1000, dUse = v.dCh || Math.max(v.step, Math.round(dExact / v.step) * v.step), A = PI * (dUse / 1000) ** 2 / 4;
      const Quse = v.Cd * A * vth * 60000, dpNeed = v.rho / 2 * (Qs / (v.Cd * A)) ** 2 / 1e5, vel = Qs / (v.Cd * A), P = v.dp * 1e5 * Quse / 60000, dT = v.dp * 1e5 / (v.rho * v.cp * 1000), dev = (Quse / v.Q - 1) * 100;
      const okQ = Math.abs(dev) <= v.tol, okD = dUse >= v.dMin, okT = dT <= v.dTmax, ok = okQ && okD && okT;
      return output({ dExact, dUse, Quse, dpNeed, vel, P, dT, dev }, 'Flow at the chosen size (L/min)', Quse,
        [m('Exact orifice diameter', q(dExact, 'mm', 3)), m('Orifice diameter used', q(dUse, 'mm', 3)), m('Flow at the pressure drop', `${q(Quse, 'L/min', 3)} (${dev >= 0 ? '+' : ''}${q(dev, '%', 1)})`), m('Pressure drop for the target flow', q(dpNeed, 'bar', 1)), m('Jet velocity at the target flow', q(vel, 'm/s', 1)), m('Heat generated', q(P, 'W', 0)), m('Temperature rise of the flow', q(dT, 'K', 2))],
        'Orifice restrictor design.', 'Turbulent sharp-edged orifice.', {
          text: ok ? 'RESTRICTOR SUITABLE' : 'RESTRICTOR NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Flow', okQ ? 'pass' : 'fail', `${dev >= 0 ? '+' : ''}${q(dev, '%', 1)} against ±${q(v.tol, '%', 0)}${okQ ? '.' : ': use a finer drill step or adjust the pressure drop.'}`), check('Clogging', okD ? 'pass' : 'fail', `${q(dUse, 'mm', 2)} against ${q(v.dMin, 'mm', 2)} least size.`), check('Temperature rise', okT ? 'pass' : 'fail', `${q(dT, 'K', 1)} against ${q(v.dTmax, 'K', 0)}.`), check('Discharge coefficient', 'verify', 'Confirm C_d for the orifice length, edge and Reynolds number.')],
        });
    },
    "machine-levelling-wedge-check": (v) => {
      if (v.share * v.n < 100 - 1e-9) return invalid('The worst wedge share times the number of wedges must be at least 100%.');
      const W = v.mass * 9.80665 * v.share / 100, phi = Math.atan(v.mu), a = rad(v.angle), drive = W * Math.tan(a + 2 * phi), wd = W * Math.tan(2 * phi - a), locks = 2 * phi > a, tr = v.h / Math.tan(a), lift = Math.tan(a) * 1000;
      const okF = drive <= v.Favail, okT = tr <= v.travel, ok = okF && okT && locks;
      return output({ W, drive, withdraw: Math.abs(wd), locks: locks ? 1 : 0, travel: tr, lift }, 'Drive force (N)', drive,
        [m('Load on the worst wedge', q(W / 1000, 'kN', 2)), m('Force to drive', q(drive, 'N', 0)), m(locks ? 'Force to withdraw' : 'Force needed to hold', q(Math.abs(wd), 'N', 0)), m('Friction angle', q(deg(phi), '°', 2)), m('Travel for the height adjustment', q(tr, 'mm', 1)), m('Lift per millimetre of travel', q(lift, 'µm', 1))],
        'Machine levelling wedge check.', 'Equal friction on both faces.', {
          text: ok ? 'WEDGES ADEQUATE' : 'WEDGES NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Drive force', okF ? 'pass' : 'fail', `${q(drive, 'N', 0)} against ${q(v.Favail, 'N', 0)} available.`), check('Self-locking', locks ? 'pass' : 'fail', locks ? '2φ > α: the wedge holds its position.' : 'The load pushes the wedge out: use a smaller angle or lock it.'), check('Travel', okT ? 'pass' : 'fail', `${q(tr, 'mm', 1)} against ${q(v.travel, 'mm', 0)} available.`)],
        });
    },
    "ramp-winch-pull-check": (v) => {
      const W = v.mass * 9.80665, s = Math.sin(rad(v.angle)), c = Math.cos(rad(v.angle)), mue = v.mode === 'wheels' ? v.f / v.r : v.mu, pull = W * (s + mue * c), holdF = W * (s - mue * c), hold = Math.max(0, holdF), P = pull * v.v / (v.eff / 100);
      const okR = pull <= v.rating, okP = P / 1000 <= v.Pm, okH = hold <= v.rating, ok = okR && okP && okH;
      return output({ W, mue, pull, hold, holdF, P }, 'Pull up the ramp (N)', pull,
        [m('Effective friction coefficient', q(mue, '', 4)), m('Pull up the ramp', q(pull, 'N', 0)), m('Holding force if released', hold > 0 ? q(hold, 'N', 0) : 'None: friction holds the load'), m('Motor power at the haul speed', q(P / 1000, 'kW', 2)), m('Pull as a share of the rating', q(pull / v.rating * 100, '%', 0))],
        hold > 0 ? 'The load runs back if released: the winch brake must hold it.' : 'Friction holds the load on the ramp.', 'Steady haul; rope parallel to the ramp.', {
          text: ok ? 'WINCH ADEQUATE' : 'WINCH NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Rated pull', okR ? 'pass' : 'fail', `${q(pull, 'N', 0)} against ${q(v.rating, 'N', 0)}.`), check('Motor power', okP ? 'pass' : 'fail', `${q(P / 1000, 'kW', 2)} against ${q(v.Pm, 'kW', 2)}.`), check('Holding', okH ? (hold > 0 ? 'warn' : 'pass') : 'fail', hold > 0 ? `The brake must hold ${q(hold, 'N', 0)}; never stand below the load.` : 'The load does not run back.'), check('Breakaway', 'verify', 'Allow extra pull to start the load moving.')],
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
