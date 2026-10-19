// Sketch mode: drawing tools with inference, Smart Dimension, relations, drag, trim.
// Behaviour follows SOLIDWORKS: blue = under defined, black = fully defined, red = over defined.

import * as THREE from 'three';
import { solveSketch, measure } from './solver.js';
import { planOffset } from './offset.js';
import { buildOffsetSketch } from './offset-apply.js';
import { Batch, SK, pointsOf, entityPolyline } from './draw.js';
import {
  dist, sub, add, mul, dot, cross, len, norm, perp, ang, projSeg, projLine, inArc, wrap2pi,
  arcPoints, segSeg, lineCircle, circleCircle, circle3, fmt,
} from './geom2d.js';
import { icon } from '../icons.js';

const SNAP_PX = 9, PICK_PX = 6, HV_DEG = 3.5;
const DIM_TYPES = new Set(['distance', 'diameter', 'radius', 'angle']);

export const TOOL_INFO = {
  line: { title: 'Insert Line', icon: 'line', msg: 'Click to place the start of the line. Double-click or press Esc to end the chain.' },
  centerline: { title: 'Insert Line', icon: 'centerline', msg: 'Sketch a centerline. Use it for symmetry, mirror and revolve axes.' },
  rectangle: { title: 'Rectangle', icon: 'rectangle', msg: 'Click the first corner, then the opposite corner.' },
  centerrect: { title: 'Rectangle', icon: 'centerrect', msg: 'Click the center, then a corner.' },
  circle: { title: 'Circle', icon: 'circle', msg: 'Click the center, then a point on the circle.' },
  arc: { title: 'Arc', icon: 'arc', msg: 'Click the center, the start point, then the end point.' },
  threeptarc: { title: 'Arc', icon: 'threeptarc', msg: 'Click the start point, the end point, then a point on the arc.' },
  tangentarc: { title: 'Arc', icon: 'tangentarc', msg: 'Click the endpoint of a line or arc, then the end of the tangent arc.' },
  slot: { title: 'Slot', icon: 'slot', msg: 'Click the first center, the second center, then set the width.' },
  polygon: { title: 'Polygon', icon: 'polygon', msg: 'Click the center, then a vertex.' },
  point: { title: 'Point', icon: 'point', msg: 'Click to place a point.' },
  smartdim: { title: 'Dimension', icon: 'smartdim', msg: 'Select one or two entities to dimension, then click to place the dimension.' },
  trim: { title: 'Trim', icon: 'trim', msg: 'Click the part of an entity to trim (Trim to closest).' },
  sketchfillet: { title: 'Sketch Fillet', icon: 'sketchfillet', msg: 'Select a corner point where two lines meet.' },
};

export class Sketcher {
  constructor(app) {
    this.app = app;
    this.viewer = app.viewer;
    this.active = false;
    this.sel = new Set();
    this.hover = null;
    this.tool = null;
    this.showRelations = true;
    this.labelEls = new Map();
    this.modelSel = new Map(); // model edges picked in sketch mode (for Convert Entities), key -> viewer pick
    this.glyphEls = [];
    this.lastPx = 0;
    this.viewer.afterRender.push(() => {
      if (!this.active) return;
      if (Math.abs(this.viewer.pxSize - this.lastPx) > 1e-9 * Math.max(1, this.lastPx)) { this.lastPx = this.viewer.pxSize; this.render(); }
      else this.placeLabels();
    });
  }

  // ------------------------------------------------------------------ lifecycle
  begin(sk, frame) {
    this.offsetPreview = null;
    this.active = true;
    this.skId = sk.id;
    this.frame = frame;
    this.matrix = this.viewer.frameMatrix(frame);
    this.viewer.sketchGroup.matrix.copy(this.matrix);
    this.viewer.sketchGroup.matrixWorldNeedsUpdate = true;
    this.viewer.sketchOrigin.matrixAutoUpdate = true;
    this.viewer.sketchOrigin.position.set(...frame.origin);
    this.viewer.sketchOrigin.quaternion.setFromRotationMatrix(new THREE.Matrix4().extractRotation(this.matrix));
    if (!this.viewer.sketchOrigin.parent) this.viewer.overlayGroup.add(this.viewer.sketchOrigin);
    this.viewer.sketchOrigin.visible = true;
    this.viewer.originObj.visible = false;
    this.sel.clear(); this.hover = null; this.tool = null;
    this.modelSel.clear(); this._me = null;
    this.solve();
    this.render();
  }

  end() {
    this.offsetPreview = null;
    this.active = false;
    this.tool = null;
    this.clearModelSel();
    this.viewer.clearGroup(this.viewer.sketchGroup);
    this.viewer.sketchOrigin.visible = false;
    this.viewer.originObj.visible = true;
    for (const el of this.labelEls.values()) el.remove();
    this.labelEls.clear();
    for (const g of this.glyphEls) g.el.remove();
    this.glyphEls = [];
    this.app.cursorFeedback(null);
    this.viewer.requestRender();
  }

  get sk() { return this.app.featureById(this.skId); }

  // ------------------------------------------------------------------ ids & doc
  uid(p) { return this.app.uid(p); }
  ent(id) { return id === 'origin' ? { id: 'origin', type: 'point', x: 0, y: 0, origin: true } : this.sk.entities.find((e) => e.id === id); }
  pt(id) { const e = this.ent(id); return [e.x, e.y]; }
  P() { return pointsOf(this.sk); }

  // Reference geometry: hidden, fixed copies of model edges that "On Edge" relations attach to.
  // They are construction (never part of a profile), not drawn and not pickable; unused ones are removed.
  addPoint(u, v, extra = {}) { const id = this.uid('p'); this.sk.entities.push({ id, type: 'point', x: u, y: v, ...extra }); return id; }
  addEnt(e) { e.id = e.id || this.uid(e.type[0]); this.sk.entities.push(e); return e.id; }
  addCon(type, refs, extra = {}) {
    const c = { id: this.uid('k'), type, refs, ...extra };
    this.sk.constraints.push(c);
    return c;
  }
  nextDimName() {
    let n = 0;
    for (const f of this.app.doc.features) if (f.type === 'sketch') for (const c of f.constraints) { const m = /^D(\d+)$/.exec(c.name || ''); if (m) n = Math.max(n, +m[1]); }
    return 'D' + (n + 1);
  }

  edit(label, fn) {
    this.app.pushUndo(label);
    fn();
    this.pruneRefs();
    this.solve();
    this.app.docChanged();
    this.render();
  }

  solve(drag) {
    const res = solveSketch(this.sk, drag ? { drag } : {});
    this.state = res;
    const txt = res.status === 'over' ? 'Over Defined' : res.status === 'fully' ? 'Fully Defined' : 'Under Defined';
    this.app.statusDefined(txt, res.status);
    return res;
  }

  // ------------------------------------------------------------------ coords & picking
  toLocal(x, y) { const r = this.viewer.screenToPlane(x, y, this.frame); return [r.u, r.v]; }
  toScreen(p) {
    const w = new THREE.Vector3(p[0], p[1], 0).applyMatrix4(this.matrix);
    return this.viewer.worldToScreen(w);
  }
  get px() { return this.viewer.pxSize; }

  hitTest(q, opts = {}) {
    const sk = this.sk, P = this.P(), tolP = SNAP_PX * this.px, tolC = PICK_PX * this.px;
    const skip = opts.skip || new Set();
    let best = null;
    const consider = (id, d, kind) => { if (skip.has(id)) return; if (!best || d < best.d - 1e-12 || (kind === 'point' && best.kind !== 'point' && d < tolP)) best = { id, d, kind }; };
    if (!skip.has('origin') && dist(q, [0, 0]) < tolP) consider('origin', dist(q, [0, 0]), 'point');
    for (const e of sk.entities) if (e.type === 'point' && !e.ref && dist(q, P.get(e.id)) < tolP) consider(e.id, dist(q, P.get(e.id)), 'point');
    if (best && best.kind === 'point') return best;
    for (const e of sk.entities) {
      if (e.ref) continue;
      if (e.type === 'line') { const r = projSeg(q, P.get(e.p1), P.get(e.p2)); if (r.d < tolC) consider(e.id, r.d, 'curve'); }
      else if (e.type === 'circle') { const d = Math.abs(dist(q, P.get(e.center)) - e.r); if (d < tolC) consider(e.id, d, 'curve'); }
      else if (e.type === 'arc') {
        const c = P.get(e.center), s = P.get(e.start), t = P.get(e.end);
        const d = Math.abs(dist(q, c) - dist(c, s));
        if (d < tolC && inArc(ang(sub(q, c)), ang(sub(s, c)), ang(sub(t, c)))) consider(e.id, d, 'curve');
      }
    }
    return best;
  }

