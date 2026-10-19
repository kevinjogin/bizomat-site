// PropertyManager: the left-panel form every command opens (green check / red X, rollouts,
// pink selection boxes). Specs are plain objects; values live in the caller's state.

import { icon } from '../icons.js';
import { escapeHtml } from '../model-utils.js';
import { asButton } from './dialogs.js';

const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const LENGTH = { mm: 1, cm: 10, m: 1000, in: 25.4, inch: 25.4, '"': 25.4 };
const isAngle = (unit) => unit === 'deg' || unit === '°';

/** A typed value: numbers with optional math and a unit ("25*2", "1in", "=10+5", "1.5cm"). A decimal comma
 * counts as a point (2,5 = 2.5). unit is the field's: lengths in mm, angles in deg ('deg' or '°'); leave it out
 * to accept either. A unit of the wrong kind gives NaN. */
export function evalExpr(s, unit) {
  let t = String(s).trim().replace(/^=/, '').replace(/(\d),(\d)/g, '$1.$2');
  let f = 1;
  const m = t.match(/(mm|cm|m|inch|in|"|deg|°|rad)\s*$/i);
  if (m) {
    const u = m[1].toLowerCase();
    if (u === 'deg' || u === '°') { if (unit !== undefined && !isAngle(unit)) return NaN; }
    else if (u === 'rad') { if (!isAngle(unit)) return NaN; f = 180 / Math.PI; }
    else { if (isAngle(unit)) return NaN; f = LENGTH[u]; }
    t = t.slice(0, m.index);
  }
  if (!/^[0-9+\-*/().\s eE]+$/.test(t)) return NaN;
  try { return +Function('"use strict";return (' + t + ')')() * f; } catch (_) { return NaN; }
}

const num = (v) => +(+v).toFixed(4);
/** Why a typed value was refused, in plain words (null when it is fine). */
export function valueProblem(text, { unit = 'mm', min, max } = {}) {
  const v = evalExpr(text, unit);
  if (!Number.isFinite(v)) return isAngle(unit) ? 'Type an angle, like 2.5 or 30deg.' : unit === 'mm' ? 'Type a length, like 2.5 or 10mm.' : 'Type a number, like 2.5.';
  if (min !== undefined && v < min) return `At least ${num(min)}${unit}.`;
  if (max !== undefined && v > max) return `At most ${num(max)}${unit}.`;
  return null;
}

export class PropertyManager {
  constructor(container, app) {
    this.root = container;
    this.app = app;
    this.spec = null;
    this.activeSelbox = null;
    this.feedbackUpdates = [];
  }

  get isOpen() { return !!this.spec; }

  open(spec) {
    this.spec = spec;
    this.collapsed = new Set(spec.sections.filter((s) => s.collapsed).map((s) => s.title));
    const firstSel = this.findSelboxes()[0];
    this.activeSelbox = spec.activeSelbox || (firstSel ? firstSel.id : null);
    this.render();
    this.app.showPanel('pm');
  }

  close() {
    this.spec = null;
    this.activeSelbox = null;
    this.feedbackUpdates = [];
    this.root.innerHTML = '';
    this.app.showPanel('tree');
  }

  findSelboxes() {
    const out = [];
    const walk = (rows) => rows.forEach((r) => { if (r.type === 'selbox') out.push(r); if (r.children) walk(r.children); });
    if (this.spec) this.spec.sections.forEach((s) => walk(s.rows || []));
    return out;
  }

  activeSelboxSpec() { return this.findSelboxes().find((s) => s.id === this.activeSelbox) || null; }

  changed(rerender = false) {
    if (this.spec?.onChange) this.spec.onChange();
    if (rerender) this.render();
  }

  // Keep inputs and action buttons mounted while a committed field value
  // updates validation. Replacing them during blur can swallow the next click.
  refreshFeedback() {
    for (const update of this.feedbackUpdates) update();
  }

  render() {
    const s = this.spec;
    if (!s) return;
    this.feedbackUpdates = [];
    this.badFields = new Set(); // number fields holding a value they cannot use (shown in red with the reason)
    const root = this.root;
    const scroll = root.scrollTop;
    root.innerHTML = '';
    const pm = el('div', 'pm');
    const title = el('div', 'pm-title', `${icon(s.icon || 'props', 20)}<span>${escapeHtml(s.title)}</span><button class="pm-help" title="Getting started and shortcuts" aria-label="Help">?</button>`);
    title.querySelector('.pm-help').onclick = () => this.app?.openTask?.('resources');
    pm.appendChild(title);
    const acts = el('div', 'pm-actions');
    // a native button keeps OK keyboard reachable; aria-disabled (not disabled) so a click that commits a field
    // on blur still reaches OK (Offset Entities Distance -> OK)
    const ok = el('button', 'pm-act' + (s.okEnabled && !s.okEnabled() ? ' disabled' : ''), icon('ok', 20)); ok.title = 'OK'; ok.setAttribute('aria-label', 'OK');
    const okState = () => { const off = (!!s.okEnabled && !s.okEnabled()) || this.badFields.size > 0; ok.classList.toggle('disabled', off); ok.setAttribute('aria-disabled', String(off)); };
    okState(); this.feedbackUpdates.push(okState);
    ok.onclick = () => { okState(); if (ok.getAttribute('aria-disabled') !== 'true') this.app.pmOk(); };
    acts.appendChild(ok);
    if (!s.noCancel) { const cancel = el('button', 'pm-act', icon('cancel', 20)); cancel.title = 'Cancel'; cancel.setAttribute('aria-label', 'Cancel'); cancel.onclick = () => this.app.pmCancel(); acts.appendChild(cancel); }
    if (s.preview !== undefined) {
      const pv = asButton(el('div', 'pm-act' + (s.preview ? ' on' : ''), icon('eye', 20)), 'Detailed Preview', { pressed: !!s.preview }); pv.title = 'Detailed Preview';
      pv.onclick = () => { s.preview = !s.preview; this.changed(true); };
      acts.appendChild(pv);
    }
    // Keep Visible (SOLIDWORKS pushpin): after OK the same command opens again for the next one. Only commands
    // that can start again offer it (s.repeat).
    if (s.repeat) {
      const pin = asButton(el('div', 'pm-act' + (s.pinned ? ' on' : ''), icon('pin', 20)), 'Keep Visible', { pressed: !!s.pinned });
      pin.title = s.pinned ? 'Keep Visible: on. After OK this opens again for the next one.' : 'Keep Visible: open this again after OK';
      pin.onclick = () => { s.pinned = !s.pinned; s.onPin?.(s.pinned); this.render(); };
      acts.appendChild(pin);
    }
    pm.appendChild(acts);
    const msg = typeof s.message === 'function' ? s.message() : s.message;
    if (msg) pm.appendChild(el('div', 'pm-msg' + (s.messageError ? ' err' : ''), msg));
    const error = el('div', 'pm-msg err');
    const updateError = () => { error.textContent = s.error || ''; error.hidden = !s.error; };
    updateError(); this.feedbackUpdates.push(updateError); pm.appendChild(error);
    for (const sec of s.sections) {
      if (sec.visible && !sec.visible()) continue;
      const box = el('div', 'pm-sec');
      const isCol = this.collapsed.has(sec.title);
      const checked = sec.checkbox ? !!sec.checkbox.get() : true;
      if (isCol || (sec.checkbox && !checked)) box.classList.add('collapsed');
      const h = el('div', 'pm-sec-h');
      if (sec.checkbox) {
        const cb = el('input'); cb.type = 'checkbox'; cb.checked = checked;
        cb.onclick = (e) => { e.stopPropagation(); sec.checkbox.set(cb.checked); this.changed(true); };
        h.appendChild(cb);
      }
      h.appendChild(el('span', null, escapeHtml(sec.title)));
      h.appendChild(el('span', 'chev', isCol ? '&#9660;' : '&#9650;'));
      h.onclick = () => { if (this.collapsed.has(sec.title)) this.collapsed.delete(sec.title); else this.collapsed.add(sec.title); this.render(); };
      box.appendChild(h);
      const body = el('div', 'pm-sec-b');
      for (const r of sec.rows || []) this.renderRow(body, r);
      box.appendChild(body);
      pm.appendChild(box);
    }
    root.appendChild(pm);
    root.scrollTop = scroll;
  }

  renderRow(parent, r) {
    if (r.visible && !r.visible()) return;
    const row = el('div', 'pm-row');
    switch (r.type) {
      case 'number': {
        if (r.icon) { const i = el('span', null, icon(r.icon, 18)); i.title = r.tip || ''; row.appendChild(i); }
        if (r.label) row.appendChild(el('label', null, r.label));
        const wrap = el('div', 'pm-num');
        const inp = el('input'); inp.type = 'text';
        inp.setAttribute('aria-label', r.label || r.tip || r.icon || 'Value');
        const unit = typeof r.unit === 'function' ? r.unit() : (r.unit ?? 'mm');
        const show = () => { const v = r.get(); inp.value = (Number.isFinite(v) ? +(+v).toFixed(4) : v) + (unit ? unit : ''); };
        show();
        // A value the field cannot use stays as typed, in red, with the reason under it; OK waits until it is fixed.
        const err = el('div', 'pm-fielderr'); err.hidden = true; err.id = 'pmerr-' + Math.random().toString(36).slice(2, 8);
        row._after = err;
        const mark = (msg) => {
          err.textContent = msg || ''; err.hidden = !msg;
          if (msg) { inp.setAttribute('aria-invalid', 'true'); inp.setAttribute('aria-describedby', err.id); this.badFields.add(r); }
          else { inp.removeAttribute('aria-invalid'); inp.removeAttribute('aria-describedby'); this.badFields.delete(r); }
          this.refreshFeedback();
        };
        const commit = () => {
          const why = valueProblem(inp.value, { unit, min: r.min, max: r.max });
          if (why) { mark(why); return; }
          mark(null);
          const v = evalExpr(inp.value, unit);
          r.set(r.int ? Math.round(v) : v); this.changed(!!r.rerender);
          show();
        };
        inp.addEventListener('change', commit);
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } e.stopPropagation(); });
        inp.addEventListener('wheel', (e) => { if (document.activeElement !== inp) return; e.preventDefault(); const st = r.step || 1; const v = r.get() + (e.deltaY < 0 ? st : -st); if (Number.isFinite(v) && (r.min === undefined || v >= r.min) && (r.max === undefined || v <= r.max)) { r.set(r.int ? Math.round(v) : v); show(); this.changed(!!r.rerender); } });
        wrap.appendChild(inp);
        const spin = el('div', 'pm-spin', '<span>&#9650;</span><span>&#9660;</span>');
        const st = r.step || 1;
        spin.children[0].onclick = () => { const v = r.get() + st; if (r.max === undefined || v <= r.max) { mark(null); r.set(v); show(); this.changed(!!r.rerender); } };
        spin.children[1].onclick = () => { const v = r.get() - st; if (r.min === undefined || v >= r.min) { mark(null); r.set(v); show(); this.changed(!!r.rerender); } };
        wrap.appendChild(spin);
        row.appendChild(wrap);
        if (r.after) for (const a of r.after) this.renderInline(row, a);
        break;
      }
      case 'select': {
        if (r.before) for (const a of r.before) this.renderInline(row, a);
        if (r.icon) row.appendChild(el('span', null, icon(r.icon, 18)));
        if (r.label) row.appendChild(el('label', null, r.label));
        const sel = el('select', 'grow');
        sel.setAttribute('aria-label', r.label || r.tip || 'Option');
        for (const [v, l] of r.options) { const o = el('option', null, l); o.value = v; sel.appendChild(o); }
        sel.value = r.get();
        sel.onchange = () => { r.set(sel.value); this.changed(true); };
        row.appendChild(sel);
        break;
      }
      case 'check': {
        const lab = el('label', 'pm-radio');
        const cb = el('input'); cb.type = 'checkbox'; cb.checked = !!r.get();
        cb.onchange = () => { r.set(cb.checked); this.changed(true); };
        lab.appendChild(cb); lab.appendChild(el('span', null, r.label));
        row.appendChild(lab);
        break;
      }
      case 'radio': {
        const wrap = el('div', null); wrap.style.display = 'flex'; wrap.style.flexDirection = 'column'; wrap.style.gap = '3px';
        for (const [v, l] of r.options) {
          const lab = el('label', 'pm-radio');
          const rb = el('input'); rb.type = 'radio'; rb.name = r.name || 'rb'; rb.checked = r.get() === v;
          rb.onchange = () => { r.set(v); this.changed(true); };
          lab.appendChild(rb); lab.appendChild(el('span', null, l));
          wrap.appendChild(lab);
        }
        row.appendChild(wrap);
        break;
      }
      case 'selbox': {
        if (r.icon) row.appendChild(el('span', null, icon(r.icon, 18)));
        const box = el('div', 'pm-selbox' + (r.color === 2 ? ' b2' : '') + (this.activeSelbox === r.id ? ' active' : ''));
        const items = r.items();
        if (!items.length && r.placeholder) box.appendChild(el('div', 'pm-note', r.placeholder));
        items.forEach((it, i) => {
          const si = el('div', 'si', `<span>${r.label(it, i)}</span><span class="x" title="Remove">&times;</span>`);
          const x = asButton(si.querySelector('.x'), 'Remove ' + (si.firstChild.textContent || 'item'));
          x.onclick = (e) => { e.stopPropagation(); r.remove(i); this.changed(true); };
          si.onmouseenter = () => r.hover && r.hover(it);
          si.onmouseleave = () => r.hover && r.hover(null);
          box.appendChild(si);
        });
        box.onclick = () => { this.activeSelbox = r.id; this.render(); };
        row.appendChild(box);
        break;
      }
      case 'iconbtns': {
        for (const a of r.buttons) this.renderInline(row, a);
        if (r.label) row.appendChild(el('span', null, r.label));
        break;
      }
      case 'text': row.appendChild(el('div', 'pm-note', typeof r.text === 'function' ? r.text() : r.text)); break;
      case 'value': {
        row.appendChild(el('span', null, r.label));
        const value = el('span', 'grow');
        const update = () => { value.innerHTML = `<b>${escapeHtml(r.get())}</b>`; };
        update(); this.feedbackUpdates.push(update); row.appendChild(value);
        break;
      }
      case 'relbuttons': {
        const wrap = el('div', 'pm-relbtns grow');
        const list = r.items();
        if (!list.length) wrap.appendChild(el('div', 'pm-note', r.empty || 'No relations apply.'));
        for (const it of list) {
          const b = el('div', 'pm-relbtn', `${icon(it.icon, 16)}<span>${it.label}</span>`);
          asButton(b, b.textContent);
          b.onclick = () => it.run();
          wrap.appendChild(b);
        }
        row.appendChild(wrap);
        break;
      }
      case 'list': {
        const wrap = el('div', 'pm-list grow');
        const list = r.items();
        if (!list.length) wrap.appendChild(el('div', 'pm-note', '&nbsp;' + (r.empty || '')));
        for (const it of list) {
          const li = el('div', 'li' + (it.selected ? ' sel' : '') + (it.over ? ' over' : ''), `${it.icon ? icon(it.icon, 16) : ''}<span>${it.label}</span>`);
          li.onclick = () => it.select && it.select();
          wrap.appendChild(li);
        }
        row.appendChild(wrap);
        if (r.after) { const col = el('div'); for (const a of r.after) this.renderInline(col, a); row.appendChild(col); }
        break;
      }
      case 'buttons': {
        for (const b of r.buttons) {
          const bt = el('button', 'btn' + (b.primary ? ' primary' : ''), b.label);
          bt.onclick = () => b.run();
          row.appendChild(bt);
        }
        break;
      }
      case 'custom': r.render(row); break;
      default: break;
    }
    parent.appendChild(row);
    if (row._after) parent.appendChild(row._after);
  }

  renderInline(row, a) {
    const b = el('div', 'pm-iconbtn' + (a.get && a.get() ? ' on' : ''), icon(a.icon, 18));
    asButton(b, a.title || a.icon, { pressed: a.get ? !!a.get() : undefined });
    b.title = a.title || '';
    b.onclick = () => { a.toggle(); this.changed(true); };
    row.appendChild(b);
  }
}
