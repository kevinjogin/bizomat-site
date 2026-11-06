// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook64). SI units are explicit at each boundary.
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
    "hinged-flap-cylinder-check": (v) => {
      if (v.rod >= v.bore) return invalid('The rod must be smaller than the bore.');
      const W = v.mass * 9.80665, nPts = 181; let Fmax = 0, thAt = 0, Lmin = Infinity, Lmax = 0;
      for (let i = 0; i < nPts; i++) {
        const t = rad(v.thMax * i / (nPts - 1)), px = v.rc * Math.cos(t), py = v.rc * Math.sin(t), dx = px - v.bx, dy = py - v.by, L = Math.hypot(dx, dy), arm = (px * dy - py * dx) / L;
        if (arm <= 1e-6) return invalid('The cylinder line passes through or behind the hinge during the swing: move the base pivot.');
        const F = W * v.rg * Math.cos(t) / arm; if (F > Fmax) { Fmax = F; thAt = deg(t); } Lmin = Math.min(Lmin, L); Lmax = Math.max(Lmax, L);
      }
      const p = v.p / 10, Aext = PI * v.bore ** 2 / 4, Fe = p * Aext * v.eff / 100, lr = 100 * Fmax / (p * Aext), minBore = Math.sqrt(4 * Fmax / (PI * p * v.ratio / 100)), stroke = Lmax - Lmin;
      const okR = lr <= v.ratio + 1e-9, okS = stroke <= v.strokeAv + 1e-9, ok = okR && okS;
      return output({ W, Fmax, thAt, Lmin, Lmax, stroke, Fe, lr, minBore }, 'Largest cylinder force (N)', Fmax,
        [m('Flap weight', q(W, 'N', 0)), m('Largest force needed / at angle', `${q(Fmax, 'N', 0)} / ${q(thAt, '°', 1)}`), m('Cylinder length: closed / open', `${q(Lmin, '', 1)} / ${q(Lmax, 'mm', 1)}`), m('Stroke needed', q(stroke, 'mm', 1)), m('Extend force / load ratio', `${q(Fe, 'N', 0)} / ${q(lr, '%', 1)}`), m('Smallest bore for the ratio', q(minBore, 'mm', 1))],
        'Hinged flap cylinder check.', 'Slow lift; static moments.', {
          text: ok ? 'CYLINDER ADEQUATE' : okR ? 'STROKE TOO SHORT' : 'CYLINDER TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Load ratio', okR ? 'pass' : 'fail', `${q(lr, '%', 1)} against ${q(v.ratio, '%', 0)}${okR ? '.' : `: use at least a ${q(minBore, 'mm', 0)} mm bore.`}`), check('Stroke', okS ? 'pass' : 'fail', `${q(stroke, 'mm', 1)} needed against ${q(v.strokeAv, 'mm', 0)}.`), check('End of swing', 'verify', 'Check the flap is held open past centre or by the cylinder when the air is off.')],
        });
    },
    "tank-stand-leg-check": (v) => {
      if (2 * v.legT >= v.legOD) return invalid('The leg wall must be less than half its diameter.');
      const r = v.D / 2, litres = PI * r * r * v.Ht / 1e6, mass = v.mEmpty + litres / 1000 * v.rhoF, W = mass * 9.80665, Pleg = W / v.n, di = v.legOD - 2 * v.legT, A = PI * (v.legOD ** 2 - di ** 2) / 4, I = PI * (v.legOD ** 4 - di ** 4) / 64;
      const E = v.E * 1000, rg = Math.sqrt(I / A), lambda = v.K * v.L / rg, Cc = PI * Math.sqrt(2 * E / v.Sy), euler = lambda >= Cc, scr = euler ? PI * PI * E / (lambda * lambda) : v.Sy - (v.Sy * lambda / (2 * PI)) ** 2 / E, Pcr = scr * A, nsf = Pcr / Pleg, ok = nsf >= v.req - 1e-9;
      return output({ litres, mass, W, Pleg, A, I, r: rg, lambda, Cc, scr, Pcr, n: nsf }, 'Safety factor against buckling', nsf,
        [m('Full volume / mass', `${q(litres, 'L', 0)} / ${q(mass, 'kg', 0)}`), m('Load per leg', q(Pleg, 'N', 0)), m('Leg area / I / r', `${q(A, 'mm²', 1)} / ${q(I, 'mm⁴', 0)} / ${q(rg, 'mm', 2)}`), m('Slenderness / C_c', `${q(lambda, '', 1)} / ${q(Cc, '', 1)} (${euler ? 'Euler' : 'Johnson'})`), m('Buckling load', q(Pcr, 'N', 0)), m('Safety factor', q(nsf, '', 2))],
        'Tank stand leg check.', 'Concentric load shared equally.', {
          text: ok ? 'LEGS ADEQUATE' : 'LEGS MAY BUCKLE', tone: ok ? 'good' : 'bad',
          checks: [check('Buckling', ok ? 'pass' : 'fail', `${q(nsf, '', 2)} against ${q(v.req, '', 1)}.`), check('Lateral loads', 'verify', 'Check wind and seismic loads and brace the legs if the tank is tall or outdoors.')],
        });
    },
    "nozzle-manifold-check": (v) => {
      const A = PI * (v.d / 1000) ** 2 / 4, Q1 = v.Cd * A * Math.sqrt(2 * v.pN * 1e5 / v.rho) * 60000, vN = Q1 / 60000 / (v.Cd * A), Qt = Q1 * v.nN;
      const dm = v.dp / 1000, Ap = PI * dm * dm / 4, vel = Qt / 60000 / Ap, Re = vel * dm / (v.nu * 1e-6); let f;
      if (Re < 2300) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * dm) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const dpPipe = (f * v.L / dm + v.K) * v.rho * vel * vel / 2 / 1e5, pSupply = v.pN + dpPipe, okP = pSupply <= v.pPump + 1e-9, okV = vel <= v.vMax + 1e-9, ok = okP && okV;
      return output({ Q1, vN, Qt, vel, Re, f, dpPipe, pSupply }, 'Supply pressure needed (bar)', pSupply,
        [m('Flow per nozzle / jet velocity', `${q(Q1, 'L/min', 2)} / ${q(vN, 'm/s', 1)}`), m('Total flow', q(Qt, 'L/min', 1)), m('Pipe velocity / Reynolds number', `${q(vel, 'm/s', 2)} / ${q(Re, '', 0)}`), m('Friction factor', q(f, '', 4)), m('Pipe pressure drop', q(dpPipe, 'bar', 3)), m('Supply pressure needed', q(pSupply, 'bar', 3))],
        'Nozzle manifold check.', 'Full flow over the whole pipe length.', {
          text: ok ? 'SUPPLY ADEQUATE' : okP ? 'PIPE VELOCITY TOO HIGH' : 'PUMP PRESSURE SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Supply pressure', okP ? 'pass' : 'fail', `${q(pSupply, 'bar', 2)} needed against ${q(v.pPump, 'bar', 2)}.`), check('Pipe velocity', okV ? 'pass' : 'fail', `${q(vel, 'm/s', 2)} against ${q(v.vMax, 'm/s', 1)}${okV ? '.' : ': use a larger feed pipe.'}`), check('Pump curve', 'verify', 'Read the pump pressure at the total flow from its curve.')],
        });
    },
    "drilling-fixture-clamp-check": (v) => {
      const n = 1000 * v.vc / (PI * v.D), Pc = v.fr * v.vc * v.D * v.kc / 240000, Pm = Pc / (v.eta / 100), T = Pc * 30000 / (PI * n), thrust = 0.5 * v.kc * v.D / 2 * v.fr * Math.sin(rad(v.point / 2));
      if (v.D / 2 >= v.rf) return invalid('The friction radius must be larger than the drill radius.');
      const Fcut = T * 1000 / v.rf, Fcl = v.n * Fcut / (v.mu1 + v.mu2), per = Fcl / v.nc, Fs = per * (v.A + v.B) / v.B, Tq = v.K * Fs * v.d / 1000, At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, s = Fs / At;
      const okP = Pm <= v.Pavail + 1e-9, okS = s <= 0.75 * v.Sp + 1e-9, ok = okP && okS;
      return output({ n, Pc, Pm, T, thrust, Fcut, Fcl, per, Fs, Tq, At, s }, 'Total clamping force (N)', Fcl,
        [m('Spindle speed / motor power', `${q(n, 'rpm', 0)} / ${q(Pm, 'kW', 2)}`), m('Drill torque / thrust', `${q(T, 'N·m', 2)} / ${q(thrust, 'N', 0)}`), m('Tangential force at the friction radius', q(Fcut, 'N', 0)), m('Clamping force: total / per clamp', `${q(Fcl, '', 0)} / ${q(per, 'N', 0)}`), m('Screw force / torque', `${q(Fs, 'N', 0)} / ${q(Tq, 'N·m', 1)}`), m('Screw stress', q(s, 'MPa', 0))],
        'Drilling fixture clamp check.', 'Friction holding; steady drilling.', {
          text: ok ? 'CLAMPING ADEQUATE' : okP ? 'CLAMP SCREW OVERSTRESSED' : 'MACHINE POWER SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Machine power', okP ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pavail, 'kW', 1)}.`), check('Clamp screw', okS ? 'pass' : 'fail', `${q(s, 'MPa', 0)} against ${q(0.75 * v.Sp, 'MPa', 0)} (75% of proof).`), check('Rotation stop', 'verify', 'Fit a pin or stop against rotation for large drills or when friction is uncertain.')],
        });
    },
    "conveyor-takeup-plan": (v) => {
      const g = 9.80665, qL = v.Q / (3.6 * v.v), Te = v.f * g * v.L * (qL + v.qm) + qL * g * v.Hl; if (Te <= 0) return invalid('The conveyor runs downhill on its own: the drive must brake, not drive.');
      const Pp = Te * v.v / 1000, Pm = Pp / (v.eta / 100) * (1 + v.marg / 100), e = Math.exp(v.mu * rad(v.wrap)), T2 = Te / (e - 1), T1 = T2 + Te;
      const Tsag = (qL + v.qb) * g * v.a / (8 * v.sag / 100), Tt = Math.max(T2, Tsag), mCw = 2 * Tt / g, travel = 2 * v.L * 1000 * v.elong / 100 + v.splice, ok = travel <= v.travelAv + 1e-9;
      return output({ qL, Te, Pmotor: Pm, T1, T2, Tsag, Tt, mCw, travel }, 'Counterweight (kg)', mCw,
        [m('Effective pull / slack side tension for no slip', `${q(Te, '', 0)} / ${q(T2, 'N', 0)}`), m('Tension for the sag limit', q(Tsag, 'N', 0)), m('Take-up tension', `${q(Tt, 'N', 0)} (${Tsag > T2 ? 'sag governs' : 'slip governs'})`), m('Counterweight', q(mCw, 'kg', 0)), m('Take-up travel needed', q(travel, 'mm', 0))],
        'Conveyor gravity take-up plan.', 'Take-up near the drive; loaded carrying side.', {
          text: ok ? 'TAKE-UP ADEQUATE' : 'TRAVEL TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Travel', ok ? 'pass' : 'fail', `${q(travel, 'mm', 0)} needed against ${q(v.travelAv, 'mm', 0)}.`), check('Belt rating', 'verify', `Check the belt rating against the tight side tension of ${q(T1 + Tt - T2, 'N', 0)}.`)],
        });
    },
    "forklift-load-centre-check": (v) => {
      let M = 0, X = 0, Y = 0;
      for (let i = 1; i <= 3; i++) { const mi = v['m' + i]; if (!mi) continue; M += mi; X += mi * v['x' + i]; Y += mi * v['y' + i]; }
      if (M <= 0) return invalid('Enter at least one item mass.');
      X /= M; Y /= M;
      const cap = v.Q * (v.Ax + v.c0) / (v.Ax + X), use = M / cap * 100, okC = M <= cap + 1e-9, okY = Math.abs(Y) <= v.yMax + 1e-9;
      return output({ M, X, Y, cap, use }, 'Capacity at the load centre (kg)', cap,
        [m('Load mass', q(M, 'kg', 1)), m('Load centre from the fork face', q(X, 'mm', 1)), m('Sideways offset', q(Y, 'mm', 1)), m('Capacity at that load centre', q(cap, 'kg', 0)), m('Use of capacity', q(use, '%', 0))],
        'Forklift load centre check.', 'Moment balance about the front axle.', {
          text: !okC ? 'OVER CAPACITY' : okY ? 'WITHIN CAPACITY' : 'LOAD OFF CENTRE', tone: okC && okY ? 'good' : 'bad',
          checks: [check('Capacity', okC ? 'pass' : 'fail', `${q(M, 'kg', 0)} against ${q(cap, 'kg', 0)} at ${q(X, 'mm', 0)}.`), check('Sideways offset', okY ? 'pass' : 'fail', `${q(Y, 'mm', 0)} against ±${q(v.yMax, 'mm', 0)}.`), check('Capacity plate', 'verify', 'Use the truck’s capacity plate for the lift height and any attachment.')],
        });
    },
    "cylinder-air-consumption-check": (v) => {
      if (v.rod >= v.bore) return invalid('The rod must be smaller than the bore.');
      const swept = (PI * v.bore ** 2 / 4 + PI * (v.bore ** 2 - v.rod ** 2) / 4) * v.stroke * (1 + v.dead / 100) / 1e6, freeCycle = swept * (v.p + ATM) / ATM, Q = freeCycle * v.cpm * v.nCyl * (1 + v.leak / 100) / 1000;
      const P1 = ATM * 1e5, P2 = (v.p + ATM) * 1e5, Qs = Q / 60, r = P2 / P1, ad = v.stages * 1.4 / 0.4 * P1 * Qs * (Math.pow(r, 0.4 / (v.stages * 1.4)) - 1) / 1000, shaft = ad / (v.eff / 100), use = Q / v.fad * 100, ok = Q <= v.fad + 1e-12;
      return output({ swept, freeCycle, Q, ad, shaft, use }, 'Air demand (m³/min at atmospheric pressure)', Q,
        [m('Swept volume per cycle', q(swept, 'L', 3)), m('Atmospheric air per cycle', q(freeCycle, 'L', 3)), m('Total demand', `${q(Q * 1000, 'L/min', 1)} (${q(Q, 'm³/min', 3)})`), m('Use of compressor capacity', q(use, '%', 0)), m('Adiabatic / shaft power', `${q(ad, '', 2)} / ${q(shaft, 'kW', 2)}`)],
        'Cylinder air consumption check.', 'Full pressure every stroke; average demand.', {
          text: ok ? 'SUPPLY ADEQUATE' : 'SUPPLY SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Compressor capacity', ok ? 'pass' : 'fail', `${q(Q, 'm³/min', 3)} against ${q(v.fad, 'm³/min', 2)}.`), check('Peak demand', 'verify', 'Check the receiver covers cylinders that move together.')],
        });
    },
    "winch-drum-brake-check": (v) => {
      if (v.treq <= v.td) return invalid('The required stop time must exceed the engagement delay.');
      const Fn = v.F * 1000, Tdrum = Fn * v.D / 2000, TL = Tdrum / v.i * v.effG / 100, vr = PI * v.D / 1000 * v.nM / (60 * v.i), J = v.Jm + Fn / 9.80665 * (v.D / 2000 / v.i) ** 2;
      const w = 2 * PI * v.nM / 60, Tnet = v.Tb - TL;
      if (Tnet <= 0) return invalid('The brake torque does not exceed the overhauling load torque: it cannot stop the load.');
      const tb = J * w / Tnet, ttot = v.td + tb, ang = w * v.td + w * tb / 2, W = v.Tb * w * tb / 2, Whr = W * v.z / 1000, Treq = J * w / (v.treq - v.td) + TL, hold = TL > 0 ? v.Tb / TL : 1e9, drop = ang * v.D / 2 / v.i;
      const okT = ttot <= v.treq + 1e-12, okH = hold >= v.SFh - 1e-12, okW = W / 1000 <= v.Wmax + 1e-12, okWh = Whr <= v.Wh + 1e-9, ok = okT && okH && okW && okWh;
      return output({ Tdrum, TL, vr, J, w, Tnet, tb, ttot, ang, W, Whr, Treq, hold, drop }, 'Total stop time (s)', ttot,
        [m('Drum torque / load torque at the brake', `${q(Tdrum, '', 0)} / ${q(TL, 'N·m', 2)}`), m('Rope speed', q(vr, 'm/s', 3)), m('Inertia at the brake', q(J, 'kg·m²', 4)), m('Stop time / drop', `${q(ttot, 's', 3)} / ${q(drop, 'mm', 1)}`), m('Holding factor', q(hold, '', 2)), m('Energy per stop / per hour', `${q(W / 1000, 'kJ', 3)} / ${q(Whr, 'kJ', 1)}`), m('Brake torque for the stop time', q(Treq, 'N·m', 1))],
        'Winch drum brake check.', 'Load overhauling during the stop; rigid rope.', {
          text: ok ? 'BRAKE ADEQUATE' : 'BRAKE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Stop time', okT ? 'pass' : 'fail', `${q(ttot, 's', 3)} against ${q(v.treq, 's', 2)}.`), check('Holding', okH ? 'pass' : 'fail', `${q(hold, '', 2)} × the load torque against ${q(v.SFh, '', 1)}.`), check('Energy per stop', okW ? 'pass' : 'fail', `${q(W / 1000, 'kJ', 3)} against ${q(v.Wmax, 'kJ', 1)}.`), check('Energy per hour', okWh ? 'pass' : 'fail', `${q(Whr, 'kJ', 1)} against ${q(v.Wh, 'kJ', 0)}.`)],
        });
    },
    "tank-drain-time-check": (v) => {
      if (v.H2 >= v.H1) return invalid('The final level must be below the starting level.');
      if (v.d >= v.D) return invalid('The outlet must be smaller than the tank.');
      const g = 9.80665, At = PI * (v.D / 1000) ** 2 / 4, Ao = PI * (v.d / 1000) ** 2 / 4, vol = At * (v.H1 - v.H2) / 1000 * 1000, dp = v.rho * g * v.H1 / 1000 / 1e5, Q0 = v.Cd * Ao * Math.sqrt(2 * dp * 1e5 / v.rho) * 60000;
      const t = At / (v.Cd * Ao) * Math.sqrt(2 / g) * (Math.sqrt(v.H1 / 1000) - Math.sqrt(v.H2 / 1000)), tMin = t / 60, dNeed = v.d * Math.sqrt(tMin / v.tMax), ok = tMin <= v.tMax + 1e-9;
      return output({ vol, dp, Q0, t, tMin, dNeed }, 'Drain time (min)', tMin,
        [m('Volume drained', q(vol, 'L', 0)), m('Head at the start as pressure', q(dp, 'bar', 4)), m('Outflow at the start', q(Q0, 'L/min', 1)), m('Drain time', `${q(tMin, 'min', 1)} (${q(t, 's', 0)})`), m('Outlet for the time allowed', q(dNeed, 'mm', 1))],
        'Tank drain time check.', 'Unrestricted outflow; open tank.', {
          text: ok ? 'DRAINS IN TIME' : 'DRAINS TOO SLOWLY', tone: ok ? 'good' : 'bad',
          checks: [check('Drain time', ok ? 'pass' : 'fail', `${q(tMin, 'min', 1)} against ${q(v.tMax, 'min', 0)}${ok ? '.' : `: use an outlet of at least ${q(dNeed, 'mm', 0)} mm.`}`), check('Vent', 'verify', 'Make sure the tank is vented, or the falling level will draw a vacuum and slow the drain.')],
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
