// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook65). SI units are explicit at each boundary.
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
    "sluice-gate-lift-check": (v) => {
      const g = 9.80665, F = v.rho * g * v.w * v.h * v.h / 2, y = v.h / 3, Flift = v.mGate * g + v.muS * F;
      const sec = 1 / Math.cos(rad(Number(v.flank))), den = PI * v.dm - v.mu * v.lead * sec;
      if (den <= 0) return invalid('The lead is too large for this diameter and friction.');
      const collar = Flift * v.muc * v.dc / 2, thrR = Flift * v.dm / 2 * (v.lead + PI * v.mu * v.dm * sec) / den, thrL = Flift * v.dm / 2 * (PI * v.mu * v.dm * sec - v.lead) / (PI * v.dm + v.mu * v.lead * sec), Tr = (thrR + collar) / 1000, locks = thrL > 0;
      const effort = Tr * 1000 / (v.gr * v.effG / 100) / v.Rw, ok = effort <= v.Fmax + 1e-9;
      return output({ F, y, Flift, Tr, effort, locks: locks ? 1 : 0 }, 'Handwheel effort (N)', effort,
        [m('Water force / height above the bottom', `${q(F / 1000, 'kN', 2)} / ${q(y, 'm', 3)}`), m('Lifting force', q(Flift, 'N', 0)), m('Spindle torque to raise', q(Tr, 'N·m', 2)), m('Handwheel effort', q(effort, 'N', 1)), m('Screw holds the gate', locks ? 'Yes (self-locking)' : 'No — fit a brake or lock')],
        'Sluice gate lift check.', 'Gate closed; water on one side.', {
          text: ok ? 'EFFORT ACCEPTABLE' : 'EFFORT TOO HIGH', tone: ok ? 'good' : 'bad',
          checks: [check('Handwheel effort', ok ? 'pass' : 'fail', `${q(effort, 'N', 0)} against ${q(v.Fmax, 'N', 0)}${ok ? '.' : ': add reduction gearing, a larger wheel or an actuator.'}`), check('Self-locking', locks ? 'pass' : 'warn', locks ? 'The gate stays where it is left.' : 'The gate can lower itself: lock the handwheel.'), check('Spindle buckling', 'verify', 'When closing against a jammed gate, check the spindle as a column.')],
        });
    },
    "ball-detent-check": (v) => {
      const G = v.G * 1000, k = G * v.d ** 4 / (8 * v.D ** 3 * v.Na), C = v.D / v.d;
      if (C <= 1) return invalid('The mean diameter must be larger than the wire diameter.');
      const K = (4 * C - 1) / (4 * C - 4) + 0.615 / C, Nt = { cg: v.Na + 2, c: v.Na + 2, pg: v.Na + 1, p: v.Na }[v.ends], Ls = (v.ends === 'cg' || v.ends === 'pg' ? Nt : Nt + 1) * v.d, Lr = v.Lw - v.rise;
      if (v.Lw > v.L0) return invalid('The fitted length must not exceed the unloaded length.');
      if (Lr < Ls) return invalid(`At full rise the spring would be shorter than solid (${q(Ls, 'mm', 2)}).`);
      if (v.alpha + deg(Math.atan(v.muB)) >= 89.9) return invalid('The notch is too steep for this friction: the detent would lock.');
      if (v.Fmin > v.Fmax) return invalid('The least release force must not exceed the largest.');
      const P = k * (v.L0 - v.Lw), tau = K * 8 * P * v.D / (PI * v.d ** 3), Frel = P * Math.tan(rad(v.alpha) + Math.atan(v.muB)), Prise = k * (v.L0 - Lr), tauRise = K * 8 * Prise * v.D / (PI * v.d ** 3);
      const okF = Frel >= v.Fmin - 1e-9 && Frel <= v.Fmax + 1e-9, okS = tauRise <= v.allow + 1e-9;
      return output({ k, K, P, tau, Frel, Prise, tauRise, Ls }, 'Release force (N)', Frel,
        [m('Spring rate', q(k, 'N/mm', 3)), m('Preload / stress', `${q(P, 'N', 2)} / ${q(tau, 'MPa', 0)}`), m('Release force', q(Frel, 'N', 2)), m('Spring load / stress at full rise', `${q(Prise, 'N', 2)} / ${q(tauRise, 'MPa', 0)}`), m('Solid length', q(Ls, 'mm', 2))],
        'Ball detent check.', 'Start of release; flank contact.', {
          text: !okS ? 'SPRING OVERSTRESSED' : okF ? 'DETENT FORCE IN RANGE' : 'DETENT FORCE OUT OF RANGE', tone: okF && okS ? 'good' : 'bad',
          checks: [check('Release force', okF ? 'pass' : 'fail', `${q(Frel, 'N', 1)} against ${q(v.Fmin, '', 1)}–${q(v.Fmax, 'N', 1)}.`), check('Spring stress at full rise', okS ? 'pass' : 'fail', `${q(tauRise, 'MPa', 0)} against ${q(v.allow, 'MPa', 0)}.`), check('Wear', 'verify', 'Harden the notch and ball; a worn notch lowers the release force.')],
        });
    },
    "expansion-vessel-sizing": (v) => {
      if (v.T2 <= v.T1) return invalid('The working temperature must exceed the fill temperature.');
      const P0 = v.p0 + v.patm, Pf = v.pf + v.patm;
      if (P0 <= 0) return invalid('The absolute pre-charge pressure must be above zero.');
      if (Pf <= P0) return invalid('The highest pressure must exceed the pre-charge pressure.');
      const Ve = v.Vs * v.beta * (v.T2 - v.T1), af = (Pf - P0) / Pf, Vneed = Ve / af, gasLeft = v.Vv * P0 / Pf, accepts = v.Vv * af, ok = v.Vv >= Vneed - 1e-9;
      return output({ Ve, P0, Pf, af, Vneed, gasLeft, accepts }, 'Vessel volume needed (L)', Vneed,
        [m('Expansion volume', q(Ve, 'L', 2)), m('Absolute pressures: pre-charge / final', `${q(P0, '', 3)} / ${q(Pf, 'bar', 3)}`), m('Acceptance factor', q(af, '', 3)), m('Vessel volume needed', q(Vneed, 'L', 1)), m('Fitted vessel accepts', q(accepts, 'L', 1))],
        'Expansion vessel sizing.', 'Isothermal gas cushion.', {
          text: ok ? 'VESSEL ADEQUATE' : 'VESSEL TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Vessel volume', ok ? 'pass' : 'fail', `${q(v.Vv, 'L', 0)} fitted against ${q(Vneed, 'L', 1)} needed.`), check('Relief valve', 'verify', 'Set the relief valve above the highest working pressure and below the system rating.')],
        });
    },
    "torque-arm-reaction-check": (v) => {
      if (2 * v.R <= v.d) return invalid('The edge distance must exceed the pin radius.');
      const T = 9549.2966 * v.P / v.n * v.SF, Fr = T / v.L, F = Fr * 1000, M = F * (v.a + 2 * v.bf + 4 * v.g) / 8, sb = 32 * M / (PI * v.d ** 3), tau = F / (2 * PI * v.d * v.d / 4), be = F / (v.d * v.a), bfk = F / (2 * v.d * v.bf), st = F / ((2 * v.R - v.d) * v.a), tt = F / (2 * v.a * (v.R - v.d / 2));
      const us = [sb / v.sbA, tau / v.tpA, be / v.bA, bfk / v.bA, st / v.stA, tt / v.tA].map((x) => x * 100), umax = Math.max(...us), ok = umax <= 100 + 1e-9;
      const names = ['Pin bending', 'Pin shear', 'Eye bearing', 'Fork bearing', 'Eye net tension', 'Eye tear-out'], vals = [sb, tau, be, bfk, st, tt], alls = [v.sbA, v.tpA, v.bA, v.bA, v.stA, v.tA];
      return output({ T, Fr, M, sb, tau, be, bfk, st, tt, umax }, 'Highest utilisation (%)', umax,
        [m('Output torque (with service factor)', q(T, 'N·m', 0)), m('Arm reaction', q(Fr, 'kN', 2)), m('Pin bending / shear', `${q(sb, '', 0)} / ${q(tau, 'MPa', 0)}`), m('Bearing: eye / fork', `${q(be, '', 0)} / ${q(bfk, 'MPa', 0)}`), m('Highest utilisation', q(umax, '%', 0))],
        'Torque arm reaction check.', 'Arm perpendicular to its reaction.', {
          text: ok ? 'TORQUE ARM ADEQUATE' : 'TORQUE ARM NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [...names.map((nm, i) => check(nm, us[i] <= 100 + 1e-9 ? 'pass' : 'fail', `${q(vals[i], 'MPa', 0)} against ${q(alls[i], 'MPa', 0)}.`)), check('Anchor bracket', 'verify', 'Check the bracket welds or bolts to the structure for the same reaction.')],
        });
    },
    "traction-hoist-check": (v) => {
      const g = 9.80665, mcw = v.mc + v.bal / 100 * v.mL, ratio = (heavy, light) => (heavy * (g + v.acc)) / (light * (g - v.acc));
      if (v.acc >= g) return invalid('The acceleration must be less than gravity.');
      const full = v.mc + v.mL, rFull = full >= mcw ? ratio(full, mcw) : ratio(mcw, full), rEmpty = mcw >= v.mc ? ratio(mcw, v.mc) : ratio(v.mc, mcw);
      const mue = v.groove > 0 ? v.mu / Math.sin(rad(v.groove / 2)) : v.mu, trac = Math.exp(mue * rad(v.wrap)), unb = Math.max(Math.abs(full - mcw), Math.abs(mcw - v.mc)), Pneed = unb * g * v.vr / (v.eta / 100) / 1000;
      const okF = rFull <= trac + 1e-12, okE = rEmpty <= trac + 1e-12, okP = Pneed <= v.Pfit + 1e-9, ok = okF && okE && okP;
      return output({ mcw, rFull, rEmpty, mue, trac, unb, Pneed }, 'Largest tension ratio', Math.max(rFull, rEmpty),
        [m('Counterweight', q(mcw, 'kg', 0)), m('Tension ratio: full / empty', `${q(rFull, '', 3)} / ${q(rEmpty, '', 3)}`), m('Traction available', q(trac, '', 3)), m('Largest out-of-balance', q(unb, 'kg', 0)), m('Motor power needed', q(Pneed, 'kW', 2))],
        'Traction hoist check.', 'Rope and guide friction not included.', {
          text: !okF || !okE ? 'ROPES MAY SLIP' : okP ? 'TRACTION AND POWER ADEQUATE' : 'MOTOR TOO SMALL', tone: ok ? 'good' : 'bad',
          checks: [check('Traction, car full', okF ? 'pass' : 'fail', `${q(rFull, '', 3)} against ${q(trac, '', 3)}.`), check('Traction, car empty', okE ? 'pass' : 'fail', `${q(rEmpty, '', 3)} against ${q(trac, '', 3)}.`), check('Motor power', okP ? 'pass' : 'fail', `${q(Pneed, 'kW', 2)} against ${q(v.Pfit, 'kW', 1)}.`), check('Lift regulations', 'verify', 'Passenger and goods lifts must also meet the lift standard that applies.')],
        });
    },
    "shear-pin-overload-design": (v) => {
      if (v.fMin > v.fMax) return invalid('The least break factor must not exceed the largest.');
      const pl = Number(v.planes), Tbreak = v.T * v.ovl, Fb = Tbreak * 1000 / v.Rp, dReq = Math.sqrt(4 * Fb / (PI * v.np * pl * v.tauU)), TbCh = v.np * pl * PI * v.dCh * v.dCh / 4 * v.tauU * v.Rp / 1000, fac = TbCh / v.T;
      const FbCh = TbCh * 1000 / v.Rp, tau = FbCh / (v.np * pl * PI * v.dCh * v.dCh / 4), sb = FbCh / (v.np * v.dCh * v.t), okF = fac >= v.fMin - 1e-9 && fac <= v.fMax + 1e-9, okB = sb <= v.bA + 1e-9;
      return output({ Tbreak, Fb, dReq, TbCh, fac, FbCh, tau, sb }, 'Pin diameter needed (mm)', dReq,
        [m('Break torque wanted / force at the pin', `${q(Tbreak, 'N·m', 0)} / ${q(Fb, 'N', 0)}`), m('Pin diameter needed', q(dReq, 'mm', 2)), m('Chosen pin breaks at', `${q(TbCh, 'N·m', 0)} (${q(fac, '', 2)} × running)`), m('Bearing stress at break', q(sb, 'MPa', 0))],
        'Shear pin overload design.', 'Ultimate shear strength as entered.', {
          text: !okF ? (fac < v.fMin ? 'BREAKS TOO EARLY' : 'BREAKS TOO LATE') : okB ? 'SHEAR PIN SUITABLE' : 'HUB BEARING TOO HIGH', tone: okF && okB ? 'good' : 'bad',
          checks: [check('Break factor', okF ? 'pass' : 'fail', `${q(fac, '', 2)} against ${q(v.fMin, '', 2)}–${q(v.fMax, '', 2)}.`), check('Hub bearing', okB ? 'pass' : 'fail', `${q(sb, 'MPa', 0)} against ${q(v.bA, 'MPa', 0)}: the hole must not deform before the pin shears.`), check('Spares', 'verify', 'Keep spare pins of the same material and batch with the machine.')],
        });
    },
    "portable-gantry-check": (v) => {
      const { H, B, tf, tw } = v; if (2 * tf >= H || tw >= B) return invalid('Flanges and web do not fit inside the overall size.');
      if (2 * v.legT >= v.legOD) return invalid('The leg wall must be less than half its diameter.');
      const R = [[0, 0, B, tf], [0, H - tf, B, tf], [(B - tw) / 2, tf, tw, H - 2 * tf]], A = R.reduce((s, r) => s + r[2] * r[3], 0), yb = R.reduce((s, r) => s + r[2] * r[3] * (r[1] + r[3] / 2), 0) / A;
      let Ix = 0; for (const [, y0, w, h] of R) { const dy = y0 + h / 2 - yb; Ix += w * h ** 3 / 12 + w * h * dy * dy; }
      const Zx = Ix / Math.max(yb, H - yb), M = v.W * v.L / 4, sb = M / Zx, defl = v.W * v.L ** 3 / (48 * v.E * 1000 * Ix), dAllow = v.L / v.dlim;
      const cb = Math.cos(rad(v.beta)), Pleg = v.W / (2 * cb), Lleg = v.Hl / cb, di = v.legOD - 2 * v.legT, Al = PI * (v.legOD ** 2 - di ** 2) / 4, Il = PI * (v.legOD ** 4 - di ** 4) / 64, E = v.E * 1000, rg = Math.sqrt(Il / Al), lambda = v.K * Lleg / rg, Cc = PI * Math.sqrt(2 * E / v.Sy), scr = lambda >= Cc ? PI * PI * E / (lambda * lambda) : v.Sy - (v.Sy * lambda / (2 * PI)) ** 2 / E, Pcr = scr * Al, nLeg = Pcr / Pleg, Fc = v.W / 2;
      const okB = sb <= v.sA + 1e-9, okD = defl <= dAllow + 1e-12, okL = nLeg >= v.req - 1e-9, okC = Fc <= v.castor + 1e-9, ok = okB && okD && okL && okC;
      return output({ A, Ix, Zx, M, sb, defl, dAllow, Pleg, Lleg, Al, Il, lambda, Pcr, nLeg, Fc }, 'Beam bending stress (MPa)', sb,
        [m('Beam I / Z', `${q(Ix, 'mm⁴', 0)} / ${q(Zx, 'mm³', 0)}`), m('Beam stress / deflection', `${q(sb, 'MPa', 1)} / ${q(defl, 'mm', 2)} (allowed ${q(dAllow, 'mm', 1)})`), m('Leg force / length', `${q(Pleg, 'N', 0)} / ${q(Lleg, 'mm', 0)}`), m('Leg slenderness / buckling load', `${q(lambda, '', 1)} / ${q(Pcr, 'N', 0)}`), m('Leg safety factor', q(nLeg, '', 2)), m('Castor load', q(Fc, 'N', 0))],
        'Portable gantry crane check.', 'In-plane loads; self-weight not included.', {
          text: ok ? 'GANTRY ADEQUATE' : 'GANTRY NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Beam stress', okB ? 'pass' : 'fail', `${q(sb, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Beam deflection', okD ? 'pass' : 'fail', `${q(defl, 'mm', 2)} against ${q(dAllow, 'mm', 2)}.`), check('Leg buckling', okL ? 'pass' : 'fail', `${q(nLeg, '', 2)} against ${q(v.req, '', 1)}.`), check('Castors', okC ? 'pass' : 'fail', `${q(Fc, 'N', 0)} against ${q(v.castor, 'N', 0)}.`), check('Moving loaded', 'verify', 'Do not move the gantry loaded unless it is designed and braced for it.')],
        });
    },
    "press-tie-rod-check": (v) => {
      const pM = v.p / 10, F = pM * PI * v.bore ** 2 / 4, Frod = F / v.nRod, d2 = v.d - 0.649519053 * v.P, d3 = v.d - 1.226869322 * v.P;
      if (d3 <= 0) return invalid('The pitch is too coarse for this diameter.');
      const As = PI / 4 * ((d2 + d3) / 2) ** 2, s = Frod / As, stretch = Frod * v.Lr / (v.E * 1000 * PI * v.d * v.d / 4);
      const n = 1 / v.P, e2 = v.d - 0.649519 * v.P, D1 = v.d - 1.082532 * v.P, At = v.Sub > 1240 ? PI * (e2 / 2 - 0.16238 * v.P) ** 2 : PI / 4 * (v.d - 0.938194 * v.P) ** 2, extShear = PI * D1 * (0.5 + 0.57735 * n * (e2 - D1)), intShear = PI * v.d * (0.5 + 0.57735 * n * (v.d - e2)), Le = 2 * At / extShear, J = (extShear * v.Sub) / (intShear * v.Sun), Lreq = J > 1 ? J * Le : Le;
      const okS = s <= v.sA + 1e-9, okD = stretch <= v.dMax + 1e-12, okN = v.mNut >= Lreq - 1e-9, ok = okS && okD && okN;
      return output({ F, Frod, As, s, stretch, Le, J, Lreq }, 'Thread stress (MPa)', s,
        [m('Press force / per rod', `${q(F / 1000, 'kN', 1)} / ${q(Frod / 1000, 'kN', 1)}`), m('Thread stress area', q(As, 'mm²', 1)), m('Thread stress', q(s, 'MPa', 1)), m('Rod stretch', q(stretch, 'mm', 3)), m('Nut engagement needed', q(Lreq, 'mm', 1))],
        'Press tie rod check.', 'Equal load sharing; static.', {
          text: ok ? 'TIE RODS ADEQUATE' : 'TIE RODS NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Thread stress', okS ? 'pass' : 'fail', `${q(s, 'MPa', 1)} against ${q(v.sA, 'MPa', 0)}.`), check('Stretch', okD ? 'pass' : 'fail', `${q(stretch, 'mm', 3)} against ${q(v.dMax, 'mm', 2)}.`), check('Nut engagement', okN ? 'pass' : 'fail', `${q(v.mNut, 'mm', 0)} against ${q(Lreq, 'mm', 1)} needed.`), check('Fatigue', 'verify', 'For frequent cycling, use rolled threads and pre-tension the nuts.')],
        });
    },
    "centrifuge-bowl-check": (v) => {
      if (v.r0 > v.r) return invalid('The liquid surface radius cannot exceed the bowl radius.');
      const w = 2 * PI * v.rpm / 60, rm = (v.r + v.t / 2) / 1000, gLevel = w * w * (v.r / 1000) / 9.80665, vRim = w * rm, sSelf = v.rhoS * vRim * vRim / 1e6, p = v.rhoL * w * w * ((v.r / 1000) ** 2 - (v.r0 / 1000) ** 2) / 2 / 1e6, sLiq = p * (2 * v.r + v.t) / (2 * v.t), sTot = sSelf + sLiq, nMax = sTot > 0 ? v.rpm * Math.sqrt(v.allow / sTot) : Infinity, ok = sTot <= v.allow + 1e-9;
      return output({ w, gLevel, vRim, sSelf, p, sLiq, sTot, nMax: Number.isFinite(nMax) ? nMax : 0 }, 'Total hoop stress (MPa)', sTot,
        [m('Wall acceleration', q(gLevel, 'g', 0)), m('Rim speed', q(vRim, 'm/s', 1)), m('Hoop stress from the shell', q(sSelf, 'MPa', 1)), m('Liquid pressure at the wall / hoop stress', `${q(p, 'MPa', 3)} / ${q(sLiq, 'MPa', 1)}`), m('Total hoop stress', q(sTot, 'MPa', 1)), m('Speed limit for the allowable', Number.isFinite(nMax) ? q(nMax, 'rpm', 0) : 'No stress')],
        'Centrifuge bowl check.', 'Thin plain cylinder with a liquid ring.', {
          text: ok ? 'BOWL ADEQUATE' : 'BOWL OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Hoop stress', ok ? 'pass' : 'fail', `${q(sTot, 'MPa', 1)} against ${q(v.allow, 'MPa', 0)}${ok ? '.' : `: run below ${q(nMax, 'rpm', 0)}.`}`), check('Overspeed protection', 'verify', 'Fit an overspeed trip and guard; check the bowl ends, hub and balance.')],
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
