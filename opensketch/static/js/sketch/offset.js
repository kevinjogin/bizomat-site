// Plan sketch offsets without changing the sketch. Arc entities always store a CCW span.
import { add, sub, mul, dot, cross, dist, norm, perp, ang, wrap2pi } from './geom2d.js';

const TAU = 2 * Math.PI;
const CURVES = new Set(['line', 'arc', 'circle']);
const fail = (message) => { throw new Error(message); };
const finitePoint = (p) => p && Number.isFinite(p.x) && Number.isFinite(p.y);
const midpoint = (a, b) => mul(add(a, b), 0.5);

function readCurve(entity, points, eps) {
  const point = (id) => {
    const p = points.get(id);
    if (!finitePoint(p)) fail('The selected curve has a missing or invalid point. Repair the sketch first.');
    return [p.x, p.y];
  };
  const c = { type: entity.type, source: entity.id };
  if (entity.construction) c.construction = true;
  if (c.type === 'line') {
    c.p1 = point(entity.p1); c.p2 = point(entity.p2);
    if (dist(c.p1, c.p2) <= eps) fail('The selected chain contains a zero-length line. Repair the sketch first.');
  } else {
    c.center = point(entity.center);
    if (c.type === 'circle') c.r = entity.r;
    else {
      c.start = point(entity.start); c.end = point(entity.end);
      c.r = dist(c.center, c.start);
      if (Math.abs(dist(c.center, c.end) - c.r) > Math.max(eps, c.r * 1e-6))
        fail('The selected arc endpoints have different radii. Repair the sketch first.');
      if (dist(c.start, c.end) <= eps) fail('The selected arc is closed or collapsed. Use a circle for a full turn.');
      c.span = wrap2pi(ang(sub(c.end, c.center)) - ang(sub(c.start, c.center)));
    }
    if (!Number.isFinite(c.r) || c.r <= eps) fail('The selected curve has an invalid radius. Repair the sketch first.');
  }
  return c;
}

const endpoints = (c) => c.type === 'line' ? [c.p1, c.p2] : [c.start, c.end];
const onCircle = (c, p, eps) => Math.abs(dist(c.center, p) - c.r) <= eps;
function onCurve(c, p, eps, interior = false) {
  if (c.type === 'line') {
    const d = sub(c.p2, c.p1), length = Math.hypot(...d);
    const t = dot(sub(p, c.p1), d) / (length * length);
    return Math.abs(cross(d, sub(p, c.p1))) <= eps * length &&
      (interior ? t > eps / length && t < 1 - eps / length : t >= -eps / length && t <= 1 + eps / length);
  }
  if (!onCircle(c, p, eps)) return false;
  if (c.type === 'circle') return true;
  const a = wrap2pi(ang(sub(p, c.center)) - ang(sub(c.start, c.center)));
  const tol = eps / c.r;
  if (!interior && (dist(c.start, p) <= eps || dist(c.end, p) <= eps)) return true;
  return interior ? a > tol && a < c.span - tol : a <= c.span + tol;
}

// Intersections of the infinite supports. End trimming is handled by the caller.
function supportIntersections(a, b, eps) {
  if (a.type === 'line' && b.type === 'line') {
    const u = sub(a.p2, a.p1), v = sub(b.p2, b.p1), den = cross(u, v);
    if (Math.abs(den) <= 1e-12 * Math.hypot(...u) * Math.hypot(...v)) return [];
    return [add(a.p1, mul(u, cross(sub(b.p1, a.p1), v) / den))];
  }
  if (a.type === 'line' || b.type === 'line') {
    if (b.type === 'line') [a, b] = [b, a];
    const u = norm(sub(a.p2, a.p1)), f = sub(b.center, a.p1);
    const along = dot(f, u), foot = add(a.p1, mul(u, along));
    const h2 = b.r * b.r - dot(sub(foot, b.center), sub(foot, b.center));
    if (h2 < -eps * Math.max(1, b.r)) return [];
    const h = Math.sqrt(Math.max(0, h2));
    return h <= eps ? [foot] : [add(foot, mul(u, h)), add(foot, mul(u, -h))];
  }
  const d = dist(a.center, b.center);
  if (d <= eps || d > a.r + b.r + eps || d < Math.abs(a.r - b.r) - eps) return [];
  const along = (a.r * a.r - b.r * b.r + d * d) / (2 * d);
  const h2 = a.r * a.r - along * along;
  if (h2 < -eps * Math.max(1, a.r)) return [];
  const u = mul(sub(b.center, a.center), 1 / d), foot = add(a.center, mul(u, along));
  const h = Math.sqrt(Math.max(0, h2));
  return h <= eps ? [foot] : [add(foot, mul(perp(u), h)), add(foot, mul(perp(u), -h))];
}

