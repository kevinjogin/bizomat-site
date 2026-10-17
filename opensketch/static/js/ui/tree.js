// FeatureManager design tree: planes, origin, features with absorbed sketches, rollback bar.

import { icon } from '../icons.js';
import { featureIcon } from '../features.js';
import { featureSketchIds } from '../model-utils.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

export class FeatureTree {
  constructor(app) {
    this.app = app;
    this.el = document.getElementById('tree');
    this.filter = document.getElementById('treefilter');
    this.expanded = new Set();
    this.filter.addEventListener('input', () => this.render());
    this.filter.addEventListener('keydown', (e) => e.stopPropagation());
    this.el.addEventListener('keydown', (e) => {
      if (e.key === 'F2') { const s = this.app.selection.find((x) => ['feature', 'sketch', 'component', 'mate'].includes(x.kind)); if (s) { e.preventDefault(); this.rename(s.id); } }
    });
  }

  // which feature absorbs each sketch (first consumer)
  absorbers(doc) {
    const m = new Map();
    for (const f of doc.features) for (const sid of featureSketchIds(f)) if (!m.has(sid)) m.set(sid, f.id);
    return m;
  }

  badgeIcon(name) { return icon(name, 13); }
  featureIcon(f) { return featureIcon(f); }

  render() {
    const app = this.app, doc = app.shownDoc;
    const status = app.statusById || {};
    const q = this.filter.value.trim().toLowerCase();
    const selKeys = new Set(app.selection.map((s) => `${s.kind}:${s.id}`));
    this.el.innerHTML = '';
    const node = ({ id, kind, name, ic, depth = 0, twisty = null, cls = '', badge = '', onDbl = null, data = null, onTwisty = null }) => {
      name = String(name ?? id);
      if (q && !name.toLowerCase().includes(q)) return null;
      const n = h('div', 'tn ' + cls + (selKeys.has(`${kind}:${id}`) ? ' selected' : ''));
      n.style.paddingLeft = 4 + depth * 14 + 'px';
      const tw = h('span', 'tw', twisty === null ? '' : twisty ? '&#9660;' : '&#9654;');
      if (twisty !== null) tw.onclick = (e) => { e.stopPropagation(); if (onTwisty) return onTwisty(); this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id); this.render(); };
      n.appendChild(tw);
      n.insertAdjacentHTML('beforeend', icon(ic, 16));
      const nm = h('span', 'nm'); nm.textContent = name; n.appendChild(nm);
      if (badge) n.appendChild(h('span', 'badge', badge));
      n.onclick = (e) => app.treeClick({ kind, id, data }, e, n);
      n.ondblclick = (e) => { e.stopPropagation(); if (onDbl) onDbl(); };
      n.oncontextmenu = (e) => { e.preventDefault(); app.treeContext({ kind, id, data }, e); };
      n.onmouseenter = () => app.treeHover({ kind, id });
      n.onmouseleave = () => app.treeHover(null);
      n.dataset.key = `${kind}:${id}`;
      this.el.appendChild(n);
      return n;
    };
    if (app.isAsm) return app.asm.renderTree(this, node);
    const bodies = app.result?.body?.faces?.length ? 1 : 0;
    node({ id: 'root', kind: 'root', name: `${doc.name} (Default<<Default>_Display State 1>)`, ic: 'part', cls: 'root' });
    node({ id: 'history', kind: 'folder', name: 'History', ic: 'history', depth: 1, twisty: false });
    node({ id: 'sensors', kind: 'folder', name: 'Sensors', ic: 'sensor', depth: 1 });
    node({ id: 'annotations', kind: 'folder', name: 'Annotations', ic: 'annotations', depth: 1, twisty: false });
    node({ id: 'bodies', kind: 'folder', name: `Solid Bodies(${bodies})`, ic: 'bodies', depth: 1, twisty: false });
    node({ id: 'material', kind: 'material', name: doc.material?.name ? doc.material.name : 'Material <not specified>', ic: 'material', depth: 1, onDbl: () => app.materialDialog() });
    for (const p of ['Front Plane', 'Top Plane', 'Right Plane']) node({ id: p, kind: 'plane', name: p, ic: 'plane_t', depth: 1 });
    node({ id: 'origin', kind: 'origin', name: 'Origin', ic: 'origin', depth: 1 });

