// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook56). SI units are explicit at each boundary.
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
    "three-leg-sling-check": (v) => {
      const P = [[v.x1, v.y1, v.z1], [v.x2, v.y2, v.z2], [v.x3, v.y3, v.z3]], L = P.map((p) => Math.hypot(...p)), U = P.map((p, j) => p.map((c) => c / L[j])), ang = P.map((p, j) => 180 - deg(Math.acos(p[2] / L[j])));
      const A = [0, 1, 2].map((i) => [0, 1, 2].map((j) => U[j][i])), b = [0, 0, -v.W], det2 = (M) => M[0][0] * M[1][1] - M[0][1] * M[1][0], det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
      if (Math.abs(det) < 1e-9) return invalid('The lift points and hook lie in one plane: the leg tensions cannot be found.');
      const cof = (r, s) => { const M = A.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== s)); return ((r + s) % 2 ? -1 : 1) * det2(M); }, inv = [0, 1, 2].map((i) => [0, 1, 2].map((j) => cof(j, i) / det)), Tn = inv.map((row) => row.reduce((s, a, j) => s + a * b[j], 0));
      const slack = Tn.some((t) => t < 0), okW = Tn.every((t) => t <= v.WLL), okA = ang.every((a) => a <= v.angMax), ok = !slack && okW && okA;
      return output({ L1: L[0], L2: L[1], L3: L[2], a1: ang[0], a2: ang[1], a3: ang[2], T1: Tn[0], T2: Tn[1], T3: Tn[2], Tmax: Math.max(...Tn) }, 'Highest leg tension (kN)', Math.max(...Tn),
        [m('Leg lengths', `${q(L[0], '', 0)} / ${q(L[1], '', 0)} / ${q(L[2], 'mm', 0)}`), m('Angles from vertical', `${q(ang[0], '', 1)} / ${q(ang[1], '', 1)} / ${q(ang[2], '°', 1)}`), m('Leg tensions', `${q(Tn[0], '', 2)} / ${q(Tn[1], '', 2)} / ${q(Tn[2], 'kN', 2)}`), m('Sum of vertical components', q(Tn.reduce((s, t, j) => s - t * U[j][2], 0), 'kN', 2))],
        'Three-leg sling load share.', 'Hook over the centre of gravity; rigid legs.', {
          text: ok ? 'SLING ADEQUATE' : slack ? 'A LEG GOES SLACK' : 'SLING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('All legs loaded', slack ? 'fail' : 'pass', slack ? 'A leg has negative tension: the centre of gravity is outside the lift-point triangle.' : 'All three legs carry load.'), check('Leg load', okW ? 'pass' : 'fail', `${q(Math.max(...Tn), 'kN', 2)} highest against ${q(v.WLL, 'kN', 1)}.`), check('Leg angle', okA ? 'pass' : 'fail', `${q(Math.max(...ang), '°', 1)} steepest against ${q(v.angMax, '°', 0)}.`)],
        });
    },
    "instrument-calibration-check": (v) => {
      if (v.hi <= v.lo) return invalid('The high end of the range must exceed the low end.');
      const R = [v.r1, v.r2, v.r3, v.r4, v.r5], M = [v.m1, v.m2, v.m3, v.m4, v.m5], span = v.hi - v.lo;
      for (let i = 1; i < 5; i++) if (!(R[i] > R[i - 1] && M[i] > M[i - 1])) return invalid('Enter references and readings that increase from point 1 to point 5.');
      const err = M.map((x, i) => x - R[i]), pct = err.map((e) => e / span * 100), wi = pct.reduce((b, p, i) => (Math.abs(p) > Math.abs(pct[b]) ? i : b), 0), worst = pct[wi], ok = Math.abs(worst) <= v.cls + 1e-12;
      let k = 0; while (k < 3 && v.field > M[k + 1]) k++;
      const slope = (M[k + 1] - M[k]) / (R[k + 1] - R[k]), corr = R[k] + (v.field - M[k]) / slope, inside = v.field >= M[0] && v.field <= M[4];
      return output({ worst, worstPoint: wi + 1, corr, slope, k: k + 1, e1: err[0], e2: err[1], e3: err[2], e4: err[3], e5: err[4] }, 'Worst error (% of span)', worst,
        [m('Errors at the points', err.map((e) => q(e, '', 4)).join(' / ')), m('Errors as % of span', pct.map((p) => q(p, '', 2)).join(' / ')), m('Worst error', `${q(worst, '%', 2)} at point ${wi + 1}`), m('Corrected service reading', `${q(corr, '', 4)}${inside ? '' : ' (extrapolated)'}`)],
        'Instrument calibration check.', 'Rising readings; linear between points.', {
          text: ok ? 'WITHIN ACCURACY CLASS' : 'OUT OF ACCURACY CLASS', tone: ok ? 'good' : 'bad',
          table: tbl('Calibration', ['Point', 'Reference', 'Reading', 'Error', '% of span'], R.map((r, i) => [String(i + 1), q(r, '', 4), q(M[i], '', 4), q(err[i], '', 4), q(pct[i], '%', 2)])),
          checks: [check('Accuracy class', ok ? 'pass' : 'fail', `Worst ${q(Math.abs(worst), '%', 2)} against ${q(v.cls, '%', 2)}.`), check('Service reading', inside ? 'pass' : 'warn', inside ? 'Within the calibrated range.' : 'Outside the calibrated points: the correction is extrapolated.'), check('Reference uncertainty', 'verify', 'The reference should be at least four times more accurate than the class.')],
        });
    },
    "npt-port-check": (v) => {
      const p = 1 / v.n, E0 = v.D - (0.05 * v.D + 1.1) * p, L2 = (0.8 * v.D + 6.8) * p, E2 = E0 + 0.0625 * L2, h = 0.8 * p;
      if (E0 <= 0) return invalid('Too few threads per inch for this diameter.');
      const need = (L2 + v.chamfer * p) * 25.4, major = (E2 + h) * 25.4, wall = (v.boss - major) / 2, okD = v.depth >= need, okW = wall >= v.wallMin, ok = okD && okW;
      return output({ E0, L2, E2, h, need, L2mm: L2 * 25.4, major, wall }, 'Tapped depth needed (mm)', need,
        [m('Pitch diameter at small end E₀', `${q(E0, 'in', 5)} (${q(E0 * 25.4, 'mm', 3)})`), m('Effective thread length L₂', `${q(L2, 'in', 4)} (${q(L2 * 25.4, 'mm', 2)})`), m('Pitch diameter at L₂', `${q(E2, 'in', 5)} (${q(E2 * 25.4, 'mm', 3)})`), m('Tapped depth needed', q(need, 'mm', 2)), m('Thread major diameter', q(major, 'mm', 2)), m('Boss wall left', q(wall, 'mm', 2))],
        'NPT tapped port check.', 'Formula dimensions; wall at L₂.', {
          text: ok ? 'PORT ADEQUATE' : 'PORT NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Depth', okD ? 'pass' : 'fail', `${q(v.depth, 'mm', 1)} against ${q(need, 'mm', 1)} needed.`), check('Boss wall', okW ? 'pass' : 'fail', `${q(wall, 'mm', 2)} against ${q(v.wallMin, 'mm', 1)}.`), check('Gauging', 'verify', 'Check the tapped port with an L₁ plug gauge.')],
        });
    },
    "fit-at-temperature-check": (v) => {
      if (!(v.D > v.d) || !(v.d > v.di)) return invalid('Diameters must satisfy hub outside > interface > shaft bore.');
      const Eh = v.Eh * 1000, Es = v.Es * 1000, kh = (v.D ** 2 + v.d ** 2) / (v.D ** 2 - v.d ** 2), ks = (v.d ** 2 + v.di ** 2) / (v.d ** 2 - v.di ** 2), pOf = (dl) => Math.max(0, dl) / (v.d * ((kh + v.nuh) / Eh + (ks - v.nus) / Es));
      const dHot = v.delta0 + v.d * (v.as - v.ah) * 1e-6 * (v.Top - v.Ta), at = (dl) => { const p = pOf(dl), hoop = p * kh, vm = Math.sqrt(hoop * hoop + hoop * p + p * p); return { p, T: v.mu * p * PI * v.d * v.d * v.L / 2 / 1000, vm }; };
      const c = at(v.delta0), h = at(dHot), Tmin = Math.min(c.T, h.T), vmMax = Math.max(c.vm, h.vm), n = vmMax > 0 ? v.Sy / vmMax : 1e9, need = v.Treq * v.SF, okT = Tmin >= need, okS = n >= v.req, ok = okT && okS && dHot > 0;
      return output({ dHot, pCold: c.p, Tcold: c.T, vmCold: c.vm, pHot: h.p, Thot: h.T, vmHot: h.vm, n }, 'Holding torque at operating temperature (N·m)', h.T,
        [m('Interference: assembly / operating', `${q(v.delta0 * 1000, '', 1)} / ${q(dHot * 1000, 'µm', 1)}`), m('Pressure: assembly / operating', `${q(c.p, '', 1)} / ${q(h.p, 'MPa', 1)}`), m('Holding torque: assembly / operating', `${q(c.T, '', 0)} / ${q(h.T, 'N·m', 0)}`), m('Hub von Mises: assembly / operating', `${q(c.vm, '', 0)} / ${q(h.vm, 'MPa', 0)}`), m('Hub safety factor at the tightest', q(n, '', 2))],
        'Interference fit at operating temperature.', 'Uniform temperature; thick cylinders.', {
          text: ok ? 'FIT HOLDS AT TEMPERATURE' : dHot <= 0 ? 'FIT GOES LOOSE' : 'FIT DOES NOT WORK', tone: ok ? 'good' : 'bad',
          checks: [check('Grip at the weaker condition', okT ? 'pass' : 'fail', `${q(Tmin, 'N·m', 0)} against ${q(need, 'N·m', 0)} (torque × slip factor).`), check('Hub at the tighter condition', okS ? 'pass' : 'fail', `Safety factor ${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Interference hot', dHot > 0 ? 'pass' : 'fail', dHot > 0 ? `${q(dHot * 1000, 'µm', 1)} remains.` : 'The parts separate at the operating temperature.')],
        });
    },
    "spring-fatigue-check": (v) => {
      const C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      if (!(v.L2 < v.L1 && v.L1 <= v.L0)) return invalid('Lengths must satisfy working < preload ≤ unloaded.');
      const Nt = { cg: v.Na + 2, c: v.Na + 2, pg: v.Na + 1, p: v.Na }[v.ends], Ls = (v.ends === 'cg' || v.ends === 'pg' ? Nt : Nt + 1) * v.d;
      if (v.L2 < Ls) return invalid(`The working length is below the solid length (${q(Ls, 'mm', 2)}).`);
      const k = v.G * 1000 * v.d ** 4 / (8 * v.D ** 3 * v.Na), K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, tau = (F) => K * 8 * F * v.D / (PI * v.d ** 3), F1 = k * (v.L0 - v.L1), F2 = k * (v.L0 - v.L2), tau1 = tau(F1), tau2 = tau(F2), ta = (tau2 - tau1) / 2, tm = (tau2 + tau1) / 2;
      const nG = 1 / (ta / v.Ses + tm / v.Sus), nS = 1 / (ta / v.Ses + tm / v.Ssy), nGb = 0.5 * (v.Sus / tm) ** 2 * (ta / v.Ses) * (-1 + Math.sqrt(1 + (2 * tm * v.Ses / (v.Sus * ta)) ** 2)), ny = v.Ssy / (ta + tm), gov = Math.min(nG, ny), ok = gov >= v.req;
      return output({ k, K, F1, F2, tau1, tau2, ta, tm, nG, nS, nGb, ny, gov, Ls }, 'Governing safety factor', gov,
        [m('Rate', q(k, 'N/mm', 3)), m('Loads at preload / working', `${q(F1, '', 1)} / ${q(F2, 'N', 1)}`), m('Stresses at preload / working', `${q(tau1, '', 0)} / ${q(tau2, 'MPa', 0)}`), m('Alternating / mean stress', `${q(ta, '', 0)} / ${q(tm, 'MPa', 0)}`), m('Goodman / Soderberg / Gerber', `${q(nG, '', 2)} / ${q(nS, '', 2)} / ${q(nGb, '', 2)}`), m('First-cycle yield factor', q(ny, '', 2)), m('Solid length', q(Ls, 'mm', 2))],
        'Spring fatigue check.', 'Infinite life; Wahl factor on both stresses.', {
          text: ok ? 'INFINITE LIFE EXPECTED' : 'FATIGUE FAILURE LIKELY', tone: ok ? 'good' : 'bad',
          checks: [check('Fatigue (Goodman)', nG >= v.req ? 'pass' : 'fail', `${q(nG, '', 2)} against ${q(v.req, '', 1)}.`), check('First-cycle yield', ny >= 1 ? 'pass' : 'fail', `${q(ny, '', 2)}.`), check('Surge', 'verify', 'Keep the operating frequency well below the spring’s natural frequency.')],
        });
    },
    "cam-return-spring-check": (v) => {
      const w = 2 * PI * v.rpm / 60, b = rad(v.beta), hm = v.h / 1000, c = { shm: [PI / 2, PI * PI / 2], cyc: [2, 2 * PI], parab: [2, 4], poly: [1.875, 5.7735] }[v.law], vel = c[0] * hm * w / b, a = c[1] * hm * w * w / (b * b), Fi = v.mass * a;
      const xs = { shm: 1, cyc: 0.75, parab: 0.5, poly: 0.5 + Math.sqrt(3) / 6 }[v.law], frac = v.law === 'shm' ? 1 : v.law === 'cyc' ? xs - Math.sin(2 * PI * xs) / (2 * PI) : v.law === 'parab' ? 0.5 : 10 * xs ** 3 - 15 * xs ** 4 + 6 * xs ** 5, s = frac * v.h, Fs = v.F0 + v.k * s, rpmJump = Fi > 0 ? v.rpm * Math.sqrt(Fs / Fi) : Infinity, Ffull = v.F0 + v.k * v.h;
      const okJ = Fs >= v.margin * Fi, okR = Ffull <= v.Fmax, ok = okJ && okR;
      return output({ vel, a, Fi, xs, s, Fs, ratio: Fs / Fi, rpmJump, Ffull }, 'Spring force ÷ inertia force', Fs / Fi,
        [m('Peak velocity / deceleration', `${q(vel, 'm/s', 3)} / ${q(a, 'm/s²', 1)}`), m('Inertia force', q(Fi, 'N', 1)), m('Where deceleration peaks', `${q(xs * 100, '%', 1)} of the cam angle, lift ${q(s, 'mm', 2)}`), m('Spring force there', q(Fs, 'N', 1)), m('Margin (spring ÷ inertia)', q(Fs / Fi, '', 2)), m('Jump speed', q(rpmJump, 'rpm', 0)), m('Spring force at full lift', q(Ffull, 'N', 1))],
        'Cam return spring check.', 'Rigid follower; gravity and friction ignored.', {
          text: ok ? 'FOLLOWER STAYS IN CONTACT' : !okJ ? 'FOLLOWER WILL JUMP' : 'SPRING OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Contact margin', okJ ? 'pass' : 'fail', `${q(Fs / Fi, '', 2)} against ${q(v.margin, '', 2)}${okJ ? '.' : `: keep below ${q(v.rpm * Math.sqrt(Fs / (v.margin * Fi)), 'rpm', 0)} or raise the preload.`}`), check('Spring rating', okR ? 'pass' : 'fail', `${q(Ffull, 'N', 0)} at full lift against ${q(v.Fmax, 'N', 0)}.`), check('Motion law', v.law === 'cyc' || v.law === 'poly' ? 'pass' : 'warn', v.law === 'cyc' || v.law === 'poly' ? 'Smooth acceleration at the ends of the rise.' : 'Acceleration jumps at the ends of the rise excite vibration.')],
        });
    },
    "angular-cutter-fluting-setup": (v) => {
      const t = rad(360 / v.Nt), D = v.B === 0 ? 90 : deg(Math.atan(Math.cos(t) / Math.tan(rad(v.B)))), sE = Math.tan(t) / Math.tan(rad(v.C)) * Math.sin(rad(D));
      if (!(sE >= 0 && sE <= 1)) return invalid('No setting angle exists for this combination of teeth, blank and cutter angles.');
      const E = deg(Math.asin(sE)), A = D - E, circles = v.plates === 'bs' ? [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49] : [24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66], whole = Math.floor(v.ratio / v.Nt), rem = v.ratio % v.Nt, opts = rem === 0 ? [] : circles.filter((hh) => (rem * hh) % v.Nt === 0), found = rem === 0 || opts.length > 0, circle = opts[0] || 0, holes = circle ? rem * circle / v.Nt : 0;
      const setting = rem === 0 ? `${whole} whole turns` : found ? `${whole} turns and ${holes} holes in the ${circle}-hole circle` : 'differential indexing';
      return output({ D, E, A, idx: 360 / v.Nt, whole, rem, holes, circle, count: opts.length, setting }, 'Setting angle (°)', A,
        [m('Setting angle A', q(A, '°', 3)), m('Angles D / E', `${q(D, '', 3)} / ${q(E, '°', 3)}`), m('Angle between teeth', q(360 / v.Nt, '°', 3)), m('Index setting', setting)],
        'Angular cutter fluting set-up.', 'Handbook formulas; simple indexing.', {
          text: found ? 'SET-UP FOUND' : 'NEEDS DIFFERENTIAL INDEXING', tone: found ? 'good' : 'bad',
          checks: [check('Indexing', found ? 'pass' : 'fail', found ? setting.charAt(0).toUpperCase() + setting.slice(1) + '.' : 'No index circle divides this tooth count.'), check('Cutter position', 'verify', 'Set the fluting cutter so its face cuts on the blank’s centre line.')],
        });
    },
    "gearbox-oil-temperature-check": (v) => {
      if (v.Tmax <= v.Tamb) return invalid('The maximum oil temperature must exceed the ambient temperature.');
      if (v.v100 >= v.v40) return invalid('The viscosity at 100 °C must be below the viscosity at 40 °C.');
      const loss = v.P * 1000 * (1 - v.eff / 100), hA = v.h * v.A, Teq = v.Tamb + loss / hA, Plim = hA * (v.Tmax - v.Tamb) / (1 - v.eff / 100) / 1000, duty = Math.max(0, loss - hA * (v.Tmax - v.Tamb)), flow = duty / (v.rho * v.cp * 1000 * v.dT) * 60000, cooler = Teq > v.Tmax, Trun = cooler ? v.Tmax : Teq;
      const Y = (nu) => Math.log10(Math.log10(nu + 0.7)), X = (t) => Math.log10(t + 273.15), B = (Y(v.v40) - Y(v.v100)) / (X(100) - X(40)), Ac = Y(v.v40) + B * X(40), nu = Math.pow(10, Math.pow(10, Ac - B * X(Trun))) - 0.7, okV = nu >= v.nuMin;
      return output({ loss, Teq, Plim, duty, flow, Trun, nu }, 'Viscosity at running temperature (cSt)', nu,
        [m('Heat generated', q(loss / 1000, 'kW', 3)), m('Equilibrium oil temperature', q(Teq, '°C', 1)), m('Thermal power limit (no cooler)', q(Plim, 'kW', 2)), m('Cooler duty / oil flow', cooler ? `${q(duty / 1000, 'kW', 3)} / ${q(flow, 'L/min', 2)}` : 'No cooler needed'), m('Running temperature', q(Trun, '°C', 1)), m('Viscosity at running temperature', q(nu, 'cSt', 1))],
        'Gearbox oil temperature and grade check.', 'Steady state; ASTM D341 viscosity.', {
          text: !okV ? 'OIL TOO THIN WHEN HOT' : cooler ? 'COOLER REQUIRED' : 'TEMPERATURE AND GRADE OK', tone: okV && !cooler ? 'good' : 'bad',
          checks: [check('Oil temperature', cooler ? 'fail' : 'pass', cooler ? `${q(Teq, '°C', 1)} without a cooler against ${q(v.Tmax, '°C', 0)}: fit a ${q(duty / 1000, 'kW', 2)} cooler.` : `${q(Teq, '°C', 1)} against ${q(v.Tmax, '°C', 0)}.`), check('Viscosity', okV ? 'pass' : 'fail', `${q(nu, 'cSt', 1)} against ${q(v.nuMin, 'cSt', 0)}${okV ? '.' : ': use a heavier grade or cool the oil.'}`), check('Oil life', 'verify', 'Mineral oils age faster above about 80 °C: shorten change intervals.')],
        });
    },
    "small-tool-substitution-check": (v) => {
      const dD = ((v.D2 / v.D1) ** 4 - 1) * 100, dL = ((v.L1 / v.L2) ** 2 - 1) * 100, ratio = (v.D2 / v.D1) ** 4 * (v.L1 / v.L2) ** 2, I = PI * (v.k * v.D2) ** 4 / 64, delta = v.F * v.Lo ** 3 / (3 * v.E * 1000 * I) * 1000;
      const Fok = delta > 0 ? v.F * v.dMax / delta : Infinity, feedOK = delta > 0 ? Math.min(v.feed, v.feed * v.dMax / delta) : v.feed, ok = delta <= v.dMax + 1e-12;
      return output({ dD, dL, ratio, I, delta, Fok: Number.isFinite(Fok) ? Fok : 0, feedOK }, 'Deflection of the new tool (µm)', delta,
        [m('Change from diameter / length', `${q(dD, '', 1)} / ${q(dL, '%', 1)}`), m('Stiffness new ÷ old', q(ratio, '', 3)), m('Deflection at the planned force', q(delta, 'µm', 2)), m('Force for the deflection limit', q(Fok, 'N', 2)), m('Feed for the deflection limit', q(feedOK, 'mm', 4))],
        'Small tool substitution check.', 'Cantilever tool; force proportional to feed.', {
          text: ok ? 'DEFLECTION WITHIN LIMIT' : 'REDUCE FEED', tone: ok ? 'good' : 'bad',
          checks: [check('Deflection', ok ? 'pass' : 'fail', `${q(delta, 'µm', 2)} against ${q(v.dMax, 'µm', 1)}${ok ? '.' : `: feed at ${q(feedOK, 'mm', 4)} or less.`}`), check('Holder and runout', 'verify', 'Runout adds directly to the effective deflection of small tools.')],
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
