// Assembly mate solver in the browser: a port of assembly.py `solve` and the solving half of
// `regen_assembly`. Same maths, same results; tests/test_solver_parity.py runs both on the same
// assemblies and fails if they disagree. No imports, so node can run it too.
//
// The browser solves whenever no part has changed (drag, mates, Fix/Float, suppress, previews), so
// none of that waits on the server. The server rebuilds parts (build123d) and moves mate references
// onto the rebuilt faces; it is only asked when a part's content changes.

const NAMED = {
  'Front Plane': ['plane', [0, 0, 0], [0, 0, 1]],
  'Top Plane': ['plane', [0, 0, 0], [0, 1, 0]],
  'Right Plane': ['plane', [0, 0, 0], [1, 0, 0]],
  Origin: ['point', [0, 0, 0], null],
  'X axis': ['axis', [0, 0, 0], [1, 0, 0]],
  'Y axis': ['axis', [0, 0, 0], [0, 1, 0]],
  'Z axis': ['axis', [0, 0, 0], [0, 0, 1]],
};
const MATE_TYPES = new Set(['coincident', 'concentric', 'parallel', 'perpendicular', 'distance', 'angle', 'lock',
  'hinge', 'limit_distance', 'limit_angle', 'coupler']);
const REF_KEYS = ['refs', 'planes', 'angle_refs', 'input_refs'];

class AssemblyError extends Error {}

// ------------------------------------------------------------------ small linear algebra
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => Math.sqrt(a.reduce((s, x) => s + x * x, 0));
const mv = (R, v) => [dot(R[0], v), dot(R[1], v), dot(R[2], v)];
const mT = (R) => [[R[0][0], R[1][0], R[2][0]], [R[0][1], R[1][1], R[2][1]], [R[0][2], R[1][2], R[2][2]]];
const mm = (A, B) => A.map((row) => [0, 1, 2].map((j) => row[0] * B[0][j] + row[1] * B[1][j] + row[2] * B[2][j]));
const eye3 = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

export function clean(v, nd = 6) {
  const f = 10 ** nd;
  const x = Math.round(Number(v) * f) / f;
  return x === 0 ? 0 : x;
}

/** R = Rz * Ry * Rx, angles in degrees (rotations about the fixed assembly axes). */
export function rotEuler(r) {
  const [a, b, c] = (r || [0, 0, 0]).map((v) => (Number(v) * Math.PI) / 180);
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
  const rx = [[1, 0, 0], [0, ca, -sa], [0, sa, ca]];
  const ry = [[cb, 0, sb], [0, 1, 0], [-sb, 0, cb]];
  const rz = [[cc, -sc, 0], [sc, cc, 0], [0, 0, 1]];
  return mm(mm(rz, ry), rx);
}

export function eulerOf(R) {
  const sb = Math.max(-1, Math.min(1, -R[2][0]));
  const b = Math.asin(sb);
  let a, c;
  if (Math.abs(sb) < 0.999999) { a = Math.atan2(R[2][1], R[2][2]); c = Math.atan2(R[1][0], R[0][0]); }
  else { a = 0; c = Math.atan2(-R[0][1], R[1][1]); } // gimbal lock: put everything in z
  return [a, b, c].map((v) => clean((v * 180) / Math.PI));
}

function expm(w) {
  const th = norm(w);
  if (th < 1e-12) return eye3();
  const k = mul(w, 1 / th);
  const K = [[0, -k[2], k[1]], [k[2], 0, -k[0]], [-k[1], k[0], 0]];
  const KK = mm(K, K), s = Math.sin(th), c1 = 1 - Math.cos(th);
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? 1 : 0) + s * K[i][j] + c1 * KK[i][j]));
}

/**
 * Singular value decomposition by one-sided Jacobi (Hestenes). A: m rows of n numbers.
 * Returns {s, U, V}: singular values in descending order, U and V as arrays of columns (V full,
 * n columns, so the trailing columns span the null space). Accurate to near machine precision,
 * which the rank tests below rely on.
 */
