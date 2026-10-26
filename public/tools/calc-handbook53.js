// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook53). SI units are explicit at each boundary.
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
    "porter-governor-check": (v) => {
      if (v.nmax <= v.nmin) return invalid('The maximum speed must exceed the minimum speed.');
      const g = 9.80665, k = (v.c + v.w) / v.w, hAt = (n) => g / (2 * PI * n / 60) ** 2 * k, h = hAt(v.n), hLo = hAt(v.nmax), hHi = hAt(v.nmin), dh = hHi - hLo, mean = (v.nmax + v.nmin) / 2, C = (v.nmax - v.nmin) / mean;
      if (hHi * 1000 >= v.La) return invalid('At the minimum speed the governor would stand taller than its arms: lengthen the arms or lighten the central load.');
      const r = Math.sqrt(v.La ** 2 - (h * 1000) ** 2), w2 = (2 * PI * v.n / 60) ** 2, Fc = v.w * w2 * r / 1000, okT = dh * 1000 >= v.travel, okC = C <= v.Cmax, ok = okT && okC;
      return output({ h, hLo, hHi, dh, C, k, r, Fc }, 'Governor height (mm)', h * 1000,
        [m('Height at speed', q(h * 1000, 'mm', 2)), m('Height at minimum / maximum speed', `${q(hHi * 1000, '', 2)} / ${q(hLo * 1000, 'mm', 2)}`), m('Sleeve travel over the range', q(dh * 1000, 'mm', 2)), m('Coefficient of speed variation', q(C, '', 4)), m('Ball radius at speed', q(r, 'mm', 2)), m('Centrifugal force per ball', q(Fc, 'N', 1))],
        'Porter governor check.', 'Frictionless symmetric governor.', {
          text: ok ? 'GOVERNOR SUITABLE' : 'GOVERNOR NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Sleeve travel', okT ? 'pass' : 'fail', `${q(dh * 1000, 'mm', 1)} against ${q(v.travel, 'mm', 1)} needed.`), check('Speed variation', okC ? 'pass' : 'fail', `${q(C, '', 4)} against ${q(v.Cmax, '', 3)}.`), check('Friction', 'verify', 'Sleeve friction widens the dead band: keep pivots free.')],
        });
    },
    "overhang-beam-uplift-check": (v) => {
      const EI = v.E * 1000 * v.I, R2 = v.P * (v.L + v.a) / v.L, R1 = -v.P * v.a / v.L, Mneg = -v.P * v.a, tip = v.P * v.a * v.a * (v.L + v.a) / (3 * EI), mid = -0.0642 * v.P * v.a * v.L * v.L / EI, stress = Math.abs(Mneg) * v.c / v.I, Tb = -R1 / v.nb, lim = v.a / v.dRatio;
      const okS = stress <= v.allow, okB = Tb / 1000 <= v.Tbolt, okR = R2 / 1000 <= v.Rmax, okD = tip <= lim, ok = okS && okB && okR && okD;
      return output({ R1, R2, Mneg, tip, mid, stress, Tb, lim }, 'Tip deflection (mm)', tip,
        [m('Back support (uplift)', q(-R1, 'N', 0)), m('Front support', q(R2, 'N', 0)), m('Moment at the front support', q(-Mneg / 1e6, 'kN·m', 3)), m('Bending stress', q(stress, 'MPa', 1)), m('Tip deflection', q(tip, 'mm', 2)), m('Tension per anchor bolt', q(Tb, 'N', 0))],
        'Overhang beam uplift check.', 'Rigid supports; static tip load.', {
          text: ok ? 'OVERHANG ADEQUATE' : 'OVERHANG NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Anchor bolts', okB ? 'pass' : 'fail', `${q(Tb / 1000, 'kN', 2)} per bolt against ${q(v.Tbolt, 'kN', 1)}.`), check('Front support', okR ? 'pass' : 'fail', `${q(R2 / 1000, 'kN', 2)} against ${q(v.Rmax, 'kN', 1)}.`), check('Tip deflection', okD ? 'pass' : 'fail', `${q(tip, 'mm', 2)} against ${q(lim, 'mm', 2)}.`)],
        });
    },
    "beam-drop-impact-check": (v) => {
      if (2 * v.tf >= v.Hs || v.tw >= v.B) return invalid('Flanges and web do not fit inside the overall size.');
      const R = [[0, 0, v.B, v.tf], [0, v.Hs - v.tf, v.B, v.tf], [(v.B - v.tw) / 2, v.tf, v.tw, v.Hs - 2 * v.tf]], A = R.reduce((s, r) => s + r[2] * r[3], 0), yb = v.Hs / 2;
      let Ix = 0; for (const [, y0, w, hh] of R) { const dy = y0 + hh / 2 - yb; Ix += w * hh ** 3 / 12 + w * hh * dy * dy; }
      const c = v.Hs / 2, mpm = A * 1e-6 * v.rho, W = v.mass * 9.80665, EI = v.E * 1000 * Ix, ss = v.support === 'ss', dst = ss ? W * v.L ** 3 / (48 * EI) : W * v.L ** 3 / (3 * EI), M = ss ? W * v.L / 4 : W * v.L, sst = M * c / Ix;
      const k = 1 + Math.sqrt(1 + 2 * v.h / dst), sd = k * sst, dd = k * dst, okS = sd <= v.allow, okD = dd <= v.dMax, ok = okS && okD;
      return output({ A, Ix, Zx: Ix / c, mpm, dst, sst, k, sd, dd }, 'Dynamic stress (MPa)', sd,
        [m('Area / mass per metre', `${q(A, 'mm²', 0)} / ${q(mpm, 'kg/m', 2)}`), m('Second moment / section modulus', `${q(Ix, 'mm⁴', 0)} / ${q(Ix / c, 'mm³', 0)}`), m('Static deflection / stress', `${q(dst, 'mm', 4)} / ${q(sst, 'MPa', 2)}`), m('Impact factor', q(k, '', 2)), m('Dynamic stress', q(sd, 'MPa', 1)), m('Dynamic deflection', q(dd, 'mm', 2))],
        'Beam drop impact check.', 'Energy method; beam mass ignored.', {
          text: ok ? 'BEAM SURVIVES THE DROP' : 'BEAM NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Dynamic stress', okS ? 'pass' : 'fail', `${q(sd, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Dynamic deflection', okD ? 'pass' : 'fail', `${q(dd, 'mm', 2)} against ${q(v.dMax, 'mm', 1)}.`), check('Local effects', 'verify', 'Check flange and web crushing under the impact point.')],
        });
    },
    "silent-chain-drive-check": (v) => {
      if (v.z2 < v.z1) return invalid('The large sprocket must have at least as many teeth as the small one.');
      const spr = (Nt) => { const t = rad(180 / Nt), PD = v.P / Math.sin(t), cot = 1 / Math.tan(t), OD = v.P * (cot + 0.08), G = v.P * (cot - 1.16), Dp = 0.625 * v.P, centre = PD - 0.125 * v.P / Math.sin(rad(30) - t), OPD = Nt % 2 ? centre * Math.cos(t / 2) + Dp : centre + Dp; return { PD, OD, G, OPD }; };
      const s1 = spr(v.z1), s2 = spr(v.z2), k = (v.z2 - v.z1) / (2 * PI), Lp = 2 * v.C / v.P + (v.z1 + v.z2) / 2 + k * k / (v.C / v.P);
      let Leven = Math.ceil(Lp); if (Leven % 2) Leven++;
      const A = Leven - (v.z1 + v.z2) / 2, Cexact = v.P / 4 * (A + Math.sqrt(A * A - 8 * k * k)), d1 = v.P / Math.sin(PI / v.z1), d2 = v.P / Math.sin(PI / v.z2), wrap = 180 - 2 * deg(Math.asin(Math.min(1, (d2 - d1) / (2 * Cexact)))), speed = v.P * v.z1 * v.rpm / 60000;
      const okV = speed <= v.vMax, okZ = v.z1 >= v.zMin, okW = wrap >= v.wrapMin, ok = okV && okZ && okW;
      return output({ PD1: s1.PD, OD1: s1.OD, G1: s1.G, OPD1: s1.OPD, PD2: s2.PD, OD2: s2.OD, G2: s2.G, OPD2: s2.OPD, Lp, Leven, Cexact, speed, wrap, ratio: v.z2 / v.z1 }, 'Chain length (links)', Leven,
        [m('Small sprocket: pitch / outside / over-pin', `${q(s1.PD, '', 3)} / ${q(s1.OD, '', 3)} / ${q(s1.OPD, 'mm', 3)}`), m('Large sprocket: pitch / outside / over-pin', `${q(s2.PD, '', 3)} / ${q(s2.OD, '', 3)} / ${q(s2.OPD, 'mm', 3)}`), m('Guide groove diameters', `${q(s1.G, '', 3)} / ${q(s2.G, 'mm', 3)}`), m('Chain to order', `${Leven} links (${q(Leven * v.P, 'mm', 1)})`), m('Exact centre distance', q(Cexact, 'mm', 2)), m('Chain speed', q(speed, 'm/s', 2)), m('Wrap on small sprocket', q(wrap, '°', 1)), m('Ratio / driven speed', `${q(v.z2 / v.z1, '', 3)} / ${q(v.rpm * v.z1 / v.z2, 'rpm', 1)}`)],
        'Silent chain drive check.', 'Layout only; rating from the maker.', {
          text: ok ? 'DRIVE LAYOUT OK' : 'DRIVE LAYOUT NOT OK', tone: ok ? 'good' : 'bad',
          checks: [check('Chain speed', okV ? 'pass' : 'fail', `${q(speed, 'm/s', 2)} against ${q(v.vMax, 'm/s', 1)}.`), check('Small sprocket teeth', okZ ? 'pass' : 'fail', `${v.z1} against ${v.zMin}.`), check('Wrap', okW ? 'pass' : 'fail', `${q(wrap, '°', 1)} against ${q(v.wrapMin, '°', 0)}.`), check('Power rating', 'verify', 'Confirm the chain width from the maker’s rating tables.')],
        });
    },
    "jaw-clutch-milling-setup": (v) => {
      const idx = 360 / v.Nt; let alpha = 90;
      if (v.type !== 'straight') {
        if (v.type === 'single' && v.Nt <= 4) return invalid('Saw-tooth clutches need at least 5 teeth for this method.');
        const c = v.type === 'single' ? Math.tan(rad(360 / v.Nt)) / Math.tan(rad(v.theta)) / 2 : Math.tan(rad(180 / v.Nt)) / Math.tan(rad(v.theta / 2)) / 2;
        if (!(c > 0 && c <= 1)) return invalid('No dividing-head angle exists for this tooth count and cutter angle.');
        alpha = deg(Math.acos(c));
      }
      const circles = v.plates === 'bs' ? [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49] : [24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66];
      const whole = Math.floor(v.ratio / v.Nt), rem = v.ratio % v.Nt, opts = rem === 0 ? [] : circles.filter((h) => (rem * h) % v.Nt === 0), found = rem === 0 || opts.length > 0, circle = opts[0] || 0, holes = circle ? rem * circle / v.Nt : 0;
      const setting = rem === 0 ? `${whole} whole turns` : found ? `${whole} turns and ${holes} holes in the ${circle}-hole circle` : 'differential indexing';
      return output({ idx, alpha, whole, rem, holes, circle, count: opts.length, setting }, 'Dividing-head angle (°)', alpha,
        [m('Dividing-head angle', v.type === 'straight' ? '90° (vertical)' : q(alpha, '°', 3)), m('Angle between teeth', q(idx, '°', 4)), m('Index setting', setting), m('Tooth count', v.Nt % 2 ? 'Odd' : 'Even')],
        'Jaw clutch milling set-up.', 'Cutter on the centre line; simple indexing.', {
          text: found ? 'SET-UP FOUND' : 'NEEDS DIFFERENTIAL INDEXING', tone: found ? 'good' : 'bad',
          checks: [check('Indexing', found ? 'pass' : 'fail', found ? setting.charAt(0).toUpperCase() + setting.slice(1) + '.' : 'No index circle divides this tooth count.'), check('Mating clutch', 'verify', 'Cut both halves with the same set-up and check engagement on a trial piece.')],
        });
    },
    "snatch-block-load-check": (v) => {
      const a1 = -v.theta / 2, a2 = v.theta / 2, rx = v.T * Math.cos(rad(a1)) + v.T * Math.cos(rad(a2)), ry = v.T * Math.sin(rad(a1)) + v.T * Math.sin(rad(a2)), R = Math.hypot(rx, ry), factor = R / v.T, dfAct = v.MBL / v.T;
      const okB = R <= v.WLLb, okA = R <= v.anchor, okR = dfAct >= v.DF, ok = okB && okA && okR;
      return output({ R, factor, dfAct, rx, ry }, 'Load on the block (kN)', R,
        [m('Resultant on block and anchor', q(R, 'kN', 2)), m('Angle factor', q(factor, '', 3)), m('Direction', 'Along the bisector of the rope legs'), m('Rope design factor', q(dfAct, '', 2))],
        'Snatch block load check.', 'Equal leg tensions; static pull.', {
          text: ok ? 'RIGGING ADEQUATE' : 'RIGGING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Block', okB ? 'pass' : 'fail', `${q(R, 'kN', 2)} against ${q(v.WLLb, 'kN', 1)}.`), check('Anchor', okA ? 'pass' : 'fail', `${q(R, 'kN', 2)} against ${q(v.anchor, 'kN', 1)}.`), check('Rope', okR ? 'pass' : 'fail', `Design factor ${q(dfAct, '', 2)} against ${q(v.DF, '', 1)}.`), check('Exclusion zone', 'verify', 'Keep people out of the bight of the rope and in line with the anchor.')],
        });
    },
    "crossed-belt-drive-check": (v) => {
      const s = (v.D1 + v.D2) / 2;
      if (s >= v.C) return invalid('The centre distance is too small for a crossed belt.');
      const L = 2 * Math.sqrt(v.C * v.C - s * s) + s * (PI + 2 * Math.asin(s / v.C)), dd = (v.D1 - v.D2) / 2, Lopen = 2 * Math.sqrt(v.C * v.C - dd * dd) + PI * s + 2 * dd * Math.asin(dd / v.C), wrap = 180 + 2 * deg(Math.asin(s / v.C)), wrapOpen = 180 - 2 * deg(Math.asin(Math.abs(dd) / v.C));
      const vb = PI * v.D1 * v.n1 / 60000, pull = v.P * 1000 / vb, ratio = Math.exp(v.mu * rad(wrap)), T2 = pull / (ratio - 1), T1 = T2 * ratio, Tc = v.mb * vb * vb, T1tot = T1 + Tc, okT = T1tot <= v.Tallow, okV = vb <= v.vMax, ok = okT && okV;
      return output({ L, Lopen, wrap, wrapOpen, v: vb, pull, ratio, T1, T2, Tc, T1tot, n2: v.n1 * v.D1 / v.D2 }, 'Tight-side tension (N)', T1tot,
        [m('Crossed belt length', q(L, 'mm', 1)), m('Wrap: crossed / open small pulley', `${q(wrap, '', 1)} / ${q(wrapOpen, '°', 1)}`), m('Belt speed', q(vb, 'm/s', 2)), m('Effective pull', q(pull, 'N', 1)), m('Tension ratio at slip', q(ratio, '', 3)), m('Tight / slack side', `${q(T1, '', 1)} / ${q(T2, 'N', 1)}`), m('Centrifugal tension', q(Tc, 'N', 1)), m('Driven speed (reversed)', q(v.n1 * v.D1 / v.D2, 'rpm', 0))],
        'Crossed belt drive check.', 'Tensions at impending slip.', {
          text: ok ? 'BELT DRIVE ADEQUATE' : 'BELT DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Belt tension', okT ? 'pass' : 'fail', `${q(T1tot, 'N', 0)} against ${q(v.Tallow, 'N', 0)}.`), check('Belt speed', okV ? 'pass' : 'fail', `${q(vb, 'm/s', 1)} against ${q(v.vMax, 'm/s', 0)}.`), check('Belt rubbing', 'verify', 'Crossed belts rub where they cross: keep the centre distance generous and the belt narrow.')],
        });
    },
    "square-round-spring-compare": (v) => {
      const C = v.D / v.a;
      if (C <= 1.5) return invalid('The mean diameter is too small for this wire.');
      if (v.Lw > v.L0) return invalid('The working length must not exceed the unloaded length.');
      const Ls = (v.Na + 2) * v.a;
      if (v.Lw < Ls) return invalid(`The working length is below the solid length (${q(Ls, 'mm', 2)}).`);
      const G = v.G * 1000, x = v.L0 - v.Lw, ks = G * v.a ** 4 / (5.58 * v.Na * v.D ** 3), Fs = ks * x, Ks = 0.96 * ((4 * C - 1) / (4 * C - 4) + 0.615 / C), Ss = Ks * Fs * v.D / (0.416 * v.a ** 3);
      const kr = G * v.a ** 4 / (8 * v.D ** 3 * v.Na), Fr = kr * x, Kr = (4 * C - 1) / (4 * C - 4) + 0.615 / C, Sr = Kr * 8 * Fr * v.D / (PI * v.a ** 3);
      const sqOk = Fs >= v.need && Ss <= v.allow, rdOk = Fr >= v.need && Sr <= v.allow;
      return output({ ks, Fs, Ss, kr, Fr, Sr, Ls, gain: Fs / Fr }, 'Square-wire load (N)', Fs,
        [m('Rate: square / round', `${q(ks, '', 3)} / ${q(kr, 'N/mm', 3)}`), m('Load: square / round', `${q(Fs, '', 1)} / ${q(Fr, 'N', 1)} (square gives ${q(Fs / Fr, '', 2)} ×)`), m('Corrected stress: square / round', `${q(Ss, '', 0)} / ${q(Sr, 'MPa', 0)}`), m('Solid length (both)', q(Ls, 'mm', 2))],
        'Square and round wire spring comparison.', 'Same coil, coils and lengths.', {
          text: sqOk && rdOk ? 'BOTH MEET THE NEED' : sqOk ? 'SQUARE WIRE MEETS THE NEED' : rdOk ? 'ROUND WIRE MEETS THE NEED' : 'NEITHER MEETS THE NEED', tone: sqOk || rdOk ? 'good' : 'bad',
          checks: [check('Square wire', sqOk ? 'pass' : 'fail', `${q(Fs, 'N', 0)} at ${q(Ss, 'MPa', 0)} against ${q(v.need, 'N', 0)} and ${q(v.allow, 'MPa', 0)}.`), check('Round wire', rdOk ? 'pass' : 'fail', `${q(Fr, 'N', 0)} at ${q(Sr, 'MPa', 0)} against ${q(v.need, 'N', 0)} and ${q(v.allow, 'MPa', 0)}.`), check('Keystone effect', 'verify', 'Square wire distorts in coiling; confirm the rate on a sample.')],
        });
    },
    "crossed-helical-drive-check": (v) => {
      const g = rad(v.psi), p = PI / 2 - g, D = v.Nt / (v.Pn * Math.cos(g)), d = v.n / (v.Pn * Math.cos(p)), C = (D + d) / 2, LG = PI * D / Math.tan(g), LP = PI * d / Math.tan(p);
      const V1 = PI * d * 0.0254 * v.rpm / 60, Vs = V1 / Math.cos(g), V2 = V1 * Math.cos(p) / Math.cos(g), Ft = v.P * 1000 / V1, Fa = Ft * Math.tan(p), ok = Vs <= v.vsMax;
      return output({ D, d, C, LG, LP, V1, V2, Vs, Ft, Fa, ratio: v.Nt / v.n }, 'Sliding velocity (m/s)', Vs,
        [m('Gear / pinion pitch diameter', `${q(D, '', 4)} / ${q(d, 'in', 4)}`), m('Gear / pinion outside diameter', `${q(D + 2 / v.Pn, '', 4)} / ${q(d + 2 / v.Pn, 'in', 4)}`), m('Centre distance', `${q(C, 'in', 4)} (${q(C * 25.4, 'mm', 2)})`), m('Gear / pinion lead', `${q(LG, '', 3)} / ${q(LP, 'in', 3)}`), m('Pitch-line velocity: pinion / gear', `${q(V1, '', 2)} / ${q(V2, 'm/s', 2)}`), m('Sliding velocity', q(Vs, 'm/s', 2)), m('Pinion tangential / axial force', `${q(Ft, '', 0)} / ${q(Fa, 'N', 0)}`)],
        'Crossed helical drive check.', 'Shafts at 90°; friction neglected in forces.', {
          text: ok ? 'SLIDING WITHIN LIMIT' : 'SLIDING TOO FAST', tone: ok ? 'good' : 'bad',
          checks: [check('Sliding velocity', ok ? 'pass' : 'fail', `${q(Vs, 'm/s', 2)} against ${q(v.vsMax, 'm/s', 1)}.`), check('Hand of helix', 'verify', 'Both gears need the same hand for shafts at right angles.'), check('Load capacity', 'verify', 'Point contact limits the load: confirm with wear tests or the gear maker.')],
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
