// 2D geometric constraint solver for sketches.
//
// Variables: x,y per sketch point (the sketch origin is fixed), r per circle.
// Each relation or dimension adds residual equations. Newton steps use the
// weighted least-norm update, so geometry moves as little as possible and
// pulled variables (opts.drag, high weight) stay near their target values.
// Degrees of freedom and per-entity defined state come from the rank of the
// Jacobian, which also finds redundant (over-defining) relations.

const TOL = 1e-9;

export function entityMap(sketch) {
  const m = new Map();
  for (const e of sketch.entities) m.set(e.id, e);
  return m;
}

function buildVars(sketch) {
  const idx = new Map(); // key "id.x" | "id.y" | "id.r" -> index
  const vals = [];
  for (const e of sketch.entities) {
    if (e.type === 'point') {
      idx.set(e.id + '.x', vals.length); vals.push(e.x);
      idx.set(e.id + '.y', vals.length); vals.push(e.y);
    } else if (e.type === 'circle') {
      idx.set(e.id + '.r', vals.length); vals.push(e.r);
    }
  }
  return { idx, vals };
}

// Build equations: each {cid, vars:[indices], f:(p)=>residual}
function buildEquations(sketch, V, ents) {
  const eqs = [];
  const iv = (k) => V.idx.get(k);
  const P = (pid) => {
    if (pid === 'origin') return { x: () => 0, y: () => 0, vars: [] };
    const ix = iv(pid + '.x'), iy = iv(pid + '.y');
    if (ix === undefined) throw new Error('missing point ' + pid);
    return { x: (p) => p[ix], y: (p) => p[iy], vars: [ix, iy] };
  };
  const add = (cid, vars, f) => eqs.push({ cid, vars: [...new Set(vars)], f });
  const lineOf = (e) => [P(e.p1), P(e.p2)];
  const radiusOf = (e) => {
    if (e.type === 'circle') { const ir = iv(e.id + '.r'); return { f: (p) => p[ir], vars: [ir] }; }
    const c = P(e.center), s = P(e.start);
    return { f: (p) => Math.hypot(s.x(p) - c.x(p), s.y(p) - c.y(p)), vars: [...c.vars, ...s.vars] };
  };
  const centerOf = (e) => (e.type === 'point' ? P(e.id) : P(e.center));
  const isCurve = (e) => e && (e.type === 'circle' || e.type === 'arc');
  const isLine = (e) => e && e.type === 'line';
  const isPoint = (e) => e === 'origin' || (e && e.type === 'point');
  const get = (id) => (id === 'origin' ? 'origin' : ents.get(id));
  const ptOf = (id) => P(id);

  const pointOnLine = (cid, q, l) => {
    const [a, b] = lineOf(l);
    add(cid, [...q.vars, ...a.vars, ...b.vars], (p) => {
      const dx = b.x(p) - a.x(p), dy = b.y(p) - a.y(p);
      const L = Math.hypot(dx, dy) || 1e-12;
      return ((q.x(p) - a.x(p)) * dy - (q.y(p) - a.y(p)) * dx) / L;
    });
  };
  const pointOnCurve = (cid, q, c) => {
    const ctr = centerOf(c), r = radiusOf(c);
    add(cid, [...q.vars, ...ctr.vars, ...r.vars], (p) => Math.hypot(q.x(p) - ctr.x(p), q.y(p) - ctr.y(p)) - r.f(p));
  };
  const coincidentPts = (cid, a, b) => {
    add(cid, [...a.vars, ...b.vars], (p) => a.x(p) - b.x(p));
    add(cid, [...a.vars, ...b.vars], (p) => a.y(p) - b.y(p));
  };
  const dir = (l) => { const [a, b] = lineOf(l); return { vars: [...a.vars, ...b.vars], dx: (p) => b.x(p) - a.x(p), dy: (p) => b.y(p) - a.y(p) }; };
  const pointLineDist = (q, l) => {
    const [a, b] = lineOf(l);
    return { vars: [...q.vars, ...a.vars, ...b.vars], f: (p) => {
      const dx = b.x(p) - a.x(p), dy = b.y(p) - a.y(p);
      const L = Math.hypot(dx, dy) || 1e-12;
      return Math.abs((q.x(p) - a.x(p)) * dy - (q.y(p) - a.y(p)) * dx) / L;
    } };
  };
  // Resolve a distance reference to a point-like (curves measure to center)
  const asPoint = (id) => { const e = get(id); if (isPoint(e)) return ptOf(id); if (isCurve(e)) return centerOf(e); return null; };

  // Arc consistency: end on the same radius as start
  for (const e of sketch.entities) {
    if (e.type === 'arc') {
      const c = P(e.center), s = P(e.start), t = P(e.end);
      add('arc:' + e.id, [...c.vars, ...s.vars, ...t.vars], (p) =>
        Math.hypot(t.x(p) - c.x(p), t.y(p) - c.y(p)) - Math.hypot(s.x(p) - c.x(p), s.y(p) - c.y(p)));
    }
  }

  for (const c of sketch.constraints) {
    if (c.driven || c.suppressed) continue;
    const r = c.refs.map(get);
    if (r.some((x) => !x)) continue;
    const cid = c.id;
    switch (c.type) {
      case 'coincident': {
        const [A, B] = r;
        if (isPoint(A) && isPoint(B)) coincidentPts(cid, ptOf(c.refs[0]), ptOf(c.refs[1]));
        else if (isPoint(A) && isLine(B)) pointOnLine(cid, ptOf(c.refs[0]), B);
        else if (isPoint(B) && isLine(A)) pointOnLine(cid, ptOf(c.refs[1]), A);
        else if (isPoint(A) && isCurve(B)) pointOnCurve(cid, ptOf(c.refs[0]), B);
        else if (isPoint(B) && isCurve(A)) pointOnCurve(cid, ptOf(c.refs[1]), A);
        break;
      }
      case 'horizontal': case 'vertical': {
        let a, b;
        if (r.length === 1 && isLine(r[0])) [a, b] = lineOf(r[0]);
        else if (r.length === 2) { a = asPoint(c.refs[0]); b = asPoint(c.refs[1]); }
        if (!a || !b) break;
        if (c.type === 'horizontal') add(cid, [...a.vars, ...b.vars], (p) => b.y(p) - a.y(p));
        else add(cid, [...a.vars, ...b.vars], (p) => b.x(p) - a.x(p));
        break;
      }
      case 'parallel': case 'perpendicular': {
        const d1 = dir(r[0]), d2 = dir(r[1]);
        add(cid, [...d1.vars, ...d2.vars], (p) => {
          const a = d1.dx(p), b = d1.dy(p), u = d2.dx(p), v = d2.dy(p);
          const n = (Math.hypot(a, b) * Math.hypot(u, v)) || 1e-12;
          return c.type === 'parallel' ? (a * v - b * u) / n : (a * u + b * v) / n;
        });
        break;
      }
      case 'collinear': {
        const [a, b] = lineOf(r[1]);
        pointOnLine(cid, a, r[0]); pointOnLine(cid, b, r[0]);
        break;
      }
      case 'equal': {
        if (isLine(r[0]) && isLine(r[1])) {
          const d1 = dir(r[0]), d2 = dir(r[1]);
          add(cid, [...d1.vars, ...d2.vars], (p) => Math.hypot(d1.dx(p), d1.dy(p)) - Math.hypot(d2.dx(p), d2.dy(p)));
        } else if (isCurve(r[0]) && isCurve(r[1])) {
          const r1 = radiusOf(r[0]), r2 = radiusOf(r[1]);
          add(cid, [...r1.vars, ...r2.vars], (p) => r1.f(p) - r2.f(p));
        }
        break;
      }
      case 'tangent': {
        let L = r.find(isLine), C = r.filter(isCurve);
        // Line and arc joined at an endpoint: radius at the joint is perpendicular to the line.
        // (The distance form has a double root there and would read as redundant.)
        const shared = (a, b) => {
          const pa = a.type === 'line' ? [a.p1, a.p2] : a.type === 'arc' ? [a.start, a.end] : [];
          const pb = b.type === 'line' ? [b.p1, b.p2] : b.type === 'arc' ? [b.start, b.end] : [];
          return pa.find((p) => pb.includes(p));
        };
        const joint = r.length === 2 ? shared(r[0], r[1]) : null;
        if (joint && L && C.length === 1) {
          const q = P(joint), c = centerOf(C[0]), d = dir(L);
          add(cid, [...q.vars, ...c.vars, ...d.vars], (p) => {
            const rx = q.x(p) - c.x(p), ry = q.y(p) - c.y(p), a = d.dx(p), b = d.dy(p);
            return (rx * a + ry * b) / ((Math.hypot(rx, ry) * Math.hypot(a, b)) || 1e-12);
          });
        } else if (joint && C.length === 2) {
          const q = P(joint), c1 = centerOf(C[0]), c2 = centerOf(C[1]);
          add(cid, [...q.vars, ...c1.vars, ...c2.vars], (p) => {
            const ax = q.x(p) - c1.x(p), ay = q.y(p) - c1.y(p), bx = q.x(p) - c2.x(p), by = q.y(p) - c2.y(p);
            return (ax * by - ay * bx) / ((Math.hypot(ax, ay) * Math.hypot(bx, by)) || 1e-12);
          });
        } else if (L && C.length === 1) {
          const d = pointLineDist(centerOf(C[0]), L), rr = radiusOf(C[0]);
          add(cid, [...d.vars, ...rr.vars], (p) => d.f(p) - rr.f(p));
        } else if (C.length === 2) {
          const c1 = centerOf(C[0]), c2 = centerOf(C[1]), r1 = radiusOf(C[0]), r2 = radiusOf(C[1]);
          add(cid, [...c1.vars, ...c2.vars, ...r1.vars, ...r2.vars], (p) => {
            const d = Math.hypot(c1.x(p) - c2.x(p), c1.y(p) - c2.y(p));
            const a = r1.f(p), b = r2.f(p);
            return d < Math.max(a, b) ? d - Math.abs(a - b) : d - (a + b);
          });
        }
        break;
      }
      case 'concentric': coincidentPts(cid, centerOf(r[0]), centerOf(r[1])); break;
      case 'midpoint': {
        const q = ptOf(c.refs[0]); const [a, b] = lineOf(r[1]);
        add(cid, [...q.vars, ...a.vars, ...b.vars], (p) => q.x(p) - (a.x(p) + b.x(p)) / 2);
        add(cid, [...q.vars, ...a.vars, ...b.vars], (p) => q.y(p) - (a.y(p) + b.y(p)) / 2);
        break;
      }
      case 'symmetric': {
        const q1 = asPoint(c.refs[0]), q2 = asPoint(c.refs[1]); const L = r[2];
        const [a, b] = lineOf(L);
        const vars = [...q1.vars, ...q2.vars, ...a.vars, ...b.vars];
        add(cid, vars, (p) => {
          const dx = b.x(p) - a.x(p), dy = b.y(p) - a.y(p), n = Math.hypot(dx, dy) || 1e-12;
          const mx = (q1.x(p) + q2.x(p)) / 2, my = (q1.y(p) + q2.y(p)) / 2;
          return ((mx - a.x(p)) * dy - (my - a.y(p)) * dx) / n;
        });
        add(cid, vars, (p) => {
          const dx = b.x(p) - a.x(p), dy = b.y(p) - a.y(p), n = Math.hypot(dx, dy) || 1e-12;
          return ((q2.x(p) - q1.x(p)) * dx + (q2.y(p) - q1.y(p)) * dy) / n;
        });
        break;
      }
      case 'fix': {
        const e = r[0];
        const pts = isPoint(e) ? [c.refs[0]] : isLine(e) ? [e.p1, e.p2] : isCurve(e) ? [e.center] : [];
        const at = c.at || {};
        for (const pid of pts) {
          if (pid === 'origin') continue;
          const q = P(pid); const ent = ents.get(pid);
          const fx = at[pid] ? at[pid][0] : ent.x, fy = at[pid] ? at[pid][1] : ent.y;
          c.at = { ...at, [pid]: [fx, fy] };
          add(cid, q.vars, (p) => q.x(p) - fx);
          add(cid, q.vars, (p) => q.y(p) - fy);
        }
        if (e.type === 'circle') { const rr = radiusOf(e); const r0 = c.r0 ?? e.r; c.r0 = r0; add(cid, rr.vars, (p) => rr.f(p) - r0); }
        break;
      }
      case 'distance': {
        const v = +c.value;
        let A = c.refs[0], B = c.refs[1];
        const eA = get(A);
        if (c.refs.length === 1 && isLine(eA)) { A = eA.p1; B = eA.p2; }
        const eB = get(B);
        const ea = get(A);
        if ((isPoint(ea) || isCurve(ea)) && (isPoint(eB) || isCurve(eB))) {
          const a = asPoint(A), b = asPoint(B);
          const vars = [...a.vars, ...b.vars];
          if (c.orient === 'horizontal') add(cid, vars, (p) => { const d = b.x(p) - a.x(p); return (d < 0 ? -d : d) - v; });
          else if (c.orient === 'vertical') add(cid, vars, (p) => { const d = b.y(p) - a.y(p); return (d < 0 ? -d : d) - v; });
          else add(cid, vars, (p) => Math.hypot(b.x(p) - a.x(p), b.y(p) - a.y(p)) - v);
        } else if (isLine(ea) && isLine(eB)) {
          const d = pointLineDist(P(eB.p1), ea);
          add(cid, d.vars, (p) => d.f(p) - v);
        } else {
          const L = isLine(ea) ? ea : eB; const Q = isLine(ea) ? B : A;
          const d = pointLineDist(asPoint(Q), L);
          add(cid, d.vars, (p) => d.f(p) - v);
        }
        break;
      }
      case 'diameter': case 'radius': {
        const rr = radiusOf(r[0]); const v = +c.value * (c.type === 'diameter' ? 0.5 : 1);
        add(cid, rr.vars, (p) => rr.f(p) - v);
        break;
      }
      case 'angle': {
        // The value is the angle between the lines' directions (p1 to p2), or its supplement with
        // `supplement: true`: exactly what measure() reports, so a dimension can be set across 90 degrees.
        // Only the mirror image (sign) is free. A dimension that does not say is given a side once, from
        // the geometry it was drawn with (SOLIDWORKS fixes the side when the dimension is placed).
        const d1 = dir(r[0]), d2 = dir(r[1]);
        const v = (+c.value * Math.PI) / 180;
        const thAt = (p) => { const a = d1.dx(p), b = d1.dy(p), u = d2.dx(p), w = d2.dy(p); return Math.atan2(a * w - b * u, a * u + b * w); };
        if (c.supplement === undefined || c.supplement === null) c.supplement = angleSide(+c.value, Math.abs(thAt(V.vals)) * 180 / Math.PI);
        const targets = c.supplement ? [Math.PI - v, v - Math.PI] : [v, -v];
        add(cid, [...d1.vars, ...d2.vars], (p) => {
          const th = thAt(p);
          let best = Infinity;
          for (const t of targets) {
            let d = th - t; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
            if (Math.abs(d) < Math.abs(best)) best = d;
          }
          return best;
        });
        break;
      }
      default: break;
    }
  }
  return eqs;
}

