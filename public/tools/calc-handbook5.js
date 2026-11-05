// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook5). SI units are explicit at each boundary.
// Methods are standard engineering relations; no handbook tables, ratings or recommended settings are reproduced.
// Material properties, ratings, factors and limits are always entered by the user.
(() => {
  const PI = Math.PI;
  const rad = (degrees) => degrees * PI / 180;
  const deg = (radians) => radians * 180 / PI;
  const area = (d) => PI * d * d / 4;
  const ATM = 1.01325; // standard atmosphere, bar
  const q = (value, unit, digits = 4) => {
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
    "force-resultant": (v) => {
      let rx = 0, ry = 0; const rows = [];
      for (let i = 1; i <= 4; i++) { const F = v['F' + i], a = rad(v['a' + i]); if (!F) continue; rx += F * Math.cos(a); ry += F * Math.sin(a); rows.push([`Force ${i}`, q(F, 'N'), q(v['a' + i], '°'), q(F * Math.cos(a), 'N'), q(F * Math.sin(a), 'N')]); }
      if (!rows.length) return invalid('Enter at least one force.');
      const R = Math.hypot(rx, ry), dir = ((deg(Math.atan2(ry, rx)) % 360) + 360) % 360;
      return output({ rx, ry, R, dir }, 'Resultant (N)', R,
        [m('Rx', q(rx, 'N')), m('Ry', q(ry, 'N')), m('Resultant', q(R, 'N')), m('Resultant direction', q(dir, '°')), m('Equilibrant direction', q((dir + 180) % 360, '°'))],
        `${rows.length} concurrent forces combine into one resultant.`, 'Coplanar forces through one point only.', {
          table: tbl('Force components', ['Force', 'Magnitude', 'Direction', 'X component', 'Y component'], rows),
          checks: [check('Concurrent forces', 'verify', 'Confirm all lines of action pass through one point.')],
        });
    },
    "inclined-plane": (v) => {
      const W = v.mass * 9.80665, s = Math.sin(rad(v.angle)), c = Math.cos(rad(v.angle));
      const up = W * (s + v.mu * c), hold = W * (s - v.mu * c), down = W * (v.mu * c - s), eff = s === 0 ? 0 : 100 * s / (s + v.mu * c), locks = v.mu >= Math.tan(rad(v.angle));
      return output({ up, hold, down, eff, W }, 'Force to push up (N)', up,
        [m('Push up the slope', q(up, 'N', 1)), m('Hold in place', hold > 0 ? q(hold, 'N', 1) : 'None: friction holds the load'), m('Pull down the slope', down > 0 ? q(down, 'N', 1) : 'None: the load slides down'), m('Efficiency raising', q(eff, '%', 1)), m('Load weight', q(W, 'N', 1))],
        locks ? 'Friction holds the load on this slope without a holding force.' : 'The load will slide down unless it is held.', 'Steady sliding; acceleration and rolling resistance excluded.', {
          checks: [check('Self-locking', locks ? 'pass' : 'warn', locks ? 'μ ≥ tan θ: the load stays put without a brake.' : 'μ < tan θ: provide a brake or holding device.')],
        });
    },
    "flywheel-energy": (v) => {
      if (v.inner >= v.outer) return invalid('The inner diameter must be smaller than the outer diameter.');
      if (v.nmin >= v.nmax) return invalid('The minimum speed must be lower than the maximum speed.');
      const R = v.outer / 2000, r = v.inner / 2000, J = v.mass * (R * R + r * r) / 2, w1 = 2 * PI * v.nmax / 60, w2 = 2 * PI * v.nmin / 60;
      const dE = 0.5 * J * (w1 * w1 - w2 * w2), KE = 0.5 * J * w1 * w1, cs = 2 * (v.nmax - v.nmin) / (v.nmax + v.nmin), rim = PI * v.outer * v.nmax / 60000, ok = rim <= v.vmax;
      return output({ J, dE, KE, cs, rim }, 'Energy released (J)', dE,
        [m('Moment of inertia', q(J, 'kg·m²')), m('Energy released', q(dE, 'J', 1)), m('Kinetic energy at max speed', q(KE, 'J', 1)), m('Coefficient of fluctuation', q(cs, '', 4)), m('Rim speed', q(rim, 'm/s', 2))],
        `Energy given up as the flywheel slows from ${v.nmax} to ${v.nmin} rpm.`, 'Disc or ring inertia only; hub and shaft excluded unless included in the mass.', {
          text: ok ? 'RIM SPEED WITHIN LIMIT' : 'RIM SPEED TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Rim speed', ok ? 'pass' : 'fail', `${q(rim, 'm/s', 2)} against ${q(v.vmax, 'm/s', 2)} allowed.`)],
        });
    },
    "centrifugal-force": (v) => {
      const w = 2 * PI * v.rpm / 60, r = v.radius / 1000, F = v.mass * w * w * r, g = w * w * r / 9.80665;
      return output({ F, g, speed: w * r }, 'Centrifugal force (N)', F,
        [m('Centrifugal force', q(F, 'N', 1)), m('Acceleration', q(g, 'g', 1)), m('Tangential speed', q(w * r, 'm/s', 2))],
        'Outward force on the rotating mass at steady speed.', 'Rigid body at steady speed.', {
          checks: [check('Retention capacity', 'verify', 'Compare with the holding capacity of the clamp, bolt or jaw.')],
        });
    },
    "balance-grade": (v) => {
      const G = Number(v.grade), w = 2 * PI * v.rpm / 60, e = G * 1000 / w, U = e * v.mass, per = v.planes === '2' ? U / 2 : U;
      const has = v.measured > 0, ok = v.measured <= per;
      return output({ e, U, per }, 'Permissible residual unbalance (g·mm)', U,
        [m('Permissible residual unbalance', q(U, 'g·mm', 1)), m('Per correction plane', q(per, 'g·mm', 1)), m('Permissible specific unbalance', q(e, 'µm (g·mm/kg)', 2)), m('Correction mass at 100 mm radius', q(per / 100, 'g', 3))],
        `Balance grade G ${v.grade} at ${v.rpm} rpm.`, 'Rigid rotor; equal plane allocation assumed for two planes.', {
          ...(has ? (ok ? { text: 'WITHIN TOLERANCE', tone: 'good' } : { text: 'OUT OF TOLERANCE', tone: 'bad' }) : {}),
          checks: [check('Measured residual unbalance', has ? (ok ? 'pass' : 'fail') : 'verify', has ? `${q(v.measured, 'g·mm', 1)} per plane against ${q(per, 'g·mm', 1)}.` : 'Enter the balancing machine result to check it.')],
        });
    },
    "impact-load": (v) => {
      const g = 9.80665, s = v.stop / 1000, vel = v.mode === 'drop' ? Math.sqrt(2 * g * v.height / 1000) : v.speed;
      const E = v.mode === 'drop' ? v.mass * g * (v.height / 1000 + s) : 0.5 * v.mass * vel * vel, Favg = E / s;
      return output({ vel, E, Favg, Fpeak: 2 * E / s }, 'Energy to absorb (J)', E,
        [m('Impact speed', q(vel, 'm/s', 3)), m('Energy to absorb', q(E, 'J', 1)), m('Average stopping force', q(Favg, 'N', 0)), m('Peak force, linear spring stop', q(2 * E / s, 'N', 0)), m('Average deceleration', q(Favg / v.mass / g, 'g', 1))],
        'Energy and force when the mass is brought to rest over the stopping distance.', 'Rigid bodies; actual stop characteristics vary.', {
          checks: [check('Absorber rating', 'verify', 'Compare energy per stroke and peak force with the buffer or absorber rating.')],
        });
    },
    "move-profile": (v) => {
      const L = v.distance, V = v.vmax, a = v.accel, trap = L >= V * V / a;
      const t = trap ? L / V + V / a : 2 * Math.sqrt(L / a), peak = trap ? V : Math.sqrt(a * L), ta = peak / a, F = v.mass * a / 1000;
      return output({ t, peak, ta, F }, 'Move time (s)', t,
        [m('Move time', q(t, 's', 4)), m('Profile', trap ? 'Trapezoidal (reaches maximum speed)' : 'Triangular (does not reach maximum speed)'), m('Peak speed', q(peak, 'mm/s', 1)), m('Acceleration time', q(ta, 's', 4)), m('Acceleration distance', q(peak * peak / (2 * a), 'mm', 2)), m('Acceleration force', q(F, 'N', 1))],
        trap ? 'The axis accelerates, cruises at maximum speed and decelerates.' : 'The move is too short to reach maximum speed.', 'Constant acceleration; jerk, settling, friction and gravity excluded.', {
          checks: [check('Drive force', 'verify', 'Add friction, gravity and process forces before sizing the drive.')],
        });
    },
    "sling-tension": (v) => {
      const c = Math.cos(rad(v.angle)), kg = v.mass / (v.legs * c), N = kg * 9.80665, ok = kg <= v.wll;
      return output({ kg, N, factor: 1 / c }, 'Tension per leg (kg)', kg,
        [m('Tension per leg', `${q(kg, 'kg', 1)} (${q(N / 1000, 'kN', 2)})`), m('Angle factor', q(1 / c, '', 3)), m('Use of leg WLL', q(100 * kg / v.wll, '%', 1)), m('Included angle', q(2 * v.angle, '°', 1))],
        `${v.legs} legs at ${v.angle}° from vertical.`, 'Symmetrical load with equal leg angles; not a lift plan.', {
          text: ok ? 'WITHIN LEG WLL' : 'LEG OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Leg tension within WLL', ok ? 'pass' : 'fail', `${q(kg, 'kg', 1)} against ${q(v.wll, 'kg', 0)}.`), check('Leg angle', v.angle <= 60 ? 'pass' : 'warn', v.angle <= 60 ? 'Within 60° from vertical.' : 'Over 60° from vertical; many lifting codes do not permit this.'), check('Lift plan', 'verify', 'Confirm centre of gravity, hardware ratings and the lift plan with a competent person.')],
        });
    },
    "combined-cg": (v) => {
      let M = 0, X = 0, Y = 0, Z = 0; const rows = [];
      for (let i = 1; i <= 5; i++) { const mi = v['m' + i]; if (!mi) continue; M += mi; X += mi * v['x' + i]; Y += mi * v['y' + i]; Z += mi * v['z' + i]; rows.push([`Mass ${i}`, q(mi, 'kg'), q(v['x' + i], ''), q(v['y' + i], ''), q(v['z' + i], '')]); }
      if (M <= 0) return invalid('Enter at least one mass greater than zero.');
      X /= M; Y /= M; Z /= M;
      return output({ M, X, Y, Z }, 'Total mass (kg)', M,
        [m('Total mass', q(M, 'kg', 2)), m('Centre of gravity X', q(X, 'mm', 2)), m('Centre of gravity Y', q(Y, 'mm', 2)), m('Centre of gravity Z', q(Z, 'mm', 2))],
        `${rows.length} masses combined about a common datum.`, 'Accuracy depends on each item’s known centre of gravity.', {
          table: tbl('Items', ['Item', 'Mass', 'X (mm)', 'Y (mm)', 'Z (mm)'], rows),
          checks: [check('Item data', 'verify', 'Confirm each item’s mass and centre of gravity from weighing or CAD.')],
        });
    },
    "mass-moment-inertia": (v) => {
      const a = v.dimA / 1000, b = v.dimB / 1000, mm = v.mass;
      if (v.shape === 'ring' && b >= a) return invalid('The inner diameter must be smaller than the outer diameter.');
      const Jc = { disc: mm * a * a / 8, ring: mm * (a * a + b * b) / 8, cyltrans: mm * (3 * (a / 2) ** 2 + b * b) / 12, block: mm * (a * a + b * b) / 12, sphere: 0.4 * mm * (a / 2) ** 2, rod: mm * a * a / 3 }[v.shape];
      const J = Jc + mm * (v.offset / 1000) ** 2;
      return output({ Jc, J, k: Math.sqrt(J / mm) * 1000 }, 'Moment of inertia (kg·m²)', J,
        [m('About the body axis', q(Jc, 'kg·m²', 6)), m('About the rotation axis', q(J, 'kg·m²', 6)), m('Radius of gyration', q(Math.sqrt(J / mm) * 1000, 'mm', 2))],
        'Mass moment of inertia of an idealised uniform body.', 'Uniform density and idealised shape.', {
          checks: [check('Geometry', 'verify', 'Confirm the shape idealisation; use CAD mass properties for complex parts.')],
        });
    },
    "belt-friction": (v) => {
      const mue = v.groove > 0 ? v.mu / Math.sin(rad(v.groove / 2)) : v.mu, ratio = Math.exp(mue * rad(v.wrap)), T1 = v.slack * ratio;
      return output({ mue, ratio, T1, net: T1 - v.slack }, 'Tight-side tension (N)', T1,
        [m('Maximum tight-side tension', q(T1, 'N', 1)), m('Tension ratio T₁/T₂', q(ratio, '', 3)), m('Net (transmissible) force', q(T1 - v.slack, 'N', 1)), m('Effective friction coefficient', q(mue, '', 4))],
        'Tension ratio at the point of slip.', 'Impending slip; centrifugal tension excluded.', {
          checks: [check('Friction coefficient', 'verify', 'Use a conservative coefficient for wet, oily or worn surfaces.')],
        });
    },
    "column-buckling": (v) => {
      const E = v.E * 1000, r = Math.sqrt(v.I / v.A), lambda = v.K * v.L / r, Cc = PI * Math.sqrt(2 * E / v.Sy), euler = lambda >= Cc;
      const scr = euler ? PI * PI * E / (lambda * lambda) : v.Sy - (v.Sy * lambda / (2 * PI)) ** 2 / E, Pcr = scr * v.A, n = Pcr / v.P, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ r, lambda, Cc, scr, Pcr, n }, 'Safety factor against buckling', n,
        [m('Slenderness ratio KL/r', q(lambda, '', 1)), m('Transition slenderness C_c', q(Cc, '', 1)), m('Method', euler ? 'Euler (slender)' : 'Johnson (intermediate)'), m('Critical stress', q(scr, 'MPa', 1)), m('Critical load', q(Pcr / 1000, 'kN', 2)), m('Safety factor', q(n, '', 2))],
        `${euler ? 'Euler' : 'Johnson'} buckling governs this member.`, 'Straight, centrally loaded member; imperfections and local buckling not checked.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Safety factor against buckling', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 2)} required.`), check('Applied stress below yield', v.P / v.A < v.Sy ? 'pass' : 'fail', `${q(v.P / v.A, 'MPa', 1)} direct stress.`), check('End conditions', 'verify', 'Confirm the effective length factor reflects the real end restraint.')],
        });
    },
    "principal-stress": (v) => {
      const c = (v.sx + v.sy) / 2, R = Math.sqrt(((v.sx - v.sy) / 2) ** 2 + v.txy ** 2), s1 = c + R, s2 = c - R, theta = deg(Math.atan2(2 * v.txy, v.sx - v.sy)) / 2;
      const vm = Math.sqrt(s1 * s1 - s1 * s2 + s2 * s2), tresca = Math.max(Math.abs(s1 - s2), Math.abs(s1), Math.abs(s2)), n = vm > 0 ? v.Sy / vm : 1e9, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ s1, s2, theta, tmax: tresca / 2, vm, tresca, n }, 'von Mises stress (MPa)', vm,
        [m('Principal stress σ₁', q(s1, 'MPa', 2)), m('Principal stress σ₂', q(s2, 'MPa', 2)), m('Principal angle', q(theta, '°', 2)), m('Maximum shear stress', q(tresca / 2, 'MPa', 2)), m('von Mises stress', q(vm, 'MPa', 2)), m('Safety factor (von Mises)', vm > 0 ? q(n, '', 2) : 'No stress')],
        'Plane stress state resolved into principal stresses.', 'Plane stress; ductile isotropic material.', {
          text: vd.text, tone: vd.tone,
          checks: [check('von Mises safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 2)} required.`), check('Tresca safety factor', v.Sy / tresca >= v.req ? 'pass' : 'warn', `${q(v.Sy / tresca, '', 2)} by the maximum shear criterion.`)],
        });
    },
    "pressure-cylinder": (v) => {
      const ri = v.di / 2, ro = ri + v.t, k = ro * ro - ri * ri, hoop = v.p * (ro * ro + ri * ri) / k, sr = -v.p, sz = v.ends === 'closed' ? v.p * ri * ri / k : 0;
      const vm = Math.sqrt(0.5 * ((hoop - sr) ** 2 + (sr - sz) ** 2 + (sz - hoop) ** 2)), thin = v.p * (v.di + v.t) / (2 * v.t), n = v.Sy / vm, vd = verdict(n, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ hoop, sr, sz, thin, vm, n }, 'Safety factor (von Mises)', n,
        [m('Hoop stress at bore (Lamé)', q(hoop, 'MPa', 1)), m('Longitudinal stress', q(sz, 'MPa', 1)), m('Radial stress at bore', q(sr, 'MPa', 1)), m('Thin-wall hoop stress', q(thin, 'MPa', 1)), m('von Mises at bore', q(vm, 'MPa', 1)), m('Safety factor', q(n, '', 2))],
        `Wall stress at the bore for ${q(v.p, 'MPa')} internal pressure.`, 'Elastic stress away from ends, ports and welds; not a code design.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Safety factor against yield', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 2)} required.`), check('Wall ratio', v.t / v.di <= 0.05 ? 'pass' : 'warn', v.t / v.di <= 0.05 ? 'Thin wall: both methods agree closely.' : 'Thick wall: use the Lamé result.'), check('Pressure equipment code', 'verify', 'Design and certify pressure equipment to the applicable code.')],
        });
    },
    "goodman-fatigue": (v) => {
      if (v.sa === 0 && v.sm === 0) return invalid('Enter an alternating or mean stress.');
      const comp = v.sm <= 0, nG = comp ? v.Se / v.sa : 1 / (v.sa / v.Se + v.sm / v.Su), nS = comp ? v.Se / v.sa : 1 / (v.sa / v.Se + v.sm / v.Sy);
      const nGb = comp || v.sa === 0 ? (v.sa ? v.Se / v.sa : v.Su / v.sm) : 0.5 * (v.Su / v.sm) ** 2 * (v.sa / v.Se) * (-1 + Math.sqrt(1 + (2 * v.sm * v.Se / (v.Su * v.sa)) ** 2));
      const ny = v.Sy / (v.sa + Math.abs(v.sm)), gov = Math.min(nG, ny), vd = verdict(gov, v.req, 'ADEQUATE', 'INADEQUATE');
      return output({ nG, nS, nGb, ny, gov }, 'Governing safety factor', gov,
        [m('Goodman', q(nG, '', 3)), m('Soderberg', q(nS, '', 3)), m('Gerber', q(nGb, '', 3)), m('First-cycle yield', q(ny, '', 3)), m('Governing (Goodman or yield)', q(gov, '', 3))],
        comp ? 'Mean stress is compressive: the alternating stress alone governs fatigue.' : 'Fatigue factors for the combined mean and alternating stress.', 'Infinite-life criteria; endurance limit supplied by the user.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Governing safety factor', vd.st, `${q(gov, '', 2)} against ${q(v.req, '', 2)} required.`), check('Corrected endurance limit', 'verify', 'Confirm Se includes surface, size, load, temperature and reliability factors.')],
        });
    },
    "beam-cases": (v) => {
      const E = v.E * 1000, L = v.L, P = v.load, EI = E * v.I; let M, defl, R1, R2, where;
      if (v.case === 'ss-offset') {
        if (v.a <= 0 || v.a >= L) return invalid('The load position must lie between the supports.');
        const b = L - v.a, s = Math.min(v.a, b); R1 = P * b / L; R2 = P * v.a / L; M = P * v.a * b / L; defl = P * s * Math.pow(L * L - s * s, 1.5) / (9 * Math.sqrt(3) * EI * L); where = 'under the load';
      } else if (v.case === 'cant-udl') { R1 = P; R2 = 0; M = P * L / 2; defl = P * L ** 3 / (8 * EI); where = 'at the fixed end'; }
      else if (v.case === 'ff-point') { R1 = R2 = P / 2; M = P * L / 8; defl = P * L ** 3 / (192 * EI); where = 'at the ends and centre'; }
      else if (v.case === 'ff-udl') { R1 = R2 = P / 2; M = P * L / 12; defl = P * L ** 3 / (384 * EI); where = 'at the fixed ends'; }
      else { R1 = 5 * P / 8; R2 = 3 * P / 8; M = P * L / 8; const xr = (1 + Math.sqrt(33)) / 16, w = P / L, xx = xr * L; defl = w * xx * (L ** 3 - 3 * L * xx * xx + 2 * xx ** 3) / (48 * EI); where = 'at the fixed end'; }
      const stress = M * v.c / v.I, ok = stress <= v.allow;
      return output({ R1, R2, M, stress, defl, ratio: L / defl }, 'Maximum deflection (mm)', defl,
        [m('Reactions', `${q(R1, 'N', 1)} and ${q(R2, 'N', 1)}`), m('Maximum bending moment', `${q(M / 1000, 'N·m', 2)} ${where}`), m('Bending stress', q(stress, 'MPa', 1)), m('Stress / allowable', q(stress / v.allow, '', 3)), m('Maximum deflection', q(defl, 'mm', 4)), m('Span / deflection', `L/${q(L / defl, '', 0)}`)],
        'Elastic beam solution for the selected case.', 'Constant section, small deflection; self-weight not included.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa', 1)} allowed.`), check('Deflection limit', 'verify', `Compare L/${q(L / defl, '', 0)} with the limit in your design brief.`)],
        });
    },
    "shaft-diameter": (v) => {
      const Te = Math.sqrt((v.Km * v.M) ** 2 + (v.Kt * v.T) ** 2) * 1000, tau = v.keyway === 'yes' ? 0.75 * v.tau : v.tau;
      if (Te <= 0) return invalid('Enter a bending moment or torque.');
      const dreq = Math.cbrt(16 * Te / (PI * tau)), has = v.d > 0, tauAct = has ? 16 * Te / (PI * v.d ** 3) : 0, ok = !has || v.d >= dreq;
      return output({ dreq, Te, tauAct }, 'Required diameter (mm)', dreq,
        [m('Required diameter', q(dreq, 'mm', 2)), m('Equivalent torque', q(Te / 1000, 'N·m', 1)), m('Allowable shear used', q(tau, 'MPa', 1)), m('Shear stress in checked diameter', has ? q(tauAct, 'MPa', 1) : 'No diameter entered')],
        'Maximum-shear-stress sizing with shock and fatigue factors.', 'Solid shaft; stress concentration, deflection and critical speed checked separately.', {
          ...(has ? (ok ? { text: 'DIAMETER ADEQUATE', tone: 'good' } : { text: 'DIAMETER TOO SMALL', tone: 'bad' }) : {}),
          checks: [check('Checked diameter', has ? (ok ? 'pass' : 'fail') : 'verify', has ? `${q(v.d, 'mm')} against ${q(dreq, 'mm', 2)} required.` : 'Enter a diameter to check it.'), check('Deflection and critical speed', 'verify', 'Check shaft slope at bearings and the critical speed separately.')],
        });
    },
    "critical-speed": (v) => {
      const d = v.d / 1000, L = v.L / 1000, E = v.E * 1e9, I = PI * d ** 4 / 64, A = PI * d * d / 4, EI = E * I;
      const bl = { ss: PI, cf: 1.8751, ff: 4.7300 }[v.support], ws = (bl / L) ** 2 * Math.sqrt(EI / (v.rho * A));
      const k = { ss: 48, cf: 3, ff: 192 }[v.support] * EI / L ** 3, wd = v.disc > 0 ? Math.sqrt(k / v.disc) : Infinity;
      const w = v.disc > 0 ? 1 / Math.sqrt(1 / (ws * ws) + 1 / (wd * wd)) : ws, nc = 60 * w / (2 * PI), ns = 60 * ws / (2 * PI), ratio = v.rpm / nc, mg = v.margin / 100;
      const state = ratio <= 1 - mg ? { text: 'BELOW CRITICAL', tone: 'good', st: 'pass' } : ratio >= 1 + mg ? { text: 'ABOVE CRITICAL', tone: 'warn', st: 'warn' } : { text: 'NEAR CRITICAL', tone: 'bad', st: 'fail' };
      return output({ ns, nc, ratio }, 'Critical speed (rpm)', nc,
        [m('Critical speed, shaft alone', q(ns, 'rpm', 0)), m('Critical speed with disc', v.disc > 0 ? q(nc, 'rpm', 0) : 'No disc'), m('Operating / critical', q(100 * ratio, '%', 1))],
        `First critical speed for ${{ ss: 'simple supports', cf: 'an overhung shaft', ff: 'fixed ends' }[v.support]}.`, 'Rigid bearings; Dunkerley combination is slightly conservative.', {
          text: state.text, tone: state.tone,
          checks: [check('Separation from critical speed', state.st, `Running at ${q(100 * ratio, '%', 1)} of critical; margin required ±${q(v.margin, '%', 0)}.`), check('Support stiffness', 'verify', 'Flexible bearings or frames lower the critical speed.')],
        });
    },
    "circular-plate": (v) => {
      const E = v.E * 1000, D = E * v.t ** 3 / (12 * (1 - v.nu * v.nu)), cl = v.edge === 'clamped';
      const stress = cl ? 3 * v.p * v.a * v.a / (4 * v.t * v.t) : 3 * (3 + v.nu) * v.p * v.a * v.a / (8 * v.t * v.t);
      const defl = cl ? v.p * v.a ** 4 / (64 * D) : (5 + v.nu) * v.p * v.a ** 4 / (64 * (1 + v.nu) * D), ok = stress <= v.allow, small = defl <= v.t / 2;
      return output({ stress, defl, D }, 'Maximum bending stress (MPa)', stress,
        [m('Maximum bending stress', `${q(stress, 'MPa', 1)} ${cl ? 'at the edge' : 'at the centre'}`), m('Centre deflection', q(defl, 'mm', 4)), m('Deflection / thickness', q(defl / v.t, '', 3)), m('Stress / allowable', q(stress / v.allow, '', 3))],
        `Uniform pressure on a ${cl ? 'clamped' : 'simply supported'} circular plate.`, 'Small-deflection plate theory; not a code design.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa', 1)}.`), check('Small-deflection validity', small ? 'pass' : 'warn', small ? 'Deflection is under half the thickness.' : 'Deflection exceeds half the thickness; the result is not reliable.')],
        });
    },
    "press-fit": (v) => {
      if (!(v.D > v.d) || !(v.d > v.di)) return invalid('Diameters must satisfy hub outside > interface > shaft bore.');
      const Eh = v.Eh * 1000, Es = v.Es * 1000, kh = (v.D ** 2 + v.d ** 2) / (v.D ** 2 - v.d ** 2), ks = (v.d ** 2 + v.di ** 2) / (v.d ** 2 - v.di ** 2);
      const p = v.delta / (v.d * ((kh + v.nuh) / Eh + (ks - v.nus) / Es)), hoop = p * kh, vm = Math.sqrt(hoop * hoop + hoop * p + p * p);
      const T = v.mu * p * PI * v.d * v.d * v.L / 2 / 1000, F = v.mu * p * PI * v.d * v.L, dT = (v.delta + v.clear) / (v.alpha * 1e-6 * v.d), n = v.Sy / vm, vd = verdict(n, v.req, 'ADEQUATE', 'HUB OVERSTRESSED');
      return output({ p, hoop, vm, T, F, dT, n }, 'Holding torque (N·m)', T,
        [m('Interface pressure', q(p, 'MPa', 1)), m('Hub hoop stress at bore', q(hoop, 'MPa', 1)), m('Hub von Mises at bore', q(vm, 'MPa', 1)), m('Holding torque', q(T, 'N·m', 1)), m('Axial holding force', q(F / 1000, 'kN', 2)), m('Hub temperature rise to assemble', q(dT, 'K', 0))],
        'Elastic interference fit between hub and shaft.', 'Lamé plane-stress solution; hub ends, keyways and roughness not modelled.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Hub stress safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 2)}.`), check('Heating temperature', dT < 250 ? 'pass' : 'warn', dT < 250 ? `About ${q(dT, 'K', 0)} above ambient.` : 'High heating temperature: check tempering or property loss of the hub material.'), check('Interference range', 'verify', 'Repeat at minimum and maximum interference from the fit tolerances.')],
        });
    },
    "thermal-stress": (v) => {
      const strain = v.alpha * 1e-6 * v.dT, stress = -v.E * 1000 * strain * v.restraint / 100, force = stress * v.A, n = stress === 0 ? 1e9 : v.Sy / Math.abs(stress);
      return output({ strain, stress, force, n }, 'Thermal stress (MPa)', stress,
        [m('Thermal stress', `${q(Math.abs(stress), 'MPa', 1)} ${stress < 0 ? 'compressive' : stress > 0 ? 'tensile' : ''}`.trim()), m('Force on restraints', q(Math.abs(force) / 1000, 'kN', 2)), m('Unrestrained expansion strain', q(strain * 1e6, 'µm/m', 1)), m('Safety factor against yield', stress === 0 ? 'No stress' : q(n, '', 2))],
        `Stress from a ${q(v.dT, 'K', 1)} temperature change with ${q(v.restraint, '%', 0)} restraint.`, 'Uniform temperature; buckling checked separately.', {
          checks: [check('Stress below yield', n >= 1 ? 'pass' : 'fail', stress === 0 ? 'No restrained stress.' : `${q(Math.abs(stress), 'MPa', 1)} against ${q(v.Sy, 'MPa')}.`), check('Buckling in compression', stress < 0 ? 'verify' : 'pass', stress < 0 ? 'Check slender members for buckling.' : 'No compressive stress.')],
        });
    },
    "hertz-contact": (v) => {
      const Es = 1 / ((1 - v.nu1 ** 2) / (v.E1 * 1000) + (1 - v.nu2 ** 2) / (v.E2 * 1000)), inv = 1 / v.R1 + (v.R2 === 0 ? 0 : 1 / v.R2);
      if (inv <= 0) return invalid('The concave radius must be larger than the convex radius.');
      const R = 1 / inv; let size, p0, tmax, depth, approach = null;
      if (v.geom === 'sphere') { size = Math.cbrt(3 * v.F * R / (4 * Es)); p0 = 3 * v.F / (2 * PI * size * size); tmax = 0.31 * p0; depth = 0.48 * size; approach = size * size / R; }
      else { size = Math.sqrt(4 * v.F * R / (PI * v.L * Es)); p0 = 2 * v.F / (PI * size * v.L); tmax = 0.30 * p0; depth = 0.786 * size; }
      const ok = p0 <= v.allow;
      return output({ size, p0, tmax, depth, R, Es }, 'Maximum contact pressure (MPa)', p0,
        [m(v.geom === 'sphere' ? 'Contact radius a' : 'Contact half-width b', q(size, 'mm', 4)), m('Maximum contact pressure', q(p0, 'MPa', 0)), m('Maximum subsurface shear', q(tmax, 'MPa', 0)), m('Depth of maximum shear', q(depth, 'mm', 4)), m('Effective radius', q(R, 'mm', 3)), ...(approach !== null ? [m('Approach of bodies', q(approach * 1000, 'µm', 2))] : [])],
        'Hertz elastic contact between the two bodies.', 'Smooth, frictionless elastic contact; edge effects excluded.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'ABOVE ALLOWABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Contact pressure', ok ? 'pass' : 'fail', `${q(p0, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Hardened depth', 'verify', `Case depth should comfortably exceed ${q(depth, 'mm', 3)}.`)],
        });
    },
    "compression-spring": (v) => {
      const G = v.G * 1000, k = G * v.d ** 4 / (8 * v.D ** 3 * v.Na), C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, Nt = { cg: v.Na + 2, c: v.Na + 2, pg: v.Na + 1, p: v.Na }[v.ends], Ls = (v.ends === 'cg' || v.ends === 'pg' ? Nt : Nt + 1) * v.d;
      if (v.Lw < Ls) return invalid(`The working length is below the solid length (${q(Ls, 'mm', 2)}).`);
      if (v.Lw > v.L0) return invalid('The working length must not exceed the free length.');
      const F = k * (v.L0 - v.Lw), tau = K * 8 * F * v.D / (PI * v.d ** 3), tauS = K * 8 * k * (v.L0 - Ls) * v.D / (PI * v.d ** 3);
      const mass = v.rho * PI * PI * (v.d / 1000) ** 2 * (v.D / 1000) * v.Na / 4, fn = 0.5 * Math.sqrt(k * 1000 / mass), slender = v.L0 / v.D;
      const ok = tau <= v.allow;
      return output({ k, C, K, F, tau, tauS, Ls, Nt, fn, slender }, 'Working load (N)', F,
        [m('Spring rate', q(k, 'N/mm', 3)), m('Working load', q(F, 'N', 1)), m('Shear stress at working length', q(tau, 'MPa', 0)), m('Shear stress at solid', q(tauS, 'MPa', 0)), m('Spring index / Wahl factor', `${q(C, '', 2)} / ${q(K, '', 3)}`), m('Solid length / total coils', `${q(Ls, 'mm', 2)} / ${q(Nt, '', 1)}`), m('Clash allowance', q(v.Lw - Ls, 'mm', 2)), m('Natural frequency', q(fn, 'Hz', 0)), m('Slenderness L₀/D', q(slender, '', 2))],
        'Helical compression spring at its working length.', 'Round wire, axial load; buckling and fatigue need separate confirmation.', {
          text: ok ? 'STRESS WITHIN ALLOWABLE' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Stress at working length', ok ? 'pass' : 'fail', `${q(tau, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Stress at solid', tauS <= v.allow ? 'pass' : 'warn', tauS <= v.allow ? 'The spring can be compressed solid without exceeding the allowable.' : 'Stress at solid exceeds the allowable; prevent the spring going solid or expect set.'),
            check('Spring index', C >= 4 && C <= 12 ? 'pass' : 'warn', `C = ${q(C, '', 2)}; about 4 to 12 is easiest to make.`), check('Buckling', slender <= 2.6 ? 'pass' : 'verify', slender <= 2.6 ? 'A free length under 2.6 × mean diameter: buckling is unlikely for any end condition.' : 'Check buckling for the actual end restraint, or guide the spring on a rod or in a bore.')],
        });
    },
    "extension-spring": (v) => {
      const G = v.G * 1000, k = G * v.d ** 4 / (8 * v.D ** 3 * v.Na), C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, F = v.Fi + k * v.x, tau = K * 8 * F * v.D / (PI * v.d ** 3), taui = 8 * v.Fi * v.D / (PI * v.d ** 3), ok = tau <= v.allow;
      return output({ k, F, tau, taui, C, K }, 'Load at working extension (N)', F,
        [m('Spring rate', q(k, 'N/mm', 4)), m('Load at working extension', q(F, 'N', 2)), m('Body shear stress', q(tau, 'MPa', 0)), m('Initial-tension stress', q(taui, 'MPa', 0)), m('Spring index / Wahl factor', `${q(C, '', 2)} / ${q(K, '', 3)}`)],
        'Extension spring body at its working extension.', 'Body only; hooks and loops not checked.', {
          text: ok ? 'BODY STRESS WITHIN ALLOWABLE' : 'BODY OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Body stress', ok ? 'pass' : 'fail', `${q(tau, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Hook stress', 'verify', 'Hooks and loops usually limit extension springs; confirm with the maker.')],
        });
    },
    "torsion-spring": (v) => {
      const E = v.E * 1000, M = v.F * v.arm, C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const theta = 64 * M * v.D * v.Nb / (E * v.d ** 4), rate = E * v.d ** 4 / (64 * v.D * v.Nb), Ki = (4 * C * C - C - 1) / (4 * C * (C - 1)), sigma = Ki * 32 * M / (PI * v.d ** 3);
      const Dw = v.D * v.Nb / (v.Nb + theta / (2 * PI)), id = Dw - v.d, fits = v.arbor === 0 || id >= 1.1 * v.arbor, ok = sigma <= v.allow;
      return output({ M, theta, degrees: deg(theta), rate, sigma, id }, 'Angular deflection (°)', deg(theta),
        [m('Moment', q(M, 'N·mm', 1)), m('Angular deflection', `${q(deg(theta), '°', 1)} (${q(theta / (2 * PI), 'turns', 3)})`), m('Rate', `${q(rate * 2 * PI, 'N·mm/turn', 1)} (${q(rate * PI / 180, 'N·mm/°', 3)})`), m('Bending stress', q(sigma, 'MPa', 0)), m('Inside diameter when wound', q(id, 'mm', 2))],
        'Torsion spring wound by the applied moment.', 'Body only; legs and coil friction ignored.', {
          text: ok && fits ? 'SPRING OK' : !ok ? 'OVERSTRESSED' : 'BINDS ON ARBOR', tone: ok && fits ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(sigma, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Arbor clearance', v.arbor === 0 ? 'verify' : fits ? 'pass' : 'fail', v.arbor === 0 ? 'No arbor entered.' : `Wound inside diameter ${q(id, 'mm', 2)} against arbor ${q(v.arbor, 'mm', 2)} (10% clearance wanted).`)],
        });
    },
    "spring-combination": (v) => {
      const ks = [v.k1, v.k2, v.k3, v.k4].map((k, i) => [i + 1, k]).filter((x) => x[1] > 0), par = v.arr === 'parallel';
      const k = par ? ks.reduce((s, x) => s + x[1], 0) : 1 / ks.reduce((s, x) => s + 1 / x[1], 0), defl = v.F / k;
      const rows = ks.map(([i, ki]) => [`Spring ${i}`, q(ki, 'N/mm', 3), q(par ? ki * defl : v.F, 'N', 2), q(par ? defl : v.F / ki, 'mm', 3)]);
      return output({ k, defl }, 'Equivalent rate (N/mm)', k,
        [m('Equivalent rate', q(k, 'N/mm', 4)), m('Total deflection', q(defl, 'mm', 4)), m('Springs combined', String(ks.length))],
        `${ks.length} springs in ${v.arr}.`, 'Linear springs within their working range.', {
          table: tbl('Load sharing', ['Spring', 'Rate', 'Load', 'Deflection'], rows),
          checks: [check('Individual spring limits', 'verify', 'Check each spring’s load and deflection against its own rating.')],
        });
    },
    "disc-spring": (v) => {
      if (v.Di >= v.De) return invalid('The inside diameter must be smaller than the outside diameter.');
      if (v.s > v.h0) return invalid('The deflection cannot exceed the free cone height (the disc would be past flat).');
      const dl = v.De / v.Di, ln = Math.log(dl), K1 = (1 / PI) * ((dl - 1) / dl) ** 2 / ((dl + 1) / (dl - 1) - 2 / ln), K2 = (6 / PI) * ((dl - 1) / ln - 1) / ln, K3 = (3 / PI) * (dl - 1) / ln;
      const E = v.E * 1000, c = 4 * E / (1 - v.nu * v.nu), st = v.s / v.t, ht = v.h0 / v.t;
      const F = c * v.t ** 4 / (K1 * v.De ** 2) * st * ((ht - st) * (ht - st / 2) + 1), Fflat = c * v.h0 * v.t ** 3 / (K1 * v.De ** 2);
      const sOM = -c * v.t ** 2 / (K1 * v.De ** 2) * st * 3 / PI, sI = -c * v.t ** 2 / (K1 * v.De ** 2) * st * (K2 * (ht - st / 2) + K3);
      return output({ F, Fflat, sOM, sI, K1 }, 'Stack force (N)', F * v.np,
        [m('Force, one disc', q(F, 'N', 0)), m('Stack force', q(F * v.np, 'N', 0)), m('Force at flat, one disc', q(Fflat, 'N', 0)), m('Stack travel', q(v.s * v.ns, 'mm', 3)), m('Stress σOM (top, mean diameter)', q(sOM, 'MPa', 0)), m('Stress σI (top inner edge)', q(sI, 'MPa', 0))],
        `Almen–László characteristic at ${q(100 * v.s / v.h0, '%', 0)} of the free cone height.`, 'Discs without contact flats; stack friction neglected.', {
          checks: [check('Working deflection', v.s <= 0.75 * v.h0 ? 'pass' : 'warn', `${q(100 * v.s / v.h0, '%', 0)} of h₀; up to about 75% is the usual working range.`), check('Ratio h₀/t', ht <= 1.3 ? 'pass' : 'warn', `h₀/t = ${q(ht, '', 2)}; above about 1.3 the force curve flattens strongly and parallel stacking is unstable.`), check('Fatigue', 'verify', 'For cyclic duty, check σII and σIII with the maker’s fatigue data.')],
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
