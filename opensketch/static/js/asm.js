// Assembly mode: components, mates, Move Component, Interference Detection, Open Part and the
// assembly playback (Motion Study). The document format is in docs/DOCUMENT.md ("Assembly document").

import * as THREE from 'three';
import { COLORS, matOf } from './viewer.js';
import { dialog, message, contextMenu } from './ui/dialogs.js';
import { fmt } from './sketch/geom2d.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
const esc = (s) => String(s ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

export const MATE_TYPES = [
  ['coincident', 'Coincident', 'r_coincident'],
  ['parallel', 'Parallel', 'r_parallel'],
  ['perpendicular', 'Perpendicular', 'r_perpendicular'],
  ['concentric', 'Concentric', 'r_concentric'],
  ['lock', 'Lock', 'm_lock'],
  ['distance', 'Distance', 'm_distance'],
  ['angle', 'Angle', 'm_angle'],
];
export const mateIcon = (t) => (MATE_TYPES.find((m) => m[0] === t) || [0, 0, 'mate'])[2];
const mateLabel = (t) => (MATE_TYPES.find((m) => m[0] === t) || [0, t])[1];

export function newAssembly(name = 'Assem1') {
  return { version: 1, type: 'assembly', name, units: 'mm', parts: {}, components: [], mates: [], sequence: [], seq: 1 };
}

export const isAssembly = (d) => d && d.type === 'assembly';

export function hexColor(hex, fallback = COLORS.body) {
  return typeof hex === 'string' && /^#[0-9a-f]{6}$/i.test(hex) ? parseInt(hex.slice(1), 16) : fallback;
}

function tint(c, t = 0.45) { return new THREE.Color(c).lerp(new THREE.Color(COLORS.proposal), t).getHex(); }

export class AssemblyMode {
  constructor(app) {
    this.app = app;
    this.res = null;
    this.drag = null;
    this.expandedComps = new Set();
    this.matesOpen = true;
  }

  get doc() { return this.app.shownDoc; }
  comp(id) { return this.doc.components.find((c) => c.id === id) || null; }
  mate(id) { return this.doc.mates.find((m) => m.id === id) || null; }
  partName(pid) { return this.doc.parts?.[pid]?.name || pid; }
  resComp(id) { return this.res?.components?.find((c) => c.id === id) || null; }

  uid(prefix) {
    const d = this.app.doc;
    const used = new Set([...d.components.map((c) => c.id), ...d.mates.map((m) => m.id), ...Object.keys(d.parts)]);
    let id;
    d.seq = d.seq || 1;
    do { id = prefix + d.seq++; } while (used.has(id));
    return id;
  }

  knownKeys() {
    const out = {};
    for (const [pid, pg] of this.app.viewer.partGeo) out[pid] = pg.key;
    return out;
  }

  // ------------------------------------------------------------------ rebuild
  async regen(announce = false, docOverride = null) {
    const app = this.app;
    const seq = ++app.regenSeq;
    const doc = app.cleanDoc(docOverride || app.shownDoc);
    let res;
    try { res = await app.api('/api/regen', { doc, known: this.knownKeys() }); } catch (err) { app.toast('Rebuild failed: ' + err.message); return null; }
    if (seq !== app.regenSeq) return null;
    // a mesh we thought we had is gone (cache replaced): ask again without the shortcut
    if (res.components.some((c) => !app.viewer.partGeo.get(c.part) && !res.parts[c.part]?.body && res.parts[c.part])) {
      for (const pid of Object.keys(res.parts)) app.viewer.partGeo.delete(pid);
      return this.regen(announce, docOverride);
    }
    if (docOverride) { this.draw(res, docOverride); return res; }
    this.apply(res);
    if (announce) app.status('Rebuild complete');
    return res;
  }

  apply(res) {
    const app = this.app;
    this.res = res;
    app.result = res;
    app.statusById = Object.fromEntries([...res.components, ...res.mates].map((s) => [s.id, s]));
    // the solver's placement is part of the document (like SOLIDWORKS saving component positions)
    const target = app.proposal || app.doc;
    if (isAssembly(target)) {
      for (const c of res.components) {
        const dc = target.components.find((x) => x.id === c.id);
        if (dc && !dc.suppressed) { dc.position = c.position; dc.rotation = c.rotation; }
      }
      for (const [mid, up] of Object.entries(res.updates || {})) {
        const m = target.mates.find((x) => x.id === mid);
        if (m) Object.assign(m, up);
      }
      if (!app.proposal) app.autosave();
    }
    this.draw(res);
    app.tree.render();
    app.updatePlanes();
    const bad = res.mates.filter((m) => m.state === 'error');
    const badc = res.components.filter((c) => c.state === 'error');
    if (badc.length) app.status(`${this.comp(badc[0].id)?.name || badc[0].id}: ${badc[0].message}`);
    else if (bad.length) app.status(`${this.mate(bad[0].id)?.name || bad[0].id}: ${bad[0].message}`);
    else app.status(this.defineSummary());
  }

  defineSummary() {
    const cs = this.res?.components || [];
    const under = cs.filter((c) => c.state === 'under').length;
    return cs.length ? (under ? `${under} of ${cs.length} components under defined` : 'Fully defined') : 'Insert components to start the assembly.';
  }

  draw(res = this.res, doc = this.doc) {
    if (!res) return;
    const app = this.app;
    const proposal = !!app.proposal;
    const proposedComps = new Set(app.proposedIds || []);
    const comps = res.components.map((c) => {
      const dc = doc.components.find((x) => x.id === c.id) || {};
      const part = doc.parts?.[c.part] || {};
      let color = hexColor(part.appearance);
      if (proposal && (!proposedComps.size || proposedComps.has(c.id))) color = tint(color);
      const transparent = this.transparent?.has(c.id);
      return { id: c.id, part: c.part, key: res.parts[c.part]?.key, matrix: c.matrix, color, hidden: dc.hidden || dc.suppressed, opacity: transparent ? 0.25 : 1 };
    });
    const bodies = Object.fromEntries(Object.entries(res.parts).filter(([, p]) => p.body).map(([k, p]) => [k, p.body]));
    app.viewer.setTool(null);
    app.viewer.setAssembly(comps, bodies);
    app.viewer.clearGroup(app.viewer.otherSketches);
    app.refreshSelectionDisplay();
  }

  // ------------------------------------------------------------------ tree
  renderTree(tree, node) {
    const app = this.app, doc = this.doc;
    const st = app.statusById || {};
    node({ id: 'root', kind: 'root', name: `${esc(doc.name)} (Default&lt;Display State-1&gt;)`, ic: 'assembly', cls: 'root' });
    node({ id: 'history', kind: 'folder', name: 'History', ic: 'history', depth: 1, twisty: false });
    node({ id: 'sensors', kind: 'folder', name: 'Sensors', ic: 'sensor', depth: 1 });
    node({ id: 'annotations', kind: 'folder', name: 'Annotations', ic: 'annotations', depth: 1, twisty: false });
    for (const p of ['Front Plane', 'Top Plane', 'Right Plane']) node({ id: p, kind: 'plane', name: p, ic: 'plane_t', depth: 1 });
    node({ id: 'origin', kind: 'origin', name: 'Origin', ic: 'origin', depth: 1 });
    const proposed = new Set(app.proposedIds || []);
    for (const c of doc.components) {
      const s = st[c.id];
      const prefix = c.suppressed ? '' : c.fixed || s?.state === 'fixed' ? '(f) ' : s?.state === 'under' ? '(-) ' : '';
      const state = c.suppressed ? 'suppressed' : s?.state === 'error' ? 'error' : 'ok';
      const open = this.expandedComps.has(c.id);
      const n = node({ id: c.id, kind: 'component', name: prefix + esc(c.name), ic: 'part', depth: 1, twisty: open,
        cls: `${state}${c.hidden ? ' hiddencomp' : ''}${proposed.has(c.id) ? ' proposed' : ''}`,
        badge: state === 'error' ? tree.badgeIcon('error') : '', onDbl: () => this.openPart(c.id), onTwisty: () => { open ? this.expandedComps.delete(c.id) : this.expandedComps.add(c.id); tree.render(); } });
      if (n && s?.message) n.title = s.message;
      if (n && s?.state === 'under') n.title = `${s.dof} degree${s.dof === 1 ? '' : 's'} of freedom left`;
      if (open) for (const f of doc.parts[c.part]?.features || []) {
        if (f.type === 'sketch' && (doc.parts[c.part].features.some((x) => x.sketch === f.id))) continue;
        node({ id: `${c.id}:${f.id}`, kind: 'compfeature', name: esc(f.name), ic: tree.featureIcon(f), depth: 2, onDbl: () => this.openPart(c.id) });
      }
    }
    const mates = doc.mates || [];
    node({ id: 'mates', kind: 'folder', name: 'Mates', ic: 'mates', depth: 1, twisty: this.matesOpen, onTwisty: () => { this.matesOpen = !this.matesOpen; tree.render(); } });
    if (this.matesOpen) for (const m of mates) {
      const s = st[m.id];
      const state = m.suppressed ? 'suppressed' : s?.state === 'error' ? 'error' : 'ok';
      const names = (m.refs || []).map((r) => (r.component ? this.comp(r.component)?.name : r.ref) || '?');
      const n = node({ id: m.id, kind: 'mate', name: `${esc(m.name)} (${esc(names.join(','))})`, ic: mateIcon(m.type), depth: 2,
        cls: `${state}${proposed.has(m.id) ? ' proposed' : ''}`, badge: state === 'error' ? tree.badgeIcon('error') : '', onDbl: () => this.matePM(m) });
      if (n && s?.message) n.title = s.message;
    }
  }

  // ------------------------------------------------------------------ selection and mouse
  pickToItem(p) {
    if (!p) return null;
    if ((p.kind === 'face' || p.kind === 'edge') && typeof p.id === 'string' && p.id.includes('/')) return { kind: 'component', id: p.id.split('/')[0] };
    if (p.kind === 'plane') return { kind: 'plane', id: p.id };
    return null;
  }

  pointerMove(e) {
    const app = this.app;
    if (this.drag) return this.dragMove(e);
    const p = app.pickAt(e.offsetX, e.offsetY);
    if (app.cmd) app.viewer.setHover(p && (p.kind === 'face' || p.kind === 'edge') ? p : null);
    else {
      const it = this.pickToItem(p);
      app.viewer.setHover(it?.kind === 'component' ? { kind: 'comp', id: it.id } : null);
    }
    const hp = p && p.kind === 'plane' ? p.id : null;
    if (hp !== app.hoverPlane) { app.hoverPlane = hp; app.updatePlanes(); }
    if (p && p.point) app.coords(`${fmt(p.point.x)}mm  ${fmt(p.point.y)}mm  ${fmt(p.point.z)}mm`);
  }

  pointerDown(e) {
    const app = this.app;
    const p = app.pickAt(e.offsetX, e.offsetY);
    if (app.cmd) {
      if (p && app.routePick(p)) return;
      return;
    }
    const it = this.pickToItem(p);
    if (!it) { if (!e.ctrlKey && !e.shiftKey) app.setSelection([]); return; }
    const key = `${it.kind}:${it.id}`;
    if (e.ctrlKey || e.shiftKey) {
      const has = app.selection.some((s) => `${s.kind}:${s.id}` === key);
      app.setSelection(has ? app.selection.filter((s) => `${s.kind}:${s.id}` !== key) : [...app.selection, it]);
      return;
    }
    app.setSelection([it]);
    if (it.kind === 'component' && !app.proposal) {
      // left-drag moves an under-defined component; mates keep holding (SOLIDWORKS drag)
      this.drag = { id: it.id, x: e.offsetX, y: e.offsetY, cx: e.clientX, cy: e.clientY, point: p.point.clone(), moved: false };
      app.viewer.canvas.setPointerCapture(e.pointerId);
    } else app.showContextToolbar(it, e.clientX, e.clientY);
  }

  pointerUp(e) {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    if (!d.moved) { this.app.showContextToolbar({ kind: 'component', id: d.id }, d.cx, d.cy); return; }
    clearTimeout(this.dragTimer);
    const pos = this.dragPos(d, e);
    this.app.commit('Move Component', () => {
      const c = this.app.doc.components.find((x) => x.id === d.id);
      c.position = pos;
    });
  }

  dragPos(d, e) {
    const v = this.app.viewer;
    const n = new THREE.Vector3(0, 0, 1).applyQuaternion(v.quat);
    const x = new THREE.Vector3(1, 0, 0).applyQuaternion(v.quat);
    const y = n.clone().cross(x);
    const frame = { origin: d.point.toArray(), normal: n.toArray(), xdir: x.toArray(), ydir: y.toArray() };
    const a = v.screenToPlane(d.x, d.y, frame).world, b = v.screenToPlane(e.offsetX, e.offsetY, frame).world;
    const c = this.app.doc.components.find((cc) => cc.id === d.id);
    const p0 = d.start || (d.start = [...(c.position || [0, 0, 0])]);
    return p0.map((v0, i) => +(v0 + b.getComponent(i) - a.getComponent(i)).toFixed(4));
  }

  dragMove(e) {
    const d = this.drag;
    const app = this.app;
    if (!d.moved && Math.hypot(e.offsetX - d.x, e.offsetY - d.y) < 4) return;
    const c = app.doc.components.find((cc) => cc.id === d.id);
    if (!d.moved) {
      d.moved = true;
      app.hideContextToolbar();
      if (c.fixed || this.resComp(d.id)?.state === 'fixed') { this.drag = null; app.status(`${c.name} is fixed. Right-click it and choose Float to move it.`); return; }
      if (this.resComp(d.id)?.state === 'full') { this.drag = null; app.status(`${c.name} is fully defined by its mates and cannot move.`); return; }
      app.status('Dragging ' + c.name + '. Mates keep holding.');
    }
    const pos = this.dragPos(d, e);
    clearTimeout(this.dragTimer);
    // preview: solve with the dragged position as the starting guess (throttled)
    const now = performance.now();
    const go = () => {
      this.lastDragSolve = performance.now();
      const doc = app.cleanDoc(app.doc);
      doc.components.find((cc) => cc.id === d.id).position = pos;
      this.regen(false, doc);
    };
    if (!this.lastDragSolve || now - this.lastDragSolve > 90) go(); else this.dragTimer = setTimeout(go, 90);
  }

  contextToolbar(item) {
    const tb = [];
    if (item.kind === 'component') {
      const c = this.comp(item.id);
      if (!c) return tb;
      tb.push({ icon: 'open', title: 'Open Part', run: () => this.openPart(c.id) });
      tb.push({ icon: 'mate', title: 'Mate', run: () => this.matePM() });
      tb.push({ icon: 'fix', title: c.fixed ? 'Float' : 'Fix', run: () => this.setFixed(c.id, !c.fixed) });
      tb.push({ icon: 'hideshow', title: c.hidden ? 'Show Components' : 'Hide Components', run: () => this.setHidden(c.id, !c.hidden) });
    }
    if (item.kind === 'mate') {
      const m = this.mate(item.id);
      if (m) {
        tb.push({ icon: mateIcon(m.type), title: 'Edit Feature', run: () => this.matePM(m) });
        tb.push({ icon: 'rebuild', title: m.suppressed ? 'Unsuppress' : 'Suppress', run: () => this.suppressMate(m.id, !m.suppressed) });
      }
    }
    return tb;
  }

  contextMenuItems(item) {
    const items = [];
    if (item?.kind === 'component') {
      const c = this.comp(item.id);
      items.push({ head: c.name });
      items.push({ label: 'Open Part', icon: 'open', run: () => this.openPart(c.id) });
      items.push({ label: 'Mate', icon: 'mate', run: () => { this.app.setSelection([]); this.matePM(); } });
      items.push({ label: c.fixed ? 'Float' : 'Fix', icon: 'fix', run: () => this.setFixed(c.id, !c.fixed) });
      items.push({ label: c.hidden ? 'Show Components' : 'Hide Components', icon: 'hideshow', run: () => this.setHidden(c.id, !c.hidden) });
      items.push({ label: c.suppressed ? 'Unsuppress' : 'Suppress', run: () => this.app.commit(c.suppressed ? 'Unsuppress' : 'Suppress', () => { const x = this.app.doc.components.find((cc) => cc.id === c.id); if (x.suppressed) delete x.suppressed; else x.suppressed = true; }) });
      items.push({ label: 'Rename', key: 'F2', run: () => this.app.tree.rename(c.id) });
      items.push('-', { label: 'Delete', key: 'Del', run: () => this.deleteItems([c.id], []) });
    } else if (item?.kind === 'mate') {
      const m = this.mate(item.id);
      items.push({ label: 'Edit Feature', icon: mateIcon(m.type), run: () => this.matePM(m) });
      items.push({ label: m.suppressed ? 'Unsuppress' : 'Suppress', run: () => this.suppressMate(m.id, !m.suppressed) });
      items.push({ label: 'Rename', key: 'F2', run: () => this.app.tree.rename(m.id) });
      items.push('-', { label: 'Delete', key: 'Del', run: () => this.deleteItems([], [m.id]) });
    } else if (item?.kind === 'root') {
      items.push({ label: 'Rebuild', icon: 'rebuild', key: 'Ctrl+B', run: () => this.app.regen(true) });
      items.push({ label: 'Insert Components', icon: 'insertcomp', run: () => this.insertPM() });
      items.push({ label: 'Assembly Playback', icon: 'playback', run: () => this.playSequence() });
    }
    return items;
  }

  // ------------------------------------------------------------------ edits
  setFixed(id, on) {
    this.app.commit(on ? 'Fix' : 'Float', () => { const c = this.app.doc.components.find((x) => x.id === id); if (on) c.fixed = true; else delete c.fixed; });
  }

  setHidden(id, on) {
    this.app.commit(on ? 'Hide Components' : 'Show Components', () => { const c = this.app.doc.components.find((x) => x.id === id); if (on) c.hidden = true; else delete c.hidden; }, false);
    this.draw();
  }

  suppressMate(id, on) {
    this.app.commit(on ? 'Suppress' : 'Unsuppress', () => { const m = this.app.doc.mates.find((x) => x.id === id); if (on) m.suppressed = true; else delete m.suppressed; });
  }

  deleteItems(compIds, mateIds) {
    const doc = this.app.doc;
    const comps = new Set(compIds);
    const mates = new Set(mateIds);
    for (const m of doc.mates) if ((m.refs || []).some((r) => comps.has(r.component))) mates.add(m.id);
    const names = [...[...comps].map((c) => this.comp(c)?.name), ...[...mates].map((m) => this.mate(m)?.name)].filter(Boolean);
    const go = () => this.app.commit('Delete', () => {
      doc.components = doc.components.filter((c) => !comps.has(c.id));
      doc.mates = doc.mates.filter((m) => !mates.has(m.id));
      doc.sequence = (doc.sequence || []).filter((c) => !comps.has(c));
      const used = new Set(doc.components.map((c) => c.part));
      for (const pid of Object.keys(doc.parts)) if (!used.has(pid) && compIds.length) delete doc.parts[pid];
      this.app.selection = [];
    });
    if (!comps.size) return go();
    dialog({ title: 'Confirm Delete', body: `<div>Delete ${names.map(esc).join(', ')}?</div>` + (mates.size ? '<div style="margin-top:6px">Mates that use these components are deleted too.</div>' : ''),
      buttons: [{ label: 'Yes', primary: true, run: go }, { label: 'No' }] });
  }

  deleteSelection() {
    const comps = this.app.selection.filter((s) => s.kind === 'component').map((s) => s.id);
    const mates = this.app.selection.filter((s) => s.kind === 'mate').map((s) => s.id);
    if (comps.length || mates.length) this.deleteItems(comps, mates);
  }

  // ------------------------------------------------------------------ Insert Components
  insertPM() {
    const app = this.app;
    if (app.cmd) app.pmCancel();
    const doc = app.doc;
    const state = { picked: null };
    const pickFile = () => {
      const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.osk,.json';
      inp.onchange = async () => {
        const f = inp.files[0]; if (!f) return;
        try {
          const d = JSON.parse(await f.text());
          if (isAssembly(d)) throw new Error('Sub-assemblies are not supported yet. Pick a part file.');
          if (!Array.isArray(d.features)) throw new Error('Not an OpenSketch part');
          const base = (d.name || f.name.replace(/\.[^.]+$/, '')).toLowerCase().replace(/[^a-z0-9]+/g, '') || 'part';
          let pid = base, k = 2;
          while (doc.parts[pid]) pid = base + k++;
          app.commit('Insert ' + (d.name || pid), () => { doc.parts[pid] = { ...d, type: 'part', rollback: null }; this.addComponent(pid); });
          app.closeCommand();
        } catch (err) { message('Insert Components', 'Could not insert: ' + esc(err.message)); }
      };
      inp.click();
    };
    const spec = {
      title: 'Insert Component', icon: 'insertcomp',
      message: 'Select a part to insert. It is placed beside the assembly; then add mates.',
      sections: [
        { title: 'Part/Assembly to Insert', rows: [
          { type: 'list', items: () => Object.entries(doc.parts).map(([pid, p]) => ({ label: esc(p.name || pid), icon: 'part', selected: state.picked === pid, select: () => { state.picked = pid; app.pm.render(); } })), empty: 'No parts in this assembly yet.' },
          { type: 'buttons', buttons: [{ label: 'Browse...', run: pickFile }, { label: 'New Part', run: () => { app.closeCommand(); this.newPart(); } }] },
        ] },
        { title: 'Options', rows: [{ type: 'text', text: 'The first component is fixed. Drag under-defined components to move them.' }] },
      ],
      okEnabled: () => !!state.picked,
    };
    app.cmd = { key: 'insertcomp', onOk: () => {
      if (!state.picked) return false;
      app.commit('Insert ' + this.partName(state.picked), () => this.addComponent(state.picked));
      return undefined;
    } };
    app.pm.open(spec);
  }

  addComponent(pid, position = null) {
    const doc = this.app.doc;
    const id = this.uid('c');
    const n = 1 + doc.components.filter((c) => c.part === pid).length;
    let pos = position;
    if (!pos) {
      const bb = this.res?.bbox;
      const pb = this.res?.parts?.[pid]?.bbox;
      const w = pb ? pb[1][0] - pb[0][0] : 50;
      pos = bb ? [+(bb[1][0] + w * 0.8 + 20).toFixed(3), 0, 0] : [0, 0, 0];
    }
    const comp = { id, part: pid, name: `${doc.parts[pid]?.name || pid}<${n}>`, position: pos, rotation: [0, 0, 0] };
    if (!doc.components.length) comp.fixed = true;
    doc.components.push(comp);
    (doc.sequence = doc.sequence || []).push(id);
    this.app.selection = [{ kind: 'component', id }];
    return comp;
  }

  newPart() {
    const app = this.app;
    const doc = app.doc;
    let k = Object.keys(doc.parts).length + 1;
    while (doc.parts['part' + k]) k++;
    const pid = 'part' + k;
    let comp;
    app.commit('New Part', () => {
      doc.parts[pid] = { version: 1, type: 'part', name: 'Part' + k, units: 'mm', features: [], rollback: null, seq: 1 };
      comp = this.addComponent(pid);
    }, false);
    this.regen().then(() => this.openPart(comp.id));
  }

  // ------------------------------------------------------------------ Mate PropertyManager
  refOfPick(p) {
    if (!p) return null;
    if (p.kind === 'plane') return ['Front Plane', 'Top Plane', 'Right Plane'].includes(p.id) ? { ref: { ref: p.id }, label: p.id } : null;
    if (typeof p.id !== 'string' || !p.id.includes('/')) return null;
    const [cid, sub] = p.id.split('/');
    const cname = this.comp(cid)?.name || cid;
    const d = p.data || {};
    const r = (v) => v.map((x) => +(+x).toFixed(6));
    if (p.kind === 'face') {
      if (d.normal) return { ref: { component: cid, plane: { point: r(d.center), normal: r(d.normal) } }, label: `Face&lt;${+sub + 1}&gt;@${esc(cname)}`, kind: 'plane' };
      if (d.axis) return { ref: { component: cid, axis: { point: r(d.axis.point), dir: r(d.axis.dir) } }, label: `Face&lt;${+sub + 1}&gt;@${esc(cname)}`, kind: 'axis' };
      this.app.toast('Pick a planar or cylindrical face.');
      return null;
    }
    if (p.kind === 'edge' && d.type === 'line' && d.points?.length >= 6) {
      const a = d.points.slice(0, 3), b = d.points.slice(-3);
      const dir = b.map((v, i) => v - a[i]); const L = Math.hypot(...dir) || 1;
      return { ref: { component: cid, axis: { point: r(a), dir: r(dir.map((v) => v / L)) } }, label: `Edge&lt;${+sub + 1}&gt;@${esc(cname)}`, kind: 'axis' };
    }
    this.app.toast('Pick a face, a straight edge or a plane.');
    return null;
  }

  matePM(existing = null) {
    const app = this.app;
    if (app.cmd) app.pmCancel();
    const doc = app.doc;
    const m = existing ? clone(existing) : { type: 'coincident', refs: [], align: 'auto' };
    const labels = existing ? m.refs.map((r) => (r.component ? `${esc(this.comp(r.component)?.name)}` : esc(r.ref))) : [];
    let typed = !!existing;
    const kinds = () => m.refs.map((r) => (r.plane || ['Front Plane', 'Top Plane', 'Right Plane'].includes(r.ref) ? 'plane' : r.axis || /axis/.test(r.ref || '') ? 'axis' : 'point'));
    const autoType = () => {
      if (typed || m.refs.length < 2) return;
      const k = kinds();
      m.type = k[0] === 'axis' && k[1] === 'axis' ? 'concentric' : 'coincident';
    };
    const showAlign = () => m.refs.length === 2 && kinds().every((k) => k === 'plane') && ['coincident', 'distance', 'parallel'].includes(m.type);
    const spec = {
      title: existing ? m.name : 'Mate', icon: 'mate',
      message: () => (m.refs.length < 2 ? 'Select two faces, straight edges or planes to mate.' : null),
      sections: [
        { title: 'Mate Selections', rows: [{ type: 'selbox', id: 'ents', icon: 'mate', items: () => labels, label: (l) => l, placeholder: 'Entities to Mate',
          remove: (i) => { labels.splice(i, 1); m.refs.splice(i, 1); typed = !!existing; } }] },
        { title: 'Standard Mates', rows: [
          { type: 'radio', name: 'matetype', options: MATE_TYPES.map(([v, l]) => [v, l]), get: () => m.type, set: (v) => { m.type = v; typed = true; if (v === 'distance' && m.value === undefined) m.value = 10; if (v === 'angle' && m.value === undefined) m.value = 90; } },
          { type: 'number', label: 'Distance', icon: 'm_distance', unit: 'mm', min: 0, visible: () => m.type === 'distance', get: () => m.value ?? 10, set: (v) => { m.value = v; } },
          { type: 'check', label: 'Flip dimension', visible: () => m.type === 'distance', get: () => !!m.flip, set: (v) => { m.flip = v; } },
          { type: 'number', label: 'Angle', icon: 'm_angle', unit: 'deg', min: 0, max: 180, visible: () => m.type === 'angle', get: () => m.value ?? 90, set: (v) => { m.value = v; } },
        ] },
        { title: 'Mate alignment', visible: showAlign, rows: [
          { type: 'radio', name: 'matealign', options: [['anti', 'Anti-Aligned'], ['aligned', 'Aligned']], get: () => (m.align === 'aligned' ? 'aligned' : 'anti'), set: (v) => { m.align = v; } },
        ] },
      ],
      okEnabled: () => m.refs.length === 2,
      onChange: () => this.previewMate(m, existing),
    };
    app.cmd = {
      key: 'mate',
      onPick: (p) => {
        const r = this.refOfPick(p);
        if (!r) return 'handled';
        if (m.refs.length >= 2) { m.refs = []; labels.length = 0; }
        if (m.refs.length === 1 && m.refs[0].component && m.refs[0].component === r.ref.component) { app.toast('Pick the second entity on another component.'); return 'handled'; }
        m.refs.push(r.ref); labels.push(r.label);
        if (m.refs.length === 2 && !typed && kinds()[0] === 'plane' && kinds()[1] === 'plane') m.align = 'auto';
        autoType();
        app.pm.render();
        this.previewMate(m, existing);
        return true;
      },
      onOk: () => {
        if (m.refs.length < 2) return false;
        const name = existing ? m.name : this.nextMateName(m.type);
        const id = existing ? existing.id : this.uid('m');
        const mm = { ...clone(m), id, name };
        if (mm.type !== 'distance' && mm.type !== 'angle') delete mm.value;
        if (mm.type !== 'lock') delete mm.pose;
        if (existing && existing.type !== mm.type) mm.name = this.nextMateName(mm.type);
        app.commit(existing ? 'Edit ' + name : name, () => {
          if (existing) { const i = doc.mates.findIndex((x) => x.id === existing.id); doc.mates[i] = mm; } else doc.mates.push(mm);
        });
        if (existing) return undefined;
        m.refs = []; labels.length = 0; typed = false; m.type = 'coincident'; m.align = 'auto'; delete m.value; delete m.flip;
        app.pm.render();
        return false; // SOLIDWORKS keeps the Mate PropertyManager open for the next mate
      },
      onCancel: () => { this.regen(); },
    };
    app.pm.open(spec);
    if (!existing) {
      // preselected faces from the graphics area
      for (const s of app.selection) if (s.kind === 'face') app.cmd.onPick({ kind: 'face', id: s.id, data: s.data });
    }
    app.setSelection([]);
  }

  nextMateName(type) {
    const base = mateLabel(type);
    const names = new Set(this.app.doc.mates.map((m) => m.name));
    let n = 1;
    while (names.has(base + n)) n++;
    return base + n;
  }

  previewMate(m, existing) {
    if (m.refs.length < 2) return;
    clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(async () => {
      const doc = this.app.cleanDoc(this.app.doc);
      const mm = { ...clone(m), id: existing?.id || '_preview', name: 'Preview' };
      if (existing) doc.mates = doc.mates.map((x) => (x.id === existing.id ? mm : x)); else doc.mates.push(mm);
      const res = await this.regen(false, doc);
      if (!res || !this.app.pm.spec) return;
      const st = res.mates.find((x) => x.id === mm.id);
      this.app.pm.spec.error = st && st.state === 'error' ? st.message : null;
      this.app.pm.render();
    }, 80);
  }

  // ------------------------------------------------------------------ Interference Detection
  async interferencePM() {
    const app = this.app;
    if (app.cmd) app.pmCancel();
    const state = { items: null, sel: -1, busy: true };
    const show = () => {
      const it = state.items || [];
      const meshes = (state.sel >= 0 ? [it[state.sel]] : it).map((x) => x.mesh);
      const merged = { faces: meshes.flatMap((mm) => mm.faces), edges: meshes.flatMap((mm) => mm.edges) };
      this.transparent = new Set(app.doc.components.map((c) => c.id));
      this.draw();
      app.viewer.setTool(merged.faces.length ? merged : null, 0xff2a2a);
    };
    const spec = {
      title: 'Interference Detection', icon: 'interference',
      message: () => (state.busy ? 'Calculating...' : null),
      sections: [{ title: 'Results', rows: [
        { type: 'list', items: () => (state.items || []).map((x, i) => ({ label: `Interference${i + 1}: ${esc(x.names[0])} and ${esc(x.names[1])} (${fmt(x.volume, 2)} mm^3)`, icon: 'interference', selected: state.sel === i, select: () => { state.sel = state.sel === i ? -1 : i; show(); app.pm.render(); } })),
          empty: state.busy ? '' : 'No Interferences' },
        { type: 'buttons', buttons: [{ label: 'Calculate', run: () => run() }] },
      ] }],
      okEnabled: () => true, noCancel: true,
    };
    const run = async () => {
      state.busy = true; app.pm.render();
      try {
        const r = await app.api('/api/interference', { doc: app.cleanDoc(app.doc) });
        state.items = r.interferences;
      } catch (err) { state.items = []; app.toast(String(err.message || err)); }
      state.busy = false;
      spec.sections[0].rows[0].empty = 'No Interferences';
      show(); app.pm.render();
      app.status(state.items.length ? `${state.items.length} interference(s) found` : 'No interferences');
    };
    app.cmd = { key: 'interference', onOk: () => undefined, onClose: () => { this.transparent = null; app.viewer.setTool(null); this.draw(); } };
    app.pm.open(spec);
    run();
  }

  // ------------------------------------------------------------------ Open Part / return
  openPart(cid) {
    const app = this.app;
    if (app.proposal) { app.toast('Accept or reject the AI proposal first.'); return; }
    const c = app.doc.components.find((x) => x.id === cid);
    if (!c) return;
    const part = app.doc.parts[c.part];
    if (!part) return;
    app.closeCommand();
    app.hideContextToolbar();
    app.docStack.push({ doc: app.doc, undo: app.undoStack, redo: app.redoStack, pid: c.part, comp: c.name,
      view: { quat: app.viewer.quat.clone(), target: app.viewer.target.clone(), viewH: app.viewer.viewH } });
    app.doc = clone(part);
    app.doc.seq = app.doc.seq || 1000;
    if (app.doc.rollback === undefined) app.doc.rollback = null;
    app.undoStack = []; app.redoStack = [];
    app.selection = [];
    app.viewer.setAssembly([], {});
    app.ribbon.setTab('Features');
    app.updateDocChrome();
    app.regen().then(() => app.viewer.zoomToFit());
    app.status(`Editing ${part.name}. Click Return to Assembly when done.`);
  }

  returnToAssembly() {
    const app = this.app;
    const f = app.docStack.pop();
    if (!f) return;
    if (app.mode === 'sketch') app.exitSketch({ silent: true });
    app.closeCommand();
    app.hideContextToolbar();
    const part = app.cleanDoc(app.doc);
    part.type = 'part';
    app.doc = f.doc; app.undoStack = f.undo; app.redoStack = f.redo;
    app.selection = [];
    app.ribbon.setTab('Assembly');
    app.updateDocChrome();
    app.viewer.setView(f.view.quat, f.view.target, f.view.viewH, false);
    app.viewer.setBody(null);
    if (JSON.stringify(part) !== JSON.stringify(f.doc.parts[f.pid])) app.commit('Edit ' + (part.name || f.pid), () => { app.doc.parts[f.pid] = part; });
    else app.regen();
  }

  // ------------------------------------------------------------------ Motion Study: assembly playback
  async playSequence() {
    const app = this.app, v = app.viewer;
    if (!this.res) await this.regen();
    if (!this.res || this.playing) return;
    this.playing = true;
    app.status('Assembly playback');
    const order = [...(this.doc.sequence || [])];
    for (const c of this.doc.components) if (!order.includes(c.id)) order.push(c.id);
    const groups = order.map((id) => [id, v.compGroups.get(id)]).filter(([, g]) => g);
    const targets = new Map(groups.map(([id, g]) => [id, g.matrix.clone()]));
    const bb = this.res.bbox;
    const size = bb ? Math.max(...bb[1].map((x, i) => x - bb[0][i])) : 100;
    const center = bb ? new THREE.Vector3(...bb[0]).add(new THREE.Vector3(...bb[1])).multiplyScalar(0.5) : new THREE.Vector3();
    for (const [, g] of groups) g.visible = false;
    v.requestRender();
    for (const [i, [id, g]] of groups.entries()) {
      const to = targets.get(id);
      const p = new THREE.Vector3().setFromMatrixPosition(to);
      const out = p.clone().sub(center); out.y = Math.max(out.y, 0);
      if (out.length() < 1e-6) out.set(0, 1, 0);
      out.normalize().multiplyScalar(size * 0.7).add(new THREE.Vector3(0, size * 0.5, 0));
      const from = to.clone().premultiply(new THREE.Matrix4().makeTranslation(out.x, out.y, out.z));
      const via = to.clone().premultiply(new THREE.Matrix4().makeTranslation(0, size * 0.18, 0));
      g.matrix.copy(from); g.visible = true;
      app.status(`Assembly playback: ${i + 1}/${groups.length} ${this.comp(id)?.name || id}`);
      await v.tweenGroups([{ group: g, via, to }], i === 0 ? 500 : 850);
    }
    this.playing = false;
    app.status('Playback complete');
  }

  async massProperties() {
    const app = this.app;
    let r;
    try { r = await app.api('/api/mass', { doc: app.cleanDoc(app.doc) }); } catch (err) { app.toast(String(err)); return; }
    message('Mass Properties', `<table class="mass-table">
      <tr><td>Components</td><td>${r.components}</td></tr>
      <tr><td>Mass</td><td>${fmt(r.mass * 1000, 2)} grams</td></tr>
      <tr><td>Volume</td><td>${fmt(r.volume, 2)} mm^3</td></tr>
      <tr><td>Center of mass</td><td>X = ${fmt(r.center_of_mass[0], 3)}<br>Y = ${fmt(r.center_of_mass[1], 3)}<br>Z = ${fmt(r.center_of_mass[2], 3)}</td></tr></table>
      <div class="pm-note" style="margin-top:6px">Each part uses its own material. Parts without one count as 1000 kg/m^3.</div>`);
  }

  canvasContext(e) {
    const p = this.app.pickAt(e.offsetX, e.offsetY);
    const it = this.pickToItem(p);
    const items = it?.kind === 'component' ? this.contextMenuItems(it) : [];
    if (items.length) items.push('-');
    items.push({ label: 'Insert Components', icon: 'insertcomp', run: () => this.insertPM() });
    items.push({ label: 'Mate', icon: 'mate', run: () => this.matePM() });
    items.push({ label: 'Zoom to Fit', icon: 'zoomfit', key: 'F', run: () => this.app.viewer.zoomToFit() });
    contextMenu(e.clientX, e.clientY, items);
  }
}