/** Whether an angle dimension's value means the supplement of the measured directional angle (degrees). */
function angleSide(value, measured) { return Math.abs(value - (180 - measured)) < Math.abs(value - measured); }

/** Give every angle dimension that does not say which angle it measures its side, from the geometry as
 * drawn. Call before changing a value on a copy of a sketch (an equation or parameter), so a new value across 90
 * degrees is read on the same side. */
export function angleSides(sketch) {
  for (const c of sketch.constraints || []) {
    if (c.type !== 'angle' || (c.supplement !== undefined && c.supplement !== null)) continue;
    try { c.supplement = angleSide(+c.value, measure(sketch, { ...c, supplement: false })); } catch (_) { /* bad refs: the solve reports them */ }
  }
  return sketch;
}

function residuals(eqs, p) { return eqs.map((e) => e.f(p)); }

function jacobian(eqs, p, n) {
  const J = eqs.map(() => new Float64Array(n));
  eqs.forEach((e, i) => {
    for (const j of e.vars) {
      const h = 1e-7 * Math.max(1, Math.abs(p[j]));
      const o = p[j];
      p[j] = o + h; const fp = e.f(p);
      p[j] = o - h; const fm = e.f(p);
      p[j] = o;
      J[i][j] = (fp - fm) / (2 * h);
    }
  });
  return J;
}

