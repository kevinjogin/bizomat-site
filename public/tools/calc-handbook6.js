// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook6). SI units are explicit at each boundary.
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
    "bolt-torque-preload": (v) => {
      const As = PI / 4 * (v.d - 0.938194 * v.P) ** 2, proof = v.Sp * As;
      const F = v.mode === 'torque' ? proof * v.pct / 100 : v.T * 1000 / (v.K * v.d), T = v.mode === 'torque' ? v.K * F * v.d / 1000 : v.T, share = 100 * F / proof;
      const ok = share <= 100;
      return output({ As, proof, F, T, stress: F / As, share }, v.mode === 'torque' ? 'Tightening torque (N·m)' : 'Preload (kN)', v.mode === 'torque' ? T : F / 1000,
        [m('Tensile stress area', q(As, 'mm²', 2)), m('Proof load', q(proof / 1000, 'kN', 2)), m('Preload', q(F / 1000, 'kN', 2)), m('Bolt stress', q(F / As, 'MPa', 0)), m('Share of proof load', q(share, '%', 1)), m('Tightening torque', q(T, 'N·m', 1))],
        `Torque–preload relation with K = ${v.K}.`, 'Nut factor relation; actual preload scatter is large.', {
          text: ok ? 'WITHIN PROOF LOAD' : 'EXCEEDS PROOF LOAD', tone: ok ? 'good' : 'bad',
          checks: [check('Preload within proof load', ok ? 'pass' : 'fail', `${q(share, '%', 1)} of proof load.`), check('Nut factor', 'verify', 'Confirm K for the actual plating and lubricant, or measure it.')],
        });
    },
    "thread-engagement": (v) => {
      const n = 1 / v.P, d2 = v.d - 0.649519 * v.P, D1 = v.d - 1.082532 * v.P;
      const Kn = v.Knmax || D1, Es = v.Esmin || d2, Ds = v.Dsmin || v.d, En = v.Enmax || d2;
      const At = v.Sub > 1240 ? PI * (Es / 2 - 0.16238 * v.P) ** 2 : PI / 4 * (v.d - 0.938194 * v.P) ** 2;
      const extShear = PI * Kn * (0.5 + 0.57735 * n * (Es - Kn)), intShear = PI * Ds * (0.5 + 0.57735 * n * (Ds - En));
      if (extShear <= 0 || intShear <= 0) return invalid('The entered thread limits give no thread overlap; check the diameters.');
      const Le = 2 * At / extShear, J = (extShear * v.Sub) / (intShear * v.Sun), Lreq = J > 1 ? J * Le : Le;
      return output({ At, Le, J, Lreq }, 'Required engagement (mm)', Lreq,
        [m('Tensile stress area', q(At, 'mm²', 2)), m('Engagement for external thread', q(Le, 'mm', 2)), m('Strength ratio J', q(J, '', 3)), m('Required engagement', q(Lreq, 'mm', 2)), m('Required engagement / diameter', q(Lreq / v.d, '× d', 2))],
        J > 1 ? 'The tapped material is weaker: the internal thread governs.' : 'The external thread governs; the internal thread is strong enough.', 'Full-form threads; use the thread-class limits for design checks.', {
          checks: [check('Thread limits used', v.Knmax && v.Esmin && v.Dsmin && v.Enmax ? 'pass' : 'verify', v.Knmax && v.Esmin && v.Dsmin && v.Enmax ? 'Class limits entered.' : 'Some basic diameters were used; enter the thread-class limits for a design check.')],
        });
    },
    "bolted-joint": (v) => {
      if (v.Lt > v.grip) return invalid('The threaded length cannot exceed the grip length.');
      const Ad = PI * v.d * v.d / 4, At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, Eb = v.Eb * 1000, Ls = v.grip - v.Lt;
      const kb = 1 / (Ls / (Eb * Ad) + v.Lt / (Eb * At));
      const km = v.kmMode === 'frustum' ? 0.5774 * PI * v.Em * 1000 * v.d / (2 * Math.log(5 * (0.5774 * v.grip + 0.5 * v.d) / (0.5774 * v.grip + 2.5 * v.d))) : v.km * 1000;
      const C = kb / (kb + km), Fb = v.Fi + C * v.Pext, Fm = v.Fi - (1 - C) * v.Pext, P0 = v.Fi / (1 - C), stress = Fb * 1000 / At, sepOk = Fm > 0, proofOk = stress <= v.Sp;
      return output({ kb, km, C, Fb, Fm, P0, stress }, 'Remaining clamp force (kN)', Fm,
        [m('Bolt stiffness', q(kb / 1000, 'kN/mm', 0)), m('Member stiffness', q(km / 1000, 'kN/mm', 0)), m('Joint constant C', q(C, '', 4)), m('Bolt load', q(Fb, 'kN', 2)), m('Bolt stress', q(stress, 'MPa', 0)), m('Remaining clamp force', q(Fm, 'kN', 2)), m('Separation load', q(P0, 'kN', 2))],
        `The bolt sees ${q(100 * C, '%', 1)} of the external load.`, 'Concentric tension joint; prying and bending excluded.', {
          text: sepOk && proofOk ? 'JOINT HOLDS' : !sepOk ? 'JOINT SEPARATES' : 'BOLT OVER PROOF', tone: sepOk && proofOk ? 'good' : 'bad',
          checks: [check('No separation', sepOk ? 'pass' : 'fail', `Clamp force ${q(Fm, 'kN', 2)}; load factor against separation ${q(P0 / Math.max(v.Pext, 1e-9), '', 2)}.`), check('Bolt stress within proof', proofOk ? 'pass' : 'fail', `${q(stress, 'MPa', 0)} against ${q(v.Sp, 'MPa', 0)}.`), check('Member stiffness', v.kmMode === 'frustum' ? 'verify' : 'pass', v.kmMode === 'frustum' ? 'Estimate only; confirm for gaskets, castings or mixed materials.' : 'Entered by the user.')],
        });
    },
    "bolt-shear-bearing": (v) => {
      const tau = v.F / (v.n * Number(v.planes) * PI * v.d * v.d / 4), sb = v.F / (v.n * v.d * v.t), us = tau / v.tauAllow, ub = sb / v.bAllow, ok = us <= 1 && ub <= 1;
      return output({ tau, sb, us, ub }, 'Highest utilisation', Math.max(us, ub),
        [m('Shear stress', q(tau, 'MPa', 1)), m('Shear utilisation', q(100 * us, '%', 1)), m('Bearing stress', q(sb, 'MPa', 1)), m('Bearing utilisation', q(100 * ub, '%', 1)), m('Governing mode', us >= ub ? 'Fastener shear' : 'Plate bearing')],
        `${v.n} fasteners in ${v.planes === '2' ? 'double' : 'single'} shear.`, 'Equal load sharing; edge distance and net section not checked.', {
          text: ok ? 'ADEQUATE' : 'INADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Shear', us <= 1 ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauAllow, 'MPa')}.`), check('Bearing', ub <= 1 ? 'pass' : 'fail', `${q(sb, 'MPa', 1)} against ${q(v.bAllow, 'MPa')}.`), check('Edge distance and net section', 'verify', 'Check plate edge distance, net section and block shear.')],
        });
    },
    "riveted-joint": (v) => {
      if (v.d >= v.p) return invalid('The pitch must be larger than the hole diameter.');
      const tear = (v.p - v.d) * v.t * v.st, shear = v.rows * Number(v.shear) * PI * v.d * v.d / 4 * v.tau, crush = v.rows * v.d * v.t * v.sc, solid = v.p * v.t * v.st;
      const weakest = Math.min(tear, shear, crush), mode = weakest === tear ? 'plate tearing' : weakest === shear ? 'rivet shearing' : 'crushing', eff = 100 * weakest / solid;
      return output({ tear, shear, crush, solid, eff, mode }, 'Joint efficiency (%)', eff,
        [m('Tearing strength / pitch', q(tear / 1000, 'kN', 2)), m('Shearing strength / pitch', q(shear / 1000, 'kN', 2)), m('Crushing strength / pitch', q(crush / 1000, 'kN', 2)), m('Solid plate / pitch', q(solid / 1000, 'kN', 2)), m('Joint efficiency', q(eff, '%', 1)), m('Weakest mode', mode)],
        `The joint is limited by ${mode}.`, 'Classical method; edge distance and fatigue not checked.', {
          table: tbl('Strength per pitch', ['Mode', 'Strength (kN)', 'Share of solid plate'], [['Plate tearing', q(tear / 1000, '', 2), q(100 * tear / solid, '%', 1)], ['Rivet shearing', q(shear / 1000, '', 2), q(100 * shear / solid, '%', 1)], ['Crushing', q(crush / 1000, '', 2), q(100 * crush / solid, '%', 1)]]),
          checks: [check('Edge distance', 'verify', 'Keep edge distance at least the value your code requires (commonly about 1.5d).')],
        });
    },
    "tap-drill": (v) => {
      const metric = v.system === 'metric', P = metric ? v.pitch : 1 / v.tpi, k = v.tap === 'cut' ? 0.01299 : 0.0068, drill = v.D - k * v.pct * P, minor = v.D - 1.082532 * P;
      if (drill <= 0) return invalid('The pitch is too coarse for this diameter.');
      const unit = metric ? 'mm' : 'in', other = metric ? q(drill / 25.4, 'in', 4) : q(drill * 25.4, 'mm', 3);
      return output({ drill, minor }, `Drill size (${unit})`, drill,
        [m('Theoretical drill or hole size', q(drill, unit, metric ? 3 : 4)), m('In the other unit', other), m('Basic minor diameter', q(minor, unit, metric ? 3 : 4)), m('Tap type', v.tap === 'cut' ? 'Cutting' : 'Forming')],
        `${q(v.pct, '%', 0)} thread with a ${v.tap === 'cut' ? 'cutting' : 'forming'} tap.`, 'Theoretical size; drills cut oversize.', {
          checks: [check('Minor diameter tolerance', 'verify', 'Check the hole against the minor diameter limits for the thread class.'), check('Forming tap suitability', v.tap === 'form' ? 'verify' : 'pass', v.tap === 'form' ? 'Forming taps need ductile material; avoid brittle materials.' : 'Cutting tap.')],
        });
    },
    "metric-thread": (v) => {
      const H = 0.866025404 * v.P, d2 = v.d - 0.649519053 * v.P, D1 = v.d - 1.082531755 * v.P, d3 = v.d - 1.226869322 * v.P;
      if (d3 <= 0) return invalid('The pitch is too coarse for this diameter.');
      const As = PI / 4 * ((d2 + d3) / 2) ** 2, lead = v.starts * v.P, angle = deg(Math.atan(lead / (PI * d2)));
      return output({ H, d2, D1, d3, As, lead, angle }, 'Tensile stress area (mm²)', As,
        [m('Pitch diameter d₂', q(d2, 'mm', 4)), m('Minor diameter, internal D₁', q(D1, 'mm', 4)), m('Root diameter, external d₃', q(d3, 'mm', 4)), m('Thread height (external) h₃', q(0.613435 * v.P, 'mm', 4)), m('Tensile stress area', q(As, 'mm²', 2)), m('Lead / lead angle', `${q(lead, 'mm', 3)} / ${q(angle, '°', 3)}`), ...(v.Sp > 0 ? [m('Proof load', q(v.Sp * As / 1000, 'kN', 2))] : [])],
        `Basic dimensions of M${q(v.d, '', 3)} × ${q(v.P, '', 3)}.`, 'Basic profile; class tolerances from ISO 965.', {
          checks: [check('Tolerance class', 'verify', 'Take the limits of size for the thread class (e.g. 6g, 6H) from ISO 965.')],
        });
    },
    "unified-thread": (v) => {
      const p = 1 / v.n, E = v.D - 0.649519 * p, minor = v.D - 1.082532 * p, At = 0.7854 * (v.D - 0.9743 * p) ** 2;
      if (minor <= 0) return invalid('Too few threads per inch for this diameter.');
      return output({ p, E, minor, At }, 'Tensile stress area (in²)', At,
        [m('Pitch', `${q(p, 'in', 5)} (${q(p * 25.4, 'mm', 4)})`), m('Basic pitch diameter', `${q(E, 'in', 4)} (${q(E * 25.4, 'mm', 3)})`), m('Basic minor diameter, internal', `${q(minor, 'in', 4)} (${q(minor * 25.4, 'mm', 3)})`), m('Tensile stress area', `${q(At, 'in²', 4)} (${q(At * 645.16, 'mm²', 2)})`)],
        `Basic dimensions of ${q(v.D, '', 4)}-${q(v.n, '', 1)}.`, 'Basic profile; class limits from ASME B1.1.', {
          checks: [check('Tolerance class', 'verify', 'Take the limits for class 2A/2B or 3A/3B from ASME B1.1.')],
        });
    },
    "three-wire": (v) => {
      const a = rad(Number(v.angle) / 2), best = (v.P / 2) / Math.cos(a), W = v.W || best, k = W * (1 + 1 / Math.sin(a)) - (v.P / 2) / Math.tan(a);
      const M = v.E + k, Efrom = v.Mmeas > 0 ? v.Mmeas - k : null, ratio = W / v.P;
      const lo = { 60: 0.505, 55: 0.505, 29: 0.487, 30: 0.487 }[v.angle], hi = { 60: 1.01, 55: 0.9, 29: 0.65, 30: 0.65 }[v.angle];
      return output({ W, best, M, Efrom }, 'Measurement over wires', M,
        [m('Best wire size', q(best, '', 5)), m('Wire used', q(W, '', 5)), m('Expected measurement over wires', q(M, '', 5)), m('Pitch diameter from reading', Efrom === null ? 'No reading entered' : q(Efrom, '', 5))],
        `Three-wire measurement of a ${v.angle}° thread.`, 'Lead-angle correction not applied.', {
          checks: [check('Wire contacts the flanks', ratio >= lo && ratio <= hi ? 'pass' : 'warn', `Wire = ${q(ratio, '', 3)} × pitch; keep near the best size (${q(best / v.P, '', 3)} × pitch).`), check('Lead angle', 'verify', 'Apply a lead-angle correction for multi-start or coarse threads.')],
        });
    },
    "screw-efficiency": (v) => {
      const L = v.starts * v.P, lam = Math.atan(L / (PI * v.d2)), an = Math.atan(Math.tan(rad(Number(v.flank))) * Math.cos(lam)), tl = Math.tan(lam);
      const eff = 100 * tl * (Math.cos(an) - v.mu * tl) / (Math.cos(an) * tl + v.mu), locks = v.mu >= Math.cos(an) * tl;
      return output({ L, lambda: deg(lam), eff, locks }, 'Efficiency raising (%)', eff,
        [m('Lead', q(L, 'mm', 3)), m('Helix (lead) angle', q(deg(lam), '°', 3)), m('Efficiency raising a load', q(eff, '%', 1)), m('Self-locking', locks ? 'Yes (does not back-drive statically)' : 'No (back-drives under load)')],
        locks ? 'The screw holds the load without a brake in static conditions.' : 'The load can drive the screw back.', 'Thread friction only; collar friction excluded.', {
          checks: [check('Self-locking', locks ? 'pass' : 'warn', locks ? 'μ ≥ cos αₙ tan λ.' : 'Provide a brake if the load must be held.'), check('Vibration', 'verify', 'Vibration can loosen or back-drive a self-locking screw.')],
        });
    },
    "simple-indexing": (v) => {
      const circles = v.plates === 'bs' ? [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49] : [24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66];
      const whole = Math.floor(v.ratio / v.divisions), rem = v.ratio % v.divisions;
      const options = rem === 0 ? [] : circles.filter((h) => (rem * h) % v.divisions === 0).map((h) => [String(h), String(whole), String(rem * h / v.divisions)]);
      const exact = rem === 0 || options.length > 0;
      const best = rem === 0 ? `${whole} whole turns` : options.length ? `${whole} turns and ${options[0][2]} holes in the ${options[0][0]}-hole circle` : 'differential or angular indexing';
      return output({ whole, rem, best, count: options.length }, 'Crank turns per division', v.ratio / v.divisions,
        [m('Crank turns per division', `${q(v.ratio / v.divisions, '', 5)} (${whole} + ${rem}/${v.divisions})`), m('Simplest setting', best), m('Usable hole circles', rem === 0 ? 'Any (whole turns)' : String(options.length))],
        exact ? 'Simple indexing gives this number exactly.' : 'This number cannot be indexed simply with these plates.', 'Standard plate hole counts assumed.', {
          text: exact ? 'SIMPLE INDEXING POSSIBLE' : 'NOT POSSIBLE BY SIMPLE INDEXING', tone: exact ? 'good' : 'bad',
          ...(options.length ? { table: tbl('Hole circle options', ['Hole circle', 'Whole turns', 'Holes to move'], options) } : {}),
          checks: [check('Exact indexing', exact ? 'pass' : 'fail', exact ? 'No cumulative error.' : 'Use differential or angular indexing, or another plate.')],
        });
    },
    "change-gears": (v) => {
      const lead = (unit, val) => (unit === 'mm' ? val : 25.4 / val);
      const req = lead(v.cutUnit, v.cut) / (lead(v.screwUnit, v.screw) * v.fixed);
      const gears = v.set === 'g5' ? [...Array.from({ length: 21 }, (_, i) => 20 + 5 * i), 127] : [...Array.from({ length: 19 }, (_, i) => 24 + 4 * i), 127];
      let b2 = null, b4 = null;
      for (const A of gears) for (const B of gears) { if (A === B) continue; const e = Math.abs(A / B / req - 1); if (!b2 || e < b2.e) b2 = { A, B, e }; }
      for (let i = 0; i < gears.length; i++) for (let j = 0; j < gears.length; j++) { if (j === i) continue; for (let k = 0; k < gears.length; k++) { if (k === i || k === j) continue; for (let l = 0; l < gears.length; l++) { if (l === i || l === j || l === k) continue; const r = gears[i] * gears[k] / (gears[j] * gears[l]), e = Math.abs(r / req - 1); if (!b4 || e < b4.e - 1e-15) b4 = { A: gears[i], B: gears[j], C: gears[k], D: gears[l], e }; } } }
      const clean = (e) => (Math.abs(e) < 1e-9 ? 0 : e), err2 = clean(100 * (b2.A / b2.B / req - 1)), err4 = clean(100 * (b4.A * b4.C / (b4.B * b4.D) / req - 1));
      const best4 = `drivers ${b4.A} and ${b4.C}, driven ${b4.B} and ${b4.D}`, exact = err4 === 0;
      return output({ req, err2, err4, best4 }, 'Required ratio', req,
        [m('Required ratio', q(req, '', 6)), m('Best two-gear train', `${b2.A} driving ${b2.B} (error ${q(err2, '%', 4)})`), m('Best compound train', `${best4} (error ${q(err4, '%', 6)})`)],
        exact ? 'An exact compound train exists in this gear set.' : 'No exact train in this set; the closest is shown.', 'Fit on the banjo and gear clearances are not checked.', {
          text: exact ? 'EXACT TRAIN FOUND' : 'APPROXIMATE TRAIN', tone: exact ? 'good' : 'warn',
          checks: [check('Lead accuracy', exact ? 'pass' : 'warn', exact ? 'No lead error.' : `Lead error ${q(err4, '%', 5)}.`), check('Gear train fits the lathe', 'verify', 'Confirm the gears fit on the banjo with proper mesh.')],
        });
    },
    "helical-gear": (v) => {
      const b = rad(v.beta), mt = v.mn / Math.cos(b), d1 = v.z1 * mt, d2 = v.z2 * mt, at = Math.atan(Math.tan(rad(v.alphan)) / Math.cos(b)), a = (d1 + d2) / 2;
      const zv1 = v.z1 / Math.cos(b) ** 3, eb = v.beta > 0 ? v.b * Math.sin(b) / (PI * v.mn) : 0;
      return output({ mt, d1, d2, a, at: deg(at), zv1, eb }, 'Centre distance (mm)', a,
        [m('Transverse module', q(mt, 'mm', 4)), m('Pitch diameters', `${q(d1, '', 3)} / ${q(d2, 'mm', 3)}`), m('Tip diameters', `${q(d1 + 2 * v.mn, '', 3)} / ${q(d2 + 2 * v.mn, 'mm', 3)}`), m('Base diameters', `${q(d1 * Math.cos(at), '', 3)} / ${q(d2 * Math.cos(at), 'mm', 3)}`), m('Centre distance', q(a, 'mm', 3)), m('Transverse pressure angle', q(deg(at), '°', 3)), m('Virtual teeth (pinion)', q(zv1, '', 2)), m('Overlap ratio', q(eb, '', 3)), m('Ratio', q(v.z2 / v.z1, '', 4))],
        'Standard helical gear pair geometry.', 'Unshifted gears; rating needs ISO 6336 or AGMA.', {
          checks: [check('Overlap ratio', v.beta === 0 ? 'verify' : eb >= 1 ? 'pass' : 'warn', v.beta === 0 ? 'Spur gears: no overlap.' : `εβ = ${q(eb, '', 2)}${eb >= 1 ? '' : '; below 1, consider more face width or helix angle'}.`), check('Gear rating', 'verify', 'Rate strength and pitting with ISO 6336 or AGMA 2001.')],
        });
    },
    "gear-forces": (v) => {
      const T = 9549.2966 * v.kW / v.rpm, Ft = 2 * T * 1000 / v.d, b = rad(v.beta), Fr = Ft * Math.tan(rad(v.alphan)) / Math.cos(b), Fa = Ft * Math.tan(b), F = Math.sqrt(Ft * Ft + Fr * Fr + Fa * Fa);
      return output({ T, Ft, Fr, Fa, F }, 'Tangential force (N)', Ft,
        [m('Torque', q(T, 'N·m', 2)), m('Tangential force', q(Ft, 'N', 1)), m('Radial force', q(Fr, 'N', 1)), m('Axial force', q(Fa, 'N', 1)), m('Total tooth force', q(F, 'N', 1)), m('Pitch-line velocity', q(PI * v.d * v.rpm / 60000, 'm/s', 2))],
        'Static tooth forces at the pitch point.', 'No friction or dynamic factors.', {
          checks: [check('Dynamic and application factors', 'verify', 'Multiply by the factors from your gear rating method.')],
        });
    },
    "lewis-bending": (v) => {
      const V = PI * v.d * v.rpm / 60000, Kv = { cast: (3.05 + V) / 3.05, cut: (6.1 + V) / 6.1, hobbed: (3.56 + Math.sqrt(V)) / 3.56, ground: Math.sqrt((5.56 + Math.sqrt(V)) / 5.56) }[v.make];
      const sigma = Kv * v.Ft / (v.b * v.m * v.Y), ok = sigma <= v.allow;
      return output({ V, Kv, sigma }, 'Bending stress (MPa)', sigma,
        [m('Pitch-line velocity', q(V, 'm/s', 2)), m('Velocity factor Kv', q(Kv, '', 3)), m('Lewis bending stress', q(sigma, 'MPa', 1)), m('Stress / allowable', q(sigma / v.allow, '', 3))],
        'Lewis bending stress with the Barth velocity factor.', 'Screening method only; not a gear rating.', {
          text: ok ? 'WITHIN ALLOWABLE' : 'ABOVE ALLOWABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', ok ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa')}.`), check('Full gear rating', 'verify', 'Rate the gear with ISO 6336 or AGMA 2001 before release.')],
        });
    },
    "worm-gear": (v) => {
      const lead = PI * v.mx * v.z1, g = Math.atan(lead / (PI * v.d1)), ca = Math.cos(rad(v.alphan)), d2 = v.mx * v.z2;
      const eta = 100 * (ca - v.mu * Math.tan(g)) / (ca + v.mu / Math.tan(g)), back = 100 * (ca - v.mu / Math.tan(g)) / (ca + v.mu * Math.tan(g)), locks = back <= 0;
      return output({ ratio: v.z2 / v.z1, lead, gamma: deg(g), d2, a: (v.d1 + d2) / 2, eta, back }, 'Efficiency, worm driving (%)', eta,
        [m('Ratio', `${q(v.z2 / v.z1, '', 3)} : 1`), m('Lead / lead angle', `${q(lead, 'mm', 3)} / ${q(deg(g), '°', 3)}`), m('Wheel pitch diameter', q(d2, 'mm', 2)), m('Centre distance', q((v.d1 + d2) / 2, 'mm', 2)), m('Efficiency, worm driving', q(eta, '%', 1)), m('Efficiency, wheel driving', locks ? 'Self-locking (0%)' : q(back, '%', 1))],
        locks ? 'The wheel cannot drive the worm statically: the drive is self-locking.' : 'The wheel can drive the worm back.', 'Mesh friction only; bearing and churning losses excluded.', {
          checks: [check('Back-driving', locks ? 'pass' : 'warn', locks ? 'Statically self-locking.' : 'Provide a brake if the load must be held.'), check('Thermal rating', 'verify', 'Check the gearbox thermal capacity for continuous duty.')],
        });
    },
    "bevel-gear": (v) => {
      const S = rad(v.shaft), d1a = Math.atan(Math.sin(S) / (v.z2 / v.z1 + Math.cos(S))), d2a = S - d1a, d1 = v.m * v.z1, d2 = v.m * v.z2, Re = d2 / (2 * Math.sin(d2a)), share = v.b / Re;
      return output({ d1a: deg(d1a), d2a: deg(d2a), d1, d2, Re, share }, 'Outer cone distance (mm)', Re,
        [m('Pitch cone angles', `${q(deg(d1a), '°', 3)} / ${q(deg(d2a), '°', 3)}`), m('Pitch diameters', `${q(d1, '', 2)} / ${q(d2, 'mm', 2)}`), m('Outside diameters', `${q(d1 + 2 * v.m * Math.cos(d1a), '', 3)} / ${q(d2 + 2 * v.m * Math.cos(d2a), 'mm', 3)}`), m('Outer cone distance', q(Re, 'mm', 3)), m('Face width / cone distance', q(share, '', 3))],
        'Straight bevel gear pair geometry.', 'Equal-addendum proportions; rating separate.', {
          checks: [check('Face width', share <= 1 / 3 + 1e-9 ? 'pass' : 'warn', `${q(share, '', 3)} of the cone distance; about one third or less is usual.`), check('Bevel gear rating', 'verify', 'Rate with ISO 10300 or AGMA 2003.')],
        });
    },
    "chordal-tooth": (v) => {
      const D = v.m * v.z, a = v.a || v.m, t = v.t || PI * v.m / 2, th = t / D, tc = D * Math.sin(th), ac = a + D / 2 * (1 - Math.cos(th));
      return output({ D, tc, ac }, 'Chordal thickness (mm)', tc,
        [m('Chordal tooth thickness', q(tc, 'mm', 4)), m('Chordal addendum', q(ac, 'mm', 4)), m('Pitch diameter', q(D, 'mm', 3)), m('Arc thickness used', q(t, 'mm', 4))],
        'Caliper settings for one tooth.', 'Tip diameter errors affect the reading.', {
          checks: [check('Tip diameter', 'verify', 'Measure the tip diameter and correct the depth setting for its error.')],
        });
    },
    "span-measurement": (v) => {
      const inv = (a) => Math.tan(a) - a, an = rad(v.alphan), b = rad(v.beta), at = Math.atan(Math.tan(an) / Math.cos(b));
      const k = v.k || Math.max(2, Math.round(v.z / PI * (Math.sqrt((1 + 2 * v.x / v.z) ** 2 - Math.cos(at) ** 2) / Math.cos(at) - inv(at) - 2 * v.x * Math.tan(an) / v.z) + 0.5));
      const W = v.mn * Math.cos(an) * (PI * (k - 0.5) + v.z * inv(at)) + 2 * v.x * v.mn * Math.sin(an), need = W * Math.sin(b) * Math.cos(an);
      return output({ k, W, need }, 'Base tangent length W (mm)', W,
        [m('Teeth spanned k', String(k)), m('Base tangent length W', q(W, 'mm', 4)), ...(v.beta > 0 ? [m('Face width needed', q(need, 'mm', 2))] : []), m('Transverse pressure angle', q(deg(at), '°', 3))],
        `Span measurement over ${k} teeth.`, 'External gears; subtract thinning for backlash.', {
          checks: [check('Anvils fit across the face', v.beta === 0 || v.b > need ? 'pass' : 'fail', v.beta === 0 ? 'Spur gear.' : `Face width ${q(v.b, 'mm')} against ${q(need, 'mm', 2)} needed.`)],
        });
    },
    "gear-over-pins": (v) => {
      const inv = (a) => Math.tan(a) - a, al = rad(v.alpha), d = v.m * v.z, db = d * Math.cos(al), dp = v.dp || 1.728 * v.m;
      const s = v.m * (PI / 2 + 2 * v.x * Math.tan(al)) - v.thin, target = s / d + inv(al) + dp / db - PI / v.z;
      if (target <= 0) return invalid('The pin is too small for this tooth space.');
      let phi = Math.max(0.1, Math.cbrt(3 * target));
      for (let i = 0; i < 60; i++) { const f = inv(phi) - target, df = Math.tan(phi) ** 2; phi -= f / df; if (Math.abs(f) < 1e-15) break; }
      const even = v.z % 2 === 0, M = (even ? db / Math.cos(phi) : db / Math.cos(phi) * Math.cos(PI / (2 * v.z))) + dp;
      return output({ dp, phi: deg(phi), M, s }, 'Measurement over pins (mm)', M,
        [m('Pin diameter', q(dp, 'mm', 4)), m('Arc tooth thickness used', q(s, 'mm', 4)), m('Pressure angle at pin centre', q(deg(phi), '°', 4)), m('Measurement over pins', q(M, 'mm', 4)), m('Teeth', even ? 'Even (pins opposite)' : 'Odd (pins nearly opposite)')],
        'Measurement over two pins in opposite tooth spaces.', 'External spur gear; check pin contact on the involute.', {
          checks: [check('Pin contact', d / 2 * Math.cos(al) / Math.cos(phi) > d / 2 - 0.5 * v.m ? 'pass' : 'warn', 'Pin centre should be near or outside the pitch circle for good contact.')],
        });
    },
    "gear-train": (v) => {
      let ratio = 1, n = 0; const rows = [];
      for (let i = 1; i <= 4; i++) { const a = v['a' + i], b = v['b' + i]; if (!a || !b) continue; ratio *= b / a; n++; rows.push([`Mesh ${i}`, `${a} → ${b}`, q(b / a, '', 4), q(v.nin / ratio, 'rpm', 2)]); }
      if (!n) return invalid('Enter at least one mesh with driver and driven teeth.');
      const effAll = Math.pow(v.eff / 100, n), nout = v.nin / ratio, Tout = v.Tin * ratio * effAll;
      return output({ ratio, nout, Tout, effAll }, 'Overall ratio', ratio,
        [m('Overall ratio', `${q(ratio, '', 4)} : 1`), m('Output speed', q(nout, 'rpm', 2)), m('Output direction', n % 2 ? 'Opposite to input' : 'Same as input'), m('Output torque', q(Tout, 'N·m', 2)), m('Overall efficiency', q(100 * effAll, '%', 1))],
        `${n} meshes in series.`, 'External meshes; efficiency per mesh as entered.', {
          table: tbl('Meshes', ['Mesh', 'Teeth', 'Ratio', 'Shaft speed after mesh'], rows),
          checks: [check('Mesh strength', 'verify', 'Check each mesh with its own torque and speed.')],
        });
    },
    "cam-motion": (v) => {
      const w = 2 * PI * v.rpm / 60, b = rad(v.beta), h = v.h / 1000;
      const c = { shm: [PI / 2, PI * PI / 2], cyc: [2, 2 * PI], parab: [2, 4], poly: [1.875, 5.7735] }[v.law];
      const vel = c[0] * h * w / b, a = c[1] * h * w * w / (b * b), t = b / w;
      return output({ vel, a, F: v.mass * a, t }, 'Peak acceleration (m/s²)', a,
        [m('Rise time', q(t * 1000, 'ms', 2)), m('Peak velocity', q(vel, 'm/s', 3)), m('Peak acceleration', `${q(a, 'm/s²', 1)} (${q(a / 9.80665, 'g', 2)})`), m('Peak inertia force', q(v.mass * a, 'N', 1))],
        'Peak follower motion during the rise.', 'Rigid follower; transitions not analysed.', {
          checks: [check('Acceleration continuity', v.law === 'cyc' || v.law === 'poly' ? 'pass' : 'warn', v.law === 'cyc' || v.law === 'poly' ? 'No acceleration jumps at the ends of the rise.' : 'Acceleration jumps at the ends of the rise; avoid at high speed.'), check('Follower contact', 'verify', 'Spring or groove force must exceed the inertia force on the return stroke.')],
        });
    },
    "belt-drive-tensions": (v) => {
      const vel = PI * v.d * v.rpm / 60000, Fe = v.kW * 1000 / vel, mue = v.groove > 0 ? v.mu / Math.sin(rad(v.groove / 2)) : v.mu, e = Math.exp(mue * rad(v.wrap));
      const Tc = v.mass * vel * vel, T2 = Fe / (e - 1) + Tc, T1 = T2 + Fe, t1 = T1 - Tc, t2 = T2 - Tc, shaft = Math.sqrt(t1 * t1 + t2 * t2 - 2 * t1 * t2 * Math.cos(rad(v.wrap)));
      return output({ vel, Fe, T1, T2, Tc, shaft }, 'Shaft load (N)', shaft,
        [m('Belt speed', q(vel, 'm/s', 2)), m('Effective pull', q(Fe, 'N', 1)), m('Tight side tension', q(T1, 'N', 1)), m('Slack side tension', q(T2, 'N', 1)), m('Centrifugal tension', q(Tc, 'N', 1)), m('Shaft load', q(shaft, 'N', 1))],
        'Belt tensions at the slip limit.', 'Slip limit only; install with the belt maker’s margin.', {
          checks: [check('Belt speed', vel <= 30 ? 'pass' : 'warn', `${q(vel, 'm/s', 1)}; above about 30 m/s check the belt and pulley speed ratings.`), check('Installation tension', 'verify', 'Set static tension to the belt maker’s value.')],
        });
    },
    "chain-length": (v) => {
      const k = (v.z2 - v.z1) / (2 * PI), Lp = 2 * v.C / v.p + (v.z1 + v.z2) / 2 + k * k / (v.C / v.p);
      let Leven = Math.ceil(Lp); if (Leven % 2) Leven++;
      const A = Leven - (v.z1 + v.z2) / 2, Cexact = v.p / 4 * (A + Math.sqrt(A * A - 8 * k * k));
      const d1 = v.p / Math.sin(PI / v.z1), d2 = v.p / Math.sin(PI / v.z2), wrap = 180 - 2 * deg(Math.asin(Math.min(1, (d2 - d1) / (2 * Cexact)))), speed = v.p * v.z1 * v.rpm / 60000;
      return output({ Lp, Leven, Cexact, speed, wrap }, 'Chain length (links)', Leven,
        [m('Exact length', q(Lp, 'pitches', 2)), m('Chain to order', `${Leven} links (${q(Leven * v.p, 'mm', 1)})`), m('Exact centre distance', q(Cexact, 'mm', 2)), m('Chain speed', q(speed, 'm/s', 3)), m('Wrap on small sprocket', q(wrap, '°', 1))],
        `${Leven} links for ${v.z1}/${v.z2} teeth.`, 'New chain; allow adjustment for wear and sag.', {
          checks: [check('Wrap on small sprocket', wrap >= 120 ? 'pass' : 'warn', `${q(wrap, '°', 0)}; at least about 120° is recommended.`), check('Small sprocket teeth', v.z1 >= 17 ? 'pass' : 'warn', v.z1 >= 17 ? 'Enough teeth for smooth running.' : 'Few teeth increase chordal action and wear.')],
        });
    },
    "reflected-inertia": (v) => {
      const eta = v.eff / 100, Jr = v.JL / (v.i * v.i * eta), ratio = Jr / v.Jm, nm = v.nL * v.i, alpha = 2 * PI * nm / (60 * v.t);
      const Ta = (v.Jm + Jr) * alpha, Tl = v.TL / (v.i * eta), Tm = Ta + Tl;
      return output({ Jr, ratio, nm, alpha, Ta, Tl, Tm }, 'Peak motor torque (N·m)', Tm,
        [m('Reflected load inertia', q(Jr, 'kg·m²', 6)), m('Inertia ratio', `${q(ratio, '', 2)} : 1`), m('Motor speed', q(nm, 'rpm', 0)), m('Acceleration torque', q(Ta, 'N·m', 3)), m('Load torque at motor', q(Tl, 'N·m', 3)), m('Peak motor torque', q(Tm, 'N·m', 3))],
        'Torque to accelerate the load from rest in the time given.', 'Constant acceleration; RMS duty checked separately.', {
          checks: [check('Inertia ratio', ratio <= 10 ? 'pass' : 'warn', `${q(ratio, '', 1)}:1; compare with your drive maker’s recommendation.`), check('Motor rating', 'verify', 'Compare peak torque with the motor’s peak rating and the RMS torque with its continuous rating.')],
        });
    },
    "ballscrew-limits": (v) => {
      const d = v.dr / 1000, L = v.L / 1000, E = v.E * 1e9, I = PI * d ** 4 / 64, A = PI * d * d / 4;
      const lam = { ff: 4.730, fs: 3.927, ss: PI, ffree: 1.875 }[v.ends], K = { ff: 0.5, fs: 0.7, ss: 1, ffree: 2 }[v.ends];
      const nc = lam * lam / (2 * PI * L * L) * Math.sqrt(E * I / (v.rho * A)) * 60, Pcr = PI * PI * E * I / (K * L) ** 2;
      const nOk = v.rpm <= nc * v.speedPct / 100, pOk = v.Fa <= Pcr * v.loadPct / 100;
      return output({ nc, Pcr }, 'Critical speed (rpm)', nc,
        [m('Critical speed', q(nc, 'rpm', 0)), m('Allowed speed', q(nc * v.speedPct / 100, 'rpm', 0)), m('Speed utilisation', q(100 * v.rpm / nc, '% of critical', 1)), m('Buckling load', q(Pcr / 1000, 'kN', 2)), m('Allowed load', q(Pcr * v.loadPct / 100000, 'kN', 2)), m('Load utilisation', q(100 * v.Fa / Pcr, '% of buckling', 1))],
        'Critical speed and buckling of the screw.', 'Uniform shaft at root diameter; nut and support stiffness ignored.', {
          text: nOk && pOk ? 'WITHIN LIMITS' : 'OUTSIDE LIMITS', tone: nOk && pOk ? 'good' : 'bad',
          checks: [check('Speed', nOk ? 'pass' : 'fail', `${q(v.rpm, 'rpm', 0)} against ${q(nc * v.speedPct / 100, 'rpm', 0)} allowed.`), check('Buckling', pOk ? 'pass' : 'fail', `${q(v.Fa / 1000, 'kN', 2)} against ${q(Pcr * v.loadPct / 100000, 'kN', 2)} allowed.`), check('Nut life and DN limit', 'verify', 'Check nut life and the maker’s DN (diameter × speed) limit.')],
        });
    },
    "clutch-torque": (v) => {
      if (v.Di >= v.Do) return invalid('The inner diameter must be smaller than the outer diameter.');
      const Ro = v.Do / 2000, Ri = v.Di / 2000, Tw = v.mu * v.F * v.surfaces * (Ro + Ri) / 2, Tp = (2 / 3) * v.mu * v.F * v.surfaces * (Ro ** 3 - Ri ** 3) / (Ro ** 2 - Ri ** 2);
      const pmax = Ri > 0 ? v.F / (2 * PI * Ri * 1000 * (Ro - Ri) * 1000) : null, ok = Tw >= v.Treq;
      return output({ Tw, Tp, pmax }, 'Torque capacity, uniform wear (N·m)', Tw,
        [m('Torque, uniform wear', q(Tw, 'N·m', 1)), m('Torque, uniform pressure', q(Tp, 'N·m', 1)), m('Peak lining pressure', pmax === null ? 'Not defined (solid disc)' : q(pmax, 'MPa', 3)), m('Capacity / required', v.Treq > 0 ? q(Tw / v.Treq, '', 2) : 'No requirement entered')],
        'Torque capacity of the friction surfaces.', 'Flat annular linings; thermal capacity not checked.', {
          text: ok ? 'CAPACITY SUFFICIENT' : 'CAPACITY TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Torque capacity', ok ? 'pass' : 'fail', `${q(Tw, 'N·m', 1)} against ${q(v.Treq, 'N·m', 1)} required.`), check('Lining pressure and heat', 'verify', 'Compare peak pressure and energy per engagement with the lining maker’s limits.')],
        });
    },
    "motor-power": (v) => {
      const eta = v.eff / 100, k = Math.sqrt(3) * v.V * v.pf;
      const I = v.mode === 'current' ? v.kW * 1000 / (k * eta) : v.I, Pin = k * I / 1000, Pout = Pin * eta, T = 9549.2966 * Pout / v.rpm;
      return output({ I, Pin, Pout, T }, v.mode === 'current' ? 'Line current (A)' : 'Output power (kW)', v.mode === 'current' ? I : Pout,
        [m('Line current', q(I, 'A', 2)), m('Electrical input power', q(Pin, 'kW', 3)), m('Shaft output power', q(Pout, 'kW', 3)), m('Shaft torque', q(T, 'N·m', 2)), m('Apparent power', q(Math.sqrt(3) * v.V * I / 1000, 'kVA', 3))],
        'Balanced three-phase motor relations.', 'Power factor and efficiency as entered for this load.', {
          checks: [check('Electrical sizing', 'verify', 'Size cables and protection from the nameplate and your wiring rules.')],
        });
    },
    "key-stress": (v) => {
      const F = 2 * v.T * 1000 / v.d, tau = F / (v.w * v.L), sigma = F / (v.h / 2 * v.L), Ls = F / (v.w * v.tauA), Lc = F / (v.h / 2 * v.sigA), ok = tau <= v.tauA && sigma <= v.sigA;
      return output({ F, tau, sigma, Ls, Lc }, 'Minimum key length (mm)', Math.max(Ls, Lc),
        [m('Force at shaft surface', q(F, 'N', 0)), m('Shear stress', q(tau, 'MPa', 1)), m('Crushing stress', q(sigma, 'MPa', 1)), m('Minimum length for shear', q(Ls, 'mm', 1)), m('Minimum length for crushing', q(Lc, 'mm', 1)), m('Governing mode', Lc >= Ls ? 'Crushing' : 'Shear')],
        `Key ${v.w} × ${v.h} × ${v.L} mm under ${q(v.T, 'N·m')}.`, 'Uniform load along the key.', {
          text: ok ? 'KEY ADEQUATE' : 'KEY INADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Shear', tau <= v.tauA ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauA, 'MPa')}.`), check('Crushing', sigma <= v.sigA ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.sigA, 'MPa')}.`), check('Key length', v.L <= 1.5 * v.d ? 'pass' : 'warn', v.L <= 1.5 * v.d ? 'Length within about 1.5 × diameter.' : 'Long keys load unevenly; consider two keys or a spline.')],
        });
    },
    "bearing-life-adjusted": (v) => {
      const P = Math.max(v.X * v.Fr + v.Y * v.Fa, v.Fr), p = v.type === 'ball' ? 3 : 10 / 3;
      if (P <= 0) return invalid('Enter a radial or axial load.');
      const a1 = { 90: 1, 95: 0.64, 96: 0.55, 97: 0.47, 98: 0.37, 99: 0.25 }[v.rel], L10 = (v.C / P) ** p, L10h = L10 * 1e6 / (60 * v.rpm), Lnm = a1 * v.aiso * L10h, ok = Lnm >= v.req;
      return output({ P, L10, L10h, Lnm, a1 }, 'Adjusted life (h)', Lnm,
        [m('Equivalent dynamic load P', q(P, 'kN', 3)), m('Load ratio C/P', q(v.C / P, '', 2)), m('Basic life L10', q(L10, 'million rev', 1)), m('Basic life L10h', q(L10h, 'h', 0)), m(`Adjusted life L${100 - Number(v.rel)}m`, q(Lnm, 'h', 0))],
        `Rating life at ${v.rel}% reliability.`, 'Catalogue X and Y factors; static, speed and lubrication checked separately.', {
          text: ok ? 'LIFE SUFFICIENT' : 'LIFE TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Life against requirement', ok ? 'pass' : 'fail', `${q(Lnm, 'h', 0)} against ${q(v.req, 'h', 0)} required.`), check('Load factors', 'verify', 'Confirm X and Y from the catalogue for this bearing and Fa/Fr ratio.')],
        });
    },
    "journal-bearing-pv": (v) => {
      const P = v.W / (v.d * v.L), V = PI * v.d * v.rpm / 60000, PV = P * V, ok = P <= v.Pmax && V <= v.Vmax && PV <= v.PVmax;
      return output({ P, V, PV }, 'PV value (MPa·m/s)', PV,
        [m('Projected pressure', q(P, 'MPa', 3)), m('Sliding velocity', q(V, 'm/s', 3)), m('PV value', q(PV, 'MPa·m/s', 3)), m('L/d ratio', q(v.L / v.d, '', 2))],
        'Plain bearing loading against the material limits.', 'Screening limits; not a hydrodynamic design.', {
          text: ok ? 'WITHIN MATERIAL LIMITS' : 'OUTSIDE MATERIAL LIMITS', tone: ok ? 'good' : 'bad',
          checks: [check('Pressure', P <= v.Pmax ? 'pass' : 'fail', `${q(P, 'MPa', 2)} of ${q(v.Pmax, 'MPa')}.`), check('Sliding speed', V <= v.Vmax ? 'pass' : 'fail', `${q(V, 'm/s', 2)} of ${q(v.Vmax, 'm/s')}.`), check('PV', PV <= v.PVmax ? 'pass' : 'fail', `${q(PV, '', 3)} of ${q(v.PVmax, 'MPa·m/s')}.`)],
        });
    },
    "o-ring-gland": (v) => {
      const piston = v.gland === 'piston', od = v.id + 2 * v.cs;
      const stretch = piston ? (v.gd - v.id) / v.id : -(od - v.gd) / od, cs2 = stretch > 0 ? v.cs / Math.sqrt(1 + stretch) : v.cs;
      const squeeze = 100 * (cs2 - v.depth) / cs2, fill = 100 * (PI * cs2 * cs2 / 4) / (v.depth * v.width);
      const [sqLo, sqHi] = v.duty === 'static' ? [15, 30] : [10, 20], sqOk = squeeze >= sqLo && squeeze <= sqHi, fillOk = fill <= 85, stOk = piston ? stretch >= 0 && stretch <= 0.05 : stretch <= 0 && stretch >= -0.03;
      return output({ stretch: 100 * stretch, cs2, squeeze, fill }, 'Squeeze (%)', squeeze,
        [m(piston ? 'Stretch' : 'Circumferential compression', q(100 * Math.abs(stretch), '%', 2)), m('Cross-section after stretch', q(cs2, 'mm', 3)), m('Squeeze', q(squeeze, '%', 1)), m('Gland fill', q(fill, '%', 1))],
        `${piston ? 'Piston' : 'Rod or bore'} groove, ${v.duty} duty.`, 'Nominal dimensions; ranges are typical guidance only.', {
          text: sqOk && fillOk && stOk ? 'WITHIN TYPICAL RANGES' : 'OUTSIDE TYPICAL RANGES', tone: sqOk && fillOk && stOk ? 'good' : 'warn',
          checks: [check('Squeeze', sqOk ? 'pass' : 'warn', `${q(squeeze, '%', 1)}; typical ${sqLo}–${sqHi}% for ${v.duty} seals.`), check('Gland fill', fillOk ? 'pass' : 'warn', `${q(fill, '%', 1)}; keep below about 85% to allow for swell.`), check(piston ? 'Stretch' : 'Compression', stOk ? 'pass' : 'warn', piston ? (stretch < 0 ? 'The ring is loose on the groove bottom.' : `${q(100 * stretch, '%', 2)}; typically 1–5%.`) : stretch > 0 ? 'The ring is smaller than the groove.' : `${q(100 * -stretch, '%', 2)}; typically up to about 3%.`), check('Tolerance extremes', 'verify', 'Repeat with worst-case groove and ring dimensions and fluid swell.')],
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
