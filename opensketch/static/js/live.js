// Live build view: plays the AI's work in the graphics area while it streams in.
//
// Parts are built on a "shelf" beside the assembly, feature by feature: the sketch is drawn in
// blue, then the new material grows out of the sketch plane. When the AI inserts a component it
// flies from the shelf to its place; when it adds a mate, the components slide to where the
// solver puts them. Events are queued and paced so each step is visible even when the stream is
// fast, and played quicker when a backlog builds up.

import * as THREE from 'three';
import { COLORS, matOf } from './viewer.js';
import { drawInactiveSketch } from './sketch/draw.js';
import { hexColor } from './asm.js';

const PALETTE = ['#8a96a3', '#c4cad2', '#5d7fa8', '#b87333', '#3c4650', '#c8a050', '#6f9a6a', '#a86f6f'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function meshGroup(mesh, color, opacity = 1) {
  const g = new THREE.Group();
  for (const f of mesh.faces) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(f.positions, 3));
    geo.setIndex(f.indices);
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, metalness: 0.05, roughness: 0.5, side: THREE.DoubleSide,
      transparent: opacity < 1, opacity, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }));
    g.add(m);
  }
  for (const e of mesh.edges) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(e.points, 3));
    const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: COLORS.edge, transparent: opacity < 1, opacity: Math.min(1, opacity + 0.2) }));
    l.renderOrder = 2;
    g.add(l);
  }
  return g;
}

function setOpacity(g, o) {
  g.traverse((x) => {
    if (!x.material) return;
    for (const m of Array.isArray(x.material) ? x.material : [x.material]) {
      m.transparent = o < 1; m.opacity = o; m.depthWrite = o > 0.6; m.needsUpdate = true;
    }
  });
}

function setClip(g, planes) {
  g.traverse((x) => { if (x.material) x.material.clippingPlanes = planes; });
}

function setEmissive(g, hex) {
  g.traverse((x) => { if (x.material?.emissive) x.material.emissive.setHex(hex); });
}

export class LivePlayer {
  constructor(app) {
    this.app = app;
    this.active = false;
    this.queue = [];
    this.cap = document.getElementById('livecap');
  }

  get viewer() { return this.app.viewer; }

  // ------------------------------------------------------------------ session
  start() {
    const v = this.viewer;
    this.stop(true);
    this.active = true;
    this.queue = [];
    this.pumping = null;
    this.items = new Map();      // live index -> {group, pid, name, color, bbox, slot}
    this.shelf = [];             // finished parts waiting beside the assembly, in build order
    this.byPart = new Map();     // part id -> shelf item
    this.comps = new Map();      // component id -> group
    this.compPart = new Map();
    this.sizeHint = 100;
    this.doc = null;
    v.liveGroup.visible = true;
    // start from what is on screen now
    const app = this.app;
    if (app.isAsm && app.asm.res) {
      for (const c of app.asm.res.components) {
        const g0 = v.compGroups.get(c.id);
        if (!g0) continue;
        const pg = v.partGeo.get(c.part);
        if (!pg) continue;
        const g = this.compGroup(c.part, pg, app.asm.doc.parts?.[c.part]?.appearance);
        g.matrix.copy(g0.matrix);
        v.liveGroup.add(g);
        this.comps.set(c.id, g);
        this.compPart.set(c.id, c.part);
      }
      v.bodyGroup.visible = false;
    } else if (!app.isAsm && app.result?.body?.faces?.length) {
      // a part: keep it visible until the first live frame replaces it
      this.partBase = true;
    } else v.bodyGroup.visible = false;
    v.otherSketches.visible = false;
    this.caption('Thinking...');
    v.requestRender();
  }

  stop(silent = false) {
    const v = this.viewer;
    this.active = false;
    this.queue = [];
    this.epoch = (this.epoch || 0) + 1;
    v.clearGroup(v.liveGroup);
    v.bodyGroup.visible = true;
    v.otherSketches.visible = true;
    this.caption(null);
    if (!silent) v.requestRender();
  }