  // Snap the cursor while drawing. Returns {p:[u,v], pointId?, onEnt?, midOf?, glyph?, guides:[]}
  snap(q, from = null, opts = {}) {
    const P = this.P(), sk = this.sk, tolP = SNAP_PX * this.px, tolC = PICK_PX * this.px;
    const skipPts = opts.skipPts || new Set();
    // 1. existing points
    let bestP = null;
    const pts = [['origin', [0, 0]], ...sk.entities.filter((e) => e.type === 'point' && !e.ref).map((e) => [e.id, P.get(e.id)])];
    for (const [id, p] of pts) {
      if (skipPts.has(id)) continue;
      const d = dist(q, p);
      if (d < tolP && (!bestP || d < bestP.d)) bestP = { id, p, d };
    }
    if (bestP) return { p: bestP.p.slice(), pointId: bestP.id, glyph: 'r_coincident', guides: [] };
    // 1b. model vertices and arc centres (edges of the part lying in the sketch plane)
    const ME = opts.noModel ? [] : this.modelEdges();
    let bestV = null;
    for (const me of ME) {
      for (const [p, kind] of me.snaps) {
        const d = dist(q, p);
        if (d < tolP && (!bestV || d < bestV.d)) bestV = { p, d, kind, me };
      }
    }
    if (bestV) return { p: bestV.p.slice(), model: { kind: bestV.kind, edge: bestV.me, p: bestV.p }, glyph: 'r_coincident', guides: [] };
    // 2. midpoints and curves
    for (const e of sk.entities) {
      if (e.type !== 'line' || e.ref) continue;
      const m = mul(add(P.get(e.p1), P.get(e.p2)), 0.5);
      if (dist(q, m) < tolP * 0.8) return { p: m, midOf: e.id, glyph: 'r_midpoint', guides: [] };
    }
    for (const me of ME) {
      if (me.type !== 'line') continue;
      const m = mul(add(me.a, me.b), 0.5);
      if (dist(q, m) < tolP * 0.8) return { p: m, model: { kind: 'mid', edge: me }, glyph: 'r_midpoint', guides: [] };
    }
    let bestC = null;
    for (const e of sk.entities) {
      if (e.ref || (opts.skipEnts && opts.skipEnts.has(e.id))) continue;
      let pr = null;
      if (e.type === 'line') { const r = projSeg(q, P.get(e.p1), P.get(e.p2)); pr = { p: r.p, d: r.d }; }
      else if (e.type === 'circle' || e.type === 'arc') {
        const c = P.get(e.center), r = e.type === 'circle' ? e.r : dist(c, P.get(e.start));
        const u = norm(sub(q, c)); const pp = add(c, mul(u, r));
        if (e.type === 'arc' && !inArc(ang(u), ang(sub(P.get(e.start), c)), ang(sub(P.get(e.end), c)))) continue;
        pr = { p: pp, d: dist(q, pp) };
      }
      if (pr && pr.d < tolC && (!bestC || pr.d < bestC.d)) bestC = { ...pr, id: e.id };
    }
    let bestM = null;
    for (const me of ME) {
      const pr = this.nearestOnModel(me, q);
      if (pr && pr.d < tolC && (!bestM || pr.d < bestM.d)) bestM = { ...pr, me };
    }
    if (bestM && (!bestC || bestM.d < bestC.d)) {
      return { p: bestM.p, model: { kind: 'curve', edge: bestM.me }, glyph: bestM.me.linkable ? 'r_coincident' : null, guides: [] };
    }
    if (bestC) return { p: bestC.p, onEnt: bestC.id, glyph: 'r_coincident', guides: [] };
    // 3. horizontal / vertical inference from the previous point
    const res = { p: q.slice(), guides: [] };
    if (from) {
      const d = sub(q, from), a = Math.abs(Math.atan2(d[1], d[0]) * 180 / Math.PI);
      if (len(d) > tolP && (a < HV_DEG || a > 180 - HV_DEG)) { res.p = [q[0], from[1]]; res.hv = 'horizontal'; res.glyph = 'r_horizontal'; }
      else if (len(d) > tolP && Math.abs(a - 90) < HV_DEG) { res.p = [from[0], q[1]]; res.hv = 'vertical'; res.glyph = 'r_vertical'; }
    }
    // 4. alignment inference lines to other points (dotted guides, no relation)
    for (const [, p] of pts) {
      if (from && dist(p, from) < 1e-9) continue;
      if (res.hv !== 'horizontal' && Math.abs(res.p[1] - p[1]) < tolC && Math.abs(res.p[0] - p[0]) > tolP) { res.p[1] = p[1]; res.guides.push([p, res.p.slice()]); }
      if (res.hv !== 'vertical' && Math.abs(res.p[0] - p[0]) < tolC && Math.abs(res.p[1] - p[1]) > tolP) { res.p[0] = p[0]; res.guides.push([p, res.p.slice()]); }
    }
    return res;
  }

  // Commit a snapped location into a point id, adding relations from inference.
  pointFor(s, extra = {}) {
    if (s.pointId && s.pointId !== 'origin') return s.pointId;
    const id = this.addPoint(s.p[0], s.p[1], extra);
    if (s.model) { this.linkModel(id, s.model); return id; }
    if (s.pointId === 'origin') this.addCon('coincident', [id, 'origin']);
    else if (s.onEnt) this.addCon('coincident', [id, s.onEnt]);
    else if (s.midOf) this.addCon('midpoint', [id, s.midOf]);
    return id;
  }

  // ------------------------------------------------------------------ model edges in the sketch plane
  // Edges of the part that lie in the sketch plane (e.g. the outline of the face sketched on), in sketch
  // coordinates. They are snap targets like sketch geometry; snapping to one adds an On Edge relation.
  modelEdges() {
    const bd = this.viewer.bodyData;
    if (!bd || !bd.edges || !this.frame) return [];
    if (this._me && this._me.bd === bd && this._me.frame === this.frame) return this._me.list;
    const f = this.frame, o = f.origin, xd = f.xdir, yd = f.ydir;
    const n = [xd[1] * yd[2] - xd[2] * yd[1], xd[2] * yd[0] - xd[0] * yd[2], xd[0] * yd[1] - xd[1] * yd[0]];
    const tol = 1e-3;
    const list = [];
    for (const ed of bd.edges) {
      const raw = ed.points || [], m = raw.length / 3;
      if (m < 2) continue;
      const pts = [];
      let inPlane = true;
      for (let i = 0; i < m; i++) {
        const v = [raw[i * 3] - o[0], raw[i * 3 + 1] - o[1], raw[i * 3 + 2] - o[2]];
        if (Math.abs(v[0] * n[0] + v[1] * n[1] + v[2] * n[2]) > tol) { inPlane = false; break; }
        pts.push([v[0] * xd[0] + v[1] * xd[1] + v[2] * xd[2], v[0] * yd[0] + v[1] * yd[1] + v[2] * yd[2]]);
      }
      if (!inPlane) continue;
      const a = pts[0], b = pts[pts.length - 1];
      const me = { id: ed.id, type: ed.type, pts, a, b, key: 'edge:' + (ed.mid || []).map((x) => (+x).toFixed(4)).join(','), snaps: [] };
      if (ed.type === 'line') { me.linkable = true; me.snaps.push([a, 'vertex'], [b, 'vertex']); }
      else if (ed.type === 'circle' && pts.length >= 3) {
        const cc = circle3(a, pts[Math.floor(pts.length / 3)], pts[Math.floor((2 * pts.length) / 3)]);
        if (cc) {
          me.c = cc.c; me.r = cc.r; me.closed = dist(a, b) < 1e-6; me.linkable = true;
          if (!me.closed) {
            const mid = pts[Math.floor(pts.length / 2)];
            me.ccw = inArc(ang(sub(mid, cc.c)), ang(sub(a, cc.c)), ang(sub(b, cc.c)));
            me.snaps.push([a, 'vertex'], [b, 'vertex']);
          }
          me.snaps.push([cc.c, 'center']);
        }
      } else if (dist(a, b) > 1e-6) me.snaps.push([a, 'vertex'], [b, 'vertex']);
      list.push(me);
    }
    this._me = { bd, frame: this.frame, list };
    return list;
  }

  nearestOnModel(me, q) {
    if (me.type === 'line') { const r = projSeg(q, me.a, me.b); return { p: r.p, d: r.d }; }
    if (me.c) {
      const u = norm(sub(q, me.c)), p = add(me.c, mul(u, me.r));
      if (!me.closed) {
        const s = ang(sub(me.a, me.c)), t = ang(sub(me.b, me.c));
        if (!(me.ccw ? inArc(ang(u), s, t) : inArc(ang(u), t, s))) return null;
      }
      return { p, d: dist(q, p) };
    }
    let best = null;
    for (let i = 0; i + 1 < me.pts.length; i++) { const r = projSeg(q, me.pts[i], me.pts[i + 1]); if (!best || r.d < best.d) best = { p: r.p, d: r.d }; }
    return best;
  }

  // A fixed, hidden reference point (reused when one is already there).
  refPoint(p) {
    const ex = this.sk.entities.find((e) => e.ref && e.type === 'point' && Math.hypot(e.x - p[0], e.y - p[1]) < 1e-7);
    if (ex) return ex.id;
    const id = this.addPoint(p[0], p[1], { ref: 'edge' });
    this.addCon('fix', [id]);
    return id;
  }

  // The hidden reference copy of a model edge (one per edge).
  refEdge(me) {
    const ex = this.sk.entities.find((e) => e.ref && e.refKey === me.key && e.type !== 'point');
    if (ex) return ex.id;
    const base = { construction: true, ref: 'edge', refKey: me.key };
    if (me.type === 'line') return this.addEnt({ type: 'line', p1: this.refPoint(me.a), p2: this.refPoint(me.b), ...base });
    if (me.c && me.closed) { const id = this.addEnt({ type: 'circle', center: this.refPoint(me.c), r: me.r, ...base }); this.addCon('fix', [id]); return id; }
    if (me.c) {
      const s = this.refPoint(me.ccw ? me.a : me.b), e = this.refPoint(me.ccw ? me.b : me.a);
      return this.addEnt({ type: 'arc', center: this.refPoint(me.c), start: s, end: e, ...base });
    }
    return null;
  }

  linkModel(pid, m) {
    if (m.kind === 'vertex' || m.kind === 'center') { this.addCon('coincident', [pid, this.refPoint(m.p)]); return; }
    if (!m.edge.linkable) return; // a spline edge: the point lands on it but gets no relation
    const re = this.refEdge(m.edge);
    if (re) this.addCon(m.kind === 'mid' ? 'midpoint' : 'coincident', [pid, re]);
  }

  // Drop reference geometry nothing refers to any more (its own fix relations do not count).
  pruneRefs() {
    const sk = this.sk;
    if (!sk || !sk.entities.some((e) => e.ref)) return;
    const used = new Set();
    for (const c of sk.constraints) if (c.type !== 'fix') for (const r of c.refs) used.add(r);
    const keep = new Set();
    for (const e of sk.entities) {
      if (!e.ref || e.type === 'point' || !used.has(e.id)) continue;
      keep.add(e.id);
      for (const k of ['p1', 'p2', 'center', 'start', 'end']) if (e[k]) keep.add(e[k]);
    }
    for (const e of sk.entities) if (e.ref && e.type === 'point' && used.has(e.id)) keep.add(e.id);
    const drop = new Set(sk.entities.filter((e) => e.ref && !keep.has(e.id)).map((e) => e.id));
    if (!drop.size) return;
    sk.entities = sk.entities.filter((e) => !drop.has(e.id));
    sk.constraints = sk.constraints.filter((c) => !c.refs.some((r) => drop.has(r)));
  }

  clearModelSel() {
    if (!this.modelSel.size) return;
    this.modelSel.clear();
    this.viewer.setSelectedKeys([]);
  }

  // ------------------------------------------------------------------ tools
  setTool(name) {
    this.tool = name ? { name, stage: 0, pts: [] } : null;
    if (name === 'smartdim') this.tool.picks = [];
    if (name) this.sel.clear();
    this.app.cursorFeedback(null);
    this.app.onSketchToolChanged(name);
    this.render();
  }

