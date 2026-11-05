// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook39). SI units are explicit at each boundary.
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
    "sine-bar-setup": (v) => {
      const th = rad(v.angle), Hh = v.L * Math.sin(th), stack = Math.round(Hh / v.res) * v.res, thSet = Math.asin(Math.min(stack / v.L, 1)), errR = deg(thSet - th) * 3600, perUm = deg(0.001 / (v.L * Math.cos(th))) * 3600, errTot = Math.abs(errR) + v.tolS * perUm, ok = errTot <= v.angTol;
      return output({ height: Hh, stack, angSet: deg(thSet), errR, perUm, errTot }, 'Gauge-block stack (mm)', stack,
        [m('Exact height difference', q(Hh, 'mm', 5)), m('Stack to build', q(stack, 'mm', 4)), m('Angle set by the stack', q(deg(thSet), '°', 5)), m('Rounding error', q(errR, '″', 2)), m('Angle change per µm of height', q(perUm, '″', 3)), m('Total set-up error', q(errTot, '″', 2))],
        'Sine-bar set-up.', 'Bar, rollers and plate taken as perfect.', {
          text: ok ? 'SET-UP ADEQUATE' : 'SET-UP TOO COARSE', tone: ok ? 'good' : 'bad',
          checks: [check('Angle error', ok ? 'pass' : 'fail', `${q(errTot, '″', 2)} against ±${q(v.angTol, '″', 1)}.`), check('Angle range', v.angle <= 45 ? 'pass' : 'warn', v.angle <= 45 ? 'At or below 45°.' : 'Above 45°: set the complement and use an angle plate, or a longer bar.'), check('Stack', 'verify', 'Build the stack with the fewest blocks (see the gauge block stack tool) and wring them clean.')],
        });
    },
    "internal-taper-inspection": (v) => {
      const R1 = v.d1 / 2, R2 = v.d2 / 2, Hd = v.h1 - v.h2, dR = R2 - R1;
      if (dR <= 0) return invalid('The large ball must be bigger than the small ball.');
      if (Hd <= dR) return invalid('The small ball must sit deeper by more than the difference in radii.');
      const s = dR / (Hd - dR), half = Math.asin(s), angle = 2 * deg(half), taper = 2 * Math.tan(half), top = 2 * Math.tan(half) * (R2 / s + R2 + v.h2), Hexp = dR / Math.sin(rad(v.angN / 2)) + dR;
      const okA = Math.abs(angle - v.angN) <= v.angT, okD = Math.abs(top - v.topN) <= v.topT, ok = okA && okD;
      return output({ angle, taper, top, Hd, Hexp }, 'Included angle (°)', angle,
        [m('Included angle', q(angle, '°', 4)), m('Deviation from nominal', q(angle - v.angN, '°', 4)), m('Diametral taper', q(taper, 'mm/mm', 5)), m('Diameter at the top face', q(top, 'mm', 4)), m('Depth difference measured / expected', `${q(Hd, '', 3)} / ${q(Hexp, 'mm', 3)}`)],
        'Internal taper inspection.', 'Straight conical bore.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Angle', okA ? 'pass' : 'fail', `${q(angle - v.angN, '°', 4)} against ±${q(v.angT, '°', 3)}.`), check('Top diameter', okD ? 'pass' : 'fail', `${q(top - v.topN, 'mm', 4)} against ±${q(v.topT, 'mm', 3)}.`)],
        });
    },
    "thread-milling-plan": (v) => {
      const int = v.type === 'int', pathD = int ? v.D - v.dc : v.D + v.dc;
      if (pathD <= 0) return invalid('The cutter is too large for this internal thread.');
      const n0 = 1000 * v.vc / (PI * v.dc), n = Math.min(n0, v.nmax), fe = n * v.z * v.fz, fc = fe * pathD / v.D, depth = (int ? 0.5413 : 0.6134) * v.P, passes = Math.ceil(depth / v.apMax - 1e-9);
      const revs = v.L / v.P * passes, helix = Math.sqrt((PI * pathD) ** 2 + v.P * v.P), tMill = revs * helix / fc, tPer = tMill + v.approach / 60, tBatch = tPer * v.holes;
      const okC = !int || v.dc <= 0.75 * v.D, okN = n0 <= v.nmax, ok = okC;
      return output({ n, fe, fc, pathD, depth, passes, revs, tMill, tPer, tBatch }, 'Programmed centre feed (mm/min)', fc,
        [m('Spindle speed', `${q(n, 'rpm', 0)}${okN ? '' : ' (held to the machine maximum)'}`), m('Feed at the cutting edge', q(fe, 'mm/min', 0)), m('Tool-centre path diameter', q(pathD, 'mm', 3)), m('Programmed centre feed', q(fc, 'mm/min', 0)), m('Thread depth / radial passes', `${q(depth, 'mm', 3)} / ${q(passes, '', 0)}`), m('Milling time per thread', q(tMill * 60, 's', 1)), m('Time per thread incl. approach', q(tPer * 60, 's', 1)), m('Batch time', q(tBatch, 'min', 1))],
        'Thread milling plan.', 'Single-form cutter; constant feed.', {
          text: ok ? 'PLAN FEASIBLE' : 'CUTTER TOO LARGE', tone: ok ? 'good' : 'bad',
          checks: [check('Cutter size', okC ? 'pass' : 'fail', int ? (okC ? 'Cutter no more than 75% of the major diameter.' : 'Cutter over 75% of the major diameter: arc entry will gouge; use a smaller cutter.') : 'External thread.'), check('Spindle speed', okN ? 'pass' : 'warn', okN ? 'Cutting speed reached.' : 'Speed held to the machine maximum: the cutter runs below its cutting speed.')],
        });
    },
    "gear-hobbing-plan": (v) => {
      if (v.h >= v.Dh) return invalid('The tooth depth must be smaller than the hob diameter.');
      const n = 1000 * v.Vc / (PI * v.Dh), nw = n * v.starts / v.z, approach = Math.sqrt(v.h * (v.Dh - v.h)), travel = v.b / Math.cos(rad(v.beta)) + approach + v.over;
      const tStack = travel / (v.f * nw), tCut = tStack / v.stack, tFloor = (tStack + v.load) / v.stack;
      const mach = v.rate / 60 * (tFloor + v.setup / v.batch), sharp = v.sharpCost / v.perSharp, hob = v.hobPrice / (v.perSharp * (v.sharps + 1)), cost = mach + sharp + hob, costBatch = cost * v.batch, okN = n <= v.nmax;
      return output({ n, nw, approach, travel, tCut, tFloor, mach, sharp, hob, cost, costBatch }, 'Cost per gear ($)', cost,
        [m('Hob / work speed', `${q(n, 'rpm', 0)} / ${q(nw, 'rpm', 3)}`), m('Total hob travel', q(travel, 'mm', 1)), m('Cutting / floor-to-floor time per gear', `${q(tCut, '', 2)} / ${q(tFloor, 'min', 2)}`), m('Machine and set-up cost', money(mach)), m('Sharpening cost', money(sharp)), m('Hob cost', money(hob)), m('Cost per gear', money(cost)), m('Batch cost', money(costBatch))],
        'Gear hobbing plan.', 'Single pass at constant feed.', {
          text: okN ? 'PLAN FEASIBLE' : 'HOB SPEED TOO HIGH', tone: okN ? 'good' : 'bad',
          table: tbl('Cost per gear', ['Item', 'Cost', 'Share'], [['Machine and set-up', money(mach), q(mach / cost * 100, '%', 0)], ['Sharpening', money(sharp), q(sharp / cost * 100, '%', 0)], ['Hob', money(hob), q(hob / cost * 100, '%', 0)]]),
          checks: [check('Hob speed', okN ? 'pass' : 'fail', `${q(n, 'rpm', 0)} against ${q(v.nmax, 'rpm', 0)}: ${okN ? 'within the machine' : 'reduce the cutting speed or use a larger hob'}.`), check('Hob life', 'verify', 'Confirm gears per sharpening from wear on trial gears.')],
        });
    },
    "accumulator-circuit-sizing": (v) => {
      if (!(v.p0 < v.p1 && v.p1 < v.p2)) return invalid('Pressures must satisfy precharge < minimum < maximum.');
      const V = v.ncyl * PI * (v.bore / 100) ** 2 / 4 * (v.stroke / 100), Qneed = V / v.t1 * 60, pumpV = v.Qp * v.t1 / 60, dV = Math.max(V - pumpV, 0);
      const P0 = v.p0 + ATM, P1 = v.p1 + ATM, P2 = v.p2 + ATM, k = 1 / v.nexp, V0 = dV > 0 ? dV / ((P0 / P1) ** k - (P0 / P2) ** k) : 0, tRe = dV / v.Qp * 60;
      const okR = tRe <= v.t2, okV = v.Vinst >= V0, ok = okR && okV;
      return output({ V, Qneed, pumpV, dV, V0, tRe }, 'Accumulator gas volume needed (L)', V0,
        [m('Stroke volume', q(V, 'L', 3)), m('Flow needed for the stroke time', q(Qneed, 'L/min', 1)), m('Pump delivers during the stroke', q(pumpV, 'L', 3)), m('Accumulator must deliver', q(dV, 'L', 3)), m('Gas volume needed', q(V0, 'L', 2)), m('Recharge time at pump flow', q(tRe, 's', 1))],
        dV > 0 ? 'Accumulator circuit sizing.' : 'The pump alone delivers the stroke in the time.', 'Ideal gas; no line losses.', {
          text: dV === 0 ? 'PUMP ALONE IS ENOUGH' : ok ? 'ACCUMULATOR ADEQUATE' : 'ACCUMULATOR NOT ADEQUATE', tone: dV === 0 || ok ? 'good' : 'bad',
          checks: [check('Size', okV ? 'pass' : 'fail', `${q(v.Vinst, 'L', 1)} offered against ${q(V0, 'L', 2)} needed.`), check('Recharge', okR ? 'pass' : 'fail', `${q(tRe, 's', 1)} to recharge against ${q(v.t2, 's', 1)} available.`), check('Precharge', v.p0 <= 0.9 * v.p1 ? 'pass' : 'warn', `Precharge ${q(100 * v.p0 / v.p1, '%', 0)} of the minimum pressure.`)],
        });
    },
    "cylinder-speed-control": (v) => {
      if (v.rod >= v.bore) return invalid('The rod must be smaller than the bore.');
      const A1 = PI * v.bore * v.bore / 4, A2 = A1 - PI * v.rod * v.rod / 4, Q1 = A1 * v.v * 0.06, Q2 = A2 * v.v * 0.06, p2 = (v.p1 / 10 * A1 - v.F * 1000) / A2 * 10;
      if (p2 <= 0) return invalid('The load is larger than the cap-side force: the cylinder stalls.');
      const vj = Math.sqrt(2 * p2 * 1e5 / v.rho), A0 = Q2 / 60000 / (v.Cd * vj), dOr = Math.sqrt(4 * A0 / PI) * 1000, Ho = p2 * 1e5 * Q2 / 60000, Hr = v.p1 * 1e5 * Math.max(v.Qp - Q1, 0) / 60000, heat = Ho + Hr;
      const okQ = Q1 <= v.Qp, okP = p2 <= v.pRod, ok = okQ && okP;
      return output({ A1, A2, Q1, Q2, p2, dOr, Ho, Hr, heat, ratio: A1 / A2 }, 'Orifice diameter (mm)', dOr,
        [m('Cap / annulus area', `${q(A1, '', 0)} / ${q(A2, 'mm²', 0)}`), m('Cap-side / rod-side flow', `${q(Q1, '', 2)} / ${q(Q2, 'L/min', 2)}`), m('Rod-side pressure', q(p2, 'bar', 1)), m('Orifice diameter', q(dOr, 'mm', 3)), m('Heat in the orifice', q(Ho, 'W', 0)), m('Heat over the relief', q(Hr, 'W', 0)), m('Total heat', q(heat, 'W', 0))],
        'Meter-out speed control.', 'Sharp-edged orifice; no line losses.', {
          text: ok ? 'CONTROL ADEQUATE' : 'CONTROL NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Pump flow', okQ ? 'pass' : 'fail', `${q(Q1, 'L/min', 1)} needed against ${q(v.Qp, 'L/min', 1)}.`), check('Rod-side pressure', okP ? 'pass' : 'fail', `${q(p2, 'bar', 0)} against ${q(v.pRod, 'bar', 0)} rating.`), check('Heat', heat > 1000 ? 'warn' : 'pass', heat > 1000 ? 'Over 1 kW of heat: consider a pressure-compensated pump or load-sensing.' : 'Moderate heat.')],
        });
    },
    "pipe-insulation-design": (v) => {
      if (v.Ti <= v.Ta) return invalid('The pipe must be hotter than the ambient air.');
      const r1 = v.D / 2000, calc = (t) => { const r2 = r1 + t / 1000, R = (t > 0 ? Math.log(r2 / r1) / (2 * PI * v.k) : 0) + 1 / (2 * PI * r2 * v.h), qm = (v.Ti - v.Ta) / R; return { q: qm, Ts: v.Ta + qm / (2 * PI * r2 * v.h) }; };
      const solve = (ok) => { if (ok(calc(0))) return 0; let lo = 0, hi = 1000; if (!ok(calc(hi))) return Infinity; for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (ok(calc(mid))) hi = mid; else lo = mid; } return hi; };
      const tS = solve((r) => r.Ts <= v.TsMax), tQ = solve((r) => r.q <= v.qMax), tReq = Math.max(tS, tQ);
      if (!Number.isFinite(tReq)) return invalid('No thickness up to 1 m reaches the targets: check the limits against the ambient temperature.');
      const bare = calc(0), cur = calc(v.t), saving = (bare.q - cur.q) * v.L * v.hours / 1000 * v.price, annual = cur.q * v.L * v.hours / 1000 * v.price, payback = saving > 0 ? v.cost * v.L / saving : Infinity;
      const okS = cur.Ts <= v.TsMax, okQ = cur.q <= v.qMax, ok = okS && okQ;
      return output({ tS, tQ, tReq, q: cur.q, Ts: cur.Ts, qBare: bare.q, annual, saving, payback }, 'Thickness needed (mm)', tReq,
        [m('Thickness for surface temperature / for loss', `${q(tS, '', 1)} / ${q(tQ, 'mm', 1)}`), m('Thickness needed', q(tReq, 'mm', 1)), m('Loss bare / insulated', `${q(bare.q, '', 1)} / ${q(cur.q, 'W/m', 1)}`), m('Surface temperature', q(cur.Ts, '°C', 1)), m('Annual cost of the remaining loss', money(annual)), m('Annual saving against bare pipe', money(saving)), m('Simple payback', Number.isFinite(payback) ? q(payback, 'years', 2) : 'No saving')],
        'Pipe insulation design.', 'Steady state; pipe wall neglected.', {
          text: ok ? 'INSULATION ADEQUATE' : 'INSULATION TOO THIN', tone: ok ? 'good' : 'bad',
          checks: [check('Surface temperature', okS ? 'pass' : 'fail', `${q(cur.Ts, '°C', 1)} against ${q(v.TsMax, '°C', 0)}.`), check('Heat loss', okQ ? 'pass' : 'fail', `${q(cur.q, 'W/m', 1)} against ${q(v.qMax, 'W/m', 0)}.`), check('Jacketing', 'verify', 'Weatherproof outdoor insulation: wet insulation loses most of its value.')],
        });
    },
    "sheet-metal-flat-pattern": (v) => {
      const A = [v.A1, v.A2, v.A3, v.A4], Ls = [v.L1, v.L2, v.L3, v.L4, v.L5]; let nb = 0; while (nb < 4 && A[nb] > 0) nb++;
      const fl = Ls.slice(0, nb + 1);
      if (fl.some((x) => x <= 0)) return invalid('Enter a length for every flange up to the last bend.');
      const rows = [], sb = [];
      let ded = 0;
      for (let i = 0; i < nb; i++) { const th = rad(A[i]), ba = th * (v.R + v.K * v.t), s = (v.R + v.t) * Math.tan(th / 2), d = 2 * s - ba; ded += d; sb.push(s); rows.push([String(i + 1), q(A[i], '°', 1), q(ba, 'mm', 3), q(s, 'mm', 3), q(d, 'mm', 3)]); }
      const need = fl.map((x, i) => (i > 0 ? sb[i - 1] : 0) + (i < nb ? sb[i] : 0));
      if (fl.some((x, i) => x < need[i])) return invalid('A flange is shorter than the setbacks of its bends.');
      const flat = fl.reduce((s, x) => s + x, 0) - ded, okF = nb === 0 || (fl[0] >= v.minFl && fl[nb] >= v.minFl), okR = v.R >= v.rMin * v.t, ok = okF && okR;
      return output({ nb, ded, flat }, 'Flat length (mm)', flat,
        [m('Bends', q(nb, '', 0)), m('Sum of outside flanges', q(fl.reduce((s, x) => s + x, 0), 'mm', 2)), m('Sum of bend deductions', q(ded, 'mm', 3)), m('Flat length', q(flat, 'mm', 2))],
        'Sheet-metal flat pattern.', 'One radius and K-factor for all bends.', {
          text: ok ? 'PATTERN FEASIBLE' : 'CHECK FLANGES OR RADIUS', tone: ok ? 'good' : 'bad',
          ...(nb ? { table: tbl('Bends', ['Bend', 'Angle', 'Allowance', 'Setback', 'Deduction'], rows) } : {}),
          checks: [check('Flanges', okF ? 'pass' : 'fail', okF ? 'End flanges at least the die minimum.' : `An end flange is shorter than ${q(v.minFl, 'mm', 1)} for the die.`), check('Inside radius', okR ? 'pass' : 'fail', `${q(v.R / v.t, '', 2)} × t against ${q(v.rMin, '', 2)} × t.`)],
        });
    },
    "ball-nose-finishing-plan": (v) => {
      const R = v.D / 2, hT = v.hT / 1000; if (v.ap > R) return invalid('The axial engagement must not exceed the ball radius.'); if (hT >= R) return invalid('The scallop target must be less than the ball radius.');
      const sT = 2 * Math.sqrt(2 * R * hT - hT * hT), s = v.step || sT; if (s >= v.D) return invalid('The stepover must be smaller than the cutter diameter.');
      const h = R - Math.sqrt(R * R - (s / 2) ** 2), De = 2 * Math.sqrt(v.ap * (v.D - v.ap)), n0 = 1000 * v.vc / (PI * De), n = Math.min(n0, v.nmax), vcA = PI * De * n / 1000, vf = n * v.z * v.fz, passes = Math.ceil(v.Wy / s - 1e-9), t = passes * v.Lx / vf;
      const okH = h <= hT * (1 + 1e-9), okN = n0 <= v.nmax, ok = okH;
      return output({ sT, s, h: h * 1000, De, n, vcA, vf, passes, t }, 'Finishing time (min)', t,
        [m('Stepover for the target / used', `${q(sT, '', 4)} / ${q(s, 'mm', 4)}`), m('Scallop height', q(h * 1000, 'µm', 2)), m('Effective diameter', q(De, 'mm', 3)), m('Spindle speed', `${q(n, 'rpm', 0)}${okN ? '' : ' (held to the machine maximum)'}`), m('Cutting speed reached', q(vcA, 'm/min', 0)), m('Feed rate', q(vf, 'mm/min', 0)), m('Passes', q(passes, '', 0)), m('Finishing time', q(t, 'min', 1))],
        'Ball-nose finishing plan.', 'Flat surface; constant feed.', {
          text: ok ? 'FINISH MEETS TARGET' : 'SCALLOP TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Scallop', okH ? 'pass' : 'fail', `${q(h * 1000, 'µm', 2)} against ${q(v.hT, 'µm', 1)}.`), check('Spindle speed', okN ? 'pass' : 'warn', okN ? 'Cutting speed reached.' : `Held to ${q(v.nmax, 'rpm', 0)}: the effective cutting speed is ${q(vcA, 'm/min', 0)}.`)],
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