// Solve A x = b (dense, partial pivoting). A is modified.
function linsolve(A, b) {
  const n = b.length;
  for (let k = 0; k < n; k++) {
    let piv = k, best = Math.abs(A[k][k]);
    for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > best) { best = Math.abs(A[i][k]); piv = i; }
    if (best < 1e-300) continue;
    if (piv !== k) { [A[k], A[piv]] = [A[piv], A[k]]; [b[k], b[piv]] = [b[piv], b[k]]; }
    for (let i = k + 1; i < n; i++) {
      const f = A[i][k] / A[k][k];
      if (f === 0) continue;
      for (let j = k; j < n; j++) A[i][j] -= f * A[k][j];
      b[i] -= f * b[k];
    }
  }
  const x = new Float64Array(n);
  for (let k = n - 1; k >= 0; k--) {
    let s = b[k];
    for (let j = k + 1; j < n; j++) s -= A[k][j] * x[j];
    x[k] = Math.abs(A[k][k]) < 1e-300 ? 0 : s / A[k][k];
  }
  return x;
}

const norm = (r) => Math.sqrt(r.reduce((s, v) => s + v * v, 0));

/** Jacobian rows over a few variables only (`vars`, global indices): row i, column k = d eqs[i] / d p[vars[k]]. */
function localJacobian(eqs, p, col) {
  const n = col.size;
  return eqs.map((e) => {
    const row = new Float64Array(n);
    for (const j of e.vars) {
      const h = 1e-7 * Math.max(1, Math.abs(p[j]));
      const o = p[j];
      p[j] = o + h; const fp = e.f(p);
      p[j] = o - h; const fm = e.f(p);
      p[j] = o;
      row[col.get(j)] = (fp - fm) / (2 * h);
    }
    return row;
  });
}

