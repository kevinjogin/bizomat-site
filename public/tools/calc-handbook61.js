// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook61). SI units are explicit at each boundary.
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
    "inch-milling-setup-check": (v) => {
      const rpm0 = 12 * v.sfm / (PI * v.D), ipm0 = rpm0 * v.teeth * v.ipt, capped = rpm0 > v.nMax, rpm = capped ? v.nMax : rpm0, sfmUse = rpm * PI * v.D / 12, ipm = rpm * v.teeth * v.ipt;
      const mrr = v.woc * v.doc * ipm, hpNeed = mrr * v.Ku / (v.eff / 100), ok = hpNeed <= v.hp + 1e-9, woc = v.woc <= v.D + 1e-12;
      return output({ rpm0, ipm0, rpm, sfmUse, ipm, mrr, hpNeed }, 'Spindle speed (rpm)', rpm,
        [m('Spindle speed', `${q(rpm, 'rpm', 0)}${capped ? ` (capped from ${q(rpm0, '', 0)})` : ''}`), m('Surface speed used', q(sfmUse, 'ft/min', 0)), m('Table feed', q(ipm, 'in/min', 2)), m('Removal rate', q(mrr, 'in³/min', 3)), m('Spindle power needed', `${q(hpNeed, 'hp', 2)} (${q(hpNeed * 0.7457, 'kW', 2)})`)],
        'Inch milling setup check.', 'Unit power method.', {
          text: !woc ? 'WIDTH EXCEEDS CUTTER' : ok ? 'SETUP WITHIN MACHINE' : 'SETUP EXCEEDS MACHINE POWER', tone: ok && woc ? 'good' : 'bad',
          checks: [check('Spindle power', ok ? 'pass' : 'fail', `${q(hpNeed, 'hp', 2)} against ${q(v.hp, 'hp', 1)}${ok ? '.' : ': reduce the width or depth of cut.'}`), check('Spindle speed', capped ? 'warn' : 'pass', capped ? `The machine tops out at ${q(v.nMax, 'rpm', 0)}; the cutter runs at ${q(sfmUse, 'ft/min', 0)}.` : 'Within the spindle speed range.'), check('Width of cut', woc ? 'pass' : 'fail', woc ? 'Width within the cutter diameter.' : 'The width of cut is larger than the cutter diameter.')],
        });
    },
    "index-table-drive-check": (v) => {
      if (v.tc <= v.ti) return invalid('The cycle time must be longer than the index time.');
      const J = 0.5 * v.M * (v.R / 1000) ** 2 + v.st * v.mf * (v.rf / 1000) ** 2, th = 2 * PI / v.st, wmax = v.law === 'cyc' ? 2 * th / v.ti : 1.5 * th / v.ti, al = v.law === 'cyc' ? 2 * PI * th / v.ti ** 2 : 4.5 * th / v.ti ** 2;
      const Ttab = J * al + v.Tf, Tmot = Ttab / (v.i * v.eta / 100) + v.Jm * al * v.i, nmot = wmax * v.i * 60 / (2 * PI), hold = v.SF * v.Fm * v.rf / 1000, ratio = J / (v.i * v.i) / Math.max(v.Jm, 1e-12), holdBrake = v.Tb * v.i;
      const okT = Tmot <= v.TmPk + 1e-12, okN = nmot <= v.nMaxM + 1e-9, okR = ratio <= v.ratioMax + 1e-12, okH = holdBrake >= hold - 1e-9, ok = okT && okN && okR && okH;
      return output({ J, th: deg(th), wmax, al, Ttab, Tmot, nmot, dwell: v.tc - v.ti, hold, ratio, holdBrake }, 'Peak motor torque (N·m)', Tmot,
        [m('Table inertia', q(J, 'kg·m²', 3)), m('Peak speed / acceleration', `${q(wmax, 'rad/s', 2)} / ${q(al, 'rad/s²', 1)}`), m('Peak torque: table / motor', `${q(Ttab, '', 1)} / ${q(Tmot, 'N·m', 3)}`), m('Motor speed', q(nmot, 'rpm', 0)), m('Inertia ratio', q(ratio, '', 2)), m('Holding: needed / brake at the table', `${q(hold, '', 0)} / ${q(holdBrake, 'N·m', 0)}`)],
        'Rotary index table drive check.', 'Rigid drive; peak values.', {
          text: ok ? 'DRIVE ADEQUATE' : 'DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Motor torque', okT ? 'pass' : 'fail', `${q(Tmot, 'N·m', 3)} against ${q(v.TmPk, 'N·m', 2)}.`), check('Motor speed', okN ? 'pass' : 'fail', `${q(nmot, 'rpm', 0)} against ${q(v.nMaxM, 'rpm', 0)}.`), check('Inertia ratio', okR ? 'pass' : 'fail', `${q(ratio, '', 2)} against ${q(v.ratioMax, '', 1)}${okR ? '.' : ': raise the reducer ratio or use a motor with more rotor inertia.'}`), check('Holding', okH ? 'pass' : 'fail', `${q(holdBrake, 'N·m', 0)} against ${q(hold, 'N·m', 0)} needed.`)],
        });
    },
    "hand-lever-design-check": (v) => {
      const W = v.W1 + v.W2 + v.W3, Mw = v.W1 * v.a1 + v.W2 * v.a2 + v.W3 * v.a3;
      if (Mw <= 0) return invalid('Enter at least one load with a distance from the fulcrum.');
      const F = v.mode === 'force' ? Mw / v.x : v.F, x = v.mode === 'force' ? v.x : Mw / v.F, R = v.type === 'first' ? F + W : Math.abs(W - F), MA = W / F;
      const first = v.type === 'first', loads = [[v.W1, v.a1], [v.W2, v.a2], [v.W3, v.a3]].filter(([w]) => w > 0), forces = loads.map(([w, a]) => [-w, first ? -a : a]);
      forces.push([first ? -F : F, x]); forces.push([-forces.reduce((s, f) => s + f[0], 0), 0]);
      const Mmax = Math.max(...forces.map(([, s]) => Math.abs(forces.reduce((acc, [f, p]) => acc + (p > s ? f * (p - s) : 0), 0))));
      const sb = 6 * Mmax / (v.b * v.h * v.h), tau = 2 * R / (PI * v.d * v.d), pb = R / (v.d * v.b), okB = sb <= v.sA + 1e-9, okS = tau <= v.tauA + 1e-9, okP = pb <= v.pA + 1e-9, ok = okB && okS && okP;
      return output({ F, x, MA, R, Mmax, sb, tau, pb }, v.mode === 'force' ? 'Effort (N)' : 'Effort arm (mm)', v.mode === 'force' ? F : x,
        [m('Effort / effort arm', `${q(F, 'N', 1)} at ${q(x, 'mm', 0)}`), m('Mechanical advantage', q(MA, '', 2)), m('Fulcrum reaction', q(R, 'N', 1)), m('Largest bending moment', q(Mmax / 1000, 'N·m', 2)), m('Arm bending stress', q(sb, 'MPa', 1)), m('Pin shear / bearing', `${q(tau, '', 1)} / ${q(pb, 'MPa', 1)}`)],
        'Hand lever design check.', 'Static loads; rectangular arm.', {
          text: ok ? 'LEVER ADEQUATE' : 'LEVER NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Arm bending', okB ? 'pass' : 'fail', `${q(sb, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Pin shear', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauA, 'MPa', 0)}.`), check('Pin bearing', okP ? 'pass' : 'fail', `${q(pb, 'MPa', 1)} against ${q(v.pA, 'MPa', 0)}.`), check('Effort', 'verify', 'Check the effort against what an operator can comfortably apply at that position.')],
        });
    },
    "plate-shear-capacity-check": (v) => {
      const tau = v.ratio * v.uts, F = v.blades === 'parallel' ? tau * v.b * v.t : v.n * v.ratio * v.uts * v.pen * v.t * v.t / Math.tan(rad(v.rake));
      const Fm = v.blades === 'parallel' ? 1.3 * F : F, use = Fm / 1000 / v.cap, tMax = v.blades === 'parallel' ? v.t / use : v.t / Math.sqrt(use), okF = use <= 1 + 1e-12, okL = v.b <= v.Lk + 1e-9, ok = okF && okL;
      return output({ F, Fm, use, tMax }, 'Machine force (kN)', Fm / 1000,
        [m('Shear strength', q(tau, 'MPa', 0)), m('Shearing force', q(F / 1000, 'kN', 1)), m('Machine force', q(Fm / 1000, 'kN', 1)), m('Use of capacity', q(100 * use, '%', 0)), m('Largest thickness of this material', q(tMax, 'mm', 2))],
        'Plate shear capacity check.', 'Sharp blades; maker’s rated capacity.', {
          text: ok ? 'CUT WITHIN SHEAR' : 'CUT EXCEEDS SHEAR', tone: ok ? 'good' : 'bad',
          checks: [check('Force', okF ? 'pass' : 'fail', `${q(Fm / 1000, 'kN', 1)} against ${q(v.cap, 'kN', 0)}.`), check('Cut length', okL ? 'pass' : 'fail', `${q(v.b, 'mm', 0)} against a ${q(v.Lk, 'mm', 0)} knife${okL ? '.' : ': cut in two passes or use a longer shear.'}`), check('Blade clearance', 'verify', 'Set the blade clearance for this thickness before cutting.')],
        });
    },
    "vee-groove-pin-inspection": (v) => {
      const s = Math.sin(rad(v.angle / 2)), t = Math.tan(rad(v.angle / 2)), centre = (v.pin / 2) / s, depth = (v.width / 2) / t, above = v.pin / 2 + centre - depth, contact = centre - (v.pin / 2) * s;
      if (contact >= depth) return invalid('The pin is too large: it rests on the groove edges instead of the flanks.');
      const hAt = (w) => v.pin / 2 + centre - (w / 2) / t, hLow = hAt(v.width + v.tol), hHigh = hAt(v.width - v.tol), wMeas = 2 * t * (v.pin / 2 + centre - v.hm), dev = wMeas - v.width, ok = Math.abs(dev) <= v.tol + 1e-9;
      return output({ above, centre, depth, contact, hLow, hHigh, wMeas, dev }, 'Groove width from the reading (mm)', wMeas,
        [m('Pin centre above the apex', q(centre, 'mm', 4)), m('Apex depth at nominal width', q(depth, 'mm', 4)), m('Pin height at nominal', q(above, 'mm', 4)), m('Pin height at the limits', `${q(hLow, '', 4)} (widest) to ${q(hHigh, 'mm', 4)} (narrowest)`), m('Width from the reading', `${q(wMeas, 'mm', 4)} (${q(dev, 'mm', 4)})`)],
        'Vee groove pin inspection.', 'Straight flanks; angle correct.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Groove width', ok ? 'pass' : 'fail', `${q(wMeas, 'mm', 4)} against ${q(v.width - v.tol, '', 4)}–${q(v.width + v.tol, 'mm', 4)}.`), check('Pin contact', 'pass', `The pin touches the flanks ${q(depth - contact, 'mm', 3)} below the top edge.`), check('Groove angle', 'verify', 'Check the angle separately; an angle error reads as a width error.')],
        });
    },
    "special-section-beam-check": (v) => {
      const { A, B, C, D } = v; let area, yb = 0, Ix, H;
      const hexI = (af) => { const s = af / Math.sqrt(3); return { a: 1.5 * Math.sqrt(3) * s * s, I: 5 * Math.sqrt(3) * s ** 4 / 16 }; };
      switch (v.shape) {
        case 'ellipse': area = PI * A * B / 4; Ix = PI * A * B ** 3 / 64; H = B; break;
        case 'hellipse': if (C >= A || D >= B) return invalid('The inner axes must be smaller than the outer axes.'); area = PI * (A * B - C * D) / 4; Ix = PI * (A * B ** 3 - C * D ** 3) / 64; H = B; break;
        case 'half': { const r = A / 2; area = PI * r * r / 2; yb = 4 * r / (3 * PI); Ix = (PI / 8 - 8 / (9 * PI)) * r ** 4; H = r; break; }
        case 'hex': { const h = hexI(A); area = h.a; Ix = h.I; H = A; break; }
        case 'tri': area = A * B / 2; yb = B / 3; Ix = A * B ** 3 / 36; H = B; break;
        case 'cirhex': { const h = hexI(C); if (2 * C / Math.sqrt(3) >= A) return invalid('The hexagonal hole must fit inside the circle.'); area = PI * A * A / 4 - h.a; Ix = PI * A ** 4 / 64 - h.I; H = A; break; }
        default: if (C * Math.SQRT2 >= A) return invalid('The square hole must fit inside the circle.'); area = PI * A * A / 4 - C * C; Ix = PI * A ** 4 / 64 - C ** 4 / 12; H = A;
      }
      if (!(area > 0 && Ix > 0)) return invalid('The dimensions give no area.');
      const c = ['half', 'tri'].includes(v.shape) ? Math.max(yb, H - yb) : H / 2, L = v.L, a = v.a, P = v.load, EI = v.E * 1000 * Ix; let M, d, R1, R2;
      if (v.case === 'ff-offset') { if (a <= 0 || a >= L) return invalid('The load must lie between the supports.'); const b = L - a; R1 = P * b * b * (3 * a + b) / L ** 3; R2 = P - R1; M = Math.max(P * a * b * b / L ** 2, P * a * a * b / L ** 2, 2 * P * a * a * b * b / L ** 3); d = P * a ** 3 * b ** 3 / (3 * EI * L ** 3); }
      else if (v.case === 'guided-point') { R1 = P; R2 = 0; M = P * L / 2; d = P * L ** 3 / (12 * EI); }
      else if (v.case === 'guided-udl') { R1 = P; R2 = 0; M = P * L / 3; d = P * L ** 3 / (24 * EI); }
      else if (v.case === 'prop-point') { if (a <= 0 || a >= L) return invalid('The load must lie within the span.'); R2 = P * a * a * (3 * L - a) / (2 * L ** 3); R1 = P - R2; const MA = P * a - R2 * L; M = Math.max(Math.abs(MA), R2 * (L - a)); d = 0; for (let i = 0; i <= 400; i++) { const xx = L * i / 400, yp = xx <= a ? P * xx * xx * (3 * a - xx) / (6 * EI) : P * a * a * (3 * xx - a) / (6 * EI), yr = R2 * xx * xx * (3 * L - xx) / (6 * EI); d = Math.max(d, yp - yr); } }
      else { if (2 * a > L) return invalid('The loads must lie within the span (a ≤ L/2).'); R1 = R2 = P; M = P * a; d = P * a * (3 * L * L - 4 * a * a) / (24 * EI); }
      const stress = M * c / Ix, dAllow = L / v.dlim, mass = area * v.rho / 1e6, okS = stress <= v.allow + 1e-9, okD = d <= dAllow + 1e-12, ok = okS && okD;
      return output({ area, Ix, c, R1, R2, M, d, stress, dAllow, mass }, 'Bending stress (MPa)', stress,
        [m('Area / mass per metre', `${q(area, 'mm²', 1)} / ${q(mass, 'kg/m', 2)}`), m('Ix / extreme fibre', `${q(Ix, 'mm⁴', 0)} / ${q(c, 'mm', 2)}`), m('Reactions', `${q(R1, '', 1)} and ${q(R2, 'N', 1)}`), m('Maximum bending moment', q(M / 1e6, 'kN·m', 4)), m('Bending stress', q(stress, 'MPa', 1)), m('Deflection / allowed', `${q(d, '', 3)} / ${q(dAllow, 'mm', 3)}`)],
        'Special section beam check.', 'Elastic; bending about the horizontal axis.', {
          text: ok ? 'BEAM ADEQUATE' : okS ? 'DEFLECTION EXCEEDED' : 'OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Deflection', okD ? 'pass' : 'fail', `${q(d, 'mm', 3)} against ${q(dAllow, 'mm', 3)} (span ÷ ${q(v.dlim, '', 0)}).`), check('End fixity', 'verify', 'Confirm the ends are really fixed or guided as assumed.')],
        });
    },
    "force-group-support-check": (v) => {
      if (v.xA === v.xB) return invalid('The two supports must be apart.');
      let Rx = 0, Ry = 0, M = 0, n = 0;
      for (let i = 1; i <= 4; i++) { const F = v['F' + i]; if (!F) continue; n++; const fx = F * Math.cos(rad(v['a' + i])), fy = F * Math.sin(rad(v['a' + i])); Rx += fx; Ry += fy; M += v['x' + i] * fy - v['y' + i] * fx; }
      if (!n) return invalid('Enter at least one force.');
      const clean = (z) => (Math.abs(z) < 1e-9 ? 0 : z); Rx = clean(Rx); Ry = clean(Ry);
      const R = Math.hypot(Rx, Ry), x0 = Ry !== 0 ? M / Ry : 0, RBy = clean(-(M - v.xA * Ry) / (v.xB - v.xA)), RAy = clean(-Ry - RBy), RAx = clean(-Rx), RA = Math.hypot(RAx, RAy);
      const lift = RAy < 0 || RBy < 0, okA = RA <= v.capA + 1e-9, okB = Math.abs(RBy) <= v.capB + 1e-9;
      return output({ Rx, Ry, R, M, x0, RAx, RAy, RA, RBy }, 'Resultant (N)', R,
        [m('Resultant (X, Y)', `${q(R, 'N', 1)} (${q(Rx, '', 1)}, ${q(Ry, '', 1)})`), m('Moment about the origin', q(M / 1000, 'N·m', 2)), m('Line of action crosses the X axis at', Ry !== 0 ? q(x0, 'mm', 1) : 'Parallel to the X axis'), m('Support A (X, Y)', `${q(RA, 'N', 1)} (${q(RAx, '', 1)}, ${q(RAy, '', 1)})`), m('Support B (Y)', q(RBy, 'N', 1))],
        'Force group support check.', 'Rigid member; supports on the X axis.', {
          text: lift ? 'UPLIFT AT A SUPPORT' : okA && okB ? 'SUPPORTS ADEQUATE' : 'SUPPORT OVERLOADED', tone: !lift && okA && okB ? 'good' : 'bad',
          checks: [check('Uplift', lift ? 'fail' : 'pass', lift ? `${RAy < 0 ? 'A' : 'B'} would lift: hold it down or move the supports.` : 'Both supports stay in compression.'), check('Support A', okA ? 'pass' : 'fail', `${q(RA, 'N', 1)} against ${q(v.capA, 'N', 0)}.`), check('Support B', okB ? 'pass' : 'fail', `${q(Math.abs(RBy), 'N', 1)} against ${q(v.capB, 'N', 0)}.`)],
        });
    },
    "grain-size-acceptance": (v) => {
      if (v.Gmin > v.Gmax) return invalid('The coarsest limit must not exceed the finest limit.');
      const vals = [v.v1, v.v2, v.v3, v.v4, v.v5].filter((x) => x > 0);
      if (!vals.length) return invalid('Enter at least one field reading.');
      const Gof = (x) => (v.mode === 'n100' ? 1 + Math.log2(x) : v.mode === 'na' ? 3.321928 * Math.log10(x) - 2.954 : -6.643856 * Math.log10(x / 1000) - 3.288);
      const avg = vals.reduce((s, x) => s + x, 0) / vals.length, G = Gof(avg), Gs = vals.map(Gof), Gfine = Math.max(...Gs), Gcoarse = Math.min(...Gs), spr = Gfine - Gcoarse;
      const NA = Math.pow(2, G - 1) * 15.5, n100 = Math.pow(2, G - 1), lbar = Math.pow(10, -(G + 3.288) / 6.643856) * 1000, ok = G >= v.Gmin - 1e-9 && G <= v.Gmax + 1e-9, okS = spr <= v.spread + 1e-9;
      return output({ avg, G, NA, n100, lbar, Gfine, Gcoarse, spread: spr, fields: vals.length }, 'ASTM grain size number G', G,
        [m('Fields / average reading', `${vals.length} / ${q(avg, '', 2)}`), m('Grain size number G', q(G, '', 2)), m('Grains per in² at 100× / per mm²', `${q(n100, '', 1)} / ${q(NA, '', 0)}`), m('Mean intercept length', q(lbar, 'µm', 1)), m('Field G: coarsest / finest', `${q(Gcoarse, '', 2)} / ${q(Gfine, '', 2)}`)],
        'Grain size acceptance.', 'Equiaxed grains; averaged fields.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Average grain size', ok ? 'pass' : 'fail', `G ${q(G, '', 2)} against ${q(v.Gmin, '', 1)}–${q(v.Gmax, '', 1)}${ok ? '.' : G < v.Gmin ? ': too coarse.' : ': too fine.'}`), check('Spread between fields', okS ? 'pass' : 'warn', okS ? `${q(spr, '', 2)} G between fields.` : `${q(spr, '', 2)} G between fields: check for a duplex (mixed) structure.`)],
        });
    },
    "polar-hole-position-check": (v) => {
      if (v.dLMC < v.dMMC) return invalid('The largest hole size must not be below the smallest.');
      const rows = []; let worst = 0, okAll = true, okSize = true, okPos = true;
      for (let i = 1; i <= v.n; i++) {
        const nx = v['r' + i] * Math.cos(rad(v['ang' + i])), ny = v['r' + i] * Math.sin(rad(v['ang' + i])), dev = Math.hypot(v['mx' + i] - nx, v['my' + i] - ny), err = 2 * dev, md = v['md' + i];
        const sizeOk = md >= v.dMMC - 1e-9 && md <= v.dLMC + 1e-9, allowed = v.tp + Math.max(0, md - v.dMMC), posOk = err <= allowed + 1e-9, use = allowed > 0 ? err / allowed : err > 0 ? 1e9 : 0;
        worst = Math.max(worst, use); okSize = okSize && sizeOk; okPos = okPos && posOk; okAll = okAll && sizeOk && posOk;
        rows.push([String(i), q(nx, '', 3), q(ny, '', 3), q(err, '', 4), q(allowed, '', 4), sizeOk && posOk ? 'Pass' : !sizeOk ? 'Size' : 'Position']);
      }
      return output({ worst, holes: v.n }, 'Worst share of position tolerance used', worst,
        [m('Holes checked', String(v.n)), m('Worst use of position tolerance', worst < 1e9 ? q(100 * worst, '%', 0) : 'No tolerance'), m('Size limits', `${q(v.dMMC, '', 3)} to ${q(v.dLMC, 'mm', 3)}`)],
        'Polar hole position check.', 'Two-dimensional position; bonus from size.', {
          text: okAll ? 'ACCEPT' : 'REJECT', tone: okAll ? 'good' : 'bad',
          table: tbl('Holes', ['Hole', 'Nominal X', 'Nominal Y', 'Position error', 'Allowed', 'Result'], rows),
          checks: [check('Position', okPos ? 'pass' : 'fail', okPos ? 'All holes within their position tolerance.' : 'At least one hole is out of position.'), check('Hole size', okSize ? 'pass' : 'fail', okSize ? 'All holes within their size limits.' : 'At least one hole is outside its size limits.'), check('Datums', 'verify', 'Measure from the datum centre and orientation the drawing calls for.')],
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
