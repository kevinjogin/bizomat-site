// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook93). SI units are explicit at each boundary.
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
    "spur-gear-profile-checker": (v) => {
      const f = rad(v.phi), cf = Math.cos(f), sf = Math.sin(f), tf = Math.tan(f), cA = v.Nt * v.m * cf / v.DO, ca = v.n * v.m * cf / v.dO;
      if (!(cA < 1 && ca < 1)) return invalid('Each outside diameter must be larger than its base circle diameter z m cos φ.');
      const tA = Math.tan(Math.acos(cA)), ta = Math.tan(Math.acos(ca)), tb = tf - v.Nt / v.n * (tA - tf), tB = tf - v.n / v.Nt * (ta - tf);
      const dP = (t) => v.n * v.m * cf * Math.sqrt(1 + t * t), dG = (t) => v.Nt * v.m * cf * Math.sqrt(1 + t * t), dbP = v.n * v.m * cf, dbG = v.Nt * v.m * cf;
      const below = !(tb > 0 && tB > 0), dc = tb > 0 ? dP(tb) : dbP, Dc = tB > 0 ? dG(tB) : dbG;
      const mf1 = v.Nt * (tA - tB) / (2 * PI), mf2 = v.n * (ta - tb) / (2 * PI), C = (v.n + v.Nt) * v.m / 2;
      const mf3 = (Math.sqrt((v.dO / 2) ** 2 - (dbP / 2) ** 2) + Math.sqrt((v.DO / 2) ** 2 - (dbG / 2) ** 2) - C * sf) / (PI * v.m * cf);
      const tc = ta - 2 * PI / v.n, tC = tA - 2 * PI / v.Nt, td = tb + 2 * PI / v.n, tD = tB + 2 * PI / v.Nt;
      const dL = dP(tc), DL = dG(tC), dH = dP(td), DH = dG(tD), rcMax = (PI / 4 * cf - v.b * sf) / (1 - sf);
      const uc = (v.b - v.rc) / sf + v.rc, limP = 0.5 * v.n * sf, limG = 0.5 * v.Nt * sf, okUP = uc <= limP + 1e-12, okUG = uc <= limG + 1e-12;
      const kTIF = (v.b - v.rc) / Math.sin(2 * f) + v.rc / (2 * cf), te = tf - 4 / v.n * kTIF, tE = tf - 4 / v.Nt * kTIF;
      const dTIF = te > 0 ? dP(te) : dbP, DTIF = tE > 0 ? dG(tE) : dbG, okFP = dTIF < dc, okFG = DTIF < Dc, okR = v.rc <= rcMax + 1e-12, okM = mf1 >= v.mfMin;
      const roll = (t) => (t > 0 ? t : 0) * 180 / PI;
      const R = { e: roll(te), b: roll(tb), c: roll(tc), p: roll(tf), d: roll(td), a: roll(ta) }, G = { e: roll(tE), b: roll(tB), c: roll(tC), p: roll(tf), d: roll(tD), a: roll(tA) };
      const text = below ? 'CONTACT BELOW THE BASE CIRCLE' : !(okFP && okFG) ? 'FILLET INTERFERENCE' : !(okUP && okUG) ? 'INVOLUTE UNDERCUT' : !okR ? 'HOB TIP RADIUS TOO LARGE' : !okM ? 'CONTACT RATIO TOO LOW' : 'PROFILE CHECKS PASS';
      const good = text === 'PROFILE CHECKS PASS', rl = (o) => `${q(o.e, '°', 4)} · ${q(o.b, '°', 4)} · ${q(o.c, '°', 4)} · ${q(o.p, '°', 4)} · ${q(o.d, '°', 4)} · ${q(o.a, '°', 4)}`;
      return output({ A: deg(Math.acos(cA)), a: deg(Math.acos(ca)), tb, tB, dc, Dc, mf1, mf2, mf3, dL, DL, dH, DH, rcMax, uc, limP, limG, te, tE, dTIF, DTIF, Rb: dbP / 2, RB: dbG / 2,
        rollPe: R.e, rollPb: R.b, rollPc: R.c, rollPp: R.p, rollPd: R.d, rollPa: R.a, rollGe: G.e, rollGb: G.b, rollGc: G.c, rollGd: G.d, rollGa: G.a }, 'Contact ratio', mf1,
        [m('Contact diameter: pinion / gear', `${q(dc, 'mm', 5)} / ${q(Dc, 'mm', 5)}`), m('Contact ratio (7a / 7b / 7c)', `${q(mf1, '', 4)} / ${q(mf2, '', 4)} / ${q(mf3, '', 4)}`), m('LPSTC: pinion / gear', `${q(dL, 'mm', 5)} / ${q(DL, 'mm', 5)}`), m('HPSTC: pinion / gear', `${q(dH, 'mm', 5)} / ${q(DH, 'mm', 5)}`), m('TIF diameter: pinion / gear', `${q(dTIF, 'mm', 5)} / ${q(DTIF, 'mm', 5)}`), m('Maximum hob tip radius', `${q(rcMax, '', 4)} ÷ P (${q(rcMax * v.m, 'mm', 4)}) against ${q(v.rc, '', 4)} ÷ P`), m('Undercut test: (b − rc) ÷ sin φ + rc', `${q(uc, '', 5)} against ${q(limP, '', 5)} (pinion) and ${q(limG, '', 5)} (gear)`), m('Base radius: pinion / gear', `${q(dbP / 2, 'mm', 6)} / ${q(dbG / 2, 'mm', 6)}`), m('Pinion roll angles: TIF · contact · LPSTC · pitch · HPSTC · outside', rl(R)), m('Gear roll angles: TIF · contact · LPSTC · pitch · HPSTC · outside', rl(G))],
        'Spur gear profile checker settings.', 'Handbook significant diameters, hob tip radius, undercut limit and profile checker settings.', {
          text, tone: good ? 'good' : 'bad',
          checks: [check('Contact above base circle', below ? 'fail' : 'pass', below ? 'The mating tip reaches below the base circle: the gears interfere.' : 'Contact starts above the base circle on both gears.'), check('Fillet interference', okFP && okFG ? 'pass' : 'fail', `TIF ${q(dTIF, 'mm', 5)} against contact ${q(dc, 'mm', 5)} (pinion); ${q(DTIF, 'mm', 5)} against ${q(Dc, 'mm', 5)} (gear).`), check('Involute undercut', okUP && okUG ? 'pass' : 'fail', `${q(uc, '', 5)} against 0.5 z sin φ = ${q(limP, '', 5)} (pinion) and ${q(limG, '', 5)} (gear).`), check('Hob tip radius', okR ? 'pass' : 'fail', `${q(v.rc, '', 4)} ÷ P against the most the geometry allows, ${q(rcMax, '', 4)} ÷ P.`), check('Contact ratio', okM ? 'pass' : 'fail', `${q(mf1, '', 4)} against ${q(v.mfMin, '', 4)} accepted; the three formulas agree to ${q(Math.max(Math.abs(mf1 - mf2), Math.abs(mf1 - mf3)), '', 2)}.`)],
        });
    },
    "spur-gears-for-given-centre-distance": (v) => {
      if (!(v.phiMin < v.phiMax)) return invalid('The smallest operating pressure angle must be less than the largest.');
      const f = rad(v.phi), Z = v.Np + v.Ng, m1 = 2 * v.C1 / Z, c1 = v.m * Math.cos(f) / m1;
      if (!(c1 < 1)) return invalid(`The centre distance is too small for this hob: it must exceed ${q(Z * v.m * Math.cos(f) / 2, 'mm', 5)}.`);
      const f1 = Math.acos(c1), inv = (x) => Math.tan(x) - x, di = inv(f1) - inv(f), tf = Math.tan(f), t0 = PI * v.m / 2;
      const DP1 = v.Np * m1, DG1 = v.Ng * m1, tP = v.Np * v.m * (PI / (2 * v.Np) + di), tG = v.Ng * v.m * (PI / (2 * v.Ng) + di);
      if (!(tP > 0 && tG > 0)) return invalid('The centre distance is so much below standard that a tooth thickness is not positive.');
      const bP1 = v.bc - (tP - t0) / (2 * tf), bG1 = v.bc - (tG - t0) / (2 * tf), DPR = v.Np * v.m - 2 * bP1, DGR = v.Ng * v.m - 2 * bG1, cl = v.bc - v.m;
      const DPO = 2 * v.C1 - DGR - 2 * cl, DGO = 2 * v.C1 - DPR - 2 * cl, phi1 = deg(f1), ok = phi1 >= v.phiMin && phi1 <= v.phiMax, C = Z * v.m / 2;
      return output({ m1, P1in: 25.4 / m1, phi1, DP1, DG1, DPB: DP1 * c1, DGB: DG1 * c1, t1: PI * m1 / 2, tP, tG, bP1, bG1, DPR, DGR, DPO, DGO, C, dC: v.C1 - C, cl }, 'Operating pressure angle (°)', phi1,
        [m('Operating module / pitch', `${q(m1, 'mm', 5)} (P1 = ${q(25.4 / m1, '', 5)} per inch)`), m('Operating pressure angle φ1', q(phi1, '°', 5)), m('Operating pitch diameters: pinion / gear', `${q(DP1, 'mm', 5)} / ${q(DG1, 'mm', 5)}`), m('Base diameters: pinion / gear', `${q(DP1 * c1, 'mm', 5)} / ${q(DG1 * c1, 'mm', 5)}`), m('Basic tooth thickness at the operating pitch circle', q(PI * m1 / 2, 'mm', 5)), m('Tooth thickness at the standard pitch circle: pinion / gear', `${q(tP, 'mm', 5)} / ${q(tG, 'mm', 5)}`), m('Dedendums: pinion / gear', `${q(bP1, 'mm', 4)} / ${q(bG1, 'mm', 4)}`), m('Root diameters: pinion / gear', `${q(DPR, 'mm', 5)} / ${q(DGR, 'mm', 5)}`), m('Outside diameters: pinion / gear', `${q(DPO, 'mm', 5)} / ${q(DGO, 'mm', 5)}`), m('Standard centre distance / change', `${q(C, 'mm', 5)} / ${q(v.C1 - C, 'mm', 4)}`)],
        'Spur gears cut for a given centre distance and ratio.', 'Handbook procedure for gears of standard pitch at a non-standard centre distance.', {
          text: ok ? 'GEARS FIT THE CENTRE DISTANCE' : 'OPERATING PRESSURE ANGLE OUTSIDE RANGE', tone: ok ? 'good' : 'warn',
          checks: [check('Operating pressure angle', ok ? 'pass' : 'fail', `${q(phi1, '°', 4)} against ${q(v.phiMin, '°', 3)} to ${q(v.phiMax, '°', 3)}${ok ? '.' : ': choose another hob pitch or pressure angle.'}`), check('Tip clearance', cl > 0 ? 'pass' : 'verify', cl > 0 ? `Each tip clears the mating root by bc − m = ${q(cl, 'mm', 4)}.` : 'The hob addendum is not more than one module, so the tips have no clearance.'), check('Backlash', 'verify', 'These thicknesses mesh without backlash; thin the teeth for the backlash you need.'), check('Dedendums', bP1 > 0 && bG1 > 0 ? 'pass' : 'verify', bP1 > 0 && bG1 > 0 ? 'Both roots lie inside the standard pitch circles.' : 'A root lies outside its standard pitch circle: check the tooth tips are not pointed.')],
        });
    },
    "enlarged-spur-pinion-mesh": (v) => {
      const f = rad(v.phi), tf = Math.tan(f), sf = Math.sin(f), p = PI * v.m, t = p / 2 + v.ePin * tf, T = p / 2 - v.eGear * tf;
      if (!(T > 0)) return invalid('The gear reduction leaves no tooth thickness at the pitch circle.');
      const inv = (x) => Math.tan(x) - x, invF = inv(f) + (t + T - p) / ((v.n + v.Nt) * v.m);
      if (!(invF > 0)) return invalid('The tooth thicknesses are too small for the gears to mesh.');
      let lo = 0, hi = PI / 2 - 1e-9; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (inv(mid) < invF) lo = mid; else hi = mid; }
      const f1 = (lo + hi) / 2, C = (v.n + v.Nt) * v.m / 2, C1 = C * Math.cos(f) / Math.cos(f1), dC = C1 - C, dCa = (v.ePin - v.eGear) / 2;
      const DOp = (v.n + 2) * v.m + v.ePin, DOg = (v.Nt + 2) * v.m - v.eGear, aG1 = 1 + v.eGear / (2 * v.m), NgMin = 2 * aG1 / sf ** 2, NpMin = 2 * (v.aH - v.rt * (1 - sf)) / (v.m * sf ** 2);
      const okG = v.Nt >= NgMin - 1e-9, std = Math.abs(dC) <= 1e-9 * C, okP = v.n >= NpMin - 1e-9;
      const text = !okG ? 'GEAR UNDERCUT: USE MORE TEETH' : std ? 'MESH AT THE STANDARD CENTRE DISTANCE' : dC > 0 ? 'INCREASE THE CENTRE DISTANCE' : 'REDUCE THE CENTRE DISTANCE';
      return output({ DOp, DOg, t, T, invT: inv(f), invF, phi1: deg(f1), C, C1, dC, dCa, NgMin, NpMin }, 'Centre distance for no backlash (mm)', C1,
        [m('Outside diameters: pinion / gear', `${q(DOp, 'mm', 5)} / ${q(DOg, 'mm', 5)}`), m('Arc tooth thickness at the standard pitch circle: pinion / gear', `${q(t, 'mm', 5)} / ${q(T, 'mm', 5)} (standard ${q(p / 2, 'mm', 5)})`), m('inv φ / inv φ1', `${q(inv(f), '', 5)} / ${q(invF, '', 5)}`), m('Operating pressure angle φ1', q(deg(f1), '°', 5)), m('Standard / tight-mesh centre distance', `${q(C, 'mm', 6)} / ${q(C1, 'mm', 6)}`), m('Change in centre distance: exact / half the net enlargement', `${q(dC, 'mm', 4)} / ${q(dCa, 'mm', 4)}`), m('Smallest gear teeth without undercut', `${q(NgMin, '', 4)} against ${v.Nt}`), m('Smallest pinion teeth of standard proportions (hob)', `${q(NpMin, '', 4)} against ${v.n}`)],
        'Enlarged spur pinion mesh.', 'Handbook formulas for enlarged pinions, tooth thickness and centre distance for no backlash.', {
          text, tone: okG ? 'good' : 'bad',
          checks: [check('Gear undercut', okG ? 'pass' : 'fail', `${v.Nt} teeth against ${q(NgMin, '', 4)} needed${okG ? '.' : ': use more teeth on the gear or reduce it less.'}`), check('Pinion enlargement', okP || v.ePin > 0 ? 'pass' : 'verify', okP ? `${v.n} teeth of standard proportions are not undercut by this hob (${q(NpMin, '', 4)} needed).` : `A standard pinion needs ${q(NpMin, '', 4)} teeth with this hob; ${v.ePin > 0 ? 'the enlargement allows for this.' : 'enlarge it.'}`), check('Centre distance system', std ? 'pass' : 'verify', std ? 'The gear is reduced by the pinion’s enlargement: standard centre distance and pressure angle.' : `Run at ${q(C1, 'mm', 6)} plus backlash; half the net enlargement gives ${q(C + dCa, 'mm', 6)}.`), check('Backlash', 'verify', 'The centre distance found gives no backlash; add the backlash you need.')],
        });
    },
    "gear-shaving-stock-check": (v) => {
      if (!(v.sMin < v.sMax)) return invalid('The least stock must be less than the most stock.');
      const f = rad(v.phi), t2 = 2 * Math.tan(f) * v.d, C = (v.n + v.Nt) * v.m / 2, f1 = Math.acos(C * Math.cos(f) / (C + v.d)), inv = (x) => Math.tan(x) - x, t2x = (v.n + v.Nt) * v.m * (inv(f1) - inv(f));
      const lo = t2 < v.sMin - 1e-12, hi = t2 > v.sMax + 1e-12;
      return output({ t2, side: t2 / 2, t2x, C, phi1: deg(f1) }, 'Shaving stock on the tooth (mm)', t2,
        [m('Total stock over standard (2 tan φ × d)', q(t2, 'mm', 4)), m('Stock on each side of the tooth', q(t2 / 2, 'mm', 4)), m('Exact involute check', `${q(t2x, 'mm', 4)} (φ1 = ${q(deg(f1), '°', 5)} at ${q(C + v.d, 'mm', 6)})`), m('Allowance wanted', `${q(v.sMin, 'mm', 4)} to ${q(v.sMax, 'mm', 4)}`)],
        'Gear shaving stock check.', 'Handbook centre-distance method for the stock left on preshaved gears.', {
          text: lo ? 'TOO LITTLE STOCK FOR SHAVING' : hi ? 'TOO MUCH STOCK FOR SHAVING' : 'SHAVING STOCK WITHIN ALLOWANCE', tone: lo || hi ? 'bad' : 'good',
          checks: [check('Shaving allowance', lo || hi ? 'fail' : 'pass', `${q(t2, 'mm', 4)} against ${q(v.sMin, 'mm', 4)} to ${q(v.sMax, 'mm', 4)}${lo ? ': the shaving may not clean up the teeth.' : hi ? ': recut the gear thinner before shaving.' : '.'}`), check('Exact relation', 'pass', `The involute relation gives ${q(t2x, 'mm', 4)}, ${q(Math.abs(t2x - t2), 'mm', 2)} from the handbook formula.`), check('Master gear', 'verify', 'Mesh with a gear of standard tooth thickness, without backlash, and average several positions.')],
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
