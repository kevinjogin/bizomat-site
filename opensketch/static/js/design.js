// Design panel (Task Pane, first tab): the numbers that shape what is selected, Figma style.
// Click a face, a feature, a sketch or a component and its driving numbers appear: sketch dimensions,
// feature depths / radii / counts, mate distances and global variables. Drag a label (scrub, like
// Figma) or the slider, or type a value: the sketch dimension itself changes, the sketch is re-solved
// in the browser, and the model rebuilds live. One drag or one typed value = one undo step.
// "Ask AI" at the bottom sends a request about the selection to the copilot.

import { icon } from './icons.js';
import { SPECS, featureIcon } from './features.js';
import { solveSketch } from './sketch/solver.js';
import { evalExpr } from './ui/pm.js';
import { featureSketchIds } from './model-utils.js';

const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const NUM_KINDS = new Set(['length', 'angle', 'number', 'int']);
const DIM_TYPES = { distance: 'Distance', diameter: 'Diameter', radius: 'Radius', angle: 'Angle' };
const AUTO_KEY = 'opensketch.design.auto';
const round = (v, step) => { const d = Math.max(0, Math.min(6, -Math.floor(Math.log10(step)) + 1)); return +v.toFixed(d); };
const show = (v) => (Number.isFinite(v) ? String(+(+v).toFixed(4)) : '');
const niceUp = (v) => { if (v <= 0) return 10; const p = 10 ** Math.floor(Math.log10(v)); for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= v) return m * p; return 10 * p; };
const getPath = (o, path) => path.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const setPath = (o, path, v) => { const ks = path.split('.'); const last = ks.pop(); const t = ks.reduce((a, k) => (a[k] ??= {}), o); t[last] = v; };

// Scrub sensitivity per pixel, from the value's size (Figma: 1 unit/px; here 0.1 mm/px for everyday sizes).
function stepFor(kind, v) {
  if (kind === 'int') return 1;
  if (kind === 'angle') return 0.5;
  const a = Math.abs(v || 0);
  return a >= 200 ? 1 : a >= 2 ? 0.1 : 0.01;
}

export class DesignPanel {
  constructor(app) {
    this.app = app;
    this.faceInfo = null;      // {key, feature, entity, role} for the selected face (from /api/face_owner)
    this.editing = null;       // an open undo step while a value is being changed
    this.dragging = false;
    this.collapsed = new Set();
    this.rebuild = { pending: false, running: false };
    try { this.auto = localStorage.getItem(AUTO_KEY) !== '0'; } catch (_) { this.auto = true; }
  }

  setAuto(on) { this.auto = on; try { localStorage.setItem(AUTO_KEY, on ? '1' : '0'); } catch (_) { /* ignore */ } }

  // ------------------------------------------------------------------ what is selected
  // The part being shown (the open part, or the selected component's part in an assembly) and the items.
  context() {
    const app = this.app, doc = app.shownDoc;
    const sel = app.selection || [];
    if (app.isAsm) {
      const mate = sel.find((s) => s.kind === 'mate');
      if (mate) {
        const m = (doc.mates || []).find((x) => x.id === mate.id);
        if (m) return { kind: 'mate', mate: m, title: m.name || m.id, sub: 'Mate', icon: 'mate' };
      }
      const c = sel.find((s) => s.kind === 'component');
      const comp = c && (doc.components || []).find((x) => x.id === c.id);
      if (!comp) return { kind: 'assembly', title: doc.name, sub: 'Assembly', icon: 'assembly' };
      const part = doc.parts?.[comp.part];
      if (!part) return { kind: 'assembly', title: doc.name, sub: 'Assembly', icon: 'assembly' };
      return { kind: 'part', part, pid: comp.part, comp, title: comp.name, sub: `Component of ${part.name || comp.part}`, icon: 'part', focus: [], all: true };
    }
    const part = doc;
    const ids = [];
    let title = part.name, sub = 'Part', ic = 'part', face = null;
    for (const s of sel) {
      if (s.kind === 'feature' || s.kind === 'sketch' || s.kind === 'plane') {
        const f = (part.features || []).find((x) => x.id === s.id);
        if (f) ids.push(f.id);
      }
      if (s.kind === 'face') face = s;
    }
    const pin = !face && this.pinned && ids.length === 1 && ids[0] === this.pinned.feature ? this.pinned : null;
    if (face || pin) {
      const fi = pin || (this.faceInfo && this.faceInfo.key === this.faceKey(face) ? this.faceInfo : null);
      const f = fi?.feature && part.features.find((x) => x.id === fi.feature);
      sub = 'Face';
      title = f ? `Face of ${f.name}` : 'Face';
      ic = 'face';
      if (f && !pin) ids.unshift(f.id);
      else if (!fi) this.lookUpFace(face);
      face = fi || face;
    }
    const sk = new Set();
    for (const id of ids) {
      const f = part.features.find((x) => x.id === id);
      if (f.type === 'sketch') { for (const g of part.features) if (featureSketchIds(g).includes(f.id)) sk.add(g.id); } else for (const s of featureSketchIds(f)) sk.add(s);
    }
    const focus = [...new Set([...ids, ...sk])];
    if (ids.length && !face && !pin) {
      const f = part.features.find((x) => x.id === ids[0]);
      title = ids.length > 1 ? `${ids.length} items` : f.name; sub = f.type === 'sketch' ? 'Sketch' : (SPECS[f.type]?.title || f.type); ic = featureIcon(f);
    }
    return { kind: 'part', part, pid: null, title, sub, icon: ic, focus, all: !focus.length, face: pin || (face && face === this.faceInfo ? this.faceInfo : null) };
  }