  cancelTool() {
    if (this.tool && this.tool.stage > 0 && this.tool.name !== 'smartdim') {
      const name = this.tool.name;
      this.tool = { name, stage: 0, pts: [] };
      this.render();
      return true;
    }
    if (this.tool && this.tool.name === 'smartdim' && this.tool.picks.length) { this.tool.picks = []; this.tool.preview = null; this.render(); return true; }
    if (this.tool) { this.setTool(null); return true; }
    if (this.sel.size || this.modelSel.size) { this.sel.clear(); this.clearModelSel(); this.app.onSketchSelection(); this.render(); return true; }
    return false;
  }

  pointerMove(x, y, e) {
    const q = this.toLocal(x, y);
    this.cursorLocal = q;
    this.app.coords(`${fmt(q[0])}mm  ${fmt(q[1])}mm  0mm`);
    const t = this.tool;
    if (this.drag) return this.dragMove(x, y, q, e);
    if (this.box) { this.box.x1 = x; this.box.y1 = y; this.app.showSelBox(this.box); return; }
    if (!t) {
      const h = this.hitTest(q);
      this.setHover(h ? h.id : null);
      const mp = h || this.app.cmd?.sketchSelectionOnly ? null : this.viewer.pick(x, y, { edges: true, faces: false });
      this.viewer.setHover(mp && mp.kind === 'edge' ? mp : null); // model edges highlight, ready to select
      return;
    }
    if (t.name === 'smartdim') { this.dimMove(q, x, y); return; }
    if (t.name === 'trim' || t.name === 'sketchfillet') { const h = this.hitTest(q); this.setHover(h ? h.id : null); return; }
    const from = t.stage > 0 ? (t.pts.length ? t.pts[t.pts.length - 1].p : null) : null;
    const s = this.snap(q, t.name === 'line' || t.name === 'centerline' ? from : null);
    t.cur = s;
    let val = null;
    if ((t.name === 'line' || t.name === 'centerline') && from) val = fmt(dist(from, s.p));
    else if ((t.name === 'circle' || t.name === 'polygon') && t.stage === 1) val = 'R ' + fmt(dist(t.pts[0].p, s.p));
    else if (t.name === 'rectangle' && t.stage === 1) val = `${fmt(Math.abs(s.p[0] - t.pts[0].p[0]))} x ${fmt(Math.abs(s.p[1] - t.pts[0].p[1]))}`;
    else if (t.name === 'arc' && t.stage >= 1) val = 'R ' + fmt(dist(t.pts[0].p, t.stage === 1 ? s.p : t.pts[1].p));
    this.app.cursorFeedback({ x, y, glyph: s.glyph, value: val, tool: t.name });
    if (t.name === 'arc' && t.stage === 2) this.trackArcSweep(s.p);
    this.render();
  }

  trackArcSweep(p) {
    const t = this.tool, c = t.pts[0].p, s = t.pts[1].p;
    const a = ang(sub(p, c)), prev = t.lastA ?? ang(sub(s, c));
    let d = a - prev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    t.sweep = (t.sweep || 0) + d; t.lastA = a;
  }

  pointerDown(x, y, e) {
    const q = this.toLocal(x, y);
    const t = this.tool;
    this.downAt = { x, y };
    if (!t) return this.selectDown(x, y, q, e);
    if (t.name === 'smartdim') return this.dimClick(q, x, y, e);
    if (t.name === 'trim') return this.trimAt(q);
    if (t.name === 'sketchfillet') return this.filletAt(q);
    const s = t.cur || this.snap(q);
    this.toolClick(s, e);
  }

  pointerUp(x, y, e) {
    if (this.drag) return this.dragEnd();
    if (this.box) return this.boxEnd(e);
    const t = this.tool;
    // click-drag-release draws one line, rectangle, circle, slot end or polygon, like SOLIDWORKS
    // (click-click still works: a release near the press point waits for the second click)
    const dragTools = ['line', 'centerline', 'rectangle', 'centerrect', 'circle', 'polygon'];
    if (t && dragTools.includes(t.name) && t.stage === 1 && t.pts.length === 1 && this.downAt && Math.hypot(x - this.downAt.x, y - this.downAt.y) > 6 && t.dragStarted) {
      this.toolClick(t.cur || this.snap(this.toLocal(x, y)), e);
      this.tool = { name: t.name, stage: 0, pts: [] };
      this.render();
    }
  }

  dblClick() {
    const t = this.tool;
    if (t && (t.name === 'line' || t.name === 'centerline')) { this.tool = { name: t.name, stage: 0, pts: [] }; this.render(); return true; }
    return false;
  }

