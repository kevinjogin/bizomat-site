// BIZOMAT MAKEOS engineering calculations. SI units are explicit at each boundary.
// No catalogue material values, standard fit tables or equipment ratings are inferred.
(() => {
  const PI = Math.PI;
  const rad = (degrees) => degrees * PI / 180;
  const deg = (radians) => radians * 180 / PI;
  const area = (d) => PI * d * d / 4;
  const q = (value, unit, digits = 6) => {
    const formatted = value !== 0 && Math.abs(value) < 10 ** -digits
      ? fmtPrimary('engineering', value) : num(value, digits);
    return `${formatted}${unit ? ` ${unit}` : ''}`;
  };
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
  function output(values, label, value, metrics, summary, limit, extra = {}) {
    if (!Number.isFinite(value) || Object.values(values).some((v) => typeof v === 'number' && !Number.isFinite(v))) {
      return invalid('The calculation is outside the supported numeric range. Review the dimensions and units.');
    }
    return result('CALCULATED', 'warn', summary, metrics, limit, {
      primary: primary(label, value, 'engineering'), values,
      checks: [check('Model and application', 'verify', limit)],
      actions: ['Check the method, input sources and limitations below before using this result.'],
      ...extra,
    });
  }
  const methods = {
    'cutting-speed': (v) => {
      const rpm = 1000 * v.speed / (PI * v.diameter), actual = PI * v.diameter * v.rpm / 1000;
      return output({ rpm, actual }, 'Required spindle speed (rpm)', rpm,
        [m('Required spindle speed', q(rpm, 'rpm', 3)), m('Actual surface speed', q(actual, 'm/min', 3))],
        'The calculated RPM corresponds to the supplied cutting speed at the entered effective diameter.',
        'Verify supplier cutting data and the speed limits of the machine, tool and workholding.');
    },
    'milling-feed-time': (v) => {
      const feed = v.rpm * v.teeth * v.chip, removal = v.width * v.depth * feed / 1000, minutes = v.length / feed;
      return output({ feed, removal, minutes }, 'Ideal cutting time (min)', minutes,
        [m('Table feed', q(feed, 'mm/min')), m('Material removal', q(removal, 'cm³/min')), m('Cutting time', q(minutes, 'min')), m('Cutting time', q(minutes * 60, 's'))],
        'This is the time spent at constant feed over the entered travel.',
        'Add non-cutting moves, acceleration, tool changes and handling to obtain the complete cycle.');
    },
    'turning-time': (v) => {
      const feed = v.rpm * v.feed, perPass = v.length / feed, minutes = perPass * v.passes, speed = PI * v.diameter * v.rpm / 1000;
      return output({ feed, perPass, minutes, speed }, 'Total cutting time (min)', minutes,
        [m('Axial feed', q(feed, 'mm/min')), m('Time per pass', q(perPass, 'min')), m('Total cutting time', q(minutes, 'min')), m('Surface speed', q(speed, 'm/min'))],
        `${v.passes} equal axial passes are evaluated at constant RPM.`,
        'The result excludes return and handling time and does not model facing or constant-surface-speed control.');
    },
    'drilling-time': (v) => {
      const point = v.diameter / (2 * Math.tan(rad(v.angle / 2))), travel = v.thickness + point + v.extra;
      const feed = v.rpm * v.feed, perHole = travel / feed, minutes = v.holes * perHole;
      return output({ point, travel, feed, perHole, minutes }, 'Total feed time (min)', minutes,
        [m('Conical point length', q(point, 'mm')), m('Feed travel / hole', q(travel, 'mm')), m('Penetration rate', q(feed, 'mm/min')), m('Time / hole', q(perHole * 60, 's')), m('Total feed time', q(minutes, 'min'))],
        'Point length is added so the full drill diameter can emerge from the through-hole.',
        'Check exit clearance; pecking, retract, dwell and hole-to-hole travel are excluded.');
    },
    'tapping-feed': (v) => {
      const lead = v.pitch * v.starts, feed = v.rpm * lead, seconds = v.depth / feed * 60;
      return output({ lead, feed, seconds }, 'Synchronous feed (mm/min)', feed,
        [m('Thread lead', q(lead, 'mm/rev')), m('Synchronous feed', q(feed, 'mm/min')), m('Forward feed time', q(seconds, 's'))],
        'Pitch multiplied by the number of starts gives axial travel per revolution.',
        'Check controller feed mode, spindle synchronisation, tap lead-in and reversal clearance.');
    },
    'bolt-circle': (v) => {
      const step = 360 / v.holes, radius = v.diameter / 2, chord = v.diameter * Math.sin(PI / v.holes);
      const coordinates = Array.from({ length: v.holes }, (_, i) => {
        const angle = v.angle + (v.direction === 'cw' ? -1 : 1) * i * step;
        return { hole: i + 1, angle, x: v.x + radius * Math.cos(rad(angle)), y: v.y + radius * Math.sin(rad(angle)) };
      });
      // Suppress sub-nanometre floating-point residue at exact quadrant angles.
      const coord = (x) => q(Math.abs(x) < 1e-9 ? 0 : x, 'mm');
      return output({ step, chord, coordinates }, 'Adjacent centre chord (mm)', chord,
        [m('Angular spacing', q(step, '°')), m('Adjacent centre chord', q(chord, 'mm')), m('Coordinate count', v.holes)],
        'Hole 1 starts at the entered angle from +X; positive angles are anticlockwise.',
        'Confirm the datum, view direction and numbering before transferring coordinates.', {
          table: { caption: 'Hole-centre coordinates', head: ['Hole', 'Angle from +X', 'X', 'Y'], rows: coordinates.map((p) => [p.hole, q(p.angle, '°'), coord(p.x), coord(p.y)]) },
        });
    },
    'taper-geometry': (v) => {
      if (v.large < v.small) return invalid('The large diameter must be at least the small diameter.');
      const taper = (v.large - v.small) / v.length, halfAngle = deg(Math.atan(taper / 2));
      return output({ taper, halfAngle, includedAngle: 2 * halfAngle }, 'Half-angle (degrees)', halfAngle,
        [m('Half-angle to axis', q(halfAngle, '°')), m('Included angle', q(2 * halfAngle, '°')), m('Diametral taper', q(taper, 'mm/mm')), m('Diametral ratio', taper === 0 ? 'Parallel cylinder' : `1:${num(1 / taper, 6)}`)],
        'The diameter change is measured over the axial taper length.',
        'Match the setup’s angle convention; this does not identify a standard taper.');
    },
    'sine-bar': (v) => {
      const height = v.length * Math.sin(rad(v.angle)), arcseconds = deg(.001 / (v.length * Math.cos(rad(v.angle)))) * 3600;
      return output({ height, arcseconds }, 'Height difference (mm)', height,
        [m('Height difference', q(height, 'mm')), m('Angle change per 1 µm height error', q(arcseconds, 'arcsec'))],
        'The calculated height is the difference between the supporting roller levels.',
        'Use calibrated centre distance and gauge blocks, clean contact surfaces and the instrument’s permitted angle range.');
    },
    'fit-clearance': (v) => {
      if (v.holeMin > v.holeMax || v.shaftMin > v.shaftMax) return invalid('Each minimum diameter must be no greater than its corresponding maximum.');
      const minimum = v.holeMin - v.shaftMax, maximum = v.holeMax - v.shaftMin;
      const classification = minimum > 0 ? 'CLEARANCE' : maximum < 0 ? 'INTERFERENCE' : minimum === 0 && maximum === 0 ? 'LINE-TO-LINE' : 'CONTACT / TRANSITION';
      return output({ minimum, maximum }, 'Minimum diametral clearance (mm)', minimum,
        [m('Minimum signed clearance', q(minimum, 'mm')), m('Maximum signed clearance', q(maximum, 'mm')), m('Size-only classification', classification)],
        'Negative signed clearance means diametral interference; zero means possible contact.',
        'These are size-only limits. Geometry, coatings, compliance and operating temperature remain to be checked.', { text: classification });
    },
    'thermal-growth': (v) => {
      const changeT = v.final - v.initial, growth = v.length * v.alpha * 1e-6 * changeT, finalLength = v.length + growth;
      if (finalLength <= 0) return invalid('The assumed expansion gives a non-positive length; the constant-coefficient model is not applicable.');
      return output({ changeT, growth, finalLength }, 'Signed length change (mm)', growth,
        [m('Temperature change', q(changeT, 'K')), m('Signed length change', q(growth, 'mm')), m('Final length', q(finalLength, 'mm'))],
        growth >= 0 ? 'The model predicts expansion under the supplied coefficient and temperatures.' : 'The model predicts contraction under the supplied coefficient and temperatures.',
        'Verify the coefficient over this temperature range; the part must be unrestrained and at uniform temperature.');
    },
    'beam-deflection': (v) => {
      const factors = { 'simple-point': [1 / 4, 1 / 48], 'cantilever-point': [1, 1 / 3], 'simple-udl': [1 / 8, 5 / 384] }[v.case];
      const moment = v.load * v.length * factors[0], deflection = v.load * v.length ** 3 * factors[1] / (v.modulus * v.inertia), stress = moment * v.fibre / v.inertia;
      return output({ moment, deflection, stress }, 'Maximum deflection (mm)', deflection,
        [m('Maximum bending moment', q(moment / 1000, 'N·m')), m('Maximum nominal bending stress', q(stress, 'MPa')), m('Maximum deflection', q(deflection, 'mm')), m('Deflection / span', q(deflection / v.length * 100, '%'))],
        'The entered load is a total force, including for the uniformly distributed load case.',
        'Verify small deflection, elastic behaviour, section axis, supports and all other failure modes; no allowable load is established.');
    },
    'shaft-torsion': (v) => {
      if (v.inner >= v.outer) return invalid('The bore must be smaller than the outside diameter.');
      const polar = PI * (v.outer ** 4 - v.inner ** 4) / 32, stress = v.torque * 1000 * v.outer / (2 * polar), twist = v.torque * 1000 * v.length / (v.modulus * polar);
      return output({ polar, stress, twist, degrees: deg(twist) }, 'Peak nominal shear stress (MPa)', stress,
        [m('Polar area moment J', q(polar, 'mm⁴')), m('Peak nominal shear stress', q(stress, 'MPa')), m('Twist', q(deg(twist), '°'))],
        'This result applies to a uniform circular cross-section under elastic torsion.',
        'Assess keyways, shoulders, fatigue, bending and actual material limits separately.');
    },
    'torque-power': (v) => {
      const omega = 2 * PI * v.rpm / 60, torque = v.power * 1000 / omega;
      return output({ omega, torque }, 'Shaft torque (N·m)', torque,
        [m('Shaft torque', q(torque, 'N·m')), m('Angular speed', q(omega, 'rad/s')), m('Mechanical power', q(v.power, 'kW'))],
        'Power and speed refer to the same shaft and steady operating point.',
        'Starting, stall, transient and duty-cycle demands must be assessed separately.');
    },
    'gear-pair': (v) => {
      const driverDiameter = v.module * v.driver, drivenDiameter = v.module * v.driven, centre = (driverDiameter + drivenDiameter) / 2, ratio = v.driven / v.driver, outputRpm = v.rpm / ratio;
      return output({ driverDiameter, drivenDiameter, centre, ratio, outputRpm }, 'Output speed (rpm)', outputRpm,
        [m('Driver reference diameter', q(driverDiameter, 'mm')), m('Driven reference diameter', q(drivenDiameter, 'mm')), m('Nominal centre distance', q(centre, 'mm')), m('Reduction ratio', `${num(ratio, 6)}:1`), m('Output speed', q(outputRpm, 'rpm'))],
        'An external spur pair reverses rotational direction. The calculation assumes no profile shift.',
        'Verify compatible pressure angles, tooth geometry, backlash, undercut and supplier load ratings.');
    },
    'belt-drive': (v) => {
      const R = Math.max(v.driver, v.driven) / 2, r = Math.min(v.driver, v.driven) / 2;
      if (v.centre <= R + r) return invalid('Centre distance must exceed the sum of the pitch radii so the pulleys do not overlap.');
      const alpha = Math.asin((R - r) / v.centre);
      const length = 2 * Math.sqrt(v.centre ** 2 - (R - r) ** 2) + PI * (R + r) + 2 * alpha * (R - r);
      const wrap = 180 - 2 * deg(alpha), outputRpm = v.rpm * v.driver / v.driven, speed = PI * v.driver * v.rpm / 60000;
      return output({ length, wrap, outputRpm, speed }, 'Geometric pitch length (mm)', length,
        [m('Geometric pitch length', q(length, 'mm')), m('Small-pulley wrap', q(wrap, '°')), m('Ideal output speed', q(outputRpm, 'rpm')), m('Belt speed', q(speed, 'm/s'))],
        'The tangent-and-arc geometry is calculated without stretch or slip.',
        'Match pitch/datum length conventions and verify the belt maker’s wrap, tension, speed and power limits.');
    },
    'hydraulic-cylinder': (v) => {
      if (v.rod >= v.bore) return invalid('Rod diameter must be smaller than bore diameter.');
      const piston = area(v.bore), annulus = piston - area(v.rod);
      const extension = .1 * (v.pressure * piston - v.back * annulus), retraction = .1 * (v.pressure * annulus - v.back * piston);
      const extendSpeed = v.flow * 1e6 / (60 * piston), retractSpeed = v.flow * 1e6 / (60 * annulus);
      const extendTime = v.stroke / extendSpeed, retractTime = v.stroke / retractSpeed;
      return output({ piston, annulus, extension, retraction, extendSpeed, retractSpeed, extendTime, retractTime }, 'Ideal extension force (N)', extension,
        [m('Ideal extension force', q(extension / 1000, 'kN')), m('Ideal retraction force', q(retraction / 1000, 'kN')), m('Extension speed', q(extendSpeed, 'mm/s')), m('Retraction speed', q(retractSpeed, 'mm/s')), m('Extension time', q(extendTime, 's')), m('Retraction time', q(retractTime, 's'))],
        extension < 0 || retraction < 0 ? 'Opposing pressure exceeds the driving force in at least one direction. Negative force is retained.' : 'Net port forces include opposing chamber pressure; speeds use the entered inlet flow in each direction.',
        'Seal friction, buckling, mounting, load holding and circuit limits require separate verification.');
    },
    'hydraulic-power': (v) => {
      const fluid = v.pressure * v.flow / 600, shaft = fluid / (v.efficiency / 100), loss = shaft - fluid;
      return output({ fluid, shaft, loss }, 'Pump shaft input (kW)', shaft,
        [m('Hydraulic power', q(fluid, 'kW')), m('Pump shaft input', q(shaft, 'kW')), m('Estimated pump loss', q(loss, 'kW'))],
        'The overall pump efficiency relates shaft input to delivered fluid power.',
        'This pump loss is not total system heat: include motor losses, throttling and other components separately.');
    },
    'pipe-flow': (v) => {
      const velocity = (v.flow / 60000) / area(v.diameter / 1000), reynolds = velocity * (v.diameter / 1000) / (v.viscosity * 1e-6);
      const regime = v.flow === 0 ? 'No mean flow' : reynolds < 2000 ? 'Laminar guide band' : reynolds <= 4000 ? 'Transition guide band' : 'Turbulent guide band';
      return output({ velocity, reynolds }, 'Reynolds number', reynolds,
        [m('Mean velocity', q(velocity, 'm/s')), m('Reynolds number', num(reynolds, 3)), m('Regime indication', regime)],
        'The regime bands are guides for a full circular pipe carrying a Newtonian liquid.',
        'Actual transition depends on disturbances. No pressure loss or acceptable velocity is determined.');
    },
    'pneumatic-consumption': (v) => {
      if (v.rod >= v.bore) return invalid('Rod diameter must be smaller than bore diameter.');
      const swept = (2 * area(v.bore) - area(v.rod)) * v.stroke / 1e6;
      const absolute = v.pressure + v.ambient, referenceCycle = swept * absolute / v.reference * (v.refTemp + 273.15) / (v.temperature + 273.15), demand = referenceCycle * v.cycles;
      return output({ swept, absolute, referenceCycle, demand }, 'Mean reference air demand (L/min)', demand,
        [m('Swept volume / complete cycle', q(swept, 'L')), m('Working absolute pressure', q(absolute, 'bar absolute')), m('Reference volume / cycle', q(referenceCycle, 'L')), m('Mean reference air demand', q(demand, 'L/min')), m('Reference conditions', `${q(v.reference, 'bar absolute')} at ${q(v.refTemp, '°C')}`)],
        'One complete cycle includes extension and retraction; litres are reported at the displayed reference conditions.',
        'Add pipe and dead volumes and leakage. Peak valve demand and compressor sizing require a separate duty analysis.');
    },
    'stock-mass': (v) => {
      if (v.shape === 'tube' && 2 * v.thickness >= v.width) return invalid('Tube wall thickness must be less than half the outside diameter.');
      const section = v.shape === 'plate' ? v.width * v.thickness : v.shape === 'round' ? area(v.width) : area(v.width) - area(v.width - 2 * v.thickness);
      const volume = section * v.length / 1e9, mass = volume * v.density;
      return output({ section, volume, mass }, 'Theoretical mass (kg)', mass,
        [m('Cross-sectional area', q(section, 'mm²')), m('Volume', q(volume, 'm³', 9)), m('Theoretical mass', q(mass, 'kg'))],
        'The mass follows from constant cross-section and the entered density.',
        'Allow for actual stock tolerances, coatings and features. Use measured mass where the handling task requires it.');
    },
    'bend-allowance': (v) => {
      const angle = rad(v.angle), allowance = angle * (v.radius + v.k * v.thickness), setback = (v.radius + v.thickness) * Math.tan(angle / 2);
      if (v.a < setback || v.b < setback) return invalid('Each outside flange must be at least the outside setback for this radius and bend angle.');
      const deduction = 2 * setback - allowance, flat = v.a + v.b - deduction;
      return output({ allowance, setback, deduction, flat }, 'Developed length (mm)', flat,
        [m('Bend allowance', q(allowance, 'mm')), m('Outside setback', q(setback, 'mm')), m('Bend deduction', q(deduction, 'mm')), m('Developed length', q(flat, 'mm'))],
        'Both flange dimensions are outside dimensions to the theoretical sharp intersection.',
        'K-factor and achieved radius must come from your process. Verify a trial bend before releasing a flat pattern.');
    },
    'punching-force': (v) => {
      const nominal = v.perimeter * v.thickness * v.strength, adjusted = nominal * v.factor, tonnes = adjusted / 9806.65;
      return output({ nominal, adjusted, tonnes }, 'Adjusted force estimate (kN)', adjusted / 1000,
        [m('Nominal cutting force', q(nominal / 1000, 'kN')), m('Adjusted estimate', q(adjusted / 1000, 'kN')), m('Adjusted metric tonne-force', q(tonnes, 'tf'))],
        'The entered perimeter must include all cutting edges acting simultaneously.',
        'Check force through the stroke, energy, stripping, off-centre load and tool strength; this is not a press capacity approval.');
    },
    'process-capability': (v) => {
      if (v.lower >= v.upper) return invalid('The upper specification must exceed the lower specification.');
      const cp = (v.upper - v.lower) / (6 * v.sigma), cpu = (v.upper - v.mean) / (3 * v.sigma), cpl = (v.mean - v.lower) / (3 * v.sigma), cpk = Math.min(cpu, cpl);
      return output({ cp, cpu, cpl, cpk }, 'Cpk', cpk,
        [m('Cp', num(cp, 6)), m('Cpk', num(cpk, 6)), m('Upper-side index', num(cpu, 6)), m('Lower-side index', num(cpl, 6))],
        v.stable === 'yes' ? 'Indices are calculated under your separately confirmed process assumptions; no acceptance threshold is inferred.' : 'These are arithmetic indices only: process stability and distribution suitability have not been confirmed.',
        'Use a valid within-process sigma estimate and a representative study. This calculator does not establish capability.', {
          text: v.stable === 'yes' ? 'INDICES CALCULATED' : 'ASSUMPTIONS UNVERIFIED',
          checks: [check('Process study', v.stable === 'yes' ? 'pass' : 'verify', v.stable === 'yes' ? 'Reported by the user as separately confirmed; not tested here.' : 'Confirm stability, distribution and sampling.'), check('Acceptance criterion', 'verify', 'Compare against the agreed customer or project requirement.')],
        });
    },
    'maintenance-availability': (v) => {
      if (v.uptime + v.downtime <= 0) return invalid('The observation window must include some operating or corrective downtime.');
      const availability = 100 * v.uptime / (v.uptime + v.downtime);
      const mtbf = v.failures > 0 ? v.uptime / v.failures : null, mttr = v.failures > 0 ? v.downtime / v.failures : null;
      return output({ availability, mtbf, mttr }, 'Observed availability (%)', availability,
        [m('Observed availability', q(availability, '%')), m('Operating-time MTBF estimate', mtbf === null ? 'Not estimated: no failures' : q(mtbf, 'h')), m('Average corrective downtime / failure', mttr === null ? 'Not estimated: no failures' : q(mttr, 'h'))],
        'The result describes the entered history for one repairable asset and the chosen downtime definition.',
        'Zero observed failures does not imply infinite MTBF. Do not use this summary alone to set maintenance intervals.', {
          checks: [check('Consistent failure records', v.failures === 0 && v.downtime > 0 ? 'warn' : 'verify', v.failures === 0 && v.downtime > 0 ? 'Corrective downtime is present with no failures; reconcile event definitions.' : 'Use one observation window and a consistent failure definition.')],
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
