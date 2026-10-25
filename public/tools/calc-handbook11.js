// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook11). SI units are explicit at each boundary.
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
    "bolt-stretch": (v) => {
      if (v.Lt > v.grip) return invalid('The threaded length cannot exceed the grip length.');
      const Ad = PI * v.d * v.d / 4, At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, Eb = v.Eb * 1000, kb = 1 / ((v.grip - v.Lt) / (Eb * Ad) + v.Lt / (Eb * At));
      const km = 0.5774 * PI * v.Em * 1000 * v.d / (2 * Math.log(5 * (0.5774 * v.grip + 0.5 * v.d) / (0.5774 * v.grip + 2.5 * v.d)));
      const F = v.F * 1000, db = F / kb, dm = F / km, angle = 360 * (db + dm) / v.P;
      return output({ kb, km, db, dm, angle }, 'Nut turn from snug (°)', angle,
        [m('Bolt stiffness', q(kb / 1000, 'kN/mm', 0)), m('Member stiffness (estimate)', q(km / 1000, 'kN/mm', 0)), m('Bolt elongation', q(db * 1000, 'µm', 1)), m('Member compression', q(dm * 1000, 'µm', 1)), m('Nut turn from snug', q(angle, '°', 1)), m('Bolt stress', q(F / At, 'MPa', 0))],
        'Elastic stretch and nut rotation for the preload.', 'Elastic stiffness; snug point uncertain.', {
          checks: [check('Angle procedure', 'verify', 'Validate turn angles by test on the actual joint.')],
        });
    },
    "bolt-group-eccentric": (v) => {
      const pts = Array.from({ length: v.n }, (_, i) => [v['x' + (i + 1)], v['y' + (i + 1)]]), xc = pts.reduce((s, p) => s + p[0], 0) / v.n, yc = pts.reduce((s, p) => s + p[1], 0) / v.n;
      const J = pts.reduce((s, p) => s + (p[0] - xc) ** 2 + (p[1] - yc) ** 2, 0);
      if (J === 0) return invalid('The bolts must not all be at the same point.');
      const M = (v.lx - xc) * v.Py - (v.ly - yc) * v.Px;
      const rows = pts.map((p, i) => { const fx = v.Px / v.n - M * (p[1] - yc) / J, fy = v.Py / v.n + M * (p[0] - xc) / J; return [i + 1, fx, fy, Math.hypot(fx, fy)]; });
      const crit = rows.reduce((a, b) => (b[3] > a[3] ? b : a)), use = crit[3] / v.cap, ok = use <= 1;
      return output({ xc, yc, M, Fmax: crit[3], use }, 'Maximum bolt force (kN)', crit[3],
        [m('Group centroid', `x ${q(xc, '', 1)}, y ${q(yc, 'mm', 1)}`), m('Moment about centroid', q(M / 1000, 'kN·m', 3)), m('Critical bolt', `Bolt ${crit[0]}`), m('Maximum bolt force', q(crit[3], 'kN', 2)), m('Utilisation', q(100 * use, '%', 1))],
        `Bolt ${crit[0]} carries the most shear.`, 'Elastic method, rigid plate, equal bolts.', {
          text: ok ? 'BOLTS ADEQUATE' : 'BOLT OVERLOADED', tone: ok ? 'good' : 'bad',
          table: tbl('Bolt forces', ['Bolt', 'Fx (kN)', 'Fy (kN)', 'Resultant (kN)'], rows.map((r) => [`Bolt ${r[0]}`, q(r[1], '', 2), q(r[2], '', 2), q(r[3], '', 2)])),
          checks: [check('Critical bolt capacity', ok ? 'pass' : 'fail', `${q(crit[3], 'kN', 2)} against ${q(v.cap, 'kN')}.`), check('Plate and bearing', 'verify', 'Check plate bearing, edge distance and prying separately.')],
        });
    },
    "acme-thread": (v) => {
      const tr = v.system === 'tr', P = tr ? v.P : 1 / v.tpi, unit = tr ? 'mm' : 'in', dg = tr ? 3 : 4;
      let d2, d3, D1, h, ac;
      if (tr) { ac = P <= 1.5 ? 0.15 : P <= 5 ? 0.25 : P <= 12 ? 0.5 : 1; h = 0.5 * P + ac; d2 = v.d - 0.5 * P; d3 = v.d - 2 * h; D1 = v.d - P; }
      else { ac = 0; h = 0.5 * P; d2 = v.d - 0.5 * P; d3 = v.d - P; D1 = v.d - P; }
      if (d3 <= 0) return invalid('The pitch is too coarse for this diameter.');
      const lead = v.starts * P, angle = deg(Math.atan(lead / (PI * d2))), area = PI * d3 * d3 / 4;
      return output({ d2, d3, D1, h, lead, angle, area }, 'Pitch diameter', d2,
        [m('Pitch diameter', q(d2, unit, dg)), m('External minor (root) diameter', q(d3, unit, dg)), m('Internal minor diameter', q(D1, unit, dg)), m('Thread height (external)', q(h, unit, dg)), m('Crest clearance', tr ? q(ac, 'mm', 2) : 'Per class (ASME B1.5)'), m('Lead / lead angle', `${q(lead, unit, dg)} / ${q(angle, '°', 3)}`), m('Root area', q(area, tr ? 'mm²' : 'in²', 4))],
        `Basic dimensions of the ${tr ? 'trapezoidal' : 'Acme'} thread.`, 'Basic profile; class tolerances from the standard.', {
          checks: [check('Thread class', 'verify', 'Apply class allowances and tolerances from the thread standard.')],
        });
    },
    "npt-thread": (v) => {
      const p = 1 / v.n, E0 = v.D - (0.05 * v.D + 1.1) * p, L2 = (0.8 * v.D + 6.8) * p, E2 = E0 + 0.0625 * L2;
      if (E0 <= 0) return invalid('Too few threads per inch for this diameter.');
      return output({ E0, L2, E2, h: 0.8 * p }, 'Pitch diameter at small end E₀ (in)', E0,
        [m('Pitch diameter at small end E₀', `${q(E0, 'in', 5)} (${q(E0 * 25.4, 'mm', 3)})`), m('Effective thread length L₂', `${q(L2, 'in', 4)} (${q(L2 * 25.4, 'mm', 2)})`), m('Pitch diameter at L₂', `${q(E2, 'in', 5)} (${q(E2 * 25.4, 'mm', 3)})`), m('Thread height', `${q(0.8 * p, 'in', 4)} (${q(0.8 * p * 25.4, 'mm', 3)})`), m('Taper', '1 in 16 on diameter (1° 47′ half-angle)')],
        'NPT basic dimensions from the standard formulas.', 'Formula values; tables give L₁ and tolerances.', {
          checks: [check('Gauging', 'verify', 'Check with L₁ ring and plug gauges to ASME B1.20.1.')],
        });
    },
    "differential-indexing": (v) => {
      const gcd = (a, b) => (b ? gcd(b, a % b) : a), set = v.set === 'std' ? [24, 24, 28, 32, 40, 44, 48, 56, 64, 72, 86, 100] : Array.from({ length: 20 }, (_, i) => 24 + 4 * i);
      const circles = [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49];
      const simple = (A) => { const rem = v.ratio % A; if (rem === 0) return { whole: v.ratio / A, holes: 0, circle: 0 }; const c = circles.find((h) => (rem * h) % A === 0); return c ? { whole: Math.floor(v.ratio / A), holes: rem * c / A, circle: c } : null; };
      if (simple(v.divisions)) return output({ A: v.divisions, gears: 'none', simple: true }, 'Approximate number', v.divisions,
        [m('Method', 'Simple indexing is possible: differential gearing not needed'), m('Crank movement', (() => { const s = simple(v.divisions); return s.holes ? `${s.whole} turns + ${s.holes} holes in ${s.circle}` : `${s.whole} turns`; })())],
        'This number can be indexed simply.', 'Standard plates.', { text: 'USE SIMPLE INDEXING', tone: 'good', checks: [check('Simple indexing', 'pass', 'Use the simple indexing tool.')] });
      const found = [];
      for (let dA = 1; dA <= 30; dA++) for (const A of [v.divisions + dA, v.divisions - dA]) {
        if (A < 2) continue; const s = simple(A); if (!s) continue;
        let num = Math.abs(A - v.divisions) * v.ratio, den = A; const g = gcd(num, den); num /= g; den /= g;
        let train = null;
        for (let i = 0; i < set.length && !train; i++) for (let j = 0; j < set.length && !train; j++) if (i !== j && set[i] * den === set[j] * num) train = [set[i], set[j]];
        for (let i = 0; i < set.length && !train; i++) for (let j = 0; j < set.length && !train; j++) for (let k = 0; k < set.length && !train; k++) for (let l = 0; l < set.length && !train; l++) {
          if (new Set([i, j, k, l]).size < 4) continue; if (set[i] * set[k] * den === set[j] * set[l] * num) train = [set[i], set[j], set[k], set[l]];
        }
        if (train) found.push({ A, s, train, same: A > v.divisions, dA });
      }
      found.sort((a, b) => a.train.length - b.train.length || a.dA - b.dA);
      const best = found[0];
      if (!best) return invalid('No approximate number within ±30 gives an exact train with this gear set.');
      const t = best.train, gears = t.length === 2 ? `${t[0]} on the spindle driving ${t[1]} on the worm` : `${t[0]} (spindle) → ${t[1]} : ${t[2]} → ${t[3]} (worm)`;
      const idlers = t.length === 2 ? (best.same ? 'one idler' : 'two idlers') : (best.same ? 'no idler' : 'one idler');
      const crank = best.s.holes ? `${best.s.whole ? best.s.whole + ' turns + ' : ''}${best.s.holes} holes in the ${best.s.circle}-hole circle` : `${best.s.whole} turns`;
      return output({ A: best.A, gears }, 'Approximate number', best.A,
        [m('Approximate number A', String(best.A)), m('Crank movement per division', crank), m('Change gears', gears), m('Plate direction', best.same ? 'Same as crank' : 'Opposite to crank'), m('Idlers', idlers)],
        `Differential indexing for ${v.divisions} using ${best.A}.`, 'Exact gear train from the selected set.', {
          text: 'DIFFERENTIAL INDEXING', tone: 'good',
          checks: [check('Exact ratio', 'pass', 'The gear train gives the exact differential ratio.'), check('Idler arrangement', 'verify', 'Confirm idler positions and plate direction for your dividing head.')],
        });
    },
    "helical-milling": (v) => {
      const lead = PI * v.D / Math.tan(rad(v.beta)), req = lead / v.Lm, set = v.set === 'std' ? [24, 24, 28, 32, 40, 44, 48, 56, 64, 72, 86, 100] : Array.from({ length: 20 }, (_, i) => 24 + 4 * i);
      let best = null;
      for (let i = 0; i < set.length; i++) for (let j = 0; j < set.length; j++) for (let k = 0; k < set.length; k++) for (let l = 0; l < set.length; l++) {
        if (new Set([i, j, k, l]).size < 4) continue; const r = set[j] * set[l] / (set[i] * set[k]), e = Math.abs(r / req - 1);
        if (!best || e < best.e) best = { dr: [set[i], set[k]], dn: [set[j], set[l]], r, e };
      }
      const err = Math.abs(best.r / req - 1) < 1e-12 ? 0 : 100 * (best.r / req - 1), train = `drivers ${best.dr[0]} and ${best.dr[1]}, driven ${best.dn[0]} and ${best.dn[1]}`;
      return output({ lead, req, err, train }, 'Required lead (mm)', lead,
        [m('Required lead', q(lead, 'mm', 2)), m('Table swivel angle', q(v.beta, '°', 2)), m('Required ratio (driven ÷ driver)', q(req, '', 5)), m('Best gear train', train), m('Lead error', q(err, '%', 4))],
        'Lead and gearing for helical milling.', 'Gear fit not checked.', {
          text: err === 0 ? 'EXACT TRAIN FOUND' : 'APPROXIMATE TRAIN', tone: Math.abs(err) < 0.1 ? 'good' : 'warn',
          checks: [check('Lead accuracy', Math.abs(err) < 0.1 ? 'pass' : 'warn', `Lead error ${q(err, '%', 4)}.`), check('Gear fit', 'verify', 'Confirm the gears fit the quadrant.')],
        });
    },
    "thread-infeed": (v) => {
      const ap = v.depth || (v.type === 'ext' ? 0.6134 : 0.5413) * v.P, n = v.passes, start = v.type === 'ext' ? v.d : v.d - 1.0825 * v.P, rows = []; let prev = 0;
      for (let x = 1; x <= n; x++) { const cum = x === 1 ? ap * Math.sqrt(0.3) / Math.sqrt(n - 1) : ap * Math.sqrt(x - 1) / Math.sqrt(n - 1); rows.push([String(x), q(cum - prev, 'mm', 3), q(cum, 'mm', 3), q(v.type === 'ext' ? start - 2 * cum : start + 2 * cum, 'mm', 3)]); if (x === 1) var first = cum; if (x === n) var last = cum - prev; prev = cum; }
      return output({ ap, first, last }, 'Total radial depth (mm)', ap,
        [m('Total radial depth', q(ap, 'mm', 4)), m('First pass infeed', q(first, 'mm', 3)), m('Last pass infeed', q(last, 'mm', 3))],
        `${n} passes to ${q(ap, 'mm', 3)} depth.`, 'Radial infeed schedule; flank infeed not modelled.', {
          table: tbl('Infeed schedule', ['Pass', 'Infeed', 'Cumulative depth', 'X diameter'], rows),
          checks: [check('Last pass infeed', last >= 0.05 ? 'pass' : 'warn', last >= 0.05 ? 'Last pass deep enough to cut cleanly.' : 'Last pass under 0.05 mm: reduce the number of passes.')],
        });
    },
    "planetary-gear": (v) => {
      if ((v.zr - v.zs) <= 0 || (v.zr - v.zs) % 2) return invalid('Ring minus sun teeth must be a positive even number for standard planets.');
      const zp = (v.zr - v.zs) / 2, i = v.mode === 'ring' ? 1 + v.zr / v.zs : v.mode === 'sun' ? 1 + v.zs / v.zr : -v.zr / v.zs;
      const nout = v.nin / i, Tout = v.Tin * Math.abs(i) * v.eff / 100, asm = (v.zs + v.zr) % v.np === 0, fits = (v.zs + zp) * Math.sin(PI / v.np) > zp + 2;
      return output({ zp, i, nout, Tout }, 'Ratio', Math.abs(i),
        [m('Planet teeth', String(zp)), m('Ratio', `${q(Math.abs(i), '', 4)} : 1${i < 0 ? ' (reversing)' : ''}`), m('Output speed', q(nout, 'rpm', 1)), m('Output torque', q(Tout, 'N·m', 1))],
        'Simple planetary stage.', 'Standard gears; equal load sharing.', {
          text: asm && fits ? 'ASSEMBLES' : 'CHECK TOOTH COUNTS', tone: asm && fits ? 'good' : 'bad',
          checks: [check('Equal planet spacing', asm ? 'pass' : 'fail', `(Zs + Zr) ÷ planets = ${q((v.zs + v.zr) / v.np, '', 3)}; it must be a whole number.`), check('Neighbouring planets clear', fits ? 'pass' : 'fail', fits ? 'Planet tips clear each other.' : 'Too many planets: tips would clash.')],
        });
    },
    "profile-shift": (v) => {
      const inv = (a) => Math.tan(a) - a, al = rad(v.alpha), target = 2 * (v.x1 + v.x2) * Math.tan(al) / (v.z1 + v.z2) + inv(al);
      if (target <= 0) return invalid('The shifts are too negative for these tooth counts.');
      let aw = Math.max(0.05, Math.cbrt(3 * target)); for (let k = 0; k < 60; k++) aw -= (inv(aw) - target) / Math.tan(aw) ** 2;
      const a0 = v.m * (v.z1 + v.z2) / 2, awd = a0 * Math.cos(al) / Math.cos(aw), lim = (z) => 1 - z * Math.sin(al) ** 2 / 2, u1 = v.x1 >= lim(v.z1), u2 = v.x2 >= lim(v.z2);
      const dj = v.aAct > 0 ? 2 * (v.aAct - awd) * Math.tan(aw) : null;
      return output({ aw: deg(aw), awd, y: (awd - a0) / v.m, dj }, 'Working centre distance (mm)', awd,
        [m('Working pressure angle', q(deg(aw), '°', 4)), m('Standard centre distance', q(a0, 'mm', 3)), m('Working centre distance', q(awd, 'mm', 4)), m('Centre distance modification y', q((awd - a0) / v.m, '', 4)), m('Minimum shift to avoid undercut', `pinion ${q(lim(v.z1), '', 3)}, gear ${q(lim(v.z2), '', 3)}`), m('Backlash change at actual distance', dj === null ? 'No actual distance entered' : q(dj, 'mm', 4))],
        'Working geometry of the shifted pair.', 'Zero-backlash working distance.', {
          checks: [check('Pinion undercut', u1 ? 'pass' : 'warn', u1 ? 'No undercut.' : `Shift below ${q(lim(v.z1), '', 3)}: the pinion is undercut.`), check('Gear undercut', u2 ? 'pass' : 'warn', u2 ? 'No undercut.' : `Shift below ${q(lim(v.z2), '', 3)}: the gear is undercut.`), check('Tooth tip thickness', 'verify', 'Check tip thickness for large positive shifts.')],
        });
    },
    "contact-ratio": (v) => {
      const inv = (a) => Math.tan(a) - a, al = rad(v.alpha), target = 2 * (v.x1 + v.x2) * Math.tan(al) / (v.z1 + v.z2) + inv(al);
      if (target <= 0) return invalid('The shifts are too negative for these tooth counts.');
      let aw = Math.max(0.05, Math.cbrt(3 * target)); for (let k = 0; k < 60; k++) aw -= (inv(aw) - target) / Math.tan(aw) ** 2;
      const ra1 = v.m * (v.z1 / 2 + 1 + v.x1), ra2 = v.m * (v.z2 / 2 + 1 + v.x2), rb1 = v.m * v.z1 * Math.cos(al) / 2, rb2 = v.m * v.z2 * Math.cos(al) / 2, a = (rb1 + rb2) / Math.cos(aw);
      const L = Math.sqrt(ra1 ** 2 - rb1 ** 2) + Math.sqrt(ra2 ** 2 - rb2 ** 2) - a * Math.sin(aw), pb = PI * v.m * Math.cos(al), eps = L / pb;
      return output({ eps, L, pb, a }, 'Contact ratio', eps,
        [m('Contact ratio', q(eps, '', 3)), m('Length of contact', q(L, 'mm', 3)), m('Base pitch', q(pb, 'mm', 3)), m('Working centre distance', q(a, 'mm', 3)), m('Working pressure angle', q(deg(aw), '°', 3))],
        'Transverse contact ratio of the pair.', 'Standard addendum; tip relief ignored.', {
          checks: [check('Contact ratio', eps >= 1.2 ? 'pass' : eps >= 1 ? 'warn' : 'fail', `ε = ${q(eps, '', 2)}; at least about 1.2 is recommended.`)],
        });
    },
    "dp-spur-gear": (v) => {
      const a = v.system === '20stub' ? 0.8 / v.P : 1 / v.P, b = v.system === '20fd' ? 1.25 / v.P : v.system === '14fd' ? 1.157 / v.P : 1 / v.P;
      const pd1 = v.n1 / v.P, pd2 = v.n2 / v.P, od1 = pd1 + 2 * a, od2 = pd2 + 2 * a, cd = (v.n1 + v.n2) / (2 * v.P);
      const mm = (x) => `${q(x, 'in', 4)} (${q(x * 25.4, 'mm', 2)})`;
      return output({ pd1, pd2, od1, od2, cd }, 'Centre distance (in)', cd,
        [m('Pitch diameters', `${mm(pd1)} / ${mm(pd2)}`), m('Outside diameters', `${mm(od1)} / ${mm(od2)}`), m('Root diameters', `${mm(pd1 - 2 * b)} / ${mm(pd2 - 2 * b)}`), m('Addendum / dedendum', `${q(a, '', 4)} / ${q(b, 'in', 4)}`), m('Whole depth', mm(a + b)), m('Circular pitch / tooth thickness', `${q(PI / v.P, '', 4)} / ${q(PI / (2 * v.P), 'in', 4)}`), m('Centre distance', mm(cd)), m('Equivalent module', q(25.4 / v.P, 'mm', 4))],
        'Standard spur gear dimensions.', 'Standard proportions.', {
          checks: [check('Fine pitch allowance', v.P < 20 ? 'pass' : 'verify', v.P < 20 ? 'Coarse pitch proportions.' : 'Fine pitch: add the clearance allowance from the fine-pitch standard.')],
        });
    },
    "sprocket-diameters": (v) => {
      const pd = v.p / Math.sin(PI / v.N), bottom = pd - v.Dr, odd = v.N % 2 === 1, cal = odd ? pd * Math.cos(PI / (2 * v.N)) - v.Dr : bottom, od = v.p * (0.6 + 1 / Math.tan(PI / v.N));
      return output({ pd, bottom, cal, od }, 'Pitch diameter (mm)', pd,
        [m('Pitch diameter', q(pd, 'mm', 3)), m('Outside diameter (approx.)', q(od, 'mm', 2)), m('Bottom diameter', q(bottom, 'mm', 3)), m(odd ? 'Caliper diameter (odd teeth)' : 'Measurement across bottoms', q(cal, 'mm', 3))],
        'Sprocket diameters for the chain.', 'Approximate outside diameter.', {
          checks: [check('Tooth count', v.N >= 17 ? 'pass' : 'warn', v.N >= 17 ? 'Enough teeth for smooth running.' : 'Fewer than 17 teeth increases chordal action and wear.')],
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
