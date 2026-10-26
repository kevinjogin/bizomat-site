// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook49). SI units are explicit at each boundary.
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
    "pump-suction-check": (v) => {
      if (v.pv >= v.ps) return invalid('The vapour pressure is at or above the surface pressure: the liquid will boil.');
      const d = v.d / 1000, A = PI * d * d / 4, vel = v.Q / 60000 / A, Re = vel * d / (v.nu * 1e-6);
      let f; const lam = Re < 2300;
      if (Re === 0) f = 0; else if (lam) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const hf = (f * v.L / d + v.K) * vel * vel / (2 * 9.80665), npsha = (v.ps - v.pv) * 1000 / (v.rho * 9.80665) + v.z - hf, marg = npsha - v.npshr, zMin = v.z - (marg - v.margin);
      const okN = marg >= v.margin, okV = vel <= v.vMax;
      return output({ vel, Re, f, hf, npsha, marg, zMin }, 'NPSH available (m)', npsha,
        [m('Suction velocity', q(vel, 'm/s', 2)), m('Reynolds number / friction factor', `${q(Re, '', 0)} / ${q(f, '', 5)}`), m('Suction head loss', q(hf, 'm', 3)), m('NPSH available', q(npsha, 'm', 2)), m('Margin over NPSH required', q(marg, 'm', 2)), m('Lowest liquid level for the margin', q(zMin, 'm', 2))],
        okN ? 'Enough suction head to avoid cavitation with the required margin.' : 'Not enough suction head: the pump risks cavitation.', 'Steady flow; NPSHr from the pump curve.', {
          text: !okN ? 'CAVITATION RISK' : okV ? 'SUCTION ADEQUATE' : 'SUCTION VELOCITY TOO HIGH', tone: okN && okV ? 'good' : 'bad',
          checks: [check('NPSH margin', okN ? 'pass' : 'fail', `${q(marg, 'm', 2)} against ${q(v.margin, 'm', 2)} required.`), check('Suction velocity', okV ? 'pass' : 'fail', `${q(vel, 'm/s', 2)} against ${q(v.vMax, 'm/s', 2)}.`), check('Submergence', 'verify', 'Keep the inlet deep enough below the lowest level to avoid vortices.')],
        });
    },
    "shoe-brake-stop-check": (v) => {
      const w = 2 * PI * v.n / 60, Tdec = v.J * w / v.t;
      if (v.Td >= Tdec) return invalid('The drag torque alone stops the load within this time.');
      const T = Tdec - v.Td, r = v.D / 2000, Ff = T / r, Nf = Ff / v.mu, energ = v.dir === 'energ', arm = energ ? v.b - v.mu * v.c : v.b + v.mu * v.c, locks = energ && arm <= 0, F = Math.max(0, Nf * arm / v.a), p = Nf / v.area;
      const E = v.J * w * w / 2, revs = v.n * v.t / 120, dT = E / (v.mDrum * v.cDrum * 1000), vs = w * r;
      const okF = F <= v.Favail, okP = p <= v.pAllow, okT = dT <= v.dTmax, ok = okF && okP && okT && !locks;
      return output({ T, Ff, Nf, F, p, locks: locks ? 1 : 0, E, revs, dT, vs }, 'Lever force (N)', F,
        [m('Braking torque', q(T, 'N·m', 1)), m('Shoe normal / friction force', `${q(Nf, '', 0)} / ${q(Ff, 'N', 0)}`), m('Lever force', locks ? 'None: the brake self-locks' : q(F, 'N', 0)), m('Lining pressure', q(p, 'MPa', 3)), m('Energy per stop', q(E / 1000, 'kJ', 2)), m('Revolutions to stop', q(revs, '', 1)), m('Rubbing speed', q(vs, 'm/s', 2)), m('Drum temperature rise per stop', q(dT, 'K', 2))],
        'Shoe brake stop check.', 'Short shoe; uniform pressure.', {
          text: ok ? 'BRAKE ADEQUATE' : 'BRAKE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Self-locking', locks ? 'fail' : 'pass', locks ? 'b ≤ μc: the brake grabs.' : 'Not self-locking.'), check('Lever force', okF ? 'pass' : 'fail', `${q(F, 'N', 0)} against ${q(v.Favail, 'N', 0)} available.`), check('Lining pressure', okP ? 'pass' : 'fail', `${q(p, 'MPa', 2)} against ${q(v.pAllow, 'MPa', 2)}.`), check('Drum heating', okT ? 'pass' : 'fail', `${q(dT, 'K', 1)} per stop against ${q(v.dTmax, 'K', 0)}.`)],
        });
    },
    "drive-torsional-check": (v) => {
      if (v.di >= v.d) return invalid('The bore must be smaller than the outside diameter.');
      if (v.nMax < v.nMin) return invalid('The highest speed must not be below the lowest.');
      const K = v.G * 1e9 * PI * ((v.d / 1000) ** 4 - (v.di / 1000) ** 4) / 32 / (v.Ls / 1000), Jeff = v.J1 * v.J2 / (v.J1 + v.J2), fn = Math.sqrt(K / Jeff) / (2 * PI), s = v.sep / 100;
      const rows = [], bad = [], gap = (nc) => (nc < v.nMin ? v.nMin - nc : nc > v.nMax ? nc - v.nMax : 0); let ncNear = Infinity;
      for (let k = 1; k <= v.orders; k++) {
        const lo = k * v.nMin / 60, hi = k * v.nMax / 60, clear = fn <= lo * (1 - s) || fn >= hi * (1 + s), nc = 60 * fn / k;
        if (!clear) bad.push(k); if (gap(nc) < gap(ncNear)) ncNear = nc;
        rows.push([`${k}×`, `${q(lo, '', 1)}–${q(hi, 'Hz', 1)}`, q(nc, 'rpm', 0), clear ? 'Clear' : 'Too close']);
      }
      const tau = 16 * v.T * 1000 * v.d / (PI * (v.d ** 4 - v.di ** 4)), twist = deg(v.T / K), okR = bad.length === 0, okS = tau <= v.tauA, ok = okR && okS;
      return output({ K, Jeff, fn, ncNear, tau, twist, nBad: bad.length }, 'Natural frequency (Hz)', fn,
        [m('Torsional stiffness', q(K, 'N·m/rad', 0)), m('Effective inertia', q(Jeff, 'kg·m²', 5)), m('Natural frequency', `${q(fn, 'Hz', 2)} (${q(fn * 60, 'cpm', 0)})`), m('Critical speed nearest the running range', q(ncNear, 'rpm', 0)), m('Orders too close', bad.length ? bad.map((k) => `${k}×`).join(', ') : 'None'), m('Shaft shear stress', q(tau, 'MPa', 1)), m('Angle of twist', q(twist, '°', 3))],
        'Drive shaft torsional check.', 'Two inertias; massless shaft; no damping.', {
          text: ok ? 'NO TORSIONAL PROBLEM' : 'TORSIONAL PROBLEM', tone: ok ? 'good' : 'bad',
          table: tbl('Excitation orders', ['Order', 'Excitation band', 'Critical speed', 'Result'], rows),
          checks: [check('Resonance', okR ? 'pass' : 'fail', okR ? `f_n is at least ${q(v.sep, '%', 0)} clear of every band.` : `f_n lies within ${q(v.sep, '%', 0)} of the ${bad.map((k) => `${k}×`).join(', ')} band.`), check('Shaft stress', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauA, 'MPa', 0)}.`), check('Other flexibilities', 'verify', 'Add coupling and gear stiffness in series for an accurate frequency.')],
        });
    },
    "flange-coupling-design": (v) => {
      const T = 9549.2966 * v.P / v.n * v.SF, Fb = 2 * T * 1000 / (v.nb * v.Dbc), tauBolt = Fb / (PI * v.db * v.db / 4), dreq = Math.sqrt(8 * T * 1000 / (PI * v.nb * v.Dbc * v.tauB)), Tf = v.mu * v.nb * v.Fi * 1000 * v.Dbc / 2 / 1000;
      const Fk = 2 * T * 1000 / v.ds, tauKey = Fk / (v.w * v.Lk), sigKey = Fk / (v.h / 2 * v.Lk), Ls = Fk / (v.w * v.tauK), Lc = Fk / (v.h / 2 * v.sigK), Lmin = Math.max(Ls, Lc);
      const okB = tauBolt <= v.tauB, okFr = Tf >= T, okKs = tauKey <= v.tauK, okKc = sigKey <= v.sigK, okL = v.Lk <= v.hubL, ok = okB && okKs && okKc && okL;
      return output({ T, Fb, tauBolt, dreq, Tf, Fk, tauKey, sigKey, Ls, Lc, Lmin }, 'Design torque (N·m)', T,
        [m('Design torque', q(T, 'N·m', 1)), m('Force per bolt', q(Fb, 'N', 0)), m('Bolt shear stress', q(tauBolt, 'MPa', 1)), m('Bolt shank needed', q(dreq, 'mm', 2)), m('Torque carried by friction', q(Tf, 'N·m', 0)), m('Key force', q(Fk / 1000, 'kN', 2)), m('Key shear / crushing stress', `${q(tauKey, '', 1)} / ${q(sigKey, 'MPa', 1)}`), m('Least key length', q(Lmin, 'mm', 1))],
        'Flange coupling design.', 'Steady torque; fitted bolts.', {
          text: ok ? 'COUPLING ADEQUATE' : 'COUPLING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bolt shear', okB ? 'pass' : 'fail', `${q(tauBolt, 'MPa', 1)} against ${q(v.tauB, 'MPa', 0)}.`), check('Friction drive', okFr ? 'pass' : 'warn', okFr ? `Friction carries ${q(Tf, 'N·m', 0)}, more than the design torque.` : `Friction carries only ${q(Tf, 'N·m', 0)}: use fitted bolts or more preload.`), check('Key shear', okKs ? 'pass' : 'fail', `${q(tauKey, 'MPa', 1)} against ${q(v.tauK, 'MPa', 0)}.`), check('Key crushing', okKc ? 'pass' : 'fail', `${q(sigKey, 'MPa', 1)} against ${q(v.sigK, 'MPa', 0)}.`), check('Key length', okL ? 'pass' : 'fail', `${q(v.Lk, 'mm', 0)} key in a ${q(v.hubL, 'mm', 0)} hub.`)],
        });
    },
    "gear-milling-setup": (v) => {
      const circles = v.plates === 'bs' ? [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49] : [24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66];
      const whole = Math.floor(v.ratio / v.z), rem = v.ratio % v.z, opts = rem === 0 ? [] : circles.filter((h) => (rem * h) % v.z === 0), found = rem === 0 || opts.length > 0;
      const circle = rem === 0 ? 0 : opts.length ? opts[0] : 0, holes = circle ? rem * circle / v.z : 0, setting = rem === 0 ? `${whole} whole turns` : found ? `${whole} turns and ${holes} holes in the ${circle}-hole circle` : 'differential indexing';
      const reg = [[135, '1'], [55, '2'], [35, '3'], [26, '4'], [21, '5'], [17, '6'], [14, '7'], [12, '8']], cutter = (reg.find((r) => v.z >= r[0]) || [0, 'below range'])[1];
      const D = v.m * v.z, Do = v.m * (v.z + 2), depth = v.m * (1 + v.ded), th = PI * v.m / 2 / D, tc = D * Math.sin(th), ac = v.m + D / 2 * (1 - Math.cos(th));
      return output({ whole, rem, circle, holes, count: opts.length, setting, cutter, D, Do, depth, tc, ac }, 'Crank turns per tooth', v.ratio / v.z,
        [m('Index setting', setting), m('Other index circles that work', opts.length > 1 ? opts.slice(1).join(', ') : 'None'), m('Involute cutter number', cutter), m('Pitch diameter', q(D, 'mm', 3)), m('Blank outside diameter', q(Do, 'mm', 3)), m('Whole depth of cut', q(depth, 'mm', 3)), m('Chordal thickness / chordal addendum', `${q(tc, '', 4)} / ${q(ac, 'mm', 4)}`)],
        found ? 'The tooth count can be simply indexed with these plates.' : 'No index circle divides this tooth count.', 'Form cutter; standard tooth proportions.', {
          text: found ? 'SET-UP FOUND' : 'NEEDS DIFFERENTIAL INDEXING', tone: found ? 'good' : 'bad',
          checks: [check('Indexing', found ? 'pass' : 'fail', found ? setting.charAt(0).toUpperCase() + setting.slice(1) + '.' : 'Use differential indexing or another plate set.'), check('Sector arms', circle ? 'verify' : 'pass', circle ? `Set the sector arms to span ${holes} spaces (${holes + 1} holes).` : 'Whole turns: no sector needed.'), check('Backlash', 'verify', 'Index in one direction only to take up worm backlash.')],
        });
    },
    "lubricant-viscosity-check": (v) => {
      if (v.T1 === v.T2) return invalid('The two data temperatures must differ.');
      const Y = (nu) => Math.log10(Math.log10(nu + 0.7)), X = (t) => Math.log10(t + 273.15), B = (Y(v.v1) - Y(v.v2)) / (X(v.T2) - X(v.T1)), A = Y(v.v1) + B * X(v.T1), at = (t) => Math.pow(10, Math.pow(10, A - B * X(t))) - 0.7;
      const nu = at(v.Top), nuCold = at(v.Tcold), cP = nu * v.sg, sus = nu * 4.632, ratio = nu / v.nuMin, lo = Math.min(v.T1, v.T2), hi = Math.max(v.T1, v.T2), inside = v.Top >= lo - 20 && v.Top <= hi + 20 && v.Tcold >= lo - 50;
      const okO = nu >= v.nuMin, okC = nuCold <= v.nuStart, ok = okO && okC;
      return output({ nu, nuCold, cP, sus, ratio, A, B }, 'Viscosity at operating temperature (cSt)', nu,
        [m('Viscosity at operating temperature', `${q(nu, 'cSt', 2)} (${q(cP, 'cP', 2)}, ${q(sus, 'SUS', 0)})`), m('Viscosity ratio to the least needed', q(ratio, '', 2)), m('Viscosity at the cold start', `${q(nuCold, 'cSt', 0)} (${q(nuCold * v.sg, 'cP', 0)})`)],
        'Lubricant viscosity check.', 'ASTM D341 relation through two points.', {
          text: ok ? 'GRADE SUITABLE' : 'GRADE NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Operating viscosity', okO ? 'pass' : 'fail', `${q(nu, 'cSt', 1)} against ${q(v.nuMin, 'cSt', 1)} needed${okO ? '.' : ': use a heavier grade or cool the oil.'}`), check('Cold start', okC ? 'pass' : 'fail', `${q(nuCold, 'cSt', 0)} against ${q(v.nuStart, 'cSt', 0)}${okC ? '.' : ': use a lighter grade or preheat.'}`), check('Extrapolation', inside ? 'pass' : 'warn', inside ? 'Temperatures are near the data points.' : 'Far outside the data temperatures: confirm with the oil maker.')],
        });
    },
    "rolled-plate-plan": (v) => {
      const Rf = (Ri) => { const x = Ri * v.YS / (v.E * 1000 * v.t); return Ri / (4 * x ** 3 - 3 * x + 1); };
      let lo = 0, hi = Math.min(v.Rt, 0.5 * v.E * 1000 * v.t / v.YS * (1 - 1e-12));
      for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (Rf(mid) < v.Rt) lo = mid; else hi = mid; }
      const Ri = (lo + hi) / 2, x = Ri * v.YS / (v.E * 1000 * v.t), blank = (v.Rt + v.t / 2) * rad(v.ang);
      const cb = (v.L - v.D) / 2, ce = v.type === 'concave' ? v.Hh - v.D : v.D - v.Hh;
      if (cb <= 0) return invalid('The measurement over rolls must exceed the roll diameter.');
      if (ce <= 0) return invalid(v.type === 'concave' ? 'For this set-up the height must exceed the roll diameter.' : 'For this set-up the height must be less than the roll diameter.');
      const ab = (cb * cb + ce * ce) / (2 * ce), Rm = v.type === 'concave' ? ab + v.D / 2 : ab - v.D / 2, target = v.surf === 'in' ? v.Rt : v.Rt + v.t, dev = Rm - target, ok = Math.abs(dev) <= v.tol;
      return output({ Ri, x, spring: v.Rt - Ri, blank, Rm, target, dev }, 'Roll-to inside radius (mm)', Ri,
        [m('Roll-to inside radius', q(Ri, 'mm', 2)), m('Springback (radius opens by)', q(v.Rt - Ri, 'mm', 2)), m('Blank length (mid-thickness)', q(blank, 'mm', 1)), m('Measured radius', q(Rm, 'mm', 2)), m('Target for the surface measured', q(target, 'mm', 2)), m('Deviation', `${dev >= 0 ? '+' : ''}${q(dev, 'mm', 2)}`)],
        'Rolled plate plan.', 'Elastic–perfectly plastic springback.', {
          text: ok ? 'RADIUS WITHIN TOLERANCE' : 'RADIUS OUT OF TOLERANCE', tone: ok ? 'good' : 'bad',
          checks: [check('Radius', ok ? 'pass' : 'fail', `${dev >= 0 ? '+' : ''}${q(dev, 'mm', 2)} against ±${q(v.tol, 'mm', 1)}${ok ? '.' : dev > 0 ? ': roll tighter.' : ': the radius is too small; it cannot be opened easily.'}`), check('Gauge geometry', ce / cb > 0.05 ? 'pass' : 'warn', ce / cb > 0.05 ? 'Reasonable gauge geometry.' : 'Shallow arc over the rolls: small height errors change the radius strongly.'), check('Material data', 'verify', 'Use the actual yield strength from the mill certificate.')],
        });
    },
    "hopper-bin-design": (v) => {
      if (v.d >= v.D) return invalid('The outlet must be smaller than the bin diameter.');
      const R = v.D / 2, r = v.d / 2, Vcone = PI * v.Hh * (v.D ** 2 + v.D * v.d + v.d ** 2) / 12 / 1e9, slant = Math.sqrt((R - r) ** 2 + v.Hh ** 2), side = PI * (R + r) * slant / 1e6, angle = deg(Math.atan2(v.Hh, R - r));
      const Vcyl = PI * v.D ** 2 / 4 * v.Hc / 1e9, Vtot = Vcone + Vcyl, mass = Vtot * v.fill / 100 * v.rhoB, area = side + PI * v.D * v.Hc / 1e6, plate = area * v.tp / 1000 * v.rhoS;
      const okM = mass >= v.need, okA = angle >= v.angMin, ok = okM && okA;
      return output({ Vcone, Vcyl, Vtot, mass, angle, side, area, plate, slant }, 'Mass held (kg)', mass,
        [m('Cone volume', q(Vcone, 'm³', 3)), m('Cylinder volume', q(Vcyl, 'm³', 3)), m('Total volume', q(Vtot, 'm³', 3)), m('Mass held at the fill level', q(mass, 'kg', 0)), m('Cone wall angle from horizontal', q(angle, '°', 1)), m('Plate area', q(area, 'm²', 2)), m('Plate mass', q(plate, 'kg', 0))],
        'Hopper and bin design.', 'Level fill; centred outlet.', {
          text: ok ? 'HOPPER ADEQUATE' : 'HOPPER NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Capacity', okM ? 'pass' : 'fail', `${q(mass, 'kg', 0)} against ${q(v.need, 'kg', 0)} needed.`), check('Wall angle', okA ? 'pass' : 'fail', `${q(angle, '°', 1)} against ${q(v.angMin, '°', 0)}${okA ? '.' : ': make the cone taller or the outlet larger.'}`), check('Structure', 'verify', 'Check the shell, ring beam and supports for the material and wall pressures.')],
        });
    },
    "knurling-setup": (v) => {
      const dp = v.system === 'dp', Din = v.D / 25.4, teeth = dp ? v.P * Din : PI * v.D / v.t, lo = Math.floor(teeth), hi = Math.ceil(teeth) === lo ? lo + 1 : Math.ceil(teeth), dia = (k) => (dp ? k / v.P * 25.4 : k * v.t / PI);
      if (lo < 1) return invalid('The blank is too small for this knurl pitch.');
      const near = Math.round(teeth), Dnear = dia(near), off = v.D - Dnear, n = 1000 * v.vc / (PI * v.D), time = v.L * v.passes / (v.f * n), ok = Math.abs(off) <= v.tolD + 1e-12;
      return output({ teeth, lower: dia(lo), upper: dia(hi), Dnear, off, n, time }, 'Teeth on the planned blank', teeth,
        [m('Teeth on the planned blank', q(teeth, '', 3)), m('Tracking diameters either side', `${q(dia(lo), '', 4)} (${lo}) / ${q(dia(hi), 'mm', 4)} (${hi})`), m('Nearest tracking diameter', q(Dnear, 'mm', 4)), m('Blank off the tracking diameter by', q(off, 'mm', 4)), m('Spindle speed', q(n, 'rpm', 0)), m('Knurling time', q(time * 60, 's', 1))],
        'Knurling set-up.', 'Straight knurl; full-depth tracking.', {
          text: ok ? 'BLANK TRACKS' : 'ADJUST BLANK DIAMETER', tone: ok ? 'good' : 'bad',
          checks: [check('Tracking', ok ? 'pass' : 'fail', ok ? `Within ${q(v.tolD, 'mm', 3)} of ${q(Dnear, 'mm', 4)}.` : `Turn the blank to ${q(Dnear, 'mm', 4)} (${near} teeth).`), check('Knurl condition', 'verify', 'Worn or chipped knurls track poorly whatever the diameter.')],
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