  faceKey(face) { const d = this.faceData(face); return d ? d.center.map((c) => c.toFixed(4)).join(',') : String(face.id); }
  faceData(face) { return face.data?.center ? face.data : this.app.viewer.bodyData?.faces?.[face.id] || null; }

  async lookUpFace(face) {
    const d = this.faceData(face);
    if (!d) return;
    const key = this.faceKey(face);
    if (this.faceLookup === key) return;
    this.faceLookup = key;
    try {
      const r = await this.app.api('/api/face_owner', { doc: this.app.cleanDoc(this.app.shownDoc), center: d.center, normal: d.normal || null });
      this.faceInfo = { key, ...r };
    } catch (_) { this.faceInfo = { key, feature: null }; }
    this.faceLookup = null;
    if (this.isOpen()) this.refresh();
  }

  isOpen() { return this.app.taskpane.open === 'design'; }

  // Called on every selection change: open the panel (unless the user closed it), or redraw it.
  onSelection() {
    const app = this.app;
    if (this.dragging) return;
    this.pinned = null;
    const sel = app.selection || [];
    const useful = sel.some((s) => ['face', 'feature', 'sketch', 'component', 'mate', 'plane'].includes(s.kind) && !['Front Plane', 'Top Plane', 'Right Plane'].includes(s.id));
    if (useful && this.auto && !app.cmd && app.mode !== 'sketch' && !app.live?.active && (app.taskpane.open === null || app.taskpane.open === 'design')) {
      if (!this.isOpen()) { app.taskpane.show('design'); return; }
    }
    if (this.isOpen()) this.refresh();
  }

  refresh() { if (this.isOpen() && !this.dragging) this.app.taskpane.render(); }

  // ------------------------------------------------------------------ drawing
  render(body) {
    const app = this.app;
    this.body = body;
    body.classList.add('dp');
    const ctx = this.context();
    this.ctx = ctx;
    const head = h('div', 'dp-sel');
    head.insertAdjacentHTML('beforeend', icon(ctx.icon, 16));
    const t = h('div', 'dp-sel-t'); t.append(h('b', null, ctx.title), h('span', null, ctx.sub));
    head.appendChild(t);
    body.appendChild(head);

    const blocked = app.proposal ? 'Accept or reject the AI proposal first.' : app.mode === 'sketch' ? 'You are editing a sketch. Use Smart Dimension, or exit the sketch to change numbers here.'
      : app.cmd?.spec ? 'Finish or cancel the open command first.' : app.live?.active ? 'The AI is building. Numbers can be changed when it finishes.' : '';
    this.locked = !!blocked;
    if (blocked) body.appendChild(h('div', 'dp-note', blocked));

    if (ctx.kind === 'mate') this.mateSection(body, ctx.mate);
    else if (ctx.kind === 'assembly') body.appendChild(h('div', 'dp-empty', 'Select a component to change the numbers of its part, or a mate to change its distance or angle.'));
    else this.partSections(body, ctx);

    this.askBox();
  }

