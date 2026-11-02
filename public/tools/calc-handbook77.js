// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook77). SI units are explicit at each boundary.
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
    "countershaft-bearing-check": (v) => {
      const gears = [{ d: v.d1, x: v.x1, th: rad(v.th1), s: 1 }, { d: v.d2, x: v.x2, th: rad(v.th2), s: -1 }];
      const F = gears.map((g) => { const Ft = 2 * v.T * 1000 / g.d, Fr = Ft * Math.tan(rad(v.phi)); return { Ft, Fr, y: g.s * Ft * -Math.sin(g.th) - Fr * Math.cos(g.th), z: g.s * Ft * Math.cos(g.th) - Fr * Math.sin(g.th), x: g.x }; });
      const RBy = -(F[0].y * F[0].x + F[1].y * F[1].x) / v.L, RBz = -(F[0].z * F[0].x + F[1].z * F[1].x) / v.L, RAy = -(F[0].y + F[1].y) - RBy, RAz = -(F[0].z + F[1].z) - RBz;
      const PA = Math.hypot(RAy, RAz), PB = Math.hypot(RBy, RBz), p = v.btype === 'ball' ? 3 : 10 / 3, life = (P) => P > 0 ? (v.C * 1000 / P) ** p * 1e6 / (60 * v.n) : Infinity, LA = life(PA), LB = life(PB);
      if (!Number.isFinite(LA) || !Number.isFinite(LB)) return invalid('A bearing carries no load in this arrangement: check the gear positions.');
      const at = (xp) => { let my = RAy * xp, mz = RAz * xp; for (const g of F) if (g.x < xp) { my += g.y * (xp - g.x); mz += g.z * (xp - g.x); } return Math.hypot(my, mz); };
      const Mmax = Math.max(...[0, v.L, v.x1, v.x2].map(at)) / 1000, sig = 32 * Mmax * 1000 / (PI * v.ds ** 3), tau = 16 * v.T * 1000 / (PI * v.ds ** 3), vm = Math.sqrt(sig * sig + 3 * tau * tau), s0A = v.C0 * 1000 / PA, s0B = v.C0 * 1000 / PB;
      const okL = Math.min(LA, LB) >= v.Lreq - 1e-9, okS = Math.min(s0A, s0B) >= v.s0req - 1e-9, okT = vm <= v.sA + 1e-9, ok = okL && okS && okT;
      return output({ Ft1: F[0].Ft, Fr1: F[0].Fr, Ft2: F[1].Ft, Fr2: F[1].Fr, PA, PB, LA, LB, s0A, s0B, Mmax, sig, tau, vm }, 'Shorter L10 life (h)', Math.min(LA, LB),
        [m('Driven gear: tangential / radial force', `${q(F[0].Ft, '', 0)} / ${q(F[0].Fr, 'N', 0)}`), m('Driving gear: tangential / radial force', `${q(F[1].Ft, '', 0)} / ${q(F[1].Fr, 'N', 0)}`), m('Bearing loads A / B', `${q(PA, '', 0)} / ${q(PB, 'N', 0)}`), m('L10 life A / B', `${q(LA, '', 0)} / ${q(LB, 'h', 0)}`), m('Static safety factor A / B', `${q(s0A, '', 2)} / ${q(s0B, '', 2)}`), m('Largest bending moment', q(Mmax, 'N·m', 1)), m('Bending / torsional stress', `${q(sig, '', 1)} / ${q(tau, 'MPa', 1)}`), m('Combined stress', q(vm, 'MPa', 1))],
        'Countershaft bearing and shaft check.', 'Spur gears; simply supported shaft; steady torque.', {
          text: ok ? 'SHAFT AND BEARINGS ADEQUATE' : !okL ? 'BEARING LIFE TOO SHORT' : !okS ? 'STATIC LOAD TOO HIGH' : 'SHAFT OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Bearing life', okL ? 'pass' : 'fail', `Shorter life ${q(Math.min(LA, LB), 'h', 0)} against ${q(v.Lreq, 'h', 0)}${okL ? '.' : ': choose a bearing with a higher rating, or move a mesh to reduce the load.'}`), check('Static safety', okS ? 'pass' : 'fail', `Lower factor ${q(Math.min(s0A, s0B), '', 2)} against ${q(v.s0req, '', 2)}.`), check('Shaft stress', okT ? 'pass' : 'fail', `${q(vm, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Fatigue and stress raisers', 'verify', 'Check the shaft in fatigue at keyways and shoulders with the shaft design tools.')],
        });
    },
    "carburizing-case-depth-plan": (v) => {
      const removed = v.stock / 2, before = v.eff + removed, total = before / v.ratio, t = (total / v.K) ** 2, cycle = t + v.extra, cpp = cycle * v.rate / v.parts, share = total / (v.sect / 2), t10 = (total * 1.1 / v.K) ** 2, ok = share <= v.shareMax + 1e-9;
      return output({ removed, before, total, t, cycle, cpp, share, t10 }, 'Time at carburising temperature (h)', t,
        [m('Case removed by grinding (each side)', q(removed, 'mm', 3)), m('Effective case before grinding', q(before, 'mm', 3)), m('Total case to specify', q(total, 'mm', 3)), m('Time at temperature', q(t, 'h', 2)), m('Time for a 10 % deeper case', q(t10, 'h', 2)), m('Furnace cycle', q(cycle, 'h', 2)), m('Cost per part', money(cpp, 2)), m('Case as a share of the half-section', q(100 * share, '%', 0))],
        'Carburising case depth plan.', 'Parabolic case growth at constant temperature.', {
          text: ok ? 'CASE PLAN SUITS THE SECTION' : 'CASE TOO DEEP FOR THE SECTION', tone: ok ? 'good' : 'bad',
          checks: [check('Case against the section', ok ? 'pass' : 'fail', `${q(100 * share, '%', 0)} of the half-section against ${q(100 * v.shareMax, '%', 0)}${ok ? '.' : ': reduce the grinding stock, specify a shallower case, or thicken the section.'}`), check('Case depth factor', 'verify', 'Confirm the factor with the heat treater for this steel, temperature and atmosphere, and check the first loads by sectioning.'), check('Drawing callout', 'verify', 'State effective case, the hardness that defines it and where it is measured, after grinding.')],
        });
    },
    "induction-hardening-plan": (v) => {
      if (v.rMax < v.rMin) return invalid('The largest ratio must not be smaller than the least.');
      const h = v.case * v.hf;
      if (2 * h >= v.D) return invalid('The heated depth is half the diameter or more: this is through heating, not surface hardening.');
      const delta = 503.3 * Math.sqrt(v.rho * 1e-6 / (v.mur * v.f * 1000)) * 1000, ratio = delta / v.case, dT = v.case * (v.rMin + v.rMax) / 2, fT = v.rho * 1e-6 * (503.3 / (dT / 1000)) ** 2 / v.mur / 1000, Dd = v.D / delta;
      const mass = v.dens * PI / 4 * (v.D ** 2 - (v.D - 2 * h) ** 2) * v.Lh * 1e-9, E = mass * v.cp * (v.T1 - v.T0), Pw = E / v.th, Pg = Pw / (v.eff / 100), dens = Pw / (PI * v.D * v.Lh / 100);
      if (v.T1 <= v.T0) return invalid('The hardening temperature must be above the starting temperature.');
      const okR = ratio >= v.rMin - 1e-9 && ratio <= v.rMax + 1e-9, okD = Dd >= v.dMin - 1e-9, ok = okR && okD;
      return output({ delta, ratio, fT, Dd, mass, E, Pw, Pg, dens }, 'Reference depth at the generator frequency (mm)', delta,
        [m('Reference depth', q(delta, 'mm', 3)), m('Reference depth ÷ case depth', q(ratio, '', 2)), m('Frequency for the middle of your range', q(fT, 'kHz', 2)), m('Bar diameter ÷ reference depth', q(Dd, '', 1)), m('Heated layer mass', q(mass, 'kg', 3)), m('Energy to heat the layer', q(E, 'kJ', 1)), m('Power at the work / from the generator', `${q(Pw, '', 1)} / ${q(Pg, 'kW', 1)}`), m('Surface power density', q(dens, 'kW/cm²', 2))],
        'Induction hardening plan.', 'Electromagnetic reference depth; heat to the layer only.', {
          text: ok ? 'FREQUENCY SUITS THE CASE' : !okR ? (ratio > v.rMax ? 'FREQUENCY TOO LOW FOR THE CASE' : 'FREQUENCY TOO HIGH FOR THE CASE') : 'BAR TOO SMALL FOR THE FREQUENCY', tone: ok ? 'good' : 'bad',
          checks: [check('Depth for the case', okR ? 'pass' : 'fail', `Reference depth ${q(ratio, '', 2)} × case against ${q(v.rMin, '', 1)}–${q(v.rMax, '', 1)}${okR ? '.' : `; about ${q(fT, 'kHz', 1)} would suit.`}`), check('Bar size', okD ? 'pass' : 'fail', `Diameter ${q(Dd, '', 1)} × the reference depth against ${q(v.dMin, '', 1)}.`), check('Process trial', 'verify', 'Prove the case depth and hardness on sectioned trial parts before production.')],
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
