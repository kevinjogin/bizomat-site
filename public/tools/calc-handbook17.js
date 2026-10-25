// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook17). SI units are explicit at each boundary.
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
    "rectangular-plate": (v) => {
      const E = v.E * 1000, L = v.L, l = v.l, t = v.t, sq = v.case.startsWith('sq'), area = sq ? L * L : L * l, Wu = v.p / 1000 * area;
      if (!sq && l > L) return invalid('The short side must not exceed the long side.');
      let S, d, W;
      const r = v.r0 < 1.7 * t ? Math.sqrt(1.6 * v.r0 ** 2 + t * t) - 0.675 * t : v.r0;
      switch (v.case) {
        case 'sq-ss': W = Wu; S = 0.29 * W / t ** 2; d = 0.0443 * W * L * L / (E * t ** 3); break;
        case 'sq-bottom': W = Wu; S = 0.28 * W / t ** 2; d = 0.0443 * W * L * L / (E * t ** 3); break;
        case 'sq-fixed': W = Wu; S = 0.31 * W / t ** 2; d = 0.0138 * W * L * L / (E * t ** 3); break;
        case 'sq-fixed-c': W = v.W; S = 0.62 * W / t ** 2 * Math.log(L / (2 * r)); d = 0.0568 * W * L * L / (E * t ** 3); break;
        case 'sq-ss-c': W = v.W; S = 0.62 * W / t ** 2 * (Math.log(L / (2 * r)) + 0.577); d = 0.1266 * W * L * L / (E * t ** 3); break;
        case 'rect-ss': W = Wu; S = 0.75 * W / (t * t * (L / l + 1.61 * l * l / (L * L))); d = 0.1422 * W / (E * t ** 3 * (L / l ** 3 + 2.21 / (L * L))); break;
        default: W = Wu; S = 0.5 * W / (t * t * (L / l + 0.623 * l ** 5 / L ** 5)); d = 0.0284 * W / (E * t ** 3 * (L / l ** 3 + 1.056 * l * l / L ** 4));
      }
      if (!(W > 0)) return invalid('Enter a pressure or central load for this case.');
      const ok = S <= v.allow;
      return output({ S, d, W }, 'Maximum stress (MPa)', S,
        [m('Maximum stress', q(S, 'MPa', 1)), m('Maximum deflection', q(d, 'mm', 3)), m('Total load', q(W / 1000, 'kN', 2)), m('Deflection / thickness', q(d / t, '', 3))],
        'Handbook flat-plate formulas.', 'Small-deflection theory.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Plate stress', ok ? 'pass' : 'fail', `${q(S, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('Small-deflection validity', d <= t / 2 ? 'pass' : 'warn', d <= t / 2 ? 'Deflection under half the thickness.' : 'Large deflection: the formulas overstate stress and deflection.')],
        });
    },
    "spherical-shell": (v) => {
      const ri = v.di / 2, ro = ri + v.t, thin = v.p * v.di / (4 * v.t), thick = v.p * (ro ** 3 + 2 * ri ** 3) / (2 * (ro ** 3 - ri ** 3)), n = v.Sy / thick, treq = v.p * v.di * v.req / (4 * v.Sy), vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ thin, thick, n, treq }, 'Maximum stress (MPa)', thick,
        [m('Thin-wall membrane stress', q(thin, 'MPa', 1)), m('Thick-wall maximum stress', q(thick, 'MPa', 1)), m('Safety factor', q(n, '', 2)), m('Thickness for required factor', q(treq, 'mm', 2))],
        'Wall stress of the spherical shell.', 'Membrane region; not a code design.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Pressure equipment code', 'verify', 'Design and certify to the applicable code.')],
        });
    },
    "shaft-brittle-hollow": (v) => {
      const KM = v.Km * v.M * 1000, KT = v.Kt * v.T * 1000;
      if (KM + KT <= 0) return invalid('Enter a bending moment or torque.');
      const Ds = Math.cbrt(5.1 / v.St * (KM + Math.sqrt(KM * KM + KT * KT))), B = Math.cbrt(1 / (1 - v.k ** 4)), Do = B * Ds, Di = v.k * Do;
      return output({ Ds, B, Do, Di, w: B * B * (1 - v.k * v.k), s: B ** 4 * (1 - v.k ** 4) }, 'Solid diameter (mm)', Ds,
        [m('Solid shaft diameter', q(Ds, 'mm', 2)), m('Hollow factor B', q(B, '', 4)), m('Hollow shaft outside / bore', `${q(Do, '', 2)} / ${q(Di, 'mm', 2)}`), m('Weight of hollow ÷ solid', q(B * B * (1 - v.k * v.k), '', 3)), m('Torsional stiffness of hollow ÷ solid', q(B ** 4 * (1 - v.k ** 4), '', 3))],
        'Maximum-normal-stress shaft sizing.', 'Brittle materials; fatigue separately.', { checks: [check('Material is brittle', 'verify', 'Use this method only for materials with under about 5% elongation.')] });
    },
    "flange-coupling-bolts": (v) => {
      const Fb = 2 * v.T * 1000 / (v.n * v.Dbc), tauB = Fb / (PI * v.d * v.d / 4), dreq = Math.sqrt(8 * v.T * 1000 / (PI * v.n * v.Dbc * v.tau)), Tf = v.mu * v.n * v.Fi * 1000 * (v.Df || v.Dbc) / 2 / 1000, ok = tauB <= v.tau;
      return output({ Fb, tauB, dreq, Tf }, 'Bolt shear stress (MPa)', tauB,
        [m('Force per bolt', q(Fb, 'N', 0)), m('Bolt shear stress', q(tauB, 'MPa', 1)), m('Bolt diameter needed', q(dreq, 'mm', 2)), m('Friction torque capacity', v.Fi ? q(Tf, 'N·m', 0) : 'Not checked')],
        'Coupling bolt loading.', 'Fitted bolts share equally.', {
          text: ok ? 'BOLTS ADEQUATE' : 'BOLTS OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bolt shear', ok ? 'pass' : 'fail', `${q(tauB, 'MPa', 1)} against ${q(v.tau, 'MPa')}.`), check('Friction capacity', !v.Fi ? 'verify' : Tf >= v.T ? 'pass' : 'warn', !v.Fi ? 'No preload entered.' : `${q(Tf, 'N·m', 0)} against ${q(v.T, 'N·m', 0)}.`)],
        });
    },
    "taper-pin-torque": (v) => {
      const T = v.mode === 'torque' ? v.T * 1000 : 9549.2966 * v.P / v.rpm * 1000, dreq = 1.13 * Math.sqrt(T / (v.D * v.S)), tau = v.dp > 0 ? 4 * T / (PI * v.dp * v.dp * v.D) : null, ok = tau === null || tau <= v.S;
      return output({ T: T / 1000, dreq, tau }, 'Pin diameter needed (mm)', dreq,
        [m('Torque', q(T / 1000, 'N·m', 2)), m('Mean pin diameter needed', q(dreq, 'mm', 2)), m('Shear stress in checked pin', tau === null ? 'No pin entered' : q(tau, 'MPa', 1))],
        'Taper pin sizing by double shear.', 'Pin shear only.', {
          ...(tau !== null ? (ok ? { text: 'PIN ADEQUATE', tone: 'good' } : { text: 'PIN TOO SMALL', tone: 'bad' }) : {}),
          checks: [check('Checked pin', tau === null ? 'verify' : ok ? 'pass' : 'fail', tau === null ? 'Enter a pin diameter to check it.' : `${q(tau, 'MPa', 1)} against ${q(v.S, 'MPa')}.`), check('Shaft weakening', 'verify', 'The cross hole reduces shaft strength; check the shaft at the hole.')],
        });
    },
    "universal-joint": (v) => {
      const b = rad(v.angle), nmax = v.rpm / Math.cos(b), nmin = v.rpm * Math.cos(b), th = rad(v.pos + 90), ratio = Math.cos(b) / (1 - Math.sin(b) ** 2 * Math.sin(th) ** 2), ninst = v.rpm * ratio;
      return output({ nmax, nmin, var: nmax - nmin, ninst, Tinst: v.Tin / ratio }, 'Speed variation (rpm)', nmax - nmin,
        [m('Maximum driven speed', q(nmax, 'rpm', 2)), m('Minimum driven speed', q(nmin, 'rpm', 2)), m('Total variation', `${q(nmax - nmin, 'rpm', 2)} (${q(100 * (nmax - nmin) / v.rpm, '%', 1)})`), m('Speed at chosen position', q(ninst, 'rpm', 2)), m('Torque at chosen position', q(v.Tin / ratio, 'N·m', 2))],
        'Single Cardan joint kinematics.', 'Single joint, rigid shafts.', { checks: [check('Joint angle', v.angle <= 25 ? 'pass' : 'warn', v.angle <= 25 ? 'Within the preferred range.' : 'Large angle: use a double joint or limit to slow, light drives.')] });
    },
    "fatigue-notch-factor": (v) => {
      const a = v.aMode === 'steel' ? 0.0254 * Math.pow(2070 / v.Su, 1.8) : v.a, qq = 1 / (1 + a / v.r), Kf = 1 + qq * (v.Kt - 1);
      return output({ a, q: qq, Kf }, 'Fatigue factor Kf', Kf,
        [m('Material constant a', q(a, 'mm', 4)), m('Notch sensitivity q', q(qq, '', 3)), m('Fatigue factor Kf', q(Kf, '', 3)), m('Kf ÷ Kt', q(Kf / v.Kt, '', 3))],
        'Effective fatigue stress concentration.', 'Peterson notch sensitivity.', { checks: [check('Source of Kt', 'verify', 'Use Kt for the correct geometry and load type.')] });
    },
    "sn-fatigue-life": (v) => {
      if (v.Se >= v.f * v.Su) return invalid('The endurance limit must be below the strength at 10³ cycles.');
      const a = (v.f * v.Su) ** 2 / v.Se, b = -Math.log10(v.f * v.Su / v.Se) / 3, unlimited = v.sa <= v.Se, N = unlimited ? 1e6 : Math.pow(v.sa / a, 1 / b), sAllow = v.Nreq >= 1e6 ? v.Se : a * Math.pow(Math.max(v.Nreq, 1000), b), ok = unlimited || N >= v.Nreq;
      return output({ a, b, N: unlimited ? Infinity : N, sAllow }, 'Stress allowed for required life (MPa)', sAllow,
        [m('Estimated cycles to failure', unlimited ? 'Unlimited (below the endurance limit)' : q(N, 'cycles', 0)), m('Stress allowed for required life', q(sAllow, 'MPa', 1)), m('Basquin a / b', `${q(a, 'MPa', 1)} / ${q(b, '', 4)}`)],
        unlimited ? 'The stress is below the endurance limit.' : 'Finite-life estimate from the S-N line.', 'Approximate S-N line for steel.', {
          text: ok ? 'LIFE SUFFICIENT' : 'LIFE TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Life against requirement', ok ? 'pass' : 'fail', unlimited ? 'Below endurance limit.' : `${q(N, '', 0)} cycles against ${q(v.Nreq, '', 0)}.`), check('Scatter', 'verify', 'Apply a life factor for fatigue scatter.')],
        });
    },
    "vickers-knoop-hardness": (v) => {
      const hv = v.type === 'hv', H = hv ? 1.8544 * v.F / (v.d * v.d) : 14.229 * v.F / (v.d * v.d), depth = hv ? v.d / 7 : v.d / 30, tmin = hv ? 1.5 * v.d : 10 * depth;
      return output({ H, depth, tmin }, 'Hardness', H,
        [m('Hardness', `${q(H, '', 0)} ${hv ? 'HV' : 'HK'}${q(v.F, '', 2)}`), m('Indentation depth', q(depth * 1000, 'µm', 1)), m('Minimum specimen thickness', q(tmin, 'mm', 3))],
        'Hardness from the indentation.', 'Standard indenter geometry.', { checks: [check('Specimen thickness', 'verify', `Specimen or layer at least ${q(tmin, 'mm', 3)} thick.`)] });
    },
    "elastic-constants": (v) => {
      let E, G, nu;
      if (v.mode === 'Enu') { E = v.E; nu = v.nu; G = E / (2 * (1 + nu)); } else if (v.mode === 'EG') { E = v.E; G = v.G; nu = E / (2 * G) - 1; } else { G = v.G; nu = v.nu; E = 2 * G * (1 + nu); }
      if (!(nu > -1 && nu < 0.5)) return invalid('These values give a Poisson’s ratio outside the physical range (−1 to 0.5).');
      const K = E / (3 * (1 - 2 * nu)), lam = E * nu / ((1 + nu) * (1 - 2 * nu));
      return output({ E, G, nu, K, lam }, 'Shear modulus G (GPa)', G,
        [m('Elastic modulus E', q(E, 'GPa', 3)), m('Shear modulus G', q(G, 'GPa', 3)), m('Poisson’s ratio ν', q(nu, '', 4)), m('Bulk modulus K', q(K, 'GPa', 2)), m('Lamé constant λ', q(lam, 'GPa', 2))],
        'Isotropic elastic constants.', 'Isotropic linear elasticity.', { checks: [check('Physical range', nu >= 0 && nu <= 0.5 ? 'pass' : 'warn', 'Poisson’s ratio for metals is usually 0.25–0.35.')] });
    },
    "melting-energy": (v) => {
      if (v.Tm < v.T0 || v.Tp < v.Tm) return invalid('Temperatures must rise from start to melting point to pouring temperature.');
      const Q = v.mass * (v.cs * (v.Tm - v.T0) + v.L + v.cl * (v.Tp - v.Tm)), kWh = Q / 3600, drawn = kWh / (v.eff / 100), hours = drawn / v.P;
      return output({ Q, kWh, drawn, hours }, 'Melting time (h)', hours,
        [m('Energy into the metal', `${q(Q / 1000, 'MJ', 1)} (${q(kWh, 'kWh', 1)})`), m('Share for melting (latent heat)', q(100 * v.mass * v.L / Q, '%', 1)), m('Energy drawn', q(drawn, 'kWh', 1)), m('Melting time', `${q(hours, 'h', 2)} (${q(hours * 60, 'min', 0)})`), m('Energy cost per melt', money(drawn * v.price)), m('Specific energy', q(drawn / v.mass * 1000, 'kWh/t', 0))],
        'Heat balance for the melt.', 'Average properties; holding losses excluded.', { checks: [check('Material data', 'verify', 'Use specific and latent heats for the actual alloy.')] });
    },
    "snap-fit": (v) => {
      const eps = 3 * v.Y * v.h / (2 * v.L * v.L * v.K), P = v.b * v.h * v.h * v.E * eps / (6 * v.L), ta = Math.tan(rad(v.alpha));
      if (v.mu * ta >= 1) return invalid('Friction and lead-in angle are too high: the finger locks instead of deflecting.');
      const W = P * (v.mu + ta) / (1 - v.mu * ta), ok = 100 * eps <= v.eAllow;
      return output({ eps: 100 * eps, P, W }, 'Assembly strain (%)', 100 * eps,
        [m('Assembly strain', q(100 * eps, '%', 2)), m('Deflection force', q(P, 'N', 1)), m('Assembly force', q(W, 'N', 1)), m('Strain ÷ permissible', q(100 * eps / v.eAllow, '', 2))],
        'Snap-fit finger during assembly.', 'Elastic beam with rigid root.', {
          text: ok ? 'STRAIN ACCEPTABLE' : 'STRAIN TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Assembly strain', ok ? 'pass' : 'fail', `${q(100 * eps, '%', 2)} against ${q(v.eAllow, '%', 1)}.`), check('Root radius', 'verify', 'Add a generous root radius to avoid stress concentration.')],
        });
    },
    "gear-contact-stress": (v) => {
      const E = v.E * 1000, ZE = Math.sqrt(E / (2 * PI * (1 - v.nu ** 2))), a = rad(v.alpha), ZH = Math.sqrt(2 / (Math.sin(a) * Math.cos(a))), sH = ZE * ZH * Math.sqrt(v.K * v.Ft * (v.u + 1) / (v.b * v.d1 * v.u)), ok = sH <= v.allow;
      return output({ ZE, ZH, sH }, 'Contact stress (MPa)', sH,
        [m('Elasticity factor ZE', q(ZE, '√MPa', 1)), m('Zone factor ZH', q(ZH, '', 3)), m('Contact stress', q(sH, 'MPa', 0)), m('Stress ÷ allowable', q(sH / v.allow, '', 3))],
        'Nominal pitch-point contact stress.', 'Screening relation; full rating separately.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'ABOVE ALLOWABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Contact stress', ok ? 'pass' : 'fail', `${q(sH, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Full rating', 'verify', 'Rate with ISO 6336 or AGMA 2001 before release.')],
        });
    },
    "cam-pressure-angle": (v) => {
      const b = rad(v.beta), Rp = v.Rb + v.Rr; let max = 0, at = 0;
      for (let i = 0; i <= 720; i++) {
        const x = i / 720; let y, dy;
        if (v.law === 'cyc') { y = v.h * (x - Math.sin(2 * PI * x) / (2 * PI)); dy = v.h * (1 - Math.cos(2 * PI * x)) / b; }
        else if (v.law === 'shm') { y = v.h / 2 * (1 - Math.cos(PI * x)); dy = v.h * PI / 2 * Math.sin(PI * x) / b; }
        else if (v.law === 'poly') { y = v.h * (10 * x ** 3 - 15 * x ** 4 + 6 * x ** 5); dy = v.h * (30 * x ** 2 - 60 * x ** 3 + 30 * x ** 4) / b; }
        else { y = x < 0.5 ? 2 * v.h * x * x : v.h * (1 - 2 * (1 - x) ** 2); dy = (x < 0.5 ? 4 * v.h * x : 4 * v.h * (1 - x)) / b; }
        const phi = deg(Math.atan(dy / (Rp + y))); if (phi > max) { max = phi; at = x * v.beta; }
      }
      const ok = max <= v.limit;
      return output({ phi: max, at, Rp }, 'Maximum pressure angle (°)', max,
        [m('Maximum pressure angle', q(max, '°', 2)), m('At cam angle into the rise', q(at, '°', 1)), m('Prime circle radius', q(Rp, 'mm', 2))],
        'Pressure angle over the rise.', 'Radial roller follower.', {
          text: ok ? 'WITHIN LIMIT' : 'PRESSURE ANGLE TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Pressure angle', ok ? 'pass' : 'fail', `${q(max, '°', 1)} against ${q(v.limit, '°', 0)}.`), check('Undercutting', 'verify', 'Check the cam profile’s radius of curvature exceeds the roller radius.')],
        });
    },
    "bearing-duty-cycle": (v) => {
      const p = v.type === 'ball' ? 3 : 10 / 3, steps = [1, 2, 3, 4].map((i) => [v['P' + i], v['n' + i], v['t' + i]]).filter((s) => s[1] > 0 && s[2] > 0);
      if (!steps.length) return invalid('Enter at least one step with speed and time.');
      const st = steps.reduce((s, x) => s + x[2], 0), snt = steps.reduce((s, x) => s + x[1] * x[2], 0), nm = snt / st, sum = steps.reduce((s, x) => s + x[0] ** p * x[1] * x[2], 0), Pm = Math.pow(sum / snt, 1 / p);
      if (Pm <= 0) return invalid('Enter a load in at least one step.');
      const L10 = (v.C / Pm) ** p, L10h = L10 * 1e6 / (60 * nm);
      return output({ nm, Pm, L10, L10h }, 'L10 life (h)', L10h,
        [m('Mean speed', q(nm, 'rpm', 0)), m('Mean equivalent load', q(Pm, 'kN', 3)), m('L10 life', `${q(L10, 'million rev', 1)} (${q(L10h, 'h', 0)})`)],
        'Duty-cycle bearing life.', 'Basic rating life.', {
          table: tbl('Damage by step', ['Step', 'Load (kN)', 'Speed (rpm)', 'Time', 'Share of damage'], steps.map((s, i) => [String(i + 1), q(s[0], '', 2), q(s[1], '', 0), q(s[2], '%', 0), q(100 * s[0] ** p * s[1] * s[2] / sum, '%', 1)])),
          checks: [check('Life adjustment', 'verify', 'Apply reliability and lubrication factors for the final life.')],
        });
    },
    "rms-torque": (v) => {
      const seg = [1, 2, 3, 4, 5].map((i) => [v['T' + i], v['t' + i]]).filter((s) => s[1] > 0), tt = seg.reduce((s, x) => s + x[1], 0);
      if (tt <= 0) return invalid('Enter at least one segment with a duration.');
      const rms = Math.sqrt(seg.reduce((s, x) => s + x[0] * x[0] * x[1], 0) / tt), peak = Math.max(...seg.map((x) => Math.abs(x[0]))), okC = rms <= v.Tc, okP = peak <= v.Tp;
      return output({ rms, peak, tt }, 'RMS torque (N·m)', rms,
        [m('RMS torque', q(rms, 'N·m', 3)), m('Peak torque', q(peak, 'N·m', 2)), m('Cycle time', q(tt, 's', 3)), m('Continuous rating used', q(100 * rms / v.Tc, '%', 1)), m('Peak rating used', q(100 * peak / v.Tp, '%', 1))],
        'RMS torque over the duty cycle.', 'Torque basis only.', {
          text: okC && okP ? 'MOTOR ADEQUATE' : 'MOTOR UNDERSIZED', tone: okC && okP ? 'good' : 'bad',
          checks: [check('Continuous torque', okC ? 'pass' : 'fail', `${q(rms, 'N·m', 2)} RMS against ${q(v.Tc, 'N·m', 2)}.`), check('Peak torque', okP ? 'pass' : 'fail', `${q(peak, 'N·m', 2)} against ${q(v.Tp, 'N·m', 2)}.`)],
        });
    },
    "ball-screw-life": (v) => {
      const L = (v.Ca / (v.fw * v.Fm)) ** 3 * 1e6, km = L * v.lead / 1e6, hours = L / (60 * v.rpm), ok = hours >= v.req;
      return output({ L, km, hours }, 'Life (h)', hours,
        [m('Life', q(L / 1e6, 'million rev', 1)), m('Travel life', q(km, 'km', 0)), m('Life in hours', q(hours, 'h', 0))],
        'Ball screw rating life.', 'Basic rating life.', {
          text: ok ? 'LIFE SUFFICIENT' : 'LIFE TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Life against requirement', ok ? 'pass' : 'fail', `${q(hours, 'h', 0)} against ${q(v.req, 'h', 0)}.`), check('Speed and buckling', 'verify', 'Check critical speed and buckling with the ball screw limits tool.')],
        });
    },
    "timing-belt": (v) => {
      const d = v.z1 * v.p / PI, D = v.z2 * v.p / PI, Lf = (C) => 2 * Math.sqrt(C * C - ((D - d) / 2) ** 2) + PI * (D + d) / 2 + (D - d) * Math.asin((D - d) / (2 * C));
      if (v.C <= (D - d) / 2 + (D + d) / 4) return invalid('The centre distance is too small for these pulleys.');
      const L = Lf(v.C), teeth = Math.round(L / v.p), Lr = teeth * v.p; let lo = (D - d) / 2 + 1e-6, hi = v.C * 3 + Lr; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (Lf(mid) < Lr) lo = mid; else hi = mid; }
      const Cx = (lo + hi) / 2, wrap = 180 - 2 * deg(Math.asin((D - d) / (2 * Cx))), mesh = v.z1 * wrap / 360;
      return output({ L, teeth, Lr, Cx, mesh }, 'Belt teeth', teeth,
        [m('Pitch diameters', `${q(d, '', 2)} / ${q(D, 'mm', 2)}`), m('Belt length at the wanted centre', q(L, 'mm', 1)), m('Belt to use', `${teeth} teeth (${q(Lr, 'mm', 1)})`), m('Exact centre distance', q(Cx, 'mm', 2)), m('Teeth in mesh (small pulley)', q(mesh, '', 1))],
        `${teeth}-tooth belt for ${v.z1}/${v.z2} pulleys.`, 'Pitch-line geometry.', { checks: [check('Teeth in mesh', mesh >= 6 ? 'pass' : 'warn', `${q(mesh, '', 1)} teeth in mesh; at least about 6 is recommended.`)] });
    },
    "alignment-thermal-growth": (v) => {
      const g1 = v.a1 * 1e-6 * v.H1 * v.dT1, g2 = v.a2 * 1e-6 * v.H2 * v.dT2, offset = g2 - g1;
      return output({ g1, g2, offset }, 'Cold offset (mm)', offset,
        [m('Stationary machine growth', q(g1 * 1000, 'µm', 1)), m('Movable machine growth', q(g2 * 1000, 'µm', 1)), m('Cold setting of movable machine', offset >= 0 ? `${q(offset * 1000, 'µm', 1)} lower than stationary` : `${q(-offset * 1000, 'µm', 1)} higher than stationary`)],
        'Thermal growth offset for alignment.', 'Uniform support temperature rise.', { checks: [check('Hot check', 'verify', 'Verify alignment at operating temperature where possible.')] });
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
