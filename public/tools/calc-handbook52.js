// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook52). SI units are explicit at each boundary.
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
    "pusher-move-check": (v) => {
      const g = 9.80665, a = 4 * v.s / (v.t * v.t), vmax = 2 * v.s / v.t, Fpush = v.m * (a + v.mu * g), Fbrake = v.m * (a - v.mu * g), Ppk = Fpush * vmax, Fimp = v.m * vmax / v.ts, E = v.m * vmax * vmax / 2;
      const okF = Fpush <= v.Fact, okS = Fimp <= v.Fstop, ok = okF && okS;
      return output({ a, vmax, Fpush, Fbrake, Ppk, Fimp, E }, 'Pushing force (N)', Fpush,
        [m('Acceleration', `${q(a, 'm/s²', 3)} (${q(a / g, 'g', 3)})`), m('Peak speed', q(vmax, 'm/s', 3)), m('Pushing force', q(Fpush, 'N', 1)), m('Braking force', Fbrake > 0 ? q(Fbrake, 'N', 1) : 'None: friction stops it'), m('Peak power', q(Ppk, 'W', 0)), m('Kinetic energy at peak speed', q(E, 'J', 2)), m('Force at a hard stop', q(Fimp, 'N', 0))],
        'Pusher move check.', 'Triangular profile; rigid stop.', {
          text: ok ? 'MOVE ACHIEVABLE' : 'MOVE NOT ACHIEVABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Actuator force', okF ? 'pass' : 'fail', `${q(Fpush, 'N', 0)} against ${q(v.Fact, 'N', 0)}.`), check('Hard-stop load', okS ? 'pass' : 'fail', `${q(Fimp, 'N', 0)} against ${q(v.Fstop, 'N', 0)}${okS ? '.' : ': add a shock absorber or slow the move.'}`), check('Cushioning', 'verify', 'Use end cushions or shock absorbers sized for the kinetic energy.')],
        });
    },
    "lid-counterbalance-spring": (v) => {
      const C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const g = 9.80665, rate = v.E * 1000 * v.d ** 4 / (64 * v.D * v.Nb), th0 = rad(v.th0), Tl = (th) => v.mass * g * v.r * Math.cos(th), Ts = (th) => v.nS * rate * (th0 - th), net = (th) => Tl(th) - Ts(th);
      let worst = 0, thW = 0; for (let i = 0; i <= 360; i++) { const th = rad(v.open) * i / 360, x = Math.abs(net(th)); if (x > worst) { worst = x; thW = th; } }
      const Ki = (4 * C * C - C - 1) / (4 * C * (C - 1)), Mmax = rate * Math.max(th0, Math.abs(th0 - rad(v.open))), sigma = Ki * 32 * Mmax / (PI * v.d ** 3), Fh = worst / v.handle, nC = net(0), nO = net(rad(v.open));
      const okF = Fh <= v.Fmax, okS = sigma <= v.allow, ok = okF && okS;
      return output({ rate, Mmax, sigma, Ki, worst, thWorst: deg(thW), Fh, netClosed: nC, netOpen: nO }, 'Largest handle force (N)', Fh,
        [m('Rate of each spring', q(rate, 'N·mm/rad', 1)), m('Lid torque closed', q(Tl(0) / 1000, 'N·m', 2)), m('Out-of-balance closed / open', `${q(nC / 1000, '', 2)} / ${q(nO / 1000, 'N·m', 2)}`), m('Largest out-of-balance torque', `${q(worst / 1000, 'N·m', 2)} at ${q(deg(thW), '°', 0)}`), m('Largest handle force', q(Fh, 'N', 1)), m('Spring stress at full wind-up', q(sigma, 'MPa', 0))],
        'Lid counterbalance check.', 'Linear springs; frictionless hinge.', {
          text: ok ? 'LID BALANCED' : 'LID NOT BALANCED', tone: ok ? 'good' : 'bad',
          checks: [check('Handle force', okF ? 'pass' : 'fail', `${q(Fh, 'N', 1)} against ${q(v.Fmax, 'N', 0)}.`), check('Spring stress', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Stays open', nO <= 0 ? 'pass' : 'warn', nO <= 0 ? 'The springs hold the lid fully open.' : 'The lid tends to fall shut from fully open: add a stay or more wind-up.'), check('Stays shut', nC >= 0 ? 'pass' : 'warn', nC >= 0 ? 'The lid rests closed under its own weight.' : 'The springs lift the closed lid: add a catch.')],
        });
    },
    "triaxial-stress-check": (v) => {
      const I1 = v.sx + v.sy + v.sz, I2 = v.sx * v.sy + v.sy * v.sz + v.sz * v.sx - v.txy ** 2 - v.tyz ** 2 - v.tzx ** 2, I3 = v.sx * v.sy * v.sz + 2 * v.txy * v.tyz * v.tzx - v.sx * v.tyz ** 2 - v.sy * v.tzx ** 2 - v.sz * v.txy ** 2;
      const p = I2 - I1 * I1 / 3, qq = -2 * I1 ** 3 / 27 + I1 * I2 / 3 - I3; let s;
      if (Math.abs(p) < 1e-12) s = [I1 / 3, I1 / 3, I1 / 3]; else { const r = 2 * Math.sqrt(-p / 3), arg = Math.max(-1, Math.min(1, 3 * qq / (p * r))), th = Math.acos(arg) / 3; s = [0, 1, 2].map((k) => r * Math.cos(th - 2 * PI * k / 3) + I1 / 3); }
      s.sort((a, b) => b - a); const [s1, s2, s3] = s, tmax = (s1 - s3) / 2, vm = Math.sqrt(0.5 * ((s1 - s2) ** 2 + (s2 - s3) ** 2 + (s3 - s1) ** 2));
      const E = v.E * 1000, G = v.E / (2 * (1 + v.nu)), K = v.E / (3 * (1 - 2 * v.nu)), e = [[s1, s2, s3], [s2, s3, s1], [s3, s1, s2]].map(([a, b, c]) => (a - v.nu * (b + c)) / E * 1e6), ev = (1 - 2 * v.nu) * I1 / E * 1e6;
      const nVM = vm > 0 ? v.Sy / vm : 1e9, nTr = s1 - s3 > 0 ? v.Sy / (s1 - s3) : 1e9, okV = nVM >= v.req, okT = nTr >= v.req;
      return output({ s1, s2, s3, tmax, vm, nVM, nTr, G, K, e1: e[0], e2: e[1], e3: e[2], ev }, 'von Mises stress (MPa)', vm,
        [m('Principal stresses', `${q(s1, '', 2)} / ${q(s2, '', 2)} / ${q(s3, 'MPa', 2)}`), m('Maximum shear', q(tmax, 'MPa', 2)), m('von Mises stress', q(vm, 'MPa', 2)), m('Safety factor: von Mises / Tresca', `${q(nVM, '', 2)} / ${q(nTr, '', 2)}`), m('Principal strains', `${q(e[0], '', 1)} / ${q(e[1], '', 1)} / ${q(e[2], 'µε', 1)}`), m('Volume change', q(ev, 'µε', 1)), m('G / K', `${q(G, '', 2)} / ${q(K, 'GPa', 2)}`)],
        'Triaxial stress check.', 'Isotropic linear-elastic material.', {
          text: okV ? 'WITHIN YIELD MARGIN' : 'YIELD MARGIN TOO LOW', tone: okV ? 'good' : 'bad',
          checks: [check('von Mises', okV ? 'pass' : 'fail', `Factor ${q(nVM, '', 2)} against ${q(v.req, '', 1)}.`), check('Tresca', okT ? 'pass' : 'warn', `Factor ${q(nTr, '', 2)} against ${q(v.req, '', 1)} (more conservative).`)],
        });
    },
    "machine-noise-acceptance": (v) => {
      if (v.T <= v.B) return invalid('The running reading must exceed the background reading.');
      const p = (L) => 10 ** (L / 10), L = 10 * Math.log10(p(v.T) - p(v.B)), diff = v.T - v.B, LS = L - 20 * Math.log10(v.rS / v.r1), LOp = L - 20 * Math.log10(v.rOp / v.r1);
      const valid = diff >= v.minDiff, okL = LS <= v.limit + 1e-9, ok = valid && okL;
      return output({ L, diff, corr: v.T - L, LS, LOp }, 'Machine level at the specification distance (dB)', LS,
        [m('Machine level at the measurement point', q(L, 'dB', 1)), m('Difference between readings / correction', `${q(diff, 'dB', 1)} / ${q(v.T - L, 'dB', 2)}`), m('Level at the specification distance', q(LS, 'dB', 1)), m('Level at the operator', q(LOp, 'dB', 1))],
        'Machine noise acceptance test.', 'Steady noise; point-source spreading.', {
          text: !valid ? 'MEASUREMENT NOT VALID' : okL ? 'MACHINE MEETS LIMIT' : 'MACHINE EXCEEDS LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Background', valid ? 'pass' : 'fail', `${q(diff, 'dB', 1)} difference against ${q(v.minDiff, 'dB', 0)}${valid ? '.' : ': lower the background and repeat.'}`), check('Limit', okL ? 'pass' : 'fail', `${q(LS, 'dB', 1)} against ${q(v.limit, 'dB', 0)}.`), check('Instrument', 'verify', 'Calibrate the meter before and after the readings.')],
        });
    },
    "melt-charge-blend": (v) => {
      if (v.cA === v.cB) return invalid('The two materials must have different contents.');
      const aim = v.cT / (1 - v.loss / 100), sA = (v.cB - aim) / (v.cB - v.cA);
      if (sA < 0 || sA > 1) return invalid('The target (allowing for melt loss) must lie between the two contents.');
      const qA = sA * v.batch, qB = (1 - sA) * v.batch, cost = (qA * v.pA + qB * v.pB) / v.batch, ok = cost <= v.maxCost + 1e-12;
      return output({ aim, sA, sB: 1 - sA, qA, qB, cost, total: cost * v.batch }, 'Charge cost ($/kg)', cost,
        [m('Charge content to aim for', q(aim, '%', 3)), m('Shares A / B', `${q(sA * 100, '', 2)} / ${q((1 - sA) * 100, '%', 2)}`), m('Material A', q(qA, 'kg', 1)), m('Material B', q(qB, 'kg', 1)), m('Charge cost', `${money(cost)} per kg (${money(cost * v.batch)} total)`)],
        'Melt charge blend.', 'Linear mixing; single melt loss.', {
          text: ok ? 'BLEND WITHIN COST' : 'BLEND TOO COSTLY', tone: ok ? 'good' : 'bad',
          checks: [check('Cost', ok ? 'pass' : 'fail', `${money(cost)} per kg against ${money(v.maxCost)}.`), check('Other elements', 'verify', 'Check every specified element with the same shares.')],
        });
    },
    "angle-ring-cut-plan": (v) => {
      const sign = v.place === 'inside' ? -1 : 1, corr = v.mode === 'axis' ? 2 * PI * v.x : v.k, L = PI * v.D + sign * corr, Dn = L / PI;
      if (Dn <= 0) return invalid('The correction is larger than the diameter allows.');
      const S = v.stock * 1000, joints = L + v.kerf <= S ? 1 : Math.ceil(L / S), tot = v.qty * (L + joints * v.kerf), bars = Math.ceil(tot / S - 1e-9), waste = (1 - v.qty * L / (bars * S)) * 100, mass = L / 1000 * v.area / 1e6 * v.rho, cost = mass * v.qty * v.price, ok = waste <= v.maxWaste + 1e-9;
      return output({ L, Dn, corr, joints, tot, bars, waste, mass, cost }, 'Cut length (mm)', L,
        [m('Cut length per ring', q(L, 'mm', 1)), m('Neutral-axis diameter', q(Dn, 'mm', 1)), m('Joints per ring', q(joints, '', 0)), m('Stock bars', `${q(bars, '', 0)} × ${q(v.stock, 'm', 1)}`), m('Waste', q(waste, '%', 1)), m('Mass per ring / total', `${q(mass, '', 1)} / ${q(mass * v.qty, 'kg', 1)}`), m('Material cost', money(cost))],
        'Angle ring cut plan.', 'Neutral-axis length; offcuts not reused.', {
          text: ok ? 'CUT PLAN OK' : 'WASTE TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Waste', ok ? 'pass' : 'fail', `${q(waste, '%', 1)} against ${q(v.maxWaste, '%', 0)}${ok ? '.' : ': try another stock length or nest other parts in the offcuts.'}`), check('Trial ring', 'verify', 'Roll a trial ring and adjust the cut length for springback and joint gap.')],
        });
    },
    "two-span-stringer-check": (v) => {
      const EI = v.E * 1000 * v.I, L1 = v.L1, L2 = v.L2, wN = v.w + v.self * 9.80665, w = wN / 1000;
      const T1 = w * L1 ** 3 / 4, T2 = w * L2 ** 3 / 4, MB = -(T1 + T2) / (2 * (L1 + L2)), RA = w * L1 / 2 + MB / L1, RC = w * L2 / 2 + MB / L2, RB = w * L1 + w * L2 - RA - RC;
      const span = (L, R) => { let Mmax = 0, dmax = 0; for (let i = 0; i <= 400; i++) { const x = L * i / 400, M = R * x - w * x * x / 2; Mmax = Math.max(Mmax, M); const yl = w * x * (L ** 3 - 2 * L * x * x + x ** 3) / (24 * EI), ym = MB * x * (L * L - x * x) / (6 * EI * L); dmax = Math.max(dmax, yl + ym); } return { Mmax, dmax }; };
      const s1 = span(L1, RA), s2 = span(L2, RC), Mmax = Math.max(Math.abs(MB), s1.Mmax, s2.Mmax), stress = Mmax * v.c / v.I, lim1 = L1 / v.dRatio, lim2 = L2 / v.dRatio;
      const okS = stress <= v.allow, okD = s1.dmax <= lim1 && s2.dmax <= lim2, okR = Math.max(RA, RB, RC) / 1000 <= v.Rmax, ok = okS && okD && okR;
      return output({ wN, RA, RB, RC, MB, M1: s1.Mmax, M2: s2.Mmax, d1: s1.dmax, d2: s2.dmax, stress }, 'Maximum stress (MPa)', stress,
        [m('Total load per metre', q(wN, 'N/m', 1)), m('Reactions: end / middle / end', `${q(RA / 1000, '', 2)} / ${q(RB / 1000, '', 2)} / ${q(RC / 1000, 'kN', 2)}`), m('Moment over the middle support', q(MB / 1e6, 'kN·m', 3)), m('Largest span moments', `${q(s1.Mmax / 1e6, '', 3)} / ${q(s2.Mmax / 1e6, 'kN·m', 3)}`), m('Bending stress', q(stress, 'MPa', 1)), m('Deflection: span 1 / span 2', `${q(s1.dmax, '', 2)} / ${q(s2.dmax, 'mm', 2)}`)],
        'Two-span stringer check.', 'Rigid level supports; uniform load.', {
          text: ok ? 'STRINGER ADEQUATE' : 'STRINGER NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Deflection', okD ? 'pass' : 'fail', `${q(Math.max(s1.dmax, s2.dmax), 'mm', 2)} against ${q(Math.min(lim1, lim2), 'mm', 1)} (span ÷ ${q(v.dRatio, '', 0)}).`), check('Supports', okR ? 'pass' : 'fail', `${q(Math.max(RA, RB, RC) / 1000, 'kN', 2)} largest reaction against ${q(v.Rmax, 'kN', 1)}.`)],
        });
    },
    "inch-spur-gear-check": (v) => {
      const a = v.system === '20stub' ? 0.8 / v.P : 1 / v.P, pd1 = v.n1 / v.P, pd2 = v.n2 / v.P, od1 = pd1 + 2 * a, od2 = pd2 + 2 * a, cd = (v.n1 + v.n2) / (2 * v.P);
      const mod = 25.4 / v.P, d = pd1 * 25.4, b = v.face * 25.4, w = 2 * PI * v.rpm / 60, Tq = v.hp * 745.7 / w, Ft = 2 * Tq * 1000 / d, V = PI * d * v.rpm / 60000, Kv = { cast: (3.05 + V) / 3.05, cut: (6.1 + V) / 6.1, hobbed: (3.56 + Math.sqrt(V)) / 3.56, ground: Math.sqrt((5.56 + Math.sqrt(V)) / 5.56) }[v.make];
      const sigma = Kv * Ft / (b * mod * v.Y), ok = sigma <= v.allow;
      return output({ pd1, pd2, od1, od2, cd, ratio: v.n2 / v.n1, nOut: v.rpm * v.n1 / v.n2, mod, T: Tq, Ft, V, Kv, sigma }, 'Pinion bending stress (MPa)', sigma,
        [m('Pitch diameters', `${q(pd1, '', 4)} / ${q(pd2, 'in', 4)}`), m('Outside diameters', `${q(od1, '', 4)} / ${q(od2, 'in', 4)}`), m('Centre distance', `${q(cd, 'in', 4)} (${q(cd * 25.4, 'mm', 2)})`), m('Ratio / gear speed', `${q(v.n2 / v.n1, '', 3)} / ${q(v.rpm * v.n1 / v.n2, 'rpm', 1)}`), m('Pinion torque / tangential force', `${q(Tq, 'N·m', 2)} / ${q(Ft, 'N', 0)}`), m('Equivalent module', q(mod, 'mm', 4)), m('Pitch-line velocity / velocity factor', `${q(V, 'm/s', 2)} / ${q(Kv, '', 3)}`), m('Pinion bending stress', q(sigma, 'MPa', 1))],
        'Inch spur gear pair check.', 'Lewis bending; standard proportions.', {
          text: ok ? 'GEAR PAIR ADEQUATE' : 'PINION OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Pinion bending', ok ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Pinion teeth', v.n1 >= 18 || v.system === '20stub' ? 'pass' : 'warn', v.n1 >= 18 || v.system === '20stub' ? 'Enough teeth for the system.' : 'Small pinions may undercut: check the tooth count for the system.'), check('Surface durability', 'verify', 'Check contact stress (pitting) separately.')],
        });
    },
    "equipment-finance-plan": (v) => {
      if (v.salvage >= v.cost) return invalid('The salvage value must be less than the cost.');
      const i = v.rate / 100, g = (1 + i) ** v.n, AP = i === 0 ? 1 / v.n : i * g / (g - 1), pay = v.cost * AP, Y = Math.max(v.life, v.n), base = v.cost - v.salvage, syd = v.life * (v.life + 1) / 2;
      let bal = v.cost, book = v.cost, total = 0, cfMin = Infinity, cf1 = 0, d1 = 0; const rows = [];
      for (let t = 1; t <= Y; t++) {
        const intr = t <= v.n ? bal * i : 0, pmt = t <= v.n ? pay : 0; bal -= pmt - intr;
        const D = t > v.life ? 0 : v.method === 'sl' ? base / v.life : v.method === 'syd' ? base * (v.life - t + 1) / syd : Math.min(book * 2 / v.life, Math.max(0, book - v.salvage)); book -= D;
        const taxA = v.tax / 100 * (v.save - D - intr), cf = v.save - pmt - taxA; total += cf; cfMin = Math.min(cfMin, cf); if (t === 1) { cf1 = cf; d1 = D; }
        rows.push([String(t), money(pmt), money(intr), money(D), money(taxA), money(cf)]);
      }
      const ok = cfMin >= 0;
      return output({ AP, pay, d1, cf1, cfMin, total, book }, 'After-tax cash flow in year 1 (AUD)', cf1,
        [m('Loan payment each year', money(pay)), m('Total interest', money(pay * v.n - v.cost)), m('First-year depreciation', money(d1)), m('After-tax cash flow, year 1', money(cf1)), m('Worst year', money(cfMin)), m('Total after-tax cash flow', money(total)), m('Book value at end of life', money(book))],
        'Equipment finance plan.', 'Annual payments; simplified tax.', {
          text: ok ? 'PAYS ITS WAY EVERY YEAR' : 'CASH SHORT IN SOME YEARS', tone: ok ? 'good' : 'bad',
          table: tbl('Yearly cash flow', ['Year', 'Payment', 'Interest', 'Depreciation', 'Tax', 'Cash flow'], rows),
          checks: [check('Yearly cash flow', ok ? 'pass' : 'fail', ok ? 'Every year is positive after loan payments and tax.' : `The worst year is ${money(cfMin)}: lengthen the loan or plan for the shortfall.`), check('Tax rules', 'verify', 'Confirm depreciation and interest deductions with your accountant.')],
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