function newton(eqs, p, w, vars, maxIter = 60) {
  const n = vars.length, m = eqs.length;
  if (!m) return { converged: true, res: 0 };
  const col = new Map(vars.map((j, k) => [j, k]));
  const locals = eqs.map((e) => e.vars.map((j) => col.get(j)));
  let r = residuals(eqs, p), rn = norm(r);
  for (let it = 0; it < maxIter && rn > TOL; it++) {
    const J = localJacobian(eqs, p, col);
    // (J W^-1 J^T + mu I) y = r ; dx = -W^-1 J^T y
    const A = Array.from({ length: m }, () => new Float64Array(m));
    for (let i = 0; i < m; i++) {
      for (let k = i; k < m; k++) {
        let s = 0;
        for (const q of locals[i]) s += (J[i][q] * J[k][q]) / w[vars[q]];
        A[i][k] = s; A[k][i] = s;
      }
      A[i][i] += 1e-12 + 1e-10 * A[i][i];
    }
    const y = linsolve(A, Float64Array.from(r));
    const dx = new Float64Array(n);
    for (let i = 0; i < m; i++) for (const q of locals[i]) dx[q] -= (J[i][q] * y[i]) / w[vars[q]];
    let step = 1, improved = false;
    const p0 = vars.map((j) => p[j]);
    for (let ls = 0; ls < 12; ls++) {
      for (let q = 0; q < n; q++) p[vars[q]] = p0[q] + step * dx[q];
      const r2 = residuals(eqs, p), rn2 = norm(r2);
      if (rn2 < rn || rn2 < TOL) { r = r2; rn = rn2; improved = true; break; }
      step *= 0.5;
    }
    if (!improved) { for (let q = 0; q < n; q++) p[vars[q]] = p0[q]; break; }
  }
  return { converged: rn < 1e-7, res: rn };
}

