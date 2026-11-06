// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook13). SI units are explicit at each boundary.
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
    "bearing-friction": (v) => {
      const M = 0.5 * v.mu * v.P * v.d / 1000, W = M * 2 * PI * v.rpm / 60 * v.n;
      return output({ M, W }, 'Power loss (W)', W,
        [m('Friction torque per bearing', q(M, 'N·m', 4)), m('Power loss (all bearings)', q(W, 'W', 1)), m('Heat per hour', q(W * 3.6, 'kJ', 0))],
        'Approximate bearing friction losses.', 'Constant-coefficient approximation.', {
          checks: [check('Seal and lubricant drag', 'verify', 'Add seal and churning losses from the bearing maker’s model.')],
        });
    },
    "oil-viscosity-temperature": (v) => {
      if (v.T1 === v.T2) return invalid('The two known temperatures must differ.');
      const Y = (nu) => Math.log10(Math.log10(nu + 0.7)), X = (t) => Math.log10(t + 273.15);
      const B = (Y(v.v1) - Y(v.v2)) / (X(v.T2) - X(v.T1)), A = Y(v.v1) + B * X(v.T1), nu = Math.pow(10, Math.pow(10, A - B * X(v.T))) - 0.7;
      const inside = v.T >= Math.min(v.T1, v.T2) && v.T <= Math.max(v.T1, v.T2);
      return output({ nu, A, B }, 'Viscosity (cSt)', nu,
        [m('Viscosity at operating temperature', q(nu, 'cSt', 2)), m('Walther constant A', q(A, '', 5)), m('Walther constant B', q(B, '', 5))],
        'Viscosity from the ASTM D341 relation.', 'Normal-range oils.', {
          checks: [check('Within data range', inside ? 'pass' : 'warn', inside ? 'Interpolated between the data points.' : 'Extrapolated; check against maker data, especially at low temperature.')],
        });
    },
    "rim-face-alignment": (v) => {
      const offset = v.rim / 2, slope = v.face / v.dia, front = offset + slope * v.front, back = offset + slope * v.back;
      const tag = (x) => (x >= 0 ? `add ${q(x, 'mm', 3)}` : `remove ${q(-x, 'mm', 3)}`);
      return output({ offset, slope, front, back }, 'Correction at back feet (mm)', back,
        [m('Offset at coupling', q(offset, 'mm', 3)), m('Angularity', `${q(slope * 1000, 'mm/m', 3)}`), m('Front feet', tag(front)), m('Back feet', tag(back))],
        'Foot corrections from rim and face readings.', 'Stated sign convention; sag and thermal growth excluded.', {
          checks: [check('Sign convention and sag', 'verify', 'Confirm the indicator set-up matches the convention and correct for bracket sag.'), check('Soft foot', 'verify', 'Check and correct soft foot before shimming.')],
        });
    },
    "motor-slip": (v) => {
      const ns = 120 * v.f / Number(v.poles);
      if (v.n >= ns || v.nRated >= ns) return invalid('Speeds must be below the synchronous speed.');
      const slip = 100 * (ns - v.n) / ns, sr = 100 * (ns - v.nRated) / ns, load = 100 * slip / sr;
      return output({ ns, slip, sr, load }, 'Estimated load (%)', load,
        [m('Synchronous speed', q(ns, 'rpm', 0)), m('Slip at measured speed', q(slip, '%', 2)), m('Rated slip', q(sr, '%', 2)), m('Estimated load', q(load, '% of rated', 0))],
        'Slip-based load estimate.', 'Approximate; rated voltage assumed.', {
          checks: [check('Load level', load <= 110 ? 'pass' : 'warn', load <= 110 ? 'Within rating.' : 'Apparently overloaded: confirm with a current measurement.'), check('Measurement', 'verify', 'Confirm with a power or current measurement for decisions.')],
        });
    },
    "water-hammer": (v) => {
      const K = v.K * 1e9, E = v.E * 1e9, a = Math.sqrt((K / v.rho) / (1 + K * v.D / (E * v.t))), tcrit = 2 * v.L / a, dpJ = v.rho * a * v.dv, dp = v.tc <= tcrit ? dpJ : dpJ * tcrit / v.tc;
      return output({ a, tcrit, dpJ, dp }, 'Surge pressure (bar)', dp / 1e5,
        [m('Wave speed', q(a, 'm/s', 0)), m('Critical closure time 2L/a', q(tcrit, 's', 3)), m('Joukowsky surge (fast closure)', q(dpJ / 1e5, 'bar', 2)), m('Surge for this closing time', q(dp / 1e5, 'bar', 2))],
        v.tc <= tcrit ? 'The valve closes faster than the pressure wave returns: full Joukowsky surge.' : 'Slow closure reduces the surge.', 'Simple estimate; transient analysis for important systems.', {
          checks: [check('Closing time', v.tc > tcrit ? 'pass' : 'warn', `Closing in ${q(v.tc, 's', 2)} against a critical time of ${q(tcrit, 's', 2)}.`), check('Pressure rating', 'verify', 'Add the surge to the working pressure and compare with component ratings.')],
        });
    },
    "coolant-flow-heat": (v) => {
      const k = v.rho * v.cp / 60000; let Q, dT;
      if (v.mode === 'flow') { dT = v.dT; Q = v.kW / (k * dT); } else { Q = v.Q; dT = v.kW / (k * Q); }
      return output({ Q, dT, mdot: Q * v.rho / 60000 }, v.mode === 'flow' ? 'Flow (L/min)' : 'Temperature rise (K)', v.mode === 'flow' ? Q : dT,
        [m('Flow', `${q(Q, 'L/min', 1)} (${q(Q * 0.06, 'm³/h', 2)})`), m('Temperature rise', q(dT, 'K', 2)), m('Mass flow', q(Q * v.rho / 60000, 'kg/s', 3))],
        'Heat balance on the coolant stream.', 'Steady state, mean properties.', {
          checks: [check('Fluid properties', 'verify', 'Use cp and density for the actual fluid and temperature.')],
        });
    },
    "air-pipe-drop": (v) => {
      const pabs = v.p + 1.01325, Tk = v.T + 273.15, rho = 1.204 * (pabs / 1.01325) * (293.15 / Tk), Qa = v.Q / 60 * (1.01325 / pabs) * (Tk / 293.15), d = v.d / 1000, vel = Qa / (PI * d * d / 4), Re = rho * vel * d / 1.81e-5;
      let f = 0.02; if (Re < 2300) f = 64 / Re; else for (let k = 0; k < 50; k++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2;
      const dp = f * v.L / d * rho * vel * vel / 2 / 1e5, share = 100 * dp / pabs;
      return output({ vel, Re, f, dp, share }, 'Pressure drop (bar)', dp,
        [m('Air velocity', q(vel, 'm/s', 2)), m('Reynolds number', q(Re, '', 0)), m('Friction factor', q(f, '', 5)), m('Pressure drop', q(dp, 'bar', 4)), m('Share of absolute pressure', q(share, '%', 2))],
        'Darcy–Weisbach drop for compressed air.', 'Small-drop approximation.', {
          checks: [check('Small-drop approximation', share <= 10 ? 'pass' : 'warn', share <= 10 ? 'Drop is a small share of line pressure.' : 'Drop over 10%: calculate in shorter sections.'), check('Air velocity', vel <= 10 ? 'pass' : 'warn', `${q(vel, 'm/s', 1)}; mains are usually designed for about 6–10 m/s or less.`)],
        });
    },
    "pneumatic-cylinder-force": (v) => {
      if (v.rod >= v.bore) return invalid('The rod must be smaller than the bore.');
      const p = v.p / 10, Aext = PI * v.bore ** 2 / 4, Aret = PI * (v.bore ** 2 - v.rod ** 2) / 4, Fe = p * Aext * v.eff / 100, Fr = p * Aret * v.eff / 100;
      const lr = 100 * v.load / (p * Aext), minBore = Math.sqrt(4 * v.load / (PI * p * v.ratio / 100)), ok = lr <= v.ratio;
      return output({ Fe, Fr, lr, minBore }, 'Load ratio (%)', lr,
        [m('Extend force', q(Fe, 'N', 0)), m('Retract force', q(Fr, 'N', 0)), m('Load ratio', q(lr, '%', 1)), m('Minimum bore for the load ratio', q(minBore, 'mm', 1))],
        `${q(v.bore, 'mm')} bore at ${q(v.p, 'bar')}.`, 'Static force only.', {
          text: ok ? 'BORE ADEQUATE' : 'BORE TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Load ratio', ok ? 'pass' : 'fail', `${q(lr, '%', 1)} against ${q(v.ratio, '%', 0)} maximum.`)],
        });
    },
    "vacuum-cup": (v) => {
      const per = v.vac * PI * v.D * v.D / 4 / 1000, Fh = per * v.n, base = v.mass * (9.80665 + v.accel), req = (v.orient === 'horizontal' ? base : base / v.mu) * v.sf, ok = Fh >= req;
      return output({ per, Fh, req }, 'Holding margin', Fh / req,
        [m('Holding force per cup', q(per, 'N', 1)), m('Total holding force', q(Fh, 'N', 0)), m('Force required (with safety factor)', q(req, 'N', 0)), m('Margin', q(Fh / req, '', 2))],
        `${v.n} cups at ${q(v.vac, 'kPa')} vacuum.`, 'Flat, sealed surfaces.', {
          text: ok ? 'CUPS HOLD' : 'CUPS INSUFFICIENT', tone: ok ? 'good' : 'bad',
          checks: [check('Holding force', ok ? 'pass' : 'fail', `${q(Fh, 'N', 0)} against ${q(req, 'N', 0)} required.`), check('Surface condition', 'verify', 'Porous, curved or oily surfaces reduce holding force.')],
        });
    },
    "valve-flow-coefficient": (v) => {
      let Kv, Q;
      if (v.mode === 'kv') { Q = v.Q; Kv = Q * Math.sqrt(v.sg / v.dp); } else { Kv = v.Kv; Q = Kv * Math.sqrt(v.dp / v.sg); }
      return output({ Kv, Cv: 1.156 * Kv, Q }, v.mode === 'kv' ? 'Kv' : 'Flow (m³/h)', v.mode === 'kv' ? Kv : Q,
        [m('Kv', q(Kv, 'm³/h', 3)), m('Cv', q(1.156 * Kv, 'US gpm', 3)), m('Flow', `${q(Q, 'm³/h', 3)} (${q(Q * 1000 / 60, 'L/min', 1)})`)],
        'Liquid valve sizing relation.', 'Non-cavitating liquid flow.', {
          checks: [check('Cavitation and flashing', 'verify', 'Check for cavitation at large pressure drops or hot liquids.')],
        });
    },
    "radiant-heat": (v) => {
      const s = 5.670374e-8, Ts = v.Ts + 273.15, Ta = v.Ta + 273.15, Q = v.eps * s * v.area * (Ts ** 4 - Ta ** 4), hr = v.Ts !== v.Ta ? Q / (v.area * (v.Ts - v.Ta)) : 0;
      return output({ Q, flux: Q / v.area, hr }, 'Radiant heat (W)', Q,
        [m('Net radiant heat', `${q(Q, 'W', 0)} (${q(Q / 1000, 'kW', 2)})`), m('Heat flux', q(Q / v.area, 'W/m²', 0)), m('Equivalent radiation coefficient', q(hr, 'W/(m²·K)', 2))],
        'Net radiation to large surroundings.', 'Grey surface, large enclosure.', {
          checks: [check('Convection', 'verify', 'Add convective loss for the total heat loss.')],
        });
    },
    "insulated-pipe": (v) => {
      const r1 = v.D / 2000, r2 = r1 + v.t / 1000, R = (v.t > 0 ? Math.log(r2 / r1) / (2 * PI * v.k) : 0) + 1 / (2 * PI * r2 * v.h), qm = (v.Ti - v.Ta) / R, Ts = v.Ta + qm / (2 * PI * r2 * v.h);
      const total = qm * v.L, kWh = total / 1000 * v.hours, cost = kWh * v.price;
      return output({ q: qm, total, Ts, kWh, cost }, 'Heat loss per metre (W/m)', qm,
        [m('Heat loss per metre', q(qm, 'W/m', 1)), m('Total heat loss', q(total / 1000, 'kW', 2)), m('Outer surface temperature', q(Ts, '°C', 1)), m('Energy per year', q(kWh, 'kWh', 0)), m('Cost per year', money(cost))],
        v.t > 0 ? 'Loss through the insulation.' : 'Loss from bare pipe.', 'Steady state; pipe wall neglected.', {
          checks: [check('Surface temperature', Ts <= 60 ? 'pass' : 'warn', `${q(Ts, '°C', 0)}; compare with your burn-protection limit (often about 60 °C for metal).`)],
        });
    },
    "lmtd-exchanger": (v) => {
      const c = v.flow === 'counter', d1 = c ? v.Thi - v.Tco : v.Thi - v.Tci, d2 = c ? v.Tho - v.Tci : v.Tho - v.Tco;
      if (d1 <= 0 || d2 <= 0) return invalid('The temperatures cross: the hot fluid must stay hotter than the cold fluid along the exchanger.');
      const lmtd = Math.abs(d1 - d2) < 1e-9 ? d1 : (d1 - d2) / Math.log(d1 / d2), A = v.kW * 1000 / (v.U * lmtd);
      return output({ d1, d2, lmtd, A }, 'Area required (m²)', A,
        [m('Terminal differences', `${q(d1, '', 2)} and ${q(d2, 'K', 2)}`), m('LMTD', q(lmtd, 'K', 3)), m('Area required', q(A, 'm²', 3))],
        `${c ? 'Counter-flow' : 'Parallel-flow'} exchanger sizing.`, 'Pure flow arrangement; fouling in U.', {
          checks: [check('Temperature approach', Math.min(d1, d2) >= 3 ? 'pass' : 'warn', `Closest approach ${q(Math.min(d1, d2), 'K', 1)}; small approaches need large exchangers.`), check('Heat balance', 'verify', 'Confirm both streams’ flows and specific heats give the same duty.')],
        });
    },
    "process-breakeven": (v) => {
      const tA = v.sA + v.cA * v.qty, tB = v.sB + v.cB * v.qty, best = tA <= tB ? 'A' : 'B', dc = v.cA - v.cB, q0 = dc !== 0 ? (v.sB - v.sA) / dc : NaN, valid = Number.isFinite(q0) && q0 > 0;
      return output({ q0: valid ? q0 : 0, tA, tB, best }, 'Cost difference at planned quantity (AUD)', Math.abs(tA - tB),
        [m('Break-even quantity', valid ? q(q0, 'units', 0) : 'None: one process is cheaper at every quantity'), m('Process A total / per unit', `${money(tA)} / ${money(tA / v.qty)}`), m('Process B total / per unit', `${money(tB)} / ${money(tB / v.qty)}`), m('Cheaper at planned quantity', `Process ${best} by ${money(Math.abs(tA - tB))}`)],
        `Process ${best} is cheaper at ${v.qty} units.`, 'Linear cost model.', {
          text: `PROCESS ${best}`, tone: 'good',
          checks: [check('Distance from break-even', !valid || Math.abs(v.qty - q0) / q0 > 0.2 ? 'pass' : 'warn', !valid ? 'No crossover.' : `Planned quantity is ${q(100 * (v.qty - q0) / q0, '%', 0)} from break-even.`), check('Like-for-like quality', 'verify', 'Confirm both processes meet the same quality and lead time.')],
        });
    },
    "learning-curve": (v) => {
      const b = Math.log2(v.rate / 100); let cum = 0;
      for (let i = 1; i <= v.n; i++) cum += v.T1 * Math.pow(i, b);
      const Tn = v.T1 * Math.pow(v.n, b), avg = cum / v.n;
      return output({ Tn, cum, avg, b }, 'Cumulative time (h)', cum,
        [m(`Time for unit ${v.n}`, q(Tn, 'h', 3)), m('Cumulative time', q(cum, 'h', 1)), m('Average time per unit', q(avg, 'h', 3)), m('Batch labour cost', money(cum * v.cost)), m('Learning exponent b', q(b, '', 4))],
        'Wright learning curve projection.', 'Steady learning without breaks.', {
          checks: [check('Learning rate evidence', 'verify', 'Base the learning rate on your own history for similar work.')],
        });
    },
    "xbar-r-limits": (v) => {
      const C = { 2: [1.88, 0, 3.267, 1.128], 3: [1.023, 0, 2.574, 1.693], 4: [0.729, 0, 2.282, 2.059], 5: [0.577, 0, 2.114, 2.326], 6: [0.483, 0, 2.004, 2.534], 7: [0.419, 0.076, 1.924, 2.704], 8: [0.373, 0.136, 1.864, 2.847], 9: [0.337, 0.184, 1.816, 2.97], 10: [0.308, 0.223, 1.777, 3.078] }[v.n];
      const ucl = v.xbar + C[0] * v.rbar, lcl = v.xbar - C[0] * v.rbar, rucl = C[2] * v.rbar, rlcl = C[1] * v.rbar, sigma = v.rbar / C[3];
      return output({ ucl, lcl, rucl, rlcl, sigma }, 'Estimated sigma', sigma,
        [m('X-bar UCL / CL / LCL', `${q(ucl, '', 5)} / ${q(v.xbar, '', 5)} / ${q(lcl, '', 5)}`), m('R UCL / CL / LCL', `${q(rucl, '', 5)} / ${q(v.rbar, '', 5)} / ${q(rlcl, '', 5)}`), m('Estimated process σ', q(sigma, '', 6)), m('Constants A₂, D₃, D₄, d₂', C.map((c) => q(c, '', 3)).join(', '))],
        `Control limits for subgroups of ${v.n}.`, 'Valid for a stable process only.', {
          checks: [check('Process stability', 'verify', 'Use at least 20–25 subgroups from a stable process.')],
        });
    },
    "sampling-oc": (v) => {
      if (v.c >= v.n) return invalid('The acceptance number must be less than the sample size.');
      const lnC = (n, k) => { let s = 0; for (let i = 1; i <= k; i++) s += Math.log((n - k + i) / i); return s; };
      const Pa = (pp) => { if (pp <= 0) return 1; if (pp >= 1) return 0; let s = 0; for (let k = 0; k <= v.c; k++) s += Math.exp(lnC(v.n, k) + k * Math.log(pp) + (v.n - k) * Math.log(1 - pp)); return Math.min(1, s); };
      const pa = Pa(v.p / 100), rows = [0.5, 1, 2, 3, 5, 8, 10, 15].map((pp) => [q(pp, '%', 1), q(100 * Pa(pp / 100), '%', 1)]);
      return output({ Pa: pa, aoq: v.p * pa }, 'Probability of acceptance', pa,
        [m('Probability of acceptance', q(100 * pa, '%', 2)), m('Probability of rejection', q(100 * (1 - pa), '%', 2)), m('Average outgoing quality', q(v.p * pa, '%', 3))],
        `Plan n = ${v.n}, c = ${v.c} at ${q(v.p, '%', 2)} defective.`, 'Binomial model; random sampling.', {
          table: tbl('Operating characteristic', ['Lot % defective', 'Probability of acceptance'], rows),
          checks: [check('Lot size', 'verify', 'For lots under about ten times the sample, use the hypergeometric model.')],
        });
    },
    "weibull-reliability": (v) => {
      const gamma = (z) => { const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (z < 0.5) return PI / (Math.sin(PI * z) * gamma(1 - z)); z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i); const t = z + g + 0.5; return Math.sqrt(2 * PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x; };
      const R = Math.exp(-Math.pow(v.t / v.eta, v.beta)), h = v.beta / v.eta * Math.pow(v.t / v.eta, v.beta - 1), b10 = v.eta * Math.pow(-Math.log(0.9), 1 / v.beta), mttf = v.eta * gamma(1 + 1 / v.beta);
      const mode = v.beta < 1 ? 'Early-life failures (β < 1)' : v.beta === 1 ? 'Random failures (β = 1)' : 'Wear-out failures (β > 1)';
      return output({ R, F: 1 - R, h, b10, mttf }, 'Reliability at time t', R,
        [m('Reliability at t', q(100 * R, '%', 3)), m('Probability of failure by t', q(100 * (1 - R), '%', 3)), m('Hazard rate at t', q(h, 'per h', 8)), m('B10 life', q(b10, 'h', 0)), m('Mean time to failure', q(mttf, 'h', 0)), m('Failure pattern', mode)],
        'Weibull reliability at the chosen time.', 'Two-parameter Weibull from relevant data.', {
          checks: [check('Preventive replacement', v.beta > 1 ? 'pass' : 'warn', v.beta > 1 ? 'Wear-out pattern: time-based replacement can reduce failures.' : 'No wear-out: time-based replacement will not reduce failures.'), check('Data source', 'verify', 'Fit β and η from failure data for the same component and duty.')],
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
