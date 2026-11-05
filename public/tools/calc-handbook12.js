// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook12). SI units are explicit at each boundary.
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
    "nose-radius-compensation": (v) => {
      const t = rad(v.angle), dz = v.r * (1 - Math.tan(t / 2)), dx = v.r * (1 - Math.tan((PI / 2 - t) / 2)), err = v.r * (Math.sin(t) + Math.cos(t) - 1);
      return output({ dz, dx, err }, 'Profile error if uncompensated (mm)', err,
        [m('Compensation along Z', q(dz, 'mm', 4)), m('Compensation along X (radius)', q(dx, 'mm', 4)), m('Compensation along X (diameter)', q(2 * dx, 'mm', 4)), m('Profile error if uncompensated', q(err, 'mm', 4))],
        `Nose radius effect on a ${q(v.angle, '°', 1)} taper.`, 'Straight taper; standard imaginary tip.', {
          checks: [check('Tip orientation', 'verify', 'Confirm the imaginary tip position (tip code) for the tool in use.')],
        });
    },
    "feed-for-finish": (v) => {
      const f = v.mode === 'feed' ? Math.sqrt(v.Ra / 1000 * v.R / 0.031553) : v.f, Ra = 0.031553 * f * f / v.R * 1000, Rt = f * f / (8 * v.R) * 1000;
      return output({ f, Ra, Rt }, v.mode === 'feed' ? 'Feed (mm/rev)' : 'Ra (µm)', v.mode === 'feed' ? f : Ra,
        [m('Feed', q(f, 'mm/rev', 4)), m('Theoretical Ra', q(Ra, 'µm', 3)), m('Theoretical Rt', q(Rt, 'µm', 3)), m('Feed / nose radius', q(f / v.R, '', 3))],
        'Geometric finish from feed and nose radius.', 'Theoretical value; real finish is usually rougher.', {
          checks: [check('Feed against nose radius', f / v.R <= 0.5 ? 'pass' : 'warn', f / v.R <= 0.5 ? 'Feed is small relative to the nose radius.' : 'Feed is large relative to the nose radius; the relation becomes less accurate.')],
        });
    },
    "inch-speeds-feeds": (v) => {
      const rpm = 12 * v.sfm / (PI * v.D), ipm = rpm * v.teeth * v.ipt;
      return output({ rpm, ipm }, 'Spindle speed (rpm)', rpm,
        [m('Spindle speed', q(rpm, 'rpm', 0)), m('Feed rate', q(ipm, 'in/min', 2)), m('Surface speed', q(v.sfm * 0.3048, 'm/min', 1)), m('Feed rate', q(ipm * 25.4, 'mm/min', 0)), m('Chip load', q(v.ipt * 25.4, 'mm', 4))],
        'Inch speed and feed conversion.', 'Supplier data govern.', {
          checks: [check('Machine limits', 'verify', 'Check spindle speed, power and feed limits.')],
        });
    },
    "knurl-blank": (v) => {
      const dp = v.system === 'dp', teeth = dp ? v.P * v.D : PI * v.D / v.t, lo = Math.floor(teeth), hi = Math.ceil(teeth) === lo ? lo + 1 : Math.ceil(teeth), dia = (n) => (dp ? n / v.P : n * v.t / PI), unit = dp ? 'in' : 'mm';
      if (lo < 1) return invalid('The blank is too small for this knurl pitch.');
      const exact = Math.abs(teeth - Math.round(teeth)) < 1e-6;
      return output({ teeth, lower: dia(lo), upper: dia(hi) }, 'Teeth on planned blank', teeth,
        [m('Teeth on planned blank', q(teeth, '', 3)), m(`Tracking diameter (${lo} teeth)`, q(dia(lo), unit, 4)), m(`Tracking diameter (${hi} teeth)`, q(dia(hi), unit, 4))],
        exact ? 'The planned blank already gives a whole number of teeth.' : 'Adjust the blank to a tracking diameter.', 'Straight knurling.', {
          text: exact ? 'TRACKS CLEANLY' : 'ADJUST BLANK', tone: exact ? 'good' : 'warn',
          checks: [check('Whole number of teeth', exact ? 'pass' : 'warn', exact ? 'Good tracking expected.' : `${q(teeth, '', 2)} teeth: the knurl may double-track.`)],
        });
    },
    "bandsaw-time": (v) => {
      const area = (v.shape === 'round' ? PI * v.a * v.a / 4 : v.shape === 'rect' ? v.a * v.b : PI * (v.a ** 2 - Math.max(0, v.a - 2 * v.b) ** 2) / 4) / 100;
      if (v.shape === 'tube' && 2 * v.b >= v.a) return invalid('The tube wall is too thick for its diameter.');
      const tcut = area / v.rate, perHour = 3600 / (tcut * 60 + v.handle);
      return output({ area, tcut, perHour }, 'Cutting time (min)', tcut,
        [m('Cut area', q(area, 'cm²', 2)), m('Cutting time per cut', `${q(tcut, 'min', 2)} (${q(tcut * 60, 's', 0)})`), m('Cuts per hour', q(perHour, '', 1))],
        'Saw time from the cutting rate.', 'Cutting rate supplied by the user.', {
          checks: [check('Cutting rate source', 'verify', 'Use the blade maker’s rate for this material and section, or your own records.')],
        });
    },
    "centerless-feed": (v) => {
      const feed = PI * v.Dr * v.nr * Math.sin(rad(v.angle)) * v.slip / 100, nw = v.Dr * v.nr * Math.cos(rad(v.angle)) / v.dw, ppm = feed / (v.L + v.gap);
      return output({ feed, nw, ppm }, 'Through-feed rate (mm/min)', feed,
        [m('Through-feed rate', `${q(feed, 'mm/min', 0)} (${q(feed / 1000, 'm/min', 3)})`), m('Work rotation speed', q(nw, 'rpm', 0)), m('Parts per minute', q(ppm, '', 2)), m('Parts per hour', q(ppm * 60, '', 0))],
        'Through-feed rate and output.', 'Slip allowance estimated.', {
          checks: [check('Actual output', 'verify', 'Measure actual output and adjust the slip allowance.')],
        });
    },
    "refractometer-concentration": (v) => {
      const conc = v.brix * v.factor, low = conc < v.target, add = low ? v.volume * (v.target - conc) / (100 - v.target) : v.volume * (conc - v.target) / v.target;
      const ok = Math.abs(conc - v.target) <= 0.1 * v.target;
      return output({ conc, add, what: low ? 'concentrate' : 'water' }, 'Concentration (%)', conc,
        [m('Actual concentration', q(conc, '%', 2)), m('Difference from target', q(conc - v.target, '%', 2)), m(low ? 'Concentrate to add' : 'Water to add', q(add, 'L', 1))],
        low ? 'The coolant is weaker than the target.' : 'The coolant is stronger than (or at) the target.', 'Undiluted concentrate assumed.', {
          text: ok ? 'WITHIN 10% OF TARGET' : low ? 'TOO WEAK' : 'TOO STRONG', tone: ok ? 'good' : 'warn',
          checks: [check('Concentration', ok ? 'pass' : 'warn', `${q(conc, '%', 2)} against ${q(v.target, '%', 1)} target.`), check('Tramp oil', 'verify', 'Remove tramp oil before reading; it distorts the result.')],
        });
    },
    "bending-springback": (v) => {
      const x = v.Ri * v.YS / (v.E * 1000 * v.t), ratio = 4 * x ** 3 - 3 * x + 1;
      if (x >= 0.5) return invalid('Radius × yield ÷ (E × thickness) is 0.5 or more: the bend is almost fully elastic and the formula does not apply.');
      const Rf = v.Ri / ratio, K = (v.Ri + v.t / 2) / (Rf + v.t / 2), bendTo = v.angle / K;
      return output({ Rf, K, bendTo }, 'Angle to bend to (°)', bendTo,
        [m('Final radius', q(Rf, 'mm', 3)), m('Springback factor K', q(K, '', 4)), m('Angle to bend to', q(bendTo, '°', 2)), m('Springback', q(bendTo - v.angle, '°', 2)), m('Radius / thickness', q(v.Ri / v.t, '', 1))],
        'Elastic recovery after bending.', 'Approximation for unrestrained (air) bending, valid while Ri × YS ÷ (E t) < 0.5.', {
          checks: [check('Trial bend', 'verify', 'Confirm with a trial bend; material properties vary between batches.')],
        });
    },
    "tube-bend-thinning": (v) => {
      if (v.R <= v.D / 2) return invalid('The centreline radius must exceed half the tube diameter.');
      const tout = v.t * v.R / (v.R + v.D / 2), tin = v.t * v.R / (v.R - v.D / 2), pct = 100 * (v.t - tout) / v.t, ok = !v.tmin || tout >= v.tmin;
      return output({ tout, tin, pct }, 'Outer wall thickness (mm)', tout,
        [m('Outer wall thickness', q(tout, 'mm', 3)), m('Outer wall thinning', q(pct, '%', 1)), m('Inner wall thickness', q(tin, 'mm', 3)), m('Bend ratio R/D', q(v.R / v.D, '', 2)), m('Wall factor D/t', q(v.D / v.t, '', 1))],
        'Wall thickness change in the bend.', 'Geometric estimate.', {
          ...(v.tmin ? (ok ? { text: 'WALL ADEQUATE', tone: 'good' } : { text: 'WALL TOO THIN', tone: 'bad' }) : {}),
          checks: [check('Minimum wall', !v.tmin ? 'verify' : ok ? 'pass' : 'fail', !v.tmin ? 'Enter a minimum wall to check it.' : `${q(tout, 'mm', 3)} against ${q(v.tmin, 'mm', 2)}.`), check('Tooling', v.R / v.D >= 2 ? 'pass' : 'warn', v.R / v.D >= 2 ? 'Bend ratio of 2D or more.' : 'Tight bend: a mandrel and wiper die are usually needed.')],
        });
    },
    "weld-cost": (v) => {
      const mass = 0.5 * v.leg * v.leg * (1 + v.excess / 100) * v.rho / 1000, arc = mass / v.dep, paid = arc / (v.of / 100);
      const labour = paid * v.rate, filler = mass / (v.eff / 100) * v.wire, gas = arc * 60 * v.gasFlow / 1000 * v.gasPrice, total = labour + filler + gas;
      return output({ mass, arc, paid, labour, filler, gas, total, totalText: money(total) }, 'Cost per metre (AUD)', total,
        [m('Weld metal per metre', q(mass, 'kg', 3)), m('Arc time per metre', q(arc * 60, 'min', 2)), m('Paid time per metre', q(paid * 60, 'min', 2)), m('Labour', money(labour)), m('Filler', money(filler)), m('Gas', money(gas)), m('Total per metre', money(total))],
        'Direct welding cost per metre.', 'Excludes preparation, cleaning and inspection.', {
          table: tbl('Cost breakdown per metre', ['Item', 'Cost', 'Share'], [['Labour and overhead', money(labour), q(100 * labour / total, '%', 0)], ['Filler metal', money(filler), q(100 * filler / total, '%', 0)], ['Shielding gas', money(gas), q(100 * gas / total, '%', 0)]]),
          checks: [check('Shop data', 'verify', 'Use measured deposition rates and operating factors for quoting.')],
        });
    },
    "lap-joint-length": (v) => {
      const Lreq = v.factor * v.t * v.sm / v.tau, member = v.w * v.t * v.sm, joint = v.w * v.L * v.tau, okL = v.L >= Lreq, okLoad = !v.load || joint >= v.load;
      return output({ Lreq, ratio: Lreq / v.t, member, joint }, 'Overlap needed (mm)', Lreq,
        [m('Overlap needed', q(Lreq, 'mm', 2)), m('Overlap / thickness', q(Lreq / v.t, '× t', 1)), m('Member capacity', q(member / 1000, 'kN', 2)), m('Joint capacity at chosen overlap', q(joint / 1000, 'kN', 2))],
        'Overlap to develop the member strength.', 'Uniform shear assumed.', {
          text: okL && okLoad ? 'OVERLAP ADEQUATE' : 'OVERLAP SHORT', tone: okL && okLoad ? 'good' : 'bad',
          checks: [check('Chosen overlap', okL ? 'pass' : 'fail', `${q(v.L, 'mm', 1)} against ${q(Lreq, 'mm', 1)} needed.`), check('Service load', !v.load ? 'verify' : okLoad ? 'pass' : 'fail', !v.load ? 'Enter a load to check it.' : `${q(v.load / 1000, 'kN', 2)} against ${q(joint / 1000, 'kN', 2)}.`)],
        });
    },
    "coating-coverage": (v) => {
      const liquid = v.type === 'liquid', theo = liquid ? 10 * v.vs / v.dft : 1000 / (v.density * v.dft), prac = theo * v.te / 100, qty = v.area / prac, cost = qty * v.price, unit = liquid ? 'L' : 'kg';
      return output({ theo, prac, qty, cost }, `Quantity needed (${unit})`, qty,
        [m('Theoretical coverage', q(theo, `m²/${unit}`, 2)), m('Practical coverage', q(prac, `m²/${unit}`, 2)), m('Quantity needed', q(qty, unit, 2)), m('Material cost', money(cost)), m('Cost per m²', money(cost / v.area))],
        'Coating quantity for one coat.', 'One coat; losses beyond transfer efficiency excluded.', {
          checks: [check('Transfer efficiency', 'verify', 'Calibrate transfer efficiency from actual consumption.')],
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
