// KEVOS® MAKEOS calculations for polymer thermodynamics (batch polymers). SI units are explicit at each boundary.
// Methods follow Klenin (1999) and the original papers cited in the guides; no book tables or data are reproduced.
// Material properties, interaction parameters, constants of the polymer and acceptance limits are always entered by the user.
(() => {
  const PI = Math.PI;
  const R = 8.31446261815324; // molar gas constant, J/(mol·K) (exact SI value)
  const KB = 1.380649e-23; // Boltzmann constant, J/K (exact SI value)
  const ZERO_C = 273.15;
  const rad = (degrees) => degrees * PI / 180;
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
      return invalid('The calculation is outside the supported numeric range. Review the inputs and units.');
    }
    const { checks = [], actions = [], ...rest } = extra;
    return result('CALCULATED', 'warn', summary, metrics, limit, {
      primary: primary(label, value, 'engineering'), values,
      checks: [...checks, check('Model and application', 'verify', limit)],
      actions: [...actions, 'Check the method, input sources and limitations below before using this result.'],
      ...rest,
    });
  }

  // Flory–Huggins binary on a lattice of component-1 cells: component 1 has length 1, the polymer length N.
  const spinodal = (p, N) => 0.5 * (1 / (N * p) + 1 / (1 - p));
  /**
   * χ at which composition a lies on the binodal, with its coexisting partner b = exp(u). Equal chemical potentials of
   * both components are each linear in χ, so the partner is the root of χ(solvent) − χ(polymer) on the far side of the
   * critical fraction; u = ln b lets the partner of a concentrated phase be vanishingly small without underflow.
   */
  function binodal(a, N) {
    const pc = 1 / (1 + Math.sqrt(N));
    if (Math.abs(a - pc) <= 1e-7 * pc) return { chi: 0.5 * (1 + 1 / Math.sqrt(N)) ** 2, b: pc };
    const pair = (u) => {
      const b = Math.exp(u), db = (b - a) * (b + a);
      const c1 = -(Math.log1p(-b) - Math.log1p(-a) + (1 - 1 / N) * (b - a)) / db;
      const c2 = -(u - Math.log(a) + (N - 1) * (b - a)) / (N * (b - a) * (b + a - 2));
      return [c1, c2];
    };
    const us = [];
    if (a < pc) {
      for (let k = 600; k >= 0; k--) us.push(Math.log(pc + (1 - pc) * 10 ** (-12 * k / 600) * (1 - 1e-15)));
    } else {
      for (let k = 0; k <= 600; k++) us.push(Math.log(pc - pc * 10 ** (-12 * (600 - k) / 600) * (1 - 1e-15)));
      const span = 1000 + 20 * N;
      for (let k = 1; k <= 1200; k++) us.push(Math.log(pc * 1e-12) - span * (k / 1200) ** 2);
    }
    const g = (u) => { const [c1, c2] = pair(u); return c1 - c2; };
    let pu = null, pg = null;
    for (const u of us) {
      const gv = g(u);
      if (!Number.isFinite(gv)) continue;
      if (pu !== null && Math.sign(gv) !== Math.sign(pg)) {
        let lo = pu, hi = u, flo = pg;
        for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, fm = g(mid); if (Math.sign(fm) === Math.sign(flo)) { lo = mid; flo = fm; } else hi = mid; }
        const um = (lo + hi) / 2;
        return { chi: pair(um)[0], b: Math.exp(um) };
      }
      pu = u; pg = gv;
    }
    return null;
  }

  const methods = {
    "polymer-solution-phase-check": (v) => {
      const V1 = v.M1 / v.rho1, V2 = v.M2 / v.rho2, Nw = V2 / V1, Nz = Nw * v.PDz;
      if (Nw < 1e-3 || Nw > 1e7) return invalid('The polymer’s molar volume must lie between 0.001 and 10 million times that of component 1: check the molar masses and densities.');
      const p = v.phi / 100, A = V1 * (v.d1 - v.d2) ** 2 / R, chi = v.chiS + A / (v.T + ZERO_C);
      const chis = spinodal(p, Nw), s = Math.sqrt(Nz) / Nw, pc = s / (1 + s), chic = 0.5 * (1 + 1 / Math.sqrt(Nz)) * (1 + Math.sqrt(Nz) / Nw);
      const bn = binodal(p, Nw);
      if (!bn) return invalid('No binodal was found for this chain length and polymer fraction: check the molar masses and the polymer fraction.');
      const chib = bn.chi, temp = (x) => (A > 0 && x > v.chiS ? A / (x - v.chiS) - ZERO_C : null);
      const Tb = temp(chib), Ts = temp(chis), Tc = temp(chic);
      const none = A > 0 ? 'none: two phases at every temperature' : 'none: χ does not change with temperature';
      const tq = (x) => (x === null ? none : q(x, '°C', 1)), tcell = (x) => (x === null ? '—' : q(x, '°C', 1));
      const unstable = chi >= chis - 1e-12, meta = !unstable && chi >= chib - 1e-12, margin = Tb === null ? null : v.T - Tb;
      const small = !unstable && !meta && margin !== null && margin < v.dTm - 1e-9;
      const fr = [...new Set([0.5, 1, 2, 5, 10, 20, 30, 50, 70, v.phi, Math.round(pc * 1e6) / 1e4])].filter((x) => x >= 0.001 && x <= 99).sort((x, y) => x - y);
      const rows = fr.map((x) => { const b = binodal(x / 100, Nw), cs = spinodal(x / 100, Nw); return [q(x, '%', 4), b ? q(b.chi, '', 4) : '—', q(cs, '', 4), b ? tcell(temp(b.chi)) : '—', tcell(temp(cs))]; });
      const st = unstable ? ['UNSTABLE: SEPARATES SPONTANEOUSLY', 'bad'] : meta ? ['METASTABLE: CAN SEPARATE', 'bad'] : small ? ['ONE PHASE, SMALL MARGIN', 'warn'] : ['ONE PHASE', 'good'];
      const marginCheck = unstable || meta ? [] : [A === 0 || Tb === null
        ? check('Temperature margin', 'pass', 'With equal solubility parameters χ does not change with temperature, so the mixture stays one phase at any temperature in this model.')
        : check('Temperature margin', small ? 'warn' : 'pass', `${q(margin, 'K', 1)} above the estimated cloud temperature of ${q(Tb, '°C', 1)}, against the ${q(v.dTm, 'K', 1)} required${small ? ': raise the temperature, lower the polymer fraction or choose a closer solvent.' : '.'}`)];
      return output({ V1, Nw, Nz, A, chi, chis, pc, chic, chib, phib: bn.b, Tb, Ts, Tc, margin, ratio: chi / chib }, 'Stability ratio χ ÷ χ at the binodal', chi / chib,
        [m('Chain length of the polymer, weight / z-average (component-1 volumes)', `${q(Nw, '', 1)} / ${q(Nz, '', 1)}`), m('Interaction parameter χ at the temperature', q(chi, '', 4)), m('χ at the binodal / at the spinodal for this fraction', `${q(chib, '', 4)} / ${q(chis, '', 4)}`), m('Critical polymer fraction / critical χ', `${q(pc * 100, '%', 3)} / ${q(chic, '', 4)}`), m('Estimated cloud temperature at this fraction', tq(Tb)), m('Spinodal temperature at this fraction / temperature at the critical point', `${tcell(Ts)} / ${tcell(Tc)}`), m('Margin above the cloud temperature', margin === null ? '—' : q(margin, 'K', 1))],
        'Flory–Huggins phase check of a polymer solution or blend.', 'Mean-field lattice model with χ independent of concentration; upper critical (UCST) behaviour only.', {
          text: st[0], tone: st[1], table: tbl('Phase boundary: χ and temperature against polymer fraction', ['Polymer fraction', 'χ at the binodal', 'χ at the spinodal', 'Cloud temperature', 'Spinodal temperature'], rows),
          checks: [check('Against the binodal (cloud point)', chi < chib - 1e-12 ? 'pass' : 'fail', `χ = ${q(chi, '', 4)} against ${q(chib, '', 4)} at the binodal${chi < chib - 1e-12 ? ': one stable phase.' : ': the mixture lies inside the two-phase region.'}`), check('Against the spinodal', unstable ? 'fail' : 'pass', unstable ? `χ is at or above the spinodal value ${q(chis, '', 4)}: the mixture separates spontaneously.` : `χ is below the spinodal value ${q(chis, '', 4)}.`), ...marginCheck, check('Polydispersity', 'verify', 'The spinodal uses Mw and the critical point Mw and Mz; the binodal is for a uniform chain of length Mw. A real cloud point depends on the whole molar-mass distribution: confirm it by cooling a sample and watching for turbidity.'), check('Interaction parameter', 'verify', 'χ from solubility parameters is an estimate and real χ also changes with concentration; use a χ measured for this pair where one exists.')],
        });
    },
    "hansen-solvent-compatibility": (v) => {
      const x = v.xB / 100, P = [v.pD, v.pP, v.pH], A = [v.aD, v.aP, v.aH], B = [v.bD, v.bP, v.bH], w = [4, 1, 1];
      const mix = (s) => A.map((a, i) => a * (1 - s) + B[i] * s), ra = (L) => Math.sqrt(L.reduce((sum, d, i) => sum + w[i] * (d - P[i]) ** 2, 0));
      const L = mix(x), Ra = ra(L), RED = Ra / v.R0, dt = Math.hypot(...L), dtP = Math.hypot(...P);
      let nume = 0, den = 0;
      for (let i = 0; i < 3; i++) { nume += w[i] * (A[i] - P[i]) * (B[i] - A[i]); den += w[i] * (B[i] - A[i]) ** 2; }
      const best = den > 0 ? Math.min(1, Math.max(0, -nume / den)) : null, Rabest = best === null ? Ra : ra(mix(best));
      const lo = 1 - v.band, hi = 1 + v.band, inside = RED < lo - 1e-12, outside = RED >= hi - 1e-12, resist = v.purpose === 'resist';
      const st = resist
        ? (outside ? ['LIKELY TO RESIST', 'good', 'pass'] : inside ? ['LIKELY TO DISSOLVE OR SWELL THE PART', 'bad', 'fail'] : ['BORDERLINE: TEST IT', 'warn', 'warn'])
        : (RED <= lo + 1e-12 ? ['LIKELY TO DISSOLVE THE POLYMER', 'good', 'pass'] : RED > hi + 1e-12 ? ['UNLIKELY TO DISSOLVE THE POLYMER', 'bad', 'fail'] : ['BORDERLINE: TEST IT', 'warn', 'warn']);
      const where = RED < 1 ? 'inside' : 'outside';
      return output({ dD: L[0], dP: L[1], dH: L[2], dt, dtP, Ra, RED, best: best === null ? x : best, Rabest }, 'RED = Ra ÷ R₀', RED,
        [m('Liquid parameters δD / δP / δH', `${q(L[0], '', 2)} / ${q(L[1], '', 2)} / ${q(L[2], 'MPa½', 2)}`), m('Total solubility parameter of the liquid / polymer', `${q(dt, '', 2)} / ${q(dtP, 'MPa½', 2)}`), m('Hansen distance Ra', q(Ra, 'MPa½', 3)), m('Relative energy difference RED', q(RED, '', 3)), m('Share of liquid B closest to the polymer', best === null ? 'any (A and B are alike)' : q(best * 100, '%', 1)), m('Ra and RED at that share', `${q(Rabest, 'MPa½', 3)} / ${q(Rabest / v.R0, '', 3)}`)],
        'Hansen solubility parameter screen.', 'Hansen sphere: a screening model, not a measured resistance.', {
          text: st[0], tone: st[1],
          checks: [check('Position against the solubility sphere', st[2], `RED = ${q(RED, '', 3)}, ${where} the sphere (RED = 1); the band is ${q(lo, '', 2)} to ${q(hi, '', 2)}.`), check('Blend of A and B', 'pass', best === null ? 'Liquids A and B have the same parameters; blending does not move the liquid.' : `The blend closest to the polymer is ${q(best * 100, '%', 1)} of liquid B, with RED ${q(Rabest / v.R0, '', 3)}.`), check('Immersion test', 'verify', 'Confirm with an immersion test of the actual material at the service temperature and time: ISO 175 for plastics, ISO 1817 for rubber.'), check('Stress cracking and crystallinity', 'verify', 'A liquid that does not dissolve a polymer can still cause environmental stress cracking under strain, and crystalline polymers resist liquids that dissolve their amorphous form; the sphere does not predict either.')],
        });
    },
    "rubber-swelling-crosslink-density": (v) => {
      if (v.ms <= v.md) return invalid('The swollen mass must be greater than the dried mass.');
      if (v.md > v.m0) return invalid('The dried mass is above the initial mass: dry the specimen to constant mass before weighing.');
      if (v.numin > v.numax) return invalid('The lowest acceptable crosslink density must not exceed the highest.');
      const Vr = v.md * v.wR / 100 / v.rhoR, Vs = (v.ms - v.md) / v.rhoS, v2 = Vr / (Vr + Vs), TK = v.T + ZERO_C;
      const nuAt = (chi) => { const top = Math.log1p(-v2) + v2 + chi * v2 * v2; return top < 0 ? -top / (v.V1 * (Math.cbrt(v2) - 2 * v2 / v.f)) * 1e6 : NaN; };
      const nu = nuAt(v.chi);
      if (!(nu > 0)) return invalid('With this interaction parameter the mixing term does not favour swelling (ln(1 − v₂) + v₂ + χv₂² is not negative): χ is too high for the measured swelling.');
      const Mc = v.rhoR * 1e6 / nu, G = nu * R * TK, E = 3 * G, V0 = v.m0 / v.rhoC, dV = 100 * (v.md / v.rhoC + Vs - V0) / V0, dm = 100 * (v.ms - v.m0) / v.m0, ext = 100 * (v.m0 - v.md) / v.m0;
      const nuLo = nuAt(Math.max(0, v.chi - 0.05)), nuHi = nuAt(v.chi + 0.05), ok = nu >= v.numin - 1e-9 && nu <= v.numax + 1e-9;
      const band = `${q(nuLo, '', 1)} to ${Number.isFinite(nuHi) ? q(nuHi, 'mol/m³', 1) : 'no solution (χ too high)'}`;
      return output({ Vr, Vs, v2, Q: 1 / v2, nu, Mc, G, E, dV, dm, ext }, 'Crosslink density (mol/m³)', nu,
        [m('Rubber volume fraction in the swollen specimen v₂ / swelling ratio', `${q(v2, '', 4)} / ${q(1 / v2, '', 3)}`), m('Volume change / mass change on swelling', `${q(dV, '', 1)} / ${q(dm, '%', 1)}`), m('Soluble fraction removed', q(ext, '%', 2)), m('Crosslink density ν', q(nu, 'mol/m³', 1)), m('ν with χ 0.05 lower / higher', band), m('Molar mass between crosslinks Mc', q(Mc, 'g/mol', 0)), m('Network shear / Young’s modulus', `${q(G / 1e6, '', 3)} / ${q(E / 1e6, 'MPa', 3)}`)],
        'Rubber swelling test by the Flory–Rehner equation.', 'Affine Flory–Rehner network; unfilled swelling (no filler correction); equilibrium swelling.', {
          text: ok ? 'CROSSLINK DENSITY IN RANGE' : nu < v.numin ? 'CROSSLINK DENSITY BELOW RANGE' : 'CROSSLINK DENSITY ABOVE RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Crosslink density against the range', ok ? 'pass' : 'fail', `${q(nu, 'mol/m³', 1)} against ${q(v.numin, '', 1)} to ${q(v.numax, 'mol/m³', 1)}.`), check('Filler', v.wR < 100 ? 'warn' : 'pass', v.wR < 100 ? 'The rubber volume fraction counts only the rubber, and no Kraus correction is made for filler that restricts swelling: compare only compounds with the same filler loading.' : 'Unfilled compound: no filler correction is needed.'), check('Sensitivity to χ', 'verify', `ν changes to ${band} when χ moves by 0.05: use a χ measured for this rubber and liquid at the test temperature, and keep it fixed between batches.`), check('Swelling equilibrium', 'verify', 'Weigh the swollen specimen at intervals until its mass is steady, blot surface liquid quickly, and dry to constant mass; ASTM D6814 and ISO 1817 describe the practice.')],
        });
    },
    "polymer-intrinsic-viscosity": (v) => {
      if (v.t <= v.t0) return invalid('The solution must flow more slowly than the solvent: check the flow times.');
      if (v.IVmin > v.IVmax) return invalid('The lowest acceptable intrinsic viscosity must not exceed the highest.');
      const er = v.t / v.t0, es = er - 1, l = Math.log(er);
      const sc = Math.sqrt(2 * (es - l)) / v.c, bm = 0.25 * (es + 3 * l) / v.c, hg = (Math.sqrt(1 + 4 * v.kH * es) - 1) / (2 * v.kH * v.c);
      const iv = { sc, bm, hg }[v.method], Mv = (iv / v.K) ** (1 / v.a), all = [sc, bm, hg], spread = 100 * (Math.max(...all) - Math.min(...all)) / iv;
      const ok = iv >= v.IVmin - 1e-12 && iv <= v.IVmax + 1e-12, mv = (x) => q((x / v.K) ** (1 / v.a), '', 0);
      const name = { sc: 'Solomon–Ciuta', bm: 'Billmeyer', hg: 'Huggins' }[v.method];
      return output({ er, es, red: es / v.c, inh: l / v.c, sc, bm, hg, iv, Mv, spread }, 'Intrinsic viscosity (dL/g)', iv,
        [m('Relative / specific viscosity', `${q(er, '', 4)} / ${q(es, '', 4)}`), m('Reduced / inherent viscosity', `${q(es / v.c, '', 4)} / ${q(l / v.c, 'dL/g', 4)}`), m(`Intrinsic viscosity [η] (${name})`, q(iv, 'dL/g', 4)), m('Viscosity-average molar mass Mv', q(Mv, 'g/mol', 0)), m('Spread of the three single-point relations', q(spread, '%', 2))],
        'Single-point intrinsic viscosity.', 'One dilute concentration; equal solution and solvent densities; no kinetic-energy correction.', {
          text: ok ? 'IV WITHIN SPECIFICATION' : 'IV OUTSIDE SPECIFICATION', tone: ok ? 'good' : 'bad',
          table: tbl('Intrinsic viscosity by each single-point relation', ['Relation', '[η] (dL/g)', 'Mv (g/mol)'], [['Solomon–Ciuta', q(sc, '', 4), mv(sc)], ['Billmeyer', q(bm, '', 4), mv(bm)], [`Huggins, kH = ${q(v.kH, '', 3)}`, q(hg, '', 4), mv(hg)]]),
          checks: [check('Intrinsic viscosity against the specification', ok ? 'pass' : 'fail', `${q(iv, 'dL/g', 4)} against ${q(v.IVmin, '', 3)} to ${q(v.IVmax, 'dL/g', 3)}.`), check('Agreement of the single-point relations', 'verify', `The three relations differ by ${q(spread, '%', 2)}; if that is more than your laboratory accepts, measure at several concentrations and extrapolate to zero.`), check('Mark–Houwink constants', 'verify', 'K and a must belong to this polymer, solvent and temperature; Mv is a viscosity average, between the number and weight averages.'), check('Viscometer practice', 'verify', 'Use the same viscometer and bath temperature for solvent and solution and repeat the flow times; ISO 1628-1 sets out the method.')],
        });
    },
    "polymer-melting-point-depression": (v) => {
      const TK0 = v.Tm0 + ZERO_C, k = R / v.dH * v.Vu / v.V1;
      const phiOf = (w) => (w / v.rho1) / (w / v.rho1 + (1 - w) / v.rhoP), inv = (p) => 1 / TK0 + k * (p - v.chi * p * p);
      const phi1 = phiOf(v.w1 / 100), iv = inv(phi1);
      if (!(iv > 0)) return invalid('These inputs give no positive melting temperature: check the heat of fusion, the molar volumes and χ.');
      const Tm = 1 / iv - ZERO_C, dT = v.Tm0 - Tm, melt = v.purpose === 'melt', gap = melt ? v.Tp - Tm : Tm - v.Tp;
      const ok = gap >= v.margin - 1e-9, near = !ok && gap >= -1e-9;
      const rows = [...new Set([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, v.w1])].sort((a, b) => a - b).map((w) => { const p = phiOf(w / 100), y = inv(p); return [q(w, '%', 1), q(p * 100, '%', 1), y > 0 ? q(1 / y - ZERO_C, '°C', 1) : '—']; });
      const st = melt ? (ok ? 'CRYSTALS MELT AT THIS TEMPERATURE' : near ? 'MELTS, SMALL MARGIN' : 'CRYSTALS DO NOT MELT') : (ok ? 'CRYSTALS SURVIVE AT THIS TEMPERATURE' : near ? 'SURVIVES, SMALL MARGIN' : 'CRYSTALS MELT');
      const twoLiquids = v.chi >= 0.5;
      return output({ phi1, Tm, dT, gap }, 'Melting temperature with the diluent (°C)', Tm,
        [m('Diluent volume fraction', q(phi1 * 100, '%', 2)), m('Melting temperature of the pure polymer', q(v.Tm0, '°C', 1)), m('Melting temperature with the diluent', q(Tm, '°C', 1)), m('Depression', q(dT, 'K', 1)), m(melt ? 'Process temperature above the melting temperature' : 'Melting temperature above the service temperature', q(gap, 'K', 1))],
        'Flory melting-point depression by a diluent.', 'Equilibrium melting of chains of high molar mass; diluent excluded from the crystals; χ independent of concentration.', {
          text: st, tone: ok ? 'good' : near ? 'warn' : 'bad',
          table: tbl('Melting temperature against diluent content', ['Diluent by mass', 'Diluent by volume', 'Melting temperature'], rows),
          checks: [check(melt ? 'Process temperature against the melting temperature' : 'Service temperature against the melting temperature', ok ? 'pass' : near ? 'warn' : 'fail', `${q(gap, 'K', 1)} of margin against the ${q(v.margin, 'K', 1)} required${ok ? '.' : melt ? ': raise the temperature or add more diluent.' : ': lower the temperature or reduce the diluent.'}`), check('Liquid–liquid separation', twoLiquids ? 'warn' : 'pass', twoLiquids ? 'χ is 0.5 or more, the critical value for long chains: the melt and the diluent can separate into two liquids, and the liquidus alone does not describe the mixture.' : 'χ is below 0.5, so long chains and this diluent mix as one liquid.'), check('Equilibrium melting point', 'verify', 'Use the equilibrium melting point for Tm₀; thin lamellae melt lower than it. Confirm the melting or dissolution temperature of the mixture by DSC or by watching a heated sample.')],
        });
    },
    "dls-particle-size": (v) => {
      if (v.dmin > v.dmax) return invalid('The smallest acceptable diameter must not exceed the largest.');
      const qv = 4 * PI * v.nr * Math.sin(rad(v.theta) / 2) / (v.lam * 1e-9), G1 = v.corr === 'g2' ? v.Gm / 2 : v.Gm, D = G1 / (qv * qv);
      const Rh = KB * (v.T + ZERO_C) / (6 * PI * v.eta * 1e-3 * D), d = 2 * Rh * 1e9, qR = qv * Rh, ok = d >= v.dmin - 1e-9 && d <= v.dmax + 1e-9, low = qR < 1;
      return output({ q: qv, G1, tau: 1 / G1, D, Rh, d, qR }, 'Hydrodynamic diameter (nm)', d,
        [m('Scattering vector q', q(qv * 1e-6, '1/µm', 4)), m('Field decay rate Γ / relaxation time', `${q(G1, '1/s', 3)} / ${q(1e6 / G1, 'µs', 3)}`), m('Diffusion coefficient D', q(D * 1e12, 'µm²/s', 4)), m('Hydrodynamic radius / diameter', `${q(Rh * 1e9, '', 2)} / ${q(d, 'nm', 2)}`), m('Product qRh', q(qR, '', 3))],
        'Dynamic light scattering size by the Stokes–Einstein equation.', 'One decay rate (first cumulant); dilute spheres or coils; Stokes–Einstein in a Newtonian liquid.', {
          text: ok ? 'SIZE IN RANGE' : 'SIZE OUT OF RANGE', tone: ok ? 'good' : 'bad',
          checks: [check('Diameter against the specification', ok ? 'pass' : 'fail', `${q(d, 'nm', 2)} against ${q(v.dmin, '', 2)} to ${q(v.dmax, 'nm', 2)}.`), check('Internal motion (qRh)', low ? 'pass' : 'warn', low ? `qRh = ${q(qR, '', 3)}, below 1; for flexible coils the decay is translational only when qR is well below 1.` : `qRh = ${q(qR, '', 3)}: internal motion of flexible coils and the shape of large particles can enter the decay; measure at smaller angles and extrapolate Γ ÷ q² to q = 0.`), check('Viscosity and temperature', 'verify', 'Use the viscosity of the actual liquid at the measured sample temperature; 1 K changes the viscosity of water by about 2 %.'), check('Polydispersity and concentration', 'verify', 'A single decay rate gives an intensity-weighted (z-average) size; a broad or multimodal sample needs a distribution analysis, and concentrated samples need extrapolation to zero concentration (ISO 22412).')],
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
