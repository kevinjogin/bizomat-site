// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook4). SI units are explicit at each boundary.
// Methods are standard engineering relations; no handbook tables, ratings or recommended settings are reproduced.
// Material properties, ratings, factors and limits are always entered by the user.
(() => {
  const PI = Math.PI;
  const rad = (degrees) => degrees * PI / 180;
  const deg = (radians) => radians * 180 / PI;
  const area = (d) => PI * d * d / 4;
  const ATM = 1.01325; // standard atmosphere, bar
  const q = (value, unit, digits = 4) => {
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
    "circular-segment": (v) => {
      const h = v.height;
      const r = v.mode === 'ch' ? (v.chord * v.chord / 4 + h * h) / (2 * h) : v.radius;
      if (h > 2 * r) return invalid('The segment height cannot exceed the diameter.');
      const angle = 2 * Math.acos((r - h) / r), chord = 2 * Math.sqrt(h * (2 * r - h)), arc = r * angle, area = r * r * (angle - Math.sin(angle)) / 2;
      return output({ radius: r, chord, angle: deg(angle), arc, area }, v.mode === 'ch' ? 'Radius (mm)' : 'Arc length (mm)', v.mode === 'ch' ? r : arc,
        [m('Radius', q(r, 'mm')), m('Chord length', q(chord, 'mm')), m('Included angle', q(deg(angle), '°')), m('Arc length', q(arc, 'mm')), m('Segment area', q(area, 'mm²'))],
        v.mode === 'ch' ? 'The radius is found from the chord and the height at its midpoint.' : 'The segment is solved from the radius and the height.',
        'Assumes a true circular arc and exact height measured square to the chord at its midpoint.', {
          checks: [check('Sensitivity of radius to height', h / chord < 0.05 ? 'warn' : 'pass', h / chord < 0.05 ? 'Height is under 5% of the chord: small height errors change the radius strongly.' : 'Height is a reasonable proportion of the chord.')],
        });
    },
    "regular-polygon": (v) => {
      const n = v.sides, t = Math.tan(PI / n), s = v.basis === 'side' ? v.size : v.basis === 'flats' ? v.size * t : v.size * Math.sin(PI / n);
      const flats = s / t, corners = s / Math.sin(PI / n), area = n * s * s / (4 * t), interior = 180 * (n - 2) / n;
      return output({ side: s, flats, corners, area, interior, perimeter: n * s }, 'Across corners (mm)', corners,
        [m('Across flats', q(flats, 'mm')), m('Across corners', q(corners, 'mm')), m('Side length', q(s, 'mm')), m('Area', q(area, 'mm²')), m('Interior angle', q(interior, '°')), m('Perimeter', q(n * s, 'mm'))],
        `A regular ${n}-sided polygon with sharp corners.`, 'Corner chamfers or radii are not included.', {
          checks: [check('Round stock for full corners', 'pass', `Use round stock of at least ${q(corners, 'mm')} diameter for sharp corners.`)],
        });
    },
    "triangle-solver": (v) => {
      let a, b, c, A, B, C;
      if (v.mode === 'sss') {
        ({ a, b, c } = v);
        if (a + b <= c || a + c <= b || b + c <= a) return invalid('Each side must be shorter than the sum of the other two.');
        A = deg(Math.acos((b * b + c * c - a * a) / (2 * b * c))); B = deg(Math.acos((a * a + c * c - b * b) / (2 * a * c))); C = 180 - A - B;
      } else if (v.mode === 'sas') {
        ({ a, b, C } = v); c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad(C)));
        A = deg(Math.acos(Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c))))); B = 180 - A - C;
      } else {
        ({ A, B, c } = v); C = 180 - A - B;
        if (C <= 0) return invalid('Angles A and B must add to less than 180°.');
        a = c * Math.sin(rad(A)) / Math.sin(rad(C)); b = c * Math.sin(rad(B)) / Math.sin(rad(C));
      }
      const area = 0.5 * a * b * Math.sin(rad(C)), s = (a + b + c) / 2;
      return output({ a, b, c, A, B, C, area, R: a / (2 * Math.sin(rad(A))), r: area / s }, 'Area (mm²)', area,
        [m('Sides a, b, c', `${q(a, '')}, ${q(b, '')}, ${q(c, 'mm')}`), m('Angles A, B, C', `${q(A, '')}°, ${q(B, '')}°, ${q(C, '')}°`), m('Area', q(area, 'mm²')), m('Perimeter', q(2 * s, 'mm')), m('Circumradius', q(a / (2 * Math.sin(rad(A))), 'mm')), m('Inradius', q(area / s, 'mm'))],
        'The triangle is fully solved from the selected known values.', 'Plane triangle; check the inputs describe the same triangle as the drawing.', {
          checks: [check('Angle sum', 'pass', 'A + B + C = 180°.')],
        });
    },
    "tank-volume": (v) => {
      const r = v.diameter / 2, h = v.depth, top = v.orient === 'h' ? v.diameter : v.length;
      if (h > top) return invalid('The liquid depth cannot exceed the inside height of the tank.');
      const areaWet = v.orient === 'h' ? r * r * Math.acos((r - h) / r) - (r - h) * Math.sqrt(Math.max(0, 2 * r * h - h * h)) : PI * r * r;
      const litres = (v.orient === 'h' ? areaWet * v.length : areaWet * h) / 1e6, full = PI * r * r * v.length / 1e6, percent = 100 * litres / full;
      return output({ litres, full, percent, remaining: full - litres }, 'Liquid volume (L)', litres,
        [m('Liquid volume', q(litres, 'L', 2)), m('Percentage full', q(percent, '%', 1)), m('Full capacity', q(full, 'L', 2)), m('Remaining capacity', q(full - litres, 'L', 2))],
        'Volume of liquid in a level cylindrical tank with flat ends.', 'Dished heads, internal fittings and tank slope are not included.', {
          checks: [check('Tank ends', 'verify', 'Add head volume if the tank has dished or hemispherical ends.')],
        });
    },
    "frustum-volume": (v) => {
      const h = v.height;
      if (v.shape === 'round') {
        const R = v.top1 / 2, r = v.bot1 / 2, vol = PI * h * (v.top1 ** 2 + v.top1 * v.bot1 + v.bot1 ** 2) / 12, slant = Math.sqrt((R - r) ** 2 + h * h), side = PI * (R + r) * slant;
        const angle = deg(Math.atan2(h, Math.abs(R - r)));
        return output({ litres: vol / 1e6, sideArea: side / 1e6, slant, angle }, 'Volume (L)', vol / 1e6,
          [m('Volume', q(vol / 1e6, 'L', 2)), m('Volume', q(vol / 1e9, 'm³')), m('Slant surface area', q(side / 1e6, 'm²')), m('Slant height', q(slant, 'mm')), m('Side angle from horizontal', q(angle, '°', 2))],
          'Volume and side area of a round frustum.', 'Centred frustum; seams, laps and plate thickness are excluded.', {
            checks: [check('Outlet smaller than top', R >= r ? 'pass' : 'warn', R >= r ? 'Tapers towards the outlet.' : 'The bottom is larger than the top; check the inputs.')],
          });
      }
      const A1 = v.top1 * v.top2, A2 = v.bot1 * v.bot2, Am = ((v.top1 + v.bot1) / 2) * ((v.top2 + v.bot2) / 2), vol = h * (A1 + A2 + 4 * Am) / 6;
      const sL = Math.sqrt(h * h + ((v.top2 - v.bot2) / 2) ** 2), sW = Math.sqrt(h * h + ((v.top1 - v.bot1) / 2) ** 2);
      const side = (v.top1 + v.bot1) * sL + (v.top2 + v.bot2) * sW;
      return output({ litres: vol / 1e6, sideArea: side / 1e6, slant: sL, angle: deg(Math.atan2(h, Math.abs(v.top1 - v.bot1) / 2)) }, 'Volume (L)', vol / 1e6,
        [m('Volume', q(vol / 1e6, 'L', 2)), m('Volume', q(vol / 1e9, 'm³')), m('Slant surface area', q(side / 1e6, 'm²')), m('Slant height, long sides', q(sL, 'mm')), m('Slant height, short sides', q(sW, 'mm'))],
        'Volume and side area of a rectangular frustum.', 'Centred frustum; seams, laps and plate thickness are excluded.', {
          checks: [check('Valley angle', 'verify', 'The corner (valley) angle is shallower than either side angle; check it against the product’s flow needs.')],
        });
    },
    "ellipse": (v) => {
      const a = Math.max(v.major, v.minor) / 2, b = Math.min(v.major, v.minor) / 2, l = ((a - b) / (a + b)) ** 2;
      const area = PI * a * b, perimeter = PI * (a + b) * (1 + 3 * l / (10 + Math.sqrt(4 - 3 * l))), e = Math.sqrt(1 - (b * b) / (a * a));
      return output({ area, perimeter, e, focus: a * e }, 'Perimeter (mm)', perimeter,
        [m('Area', q(area, 'mm²')), m('Perimeter', q(perimeter, 'mm', 3)), m('Eccentricity', q(e, '', 5)), m('Focal distance from centre', q(a * e, 'mm'))],
        'Area and perimeter of the ellipse.', 'Perimeter by Ramanujan’s second approximation.', {
          checks: [check('Axes', v.major >= v.minor ? 'pass' : 'warn', v.major >= v.minor ? 'Major axis is the larger.' : 'The axes were swapped; the larger value is used as the major axis.')],
        });
    },
    "compound-angle": (v) => {
      const ta = Math.tan(rad(v.angleA)), tb = Math.tan(rad(v.angleB)), compound = deg(Math.atan(Math.sqrt(ta * ta + tb * tb))), direction = ta === 0 && tb === 0 ? 0 : deg(Math.atan2(tb, ta));
      return output({ compound, direction }, 'True compound angle (°)', compound,
        [m('True compound angle', q(compound, '°')), m('Direction from first plane', q(direction, '°')), m('Slope of compound angle', q(Math.tan(rad(compound)) * 100, '%', 2))],
        'The two apparent slopes combine into one true slope of the surface.', 'Both inputs must be slopes of the same plane surface measured in perpendicular vertical planes.', {
          checks: [check('Angle definitions', 'verify', 'Confirm both angles are measured from horizontal in vertical planes at 90° to each other.')],
        });
    },
    "polar-coordinates": (v) => {
      let x, y, r, a;
      if (v.mode === 'toxy') { r = v.radius; a = v.angle; x = r * Math.cos(rad(a)); y = r * Math.sin(rad(a)); }
      else { x = v.x; y = v.y; r = Math.hypot(x, y); a = deg(Math.atan2(y, x)); }
      a = ((a % 360) + 360) % 360;
      return output({ x, y, r, angle: a }, v.mode === 'toxy' ? 'X (mm)' : 'Radius (mm)', v.mode === 'toxy' ? x : r,
        [m('X', q(x, 'mm')), m('Y', q(y, 'mm')), m('Radius', q(r, 'mm')), m('Angle (0–360°)', q(a, '°'))],
        'The point is shown in both coordinate systems about the same origin.', 'Angle convention: anticlockwise from +X.', {
          checks: [check('Angle convention', 'verify', 'Confirm the drawing’s angle zero and direction.')],
        });
    },
    "dovetail-measurement": (v) => {
      const k = 1 + 1 / Math.tan(rad(v.angle / 2)), reading = v.type === 'male' ? v.width + v.rod * k : v.width - v.rod * k;
      const contact = (v.rod / 2) / Math.tan(rad(v.angle / 2)) * Math.sin(rad(v.angle)), top = v.type === 'male' ? v.width + 2 * v.depth / Math.tan(rad(v.angle)) : v.width - 2 * v.depth / Math.tan(rad(v.angle));
      if (reading <= 0 || top <= 0) return invalid('The rod or depth is too large for this width.');
      const ok = contact < v.depth;
      return output({ reading, contact, top, factor: k }, v.type === 'male' ? 'Measurement over rods (mm)' : 'Measurement between rods (mm)', reading,
        [m(v.type === 'male' ? 'Measurement over rods' : 'Measurement between rods', q(reading, 'mm')), m('Width at top edge', q(top, 'mm')), m('Rod contact height', q(contact, 'mm')), m('Rod multiplier 1 + cot(α/2)', q(k, '', 5))],
        `Rods of ${q(v.rod, 'mm')} in a ${q(v.angle, '°', 2)} dovetail.`, 'Sharp corners and true rod diameters are assumed.', {
          text: ok ? 'MEASUREMENT CALCULATED' : 'ROD TOO LARGE', tone: ok ? 'good' : 'bad',
          checks: [check('Rod contacts flank below edge', ok ? 'pass' : 'fail', `Contact at ${q(contact, 'mm')} against a depth of ${q(v.depth, 'mm')}.`)],
        });
    },
    "v-groove-pin": (v) => {
      const s = Math.sin(rad(v.angle / 2)), t = Math.tan(rad(v.angle / 2)), centre = (v.pin / 2) / s, depth = (v.width / 2) / t, above = v.pin / 2 + centre - depth;
      const contact = centre - (v.pin / 2) * s, ok = contact < depth;
      return output({ above, centre, depth, contact }, 'Pin top above surface (mm)', above,
        [m('Pin top above surface', q(above, 'mm')), m('Pin centre above V apex', q(centre, 'mm')), m('Depth of sharp V', q(depth, 'mm')), m('Contact height above apex', q(contact, 'mm'))],
        'The pin sits on both flanks of a symmetrical V-groove.', 'Symmetrical groove and true pin diameter assumed.', {
          text: ok ? 'MEASUREMENT CALCULATED' : 'PIN TOO LARGE', tone: ok ? 'good' : 'bad',
          checks: [check('Pin contacts the flanks', ok ? 'pass' : 'fail', ok ? 'Contact points are below the top edge.' : 'The pin would rest on the edges, not the flanks; use a smaller pin.')],
        });
    },
    "gauge-block-stack": (v) => {
      const metric = v.set === 'm88', unit = metric ? 'mm' : 'in', res = metric ? 0.0005 : 0.0001;
      let R = Math.round(v.target / res);
      if (Math.abs(R * res - v.target) > res * 1e-6) return invalid(`Enter the length to a multiple of ${res} ${unit}.`);
      const used = [];
      let short = false;
      const take = (units) => { if (units > R) short = true; used.push(units); R -= units; };
      if (metric) {
        if (R % 2) take(2001);                      // 1.0005 mm in 0.0005 mm units
        const um = (R / 2) % 10; if (um) take(2000 + um * 2);            // 1.001–1.009
        const hund = ((R / 20) % 50); if (hund) take(2000 + hund * 20);  // 1.01–1.49
        const halves = ((R / 1000) % 20); if (halves) take(halves * 1000); // 0.5–9.5
        let tens = R / 20000; for (let b = 10; b >= 1 && tens > 0; b--) if (b <= tens) { take(b * 20000); tens -= b; }
      } else {
        const tt = R % 10; if (tt) take(1000 + tt);                       // 0.1001–0.1009
        const th = (R / 10) % 50; if (th) take(1000 + th * 10);           // 0.101–0.149
        const fif = (R / 500) % 20; if (fif) take(fif * 500);              // 0.050–0.950
        let ones = R / 10000; for (let b = 4; b >= 1 && ones > 0; b--) if (b <= ones) { take(b * 10000); ones -= b; }
      }
      if (short || R !== 0 || used.length === 0) return invalid('This length cannot be built from the selected set (too small, too large or between available blocks).');
      const sizes = used.map((u) => u * res), total = sizes.reduce((s, x) => s + x, 0), d = metric ? 4 : 4;
      const list = sizes.map((s) => q(s, '', d)).join(' + ');
      return output({ count: used.length, total, list }, 'Number of blocks', used.length,
        [m('Blocks', `${list} ${unit}`), m('Number of blocks', String(used.length)), m('Stack total', q(total, unit, d))],
        `${used.length} blocks build ${q(total, unit, d)}.`, 'Nominal block sizes; use calibrated deviations for precision work.', {
          text: 'STACK FOUND', tone: 'good', table: tbl('Gauge blocks to wring', ['Order', `Block (${unit})`], sizes.slice().sort((a, b) => b - a).map((s, i) => [String(i + 1), q(s, '', d)])),
          checks: [check('Stack equals target', Math.abs(total - v.target) < res / 2 ? 'pass' : 'fail', `Sum ${q(total, unit, d)}.`)],
        });
    },
    "abbe-error": (v) => {
      const error = v.offset * Math.tan(rad(v.tilt / 3600)), share = 100 * error / v.tolerance;
      return output({ error, share }, 'Abbe error (mm)', error,
        [m('Abbe error', q(error * 1000, 'µm', 3)), m('Share of tolerance band', q(share, '%', 2))],
        'Error from an offset between the measuring line and the scale.', 'First-order Abbe error only.', {
          checks: [check('Measurement capability', share <= 10 ? 'pass' : share <= 25 ? 'warn' : 'fail', `${q(share, '%', 1)} of the tolerance band from this source alone.`)],
        });
    },
    "rss-tolerance-stack": (v) => {
      let nominal = 0, wc = 0, ss = 0; const rows = [];
      for (let i = 1; i <= 5; i++) {
        const dir = v['dir' + i]; if (dir === 'off') continue;
        const s = dir === 'add' ? 1 : -1, n = v['nom' + i], t = v['tol' + i];
        nominal += s * n; wc += t; ss += t * t; rows.push([`Dimension ${i}`, s > 0 ? '+' : '−', q(n, 'mm'), `±${q(t, 'mm')}`, t]);
      }
      if (!rows.length) return invalid('Use at least one dimension.');
      if (v.reqMax < v.reqMin) return invalid('The maximum allowed gap must not be less than the minimum.');
      const rss = v.inflate * Math.sqrt(ss), top = rows.reduce((a, b) => (b[4] > a[4] ? b : a));
      const wcOk = nominal - wc >= v.reqMin && nominal + wc <= v.reqMax, rssOk = nominal - rss >= v.reqMin && nominal + rss <= v.reqMax;
      const state = wcOk ? { text: 'MEETS WORST CASE', tone: 'good' } : rssOk ? { text: 'MEETS RSS ONLY', tone: 'warn' } : { text: 'OUTSIDE LIMITS', tone: 'bad' };
      return output({ nominal, wc, rss }, 'Nominal gap (mm)', nominal,
        [m('Nominal gap', q(nominal, 'mm')), m('Worst-case range', `${q(nominal - wc, '')} to ${q(nominal + wc, 'mm')}`), m('RSS range', `${q(nominal - rss, '')} to ${q(nominal + rss, 'mm')}`), m('Largest contributor', top[0])],
        `${rows.length} dimensions stacked against a ${q(v.reqMin, '')}–${q(v.reqMax, 'mm')} requirement.`, 'RSS assumes independent, centred, normally distributed dimensions.', {
          ...state, table: tbl('Stack contributors', ['Dimension', 'Direction', 'Nominal', 'Tolerance', 'Share of variance'], rows.map((r) => [r[0], r[1], r[2], r[3], q(ss ? 100 * r[4] * r[4] / ss : 0, '%', 1)])),
          checks: [check('Worst case within limits', wcOk ? 'pass' : 'fail', `${q(nominal - wc, '')} to ${q(nominal + wc, 'mm')}.`), check('RSS within limits', rssOk ? 'pass' : 'fail', `${q(nominal - rss, '')} to ${q(nominal + rss, 'mm')}.`), check('Statistical assumptions', 'verify', 'Confirm process capability of the main contributors before relying on RSS.')],
        });
    },
    "it-tolerance-grade": (v) => {
      const steps = [0, 3, 6, 10, 18, 30, 50, 80, 120, 180, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150];
      let k = 1; while (k < steps.length - 1 && v.size > steps[k]) k++;
      const lo = steps[k - 1], hi = steps[k], D = Math.sqrt((lo || 1) * hi);
      const i = hi <= 500 ? 0.45 * Math.cbrt(D) + 0.001 * D : 0.004 * D + 2.1;
      const mult = { 5: 7, 6: 10, 7: 16, 8: 25, 9: 40, 10: 64, 11: 100, 12: 160, 13: 250, 14: 400, 15: 640, 16: 1000 }[v.grade];
      const it = mult * i;
      return output({ it, D, i, step: `${lo}–${hi}` }, 'IT tolerance (µm)', it,
        [m(`IT${v.grade} (formula)`, q(it, 'µm', 1)), m(`IT${v.grade}`, q(it / 1000, 'mm', 4)), m('Size step', `over ${lo} to ${hi} mm`), m('Geometric mean D', q(D, 'mm', 3)), m('Tolerance unit', q(i, 'µm', 4))],
        `Formula value of IT${v.grade} for the ${lo}–${hi} mm size step.`, 'ISO 286-1 table values are rounded and govern on drawings.', {
          checks: [check('Drawing value', 'verify', 'Use the rounded ISO 286-1 table value on drawings and inspection plans.')],
        });
    },
    "length-converter": (v) => {
      const F = {"m":1,"mm":0.001,"um":0.000001,"cm":0.01,"km":1000,"in":0.0254,"thou":0.0000254,"ft":0.3048,"yd":0.9144,"mi":1609.344}, L = {"m":"m","mm":"mm","um":"µm","cm":"cm","km":"km","in":"in","thou":"thou (mil)","ft":"ft","yd":"yd","mi":"mile"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["m"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["m"], q(si, '', 8))],
        'The entered length is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Length in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["m"] + '.')],
        });
    },
    "force-converter": (v) => {
      const F = {"N":1,"kN":1000,"MN":1000000,"kgf":9.80665,"tf":9806.65,"lbf":4.4482216152605,"kip":4448.2216152605,"ozf":0.27801385095378,"dyn":0.00001}, L = {"N":"N","kN":"kN","MN":"MN","kgf":"kgf","tf":"tonne-force","lbf":"lbf","kip":"kip (1000 lbf)","ozf":"ozf","dyn":"dyne"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["N"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["N"], q(si, '', 8))],
        'The entered force is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Force in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["N"] + '.')],
        });
    },
    "pressure-converter": (v) => {
      const F = {"Pa":1,"kPa":1000,"MPa":1000000,"GPa":1000000000,"bar":100000,"mbar":100,"psi":6894.7572931684,"ksi":6894757.2931684,"atm":101325,"kgfcm2":98066.5,"mmHg":133.322387415,"inHg":3386.388640341,"inH2O":249.08891}, L = {"Pa":"Pa","kPa":"kPa","MPa":"MPa (N/mm²)","GPa":"GPa","bar":"bar","mbar":"mbar","psi":"psi","ksi":"ksi","atm":"standard atmosphere","kgfcm2":"kgf/cm²","mmHg":"mmHg","inHg":"inHg (32 °F)","inH2O":"inH₂O (4 °C)"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["Pa"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["Pa"], q(si, '', 8))],
        'The entered pressure or stress is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Pressure or stress in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["Pa"] + '.')],
        });
    },
    "torque-converter": (v) => {
      const F = {"Nm":1,"Nmm":0.001,"kNm":1000,"kgfm":9.80665,"kgfcm":0.0980665,"lbfft":1.3558179483314,"lbfin":0.1129848290276,"ozfin":0.0070615518142}, L = {"Nm":"N·m","Nmm":"N·mm","kNm":"kN·m","kgfm":"kgf·m","kgfcm":"kgf·cm","lbfft":"lbf·ft","lbfin":"lbf·in","ozfin":"ozf·in"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["Nm"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["Nm"], q(si, '', 8))],
        'The entered torque is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Torque in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["Nm"] + '.')],
        });
    },
    "power-converter": (v) => {
      const F = {"W":1,"kW":1000,"MW":1000000,"hp":745.69987158227,"PS":735.49875,"ftlbfs":1.3558179483314,"BTUh":0.29307107017222,"kcalh":1.163,"TR":3516.8528420667}, L = {"W":"W","kW":"kW","MW":"MW","hp":"hp (mechanical)","PS":"metric horsepower (PS)","ftlbfs":"ft·lbf/s","BTUh":"BTU/h (IT)","kcalh":"kcal/h (IT)","TR":"ton of refrigeration"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["W"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["W"], q(si, '', 8))],
        'The entered power is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Power in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["W"] + '.')],
        });
    },
    "energy-converter": (v) => {
      const F = {"J":1,"kJ":1000,"MJ":1000000,"Wh":3600,"kWh":3600000,"cal":4.1868,"kcal":4186.8,"BTU":1055.05585262,"ftlbf":1.3558179483314,"therm":105506000}, L = {"J":"J","kJ":"kJ","MJ":"MJ","Wh":"Wh","kWh":"kWh","cal":"cal (IT)","kcal":"kcal (IT)","BTU":"BTU (IT)","ftlbf":"ft·lbf","therm":"therm (EC)"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["J"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["J"], q(si, '', 8))],
        'The entered energy is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Energy in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["J"] + '.')],
        });
    },
    "flow-converter": (v) => {
      const F = {"m3s":1,"m3h":0.0002777777777777778,"m3min":0.016666666666666666,"Ls":0.001,"Lmin":0.000016666666666666667,"usgpm":0.0000630901964,"ukgpm":0.00007576816666666667,"cfm":0.0004719474432,"cfs":0.028316846592}, L = {"m3s":"m³/s","m3h":"m³/h","m3min":"m³/min","Ls":"L/s","Lmin":"L/min","usgpm":"US gal/min","ukgpm":"UK gal/min","cfm":"ft³/min (cfm)","cfs":"ft³/s"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["m3s"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["m3s"], q(si, '', 8))],
        'The entered volumetric flow rate is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Volumetric flow rate in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["m3s"] + '.')],
        });
    },
    "mass-converter": (v) => {
      const F = {"kg":1,"g":0.001,"t":1000,"lb":0.45359237,"oz":0.028349523125,"shortton":907.18474,"longton":1016.0469088,"slug":14.593902937206}, L = {"kg":"kg","g":"g","t":"tonne","lb":"lb","oz":"oz (avoirdupois)","shortton":"short ton (2000 lb)","longton":"long ton (2240 lb)","slug":"slug"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["kg"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["kg"], q(si, '', 8))],
        'The entered mass is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Mass in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["kg"] + '.')],
        });
    },
    "velocity-converter": (v) => {
      const F = {"ms":1,"mmin":0.016666666666666666,"mmmin":0.000016666666666666667,"kmh":0.2777777777777778,"fts":0.3048,"ftmin":0.00508,"inmin":0.00042333333333333334,"mph":0.44704,"kn":0.5144444444444445}, L = {"ms":"m/s","mmin":"m/min","mmmin":"mm/min","kmh":"km/h","fts":"ft/s","ftmin":"ft/min (sfm)","inmin":"in/min (ipm)","mph":"mile/h","kn":"knot"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["ms"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["ms"], q(si, '', 8))],
        'The entered speed is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Speed in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["ms"] + '.')],
        });
    },
    "angle-converter": (v) => {
      const F = {"deg":1,"rad":57.29577951308232,"grad":0.9,"arcmin":0.016666666666666666,"arcsec":0.0002777777777777778,"mrad":0.05729577951308232,"rev":360}, L = {"deg":"degree","rad":"radian","grad":"gradian","arcmin":"arc-minute","arcsec":"arc-second","mrad":"milliradian","rev":"revolution"};
      const si = v.value * F[v.from];
      const rows = Object.keys(F).map((k) => [L[k], q(si / F[k], '', 8)]);
      return output({ si }, 'Value in ' + L["deg"], si,
        [m('Entered value', q(v.value, '', 8) + ' ' + L[v.from]), m('In ' + L["deg"], q(si, '', 8))],
        'The entered angle is shown in every listed unit.',
        'Conversion factors are exact by definition or internationally agreed; round the result to the precision your drawing or specification requires.', {
          text: 'CONVERTED', tone: 'good', table: tbl('Angle in each unit', ['Unit', 'Value'], rows),
          checks: [check('Conversion factors', 'pass', 'Exact or agreed factors relative to ' + L["deg"] + '.')],
        });
    },
    "temperature-converter": (v) => {
      const toK = { C: (t) => t + 273.15, F: (t) => (t - 32) * 5 / 9 + 273.15, K: (t) => t, R: (t) => t * 5 / 9 };
      const dK = { C: 1, F: 5 / 9, K: 1, R: 5 / 9 };
      let K, C, F, R;
      if (v.kind === 'abs') { K = toK[v.from](v.value); if (K < 0) return invalid('The temperature is below absolute zero.'); C = K - 273.15; F = C * 9 / 5 + 32; R = K * 9 / 5; }
      else { K = v.value * dK[v.from]; C = K; F = K * 1.8; R = K * 1.8; }
      return output({ C, F, K, R }, 'Value in kelvin', K,
        [m('Celsius', q(C, '°C', 4)), m('Fahrenheit', q(F, '°F', 4)), m('Kelvin', q(K, 'K', 4)), m('Rankine', q(R, '°R', 4))],
        v.kind === 'abs' ? 'The temperature reading in each scale.' : 'The temperature difference in each scale (no offset).', 'Exact scale definitions.', {
          text: 'CONVERTED', tone: 'good', checks: [check('Reading or difference', 'pass', v.kind === 'abs' ? 'Converted as a reading, with offsets.' : 'Converted as a difference, without offsets.')],
        });
    },
    "decimal-fraction": (v) => {
      const gcd = (a, b) => (b ? gcd(b, a % b) : a), N = Number(v.denom);
      const whole = Math.floor(v.value), num0 = Math.round((v.value - whole) * N), g = gcd(num0, N) || N;
      const nearest = num0 === 0 ? `${whole}` : num0 === N ? `${whole + 1}` : `${whole ? whole + ' ' : ''}${num0 / g}/${N / g}`;
      const nErr = whole + num0 / N - v.value;
      // Best rational approximation with denominator ≤ maxDen (Stern–Brocot / continued fractions)
      let [p0, q0, p1, q1] = [0, 1, 1, 0], x = v.value, best = [Math.round(v.value), 1];
      for (let i = 0; i < 64; i++) {
        const a = Math.floor(x), p2 = a * p1 + p0, q2 = a * q1 + q0;
        if (q2 > v.maxDen) { const k = Math.floor((v.maxDen - q0) / q1), ps = k * p1 + p0, qs = k * q1 + q0; const c = [[p1, q1], [ps, qs]].filter((c) => c[1] > 0 && c[1] <= v.maxDen); for (const cand of c) if (Math.abs(cand[0] / cand[1] - v.value) < Math.abs(best[0] / best[1] - v.value)) best = cand; break; }
        [p0, q0, p1, q1] = [p1, q1, p2, q2]; best = [p2, q2];
        if (Math.abs(x - a) < 1e-12) break; x = 1 / (x - a);
      }
      const bErr = best[0] / best[1] - v.value;
      return output({ nearest, mm: v.value * 25.4, nErr, best: `${best[0]}/${best[1]}`, bErr }, 'Error of nearest fraction', nErr,
        [m(`Nearest 1/${N}`, `${nearest} (error ${q(nErr, '', 6)})`), m(`Best fraction, denominator ≤ ${v.maxDen}`, `${best[0]}/${best[1]} (error ${q(bErr, '', 9)})`), m('Millimetres (if inches)', q(v.value * 25.4, 'mm', 4))],
        'Nearest fractional size and the best limited-denominator fraction.', 'Errors are the fraction minus the entered value.', {
          text: nErr === 0 ? 'EXACT FRACTION' : 'NEAREST FRACTION', tone: 'good',
          checks: [check(`Exact at 1/${N}`, nErr === 0 ? 'pass' : 'warn', nErr === 0 ? 'The value is an exact fraction at this resolution.' : `Off by ${q(Math.abs(nErr), '', 6)}.`)],
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
