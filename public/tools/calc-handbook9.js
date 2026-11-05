// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook9). SI units are explicit at each boundary.
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
    "helix-length": (v) => {
      const per = Math.sqrt((PI * v.D) ** 2 + v.p ** 2), L = v.turns * per + v.ends, angle = deg(Math.atan(v.p / (PI * v.D)));
      return output({ per, L, angle, height: v.turns * v.p }, 'Developed length (mm)', L,
        [m('Length per turn', q(per, 'mm', 2)), m('Developed length', `${q(L, 'mm', 1)} (${q(L / 1000, 'm', 3)})`), m('Helix angle', q(angle, '°', 3)), m('Coil height', q(v.turns * v.p, 'mm', 1))],
        'Centre-line length of the helix.', 'Uniform helix; end transitions approximated.', {
          checks: [check('Material allowance', 'verify', 'Add cutting, bending and connection allowances.')],
        });
    },
    "vessel-head-volume": (v) => {
      const D = v.D, shell = PI * D * D * v.L / 4, head = { ell: PI * D ** 3 / 24, hemi: PI * D ** 3 / 12, tori: 0.0809 * D ** 3, cone: PI * D ** 3 / (24 * Math.tan(rad(v.coneAngle))), flat: 0 }[v.head];
      const total = (shell + v.heads * head) / 1e6;
      return output({ shell: shell / 1e6, head: head / 1e6, total }, 'Total volume (L)', total,
        [m('Each head', q(head / 1e6, 'L', 2)), m('Shell', q(shell / 1e6, 'L', 2)), m('Total volume', `${q(total, 'L', 1)} (${q(total / 1000, 'm³', 4)})`)],
        'Inside volume of the vessel with its heads.', 'Inside dimensions; torispherical value approximate.', {
          checks: [check('Head proportions', v.head === 'tori' ? 'verify' : 'pass', v.head === 'tori' ? 'Confirm crown and knuckle radii; other proportions change the volume.' : 'Exact formula for this head shape.')],
        });
    },
    "linear-interpolation": (v) => {
      if (v.x1 === v.x2) return invalid('The two points need different x values.');
      const slope = (v.y2 - v.y1) / (v.x2 - v.x1);
      if (v.mode === 'x' && slope === 0) return invalid('The two y values are equal, so x cannot be found from y.');
      const result = v.mode === 'y' ? v.y1 + (v.x - v.x1) * slope : v.x1 + (v.y - v.y1) / slope, xi = v.mode === 'y' ? v.x : result;
      const inside = xi >= Math.min(v.x1, v.x2) && xi <= Math.max(v.x1, v.x2);
      return output({ result, slope, inside }, v.mode === 'y' ? 'Interpolated y' : 'Interpolated x', result,
        [m(v.mode === 'y' ? 'Interpolated y' : 'Interpolated x', q(result, '', 8)), m('Slope', q(slope, '', 8)), m('Position', inside ? 'Within the table range' : 'Outside the range (extrapolated)')],
        inside ? 'Interpolated between the two points.' : 'Extrapolated beyond the two points.', 'Straight line between the points.', {
          checks: [check('Within table range', inside ? 'pass' : 'warn', inside ? 'Interpolation.' : 'Extrapolation: check the relation still holds.')],
        });
    },
    "circle-three-points": (v) => {
      const D = 2 * (v.x1 * (v.y2 - v.y3) + v.x2 * (v.y3 - v.y1) + v.x3 * (v.y1 - v.y2));
      if (Math.abs(D) < 1e-12) return invalid('The three points lie on a straight line.');
      const s1 = v.x1 ** 2 + v.y1 ** 2, s2 = v.x2 ** 2 + v.y2 ** 2, s3 = v.x3 ** 2 + v.y3 ** 2;
      const cx = (s1 * (v.y2 - v.y3) + s2 * (v.y3 - v.y1) + s3 * (v.y1 - v.y2)) / D, cy = (s1 * (v.x3 - v.x2) + s2 * (v.x1 - v.x3) + s3 * (v.x2 - v.x1)) / D, r = Math.hypot(v.x1 - cx, v.y1 - cy);
      const angs = [[v.x1, v.y1], [v.x2, v.y2], [v.x3, v.y3]].map(([x, y]) => Math.atan2(y - cy, x - cx)).sort((a, b) => a - b);
      const gaps = [angs[1] - angs[0], angs[2] - angs[1], 2 * PI - (angs[2] - angs[0])], spread = 360 - deg(Math.max(...gaps));
      return output({ cx, cy, r, spread }, 'Radius (mm)', r,
        [m('Centre X', q(cx, 'mm', 4)), m('Centre Y', q(cy, 'mm', 4)), m('Radius', q(r, 'mm', 4)), m('Diameter', q(2 * r, 'mm', 4)), m('Arc spread of points', q(spread, '°', 1))],
        'Circle through the three points.', 'Exact fit to three points; no form error estimate.', {
          checks: [check('Point spread', spread >= 120 ? 'pass' : 'warn', `Points span ${q(spread, '°', 0)} of the circle; under about 120° the centre is sensitive to errors.`)],
        });
    },
    "true-position": (v) => {
      if (v.upper < v.lower) return invalid('The upper size limit must not be below the lower limit.');
      const pos = 2 * Math.hypot(v.dx, v.dy), inSize = v.size >= v.lower && v.size <= v.upper, hole = v.feature === 'hole';
      const raw = v.mod === 'mmc' ? (hole ? v.size - v.lower : v.upper - v.size) : v.mod === 'lmc' ? (hole ? v.upper - v.size : v.size - v.lower) : 0, bonus = Math.max(0, raw);
      const allowed = v.tol + bonus, okPos = pos <= allowed + 1e-12, ok = okPos && inSize;
      return output({ pos, bonus, allowed }, 'Actual position (mm)', pos,
        [m('Actual position (diameter)', q(pos, 'mm', 4)), m('Bonus tolerance', q(bonus, 'mm', 4)), m('Allowed position tolerance', q(allowed, 'mm', 4)), m('Size', inSize ? 'Within limits' : 'Outside limits')],
        ok ? 'The feature is within its position and size tolerances.' : 'The feature does not meet its position or size tolerance.', 'Datum shift not included.', {
          text: ok ? 'CONFORMS' : 'DOES NOT CONFORM', tone: ok ? 'good' : 'bad',
          checks: [check('Position within allowed tolerance', okPos ? 'pass' : 'fail', `${q(pos, 'mm', 4)} against ${q(allowed, 'mm', 4)}.`), check('Size within limits', inSize ? 'pass' : 'fail', `${q(v.size, 'mm', 4)} against ${q(v.lower, '', 4)}–${q(v.upper, 'mm', 4)}.`), check('Datum reference frame', 'verify', 'Confirm deviations are measured in the drawing’s datum reference frame.')],
        });
    },
    "taper-balls": (v) => {
      const R1 = v.d1 / 2, R2 = v.d2 / 2, H = v.h1 - v.h2, dR = R2 - R1;
      if (dR <= 0) return invalid('The large ball must be bigger than the small ball.');
      if (H <= dR) return invalid('The small ball must sit deeper by more than the difference in radii.');
      const s = dR / (H - dR), half = Math.asin(s), angle = 2 * deg(half), taper = 2 * Math.tan(half), top = 2 * Math.tan(half) * (R2 / s + R2 + v.h2);
      return output({ angle, taper, top }, 'Included angle (°)', angle,
        [m('Included angle', q(angle, '°', 4)), m('Taper on diameter', `${q(taper, '', 5)} (${q(taper * 1000, 'mm/m', 2)})`), m('Diameter at top face', q(top, 'mm', 4))],
        'Taper angle from two ball readings.', 'Straight round taper with full ball contact.', {
          checks: [check('Ball contact', 'verify', 'Confirm both balls seat on the cone wall, not on an edge or step.')],
        });
    },
    "go-nogo-gauge": (v) => {
      if (v.upper <= v.lower) return invalid('The upper limit must be above the lower limit.');
      const T = v.upper - v.lower, G = T * v.gpct / 100, W = T * v.wpct / 100;
      if (G + W >= T) return invalid('Gauge tolerance plus wear allowance must be less than the work tolerance.');
      const hole = v.feature === 'hole', go = hole ? [v.lower + W, v.lower + W + G] : [v.upper - W - G, v.upper - W], nogo = hole ? [v.upper - G, v.upper] : [v.lower, v.lower + G];
      const fmt = (r) => `${q(r[0], '', 4)} to ${q(r[1], 'mm', 4)}`;
      return output({ go, nogo, T, goText: fmt(go), nogoText: fmt(nogo) }, 'Work tolerance (mm)', T,
        [m(hole ? 'Go plug gauge' : 'Go ring or snap gauge', fmt(go)), m(hole ? 'No-go plug gauge' : 'No-go ring or snap gauge', fmt(nogo)), m('Work tolerance', q(T, 'mm', 4)), m('Tolerance left for production', q(T - 2 * G - W, 'mm', 4))],
        'Limit gauge sizes inside the work tolerance.', 'Inward gauge tolerance system.', {
          checks: [check('Production tolerance remaining', T - 2 * G - W > 0.5 * T ? 'pass' : 'warn', `${q(100 * (T - 2 * G - W) / T, '%', 0)} of the work tolerance remains for production.`), check('Gauge calibration', 'verify', 'Calibrate gauges against traceable standards.')],
        });
    },
    "toggle-joint": (v) => {
      const a = rad(v.angle), R = v.F / (2 * Math.tan(a)), link = v.F / (2 * Math.sin(a));
      return output({ R, ma: R / v.F, link }, 'Output force (N)', R,
        [m('Output force', q(R, 'N', 1)), m('Mechanical advantage', q(R / v.F, '', 2)), m('Force in each link', q(link, 'N', 1))],
        `Toggle at ${q(v.angle, '°', 2)}.`, 'Frictionless, rigid links.', {
          checks: [check('Small link angle', v.angle >= 2 ? 'pass' : 'warn', v.angle >= 2 ? 'Angle large enough for the ideal relation to be meaningful.' : 'Near straight: elasticity and clearance govern the real force.')],
        });
    },
    "wedge-force": (v) => {
      const phi = Math.atan(v.mu), a = rad(v.angle), drive = v.W * Math.tan(a + 2 * phi), wd = v.W * Math.tan(2 * phi - a), locks = 2 * phi > a;
      return output({ drive, withdraw: Math.abs(wd), locks }, 'Driving force (N)', drive,
        [m('Force to drive', q(drive, 'N', 1)), m(locks ? 'Force to withdraw' : 'Force needed to hold in place', q(Math.abs(wd), 'N', 1)), m('Friction angle', q(deg(phi), '°', 2)), m('Self-locking', locks ? 'Yes' : 'No: the wedge is pushed out under load')],
        locks ? 'The wedge stays in place when the driving force is removed.' : 'The load pushes the wedge out; hold or lock it.', 'Guided load; equal friction on both faces.', {
          checks: [check('Self-locking', locks ? 'pass' : 'warn', locks ? '2φ > α.' : 'Provide a lock or screw to hold the wedge.'), check('Vibration', 'verify', 'Vibration can release a self-locking wedge.')],
        });
    },
    "power-screw-torque": (v) => {
      const sec = 1 / Math.cos(rad(Number(v.flank))), dm = v.dm, L = v.lead, collar = v.F * v.muc * v.dc / 2;
      const den = PI * dm - v.mu * L * sec;
      if (den <= 0) return invalid('The lead is too large for this diameter and friction.');
      const thrR = v.F * dm / 2 * (L + PI * v.mu * dm * sec) / den, thrL = v.F * dm / 2 * (PI * v.mu * dm * sec - L) / (PI * dm + v.mu * L * sec);
      const Tr = (thrR + collar) / 1000, Tl = (thrL + collar) / 1000, eff = 100 * v.F * L / (2 * PI * (thrR + collar)), locks = thrL > 0;
      return output({ Tr, Tl, eff, locks }, 'Torque to raise (N·m)', Tr,
        [m('Torque to raise', q(Tr, 'N·m', 2)), m('Torque to lower', q(Tl, 'N·m', 2)), m('Efficiency raising', q(eff, '%', 1)), m('Thread self-locking', locks ? 'Yes' : 'No (load lowers itself)')],
        'Running torque for the power screw and collar.', 'Running friction; starting torque higher.', {
          checks: [check('Self-locking', locks ? 'pass' : 'warn', locks ? 'The thread holds the load statically.' : 'Add a brake to hold the load.'), check('Starting friction', 'verify', 'Allow for higher static friction when starting under load.')],
        });
    },
    "band-brake": (v) => {
      const r = v.D / 2000, net = v.T / r, e = Math.exp(v.mu * rad(v.wrap)), T2 = net / (e - 1), T1 = T2 + net, Fl = T2 * v.b / v.a, p = T1 / (r * 1000 * v.w);
      return output({ T1, T2, Fl, p }, 'Lever force (N)', Fl,
        [m('Tight side tension', q(T1, 'N', 0)), m('Slack side tension', q(T2, 'N', 0)), m('Lever force', q(Fl, 'N', 1)), m('Maximum lining pressure', q(p, 'MPa', 3))],
        'Simple band brake at the required torque.', 'Anchored end is the tight side; heat not checked.', {
          checks: [check('Rotation direction', 'verify', 'For the opposite rotation, the lever works on the tight side and needs far more force.'), check('Lining pressure', 'verify', 'Compare with the lining maker’s pressure limit.')],
        });
    },
    "shoe-brake": (v) => {
      const r = v.D / 2000, Ff = v.T / r, Nf = Ff / v.mu, energ = v.dir === 'energ', arm = energ ? v.b - v.mu * v.c : v.b + v.mu * v.c, locks = energ && arm <= 0;
      const F = Math.max(0, Nf * arm / v.a), p = Nf / v.area;
      return output({ Nf, F, p, locks }, 'Lever force (N)', F,
        [m('Normal force on shoe', q(Nf, 'N', 0)), m('Friction force', q(Ff, 'N', 0)), m('Lever force', locks ? 'None needed: self-locking' : q(F, 'N', 1)), m('Shoe pressure', q(p, 'MPa', 3))],
        locks ? 'The geometry is self-locking in this direction: the brake grabs.' : 'Lever force for the required torque.', 'Short shoe, uniform pressure.', {
          text: locks ? 'SELF-LOCKING' : 'CALCULATED', tone: locks ? 'bad' : 'warn',
          checks: [check('Self-locking', locks ? 'fail' : 'pass', locks ? 'b ≤ μc: the brake grabs.' : 'Not self-locking.'), check('Lining pressure and heat', 'verify', 'Compare with the lining maker’s limits.')],
        });
    },
    "cone-clutch": (v) => {
      if (v.Di >= v.Do) return invalid('The small diameter must be less than the large diameter.');
      const s = Math.sin(rad(v.alpha)), T = v.mu * v.F * (v.Do + v.Di) / 4000 / s, Fe = v.F * (s + v.mu * Math.cos(rad(v.alpha))) / s, ok = T >= v.Treq;
      return output({ T, Fe }, 'Torque capacity (N·m)', T,
        [m('Torque capacity', q(T, 'N·m', 1)), m('Engaging force', q(Fe, 'N', 0)), m('Capacity / required', v.Treq > 0 ? q(T / v.Treq, '', 2) : 'No requirement entered')],
        'Cone clutch capacity at the holding force.', 'Uniform wear.', {
          text: ok ? 'CAPACITY SUFFICIENT' : 'CAPACITY TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Torque capacity', ok ? 'pass' : 'fail', `${q(T, 'N·m', 1)} against ${q(v.Treq, 'N·m', 1)}.`), check('Cone angle', v.alpha >= 8 ? 'pass' : 'warn', v.alpha >= 8 ? 'Cone angle unlikely to stick.' : 'Small angle: the cone may jam.')],
        });
    },
    "wire-rope-reeving": (v) => {
      const W = v.mass * 9.80665, eta = v.eta / 100, F = eta === 1 ? W / v.n : W * (1 - eta) / (1 - eta ** v.n), sf = v.mbl * 1000 / F, ratio = v.D / v.d, ok = sf >= v.req && ratio >= v.ratioReq;
      return output({ F, sf, ratio, eff: W / (v.n * F) }, 'Rope safety factor', sf,
        [m('Line pull at drum', q(F / 1000, 'kN', 2)), m('Rope safety factor', q(sf, '', 2)), m('Reeving efficiency', q(100 * W / (v.n * F), '%', 1)), m('Sheave D/d', q(ratio, '', 1))],
        `${v.n} parts of line.`, 'Steady hoisting; dynamic loads per the code.', {
          text: ok ? 'ROPE AND SHEAVE OK' : 'NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Rope safety factor', sf >= v.req ? 'pass' : 'fail', `${q(sf, '', 2)} against ${q(v.req, '', 1)}.`), check('Sheave D/d', ratio >= v.ratioReq ? 'pass' : 'fail', `${q(ratio, '', 1)} against ${q(v.ratioReq, '', 0)}.`), check('Lifting code', 'verify', 'Confirm dynamic factors and certification with a competent person.')],
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
