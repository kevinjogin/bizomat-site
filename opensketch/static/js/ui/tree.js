// FeatureManager design tree: planes, origin, features with absorbed sketches, rollback bar.

import { icon } from '../icons.js';
import { featureIcon } from '../features.js';
import { featureSketchIds } from '../model-utils.js';

/** True when the browser filled this field itself (saved email, password manager), not the person. */
export function autofilled(el) {
  for (const sel of [':autofill', ':-webkit-autofill']) { try { if (el.matches(sel)) return true; } catch (_) { /* selector not supported */ } }
  return false;
}

/** An input event the person made by typing, pasting or dictating (an InputEvent), not an autofill. */
export function typedInput(e, el) {
  if (typeof InputEvent !== 'undefined' && !(e instanceof InputEvent)) return false;
  return !autofilled(el);
}

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

export class FeatureTree {
  constructor(app) {
    this.app = app;
    this.el = document.getElementById('tree');
    this.filter = document.getElementById('treefilter');
    this.expanded = new Set();
    // Only words the person types filter the tree. A browser or password manager that drops a saved email into
    // the box (YZ 2026-10-19: the tree showed only "yyz.works@gmail.com") fills it without typing: no InputEvent,
    // or the field matches :autofill. That value is thrown away so the tree never empties by itself.
    this.filter.value = '';
    this.filter.addEventListener('input', (e) => {
      if (this.filter.value && !typedInput(e, this.filter)) this.filter.value = '';
      this.render();
    });
    this.filter.addEventListener('animationstart', (e) => { if (e.animationName === 'os-autofill' && this.filter.value) this.clearFilter(); });
    this.filter.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape' && this.filter.value) { e.preventDefault(); this.clearFilter(); }
    });
    this.el.setAttribute('role', 'tree');
    this.el.setAttribute('aria-multiselectable', 'true');
    if (!this.el.getAttribute('aria-label')) this.el.setAttribute('aria-label', 'FeatureManager design tree');
    this.el.addEventListener('keydown', (e) => this.onKey(e));
    // Tab into the tree: the selected row (or the first) is the one the arrow keys start from
    this.el.addEventListener('focus', () => { if (!this.rowFor(this.cursor)) { this.cursor = (this.el.querySelector('.tn.selected') || this.el.querySelector('.tn'))?.dataset.key; this.markCursor(); } });
  }

  rowFor(key) { return key ? [...this.el.querySelectorAll('.tn')].find((r) => r.dataset.key === key) || null : null; }

  // The row the arrow keys are on (aria-activedescendant): the tree keeps the focus, rows do not take it.
  markCursor() {
    let row = null;
    for (const r of this.el.querySelectorAll('.tn')) { const on = r.dataset.key === this.cursor; r.classList.toggle('cursor', on); if (on) row = r; }
    if (row) this.el.setAttribute('aria-activedescendant', row.id); else this.el.removeAttribute('aria-activedescendant');
    return row;
  }

  // FeatureManager keys, as in SOLIDWORKS: Up / Down / Home / End move through the rows and select them, Right opens
  // a folder or feature, Left closes it or goes to its parent, Shift+F10 opens the row's menu, F2 renames. The
  // arrows never turn the model while the tree has the focus. Delete, Enter, F and the rest go on to the editor.
  onKey(e) {
    if (e.target !== this.el || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'F2') { const s = this.app.selection.find((x) => ['feature', 'sketch', 'component', 'mate'].includes(x.kind)); if (s) { e.preventDefault(); this.rename(s.id); } return; }
    const rows = [...this.el.querySelectorAll('.tn')];
    const cur = rows.findIndex((r) => r.dataset.key === this.cursor);
    const row = rows[cur];
    if ((k === 'F10' && e.shiftKey) || k === 'ContextMenu') {
      if (!row) return;
      e.preventDefault(); e.stopPropagation();
      const r = row.getBoundingClientRect();
      this.app.treeContext(row._item, { clientX: r.left + 24, clientY: r.bottom, preventDefault() {} });
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'ArrowLeft', 'ArrowRight'].includes(k)) return;
    e.preventDefault(); e.stopPropagation();
    if (!rows.length) return;
    let to = null;
    if (k === 'ArrowDown') to = rows[Math.min(rows.length - 1, cur + 1)];
    else if (k === 'ArrowUp') to = rows[Math.max(0, cur < 0 ? 0 : cur - 1)];
    else if (k === 'Home') to = rows[0];
    else if (k === 'End') to = rows[rows.length - 1];
    else if (row && k === 'ArrowRight') { if (row.getAttribute('aria-expanded') === 'false') return row._toggle(); to = rows[cur + 1]; }
    else if (row && k === 'ArrowLeft') {
      if (row.getAttribute('aria-expanded') === 'true') return row._toggle();
      const lvl = +row.getAttribute('aria-level');
      for (let i = cur - 1; i >= 0; i--) if (+rows[i].getAttribute('aria-level') < lvl) { to = rows[i]; break; }
    }
    if (!to) return;
    this.cursor = to.dataset.key;
    const item = to._item;
    // in a command a row is picked only by clicking it; otherwise moving selects, as a click would
    if (!this.app.cmd && this.app.mode !== 'sketch') this.app.setSelection(item.kind === 'folder' || item.kind === 'root' ? [] : [item]);
    const now = this.markCursor();
    now?.scrollIntoView?.({ block: 'nearest' });
  }

  clearFilter(focusTree = false) {
    this.filter.value = '';
    this.render();
    if (focusTree) this.el.focus({ preventScroll: true });
  }

  // While a filter is on, say so above the tree (with the count and Clear), so a filtered tree is never
  // mistaken for an empty one.
  filterNote(q) {
    if (!q) return;
    const n = this.el.querySelectorAll('.tn').length;
    const note = h('div', 'tree-filtering' + (n ? '' : ' none'));
    const t = h('span'); t.textContent = n ? `${n} item${n === 1 ? '' : 's'} match "${this.filter.value.trim()}"` : `Nothing matches "${this.filter.value.trim()}"`;
    const b = h('button', 'tf-clear', 'Clear filter'); b.type = 'button';
    b.onclick = () => this.clearFilter(true);
    note.append(t, b);
    this.el.prepend(note);
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
    let rowN = 0;
    const node = ({ id, kind, name, ic, depth = 0, twisty = null, cls = '', badge = '', onDbl = null, data = null, onTwisty = null, title = '' }) => {
      name = String(name ?? id);
      if (q && !name.toLowerCase().includes(q)) return null;
      const sel = selKeys.has(`${kind}:${id}`);
      const n = h('div', 'tn ' + cls + (sel ? ' selected' : ''));
      n.style.paddingLeft = 4 + depth * 14 + 'px';
      n.id = 'tn-' + rowN++;
      n.setAttribute('role', 'treeitem');
      n.setAttribute('aria-level', String(depth + 1));
      n.setAttribute('aria-selected', String(sel));
      if (title) n.title = title;
      const tw = h('span', 'tw', twisty === null ? '' : twisty ? '&#9660;' : '&#9654;');
      const toggle = () => { if (onTwisty) return onTwisty(); this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id); this.render(); };
      if (twisty !== null) { tw.onclick = (e) => { e.stopPropagation(); toggle(); }; n.setAttribute('aria-expanded', String(!!twisty)); n._toggle = toggle; }
      n.appendChild(tw);
      n.insertAdjacentHTML('beforeend', icon(ic, 16));
      const nm = h('span', 'nm'); nm.textContent = name; n.appendChild(nm);
      if (badge) n.appendChild(h('span', 'badge', badge));
      n._item = { kind, id, data };
      n.onclick = (e) => { this.cursor = `${kind}:${id}`; app.treeClick({ kind, id, data }, e, n); };
      n.ondblclick = (e) => { e.stopPropagation(); if (onDbl) onDbl(); };
      n.oncontextmenu = (e) => { e.preventDefault(); app.treeContext({ kind, id, data }, e); };
      n.onmouseenter = () => app.treeHover({ kind, id });
      n.onmouseleave = () => app.treeHover(null);
      n.dataset.key = `${kind}:${id}`;
      this.el.appendChild(n);
      return n;
    };
    if (app.isAsm) { app.asm.renderTree(this, node); this.filterNote(q); this.markCursor(); return; }
    const bodies = app.result?.body?.faces?.length ? 1 : 0;
    // the configuration is always the default one: it goes in the tooltip, so the part's name is not cut off
    node({ id: 'root', kind: 'root', name: doc.name, ic: 'part', cls: 'root', title: `${doc.name} (Default<<Default>_Display State 1>)` });
    node({ id: 'history', kind: 'folder', name: 'History', ic: 'history', depth: 1 });
    node({ id: 'bodies', kind: 'folder', name: `Solid Bodies(${bodies})`, ic: 'bodies', depth: 1, twisty: bodies ? this.expanded.has('bodies') : null });
    if (bodies && this.expanded.has('bodies')) node({ id: 'body1', kind: 'folder', name: this.bodyName(doc), ic: 'bodies', depth: 2 });
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
    this.filterNote(q);
    this.markCursor();
  }

  // SOLIDWORKS names a body after the last feature that changed it.
  bodyName(doc) {
    const rb = doc.rollback ?? doc.features.length;
    const f = doc.features.slice(0, rb).filter((x) => !['sketch', 'plane'].includes(x.type) && !x.suppressed && this.app.statusById?.[x.id]?.state !== 'error').pop();
    return f?.name || 'Body';
  }

  // Drag the rollback bar. The pointer is captured, so the release always ends the drag where it happened;
  // without it a release outside the window was lost and the next click anywhere above the tree (ribbon,
  // menus) rolled the part back to the top (YZ's Lavilock parts were found rolled back above their first
  // feature). A press that moves less than a few pixels is a click and changes nothing.
  dragRollback(e, bar) {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation();
    bar.classList.add('drag');
    const rows = [...this.el.querySelectorAll('.tn')].filter((r) => /^(feature|sketch|plane):/.test(r.dataset.key) && !['plane:Front Plane', 'plane:Top Plane', 'plane:Right Plane'].includes(r.dataset.key));
    const doc = this.app.doc;
    const y0 = e.clientY, pid = e.pointerId;
    try { bar.setPointerCapture(pid); } catch (_) { /* old browser: window listeners below still end it */ }
    let target = null;
    const mv = (ev) => {
      if (ev.pointerId !== pid) return;
      if (target === null && Math.abs(ev.clientY - y0) < 4) return;
      // index = number of top-level rows above the cursor
      let n = 0;
      for (const r of rows) { const rr = r.getBoundingClientRect(); if (ev.clientY > rr.top + rr.height / 2) n = r; }
      target = n;
      for (const r of rows) r.classList.toggle('rb-drop', r === n); // the drop line (app.css / linear.css)
    };
    const end = (commit) => (ev) => {
      if (ev.pointerId !== pid) return;
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel); bar.removeEventListener('lostpointercapture', cancel);
      try { bar.releasePointerCapture(pid); } catch (_) { /* already released */ }
      bar.classList.remove('drag');
      for (const r of rows) r.classList.remove('rb-drop');
      if (!commit || target === null || !this.el.contains(bar)) return;
      let idx = 0;
      if (target) {
        const id = target.dataset.key.split(':').slice(1).join(':');
        const fi = doc.features.findIndex((f) => f.id === id);
        // a nested sketch belongs to its feature; roll to after that feature
        idx = fi + 1;
        const abs = this.absorbers(doc);
        for (const [sid, fid] of abs) if (sid === id) idx = doc.features.findIndex((f) => f.id === fid) + 1;
      }
      const next = idx >= doc.features.length ? null : idx;
      if (next !== (doc.rollback ?? null)) this.app.setRollback(next);
    };
    const up = end(true), cancel = end(false);
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel); bar.addEventListener('lostpointercapture', cancel);
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