// Row-space analysis by incremental Gram-Schmidt: rank, redundant rows, determined vars (local to `vars`).
function analyse(eqs, p, vars) {
  const n = vars.length;
  const J = localJacobian(eqs, p, new Map(vars.map((j, k) => [j, k])));
  const Q = [];
  const redundant = [];
  J.forEach((row, i) => {
    const v = Float64Array.from(row);
    const n0 = norm(v);
    if (n0 < 1e-12) { redundant.push(i); return; }
    for (let pass = 0; pass < 2; pass++) {
      for (const q of Q) {
        let d = 0; for (let j = 0; j < n; j++) d += v[j] * q[j];
        if (d) for (let j = 0; j < n; j++) v[j] -= d * q[j];
      }
    }
    const nv = norm(v);
    if (nv < 1e-7 * n0) { redundant.push(i); return; }
    for (let j = 0; j < n; j++) v[j] /= nv;
    Q.push(v);
  });
  const determined = new Float64Array(n);
  for (const q of Q) for (let j = 0; j < n; j++) determined[j] += q[j] * q[j];
  return { rank: Q.length, redundant, determined: Array.from(determined, (s) => s > 1 - 1e-6) };
}

/** Independent parts of a sketch: equations that share no variable never affect each other, so each group is
 * solved and analysed on its own (a sketch of 441 converted circles was one dense 1300-variable problem). */
