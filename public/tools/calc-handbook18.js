// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook18). SI units are explicit at each boundary.
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
    "bend-radius-limits": (v) => {
      const Rmin = Math.max(0, v.t * (50 / v.r - 1)), Rmax = v.t * v.E * 1000 / (2 * v.YS), ok = v.R >= Rmin && v.R <= Rmax;
      return output({ Rmin, Rmax }, 'Minimum bend radius (mm)', Rmin,
        [m('Minimum bend radius', q(Rmin, 'mm', 2)), m('Maximum radius for a permanent bend', q(Rmax, 'mm', 0)), m('Planned radius', q(v.R, 'mm', 2)), m('Planned radius ÷ thickness', q(v.R / v.t, '', 2))],
        'Formability limits for the bend.', 'Handbook formulas.', {
          text: ok ? 'RADIUS ACCEPTABLE' : v.R < Rmin ? 'RADIUS TOO TIGHT' : 'RADIUS TOO LARGE TO FORM', tone: ok ? 'good' : 'bad',
          checks: [check('Cracking', v.R >= Rmin ? 'pass' : 'fail', `${q(v.R, 'mm', 2)} against a minimum of ${q(Rmin, 'mm', 2)}.`), check('Permanent bend', v.R <= Rmax ? 'pass' : 'fail', v.R <= Rmax ? 'The bend will set.' : 'The bend would spring back almost completely.'), check('Grain direction', 'verify', 'Bends along the rolling direction need more radius.')],
        });
    },
    "anodizing-time": (v) => {
      const rate = 25.4 * 9.290304 / 720 * v.J * v.eff / 100, minutes = v.thick / rate, build = v.thick / 3;
      return output({ rate, minutes, build, I: v.J * v.area }, 'Anodizing time (min)', minutes,
        [m('Growth rate', q(rate, 'µm/min', 3)), m('Time to target thickness', q(minutes, 'min', 1)), m('Build-up per surface', q(build, 'µm', 1)), m('Diameter growth (both sides)', q(2 * build, 'µm', 1)), m('Rectifier current', q(v.J * v.area, 'A', 0))],
        'Anodizing time by the 720 rule.', 'Sulfuric acid anodizing rule of thumb.', { checks: [check('Thickness measurement', 'verify', 'Measure coating thickness and adjust the efficiency factor.')] });
    },
    "gating-choke-area": (v) => {
      const vel = Math.sqrt(2 * 9.80665 * v.h / 1000), A = v.W / (v.rho * v.t * v.Cd * vel) * 1e6, dia = Math.sqrt(4 * A / PI);
      return output({ vel, A, dia }, 'Choke area (mm²)', A,
        [m('Metal velocity at choke', q(vel, 'm/s', 2)), m('Choke area', q(A, 'mm²', 0)), m('Equivalent round sprue diameter', q(dia, 'mm', 1)), m('Runner area', q(A * v.runner, 'mm²', 0)), m('Total gate area', q(A * v.gate, 'mm²', 0))],
        'Gating areas for the pour.', 'Bernoulli model with flow efficiency.', { checks: [check('Gate velocity', vel / v.gate <= 0.5 ? 'pass' : 'warn', `Gate velocity about ${q(vel / v.gate, 'm/s', 2)}; aluminium is usually kept below about 0.5 m/s at the gates.`)] });
    },
    "cnc-chord-error": (v) => {
      let L, e;
      if (v.mode === 'seg') { if (v.tol >= v.R) return invalid('The tolerance must be smaller than the radius.'); e = v.tol; L = 2 * Math.sqrt(2 * v.R * e - e * e); }
      else { if (v.L >= 2 * v.R) return invalid('The segment must be shorter than the diameter.'); L = v.L; e = v.R * (1 - Math.cos(Math.asin(L / (2 * v.R)))); }
      const th = 2 * Math.asin(L / (2 * v.R)), n = Math.ceil(rad(v.angle) / th - 1e-9);
      return output({ L, e, th: deg(th), n }, v.mode === 'seg' ? 'Segment length (mm)' : 'Chord error (mm)', v.mode === 'seg' ? L : e,
        [m('Segment length', q(L, 'mm', 4)), m('Chord error', `${q(e, 'mm', 5)} (${q(e * 1000, 'µm', 2)})`), m('Angle per segment', q(deg(th), '°', 4)), m('Segments for the arc', String(n))],
        'Chord error of the linearised arc.', 'One-sided tolerance.', { checks: [check('Program size', n <= 10000 ? 'pass' : 'warn', `${n} segments for this arc.`)] });
    },
    "chip-thickness-kc": (v) => {
      let hm, phi = null;
      if (v.op === 'mill') { if (v.ae > v.D) return invalid('The radial engagement cannot exceed the cutter diameter.'); phi = deg(Math.acos(1 - 2 * v.ae / v.D)); hm = 360 * v.fz * Math.sin(rad(v.kappa)) * v.ae / (PI * v.D * phi); }
      else hm = v.fz * Math.sin(rad(v.kappa));
      const kc = v.kc1 * Math.pow(hm, -v.mc) * (1 - v.rake / 100);
      return output({ hm, phi, kc }, 'Specific cutting force (N/mm²)', kc,
        [m('Mean chip thickness', q(hm, 'mm', 4)), m('Engagement angle', phi === null ? 'Turning (not applicable)' : q(phi, '°', 1)), m('Specific cutting force kc', q(kc, 'N/mm²', 0))],
        'Chip thickness and the matching specific cutting force.', 'Tooling data for kc1.1 and mc.', { checks: [check('Material data', 'verify', 'Use kc1.1 and mc for the actual material grade and condition.')] });
    },
    "grinding-geometry": (v) => {
      let De; if (v.type === 'ext') De = v.ds * v.dw / (v.dw + v.ds); else if (v.type === 'int') { if (v.ds >= v.dw) return invalid('For internal grinding the wheel must be smaller than the bore.'); De = v.ds * v.dw / (v.dw - v.ds); } else De = v.ds;
      const lg = Math.sqrt(v.ae * De), G = v.Vs > 0 && v.Vw > 0 ? v.Vw / v.Vs : null;
      return output({ De, lg, G }, 'Equivalent diameter (mm)', De,
        [m('Equivalent wheel diameter', q(De, 'mm', 2)), m('Geometric contact length', q(lg, 'mm', 3)), m('G-ratio', G === null ? 'Not entered' : q(G, '', 1))],
        'Grinding contact geometry.', 'Geometric contact length.', { checks: [check('Wheel wear data', G === null ? 'verify' : 'pass', G === null ? 'Enter removed and worn volumes for the G-ratio.' : 'G-ratio calculated from the entered volumes.')] });
    },
    "thread-milling-path": (v) => {
      const int = v.type === 'int', pathD = int ? v.D - v.dc : v.D + v.dc;
      if (pathD <= 0) return invalid('The cutter is too large for this internal thread.');
      const fe = v.rpm * v.z * v.fz, fc = fe * pathD / v.D, revs = v.L / v.P * v.passes, helix = Math.sqrt((PI * pathD) ** 2 + v.P * v.P), minutes = revs * helix / fc;
      return output({ pathD, fe, fc, revs, minutes }, 'Programmed centre feed (mm/min)', fc,
        [m('Tool-centre path diameter', q(pathD, 'mm', 3)), m('Feed at cutting edge', q(fe, 'mm/min', 0)), m('Programmed centre feed', q(fc, 'mm/min', 0)), m('Helical revolutions', q(revs, '', 1)), m('Milling time', `${q(minutes * 60, 's', 1)}`)],
        'Thread milling path and feed.', 'Single-form cutter; entry and exit excluded.', { checks: [check('Cutter size', int ? (v.dc <= 0.75 * v.D ? 'pass' : 'warn') : 'pass', int ? 'Cutters over about 70–75% of the bore make arc entry difficult.' : 'External thread.')] });
    },
    "angular-indexing": (v) => {
      const angle = v.deg + v.min / 60, per = 360 / v.ratio, turns = angle / per, whole = Math.floor(turns + 1e-12), frac = turns - whole;
      const circles = v.plates === 'bs' ? [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49] : [24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66];
      let best = null; for (const c of circles) { const holes = Math.round(frac * c), got = (whole + holes / c) * per, err = got - angle; if (!best || Math.abs(err) < Math.abs(best.err) - 1e-12) best = { c, holes, got, err }; }
      const errSec = best.err * 3600, setting = best.holes ? `${whole} turns and ${best.holes} holes in the ${best.c}-hole circle` : `${whole} whole turns`;
      return output({ turns, errSec, setting }, 'Crank turns', turns,
        [m('Crank turns required', q(turns, '', 6)), m('Best setting', setting), m('Angle obtained', `${q(best.got, '°', 5)}`), m('Error', q(errSec, '″', 1))],
        'Angular indexing setting.', 'Simple indexing with standard plates.', {
          text: Math.abs(errSec) < 0.5 ? 'EXACT' : 'APPROXIMATE', tone: Math.abs(errSec) < 30 ? 'good' : 'warn',
          checks: [check('Angular error', Math.abs(errSec) < 30 ? 'pass' : 'warn', `${q(errSec, '″', 1)} error.`)],
        });
    },
    "bolted-joint-fatigue": (v) => {
      const sa = v.C * v.P * 1000 / (2 * v.At), si = v.Fi * 1000 / v.At, sm = sa + si;
      if (si >= v.Sut) return invalid('The preload stress is at or above the tensile strength.');
      const n = v.Se * (v.Sut - si) / (v.Sut * sa + v.Se * (sm - si)), vd = verdict(n, v.req, 'FATIGUE SAFE', 'FATIGUE RISK');
      return output({ sa, sm, si, n }, 'Fatigue safety factor', n,
        [m('Alternating stress', q(sa, 'MPa', 1)), m('Mean stress', q(sm, 'MPa', 1)), m('Preload stress', q(si, 'MPa', 0)), m('Goodman fatigue factor', q(n, '', 2))],
        'Bolt fatigue under a zero-to-maximum external load.', 'Concentric, non-separating joint.', {
          text: vd.text, tone: vd.tone,
          checks: [check('Fatigue safety factor', vd.st, `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Joint separation', 'verify', 'Confirm the joint does not separate at the peak load (bolted joint tool).')],
        });
    },
    "machine-hour-rate": (v) => {
      const i = v.rate / 100, ap = i === 0 ? 1 / v.life : i * (1 + i) ** v.life / ((1 + i) ** v.life - 1), capital = (v.price - v.salvage) * ap + v.salvage * i;
      const fixedH = (capital + v.space + v.maint) / v.hours, power = v.kW * v.elec, machine = fixedH + power + v.tooling, total = machine + v.labour;
      return output({ capital, machine, total, machineText: money(machine), totalText: money(total) }, 'Machine rate (AUD/h)', machine,
        [m('Capital recovery per year', money(capital)), m('Capital per hour', money(capital / v.hours)), m('Power per hour', money(power)), m('Machine rate', money(machine)), m('Machine and operator rate', money(total))],
        'Hourly cost of the machine.', 'Direct machine costs; factory overheads separate.', {
          table: tbl('Hourly cost breakdown', ['Item', 'AUD per hour'], [['Capital recovery', money(capital / v.hours)], ['Floor space', money(v.space / v.hours)], ['Maintenance', money(v.maint / v.hours)], ['Power', money(power)], ['Tooling and consumables', money(v.tooling)], ['Operator', money(v.labour)]]),
          checks: [check('Productive hours', 'verify', 'Base hours on measured utilisation, not shift length.')],
        });
    },
    "benefit-cost-ratio": (v) => {
      const i = v.rate / 100, pa = i === 0 ? v.n : (1 - (1 + i) ** -v.n) / i, pf = (1 + i) ** -v.n, PVB = v.B * pa, PVOC = v.C * pa, PVS = v.S * pf, PVC = v.P + PVOC - PVS;
      if (PVC <= 0) return invalid('The present value of costs must be positive.');
      const bc = PVB / PVC, mod = v.P - PVS > 0 ? (PVB - PVOC) / (v.P - PVS) : null, ok = bc > 1;
      return output({ PVB, PVC, bc, mod, net: PVB - PVC }, 'Benefit–cost ratio', bc,
        [m('PV of benefits', money(PVB)), m('PV of costs', money(PVC)), m('Benefit–cost ratio', q(bc, '', 3)), m('Modified B/C', mod === null ? 'Not defined' : q(mod, '', 3)), m('Net present benefit', money(PVB - PVC))],
        ok ? 'Benefits exceed costs in present value.' : 'Costs exceed benefits in present value.', 'Level annual amounts.', {
          text: ok ? 'BENEFITS EXCEED COSTS' : 'COSTS EXCEED BENEFITS', tone: ok ? 'good' : 'bad',
          checks: [check('B/C above 1', ok ? 'pass' : 'fail', `B/C = ${q(bc, '', 2)}.`), check('Benefit evidence', 'verify', 'Base benefits on measured or well-supported data.')],
        });
    },
    "speed-series": (v) => {
      if (v.max <= v.min) return invalid('The largest value must exceed the smallest.');
      const phi = Math.pow(v.max / v.min, 1 / (v.steps - 1)), vals = Array.from({ length: v.steps }, (_, k) => v.min * phi ** k);
      const R = [['R5', 1.585], ['R10', 1.259], ['R20', 1.122], ['R40', 1.059], ['R80', 1.029]], near = R.reduce((a, b) => (Math.abs(Math.log(b[1] / phi)) < Math.abs(Math.log(a[1] / phi)) ? b : a));
      return output({ phi }, 'Step ratio', phi,
        [m('Step ratio φ', q(phi, '', 5)), m('Percentage step', q(100 * (phi - 1), '%', 2)), m('Nearest Renard series', `${near[0]} (${near[1]})`)],
        `${v.steps}-value geometric series.`, 'Geometric progression.', {
          table: tbl('Series values', ['Step', 'Value'], vals.map((x, k) => [String(k + 1), q(x, '', 3)])),
          checks: [check('Step size', phi <= 1.6 ? 'pass' : 'warn', phi <= 1.6 ? 'Reasonable steps.' : 'Large steps leave wide gaps between values.')],
        });
    },
    "factors-gcd": (v) => {
      const gcd = (x, y) => (y ? gcd(y, x % y) : x), fac = (n) => { const out = []; let x = n; for (let p = 2; p * p <= x; p++) while (x % p === 0) { out.push(p); x /= p; } if (x > 1) out.push(x); return out.length ? out.join(' × ') : '1'; };
      let g = gcd(v.a, v.b), l = v.a / g * v.b; if (v.c) { g = gcd(g, v.c); l = l / gcd(l, v.c) * v.c; }
      const hunting = gcd(v.a, v.b) === 1;
      return output({ g, l, fa: fac(v.a), fb: fac(v.b) }, 'Greatest common divisor', g,
        [m(`Factors of ${v.a}`, fac(v.a)), m(`Factors of ${v.b}`, fac(v.b)), ...(v.c ? [m(`Factors of ${v.c}`, fac(v.c))] : []), m('Greatest common divisor', String(g)), m('Least common multiple', String(l)), m('Hunting-tooth pair (first two)', hunting ? 'Yes (no common factor)' : `No (common factor ${gcd(v.a, v.b)})`)],
        'Factors and common multiples.', 'Exact integer arithmetic.', { checks: [check('Hunting tooth', hunting ? 'pass' : 'warn', hunting ? 'Even wear distribution for a gear pair.' : 'Teeth meet in repeating groups; consider adding or removing a tooth.')] });
    },
    "rack-pinion": (v) => {
      const d = v.m * v.z, travel = PI * d, vel = travel * v.rpm / 1000, F = 2 * v.T * 1000 / d * v.eff / 100, nreq = v.vreq > 0 ? v.vreq * 1000 / travel : null;
      return output({ d, travel, v: vel, F, nreq }, 'Thrust force (N)', F,
        [m('Pitch diameter', q(d, 'mm', 2)), m('Travel per revolution', q(travel, 'mm', 3)), m('Linear speed', q(vel, 'm/min', 2)), m('Thrust force', q(F, 'N', 0)), m('Pinion speed for required speed', nreq === null ? 'No speed entered' : q(nreq, 'rpm', 1))],
        'Rack and pinion drive.', 'Mesh efficiency only.', { checks: [check('Guide friction and acceleration', 'verify', 'Add guide friction and acceleration forces before sizing the motor.')] });
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
