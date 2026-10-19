// Graphics area: orthographic three.js view with SOLIDWORKS mouse behaviour.
// Middle drag rotates, Ctrl+middle pans, Shift+middle zooms, wheel zooms about the cursor.
// Touch: one finger rotates, two fingers pan and pinch-zoom; a tap selects.

import * as THREE from 'three';
import { VIEW_COLORS, SKETCH_BODY_DIM } from './skin.js';

const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const mix = (a, b, t) => {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
};
export const matOf = (m) => new THREE.Matrix4().set(...m); // row-major 16 numbers

/** The person asked their system for less motion: camera moves and 3D tweens jump to the end. */
export const reducedMotion = () => { try { return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } };

const COLORS_CLASSIC = {
  body: 0xc4cad2,
  edge: 0x101010,
  hl: 0xff8c00,
  sel: 0x2a8cff,
  tool: 0xffd24a,
  plane: 0x8fb8e8,
  planeEdge: 0x3a6fb8,
  proposal: 0xa58cff,
};
export const COLORS = { ...COLORS_CLASSIC, ...(VIEW_COLORS || {}) };
const THUMB_COLORS = { body: 0xa8b8c8, edge: 0x37424c }; // Files pictures: preview.py's body and edge colours

export const STD_FRAMES = {
  'Front Plane': { origin: [0, 0, 0], xdir: [1, 0, 0], ydir: [0, 1, 0], normal: [0, 0, 1] },
  'Top Plane': { origin: [0, 0, 0], xdir: [1, 0, 0], ydir: [0, 0, -1], normal: [0, 1, 0] },
  'Right Plane': { origin: [0, 0, 0], xdir: [0, 0, -1], ydir: [0, 1, 0], normal: [1, 0, 0] },
};

function quatFromBasis(x, y, z) {
  const m = new THREE.Matrix4().makeBasis(x, y, z);
  return new THREE.Quaternion().setFromRotationMatrix(m);
}

export function viewQuat(name) {
  const q = (x, y, z) => quatFromBasis(V(x), V(y), V(z));
  switch (name) {
    case 'front': return q([1, 0, 0], [0, 1, 0], [0, 0, 1]);
    case 'back': return q([-1, 0, 0], [0, 1, 0], [0, 0, -1]);
    case 'left': return q([0, 0, 1], [0, 1, 0], [-1, 0, 0]);
    case 'right': return q([0, 0, -1], [0, 1, 0], [1, 0, 0]);
    case 'top': return q([1, 0, 0], [0, 0, -1], [0, 1, 0]);
    case 'bottom': return q([1, 0, 0], [0, 0, 1], [0, -1, 0]);
    case 'trimetric': {
      const z = new THREE.Vector3(0.62, 0.42, 0.66).normalize();
      const x = new THREE.Vector3(0, 1, 0).cross(z).normalize();
      return quatFromBasis(x, z.clone().cross(x), z);
    }
    case 'dimetric': {
      const z = new THREE.Vector3(0.35, 0.35, 0.87).normalize();
      const x = new THREE.Vector3(0, 1, 0).cross(z).normalize();
      return quatFromBasis(x, z.clone().cross(x), z);
    }
    default: { // isometric
      const z = new THREE.Vector3(1, 1, 1).normalize();
      const x = new THREE.Vector3(0, 1, 0).cross(z).normalize();
      return quatFromBasis(x, z.clone().cross(x), z);
    }
  }
}

// ------------------------------------------------------------------ merged bodies
// A body (the mesh the server sends: faces with triangles, edges as polylines) is drawn as ONE mesh holding every
// face and ONE set of line segments holding every edge: two draw calls instead of one object per face and edge
// (thousands on an imported part). Each face keeps its vertex and triangle range and a box, each edge its segment
// range and a box, so picking tests only what the ray passes near. Hover and selection draw small copies of the
// faces and edges involved on top.
const boxOf = (p) => {
  const b = new THREE.Box3();
  for (let i = 0; i + 2 < p.length; i += 3) {
    const x = p[i], y = p[i + 1], z = p[i + 2];
    if (x < b.min.x) b.min.x = x; if (y < b.min.y) b.min.y = y; if (z < b.min.z) b.min.z = z;
    if (x > b.max.x) b.max.x = x; if (y > b.max.y) b.max.y = y; if (z > b.max.z) b.max.z = z;
  }
  return b;
};

