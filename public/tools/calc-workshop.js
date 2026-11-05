// BIZOMAT MAKEOS workshop calculations. SI units are explicit at each boundary.
// No catalogue material values, standard fit tables or equipment ratings are inferred.
(() => {
  const PI = Math.PI;
  const rad = (degrees) => degrees * PI / 180;
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
    if (!Number.isFinite(value) || !finite(values)) {
      return invalid('The calculation is outside the supported numeric range. Review the dimensions and units.');
    }
    return result('CALCULATED', 'warn', summary, metrics, limit, {
      primary: primary(label, value, 'engineering'), values,
      checks: [check('Model and application', 'verify', limit)],
      actions: ['Check the method, input sources and limitations below before using this result.'],
      ...extra,
    });
  }
  const finite = (v) => typeof v === 'number' ? Number.isFinite(v) : v && typeof v === 'object' ? Object.values(v).every(finite) : true;
  const methods = {
    'signed-tolerance-stack': (v) => {
      const terms = [1, 2, 3].map((i) => {
        const nominal = v[`n${i}`] * v[`c${i}`], a = (v[`n${i}`] - v[`l${i}`]) * v[`c${i}`], b = (v[`n${i}`] + v[`u${i}`]) * v[`c${i}`];
        return { term: i, nominal, minimum: Math.min(a, b), maximum: Math.max(a, b) };
      });
      const sum = (key) => terms.reduce((s, t) => s + t[key], 0);
      const nominal = sum('nominal'), minimum = sum('minimum'), maximum = sum('maximum'), width = maximum - minimum;
      return output({ nominal, minimum, maximum, width, terms }, 'Minimum signed result (mm)', minimum,
        [m('Nominal result', q(nominal, 'mm')), m('Minimum result', q(minimum, 'mm')), m('Maximum result', q(maximum, 'mm')), m('Total interval width', q(width, 'mm'))],
        'Negative coefficients reverse lower and upper contributions before the limits are summed.',
        'Confirm the dimension equation and functional limits. This interval has no probability or process-capability meaning.', {
          table: { caption: 'Signed dimension contributions', head: ['Term', 'Nominal contribution', 'Lower contribution', 'Upper contribution'], rows: terms.map((t) => [t.term, q(t.nominal, 'mm'), q(t.minimum, 'mm'), q(t.maximum, 'mm')]) },
        });
    },
    'measurement-uncertainty': (v) => {
      const components = [{ name: v.mode === 'mean' ? 'Repeatability of mean' : 'Repeatability of one observation', u: v.sd / (v.mode === 'mean' ? Math.sqrt(v.count) : 1) }, { name: 'Calibration', u: v.cal / v.calK }, { name: 'Digital resolution', u: v.resolution / Math.sqrt(12) }, { name: 'Other rectangular contribution', u: v.bound / Math.sqrt(3) }];
      const variance = components.reduce((s, c) => s + c.u ** 2, 0);
      if (variance === 0) return invalid('At least one uncertainty contribution must be positive. An all-zero budget does not demonstrate perfect measurement.');
      const combined = Math.sqrt(variance), expanded = combined * v.coverage;
      components.forEach((c) => { c.share = c.u ** 2 / variance * 100; });
      return output({ combined, expanded, components }, 'Expanded uncertainty (mm)', expanded,
        [m('Combined standard uncertainty', q(combined, 'mm', 9)), m('Expanded uncertainty', q(expanded, 'mm', 9)), m('Output coverage factor', q(v.coverage, '×'))],
        'The quadrature sum assumes four independent dimensional contributions with unit sensitivity coefficients.',
        'Verify independence, distributions, bias corrections and coverage-factor justification; no confidence percentage or conformity decision is inferred.', {
          text: 'ASSUMPTIONS UNVERIFIED', table: { caption: 'Independent uncertainty contributions', head: ['Contribution', 'Standard uncertainty', 'Share of variance'], rows: components.map((c) => [c.name, q(c.u, 'mm', 9), q(c.share, '%', 3)]) },
        });
    },
    'section-properties': (v) => {
      const circular = ['circle', 'circ-tube'].includes(v.shape), hollow = ['rect-tube', 'circ-tube'].includes(v.shape), b = v.width, h = circular ? b : v.height;
      if (hollow && 2 * v.wall >= Math.min(b, h)) return invalid('Tube wall thickness must be less than half the smallest outside dimension.');
      const bi = hollow ? b - 2 * v.wall : 0, hi = hollow ? h - 2 * v.wall : 0;
      const section = circular ? PI * (b ** 2 - bi ** 2) / 4 : b * h - bi * hi;
      const ix = circular ? PI * (b ** 4 - bi ** 4) / 64 : (b * h ** 3 - bi * hi ** 3) / 12, iy = circular ? ix : (h * b ** 3 - hi * bi ** 3) / 12;
      const zx = ix / (h / 2), zy = iy / (b / 2), rx = Math.sqrt(ix / section), ry = Math.sqrt(iy / section);
      return output({ area: section, ix, iy, zx, zy, rx, ry, cx: b / 2, cy: h / 2 }, 'Centroidal Iₓ (mm⁴)', ix,
        [m('Section area', q(section, 'mm²')), m('Centroid from bounding corner', `${q(b / 2, 'mm')} X; ${q(h / 2, 'mm')} Y`)],
        'X is horizontal and Y is vertical. Bending properties are about the centroidal axes.',
        'Use actual corner geometry and tolerances for real stock. No load capacity or non-circular torsion constant is established.', {
          table: { caption: 'Centroidal section properties', head: ['Axis', 'Second moment I', 'Elastic section modulus Z', 'Gyration radius'], rows: [['Horizontal X', q(ix, 'mm⁴'), q(zx, 'mm³'), q(rx, 'mm')], ['Vertical Y', q(iy, 'mm⁴'), q(zy, 'mm³'), q(ry, 'mm')]] },
        });
    },
    'countersink-depth': (v) => {
      if (v.mouth < v.pilot) return invalid('The mouth diameter must be at least the pilot-hole diameter.');
      const slope = Math.tan(rad(v.angle / 2)), depth = (v.mouth - v.pilot) / (2 * slope), remaining = v.thickness - depth, breakthroughDiameter = v.pilot + 2 * v.thickness * slope;
      const through = remaining <= 1e-12 * Math.max(1, v.thickness, depth);
      return output({ depth, remaining, breakthroughDiameter }, 'Countersink axial depth (mm)', depth,
        [m('Axial depth', q(depth, 'mm')), m('Remaining axial thickness', q(remaining, 'mm')), m('Mouth diameter at just-through depth', q(breakthroughDiameter, 'mm'))],
        through ? 'The ideal cone reaches or passes the opposite face.' : 'The ideal cone ends before the opposite face at these dimensions.', 'Verify actual tolerance, tool geometry and required remaining material.', {
          text: through ? 'BREAKTHROUGH' : 'GEOMETRY CALCULATED', tone: through ? 'bad' : 'warn', checks: [check('Opposite face', through ? 'fail' : 'pass', through ? 'The cone reaches the opposite face.' : 'A positive nominal axial remainder exists.'), check('Application and tolerances', 'verify', 'Confirm minimum wall and seating requirements.')],
        });
    },
    'turning-cusp': (v) => {
      if (v.feed >= 2 * v.radius) return invalid('Feed must be less than twice the circular nose radius.');
      const exact = v.feed ** 2 / (4 * (v.radius + Math.sqrt(v.radius ** 2 - v.feed ** 2 / 4))) * 1000, approximate = v.feed ** 2 / (8 * v.radius) * 1000, difference = exact - approximate;
      return output({ exact, approximate, difference }, 'Ideal peak-to-valley cusp (µm)', exact,
        [m('Exact geometric cusp', q(exact, 'µm')), m('Small-feed approximation', q(approximate, 'µm')), m('Approximation shortfall', q(difference, 'µm'))], 'Peak-to-valley height between adjacent ideal circular tool tracks.', 'This is not measured Ra or Rz. Wear, vibration, material and wiper geometry can change the actual finish.');
    },
    'radial-chip-thinning': (v) => {
      if (v.width > v.diameter) return invalid('Radial engagement cannot exceed cutter diameter in this model.');
      const engagement = v.width / v.diameter, factor = engagement < .5 ? 2 * Math.sqrt(engagement * (1 - engagement)) : 1, multiplier = 1 / factor, perTooth = v.chip * multiplier, feed = perTooth * v.teeth * v.rpm;
      return output({ engagement, factor, multiplier, perTooth, feed }, 'Calculated table feed (mm/min)', feed,
        [m('Radial engagement', q(engagement * 100, '%')), m('Chip-thickness factor', q(factor, '×')), m('Feed multiplier', q(multiplier, '×')), m('Calculated feed per tooth', q(perTooth, 'mm/tooth')), m('Calculated table feed', q(feed, 'mm/min'))],
        'Engagement below half the diameter reduces maximum chip thickness for a 90° peripheral cutter.', 'This is not an approved feed setting. Verify tool limits, changing engagement, entry and machine dynamics.');
    },
    'ball-nose-diameter': (v) => {
      if (v.depth > v.diameter / 2) return invalid('Axial engagement must not exceed the ball radius in this shallow-engagement model.');
      const effective = 2 * Math.sqrt(v.depth * (v.diameter - v.depth)), surface = PI * effective * v.rpm / 1000, rpm = 1000 * v.speed / (PI * effective);
      return output({ effective, surface, rpm }, 'Effective cutting diameter (mm)', effective,
        [m('Maximum engaged diameter', q(effective, 'mm')), m('Boundary surface speed', q(surface, 'm/min')), m('RPM for specified speed', q(rpm, 'rpm'))], 'The diameter is the largest engaged circle at this axial depth for an untilted ball.', 'Contact speed varies and is zero at the centre. Verify contact geometry and spindle/tool limits.');
    },
    'circular-interpolation-feed': (v) => {
      const centreDiameter = v.side === 'internal' ? v.work - v.cutter : v.work + v.cutter;
      if (centreDiameter <= 0) return invalid('For an internal pass, the cutter must be smaller than the bore.');
      const ratio = centreDiameter / v.work, centreFeed = v.feed * ratio, path = PI * centreDiameter, minutes = path / centreFeed;
      return output({ centreDiameter, ratio, centreFeed, path, minutes }, 'Tool-centre feed (mm/min)', centreFeed,
        [m('Centre-path diameter', q(centreDiameter, 'mm')), m('Centre/peripheral feed ratio', q(ratio, '×')), m('Tool-centre feed', q(centreFeed, 'mm/min')), m('One-circle centre travel', q(path, 'mm')), m('Ideal one-circle time', q(minutes, 'min'))], 'Centre feed follows the centre-path to wall-diameter ratio.', 'Check CAM/controller conventions to avoid double compensation. Helical motion, entry and acceleration are excluded.');
    },
    'coolant-blend': (v) => {
      if (v.strong <= v.weak) return invalid('Stronger-fluid concentration must exceed weaker-fluid concentration.');
      if (v.target < v.weak || v.target > v.strong) return invalid('The target must lie between the available concentrations.');
      const strongVolume = v.volume * (v.target - v.weak) / (v.strong - v.weak), weakVolume = v.volume - strongVolume, concentrate = (strongVolume * v.strong + weakVolume * v.weak) / 100;
      return output({ strongVolume, weakVolume, concentrate }, 'Stronger-fluid volume (L)', strongVolume,
        [m('Stronger-fluid volume', q(strongVolume, 'L')), m('Weaker-fluid volume', q(weakVolume, 'L')), m('Final volume', q(v.volume, 'L')), m('Concentrate-equivalent volume', q(concentrate, 'L'))], 'The balance conserves concentrate-equivalent volume assuming additive volumes.', 'Use compatible fluids and volume concentrations. Follow product mixing instructions and measure after circulation.');
    },
    'coolant-topup': (v) => {
      let addition = 0;
      if (v.target !== v.current) {
        if (v.addition === v.target) return invalid('No finite top-up at the target concentration can bring a different initial concentration exactly to target.');
        addition = v.volume * (v.target - v.current) / (v.addition - v.target);
        if (addition <= 0) return invalid('The make-up concentration must be beyond the target in the required direction.');
      }
      const finalVolume = v.volume + addition, margin = v.capacity - finalVolume, fits = margin >= -1e-12 * Math.max(1, v.capacity, finalVolume);
      return output({ addition, finalVolume, margin }, 'Required make-up volume (L)', addition,
        [m('Required make-up volume', q(addition, 'L')), m('Final working volume', q(finalVolume, 'L')), m('Capacity margin', q(margin, 'L'))], v.target === v.current ? 'Current concentration already equals target; no correction is needed.' : 'Concentrate-equivalent volume is conserved during addition with no removal.', 'Confirm compatibility and actual concentration, follow supplier instructions and remeasure after circulation.', {
          text: fits ? 'BALANCE CALCULATED' : 'CAPACITY EXCEEDED', tone: fits ? 'warn' : 'bad', checks: [check('Working capacity', fits ? 'pass' : 'fail', fits ? 'Final volume is within the entered working limit.' : 'Do not add the calculated quantity: it exceeds the working limit.'), check('Fluid condition and procedure', 'verify', 'Confirm supplier instructions and actual fluid condition.')],
        });
    },
    'stock-cut-plan': (v) => {
      const u = {};
      for (const key of ['stock', 'trim', 'kerf', 'length1', 'length2', 'length3']) {
        const scaled = v[key] * 1000;
        if (Math.abs(scaled - Math.round(scaled)) > 1e-6) return invalid('Enter cutting-plan lengths to at most three decimal places in millimetres.');
        u[key] = Math.round(scaled);
      }
      const usable = u.stock - 2 * u.trim;
      if (usable <= 0) return invalid('Stock length must exceed both end trims combined.');
      const pieces = [];
      for (let i = 1; i <= 3; i++) {
        if (v[`count${i}`] && u[`length${i}`] + u.kerf > usable) return invalid(`Part ${i}, including kerf, cannot fit in one trimmed bar.`);
        for (let j = 0; j < v[`count${i}`]; j++) pieces.push({ part: i, length: u[`length${i}`] });
      }
      if (!pieces.length) return invalid('Enter at least one required piece.');
      pieces.sort((a, b) => b.length - a.length || a.part - b.part);
      const plan = [];
      for (const piece of pieces) {
        const required = piece.length + u.kerf;
        let bar = plan.find((b) => b.remaining >= required);
        if (!bar) { bar = { pieces: [], remaining: usable }; plan.push(bar); }
        bar.pieces.push(piece); bar.remaining -= required;
      }
      const netU = pieces.reduce((s, p) => s + p.length, 0), kerfU = pieces.length * u.kerf, bars = plan.length, grossU = bars * u.stock, trimU = bars * 2 * u.trim, offcutU = plan.reduce((s, b) => s + b.remaining, 0), lowerBound = Math.ceil((netU + kerfU) / usable);
      const minimumProven = bars === lowerBound, toBuy = Math.max(0, bars - v.available), yieldPercent = netU / grossU * 100, mm = (x) => x / 1000;
      const barRows = plan.map((b, index) => ({ bar: index + 1, cuts: [1, 2, 3].map((i) => ({ part: i, count: b.pieces.filter((p) => p.part === i).length, length: mm(u[`length${i}`]) })).filter((c) => c.count), net: mm(b.pieces.reduce((s, p) => s + p.length, 0)), kerf: mm(b.pieces.length * u.kerf), trim: mm(2 * u.trim), offcut: mm(b.remaining) }));
      return output({ bars, toBuy, lowerBound, minimumProven, pieces: pieces.length, net: mm(netU), kerf: mm(kerfU), trim: mm(trimU), offcut: mm(offcutU), gross: mm(grossU), yieldPercent, barRows }, 'Stock bars required', bars,
        [m('Bars required', bars), m('Bars to purchase', toBuy), m('Material lower bound', lowerBound), m('Finished part length', q(mm(netU), 'mm', 3)), m('Total kerf', q(mm(kerfU), 'mm', 3)), m('Total end trim', q(mm(trimU), 'mm', 3)), m('Total offcuts', q(mm(offcutU), 'mm', 3)), m('Finished-length yield', q(yieldPercent, '%', 3))], minimumProven ? 'This feasible plan matches the material lower bound, proving minimum bar count within the stated model.' : 'This longest-first plan is feasible but is not proved to use the fewest bars.', 'One kerf is reserved per piece, including the last. Verify clamping, trim losses, quality and machining allowances.', {
          text: minimumProven ? 'MINIMUM BAR COUNT PROVED' : 'FEASIBLE PLAN', table: { caption: 'Per-bar plan: parts + kerf + two end trims + offcut = stock length', head: ['Bar', 'Finished cuts', 'Part length', 'Kerf', 'Two end trims', 'Offcut'], rows: barRows.map((b) => [b.bar, b.cuts.map((c) => `P${c.part}: ${c.count} × ${q(c.length, 'mm', 3)}`).join('; '), q(b.net, 'mm', 3), q(b.kerf, 'mm', 3), q(b.trim, 'mm', 3), q(b.offcut, 'mm', 3)]) },
        });
    },
    'fillet-weld-quantity': (v) => {
      const area = v.leg ** 2 / 2, throat = v.leg / Math.sqrt(2), volume = area * v.length * v.profile, deposited = volume / 1e9 * v.density, consumable = deposited / (v.efficiency / 100);
      return output({ area, throat, volume, deposited, consumable }, 'Estimated consumed filler (kg)', consumable,
        [m('Ideal triangular area', q(area, 'mm²')), m('Ideal geometric throat', q(throat, 'mm')), m('Adjusted deposited volume', q(volume, 'mm³')), m('Deposited mass', q(deposited, 'kg')), m('Estimated consumed filler', q(consumable, 'kg'))], 'The triangular volume includes the supplied profile factor before density and deposition efficiency are applied.', 'Quantity estimate only. Confirm actual profile, consumable accounting and purchasing waste; weld design remains separate.');
    },
    'welding-heat-input': (v) => {
      const power = v.voltage * v.current / 1000, arc = 60 * power / v.travel, heat = arc * v.efficiency / 100;
      return output({ power, arc, heat }, 'Adjusted heat input (kJ/mm)', heat,
        [m('Steady arc power', q(power, 'kW')), m('Unadjusted arc energy', q(arc, 'kJ/mm')), m('Efficiency-adjusted heat input', q(heat, 'kJ/mm'))], 'Arc energy is separate from the supplied efficiency adjustment.', 'Use the applicable procedure convention. Product of average voltage and current is unsuitable for general pulsed power. No procedure approval is implied.');
    },
    'tube-bend-length': (v) => {
      const perBend = v.radius * rad(v.angle), arcs = perBend * v.bends, length = v.straight + arcs;
      return output({ perBend, arcs, length }, 'Geometric centreline length (mm)', length,
        [m('Arc length per bend', q(perBend, 'mm')), m('Total bend arc length', q(arcs, 'mm')), m('Total straight tangent length', q(v.straight, 'mm')), m('Geometric centreline length', q(length, 'mm'))], 'Straight tangent lengths are added to identical centreline arcs.', 'Production blanks require forming, clamping and trim allowances. Do not substitute outside-intersection dimensions for tangent lengths.');
    },
    'thermal-fit': (v) => {
      const holeGrowth = v.hole * v.holeAlpha * 1e-6 * (v.holeTemp - v.reference), shaftGrowth = v.shaft * v.shaftAlpha * 1e-6 * (v.shaftTemp - v.reference), hole = v.hole + holeGrowth, shaft = v.shaft + shaftGrowth;
      if (hole <= 0 || shaft <= 0) return invalid('The assumed expansion gives a non-positive diameter; this model is not applicable.');
      const referenceClearance = v.hole - v.shaft, clearanceChange = holeGrowth - shaftGrowth, clearance = referenceClearance + clearanceChange;
      return output({ hole, shaft, holeGrowth, shaftGrowth, referenceClearance, clearanceChange, clearance }, 'Operating signed clearance (mm)', clearance,
        [m('Operating hole diameter', q(hole, 'mm', 9)), m('Operating shaft diameter', q(shaft, 'mm', 9)), m('Reference signed clearance', q(referenceClearance, 'mm', 9)), m('Thermal clearance change', q(clearanceChange, 'mm', 9)), m('Operating signed clearance', q(clearance, 'mm', 9))], 'Positive clearance is a diametral gap; negative clearance is geometric interference.', 'Verify coefficients, uniform unrestrained temperatures and dimensional limits. No contact stress or assembly force is calculated.');
    },
    'axial-stress': (v) => {
      const stress = v.force / v.area, strain = stress / v.modulus, extension = strain * v.length, energy = v.force * extension / 2000;
      return output({ stress, strain, extension, energy }, 'Signed axial length change (mm)', extension,
        [m('Signed nominal stress', q(stress, 'MPa')), m('Signed elastic strain', q(strain, 'mm/mm', 9)), m('Signed length change', q(extension, 'mm')), m('Elastic strain energy', q(energy, 'J'))], 'Positive force gives tension/extension; negative force gives compression/shortening.', 'Verify elastic range, concentric loading, local effects and compression buckling. No allowable load is established.');
    },
  };
  window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
  window.GOCORE_CALC_PARTS.push((id) => {
    if (!Object.prototype.hasOwnProperty.call(methods, id)) return;
    const inputs = read(window.GOCORE_TOOLS.find((t) => t.id === id));
    return inputs.error ? invalid(inputs.error) : methods[id](inputs.values);
  });
})();
