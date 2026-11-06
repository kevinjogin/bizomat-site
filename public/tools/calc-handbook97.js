// BIZOMAT MAKEOS calculations from Machinery’s Handbook topics (batch handbook97). SI units are explicit at each boundary.
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
    "narrow-v-belt-rating": (v) => {
      if (!(v.dp <= v.Dp)) return invalid('The small sheave must not be larger than the large sheave.');
      if (!(v.C > (v.Dp - v.dp) / 2)) return invalid('The centre distance is too short for the sheave diameters.');
      const K = { '3VX': [1.1691, 1.5295, 1.5229e-4, 0.1596], '5VX': [3.3038, 7.781, 3.6432e-4, 0.43343], '5V': [3.314, 10.123, 5.8758e-4, 0.46527], '8V': [8.6628, 49.323, 1.5804e-3, 1.1669] }[v.sec];
      const d = v.dp / 25.4, r = v.n / 1000, dr = d * r, hp = dr * (K[0] - K[1] / d - K[2] * dr * dr - K[3] * Math.log10(dr)) + v.KSR * r;
      const kW = hp * 0.7457, kWc = kW * v.kL * v.kA, Pd = v.P * v.SF, arc = deg(2 * Math.acos((v.Dp - v.dp) / (2 * v.C))), vb = PI * v.dp * v.n / 60000, need = kWc > 0 ? Math.ceil(Pd / kWc - 1e-9) : Infinity, ok = kWc > 0 && v.nb >= need;
      return output({ ratio: v.Dp / v.dp, vb, arc, hp, kW, kWc, Pd, need: Number.isFinite(need) ? need : 0 }, 'Rating per belt, corrected (kW)', kWc,
        [m('Speed ratio Dp ÷ dp (for KSR)', q(v.Dp / v.dp, '', 4)), m('Belt speed', q(vb, 'm/s', 4)), m('Arc of contact on the small sheave (for the arc factor)', q(arc, '°', 4)), m('Basic rating per belt', `${q(kW, 'kW', 4)} (${q(hp, 'hp', 4)})`), m('Rating per belt, length and arc corrected', q(kWc, 'kW', 4)), m('Design power', q(Pd, 'kW', 4)), m('Belts needed / fitted', `${Number.isFinite(need) ? need : 'none can carry it'} / ${v.nb}`)],
        'Narrow V-belt power rating.', 'ANSI/RMA IP-22 narrow V-belt rating formula as given in the handbook.', {
          text: !(kWc > 0) ? 'RATING NOT POSITIVE: SHEAVE TOO SMALL OR TOO FAST' : ok ? 'BELTS CARRY THE DESIGN POWER' : 'TOO FEW BELTS', tone: ok ? 'good' : 'bad',
          checks: [check('Number of belts', ok ? 'pass' : 'fail', `${v.nb} fitted carry ${q(v.nb * kWc, 'kW', 4)} against ${q(Pd, 'kW', 4)} design power.`), check('Correction factors', 'verify', `Read KSR for a speed ratio of ${q(v.Dp / v.dp, '', 4)} and the arc factor for ${q(arc, '°', 4)} from the handbook tables.`), check('Minimum sheave', 'verify', 'Check the small sheave against the minimum recommended for the cross section and speed.')],
        });
    },
    "classical-v-belt-rating": (v) => {
      if (!(v.dp <= v.Dp)) return invalid('The small sheave must not be larger than the large sheave.');
      if (!(v.C > (v.Dp - v.dp) / 2)) return invalid('The centre distance is too short for the sheave diameters.');
      const K = { A: [1.004, 1.652, 1.547e-4, 0.2126], AX: [1.462, 2.239, 2.198e-4, 0.4238], B: [1.769, 4.372, 3.081e-4, 0.3658], BX: [2.051, 3.532, 3.097e-4, 0.5735], C: [3.325, 12.07, 5.828e-4, 0.6886], CX: [3.272, 6.655, 5.298e-4, 0.8637], D: [7.16, 43.21, 1.384e-3, 1.454] }[v.sec];
      const d = v.dp / 25.4, r = v.n / 1000, dr = d * r, hp = dr * (K[0] - K[1] / d - K[2] * dr * dr - K[3] * Math.log10(dr)) + K[1] * r * (1 - 1 / v.KSR);
      const kW = hp * 0.7457, kWc = kW * v.kL * v.kA, Pd = v.P * v.SF, arc = deg(2 * Math.acos((v.Dp - v.dp) / (2 * v.C))), vb = PI * v.dp * v.n / 60000, need = kWc > 0 ? Math.ceil(Pd / kWc - 1e-9) : Infinity, ok = kWc > 0 && v.nb >= need;
      return output({ ratio: v.Dp / v.dp, vb, arc, hp, kW, kWc, Pd, need: Number.isFinite(need) ? need : 0 }, 'Rating per belt, corrected (kW)', kWc,
        [m('Speed ratio Dp ÷ dp (for KSR)', q(v.Dp / v.dp, '', 4)), m('Belt speed', q(vb, 'm/s', 4)), m('Arc of contact on the small sheave (for the arc factor)', q(arc, '°', 4)), m('Basic rating per belt', `${q(kW, 'kW', 4)} (${q(hp, 'hp', 4)})`), m('Rating per belt, length and arc corrected', q(kWc, 'kW', 4)), m('Design power', q(Pd, 'kW', 4)), m('Belts needed / fitted', `${Number.isFinite(need) ? need : 'none can carry it'} / ${v.nb}`)],
        'Classical V-belt power rating.', 'ANSI/RMA classical V-belt rating formulas as given in the handbook.', {
          text: !(kWc > 0) ? 'RATING NOT POSITIVE: SHEAVE TOO SMALL OR TOO FAST' : ok ? 'BELTS CARRY THE DESIGN POWER' : 'TOO FEW BELTS', tone: ok ? 'good' : 'bad',
          checks: [check('Number of belts', ok ? 'pass' : 'fail', `${v.nb} fitted carry ${q(v.nb * kWc, 'kW', 4)} against ${q(Pd, 'kW', 4)} design power.`), check('Correction factors', 'verify', `Read KSR for a speed ratio of ${q(v.Dp / v.dp, '', 4)} and the arc factor for ${q(arc, '°', 4)} from the handbook tables.`), check('Minimum sheave', 'verify', 'Check the small sheave against the minimum recommended for the cross section and speed.')],
        });
    },
    "double-v-belt-tension": (v) => {
      if (!(v.d <= v.D)) return invalid('The small sheave must not be larger than the large sheave.');
      if (!(v.C > (v.D - v.d) / 2)) return invalid('The centre distance is too short for the sheave diameters.');
      const K = { AA: [118.5, 318.2, 0.838, 25.76], BB: [186.3, 665.1, 1.269, 39.02], CC: [363.9, 2060, 2.4, 73.77], DD: [783.1, 7790, 5.078, 156.1] }[v.sec];
      const din = v.d / 25.4, Din = v.D / 25.4, r = v.n / 1000, Sk = r * din / 3.82, Pd = v.P * v.SF, hp = Pd / 0.7457, Te = 33 * hp / Sk, TT = Te * v.RR, TS = TT - Te;
      const Tr = (dd) => K[0] - K[1] / dd - K[2] * Sk * Sk - K[3] * Math.log10(Sk), trS = Tr(din), trL = Tr(Din);
      if (!(trS > 0)) return invalid('The allowable tension is not positive for this sheave and speed: the sheave is too small or the belt too fast for the section.');
      const nS = TT / (trS * v.Kf), nL = TT / (trL * v.Kf), need = Math.ceil(Math.max(nS, nL) - 1e-9), ok = v.nb >= need, lbf = 4.4482216;
      const arc = deg(2 * Math.acos((v.D - v.d) / (2 * v.C)));
      return output({ S: Sk, vb: Sk * 1000 * 0.00508, arc, Te: Te * lbf, TT: TT * lbf, TS: TS * lbf, TrS: trS * lbf, TrL: trL * lbf, need, Pd }, 'Belts needed', need,
        [m('Belt speed', `${q(Sk * 1000 * 0.00508, 'm/s', 4)} (S = ${q(Sk, '', 4)} thousand ft/min)`), m('Arc of contact on the small sheave (for R ÷ (R − 1))', q(arc, '°', 4)), m('Design power', q(Pd, 'kW', 4)), m('Effective pull Te', q(Te * lbf, 'N', 4)), m('Tight / slack side tension', `${q(TT * lbf, 'N', 4)} / ${q(TS * lbf, 'N', 4)}`), m('Allowable tight side tension per belt: small / large sheave', `${q(trS * lbf, 'N', 4)} / ${q(trL * lbf, 'N', 4)}`), m('Belts needed on small / large sheave', `${q(nS, '', 3)} / ${q(nL, '', 3)} → ${need}`)],
        'Double V-belt drive by allowable tight side tension.', 'ANSI/RMA IP-21 double V-belt tension method as given in the handbook.', {
          text: ok ? 'BELTS CARRY THE DESIGN POWER' : 'TOO FEW BELTS', tone: ok ? 'good' : 'bad',
          checks: [check('Number of belts', ok ? 'pass' : 'fail', `${v.nb} fitted against ${need} needed.`), check('Factors', 'verify', `Read R ÷ (R − 1) for an arc of ${q(arc, '°', 4)} and Kf for the effective length ÷ number of sheaves from the handbook tables.`)],
        });
    },
    "light-duty-v-belt-rating": (v) => {
      const K = { '3L': [0.2164, 0.2324, 0.0001396], '4L': [0.4666, 0.7231, 0.0002286], '5L': [0.7748, 1.727, 0.0003641] }[v.sec], dmm = v.d0 - v.twoA;
      if (!(dmm > 0)) return invalid('The differential 2a must be smaller than the outside diameter.');
      const d = dmm / 25.4, r = v.n / 1000, hp = r * (K[0] * d ** 0.91 / r ** 0.09 - K[1] - K[2] * r * r * d ** 3), kW = hp * 0.7457, kWc = kW / v.cf, ok = kWc >= v.P, vb = PI * dmm * v.n / 60000;
      return output({ dmm, vb, hp, kW, kWc }, 'Corrected rating (kW)', kWc,
        [m('Rating diameter d0 − 2a', q(dmm, 'mm', 4)), m('Belt speed', q(vb, 'm/s', 4)), m('Rating of the belt', `${q(kW, 'kW', 4)} (${q(hp, 'hp', 4)})`), m('Corrected by the combined factor', q(kWc, 'kW', 4)), m('Power to carry', q(v.P, 'kW', 4))],
        'Light duty V-belt power rating.', 'ANSI/RMA IP-23 light duty V-belt rating formulas as given in the handbook.', {
          text: !(kWc > 0) ? 'RATING NOT POSITIVE: SHEAVE TOO SMALL OR TOO FAST' : ok ? 'ONE BELT CARRIES THE LOAD' : 'LOAD ABOVE THE BELT RATING', tone: ok ? 'good' : 'bad',
          checks: [check('Belt rating', ok ? 'pass' : 'fail', `${q(kWc, 'kW', 4)} against ${q(v.P, 'kW', 4)} to carry.`), check('Factors', 'verify', 'Read 2a for the section and the combined correction factor for the driven machine and speed ratio from the handbook tables.')],
        });
    },
    "v-ribbed-belt-rating": (v) => {
      if (!(v.dp <= v.Dp)) return invalid('The small sheave must not be larger than the large sheave.');
      if (!(v.C > (v.Dp - v.dp) / 2)) return invalid('The centre distance is too short for the sheave diameters.');
      const K = { J: [0.124, 0.08663, 0.2318e-4], L: [0.5761, 0.8987, 1.018e-4], M: [1.975, 6.597, 3.922e-4] }[v.sec];
      const d = v.dp / 25.4, r = v.n / 1000, dr = d * r, hp = dr * (K[0] / dr ** 0.09 - K[1] / d - K[2] * dr * dr) + K[1] * r * (1 - 1 / v.KSR);
      const kW = hp * 0.7457, kWc = kW * v.kL * v.kA, Pd = v.P * v.SF, arc = deg(2 * Math.acos((v.Dp - v.dp) / (2 * v.C))), vb = PI * v.dp * v.n / 60000, need = kWc > 0 ? Math.ceil(Pd / kWc - 1e-9) : Infinity, ok = kWc > 0 && v.nr >= need;
      return output({ ratio: v.Dp / v.dp, dc: (v.Dp - v.dp) / v.C, vb, arc, hp, kW, kWc, Pd, need: Number.isFinite(need) ? need : 0 }, 'Rating per rib, corrected (kW)', kWc,
        [m('Speed ratio Dp ÷ dp (for KSR)', q(v.Dp / v.dp, '', 4)), m('(D − d) ÷ C and arc of contact (for the arc factor)', `${q((v.Dp - v.dp) / v.C, '', 3)} / ${q(arc, '°', 4)}`), m('Belt speed', q(vb, 'm/s', 4)), m('Basic rating per rib', `${q(kW, 'kW', 4)} (${q(hp, 'hp', 4)})`), m('Rating per rib, length and arc corrected', q(kWc, 'kW', 4)), m('Design power', q(Pd, 'kW', 4)), m('Ribs needed / fitted', `${Number.isFinite(need) ? need : 'none can carry it'} / ${v.nr}`)],
        'V-ribbed belt power rating.', 'ANSI/RMA IP-26 V-ribbed belt rating formulas as given in the handbook.', {
          text: !(kWc > 0) ? 'RATING NOT POSITIVE: SHEAVE TOO SMALL OR TOO FAST' : ok ? 'RIBS CARRY THE DESIGN POWER' : 'TOO FEW RIBS', tone: ok ? 'good' : 'bad',
          checks: [check('Number of ribs', ok ? 'pass' : 'fail', `${v.nr} ribs carry ${q(v.nr * kWc, 'kW', 4)} against ${q(Pd, 'kW', 4)} design power.`), check('Correction factors', 'verify', `Read KSR for a speed ratio of ${q(v.Dp / v.dp, '', 4)} and the arc factor for (D − d) ÷ C = ${q((v.Dp - v.dp) / v.C, '', 3)} from the handbook tables.`)],
        });
    },
    "variable-speed-belt-drive": (v) => {
      if (!(v.PDmin < v.PDmax)) return invalid('The smallest pitch diameter must be less than the largest.');
      if (v.mode === 'dual' && !(v.DNmin < v.DNmax)) return invalid('The driven sheave’s smallest pitch diameter must be less than its largest.');
      const K = { '1422V': [0.4907, 0.8378, 0.000337, 0.8378], '1922V': [0.8502, 1.453, 0.000538, 1.453], '2322V': [1.189, 2.356, 0.000777, 2.356], '1926V': [1.046, 1.833, 0.000589, 1.833], '2926V': [1.769, 4.189, 0.001059, 4.189], '3226V': [2.073, 5.236, 0.001217, 5.236], '2530V': [2.395, 6.912, 0.001148, 6.912], '3230V': [2.806, 7.854, 0.00152, 7.854], '4430V': [3.454, 7.854, 0.002196, 9.818], '4036V': [3.566, 9.687, 0.00206, 9.687], '4436V': [4.041, 11.519, 0.002297, 11.519], '4836V': [4.564, 13.614, 0.002634, 13.614] }[v.sec];
      const d = v.dp / 25.4, r = v.n / 1000, dr = d * r, hp = dr * (K[0] * dr ** -0.09 - K[1] / d - K[2] * dr * dr) + K[3] * r * (1 - 1 / v.KSR);
      const kW = hp * 0.7457, kWc = kW * v.kL * v.kA, Pd = v.P * v.SF, need = kWc > 0 ? Math.ceil(Pd / kWc - 1e-9) : Infinity, okB = kWc > 0 && v.nb >= need;
      const sv = v.mode === 'dual' ? (v.PDmax * v.DNmax) / (v.PDmin * v.DNmin) : v.PDmax / v.PDmin, rim = PI * v.Do * v.nv / 60000, okR = rim <= v.vmax;
      const text = !(kWc > 0) ? 'RATING NOT POSITIVE: SHEAVE TOO SMALL OR TOO FAST' : !okB ? 'TOO FEW BELTS' : !okR ? 'RIM SPEED ABOVE THE SHEAVE LIMIT' : 'DRIVE CARRIES THE POWER';
      return output({ sv, hp, kW, kWc, Pd, need: Number.isFinite(need) ? need : 0, rim }, 'Speed variation', sv,
        [m('Speed variation', `${q(sv, '', 4)} : 1`), m('Basic rating per belt at dp', `${q(kW, 'kW', 4)} (${q(hp, 'hp', 4)})`), m('Rating per belt, length and arc corrected', q(kWc, 'kW', 4)), m('Design power', q(Pd, 'kW', 4)), m('Belts needed / fitted', `${Number.isFinite(need) ? need : 'none can carry it'} / ${v.nb}`), m('Rim speed of the variable sheave', q(rim, 'm/s', 4))],
        'Variable-speed belt drive.', 'ANSI/RMA IP-25 variable-speed belt rules and rating formulas as given in the handbook.', {
          text, tone: text === 'DRIVE CARRIES THE POWER' ? 'good' : 'bad',
          checks: [check('Number of belts', okB ? 'pass' : 'fail', `${v.nb} fitted carry ${q(v.nb * kWc, 'kW', 4)} against ${q(Pd, 'kW', 4)} design power.`), check('Rim speed', okR ? 'pass' : 'fail', `${q(rim, 'm/s', 4)} against ${q(v.vmax, 'm/s', 4)} allowed.`), check('Pitch diameter range', 'verify', 'Check that the section can reach the pitch diameter change needed (2av in the handbook table).')],
        });
    },
    "synchronous-belt-rating": (v) => {
      const pitch = { MXL: 0.08, XL: 0.2, L: 0.375, H: 0.5, XH: 0.875, XXH: 1.25 }[v.sec], d = v.z * pitch / PI, r = v.n / 1000, dr = d * r, w = v.n * 2 * PI / 60;
      if (!(v.mesh <= v.z)) return invalid('The teeth in mesh cannot exceed the teeth on the pulley.');
      let hp, Qr = 0;
      if (v.sec === 'MXL') { const c = { '0.12': [1.13, 1.38e-3], '0.19': [1.88, 2.3e-3], '0.25': [2.63, 3.21e-3] }[v.mxlw]; Qr = d * (c[0] - c[1] * d * d); hp = Qr * 0.112985 * w / 745.7; }
      else { const c = { XL: [0.0916, 7.07e-5], L: [0.436, 3.01e-4], H: [3.73, 1.41e-3], XH: [7.21, 4.68e-3], XXH: [11.4, 7.81e-3] }[v.sec]; hp = dr * (c[0] - c[1] * dr * dr); }
      const Kz = v.mesh >= 6 ? 1 : 0.2 * (v.mesh - 1), kW = hp * 0.7457, kWc = kW * Kz, wfUse = v.sec === 'MXL' ? 1 : v.wf, cap = kWc * wfUse, Pd = v.P * v.SF, wfReq = kWc > 0 ? Pd / kWc : Infinity;
      const vb = PI * d * v.n * 0.0254 / 60, okV = vb <= 33.02 + 1e-9, ok = kWc > 0 && cap >= Pd;
      const text = !(kWc > 0) ? 'RATING NOT POSITIVE: PULLEY TOO SMALL OR TOO FAST' : !okV ? 'BELT SPEED ABOVE THE RATING LIMIT' : ok ? 'BELT CARRIES THE DESIGN POWER' : 'BELT TOO NARROW FOR THE POWER';
      return output({ d: d * 25.4, vb, Qr: Qr * 0.112985, hp, kW, Kz, kWc, cap, Pd, wfReq: Number.isFinite(wfReq) ? wfReq : 0 }, 'Corrected rating (kW)', kWc,
        [m('Pitch diameter of the small pulley', q(d * 25.4, 'mm', 4)), m('Belt speed', `${q(vb, 'm/s', 4)} (limit 33 m/s)`), ...(v.sec === 'MXL' ? [m(`Torque rating, ${v.mxlw} in belt`, `${q(Qr * 0.112985, 'N·m', 4)} (${q(Qr, 'lbf·in', 4)})`)] : []), m(v.sec === 'MXL' ? 'Power rating at this speed' : 'Power rating of the widest standard belt', `${q(kW, 'kW', 4)} (${q(hp, 'hp', 4)})`), m('Teeth in mesh factor Kz', q(Kz, '', 3)), m('Corrected rating', q(kWc, 'kW', 4)), m('Design power / capacity of the belt chosen', `${q(Pd, 'kW', 4)} / ${q(cap, 'kW', 4)}`), m('Width factor needed', Number.isFinite(wfReq) ? q(wfReq, '', 3) : 'Not possible')],
        'Synchronous belt rating.', 'ANSI/RMA IP-24 synchronous belt torque and power rating formulas as given in the handbook.', {
          text, tone: text === 'BELT CARRIES THE DESIGN POWER' ? 'good' : 'bad',
          checks: [check('Belt width', ok ? 'pass' : 'fail', `Capacity ${q(cap, 'kW', 4)} against ${q(Pd, 'kW', 4)} design power; width factor needed ${Number.isFinite(wfReq) ? q(wfReq, '', 3) : 'not possible'}.`), check('Belt speed', okV ? 'pass' : 'fail', `${q(vb, 'm/s', 4)} against the 33 m/s (6500 ft/min) limit of the ratings.`), check('Width against pulley', 'verify', 'Keep the belt width no greater than the small pulley diameter.')],
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
