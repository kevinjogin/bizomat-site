// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook46). SI units are explicit at each boundary.
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
    "tank-calibration-chart": (v) => {
      const r = v.D / 2; if (v.h > v.D) return invalid('The liquid depth cannot exceed the diameter.');
      const kh = { ell: 0.5, hemi: 1, flat: 0 }[v.head], shellA = (h) => r * r * Math.acos((r - h) / r) - (r - h) * Math.sqrt(Math.max(0, 2 * r * h - h * h)), heads = (h) => kh * PI * h * h * (3 * r - h) / 3, vol = (h) => (shellA(h) * v.L + heads(h)) / 1e6;
      const Vs = shellA(v.h) * v.L / 1e6, Vh = heads(v.h) / 1e6, V = Vs + Vh, full = vol(v.D), pct = V / full * 100, mass = V / 1000 * v.rho, tFill = (full - V) / v.Qp;
      const rows = Array.from({ length: 11 }, (_, k) => { const h = v.D * k / 10, vv = vol(h); return [q(h, 'mm', 0), q(vv, 'L', 1), q(vv / full * 100, '%', 1)]; });
      return output({ Vs, Vh, V, full, pct, mass, tFill, headFull: heads(v.D) / 1e6 }, 'Liquid volume (L)', V,
        [m('Volume in the shell', q(Vs, 'L', 1)), m('Volume in the heads', q(Vh, 'L', 1)), m('Total at this dip', q(V, 'L', 1)), m('Full capacity', q(full, 'L', 1)), m('Percentage full', q(pct, '%', 1)), m('Liquid mass', q(mass, 'kg', 0)), m('Time to fill the rest', q(tFill, 'min', 1))],
        'Horizontal tank contents.', 'Level tank; inside dimensions.', {
          table: tbl('Calibration chart', ['Depth', 'Volume', 'Full'], rows),
          checks: [check('Tank level', 'verify', 'Check the tank is level, or correct the chart for its slope.')],
        });
    },
    "guillotine-shear-check": (v) => {
      const inc = v.blades === 'inclined', F = inc ? v.n * v.k * v.UTS * v.eps * v.T * v.T / Math.tan(rad(v.alpha)) : v.tau * v.b * v.T, FM = 1.3 * F, E = v.tau * v.b * v.T * v.eps * v.T / 1000, P = E * v.cpm / 60 / (v.eta / 100) / 1000;
      const Tmax = inc ? Math.sqrt(v.cap * 1000 * Math.tan(rad(v.alpha)) / (1.3 * v.n * v.k * v.UTS * v.eps)) : v.cap * 1000 / (1.3 * v.tau * v.b), okF = FM / 1000 <= v.cap, okP = P <= v.Pm, okW = v.b <= v.blade, ok = okF && okP && okW;
      return output({ F, FM, E, P, Tmax }, 'Machine force (kN)', FM / 1000,
        [m('Shearing force', q(F / 1000, 'kN', 2)), m('Machine force (× 1.3)', q(FM / 1000, 'kN', 2)), m('Utilisation of capacity', q(FM / 1000 / v.cap * 100, '%', 0)), m('Energy per cut', q(E, 'J', 0)), m('Motor power at the stroke rate', q(P, 'kW', 2)), m('Thickest sheet at capacity', q(Tmax, 'mm', 2))],
        'Guillotine shear check.', 'Handbook approximate formulas.', {
          text: ok ? 'SHEAR CAN CUT IT' : 'SHEAR CANNOT CUT IT', tone: ok ? 'good' : 'bad',
          checks: [check('Force', okF ? 'pass' : 'fail', `${q(FM / 1000, 'kN', 1)} against ${q(v.cap, 'kN', 0)}.`), check('Power', okP ? 'pass' : 'fail', `${q(P, 'kW', 2)} against ${q(v.Pm, 'kW', 1)}.`), check('Width', okW ? 'pass' : 'fail', `${q(v.b, 'mm', 0)} against a ${q(v.blade, 'mm', 0)} blade.`), check('Blade clearance', 'verify', 'Set blade clearance for the thickness (typically a few percent of the thickness).')],
        });
    },
    "machine-axis-error-budget": (v) => {
      const abbe = v.offset * Math.tan(rad(v.tilt / 3600)) * 1000, therm = v.Ls / 1000 * v.alpha * v.dT * (1 - v.comp / 100), parts = [['Positioning accuracy', v.acc], ['Repeatability', v.rep], ['Abbe error', abbe], ['Thermal growth', therm], ['Fixture and set-up', v.fix]];
      const wc = parts.reduce((s, [, e]) => s + e, 0), rss = Math.sqrt(parts.reduce((s, [, e]) => s + e * e, 0)), allow = v.tol * 1000 * v.share / 100, top = parts.reduce((a, b) => (b[1] > a[1] ? b : a))[0], okR = rss <= allow, okW = wc <= allow, ok = okR;
      return output({ abbe, therm, wc, rss, allow, top }, 'RSS error (µm)', rss,
        [...parts.map(([n, e]) => m(n, q(e, 'µm', 2))), m('Worst-case total', q(wc, 'µm', 2)), m('Root-sum-square total', q(rss, 'µm', 2)), m('Allowed for the machine', q(allow, 'µm', 1)), m('Largest source', top)],
        'Machine axis error budget.', 'Independent errors for RSS.', {
          text: ok ? (okW ? 'CAPABLE WORST CASE' : 'CAPABLE STATISTICALLY') : 'NOT CAPABLE', tone: ok ? 'good' : 'bad',
          table: tbl('Error budget', ['Source', 'Error', 'Share of RSS²'], parts.map(([n, e]) => [n, q(e, 'µm', 2), q(Math.round(e * e / (rss * rss) * 1000) / 10, '%', 1)])),
          checks: [check('RSS', okR ? 'pass' : 'fail', `${q(rss, 'µm', 1)} against ${q(allow, 'µm', 1)}.`), check('Worst case', okW ? 'pass' : 'warn', `${q(wc, 'µm', 1)} against ${q(allow, 'µm', 1)}.`)],
        });
    },
    "plastic-gear-drive-check": (v) => {
      if (v.type === 'bevel' && v.C <= v.F) return invalid('The cone distance must exceed the face width.');
      const V = PI * v.d1 * v.rpm / 60000, base = v.F * v.Y * v.m * v.Ss * V, kW = v.type === 'helical' ? base / (179 * (5.56 + V) * v.Cs) : v.type === 'bevel' ? base * (v.C - v.F) / (327 * (3.05 + V) * v.Cs * v.C) : base / (327 * (3.05 + V) * v.Cs), W = kW * 1000;
      const a = (v.d1 + v.d2) / 2, gGrow = a * (v.ap * 1e-6 * v.dT + v.swell / 100), hGrow = a * v.am * 1e-6 * v.dT, dj = -2 * Math.tan(rad(v.alpha)) * (gGrow - hGrow), jHot = v.j0 + dj;
      const okP = W >= v.Preq, okJ = jHot >= v.jMin, ok = okP && okJ;
      return output({ V, kW, W, a, gGrow, hGrow, dj, jHot }, 'Backlash in service (mm)', jHot,
        [m('Pitch-line velocity', q(V, 'm/s', 3)), m('Power rating', q(W, 'W', 1)), m('Centre distance', q(a, 'mm', 2)), m('Gear growth / housing growth', `${q(gGrow, '', 4)} / ${q(hGrow, 'mm', 4)}`), m('Change in backlash', q(dj, 'mm', 4)), m('Backlash in service', q(jHot, 'mm', 3))],
        'Plastic gear drive check.', 'Handbook rating; uniform temperature.', {
          text: ok ? 'DRIVE ADEQUATE' : 'DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Power rating', okP ? 'pass' : 'fail', `${q(W, 'W', 0)} against ${q(v.Preq, 'W', 0)}.`), check('Backlash', okJ ? 'pass' : 'fail', okJ ? `${q(jHot, 'mm', 3)} left hot and wet.` : `${q(jHot, 'mm', 3)} left: the mesh may bind; increase the assembly backlash or the centre distance.`)],
        });
    },
    "set-screw-hub-check": (v) => {
      const Din = v.D / 25.4, din = v.d / 25.4, hp = Din * v.rpm * din ** 2.3 / 50, kW1 = hp * 0.7457, Tlbin = 1250 * Din * din ** 2.3, T1 = Tlbin * 0.112985, Fh = Tlbin / (Din / 2) * 4.448222;
      const Treq = v.P * 1000 / (2 * PI * v.rpm / 60) * v.SF, nReq = Math.max(Math.ceil(Treq / T1 - 1e-9), 1), Tcap = T1 * v.n, Fcap = Fh * v.n, okT = Tcap >= Treq, okA = Fcap >= v.Fax * v.SF, ok = okT && okA;
      return output({ hp, kW1, T1, Fh, Treq, nReq, Tcap, Fcap }, 'Torque capacity of the screws fitted (N·m)', Tcap,
        [m('Power per screw', q(kW1, 'kW', 3)), m('Torque per screw', q(T1, 'N·m', 2)), m('Holding force per screw', q(Fh, 'N', 0)), m('Torque needed with factor', q(Treq, 'N·m', 2)), m('Screws needed', q(nReq, '', 0)), m('Torque capacity fitted', q(Tcap, 'N·m', 2)), m('Axial capacity fitted', q(Fcap, 'N', 0))],
        'Set-screw hub retention.', 'Empirical handbook rule.', {
          text: ok ? 'SET SCREWS HOLD' : 'SET SCREWS WILL SLIP', tone: ok ? 'good' : 'bad',
          checks: [check('Torque', okT ? 'pass' : 'fail', `${q(Tcap, 'N·m', 1)} against ${q(Treq, 'N·m', 1)}.`), check('Axial', okA ? 'pass' : 'fail', `${q(Fcap, 'N', 0)} against ${q(v.Fax * v.SF, 'N', 0)}.`), check('Retention method', nReq <= 2 ? 'pass' : 'warn', nReq <= 2 ? 'One or two set screws are enough.' : 'More than two screws needed: use a key or a clamp collar.')],
        });
    },
    "tank-wall-panel-check": (v) => {
      if (v.l > v.L) return invalid('The short side must not exceed the long side.');
      const g = 9.80665, pb = v.ps * 1000 + v.rho * g * v.h, Fl = v.rho * g * v.w * v.h * v.h / 2, Fg = v.ps * 1000 * v.w * v.h, F = Fl + Fg, y = F > 0 ? (Fl * v.h / 3 + Fg * v.h / 2) / F : 0;
      const E = v.E * 1000, W = pb / 1e6 * v.L * v.l, S = 0.75 * W / (v.t * v.t * (v.L / v.l + 1.61 * v.l * v.l / (v.L * v.L))), d = 0.1422 * W / (E * v.t ** 3 * (v.L / v.l ** 3 + 2.21 / (v.L * v.L))), tReq = Math.sqrt(0.75 * W / (v.allow * (v.L / v.l + 1.61 * v.l * v.l / (v.L * v.L))));
      const okS = S <= v.allow, okD = d <= v.dMax, ok = okS && okD;
      return output({ pb, F, y, W, S, d, tReq }, 'Panel bending stress (MPa)', S,
        [m('Pressure at the floor', q(pb / 1000, 'kPa', 2)), m('Force on the wall', q(F / 1000, 'kN', 2)), m('Centre of pressure above the floor', q(y, 'm', 3)), m('Load on the panel', q(W / 1000, 'kN', 2)), m('Panel bending stress', q(S, 'MPa', 1)), m('Panel deflection', q(d, 'mm', 2)), m('Thickness for the allowable stress', q(tReq, 'mm', 2))],
        'Tank wall panel check.', 'Simply supported panel under the floor pressure.', {
          text: ok ? 'PANEL ADEQUATE' : 'PANEL NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Stress', okS ? 'pass' : 'fail', `${q(S, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Deflection', okD ? 'pass' : 'fail', `${q(d, 'mm', 2)} against ${q(v.dMax, 'mm', 1)}.`), check('Large deflection', d <= v.t / 2 ? 'pass' : 'warn', d <= v.t / 2 ? 'Deflection under half the thickness.' : 'Deflection over half the thickness: membrane action makes small-deflection formulas conservative.')],
        });
    },
    "crane-wheel-rail-check": (v) => {
      const Es = 1 / ((1 - v.nu1 ** 2) / (v.E1 * 1000) + (1 - v.nu2 ** 2) / (v.E2 * 1000)), R = v.D / 2, Wn = v.W * 1000, size = Math.sqrt(4 * Wn * R / (PI * v.b * Es)), p0 = 2 * Wn / (PI * size * v.b), tmax = 0.3 * p0, depth = 0.786 * size;
      const pMean = Wn / (v.D * v.b), Fw = Wn * v.f / R, Ftot = Fw * v.nW, P = Ftot * v.v, okC = p0 <= v.p0Max, okM = pMean <= v.pMeanMax, ok = okC && okM;
      return output({ Es, size, p0, tmax, depth, pMean, Fw, Ftot, P }, 'Peak contact pressure (MPa)', p0,
        [m('Contact half-width', q(size, 'mm', 3)), m('Peak contact pressure', q(p0, 'MPa', 0)), m('Largest shear / depth', `${q(tmax, 'MPa', 0)} at ${q(depth, 'mm', 2)}`), m('Mean wheel pressure', q(pMean, 'MPa', 2)), m('Rolling resistance per wheel', q(Fw, 'N', 1)), m('Travel force (all wheels)', q(Ftot, 'N', 0)), m('Travel power', q(P, 'W', 0))],
        'Crane wheel on rail.', 'Line contact on a flat rail head.', {
          text: ok ? 'WHEEL ADEQUATE' : 'WHEEL NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Contact pressure', okC ? 'pass' : 'fail', `${q(p0, 'MPa', 0)} against ${q(v.p0Max, 'MPa', 0)}.`), check('Mean wheel pressure', okM ? 'pass' : 'fail', `${q(pMean, 'MPa', 2)} against ${q(v.pMeanMax, 'MPa', 1)}.`), check('Hardened depth', 'verify', `Harden the wheel tread deeper than about ${q(2 * depth, 'mm', 1)} to carry the subsurface shear.`)],
        });
    },
    "bar-stock-plan": (v) => {
      const per = v.L + v.W + v.face, usable = v.bar - v.rem; if (usable < per) return invalid('The usable bar length is shorter than one part.');
      const perBar = Math.floor(usable / per), bars = Math.ceil(v.qty / perBar), stockM = bars * v.bar / 1000, mass = stockM * v.kgm, yieldPct = v.qty * v.L / (bars * v.bar) * 100, matCost = mass * v.price / v.qty, hours = (v.qty * v.cycle + bars * v.change) / 3600, shifts = hours / v.shift, ok = yieldPct >= v.yMin;
      return output({ per, perBar, bars, stockM, mass, yieldPct, matCost, hours, shifts }, 'Bars to order', bars,
        [m('Length per part', q(per, 'mm', 2)), m('Parts per bar', q(perBar, '', 0)), m('Bars to order', q(bars, '', 0)), m('Stock length / mass', `${q(stockM, 'm', 1)} / ${q(mass, 'kg', 1)}`), m('Material yield', q(yieldPct, '%', 1)), m('Material cost per part', money(matCost)), m('Machine hours / shifts', `${q(hours, 'h', 1)} / ${q(shifts, '', 2)}`)],
        'Bar stock plan.', 'Whole parts per bar; constant cycle.', {
          text: ok ? 'PLAN READY' : 'YIELD TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Material yield', ok ? 'pass' : 'fail', `${q(yieldPct, '%', 1)} against ${q(v.yMin, '%', 0)}.`), check('Set-up parts', 'verify', 'Add bars for set-up and first-article parts.')],
        });
    },
    "stockpile-haulage-plan": (v) => {
      const tn = Math.tan(rad(v.theta)); let h, V;
      if (v.shape === 'circle') { h = v.D / 2 * tn; V = PI * v.D * v.D * h / 12; } else { if (v.A > v.B) return invalid('Enter the shorter side as the width A.'); h = v.A / 2 * tn; V = v.A * h * (3 * v.B - v.A) / 6; }
      const mass = V * v.rho, loads = Math.ceil(mass / 1000 / v.pay - 1e-9), passes = Math.ceil(V / (v.bucket * v.fill / 100) - 1e-9), tLoad = passes * v.cycleL / 3600, qPeak = v.rho * 9.80665 * h / 1000, ok = qPeak <= v.qAllow;
      return output({ h, V, mass, loads, passes, tLoad, qPeak }, 'Stockpile mass (t)', mass / 1000,
        [m('Pile height', q(h, 'm', 2)), m('Volume', q(V, 'm³', 1)), m('Mass', q(mass / 1000, 't', 1)), m('Truck loads', q(loads, '', 0)), m('Loader passes', q(passes, '', 0)), m('Loading time', q(tLoad, 'h', 2)), m('Peak ground pressure', q(qPeak, 'kPa', 1))],
        'Stockpile haulage plan.', 'Ideal pile at the angle of repose.', {
          text: ok ? 'GROUND ADEQUATE' : 'GROUND OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Ground pressure', ok ? 'pass' : 'fail', `${q(qPeak, 'kPa', 1)} under the peak against ${q(v.qAllow, 'kPa', 0)}.`), check('Survey', 'verify', 'Confirm volume with a survey for inventory or payment purposes.')],
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
