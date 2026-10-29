// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook75). SI units are explicit at each boundary.
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
    "trepanning-plan": (v) => {
      const Dc = v.D - 2 * v.w;
      if (Dc <= 0) return invalid('The kerf width must be less than half the hole diameter.');
      const n = 1000 * v.vc / (PI * v.D), vm = v.vc * (v.D - v.w) / v.D, Pc = v.kc * v.w * v.f * vm / 60000, Pm = Pc / (v.eta / 100), Tq = Pc * 30000 / (PI * n), t = (v.L + v.clear) / (n * v.f);
      const Vr = PI / 4 * (v.D ** 2 - Dc ** 2) * v.L, Vs = PI / 4 * v.D ** 2 * v.L, core = v.rho * PI / 4 * Dc ** 2 * v.L * 1e-9, value = core * v.price;
      const PcS = v.fD * v.vc * v.D * v.kc / 240000, PmS = PcS / (v.eta / 100), tS = (v.L + v.D / (2 * Math.tan(rad(v.point / 2))) + v.clear) / (n * v.fD), ok = Pm <= v.Pav + 1e-9, okS = PmS <= v.Pav + 1e-9;
      return output({ n, vm, Pc, Pm, Tq, t, Dc, Vr, share: 100 * Vr / Vs, core, value, PcS, PmS, tS }, 'Trepanning motor power (kW)', Pm,
        [m('Spindle speed / mean ring speed', `${q(n, 'rpm', 0)} / ${q(vm, 'm/min', 1)}`), m('Trepanning power at the cutter / motor', `${q(Pc, '', 2)} / ${q(Pm, 'kW', 2)}`), m('Trepanning torque', q(Tq, 'N·m', 1)), m('Trepanning time', q(t, 'min', 2)), m('Volume removed', `${q(Vr / 1000, 'cm³', 1)} (${q(100 * Vr / Vs, '%', 0)} of solid)`), m('Core diameter / mass / value', `${q(Dc, 'mm', 1)} / ${q(core, 'kg', 2)} / ${money(value, 2)}`), m('Solid drill: motor power / time', `${q(PmS, 'kW', 2)} / ${q(tS, 'min', 2)}`)],
        'Trepanning plan with a solid drilling comparison.', 'Unit-power estimate; tool stiffness and chips not checked.', {
          text: ok ? 'TREPANNING FEASIBLE' : 'NOT ENOUGH SPINDLE POWER', tone: ok ? 'good' : 'bad',
          checks: [check('Spindle power, trepanning', ok ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} needed against ${q(v.Pav, 'kW', 1)} available.`), check('Spindle power, solid drill', okS ? 'pass' : 'warn', `${q(PmS, 'kW', 2)} for a solid drill${okS ? ': solid drilling is also possible on this machine.' : ': beyond the machine; trepanning is the way to make this hole.'}`), check('Starting and chips', 'verify', 'Start the cut in a guide bushing or a starting groove, and make sure the coolant can flush the chips out of the kerf.')],
        });
    },
    "grinding-wheel-cost-plan": (v) => {
      if (v.Dmin >= v.D0) return invalid('The discard diameter must be smaller than the new wheel diameter.');
      if (v.s >= v.dw) return invalid('The grinding stock must be smaller than the work diameter.');
      const Vw = PI / 4 * (v.dw ** 2 - (v.dw - v.s) ** 2) * v.Lw, wear = Vw / v.G, Dm = (v.D0 + v.Dmin) / 2, dress = PI * Dm * v.b * v.ad / v.pd, per = wear + dress, usable = PI / 4 * (v.D0 ** 2 - v.Dmin ** 2) * v.b;
      const parts = usable / per, wheelPP = v.price / parts, dLoss = 2 * per / (PI * Dm * v.b), tg = Vw / (v.Qp * v.b) + v.spark, timePP = tg / 3600 * v.rate, cpp = wheelPP + timePP, dressShare = 100 * dress / per, ok = cpp <= v.target + 1e-9;
      return output({ Vw, wear, dress, dressShare, per, usable, parts, wheelPP, dLoss, tg, timePP, cpp }, 'Grinding cost per part (A$)', cpp,
        [m('Stock volume per part', q(Vw, 'mm³', 0)), m('Wheel wear / dressing per part', `${q(wear, '', 1)} / ${q(dress, 'mm³', 1)}`), m('Share of the wheel lost to dressing', q(dressShare, '%', 0)), m('Wheel diameter used per part', q(dLoss * 1000, 'µm', 2)), m('Usable wheel volume', q(usable / 1000, 'cm³', 0)), m('Parts per wheel', q(parts, '', 0)), m('Wheel cost per part', money(wheelPP, 3)), m('Grinding time per part', q(tg, 's', 1)), m('Time cost / total per part', `${money(timePP, 3)} / ${money(cpp, 3)}`)],
        'Grinding wheel cost plan.', 'Constant grinding ratio; full wheel width in contact.', {
          text: ok ? 'WITHIN TARGET COST' : 'ABOVE TARGET COST', tone: ok ? 'good' : 'bad',
          checks: [check('Cost per part', ok ? 'pass' : 'fail', `${money(cpp, 3)} against a target of ${money(v.target, 2)}.`), check('Dressing share', dressShare <= 50 ? 'pass' : 'warn', `${q(dressShare, '%', 0)} of the wheel used per part goes in dressing${dressShare <= 50 ? '.' : ': try lighter or less frequent dressing.'}`), check('Grinding ratio', 'verify', 'Measure the grinding ratio on the job: weigh or measure the wheel and the parts over a run.')],
        });
    },
    "drill-bushing-position-check": (v) => {
      const c = (v.bushUp + v.wear - v.drillLo) / 2000;
      if (c < 0) return invalid('The drill is larger than the bushing bore at these limits: check the deviations.');
      const tilt = 2 * c / v.Lb, e = c + tilt * v.g + v.wander / 1000, err = 2 * e, use = 100 * err / v.T, gr = v.g / v.D;
      if (v.gMax < v.gMin) return invalid('The largest chip gap must not be smaller than the least.');
      const okP = err <= v.T + 1e-9, okG = gr >= v.gMin - 1e-9 && gr <= v.gMax + 1e-9, ok = okP && okG;
      return output({ c, tilt, e, err, use, gr }, 'Position error at the work surface (mm, diameter)', err,
        [m('Largest radial clearance', q(c * 1000, 'µm', 1)), m('Drill tilt in the bushing', q(tilt * 1000, 'mm/m', 2)), m('Offset at the work surface', q(e * 1000, 'µm', 1)), m('Position error as a diameter', q(err, 'mm', 3)), m('Share of the position tolerance', q(use, '%', 0)), m('Chip gap ratio', `${q(gr, '', 2)} × D`)],
        'Drill bushing position check.', 'Clearance and tilt geometry at the start of the hole.', {
          text: ok ? 'BUSHING HOLDS POSITION' : !okP ? 'POSITION ERROR TOO LARGE' : 'CHIP GAP OUTSIDE RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Hole position', okP ? 'pass' : 'fail', `${q(err, 'mm', 3)} against ${q(v.T, 'mm', 3)}${okP ? '.' : ': lengthen the bushing, reduce the gap or use a closer bushing fit.'}`), check('Chip gap', okG ? 'pass' : 'fail', `${q(gr, '', 2)} × D against ${q(v.gMin, '', 2)}–${q(v.gMax, '', 2)} × D.`), check('Jig accuracy', 'verify', 'Add the position error of the bushing in the jig plate and of the part on its locators.')],
        });
    },
    "woodruff-key-check": (v) => {
      if (v.t1 >= v.h) return invalid('The keyseat depth must be less than the key height so that part of the key stands in the hub.');
      if (v.t1 >= v.d / 2) return invalid('The keyseat must be shallower than the shaft radius.');
      const hh = v.h - v.t1, F = 2 * v.T * 1000 / v.d, tau = F / (v.w * v.L), sh = F / (hh * v.L), ss = F / (v.t1 * v.L), Ls = F / (v.w * v.tauA), Lb = F / (hh * v.sigA), tauShaft = v.Kt * 16 * v.T * 1000 / (PI * v.d ** 3);
      const okS = tau <= v.tauA + 1e-9, okB = Math.max(sh, ss) <= v.sigA + 1e-9, okT = tauShaft <= v.tauS + 1e-9, ok = okS && okB && okT;
      return output({ F, tau, sh, ss, Ls, Lb, tauShaft }, 'Highest utilisation', Math.max(tau / v.tauA, Math.max(sh, ss) / v.sigA, tauShaft / v.tauS),
        [m('Force at the shaft surface', q(F, 'N', 0)), m('Key shear stress', q(tau, 'MPa', 1)), m('Bearing stress, hub / shaft', `${q(sh, '', 1)} / ${q(ss, 'MPa', 1)}`), m('Least key length, shear / hub bearing', `${q(Ls, '', 1)} / ${q(Lb, 'mm', 1)}`), m('Shaft torsional stress at the keyseat', q(tauShaft, 'MPa', 1)), m('Governing mode', sh / v.sigA >= tau / v.tauA ? 'Hub bearing' : 'Key shear')],
        'Woodruff key check.', 'Uniform stress over the key length; static torsion.', {
          text: ok ? 'KEY AND SHAFT ADEQUATE' : !okB ? 'BEARING TOO HIGH' : !okS ? 'KEY SHEAR TOO HIGH' : 'SHAFT OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Key shear', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauA, 'MPa', 0)}.`), check('Bearing', okB ? 'pass' : 'fail', `Hub ${q(sh, 'MPa', 1)}, shaft ${q(ss, 'MPa', 1)} against ${q(v.sigA, 'MPa', 0)}${okB ? '.' : ': use a longer key, two keys in line, or a parallel key.'}`), check('Shaft at the keyseat', okT ? 'pass' : 'fail', `${q(tauShaft, 'MPa', 1)} against ${q(v.tauS, 'MPa', 0)}.`)],
        });
    },
    "eyebolt-lift-check": (v) => {
      const r1 = rad(v.a1), r2 = rad(v.a2), sr = Math.sin(r1 + r2);
      if (sr <= 1e-9) return invalid('With both legs vertical the split depends on where the load\'s centre of gravity is: enter angles, or use the sling tension tool.');
      const T1 = v.W * Math.sin(r2) / sr, T2 = v.W * Math.sin(r1) / sr, V1 = T1 * Math.cos(r1), V2 = T2 * Math.cos(r2), Hh = T1 * Math.sin(r1), c1 = v.wll * v.s1 / 100, c2 = v.wll * v.s2 / 100, u1 = c1 > 0 ? T1 / c1 : Infinity, u2 = c2 > 0 ? T2 / c2 : Infinity, eng = v.Le / v.dt, naive = v.W / 2;
      if (!Number.isFinite(u1) || !Number.isFinite(u2)) return invalid('The allowed share at each angle must be above zero.');
      const ok1 = u1 <= 1 + 1e-9, ok2 = u2 <= 1 + 1e-9, okE = eng >= v.eReq - 1e-9, ok = ok1 && ok2 && okE;
      return output({ T1, T2, V1, V2, H: Hh, c1, c2, u1, u2, eng, naive }, 'Highest eyebolt utilisation', Math.max(u1, u2),
        [m('Leg tensions', `${q(T1, '', 1)} / ${q(T2, 'kg', 1)} (${q(T1 * 9.80665 / 1000, '', 2)} / ${q(T2 * 9.80665 / 1000, 'kN', 2)})`), m('Vertical share on each eyebolt', `${q(V1, '', 1)} / ${q(V2, 'kg', 1)}`), m('Sideways pull on each eyebolt', q(Hh, 'kg', 1)), m('Capacity at each angle', `${q(c1, '', 0)} / ${q(c2, 'kg', 0)}`), m('Utilisation, eyebolt 1 / 2', `${q(100 * u1, '', 0)} / ${q(100 * u2, '%', 0)}`), m('Load ÷ number of eyebolts (for comparison)', q(naive, 'kg', 1)), m('Thread engagement', `${q(eng, '', 2)} × d`)],
        'Two-eyebolt lift with unequal legs.', 'Static equilibrium at the hook.', {
          text: ok ? 'EYEBOLTS ADEQUATE' : !(ok1 && ok2) ? 'EYEBOLT OVERLOADED AT ITS ANGLE' : 'THREAD ENGAGEMENT TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Eyebolt 1', ok1 ? 'pass' : 'fail', `${q(T1, 'kg', 0)} against ${q(c1, 'kg', 0)} at ${q(v.a1, '°', 0)}.`), check('Eyebolt 2', ok2 ? 'pass' : 'fail', `${q(T2, 'kg', 0)} against ${q(c2, 'kg', 0)} at ${q(v.a2, '°', 0)}.`), check('Thread engagement', okE ? 'pass' : 'fail', `${q(eng, '', 2)} × d against ${q(v.eReq, '', 2)} × d.`), check('Seating and alignment', 'verify', 'Shouldered eyebolts must be screwed down fully onto the shoulder and the eye aligned with the pull; follow the lifting rules that apply to the site.')],
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
