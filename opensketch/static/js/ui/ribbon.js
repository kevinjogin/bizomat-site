// CommandManager (ribbon), quick access toolbar, menus and command search.

import { icon } from '../icons.js';
import { TABS, ASM_TABS, QUICK, MENUS, availableIn } from '../commands.js';
import { contextMenu, asButton } from './dialogs.js';
import { typedInput } from './tree.js';

const val = (v) => (typeof v === 'function' ? v() : v);
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const MENUBAR_KEY = 'opensketch.menubar';
const IN_RIBBON = new Set(JSON.stringify([...TABS, ...ASM_TABS]).match(/"[a-z0-9_]+"/g).map((s) => s.slice(1, -1)));

/** Command search: name matches before matches in the description, so "fil" finds Fillet. Commands that belong to
 * the other kind of document are left out; ones not built yet stay, after the rest (SOLIDWORKS lists them greyed). */
export function rankCommands(commands, query, isAsm, limit = 12) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const words = (t) => t.toLowerCase().split(/[\s/.\-()]+/).filter(Boolean);
  const out = [];
  Object.values(commands).forEach((c, i) => {
    if (!availableIn(c, isAsm)) return;
    const L = val(c.label).toLowerCase(), lw = words(L);
    let score = L.startsWith(q) ? 0 : lw.some((w) => w.startsWith(q)) ? 1 : L.includes(q) ? 2 : words(c.tip || '').some((w) => w.startsWith(q)) ? 3 : -1;
    if (score < 0) return;
    const exact = L === q || lw.includes(q);
    out.push({ c, key: [score, exact ? 0 : 1, c.disabled ? 1 : 0, IN_RIBBON.has(c.id) ? 0 : 1, i] });
  });
  out.sort((a, b) => { for (let k = 0; k < a.key.length; k++) if (a.key[k] !== b.key[k]) return a.key[k] - b.key[k]; return 0; });
  return out.slice(0, limit).map((x) => x.c);
}

/** A menu's rows for this document: commands of the other kind left out, and no separator or heading left
 * dangling at the ends or doubled. */
export function menuItems(items, commands, isAsm) {
  const isHead = (it) => !!it && typeof it === 'object' && it.head !== undefined;
  const kept = items.filter((it) => typeof it !== 'string' || it === '-' || availableIn(commands[it], isAsm));
  // a heading with nothing under it goes
  const rows = kept.filter((it, i) => !(isHead(it) && (i + 1 >= kept.length || kept[i + 1] === '-' || isHead(kept[i + 1]))));
  const out = [];
  for (const it of rows) if (!(it === '-' && (!out.length || out[out.length - 1] === '-'))) out.push(it);
  while (out.length && out[out.length - 1] === '-') out.pop();
  return out;
}

export class Ribbon {
  constructor(app) {
    this.app = app;
    this.C = app.commands;
    this.tab = 'Features';
    this.flyChoice = {};
    this.ribbon = document.getElementById('ribbon');
    this.tabs = document.getElementById('cmdtabs');
    this.ribbon.setAttribute('role', 'toolbar'); this.ribbon.setAttribute('aria-label', 'CommandManager');
    this.tabs.setAttribute('role', 'tablist'); this.tabs.setAttribute('aria-label', 'CommandManager tabs');
    this.bindRibbonKeys();
    this.buildQuick();
    this.buildMenus();
    this.buildSearch();
    this.render();
  }

  setTab(name) { this.tab = name; this.render(); }

  tip(c) {
    return `${val(c.label)}\n${c.disabled ? 'Not available in this version. ' : ''}${c.tip || ''}`;
  }

  button(id, cls) {
    const c = this.C[id];
    const b = h('div', cls);
    b.dataset.cmd = id;
    b.title = this.tip(c);
    asButton(b, val(c.label) + (c.disabled ? ' (not available in this version)' : ''), { disabled: c.disabled, pressed: c.active ? !!c.active() : undefined });
    return b;
  }

  run(id) {
    const c = this.C[id];
    if (!c) return;
    if (c.disabled) { this.app.toast(`${val(c.label)} is not available in this version.`); return; }
    this.app.lastCommand = id;
    c.run();
    this.render();
  }

  get tabs_() { return this.app.isAsm ? ASM_TABS : TABS; }

