// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook60). SI units are explicit at each boundary.
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
    "sprocket-bore-key-plan": (v) => {
      if (v.w >= v.D) return invalid('The key width must be smaller than the shaft diameter.');
      const pd = v.p / Math.sin(PI / v.N), bottom = pd - v.Dr, odd = v.N % 2 === 1, cal = odd ? pd * Math.cos(PI / (2 * v.N)) - v.Dr : bottom, od = v.p * (0.6 + 1 / Math.tan(PI / v.N));
      if (v.D >= bottom) return invalid('The bore must be smaller than the bottom diameter.');
      const Y = (v.D - Math.sqrt(v.D * v.D - v.w * v.w)) / 2, S = v.D - Y - v.t, Tm = S + v.h, top = Tm - v.D / 2, wall = bottom / 2 - top, ok = wall >= v.wMin - 1e-9;
      return output({ pd, bottom, cal, od, Y, depth: Y + v.t, S, T: Tm, top, wall }, 'Wall under the teeth (mm)', wall,
        [m('Pitch / outside diameter', `${q(pd, '', 3)} / ${q(od, 'mm', 3)}`), m('Bottom / caliper diameter', `${q(bottom, '', 3)} / ${q(cal, 'mm', 3)}`), m('Chordal height Y', q(Y, 'mm', 3)), m('Keyseat reading S / over the key T', `${q(S, '', 3)} / ${q(Tm, 'mm', 3)}`), m('Wall under the teeth', q(wall, 'mm', 2))],
        'Sprocket bore and key plan.', 'Plain hub; keyway to the top of the key.', {
          text: ok ? 'BLANK FEASIBLE' : 'WALL TOO THIN', tone: ok ? 'good' : 'bad',
          checks: [check('Wall under the teeth', ok ? 'pass' : 'fail', `${q(wall, 'mm', 2)} against ${q(v.wMin, 'mm', 1)}${ok ? '.' : ': use more teeth, a smaller bore or a shallower key.'}`), check('Key size', 'verify', 'Take the key size and keyseat depth for the shaft from your key standard.')],
        });
    },
    "pinned-hub-drive-check": (v) => {
      if (v.dp >= v.D) return invalid('The pin must be smaller than the shaft.');
      const T = v.mode === 'torque' ? v.T * 1000 : 9549.2966 * v.P / v.rpm * 1000, dreq = 1.13 * Math.sqrt(T / (v.D * v.S)), tau = 4 * T / (PI * v.dp * v.dp * v.D), sb = 6 * T / (v.dp * v.D * v.D), tauNom = 16 * T / (PI * v.D ** 3), tauS = v.Kt * tauNom, ratio = v.dp / v.D;
      const okP = tau <= v.S + 1e-9, okB = sb <= v.sbA + 1e-9, okS = tauS <= v.tauA + 1e-9, okR = ratio <= v.ratioMax + 1e-12, ok = okP && okB && okS && okR;
      return output({ T: T / 1000, dreq, tau, sb, tauNom, tauS, ratio }, 'Pin shear stress (MPa)', tau,
        [m('Torque', q(T / 1000, 'N·m', 2)), m('Pin diameter needed', q(dreq, 'mm', 2)), m('Pin shear stress', q(tau, 'MPa', 1)), m('Bearing pressure on the shaft', q(sb, 'MPa', 1)), m('Shaft stress: nominal / at the hole', `${q(tauNom, '', 1)} / ${q(tauS, 'MPa', 1)}`), m('Pin ÷ shaft diameter', q(ratio, '', 3))],
        'Pinned hub drive check.', 'Steady torque; pin in double shear.', {
          text: ok ? 'PIN DRIVE ADEQUATE' : 'PIN DRIVE NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Pin shear', okP ? 'pass' : 'fail', `${q(tau, 'MPa', 1)} against ${q(v.S, 'MPa', 0)}.`), check('Bearing on the shaft', okB ? 'pass' : 'fail', `${q(sb, 'MPa', 1)} against ${q(v.sbA, 'MPa', 0)}.`), check('Shaft at the cross hole', okS ? 'pass' : 'fail', `${q(tauS, 'MPa', 1)} against ${q(v.tauA, 'MPa', 0)}.`), check('Pin size', okR ? 'pass' : 'fail', `${q(ratio, '', 3)} of the shaft diameter against ${q(v.ratioMax, '', 2)}.`)],
        });
    },
    "press-flywheel-check": (v) => {
      const E = v.emode === 'force' ? v.F * v.s : v.E * 1000; if (E <= 0) return invalid('Enter the energy per stroke.');
      const T = 60 / v.spm; if (v.tcut >= T) return invalid('The cut time must be shorter than the stroke time.');
      const P = E * v.spm / 60, E1 = E * (1 - v.tcut / T), v1 = PI * v.Dm * v.rpm / 60, v2 = v1 * (1 - v.red / 100), mass = 2 * E1 / (v1 * v1 - v2 * v2);
      const Arim = mass / (v.rho * PI * v.Dm), a = Math.sqrt(Arim / v.y), b = v.y * a, sigma = v.rho * v1 * v1 / 1e6, Pneed = P / 1000 / (v.eta / 100);
      const okM = v.mFit >= mass - 1e-9, okS = sigma <= v.sA + 1e-12, okP = v.Pmot >= Pneed - 1e-9, ok = okM && okS && okP;
      return output({ E, P, E1, mass, v1, sigma, a: a * 1000, b: b * 1000, Pneed }, 'Rim mass needed (kg)', mass,
        [m('Energy per stroke / from the flywheel', `${q(E / 1000, '', 2)} / ${q(E1 / 1000, 'kJ', 2)}`), m('Average power', q(P / 1000, 'kW', 2)), m('Rim speed / hoop stress', `${q(v1, 'm/s', 2)} / ${q(sigma, 'MPa', 2)}`), m('Rim mass needed', q(mass, 'kg', 0)), m('Rim section width × depth', `${q(a * 1000, '', 0)} × ${q(b * 1000, 'mm', 0)}`), m('Motor power needed', q(Pneed, 'kW', 2))],
        'Press flywheel and motor check.', 'Rim inertia only; average power.', {
          text: ok ? 'FLYWHEEL AND MOTOR ADEQUATE' : 'FLYWHEEL OR MOTOR SHORT', tone: ok ? 'good' : 'bad',
          checks: [check('Rim mass', okM ? 'pass' : 'fail', `${q(v.mFit, 'kg', 0)} fitted against ${q(mass, 'kg', 0)} needed.`), check('Rim stress', okS ? 'pass' : 'fail', `${q(sigma, 'MPa', 2)} against ${q(v.sA, 'MPa', 1)}${okS ? '.' : ': lower the flywheel speed.'}`), check('Motor power', okP ? 'pass' : 'fail', `${q(v.Pmot, 'kW', 1)} against ${q(Pneed, 'kW', 1)} needed.`)],
        });
    },
    "drop-hammer-forging-plan": (v) => {
      const g = 9.80665, Freq = v.A * v.sf * v.K, wEff = v.eff / 100 * v.m * g;
      if (Freq <= wEff) return invalid('The weight of the tup alone deforms the part; use a press or a lighter tup.');
      const d = wEff * v.h / (Freq - wEff) * 1000, E = v.m * g * (v.h + d / 1000), vImp = Math.sqrt(2 * g * v.h), blows = Math.ceil(v.red / d - 1e-9), ok = blows <= v.maxBlows;
      return output({ Freq, d, E, vImp, blows }, 'Number of blows', blows,
        [m('Force needed', q(Freq / 1000, 'kN', 1)), m('Set per blow', q(d, 'mm', 2)), m('Energy per blow', q(E / 1000, 'kJ', 2)), m('Impact speed', q(vImp, 'm/s', 2)), m('Blows for the reduction', String(blows))],
        'Drop hammer forging plan.', 'Constant area and flow stress; rigid anvil.', {
          text: ok ? 'PLAN FEASIBLE' : 'TOO MANY BLOWS', tone: ok ? 'good' : 'bad',
          checks: [check('Blows per heat', ok ? 'pass' : 'fail', `${blows} against ${v.maxBlows}${ok ? '.' : ': raise the drop height, use a heavier tup or reheat between blows.'}`), check('Flow stress', 'verify', 'Use the flow stress at the actual forging temperature and strain rate.')],
        });
    },
    "v-belt-motor-load-check": (v) => {
      const d2 = v.d1 * v.ratio, D = Math.max(d2, v.d1), dd = Math.min(d2, v.d1); if ((D - dd) / 2 >= v.C) return invalid('The centre distance is too small for these pulleys.');
      const phi = Math.asin((D - dd) / (2 * v.C)), Lb = 2 * v.C * Math.cos(phi) + PI * (D + dd) / 2 + phi * (D - dd), th = PI - 2 * phi, vel = PI * v.d1 * v.n1 / 60000;
      const mue = v.groove === 'v' ? v.mu / Math.sin(rad(19)) : v.mu, eR = Math.exp(mue * th), Fe = v.P * v.SF * 1000 / vel, Tc = v.mass * vel * vel;
      if (Tc >= v.Tmax) return invalid('Centrifugal tension alone exceeds the belt allowable: reduce belt speed.');
      const nb = Math.ceil(Fe * eR / (eR - 1) / (v.Tmax - Tc) - 1e-9), t1 = Fe / nb * eR / (eR - 1), t2 = t1 - Fe / nb, Fs = nb * Math.sqrt(t1 * t1 + t2 * t2 + 2 * t1 * t2 * Math.cos(2 * phi)), n2 = v.n1 / v.ratio, err = (n2 - v.n2req) / v.n2req * 100;
      const okG = nb <= v.nG, okF = Fs <= v.Fr + 1e-9, okN = Math.abs(err) <= v.tol + 1e-9, ok = okG && okF && okN;
      return output({ d2, n2, vel, Lb, wrap: deg(th), eR, Fe, Tc, nb, T1: t1 + Tc, T2: t2 + Tc, Fs, err }, 'Shaft load on the motor (N)', Fs,
        [m('Driven pulley / speed', `${q(d2, 'mm', 1)} / ${q(n2, 'rpm', 1)}`), m('Belt length / wrap', `${q(Lb, 'mm', 0)} / ${q(deg(th), '°', 1)}`), m('Belt speed', q(vel, 'm/s', 2)), m('Effective pull', q(Fe, 'N', 0)), m('Belts needed', String(nb)), m('Shaft load on the motor', q(Fs, 'N', 0)), m('Driven speed error', q(err, '%', 2))],
        'V-belt drive motor load check.', 'Steady load; tension-based belt count.', {
          text: ok ? 'DRIVE SUITS MOTOR' : 'DRIVE DOES NOT SUIT MOTOR', tone: ok ? 'good' : 'bad',
          checks: [check('Grooves', okG ? 'pass' : 'fail', `${nb} belts needed, ${v.nG} grooves.`), check('Motor shaft load', okF ? 'pass' : 'fail', `${q(Fs, 'N', 0)} against ${q(v.Fr, 'N', 0)}${okF ? '.' : ': use larger pulleys or an outboard bearing.'}`), check('Driven speed', okN ? 'pass' : 'fail', `${q(n2, 'rpm', 1)} against ${q(v.n2req, 'rpm', 0)} ± ${q(v.tol, '%', 1)}.`)],
        });
    },
    "conveyor-drive-train-check": (v) => {
      const g = 9.80665, qL = v.Q / (3.6 * v.v), Te = v.f * g * v.L * (qL + v.qm) + qL * g * v.Hl; if (Te <= 0) return invalid('The conveyor runs downhill on its own: the drive must brake, not drive.');
      const Pp = Te * v.v / 1000, Pm = Pp / (v.eta / 100) * (1 + v.marg / 100), e = Math.exp(v.mu * rad(v.wrap)), T2 = Te / (e - 1), T1 = T2 + Te, Tq = Te * v.D / 2000, np = v.v / (PI * v.D / 1000) * 60;
      const iNeed = v.nm / np, va = PI * v.D / 1000 * v.nm / v.iR / 60, err = (va - v.v) / v.v * 100, Tg = Tq * v.SFg;
      const okV = Math.abs(err) <= v.tolV + 1e-9, okP = v.Pinst >= Pm - 1e-9, okG = Tg <= v.TgR + 1e-9, ok = okV && okP && okG;
      return output({ qL, Te, Pp, Pmotor: Pm, T1, T2, Tq, np, iNeed, va, err, Tg }, 'Motor power needed (kW)', Pm,
        [m('Load per metre / effective pull', `${q(qL, 'kg/m', 2)} / ${q(Te, 'N', 0)}`), m('Power: pulley / motor needed', `${q(Pp, '', 2)} / ${q(Pm, 'kW', 2)}`), m('Tight / slack side tension', `${q(T1, '', 0)} / ${q(T2, 'N', 0)}`), m('Pulley speed / ratio needed', `${q(np, 'rpm', 1)} / ${q(iNeed, '', 2)}`), m('Belt speed with the fitted reducer', `${q(va, 'm/s', 3)} (${q(err, '%', 1)})`), m('Pulley torque / gearbox duty', `${q(Tq, '', 0)} / ${q(Tg, 'N·m', 0)}`)],
        'Conveyor drive train check.', 'Steady running; overall friction factor.', {
          text: ok ? 'DRIVE TRAIN ADEQUATE' : 'DRIVE TRAIN NOT ADEQUATE', tone: ok ? 'good' : 'bad',
          checks: [check('Belt speed', okV ? 'pass' : 'fail', `${q(va, 'm/s', 3)} against ${q(v.v, 'm/s', 2)} ± ${q(v.tolV, '%', 0)}.`), check('Motor power', okP ? 'pass' : 'fail', `${q(v.Pinst, 'kW', 2)} fitted against ${q(Pm, 'kW', 2)} needed.`), check('Gearbox torque', okG ? 'pass' : 'fail', `${q(Tg, 'N·m', 0)} against ${q(v.TgR, 'N·m', 0)}.`), check('Belt slip', 'verify', 'Check the take-up gives at least the slack side tension shown.')],
        });
    },
    "vessel-shell-plan": (v) => {
      const R = v.D / 2, SE = v.S * v.E; if (SE <= 0.6 * v.p) return invalid('The pressure is too high for the allowable stress with these formulas.');
      if (v.tUse <= v.CA) return invalid('The plate must be thicker than the corrosion allowance.');
      const tShell = v.p * R / (SE - 0.6 * v.p) + v.CA, tEll = v.p * v.D / (2 * SE - 0.2 * v.p) + v.CA, pt = v.tf * v.p, tc = v.tUse - v.CA;
      const mawpS = SE * tc / (R + 0.6 * tc), mawpH = 2 * SE * tc / (v.D + 0.2 * tc), mawp = Math.min(mawpS, mawpH), vol = (PI * v.D * v.D * v.L / 4 + 2 * PI * v.D ** 3 / 24) / 1e9, water = vol * 1000, shellMass = PI * (v.D + v.tUse) * v.tUse * v.L * v.rho / 1e9;
      const okS = v.tUse >= tShell - 1e-9, okH = v.tUse >= tEll - 1e-9, ok = okS && okH;
      return output({ tShell, tEll, pt, mawpS, mawpH, mawp, vol, water, shellMass }, 'Shell thickness needed (mm)', tShell,
        [m('Thickness needed: shell / heads', `${q(tShell, '', 2)} / ${q(tEll, 'mm', 2)}`), m('MAWP of the chosen plate: shell / heads', `${q(mawpS, '', 3)} / ${q(mawpH, 'MPa', 3)}`), m('Hydrostatic test pressure', q(pt, 'MPa', 3)), m('Vessel volume / test water', `${q(vol, 'm³', 3)} / ${q(water, 'kg', 0)}`), m('Shell course mass', q(shellMass, 'kg', 0))],
        'Pressure vessel shell plan.', 'Internal pressure; 2:1 ellipsoidal heads.', {
          text: ok ? 'PLATE ADEQUATE' : 'PLATE TOO THIN', tone: ok ? 'good' : 'bad',
          checks: [check('Shell', okS ? 'pass' : 'fail', `${q(v.tUse, 'mm', 1)} against ${q(tShell, 'mm', 2)} needed.`), check('Heads', okH ? 'pass' : 'fail', `${q(v.tUse, 'mm', 1)} against ${q(tEll, 'mm', 2)} needed.`), check('Code rules', 'verify', 'Confirm minimum thickness, allowable stress and test pressure in your pressure vessel code.')],
        });
    },
    "turning-cut-power-check": (v) => {
      const A = v.f * v.a, ECT = A / v.CEL, MRR = 1000 * v.V * A, Fc = A * v.Kc, FH = v.ratio * Fc, FA = FH * Math.cos(rad(v.cfa)), FR = FH * Math.sin(rad(v.cfa)), P = Fc * v.V / 60000;
      const Pc = v.Pavail * v.eta / 100, vcMax = Pc * 60000 / (v.Kc * v.a * v.f), n = 1000 * v.V / (PI * v.Dw), share = P / Pc * 100, okP = P <= Pc + 1e-9, okN = n <= v.nMax + 1e-9, ok = okP && okN;
      return output({ ECT, A, MRR, Fc, FH, FA, FR, P, Pc, vcMax, n, share }, 'Cutting power (kW)', P,
        [m('Chip area / ECT', `${q(A, 'mm²', 3)} / ${q(ECT, 'mm', 3)}`), m('Removal rate', q(MRR / 1000, 'cm³/min', 1)), m('Cutting force / feed-plane force', `${q(Fc, '', 0)} / ${q(FH, 'N', 0)}`), m('Axial / radial force', `${q(FA, '', 0)} / ${q(FR, 'N', 0)}`), m('Power: cut / available', `${q(P, '', 2)} / ${q(Pc, 'kW', 2)} (${q(share, '%', 0)})`), m('Highest speed at full power', q(vcMax, 'm/min', 0)), m('Spindle speed', q(n, 'rpm', 0))],
        'Turning cut power check.', 'Specific cutting force at this ECT.', {
          text: ok ? 'CUT WITHIN LATHE' : 'CUT EXCEEDS LATHE', tone: ok ? 'good' : 'bad',
          checks: [check('Power', okP ? 'pass' : 'fail', `${q(P, 'kW', 2)} against ${q(Pc, 'kW', 2)}${okP ? '.' : `: drop the speed to ${q(vcMax, 'm/min', 0)} or take a lighter cut.`}`), check('Spindle speed', okN ? 'pass' : 'fail', `${q(n, 'rpm', 0)} against ${q(v.nMax, 'rpm', 0)}.`), check('Tool speed limit', 'verify', 'Use the lower of this and the tool maker’s recommended speed.')],
        });
    },
    "pressure-tube-torsion-check": (v) => {
      if (2 * v.t >= v.OD) return invalid('The wall must be less than half the outside diameter.');
      const Dm = v.OD - v.t, sh = v.p * Dm / (2 * v.t), sa = v.p * Dm / (4 * v.t) + v.N * 1000 / (PI * Dm * v.t), tau = 2 * v.T * 1000 / (PI * Dm * Dm * v.t);
      const c = (sa + sh) / 2, R = Math.sqrt(((sa - sh) / 2) ** 2 + tau ** 2), s1 = c + R, s2 = c - R, theta = deg(Math.atan2(2 * tau, sa - sh)) / 2;
      const vm = Math.sqrt(s1 * s1 - s1 * s2 + s2 * s2), tresca = Math.max(Math.abs(s1 - s2), Math.abs(s1), Math.abs(s2)), n = vm > 0 ? v.Sy / vm : 1e9, ok = n >= v.req - 1e-12, thin = v.t <= v.OD / 10;
      return output({ Dm, sh, sa, tau, s1, s2, theta, tmax: tresca / 2, vm, n }, 'von Mises stress (MPa)', vm,
        [m('Hoop / axial stress', `${q(sh, '', 1)} / ${q(sa, 'MPa', 1)}`), m('Shear stress from torque', q(tau, 'MPa', 1)), m('Principal stresses σ₁ / σ₂', `${q(s1, '', 1)} / ${q(s2, 'MPa', 1)}`), m('Principal angle from the axis', q(theta, '°', 1)), m('Maximum shear', q(tresca / 2, 'MPa', 1)), m('von Mises / safety factor', `${q(vm, 'MPa', 1)} / ${vm > 0 ? q(n, '', 2) : 'No stress'}`)],
        'Pressurised tube under torsion check.', 'Thin wall; closed ends; away from discontinuities.', {
          text: ok ? 'TUBE ADEQUATE' : 'TUBE OVERSTRESSED', tone: ok ? 'good' : 'bad',
          checks: [check('Safety factor', ok ? 'pass' : 'fail', `${vm > 0 ? q(n, '', 2) : 'No stress'} against ${q(v.req, '', 2)}.`), check('Thin-wall theory', thin ? 'pass' : 'warn', thin ? 'Wall thin enough for thin-wall formulas.' : 'Wall thicker than a tenth of the diameter: use thick-wall (Lamé) stresses.')],
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
