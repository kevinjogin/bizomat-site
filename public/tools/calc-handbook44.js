// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook44). SI units are explicit at each boundary.
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
    "gyroscopic-bearing-load": (v) => {
      const J = v.shape === 'disc' ? v.M * v.R * v.R / 2 : v.shape === 'ring' ? v.M * v.R * v.R : v.J, ws = 2 * PI * v.ns / 60, Om = v.pmode === 'turn' ? v.vt / v.Rt : 2 * PI * v.np / 60;
      const Hm = J * ws, Tg = Hm * Om, F = Tg / (v.L / 1000), Wb = v.M * 9.80665 / 2, Fmax = Wb + F, Fmin = Wb - F, ok = Fmax <= v.allow;
      return output({ J, H: Hm, Om, npEq: Om * 60 / (2 * PI), Tg, F, Wb, Fmax, Fmin }, 'Largest bearing load (N)', Fmax,
        [m('Rotor inertia', q(J, 'kg·m²', 4)), m('Angular momentum', q(Hm, 'kg·m²/s', 2)), m('Precession rate', `${q(Om, 'rad/s', 4)} (${q(Om * 60 / (2 * PI), 'rpm', 2)})`), m('Gyroscopic couple', q(Tg, 'N·m', 2)), m('Gyroscopic reaction per bearing', q(F, 'N', 1)), m('Weight per bearing', q(Wb, 'N', 1)), m('Bearing loads', `${q(Fmax, '', 0)} / ${q(Fmin, 'N', 0)}`)],
        'Gyroscopic bearing load.', 'Steady precession at right angles to the spin.', {
          text: ok ? 'BEARINGS ADEQUATE' : 'BEARINGS OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Bearing load', ok ? 'pass' : 'fail', `${q(Fmax, 'N', 0)} against ${q(v.allow, 'N', 0)}.`), check('Load reversal', Fmin < 0 ? 'warn' : 'pass', Fmin < 0 ? 'One bearing load reverses: check for a lifted or rattling bearing.' : 'Both bearings stay loaded downward.')],
        });
    },
    "centrifugal-attachment-check": (v) => {
      const w = 2 * PI * v.rpm / 60, r = v.r / 1000, F = v.mass * w * w * r, Fos = F * v.os * v.os, As = PI / 4 * (v.d - 0.938194 * v.P) ** 2, s = F / v.nb / As, sOs = Fos / v.nb / As, sf = v.allow / sOs, nLim = v.rpm * Math.sqrt(v.allow / s), ok = sOs <= v.allow;
      return output({ F, Fos, As, s, sOs, sf, nLim, g: w * w * r / 9.80665 }, 'Bolt stress at overspeed (MPa)', sOs,
        [m('Centrifugal force at running speed', q(F, 'N', 0)), m('Acceleration at the mass', q(w * w * r / 9.80665, 'g', 0)), m('Force at overspeed', q(Fos, 'N', 0)), m('Bolt stress area', q(As, 'mm²', 1)), m('Bolt stress running / overspeed', `${q(s, '', 1)} / ${q(sOs, 'MPa', 1)}`), m('Safety factor at overspeed', q(sf, '', 2)), m('Speed at the allowable stress', q(nLim, 'rpm', 0))],
        'Centrifugal attachment check.', 'Bolts in pure tension.', {
          text: ok ? 'ATTACHMENT ADEQUATE' : 'ATTACHMENT OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Overspeed stress', ok ? 'pass' : 'fail', `${q(sOs, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Trip setting', nLim >= v.rpm * v.os ? 'pass' : 'fail', `The bolts reach the allowable at ${q(nLim, 'rpm', 0)}.`), check('Locking', 'verify', 'Lock the bolts against vibration loosening.')],
        });
    },
    "ratchet-pawl-design": (v) => {
      const F = v.Nt <= 12 ? 50 : v.Nt <= 20 ? 35 : 20, P = Math.sqrt(F * v.M * 1000 / (v.L * v.S * v.Nt)), D = P * v.Nt / PI;
      if (v.h >= P) return invalid('The engagement depth must be less than the pitch.');
      const Ft = v.M * 2000 / D, sb = Ft / (v.L * v.h), tau = Ft / (Number(v.planes) * PI * v.dp * v.dp / 4), okB = sb <= v.bA, okP = tau <= v.tA, ok = okB && okP;
      return output({ F, P, D, Ft, sb, tau }, 'Circular pitch (mm)', P,
        [m('Tooth-number factor', q(F, '', 0)), m('Circular pitch', q(P, 'mm', 2)), m('Outside diameter', q(D, 'mm', 1)), m('Tooth force', q(Ft, 'N', 0)), m('Face bearing stress', q(sb, 'MPa', 1)), m('Pawl pin shear stress', q(tau, 'MPa', 1))],
        'Ratchet and pawl design.', 'Handbook crane-ratchet rule; static load.', {
          text: ok ? 'RATCHET ADEQUATE' : 'RATCHET NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Tooth face bearing', okB ? 'pass' : 'fail', `${q(sb, 'MPa', 1)} against ${q(v.bA, 'MPa', 0)}.`), check('Pawl pin', okP ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tA, 'MPa', 0)}.`), check('Engagement', 'verify', 'Spring the pawl into engagement and check it cannot be pushed out under load.')],
        });
    },
    "torsion-member-comparison": (v) => {
      if (2 * v.t >= v.Do) return invalid('The tube wall is too thick for its diameter.');
      const Tn = v.T * 1000, G = v.G * 1000, di = v.Do - 2 * v.t, Js = PI * v.d ** 4 / 32, Jt = PI * (v.Do ** 4 - di ** 4) / 32;
      const tS = Tn * v.d / 2 / Js, twS = deg(Tn * v.L / (G * Js)), tT = Tn * v.Do / 2 / Jt, twT = deg(Tn * v.L / (G * Jt));
      const bb = Math.max(v.b, v.c), cc = Math.min(v.b, v.c), tR = Tn * (3 * bb + 1.8 * cc) / (bb * bb * cc * cc), K = bb * cc ** 3 * (1 / 3 - 0.21 * (cc / bb) * (1 - cc ** 4 / (12 * bb ** 4))), twR = deg(Tn * v.L / (K * G));
      const mS = v.rho * PI * v.d ** 2 / 4 / 1e6, mT = v.rho * PI * (v.Do ** 2 - di ** 2) / 4 / 1e6, mR = v.rho * bb * cc / 1e6, perM = (tw) => tw / (v.L / 1000);
      const rows = [['Solid round', tS, twS, mS], ['Round tube', tT, twT, mT], ['Rectangle', tR, twR, mR]], pick = { solid: 0, tube: 1, rect: 2 }[v.sel], ch = rows[pick];
      const passes = rows.filter(([, tau, tw]) => tau <= v.allow && perM(tw) <= v.twMax), lightest = passes.length ? passes.reduce((a, b2) => (b2[3] < a[3] ? b2 : a))[0] : 'None', okS = ch[1] <= v.allow, okT = perM(ch[2]) <= v.twMax, ok = okS && okT;
      return output({ tS, twS, tT, twT, tR, twR, K, mS, mT, mR }, 'Shear stress of the chosen section (MPa)', ch[1],
        [...rows.map(([n, tau, tw, mm]) => m(n, `${q(tau, 'MPa', 1)}, ${q(perM(tw), '°/m', 2)}, ${q(mm, 'kg/m', 2)}`)), m('Lightest section that passes', lightest)],
        'Torsion member comparison.', 'Elastic uniform torsion.', {
          text: ok ? 'SECTION ADEQUATE' : 'SECTION NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          table: tbl('Sections compared', ['Section', 'Shear stress', 'Twist per metre', 'Mass per metre'], rows.map(([n, tau, tw, mm]) => [n, q(tau, 'MPa', 1), q(perM(tw), '°/m', 2), q(mm, 'kg/m', 2)])),
          checks: [check('Stress', okS ? 'pass' : 'fail', `${ch[0]}: ${q(ch[1], 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Twist', okT ? 'pass' : 'fail', `${ch[0]}: ${q(perM(ch[2]), '°/m', 2)} against ${q(v.twMax, '°/m', 2)}.`)],
        });
    },
    "inertia-matching-ratio": (v) => {
      const eta = v.eff / 100, Tm = (i) => (v.Jm + v.JL / (i * i * eta)) * (2 * PI * v.nL * i / (60 * v.t)) + v.TL / (i * eta);
      const Jr = v.JL / (v.i * v.i * eta), ratio = Jr / v.Jm, nm = v.nL * v.i, alpha = 2 * PI * nm / (60 * v.t), Ta = (v.Jm + Jr) * alpha, Tl = v.TL / (v.i * eta), TmC = Ta + Tl;
      const iOpt = Math.sqrt(v.JL / (eta * v.Jm)), iMaxSpeed = v.nmMax / v.nL, iBest = Math.min(iOpt, iMaxSpeed), TmBest = Tm(iBest), okN = nm <= v.nmMax, okT = TmC <= v.Tpk, ok = okN && okT;
      return output({ Jr, ratio, nm, alpha, Ta, Tl, Tm: TmC, iOpt, iMaxSpeed, iBest, TmBest }, 'Motor torque at the chosen ratio (N·m)', TmC,
        [m('Reflected inertia / ratio', `${q(Jr, 'kg·m²', 5)} / ${q(ratio, '', 2)} : 1`), m('Motor speed', q(nm, 'rpm', 0)), m('Acceleration / load torque', `${q(Ta, '', 3)} / ${q(Tl, 'N·m', 3)}`), m('Motor torque at the chosen ratio', q(TmC, 'N·m', 3)), m('Optimum ratio for acceleration', `${q(iOpt, '', 2)} : 1`), m('Largest ratio within motor speed', `${q(iMaxSpeed, '', 2)} : 1`), m('Torque at the best usable ratio', q(TmBest, 'N·m', 3))],
        'Inertia matching ratio.', 'Constant acceleration; rigid drive.', {
          text: ok ? 'RATIO SUITABLE' : 'RATIO NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Motor speed', okN ? 'pass' : 'fail', `${q(nm, 'rpm', 0)} against ${q(v.nmMax, 'rpm', 0)}.`), check('Peak torque', okT ? 'pass' : 'fail', `${q(TmC, 'N·m', 2)} against ${q(v.Tpk, 'N·m', 1)}.`), check('Inertia ratio', ratio <= 10 ? 'pass' : 'warn', ratio <= 10 ? 'Inertia ratio within 10:1.' : 'High inertia ratio: servo tuning may be soft.')],
        });
    },
    "bolt-preload-verification": (v) => {
      if (v.Lt > v.grip) return invalid('The threaded length cannot exceed the grip.');
      const Ad = PI * v.d * v.d / 4, At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, Eb = v.Eb * 1000, kb = 1 / ((v.grip - v.Lt) / (Eb * Ad) + v.Lt / (Eb * At));
      const km = 0.5774 * PI * v.Em * 1000 * v.d / (2 * Math.log(5 * (0.5774 * v.grip + 0.5 * v.d) / (0.5774 * v.grip + 2.5 * v.d))), F = kb * v.dl, proof = v.Sp * At, Ft = v.pct / 100 * proof, dev = (F - Ft) / Ft * 100;
      const K = v.Tq > 0 ? v.Tq * 1000 / (F * v.d) : 0, Tt = K * Ft * v.d / 1000, angle = 360 * (F / kb + F / km) / v.P, okD = Math.abs(dev) <= v.tol, okP = F <= proof, ok = okD && okP;
      return output({ At, kb, km, F, proof, Ft, dev, K, Tt, angle }, 'Preload from the stretch (kN)', F / 1000,
        [m('Bolt stiffness', q(kb / 1000, 'kN/mm', 1)), m('Preload from the stretch', q(F / 1000, 'kN', 2)), m('Target preload', q(Ft / 1000, 'kN', 2)), m('Deviation from target', q(dev, '%', 1)), m('Implied nut factor K', v.Tq > 0 ? q(K, '', 3) : 'No torque entered'), m('Torque for the target with that K', v.Tq > 0 ? q(Tt, 'N·m', 0) : '—'), m('Turn angle for this preload', q(angle, '°', 1))],
        'Bolt preload verification.', 'Elastic stretch; simplified stiffness.', {
          text: ok ? 'PRELOAD VERIFIED' : 'PRELOAD OUT OF TOLERANCE', tone: ok ? 'good' : 'bad',
          checks: [check('Preload', okD ? 'pass' : 'fail', `${q(dev, '%', 1)} from target against ±${q(v.tol, '%', 0)}.`), check('Proof load', okP ? 'pass' : 'fail', okP ? 'Below the proof load.' : 'Above the proof load: the bolt may have yielded; replace it.'), check('Nut factor', v.Tq > 0 && (K < 0.1 || K > 0.3) ? 'warn' : 'pass', v.Tq > 0 && (K < 0.1 || K > 0.3) ? 'Unusual nut factor: check thread condition and lubricant.' : 'Nut factor in the usual range.')],
        });
    },
    "spindle-speed-range-design": (v) => {
      if (v.dmax <= v.dmin || v.vmax <= v.vmin) return invalid('Each largest value must exceed the smallest.');
      const nmin = 1000 * v.vmin / (PI * v.dmax), nmax = 1000 * v.vmax / (PI * v.dmin), R = nmax / nmin, phi = Math.pow(R, 1 / (v.z - 1)), loss = (1 - 1 / phi) * 100;
      const Rs = [['R5', 1.585], ['R10', 1.259], ['R20', 1.122], ['R40', 1.059], ['R80', 1.029]], near = Rs.reduce((a, b) => (Math.abs(Math.log(b[1] / phi)) < Math.abs(Math.log(a[1] / phi)) ? b : a));
      const zNeed = Math.ceil(1 + Math.log(R) / Math.log(1 / (1 - v.lossMax / 100)) - 1e-9), speeds = Array.from({ length: Math.min(v.z, 60) }, (_, k) => nmin * phi ** k), ok = loss <= v.lossMax + 1e-9;
      return output({ nmin, nmax, R, phi, loss, zNeed, series: near[0] }, 'Step ratio φ', phi,
        [m('Speed range', `${q(nmin, '', 1)} – ${q(nmax, 'rpm', 0)} (${q(R, '', 1)} : 1)`), m('Step ratio', q(phi, '', 4)), m('Nearest preferred series', `${near[0]} (${near[1]})`), m('Largest speed loss between steps', q(loss, '%', 1)), m('Speeds needed for your loss limit', q(zNeed, '', 0)), m('Speeds', speeds.map((s) => q(s, '', 0)).join(', ') + ' rpm')],
        'Spindle speed range design.', 'Geometric series of speeds.', {
          text: ok ? 'SPEED RANGE ADEQUATE' : 'STEPS TOO COARSE', tone: ok ? 'good' : 'bad',
          checks: [check('Speed loss', ok ? 'pass' : 'fail', `${q(loss, '%', 1)} against ${q(v.lossMax, '%', 0)}; ${q(zNeed, '', 0)} speeds needed.`), check('Low-speed torque', 'verify', 'Check the gearbox and motor torque at the lowest speeds.')],
        });
    },
    "vacuum-tube-design": (v) => {
      const te = v.t - v.ca; if (te <= 0) return invalid('The wall must be thicker than the corrosion allowance.');
      if (v.t >= v.D / 2) return invalid('The wall is too thick for this diameter.');
      const coll = (tt) => { const Dm = v.D - tt, pcr = 2 * v.E * 1000 / (1 - v.nu ** 2) * (tt / Dm) ** 3, py = 2 * v.Sy * tt / Dm; return { pcr, py, gov: Math.min(pcr, py) }; };
      const c = coll(te), n = c.gov / v.p; let lo = 1e-4, hi = v.D / 2 - 1e-3; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (coll(mid).gov / v.p < v.req) lo = mid; else hi = mid; }
      const tReq = hi + v.ca, mass = v.rho * PI * (v.D ** 2 - (v.D - 2 * v.t) ** 2) / 4 / 1e6, ok = n >= v.req;
      return output({ pcr: c.pcr, py: c.py, gov: c.gov, n, tReq, Dt: v.D / te, mass }, 'Safety factor on collapse', n,
        [m('Elastic collapse pressure', q(c.pcr, 'MPa', 3)), m('Yield-limited pressure', q(c.py, 'MPa', 2)), m('Governing mode', c.pcr < c.py ? 'Elastic buckling' : 'Yield'), m('Safety factor', q(n, '', 2)), m('Wall needed incl. allowance', q(tReq, 'mm', 2)), m('D/t (corroded)', q(v.D / te, '', 1)), m('Mass per metre', q(mass, 'kg/m', 2))],
        'Tube under external pressure.', 'Long unstiffened tube.', {
          text: ok ? 'WALL ADEQUATE' : 'WALL TOO THIN', tone: ok ? 'good' : 'bad',
          checks: [check('Collapse factor', ok ? 'pass' : 'fail', `${q(n, '', 2)} against ${q(v.req, '', 1)}; ${q(tReq, 'mm', 2)} needed.`), check('Roundness', 'verify', 'Keep out-of-roundness within the code limit; it lowers collapse pressure.')],
        });
    },
    "journal-bearing-oil-check": (v) => {
      if (v.T1 === v.T2) return invalid('The two catalogue temperatures must differ.');
      const Y = (nu) => Math.log10(Math.log10(nu + 0.7)), X = (t) => Math.log10(t + 273.15), B = (Y(v.v1) - Y(v.v2)) / (X(v.T2) - X(v.T1)), A = Y(v.v1) + B * X(v.T1), nu = Math.pow(10, Math.pow(10, A - B * X(v.Top))) - 0.7, mu = nu * v.rho / 1000;
      const r = v.d / 2000, Lm = v.L / 1000, c = v.c / 1000, muS = mu / 1000, Nn = v.rpm / 60, P = v.W / (2 * r * Lm), Tf = 4 * PI * PI * r ** 3 * Lm * muS * Nn / c, S = (r / c) ** 2 * muS * Nn / P, Ploss = 2 * PI * Nn * Tf;
      const okV = nu >= v.vMin, okS = S >= v.Smin, ok = okV && okS;
      return output({ nu, mu, P: P / 1e6, S, Tf, Ploss }, 'Sommerfeld number', S,
        [m('Viscosity at running temperature', q(nu, 'cSt', 2)), m('Dynamic viscosity', q(mu, 'mPa·s', 2)), m('Unit load', q(P / 1e6, 'MPa', 3)), m('Sommerfeld number', q(S, '', 4)), m('Friction torque', q(Tf, 'N·m', 4)), m('Power loss', q(Ploss, 'W', 1))],
        'Journal bearing oil check.', 'ASTM D341 viscosity; Petroff friction.', {
          text: ok ? 'OIL SUITABLE' : 'OIL NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Viscosity', okV ? 'pass' : 'fail', `${q(nu, 'cSt', 1)} at ${q(v.Top, '°C', 0)} against ${q(v.vMin, 'cSt', 1)}.`), check('Film', okS ? 'pass' : 'fail', `Sommerfeld number ${q(S, '', 3)} against ${q(v.Smin, '', 3)}.`), check('Extrapolation', v.Top >= Math.min(v.T1, v.T2) && v.Top <= Math.max(v.T1, v.T2) ? 'pass' : 'warn', v.Top >= Math.min(v.T1, v.T2) && v.Top <= Math.max(v.T1, v.T2) ? 'Running temperature between the catalogue points.' : 'Outside the catalogue points: the viscosity is extrapolated.')],
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
