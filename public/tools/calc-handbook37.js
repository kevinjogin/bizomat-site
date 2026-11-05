// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook37). SI units are explicit at each boundary.
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
    "fatigue-design-check": (v) => {
      if (v.smax < v.smin) return invalid('The maximum stress must not be below the minimum.');
      if (v.Sy > v.Su) return invalid('The yield strength cannot exceed the tensile strength.');
      const Sep = v.Sep > 0 ? v.Sep : Math.min(0.5 * v.Su, 700), Se = v.ka * v.kb * v.kc * v.kd * v.ke * Sep, a = 0.0254 * Math.pow(2070 / v.Su, 1.8), qn = 1 / (1 + a / v.r), Kf = 1 + qn * (v.Kt - 1);
      const sa = Kf * (v.smax - v.smin) / 2, sm = Kf * (v.smax + v.smin) / 2;
      if (sa === 0 && sm === 0) return invalid('Enter a non-zero stress.');
      const comp = sm <= 0, nG = comp ? Se / sa : 1 / (sa / Se + sm / v.Su), nS = comp ? Se / sa : 1 / (sa / Se + sm / v.Sy);
      const nGb = comp || sa === 0 ? (sa ? Se / sa : v.Su / sm) : 0.5 * (v.Su / sm) ** 2 * (sa / Se) * (-1 + Math.sqrt(1 + (2 * sm * Se / (v.Su * sa)) ** 2)), ny = v.Sy / (sa + Math.abs(sm));
      const sar = sm > 0 ? sa / (1 - sm / v.Su) : sa, infinite = sar <= Se;
      if (Se >= 0.9 * v.Su) return invalid('The corrected endurance limit must be below 0.9 S_u.');
      const A = (0.9 * v.Su) ** 2 / Se, B = -Math.log10(0.9 * v.Su / Se) / 3, Nlife = infinite ? Infinity : Math.pow(sar / A, 1 / B);
      const okF = Math.min(nG, ny) >= v.req, okL = infinite || Nlife >= v.Nreq, ok = infinite ? okF : okL && ny >= 1;
      return output({ Sep, Se, a, q: qn, Kf, sa, sm, nG, nS, nGb, ny, sar, N: infinite ? 0 : Nlife }, 'Goodman safety factor', nG,
        [m('Corrected endurance limit', q(Se, 'MPa', 1)), m('Notch sensitivity / K_f', `${q(qn, '', 3)} / ${q(Kf, '', 3)}`), m('Alternating / mean stress', `${q(sa, '', 1)} / ${q(sm, 'MPa', 1)}`), m('Goodman / Soderberg / Gerber', `${q(nG, '', 2)} / ${q(nS, '', 2)} / ${q(nGb, '', 2)}`), m('Yield safety factor', q(ny, '', 2)), m('Equivalent fully reversed stress', q(sar, 'MPa', 1)), m('Life', infinite ? 'Infinite (below the corrected endurance limit)' : q(Nlife, 'cycles', 0))],
        'Fatigue design check.', 'Estimated correction factors; uniaxial stress.', {
          text: infinite ? (okF ? 'INFINITE LIFE' : 'MARGIN TOO SMALL') : (ok ? 'FINITE LIFE ADEQUATE' : 'FATIGUE FAILURE EXPECTED'), tone: (infinite ? okF : ok) ? 'good' : 'bad',
          checks: [check('Goodman and yield', okF ? 'pass' : 'fail', `Smaller of Goodman ${q(nG, '', 2)} and yield ${q(ny, '', 2)} against ${q(v.req, '', 1)}.`), check('Life', okL ? 'pass' : 'fail', infinite ? 'Below the corrected endurance limit.' : `${q(Nlife, 'cycles', 0)} against ${q(v.Nreq, 'cycles', 0)} required.`), check('Data', 'verify', 'Replace the estimated factors with tested fatigue data where it exists.')],
        });
    },
    "crane-hook-design": (v) => {
      const P = v.W * 1000, ro = v.ri + v.h, rc = v.ri + v.h / 2, rn = v.h / Math.log(ro / v.ri), e = rc - rn, A = v.b * v.h, M = P * rc;
      const si = P / A + M * (rn - v.ri) / (A * e * v.ri), so = P / A - M * (ro - rn) / (A * e * ro), sStraight = P / A + 6 * M / (v.b * v.h * v.h), factor = (si - P / A) / (6 * M / (v.b * v.h * v.h)), siP = si * v.proof;
      const As = PI / 4 * (v.ds - 0.938194 * v.Ps) ** 2, ss = P / As, okW = si <= v.allow, okP = siP <= v.Sy, okS = ss <= v.sA, ok = okW && okP && okS;
      return output({ si, so, e, sStraight, factor, siP, As, ss }, 'Inner fibre stress (MPa)', si,
        [m('Inner / outer fibre stress', `${q(si, '', 1)} / ${q(so, 'MPa', 1)}`), m('Straight-beam inner stress', q(sStraight, 'MPa', 1)), m('Curvature factor (bending)', q(factor, '', 3)), m('Inner stress at the proof load', q(siP, 'MPa', 1)), m('Shank stress area', q(As, 'mm²', 1)), m('Shank tensile stress', q(ss, 'MPa', 1))],
        'Crane hook check.', 'Winkler–Bach curved beam; rectangular section.', {
          text: ok ? 'HOOK ADEQUATE' : 'HOOK NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Working load', okW ? 'pass' : 'fail', `${q(si, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Proof load', okP ? 'pass' : 'fail', `${q(siP, 'MPa', 1)} against yield ${q(v.Sy, 'MPa', 0)}.`), check('Shank', okS ? 'pass' : 'fail', `${q(ss, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Standard', 'verify', 'Rate, mark and proof test the hook to the lifting standard.')],
        });
    },
    "universal-joint-drive": (v) => {
      const w = 2 * PI * v.n1 / 60, c1 = Math.cos(rad(v.b1)), c2 = Math.cos(rad(v.b2)), dbl = v.mode === 'double', N0 = 3600, h = 2 * PI / N0;
      const phi = (th) => Math.atan2(Math.sin(th), Math.cos(th) * c1), psi = (th) => { if (!dbl) return phi(th); const p = phi(th); return v.phase === 'in' ? Math.atan2(Math.sin(p) * c2, Math.cos(p)) : Math.atan2(Math.sin(p), Math.cos(p) * c2); };
      const wrap = (x) => Math.atan2(Math.sin(x), Math.cos(x));
      let rMax = -Infinity, rMin = Infinity, iMax = -Infinity, iMin = Infinity, aO = 0, aI = 0;
      for (let k = 0; k < N0; k++) {
        const th = k * h, d1 = wrap(psi(th + h) - psi(th - h)) / (2 * h), dd = wrap(psi(th + h) - 2 * psi(th) + psi(th - h)) / (h * h), e1 = wrap(phi(th + h) - phi(th - h)) / (2 * h), ee = wrap(phi(th + h) - 2 * phi(th) + phi(th - h)) / (h * h);
        rMax = Math.max(rMax, d1); rMin = Math.min(rMin, d1); iMax = Math.max(iMax, e1); iMin = Math.min(iMin, e1); aO = Math.max(aO, Math.abs(dd) * w * w); aI = Math.max(aI, Math.abs(ee) * w * w);
      }
      const fluct = (rMax - rMin) * 100, fluctI = (iMax - iMin) * 100, TinO = v.Jo * aO, TinI = dbl ? v.Ji * aI : 0, Tpk = v.T1 / iMin + TinI + (dbl ? 0 : TinO);
      const okA = v.b1 <= v.bMax && (!dbl || v.b2 <= v.bMax), cv = dbl && v.phase === 'in' && Math.abs(v.b1 - v.b2) < 1e-9, okT = Tpk <= v.Tr, ok = okA && okT;
      return output({ nmax: v.n1 * rMax, nmin: v.n1 * rMin, fluct, nImax: v.n1 * iMax, nImin: v.n1 * iMin, fluctI, aO, aI, TinO, TinI, Tpk }, 'Output speed fluctuation (%)', fluct,
        [m('Output speed range', `${q(v.n1 * rMin, '', 2)} – ${q(v.n1 * rMax, 'rpm', 2)}`), m('Output fluctuation', q(fluct, '%', 2)), ...(dbl ? [m('Intermediate shaft speed range', `${q(v.n1 * iMin, '', 2)} – ${q(v.n1 * iMax, 'rpm', 2)}`), m('Intermediate shaft acceleration (peak)', q(aI, 'rad/s²', 0))] : []), m('Output acceleration (peak)', q(aO, 'rad/s²', 1)), m('Output inertia torque', q(TinO, 'N·m', 1)), m('Peak joint torque', q(Tpk, 'N·m', 1))],
        dbl ? (cv ? 'Double joint at constant velocity.' : 'Double joint with residual fluctuation.') : 'Single Cardan joint.', 'Rigid shafts and joints.', {
          text: ok ? 'DRIVE ADEQUATE' : 'DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Joint angles', okA ? 'pass' : 'fail', okA ? 'Within your limit.' : `Above the ${q(v.bMax, '°', 0)} limit.`), check('Constant velocity', !dbl ? (v.b1 > 0 ? 'warn' : 'pass') : cv ? 'pass' : 'warn', !dbl ? 'A single joint always fluctuates when angled.' : cv ? 'Equal angles and in-phase yokes cancel the fluctuation.' : 'Unequal angles or out-of-phase yokes leave the output fluctuating.'), check('Joint torque', okT ? 'pass' : 'fail', `${q(Tpk, 'N·m', 0)} against ${q(v.Tr, 'N·m', 0)}.`)],
        });
    },
    "tolerance-stack-design": (v) => {
      if (v.reqMax < v.reqMin) return invalid('The largest gap must not be less than the smallest.');
      let nominal = 0, wc = 0, ss = 0, top = null; const rows = [];
      for (let i = 1; i <= 6; i++) { const dir = v['dir' + i]; if (dir === 'off') continue; const s = dir === 'add' ? 1 : -1, n = v['nom' + i], t = v['tol' + i]; nominal += s * n; wc += t; ss += t * t; rows.push([`Dimension ${i}`, s > 0 ? '+' : '−', q(n, 'mm', 3), `±${q(t, 'mm', 3)}`, t]); if (!top || t > top[1]) top = [i, t]; }
      if (!rows.length) return invalid('Use at least one dimension.');
      const rss = v.inflate * Math.sqrt(ss), sig = Math.sqrt(ss) / (3 * v.Cp);
      const Phi = (z) => { const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2); return z >= 0 ? (1 + y) / 2 : (1 - y) / 2; };
      const rej = sig > 0 ? (Phi((v.reqMin - nominal) / sig) + 1 - Phi((v.reqMax - nominal) / sig)) * 100 : (nominal < v.reqMin || nominal > v.reqMax ? 100 : 0);
      const okW = nominal - wc >= v.reqMin && nominal + wc <= v.reqMax, okR = nominal - rss >= v.reqMin && nominal + rss <= v.reqMax, okJ = rej <= v.rejMax, ok = okR && okJ;
      return output({ nominal, wc, rss, sig, rej, top: top[0] }, 'Nominal gap (mm)', nominal,
        [m('Nominal gap', q(nominal, 'mm', 3)), m('Worst-case range', `${q(nominal - wc, '', 3)} to ${q(nominal + wc, 'mm', 3)}`), m('RSS range', `${q(nominal - rss, '', 3)} to ${q(nominal + rss, 'mm', 3)}`), m('Gap standard deviation', q(sig, 'mm', 4)), m('Predicted rejects', q(rej, '%', 4)), m('Largest contributor', `Dimension ${top[0]} (±${q(top[1], 'mm', 3)})`)],
        'Tolerance stack design.', 'Linear stack; centred normal processes.', {
          text: ok ? (okW ? 'STACK MEETS WORST CASE' : 'STACK MEETS STATISTICALLY') : 'STACK FAILS', tone: ok ? 'good' : 'bad',
          table: tbl('Stack', ['Dimension', 'Sign', 'Nominal', 'Tolerance'], rows.map((r) => r.slice(0, 4))),
          checks: [check('Worst case', okW ? 'pass' : 'warn', okW ? 'Every assembly fits, whatever the parts.' : 'Worst-case parts can fall outside the gap.'), check('RSS', okR ? 'pass' : 'fail', `RSS range ${q(nominal - rss, '', 3)} to ${q(nominal + rss, 'mm', 3)} against ${q(v.reqMin, '', 3)} to ${q(v.reqMax, 'mm', 3)}.`), check('Predicted rejects', okJ ? 'pass' : 'fail', `${q(rej, '%', 4)} against ${q(v.rejMax, '%', 2)}.`)],
        });
    },
    "leaf-spring-design": (v) => {
      const E = v.E * 1000, nS = 3 * v.F * v.L / (2 * v.b * v.t * v.t * v.allow), nD = 3 * v.F * v.L ** 3 / (8 * E * v.b * v.t ** 3 * v.dMax), nReq = Math.ceil(Math.max(nS, nD) - 1e-9);
      const sigma = 3 * v.F * v.L / (2 * v.n * v.b * v.t * v.t), defl = 3 * v.F * v.L ** 3 / (8 * v.n * E * v.b * v.t ** 3), k = v.F / defl, okS = sigma <= v.allow, okD = defl <= v.dMax, ok = okS && okD;
      return output({ nS, nD, nReq, sigma, defl, k }, 'Leaves needed', nReq,
        [m('Leaves for stress', q(nS, '', 2)), m('Leaves for deflection', q(nD, '', 2)), m('Leaves needed', q(nReq, '', 0)), m('Stress with the leaves chosen', q(sigma, 'MPa', 1)), m('Deflection with the leaves chosen', q(defl, 'mm', 1)), m('Rate', q(k, 'N/mm', 1))],
        'Semi-elliptic leaf spring design.', 'Graduated leaves; no inter-leaf friction.', {
          text: ok ? 'SPRING ADEQUATE' : 'SPRING NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Stress', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Deflection', okD ? 'pass' : 'fail', `${q(defl, 'mm', 1)} against ${q(v.dMax, 'mm', 0)}.`), check('Leaf count', v.n >= nReq ? 'pass' : 'fail', `${q(v.n, '', 0)} chosen against ${q(nReq, '', 0)} needed.`)],
        });
    },
    "lathe-threading-plan": (v) => {
      const ap = (v.type === 'ext' ? 0.6134 : 0.5413) * v.P, n = v.passes, first = ap * Math.sqrt(0.3) / Math.sqrt(n - 1), last = ap - (n === 2 ? first : ap * Math.sqrt(n - 2) / Math.sqrt(n - 1));
      const n0 = 1000 * v.vc / (PI * v.d), nF = v.vfMax / v.P, rpm = Math.min(n0, v.nmax, nF), lim = rpm === n0 ? 'cutting speed' : rpm === v.nmax ? 'machine maximum speed' : 'axial feed rate', vcA = PI * v.d * rpm / 1000;
      const t = (n + v.spring) * (v.L + v.appr) / (v.P * rpm), okA = first <= v.aMax, okB = last >= v.aMin, ok = okA && okB;
      return output({ ap, first, last, n: rpm, vcA, vf: rpm * v.P, t }, 'Threading time (min)', t,
        [m('Total radial depth', q(ap, 'mm', 4)), m('First / last pass infeed', `${q(first, '', 3)} / ${q(last, 'mm', 3)}`), m('Spindle speed', `${q(rpm, 'rpm', 0)} (set by the ${lim})`), m('Actual cutting speed', q(vcA, 'm/min', 0)), m('Axial feed rate', q(rpm * v.P, 'mm/min', 0)), m('Threading time', `${q(t, 'min', 3)} (${q(t * 60, 's', 1)})`)],
        'Lathe threading plan.', 'Constant-area infeed; basic metric depth.', {
          text: ok ? 'PLAN FEASIBLE' : 'CHANGE THE PASS COUNT', tone: ok ? 'good' : 'bad',
          checks: [check('First pass', okA ? 'pass' : 'fail', okA ? `${q(first, 'mm', 3)} within ${q(v.aMax, 'mm', 2)}.` : `${q(first, 'mm', 3)} exceeds ${q(v.aMax, 'mm', 2)}: add passes.`), check('Last pass', okB ? 'pass' : 'fail', okB ? `${q(last, 'mm', 3)} at or above ${q(v.aMin, 'mm', 2)}.` : `${q(last, 'mm', 3)} is below ${q(v.aMin, 'mm', 2)}: use fewer passes.`), check('Run-in', v.appr >= 3 * v.P ? 'pass' : 'warn', v.appr >= 3 * v.P ? 'Run-in at least three pitches.' : 'Short run-in: the first threads may be cut before the axis is synchronised.')],
        });
    },
    "clevis-pin-joint": (v) => {
      if (2 * v.R <= v.d) return invalid('The edge distance must exceed the pin radius.');
      const F = v.F * 1000, M = F * (v.a + 2 * v.bf + 4 * v.g) / 8, sb = 32 * M / (PI * v.d ** 3), tau = F / (2 * PI * v.d * v.d / 4), be = F / (v.d * v.a), bfk = F / (2 * v.d * v.bf), st = F / ((2 * v.R - v.d) * v.a), tt = F / (2 * v.a * (v.R - v.d / 2));
      const us = [sb / v.sbA, tau / v.tpA, be / v.bA, bfk / v.bA, st / v.stA, tt / v.tA].map((x) => x * 100), umax = Math.max(...us), ok = umax <= 100;
      const names = ['Pin bending', 'Pin shear', 'Eye bearing', 'Fork bearing', 'Eye net tension', 'Eye tear-out'], vals = [sb, tau, be, bfk, st, tt], alls = [v.sbA, v.tpA, v.bA, v.bA, v.stA, v.tA];
      return output({ M, sb, tau, be, bfk, st, tt, umax }, 'Highest utilisation (%)', umax,
        [m('Pin bending moment', q(M / 1000, 'N·m', 1)), ...names.map((n, k) => m(n, `${q(vals[k], 'MPa', 1)} (${q(us[k], '%', 0)})`))],
        'Clevis pin joint check.', 'Spread bearing loads; static.', {
          text: ok ? 'PIN JOINT ADEQUATE' : 'PIN JOINT OVERSTRESSED', tone: ok ? 'good' : 'bad',
          table: tbl('Checks', ['Check', 'Stress', 'Allowable', 'Utilisation'], names.map((n, k) => [n, q(vals[k], 'MPa', 1), q(alls[k], 'MPa', 0), q(us[k], '%', 0)])),
          checks: names.map((n, k) => check(n, us[k] <= 100 ? 'pass' : 'fail', `${q(us[k], '%', 0)} of allowable.`)),
        });
    },
    "o-ring-groove-design": (v) => {
      if (v.sqHi <= v.sqLo) return invalid('The largest squeeze must exceed the smallest.');
      const piston = v.gland === 'piston', od = v.id + 2 * v.cs, stretch = piston ? (v.gd - v.id) / v.id : -(od - v.gd) / od, cs2 = stretch > 0 ? v.cs / Math.sqrt(1 + stretch) : v.cs;
      const dDes = cs2 * (1 - v.sqT / 100), wDes = PI * cs2 * cs2 / 4 / (dDes * v.fillT / 100), depth = v.depth || dDes, width = v.width || wDes, mate = piston ? v.gd + 2 * depth : v.gd - 2 * depth;
      const squeeze = 100 * (cs2 - depth) / cs2, fill = 100 * (PI * cs2 * cs2 / 4) / (depth * width);
      const okQ = squeeze >= v.sqLo && squeeze <= v.sqHi, okF = fill <= v.fillMax, okS = piston ? stretch >= 0 && stretch * 100 <= v.stMax : stretch <= 0 && -stretch * 100 <= v.stMax, okG = v.gap <= v.gapMax, ok = okQ && okF && okS && okG;
      return output({ stretch: stretch * 100, cs2, dDes, wDes, depth, width, mate, squeeze, fill }, 'Squeeze at the chosen groove (%)', squeeze,
        [m(piston ? 'Stretch on the groove' : 'Diametral compression in the groove', q(Math.abs(stretch) * 100, '%', 2)), m('Stretched cross-section', q(cs2, 'mm', 3)), m('Design depth / width', `${q(dDes, '', 3)} / ${q(wDes, 'mm', 3)}`), m(piston ? 'Mating bore' : 'Mating rod', q(mate, 'mm', 3)), m('Squeeze at the chosen groove', q(squeeze, '%', 1)), m('Fill at the chosen groove', q(fill, '%', 1))],
        'O-ring groove design.', 'Nominal dimensions.', {
          text: ok ? 'GROOVE ADEQUATE' : 'REVISE THE GROOVE', tone: ok ? 'good' : 'bad',
          checks: [check('Squeeze', okQ ? 'pass' : 'fail', `${q(squeeze, '%', 1)} against ${q(v.sqLo, '', 0)}–${q(v.sqHi, '%', 0)}.`), check('Fill', okF ? 'pass' : 'fail', `${q(fill, '%', 1)} against ${q(v.fillMax, '%', 0)}.`), check(piston ? 'Stretch' : 'Compression', okS ? 'pass' : 'fail', piston ? (stretch < 0 ? 'The ring is smaller than the groove diameter would need: it cannot be fitted under tension.' : `${q(stretch * 100, '%', 2)} against ${q(v.stMax, '%', 1)}.`) : (stretch > 0 ? 'The ring is too small for the groove: it would not touch the groove bottom.' : `${q(-stretch * 100, '%', 2)} against ${q(v.stMax, '%', 1)}.`)), check('Extrusion gap', okG ? 'pass' : 'fail', okG ? `${q(v.gap, 'mm', 2)} within ${q(v.gapMax, 'mm', 2)}.` : 'Gap too large for the pressure: tighten the fit or add a back-up ring.')],
        });
    },
    "flywheel-rim-design": (v) => {
      const w = 2 * PI * v.n / 60, I = v.dE * 1000 / (w * w * v.Cs), Ro = v.Do / 2000, k = v.rho * PI * (v.b / 1000) / 2, Ri4 = Ro ** 4 - I / k;
      if (Ri4 < 0) return invalid('Even a solid disc of this diameter and width cannot store enough energy: increase the diameter or width.');
      const Ri = Math.pow(Ri4, 0.25), mass = 2 * k * (Ro * Ro - Ri * Ri), nmax = v.n * (1 + v.Cs / 2), nmin = v.n * (1 - v.Cs / 2), wx = 2 * PI * nmax / 60, wn = 2 * PI * nmin / 60, dEc = I * (wx * wx - wn * wn) / 2;
      const smax = (Ri > 0 ? (3 + v.nu) / 4 * v.rho * wx * wx * (Ro * Ro + (1 - v.nu) / (3 + v.nu) * Ri * Ri) : (3 + v.nu) / 8 * v.rho * wx * wx * Ro * Ro) / 1e6, sf = v.Sy / smax, vr = wx * Ro, okS = sf >= v.req, okV = vr <= v.vMax, ok = okS && okV;
      return output({ I, Di: 2 * Ri * 1000, mass, nmax, nmin, dEc: dEc / 1000, smax, sf, vr }, 'Inertia needed (kg·m²)', I,
        [m('Inertia needed', q(I, 'kg·m²', 2)), m('Inner diameter for that inertia', q(2 * Ri * 1000, 'mm', 1)), m('Mass', q(mass, 'kg', 1)), m('Speed range', `${q(nmin, '', 1)} – ${q(nmax, 'rpm', 1)}`), m('Rim speed at top speed', q(vr, 'm/s', 1)), m('Largest rotating stress', q(smax, 'MPa', 2)), m('Safety factor', q(sf, '', 1))],
        'Flywheel rim design.', 'Plain annular disc.', {
          text: ok ? 'FLYWHEEL ADEQUATE' : 'FLYWHEEL NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Rotating stress', okS ? 'pass' : 'fail', `Safety factor ${q(sf, '', 1)} against ${q(v.req, '', 1)}.`), check('Rim speed', okV ? 'pass' : 'fail', `${q(vr, 'm/s', 1)} against ${q(v.vMax, 'm/s', 0)}.`), check('Guarding', 'verify', 'Guard the flywheel and check the hub fixing for the starting and braking torques.')],
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