export function svd(A, n = A.length ? A[0].length : 0) {
  const m = A.length;
  const B = Array.from({ length: n }, (_, j) => Float64Array.from({ length: m }, (_, i) => A[i][j]));
  const V = Array.from({ length: n }, (_, j) => { const c = new Float64Array(n); c[j] = 1; return c; });
  for (let sweep = 0; sweep < 80; sweep++) {
    let rotated = false;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const bp = B[p], bq = B[q];
        let a = 0, b = 0, c = 0;
        for (let i = 0; i < m; i++) { a += bp[i] * bp[i]; b += bq[i] * bq[i]; c += bp[i] * bq[i]; }
        if (c === 0 || Math.abs(c) <= 1e-15 * Math.sqrt(a * b)) continue;
        rotated = true;
        const zeta = (b - a) / (2 * c);
        const t = (zeta >= 0 ? 1 : -1) / (Math.abs(zeta) + Math.sqrt(1 + zeta * zeta));
        const cs = 1 / Math.sqrt(1 + t * t), sn = cs * t;
        for (let i = 0; i < m; i++) { const x = bp[i], y = bq[i]; bp[i] = cs * x - sn * y; bq[i] = sn * x + cs * y; }
        const vp = V[p], vq = V[q];
        for (let i = 0; i < n; i++) { const x = vp[i], y = vq[i]; vp[i] = cs * x - sn * y; vq[i] = sn * x + cs * y; }
      }
    }
    if (!rotated) break;
  }
  const sv = B.map((col) => Math.sqrt(col.reduce((s, x) => s + x * x, 0)));
  const order = sv.map((_, j) => j).sort((i, j) => sv[j] - sv[i]);
  return {
    s: order.map((j) => sv[j]),
    U: order.map((j) => (sv[j] > 0 ? Array.from(B[j], (x) => x / sv[j]) : Array.from(B[j], () => 0))),
    V: order.map((j) => Array.from(V[j])),
  };
}

function orthonormal(R) {
  const { U, V } = svd(R, 3); // R = U S V^T  ->  U V^T
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => U[0][i] * V[0][j] + U[1][i] * V[1][j] + U[2][i] * V[2][j]));
}

/** Solve (A) x = b by Gaussian elimination with partial pivoting; null when singular. */
function linsolve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    if (!(Math.abs(M[p][k]) > 1e-300)) return null;
    [M[k], M[p]] = [M[p], M[k]];
    for (let i = k + 1; i < n; i++) {
      const f = M[i][k] / M[k][k];
      if (f) for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n];
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j];
    x[i] = s / M[i][i];
  }
  return x.every(Number.isFinite) ? x : null;
}

/** Minimum-norm least squares (numpy lstsq with rcond). */
function lstsq(A, b, rcond = 1e-9) {
  const n = A.length ? A[0].length : 0;
  const { s, U, V } = svd(A, n);
  const x = new Array(n).fill(0);
  const cut = rcond * (s[0] || 0);
  for (let k = 0; k < s.length; k++) {
    if (!(s[k] > cut)) continue;
    const c = U[k].reduce((acc, u, i) => acc + u * b[i], 0) / s[k];
    for (let j = 0; j < n; j++) x[j] += c * V[k][j];
  }
  return x;
}

// ------------------------------------------------------------------ poses and references
export class Pose {
  constructor(R = eye3(), t = [0, 0, 0]) { this.R = R; this.t = t; }
  static of(comp) { return new Pose(rotEuler(comp.rotation), (comp.position || [0, 0, 0]).map(Number)); }
  matrix() {
    const R = this.R, t = this.t;
    return [R[0][0], R[0][1], R[0][2], t[0], R[1][0], R[1][1], R[1][2], t[1], R[2][0], R[2][1], R[2][2], t[2], 0, 0, 0, 1].map((v) => clean(v, 9));
  }
}

function refLocal(ref) {
  if (!ref || typeof ref !== 'object') throw new AssemblyError('A mate reference must be an object');
  if ('ref' in ref) {
    if (!NAMED[ref.ref]) throw new AssemblyError(`Unknown reference '${ref.ref}'`);
    const [k, p, d] = NAMED[ref.ref];
    return [k, p.slice(), d ? d.slice() : null];
  }
  const unit = (v) => { const l = norm(v) || 1; return mul(v, 1 / l); };
  if ('plane' in ref) {
    const pl = ref.plane;
    return ['plane', (pl.point || [0, 0, 0]).map(Number), unit((pl.normal || [0, 0, 1]).map(Number))];
  }
  if ('axis' in ref) {
    const ax = ref.axis;
    return ['axis', (ax.point || [0, 0, 0]).map(Number), unit((ax.dir || [0, 0, 1]).map(Number))];
  }
  if ('point' in ref) return ['point', ref.point.map(Number), null];
  throw new AssemblyError('A mate reference needs plane, axis, point or ref');
}