  partSections(body, ctx) {
    const part = ctx.part;
    const feats = (part.features || []).filter((f) => this.rowsFor(part, f).length);
    if (ctx.face && ctx.face.feature) body.appendChild(h('div', 'dp-hint', ctx.face.entity ? 'Numbers that shape this face come first and are marked.' : 'The feature that made this face comes first.'));
    else if (!ctx.focus.length && this.faceLookup) body.appendChild(h('div', 'dp-hint', 'Finding the feature that made this face...'));
    const focus = ctx.focus.map((id) => feats.find((f) => f.id === id)).filter(Boolean);
    for (const f of focus) this.section(body, part, f, true);
    const rest = feats.filter((f) => !ctx.focus.includes(f.id));
    if (focus.length && rest.length) body.appendChild(h('div', 'dp-group', 'Other features'));
    for (const f of rest) this.section(body, part, f, ctx.all && rest.length <= 6);
    if (!feats.length) body.appendChild(h('div', 'dp-empty', 'Nothing to change here yet. Dimensions you add to sketches and the depths of features show up in this panel.'));
    const vars = (part.parameters || []).filter((p) => Number.isFinite(Number(p.expression)));
    if (vars.length) {
      const sec = this.sectionShell(body, 'vars', 'Variables', 'equations', true);
      for (const p of vars) this.row(sec, { label: p.name, sub: p.comment || 'Global variable', kind: p.unit === 'deg' ? 'angle' : 'length', unit: p.unit === 'deg' ? '°' : p.unit === 'none' ? '' : 'mm',
        get: () => Number(p.expression), set: (v) => { p.expression = String(v); return true; }, min: null, max: null, undo: `Change ${p.name}` });
    }
  }

  sectionShell(body, key, title, ic, open, mark = false) {
    const sec = h('div', 'dp-sec' + (this.collapsed.has(key) || (!open && !this.collapsed.has('!' + key)) ? ' collapsed' : '') + (mark ? ' focus' : ''));
    const hd = h('div', 'dp-sec-h');
    hd.insertAdjacentHTML('beforeend', icon(ic, 14));
    hd.appendChild(h('span', 'dp-sec-t', title));
    hd.appendChild(h('span', 'chev', ''));
    hd.onclick = () => {
      const isC = sec.classList.toggle('collapsed');
      if (isC) { this.collapsed.add(key); this.collapsed.delete('!' + key); } else { this.collapsed.delete(key); this.collapsed.add('!' + key); }
    };
    sec.appendChild(hd);
    const b = h('div', 'dp-sec-b');
    sec.appendChild(b);
    body.appendChild(sec);
    return b;
  }

  section(body, part, f, open) {
    const rows = this.rowsFor(part, f);
    const face = this.ctx.face;
    const marked = face && face.feature && (f.id === face.feature || f.id === face.sketch);
    const b = this.sectionShell(body, f.id, f.name, featureIcon(f), open || marked, marked);
    const hot = face && face.entity && f.id === face.sketch ? this.entityRefs(f, face.entity) : null;
    const sorted = hot ? [...rows].sort((a, c) => (c.refs?.some((r) => hot.has(r)) ? 1 : 0) - (a.refs?.some((r) => hot.has(r)) ? 1 : 0)) : rows;
    for (const r of sorted) this.row(b, { ...r, hot: !!(hot && r.refs?.some((x) => hot.has(x))) || (marked && f.id === face.feature && r.facePart) });
  }

  // A sketch curve and its points: dimensions on any of them shape the face it made.
  entityRefs(sketch, eid) {
    const e = (sketch.entities || []).find((x) => x.id === eid);
    const s = new Set([eid]);
    if (e) for (const k of ['p1', 'p2', 'center', 'start', 'end']) if (e[k]) s.add(e[k]);
    return s;
  }

