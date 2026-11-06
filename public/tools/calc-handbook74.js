// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook74). SI units are explicit at each boundary.
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
    "boring-bar-overhang-check": (v) => {
      const E = v.E * 1000, I = PI * v.D ** 4 / 64, A = PI * v.D ** 2 / 4, Fc = v.kc * v.ap * v.f, Fr = v.rr * Fc, k = 3 * E * I / v.L ** 3, dt = Fc / k, dr = Fr / k, err = 2 * dr * 1000, LD = v.L / v.D;
      const fn = 1.8751 ** 2 / (2 * PI) * Math.sqrt(v.E * 1e9 * I * 1e-12 / (v.rho * A * 1e-6 * (v.L / 1000) ** 4)), da = v.allow / 2000, Lmax = Fr > 0 ? Math.cbrt(3 * E * I * da / Fr) : Infinity, fMax = err > 0 ? v.f * v.allow / err : Infinity;
      const errAlt = err * v.E / v.Ealt, fnAlt = fn * Math.sqrt((v.Ealt / v.rhoAlt) / (v.E / v.rho)), LmaxAlt = Lmax * Math.cbrt(v.Ealt / v.E);
      if (!Number.isFinite(Lmax)) return invalid('Enter a radial force share above zero to find the longest overhang.');
      const okE = err <= v.allow + 1e-9, okL = LD <= v.LDmax + 1e-9, ok = okE && okL;
      return output({ Fc, Fr, k, dt, dr, err, LD, fn, Lmax, fMax, errAlt, fnAlt, LmaxAlt }, 'Diameter error from bar deflection (µm)', err,
        [m('Cutting / radial force', `${q(Fc, '', 0)} / ${q(Fr, 'N', 0)}`), m('Bar stiffness at the tip', q(k, 'N/mm', 0)), m('Tip deflection, tangential / radial', `${q(dt * 1000, '', 2)} / ${q(dr * 1000, 'µm', 2)}`), m('Diameter error', q(err, 'µm', 2)), m('Overhang ratio L/D', q(LD, '', 2)), m('First natural frequency', q(fn, 'Hz', 0)), m('Longest overhang for the allowance', q(Lmax, 'mm', 1)), m('Largest feed for the allowance at this overhang', q(fMax, 'mm/rev', 3)), m('Alternative bar: error / frequency / longest overhang', `${q(errAlt, 'µm', 2)} / ${q(fnAlt, 'Hz', 0)} / ${q(LmaxAlt, 'mm', 1)}`)],
        'Boring bar overhang check.', 'Solid round bar as a rigidly clamped cantilever.', {
          text: ok ? 'OVERHANG ACCEPTABLE' : !okE ? 'DEFLECTION TOO HIGH' : 'OVERHANG RATIO TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Diameter error', okE ? 'pass' : 'fail', `${q(err, 'µm', 1)} against ${q(v.allow, 'µm', 1)}${okE ? '.' : `: shorten the overhang to ${q(Lmax, 'mm', 0)}, cut the feed to ${q(fMax, 'mm/rev', 3)} or use the stiffer bar.`}`), check('Overhang ratio', okL ? 'pass' : 'fail', `L/D ${q(LD, '', 1)} against your limit of ${q(v.LDmax, '', 1)}.`), check('Chatter', 'verify', 'Keep the lead angle small on long bars and try a test cut; the static check does not predict chatter.')],
        });
    },
    "slender-work-turning-check": (v) => {
      const C = v.hold === 'centres' ? 48 : 3, E = v.E * 1000, I = PI * v.d ** 4 / 64, Fc = v.kc * v.ap * v.f, Fr = v.rr * Fc;
      if (Fr <= 0) return invalid('Enter a radial force share above zero.');
      const delta = Fr * v.L ** 3 / (C * E * I), err = 2 * delta * 1000, LD = v.L / v.d, Lmax = Math.cbrt(C * E * I * (v.allow / 2000) / Fr), spans = Math.ceil(v.L / Lmax - 1e-9), rests = v.hold === 'centres' ? Math.max(0, spans - 1) : 0, fMax = v.f * v.allow / err, ok = err <= v.allow + 1e-9;
      return output({ Fc, Fr, delta, err, LD, Lmax, rests, fMax }, 'Diameter error from work deflection (µm)', err,
        [m('Cutting / radial force', `${q(Fc, '', 0)} / ${q(Fr, 'N', 0)}`), m(v.hold === 'centres' ? 'Deflection at mid-span' : 'Deflection at the free end', q(delta * 1000, 'µm', 2)), m('Diameter error', q(err, 'µm', 1)), m('Length-to-diameter ratio', q(LD, '', 1)), m('Longest unsupported length for the allowance', q(Lmax, 'mm', 1)), m(v.hold === 'centres' ? 'Steady rests needed' : 'Steady rests', v.hold === 'centres' ? q(rests, '', 0) : 'Support the free end with the tailstock or a steady rest if the length exceeds the limit'), m('Largest feed for the full length unsupported', q(fMax, 'mm/rev', 3))],
        'Slender work turning check.', 'Uniform round beam on rigid supports.', {
          text: ok ? 'WORK STIFF ENOUGH' : 'SUPPORT OR LIGHTER CUT NEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Diameter error', ok ? 'pass' : 'fail', `${q(err, 'µm', 1)} against ${q(v.allow, 'µm', 1)}${ok ? '.' : v.hold === 'centres' ? `: fit ${q(rests, '', 0)} steady rest(s) or cut the feed to ${q(fMax, 'mm/rev', 3)}.` : `: support the end or shorten the overhang to ${q(Lmax, 'mm', 0)}.`}`), check('Shape of the error', 'verify', v.hold === 'centres' ? 'Expect a barrel shape, largest at mid-length; measure there.' : 'Expect a taper, largest at the free end; measure there.'), check('Chatter and heat', 'verify', 'Long, slender work chatters easily; keep the lead angle small and allow for growth from cutting heat.')],
        });
    },
    "reaming-plan": (v) => {
      const Dd = v.Df - v.allow;
      if (Dd <= 0) return invalid('The allowance must be smaller than the finished diameter.');
      if (v.sMax < v.sMin) return invalid('The largest stock must not be smaller than the smallest.');
      const stock = v.allow / 2, nD = 1000 * v.vcD / (PI * Dd), nR = 1000 * v.vcR / (PI * v.Df), vfD = nD * v.fD, vfR = nR * v.fR, fz = v.fR / v.z;
      const tD = (v.depth + Dd / (2 * Math.tan(rad(v.point / 2))) + v.clear) / vfD, tR = (v.depth + v.clear) / vfR * (v.retract === 'feed' ? 2 : 1), perHole = tD + tR + 2 * v.pos / 60, total = perHole * v.holes, perReamer = Math.floor(v.lifeM * 1000 / v.depth + 1e-9), reamers = perReamer > 0 ? Math.ceil(v.holes / perReamer - 1e-9) : Infinity;
      if (!Number.isFinite(reamers)) return invalid('The reamer life is shorter than one hole: check the life and the depth.');
      const okS = stock >= v.sMin - 1e-9 && stock <= v.sMax + 1e-9, okN = Math.max(nD, nR) <= v.nMax + 1e-9, ok = okS && okN;
      return output({ Dd, stock, nD, nR, vfD, vfR, fz, tD, tR, perHole, total, perReamer, reamers }, 'Total time for the batch (min)', total,
        [m('Pilot drill diameter', q(Dd, 'mm', 3)), m('Radial stock for the reamer', q(stock, 'mm', 3)), m('Drilling: speed / feed rate', `${q(nD, 'rpm', 0)} / ${q(vfD, 'mm/min', 0)}`), m('Reaming: speed / feed rate', `${q(nR, 'rpm', 0)} / ${q(vfR, 'mm/min', 0)}`), m('Feed per reamer tooth', q(fz, 'mm', 3)), m('Drilling / reaming time per hole', `${q(tD * 60, '', 1)} / ${q(tR * 60, 's', 1)}`), m('Time per hole', q(perHole * 60, 's', 1)), m('Total time', q(total, 'min', 1)), m('Holes per reamer / reamers needed', `${q(perReamer, '', 0)} / ${q(reamers, '', 0)}`)],
        'Drill and ream plan.', 'Times from travel and feed; speeds, feeds and life as entered.', {
          text: ok ? 'REAMING PLAN FEASIBLE' : !okS ? 'STOCK OUTSIDE RANGE' : 'SPINDLE SPEED TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Stock for the reamer', okS ? 'pass' : 'fail', `${q(stock, 'mm', 3)} a side against ${q(v.sMin, '', 2)}–${q(v.sMax, 'mm', 2)}${okS ? '.' : ': change the pilot drill size.'}`), check('Spindle speed', okN ? 'pass' : 'fail', `Highest needed ${q(Math.max(nD, nR), 'rpm', 0)} against ${q(v.nMax, 'rpm', 0)} available.`), check('Pilot drill', 'verify', 'Choose the nearest available drill; a drill cuts slightly oversize, so allow for it in the stock.')],
        });
    },
    "dowel-pin-joint-check": (v) => {
      if (v.pinUp < v.pinLo || v.holeUp < v.holeLo) return invalid('Each upper deviation must not be below its lower deviation.');
      const As = PI * v.d * v.d / 4, tau = v.F / (v.n * Number(v.planes) * As), tmin = Math.min(v.t1, v.t2), sb = v.F / (v.n * v.d * tmin), us = tau / v.tauA, ub = sb / v.bA, iMax = v.pinUp - v.holeLo, iMin = v.pinLo - v.holeUp, e1 = v.t1 / v.d, e2 = v.t2 / v.d;
      const fit = iMin > 0 ? 'Interference fit' : iMax < 0 ? 'Clearance fit' : 'Transition fit', okS = us <= 1 + 1e-9, okB = ub <= 1 + 1e-9, okE = Math.min(e1, e2) >= v.engReq - 1e-9, ok = okS && okB && okE;
      return output({ As, tau, sb, us, ub, iMax, iMin, e1, e2 }, 'Highest utilisation', Math.max(us, ub),
        [m('Shear stress / utilisation', `${q(tau, 'MPa', 1)} / ${q(100 * us, '%', 1)}`), m('Bearing stress / utilisation', `${q(sb, 'MPa', 1)} / ${q(100 * ub, '%', 1)}`), m('Interference, largest / smallest', `${q(iMax, '', 0)} / ${q(iMin, 'µm', 0)}`), m('Fit', fit), m('Engagement ratio, first / second part', `${q(e1, '', 2)} / ${q(e2, '', 2)} × d`)],
        `${v.n} dowel pins in ${v.planes === '2' ? 'double' : 'single'} shear.`, 'Equal sharing; no moment on the pattern.', {
          text: ok ? 'DOWELS ADEQUATE' : !okS ? 'PIN SHEAR TOO HIGH' : !okB ? 'BEARING TOO HIGH' : 'ENGAGEMENT TOO SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Pin shear', okS ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.tauA, 'MPa', 0)}.`), check('Bearing in the softer part', okB ? 'pass' : 'fail', `${q(sb, 'MPa', 1)} against ${q(v.bA, 'MPa', 0)}.`), check('Engagement', okE ? 'pass' : 'fail', `Shorter engagement ${q(Math.min(e1, e2), '', 2)} × d against ${q(v.engReq, '', 2)} × d.`), check('Fit', 'verify', `${fit} from ${q(iMin, '', 0)} to ${q(iMax, 'µm', 0)}; confirm it suits assembly and removal, and provide a way to extract blind dowels.`)],
        });
    },
    "taper-shank-holding-check": (v) => {
      const n = 1000 * v.vc / (PI * v.D), Pc = v.f * v.vc * v.D * v.kc / 240000, Tq = Pc * 30000 / (PI * n), thrust = 0.5 * v.kc * v.D / 2 * v.f * Math.sin(rad(v.point / 2));
      const a = Math.atan(v.c / 2), Dm = v.Dl - v.c * v.Le / 2;
      if (Dm <= 0) return invalid('The engaged length is too long for this taper rate and large diameter.');
      const Nn = thrust / (Math.sin(a) + v.mu * Math.cos(a)), Th = v.mu * Nn * Dm / 2 / 1000, ratio = Th / Tq, selfHold = Math.tan(a) < v.mu, ok = ratio >= v.SF - 1e-9;
      return output({ n, Pc, Tq, thrust, aDeg: deg(a), Dm, Nn, Th, ratio }, 'Taper capacity ÷ drilling torque', ratio,
        [m('Spindle speed / cutting power', `${q(n, 'rpm', 0)} / ${q(Pc, 'kW', 2)}`), m('Drilling torque', q(Tq, 'N·m', 1)), m('Approximate thrust', q(thrust, 'N', 0)), m('Taper half-angle', q(deg(a), '°', 3)), m('Mean engaged diameter', q(Dm, 'mm', 2)), m('Normal force on the taper', q(Nn, 'N', 0)), m('Taper friction torque capacity', q(Th, 'N·m', 1)), m('Capacity ratio', q(ratio, '', 2)), m('Taper type', selfHold ? 'Self-holding for this friction' : 'Self-releasing for this friction')],
        'Taper shank holding check.', 'Coulomb friction on a fully seated cone.', {
          text: ok ? 'TAPER HOLDS THE DRILL' : 'TANG OR DRAWBAR NEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Holding torque', ok ? 'pass' : 'fail', `Capacity ${q(Th, 'N·m', 1)} against ${q(Tq, 'N·m', 1)} needed: ratio ${q(ratio, '', 2)} against ${q(v.SF, '', 1)}${ok ? '.' : '; seat the taper firmly, keep it clean, and make sure the tang or a drawbar can take the torque.'}`), check('Self-holding', selfHold ? 'pass' : 'warn', selfHold ? `tan α ${q(Math.tan(a), '', 4)} is below μ ${q(v.mu, '', 2)}: the taper stays seated.` : `tan α ${q(Math.tan(a), '', 4)} is not below μ ${q(v.mu, '', 2)}: the taper can release and needs a drawbar.`), check('Condition of the taper', 'verify', 'Clean and inspect both tapers; burrs or dirt reduce the contact and the holding torque.')],
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
