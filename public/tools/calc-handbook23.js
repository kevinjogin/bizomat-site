// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook23). SI units are explicit at each boundary.
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
    "spur-contact-diameters": (v) => {
      const P = 1 / v.m, ph = rad(v.phi), n = v.z1, Nn = v.z2, d0 = v.do1 || v.m * (n + 2), D0 = v.do2 || v.m * (Nn + 2);
      const cA = Nn * Math.cos(ph) / (D0 * P), ca = n * Math.cos(ph) / (d0 * P);
      if (cA >= 1 || ca >= 1) return invalid('An outside diameter is at or below its base circle.');
      const A = Math.acos(cA), a = Math.acos(ca), tb = Math.tan(ph) - Nn / n * (Math.tan(A) - Math.tan(ph)), tB = Math.tan(ph) - n / Nn * (Math.tan(a) - Math.tan(ph));
      if (tb < 0 || tB < 0) return invalid('Contact would begin below a base circle: the gears interfere at these outside diameters.');
      const dc1 = n * Math.cos(ph) / (P * Math.cos(Math.atan(tb))), dc2 = Nn * Math.cos(ph) / (P * Math.cos(Math.atan(tB)));
      const mf = Nn * (Math.tan(A) - tB) / (2 * PI), mf2 = n * (Math.tan(a) - tb) / (2 * PI);
      const tc = Math.tan(a) - 2 * PI / n, tC = Math.tan(A) - 2 * PI / Nn;
      const dL1 = tc > 0 ? n * Math.cos(ph) / (P * Math.cos(Math.atan(tc))) : NaN, dL2 = tC > 0 ? Nn * Math.cos(ph) / (P * Math.cos(Math.atan(tC))) : NaN;
      const rc = v.m * (0.785398 * Math.cos(ph) - v.bded * Math.sin(ph)) / (1 - Math.sin(ph));
      return output({ dc1, dc2, mf, mf2, dL1: Number.isFinite(dL1) ? dL1 : 0, dL2: Number.isFinite(dL2) ? dL2 : 0, rc }, 'Contact ratio', mf,
        [m('Contact diameter, gear 1', q(dc1, 'mm', 4)), m('Contact diameter, gear 2', q(dc2, 'mm', 4)), m('Base diameter, gear 1', q(n * v.m * Math.cos(ph), 'mm', 4)), m('Contact ratio', q(mf, '', 4)), m('Contact ratio (check)', q(mf2, '', 4)), m('LPSTC diameter, gear 1', Number.isFinite(dL1) ? q(dL1, 'mm', 4) : 'Contact ratio below 1'), m('LPSTC diameter, gear 2', Number.isFinite(dL2) ? q(dL2, 'mm', 4) : 'Contact ratio below 1'), m('Maximum hob tip radius', q(rc, 'mm', 4))],
        'Spur gear contact geometry.', 'Standard centre distance.', {
          checks: [check('Contact ratio', mf >= 1.4 ? 'pass' : mf >= 1.15 ? 'warn' : 'fail', mf >= 1.4 ? 'Above the general minimum of about 1.4.' : mf >= 1.15 ? 'Between 1.15 and 1.4: acceptable only with tolerances accounted for.' : 'Too low for smooth load transfer.')],
        });
    },
    "clutch-teeth-dividing-head": (v) => {
      const idx = 360 / v.Nt, dm = (x) => { const d = Math.floor(x + 1e-12), mnt = (x - d) * 60; return `${d}° ${mnt.toFixed(1)}′`; };
      if (v.type === 'straight') return output({ idx, alpha: 90 }, 'Index angle between teeth (°)', idx,
        [m('Angle between teeth', q(idx, '°', 4)), m('Dividing-head angle', '90° (vertical)'), m('Tooth count', v.Nt % 2 ? 'Odd: each pass finishes two tooth sides' : 'Even: mill one side of all teeth, then reset the cutter')],
        'Straight-sided clutch teeth.', 'Plain cutter on the centre line.');
      const c = v.type === 'single' ? Math.tan(rad(360 / v.Nt)) / Math.tan(rad(v.theta)) / 2 : Math.tan(rad(180 / v.Nt)) / Math.tan(rad(v.theta / 2)) / 2;
      if (v.type === 'single' && v.Nt <= 4) return invalid('Saw-tooth clutches need at least 5 teeth for this method.');
      if (!(c > 0 && c <= 1)) return invalid('No dividing-head angle exists for this tooth count and cutter angle.');
      const alpha = deg(Math.acos(c));
      return output({ idx, alpha, alphaText: dm(alpha) }, 'Dividing-head angle (°)', alpha,
        [m('Dividing-head angle', `${q(alpha, '°', 3)} (${dm(alpha)})`), m('Angle between teeth', q(idx, '°', 4)), m('Cutter', v.type === 'single' ? `${q(v.theta, '°', 0)} single-angle` : `${q(v.theta, '°', 0)} double-angle`)],
        'Dividing-head angle for clutch teeth.', 'Handbook formulas.');
    },
    "silent-chain-sprocket": (v) => {
      const t = rad(180 / v.Nt), PD = v.P / Math.sin(t), cot = 1 / Math.tan(t), OD = v.P * (cot + 0.08), G = v.P * (cot - 1.16), Dp = 0.625 * v.P;
      const centre = PD - 0.125 * v.P / Math.sin(rad(30) - t), OPD = v.Nt % 2 ? centre * Math.cos(t / 2) + Dp : centre + Dp;
      return output({ PD, OD, G, Dp, OPD }, 'Pitch diameter (mm)', PD,
        [m('Pitch diameter', q(PD, 'mm', 3)), m('Outside diameter (round teeth)', q(OD, 'mm', 3)), m('Maximum guide groove diameter', q(G, 'mm', 3)), m('Gauge pin diameter', q(Dp, 'mm', 3)), m(`Over-pin diameter (${v.Nt % 2 ? 'odd' : 'even'} teeth)`, q(OPD, 'mm', 3))],
        'Silent chain sprocket diameters.', 'ANSI formulas for 3/8 in. and larger pitch.');
    },
    "microtool-stiffness": (v) => {
      const dD = ((v.D2 / v.D1) ** 4 - 1) * 100, dL = ((v.L1 / v.L2) ** 2 - 1) * 100, ratio = (v.D2 / v.D1) ** 4 * (v.L1 / v.L2) ** 2;
      const I = PI * (v.k * v.D2) ** 4 / 64, delta = v.F * v.Lo ** 3 / (3 * v.E * 1000 * I);
      return output({ dD, dL, ratio, delta }, 'Deflection of the new tool (µm)', delta * 1000,
        [m('Change from diameter', q(dD, '%', 1)), m('Change from flute length', q(dL, '%', 1)), m('Combined stiffness ratio new ÷ old', q(ratio, '', 3)), m('Bending deflection of the new tool', q(delta * 1000, 'µm', 2))],
        'Small tool stiffness comparison.', 'Proportional scaling; cantilever deflection.');
    },
    "stockpile-weight": (v) => {
      const tn = Math.tan(rad(v.theta)); let h, V, base;
      if (v.shape === 'circle') { h = v.D / 2 * tn; V = PI * v.D * v.D * h / 12; base = PI * v.D * v.D / 4; }
      else { if (v.A > v.B) return invalid('Enter the shorter side as the width A.'); h = v.A / 2 * tn; V = v.A * h * (3 * v.B - v.A) / 6; base = v.A * v.B; }
      const mass = V * v.rho;
      return output({ h, V, mass }, 'Weight (kg)', mass,
        [m('Pile height', q(h, 'm', 3)), m('Volume', q(V, 'm³', 3)), m('Weight', q(mass / 1000, 't', 3)), m('Average base pressure', q(mass * 9.80665 / base / 1000, 'kPa', 2))],
        'Natural pile volume and weight.', 'Pile at the angle of repose.');
    },
    "lumber-board-feet": (v) => {
      const bf = (v.t / 25.4) * (v.w / 25.4) * (v.L / 0.3048) / 12 * v.qty, vol = v.t * v.w * v.L * v.qty / 1e6, cost = v.pmode === 'bf' ? bf * v.price : vol * v.price;
      return output({ bf, vol, cost, mass: vol * v.rho }, 'Board feet', bf,
        [m('Board feet', q(bf, 'fbm', 2)), m('Volume', q(vol, 'm³', 4)), m('Cost', money(cost)), m('Price per board foot', money(cost / bf)), m('Price per cubic metre', money(cost / vol)), m('Weight', q(vol * v.rho, 'kg', 1))],
        'Timber quantity and cost.', 'Sizes as entered.');
    },
    "bolt-working-strength-packed": (v) => {
      const din = v.d / 25.4, psi = v.St / 0.0068948, Ain = v.Ar / 645.16;
      const Wlb = psi * (0.55 * din * din - 0.25 * din), W2lb = psi * (Ain - 0.25 * din);
      if (Wlb <= 0) return invalid('The bolt is too small for this formula to give a positive working strength.');
      const W = Wlb * 4.448222, W2 = W2lb * 4.448222, nb = Math.ceil(v.load * 1000 / W - 1e-9);
      return output({ W, W2, Wlb, nb }, 'Working strength per bolt (N)', W,
        [m('Working strength (0.55 d² − 0.25 d)', q(W / 1000, 'kN', 3)), m('Working strength (root area)', W2 > 0 ? q(W2 / 1000, 'kN', 3) : 'Not positive'), m('Working strength in pounds', q(Wlb, 'lb', 0)), m('Bolts for the total load', q(nb, '', 0))],
        'Packed-joint bolt working strength.', 'Empirical rule.', {
          checks: [check('Bolt size', v.d >= 15.9 ? 'pass' : 'warn', v.d >= 15.9 ? 'At least 5/8 in. (16 mm).' : 'Bolts below 5/8 in. can be broken by normal tightening; avoid for tight joints.')],
        });
    },
    "press-flywheel-sizing": (v) => {
      const E = v.emode === 'force' ? v.F * v.s : v.E * 1000; if (E <= 0) return invalid('Enter the energy per stroke.');
      const T = 60 / v.spm; if (v.tcut >= T) return invalid('The cut time must be shorter than the stroke time.');
      const P = E * v.spm / 60, E1 = E * (1 - v.tcut / T), v1 = PI * v.Dm * v.rpm / 60, v2 = v1 * (1 - v.red / 100), mass = 2 * E1 / (v1 * v1 - v2 * v2);
      const Arim = mass / (v.rho * PI * v.Dm), a = Math.sqrt(Arim / v.y), b = v.y * a, sigma = v.rho * v1 * v1 / 1e6;
      return output({ E, P, E1, mass, v1, sigma, a: a * 1000, b: b * 1000 }, 'Rim mass (kg)', mass,
        [m('Energy per stroke', q(E / 1000, 'kJ', 2)), m('Average motor power', q(P / 1000, 'kW', 2)), m('Energy from the flywheel', q(E1 / 1000, 'kJ', 2)), m('Rim mass', q(mass, 'kg', 0)), m('Rim section width × depth', `${q(a * 1000, '', 0)} × ${q(b * 1000, 'mm', 0)}`), m('Rim speed', q(v1, 'm/s', 2)), m('Rim hoop stress', q(sigma, 'MPa', 2))],
        'Punch or shear flywheel size.', 'Rim inertia only; simple hoop stress.');
    },
    "ect-cutting-forces": (v) => {
      const A = v.f * v.a, ECT = A / v.CEL, MRR = 1000 * v.V * A, Fc = A * v.Kc, FH = v.ratio * Fc, FA = FH * Math.cos(rad(v.cfa)), FR = FH * Math.sin(rad(v.cfa)), P = Fc * v.V / 60000;
      return output({ ECT, A, MRR, Fc, FH, FA, FR, P }, 'Equivalent chip thickness (mm)', ECT,
        [m('Equivalent chip thickness', q(ECT, 'mm', 4)), m('Chip area', q(A, 'mm²', 3)), m('Metal removal rate', q(MRR / 1000, 'cm³/min', 1)), m('Cutting force F_C', q(Fc, 'N', 0)), m('Feed-plane force F_H', q(FH, 'N', 0)), m('Axial force F_A', q(FA, 'N', 0)), m('Radial force F_R', q(FR, 'N', 0)), m('Cutting power', q(P, 'kW', 2))],
        'ECT and cutting forces.', 'Area ≈ feed × depth.', {
          checks: [check('ECT against feed', ECT < v.f ? 'pass' : 'warn', ECT < v.f ? 'ECT below the feed, as expected.' : 'ECT should be less than the feed; check the cutting edge length.')],
        });
    },
    "draw-reductions": (v) => {
      if (v.d >= v.D) return invalid('The final diameter must be smaller than the blank.');
      const d1 = v.m1 * v.D, n = v.d >= d1 ? 1 : 1 + Math.ceil(Math.log(v.d / d1) / Math.log(v.mr) - 1e-9);
      if (n > 30) return invalid('More than 30 draws: check the ratios.');
      const seq = []; let prev = v.D;
      for (let i = 1; i <= n; i++) { const di = i === n ? v.d : i === 1 ? d1 : prev * v.mr; seq.push([i, di, di / prev]); prev = di; }
      return output({ n, d1, last: v.d }, 'Number of draws', n,
        [m('Number of draws', q(n, '', 0)), m('First draw diameter', q(Math.max(d1, v.d), 'mm', 2)), m('Overall ratio d ÷ D', q(v.d / v.D, '', 3))],
        'Deep drawing sequence.', 'Constant limiting ratios.', {
          table: tbl('Draw sequence', ['Draw', 'Diameter', 'Ratio', 'Reduction'], seq.map(([i, di, r]) => [String(i), q(di, 'mm', 2), q(r, '', 3), q((1 - r) * 100, '%', 1)])),
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