    const abs = this.absorbers(doc);
    const rb = doc.rollback ?? doc.features.length;
    const proposed = new Set(app.proposedIds || []);
    let placedBar = false;
    const bar = () => {
      const b = h('div', 'rollbar'); b.title = 'Rollback bar: drag to roll the model back';
      b.addEventListener('pointerdown', (e) => this.dragRollback(e, b));
      this.el.appendChild(b);
      placedBar = true;
    };
    doc.features.forEach((f, i) => {
      if (i === rb && !placedBar) bar();
      if (f.type === 'sketch' && abs.has(f.id)) return; // drawn under its feature
      const st = status[f.id];
      const state = i >= rb ? 'rolledback' : f.suppressed ? 'suppressed' : st?.state || 'ok';
      const badge = state === 'error' ? icon('error', 13) : state === 'warning' ? icon('warning', 13) : '';
      const kind = f.type === 'sketch' ? 'sketch' : f.type === 'plane' ? 'plane' : 'feature';
      const kids = doc.features.filter((s) => s.type === 'sketch' && abs.get(s.id) === f.id);
      const open = this.expanded.has(f.id);
      const n = node({ id: f.id, kind, name: f.name, ic: featureIcon(f), depth: 1, twisty: kids.length ? open : null,
        cls: `${state}${proposed.has(f.id) ? ' proposed' : ''}`, badge, onDbl: () => app.editFeature(f.id) });
      if (n && st?.message) n.title = st.message;
      if (open) for (const s of kids) {
        const ss = status[s.id];
        const si = doc.features.indexOf(s);
        const sstate = si >= rb ? 'rolledback' : s.suppressed ? 'suppressed' : ss?.state || 'ok';
        const sn = node({ id: s.id, kind: 'sketch', name: (app.sketchDefinedPrefix(s) || '') + s.name, ic: 'sketch_t', depth: 2, cls: sstate, onDbl: () => app.editSketch(s.id) });
        void sn;
      }
    });
    if (!placedBar) bar();
  }

  dragRollback(e, bar) {
    e.preventDefault(); e.stopPropagation();
    bar.classList.add('drag');
    const rows = [...this.el.querySelectorAll('.tn')].filter((r) => /^(feature|sketch|plane):/.test(r.dataset.key) && !['plane:Front Plane', 'plane:Top Plane', 'plane:Right Plane'].includes(r.dataset.key));
    const doc = this.app.doc;
    let target = null;
    const mv = (ev) => {
      // index = number of top-level rows above the cursor
      let n = 0;
      for (const r of rows) { const rr = r.getBoundingClientRect(); if (ev.clientY > rr.top + rr.height / 2) n = r; }
      target = n;
      for (const r of rows) r.style.borderBottom = '';
      if (n) n.style.borderBottom = '3px solid #3c6fd1';
    };
    const up = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      bar.classList.remove('drag');
      if (target === null) return;
      let idx = 0;
      if (target) {
        const id = target.dataset.key.split(':').slice(1).join(':');
        const fi = doc.features.findIndex((f) => f.id === id);
        // a nested sketch belongs to its feature; roll to after that feature
        idx = fi + 1;
        const abs = this.absorbers(doc);
        for (const [sid, fid] of abs) if (sid === id) idx = doc.features.findIndex((f) => f.id === fid) + 1;
      }
      this.app.setRollback(idx >= doc.features.length ? null : idx);
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  }

  rename(id) {
    const f = this.app.isAsm ? (this.app.asm.comp(id) || this.app.asm.mate(id)) : this.app.featureById(id);
    const row = this.el.querySelector(`[data-key$=":${CSS.escape(id)}"] .nm`);
    if (!f || !row) return;
    row.contentEditable = 'true'; row.classList.add('rename');
    row.textContent = f.name;
    const range = document.createRange(); range.selectNodeContents(row);
    const s = window.getSelection(); s.removeAllRanges(); s.addRange(range);
    row.focus();
    const done = (ok) => {
      row.contentEditable = 'false';
      const v = row.textContent.trim();
      if (ok && v && v !== f.name) this.app.commit('Rename', () => { const t = this.app.isAsm ? (this.app.doc.components.find((c) => c.id === id) || this.app.doc.mates.find((m) => m.id === id)) : this.app.featureById(id); t.name = v; }, false);
      else this.render();
    };
    row.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); done(true); } if (e.key === 'Escape') done(false); };
    row.onblur = () => done(true);
  }
}
