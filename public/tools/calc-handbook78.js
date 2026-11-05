// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook78). SI units are explicit at each boundary.
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
    "edm-sinker-plan": (v) => {
      const I = v.J * v.A, cyc = v.ton + v.toff, duty = v.ton / cyc, freq = 1000 / cyc;
      const Vc = v.A * 100 * v.depth / 1000, Vf = v.fin * (v.perim * v.depth + v.A * 100) / 1000, Vr = Vc - Vf;
      if (!(Vr > 0) || v.fin >= v.depth) return invalid('The finishing stock leaves nothing to rough: check the stock, depth and perimeter.');
      const tR = Vr / v.mrrR, tF = Vf / v.mrrF, tT = tR + tF, endR = v.wearR / 100 * (v.depth - v.fin), nR = Math.max(1, Math.ceil(endR / v.endMax - 1e-9)), eachR = endR / nR;
      const uR = v.ocR + v.fin, uF = v.ocF, cost = tT * v.rate + (nR + 1) * v.elec;
      const okI = I <= v.Imax + 1e-9, okS = v.fin >= v.crater - 1e-9, ok = okI && okS;
      return output({ I, duty, freq, Vc, Vf, Vr, tR, tF, tT, endR, nR, eachR, uR, uF, cost }, 'Total EDM time (h)', tT,
        [m('Roughing current', q(I, 'A', 1)), m('Duty cycle / spark frequency', `${q(100 * duty, '%', 0)} / ${q(freq, 'kHz', 1)}`), m('Roughing / finishing volume', `${q(Vr, '', 2)} / ${q(Vf, 'cm³', 2)}`), m('Roughing / finishing time', `${q(tR, '', 2)} / ${q(tF, 'h', 2)}`), m('Roughing end wear (one electrode)', q(endR, 'mm', 2)), m('Roughing electrodes', `${q(nR, '', 0)} (${q(eachR, 'mm', 2)} wear each)`), m('Undersize on each side: roughing / finishing', `${q(uR, '', 3)} / ${q(uF, 'mm', 3)}`), m('Cost of the cavity', money(cost, 0))],
        'EDM sinker plan.', 'Straight-walled cavity; rates, wear and overcut from your machine tables.', {
          text: ok ? 'EDM PLAN WORKABLE' : !okI ? 'CURRENT ABOVE MACHINE LIMIT' : 'FINISHING STOCK TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Machine current', okI ? 'pass' : 'fail', `${q(I, 'A', 1)} against ${q(v.Imax, 'A', 0)}${okI ? '.' : ': lower the current density or rough in stages with a smaller electrode area engaged.'}`), check('Finishing stock', okS ? 'pass' : 'fail', `${q(v.fin, 'mm', 2)} against a damaged layer of ${q(v.crater, 'mm', 2)}${okS ? '.' : ': leave more stock so finishing clears the roughing craters and recast.'}`), check('Settings', 'verify', 'Take removal rates, wear and overcut from the machine maker\'s tables for this electrode and work material, and confirm on the first cavity.')],
        });
    },
    "wire-edm-cut-plan": (v) => {
      const kerf = v.dw + 2 * v.gap, offset = v.dw / 2 + v.gap, rCorner = v.dw / 2 + (v.skims > 0 ? v.gapF : v.gap), feed = v.ar / v.t;
      const tMain = v.Lc / feed, tSkim = v.skims * v.Lc / v.vs, tHoles = v.holes * v.tHole, tCut = tMain + tSkim, tTot = tCut + tHoles;
      const area = PI / 4 * v.dw ** 2, wireL = v.vw * tCut, wireM = v.dens * area * wireL, wireC = wireM / 1000 * v.wcost, Fb = v.Rm * area, u = v.Tw / Fb, vol = kerf * v.t * v.Lc;
      const cost = tTot / 60 * v.rate + wireC, okC = rCorner <= v.rMin + 1e-9, okT = u <= v.uMax + 1e-9, ok = okC && okT;
      return output({ kerf, offset, rCorner, feed, tMain, tSkim, tHoles, tTot, wireL, wireM, wireC, Fb, u, vol, cost }, 'Total wire EDM time (min)', tTot,
        [m('Kerf / wire offset', `${q(kerf, '', 3)} / ${q(offset, 'mm', 3)}`), m('Smallest inside corner', q(rCorner, 'mm', 3)), m('Main-cut feed', q(feed, 'mm/min', 2)), m('Main cut / skims / start holes', `${q(tMain, '', 1)} / ${q(tSkim, '', 1)} / ${q(tHoles, 'min', 1)}`), m('Wire used', `${q(wireL, 'm', 0)}, ${q(wireM, 'g', 0)}`), m('Breaking load / tension share', `${q(Fb, 'N', 1)} / ${q(100 * u, '%', 0)}`), m('Material removed', q(vol / 1000, 'cm³', 2)), m('Cost per part', money(cost, 2))],
        'Wire EDM cut plan.', 'Constant area rate on the main cut; settings from your machine tables.', {
          text: ok ? 'WIRE AND SETTINGS SUIT THE CUT' : !okC ? 'WIRE TOO LARGE FOR THE CORNERS' : 'WIRE TENSION TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Inside corners', okC ? 'pass' : 'fail', `Smallest corner ${q(rCorner, 'mm', 3)} against ${q(v.rMin, 'mm', 3)} on the drawing${okC ? '.' : ': use a finer wire or a smaller last-pass gap, or ask for a larger corner radius.'}`), check('Wire tension', okT ? 'pass' : 'fail', `${q(100 * u, '%', 0)} of the breaking load against ${q(100 * v.uMax, '%', 0)}.`), check('Settings', 'verify', 'Take the area rate, gaps and skim speeds from the machine maker\'s tables for this wire and material.')],
        });
    },
    "laser-cutting-plan": (v) => {
      const lamMm = v.lam / 1000, d0 = 4 * v.M2 * lamMm * v.fl / (PI * v.Db), Fn = v.fl / v.Db, dCm = d0 / 10, H = 4 * v.P / (PI * dCm * dCm);
      const zR = PI * d0 * d0 / (4 * v.M2 * lamMm), dof = 2 * zR * Math.sqrt((1 + v.tol / 100) ** 2 - 1), vel = v.vref * (v.P / v.Pref) * (v.tref / v.t);
      const tCut = v.Lc / (vel * 1000) * 60, tPierce = v.pierces * v.tp, tPart = tCut + tPierce, cost = tPart / 3600 * v.rate;
      const okH = H >= v.Hreq - 1e-9, okZ = dof >= v.flat - 1e-12, ok = okH && okZ;
      return output({ d0, Fn, H, zR, dof, v: vel, tCut, tPierce, tPart, cost }, 'Time per part (s)', tPart,
        [m('Focused spot diameter', q(d0, 'mm', 3)), m('f-number (focal length ÷ beam diameter)', q(Fn, '', 2)), m('Power density at the work', q(H, 'W/cm²', 0)), m('Depth of focus', q(dof, 'mm', 2)), m('Estimated cutting speed', q(vel, 'm/min', 2)), m('Cutting / piercing time', `${q(tCut, '', 1)} / ${q(tPierce, 's', 1)}`), m('Cost per part', money(cost, 2))],
        'Laser cutting plan.', 'Gaussian beam; speed scaled by power and thickness.', {
          text: ok ? 'BEAM SUITS THE CUT' : !okH ? 'POWER DENSITY TOO LOW' : 'DEPTH OF FOCUS TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Power density', okH ? 'pass' : 'fail', `${q(H, 'W/cm²', 0)} against ${q(v.Hreq, 'W/cm²', 0)}${okH ? '.' : ': use a shorter focal length or more power.'}`), check('Depth of focus', okZ ? 'pass' : 'fail', `${q(dof, 'mm', 2)} against ${q(v.flat, 'mm', 2)} of surface variation${okZ ? '.' : ': use a longer focal length or a height-following head.'}`), check('Cutting speed', 'verify', 'Confirm the speed on the maker\'s chart for this thickness; the proportional rule is an estimate within the chart\'s range.')],
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