function refWorld(ref, poses) {
  const [k, p, d] = ref._l || refLocal(ref);
  const cid = ref.component;
  if (cid === undefined || cid === null) return [k, p, d];
  const P = poses[cid];
  return [k, add(mv(P.R, p), P.t), d ? mv(P.R, d) : null];
}

function resolveAlign(m, a, b) {
  const al = m.align || 'auto';
  if (al === 'anti' || al === 'aligned') return al;
  if (!a[2] || !b[2]) return 'anti';
  return dot(a[2], b[2]) < 0 ? 'anti' : 'aligned';
}

const ORDER = { plane: 0, axis: 1, point: 2 };

/** A coupler's driver or driven value (assembly.py coupler_measure). */
export function couplerMeasure(kind, a, b) {
  if (kind === 'angle') {
    if (!a[2] || !b[2]) throw new AssemblyError('An angle needs planes or axes');
    return (Math.acos(Math.max(-1, Math.min(1, dot(a[2], b[2])))) * 180) / Math.PI;
  }
  if (kind !== 'distance') throw new AssemblyError(`Unknown coupler measure '${kind}'`);
  if (ORDER[a[0]] > ORDER[b[0]]) [a, b] = [b, a];
  const d = sub(b[1], a[1]);
  if (a[0] === 'plane' && (b[0] === 'plane' || b[0] === 'point')) return dot(d, a[2]);
  if (a[0] === 'plane') throw new AssemblyError('A distance from a plane needs a plane or a point');
  if (a[0] === 'axis') return norm(cross(d, a[2]));
  return norm(d);
}

/** The current angle (deg) or distance (mm) between two references, with the components where they are now. */
export function measurePair(kind, refs, components) {
  try {
    const poses = Object.fromEntries((components || []).map((c) => [c.id, Pose.of(c)]));
    if (!refs || refs.length !== 2 || refs.some((r) => r.component != null && !poses[r.component])) return null;
    return couplerMeasure(kind, refWorld(refs[0], poses), refWorld(refs[1], poses));
  } catch (err) {
    if (err instanceof AssemblyError) return null;
    throw err;
  }
}

/** The coupler's motion law driver -> driven (assembly.py coupler_law; np.interp holds the ends). */
export function couplerLaw(m) {
  const law = m.law;
  if (law && law.length) {
    const pts = law.map((p) => (Array.isArray(p) && p.length === 2 && p[0] != null && p[1] != null ? [Number(p[0]), Number(p[1])] : [NaN, NaN]));
    if (pts.some((p) => Number.isNaN(p[0]) || Number.isNaN(p[1]))) throw new AssemblyError('law needs [driver, driven] number pairs');
    if (pts.length < 2 || pts.some((p) => !Number.isFinite(p[0]) || !Number.isFinite(p[1]))) {
      throw new AssemblyError('law needs at least two [driver, driven] points');
    }
    for (let i = 1; i < pts.length; i++) if (pts[i][0] <= pts[i - 1][0]) throw new AssemblyError('law driver values must increase');
    return (v) => {
      if (v <= pts[0][0]) return pts[0][1];
      const n = pts.length;
      if (v >= pts[n - 1][0]) return pts[n - 1][1];
      let i = 1;
      while (pts[i][0] < v) i++;
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      return y0 + ((v - x0) * (y1 - y0)) / (x1 - x0);
    };
  }
  if (m.ratio == null) throw new AssemblyError('A coupler needs a law or a ratio');
  const r = Number(m.ratio), o = Number(m.offset || 0);
  return (v) => o + r * v;
}

