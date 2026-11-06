// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook7). SI units are explicit at each boundary.
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
    "turning-power": (v) => {
      const Fc = v.kc * v.ap * v.f, Pc = Fc * v.vc / 60000, Pm = Pc / (v.eta / 100), n = 1000 * v.vc / (PI * v.D), T = Fc * v.D / 2000, Q = v.vc * v.ap * v.f, ok = Pm <= v.Pavail;
      return output({ Fc, Pc, Pm, n, T, Q }, 'Motor power required (kW)', Pm,
        [m('Cutting force', q(Fc, 'N', 0)), m('Cutting power', q(Pc, 'kW', 2)), m('Motor power required', q(Pm, 'kW', 2)), m('Spindle speed', q(n, 'rpm', 0)), m('Spindle torque', q(T, 'N·m', 1)), m('Metal removal rate', q(Q, 'cm³/min', 1))],
        'Cutting force and power for the turning cut.', 'kc varies with chip thickness and tool wear.', {
          text: ok ? 'WITHIN MACHINE POWER' : 'EXCEEDS MACHINE POWER', tone: ok ? 'good' : 'bad',
          checks: [check('Power available', ok ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} needed against ${q(v.Pavail, 'kW', 1)}.`), check('Power at this speed', 'verify', `Confirm the machine delivers this power at ${q(n, 'rpm', 0)}.`)],
        });
    },
    "milling-power": (v) => {
      const Q = v.ae * v.ap * v.vf / 1000, Pc = v.ae * v.ap * v.vf * v.kc / 6e7, Pm = Pc / (v.eta / 100), T = Pc * 30000 / (PI * v.rpm), vc = PI * v.D * v.rpm / 1000, ok = Pm <= v.Pavail;
      return output({ Q, Pc, Pm, T, vc }, 'Motor power required (kW)', Pm,
        [m('Metal removal rate', q(Q, 'cm³/min', 1)), m('Cutting power', q(Pc, 'kW', 2)), m('Motor power required', q(Pm, 'kW', 2)), m('Spindle torque', q(T, 'N·m', 1)), m('Cutting speed', q(vc, 'm/min', 0))],
        'Cutting power for the milling cut.', 'kc depends on mean chip thickness and tool wear.', {
          text: ok ? 'WITHIN SPINDLE POWER' : 'EXCEEDS SPINDLE POWER', tone: ok ? 'good' : 'bad',
          checks: [check('Power available', ok ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} needed against ${q(v.Pavail, 'kW', 1)}.`), check('Spindle torque at this speed', 'verify', 'Check the spindle torque curve at this speed.')],
        });
    },
    "drilling-power": (v) => {
      const n = 1000 * v.vc / (PI * v.D), Pc = v.f * v.vc * v.D * v.kc / 240000, Pm = Pc / (v.eta / 100), T = Pc * 30000 / (PI * n), thrust = 0.5 * v.kc * v.D / 2 * v.f * Math.sin(rad(v.point / 2)), ok = Pm <= v.Pavail;
      return output({ n, Pc, Pm, T, thrust }, 'Motor power required (kW)', Pm,
        [m('Spindle speed', q(n, 'rpm', 0)), m('Feed rate', q(v.f * n, 'mm/min', 0)), m('Cutting power', q(Pc, 'kW', 2)), m('Motor power required', q(Pm, 'kW', 2)), m('Torque', q(T, 'N·m', 1)), m('Approximate thrust', q(thrust, 'N', 0))],
        'Power, torque and thrust for the drilling operation.', 'Chisel-edge thrust not included.', {
          text: ok ? 'WITHIN MACHINE POWER' : 'EXCEEDS MACHINE POWER', tone: ok ? 'good' : 'bad',
          checks: [check('Power available', ok ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pavail, 'kW', 1)}.`), check('Thrust and workholding', 'verify', 'The chisel edge can add substantial thrust; check workholding and thin sections.')],
        });
    },
    "scallop-height": (v) => {
      const R = v.D / 2; let h, s;
      if (v.mode === 'height') { s = v.step; if (s >= v.D) return invalid('The stepover must be smaller than the tool diameter.'); h = R - Math.sqrt(R * R - (s / 2) ** 2); }
      else { h = v.h; if (h >= R) return invalid('The scallop height must be less than the tool radius.'); s = 2 * Math.sqrt(2 * R * h - h * h); }
      return output({ h, s }, v.mode === 'height' ? 'Scallop height (mm)' : 'Stepover (mm)', v.mode === 'height' ? h : s,
        [m('Scallop height', `${q(h, 'mm', 5)} (${q(h * 1000, 'µm', 2)})`), m('Stepover', q(s, 'mm', 4)), m('Stepover / diameter', q(100 * s / v.D, '%', 1))],
        'Theoretical cusp on a flat surface.', 'Flat surface normal to the tool; deflection and runout excluded.', {
          checks: [check('Surface orientation', 'verify', 'On sloped surfaces use the effective radius in the feed direction.')],
        });
    },
    "taylor-tool-life": (v) => {
      let n = v.n, C = v.C;
      if (v.mode === 'two') { if (v.V1 === v.V2 || v.T1 === v.T2) return invalid('The two tests need different speeds and tool lives.'); n = Math.log(v.V1 / v.V2) / Math.log(v.T2 / v.T1); if (!(n > 0 && n < 1)) return invalid('The tests give an exponent outside 0 to 1; a higher speed must give a shorter life.'); C = v.V1 * v.T1 ** n; }
      const T = (C / v.V) ** (1 / n), co = v.rate / 60, Tc = (1 / n - 1) * (v.tc + (co > 0 ? v.edge / co : 0)), Vc = C / Tc ** n, Tp = (1 / n - 1) * v.tc, Vp = Tp > 0 ? C / Tp ** n : Infinity;
      const inRange = v.V <= Vp && v.V >= Vc * 0.999;
      return output({ n, C, T, Tc, Vc, Tp, Vp: Number.isFinite(Vp) ? Vp : 0 }, 'Tool life at planned speed (min)', T,
        [m('Taylor exponent n', q(n, '', 4)), m('Taylor constant C', q(C, 'm/min', 1)), m('Tool life at planned speed', q(T, 'min', 1)), m('Minimum-cost life and speed', `${q(Tc, 'min', 1)} at ${q(Vc, 'm/min', 0)}`), m('Maximum-production life and speed', Number.isFinite(Vp) ? `${q(Tp, 'min', 1)} at ${q(Vp, 'm/min', 0)}` : 'Not defined (no tool change time)')],
        inRange ? 'The planned speed lies in the efficient range.' : v.V < Vc ? 'The planned speed is below the minimum-cost speed: cost and time can both be cut.' : 'The planned speed is above the maximum-production speed: tool changes cost output.', 'Taylor model within the tested range.', {
          text: inRange ? 'IN EFFICIENT RANGE' : 'OUTSIDE EFFICIENT RANGE', tone: inRange ? 'good' : 'warn',
          checks: [check('Planned speed in efficient range', inRange ? 'pass' : 'warn', `Efficient range ${q(Vc, '', 0)}–${Number.isFinite(Vp) ? q(Vp, 'm/min', 0) : '∞'}.`), check('Range of test data', 'verify', 'Use the model only near the tested speeds and conditions.')],
        });
    },
    "grinding-wheel": (v) => {
      const vs = PI * v.D * v.rpm / 60000, nmax = v.vmax * 60000 / (PI * v.D), qr = vs / (v.vw / 60), Qp = v.ae * v.vw * 1000 / 60, Q = Qp * v.b, ok = vs <= v.vmax;
      return output({ vs, nmax, qr, Qp, Q }, 'Wheel speed (m/s)', vs,
        [m('Wheel peripheral speed', q(vs, 'm/s', 2)), m('Maximum spindle speed for this wheel', q(nmax, 'rpm', 0)), m('Speed ratio vs/vw', q(qr, '', 0)), m('Specific removal rate Q′', q(Qp, 'mm³/mm/s', 3)), m('Total removal rate', q(Q * 60 / 1000, 'cm³/min', 3))],
        ok ? 'The wheel runs within its marked maximum speed.' : 'The wheel would run faster than its marked maximum speed.', 'Wheel safety also depends on guarding and mounting.', {
          text: ok ? 'WITHIN WHEEL SPEED' : 'OVERSPEED: DO NOT RUN', tone: ok ? 'good' : 'bad',
          checks: [check('Wheel speed within marked maximum', ok ? 'pass' : 'fail', `${q(vs, 'm/s', 2)} against ${q(v.vmax, 'm/s')}.`), check('Guarding and mounting', 'verify', 'Check guard, flanges, blotters and ring test per the wheel safety standard.')],
        });
    },
    "broach-pitch": (v) => {
      const pmin = 3 * Math.sqrt(v.L * v.d * v.F), pallow = v.d * v.L * v.b * v.P / (9810 * v.T), pitch = Math.max(pmin, pallow, 5), teeth = v.L / pitch, ok = teeth >= 2;
      return output({ pmin, pallow, pitch, teeth }, 'Tooth pitch (mm)', pitch,
        [m('Minimum pitch (chip space)', q(pmin, 'mm', 2)), m('Allowable pitch (machine capacity)', q(pallow, 'mm', 2)), m('Pitch to use', q(pitch, 'mm', 2)), m('Teeth cutting at once', q(teeth, '', 2)), m('Governed by', pallow > pmin ? 'Machine capacity' : 'Chip space')],
        'Broach pitch from chip space and machine capacity.', 'Material data supplied by the user.', {
          checks: [check('At least two teeth cutting', ok ? 'pass' : 'warn', `${q(teeth, '', 2)} teeth in the cut.`), check('Minimum practical pitch', pitch > 5 ? 'pass' : 'warn', 'The handbook recommends at least 5 mm unless the cut is very short.')],
        });
    },
    "boring-bar-deflection": (v) => {
      const E = v.E * 1000, I = PI * v.D ** 4 / 64, defl = v.F * v.L ** 3 / (3 * E * I), k = 3 * E * I / v.L ** 3, ratio = v.L / v.D, ok = defl <= v.allow;
      return output({ defl, k, ratio }, 'Tip deflection (mm)', defl,
        [m('Tip deflection', `${q(defl, 'mm', 5)} (${q(defl * 1000, 'µm', 2)})`), m('Overhang ratio L/D', q(ratio, '', 2)), m('Bar stiffness', q(k, 'N/mm', 0))],
        `Cantilever deflection at ${q(ratio, '× D', 1)} overhang.`, 'Static deflection, rigid clamping.', {
          text: ok ? 'DEFLECTION ACCEPTABLE' : 'DEFLECTION TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Deflection', ok ? 'pass' : 'fail', `${q(defl * 1000, 'µm', 2)} against ${q(v.allow * 1000, 'µm', 1)} allowed.`), check('Overhang ratio', ratio <= 4 ? 'pass' : 'warn', ratio <= 4 ? 'Within the usual limit for steel bars.' : 'Beyond the usual steel-bar limit; consider carbide or a damped bar.')],
        });
    },
    "electroplating-thickness": (v) => {
      const D = { ni: [58.693, 2, 8.908], cu: [63.546, 2, 8.96], cucn: [63.546, 1, 8.96], zn: [65.38, 2, 7.134], cr: [51.996, 6, 7.19], sn: [118.71, 2, 7.287], ag: [107.868, 1, 10.49], au: [196.967, 1, 19.3] }[v.metal];
      const Jm2 = v.J * 100, massRate = Jm2 * (v.eff / 100) * D[0] / (D[1] * 96485.33), rate = massRate / (D[2] * 1e6) * 1e6 * 60, minutes = v.thick / rate, I = v.J * v.area, mass = massRate * (v.area / 100) * minutes * 60;
      return output({ rate, minutes, I, mass }, 'Plating time (min)', minutes,
        [m('Deposition rate', q(rate, 'µm/min', 4)), m('Time to target thickness', q(minutes, 'min', 1)), m('Total current', q(I, 'A', 1)), m('Mass deposited', q(mass, 'g', 2))],
        'Average deposit by Faraday’s law.', 'Average thickness; current distribution not modelled.', {
          checks: [check('Thickness distribution', 'verify', 'Measure at the significant surface; edges plate thicker and recesses thinner.')],
        });
    },
    "shear-force": (v) => {
      const tau = v.ratio * v.uts, F = v.blades === 'parallel' ? tau * v.b * v.t : v.n * v.ratio * v.uts * v.pen * v.t * v.t / Math.tan(rad(v.rake));
      const Fm = v.blades === 'parallel' ? 1.3 * F : F, use = Fm / 1000 / v.cap, ok = use <= 1;
      return output({ F, Fm, use }, 'Machine force (kN)', Fm / 1000,
        [m('Shearing force', q(F / 1000, 'kN', 1)), m('Machine force', q(Fm / 1000, 'kN', 1)), m('Capacity utilisation', q(100 * use, '%', 1)), m('Shear strength used', q(tau, 'MPa', 0))],
        `${v.blades === 'parallel' ? 'Parallel' : 'Inclined'} blade shearing force.`, 'Approximate; blade condition and clearance affect force.', {
          text: ok ? 'WITHIN SHEAR CAPACITY' : 'EXCEEDS SHEAR CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Shear capacity', ok ? 'pass' : 'fail', `${q(Fm / 1000, 'kN', 1)} against ${q(v.cap, 'kN')}.`), check('Thickness rating', 'verify', 'Confirm the shear’s maximum thickness for this material strength.')],
        });
    },
    "press-brake-force": (v) => {
      const F = v.k * v.L * v.t * v.t * v.uts / v.V, perM = F / v.L, use = F / 1000 / v.cap, ok = use <= 1;
      return output({ F, perM, use }, 'Bending force (kN)', F / 1000,
        [m('Bending force', `${q(F / 1000, 'kN', 1)} (${q(F / 9806.65, 't', 1)})`), m('Force per metre', q(perM, 'kN/m', 1)), m('Capacity utilisation', q(100 * use, '%', 1)), m('V-die / thickness', q(v.V / v.t, '', 1))],
        'Air-bending force in a V-die.', 'Air bending only; bottoming and coining need more force.', {
          text: ok ? 'WITHIN PRESS CAPACITY' : 'EXCEEDS PRESS CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Press capacity', ok ? 'pass' : 'fail', `${q(F / 1000, 'kN', 1)} against ${q(v.cap, 'kN')}.`), check('Die opening', v.V / v.t >= 6 && v.V / v.t <= 12 ? 'pass' : 'warn', `V = ${q(v.V / v.t, '', 1)} × t; about 6–12 × t is usual for air bending.`), check('Load per length', 'verify', 'Check the press brake maker’s maximum force per metre.')],
        });
    },
    "shell-blank": (v) => {
      const df = v.flange || v.d;
      if (v.flange && v.flange <= v.d) return invalid('The flange diameter must be larger than the shell diameter.');
      const D2 = df * df + 4 * v.d * v.h - 0.5 * v.r * v.d;
      if (D2 <= 0) return invalid('The geometry gives no blank; check the inputs.');
      const D = Math.sqrt(D2), ratio = v.d / D; let draws = 1, dia = D * v.m1;
      if (ratio < v.m1) { while (dia > v.d && draws < 20) { dia *= v.m2; draws++; } }
      const d1 = Math.max(v.d, D * v.m1), F = PI * d1 * v.t * v.uts * Math.max(D / d1 - 0.7, 0);
      return output({ D, ratio, draws, F }, 'Blank diameter (mm)', D,
        [m('Blank diameter', q(D, 'mm', 2)), m('First drawing ratio d/D', q(ratio, '', 3)), m('Estimated draws', String(draws)), m('First-draw diameter', q(d1, 'mm', 1)), m('First-draw force', q(F / 1000, 'kN', 1))],
        draws === 1 ? 'The shell can be drawn in one operation.' : `About ${draws} draws are needed.`, 'Constant thickness; add trim allowance.', {
          text: draws === 1 ? 'ONE DRAW' : `${draws} DRAWS`, tone: draws === 1 ? 'good' : 'warn',
          checks: [check('First drawing ratio', ratio >= v.m1 ? 'pass' : 'warn', `${q(ratio, '', 3)} against a limit of ${q(v.m1, '', 2)}.`), check('Trim allowance', 'verify', 'Add trim allowance to the blank diameter.')],
        });
    },
    "fillet-weld-strength": (v) => {
      const a = 0.70710678 * v.leg, cap = a * v.L * v.nw * v.tau, use = v.F * 1000 / cap, legReq = v.F * 1000 / (0.70710678 * v.L * v.nw * v.tau), ok = use <= 1;
      return output({ a, cap, use, legReq }, 'Utilisation', use,
        [m('Throat thickness', q(a, 'mm', 2)), m('Weld capacity', q(cap / 1000, 'kN', 1)), m('Utilisation', q(100 * use, '%', 1)), m('Minimum leg size', q(legReq, 'mm', 2))],
        `${v.nw} fillet welds of ${q(v.leg, 'mm')} leg.`, 'Uniform throat shear; code checks still required.', {
          text: ok ? 'WELDS ADEQUATE' : 'WELDS INADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Weld capacity', ok ? 'pass' : 'fail', `${q(v.F, 'kN', 1)} against ${q(cap / 1000, 'kN', 1)}.`), check('Eccentricity and base metal', 'verify', 'Check eccentric load effects and base metal capacity to your code.')],
        });
    },
    "carbon-equivalent": (v) => {
      const CE = v.C + v.Mn / 6 + (v.Cr + v.Mo + v.V) / 5 + (v.Ni + v.Cu) / 15, Pcm = v.C + v.Si / 30 + (v.Mn + v.Cu + v.Cr) / 20 + v.Ni / 60 + v.Mo / 15 + v.V / 10 + 5 * v.B;
      const band = CE <= 0.4 ? { text: 'READILY WELDABLE', tone: 'good', st: 'pass', d: 'CE up to about 0.40.' } : CE <= 0.6 ? { text: 'PREHEAT LIKELY', tone: 'warn', st: 'warn', d: 'CE about 0.40–0.60: preheat and low-hydrogen practice are usually needed.' } : { text: 'DIFFICULT TO WELD', tone: 'bad', st: 'fail', d: 'CE above about 0.60: special procedures needed.' };
      return output({ CE, Pcm }, 'Carbon equivalent CE (IIW)', CE,
        [m('Carbon equivalent CE (IIW)', q(CE, '', 3)), m('Pcm', q(Pcm, '', 3)), m('Weldability band', band.d)],
        'Carbon equivalent from the chemical composition.', 'Screening guidance; preheat set by the welding code and procedure.', {
          text: band.text, tone: band.tone,
          checks: [check('Weldability band', band.st, band.d), check('Pcm applicability', v.C <= 0.18 ? 'pass' : 'warn', v.C <= 0.18 ? 'Low-carbon steel: Pcm applies.' : 'Pcm is intended for C ≤ 0.18%.'), check('Preheat determination', 'verify', 'Set preheat from AS/NZS 1554.1 or the qualified welding procedure.')],
        });
    },
    "casting-solidification": (v) => {
      const D = v.Dr / 10, H = v.Hr / 10, Vr = PI * D * D * H / 4, Ar = PI * D * H + PI * D * D / 4, Mc = v.Vc / v.Ac, Mr = Vr / Ar, tc = v.B * Mc * Mc, tr = v.B * Mr * Mr, ratio = Mr / Mc, ok = ratio >= v.ratio;
      return output({ Mc, Mr, tc, tr, ratio, pattern: v.part * (1 + v.shrink / 100) }, 'Modulus ratio', ratio,
        [m('Casting modulus', q(Mc, 'cm', 3)), m('Riser modulus', q(Mr, 'cm', 3)), m('Casting solidification time', q(tc, 'min', 2)), m('Riser solidification time', q(tr, 'min', 2)), m('Modulus ratio', q(ratio, '', 3)), m('Pattern dimension', q(v.part * (1 + v.shrink / 100), 'mm', 2))],
        ok ? 'The riser freezes after the casting section.' : 'The riser may freeze before the casting section.', 'Chvorinov approximation; feeding volume not checked.', {
          text: ok ? 'RISER MODULUS SUFFICIENT' : 'RISER TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Modulus ratio', ok ? 'pass' : 'fail', `${q(ratio, '', 2)} against ${q(v.ratio, '', 2)} required.`), check('Feed volume and distance', 'verify', 'Check riser volume against shrinkage demand and the feeding distance.')],
        });
    },
    "brinell-hardness": (v) => {
      if (v.d >= v.D) return invalid('The indentation must be smaller than the ball.');
      const HB = 2 * v.F / (PI * v.D * (v.D - Math.sqrt(v.D * v.D - v.d * v.d))), ratio = v.d / v.D, fr = v.F / (v.D * v.D), depth = (v.D - Math.sqrt(v.D * v.D - v.d * v.d)) / 2, ok = ratio >= 0.24 && ratio <= 0.6;
      return output({ HB, ratio, fr, depth, uts: 3.45 * HB }, 'Brinell hardness (HBW)', HB,
        [m('Brinell hardness', `${q(HB, 'HBW', 0)} ${q(v.D, '', 1)}/${q(v.F, '', 0)}`), m('Indentation ratio d/D', q(ratio, '', 3)), m('Force–diameter ratio F/D²', q(fr, '', 1)), m('Indentation depth', q(depth, 'mm', 3)), m('Approximate tensile strength (steel)', q(3.45 * HB, 'MPa', 0))],
        'Brinell hardness from the indentation.', 'Tensile estimate approximate, steels only.', {
          text: ok ? 'VALID TEST' : 'INDENT OUTSIDE VALID RANGE', tone: ok ? 'good' : 'warn',
          checks: [check('Indentation size', ok ? 'pass' : 'warn', `d/D = ${q(ratio, '', 3)}; ISO 6506 requires 0.24–0.6. Change the force or ball.`), check('Specimen thickness', 'verify', `Thickness should be at least ${q(8 * depth, 'mm', 2)}.`)],
        });
    },
    "wall-heat-loss": (v) => {
      const layers = [1, 2, 3].filter((i) => v['t' + i] > 0).map((i) => ({ i, R: v['t' + i] / 1000 / v['k' + i] }));
      if (!layers.length && !v.hin && !v.hout) return invalid('Enter at least one layer or film coefficient.');
      const Rin = v.hin ? 1 / v.hin : 0, Rout = v.hout ? 1 / v.hout : 0, R = Rin + layers.reduce((s, l) => s + l.R, 0) + Rout, U = 1 / R, dT = v.Thot - v.Tcold, qf = U * dT, Q = qf * v.area;
      let T = v.Thot - qf * Rin; const rows = [['Hot surface', q(T, '°C', 1)]];
      for (const l of layers) { T -= qf * l.R; rows.push([`After layer ${l.i}`, q(T, '°C', 1)]); }
      return output({ U, qf, Q, Tsurf: T }, 'Heat flow (W)', Q,
        [m('Overall coefficient U', q(U, 'W/(m²·K)', 4)), m('Heat flux', q(qf, 'W/m²', 1)), m('Heat flow', `${q(Q, 'W', 0)} (${q(Q * 3.6, 'kJ/h', 0)})`), m('Cold-side surface temperature', q(T, '°C', 1))],
        'Steady conduction through the layered wall.', 'One-dimensional steady state; thermal bridges excluded.', {
          table: tbl('Temperatures through the wall', ['Position', 'Temperature'], rows),
          checks: [check('Touch temperature', T <= 60 ? 'pass' : 'warn', `Outer surface about ${q(T, '°C', 0)}; compare with your burn-protection limit.`)],
        });
    },
    "heating-energy": (v) => {
      if (v.T2 <= v.T1) return invalid('The final temperature must be above the start temperature.');
      const Q = v.mass * v.c * (v.T2 - v.T1), kWh = Q / 3600, drawn = kWh / (v.eff / 100), hours = drawn / v.P;
      return output({ Q, kWh, drawn, hours }, 'Heating time (h)', hours,
        [m('Heat energy required', `${q(Q / 1000, 'MJ', 2)} (${q(kWh, 'kWh', 2)})`), m('Heating time', `${q(hours, 'h', 2)} (${q(hours * 60, 'min', 0)})`), m('Energy drawn', q(drawn, 'kWh', 2)), m('Energy cost per batch', money(drawn * v.price))],
        'Sensible heating of the mass to the target temperature.', 'No phase change; losses only via efficiency.', {
          checks: [check('Phase change', 'verify', 'Add latent heat if the material melts, boils or dries.')],
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
