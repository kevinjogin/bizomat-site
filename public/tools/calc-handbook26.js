// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook26). SI units are explicit at each boundary.
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
    "spur-gear-set-design": (v) => {
      const ph = rad(v.phi), d1 = v.m * v.z1, d2 = v.m * v.z2, a = (d1 + d2) / 2, u = v.z2 / v.z1, vel = PI * d1 * v.n1 / 60000, T1 = v.P * 1000 / (2 * PI * v.n1 / 60), Ft = 2 * T1 * 1000 / d1;
      const Kv = v.Kv > 0 ? v.Kv : (6.1 + vel) / 6.1, K = v.Ko * Kv * v.KH;
      const rb1 = d1 / 2 * Math.cos(ph), rb2 = d2 / 2 * Math.cos(ph), ra1 = d1 / 2 + v.m, ra2 = d2 / 2 + v.m;
      const eps = (Math.sqrt(ra1 * ra1 - rb1 * rb1) + Math.sqrt(ra2 * ra2 - rb2 * rb2) - a * Math.sin(ph)) / (PI * v.m * Math.cos(ph)), zmin = 2 / Math.sin(ph) ** 2;
      const sF = Ft * K / (v.b * v.m * v.J), ZE = Math.sqrt(v.E * 1000 / (2 * PI * (1 - v.nu * v.nu))), ZH = Math.sqrt(2 / (Math.sin(ph) * Math.cos(ph))), sH = ZE * ZH * Math.sqrt(Ft * K * (u + 1) / (v.b * d1 * u));
      const SF = v.sFP / sF, SH = v.sHP / sH, bF = v.b * sF / (v.sFP / v.reqF), bH = v.b * (sH / (v.sHP / v.reqH)) ** 2, bReq = Math.max(bF, bH);
      const okF = SF >= v.reqF, okH = SH >= v.reqH, okU = v.z1 >= zmin, ok = okF && okH && okU && eps >= 1.2;
      return output({ d1, d2, a, vel, T1, Ft, Kv, eps, sF, sH, SF, SH, bF, bH, bReq }, 'Face width required (mm)', bReq,
        [m('Pitch diameters / centre distance', `${q(d1, '', 2)} / ${q(d2, '', 2)} / ${q(a, 'mm', 2)}`), m('Pitch-line speed', q(vel, 'm/s', 2)), m('Pinion torque', q(T1, 'N·m', 2)), m('Tangential load', q(Ft, 'N', 0)), m('Dynamic factor used', q(Kv, '', 3)), m('Contact ratio', q(eps, '', 3)), m('Bending stress / safety factor', `${q(sF, 'MPa', 0)} / ${q(SF, '', 2)}`), m('Contact stress / safety factor', `${q(sH, 'MPa', 0)} / ${q(SH, '', 2)}`), m('Face width for bending', q(bF, 'mm', 1)), m('Face width for contact', q(bH, 'mm', 1))],
        'Spur gear set design check.', 'Factors and allowables as entered.', {
          text: ok ? 'GEAR SET ADEQUATE' : 'GEAR SET NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bending', okF ? 'pass' : 'fail', `Safety factor ${q(SF, '', 2)} against ${q(v.reqF, '', 2)}.`), check('Pitting', okH ? 'pass' : 'fail', `Safety factor ${q(SH, '', 2)} against ${q(v.reqH, '', 2)}.`), check('Undercut', okU ? 'pass' : 'warn', okU ? 'Pinion teeth above the undercut limit.' : `Fewer than ${q(zmin, '', 1)} teeth: use profile shift or more teeth.`), check('Contact ratio', eps >= 1.4 ? 'pass' : eps >= 1.2 ? 'warn' : 'fail', `${q(eps, '', 3)}; aim for 1.4 or more.`), check('Face width ratio', v.b / d1 <= 1.2 ? 'pass' : 'warn', `Face width ÷ pinion diameter = ${q(v.b / d1, '', 2)}; wide faces need good alignment.`)],
        });
    },
    "compression-spring-designer": (v) => {
      if (v.L2 >= v.L1) return invalid('The second length must be shorter than the first.');
      if (v.F2 <= v.F1) return invalid('The second load must exceed the first.');
      const k = (v.F2 - v.F1) / (v.L1 - v.L2), L0 = v.L1 + v.F1 / k, Kw = (C) => (4 * C - 1) / (4 * C - 4) + 0.615 / C, stress = (d) => Kw(v.D / d) * 8 * v.F2 * v.D / (PI * d ** 3);
      let lo = v.D / 25, hi = v.D / 2.5; if (stress(hi) > v.tau) return invalid('Even a wire of D ÷ 2.5 is overstressed: increase the mean diameter or the allowable stress.'); if (stress(lo) < v.tau) lo = v.D / 25;
      for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (stress(mid) > v.tau) lo = mid; else hi = mid; }
      const d = hi, C = v.D / d, Na = v.G * 1000 * d ** 4 / (8 * v.D ** 3 * k), Nt = { cg: Na + 2, c: Na + 2, pg: Na + 1, p: Na }[v.ends], Ls = (v.ends === 'cg' || v.ends === 'pg' ? Nt : Nt + 1) * d;
      const clash = (v.L2 - Ls) / (L0 - v.L2) * 100, tauS = Kw(C) * 8 * k * (L0 - Ls) * v.D / (PI * d ** 3), slender = L0 / v.D, okClash = clash >= v.clash, okC = C >= 4 && C <= 12;
      return output({ k, L0, d, C, Na, Nt, Ls, clash, tauS, slender }, 'Wire diameter (mm)', d,
        [m('Spring rate', q(k, 'N/mm', 3)), m('Unloaded (free) length', q(L0, 'mm', 2)), m('Wire diameter', q(d, 'mm', 3)), m('Spring index', q(C, '', 2)), m('Active / total coils', `${q(Na, '', 2)} / ${q(Nt, '', 2)}`), m('Solid length', q(Ls, 'mm', 2)), m('Outside / inside diameter', `${q(v.D + d, '', 2)} / ${q(v.D - d, 'mm', 2)}`), m('Clash allowance', q(clash, '%', 1)), m('Stress at solid', q(tauS, 'MPa', 0)), m('Buckling ratio L₀ ÷ D', q(slender, '', 2))],
        'Compression spring specification.', 'Round wire, static load.', {
          text: okClash && okC ? 'SPRING FEASIBLE' : 'REVISE THE DESIGN', tone: okClash && okC ? 'good' : 'bad',
          checks: [check('Clash allowance', okClash ? 'pass' : 'fail', `${q(clash, '%', 1)} against ${q(v.clash, '%', 0)}.`), check('Spring index', okC ? 'pass' : 'warn', `C = ${q(C, '', 2)}; 4 to 12 is easiest to make.`), check('Stress at solid', tauS <= v.tau * 1.15 ? 'pass' : 'warn', tauS <= v.tau * 1.15 ? 'The spring tolerates being pressed solid.' : 'Pressing solid would overstress the spring; add a stop.'), check('Buckling', slender <= 2.6 ? 'pass' : 'verify', slender <= 2.6 ? 'Buckling unlikely.' : 'Guide the spring on a rod or in a bore, or check end fixity.')],
        });
    },
    "shrink-fit-design": (v) => {
      if (v.D <= v.d) return invalid('The hub outside diameter must exceed the interface diameter.');
      if (v.di >= v.d) return invalid('The shaft bore must be smaller than the interface diameter.');
      const Fp = Math.hypot(2 * v.T * 1000 / v.d, v.Fa * 1000), p = v.n * Fp / (PI * v.d * v.L * v.mu);
      if (p <= 0) return invalid('Enter a torque or axial load.');
      const hub = ((v.D ** 2 + v.d ** 2) / (v.D ** 2 - v.d ** 2) + v.nuh) / (v.Eh * 1000), shaft = ((v.d ** 2 + v.di ** 2) / (v.d ** 2 - v.di ** 2) - v.nus) / (v.Es * 1000), delta = p * v.d * (hub + shaft);
      const st = p * (v.D ** 2 + v.d ** 2) / (v.D ** 2 - v.d ** 2), vm = Math.sqrt(st * st + st * p + p * p), Fpress = PI * v.d * v.L * v.mu * p, dT = (delta + v.clear) / (v.alpha * 1e-6 * v.d), ok = vm <= v.Sy;
      return output({ p, delta, st, vm, Fpress, dT, Th: v.Ta + dT }, 'Required interference (µm)', delta * 1000,
        [m('Required interface pressure', q(p, 'MPa', 2)), m('Required diametral interference', q(delta * 1000, 'µm', 1)), m('Hub hoop stress at bore', q(st, 'MPa', 1)), m('Hub von Mises stress at bore', q(vm, 'MPa', 1)), m('Press-in force', q(Fpress / 1000, 'kN', 1)), m('Hub temperature for shrinking on', q(v.Ta + dT, '°C', 0))],
        'Interference fit designed from the duty.', 'Lamé thick cylinders, uniform pressure.', {
          text: ok ? 'FIT FEASIBLE' : 'HUB OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Hub stress', ok ? 'pass' : 'fail', `${q(vm, 'MPa', 0)} against yield ${q(v.Sy, 'MPa', 0)}.`), check('Heating temperature', v.Ta + dT <= 300 ? 'pass' : 'warn', v.Ta + dT <= 300 ? 'Within normal oven or induction heating.' : 'Very hot: check tempering of the hub, or cool the shaft instead.')],
        });
    },
    "bolted-joint-design-check": (v) => {
      if (v.Lt > v.grip) return invalid('The threaded length cannot exceed the grip.');
      const At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, Ad = PI * v.d * v.d / 4, Eb = v.Eb * 1000, kb = 1 / ((v.grip - v.Lt) / (Eb * Ad) + v.Lt / (Eb * At));
      const km = 0.5774 * PI * v.Em * 1000 * v.d / (2 * Math.log(5 * (0.5774 * v.grip + 0.5 * v.d) / (0.5774 * v.grip + 2.5 * v.d))), C = kb / (kb + km);
      const Fi = v.pct / 100 * v.Sp * At, T = v.K * Fi * v.d / 1000, s = v.sc / 100, FiMin = Fi / (1 + s), FiMax = s < 1 ? Fi / (1 - s) : Infinity, Pn = v.Pext * 1000;
      const nSep = Pn > 0 ? FiMin / ((1 - C) * Pn) : Infinity, nProof = Pn > 0 ? (v.Sp * At - FiMax) / (C * Pn) : Infinity, sa = C * Pn / (2 * At), si = FiMax / At, nf = sa > 0 ? v.Se * (v.Sut - si) / (sa * (v.Sut + v.Se)) : Infinity;
      const fin = (x) => (Number.isFinite(x) ? x : 0), ok = nSep >= v.req && nProof >= 1 && nf >= v.req;
      return output({ At, kb, km, C, Fi, T, FiMin, FiMax, nSep: fin(nSep), nProof: fin(nProof), nf: fin(nf) }, 'Tightening torque (N·m)', T,
        [m('Tensile stress area', q(At, 'mm²', 1)), m('Joint constant C', q(C, '', 4)), m('Preload (nominal)', q(Fi / 1000, 'kN', 2)), m('Preload range from scatter', `${q(FiMin / 1000, '', 2)} to ${q(FiMax / 1000, 'kN', 2)}`), m('Tightening torque', q(T, 'N·m', 1)), m('Factor against separation', Number.isFinite(nSep) ? q(nSep, '', 2) : 'No load'), m('Factor against proof load', Number.isFinite(nProof) ? q(nProof, '', 2) : 'No load'), m('Fatigue factor (Goodman)', Number.isFinite(nf) ? q(nf, '', 2) : 'No load')],
        'Bolted joint design check.', 'Concentric tension joint.', {
          text: ok ? 'JOINT DESIGN ADEQUATE' : 'JOINT DESIGN NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Separation', nSep >= v.req ? 'pass' : 'fail', `${Number.isFinite(nSep) ? q(nSep, '', 2) : '∞'} against ${q(v.req, '', 1)} at the lowest preload.`), check('Proof load', nProof >= 1 ? 'pass' : 'fail', nProof >= 1 ? 'The bolt stays below proof at the highest preload plus its share of load.' : 'At the highest preload the working load takes the bolt past proof.'), check('Fatigue', nf >= v.req ? 'pass' : 'fail', `${Number.isFinite(nf) ? q(nf, '', 2) : '∞'} against ${q(v.req, '', 1)}.`), check('Preload scatter', v.sc <= 25 ? 'pass' : 'warn', v.sc <= 25 ? 'Typical of torque tightening.' : 'Large scatter: consider angle or tension control.')],
        });
    },
    "turning-cost-per-part": (v) => {
      const cm = v.rate / 60, costAt = (V) => { const Nn = 1000 * V / (PI * v.D), tc = v.passes * (v.L + v.appr) / (v.f * Nn), T = (v.Ct / V) ** (1 / v.nT), e = tc / T, cycle = tc + v.load + v.tct * e + v.setup / v.batch; return { Nn, tc, T, e, cycle, cost: cm * cycle + v.edge * e }; };
      const now = costAt(v.V), k = 1 / v.nT - 1, Vmc = v.Ct / (k * (v.tct + v.edge / cm)) ** v.nT, Vmp = v.tct > 0 ? v.Ct / (k * v.tct) ** v.nT : Infinity, mc = costAt(Vmc), mp = Number.isFinite(Vmp) ? costAt(Vmp) : null;
      return output({ N: now.Nn, tc: now.tc, T: now.T, edges: now.e, cycle: now.cycle, cost: now.cost, Vmc, Vmp: Number.isFinite(Vmp) ? Vmp : 0, costMc: mc.cost }, 'Cost per part ($)', now.cost,
        [m('Spindle speed', q(now.Nn, 'rpm', 0)), m('Cutting time', q(now.tc, 'min', 3)), m('Tool life', q(now.T, 'min', 1)), m('Parts per edge', q(1 / now.e, '', 1)), m('Cycle time per part', q(now.cycle, 'min', 3)), m('Cost per part', money(now.cost)), m('Minimum-cost speed / cost', `${q(Vmc, 'm/min', 0)} / ${money(mc.cost)}`), m('Maximum-production speed / cycle', mp ? `${q(Vmp, 'm/min', 0)} / ${q(mp.cycle, 'min', 3)}` : 'No tool change time')],
        'Turning cost per part.', 'Taylor tool life at constant feed.', {
          table: tbl('Speed comparison', ['Case', 'Speed', 'Tool life', 'Cycle', 'Cost per part'], [['Current', q(v.V, 'm/min', 0), q(now.T, 'min', 1), q(now.cycle, 'min', 3), money(now.cost)], ['Minimum cost', q(Vmc, 'm/min', 0), q(mc.T, 'min', 1), q(mc.cycle, 'min', 3), money(mc.cost)], ...(mp ? [['Maximum production', q(Vmp, 'm/min', 0), q(mp.T, 'min', 1), q(mp.cycle, 'min', 3), money(mp.cost)]] : [])]),
          checks: [check('Speed choice', v.V >= Vmc * 0.9 && (!mp || v.V <= Vmp * 1.1) ? 'pass' : 'warn', v.V < Vmc * 0.9 ? 'Below the minimum-cost speed: faster is cheaper.' : mp && v.V > Vmp * 1.1 ? 'Above the maximum-production speed: tool changes cost more time than they save.' : 'Within the efficient speed range.')],
        });
    },
    "press-die-tonnage": (v) => {
      const Fb = v.blank * v.t * v.tau, Fp = v.holes * PI * v.hd * v.t * v.tau, Fcut = Fb + Fp, Fs = Fcut * v.strip / 100, Fbend = v.bendL > 0 ? v.bendL * v.t * v.t * v.UTS / v.W : 0, Fd = v.drawd > 0 ? PI * v.drawd * v.t * v.UTS : 0;
      const total = (Fcut + Fs + Fbend + Fd) / 1000; if (total <= 0) return invalid('Enter at least one operation.');
      const req = total * (1 + v.margin / 100), E = Fcut * v.t * v.pen / 100 / 1000, ok = req <= v.cap;
      return output({ Fb: Fb / 1000, Fp: Fp / 1000, Fs: Fs / 1000, Fbend: Fbend / 1000, Fd: Fd / 1000, total, req, E }, 'Required press force (kN)', req,
        [m('Blanking and notching', q(Fb / 1000, 'kN', 1)), m('Piercing', q(Fp / 1000, 'kN', 1)), m('Stripping', q(Fs / 1000, 'kN', 1)), m('Bending', q(Fbend / 1000, 'kN', 1)), m('Drawing', q(Fd / 1000, 'kN', 1)), m('Total load', q(total, 'kN', 1)), m('Required press with margin', `${q(req, 'kN', 0)} (${q(req / 9.80665, 't', 1)}, ${q(req / 8.896443, 'US tons', 1)})`), m('Cutting energy per stroke', q(E, 'J', 0))],
        'Die tonnage.', 'Handbook force formulas; forces coincide.', {
          text: ok ? 'PRESS ADEQUATE' : 'PRESS TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Press capacity', ok ? 'pass' : 'fail', `${q(req, 'kN', 0)} against ${q(v.cap, 'kN', 0)}.`), check('Off-centre load', 'verify', 'Keep the centre of load near the press centre line to avoid tilting the slide.')],
        });
    },
    "hydraulic-cylinder-sizing": (v) => {
      const pM = v.p / 10, Dmin = Math.sqrt(4 * v.Fpush * 1000 / (PI * pM)), D = v.bore > 0 ? v.bore : Dmin;
      if (v.bore > 0 && v.bore < Dmin) return invalid(`The chosen bore is below the minimum of ${q(Dmin, 'mm', 1)} for the push force.`);
      const dRod = (64 * v.nb * v.Fpush * 1000 * (v.Kf * v.Lb) ** 2 / (PI ** 3 * v.E * 1000)) ** 0.25, dMax2 = D * D - 4 * v.Fpull * 1000 / (PI * pM), dMax = dMax2 > 0 ? Math.sqrt(dMax2) : 0;
      const A = area(D), Ann = A - area(dRod), Qe = A * v.vext * 60 / 1e6, Qr = Math.max(Ann, 0) * v.vret * 60 / 1e6, Qmax = Math.max(Qe, Qr), Pkw = pM * Qmax / 60 / (v.eta / 100);
      const pipe = (Q, vel) => Math.sqrt(4 * (Q / 60000) / (PI * vel)) * 1000, ok = dRod <= dMax && Ann > 0;
      const Qret = Ann > 0 ? Math.max(Qe * Ann / A, Qr * A / Ann) : Qe, pipeP = pipe(Qmax, v.vp), pipeR = pipe(Qret, v.vr);
      return output({ Dmin, D, dRod, dMax, Qe, Qr, Qret, Pkw, pipeP, pipeR }, 'Minimum bore (mm)', Dmin,
        [m('Minimum bore for push', q(Dmin, 'mm', 1)), m('Bore used', q(D, 'mm', 1)), m('Minimum rod for buckling', q(dRod, 'mm', 1)), m('Largest rod for the pull force', dMax > 0 ? q(dMax, 'mm', 1) : 'Bore too small for the pull force'), m('Extend / retract flow', `${q(Qe, '', 1)} / ${q(Qr, 'L/min', 1)}`), m('Pump input power', q(Pkw, 'kW', 2)), m('Pressure line bore', q(pipeP, 'mm', 1)), m('Largest return flow (area ratio)', q(Qret, 'L/min', 1)), m('Return line bore', q(pipeR, 'mm', 1)), m('Extend / retract time', `${q(v.stroke / v.vext, '', 2)} / ${q(v.stroke / v.vret, 's', 2)}`)],
        'Hydraulic cylinder sizing.', 'Euler buckling; pressure at the cylinder.', {
          text: ok ? 'CYLINDER FEASIBLE' : 'CHOOSE A LARGER BORE', tone: ok ? 'good' : 'bad',
          checks: [check('Rod fits the bore', ok ? 'pass' : 'fail', ok ? `A rod between ${q(dRod, 'mm', 1)} and ${q(dMax, 'mm', 1)} works.` : 'The rod needed for buckling leaves too little annulus area for the pull force.'), check('Standard sizes', 'verify', 'Round bore and rod up to the cylinder maker’s standard sizes and re-check.')],
        });
    },
    "shaft-design-check": (v) => {
      const w = 2 * PI * v.n / 60, T = v.P * 1000 / w * 1000, M = v.M * 1000, tauE = v.tau * (v.key === 'yes' ? 0.75 : 1);
      const dS = Math.cbrt(16 / (PI * tauE) * Math.hypot(v.Km * M, v.Kt * T)), th = rad(v.twist) / 1000, dT = (32 * T / (v.G * 1000 * th) / PI) ** 0.25;
      const Nc = (d) => { const I = PI * d ** 4 / 64, E = v.E * 1000, wl = v.rho * 9.80665 * PI * d * d / 4 * 1e-9, delta = v.mass * 9.80665 * v.L ** 3 / (48 * E * I) + 5 * wl * v.L ** 4 / (384 * E * I); return 946 / Math.sqrt(delta); };
      let lo = 0.5, hi = 2000; if (Nc(hi) < v.ratio * v.n) return invalid('No practical diameter reaches the critical speed margin: shorten the span.');
      for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (Nc(mid) < v.ratio * v.n) lo = mid; else hi = mid; }
      const dC = hi, dGov = Math.max(dS, dT, dC), governs = dGov === dS ? 'Strength' : dGov === dT ? 'Twist' : 'Critical speed';
      return output({ T: T / 1000, dS, dT, dC, dGov, Nc: Nc(dGov), governs }, 'Governing diameter (mm)', dGov,
        [m('Torque', q(T / 1000, 'N·m', 2)), m('Diameter for strength', q(dS, 'mm', 2)), m('Diameter for twist', q(dT, 'mm', 2)), m('Diameter for critical speed', q(dC, 'mm', 2)), m('Governing diameter', `${q(dGov, 'mm', 2)} (${governs})`), m('Critical speed at that diameter', q(Nc(dGov), 'rpm', 0))],
        'Shaft sized for strength, stiffness and whirling.', 'Simply supported span, central mass.', {
          checks: [check('Governing criterion', 'verify', `${governs} sets the diameter; round up to a standard size and check bearings and keys.`)],
        });
    },
    "milling-cut-planner": (v) => {
      if (v.ae > v.D) return invalid('The radial engagement cannot exceed the cutter diameter.');
      const sk = Math.sin(rad(v.kappa)), nC = 1000 * v.Vc / (PI * v.D), n = Math.min(nC, v.nmax), Vact = PI * v.D * n / 1000;
      const fz = (v.ae < v.D / 2 ? v.hex * v.D / (2 * Math.sqrt(v.ae * (v.D - v.ae))) : v.hex) / sk, vf = fz * v.z * n, MRR = v.ae * v.ap * vf;
      const phi = Math.acos(1 - 2 * v.ae / v.D), hm = fz * sk * v.ae / (v.D * phi / 2), kc = v.kc1 * hm ** -v.mc, Pc = MRR * kc / 60e6, Pm = Pc / (v.eta / 100), Tq = Pc * 1000 / (2 * PI * n / 60), fzMax = fz * (v.Pmax / Pm) ** (1 / (1 - v.mc)), ok = Pm <= v.Pmax;
      return output({ n, Vact, fz, vf, MRR, hm, kc, Pc, Pm, Tq, fzMax }, 'Spindle power needed (kW)', Pm,
        [m('Spindle speed', `${q(n, 'rpm', 0)}${n < nC ? ' (spindle limit)' : ''}`), m('Actual cutting speed', q(Vact, 'm/min', 0)), m('Feed per tooth', q(fz, 'mm', 4)), m('Table feed', q(vf, 'mm/min', 0)), m('Removal rate', q(MRR / 1000, 'cm³/min', 1)), m('Average chip thickness', q(hm, 'mm', 4)), m('Specific cutting force', q(kc, 'N/mm²', 0)), m('Power at the spindle motor', q(Pm, 'kW', 2)), m('Torque at the cutter', q(Tq, 'N·m', 1)), m('Feed per tooth for full power', q(fzMax, 'mm', 4))],
        'Milling cut plan.', 'Average forces; Kienzle model.', {
          text: ok ? 'WITHIN SPINDLE POWER' : 'EXCEEDS SPINDLE POWER', tone: ok ? 'good' : 'bad',
          checks: [check('Spindle power', ok ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pmax, 'kW', 1)}.`), check('Spindle speed', n < nC ? 'warn' : 'pass', n < nC ? 'The spindle limit caps the speed; cutting speed is below the recommendation.' : 'Recommended cutting speed reached.'), check('Chip thinning', v.ae < v.D / 2 ? 'pass' : 'verify', v.ae < v.D / 2 ? 'Feed raised to hold the target chip thickness.' : 'Engagement at or over half the diameter: no thinning correction.')],
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
