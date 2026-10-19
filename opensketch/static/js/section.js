// Section View, as SOLIDWORKS: a reference plane (Front / Top / Right or a planar face), an offset
// distance and two rotation angles, a filled cut face, and an arrow in the graphics area you drag
// to slide the section through the model. Works in parts and assemblies.

import * as THREE from 'three';
import { STD_FRAMES } from './viewer.js';

const STD = ['Front Plane', 'Top Plane', 'Right Plane'];
const V = (a) => new THREE.Vector3(a[0], a[1], a[2]);

export class SectionView {
  constructor(app) {
    this.app = app;
    this.s = { plane: 'Front Plane', face: null, offset: 0, rx: 0, ry: 0, flip: false, showPlane: true };
    this.handle = null;
    this.bindDrag();
  }

  get viewer() { return this.app.viewer; }
  get active() { return !!this.viewer.clipPlane; }

  // Base frame of the reference: a standard plane through the origin, or a picked face.
  baseFrame() {
    if (this.s.face) return this.s.face;
    return STD_FRAMES[this.s.plane];
  }

  frame() {
    const b = this.baseFrame();
    const x = V(b.xdir), y = V(b.ydir);
    let n = V(b.normal);
    const q = new THREE.Quaternion().setFromAxisAngle(x, THREE.MathUtils.degToRad(this.s.rx))
      .multiply(new THREE.Quaternion().setFromAxisAngle(y, THREE.MathUtils.degToRad(this.s.ry)));
    n = n.applyQuaternion(q).normalize();
    if (this.s.flip) n.negate();
    const o = V(b.origin).addScaledVector(V(b.normal).applyQuaternion(q).normalize(), this.s.offset);
    return { origin: o.toArray(), normal: n.toArray() };
  }

  // The viewer moves its one clipping plane in place, and the arrow moves with it: a slider step costs no new
  // objects. The ribbon (Section View shown pressed) is redrawn only when the section turns on or off.
  apply() {
    const f = this.frame();
    const was = this.active;
    this.viewer.setSection(f);
    if (this.handle && this.app.cmd?.key === 'section') this.moveHandle(f); else this.drawHandle(f);
    if (!was) this.app.ribbon.render();
  }

