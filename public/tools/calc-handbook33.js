// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook33). SI units are explicit at each boundary.
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
    "spline-joint-design": (v) => {
      const D = v.m * v.Nt, Dre = v.m * (v.Nt - 1.35), t = PI * v.m / 2, h = v.m, Tn = v.T * 1000;
      if (v.Dh >= Dre) return invalid('The bore must be smaller than the minor diameter.');
      const sRoot = v.Dh > 0 ? 16 * Tn * Dre * v.Ka / (PI * (Dre ** 4 - v.Dh ** 4) * v.Kf) : 16 * Tn * v.Ka / (PI * Dre ** 3 * v.Kf);
      const kAcc = v.acc === 'good' ? 4 : 6, cDen = v.kind === 'flexible' ? D * v.Nt * h * v.Kw : 9 * D * v.Nt * h * v.Kf;
      const Ls = kAcc * Tn * v.Ka * v.Km / (D * v.Nt * t * v.Kf * v.Ss), Lc = 2 * Tn * v.Km * v.Ka / (cDen * v.Sc), Lreq = Math.max(Ls, Lc);
      const sPitch = kAcc * Tn * v.Ka * v.Km / (D * v.Nt * v.Le * t * v.Kf), sComp = 2 * Tn * v.Km * v.Ka / (cDen * v.Le);
      const okR = sRoot <= v.Ss, okL = v.Le >= Lreq, ok = okR && okL;
      return output({ D, Dre, t, h, sRoot, Ls, Lc, Lreq, sPitch, sComp }, 'Engagement length needed (mm)', Lreq,
        [m('Pitch / minor diameter', `${q(D, '', 2)} / ${q(Dre, 'mm', 2)}`), m('Tooth thickness / working depth', `${q(t, '', 3)} / ${q(h, 'mm', 3)}`), m('Root shear stress', q(sRoot, 'MPa', 1)), m('Length for tooth shear', q(Ls, 'mm', 1)), m('Length for compression', q(Lc, 'mm', 1)), m('Tooth shear at the length chosen', q(sPitch, 'MPa', 1)), m('Compressive stress at the length chosen', q(sComp, 'MPa', 2))],
        'Spline joint design.', 'Simplified spline rating method.', {
          text: ok ? 'SPLINE ADEQUATE' : 'SPLINE INADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Root shear', okR ? 'pass' : 'fail', okR ? `${q(sRoot, 'MPa', 1)} within ${q(v.Ss, 'MPa', 0)}.` : 'The shaft is overstressed at the minor diameter whatever the length: use a larger module or more teeth.'), check('Engagement length', okL ? 'pass' : 'fail', `${q(v.Le, 'mm', 1)} chosen against ${q(Lreq, 'mm', 1)} needed.`), check('Practical length', v.Le <= D ? 'pass' : 'warn', v.Le <= D ? 'Length within one pitch diameter.' : 'Longer than the pitch diameter: misalignment limits the gain, so raise K_m or a larger spline.')],
        });
    },
    "ballscrew-axis-stiffness": (v) => {
      if (v.dr >= v.d0) return invalid('The root diameter must be smaller than the nominal diameter.');
      const A = PI * v.dr * v.dr / 4, AE = A * v.E * 1000, ks = (v.ends === 'both' ? 4 : 1) * AE / v.L / 1000, k = 1 / (1 / ks + 1 / v.kn + 1 / v.kb), delta = v.F / k;
      const FpMin = v.F / 2.83, tanB = v.l / (PI * v.d0), K = 0.05 / Math.sqrt(tanB), Tp = K * v.Fp * v.l / (2 * PI) / 1000, share = v.Fp / (v.Ca * 1000) * 100, fn = Math.sqrt(k * 1e6 / v.mt) / (2 * PI);
      const okD = delta <= v.dAllow, okF = fn >= v.fReq, okP = v.Fp >= FpMin, okS = share <= v.pMax, ok = okD && okF;
      return output({ ks, k, delta, FpMin, K, Tp, share, fn }, 'Axis stiffness (N/µm)', k,
        [m('Screw stiffness', q(ks, 'N/µm', 0)), m('Axis stiffness (series)', q(k, 'N/µm', 0)), m('Deflection at the largest load', q(delta, 'µm', 1)), m('Least preload so the nut stays loaded', q(FpMin, 'N', 0)), m('Preload share of the dynamic rating', q(share, '%', 1)), m('Preload drag torque', q(Tp, 'N·m', 3)), m('Axial natural frequency', q(fn, 'Hz', 0))],
        'Ball-screw axis stiffness.', 'Static axial stiffness in series.', {
          text: ok ? 'AXIS STIFF ENOUGH' : 'AXIS TOO COMPLIANT', tone: ok ? 'good' : 'bad',
          checks: [check('Deflection', okD ? 'pass' : 'fail', `${q(delta, 'µm', 1)} against ${q(v.dAllow, 'µm', 0)}.`), check('Axial frequency', okF ? 'pass' : 'fail', `${q(fn, 'Hz', 0)} against ${q(v.fReq, 'Hz', 0)}.`), check('Preload holds', okP ? 'pass' : 'warn', okP ? 'The nut stays preloaded at the largest load.' : `Below ${q(FpMin, 'N', 0)}: the nut unloads and lost motion appears.`), check('Preload level', okS ? 'pass' : 'warn', okS ? 'Preload within your limit.' : 'Heavy preload shortens life and adds heat.')],
        });
    },
    "tank-heater-sizing": (v) => {
      if (v.Ts <= v.T0) return invalid('The set temperature must be above the starting temperature.');
      const mass = v.V / 1000 * v.rho, Q = (mass * v.c + v.mv * v.cv) * (v.Ts - v.T0), Lh = v.U * v.A * Math.max((v.T0 + v.Ts) / 2 - v.Tamb, 0), Lhold = v.U * v.A * Math.max(v.Ts - v.Tamb, 0);
      const P = (Q / (v.th * 3600) + Lh / 1000) * (1 + v.marg / 100), net = v.Pinst * 1000 - Lh;
      if (v.Pinst * 1000 <= Lhold) return invalid('The installed heater cannot even cover the holding loss.');
      const tAct = Q * 1000 / net / 3600, duty = Lhold / (v.Pinst * 1000) * 100, wd = v.Pinst * 1000 / (v.n * v.Ae), okP = tAct <= v.th, okW = wd <= v.wdMax, ok = okP && okW;
      return output({ mass, Q, Lh, Lhold, P, tAct, duty, wd }, 'Heater power needed (kW)', P,
        [m('Heat-up energy', `${q(Q / 1000, 'MJ', 1)} (${q(Q / 3600, 'kWh', 1)})`), m('Average loss during heat-up', q(Lh, 'W', 0)), m('Holding loss at temperature', q(Lhold, 'W', 0)), m('Power needed with margin', q(P, 'kW', 2)), m('Heat-up time with the installed heater', q(tAct, 'h', 2)), m('Holding duty of the installed heater', q(duty, '%', 1)), m('Watt density', q(wd, 'W/cm²', 2))],
        'Tank heater sizing.', 'Uniform temperature; constant loss coefficient.', {
          text: ok ? 'HEATER ADEQUATE' : 'HEATER NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Heat-up time', okP ? 'pass' : 'fail', `${q(tAct, 'h', 2)} against ${q(v.th, 'h', 1)} wanted.`), check('Watt density', okW ? 'pass' : 'fail', okW ? `${q(wd, 'W/cm²', 2)} within ${q(v.wdMax, 'W/cm²', 1)}.` : 'Surface loading too high: add elements or use longer, lower-rated elements.'), check('Control', 'verify', 'Fit a thermostat and an independent over-temperature and low-level cut-out.')],
        });
    },
    "hydraulic-line-sizing": (v) => {
      if (v.do <= v.di) return invalid('The outside diameter must exceed the bore.');
      const dmin = Math.sqrt(4 * v.Q / 60000 / (PI * v.vmax)) * 1000, d = v.di / 1000, vel = v.Q / 60000 / (PI * d * d / 4), Re = vel * d / (v.nu * 1e-6), lam = Re < 2300;
      let f; if (lam) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const dp = (f * v.L / d + v.K) * v.rho * vel * vel / 2 / 1e5, Ploss = dp * 1e5 * v.Q / 60000, tw = (v.do - v.di) / 2, pb = 2 * v.Su * tw / v.do * 10, pw = pb / v.DF;
      const okV = vel <= v.vmax, okR = pw >= v.p, okD = dp <= v.dpMax, ok = okV && okR && okD;
      return output({ dmin, vel, Re, f, dp, Ploss, pb, pw }, 'Pressure drop (bar)', dp,
        [m('Least bore for the velocity limit', q(dmin, 'mm', 1)), m('Velocity', q(vel, 'm/s', 2)), m('Reynolds number / regime', `${q(Re, '', 0)} / ${lam ? 'laminar' : Re < 4000 ? 'transitional' : 'turbulent'}`), m('Friction factor', q(f, '', 4)), m('Pressure drop', q(dp, 'bar', 2)), m('Power lost as heat', q(Ploss, 'W', 0)), m('Burst pressure (Barlow)', q(pb, 'bar', 0)), m('Working pressure rating', q(pw, 'bar', 0))],
        'Hydraulic line sizing.', 'Fully developed flow; Barlow tube rating.', {
          text: ok ? 'LINE ADEQUATE' : 'LINE NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Velocity', okV ? 'pass' : 'fail', `${q(vel, 'm/s', 2)} against ${q(v.vmax, 'm/s', 1)}.`), check('Pressure rating', okR ? 'pass' : 'fail', `${q(pw, 'bar', 0)} rating against ${q(v.p, 'bar', 0)} working.`), check('Pressure drop', okD ? 'pass' : 'fail', `${q(dp, 'bar', 2)} against ${q(v.dpMax, 'bar', 1)}.`), check('Fittings and hose', 'verify', 'Confirm fittings and hoses are rated for the working pressure too.')],
        });
    },
    "holding-brake-sizing": (v) => {
      if (v.treq <= v.td) return invalid('The required stop time must exceed the engagement delay.');
      const w = 2 * PI * v.n / 60, sgn = v.dir === 'over' ? -1 : 1, Tnet = v.Tb + sgn * v.TL;
      if (Tnet <= 0) return invalid('The brake torque does not exceed the overhauling load torque: it cannot stop the load.');
      const tb = v.J * w / Tnet, ttot = v.td + tb, ang = w * v.td + w * tb / 2, W = v.Tb * w * tb / 2, Whr = W * v.z / 1000, Treq = v.J * w / (v.treq - v.td) - sgn * v.TL, hold = v.TL > 0 ? v.Tb / v.TL : Infinity;
      const okT = ttot <= v.treq, okH = hold >= v.SFh, okW = W / 1000 <= v.Wmax, okWh = Whr <= v.Wh, ok = okT && okH && okW && okWh;
      return output({ w, Tnet, tb, ttot, ang, W, Whr, Treq: Math.max(Treq, 0), KE: v.J * w * w / 2 }, 'Total stop time (s)', ttot,
        [m('Kinetic energy at the brake', q(v.J * w * w / 2 / 1000, 'kJ', 3)), m('Net decelerating torque', q(Tnet, 'N·m', 1)), m('Slip time / total stop time', `${q(tb, '', 3)} / ${q(ttot, 's', 3)}`), m('Stopping angle', `${q(ang / (2 * PI), 'rev', 2)}`), m('Energy per stop', q(W / 1000, 'kJ', 3)), m('Energy per hour', q(Whr, 'kJ', 1)), m('Brake torque for the required time', q(Math.max(Treq, 0), 'N·m', 1)), m('Holding factor', v.TL > 0 ? q(hold, '', 2) : 'No static load')],
        'Holding brake sizing.', 'Constant brake torque.', {
          text: ok ? 'BRAKE SUITABLE' : 'BRAKE NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Stop time', okT ? 'pass' : 'fail', `${q(ttot, 's', 3)} against ${q(v.treq, 's', 2)}.`), check('Holding', okH ? 'pass' : 'fail', v.TL > 0 ? `${q(hold, '', 2)} × the load torque against ${q(v.SFh, '', 1)} required.` : 'No static load to hold.'), check('Energy per stop', okW ? 'pass' : 'fail', `${q(W / 1000, 'kJ', 3)} against ${q(v.Wmax, 'kJ', 2)}.`), check('Energy per hour', okWh ? 'pass' : 'fail', `${q(Whr, 'kJ', 1)} against ${q(v.Wh, 'kJ', 0)}.`)],
        });
    },
    "weld-preheat-check": (v) => {
      if (v.tMax <= v.tMin) return invalid('The longest cooling time must exceed the shortest.');
      const CE = v.C + v.Mn / 6 + (v.Cr + v.Mo + v.V) / 5 + (v.Ni + v.Cu) / 15, Pcm = v.C + v.Si / 30 + (v.Mn + v.Cu + v.Cr) / 20 + v.Ni / 60 + v.Mo / 15 + v.V / 10 + 5 * v.B;
      const Cc = (360 * v.C + 40 * (v.Mn + v.Cr) + 20 * v.Ni + 28 * v.Mo) / 360, Ct = Cc * (1 + 0.005 * v.th), Tp = Ct > 0.25 ? 350 * Math.sqrt(Ct - 0.25) : 0;
      const E = v.U * v.I * 60 / (v.vt * 1000), Q = E * v.eta / 100, T0 = v.T0;
      const t3 = (6700 - 5 * T0) * Q * (1 / (500 - T0) - 1 / (800 - T0)) * v.F3, t2 = (4300 - 4.3 * T0) * 1e5 * Q * Q / (v.th * v.th) * (1 / (500 - T0) ** 2 - 1 / (800 - T0) ** 2) * v.F2, t85 = Math.max(t3, t2), mode = t3 >= t2 ? 'thick plate (3-D)' : 'thin plate (2-D)';
      const needPre = CE > v.CElim, okP = T0 >= Tp, okT = t85 >= v.tMin && t85 <= v.tMax, ok = okP && okT;
      return output({ CE, Pcm, Cc, Ct, Tp, E, Q, t3, t2, t85 }, 'Cooling time t8/5 (s)', t85,
        [m('Carbon equivalent CE (IIW) / Pcm', `${q(CE, '', 3)} / ${q(Pcm, '', 3)}`), m('Séférian total carbon equivalent', q(Ct, '', 3)), m('Preheat estimate (Séférian)', Tp > 0 ? q(Tp, '°C', 0) : 'None indicated'), m('Arc energy / heat input', `${q(E, '', 3)} / ${q(Q, 'kJ/mm', 3)}`), m('t8/5 thick plate / thin plate', `${q(t3, '', 1)} / ${q(t2, 's', 1)}`), m('Governing heat flow', mode)],
        'Weld preheat and cooling time screening.', 'Screening formulas; code and procedure govern.', {
          text: ok ? 'PROCEDURE PLAUSIBLE' : 'REVIEW PREHEAT OR HEAT INPUT', tone: ok ? 'good' : 'bad',
          checks: [check('Preheat against the estimate', okP ? 'pass' : 'fail', okP ? `${q(T0, '°C', 0)} at or above the ${q(Tp, '°C', 0)} estimate.` : `${q(T0, '°C', 0)} below the ${q(Tp, '°C', 0)} estimate: raise preheat or confirm by code.`), check('Cooling time', okT ? 'pass' : 'fail', `${q(t85, 's', 1)} against ${q(v.tMin, '', 0)}–${q(v.tMax, 's', 0)}.`), check('Code preheat', needPre ? 'warn' : 'pass', needPre ? `CE ${q(CE, '', 3)} is above your ${q(v.CElim, '', 2)} limit: preheat is required by your rule.` : 'CE within your no-preheat limit.'), check('Procedure', 'verify', 'Set preheat and heat input from the welding code and a qualified procedure.')],
        });
    },
    "snap-fit-joint-design": (v) => {
      const eps = 3 * v.Y * v.h / (2 * v.L * v.L * v.K), Ymax = 2 * v.eAllow / 100 * v.L * v.L * v.K / (3 * v.h), P = v.b * v.h * v.h * v.E * eps / (6 * v.L), t1 = Math.tan(rad(v.a1)), t2 = Math.tan(rad(v.a2));
      if (v.mu * t1 >= 1) return invalid('Friction and lead-in angle are too high: the finger locks instead of deflecting.');
      const W = P * (v.mu + t1) / (1 - v.mu * t1), lock = v.a2 >= 90 || v.mu * t2 >= 1, Ws = lock ? Infinity : P * (v.mu + t2) / (1 - v.mu * t2), sig = v.E * eps;
      const okE = 100 * eps <= v.eAllow, okR = lock || Ws >= v.Freq, ok = okE && okR;
      return output({ eps: 100 * eps, Ymax, P, W, Ws: lock ? 0 : Ws, lock: lock ? 1 : 0, sig }, 'Assembly strain (%)', 100 * eps,
        [m('Assembly strain', q(100 * eps, '%', 2)), m('Largest undercut at the permissible strain', q(Ymax, 'mm', 2)), m('Deflection force', q(P, 'N', 1)), m('Mating (assembly) force', q(W, 'N', 1)), m('Separation force', lock ? 'Self-locking: cannot be pulled apart without damage' : q(Ws, 'N', 1)), m('Root bending stress', q(sig, 'MPa', 1))],
        'Snap-fit joint design.', 'Elastic beam with rigid root.', {
          text: ok ? 'SNAP-FIT WORKS' : 'REDESIGN THE FINGER', tone: ok ? 'good' : 'bad',
          checks: [check('Strain', okE ? 'pass' : 'fail', `${q(100 * eps, '%', 2)} against ${q(v.eAllow, '%', 1)}.`), check('Retention', okR ? 'pass' : 'fail', lock ? 'Self-locking retaining face.' : `${q(Ws, 'N', 1)} against ${q(v.Freq, 'N', 1)} wanted.`), check('Root radius', 'verify', 'Add a generous root radius to avoid stress concentration.')],
        });
    },
    "worm-gear-drive-design": (v) => {
      const lead = PI * v.mx * v.z1, g = Math.atan(lead / (PI * v.d1)), ca = Math.cos(rad(v.alphan)), d2 = v.mx * v.z2, i = v.z2 / v.z1;
      const eta = (ca - v.mu * Math.tan(g)) / (ca + v.mu / Math.tan(g)), back = (ca - v.mu / Math.tan(g)) / (ca + v.mu * Math.tan(g)), locks = back <= 0;
      if (eta <= 0) return invalid('The friction is too high for the worm to drive the wheel.');
      const w1 = 2 * PI * v.n1 / 60, w2 = w1 / i, T1 = v.P1 * 1000 / w1, T2 = v.P1 * 1000 * eta / w2, Ft2 = 2 * T2 / (d2 / 1000), Ft1 = 2 * T1 / (v.d1 / 1000), Fr = Ft2 * Math.tan(rad(v.alphan)) / Math.cos(g);
      const vs = PI * v.d1 * v.n1 / (60000 * Math.cos(g)), heat = v.P1 * 1000 * (1 - eta), Toil = v.Tamb + heat / (v.kh * v.Ah), okT = Toil <= v.Tmax, okL = v.lock !== 'yes' || locks, ok = okT && okL;
      return output({ i, gamma: deg(g), eta: eta * 100, back: back * 100, vs, T1, T2, Ft1, Ft2, Fr, heat, Toil }, 'Output torque (N·m)', T2,
        [m('Ratio / lead angle', `${q(i, '', 2)} : 1 / ${q(deg(g), '°', 2)}`), m('Efficiency, worm driving', q(eta * 100, '%', 1)), m('Sliding speed', q(vs, 'm/s', 2)), m('Input / output torque', `${q(T1, '', 2)} / ${q(T2, 'N·m', 1)}`), m('Worm thrust (wheel tangential force)', q(Ft2, 'N', 0)), m('Wheel thrust (worm tangential force)', q(Ft1, 'N', 0)), m('Separating force', q(Fr, 'N', 0)), m('Heat generated', q(heat, 'W', 0)), m('Oil temperature', q(Toil, '°C', 0))],
        'Worm gear drive design.', 'Mesh friction only.', {
          text: ok ? 'DRIVE SUITABLE' : 'DRIVE NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Oil temperature', okT ? 'pass' : 'fail', `${q(Toil, '°C', 0)} against ${q(v.Tmax, '°C', 0)}: ${okT ? 'within the limit' : 'add a fan, more housing area or a larger box'}.`), check('Self-locking', locks ? 'pass' : (v.lock === 'yes' ? 'fail' : 'warn'), locks ? 'Statically self-locking.' : v.lock === 'yes' ? `Back-driving efficiency ${q(back * 100, '%', 1)}: the load can run the drive back; fit a brake or use fewer starts.` : 'The load can back-drive the worm; provide a brake if it must be held.'), check('Rating', 'verify', 'Check wheel tooth strength and wear rating against the maker’s data.')],
        });
    },
    "lifting-lug-design": (v) => {
      if (v.dp > v.dh) return invalid('The pin cannot be larger than the hole.');
      if (2 * v.R <= v.dh) return invalid('The edge distance must exceed the hole radius.');
      const F = v.W * 1000 * v.Dyn / (v.legs * Math.cos(rad(v.ang))), st = F / ((2 * v.R - v.dh) * v.t), tt = F / (2 * v.t * (v.R - v.dh / 2)), sb = F / (v.dp * v.t), tp = F / (2 * PI * v.dp * v.dp / 4);
      const us = [st / v.sA, tt / v.tA, sb / v.bA, tp / v.tP].map((x) => x * 100), umax = Math.max(...us), okC = v.dh - v.dp <= v.clr, ok = umax <= 100;
      const names = ['Net tension', 'Tear-out', 'Bearing', 'Pin shear'], vals = [st, tt, sb, tp], alls = [v.sA, v.tA, v.bA, v.tP];
      return output({ F, st, tt, sb, tp, umax }, 'Highest utilisation (%)', umax,
        [m('Load per lug', q(F / 1000, 'kN', 2)), m('Net tension stress', q(st, 'MPa', 1)), m('Tear-out shear stress', q(tt, 'MPa', 1)), m('Bearing stress', q(sb, 'MPa', 1)), m('Pin shear stress', q(tp, 'MPa', 1)), m('Highest utilisation', q(umax, '%', 0))],
        'Lifting lug check.', 'Simplified lug checks.', {
          text: ok ? 'LUG ADEQUATE' : 'LUG OVERSTRESSED', tone: ok ? 'good' : 'bad',
          table: tbl('Lug checks', ['Check', 'Stress', 'Allowable', 'Utilisation'], names.map((n, k) => [n, q(vals[k], 'MPa', 1), q(alls[k], 'MPa', 0), q(us[k], '%', 0)])),
          checks: [...names.map((n, k) => check(n, us[k] <= 100 ? 'pass' : 'fail', `${q(us[k], '%', 0)} of allowable.`)), check('Hole clearance', okC ? 'pass' : 'warn', `${q(v.dh - v.dp, 'mm', 1)} against ${q(v.clr, 'mm', 1)}.`), check('Lifting code', 'verify', 'Check out-of-plane load, the lug weld and proof-load testing to the lifting code.')],
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
