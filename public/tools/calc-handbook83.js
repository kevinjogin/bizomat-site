// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook83). SI units are explicit at each boundary.
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
    "worm-cutter-profile-correction": (v) => {
      const r = v.d / 2, lam = rad(v.lam), phin = rad(v.phin), sl = Math.sin(lam), cl = Math.cos(lam);
      if (!(v.Dw > v.Dc)) return invalid('Enter the smaller tool first: the second tool diameter must be larger than the first.');
      const rni = r * Math.sin(phin) / (sl * sl), qh = v.a / Math.cos(phin);
      const tool = (D) => { const R = D / 2, rn = rni + r * rni / (R * cl * cl), dphi = 5400 * r * sl ** 3 / (v.n * (R * cl * cl + r)), y = qh * qh / (2 * rn), s = 0.000582 * qh * dphi; return { rn, dphi, y, s }; };
      const c = tool(v.Dc), w = tool(v.Dw), dy = w.y - c.y, ds = c.s - w.s;
      const okY = Math.abs(dy) <= v.tolY + 1e-12, okS = Math.abs(ds) <= v.tolS + 1e-12, ok = okY && okS;
      return output({ rni, rnC: c.rn, rnW: w.rn, dphiC: c.dphi, dphiW: w.dphi, q: qh, yC: c.y, yW: w.y, sC: c.s, sW: w.s, dy, ds, dphiDiff: c.dphi - w.dphi }, 'Profile correction Δy (mm)', dy,
        [m('Involute normal profile radius ρ_ni', q(rni, 'mm', 4)), m('Profile radius ρ_n: first / second tool', `${q(c.rn, 'mm', 4)} / ${q(w.rn, 'mm', 4)}`), m('Pressure angle change Δφ: first / second tool', `${q(c.dphi, '′', 4)} / ${q(w.dphi, '′', 4)}`), m('Slant height of the addendum q', q(qh, 'mm', 4)), m('Profile departure y: first / second tool', `${q(c.y, 'mm', 4)} / ${q(w.y, 'mm', 4)}`), m('Slant-height effect s: first / second tool', `${q(c.s, 'mm', 4)} / ${q(w.s, 'mm', 4)}`), m('Correction Δy / Δs', `${q(dy, 'mm', 4)} / ${q(ds, 'mm', 4)}`)],
        'Worm profile change with cutter or grinding wheel size.', 'ANSI B6.9 formulas for straight-sided tools on cylindrical worms.', {
          text: ok ? 'WORMS ALIKE WITHIN TOLERANCE' : 'CORRECT THE CUTTER OR WHEEL', tone: ok ? 'good' : 'bad',
          checks: [check('Profile curvature', okY ? 'pass' : 'fail', `The profiles differ by ${q(dy, 'mm', 4)} from a straight side against ${q(v.tolY, 'mm', 4)} accepted${okY ? '.' : ': give the cutter or wheel a profile curved by this amount.'}`), check('Pressure angle', okS ? 'pass' : 'fail', `The pressure angle changes differ by ${q(c.dphi - w.dphi, '′', 4)}, ${q(ds, 'mm', 4)} along the slant height, against ${q(v.tolS, 'mm', 4)} accepted${okS ? '.' : ': correct the pressure angle of the cutter or wheel by this amount.'}`), check('Wormgear hob', 'verify', 'The hob for the wormgears must match the worm actually produced; check it with the hob maker.')],
        });
    },
    "industrial-worm-gearing-design": (v) => {
      const gcd = (a, b) => (b ? gcd(b, a % b) : a), IN = 25.4;
      const R = v.T / v.t, L = v.t * v.P, D = v.T * v.P / PI;
      const d = v.mode === 'C' ? 2 * v.C - D : v.dw, C = v.mode === 'C' ? v.C : (D + d) / 2;
      if (!(d > 0)) return invalid('The centre distance leaves no worm: increase the centre distance or reduce the pitch or teeth.');
      const lam = Math.atan(L / (PI * d)), lamDeg = deg(lam), Pn = v.P * Math.cos(lam), p = v.depth === 'normal' ? Pn : v.P, few = v.t <= 2;
      const a = (few ? 0.318 : 0.286) * p, W = (few ? 0.686 : 0.623) * p, b = W - a, c = W - 2 * a;
      const d0 = d + 2 * a, Dt = D + 2 * a, U = d0 / 2 - 2 * a;
      const D0lead = lamDeg <= 20 ? D + 3 * 0.3183 * v.P : D + 3 * 0.3183 * v.P * Math.cos(lam), D0thr = Dt + (few ? 0.4775 : 0.3183) * v.P;
      const F = v.mount === 'integral' ? IN * (C / IN) ** 0.875 / 3 : few ? 2.38 * v.P + 0.25 * IN : 2.15 * v.P + 0.2 * IN;
      const G = v.P * (4.5 + 0.02 * v.T), V = PI * d / 1000 * v.nw / 60 / Math.cos(lam), dEmp = IN * ((C / IN) ** 0.75 + 2.2);
      const pf = Math.atan(v.f), Ew = 100 * Math.tan(lam) / Math.tan(lam + pf), EwEmp = 100 - R / 2, Eg = lam > pf ? 100 * Math.tan(lam - pf) / Math.tan(lam) : 0, EgEmp = Math.max(0, 100 - 2 * R);
      const hunt = gcd(v.T, v.t) === 1, total = v.T + v.t, okTot = total >= 40;
      const bands = [[0, 12, 14.5], [10, 25, 20], [20, 35, 25], [35, 90, 30]], guide = bands.filter((x) => lamDeg >= x[0] && lamDeg <= x[1]).map((x) => x[2]), okPhi = guide.some((g) => Math.abs(g - v.phi) < 0.01);
      const steep = lamDeg > 15 && v.depth === 'axial', ok = okTot && okPhi && !steep;
      return output({ R, L, D, d, C, lamDeg, Pn, a, W, b, c, d0, Dt, U, D0lead, D0thr, F, G, V, dEmp, Ew, EwEmp, Eg, EgEmp, total }, 'Lead angle (°)', lamDeg,
        [m('Ratio / lead', `${q(R, '', 4)} / ${q(L, 'mm', 4)}`), m('Wormgear / worm pitch diameter', `${q(D, 'mm', 4)} / ${q(d, 'mm', 4)}`), m('Centre distance / lead angle', `${q(C, 'mm', 4)} / ${q(lamDeg, '°', 4)}`), m('Normal pitch / addendum / whole depth', `${q(Pn, 'mm', 4)} / ${q(a, 'mm', 4)} / ${q(W, 'mm', 4)}`), m('Dedendum / clearance', `${q(b, 'mm', 4)} / ${q(c, 'mm', 4)}`), m('Worm outside / wormgear throat diameter', `${q(d0, 'mm', 4)} / ${q(Dt, 'mm', 4)}`), m('Wormgear outside diameter (lead rule / thread rule)', `${q(D0lead, 'mm', 4)} / ${q(D0thr, 'mm', 4)}`), m('Throat radius / face width / thread length', `${q(U, 'mm', 4)} / ${q(F, 'mm', 4)} / ${q(G, 'mm', 4)}`), m('Rubbing speed', q(V, 'm/s', 4)), m('Efficiency, worm driving (formula / empirical)', `${q(Ew, '%', 3)} / ${q(EwEmp, '%', 3)}`), m('Efficiency, wormgear driving (formula / empirical)', `${q(Eg, '%', 3)} / ${q(EgEmp, '%', 3)}`)],
        'Industrial worm gearing proportions.', 'Handbook Table 4 rules and AGMA proportions for coarse-pitch cylindrical worm gearing; no load or thermal rating.', {
          text: ok ? 'WORM SET FOLLOWS THE HANDBOOK RULES' : 'REVIEW THE WORM SET PROPORTIONS', tone: ok ? 'good' : 'warn',
          checks: [check('Teeth plus threads', okTot ? 'pass' : 'fail', `${v.T} + ${v.t} = ${total}; the handbook gives 40 as a desirable minimum.`), check('Pressure angle', okPhi ? 'pass' : 'fail', `At a ${q(lamDeg, '°', 3)} lead angle the handbook guide gives ${guide.join('° or ')}°; you chose ${v.phi}°.`), check('Tooth depth basis', steep ? 'fail' : 'pass', steep ? `The lead angle is over 15°: the handbook says the normal pitch is commonly used for the depth, giving shallower teeth.` : 'The depth basis suits the lead angle.'), check('Hunting tooth', 'verify', hunt ? `${v.T} teeth and ${v.t} threads have no common factor, so every thread meets every tooth (hunting-tooth action); index the threads accurately.` : `${v.T} teeth and ${v.t} threads share a factor, so there is no hunting-tooth action; mate the same worm and wormgear teeth when reassembling.`), check('Worm diameter', 'verify', `The handbook’s empirical worm pitch diameter for this centre distance is ${q(dEmp, 'mm', 4)} against ${q(d, 'mm', 4)}; confirm worm bending and torsional strength.`), check('Self-locking', 'verify', Eg > 0 ? `With the wormgear driving the formula gives ${q(Eg, '%', 3)}; the drive back-drives.` : 'With the wormgear driving the formula gives no efficiency (lead angle at or below the friction angle): the drive tends to self-lock, but do not rely on it as a brake.'), check('Ratings', 'verify', 'Load, wear and thermal ratings are not calculated.')],
        });
    },
    "worm-hob-design": (v) => {
      const gcd = (a, b) => (b ? gcd(b, a % b) : a), toDeg = 180 / PI;
      const L = v.t * v.P, lam = Math.atan(L / (PI * v.D)), Pn = v.P * Math.cos(lam);
      let S = 0;
      for (let i = 0; i < 100; i++) { const Dh = v.D + S, O = Dh + 2 * v.A + 2 * v.Cl, Hh = Math.atan(PI * Dh / L) * toDeg, h = Math.atan(PI * O / L) * toDeg; S = 0.075 * Pn * (16 - (h - Hh)) / 16 + 0.254; }
      const Dh = v.D + S, O = Dh + 2 * v.A + 2 * v.Cl, root = v.D - 2 * v.A, Hh = deg(Math.atan(PI * Dh / L)), h = deg(Math.atan(PI * O / L));
      if (!(root > 0)) return invalid('The addendum is too large for the worm pitch diameter: the hob root diameter is not positive.');
      const lamH = Math.atan(L / (PI * Dh)), setDeg = deg(lam - lamH), Frule = 3 * O / (2 * v.P);
      const Fsug = Array.from({ length: 200 }, (_, i) => i + 2).filter((k) => gcd(k, v.t) === 1).sort((x, y) => Math.abs(x - Frule) - Math.abs(y - Frule) || x - y)[0];
      const okF = gcd(v.Fl, v.t) === 1, okG = gcd(v.Tg, v.t) === 1, pf = PI * O / v.Fl, gash = 0.4 * pf;
      const helical = v.fl === 'helical', Nex = v.Fl / Math.cos(lamH) ** 2;
      if (helical && !(v.Nrel > v.Fl)) return invalid('For helical flutes the teeth per turn along the thread must be more than the number of flutes.');
      const Lf = helical ? L * v.Fl / (v.Nrel - v.Fl) : 0, angF = helical ? deg(Math.atan(PI * Dh / Lf)) : 0, ok = okF && okG;
      return output({ L, lamDeg: deg(lam), Pn, S, O, root, Dh, Hdeg: Hh, hdeg: h, lamHdeg: deg(lamH), setDeg, Frule, Fsug, pf, gash, Nex, Lf, angF }, 'Hob outside diameter (mm)', O,
        [m('Lead / worm lead angle / normal pitch', `${q(L, 'mm', 4)} / ${q(deg(lam), '°', 4)} / ${q(Pn, 'mm', 4)}`), m('Helix angles from the axis: outside / pitch', `${q(h, '°', 4)} / ${q(Hh, '°', 4)}`), m('Sharpening allowance', q(S, 'mm', 4)), m('Hob outside / pitch / root diameter', `${q(O, 'mm', 4)} / ${q(Dh, 'mm', 4)} / ${q(root, 'mm', 4)}`), m('Hob lead angle / setting angle correction', `${q(deg(lamH), '°', 4)} / ${q(setDeg, '°', 4)}`), m('Flutes: rule / suggested / chosen', `${q(Frule, '', 3)} / ${Fsug} / ${v.Fl}`), m('Flute pitch / gash width at the periphery', `${q(pf, 'mm', 4)} / ${q(gash, 'mm', 4)}`), ...(helical ? [m('Teeth per turn along the thread: exact / chosen', `${q(Nex, '', 4)} / ${v.Nrel}`), m('Flute lead / flute angle from the axis', `${q(Lf, 'mm', 4)} / ${q(angF, '°', 4)}`)] : [])],
        'Wormgear hob proportions.', 'Handbook hob diameter formulas, AGMA sharpening allowance and flute rules.', {
          text: ok ? 'HOB LAYOUT FOLLOWS THE HANDBOOK RULES' : 'CHANGE THE FLUTES OR THREADS', tone: ok ? 'good' : 'bad',
          checks: [check('Flutes and threads', okF ? 'pass' : 'fail', `${v.Fl} flutes and ${v.t} threads ${okF ? 'have no common factor.' : `share a factor: use ${Fsug} flutes or another count with no common factor.`}`), check('Threads and wormgear teeth', okG ? 'pass' : 'fail', `${v.t} threads and ${v.Tg} teeth ${okG ? 'have no common factor.' : 'share a factor: choose a thread count that does not divide into the teeth.'}`), check('Number of flutes', 'verify', `The handbook rule gives about ${q(Frule, '', 3)} flutes for general-purpose hobs; ${v.Fl} chosen.`), ...(helical ? [check('Relieving', 'verify', `The exact value is ${q(Nex, '', 4)} teeth per turn; the flute lead of ${q(Lf, 'mm', 4)} gives ${v.Nrel}, which the relieving attachment must be geared for.`)] : [])],
        });
    },
    "metric-tap-thread-limits": (v) => {
      const h = 0.64951905 * v.P, bPD = v.D - h, W = 0.08 * v.P, step = 0.013;
      let maxPD, minPD;
      if (v.lim === 'DU') { minPD = bPD - step * v.num; maxPD = minPD + v.Z; } else { maxPD = v.lim === 'D' ? bPD + step * v.num : bPD + v.Y; minPD = maxPD - v.Z; }
      const limNo = maxPD >= bPD ? (maxPD - bPD) / step : (bPD - minPD) / step, minMaj = maxPD - v.Y + 0.64951904 * v.P + W, maxMaj = minMaj + v.X;
      const okPD = v.PDm >= minPD - 1e-9 && v.PDm <= maxPD + 1e-9, okM = v.Mm >= minMaj - 1e-9 && v.Mm <= maxMaj + 1e-9, ok = okPD && okM;
      return output({ h, bPD, maxPD, minPD, limNo, W, minMaj, maxMaj }, 'Maximum tap pitch diameter (mm)', maxPD,
        [m('Thread height / basic pitch diameter', `${q(h, 'mm', 4)} / ${q(bPD, 'mm', 5)}`), m('Tap pitch diameter: minimum / maximum', `${q(minPD, 'mm', 5)} / ${q(maxPD, 'mm', 5)}`), m('Equivalent limit number', `${maxPD >= bPD ? 'D' : 'DU'} ${q(limNo, '', 3)}`), m('Tap major diameter: minimum / maximum', `${q(minMaj, 'mm', 5)} / ${q(maxMaj, 'mm', 5)}`), m('Measured pitch / major diameter', `${q(v.PDm, 'mm', 5)} / ${q(v.Mm, 'mm', 5)}`)],
        'Metric ground thread tap limits.', 'ASME B94.9 formulas as the handbook gives them; table allowances entered by the user.', {
          text: ok ? 'TAP WITHIN ITS LIMITS' : 'TAP OUTSIDE ITS LIMITS', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch diameter', okPD ? 'pass' : 'fail', `${q(v.PDm, 'mm', 5)} measured against ${q(minPD, 'mm', 5)} to ${q(maxPD, 'mm', 5)}.`), check('Major diameter', okM ? 'pass' : 'fail', `${q(v.Mm, 'mm', 5)} measured against ${q(minMaj, 'mm', 5)} to ${q(maxMaj, 'mm', 5)}.`), check('Table allowances', 'verify', 'X, Y and Z must be the table values for this pitch and size range.'), check('Lead and angle', 'verify', 'Check lead and half-angle against the ASME B94.9 tolerances.')],
        });
    },
    "unified-tap-thread-limits": (v) => {
      const P = 1 / v.n, h = 0.64951905 * P, bPD = v.D - h, step = 0.0005, A = 0.13 * P, B = (v.n >= 48 ? 0.087 : v.n >= 36 ? 0.076 : 0.065) * P;
      let maxPD, minPD;
      if (v.lim === 'H') { maxPD = bPD + step * v.num; minPD = maxPD - v.Dt; } else { minPD = v.lim === 'L' ? bPD - step * v.num : bPD + v.C; maxPD = minPD + v.Dt; }
      const over = maxPD >= bPD, limNo = over ? (maxPD - bPD) / step : (bPD - minPD) / step, maxMaj = minPD - v.C + 0.64951904 * P + A, minMaj = maxMaj - B;
      const okPD = v.PDm >= minPD - 1e-10 && v.PDm <= maxPD + 1e-10, okM = v.Mm >= minMaj - 1e-10 && v.Mm <= maxMaj + 1e-10, ok = okPD && okM, mm = (x) => q(25.4 * x, 'mm', 4);
      return output({ P, h, bPD, minPD, maxPD, limNo, A, B, maxMaj, minMaj }, 'Maximum tap pitch diameter (in)', maxPD,
        [m('Pitch / thread height', `${q(P, 'in', 5)} / ${q(h, 'in', 5)}`), m('Basic pitch diameter', `${q(bPD, 'in', 5)} (${mm(bPD)})`), m('Tap pitch diameter: minimum / maximum', `${q(minPD, 'in', 5)} / ${q(maxPD, 'in', 5)} (${mm(minPD)} / ${mm(maxPD)})`), m('Equivalent limit number', `${over ? 'H' : 'L'} ${q(limNo, '', 3)}`), m('Constant A / tolerance B', `${q(A, 'in', 4)} / ${q(B, 'in', 4)}`), m('Tap major diameter: minimum / maximum', `${q(minMaj, 'in', 5)} / ${q(maxMaj, 'in', 5)} (${mm(minMaj)} / ${mm(maxMaj)})`)],
        'Unified inch ground thread tap limits.', 'ASME B94.9 formulas as the handbook gives them; table allowances entered by the user.', {
          text: ok ? 'TAP WITHIN ITS LIMITS' : 'TAP OUTSIDE ITS LIMITS', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch diameter', okPD ? 'pass' : 'fail', `${q(v.PDm, 'in', 5)} measured against ${q(minPD, 'in', 5)} to ${q(maxPD, 'in', 5)}.`), check('Major diameter', okM ? 'pass' : 'fail', `${q(v.Mm, 'in', 5)} measured against ${q(minMaj, 'in', 5)} to ${q(maxMaj, 'in', 5)}.`), check('Table allowances', 'verify', 'C and D must be the table values for these threads per inch and this diameter.'), check('Lead and angle', 'verify', 'Check lead and half-angle against the ASME B94.9 tolerances.')],
        });
    },
    "slot-vs-high-speed-milling-cost": (v) => {
      const cur = (x) => 'A' + String.fromCharCode(36) + q(x, '', 4);
      const strat = (z, fz, V, T, p, tr, ce) => { const rpm = 1000 * V / (PI * v.Dc), FR = z * fz * rpm, tc = p * v.dist / FR, TV = tr + 60 * ce / v.HR, c = v.HR * tc * (1 + TV / T) / 60; return { rpm, FR, tc, TV, c }; };
      const s = strat(v.zS, v.fzS, v.VS, v.TS, v.pS, v.trS, v.ceS), h = strat(v.zH, v.fzH, v.VH, v.TH, v.pH, v.trH, v.ceH);
      const save = s.c - h.c, ratioPct = 100 * h.c / s.c, okS = s.rpm <= v.nmax, okH = h.rpm <= v.nmax, hsCheaper = h.c < s.c;
      return output({ rpmS: s.rpm, FRS: s.FR, tcS: s.tc, TVS: s.TV, cS: s.c, rpmH: h.rpm, FRH: h.FR, tcH: h.tc, TVH: h.TV, cH: h.c, save, saveBatch: save * v.qty, ratioPct }, 'Cost ratio, high-speed ÷ slot (%)', ratioPct,
        [m('Spindle speed: slot / high-speed', `${q(s.rpm, 'rpm', 4)} / ${q(h.rpm, 'rpm', 4)}`), m('Feed rate: slot / high-speed', `${q(s.FR, 'mm/min', 4)} / ${q(h.FR, 'mm/min', 4)}`), m('Cutting time per part: slot / high-speed', `${q(s.tc, 'min', 4)} / ${q(h.tc, 'min', 4)}`), m('Equivalent tooling time T_V: slot / high-speed', `${q(s.TV, 'min', 4)} / ${q(h.TV, 'min', 4)}`), m('Cost per part: slot / high-speed (ex GST)', `${cur(s.c)} / ${cur(h.c)}`), m('Saving per part / per batch (ex GST)', `${cur(save)} / ${cur(save * v.qty)}`)],
        'Slot against high-speed end milling cost per part.', 'Handbook total cost of cutting, tool changing and tooling; idle and handling time excluded.', {
          text: hsCheaper ? 'HIGH-SPEED MILLING COSTS LESS' : 'SLOT MILLING COSTS LESS', tone: okS && okH ? 'good' : 'bad',
          checks: [check('Cost per part', 'pass', `High-speed milling costs ${q(ratioPct, '%', 3)} of slot milling: ${cur(h.c)} against ${cur(s.c)} per part, ex GST.`), check('Spindle speed (slot)', okS ? 'pass' : 'fail', `${q(s.rpm, 'rpm', 4)} against ${q(v.nmax, 'rpm', 4)} available.`), check('Spindle speed (high-speed)', okH ? 'pass' : 'fail', `${q(h.rpm, 'rpm', 4)} against ${q(v.nmax, 'rpm', 4)} available${okH ? '.' : ': lower the cutting speed and recheck the tool life.'}`), check('Passes', 'verify', `${v.pS} slot pass(es) against ${v.pH} high-speed pass(es): enter the passes each strategy needs to finish the same feature.`), check('Cutting data', 'verify', 'Feeds, speeds and tool lives must come from your tooling data at the stated tool life.')],
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
