// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook63). SI units are explicit at each boundary.
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
    "gear-tooth-top-land-check": (v) => {
      const p = rad(v.phi), r = v.m * v.z / 2, rb = r * Math.cos(p), s = v.m * (PI / 2 + 2 * v.x * Math.tan(p)), ra = r + v.m * (v.ha + v.x), invP = Math.tan(p) - p;
      if (ra <= rb) return invalid('The tip lies inside the base circle.');
      const pa = Math.acos(rb / ra), invA = Math.tan(pa) - pa, sa = 2 * ra * (s / (2 * r) + invP - invA), target = s / (2 * r) + invP;
      let pp = Math.max(0.01, Math.cbrt(3 * target)); for (let k = 0; k < 60; k++) { const g = Math.tan(pp) - pp - target; pp -= g / Math.tan(pp) ** 2; }
      const rp = rb / Math.cos(pp), xMin = v.ha - v.z * Math.sin(p) ** 2 / 2, okU = v.x >= xMin - 1e-9, okT = sa >= v.saMin * v.m - 1e-9;
      return output({ r, rb, s, ra, invP, phiA: deg(pa), invA, sa, saM: sa / v.m, phiP: deg(pp), rp, xMin }, 'Top land (mm)', sa,
        [m('Pitch / base / tip radius', `${q(r, '', 3)} / ${q(rb, '', 3)} / ${q(ra, 'mm', 3)}`), m('Tooth thickness at the pitch circle', q(s, 'mm', 4)), m('inv φ / inv φ at the tip', `${q(invP, '', 6)} / ${q(invA, '', 6)}`), m('Top land', `${q(sa, 'mm', 3)} (${q(sa / v.m, 'm', 3)})`), m('Pointed at radius', q(rp, 'mm', 3)), m('Least shift against undercut', q(xMin, '', 3))],
        'Gear tooth top land and undercut check.', 'Rack-generated involute teeth.', {
          text: !okU ? 'TEETH UNDERCUT' : okT ? 'TOOTH FORM ADEQUATE' : 'TOP LAND TOO THIN', tone: okU && okT ? 'good' : 'bad',
          checks: [check('Undercut', okU ? 'pass' : 'fail', okU ? `Shift ${q(v.x, '', 3)} is at or above ${q(xMin, '', 3)}.` : `Shift ${q(v.x, '', 3)} is below ${q(xMin, '', 3)}: the root will be undercut.`), check('Top land', okT ? 'pass' : 'fail', `${q(sa, 'mm', 3)} against ${q(v.saMin * v.m, 'mm', 3)}${okT ? '.' : ': reduce the shift or the addendum.'}`), check('Mating gear', 'verify', 'Check centre distance, backlash and contact ratio with the shifted pair.')],
        });
    },
    "relief-valve-spring-check": (v) => {
      const G = v.G * 1000, k = G * v.d ** 4 / (8 * v.D ** 3 * v.Na), C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, Nt = { cg: v.Na + 2, c: v.Na + 2, pg: v.Na + 1, p: v.Na }[v.ends], Ls = (v.ends === 'cg' || v.ends === 'pg' ? Nt : Nt + 1) * v.d, Lf = v.Lw - v.lift;
      if (v.Lw > v.L0) return invalid('The installed length must not exceed the unloaded length.');
      if (Lf < Ls) return invalid(`At full lift the spring would be shorter than solid (${q(Ls, 'mm', 2)}).`);
      const A = PI * v.ds * v.ds / 4, F = k * (v.L0 - v.Lw), Ff = k * (v.L0 - Lf), tau = K * 8 * F * v.D / (PI * v.d ** 3), tauFull = K * 8 * Ff * v.D / (PI * v.d ** 3), pCrack = F / A, pFull = Ff / A, over = pCrack > 0 ? (pFull / pCrack - 1) * 100 : Infinity;
      const okP = Math.abs(pCrack - v.preq) <= v.preq * v.tolP / 100 + 1e-12, okO = over <= v.overMax + 1e-9, okS = tauFull <= v.allow + 1e-9, ok = okP && okO && okS, LwNeed = v.L0 - v.preq * A / k;
      return output({ k, K, A, F, Ff, tau, tauFull, pCrack, pFull, over: Number.isFinite(over) ? over : 0, Ls, LwNeed }, 'Cracking pressure (MPa)', pCrack,
        [m('Spring rate / seat area', `${q(k, 'N/mm', 3)} / ${q(A, 'mm²', 2)}`), m('Installed load / at full lift', `${q(F, '', 1)} / ${q(Ff, 'N', 1)}`), m('Cracking / full-lift pressure', `${q(pCrack, '', 4)} / ${q(pFull, 'MPa', 4)}`), m('Overpressure', Number.isFinite(over) ? q(over, '%', 1) : 'No preload'), m('Spring stress at full lift', q(tauFull, 'MPa', 0)), m('Installed length for the wanted pressure', q(LwNeed, 'mm', 2))],
        'Relief valve spring check.', 'Static balance on the seat area.', {
          text: ok ? 'VALVE SPRING ADEQUATE' : 'VALVE SPRING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Set pressure', okP ? 'pass' : 'fail', `${q(pCrack, 'MPa', 4)} against ${q(v.preq, 'MPa', 3)} ± ${q(v.tolP, '%', 0)}${okP ? '.' : `: shim the spring to ${q(LwNeed, 'mm', 2)} installed length.`}`), check('Overpressure', okO ? 'pass' : 'fail', `${Number.isFinite(over) ? q(over, '%', 1) : 'No preload'} against ${q(v.overMax, '%', 0)}.`), check('Spring stress', okS ? 'pass' : 'fail', `${q(tauFull, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Solid length', 'pass', `${q(Lf - Ls, 'mm', 2)} left before solid at full lift.`)],
        });
    },
    "pipe-support-span-check": (v) => {
      if (2 * v.t >= v.OD) return invalid('The wall must be less than half the outside diameter.');
      const di = v.OD - 2 * v.t, A = PI * (v.OD ** 2 - di ** 2) / 4, I = PI * (v.OD ** 4 - di ** 4) / 64, Z = 2 * I / v.OD, wkg = A * v.rhoP / 1e6 + PI * di * di / 4 * v.rhoF / 1e6 + v.mIns, w = wkg * 9.80665 / 1000, P = w * v.L, EI = v.E * 1000 * I;
      let M, defl;
      if (v.ends === 'ss') { M = w * v.L ** 2 / 8; defl = 5 * w * v.L ** 4 / (384 * EI); }
      else if (v.ends === 'ff') { M = P * v.L / 12; defl = P * v.L ** 3 / (384 * EI); }
      else { M = P * v.L / 8; const xr = (1 + Math.sqrt(33)) / 16, xx = xr * v.L; defl = w * xx * (v.L ** 3 - 3 * v.L * xx * xx + 2 * xx ** 3) / (48 * EI); }
      const stress = M / Z, Ls = v.L * Math.sqrt(v.sA / stress), Ld = v.L * Math.pow(v.dA / defl, 0.25), Lmax = Math.min(Ls, Ld), okS = stress <= v.sA + 1e-9, okD = defl <= v.dA + 1e-12, ok = okS && okD;
      return output({ A, I, Z, wkg, w, P, M, stress, defl, Ls, Ld, Lmax }, 'Longest span (mm)', Lmax,
        [m('Section area / I / Z', `${q(A, 'mm²', 1)} / ${q(I, 'mm⁴', 0)} / ${q(Z, 'mm³', 0)}`), m('Weight per metre (pipe, contents, insulation)', q(wkg, 'kg/m', 2)), m('Bending moment', q(M / 1e6, 'kN·m', 4)), m('Bending stress / sag', `${q(stress, 'MPa', 1)} / ${q(defl, 'mm', 2)}`), m('Longest span: stress / sag', `${q(Ls, '', 0)} / ${q(Ld, 'mm', 0)}`)],
        'Pipe support span check.', 'Uniform load; straight horizontal span.', {
          text: ok ? 'SPAN ADEQUATE' : 'SPAN TOO LONG', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Sag', okD ? 'pass' : 'fail', `${q(defl, 'mm', 2)} against ${q(v.dA, 'mm', 1)}.`), check('Point loads', 'verify', 'Put a support next to valves, flanged fittings and changes of direction.')],
        });
    },
    "cart-push-force-check": (v) => {
      if (v.nShare > v.n) return invalid('The wheels sharing the load cannot exceed the wheels fitted.');
      const W = v.mass * 9.80665, th = rad(v.slope), Wn = W * Math.cos(th), r = v.Dw / 2, Fr = Wn * v.f / r, Fg = W * Math.sin(th), Fa = v.mass * v.acc, Fs = Fr + Fg + Fa, Fk = Fr + Fg, Fw = W / v.nShare;
      const okS = Fs <= v.Fstart + 1e-9, okK = Fk <= v.Fkeep + 1e-9, okW = Fw <= v.wheelRating + 1e-9;
      return output({ W, Fr, Fg, Fa, Fs, Fk, Fw }, 'Starting push (N)', Fs,
        [m('Weight', q(W, 'N', 0)), m('Rolling resistance', q(Fr, 'N', 1)), m('Slope force', q(Fg, 'N', 1)), m('Acceleration force', q(Fa, 'N', 1)), m('Push: start / keep moving', `${q(Fs, '', 1)} / ${q(Fk, 'N', 1)}`), m('Load per wheel', q(Fw, 'N', 0))],
        'Cart push force check.', 'Steady rolling; straight push.', {
          text: !okW ? 'WHEEL OVERLOADED' : okS && okK ? 'PUSH FORCE ACCEPTABLE' : 'TOO HARD TO PUSH', tone: okS && okK && okW ? 'good' : 'bad',
          checks: [check('Starting push', okS ? 'pass' : 'fail', `${q(Fs, 'N', 0)} against ${q(v.Fstart, 'N', 0)}.`), check('Keep-moving push', okK ? 'pass' : 'fail', `${q(Fk, 'N', 0)} against ${q(v.Fkeep, 'N', 0)}.`), check('Wheel load', okW ? 'pass' : 'fail', `${q(Fw, 'N', 0)} against ${q(v.wheelRating, 'N', 0)}.`), check('Stopping', 'verify', 'On a slope, check the force to hold and stop the cart and fit brakes if needed.')],
        });
    },
    "taper-turning-setup": (v) => {
      if (v.d >= v.D) return invalid('The large diameter must exceed the small diameter.');
      if (v.Lw < v.l) return invalid('The work length must be at least the taper length.');
      const tpu = (v.D - v.d) / v.l, tpf = 12 * tpu, a = Math.atan((v.D - v.d) / (2 * v.l)), alpha = deg(a), offset = (v.D - v.d) / 2 * v.Lw / v.l, ok = offset <= v.offMax + 1e-9;
      return output({ tpu, tpf, alpha, included: 2 * alpha, tanA: Math.tan(a), offset }, 'Tailstock offset (mm)', offset,
        [m('Taper on diameter', `${q(tpu, '', 5)} per unit length (${q(tpf, '', 4)} per foot)`), m('Half angle (compound setting)', q(alpha, '°', 4)), m('Included angle', q(2 * alpha, '°', 4)), m('Tailstock offset', q(offset, 'mm', 3))],
        'Taper turning set-up.', 'Offset method between centres.', {
          text: ok ? 'OFFSET METHOD SUITABLE' : 'USE COMPOUND OR ATTACHMENT', tone: ok ? 'good' : 'warn',
          checks: [check('Tailstock offset', ok ? 'pass' : 'warn', `${q(offset, 'mm', 2)} against ${q(v.offMax, 'mm', 1)}${ok ? '.' : ': use the compound slide or a taper attachment.'}`), check('Tool height', 'verify', 'Set the tool exactly on centre height, or the taper will be curved.')],
        });
    },
    "wall-jib-crane-check": (v) => {
      const { H, B, tf, tw } = v; if (2 * tf >= H || tw >= B) return invalid('Flanges and web do not fit inside the overall size.');
      const R = [[0, 0, B, tf], [0, H - tf, B, tf], [(B - tw) / 2, tf, tw, H - 2 * tf]], A = R.reduce((s, r) => s + r[2] * r[3], 0), yb = R.reduce((s, r) => s + r[2] * r[3] * (r[1] + r[3] / 2), 0) / A;
      let Ix = 0; for (const [, y0, w, h] of R) { const dy = y0 + h / 2 - yb; Ix += w * h ** 3 / 12 + w * h * dy * dy; }
      const Zx = Ix / Math.max(yb, H - yb), th = rad(v.ang), Tmax = v.W / Math.sin(th), pull = Tmax * Math.cos(th), Nmid = v.W / 2 / Math.sin(th) * Math.cos(th), M = v.W * v.L / 4, defl = v.W * v.L ** 3 / (48 * v.E * 1000 * Ix);
      const sb = M / Zx, sc = sb + Nmid / A, sEnd = Tmax * Math.cos(th) / A, st = Tmax / (PI * v.dt * v.dt / 4), Fbolt = pull / v.nb, dAllow = v.L / v.dlim;
      const okS = Math.max(sc, sEnd) <= v.sA + 1e-9, okD = defl <= dAllow + 1e-12, okT = st <= v.tA + 1e-9, okB = Fbolt <= v.Fb + 1e-9, ok = okS && okD && okT && okB;
      return output({ A, Ix, Zx, Tmax, pull, Nmid, M, defl, sb, sc, sEnd, st, Fbolt, dAllow }, 'Combined jib stress (MPa)', sc,
        [m('Jib A / I / Z', `${q(A, 'mm²', 0)} / ${q(Ix, 'mm⁴', 0)} / ${q(Zx, 'mm³', 0)}`), m('Tie tension (load at the end)', q(Tmax, 'N', 0)), m('Moment and stress at mid-reach', `${q(M / 1e6, 'kN·m', 3)} / ${q(sb, 'MPa', 1)} bending + ${q(Nmid / A, 'MPa', 1)} axial`), m('Deflection / allowed', `${q(defl, '', 2)} / ${q(dAllow, 'mm', 2)}`), m('Tie rod stress', q(st, 'MPa', 1)), m('Wall pull / per bolt', `${q(pull, '', 0)} / ${q(Fbolt, 'N', 0)}`)],
        'Wall jib crane check.', 'Pinned jib and tie; static load.', {
          text: ok ? 'JIB ADEQUATE' : 'JIB NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Jib stress', okS ? 'pass' : 'fail', `${q(Math.max(sc, sEnd), 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Deflection', okD ? 'pass' : 'fail', `${q(defl, 'mm', 2)} against ${q(dAllow, 'mm', 2)}.`), check('Tie rod', okT ? 'pass' : 'fail', `${q(st, 'MPa', 1)} against ${q(v.tA, 'MPa', 0)}.`), check('Wall bolts', okB ? 'pass' : 'fail', `${q(Fbolt, 'N', 0)} against ${q(v.Fb, 'N', 0)}.`), check('Buckling and flange', 'verify', 'Check lateral-torsional buckling of the jib and local flange bending under the trolley wheels.')],
        });
    },
    "step-cone-pulley-design": (v) => {
      if (v.nMax <= v.nMin) return invalid('The highest speed must exceed the lowest.');
      if (v.S / 2 >= v.C) return invalid('The centre distance is too small for a crossed belt.');
      const r = (v.nMax / v.nMin) ** (1 / (v.k - 1)), rows = []; let dSmall = Infinity;
      for (let i = 0; i < v.k; i++) { const n = v.nMin * r ** i, d1 = v.S * n / (v.nIn + n), d2 = v.S * v.nIn / (v.nIn + n); dSmall = Math.min(dSmall, d1, d2); rows.push([String(i + 1), q(n, '', 1), q(d1, '', 1), q(d2, '', 1)]); }
      const s = v.S / 2, L = 2 * Math.sqrt(v.C * v.C - s * s) + s * (PI + 2 * Math.asin(s / v.C)), wrap = 180 + 2 * deg(Math.asin(s / v.C)), ok = dSmall >= v.dMin - 1e-9;
      return output({ r, last: v.nMin * r ** (v.k - 1), dSmall, L, wrap }, 'Step ratio', r,
        [m('Step ratio', q(r, '', 4)), m('Output speeds', `${q(v.nMin, '', 1)} to ${q(v.nMax, 'rpm', 1)} in ${v.k} steps`), m('Smallest pulley', q(dSmall, 'mm', 1)), m('Crossed belt length / wrap', `${q(L, 'mm', 1)} / ${q(wrap, '°', 1)}`)],
        'Step cone pulley design.', 'Crossed belt; no slip.', {
          text: ok ? 'STEPS FEASIBLE' : 'PULLEY TOO SMALL', tone: ok ? 'good' : 'bad',
          table: tbl('Steps', ['Step', 'Output speed (rpm)', 'Driver dia (mm)', 'Driven dia (mm)'], rows),
          checks: [check('Smallest pulley', ok ? 'pass' : 'fail', `${q(dSmall, 'mm', 1)} against ${q(v.dMin, 'mm', 0)}${ok ? '.' : ': raise the diameter sum or narrow the speed range.'}`), check('Belt', 'verify', 'Crossed drives suit flat and round belts; check the belt maker allows crossing.')],
        });
    },
    "hydraulic-hand-jack-check": (v) => {
      if (v.a >= v.x) return invalid('The handle must be longer than the pivot-to-plunger distance.');
      if (v.dp >= v.Dr) return invalid('The plunger must be smaller than the ram.');
      const Fp = v.F * v.x / v.a, Ap = PI * v.dp * v.dp / 4, Ar = PI * v.Dr * v.Dr / 4, p = Fp / Ap, Flift = p * Ar * v.eff / 100, pReq = v.Wreq / (Ar * v.eff / 100), Freq = pReq * Ap * v.a / v.x, strokes = Math.ceil(v.Dr * v.Dr * v.h / (v.dp * v.dp * v.sp) - 1e-9);
      const okL = Flift >= v.Wreq - 1e-9, okP = pReq <= v.pRated + 1e-9, okN = strokes <= v.maxStrokes, ok = okL && okP && okN;
      return output({ Fp, p, Flift, pReq, Freq, strokes, ratio: (v.x / v.a) * (Ar / Ap) }, 'Lifting force (N)', Flift,
        [m('Plunger force', q(Fp, 'N', 0)), m('Pressure from the effort', q(p, 'MPa', 2)), m('Lifting force', q(Flift, 'N', 0)), m('Force ratio (lever × area)', q((v.x / v.a) * (Ar / Ap), '', 1)), m('Pressure / effort for the load', `${q(pReq, 'MPa', 2)} / ${q(Freq, 'N', 0)}`), m('Strokes for the lift', String(strokes))],
        'Hydraulic hand jack check.', 'Static balance; efficiency for seal friction.', {
          text: ok ? 'JACK ADEQUATE' : 'JACK NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Lifting force', okL ? 'pass' : 'fail', `${q(Flift, 'N', 0)} against ${q(v.Wreq, 'N', 0)}.`), check('Pressure rating', okP ? 'pass' : 'fail', `${q(pReq, 'MPa', 1)} needed against ${q(v.pRated, 'MPa', 0)}.`), check('Strokes', okN ? 'pass' : 'fail', `${strokes} against ${v.maxStrokes}.`), check('Load safety', 'verify', 'Support raised loads on stands, never on the jack alone.')],
        });
    },
    "capstan-rope-turns-check": (v) => {
      const th = 2 * PI * v.turns, ratio = Math.exp(v.mu * th), T2 = v.T1 / ratio, turnsNeed = v.T1 > v.T2max ? Math.log(v.T1 / v.T2max) / (2 * PI * v.mu) : 0, WLL = v.MBL * 1000 / v.SF;
      const okH = T2 <= v.T2max + 1e-9, okR = v.T1 <= WLL + 1e-9;
      return output({ ratio, T2, turnsNeed, WLL, wrap: v.turns * 360 }, 'Holding force needed (N)', T2,
        [m('Wrap', q(v.turns * 360, '°', 0)), m('Tension ratio', q(ratio, '', 2)), m('Holding force needed', q(T2, 'N', 1)), m('Turns needed for the holding force', q(turnsNeed, '', 2)), m('Rope working load', q(WLL, 'N', 0))],
        'Capstan rope turns check.', 'Capstan equation; rope bedded on a round post.', {
          text: !okR ? 'ROPE OVERLOADED' : okH ? 'HOLD ADEQUATE' : 'MORE TURNS NEEDED', tone: okH && okR ? 'good' : 'bad',
          checks: [check('Holding force', okH ? 'pass' : 'fail', `${q(T2, 'N', 0)} against ${q(v.T2max, 'N', 0)}${okH ? '.' : `: use at least ${q(Math.ceil(turnsNeed * 4) / 4, '', 2)} turns.`}`), check('Rope', okR ? 'pass' : 'fail', `${q(v.T1, 'N', 0)} against a working load of ${q(WLL, 'N', 0)}.`), check('Post', 'verify', 'Check the post or bollard and its fixing for the full load.')],
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