function overlaps(a, b, eps) {
  if (a.type === 'line' && b.type === 'line') {
    const u = norm(sub(a.p2, a.p1));
    if (Math.abs(cross(u, sub(b.p1, a.p1))) > eps || Math.abs(cross(u, sub(b.p2, a.p1))) > eps) return false;
    const t = [dot(sub(b.p1, a.p1), u), dot(sub(b.p2, a.p1), u)].sort((x, y) => x - y);
    return Math.min(dist(a.p1, a.p2), t[1]) - Math.max(0, t[0]) > eps;
  }
  if (a.type === 'line' || b.type === 'line' || dist(a.center, b.center) > eps || Math.abs(a.r - b.r) > eps) return false;
  if (a.type === 'circle' || b.type === 'circle') return true;
  const mid = (c) => add(c.center, mul([Math.cos(ang(sub(c.start, c.center)) + c.span / 2),
    Math.sin(ang(sub(c.start, c.center)) + c.span / 2)], c.r));
  return onCurve(a, b.start, eps, true) || onCurve(a, b.end, eps, true) || onCurve(a, mid(b), eps, true) ||
    onCurve(b, a.start, eps, true) || onCurve(b, a.end, eps, true) || onCurve(b, mid(a), eps, true);
}

function validateIntersections(curves, eps, message, source = null) {
  for (let i = 0; i < curves.length; i++) for (let j = i + 1; j < curves.length; j++) {
    const a = curves[i], b = curves[j];
    if (overlaps(a, b, eps)) fail(message);
    const candidates = supportIntersections(a, b, eps);
    // Equal circular supports and collinear lines do not have a unique support
    // intersection, but their endpoints can still form (or wrongly acquire) joins.
    if (a.type !== 'circle') candidates.push(...endpoints(a).filter((p) => onCurve(b, p, eps)));
    if (b.type !== 'circle') candidates.push(...endpoints(b).filter((p) => onCurve(a, p, eps)));
    for (const p of candidates) {
      if (!onCurve(a, p, eps) || !onCurve(b, p, eps)) continue;
      // A common endpoint is a valid join. Crossing or touching an interior is not.
      const endA = a.type !== 'circle' && endpoints(a).some((q) => dist(p, q) <= eps);
      const endB = b.type !== 'circle' && endpoints(b).some((q) => dist(p, q) <= eps);
      const existingJoin = !source || (source[i].type !== 'circle' && source[j].type !== 'circle' &&
        endpoints(source[i]).some((q) => endpoints(source[j]).some((r) => dist(q, r) <= eps)));
      if (!endA || !endB || !existingJoin) fail(message);
    }
  }
}

function signedArea(path) {
  const origin = endpoints(path[0].curve)[0];
  return path.reduce((sum, e) => {
    const [p, q] = e.reverse ? endpoints(e.curve).slice().reverse() : endpoints(e.curve);
    return sum + (e.curve.type === 'line' ? cross(sub(p, origin), sub(q, origin)) :
      cross(sub(e.curve.center, origin), sub(q, p)) + e.curve.r ** 2 * e.curve.span * (e.reverse ? -1 : 1)) / 2;
  }, 0);
}

