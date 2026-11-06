// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook27). SI units are explicit at each boundary.
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
    "ballscrew-axis-sizing": (v) => {
      const g = 9.80665, ns = v.v / v.lead * 60, w = 2 * PI * ns / 60, al = w / v.ta, a = v.v / 1000 / v.ta, e = v.eff / 100;
      const Ff = v.Fx + v.mu * v.m * g, Fa = Ff + v.m * a, Fd = Math.abs(Ff - v.m * a), d = v.dr / 1000, L = v.Ls / 1000;
      const Js = PI * v.rho * L * d ** 4 / 32, J = v.Jm + Js, k = v.lead / 1000 / (2 * PI * e);
      const Tc = Ff * k, Ta = (Ff + v.m * a) * k + J * al, Td = (Ff - v.m * a) * k - J * al, cyc = 2 * v.ta + v.tc + v.tdw, Trms = Math.sqrt((Ta * Ta + Td * Td) * v.ta / cyc + Tc * Tc * v.tc / cyc), Tpk = Math.max(Math.abs(Ta), Math.abs(Td), Tc);
      const E = v.E * 1e9, I = PI * d ** 4 / 64, A = PI * d * d / 4, lam = { ff: 4.730, fs: 3.927, ss: PI, ffree: 1.875 }[v.ends], K = { ff: 0.5, fs: 0.7, ss: 1, ffree: 2 }[v.ends];
      const nc = lam * lam / (2 * PI * L * L) * Math.sqrt(E * I / (v.rho * A)) * 60, Pcr = PI * PI * E * I / (K * L) ** 2;
      const sa = v.v * v.ta / 2, sc = v.v * v.tc, Fm = Math.cbrt((Fa ** 3 * sa + Ff ** 3 * sc + Fd ** 3 * sa) / (2 * sa + sc)), Lrev = (v.Ca * 1000 / (v.fw * Fm)) ** 3 * 1e6, revCycle = (2 * sa + sc) / v.lead, hours = Lrev / revCycle * cyc / 3600;
      const okN = ns <= nc * v.speedPct / 100, okP = Fa <= Pcr * v.loadPct / 100, okL = hours >= v.req, ok = okN && okP && okL;
      return output({ ns, a, Ff, Fa, Tc, Ta, Td, Tpk, Trms, Js, nc, Pcr, Fm, hours }, 'Peak motor torque (N·m)', Tpk,
        [m('Screw speed', q(ns, 'rpm', 0)), m('Acceleration', q(a, 'm/s²', 2)), m('Axial force accelerating / running', `${q(Fa, '', 0)} / ${q(Ff, 'N', 0)}`), m('Torque accelerating / running / decelerating', `${q(Ta, '', 3)} / ${q(Tc, '', 3)} / ${q(Td, 'N·m', 3)}`), m('RMS torque over the cycle', q(Trms, 'N·m', 3)), m('Screw inertia', q(Js, 'kg·m²', 6)), m('Critical speed', q(nc, 'rpm', 0)), m('Buckling load', q(Pcr / 1000, 'kN', 2)), m('Cubic-mean axial load', q(Fm, 'N', 0)), m('Rating life', q(hours, 'h', 0))],
        'Ball-screw axis sizing.', 'Trapezoidal moves on a horizontal axis.', {
          text: ok ? 'AXIS FEASIBLE' : 'AXIS LIMIT EXCEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Critical speed', okN ? 'pass' : 'fail', `${q(ns, 'rpm', 0)} against ${q(nc * v.speedPct / 100, 'rpm', 0)} allowed.`), check('Buckling', okP ? 'pass' : 'fail', `${q(Fa / 1000, 'kN', 2)} against ${q(Pcr * v.loadPct / 100000, 'kN', 2)} allowed.`), check('Life', okL ? 'pass' : 'fail', `${q(hours, 'h', 0)} against ${q(v.req, 'h', 0)}.`), check('Motor', 'verify', `Choose a motor with continuous torque above ${q(Trms, 'N·m', 2)} and peak above ${q(Tpk, 'N·m', 2)} at ${q(ns, 'rpm', 0)}.`)],
        });
    },
    "v-belt-drive-design": (v) => {
      const d2 = v.d1 * v.ratio, D = Math.max(d2, v.d1), dd = Math.min(d2, v.d1); if ((D - dd) / 2 >= v.C) return invalid('The centre distance is too small for these pulleys.');
      const phi = Math.asin((D - dd) / (2 * v.C)), Lb = 2 * v.C * Math.cos(phi) + PI * (D + dd) / 2 + phi * (D - dd), th = PI - 2 * phi, vel = PI * v.d1 * v.n1 / 60000;
      const mue = v.groove === 'v' ? v.mu / Math.sin(rad(19)) : v.mu, eR = Math.exp(mue * th), Fe = v.P * v.SF * 1000 / vel, Tc = v.mass * vel * vel;
      if (Tc >= v.Tmax) return invalid('Centrifugal tension alone exceeds the belt allowable: reduce belt speed.');
      const nb = Math.ceil(Fe * eR / (eR - 1) / (v.Tmax - Tc) - 1e-9), t1 = Fe / nb * eR / (eR - 1), t2 = t1 - Fe / nb, Fs = nb * Math.sqrt(t1 * t1 + t2 * t2 + 2 * t1 * t2 * Math.cos(2 * phi));
      return output({ d2, n2: v.n1 / v.ratio, vel, Lb, wrap: deg(th), eR, Fe, Tc, nb, T1: t1 + Tc, T2: t2 + Tc, Fs }, 'Number of belts', nb,
        [m('Driven pitch diameter / speed', `${q(d2, 'mm', 1)} / ${q(v.n1 / v.ratio, 'rpm', 0)}`), m('Belt speed', q(vel, 'm/s', 2)), m('Belt pitch length', q(Lb, 'mm', 1)), m('Wrap on the small pulley', q(deg(th), '°', 1)), m('Tension ratio', q(eR, '', 2)), m('Effective pull (design)', q(Fe, 'N', 0)), m('Number of belts', q(nb, '', 0)), m('Tight / slack tension per belt', `${q(t1 + Tc, '', 0)} / ${q(t2 + Tc, 'N', 0)}`), m('Shaft load', q(Fs, 'N', 0))],
        'Belt drive design.', 'Euler friction with an allowable belt tension.', {
          checks: [check('Wrap angle', deg(th) >= 120 ? 'pass' : 'warn', `${q(deg(th), '°', 1)}; below 120° the drive loses capacity.`), check('Belt speed', vel <= 30 ? 'pass' : 'warn', vel <= 30 ? 'Within the usual V-belt range.' : 'Above about 30 m/s: use belts and pulleys rated for high speed.'), check('Belt catalogue', 'verify', 'Confirm the belt section and count against the maker’s power ratings.')],
        });
    },
    "roller-chain-drive-design": (v) => {
      const t1 = PI / v.z1, D1 = v.p / Math.sin(t1), D2 = v.p / Math.sin(PI / v.z2), vel = v.z1 * v.p * v.n1 / 60000, Pd = v.P * v.SF, cap = v.Pr * v.msf;
      const pull = v.P * 1000 / vel + v.kgm * vel * vel, nB = v.Fb * 1000 / pull, s = (v.z1 + v.z2) / 2, dz = (v.z2 - v.z1) / (2 * PI);
      let links = Math.ceil(2 * v.Cp + s + dz * dz / v.Cp - 1e-9); if (links % 2) links++;
      const Cx = v.p / 4 * (links - s + Math.sqrt((links - s) ** 2 - 8 * dz * dz)), wrap = 180 - 2 * deg(Math.asin((D2 - D1) / (2 * Cx))), chord = (1 - Math.cos(t1)) * 100, ok = Pd <= cap && nB >= 7;
      return output({ D1, D2, vel, Pd, cap, pull, nB, links, C: Cx, wrap, chord }, 'Chain length (links)', links,
        [m('Pitch diameters', `${q(D1, '', 2)} / ${q(D2, 'mm', 2)}`), m('Chain speed', q(vel, 'm/s', 2)), m('Design power / capacity', `${q(Pd, '', 2)} / ${q(cap, 'kW', 2)}`), m('Working chain pull', q(pull, 'N', 0)), m('Safety factor on breaking load', q(nB, '', 1)), m('Chain length', `${q(links, 'links', 0)} (${q(links * v.p, 'mm', 0)})`), m('Exact centre distance', q(Cx, 'mm', 2)), m('Wrap on small sprocket', q(wrap, '°', 1)), m('Chordal speed variation', q(chord, '%', 2)), m('Output speed', q(v.n1 * v.z1 / v.z2, 'rpm', 1))],
        'Roller chain drive design.', 'Two sprockets; ratings from the chain maker.', {
          text: ok ? 'CHAIN ADEQUATE' : 'CHAIN UNDERSIZED', tone: ok ? 'good' : 'bad',
          checks: [check('Power rating', Pd <= cap ? 'pass' : 'fail', `${q(Pd, 'kW', 2)} against ${q(cap, 'kW', 2)}.`), check('Breaking load', nB >= 7 ? 'pass' : 'warn', `Safety factor ${q(nB, '', 1)}; 7 or more is usual for power drives.`), check('Small sprocket', v.z1 >= 17 ? 'pass' : 'warn', v.z1 >= 17 ? 'Smooth running.' : 'Fewer than 17 teeth: rough running and faster wear.'), check('Ratio', v.z2 / v.z1 <= 7 ? 'pass' : 'warn', `Ratio ${q(v.z2 / v.z1, '', 2)}; above about 7 use two stages.`)],
        });
    },
    "bearing-selection-check": (v) => {
      const p = v.type === 'ball' ? 3 : 10 / 3, P = Math.max(v.Fr, v.X * v.Fr + v.Y * v.Fa); if (P <= 0) return invalid('Enter a load.');
      const w1 = (Math.log(100 / v.rel) / Math.log(1 / 0.9)) ** (2 / 3), a1 = v.basis === 'iso' ? 0.95 * w1 + 0.05 : w1, Lh = a1 * v.aiso * (v.C / P) ** p * 1e6 / (60 * v.n), Creq = P * (v.Lreq * 60 * v.n / (1e6 * a1 * v.aiso)) ** (1 / p);
      const P0 = Math.max(v.Fr, v.X0 * v.Fr + v.Y0 * v.Fa), s0 = v.C0 / P0, okL = Lh >= v.Lreq, okS = s0 >= v.s0, okN = v.n <= v.nlim, ok = okL && okS && okN;
      return output({ P, a1, Lh, Creq, P0, s0 }, 'Required dynamic rating (kN)', Creq,
        [m('Dynamic equivalent load', q(P, 'kN', 3)), m('Reliability factor a₁', q(a1, '', 3)), m('Required dynamic rating', q(Creq, 'kN', 2)), m('Life of the chosen bearing', q(Lh, 'h', 0)), m('Static equivalent load', q(P0, 'kN', 3)), m('Static safety factor', q(s0, '', 2)), m('Speed ÷ limiting speed', q(v.n / v.nlim * 100, '%', 0))],
        'Bearing selection check.', 'Catalogue factors as entered.', {
          text: ok ? 'BEARING SUITABLE' : 'BEARING NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Life', okL ? 'pass' : 'fail', `${q(Lh, 'h', 0)} against ${q(v.Lreq, 'h', 0)}.`), check('Static safety', okS ? 'pass' : 'fail', `${q(s0, '', 2)} against ${q(v.s0, '', 2)}.`), check('Speed', okN ? 'pass' : 'fail', `${q(v.n, 'rpm', 0)} against ${q(v.nlim, 'rpm', 0)}.`)],
        });
    },
    "fillet-weld-joint-design": (v) => {
      const throat = v.F * 1000 / (v.L * v.tau), legReq = throat / Math.SQRT1_2, leg = Math.ceil(Math.max(legReq, v.amin) - 1e-9), util = legReq / leg;
      const mass = leg * leg / 2 * (1 + v.excess / 100) * v.L * v.rho * 1e-9, arc = mass / v.dep, labour = arc / (v.of / 100), filler = mass / (v.eff / 100), cost = labour * v.rate + filler * v.wire;
      return output({ throat, legReq, leg, util, mass, arc, labour, cost }, 'Leg size used (mm)', leg,
        [m('Required throat', q(throat, 'mm', 2)), m('Required leg', q(legReq, 'mm', 2)), m('Leg used', q(leg, 'mm', 0)), m('Strength utilisation', q(util * 100, '%', 0)), m('Weld metal', q(mass, 'kg', 3)), m('Arc time / welder time', `${q(arc * 60, '', 1)} / ${q(labour * 60, 'min', 1)}`), m('Weld cost', money(cost))],
        'Fillet weld size and cost.', 'Throat shear; cost from deposition.', {
          checks: [check('Leg against plate', leg <= v.t ? 'pass' : 'fail', leg <= v.t ? 'The leg fits the thinner plate.' : 'The leg exceeds the thinner plate: lengthen the weld or use a groove weld.'), check('Over-welding', util >= 0.6 ? 'pass' : 'warn', util >= 0.6 ? 'Weld size is matched to the load.' : 'The minimum size governs; the weld is lightly loaded.'), check('Welding code', 'verify', 'Confirm size, length and allowable stress against the applicable code.')],
        });
    },
    "cam-follower-design": (v) => {
      const w = 2 * PI * v.rpm / 60, b = rad(v.beta), h = v.h, Rp = v.Rb + v.Rr;
      const f = (x) => {
        if (v.law === 'shm') return [h / 2 * (1 - Math.cos(PI * x)), PI * h / (2 * b) * Math.sin(PI * x), PI * PI * h / (2 * b * b) * Math.cos(PI * x)];
        if (v.law === 'cyc') return [h * (x - Math.sin(2 * PI * x) / (2 * PI)), h / b * (1 - Math.cos(2 * PI * x)), 2 * PI * h / (b * b) * Math.sin(2 * PI * x)];
        return x < 0.5 ? [2 * h * x * x, 4 * h * x / b, 4 * h / (b * b)] : [h * (1 - 2 * (1 - x) ** 2), 4 * h * (1 - x) / b, -4 * h / (b * b)];
      };
      let vmax = 0, amax = 0, pa = 0, Nmin = Infinity, need = 0;
      for (let i = 0; i <= 2000; i++) { const [y, y1, y2] = f(i / 2000), vel = y1 * w / 1000, acc = y2 * w * w / 1000; vmax = Math.max(vmax, Math.abs(vel)); amax = Math.max(amax, Math.abs(acc)); pa = Math.max(pa, deg(Math.atan(y1 / (Rp + y)))); const Nc = v.F0 + v.k * y + v.Fext + v.mf * acc; Nmin = Math.min(Nmin, Nc); need = Math.max(need, -v.mf * acc - v.Fext - v.k * y); }
      const F0req = Math.max(0, need) * v.margin, okC = Nmin > 0 && v.F0 >= F0req, okP = pa <= v.limit;
      return output({ vmax, amax, pa, Nmin, F0req }, 'Spring preload needed (N)', F0req,
        [m('Peak follower velocity', q(vmax, 'm/s', 3)), m('Peak acceleration', q(amax, 'm/s²', 1)), m('Maximum pressure angle', q(pa, '°', 2)), m('Minimum contact force', q(Nmin, 'N', 1)), m('Preload needed (with margin)', q(F0req, 'N', 1)), m('Spring force at full lift', q(v.F0 + v.k * h, 'N', 1))],
        'Cam and follower design check.', 'Rigid follower, symmetric return.', {
          text: okC && okP ? 'CAM DESIGN ADEQUATE' : 'CAM DESIGN NOT ADEQUATE', tone: okC && okP ? 'good' : 'bad',
          checks: [check('Follower contact', okC ? 'pass' : 'fail', okC ? `Contact force stays above ${q(Nmin, 'N', 1)}.` : Nmin <= 0 ? 'The follower would leave the cam: raise preload or spring rate, or slow the cam.' : `Preload below the ${q(F0req, 'N', 0)} needed with the margin.`), check('Pressure angle', okP ? 'pass' : 'fail', `${q(pa, '°', 1)} against ${q(v.limit, '°', 0)}.`)],
        });
    },
    "clutch-engagement-design": (v) => {
      if (v.Di >= v.Do) return invalid('The inside diameter must be smaller than the outside diameter.');
      const w = 2 * PI * v.n / 60, Treq = v.J * w / v.t + v.TL, Td = v.SF * Treq, F = 4 * Td * 1000 / (v.mu * v.faces * (v.Do + v.Di)), ri = v.Di / 2, ro = v.Do / 2, pmax = F / (2 * PI * ri * (ro - ri));
      const ts = v.J * w / (Td - v.TL), E = Td * w * w * v.J / (2 * (Td - v.TL)), dT = E / (v.mass * v.cp), Pavg = E * v.eph / 3600, ok = pmax <= v.pall;
      return output({ Treq, Td, F, pmax, ts, E, dT, Pavg }, 'Clamp force (N)', F,
        [m('Torque to start in time', q(Treq, 'N·m', 1)), m('Design torque', q(Td, 'N·m', 1)), m('Clamp force', q(F / 1000, 'kN', 2)), m('Peak lining pressure', q(pmax, 'MPa', 3)), m('Slip time at design torque', q(ts, 's', 3)), m('Energy per engagement', q(E / 1000, 'kJ', 2)), m('Temperature rise per engagement', q(dT, 'K', 1)), m('Average heat', q(Pavg, 'W', 0))],
        'Friction clutch engagement design.', 'Uniform wear, constant driving speed.', {
          text: ok ? 'CLUTCH ADEQUATE' : 'LINING OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Lining pressure', ok ? 'pass' : 'fail', `${q(pmax, 'MPa', 2)} against ${q(v.pall, 'MPa', 2)}.`), check('Temperature rise', dT <= 50 ? 'pass' : 'warn', dT <= 50 ? 'Moderate temperature rise per start.' : 'Large rise per start: add plate mass or reduce slip speed.')],
        });
    },
    "screw-jack-design": (v) => {
      const Wn = v.W * 1000, d2 = v.d - v.p / 2, d3 = v.d - v.p, l = v.starts * v.p, sec = 1 / Math.cos(rad(v.flank)); if (d3 <= 0) return invalid('The pitch is too coarse for this diameter.');
      const Tc = Wn * v.muc * v.dc / 2, Tth = Wn * d2 / 2 * (l + PI * v.mu * d2 * sec) / (PI * d2 - v.mu * l * sec), Tl = Wn * d2 / 2 * (PI * v.mu * d2 * sec - l) / (PI * d2 + v.mu * l * sec) + Tc;
      if (PI * d2 - v.mu * l * sec <= 0) return invalid('The lead is too steep for this friction.');
      const Tr = (Tth + Tc) / 1000, eff = Wn * l / (2 * PI * (Tth + Tc)) * 100, lock = PI * v.mu * d2 * sec > l, Fl = (Tth + Tc) / v.R;
      const nthr = v.Ln / v.p, pb = Wn / (PI * d2 * (v.p / 2) * nthr), A3 = PI * d3 * d3 / 4, sd = Wn / A3, tt = 16 * Tth / (PI * d3 ** 3), svm = Math.sqrt(sd * sd + 3 * tt * tt), I = PI * d3 ** 4 / 64, Pcr = PI * PI * v.E * 1000 * I / (v.Kb * v.Lb) ** 2, nb = Pcr / Wn;
      const ok = lock && pb <= v.pall && svm <= v.Sy / 1.5 && nb >= 3;
      return output({ d2, d3, Tr, Tl: Tl / 1000, eff, Fl, pb, svm, nb }, 'Raising torque (N·m)', Tr,
        [m('Raising torque', q(Tr, 'N·m', 2)), m('Lowering torque', q(Tl / 1000, 'N·m', 2)), m('Efficiency', q(eff, '%', 1)), m('Self-locking', lock ? 'Yes' : 'No — the load will run down'), m('Force at the lever', q(Fl, 'N', 0)), m('Nut bearing pressure', q(pb, 'MPa', 2)), m('Screw root stress (von Mises)', q(svm, 'MPa', 0)), m('Buckling factor', q(nb, '', 2))],
        'Screw jack design check.', 'Approximate thread diameters.', {
          text: ok ? 'SCREW DESIGN ADEQUATE' : 'SCREW DESIGN NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Self-locking', lock ? 'pass' : 'fail', lock ? 'The load holds without a brake.' : 'Not self-locking: fit a brake or ratchet.'), check('Nut pressure', pb <= v.pall ? 'pass' : 'fail', `${q(pb, 'MPa', 1)} against ${q(v.pall, 'MPa', 1)}; lengthen the nut if needed.`), check('Screw stress', svm <= v.Sy / 1.5 ? 'pass' : 'fail', `${q(svm, 'MPa', 0)} against ${q(v.Sy / 1.5, 'MPa', 0)} (yield ÷ 1.5).`), check('Buckling', nb >= 3 ? 'pass' : 'fail', `Factor ${q(nb, '', 2)}; 3 or more is usual for jacks.`), check('Lever effort', Fl <= 250 ? 'pass' : 'warn', Fl <= 250 ? 'Comfortable hand effort.' : 'More than about 250 N is hard to apply by hand: use a longer lever or gearing.')],
        });
    },
    "pump-system-design": (v) => {
      const g = 9.80665, Qs = v.Q / 60000, dm = v.d / 1000, A = PI * dm * dm / 4, vel = Qs / A, nu = v.nu * 1e-6, Re = vel * dm / nu;
      let f; if (Re < 2300) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 60; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * dm) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const vh = vel * vel / (2 * g), hf = (f * v.L / dm + v.K) * vh, H = v.dz + v.dp * 1e5 / (v.rho * g) + hf, Ph = v.rho * g * Qs * H / 1000, Ps = Ph / (v.eta / 100), Pmotor = Ps * (1 + v.marg / 100);
      const hfs = (f * v.Ls / dm + v.Ks) * vh, npsha = (v.ps - v.pv) * 1e5 / (v.rho * g) + v.zs - hfs, okN = npsha >= v.npshr + 0.5, okV = vel >= 0.5 && vel <= 3;
      return output({ vel, Re, f, hf, H, Ph, Ps, Pmotor, npsha }, 'Total head (m)', H,
        [m('Pipe velocity', q(vel, 'm/s', 2)), m('Reynolds number', q(Re, '', 0)), m('Friction factor', q(f, '', 5)), m('Friction and fitting losses', q(hf, 'm', 2)), m('Total head', q(H, 'm', 2)), m('Hydraulic / shaft power', `${q(Ph, '', 2)} / ${q(Ps, 'kW', 2)}`), m('Motor size with margin', q(Pmotor, 'kW', 2)), m('NPSH available / required', `${q(npsha, '', 2)} / ${q(v.npshr, 'm', 2)}`)],
        'Pumping system design.', 'Steady flow, single pipe size.', {
          text: okN ? 'SUCTION ADEQUATE' : 'CAVITATION RISK', tone: okN ? 'good' : 'bad',
          checks: [check('NPSH margin', okN ? 'pass' : 'fail', `${q(npsha - v.npshr, 'm', 2)} margin; keep at least 0.5 m (more for hot or volatile liquids).`), check('Velocity', okV ? 'pass' : 'warn', okV ? 'Velocity in the usual 0.5–3 m/s range.' : 'Outside 0.5–3 m/s: resize the pipe for losses, noise or settling.')],
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
