// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook54). SI units are explicit at each boundary.
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
    "heating-coil-plan": (v) => {
      if (2 * v.t >= v.OD) return invalid('The tube wall is too thick for the diameter.');
      const per = Math.sqrt((PI * v.Dc) ** 2 + v.p ** 2), L = v.turns * per + v.ends, Aneed = v.Q * 1000 / (v.U * v.dTm), Lneed = Aneed / (PI * v.OD / 1000) * 1000, turnsNeed = Math.max(0, (Lneed - v.ends) / per), Aprov = PI * v.OD / 1000 * L / 1000;
      const d = (v.OD - 2 * v.t) / 1000, A = PI * d * d / 4, vel = v.flow / 60000 / A, Re = vel * d / (v.nu * 1e-6); let f;
      if (Re === 0) f = 0; else if (Re < 2300) f = 64 / Re; else { f = 0.02; for (let i = 0; i < 50; i++) f = (-2 * Math.log10(v.eps / 1000 / (3.7 * d) + 2.51 / (Re * Math.sqrt(f)))) ** -2; }
      const dp = (f * (L / 1000) / d + v.K) * v.rho * vel * vel / 2 / 1e5, okA = Aprov >= Aneed, okP = dp <= v.dpMax, ok = okA && okP;
      return output({ per, L, Aneed, Lneed, turnsNeed, Aprov, vel, Re, f, dp, cap: v.U * Aprov * v.dTm / 1000 }, 'Area provided (m²)', Aprov,
        [m('Area needed', q(Aneed, 'm²', 3)), m('Tube length needed', q(Lneed / 1000, 'm', 2)), m('Turns needed', q(turnsNeed, '', 1)), m('Developed length of the coil', q(L / 1000, 'm', 3)), m('Area provided / duty capacity', `${q(Aprov, 'm²', 3)} / ${q(v.U * Aprov * v.dTm / 1000, 'kW', 1)}`), m('Velocity / Reynolds number', `${q(vel, 'm/s', 2)} / ${q(Re, '', 0)}`), m('Pressure drop', q(dp, 'bar', 3))],
        'Heating coil plan.', 'Straight-tube friction; U as entered.', {
          text: ok ? 'COIL ADEQUATE' : 'COIL NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Area', okA ? 'pass' : 'fail', `${q(Aprov, 'm²', 3)} against ${q(Aneed, 'm²', 3)} needed${okA ? '.' : `: use about ${Math.ceil(turnsNeed)} turns.`}`), check('Pressure drop', okP ? 'pass' : 'fail', `${q(dp, 'bar', 3)} against ${q(v.dpMax, 'bar', 2)}.`), check('Coil fits the tank', 'verify', `Coil height ${q(v.turns * v.p, 'mm', 0)}: check it fits under the minimum liquid level.`)],
        });
    },
    "polygon-milling-setup": (v) => {
      const n = v.sides, t = Math.tan(PI / n), side = v.flats * t, corners = side / Math.sin(PI / n), area = n * side * side / (4 * t);
      if (v.stock <= v.flats) return invalid('The stock must be larger than the across-flats size.');
      const depth = (v.stock - v.flats) / 2, passes = Math.ceil(depth / v.maxDoc - 1e-9), circles = v.plates === 'bs' ? [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49] : [24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66];
      const whole = Math.floor(v.ratio / n), rem = v.ratio % n, opts = rem === 0 ? [] : circles.filter((h) => (rem * h) % n === 0), found = rem === 0 || opts.length > 0, circle = opts[0] || 0, holes = circle ? rem * circle / n : 0;
      const setting = rem === 0 ? `${whole} whole turns` : found ? `${whole} turns and ${holes} holes in the ${circle}-hole circle` : 'differential indexing', okS = v.stock >= corners - 1e-9, ok = okS && found;
      return output({ side, corners, area, depth, passes, whole, rem, holes, circle, count: opts.length, setting }, 'Across corners (mm)', corners,
        [m('Side length', q(side, 'mm', 3)), m('Across corners', q(corners, 'mm', 3)), m('Depth of cut to each flat', q(depth, 'mm', 3)), m('Passes per flat', q(passes, '', 0)), m('Index setting', setting), m('Section area', q(area, 'mm²', 1))],
        'Polygon milling set-up.', 'Sharp corners; simple indexing.', {
          text: ok ? 'SET-UP FOUND' : !okS ? 'STOCK TOO SMALL FOR SHARP CORNERS' : 'NEEDS DIFFERENTIAL INDEXING', tone: ok ? 'good' : 'bad',
          checks: [check('Stock size', okS ? 'pass' : 'fail', `${q(v.stock, 'mm', 2)} against ${q(corners, 'mm', 2)} across corners${okS ? '.' : ': corners will be rounded.'}`), check('Indexing', found ? 'pass' : 'fail', found ? setting.charAt(0).toUpperCase() + setting.slice(1) + '.' : 'No index circle divides this number of sides.'), check('Opposite flats', 'verify', n % 2 ? 'Odd number of sides: measure from a flat to the opposite corner.' : 'Check across flats after milling opposite pairs.')],
        });
    },
    "bolt-circle-inspection": (v) => {
      const Dd = 2 * (v.x1 * (v.y2 - v.y3) + v.x2 * (v.y3 - v.y1) + v.x3 * (v.y1 - v.y2));
      if (Math.abs(Dd) < 1e-12) return invalid('The three points lie on a straight line.');
      const s1 = v.x1 ** 2 + v.y1 ** 2, s2 = v.x2 ** 2 + v.y2 ** 2, s3 = v.x3 ** 2 + v.y3 ** 2, cx = (s1 * (v.y2 - v.y3) + s2 * (v.y3 - v.y1) + s3 * (v.y1 - v.y2)) / Dd, cy = (s1 * (v.x3 - v.x2) + s2 * (v.x1 - v.x3) + s3 * (v.x2 - v.x1)) / Dd, r = Math.hypot(v.x1 - cx, v.y1 - cy);
      const angs = [[v.x1, v.y1], [v.x2, v.y2], [v.x3, v.y3]].map(([x, y]) => Math.atan2(y - cy, x - cx)).sort((a, b) => a - b), gaps = [angs[1] - angs[0], angs[2] - angs[1], 2 * PI - (angs[2] - angs[0])], spread = 360 - deg(Math.max(...gaps));
      const D = 2 * r, dev = D - v.nom, pos = 2 * Math.hypot(cx, cy), okD = Math.abs(dev) <= v.tolD + 1e-12, okP = pos <= v.tolPos + 1e-12, ok = okD && okP;
      return output({ cx, cy, r, D, dev, pos, spread }, 'Fitted bolt circle diameter (mm)', D,
        [m('Fitted centre', `X ${q(cx, '', 4)}, Y ${q(cy, 'mm', 4)}`), m('Fitted diameter', q(D, 'mm', 4)), m('Diameter deviation', `${dev >= 0 ? '+' : ''}${q(dev, 'mm', 4)}`), m('Centre position (diametral)', q(pos, 'mm', 4)), m('Spread of the holes', q(spread, '°', 1))],
        'Bolt circle inspection.', 'Exact three-point fit.', {
          text: ok ? 'CONFORMS' : 'DOES NOT CONFORM', tone: ok ? 'good' : 'bad',
          checks: [check('Diameter', okD ? 'pass' : 'fail', `${dev >= 0 ? '+' : ''}${q(dev, 'mm', 4)} against ±${q(v.tolD, 'mm', 3)}.`), check('Centre position', okP ? 'pass' : 'fail', `${q(pos, 'mm', 4)} against ${q(v.tolPos, 'mm', 3)}.`), check('Point spread', spread >= 120 ? 'pass' : 'warn', `Holes span ${q(spread, '°', 0)}; under about 120° the result is sensitive to errors.`)],
        });
    },
    "oval-tank-capacity": (v) => {
      const a = Math.max(v.major, v.minor) / 2, b = Math.min(v.major, v.minor) / 2, l = ((a - b) / (a + b)) ** 2, area = PI * a * b, per = PI * (a + b) * (1 + 3 * l / (10 + Math.sqrt(4 - 3 * l)));
      const V = area * v.L / 1e6, plateA = (per * v.L + 2 * area) / 1e6, plateM = plateA * v.t / 1000 * v.rhoS, contents = V / 1000 * v.fill / 100 * v.rhoL, total = plateM + contents, okV = V >= v.need, okS = total <= v.support, ok = okV && okS;
      return output({ area, per, V, plateA, plateM, contents, total }, 'Capacity (L)', V,
        [m('Section area / perimeter', `${q(area / 1e6, 'm²', 4)} / ${q(per, 'mm', 1)}`), m('Capacity', q(V, 'L', 0)), m('Plate area', q(plateA, 'm²', 2)), m('Plate mass', q(plateM, 'kg', 1)), m('Contents at fill level', q(contents, 'kg', 0)), m('Full weight', q(total, 'kg', 0))],
        'Oval tank capacity and weight.', 'Flat ends; plate only.', {
          text: ok ? 'TANK ADEQUATE' : 'TANK NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Capacity', okV ? 'pass' : 'fail', `${q(V, 'L', 0)} against ${q(v.need, 'L', 0)} needed.`), check('Supports', okS ? 'pass' : 'fail', `${q(total, 'kg', 0)} full against ${q(v.support, 'kg', 0)}.`), check('Stiffening', 'verify', 'Add baffles and stiffeners: flat-sided oval shells bulge under head and slosh.')],
        });
    },
    "bent-bracket-plan": (v) => {
      const A = [v.A1, v.A2], Ls = [v.L1, v.L2, v.L3]; let nb = 1; if (v.A2 > 0) nb = 2;
      const fl = Ls.slice(0, nb + 1);
      if (fl.some((x) => x <= 0)) return invalid('Enter a length for every flange up to the last bend.');
      const sb = []; let ded = 0;
      for (let i = 0; i < nb; i++) { const th = rad(A[i]), ba = th * (v.R + v.Kf * v.t), s = (v.R + v.t) * Math.tan(th / 2); ded += 2 * s - ba; sb.push(s); }
      const need = fl.map((x, i) => (i > 0 ? sb[i - 1] : 0) + (i < nb ? sb[i] : 0));
      if (fl.some((x, i) => x < need[i])) return invalid('A flange is shorter than the setbacks of its bends.');
      const x = v.R * v.YS / (v.E * 1000 * v.t);
      if (x >= 0.5) return invalid('Radius × yield ÷ (E × thickness) is 0.5 or more: the bend is almost fully elastic.');
      const flat = fl.reduce((s, y) => s + y, 0) - ded, mass = flat * v.W * v.t * 1e-9 * v.rho, F = v.k * v.W * v.t * v.t * v.uts / v.V, use = F / 1000 / v.cap, ratio = 4 * x ** 3 - 3 * x + 1, Rf = v.R / ratio, Ks = (v.R + v.t / 2) / (Rf + v.t / 2), bendTo1 = v.A1 / Ks, bendTo2 = nb > 1 ? v.A2 / Ks : 0;
      const okF = fl[0] >= v.minFl && fl[nb] >= v.minFl, okR = v.R >= v.rMin * v.t, okP = use <= 1, vt = v.V / v.t, ok = okF && okR && okP;
      return output({ nb, ded, flat, mass, F, use, Rf, Ks, bendTo1, bendTo2 }, 'Flat blank length (mm)', flat,
        [m('Bends', q(nb, '', 0)), m('Sum of bend deductions', q(ded, 'mm', 3)), m('Flat blank', `${q(flat, 'mm', 2)} × ${q(v.W, 'mm', 0)}`), m('Blank mass', q(mass, 'kg', 3)), m('Bend force / press use', `${q(F / 1000, 'kN', 1)} / ${q(use * 100, '%', 0)}`), m('Radius after springback', q(Rf, 'mm', 3)), m('Bend to (for bend 1)', q(bendTo1, '°', 2)), ...(nb > 1 ? [m('Bend to (for bend 2)', q(bendTo2, '°', 2))] : [])],
        'Bent bracket plan.', 'Air bending; one radius and K-factor.', {
          text: ok ? 'BRACKET CAN BE MADE' : 'BRACKET NEEDS CHANGES', tone: ok ? 'good' : 'bad',
          checks: [check('Press capacity', okP ? 'pass' : 'fail', `${q(F / 1000, 'kN', 1)} against ${q(v.cap, 'kN', 0)}.`), check('End flanges', okF ? 'pass' : 'fail', okF ? 'End flanges sit across the die.' : `An end flange is shorter than ${q(v.minFl, 'mm', 1)}.`), check('Inside radius', okR ? 'pass' : 'fail', `${q(v.R / v.t, '', 2)} × t against ${q(v.rMin, '', 2)} × t.`), check('Die opening', vt >= 6 && vt <= 12 ? 'pass' : 'warn', `V = ${q(vt, '', 1)} × t; about 6–12 × t is usual for air bending.`)],
        });
    },
    "guard-band-acceptance": (v) => {
      const abbe = v.offset * Math.tan(rad(v.tilt / 3600)) * 1000, temp = v.L / 1000 * v.alpha * v.dT, us = [['Calibration', v.Ucal / 2], ['Resolution', v.res / Math.sqrt(12)], ['Repeatability', v.srep], ['Abbe error', abbe / Math.sqrt(3)], ['Temperature', temp / Math.sqrt(3)]];
      const uc = Math.sqrt(us.reduce((s, [, u]) => s + u * u, 0)), U = v.k * uc, tolUm = v.tol * 1000, tur = U > 0 ? tolUm / (2 * U) : 1e9, accHalf = tolUm / 2 - U, dev = v.reading - v.nominal, devUm = Math.abs(dev) * 1000;
      const accept = accHalf > 0 && devUm <= accHalf + 1e-9, reject = devUm > tolUm / 2 + 1e-9, okT = tur >= v.turMin;
      return output({ abbe, temp, uc, U, tur, accHalf, dev, lo: v.nominal - Math.max(0, accHalf) / 1000, hi: v.nominal + Math.max(0, accHalf) / 1000 }, 'Deviation from nominal (µm)', dev * 1000,
        [m('Combined / expanded uncertainty', `${q(uc, '', 3)} / ${q(U, 'µm', 2)}`), m('Test uncertainty ratio', q(tur, '', 2)), m('Acceptance zone', accHalf > 0 ? `${q(v.nominal - accHalf / 1000, '', 4)} to ${q(v.nominal + accHalf / 1000, 'mm', 4)}` : 'None'), m('Tolerance limits', `${q(v.nominal - v.tol / 2, '', 4)} to ${q(v.nominal + v.tol / 2, 'mm', 4)}`), m('Deviation of the reading', `${dev >= 0 ? '+' : ''}${q(dev * 1000, 'µm', 1)}`)],
        'Guard-banded acceptance decision.', 'Symmetric tolerance; one-U guard band.', {
          text: accept ? 'ACCEPT' : reject ? 'REJECT' : 'INDETERMINATE', tone: accept ? 'good' : 'bad',
          table: tbl('Uncertainty budget', ['Contributor', 'Standard uncertainty (µm)'], us.map(([n, u]) => [n, q(u, '', 3)])),
          checks: [check('Decision', accept ? 'pass' : 'fail', accept ? 'Inside the guard-banded zone.' : reject ? 'Outside the tolerance.' : 'Inside the tolerance but within the uncertainty of a limit: re-measure with a better gauge.'), check('Test uncertainty ratio', okT ? 'pass' : 'warn', `${q(tur, '', 2)} against ${q(v.turMin, '', 1)}.`)],
        });
    },
    "rotary-axis-feed-plan": (v) => {
      const arc = PI * v.radius * v.angle / 180, path = v.mode === 'linear' ? v.dist : v.mode === 'rotary' ? arc : Math.hypot(v.dist, arc);
      if (path <= 0) return invalid('The move has no length at the cutter.');
      const t = path / v.feed, F = 1 / t, rot = v.mode === 'linear' ? 0 : v.angle / t, lin = v.mode === 'rotary' ? 0 : v.dist / t, scale = Math.min(1, rot > 0 ? v.rotMax / rot : 1, lin > 0 ? v.linMax / lin : 1), fAch = v.feed * scale, FAch = fAch / path, ok = scale >= 1 - 1e-12;
      return output({ arc, path, t, F, rot, lin, fAch, FAch }, 'Inverse-time F value', F,
        [m('Path length at the cutter', q(path, 'mm', 3)), m('Block time', q(t * 60, 's', 3)), m('Inverse-time F value', q(F, '', 4)), m('Rotary axis rate', q(rot, '°/min', 1)), m('Linear axis rate', q(lin, 'mm/min', 1)), m('Achievable cutter feed', `${q(fAch, 'mm/min', 1)} (F${q(FAch, '', 4)})`)],
        'Rotary axis feed plan.', 'Constant feed through the block.', {
          text: ok ? 'FEED ACHIEVABLE' : 'AXIS LIMIT GOVERNS', tone: ok ? 'good' : 'bad',
          checks: [check('Rotary rate', rot <= v.rotMax ? 'pass' : 'fail', `${q(rot, '°/min', 0)} against ${q(v.rotMax, '°/min', 0)}.`), check('Linear rate', lin <= v.linMax ? 'pass' : 'fail', `${q(lin, 'mm/min', 0)} against ${q(v.linMax, 'mm/min', 0)}.`), check('Control mode', 'verify', 'Confirm G93 inverse-time mode is active for the block and cancelled afterwards.')],
        });
    },
    "column-formula-compare": (v) => {
      const lam = v.K * v.L / v.r, I = v.A * v.r * v.r, a = v.aRank || v.Sc / (PI * PI * v.E * 1000), Pcr = v.Sc * v.A / (1 + a * lam * lam), n = v.P > 0 ? Pcr / (v.P * 1000) : 1e9, PE = PI * PI * v.E * 1000 * v.A / (lam * lam);
      if (lam > 200 && v.member === 'main') return invalid('Main members above l/r 200 are outside the classic formulas.');
      let psi; if (lam <= 120) psi = 17000 - 0.485 * lam * lam; else { psi = 18000 / (1 + lam * lam / 18000); if (v.member === 'main') psi *= 1.6 - lam / 200; }
      const Sa = psi * 0.0068948, Pa = Sa * v.A / 1000, okR = n >= v.req, okC = v.P <= Pa, ok = okR && okC;
      return output({ lam, I, a, Pcr, n, PE, Sa, Pa }, 'Rankine safety factor', n,
        [m('Slenderness KL/r', q(lam, '', 1)), m('Euler buckling load', q(PE / 1000, 'kN', 1)), m('Rankine crippling load', q(Pcr / 1000, 'kN', 1)), m('Rankine safety factor', q(n, '', 2)), m('Classic safe unit stress', q(Sa, 'MPa', 2)), m('Classic safe load', q(Pa, 'kN', 1)), m('Crushing load (short column)', q(v.Sc * v.A / 1000, 'kN', 1))],
        'Column formula comparison.', 'Concentric load; straight member.', {
          text: ok ? 'COLUMN ADEQUATE' : 'COLUMN NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Rankine factor', okR ? 'pass' : 'fail', `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Classic safe load', okC ? 'pass' : 'fail', `${q(v.P, 'kN', 1)} against ${q(Pa, 'kN', 1)}.`), check('Current code', 'verify', 'Confirm new designs to the current steel code.')],
        });
    },
    "hollow-shaft-conversion": (v) => {
      const KM = v.Km * v.M * 1000, KT = v.Kt * v.T * 1000;
      if (KM + KT <= 0) return invalid('Enter a bending moment or torque.');
      const Ds = Math.cbrt(5.1 / v.St * (KM + Math.sqrt(KM * KM + KT * KT))), B = Math.cbrt(1 / (1 - v.k ** 4)), Do = B * Ds, Di = v.k * Do, wall = (Do - Di) / 2;
      const mS = PI / 4 * (Ds / 1000) ** 2 * v.rho, mH = PI / 4 * ((Do / 1000) ** 2 - (Di / 1000) ** 2) * v.rho, JS = PI * Ds ** 4 / 32, JH = PI * (Do ** 4 - Di ** 4) / 32, tw = (J) => deg(v.T * 1000 * 1000 / (v.G * 1000 * J)), twS = tw(JS), twH = tw(JH);
      const okD = Do <= v.Dmax, okW = v.k === 0 || wall >= v.tMin, okT = twH <= v.twMax, ok = okD && okW && okT;
      return output({ Ds, B, Do, Di, wall, mS, mH, saving: (1 - mH / mS) * 100, twS, twH }, 'Hollow outside diameter (mm)', Do,
        [m('Solid shaft diameter', q(Ds, 'mm', 2)), m('Hollow outside / bore', `${q(Do, '', 2)} / ${q(Di, 'mm', 2)}`), m('Wall thickness', q(wall, 'mm', 2)), m('Mass per metre: solid / hollow', `${q(mS, '', 2)} / ${q(mH, 'kg/m', 2)}`), m('Weight saving', q((1 - mH / mS) * 100, '%', 1)), m('Twist per metre: solid / hollow', `${q(twS, '', 3)} / ${q(twH, '°/m', 3)}`)],
        'Hollow shaft conversion.', 'Brittle material; equal strength.', {
          text: ok ? 'HOLLOW SHAFT WORKS' : 'HOLLOW SHAFT DOES NOT WORK', tone: ok ? 'good' : 'bad',
          checks: [check('Fits', okD ? 'pass' : 'fail', `${q(Do, 'mm', 1)} against ${q(v.Dmax, 'mm', 0)}.`), check('Wall', okW ? 'pass' : 'fail', `${q(wall, 'mm', 1)} against ${q(v.tMin, 'mm', 1)}.`), check('Twist', okT ? 'pass' : 'fail', `${q(twH, '°/m', 3)} against ${q(v.twMax, '°/m', 2)}.`)],
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
