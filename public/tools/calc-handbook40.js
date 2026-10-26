// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook40). SI units are explicit at each boundary.
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
    "drop-impact-design": (v) => {
      const W = v.mass * 9.80665, EI = v.E * 1000 * v.I, ss = v.support === 'ss', dst = ss ? W * v.L ** 3 / (48 * EI) : W * v.L ** 3 / (3 * EI), M = ss ? W * v.L / 4 : W * v.L, sst = M * v.c / v.I;
      const k = 1 + Math.sqrt(1 + 2 * v.h / dst), sd = k * sst, dd = k * dst, E = W * (v.h + dd) / 1000, Feq = k * W, kA = v.allow / sst, hAllow = kA >= 2 ? dst * ((kA - 1) ** 2 - 1) / 2 : 0;
      const okS = sd <= v.allow, okD = dd <= v.dMax, ok = okS && okD;
      return output({ dst, sst, k, dd, sd, E, Feq, hAllow }, 'Dynamic stress (MPa)', sd,
        [m('Static deflection / stress', `${q(dst, 'mm', 4)} / ${q(sst, 'MPa', 2)}`), m('Impact factor', q(k, '', 2)), m('Dynamic deflection', q(dd, 'mm', 3)), m('Dynamic stress', q(sd, 'MPa', 1)), m('Equivalent static force', q(Feq / 1000, 'kN', 2)), m('Energy absorbed', q(E, 'J', 1)), m('Largest safe drop height', kA >= 2 ? q(hAllow, 'mm', 0) : 'None: even a suddenly applied load overstresses the beam')],
        'Drop impact on a beam.', 'Elastic beam; beam mass neglected.', {
          text: ok ? 'BEAM SURVIVES THE DROP' : 'BEAM OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Dynamic stress', okS ? 'pass' : 'fail', `${q(sd, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}.`), check('Dynamic deflection', okD ? 'pass' : 'fail', `${q(dd, 'mm', 2)} against ${q(v.dMax, 'mm', 1)}.`), check('Contact', 'verify', 'Check local bearing and shear at the impact point.')],
        });
    },
    "centerless-grinding-plan": (v) => {
      const base = PI * v.Dr * v.nr * v.slip / 100, feed = base * Math.sin(rad(v.angle)), nw = v.Dr * v.nr * Math.cos(rad(v.angle)) / v.dw, ppm = feed / (v.L + v.gap), passes = Math.ceil(v.stock / v.perPass - 1e-9), pph = ppm * 60 / passes;
      const sReq = v.target * (v.L + v.gap) * passes / 60 / base, angReq = sReq < 1 ? deg(Math.asin(sReq)) : Infinity, okO = pph >= v.target, okA = angReq <= v.angMax, ok = okO;
      return output({ feed, nw, ppm, passes, pph, angReq: Number.isFinite(angReq) ? angReq : 90 }, 'Parts per hour', pph,
        [m('Through-feed rate', q(feed, 'mm/min', 0)), m('Work rotation speed', q(nw, 'rpm', 0)), m('Parts per minute (one pass)', q(ppm, '', 2)), m('Passes for the stock', q(passes, '', 0)), m('Parts per hour', q(pph, '', 0)), m('Inclination for the target', Number.isFinite(angReq) ? q(angReq, '°', 2) : 'Not reachable at this wheel speed')],
        'Centerless grinding plan.', 'End-to-end feeding; constant slip.', {
          text: ok ? 'OUTPUT REACHED' : 'OUTPUT TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Output', okO ? 'pass' : 'fail', `${q(pph, '', 0)} parts per hour against ${q(v.target, '', 0)}.`), check('Inclination for the target', okA ? 'pass' : 'warn', okA ? `${q(angReq, '°', 2)} is within your ${q(v.angMax, '°', 1)} limit.` : 'Target needs more inclination than you use: raise wheel speed or take more stock per pass.')],
        });
    },
    "sawing-plan": (v) => {
      if (v.shape === 'tube' && 2 * v.b >= v.a) return invalid('The tube wall is too thick for its diameter.');
      const area = (v.shape === 'round' ? PI * v.a * v.a / 4 : v.shape === 'rect' ? v.a * v.b : PI * (v.a ** 2 - Math.max(0, v.a - 2 * v.b) ** 2) / 4) / 100, tcut = area / v.rate, perHour = 3600 / (tcut * 60 + v.handle);
      const ppb = Math.floor((v.bar - v.ends) / (v.piece + v.kerf));
      if (ppb < 1) return invalid('The piece is longer than the usable bar length.');
      const bars = Math.ceil(v.cuts / ppb), blades = v.cuts * area / v.life, changes = Math.max(Math.ceil(blades - 1e-9) - 1, 0), minutes = v.cuts * (tcut + v.handle / 60) + changes * v.change, hours = minutes / 60;
      const costCut = (v.rateH * hours + blades * v.bladeCost) / v.cuts, yieldPct = ppb * v.piece / v.bar * 100, ok = hours <= v.avail;
      return output({ area, tcut, perHour, ppb, bars, blades, changes, hours, costCut, yieldPct }, 'Total time (h)', hours,
        [m('Section area', q(area, 'cm²', 2)), m('Cutting time per cut', q(tcut, 'min', 2)), m('Cuts per hour', q(perHour, '', 1)), m('Pieces per bar / bars needed', `${q(ppb, '', 0)} / ${q(bars, '', 0)}`), m('Material yield', q(yieldPct, '%', 1)), m('Blades used / changes', `${q(blades, '', 2)} / ${q(changes, '', 0)}`), m('Total time', q(hours, 'h', 2)), m('Cost per cut', money(costCut))],
        'Bandsaw cutting plan.', 'Constant cutting rate.', {
          text: ok ? 'BATCH FITS THE TIME' : 'BATCH OVERRUNS', tone: ok ? 'good' : 'bad',
          checks: [check('Time', ok ? 'pass' : 'fail', `${q(hours, 'h', 2)} against ${q(v.avail, 'h', 1)} available.`), check('Material', 'verify', `Order ${q(bars, '', 0)} bars of ${q(v.bar, 'mm', 0)}.`)],
        });
    },
    "motor-load-assessment": (v) => {
      const ns = 120 * v.f / Number(v.poles);
      if (v.n >= ns || v.nRated >= ns) return invalid('Speeds must be below the synchronous speed.');
      const eta = v.eff / 100, Ir = v.kW * 1000 / (Math.sqrt(3) * v.V * v.pf * eta), Tr = 9549.2966 * v.kW / v.nRated, slip = 100 * (ns - v.n) / ns, sr = 100 * (ns - v.nRated) / ns, load = 100 * slip / sr;
      const Pout = v.kW * load / 100, Pin = Pout / eta, T = 9549.2966 * Pout / v.n, I = Ir * load / 100, kWh = Pin * v.hours, cost = kWh * v.price, okO = load <= 100, okL = load >= v.loMin;
      return output({ ns, Ir, Tr, slip, sr, load, Pout, Pin, T, I, kWh, cost }, 'Estimated load (%)', load,
        [m('Synchronous speed', q(ns, 'rpm', 0)), m('Rated current / torque', `${q(Ir, 'A', 2)} / ${q(Tr, 'N·m', 1)}`), m('Slip measured / rated', `${q(slip, '', 2)} / ${q(sr, '%', 2)}`), m('Estimated load', q(load, '%', 0)), m('Estimated output / input', `${q(Pout, '', 2)} / ${q(Pin, 'kW', 2)}`), m('Torque at the measured speed', q(T, 'N·m', 1)), m('Estimated current (upper bound)', q(I, 'A', 1)), m('Energy per year', q(kWh, 'kWh', 0)), m('Cost per year', money(cost))],
        'Motor load assessment.', 'Slip method; rated efficiency assumed.', {
          text: !okO ? 'MOTOR OVERLOADED' : okL ? 'MOTOR LOAD NORMAL' : 'MOTOR OVERSIZED', tone: !okO ? 'bad' : okL ? 'good' : 'warn',
          checks: [check('Overload', okO ? 'pass' : 'fail', okO ? 'At or below rated load.' : 'Above rated load: check cooling, current and protection.'), check('Light load', okL ? 'pass' : 'warn', okL ? 'Load above your oversizing threshold.' : `Below ${q(v.loMin, '%', 0)} load: efficiency and power factor are poor.`), check('Measurement', 'verify', 'Confirm with measured input power or current where the decision matters.')],
        });
    },
    "bolted-joint-temperature": (v) => {
      if (v.Lt > v.grip) return invalid('The threaded length cannot exceed the grip.');
      const At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, Ad = PI * v.d * v.d / 4, Eb = v.Eb * 1000, kb = 1 / ((v.grip - v.Lt) / (Eb * Ad) + v.Lt / (Eb * At));
      const km = 0.5774 * PI * v.Em * 1000 * v.d / (2 * Math.log(5 * (0.5774 * v.grip + 0.5 * v.d) / (0.5774 * v.grip + 2.5 * v.d))), kser = kb * km / (kb + km);
      const proof = v.Sp * At, Fi = v.pct / 100 * proof, dF = (v.am - v.ab) * 1e-6 * v.dT * v.grip * kser, Fhot = Fi + dF, okC = Fhot >= v.Freq * 1000, okP = Fhot <= proof, ok = okC && okP;
      return output({ At, kb, km, kser, proof, Fi, dF, Fhot }, 'Preload at temperature (kN)', Fhot / 1000,
        [m('Bolt / member stiffness', `${q(kb / 1000, '', 1)} / ${q(km / 1000, 'kN/mm', 1)}`), m('Assembly preload', q(Fi / 1000, 'kN', 2)), m('Preload change', q(dF / 1000, 'kN', 2)), m('Preload at temperature', q(Fhot / 1000, 'kN', 2)), m('Share of proof load at temperature', q(Fhot / proof * 100, '%', 0))],
        'Bolted joint at temperature.', 'Constant moduli; uniform temperature.', {
          text: ok ? 'PRELOAD HOLDS' : 'PRELOAD OUT OF RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Clamp', okC ? 'pass' : 'fail', `${q(Fhot / 1000, 'kN', 1)} against ${q(v.Freq, 'kN', 1)} needed.`), check('Proof load', okP ? 'pass' : 'fail', `${q(Fhot / 1000, 'kN', 1)} against ${q(proof / 1000, 'kN', 1)} proof.`), check('Other extreme', 'verify', 'Run the opposite temperature change too (heating and cooling).')],
        });
    },
    "bolt-circle-layout": (v) => {
      if (v.OD <= v.BCD || (v.ID > 0 && v.ID >= v.BCD)) return invalid('The bolt circle must lie between the bore and the outside diameter.');
      const step = 360 / v.n, chord = v.BCD * Math.sin(PI / v.n), lig = chord - v.dh, eOut = (v.OD - v.BCD) / 2 - v.dh / 2, eIn = v.ID > 0 ? (v.BCD - v.ID) / 2 - v.dh / 2 : Infinity;
      const nMax = v.wrench > 0 ? (v.wrench < v.BCD ? Math.floor(PI / Math.asin(v.wrench / v.BCD) + 1e-9) : 1) : Infinity, okL = lig >= v.minLig, okE = eOut >= v.minEdge && eIn >= v.minEdge, okW = chord >= v.wrench, ok = okL && okE && okW;
      const rows = Array.from({ length: Math.min(v.n, 60) }, (_, i) => { const a = v.start + i * step, x = v.BCD / 2 * Math.cos(rad(a)), y = v.BCD / 2 * Math.sin(rad(a)); return [String(i + 1), q(a, '°', 2), q(Math.abs(x) < 1e-9 ? 0 : x, 'mm', 3), q(Math.abs(y) < 1e-9 ? 0 : y, 'mm', 3)]; });
      return output({ step, chord, lig, eOut, eIn: Number.isFinite(eIn) ? eIn : 0, nMax: Number.isFinite(nMax) ? nMax : 0, x1: v.BCD / 2 * Math.cos(rad(v.start)), y1: v.BCD / 2 * Math.sin(rad(v.start)) }, 'Adjacent centre chord (mm)', chord,
        [m('Angular step', q(step, '°', 3)), m('Chord between neighbouring holes', q(chord, 'mm', 3)), m('Ligament', q(lig, 'mm', 2)), m('Edge distance outside / bore', `${q(eOut, '', 2)} / ${Number.isFinite(eIn) ? q(eIn, 'mm', 2) : 'solid'}`), m('Most bolts for the socket', Number.isFinite(nMax) ? q(nMax, '', 0) : 'No socket entered')],
        'Bolt circle layout.', 'Equally spaced holes.', {
          text: ok ? 'LAYOUT ADEQUATE' : 'LAYOUT NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          table: tbl('Hole coordinates (from the circle centre)', ['Hole', 'Angle', 'X', 'Y'], rows),
          checks: [check('Ligament', okL ? 'pass' : 'fail', `${q(lig, 'mm', 2)} against ${q(v.minLig, 'mm', 1)}.`), check('Edge distance', okE ? 'pass' : 'fail', `Smallest edge distance ${q(Math.min(eOut, eIn), 'mm', 2)} against ${q(v.minEdge, 'mm', 1)}.`), check('Wrench clearance', okW ? 'pass' : 'fail', okW ? 'The socket fits between neighbouring bolts.' : `Chord ${q(chord, 'mm', 1)} is less than the ${q(v.wrench, 'mm', 1)} socket: use fewer bolts or a larger circle.`)],
        });
    },
    "tapping-plan": (v) => {
      if (v.pMax <= v.pMin) return invalid('The largest percentage must exceed the smallest.');
      const k = v.tap === 'cut' ? 0.01299 : 0.0068, drill = v.D - k * v.pct * v.pitch, minor = v.D - 1.082532 * v.pitch;
      if (drill <= 0) return invalid('The pitch is too coarse for this diameter.');
      const dUse = v.drillHave || drill, pctHave = (v.D - dUse) / (k * v.pitch), n0 = 1000 * v.vc / (PI * v.D), n = Math.min(n0, v.nmax), feed = v.pitch * n, tF = v.depth / feed * 60, tR = tF / v.rev, tHole = tF + tR + v.other, tBatch = tHole * v.holes / 60;
      const ok = pctHave >= v.pMin && pctHave <= v.pMax;
      return output({ drill, minor, dUse, pctHave, n, feed, tF, tR, tHole, tBatch }, 'Tap drill for the target (mm)', drill,
        [m('Tap drill for the target', q(drill, 'mm', 3)), m('Basic minor diameter', q(minor, 'mm', 3)), m('Thread percentage with the drill used', `${q(pctHave, '%', 1)} (${q(dUse, 'mm', 2)} drill)`), m('Spindle speed', `${q(n, 'rpm', 0)}${n < n0 ? ' (held to the machine maximum)' : ''}`), m('Synchronous feed', q(feed, 'mm/min', 0)), m('Forward / retract time', `${q(tF, '', 2)} / ${q(tR, 's', 2)}`), m('Time per hole', q(tHole, 's', 2)), m('Batch time', q(tBatch, 'min', 1))],
        'Tapping plan.', 'Basic metric thread.', {
          text: ok ? 'DRILL ACCEPTABLE' : 'DRILL OUT OF RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Thread percentage', ok ? 'pass' : 'fail', `${q(pctHave, '%', 1)} against ${q(v.pMin, '', 0)}–${q(v.pMax, '%', 0)}.`), check('Tap type', v.tap === 'form' ? 'verify' : 'pass', v.tap === 'form' ? 'Forming taps need ductile material and a closely held hole size.' : 'Cutting tap.')],
        });
    },
    "machine-tipping-stability": (v) => {
      const W = v.mass * 9.80665, th = rad(v.tilt), h = v.hcg / 1000, b = v.b / 1000, Mr = W * (b * Math.cos(th) - h * Math.sin(th)), Mo = W * v.aH * h + v.Fh * v.hF / 1000;
      if (Mr <= 0) return invalid('The floor slope alone tips the machine.');
      if (Mo <= 0) return invalid('Enter an acceleration or a horizontal force.');
      const sf = Mr / Mo, aTip = b / h, tTip = deg(Math.atan(b / h)), need = sf < v.req, Ta = need && v.nA > 0 ? (v.req * Mo - Mr) / (v.nA * v.La / 1000) : 0;
      const okA = !need || (v.nA > 0 && Ta <= v.cap * 1000), st = !need ? { t: 'STABLE', tone: 'good' } : okA ? { t: 'ANCHORS NEEDED', tone: 'warn' } : { t: 'UNSTABLE', tone: 'bad' };
      return output({ Mr, Mo, sf, aTip, tTip, Ta }, 'Safety factor against tipping', sf,
        [m('Restoring moment', q(Mr / 1000, 'kN·m', 2)), m('Overturning moment', q(Mo / 1000, 'kN·m', 2)), m('Safety factor', q(sf, '', 2)), m('Acceleration that tips it (level floor)', q(aTip, 'g', 3)), m('Tilt that tips it', q(tTip, '°', 1)), m('Anchor tension needed', need ? (v.nA > 0 ? q(Ta / 1000, 'kN per anchor', 2) : 'Anchors needed') : 'None')],
        'Machine tipping stability.', 'Rigid body about one edge.', {
          text: st.t, tone: st.tone,
          checks: [check('Tipping', need ? 'warn' : 'pass', `Factor ${q(sf, '', 2)} against ${q(v.req, '', 1)}.`), check('Anchors', okA ? 'pass' : 'fail', !need ? 'Not needed.' : v.nA > 0 ? `${q(Ta / 1000, 'kN', 2)} per anchor against ${q(v.cap, 'kN', 1)}.` : 'No anchors entered on the uplift side.'), check('Sliding', 'verify', 'Check friction or anchor shear against sliding as well.')],
        });
    },
    "rope-winch-drum": (v) => {
      const Fn = v.F * 1000, th = 2 * PI * v.wraps, ratio = Math.exp(v.mu * th), Fmax = v.tail * ratio, need = Fn > v.tail ? Math.log(Fn / v.tail) / (2 * PI * v.mu) : 0, T = Math.max(Fn - v.tail, 0) * v.D / 2000, P = Fn * v.v / 60 / (v.eta / 100) / 1000, sf = v.MBL / v.F;
      const okH = Fmax >= Fn, okR = sf >= v.SFreq, ok = okH && okR;
      return output({ th, ratio, Fmax, need, T, P, sf }, 'Load held by the tail pull (kN)', Fmax / 1000,
        [m('Tension ratio', q(ratio, '', 2)), m('Largest load the tail pull holds', q(Fmax / 1000, 'kN', 2)), m('Turns needed for the load', q(need, '', 2)), m('Drum torque', q(T, 'N·m', 1)), m('Drive power', q(P, 'kW', 2)), m('Rope safety factor', q(sf, '', 2))],
        'Rope winch drum.', 'Impending slip; constant friction.', {
          text: ok ? 'WINCH ADEQUATE' : 'WINCH NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Holding', okH ? 'pass' : 'fail', okH ? `${q(Fmax / 1000, 'kN', 1)} holding capacity against ${q(v.F, 'kN', 1)}.` : `Add turns: ${q(need, '', 2)} are needed.`), check('Rope', okR ? 'pass' : 'fail', `Safety factor ${q(sf, '', 1)} against ${q(v.SFreq, '', 1)}.`), check('Wet rope', 'verify', 'Allow for a lower friction coefficient when wet or oily.')],
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
