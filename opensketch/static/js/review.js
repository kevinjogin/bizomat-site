// Motion Review (Evaluate tab): drive each joint through its travel with the browser's mate solver and
// see the checks (clashes through the travel, smallest gap, contacts that must touch). The same
// PropertyManager opens read-only in a shared review link (/review/<token>): the app loads a frozen
// snapshot (review.py) and solves the joints itself. See docs/DOCUMENT.md (Mates: coupler; Contacts).

import * as THREE from 'three';
import { regenLocal, measurePair } from './asmsolver.js';
import { escapeHtml as esc } from './model-utils.js';
import { fmt } from './sketch/geom2d.js';

const clone = (o) => JSON.parse(JSON.stringify(o));
const CLASH = 0xe0362c, CHANGED = 0x2b2b2b;

export function jointUnit(m) { return m.type === 'limit_distance' ? 'mm' : 'deg'; }
export function jointRange(m) { return m.type === 'hinge' ? [m.angle_min, m.angle_max] : [m.min, m.max]; }
function pin(m, v) { if (m.type === 'hinge') { m.angle_min = v; m.angle_max = v; } else { m.min = v; m.max = v; } }
function jointNow(m, components) {
  if (m.type === 'hinge') return measurePair('angle', m.angle_refs, components);
  return measurePair(m.type === 'limit_angle' ? 'angle' : 'distance', m.refs, components);
}

export class MotionReview {
  constructor(app) {
    this.app = app;
    this.shared = null;   // the snapshot of a shared link
    this.checks = null;   // {checks, joints, names}
    this.values = {};     // joint id -> value shown
    this.work = null;     // the document as posed by the sliders (warm start for the next solve)
    this.flagged = new Set();
    this.showChanged = true;
    this.showGhost = true;
  }

  get readOnly() { return !!this.shared; }

  joints() { return this.app.asm.joints(this.app.doc); }

  // ------------------------------------------------------------------ PropertyManager
  async open() {
    const app = this.app;
    if (!app.isAsm) { app.toast('Motion Review drives the joints of an assembly. Open or create an assembly first.'); return; }
    if (app.cmd) app.pmCancel();
    this.work = app.cleanDoc(app.doc);
    this.values = {};
    for (const m of this.joints()) this.values[m.id] = this.clampNow(m);
    this.flagged = new Set();
    const spec = {
      title: 'Motion Review', icon: 'motionreview', noCancel: true,
      message: () => (this.joints().length ? null : 'No joint with travel. Give a Hinge angle limits, or add a Limit Distance or Limit Angle mate.'),
      sections: this.sections(),
      okEnabled: () => true,
    };
    app.cmd = { key: 'motionreview', onOk: () => undefined, onClose: () => this.close() };
    app.pm.open(spec);
    app.syncDocTabs?.();
    this.draw();
    if (!this.readOnly && !this.checks) this.runChecks();
  }

  sections() {
    const s = this.shared;
    const out = [];
    if (s) {
      out.push({ title: 'Review', rows: [
        { type: 'text', text: `<b>${esc(s.title)}</b>` },
        { type: 'text', text: esc(`Version ${s.version}${s.compare ? ` compared with version ${s.compare}` : ''}. Published ${s.date}.`) },
        ...(s.notes ? s.notes.split(/\n\s*\n/).map((p) => ({ type: 'text', text: esc(p).replace(/\n/g, '<br>') })) : []),
      ] });
    }
    out.push({ title: 'Joints', rows: [{ type: 'custom', render: (row) => this.renderJoints(row) }] });
    out.push({ title: 'Checks', rows: [
      { type: 'custom', render: (row) => this.renderChecks(row) },
      { type: 'buttons', visible: () => !this.readOnly, buttons: [{ label: this.busy ? 'Checking...' : 'Run Checks', run: () => this.runChecks() }] },
    ] });
    if (s && (s.compare || s.changes?.length || s.mate_changes?.length)) {
      out.push({ title: 'What Changed', rows: [
        { type: 'custom', render: (row) => this.renderChanges(row) },
        { type: 'check', label: 'Show changed parts in black', get: () => this.showChanged, set: (v) => { this.showChanged = v; this.draw(); } },
        { type: 'check', label: 'Show the previous version', visible: () => !!s.old?.length, get: () => this.showGhost, set: (v) => { this.showGhost = v; this.drawGhost(); } },
      ] });
    }
    if (!s) {
      out.push({ title: 'Share', collapsed: true, rows: [
        { type: 'text', text: 'Publish a read-only link to this version (no password needed): the model, these joints and checks.' },
        { type: 'buttons', buttons: [{ label: 'Publish Review...', run: () => this.app.server.publishDialog() }] },
      ] });
    }
    return out;
  }