function planPath(path, closed, distance, eps) {
  let left = distance;
  if (closed) {
    const area = signedArea(path);
    if (Math.abs(area) <= eps * eps) fail('The selected loop has no area. Repair the sketch first.');
    left *= -Math.sign(area);
  } else if (path.length === 1 && path[0].curve.type === 'arc') {
    left *= path[0].reverse ? 1 : -1; // An isolated arc expands like a circle.
  }
  const planned = path.map(({ curve: c, reverse }) => {
    const [a, b] = reverse ? endpoints(c).slice().reverse() : endpoints(c);
    let result;
    if (c.type === 'line') {
      const shift = mul(perp(norm(sub(b, a))), left);
      result = { ...c, p1: add(a, shift), p2: add(b, shift) };
    } else {
      const r = c.r - left * (reverse ? -1 : 1);
      if (r <= eps) fail('The offset collapses an arc. Use a smaller distance.');
      result = { ...c, r, start: add(c.center, mul(norm(sub(a, c.center)), r)),
        end: add(c.center, mul(norm(sub(b, c.center)), r)) };
    }
    return { result, reverse, a, b };
  });
  for (let i = 0; i < (closed ? planned.length : planned.length - 1); i++) {
    const a = planned[i].result, b = planned[(i + 1) % planned.length].result;
    const ae = endpoints(a)[1], bs = endpoints(b)[0];
    let join;
    if (dist(ae, bs) <= eps) join = midpoint(ae, bs);
    else {
      const candidates = supportIntersections(a, b, eps);
      if (!candidates.length) fail('These offset curves cannot be joined. Use a smaller distance or select a simpler chain.');
      candidates.sort((p, q) => dist(p, ae) + dist(p, bs) - dist(q, ae) - dist(q, bs));
      join = candidates[0];
    }
    a[a.type === 'line' ? 'p2' : 'end'] = join;
    b[b.type === 'line' ? 'p1' : 'start'] = join;
  }
  const result = planned.map(({ result: c, reverse, a, b }, i) => {
    if (c.type === 'line') {
      if (dot(sub(c.p2, c.p1), norm(sub(b, a))) <= eps)
        fail('The offset collapses or reverses a line. Use a smaller distance.');
      if (reverse) [c.p1, c.p2] = [c.p2, c.p1];
    } else {
      if (reverse) [c.start, c.end] = [c.end, c.start];
      c.span = wrap2pi(ang(sub(c.end, c.center)) - ang(sub(c.start, c.center)));
      const original = path[i].curve;
      const turn = (from, to) => Math.atan2(cross(sub(from, c.center), sub(to, c.center)),
        dot(sub(from, c.center), sub(to, c.center)));
      const unwrapped = original.span + turn(original.end, c.end) - turn(original.start, c.start);
      if (dist(c.start, c.end) <= eps || unwrapped <= eps / c.r || unwrapped >= TAU - eps / c.r ||
        Math.abs(c.span - unwrapped) > eps / c.r)
        fail('The offset collapses or reverses an arc. Use a smaller distance.');
    }
    return c;
  });
  if (closed && signedArea(path) * signedArea(path.map((e, i) => ({ ...e, curve: result[i] }))) <= 0)
    fail('The offset collapses or reverses the loop. Use a smaller distance.');
  return result;
}

/**
 * Return independent curve coordinates and the expanded source selection.
 * Positive distances expand closed loops/circles/isolated arcs. Open chains use
 * the left side of the first line's authored direction (or first arc if no line).
 * Invalid inputs throw before any caller can commit a partial offset.
 */
