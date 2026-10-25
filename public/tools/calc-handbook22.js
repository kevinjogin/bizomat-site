// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook22). SI units are explicit at each boundary.
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
    "retaining-ring-thrust": (v) => {
      const frac = v.ring === 'stamped' ? v.contact / 100 : 1, Ps = PI * v.D * v.t * v.Ss / v.K, PG = PI * v.D * v.dg * v.Sy / v.K * frac, Pallow = Math.min(Ps, PG), Pn = v.P * 1000, Y = v.K * Pn / (PI * v.D * v.Sc), ok = Pn <= Pallow;
      return output({ Ps, PG, Pallow, Y }, 'Allowable thrust (kN)', Pallow / 1000,
        [m('Ring shear capacity', q(Ps / 1000, 'kN', 2)), m('Groove yield capacity', q(PG / 1000, 'kN', 2)), m('Allowable thrust', q(Pallow / 1000, 'kN', 2)), m('Governs', Ps <= PG ? 'Ring shear' : 'Groove yield'), m('Minimum groove distance from end', q(Y, 'mm', 2))],
        'Retaining ring thrust capacity.', 'Handbook ring and groove formulas.', {
          text: ok ? 'THRUST WITHIN CAPACITY' : 'THRUST EXCEEDS CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Thrust', ok ? 'pass' : 'fail', `${q(v.P, 'kN', 2)} against ${q(Pallow / 1000, 'kN', 2)}.`), check('Groove position', 'verify', `Keep the groove at least ${q(Y, 'mm', 2)} from the end (and usually 2–3 groove depths).`)],
        });
    },
    "iso-cleanliness-code": (v) => {
      const per = [v.c4, v.c6, v.c14].map((c) => c / v.vol), code = per.map((c) => (c <= 0.01 ? 0 : Math.ceil(Math.log2(c / 0.01) - 1e-12)));
      if (per[0] < per[1] || per[1] < per[2]) return invalid('Counts must not increase with particle size (≥4 µm includes the larger particles).');
      const tgt = [v.t4, v.t6, v.t14], ok = code.every((c, i) => c <= tgt[i]), str = code.join('/');
      return output({ R4: code[0], R6: code[1], R14: code[2], code: str }, 'Range number at 4 µm', code[0],
        [m('ISO 4406 code', str), m('≥ 4 µm per mL', q(per[0], '', 2)), m('≥ 6 µm per mL', q(per[1], '', 2)), m('≥ 14 µm per mL', q(per[2], '', 2)), m('Target code', tgt.join('/'))],
        'ISO 4406 cleanliness code.', 'Counts per ISO 11171.', {
          text: ok ? 'MEETS TARGET' : 'DIRTIER THAN TARGET', tone: ok ? 'good' : 'bad',
          checks: code.map((c, i) => check(`${['4', '6', '14'][i]} µm`, c <= tgt[i] ? 'pass' : 'fail', `Range ${c} against a target of ${tgt[i]}.`)),
        });
    },
    "filter-beta-ratio": (v) => {
      let beta, down;
      if (v.mode === 'counts') { if (v.down <= 0) return invalid('Enter a downstream count above zero.'); if (v.down > v.up) return invalid('The downstream count exceeds the upstream count.'); beta = v.up / v.down; down = v.down; }
      else { beta = v.beta; down = v.up / beta; }
      const eff = (1 - 1 / beta) * 100;
      return output({ beta, eff, down }, 'Beta ratio', beta,
        [m('Beta ratio', q(beta, '', 2)), m('Capture efficiency', q(eff, '%', 3)), m('Particles passing per mL', q(down, '', 3)), m('Particles captured per mL', q(v.up - down, '', 3))],
        'Filter beta ratio.', 'Single particle size.');
    },
    "inverse-time-feed": (v) => {
      const arc = PI * v.radius * v.angle / 180, path = v.mode === 'linear' ? v.dist : v.mode === 'rotary' ? arc : Math.hypot(v.dist, arc);
      if (path <= 0) return invalid('The move has no length at the cutter.');
      const t = path / v.feed, F = 1 / t;
      return output({ path, t, F }, 'Inverse-time F value', F,
        [m('Inverse-time F value', q(F, '', 4)), m('Block time', q(t * 60, 's', 3)), m('Path length at the cutter', q(path, 'mm', 3)), m('Equivalent rotary feed', q(v.angle / t, '°/min', 1))],
        'Inverse time feed for the block.', 'Constant feed through the block.');
    },
    "screw-machine-stock": (v) => {
      const per = v.L + v.W + v.face, usable = v.bar - v.rem; if (usable < per) return invalid('The usable bar length is shorter than one part.');
      const perBar = Math.floor(usable / per), bars = Math.ceil(v.qty / perBar), stockM = bars * v.bar / 1000, hb = (v.L + v.W) / 25.4 * 84 * 0.3048;
      return output({ perBar, bars, stockM, hb, mass: stockM * v.kgm }, 'Bars to order', bars,
        [m('Length per part', q(per, 'mm', 2)), m('Parts per bar', q(perBar, '', 0)), m('Bars to order', q(bars, '', 0)), m('Stock length', q(stockM, 'm', 1)), m('Stock mass', q(stockM * v.kgm, 'kg', 1)), m('Handbook estimate per 1000 parts', q(hb, 'm', 2)), m('Material per part', q(stockM * v.kgm / v.qty, 'kg', 4))],
        'Bar stock requirement.', 'Whole parts per bar.');
    },
    "shearing-blade-force": (v) => {
      const F = v.blades === 'parallel' ? v.tau * v.b * v.T : v.n * v.k * v.UTS * v.eps * v.T * v.T / Math.tan(rad(v.alpha)), FM = 1.3 * F, ok = FM / 1000 <= v.cap;
      return output({ F, FM }, 'Machine force (kN)', FM / 1000,
        [m('Shearing force', q(F / 1000, 'kN', 2)), m('Machine force (× 1.3)', q(FM / 1000, 'kN', 2)), m('Utilisation of capacity', q(FM / 1000 / v.cap * 100, '%', 0))],
        'Shearing force.', 'Handbook approximate formulas.', {
          text: ok ? 'WITHIN CAPACITY' : 'EXCEEDS CAPACITY', tone: ok ? 'good' : 'bad',
          checks: [check('Machine capacity', ok ? 'pass' : 'fail', `${q(FM / 1000, 'kN', 1)} against ${q(v.cap, 'kN', 0)}.`)],
        });
    },
    "agma-pitting-power": (v) => {
      if (v.kind === 'int' && v.mg <= 1) return invalid('Internal gear sets need a ratio above 1.');
      const ph = rad(v.phi), I = v.Imode === 'entered' ? v.I : Math.cos(ph) * Math.sin(ph) / 2 * v.mg / (v.kind === 'ext' ? v.mg + 1 : v.mg - 1);
      const Pac = v.np * v.F / 1.91e7 * I * v.Cv / (v.Cs * v.Cm * v.Cf * v.Ca) * (v.d * v.Sac * v.CL * v.CH / (v.Cp * v.CT * v.CR)) ** 2, sf = v.P > 0 ? Pac / v.P : Infinity, ok = Pac >= v.P;
      return output({ I, Pac, sf: Number.isFinite(sf) ? sf : 0 }, 'Allowable power (kW)', Pac,
        [m('Geometry factor I', q(I, '', 5)), m('Allowable power for pitting', q(Pac, 'kW', 2)), m('Allowable ÷ required', v.P > 0 ? q(sf, '', 2) : 'No power entered'), m('Pinion torque at the rating', q(Pac * 1000 / (2 * PI * v.np / 60), 'N·m', 1))],
        'AGMA pitting resistance power rating.', 'Factors and allowables from the standard.', {
          text: ok ? 'PITTING RATING ADEQUATE' : 'PITTING RATING EXCEEDED', tone: ok ? 'good' : 'bad',
          checks: [check('Pitting power', ok ? 'pass' : 'fail', `${q(Pac, 'kW', 1)} allowable against ${q(v.P, 'kW', 1)}.`), check('Bending', 'verify', 'Check tooth bending strength separately.')],
        });
    },
    "grinding-cycle-time": (v) => {
      const passes = Math.ceil(v.stock / v.feed - 1e-9) + v.spark;
      if (v.type === 'surface') {
        const strokes = Math.ceil(v.B / v.cf - 1e-9), tStroke = (v.L + 2 * v.over) / (v.vt * 1000), minutes = passes * strokes * tStroke;
        return output({ passes, strokes, minutes }, 'Grinding time (min)', minutes,
          [m('Passes (incl. spark-out)', q(passes, '', 0)), m('Strokes per pass', q(strokes, '', 0)), m('Time per stroke', q(tStroke * 60, 's', 2)), m('Grinding time', q(minutes, 'min', 2))],
          'Surface grinding time.', 'Reciprocating table, constant feeds.');
      }
      if (v.type === 'traverse') {
        const rate = v.frac / 100 * v.bw * v.nw, tPass = (v.Lw + v.bw) / rate, minutes = passes * tPass;
        return output({ passes, rate, minutes }, 'Grinding time (min)', minutes,
          [m('Passes (incl. spark-out)', q(passes, '', 0)), m('Traverse rate', q(rate, 'mm/min', 0)), m('Time per pass', q(tPass * 60, 's', 2)), m('Grinding time', q(minutes, 'min', 2))],
          'Cylindrical traverse grinding time.', 'Constant traverse and infeed.');
      }
      const minutes = v.stock / v.vf + v.dwell / 60;
      return output({ minutes }, 'Grinding time (min)', minutes,
        [m('Plunge time', q(v.stock / v.vf, 'min', 3)), m('Dwell', q(v.dwell, 's', 0)), m('Grinding time', q(minutes, 'min', 3))],
        'Plunge grinding time.', 'Constant infeed.');
    },
    "pattern-shrinkage": (v) => {
      const cast = v.Lp + v.mach * v.faces, pattern = cast * (1 + v.shrink / 1000), W = Math.max(0, v.Wp * v.rhoM / v.rhoP - v.cores / 1000 * v.rhoM);
      return output({ cast, pattern, W }, 'Pattern dimension (mm)', pattern,
        [m('Casting dimension', q(cast, 'mm', 2)), m('Pattern dimension', q(pattern, 'mm', 2)), m('Shrinkage added', q(pattern - cast, 'mm', 2)), m('Approximate casting weight', q(W, 'kg', 2))],
        'Pattern allowances and casting weight.', 'Uniform shrinkage; solid pattern.');
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
