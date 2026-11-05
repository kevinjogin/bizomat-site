// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook55). SI units are explicit at each boundary.
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
    "ring-blank-make-plan": (v) => {
      if (v.ID >= v.OD) return invalid('The inside diameter must be smaller than the outside diameter.');
      const vol = (Do, Di, hh) => { const A = (Do - Di) / 2 * hh, rA = (Do + Di) / 4; return A * 2 * PI * rA; };
      const Di = Math.max(0, v.ID - 2 * v.a), Do = v.OD + 2 * v.a, hb = v.h + 2 * v.a, Vp = vol(v.OD, v.ID, v.h), Vr = vol(Do, Di, hb), side = Do + v.edge, Vpl = side * side * hb;
      const kg = (V) => V * 1e-9 * v.rho, mPart = kg(Vp), mRing = kg(Vr), mPlate = kg(Vpl), cRing = mRing * v.pRing, cPlate = mPlate * v.pPlate - (mPlate - mRing) * v.pScrap, best = Math.min(cRing, cPlate), ringBest = cRing <= cPlate, ok = best <= v.budget;
      return output({ Vp, Vr, Vpl, mPart, mRing, mPlate, cRing, cPlate, yRing: mPart / mRing * 100, yPlate: mPart / mPlate * 100, best }, 'Cheaper blank cost ($)', best,
        [m('Finished ring mass', q(mPart, 'kg', 2)), m('Rolled ring blank mass / yield', `${q(mRing, 'kg', 2)} / ${q(mPart / mRing * 100, '%', 0)}`), m('Plate blank mass / yield', `${q(mPlate, 'kg', 2)} / ${q(mPart / mPlate * 100, '%', 0)}`), m('Rolled ring cost', money(cRing)), m('Plate blank cost (after scrap credit)', money(cPlate)), m('Cheaper route', ringBest ? 'Rolled ring' : 'Cut from plate')],
        'Ring blank plan.', 'Rectangular section; scrap credited.', {
          text: !ok ? 'OVER BUDGET' : ringBest ? 'ROLLED RING CHEAPER' : 'PLATE BLANK CHEAPER', tone: ok ? 'good' : 'bad',
          checks: [check('Budget', ok ? 'pass' : 'fail', `${money(best)} against ${money(v.budget)}.`), check('Lead time', 'verify', 'Rolled rings often have longer lead times than plate: weigh time against cost.')],
        });
    },
    "thread-rolling-setup": (v) => {
      const d2 = v.d - 0.649519053 * v.P, d3 = v.d - 1.226869322 * v.P, h3 = 0.613435 * v.P;
      if (d3 <= 0) return invalid('The pitch is too coarse for this diameter.');
      if (v.Dmax <= v.Dmin) return invalid('The largest roll diameter must exceed the smallest.');
      const As = PI / 4 * ((d2 + d3) / 2) ** 2, per = d2 - h3 / 2, D = v.Ns * per - h3, nsMin = Math.ceil((v.Dmin + h3) / per - 1e-9), nsMax = Math.floor((v.Dmax + h3) / per + 1e-9), ok = D >= v.Dmin - 1e-9 && D <= v.Dmax + 1e-9;
      return output({ d2, d3, h3, As, D, lead: v.Ns * v.P, nsMin, nsMax }, 'Roll pitch diameter (mm)', D,
        [m('Thread pitch diameter (blank diameter)', q(d2, 'mm', 3)), m('Thread height h₃', q(h3, 'mm', 4)), m('Tensile stress area', q(As, 'mm²', 2)), m('Roll pitch diameter', q(D, 'mm', 3)), m('Roll lead', q(v.Ns * v.P, 'mm', 3)), m('Starts that fit the machine', nsMax >= nsMin ? `${nsMin} to ${nsMax}` : 'None')],
        'Thread rolling set-up.', 'Cylindrical dies; blank at pitch diameter.', {
          text: ok ? 'ROLLS FIT THE MACHINE' : 'ROLL SIZE OUT OF RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Roll size', ok ? 'pass' : 'fail', `${q(D, 'mm', 1)} against ${q(v.Dmin, '', 0)}–${q(v.Dmax, 'mm', 0)}${ok ? '.' : nsMax >= nsMin ? `: use ${nsMin} to ${nsMax} starts.` : ': no number of starts fits.'}`), check('Blank size', 'verify', 'Roll a trial piece and adjust the blank for full thread form within the class limits.')],
        });
    },
    "shear-legs-check": (v) => {
      if (v.s >= 2 * v.Lg) return invalid('The feet are spread wider than the legs can reach.');
      if (2 * v.t >= v.OD) return invalid('The wall is too thick for this diameter.');
      const a = v.Lg, b = v.Lg, c = v.s, C = deg(Math.acos((a * a + b * b - c * c) / (2 * a * b))), th = rad(C / 2), hgt = Math.sqrt(v.Lg ** 2 - (v.s / 2) ** 2), W = v.W * 1000, Fleg = W / (2 * Math.cos(th)), Hf = W * Math.tan(th) / 2;
      const id = v.OD - 2 * v.t, A = PI * (v.OD ** 2 - id ** 2) / 4, I = PI * (v.OD ** 4 - id ** 4) / 64, E = v.E * 1000, r = Math.sqrt(I / A), lam = v.K * v.Lg / r, Cc = PI * Math.sqrt(2 * E / v.Sy), euler = lam >= Cc, scr = euler ? PI * PI * E / (lam * lam) : v.Sy - (v.Sy * lam / (2 * PI)) ** 2 / E, Pcr = scr * A, n = Pcr / Fleg;
      const okB = n >= v.req, okT = Hf / 1000 <= v.tie, ok = okB && okT;
      return output({ C, hgt, Fleg, Hf, A, I, lam, Pcr, n }, 'Buckling safety factor', n,
        [m('Apex angle / leg angle from vertical', `${q(C, '', 2)} / ${q(C / 2, '°', 2)}`), m('Head height', q(hgt, 'mm', 0)), m('Force in each leg', q(Fleg / 1000, 'kN', 2)), m('Outward thrust at each foot', q(Hf / 1000, 'kN', 2)), m('Leg slenderness / method', `${q(lam, '', 0)} / ${euler ? 'Euler' : 'Johnson'}`), m('Leg buckling load', q(Pcr / 1000, 'kN', 1)), m('Buckling safety factor', q(n, '', 2))],
        'Shear legs check.', 'Central load; pinned legs.', {
          text: ok ? 'SHEAR LEGS ADEQUATE' : 'SHEAR LEGS NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Leg buckling', okB ? 'pass' : 'fail', `${q(n, '', 2)} against ${q(v.req, '', 1)}.`), check('Foot tie', okT ? 'pass' : 'fail', `${q(Hf / 1000, 'kN', 2)} against ${q(v.tie, 'kN', 1)}.`), check('Back guys', 'verify', 'Guy the head fore and aft: shear legs are unstable out of their plane.')],
        });
    },
    "stock-removal-plan": (v) => {
      const Vstock = PI * v.D * v.D / 4 * v.L, Vs = Vstock / 1000;
      if (v.Vf >= Vs) return invalid('The finished volume must be smaller than the stock volume.');
      const removed = Vs - v.Vf, mStock = Vstock * 1e-9 * v.rho, mChip = removed * 1e-6 * v.rho, yld = v.Vf / Vs * 100, Q = v.vc * v.ap * v.f, Fc = v.kc * v.ap * v.f, Pc = Fc * v.vc / 60000, Pm = Pc / (v.eta / 100), time = removed / Q, cost = mStock * v.price;
      const okP = Pm <= v.Pavail, okY = yld >= v.yMin, ok = okP && okY;
      return output({ Vstock, mStock, removed, mChip, yld, Q, Fc, Pc, Pm, time, cost }, 'Cutting time (min)', time,
        [m('Stock volume / mass', `${q(Vs, 'cm³', 1)} / ${q(mStock, 'kg', 2)}`), m('Volume removed / chip mass', `${q(removed, 'cm³', 1)} / ${q(mChip, 'kg', 2)}`), m('Material yield', q(yld, '%', 1)), m('Removal rate', q(Q, 'cm³/min', 1)), m('Cutting / motor power', `${q(Pc, '', 2)} / ${q(Pm, 'kW', 2)}`), m('Cutting time', q(time, 'min', 2)), m('Stock cost', money(cost))],
        'Stock removal plan.', 'Constant removal rate; roughing only.', {
          text: ok ? 'PLAN WORKABLE' : !okP ? 'NOT ENOUGH POWER' : 'YIELD TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Spindle power', okP ? 'pass' : 'fail', `${q(Pm, 'kW', 2)} against ${q(v.Pavail, 'kW', 1)}.`), check('Material yield', okY ? 'pass' : 'fail', `${q(yld, '%', 1)} against ${q(v.yMin, '%', 0)}${okY ? '.' : ': consider a smaller bar, a forging or a casting.'}`)],
        });
    },
    "pump-speed-control-plan": (v) => {
      if (v.Hb >= v.H0) return invalid('The best-efficiency head must be below the shut-off head.');
      if (v.Hd <= v.Hs) return invalid('The system head at the known flow must exceed the static head.');
      if (v.H0 <= v.Hs) return invalid('The pump cannot lift against the static head.');
      const g = 9.80665, a = (v.H0 - v.Hb) / v.Qb ** 2, k = (v.Hd - v.Hs) / v.Qd ** 2, s = Math.sqrt((v.Hs + (a + k) * v.Qt ** 2) / v.H0), nt = s * v.n0, eff = (x) => Math.max(0.01, v.etab / 100 * (2 * x - x * x));
      const H = v.Hs + k * v.Qt ** 2, xv = v.Qt / (v.Qb * s), etav = eff(xv), Pv = v.rho * g * (v.Qt / 60000) * H / etav / 1000, Hthr = v.H0 - a * v.Qt ** 2, x0 = v.Qt / v.Qb, eta0 = eff(x0), Pt = Hthr > 0 ? v.rho * g * (v.Qt / 60000) * Hthr / eta0 / 1000 : 0;
      const dP = Pt - Pv, save = dP * v.hours * v.price, okR = s <= 1 + 1e-12 && Hthr >= H, okS = s * 100 >= v.sMin, ok = okR && okS && dP > 0;
      return output({ a, k, s, nt, H, etav: etav * 100, Pv, Hthr, eta0: eta0 * 100, Pt, dP, save }, 'Speed for the target flow (rpm)', nt,
        [m('Speed for the target flow', `${q(nt, 'rpm', 0)} (${q(s * 100, '%', 1)})`), m('Head at the target flow', q(H, 'm', 2)), m('Efficiency: speed control / throttled', `${q(etav * 100, '', 1)} / ${q(eta0 * 100, '%', 1)}`), m('Power: speed control / throttled', `${q(Pv, '', 2)} / ${q(Pt, 'kW', 2)}`), m('Pump head when throttled', q(Hthr, 'm', 2)), m('Power saved', q(dP, 'kW', 2)), m('Saving per year', money(save))],
        'Pump speed control plan.', 'Quadratic curves; drive losses excluded.', {
          text: ok ? 'SPEED CONTROL SAVES' : !okR ? 'TARGET NOT REACHABLE' : 'SPEED CONTROL NOT SUITABLE', tone: ok ? 'good' : 'bad',
          checks: [check('Target reachable', okR ? 'pass' : 'fail', okR ? 'The pump can deliver the target at or below rated speed.' : 'The target needs more than rated speed or head.'), check('Least speed', okS ? 'pass' : 'fail', `${q(s * 100, '%', 1)} against ${q(v.sMin, '%', 0)}.`), check('Saving', dP > 0 ? 'pass' : 'fail', `${q(dP, 'kW', 2)} saved.`)],
        });
    },
    "lot-acceptance-from-capability": (v) => {
      if (v.usl <= v.lsl) return invalid('The upper limit must be above the lower limit.');
      if (v.c >= v.n) return invalid('The acceptance number must be less than the sample size.');
      const erfc = (x) => { const z = Math.abs(x), t = 1 / (1 + 0.5 * z), r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }, Phi = (x) => 0.5 * erfc(-x / Math.SQRT2);
      const zl = (v.mean - v.lsl) / v.sd, zu = (v.usl - v.mean) / v.sd, p = Phi(-zl) + Phi(-zu), Cpk = Math.min(zl, zu) / 3, ppm = p * 1e6;
      const lnC = (nn, kk) => { let s = 0; for (let i = 1; i <= kk; i++) s += Math.log((nn - kk + i) / i); return s; }, PaOf = (pp) => { if (pp <= 0) return 1; if (pp >= 1) return 0; let s = 0; for (let kk = 0; kk <= v.c; kk++) s += Math.exp(lnC(v.n, kk) + kk * Math.log(pp) + (v.n - kk) * Math.log(1 - pp)); return Math.min(1, s); };
      const Pa = PaOf(p), ok = Pa * 100 >= v.PaMin;
      return output({ zl, zu, Cpk, p, ppm, Pa, rej: 1 - Pa, aoq: p * Pa * 1e6 }, 'Probability of acceptance', Pa,
        [m('z to lower / upper limit', `${q(zl, '', 3)} / ${q(zu, '', 3)}`), m('Cpk', q(Cpk, '', 3)), m('Out of tolerance', `${q(ppm, 'ppm', 0)} (${q(p * 100, '%', 3)})`), m('Probability a lot is accepted', q(Pa * 100, '%', 2)), m('Lots rejected', q((1 - Pa) * 100, '%', 2)), m('Average outgoing quality', q(p * Pa * 1e6, 'ppm', 0))],
        'Lot acceptance from process capability.', 'Normal process; binomial sampling.', {
          text: ok ? 'LOTS WILL PASS' : 'LOTS AT RISK OF REJECTION', tone: ok ? 'good' : 'bad',
          checks: [check('Acceptance', ok ? 'pass' : 'fail', `${q(Pa * 100, '%', 2)} against ${q(v.PaMin, '%', 1)}.`), check('Centring', Math.abs(zl - zu) < 0.5 ? 'pass' : 'warn', Math.abs(zl - zu) < 0.5 ? 'Process roughly centred.' : 'The mean is off-centre: centring lowers the fraction defective.')],
        });
    },
    "sump-pumpout-plan": (v) => {
      if (v.Ns % 2) return invalid('Simpson’s rule needs an even number of spaces.');
      if (v.pump <= v.inflow) return invalid('The pump must deliver more than the inflow.');
      const V = Array.from({ length: v.Ns + 1 }, (_, i) => v[`V${i}`]); let s = V[0] + V[v.Ns]; for (let i = 1; i < v.Ns; i++) s += (i % 2 ? 4 : 2) * V[i];
      const A = v.W / 3 * s, At = v.W * ((V[0] + V[v.Ns]) / 2 + V.slice(1, -1).reduce((a, b) => a + b, 0)), Vol = A * v.L / 1e6, net = v.pump - v.inflow, time = Vol / net, ok = time <= v.tMax;
      return output({ A, At, Vol, net, time }, 'Time to empty (min)', time,
        [m('Section area (Simpson)', q(A / 1e6, 'm²', 3)), m('Section area (trapezoidal check)', q(At / 1e6, 'm²', 3)), m('Volume of water', `${q(Vol, 'L', 0)} (${q(Vol / 1000, 'm³', 2)})`), m('Net pumping rate', q(net, 'L/min', 0)), m('Time to empty', q(time, 'min', 1))],
        'Sump pump-out plan.', 'Uniform section; constant pump flow.', {
          text: ok ? 'EMPTIES IN TIME' : 'TOO SLOW', tone: ok ? 'good' : 'bad',
          checks: [check('Time', ok ? 'pass' : 'fail', `${q(time, 'min', 1)} against ${q(v.tMax, 'min', 0)}${ok ? '.' : `: a net ${q(Vol / v.tMax, 'L/min', 0)} is needed.`}`), check('Pump head', 'verify', 'Check the pump delivers its flow at the full lift from the pit floor.')],
        });
    },
    "outdoor-cabinet-wind-tipping": (v) => {
      const qd = v.rhoA * v.V * v.V / 2, p = v.Cd * qd, F = p * v.A, W = v.mass * 9.80665, Mr = W * v.b / 1000, Mo = F * v.hF / 1000;
      if (Mo <= 0) return invalid('Enter a wind speed and area.');
      const sf = Mr / Mo, need = sf < v.req, Ta = need && v.nA > 0 ? (v.req * Mo - Mr) / (v.nA * v.La / 1000) : 0, okA = !need || (v.nA > 0 && Ta <= v.cap * 1000), Fs = v.mu * W, okS = Fs >= F;
      const text = !okS ? 'WILL SLIDE' : !need ? 'STABLE IN WIND' : okA ? 'ANCHORS NEEDED' : 'UNSTABLE IN WIND';
      return output({ q: qd, p, F, Mr, Mo, sf, Ta, Fs }, 'Safety factor against tipping', sf,
        [m('Dynamic pressure / surface pressure', `${q(qd, '', 1)} / ${q(p, 'Pa', 1)}`), m('Wind force', q(F, 'N', 0)), m('Restoring / overturning moment', `${q(Mr, '', 0)} / ${q(Mo, 'N·m', 0)}`), m('Safety factor against tipping', q(sf, '', 2)), m('Anchor tension needed', need ? (v.nA > 0 ? q(Ta / 1000, 'kN per anchor', 2) : 'Anchors needed') : 'None'), m('Sliding resistance', q(Fs, 'N', 0))],
        'Outdoor wind tipping and sliding check.', 'Steady wind; rigid level base.', {
          text, tone: text === 'STABLE IN WIND' ? 'good' : text === 'ANCHORS NEEDED' ? 'warn' : 'bad',
          checks: [check('Tipping', !need ? 'pass' : okA ? 'warn' : 'fail', !need ? `Factor ${q(sf, '', 2)} against ${q(v.req, '', 1)}.` : okA ? `Anchor each windward anchor for ${q(Ta / 1000, 'kN', 2)}.` : 'Anchors cannot hold it: widen the base or add ballast.'), check('Sliding', okS ? 'pass' : 'fail', `${q(Fs, 'N', 0)} friction against ${q(F, 'N', 0)} wind.`), check('Site wind speed', 'verify', 'Take the design wind speed from the local wind code for the site and height.')],
        });
    },
    "segmented-flange-plan": (v) => {
      if (v.ID >= v.OD) return invalid('The inside diameter must be smaller than the outside diameter.');
      const R = v.OD / 2, r = v.ID / 2, th = 2 * PI / v.n, area = (R * R - r * r) * th / 2, len = 2 * R * Math.sin(th / 2) + v.allow, wid = R - r * Math.cos(th / 2) + v.allow, rect = len * wid, yld = area / rect * 100;
      const fits = (len <= v.pl && wid <= v.pw) || (len <= v.pw && wid <= v.pl), per = Math.max(Math.floor(v.pl / len) * Math.floor(v.pw / wid), Math.floor(v.pl / wid) * Math.floor(v.pw / len)), plates = per > 0 ? Math.ceil(v.n / per) : 0, mass = v.n * area * v.t * 1e-9 * v.rho, weld = v.n * (R - r), okY = yld >= v.yMin, ok = fits && okY;
      return output({ area, len, wid, rect, yld, per, plates, mass, weld }, 'Segment rectangle yield (%)', yld,
        [m('Segment area', q(area / 1e6, 'm²', 4)), m('Segment rectangle', `${q(len, '', 0)} × ${q(wid, 'mm', 0)}`), m('Yield of each rectangle', q(yld, '%', 1)), m('Segments per plate / plates', fits ? `${per} / ${plates}` : 'Does not fit'), m('Ring mass', q(mass, 'kg', 1)), m('Butt weld length', q(weld / 1000, 'm', 2))],
        'Segmented flange plan.', 'One segment per rectangle; cutting allowance as entered.', {
          text: ok ? 'SEGMENT PLAN OK' : !fits ? 'SEGMENT DOES NOT FIT THE PLATE' : 'YIELD TOO LOW', tone: ok ? 'good' : 'bad',
          checks: [check('Plate fit', fits ? 'pass' : 'fail', fits ? `Segments fit ${per} to a plate.` : `${q(len, 'mm', 0)} × ${q(wid, 'mm', 0)} does not fit ${q(v.pl, '', 0)} × ${q(v.pw, 'mm', 0)}: use more segments.`), check('Yield', okY ? 'pass' : 'fail', `${q(yld, '%', 1)} against ${q(v.yMin, '%', 0)}.`), check('Weld procedure', 'verify', 'Use full-penetration butt welds with a qualified procedure and check flatness after welding.')],
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
