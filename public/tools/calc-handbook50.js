// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook50). SI units are explicit at each boundary.
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
    "shaft-alignment-plan": (v) => {
      const offset = v.rim / 2, slope = v.face / v.dia, front = offset + slope * v.front, back = offset + slope * v.back, g1 = v.a1 * 1e-6 * v.H1 * v.dT1, g2 = v.a2 * 1e-6 * v.H2 * v.dT2, th = g2 - g1;
      const cFront = front - th, cBack = back - th, runOff = offset - th, ang = slope * 100, okO = Math.abs(runOff) <= v.tolOff + 1e-12, okA = Math.abs(ang) <= v.tolAng + 1e-12, ok = okO && okA, tag = (x) => (x >= 0 ? `add ${q(x, 'mm', 3)}` : `remove ${q(-x, 'mm', 3)}`);
      return output({ offset, slope, front, back, g1, g2, th, cFront, cBack, runOff, ang }, 'Cold correction at the back feet (mm)', cBack,
        [m('Offset / angularity as read', `${q(offset, 'mm', 3)} / ${q(ang, 'mm/100 mm', 3)}`), m('Thermal growth: stationary / movable', `${q(g1, '', 3)} / ${q(g2, 'mm', 3)}`), m('Movable machine grows more by', q(th, 'mm', 3)), m('Cold correction at the front feet', tag(cFront)), m('Cold correction at the back feet', tag(cBack)), m('Running offset if unchanged', q(runOff, 'mm', 3))],
        'Shaft alignment plan.', 'Vertical plane; rigid feet.', {
          text: ok ? 'ALIGNMENT OK WHEN HOT' : 'REALIGN', tone: ok ? 'good' : 'bad',
          checks: [check('Running offset', okO ? 'pass' : 'fail', `${q(Math.abs(runOff), 'mm', 3)} against ${q(v.tolOff, 'mm', 3)}.`), check('Angularity', okA ? 'pass' : 'fail', `${q(Math.abs(ang), 'mm/100 mm', 3)} against ${q(v.tolAng, 'mm/100 mm', 3)}.`), check('Soft foot', 'verify', 'Check and correct soft foot before shimming.')],
        });
    },
    "helical-gear-milling-setup": (v) => {
      const D = v.mn * v.z / Math.cos(rad(v.beta)), lead = PI * D / Math.tan(rad(v.beta)), req = lead / v.Lm, set = v.set === 'std' ? [24, 24, 28, 32, 40, 44, 48, 56, 64, 72, 86, 100] : Array.from({ length: 20 }, (_, i) => 24 + 4 * i);
      let best = null;
      for (let i = 0; i < set.length; i++) for (let j = 0; j < set.length; j++) for (let k = 0; k < set.length; k++) for (let l = 0; l < set.length; l++) {
        if (new Set([i, j, k, l]).size < 4) continue; const r = set[j] * set[l] / (set[i] * set[k]), e = Math.abs(r / req - 1);
        if (!best || e < best.e) best = { dr: [set[i], set[k]], dn: [set[j], set[l]], r, e };
      }
      const err = Math.abs(best.r / req - 1) < 1e-12 ? 0 : 100 * (best.r / req - 1), train = `drivers ${best.dr[0]} and ${best.dr[1]}, driven ${best.dn[0]} and ${best.dn[1]}`;
      const Nf = v.z / Math.cos(rad(v.beta)) ** 3, reg = [[135, '1'], [55, '2'], [35, '3'], [26, '4'], [21, '5'], [17, '6'], [14, '7'], [12, '8']], cutter = (reg.find((r) => Nf >= r[0]) || [0, 'below range'])[1];
      const circles = v.plates === 'bs' ? [15, 16, 17, 18, 19, 20, 21, 23, 27, 29, 31, 33, 37, 39, 41, 43, 47, 49] : [24, 25, 28, 30, 34, 37, 38, 39, 41, 42, 43, 46, 47, 49, 51, 53, 54, 57, 58, 59, 62, 66];
      const whole = Math.floor(v.ratio / v.z), rem = v.ratio % v.z, opts = rem === 0 ? [] : circles.filter((h) => (rem * h) % v.z === 0), found = rem === 0 || opts.length > 0, circle = opts[0] || 0, holes = circle ? rem * circle / v.z : 0;
      const setting = rem === 0 ? `${whole} whole turns` : found ? `${whole} turns and ${holes} holes in the ${circle}-hole circle` : 'differential or angular indexing';
      const Do = D + 2 * v.mn, depth = v.mn * (1 + v.ded), okL = Math.abs(err) <= v.tol, ok = okL && found && Nf >= 12;
      return output({ D, lead, req, err, train, Nf, cutter, whole, rem, holes, circle, setting, Do, depth }, 'Lead of the helix (mm)', lead,
        [m('Pitch diameter', q(D, 'mm', 3)), m('Lead of the helix', q(lead, 'mm', 2)), m('Table swivel', q(v.beta, '°', 2)), m('Change gears', train), m('Lead error', q(err, '%', 4)), m('Formative teeth / cutter number', `${q(Nf, '', 1)} / No. ${cutter}`), m('Index setting', setting), m('Blank diameter / depth of cut', `${q(Do, '', 3)} / ${q(depth, 'mm', 3)}`)],
        'Helical gear milling set-up.', 'Form cutter; universal dividing head.', {
          text: ok ? 'SET-UP FOUND' : 'SET-UP NOT FOUND', tone: ok ? 'good' : 'bad',
          checks: [check('Lead error', okL ? 'pass' : 'fail', `${q(err, '%', 4)} against ±${q(v.tol, '%', 3)}.`), check('Indexing', found ? 'pass' : 'fail', found ? setting.charAt(0).toUpperCase() + setting.slice(1) + '.' : 'No index circle divides this tooth count: use differential or angular indexing.'), check('Cutter range', Nf >= 12 ? 'pass' : 'fail', Nf >= 12 ? `Cutter No. ${cutter}.` : 'Fewer than 12 formative teeth is below the cutter range.'), check('Gear fit and hand', 'verify', 'Confirm the gears fit the quadrant and swivel the table for the hand of helix.')],
        });
    },
    "machine-rate-quote-check": (v) => {
      if (v.salvage >= v.price) return invalid('The resale value must be less than the machine cost.');
      const i = v.rate / 100, ap = i === 0 ? 1 / v.life : i * (1 + i) ** v.life / ((1 + i) ** v.life - 1), capital = (v.price - v.salvage) * ap + v.salvage * i;
      const fixedH = (capital + v.space + v.maint) / v.hours, power = v.kW * v.elec, machine = fixedH + power + v.tooling, total = machine + v.labour;
      const jobH = v.setup + v.qty * v.cycle / 60, job = jobH * total + v.qty * v.mat, perPart = job / v.qty, margin = v.quote > 0 ? (v.quote - perPart) / v.quote * 100 : -Infinity, minPrice = perPart / (1 - v.mTarget / 100), setupShare = v.setup * total / v.qty, ok = margin >= v.mTarget - 1e-9;
      return output({ capital, machine, total, jobH, job, perPart, margin, minPrice, setupShare }, 'Cost per part (AUD)', perPart,
        [m('Capital recovery per year', money(capital)), m('Machine rate / with operator', `${money(machine)} / ${money(total)} per hour`), m('Job hours', q(jobH, 'h', 2)), m('Job cost', money(job)), m('Cost per part', money(perPart)), m('Set-up share per part', money(setupShare)), m('Margin at the quoted price', q(margin, '%', 1)), m('Least price for the margin wanted', money(minPrice))],
        'Machine rate quote check.', 'Machine and operator costs only.', {
          text: ok ? 'QUOTE COVERS COST' : 'QUOTE TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Margin', ok ? 'pass' : 'fail', `${q(margin, '%', 1)} against ${q(v.mTarget, '%', 0)} wanted${ok ? '.' : `: quote at least ${money(minPrice)}.`}`), check('Utilisation', 'verify', `The rate assumes ${q(v.hours, 'h', 0)} productive hours a year.`)],
        });
    },
    "crane-load-swing-check": (v) => {
      const g = 9.80665, W = v.mass * g, h = v.v * v.v / (2 * g);
      if (h >= v.L) return invalid('At this speed the load would swing above the trolley: the rope would go slack.');
      const th = Math.acos(1 - h / v.L), A = v.L * Math.sin(th), T = 2 * PI * Math.sqrt(v.L / g), Tc = T * (1 + th * th / 16), Tmax = W + v.mass * v.v * v.v / v.L, dyn = Tmax / W;
      const c = Math.min(v.clear, v.L), vMax = Math.sqrt(2 * g * v.L * (1 - Math.cos(Math.asin(c / v.L)))), okA = A <= v.clear + 1e-12, okT = Tmax / 1000 <= v.SWL, ok = okA && okT;
      return output({ T, Tc, theta: deg(th), A, h, Tmax, dyn, vMax }, 'Horizontal swing (m)', A,
        [m('Period of swing', `${q(Tc, 's', 2)} (${q(T, 's', 2)} small swing)`), m('Swing angle', q(deg(th), '°', 2)), m('Horizontal swing', q(A, 'm', 3)), m('Rise of the load', q(h * 1000, 'mm', 1)), m('Rope tension at the bottom of the swing', `${q(Tmax / 1000, 'kN', 2)} (× ${q(dyn, '', 3)})`), m('Largest travel speed for the clearance', q(vMax, 'm/s', 2))],
        'Crane load swing check.', 'Abrupt stop; single pendulum.', {
          text: ok ? 'SWING WITHIN LIMITS' : 'SWING NOT ACCEPTABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Clearance', okA ? 'pass' : 'fail', `${q(A, 'm', 2)} swing against ${q(v.clear, 'm', 2)}${okA ? '.' : `: travel at ${q(vMax, 'm/s', 2)} or less.`}`), check('Rope load', okT ? 'pass' : 'fail', `${q(Tmax / 1000, 'kN', 2)} against ${q(v.SWL, 'kN', 1)}.`), check('Tag lines', 'verify', 'Use tag lines and stop gently to control swing.')],
        });
    },
    "nested-spring-check": (v) => {
      const G = v.G * 1000, sp = (d, D, Na) => { const k = G * d ** 4 / (8 * D ** 3 * Na), C = D / d, K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, Nt = { cg: Na + 2, c: Na + 2, pg: Na + 1, p: Na }[v.ends], Ls = (v.ends === 'cg' || v.ends === 'pg' ? Nt : Nt + 1) * d, F = k * (v.L0 - v.Lw), tau = K * 8 * F * D / (PI * d ** 3), tauS = K * 8 * k * (v.L0 - Ls) * D / (PI * d ** 3); return { k, C, K, Ls, F, tau, tauS }; };
      if (v.Do <= v.do || v.Di <= v.di) return invalid('Each mean diameter must be larger than its wire diameter.');
      if (v.Lw > v.L0) return invalid('The working length must not exceed the unloaded length.');
      const o = sp(v.do, v.Do, v.Nao), n = sp(v.di, v.Di, v.Nai), Ls = Math.max(o.Ls, n.Ls);
      if (v.Lw < Ls) return invalid(`The working length is below the solid length (${q(Ls, 'mm', 2)}).`);
      const k = o.k + n.k, F = o.F + n.F, clear = ((v.Do - v.do) - (v.Di + v.di)) / 2, okO = o.tau <= v.allow, okI = n.tau <= v.allow, okF = F >= v.need, okC = clear >= v.cMin, ok = okO && okI && okF && okC;
      return output({ ko: o.k, ki: n.k, k, Fo: o.F, Fi: n.F, F, tauO: o.tau, tauI: n.tau, tauSO: o.tauS, tauSI: n.tauS, LsO: o.Ls, LsI: n.Ls, clear, share: o.F / F * 100 }, 'Total load at the working length (N)', F,
        [m('Rates: outer / inner / combined', `${q(o.k, '', 3)} / ${q(n.k, '', 3)} / ${q(k, 'N/mm', 3)}`), m('Loads: outer / inner', `${q(o.F, '', 1)} / ${q(n.F, 'N', 1)} (outer carries ${q(o.F / F * 100, '%', 0)})`), m('Total load', q(F, 'N', 1)), m('Stress: outer / inner', `${q(o.tau, '', 0)} / ${q(n.tau, 'MPa', 0)}`), m('Stress at solid: outer / inner', `${q(o.tauS, '', 0)} / ${q(n.tauS, 'MPa', 0)}`), m('Solid length: outer / inner', `${q(o.Ls, '', 2)} / ${q(n.Ls, 'mm', 2)}`), m('Radial clearance between springs', q(clear, 'mm', 2))],
        'Nested spring check.', 'Equal unloaded lengths; static load.', {
          text: ok ? 'SPRING SET ADEQUATE' : 'SPRING SET NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Outer stress', okO ? 'pass' : 'fail', `${q(o.tau, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Inner stress', okI ? 'pass' : 'fail', `${q(n.tau, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Load', okF ? 'pass' : 'fail', `${q(F, 'N', 0)} against ${q(v.need, 'N', 0)} needed.`), check('Radial clearance', okC ? 'pass' : 'fail', `${q(clear, 'mm', 2)} against ${q(v.cMin, 'mm', 2)}.`), check('Coil hand', 'verify', 'Wind the springs in opposite hands.')],
        });
    },
    "spun-cone-plan": (v) => {
      if (v.Ds >= v.Dl) return invalid('The small diameter must be less than the large diameter.');
      const T = v.Tw / Math.sin(rad(v.alpha)), red = (1 - v.Tw / T) * 100, Ft = v.sf * (T - v.Tw) * v.f, vs = PI * v.Dl * v.rpm / 60000, P = Ft * vs, mass = PI / 4 * (v.Dl / 1000) ** 2 * T / 1000 * v.rho;
      const Lax = (v.Dl - v.Ds) / 2 / Math.tan(rad(v.alpha)), time = Lax / (v.f * v.rpm), okR = red <= v.redMax, okP = P / 1000 <= v.Pm, ok = okR && okP;
      return output({ T, red, Ft, vs, P, mass, Lax, time }, 'Blank thickness (mm)', T,
        [m('Blank thickness', q(T, 'mm', 3)), m('Blank diameter / mass', `${q(v.Dl, 'mm', 0)} / ${q(mass, 'kg', 2)}`), m('Thickness reduction', q(red, '%', 1)), m('Tangential roller force', q(Ft, 'N', 0)), m('Surface speed at the large end', q(vs, 'm/s', 2)), m('Power at the roller', q(P / 1000, 'kW', 2)), m('Cone axial length', q(Lax, 'mm', 1)), m('Spinning time', q(time * 60, 's', 1))],
        'Shear spun cone plan.', 'Sine-law deformation; single pass.', {
          text: ok ? 'SPINNING FEASIBLE' : 'SPINNING NOT FEASIBLE', tone: ok ? 'good' : 'bad',
          checks: [check('Reduction', okR ? 'pass' : 'fail', `${q(red, '%', 1)} against ${q(v.redMax, '%', 0)}${okR ? '.' : ': spin in two passes or anneal between them.'}`), check('Power', okP ? 'pass' : 'fail', `${q(P / 1000, 'kW', 2)} against ${q(v.Pm, 'kW', 1)}.`), check('Roller and mandrel', 'verify', 'Check roller nose radius and mandrel strength for the force.')],
        });
    },
    "moulded-part-cost": (v) => {
      if (v.Te <= v.Tw || v.Tm <= v.Te) return invalid('Temperatures must satisfy mould < ejection < melt.');
      const A = v.cav * v.Ap + v.Ar, F = A * 100 * v.pc * (1 + v.marg / 100) / 1000, shot = v.cav * v.Vp + v.Vr, use = shot / v.barrel * 100, mass = shot * v.rho;
      const tc = v.s ** 2 / (PI * PI * v.a) * Math.log(4 / PI * (v.Tm - v.Tw) / (v.Te - v.Tw)), cycle = tc + v.tOther, pph = v.cav * 3600 / cycle, good = 1 - v.scrap / 100;
      const cMach = v.rateM / (pph * good), cMat = mass / v.cav / 1000 * v.resin / good, cMould = v.mould / v.life, cost = cMach + cMat + cMould, okC = F <= v.clamp, okS = use >= 20 && use <= 80, okT = cost <= v.target, ok = okC && okS && okT;
      return output({ F, shot, use, mass, tc, cycle, pph, cMach, cMat, cMould, cost }, 'Cost per good part ($)', cost,
        [m('Clamp force needed', q(F, 'kN', 0)), m('Shot volume / barrel use', `${q(shot, 'cm³', 1)} / ${q(use, '%', 0)}`), m('Cooling time / cycle', `${q(tc, '', 1)} / ${q(cycle, 's', 1)}`), m('Parts per hour', q(pph, '', 0)), m('Machine cost per part', money(cMach)), m('Plastic cost per part', money(cMat)), m('Mould cost per part', money(cMould)), m('Cost per good part', money(cost))],
        'Injection moulded part cost.', 'Plate cooling; average cavity pressure.', {
          text: !(okC && okS) ? 'MACHINE NOT SUITABLE' : okT ? 'COST WITHIN TARGET' : 'COST ABOVE TARGET', tone: ok ? 'good' : 'bad',
          checks: [check('Clamp force', okC ? 'pass' : 'fail', `${q(F, 'kN', 0)} against ${q(v.clamp, 'kN', 0)}.`), check('Shot size', okS ? 'pass' : 'fail', `${q(use, '%', 0)} of capacity; 20–80% avoids long residence time and short shots.`), check('Cost', okT ? 'pass' : 'fail', `${money(cost)} against ${money(v.target)} target.`)],
        });
    },
    "dynamometer-cooling-plan": (v) => {
      const W = v.tare - v.zero; if (W <= 0) return invalid('The scale reading must exceed the zero reading.');
      const T = W * v.L, P = 2 * PI * v.n / 60 * T, heat = P / 1000 * v.share / 100, Q = heat / (v.rhoW * v.cp / 60000 * v.dT), used = Q * v.mins, okR = P / 1000 <= v.rating, okW = Q <= v.supply, ok = okR && okW;
      return output({ W, T, P, heat, Q, used }, 'Power absorbed (kW)', P / 1000,
        [m('Net scale force', q(W, 'N', 1)), m('Torque', q(T, 'N·m', 1)), m('Power absorbed', `${q(P / 1000, 'kW', 2)} (${q(P / 745.7, 'hp', 1)})`), m('Heat to the cooling water', q(heat, 'kW', 2)), m('Water flow needed', q(Q, 'L/min', 1)), m('Water used over the test', q(used, 'L', 0))],
        'Brake dynamometer test and cooling plan.', 'Steady readings; share of heat to water as entered.', {
          text: ok ? 'TEST SET-UP ADEQUATE' : 'TEST SET-UP NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Brake rating', okR ? 'pass' : 'fail', `${q(P / 1000, 'kW', 2)} against ${q(v.rating, 'kW', 1)}.`), check('Water supply', okW ? 'pass' : 'fail', `${q(Q, 'L/min', 1)} needed against ${q(v.supply, 'L/min', 1)}.`), check('Outlet temperature', 'verify', 'Keep the outlet water below the brake maker’s limit to avoid steam pockets.')],
        });
    },
    "internal-gear-drive-check": (v) => {
      if (v.Zp >= v.Zg) return invalid('The internal gear must have more teeth than the pinion.');
      const Dg = v.m * v.Zg, Dp = v.m * v.Zp, C = v.m * (v.Zg - v.Zp) / 2, Di = v.m * (v.Zg - 1.2), DiC = v.m * (v.Zg - 2), Dop = v.m * (v.Zp + 2.5), DopC = v.m * (v.Zp + 2);
      const minDiff = v.form === '20fd' ? 12 : v.form === '20stub' ? 8 : 15, diff = v.Zg - v.Zp, okD = diff >= minDiff;
      const Tq = 9549.2966 * v.P / v.n, Ft = 2 * Tq * 1000 / Dp, V = PI * Dp * v.n / 60000, Kv = { cast: (3.05 + V) / 3.05, cut: (6.1 + V) / 6.1, hobbed: (3.56 + Math.sqrt(V)) / 3.56, ground: Math.sqrt((5.56 + Math.sqrt(V)) / 5.56) }[v.make];
      const sigma = Kv * Ft / (v.b * v.m * v.Y), nOut = v.n * v.Zp / v.Zg, okS = sigma <= v.allow, ok = okD && okS;
      return output({ Dg, Dp, C, Di, DiC, Dop, DopC, diff, ratio: v.Zg / v.Zp, nOut, T: Tq, Ft, V, Kv, sigma }, 'Pinion bending stress (MPa)', sigma,
        [m('Pitch diameters: gear / pinion', `${q(Dg, '', 3)} / ${q(Dp, 'mm', 3)}`), m('Centre distance', q(C, 'mm', 3)), m('Internal diameter: enlarged / conventional', `${q(Di, '', 3)} / ${q(DiC, 'mm', 3)}`), m('Pinion outside diameter: enlarged / conventional', `${q(Dop, '', 3)} / ${q(DopC, 'mm', 3)}`), m('Ratio / ring speed', `${q(v.Zg / v.Zp, '', 3)} / ${q(nOut, 'rpm', 1)}`), m('Pinion torque / tangential force', `${q(Tq, 'N·m', 2)} / ${q(Ft, 'N', 0)}`), m('Pitch-line velocity / velocity factor', `${q(V, 'm/s', 2)} / ${q(Kv, '', 3)}`), m('Pinion bending stress', q(sigma, 'MPa', 1))],
        'Internal gear drive check.', 'Handbook internal gear rules; Lewis bending.', {
          text: ok ? 'DRIVE ADEQUATE' : 'DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Tooth-number difference', okD ? 'pass' : 'fail', `${diff} teeth against a minimum of ${minDiff}.`), check('Pinion bending', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Pinion size', v.Zp >= 16 ? 'pass' : 'warn', v.Zp >= 16 ? 'Enlargement rules apply.' : 'The enlargement rules are stated for pinions of 16 teeth or more.'), check('Surface durability', 'verify', 'Check contact stress (pitting) separately.')],
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
