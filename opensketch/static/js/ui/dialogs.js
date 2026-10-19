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

/** A div or span that works as a button from the keyboard: it takes the focus, has a name for screen readers,
 * and Enter or Space clicks it. role 'tab' and 'menuitem' work the same way. */
export function asButton(el, label, { pressed, disabled, role = 'button', popup = false } = {}) {
  el.setAttribute('role', role);
  if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
  if (label) el.setAttribute('aria-label', label);
  if (pressed !== undefined && pressed !== null) el.setAttribute(role === 'tab' ? 'aria-selected' : 'aria-pressed', String(!!pressed));
  if (disabled) el.setAttribute('aria-disabled', 'true');
  if (popup) el.setAttribute('aria-haspopup', 'menu');
  if (!el._osKeys) {
    el._osKeys = true;
    el.addEventListener('keydown', (e) => {
      if (e.target !== el || e.ctrlKey || e.metaKey || e.altKey || (e.key !== 'Enter' && e.key !== ' ')) return;
      e.preventDefault(); e.stopPropagation();
      el.click();
    });
  }
  return el;
}

/** A modal dialog is open (closing ones have already left the layer). */
export function modalOpen() {
  const l = layer();
  return !!l && [...l.children].some((c) => c.classList.contains('modal'));
}

// While a modal dialog is open the page behind it cannot take the focus or the keyboard, and screen readers
// read only the dialog.
function syncInert() {
  const on = modalOpen();
  for (const id of ['app', 'files']) { const el = document.getElementById(id); if (el) el.inert = on; }
}

