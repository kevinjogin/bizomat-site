// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook95). SI units are explicit at each boundary.
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
    "ball-bearing-load-ratings": (v) => {
      const a = rad(v.alpha), thrust = v.type === 'thrust', big = v.D > 25.4, dz = v.Z ** (2 / 3), dd = big ? 3.647 * v.D ** 1.4 : v.D ** 1.8;
      if (thrust ? !(v.alpha > 0) : !(v.alpha < 90)) return invalid(thrust ? 'A thrust bearing needs a contact angle above 0°.' : 'A radial or angular contact bearing needs a contact angle below 90°.');
      const ratio = v.D * (thrust && v.alpha === 90 ? 1 : Math.cos(a)) / v.dm;
      if (!(ratio < 1)) return invalid('The ball diameter must be much smaller than the pitch diameter.');
      let C, Co;
      if (!thrust) { C = v.fc * (v.i * Math.cos(a)) ** 0.7 * dz * dd * v.nb ** 0.7; Co = v.fo * v.i * v.Z * v.D ** 2 * Math.cos(a) * v.nb; }
      else { const one = v.alpha === 90 ? v.fc * dz * dd : v.fc * Math.cos(a) ** 0.7 * dz * dd * Math.tan(a); C = one * v.i ** 0.7; Co = v.fo * v.i * v.Z * v.D ** 2 * Math.sin(a); }
      const L10 = (C / v.P) ** 3, Lh = L10 * 1e6 / (60 * v.n), s0 = v.Po > 0 ? Co / v.Po : Infinity, okL = Lh >= v.Lreq, okS = s0 >= v.s0Min;
      return output({ ratio, C, Co, L10, Lh, s0: Number.isFinite(s0) ? s0 : 0 }, 'Basic dynamic load rating (N)', C,
        [m('D cos α ÷ dm (for reading fc and fo)', q(ratio, '', 4)), m(thrust ? 'Basic dynamic rating Ca' : 'Basic dynamic rating C', q(C, 'N', 4)), m(thrust ? 'Basic static rating Coa' : 'Basic static rating Co', q(Co, 'N', 4)), m('Ball formula used', big ? 'D > 25.4 mm (3.647 fc … D^1.4)' : 'D ≤ 25.4 mm (fc … D^1.8)'), m('Rating life L10', `${q(L10, 'million rev', 4)} (${q(Lh, 'h', 4)})`), m('Static safety Co ÷ Po', Number.isFinite(s0) ? q(s0, '', 3) : 'No static load')],
        'Ball bearing load ratings.', 'AFBMA ball bearing rating formulas as given in the handbook.', {
          text: !okL ? 'LIFE BELOW REQUIRED' : !okS ? 'STATIC LOAD TOO HIGH' : 'RATINGS AND LIFE', tone: okL && okS ? 'good' : 'bad',
          checks: [check('Rating life', okL ? 'pass' : 'fail', `${q(Lh, 'h', 4)} against ${q(v.Lreq, 'h', 4)} required.`), check('Static safety', okS ? 'pass' : 'fail', Number.isFinite(s0) ? `${q(s0, '', 3)} against ${q(v.s0Min, '', 3)} accepted.` : 'No static load entered.'), check('Factors fc and fo', 'verify', `Read them from the handbook tables for the bearing type at D cos α ÷ dm = ${q(ratio, '', 4)}.`)],
        });
    },
    "roller-bearing-load-ratings": (v) => {
      const a = rad(v.alpha), thrust = v.type === 'thrust', ratio = v.D * Math.cos(a) / v.dm;
      if (thrust ? !(v.alpha > 0) : !(v.alpha < 90)) return invalid(thrust ? 'A thrust bearing needs a contact angle above 0°.' : 'A radial roller bearing needs a contact angle below 90°.');
      if (!(ratio < 1)) return invalid('The roller diameter must be much smaller than the pitch diameter.');
      const zd = v.Z ** 0.75 * v.D ** (29 / 27);
      let C, Co;
      if (!thrust) { C = v.fc * (v.i * v.leff * Math.cos(a)) ** (7 / 9) * zd * v.nb ** (7 / 9); Co = 44 * (1 - ratio) * v.i * v.Z * v.leff * v.D * Math.cos(a) * v.nb; }
      else { const one = v.alpha === 90 ? v.fc * v.leff ** (7 / 9) * zd : v.fc * (v.leff * Math.cos(a)) ** (7 / 9) * zd * Math.tan(a); C = one * (v.i * v.nb) ** (7 / 9); Co = 220 * (1 - ratio) * v.Z * v.leff * v.D * Math.sin(a) * v.i * v.nb; }
      const L10 = (C / v.P) ** (10 / 3), Lh = L10 * 1e6 / (60 * v.n), s0 = v.Po > 0 ? Co / v.Po : Infinity, okL = Lh >= v.Lreq, okS = s0 >= v.s0Min, okLen = v.leff <= 2.5 * v.D + 1e-9, okP = v.P <= C / 4 + 1e-9;
      const text = !okL ? 'LIFE BELOW REQUIRED' : !okS ? 'STATIC LOAD TOO HIGH' : !okP ? 'LOAD ABOVE C/4: CONSULT THE BEARING MAKER' : !okLen ? 'LONG ROLLERS: fc WILL BE LOWER' : 'RATINGS AND LIFE';
      return output({ ratio, C, Co, L10, Lh, s0: Number.isFinite(s0) ? s0 : 0, PC: v.P / C }, 'Basic dynamic load rating (N)', C,
        [m('D cos α ÷ dm (for reading fc)', q(ratio, '', 4)), m(thrust ? 'Basic dynamic rating Ca' : 'Basic dynamic rating C', q(C, 'N', 4)), m(thrust ? 'Basic static rating Coa' : 'Basic static rating Co', q(Co, 'N', 4)), m('Rating life L10', `${q(L10, 'million rev', 4)} (${q(Lh, 'h', 4)})`), m('Static safety Co ÷ Po', Number.isFinite(s0) ? q(s0, '', 3) : 'No static load'), m('Load ratio P ÷ C', q(v.P / C, '', 3)), m('Roller length ÷ diameter', q(v.leff / v.D, '', 3))],
        'Roller bearing load ratings.', 'AFBMA roller bearing rating formulas as given in the handbook.', {
          text, tone: !okL || !okS ? 'bad' : okP && okLen ? 'good' : 'warn',
          checks: [check('Rating life', okL ? 'pass' : 'fail', `${q(Lh, 'h', 4)} against ${q(v.Lreq, 'h', 4)} required.`), check('Static safety', okS ? 'pass' : 'fail', Number.isFinite(s0) ? `${q(s0, '', 3)} against ${q(v.s0Min, '', 3)} accepted.` : 'No static load entered.'), check('Load range', okP ? 'pass' : 'warn', `P ÷ C = ${q(v.P / C, '', 3)}; above C/4 to C/2 the rating life formula may not hold.`), check('Roller length', okLen ? 'pass' : 'warn', `leff ÷ D = ${q(v.leff / v.D, '', 3)}; above 2.5 the maker will set a lower fc.`)],
        });
    },
    "disc-spring-fatigue-life": (v) => {
      if (!(v.d < v.D)) return invalid('The inside diameter must be smaller than the outside diameter.');
      if (!(v.smin < v.smax)) return invalid('The deflection at minimum load must be less than at maximum load.');
      if (!(v.smax <= v.h)) return invalid('The maximum deflection cannot exceed the cone height (the disc would be past flat).');
      const dl = v.D / v.d, ln = Math.log(dl), K1 = (1 / PI) * ((dl - 1) / dl) ** 2 / ((dl + 1) / (dl - 1) - 2 / ln), K2 = (6 / PI) * ((dl - 1) / ln - 1) / ln, K3 = (3 / PI) * (dl - 1) / ln;
      const th = Math.atan(2 * v.h / (v.D - v.d)), Da = v.D - 2 * v.t * (Math.sin(th) + Math.cos(th) / 6), k = 4 * v.E / ((1 - v.nu * v.nu) * K1 * Da * Da);
      const at = (s) => ({ F: k * s * ((v.h - s / 2) * (v.h - s) * v.t + v.t ** 3), s0: (3 / PI) * k * v.t * s, s1: k * s * (K2 * (v.h - s / 2) + K3 * v.t), s2: k * s * (K3 * v.t - K2 * (v.h - s / 2)), s3: k * s * ((2 * K3 - K2) * (v.h - s / 2) + K3 * v.t) / dl });
      const lo = at(v.smin), hi = at(v.smax), r2 = hi.s2 - 0.5 * lo.s2, r3 = hi.s3 - 0.5 * lo.s3, use3 = r3 > r2, r = Math.max(r2, r3);
      const g1 = v.t < 1.25, ca = g1 ? 10.29085532 : 10.10734911, cb = g1 ? 0.00542096 : 0.00537616, logN = ca - cb * r, Nraw = 10 ** logN, N = Math.min(Nraw, 2e6), rAllow = (ca - Math.log10(v.Nreq)) / cb;
      const rDd = dl, rht = v.h / v.t, rDt = v.D / v.t, okRatio = rDd >= 1.7 && rDd <= 2.5 && rht >= 0.4 && rht <= 1.3 && rDt >= 18 && rDt <= 40;
      const okC = hi.s0 <= v.s0Max, sT = Math.max(hi.s2, hi.s3), okT = sT <= v.sTMax, okN = Nraw >= v.Nreq;
      const text = !okC ? 'COMPRESSIVE STRESS TOO HIGH' : !okT ? 'TENSILE STRESS TOO HIGH' : !okN ? 'FATIGUE LIFE BELOW REQUIRED' : !okRatio ? 'DIMENSION RATIOS OUTSIDE THE RECOMMENDED RANGE' : 'DISC SPRINGS MEET THE LIFE';
      const life = Nraw >= 2e6 ? '2,000,000 or more (unlimited)' : Nraw < 1e4 ? `${q(Nraw, 'cycles', 3)} (below the 10⁴ range of the equations)` : q(Nraw, 'cycles', 4);
      return output({ th: deg(th), Da, K1, K2, K3, Fmin: lo.F, Fmax: hi.F, s0: -hi.s0, s1: -hi.s1, s2min: lo.s2, s2max: hi.s2, s3min: lo.s3, s3max: hi.s3, r2, r3, r, N, Nraw, rAllow, group: g1 ? 1 : 2, L0: v.ns * (v.t + v.h) }, 'Fatigue life (cycles)', N,
        [m('Cone angle / corrected outside diameter Da', `${q(deg(th), '°', 4)} / ${q(Da, 'mm', 4)}`), m('K1 / K2 / K3', `${q(K1, '', 4)} / ${q(K2, '', 4)} / ${q(K3, '', 4)}`), m('Force at smin / smax (one disc and the stack)', `${q(lo.F, 'N', 4)} / ${q(hi.F, 'N', 4)}`), m('Stack: free length / travel at smin / smax', `${q(v.ns * (v.t + v.h), 'mm', 4)} / ${q(v.ns * v.smin, 'mm', 4)} / ${q(v.ns * v.smax, 'mm', 4)}`), m('Compressive stress at smax: point 0 / point 1', `${q(-hi.s0, 'MPa', 4)} / ${q(-hi.s1, 'MPa', 4)}`), m('Tensile stress point 2: smin / smax', `${q(lo.s2, 'MPa', 4)} / ${q(hi.s2, 'MPa', 4)}`), m('Tensile stress point 3: smin / smax', `${q(lo.s3, 'MPa', 4)} / ${q(hi.s3, 'MPa', 4)}`), m('σmax − 0.5 σmin: point 2 / point 3', `${q(r2, 'MPa', 4)} / ${q(r3, 'MPa', 4)} (point ${use3 ? 3 : 2} governs)`), m(`Fatigue life (Group ${g1 ? 1 : 2})`, life), m('Stress range allowed for the life you need', q(rAllow, 'MPa', 4)), m('Ratios D ÷ d / h ÷ t / D ÷ t', `${q(rDd, '', 3)} / ${q(rht, '', 3)} / ${q(rDt, '', 3)}`)],
        'Disc spring forces, stresses and fatigue life.', 'Handbook method with the corrected outside diameter and the fatigue life equations.', {
          text, tone: !okC || !okT || !okN ? 'bad' : okRatio ? 'good' : 'warn',
          checks: [check('Compressive stress', okC ? 'pass' : 'fail', `Point 0 at maximum deflection ${q(hi.s0, 'MPa', 4)} against ${q(v.s0Max, 'MPa', 4)} accepted.`), check('Tensile stress', okT ? 'pass' : 'fail', `Largest at maximum deflection ${q(sT, 'MPa', 4)} against ${q(v.sTMax, 'MPa', 4)} accepted.`), check('Fatigue life', okN ? 'pass' : 'fail', `${life} against ${q(v.Nreq, 'cycles', 4)} required; the stress range ${q(r, 'MPa', 4)} against ${q(rAllow, 'MPa', 4)} allowed.`), check('Dimension ratios', okRatio ? 'pass' : 'warn', `D ÷ d ${q(rDd, '', 3)} (1.7 to 2.5), h ÷ t ${q(rht, '', 3)} (0.4 to 1.3), D ÷ t ${q(rDt, '', 3)} (18 to 40).`)],
        });
    },
    "thread-wire-involute-helicoid": (v) => {
      const inv = (x) => Math.tan(x) - x, ainv = (y) => { let lo = 1e-9, hi = PI / 2 - 1e-9; for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (inv(mid) < y) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      const Tt = v.P / 2, L = v.P * v.S, h = rad(v.ang);
      const geo = (E) => { const B = Math.atan(L / (PI * E)), An = v.plane === 'normal' ? h : Math.atan(Math.tan(h) * Math.cos(B)), A = v.plane === 'normal' ? Math.atan(Math.tan(h) / Math.cos(B)) : h; return { B, An, A }; };
      const exact = (E, W) => { const { B, An } = geo(E), F = Math.atan(Math.tan(An) / Math.sin(B)), Rb = E / 2 * Math.cos(F), Ta = Tt / Math.tan(B), Hb = Math.atan(Math.cos(F) * Math.tan(PI / 2 - B)), g = Ta / E + inv(F) + W / (2 * Rb * Math.cos(Hb)) - PI / v.S; return { F, Rb, Ta, Hb, g, G: g > 0 ? ainv(g) : NaN, M: g > 0 ? 2 * Rb / Math.cos(ainv(g)) + W : NaN }; };
      const g0 = geo(v.E), Wb = Tt * Math.cos(g0.B) / Math.cos(g0.An), Wu = v.wire === 'best' ? Wb : v.W, M3 = v.E + Wb * (1 + Math.sin(g0.An)), x = exact(v.E, Wu), xb = exact(v.E, Wb);
      if (!(x.g > 0 && xb.g > 0)) return invalid('The wire is too small to reach the flanks for this thread; check the pitch, starts and wire size.');
      const diff = M3 - xb.M, okD = Math.abs(diff) <= v.tol;
      let Em = 0;
      if (v.Mmeas > 0) { let lo = v.E * 0.5, hi = v.E * 1.5; const fM = (E) => exact(E, Wu).M; if (!(fM(lo) < v.Mmeas && fM(hi) > v.Mmeas)) return invalid('The measured reading is too far from the reading for the pitch diameter entered.'); for (let k = 0; k < 200; k++) { const mid = (lo + hi) / 2; if (fM(mid) < v.Mmeas) lo = mid; else hi = mid; } Em = (lo + hi) / 2; }
      return output({ B: deg(g0.B), An: deg(g0.An), A: deg(g0.A), Wb, Wu, M3, M4: x.M, M4b: xb.M, diff, F: deg(x.F), Rb: x.Rb, Ta: x.Ta, Hb: deg(x.Hb), invG: x.g, G: deg(x.G), Em }, 'Measurement over wires, exact (mm)', x.M,
        [m('Lead / lead angle B', `${q(L, 'mm', 5)} / ${q(deg(g0.B), '°', 5)}`), m('Half-angle: normal An / axial A', `${q(deg(g0.An), '°', 5)} / ${q(deg(g0.A), '°', 5)}`), m('Wire of the simplified formula', q(Wb, 'mm', 5)), m('Exact measurement M (involute helicoid)', `${q(x.M, 'mm', 5)} over ${q(Wu, 'mm', 5)} wires`), m('F / Rb / Ta / Hb / G', `${q(deg(x.F), '°', 5)} / ${q(x.Rb, 'mm', 5)} / ${q(x.Ta, 'mm', 5)} / ${q(deg(x.Hb), '°', 5)} / ${q(deg(x.G), '°', 5)}`), m('Simplified formula M (its own wire)', q(M3, 'mm', 5)), m('Simplified − exact, same wire', q(diff, 'mm', 4)), m('Pitch diameter from your reading', v.Mmeas > 0 ? `${q(Em, 'mm', 5)} (${q(Em - v.E, 'mm', 4)} from the entered E)` : 'No reading entered')],
        'Thread measurement over wires by the involute helicoid formula.', 'Buckingham exact involute helicoid formula and simplified formula, as given in the handbook.', {
          text: okD ? 'SIMPLIFIED FORMULA ACCURATE ENOUGH' : 'USE THE EXACT FORMULA', tone: okD ? 'good' : 'warn',
          checks: [check('Simplified formula', okD ? 'pass' : 'warn', `It differs from the exact formula by ${q(diff, 'mm', 4)} against the ${q(v.tol, 'mm', 4)} you need.`), check('Wire contact', 'verify', 'Check that the wires touch the flanks, not the crest or root; use balls if a wire touches one flank at two points.'), check('Wire accuracy', 'verify', 'Any error in the wire diameter is carried straight into M; measure the wires precisely.')],
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