  // The ribbon is one toolbar: Tab enters it at the last used button, Left / Right move along it, Down opens a
  // button's flyout.
  bindRibbonKeys() {
    this.ribbon.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey && e.key !== 'ArrowDown') return;
      const all = [...this.ribbon.querySelectorAll('[role=button]')];
      const i = all.indexOf(document.activeElement);
      if (i < 0) return;
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: all.length - 1 }[e.key];
      if (to !== undefined) { e.preventDefault(); e.stopPropagation(); this.focusRibbon(all[Math.max(0, Math.min(all.length - 1, to))]); return; }
      if (e.key === 'ArrowDown' && all[i]._fly) { e.preventDefault(); e.stopPropagation(); all[i]._fly(true); }
    });
  }

  focusRibbon(b) {
    for (const x of this.ribbon.querySelectorAll('[role=button]')) x.tabIndex = x === b ? 0 : -1;
    this.focusCmd = b?.dataset.cmd;
    b?.focus();
  }

  render() {
    const tabs = this.tabs_;
    const tab = tabs.find((t) => t.name === this.tab) || tabs[0];
    // Drawn again only when something it shows changed (save states and sketch solves ask often).
    const ids = tab.items.flatMap((it) => (it.big ? [it.fly ? (this.flyChoice[it.big] || it.big) : it.big] : it.col ? it.col : it.grid ? it.grid.map(([k]) => this.flyChoice[k] || k) : []));
    const sig = JSON.stringify([tabs.map((t) => t.name), tab.name, ids.map((id) => { const c = this.C[id]; return c ? [id, !!(c.active && c.active()), val(c.label), val(c.icon)] : id; })]);
    if (sig === this._sig && this.ribbon.childElementCount) return;
    this._sig = sig;
    // a keyboard user's focus stays on the same command or tab when the ribbon is drawn again
    const had = document.activeElement;
    const keepCmd = this.ribbon.contains(had) ? had.dataset.cmd : null;
    const keepTab = this.tabs.contains(had) ? had.dataset.tab : null;
    this.ribbon.innerHTML = '';
    const flyable = (b, key, ids) => { b._fly = (keyboard) => this.flyout(b, key, ids, keyboard); b.setAttribute('aria-haspopup', 'menu'); };
    for (const it of tab.items) {
      if (it === '|') { this.ribbon.appendChild(h('div', 'rb-sep')); continue; }
      if (it.big) {
        const id = it.fly ? (this.flyChoice[it.big] || it.big) : it.big;
        const c = this.C[id];
        if (!c) continue;
        const b = this.button(id, 'rb-btn' + (c.active && c.active() ? ' active' : '') + (c.disabled ? ' disabled' : ''));
        b.innerHTML = `${icon(val(c.icon), 32)}<span class="lbl">${val(c.label)}</span>${it.fly ? '<span class="flyarrow">&#9660;</span>' : ''}`;
        b.onclick = (e) => {
          if (it.fly && e.target.classList.contains('flyarrow')) return this.flyout(b, it.big, it.fly);
          this.run(id);
        };
        if (it.fly) flyable(b, it.big, it.fly);
        this.ribbon.appendChild(b);
      } else if (it.col) {
        const col = h('div', 'rb-col');
        for (const id of it.col) {
          const c = this.C[id];
          if (!c) continue;
          const b = this.button(id, 'rb-sm' + (c.active && c.active() ? ' active' : '') + (c.disabled ? ' disabled' : ''));
          b.innerHTML = `${icon(val(c.icon), 18)}<span>${val(c.label)}</span>`;
          b.onclick = () => this.run(id);
          col.appendChild(b);
        }
        if (col.children.length) this.ribbon.appendChild(col);
      } else if (it.grid) {
        const grid = h('div', 'rb-grid');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,auto);grid-auto-rows:22px;gap:1px;align-content:start;padding-top:1px';
        for (const [key, fly] of it.grid) {
          const id = this.flyChoice[key] || key;
          const c = this.C[id];
          if (!c) continue;
          const b = this.button(id, 'rb-sm' + (c.active && c.active() ? ' active' : '') + (c.disabled ? ' disabled' : ''));
          b.style.padding = '0 10px 0 3px';
          b.innerHTML = `${icon(val(c.icon), 18)}${fly.length > 1 ? '<span class="flyarrow">&#9660;</span>' : ''}`;
          b.onclick = (e) => { if (fly.length > 1 && e.target.classList.contains('flyarrow')) return this.flyout(b, key, fly); this.run(id); };
          if (fly.length > 1) flyable(b, key, fly);
          grid.appendChild(b);
        }
        this.ribbon.appendChild(grid);
      }
    }
    // one tab stop for the whole ribbon (roving focus)
    const btns = [...this.ribbon.querySelectorAll('[role=button]')];
    const rov = btns.find((b) => b.dataset.cmd === (keepCmd || this.focusCmd)) || btns[0];
    for (const b of btns) b.tabIndex = b === rov ? 0 : -1;
    if (keepCmd && rov) rov.focus();
    this.tabs.innerHTML = '';
    for (const t of tabs) {
      const on = t.name === tab.name;
      const e = asButton(h('div', 'cmdtab' + (on ? ' active' : ''), t.name), t.name, { role: 'tab', pressed: on });
      e.dataset.tab = t.name;
      e.tabIndex = on ? 0 : -1;
      e.onclick = () => this.setTab(t.name);
      e.addEventListener('keydown', (ev) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[ev.key];
        if (!k) return;
        ev.preventDefault(); ev.stopPropagation();
        const i = tabs.indexOf(t);
        this.setTab(tabs[(i + k + tabs.length) % tabs.length].name);
        this.tabs.querySelector('.cmdtab.active')?.focus();
      });
      this.tabs.appendChild(e);
    }
    if (keepTab) this.tabs.querySelector(`[data-tab="${CSS.escape(keepTab)}"]`)?.focus();
  }

  flyout(anchor, key, ids, keyboard = false) {
    const r = anchor.getBoundingClientRect();
    contextMenu(r.left, r.bottom, ids.filter((id) => this.C[id]).map((id) => ({ label: val(this.C[id].label), icon: val(this.C[id].icon), disabled: this.C[id].disabled,
      whyDisabled: () => this.run(id), run: () => { this.flyChoice[key] = id; this.run(id); } })), null, { keyboard, returnTo: anchor });
  }

  buildQuick() {
    const q = document.getElementById('quickaccess');
    q.setAttribute('role', 'toolbar'); q.setAttribute('aria-label', 'Quick access');
    for (const id of QUICK) {
      const c = this.C[id];
      const b = asButton(h('div', 'qa', icon(val(c.icon), 18)), val(c.label));
      b.dataset.cmd = id;
      b.title = this.tip(c);
      b.onclick = () => this.run(id);
      q.appendChild(b);
      if (id === 'print' || id === 'redo' || id === 'rebuild') q.appendChild(h('span', 'qa-sep'));
    }
  }

  // The menu bar (File, Edit, View...) hides behind the arrow at the left; it stays open if you left it open.
  toggleMenubar(on) {
    const fly = document.getElementById('menu-flyout');
    const bar = document.getElementById('menubar');
    if (!fly || !bar) return;
    const show = on ?? bar.classList.contains('hidden');
    bar.classList.toggle('hidden', !show);
    fly.innerHTML = show ? '&#9666;' : '&#9656;';
    fly.setAttribute('aria-expanded', String(show));
    fly.setAttribute('aria-label', show ? 'Hide the menus' : 'Show the menus (F10)');
    fly.title = show ? 'Hide the menus' : 'Menus (F10)';
    try { localStorage.setItem(MENUBAR_KEY, show ? '1' : '0'); } catch (_) { /* private window */ }
  }

  buildMenus() {
    const fly = document.getElementById('menu-flyout');
    const bar = document.getElementById('menubar');
    bar.setAttribute('aria-label', 'Menus');
    const names = [];
    const open = (i, keyboard) => {
      const m = MENUS[i], mi = names[i];
      const r = mi.getBoundingClientRect();
      const raw = typeof m.items === 'function' ? m.items(this.app) : m.items;
      const rows = menuItems(raw, this.C, this.app.isAsm).map((it) => {
        if (it === '-') return '-';
        if (it.head) return { head: it.head };
        if (typeof it === 'string') {
          const c = this.C[it];
          return { label: val(c.label), icon: val(c.icon), key: c.key, disabled: c.disabled, whyDisabled: () => this.run(it), run: () => this.run(it) };
        }
        return { label: it.label, key: it.key, role: it.role, checked: typeof it.checked === 'function' ? !!it.checked(this.app) : it.checked, run: () => it.run(this.app) };
      });
      names.forEach((n) => { n.classList.remove('open'); n.setAttribute('aria-expanded', 'false'); });
      mi.classList.add('open'); mi.setAttribute('aria-expanded', 'true');
      contextMenu(r.left, r.bottom, rows, null, { keyboard, returnTo: mi, label: m.name,
        onArrow: (d) => { const j = (i + d + MENUS.length) % MENUS.length; open(j, true); },
        onClose: () => { mi.classList.remove('open'); mi.setAttribute('aria-expanded', 'false'); } });
    };
    MENUS.forEach((m, i) => {
      const mi = asButton(h('div', 'mi', m.name), m.name, { popup: true });
      mi.setAttribute('aria-expanded', 'false');
      mi.onclick = (e) => open(i, !e.detail);
      mi.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); e.stopPropagation(); names[(i + d + names.length) % names.length].focus(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); open(i, true); }
      });
      names.push(mi);
      bar.appendChild(mi);
    });
    asButton(fly, 'Show the menus (F10)');
    fly.onclick = () => this.toggleMenubar();
    let saved = null; try { saved = localStorage.getItem(MENUBAR_KEY); } catch (_) { /* */ }
    // phones have no room for it (and no arrow to hide it again)
    const phone = typeof matchMedia === 'function' && matchMedia('(max-width: 760px)').matches;
    this.toggleMenubar(saved === '1' && !phone);
  }

  buildSearch() {
    const inp = document.getElementById('cmdsearch');
    const res = document.getElementById('cmdsearch-results');
    res.setAttribute('role', 'listbox'); res.setAttribute('aria-label', 'Commands');
    inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list');
    inp.setAttribute('aria-controls', 'cmdsearch-results'); inp.setAttribute('aria-expanded', 'false');
    let items = [], idx = 0;
    const where = (id) => { for (const t of [...TABS, ...ASM_TABS]) if (JSON.stringify(t.items).includes(`"${id}"`)) return t.name; return ''; };
    const hide = () => { res.classList.add('hidden'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); };
    const mark = () => {
      [...res.children].forEach((c, i) => { c.classList.toggle('active', i === idx); c.setAttribute('aria-selected', String(i === idx)); });
      const a = res.children[idx];
      if (a) { inp.setAttribute('aria-activedescendant', a.id); a.scrollIntoView?.({ block: 'nearest' }); }
    };
    const show = () => {
      const q = inp.value.trim();
      if (!q) { hide(); return; }
      items = rankCommands(this.C, q, this.app.isAsm);
      idx = 0;
      res.innerHTML = '';
      items.forEach((c, i) => {
        const r = h('div', 'sr' + (i === idx ? ' active' : ''), `${icon(val(c.icon), 18)}<span></span><span class="where">${c.disabled ? 'Not available' : where(c.id)}</span>`);
        r.querySelector('span').textContent = val(c.label);
        r.id = 'cmdsr-' + i;
        r.setAttribute('role', 'option');
        r.setAttribute('aria-disabled', String(!!c.disabled));
        r.onmousedown = (e) => { e.preventDefault(); inp.value = ''; hide(); this.run(c.id); };
        res.appendChild(r);
      });
      res.classList.toggle('hidden', !items.length);
      inp.setAttribute('aria-expanded', String(!!items.length));
      mark();
    };
    // typed words only: a browser that autofills a saved email into the box is ignored (see tree.js)
    inp.addEventListener('input', (e) => { if (inp.value && !typedInput(e, inp)) inp.value = ''; show(); });
    inp.addEventListener('animationstart', (e) => { if (e.animationName === 'os-autofill') { inp.value = ''; show(); } });
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(items.length - 1, idx + 1); mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(0, idx - 1); mark(); }
      else if (e.key === 'Enter' && items[idx]) { const id = items[idx].id; inp.value = ''; hide(); inp.blur(); this.run(id); }
      else if (e.key === 'Escape') { inp.value = ''; hide(); inp.blur(); }
    });
    inp.addEventListener('blur', () => setTimeout(hide, 150));
  }
}
