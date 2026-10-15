// Small 2D geometry helpers shared by the sketcher and the sketch renderer.

export const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
export const mul = (a, s) => [a[0] * s, a[1] * s];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
export const len = (a) => Math.hypot(a[0], a[1]);
export const norm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
export const perp = (a) => [-a[1], a[0]];
export const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export const ang = (a) => Math.atan2(a[1], a[0]);

export function wrap2pi(a) { a %= 2 * Math.PI; return a < 0 ? a + 2 * Math.PI : a; }

// Closest param/point on segment
export function projSeg(p, a, b) {
  const d = sub(b, a), l2 = dot(d, d) || 1e-18;
  const t = Math.max(0, Math.min(1, dot(sub(p, a), d) / l2));
  return { t, p: lerp(a, b, t), d: dist(p, lerp(a, b, t)) };
}

export function projLine(p, a, b) {
  const d = sub(b, a), l2 = dot(d, d) || 1e-18;
  const t = dot(sub(p, a), d) / l2;
  return { t, p: lerp(a, b, t) };
}

// is angle a inside CCW span [a0 -> a1]
export function inArc(a, a0, a1) {
  const span = wrap2pi(a1 - a0) || 2 * Math.PI;
  return wrap2pi(a - a0) <= span + 1e-9;
}

export function arcPoints(c, r, a0, a1, segs) {
  const span = wrap2pi(a1 - a0) || 2 * Math.PI;
  const n = segs || Math.max(8, Math.ceil(span / (Math.PI / 32)));
  const out = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (span * i) / n; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
  return out;
}

// Intersections -------------------------------------------------------------
export function segSeg(a, b, c, d) {
  const r = sub(b, a), s = sub(d, c), den = cross(r, s);
  if (Math.abs(den) < 1e-12) return [];
  const t = cross(sub(c, a), s) / den, u = cross(sub(c, a), r) / den;
  if (t < -1e-9 || t > 1 + 1e-9 || u < -1e-9 || u > 1 + 1e-9) return [];
  return [lerp(a, b, t)];
}

export function lineCircle(a, b, c, r, segment = true) {
  const d = sub(b, a), f = sub(a, c);
  const A = dot(d, d), B = 2 * dot(f, d), C = dot(f, f) - r * r;
  const disc = B * B - 4 * A * C;
  if (disc < 0 || A < 1e-18) return [];
  const s = Math.sqrt(disc);
  const out = [];
  for (const t of [(-B - s) / (2 * A), (-B + s) / (2 * A)]) {
    if (!segment || (t >= -1e-9 && t <= 1 + 1e-9)) out.push(lerp(a, b, t));
  }
  return out;
}

export function circleCircle(c1, r1, c2, r2) {
  const d = dist(c1, c2);
  if (d < 1e-12 || d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const u = norm(sub(c2, c1)), m = add(c1, mul(u, a));
  if (h < 1e-12) return [m];
  return [add(m, mul(perp(u), h)), add(m, mul(perp(u), -h))];
}

// Circle through three points
export function circle3(p1, p2, p3) {
  const ax = p1[0], ay = p1[1], bx = p2[0], by = p2[1], cx = p3[0], cy = p3[1];
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-12) return null;
  const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
  const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
  return { c: [ux, uy], r: dist([ux, uy], p1) };
}

export function fmt(v, digits = 2) {
  if (!isFinite(v)) return '?';
  const s = (+v).toFixed(digits).replace(/^-(0\.?0*)$/, '$1');
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s;
}
