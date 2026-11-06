// BIZOMAT MAKEOS handbook calculations: bearings, chain, belt, screw, pipe, pump, alignment, expansion and cylinder volume.
// Units are stated on every input and output. Results are preliminary screening values for idealised models only;
// no manufacturer ratings, material properties or acceptance limits are built in.
(() => {
  const PI = Math.PI;
  const G = 9.80665; // standard gravity, m/s²
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
  // `checks` adds tool-specific warnings to the model check every result carries.
  function output(values, label, value, metrics, summary, limit, checks = []) {
    if (!Number.isFinite(value) || Object.values(values).some((v) => typeof v === 'number' && !Number.isFinite(v))) {
      return invalid('The calculation is outside the supported numeric range. Review the dimensions and units.');
    }
    return result('CALCULATED', 'warn', summary, metrics, limit, {
      primary: primary(label, value, 'engineering'), values,
      checks: [...checks, check('Model and application', 'verify', limit)],
      actions: ['Check the method, input sources and limitations below before using this result.'],
    });
  }
  const methods = {
    'bearing-l10-life': (v) => {
      const exponent = v.type === 'roller' ? 10 / 3 : 3;
      const revolutions = Math.pow(v.C / v.P, exponent), hours = revolutions * 1e6 / (60 * v.rpm);
      return output({ exponent, revolutions, hours }, 'Basic rating life L10h (h)', hours,
        [m('Basic rating life L10', q(revolutions, 'million revolutions')), m('Basic rating life L10h', q(hours, 'h')), m('Life exponent p', v.type === 'roller' ? '10/3 (roller bearing)' : '3 (ball bearing)'), m('Load ratio C/P', q(v.C / v.P, ''))],
        'L10 is the life that 90% of a large group of identical bearings is expected to reach or exceed at constant load and speed.',
        'This is basic rating life only: no reliability, lubrication, contamination or material life-modification factors are applied.',
        v.P > v.C ? [check('Load level', 'warn', 'The equivalent load exceeds the dynamic rating, so life is under one million revolutions. Confirm the selection with the bearing manufacturer.')] : []);
    },
    'bearing-static-ratio': (v) => {
      const s0 = v.C0 / v.P0;
      return output({ s0 }, 'Static safety factor s0', s0,
        [m('Static safety factor s0', q(s0, '')), m('Basic static load rating C0', q(v.C0, 'kN')), m('Equivalent static load P0', q(v.P0, 'kN'))],
        's0 compares the catalogue static rating with the equivalent static load from the application.',
        'The minimum acceptable s0 depends on the bearing type, application and manufacturer; none is assumed here.',
        s0 < 1 ? [check('Static rating', 'warn', 'The equivalent static load exceeds the basic static load rating.')] : []);
    },
    'chain-linear-speed': (v) => {
      const speed = v.pitch * v.teeth * v.rpm / 60000, half = PI / v.teeth;
      const variation = 100 * (PI / v.teeth) * (1 / Math.sin(half) - 1 / Math.tan(half));
      return output({ speed, variation }, 'Average chain speed (m/s)', speed,
        [m('Average chain speed', q(speed, 'm/s')), m('Average chain speed', q(speed * 60, 'm/min')), m('Chordal speed variation', q(variation, '%', 4))],
        'Average chain speed is pitch × teeth × sprocket speed; the chordal variation is the speed fluctuation from the polygonal wrap.',
        'Chain rating, lubrication regime, wear elongation and maximum permitted speed come from the chain manufacturer.');
    },
    'pulley-speed-ratio': (v) => {
      const ratio = v.driven / v.driver, drivenRpm = v.rpm / ratio, beltSpeed = PI * v.driver * v.rpm / 60000;
      return output({ ratio, drivenRpm, beltSpeed }, 'Ideal driven speed (rpm)', drivenRpm,
        [m('Ideal driven speed', q(drivenRpm, 'rpm')), m('Speed ratio (driven ÷ driver)', q(ratio, '')), m('Belt speed', q(beltSpeed, 'm/s'))],
        'Speeds use pitch diameters and assume no slip or creep.',
        'Belt slip and creep reduce the driven speed in practice; power rating and belt speed limits come from the belt manufacturer.');
    },
    'leadscrew-speed': (v) => {
      const speed = v.lead * v.rpm / 60;
      return output({ speed }, 'Linear travel speed (mm/s)', speed,
        [m('Linear travel speed', q(speed, 'mm/s')), m('Linear travel speed', q(speed * 60, 'mm/min'))],
        'Travel speed is lead × screw speed. Lead is travel per revolution: pitch × number of starts.',
        'Backlash, acceleration, critical speed and the nut speed limit are not checked.');
    },
    'leadscrew-torque': (v) => {
      const ideal = v.force * v.lead / 1000 / (2 * PI), torque = ideal / v.efficiency;
      return output({ ideal, torque }, 'Input torque (N·m)', torque,
        [m('Input torque at entered efficiency', q(torque, 'N·m')), m('Frictionless torque (efficiency 1)', q(ideal, 'N·m')), m('Overall efficiency', q(v.efficiency, ''))],
        'Torque to drive a steady axial load: T = F × lead / (2π × efficiency).',
        'Acceleration, bearing and seal drag, and back-driving or load holding are not included; efficiency must come from the screw manufacturer for this duty.');
    },
    'pipe-flow-velocity': (v) => {
      const flowArea = area(v.diameter), velocity = (v.flow / 60000) / (flowArea / 1e6);
      return output({ flowArea, velocity }, 'Mean flow velocity (m/s)', velocity,
        [m('Mean flow velocity', q(velocity, 'm/s')), m('Flow area', q(flowArea, 'mm²'))],
        'Mean velocity is volumetric flow divided by the internal bore area of a full circular pipe.',
        'Acceptable velocity limits depend on the fluid, pipe material and application; none is assumed here.');
    },
    'darcy-pipe-drop': (v) => {
      const pa = v.friction * v.length / (v.diameter / 1000) * v.density * v.velocity * v.velocity / 2;
      const kpa = pa / 1000, headLoss = pa / (v.density * G);
      const usual = v.friction >= 0.008 && v.friction <= 0.1;
      return output({ pa, kpa, headLoss }, 'Friction pressure drop (kPa)', kpa,
        [m('Friction pressure drop', q(kpa, 'kPa')), m('Friction pressure drop', q(kpa / 100, 'bar')), m('Friction head loss', q(headLoss, 'm of fluid'))],
        'Darcy–Weisbach friction loss for fully developed flow in a straight circular pipe: Δp = f × (L / D) × ρv² / 2.',
        'Fittings, valves, entrances, exits and elevation change are excluded. The Darcy factor must suit the Reynolds number and pipe roughness.',
        usual ? [] : [check('Friction factor', 'warn', 'Outside the usual turbulent range of about 0.008 to 0.1. Confirm it is a Darcy factor (a Fanning factor is one quarter of it); for laminar flow f = 64/Re.')]);
    },
    'pump-shaft-power': (v) => {
      const hydraulic = v.density * G * (v.flow / 60000) * v.head / 1000, shaft = hydraulic / v.efficiency;
      return output({ hydraulic, shaft }, 'Pump shaft power (kW)', shaft,
        [m('Pump shaft power', q(shaft, 'kW')), m('Hydraulic (water) power', q(hydraulic, 'kW')), m('Overall pump efficiency', q(v.efficiency, ''))],
        'Hydraulic power is ρ × g × Q × H; shaft power divides it by the pump efficiency at this duty.',
        'Read efficiency from the pump curve at the duty point. Motor sizing allowances and motor losses are not included.');
    },
    'shaft-angular-offset': (v) => {
      const radians = Math.atan(v.difference / v.span), degrees = radians * 180 / PI, per100 = 100 * v.difference / v.span;
      return output({ radians, degrees, per100 }, 'Angular misalignment (degrees)', degrees,
        [m('Angular misalignment', q(degrees, '°')), m('Angular misalignment', q(radians * 1000, 'mrad')), m('Slope', q(per100, 'mm per 100 mm'))],
        'Angle from a relative offset change across a known axial span.',
        'Enter the actual offset change, not a raw rim-indicator reading (half the total indicator reading for a rim measurement). Acceptable misalignment comes from the coupling and machine makers.');
    },
    'differential-expansion': (v) => {
      const boreGrowth = v.diameter * v.boreAlpha * 1e-6 * v.deltaT, shaftGrowth = v.diameter * v.shaftAlpha * 1e-6 * v.deltaT;
      const change = boreGrowth - shaftGrowth;
      const meaning = change > 0 ? 'Clearance increases (or interference reduces)' : change < 0 ? 'Clearance reduces (or interference increases)' : 'No change';
      return output({ boreGrowth, shaftGrowth, change }, 'Change in diametral clearance (mm)', change,
        [m('Change in diametral clearance', q(change, 'mm')), m('Bore growth', q(boreGrowth, 'mm')), m('Shaft growth', q(shaftGrowth, 'mm')), m('Effect', meaning)],
        'Both parts are assumed to change by the same uniform temperature with constant expansion coefficients.',
        'Real parts rarely share one temperature; coefficients vary with temperature and alloy. Use supplier property data.');
    },
    'cylinder-swept-volume': (v) => {
      if (v.rod >= v.bore) return invalid('Rod diameter must be smaller than bore diameter.');
      const extend = area(v.bore) * v.stroke / 1e6, retract = (area(v.bore) - area(v.rod)) * v.stroke / 1e6, total = extend + retract;
      return output({ extend, retract, total }, 'Swept volume per complete cycle (L)', total,
        [m('Swept volume per complete cycle', q(total, 'L')), m('Extend stroke (full bore)', q(extend, 'L')), m('Retract stroke (annulus)', q(retract, 'L'))],
        'Geometric swept volume of a double-acting cylinder at cylinder conditions, one extend and one retract stroke.',
        'This is not free-air consumption: pressure and temperature conversion, dead volume, tubing volume and leakage are excluded.');
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