  renderJoints(row) {
    row.style.flexDirection = 'column'; row.style.alignItems = 'stretch';
    const js = this.joints();
    if (!js.length) { row.appendChild(Object.assign(document.createElement('div'), { className: 'pm-note', textContent: 'None.' })); return; }
    for (const m of js) {
      const [lo, hi] = jointRange(m);
      const unit = jointUnit(m);
      const wrap = document.createElement('div'); wrap.className = 'mr-joint';
      const head = document.createElement('div'); head.className = 'mr-head';
      const name = document.createElement('span'); name.textContent = m.name || m.id;
      const val = document.createElement('b'); val.className = 'mr-val';
      head.append(name, val);
      const line = document.createElement('div'); line.className = 'mr-line';
      const play = document.createElement('button'); play.className = 'btn mr-play'; play.textContent = 'Play'; play.title = 'Run through the travel';
      const r = document.createElement('input'); r.type = 'range'; r.min = lo; r.max = hi; r.step = (hi - lo) / 240; r.value = this.values[m.id];
      r.setAttribute('aria-label', m.name || m.id);
      const show = () => { val.textContent = `${fmt(this.values[m.id], unit === 'mm' ? 2 : 1)} ${unit}`; r.value = this.values[m.id]; };
      r.oninput = () => { this.stop(); this.setJoint(m.id, +r.value); show(); };
      play.onclick = () => (this.playing === m.id ? this.stop() : this.play(m.id, show, play));
      const ends = document.createElement('div'); ends.className = 'mr-ends';
      ends.innerHTML = `<span>${esc(fmt(lo, 2))}</span><span>${esc(fmt(hi, 2))} ${unit}</span>`;
      line.append(r, play);
      wrap.append(head, line, ends);
      row.appendChild(wrap);
      show();
      m._show = show;
    }
  }

  checkItems() {
    const c = this.checks?.checks;
    if (!c) return [];
    const nm = (id) => this.checks.names?.[id] || this.app.asm.comp(id)?.name || id;
    const items = [];
    const ok = (text) => items.push({ icon: 'ok', text });
    const bad = (text, go) => items.push({ icon: 'interference', text, go, bad: true });
    if (c.errors.length) for (const e of c.errors) bad(e); else ok('No rebuild or mate errors.');
    if (c.clashes_rest.length) for (const x of c.clashes_rest) bad(`Clash as assembled: ${nm(x.a)} and ${nm(x.b)} (${fmt(x.volume_mm3, 3)} mm^3).`, () => this.flag([x.a, x.b]));
    else ok('No clashes as assembled.');
    for (const j of c.joints) {
      const u = j.unit === 'mm' ? 'mm' : 'deg';
      const m = this.app.doc.mates.find((x) => x.id === j.id);
      if (j.clashes.length) {
        for (const x of j.clashes) bad(`${j.name}: ${nm(x.a)} hits ${nm(x.b)} at ${fmt(x.value, 1)} ${u} (${fmt(x.volume_mm3, 3)} mm^3).`, () => { this.goTo(j.id, x.value); this.flag([x.a, x.b]); });
      } else ok(`${j.name}: clear through ${fmt(j.reached[0], 1)} to ${fmt(j.reached[1], 1)} ${u} (${j.poses_checked} poses).`);
      if (m) {
        const [lo, hi] = jointRange(m);
        if ((j.reached[0] != null && Math.abs(j.reached[0] - lo) > 1e-3) || (j.reached[1] != null && Math.abs(j.reached[1] - hi) > 1e-3)) {
          bad(`${j.name}: only reaches ${fmt(j.reached[0], 2)} to ${fmt(j.reached[1], 2)} ${u}, not ${fmt(lo, 2)} to ${fmt(hi, 2)}.`, () => this.goTo(j.id, j.reached[1]));
        }
      }
      for (const x of j.unreached || []) bad(`${j.name}: mates fail at ${fmt(x.value, 1)} ${u}.`, () => this.goTo(j.id, x.value));
      if (j.closest) items.push({ icon: 'measure', text: `${j.name}: smallest gap ${fmt(j.closest.mm, 3)} mm, ${nm(j.closest.a)} to ${nm(j.closest.b)} at ${fmt(j.closest.value, 1)} ${u}.`, go: () => { this.goTo(j.id, j.closest.value); this.flag([j.closest.a, j.closest.b], 0x2a8cff); } });
    }
    for (const k of c.contacts || []) {
      const u = k.unit === 'mm' ? 'mm' : 'deg';
      const range = k.joint ? ` from ${fmt(k.from, 1)} to ${fmt(k.to, 1)} ${u}` : ' as assembled';
      if (!k.checked) bad(`${k.name}: not checked (no pose in its range).`);
      else if (k.apart.length) bad(`${k.name}: apart at ${k.apart.length} of ${k.checked} poses${range}, up to ${fmt(k.largest_gap_mm, 3)} mm.`, () => { if (k.joint) this.goTo(k.joint, k.apart[0].value); this.flag([k.a, k.b]); });
      else ok(`${k.name}: touching${range} (${k.checked} poses, gap at most ${fmt(k.largest_gap_mm, 3)} mm).`);
    }
    return items;
  }