  toolClick(s, e) {
    const t = this.tool;
    const cons = t.name === 'centerline' || this.app.forConstruction;
    switch (t.name) {
      case 'point':
        this.edit('Point', () => { const id = this.pointFor(s, { standalone: true }); this.ent(id).standalone = true; });
        break;
      case 'line': case 'centerline': {
        if (t.stage === 0) { t.pts = [{ p: s.p, snap: s }]; t.stage = 1; t.dragStarted = true; this.render(); return; }
        t.dragStarted = false;
        const prev = t.pts[t.pts.length - 1];
        if (dist(prev.p, s.p) < 2 * this.px) return; // double-click second click
        let closes = false;
        this.edit('Line', () => {
          const a = prev.id || this.pointFor(prev.snap);
          prev.id = a;
          if (t.pts.length && t.pts[0].id && s.pointId === t.pts[0].id) closes = true;
          const b = this.pointFor(s);
          const lid = this.addEnt({ type: 'line', p1: a, p2: b, construction: cons || undefined });
          if (s.hv) this.addCon(s.hv, [lid]);
          t.pts.push({ p: s.p, id: b, snap: s });
        });
        if (closes || (s.pointId && t.pts.length > 2 && s.pointId === t.pts[0].id)) { this.tool = { name: t.name, stage: 0, pts: [] }; this.render(); }
        break;
      }
      case 'rectangle': {
        if (t.stage === 0) { t.pts = [{ p: s.p, snap: s }]; t.stage = 1; t.dragStarted = true; return; }
        t.dragStarted = false;
        const a = t.pts[0];
        if (Math.abs(a.p[0] - s.p[0]) < 1e-9 || Math.abs(a.p[1] - s.p[1]) < 1e-9) return;
        this.edit('Rectangle', () => {
          const p1 = this.pointFor(a.snap), p3 = this.pointFor(s);
          const p2 = this.addPoint(s.p[0], a.p[1]), p4 = this.addPoint(a.p[0], s.p[1]);
          const l = [[p1, p2], [p2, p3], [p3, p4], [p4, p1]].map(([u, v]) => this.addEnt({ type: 'line', p1: u, p2: v, construction: cons || undefined }));
          this.addCon('horizontal', [l[0]]); this.addCon('horizontal', [l[2]]);
          this.addCon('vertical', [l[1]]); this.addCon('vertical', [l[3]]);
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      case 'centerrect': {
        if (t.stage === 0) { t.pts = [{ p: s.p, snap: s }]; t.stage = 1; t.dragStarted = true; return; }
        t.dragStarted = false;
        const c = t.pts[0].p, d = sub(s.p, c);
        if (Math.abs(d[0]) < 1e-9 || Math.abs(d[1]) < 1e-9) return;
        this.edit('Center Rectangle', () => {
          const cp = this.pointFor(t.pts[0].snap);
          const q = [[c[0] - d[0], c[1] - d[1]], [c[0] + d[0], c[1] - d[1]], [c[0] + d[0], c[1] + d[1]], [c[0] - d[0], c[1] + d[1]]];
          const ids = q.map((p) => this.addPoint(p[0], p[1]));
          const l = [0, 1, 2, 3].map((i) => this.addEnt({ type: 'line', p1: ids[i], p2: ids[(i + 1) % 4], construction: cons || undefined }));
          this.addCon('horizontal', [l[0]]); this.addCon('horizontal', [l[2]]);
          this.addCon('vertical', [l[1]]); this.addCon('vertical', [l[3]]);
          const dg = this.addEnt({ type: 'line', p1: ids[0], p2: ids[2], construction: true });
          this.addEnt({ type: 'line', p1: ids[1], p2: ids[3], construction: true });
          this.addCon('midpoint', [cp, dg]);
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      case 'circle': {
        if (t.stage === 0) { t.pts = [{ p: s.p, snap: s }]; t.stage = 1; t.dragStarted = true; return; }
        t.dragStarted = false;
        const r = dist(t.pts[0].p, s.p);
        if (r < 1e-9) return;
        this.edit('Circle', () => {
          const c = this.pointFor(t.pts[0].snap);
          const cid = this.addEnt({ type: 'circle', center: c, r, construction: cons || undefined });
          if (s.pointId) this.addCon('coincident', [s.pointId, cid]);
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      case 'polygon': {
        if (t.stage === 0) { t.pts = [{ p: s.p, snap: s }]; t.stage = 1; t.dragStarted = true; return; }
        t.dragStarted = false;
        const c = t.pts[0].p, r = dist(c, s.p), n = this.app.polygonSides || 6, a0 = ang(sub(s.p, c));
        if (r < 1e-9) return;
        this.edit('Polygon', () => {
          const cp = this.pointFor(t.pts[0].snap);
          const circ = this.addEnt({ type: 'circle', center: cp, r, construction: true });
          const ids = [];
          for (let i = 0; i < n; i++) { const a = a0 + (2 * Math.PI * i) / n; ids.push(this.addPoint(c[0] + r * Math.cos(a), c[1] + r * Math.sin(a))); }
          const ls = ids.map((id, i) => this.addEnt({ type: 'line', p1: id, p2: ids[(i + 1) % n], construction: cons || undefined }));
          ids.forEach((id) => this.addCon('coincident', [id, circ]));
          for (let i = 1; i < n; i++) this.addCon('equal', [ls[0], ls[i]]);
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      case 'arc': {
        if (t.stage < 2) { t.pts.push({ p: s.p, snap: s }); t.stage++; t.sweep = 0; t.lastA = undefined; return; }
        const c = t.pts[0].p, r = dist(c, t.pts[1].p);
        if (r < 1e-9) return;
        const a1 = ang(sub(s.p, c)), e2 = add(c, mul([Math.cos(a1), Math.sin(a1)], r));
        this.edit('Arc', () => {
          const cp = this.pointFor(t.pts[0].snap), sp = this.pointFor(t.pts[1].snap);
          const ep = this.pointFor({ ...s, p: s.pointId ? s.p : e2 });
          const ccw = (t.sweep || 0) >= 0;
          this.addEnt({ type: 'arc', center: cp, start: ccw ? sp : ep, end: ccw ? ep : sp, construction: cons || undefined });
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      case 'threeptarc': {
        if (t.stage < 2) { t.pts.push({ p: s.p, snap: s }); t.stage++; return; }
        const [A, B] = [t.pts[0].p, t.pts[1].p];
        const cc = circle3(A, s.p, B);
        if (!cc) return;
        this.edit('Arc', () => {
          const sp = this.pointFor(t.pts[0].snap), ep = this.pointFor(t.pts[1].snap);
          const cp = this.addPoint(cc.c[0], cc.c[1]);
          const ccw = cross(sub(s.p, A), sub(B, A)) < 0;
          this.addEnt({ type: 'arc', center: cp, start: ccw ? sp : ep, end: ccw ? ep : sp, construction: cons || undefined });
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      case 'tangentarc': {
        if (t.stage === 0) {
          if (!s.pointId || s.pointId === 'origin') { this.app.toast('Start a tangent arc on the endpoint of a line or arc.'); return; }
          const owner = this.sk.entities.find((e) => (e.type === 'line' && (e.p1 === s.pointId || e.p2 === s.pointId)) || (e.type === 'arc' && (e.start === s.pointId || e.end === s.pointId)));
          if (!owner) { this.app.toast('Start a tangent arc on the endpoint of a line or arc.'); return; }
          t.pts = [{ p: s.p, snap: s, owner }]; t.stage = 1; return;
        }
        const ta = this.tangentArcGeom(t.pts[0], s.p);
        if (!ta) return;
        this.edit('Tangent Arc', () => {
          const sp = t.pts[0].snap.pointId;
          const ep = this.pointFor(s);
          const cp = this.addPoint(ta.c[0], ta.c[1]);
          const aid = this.addEnt({ type: 'arc', center: cp, start: ta.ccw ? sp : ep, end: ta.ccw ? ep : sp, construction: cons || undefined });
          this.addCon('tangent', [t.pts[0].owner.id, aid]);
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      case 'slot': {
        if (t.stage < 2) { t.pts.push({ p: s.p, snap: s }); t.stage++; return; }
        const [c1, c2] = [t.pts[0].p, t.pts[1].p];
        const ax = norm(sub(c2, c1)), n = perp(ax);
        const w = Math.abs(dot(sub(s.p, c1), n));
        if (w < 1e-9 || dist(c1, c2) < 1e-9) return;
        this.edit('Slot', () => {
          const a = this.pointFor(t.pts[0].snap), b = this.pointFor(t.pts[1].snap);
          const q1 = this.addPoint(...add(c1, mul(n, w))), q2 = this.addPoint(...add(c2, mul(n, w)));
          const q3 = this.addPoint(...add(c2, mul(n, -w))), q4 = this.addPoint(...add(c1, mul(n, -w)));
          const cl = this.addEnt({ type: 'line', p1: a, p2: b, construction: true });
          const l1 = this.addEnt({ type: 'line', p1: q1, p2: q2 });
          const l2 = this.addEnt({ type: 'line', p1: q3, p2: q4 });
          const a1 = this.addEnt({ type: 'arc', center: a, start: q1, end: q4 });
          const a2 = this.addEnt({ type: 'arc', center: b, start: q3, end: q2 });
          for (const [x, y] of [[l1, a1], [l1, a2], [l2, a1], [l2, a2]]) this.addCon('tangent', [x, y]);
          this.addCon('equal', [a1, a2]);
          const d = sub(c2, c1);
          if (Math.abs(d[1]) < 1e-9) this.addCon('horizontal', [cl]); else if (Math.abs(d[0]) < 1e-9) this.addCon('vertical', [cl]);
        });
        this.tool = { name: t.name, stage: 0, pts: [] };
        break;
      }
      default: break;
    }
    this.render();
  }

  tangentArcGeom(start, p) {
    const o = start.owner, P = this.P(), sp = start.snap.pointId, S = P.get(sp);
    let tdir;
    if (o.type === 'line') { const other = o.p1 === sp ? o.p2 : o.p1; tdir = norm(sub(S, P.get(other))); }
    else { const c = P.get(o.center); const rad = norm(sub(S, c)); tdir = o.end === sp ? perp(rad) : mul(perp(rad), -1); }
    const n = perp(tdir), d = sub(p, S);
    const den = 2 * dot(d, n);
    if (Math.abs(den) < 1e-9) return null;
    const r = dot(d, d) / den;
    const c = add(S, mul(n, r));
    return { c, r: Math.abs(r), ccw: r > 0 };
  }

  // ------------------------------------------------------------------ selection & drag
  setHover(id) {
    if (id === this.hover) return;
    this.hover = id;
    this.render();
  }

  selectDown(x, y, q, e) {
    const h = this.hitTest(q);
    if (!h) {
      const mp = this.app.cmd?.sketchSelectionOnly ? null : this.viewer.pick(x, y, { edges: true, faces: false });
      if (mp && mp.kind === 'edge') { // a model edge: select it (for Convert Entities), like SOLIDWORKS
        const k = this.viewer.key(mp);
        if (e.ctrlKey || e.shiftKey) { this.modelSel.has(k) ? this.modelSel.delete(k) : this.modelSel.set(k, mp); }
        else { this.sel.clear(); this.modelSel.clear(); this.modelSel.set(k, mp); this.app.onSketchSelection(); }
        this.viewer.setSelectedKeys([...this.modelSel.keys()]);
        const n = this.modelSel.size;
        this.app.status(`${n} model edge${n === 1 ? '' : 's'} selected. Convert Entities projects ${n === 1 ? 'it' : 'them'} into the sketch.`);
        this.render();
        return;
      }
      if (!e.ctrlKey && !e.shiftKey) { this.sel.clear(); this.clearModelSel(); this.app.onSketchSelection(); }
      this.box = { x0: x, y0: y, x1: x, y1: y };
      this.render();
      return;
    }
    if (e.ctrlKey || e.shiftKey) { this.sel.has(h.id) ? this.sel.delete(h.id) : this.sel.add(h.id); }
    else if (!this.sel.has(h.id)) { this.sel.clear(); this.sel.add(h.id); }
    this.app.onSketchSelection();
    if (h.id !== 'origin' && !this.app.cmd?.sketchSelectionOnly) this.drag = { id: h.id, q0: q, x0: x, y0: y, started: false, snapshot: JSON.stringify(this.sk.entities) };
    this.render();
  }

  dragMove(x, y, q) {
    const d = this.drag;
    if (!d.started) {
      if (Math.hypot(x - d.x0, y - d.y0) < 3) return;
      d.started = true;
      this.app.pushUndo('Drag');
      d.base = new Map(this.sk.entities.map((e) => [e.id, { ...e }]));
    }
    const e = d.base.get(d.id), delta = sub(q, d.q0);
    const drag = [];
    const movePt = (pid) => { if (pid === 'origin') return; const b = d.base.get(pid); drag.push({ key: pid + '.x', value: b.x + delta[0] }, { key: pid + '.y', value: b.y + delta[1] }); };
    if (e.type === 'point') movePt(e.id);
    else if (e.type === 'line') { movePt(e.p1); movePt(e.p2); }
    else if (e.type === 'circle') { const c = d.base.get(e.center) || { x: 0, y: 0 }; drag.push({ key: e.id + '.r', value: dist(q, [c.x, c.y]) }); }
    else if (e.type === 'arc') { movePt(e.center); movePt(e.start); movePt(e.end); }
    this.solve(drag);
    this.render();
  }

  dragEnd() {
    const d = this.drag; this.drag = null;
    if (d.started) { this.solve(); this.app.docChanged(); this.render(); }
  }

  // The browser cancelled the gesture (touch taken for scrolling, a lost capture): the dragged geometry goes back
  // and no undo step is left behind; a box selection is dropped.
  cancelDrag() {
    const d = this.drag;
    if (!d && !this.box) return; // a normal release already ended it
    this.drag = null;
    if (d?.started) {
      this.sk.entities = JSON.parse(d.snapshot);
      if (this.app.undoStack[this.app.undoStack.length - 1]?.label === 'Drag') this.app.undoStack.pop();
      this.solve();
    }
    if (this.box) { this.box = null; this.app.showSelBox(null); }
    this.render();
  }

  boxEnd(e) {
    const b = this.box; this.box = null; this.app.showSelBox(null);
    if (Math.hypot(b.x1 - b.x0, b.y1 - b.y0) < 4) { this.render(); return; }
    const crossing = b.x1 < b.x0;
    const [xa, xb] = [Math.min(b.x0, b.x1), Math.max(b.x0, b.x1)], [ya, yb] = [Math.min(b.y0, b.y1), Math.max(b.y0, b.y1)];
    const inside = (p) => { const s = this.toScreen(p); return s.x >= xa && s.x <= xb && s.y >= ya && s.y <= yb; };
    const P = this.P();
    for (const en of this.sk.entities) {
      if (en.ref) continue;
      let pts;
      if (en.type === 'point') pts = [P.get(en.id)];
      else pts = entityPolyline(en, P);
      if (!pts) continue;
      if (crossing ? pts.some(inside) : pts.every(inside)) this.sel.add(en.id);
    }
    this.app.onSketchSelection();
    this.render();
  }

  deleteSelection() {
    if (!this.sel.size) return false;
    this.edit('Delete', () => {
      const sk = this.sk;
      const ids = new Set(this.sel);
      sk.constraints = sk.constraints.filter((c) => !ids.has(c.id));
      const delEnts = new Set([...ids].filter((id) => sk.entities.some((e) => e.id === id && e.type !== 'point')));
      // standalone points can be deleted directly
      for (const id of ids) { const e = this.ent(id); if (e && e.type === 'point' && !this.pointUsed(id, delEnts)) delEnts.add(id); }
      sk.entities = sk.entities.filter((e) => !delEnts.has(e.id));
      // remove orphaned endpoints
      const used = new Set();
      for (const e of sk.entities) for (const k of ['p1', 'p2', 'center', 'start', 'end']) if (e[k]) used.add(e[k]);
      sk.entities = sk.entities.filter((e) => e.type !== 'point' || e.standalone || used.has(e.id));
      const alive = new Set(['origin', ...sk.entities.map((e) => e.id)]);
      sk.constraints = sk.constraints.filter((c) => c.refs.every((r) => alive.has(r)));
      this.sel.clear();
    });
    this.app.onSketchSelection();
    return true;
  }

  pointUsed(pid, except = new Set()) {
    return this.sk.entities.some((e) => !except.has(e.id) && ['p1', 'p2', 'center', 'start', 'end'].some((k) => e[k] === pid));
  }

  toggleConstruction(ids) {
    this.edit('For construction', () => {
      for (const id of ids) { const e = this.ent(id); if (e && e.type !== 'point') e.construction = !e.construction || undefined; }
    });
  }

  // Relations that apply to the current selection (SOLIDWORKS "Add Relations" list)
  applicableRelations(ids = [...this.sel]) {
    const es = ids.map((id) => this.ent(id)).filter(Boolean);
    const n = (t) => es.filter((e) => e.type === t || (t === 'curve' && (e.type === 'circle' || e.type === 'arc'))).length;
    const L = n('line'), Pn = n('point'), C = n('curve'), N = es.length;
    const out = [];
    if (N === 1 && L === 1) out.push('horizontal', 'vertical', 'fix');
    if (N === 1 && (Pn === 1 || C === 1)) out.push('fix');
    if (L === N && L >= 2) { out.push('horizontal', 'vertical', 'collinear', 'parallel', 'equal'); if (L === 2) out.push('perpendicular'); }
    if (Pn === N && Pn === 2) out.push('horizontal', 'vertical', 'coincident');
    if (Pn === 1 && L === 1 && N === 2) out.push('coincident', 'midpoint');
    if (Pn === 1 && C === 1 && N === 2) out.push('coincident');
    if (L === 1 && C === 1 && N === 2) out.push('tangent');
    if (C === 2 && N === 2) out.push('tangent', 'concentric', 'equal');
    if (C >= 3 && C === N) out.push('equal');
    if (N === 3 && L === 1 && Pn === 2) out.push('symmetric');
    if (N === 3 && L === 3) out.push('symmetric');
    return [...new Set(out)];
  }

  addRelation(type, ids = [...this.sel]) {
    const es = ids.map((id) => this.ent(id));
    let refs = ids;
    if (type === 'midpoint' || type === 'coincident') refs = [...es.filter((e) => e.type === 'point'), ...es.filter((e) => e.type !== 'point')].map((e) => e.id);
    if (type === 'symmetric') {
      const lines = es.filter((e) => e.type === 'line');
      const axis = lines.find((e) => e.construction) || lines[lines.length - 1];
      refs = [...ids.filter((id) => id !== axis.id), axis.id];
      if (es.filter((e) => e.type === 'line').length === 3) {
        // two lines symmetric: endpoints pairwise
        const [a, b] = refs.slice(0, 2).map((id) => this.ent(id));
        this.edit('Symmetric', () => { this.addCon('symmetric', [a.p1, b.p1, axis.id]); this.addCon('symmetric', [a.p2, b.p2, axis.id]); });
        return;
      }
    }
    const pairwise = ['equal', 'parallel', 'collinear'].includes(type) && ids.length > 2;
    const multi = ['horizontal', 'vertical'].includes(type) && es.every((e) => e.type === 'line');
    this.edit(type, () => {
      if (type === 'coincident' && es.every((e) => e.type === 'point')) {
        this.mergePoints(refs[0], refs[1]);
        return;
      }
      if (pairwise) for (let i = 1; i < ids.length; i++) this.addCon(type, [ids[0], ids[i]]);
      else if (multi) for (const id of ids) this.addCon(type, [id]);
      else if (type === 'fix') for (const id of ids) this.addCon('fix', [id]);
      else this.addCon(type, refs);
    });
    const res = this.state;
    if (res.status === 'over') this.app.toast('This relation over defines the sketch.');
  }

  mergePoints(keep, drop) {
    if (keep === 'origin' || drop === 'origin') { this.addCon('coincident', [keep, drop]); return; }
    const sk = this.sk, k = this.ent(keep);
    for (const e of sk.entities) for (const key of ['p1', 'p2', 'center', 'start', 'end']) if (e[key] === drop) e[key] = keep;
    for (const c of sk.constraints) c.refs = c.refs.map((r) => (r === drop ? keep : r));
    const d = this.ent(drop);
    if (d) { k.x = (k.x + d.x) / 2; k.y = (k.y + d.y) / 2; }
    sk.entities = sk.entities.filter((e) => e.id !== drop);
  }

  // ------------------------------------------------------------------ smart dimension
  dimMove(q, x, y) {
    const t = this.tool;
    if (t.picks.length === 0) { const h = this.hitTest(q); this.setHover(h ? h.id : null); this.app.cursorFeedback({ x, y, tool: 'smartdim' }); return; }
    const h = this.hitTest(q, { skip: new Set(t.picks) });
    this.hover = h ? h.id : null;
    t.preview = this.dimFromPicks(t.picks, q);
    this.app.cursorFeedback({ x, y, tool: 'smartdim' });
    this.render();
  }

  dimFromPicks(picks, q) {
    const es = picks.map((id) => this.ent(id));
    const P = this.P();
    const ptOf = (e) => (e.type === 'point' ? [e.x, e.y] : P.get(e.center));
    if (es.length === 1) {
      const e = es[0];
      if (e.type === 'circle') return { type: 'diameter', refs: [e.id], label: q };
      if (e.type === 'arc') return { type: 'radius', refs: [e.id], label: q };
      if (e.type === 'line') {
        const a = P.get(e.p1), b = P.get(e.p2);
        const orient = this.orientFor(a, b, q, true);
        return { type: 'distance', refs: [e.id], orient, label: q };
      }
      return null;
    }
    const [A, B] = es;
    if (A.type === 'line' && B.type === 'line') {
      const d1 = norm(sub(P.get(A.p2), P.get(A.p1))), d2 = norm(sub(P.get(B.p2), P.get(B.p1)));
      if (Math.abs(cross(d1, d2)) > 1e-6) {
        const c = { type: 'angle', refs: [A.id, B.id], label: q };
        return c;
      }
      return { type: 'distance', refs: [A.id, B.id], label: q };
    }
    if (A.type === 'line' || B.type === 'line') return { type: 'distance', refs: [A.id, B.id], label: q };
    const a = ptOf(A), b = ptOf(B);
    return { type: 'distance', refs: [A.id, B.id], orient: this.orientFor(a, b, q, false), label: q };
  }

  // Cursor position chooses aligned / horizontal / vertical (SOLIDWORKS behaviour)
  orientFor(a, b, q, isLine) {
    const d = sub(b, a);
    if (isLine && (Math.abs(d[0]) < 1e-9 || Math.abs(d[1]) < 1e-9)) return 'aligned';
    const minx = Math.min(a[0], b[0]), maxx = Math.max(a[0], b[0]), miny = Math.min(a[1], b[1]), maxy = Math.max(a[1], b[1]);
    const inX = q[0] > minx && q[0] < maxx, inY = q[1] > miny && q[1] < maxy;
    if (inX && !inY) return 'horizontal';
    if (inY && !inX) return 'vertical';
    if (!isLine && !inX && !inY) return 'aligned';
    return 'aligned';
  }

  dimClick(q, x, y) {
    const t = this.tool;
    const h = this.hitTest(q, { skip: new Set(t.picks) });
    if (h && t.picks.length < 2) {
      const next = [...t.picks, h.id];
      if (this.dimFromPicks(next, q)) { t.picks = next; this.sel = new Set(next); t.preview = this.dimFromPicks(t.picks, q); this.render(); return; }
    }
    if (!t.picks.length) return;
    const pv = this.dimFromPicks(t.picks, q);
    if (!pv) return;
    const value = measure(this.sk, pv);
    const name = this.nextDimName();
    let created;
    this.edit('Smart Dimension', () => { created = this.addCon(pv.type, pv.refs, { value: +value.toFixed(6), name, label: q, ...(pv.orient && pv.orient !== 'aligned' ? { orient: pv.orient } : {}) }); });
    t.picks = []; t.preview = null; this.sel.clear();
    this.render();
    if (this.state.conflicts.has(created.id)) {
      this.app.askDriven(created, (driven) => {
        this.edit('Dimension', () => { const c = this.sk.constraints.find((k) => k.id === created.id); if (driven) c.driven = true; });
      });
    } else {
      const s = this.toScreen(q);
      this.app.modifyDimension(created, s.x, s.y);
    }
  }

  setDimValue(cid, v) {
    this.edit('Modify dimension', () => { const c = this.sk.constraints.find((k) => k.id === cid); if (c) c.value = v; });
    return this.state;
  }

  // ------------------------------------------------------------------ trim (Trim to closest)
  trimAt(q) {
    const h = this.hitTest(q);
    if (!h || h.kind !== 'curve') return;
    const sk = this.sk, P = this.P(), e = this.ent(h.id);
    const others = sk.entities.filter((o) => o.id !== e.id && o.type !== 'point' && !o.ref);
    const ints = [];
    const pushInts = (pts, o) => pts.forEach((p) => ints.push({ p, by: o.id }));
    const curveOf = (o) => (o.type === 'circle' ? { c: P.get(o.center), r: o.r } : { c: P.get(o.center), r: dist(P.get(o.center), P.get(o.start)) });
    const onArc = (o, p) => o.type !== 'arc' || inArc(ang(sub(p, P.get(o.center))), ang(sub(P.get(o.start), P.get(o.center))), ang(sub(P.get(o.end), P.get(o.center))));
    for (const o of others) {
      if (e.type === 'line') {
        const a = P.get(e.p1), b = P.get(e.p2);
        if (o.type === 'line') pushInts(segSeg(a, b, P.get(o.p1), P.get(o.p2)), o);
        else { const cc = curveOf(o); pushInts(lineCircle(a, b, cc.c, cc.r).filter((p) => onArc(o, p)), o); }
      } else {
        const me = curveOf(e);
        if (o.type === 'line') pushInts(lineCircle(P.get(o.p1), P.get(o.p2), me.c, me.r), o);
        else { const cc = curveOf(o); pushInts(circleCircle(me.c, me.r, cc.c, cc.r).filter((p) => onArc(o, p)), o); }
      }
    }
    // Intersection at an existing point: reuse it (no extra coincident relation)
    const ptAt = (p, by) => {
      const ex = sk.entities.find((x) => x.type === 'point' && !x.ref && Math.hypot(x.x - p[0], x.y - p[1]) < 1e-7);
      if (ex) return ex.id;
      const id = this.addPoint(...p);
      this.addCon('coincident', [id, by]);
      return id;
    };
    this.edit('Trim', () => {
      // Midpoint relations no longer apply once the line is shortened (SOLIDWORKS drops them too)
      sk.constraints = sk.constraints.filter((c) => !(c.type === 'midpoint' && c.refs[1] === e.id));
      if (e.type === 'line') {
        const a = P.get(e.p1), b = P.get(e.p2), L = dist(a, b);
        const tq = projLine(q, a, b).t;
        const ts = ints.map((i) => ({ t: projLine(i.p, a, b).t, ...i })).filter((i) => i.t > 1e-6 && i.t < 1 - 1e-6).sort((u, v) => u.t - v.t);
        const lo = [...ts].reverse().find((i) => i.t < tq), hi = ts.find((i) => i.t > tq);
        if (!lo && !hi) { this.removeEntity(e.id); return; }
        if (!lo) { this.replaceEndpoint(e, 'p1', ptAt(hi.p, hi.by)); }
        else if (!hi) { this.replaceEndpoint(e, 'p2', ptAt(lo.p, lo.by)); }
        else {
          const n1 = ptAt(lo.p, lo.by), n2 = ptAt(hi.p, hi.by);
          const oldP2 = e.p2;
          this.replaceEndpoint(e, 'p2', n1);
          const nl = this.addEnt({ type: 'line', p1: n2, p2: oldP2, construction: e.construction });
          this.addCon('collinear', [e.id, nl]);
        }
        void L;
      } else {
        const me = curveOf(e), aq = ang(sub(q, me.c));
        let angs = ints.map((i) => ({ a: ang(sub(i.p, me.c)), ...i }));
        if (e.type === 'arc') {
          const a0 = ang(sub(P.get(e.start), me.c)), a1 = ang(sub(P.get(e.end), me.c));
          angs = angs.filter((i) => inArc(i.a, a0, a1) && wrap2pi(i.a - a0) > 1e-6 && wrap2pi(a1 - i.a) > 1e-6);
          if (!angs.length) { this.removeEntity(e.id); return; }
          const rel = (a) => wrap2pi(a - a0);
          const sorted = angs.sort((u, v) => rel(u.a) - rel(v.a));
          const lo = [...sorted].reverse().find((i) => rel(i.a) < rel(aq)), hi = sorted.find((i) => rel(i.a) > rel(aq));
          if (!lo) { this.replaceEndpoint(e, 'start', ptAt(hi.p, hi.by)); }
          else if (!hi) { this.replaceEndpoint(e, 'end', ptAt(lo.p, lo.by)); }
          else {
            const n1 = ptAt(lo.p, lo.by), n2 = ptAt(hi.p, hi.by);
            const oldEnd = e.end; this.replaceEndpoint(e, 'end', n1);
            const na = this.addEnt({ type: 'arc', center: e.center, start: n2, end: oldEnd, construction: e.construction });
            this.addCon('equal', [e.id, na]);
          }
        } else {
          if (angs.length < 2) { this.removeEntity(e.id); return; }
          const rel = (a) => wrap2pi(a - aq);
          const sorted = angs.sort((u, v) => rel(u.a) - rel(v.a));
          const after = sorted[0], before = sorted[sorted.length - 1];
          // keep the arc from `after` CCW to `before` (removes the piece containing the click)
          const s = ptAt(after.p, after.by), t = ptAt(before.p, before.by);
          e.type = 'arc'; e.start = s; e.end = t; const rr = e.r; delete e.r;
          for (const c of sk.constraints) if (c.refs.includes(e.id) && c.type === 'diameter') { c.type = 'radius'; c.value = rr; }
        }
      }
      this.cleanupRelations();
    });
  }

  // Drop point-on-line relations made trivial or duplicated by a trim.
  cleanupRelations() {
    const sk = this.sk;
    const ent = new Map(sk.entities.map((e) => [e.id, e]));
    const ends = (l) => (l && l.type === 'line' ? [l.p1, l.p2] : []);
    const colin = sk.constraints.filter((c) => c.type === 'collinear');
    sk.constraints = sk.constraints.filter((c) => {
      if (c.type !== 'coincident' || c.refs.length !== 2) return true;
      const [pt, L] = c.refs, l = ent.get(L);
      if (!l || l.type !== 'line') return true;
      if (ends(l).includes(pt)) return false;
      return !colin.some((k) => k.refs.includes(L) && k.refs.some((o) => o !== L && ends(ent.get(o)).includes(pt)));
    });
  }

  replaceEndpoint(e, key, np) {
    const old = e[key];
    e[key] = np;
    // dimensions/relations that pointed at the removed endpoint are dropped
    const sk = this.sk;
    if (!this.pointUsed(old)) {
      sk.constraints = sk.constraints.filter((c) => !c.refs.includes(old));
      sk.entities = sk.entities.filter((x) => x.id !== old || x.standalone);
    }
    sk.constraints = sk.constraints.filter((c) => !(c.refs.length === 1 && c.refs[0] === e.id && c.type === 'distance'));
  }

  removeEntity(id) { this.sel = new Set([id]); const sk = this.sk; sk.constraints = sk.constraints.filter((c) => !c.refs.includes(id)); sk.entities = sk.entities.filter((e) => e.id !== id); const used = new Set(); for (const e of sk.entities) for (const k of ['p1', 'p2', 'center', 'start', 'end']) if (e[k]) used.add(e[k]); sk.entities = sk.entities.filter((e) => e.type !== 'point' || e.standalone || used.has(e.id)); const alive = new Set(['origin', ...sk.entities.map((e) => e.id)]); sk.constraints = sk.constraints.filter((c) => c.refs.every((r) => alive.has(r))); this.pruneRefs(); this.sel.clear(); }

  // ------------------------------------------------------------------ sketch fillet
  filletAt(q) {
    const h = this.hitTest(q);
    const P = this.P();
    let pid = h && h.kind === 'point' ? h.id : null;
    if (!pid && h) {
      const e = this.ent(h.id);
      if (e.type === 'line') pid = dist(q, P.get(e.p1)) < dist(q, P.get(e.p2)) ? e.p1 : e.p2;
    }
    if (!pid) return;
    const lines = this.sk.entities.filter((e) => e.type === 'line' && (e.p1 === pid || e.p2 === pid));
    if (lines.length !== 2) { this.app.toast('Select a corner where exactly two lines meet.'); return; }
    const r = this.app.filletRadius || 5;
    const V0 = P.get(pid);
    const far = lines.map((l) => P.get(l.p1 === pid ? l.p2 : l.p1));
    const u1 = norm(sub(far[0], V0)), u2 = norm(sub(far[1], V0));
    const th = Math.acos(Math.max(-1, Math.min(1, dot(u1, u2))));
    if (th < 1e-3 || Math.PI - th < 1e-3) { this.app.toast('The lines are parallel.'); return; }
    const tl = r / Math.tan(th / 2);
    if (tl > dist(V0, far[0]) || tl > dist(V0, far[1])) { this.app.toast('Fillet radius is too large.'); return; }
    const T1 = add(V0, mul(u1, tl)), T2 = add(V0, mul(u2, tl));
    const bis = norm(add(u1, u2)), C = add(V0, mul(bis, r / Math.sin(th / 2)));
    this.edit('Sketch Fillet', () => {
      const t1 = this.addPoint(...T1), t2 = this.addPoint(...T2), c = this.addPoint(...C);
      lines[0][lines[0].p1 === pid ? 'p1' : 'p2'] = t1;
      lines[1][lines[1].p1 === pid ? 'p1' : 'p2'] = t2;
      const ccw = cross(sub(T1, C), sub(T2, C)) > 0;
      const aid = this.addEnt({ type: 'arc', center: c, start: ccw ? t1 : t2, end: ccw ? t2 : t1 });
      this.addCon('tangent', [lines[0].id, aid]); this.addCon('tangent', [lines[1].id, aid]);
      // keep the corner as a virtual sharp so existing dimensions survive
      const vp = this.ent(pid); vp.standalone = true; vp.virtualSharp = true;
      this.addCon('coincident', [pid, lines[0].id]); this.addCon('coincident', [pid, lines[1].id]);
      this.addCon('radius', [aid], { value: r, name: this.nextDimName(), label: add(C, mul(bis, -r * 0.4)) });
    });
  }

  // ------------------------------------------------------------------ convert / mirror / offset
  convertEdges(edges) {
    // edges: viewer edge data (world polylines). Project onto the sketch plane.
    const f = this.frame, o = new THREE.Vector3(...f.origin), xd = new THREE.Vector3(...f.xdir), yd = new THREE.Vector3(...f.ydir);
    const to2 = (i, pts) => { const v = new THREE.Vector3(pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2]).sub(o); return [v.dot(xd), v.dot(yd)]; };
    this.edit('Convert Entities', () => {
      for (const ed of edges) {
        const n = ed.points.length / 3;
        const a = to2(0, ed.points), b = to2(n - 1, ed.points);
        if (ed.type === 'line') {
          const p1 = this.findOrAddPoint(a), p2 = this.findOrAddPoint(b);
          const id = this.addEnt({ type: 'line', p1, p2 });
          this.addCon('fix', [id]);
        } else if (ed.type === 'circle' && n >= 3) {
          const m = to2(Math.floor(n / 3), ed.points), m2 = to2(Math.floor((2 * n) / 3), ed.points);
          const cc = circle3(a, m, m2);
          if (!cc) continue;
          const closed = dist(a, b) < 1e-6;
          const cp = this.addPoint(...cc.c);
          if (closed) { const id = this.addEnt({ type: 'circle', center: cp, r: cc.r }); this.addCon('fix', [id]); }
          else {
            const s = this.findOrAddPoint(a), e = this.findOrAddPoint(b);
            const ccw = cross(sub(m, cc.c), sub(a, cc.c)) < 0;
            const id = this.addEnt({ type: 'arc', center: cp, start: ccw ? s : e, end: ccw ? e : s });
            this.addCon('fix', [cp]); this.addCon('fix', [s]); this.addCon('fix', [e]);
            void id;
          }
        }
      }
    });
  }

  findOrAddPoint(p) {
    const ex = this.sk.entities.find((e) => e.type === 'point' && !e.ref && Math.hypot(e.x - p[0], e.y - p[1]) < 1e-6);
    return ex ? ex.id : this.addPoint(p[0], p[1]);
  }

  mirrorSelection() {
    const ids = [...this.sel];
    const es = ids.map((id) => this.ent(id)).filter((e) => e && e.type !== 'point');
    const axis = es.find((e) => e.type === 'line' && e.construction) || null;
    if (!axis) { this.app.toast('Select the entities to mirror and a centerline.'); return; }
    const items = es.filter((e) => e.id !== axis.id);
    if (!items.length) { this.app.toast('Select the entities to mirror and a centerline.'); return; }
    const P = this.P(), A = P.get(axis.p1), B = P.get(axis.p2), d = norm(sub(B, A));
    const refl = (p) => { const v = sub(p, A); const t = dot(v, d); return add(A, sub(mul(d, 2 * t), v)); };
    this.edit('Mirror Entities', () => {
      const map = new Map();
      const mp = (pid) => {
        if (map.has(pid)) return map.get(pid);
        const p = P.get(pid), r = refl(p);
        let id;
        if (dist(p, r) < 1e-9) id = pid;
        else { id = this.addPoint(...r); this.addCon('symmetric', [pid, id, axis.id]); }
        map.set(pid, id); return id;
      };
      for (const e of items) {
        if (e.type === 'line') this.addEnt({ type: 'line', p1: mp(e.p1), p2: mp(e.p2), construction: e.construction });
        else if (e.type === 'circle') { const nid = this.addEnt({ type: 'circle', center: mp(e.center), r: e.r, construction: e.construction }); this.addCon('equal', [e.id, nid]); }
        else if (e.type === 'arc') { const nid = this.addEnt({ type: 'arc', center: mp(e.center), start: mp(e.end), end: mp(e.start), construction: e.construction }); this.addCon('equal', [e.id, nid]); }
      }
    });
  }

  prepareOffset(d, options = {}) {
    // Window selection includes endpoints and relation glyphs as well as curves.
    const curves = [...this.sel].filter((id) => {
      const entity = this.ent(id);
      return entity && !entity.ref && ['line', 'arc', 'circle'].includes(entity.type);
    });
    return planOffset(this.sk, curves, d, options);
  }

  offsetSelection(d, options = {}) {
    try {
      const plan = this.prepareOffset(d, options);
      const used = new Set();
      for (const f of this.app.doc.features) {
        used.add(f.id);
        for (const e of f.entities || []) used.add(e.id);
        for (const c of f.constraints || []) used.add(c.id);
      }
      let seq = this.app.doc.seq;
      const uid = (prefix) => {
        let id;
        do { id = prefix + seq++; } while (used.has(id));
        used.add(id); return id;
      };
      const candidate = buildOffsetSketch(this.sk, plan, uid);
      const solved = solveSketch(candidate.sketch);
      if (!solved.ok) throw new Error('The offset could not be solved. Reduce the distance or change the selection.');
      this.app.pushUndo('Offset Entities');
      this.sk.entities = candidate.sketch.entities;
      this.sk.constraints = candidate.sketch.constraints;
      this.app.doc.seq = seq;
      this.offsetPreview = null;
      this.sel = new Set(candidate.ids);
      this.solve();
      this.app.docChanged();
      this.render();
      return true;
    } catch (error) {
      this.app.toast(error.message || 'The selected entities could not be offset.');
      return false;
    }
  }

  // ------------------------------------------------------------------ rendering
  colorOf(id, base) {
    if (this.sel.has(id)) return SK.sel;
    if (this.hover === id) return SK.hl;
    const st = this.state?.entityState.get(id);
    if (st === 'over') return SK.over;
    if (base) return base;
    return st === 'fully' ? SK.fully : SK.under;
  }

  render() {
    if (!this.active) return;
    const v = this.viewer;
    v.clearGroup(v.sketchGroup);
    this.lastPx = v.pxSize;
    const b = new Batch(v.pxSize);
    const sk = this.sk;
    if (!sk) return;
    const P = this.P();
    for (const e of sk.entities) {
      if (e.type === 'point' || e.ref) continue;
      const pl = entityPolyline(e, P);
      if (!pl) continue;
      const w = this.sel.has(e.id) || this.hover === e.id ? 2.6 : 1.8;
      b.poly(pl, w, this.colorOf(e.id, e.construction ? null : null), e.construction ? 'centerline' : null);
    }
    for (const e of sk.entities) {
      if (e.type !== 'point' || e.ref) continue;
      const used = this.pointUsed(e.id);
      if (!used && !e.standalone) continue;
      const big = this.sel.has(e.id) || this.hover === e.id;
      b.square([e.x, e.y], big ? 7 : e.virtualSharp ? 4 : 5, this.colorOf(e.id));
    }
    if (this.hover === 'origin' || this.sel.has('origin')) b.square([0, 0], 8, this.colorOf('origin'));
    for (const curve of this.offsetPreview?.curves || []) {
      let points;
      if (curve.type === 'line') points = [curve.p1, curve.p2];
      else if (curve.type === 'circle') points = arcPoints(curve.center, curve.r, 0, 2 * Math.PI);
      else points = arcPoints(curve.center, dist(curve.center, curve.start),
        ang(sub(curve.start, curve.center)), ang(sub(curve.end, curve.center)));
      b.poly(points, 2.5, 0xe6a100, 'dashed', 1);
    }
    this.renderTool(b, P);
    this.renderDims(b, P);
    b.build(v.sketchGroup);
    v.requestRender();
    this.updateGlyphs(P);
    this.placeLabels();
  }

  renderTool(b, P) {
    const t = this.tool;
    if (!t || !t.cur) {
      if (t && t.name === 'smartdim' && t.preview) this.drawDim(b, P, t.preview, 0x404040, true);
      return;
    }
    const s = t.cur, c = SK.preview;
    for (const g of s.guides || []) b.poly([g[0], g[1]], 1, 0x3a7ad8, 'dashed', 0);
    if (s.model) { // the model edge it will land on, highlighted like SOLIDWORKS
      if (s.model.kind === 'curve' || s.model.kind === 'mid') b.poly(s.model.edge.pts, 2.6, SK.hl, null, 1);
      else if (s.model.kind === 'center' && s.model.edge.c) b.poly(arcPoints(s.model.edge.c, s.model.edge.r, 0, 2 * Math.PI, 72), 1.4, SK.hl, 'dashed', 1);
    }
    if (s.pointId || s.onEnt || s.midOf || s.model) b.square(s.p, 7, 0xffa500, 2);
    if (t.stage === 0) return;
    const p0 = t.pts[0].p;
    const cons = t.name === 'centerline' || this.app.forConstruction ? 'centerline' : null;
    switch (t.name) {
      case 'line': case 'centerline': b.poly([t.pts[t.pts.length - 1].p, s.p], 1.8, c, cons); break;
      case 'rectangle': b.poly([p0, [s.p[0], p0[1]], s.p, [p0[0], s.p[1]], p0], 1.8, c, cons); break;
      case 'centerrect': { const d = sub(s.p, p0); const q = [[p0[0] - d[0], p0[1] - d[1]], [p0[0] + d[0], p0[1] - d[1]], [p0[0] + d[0], p0[1] + d[1]], [p0[0] - d[0], p0[1] + d[1]]]; b.poly([...q, q[0]], 1.8, c, cons); b.poly([q[0], q[2]], 1, c, 'centerline'); b.poly([q[1], q[3]], 1, c, 'centerline'); break; }
      case 'circle': b.poly(arcPoints(p0, dist(p0, s.p), 0, 2 * Math.PI, 72), 1.8, c, cons); b.poly([p0, s.p], 1, c, 'dashed'); break;
      case 'polygon': { const n = this.app.polygonSides || 6, r = dist(p0, s.p), a0 = ang(sub(s.p, p0)); const q = []; for (let i = 0; i <= n; i++) { const a = a0 + (2 * Math.PI * i) / n; q.push([p0[0] + r * Math.cos(a), p0[1] + r * Math.sin(a)]); } b.poly(q, 1.8, c, cons); b.poly(arcPoints(p0, r, 0, 2 * Math.PI, 72), 1, c, 'centerline'); break; }
      case 'arc': {
        if (t.stage === 1) { b.poly([p0, s.p], 1, c, 'dashed'); b.poly(arcPoints(p0, dist(p0, s.p), 0, 2 * Math.PI, 72), 1, 0x9aa8c8, 'dashed'); break; }
        const r = dist(p0, t.pts[1].p), a0 = ang(sub(t.pts[1].p, p0)), a1 = ang(sub(s.p, p0));
        const ccw = (t.sweep || 0) >= 0;
        b.poly(ccw ? arcPoints(p0, r, a0, a1) : arcPoints(p0, r, a1, a0), 1.8, c, cons);
        b.poly([p0, t.pts[1].p], 1, c, 'dashed'); b.poly([p0, s.p], 1, c, 'dashed');
        break;
      }
      case 'threeptarc': {
        if (t.stage === 1) { b.poly([p0, s.p], 1, c, 'dashed'); break; }
        const A = p0, B = t.pts[1].p, cc = circle3(A, s.p, B);
        if (cc) { const ccw = cross(sub(s.p, A), sub(B, A)) < 0; const a0 = ang(sub(A, cc.c)), a1 = ang(sub(B, cc.c)); b.poly(ccw ? arcPoints(cc.c, cc.r, a0, a1) : arcPoints(cc.c, cc.r, a1, a0), 1.8, c, cons); }
        break;
      }
      case 'tangentarc': {
        const ta = this.tangentArcGeom(t.pts[0], s.p);
        if (ta) { const a0 = ang(sub(p0, ta.c)), a1 = ang(sub(s.p, ta.c)); b.poly(ta.ccw ? arcPoints(ta.c, ta.r, a0, a1) : arcPoints(ta.c, ta.r, a1, a0), 1.8, c, cons); }
        break;
      }
      case 'slot': {
        if (t.stage === 1) { b.poly([p0, s.p], 1, c, 'centerline'); break; }
        const c1 = p0, c2 = t.pts[1].p, ax = norm(sub(c2, c1)), n = perp(ax), w = Math.abs(dot(sub(s.p, c1), n));
        const a = ang(n);
        b.poly([add(c1, mul(n, w)), add(c2, mul(n, w))], 1.8, c); b.poly([add(c1, mul(n, -w)), add(c2, mul(n, -w))], 1.8, c);
        b.poly(arcPoints(c1, w, a, a + Math.PI), 1.8, c); b.poly(arcPoints(c2, w, a + Math.PI, a + 2 * Math.PI), 1.8, c);
        b.poly([c1, c2], 1, c, 'centerline');
        break;
      }
      default: break;
    }
  }

  // Geometry of a dimension: returns {lines:[[a,b]], arrows:[[tip,dir]], text, at}
  dimGeom(P, c) {
    const ents = new Map(this.sk.entities.map((e) => [e.id, e]));
    const ptOf = (id) => { if (id === 'origin') return [0, 0]; const e = ents.get(id); return e.type === 'point' ? [e.x, e.y] : P.get(e.center); };
    const val = c.value ?? measure(this.sk, c);
    const L = c.label || [0, 0];
    const out = { lines: [], arrows: [], at: L };
    const vtxt = fmt(val);
    if (c.type === 'diameter' || c.type === 'radius') {
      const e = ents.get(c.refs[0]); const C = P.get(e.center);
      const r = e.type === 'circle' ? e.r : dist(C, P.get(e.start));
      const u = norm(sub(L, C));
      const near = add(C, mul(u, r));
      if (c.type === 'diameter') { const far = add(C, mul(u, -r)); out.lines.push([far, L]); out.arrows.push([near, u], [far, mul(u, -1)]); out.text = '⌀' + vtxt; }
      else { out.lines.push([C, L]); out.arrows.push([near, u]); out.text = 'R' + vtxt; }
    } else if (c.type === 'angle') {
      const [l1, l2] = c.refs.map((id) => ents.get(id));
      const a1 = P.get(l1.p1), b1 = P.get(l1.p2), a2 = P.get(l2.p1), b2 = P.get(l2.p2);
      const r = sub(b1, a1), s = sub(b2, a2), den = cross(r, s);
      const V0 = Math.abs(den) < 1e-12 ? a1 : add(a1, mul(r, cross(sub(a2, a1), s) / den));
      const rad = Math.max(dist(L, V0), 1e-6);
      let d1 = norm(r), d2 = norm(s);
      const toL = norm(sub(L, V0));
      // choose ray directions that bracket the label
      let best = null;
      for (const s1 of [1, -1]) for (const s2 of [1, -1]) {
        const u = mul(d1, s1), w = mul(d2, s2);
        const a0 = ang(u); let a1x = ang(w);
        let span = wrap2pi(a1x - a0); let from = a0;
        if (span > Math.PI) { span = 2 * Math.PI - span; from = a1x; }
        const inside = wrap2pi(ang(toL) - from) <= span;
        if (inside && (!best || span < best.span)) best = { from, span };
      }
      if (best) {
        const pts = arcPoints(V0, rad, best.from, best.from + best.span, 32);
        out.lines.push(...pts.slice(1).map((p, i) => [pts[i], p]));
        const e0 = pts[0], e1 = pts[pts.length - 1];
        out.arrows.push([e0, perp(norm(sub(e0, V0))).map((x) => -x)], [e1, perp(norm(sub(e1, V0)))]);
        out.lines.push([V0, e0], [V0, e1]);
      }
      out.text = vtxt + '°';
    } else {
      let A = c.refs[0], B = c.refs[1];
      const eA = ents.get(A);
      if (c.refs.length === 1 && eA && eA.type === 'line') { A = eA.p1; B = eA.p2; }
      const ea = A === 'origin' ? null : ents.get(A), eb = B === 'origin' ? null : ents.get(B);
      let a, b;
      if (ea && eb && ea.type === 'line' && eb.type === 'line') { b = P.get(eb.p1); a = projLine(b, P.get(ea.p1), P.get(ea.p2)).p; }
      else if (ea && ea.type === 'line') { b = ptOf(B); a = projLine(b, P.get(ea.p1), P.get(ea.p2)).p; }
      else if (eb && eb.type === 'line') { a = ptOf(A); b = projLine(a, P.get(eb.p1), P.get(eb.p2)).p; }
      else { a = ptOf(A); b = ptOf(B); }
      let d;
      if (c.orient === 'horizontal') d = [1, 0];
      else if (c.orient === 'vertical') d = [0, 1];
      else d = len(sub(b, a)) > 1e-12 ? norm(sub(b, a)) : [1, 0];
      const n = perp(d);
      const offA = dot(sub(L, a), n), offB = dot(sub(L, b), n);
      const da = add(a, mul(n, offA)), db = add(b, mul(n, offB));
      const gap = 2 * this.px, ext = 6 * this.px;
      const sgnA = Math.sign(offA) || 1, sgnB = Math.sign(offB) || 1;
      out.lines.push([add(a, mul(n, sgnA * gap)), add(da, mul(n, sgnA * ext))], [add(b, mul(n, sgnB * gap)), add(db, mul(n, sgnB * ext))]);
      // dimension line, extended to the label if it sits outside
      const tL = dot(sub(L, da), d), tB = dot(sub(db, da), d);
      const t0 = Math.min(0, tB, tL), t1 = Math.max(0, tB, tL);
      out.lines.push([add(da, mul(d, t0)), add(da, mul(d, t1))]);
      const inward = tB >= 0 ? d : mul(d, -1);
      out.arrows.push([da, mul(inward, -1)], [db, inward]);
      out.text = vtxt;
    }
    if (c.driven) out.text = '(' + out.text + ')';
    return out;
  }

  drawDim(b, P, c, color) {
    let g;
    try { g = this.dimGeom(P, c); } catch (_) { return; }
    for (const [p, q] of g.lines) b.seg(p, q, 1, color, 1);
    for (const [tip, dir] of g.arrows) b.arrow(tip, dir, color);
    c._text = g.text;
  }

  renderDims(b, P) {
    for (const c of this.sk.constraints) {
      if (!DIM_TYPES.has(c.type)) continue;
      const over = this.state?.conflicts.has(c.id);
      const color = this.sel.has(c.id) ? SK.sel : this.hover === c.id ? SK.hl : over ? SK.over : c.driven ? 0x7a7a7a : SK.dim;
      this.drawDim(b, P, c, color);
    }
  }

  placeLabels() {
    if (!this.active) return;
    const sk = this.sk;
    if (!sk) return;
    const seen = new Set();
    const items = sk.constraints.filter((c) => DIM_TYPES.has(c.type));
    const t = this.tool;
    if (t && t.name === 'smartdim' && t.preview) items.push({ ...t.preview, id: '__preview', _text: t.preview._text });
    for (const c of items) {
      seen.add(c.id);
      let el = this.labelEls.get(c.id);
      if (!el) {
        el = document.createElement('div'); el.className = 'dimlbl';
        el.dataset.cid = c.id;
        this.bindDimLabel(el);
        this.app.labelsEl.appendChild(el);
        this.labelEls.set(c.id, el);
      }
      const s = this.toScreen(c.label || [0, 0]);
      el.style.left = s.x + 'px'; el.style.top = s.y + 'px';
      el.textContent = c._text ?? fmt(c.value);
      const over = this.state?.conflicts.has(c.id);
      el.className = 'dimlbl' + (c.id === '__preview' ? ' preview' : '') + (c.driven ? ' driven' : '') + (over ? ' over' : '') + (this.sel.has(c.id) ? ' sel' : '') + (this.hover === c.id ? ' hl' : '');
    }
    for (const [id, el] of this.labelEls) if (!seen.has(id)) { el.remove(); this.labelEls.delete(id); }
    for (const g of this.glyphEls) { const s = this.toScreen(g.at); g.el.style.left = (s.x + g.dx) + 'px'; g.el.style.top = (s.y + g.dy) + 'px'; }
  }

  bindDimLabel(el) {
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.stopPropagation(); e.preventDefault();
      const cid = el.dataset.cid;
      if (cid === '__preview') return;
      if (this.tool && this.tool.name !== 'smartdim') return;
      if (!e.ctrlKey) this.sel.clear();
      this.sel.add(cid);
      this.app.onSketchSelection();
      const c = this.sk.constraints.find((k) => k.id === cid);
      const start = { x: e.clientX, y: e.clientY }; let moved = false;
      const mv = (ev) => {
        if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 3) return;
        if (!moved) { this.app.pushUndo('Move dimension'); moved = true; }
        const r = this.app.canvasRect();
        c.label = this.toLocal(ev.clientX - r.left, ev.clientY - r.top);
        this.render();
      };
      const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); if (moved) this.app.docChanged(); };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      this.render();
    });
    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const c = this.sk.constraints.find((k) => k.id === el.dataset.cid);
      if (!c) return;
      const r = el.getBoundingClientRect(), cr = this.app.canvasRect();
      this.app.modifyDimension(c, r.left - cr.left + r.width / 2, r.top - cr.top + r.height / 2);
    });
    el.addEventListener('pointerenter', () => { if (!this.tool || this.tool.name === 'smartdim') this.setHover(el.dataset.cid); });
    el.addEventListener('pointerleave', () => { if (this.hover === el.dataset.cid) this.setHover(null); });
  }

  // Relation glyphs (green boxes) next to the entities they act on.
  updateGlyphs(P) {
    for (const g of this.glyphEls) g.el.remove();
    this.glyphEls = [];
    if (!this.showRelations) return;
    const sk = this.sk;
    const anchor = (id) => {
      if (id === 'origin') return [0, 0];
      const e = sk.entities.find((x) => x.id === id);
      if (!e) return null;
      if (e.type === 'point') return [e.x, e.y];
      if (e.type === 'line') return mul(add(P.get(e.p1), P.get(e.p2)), 0.5);
      if (e.type === 'circle') return add(P.get(e.center), [e.r * 0.707, e.r * 0.707]);
      if (e.type === 'arc') { const c = P.get(e.center), s = P.get(e.start), t = P.get(e.end); const r = dist(c, s); const a0 = ang(sub(s, c)); const a1 = a0 + wrap2pi(ang(sub(t, c)) - a0) / 2; return add(c, [r * Math.cos(a1), r * Math.sin(a1)]); }
      return null;
    };
    const stack = new Map();
    const isRef = (id) => sk.entities.some((x) => x.id === id && x.ref);
    for (const c of sk.constraints) {
      if (DIM_TYPES.has(c.type)) continue;
      if (c.type === 'fix' && isRef(c.refs[0])) continue;
      const g = 'r_' + c.type;
      const refs = c.type === 'coincident' || c.type === 'midpoint' ? [c.refs[0]] : c.type === 'symmetric' ? c.refs.slice(0, 2) : c.refs;
      for (const id of refs) {
        const at = anchor(id);
        if (!at) continue;
        const k = id; const n = stack.get(k) || 0; stack.set(k, n + 1);
        const el = document.createElement('div');
        const over = this.state?.conflicts.has(c.id);
        el.className = 'relglyph' + (this.sel.has(c.id) ? ' sel' : '') + (over ? ' over' : '');
        el.innerHTML = icon(g, 13);
        el.title = c.type === 'coincident' && isRef(c.refs[1]) ? 'On Edge' : c.type[0].toUpperCase() + c.type.slice(1);
        el.addEventListener('pointerdown', (e) => {
          e.stopPropagation(); e.preventDefault();
          if (!e.ctrlKey) this.sel.clear();
          this.sel.add(c.id); this.app.onSketchSelection(); this.render();
        });
        this.app.labelsEl.appendChild(el);
        this.glyphEls.push({ el, at, dx: 12 + n * 17, dy: -12 });
      }
    }
  }
}
