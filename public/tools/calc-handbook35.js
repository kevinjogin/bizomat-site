// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook35). SI units are explicit at each boundary.
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
    "torsion-spring-designer": (v) => {
      const C = v.D / v.d; if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const E = v.E * 1000, M = v.F * v.arm, Na = v.Nb + (v.L1 + v.L2) / (3 * PI * v.D), theta = 64 * M * v.D * Na / (E * v.d ** 4), rate = M / theta, tBody = 64 * M * v.D * v.Nb / (E * v.d ** 4);
      const Ki = (4 * C * C - C - 1) / (4 * C * (C - 1)), sigma = Ki * 32 * M / (PI * v.d ** 3), Mmax = v.allow * PI * v.d ** 3 / (32 * Ki), thMax = Mmax / rate;
      const Dw = v.D * v.Nb / (v.Nb + tBody / (2 * PI)), id = Dw - v.d, Lb = v.d * (v.Nb + 1 + tBody / (2 * PI)), okS = sigma <= v.allow, okA = v.arbor === 0 || id >= v.arbor * (1 + v.clr / 100), ok = okS && okA;
      return output({ M, Na, theta, deg: deg(theta), rate, Ki, sigma, Mmax, thMax: deg(thMax), Dw, id, Lb }, 'Bending stress (MPa)', sigma,
        [m('Moment', q(M, 'N·mm', 0)), m('Equivalent active coils', q(Na, '', 3)), m('Angular deflection', q(deg(theta), '°', 1)), m('Rate', `${q(rate, 'N·mm/rad', 1)} (${q(rate * 2 * PI / 360, 'N·mm/°', 3)})`), m('Bending stress', q(sigma, 'MPa', 0)), m('Largest angle at the allowable stress', q(deg(thMax), '°', 1)), m('Wound inside diameter', q(id, 'mm', 2)), m('Wound body length', q(Lb, 'mm', 1))],
        'Torsion spring design.', 'Static stress; load winds the coils tighter.', {
          text: ok ? 'SPRING ADEQUATE' : 'SPRING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Arbor clearance', okA ? 'pass' : 'fail', v.arbor === 0 ? 'No arbor.' : `${q(id, 'mm', 2)} wound inside diameter over a ${q(v.arbor, 'mm', 1)} arbor.`), check('Body length', 'verify', `Leave room for the body to grow to about ${q(Lb, 'mm', 1)}.`)],
        });
    },
    "planetary-gear-set-design": (v) => {
      if ((v.zr - v.zs) <= 0 || (v.zr - v.zs) % 2) return invalid('Ring minus sun teeth must be a positive even number for standard planets.');
      const zp = (v.zr - v.zs) / 2, i = v.mode === 'ring' ? 1 + v.zr / v.zs : v.mode === 'sun' ? 1 + v.zs / v.zr : -v.zr / v.zs, nout = v.nin / i, Tout = v.Tin * Math.abs(i) * v.eff / 100;
      const asm = (v.zs + v.zr) % v.np === 0, adj = (v.zs + zp) * Math.sin(PI / v.np) > zp + 2;
      const ds = v.m * v.zs, dp = v.m * zp, a = v.m * (v.zs + zp) / 2, Ts = v.mode === 'sun' ? v.Tin * v.zs / v.zr : v.Tin;
      const ns = v.mode === 'sun' ? 0 : v.nin, nc = v.mode === 'carrier' ? 0 : nout, nrel = Math.abs(ns - nc), np = nrel * v.zs / zp;
      const Ft = 2 * Ts * 1000 / (ds * v.np) * v.Ks, pin = 2 * Ft, V = PI * ds * nrel / 60000;
      const Kv = { cast: (3.05 + V) / 3.05, cut: (6.1 + V) / 6.1, hobbed: (3.56 + Math.sqrt(V)) / 3.56, ground: Math.sqrt((5.56 + Math.sqrt(V)) / 5.56) }[v.make], sigma = Kv * Ft / (v.b * v.m * v.Y), okS = sigma <= v.allow, ok = asm && adj && okS;
      return output({ zp, i, nout, Tout, ds, dp, a, Ts, nrel, np, Ft, pin, V, Kv, sigma }, 'Sun bending stress (MPa)', sigma,
        [m('Planet teeth', q(zp, '', 0)), m('Ratio / output speed', `${q(i, '', 3)} : 1 / ${q(nout, 'rpm', 1)}`), m('Output torque', q(Tout, 'N·m', 1)), m('Sun / planet pitch diameter', `${q(ds, '', 1)} / ${q(dp, 'mm', 1)}`), m('Centre distance (sun to planet)', q(a, 'mm', 2)), m('Sun torque', q(Ts, 'N·m', 2)), m('Mesh speed relative to the carrier', q(nrel, 'rpm', 1)), m('Planet speed on its pin', q(np, 'rpm', 1)), m('Tangential force per planet', q(Ft, 'N', 0)), m('Planet pin load', q(pin, 'N', 0)), m('Sun bending stress', q(sigma, 'MPa', 1))],
        'Planetary gear set design.', 'Lewis bending; equal planets.', {
          text: ok ? 'GEAR SET ADEQUATE' : 'GEAR SET NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Equal spacing', asm ? 'pass' : 'fail', asm ? 'Planets can be equally spaced.' : `(z_s + z_r) ÷ n_p = ${q((v.zs + v.zr) / v.np, '', 2)} is not whole: change teeth or planet count.`), check('Planet adjacency', adj ? 'pass' : 'fail', adj ? 'Neighbouring planets clear each other.' : 'Planets would collide: fewer planets or a larger sun.'), check('Sun bending', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`)],
        });
    },
    "turning-cut-planner": (v) => {
      const n0 = 1000 * v.vc / (PI * v.D), n = Math.min(n0, v.nmax), vc = PI * v.D * n / 1000, passes = Math.ceil(v.stock / v.ap - 1e-9);
      const Fc = v.kc * v.ap * v.f, Pc = Fc * vc / 60000, Pm = Pc / (v.eta / 100), Tq = Fc * v.D / 2000, Q = vc * v.ap * v.f, Rt = v.f * v.f / (8 * v.r) * 1000, Ra = v.f * v.f / (32 * v.r) * 1000, t = passes * (v.L + v.appr) / (v.f * n);
      const okP = Pm <= v.Pavail, okT = Tq <= v.Tmax, okR = Ra <= v.RaMax, ok = okP && okT && okR;
      return output({ n, vc, passes, Fc, Pc, Pm, T: Tq, Q, Rt, Ra, t }, 'Motor power required (kW)', Pm,
        [m('Spindle speed', `${q(n, 'rpm', 0)}${n < n0 ? ' (held to the machine maximum)' : ''}`), m('Actual cutting speed', q(vc, 'm/min', 0)), m('Passes', q(passes, '', 0)), m('Cutting force', q(Fc, 'N', 0)), m('Power at the motor', q(Pm, 'kW', 2)), m('Spindle torque', q(Tq, 'N·m', 1)), m('Removal rate', q(Q, 'cm³/min', 0)), m('Theoretical R_t / Ra', `${q(Rt, '', 2)} / ${q(Ra, 'µm', 2)}`), m('Cutting time', q(t, 'min', 2))],
        'Turning cut plan.', 'Specific cutting force; theoretical finish.', {
          text: ok ? 'CUT FEASIBLE' : 'CUT NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Spindle power', okP ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pavail, 'kW', 1)}.`), check('Spindle torque', okT ? 'pass' : 'fail', `${q(Tq, 'N·m', 0)} against ${q(v.Tmax, 'N·m', 0)}.`), check('Surface finish', okR ? 'pass' : 'fail', `Ra about ${q(Ra, 'µm', 2)} against ${q(v.RaMax, 'µm', 1)}.`), check('Chip control', 'verify', 'Confirm the feed and depth suit the insert’s chipbreaker.')],
        });
    },
    "flat-belt-drive-design": (v) => {
      if (v.D < v.d) return invalid('Enter the smaller pulley as the small pulley.');
      if (v.C <= (v.D - v.d) / 2) return invalid('The centre distance is too short for these pulleys.');
      const wrap = 180 - 2 * deg(Math.asin((v.D - v.d) / (2 * v.C))), L = 2 * v.C + PI * (v.D + v.d) / 2 + (v.D - v.d) ** 2 / (4 * v.C), vel = PI * v.d * v.rpm / 60000, Fe = v.kW * 1000 * v.SF / vel, e = Math.exp(v.mu * rad(wrap)), cs = v.rho * vel * vel / 1e6;
      if (v.sa <= cs) return invalid('The belt runs so fast that centrifugal stress alone reaches the allowable.');
      const mass = v.rho * v.b * v.t / 1e6, Tc = mass * vel * vel, T2 = Fe / (e - 1) + Tc, T1 = T2 + Fe, t1 = T1 - Tc, t2 = T2 - Tc, shaft = Math.sqrt(t1 * t1 + t2 * t2 - 2 * t1 * t2 * Math.cos(rad(wrap)));
      const bReq = Fe * e / ((e - 1) * v.t * (v.sa - cs)), stress = T1 / (v.b * v.t), okW = v.b >= bReq, okV = vel <= v.vMax, ok = okW && okV;
      return output({ wrap, L, vel, Fe, e, mass, Tc, T1, T2, shaft, bReq, stress }, 'Belt width needed (mm)', bReq,
        [m('Wrap on the small pulley', q(wrap, '°', 1)), m('Belt length', q(L, 'mm', 0)), m('Belt speed', q(vel, 'm/s', 2)), m('Effective pull with service factor', q(Fe, 'N', 0)), m('Tight / slack side tension', `${q(T1, '', 0)} / ${q(T2, 'N', 0)}`), m('Centrifugal tension', q(Tc, 'N', 1)), m('Belt stress at the width chosen', q(stress, 'MPa', 2)), m('Belt width needed', q(bReq, 'mm', 1)), m('Shaft load', q(shaft, 'N', 0))],
        'Flat belt drive design.', 'Belt just transmitting the load.', {
          text: ok ? 'BELT ADEQUATE' : 'BELT NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Belt width', okW ? 'pass' : 'fail', `${q(v.b, 'mm', 0)} chosen against ${q(bReq, 'mm', 1)} needed.`), check('Belt speed', okV ? 'pass' : 'fail', `${q(vel, 'm/s', 1)} against ${q(v.vMax, 'm/s', 0)}.`), check('Wrap', wrap >= 150 ? 'pass' : 'warn', wrap >= 150 ? 'Wrap of at least 150°.' : 'Small wrap: lengthen the centres or add an idler.')],
        });
    },
    "disc-brake-design": (v) => {
      if (v.ro <= v.ri) return invalid('The outer radius must exceed the inner radius.');
      const w = 2 * PI * v.n / 60, Tb = v.J * w / v.ts + (v.dir === 'over' ? v.TL : -v.TL);
      if (Tb <= 0) return invalid('The load alone stops the inertia within the time: no brake torque is needed.');
      const re = (v.basis === 'wear' ? (v.ro + v.ri) / 2 : 2 * (v.ro ** 3 - v.ri ** 3) / (3 * (v.ro ** 2 - v.ri ** 2))) / 1000, F = Tb / (v.mu * re * v.faces), p = F / (v.Apad * 100), E = Tb * w * v.ts / 2, dT = E / (v.md * v.c * 1000), rev = w * v.ts / 2 / (2 * PI);
      const okF = F <= v.Fmax, okP = p <= v.pMax, okT = dT <= v.dTmax, ok = okF && okP && okT;
      return output({ w, Tb, re: re * 1000, F, p, E, dT, rev, KE: v.J * w * w / 2 }, 'Clamp force needed (N)', F,
        [m('Braking torque', q(Tb, 'N·m', 1)), m('Effective friction radius', q(re * 1000, 'mm', 1)), m('Clamp force needed', q(F, 'N', 0)), m('Pad pressure', q(p, 'MPa', 2)), m('Energy per stop', q(E / 1000, 'kJ', 2)), m('Disc temperature rise', q(dT, 'K', 1)), m('Revolutions to stop', q(rev, 'rev', 2))],
        'Disc brake design.', 'Constant friction; heat into the disc.', {
          text: ok ? 'BRAKE ADEQUATE' : 'BRAKE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Clamp force', okF ? 'pass' : 'fail', `${q(F, 'N', 0)} against ${q(v.Fmax, 'N', 0)} available.`), check('Pad pressure', okP ? 'pass' : 'fail', `${q(p, 'MPa', 2)} against ${q(v.pMax, 'MPa', 1)}.`), check('Disc heating', okT ? 'pass' : 'fail', `${q(dT, 'K', 1)} rise against ${q(v.dTmax, 'K', 0)}.`)],
        });
    },
    "cover-plate-design": (v) => {
      const E = v.E * 1000, cl = v.edge === 'clamped', ks = cl ? 3 / 4 : 3 * (3 + v.nu) / 8, kd = cl ? 1 : (5 + v.nu) / (1 + v.nu);
      const tS = v.a * Math.sqrt(ks * v.p / v.allow), tD = Math.cbrt(kd * 12 * (1 - v.nu * v.nu) * v.p * v.a ** 4 / (64 * E * v.dMax)), tReq = Math.max(tS, tD) + v.ca, te = v.t - v.ca;
      if (te <= 0) return invalid('The thickness chosen must exceed the corrosion allowance.');
      const D = E * te ** 3 / (12 * (1 - v.nu * v.nu)), stress = ks * v.p * v.a * v.a / (te * te), defl = kd * v.p * v.a ** 4 / (64 * D), Fend = v.p * PI * v.a * v.a;
      const okS = stress <= v.allow, okD = defl <= v.dMax, ok = okS && okD;
      return output({ tS, tD, tReq, stress, defl, Fend }, 'Thickness needed (mm)', tReq,
        [m('Thickness for stress', q(tS, 'mm', 2)), m('Thickness for deflection', q(tD, 'mm', 2)), m('Thickness needed (incl. allowance)', q(tReq, 'mm', 2)), m('Stress at the thickness chosen', q(stress, 'MPa', 1)), m('Centre deflection at the thickness chosen', q(defl, 'mm', 4)), m('Pressure force on the bolts', q(Fend / 1000, 'kN', 2))],
        'Circular cover plate design.', 'Thin-plate theory.', {
          text: ok ? 'COVER ADEQUATE' : 'COVER TOO THIN', tone: ok ? 'good' : 'bad',
          checks: [check('Stress', okS ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Deflection', okD ? 'pass' : 'fail', `${q(defl, 'mm', 3)} against ${q(v.dMax, 'mm', 3)}.`), check('Thin-plate range', defl <= te / 2 ? 'pass' : 'warn', defl <= te / 2 ? 'Deflection under half the thickness.' : 'Large deflection: thin-plate formulas overestimate stress.'), check('Bolting', 'verify', `Size the bolts for ${q(Fend / 1000, 'kN', 1)} plus gasket seating load.`)],
        });
    },
    "hydraulic-power-unit-sizing": (v) => {
      const ev = v.etaV / 100, em = v.etaM / 100, Vg = v.Q * 1000 / (v.n * ev), Tq = Vg * v.p / (20 * PI * em), Ph = v.p * v.Q / 600, Ps = Ph / (ev * em);
      const V = v.mult * v.Q, A = 6.5 * (V / 1000) ** (2 / 3), diss = v.k * A * v.dT / 1000, heat = Ps * v.loss / 100 * v.duty / 100, cool = Math.max(heat - diss, 0), okM = Ps <= v.Pmot;
      return output({ Vg, T: Tq, Ph, Ps, V, A, diss, heat, cool }, 'Shaft power (kW)', Ps,
        [m('Pump displacement', q(Vg, 'cm³/rev', 1)), m('Drive torque', q(Tq, 'N·m', 1)), m('Hydraulic power', q(Ph, 'kW', 2)), m('Shaft power', q(Ps, 'kW', 2)), m('Reservoir volume', q(V, 'L', 0)), m('Reservoir surface (approx.)', q(A, 'm²', 2)), m('Heat load', q(heat, 'kW', 2)), m('Natural dissipation', q(diss, 'kW', 2)), m('Cooler capacity needed', q(cool, 'kW', 2))],
        'Hydraulic power unit sizing.', 'Estimated heat share; near-cubic reservoir.', {
          text: okM ? 'MOTOR ADEQUATE' : 'MOTOR TOO SMALL', tone: okM ? 'good' : 'bad',
          checks: [check('Motor power', okM ? 'pass' : 'fail', `${q(Ps, 'kW', 2)} needed against ${q(v.Pmot, 'kW', 1)}.`), check('Cooling', cool > 0 ? 'warn' : 'pass', cool > 0 ? `Fit a cooler of at least ${q(cool, 'kW', 2)}.` : 'The reservoir can shed the heat without a cooler.'), check('Pump selection', 'verify', `Choose the next standard displacement at or above ${q(Vg, 'cm³/rev', 1)}.`)],
        });
    },
    "linear-guide-selection": (v) => {
      const W = v.mass * 9.80665, base = W / 4, dx = W * Math.abs(v.x) / (2 * v.L0), dy = W * Math.abs(v.y) / (2 * v.W0), dA = v.mass * v.a * v.h / (2 * v.L0);
      const loads = [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([sx, sy]) => base + sx * dx + sy * dy), Prun = Math.max(...loads), Pacc = Prun + dA, s = v.acc / 100;
      const Pm = Math.cbrt(s * Pacc ** 3 + (1 - s) * Prun ** 3), Lkm = 50 * (v.C * 1000 / (v.fw * Pm)) ** 3, hours = Lkm * 1e6 / (2 * v.stroke * v.cpm * 60), fs0 = v.C0 * 1000 / Pacc;
      const okL = hours >= v.req, okS = fs0 >= v.fs, ok = okL && okS;
      return output({ W, sum: loads.reduce((t, x) => t + x, 0), Pmin: Math.min(...loads), Prun, Pacc, Pm, Lkm, hours, fs0 }, 'Life (h)', hours,
        [m('Carriage loads at constant speed', loads.map((x) => q(x, '', 0)).join(' / ') + ' N'), m('Most loaded carriage, accelerating', q(Pacc, 'N', 0)), m('Mean load (cubic)', q(Pm, 'N', 0)), m('Life', q(Lkm, 'km', 0)), m('Life in hours', q(hours, 'h', 0)), m('Static safety factor', q(fs0, '', 1))],
        'Linear guide selection.', 'Rigid table; equal carriage stiffness.', {
          text: ok ? 'GUIDE ADEQUATE' : 'GUIDE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Life', okL ? 'pass' : 'fail', `${q(hours, 'h', 0)} against ${q(v.req, 'h', 0)}.`), check('Static safety', okS ? 'pass' : 'fail', `${q(fs0, '', 1)} against ${q(v.fs, '', 1)}.`), check('Lift-off', Math.min(...loads) > 0 ? 'pass' : 'warn', Math.min(...loads) > 0 ? 'All carriages stay in compression.' : 'A carriage is pulled upward: check its reverse-radial rating.')],
        });
    },
    "hydraulic-cylinder-structure": (v) => {
      if (v.rod >= v.bore) return invalid('The rod must be smaller than the bore.');
      const P = v.p / 10, ri = v.bore / 2, E = v.E * 1000;
      const lame = (t) => { const ro = ri + t, k = ro * ro - ri * ri, h = P * (ro * ro + ri * ri) / k, sr = -P, sz = P * ri * ri / k, vm = Math.sqrt(0.5 * ((h - sr) ** 2 + (sr - sz) ** 2 + (sz - h) ** 2)); return { h, sr, sz, vm, n: v.Sy / vm }; };
      const b = lame(v.t); let lo = 1e-4, hi = 10 * v.bore; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (lame(mid).n < v.SFb) lo = mid; else hi = mid; }
      if (lame(hi).n < v.SFb) return invalid('No wall thickness gives this safety factor: the pressure is too high for the barrel material.');
      const tMin = hi, dd = 2 * ri * (b.h - v.nu * (b.sr + b.sz)) / E, tcReq = ri * Math.sqrt(0.75 * P / v.sc), scap = 0.75 * P * ri * ri / (v.tc * v.tc), F = P * PI * v.bore * v.bore / 4;
      const A = PI * v.rod * v.rod / 4, I = PI * v.rod ** 4 / 64, r = Math.sqrt(I / A), lam = v.K * v.Lb / r, Cc = PI * Math.sqrt(2 * E / v.SyR), eu = lam >= Cc, scr = eu ? PI * PI * E / (lam * lam) : v.SyR - (v.SyR * lam / (2 * PI)) ** 2 / E, nr = scr * A / F;
      const okB = b.n >= v.SFb, okC = scap <= v.sc, okR = nr >= v.SFr, ok = okB && okC && okR;
      return output({ hoop: b.h, sz: b.sz, vm: b.vm, n: b.n, tMin, dd, tcReq, scap, F, lam, Cc, scr, nr }, 'Rod buckling safety factor', nr,
        [m('Barrel hoop / axial stress at the bore', `${q(b.h, '', 1)} / ${q(b.sz, 'MPa', 1)}`), m('Barrel von Mises / safety factor', `${q(b.vm, 'MPa', 1)} / ${q(b.n, '', 2)}`), m('Least wall for the factor', q(tMin, 'mm', 2)), m('Bore expansion (diameter)', q(dd * 1000, 'µm', 1)), m('End cap thickness needed', q(tcReq, 'mm', 1)), m('End cap stress', q(scap, 'MPa', 1)), m('Push force', q(F / 1000, 'kN', 1)), m('Rod slenderness / mode', `${q(lam, '', 1)} / ${eu ? 'Euler' : 'Johnson'}`), m('Rod buckling safety factor', q(nr, '', 2))],
        'Hydraulic cylinder structural check.', 'Lamé barrel; clamped cap; concentric rod load.', {
          text: ok ? 'CYLINDER ADEQUATE' : 'CYLINDER NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Barrel', okB ? 'pass' : 'fail', `Safety factor ${q(b.n, '', 2)} against ${q(v.SFb, '', 1)}; least wall ${q(tMin, 'mm', 2)}.`), check('End cap', okC ? 'pass' : 'fail', `${q(scap, 'MPa', 1)} against ${q(v.sc, 'MPa', 0)}; needs ${q(tcReq, 'mm', 1)}.`), check('Rod buckling', okR ? 'pass' : 'fail', `Safety factor ${q(nr, '', 2)} against ${q(v.SFr, '', 1)}.`), check('Seals', 'verify', `Confirm the piston seal tolerates ${q(dd * 1000, 'µm', 0)} of bore growth.`)],
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