  rowsFor(part, f) {
    if (f.type === 'sketch') {
      return (f.constraints || []).filter((c) => DIM_TYPES[c.type] && Number.isFinite(c.value)).map((c) => ({
        label: c.name || c.id, sub: DIM_TYPES[c.type] + (c.orient && c.orient !== 'aligned' ? ` (${c.orient})` : ''), kind: c.type === 'angle' ? 'angle' : 'length',
        unit: c.type === 'angle' ? '°' : 'mm', refs: c.refs, readonly: c.driven ? 'Driven dimension' : c.eq ? `Driven by an equation: = ${c.eq}` : '',
        get: () => c.value, set: (v) => this.setDimension(f, c, v), min: c.type === 'angle' ? 0.01 : 1e-3, max: c.type === 'angle' ? 359.99 : null,
        undo: `Change ${c.name || c.id}@${f.name}`,
      }));
    }
    const spec = SPECS[f.type];
    if (!spec) return [];
    const out = [];
    const shown = (p) => !p.when || Object.entries(p.when).every(([k, vals]) => vals.includes(f[k] ?? spec.params.find((q) => q.name === k)?.default));
    for (const p of spec.params) {
      if (!NUM_KINDS.has(p.kind) || !shown(p)) continue;
      const v = f[p.name] ?? p.default;
      if (!Number.isFinite(v)) continue;
      out.push(this.paramRow(f, p, p.name, v));
    }
    if (f.type === 'extrude' && f.dir2 && ['blind', 'midplane'].includes(f.dir2.end) && Number.isFinite(f.dir2.depth)) {
      out.push(this.paramRow(f, { kind: 'length', label: 'Depth (Direction 2)', min: 0 }, 'dir2.depth', f.dir2.depth));
    }
    return out;
  }

  paramRow(f, p, path, v) {
    let label = p.label || (p.doc || p.name || path).replace(/\.$/, '');
    if (label.length > 22) label = label.split(/ of | \(|, /)[0];
    return { label: label.length > 26 ? label.slice(0, 25) + '...' : label, title: p.doc || label, sub: '', kind: p.kind, unit: p.kind === 'angle' ? '°' : p.kind === 'length' ? 'mm' : '',
      readonly: f.eq?.[path] ? `Driven by an equation: = ${f.eq[path]}` : '', get: () => getPath(f, path) ?? v, set: (nv) => { setPath(f, path, nv); return true; },
      min: p.min ?? (p.kind === 'length' ? 0 : null), max: p.max ?? null, facePart: path === 'depth' || path === 'radius' || path === 'distance' || path === 'thickness', undo: `Change ${label}@${f.name}` };
  }

  mateSection(body, m) {
    const b = this.sectionShell(body, 'mate:' + m.id, m.name || m.id, 'mate', true);
    const rows = [];
    const unit = m.type === 'angle' || m.type === 'limit_angle' || m.type === 'hinge' ? '°' : 'mm';
    const kind = unit === '°' ? 'angle' : 'length';
    for (const [k, label] of [['value', m.type === 'angle' ? 'Angle' : 'Distance'], ['min', 'Minimum'], ['max', 'Maximum'], ['angle_min', 'Minimum angle'], ['angle_max', 'Maximum angle']]) {
      if (!Number.isFinite(m[k])) continue;
      rows.push({ label, sub: '', kind: k.startsWith('angle') ? 'angle' : kind, unit: k.startsWith('angle') ? '°' : unit, get: () => m[k], set: (v) => { m[k] = v; return true; }, min: null, max: null, undo: `Change ${m.name || m.id}` });
    }
    if (!rows.length) b.appendChild(h('div', 'dp-empty', 'This mate has no numbers to change.'));
    for (const r of rows) this.row(b, r);
  }

  // One property row: scrubbable label | slider | number field.
  row(parent, r) {
    const row = h('div', 'dp-row' + (r.readonly || this.locked ? ' ro' : '') + (r.hot ? ' hot' : ''));
    const lab = h('div', 'dp-lab');
    lab.append(h('span', 'dp-name', r.label));
    if (r.sub) lab.append(h('span', 'dp-sub', r.sub));
    lab.title = r.readonly || r.title || (this.locked ? '' : 'Drag left or right to change. Shift: faster, Alt: finer.');
    const v0 = r.get();
    const lo = Number.isFinite(r.min) ? r.min : 0;
    const hi = Number.isFinite(r.max) ? r.max : niceUp(Math.max(Math.abs(v0) * 2.5, lo + 10));
    const slider = h('input', 'dp-slider'); slider.type = 'range';
    slider.min = String(lo); slider.max = String(hi); slider.step = String(stepFor(r.kind, v0));
    slider.value = String(v0);
    slider.setAttribute('aria-label', r.label);
    const field = h('div', 'dp-field');
    const inp = h('input'); inp.value = show(v0); inp.setAttribute('aria-label', r.label + ' value'); inp.spellcheck = false;
    field.append(inp);
    if (r.unit) field.append(h('span', 'dp-unit', r.unit));
    row.append(lab, slider, field);
    parent.appendChild(row);
    const fill = () => { const v = r.get(); slider.style.setProperty('--p', `${Math.max(0, Math.min(100, ((v - lo) / (hi - lo || 1)) * 100))}%`); };
    fill();
    if (r.readonly || this.locked) { slider.disabled = true; inp.readOnly = true; if (r.readonly) row.appendChild(h('span', 'dp-fx', r.readonly.startsWith('Driven by') ? 'fx' : 'driven')); return; }

    const clamp = (v) => {
      if (Number.isFinite(r.min)) v = Math.max(r.min, v);
      if (Number.isFinite(r.max)) v = Math.min(r.max, v);
      return r.kind === 'int' ? Math.round(v) : v;
    };
    const apply = (v) => {
      v = clamp(v);
      if (!Number.isFinite(v) || v === r.get()) return;
      this.begin(r.undo);
      if (r.set(v) === false) { row.classList.add('bad'); setTimeout(() => row.classList.remove('bad'), 600); this.app.status("The sketch cannot be solved at that value. It was left as it was."); return; }
      row.classList.remove('bad');
      inp.value = show(r.get()); slider.value = String(r.get()); fill();
      this.scheduleRebuild();
    };

    // scrub the label (Figma: drag a property's label)
    lab.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      lab.setPointerCapture(e.pointerId);
      const start = r.get(), base = stepFor(r.kind, start);
      let acc = 0;
      this.dragging = true;
      document.body.classList.add('dp-scrubbing');
      const mv = (ev) => {
        acc += ev.movementX;
        const mul = ev.shiftKey ? 10 : ev.altKey ? 0.1 : 1;
        const step = base * mul;
        apply(round(start + Math.round(acc) * step, step));
      };
      const up = () => {
        lab.removeEventListener('pointermove', mv); lab.removeEventListener('pointerup', up); lab.removeEventListener('pointercancel', up);
        document.body.classList.remove('dp-scrubbing');
        this.dragging = false;
        this.end();
      };
      lab.addEventListener('pointermove', mv); lab.addEventListener('pointerup', up); lab.addEventListener('pointercancel', up);
    });