export function planOffset(sketch, selectedIds, distance, { chain = true } = {}) {
  if (!Number.isFinite(distance) || distance === 0) fail('Enter a finite, non-zero offset distance.');
  const entities = (sketch?.entities || []).filter((e) => !e.ref), byId = new Map(entities.map((e) => [e.id, e]));
  const selected = new Set(selectedIds);
  if (!selected.size) fail('Select at least one line, arc, or circle to offset.');
  for (const id of selected) if (!CURVES.has(byId.get(id)?.type)) fail('Select lines, arcs, or circles to offset.');
  const points = new Map(entities.filter((e) => e.type === 'point').map((p) => [p.id, p]));
  const scale = [...points.values()].filter(finitePoint).reduce((s, p) => Math.max(s, Math.abs(p.x), Math.abs(p.y)), 1);
  const eps = Math.max(1e-7, scale * Number.EPSILON * 16);
  if (Math.abs(distance) <= eps) fail('The offset distance is too small.');
  const nodes = [], curves = [], edges = new Map();
  const node = (p) => {
    let index = nodes.findIndex((n) => dist(n.p, p) <= eps);
    if (index < 0) { index = nodes.length; nodes.push({ p, edges: [] }); }
    return index;
  };
  for (const entity of entities) {
    if (!CURVES.has(entity.type) || (!chain && !selected.has(entity.id))) continue;
    let c;
    try { c = readCurve(entity, points, eps); }
    catch (error) { if (selected.has(entity.id)) throw error; else continue; }
    curves.push(c);
    if (c.type === 'circle') continue;
    const ends = endpoints(c).map(node), edge = { curve: c, ends };
    edges.set(c.source, edge);
    for (const index of ends) nodes[index].edges.push(edge);
  }
  // Construction geometry participates only when explicitly selected, or reached
  // from another construction curve. Reference axes must not branch a contour.
  const pending = [...selected];
  if (chain) while (pending.length) {
    const current = edges.get(pending.pop());
    if (!current) continue;
    for (const index of current.ends) for (const next of nodes[index].edges) {
      if (Boolean(next.curve.construction) !== Boolean(current.curve.construction)) continue;
      if (!selected.has(next.curve.source)) { selected.add(next.curve.source); pending.push(next.curve.source); }
    }
  }
  const source = curves.filter((c) => selected.has(c.source));
  validateIntersections(source, eps, 'The selected curves overlap or intersect. Select a simple chain.');
  const used = new Set(), output = new Map();
  for (const c of source) {
    if (used.has(c.source)) continue;
    if (c.type === 'circle') {
      const r = c.r + distance;
      if (r <= eps) fail('The offset collapses a circle. Use a smaller distance.');
      output.set(c.source, { ...c, r }); used.add(c.source); continue;
    }
    const component = [], queue = [edges.get(c.source)], found = new Set([c.source]);
    while (queue.length) {
      const edge = queue.pop(); component.push(edge);
      for (const n of edge.ends) {
        const neighbors = nodes[n].edges.filter((e) => selected.has(e.curve.source));
        if (neighbors.length > 2) fail('The selected chain branches. Select an unbranched chain or turn off Select chain.');
        for (const next of neighbors) if (!found.has(next.curve.source)) { found.add(next.curve.source); queue.push(next); }
      }
    }
    const degree = new Map();
    for (const e of component) for (const n of e.ends) degree.set(n, (degree.get(n) || 0) + 1);
    const ends = [...degree].filter(([, n]) => n === 1).map(([n]) => n), closed = ends.length === 0;
    if (!closed && ends.length !== 2) fail('The selected curves do not form a continuous chain.');
    const seed = edges.get(source.find((e) => found.has(e.source) && e.type === 'line')?.source) || component[0];
    let at = closed ? seed.ends[0] : ends[0], path = [];
    while (path.length < component.length) {
      const edge = nodes[at].edges.find((e) => found.has(e.curve.source) && !used.has(e.curve.source));
      if (!edge) fail('The selected curves do not form a continuous chain.');
      const reverse = edge.ends[1] === at;
      path.push({ curve: edge.curve, reverse }); used.add(edge.curve.source);
      at = edge.ends[reverse ? 0 : 1];
    }
    if (!closed && path.find((e) => e.curve.source === seed.curve.source).reverse)
      path = path.reverse().map((e) => ({ ...e, reverse: !e.reverse }));
    for (const result of planPath(path, closed, distance, eps)) output.set(result.source, result);
  }
  const result = source.map((c) => output.get(c.source));
  validateIntersections(result, eps, 'The offset creates intersecting curves. Use a smaller distance or select a simpler chain.', source);
  return { selectedIds: source.map((c) => c.source), curves: result.map((c) => {
    const { span, r, ...rest } = c;
    return c.type === 'circle' ? { ...rest, r } : rest;
  }) };
}
