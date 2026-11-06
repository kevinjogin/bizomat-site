// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook45). SI units are explicit at each boundary.
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
    "air-main-sizing": (v) => {
      if (v.p2 >= v.p1) return invalid('The least pressure must be below the starting pressure.');
      const pabs = v.p + 1.01325, Tk = v.T + 273.15, rho = 1.204 * (pabs / 1.01325) * (293.15 / Tk), Qa = v.Q / 60 * (1.01325 / pabs) * (Tk / 293.15);
      const flow = (dd) => { const d = dd / 1000, vel = Qa / (PI * d * d / 4), Re = rho * vel * d / 1.81e-5; let f = 0.02; if (Re < 2300) f = 64 / Re; else for (let k = 0; k < 50; k++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2; const dp = f * v.L / d * rho * vel * vel / 2 / 1e5; return { vel, Re, f, dp, share: 100 * dp / pabs }; };
      const c = flow(v.d), dpMax = v.dpPct / 100 * pabs, bores = [15, 20, 25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300], dBest = bores.find((b) => { const r = flow(b); return r.dp <= dpMax && r.vel <= v.vMax; }) ?? 0;
      const V = v.tPeak * v.deficit * ATM / (v.p1 - v.p2), okD = c.dp <= dpMax, okV = c.vel <= v.vMax, ok = okD && okV;
      return output({ vel: c.vel, Re: c.Re, f: c.f, dp: c.dp, share: c.share, dBest, V }, 'Pressure drop in the chosen bore (bar)', c.dp,
        [m('Velocity', q(c.vel, 'm/s', 2)), m('Pressure drop', `${q(c.dp, 'bar', 3)} (${q(c.share, '%', 2)} of absolute pressure)`), m('Smallest standard bore that passes', dBest ? q(dBest, 'mm', 0) : 'Larger than 300 mm'), m('Receiver volume for the peak', `${q(V, 'm³', 3)} (${q(V * 1000, 'L', 0)})`)],
        'Compressed-air main sizing.', 'Steady flow; equivalent length.', {
          text: ok ? 'MAIN ADEQUATE' : 'MAIN TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Pressure drop', okD ? 'pass' : 'fail', `${q(c.dp, 'bar', 3)} against ${q(dpMax, 'bar', 3)}.`), check('Velocity', okV ? 'pass' : 'fail', `${q(c.vel, 'm/s', 1)} against ${q(v.vMax, 'm/s', 0)}.`), check('Drainage', 'verify', 'Slope the main and fit drain points: condensate raises drop and corrosion.')],
        });
    },
    "anodizing-plan": (v) => {
      const rate = 25.4 * 9.290304 / 720 * v.J * v.eff / 100, minutes = v.thick / rate, build = v.thick / 3, I = v.J * v.ap * v.np, heat = v.V * I / 1000, loads = Math.ceil(v.batch / v.np - 1e-9), hours = loads * (minutes + v.handle) / 60, kWh = heat * minutes / 60 * loads, cost = (kWh * v.pE + hours * v.rate) / v.batch;
      const okI = I <= v.rect, okC = heat <= v.chill, ok = okI && okC;
      return output({ rate, minutes, build, I, heat, loads, hours, kWh, cost }, 'Anodising time (min)', minutes,
        [m('Growth rate', q(rate, 'µm/min', 3)), m('Time to thickness', q(minutes, 'min', 1)), m('Build-up per surface', q(build, 'µm', 1)), m('Current per load', q(I, 'A', 0)), m('Heat into the bath', q(heat, 'kW', 2)), m('Loads / line hours', `${q(loads, '', 0)} / ${q(hours, 'h', 1)}`), m('Energy for the batch', q(kWh, 'kWh', 1)), m('Cost per part', money(cost))],
        'Anodising plan.', '720 rule; Type II sulfuric acid.', {
          text: ok ? 'PLAN FEASIBLE' : 'PLAN NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Rectifier', okI ? 'pass' : 'fail', `${q(I, 'A', 0)} against ${q(v.rect, 'A', 0)}.`), check('Bath cooling', okC ? 'pass' : 'fail', `${q(heat, 'kW', 2)} of heat against ${q(v.chill, 'kW', 1)} cooling.`), check('Thickness', 'verify', 'Measure coating thickness and adjust the efficiency factor.')],
        });
    },
    "repair-or-replace": (v) => {
      const i = v.rate / 100, ap = (n) => (i === 0 ? 1 / n : i * (1 + i) ** n / ((1 + i) ** n - 1)), af = (n) => (i === 0 ? 1 / n : i / ((1 + i) ** n - 1)), ag = (n) => (i === 0 ? (n - 1) / 2 : 1 / i - n / ((1 + i) ** n - 1));
      const eD = v.mvD * ap(v.nD) + v.aD + v.gD * ag(v.nD) - v.sD * af(v.nD), eC = v.pC * ap(v.nC) + v.aC - v.sC * af(v.nC), keep = eD <= eC, diff = Math.abs(eD - eC);
      return output({ eD, eC, diff, keep: keep ? 1 : 0, agD: ag(v.nD) }, 'Yearly saving of the better choice ($)', diff,
        [m('Defender EUAC (keep)', money(eD)), m('Challenger EUAC (replace)', money(eC)), m('Yearly difference', money(diff)), m('Gradient factor (A/G)', q(ag(v.nD), '', 4))],
        keep ? 'Keep the existing machine for now.' : 'Replace the existing machine.', 'Before-tax EUAC comparison.', {
          text: keep ? 'KEEP THE OLD MACHINE' : 'REPLACE THE MACHINE', tone: 'good',
          checks: [check('Decision', keep ? 'pass' : 'warn', keep ? `Keeping is cheaper by ${money(diff)} a year; review again next year as costs rise.` : `Replacing is cheaper by ${money(diff)} a year.`), check('Non-cost factors', 'verify', 'Add capacity, quality and safety differences before deciding.')],
        });
    },
    "make-or-buy": (v) => {
      const vM = v.tc / 60 * v.mhr + v.mat, vB = v.price + v.freight, tM = v.fixM + vM * v.qty, tB = v.fixB + vB * v.qty, make = tM <= tB, dv = vB - vM, q0 = dv !== 0 ? (v.fixM - v.fixB) / dv : NaN, valid = Number.isFinite(q0) && q0 > 0, save = Math.abs(tM - tB);
      return output({ vM, vB, tM, tB, q0: valid ? q0 : 0, make: make ? 1 : 0, save }, 'Saving of the cheaper option ($)', save,
        [m('Make: variable cost per part', money(vM)), m('Buy: variable cost per part', money(vB)), m('Make total / per part', `${money(tM)} / ${money(tM / v.qty)}`), m('Buy total / per part', `${money(tB)} / ${money(tB / v.qty)}`), m('Break-even quantity', valid ? q(q0, 'parts', 0) : 'None: one option is cheaper at every quantity'), m('Cheaper at the planned quantity', `${make ? 'Make' : 'Buy'} by ${money(save)}`)],
        `${make ? 'Making' : 'Buying'} is cheaper at ${v.qty} parts.`, 'Linear cost model.', {
          text: make ? 'MAKE IN-HOUSE' : 'BUY FROM SUPPLIER', tone: 'good',
          checks: [check('Margin over break-even', valid ? (Math.abs(v.qty - q0) / q0 > 0.2 ? 'pass' : 'warn') : 'pass', valid ? (Math.abs(v.qty - q0) / q0 > 0.2 ? 'The planned quantity is well clear of break-even.' : 'Close to break-even: small changes in cost or volume flip the decision.') : 'One option is cheaper at every quantity.'), check('Capacity', 'verify', `Making needs ${q(v.tc * v.qty / 60, 'machine hours', 0)}: check the capacity is free.`)],
        });
    },
    "block-and-tackle-check": (v) => {
      const W = v.mass * 9.80665, e = v.e / 100, ideal = W / v.n, eta = e >= 1 ? 1 : (1 - e ** v.n) / (v.n * (1 - e)), F = ideal / eta, MA = W / F, sf = v.MBL * 1000 / F;
      const okR = sf >= v.SF, okH = v.op !== 'hand' || F <= v.hand, ok = okR && okH;
      return output({ W, ideal, eta, F, MA, sf, ropePerM: v.n }, 'Fast-line pull (N)', F,
        [m('Load weight', q(W, 'N', 0)), m('Ideal pull', q(ideal, 'N', 0)), m('Overall efficiency', q(eta * 100, '%', 1)), m('Actual pull', q(F, 'N', 0)), m('Mechanical advantage', q(MA, '', 2)), m('Rope pulled per metre of lift', q(v.n, 'm', 0)), m('Rope safety factor', q(sf, '', 2))],
        'Block and tackle check.', 'Static, slow lifting.', {
          text: ok ? 'TACKLE ADEQUATE' : 'TACKLE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Rope', okR ? 'pass' : 'fail', `Safety factor ${q(sf, '', 2)} against ${q(v.SF, '', 1)}.`), check('Hand pull', okH ? 'pass' : 'fail', v.op === 'hand' ? `${q(F, 'N', 0)} against ${q(v.hand, 'N', 0)} for one person.` : 'Winch driven.')],
        });
    },
    "restrained-bar-thermal-check": (v) => {
      const E = v.E * 1000, R = v.restraint / 100, A = PI * v.d ** 2 / 4, I = PI * v.d ** 4 / 64, r = Math.sqrt(I / A), sig = E * v.alpha * 1e-6 * v.dT * R, Fth = sig * A, ny = sig > 0 ? v.Sy / sig : Infinity;
      const lam = v.K * v.L / r, Cc = PI * Math.sqrt(2 * E / v.Sy), eu = lam >= Cc, scr = eu ? PI * PI * E / (lam * lam) : v.Sy - (v.Sy * lam / (2 * PI)) ** 2 / E, Pcr = scr * A, nb = Fth > 0 ? Pcr / Fth : Infinity;
      const k = E * v.alpha * 1e-6 * R, dTy = k > 0 ? v.Sy / k : Infinity, dTb = k > 0 ? scr / k : Infinity, okY = ny >= v.req, okB = nb >= v.req, ok = okY && okB;
      return output({ sig, Fth, ny: Number.isFinite(ny) ? ny : 0, lam, Cc, scr, Pcr, nb: Number.isFinite(nb) ? nb : 0, dTy: Number.isFinite(dTy) ? dTy : 0, dTb: Number.isFinite(dTb) ? dTb : 0, A, I }, 'Buckling safety factor', Number.isFinite(nb) ? nb : 0,
        [m('Thermal stress', q(sig, 'MPa', 1)), m('Force on the restraints', q(Fth / 1000, 'kN', 2)), m('Yield safety factor', Number.isFinite(ny) ? q(ny, '', 2) : 'No stress'), m('Slenderness / mode', `${q(lam, '', 1)} / ${eu ? 'Euler' : 'Johnson'}`), m('Buckling load', q(Pcr / 1000, 'kN', 2)), m('Buckling safety factor', Number.isFinite(nb) ? q(nb, '', 2) : 'No force'), m('Temperature rise at buckling / yield', `${q(dTb, '', 1)} / ${q(dTy, 'K', 1)}`)],
        'Restrained bar heating.', 'Uniform temperature; rigid anchors scaled by restraint.', {
          text: ok ? 'BAR ADEQUATE' : 'BAR NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Yield', okY ? 'pass' : 'fail', `Factor ${Number.isFinite(ny) ? q(ny, '', 2) : '∞'} against ${q(v.req, '', 1)}.`), check('Buckling', okB ? 'pass' : 'fail', `Factor ${Number.isFinite(nb) ? q(nb, '', 2) : '∞'} against ${q(v.req, '', 1)}${okB ? '.' : ': add guides or an expansion joint.'}`)],
        });
    },
    "buffer-stop-design": (v) => {
      const E = 0.5 * v.mass * v.v * v.v, s = v.s / 1000, et = v.eta / 100, Etot = E + v.Fd * s, peak = (ss) => (v.type === 'spring' ? 2 * (E + v.Fd * ss) / ss : (E + v.Fd * ss) / (et * ss)), Fpk = peak(s), ag = (Fpk - v.Fd) / v.mass / 9.80665;
      let lo = 1e-5, hi = 100; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if ((peak(mid) - v.Fd) / v.mass / 9.80665 > v.aMax) lo = mid; else hi = mid; }
      const sNeed = hi * 1000, okF = Fpk <= v.Fmax * 1000, okA = ag <= v.aMax, ok = okF && okA;
      return output({ E, Etot, Fpk, ag, sNeed }, 'Peak buffer force (kN)', Fpk / 1000,
        [m('Kinetic energy at impact', q(E, 'J', 0)), m('Total energy over the stroke', q(Etot, 'J', 0)), m('Peak buffer force', q(Fpk / 1000, 'kN', 2)), m('Peak deceleration', q(ag, 'g', 2)), m('Stroke for the deceleration limit', q(sNeed, 'mm', 0))],
        'Buffer stop design.', 'Rigid carriage and stop.', {
          text: ok ? 'BUFFER ADEQUATE' : 'BUFFER NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('End stop force', okF ? 'pass' : 'fail', `${q(Fpk / 1000, 'kN', 1)} against ${q(v.Fmax, 'kN', 0)}.`), check('Deceleration', okA ? 'pass' : 'fail', `${q(ag, 'g', 2)} against ${q(v.aMax, 'g', 2)}; ${q(sNeed, 'mm', 0)} stroke needed.`), check('Rebound', v.type === 'spring' ? 'verify' : 'pass', v.type === 'spring' ? 'A spring returns the energy: check the rebound is safe.' : 'Hydraulic buffers absorb the energy.')],
        });
    },
    "gas-vessel-temperature-check": (v) => {
      const P1 = v.p1 + v.patm, K1 = v.T1 + 273.15, K2 = v.T2 + 273.15;
      if (K1 <= 0 || K2 <= 0) return invalid('Temperatures must be above absolute zero.');
      const P2 = P1 * K2 / K1, p2 = P2 - v.patm, mass = P1 * 1e5 * v.V / 1000 / (v.R * K1), pFill = (v.rating + v.patm) * K1 / K2 - v.patm, rise = (P2 / P1 - 1) * 100, ok = p2 <= v.rating;
      return output({ P1, P2, p2, mass, pFill, rise }, 'Pressure at the hot condition (bar gauge)', p2,
        [m('Absolute pressure filled / hot', `${q(P1, '', 2)} / ${q(P2, 'bar', 2)}`), m('Gauge pressure hot', q(p2, 'bar', 2)), m('Pressure rise', q(rise, '%', 1)), m('Mass of gas', q(mass, 'kg', 3)), m('Highest fill pressure at the filling temperature', q(pFill, 'bar', 2))],
        'Closed gas vessel temperature check.', 'Ideal gas at constant volume.', {
          text: ok ? 'WITHIN RATING' : 'EXCEEDS RATING', tone: ok ? 'good' : 'bad',
          checks: [check('Hot pressure', ok ? 'pass' : 'fail', `${q(p2, 'bar', 1)} against ${q(v.rating, 'bar', 0)}${ok ? '.' : `: fill to no more than ${q(pFill, 'bar', 1)}.`}`), check('Relief', 'verify', 'Fit a relief device sized for the worst heating case.')],
        });
    },
    "blow-off-nozzle-cost": (v) => {
      const R = 287.05, Tk = v.T + 273.15, P1 = (v.p1 + ATM) * 1e5, P2 = v.p2 * 1e5;
      if (P1 <= P2) return invalid('The supply pressure must exceed the outside pressure.');
      const r = P2 / P1, k = v.k, rc = (2 / (k + 1)) ** (k / (k - 1)), choked = r < rc, A = PI * (v.d / 1000) ** 2 / 4, vSonic = Math.sqrt(2 * k * R * Tk / (k + 1)), vFull = Math.sqrt(2 * k / (k - 1) * R * Tk * (1 - r ** ((k - 1) / k)));
      const mdot = choked ? v.Cd * A * P1 * Math.sqrt(k / (R * Tk)) * Math.pow(2 / (k + 1), (k + 1) / (2 * (k - 1))) : v.Cd * A * P1 * Math.sqrt(2 * k / (R * Tk * (k - 1)) * (r ** (2 / k) - r ** ((k + 1) / k)));
      const Qper = mdot / (ATM * 1e5 / (R * 293.15)) * 60000, Qavg = Qper * v.n * v.duty / 100, m3min = Qavg / 1000, pct = m3min / v.Qc * 100, kW = m3min * v.spec, cost = kW * v.hours * v.price, Qe = v.Qeng * v.n * v.duty / 100, save = Math.max((Qavg - Qe) / 1000 * v.spec * v.hours * v.price, 0), ok = pct <= 100;
      return output({ choked: choked ? 1 : 0, vJet: choked ? vSonic : vFull, mdot, Qper, Qavg, pct, kW, cost, save }, 'Blow-off cost per year ($)', cost,
        [m('Flow condition', choked ? 'Choked (sonic jet)' : 'Not choked'), m('Jet velocity', q(choked ? vSonic : vFull, 'm/s', 0)), m('Flow per opening', q(Qper, 'L/min', 0)), m('Average total flow', q(Qavg, 'L/min', 0)), m('Share of compressor capacity', q(pct, '%', 1)), m('Compressor power', q(kW, 'kW', 2)), m('Cost per year', money(cost)), m('Saving with engineered nozzles', money(save))],
        'Blow-off consumption.', 'Open discharge to atmosphere.', {
          text: ok ? 'WITHIN COMPRESSOR CAPACITY' : 'EXCEEDS COMPRESSOR CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Capacity', ok ? 'pass' : 'fail', `${q(pct, '%', 1)} of capacity on average.`), check('Safety', 'verify', 'Limit blow-off pressure at the nozzle for operator safety (dead-end pressure).')],
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
