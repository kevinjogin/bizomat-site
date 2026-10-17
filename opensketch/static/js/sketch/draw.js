// Draw sketch geometry as screen-width "fat" lines (meshes) in plane-local coordinates.

import * as THREE from 'three';
import { arcPoints, ang, dist } from './geom2d.js';
import { SKETCH_COLORS } from '../skin.js';

export const SK = {
  under: 0x0000ff, fully: 0x000000, over: 0xff0000, hl: 0xff8c00, sel: 0x2a8cff,
  construction: 0x5050a0, preview: 0x0050ff, inactive: 0x3c3c3c, dim: 0x000000,
};
if (SKETCH_COLORS) Object.assign(SK, SKETCH_COLORS);

const DASH = { centerline: [10, 3, 2, 3], dashed: [5, 3] };

export class Batch {
  constructor(px) { this.px = px; this.parts = new Map(); }
  _buf(color, order = 0) {
    const k = color + ':' + order;
    if (!this.parts.has(k)) this.parts.set(k, { color, order, pos: [] });
    return this.parts.get(k).pos;
  }
  seg(a, b, wPx, color, order = 0) {
    const w = (wPx * this.px) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    if (l < 1e-12) return;
    const nx = (-dy / l) * w, ny = (dx / l) * w;
    const P = this._buf(color, order);
    P.push(a[0] + nx, a[1] + ny, 0, a[0] - nx, a[1] - ny, 0, b[0] + nx, b[1] + ny, 0,
      b[0] + nx, b[1] + ny, 0, a[0] - nx, a[1] - ny, 0, b[0] - nx, b[1] - ny, 0);
  }
  poly(pts, wPx, color, dash = null, order = 0) {
    if (!dash) { for (let i = 0; i + 1 < pts.length; i++) this.seg(pts[i], pts[i + 1], wPx, color, order); return; }
    const pat = DASH[dash].map((d) => d * this.px);
    let k = 0, rem = pat[0], on = true;
    for (let i = 0; i + 1 < pts.length; i++) {
      let a = pts[i]; const b = pts[i + 1];
      let segLen = dist(a, b);
      while (segLen > 1e-12) {
        const step = Math.min(rem, segLen);
        const t = step / segLen;
        const m = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        if (on) this.seg(a, m, wPx, color, order);
        a = m; segLen -= step; rem -= step;
        if (rem <= 1e-12) { k = (k + 1) % pat.length; rem = pat[k]; on = !on; }
      }
    }
  }
  square(p, sPx, color, order = 1) {
    const s = (sPx * this.px) / 2;
    const P = this._buf(color, order);
    const [x, y] = p;
    P.push(x - s, y - s, 0, x + s, y - s, 0, x + s, y + s, 0, x - s, y - s, 0, x + s, y + s, 0, x - s, y + s, 0);
  }
  arrow(tip, dir, color, order = 2) {
    const L = 9 * this.px, W = 2.6 * this.px;
    const bx = tip[0] - dir[0] * L, by = tip[1] - dir[1] * L;
    const P = this._buf(color, order);
    P.push(tip[0], tip[1], 0, bx - dir[1] * W, by + dir[0] * W, 0, bx + dir[1] * W, by - dir[0] * W, 0);
  }
  build(group, matrix) {
    for (const { color, order, pos } of this.parts.values()) {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, depthTest: false, depthWrite: false }));
      m.renderOrder = 20 + order;
      m.userData.noFit = false;
      if (matrix) { m.matrixAutoUpdate = false; m.matrix.copy(matrix); }
      group.add(m);
    }
  }
}

export function pointsOf(sk) {
  const m = new Map([['origin', [0, 0]]]);
  for (const e of sk.entities) if (e.type === 'point') m.set(e.id, [e.x, e.y]);
  return m;
}

export function entityPolyline(e, P) {
  if (e.type === 'line') return [P.get(e.p1), P.get(e.p2)];
  if (e.type === 'circle') return arcPoints(P.get(e.center), e.r, 0, 2 * Math.PI, 72);
  if (e.type === 'arc') {
    const c = P.get(e.center), s = P.get(e.start), t = P.get(e.end);
    return arcPoints(c, dist(c, s), ang([s[0] - c[0], s[1] - c[1]]), ang([t[0] - c[0], t[1] - c[1]]));
  }
  return null;
}

// Inactive sketch drawn in world space (used for sketches shown outside edit mode)
export function drawInactiveSketch(group, sk, matrix, px, color = SK.inactive) {
  const b = new Batch(px);
  const P = pointsOf(sk);
  for (const e of sk.entities) {
    if (e.ref) continue; // hidden model-edge references
    const pl = entityPolyline(e, P);
    if (!pl) continue;
    b.poly(pl, e.construction ? 1.2 : 1.6, color, e.construction ? 'centerline' : null);
  }
  b.build(group, matrix);
}
