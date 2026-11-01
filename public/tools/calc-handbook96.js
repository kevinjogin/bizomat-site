// KEVOS® MAKEOS calculations from Machinery’s Handbook topics (batch handbook96). SI units are explicit at each boundary.
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
    "modified-constant-velocity-cam": (v) => {
      const b1 = 2 * v.y1 * v.b2 / v.y2, b3 = 2 * v.y3 * v.b2 / v.y2, bt = b1 + v.b2 + b3, tot = v.y1 + v.y2 + v.y3;
      if (!(bt <= 360)) return invalid('The whole rise needs more than 360° of cam rotation; shorten the acceleration and deceleration parts or lengthen β2.');
      if (!(bt / v.step <= 72)) return invalid('The step is too small for the table; use a step of at least one seventy-second of the rise angle.');
      const y = (th) => th <= b1 ? v.y1 * (th / b1) ** 2 : th <= b1 + v.b2 ? v.y1 + v.y2 * (th - b1) / v.b2 : tot - v.y3 * ((bt - th) / b3) ** 2;
      const pts = []; for (let th = 0; th < bt - 1e-9; th += v.step) pts.push(th); pts.push(bt);
      const w = 6 * v.N, vel = v.y2 * w / v.b2 / 1000, a1 = 2 * v.y1 * w * w / (b1 * b1) / 1000, a3 = 2 * v.y3 * w * w / (b3 * b3) / 1000, amx = Math.max(a1, a3), ok = amx <= v.amax;
      return output({ b1, b3, bt, tot, vel, a1, a3, y5: y(Math.min(v.step, bt)) }, 'Total rise angle (°)', bt,
        [m('Matching angles β1 / β2 / β3', `${q(b1, '°', 4)} / ${q(v.b2, '°', 4)} / ${q(b3, '°', 4)}`), m('Total rise / rise angle', `${q(tot, 'mm', 4)} / ${q(bt, '°', 4)}`), m('Displacement table (θ: y)', pts.map((t) => `${q(t, '°', 4)}: ${q(y(t), 'mm', 4)}`).join(' · ')), m('Constant velocity of the follower', q(vel, 'm/s', 4)), m('Acceleration / deceleration', `${q(a1, 'm/s²', 4)} / ${q(a3, 'm/s²', 4)}`)],
        'Modified constant-velocity cam.', 'Handbook parabolic matching of a constant-velocity cam displacement diagram.', {
          text: ok ? 'MODIFIED CONSTANT VELOCITY RISE' : 'ACCELERATION ABOVE YOUR LIMIT', tone: ok ? 'good' : 'bad',
          checks: [check('Follower acceleration', ok ? 'pass' : 'fail', `Largest ${q(amx, 'm/s²', 4)} against ${q(v.amax, 'm/s²', 4)} accepted.`), check('Rise angle', 'pass', `${q(bt, '°', 4)} of the 360° cam cycle, leaving ${q(360 - bt, '°', 4)} for dwells and the return.`), check('Pressure angle and curvature', 'verify', 'Check the pressure angle and the radius of curvature of the pitch curve for the cam size you choose.')],
        });
    },
    "cam-size-and-curvature": (v) => {
      const b = rad(v.beta), law = { uniform: (u) => [u, 1, 0], parabolic: (u) => (u <= 0.5 ? [2 * u * u, 4 * u, 4] : [1 - 2 * (1 - u) ** 2, 4 * (1 - u), -4]), shm: (u) => [(1 - Math.cos(PI * u)) / 2, PI / 2 * Math.sin(PI * u), PI * PI / 2 * Math.cos(PI * u)], cycloidal: (u) => [u - Math.sin(2 * PI * u) / (2 * PI), 1 - Math.cos(2 * PI * u), 2 * PI * Math.sin(2 * PI * u)] }[v.law];
      const geo = (R, u) => { const [y, y1, y2] = law(u), r = R + v.h * y, d1 = v.h * y1 / b, d2 = v.h * y2 / (b * b); return { r, phi: Math.atan(d1 / r), rho: (r * r + d1 * d1) ** 1.5 / (r * r + 2 * d1 * d1 - r * d2) }; };
      const n = 1200, maxPhi = (R) => { let mx = 0, at = 0; for (let i = 0; i <= n; i++) { const g = geo(R, i / n); if (g.phi > mx) { mx = g.phi; at = i / n; } } return [mx, at]; };
      const lim = rad(v.phiMax); let lo = 1e-9, hi = 1e6; for (let k = 0; k < 120; k++) { const mid = (lo + hi) / 2; if (maxPhi(mid)[0] > lim) lo = mid; else hi = mid; }
      const Rp = hi, R = v.Ruse > 0 ? v.Ruse : Rp, [pm, pu] = maxPhi(R);
      let rhoV = Infinity, uV = 0, rhoC = Infinity, uC = 0; for (let i = 0; i <= n; i++) { const g = geo(R, i / n); if (g.rho > 0 && g.rho < rhoV) { rhoV = g.rho; uV = i / n; } if (g.rho < 0 && -g.rho < rhoC) { rhoC = -g.rho; uC = i / n; } }
      const okP = deg(pm) <= v.phiMax + 1e-6, okU = rhoV > v.rf, hasC = Number.isFinite(rhoC), okC = !(v.rcut > 0 && hasC) || rhoC + v.rf > v.rcut;
      const text = !okP ? 'PRESSURE ANGLE ABOVE THE LIMIT' : !okU ? 'CAM UNDERCUT: ROLLER TOO LARGE' : !okC ? 'CUTTER TOO LARGE FOR THE CONCAVE PROFILE' : 'CAM SIZE AND CURVATURE';
      return output({ Rp, R, Rtop: R + v.h, phi: deg(pm), thPhi: pu * v.beta, Rphi: geo(R, pu).r, rhoV: Number.isFinite(rhoV) ? rhoV : 0, thV: uV * v.beta, rhoC: hasC ? rhoC : 0, thC: uC * v.beta, Rc: rhoV - v.rf }, 'Least radius to the pitch curve (mm)', R,
        [m('Smallest least radius for φmax', q(Rp, 'mm', 5)), m('Least / greatest radius to the pitch curve used', `${q(R, 'mm', 5)} / ${q(R + v.h, 'mm', 5)}`), m('Largest pressure angle, where', `${q(deg(pm), '°', 4)} at θ = ${q(pu * v.beta, '°', 4)}, radius ${q(geo(R, pu).r, 'mm', 5)}`), m('Smallest convex radius of curvature, where', Number.isFinite(rhoV) ? `${q(rhoV, 'mm', 4)} at θ = ${q(uV * v.beta, '°', 4)}` : 'No convex part'), m('Cam surface radius there (ρ − rf)', Number.isFinite(rhoV) ? q(rhoV - v.rf, 'mm', 4) : 'No convex part'), m('Smallest concave radius of curvature, where', hasC ? `${q(rhoC, 'mm', 4)} at θ = ${q(uC * v.beta, '°', 4)} (cam surface ${q(rhoC + v.rf, 'mm', 4)})` : 'No concave part in the rise')],
        'Cam size and radius of curvature.', 'Handbook pressure angle and radius of curvature formulas for radial translating roller followers.', {
          text, tone: !okP || !okU ? 'bad' : okC ? 'good' : 'warn',
          checks: [check('Pressure angle', okP ? 'pass' : 'fail', `${q(deg(pm), '°', 4)} against ${q(v.phiMax, '°', 4)} accepted; the least radius must be at least ${q(Rp, 'mm', 5)}.`), check('Undercutting', okU ? 'pass' : 'fail', `Smallest convex radius of curvature ${Number.isFinite(rhoV) ? q(rhoV, 'mm', 4) : 'none'} against the roller radius ${q(v.rf, 'mm', 4)}.`), check('Cutter radius', okC ? 'pass' : 'warn', v.rcut > 0 && hasC ? `Concave cam radius ${q(rhoC + v.rf, 'mm', 4)} against the cutter radius ${q(v.rcut, 'mm', 4)}.` : 'No cutter entered or no concave part.'), check('Return', 'verify', 'Repeat the check for the return motion.')],
        });
    },
    "cam-follower-force-analysis": (v) => {
      if (!(v.th <= v.beta)) return invalid('The cam angle to analyse must lie within the rise.');
      const b = rad(v.beta), w = PI * v.N / 30, law = { parabolic: (u) => (u <= 0.5 ? [2 * u * u, 4 * u, 4] : [1 - 2 * (1 - u) ** 2, 4 * (1 - u), -4]), shm: (u) => [(1 - Math.cos(PI * u)) / 2, PI / 2 * Math.sin(PI * u), PI * PI / 2 * Math.cos(PI * u)], cycloidal: (u) => [u - Math.sin(2 * PI * u) / (2 * PI), 1 - Math.cos(2 * PI * u), 2 * PI * Math.sin(2 * PI * u)] }[v.law];
      const ua = v.law === 'cycloidal' ? 0.75 : v.law === 'shm' ? 1 : 0.5, aAt = (u) => v.h * (v.law === 'parabolic' && u === 0.5 ? -4 : law(u)[2]) * w * w / (b * b) / 1000;
      const mass = v.mf + v.ms / 3 + v.me, g0 = 9.80665, aA = aAt(ua), ya = v.h * law(ua)[0], Rin = mass * Math.abs(aA), Fs = v.kd * Rin - v.mf * g0 - v.Fe - v.Ff, Ks = Math.max(0, (Fs - v.F0) / ya);
      const u = v.th / v.beta, [y0, y1, y2] = law(u), y = v.h * y0, r = v.Rmin + y, d1 = v.h * y1 / b, d2 = v.h * y2 / (b * b), phi = Math.atan(d1 / r), a = v.h * y2 * w * w / (b * b) / 1000;
      const P = mass * a + (y * Ks + v.F0) + v.mf * g0 + v.Fe, den = Math.cos(phi) - v.mu * Math.sin(phi) * (2 * v.l1 + v.l2 - v.mu * v.dst) / v.l2;
      if (!(den > 0)) return invalid('With this pressure angle and guide the follower would jam in its bushing; lengthen the bushing or reduce the pressure angle.');
      const Fn = P / den, To = r * Fn * Math.sin(phi) / 1000, rho = (r * r + d1 * d1) ** 1.5 / (r * r + 2 * d1 * d1 - r * d2), da = 2 * v.e * (6 * v.N / v.eps) ** 2 / 1000, ratio = da / Math.abs(aA);
      const okS = Fs > v.F0;
      return output({ aA, thA: ua * v.beta, ya, Rin, Fs, Ks, y, phi: deg(phi), a, P, Fn, To, rho, da, ratio }, 'Normal force on the cam (N)', Fn,
        [m('Greatest deceleration, where', `${q(aA, 'm/s²', 4)} at θ = ${q(ua * v.beta, '°', 4)}, rise ${q(ya, 'mm', 4)}`), m('Inertia force there / spring force needed', `${q(Rin, 'N', 4)} / ${q(Fs, 'N', 4)}`), m('Spring rate needed Ks', okS ? q(Ks, 'N/mm', 4) : `The preload alone (${q(v.F0, 'N', 4)}) is enough`), m('At θ: rise / pressure angle / acceleration', `${q(y, 'mm', 4)} / ${q(deg(phi), '°', 4)} / ${q(a, 'm/s²', 4)}`), m('Load on the follower P', q(P, 'N', 4)), m('Normal force on the cam Fn', q(Fn, 'N', 4)), m('Cam torque To', q(To, 'N·m', 4)), m('Radius of curvature of the pitch curve at θ', q(rho, 'mm', 4)), m('Extra acceleration from the surface error', `${q(da, 'm/s²', 4)} (${q(ratio, '', 3)} × the greatest deceleration)`)],
        'Cam follower force analysis.', 'Handbook force analysis of a radial translating roller follower.', {
          text: ratio > 1 ? 'SURFACE ERROR DOMINATES THE ACCELERATION' : 'FORCES AND TORQUE', tone: ratio > 1 ? 'warn' : 'good',
          checks: [check('Return spring', 'pass', okS ? `A rate of ${q(Ks, 'N/mm', 4)} with ${q(v.F0, 'N', 4)} preload holds the follower at the greatest deceleration.` : 'The preload alone holds the follower at the greatest deceleration.'), check('Guide friction', 'pass', `The friction term reduces cos φ from ${q(Math.cos(phi), '', 4)} to ${q(den, '', 4)}.`), check('Surface accuracy', ratio > 1 ? 'warn' : 'pass', `An error of ${q(v.e, 'mm', 4)} over ${q(v.eps, '°', 3)} adds ${q(da, 'm/s²', 4)}, ${q(ratio, '', 3)} times the greatest deceleration.`), check('Contact stress', 'verify', 'Check the contact stress between roller and cam with the radius of curvature shown.')],
        });
    },
    "bolt-torque-coefficient-yield": (v) => {
      if (!(v.Di < v.Do)) return invalid('The inside diameter of the bearing face must be smaller than the outside diameter.');
      const d2 = v.d - 0.649515 * v.P, d1 = v.d - 1.082532 * v.P, d3 = d1 - 0.866025 * v.P / 6, As = PI / 4 * ((d2 + d3) / 2) ** 2, dA = Math.sqrt(4 * As / PI);
      const be = Math.atan(v.P / (PI * v.d)), ap = Math.atan(Math.tan(rad(v.alpha)) * Math.cos(be)), Dw = 2 / 3 * (v.Do ** 3 - v.Di ** 3) / (v.Do ** 2 - v.Di ** 2);
      const th = v.P / PI + v.mus * d2 / Math.cos(ap), bw = v.muw * Dw, K = (th + bw) / (2 * v.d), Ffy = v.sy * As / Math.sqrt(1 + 3 * (2 / dA * th) ** 2), Tfy = K * Ffy * v.d / 1000;
      const Ff = v.Tapp > 0 ? v.Tapp * 1000 / (K * v.d) : 0, share = Ff / Ffy, ok = share <= 1;
      return output({ d2, d3, As, dA, be: deg(be), ap: deg(ap), Dw, K, shareT: th / (th + bw), Ffy, Tfy, Ff, share }, 'Torque coefficient K', K,
        [m('Pitch diameter d2 / d3', `${q(d2, 'mm', 5)} / ${q(d3, 'mm', 5)}`), m('Stress area As / equivalent diameter dA', `${q(As, 'mm²', 5)} / ${q(dA, 'mm', 4)}`), m('Lead angle β / flank angle α′', `${q(deg(be), '°', 4)} / ${q(deg(ap), '°', 4)}`), m('Equivalent bearing diameter Dw', q(Dw, 'mm', 4)), m('Torque coefficient K', q(K, '', 4)), m('Share of torque in the threads / under the head', `${q(100 * th / (th + bw), '%', 3)} / ${q(100 * bw / (th + bw), '%', 3)}`), m('Yield clamping force Ffy', q(Ffy, 'N', 5)), m('Torque to reach yield Tfy', q(Tfy, 'N·m', 4)), m('Preload from your torque', v.Tapp > 0 ? `${q(Ff, 'N', 5)} (${q(100 * share, '%', 3)} of Ffy)` : 'No torque entered')],
        'Bolt torque coefficient and yield clamping force.', 'JIS B 1803 torque–tension relations as given in the handbook.', {
          text: ok ? 'TORQUE BELOW YIELD' : 'TORQUE TAKES THE BOLT PAST YIELD', tone: ok ? 'good' : 'bad',
          checks: [check('Yield', ok ? 'pass' : 'fail', v.Tapp > 0 ? `${q(v.Tapp, 'N·m', 4)} against ${q(Tfy, 'N·m', 4)} to reach yield.` : 'No torque entered.'), check('Friction', 'verify', 'Friction coefficients depend on finish, coating and lubricant; measure them for critical joints.'), check('Bearing face', 'verify', `Dw ${q(Dw, 'mm', 4)} from the bearing face ${q(v.Di, 'mm', 4)} to ${q(v.Do, 'mm', 4)}.`)],
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
