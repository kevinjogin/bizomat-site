// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook101). SI units are explicit at each boundary.
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
    "spline-pin-measurement": (v) => {
      const ph = rad(Number(v.pa)), inv = (a) => Math.tan(a) - a, D = v.N / v.P, Db = D * Math.cos(ph), internal = v.kind === 'int';
      const dpin = v.dp > 0 ? v.dp : (internal ? (v.pa === '45' ? 1.92 : 1.728) : 1.92) / v.P;
      const target = internal ? v.w / D + inv(ph) - dpin / Db : v.w / D + inv(ph) + dpin / Db - PI / v.N;
      if (!(target > 0 && target < 1.5)) return invalid('The pin does not sit on the involute for this space width or tooth thickness.');
      let a = Math.cbrt(3 * target); for (let k = 0; k < 60; k++) a -= (inv(a) - target) / Math.tan(a) ** 2;
      const sec = 1 / Math.cos(a), odd = v.N % 2 === 1, Dm = odd ? Db * Math.cos(PI / (2 * v.N)) : Db, M = internal ? Dm * sec - dpin : Dm * sec + dpin, ad = deg(a);
      return output({ D, Db, dpin, invA: target, a: ad, sec, M }, internal ? 'Measurement between pins Mi (in)' : 'Measurement over pins Me (in)', M,
        [m('Pitch / base diameter', `${q(D, 'in', 5)} / ${q(Db, 'in', 5)}`), m('Pin diameter', `${q(dpin, 'in', 5)}${v.dp > 0 ? '' : ' (standard)'}`), m('Involute at the pin centre', q(target, '', 5)), m('Pressure angle at the pin centre', `${q(ad, '°', 5)} (${Math.floor(ad)}° ${q((ad - Math.floor(ad)) * 60, '′', 4)})`),
          m(internal ? 'Measurement between pins Mi' : 'Measurement over pins Me', `${q(M, 'in', 5)} (${q(M * 25.4, 'mm', 4)})`)],
        `${internal ? 'Internal' : 'External'} ${v.N}-tooth ${v.pa}° spline, ${q(v.P, '', 4)} diametral pitch${odd ? ' (odd number of teeth)' : ''}.`, 'Handbook two-pin measurement formulas for involute splines.', {
          checks: [check('Pin size', v.dp > 0 ? 'verify' : 'pass', v.dp > 0 ? 'A non-standard pin is used; check that it contacts the involute flanks.' : 'Standard pin diameter for this spline.'), check('Use of the result', 'verify', 'Pin measurements give the actual, not the effective, space width or tooth thickness.')],
        });
    },
    "iso-fit-limits-from-deviations": (v) => {
      let ES, EI, es, ei;
      if (v.hk === 'EI') { EI = v.hdev; ES = EI + v.hIT; } else if (v.hk === 'ES') { ES = v.hdev + v.hdelta; EI = ES - v.hIT; } else if (v.hk === 'H') { EI = 0; ES = v.hIT; } else { ES = v.hIT / 2; EI = -v.hIT / 2; }
      if (v.sk === 'es') { es = v.sdev; ei = es - v.sIT; } else if (v.sk === 'ei') { ei = v.sdev; es = ei + v.sIT; } else if (v.sk === 'h') { es = 0; ei = -v.sIT; } else { es = v.sIT / 2; ei = -v.sIT / 2; }
      const Hmax = v.size + ES / 1000, Hmin = v.size + EI / 1000, Smax = v.size + es / 1000, Smin = v.size + ei / 1000, cmax = ES - ei, cmin = EI - es;
      const kind = cmin >= 0 ? 'CLEARANCE FIT' : cmax <= 0 ? 'INTERFERENCE FIT' : 'TRANSITION FIT', r3 = (x) => q(x, 'mm', 4);
      return output({ ES, EI, es, ei, Hmax, Hmin, Smax, Smin, cmax, cmin }, 'Largest clearance (µm, negative = interference)', cmax,
        [m('Hole ES / EI', `${q(ES, 'µm', 4)} / ${q(EI, 'µm', 4)}`), m('Hole limits', `${r3(Hmax)} to ${r3(Hmin)}`), m('Shaft es / ei', `${q(es, 'µm', 4)} / ${q(ei, 'µm', 4)}`), m('Shaft limits', `${r3(Smax)} to ${r3(Smin)}`),
          m('Largest clearance ES − ei', q(cmax, 'µm', 4)), m('Smallest clearance EI − es', q(cmin, 'µm', 4))],
        `Fit at ${q(v.size, 'mm', 4)} basic size.`, 'BS ISO limits and fits procedure as given in the handbook.', {
          text: kind, tone: 'good',
          checks: [check('Delta value', v.hk === 'ES' ? 'verify' : v.hdelta > 0 ? 'warn' : 'pass', v.hk === 'ES' ? `Δ = ${q(v.hdelta, 'µm', 4)} added to ES; it applies to K, M and N up to IT8 and P to ZC up to IT7.` : v.hdelta > 0 ? 'A delta value was entered but is only added when the hole’s upper deviation ES is tabulated.' : 'No delta value needed.'), check('Table values', 'verify', 'Read the deviations and IT values for the size step that contains the basic size.')],
        });
    },
    "cylinder-portion-volume": (v) => {
      const r = v.d / 2;
      if (v.mode === 'trunc') {
        if (v.h2 > v.h1) return invalid('h1 is the longest side; enter it as the larger height.');
        const V = PI * r * r * (v.h1 + v.h2) / 2, S = PI * r * (v.h1 + v.h2);
        return output({ V, S }, 'Volume (mm³)', V, [m('Volume', `${q(V, 'mm³', 4)} (${q(V / 1000, 'cm³', 4)})`), m('Curved surface area', `${q(S, 'mm²', 4)} (${q(S / 100, 'cm²', 4)})`), m('Mean height', q((v.h1 + v.h2) / 2, 'mm', 4))],
          `Cylinder ${q(v.d, 'mm', 4)} in diameter cut off at an angle.`, 'Handbook portion of cylinder formulas.', { checks: [check('Heights', 'pass', 'Measured on the longest and shortest sides of the cut.')] });
      }
      if (!(v.b < r)) return invalid('The chord must lie inside the base circle (b less than the radius).');
      if (!(v.h > 0)) return invalid('Enter the height of the ungula.');
      const a = Math.sqrt(r * r - v.b * v.b), th = Math.acos(v.b / r), segS = r * r * th - a * v.b, arcS = 2 * r * th, big = v.side === 'large', sg = big ? 1 : -1;
      const area = big ? PI * r * r - segS : segS, arc = big ? 2 * PI * r - arcS : arcS, V = (2 / 3 * a ** 3 + sg * v.b * area) * v.h / (r + sg * v.b), S = (a * v.d + sg * v.b * arc) * v.h / (r + sg * v.b);
      return output({ a, area, arc, V, S }, 'Volume (mm³)', V,
        [m('Half chord a', q(a, 'mm', 4)), m('Base area ABC', q(area, 'mm²', 4)), m('Base arc length ABC', q(arc, 'mm', 4)), m('Volume', `${q(V, 'mm³', 4)} (${q(V / 1000, 'cm³', 4)})`), m('Curved surface area', `${q(S, 'mm²', 4)} (${q(S / 100, 'cm²', 4)})`)],
        `Ungula of a ${q(v.d, 'mm', 4)} cylinder, ${q(v.h, 'mm', 4)} high.`, 'Handbook portion of cylinder formulas.', {
          checks: [check('Base side', 'verify', big ? 'The base is more than half the circle, so the + signs are used.' : 'The base is half the circle or less, so the − signs are used.')],
        });
    },
    "after-tax-npv-comparison": (v) => {
      const i = v.i / 100, t = v.TR / 100, g = (1 + i) ** v.n;
      if (!(i > 0)) return invalid('Enter a rate of return above zero.');
      const PA = (g - 1) / (i * g), AG = 1 / i - v.n / (g - 1);
      const one = (P, L, AR, AE, G) => { const pre = -P + (AR - AE - AG * G) * (1 - t) * PA + L / g, atdr = t * (P - L) / v.n * PA; return { pre, atdr, npv: pre + atdr }; };
      const A = one(v.PA, v.LA, v.ARA, v.AEA, v.GA), B = one(v.PB, v.LB, v.ARB, v.AEB, v.GB), best = A.npv >= B.npv ? 'A' : 'B', top = Math.max(A.npv, B.npv), cur = (x) => q(x, '\x24', 4);
      return output({ PA, AG, preA: A.pre, atdrA: A.atdr, NA: A.npv, preB: B.pre, atdrB: B.atdr, NB: B.npv }, `After-tax NPV of ${best} (\x24)`, top,
        [m('(P/A, i, n) / (A/G, i, n)', `${q(PA, '', 5)} / ${q(AG, '', 5)}`), m('A: NPV before depreciation / ATDR', `${cur(A.pre)} / ${cur(A.atdr)}`), m('A: after-tax NPV', cur(A.npv)), m('B: NPV before depreciation / ATDR', `${cur(B.pre)} / ${cur(B.atdr)}`), m('B: after-tax NPV', cur(B.npv))],
        `After-tax present worth at ${q(v.i, '%', 4)} over ${v.n} years.`, 'Handbook present worth formulas with after-tax depreciation recovery.', {
          text: top < 0 ? 'NEITHER EARNS THE RATE' : `CHOOSE ALTERNATIVE ${best}`, tone: top < 0 ? 'bad' : 'good',
          checks: [check('Return', top >= 0 ? 'pass' : 'fail', top >= 0 ? `Alternative ${best} earns at least ${q(v.i, '%', 4)} after tax.` : 'Neither alternative earns the minimum rate of return after tax.'), check('Depreciation', 'verify', 'Straight-line depreciation is assumed for the tax saving.')],
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
