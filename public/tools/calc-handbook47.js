// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook47). SI units are explicit at each boundary.
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
    "melt-furnace-batch-plan": (v) => {
      if (v.Tm < v.T0 || v.Tp < v.Tm) return invalid('Temperatures must rise from start to melting point to pouring temperature.');
      const Q = v.mass * (v.cs * (v.Tm - v.T0) + v.L + v.cl * (v.Tp - v.Tm)), kWh = Q / 3600, drawn = kWh / (v.eff / 100), hours = drawn / v.P, cycle = hours + v.tap / 60, melts = Math.floor(v.shift / cycle + 1e-9), perShift = melts * v.mass;
      const kWht = drawn / v.mass * 1000, kgCost = drawn * v.price / v.mass, ok = perShift >= v.demand;
      return output({ Q, kWh, drawn, hours, cycle, melts, perShift, kWht, kgCost }, 'Metal per shift (kg)', perShift,
        [m('Energy into the metal', q(kWh, 'kWh', 1)), m('Energy drawn per melt', q(drawn, 'kWh', 1)), m('Melt time', q(hours * 60, 'min', 0)), m('Cycle per melt', q(cycle * 60, 'min', 0)), m('Melts per shift', q(melts, '', 0)), m('Metal per shift', q(perShift, 'kg', 0)), m('Energy per tonne', q(kWht, 'kWh/t', 0)), m('Energy cost per kilogram', money(kgCost))],
        'Melting furnace batch plan.', 'Average properties; no holding losses.', {
          text: ok ? 'DEMAND MET' : 'DEMAND NOT MET', tone: ok ? 'good' : 'bad',
          checks: [check('Output', ok ? 'pass' : 'fail', `${q(perShift, 'kg', 0)} per shift against ${q(v.demand, 'kg', 0)} needed.`), check('Material data', 'verify', 'Use specific and latent heats for the actual alloy.')],
        });
    },
    "vickers-test-check": (v) => {
      if (v.hvMax <= v.hvMin) return invalid('The specification maximum must exceed the minimum.');
      const d = (v.d1 + v.d2) / 2, HV = 1.8544 * v.F / (d * d), depth = d / 7, tmin = 1.5 * d, diff = Math.abs(v.d1 - v.d2) / d * 100;
      const okT = v.thick >= tmin, okE = v.edge >= v.kEdge * d, okS = v.space >= v.kSpace * d, okD = diff <= v.diffMax, valid = okT && okE && okS && okD, inSpec = HV >= v.hvMin && HV <= v.hvMax;
      return output({ d, HV, depth, tmin, diff, valid: valid ? 1 : 0 }, 'Vickers hardness (HV)', HV,
        [m('Mean diagonal', q(d, 'mm', 4)), m('Hardness', `${q(HV, '', 0)} HV${q(v.F, '', 3)}`), m('Indentation depth', q(depth * 1000, 'µm', 1)), m('Least specimen thickness', q(tmin, 'mm', 3)), m('Difference between diagonals', q(diff, '%', 2))],
        'Vickers test check.', 'Standard indenter geometry.', {
          text: !valid ? 'TEST NOT VALID' : inSpec ? 'WITHIN SPECIFICATION' : 'OUT OF SPECIFICATION', tone: valid && inSpec ? 'good' : 'bad',
          checks: [check('Thickness', okT ? 'pass' : 'fail', `${q(v.thick, 'mm', 3)} against ${q(tmin, 'mm', 3)} needed.`), check('Edge distance', okE ? 'pass' : 'fail', `${q(v.edge, 'mm', 2)} against ${q(v.kEdge * d, 'mm', 2)}.`), check('Spacing', okS ? 'pass' : 'fail', `${q(v.space, 'mm', 2)} against ${q(v.kSpace * d, 'mm', 2)}.`), check('Diagonals', okD ? 'pass' : 'fail', `${q(diff, '%', 2)} difference against ${q(v.diffMax, '%', 1)}.`), check('Specification', inSpec ? 'pass' : 'fail', `${q(HV, 'HV', 0)} against ${q(v.hvMin, '', 0)}–${q(v.hvMax, 'HV', 0)}.`)],
        });
    },
    "gear-mesh-interference-check": (v) => {
      const P = 1 / v.m, ph = rad(v.phi), n = v.z1, Nn = v.z2, d0 = v.do1 || v.m * (n + 2), D0 = v.do2 || v.m * (Nn + 2), cA = Nn * Math.cos(ph) / (D0 * P), ca = n * Math.cos(ph) / (d0 * P);
      if (cA >= 1 || ca >= 1) return invalid('An outside diameter is at or below its base circle.');
      const A = Math.acos(cA), a = Math.acos(ca), tb = Math.tan(ph) - Nn / n * (Math.tan(A) - Math.tan(ph)), tB = Math.tan(ph) - n / Nn * (Math.tan(a) - Math.tan(ph));
      if (tb < 0 || tB < 0) return invalid('Contact would begin below a base circle: the gears interfere at these outside diameters.');
      const dc1 = n * Math.cos(ph) / (P * Math.cos(Math.atan(tb))), dc2 = Nn * Math.cos(ph) / (P * Math.cos(Math.atan(tB))), db1 = v.m * n * Math.cos(ph), db2 = v.m * Nn * Math.cos(ph);
      const ra1 = d0 / 2, ra2 = D0 / 2, rb1 = db1 / 2, rb2 = db2 / 2, ac = v.m * (n + Nn) / 2, eps = (Math.sqrt(ra1 ** 2 - rb1 ** 2) + Math.sqrt(ra2 ** 2 - rb2 ** 2) - ac * Math.sin(ph)) / (PI * v.m * Math.cos(ph));
      const ok1 = dc1 >= v.tif1, ok2 = dc2 >= v.tif2, okE = eps >= v.epsMin, ok = ok1 && ok2 && okE;
      return output({ dc1, dc2, db1, db2, m1: dc1 - v.tif1, m2: dc2 - v.tif2, eps }, 'Contact ratio', eps,
        [m('Pinion: contact start / form / base', `${q(dc1, '', 3)} / ${q(v.tif1, '', 3)} / ${q(db1, 'mm', 3)}`), m('Gear: contact start / form / base', `${q(dc2, '', 3)} / ${q(v.tif2, '', 3)} / ${q(db2, 'mm', 3)}`), m('Margin over the form diameter (pinion / gear)', `${q(dc1 - v.tif1, '', 3)} / ${q(dc2 - v.tif2, 'mm', 3)}`), m('Contact ratio', q(eps, '', 3))],
        'Gear mesh interference check.', 'Standard centre distance; unshifted teeth.', {
          text: ok ? 'NO INTERFERENCE' : 'MESH PROBLEM', tone: ok ? 'good' : 'bad',
          checks: [check('Pinion', ok1 ? 'pass' : 'fail', ok1 ? 'Contact starts above the pinion form diameter.' : 'Contact starts below the pinion form diameter: tip-to-root interference.'), check('Gear', ok2 ? 'pass' : 'fail', ok2 ? 'Contact starts above the gear form diameter.' : 'Contact starts below the gear form diameter.'), check('Contact ratio', okE ? 'pass' : 'fail', `${q(eps, '', 3)} against ${q(v.epsMin, '', 2)}.`)],
        });
    },
    "finish-turning-setup": (v) => {
      const fDes = Math.sqrt(v.RaT / 1000 * v.R / 0.031553), f = v.fCh || fDes, Ra = 0.031553 * f * f / v.R * 1000, Rt = f * f / (8 * v.R) * 1000, n0 = 1000 * v.vc / (PI * v.D), n = Math.min(n0, v.nmax), t = (v.L + v.appr) / (f * n);
      const th = rad(v.ang), dz = v.R * (1 - Math.tan(th / 2)), dx = v.R * (1 - Math.tan((PI / 2 - th) / 2)), err = v.R * (Math.sin(th) + Math.cos(th) - 1), okR = Ra <= v.RaT * (1 + 1e-9), okC = err <= v.errMax, ok = okR;
      return output({ fDes, f, Ra, Rt, n, t, dz, dx, err }, 'Ra at the feed used (µm)', Ra,
        [m('Feed for the target Ra', q(fDes, 'mm/rev', 4)), m('Feed used / Ra / Rt', `${q(f, '', 4)} mm/rev, ${q(Ra, '', 2)} / ${q(Rt, 'µm', 2)}`), m('Spindle speed', `${q(n, 'rpm', 0)}${n < n0 ? ' (held to the machine maximum)' : ''}`), m('Finishing time', q(t * 60, 's', 1)), m('Compensation Z / X (radius)', `${q(dz, '', 4)} / ${q(dx, 'mm', 4)}`), m('Profile error if uncompensated', q(err, 'mm', 4))],
        'Finish turning set-up.', 'Theoretical finish; straight chamfer.', {
          text: ok ? 'FINISH ACHIEVABLE' : 'FEED TOO COARSE', tone: ok ? 'good' : 'bad',
          checks: [check('Surface finish', okR ? 'pass' : 'fail', `Ra ${q(Ra, 'µm', 2)} against ${q(v.RaT, 'µm', 2)}.`), check('Nose-radius compensation', okC ? 'pass' : 'warn', okC ? `Uncompensated error ${q(err, 'mm', 3)} is within ${q(v.errMax, 'mm', 3)}.` : `Uncompensated error ${q(err, 'mm', 3)}: switch on tool nose radius compensation (G41/G42).`)],
        });
    },
    "coolant-tank-maintenance": (v) => {
      const conc = v.brix * v.factor, low = conc < v.target, add = low ? v.volume * (v.target - conc) / (100 - v.target) : v.volume * (conc - v.target) / v.target, loss = v.evap + v.drag;
      const cm = loss > 0 ? v.target * v.drag / loss : 0, daily = loss, concDay = daily * cm / 100, month = concDay * v.days, cost = month * v.price, dev = Math.abs(conc - v.target) / v.target * 100, ok = dev <= v.tol;
      return output({ conc, add, what: low ? 'concentrate' : 'water', cm, daily, concDay, month, cost, dev }, 'Concentration (%)', conc,
        [m('Actual concentration', q(conc, '%', 2)), m('Deviation from target', q(dev, '%', 1)), m(low ? 'Concentrate to add' : 'Water to add', q(add, 'L', 1)), m('Make-up mix strength', q(cm, '%', 2)), m('Make-up volume per day', q(daily, 'L', 1)), m('Concentrate per month', q(month, 'L', 1)), m('Concentrate cost per month', money(cost))],
        low ? 'The coolant is weaker than the target.' : 'The coolant is at or stronger than the target.', 'Uniform losses; clean refractometer reading.', {
          text: ok ? 'CONCENTRATION OK' : 'ADJUST CONCENTRATION', tone: ok ? 'good' : 'bad',
          checks: [check('Concentration', ok ? 'pass' : 'fail', `${q(conc, '%', 2)} is ${q(dev, '%', 1)} from the ${q(v.target, '%', 1)} target.`), check('Tramp oil', 'verify', 'Skim tramp oil before reading; it raises the refractometer reading.')],
        });
    },
    "compound-angle-sine-setup": (v) => {
      const ta = Math.tan(rad(v.A)), tb = Math.tan(rad(v.B)), compound = deg(Math.atan(Math.sqrt(ta * ta + tb * tb))), direction = ta === 0 && tb === 0 ? 0 : deg(Math.atan2(tb, ta)), Bp = deg(Math.atan(tb * Math.cos(rad(v.A))));
      const H1 = v.L1 * Math.sin(rad(v.A)), H2 = v.L2 * Math.sin(rad(Bp)), r = (x) => Math.round(x / v.res) * v.res, ok = v.A <= v.maxAng && Bp <= v.maxAng;
      return output({ compound, direction, Bp, H1, H2, s1: r(H1), s2: r(H2) }, 'True compound angle (°)', compound,
        [m('True compound angle', q(compound, '°', 4)), m('Direction from the first plane', q(direction, '°', 3)), m('Lower plate angle / stack', `${q(v.A, '°', 3)} / ${q(r(H1), 'mm', 4)}`), m('Upper plate angle B′ / stack', `${q(Bp, '°', 4)} / ${q(r(H2), 'mm', 4)}`), m('Exact heights', `${q(H1, '', 5)} / ${q(H2, 'mm', 5)}`)],
        'Compound sine plate set-up.', 'Slopes in perpendicular vertical planes.', {
          text: ok ? 'SET-UP POSSIBLE' : 'ANGLE BEYOND PLATE LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Lower plate', v.A <= v.maxAng ? 'pass' : 'fail', `${q(v.A, '°', 2)} against ${q(v.maxAng, '°', 0)}.`), check('Upper plate', Bp <= v.maxAng ? 'pass' : 'fail', `${q(Bp, '°', 2)} against ${q(v.maxAng, '°', 0)}.`), check('Plate order', 'verify', 'Set the lower plate first, then the upper plate in its own tilted frame.')],
        });
    },
    "dovetail-inspection": (v) => {
      if (v.tolU < v.tolL) return invalid('The upper deviation must not be below the lower deviation.');
      const k = 1 + 1 / Math.tan(rad(v.angle / 2)), male = v.type === 'male', rd = (w) => (male ? w + v.rod * k : w - v.rod * k), M = rd(v.width), Mhi = rd(v.width + v.tolU), Mlo = rd(v.width + v.tolL);
      if (M <= 0 || Mlo <= 0) return invalid('The rod is too large for this width.');
      const wMeas = male ? v.Mmeas - v.rod * k : v.Mmeas + v.rod * k, contact = (v.rod / 2) / Math.tan(rad(v.angle / 2)) * Math.sin(rad(v.angle)), okC = contact < v.depth, okW = wMeas >= v.width + v.tolL - 1e-9 && wMeas <= v.width + v.tolU + 1e-9, ok = okC && okW;
      return output({ k, M, Mhi, Mlo, wMeas, dev: wMeas - v.width, contact }, 'Width from the reading (mm)', wMeas,
        [m('Rod factor', q(k, '', 5)), m('Reading at nominal width', q(M, 'mm', 4)), m('Reading limits', `${q(Math.min(Mlo, Mhi), '', 4)} – ${q(Math.max(Mlo, Mhi), 'mm', 4)}`), m('Width from the measured reading', q(wMeas, 'mm', 4)), m('Deviation from nominal', q(wMeas - v.width, 'mm', 4)), m('Rod contact height', q(contact, 'mm', 2))],
        'Dovetail inspection.', 'Sharp base corners; exact rods.', {
          text: !okC ? 'ROD SIZE UNSUITABLE' : okW ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Width', okW ? 'pass' : 'fail', `${q(wMeas - v.width, 'mm', 4)} against ${q(v.tolL, '', 3)} / +${q(v.tolU, 'mm', 3)}.`), check('Rod contact', okC ? 'pass' : 'fail', okC ? 'Rods touch the flanks within the depth.' : 'Rods would touch above the dovetail: use smaller rods.')],
        });
    },
    "gear-tooth-caliper-setting": (v) => {
      if (v.jnMax < v.jnMin) return invalid('The largest backlash must not be below the smallest.');
      const D = v.m * v.z, s0 = PI * v.m / 2, sh = v.share / 100, ca = Math.cos(rad(v.alpha)), sHi = s0 - sh * v.jnMin / ca, sLo = s0 - sh * v.jnMax / ca, tc = (s) => D * Math.sin(s / D), ac = (s) => v.m + D / 2 * (1 - Math.cos(s / D));
      const tipNom = D + 2 * v.m, tipCorr = v.tipMeas ? (v.tipMeas - tipNom) / 2 : 0, tcHi = tc(sHi), tcLo = tc(sLo), acSet = ac((sHi + sLo) / 2) + tipCorr, ok = v.tcMeas >= tcLo - 1e-9 && v.tcMeas <= tcHi + 1e-9;
      return output({ D, sHi, sLo, tcHi, tcLo, acHi: ac(sHi), acSet, tipCorr }, 'Chordal thickness upper limit (mm)', tcHi,
        [m('Pitch diameter', q(D, 'mm', 3)), m('Arc thickness limits', `${q(sLo, '', 4)} – ${q(sHi, 'mm', 4)}`), m('Chordal thickness limits', `${q(tcLo, '', 4)} – ${q(tcHi, 'mm', 4)}`), m('Chordal addendum (depth setting)', q(acSet, 'mm', 4)), m('Tip correction included', q(tipCorr, 'mm', 4))],
        'Gear tooth caliper setting.', 'Spur gear; vernier at the pitch line.', {
          text: ok ? 'ACCEPT' : 'REJECT', tone: ok ? 'good' : 'bad',
          checks: [check('Chordal thickness', ok ? 'pass' : 'fail', `${q(v.tcMeas, 'mm', 4)} against ${q(tcLo, '', 4)}–${q(tcHi, 'mm', 4)}${ok ? '.' : v.tcMeas > tcHi ? ': too thick (too little backlash).' : ': too thin (too much backlash).'}`), check('Tip diameter', 'verify', 'Measure the tip diameter at the same teeth used for the reading.')],
        });
    },
    "perforated-plate-design": (v) => {
      if (v.d >= v.p) return invalid('The hole must be smaller than the pitch.');
      const stag = v.pattern === 'stag60', K = stag ? 90.69 : 78.54, dReq = v.p * Math.sqrt(v.OAt / K), OA = K * (v.d / v.p) ** 2, perM2 = (stag ? 1.1547 : 1) / (v.p / 1000) ** 2, mass = v.A * v.t / 1000 * v.rho * (1 - OA / 100);
      const Fhit = v.nHit * PI * v.d * v.t * v.tau * v.factor, lig = v.p - v.d, okP = Fhit / 1000 <= v.press, okL = lig >= v.kLig * v.t, okH = v.d >= v.kHole * v.t, okO = OA >= v.OAt * 0.98, ok = okP && okL && okH;
      return output({ dReq, OA, perM2, mass, Fhit, lig }, 'Open area with the hole chosen (%)', OA,
        [m('Hole for the target open area', q(dReq, 'mm', 3)), m('Open area with the hole chosen', q(OA, '%', 2)), m('Holes per square metre', q(perM2, '', 0)), m('Sheet mass', q(mass, 'kg', 2)), m('Ligament', q(lig, 'mm', 2)), m('Force per hit', q(Fhit / 1000, 'kN', 1))],
        'Perforated plate design.', 'Full field of holes; flat punches.', {
          text: ok ? 'DESIGN FEASIBLE' : 'DESIGN NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Press', okP ? 'pass' : 'fail', `${q(Fhit / 1000, 'kN', 1)} against ${q(v.press, 'kN', 0)}.`), check('Ligament', okL ? 'pass' : 'fail', `${q(lig, 'mm', 2)} against ${q(v.kLig * v.t, 'mm', 2)}.`), check('Hole size', okH ? 'pass' : 'fail', `${q(v.d, 'mm', 2)} against ${q(v.kHole * v.t, 'mm', 2)}.`), check('Open area', okO ? 'pass' : 'warn', `${q(OA, '%', 1)} against ${q(v.OAt, '%', 0)} wanted.`)],
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
