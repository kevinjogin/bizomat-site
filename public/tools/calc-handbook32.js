// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook32). SI units are explicit at each boundary.
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
    "bearing-fit-clearance": (v) => {
      if (v.cmax < v.cmin) return invalid('The maximum clearance must not be below the minimum.');
      if (v.D <= v.d) return invalid('The outside diameter must exceed the bore.');
      const fit = v.fi * v.Ii + v.fo * v.Io, dm = (v.d + v.D) / 2, th = v.alpha * v.dT * dm / 1000, opMin = v.cmin - fit - th, opMax = v.cmax - fit - th, ok = opMin >= v.cminReq;
      return output({ fit, th, opMin, opMax }, 'Minimum operating clearance (µm)', opMin,
        [m('Reduction from fits', q(fit, 'µm', 1)), m('Reduction from temperature difference', q(th, 'µm', 1)), m('Operating clearance range', `${q(opMin, '', 1)} to ${q(opMax, 'µm', 1)}`)],
        'Bearing operating clearance.', 'Approximate shares of interference.', {
          text: ok ? 'CLEARANCE ADEQUATE' : 'PRELOAD RISK', tone: ok ? 'good' : 'bad',
          checks: [check('Minimum operating clearance', ok ? 'pass' : 'fail', ok ? `${q(opMin, 'µm', 1)} remains at the tightest combination.` : 'The tightest combination preloads the bearing: use a larger clearance group or a looser fit.')],
        });
    },
    "overhung-load-check": (v) => {
      const T = v.P * 1000 / (2 * PI * v.n / 60), K = Number(v.elem), OHL = 2 * T * 1000 / v.Dp * K, Fallow = v.Fa * 1000 * v.Lc / v.La, Fb = OHL * (v.S + v.La) / v.S, ok = OHL <= Fallow;
      return output({ T, OHL, Fallow, Fb, util: OHL / Fallow * 100 }, 'Overhung load (kN)', OHL / 1000,
        [m('Shaft torque', q(T, 'N·m', 1)), m('Overhung load', q(OHL / 1000, 'kN', 2)), m('Allowable at the actual position', q(Fallow / 1000, 'kN', 2)), m('Utilisation', q(OHL / Fallow * 100, '%', 0)), m('Outer bearing load', q(Fb / 1000, 'kN', 2))],
        'Overhung load check.', 'Lever correction for load position.', {
          text: ok ? 'OVERHUNG LOAD ACCEPTABLE' : 'OVERHUNG LOAD TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Allowable', ok ? 'pass' : 'fail', `${q(OHL / 1000, 'kN', 2)} against ${q(Fallow / 1000, 'kN', 2)}.`), check('Fix', ok ? 'pass' : 'verify', ok ? 'No change needed.' : 'Use a larger pitch diameter, move the hub inboard, or add an outboard bearing.')],
        });
    },
    "injection-moulding-estimate": (v) => {
      if (v.Te <= v.Tw || v.Tm <= v.Te) return invalid('Temperatures must satisfy mould < ejection < melt.');
      const A = v.cav * v.Ap + v.Ar, F = A * 100 * v.pc * (1 + v.marg / 100) / 1000, shot = v.cav * v.Vp + v.Vr, use = shot / v.barrel * 100, mass = shot * v.rho;
      const tc = v.s ** 2 / (PI * PI * v.a) * Math.log(4 / PI * (v.Tm - v.Tw) / (v.Te - v.Tw)), cycle = tc + v.tOther, pph = v.cav * 3600 / cycle, okC = F <= v.clamp, okS = use >= 20 && use <= 80, ok = okC && okS;
      return output({ F, shot, use, mass, tc, cycle, pph }, 'Clamp force (kN)', F,
        [m('Clamp force needed', q(F, 'kN', 0)), m('Shot volume / mass', `${q(shot, 'cm³', 1)} / ${q(mass, 'g', 0)}`), m('Barrel use', q(use, '%', 0)), m('Cooling time', q(tc, 's', 1)), m('Cycle time', q(cycle, 's', 1)), m('Parts per hour', q(pph, '', 0))],
        'Injection moulding estimate.', 'Average cavity pressure; plate cooling.', {
          text: ok ? 'MACHINE SUITABLE' : 'MACHINE NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Clamp force', okC ? 'pass' : 'fail', `${q(F, 'kN', 0)} against ${q(v.clamp, 'kN', 0)}.`), check('Shot size', okS ? 'pass' : 'warn', `${q(use, '%', 0)} of capacity; 20–80% avoids long residence time and short shots.`)],
        });
    },
    "bearing-friction-oil-flow": (v) => {
      const M = 0.5 * v.mu * v.P * v.d / 1000, Wb = M * 2 * PI * v.rpm / 60 * v.nb, heat = Wb + v.other, Q = heat / 1000 / (v.rho * v.cp / 60000 * v.dT);
      return output({ M, Wb, heat, Q }, 'Oil flow (L/min)', Q,
        [m('Friction torque per bearing', q(M, 'N·m', 4)), m('Bearing power loss', q(Wb, 'W', 1)), m('Total heat to the oil', q(heat, 'W', 1)), m('Oil flow needed', q(Q, 'L/min', 3))],
        'Bearing losses and oil flow.', 'Constant friction coefficient.');
    },
    "press-brake-setup": (v) => {
      const dies = [6, 8, 10, 12, 16, 20, 24, 30, 35, 40, 50, 60, 80, 100, 120, 160, 200, 250], V = dies.find((x) => x >= v.vr * v.t); if (!V) return invalid('The thickness needs a die over 250 mm: outside this tool’s range.');
      const ri = v.rf * V, fl = v.flf * V, F = v.k * v.L * v.t * v.t * v.uts / V, perM = F / v.L, okP = F / 1000 <= v.cap, okD = perM <= v.dieRate, ok = okP && okD;
      return output({ V, ri, fl, F, perM }, 'Bending force (kN)', F / 1000,
        [m('Die opening', q(V, 'mm', 0)), m('Die opening ÷ thickness', q(V / v.t, '', 1)), m('Inside radius (approx.)', q(ri, 'mm', 2)), m('Minimum flange (approx.)', q(fl, 'mm', 1)), m('Bending force', q(F / 1000, 'kN', 1)), m('Force per metre', q(perM, 'kN/m', 0))],
        'Press brake set-up.', 'Air bending rules of thumb.', {
          text: ok ? 'SET-UP FEASIBLE' : 'PRESS OR DIE OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Press capacity', okP ? 'pass' : 'fail', `${q(F / 1000, 'kN', 0)} against ${q(v.cap, 'kN', 0)}.`), check('Die rating', okD ? 'pass' : 'fail', `${q(perM, 'kN/m', 0)} against ${q(v.dieRate, 'kN/m', 0)}.`), check('Radius', v.rf * V >= v.t ? 'pass' : 'warn', v.rf * V >= v.t ? 'Inside radius at least the thickness.' : 'Inside radius below thickness: check the material’s minimum bend radius.')],
        });
    },
    "gearbox-selection-check": (v) => {
      const n2 = v.n1 / v.i, T2 = v.P * 1000 * v.eta / 100 / (2 * PI * n2 / 60), Preq = v.P * v.SF, okM = Preq <= v.Pmech, okT = v.P <= v.Pth, okQ = T2 * v.SF <= v.T2r, ok = okM && okT && okQ;
      return output({ n2, T2, Preq }, 'Output torque (N·m)', T2,
        [m('Output speed', q(n2, 'rpm', 1)), m('Output torque', q(T2, 'N·m', 1)), m('Mechanical rating needed', `${q(Preq, '', 2)} kW against ${q(v.Pmech, 'kW', 2)}`), m('Thermal check', `${q(v.P, '', 2)} kW against ${q(v.Pth, 'kW', 2)}`), m('Torque with service factor', `${q(T2 * v.SF, '', 0)} N·m against ${q(v.T2r, 'N·m', 0)}`)],
        'Gearbox selection check.', 'Catalogue ratings as entered.', {
          text: ok ? 'GEARBOX SUITABLE' : 'GEARBOX NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Mechanical rating', okM ? 'pass' : 'fail', `${q(Preq, 'kW', 2)} needed against ${q(v.Pmech, 'kW', 2)}.`), check('Thermal rating', okT ? 'pass' : 'fail', okT ? 'Within the thermal rating.' : 'Above the thermal rating: add cooling or choose a larger gearbox.'), check('Output torque', okQ ? 'pass' : 'fail', `${q(T2 * v.SF, 'N·m', 0)} against ${q(v.T2r, 'N·m', 0)}.`)],
        });
    },
    "riveted-joint-design": (v) => {
      const shear = v.rows * Number(v.shear) * PI * v.d * v.d / 4 * v.tau, crush = v.rows * v.d * v.t * v.sc, R = Math.min(shear, crush);
      const pBal = v.d + R / (v.t * v.st), p = Math.max(pBal, 3 * v.d), tear = (p - v.d) * v.t * v.st, weak = Math.min(tear, R), eff = weak / (p * v.t * v.st) * 100, np = Math.floor(v.Lj / p), cap = np * weak, ok = np >= 1 && cap >= v.F * 1000;
      if (np < 1) return invalid('The joint is shorter than one pitch.');
      return output({ shear, crush, R, pBal, p, eff, np, cap }, 'Design pitch (mm)', p,
        [m('Rivet shear per pitch', q(shear / 1000, 'kN', 2)), m('Crushing per pitch', q(crush / 1000, 'kN', 2)), m('Balanced pitch', q(pBal, 'mm', 1)), m('Design pitch (at least 3d)', q(p, 'mm', 1)), m('Joint efficiency', q(eff, '%', 1)), m('Pitches along the joint', q(np, '', 0)), m('Joint capacity', q(cap / 1000, 'kN', 1))],
        'Riveted joint design.', 'Allowable-stress method.', {
          text: ok ? 'JOINT ADEQUATE' : 'JOINT TOO WEAK', tone: ok ? 'good' : 'bad',
          checks: [check('Capacity', ok ? 'pass' : 'fail', `${q(cap / 1000, 'kN', 0)} against ${q(v.F, 'kN', 0)}.`), check('Minimum pitch', pBal >= 3 * v.d ? 'pass' : 'warn', pBal >= 3 * v.d ? 'Balanced pitch is above 3d.' : 'Balanced pitch is below 3d; 3d is used.')],
        });
    },
    "storage-tank-shell": (v) => {
      const nc = Math.ceil(v.Hl / v.hc - 1e-9), rows = []; let mass = 0, t1 = 0;
      for (let i = 0; i < nc; i++) { const Hi = v.Hl - i * v.hc, h = Math.min(v.hc, v.Hl - i * v.hc), tc = 4.9 * v.D * Math.max(Hi - 0.3, 0) * v.G / (v.S * v.E) + v.CA, t = Math.max(tc, v.tmin); if (i === 0) t1 = t; mass += PI * v.D * h * t / 1000 * v.rhoS; rows.push([String(i + 1), q(Hi, 'm', 2), q(tc, 'mm', 2), q(t, 'mm', 2)]); }
      const cap = PI * v.D * v.D / 4 * v.Hl;
      return output({ nc, t1, cap, mass }, 'Bottom course thickness (mm)', t1,
        [m('Number of courses', q(nc, '', 0)), m('Bottom course thickness', q(t1, 'mm', 2)), m('Capacity', q(cap, 'm³', 1)), m('Shell steel mass', q(mass / 1000, 't', 2))],
        'Storage tank shell by course.', 'One-foot method; comparison only.', {
          table: tbl('Shell courses (from the bottom)', ['Course', 'Liquid above course bottom', 'Calculated', 'Used'], rows),
          checks: [check('Standard', 'verify', 'Design to the applicable tank standard, including the hydrotest case and wind and seismic loads.')],
        });
    },
    "milling-cost-per-part": (v) => {
      const Q = v.ae * v.ap * v.vf / 1000, tc = v.Vol / Q, ch = tc / v.Tl, cm = v.rate / 60, mach = cm * (tc + v.tnc), toolT = cm * ch * v.tch, toolC = ch * v.z * v.edge, set = cm * v.setup / v.batch, cost = mach + toolT + toolC + set;
      return output({ Q, tc, ch, mach, toolT, toolC, set, cost }, 'Cost per part ($)', cost,
        [m('Removal rate', q(Q, 'cm³/min', 1)), m('Cutting time', q(tc, 'min', 2)), m('Tool changes per part', q(ch, '', 3)), m('Machine time cost', money(mach)), m('Tool change time cost', money(toolT)), m('Insert cost', money(toolC)), m('Set-up share', money(set)), m('Cost per part', money(cost))],
        'Milling cost per part.', 'Constant cutting conditions.', {
          table: tbl('Cost breakdown', ['Item', 'Cost', 'Share'], [['Machine time', money(mach), q(mach / cost * 100, '%', 0)], ['Tool change time', money(toolT), q(toolT / cost * 100, '%', 0)], ['Inserts', money(toolC), q(toolC / cost * 100, '%', 0)], ['Set-up', money(set), q(set / cost * 100, '%', 0)]]),
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
