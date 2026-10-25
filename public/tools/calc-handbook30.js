// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook30). SI units are explicit at each boundary.
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
    "chuck-grip-force": (v) => {
      const Fc = v.kc * v.ap * v.f, Ff = v.ratio * Fc, Fdyn = v.n * Math.hypot(Fc * v.dc / v.dg, Ff) / v.mu, w = 2 * PI * v.rpm / 60, k = v.jaws * v.mj * v.rc / 1000, Fcf = k * w * w;
      const Fset = v.grip === 'od' ? Fdyn + Fcf : Math.max(Fdyn - Fcf, Fdyn * 0.5), spare = v.Fmax * 1000 - Fdyn, nmax = v.grip === 'od' ? (spare > 0 ? Math.sqrt(spare / k) * 60 / (2 * PI) : 0) : Infinity;
      const ok = Fset <= v.Fmax * 1000 && (v.grip === 'id' || v.rpm <= nmax);
      return output({ Fc, Ff, Fdyn, Fcf, Fset, nmax: Number.isFinite(nmax) ? nmax : 0 }, 'Static grip to set (kN)', Fset / 1000,
        [m('Cutting force / feed force', `${q(Fc, '', 0)} / ${q(Ff, 'N', 0)}`), m('Grip needed while cutting', q(Fdyn / 1000, 'kN', 2)), m(v.grip === 'od' ? 'Grip lost to centrifugal force' : 'Grip gained from centrifugal force', q(Fcf / 1000, 'kN', 2)), m('Static grip to set', q(Fset / 1000, 'kN', 2)), m('Highest safe speed', Number.isFinite(nmax) ? (nmax > 0 ? q(nmax, 'rpm', 0) : 'The chuck cannot hold this cut') : 'Not limited by grip (inside gripping)')],
        'Chuck grip check.', 'Friction grip; rigid part.', {
          text: ok ? 'GRIP ADEQUATE' : 'GRIP INSUFFICIENT', tone: ok ? 'good' : 'bad',
          checks: [check('Chuck rating', Fset <= v.Fmax * 1000 ? 'pass' : 'fail', `${q(Fset / 1000, 'kN', 1)} against ${q(v.Fmax, 'kN', 0)}.`), check('Speed', v.grip === 'id' || v.rpm <= nmax ? 'pass' : 'fail', v.grip === 'id' ? 'Inside gripping gains grip with speed.' : `${q(v.rpm, 'rpm', 0)} against ${q(nmax, 'rpm', 0)}.`)],
        });
    },
    "coolant-system-sizing": (v) => {
      const heat = v.Pc * v.share / 100, Qh = heat / (v.rho * v.cp / 60000 * v.dT), Qn = v.nz * area(v.dz / 1000) * v.vj * 60000, Q = Math.max(Qh, Qn); if (Q <= 0) return invalid('Enter a cutting power or nozzles.');
      const tank = Q * v.turn, Pp = v.rho * 9.80665 * (Q / 60000) * v.head / (v.eta / 100) / 1000, dTact = heat / (v.rho * v.cp / 60000 * Q);
      return output({ heat, Qh, Qn, Q, tank, Pp, dTact }, 'Design coolant flow (L/min)', Q,
        [m('Heat into the coolant', q(heat, 'kW', 2)), m('Flow for heat', q(Qh, 'L/min', 1)), m('Flow for the nozzles', q(Qn, 'L/min', 1)), m('Design flow', `${q(Q, 'L/min', 1)} (${Qh >= Qn ? 'heat' : 'nozzles'} governs)`), m('Temperature rise at design flow', q(dTact, 'K', 2)), m('Tank volume', q(tank, 'L', 0)), m('Pump shaft power', q(Pp, 'kW', 2))],
        'Coolant system sizing.', 'Steady heat load.', {
          checks: [check('Chip handling', 'verify', 'Allow for filtration and chip settling in the tank layout.')],
        });
    },
    "rotary-index-table-sizing": (v) => {
      if (v.tc <= v.ti) return invalid('The cycle time must be longer than the index time.');
      const J = 0.5 * v.M * (v.R / 1000) ** 2 + v.st * v.mf * (v.rf / 1000) ** 2, th = 2 * PI / v.st, wmax = v.law === 'cyc' ? 2 * th / v.ti : 1.5 * th / v.ti, al = v.law === 'cyc' ? 2 * PI * th / v.ti ** 2 : 4.5 * th / v.ti ** 2;
      const Ttab = J * al + v.Tf, Tmot = Ttab / (v.i * v.eta / 100) + v.Jm * al * v.i, nmot = wmax * v.i * 60 / (2 * PI), hold = v.SF * v.Fm * v.rf / 1000, ratio = J / (v.i * v.i) / Math.max(v.Jm, 1e-12);
      return output({ J, th: deg(th), wmax, al, Ttab, Tmot, nmot, dwell: v.tc - v.ti, hold, ratio }, 'Peak motor torque (N·m)', Tmot,
        [m('Table inertia', q(J, 'kg·m²', 3)), m('Index angle', q(deg(th), '°', 2)), m('Peak table speed / acceleration', `${q(wmax * 60 / (2 * PI), 'rpm', 1)} / ${q(al, 'rad/s²', 1)}`), m('Peak table torque', q(Ttab, 'N·m', 1)), m('Peak motor torque', q(Tmot, 'N·m', 2)), m('Peak motor speed', q(nmot, 'rpm', 0)), m('Dwell time', q(v.tc - v.ti, 's', 2)), m('Holding torque needed', q(hold, 'N·m', 0)), m('Inertia ratio at the motor', `${q(ratio, '', 1)} : 1`)],
        'Index table drive sizing.', 'Rigid table, profile as chosen.', {
          checks: [check('Inertia ratio', ratio <= 10 ? 'pass' : 'warn', `${q(ratio, '', 1)}:1; servo makers usually want 10:1 or less for crisp settling.`), check('Holding', 'verify', `Use a clamp or brake rated for at least ${q(hold, 'N·m', 0)}; do not hold machining loads on the motor.`)],
        });
    },
    "rack-pinion-axis-sizing": (v) => {
      const g = 9.80665, al = rad(v.incl), a = v.vmax / v.ta, Frun = v.mass * g * (Math.sin(al) + v.mu * Math.cos(al)) + v.Fx, Facc = Frun + v.mass * a, d = v.m * v.z, erp = v.erp / 100;
      const Tp = Facc * d / 2000 / erp, Tprun = Frun * d / 2000 / erp, np = v.vmax * 60000 / (PI * d), nm = np * v.i, am = 2 * PI * nm / 60 / v.ta, Tmot = Tp / (v.i * v.eg / 100) + v.Jm * am, Tmrun = Tprun / (v.i * v.eg / 100);
      const V = PI * d * np / 60000, Kv = { cast: (3.05 + V) / 3.05, cut: (6.1 + V) / 6.1, hobbed: (3.56 + Math.sqrt(V)) / 3.56, ground: Math.sqrt((5.56 + Math.sqrt(V)) / 5.56) }[v.make], sigma = Kv * Facc / (v.b * v.m * v.Y), ok = sigma <= v.allow;
      return output({ Frun, Facc, d, Tp, np, nm, Tmot, Tmrun, Kv, sigma }, 'Peak motor torque (N·m)', Tmot,
        [m('Running / accelerating force', `${q(Frun, '', 0)} / ${q(Facc, 'N', 0)}`), m('Pinion pitch diameter', q(d, 'mm', 1)), m('Peak pinion torque', q(Tp, 'N·m', 1)), m('Pinion / motor speed', `${q(np, '', 0)} / ${q(nm, 'rpm', 0)}`), m('Peak / running motor torque', `${q(Tmot, '', 2)} / ${q(Tmrun, 'N·m', 2)}`), m('Tooth bending stress', q(sigma, 'MPa', 1))],
        'Rack and pinion axis sizing.', 'Rigid axis, constant acceleration.', {
          text: ok ? 'TEETH ADEQUATE' : 'TEETH OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Tooth bending', ok ? 'pass' : 'fail', `${q(sigma, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Vertical axis', v.incl < 45 ? 'pass' : 'verify', v.incl < 45 ? 'Gravity is a small part of the load.' : 'Fit a brake and consider a counterbalance; check the holding torque with power off.')],
        });
    },
    "hoist-drive-sizing": (v) => {
      const W = v.mass * 9.80665, e = v.es / 100, F = e === 1 ? W / v.n : W * (1 - e) / (1 - e ** v.n), sf = v.mbl * 1000 / F, Dd = v.D / v.d;
      const vr = v.v * v.n, nd = vr / (PI * v.D / 1000), Td = F * v.D / 2000, ns = { 2: 3000, 4: 1500, 6: 1000, 8: 750 }[v.poles], nm = ns * (1 - v.slip / 100), i = nm / nd;
      const P = F * vr / 60 / (v.eg / 100) / 1000, series = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315], Prated = series.find((x) => x >= P);
      if (!Prated) return invalid('The power is beyond the motor range listed.');
      const Tb = v.bf * Td / i, ok = sf >= v.req && Dd >= v.Dd;
      return output({ F, sf, Dd, vr, nd, Td, i, P, Prated, Tb }, 'Motor rating (kW)', Prated,
        [m('Line pull at the drum', q(F / 1000, 'kN', 2)), m('Rope safety factor', q(sf, '', 2)), m('Drum D/d', q(Dd, '', 1)), m('Rope speed / drum speed', `${q(vr, 'm/min', 1)} / ${q(nd, 'rpm', 2)}`), m('Drum torque', q(Td, 'N·m', 0)), m('Gear ratio', q(i, ':1', 1)), m('Motor power / rating', `${q(P, 'kW', 2)} / ${q(Prated, 'kW', 2)}`), m('Brake torque at the motor', q(Tb, 'N·m', 1))],
        'Hoist drive sizing.', 'Steady hoisting.', {
          text: ok ? 'ROPE AND DRUM ADEQUATE' : 'ROPE OR DRUM INADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Rope safety factor', sf >= v.req ? 'pass' : 'fail', `${q(sf, '', 2)} against ${q(v.req, '', 1)}.`), check('Drum D/d', Dd >= v.Dd ? 'pass' : 'fail', `${q(Dd, '', 1)} against ${q(v.Dd, '', 0)}.`), check('Certification', 'verify', 'Design and certify to the applicable crane and hoist standard.')],
        });
    },
    "furnace-heat-treat-plan": (v) => {
      if (v.T1 <= v.T0) return invalid('The set temperature must be above the start temperature.');
      const Q = (v.mass + v.fix) * v.cp * (v.T1 - v.T0) / 3600, hours = Q / (v.P * v.eff / 100), E = Q / (v.eff / 100) + v.loss * v.soak, cost = E * v.price, costKg = cost / v.mass;
      return output({ Q, hours, E, cost, costKg, cycle: hours + v.soak }, 'Heat-up time (h)', hours,
        [m('Heat into the load', q(Q, 'kWh', 1)), m('Heat-up time', q(hours, 'h', 2)), m('Cycle time (heat-up + soak)', q(hours + v.soak, 'h', 2)), m('Energy per load', q(E, 'kWh', 1)), m('Cost per load', money(cost)), m('Cost per kg of work', money(costKg)), m('Fixture share of the heat', q(v.fix / (v.mass + v.fix) * 100, '%', 0))],
        'Furnace load energy plan.', 'Mean specific heat and fixed efficiency.');
    },
    "crank-press-capacity": (v) => {
      const r = v.S / 2; if (v.L <= r) return invalid('The connecting rod must be longer than the crank radius.');
      if (v.hw > v.S || v.hr > v.S) return invalid('Heights must lie within the stroke.');
      const h = (t) => r * (1 - Math.cos(t)) + v.L - Math.sqrt(v.L * v.L - (r * Math.sin(t)) ** 2), dh = (t) => r * Math.sin(t) * (1 + r * Math.cos(t) / Math.sqrt(v.L * v.L - (r * Math.sin(t)) ** 2));
      const ang = (hh) => { let lo = 0, hi = PI; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (h(mid) < hh) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const tr = ang(v.hr), tw = ang(v.hw), T = v.Fr * dh(tr), Favail = Math.min(v.Fr, T / dh(tw)), E = v.Fw * v.dw / 1000, okF = Favail >= v.Fw, okE = v.Ef <= 0 || E <= v.Ef, ok = okF && okE;
      return output({ tr: deg(tr), tw: deg(tw), T: T / 1000, Favail, E }, 'Force available at the working height (kN)', Favail,
        [m('Crank angle at the rating point', q(deg(tr), '°', 2)), m('Crank angle at the working height', q(deg(tw), '°', 2)), m('Rated crankshaft torque', q(T / 1000, 'kN·m', 2)), m('Force available at the working height', q(Favail, 'kN', 0)), m('Force needed', q(v.Fw, 'kN', 0)), m('Working energy', q(E, 'kJ', 2)), m('Flywheel energy available', v.Ef > 0 ? q(v.Ef, 'kJ', 1) : 'Not entered')],
        'Crank press capacity at height.', 'Slider-crank geometry.', {
          text: ok ? 'PRESS CAN DO THE WORK' : 'PRESS UNDERSIZED AT THIS HEIGHT', tone: ok ? 'good' : 'bad',
          checks: [check('Force at height', okF ? 'pass' : 'fail', `${q(Favail, 'kN', 0)} available against ${q(v.Fw, 'kN', 0)} needed.`), check('Energy', okE ? 'pass' : 'fail', v.Ef > 0 ? `${q(E, 'kJ', 1)} needed against ${q(v.Ef, 'kJ', 1)} available.` : 'Check flywheel energy with the press maker.')],
        });
    },
    "pipe-expansion-loop": (v) => {
      if (v.wt * 2 >= v.OD) return invalid('The wall is too thick for this diameter.');
      const growth = v.alpha * 1e-6 * v.L * 1000 * v.dT, sig = v.E * 1000 * v.alpha * 1e-6 * v.dT, A = PI / 4 * (v.OD ** 2 - (v.OD - 2 * v.wt) ** 2), Fa = sig * A, delta = v.type === 'L' ? growth : growth / 2, leg = Math.sqrt(3 * v.E * 1000 * v.OD * delta / v.Sa);
      return output({ growth, sig, A, Fa, delta, leg }, 'Loop leg length (mm)', leg,
        [m('Thermal growth of the run', q(growth, 'mm', 1)), m('Stress if fully restrained', q(sig, 'MPa', 0)), m('Anchor force if fully restrained', q(Fa / 1000, 'kN', 0)), m('Displacement each leg absorbs', q(delta, 'mm', 1)), m('Leg length needed', `${q(leg, 'mm', 0)} (${q(leg / v.OD, '', 1)} × OD)`)],
        'Pipe expansion and loop sizing.', 'Guided-cantilever estimate.', {
          checks: [check('Restraint', sig > v.Sa ? 'warn' : 'pass', sig > v.Sa ? 'Full restraint would overstress the pipe: a loop, bend or bellows is needed.' : 'Restrained stress within the range, but anchor loads may still be high.'), check('Piping code', 'verify', 'Confirm with a flexibility analysis to the applicable piping code.')],
        });
    },
    "gear-backlash-temperature": (v) => {
      const a = v.m * (v.z1 + v.z2) / 2, da_h = a * v.ah * 1e-6 * v.dTh, da_g = a * v.ag * 1e-6 * v.dTg, da = da_h - da_g, dj = 2 * da * Math.tan(rad(v.phi)), jHot = v.j0 + dj, ok = jHot > 0;
      return output({ a, da_h, da_g, da, dj, jHot }, 'Hot backlash (mm)', jHot,
        [m('Centre distance', q(a, 'mm', 2)), m('Housing bore separation growth', q(da_h * 1000, 'µm', 1)), m('Gear pitch radius growth (both)', q(da_g * 1000, 'µm', 1)), m('Net centre distance change', q(da * 1000, 'µm', 1)), m('Backlash change', q(dj * 1000, 'µm', 1)), m('Hot backlash', q(jHot, 'mm', 4))],
        'Backlash at temperature.', 'Uniform temperatures.', {
          text: ok ? 'BACKLASH REMAINS' : 'GEARS MAY JAM', tone: ok ? 'good' : 'bad',
          checks: [check('Running backlash', ok ? 'pass' : 'fail', ok ? `${q(jHot, 'mm', 3)} of backlash when warm.` : 'Backlash disappears when warm: increase cold backlash or match materials.')],
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
