// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook8). SI units are explicit at each boundary.
// Methods are standard engineering relations; no handbook tables, ratings or recommended settings are reproduced.
// Material properties, ratings, factors and limits are always entered by the user.
(() => {
  const PI = Math.PI;
  const rad = (degrees) => degrees * PI / 180;
  const deg = (radians) => radians * 180 / PI;
  const area = (d) => PI * d * d / 4;
  const ATM = 1.01325; // standard atmosphere, bar
  const q = (value, unit, digits = 4) => {
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
    "orifice-flow": (v) => {
      const A = PI * (v.d / 1000) ** 2 / 4; let Q, dp;
      if (v.mode === 'flow') { dp = v.dp; Q = v.Cd * A * Math.sqrt(2 * dp * 1e5 / v.rho) * 60000; }
      else { Q = v.Q; dp = v.rho / 2 * (Q / 60000 / (v.Cd * A)) ** 2 / 1e5; }
      const vel = (Q / 60000) / (v.Cd * A);
      return output({ Q, dp, vel }, v.mode === 'flow' ? 'Flow (L/min)' : 'Pressure drop (bar)', v.mode === 'flow' ? Q : dp,
        [m('Flow', q(Q, 'L/min', 3)), m('Pressure drop', q(dp, 'bar', 3)), m('Jet velocity', q(vel, 'm/s', 2))],
        'Orifice flow for turbulent conditions.', 'Turbulent flow; cavitation not checked.', {
          checks: [check('Discharge coefficient', 'verify', 'Confirm Cd for the actual geometry and Reynolds number.')],
        });
    },
    "accumulator-size": (v) => {
      if (!(v.p0 < v.p1 && v.p1 < v.p2)) return invalid('Pressures must satisfy precharge < minimum < maximum.');
      const P0 = v.p0 + ATM, P1 = v.p1 + ATM, P2 = v.p2 + ATM, k = 1 / v.n, V0 = v.dV / ((P0 / P1) ** k - (P0 / P2) ** k);
      return output({ V0, V1: V0 * (P0 / P1) ** k, V2: V0 * (P0 / P2) ** k }, 'Accumulator size (L)', V0,
        [m('Nominal gas volume', q(V0, 'L', 2)), m('Gas volume at minimum pressure', q(V0 * (P0 / P1) ** k, 'L', 2)), m('Gas volume at maximum pressure', q(V0 * (P0 / P2) ** k, 'L', 2)), m('Precharge / minimum pressure', q(v.p0 / v.p1, '', 2))],
        'Gas volume needed to deliver the oil volume.', 'Ideal gas behaviour; allow a margin.', {
          checks: [check('Precharge ratio', v.p0 <= 0.9 * v.p1 ? 'pass' : 'warn', `Precharge is ${q(100 * v.p0 / v.p1, '%', 0)} of minimum pressure; about 90% or less protects the bladder.`), check('Pressure ratio', P2 / P0 <= 4 ? 'pass' : 'warn', `Maximum ÷ precharge = ${q(P2 / P0, '', 2)} (absolute); bladder makers often limit this to about 4.`)],
        });
    },
    "pipe-friction": (v) => {
      const d = v.d / 1000, A = PI * d * d / 4, vel = v.Q / 60000 / A, Re = vel * d / (v.nu * 1e-6);
      let f; const lam = Re < 2300;
      if (Re === 0) f = 0; else if (lam) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const dp = (f * v.L / d + v.K) * v.rho * vel * vel / 2, head = dp / (v.rho * 9.80665);
      return output({ vel, Re, f, dp: dp / 1e5, head }, 'Pressure drop (bar)', dp / 1e5,
        [m('Velocity', q(vel, 'm/s', 3)), m('Reynolds number', q(Re, '', 0)), m('Flow regime', lam ? 'Laminar' : Re < 4000 ? 'Transitional (uncertain)' : 'Turbulent'), m('Friction factor', q(f, '', 5)), m('Pressure drop', `${q(dp / 1e5, 'bar', 4)} (${q(dp / 1000, 'kPa', 2)})`), m('Head loss', q(head, 'm', 3))],
        'Pressure drop for the pipe and fittings.', 'Incompressible, fully developed flow.', {
          checks: [check('Flow regime', Re < 2300 || Re > 4000 ? 'pass' : 'warn', Re < 2300 || Re > 4000 ? 'Clearly laminar or turbulent.' : 'Transitional flow: the friction factor is uncertain.'), check('Operating viscosity', 'verify', 'Use viscosity at the actual oil temperature.')],
        });
    },
    "pump-affinity": (v) => {
      const s = v.n2 / v.n1, dr = v.D2 / v.D1, Q2 = v.Q1 * s * dr, H2 = v.H1 * (s * dr) ** 2, P2 = v.P1 * (s * dr) ** 3;
      return output({ Q2, H2, P2, saving: v.P1 - P2 }, 'New power (kW)', P2,
        [m('New flow', q(Q2, 'm³/h', 2)), m('New head', q(H2, 'm', 2)), m('New power', q(P2, 'kW', 3)), m('Power change', `${q(v.P1 - P2, 'kW', 3)} (${q(100 * (1 - P2 / v.P1), '%', 1)})`)],
        'Affinity-law prediction at the new speed and diameter.', 'No static head; small trims only.', {
          checks: [check('Impeller trim', dr >= 0.8 ? 'pass' : 'warn', dr >= 0.8 ? 'Within about 20% trim.' : 'Large trim: the affinity laws become inaccurate.'), check('Static head', 'verify', 'With static head, plot the curves to find the real operating point.')],
        });
    },
    "npsh-available": (v) => {
      if (v.pv >= v.ps) return invalid('The vapour pressure is at or above the surface pressure: the liquid will boil.');
      const npsha = (v.ps - v.pv) * 1000 / (v.rho * 9.80665) + v.z - v.hf, marg = npsha - v.npshr, ok = marg >= v.margin;
      return output({ npsha, marg }, 'NPSH available (m)', npsha,
        [m('NPSH available', q(npsha, 'm', 2)), m('NPSH required', q(v.npshr, 'm', 2)), m('Margin', q(marg, 'm', 2))],
        ok ? 'Enough suction head to avoid cavitation with the required margin.' : 'Not enough suction head: the pump risks cavitation.', 'NPSHr per pump curve (3% head drop).', {
          text: ok ? 'NPSH ADEQUATE' : 'CAVITATION RISK', tone: ok ? 'good' : 'bad',
          checks: [check('Margin over NPSHr', ok ? 'pass' : 'fail', `${q(marg, 'm', 2)} against ${q(v.margin, 'm', 2)} required.`)],
        });
    },
    "hydraulic-motor": (v) => {
      const T = v.Vd * v.dp * (v.em / 100) / (20 * PI), n = v.Q * 1000 * (v.ev / 100) / v.Vd, Pout = 2 * PI * n * T / 60000, Ph = v.Q * v.dp / 600;
      return output({ T, n, Pout, Ph }, 'Output torque (N·m)', T,
        [m('Output torque', q(T, 'N·m', 1)), m('Output speed', q(n, 'rpm', 0)), m('Output power', q(Pout, 'kW', 2)), m('Hydraulic input power', q(Ph, 'kW', 2)), m('Overall efficiency', q(100 * Pout / Ph, '%', 1))],
        'Motor output at the entered flow and pressure.', 'Efficiencies as entered for this operating point.', {
          checks: [check('Starting torque', 'verify', 'Use the maker’s starting efficiency for breakaway loads.')],
        });
    },
    "pipe-size-velocity": (v) => {
      const Qs = v.Q / 60000, dmin = Math.sqrt(4 * Qs / (PI * v.v)) * 1000, va = v.dActual > 0 ? Qs / (PI * (v.dActual / 1000) ** 2 / 4) : null, ok = va === null || va <= v.v;
      return output({ dmin, va }, 'Minimum inside diameter (mm)', dmin,
        [m('Minimum inside diameter', q(dmin, 'mm', 2)), m('Velocity in actual bore', va === null ? 'No bore entered' : q(va, 'm/s', 2))],
        'Bore for the target mean velocity.', 'Velocity guidance only; check pressure drop separately.', {
          ...(va !== null ? (ok ? { text: 'BORE ADEQUATE', tone: 'good' } : { text: 'VELOCITY TOO HIGH', tone: 'bad' }) : {}),
          checks: [check('Actual bore', va === null ? 'verify' : ok ? 'pass' : 'fail', va === null ? 'Enter a bore to check it.' : `${q(va, 'm/s', 2)} against ${q(v.v, 'm/s', 2)} target.`)],
        });
    },
    "hydrostatic-force": (v) => {
      const g = 9.80665, pb = v.ps * 1000 + v.rho * g * v.h, Fl = v.rho * g * v.w * v.h * v.h / 2, Fg = v.ps * 1000 * v.w * v.h, F = Fl + Fg, y = F > 0 ? (Fl * v.h / 3 + Fg * v.h / 2) / F : 0;
      return output({ pb, F, y, Ff: pb * v.floor }, 'Wall force (kN)', F / 1000,
        [m('Pressure at bottom', q(pb / 1000, 'kPa', 2)), m('Resultant wall force', q(F / 1000, 'kN', 2)), m('Height of centre of pressure', q(y, 'm', 3)), m('Floor force', q(pb * v.floor / 1000, 'kN', 1))],
        'Static liquid pressure on the wall and floor.', 'Static liquid; dynamic loads excluded.', {
          checks: [check('Dynamic loads', 'verify', 'Add sloshing, filling surge and other loads where they apply.')],
        });
    },
    "compressor-power": (v) => {
      const P1 = v.p1 * 1e5, P2 = (v.p2 + ATM) * 1e5, Qs = v.Q / 60, r = P2 / P1;
      if (r <= 1) return invalid('The discharge pressure must be above the inlet pressure.');
      const iso = P1 * Qs * Math.log(r) / 1000, ad = v.stages * v.k / (v.k - 1) * P1 * Qs * (Math.pow(r, (v.k - 1) / (v.stages * v.k)) - 1) / 1000, shaft = ad / (v.eff / 100);
      return output({ r, iso, ad, shaft, spec: shaft / v.Q }, 'Shaft power (kW)', shaft,
        [m('Pressure ratio', q(r, '', 3)), m('Isothermal power', q(iso, 'kW', 2)), m('Adiabatic power', q(ad, 'kW', 2)), m('Shaft power', q(shaft, 'kW', 2)), m('Specific power', q(shaft / v.Q, 'kW per m³/min', 3))],
        `${v.stages}-stage compression to ${q(v.p2, 'bar g')}.`, 'Theoretical power with an overall efficiency.', {
          checks: [check('Maker data', 'verify', 'Compare with the compressor’s published specific power.')],
        });
    },
    "air-leak-cost": (v) => {
      const k = 1.4, R = 287.05, p0 = (v.p + ATM) * 1e5, T0 = v.Tair + 273.15, A = PI * (v.d / 1000) ** 2 / 4;
      const mdot = v.Cd * A * p0 * Math.sqrt(k / (R * T0)) * Math.pow(2 / (k + 1), (k + 1) / (2 * (k - 1))), fromHole = mdot / 1.204 * 1000;
      const Ls = v.measured > 0 ? v.measured : fromHole;
      if (Ls <= 0) return invalid('Enter a hole diameter or a measured leak flow.');
      const kW = Ls * 60 / 1000 * v.spec, kWh = kW * v.hours, cost = kWh * v.price;
      return output({ Ls, kW, kWh, cost, costText: money(cost) }, 'Cost per year (AUD)', cost,
        [m('Leak flow (free air)', `${q(Ls, 'L/s', 2)} (${q(Ls * 60 / 1000, 'm³/min', 3)})`), m('Compressor power wasted', q(kW, 'kW', 2)), m('Energy per year', q(kWh, 'kWh', 0)), m('Cost per year', money(cost))],
        v.measured > 0 ? 'Cost of the measured leak.' : 'Cost of the leak estimated from its hole size.', 'Choked flow estimate; part-load effects not modelled.', {
          checks: [check('Flow basis', v.measured > 0 ? 'pass' : 'verify', v.measured > 0 ? 'Measured leak flow used.' : 'Estimated from the hole; confirm with a leak-down test or flow meter.'), check('Choked flow', v.p >= 0.9 ? 'pass' : 'warn', v.p >= 0.9 ? 'Pressure high enough for choked flow.' : 'Low pressure: the choked-flow estimate overstates the leak.')],
        });
    },
    "air-receiver": (v) => {
      if (v.p2 >= v.p1) return invalid('The minimum pressure must be below the starting pressure.');
      const V = v.t * v.deficit * ATM / (v.p1 - v.p2), has = v.Vactual > 0, cover = has ? v.Vactual * (v.p1 - v.p2) / (ATM * v.deficit) : null, ok = !has || cover >= v.t;
      return output({ V, cover }, 'Required receiver volume (m³)', V,
        [m('Required receiver volume', `${q(V, 'm³', 3)} (${q(V * 1000, 'L', 0)})`), m('Air stored in the pressure band (per m³)', q((v.p1 - v.p2) / ATM, 'm³', 3)), m('Time covered by actual receiver', has ? q(cover, 'min', 2) : 'No receiver entered')],
        'Storage to cover the deficit within the pressure band.', 'Isothermal draw-down.', {
          ...(has ? (ok ? { text: 'RECEIVER ADEQUATE', tone: 'good' } : { text: 'RECEIVER TOO SMALL', tone: 'bad' }) : {}),
          checks: [check('Actual receiver', has ? (ok ? 'pass' : 'fail') : 'verify', has ? `Covers ${q(cover, 'min', 2)} of ${q(v.t, 'min', 2)} needed.` : 'Enter a receiver volume to check it.'), check('Pressure equipment', 'verify', 'Receivers must comply with pressure equipment regulations.')],
        });
    },
    "gas-law": (v) => {
      const P1 = v.p1 + v.patm, P2 = v.p2 + v.patm, K1 = v.T1 + 273.15, K2 = v.T2 + 273.15;
      if (P1 <= 0 || P2 <= 0 || K1 <= 0 || K2 <= 0) return invalid('Absolute pressures and temperatures must be above zero.');
      const V2 = v.V1 * (P1 / P2) * (K2 / K1);
      return output({ V2, P1, P2, ratio: V2 / v.V1 }, 'Volume at state 2', V2,
        [m('Volume or flow at state 2', q(V2, '', 5)), m('Absolute pressures', `${q(P1, '', 3)} → ${q(P2, 'bar abs', 3)}`), m('Absolute temperatures', `${q(K1, '', 2)} → ${q(K2, 'K', 2)}`), m('Volume ratio V₂/V₁', q(V2 / v.V1, '', 5))],
        'Ideal gas conversion between the two states.', 'Ideal gas, dry.', {
          checks: [check('Reference conditions', 'verify', 'State the pressure and temperature basis with every gas volume or flow.')],
        });
    },
    "depreciation-schedule": (v) => {
      if (v.salvage >= v.cost) return invalid('The salvage value must be less than the cost.');
      let book = v.cost; const rows = [], base = v.cost - v.salvage, syd = v.life * (v.life + 1) / 2;
      for (let t = 1; t <= v.life; t++) {
        let D = v.method === 'sl' ? base / v.life : v.method === 'syd' ? base * (v.life - t + 1) / syd : Math.min(book * 2 / v.life, Math.max(0, book - v.salvage));
        book -= D; rows.push([String(t), money(D), money(book), D]);
      }
      return output({ first: rows[0][3], end: book, firstText: money(rows[0][3]), endText: money(book) }, 'First-year depreciation (AUD)', rows[0][3],
        [m('First-year depreciation', money(rows[0][3])), m('Book value at end of life', money(book)), m('Total depreciation', money(v.cost - book))],
        `${{ sl: 'Straight-line', syd: 'Sum-of-the-years’-digits', ddb: 'Double-declining-balance' }[v.method]} schedule over ${v.life} years.`, 'Accounting illustration; tax rules differ.', {
          table: tbl('Depreciation schedule', ['Year', 'Depreciation', 'Closing book value'], rows.map((r) => r.slice(0, 3))),
          checks: [check('Tax treatment', 'verify', 'Confirm tax depreciation with your accountant (e.g. ATO effective life rules).')],
        });
    },
    "euac-compare": (v) => {
      const i = v.rate / 100, ap = (n) => (i === 0 ? 1 / n : i * (1 + i) ** n / ((1 + i) ** n - 1)), af = (n) => (i === 0 ? 1 / n : i / ((1 + i) ** n - 1));
      const eA = v.pA * ap(v.nA) + v.aA - v.sA * af(v.nA), eB = v.pB * ap(v.nB) + v.aB - v.sB * af(v.nB), best = eA <= eB ? 'A' : 'B', diff = Math.abs(eA - eB);
      return output({ eA, eB, diff, euacA: money(eA), euacB: money(eB) }, 'Annual saving of preferred option (AUD)', diff,
        [m('EUAC option A', money(eA)), m('EUAC option B', money(eB)), m('Annual saving', money(diff)), m('Capitalised cost A / B', i > 0 ? `${money(eA / i)} / ${money(eB / i)}` : 'Not defined at 0%')],
        `Option ${best} has the lower equivalent annual cost.`, 'Like-for-like repetition with constant costs.', {
          text: `OPTION ${best}`, tone: 'good',
          table: tbl('Annual cost breakdown', ['Item', 'Option A', 'Option B'], [['Capital recovery', money(v.pA * ap(v.nA)), money(v.pB * ap(v.nB))], ['Operating cost', money(v.aA), money(v.aB)], ['Salvage credit', money(-v.sA * af(v.nA)), money(-v.sB * af(v.nB))], ['EUAC', money(eA), money(eB)]]),
          checks: [check('Margin between options', diff / Math.max(eA, eB) >= 0.05 ? 'pass' : 'warn', diff / Math.max(eA, eB) >= 0.05 ? 'The options differ by 5% or more.' : 'Within 5%: the choice is sensitive to the assumptions.'), check('Equal service', 'verify', 'Confirm both options deliver the same capacity, quality and risk.')],
        });
    },
    "irr-uneven": (v) => {
      const cfs = [1, 2, 3, 4, 5, 6, 7, 8].map((y) => v['cf' + y]); let last = cfs.length; while (last > 0 && cfs[last - 1] === 0) last--;
      if (!last) return invalid('Enter at least one yearly cash flow.');
      const npv = (r) => -v.P + cfs.slice(0, last).reduce((s, c, t) => s + c / (1 + r) ** (t + 1), 0);
      let lo = -0.99, hi = 10, irr = null;
      if (npv(lo) * npv(hi) < 0) { for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (npv(lo) * npv(mid) <= 0) hi = mid; else lo = mid; } irr = 100 * (lo + hi) / 2; }
      let cum = -v.P, pay = null; for (let t = 0; t < last; t++) { if (cum + cfs[t] >= 0 && pay === null && cfs[t] > 0) pay = t + (-cum) / cfs[t]; cum += cfs[t]; }
      const N = npv(v.hurdle / 100), ok = N > 0;
      return output({ irr: irr ?? 0, npv: N, npvText: money(N), pay }, 'NPV at hurdle rate (AUD)', N,
        [m('Internal rate of return', irr === null ? 'No single IRR found' : q(irr, '%', 2)), m(`NPV at ${q(v.hurdle, '%', 1)}`, money(N)), m('Simple payback', pay === null ? 'Not within the cash flows' : q(pay, 'years', 2)), m('Undiscounted net return', money(cfs.slice(0, last).reduce((a, b) => a + b, 0) - v.P))],
        ok ? 'The project earns more than the hurdle rate.' : 'The project does not reach the hurdle rate.', 'Year-end cash flows; single sign change assumed for IRR.', {
          text: ok ? 'MEETS HURDLE RATE' : 'BELOW HURDLE RATE', tone: ok ? 'good' : 'bad',
          checks: [check('NPV at hurdle rate', ok ? 'pass' : 'fail', `${money(N)} at ${q(v.hurdle, '%', 1)}.`), check('Cash flow evidence', 'verify', 'Base savings on measured data and include all costs.')],
        });
    },
    "interest-factors": (v) => {
      const i = Math.pow(1 + v.rate / 100 / v.m, v.m) - 1, n = v.n, g = (1 + i) ** n;
      const FP = g, PF = 1 / g, PA = i === 0 ? n : (g - 1) / (i * g), AP = 1 / PA, AF = i === 0 ? 1 / n : i / (g - 1), FA = 1 / AF, AG = i === 0 ? (n - 1) / 2 : 1 / i - n / (g - 1), PG = i === 0 ? n * (n - 1) / 2 : (PA - n / g) / i;
      const rows = [['F/P', 'Future value of a present amount', FP], ['P/F', 'Present value of a future amount', PF], ['A/P', 'Annual amount from a present amount', AP], ['P/A', 'Present value of an annual series', PA], ['A/F', 'Annual amount to reach a future amount', AF], ['F/A', 'Future value of an annual series', FA], ['A/G', 'Annual equivalent of a gradient', AG], ['P/G', 'Present value of a gradient', PG]];
      return output({ i: 100 * i, FP, PF, PA, AP, AF, FA, AG, PG }, 'Effective annual rate (%)', 100 * i,
        [m('Effective annual rate', q(100 * i, '%', 4)), m('P/A', q(PA, '', 5)), m('A/P', q(AP, '', 5)), m('F/P', q(FP, '', 5))],
        `Interest factors at ${q(100 * i, '%', 3)} effective over ${n} years.`, 'End-of-period cash flows.', {
          table: tbl('Interest factors', ['Factor', 'Meaning', 'Value', `Applied to ${money(v.amount)}`], rows.map((r) => [r[0], r[1], q(r[2], '', 6), money(v.amount * r[2])])),
          checks: [check('Rate basis', 'verify', 'Use a real rate with constant-dollar costs, or a nominal rate with escalated costs.')],
        });
    },
    "normal-out-of-spec": (v) => {
      if (v.usl <= v.lsl) return invalid('The upper limit must be above the lower limit.');
      const erfc = (x) => { const z = Math.abs(x), t = 1 / (1 + 0.5 * z), r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; };
      const Phi = (x) => 0.5 * erfc(-x / Math.SQRT2);
      const zl = (v.mean - v.lsl) / v.sd, zu = (v.usl - v.mean) / v.sd, below = Phi(-zl), above = Phi(-zu), tot = below + above, ppm = tot * 1e6;
      return output({ zl, zu, below, above, ppm }, 'Parts per million out of tolerance', ppm,
        [m('Z to lower limit', q(zl, '', 3)), m('Z to upper limit', q(zu, '', 3)), m('Below lower limit', `${q(below * 1e6, 'ppm', 1)}`), m('Above upper limit', `${q(above * 1e6, 'ppm', 1)}`), m('Total out of tolerance', `${q(ppm, 'ppm', 1)} (${q(100 * tot, '%', 4)})`), m('Expected count', q(tot * v.qty, 'parts', 1)), m('Yield', q(100 * (1 - tot), '%', 4))],
        'Normal-distribution estimate of parts outside the limits.', 'Stable normal process assumed.', {
          checks: [check('Process stability and normality', 'verify', 'Confirm with a control chart and normality check before relying on tail estimates.'), check('Centring', Math.abs(zl - zu) < 0.5 ? 'pass' : 'warn', Math.abs(zl - zu) < 0.5 ? 'Process is roughly centred.' : 'The mean is off-centre; centring would reduce ppm.')],
        });
    },
    "sample-size-mean": (v) => {
      const z = { 90: 1.6449, 95: 1.96, 99: 2.5758 }[v.conf], n0 = (z * v.sd / v.E) ** 2, nf = v.pop > 0 ? n0 / (1 + (n0 - 1) / v.pop) : n0, n = Math.max(2, Math.ceil(nf - 1e-9));
      return output({ n0, n, z }, 'Required sample size', n,
        [m('Required sample size', String(n)), m('Before rounding', q(nf, '', 2)), m('z value', q(z, '', 4))],
        `${n} measurements estimate the mean within ±${q(v.E, '', 6)} at ${v.conf}% confidence.`, 'Normal approximation; σ estimate supplied by the user.', {
          checks: [check('Standard deviation estimate', 'verify', 'Confirm σ from a pilot study or historical data.')],
        });
    },
    "two-sample-t": (v) => {
      const lgamma = (x) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, tmp = x + 5.5; tmp -= (x + 0.5) * Math.log(tmp); let ser = 1.000000000190015; for (const cj of c) ser += cj / ++y; return -tmp + Math.log(2.5066282746310005 * ser / x); };
      const betacf = (a, b, x) => { let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < 1e-30) d = 1e-30; d = 1 / d; let h = d; for (let mm = 1; mm <= 300; mm++) { const m2 = 2 * mm; let aa = mm * (b - mm) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; h *= d * c; aa = -(a + mm) * (qab + mm) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < 1e-30) d = 1e-30; c = 1 + aa / c; if (Math.abs(c) < 1e-30) c = 1e-30; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-14) break; } return h; };
      const ibeta = (a, b, x) => { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b; };
      const tcrit = (df, p) => { let lo = 0, hi = 1000; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (ibeta(df / 2, 0.5, df / (df + mid * mid)) > p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const a1 = v.s1 * v.s1 / v.n1, a2 = v.s2 * v.s2 / v.n2, se = Math.sqrt(a1 + a2);
      if (se === 0) return invalid('At least one standard deviation must be greater than zero.');
      const diff = v.m1 - v.m2, t = diff / se, df = (a1 + a2) ** 2 / (a1 * a1 / (v.n1 - 1) + a2 * a2 / (v.n2 - 1)), p = ibeta(df / 2, 0.5, df / (df + t * t)), alpha = Number(v.alpha), tc = tcrit(df, alpha), sig = p < alpha;
      return output({ diff, se, t, df, p, lo: diff - tc * se, hi: diff + tc * se }, 'p-value (two-sided)', p,
        [m('Difference of means', q(diff, '', 5)), m('Standard error', q(se, '', 5)), m('t statistic', q(t, '', 4)), m('Degrees of freedom (Welch)', q(df, '', 2)), m('p-value (two-sided)', q(p, '', 5)), m(`${q(100 * (1 - alpha), '%', 0)} confidence interval`, `${q(diff - tc * se, '', 5)} to ${q(diff + tc * se, '', 5)}`)],
        sig ? 'The difference is statistically significant at the chosen level.' : 'The difference is not statistically significant at the chosen level.', 'Independent, roughly normal samples.', {
          text: sig ? 'SIGNIFICANT DIFFERENCE' : 'NO SIGNIFICANT DIFFERENCE', tone: sig ? 'good' : 'warn',
          checks: [check('Significance', sig ? 'pass' : 'warn', `p = ${q(p, '', 4)} against α = ${v.alpha}.`), check('Sampling assumptions', 'verify', 'Confirm samples are independent, random and roughly normal.')],
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