function mateResidual(m, poses, L, align) {
  if (m.type === '_goal') {
    const P = poses[m.component];
    return mul(sub(add(mv(P.R, m.point), P.t), m.target), m.weight ?? 1e-2);
  }
  if (m.type === 'coupler') {
    if (!m.input_refs || m.input_refs.length !== 2) throw new AssemblyError('A coupler needs two driver references (input_refs)');
    const x = couplerMeasure(m.input || 'distance', refWorld(m.input_refs[0], poses), refWorld(m.input_refs[1], poses));
    const out = m.output || 'distance';
    const y = couplerMeasure(out, refWorld(m.refs[0], poses), refWorld(m.refs[1], poses));
    const e = y - (m._law || couplerLaw(m))(x);
    return [out === 'angle' ? ((e * Math.PI) / 180) * L : e];
  }
  let a = refWorld(m.refs[0], poses), b = refWorld(m.refs[1], poses);
  const t = m.type;
  let ka = a[0], kb = b[0];
  if (ORDER[ka] > ORDER[kb] && t !== 'lock' && t !== 'hinge') { [a, b] = [b, a]; [ka, kb] = [kb, ka]; }
  const pa = a[1], da = a[2], pb = b[1], db = b[2];
  const sgn = align === 'aligned' ? 1 : -1;
  const dirMatch = () => mul(sub(da, mul(db, sgn)), L);

  if (t === 'hinge') {
    const out = [...mateResidual({ type: 'concentric', refs: m.refs }, poses, L, align)];
    if (m.planes) out.push(...mateResidual({ type: 'coincident', refs: m.planes }, poses, L, m._plane_align || 'anti'));
    if (m.angle_refs && (m.angle_min != null || m.angle_max != null)) {
      out.push(...mateResidual({ type: 'limit_angle', refs: m.angle_refs, min: m.angle_min, max: m.angle_max }, poses, L, align));
    }
    return out;
  }
  if (t === 'limit_angle') {
    if (!da || !db) throw new AssemblyError('Angle limits need planes or axes');
    const ang = (Math.acos(Math.max(-1, Math.min(1, dot(da, db)))) * 180) / Math.PI;
    const lo = m.min, hi = m.max;
    const over = (hi != null ? Math.max(0, ang - hi) : 0) + (lo != null ? Math.max(0, lo - ang) : 0);
    return [((over * Math.PI) / 180) * L];
  }
  if (t === 'limit_distance') {
    const lo = m.min, hi = m.max;
    let v, par = [];
    if (ka === 'plane' && kb === 'plane') { v = dot(sub(pb, pa), da); par = dirMatch(); }
    else v = norm(sub(pb, pa));
    const over = (hi != null ? Math.max(0, v - hi) : 0) + (lo != null ? Math.max(0, lo - v) : 0);
    return [...par, over];
  }
  if (t === 'lock') {
    const ca = m.refs[0].component, cb = m.refs[1].component;
    const PA = ca ? poses[ca] : new Pose(), PB = cb ? poses[cb] : new Pose();
    const [Rr, tr] = m._pose;
    const RAt = mT(PA.R), Rrel = mm(RAt, PB.R);
    const out = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) out.push((Rrel[i][j] - Rr[i][j]) * L);
    return [...out, ...sub(mv(RAt, sub(PB.t, PA.t)), tr)];
  }
  if (t === 'coincident') {
    if (ka === 'plane' && kb === 'plane') return [...dirMatch(), dot(sub(pb, pa), da)];
    if (ka === 'plane' && kb === 'axis') return [dot(db, da) * L, dot(sub(pb, pa), da)];
    if (ka === 'plane' && kb === 'point') return [dot(sub(pb, pa), da)];
    if (ka === 'axis' && kb === 'axis') return [...mul(cross(da, db), L), ...cross(sub(pb, pa), da)];
    if (ka === 'axis' && kb === 'point') return cross(sub(pb, pa), da);
    return sub(pb, pa);
  }
  if (t === 'concentric') {
    if (ka !== 'axis' || kb !== 'axis') throw new AssemblyError('Concentric needs two axes (cylindrical faces)');
    return [...mul(cross(da, db), L), ...cross(sub(pb, pa), da)];
  }
  if (t === 'parallel' || t === 'perpendicular' || t === 'angle') {
    if (!da || !db) throw new AssemblyError(`${t[0].toUpperCase() + t.slice(1)} needs planes or axes`);
    if (t === 'parallel') return m.align === 'anti' || m.align === 'aligned' ? dirMatch() : mul(cross(da, db), L);
    if (t === 'perpendicular') return [dot(da, db) * L];
    const ang = (Number(m.value ?? 90) * Math.PI) / 180;
    return [(Math.abs(dot(da, db)) - Math.abs(Math.cos(ang))) * L];
  }
  if (t === 'distance') {
    const v = Number(m.value ?? 0) * (m.flip ? -1 : 1);
    if (ka === 'plane' && kb === 'plane') return [...dirMatch(), dot(sub(pb, pa), da) - v];
    if (ka === 'plane' && kb === 'point') return [dot(sub(pb, pa), da) - v];
    if (ka === 'axis' && kb === 'axis') return [...mul(cross(da, db), L), norm(cross(sub(pb, pa), da)) - Math.abs(v)];
    if (ka === 'point' && kb === 'point') return [norm(sub(pb, pa)) - Math.abs(v)];
    if (ka === 'axis' && kb === 'point') return [norm(cross(sub(pb, pa), da)) - Math.abs(v)];
    if (ka === 'plane' && kb === 'axis') return [dot(db, da) * L, dot(sub(pb, pa), da) - v];
  }
  throw new AssemblyError(`Unknown mate type '${t}'`);
}

