// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook99). SI units are explicit at each boundary.
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
    "rim-face-arrangement-shims": (v) => {
      const SG = { 1: [-1, 1], 2: [-1, -1], 3: [1, -1], 4: [1, 1], 5: [-1, 1], 6: [-1, -1], 7: [1, -1], 8: [1, 1], 9: [-1, 1], 10: [-1, -1], 11: [1, -1], 12: [1, 1], 13: [-1, 1], 14: [-1, -1], 15: [1, -1], 16: [1, 1] };
      const [sr, sf] = SG[v.arr], vert = v.plane === 'v', rc = vert ? v.r + (v.zero === '12' ? v.sag : -v.sag) : v.r;
      const mv = (x) => rc / (2 * sr) + v.f * x / (sf * v.A);
      const pts = [['Front feet F', v.B], ['Rear feet R', v.C], ...[v.E1, v.E2, v.E3].slice(0, v.nx).map((x, i) => [`Extra feet ${i + 1}`, x])].map(([n, x]) => [n, x, mv(x)]);
      const F = pts[0][2], R = pts[1][2], big = Math.max(...pts.map((p) => Math.abs(p[2]))), within = v.tol > 0 && big <= v.tol + 1e-12;
      const word = (x) => (vert ? (x > 0 ? 'add shims' : x < 0 ? 'remove shims' : 'no change') : (x > 0 ? 'move in the + direction' : x < 0 ? 'move in the − direction' : 'no change'));
      const ext = pts.slice(2).map(([n, x, s]) => m(`${n} (at ${q(x, 'mm', 4)})`, `${q(s, 'mm', 4)} (${word(s)})`));
      return output({ rc, F, R, E1: pts[2]?.[2] ?? 0, E2: pts[3]?.[2] ?? 0, E3: pts[4]?.[2] ?? 0, offset: rc / 2, slope: v.f / v.A, big }, vert ? 'Shim change at the front feet (mm)' : 'Move at the front (mm)', F,
        [m('Front feet F', `${q(F, 'mm', 4)} (${word(F)})`), m('Rear feet R', `${q(R, 'mm', 4)} (${word(R)})`), ...ext, m('Rim reading used', `${q(rc, 'mm', 4)}${vert && v.sag ? ` (sag ${v.zero === '12' ? 'added' : 'subtracted'})` : ''}`), m('Offset at the rim indicator r ÷ 2', q(rc / 2, 'mm', 4)), m('Angularity f ÷ A', `${q(v.f / v.A * 1000, 'mm/m', 4)}`)],
        `Arrangement ${v.arr}, ${vert ? 'vertical' : 'horizontal'} readings.`, 'Handbook rim and face formulas for the chosen indicator arrangement.', {
          text: v.tol > 0 && within ? 'ALIGNED WITHIN TOLERANCE' : vert ? 'CHANGE THE SHIMS' : 'MOVE THE MACHINE', tone: v.tol > 0 && within ? 'good' : 'bad',
          table: tbl('Moves at each foot position', ['Position', 'Distance from rim path (mm)', vert ? 'Shim change (mm)' : 'Move (mm)', 'Action'], pts.map(([n, x, s]) => [n, q(x, '', 4), q(s, '', 4), word(s)])),
          checks: [check('Tolerance', v.tol > 0 ? (within ? 'pass' : 'fail') : 'verify', v.tol > 0 ? `Largest move ${q(big, 'mm', 4)} against your ${q(v.tol, 'mm', 4)}.` : 'No tolerance entered; take a final set of readings after the moves.'), check('Arrangement', 'verify', `Check that the indicators are mounted as in Fig. ${v.arr}a and read after zeroing 180° away.`)],
        });
    },
    "jackbolt-alignment-turns": (v) => {
      const p = v.thr === 'inch' ? 25.4 / v.tpi : v.pitch, nf = Number(v.head), pf = p / nf;
      const tF = v.mF / p, tR = v.mR / p, nF = Math.round(tF * nf), nR = Math.round(tR * nf), gF = nF * pf, gR = nR * pf;
      const dir = (x) => (x > 0 ? '+' : x < 0 ? '−' : '');
      return output({ p, pf, tF, tR, nF, nR, gF, gR, rF: v.mF - gF, rR: v.mR - gR }, 'Turns at the front jackbolt', tF,
        [m('Advance per turn', `${q(p, 'mm', 4)} (${q(p / 25.4, 'in', 4)})`), m(`Advance per flat (${nf} flats)`, `${q(pf, 'mm', 4)} (${q(pf / 25.4, 'in', 4)})`),
          m('Front: turns / nearest flats', `${q(Math.abs(tF), 'turn', 4)} / ${Math.abs(nF)} flats ${dir(nF)}`), m('Rear: turns / nearest flats', `${q(Math.abs(tR), 'turn', 4)} / ${Math.abs(nR)} flats ${dir(nR)}`),
          m('Move given by the flats, front / rear', `${q(gF, 'mm', 4)} / ${q(gR, 'mm', 4)}`), m('Left over, front / rear', `${q(v.mF - gF, 'mm', 4)} / ${q(v.mR - gR, 'mm', 4)}`)],
        `Jackbolt turns for a ${v.thr === 'inch' ? `${q(v.tpi, 'TPI', 4)}` : `${q(v.pitch, 'mm pitch', 4)}`} ${nf === 4 ? 'square' : 'hex'} head.`, 'Handbook jackbolt advance per turn and per flat.', {
          checks: [check('Resolution', Math.max(Math.abs(v.mF - gF), Math.abs(v.mR - gR)) <= pf / 2 + 1e-12 ? 'pass' : 'verify', `One flat moves ${q(pf, 'mm', 4)}; the nearest flat is within half of that.`), check('Final readings', 'verify', 'Take a final set of rim and face readings after the move.')],
        });
    },
    "riveted-joint-strength-by-type": (v) => {
      const Ar = PI * v.d ** 2 / 4, D = v.Dh, td = v.t * v.d * v.Sc, lap = v.type === 'lap1' || v.type === 'lap2', pitch = lap ? v.p : v.P;
      if (!(pitch > D)) return invalid('The pitch must be larger than the rivet hole diameter.');
      if (!lap && !(v.P > 2 * D)) return invalid('The outer pitch must be more than twice the hole diameter.');
      if (v.Dh < v.d) return invalid('The hole diameter cannot be smaller than the rivet diameter.');
      const tear = (k) => (v.P - k * D) * v.t * v.St, modes = {
        lap1: [['Shearing one rivet', Ar * v.Ss], ['Tearing the plate between rivets', (v.p - D) * v.t * v.St], ['Crushing in front of one rivet', td]],
        lap2: [['Shearing two rivets', 2 * Ar * v.Ss], ['Tearing the plate between two rivets', (v.p - D) * v.t * v.St], ['Crushing in front of two rivets', 2 * td]],
        lapc1: [['Tearing at the outer row', tear(1)], ['Tearing at the inner row and shearing the outer rivet', tear(2) + Ar * v.Ss], ['Shearing three rivets', 3 * Ar * v.Ss], ['Crushing in front of three rivets', 3 * td], ['Tearing at the inner row and crushing in front of one outer rivet', tear(2) + td]],
        lapc2: [['Tearing at the outer row', tear(1)], ['Shearing four rivets', 4 * Ar * v.Ss], ['Tearing at the inner row and shearing the outer rivet', tear(1.5) + Ar * v.Ss], ['Crushing in front of four rivets', 4 * td], ['Tearing at the inner row and crushing in front of one rivet', tear(1.5) + td]],
        butt2: [['Tearing at the outer row', tear(1)], ['Shearing two rivets in double shear and one in single shear', 5 * Ar * v.Ss], ['Tearing at the inner row and shearing one outer rivet', tear(2) + Ar * v.Ss], ['Crushing in front of three rivets', 3 * td], ['Tearing at the inner row and crushing in front of one outer rivet', tear(2) + td]],
        butt3: [['Tearing at the outer row', tear(1)], ['Shearing four rivets in double shear and one in single shear', 9 * Ar * v.Ss], ['Tearing at the middle row and shearing one rivet', tear(2) + Ar * v.Ss], ['Crushing in front of four rivets and shearing one rivet', 4 * td + Ar * v.Ss], ['Crushing in front of five rivets', 4 * td + v.d * v.tc * v.Sc]],
      }[v.type];
      const [gov, Lp] = modes.reduce((a, b) => (b[1] < a[1] ? b : a)), solid = pitch * v.t * v.St, eff = Lp / solid * 100, Lseam = Lp * v.Ls / pitch;
      const loadOK = v.Lreq <= 0 || Lseam >= v.Lreq * 1000 - 1e-9, edgeOK = v.e >= 1.5 * v.d - 1e-9;
      return output({ Lp, eff, Lseam, solid, ...Object.fromEntries(modes.map((x, i) => [`m${i + 1}`, x[1]])) }, 'Safe load over the seam (kN)', Lseam / 1000,
        [m('Governing failure', gov), m('Safe load per pitch', q(Lp / 1000, 'kN', 4)), m('Joint efficiency', q(eff, '%', 4)), m('Safe load over the seam', q(Lseam / 1000, 'kN', 4)), m('Solid plate strength per pitch', q(solid / 1000, 'kN', 4))],
        `${{ lap1: 'Single-riveted lap', lap2: 'Double-riveted lap', lapc1: 'Single-riveted lap with inside cover', lapc2: 'Double-riveted lap with inside cover', butt2: 'Double-riveted butt', butt3: 'Triple-riveted butt' }[v.type]} joint, ${q(pitch, 'mm', 4)} pitch.`, 'Handbook riveted joint resistance formulas.', {
          text: v.Lreq > 0 ? (loadOK ? 'JOINT CARRIES THE LOAD' : 'JOINT TOO WEAK FOR THE LOAD') : 'SAFE LOAD WORKED OUT', tone: loadOK ? 'good' : 'bad',
          table: tbl('Resistance per pitch', ['Way of failing', 'Resistance (kN)', 'Share of solid plate (%)'], modes.map(([n, x]) => [n, q(x / 1000, '', 4), q(x / solid * 100, '', 4)])),
          checks: [check('Required load', v.Lreq > 0 ? (loadOK ? 'pass' : 'fail') : 'verify', v.Lreq > 0 ? `${q(Lseam / 1000, 'kN', 4)} safe against ${q(v.Lreq, 'kN', 4)} needed.` : 'No required load entered.'), check('Edge distance', edgeOK ? 'pass' : 'fail', `${q(v.e, 'mm', 4)} against 1.5 d = ${q(1.5 * v.d, 'mm', 4)} to avoid tearing out to the edge.`)],
        });
    },
    "uniform-strength-beam": (v) => {
      const ss = v.cs[0] === 's', c = v.l - v.a, point = v.cs.startsWith('sp');
      if (point && !(v.a > 0 && v.a < v.l)) return invalid('Put the load point between the supports.');
      if (v.x > v.l) return invalid('The point for the section must lie on the beam.');
      const K = v.cs.startsWith('ce') ? 6 * v.l : v.cs.startsWith('cu') ? 3 * v.l : point ? 6 * v.a * c / v.l : 0.75 * v.l, Pn = v.P * 1000;
      const b = v.mode === 'width' ? K * Pn / (v.S * v.h ** 2) : v.b, h = v.mode === 'depth' ? Math.sqrt(K * Pn / (v.S * v.b)) : v.h, Pa = v.S * b * h ** 2 / K, sig = Pn * K / (b * h ** 2);
      const rho = v.cs.startsWith('ce') ? v.x / v.l : v.cs.startsWith('cu') ? (v.x / v.l) ** 2 : point ? (v.x <= v.a ? v.x / v.a : (v.l - v.x) / c) : 4 * v.x * (v.l - v.x) / v.l ** 2;
      const byDepth = v.cs.endsWith('depth'), approx = v.cs === 'ce-approx', hx = byDepth ? h * Math.sqrt(rho) : h, bx = byDepth || approx ? b : b * rho, ok = Pn <= Pa * (1 + 1e-12);
      return output({ K, b, h, Pa, sig, rho, hx, bx }, v.mode === 'load' ? 'Safe load P (kN)' : v.mode === 'depth' ? 'Depth needed h (mm)' : 'Width needed b (mm)', v.mode === 'load' ? Pa / 1000 : v.mode === 'depth' ? h : b,
        [m('Safe load P', q(Pa / 1000, 'kN', 4)), m('Largest section b × h', `${q(b, 'mm', 4)} × ${q(h, 'mm', 4)}`), m('Bending stress under your load', q(sig, 'MPa', 4)),
          m(`Section at ${q(v.x, 'mm', 4)}`, approx ? 'outline not defined (not tapered to a point)' : `${q(bx, 'mm', 4)} wide × ${q(hx, 'mm', 4)} deep`), m('Moment at the point ÷ largest moment', q(rho, '', 4))],
        `${ss ? 'Simply supported' : 'Cantilever'} beam of uniform strength, ${q(v.l, 'mm', 4)} ${ss ? 'span' : 'long'}.`, 'Handbook beams of uniform strength formulas.', {
          text: ok ? 'WITHIN THE SAFE LOAD' : 'OVER THE SAFE LOAD', tone: ok ? 'good' : 'bad',
          checks: [check('Load', ok ? 'pass' : 'fail', `${q(v.P, 'kN', 4)} against the safe load ${q(Pa / 1000, 'kN', 4)}.`), check('End section', 'verify', 'Leave enough section at the zero-moment end to carry the shear and the fixing.')],
        });
    },
    "nose-radius-finish-change": (v) => {
      const k = Math.sqrt(v.r1 / v.r2), Ra2 = v.Ra1 * k, rough = 1.5 * Ra2, geo = v.Ra1 * v.r1 / v.r2, rT = v.Rat > 0 ? v.r1 * (v.Ra1 / v.Rat) ** 2 : 0, ok = v.Rat <= 0 || Ra2 <= v.Rat * (1 + 1e-12);
      return output({ k, Ra2, rough, geo, rT, ratio: 1 / k }, 'Ra with the new nose radius, finishing (µm)', Ra2,
        [m('Ra with the new nose radius, finishing', q(Ra2, 'µm', 4)), m('Ra with the new nose radius, roughing', q(rough, 'µm', 4)), m('Ra1 ÷ Ra2', q(1 / k, '', 4)), m('Ra by the simple geometric rule', q(geo, 'µm', 4)), ...(v.Rat > 0 ? [m('Nose radius for the target Ra', q(rT, 'mm', 4))] : [])],
        `Nose radius ${q(v.r1, 'mm', 4)} to ${q(v.r2, 'mm', 4)}.`, 'Handbook rule of thumb for nose radius and surface finish (machining econometrics).', {
          ...(v.Rat > 0 ? { text: ok ? 'TARGET FINISH REACHED' : 'FINISH ABOVE THE TARGET', tone: ok ? 'good' : 'bad' } : {}),
          checks: [check('Target', v.Rat > 0 ? (ok ? 'pass' : 'fail') : 'verify', v.Rat > 0 ? `${q(Ra2, 'µm', 4)} against ${q(v.Rat, 'µm', 4)}; a ${q(rT, 'mm', 4)} nose radius would reach it.` : 'No target entered.'), check('Same ECT and speed', 'verify', 'The rule compares finishes at the same equivalent chip thickness and cutting speed.')],
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