export function buildPartMesh(body) {
  let nv = 0, ni = 0, ns = 0;
  for (const f of body.faces) { nv += f.positions.length / 3; ni += f.indices.length; }
  for (const e of body.edges) ns += Math.max(0, e.points.length / 3 - 1);
  const pos = new Float32Array(nv * 3);
  const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
  const faces = [], faceIndex = new Map();
  let vo = 0, io = 0;
  for (const f of body.faces) {
    const n = f.positions.length / 3;
    pos.set(f.positions, vo * 3);
    const ix = f.indices;
    for (let k = 0; k < ix.length; k++) idx[io + k] = ix[k] + vo;
    faceIndex.set(String(f.id), faces.length);
    faces.push({ id: f.id, data: f, v0: vo, v1: vo + n, i0: io, i1: io + ix.length, box: boxOf(f.positions).expandByScalar(1e-5) });
    vo += n; io += ix.length;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.computeVertexNormals(); // faces share no vertices, so each keeps its own normals
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  geo.userData.shared = true;
  const seg = new Float32Array(ns * 6);
  const edges = [], edgeIndex = new Map();
  let so = 0;
  for (const e of body.edges) {
    const p = e.points, n = p.length / 3, s0 = so;
    for (let k = 0; k + 1 < n; k++, so++) for (let j = 0; j < 6; j++) seg[so * 6 + j] = p[k * 3 + j];
    edgeIndex.set(String(e.id), edges.length);
    edges.push({ id: e.id, data: e, s0, s1: so, box: boxOf(p) });
  }
  const egeo = new THREE.BufferGeometry();
  egeo.setAttribute('position', new THREE.BufferAttribute(seg, 3));
  egeo.computeBoundingBox(); egeo.computeBoundingSphere();
  egeo.userData.shared = true;
  const bbox = geo.boundingBox.clone().union(egeo.boundingBox);
  return { body, geo, egeo, faces, edges, faceIndex, edgeIndex, bbox, overlays: new Map() };
}

export function disposePartMesh(pm) {
  if (!pm || pm.disposed) return;
  pm.disposed = true;
  pm.geo.dispose(); pm.egeo.dispose();
  for (const g of pm.overlays.values()) g.dispose();
  pm.overlays.clear();
}

// A small geometry of one face (or edge) of a merged body, for its hover / selection highlight. Kept per body.
function overlayGeometry(pm, kind, i) {
  const k = kind + i;
  let g = pm.overlays.get(k);
  if (g) return g;
  g = new THREE.BufferGeometry();
  if (kind === 'f') {
    const f = pm.faces[i], src = pm.geo;
    g.setAttribute('position', new THREE.BufferAttribute(src.attributes.position.array.slice(f.v0 * 3, f.v1 * 3), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(src.attributes.normal.array.slice(f.v0 * 3, f.v1 * 3), 3));
    const ix = src.index.array, out = new Uint32Array(f.i1 - f.i0);
    for (let j = f.i0; j < f.i1; j++) out[j - f.i0] = ix[j] - f.v0;
    g.setIndex(new THREE.BufferAttribute(out, 1));
  } else {
    const e = pm.edges[i];
    g.setAttribute('position', new THREE.BufferAttribute(pm.egeo.attributes.position.array.slice(e.s0 * 6, e.s1 * 6), 3));
  }
  g.computeBoundingSphere();
  pm.overlays.set(k, g);
  if (pm.overlays.size > 96) { const first = pm.overlays.keys().next().value; pm.overlays.get(first).dispose(); pm.overlays.delete(first); }
  return g;
}

/** A body as one mesh + one set of edge lines (preview tools, live builds, ghosts). Disposed with clearGroup. */
export function bodyObject(mesh, color, { opacity = 1, edgeColor = COLORS.edge, faceMaterial = null, edgeMaterial = null } = {}) {
  const pm = buildPartMesh(mesh);
  pm.geo.userData.shared = false; pm.egeo.userData.shared = false;
  const g = new THREE.Group();
  const fm = faceMaterial || new THREE.MeshStandardMaterial({ color, metalness: 0.05, roughness: 0.5, side: THREE.DoubleSide,
    transparent: opacity < 1, opacity, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const em = edgeMaterial || new THREE.LineBasicMaterial({ color: edgeColor, transparent: opacity < 1, opacity: Math.min(1, opacity + 0.2) });
  const lines = new THREE.LineSegments(pm.egeo, em);
  lines.renderOrder = 2;
  g.add(new THREE.Mesh(pm.geo, fm), lines);
  g.userData.partMesh = pm;
  return g;
}

export class Viewer {
  constructor(container, labels) {
    this.el = container;
    this.labels = labels;
    // No preserveDrawingBuffer: snapshot() reads the canvas in the same task it draws it.
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, stencil: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); // phones at 3x: 2x looks the same, a third of the pixels
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.localClippingEnabled = true;
    this.renderer.autoClear = false;
    container.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;
    this.canvas.tabIndex = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1e5, 1e5);
    this.quat = viewQuat('trimetric');
    this.target = new THREE.Vector3(0, 0, 0);
    this.viewH = 160;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa4b0, 1.9));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    this.headlight = new THREE.DirectionalLight(0xffffff, 1.6);
    this.scene.add(this.headlight, this.headlight.target);
    this.fill = new THREE.DirectionalLight(0xffffff, 0.5);
    this.scene.add(this.fill, this.fill.target);

    this.planesGroup = new THREE.Group();
    this.bodyGroup = new THREE.Group();
    this.toolGroup = new THREE.Group();
    this.overlayGroup = new THREE.Group();
    this.sketchGroup = new THREE.Group(); // sketcher draws here, in plane-local coords
    this.sketchGroup.matrixAutoUpdate = false;
    this.otherSketches = new THREE.Group();
    this.liveGroup = new THREE.Group(); // AI live build: parts being built, components flying in
    this.capGroup = new THREE.Group();  // section view: the filled cut face
    this.capMeshes = [];
    this.scene.add(this.capGroup);
    this.scene.add(this.planesGroup, this.bodyGroup, this.toolGroup, this.otherSketches, this.sketchGroup, this.overlayGroup, this.liveGroup);
    this.partGeo = new Map(); // part id -> merged part mesh {key, body, geo, egeo, faces, edges...} shared by every component of that part
    this.retired = [];        // part meshes replaced by a newer build, disposed once nothing draws them
    this.compGroups = new Map();
    this.compMats = new Map(); // component id -> its materials, kept between redraws (no shader rebuilds)
    this.instances = [];       // what bodyGroup draws: the part body, or one per component

    this.displayStyle = 'shadedEdges';
    this.faceObjs = [];        // part body faces: {userData: {kind, id, data, baseColor}, visible, fi}
    this.edgeObjs = [];
    this.planeObjs = new Map();
    this.clipPlane = null;
    this.hover = null;
    this.selected = new Set(); // keys "face:3" "edge:5" "plane:Front Plane"
    this.extraHighlights = new Set();
    this.planeLabels = new Map();
    this.afterRender = [];
    this.screenSized = [];
    this.marks = new Map();    // highlight copies on screen: key -> {obj, kind, color}
    this.markPool = { f: [], e: [] };
    this.partFaceMat = this.newFaceMaterial(0xffffff, { vertexColors: true });
    this.partEdgeMat = new THREE.LineBasicMaterial({ color: COLORS.edge });

    this.buildOrigin();
    this.buildTriad();
    this.resize();
    new ResizeObserver(() => this.resize()).observe(container);
    this.bindMouse();
    this.dirty = true;
    const loop = () => { if (this.dirty) this.render(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  requestRender() { this.dirty = true; }

  resize() {
    const w = this.el.clientWidth || 1, h = this.el.clientHeight || 1;
    this.w = w; this.h = h;
    this.renderer.setSize(w, h);
    this.requestRender();
  }

  get pxSize() { return this.viewH / this.h; }

  updateCamera() {
    const aspect = this.w / this.h;
    const hh = this.viewH / 2, hw = hh * aspect;
    Object.assign(this.camera, { left: -hw, right: hw, top: hh, bottom: -hh });
    const z = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quat);
    this.camera.position.copy(this.target).addScaledVector(z, 5000);
    this.camera.quaternion.copy(this.quat);
    this.camera.near = -1e5; this.camera.far = 1e5;
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quat);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.quat);
    this.headlight.position.copy(this.camera.position).addScaledVector(up, 2000).addScaledVector(right, -1000);
    this.headlight.target.position.copy(this.target);
    this.fill.position.copy(this.target).addScaledVector(z, -3000).addScaledVector(up, -2000);
    this.fill.target.position.copy(this.target);
  }

  render() {
    this.dirty = false;
    this.updateCamera();
    const px = this.pxSize;
    for (const s of this.screenSized) s.obj.scale.setScalar(px * s.px);
    this.renderer.setViewport(0, 0, this.w, this.h);
    this.renderer.setScissorTest(false);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    // reference triad, bottom-left
    const s = 90;
    this.triadCam.quaternion.copy(this.quat);
    this.triadCam.position.set(0, 0, 0).add(new THREE.Vector3(0, 0, 10).applyQuaternion(this.quat));
    this.triadCam.updateMatrixWorld();
    this.renderer.setViewport(4, 26, s, s);
    this.renderer.setScissor(4, 26, s, s);
    this.renderer.setScissorTest(true);
    this.renderer.clearDepth();
    this.renderer.render(this.triadScene, this.triadCam);
    this.renderer.setScissorTest(false);
    this.updatePlaneLabels();
    for (const f of this.afterRender) f();
  }

  // A picture of the model for the Files page: bodies only (sketches when there is no body), trimetric,
  // fitted, no selection colours or section cut, transparent background. Drawn into a corner of the canvas and
  // copied out in the same task (the drawing buffer is still there), then the normal view is drawn again, so it
  // never shows. Returns a Blob (WebP, or PNG where WebP cannot be written) or null when there is nothing to draw.
  async snapshot(W = 480, H = 360) {
    const groups = [this.planesGroup, this.overlayGroup, this.sketchGroup, this.toolGroup, this.liveGroup, this.capGroup, this.otherSketches];
    const hasBody = this.instances.some((x) => x.comp || (x.pm?.faces?.length || 0) > 0); // a sketch-only part draws its sketches
    const vis = groups.map((g) => g.visible);
    const bodyVis = this.bodyGroup.visible;
    const saved = { q: this.quat.clone(), t: this.target.clone(), vh: this.viewH, w: this.w, h: this.h, sel: this.selected,
      hov: this.hoverKey, extra: this.extraHighlights, dim: this.sketchDim, clipC: this.clipPlane?.constant };
    groups.forEach((g) => { g.visible = false; });
    this.bodyGroup.visible = true; // a body hidden with Tab is still the model
    if (!hasBody) this.otherSketches.visible = true;
    const restoreVis = () => { groups.forEach((g, i) => { g.visible = vis[i]; }); this.bodyGroup.visible = bodyVis; };
    const box = this.sceneBox();
    if (box.isEmpty()) { restoreVis(); return null; }
    this.selected = new Set(); this.hoverKey = null; this.extraHighlights = new Set(); this.sketchDim = false;
    if (this.clipPlane) this.clipPlane.constant = 1e12; // nothing cut away
    for (const m of this.capMeshes) m.visible = false;
    this.refreshHighlights();
    // the same colours whoever draws the picture, the browser in any theme or the server (preview.py)
    const themed = { body: COLORS.body, edge: COLORS.edge };
    const recolor = (body, edge) => {
      for (const f of this.faceObjs) if (f.userData.baseColor === COLORS.body) f.userData.baseColor = body;
      COLORS.body = body; COLORS.edge = edge;
      this.refreshColors();
    };
    recolor(THUMB_COLORS.body, THUMB_COLORS.edge);
    let out = null;
    try {
      // the largest W:H region that fits the canvas, bottom-left (GL viewport origin)
      const rw = Math.max(1, Math.min(this.w, this.h * W / H)), rh = rw * H / W;
      this.quat.copy(viewQuat('trimetric'));
      const c = box.getCenter(new THREE.Vector3());
      const inv = this.quat.clone().invert();
      const pts = [];
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).sub(c).applyQuaternion(inv));
      const ew = Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x));
      const eh = Math.max(...pts.map((p) => p.y)) - Math.min(...pts.map((p) => p.y));
      this.target.copy(c); this.w = rw; this.h = rh;
      this.viewH = Math.max(eh, ew * H / W, 1e-3) * 1.18;
      this.updateCamera();
      for (const s of this.screenSized) s.obj.scale.setScalar(this.pxSize * s.px);
      this.renderer.setScissorTest(false);
      this.renderer.setViewport(0, 0, rw, rh);
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      const dpr = this.renderer.getPixelRatio();
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const g2 = cv.getContext('2d');
      g2.imageSmoothingQuality = 'high';
      g2.drawImage(this.canvas, 0, this.canvas.height - rh * dpr, rw * dpr, rh * dpr, 0, 0, W, H);
      out = cv;
    } finally {
      Object.assign(this, { viewH: saved.vh, w: saved.w, h: saved.h, selected: saved.sel, hoverKey: saved.hov, extraHighlights: saved.extra, sketchDim: saved.dim });
      if (this.clipPlane) this.clipPlane.constant = saved.clipC;
      for (const m of this.capMeshes) m.visible = true;
      this.quat.copy(saved.q); this.target.copy(saved.t);
      restoreVis();
      recolor(themed.body, themed.edge);
      this.refreshHighlights();
      this.render();
    }
    const blob = await new Promise((res) => out.toBlob(res, 'image/webp', 0.86));
    return blob && blob.size ? blob : null;
  }

  // ------------------------------------------------------------------ helpers
  worldToScreen(v) {
    const p = (v.isVector3 ? v.clone() : V(v)).project(this.camera);
    return { x: (p.x + 1) / 2 * this.w, y: (1 - p.y) / 2 * this.h };
  }

  rayAt(x, y) {
    const ndc = new THREE.Vector2((x / this.w) * 2 - 1, -(y / this.h) * 2 + 1);
    const rc = new THREE.Raycaster();
    rc.setFromCamera(ndc, this.camera);
    return rc;
  }

  // Intersect the view ray with a plane frame; returns local [u, v] and the world point.
  screenToPlane(x, y, frame) {
    const ray = this.rayAt(x, y).ray;
    const o = V(frame.origin), n = V(frame.normal);
    const denom = ray.direction.dot(n);
    let p;
    if (Math.abs(denom) < 1e-9) p = ray.origin.clone();
    else p = ray.origin.clone().addScaledVector(ray.direction, o.clone().sub(ray.origin).dot(n) / denom);
    const d = p.clone().sub(o);
    return { u: d.dot(V(frame.xdir)), v: d.dot(V(frame.ydir)), world: p };
  }

  frameMatrix(frame) {
    const m = new THREE.Matrix4().makeBasis(V(frame.xdir), V(frame.ydir), V(frame.normal));
    m.setPosition(V(frame.origin));
    return m;
  }

  // ------------------------------------------------------------------ camera ops
  // One camera animation at a time: a new one replaces the old, and any navigation by the person stops it, so a
  // wheel zoom right after Zoom to Fit is not undone by the animation's next frame.
  setView(q, target, viewH, animate = true) {
    const q0 = this.quat.clone(), t0 = this.target.clone(), h0 = this.viewH;
    const q1 = q.clone(), t1 = target ? target.clone() : t0, h1 = viewH || h0;
    this.prevView = { quat: q0, target: t0, viewH: h0 };
    const anim = {};
    this.anim = anim;
    if (!animate || reducedMotion()) { this.quat.copy(q1); this.target.copy(t1); this.viewH = h1; this.anim = null; this.requestRender(); return; }
    const start = performance.now(), dur = 380;
    const step = () => {
      if (this.anim !== anim) return;
      const t = Math.min(1, (performance.now() - start) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      this.quat.slerpQuaternions(q0, q1, e);
      this.target.lerpVectors(t0, t1, e);
      this.viewH = h0 + (h1 - h0) * e;
      this.requestRender();
      if (t < 1) requestAnimationFrame(step); else this.anim = null;
    };
    step();
  }

  stopAnimation() { this.anim = null; }

  previousView() { if (this.prevView) this.setView(this.prevView.quat, this.prevView.target, this.prevView.viewH); }

  standardView(name) { this.setView(viewQuat(name), null, null); }

  normalTo(frame) {
    const q = quatFromBasis(V(frame.xdir), V(frame.ydir), V(frame.normal));
    this.setView(q, null, null);
  }

  sceneBox() {
    const box = new THREE.Box3();
    for (const g of [this.bodyGroup, this.toolGroup, this.sketchGroup, this.otherSketches, this.liveGroup]) {
      if (!g.visible) continue;
      g.updateMatrixWorld(true);
      g.traverse((o) => { if ((o.isMesh || o.isLine) && o.visible && !o.userData.noFit) box.expandByObject(o); });
    }
    return box;
  }

  // Part of the canvas at the bottom covered by something (the AI sheet on phones): fits use the area above it.
  fitHeight() { return Math.max(40, this.h - (this.fitInsetBottom || 0)); }

  fitTo(box, margin, animate) {
    const c = box.getCenter(new THREE.Vector3());
    // projected extent in view axes
    const inv = this.quat.clone().invert();
    const pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).sub(c).applyQuaternion(inv));
    const w = Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x));
    const h = Math.max(...pts.map((p) => p.y)) - Math.min(...pts.map((p) => p.y));
    const vis = this.fitHeight();
    const vh = Math.max(h, w * vis / this.w, 1) * margin * this.h / vis;
    // centre the model in the visible part: move the view centre down by half the covered height
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quat);
    c.addScaledVector(up, -((this.h - vis) / 2) * (vh / this.h));
    this.setView(this.quat, c, vh, animate);
  }

  zoomToFit(animate = true) {
    let box = this.sceneBox();
    if (box.isEmpty()) box = new THREE.Box3(new THREE.Vector3(-50, -50, -50), new THREE.Vector3(50, 50, 50));
    this.fitTo(box, 1.25, animate);
  }

  zoomAt(factor, x, y) {
    this.anim = null;
    const aspect = this.w / this.h;
    const nx = (x / this.w) * 2 - 1, ny = -(y / this.h) * 2 + 1;
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.quat);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quat);
    const hh = this.viewH / 2, hw = hh * aspect;
    const P = this.target.clone().addScaledVector(right, nx * hw).addScaledVector(up, ny * hh);
    this.viewH = Math.min(Math.max(this.viewH * factor, 1e-3), 1e6);
    const hh2 = this.viewH / 2, hw2 = hh2 * aspect;
    this.target.copy(P).addScaledVector(right, -nx * hw2).addScaledVector(up, -ny * hh2);
    this.requestRender();
  }

  rotateBy(dx, dy) {
    this.anim = null;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quat);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.quat);
    const qa = new THREE.Quaternion().setFromAxisAngle(up, -dx);
    const qb = new THREE.Quaternion().setFromAxisAngle(right, -dy);
    const pivot = this.pivot || this.target;
    const rel = this.target.clone().sub(pivot);
    const q = qa.multiply(qb);
    rel.applyQuaternion(q);
    this.target.copy(pivot).add(rel);
    this.quat.premultiply(q).normalize();
    this.requestRender();
  }

  panBy(dx, dy) {
    this.anim = null;
    const px = this.pxSize;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quat);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.quat);
    this.target.addScaledVector(right, -dx * px).addScaledVector(up, dy * px);
    this.requestRender();
  }

  rollBy(a) {
    this.anim = null;
    const z = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quat);
    this.quat.premultiply(new THREE.Quaternion().setFromAxisAngle(z, a)).normalize();
    this.requestRender();
  }

  // Mouse: middle drag (or Alt+drag) rotates, Ctrl pans, Shift zooms; in a shared review a plain left drag rotates
  // too (leftDragRotates). Touch: one finger rotates once it moves (allowTouchRotate says whether a one-finger drag
  // is the view's: not while sketching or dragging a part), two fingers pan and pinch-zoom; onTouchGesture tells
  // the app a two-finger gesture started (it drops any drag of its own).
  bindMouse() {
    const c = this.canvas;
    c.style.touchAction = 'none'; // the page never zooms or scrolls under a finger on the model
    let drag = null;
    const touches = new Map(); // pointer id -> {x, y}
    this.touch = null;          // {mode: 'pending'|'rotate'|'pinch', ...}
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    const pivotHere = () => { const box = this.sceneBox(); this.pivot = box.isEmpty() ? null : box.getCenter(new THREE.Vector3()); };
    c.addEventListener('pointerdown', (e) => {
      c.focus({ preventScroll: true });
      if (e.pointerType === 'touch') {
        const r = c.getBoundingClientRect();
        touches.set(e.pointerId, { x: e.clientX - r.left, y: e.clientY - r.top });
        if (touches.size === 1) this.touch = { mode: 'pending', id: e.pointerId, x: e.clientX, y: e.clientY };
        else if (touches.size === 2) {
          const [a, b] = [...touches.values()];
          this.touch = { mode: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
          this.lastUserNav = performance.now();
          this.onTouchGesture?.();
        }
        return;
      }
      if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 2 && e.altKey) || (e.button === 0 && this.leftDragRotates?.(e))) {
        e.preventDefault();
        pivotHere();
        drag = { x: e.clientX, y: e.clientY, mode: e.ctrlKey ? 'pan' : e.shiftKey ? 'zoom' : 'rotate', zy: e.offsetY, zx: e.offsetX, id: e.pointerId };
        this.lastUserNav = performance.now();
        this.anim = null;
        try { c.setPointerCapture(e.pointerId); } catch (_) { /* */ }
      }
    });
    c.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch' && touches.has(e.pointerId)) {
        const r = c.getBoundingClientRect();
        const p = { x: e.clientX - r.left, y: e.clientY - r.top };
        const prev = touches.get(e.pointerId);
        touches.set(e.pointerId, p);
        const t = this.touch;
        if (!t) return;
        if (t.mode === 'pending' && t.id === e.pointerId && Math.hypot(e.clientX - t.x, e.clientY - t.y) > 6 && (this.allowTouchRotate?.() ?? true)) {
          t.mode = 'rotate'; pivotHere();
        }
        if (t.mode === 'rotate' && t.id === e.pointerId) {
          this.lastUserNav = performance.now();
          this.rotateBy((p.x - prev.x) * 0.008, (p.y - prev.y) * 0.008);
        } else if (t.mode === 'pinch' && touches.size >= 2) {
          const [a, b] = [...touches.values()];
          const d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
          this.lastUserNav = performance.now();
          this.panBy(mx - t.mx, my - t.my);
          this.zoomAt(t.d / d, mx, my);
          Object.assign(t, { d, mx, my });
        }
        return;
      }
      if (!drag) return;
      this.lastUserNav = performance.now();
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      if (drag.mode === 'rotate') this.rotateBy(dx * 0.008, dy * 0.008);
      else if (drag.mode === 'pan') this.panBy(dx, dy);
      else this.zoomAt(Math.exp(dy * 0.01), drag.zx, drag.zy);
    });
    const end = (e) => {
      if (e.pointerType === 'touch') {
        touches.delete(e.pointerId);
        if (!touches.size) { this.touch = null; this.pivot = null; }
        else if (this.touch?.mode === 'pinch' && touches.size === 1) this.touch = { mode: 'done' }; // lifting one finger of a pinch does not start a rotate
        return;
      }
      if (drag && (e.pointerId === undefined || e.pointerId === drag.id)) { drag = null; this.pivot = null; try { c.releasePointerCapture(e.pointerId); } catch (_) { /* */ } }
    };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('lostpointercapture', (e) => { if (drag && e.pointerId === drag.id) { drag = null; this.pivot = null; } });
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.lastUserNav = performance.now();
      // SOLIDWORKS default: roll the wheel toward you to zoom in. A trackpad pinch arrives as a wheel with Ctrl.
      const dir = this.reverseWheel ? -1 : 1;
      this.zoomAt(Math.exp(-dir * Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.0018 * (e.deltaMode ? 30 : 1)), e.offsetX, e.offsetY);
    }, { passive: false });
    this.isNavigating = () => !!drag || this.touch?.mode === 'rotate' || this.touch?.mode === 'pinch' || this.touch?.mode === 'done';
    this.touchGesture = () => this.touch?.mode || null;
  }

  // ------------------------------------------------------------------ scene content
  buildOrigin() {
    // Part origin: small blue arrows, constant screen size.
    const g = new THREE.Group();
    const mat = new THREE.LineBasicMaterial({ color: 0x2a5ea8, depthTest: false });
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(18, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 18, 0),
      new THREE.Vector3(18, 0, 0), new THREE.Vector3(14, 2.5, 0), new THREE.Vector3(18, 0, 0), new THREE.Vector3(14, -2.5, 0),
      new THREE.Vector3(0, 18, 0), new THREE.Vector3(2.5, 14, 0), new THREE.Vector3(0, 18, 0), new THREE.Vector3(-2.5, 14, 0),
    ]);
    const ls = new THREE.LineSegments(geo, mat);
    ls.renderOrder = 10; ls.userData.noFit = true;
    g.add(ls);
    this.originObj = g;
    this.overlayGroup.add(g);
    this.screenSized.push({ obj: g, px: 1 });
    // Sketch origin (red), used in sketch mode
    const sg = new THREE.Group();
    const sm = new THREE.LineBasicMaterial({ color: 0xd01010, depthTest: false });
    const sgeo = geo.clone();
    const sls = new THREE.LineSegments(sgeo, sm);
    sls.renderOrder = 20; sls.userData.noFit = true;
    sg.add(sls);
    sg.visible = false;
    this.sketchOrigin = sg;
    this.screenSized.push({ obj: sg, px: 1 });
  }

  buildTriad() {
    this.triadScene = new THREE.Scene();
    this.triadCam = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, -20, 20);
    const axis = (dir, color) => {
      const a = new THREE.ArrowHelper(V(dir), new THREE.Vector3(), 1, color, 0.3, 0.16);
      this.triadScene.add(a);
    };
    axis([1, 0, 0], 0xd03030); axis([0, 1, 0], 0x30a030); axis([0, 0, 1], 0x3050d0);
    const mk = (txt, color, pos) => {
      const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
      const g = cv.getContext('2d'); g.font = 'bold 44px Arial'; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, 32, 34);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), depthTest: false }));
      sp.position.set(...pos); sp.scale.setScalar(0.42);
      this.triadScene.add(sp);
    };
    mk('X', '#c02020', [1.28, 0, 0]); mk('Y', '#209020', [0, 1.28, 0]); mk('Z', '#2040c0', [0, 0, 1.28]);
  }

  setPlanes(list) {
    // list: [{id, name, frame, size, visible, state:'normal'|'hl'|'sel'}]
    const seen = new Set();
    const drop = (obj) => { this.planesGroup.remove(obj); obj.traverse((x) => { x.geometry?.dispose(); x.material?.dispose(); }); };
    for (const p of list) {
      seen.add(p.id);
      let obj = this.planeObjs.get(p.id);
      const key = JSON.stringify([p.frame, p.size]);
      if (!obj || obj.userData.key !== key) {
        if (obj) drop(obj);
        obj = new THREE.Group();
        const s = p.size / 2;
        const geo = new THREE.PlaneGeometry(p.size, p.size);
        const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: COLORS.plane, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
        mesh.userData = { kind: 'plane', id: p.id, noFit: true };
        const border = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-s, -s, 0), new THREE.Vector3(s, -s, 0), new THREE.Vector3(s, s, 0), new THREE.Vector3(-s, s, 0)]),
          new THREE.LineBasicMaterial({ color: COLORS.planeEdge, transparent: true, opacity: 0.8 }));
        border.userData.noFit = true;
        obj.add(mesh, border);
        obj.matrixAutoUpdate = false;
        obj.matrix.copy(this.frameMatrix(p.frame));
        obj.userData = { key, mesh, border, id: p.id, name: p.name, corner: [-s, s] };
        this.planeObjs.set(p.id, obj);
        this.planesGroup.add(obj);
      }
      obj.visible = !!p.visible;
      const st = p.state || 'normal';
      obj.userData.mesh.material.color.setHex(st === 'sel' ? COLORS.sel : st === 'hl' ? COLORS.hl : COLORS.plane);
      obj.userData.mesh.material.opacity = st === 'normal' ? 0.16 : 0.3;
      obj.userData.border.material.color.setHex(st === 'sel' ? COLORS.sel : st === 'hl' ? COLORS.hl : COLORS.planeEdge);
      obj.userData.label = p.name;
    }
    for (const [id, obj] of this.planeObjs) if (!seen.has(id)) { drop(obj); this.planeObjs.delete(id); }
    this.requestRender();
  }

  updatePlaneLabels() {
    for (const [id, obj] of this.planeObjs) {
      let el = this.planeLabels.get(id);
      if (!obj.visible) { if (el) el.style.display = 'none'; continue; }
      if (!el) { el = document.createElement('div'); el.className = 'planelbl'; this.labels.appendChild(el); this.planeLabels.set(id, el); }
      const c = new THREE.Vector3(obj.userData.corner[0], obj.userData.corner[1], 0).applyMatrix4(obj.matrix);
      const s = this.worldToScreen(c);
      el.style.display = '';
      el.style.left = s.x + 'px'; el.style.top = s.y + 'px';
      el.textContent = obj.userData.label;
    }
    for (const [id, el] of this.planeLabels) if (!this.planeObjs.has(id)) { el.remove(); this.planeLabels.delete(id); }
  }

  // Removes and frees a group's objects. Geometry marked shared (part meshes used by components) and materials
  // marked keep (reused between redraws) stay.
  clearGroup(g) {
    for (const o of [...g.children]) {
      g.remove(o);
      o.traverse((x) => {
        if (x.geometry && !x.geometry.userData.shared) x.geometry.dispose();
        if (x.material) (Array.isArray(x.material) ? x.material : [x.material]).forEach((m) => { if (!m.userData.keep) m.dispose(); });
      });
    }
  }

  newFaceMaterial(color = COLORS.body, opts = {}) {
    const m = new THREE.MeshStandardMaterial({
      color, metalness: 0.05, roughness: 0.5, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
      clippingPlanes: this.clipPlane ? [this.clipPlane] : [], ...opts,
    });
    m.userData.keep = true;
    return m;
  }

  faceMaterial(color = COLORS.body, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color, metalness: 0.05, roughness: 0.5, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
      clippingPlanes: this.clipPlane ? [this.clipPlane] : [], ...opts,
    });
  }

  // Every material in bodyGroup and the highlight copies (clipping planes, display style).
  bodyMaterials() {
    const out = [];
    for (const inst of this.instances) out.push(inst.faceMat, inst.edgeMat, ...(inst.dashed ? [inst.dashed.material] : []));
    for (const m of this.marks.values()) out.push(m.obj.material);
    for (const k of ['f', 'e']) for (const o of this.markPool[k]) out.push(o.material);
    return out;
  }

  // One drawn copy of a merged part: its mesh and edge lines under a group (component placement, or none).
  makeInstance(pm, comp, faceMat, edgeMat) {
    const group = new THREE.Group();
    group.matrixAutoUpdate = false;
    const mesh = new THREE.Mesh(pm.geo, faceMat);
    const lines = new THREE.LineSegments(pm.egeo, edgeMat);
    lines.renderOrder = 2;
    mesh.raycast = () => {}; lines.raycast = () => {}; // picked by pick(), which knows the faces
    group.add(mesh, lines);
    const inst = { pm, comp, group, mesh, lines, faceMat, edgeMat, dashed: null, color: COLORS.body, opacity: 1 };
    group.userData = { comp, inst };
    return inst;
  }

  // Colour and see-through of one component (faces and edges); materials change in place.
  setInstanceLook(inst, color, opacity) {
    inst.color = color;
    if (inst.opacity !== opacity) {
      inst.opacity = opacity;
      const fm = inst.faceMat, em = inst.edgeMat;
      const t = opacity < 1;
      if (fm.transparent !== t) { fm.transparent = t; em.transparent = t; fm.needsUpdate = true; em.needsUpdate = true; }
      fm.opacity = opacity; fm.depthWrite = !t || opacity > 0.6;
      em.opacity = Math.min(1, opacity + 0.2);
    }
  }

  // Remove what bodyGroup draws (the part body or the components); materials of components stay pooled.
  clearBodies() {
    this.clearMarks();
    for (const m of this.capMeshes) m.parent?.remove(m);
    this.capMeshes = [];
    for (const inst of this.instances) {
      if (inst.dashed) { inst.dashed.material.dispose(); }
      if (inst.ownPart) disposePartMesh(inst.pm);
    }
    this.clearGroup(this.bodyGroup);
    this.instances = [];
    this.compGroups = new Map();
    this.compInst = new Map();
    this.asmSig = null;
    this.faceObjs = []; this.edgeObjs = [];
  }

  setBody(mesh, opts = {}) {
    this.clearBodies();
    this.bodyData = mesh;
    if (!mesh) { this.requestRender(); return; }
    const color = opts.color ?? this.bodyColor ?? COLORS.body;
    const pm = buildPartMesh(mesh);
    // per-face colours (FeatureWorks colours faces by what they became; sketch mode dims the body) as vertex colours
    pm.geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pm.geo.attributes.position.count * 3), 3));
    const fm = this.partFaceMat;
    const op = opts.transparent ? 0.55 : 1;
    if (fm.transparent !== op < 1) { fm.transparent = op < 1; fm.needsUpdate = true; }
    fm.opacity = op;
    const inst = this.makeInstance(pm, null, fm, this.partEdgeMat);
    inst.ownPart = true;
    this.bodyGroup.add(inst.group);
    this.instances = [inst];
    this.faceObjs = pm.faces.map((f, i) => ({ userData: { kind: 'face', id: f.id, data: f.data, baseColor: color }, visible: true, fi: i, painted: null }));
    this.applyDisplayStyle();
    if (this.clipPlane) this.rebuildCaps();
  }

  setTool(mesh, color = COLORS.tool) {
    this.clearGroup(this.toolGroup);
    if (mesh) {
      const g = bodyObject(mesh, color, {
        faceMaterial: new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, metalness: 0.1, roughness: 0.6 }),
        edgeMaterial: new THREE.LineBasicMaterial({ color: 0x8a6a00 }) });
      this.toolGroup.add(g);
    }
    this.requestRender();
  }

  setDisplayStyle(s) { this.displayStyle = s; this.applyDisplayStyle(); }

  // After the theme changes (COLORS updated in place): edges and highlights of what is drawn now take the new colours.
  refreshColors() {
    this.partEdgeMat.color.setHex(COLORS.edge);
    for (const m of this.compMats.values()) m.edge.color.setHex(COLORS.edge);
    for (const r of this.faceObjs) r.painted = null;
    this.applyDisplayStyle();
  }

  applyDisplayStyle() {
    const s = this.displayStyle;
    this.clearMarks(); // redrawn below for the new style
    for (const inst of this.instances) {
      inst.mesh.visible = s !== 'wireframe';
      inst.faceMat.emissive?.setHex(s === 'hlr' ? 0xffffff : 0x000000);
      inst.faceMat.colorWrite = s !== 'hlv'; // depth only: hides edges behind faces
      inst.lines.visible = s !== 'shaded';
      inst.edgeMat.depthTest = s !== 'wireframe';
      // hidden-line copy, shown dashed grey in "Hidden Lines Visible"; made the first time it is needed
      if (s === 'hlv' && !inst.dashed) {
        if (!inst.pm.egeo.attributes.lineDistance) { const tmp = new THREE.LineSegments(inst.pm.egeo); tmp.computeLineDistances(); }
        inst.dashed = new THREE.LineSegments(inst.pm.egeo, new THREE.LineDashedMaterial({ color: 0x9a9a9a, dashSize: 1, gapSize: 1, depthTest: false,
          clippingPlanes: this.clipPlane ? [this.clipPlane] : [] }));
        inst.dashed.renderOrder = 1; inst.dashed.userData.noFit = true; inst.dashed.raycast = () => {};
        inst.group.add(inst.dashed);
      }
      if (inst.dashed) {
        inst.dashed.visible = s === 'hlv';
        const px = this.pxSize * 4;
        inst.dashed.material.dashSize = px; inst.dashed.material.gapSize = px * 0.7;
      }
    }
    for (const f of this.faceObjs) f.visible = s !== 'wireframe';
    this.refreshHighlights();
  }

  // Section view: one clipping plane shared by every material, so moving the section only moves the plane (no
  // new materials or shaders); the stencil copies that fill the cut are made once per drawn body.
  setSection(frame) {
    const wasOn = !!this.clipPlane;
    this.sectionFrame = frame || null;
    if (!frame) {
      if (!wasOn) return;
      this.clipPlane = null;
      for (const m of this.bodyMaterials()) { m.clippingPlanes = []; }
      this.rebuildCaps();
      this.requestRender();
      return;
    }
    const n = V(frame.normal).negate();
    if (!wasOn) this.clipPlane = new THREE.Plane();
    this.clipPlane.setFromNormalAndCoplanarPoint(n, V(frame.origin));
    if (!wasOn) {
      for (const m of this.bodyMaterials()) m.clippingPlanes = [this.clipPlane];
      this.rebuildCaps();
    } else this.placeCap();
    this.requestRender();
  }

  // Filled section faces (stencil capping): every drawn body gets two stencil copies next to it (so they follow
  // component moves), then one plane is drawn where the stencil says "inside".
  rebuildCaps() {
    for (const m of this.capMeshes) m.parent?.remove(m);
    this.capMeshes = [];
    if (!this.clipPlane) { this.capGroup.visible = false; return; }
    const planes = [this.clipPlane];
    if (!this.stencilMats) {
      this.stencilMats = [[THREE.BackSide, THREE.IncrementWrapStencilOp], [THREE.FrontSide, THREE.DecrementWrapStencilOp]].map(([side, op]) => {
        const m = new THREE.MeshBasicMaterial({ side, depthWrite: false, depthTest: false, colorWrite: false,
          stencilWrite: true, stencilFunc: THREE.AlwaysStencilFunc, stencilFail: op, stencilZFail: op, stencilZPass: op });
        m.userData.keep = true;
        return m;
      });
    }
    for (const m of this.stencilMats) m.clippingPlanes = planes;
    for (const inst of this.instances) {
      if (!inst.mesh.visible) continue;
      for (const mat of this.stencilMats) {
        const m = new THREE.Mesh(inst.pm.geo, mat);
        m.renderOrder = 5; m.userData.noFit = true; m.raycast = () => {};
        inst.group.add(m);
        this.capMeshes.push(m);
      }
    }
    if (!this.capMesh) {
      this.capMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({
        color: 0xd98c3c, metalness: 0, roughness: 0.8, side: THREE.DoubleSide,
        stencilWrite: true, stencilRef: 0, stencilFunc: THREE.NotEqualStencilFunc,
        stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp, stencilZPass: THREE.ReplaceStencilOp }));
      this.capMesh.renderOrder = 6; this.capMesh.userData.noFit = true; this.capMesh.raycast = () => {};
      this.capMesh.onAfterRender = (r) => r.clearStencil();
      this.capGroup.add(this.capMesh);
    }
    this.capGroup.visible = true;
    this.placeCap();
  }

  placeCap() {
    if (!this.capMesh || !this.clipPlane) return;
    const box = this.sceneBox();
    const size = box.isEmpty() ? 500 : box.getSize(new THREE.Vector3()).length() * 1.5;
    const n = this.clipPlane.normal.clone();
    const c = box.isEmpty() ? n.clone().multiplyScalar(-this.clipPlane.constant) : this.clipPlane.projectPoint(box.getCenter(new THREE.Vector3()), new THREE.Vector3());
    this.capMesh.position.copy(c);
    this.capMesh.scale.set(size, size, 1);
    this.capMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  }

  // ------------------------------------------------------------------ picking
  // Faces and edges of the drawn bodies under the cursor. Each body is tested in its own coordinates: its box,
  // then the boxes of its faces and edges, then only the triangles and segments of those. With a section on,
  // what is cut away cannot be picked (and does not hide what is behind it).
  pick(x, y, filter = {}) {
    const rc = this.rayAt(x, y);
    const px = this.pxSize;
    const want = { faces: true, edges: true, planes: false, ...filter };
    const clip = this.clipPlane;
    const kept = (p) => !clip || clip.distanceToPoint(p) >= -1e-6;
    const style = this.displayStyle;
    const bodies = this.bodyGroup.visible ? this.instances : [];
    let faceHits = null;
    const faces = () => (faceHits ??= this.rayFaces(rc.ray, bodies).filter((h) => kept(h.point)));
    const idOf = (inst, id) => (inst.comp ? `${inst.comp}/${id}` : id);
    if (want.edges && style !== 'shaded') {
      const hits = this.rayEdges(rc.ray, px * 5, bodies).filter((h) => kept(h.point));
      if (hits.length) {
        // prefer an edge that is not hidden behind a face
        const faceHit = style === 'wireframe' ? null : faces()[0];
        const h = hits.find((hh) => !faceHit || hh.distance <= faceHit.distance + px * 3);
        if (h) { const e = h.inst.pm.edges[h.i]; return { kind: 'edge', id: idOf(h.inst, e.id), data: e.data, point: h.point, object: h.inst.group }; }
      }
    }
    if (want.faces && style !== 'wireframe') {
      const h = faces()[0];
      if (h) { const f = h.inst.pm.faces[h.i]; return { kind: 'face', id: idOf(h.inst, f.id), data: f.data, point: h.point, object: h.inst.group }; }
    }
    if (want.planes) {
      const objs = [...this.planeObjs.values()].filter((o) => o.visible).map((o) => o.userData.mesh);
      const hits = rc.intersectObjects(objs, false);
      if (hits.length) return { kind: 'plane', id: hits[0].object.userData.id, point: hits[0].point };
    }
    return null;
  }

  localRay(ray, inst) {
    inst.group.updateMatrixWorld();
    const inv = new THREE.Matrix4().copy(inst.group.matrixWorld).invert();
    return { ray: ray.clone().applyMatrix4(inv), mw: inst.group.matrixWorld };
  }

  // Every face hit along the ray, nearest first: [{inst, i, distance, point}]
  rayFaces(ray, bodies = this.instances) {
    const out = [];
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), hit = new THREE.Vector3();
    for (const inst of bodies) {
      if (!inst.mesh.visible) continue;
      const { ray: r, mw } = this.localRay(ray, inst);
      const pm = inst.pm;
      if (!r.intersectsBox(pm.bbox)) continue;
      const pos = pm.geo.attributes.position.array, idx = pm.geo.index.array;
      for (let i = 0; i < pm.faces.length; i++) {
        const f = pm.faces[i];
        if (!r.intersectsBox(f.box)) continue;
        for (let k = f.i0; k < f.i1; k += 3) {
          a.fromArray(pos, idx[k] * 3); b.fromArray(pos, idx[k + 1] * 3); c.fromArray(pos, idx[k + 2] * 3);
          if (!r.intersectTriangle(a, b, c, false, hit)) continue;
          const point = hit.clone().applyMatrix4(mw);
          out.push({ inst, i, distance: ray.origin.distanceTo(point), point });
        }
      }
    }
    return out.sort((p, q) => p.distance - q.distance);
  }

  // Edges within `tol` (world units) of the ray, nearest first: [{inst, i, distance, point}]
  rayEdges(ray, tol, bodies = this.instances) {
    const out = [];
    const a = new THREE.Vector3(), b = new THREE.Vector3(), onRay = new THREE.Vector3(), onSeg = new THREE.Vector3();
    const box = new THREE.Box3();
    const t2 = tol * tol;
    for (const inst of bodies) {
      if (!inst.lines.visible) continue;
      const { ray: r, mw } = this.localRay(ray, inst);
      const pm = inst.pm;
      if (!r.intersectsBox(box.copy(pm.bbox).expandByScalar(tol))) continue;
      const seg = pm.egeo.attributes.position.array;
      for (let i = 0; i < pm.edges.length; i++) {
        const e = pm.edges[i];
        if (e.s1 === e.s0 || !r.intersectsBox(box.copy(e.box).expandByScalar(tol))) continue;
        let best = null;
        for (let s = e.s0; s < e.s1; s++) {
          a.fromArray(seg, s * 6); b.fromArray(seg, s * 6 + 3);
          if (r.distanceSqToSegment(a, b, onRay, onSeg) > t2) continue;
          const d = r.origin.distanceTo(onRay);
          if (!best || d < best.d) best = { d, p: onSeg.clone() };
        }
        if (best) out.push({ inst, i, distance: best.d, point: best.p.applyMatrix4(mw) });
      }
    }
    return out.sort((p, q) => p.distance - q.distance);
  }

  key(p) { return p ? `${p.kind}:${p.id}` : null; }

  setHover(p) {
    const k = this.key(p);
    if (k === this.hoverKey) return;
    this.hoverKey = k;
    this.refreshHighlights();
  }

  // Dark theme: while a sketch is open the body is drawn darker, so light sketch lines and dimensions
  // read clearly on top of it.
  baseFor(f) { return this.sketchDim && SKETCH_BODY_DIM != null ? mix(f.userData.baseColor, SKETCH_BODY_DIM, 0.9) : f.userData.baseColor; }
  setSketchDim(on) { if (!!on === !!this.sketchDim) return; this.sketchDim = !!on; this.refreshHighlights(); }

  // The look changed (View > Theme, no reload): take the new palette and recolour what is drawn. Faces in the
  // default body colour follow it; faces with their own appearance keep theirs.
  applyLook() {
    const oldBody = COLORS.body;
    Object.assign(COLORS, COLORS_CLASSIC, VIEW_COLORS || {});
    for (const f of this.faceObjs) if (f.userData.baseColor === oldBody) f.userData.baseColor = COLORS.body;
    for (const obj of this.planeObjs.values()) {
      obj.userData.mesh.material.color.setHex(COLORS.plane);
      obj.userData.border.material.color.setHex(COLORS.planeEdge);
    }
    this.refreshColors(); // edges and the body's vertex colours
  }

  setSelectedKeys(keys) { this.selected = new Set(keys); this.refreshHighlights(); }

  // Part body: write each face's base colour into the vertex colours (only faces whose colour changed).
  paintBody(inst) {
    const attr = inst.pm.geo.attributes.color;
    if (!attr) return;
    const white = this.displayStyle === 'hlr';
    const col = new THREE.Color();
    let changed = false;
    for (const r of this.faceObjs) {
      const want = white ? 0xffffff : this.baseFor(r);
      if (r.painted === want) continue;
      r.painted = want; changed = true;
      col.setHex(want);
      const f = inst.pm.faces[r.fi], arr = attr.array;
      for (let v = f.v0; v < f.v1; v++) { arr[v * 3] = col.r; arr[v * 3 + 1] = col.g; arr[v * 3 + 2] = col.b; }
    }
    if (changed) attr.needsUpdate = true;
  }

  // Where a face or edge key lives: the drawn body, the index of the face or edge, and its base colour.
  locate(key) {
    const m = /^(face|edge):(.*)$/.exec(key || '');
    if (!m) return null;
    let inst, id = m[2];
    if (id.includes('/')) { const [comp, sub] = id.split('/'); inst = this.compInst?.get(comp); id = sub; } else inst = this.instances.find((x) => !x.comp);
    if (!inst) return null;
    const i = (m[1] === 'face' ? inst.pm.faceIndex : inst.pm.edgeIndex).get(id);
    if (i === undefined) return null;
    const base = m[1] === 'face' ? (inst.comp ? inst.color : this.faceObjs[i] ? this.baseFor(this.faceObjs[i]) : COLORS.body) : COLORS.edge;
    return { kind: m[1] === 'face' ? 'f' : 'e', inst, i, base };
  }

  clearMarks() {
    for (const [, m] of this.marks) { m.obj.parent?.remove(m.obj); this.markPool[m.kind].push(m.obj); }
    this.marks.clear();
  }

  // Hover, selection and the extra highlight, drawn as copies of the faces and edges involved (the merged body
  // keeps its own colours). Components are tinted through their material.
  refreshHighlights() {
    const style = this.displayStyle;
    for (const inst of this.instances) {
      if (!inst.comp) { this.paintBody(inst); inst.faceMat.color.setHex(0xffffff); continue; }
      const ck = 'comp:' + inst.comp;
      const base = style === 'hlr' ? 0xffffff : inst.color;
      inst.faceMat.color.setHex(this.selected.has(ck) ? mix(base, COLORS.sel, 0.45) : this.hoverKey === ck ? mix(base, COLORS.hl, 0.35) : base);
    }
    const want = new Map();
    for (const k of this.selected) want.set(k, 'sel');
    if (this.hoverKey && !want.has(this.hoverKey)) want.set(this.hoverKey, 'hl');
    for (const k of this.extraHighlights) if (!want.has(k)) want.set(k, 'extra');
    for (const [k, m] of this.marks) {
      if (want.get(k) === m.state && m.obj.parent && m.inst && this.instances.includes(m.inst)) continue;
      m.obj.parent?.remove(m.obj); this.markPool[m.kind].push(m.obj); this.marks.delete(k);
    }
    for (const [k, state] of want) {
      if (this.marks.has(k)) continue;
      const at = this.locate(k);
      if (!at) continue;
      const geo = overlayGeometry(at.inst.pm, at.kind, at.i);
      let obj = this.markPool[at.kind].pop();
      if (at.kind === 'f') {
        const color = state === 'sel' ? mix(style === 'hlr' ? 0xffffff : at.base, COLORS.sel, 0.6) : state === 'hl' ? mix(style === 'hlr' ? 0xffffff : at.base, COLORS.hl, 0.45) : 0xc8d8ff;
        if (!obj) {
          const mat = new THREE.MeshStandardMaterial({ metalness: 0.05, roughness: 0.5, side: THREE.DoubleSide });
          mat.userData.keep = true;
          obj = new THREE.Mesh(geo, mat); obj.renderOrder = 1; obj.userData.noFit = true; obj.raycast = () => {};
        }
        obj.geometry = geo;
        obj.material.color.setHex(color);
        obj.visible = style !== 'wireframe';
      } else {
        if (!obj) {
          const mat = new THREE.LineBasicMaterial({ depthTest: false });
          mat.userData.keep = true;
          obj = new THREE.LineSegments(geo, mat); obj.renderOrder = 3; obj.userData.noFit = true; obj.raycast = () => {};
        }
        obj.geometry = geo;
        obj.material.color.setHex(state === 'sel' ? COLORS.sel : state === 'hl' ? COLORS.hl : COLORS.sel);
        obj.visible = true;
      }
      obj.material.clippingPlanes = this.clipPlane ? [this.clipPlane] : [];
      at.inst.group.add(obj);
      this.marks.set(k, { obj, kind: at.kind, state, inst: at.inst });
    }
    this.requestRender();
  }

  // ------------------------------------------------------------------ assemblies
  // Geometry of a part, built once and shared by every component that uses it. A newer build of the part
  // replaces it; the old one is freed once nothing draws it (GPU buffers included).
  partGeometry(pid, key, body) {
    const hit = this.partGeo.get(pid);
    if (hit && hit.key === key) return hit;
    if (!body) return hit || null;
    const pm = buildPartMesh(body);
    pm.key = key;
    if (hit) this.retired.push(hit);
    this.partGeo.set(pid, pm);
    return pm;
  }

  /** Forget a part's geometry (the part left the document, or its mesh must be sent again). */
  dropPart(pid) {
    const pm = this.partGeo.get(pid);
    if (!pm) return;
    this.partGeo.delete(pid);
    if (this.instances.some((i) => i.pm === pm)) this.retired.push(pm); else disposePartMesh(pm);
  }

  flushRetired() {
    const inUse = new Set(this.instances.map((i) => i.pm));
    this.retired = this.retired.filter((pm) => { if (inUse.has(pm)) return true; disposePartMesh(pm); return false; });
  }

  // One group per component (matrix = component placement), for the live build. Faces carry ids "c2/5".
  componentGroup(pg, opts) {
    const op = opts.opacity ?? 1;
    const fm = this.faceMaterial(opts.color, op < 1 ? { transparent: true, opacity: op, depthWrite: op > 0.6 } : {});
    const em = new THREE.LineBasicMaterial({ color: COLORS.edge, transparent: op < 1, opacity: Math.min(1, op + 0.2) });
    const inst = this.makeInstance(pg, opts.id, fm, em);
    return inst.group;
  }

  // comps: [{id, part, key, matrix, color, hidden, opacity}], bodies: {part id: mesh or undefined}
  // When the same components show the same part builds, only their placements and colours change (drags, mate
  // previews, Motion Review frames): no objects or materials are made, so no shaders are rebuilt.
  setAssembly(comps, bodies = {}) {
    const list = [];
    for (const c of comps) {
      const pg = this.partGeometry(c.part, c.key, bodies[c.part]);
      if (!pg || c.hidden) continue;
      list.push({ c, pg });
    }
    const sig = list.map(({ c, pg }) => `${c.id}|${c.part}|${pg.key}`).join(';');
    if (sig === this.asmSig && list.every(({ c, pg }) => this.compInst.get(c.id)?.pm === pg)) {
      for (const { c } of list) {
        const inst = this.compInst.get(c.id);
        inst.group.matrix.copy(matOf(c.matrix));
        inst.group.matrixWorldNeedsUpdate = true;
        this.setInstanceLook(inst, c.color ?? COLORS.body, c.opacity ?? 1);
      }
      this.bodyGroup.updateMatrixWorld(true);
      this.refreshHighlights();
      return;
    }
    this.clearBodies();
    this.bodyData = null;
    const used = new Set();
    for (const { c, pg } of list) {
      let mats = this.compMats.get(c.id);
      if (!mats) {
        const em = new THREE.LineBasicMaterial({ color: COLORS.edge }); em.userData.keep = true;
        mats = { face: this.newFaceMaterial(COLORS.body), edge: em };
        this.compMats.set(c.id, mats);
      }
      used.add(c.id);
      const inst = this.makeInstance(pg, c.id, mats.face, mats.edge);
      inst.opacity = null;
      this.setInstanceLook(inst, c.color ?? COLORS.body, c.opacity ?? 1);
      inst.group.matrix.copy(matOf(c.matrix));
      inst.group.matrixWorldNeedsUpdate = true;
      this.bodyGroup.add(inst.group);
      this.instances.push(inst);
      this.compGroups.set(c.id, inst.group);
      this.compInst.set(c.id, inst);
    }
    for (const [id, mats] of this.compMats) if (!used.has(id)) { mats.face.dispose(); mats.edge.dispose(); this.compMats.delete(id); }
    for (const m of this.bodyMaterials()) m.clippingPlanes = this.clipPlane ? [this.clipPlane] : [];
    this.asmSig = sig;
    this.flushRetired();
    this.applyDisplayStyle();
    this.bodyGroup.updateMatrixWorld(true);
    if (this.clipPlane) this.rebuildCaps();
  }

  // Tween groups to new matrices. items: [{group, to: Matrix4, via?: Matrix4, from?: Matrix4}]. A path through
  // `via` is a smooth curve (via pulls it, as a Bezier control point), not two straight legs. `signal` (an
  // AbortSignal) ends it early at the end pose; reduced motion jumps there at once.
  tweenGroups(items, dur = 700, signal = null) {
    const parts = items.map((it) => {
      const keys = [it.from || it.group.matrix.clone(), ...(it.via ? [it.via] : []), it.to].map((m) => {
        const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
        m.decompose(p, q, s);
        return { p, q, s };
      });
      return { g: it.group, keys };
    });
    if (reducedMotion()) dur = 0;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    return new Promise((resolve) => {
      const t0 = performance.now();
      const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
      const frame = () => {
        const u = dur <= 0 || signal?.aborted ? 1 : Math.min(1, (performance.now() - t0) / dur);
        const e = ease(u);
        for (const { g, keys } of parts) {
          const a = keys[0], b = keys[keys.length - 1];
          if (keys.length === 3) {
            const v = keys[1], w0 = (1 - e) * (1 - e), w1 = 2 * (1 - e) * e, w2 = e * e;
            p.set(0, 0, 0).addScaledVector(a.p, w0).addScaledVector(v.p, w1).addScaledVector(b.p, w2);
          } else p.lerpVectors(a.p, b.p, e);
          q.slerpQuaternions(a.q, b.q, e); s.lerpVectors(a.s, b.s, e);
          g.matrix.compose(p, q, s);
          g.matrixWorldNeedsUpdate = true;
        }
        this.requestRender();
        if (u < 1) requestAnimationFrame(frame); else resolve();
      };
      frame();
    });
  }

  // Fit the camera to a box only if the user has not been navigating in the last few seconds.
  followBox(box, animate = true) {
    if (!box || box.isEmpty()) return;
    if (this.lastUserNav && performance.now() - this.lastUserNav < 4000) return;
    this.fitTo(box, 1.3, animate);
  }
}
