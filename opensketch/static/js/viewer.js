// Graphics area: orthographic three.js view with SOLIDWORKS mouse behaviour.
// Middle drag rotates, Ctrl+middle pans, Shift+middle zooms, wheel zooms about the cursor.

import * as THREE from 'three';
import { VIEW_COLORS, SKETCH_BODY_DIM } from './skin.js';

const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const mix = (a, b, t) => {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
};
export const matOf = (m) => new THREE.Matrix4().set(...m); // row-major 16 numbers

export const COLORS = {
  body: 0xc4cad2,
  edge: 0x101010,
  hl: 0xff8c00,
  sel: 0x2a8cff,
  tool: 0xffd24a,
  plane: 0x8fb8e8,
  planeEdge: 0x3a6fb8,
  proposal: 0xa58cff,
};
if (VIEW_COLORS) Object.assign(COLORS, VIEW_COLORS);

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

export class Viewer {
  constructor(container, labels) {
    this.el = container;
    this.labels = labels;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, stencil: true });
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
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
    this.partGeo = new Map(); // part id -> {key, faces, edges} shared by every component of that part
    this.compGroups = new Map();

    this.displayStyle = 'shadedEdges';
    this.faceObjs = []; this.edgeObjs = [];
    this.planeObjs = new Map();
    this.clipPlane = null;
    this.hover = null;
    this.selected = new Set(); // keys "face:3" "edge:5" "plane:Front Plane"
    this.extraHighlights = new Set();
    this.planeLabels = new Map();
    this.afterRender = [];
    this.screenSized = [];

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
  setView(q, target, viewH, animate = true) {
    const q0 = this.quat.clone(), t0 = this.target.clone(), h0 = this.viewH;
    const q1 = q.clone(), t1 = target ? target.clone() : t0, h1 = viewH || h0;
    this.prevView = { quat: q0, target: t0, viewH: h0 };
    if (!animate) { this.quat.copy(q1); this.target.copy(t1); this.viewH = h1; this.requestRender(); return; }
    const start = performance.now(), dur = 380;
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      this.quat.slerpQuaternions(q0, q1, e);
      this.target.lerpVectors(t0, t1, e);
      this.viewH = h0 + (h1 - h0) * e;
      this.requestRender();
      if (t < 1) requestAnimationFrame(step);
    };
    step();
  }

  previousView() { if (this.prevView) this.setView(this.prevView.quat, this.prevView.target, this.prevView.viewH); }

  standardView(name) { this.setView(viewQuat(name), null, null); }

  normalTo(frame) {
    const q = quatFromBasis(V(frame.xdir), V(frame.ydir), V(frame.normal));
    this.setView(q, null, null);
  }

  sceneBox() {
    const box = new THREE.Box3();
    for (const g of [this.bodyGroup, this.toolGroup, this.sketchGroup, this.otherSketches, this.liveGroup]) {
      g.updateMatrixWorld(true);
      g.traverse((o) => { if ((o.isMesh || o.isLine) && o.visible && !o.userData.noFit) box.expandByObject(o); });
    }
    return box;
  }

  zoomToFit(animate = true) {
    let box = this.sceneBox();
    if (box.isEmpty()) box = new THREE.Box3(new THREE.Vector3(-50, -50, -50), new THREE.Vector3(50, 50, 50));
    const c = box.getCenter(new THREE.Vector3());
    // projected extent in view axes
    const inv = this.quat.clone().invert();
    const pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).sub(c).applyQuaternion(inv));
    const w = Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x));
    const h = Math.max(...pts.map((p) => p.y)) - Math.min(...pts.map((p) => p.y));
    const vh = Math.max(h, w * this.h / this.w, 1) * 1.25;
    this.setView(this.quat, c, vh, animate);
  }

  zoomAt(factor, x, y) {
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
    const px = this.pxSize;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.quat);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.quat);
    this.target.addScaledVector(right, -dx * px).addScaledVector(up, dy * px);
    this.requestRender();
  }

  rollBy(a) {
    const z = new THREE.Vector3(0, 0, 1).applyQuaternion(this.quat);
    this.quat.premultiply(new THREE.Quaternion().setFromAxisAngle(z, a)).normalize();
    this.requestRender();
  }

  bindMouse() {
    const c = this.canvas;
    let drag = null;
    c.addEventListener('contextmenu', (e) => e.preventDefault());
    c.addEventListener('pointerdown', (e) => {
      c.focus();
      if (e.button === 1 || (e.button === 0 && e.altKey) || (e.button === 2 && e.altKey)) {
        e.preventDefault();
        const box = this.sceneBox();
        this.pivot = box.isEmpty() ? null : box.getCenter(new THREE.Vector3());
        drag = { x: e.clientX, y: e.clientY, mode: e.ctrlKey ? 'pan' : e.shiftKey ? 'zoom' : 'rotate', zy: e.offsetY, zx: e.offsetX };
        this.lastUserNav = performance.now();
        c.setPointerCapture(e.pointerId);
      }
    });
    c.addEventListener('pointermove', (e) => {
      if (!drag) return;
      this.lastUserNav = performance.now();
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      if (drag.mode === 'rotate') this.rotateBy(dx * 0.008, dy * 0.008);
      else if (drag.mode === 'pan') this.panBy(dx, dy);
      else this.zoomAt(Math.exp(dy * 0.01), drag.zx, drag.zy);
    });
    const end = (e) => { if (drag) { drag = null; this.pivot = null; try { c.releasePointerCapture(e.pointerId); } catch (_) { /* */ } } };
    c.addEventListener('pointerup', end);
    c.addEventListener('pointercancel', end);
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.lastUserNav = performance.now();
      // SOLIDWORKS default: roll the wheel toward you to zoom in.
      const dir = this.reverseWheel ? -1 : 1;
      this.zoomAt(Math.exp(-dir * Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.0018 * (e.deltaMode ? 30 : 1)), e.offsetX, e.offsetY);
    }, { passive: false });
    this.isNavigating = () => !!drag;
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
    for (const p of list) {
      seen.add(p.id);
      let obj = this.planeObjs.get(p.id);
      const key = JSON.stringify([p.frame, p.size]);
      if (!obj || obj.userData.key !== key) {
        if (obj) this.planesGroup.remove(obj);
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
    for (const [id, obj] of this.planeObjs) if (!seen.has(id)) { this.planesGroup.remove(obj); this.planeObjs.delete(id); }
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

  clearGroup(g) {
    for (const o of [...g.children]) {
      g.remove(o);
      o.traverse((x) => { if (x.geometry && !x.geometry.userData.shared) x.geometry.dispose(); if (x.material) (Array.isArray(x.material) ? x.material : [x.material]).forEach((m) => m.dispose()); });
    }
  }

  faceMaterial(color = COLORS.body, opts = {}) {
    return new THREE.MeshStandardMaterial({
      color, metalness: 0.05, roughness: 0.5, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
      clippingPlanes: this.clipPlane ? [this.clipPlane] : [], ...opts,
    });
  }

  setBody(mesh, opts = {}) {
    this.clearGroup(this.bodyGroup);
    this.faceObjs = []; this.edgeObjs = []; this.hiddenEdgeObjs = [];
    this.bodyData = mesh;
    if (!mesh) { this.requestRender(); return; }
    const color = opts.color ?? this.bodyColor ?? COLORS.body;
    for (const f of mesh.faces) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(f.positions, 3));
      geo.setIndex(f.indices);
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, this.faceMaterial(color, opts.transparent ? { transparent: true, opacity: 0.55 } : {}));
      m.userData = { kind: 'face', id: f.id, data: f, baseColor: color };
      this.bodyGroup.add(m);
      this.faceObjs.push(m);
    }
    for (const e of mesh.edges) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(e.points, 3));
      const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: COLORS.edge, clippingPlanes: this.clipPlane ? [this.clipPlane] : [] }));
      l.userData = { kind: 'edge', id: e.id, data: e };
      l.renderOrder = 2;
      this.bodyGroup.add(l);
      this.edgeObjs.push(l);
      // hidden-line copy, shown dashed grey in "Hidden Lines Visible"
      const hl = new THREE.Line(geo, new THREE.LineDashedMaterial({ color: 0x9a9a9a, dashSize: 1, gapSize: 1, depthTest: false }));
      hl.computeLineDistances();
      hl.renderOrder = 1; hl.visible = false; hl.userData.noFit = true;
      this.bodyGroup.add(hl);
      this.hiddenEdgeObjs.push(hl);
    }
    this.applyDisplayStyle();
    this.refreshHighlights();
    if (this.clipPlane) this.rebuildCaps();
  }

  setTool(mesh, color = COLORS.tool) {
    this.clearGroup(this.toolGroup);
    if (mesh) {
      for (const f of mesh.faces) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(f.positions, 3));
        geo.setIndex(f.indices);
        geo.computeVertexNormals();
        this.toolGroup.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false, metalness: 0.1, roughness: 0.6 })));
      }
      for (const e of mesh.edges) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(e.points, 3));
        this.toolGroup.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x8a6a00 })));
      }
    }
    this.requestRender();
  }

  setDisplayStyle(s) { this.displayStyle = s; this.applyDisplayStyle(); }

  applyDisplayStyle() {
    const s = this.displayStyle;
    for (const f of this.faceObjs) {
      f.visible = s !== 'wireframe';
      const white = s === 'hlr';
      f.material.color.setHex(white ? 0xffffff : this.baseFor(f));
      f.material.emissive?.setHex(white ? 0xffffff : 0x000000);
      f.material.colorWrite = s !== 'hlv'; // depth only: hides edges behind faces
    }
    for (const e of this.edgeObjs) {
      e.visible = s !== 'shaded';
      e.material.depthTest = s !== 'wireframe';
    }
    const px = this.pxSize * 4;
    for (const e of this.hiddenEdgeObjs || []) { e.visible = s === 'hlv'; e.material.dashSize = px; e.material.gapSize = px * 0.7; }
    this.requestRender();
  }

  setSection(frame) {
    if (!frame) this.clipPlane = null;
    else {
      const n = V(frame.normal).negate();
      this.clipPlane = new THREE.Plane(n, -n.dot(V(frame.origin)));
    }
    this.sectionFrame = frame || null;
    for (const o of [...this.faceObjs, ...this.edgeObjs]) o.material.clippingPlanes = this.clipPlane ? [this.clipPlane] : [];
    this.rebuildCaps();
    this.requestRender();
  }

  // Filled section faces (stencil capping): every visible face mesh gets two stencil copies next to
  // it (so they follow component moves), then one plane is drawn where the stencil says "inside".
  rebuildCaps() {
    for (const m of this.capMeshes) { m.parent?.remove(m); m.material.dispose(); }
    this.capMeshes = [];
    this.clearGroup(this.capGroup);
    if (!this.clipPlane) return;
    const planes = [this.clipPlane];
    for (const f of this.faceObjs) {
      if (!f.visible || !f.parent) continue;
      for (const [side, op] of [[THREE.BackSide, THREE.IncrementWrapStencilOp], [THREE.FrontSide, THREE.DecrementWrapStencilOp]]) {
        const mat = new THREE.MeshBasicMaterial({ side, clippingPlanes: planes, depthWrite: false, depthTest: false, colorWrite: false,
          stencilWrite: true, stencilFunc: THREE.AlwaysStencilFunc, stencilFail: op, stencilZFail: op, stencilZPass: op });
        const m = new THREE.Mesh(f.geometry, mat);
        m.matrixAutoUpdate = false; m.matrix.copy(f.matrix);
        m.renderOrder = 5; m.userData.noFit = true; m.raycast = () => {};
        f.parent.add(m);
        this.capMeshes.push(m);
      }
    }
    const box = this.sceneBox();
    const size = box.isEmpty() ? 500 : box.getSize(new THREE.Vector3()).length() * 1.5;
    const cap = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({
      color: 0xd98c3c, metalness: 0, roughness: 0.8, side: THREE.DoubleSide,
      stencilWrite: true, stencilRef: 0, stencilFunc: THREE.NotEqualStencilFunc,
      stencilFail: THREE.ReplaceStencilOp, stencilZFail: THREE.ReplaceStencilOp, stencilZPass: THREE.ReplaceStencilOp }));
    const n = this.clipPlane.normal.clone();
    const p = n.clone().multiplyScalar(-this.clipPlane.constant);
    const c = box.isEmpty() ? p : this.clipPlane.projectPoint(box.getCenter(new THREE.Vector3()), new THREE.Vector3());
    cap.position.copy(c);
    cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    cap.renderOrder = 6; cap.userData.noFit = true; cap.raycast = () => {};
    cap.onAfterRender = (r) => r.clearStencil();
    this.capGroup.add(cap);
  }

  // ------------------------------------------------------------------ picking
  pick(x, y, filter = {}) {
    const rc = this.rayAt(x, y);
    const px = this.pxSize;
    const want = { faces: true, edges: true, planes: false, ...filter };
    if (want.edges) {
      rc.params.Line.threshold = px * 5;
      const hits = rc.intersectObjects(this.edgeObjs.filter((o) => o.visible), false);
      if (hits.length) {
        // prefer an edge that is not hidden behind a face
        const faceHit = this.faceObjs.length ? rc.intersectObjects(this.faceObjs.filter((o) => o.visible), false)[0] : null;
        const h = hits.find((hh) => !faceHit || this.displayStyle === 'wireframe' || hh.distance <= faceHit.distance + px * 3);
        if (h) return { kind: 'edge', id: h.object.userData.id, data: h.object.userData.data, point: h.point };
      }
    }
    if (want.faces) {
      const hits = rc.intersectObjects(this.faceObjs.filter((o) => o.visible), false);
      if (hits.length) {
        const h = this.clipPlane ? hits.find((hh) => this.clipPlane.distanceToPoint(hh.point) >= 0) : hits[0];
        if (h) return { kind: 'face', id: h.object.userData.id, data: h.object.userData.data, point: h.point };
      }
    }
    if (want.planes) {
      const objs = [...this.planeObjs.values()].filter((o) => o.visible).map((o) => o.userData.mesh);
      const hits = rc.intersectObjects(objs, false);
      if (hits.length) return { kind: 'plane', id: hits[0].object.userData.id, point: hits[0].point };
    }
    return null;
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

  setSelectedKeys(keys) { this.selected = new Set(keys); this.refreshHighlights(); }

  refreshHighlights() {
    const style = this.displayStyle;
    for (const f of this.faceObjs) {
      const k = 'face:' + f.userData.id;
      const ck = f.userData.comp ? 'comp:' + f.userData.comp : null;
      const base = style === 'hlr' ? 0xffffff : this.baseFor(f);
      const c = this.selected.has(k) ? mix(base, COLORS.sel, 0.6) : this.hoverKey === k ? mix(base, COLORS.hl, 0.45) : this.extraHighlights.has(k) ? 0xc8d8ff
        : ck && this.selected.has(ck) ? mix(base, COLORS.sel, 0.45) : ck && this.hoverKey === ck ? mix(base, COLORS.hl, 0.35) : base;
      f.material.color.setHex(c);
    }
    for (const e of this.edgeObjs) {
      const k = 'edge:' + e.userData.id;
      const c = this.selected.has(k) ? COLORS.sel : this.hoverKey === k ? COLORS.hl : COLORS.edge;
      e.material.color.setHex(c);
      e.renderOrder = c === COLORS.edge ? 2 : 3;
      e.material.depthTest = c === COLORS.edge && style !== 'wireframe';
    }
    this.requestRender();
  }

  // ------------------------------------------------------------------ assemblies
  // Geometry of a part, built once and shared by every component that uses it.
  partGeometry(pid, key, body) {
    const hit = this.partGeo.get(pid);
    if (hit && hit.key === key) return hit;
    if (!body) return hit || null;
    const faces = body.faces.map((f) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(f.positions, 3));
      geo.setIndex(f.indices);
      geo.computeVertexNormals();
      geo.userData.shared = true;
      return { geo, data: f };
    });
    const edges = body.edges.map((e) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(e.points, 3));
      geo.userData.shared = true;
      return { geo, data: e };
    });
    const pg = { key, faces, edges, body };
    this.partGeo.set(pid, pg);
    return pg;
  }

  // One group per component (matrix = component placement). Faces carry ids "c2/5" so picking,
  // highlighting and display styles work as for a part.
  componentGroup(pg, opts) {
    const g = new THREE.Group();
    g.matrixAutoUpdate = false;
    const faces = [], edges = [];
    for (const f of pg.faces) {
      const m = new THREE.Mesh(f.geo, this.faceMaterial(opts.color, opts.opacity < 1 ? { transparent: true, opacity: opts.opacity, depthWrite: opts.opacity > 0.6 } : {}));
      m.userData = { kind: 'face', id: `${opts.id}/${f.data.id}`, comp: opts.id, data: f.data, baseColor: opts.color };
      g.add(m); faces.push(m);
    }
    for (const e of pg.edges) {
      const l = new THREE.Line(e.geo, new THREE.LineBasicMaterial({ color: COLORS.edge, transparent: opts.opacity < 1, opacity: Math.min(1, opts.opacity + 0.2) }));
      l.userData = { kind: 'edge', id: `${opts.id}/${e.data.id}`, comp: opts.id, data: e.data };
      l.renderOrder = 2;
      g.add(l); edges.push(l);
    }
    g.userData = { comp: opts.id, faces, edges };
    return g;
  }

  // comps: [{id, part, key, matrix, color, hidden, opacity}], bodies: {part id: mesh or undefined}
  setAssembly(comps, bodies = {}) {
    this.clearGroup(this.bodyGroup);
    this.faceObjs = []; this.edgeObjs = []; this.hiddenEdgeObjs = [];
    this.bodyData = null;
    this.compGroups = new Map();
    for (const c of comps) {
      const pg = this.partGeometry(c.part, c.key, bodies[c.part]);
      if (!pg || c.hidden) continue;
      const g = this.componentGroup(pg, { id: c.id, color: c.color ?? COLORS.body, opacity: c.opacity ?? 1 });
      g.matrix.copy(matOf(c.matrix));
      g.matrixWorldNeedsUpdate = true;
      this.bodyGroup.add(g);
      this.compGroups.set(c.id, g);
      this.faceObjs.push(...g.userData.faces);
      this.edgeObjs.push(...g.userData.edges);
    }
    for (const o of [...this.faceObjs, ...this.edgeObjs]) o.material.clippingPlanes = this.clipPlane ? [this.clipPlane] : [];
    this.applyDisplayStyle();
    this.refreshHighlights();
    this.bodyGroup.updateMatrixWorld(true);
    if (this.clipPlane) this.rebuildCaps();
  }

  // Tween groups to new matrices. items: [{group, to: Matrix4, via?: Matrix4, from?: Matrix4}]
  tweenGroups(items, dur = 700) {
    const parts = items.map((it) => {
      const keys = [it.from || it.group.matrix.clone(), ...(it.via ? [it.via] : []), it.to].map((m) => {
        const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
        m.decompose(p, q, s);
        return { p, q, s };
      });
      return { g: it.group, keys };
    });
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    return new Promise((resolve) => {
      const t0 = performance.now();
      const p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
      const frame = () => {
        const u = dur <= 0 ? 1 : Math.min(1, (performance.now() - t0) / dur);
        for (const { g, keys } of parts) {
          const segs = keys.length - 1;
          const x = ease(u) * segs, i = Math.min(segs - 1, Math.floor(x)), f = x - i;
          const a = keys[i], b = keys[i + 1];
          p.lerpVectors(a.p, b.p, f); q.slerpQuaternions(a.q, b.q, f); s.lerpVectors(a.s, b.s, f);
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
    const c = box.getCenter(new THREE.Vector3());
    const inv = this.quat.clone().invert();
    const pts = [];
    for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) pts.push(new THREE.Vector3(x, y, z).sub(c).applyQuaternion(inv));
    const w = Math.max(...pts.map((pp) => pp.x)) - Math.min(...pts.map((pp) => pp.x));
    const h = Math.max(...pts.map((pp) => pp.y)) - Math.min(...pts.map((pp) => pp.y));
    const vh = Math.max(h, w * this.h / this.w, 1) * 1.3;
    this.setView(this.quat, c, vh, animate);
  }
}
