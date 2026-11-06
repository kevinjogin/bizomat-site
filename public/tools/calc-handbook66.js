// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook66). SI units are explicit at each boundary.
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
    "screw-clamp-force-check": (v) => {
      const sec = 1 / Math.cos(rad(Number(v.flank))), den = PI * v.dm - v.mu * v.lead * sec;
      if (den <= 0) return invalid('The lead is too large for this diameter and friction.');
      const T = v.Fh * v.rh / 1000, perN = v.dm / 2 * (v.lead + PI * v.mu * v.dm * sec) / den + v.muc * v.dc / 2, F = T * 1000 / perN, eff = 100 * v.lead / (2 * PI * perN), s = F / (PI * v.dr * v.dr / 4), locks = PI * v.mu * v.dm * sec > v.lead;
      const okF = F >= v.Freq - 1e-9, okS = s <= v.sA + 1e-9;
      return output({ T, perN, F, eff, s }, 'Clamping force (N)', F,
        [m('Handle torque', q(T, 'N·m', 2)), m('Clamping force', q(F, 'N', 0)), m('Screw efficiency', q(eff, '%', 1)), m('Root stress', q(s, 'MPa', 1)), m('Self-locking', locks ? 'Yes' : 'No')],
        'Screw clamp force check.', 'Static tightening.', {
          text: !okS ? 'SCREW OVERSTRESSED' : okF ? 'CLAMP FORCE ADEQUATE' : 'CLAMP FORCE TOO LOW', tone: okF && okS ? 'good' : 'bad',
          checks: [check('Clamping force', okF ? 'pass' : 'fail', `${q(F, 'N', 0)} against ${q(v.Freq, 'N', 0)} needed.`), check('Screw stress', okS ? 'pass' : 'fail', `${q(s, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Self-locking', locks ? 'pass' : 'warn', locks ? 'The clamp holds when the handle is released.' : 'The clamp can unwind under load: use a finer lead or a lock.')],
        });
    },
    "scissor-lift-screw-check": (v) => {
      if (v.thMax <= v.thMin) return invalid('The highest angle must exceed the lowest angle.');
      const t1 = rad(v.thMin), t2 = rad(v.thMax), Hmin = v.L * Math.sin(t1), Hmax = v.L * Math.sin(t2), travel = v.L * (Math.cos(t1) - Math.cos(t2)), Fmax = v.W / Math.tan(t1), Ftop = v.W / Math.tan(t2);
      const sec = 1 / Math.cos(rad(Number(v.flank))), den = PI * v.dm - v.mu * v.lead * sec;
      if (den <= 0) return invalid('The lead is too large for this diameter and friction.');
      const thr = Fmax * v.dm / 2 * (v.lead + PI * v.mu * v.dm * sec) / den, Tr = (thr + Fmax * v.muc * v.dc / 2) / 1000, tLift = travel / (v.lead * v.nS / 60), P = Tr * 2 * PI * v.nS / 60 / 1000;
      const okT = Tr <= v.Tav + 1e-9, okL = tLift <= v.tMax + 1e-9, ok = okT && okL;
      return output({ Hmin, Hmax, travel, Fmax, Ftop, Tr, tLift, P }, 'Largest screw torque (N·m)', Tr,
        [m('Platform height range', `${q(Hmin, '', 0)} to ${q(Hmax, 'mm', 0)}`), m('Screw travel', q(travel, 'mm', 1)), m('Actuator force: bottom / top', `${q(Fmax, '', 0)} / ${q(Ftop, 'N', 0)}`), m('Screw torque at the bottom', q(Tr, 'N·m', 2)), m('Lift time', q(tLift, 's', 1)), m('Drive power', q(P, 'kW', 2))],
        'Scissor lift screw drive check.', 'Single stage; arm weight and pivot friction left out.', {
          text: ok ? 'DRIVE ADEQUATE' : okT ? 'LIFT TOO SLOW' : 'SCREW TORQUE TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Screw torque', okT ? 'pass' : 'fail', `${q(Tr, 'N·m', 1)} against ${q(v.Tav, 'N·m', 0)}${okT ? '.' : ': raise the lowest angle or use a ball screw.'}`), check('Lift time', okL ? 'pass' : 'fail', `${q(tLift, 's', 1)} against ${q(v.tMax, 's', 0)}.`), check('Lowering', 'verify', 'Check the screw holds the table, or fit a brake, when the motor stops.')],
        });
    },
    "rope-drum-fleet-angle-check": (v) => {
      const fleet = deg(Math.atan(v.Ld / 2 / v.Ls)), ratio = v.D / v.dr, turns = Math.floor(v.Ld / v.dr + 1e-9);
      if (turns < 1) return invalid('The drum is narrower than the rope.');
      const need = v.lift * v.falls + v.dead * PI * (v.D + v.dr) / 1000, rows = []; let cap = 0, layers = 0;
      for (let i = 1; i <= 50 && cap < need - 1e-9; i++) { const c = PI * (v.D + (2 * i - 1) * v.dr) * turns / 1000; cap += c; layers = i; rows.push([String(i), q(v.D + (2 * i - 1) * v.dr, '', 0), q(c, '', 1), q(cap, '', 1)]); }
      const Deff = v.D + (2 * layers - 1) * v.dr, Tdrum = v.F * 1000 * Deff / 2000;
      const okF = fleet <= v.fleetMax + 1e-9, okR = ratio >= v.ratioMin - 1e-9, okL = layers <= v.layersMax, ok = okF && okR && okL;
      return output({ fleet, ratio, turns, need, layers, cap, Deff, Tdrum }, 'Fleet angle (°)', fleet,
        [m('Fleet angle', q(fleet, '°', 2)), m('Drum ÷ rope diameter', q(ratio, '', 1)), m('Turns per layer', String(turns)), m('Rope needed', q(need, 'm', 1)), m('Layers used / capacity', `${layers} / ${q(cap, 'm', 1)}`), m('Torque on the top layer used', q(Tdrum, 'N·m', 0))],
        'Rope drum and fleet angle check.', 'Tight spooling; sheave on the drum centre line.', {
          text: ok ? 'DRUM ARRANGEMENT ADEQUATE' : 'DRUM ARRANGEMENT NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          table: tbl('Layers', ['Layer', 'Pitch diameter (mm)', 'Rope held (m)', 'Total (m)'], rows),
          checks: [check('Fleet angle', okF ? 'pass' : 'fail', `${q(fleet, '°', 2)} against ${q(v.fleetMax, '°', 1)}${okF ? '.' : ': move the sheave further away or fit a spooling gear.'}`), check('D/d ratio', okR ? 'pass' : 'fail', `${q(ratio, '', 1)} against ${q(v.ratioMin, '', 0)}.`), check('Layers', okL ? 'pass' : 'fail', `${layers} against ${v.layersMax}${okL ? '.' : ': use a wider or larger drum.'}`)],
        });
    },
    "enclosure-cooling-airflow": (v) => {
      if (v.Ti <= v.Ta) return invalid('The inside limit must be above the outside air temperature for a fan to cool.');
      const dT = v.Ti - v.Ta, Pwall = v.k * v.As * dT, Pfan = Math.max(v.P - Pwall, 0), mHr = Pfan * 3.6 / (v.cp * dT), Qair = mHr / v.rho, ok = Qair <= v.fan + 1e-9;
      return output({ dT, Pwall, Pfan, mHr, Qair }, 'Airflow needed (m³/h)', Qair,
        [m('Temperature rise allowed', q(dT, 'K', 1)), m('Heat lost through the walls', q(Pwall, 'W', 0)), m('Heat for the fan to remove', q(Pfan, 'W', 0)), m('Air mass per hour', q(mHr, 'kg/h', 1)), m('Airflow needed', q(Qair, 'm³/h', 1))],
        'Enclosure cooling airflow.', 'Air in at the outside temperature.', {
          text: Pfan === 0 ? 'NO FAN NEEDED' : ok ? 'FAN ADEQUATE' : 'FAN TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Fan airflow', ok ? 'pass' : 'fail', Pfan === 0 ? 'The walls lose all the heat.' : `${q(Qair, 'm³/h', 0)} needed against ${q(v.fan, 'm³/h', 0)}.`), check('Filters', 'verify', 'Use the fan airflow with clean-to-dirty filters fitted, not its free-blowing rating.')],
        });
    },
    "ramp-traction-check": (v) => {
      if (v.a > v.wb) return invalid('The centre of gravity must lie between the axles.');
      const W = v.mass * 9.80665, th = rad(v.slope), Wn = W * Math.cos(th), Nr = (Wn * v.a + W * Math.sin(th) * v.hcg) / v.wb, Nf = Wn - Nr, Fg = W * Math.sin(th), Fr = Wn * v.f / v.r, Fa = v.mass * v.acc, Freq = Fg + Fr + Fa;
      const Nd = v.drive === 'rear' ? Nr : v.drive === 'front' ? Math.max(Nf, 0) : Wn, grip = v.mu * Nd, okT = Freq <= grip + 1e-9, okF = Nf > 0;
      return output({ W, Nr, Nf, Fg, Fr, Fa, Freq, grip }, 'Tractive force needed (N)', Freq,
        [m('Axle loads: front / rear', `${q(Nf, '', 0)} / ${q(Nr, 'N', 0)}`), m('Climbing force', q(Fg, 'N', 0)), m('Rolling resistance', q(Fr, 'N', 0)), m('Acceleration force', q(Fa, 'N', 0)), m('Force needed / grip', `${q(Freq, '', 0)} / ${q(grip, 'N', 0)}`)],
        'Ramp traction check.', 'Uniform slope; front uphill.', {
          text: !okF ? 'TIPS BACKWARD' : okT ? 'TRACTION ADEQUATE' : 'WHEELS WILL SLIP', tone: okT && okF ? 'good' : 'bad',
          checks: [check('Grip', okT ? 'pass' : 'fail', `${q(Freq, 'N', 0)} needed against ${q(grip, 'N', 0)}.`), check('Uphill axle load', okF ? 'pass' : 'fail', okF ? `${q(Nf, 'N', 0)} on the front axle.` : 'The front axle lifts: the vehicle tips backwards.'), check('Braking downhill', 'verify', 'Check stopping on the way down, when the load shifts to the front axle.')],
        });
    },
    "two-pump-arrangement-check": (v) => {
      if (v.Hb >= v.H0) return invalid('The best-efficiency head must be below the shut-off head.');
      if (v.Hd <= v.Hs) return invalid('The system head at the known flow must exceed the static head.');
      if (v.H0 <= v.Hs) return invalid('One pump cannot lift against the static head.');
      const a = (v.H0 - v.Hb) / v.Qb ** 2, k = (v.Hd - v.Hs) / v.Qd ** 2, Q1 = Math.sqrt((v.H0 - v.Hs) / (a + k)), H1 = v.Hs + k * Q1 * Q1;
      const par = v.mode === 'parallel', Q2 = par ? Math.sqrt((v.H0 - v.Hs) / (a / 4 + k)) : Math.sqrt((2 * v.H0 - v.Hs) / (2 * a + k)), H2 = v.Hs + k * Q2 * Q2, Qp = par ? Q2 / 2 : Q2, Hp = par ? H2 : H2 / 2;
      const x = Qp / v.Qb, eta = Math.max(0.01, v.etab / 100 * (2 * x - x * x)), Pp = v.rho * 9.80665 * (Qp / 60000) * Hp / eta / 1000, Ptot = 2 * Pp, gain = (Q2 / Q1 - 1) * 100, pct = x * 100, okQ = Q2 >= v.Qreq - 1e-9, okB = pct >= 70 && pct <= 120;
      return output({ Q1, H1, Q2, H2, Qp, Hp, eta: eta * 100, pctBEP: pct, Ptot, gain }, 'Combined flow (L/min)', Q2,
        [m('One pump alone', `${q(Q1, 'L/min', 1)} at ${q(H1, 'm', 1)}`), m('Two pumps', `${q(Q2, 'L/min', 1)} at ${q(H2, 'm', 1)} (${q(gain, '%', 0)} more flow)`), m('Each pump', `${q(Qp, 'L/min', 1)} at ${q(Hp, 'm', 1)}`), m('Each pump: share of best-efficiency flow / efficiency', `${q(pct, '%', 0)} / ${q(eta * 100, '%', 1)}`), m('Total power', q(Ptot, 'kW', 2))],
        'Two-pump arrangement check.', 'Identical parabolic pump curves.', {
          text: okQ ? 'FLOW MET' : 'FLOW NOT MET', tone: okQ ? 'good' : 'bad',
          checks: [check('Flow', okQ ? 'pass' : 'fail', `${q(Q2, 'L/min', 0)} against ${q(v.Qreq, 'L/min', 0)} needed.`), check('Pump duty point', okB ? 'pass' : 'warn', okB ? `Each pump at ${q(pct, '%', 0)} of its best-efficiency flow.` : `Each pump at ${q(pct, '%', 0)} of its best-efficiency flow: outside about 70–120%, expect lower efficiency and more wear.`), check('One pump running', 'verify', par ? 'With one pump stopped, the other runs further out on its curve; check its power and NPSH.' : 'Check the second pump casing and seals for the combined pressure.')],
        });
    },
    "cantilever-rack-arm-check": (v) => {
      const { H, B, tf, tw } = v; let R;
      if (v.shape === 'I') { if (2 * tf >= H || tw >= B) return invalid('Flanges and web do not fit inside the overall size.'); R = [[0, 0, B, tf], [0, H - tf, B, tf], [(B - tw) / 2, tf, tw, H - 2 * tf]]; }
      else if (v.shape === 'T') { if (tf >= H || tw >= B) return invalid('Flange and web do not fit inside the overall size.'); R = [[0, H - tf, B, tf], [(B - tw) / 2, 0, tw, H - tf]]; }
      else if (v.shape === 'C') { if (2 * tf >= H || tw >= B) return invalid('Flanges and web do not fit inside the overall size.'); R = [[0, 0, tw, H], [tw, H - tf, B - tw, tf], [tw, 0, B - tw, tf]]; }
      else { if (tf >= H || tw >= B) return invalid('Leg thicknesses must be less than the leg lengths.'); R = [[0, 0, tw, H], [tw, 0, B - tw, tf]]; }
      const A = R.reduce((s, r) => s + r[2] * r[3], 0), yb = R.reduce((s, r) => s + r[2] * r[3] * (r[1] + r[3] / 2), 0) / A; let Ix = 0;
      for (const [, y0, w, h] of R) { const dy = y0 + h / 2 - yb; Ix += w * h ** 3 / 12 + w * h * dy * dy; }
      const c = Math.max(yb, H - yb), Zx = Ix / c, M = v.P * v.L / 2, stress = M / Zx, defl = v.P * v.L ** 3 / (8 * v.E * 1000 * Ix), dAllow = v.L / v.dlim, Fbolt = M / v.z / v.nb;
      const okS = stress <= v.sA + 1e-9, okD = defl <= dAllow + 1e-12, okB = Fbolt <= v.Fb + 1e-9, ok = okS && okD && okB;
      return output({ A, Ix, Zx, c, M, stress, defl, dAllow, Fbolt }, 'Bending stress (MPa)', stress,
        [m('Section A / I / Z', `${q(A, 'mm²', 0)} / ${q(Ix, 'mm⁴', 0)} / ${q(Zx, 'mm³', 0)}`), m('Moment at the column', q(M / 1e6, 'kN·m', 3)), m('Bending stress', q(stress, 'MPa', 1)), m('Tip deflection / allowed', `${q(defl, '', 2)} / ${q(dAllow, 'mm', 2)}`), m('Tension per top bolt', q(Fbolt, 'N', 0))],
        'Cantilever rack arm check.', 'Uniform load; rigid column.', {
          text: ok ? 'ARM ADEQUATE' : 'ARM NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bending stress', okS ? 'pass' : 'fail', `${q(stress, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Tip deflection', okD ? 'pass' : 'fail', `${q(defl, 'mm', 2)} against ${q(dAllow, 'mm', 2)}.`), check('Column bolts', okB ? 'pass' : 'fail', `${q(Fbolt, 'N', 0)} against ${q(v.Fb, 'N', 0)}.`), check('Column', 'verify', 'Check the column for the sum of the arm moments on both sides.')],
        });
    },
    "centrifugal-clutch-check": (v) => {
      const w = 2 * PI * v.n / 60, rM = v.r / 1000, Fc = v.m * w * w * rM, wEng = Math.sqrt(v.Fs / (v.m * rM)), nEng = wEng * 60 / (2 * PI), T = v.nSh * v.mu * Math.max(Fc - v.Fs, 0) * v.Rd / 1000, Tneed = v.Treq * v.SF;
      const okI = nEng > v.nIdle + 1e-9, okT = T >= Tneed - 1e-9;
      return output({ w, Fc, nEng, T, Tneed }, 'Torque at running speed (N·m)', T,
        [m('Centrifugal force per shoe at speed', q(Fc, 'N', 1)), m('Engagement speed', q(nEng, 'rpm', 0)), m('Net shoe force', q(Math.max(Fc - v.Fs, 0), 'N', 1)), m('Torque at running speed', q(T, 'N·m', 1)), m('Torque needed with service factor', q(Tneed, 'N·m', 1))],
        'Centrifugal clutch check.', 'Shoes without self-energising effect.', {
          text: !okI ? 'ENGAGES AT IDLE' : okT ? 'CLUTCH ADEQUATE' : 'CLUTCH SLIPS AT SPEED', tone: okI && okT ? 'good' : 'bad',
          checks: [check('Idle clearance', okI ? 'pass' : 'fail', `Engages at ${q(nEng, 'rpm', 0)} against idle at ${q(v.nIdle, 'rpm', 0)}${okI ? '.' : ': stiffen the springs.'}`), check('Torque', okT ? 'pass' : 'fail', `${q(T, 'N·m', 1)} against ${q(Tneed, 'N·m', 1)}.`), check('Lining heat', 'verify', 'Check lining temperature during long slips at part speed.')],
        });
    },
    "expansion-gap-plan": (v) => {
      if (v.Tmax <= v.Tmin) return invalid('The highest temperature must exceed the lowest.');
      if (v.Ti < v.Tmin || v.Ti > v.Tmax) return invalid('The installation temperature must lie within the service range.');
      if (v.gMax <= v.gMin) return invalid('The largest gap must exceed the least gap.');
      const k = v.alpha * 1e-3 * v.L, move = k * (v.Tmax - v.Tmin), g0 = v.gMin + k * (v.Tmax - v.Ti), gCold = g0 + k * (v.Ti - v.Tmin), nGaps = Math.ceil(move / (v.gMax - v.gMin) - 1e-9), strain = v.alpha * 1e-6 * (v.Tmax - v.Ti), sR = v.E * 1000 * strain, FR = sR * v.A, nR = sR > 0 ? v.Sy / sR : 1e9, ok = gCold <= v.gMax + 1e-9;
      return output({ k, move, g0, gCold, nGaps, strain, sR, FR, nR }, 'Gap to set at installation (mm)', g0,
        [m('Movement per kelvin', q(k, 'mm/K', 3)), m('Movement over the range', q(move, 'mm', 1)), m('Gap to set at installation', q(g0, 'mm', 1)), m('Gap when coldest', q(gCold, 'mm', 1)), m('Gaps needed for this length', String(Math.max(nGaps, 1))), m('Stress and force if restrained', `${q(sR, 'MPa', 0)} / ${q(FR / 1000, 'kN', 1)}`)],
        'Expansion gap plan.', 'Uniform temperature; free sliding.', {
          text: ok ? 'GAP PLAN WORKS' : 'MORE GAPS NEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Gap range', ok ? 'pass' : 'fail', `${q(gCold, 'mm', 1)} when coldest against ${q(v.gMax, 'mm', 1)}${ok ? '.' : `: split the run into ${nGaps} or more lengths.`}`), check('If the gap closes', nR >= 1 ? 'warn' : 'fail', `Restrained stress ${q(sR, 'MPa', 0)} (${q(nR, '', 2)} × yield margin); long restrained runs can also buckle.`)],
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