function groups(eqs, nvars) {
  const parent = Array.from({ length: nvars }, (_, i) => i);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  for (const e of eqs) for (let k = 1; k < e.vars.length; k++) { const a = find(e.vars[0]), b = find(e.vars[k]); if (a !== b) parent[a] = b; }
  const byRoot = new Map();
  eqs.forEach((e, i) => {
    if (!e.vars.length) { byRoot.set(`none${i}`, { eqs: [i], vars: [] }); return; }
    const r = find(e.vars[0]);
    if (!byRoot.has(r)) byRoot.set(r, { eqs: [], vars: [] });
    byRoot.get(r).eqs.push(i);
  });
  for (let j = 0; j < nvars; j++) { const g = byRoot.get(find(j)); if (g) g.vars.push(j); }
  return [...byRoot.values()];
}

/**
 * Solve a sketch in place.
 * opts.drag: [{key:'p3.x', value}, ...] variables to pull toward these values.
 * Returns {ok, dof, status, entityState: Map(id -> 'under'|'fully'|'over'), conflicts: Set(cid)}
 */
export function solveSketch(sketch, opts = {}) {
  const ents = entityMap(sketch);
  const V = buildVars(sketch);
  const p = Float64Array.from(V.vals);
  const w = new Float64Array(p.length).fill(1);
  let eqs;
  try { eqs = buildEquations(sketch, V, ents); } catch (err) { return { ok: false, error: String(err), dof: 0, status: 'over', entityState: new Map(), conflicts: new Set() }; }

  const backup = Float64Array.from(p);
  if (opts.drag) {
    for (const d of opts.drag) {
      const j = V.idx.get(d.key);
      if (j === undefined) continue;
      p[j] = d.value; w[j] = 1e6;
    }
  }
  const parts = groups(eqs, p.length).map((g) => ({ ...g, list: g.eqs.map((i) => eqs[i]) }));
  const solveAll = () => parts.reduce((ok, g) => newton(g.list, p, w, g.vars).converged && ok, true);
  let converged = solveAll();
  if (!converged && opts.drag) {
    // Pulled into an impossible spot: fall back to solving from the original geometry.
    p.set(backup); w.fill(1);
    converged = solveAll();
    if (!converged) p.set(backup);
  }
  const res = { converged };
  const conflicts = new Set();
  if (!res.converged) {
    const r = residuals(eqs, p);
    r.forEach((v, i) => { if (Math.abs(v) > 1e-6) conflicts.add(eqs[i].cid); });
  }
  const an = { rank: 0, determined: new Array(p.length).fill(false) };
  for (const g of parts) {
    const a = analyse(g.list, p, g.vars);
    an.rank += a.rank;
    for (const i of a.redundant) conflicts.add(g.list[i].cid);
    a.determined.forEach((d, q) => { an.determined[g.vars[q]] = d; });
  }
  // write back
  for (const e of sketch.entities) {
    if (e.type === 'point') { e.x = p[V.idx.get(e.id + '.x')]; e.y = p[V.idx.get(e.id + '.y')]; }
    else if (e.type === 'circle') e.r = p[V.idx.get(e.id + '.r')];
  }
  const dof = p.length - an.rank;
  const over = conflicts.size > 0;
  const varDet = (k) => { const j = V.idx.get(k); return j === undefined ? true : an.determined[j]; };
  const ptDet = (pid) => pid === 'origin' || (varDet(pid + '.x') && varDet(pid + '.y'));
  const entityState = new Map();
  for (const e of sketch.entities) {
    let det;
    if (e.type === 'point') det = ptDet(e.id);
    else if (e.type === 'line') det = ptDet(e.p1) && ptDet(e.p2);
    else if (e.type === 'circle') det = ptDet(e.center) && varDet(e.id + '.r');
    else if (e.type === 'arc') det = ptDet(e.center) && ptDet(e.start) && ptDet(e.end);
    else det = false;
    entityState.set(e.id, det ? 'fully' : 'under');
  }
  if (over) {
    const cmap = new Map(sketch.constraints.map((c) => [c.id, c]));
    for (const cid of conflicts) {
      const c = cmap.get(cid);
      const refs = c ? c.refs : [cid.replace(/^arc:/, '')];
      for (const id of refs) {
        if (!entityState.has(id)) continue;
        entityState.set(id, 'over');
        const e = ents.get(id);
        if (e && e.type === 'line') { entityState.set(e.p1, 'over'); entityState.set(e.p2, 'over'); }
      }
    }
  }
  const status = over ? 'over' : dof === 0 ? 'fully' : 'under';
  return { ok: res.converged, dof, status, entityState, conflicts };
}

