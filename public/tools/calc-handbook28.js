// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook28). SI units are explicit at each boundary.
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
    "keyed-hub-design": (v) => {
      const T = v.P * 1000 / (2 * PI * v.n / 60) * v.SF, F = 2 * T * 1000 / v.d, Ls = F / (v.w * v.tauK), Lc = F / (v.h / 2 * v.sigC), eff = v.nk === '2' ? 1.5 : 1, Lreq = Math.max(Ls, Lc) / eff;
      const tau = 16 * T * 1000 / (PI * v.d ** 3), tauA = 0.75 * v.tauS, okH = Lreq <= v.hubL, okS = tau <= tauA, okR = Lreq <= 1.5 * v.d, ok = okH && okS;
      return output({ T, F, Ls, Lc, Lreq, tau, tauA }, 'Key length required (mm)', Lreq,
        [m('Design torque', q(T, 'N·m', 1)), m('Force at shaft surface', q(F, 'N', 0)), m('Length for shear', q(Ls / eff, 'mm', 1)), m('Length for crushing', q(Lc / eff, 'mm', 1)), m('Key length required', q(Lreq, 'mm', 1)), m('Keyed shaft shear stress', q(tau, 'MPa', 1)), m('Allowed with keyway', q(tauA, 'MPa', 1))],
        'Keyed shaft and hub design.', 'Uniform key loading.', {
          text: ok ? 'KEYED JOINT ADEQUATE' : 'KEYED JOINT NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Hub length', okH ? 'pass' : 'fail', `${q(Lreq, 'mm', 1)} needed against ${q(v.hubL, 'mm', 0)} available.`), check('Keyed shaft stress', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(tauA, 'MPa', 1)}.`), check('Key proportions', okR ? 'pass' : 'warn', okR ? 'Key length within 1.5 shaft diameters.' : 'Very long key: load will not spread evenly; consider two keys or a spline.')],
        });
    },
    "band-brake-stop-design": (v) => {
      const w0 = 2 * PI * v.n / 60, sgn = v.dir === 'drive' ? 1 : -1, Treq = Math.max(0, v.J * w0 / v.t + sgn * v.TL), Td = v.SF * Treq;
      if (Td <= 0) return invalid('The load alone stops the drum in time; no brake torque is needed.');
      const r = v.D / 2000, net = Td / r, e = Math.exp(v.mu * rad(v.wrap)), T2 = net / (e - 1), T1 = T2 + net, Fl = T2 * v.b / v.a, p = T1 / (r * 1000 * v.w);
      const decT = Td - sgn * v.TL; if (decT <= 0) return invalid('The brake cannot hold the overhauling load.');
      const ts = v.J * w0 / decT, ang = w0 * ts / 2, E = v.J * w0 * w0 / 2 + sgn * v.TL * ang, dT = E / (v.mass * v.cp), Pavg = E * v.sph / 3600, okF = Fl <= v.Fmax, okP = p <= v.pall, ok = okF && okP;
      return output({ Treq, Td, T1, T2, Fl, p, ts, ang, E, dT, Pavg }, 'Design braking torque (N·m)', Td,
        [m('Torque to stop in time', q(Treq, 'N·m', 1)), m('Design braking torque', q(Td, 'N·m', 1)), m('Tight / slack band tension', `${q(T1, '', 0)} / ${q(T2, 'N', 0)}`), m('Lever force', q(Fl, 'N', 1)), m('Peak lining pressure', q(p, 'MPa', 3)), m('Actual stopping time', q(ts, 's', 2)), m('Turns while stopping', q(ang / (2 * PI), 'rev', 2)), m('Energy per stop', q(E / 1000, 'kJ', 2)), m('Drum temperature rise per stop', q(dT, 'K', 1)), m('Average heat', q(Pavg, 'W', 0))],
        'Band brake stopping design.', 'Constant friction and torque.', {
          text: ok ? 'BRAKE ADEQUATE' : 'BRAKE TOO WEAK', tone: ok ? 'good' : 'bad',
          checks: [check('Lever force', okF ? 'pass' : 'fail', `${q(Fl, 'N', 0)} against ${q(v.Fmax, 'N', 0)} available.`), check('Lining pressure', okP ? 'pass' : 'fail', `${q(p, 'MPa', 3)} against ${q(v.pall, 'MPa', 2)}.`), check('Stopping time', 'pass', `Stops in ${q(ts, 's', 2)} at the design torque (target ${q(v.t, 's', 2)}).`), check('Temperature rise', dT <= 50 ? 'pass' : 'warn', dT <= 50 ? 'Moderate heating per stop.' : 'Large rise per stop: add drum mass or cooling.'), check('Rotation', 'verify', 'Confirm the band’s anchored end is the tight side for the braking direction.')],
        });
    },
    "conveyor-drive-sizing": (v) => {
      const g = 9.80665, qL = v.Q / (3.6 * v.v), Te = v.f * g * v.L * (qL + v.qm) + qL * g * v.Hl; if (Te <= 0) return invalid('The conveyor runs downhill on its own: the drive must brake, not drive.');
      const Pp = Te * v.v / 1000, Pm = Pp / (v.eta / 100) * (1 + v.marg / 100), e = Math.exp(v.mu * rad(v.wrap)), T2 = Te / (e - 1), T1 = T2 + Te, Tq = Te * v.D / 2000, np = v.v / (PI * v.D / 1000) * 60;
      return output({ qL, Te, Pp, Pmotor: Pm, T1, T2, Tq, np }, 'Motor power (kW)', Pm,
        [m('Material load', q(qL, 'kg/m', 1)), m('Effective tension', q(Te, 'N', 0)), m('Power at the pulley', q(Pp, 'kW', 2)), m('Motor power with margin', q(Pm, 'kW', 2)), m('Minimum slack-side tension', q(T2, 'N', 0)), m('Tight-side tension', q(T1, 'N', 0)), m('Pulley torque / speed', `${q(Tq, 'N·m', 0)} / ${q(np, 'rpm', 1)}`)],
        'Belt conveyor drive sizing.', 'Overall friction factor method.', {
          checks: [check('Take-up', 'verify', `Set the take-up to keep at least ${q(T2, 'N', 0)} on the slack side at the drive.`), check('Belt rating', 'verify', `Check the belt’s working tension rating against ${q(T1, 'N', 0)} plus starting allowance.`)],
        });
    },
    "fixture-clamp-force": (v) => {
      if (v.A + v.B <= 0) return invalid('Enter the strap clamp dimensions.');
      const Fcl = v.mode === 'friction' ? v.n * v.Fcut / (v.mu1 + v.mu2) + v.n * v.Flift : v.n * v.Flift; if (Fcl <= 0) return invalid('Enter the cutting or lifting force.');
      const per = Fcl / v.nc, Fs = per * (v.A + v.B) / v.B, Tq = v.K * Fs * v.d / 1000, At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, s = Fs / At, ok = s <= 0.75 * v.Sp;
      return output({ Fcl, per, Fs, Tq, At, s }, 'Total clamping force (N)', Fcl,
        [m('Total clamping force', q(Fcl, 'N', 0)), m('Force per clamp', q(per, 'N', 0)), m('Screw force per clamp', q(Fs, 'N', 0)), m('Screw tightening torque', q(Tq, 'N·m', 1)), m('Screw stress', q(s, 'MPa', 0))],
        'Fixture clamping requirement.', 'Static force balance.', {
          text: ok ? 'CLAMPS ADEQUATE' : 'CLAMP SCREW OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Screw stress', ok ? 'pass' : 'fail', `${q(s, 'MPa', 0)} against ${q(0.75 * v.Sp, 'MPa', 0)} (75% of proof).`), check('Positive stop', v.mode === 'stop' ? 'pass' : 'verify', v.mode === 'stop' ? 'The stop carries the cutting force.' : 'Friction-only holding is sensitive to coolant and burrs; add a stop where possible.')],
        });
    },
    "lifting-beam-design": (v) => {
      const W = v.mass * 9.80665 * v.dyn;
      if (v.type === 'lifting') {
        const M = W * v.S / 4, stress = M / v.Z, defl = W * v.S ** 3 / (48 * v.E * 1000 * v.I), ok = stress <= v.allow;
        return output({ W, M, stress, defl, ratio: v.S / defl }, 'Bending stress (MPa)', stress,
          [m('Design load', q(W / 1000, 'kN', 2)), m('Load at each lift point', q(W / 2000, 'kN', 2)), m('Maximum bending moment', q(M / 1e6, 'kN·m', 2)), m('Bending stress', q(stress, 'MPa', 1)), m('Required section modulus', q(M / v.allow, 'mm³', 0)), m('Deflection', `${q(defl, 'mm', 2)} (span ÷ ${q(v.S / defl, '', 0)})`)],
          'Lifting beam check.', 'Central lug, two end load points.', {
            text: ok ? 'BEAM ADEQUATE' : 'BEAM OVERSTRESSED', tone: ok ? 'good' : 'bad',
            checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Certification', 'verify', 'Design, proof-test and mark the beam to the lifting equipment standard.')],
          });
      }
      const Ts = W / (2 * Math.cos(rad(v.theta))), C = W / 2 * Math.tan(rad(v.theta)), sc = C / v.A, Pcr = PI * PI * v.E * 1000 * v.I / v.S ** 2, nbAct = C > 0 ? Pcr / C : Infinity, ok = nbAct >= v.nb && sc <= v.allow;
      return output({ W, Ts, C, sc, Pcr, nb: Number.isFinite(nbAct) ? nbAct : 0 }, 'Compression in the spreader (kN)', C / 1000,
        [m('Design load', q(W / 1000, 'kN', 2)), m('Top sling tension (each)', q(Ts / 1000, 'kN', 2)), m('Spreader compression', q(C / 1000, 'kN', 2)), m('Compressive stress', q(sc, 'MPa', 1)), m('Euler buckling load', q(Pcr / 1000, 'kN', 1)), m('Buckling factor', Number.isFinite(nbAct) ? q(nbAct, '', 2) : 'No compression')],
        'Spreader beam check.', 'Pinned-end Euler column.', {
          text: ok ? 'SPREADER ADEQUATE' : 'SPREADER NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Buckling', nbAct >= v.nb ? 'pass' : 'fail', `${Number.isFinite(nbAct) ? q(nbAct, '', 2) : '∞'} against ${q(v.nb, '', 1)}.`), check('Stress', sc <= v.allow ? 'pass' : 'fail', `${q(sc, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Certification', 'verify', 'Design, proof-test and mark the spreader to the lifting equipment standard.')],
        });
    },
    "beam-sizing": (v) => {
      if (v.a > v.L) return invalid('The point load must lie on the beam.');
      const E = v.E * 1000, L = v.L; let M, xm, dI;
      if (v.sup === 'ss') {
        M = 0; xm = 0; for (let i = 0; i <= 2000; i++) { const x = L * i / 2000, Mx = v.w * x * (L - x) / 2 + v.P * (x < v.a ? x * (L - v.a) / L : v.a * (L - x) / L); if (Mx > M) { M = Mx; xm = x; } }
        const b = Math.min(v.a, L - v.a); dI = 5 * v.w * L ** 4 / (384 * E) + (b > 0 ? v.P * b * (L * L - b * b) ** 1.5 / (9 * Math.sqrt(3) * L * E) : 0);
      } else if (v.sup === 'cant') { M = v.w * L * L / 2 + v.P * v.a; xm = 0; dI = v.w * L ** 4 / (8 * E) + v.P * v.a * v.a * (3 * L - v.a) / (6 * E); }
      else { M = v.w * L * L / 12 + v.P * L / 8; xm = 0; dI = v.w * L ** 4 / (384 * E) + v.P * L ** 3 / (192 * E); }
      if (M <= 0) return invalid('Enter a load.');
      const Zreq = M / v.allow, dAllow = L / v.lim, Ireq = dI / dAllow, gov = 'Both', hasC = v.Zc > 0 && v.Ic > 0;
      const uS = hasC ? Zreq / v.Zc : 0, uD = hasC ? Ireq / v.Ic : 0, ok = !hasC || (uS <= 1 && uD <= 1);
      return output({ M, xm, Zreq, Ireq, dAllow, uS, uD, gov: hasC ? (uS >= uD ? 'Strength' : 'Deflection') : 'Both checks' }, 'Required section modulus (mm³)', Zreq,
        [m('Maximum bending moment', q(M / 1e6, 'kN·m', 3)), m('Position of maximum moment', q(xm, 'mm', 0)), m('Required section modulus', q(Zreq, 'mm³', 0)), m('Allowed deflection', q(dAllow, 'mm', 2)), m('Required second moment of area', q(Ireq, 'mm⁴', 0)), m('Chosen section utilisation (strength / deflection)', hasC ? `${q(uS * 100, '', 0)}% / ${q(uD * 100, '%', 0)}` : 'No section entered')],
        'Beam section requirements.', 'Elastic, laterally restrained beam.', {
          text: hasC ? (ok ? 'SECTION ADEQUATE' : 'SECTION TOO SMALL') : 'CALCULATED', tone: hasC ? (ok ? 'good' : 'bad') : 'warn',
          checks: [check('Lateral stability', 'verify', 'Check lateral-torsional buckling for unrestrained compression flanges.')],
        });
    },
    "compressed-air-system-sizing": (v) => {
      if (v.p2 >= v.p1) return invalid('The receiver lower pressure must be below the upper pressure.');
      const Qc = v.Q * (1 + v.leak / 100) * (1 + v.growth / 100), P1 = ATM * 1e5, P2 = (v.p1 + ATM) * 1e5, r = P2 / P1, k = 1.4;
      const ad = k / (k - 1) * P1 * (Qc / 60) * (r ** ((k - 1) / k) - 1) / 1000, shaft = ad / (v.eff / 100), spec = shaft / Qc, V = v.deficit * v.tpk * ATM / (v.p1 - v.p2);
      const drop = (dmm) => { const pabs = v.p + ATM, Tk = v.T + 273.15, rho = 1.204 * (pabs / ATM) * (293.15 / Tk), Qa = Qc / 60 * (ATM / pabs) * (Tk / 293.15), d = dmm / 1000, vel = Qa / (PI * d * d / 4), Re = rho * vel * d / 1.81e-5; let f = 0.02; if (Re < 2300) f = 64 / Re; else for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2; return f * v.L / d * rho * vel * vel / 2 / 1e5; };
      let lo = 3, hi = 2000; if (drop(hi) > v.dpMax) return invalid('No practical pipe bore meets the pressure-drop limit; shorten the run or accept more drop.');
      for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (drop(mid) > v.dpMax) lo = mid; else hi = mid; }
      const dReq = hi, leakQ = v.Q * v.leak / 100, leakCost = leakQ * spec * v.hours * v.price;
      return output({ Qc, ad, shaft, spec, V, dReq, leakQ, leakCost }, 'Compressor capacity (m³/min)', Qc,
        [m('Compressor free-air delivery', q(Qc, 'm³/min', 2)), m('Shaft power', q(shaft, 'kW', 1)), m('Specific power', q(spec, 'kW per m³/min', 2)), m('Receiver volume', `${q(V, 'm³', 2)} (${q(V * 1000, 'L', 0)})`), m('Minimum main pipe bore', q(dReq, 'mm', 1)), m('Leak flow', q(leakQ, 'm³/min', 2)), m('Annual cost of leaks', money(leakCost))],
        'Compressed-air system sizing.', 'Theoretical power; steady flow in the main.', {
          checks: [check('Pressure band', v.p2 >= v.p ? 'pass' : 'warn', v.p2 >= v.p ? 'The receiver lower limit still meets the working pressure.' : 'The receiver lower limit is below the working pressure: users will be starved during peaks.'), check('Leakage', v.leak <= 10 ? 'pass' : 'warn', v.leak <= 10 ? 'Leakage allowance is at good-practice level.' : `Leaks cost about ${money(leakCost)} a year: a leak survey usually pays back quickly.`)],
        });
    },
    "vibration-isolator-selection": (v) => {
      const ff = v.rpm / 60, Tt = 1 - v.iso / 100, tr = (r) => Math.sqrt((1 + (2 * v.zeta * r) ** 2) / ((1 - r * r) ** 2 + (2 * v.zeta * r) ** 2));
      let lo = Math.SQRT2 + 1e-9, hi = 1000; if (tr(hi) > Tt) return invalid('That isolation cannot be reached with this damping; lower the target or the damping.');
      for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (tr(mid) > Tt) lo = mid; else hi = mid; }
      const r = hi, fn = ff / r, delta = 9806.65 / (2 * PI * fn) ** 2, kReq = v.mass / v.nm * (2 * PI * fn) ** 2 / 1000;
      const has = v.k > 0, fnC = has ? Math.sqrt(v.k * 1000 * v.nm / v.mass) / (2 * PI) : 0, rC = has ? ff / fnC : 0, TC = has ? tr(rC) : 0, ok = !has || TC <= Tt;
      return output({ r, fn, delta, kReq, fnC, TC, isoC: has ? (1 - TC) * 100 : 0 }, 'Static deflection needed (mm)', delta,
        [m('Forcing frequency', q(ff, 'Hz', 2)), m('Frequency ratio needed', q(r, '', 3)), m('Natural frequency needed', q(fn, 'Hz', 2)), m('Static deflection needed', q(delta, 'mm', 2)), m('Stiffness per mount needed', q(kReq, 'N/mm', 0)), m('Chosen mounts: natural frequency', has ? q(fnC, 'Hz', 2) : 'No mount entered'), m('Chosen mounts: isolation', has ? (TC < 1 ? q((1 - TC) * 100, '%', 1) : `Amplifies ×${q(TC, '', 2)}`) : 'No mount entered')],
        'Vibration isolator selection.', 'Single-degree-of-freedom vertical model.', {
          text: has ? (ok ? 'MOUNTS ISOLATE' : TC >= 1 ? 'MOUNTS AMPLIFY' : 'ISOLATION BELOW TARGET') : 'CALCULATED', tone: has ? (ok ? 'good' : 'bad') : 'warn',
          checks: [check('Resonance', !has || Math.abs(rC - 1) > 0.3 ? 'pass' : 'fail', !has ? 'Choose mounts at or below the stiffness shown.' : Math.abs(rC - 1) > 0.3 ? 'Running speed is clear of resonance.' : 'Running speed is near resonance: vibration will be amplified.'), check('Start-up', 'verify', 'The machine passes through resonance when starting and stopping; damping or snubbers limit the movement.')],
        });
    },
    "motor-gearbox-selection": (v) => {
      const ns = { 2: 3000, 4: 1500, 6: 1000, 8: 750 }[v.poles], nm = ns * (1 - v.slip / 100), i = nm / v.nL, eta = v.eff / 100, Tm = v.TL / (i * eta), P = v.TL * 2 * PI * v.nL / 60 / eta / 1000;
      const Jr = v.JL / (i * i * eta), alpha = 2 * PI * nm / 60 / v.t, Ta = (v.Jm + Jr) * alpha, Tstart = Tm + Ta;
      const series = [0.18, 0.25, 0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315, 355, 400, 450, 500];
      const Prated = series.find((x) => x >= P * v.SF); if (!Prated) return invalid('The power is beyond the standard motor range listed.');
      const Trated = Prated * 1000 / (2 * PI * nm / 60), Tavail = v.start * Trated, ok = Tavail >= Tstart, ratio = Jr / Math.max(v.Jm, 1e-12);
      return output({ nm, i, Tm, P, Jr, Ta, Tstart, Prated, Trated, Tavail, ratio }, 'Motor rating (kW)', Prated,
        [m('Motor speed / gear ratio', `${q(nm, 'rpm', 0)} / ${q(i, ':1', 2)}`), m('Running torque at the motor', q(Tm, 'N·m', 2)), m('Running power', q(P, 'kW', 2)), m('Motor rating chosen', q(Prated, 'kW', 2)), m('Reflected load inertia', q(Jr, 'kg·m²', 5)), m('Acceleration torque', q(Ta, 'N·m', 2)), m('Starting torque needed / available', `${q(Tstart, '', 1)} / ${q(Tavail, 'N·m', 1)}`), m('Inertia ratio', `${q(ratio, '', 1)} : 1`)],
        'Motor and gearbox selection.', 'Constant load torque during start.', {
          text: ok ? 'MOTOR CAN START THE LOAD' : 'STARTING TORQUE TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Starting torque', ok ? 'pass' : 'fail', ok ? `${q(Tavail, 'N·m', 0)} available against ${q(Tstart, 'N·m', 0)} needed.` : 'Choose a larger motor, a longer start or a soft starter with torque boost.'), check('Gearbox rating', 'verify', `Choose a gearbox rated for ${q(v.TL * v.SF, 'N·m', 0)} at the output with the service factor.`)],
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
