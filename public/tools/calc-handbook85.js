// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook85). SI units are explicit at each boundary.
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
    "cutter-clearance-grinding-setup": (v) => {
      const Din = v.Dc / 25.4, Lin = v.L / 25.4, Fin = v.F / 25.4, din = v.d / 25.4;
      if (!(v.d < v.Dc)) return invalid('The depth of cut must be less than the cutter diameter.');
      const Cneed = 45860 / (Din * v.B) * (1.5 * Lin + Fin / (PI * Din) * Math.sqrt(din * (Din - din)));
      const s = Math.sin(rad(v.cl)), offAbove = v.Dw / 2 * s, offBelow = v.Dc / 2 * s, offInline = v.Dw * v.Dc * Math.sin(rad(v.cl / 2)) / (v.Dw + v.Dc), offCup = v.Dc / 2 * s;
      const off = { above: offAbove, below: offBelow, inline: offInline, cup: offCup }[v.setup];
      const what = { above: 'Wheel centre above the cutter centre', below: 'Wheel centre below the cutter centre', inline: 'Tooth rest below the common centre line', cup: 'Tooth rest below the cutter centre' }[v.setup];
      const dropRelief = v.dist * Math.tan(rad(v.cl)), dropRake = v.dist * Math.tan(rad(v.rake)), ok = v.cl >= Cneed - 1e-9;
      return output({ Cneed, offAbove, offBelow, offInline, offCup, off, dropRelief, dropRake }, `${what} (mm)`, off,
        [m('Clearance needed by the cut', q(Cneed, '°', 3)), m(what, q(off, 'mm', 4)), m('Disc wheel above / below centre', `${q(offAbove, 'mm', 4)} / ${q(offBelow, 'mm', 4)}`), m('Centres in line / cup wheel', `${q(offInline, 'mm', 4)} / ${q(offCup, 'mm', 4)}`), m('Indicator drop: side and end relief', q(dropRelief, 'mm', 4)), m('Indicator drop: face rake', q(dropRake, 'mm', 4))],
        'Milling cutter clearance grinding set-up.', 'Handbook cutter grinding rules and set-up formulas.', {
          text: ok ? 'CLEARANCE SUITS THE CUT' : 'GRIND MORE CLEARANCE', tone: ok ? 'good' : 'bad',
          checks: [check('Clearance angle', ok ? 'pass' : 'fail', `${q(v.cl, '°', 3)} to be ground against about ${q(Cneed, '°', 3)} needed for the feed, land, depth and hardness${ok ? '.' : ': the land would rub behind the edge.'}`), check('Set-up', 'pass', `${what}: ${q(off, 'mm', 4)}.`), check('Land width', 'verify', 'Grind a secondary clearance of 3 to 5 degrees when resharpening has widened the land.'), check('Burrs', 'verify', 'Stone off grinding burrs before the cutter goes back into use.')],
        });
    },
    "spline-shaft-milling-cutter": (v) => {
      if (!(v.W < v.d)) return invalid('The spline width must be less than the root diameter.');
      const A = deg(Math.asin(v.W / v.d)), Bdeg = 360 / v.Ns, half = 180 / v.Ns - A;
      if (!(half > 0)) return invalid('The splines are too wide for this number around the root diameter: there is no space between them.');
      const C = v.d * Math.sin(rad(half)), share = C / (PI * v.d / v.Ns) * 100;
      return output({ A, Bdeg, C, half, share }, 'Chordal width at the root (mm)', C,
        [m('Cutter angle B', q(Bdeg, '°', 4)), m('Angle A at the root circle', q(A, '°', 4)), m('Chordal width C', q(C, 'mm', 4)), m('Space as a share of the root pitch', q(share, '%', 3))],
        'Spline shaft milling cutter proportions.', 'Handbook spline-shaft milling cutter formulas.', {
          text: 'CUTTER PROPORTIONS SET', tone: 'good',
          checks: [check('Space between splines', 'pass', `The chordal width at the root is ${q(C, 'mm', 4)}.`), check('Spline width tolerance', 'verify', 'Allow for the tolerance on the spline width when grinding the cutter.')],
        });
    },
    "top-knurling-cam-rise": (v) => {
      const R = v.Dst / 2, r = v.Dk / 2, depth = v.depthFrom === 'pitch' ? v.pc / (2 * Math.tan(rad(v.ang / 2))) : v.dg;
      if (!(depth < R)) return invalid('The depth of the teeth must be less than the stock radius.');
      const c = Math.sqrt((R + r) ** 2 - (R + r - depth) ** 2), revs = c / v.f, time = revs / v.n * 60;
      return output({ depth, c, revs, time }, 'Cam rise required (mm)', c,
        [m('Depth of teeth', q(depth, 'mm', 4)), m('Cam rise (contact to centre)', q(c, 'mm', 4)), m('Revolutions to knurl', q(revs, 'rev', 4)), m('Time to knurl', q(time, 's', 3))],
        'Top knurling cam rise on an automatic screw machine.', 'Handbook method for revolutions required for top knurling.', {
          text: 'KNURLING CAM SET', tone: 'good',
          checks: [check('Cam rise', 'pass', `The knurl travels ${q(c, 'mm', 4)} from contact to the centre of the work.`), check('Feed', 'verify', 'Use the top-knurling feed for the material from your screw machine feed data.')],
        });
    },
    "rubber-pad-forming-pressure": (v) => {
      const p = v.F * 1000 / v.A, ratio = v.t / v.h, okP = p >= v.preq - 1e-9, okT = ratio >= 1.5 - 1e-9, okT3 = ratio >= 3 - 1e-9, okS = v.shore >= 50 && v.shore <= 70;
      const ok = okP && okT;
      return output({ p, ratio, ppsi: p * 145.0377, margin: p / v.preq }, 'Pad forming pressure (MPa)', p,
        [m('Pad forming pressure', `${q(p, 'MPa', 4)} (${q(p * 145.0377, 'psi', 4)})`), m('Pressure ÷ pressure needed', q(p / v.preq, '', 3)), m('Pad thickness ÷ form block height', q(ratio, '', 3)), m('Pad hardness', q(v.shore, 'Shore A', 3))],
        'Rubber pad (Guerin) forming pressure.', 'Handbook rubber pad forming rules.', {
          text: ok ? 'PAD FORMS THE PART' : 'CHANGE THE PRESS, PAD OR PART', tone: ok ? (okT3 && okS ? 'good' : 'warn') : 'bad',
          checks: [check('Forming pressure', okP ? 'pass' : 'fail', `${q(p, 'MPa', 4)} on the blank against ${q(v.preq, 'MPa', 4)} needed${okP ? '.' : ': use a larger press, a smaller pad area or form fewer parts at once.'}`), check('Pad thickness', okT3 ? 'pass' : okT ? 'warn' : 'fail', `The pad is ${q(ratio, '', 3)} times the form block height; the handbook gives usually 3 and never less than 1.5.`), check('Pad hardness', okS ? 'pass' : 'warn', `${q(v.shore, 'Shore A', 3)} against the 50 to 70 Shore the handbook gives.`)],
        });
    },
    "gear-angular-backlash": (v) => {
      if (!(v.D >= v.d)) return invalid('Enter the larger gear’s pitch diameter first: it must not be smaller than the smaller gear’s.');
      const thD = 6875 * v.Bk / v.D, thd = 6875 * v.Bk / v.d, dB = 2 * v.dC * Math.tan(rad(v.phi)), B2 = v.Bk + dB;
      if (!(B2 >= 0)) return invalid('The centre distance decrease would remove all the backlash: the gears would bind.');
      const thd2 = 6875 * B2 / v.d, thD2 = 6875 * B2 / v.D, ok = thd2 <= v.maxSmall + 1e-9;
      return output({ thD, thd, dB, B2, thd2, thD2, thdSec: thd * 60 }, 'Angular backlash of the smaller gear (minutes)', thd,
        [m('Larger gear (smaller held)', `${q(thD, '′', 4)} (${q(thD / 60, '°', 4)})`), m('Smaller gear (larger held)', `${q(thd, '′', 4)} (${q(thd * 60, '″', 4)})`), m('Backlash change from the centre distance change', q(dB, 'mm', 4)), m('Backlash after the change', q(B2, 'mm', 4)), m('Angular play after the change: smaller / larger gear', `${q(thd2, '′', 4)} / ${q(thD2, '′', 4)}`)],
        'Angular backlash of a gear pair.', 'Handbook angular backlash formulas.', {
          text: ok ? 'ANGULAR PLAY ACCEPTED' : 'ANGULAR PLAY TOO LARGE', tone: ok ? 'good' : 'bad',
          checks: [check('Play at the smaller gear', ok ? 'pass' : 'fail', `${q(thd2, '′', 4)} after the centre distance change against ${q(v.maxSmall, '′', 4)} accepted${ok ? '.' : ': reduce the backlash or move the centres together.'}`), check('Binding', B2 > 0 ? 'pass' : 'warn', B2 > 0 ? `${q(B2, 'mm', 4)} backlash remains after the change.` : 'No backlash remains: the gears will bind as they warm up.'), check('Measurement', 'verify', 'Measure backlash at the tightest point of mesh, as the handbook defines it.')],
        });
    },
    "unified-cut-thread-tap-limits": (v) => {
      const p = 1 / v.n, PDb = v.Dn - 0.649519 * p, C = (v.n < 6 ? 0.2 : 0.25) * 0.216506 * p;
      if (!(PDb > 0)) return invalid('The basic diameter is too small for this pitch.');
      const Mmin = v.Dn + v.B + C, Mmax = Mmin + v.A, PDmin = PDb + v.B, PDmax = PDmin + v.Dt;
      const okPD = v.PDm >= PDmin - 1e-9 && v.PDm <= PDmax + 1e-9, okM = v.Mm >= Mmin - 1e-9 && v.Mm <= Mmax + 1e-9, ok = okPD && okM;
      return output({ PDb, C, Mmin, Mmax, PDmin, PDmax }, 'Minimum pitch diameter (in)', PDmin,
        [m('Basic pitch diameter', q(PDb, 'in', 5)), m('Constant C', q(C, 'in', 5)), m('Major diameter limits', `${q(Mmin, 'in', 5)} to ${q(Mmax, 'in', 5)}`), m('Pitch diameter limits', `${q(PDmin, 'in', 5)} to ${q(PDmax, 'in', 5)}`), m('Limits in millimetres: major / pitch', `${q(Mmin * 25.4, '', 4)}–${q(Mmax * 25.4, 'mm', 4)} / ${q(PDmin * 25.4, '', 4)}–${q(PDmax * 25.4, 'mm', 4)}`)],
        'Unified inch cut thread tap limits.', 'ASME B94.9 Table 3 formulas as given in the handbook.', {
          text: ok ? 'TAP WITHIN ITS LIMITS' : 'TAP OUTSIDE ITS LIMITS', tone: ok ? 'good' : 'bad',
          checks: [check('Pitch diameter', okPD ? 'pass' : 'fail', `${q(v.PDm, 'in', 5)} measured against ${q(PDmin, 'in', 5)} to ${q(PDmax, 'in', 5)}.`), check('Major diameter', okM ? 'pass' : 'fail', `${q(v.Mm, 'in', 5)} measured against ${q(Mmin, 'in', 5)} to ${q(Mmax, 'in', 5)}.`), check('Lead', 'verify', 'Lead tolerance ±0.003 in within any two threads not farther apart than 1 in.'), check('Half angle', 'verify', 'Check the half-angle deviation against Table 3 for the threads per inch.')],
        });
    },
    "silent-chain-width": (v) => {
      const capIn = v.rate / v.SF, wNeed = v.P * v.SF / v.rate * 25.4, capChosen = v.wChosen / 25.4 * capIn;
      const okW = v.wChosen >= wNeed - 1e-9, lv = { I: 1, II: 2, III: 3 }, okL = lv[v.lubeHave] >= lv[v.lube], ok = okW && okL;
      return output({ capIn, wNeed, capChosen, util: v.P / capChosen * 100 }, 'Chain width needed (mm)', wNeed,
        [m('Capacity per 25.4 mm after the service factor', q(capIn, 'kW', 4)), m('Width needed', `${q(wNeed, 'mm', 4)} (${q(wNeed / 25.4, 'in', 4)})`), m('Capacity of the chosen width', q(capChosen, 'kW', 4)), m('Power ÷ capacity', q(v.P / capChosen * 100, '%', 3))],
        'Silent chain width for a power.', 'Handbook silent chain capacity rules.', {
          text: ok ? 'CHAIN WIDTH CARRIES THE POWER' : 'WIDEN THE CHAIN OR IMPROVE LUBRICATION', tone: ok ? 'good' : 'bad',
          checks: [check('Width', okW ? 'pass' : 'fail', `${q(v.wChosen, 'mm', 4)} chosen against ${q(wNeed, 'mm', 4)} needed${okW ? '.' : ': choose the next standard width above the width needed.'}`), check('Lubrication', okL ? 'pass' : 'fail', okL ? `Type ${v.lubeHave} lubrication meets the type ${v.lube} the rating assumes.` : `Type ${v.lubeHave} lubrication is poorer than the type ${v.lube} the rating assumes.`), check('Rating', 'verify', 'Take the rating from the table for the pitch, small sprocket teeth and speed; avoid greases.')],
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
