// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook31). SI units are explicit at each boundary.
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
    "pump-operating-point": (v) => {
      if (v.Hb >= v.H0) return invalid('The best-efficiency head must be below the shut-off head.');
      if (v.Hd <= v.Hs) return invalid('The system head at the known flow must exceed the static head.');
      if (v.H0 <= v.Hs) return invalid('The pump cannot lift against the static head.');
      const a = (v.H0 - v.Hb) / v.Qb ** 2, k = (v.Hd - v.Hs) / v.Qd ** 2, Q = Math.sqrt((v.H0 - v.Hs) / (a + k)), H = v.Hs + k * Q * Q, x = Q / v.Qb, eta = Math.max(0.01, v.etab / 100 * (2 * x - x * x));
      const P = v.rho * 9.80665 * (Q / 60000) * H / eta / 1000, s = v.Qt > 0 ? Math.sqrt((v.Hs + (a + k) * v.Qt ** 2) / v.H0) : 0, pct = x * 100, ok = pct >= 70 && pct <= 120;
      return output({ Q, H, eta: eta * 100, P, pctBEP: pct, s, nt: s * v.n0 }, 'Operating flow (L/min)', Q,
        [m('Operating flow', q(Q, 'L/min', 1)), m('Operating head', q(H, 'm', 2)), m('Efficiency there', q(eta * 100, '%', 1)), m('Absorbed power', q(P, 'kW', 2)), m('Flow ÷ BEP flow', q(pct, '%', 0)), m('Speed for the target flow', v.Qt > 0 ? q(s * v.n0, 'rpm', 0) : 'No target entered')],
        'Pump operating point.', 'Quadratic pump and system curves.', {
          text: ok ? 'NEAR BEST EFFICIENCY' : 'AWAY FROM BEST EFFICIENCY', tone: ok ? 'good' : 'bad',
          checks: [check('Operating region', ok ? 'pass' : 'warn', `${q(pct, '%', 0)} of BEP flow; 70–120% is the preferred region.`), check('Speed change', v.Qt > 0 && s > 1 ? 'warn' : 'pass', v.Qt > 0 && s > 1 ? 'The target needs more than rated speed: check motor power and pump limits.' : 'Target within rated speed.')],
        });
    },
    "fan-drive-sizing": (v) => {
      const Pair = v.Q * v.p / 1000, P1 = Pair / (v.eta / 100), s = v.Qt / v.Q, n2 = v.n * s, p2 = v.p * s * s, P2 = P1 * s ** 3, Pm = P2 / (v.eb / 100) * (1 + v.marg / 100);
      const series = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315, 355, 400, 450, 500], Prated = series.find((x) => x >= Pm);
      if (!Prated) return invalid('The power is beyond the motor range listed.');
      const df = v.dm * v.nm / n2;
      return output({ Pair, P1, n2, p2, P2, Pm, Prated, df }, 'Shaft power at the new flow (kW)', P2,
        [m('Present air / shaft power', `${q(Pair, '', 2)} / ${q(P1, 'kW', 2)}`), m('New fan speed', q(n2, 'rpm', 0)), m('New fan pressure', q(p2, 'Pa', 0)), m('New shaft power', q(P2, 'kW', 2)), m('Motor power needed / rating', `${q(Pm, '', 2)} / ${q(Prated, 'kW', 2)}`), m('Fan pulley pitch diameter', q(df, 'mm', 0))],
        'Fan duty and drive.', 'Fan laws on a system without static pressure.', {
          checks: [check('Fan speed limit', 'verify', `Confirm ${q(n2, 'rpm', 0)} is within the fan’s maximum safe speed.`), check('Belt and bearings', s > 1.1 ? 'warn' : 'pass', s > 1.1 ? 'Higher speed raises belt and bearing loads; re-check the drive.' : 'Modest change.')],
        });
    },
    "machine-foundation-block": (v) => {
      const mb = v.ratio * v.mm, A = v.Lb * v.Wb, depth = mb / (v.rhoc * A), mt = mb + v.mm, qb = mt * 9.80665 / A / 1000, k = v.ks * 1e6 * A, fn = Math.sqrt(k / mt) / (2 * PI), ff = v.rpm / 60, r = ff / fn;
      const okQ = qb <= v.qa, okR = r < 0.5 || r > 1.5, ok = okQ && okR;
      return output({ mb, depth, qb, k, fn, r }, 'Block depth (m)', depth,
        [m('Block mass', q(mb / 1000, 't', 2)), m('Block depth', q(depth, 'm', 2)), m('Soil bearing pressure', q(qb, 'kPa', 1)), m('Vertical stiffness', q(k / 1e6, 'MN/m', 0)), m('Natural frequency', q(fn, 'Hz', 2)), m('Running ÷ natural frequency', q(r, '', 2))],
        'Foundation block sizing.', 'Rigid block on an elastic soil spring.', {
          text: ok ? 'FOUNDATION ACCEPTABLE' : 'REVISE THE FOUNDATION', tone: ok ? 'good' : 'bad',
          checks: [check('Soil bearing', okQ ? 'pass' : 'fail', `${q(qb, 'kPa', 0)} against ${q(v.qa, 'kPa', 0)}.`), check('Resonance', okR ? 'pass' : 'fail', okR ? 'Running frequency is clear of the natural frequency.' : 'Within ±50% of resonance: change block size or plan area.'), check('Engineering', 'verify', 'Have the final foundation designed by a structural engineer.')],
        });
    },
    "measurement-temperature-error": (v) => {
      const dev = v.L * 1e-6 * (v.ap * (v.Tp - 20) - v.ag * (v.Tg - 20)), meas = v.meas > 0 ? v.meas : v.L, corr = meas - dev, used = Math.abs(dev) / v.tol * 100, dA = Math.abs(v.ap - v.ag), dTallow = dA > 0 ? v.share / 100 * v.tol / (v.L * 1e-6 * dA) : Infinity, ok = used <= v.share;
      return output({ dev, corr, used, dTallow: Number.isFinite(dTallow) ? dTallow : 0 }, 'Apparent deviation (µm)', dev * 1000,
        [m('Apparent deviation', q(dev * 1000, 'µm', 2)), m('Size corrected to 20 °C', q(corr, 'mm', 4)), m('Share of tolerance used', q(used, '%', 1)), m('Allowed offset from 20 °C (same temperature)', Number.isFinite(dTallow) ? q(dTallow, 'K', 2) : 'No error at equal temperatures')],
        'Temperature measurement error.', 'Uniform temperatures, linear expansion.', {
          text: ok ? 'WITHIN TEMPERATURE ALLOWANCE' : 'CORRECT OR WAIT FOR TEMPERATURE', tone: ok ? 'good' : 'bad',
          checks: [check('Tolerance share', ok ? 'pass' : 'fail', `${q(used, '%', 1)} of the tolerance against ${q(v.share, '%', 0)} allowed.`)],
        });
    },
    "pressure-vessel-thickness": (v) => {
      const R = v.D / 2, SE = v.S * v.E; if (SE <= 0.6 * v.p) return invalid('The pressure is too high for the allowable stress with these formulas.');
      const tShell = v.p * R / (SE - 0.6 * v.p) + v.CA, tHemi = v.p * R / (2 * SE - 0.2 * v.p) + v.CA, tEll = v.p * v.D / (2 * SE - 0.2 * v.p) + v.CA, tTori = 0.885 * v.p * v.D / (SE - 0.1 * v.p) + v.CA, pt = v.tf * v.p;
      return output({ tShell, tHemi, tEll, tTori, pt }, 'Shell thickness (mm)', tShell,
        [m('Cylindrical shell', q(tShell, 'mm', 2)), m('Hemispherical head', q(tHemi, 'mm', 2)), m('2:1 ellipsoidal head', q(tEll, 'mm', 2)), m('Torispherical head', q(tTori, 'mm', 2)), m('Hydrostatic test pressure', q(pt, 'MPa', 2))],
        'Vessel thickness comparison.', 'Code formulas for comparison; not a design.', {
          checks: [check('Thin-wall range', v.p <= 0.385 * SE ? 'pass' : 'warn', v.p <= 0.385 * SE ? 'Within the thin-wall formula range.' : 'Above 0.385 S E: the thick-wall formulas apply.'), check('Code', 'verify', 'Design and certify to the applicable pressure equipment code.')],
        });
    },
    "fixture-locating-error": (v) => {
      const c1 = v.h1max - v.p1min, c2 = v.h2max - v.p2min; if (v.h1min < v.p1max || v.h2min < v.p2max) return invalid('A pin is larger than its smallest hole: the part may not load.');
      const t = c1 / 2, rot = (c1 + c2) / (2 * v.Lp), err = t + v.Lf * rot, zone = 2 * err, allow = v.tolp * v.share / 100, ok = zone <= allow;
      return output({ c1, c2, t, rot, rotDeg: deg(rot), err, zone }, 'Position error zone at the feature (mm)', zone,
        [m('Maximum clearance, round pin', q(c1 * 1000, 'µm', 1)), m('Maximum clearance, diamond pin', q(c2 * 1000, 'µm', 1)), m('Translation at the round pin', q(t * 1000, 'µm', 1)), m('Rotation', `${q(rot * 1e6, 'µrad', 1)} (${q(deg(rot) * 3600, '″', 1)})`), m('Position error zone at the feature', q(zone * 1000, 'µm', 1)), m('Allowed for locating', q(allow * 1000, 'µm', 1))],
        'Fixture locating error.', 'Worst-case clearances.', {
          text: ok ? 'LOCATING ADEQUATE' : 'LOCATING ERROR TOO LARGE', tone: ok ? 'good' : 'bad',
          checks: [check('Position tolerance', ok ? 'pass' : 'fail', `${q(zone * 1000, 'µm', 1)} against ${q(allow * 1000, 'µm', 1)} allowed.`)],
        });
    },
    "flange-bolt-load-check": (v) => {
      const H = PI / 4 * v.G ** 2 * v.p, Hp = 2 * PI * v.b * v.G * v.mg * v.p, Wm1 = H + Hp, Wm2 = PI * v.b * v.G * v.y, Wm = Math.max(Wm1, Wm2);
      const Am = Wm / v.Sa, At = PI / 4 * (v.d - 0.938194 * v.P) ** 2, Ab = v.nb * At, Fb = Wm / v.nb, T = v.K * Fb * v.d / 1000, ok = Ab >= Am;
      return output({ H, Hp, Wm1, Wm2, Wm, Am, Ab, Fb, T }, 'Required bolt load (kN)', Wm / 1000,
        [m('Hydrostatic end force', q(H / 1000, 'kN', 1)), m('Operating bolt load W_m1', q(Wm1 / 1000, 'kN', 1)), m('Seating bolt load W_m2', q(Wm2 / 1000, 'kN', 1)), m('Governs', Wm1 >= Wm2 ? 'Operating' : 'Gasket seating'), m('Required / provided bolt area', `${q(Am, '', 0)} / ${q(Ab, 'mm²', 0)}`), m('Load per bolt', q(Fb / 1000, 'kN', 2)), m('Tightening torque per bolt', q(T, 'N·m', 0))],
        'Flange bolt load check.', 'Code bolt-load method with user gasket factors.', {
          text: ok ? 'BOLTING ADEQUATE' : 'BOLTING INADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Bolt area', ok ? 'pass' : 'fail', `${q(Ab, 'mm²', 0)} provided against ${q(Am, 'mm²', 0)} required.`), check('Flange design', 'verify', 'Flange stresses and rotation need the full code check.')],
        });
    },
    "chain-conveyor-sizing": (v) => {
      const g = 9.80665, Tc = (v.q + v.qc) * g * (v.mu * v.L + v.Hl), Tr = v.qc * g * v.mu * v.L, Tt = Tc + Tr; if (Tt <= 0) return invalid('The conveyor runs down on its own: the drive must brake.');
      const per = Tt * v.SF / v.strands, PD = v.p / Math.sin(PI / v.z), Tq = Tt * PD / 2000, ns = v.v / (PI * PD / 1000) * 60, P = Tt * v.v / (v.eta / 100) / 1000, ok = per <= v.Wc * 1000;
      return output({ Tc, Tr, Tt, per, PD, Tq, ns, P }, 'Total chain pull (kN)', Tt / 1000,
        [m('Carrying run pull', q(Tc / 1000, 'kN', 2)), m('Return run pull', q(Tr / 1000, 'kN', 2)), m('Total pull', q(Tt / 1000, 'kN', 2)), m('Design pull per strand', q(per / 1000, 'kN', 2)), m('Sprocket pitch diameter', q(PD, 'mm', 1)), m('Sprocket torque / speed', `${q(Tq, 'N·m', 0)} / ${q(ns, 'rpm', 1)}`), m('Motor power', q(P, 'kW', 2))],
        'Chain conveyor sizing.', 'Steady running, single friction coefficient.', {
          text: ok ? 'CHAIN ADEQUATE' : 'CHAIN OVERLOADED', tone: ok ? 'good' : 'bad',
          checks: [check('Chain working load', ok ? 'pass' : 'fail', `${q(per / 1000, 'kN', 2)} per strand against ${q(v.Wc, 'kN', 1)}.`), check('Sprocket teeth', v.z >= 8 ? 'pass' : 'warn', v.z >= 8 ? 'Adequate tooth count.' : 'Few teeth: high chordal action and wear.')],
        });
    },
    "travel-drive-sizing": (v) => {
      if (v.driven > v.wheels) return invalid('Driven wheels cannot exceed total wheels.');
      const W = v.mass * 9.80665, Frun = W * (v.f + v.mub * v.dj / 2) / (v.D / 2) * v.flange, Facc = v.rot * v.mass * v.a, Ftot = Frun + Facc, vs = v.v / 60, wn = vs / (PI * v.D / 1000) * 60;
      const Tw = Ftot * v.D / 2000, P = Ftot * vs / (v.eta / 100) / 1000, series = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110], Prated = series.find((x) => x >= P);
      if (!Prated) return invalid('The power is beyond the motor range listed.');
      const Fadh = v.adh * W * v.driven / v.wheels, ok = Ftot <= Fadh;
      return output({ Frun, Facc, Ftot, Tw, wn, P, Prated, Fadh }, 'Motor rating (kW)', Prated,
        [m('Running resistance', q(Frun / 1000, 'kN', 3)), m('Accelerating force', q(Facc / 1000, 'kN', 2)), m('Total force when starting', q(Ftot / 1000, 'kN', 2)), m('Wheel torque (all driven wheels)', q(Tw, 'N·m', 0)), m('Wheel speed', q(wn, 'rpm', 1)), m('Motor power / rating', `${q(P, 'kW', 2)} / ${q(Prated, 'kW', 2)}`), m('Adhesion limit on driven wheels', q(Fadh / 1000, 'kN', 2))],
        'Rail travel drive sizing.', 'Level track, equal wheel loads.', {
          text: ok ? 'NO WHEEL SLIP' : 'DRIVEN WHEELS WILL SLIP', tone: ok ? 'good' : 'bad',
          checks: [check('Adhesion', ok ? 'pass' : 'fail', `${q(Ftot / 1000, 'kN', 2)} needed against ${q(Fadh / 1000, 'kN', 2)} available.`)],
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