// ------------------------------------------------------------------ solver

/**
 * Solve the mates (assembly.py `solve`, without face following: that needs the rebuilt solids and
 * happens on the server when a part changes). Returns {poses, mates, comp_state, dof, updates,
 * iterations, fixed}.
 * drag = {component, point (part coordinates), target (assembly coordinates)}.
 */
export function solve(asm, size = 100, drag = null) {
  const comps = (asm.components || []).filter((c) => !c.suppressed);
  const ids = new Set(comps.map((c) => c.id));
  let poses = Object.fromEntries(comps.map((c) => [c.id, Pose.of(c)]));
  const fixed = new Set(comps.filter((c) => c.fixed).map((c) => c.id));
  const L = Math.max(size, 1);
  const hard = [], report = {}, updates = {};
  const upd = (id) => (updates[id] = updates[id] || {});
  for (const m of asm.mates || []) {
    if (m.suppressed) { report[m.id] = { state: 'suppressed' }; continue; }
    try {
      if (!MATE_TYPES.has(m.type)) throw new AssemblyError(`Unknown mate type '${m.type}'`);
      if ((m.refs || []).length !== 2) throw new AssemblyError('A mate needs two references');
      const mmate = { ...m };
      let allCs = [];
      for (const key of REF_KEYS) {
        const lst = m[key];
        if (!lst || !lst.length) continue;
        if (lst.length !== 2) throw new AssemblyError(`${key} needs two references`);
        for (const r of lst) {
          if (r.component != null && !ids.has(r.component)) throw new AssemblyError(`Component ${r.component} is missing or suppressed`);
        }
        mmate[key] = lst.map((r) => ({ ...r, _l: refLocal(r) }));
        allCs = allCs.concat(lst.map((r) => r.component ?? null));
      }
      const refs = mmate.refs;
      const c0 = refs[0].component ?? null, c1 = refs[1].component ?? null;
      if (c0 !== null && c0 === c1) throw new AssemblyError('Both references are on the same component');
      const cs = [...new Set(allCs)];
      const a = refWorld(refs[0], poses), b = refWorld(refs[1], poses);
      if (m.type === 'hinge' && mmate.planes) {
        mmate._plane_align = resolveAlign({ align: m.align }, refWorld(mmate.planes[0], poses), refWorld(mmate.planes[1], poses));
      }
      const align = ['coincident', 'distance', 'parallel', 'limit_distance'].includes(m.type) ? resolveAlign(m, a, b) : 'anti';
      if ((m.type === 'coincident' || m.type === 'distance') && (m.align || 'auto') === 'auto' && a[2] && b[2]) upd(m.id).align = align;
      if (m.type === 'lock') {
        let rel;
        if (m.pose) rel = [rotEuler(m.pose.rotation), (m.pose.position || [0, 0, 0]).map(Number)];
        else {
          const PA = cs[0] ? poses[cs[0]] : new Pose(), PB = cs[1] ? poses[cs[1]] : new Pose();
          rel = [mm(mT(PA.R), PB.R), mv(mT(PA.R), sub(PB.t, PA.t))];
          upd(m.id).pose = { position: rel[1].map((v) => clean(v)), rotation: eulerOf(rel[0]) };
        }
        mmate._pose = rel;
      }
      if (m.type === 'coupler') mmate._law = couplerLaw(m);
      mateResidual(mmate, poses, L, align); // validates the reference kinds
      hard.push([mmate, align, cs.filter((c) => c !== null)]);
      report[m.id] = { state: 'ok' };
    } catch (err) {
      if (!(err instanceof AssemblyError)) throw err;
      report[m.id] = { state: 'error', message: err.message };
    }
  }
  const orderIds = comps.map((c) => c.id);
  const byOrder = (x, y) => orderIds.indexOf(x) - orderIds.indexOf(y);
  const tol = Math.max(1e-6 * L, 1e-7);
  let iters = 0;

  // Drag: only the components linked to the dragged one (through mates, not through fixed
  // components) can move, so the rest of the assembly costs nothing.
  let goal = null, active = hard;
  if (drag && ids.has(drag.component) && !fixed.has(drag.component)) {
    const g = drag.component;
    const group = new Set([g]);
    for (let grew = true; grew;) {
      grew = false;
      for (const [, , cs] of hard) {
        if (cs.some((c) => group.has(c))) for (const c of cs) if (!fixed.has(c) && !group.has(c)) { group.add(c); grew = true; }
      }
    }
    active = hard.filter((x) => x[2].some((c) => group.has(c)));
    goal = [{ type: '_goal', id: '_goal', component: g, point: drag.point.map(Number), target: drag.target.map(Number), weight: 1 }, 'anti', [g]];
  }
  let free = [...new Set([...active.flatMap((x) => x[2]).filter((c) => !fixed.has(c)), ...(goal ? [goal[0].component] : [])])].sort(byOrder);
  let idx = Object.fromEntries(free.map((c, i) => [c, i]));
  let n = 6 * free.length;

  const perturbed = (P, c, j, h) => {
    const Q = { ...P }, p = P[c];
    if (j < 3) { const t = p.t.slice(); t[j] += h; Q[c] = new Pose(p.R, t); }
    else { const w = [0, 0, 0]; w[j - 3] = h / L; Q[c] = new Pose(mm(expm(w), p.R), p.t); }
    return Q;
  };
  const step = (P, dx) => {
    const Q = { ...P };
    for (const c of free) {
      const o = 6 * idx[c], v = dx.slice(o, o + 6);
      if (!v.some((x) => x)) continue;
      const p = P[c];
      Q[c] = new Pose(orthonormal(mm(expm(mul(v.slice(3), 1 / L)), p.R)), add(p.t, v.slice(0, 3)));
    }
    return Q;
  };

  // Residuals and finite-difference Jacobian of a list of mates over the free components.
  const system = (ms) => {
    const byComp = Object.fromEntries(free.map((c) => [c, ms.map((x, k) => (x[2].includes(c) ? k : -1)).filter((k) => k >= 0)]));
    const S = {
      parts(P, subset = null) {
        const out = [];
        ms.forEach(([m, al], k) => { if (!subset || subset.has(k)) out.push(mateResidual(m, P, L, al)); });
        return out;
      },
      res(P) {
        const r = S.parts(P);
        S.offs = [0];
        for (const x of r) S.offs.push(S.offs[S.offs.length - 1] + x.length);
        return r.flat();
      },
      jac(P, r0) {
        const offs = S.offs, J = r0.map(() => new Array(n).fill(0)), h = 1e-6 * L;
        for (const c of free) {
          const ks = byComp[c];
          if (!ks.length) continue;
          const kset = new Set(ks);
          for (let j = 0; j < 6; j++) {
            const rr = S.parts(perturbed(P, c, j, h), kset), col = 6 * idx[c] + j;
            ks.forEach((k, q) => { for (let i = offs[k]; i < offs[k + 1]; i++) J[i][col] = (rr[q][i - offs[k]] - r0[i]) / h; });
          }
        }
        return J;
      },
    };
    return S;
  };
  const sq = (r) => r.reduce((s, x) => s + x * x, 0);

  // Make every mate hold, moving the free components as little as possible.
  const runLM = (P, S) => {
    let lam = 1e-3, r = S.res(P), cost = sq(r);
    for (let it = 1; it < 200; it++) {
      iters++;
      if (Math.sqrt(cost) < tol * 0.01) break;
      const J = S.jac(P, r);
      const A = Array.from({ length: n }, (_, i) => new Array(n).fill(0)), g = new Array(n).fill(0);
      for (let k = 0; k < J.length; k++) {
        const row = J[k];
        for (let i = 0; i < n; i++) {
          if (!row[i]) continue;
          g[i] += row[i] * r[k];
          for (let j = 0; j < n; j++) A[i][j] += row[i] * row[j];
        }
      }
      let improved = false, dx = new Array(n).fill(0);
      for (let tries = 0; tries < 12; tries++) {
        const Al = A.map((row, i) => row.map((v, j) => (i === j ? v + lam : v)));
        const sol = linsolve(Al, g);
        if (!sol) { lam *= 10; continue; }
        dx = sol.map((v) => -v);
        const Q = step(P, dx), r2 = S.res(Q), c2 = sq(r2);
        if (c2 < cost) { P = Q; r = r2; cost = c2; lam = Math.max(lam / 5, 1e-12); improved = true; break; }
        lam *= 10;
      }
      if (!improved || norm(dx) < 1e-12 * L) break;
    }
    S.res(P);
    return P;
  };

  // Rotations cost more than moves when the cursor can be followed either way, so a free part
  // slides with the cursor instead of tumbling; a hinge still turns (it has no other way).
  const D = free.flatMap(() => [1, 1, 1, 0.005, 0.005, 0.005]);

  // Constrained Gauss-Newton: each step keeps the mates (linearised) and moves the grabbed point as
  // close to the cursor as they allow, with the smallest motion.
  const runDrag = (P, S, nh) => {
    for (let it = 0; it < 40; it++) {
      iters++;
      const r = S.res(P);
      const J = S.jac(P, r).map((row) => row.map((v, j) => v * D[j]));
      const rm = r.slice(0, nh), rg = r.slice(nh), Jm = J.slice(0, nh), Jg = J.slice(nh);
      let y = new Array(n).fill(0), N;
      if (nh) {
        const { s, U, V } = svd(Jm, n);
        const rank = s.filter((x) => x > 1e-8 * Math.max(1, s[0] || 1)).length;
        for (let k = 0; k < rank; k++) {
          const c = U[k].reduce((acc, u, i) => acc + u * rm[i], 0) / s[k];
          for (let j = 0; j < n; j++) y[j] -= c * V[k][j];
        }
        N = V.slice(rank); // columns spanning the null space
      } else N = Array.from({ length: n }, (_, j) => { const c = new Array(n).fill(0); c[j] = 1; return c; });
      if (N.length) {
        const JgN = Jg.map((row) => N.map((col) => col.reduce((acc, v, j) => acc + v * row[j], 0)));
        const b = Jg.map((row, i) => -(row.reduce((acc, v, j) => acc + v * y[j], 0) + rg[i]));
        const z = lstsq(JgN, b, 1e-9);
        N.forEach((col, q) => { if (z[q]) for (let j = 0; j < n; j++) y[j] += z[q] * col[j]; });
      }
      const dx = y.map((v, j) => v * D[j]);
      let scale = 1; // trust region: no single step turns more than ~20 deg or moves more than L/5
      for (const c of free) {
        const o = 6 * idx[c], tn = norm(dx.slice(o, o + 3)), rn = norm(dx.slice(o + 3, o + 6)) / L;
        if (tn > 0.2 * L) scale = Math.min(scale, (0.2 * L) / tn);
        if (rn > 0.35) scale = Math.min(scale, 0.35 / rn);
      }
      // When the cursor is off the path the mates allow (a hinge point can only reach a circle),
      // plain Gauss-Newton only creeps toward the closest point: try longer strides and keep the best.
      let best = null, bestc = null;
      for (const a of [1, 0.6, 2, 4]) {
        if (a > 1 && scale < 1) break;
        const Q = step(P, dx.map((v) => v * scale * a)), rq = S.res(Q);
        const cq = sq(rq.slice(nh)) + 100 * sq(rq.slice(0, nh));
        if (bestc === null || cq < bestc) { best = Q; bestc = cq; }
        else if (a > 2) break;
      }
      P = best;
      if (norm(dx) < 5e-4 * L && norm(rm) < tol) break;
    }
    return P;
  };

  if (n && (active.length || goal)) {
    if (goal) {
      const nh = system(active).parts(poses).reduce((s, x) => s + x.length, 0);
      poses = runDrag(poses, system([...active, goal]), nh);
    }
    if (active.length) poses = runLM(poses, system(active)); // make every mate exact
  }
  // per-mate result
  const final = system(hard).parts(poses);
  hard.forEach(([m], k) => {
    const rk = final[k];
    const err = rk.length ? Math.max(...rk.map(Math.abs)) : 0;
    const rep = report[m.id];
    rep.residual = err;
    if (err > Math.max(1e-3, 1e-5 * L)) {
      rep.state = 'error';
      rep.message = 'This mate cannot be satisfied with the other mates (over defining or conflicting).';
    }
  });
  // degrees of freedom left per component (SOLIDWORKS "(-)" under defined)
  const compState = Object.fromEntries(comps.map((c) => [c.id, fixed.has(c.id) ? 'fixed' : 'under']));
  const dofs = {};
  const mated = [...new Set(hard.flatMap((x) => x[2]).filter((c) => !fixed.has(c)))].sort(byOrder);
  if (mated.length && !goal) { // drag frames only draw; the solve after the drag reports the states
    free = mated;
    idx = Object.fromEntries(free.map((c, i) => [c, i]));
    n = 6 * free.length;
    const S = system(hard), r = S.res(poses);
    let null_;
    if (r.length) {
      const { s, V } = svd(S.jac(poses, r), n);
      const rank = s.filter((x) => x > 1e-6 * Math.max(1, s[0] || 1)).length;
      null_ = V.slice(rank);
    } else null_ = Array.from({ length: n }, (_, j) => { const c = new Array(n).fill(0); c[j] = 1; return c; });
    for (const c of free) {
      const o = 6 * idx[c];
      const blk = null_.map((v) => v.slice(o, o + 6));
      const big = blk.length ? Math.max(...blk.flat().map(Math.abs)) : 0;
      compState[c] = !blk.length || big < 1e-6 ? 'full' : 'under';
      dofs[c] = blk.length ? svd(blk, 6).s.filter((x) => x > 1e-6).length : 0;
    }
  }
  return { poses, mates: report, comp_state: compState, dof: dofs, updates, iterations: iters, fixed };
}

