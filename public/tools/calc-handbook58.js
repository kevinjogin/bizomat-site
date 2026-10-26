// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook58). SI units are explicit at each boundary.
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
    "eccentric-bracket-bolt-check": (v) => {
      const pts = Array.from({ length: v.n }, (_, i) => [v['x' + (i + 1)], v['y' + (i + 1)]]), xc = pts.reduce((s, p) => s + p[0], 0) / v.n, yc = pts.reduce((s, p) => s + p[1], 0) / v.n, J = pts.reduce((s, p) => s + (p[0] - xc) ** 2 + (p[1] - yc) ** 2, 0);
      if (J === 0) return invalid('The bolts must not all be at the same point.');
      const M = (v.lx - xc) * v.Py - (v.ly - yc) * v.Px, rows = pts.map((p, i) => { const fx = v.Px / v.n - M * (p[1] - yc) / J, fy = v.Py / v.n + M * (p[0] - xc) / J; return [i + 1, fx, fy, Math.hypot(fx, fy)]; }), crit = rows.reduce((a, b) => (b[3] > a[3] ? b : a));
      const Fc = crit[3], F = Fc * 1000, tau = F / (Number(v.planes) * PI * v.d * v.d / 4), sb = F / (v.d * v.t), okS = tau <= v.tauAllow, okB = sb <= v.bAllow, ok = okS && okB;
      return output({ xc, yc, J, M, crit: crit[0], Fc, tau, sb }, 'Critical bolt force (kN)', Fc,
        [m('Group centroid', `X ${q(xc, '', 1)}, Y ${q(yc, 'mm', 1)}`), m('Moment about the centroid', q(M / 1000, 'kN·m', 3)), m('Critical bolt / force', `${crit[0]} / ${q(Fc, 'kN', 2)}`), m('Bolt shear stress', q(tau, 'MPa', 1)), m('Plate bearing stress', q(sb, 'MPa', 1))],
        'Eccentric bracket bolt check.', 'Elastic bolt-group method.', {
          text: ok ? 'BOLTS ADEQUATE' : 'BOLTS NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          table: tbl('Bolt forces', ['Bolt', 'X force (kN)', 'Y force (kN)', 'Resultant (kN)'], rows.map((r) => [String(r[0]), q(r[1], '', 2), q(r[2], '', 2), q(r[3], '', 2)])),
          checks: [check('Bolt shear', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauAllow, 'MPa', 0)}.`), check('Plate bearing', okB ? 'pass' : 'fail', `${q(sb, 'MPa', 1)} against ${q(v.bAllow, 'MPa', 0)}.`), check('Edge distance', 'verify', 'Check bolt edge and end distances in the direction of the critical force.')],
        });
    },
    "pulley-shaft-bush-check": (v) => {
      const T = 9549.2966 * v.P / v.rpm, Fe = 2 * T * 1000 / v.Dp, Fs = v.kb * Fe, R1 = Fs * (v.Lb + v.a) / v.Lb, R2 = Fs * v.a / v.Lb, V = PI * v.d * v.rpm / 60000, P1 = R1 / (v.d * v.L), P2 = R2 / (v.d * v.L), PV1 = P1 * V, PV2 = P2 * V;
      const okP = P1 <= v.Pmax, okV = V <= v.Vmax, okPV = PV1 <= v.PVmax, ok = okP && okV && okPV, Lneed = R1 * V / (v.d * v.PVmax);
      return output({ T, Fe, Fs, R1, R2, V, P1, P2, PV1, PV2, Lneed }, 'PV of the near bush (MPa·m/s)', PV1,
        [m('Torque / effective pull', `${q(T, 'N·m', 1)} / ${q(Fe, 'N', 0)}`), m('Shaft load from the belt', q(Fs, 'N', 0)), m('Bush loads: near / far', `${q(R1, '', 0)} / ${q(R2, 'N', 0)}`), m('Sliding speed', q(V, 'm/s', 2)), m('Pressure: near / far', `${q(P1, '', 2)} / ${q(P2, 'MPa', 2)}`), m('PV: near / far', `${q(PV1, '', 2)} / ${q(PV2, 'MPa·m/s', 2)}`), m('Near bush length for the PV limit', q(Lneed, 'mm', 1))],
        'Overhung pulley shaft bush check.', 'Steady belt load; uniform bush pressure.', {
          text: ok ? 'BUSHES ADEQUATE' : 'BUSHES NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Pressure', okP ? 'pass' : 'fail', `${q(P1, 'MPa', 2)} against ${q(v.Pmax, 'MPa', 1)}.`), check('Sliding speed', okV ? 'pass' : 'fail', `${q(V, 'm/s', 2)} against ${q(v.Vmax, 'm/s', 1)}.`), check('PV', okPV ? 'pass' : 'fail', `${q(PV1, 'MPa·m/s', 2)} against ${q(v.PVmax, 'MPa·m/s', 2)}${okPV ? '.' : `: lengthen the bush to ${q(Lneed, 'mm', 0)}.`}`)],
        });
    },
    "torque-tube-end-weld-check": (v) => {
      const round = v.shape === 'round', bm = v.b - v.t, hm = v.h - v.t;
      if (bm <= 0 || (!round && hm <= 0)) return invalid('The wall is too thick for the section size.');
      const Am = round ? PI * bm * bm / 4 : bm * hm, s = round ? PI * bm : 2 * (bm + hm), Tn = v.T * 1000, tau = Tn / (2 * Am * v.t), J = 4 * Am * Am * v.t / s, twist = deg(Tn * v.L / (v.G * 1000 * J)), twPerM = twist / (v.L / 1000);
      const Aw = round ? PI * v.b * v.b / 4 : v.b * v.h, per = round ? PI * v.b : 2 * (v.b + v.h), qf = Tn / (2 * Aw), a = 0.70710678 * v.leg, Fw = qf * per / 1000, tauWeld = qf / a, legReq = qf / (0.70710678 * v.tauW);
      const okT = tau <= v.allow, okTw = twPerM <= v.twMax, okW = tauWeld <= v.tauW, ok = okT && okTw && okW;
      return output({ Am, tau, J, twist, twPerM, Aw, per, qf, Fw, tauWeld, legReq }, 'Tube shear stress (MPa)', tau,
        [m('Tube shear stress', q(tau, 'MPa', 1)), m('Torsional constant', q(J, 'mm⁴', 0)), m('Twist over the length / per metre', `${q(twist, '°', 3)} / ${q(twPerM, '°/m', 3)}`), m('Shear flow at the weld', q(qf, 'N/mm', 1)), m('Weld throat stress', q(tauWeld, 'MPa', 1)), m('Weld leg needed', q(legReq, 'mm', 2))],
        'Torque tube and end weld check.', 'Closed thin walls; pure torque.', {
          text: ok ? 'TUBE AND WELD ADEQUATE' : !okW ? 'WELD TOO SMALL' : 'TUBE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Tube shear', okT ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Twist', okTw ? 'pass' : 'fail', `${q(twPerM, '°/m', 3)} against ${q(v.twMax, '°/m', 2)}.`), check('End weld', okW ? 'pass' : 'fail', `${q(tauWeld, 'MPa', 1)} against ${q(v.tauW, 'MPa', 0)}${okW ? '.' : `: use at least a ${q(legReq, 'mm', 1)} leg.`}`)],
        });
    },
    "arc-segmentation-feed-check": (v) => {
      if (v.tol >= v.R) return invalid('The tolerance must be smaller than the radius.');
      const L = 2 * Math.sqrt(2 * v.R * v.tol - v.tol * v.tol), th = 2 * Math.asin(Math.min(1, L / (2 * v.R))), nSeg = Math.ceil(rad(v.angle) / th - 1e-9), bps = v.feed / (60 * L), fMax = v.rate * 60 * L, fUse = Math.min(v.feed, fMax), arcLen = v.R * rad(v.angle), tArc = arcLen / fUse * 60, ok = bps <= v.rate;
      return output({ L, e: v.tol, th: deg(th), nSeg, bps, fMax, fUse, arcLen, tArc }, 'Blocks per second needed', bps,
        [m('Segment length', q(L, 'mm', 4)), m('Angle per segment / segments', `${q(deg(th), '°', 3)} / ${q(nSeg, '', 0)}`), m('Block rate needed', q(bps, 'blocks/s', 1)), m('Largest feed for the control', q(fMax, 'mm/min', 0)), m('Feed achieved', q(fUse, 'mm/min', 0)), m('Time for the arc', q(tArc, 's', 2))],
        'Arc segmentation and feed check.', 'Constant radius; block rate only.', {
          text: ok ? 'FEED WITHIN BLOCK RATE' : 'BLOCK RATE LIMITS FEED', tone: ok ? 'good' : 'bad',
          checks: [check('Block rate', ok ? 'pass' : 'fail', `${q(bps, 'blocks/s', 1)} against ${q(v.rate, 'blocks/s', 0)}${ok ? '.' : `: the control will run at about ${q(fMax, 'mm/min', 0)}.`}`), check('Arc output', 'verify', 'Output true arcs (G2/G3) where the control and CAM allow: they avoid segmentation entirely.')],
        });
    },
    "involute-spline-design": (v) => {
      const P = v.Pd, Nn = v.Nt, D = Nn / P, cF = Math.min(0.01, Math.max(0.002, 0.001 * D)), sv = v.type === '37fillet' ? (0.5 * PI + 0.1) / P : PI / (2 * P); let Dri, Di, Dre, Do;
      if (v.type === '30flat') { Dri = (Nn + 1.35) / P; Di = (Nn - 1) / P; Dre = (Nn - 1.35) / P; Do = (Nn + 1) / P; }
      else if (v.type === '30major') { Dri = (Nn + 1) / P; Di = (Nn - 1) / P; Dre = (Nn - 1.35) / P; Do = (Nn + 1) / P; }
      else if (v.type === '30fillet') { Dri = (Nn + 1.8) / P; Di = (Nn - 1) / P; Dre = (Nn - (P <= 12 ? 1.8 : 2)) / P; Do = (Nn + 1) / P; }
      else { Dri = (Nn + 1.6) / P; Di = (Nn - 0.8) / P; Dre = (Nn - 1.3) / P; Do = (Nn + 0.8) / P; }
      const mm = 25.4, Dmm = D * mm, Dremm = Dre * mm, hmm = (Do - Di) / 2 * mm, tmm = sv * mm;
      if (v.Dh >= Dremm) return invalid('The bore must be smaller than the root diameter.');
      const Tn = v.T * 1000, sRoot = v.Dh > 0 ? 16 * Tn * Dremm * v.Ka / (PI * (Dremm ** 4 - v.Dh ** 4) * v.Kf) : 16 * Tn * v.Ka / (PI * Dremm ** 3 * v.Kf), kAcc = v.acc === 'good' ? 4 : 6, sPitch = kAcc * Tn * v.Ka * v.Km / (Dmm * Nn * v.Le * tmm * v.Kf), sComp = v.kind === 'flexible' ? 2 * Tn * v.Km * v.Ka / (Dmm * Nn * v.Le * hmm * v.Kw) : 2 * Tn * v.Km * v.Ka / (9 * Dmm * Nn * v.Le * hmm * v.Kf);
      const sMax = Math.max(sRoot, sPitch), okS = sMax <= v.Ss, okC = sComp <= v.Sc, ok = okS && okC;
      return output({ D, Do, Di, Dre, Dri, sv, Dmm, Dremm, hmm, tmm, sRoot, sPitch, sComp, cF }, 'Root shear stress (MPa)', sRoot,
        [m('Pitch diameter', `${q(D, 'in', 4)} (${q(Dmm, 'mm', 2)})`), m('External major / internal minor', `${q(Do, '', 4)} / ${q(Di, 'in', 4)}`), m('External root / internal root', `${q(Dre, '', 4)} / ${q(Dri, 'in', 4)}`), m('Tooth thickness / depth of engagement', `${q(tmm, '', 3)} / ${q(hmm, 'mm', 3)}`), m('Root shear / pitch shear', `${q(sRoot, '', 1)} / ${q(sPitch, 'MPa', 1)}`), m('Tooth compressive stress', q(sComp, 'MPa', 2))],
        'Involute spline design check.', 'Dudley formulas; basic dimensions.', {
          text: ok ? 'SPLINE ADEQUATE' : 'SPLINE OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Shear', okS ? 'pass' : 'fail', `${q(sMax, 'MPa', 1)} against ${q(v.Ss, 'MPa', 0)}.`), check('Compression', okC ? 'pass' : 'fail', `${q(sComp, 'MPa', 2)} against ${q(v.Sc, 'MPa', 0)}.`), check('Fit and tolerance', 'verify', 'Take tolerance classes and inspection limits from ANSI B92.1.')],
        });
    },
    "balance-correction-check": (v) => {
      let ux = 0, uy = 0; for (const i of [1, 2, 3, 4]) { const mr = v['m' + i] * v['r' + i], a = rad(v['a' + i]); ux += mr * Math.cos(a); uy += mr * Math.sin(a); }
      const U = Math.hypot(ux, uy); if (U === 0) return invalid('The masses entered are already in balance (or none were entered).');
      const ang = (deg(Math.atan2(uy, ux)) + 360) % 360, ac = (ang + 180) % 360, mc = U / v.rc, w = 2 * PI * v.rpm / 60, F = U * 1e-6 * w * w, G = Number(v.grade), e = G * 1000 / w, Uper = e * v.mass;
      const mRound = Math.max(v.step, Math.round(mc / v.step) * v.step), Uc = mRound * v.rc, Ures = Math.sqrt(U * U + Uc * Uc - 2 * U * Uc * Math.cos(rad(v.angErr))), need = U > Uper, ok = Ures <= Uper;
      return output({ U, ang, mc, ac, F, e, Uper, mRound, Ures }, 'Residual after correction (g·mm)', Ures,
        [m('Unbalance', `${q(U, 'g·mm', 0)} at ${q(ang, '°', 1)}`), m('Force at speed', q(F, 'N', 1)), m('Correction mass (exact / rounded)', `${q(mc, '', 2)} / ${q(mRound, 'g', 2)} at ${q(ac, '°', 1)}`), m('Permissible residual', `${q(Uper, 'g·mm', 0)} (e = ${q(e, 'µm', 1)})`), m('Residual after correction', q(Ures, 'g·mm', 0))],
        'Single-plane balance correction check.', 'Narrow rotor; single plane.', {
          text: ok ? 'BALANCE GRADE REACHED' : 'GRADE NOT REACHED', tone: ok ? 'good' : 'bad',
          checks: [check('Before correction', need ? 'warn' : 'pass', need ? `${q(U, 'g·mm', 0)} exceeds ${q(Uper, 'g·mm', 0)}: correction needed.` : 'Already within the grade.'), check('After correction', ok ? 'pass' : 'fail', `${q(Ures, 'g·mm', 0)} against ${q(Uper, 'g·mm', 0)}${ok ? '.' : ': place the weight more accurately or use finer weights.'}`), check('Check run', 'verify', 'Confirm with a check run on the balancing machine or in situ.')],
        });
    },
    "bend-feasibility-check": (v) => {
      const Rmin = Math.max(0, v.t * (50 / v.rA - 1)), Rmax = v.t * v.E * 1000 / (2 * v.YS), x = v.R * v.YS / (v.E * 1000 * v.t);
      if (x >= 0.5) return invalid('Radius × yield ÷ (E × thickness) is 0.5 or more: the bend is almost fully elastic.');
      const ratio = 4 * x ** 3 - 3 * x + 1, Rf = v.R / ratio, K = (v.R + v.t / 2) / (Rf + v.t / 2), bendTo = v.angle / K, F = v.k * v.L * v.t * v.t * v.uts / v.V, use = F / 1000 / v.cap;
      const okR = v.R >= Rmin && v.R <= Rmax, okP = use <= 1, vt = v.V / v.t, ok = okR && okP;
      return output({ Rmin, Rmax, Rf, K, bendTo, F, use }, 'Angle to bend to (°)', bendTo,
        [m('Smallest radius without cracking', q(Rmin, 'mm', 2)), m('Largest radius that still yields', q(Rmax, 'mm', 0)), m('Radius after springback', q(Rf, 'mm', 3)), m('Angle to bend to', q(bendTo, '°', 2)), m('Bending force / press use', `${q(F / 1000, 'kN', 1)} / ${q(use * 100, '%', 0)}`)],
        'Bend feasibility check.', 'Air bending; across the grain.', {
          text: ok ? 'BEND FEASIBLE' : !okR ? 'RADIUS OUT OF RANGE' : 'EXCEEDS PRESS CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Radius', okR ? 'pass' : 'fail', `${q(v.R, 'mm', 2)} against ${q(Rmin, '', 2)}–${q(Rmax, 'mm', 0)}.`), check('Press capacity', okP ? 'pass' : 'fail', `${q(F / 1000, 'kN', 1)} against ${q(v.cap, 'kN', 0)}.`), check('Die opening', vt >= 6 && vt <= 12 ? 'pass' : 'warn', `V = ${q(vt, '', 1)} × t; about 6–12 × t is usual for air bending.`)],
        });
    },
    "whitworth-wire-inspection": (v) => {
      const p = 1 / v.n, h = 0.640327 * p, d2 = v.D - h, d1 = v.D - 2 * h;
      if (d1 <= 0) return invalid('Too few threads per inch for this diameter.');
      const A = rad(27.5), best = (p / 2) / Math.cos(A), W = v.W || best, k = W * (1 + 1 / Math.sin(A)) - (p / 2) / Math.tan(A), Mbasic = d2 + k, Mlow = d2 - v.tol + k, E = v.Mmeas - k;
      const B = Math.atan(p / (PI * d2)), An = Math.atan(Math.tan(A) * Math.cos(B)), Wl = (p / 2) * Math.cos(B) / Math.cos(An), Mlead = d2 + Wl * (1 + Math.sin(An)), MsimpleL = d2 - (p / 2) / Math.tan(A) + Wl * (1 + 1 / Math.sin(A)), leadCorr = Mlead - MsimpleL;
      const ok = E >= d2 - v.tol - 1e-9 && E <= d2 + 1e-9;
      return output({ p, h, d2, d1, best, Wused: W, k, Mbasic, Mlow, E, lead: deg(B), Wl, Mlead, MsimpleL, leadCorr }, 'Pitch diameter from the reading (in)', E,
        [m('Thread depth / minor diameter', `${q(h, '', 5)} / ${q(d1, 'in', 4)}`), m('Basic pitch diameter', q(d2, 'in', 4)), m('Wire size used / best', `${q(W, '', 5)} / ${q(best, 'in', 5)}`), m('Reading: basic / lowest allowed', `${q(Mbasic, '', 4)} / ${q(Mlow, 'in', 4)}`), m('Lead angle / effect on the reading', `${q(deg(B), '°', 3)} / ${q(leadCorr, 'in', 6)}`), m('Pitch diameter from the reading', q(E, 'in', 4))],
        'Whitworth thread wire inspection.', 'Wires on the flanks; single start.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch diameter', ok ? 'pass' : 'fail', `${q(E, 'in', 4)} against ${q(d2 - v.tol, '', 4)}–${q(d2, 'in', 4)}${ok ? '.' : E > d2 ? ': oversize.' : ': undersize.'}`), check('Lead angle', Math.abs(leadCorr) < 0.0001 ? 'pass' : 'warn', Math.abs(leadCorr) < 0.0001 ? 'Lead-angle effect negligible.' : 'Apply the lead-angle correction to the readings.')],
        });
    },
    "casting-pattern-plan": (v) => {
      const c = [[v.Lx, v.fx], [v.Ly, v.fy], [v.Lz, v.fz]].map(([L, f]) => L + v.mach * f), p = c.map((x) => x * (1 + v.shrink / 1000)), Vc = c[0] * c[1] * c[2] / 1e6 - v.cores;
      if (Vc <= 0) return invalid('The cores take up the whole casting.');
      const mass = Vc / 1000 * v.rhoM, pour = mass / (v.yld / 100), ok = pour <= v.ladle;
      return output({ Cx: c[0], Cy: c[1], Cz: c[2], Px: p[0], Py: p[1], Pz: p[2], Vc, mass, pour }, 'Metal to pour (kg)', pour,
        [m('Casting dimensions', `${q(c[0], '', 1)} × ${q(c[1], '', 1)} × ${q(c[2], 'mm', 1)}`), m('Pattern dimensions', `${q(p[0], '', 2)} × ${q(p[1], '', 2)} × ${q(p[2], 'mm', 2)}`), m('Casting volume', q(Vc, 'L', 3)), m('Casting mass', q(mass, 'kg', 2)), m('Metal to pour', q(pour, 'kg', 1))],
        'Casting pattern plan.', 'Rectangular block; uniform shrinkage.', {
          text: ok ? 'POUR WITHIN CAPACITY' : 'POUR EXCEEDS CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Capacity', ok ? 'pass' : 'fail', `${q(pour, 'kg', 1)} against ${q(v.ladle, 'kg', 0)}.`), check('Draft and fillets', 'verify', 'Add draft on vertical faces and fillets at corners when making the pattern.')],
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
