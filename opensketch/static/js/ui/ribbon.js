// CommandManager (ribbon), quick access toolbar, menus and command search.

import { icon } from '../icons.js';
import { TABS, ASM_TABS, QUICK, MENUS } from '../commands.js';
import { contextMenu } from './dialogs.js';

const val = (v) => (typeof v === 'function' ? v() : v);
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

export class Ribbon {
  constructor(app) {
    this.app = app;
    this.C = app.commands;
    this.tab = 'Features';
    this.flyChoice = {};
    this.ribbon = document.getElementById('ribbon');
    this.tabs = document.getElementById('cmdtabs');
    this.buildQuick();
    this.buildMenus();
    this.buildSearch();
    this.render();
  }

  setTab(name) { this.tab = name; this.render(); }

  tip(c) {
    return `${val(c.label)}\n${c.tip || ''}`;
  }

  button(id, cls) {
    const c = this.C[id];
    const b = h('div', cls);
    b.dataset.cmd = id;
    b.title = this.tip(c);
    return b;
  }

  run(id) {
    const c = this.C[id];
    this.app.lastCommand = id;
    c.run();
    this.render();
  }

  get tabs_() { return this.app.isAsm ? ASM_TABS : TABS; }

  render() {
    const tabs = this.tabs_;
    const tab = tabs.find((t) => t.name === this.tab) || tabs[0];
    this.ribbon.innerHTML = '';
    for (const it of tab.items) {
      if (it === '|') { this.ribbon.appendChild(h('div', 'rb-sep')); continue; }
      if (it.big) {
        const id = it.fly ? (this.flyChoice[it.big] || it.big) : it.big;
        const c = this.C[id];
        const b = this.button(id, 'rb-btn' + (c.active && c.active() ? ' active' : '') + (c.disabled ? ' disabled' : ''));
        b.innerHTML = `${icon(val(c.icon), 32)}<span class="lbl">${val(c.label)}</span>${it.fly ? '<span class="flyarrow">&#9660;</span>' : ''}`;
        b.onclick = (e) => {
          if (it.fly && e.target.classList.contains('flyarrow')) return this.flyout(b, it.big, it.fly);
          this.run(id);
        };
        this.ribbon.appendChild(b);
      } else if (it.col) {
        const col = h('div', 'rb-col');
        for (const id of it.col) {
          const c = this.C[id];
          const b = this.button(id, 'rb-sm' + (c.active && c.active() ? ' active' : '') + (c.disabled ? ' disabled' : ''));
          b.innerHTML = `${icon(val(c.icon), 18)}<span>${val(c.label)}</span>`;
          b.onclick = () => this.run(id);
          col.appendChild(b);
        }
        this.ribbon.appendChild(col);
      } else if (it.grid) {
        const grid = h('div', 'rb-grid');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,auto);grid-auto-rows:22px;gap:1px;align-content:start;padding-top:1px';
        for (const [key, fly] of it.grid) {
          const id = this.flyChoice[key] || key;
          const c = this.C[id];
          const b = this.button(id, 'rb-sm' + (c.active && c.active() ? ' active' : '') + (c.disabled ? ' disabled' : ''));
          b.style.padding = '0 10px 0 3px';
          b.innerHTML = `${icon(val(c.icon), 18)}${fly.length > 1 ? '<span class="flyarrow">&#9660;</span>' : ''}`;
          b.onclick = (e) => { if (fly.length > 1 && e.target.classList.contains('flyarrow')) return this.flyout(b, key, fly); this.run(id); };
          grid.appendChild(b);
        }
        this.ribbon.appendChild(grid);
      }
    }
    this.tabs.innerHTML = '';
    for (const t of tabs) {
      const e = h('div', 'cmdtab' + (t.name === tab.name ? ' active' : ''), t.name);
      e.onclick = () => this.setTab(t.name);
      this.tabs.appendChild(e);
    }
  }

  flyout(anchor, key, ids) {
    const r = anchor.getBoundingClientRect();
    contextMenu(r.left, r.bottom, ids.map((id) => ({ label: val(this.C[id].label), icon: val(this.C[id].icon), disabled: this.C[id].disabled, run: () => { this.flyChoice[key] = id; this.run(id); } })));
  }

  buildQuick() {
    const q = document.getElementById('quickaccess');
    for (const id of QUICK) {
      const c = this.C[id];
      const b = h('div', 'qa', icon(val(c.icon), 18));
      b.title = this.tip(c);
      b.onclick = () => this.run(id);
      q.appendChild(b);
      if (id === 'print' || id === 'redo' || id === 'rebuild') q.appendChild(h('span', null, '')).style.cssText = 'width:1px;height:18px;background:#ddd;margin:0 3px';
    }
  }

  buildMenus() {
    const fly = document.getElementById('menu-flyout');
    const bar = document.getElementById('menubar');
    for (const m of MENUS) {
      const mi = h('div', 'mi', m.name);
      mi.onclick = () => {
        const r = mi.getBoundingClientRect();
        contextMenu(r.left, r.bottom, m.items.map((it) => {
          if (it === '-') return '-';
          if (typeof it === 'string') { const c = this.C[it]; return { label: val(c.label), icon: val(c.icon), disabled: c.disabled, run: () => this.run(it) }; }
          return { label: it.label, key: it.key, run: () => it.run(this.app) };
        }));
      };
      bar.appendChild(mi);
    }
    fly.onclick = () => { bar.classList.toggle('hidden'); fly.innerHTML = bar.classList.contains('hidden') ? '&#9656;' : '&#9666;'; };
  }

  buildSearch() {
    const inp = document.getElementById('cmdsearch');
    const res = document.getElementById('cmdsearch-results');
    let items = [], idx = 0;
    const where = (id) => { for (const t of [...TABS, ...ASM_TABS]) if (JSON.stringify(t.items).includes(`"${id}"`)) return t.name; return ''; };
    const show = () => {
      const q = inp.value.trim().toLowerCase();
      if (!q) { res.classList.add('hidden'); return; }
      items = Object.values(this.C).filter((c) => val(c.label).toLowerCase().includes(q) || (c.tip || '').toLowerCase().includes(q)).slice(0, 12);
      idx = 0;
      res.innerHTML = '';
      items.forEach((c, i) => {
        const r = h('div', 'sr' + (i === idx ? ' active' : ''), `${icon(val(c.icon), 18)}<span>${val(c.label)}</span><span class="where">${where(c.id)}</span>`);
        r.onmousedown = (e) => { e.preventDefault(); inp.value = ''; res.classList.add('hidden'); this.run(c.id); };
        res.appendChild(r);
      });
      res.classList.toggle('hidden', !items.length);
    };
    inp.addEventListener('input', show);
    inp.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'ArrowDown') { idx = Math.min(items.length - 1, idx + 1); [...res.children].forEach((c, i) => c.classList.toggle('active', i === idx)); }
      else if (e.key === 'ArrowUp') { idx = Math.max(0, idx - 1); [...res.children].forEach((c, i) => c.classList.toggle('active', i === idx)); }
      else if (e.key === 'Enter' && items[idx]) { const id = items[idx].id; inp.value = ''; res.classList.add('hidden'); inp.blur(); this.run(id); }
      else if (e.key === 'Escape') { inp.value = ''; res.classList.add('hidden'); inp.blur(); }
    });
    inp.addEventListener('blur', () => setTimeout(() => res.classList.add('hidden'), 150));
  }
}