    // slider
    slider.addEventListener('pointerdown', () => { this.dragging = true; });
    slider.addEventListener('input', () => apply(+slider.value));
    slider.addEventListener('change', () => { this.dragging = false; this.end(); });
    slider.addEventListener('keydown', (e) => e.stopPropagation());

    // typed value (expressions and units allowed, like the PropertyManager)
    let before = inp.value;
    inp.addEventListener('focus', () => { before = inp.value; inp.select(); });
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Enter') { inp.blur(); return; }
      if (e.key === 'Escape') { inp.value = before; inp.blur(); return; }
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const step = stepFor(r.kind, r.get()) * (e.shiftKey ? 100 : 10);
        apply(round(r.get() + (e.key === 'ArrowUp' ? step : -step), step));
        this.end();
      }
    });
    inp.addEventListener('change', () => {
      const v = r.kind === 'angle' ? evalExpr(inp.value.replace(/°/g, '')) : evalExpr(inp.value);
      if (!Number.isFinite(v)) { inp.value = show(r.get()); return; }
      apply(v); this.end(); inp.value = show(r.get());
    });
  }

  // Sketch dimension: solve a copy first; only a solvable result is kept (no broken sketches).
  setDimension(sketch, c, v) {
    const copy = JSON.parse(JSON.stringify(sketch));
    const cc = copy.constraints.find((x) => x.id === c.id);
    cc.value = v;
    const res = solveSketch(copy);
    if (!res.ok || res.status === 'over') return false;
    sketch.entities = copy.entities;
    c.value = v;
    return true;
  }

  // ------------------------------------------------------------------ undo + rebuild
  begin(label) {
    if (this.editing) return;
    this.editing = label;
    this.app.pushUndo(label);
    // Faces and edges are picked by index, and a rebuild renumbers them: keep the panel on the face's
    // feature (marked as before) and select that feature instead of a face that will move away.
    const app = this.app, sel = app.selection || [];
    if (sel.some((s) => s.kind === 'face' || s.kind === 'edge')) {
      const face = sel.find((s) => s.kind === 'face');
      const fi = face && this.faceInfo && this.faceInfo.key === this.faceKey(face) ? this.faceInfo : null;
      if (fi?.feature) this.pinned = fi;
      app.selection = [...sel.filter((s) => s.kind !== 'face' && s.kind !== 'edge'), ...(fi?.feature ? [{ kind: 'feature', id: fi.feature }] : [])];
      app.refreshSelectionDisplay();
      app.tree.render();
    }
  }

  end() {
    if (!this.editing) return;
    this.app.status(this.editing);
    this.editing = null;
    this.app.docChanged();
    this.scheduleRebuild();
  }

  // Live rebuild: one request in flight; the newest value wins.
  scheduleRebuild() {
    const st = this.rebuild;
    st.pending = true;
    if (st.running) return;
    st.running = true;
    (async () => {
      while (st.pending) {
        st.pending = false;
        try { await this.app.regen(); } catch (_) { /* reported by regen */ }
      }
      st.running = false;
    })();
  }

  // ------------------------------------------------------------------ Ask AI about the selection
  askBox() {
    const app = this.app;
    const box = h('div', 'dp-ask');
    const ta = h('textarea');
    ta.placeholder = this.ctx.kind === 'assembly' ? 'Ask AI to change the assembly...' : `Ask AI to change ${this.ctx.title}...`;
    ta.rows = 2;
    ta.setAttribute('aria-label', 'Ask AI about the selection');
    ta.value = this.askDraft || '';
    ta.oninput = () => { this.askDraft = ta.value; };
    const go = () => {
      const text = ta.value.trim();
      if (!text) return;
      this.askDraft = '';
      app.taskpane.send(text, { selection: this.describeSelection() });
    };
    ta.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); } });
    const b = h('button', 'btn primary dp-ask-go');
    b.innerHTML = icon('ai', 14); b.title = 'Send to OpenSketch AI (Enter)'; b.setAttribute('aria-label', 'Send to OpenSketch AI');
    b.onclick = go;
    box.append(ta, b);
    this.app.taskpane.panel.appendChild(box);
    if (app.taskpane.busy) { ta.disabled = true; b.disabled = true; ta.placeholder = 'The AI is working...'; }
  }

  // The selection as data for the AI (ai.selection_note): what each item is, with refs it can reuse.
  describeSelection(list = this.app.selection) {
    const app = this.app, doc = app.shownDoc;
    const out = [];
    const r3 = (a) => (a ? a.map((x) => +(+x).toFixed(4)) : undefined);
    for (const s of list || []) {
      if (s.kind === 'feature' || s.kind === 'sketch' || s.kind === 'plane') {
        const f = (doc.features || []).find((x) => x.id === s.id);
        if (f) out.push({ kind: f.type === 'sketch' ? 'sketch' : 'feature', id: f.id, name: f.name, type: f.type });
      } else if (s.kind === 'face') {
        const d = this.faceData(s) || {};
        const fi = this.faceInfo && this.faceInfo.key === this.faceKey(s) ? this.faceInfo : {};
        const f = fi.feature && (doc.features || []).find((x) => x.id === fi.feature);
        out.push({ kind: 'face', type: d.type, area: d.area && +d.area.toFixed(2), feature: fi.feature || undefined, feature_name: f?.name, role: fi.role || undefined,
          entity: fi.entity || undefined, sketch: fi.sketch || undefined, ref: { ...(fi.name ? { name: fi.name } : {}), center: r3(d.center), ...(d.normal ? { normal: r3(d.normal) } : {}) } });
      } else if (s.kind === 'edge') {
        const e = app.edgeData(s.id) || s.data || {};
        out.push({ kind: 'edge', type: e.type, ref: { mid: r3(e.mid) } });
      } else if (s.kind === 'component') {
        const c = (doc.components || []).find((x) => x.id === s.id);
        if (c) out.push({ kind: 'component', id: c.id, name: c.name, part: c.part });
      } else if (s.kind === 'mate') {
        const m = (doc.mates || []).find((x) => x.id === s.id);
        if (m) out.push({ kind: 'mate', id: m.id, name: m.name, type: m.type });
      }
    }
    return out;
  }
}
