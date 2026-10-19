// Files: the person's saved models on this server, with a picture of each (Files page, File > Open).
//
// A full-window view above the editor. Opening a file links the editor to it (serverdocs.js): edits save
// themselves and the AI's changes appear live. Deleting moves a file to the Trash for 30 days.

import { contextMenu, dialog, message } from './ui/dialogs.js';
import { escapeHtml as esc } from './model-utils.js';

const $ = (id) => document.getElementById(id);
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

// Small monochrome stroke icons (24 x 24), drawn for this page.
const I = (d, extra = '') => `<svg class="fi" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"${extra}>${d}</svg>`;
export const FI = {
  search: I('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  upload: I('<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M5 15v3.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V15"/>'),
  more: I('<circle cx="5.5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="18.5" cy="12" r="1.2" fill="currentColor"/>'),
  part: I('<path d="M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7z"/><path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5"/>'),
  assembly: I('<path d="M8 3.5l5 2.8v5.6L8 14.7l-5-2.8V6.3z"/><path d="M16 9.3l5 2.8v5.6l-5 2.8-5-2.8"/><path d="M11 12.1l5-2.8"/>'),
  files: I('<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>'),
  clock: I('<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>'),
  ai: I('<path d="M12 3.5l1.8 4.7 4.7 1.8-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
  trash: I('<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2a1 1 0 001 .8h7.2a1 1 0 001-.8L17.5 7"/>'),
  open: I('<path d="M14 4.5h5.5V10M19.5 4.5L11 13"/><path d="M18 14v4.5a1 1 0 01-1 1H5.5a1 1 0 01-1-1V7a1 1 0 011-1H10"/>'),
  rename: I('<path d="M4.5 19.5h4l10-10-4-4-10 10z"/><path d="M13 7l4 4"/>'),
  copy: I('<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 00-1.5-1.5H6A1.5 1.5 0 004.5 6v8A1.5 1.5 0 006 15.5h2.5"/>'),
  download: I('<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 17v1.5A1.5 1.5 0 006.5 20h11a1.5 1.5 0 001.5-1.5V17"/>'),
  history: I('<path d="M4.5 12a7.5 7.5 0 102.2-5.3L4.5 9"/><path d="M4.5 4.5V9H9M12 8v4l2.8 1.8"/>'),
  restore: I('<path d="M4.5 12a7.5 7.5 0 107.5-7.5A7.5 7.5 0 006 7.5"/><path d="M6 3.5v4h4"/>'),
  back: I('<path d="M15 5l-7 7 7 7"/>'),
  grid: I('<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>'),
  list: I('<path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11"/><circle cx="4.75" cy="6.5" r=".9" fill="currentColor"/><circle cx="4.75" cy="12" r=".9" fill="currentColor"/><circle cx="4.75" cy="17.5" r=".9" fill="currentColor"/>'),
  arrow: I('<path d="M5 12h13M13 7l5 5-5 5"/>'),
  plug: I('<path d="M9 3.5v4M15 3.5v4M6.5 7.5h11v3a5.5 5.5 0 01-11 0z"/><path d="M12 16v4.5"/>'),
  x: I('<path d="M6 6l12 12M18 6L6 18"/>'),
};

export function ago(t) {
  if (!t) return '';
  const s = Math.max(0, Date.now() / 1000 - t);
  if (s < 45) return 'just now';
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  if (s < 86400 * 6) return `${Math.round(s / 86400)} d ago`;
  return new Date(t * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: new Date(t * 1000).getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
}

const KB = (n) => (n == null ? '' : n < 1e6 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1e6).toFixed(1)} MB`);

function detail(f) {
  const c = f.counts || {};
  if (f.kind === 'assembly') return `${c.components || 0} component${c.components === 1 ? '' : 's'}`;
  if (c.imported && !c.features) return 'Imported body';
  const n = (c.features || 0);
  return n ? `${n} feature${n === 1 ? '' : 's'}` : c.sketches ? `${c.sketches} sketch${c.sketches === 1 ? '' : 'es'}` : 'Empty';
}

const FILTERS = [
  { id: 'all', label: 'All files', icon: 'files' },
  { id: 'recent', label: 'Recent', icon: 'clock' },
  { id: 'part', label: 'Parts', icon: 'part' },
  { id: 'assembly', label: 'Assemblies', icon: 'assembly' },
  { id: 'trash', label: 'Trash', icon: 'trash' },
];
const SORTS = { updated: 'Last edited', name: 'Name', created: 'Date created' };

export class FilesView {
  constructor(app) {
    this.app = app;
    this.el = null;
    this.items = [];
    this.trash = [];
    this.filter = 'all';
    this.query = '';
    try { this.sort = localStorage.getItem('opensketch.files.sort') || 'updated'; this.layout = localStorage.getItem('opensketch.files.layout') || 'grid'; } catch (_) { this.sort = 'updated'; this.layout = 'grid'; }
    this.loading = false;
  }

  get isOpen() { return !!this.el && !this.el.classList.contains('hidden'); }

  // Files actions wait out a server that is starting or busy (no answer, or Fly.io's 502/503/504) for up to ~40 s,
  // with a note after a moment, so a click never looks ignored (YZ 2026-10-19: Move to Trash "did nothing" while
  // the server was stalled).
  async req(method, url, body) {
    const waits = [800, 1500, 3000, 6000, 10000, 15000];
    let note = null;
    const slow = setTimeout(() => { note = this.app.toast?.('Waiting for the server. It may be starting up or busy...', 0); }, 2500);
    try {
      for (let i = 0; ; i++) {
        let r = null;
        try { r = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' }); } catch (_) { r = null; }
        const away = !r || ([502, 503, 504].includes(r.status) && !(r.headers.get('content-type') || '').includes('json'));
        if (away) {
          // a POST that never got an answer may have been done: only repeatable requests are sent again
          if (i >= waits.length || method === 'POST') throw new Error('The server did not answer. It may be starting up or too busy. Try again in a minute.');
          await new Promise((ok) => setTimeout(ok, waits[i]));
          continue;
        }
        return await this.answer(r);
      }
    } finally { clearTimeout(slow); note?.close(); }
  }

  async answer(r) {
    if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); throw new Error('Sign in first'); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.detail || `HTTP ${r.status}`);
    return j;
  }

  // ---------------------------------------------------------------- open / close
  async open({ filter } = {}) {
    if (this.app.reviewMode) return;
    if (filter) this.filter = filter;
    if (!this.el) this.build();
    this.lastFocus = document.activeElement;
    this.el.classList.remove('hidden', 'leaving');
    document.body.classList.add('files-open');
    this.app.server?.flush?.(); // the model being edited is saved before its card is drawn
    this.renderShell();
    await this.load();
    setTimeout(() => this.el.querySelector('.fv-search input')?.focus({ preventScroll: true }), 30);
  }

  close() {
    if (!this.isOpen) return;
    this.el.classList.add('leaving');
    document.body.classList.remove('files-open');
    setTimeout(() => { if (this.el.classList.contains('leaving')) this.el.classList.add('hidden'); }, 160);
    this.app.viewer?.resize();
    try { this.lastFocus?.focus?.({ preventScroll: true }); } catch (_) { /* gone */ }
  }

  build() {
    const el = h('div', 'files-view hidden');
    el.id = 'files';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Files');
    el.tabIndex = -1;
    document.body.appendChild(el);
    this.el = el;
    el.addEventListener('keydown', (e) => {
      e.stopPropagation(); // the editor's shortcuts do not apply here
      if (e.key === 'Escape' && !document.querySelector('.dlg-back, .contextmenu')) { e.preventDefault(); this.backToModel(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); el.querySelector('.fv-search input')?.focus(); }
    });
    // drop files anywhere on the page to upload them
    el.addEventListener('dragover', (e) => { if ([...(e.dataTransfer?.types || [])].includes('Files')) { e.preventDefault(); el.classList.add('dropping'); } });
    el.addEventListener('dragleave', (e) => { if (e.target === el || !el.contains(e.relatedTarget)) el.classList.remove('dropping'); });
    el.addEventListener('drop', (e) => { e.preventDefault(); el.classList.remove('dropping'); const fs = [...(e.dataTransfer?.files || [])]; if (fs.length) this.upload(fs); });
  }

  backToModel() {
    if (!this.app.hasModel()) { this.newFile('part'); return; }
    this.close();
  }

  // ---------------------------------------------------------------- data
  async load() {
    this.loading = true;
    this.renderGrid();
    try {
      const [items, trash] = await Promise.all([this.req('GET', '/api/docs'), this.req('GET', '/api/docs?trash=1')]);
      this.items = items; this.trash = trash; this.error = null;
    } catch (err) { this.error = err.message; }
    this.loading = false;
    this.renderNav();
    this.renderGrid();
  }

  shown() {
    let list = this.filter === 'trash' ? this.trash : this.items;
    if (this.filter === 'part' || this.filter === 'assembly') list = list.filter((f) => f.kind === this.filter);
    if (this.filter === 'recent') list = list.filter((f) => Date.now() / 1000 - f.updated < 7 * 86400);
    const q = this.query.trim().toLowerCase();
    if (q) list = list.filter((f) => f.name.toLowerCase().includes(q) || (f.summary || '').toLowerCase().includes(q));
    const by = this.filter === 'trash' ? 'deleted' : this.sort;
    return [...list].sort((a, b) => (by === 'name' ? a.name.localeCompare(b.name, undefined, { numeric: true }) : (b[by] || b.updated) - (a[by] || a.updated)));
  }

  // ---------------------------------------------------------------- drawing
  renderShell() {
    const el = this.el;
    el.innerHTML = '';
    const top = h('header', 'fv-top');
    const brand = h('button', 'fv-brand', 'OpenSketch');
    brand.title = 'Back to the model'; brand.onclick = () => this.backToModel();
    const search = h('label', 'fv-search', `${FI.search}<input type="search" placeholder="Search files" autocomplete="off" spellcheck="false" aria-label="Search files"><kbd>Ctrl K</kbd>`);
    const inp = search.querySelector('input'); inp.value = this.query;
    inp.oninput = () => { this.query = inp.value; this.renderGrid(); };
    const right = h('div', 'fv-right');
    const connect = h('button', 'btn fv-ghost', `${FI.plug}<span>Connect AI</span>`);
    connect.onclick = () => import('./connect.js').then((m) => m.connectDialog(this.app));
    const av = h('div', 'fv-avatar');
    this.avatarHost = av;
    this.syncAvatar();
    const back = h('button', 'btn fv-ghost fv-backbtn', `${FI.back}<span>Back to model</span>`);
    back.onclick = () => this.backToModel();
    back.hidden = !this.app.hasModel();
    right.append(back, connect, av);
    top.append(brand, search, right);

    const main = h('div', 'fv-main');
    this.nav = h('nav', 'fv-nav'); this.nav.setAttribute('aria-label', 'Filters');
    const content = h('section', 'fv-content');
    const hero = h('div', 'fv-hero');
    hero.innerHTML = '<h1>Files</h1>'; // just the title (YZ 2026-10-19: less text)
    const cta = h('div', 'fv-cta');
    const np = h('button', 'btn primary fv-pill', `${FI.plus}<span>New part</span>${FI.arrow}`); np.onclick = () => this.newFile('part');
    const na = h('button', 'btn fv-pill', `${FI.assembly}<span>New assembly</span>`); na.onclick = () => this.newFile('assembly');
    const up = h('button', 'btn fv-pill', `${FI.upload}<span>Upload</span>`); up.title = 'OpenSketch (.osk), STEP (.step, .stp), EAGLE (.brd) or a .zip';
    up.onclick = () => { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.accept = '.osk,.json,.step,.stp,.brd,.zip'; i.onchange = () => i.files.length && this.upload([...i.files]); i.click(); };
    cta.append(np, na, up);
    hero.appendChild(cta);
    this.draftEl = h('div', 'fv-draftslot');
    const bar = h('div', 'fv-bar');
    this.countEl = h('div', 'fv-count');
    const sort = h('select', 'fv-sort'); sort.setAttribute('aria-label', 'Sort by');
    for (const [k, v] of Object.entries(SORTS)) { const o = h('option', null, v); o.value = k; sort.appendChild(o); }
    sort.value = this.sort;
    sort.onchange = () => { this.sort = sort.value; try { localStorage.setItem('opensketch.files.sort', this.sort); } catch (_) { /* */ } this.renderGrid(); };
    const lay = h('div', 'fv-seg', `<button data-l="grid" aria-label="Grid">${FI.grid}</button><button data-l="list" aria-label="List">${FI.list}</button>`);
    lay.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('on', b.dataset.l === this.layout);
      b.onclick = () => { this.layout = b.dataset.l; try { localStorage.setItem('opensketch.files.layout', this.layout); } catch (_) { /* */ } lay.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); this.renderGrid(); };
    });
    this.sortEl = sort;
    bar.append(this.countEl, h('span', 'fv-sp'), sort, lay);
    this.grid = h('div', 'fv-grid');
    content.append(hero, this.draftEl, bar, this.grid);
    main.append(this.nav, content);
    const drop = h('div', 'fv-drop', `<div>${FI.upload}<b>Drop to upload</b><span>OpenSketch, STEP, EAGLE or a .zip</span></div>`);
    el.append(top, main, drop);
    this.renderNav();
  }

  // The account avatar (same menu as the title bar's), redrawn when the account loads.
  syncAvatar() {
    const av = this.avatarHost;
    if (!av) return;
    av.innerHTML = '';
    const mine = $('account')?.querySelector('.avatar');
    if (!mine) return;
    const c = mine.cloneNode(true);
    c.onclick = (e) => this.app.account?.menu(e.currentTarget);
    c.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.app.account?.menu(c); } };
    av.appendChild(c);
  }

  renderNav() {
    if (!this.nav) return;
    this.nav.innerHTML = '';
    for (const f of FILTERS) {
      const n = f.id === 'trash' ? this.trash.length : f.id === 'all' ? this.items.length : null;
      const b = h('button', 'fv-navi' + (this.filter === f.id ? ' on' : ''), `${FI[f.icon]}<span>${f.label}</span>${n ? `<i>${n}</i>` : ''}`);
      b.onclick = () => { this.filter = f.id; this.renderNav(); this.renderGrid(); };
      if (f.id === 'trash') this.nav.appendChild(h('div', 'fv-navsep'));
      this.nav.appendChild(b);
    }
  }

  renderDraft() {
    const slot = this.draftEl;
    if (!slot) return;
    slot.innerHTML = '';
    const app = this.app;
    if (this.filter === 'trash' || app.server.linked || !app.hasModel() || !app.dirtyDraft()) return;
    const d = app.rootDoc();
    const card = h('div', 'fv-draft');
    card.innerHTML = `<div class="fv-draft-t"><b></b><span>Unsaved draft in this browser. Save it to keep it in your Files.</span></div>`;
    card.querySelector('b').textContent = d.name || 'Untitled';
    const save = h('button', 'btn primary fv-pill', '<span>Save to Files</span>'); save.onclick = async () => { const ok = await app.server.saveDraft(); if (ok) this.load(); };
    const cont = h('button', 'btn fv-pill', '<span>Keep editing</span>'); cont.onclick = () => this.close();
    card.append(save, cont);
    slot.appendChild(card);
  }

  renderGrid() {
    if (!this.grid) return;
    this.renderDraft();
    const g = this.grid;
    g.className = 'fv-grid ' + (this.layout === 'list' ? 'as-list' : 'as-grid');
    g.innerHTML = '';
    if (this.sortEl) this.sortEl.disabled = this.filter === 'trash';
    if (this.loading && !this.items.length && !this.trash.length) {
      for (let i = 0; i < 6; i++) g.appendChild(h('div', 'fv-card skel', '<div class="fv-thumb"></div><div class="fv-meta"><b></b><span></span></div>'));
      if (this.countEl) this.countEl.textContent = '';
      return;
    }
    if (this.error) {
      g.appendChild(this.empty('Could not load your files', this.error, 'Try again', () => this.load()));
      return;
    }
    const list = this.shown();
    const total = this.filter === 'trash' ? this.trash.length : this.items.length;
    if (this.countEl) this.countEl.textContent = this.filter === 'trash' ? `${list.length} in the Trash. Files here are removed after 30 days.` : this.query ? `${list.length} of ${total} files` : `${total} file${total === 1 ? '' : 's'}`;
    if (!list.length) {
      if (this.query) g.appendChild(this.empty('No files match', `Nothing is called "${esc(this.query)}".`, 'Clear search', () => { this.query = ''; this.el.querySelector('.fv-search input').value = ''; this.renderGrid(); }));
      else if (this.filter === 'trash') g.appendChild(this.empty('The Trash is empty', 'Files you delete stay here for 30 days.'));
      else if (this.filter !== 'all') g.appendChild(this.empty('Nothing here yet', 'Files that match this filter show up here.'));
      else g.appendChild(this.empty('No files yet', '', 'New part', () => this.newFile('part')));
      return;
    }
    list.forEach((f, i) => g.appendChild(this.card(f, i)));
  }

  empty(title, text, action, run) {
    const e = h('div', 'fv-empty');
    e.innerHTML = `<div class="fv-empty-art">${FI.part}</div><h3>${esc(title)}</h3>${text ? `<p>${text}</p>` : ''}`;
    if (action) { const b = h('button', 'btn primary fv-pill', `<span>${esc(action)}</span>`); b.onclick = run; e.appendChild(b); }
    return e;
  }

  card(f, i) {
    const trash = this.filter === 'trash';
    const cur = this.app.server.link?.id === f.id;
    const c = h('article', 'fv-card' + (cur ? ' current' : ''));
    c.tabIndex = 0;
    c.style.setProperty('--i', Math.min(i, 12));
    c.dataset.id = f.id;
    const th = h('div', 'fv-thumb');
    if (f.thumb) {
      const img = h('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.src = f.thumb;
      img.onerror = () => { img.remove(); th.classList.add('none'); };
      img.onload = () => th.classList.add('loaded');
      th.appendChild(img);
    } else if (!(f.counts?.features || f.counts?.components || f.counts?.imported || f.counts?.sketches)) {
      th.classList.add('none'); // empty: nothing to draw
    } else {
      // no picture yet: ask the server to draw one (it renders models the AI made)
      const img = h('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.src = `/api/docs/${encodeURIComponent(f.id)}/thumb?v=${f.version}`;
      img.onerror = () => { img.remove(); th.classList.add('none'); };
      img.onload = () => th.classList.add('loaded');
      th.appendChild(img);
    }
    th.insertAdjacentHTML('beforeend', `<span class="fv-ph">${f.kind === 'assembly' ? FI.assembly : FI.part}</span>`);
    th.insertAdjacentHTML('beforeend', `<span class="fv-kind">${f.kind === 'assembly' ? 'Assembly' : 'Part'}</span>`);
    if (cur) th.insertAdjacentHTML('beforeend', '<span class="fv-cur">Open</span>');
    const meta = h('div', 'fv-meta');
    const nm = h('b'); nm.textContent = f.name; nm.title = f.name;
    const sub = h('span');
    sub.textContent = trash ? `Deleted ${ago(f.deleted)}` : `${f.by === 'claude' ? 'AI edited' : 'Edited'} ${ago(f.updated)}`;
    const sub2 = h('span', 'fv-detail'); sub2.textContent = `${detail(f)}${f.size ? ' · ' + KB(f.size) : ''}`;
    if (f.by === 'claude' && !trash) meta.classList.add('by-ai');
    meta.append(nm, sub, sub2);
    const more = h('button', 'fv-more', FI.more); more.setAttribute('aria-label', `Actions for ${f.name}`); more.title = 'Actions';
    more.onclick = (e) => { e.stopPropagation(); const r = more.getBoundingClientRect(); this.menu(f, r.right - 200, r.bottom + 4); };
    c.append(th, meta, more);
    c.onclick = () => (trash ? this.menu(f, ...this.menuAt(c)) : this.openFile(f));
    c.onkeydown = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); c.onclick(); }
      if (e.key === 'F2' && !trash) { e.preventDefault(); this.rename(f, nm); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !trash) { e.preventDefault(); this.trashFile(f); }
      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        const all = [...this.grid.querySelectorAll('.fv-card:not(.skel)')];
        const k = all.indexOf(c);
        const cols = this.layout === 'list' ? 1 : Math.max(1, Math.round(this.grid.clientWidth / c.offsetWidth));
        const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
        all[Math.max(0, Math.min(all.length - 1, k + step))]?.focus();
      }
    };
    c.oncontextmenu = (e) => { e.preventDefault(); this.menu(f, e.clientX, e.clientY); };
    nm.ondblclick = (e) => { if (trash) return; e.stopPropagation(); this.rename(f, nm); };
    return c;
  }

  menuAt(el) { const r = el.getBoundingClientRect(); return [r.left + 16, r.top + 40]; }

  menu(f, x, y) {
    if (this.filter === 'trash') {
      contextMenu(x, y, [
        { label: 'Restore', icon: null, run: () => this.untrash(f) },
        '-',
        { label: 'Delete forever...', run: () => this.purge(f) },
      ]);
      return;
    }
    contextMenu(x, y, [
      { label: 'Open', run: () => this.openFile(f) },
      { label: 'Open in new tab', run: () => window.open(`/?doc=${encodeURIComponent(f.id)}`, '_blank', 'noopener') },
      '-',
      { label: 'Rename', key: 'F2', run: () => this.rename(f, this.grid.querySelector(`[data-id="${CSS.escape(f.id)}"] .fv-meta b`)) },
      { label: 'Duplicate', run: () => this.duplicate(f) },
      { label: 'Download .osk', run: () => this.download(f) },
      { label: 'Version history...', run: () => this.history(f) },
      '-',
      { label: 'Move to Trash', key: 'Del', run: () => this.trashFile(f) },
    ]);
  }

  // ---------------------------------------------------------------- actions
  async openFile(f) {
    const app = this.app;
    if (app.server.link?.id === f.id) { this.close(); return; }
    if (!(await app.confirmLeaveDraft())) return;
    const card = this.grid?.querySelector(`[data-id="${CSS.escape(f.id)}"]`);
    card?.classList.add('opening');
    const ok = await app.server.open(f.id, { quiet: true });
    card?.classList.remove('opening');
    if (ok) { this.close(); app.status(`Opened ${f.name}. Changes save by themselves.`); }
  }

  async newFile(kind) {
    const app = this.app;
    if (!(await app.confirmLeaveDraft())) return;
    const ok = await app.server.createAndOpen(kind);
    if (ok) this.close();
  }

  async upload(files) {
    const app = this.app;
    const okTypes = /\.(osk|json|step|stp|brd|zip)$/i;
    const bad = files.filter((f) => !okTypes.test(f.name));
    if (bad.length) message('Upload', `OpenSketch cannot open ${esc(bad.map((f) => f.name).join(', '))}. Use OpenSketch (.osk), STEP (.step, .stp), EAGLE (.brd) or a .zip holding one of them.`);
    const good = files.filter((f) => okTypes.test(f.name));
    if (!good.length) return;
    let last = null;
    for (const file of good) {
      const t = app.toast?.(`Uploading ${file.name}...`, 0);
      try {
        const doc = await app.readDocFile(file);
        if (!Array.isArray(doc.features) && doc.type !== 'assembly') throw new Error('Not an OpenSketch part or assembly');
        const name = (doc.name && !/^Part1$|^Assembly1$/.test(doc.name) ? doc.name : file.name.replace(/\.[^.]+$/, '')).slice(0, 120);
        last = await this.req('POST', '/api/docs', { name, doc });
        app.toast?.(`${file.name} is in your Files.`);
      } catch (err) { message('Upload', `Could not upload ${esc(file.name)}: ${esc(err.message)}`); }
      t?.close?.();
    }
    if (good.length === 1 && last) {
      await this.openFile({ id: last.id, name: last.name });
      if (app.isImportable(good[0])) app.featureworks?.offer();
      return;
    }
    this.load();
  }

  rename(f, nameEl) {
    if (!nameEl) return;
    const inp = h('input', 'fv-rename'); inp.value = f.name; inp.setAttribute('aria-label', 'File name');
    nameEl.replaceWith(inp);
    inp.focus(); inp.select();
    let done = false;
    const finish = async (save) => {
      if (done) return; done = true;
      const v = inp.value.trim();
      inp.replaceWith(nameEl);
      if (!save || !v || v === f.name) return;
      nameEl.textContent = v;
      try {
        const r = await this.req('PATCH', `/api/docs/${encodeURIComponent(f.id)}`, { name: v });
        Object.assign(f, r);
        if (this.app.server.link?.id === f.id) this.app.server.renamedOnServer(r);
      } catch (err) { nameEl.textContent = f.name; message('Rename', esc(err.message)); }
    };
    inp.onkeydown = (e) => { e.stopPropagation(); if (e.key === 'Enter') finish(true); if (e.key === 'Escape') { e.preventDefault(); finish(false); } };
    inp.onblur = () => finish(true);
    inp.onclick = (e) => e.stopPropagation();
  }

  async duplicate(f) {
    try {
      const r = await this.req('POST', `/api/docs/${encodeURIComponent(f.id)}/duplicate`, {});
      this.items.unshift(r);
      this.renderNav(); this.renderGrid();
      this.grid.querySelector(`[data-id="${CSS.escape(r.id)}"]`)?.focus();
      this.app.toast?.(`Made ${r.name}.`);
    } catch (err) { message('Duplicate', esc(err.message)); }
  }

  async download(f) {
    try {
      const rec = await this.req('GET', `/api/docs/${encodeURIComponent(f.id)}`);
      this.app.download(new Blob([JSON.stringify(rec.doc, null, 1)], { type: 'application/json' }), `${rec.name}.osk`);
    } catch (err) { message('Download', esc(err.message)); }
  }

  async trashFile(f) {
    const app = this.app;
    if (this.trashing?.has(f.id)) return;
    (this.trashing ||= new Set()).add(f.id);
    const card = () => this.grid?.querySelector(`[data-id="${CSS.escape(f.id)}"]`);
    card()?.classList.add('working'); // dimmed at once, so the click visibly landed
    try {
      if (app.server.link?.id === f.id) app.server.flush();
      const r = await this.req('DELETE', `/api/docs/${encodeURIComponent(f.id)}`);
      this.items = this.items.filter((x) => x.id !== f.id);
      this.trash.unshift(r);
      if (app.server.link?.id === f.id) { app.server.unlink({ keepAsDraft: true }); this.trashedOpen = f.id; this.trashedUndo = app.undoStack.length; }
      this.renderNav(); this.renderGrid();
      app.toast?.(`Moved ${f.name} to the Trash.`, 6000, { label: 'Undo', run: () => this.untrash(r) });
    } catch (err) { card()?.classList.remove('working'); message('Move to Trash', esc(err.message)); } finally { this.trashing.delete(f.id); }
  }

  async untrash(f) {
    try {
      const r = await this.req('POST', `/api/docs/${encodeURIComponent(f.id)}/restore`);
      this.trash = this.trash.filter((x) => x.id !== f.id);
      this.items = [r, ...this.items.filter((x) => x.id !== r.id)];
      this.renderNav(); this.renderGrid();
      this.app.toast?.(`Restored ${f.name}.`);
      // the file that was open comes back: link the editor to it again (nothing was saved in between)
      if (this.trashedOpen === f.id && !this.app.server.linked && this.app.undoStack.length === this.trashedUndo) { this.trashedOpen = null; this.app.dirty = false; await this.app.server.open(f.id, { quiet: true }); this.renderGrid(); }
    } catch (err) { message('Restore', esc(err.message)); }
  }

  purge(f) {
    dialog({ title: 'Delete forever', cls: 'fv-dlg', body: `<p class="fv-p">Delete <b>${esc(f.name)}</b> and its version history for good? This cannot be undone.</p>`, buttons: [
      { label: 'Cancel' },
      { label: 'Delete forever', primary: true, danger: true, run: () => {
        this.req('DELETE', `/api/docs/${encodeURIComponent(f.id)}?forever=1`).then(() => {
          this.trash = this.trash.filter((x) => x.id !== f.id); this.renderNav(); this.renderGrid();
        }, (err) => message('Delete forever', esc(err.message)));
      } },
    ] });
  }

  async history(f) {
    let vs;
    try { vs = await this.req('GET', `/api/docs/${encodeURIComponent(f.id)}/versions`); } catch (err) { message('Version history', esc(err.message)); return; }
    const body = h('div', 'fv-hist');
    const cur = h('div', 'fv-hrow cur', `<span class="v">v${f.version}</span><span class="w"><b>Current version</b><i></i></span><span class="t">${esc(ago(f.updated))}</span>`);
    cur.querySelector('i').textContent = `${f.by === 'claude' ? 'AI' : 'You'}: ${f.summary || ''}`;
    body.appendChild(cur);
    if (!vs.length) body.appendChild(h('p', 'fv-p', 'No earlier versions yet. One is kept for every AI change and for every 10 minutes of editing.'));
    for (const v of vs) {
      const row = h('div', 'fv-hrow', `<span class="v">v${v.version}</span><span class="w"><b></b><i></i></span><span class="t">${esc(ago(v.updated))}</span>`);
      row.querySelector('b').textContent = v.summary || 'Change';
      row.querySelector('i').textContent = v.by === 'claude' ? 'AI' : 'You';
      const b = h('button', 'btn', 'Restore');
      b.onclick = async () => {
        b.disabled = true;
        try {
          const r = await this.req('POST', `/api/docs/${encodeURIComponent(f.id)}/restore_version`, { version: v.version });
          d.close();
          Object.assign(f, r);
          this.renderGrid();
          if (this.app.server.link?.id === f.id) this.app.server.poll(true);
          this.app.toast?.(`Restored version ${v.version} as version ${r.version}.`);
        } catch (err) { b.disabled = false; message('Restore', esc(err.message)); }
      };
      row.appendChild(b);
      body.appendChild(row);
    }
    const d = dialog({ title: `Version history: ${f.name}`, body, cls: 'fv-dlg', buttons: [{ label: 'Done', primary: true }] });
  }
}
