// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook29). SI units are explicit at each boundary.
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
    "gear-train-ratio-planner": (v) => {
      if (v.zmax <= v.zmin) return invalid('The maximum teeth must exceed the minimum.');
      const gcd = (a, b) => (b ? gcd(b, a % b) : a), list = [];
      const keep = (t) => { list.push(t); list.sort((p, q2) => p.e - q2.e || (v.hunt === 'yes' ? p.h - q2.h : 0) || p.s - q2.s); if (list.length > 5) list.pop(); };
      if (v.stages === '1') {
        if (v.R > v.rmax) return invalid('The ratio exceeds the per-stage limit: use two stages.');
        for (let a = v.zmin; a <= v.zmax; a++) { const b = Math.round(v.R * a); if (b < v.zmin || b > v.zmax) continue; const r = b / a; keep({ z: [a, b], r, e: Math.round(Math.abs(r / v.R - 1) * 1e9), h: gcd(a, b) === 1 ? 0 : 1, s: a + b }); }
      } else {
        for (let a = v.zmin; a <= v.zmax; a++) for (let b = a; b <= v.zmax; b++) {
          const r1 = b / a; if (r1 > v.rmax) break; const r2 = v.R / r1; if (r2 < 1 || r2 > v.rmax) continue;
          for (let c = v.zmin; c <= v.zmax; c++) { const d = Math.round(r2 * c); if (d < v.zmin || d > v.zmax) continue; const r = r1 * d / c; keep({ z: [a, b, c, d], r, e: Math.round(Math.abs(r / v.R - 1) * 1e9), h: (gcd(a, b) === 1 ? 0 : 1) + (gcd(c, d) === 1 ? 0 : 1), s: a + b + c + d }); }
        }
      }
      if (!list.length) return invalid('No combination fits these limits: widen the tooth range or the stage ratio limit.');
      const best = list[0], fmtT = (t) => (t.z.length === 2 ? `${t.z[0]}/${t.z[1]}` : `${t.z[0]}/${t.z[1]} × ${t.z[2]}/${t.z[3]}`), err = (best.r / v.R - 1) * 100;
      return output({ ratio: best.r, err, nout: v.nin / best.r, train: fmtT(best), hunting: best.h === 0 ? 1 : 0 }, 'Actual ratio', best.r,
        [m('Best train (driver/driven)', fmtT(best)), m('Actual ratio', q(best.r, '', 6)), m('Ratio error', q(err, '%', 4)), m('Output speed', q(v.nin / best.r, 'rpm', 3)), m('Hunting-tooth pairs', best.h === 0 ? 'Yes' : 'No')],
        'Gear train tooth numbers.', 'Ratio search within the limits.', {
          table: tbl('Best trains', ['Rank', 'Teeth', 'Ratio', 'Error', 'Hunting'], list.map((t, i) => [String(i + 1), fmtT(t), q(t.r, '', 6), q((t.r / v.R - 1) * 100, '%', 4), t.h === 0 ? 'Yes' : 'No'])),
        });
    },
    "gearbox-heat-balance": (v) => {
      if (v.Tmax <= v.Tamb) return invalid('The maximum oil temperature must exceed the ambient temperature.');
      const loss = v.P * 1000 * (1 - v.eff / 100), hA = v.h * v.A, Teq = v.Tamb + loss / hA, Plim = hA * (v.Tmax - v.Tamb) / (1 - v.eff / 100) / 1000, duty = Math.max(0, loss - hA * (v.Tmax - v.Tamb)), flow = duty / (v.rho * v.cp * 1000 * v.dT) * 60000, ok = Teq <= v.Tmax;
      return output({ loss, Teq, Plim, duty, flow }, 'Equilibrium oil temperature (°C)', Teq,
        [m('Heat generated', q(loss / 1000, 'kW', 3)), m('Surface dissipation per kelvin', q(hA, 'W/K', 1)), m('Equilibrium oil temperature', q(Teq, '°C', 1)), m('Thermal power limit (no cooler)', q(Plim, 'kW', 2)), m('Cooler duty needed', q(duty / 1000, 'kW', 3)), m('Oil flow through the cooler', q(flow, 'L/min', 2))],
        v.mode === 'gear' ? 'Gearbox heat balance.' : 'Hydraulic unit heat balance.', 'Steady-state surface dissipation.', {
          text: ok ? 'NO COOLER NEEDED' : 'COOLER REQUIRED', tone: ok ? 'good' : 'bad',
          checks: [check('Oil temperature', ok ? 'pass' : 'fail', `${q(Teq, '°C', 1)} against ${q(v.Tmax, '°C', 0)}.`), check('Maker rating', 'verify', 'Compare with the unit maker’s thermal rating for the mounting and ambient conditions.')],
        });
    },
    "tool-deflection-cut-limit": (v) => {
      const mill = v.type === 'mill', Ft = mill ? v.ae * v.ap * v.fz * v.z * v.kc / (PI * v.D) : v.ab * v.f * v.kc, F = Ft * Math.sqrt(1 + v.ratio ** 2);
      if (mill && v.ae > v.D) return invalid('The radial width cannot exceed the cutter diameter.');
      const I = PI * (v.k * v.D) ** 4 / 64, delta = F * v.L ** 3 / (3 * v.E * 1000 * I), depth = mill ? v.ap : v.ab, depthMax = depth * v.allow / delta, LD = v.L / v.D, ok = delta <= v.allow;
      return output({ Ft, F, delta, depthMax, LD }, 'Tool deflection (mm)', delta,
        [m('Tangential force', q(Ft, 'N', 1)), m('Resultant deflecting force', q(F, 'N', 1)), m('Tool deflection', q(delta * 1000, 'µm', 1)), m('Overhang ÷ diameter', q(LD, '', 2)), m(mill ? 'Largest axial depth for the allowance' : 'Largest depth of cut for the allowance', q(depthMax, 'mm', 2))],
        'Tool deflection under the cut.', 'Cantilever tool, average force.', {
          text: ok ? 'DEFLECTION WITHIN ALLOWANCE' : 'DEFLECTION TOO LARGE', tone: ok ? 'good' : 'bad',
          checks: [check('Deflection', ok ? 'pass' : 'fail', `${q(delta * 1000, 'µm', 1)} against ${q(v.allow * 1000, 'µm', 0)}.`), check('Overhang', LD <= 4 ? 'pass' : LD <= 6 ? 'warn' : 'fail', `L ÷ D = ${q(LD, '', 1)}; above about 4 (steel) or 6 (carbide) chatter becomes likely.`)],
        });
    },
    "sheet-metal-part-cost": (v) => {
      const th = rad(v.ang), BA = th * (v.R + v.k * v.t), SB = (v.R + v.t) * Math.tan(th / 2), BD = 2 * SB - BA, nb = v.c > 0 ? 2 : 1;
      if (v.a < SB || v.b < SB * nb || (v.c > 0 && v.c < SB)) return invalid('Each outside length must exceed the outside setback of its bends.');
      const flat = v.a + v.b + v.c - nb * BD, fit = (L, Wd, bl, bw) => Math.max(0, Math.floor((L - v.gap) / (bl + v.gap))) * Math.max(0, Math.floor((Wd - v.gap) / (bw + v.gap)));
      const parts = Math.max(fit(v.Ls, v.Ws, flat, v.W), fit(v.Ls, v.Ws, v.W, flat)); if (parts < 1) return invalid('The blank does not fit the sheet.');
      const sheetKg = v.Ls * v.Ws * v.t * v.rho * 1e-9, mat = sheetKg * v.price / parts, util = parts * flat * v.W / (v.Ls * v.Ws) * 100, F = v.kf * v.W * v.t * v.t * v.UTS / v.V;
      const lab = v.rate * (nb * v.tb + v.tc) / 3600 + v.rate * v.setup / 60 / v.batch, cost = mat + lab;
      return output({ BA, BD, flat, parts, util, mat, F, lab, cost }, 'Cost per part ($)', cost,
        [m('Bend deduction per bend', q(BD, 'mm', 3)), m('Flat blank', `${q(flat, '', 2)} × ${q(v.W, 'mm', 0)}`), m('Parts per sheet', q(parts, '', 0)), m('Material utilisation', q(util, '%', 1)), m('Material cost per part', money(mat)), m('Bending force per bend', q(F / 1000, 'kN', 1)), m('Labour cost per part', money(lab)), m('Cost per part', money(cost))],
        'Sheet-metal part cost.', 'Grid nesting; K-factor bend allowance.', {
          checks: [check('Material utilisation', util >= 75 ? 'pass' : 'warn', `${q(util, '%', 1)}; try another sheet size or orientation if low.`), check('Die opening', v.V / v.t >= 6 && v.V / v.t <= 12 ? 'pass' : 'warn', `V = ${q(v.V / v.t, '', 1)} × t.`)],
        });
    },
    "tapped-hole-design": (v) => {
      const k = v.tap === 'cut' ? 0.01299 : 0.0068, drill = v.D - k * v.pct * v.P; if (drill <= 0) return invalid('The pitch is too coarse for this diameter.');
      const n = 1 / v.P, d2 = v.D - 0.649519 * v.P, D1 = v.D - 1.082532 * v.P, At = v.Sub > 1240 ? PI * (d2 / 2 - 0.16238 * v.P) ** 2 : PI / 4 * (v.D - 0.938194 * v.P) ** 2;
      const ext = PI * D1 * (0.5 + 0.57735 * n * (d2 - D1)), int = PI * v.D * (0.5 + 0.57735 * n * (v.D - d2)), Le = 2 * At / ext, J = ext * v.Sub / (int * v.Sun), Lreq = J > 1 ? J * Le : Le;
      const thread = Lreq + v.chamfer * v.P, pointLen = drill / (2 * Math.tan(rad(v.point / 2))), drillDepth = thread + v.extra + pointLen, ratio = Lreq / v.D;
      return output({ drill, Le, J, Lreq, thread, drillDepth }, 'Engagement needed (mm)', Lreq,
        [m('Tap drill', q(drill, 'mm', 3)), m('Engagement for the screw thread', q(Le, 'mm', 2)), m('Strength ratio J', q(J, '', 3)), m('Engagement needed', `${q(Lreq, 'mm', 2)} (${q(ratio, '', 2)} × D)`), m('Full-thread depth', q(thread, 'mm', 2)), m('Drill depth (to the point)', q(drillDepth, 'mm', 2))],
        'Tapped hole design.', 'Basic diameters; static strength.', {
          checks: [check('Engagement length', ratio <= 2 ? 'pass' : 'warn', ratio <= 2 ? 'Practical tapped depth.' : 'More than 2 D: consider a thread insert or a through-bolt.'), check('Blind hole', 'verify', 'Confirm there is material below the drill depth, or make the hole through.')],
        });
    },
    "pneumatic-cylinder-sizing": (v) => {
      const pM = v.p / 10, minBore = Math.sqrt(4 * v.F / (PI * pM * v.ratio / 100)), bores = [8, 10, 12, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320], bore = bores.find((b) => b >= minBore);
      if (!bore) return invalid('The load needs more than a 320 mm bore at this pressure.');
      if (v.rod >= bore) return invalid(`The rod must be smaller than the ${bore} mm bore.`);
      const A = area(bore), Ar = area(v.rod), k = (v.p + ATM) / ATM, perCycle = (2 * A - Ar) * v.stroke * k / 1e6, Lpm = perCycle * v.cpm, peak = A * v.v * 1000 * k * 60 / 1e6;
      const Fe = pM * A, Fr = pM * (A - Ar), KE = 0.5 * v.mass * v.v * v.v, cost = Lpm / 1000 * v.spec * v.hours * v.price, okC = KE <= v.cush;
      return output({ minBore, bore, Fe, Fr, perCycle, Lpm, peak, KE, cost }, 'Standard bore (mm)', bore,
        [m('Minimum bore', q(minBore, 'mm', 1)), m('Standard bore chosen', q(bore, 'mm', 0)), m('Extend / retract force', `${q(Fe, '', 0)} / ${q(Fr, 'N', 0)}`), m('Load ratio', q(v.F / Fe * 100, '%', 0)), m('Air per cycle (as free air)', q(perCycle, 'L', 3)), m('Average consumption', q(Lpm, 'L/min', 1)), m('Peak flow while extending', q(peak, 'L/min', 0)), m('Kinetic energy at end of stroke', q(KE, 'J', 3)), m('Air cost per year', money(cost))],
        'Pneumatic cylinder sizing.', 'Theoretical force; isothermal air use.', {
          checks: [check('Cushioning', okC ? 'pass' : 'fail', okC ? `${q(KE, 'J', 2)} is within the cushion capacity.` : `${q(KE, 'J', 2)} exceeds the ${q(v.cush, 'J', 2)} cushion: add a shock absorber or slow the end of stroke.`), check('Valve and tubing', 'verify', `Size the valve and tubing for the ${q(peak, 'L/min', 0)} peak flow.`)],
        });
    },
    "disc-spring-stack-design": (v) => {
      if (v.Di >= v.De) return invalid('The inside diameter must be smaller than the outside diameter.');
      const smax = v.use / 100 * v.h0, ns = Math.ceil(v.stroke / smax - 1e-9), s = v.stroke / ns;
      const dl = v.De / v.Di, ln = Math.log(dl), K1 = (1 / PI) * ((dl - 1) / dl) ** 2 / ((dl + 1) / (dl - 1) - 2 / ln), K2 = (6 / PI) * ((dl - 1) / ln - 1) / ln, K3 = (3 / PI) * (dl - 1) / ln;
      const c = 4 * v.E * 1000 / (1 - v.nu * v.nu), st = s / v.t, ht = v.h0 / v.t, F1 = c * v.t ** 4 / (K1 * v.De ** 2) * st * ((ht - st) * (ht - st / 2) + 1), sI = -c * v.t ** 2 / (K1 * v.De ** 2) * st * (K2 * (ht - st / 2) + K3);
      const np = Math.ceil(v.F / F1 - 1e-9), Fst = np * F1, L0 = ns * (v.h0 + np * v.t), Ls = ns * np * v.t, ok = Math.abs(sI) <= v.allow;
      return output({ ns, np, s, F1, Fst, L0, Ls, sI }, 'Discs in the stack', ns * np,
        [m('Groups in series / discs per group', `${q(ns, '', 0)} / ${q(np, '', 0)}`), m('Total discs', q(ns * np, '', 0)), m('Deflection per disc', `${q(s, 'mm', 3)} (${q(s / v.h0 * 100, '%', 0)} of h₀)`), m('Force per disc', q(F1, 'N', 0)), m('Stack force at the stroke', q(Fst, 'N', 0)), m('Unloaded / solid stack height', `${q(L0, '', 2)} / ${q(Ls, 'mm', 2)}`), m('Stress at the top inner edge', q(sI, 'MPa', 0))],
        'Disc spring stack design.', 'Almen–László characteristic, no friction.', {
          text: ok ? 'STACK FEASIBLE' : 'DISCS OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Stress', ok ? 'pass' : 'fail', `${q(Math.abs(sI), 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Guiding', ns * np <= 30 ? 'pass' : 'warn', ns * np <= 30 ? 'Stack length is moderate.' : 'Long stack: guide it on a hardened rod or in a bore.')],
        });
    },
    "drilling-cycle-planner": (v) => {
      const n = 1000 * v.vc / (PI * v.D), Pc = v.f * v.vc * v.D * v.kc / 240000, Pm = Pc / (v.eta / 100), Tq = Pc * 30000 / (PI * n), thrust = 0.5 * v.kc * v.D / 2 * v.f * Math.sin(rad(v.point / 2));
      const pointLen = v.D / (2 * Math.tan(rad(v.point / 2))), travel = v.depth + pointLen + v.clear, vf = n * v.f, feedT = travel / vf, pecks = v.peck > 0 ? Math.max(0, Math.ceil(v.depth / v.peck - 1e-9) - 1) : 0;
      const perHole = feedT + pecks * v.retract / 60 + v.pos / 60, total = perHole * v.holes, okP = Pm <= v.Pavail, okT = thrust <= v.Tlim, ok = okP && okT;
      return output({ n, vf, Pc, Pm, Tq, thrust, pecks, perHole, total }, 'Total time (min)', total,
        [m('Spindle speed', q(n, 'rpm', 0)), m('Feed rate', q(vf, 'mm/min', 0)), m('Motor power', q(Pm, 'kW', 2)), m('Torque', q(Tq, 'N·m', 2)), m('Approximate thrust', q(thrust, 'N', 0)), m('Pecks per hole', q(pecks, '', 0)), m('Time per hole', q(perHole * 60, 's', 1)), m('Total time', q(total, 'min', 2))],
        'Drilling cycle plan.', 'Unit-power drilling estimate.', {
          text: ok ? 'DRILLING PLAN FEASIBLE' : 'LIMIT EXCEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Spindle power', okP ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pavail, 'kW', 1)}.`), check('Thrust', okT ? 'pass' : 'fail', `${q(thrust, 'N', 0)} against ${q(v.Tlim, 'N', 0)}.`), check('Hole depth', v.depth / v.D <= 4 || v.peck > 0 ? 'pass' : 'warn', v.depth / v.D <= 4 ? 'Shallow hole.' : 'Deeper than 4 D without pecking: use a through-coolant drill or peck.')],
        });
    },
    "hydraulic-motor-drive": (v) => {
      const Tm = v.TL / (v.i * v.etaG / 100), nm = v.nL * v.i, Vreq = 20 * PI * Tm / (v.dp * v.em / 100), V = v.Vc > 0 ? v.Vc : Vreq, dpNeed = 20 * PI * Tm / (V * v.em / 100);
      const Q = V * nm / (1000 * v.ev / 100), Ph = Q * dpNeed / 600, Pin = Ph / (v.ep / 100), ok = dpNeed <= v.dp;
      return output({ Tm, nm, Vreq, V, dpNeed, Q, Ph, Pin }, 'Displacement needed (cm³/rev)', Vreq,
        [m('Motor torque / speed', `${q(Tm, 'N·m', 1)} / ${q(nm, 'rpm', 0)}`), m('Displacement needed', q(Vreq, 'cm³/rev', 1)), m('Displacement used', q(V, 'cm³/rev', 1)), m('Pressure difference needed', q(dpNeed, 'bar', 1)), m('Flow', q(Q, 'L/min', 2)), m('Hydraulic power', q(Ph, 'kW', 2)), m('Pump input power', q(Pin, 'kW', 2))],
        'Hydraulic motor drive sizing.', 'Running efficiencies.', {
          text: ok ? 'MOTOR ADEQUATE' : 'MOTOR TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Pressure', ok ? 'pass' : 'fail', `${q(dpNeed, 'bar', 1)} needed against ${q(v.dp, 'bar', 0)} available.`), check('Starting torque', 'verify', 'Breakaway efficiency is lower than running; check the motor’s starting torque for the load.')],
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