  caption(text, sub = '') {
    if (!this.cap) return;
    if (!text) { this.cap.classList.add('hidden'); return; }
    // names come from the AI (or a page it read): text only, never HTML
    this.cap.innerHTML = '<span class="spinner"></span><b></b><span class="sub"></span>';
    this.cap.querySelector('b').textContent = text;
    const s = this.cap.querySelector('.sub');
    if (sub) s.textContent = sub; else s.remove();
    this.cap.classList.remove('hidden');
  }

  // Events that change the picture go through the queue; text goes straight to the chat.
  push(ev) {
    if (!this.active) return;
    this.queue.push(ev);
    if (!this.pumping) this.pumping = this.pump();
  }

  async pump() {
    const epoch = this.epoch;
    while (this.queue.length && this.active && epoch === this.epoch) {
      const ev = this.queue.shift();
      try { await this.play(ev); } catch (err) { console.warn('live step', err); }
    }
    this.pumping = null;
  }

  speed() { const n = this.queue.length; return n > 12 ? 0.25 : n > 6 ? 0.45 : n > 2 ? 0.7 : 1; }

  // Wait until everything queued has been played.
  async finish() {
    while (this.pumping) await this.pumping;
    if (this.active) await sleep(350);
  }

  // Chat-side progress shows in the caption only while the picture has nothing else to play.
  hint(text, sub) { if (this.active && !this.pumping && !this.queue.length) this.caption(text, sub); }

  // ------------------------------------------------------------------ playback
  async play(ev) {
    switch (ev.ev) {
      case 'build_start': return this.buildStart(ev);
      case 'build_step': return this.buildStep(ev);
      case 'assembly': return this.assembly(ev);
      case 'interference': return this.interference(ev);
      default: return null;
    }
  }

  item(ev) {
    let it = this.items.get(ev.key);
    if (!it) {
      const mode = ev.mode || (ev.tool === 'propose_features' || (!ev.tool && !this.asmMode) ? 'part' : 'asm');
      // a new attempt at the same part replaces the earlier one
      for (const [k, o] of this.items) {
        if ((mode === 'part' && o.mode === 'part') || (mode === 'asm' && ev.part && o.pid === ev.part)) {
          this.viewer.liveGroup.remove(o.group);
          this.items.delete(k);
          this.shelf = this.shelf.filter((x) => x !== o);
        }
      }
      it = { key: ev.key, mode, group: new THREE.Group(), body: null, sketch: new THREE.Group(), pid: ev.part, name: ev.name, frame: null };
      it.group.add(it.sketch);
      it.color = mode === 'part' ? COLORS.proposal : hexColor(ev.appearance, hexColor(PALETTE[this.items.size % PALETTE.length]));
      this.items.set(ev.key, it);
      this.viewer.liveGroup.add(it.group);
      if (mode === 'asm') { this.asmMode = true; this.shelf.push(it); this.layoutShelf(false); }
    }
    return it;
  }

  async buildStart(ev) {
    const it = this.item(ev);
    it.pid = ev.part || it.pid;
    it.name = ev.name || it.name;
    if (it.pid) this.byPart.set(it.pid, it);
    if (it.mode === 'part' && this.partBase) { this.viewer.bodyGroup.visible = false; this.partBase = false; }
    this.caption(it.mode === 'asm' ? `Building ${it.name || 'part'}` : 'Building features');
    await sleep(150 * this.speed());
  }