  // Offset span that cuts the model: the scene box's corners measured along the offset direction from the base.
  range() {
    const b = this.viewer.sceneBox();
    if (b.isEmpty()) return [-200, 200];
    const n = V(this.baseNormalWithRotation()), o = V(this.baseFrame().origin);
    const d = [];
    for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) d.push(new THREE.Vector3(x, y, z).sub(o).dot(n));
    const lo = Math.min(...d), hi = Math.max(...d), pad = Math.max((hi - lo) * 0.02, 0.5);
    return [lo - pad, hi + pad];
  }

  // Slider and number field follow a drag of the arrow without redrawing the PropertyManager.
  showOffset() {
    const root = this.app.pm.root;
    const num = root?.querySelector('input[type=text][aria-label="Offset Distance"]');
    if (num) num.value = (+this.s.offset).toFixed(2) + 'mm';
    const r = root?.querySelector('.sec-slider');
    if (r) r.value = this.s.offset;
  }

  toggle() {
    if (this.active && !this.app.cmd) { this.off(); return; }
    this.open();
  }

  off() {
    this.viewer.setSection(null);
    this.clearHandle();
    this.app.ribbon.render();
  }

  open() {
    const app = this.app;
    if (app.cmd) app.pmCancel();
    const s = this.s;
    app.cmd = {
      key: 'section', wantsPlanes: true,
      onPick: (p) => {
        if (p.kind === 'plane' && STD.includes(p.id)) { s.plane = p.id; s.face = null; this.apply(); return true; }
        if (p.kind === 'face' && p.data?.normal) {
          const g = p.object || null;
          void g;
          // faces of components carry part coordinates: use the picked world point and the face normal in world space
          const n = this.worldNormal(p);
          const ref = Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
          const x = ref.clone().cross(n).normalize(), y = n.clone().cross(x);
          s.face = { origin: p.point.toArray(), normal: n.toArray(), xdir: x.toArray(), ydir: y.toArray() };
          s.offset = 0; this.apply(); return true;
        }
        return 'handled';
      },
      onOk: () => { this.clearHandle(); app.ribbon.render(); return undefined; },
      onCancel: () => { this.off(); },
    };
    app.pm.open({ title: 'Section View', icon: 'sectionview', okEnabled: () => true, onChange: () => this.apply(),
      message: 'Drag the arrow in the graphics area to move the section. Pick a planar face to section from it.',
      sections: [
        { title: 'Section 1', rows: [
          { type: 'select', options: [...STD.map((p) => [p, p]), ...(s.face ? [['face', 'Selected face']] : [])], get: () => (s.face ? 'face' : s.plane), set: (v) => { if (v !== 'face') { s.plane = v; s.face = null; } } },
          { type: 'custom', render: (row) => {
            const r = document.createElement('input'); r.type = 'range'; r.className = 'grow sec-slider';
            r.setAttribute('aria-label', 'Offset slider');
            const [lo, hi] = this.range();
            r.min = Math.min(lo, s.offset); r.max = Math.max(hi, s.offset); r.step = (hi - lo) / 400; r.value = s.offset;
            r.oninput = () => { s.offset = +r.value; this.apply(); this.showOffset(); };
            row.appendChild(r);
          } },
          { type: 'number', icon: 'depth', tip: 'Offset Distance', get: () => s.offset, set: (v) => { s.offset = v; }, step: 1 },
          { type: 'number', label: 'X Rotation', unit: 'deg', get: () => s.rx, set: (v) => { s.rx = v; }, min: -180, max: 180, step: 5 },
          { type: 'number', label: 'Y Rotation', unit: 'deg', get: () => s.ry, set: (v) => { s.ry = v; }, min: -180, max: 180, step: 5 },
          { type: 'check', label: 'Flip side to view', get: () => s.flip, set: (v) => { s.flip = v; } },
        ] },
      ] });
    this.apply();
  }

  worldNormal(p) {
    const n = V(p.data.normal);
    const obj = p.object; // the drawn body or component the face belongs to
    if (obj) { obj.updateMatrixWorld(true); n.applyMatrix3(new THREE.Matrix3().getNormalMatrix(obj.matrixWorld)).normalize(); }
    return n;
  }

  // ------------------------------------------------------------------ graphics handle
  clearHandle() {
    if (this.handle) { this.viewer.overlayGroup.remove(this.handle); this.handle.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); }); }
    this.handle = null;
    this.viewer.requestRender();
  }

  drawHandle(f) {
    this.clearHandle();
    if (!this.app.cmd || this.app.cmd.key !== 'section') return;
    const v = this.viewer;
    const box = v.sceneBox();
    const size = box.isEmpty() ? 100 : box.getSize(new THREE.Vector3()).length();
    const g = new THREE.Group();
    const L = size * 0.18;
    const mat = new THREE.MeshBasicMaterial({ color: 0x1f6fe0, depthTest: false });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(L * 0.025, L * 0.025, L, 12), mat);
    shaft.position.y = L / 2;
    const head = new THREE.Mesh(new THREE.ConeGeometry(L * 0.09, L * 0.28, 20), mat);
    head.position.y = L;
    // plane outline
    const s = size * 0.55;
    const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-s, 0, -s), new THREE.Vector3(s, 0, -s), new THREE.Vector3(s, 0, s), new THREE.Vector3(-s, 0, s)]),
      new THREE.LineBasicMaterial({ color: 0x1f6fe0, transparent: true, opacity: 0.6, depthTest: false }));
    g.add(shaft, head, ring);
    for (const m of [shaft, head]) { m.userData.sectionHandle = true; m.renderOrder = 30; }
    ring.renderOrder = 30;
    g.traverse((o) => { o.userData.noFit = true; });
    this.handle = g;
    v.overlayGroup.add(g);
    this.moveHandle(f);
  }

  moveHandle(f) {
    const v = this.viewer, g = this.handle;
    if (!g) return;
    const box = v.sceneBox();
    const n = V(f.normal).negate(); // arrow points to the side that is kept, like SOLIDWORKS
    const o = V(f.origin);
    const c = box.isEmpty() ? o : new THREE.Plane(V(f.normal), -V(f.normal).dot(o)).projectPoint(box.getCenter(new THREE.Vector3()), new THREE.Vector3());
    g.position.copy(c);
    g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    v.requestRender();
  }

  bindDrag() {
    const v = this.viewer;
    const c = v.canvas;
    c.addEventListener('pointerdown', (e) => {
      if (!this.handle || e.button !== 0 || e.altKey) return;
      const rc = v.rayAt(e.offsetX, e.offsetY);
      const hits = rc.intersectObjects(this.handle.children.filter((o) => o.userData.sectionHandle), false);
      if (!hits.length) return;
      e.stopImmediatePropagation(); e.preventDefault();
      c.setPointerCapture(e.pointerId);
      const f = this.frame();
      const o = V(f.origin), n = V(this.baseNormalWithRotation());
      const a = v.worldToScreen(o), b = v.worldToScreen(o.clone().add(n));
      const dir = { x: b.x - a.x, y: b.y - a.y };
      const len2 = dir.x * dir.x + dir.y * dir.y || 1;
      const start = { x: e.offsetX, y: e.offsetY, off: this.s.offset };
      const mv = (ev) => {
        const dx = ev.offsetX - start.x, dy = ev.offsetY - start.y;
        this.s.offset = +(start.off + (dx * dir.x + dy * dir.y) / len2).toFixed(3);
        this.apply();
        this.showOffset();
      };
      // a cancelled touch or pen gesture ends the drag too (no sliding on hover afterwards)
      const up = () => { for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) c.removeEventListener(t, up, true); c.removeEventListener('pointermove', mv, true); };
      c.addEventListener('pointermove', mv, true);
      for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) c.addEventListener(t, up, true);
    }, true);
  }

  // offset direction (base normal turned by the rotations, not flipped)
  baseNormalWithRotation() {
    const b = this.baseFrame();
    const q = new THREE.Quaternion().setFromAxisAngle(V(b.xdir), THREE.MathUtils.degToRad(this.s.rx))
      .multiply(new THREE.Quaternion().setFromAxisAngle(V(b.ydir), THREE.MathUtils.degToRad(this.s.ry)));
    return V(b.normal).applyQuaternion(q).normalize().toArray();
  }
}