  renderChecks(row) {
    row.style.flexDirection = 'column'; row.style.alignItems = 'stretch';
    const note = (t) => row.appendChild(Object.assign(document.createElement('div'), { className: 'pm-note', textContent: t }));
    if (this.busy) { note('Solving each joint through its travel and checking for clashes...'); return; }
    if (this.checkError) { const d = document.createElement('div'); d.className = 'pm-msg err'; d.textContent = this.checkError; row.appendChild(d); }
    if (!this.checks) { if (!this.checkError) note('Not run yet.'); return; }
    if (!this.readOnly && this.checksStale()) note('The model changed since these checks. Run them again.');
    const list = document.createElement('div'); list.className = 'mr-checks';
    for (const it of this.checkItems()) {
      const li = document.createElement('div'); li.className = 'mr-check' + (it.bad ? ' bad' : '') + (it.go ? ' go' : '');
      const mark = document.createElement('span'); mark.className = 'mr-mark'; mark.textContent = it.bad ? '!' : it.icon === 'measure' ? '-' : '✓';
      const t = document.createElement('span'); t.textContent = it.text;
      li.append(mark, t);
      if (it.go) { li.title = 'Show this pose'; li.onclick = it.go; }
      list.appendChild(li);
    }
    row.appendChild(list);
  }

  renderChanges(row) {
    row.style.flexDirection = 'column'; row.style.alignItems = 'stretch';
    const s = this.shared;
    const add = (t, cls = '') => row.appendChild(Object.assign(document.createElement('div'), { className: 'mr-change ' + cls, textContent: t }));
    for (const h of s.changes || []) add(`Version ${h.version}${h.by ? ` (${h.by})` : ''}: ${h.summary || ''}`);
    const changed = Object.values(s.parts || {}).filter((p) => p.changed);
    for (const p of changed) add(`${p.name}: ${p.changed}`);
    for (const t of s.mate_changes || []) add(t);
    if (!changed.length && !(s.mate_changes || []).length && s.compare) add('No part or mate changed.', 'pm-note');
  }

  checksStale() { return this.checkedText !== JSON.stringify(this.app.cleanDoc(this.app.doc)); }

  async runChecks() {
    if (this.readOnly) return;
    const app = this.app;
    this.busy = true; this.checkError = null; app.pm.render();
    const doc = app.cleanDoc(app.doc);
    try {
      const r = await app.api('/api/review/check', { doc });
      if (r.error) throw new Error(r.error);
      this.checks = r; this.checkedText = JSON.stringify(doc);
    } catch (err) { this.checkError = 'Could not check: ' + err.message; }
    this.busy = false;
    if (app.cmd?.key === 'motionreview') app.pm.render();
  }

  // ------------------------------------------------------------------ driving the joints
  clampNow(m) {
    const [lo, hi] = jointRange(m);
    const v = jointNow(m, this.work.components);
    return Math.min(hi, Math.max(lo, v ?? lo));
  }

  /** Solve with the joint pinned at v, starting from the last solved pose, and show it. */
  setJoint(id, v) {
    const app = this.app, asm = app.asm;
    this.values[id] = v;
    if (!asm.canSolveLocally(this.work)) {
      if (this.readOnly) return;
      // a part changed since the server last built it: rebuild once, then solve here
      if (!this.rebuilding) this.rebuilding = asm.regen().then(() => { this.rebuilding = null; this.work = app.cleanDoc(app.doc); this.setJoint(id, this.values[id]); });
      return;
    }
    const d = clone(this.work);
    const m = d.mates.find((x) => x.id === id);
    if (!m) return;
    pin(m, v);
    let res;
    try { res = regenLocal(d, asm.partsInfo); } catch (err) { console.error(err); return; }
    for (const c of res.components) {
      const wc = this.work.components.find((x) => x.id === c.id);
      if (wc && !wc.suppressed) { wc.position = c.position; wc.rotation = c.rotation; }
    }
    this.res = res;
    const failed = res.mates.filter((x) => x.state === 'error');
    app.status(failed.length ? `${asm.mate(failed[0].id)?.name || failed[0].id} cannot hold at ${fmt(v, 2)}` : `${m.name || id} at ${fmt(v, 2)} ${jointUnit(m)}`);
    this.draw();
  }

