// Floating dialogs (Modify, message boxes, Mass Properties) and context menus.

import { icon } from '../icons.js';
import { evalExpr } from './pm.js';

const layer = () => document.getElementById('modal-layer');
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

function makeDraggable(dlg, handle) {
  handle.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.x')) return;
    const r = dlg.getBoundingClientRect(), ox = e.clientX - r.left, oy = e.clientY - r.top;
    const mv = (ev) => { dlg.style.left = ev.clientX - ox + 'px'; dlg.style.top = ev.clientY - oy + 'px'; };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  });
}

export function dialog({ title, body, buttons = [], x, y, modal = true, cls = '', onClose }) {
  const back = h('div', 'dlg-back' + (modal ? ' modal' : ''));
  if (!modal) back.style.pointerEvents = 'none';
  const dlg = h('div', 'dlg ' + cls);
  dlg.style.pointerEvents = 'auto';
  const head = h('div', 'dlg-h', '<span></span><button class="x" title="Close" aria-label="Close">&#x2715;</button>');
  head.firstElementChild.textContent = title;
  dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-label', title);
  if (modal) dlg.setAttribute('aria-modal', 'true');
  const b = h('div', 'dlg-b');
  if (typeof body === 'string') b.innerHTML = body; else b.appendChild(body);
  dlg.append(head, b);
  if (buttons.length) {
    const f = h('div', 'dlg-f');
    for (const bt of buttons) {
      const e = h('button', 'btn' + (bt.primary ? ' primary' : '') + (bt.danger ? ' danger' : ''));
      e.textContent = bt.label;
      e.onclick = () => { if (bt.run && bt.run() === false) return; close(); };
      f.appendChild(e);
    }
    dlg.appendChild(f);
  }
  back.appendChild(dlg);
  layer().appendChild(back);
  const r = dlg.getBoundingClientRect();
  dlg.style.left = Math.max(4, Math.min(window.innerWidth - r.width - 4, x ?? (window.innerWidth - r.width) / 2)) + 'px';
  dlg.style.top = Math.max(4, Math.min(window.innerHeight - r.height - 4, y ?? (window.innerHeight - r.height) / 3)) + 'px';
  makeDraggable(dlg, head);
  const before = document.activeElement;
  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', key, true);
    back.classList.add('closing');
    document.body.appendChild(back); // out of the dialog layer at once; it fades out on its own
    setTimeout(() => back.remove(), 130);
    if (modal && before && before.isConnected && typeof before.focus === 'function') { try { before.focus({ preventScroll: true }); } catch (_) { /* */ } }
    onClose && onClose();
  }
  // Escape closes the top dialog only; Tab stays inside a modal dialog.
  const key = (e) => {
    const top = [...layer().children].filter((c) => !c.classList.contains('closing')).pop();
    if (top !== back) return;
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key === 'Tab' && modal) {
      const f = [...dlg.querySelectorAll('button, [href], input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } else if (!dlg.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', key, true);
  head.querySelector('.x').onclick = close;
  if (modal) setTimeout(() => {
    if (dlg.contains(document.activeElement)) return;
    const t = dlg.querySelector('input:not([readonly]):not([type=hidden]), textarea, select') || dlg.querySelector('.dlg-f .btn.primary') || dlg.querySelector('button');
    try { t?.focus({ preventScroll: true }); } catch (_) { /* */ }
  }, 0);
  return { close, el: dlg, body: b };
}

export function message(title, text, buttons = [{ label: 'OK', primary: true }]) {
  return dialog({ title, body: `<div style="max-width:380px">${text}</div>`, buttons });
}

// SOLIDWORKS "Modify" box: value field, OK / Cancel / Rebuild, name like D1@Sketch1.
export function modifyBox({ value, name, unit = 'mm', x, y, onApply, onPreview, onCancel }) {
  const body = h('div');
  const tb = h('div', 'mod-tb');
  const ok = h('div', 'pm-act', icon('ok', 16)); ok.title = 'Save the current value and exit the dialog';
  const cancel = h('div', 'pm-act', icon('cancel', 16)); cancel.title = 'Restore the original value and exit the dialog';
  const rebuild = h('div', 'pm-act', icon('rebuild', 16)); rebuild.title = 'Regenerate the model with the current value';
  tb.append(ok, cancel, rebuild);
  const row = h('div', 'mod-val');
  const inp = h('input'); inp.value = (+(+value).toFixed(6)) + unit;
  row.appendChild(inp);
  const caption = h('div', 'mod-name'); caption.textContent = name;
  body.append(tb, row, caption);
  const d = dialog({ title: 'Modify', body, x, y, modal: false, cls: 'modify', onClose: () => { if (!done) onCancel && onCancel(); } });
  let done = false;
  const parse = () => evalExpr(inp.value);
  const apply = () => { const v = parse(); if (!Number.isFinite(v) || v < 0) { inp.style.borderColor = '#d9372b'; return; } done = true; d.close(); onApply(v); };
  ok.onclick = apply;
  cancel.onclick = () => { d.close(); };
  rebuild.onclick = () => { const v = parse(); if (Number.isFinite(v)) onPreview && onPreview(v); };
  inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') apply(); if (e.key === 'Escape') d.close(); });
  inp.addEventListener('wheel', (e) => { e.preventDefault(); const v = parse(); if (!Number.isFinite(v)) return; const nv = Math.max(0, v + (e.deltaY < 0 ? 1 : -1)); inp.value = +nv.toFixed(6) + unit; onPreview && onPreview(nv); });
  setTimeout(() => { inp.focus(); inp.select(); }, 0);
  return d;
}

let openMenu = null;
export function closeMenus() { if (openMenu) { openMenu.remove(); openMenu = null; } }
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openMenu) { e.stopPropagation(); closeMenus(); } }, true);

// items: [{label, icon, run, disabled, key} | '-' | {head}], toolbar: [{icon, title, run}]
export function contextMenu(x, y, items, toolbar = null) {
  closeMenus();
  const m = h('div', 'contextmenu');
  if (toolbar && toolbar.length) {
    const tb = h('div', 'cm-tb');
    for (const t of toolbar) { const b = h('div', 'ct', icon(t.icon, 20)); b.title = t.title; b.onclick = () => { closeMenus(); t.run(); }; tb.appendChild(b); }
    m.appendChild(tb);
  }
  for (const it of items) {
    if (it === '-') { m.appendChild(h('div', 'cm-sep')); continue; }
    if (it.head) { const head = h('div', 'cm-head'); head.textContent = it.head; m.appendChild(head); continue; }
    const row = h('div', 'cm' + (it.disabled ? ' disabled' : ''), `${it.icon ? icon(it.icon, 16) : '<span class="sp"></span>'}<span></span>${it.key ? `<span class="key">${it.key}</span>` : ''}`);
    row.querySelector('span:not(.sp):not(.key)').textContent = it.label;
    row.setAttribute('role', 'menuitem');
    if (!it.disabled) row.onclick = () => { closeMenus(); it.run(); };
    m.appendChild(row);
  }
  document.body.appendChild(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.min(x, window.innerWidth - r.width - 4) + 'px';
  m.style.top = Math.min(y, window.innerHeight - r.height - 4) + 'px';
  openMenu = m;
  return m;
}

document.addEventListener('pointerdown', (e) => { if (openMenu && !openMenu.contains(e.target)) closeMenus(); }, true);
