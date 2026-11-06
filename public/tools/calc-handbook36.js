// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook36). SI units are explicit at each boundary.
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
    "deep-drawing-plan": (v) => {
      if (v.flange && v.flange <= v.d) return invalid('The flange diameter must be larger than the shell diameter.');
      const df = v.flange || v.d, D2 = df * df + 4 * v.d * v.h - 0.5 * v.r * v.d; if (D2 <= 0) return invalid('The geometry gives no blank; check the inputs.');
      const D = Math.sqrt(D2), rows = []; let prev = D, cur = Math.max(v.m1 * D, v.d), k = 1, Fmax = 0, F1 = 0, B1 = 0;
      while (true) {
        const F = PI * cur * v.t * v.uts * Math.max(prev / cur - 0.7, 0), B = v.pBH * PI / 4 * Math.max(prev * prev - (cur + 2 * v.rd) ** 2, 0), tot = F + B;
        if (k === 1) { F1 = F; B1 = B; } Fmax = Math.max(Fmax, tot); rows.push([String(k), q(cur, 'mm', 1), q(cur / prev, '', 3), q(F / 1000, 'kN', 1), q(B / 1000, 'kN', 1), q(tot / 1000, 'kN', 1)]);
        if (cur <= v.d + 1e-9 || k >= 20) break; prev = cur; cur = Math.max(v.m2 * cur, v.d); k++;
      }
      const ok = Fmax / 1000 <= v.press;
      return output({ D, ratio: v.d / D, draws: k, F1, B1, Fmax }, 'Blank diameter (mm)', D,
        [m('Blank diameter', q(D, 'mm', 2)), m('Overall ratio d ÷ D', q(v.d / D, '', 3)), m('Draws', q(k, '', 0)), m('First draw force', q(F1 / 1000, 'kN', 1)), m('First draw blank-holder force', q(B1 / 1000, 'kN', 1)), m('Heaviest draw with holder', q(Fmax / 1000, 'kN', 1))],
        'Deep drawing plan.', 'Handbook-style drawing force; constant ratios.', {
          text: ok ? 'PRESS ADEQUATE' : 'PRESS TOO SMALL', tone: ok ? 'good' : 'bad',
          table: tbl('Draws', ['Draw', 'Diameter', 'Ratio', 'Drawing force', 'Holder force', 'Press load'], rows),
          checks: [check('Press capacity', ok ? 'pass' : 'fail', `${q(Fmax / 1000, 'kN', 1)} against ${q(v.press, 'kN', 0)}.`), check('Annealing', k > 2 ? 'verify' : 'pass', k > 2 ? 'Several redraws: check whether annealing is needed between draws.' : 'One or two draws.')],
        });
    },
    "broaching-plan": (v) => {
      const capN = v.cap * 9810, pmin = 3 * Math.sqrt(v.L * v.rise * v.Fp), pallow = v.rise * v.L * v.b * v.kc / capN, pitch = Math.max(pmin, pallow, 5), zeAvg = v.L / pitch, ze = Math.ceil(zeAvg - 1e-9);
      const F = ze * v.rise * v.b * v.kc, nc = Math.ceil(v.stock / v.rise - 1e-9), Lt = (nc + v.fin) * pitch, stroke = Lt + v.L + v.appr, t = stroke / (v.v * 1000) + stroke / (v.vr * 1000) + v.load;
      const okF = F <= capN, okS = stroke <= v.strokeMax, okZ = zeAvg >= 2, ok = okF && okS;
      return output({ pmin, pallow, pitch, zeAvg, ze, F, nc, Lt, stroke, t }, 'Broaching force (kN)', F / 1000,
        [m('Pitch for chip space / for capacity', `${q(pmin, '', 2)} / ${q(pallow, 'mm', 2)}`), m('Pitch used', q(pitch, 'mm', 2)), m('Teeth engaged (average / most)', `${q(zeAvg, '', 2)} / ${q(ze, '', 0)}`), m('Cutting force', q(F / 1000, 'kN', 1)), m('Cutting teeth', q(nc, '', 0)), m('Toothed length', q(Lt, 'mm', 0)), m('Stroke', q(stroke, 'mm', 0)), m('Time per part', q(t, 'min', 2))],
        'Broaching plan.', 'Constant rise per tooth.', {
          text: ok ? 'BROACHING FEASIBLE' : 'BROACHING NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Machine pull', okF ? 'pass' : 'fail', `${q(F / 1000, 'kN', 1)} against ${q(capN / 1000, 'kN', 0)}.`), check('Stroke', okS ? 'pass' : 'fail', `${q(stroke, 'mm', 0)} against ${q(v.strokeMax, 'mm', 0)}: ${okS ? 'fits' : 'split into a set of broaches'}.`), check('Teeth in the cut', okZ ? 'pass' : 'warn', okZ ? 'At least two teeth cut at once.' : 'Fewer than two teeth cutting: the broach may chatter or drift.')],
        });
    },
    "shaft-critical-speed-check": (v) => {
      const d = v.d / 1000, L = v.L / 1000, E = v.E * 1e9, I = PI * d ** 4 / 64, A = PI * d * d / 4, EI = E * I, ws = (PI / L) ** 2 * Math.sqrt(EI / (v.rho * A));
      const ms = [[v.m1, v.a1], [v.m2, v.a2], [v.m3, v.a3]].filter((x) => x[0] > 0).map(([mm, a]) => [mm, a / 1000]);
      if (ms.some(([, a]) => a <= 0 || a >= L)) return invalid('Each mass must sit between the bearings.');
      const alpha = (x, a) => { const b = L - a; return x <= a ? b * x * (L * L - b * b - x * x) / (6 * EI * L) : a * (L - x) * (2 * L * x - a * a - x * x) / (6 * EI * L); };
      const wi = ms.map(([mm, a]) => 1 / Math.sqrt(mm * alpha(a, a))), wD = 1 / Math.sqrt(1 / (ws * ws) + wi.reduce((s, w) => s + 1 / (w * w), 0));
      const y = ms.map(([, xj]) => ms.reduce((s, [mi, ai]) => s + mi * 9.80665 * alpha(xj, ai), 0)), num = ms.reduce((s, [mm], j) => s + mm * y[j], 0), den = ms.reduce((s, [mm], j) => s + mm * y[j] * y[j], 0);
      const wR = ms.length ? Math.sqrt(9.80665 * num / den) : ws, nS = 60 * ws / (2 * PI), nD = 60 * wD / (2 * PI), nR = 60 * wR / (2 * PI), ratio = v.rpm / nD, mg = v.margin / 100;
      const st = ratio <= 1 - mg ? { text: 'BELOW CRITICAL', tone: 'good', s: 'pass' } : ratio >= 1 + mg ? { text: 'ABOVE CRITICAL', tone: 'warn', s: 'warn' } : { text: 'NEAR CRITICAL', tone: 'bad', s: 'fail' };
      return output({ nS, nD, nR, ratio, n1: wi.length ? 60 * wi[0] / (2 * PI) : 0 }, 'Critical speed, Dunkerley (rpm)', nD,
        [m('Shaft alone', q(nS, 'rpm', 0)), ...wi.map((w, k) => m(`Mass ${k + 1} alone`, q(60 * w / (2 * PI), 'rpm', 0))), m('Combined (Dunkerley, conservative)', q(nD, 'rpm', 0)), m('Masses only (Rayleigh)', ms.length ? q(nR, 'rpm', 0) : 'No masses'), m('Running ÷ critical', q(ratio * 100, '%', 1))],
        'Shaft critical speed with several masses.', 'Simple supports; uniform shaft.', {
          text: st.text, tone: st.tone,
          checks: [check('Separation', st.s, `Running at ${q(ratio * 100, '%', 0)} of the Dunkerley critical speed with a ${q(v.margin, '%', 0)} margin.`), check('Passing through', ratio >= 1 + mg ? 'warn' : 'pass', ratio >= 1 + mg ? 'Above critical: pass through the critical speed quickly at start and stop.' : 'Runs below the critical speed.')],
        });
    },
    "geneva-drive-design": (v) => {
      const lam = Math.sin(PI / v.n), a = v.C * lam, w = 2 * PI * v.rpm / 60, th0 = PI / 2 - PI / v.n, idxDeg = 180 - 360 / v.n, period = 60 / v.rpm, tIndex = idxDeg / 360 * period;
      let aMax = 0, Fpin = 0, Tdrv = 0, Tw = 0;
      for (let k = 0; k <= 2000; k++) {
        const th = -th0 + 2 * th0 * k / 2000, Dn = 1 - 2 * lam * Math.cos(th) + lam * lam, wr = lam * (Math.cos(th) - lam) / Dn, ar = lam * (lam * lam - 1) * Math.sin(th) / (Dn * Dn);
        const al = Math.abs(ar) * w * w, T = v.J * al + v.Tf, F = T / (v.C / 1000 * Math.sqrt(Dn)), Td = T * Math.abs(wr);
        aMax = Math.max(aMax, al); Tw = Math.max(Tw, T); Fpin = Math.max(Fpin, F); Tdrv = Math.max(Tdrv, Td);
      }
      const wPeak = w * lam / (1 - lam), okF = Fpin <= v.Fallow, okT = Tdrv <= v.Td, ok = okF && okT;
      return output({ a, tIndex, tDwell: period - tIndex, wPeak, peakRpm: wPeak * 60 / (2 * PI), alpha: aMax, Tw, Fpin, Tdrv }, 'Peak driver torque (N·m)', Tdrv,
        [m('Crank radius', q(a, 'mm', 2)), m('Index / dwell time', `${q(tIndex, '', 3)} / ${q(period - tIndex, 's', 3)}`), m('Peak wheel speed', q(wPeak * 60 / (2 * PI), 'rpm', 1)), m('Peak angular acceleration', q(aMax, 'rad/s²', 1)), m('Peak wheel torque', q(Tw, 'N·m', 2)), m('Peak roller force', q(Fpin, 'N', 0)), m('Peak driver torque', q(Tdrv, 'N·m', 2))],
        'Geneva drive dynamics.', 'Rigid parts; constant friction.', {
          text: ok ? 'DRIVE ADEQUATE' : 'DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Roller force', okF ? 'pass' : 'fail', `${q(Fpin, 'N', 0)} against ${q(v.Fallow, 'N', 0)}.`), check('Driver torque', okT ? 'pass' : 'fail', `${q(Tdrv, 'N·m', 2)} against ${q(v.Td, 'N·m', 1)}.`), check('Entry', 'verify', 'Make sure the roller enters the slot tangentially and the wheel is locked during dwell.')],
        });
    },
    "friction-grip-joint": (v) => {
      const As = PI / 4 * (v.d - 0.938194 * v.P) ** 2, proof = v.Sp * As, Fp = proof * v.pct / 100, T = v.K * Fp * v.d / 1000, clamp = Fp - v.Ft * 1000;
      if (clamp <= 0) return invalid('The applied tension removes all the clamp force.');
      const Rs = v.n * v.planes * v.mu * clamp / v.SFs, V = v.V * 1000, tau = V / (v.n * v.planes * PI * v.d * v.d / 4), sb = V / (v.n * v.d * v.t);
      const okS = Rs >= V, okB = tau <= v.tauA && sb <= v.bA;
      return output({ As, proof, Fp, T, clamp, Rs, tau, sb }, 'Slip resistance (kN)', Rs / 1000,
        [m('Stress area', q(As, 'mm²', 1)), m('Preload per bolt', q(Fp / 1000, 'kN', 2)), m('Tightening torque', q(T, 'N·m', 0)), m('Clamp left per bolt', q(clamp / 1000, 'kN', 2)), m('Slip resistance with safety factor', q(Rs / 1000, 'kN', 1)), m('Backup bolt shear stress', q(tau, 'MPa', 1)), m('Backup bearing stress', q(sb, 'MPa', 1))],
        'Friction-grip bolted joint.', 'Torque-controlled preload; applied tension taken off the clamp.', {
          text: okS ? 'NO SLIP' : 'JOINT WILL SLIP', tone: okS ? 'good' : 'bad',
          checks: [check('Slip', okS ? 'pass' : 'fail', `${q(Rs / 1000, 'kN', 1)} resistance against ${q(v.V, 'kN', 1)}.`), check('Bearing-type backup', okB ? 'pass' : 'warn', okB ? 'If the joint slips, the bolts and plates still carry the load in bearing.' : 'If the joint slips, bolt shear or plate bearing is over the allowable.'), check('Tightening method', 'verify', 'Use turn-of-nut or direct-tension indicators where the preload is critical.')],
        });
    },
    "flexible-coupling-selection": (v) => {
      if (v.d > v.dmax) return invalid('The shaft is larger than the largest bore of this coupling.');
      const T = v.P * 1000 / (2 * PI * v.n / 60), Treq = T * v.SF, Tpk = T * v.kpk, mis = (v.ang / v.angA + v.par / v.parA + v.ax / v.axA) * 100;
      const F = 2 * Treq * 1000 / v.d, tau = F / (v.w * v.Lh), sigma = F / (v.h / 2 * v.Lh);
      const okT = Treq <= v.Tn, okP = Tpk <= v.Tmax, okN = v.n <= v.nmax, okM = mis <= 100, okK = tau <= v.tauA && sigma <= v.sigA, ok = okT && okP && okN && okM && okK;
      return output({ T, Treq, Tpk, mis, F, tau, sigma }, 'Torque with service factor (N·m)', Treq,
        [m('Running torque', q(T, 'N·m', 1)), m('With service factor', `${q(Treq, '', 1)} N·m against ${q(v.Tn, 'N·m', 0)}`), m('Peak torque', `${q(Tpk, '', 1)} N·m against ${q(v.Tmax, 'N·m', 0)}`), m('Combined misalignment', q(mis, '%', 0)), m('Key shear / crushing stress', `${q(tau, '', 1)} / ${q(sigma, 'MPa', 1)}`)],
        'Flexible coupling selection.', 'Combined misalignment as a simple sum.', {
          text: ok ? 'COUPLING SUITABLE' : 'COUPLING NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Nominal torque', okT ? 'pass' : 'fail', `${q(Treq, 'N·m', 0)} against ${q(v.Tn, 'N·m', 0)}.`), check('Peak torque', okP ? 'pass' : 'fail', `${q(Tpk, 'N·m', 0)} against ${q(v.Tmax, 'N·m', 0)}.`), check('Speed', okN ? 'pass' : 'fail', `${q(v.n, 'rpm', 0)} against ${q(v.nmax, 'rpm', 0)}.`), check('Misalignment', okM ? 'pass' : 'fail', okM ? `${q(mis, '%', 0)} of the allowance.` : `${q(mis, '%', 0)} of the allowance: realign the shafts.`), check('Hub key', okK ? 'pass' : 'fail', `Shear ${q(tau, 'MPa', 1)}, crushing ${q(sigma, 'MPa', 1)}.`)],
        });
    },
    "punching-operation-plan": (v) => {
      const rd = v.shape === 'round', per = rd ? PI * v.dp : 2 * (v.a + v.bb), Ap = rd ? PI * v.dp * v.dp / 4 : v.a * v.bb, nominal = per * v.t * v.tau, F = nominal * v.factor, Fs = F * v.strip / 100, tot = (F + Fs) * v.nh;
      const sp = F / Ap, dmin = 4 * v.t * v.tau * v.factor / v.sigA, c = v.clr / 100 * v.t, die = rd ? v.dp + 2 * c : null, E = F * v.pen / 100 * v.t / 1000 * v.nh;
      const okP = tot / 1000 <= v.press, okS = sp <= v.sigA, ok = okP && okS;
      return output({ per, nominal, F, Fs, tot, sp, dmin, c, E }, 'Press load (kN)', tot / 1000,
        [m('Cut perimeter per punch', q(per, 'mm', 1)), m('Cutting force per punch', q(F / 1000, 'kN', 2)), m('Stripping force per punch', q(Fs / 1000, 'kN', 2)), m('Total press load', q(tot / 1000, 'kN', 1)), m('Punch compressive stress', q(sp, 'MPa', 0)), m('Smallest round punch for this sheet', q(dmin, 'mm', 2)), m('Clearance per side', q(c, 'mm', 3)), ...(rd ? [m('Die opening', q(die, 'mm', 3))] : []), m('Energy per hit', q(E, 'J', 1))],
        'Punching operation plan.', 'Flat-faced punches.', {
          text: ok ? 'PUNCHING FEASIBLE' : 'PUNCHING NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Press capacity', okP ? 'pass' : 'fail', `${q(tot / 1000, 'kN', 1)} against ${q(v.press, 'kN', 0)}.`), check('Punch stress', okS ? 'pass' : 'fail', `${q(sp, 'MPa', 0)} against ${q(v.sigA, 'MPa', 0)}.`), check('Off-centre load', v.nh > 1 ? 'verify' : 'pass', v.nh > 1 ? 'Place the punches so the load centre is under the ram.' : 'Single punch.')],
        });
    },
    "toggle-clamp-design": (v) => {
      const F = v.p / 10 * PI * v.bore * v.bore / 4 * v.eff / 100, a = rad(v.ang), R = F / (2 * Math.tan(a)), link = F / (2 * Math.sin(a)), angReq = deg(Math.atan(F / (2 * v.Rreq * 1000)));
      const out = 2 * v.L * (1 - Math.cos(a)), inp = v.L * Math.sin(a), st = link / v.A, okR = R >= v.Rreq * 1000, okS = st <= v.sA, ok = okR && okS;
      return output({ F, R, link, ma: R / F, angReq, out, inp, st }, 'Clamping force (N)', R,
        [m('Cylinder force', q(F, 'N', 0)), m('Clamping force at the angle', q(R, 'N', 0)), m('Mechanical advantage', q(R / F, '', 2)), m('Link force', q(link, 'N', 0)), m('Angle for the required force', q(angReq, '°', 2)), m('Output travel to straight', q(out, 'mm', 3)), m('Input travel', q(inp, 'mm', 2)), m('Link stress', q(st, 'MPa', 1))],
        'Toggle clamp design.', 'Rigid, frictionless links.', {
          text: ok ? 'CLAMP ADEQUATE' : 'CLAMP NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Clamping force', okR ? 'pass' : 'fail', `${q(R / 1000, 'kN', 2)} against ${q(v.Rreq, 'kN', 2)}; set the toggle at ${q(angReq, '°', 1)} or less.`), check('Link stress', okS ? 'pass' : 'fail', `${q(st, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Small angle', v.ang >= 2 ? 'pass' : 'warn', v.ang >= 2 ? 'Angle large enough for the ideal relation.' : 'Near straight: elasticity and clearance govern the real force.')],
        });
    },
    "cylindrical-grinding-planner": (v) => {
      const vs = PI * v.ds * v.ns / 60000, nw = 1000 * v.vw / (PI * v.dw), ratio = vs / (v.vw / 60), De = v.ds * v.dw / (v.ds + v.dw), lg = Math.sqrt(v.ae * De), rate = v.frac / 100 * v.bw * nw;
      const Q = PI * v.dw * v.ae * rate / 60, P = v.u * Q / 1000, passes = Math.ceil(v.stock / v.ae - 1e-9) + v.spark, t = passes * (v.Lw + v.bw) / rate, Pav = v.Pm * v.eta / 100, okS = vs <= v.vsMax, okP = P <= Pav, ok = okS && okP;
      return output({ vs, nw, ratio, De, lg, rate, Q, P, passes, t }, 'Grinding power (kW)', P,
        [m('Wheel speed', q(vs, 'm/s', 2)), m('Work speed', q(nw, 'rpm', 1)), m('Speed ratio v_s ÷ v_w', q(ratio, '', 0)), m('Equivalent diameter / contact length', `${q(De, '', 2)} / ${q(lg, 'mm', 3)}`), m('Traverse rate', q(rate, 'mm/min', 0)), m('Removal rate', q(Q, 'mm³/s', 1)), m('Grinding power', q(P, 'kW', 2)), m('Passes (incl. spark-out)', q(passes, '', 0)), m('Grinding time', q(t, 'min', 2))],
        'Cylindrical grinding plan.', 'Specific energy method; external traverse.', {
          text: ok ? 'PLAN FEASIBLE' : 'PLAN NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Wheel speed', okS ? 'pass' : 'fail', okS ? `${q(vs, 'm/s', 1)} within the ${q(v.vsMax, 'm/s', 0)} marked maximum.` : `${q(vs, 'm/s', 1)} exceeds the ${q(v.vsMax, 'm/s', 0)} marked maximum: reduce spindle speed.`), check('Spindle power', okP ? 'pass' : 'fail', `${q(P, 'kW', 2)} against ${q(Pav, 'kW', 2)} available.`), check('Burn', 'verify', 'Watch for burn and chatter; dress the wheel and use ample coolant.')],
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
