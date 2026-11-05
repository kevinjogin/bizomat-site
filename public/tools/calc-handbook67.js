// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook67). SI units are explicit at each boundary.
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
    "cylinder-cushion-check": (v) => {
      if (v.rod >= v.bore) return invalid('The rod must be smaller than the bore.');
      const s = v.sc / 1000, a = v.v * v.v / (2 * s), KE = v.mass * v.v * v.v / 2, Ab = PI * v.bore ** 2 / 4, Aa = PI * (v.bore ** 2 - v.rod ** 2) / 4, Fdrive = v.pDrive / 10 * Ab, Fstop = v.mass * a + Fdrive + v.Fext, pCush = Fstop / Aa * 10, t = 2 * s / v.v;
      const spare = v.pRate / 10 * Aa - Fdrive - v.Fext, vMax = spare > 0 ? Math.sqrt(2 * s * spare / v.mass) : 0, ok = pCush <= v.pRate + 1e-9;
      return output({ a, KE, t, Fdrive, Fstop, pCush, vMax }, 'Cushion pressure (bar)', pCush,
        [m('Kinetic energy', q(KE, 'J', 1)), m('Deceleration / stopping time', `${q(a, 'm/s²', 2)} / ${q(t, 's', 3)}`), m('Drive force on the full bore', q(Fdrive, 'N', 0)), m('Total stopping force', q(Fstop, 'N', 0)), m('Cushion pressure', q(pCush, 'bar', 1)), m('Largest speed for the rating', q(vMax, 'm/s', 2))],
        'Cylinder cushion check.', 'Uniform deceleration over the cushion.', {
          text: ok ? 'CUSHION ADEQUATE' : 'CUSHION PRESSURE TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Cushion pressure', ok ? 'pass' : 'fail', `${q(pCush, 'bar', 1)} against ${q(v.pRate, 'bar', 0)}${ok ? '.' : `: slow to ${q(vMax, 'm/s', 2)} or fit external shock absorbers.`}`), check('Speed reduction', 'verify', 'Decelerate with a proportional or flow valve before the cushion for heavy loads.')],
        });
    },
    "pipe-bend-thrust-check": (v) => {
      const A = PI * (v.d / 1000) ** 2 / 4, Qs = v.Q / 60000, vel = Qs / A, Fp = v.p * 1e5 * A, Fm = v.rho * Qs * vel, F = 2 * (Fp + Fm) * Math.sin(rad(v.ang / 2)), qb = F / v.Ab / 1000, Aneed = F / (v.qa * 1000), ok = qb <= v.qa + 1e-9;
      return output({ A, vel, Fp, Fm, F, qb, Aneed }, 'Resultant thrust (kN)', F / 1000,
        [m('Velocity', q(vel, 'm/s', 2)), m('Pressure force / momentum force', `${q(Fp, '', 0)} / ${q(Fm, 'N', 0)}`), m('Resultant thrust', q(F / 1000, 'kN', 2)), m('Block bearing pressure', q(qb, 'kPa', 1)), m('Block area needed', q(Aneed, 'm²', 3))],
        'Pipe bend thrust check.', 'Horizontal bend; static pressure.', {
          text: ok ? 'THRUST BLOCK ADEQUATE' : 'THRUST BLOCK TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Ground bearing', ok ? 'pass' : 'fail', `${q(qb, 'kPa', 1)} against ${q(v.qa, 'kPa', 0)}${ok ? '.' : `: enlarge the block to ${q(Aneed, 'm²', 2)}.`}`), check('Undisturbed ground', 'verify', 'Pour the block against undisturbed ground, not backfill.')],
        });
    },
    "jet-impact-force-check": (v) => {
      if (v.dp <= 0) return invalid('Enter the pressure at the nozzle.');
      const A = PI * (v.d / 1000) ** 2 / 4, vel = Math.sqrt(2 * v.dp * 1e5 / v.rho), Qs = v.Cd * A * vel, Q = Qs * 60000, R = v.rho * Qs * vel;
      if (v.u >= vel) return invalid('The plate moves away faster than the jet: no force.');
      const Fp = v.rho * Qs * (vel - v.u) ** 2 / vel * Math.sin(rad(v.beta)), ok = R <= v.Rmax + 1e-9;
      return output({ Q, vel, R, Fp }, 'Nozzle reaction (N)', R,
        [m('Flow', q(Q, 'L/min', 1)), m('Jet velocity', q(vel, 'm/s', 1)), m('Nozzle reaction', q(R, 'N', 1)), m('Force on the plate', q(Fp, 'N', 1))],
        'Jet impact force check.', 'Coherent jet; single flat plate.', {
          text: ok ? 'REACTION ACCEPTABLE' : 'REACTION TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Nozzle reaction', ok ? 'pass' : 'fail', `${q(R, 'N', 0)} against ${q(v.Rmax, 'N', 0)}${ok ? '.' : ': use a smaller nozzle, lower pressure or a fixed mounting.'}`), check('Injury risk', 'verify', 'High-pressure jets can penetrate skin; follow the high-pressure cleaning safety rules.')],
        });
    },
    "spring-clamp-hydraulic-release": (v) => {
      const G = v.G * 1000, k = G * v.d ** 4 / (8 * v.D ** 3 * v.Na), C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      if (v.Lw > v.L0) return invalid('The clamped length must not exceed the unloaded length.');
      if (v.Di >= v.Do) return invalid('The piston inside diameter must be smaller than its outside diameter.');
      const K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, Nt = { cg: v.Na + 2, c: v.Na + 2, pg: v.Na + 1, p: v.Na }[v.ends], Ls = (v.ends === 'cg' || v.ends === 'pg' ? Nt : Nt + 1) * v.d, Lr = v.Lw - v.stroke;
      if (Lr < Ls) return invalid(`At release the springs would be shorter than solid (${q(Ls, 'mm', 2)}).`);
      const F1 = k * (v.L0 - v.Lw), tau = K * 8 * F1 * v.D / (PI * v.d ** 3), Fclamp = v.nS * F1, Frel1 = k * (v.L0 - Lr), Frel = v.nS * Frel1, tauRel = K * 8 * Frel1 * v.D / (PI * v.d ** 3), Ap = PI * (v.Do ** 2 - v.Di ** 2) / 4, pRel = Frel * (1 + v.fric / 100) / Ap * 10;
      const okC = Fclamp >= v.Fc - 1e-9, okP = pRel <= v.pAv + 1e-9, okS = tauRel <= v.allow + 1e-9, ok = okC && okP && okS;
      return output({ k, F1, tau, Fclamp, Frel1, Frel, tauRel, Ap, pRel, Ls }, 'Release pressure (bar)', pRel,
        [m('Spring rate / clamped load each', `${q(k, 'N/mm', 2)} / ${q(F1, 'N', 1)}`), m('Clamping force', q(Fclamp, 'N', 0)), m('Load at release (all springs)', q(Frel, 'N', 0)), m('Piston area', q(Ap, 'mm²', 0)), m('Release pressure', q(pRel, 'bar', 1)), m('Spring stress: clamped / released', `${q(tau, '', 0)} / ${q(tauRel, 'MPa', 0)}`)],
        'Spring clamp hydraulic release check.', 'Equal load sharing; static.', {
          text: ok ? 'CLAMP ADEQUATE' : 'CLAMP NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Clamping force', okC ? 'pass' : 'fail', `${q(Fclamp, 'N', 0)} against ${q(v.Fc, 'N', 0)}.`), check('Release pressure', okP ? 'pass' : 'fail', `${q(pRel, 'bar', 1)} against ${q(v.pAv, 'bar', 0)} available.`), check('Spring stress at release', okS ? 'pass' : 'fail', `${q(tauRel, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Wear', 'verify', 'Check the clamping force again with the pads or linings worn.')],
        });
    },
    "extraction-duct-check": (v) => {
      const Qt = v.nH * v.qH, Qlmin = Qt * 1000 / 60, dm = v.d / 1000, Ap = PI * dm * dm / 4, vel = Qlmin / 60000 / Ap, Re = vel * dm / (v.nu * 1e-6); let f;
      if (Re < 2300) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * dm) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const dpDuct = (f * v.L / dm + v.K) * v.rho * vel * vel / 2, pNeed = dpDuct + v.pHood, okV = vel >= v.vMin - 1e-9, okP = pNeed <= v.pFan + 1e-9, ok = okV && okP;
      return output({ Qt, Qlmin, vel, Re, f, dpDuct, pNeed }, 'Fan pressure needed (Pa)', pNeed,
        [m('Total airflow', q(Qt, 'm³/h', 0)), m('Duct velocity', q(vel, 'm/s', 1)), m('Reynolds number / friction factor', `${q(Re, '', 0)} / ${q(f, '', 4)}`), m('Duct pressure loss', q(dpDuct, 'Pa', 0)), m('Fan pressure needed', q(pNeed, 'Pa', 0))],
        'Extraction duct check.', 'Full flow over the whole duct; clean duct.', {
          text: !okV ? 'DUCT VELOCITY TOO LOW' : okP ? 'EXTRACTION ADEQUATE' : 'FAN PRESSURE SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Transport velocity', okV ? 'pass' : 'fail', `${q(vel, 'm/s', 1)} against ${q(v.vMin, 'm/s', 0)}${okV ? '.' : ': use a smaller duct so the dust does not settle.'}`), check('Fan pressure', okP ? 'pass' : 'fail', `${q(pNeed, 'Pa', 0)} needed against ${q(v.pFan, 'Pa', 0)}.`), check('Capture', 'verify', 'Measure the capture velocity at each hood after commissioning.')],
        });
    },
    "gravity-chute-check": (v) => {
      const g = 9.80665, W = v.mass * g, s = Math.sin(rad(v.angle)), c = Math.cos(rad(v.angle)), Fdrive = W * (s - v.mu * c), a = Fdrive / v.mass, thMin = deg(Math.atan(v.mu));
      const v2 = v.u * v.u + 2 * a * v.L, stops = v2 <= 0, vExit = stops ? 0 : Math.sqrt(v2), t = Math.abs(a) > 1e-12 ? (vExit - v.u) / a : v.L / Math.max(v.u, 1e-12), KE = v.mass * vExit * vExit / 2;
      const slides = a > 0 || (a === 0 && v.u > 0), okV = vExit <= v.vMax + 1e-9;
      return output({ Fdrive, a, thMin, vExit, t: stops ? 0 : t, KE }, 'Exit speed (m/s)', vExit,
        [m('Driving force along the chute', q(Fdrive, 'N', 1)), m('Acceleration', q(a, 'm/s²', 3)), m('Least angle to slide', q(thMin, '°', 1)), m('Exit speed', stops ? 'The part stops on the chute' : q(vExit, 'm/s', 2)), m('Time on the chute', stops ? '—' : q(t, 's', 2)), m('Impact energy', q(KE, 'J', 1))],
        'Gravity chute check.', 'Constant sliding friction; no rolling.', {
          text: !slides || stops ? 'PART WILL NOT SLIDE' : okV ? 'CHUTE WORKS' : 'EXIT SPEED TOO HIGH', tone: slides && !stops && okV ? 'good' : 'bad',
          checks: [check('Sliding', slides && !stops ? 'pass' : 'fail', slides && !stops ? `The chute is ${q(v.angle - thMin, '°', 1)} steeper than the friction angle.` : `The chute must be steeper than ${q(thMin, '°', 1)} for parts to slide.`), check('Exit speed', okV ? 'pass' : 'fail', `${q(vExit, 'm/s', 2)} against ${q(v.vMax, 'm/s', 1)}${okV ? '.' : ': flatten the chute or add a buffer.'}`)],
        });
    },
    "torque-wrench-adapter-check": (v) => {
      const Leff = v.Lw + v.E * Math.cos(rad(v.phi));
      if (Leff <= 0) return invalid('The adapter folds back past the wrench grip.');
      const As = PI / 4 * (v.d - 0.938194 * v.P) ** 2, proof = v.Sp * As, Ftarget = proof * v.pct / 100, Ttarget = v.K * Ftarget * v.d / 1000, Tact = v.Tset * Leff / v.Lw, Tneed = Ttarget * v.Lw / Leff, F = Tact * 1000 / (v.K * v.d), share = 100 * F / proof;
      const lo = v.pct - v.tol, okLo = share >= lo - 1e-9, okHi = share <= Math.min(v.pct + v.tol, v.pctMax) + 1e-9;
      return output({ Leff, factor: Leff / v.Lw, As, Ttarget, Tact, Tneed, F, share }, 'Preload (% of proof)', share,
        [m('Effective length / correction factor', `${q(Leff, 'mm', 1)} / ${q(Leff / v.Lw, '', 4)}`), m('Target torque at the bolt', q(Ttarget, 'N·m', 1)), m('Actual torque at the bolt', q(Tact, 'N·m', 1)), m('Wrench setting for the target', q(Tneed, 'N·m', 1)), m('Preload / share of proof', `${q(F / 1000, 'kN', 2)} / ${q(share, '%', 1)}`)],
        'Torque wrench adapter check.', 'Grip at the handle centre; nut factor relation.', {
          text: !okHi ? 'OVER-TIGHTENED' : okLo ? 'CORRECT SETTING' : 'UNDER-TIGHTENED', tone: okLo && okHi ? 'good' : 'bad',
          checks: [check('Preload', okLo && okHi ? 'pass' : 'fail', `${q(share, '%', 1)} of proof against ${q(lo, '', 0)}–${q(Math.min(v.pct + v.tol, v.pctMax), '%', 0)}${okLo && okHi ? '.' : `: set the wrench to ${q(Tneed, 'N·m', 1)}.`}`), check('Nut factor', 'verify', 'Use the nut factor for the actual lubrication and finish of the fasteners.')],
        });
    },
    "friction-wheel-drive-check": (v) => {
      const T1 = 9549.2966 * v.P / v.n1, Ft = T1 * 1000 / v.R1, Nf = v.SF * Ft / v.mu, Es = 1 / ((1 - v.nu1 ** 2) / (v.E1 * 1000) + (1 - v.nu2 ** 2) / (v.E2 * 1000)), R = 1 / (1 / v.R1 + 1 / v.R2), b = Math.sqrt(4 * Nf * R / (PI * v.L * Es)), p0 = 2 * Nf / (PI * b * v.L), n2 = v.n1 * v.R1 / v.R2, T2 = Ft * v.R2 / 1000, ok = p0 <= v.allow + 1e-9;
      return output({ T1, Ft, Nf, Es, R, size: b, p0, n2, T2, bearing: Math.hypot(Nf, Ft) }, 'Peak contact pressure (MPa)', p0,
        [m('Driver torque / tangential force', `${q(T1, 'N·m', 2)} / ${q(Ft, 'N', 0)}`), m('Normal force needed', q(Nf, 'N', 0)), m('Contact half-width', q(b, 'mm', 4)), m('Peak contact pressure', q(p0, 'MPa', 0)), m('Output speed / torque', `${q(n2, 'rpm', 1)} / ${q(T2, 'N·m', 2)}`), m('Load on each roller’s bearings', q(Math.hypot(Nf, Ft), 'N', 0))],
        'Friction wheel drive check.', 'Uniform line contact; no creep.', {
          text: ok ? 'DRIVE ADEQUATE' : 'CONTACT STRESS TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Contact pressure', ok ? 'pass' : 'fail', `${q(p0, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}${ok ? '.' : ': widen the contact or use larger rollers.'}`), check('Bearings', 'verify', `Check the roller bearings for ${q(Math.hypot(Nf, Ft), 'N', 0)} of radial load.`)],
        });
    },
    "taper-bush-grip-check": (v) => {
      const As = PI / 4 * (v.d - 0.938194 * v.P) ** 2, proof = v.Sp * As, F = v.T * 1000 / (v.K * v.d), share = 100 * F / proof, Fa = v.nScr * F, a = rad(v.alpha), Nn = Fa / (Math.sin(a) + v.muT * Math.cos(a)), Tgrip = v.muS * Nn * v.Ds / 2000, Tneed = 9549.2966 * v.Pw / v.n * v.SF;
      const okG = Tgrip >= Tneed - 1e-9, okS = share <= 100 + 1e-9;
      return output({ As, F, share, Fa, Nn, Tgrip, Tneed }, 'Grip torque (N·m)', Tgrip,
        [m('Preload per screw / share of proof', `${q(F / 1000, 'kN', 2)} / ${q(share, '%', 0)}`), m('Total axial force', q(Fa / 1000, 'kN', 2)), m('Normal force on the taper', q(Nn / 1000, 'kN', 2)), m('Grip torque on the shaft', q(Tgrip, 'N·m', 1)), m('Drive torque with service factor', q(Tneed, 'N·m', 1))],
        'Taper bush grip check.', 'Clean surfaces; normal force fully on the shaft.', {
          text: !okS ? 'SCREWS OVERLOADED' : okG ? 'GRIP ADEQUATE' : 'BUSH WILL SLIP', tone: okG && okS ? 'good' : 'bad',
          checks: [check('Grip', okG ? 'pass' : 'fail', `${q(Tgrip, 'N·m', 0)} against ${q(Tneed, 'N·m', 0)}${okG ? '.' : ': tighten to the maker’s torque, add a key or use a larger bush.'}`), check('Screw preload', okS ? 'pass' : 'fail', `${q(share, '%', 0)} of proof load.`), check('Key', 'verify', 'Taper bushes with a key carry torque by the key as well; this check is the friction grip alone.')],
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
