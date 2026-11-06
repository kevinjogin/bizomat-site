// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook82). SI units are explicit at each boundary.
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
    "gear-pitting-geometry-factor": (v) => {
      const n1 = v.n1, n2 = v.n2, mG = n2 / n1, cps = Math.cos(rad(v.psi)), R1 = n1 / (2 * cps), phi = Math.atan(Math.tan(rad(v.phin)) / cps), Rb1 = R1 * Math.cos(phi), Rb2 = Rb1 * mG;
      const Cr = v.Cr / v.mn, R01 = v.do1 / (2 * v.mn), R02 = v.do2 / (2 * v.mn), F = v.F / v.mn;
      if (n2 < n1) return invalid('Enter the smaller gear as the pinion: the gear teeth must be at least the pinion teeth.');
      if (!(R01 > Rb1 && R02 > Rb2)) return invalid('An outside diameter is at or below its base circle: check the outside diameters and module.');
      if (!(Cr > Rb1 + Rb2)) return invalid('The centre distance is too small for the base circles: check the centre distance and module.');
      const phir = Math.acos((Rb2 + Rb1) / Cr), pb = 2 * PI * Rb1 / n1, pN = PI * Math.cos(rad(v.phin)), psib = Math.acos(Math.min(1, pN / pb));
      const C6 = Cr * Math.sin(phir), C1 = C6 - Math.sqrt(R02 * R02 - Rb2 * Rb2), C5 = Math.sqrt(R01 * R01 - Rb1 * Rb1), C2 = C5 - pb, C4 = C1 + pb, Z = C5 - C1, mp = Z / pb;
      if (!(C1 > 0) || !(C5 < C6)) return invalid('Contact reaches below a base circle (interference): check the outside diameters and centre distance.');
      if (!(mp >= 1)) return invalid('The transverse contact ratio is below 1, so the teeth do not stay in mesh: check the outside diameters and centre distance.');
      const spur = v.psi === 0;
      if (spur && mp > 2) return invalid('The transverse contact ratio is above 2 (high contact ratio spur gears), which this method does not cover.');
      const px = spur ? 0 : PI / Math.sin(rad(v.psi)), mF = spur ? 0 : F / px;
      const Rm1 = 0.5 * (R01 + (Cr - R02)), rm1 = Math.sqrt(Rm1 * Rm1 - Rb1 * Rb1), rm2 = C6 - rm1;
      let Lmin = F, mN = 1, r1, r2, Cpsi = 1;
      if (mF > 1) {
        const na = mF - Math.floor(mF), nr = mp - Math.floor(mp);
        Lmin = na <= 1 - nr ? (mp * F - na * nr * px) / Math.cos(psib) : (mp * F - (1 - na) * (1 - nr) * px) / Math.cos(psib);
        mN = F / Lmin; r1 = rm1; r2 = C6 - r1;
      } else {
        r1 = C2; r2 = C6 - r1;
        const inner = 1 - mF * (1 - rm1 * rm2 * Z / (r1 * r2 * pN));
        if (!(inner > 0)) return invalid('The helical overlap factor cannot be formed for this geometry: check the face width and helix angle.');
        Cpsi = Math.sqrt(inner);
      }
      if (!(r1 > 0 && r2 > 0 && Lmin > 0)) return invalid('A radius of curvature or the contact line length is not positive: check the geometry.');
      const d = 2 * Cr / (mG + 1), I = Math.cos(phir) * Cpsi * Cpsi / ((1 / r1 + 1 / r2) * d * mN), ok = I >= v.Iused - 1e-12;
      const kind = spur ? 'spur' : mF > 1 ? 'conventional helical (m_F > 1)' : 'low axial contact ratio helical (m_F ≤ 1)';
      return output({ mG, phi: deg(phi), phir: deg(phir), Rb1, Rb2, pb, pN, psib: deg(psib), C1, C2, C4, C5, C6, Z, mp, mF, Lmin, mN, r1, r2, Cpsi, d, I }, 'Geometry factor I', I,
        [m('Pair type', kind), m('Transverse / operating pressure angle', `${q(deg(phi), '°', 3)} / ${q(deg(phir), '°', 3)}`), m('Transverse / axial contact ratio', `${q(mp, '', 4)} / ${q(mF, '', 4)}`), m('Active length of contact Z (unity module)', q(Z, '', 4)), m('Minimum contact length / load sharing ratio', `${q(Lmin * v.mn, 'mm', 2)} / ${q(mN, '', 4)}`), m('Radii of curvature ρ₁ / ρ₂', `${q(r1 * v.mn, '', 3)} / ${q(r2 * v.mn, 'mm', 3)}`), m('Helical overlap factor C_ψ', q(Cpsi, '', 4)), m('Geometry factor I', q(I, '', 4))],
        'AGMA pitting resistance geometry factor I.', 'External spur or helical gears by the AGMA 908-B89 equations; no tip relief or undercut allowance.', {
          text: ok ? 'GEOMETRY FACTOR SUPPORTS THE RATING' : 'GEOMETRY FACTOR BELOW THE VALUE USED', tone: ok ? 'good' : 'bad',
          checks: [check('I against the rating', ok ? 'pass' : 'fail', `I = ${q(I, '', 4)} against ${q(v.Iused, '', 4)} used in the rating${ok ? '.' : ': rerun the pitting rating with the calculated I, which raises the contact stress.'}`), check('Contact ratio', 'pass', `Transverse contact ratio ${q(mp, '', 3)}${spur ? '' : `, axial ${q(mF, '', 3)}`}.`), check('Bending factor J', 'verify', 'This tool does not give J; take it from AGMA 908-B89 or the gear maker.')],
        });
    },
    "fine-pitch-worm-design": (v) => {
      const lam = rad(v.lam), l = v.n * v.Px, d = l / (PI * Math.tan(lam)), D = v.N * v.Px / PI, C = 0.5 * (d + D), mG = v.N / v.n;
      const Pn = v.Px * Math.cos(lam), a = 0.3183 * Pn, ht = 0.7003 * Pn + 0.0508, hk = 0.6366 * Pn, c = ht - hk, tn = 0.5 * Pn;
      const dO = d + 2 * a, DO = 2 * C - d + 2 * a, fg = (dO + 2 * c) ** 2 - (dO - 4 * a) ** 2;
      if (!(c > 0) || !(fg > 0) || !(dO - 4 * a > 0)) return invalid('The tooth proportions do not fit this worm: check the axial pitch and lead angle.');
      const FG = 1.125 * Math.sqrt(fg), FW = Math.sqrt(DO * DO - D * D);
      const nEst = 2 * PI * v.Ct / (v.Px * (1 / Math.tan(lam) + mG)), cotT = 2 * PI * v.Ct / (v.n * v.Px) - mG;
      if (v.dmin >= v.dmax) return invalid('The smallest accepted worm diameter must be less than the largest.');
      const lamT = cotT > 0 ? deg(Math.atan(1 / cotT)) : NaN, okC = Math.abs(C - v.Ct) <= v.Ctol + 1e-9, okD = d >= v.dmin - 1e-9 && d <= v.dmax + 1e-9, ok = okC && okD;
      return output({ l, d, D, C, mG, Pn, a, ht, hk, c, tn, dO, DO, FG, FW, nEst, ...(Number.isFinite(lamT) ? { lamT } : {}) }, 'Centre distance (mm)', C,
        [m('Lead / ratio', `${q(l, 'mm', 4)} / ${q(mG, '', 4)}`), m('Worm / wormgear pitch diameter', `${q(d, '', 4)} / ${q(D, 'mm', 4)}`), m('Centre distance', `${q(C, 'mm', 4)} against ${q(v.Ct, 'mm', 4)}`), m('Normal pitch / addendum', `${q(Pn, '', 4)} / ${q(a, 'mm', 4)}`), m('Whole depth / working depth / clearance', `${q(ht, '', 4)} / ${q(hk, '', 4)} / ${q(c, 'mm', 4)}`), m('Worm / wormgear outside diameter', `${q(dO, '', 4)} / ${q(DO, 'mm', 4)}`), m('Minimum face width / threaded length', `${q(FG, '', 4)} / ${q(FW, 'mm', 4)}`), m('For the target: threads / lead angle', `${q(nEst, '', 2)} / ${Number.isFinite(lamT) ? q(lamT, '°', 3) : 'not reachable with these threads'}`)],
        'Fine-pitch worm and wormgear proportions.', 'ANSI B6.9-1977 proportions as given in the handbook; axes at right angles, non-throated wormgear.', {
          text: ok ? 'WORM SET MEETS THE CENTRE DISTANCE' : !okC ? 'CENTRE DISTANCE OFF TARGET' : 'WORM DIAMETER OUTSIDE RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Centre distance', okC ? 'pass' : 'fail', `${q(C, 'mm', 4)} against ${q(v.Ct, 'mm', 4)} ± ${q(v.Ctol, 'mm', 3)}${okC ? '.' : `: about ${q(nEst, '', 2)} threads at this lead angle${Number.isFinite(lamT) ? `, or a ${q(lamT, '°', 2)} lead angle with ${v.n} threads,` : ''} would come closer.`}`), check('Worm pitch diameter', okD ? 'pass' : 'fail', `${q(d, 'mm', 4)} against ${q(v.dmin, '', 2)} to ${q(v.dmax, 'mm', 2)}.`), check('Pressure angle', 'verify', 'The worm\'s actual normal pressure angle is slightly above the 20° cutter angle; give the cutter or wheel diameter to the worm maker.')],
        });
    },
    "internal-gear-pin-measurement": (v) => {
      const inv = (a) => Math.tan(a) - a, solve = (t) => { let a = Math.cbrt(3 * t); for (let i = 0; i < 80; i++) { const ta = Math.tan(a); const da = (ta - a - t) / (ta * ta); a -= da; if (Math.abs(da) < 1e-15) break; } return a; };
      const D = v.m * v.z, ph = rad(v.phi), Db = D * Math.cos(ph), Rb = Db / 2, e0 = PI * v.m / 2, odd = v.z % 2 === 1, k = odd ? Math.cos(PI / (2 * v.z)) : 1;
      if (v.eMin > v.eMax) return invalid('The smallest space-width increase must not exceed the largest.');
      if (!(v.Di < D && v.Dr > D)) return invalid('The inside diameter must be below, and the root diameter above, the pitch diameter of an internal gear.');
      const at = (e) => { const t = e / D + inv(ph) - v.dp / Db; if (!(t > 0)) return null; const pw = solve(t), Rw = Rb / Math.cos(pw); return { pw, Rw, M: 2 * Rw * k - v.dp }; };
      const s0 = at(e0), sLo = at(e0 + v.eMin), sHi = at(e0 + v.eMax);
      if (!s0 || !sLo || !sHi) return invalid('The pin is too large for the tooth space: choose a smaller pin.');
      const RwM = (v.Mmeas + v.dp) / (2 * k);
      if (!(RwM > Rb)) return invalid('The measured dimension is too small for this gear and pin: check the reading and pin size.');
      const pwM = Math.acos(Rb / RwM), eM = D * (inv(pwM) - inv(ph) + v.dp / Db), esM = eM - e0;
      const dc = 2 * Math.hypot(Rb, Rb * Math.tan(s0.pw) + v.dp / 2), okC = dc > v.Di && dc < v.Dr, okM = v.Mmeas >= sLo.M - 1e-9 && v.Mmeas <= sHi.M + 1e-9;
      return output({ D, Db, e0, pw0: deg(s0.pw), Rw0: s0.Rw, M0: s0.M, Mlo: sLo.M, Mhi: sHi.M, eM, esM, dc }, 'Measurement between pins, standard space (mm)', s0.M,
        [m('Pitch / base diameter', `${q(D, '', 4)} / ${q(Db, 'mm', 4)}`), m('Teeth', odd ? 'odd: pins nearly opposite' : 'even: pins opposite'), m('Pin centre pressure angle', q(deg(s0.pw), '°', 4)), m('Between pins, standard space', q(s0.M, 'mm', 4)), m('Between pins, backlash limits', `${q(sLo.M, '', 4)} to ${q(sHi.M, 'mm', 4)}`), m('Space-width increase from the reading', q(esM, 'mm', 4)), m('Pin contact diameter', q(dc, 'mm', 3))],
        'Internal gear measurement between pins.', 'Involute spur internal gear; pins in opposite or nearly opposite spaces.', {
          text: okM ? 'READING WITHIN LIMITS' : 'READING OUTSIDE LIMITS', tone: okM ? 'good' : 'bad',
          checks: [check('Reading', okM ? 'pass' : 'fail', `${q(v.Mmeas, 'mm', 4)} against ${q(sLo.M, '', 4)} to ${q(sHi.M, 'mm', 4)}: the space is opened by ${q(esM, 'mm', 4)}${okM ? '.' : v.Mmeas < sLo.M ? ', too little for the backlash allowance.' : ', more than the allowance.'}`), check('Pin contact', okC ? 'pass' : 'fail', `The pins touch the flanks at ${q(dc, 'mm', 3)}, between ${q(v.Di, '', 3)} and ${q(v.Dr, 'mm', 3)}${okC ? '.' : ': choose a pin size that touches the flanks, not the tips or the root.'}`), check('Pin size', 'verify', 'Check the pins\' actual diameter before measuring; an error in the pin moves the reading by more than the error itself.')],
        });
    },
    "wire-rope-sheave-drum-check": (v) => {
      const p = 2 * v.T / (v.Ds * v.d), dw = v.kw * v.d, sb = v.E * dw / v.Ds, A = v.Qa * v.d * v.d, Pb = sb * A, SF = v.MBF * 1000 / (v.T + Pb), ratio = v.Ds / v.d;
      const Ain = (v.Hf - v.Dd - 2 * v.Y) / 2 / 25.4, Din = v.Dd / 25.4, Bin = v.B / 25.4;
      if (!(Ain > 0)) return invalid('The flange diameter leaves no winding depth: check the barrel, flange and unfilled depth.');
      const Lft = (Ain + Din) * Ain * Bin * v.K, L = Lft * 0.3048, okP = p <= v.pAllow + 1e-12, okS = SF >= v.SFreq - 1e-12, okL = L >= v.Lreq - 1e-9, ok = okP && okS && okL;
      return output({ p, dw, sb, A, Pb, SF, ratio, depth: Ain * 25.4, L }, 'Radial pressure on the sheave (MPa)', p,
        [m('Radial pressure', `${q(p, 'MPa', 3)} against ${q(v.pAllow, 'MPa', 3)}`), m('Sheave-to-rope diameter ratio', q(ratio, '', 3)), m('Outer wire diameter / bending stress', `${q(dw, 'mm', 3)} / ${q(sb, 'MPa', 4)}`), m('Metal area / bending load', `${q(A, 'mm²', 4)} / ${q(Pb / 1000, 'kN', 4)}`), m('Factor against breaking (tension + bending)', q(SF, '', 3)), m('Drum winding depth', q(Ain * 25.4, 'mm', 4)), m('Rope the drum holds', `${q(L, 'm', 4)} against ${q(v.Lreq, 'm', 4)}`)],
        'Wire rope on sheaves and drums.', 'Handbook formulas for tread pressure, bending load and drum capacity; even winding.', {
          text: ok ? 'ROPE, SHEAVE AND DRUM SUIT THE DUTY' : !okP ? 'SHEAVE PRESSURE TOO HIGH' : !okS ? 'ROPE FACTOR TOO LOW WITH BENDING' : 'DRUM TOO SMALL FOR THE ROPE', tone: ok ? 'good' : 'bad',
          checks: [check('Sheave pressure', okP ? 'pass' : 'fail', `${q(p, 'MPa', 3)} against ${q(v.pAllow, 'MPa', 3)}${okP ? '.' : ': use a larger sheave, a harder sheave material or a larger rope.'}`), check('Factor against breaking', okS ? 'pass' : 'fail', `${q(SF, '', 3)} on tension plus bending load against ${q(v.SFreq, '', 2)} required.`), check('Drum capacity', okL ? 'pass' : 'fail', `${q(L, 'm', 1)} against ${q(v.Lreq, 'm', 1)} needed.`), check('Rope data', 'verify', 'Confirm the wire size, area factor and modulus with the rope maker for this construction.')],
        });
    },
    "shock-stress-check": (v) => {
      const g = 9.81, Q = v.M * g, beam = ['ss', 'cant', 'fixed'].includes(v.member), drop = v.load === 'drop', E0 = drop ? Q * v.h : 1000 * 0.5 * v.M * v.vel * v.vel;
      if (!(E0 > 0) && !drop) return invalid('Enter a speed above zero for a moving body.');
      let ps, y, p, approx;
      if (beam) {
        const k = { ss: 4, cant: 1, fixed: 8 }[v.member], c = { ss: 96, cant: 6, fixed: 384 }[v.member];
        ps = Q * v.a * v.L / (k * v.I); y = 2 * Q * v.L ** 3 / (c * v.E * v.I);
        p = ps * (1 + Math.sqrt(1 + c * v.h * v.E * v.I / (Q * v.L ** 3)));
        approx = v.a * Math.sqrt(6 * E0 * v.E / (v.L * v.I));
      } else {
        if (!(v.dw < v.Dm)) return invalid('The wire must be smaller than the mean coil diameter.');
        const sq = v.member === 'square', d = v.dw, D = v.Dm, cs = sq ? 1.34 : 1.27;
        ps = sq ? 9 * Q * D / (4 * d ** 3) : 8 * Q * D / (PI * d ** 3);
        y = sq ? 1.8 * PI * Q * D ** 3 * v.n / (v.G * d ** 4) : 8 * Q * D ** 3 * v.n / (v.G * d ** 4);
        p = ps * (1 + Math.sqrt(1 + 2 * v.h / y));
        approx = cs * Math.sqrt(E0 * v.G / (D * d * d * v.n));
      }
      const peak = drop ? p : approx, ok = peak <= v.Sallow + 1e-9, factor = peak / ps, dyn = drop ? y * p / ps : NaN;
      const vals = drop ? { Q, E0: E0 / 1000, ps, y, p, approx, factor, dyn, peak } : { Q, E0: E0 / 1000, approx, peak };
      return output(vals, 'Peak shock stress (MPa)', peak,
        [m('Shock energy', q(E0 / 1000, 'J', 4)), ...(drop ? [m('Static stress / deflection under the weight', `${q(ps, 'MPa', 4)} / ${q(y, 'mm', 4)}`), m('Peak stress, full formula', q(p, 'MPa', 4)), m('Peak stress, approximation for large drops', q(approx, 'MPa', 4)), m('Impact factor', q(factor, '', 4)), m('Peak deflection', q(dyn, 'mm', 4))] : [m('Peak stress, energy formula', q(approx, 'MPa', 4))]), m('Peak stress against allowable', `${q(peak, 'MPa', 4)} against ${q(v.Sallow, 'MPa', 4)}`)],
        'Stress produced by a shock load.', 'All the shock energy taken elastically by the member; handbook beam and spring shock formulas.', {
          text: ok ? 'SHOCK STRESS WITHIN ALLOWABLE' : 'SHOCK STRESS ABOVE ALLOWABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Peak stress', ok ? 'pass' : 'fail', `${q(peak, 'MPa', 4)} against ${q(v.Sallow, 'MPa', 4)}${ok ? '.' : ': lower the drop height or speed, add a softer buffer, or enlarge the section.'}`), ...(beam ? [] : [check('Spring curvature', 'verify', 'Spring stresses here have no curvature correction; apply the Wahl factor for the stress at the coil inside, and check the spring does not go solid.')]), check('Energy absorbed', 'verify', 'The formulas assume the member absorbs all the energy; a real impact loses some, so the result is an upper bound.')],
        });
    },
    "thin-ring-load-check": (v) => {
      const I = v.sec === 'round' ? PI * v.d ** 4 / 64 : v.sec === 'rect' ? v.b * v.d ** 3 / 12 : v.Iu, R = v.D / 2, ratio = v.d / v.D;
      if (!(v.d < v.D)) return invalid('The section depth must be smaller than the ring diameter.');
      const S = v.P * v.D * v.d / (4 * PI * I), dv = (PI / 4 - 2 / PI) * v.P * R ** 3 / (v.E * I), dh = (2 / PI - 0.5) * v.P * R ** 3 / (v.E * I), Pallow = 4 * PI * I * v.Sallow / (v.D * v.d);
      const okS = S <= v.Sallow + 1e-9, okD = dv <= v.dMax + 1e-12, ok = okS && okD;
      return output({ I, S, dv, dh, Pallow, ratio }, 'Maximum bending stress (MPa)', S,
        [m('Second moment of area', q(I, 'mm⁴', 4)), m('Maximum bending stress', `${q(S, 'MPa', 4)} against ${q(v.Sallow, 'MPa', 4)}`), m('Diameter along the load: increase', q(dv, 'mm', 4)), m('Diameter across the load: decrease', q(dh, 'mm', 4)), m('Load at the allowable stress', q(Pallow, 'N', 4)), m('Section depth ÷ diameter', q(ratio, '', 3))],
        'Thin ring loaded across a diameter.', 'Thin ring in bending only; handbook formulas for stress and diameter change.', {
          text: ok ? 'RING WITHIN LIMITS' : !okS ? 'RING OVERSTRESSED' : 'RING DEFLECTS TOO MUCH', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(S, 'MPa', 4)} against ${q(v.Sallow, 'MPa', 4)}; the ring takes ${q(Pallow, 'N', 4)} at the allowable stress.`), check('Diameter change', okD ? 'pass' : 'fail', `The loaded diameter grows ${q(dv, 'mm', 4)} against ${q(v.dMax, 'mm', 4)} accepted.`), check('Thin ring', 'verify', `The section depth is ${q(100 * ratio, '%', 1)} of the diameter; the formulas suit thin rings, so check deep sections by curved-beam theory.`)],
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