// Measure the current value a dimension would have (used when placing Smart Dimension).
export function measure(sketch, c) {
  const ents = entityMap(sketch);
  const pt = (id) => {
    if (id === 'origin') return [0, 0];
    const e = ents.get(id);
    if (e.type === 'point') return [e.x, e.y];
    return pt(e.center);
  };
  const rad = (e) => (e.type === 'circle' ? e.r : Math.hypot(ents.get(e.start).x - pt(e.center)[0], ents.get(e.start).y - pt(e.center)[1]));
  const get = (id) => (id === 'origin' ? { type: 'point', id } : ents.get(id));
  const lineDist = (q, l) => {
    const a = pt(l.p1), b = pt(l.p2); const dx = b[0] - a[0], dy = b[1] - a[1];
    return Math.abs((q[0] - a[0]) * dy - (q[1] - a[1]) * dx) / (Math.hypot(dx, dy) || 1e-12);
  };
  if (c.type === 'diameter') return 2 * rad(get(c.refs[0]));
  if (c.type === 'radius') return rad(get(c.refs[0]));
  if (c.type === 'angle') {
    const l1 = get(c.refs[0]), l2 = get(c.refs[1]);
    const a = pt(l1.p1), b = pt(l1.p2), u = pt(l2.p1), v = pt(l2.p2);
    const d1 = [b[0] - a[0], b[1] - a[1]], d2 = [v[0] - u[0], v[1] - u[1]];
    const th = Math.abs(Math.atan2(d1[0] * d2[1] - d1[1] * d2[0], d1[0] * d2[0] + d1[1] * d2[1])) * 180 / Math.PI;
    return c.supplement ? 180 - th : th;
  }
  let A = c.refs[0], B = c.refs[1];
  const eA = get(A);
  if (c.refs.length === 1 && eA.type === 'line') { A = eA.p1; B = eA.p2; }
  const ea = get(A), eb = get(B);
  if (ea.type === 'line' && eb.type === 'line') return lineDist(pt(eb.p1), ea);
  if (ea.type === 'line') return lineDist(pt(B), ea);
  if (eb.type === 'line') return lineDist(pt(A), eb);
  const a = pt(A), b = pt(B);
  if (c.orient === 'horizontal') return Math.abs(b[0] - a[0]);
  if (c.orient === 'vertical') return Math.abs(b[1] - a[1]);
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

// For define_cli.mjs (server: Fully Define for sketches made by feature recognition). Same equations as solveSketch.
export const _internals = { buildVars, buildEquations, jacobian, entityMap };