// Button order follows SOLIDWORKS and Windows: the main action first, Cancel / Close / No last. Dialogs without a
// cancel button keep the order they were given.
const DISMISS = /^(cancel|close|no)$/i;
export function orderButtons(buttons) {
  if (!buttons.some((b) => DISMISS.test(b.label))) return buttons;
  const rank = (b) => (b.primary ? 0 : DISMISS.test(b.label) ? 2 : 1);
  return buttons.map((b, i) => [b, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map((x) => x[0]);
}

// Where the focus starts: the first field to type in; else the main button, but never a destructive one (then
// the safe choice); else the selected tab or first control in the body; never the close button first.
export function initialFocus(dlg) {
  const field = dlg.querySelector('.dlg-b input:not([readonly]):not([disabled]):not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=button]), .dlg-b textarea:not([readonly]), .dlg-b select');
  if (field) return field;
  const danger = dlg.querySelector('.dlg-f .btn.danger');
  const btn = danger ? dlg.querySelector('.dlg-f .btn:not(.danger)') : dlg.querySelector('.dlg-f .btn.primary');
  if (btn) return btn;
  return dlg.querySelector('.dlg-b [aria-selected="true"]')
    || dlg.querySelector('.dlg-b button:not([hidden]):not([disabled]), .dlg-b a[href], .dlg-b [tabindex="0"]')
    || dlg.querySelector('.dlg-f .btn') || dlg.querySelector('button');
}

/** A field password managers must leave alone (keys, secrets, ids): no saved email or password is put in it. */
export function secretField(el) {
  el.autocomplete = 'off'; el.spellcheck = false;
  el.setAttribute('autocapitalize', 'off');
  for (const [k, v] of [['data-1p-ignore', ''], ['data-lpignore', 'true'], ['data-bwignore', ''], ['data-form-type', 'other']]) el.setAttribute(k, v);
  return el;
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
  // Each dialog is its own form, so a browser reads its fields on their own: a password field in one dialog
  // never makes the browser put a saved email into the FeatureManager filter or another box on the page.
  const b = h('form', 'dlg-b');
  b.setAttribute('autocomplete', 'off'); b.noValidate = true;
  b.addEventListener('submit', (e) => e.preventDefault());
  if (typeof body === 'string') b.innerHTML = body; else b.appendChild(body);
  // A disabled default button: Enter in a field never "clicks" the first button of the body (implicit submission).
  b.insertAdjacentHTML('afterbegin', '<button type="submit" disabled hidden aria-hidden="true" tabindex="-1"></button>');
  dlg.append(head, b);
  if (buttons.length) {
    const f = h('div', 'dlg-f');
    for (const bt of orderButtons(buttons)) {
      const e = h('button', 'btn' + (bt.primary ? ' primary' : '') + (bt.danger ? ' danger' : ''));
      e.textContent = bt.label;
      e.onclick = () => { if (bt.run && bt.run() === false) return; close(); };
      f.appendChild(e);
    }
    dlg.appendChild(f);
  }
  back.appendChild(dlg);
  layer().appendChild(back);
  // layout sizes (offsetWidth/Height), not the box on screen: the entrance animation scales it for a moment
  const W = dlg.offsetWidth, H = dlg.offsetHeight;
  dlg.style.left = Math.max(4, Math.min(window.innerWidth - W - 4, x ?? (window.innerWidth - W) / 2)) + 'px';
  dlg.style.top = Math.max(4, Math.min(window.innerHeight - H - 4, y ?? (window.innerHeight - H) / 3)) + 'px';
  makeDraggable(dlg, head);
  // Keep it inside the window when its content grows (lists that load late) or the window shrinks (a phone
  // turned): the stylesheet caps its size, this moves it back so the title and the buttons stay reachable.
  const clamp = () => {
    const l = parseFloat(dlg.style.left) || 0, t = parseFloat(dlg.style.top) || 0;
    const L = Math.max(4, Math.min(window.innerWidth - dlg.offsetWidth - 4, l)), T = Math.max(4, Math.min(window.innerHeight - dlg.offsetHeight - 4, t));
    if (Math.abs(L - l) > 0.5) dlg.style.left = L + 'px';
    if (Math.abs(T - t) > 0.5) dlg.style.top = T + 'px';
  };
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(clamp) : null;
  ro?.observe(dlg);
  window.addEventListener('resize', clamp);
  const before = document.activeElement;
  if (modal) syncInert();
  let closed = false;
  function close() {
    if (closed) return;
    closed = true;
    ro?.disconnect(); window.removeEventListener('resize', clamp);
    document.removeEventListener('keydown', key, true);
    back.classList.add('closing');
    document.body.appendChild(back); // out of the dialog layer at once; it fades out on its own
    setTimeout(() => back.remove(), 130);
    if (modal) syncInert();
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
    if (closed || dlg.contains(document.activeElement)) return;
    try { initialFocus(dlg)?.focus({ preventScroll: true }); } catch (_) { /* */ }
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
  const ok = asButton(h('div', 'pm-act', icon('ok', 16)), 'OK'); ok.title = 'Save the current value and exit the dialog';
  const cancel = asButton(h('div', 'pm-act', icon('cancel', 16)), 'Cancel'); cancel.title = 'Restore the original value and exit the dialog';
  const rebuild = asButton(h('div', 'pm-act', icon('rebuild', 16)), 'Rebuild'); rebuild.title = 'Regenerate the model with the current value';
  tb.append(ok, cancel, rebuild);
  const row = h('div', 'mod-val');
  const inp = h('input'); inp.value = (+(+value).toFixed(6)) + unit;
  row.appendChild(inp);
  const caption = h('div', 'mod-name'); caption.textContent = name;
  body.append(tb, row, caption);
  const d = dialog({ title: 'Modify', body, x, y, modal: false, cls: 'modify', onClose: () => { if (!done) onCancel && onCancel(); } });
  let done = false;
  const parse = () => evalExpr(inp.value, unit);
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
// Closing a menu that had the keyboard gives the focus back to what opened it (a menu name, a card's "...").
export function closeMenus() {
  if (!openMenu) return;
  const m = openMenu;
  openMenu = null;
  const hadFocus = m.contains(document.activeElement);
  m.remove();
  m._onClose?.();
  const back = m._returnTo;
  if (hadFocus && back && back.isConnected && typeof back.focus === 'function') { try { back.focus({ preventScroll: true }); } catch (_) { /* */ } }
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && openMenu) { e.stopPropagation(); e.preventDefault(); closeMenus(); } }, true);

const ROWS = ['menuitem', 'menuitemcheckbox', 'menuitemradio'].map((r) => `[role=${r}]:not([aria-disabled="true"])`).join(', ');

// Arrow keys, Home and End move between the enabled rows; Enter or Space runs one; Tab closes the menu. Keys never
// reach the editor's shortcuts while a menu has the focus.
function menuKeys(m, opts) {
  const rows = () => [...m.querySelectorAll(ROWS)];
  m.addEventListener('keydown', (e) => {
    e.stopPropagation();
    const all = rows();
    const i = all.indexOf(document.activeElement);
    const go = (j) => { e.preventDefault(); if (all.length) all[(j + all.length) % all.length].focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i < 0 ? all.length - 1 : i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(all.length - 1);
    else if ((e.key === 'Enter' || e.key === ' ') && i >= 0) { e.preventDefault(); all[i].click(); }
    else if (e.key === 'Tab' || e.key === 'Escape') { e.preventDefault(); closeMenus(); }
    else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && opts.onArrow) { e.preventDefault(); opts.onArrow(e.key === 'ArrowLeft' ? -1 : 1); }
  });
}

// items: [{label, icon, run, disabled, key, checked} | '-' | {head}], toolbar: [{icon, title, run}]
// opts.keyboard: opened from the keyboard, so the first row takes the focus; opts.returnTo: the element that gets
// the focus back on close (default: what had it); opts.alignRight: x is the menu's right edge; opts.onArrow(dir):
// Left / Right move to the next menu (menu bar); opts.onClose.
export function contextMenu(x, y, items, toolbar = null, opts = {}) {
  const returnTo = opts.returnTo || document.activeElement;
  closeMenus();
  const m = h('div', 'contextmenu');
  m.setAttribute('role', 'menu'); m.tabIndex = -1;
  if (opts.label) m.setAttribute('aria-label', opts.label);
  if (toolbar && toolbar.length) {
    const tb = h('div', 'cm-tb');
    for (const t of toolbar) { const b = asButton(h('div', 'ct', icon(t.icon, 20)), t.title, { role: 'menuitem' }); b.tabIndex = -1; b.title = t.title; b.onclick = () => { closeMenus(); t.run(); }; tb.appendChild(b); }
    m.appendChild(tb);
  }
  for (const it of items) {
    if (it === '-') { m.appendChild(h('div', 'cm-sep')); continue; }
    if (it.head) { const head = h('div', 'cm-head'); head.textContent = it.head; m.appendChild(head); continue; }
    const mark = it.icon ? icon(it.icon, 16) : `<span class="sp${it.checked ? ' ck' : ''}">${it.checked ? '&#10003;' : ''}</span>`;
    const row = h('div', 'cm' + (it.disabled ? ' disabled' : ''), `${mark}<span></span>${it.key ? `<span class="key">${it.key}</span>` : ''}`);
    row.querySelector('span:not(.sp):not(.key)').textContent = it.label;
    row.setAttribute('role', it.role || (it.checked === undefined ? 'menuitem' : 'menuitemcheckbox'));
    if (it.checked !== undefined) row.setAttribute('aria-checked', String(!!it.checked));
    row.tabIndex = -1;
    if (it.disabled) row.setAttribute('aria-disabled', 'true');
    if (it.title) row.title = it.title;
    row.onclick = () => { if (it.disabled) { it.whyDisabled?.(); return; } closeMenus(); it.run(); };
    m.appendChild(row);
  }
  menuKeys(m, opts);
  document.body.appendChild(m);
  const W = m.offsetWidth, H = m.offsetHeight; // layout size: the opening animation scales the menu for a moment
  const left = opts.alignRight ? x - W : x;
  m.style.left = Math.max(4, Math.min(left, window.innerWidth - W - 4)) + 'px';
  m.style.top = Math.max(4, Math.min(y, window.innerHeight - H - 4)) + 'px';
  // A menu opened by a mouse click on a toolbar button does not hand the focus back to that button (the
  // SOLIDWORKS keys would then stop reaching the model); one opened from the keyboard does.
  m._returnTo = opts.keyboard || !returnTo?.closest?.('button, [role=button], [role=tab]') ? returnTo : null;
  m._onClose = opts.onClose;
  openMenu = m;
  // Windows menus take the keyboard as soon as they open: the arrow keys work at once, and Delete or Enter
  // never reach the model behind an open menu.
  try {
    const first = opts.keyboard && m.querySelector(ROWS);
    (first || m).focus({ preventScroll: true });
  } catch (_) { /* */ }
  return m;
}

document.addEventListener('pointerdown', (e) => { if (openMenu && !openMenu.contains(e.target)) closeMenus(); }, true);