  async buildStep(ev) {
    const v = this.viewer;
    const it = this.item(ev);
    if (it.mode === 'part' && this.partBase) { v.bodyGroup.visible = false; this.partBase = false; }
    const f = ev.feature || {};
    const sub = `${f.name || f.type}${ev.state === 'error' ? ' (error: ' + (ev.message || '') + ')' : ''}`;
    this.caption(it.mode === 'asm' ? `Building ${it.name || 'part'}` : 'Building features', sub);
    const sp = this.speed();
    if (ev.sketch && ev.frame) {
      v.clearGroup(it.sketch);
      drawInactiveSketch(it.sketch, ev.sketch, v.frameMatrix(ev.frame), v.pxSize * 1.2, 0x1a5fe0);
      it.frame = ev.frame;
      this.follow(it);
      await sleep(520 * sp);
      return;
    }
    if (!ev.body) { await sleep(200 * sp); return; }
    const color = it.mode === 'asm' ? it.color : COLORS.proposal;
    const g = meshGroup(ev.body, color);
    it.group.add(g);
    it.bbox = ev.bbox || it.bbox;
    if (it.mode === 'asm') this.layoutShelf(false);
    // grow the new material out of the sketch plane
    const old = it.body;
    it.body = g;
    if (it.frame && ['extrude', 'revolve'].includes(f.type)) {
      const n = new THREE.Vector3(...it.frame.normal).normalize();
      const o = new THREE.Vector3(...it.frame.origin).applyMatrix4(it.group.matrix);
      const box = new THREE.Box3().setFromObject(g);
      let ext = 0;
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) ext = Math.max(ext, Math.abs(new THREE.Vector3(x, y, z).sub(o).dot(n)));
      const p1 = new THREE.Plane(n.clone().negate(), 0), p2 = new THREE.Plane(n.clone(), 0);
      setClip(g, [p1, p2]);
      const dur = 650 * sp, t0 = performance.now();
      await new Promise((resolve) => {
        const step = () => {
          const u = Math.min(1, (performance.now() - t0) / dur);
          const t = ext * (1 - Math.pow(1 - u, 2)) + 1e-3;
          p1.constant = n.dot(o) + t; p2.constant = -n.dot(o) + t;
          v.requestRender();
          if (u < 1 && this.active) requestAnimationFrame(step); else resolve();
        };
        step();
      });
      setClip(g, []);
    } else {
      setOpacity(g, 0.3);
      for (let k = 1; k <= 6; k++) { setOpacity(g, 0.3 + 0.7 * k / 6); v.requestRender(); await sleep(45 * sp); }
    }
    if (old) { it.group.remove(old); old.traverse((x) => { x.geometry?.dispose(); x.material?.dispose?.(); }); }
    if (['extrude', 'revolve'].includes(f.type)) v.clearGroup(it.sketch);
    this.follow(it);
    v.requestRender();
    await sleep(180 * sp);
  }

  // Shelf: parts wait in a row to the right of the assembly, standing on their own Y.
  layoutShelf(animate = true) {
    const asmBox = new THREE.Box3();
    for (const g of this.comps.values()) asmBox.expandByObject(g);
    let size = 60;
    for (const it of this.shelf) if (it.bbox) size = Math.max(size, ...it.bbox[1].map((x, i) => x - it.bbox[0][i]));
    this.sizeHint = size;
    const gap = size * 0.25 + 20;
    let cursor = asmBox.isEmpty() ? 0 : asmBox.max.x + gap * 1.5;
    const moves = [];
    for (const it of this.shelf) {
      const bb = it.bbox || [[-20, 0, -20], [20, 40, 20]];
      const tx = (asmBox.isEmpty() && it === this.shelf[0] ? 0 : cursor - bb[0][0]);
      const tz = asmBox.isEmpty() && it === this.shelf[0] ? 0 : -(bb[0][2] + bb[1][2]) / 2;
      const to = new THREE.Matrix4().makeTranslation(tx, 0, tz);
      cursor = tx + bb[1][0] + gap;
      if (!it.slot || !it.slot.equals(to)) {
        it.slot = to;
        if (animate && it.group.matrixAutoUpdate === false) moves.push({ group: it.group, to });
        else { it.group.matrixAutoUpdate = false; it.group.matrix.copy(to); it.group.matrixWorldNeedsUpdate = true; }
      }
    }
    if (moves.length) return this.viewer.tweenGroups(moves, 450 * this.speed());
    return null;
  }

  follow(it) {
    const v = this.viewer;
    const box = new THREE.Box3().setFromObject(v.liveGroup);
    if (box.isEmpty()) return;
    const last = this.fitBox;
    if (last && last.containsBox(box) && last.getSize(new THREE.Vector3()).length() < box.getSize(new THREE.Vector3()).length() * 2.2) return;
    const grown = box.clone().expandByScalar(box.getSize(new THREE.Vector3()).length() * 0.12);
    this.fitBox = grown;
    v.followBox(grown);
    void it;
  }

  compGroup(pid, pg, appearance) {
    const color = hexColor(appearance, COLORS.body);
    const g = this.viewer.componentGroup(pg, { id: 'live', color, opacity: 1 });
    g.matrixAutoUpdate = false;
    return g;
  }

  async assembly(ev) {
    const v = this.viewer;
    const res = ev.result, doc = ev.doc;
    this.doc = doc;
    const sp = this.speed();
    for (const [pid, p] of Object.entries(res.parts)) if (p.body) v.partGeometry(pid, p.key, p.body);
    const act = ev.action || {};
    const names = Object.fromEntries(doc.components.map((c) => [c.id, c.name]));
    const moves = [];
    let inserted = null;
    for (const c of res.components) {
      const dc = doc.components.find((x) => x.id === c.id);
      if (!dc || dc.suppressed || dc.hidden) continue;
      const to = matOf(c.matrix);
      let g = this.comps.get(c.id);
      const pg = v.partGeo.get(c.part);
      if (!pg) continue;
      if (g && this.compPart.get(c.id) === c.part && g.userData.key !== pg.key) { v.liveGroup.remove(g); g = null; }
      if (!g) {
        g = this.compGroup(c.part, pg, doc.parts?.[c.part]?.appearance);
        g.userData.key = pg.key;
        this.comps.set(c.id, g);
        this.compPart.set(c.id, c.part);
        v.liveGroup.add(g);
        const shelfIt = this.byPart.get(c.part);
        const from = shelfIt?.group.matrix.clone() || to.clone().premultiply(new THREE.Matrix4().makeTranslation(0, this.sizeHint, 0));
        const up = Math.max(this.sizeHint * 0.35, 30);
        const via = to.clone().premultiply(new THREE.Matrix4().makeTranslation(0, up, 0));
        g.matrix.copy(from);
        inserted = { group: g, from, via, to, id: c.id };
        if (shelfIt) setOpacity(shelfIt.group, 0.28);
        continue;
      }
      if (!g.matrix.equals(to)) moves.push({ group: g, to, id: c.id });
    }
    for (const [id, g] of this.comps) if (!res.components.some((c) => c.id === id)) { v.liveGroup.remove(g); this.comps.delete(id); }
    if (act.kind === 'insert' && inserted) {
      this.caption(`Inserting ${names[inserted.id] || inserted.id}`);
      setEmissive(inserted.group, 0x1d3f7a);
      await v.tweenGroups([{ group: inserted.group, from: inserted.from, via: inserted.via, to: inserted.to }, ...moves], 1000 * sp);
      setEmissive(inserted.group, 0);
      await this.layoutShelf(true);
    } else if (act.kind === 'mate') {
      const m = doc.mates.find((x) => x.id === act.mate);
      const st = res.mates.find((x) => x.id === act.mate);
      const who = (m?.refs || []).map((r) => names[r.component] || r.ref).filter(Boolean).join(' to ');
      this.caption(`${m?.name || 'Mate'}${st?.state === 'error' ? ' (cannot be satisfied)' : ''}`, who);
      const involved = new Set((m?.refs || []).map((r) => r.component));
      for (const id of involved) { const g = this.comps.get(id); if (g) setEmissive(g, st?.state === 'error' ? 0x7a1d1d : 0x1d5a2a); }
      if (moves.length) await v.tweenGroups(moves, 750 * sp); else await sleep(380 * sp);
      for (const id of involved) { const g = this.comps.get(id); if (g) setEmissive(g, 0); }
    } else {
      if (inserted) moves.push(inserted);
      if (moves.length) await v.tweenGroups(moves, 600 * sp);
    }
    this.follow();
    v.requestRender();
    await sleep(120 * sp);
  }

  async interference(ev) {
    const v = this.viewer;
    if (!ev.items?.length) { this.caption('No interferences'); await sleep(700 * this.speed()); return; }
    this.caption(`${ev.items.length} interference${ev.items.length > 1 ? 's' : ''} found`);
    const g = new THREE.Group();
    for (const it of ev.items) g.add(meshGroup(it.mesh, 0xff2a2a));
    v.liveGroup.add(g);
    v.requestRender();
    await sleep(1400 * this.speed());
    v.liveGroup.remove(g);
  }

  // Assembly done: the shelf goes away.
  clearShelf() {
    for (const it of this.shelf) this.viewer.liveGroup.remove(it.group);
    this.shelf = [];
  }
}