// ------------------------------------------------------------------ regen (no part rebuilds)

function corners([[x0, y0, z0], [x1, y1, z1]]) {
  const out = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) out.push([x, y, z]);
  return out;
}

/** Assembly size used to scale the mate residuals (assembly.py `_size`). */
export function sizeOf(asm, parts) {
  let s = 0;
  for (const p of Object.values(parts || {})) if (p.bbox) s = Math.max(s, ...p.bbox[0].map((lo, k) => p.bbox[1][k] - lo));
  for (const c of asm.components || []) s = Math.max(s, ...(c.position || [0, 0, 0]).map((v) => Math.abs(v)));
  return s || 100;
}

/**
 * What `/api/regen` returns for an assembly, computed here from the parts the server last sent
 * (`parts`: part id -> {key, status, bbox, name, appearance, planes}; meshes stay with the viewer).
 * Only valid while no part has changed since: part edits go to the server.
 */
export function regenLocal(asm, parts, drag = null) {
  const sol = solve(asm, sizeOf(asm, parts), drag);
  const partsOut = {};
  for (const [pid, p] of Object.entries(parts || {})) { const { body, ...rest } = p; partsOut[pid] = rest; }
  const comps = [];
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const c of asm.components || []) {
    const pose = sol.poses[c.id] || Pose.of(c);
    let st = c.suppressed ? 'suppressed' : sol.comp_state[c.id] || 'under';
    let err = null;
    if (!parts[c.part]) { st = 'error'; err = `Missing part '${c.part}'`; }
    comps.push({ id: c.id, part: c.part, matrix: pose.matrix(), position: pose.t.map((v) => clean(v)), rotation: eulerOf(pose.R),
      state: st, dof: sol.dof[c.id] ?? (st === 'fixed' || st === 'full' ? 0 : 6), ...(err ? { message: err } : {}) });
    const bb = parts[c.part]?.bbox;
    if (bb && !c.suppressed && !c.hidden) {
      for (const k of corners(bb)) {
        const w = add(mv(pose.R, k), pose.t);
        lo = lo.map((v, i) => Math.min(v, w[i])); hi = hi.map((v, i) => Math.max(v, w[i]));
      }
    }
  }
  const out = { type: 'assembly', parts: partsOut, components: comps,
    mates: (asm.mates || []).map((m) => ({ id: m.id, ...(sol.mates[m.id] || { state: 'ok' }) })), updates: sol.updates, local: true };
  if (lo.every(Number.isFinite)) out.bbox = [lo.map((v) => clean(v)), hi.map((v) => clean(v))];
  return out;
}