  goTo(id, v) {
    this.stop();
    this.setJoint(id, v);
    const m = this.joints().find((x) => x.id === id);
    m?._show?.();
  }

  play(id, show, btn) {
    this.stop();
    const m = this.joints().find((x) => x.id === id);
    if (!m) return;
    const [lo, hi] = jointRange(m);
    this.playing = id; btn.textContent = 'Stop';
    this.playBtn = btn;
    let v = this.values[id] >= hi - 1e-9 ? lo : this.values[id], dir = 1;
    const span = hi - lo, t0 = performance.now();
    let last = t0;
    const step = (now) => {
      if (this.playing !== id) return;
      v += dir * span * Math.min(0.05, (now - last) / 2500);  // the whole travel in about 2.5 s
      last = now;
      if (v >= hi) { v = hi; dir = -1; }
      if (v <= lo) { v = lo; dir = 1; }
      this.setJoint(id, v); show();
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  stop() {
    this.playing = null;
    cancelAnimationFrame(this.raf);
    if (this.playBtn) { this.playBtn.textContent = 'Play'; this.playBtn = null; }
  }

  flag(ids, color = CLASH) {
    this.flagged = new Set(ids);
    this.flagColor = color;
    this.draw();
  }

  draw() {
    const app = this.app, asm = app.asm;
    const res = this.res || asm.res;
    if (!res) return;
    const changed = new Set();
    if (this.shared && this.showChanged) for (const [pid, p] of Object.entries(this.shared.parts || {})) if (p.changed) changed.add(pid);
    asm.colorOverride = (c) => (this.flagged.has(c.id) ? this.flagColor : changed.has(c.part) ? CHANGED : null);
    asm.draw(res, this.work || app.doc);
    asm.colorOverride = null;
  }

  close() {
    this.stop();
    this.flagged = new Set();
    this.res = null;
    this.work = null;
    if (this.readOnly) return;
    this.app.asm.draw();  // back to the document's own pose
  }

  // ------------------------------------------------------------------ shared link (read-only)
  async loadShared(token) {
    const app = this.app;
    document.body.classList.add('review-mode');
    document.documentElement.classList.add('review-mode');
    let data;
    try {
      const r = await fetch(`${encodeURIComponent(token)}/data`);
      if (!r.ok) throw new Error(r.status === 404 ? 'This review was deleted or the link is wrong.' : `The server answered ${r.status}.`);
      data = await r.json();
    } catch (err) {
      app.status(String(err.message || err));
      document.getElementById('doctitle').textContent = 'Review not found';
      app.toast(String(err.message || err));
      return;
    }
    this.shared = data;
    this.checks = { checks: data.checks, joints: data.joints, names: data.names };
    document.title = `${data.title} - OpenSketch review`;
    app.doc = data.doc;
    app.asm.remember(data.result, app.cleanDoc(app.doc));
    app.asm.apply(data.result);
    app.updateDocChrome();
    document.getElementById('doctitle').textContent = `${data.title} (version ${data.version}, read-only)`;
    app.viewer.zoomToFit(false);
    this.drawGhost();
    this.open();
  }

  drawGhost() {
    const v = this.app.viewer;
    if (!this.ghost) { this.ghost = new THREE.Group(); v.scene.add(this.ghost); }
    v.clearGroup(this.ghost);
    if (this.showGhost && this.shared?.old?.length) {
      const mat = new THREE.MeshBasicMaterial({ color: 0x7a8794, transparent: true, opacity: 0.18, depthWrite: false });
      for (const o of this.shared.old) {
        const g = new THREE.Group();
        g.matrixAutoUpdate = false;
        const M = o.matrix;
        g.matrix.set(...M);
        for (const f of o.body.faces) {
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(f.positions, 3));
          geo.setIndex(f.indices);
          g.add(new THREE.Mesh(geo, mat));
        }
        const lm = new THREE.LineBasicMaterial({ color: 0x7a8794, transparent: true, opacity: 0.5 });
        for (const e of o.body.edges) {
          const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(e.points, 3));
          g.add(new THREE.Line(geo, lm));
        }
        this.ghost.add(g);
      }
    }
    v.requestRender();
  }
}
