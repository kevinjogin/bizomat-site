// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook59). SI units are explicit at each boundary.
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
    "buttress-thread-inspection": (v) => {
      const p = v.p, h = 0.6 * p, H = 0.89064 * p, Dn = v.D + 0.12542 * p, En = v.D - h, Kn = v.D - 2 * h, Ds = v.D - v.G, Es = v.D - h - v.G, Ks = v.D - 1.32542 * p - v.G;
      if (Ks <= 0) return invalid('The pitch is too coarse for this diameter.');
      const A = rad(52), a = rad(7), best = p * Math.cos(a) / (1 + Math.cos(A)), W = v.W || best, k = p / (Math.tan(a) + Math.tan(A - a)) - W * (1 + Math.cos(A / 2 - a) / Math.sin(A / 2));
      const Mmax = Es - k, Mmin = Es - v.tol - k, E = v.Mmeas + k, ok = E >= Es - v.tol - 1e-9 && E <= Es + 1e-9;
      return output({ h, H, Dn, En, Kn, Ds, Es, Ks, best, Wused: W, k, Mmax, Mmin, E }, 'Pitch diameter from the reading (mm)', E,
        [m('Height of engagement / sharp-V height', `${q(h, '', 4)} / ${q(H, 'mm', 4)}`), m('Internal major / pitch / minor', `${q(Dn, '', 3)} / ${q(En, '', 3)} / ${q(Kn, 'mm', 3)}`), m('External major / pitch / minor', `${q(Ds, '', 3)} / ${q(Es, '', 3)} / ${q(Ks, 'mm', 3)}`), m('Wire used / pitch-line size', `${q(W, '', 4)} / ${q(best, 'mm', 4)}`), m('Reading: largest / smallest', `${q(Mmax, '', 4)} / ${q(Mmin, 'mm', 4)}`), m('Pitch diameter from the reading', q(E, 'mm', 4))],
        'Buttress thread wire inspection.', 'Single start; wires on both flanks.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch diameter', ok ? 'pass' : 'fail', `${q(E, 'mm', 4)} against ${q(Es - v.tol, '', 4)}–${q(Es, 'mm', 4)}${ok ? '.' : E > Es ? ': oversize.' : ': undersize.'}`), check('Wire size', Math.abs(W - best) <= 0.1 * best ? 'pass' : 'warn', Math.abs(W - best) <= 0.1 * best ? 'Wires close to the pitch-line size.' : 'Wires well away from the pitch-line size; make sure they touch both flanks.'), check('Load flank', 'verify', 'Check the 7° flank faces the load before fitting.')],
        });
    },
    "unified-tapped-hole-check": (v) => {
      const p = 1 / v.n, E = v.D - 0.649519 * p, minor = v.D - 1.082532 * p, At = 0.7854 * (v.D - 0.9743 * p) ** 2, kd = v.tap === 'cut' ? 0.01299 : 0.0068, drill = v.D - kd * v.pct * p;
      if (minor <= 0 || drill <= 0) return invalid('Too few threads per inch for this diameter.');
      const d = v.D * 25.4, P = 25.4 / v.n, nn = 1 / P, d2 = d - 0.649519 * P, D1 = d - 1.082532 * P, Atm = v.Sub > 1240 ? PI * (d2 / 2 - 0.16238 * P) ** 2 : PI / 4 * (d - 0.938194 * P) ** 2;
      const extShear = PI * D1 * (0.5 + 0.57735 * nn * (d2 - D1)), intShear = PI * nn * d * (0.5 + 0.57735 * nn * (d - d2)), Le = 2 * Atm / extShear, J = (extShear * v.Sub) / (intShear * v.Sun), Lreq = J > 1 ? J * Le : Le, LreqIn = Lreq / 25.4;
      const ok = v.L >= LreqIn - 1e-12, pctOk = v.pct >= 55 && v.pct <= 85;
      return output({ p, E, minor, At, drill, drillMm: drill * 25.4, Atm, Le, J, Lreq, LreqIn, ratio: LreqIn / v.D }, 'Engagement needed (in)', LreqIn,
        [m('Pitch / basic pitch diameter', `${q(p, '', 5)} / ${q(E, 'in', 4)}`), m('Basic minor diameter', q(minor, 'in', 4)), m('Tensile stress area', q(At, 'in²', 4)), m('Tap drill', `${q(drill, 'in', 4)} (${q(drill * 25.4, 'mm', 2)})`), m('Strength ratio J', q(J, '', 3)), m('Engagement needed', `${q(LreqIn, 'in', 3)} (${q(LreqIn / v.D, '× D', 2)})`)],
        J > 1 ? 'The tapped material is weaker: the internal thread governs.' : 'The screw governs; the tapped thread is strong enough.', 'Basic diameters; static tension.', {
          text: ok ? 'ENGAGEMENT ADEQUATE' : 'ENGAGEMENT TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Length of engagement', ok ? 'pass' : 'fail', `${q(v.L, 'in', 3)} against ${q(LreqIn, 'in', 3)} needed.`), check('Thread percentage', pctOk ? 'pass' : 'warn', pctOk ? `${v.pct}% thread.` : `${v.pct}% thread is outside the usual 55–85%: check tap load or stripping strength.`), check('Hole depth', 'verify', 'Drill deeper than the thread to clear the tap lead and chips in blind holes.')],
        });
    },
    "weldment-cost-estimate": (v) => {
      const rows = []; let mass = 0, arc = 0, paidWeld = 0, labour = 0, filler = 0, gas = 0, length = 0;
      for (let i = 1; i <= v.n; i++) {
        const L = v['len' + i], mm = 0.5 * v['leg' + i] ** 2 * (1 + v.excess / 100) * v.rho / 1000, ar = mm / v.dep, pd = ar / (v.of / 100), lab = pd * v.rate, fil = mm / (v.eff / 100) * v.wire, gs = ar * 60 * v.gasFlow / 1000 * v.gasPrice, perM = lab + fil + gs;
        mass += mm * L; arc += ar * L; paidWeld += pd * L; labour += lab * L; filler += fil * L; gas += gs * L; length += L;
        rows.push([String(i), q(v['leg' + i], '', 0), q(L, '', 2), q(mm * L, '', 2), q(pd * L * 60, '', 0), money(perM), money(perM * L)]);
      }
      if (length <= 0) return invalid('Enter a weld length.');
      const fitCost = v.fit * v.rate, paid = paidWeld + v.fit, total = labour + filler + gas + fitCost, ok = total <= v.quote + 1e-9;
      return output({ mass, arc, paidWeld, paid, labour, filler, gas, fitCost, total, length, totalText: money(total) }, 'Welding cost ($)', total,
        [m('Weld length / weld metal', `${q(length, 'm', 2)} / ${q(mass, 'kg', 2)}`), m('Arc time', q(arc, 'h', 2)), m('Paid time (welding + fit-up)', `${q(paidWeld, '', 2)} + ${q(v.fit, 'h', 2)}`), m('Labour (welding / fit-up)', `${money(labour)} / ${money(fitCost)}`), m('Filler / gas', `${money(filler)} / ${money(gas)}`), m('Total', money(total))],
        'Weldment cost estimate.', 'Fillet welds; average process rates.', {
          text: ok ? 'WITHIN QUOTE' : 'OVER QUOTE', tone: ok ? 'good' : 'bad',
          table: tbl('Weld runs', ['Run', 'Leg (mm)', 'Length (m)', 'Weld metal (kg)', 'Paid time (min)', 'Cost per metre', 'Cost'], rows),
          checks: [check('Quote', ok ? 'pass' : 'fail', `${money(total)} against ${money(v.quote)}${ok ? '.' : `: ${money(total - v.quote)} over.`}`), check('Leg sizes', 'verify', 'Check each leg against the size the joint actually needs; oversize welds cost and distort.')],
        });
    },
    "brazed-sleeve-joint-plan": (v) => {
      if (2 * v.t >= v.OD) return invalid('The wall must be less than half the outside diameter.');
      if (v.gapMin > v.gapMax) return invalid('The smallest clearance must not exceed the largest.');
      const w = PI * v.OD, Lreq = v.factor * v.t * v.sm / v.tau, joint = w * v.L * v.tau, tube = PI * (v.OD - v.t) * v.t * v.sm, vol = w * v.L * v.gap / 2, fillerG = vol / 1000 * v.rhoF;
      const okL = v.L >= Lreq - 1e-9, okJ = !v.load || joint >= v.load, okT = !v.load || tube >= v.load, okG = v.gap >= v.gapMin - 1e-12 && v.gap <= v.gapMax + 1e-12, ok = okL && okJ && okT && okG;
      return output({ w, Lreq, ratio: Lreq / v.t, joint, tube, vol, fillerG }, 'Overlap needed (mm)', Lreq,
        [m('Overlap needed', `${q(Lreq, 'mm', 2)} (${q(Lreq / v.t, '× t', 1)})`), m('Joint capacity at the overlap', q(joint / 1000, 'kN', 2)), m('Tube capacity', q(tube / 1000, 'kN', 2)), m('Load', v.load ? q(v.load / 1000, 'kN', 2) : 'None entered'), m('Filler volume / mass', `${q(vol, 'mm³', 0)} / ${q(fillerG, 'g', 2)}`)],
        'Brazed sleeve joint plan.', 'Uniform shear; sound joint.', {
          text: ok ? 'JOINT ADEQUATE' : 'JOINT NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Overlap', okL ? 'pass' : 'fail', `${q(v.L, 'mm', 1)} against ${q(Lreq, 'mm', 1)} needed.`), check('Joint capacity', okJ ? 'pass' : 'fail', v.load ? `${q(joint / 1000, 'kN', 2)} against ${q(v.load / 1000, 'kN', 2)}.` : 'No load entered.'), check('Tube capacity', okT ? 'pass' : 'fail', v.load ? `${q(tube / 1000, 'kN', 2)} against ${q(v.load / 1000, 'kN', 2)}.` : 'No load entered.'), check('Clearance', okG ? 'pass' : 'fail', `${q(v.gap, 'mm', 3)} against ${q(v.gapMin, '', 3)}–${q(v.gapMax, 'mm', 3)}${okG ? '.' : ': the filler will not flow and fill reliably.'}`)],
        });
    },
    "gear-train-output-check": (v) => {
      let ratio = 1, n = 0; const rows = [];
      for (let i = 1; i <= 4; i++) { const a = v['a' + i], b = v['b' + i]; if (!a || !b) continue; ratio *= b / a; n++; rows.push([`Mesh ${i}`, `${a} → ${b}`, q(b / a, '', 4), q(v.nin / ratio, '', 2)]); }
      if (!n) return invalid('Enter the teeth of at least one mesh.');
      const effAll = Math.pow(v.eff / 100, n), nout = v.nin / ratio, Tout = v.Tin * ratio * effAll, err = (nout - v.nreq) / v.nreq * 100, tau = 16 * Tout * 1000 / (PI * v.d ** 3), dReq = Math.cbrt(16 * Tout * 1000 / (PI * v.tauA));
      const okN = Math.abs(err) <= v.tol + 1e-9, okT = Tout >= v.Treq - 1e-9, okS = tau <= v.tauA + 1e-9, ok = okN && okT && okS;
      return output({ ratio, nout, Tout, effAll, err, tau, dReq, meshes: n }, 'Output speed (rpm)', nout,
        [m('Overall ratio', `${q(ratio, '', 4)} : 1`), m('Output speed / error', `${q(nout, 'rpm', 2)} / ${q(err, '%', 2)}`), m('Output direction', n % 2 ? 'Opposite to input' : 'Same as input'), m('Output torque', q(Tout, 'N·m', 2)), m('Overall efficiency', q(100 * effAll, '%', 1)), m('Shaft stress / diameter needed', `${q(tau, 'MPa', 1)} / ${q(dReq, 'mm', 1)}`)],
        'Gear train output check.', 'Steady torque; spur gear meshes.', {
          text: ok ? 'TRAIN MEETS DUTY' : 'TRAIN DOES NOT MEET DUTY', tone: ok ? 'good' : 'bad',
          table: tbl('Meshes', ['Mesh', 'Teeth', 'Ratio', 'Speed after (rpm)'], rows),
          checks: [check('Output speed', okN ? 'pass' : 'fail', `${q(nout, 'rpm', 1)} against ${q(v.nreq, 'rpm', 1)} ± ${q(v.tol, '%', 1)}.`), check('Output torque', okT ? 'pass' : 'fail', `${q(Tout, 'N·m', 1)} against ${q(v.Treq, 'N·m', 1)}.`), check('Output shaft', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauA, 'MPa', 0)}${okS ? '.' : `: use at least ${q(dReq, 'mm', 1)}.`}`)],
        });
    },
    "linear-move-drive-check": (v) => {
      const L = v.distance, V = v.vmax, a = v.accel, trap = L >= V * V / a, t = trap ? L / V + V / a : 2 * Math.sqrt(L / a), peak = trap ? V : Math.sqrt(a * L), ta = peak / a, tc = t - 2 * ta, F = v.mass * a / 1000;
      const Ff = v.mu * v.mass * 9.80665, k = v.lead / 1000 / (2 * PI * v.effD / 100), Tacc = (F + Ff) * k, Trun = Ff * k, Tdec = Math.abs(F - Ff) * k, rpm = peak / v.lead * 60, cycle = 2 * (t + v.dwell);
      const Trms = Math.sqrt(2 * (Tacc ** 2 * ta + Trun ** 2 * Math.max(0, tc) + Tdec ** 2 * ta) / cycle);
      const okN = rpm <= v.nMax + 1e-9, okP = Tacc <= v.Tpk + 1e-12, okR = Trms <= v.Tcont + 1e-12, okC = cycle <= v.cycleReq + 1e-9, ok = okN && okP && okR && okC;
      return output({ t, peak, ta, F, Ff, Tacc, Trun, Tdec, rpm, cycle, Trms }, 'Move time (s)', t,
        [m('Move time / profile', `${q(t, 's', 3)} / ${trap ? 'trapezoidal' : 'triangular'}`), m('Peak speed / motor speed', `${q(peak, 'mm/s', 0)} / ${q(rpm, 'rpm', 0)}`), m('Acceleration / friction force', `${q(F, '', 1)} / ${q(Ff, 'N', 1)}`), m('Torque: accelerating / running / decelerating', `${q(Tacc, '', 3)} / ${q(Trun, '', 3)} / ${q(Tdec, 'N·m', 3)}`), m('RMS torque', q(Trms, 'N·m', 3)), m('Cycle time', q(cycle, 's', 3))],
        'Linear move drive check.', 'Horizontal axis; motor and screw inertia not included.', {
          text: ok ? 'DRIVE ADEQUATE' : 'DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Motor speed', okN ? 'pass' : 'fail', `${q(rpm, 'rpm', 0)} against ${q(v.nMax, 'rpm', 0)}${okN ? '.' : ': use a coarser lead or lower the speed.'}`), check('Peak torque', okP ? 'pass' : 'fail', `${q(Tacc, 'N·m', 3)} against ${q(v.Tpk, 'N·m', 2)}.`), check('RMS torque', okR ? 'pass' : 'fail', `${q(Trms, 'N·m', 3)} against ${q(v.Tcont, 'N·m', 2)}.`), check('Cycle time', okC ? 'pass' : 'fail', `${q(cycle, 's', 2)} against ${q(v.cycleReq, 's', 2)}.`)],
        });
    },
    "plate-lift-plan": (v) => {
      const P = Array.from({ length: v.n }, (_, i) => [v['x' + (i + 1)], v['y' + (i + 1)]]); let A2 = 0, cx = 0, cy = 0, per = 0;
      for (let i = 0; i < v.n; i++) { const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % v.n], c = x1 * y2 - x2 * y1; A2 += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c; per += Math.hypot(x2 - x1, y2 - y1); }
      if (Math.abs(A2) < 1e-9) return invalid('The corners enclose no area.');
      const ABx = v.xB - v.xA, ABy = v.yB - v.yA, AB2 = ABx * ABx + ABy * ABy;
      if (AB2 === 0) return invalid('The two lift points must be apart.');
      const area = Math.abs(A2) / 2; cx /= 3 * A2; cy /= 3 * A2;
      const mass = area / 1e6 * v.t / 1000 * v.rho, W = mass * 9.80665 / 1000, s = ((cx - v.xA) * ABx + (cy - v.yA) * ABy) / AB2, RB = s * W, RA = (1 - s) * W, off = Math.abs((cx - v.xA) * ABy - (cy - v.yA) * ABx) / Math.sqrt(AB2);
      const between = s >= 0 && s <= 1, okA = RA <= v.wll + 1e-12, okB = RB <= v.wll + 1e-12;
      return output({ area, per, cx, cy, mass, W, s, RA, RB, off }, 'Plate mass (kg)', mass,
        [m('Area / perimeter', `${q(area / 1e6, 'm²', 4)} / ${q(per, 'mm', 0)}`), m('Centre of gravity', `X ${q(cx, '', 1)}, Y ${q(cy, 'mm', 1)}`), m('Mass / weight', `${q(mass, 'kg', 1)} / ${q(W, 'kN', 3)}`), m('Load at A / B', `${q(RA, '', 3)} / ${q(RB, 'kN', 3)}`), m('CG offset from the lift line', q(off, 'mm', 0))],
        'Plate lift plan.', 'Uniform flat plate; vertical lift.', {
          text: !between ? 'CG OUTSIDE LIFT POINTS' : okA && okB ? 'LIFT POINTS ADEQUATE' : 'LIFT POINT OVERLOADED', tone: between && okA && okB ? 'good' : 'bad',
          checks: [check('CG between the lift points', between ? 'pass' : 'fail', between ? `${q(100 * s, '%', 0)} of the way from A to B.` : 'The CG falls outside A–B: one point would be in uplift and the plate would tip.'), check('Lift point A', okA ? 'pass' : 'fail', `${q(RA, 'kN', 3)} against ${q(v.wll, 'kN', 2)}.`), check('Lift point B', okB ? 'pass' : 'fail', `${q(RB, 'kN', 3)} against ${q(v.wll, 'kN', 2)}.`), check('Hang', off <= 0.1 * Math.sqrt(AB2) ? 'pass' : 'warn', off <= 0.1 * Math.sqrt(AB2) ? 'The plate hangs nearly level.' : 'The CG is well off the lift line: the plate will hang tilted.')],
        });
    },
    "tapered-pad-footing-check": (v) => {
      if (v.a2 > v.a1 || v.b2 > v.b1) return invalid('The top must not be larger than the base.');
      const A1 = v.a1 * v.b1, A2 = v.a2 * v.b2, Am = ((v.a1 + v.a2) / 2) * ((v.b1 + v.b2) / 2), Vt = v.h * (A1 + 4 * Am + A2) / 6 / 1e9, Vb = A1 * v.hb / 1e9, V = Vt + Vb;
      if (V <= 0) return invalid('Enter a block depth or taper height.');
      const Wf = V * v.rhoC * 9.80665 / 1000, base = A1 / 1e6, qb = (v.P + Wf) / base, Aneed = (v.P + Wf) / v.qa, order = V * (1 + v.waste / 100), ok = qb <= v.qa + 1e-9;
      return output({ Vt, Vb, V, Wf, base, qb, Aneed, order }, 'Bearing pressure (kPa)', qb,
        [m('Taper / block / total volume', `${q(Vt, '', 3)} / ${q(Vb, '', 3)} / ${q(V, 'm³', 3)}`), m('Self-weight', q(Wf, 'kN', 2)), m('Base area', q(base, 'm²', 3)), m('Bearing pressure', q(qb, 'kPa', 1)), m('Base area needed', q(Aneed, 'm²', 3)), m('Concrete to order', q(order, 'm³', 2))],
        'Tapered pad footing check.', 'Concentric load; uniform bearing pressure.', {
          text: ok ? 'BEARING ADEQUATE' : 'BEARING EXCEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Bearing pressure', ok ? 'pass' : 'fail', `${q(qb, 'kPa', 1)} against ${q(v.qa, 'kPa', 0)}${ok ? '.' : `: enlarge the base to at least ${q(Aneed, 'm²', 2)} (allowing for its own extra weight).`}`), check('Structural design', 'verify', 'Check reinforcement, punching shear and cover with the structural engineer.')],
        });
    },
    "bolt-circle-pin-check": (v) => {
      if (v.mode === 'alt' && (v.n % 2 || v.n <= 4)) return invalid('Measurement over alternate plugs applies to an even number of holes greater than 4.');
      if (v.m <= v.d) return invalid('The measurement must exceed the plug diameter.');
      const th = rad(360 / v.n), sn = v.mode === 'alt' ? Math.sin(th) : Math.sin(th / 2), pcdM = (v.m - v.d) / sn, even = v.n % 2 === 0, x = even ? pcdM + v.d : pcdM * Math.cos(th / 4) + v.d;
      const mNom = v.pcd * sn + v.d, mLow = (v.pcd - v.tol) * sn + v.d, mHigh = (v.pcd + v.tol) * sn + v.d, dev = pcdM - v.pcd, ok = Math.abs(dev) <= v.tol + 1e-9;
      return output({ pcdM, x, mNom, mLow, mHigh, dev }, 'Pitch circle diameter from the reading (mm)', pcdM,
        [m('Pitch circle from the reading', q(pcdM, 'mm', 4)), m(even ? 'Across opposite plugs' : 'Across the most widely spaced plugs', q(x, 'mm', 4)), m('Reading at nominal', q(mNom, 'mm', 4)), m('Readings at the limits', `${q(mLow, '', 4)} to ${q(mHigh, 'mm', 4)}`), m('Deviation from nominal', q(dev, 'mm', 4))],
        'Bolt circle pin check.', 'Equally spaced holes; close-fitting plugs.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch circle', ok ? 'pass' : 'fail', `${q(pcdM, 'mm', 4)} against ${q(v.pcd - v.tol, '', 4)}–${q(v.pcd + v.tol, 'mm', 4)}.`), check('Plug fit', 'verify', 'Plug clearance in the holes adds directly to the error.')],
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
