// Documents stored on the OpenSketch server, shared with Claude through the MCP endpoint.
//
// While a server document is open ("linked"), the page:
//   - follows it: polls /api/docs/<id>/head and loads each new version Claude saves (one undo step),
//   - saves your edits back about a second after you stop (PUT with the version they were based on),
//   - shows the bought parts Claude asked for as cards in the OpenSketch AI pane.
// If Claude and you both changed it, a bar asks which version to keep; the other one stays in the version
// history (store.py keeps every AI change, restore and rename, and one version per 10 minutes of autosaves).

import { dialog, message } from './ui/dialogs.js';
import { isAssembly } from './asm.js';
import { skey, scopeKnown } from './scope.js';

const $ = (id) => document.getElementById(id);
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const POLL_MS = 1500;
const PUSH_MS = 1200;
const THUMB_MS = 20000; // at most one new picture of the model per 20 s while editing
const sleep = (ms) => new Promise((ok) => setTimeout(ok, Math.max(0, ms)));
const sameModel = (a, b) => JSON.stringify({ ...a, name: '' }) === JSON.stringify({ ...b, name: '' }); // the server keeps the file's name
const LAST = 'opensketch.lastDoc';
const DRAFT_LINK = 'opensketch.autosave.link'; // older pages: the browser copy was a file's, not a draft
const UNSENT = 'opensketch.unsent.'; // + file id: edits the server does not have yet
const OFFER = '.offer'; // a kept copy offered back with "Restore my changes", set aside until answered
const LEFT = 'opensketch.leftNew'; // this tab removed its untouched new file as it went away (sessionStorage)
export const LAST_KEYS = [LAST, DRAFT_LINK];
export const store = { // per signed-in person (scope.js); off until the page knows who that is
  get: (k) => { if (!scopeKnown()) return null; try { return localStorage.getItem(skey(k)); } catch (_) { return null; } },
  set: (k, v) => {
    if (!scopeKnown()) return false;
    try { if (v == null) localStorage.removeItem(skey(k)); else localStorage.setItem(skey(k), v); return true; } catch (_) { return false; } // storage off or full
  },
};

function ago(t) {
  const s = Math.max(0, Date.now() / 1000 - t);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(t * 1000).toLocaleDateString();
}

export class ServerDocs {
  constructor(app) {
    this.app = app;
    this.link = null; // {id, name, version, local: unsaved local edits, requests}
    this.applying = false;
    this.pushTimer = null;
    this.pushing = null;
    this.pollTimer = null;
    this.shownRequests = new Set();
    this.state = 'draft'; // draft | saved | saving | offline | conflict
    this.thumbTimer = null;
    this.thumbAt = 0;
    // back from the browser's page cache after the untouched new file was removed: start again cleanly
    window.addEventListener('pageshow', (e) => { if (e.persisted && this.leftNew) location.reload(); });
    // switching tabs or apps (phones may discard a hidden page): send the edits now rather than in a second
    document.addEventListener('visibilitychange', () => { if (document.hidden) { if (this.link?.local) this.flush(); else this.sendThumbNow(); } });
    window.addEventListener('beforeunload', (e) => {
      if (this.link?.local || this.pushing || this.app.proposal) { this.flush(); e.preventDefault(); e.returnValue = ''; } // an AI change waiting is only in this page
    });
    // the page is going away with unsent edits: a last save that outlives the page (small models only;
    // every model's unsent edits also stay in this browser, and opening the file again offers them back)
    window.addEventListener('pagehide', () => {
      const L = this.link;
      if (this.leaveFile(L, { keepalive: true })) { try { sessionStorage.setItem(LEFT, JSON.stringify({ id: L.id, kind: L.untouched })); } catch (_) { /* */ } this.leftNew = true; }
      if (!L?.local || this.app.proposal) return;
      const body = JSON.stringify({ doc: this.app.rootDoc(), base_version: L.version, summary: '', requests: L.requests });
      if (body.length > 60000) return;
      try { fetch(`/api/docs/${encodeURIComponent(L.id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }); } catch (_) { /* best effort */ }
    });
  }

  get linked() { return !!this.link; }
  static get lastDoc() { return store.get(LAST); }
  static get draftLink() { return store.get(DRAFT_LINK); }

  // ---------------------------------------------------------------- unsent edits, kept in this browser
  // Edits the server does not have yet (offline, a closed tab, a crash) are kept per file until a save gets
  // through; opening the file again puts them back (or offers to, when the file changed since).
  keepUnsent() {
    const L = this.link;
    if (!L) return;
    const ok = store.set(UNSENT + L.id, JSON.stringify({ id: L.id, name: L.name, base: L.version, at: Date.now(), doc: this.app.rootDoc() }));
    if (!ok && scopeKnown() && !this.copyWarned && this.state === 'offline') {
      this.copyWarned = true;
      this.app.toast?.('This model is too big for the browser to keep a copy. Keep this tab open until it is saved.', 9000);
    }
  }

  forgetLegacy() { store.set(DRAFT_LINK, null); }

  unsent(id) { try { return JSON.parse(store.get(UNSENT + id)) || null; } catch (_) { return null; } }
  dropUnsent(id) { store.set(UNSENT + id, null); }
  unsentOffer(id) { try { return JSON.parse(store.get(UNSENT + id + OFFER)) || null; } catch (_) { return null; } }

  // After opening a file: edits from this browser that never reached the server come back.
  offerUnsent(rec) {
    // a copy offered before and not answered yet comes first (edits made since were kept under the usual key)
    const offered = this.unsentOffer(rec.id);
    const u = offered || this.unsent(rec.id);
    if (!u?.doc || this.link?.id !== rec.id) return;
    const settle = () => { store.set(UNSENT + rec.id + OFFER, null); if (this.unsent(rec.id)?.at === u.at) this.dropUnsent(rec.id); };
    if (sameModel(u.doc, rec.doc)) { settle(); return; }
    const app = this.app;
    const put = () => {
      if (this.link?.id !== rec.id) return;
      store.set(UNSENT + rec.id + OFFER, null);
      app.pushUndo('Unsaved changes from this browser');
      app.doc = { ...u.doc, name: this.link.name };
      app.docChanged(); // saved now, over the server version (that one stays in the version history)
      app.regen();
    };
    const when = new Date(u.at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    if (u.base === rec.version) { // nobody changed the file since: they simply go back in
      put();
      app.toast?.(`Your changes from ${when} had not reached the server. They are back and saved now. Ctrl+Z takes them out.`, 8000);
      return;
    }
    // set aside until answered: an edit made meanwhile keeps its own copy and never writes over these
    store.set(UNSENT + rec.id + OFFER, JSON.stringify(u));
    this.showNote(`This browser has changes to ${rec.name} from ${when} that never reached the server. The file has changed since.`, [
      { label: 'Restore my changes', primary: true, title: 'Put them back and save them. The current version stays in the version history.', run: () => put() },
      { label: 'Discard them', run: () => settle() },
    ]);
  }

  // A bar above the model with a question about this file's versions (one at a time).
  showNote(text, buttons) {
    let bar = $('serverbar');
    if (!bar) { bar = document.createElement('div'); bar.id = 'serverbar'; bar.className = 'update-bar note'; ($('banners') || $('graphics'))?.appendChild(bar); }
    delete bar.dataset.v;
    bar.innerHTML = '';
    const span = document.createElement('span'); span.textContent = text; bar.appendChild(span);
    for (const b of buttons) {
      const e = document.createElement('button'); e.className = 'btn' + (b.primary ? ' primary' : ''); e.textContent = b.label;
      if (b.title) e.title = b.title;
      e.onclick = () => { bar.remove(); b.run(); };
      bar.appendChild(e);
    }
  }

  setState(st) {
    if (this.state === st) return;
    this.state = st;
    this.app.updateDocChrome();
  }

  async req(method, url, body) {
    const r = await fetch(url, { method, headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, cache: 'no-store' });
    if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); throw new Error('Sign in first'); }
    const j = await r.json().catch(() => ({}));
    if (r.status === 409) { const e = new Error('conflict'); e.current = j.current; throw e; }
    if (!r.ok) { const e = new Error(j.detail || j.error || `HTTP ${r.status}`); e.status = r.status; throw e; }
    return j;
  }

  // ---------------------------------------------------------------- open / link
  // onShown: called once the model is in the editor, before its rebuild (the Files page closes then, and the
  // editor's own loading pill says what is happening).
  async open(id, { quiet = false, onShown = null } = {}) {
    let rec;
    try { rec = await this.req('GET', `/api/docs/${encodeURIComponent(id)}`); } catch (err) {
      message('Open', `Could not open that document from the server: ${esc(err.message)}`);
      return false;
    }
    return this.openRecord(rec, { quiet, onShown });
  }

  // Link the editor to a record and show it. untouched: the kind, for a file New just made here (removed again
  // if it is left without a change, see leaveFile).
  async openRecord(rec, { quiet = false, onShown = null, untouched = null } = {}) {
    if (this.link && this.link.id !== rec.id) { const L = this.link; this.leaveThumb(); await this.flush(); clearInterval(this.pollTimer); this.leaveFile(L); }
    if (!this.link && !this.app.dirtyDraft()) this.app.forgetDraft(); // nothing worth keeping in the draft slot
    this.link = { id: rec.id, name: rec.name, version: rec.version, local: false, requests: rec.requests || [], untouched };
    this.shownRequests = new Set();
    this.state = 'saved';
    this.hideBar(); // a question about the previous file's versions goes with it
    store.set(LAST, rec.id);
    this.setUrl(rec.id);
    await this.apply(rec, { fit: true, fresh: true, onShown, loading: `Opening ${rec.name}` });
    this.offerUnsent(rec);
    this.startPolling();
    if (!quiet) this.app.status(`Opened ${rec.name}. Your edits save by themselves; your AI's changes appear here.`);
    // store.py could not read the file and served its newest good version; the next save writes over the damaged copy
    if (rec.recovered) this.app.toast?.(`This file was damaged on the server, so its last good version (version ${rec.recovered.from_version}) opened. Your next change saves over the damaged copy.`, 10000);
    if (!rec.thumb || rec.thumb.version < rec.version || rec.thumb.source !== 'browser') this.scheduleThumb(1500);
    return true;
  }

  // A new empty part or assembly in the person's Files, opened (the POST answers with the whole record).
  async createAndOpen(kind = 'part', { onShown = null } = {}) {
    let rec;
    try { rec = await this.req('POST', '/api/docs', { name: '', kind }); } catch (err) {
      message('New', `Could not create it in your Files (${esc(err.message)}). Starting a draft in this browser instead.`);
      return false;
    }
    const ok = await this.openRecord(rec, { quiet: true, onShown, untouched: kind });
    if (ok) {
      this.app.ribbon.setTab(kind === 'assembly' ? 'Assembly' : 'Features');
      this.app.viewer.standardView('trimetric');
      if (kind === 'assembly') this.app.asm.insertPM();
      this.app.status(kind === 'assembly' ? `${rec.name} is in your Files. Insert components to start.` : `${rec.name} is in your Files. Select a plane and click Sketch to start.`);
    }
    return ok;
  }

  // Leaving a file. One New made here and never touched is removed again (the server keeps it if anything,
  // anyone, changed it), so empty "Part N" files do not pile up in Files.
  leaveFile(L, { keepalive = false } = {}) {
    if (!L?.untouched || L.local) return false;
    try { fetch(`/api/docs/${encodeURIComponent(L.id)}/discard`, { method: 'POST', keepalive }).catch(() => {}); } catch (_) { /* best effort */ }
    return true;
  }

  // The same, from a new page (the old one's keepalive request may not have gone out). Resolves when answered.
  discardNow(id) {
    return fetch(`/api/docs/${encodeURIComponent(id)}/discard`, { method: 'POST' }).catch(() => {});
  }

  // This tab left an untouched new file when it went away (a reload): open a new one in its place.
  static discardedOnLeave(id) {
    try {
      const d = JSON.parse(sessionStorage.getItem(LEFT) || 'null');
      sessionStorage.removeItem(LEFT);
      return d && d.id === id ? d : null;
    } catch (_) { return null; }
  }

  // Put the current draft in Files under a name the person chooses. Resolves true when saved (at once when the
  // model is a file already, so a second click never makes a second copy).
  saveDraft() {
    if (this.link) return Promise.resolve(true);
    const app = this.app;
    const d = app.rootDoc();
    return new Promise((resolve) => {
      const body = document.createElement('div');
      body.className = 'save-dlg';
      body.innerHTML = `<label class="acct-l" for="sv-name">Name</label><input id="sv-name" class="acct-i" autocomplete="off" spellcheck="false">
        <p class="acct-note">Saved to your Files on this server. From then on it saves by itself, keeps its version history, and your AI can open it.</p><div class="acct-err" role="alert"></div>`;
      const inp = body.querySelector('input'); inp.value = d.name || 'Untitled';
      inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); go(); } });
      let busy = false;
      const go = async () => {
        if (busy) return;
        const name = inp.value.trim();
        if (!name) { body.querySelector('.acct-err').textContent = 'Give it a name.'; return; }
        busy = true;
        try {
          if (app.doc.name !== name && !app.docStack.length) app.doc.name = name;
          await this.saveAsNew(name);
          resolve(true); dlg.close(); // resolve first: closing answers false for every other way out
        } catch (err) { busy = false; body.querySelector('.acct-err').textContent = 'Could not save: ' + err.message; }
      };
      const dlg = dialog({ title: 'Save to Files', body, cls: 'acct-dlg', onClose: () => resolve(false), buttons: [
        { label: 'Download .osk instead', run: () => { app.downloadOsk(); resolve(false); } },
        { label: 'Cancel', run: () => resolve(false) },
        { label: 'Save', primary: true, run: () => { go(); return false; } },
      ] });
      setTimeout(() => { inp.focus(); inp.select(); }, 0);
    });
  }

  // The open file was renamed (title bar or Files). The rename is a new version on the server; take its number
  // only when it is the very next one (nothing else changed there), else the next save would pass the
  // version check without this page ever loading the other change: the poll or the bar deals with it.
  renamedOnServer(rec) {
    if (!this.link || this.link.id !== rec.id) return;
    this.link.name = rec.name; this.link.untouched = null;
    if (rec.version === this.link.version + 1) this.link.version = rec.version;
    const root = this.app.docStack.length ? this.app.docStack[0].doc : this.app.doc;
    root.name = rec.name;
    this.app.autosave();
    this.app.updateDocChrome(); this.app.tree?.render();
  }

  // Leaving a file with a picture still to send: draw it now (the snapshot is taken before the model is
  // replaced) and send it in the background.
  leaveThumb() {
    const L = this.link, app = this.app;
    if (!L || !this.thumbPending || app.proposal || app.reviewMode || app.mode === 'sketch' || app.docStack?.length) return;
    this.thumbPending = false;
    clearTimeout(this.thumbTimer);
    const version = L.version + (L.local ? 1 : 0);
    let p;
    try { p = app.viewer.snapshot(); } catch (_) { return; }
    p.then((blob) => blob && fetch(`/api/docs/${encodeURIComponent(L.id)}/thumb?version=${version}`, { method: 'PUT', headers: { 'Content-Type': blob.type || 'image/png' }, body: blob }))
      .catch(() => { /* best effort */ });
  }

  // ---------------------------------------------------------------- pictures for the Files page
  scheduleThumb(delay = 800) {
    if (!this.link) return;
    this.thumbPending = true;
    clearTimeout(this.thumbTimer);
    const wait = Math.max(delay, this.thumbAt + THUMB_MS - Date.now());
    this.thumbTimer = setTimeout(() => this.uploadThumb(), wait);
  }

  // Files is opening or the page is being hidden: the picture waiting for its 20 s turn goes now.
  sendThumbNow() {
    if (!this.thumbPending || !this.link) return null;
    clearTimeout(this.thumbTimer);
    this.thumbAt = 0;
    return this.uploadThumb();
  }

  async uploadThumb() {
    const L = this.link, app = this.app;
    if (!L || app.reviewMode) return;
    // not while the person is turning the view or working in a command, a sketch or a part opened from the
    // assembly (the picture would show that, not the file); the picture is taken when things are still
    if (app.proposal || app.taskpane?.busy || app.live?.active || L.local || this.pushing || app.viewer.isNavigating?.() || app.cmd || app.mode === 'sketch' || app.docStack?.length) { this.scheduleThumb(3000); return; }
    this.thumbAt = Date.now();
    this.thumbPending = false;
    let blob = null;
    try { blob = await app.viewer.snapshot(); } catch (_) { blob = null; }
    if (!blob || this.link !== L) return;
    try {
      await fetch(`/api/docs/${encodeURIComponent(L.id)}/thumb?version=${L.version}`, { method: 'PUT', headers: { 'Content-Type': blob.type || 'image/png' }, body: blob });
    } catch (_) { /* the next save tries again */ }
  }

  // Put the current document on the server (or open it there) and link to it.
  async saveAsNew(name) {
    const app = this.app;
    const d = app.rootDoc();
    const wasDraft = !this.link;
    const rec = await this.req('POST', '/api/docs', { name: name || d.name || 'Untitled', doc: d });
    this.link = { id: rec.id, name: rec.name, version: rec.version, local: false, requests: [] };
    this.state = 'saved';
    store.set(LAST, rec.id);
    if (wasDraft) app.forgetDraft(); // the draft is a file now
    this.setUrl(rec.id);
    this.startPolling();
    app.dirty = false; app.updateDocChrome();
    app.status(`Saved ${rec.name} to your Files. It saves by itself from now on, and your AI can open it.`);
    this.scheduleThumb(300);
  }

  // Stop following the server document. keepAsDraft: the model stays open as an unsaved draft (its file
  // went to the Trash); otherwise the caller replaces it.
  unlink({ keepAsDraft = false } = {}) {
    const L = this.link;
    if (!L) return;
    if (!keepAsDraft) { this.flush(); this.leaveFile(L); }
    clearTimeout(this.thumbTimer);
    if (!keepAsDraft) this.leaveThumb();
    this.link = null;
    this.state = 'draft';
    clearInterval(this.pollTimer); this.pollTimer = null;
    this.hideBar();
    this.setUrl(null);
    if (keepAsDraft) { store.set(LAST, null); this.dropUnsent(L.id); this.app.dirty = true; this.app.autosave(); }
    this.app.updateDocChrome();
  }

  setUrl(id) {
    const u = new URL(location.href);
    if (id) u.searchParams.set('doc', id); else u.searchParams.delete('doc');
    history.replaceState(null, '', u);
  }

  // Load a stored record into the editor without echoing it back to the server.
  // Only the swap itself is hidden from changed(): an edit you make while it redraws is still saved.
  // fresh: another file takes the editor and its undo history starts empty (undo is per document, as in
  // SOLIDWORKS), so Ctrl+Z right after opening a file never puts the previous model into it and saves that.
  // Otherwise (a newer version of this file) the swap is one undo step named by label.
  async apply(rec, { fit = false, label = null, fresh = false, onShown = null, loading = null } = {}) {
    const app = this.app;
    app.hideContextToolbar();
    if (app.mode === 'sketch') app.exitSketch({ silent: true });
    app.closeCommand();
    if (fresh) app.leaveDocument();
    else if (app.docStack.length) { // a part open from its assembly: the undo step keeps that part's edits
      const root = app.rootDoc();
      app.undoStack = app.docStack[0].undo; app.redoStack = app.docStack[0].redo; app.docStack = [];
      app.doc = root;
    }
    if (label && !fresh) app.pushUndo(label);
    const wasAsm = isAssembly(app.doc);
    app.doc = rec.doc; app.doc.seq = app.doc.seq || 1000;
    app.proposal = null;
    this.applying = true;
    try { app.docChanged(); } finally { this.applying = false; }
    if (this.link) { this.link.version = rec.version; this.link.name = rec.name; this.link.local = false; this.link.requests = rec.requests || []; if (!fresh) this.link.untouched = null; }
    app.dirty = false; app.updateDocChrome();
    if (fit || wasAsm !== isAssembly(app.doc)) app.ribbon.setTab(isAssembly(app.doc) ? 'Assembly' : 'Features');
    if (fit) app.viewer.setBody(null);
    this.showRequests();
    onShown?.();
    await app.regen(false, loading);
    if (fit) app.viewer.zoomToFit();
  }

  // ---------------------------------------------------------------- follow Claude
  startPolling() {
    clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => this.poll(), POLL_MS);
  }

  async poll(force = false) {
    const L = this.link;
    if (!L || this.polling || this.pushing) return;
    if (!force && !(this.app.isActive ? this.app.isActive() : !document.hidden)) { this.app.lastIdleSeen = true; return; } // idle: let the server sleep
    this.polling = true;
    try {
      const h = await this.req('GET', `/api/docs/${L.id}/head`);
      if (this.link !== L || h.version <= L.version) return;
      if (this.busyHere()) {
        this.showBar(h); // you are in the middle of something: ask before replacing it
        return;
      }
      const rec = await this.req('GET', `/api/docs/${L.id}`);
      if (this.link !== L) return;
      if (this.busyHere()) { this.showBar(h); return; } // you started something while it downloaded
      const who = rec.by === 'claude' ? 'Your AI' : 'Another window';
      await this.apply(rec, { label: `${who}: ${rec.summary || 'change'}` });
      this.app.status(`${who}: ${rec.summary || 'changed the model'} (version ${rec.version}). Ctrl+Z undoes it.`);
      if (rec.by === 'claude') this.scheduleThumb(1500);
      if (this.state === 'offline') this.setState('saved');
    } catch (err) {
      if (/No such document/.test(err.message || '') && this.link === L) { // deleted or moved to the Trash elsewhere
        this.unlink({ keepAsDraft: true });
        this.app.toast?.('This file was deleted elsewhere. It stays open here as a draft: save it to keep it.', 8000);
      }
    } finally { this.polling = false; }
  }

  // Something here a newer version would throw away: unsent edits, an open command or sketch, a part open
  // from its assembly, or an AI change being built or waiting to be accepted.
  busyHere() {
    const app = this.app;
    return !!(this.link?.local || this.pushing || app.cmd || app.mode === 'sketch' || app.docStack.length || app.proposal || app.taskpane?.busy || app.live?.active);
  }

  showBar(h) {
    let bar = $('serverbar');
    if (!bar) { bar = document.createElement('div'); bar.id = 'serverbar'; bar.className = 'update-bar note'; ($('banners') || $('graphics')).appendChild(bar); }
    if (bar.dataset.v === String(h.version)) return;
    bar.dataset.v = String(h.version);
    const who = h.by === 'claude' ? 'Your AI' : 'Another window';
    this.setState('conflict');
    bar.innerHTML = `<span>${esc(who)} changed this model (${esc(h.summary || 'a change')}) while you were editing.</span>`;
    const take = document.createElement('button'); take.className = 'btn primary'; take.textContent = `Load ${who === 'Your AI' ? "the AI's" : 'that'} version`;
    take.onclick = async () => {
      take.disabled = true;
      clearTimeout(this.pushTimer);
      try { await this.pushing; } catch (_) { /* a save in flight finishes (or fails) first */ }
      if (this.link) this.link.local = false; // their version replaces the local edits
      clearTimeout(this.pushTimer);
      try {
        const rec = await this.req('GET', `/api/docs/${this.link.id}`);
        this.hideBar();
        if (this.app.mode === 'sketch') this.app.exitSketch({ silent: true });
        this.app.closeCommand();
        await this.apply(rec, { label: `${who}: ${rec.summary || 'change'}` });
        this.dropUnsent(rec.id); // their version replaced the edits (Ctrl+Z brings them back)
      } catch (err) { take.disabled = false; this.app.toast?.('Could not load it: ' + err.message); }
    };
    const keep = document.createElement('button'); keep.className = 'btn'; keep.textContent = 'Keep mine';
    keep.title = 'Save your version over it. Theirs stays in the version history.';
    // a named save, not an autosave: the version it replaces always stays in the history
    keep.onclick = () => { this.hideBar(); this.link.version = h.version; this.link.local = true; this.push('Kept this version over another change'); };
    bar.append(take, keep);
  }

  hideBar() { const b = $('serverbar'); if (b) b.remove(); if (this.state === 'conflict') this.setState(this.link?.local ? 'saving' : 'saved'); }

  // ---------------------------------------------------------------- save your edits back
  changed() {
    if (!this.link || this.applying) return;
    this.link.local = true;
    this.link.untouched = null;
    if (this.state !== 'conflict') this.setState('saving');
    clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => this.push(), PUSH_MS);
  }

  // Send the unsent edits now. Resolves true when the server has them all; false when it cannot take them yet
  // (offline, a conflict to settle, an AI change waiting) or after `wait` ms. Everything that leaves the file
  // (open another, rename, Move to Trash, sign out, reload) waits for it, so the last edits always go first.
  async flush(wait = 8000) {
    const L = this.link;
    if (!L) return true;
    const end = Date.now() + wait;
    clearTimeout(this.pushTimer);
    while (this.link === L && Date.now() < end) {
      if (this.pushing) { await Promise.race([this.pushing, sleep(end - Date.now())]); continue; }
      if (!L.local || this.app.proposal || this.state === 'conflict') break;
      if (!(await this.push())) break;
    }
    return !L.local;
  }

  // One save. Resolves true when it reached the server.
  async push(summary = '') {
    const L = this.link;
    if (!L || !L.local || this.app.proposal) return false;
    if (this.pushing) { clearTimeout(this.pushTimer); this.pushTimer = setTimeout(() => { if (this.link === L) this.push(summary); }, PUSH_MS); return false; }
    const doc = this.app.rootDoc();
    const pushedAt = this.app.undoStack.length;
    this.pushing = (async () => {
      try {
        let rec;
        // each save is named, so a 409 that carries one of ours is our own save whose answer was lost
        const saveId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
        (L.sent ||= []).push(saveId);
        if (L.sent.length > 20) L.sent.shift();
        try { rec = await this.req('PUT', `/api/docs/${L.id}`, { doc, base_version: L.version, summary, requests: L.requests, save_id: saveId }); } catch (err) {
          // a save that did reach the server, but whose answer was lost (a restart), comes back as a conflict with
          // this very model: it is saved, not changed elsewhere
          if (err.message !== 'conflict' || !err.current?.doc || !sameModel(err.current.doc, doc)) throw err;
          rec = err.current;
        }
        L.version = rec.version; L.name = rec.name;
        const sent = JSON.stringify(doc);
        const copy = this.unsent(L.id);
        if (copy && JSON.stringify(copy.doc) === sent) this.dropUnsent(L.id); // the server has what this browser kept
        if (this.link !== L) return true; // another file is open now: this one is saved, nothing to redraw
        if (this.app.undoStack.length === pushedAt && JSON.stringify(this.app.rootDoc()) === sent) L.local = false;
        if (!L.local) this.dropUnsent(L.id); else this.app.autosaveNow(); // the kept copy follows the new base version
        this.app.dirty = false;
        this.state = L.local ? 'saving' : 'saved';
        this.app.updateDocChrome();
        if (L.local) { clearTimeout(this.pushTimer); this.pushTimer = setTimeout(() => this.push(), PUSH_MS); } // changed meanwhile
        else this.scheduleThumb();
        return true;
      } catch (err) {
        if (this.link !== L) return false; // the file left the editor; its edits stay in this browser (unsent copy)
        if (err.message === 'conflict' && err.current && err.current.version <= L.version) { clearTimeout(this.pushTimer); this.pushTimer = setTimeout(() => this.push(summary), 300); } // our own rename landed first
        else if (err.message === 'conflict' && err.current?.save_id && L.sent?.includes(err.current.save_id)) {
          // an earlier save of ours reached the server but its answer was lost: build on it and send what is left
          L.version = err.current.version;
          clearTimeout(this.pushTimer); this.pushTimer = setTimeout(() => this.push(summary), 300);
        }
        else if (err.message === 'conflict' && err.current) this.showBar(err.current);
        else if (/No such document/.test(err.message)) { this.unlink({ keepAsDraft: true }); this.app.toast?.('This file is no longer in your Files. It stays open here as a draft: save it to keep it.', 8000); }
        else if (err.status === 413 || err.status === 507) {
          // the server refuses it for good (file too big, Files full, disk nearly full): say why, keep the copy here,
          // and do not send it again until the model changes
          this.refused = err.message; this.setState('refused');
          this.app.toast?.(`Not saved: ${err.message} Your edits are kept in this browser. File > Save As > .osk downloads them.`, 12000);
          return false;
        }
        else { this.setState('offline'); this.app.status('Could not save to the server (' + err.message + '). Trying again.'); }
        if (err.message !== 'conflict' && this.link === L) { clearTimeout(this.pushTimer); this.pushTimer = setTimeout(() => this.push(summary), 5000); }
        return false;
      } finally { this.pushing = null; }
    })();
    return this.pushing;
  }

  // ---------------------------------------------------------------- bought parts Claude asked for
  showRequests() {
    const reqs = this.link?.requests || [];
    const tp = this.app.taskpane;
    let added = 0;
    for (const r of reqs) {
      const key = this.link.id + ':' + r.part;
      if (this.shownRequests.has(key)) continue;
      this.shownRequests.add(key);
      tp.add({ role: 'request', part: r.part, description: r.description, mcmaster: r.mcmaster, url: r.url });
      added++;
    }
    if (added) { tp.show('ai'); this.app.status(`Your AI asked for ${added} bought part${added === 1 ? '' : 's'}: see the OpenSketch AI pane.`); }
  }

  partReplaced(pid) {
    if (!this.link) return;
    this.link.requests = (this.link.requests || []).filter((r) => r.part !== pid);
  }

  // ---------------------------------------------------------------- dialogs
  // File > Open: the Files page (upload from the computer is there too).
  openDialog() { return this.app.files.open(); }

  // Connect AI: Claude, ChatGPT, Codex, Cursor... (connect.js)
  // (loaded when first used: after a deploy the new file may not fit the page's older ones, so it asks for a reload)
  connectDialog(tab) {
    return import('./connect.js').then((m) => m.connectDialog(this.app, tab),
      () => this.app.toast?.('OpenSketch was updated. Reload the page to use Connect AI.', 8000, { label: 'Reload', run: () => location.reload() }));
  }

  // ---------------------------------------------------------------- File > Publish Review
  // A frozen, shareable page of this version (model, joint sliders, what changed, checks); see review.py.
  async publishDialog() {
    const app = this.app;
    if (!this.link) {
      const ok = await this.saveDraft(); // a review is made from a file in Files
      if (!ok) return;
    }
    this.flush?.();
    let versions = [], earlier = [];
    try { versions = await this.req('GET', `/api/docs/${encodeURIComponent(this.link.id)}/versions`); } catch (_) { /* no history yet */ }
    try { earlier = await this.req('GET', `/api/reviews?doc_id=${encodeURIComponent(this.link.id)}`); } catch (_) { /* none */ }
    const opts = versions.filter((v) => v.version < this.link.version)
      .map((v) => `<option value="${v.version}">Version ${v.version}: ${esc(v.summary || '')} (${esc(v.by || '')}, ${ago(v.updated)})</option>`).join('');
    const prev = earlier.length ? `<p class="pm-note pub-prev" style="margin-top:10px">Published before:</p><ul class="srv-list pub-list" style="max-height:140px">${earlier.map((r) =>
      `<li class="srv-row pubrev" data-token="${esc(r.token)}"><div><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a><span>Version ${r.version}${r.compare ? ' vs ' + r.compare : ''}, ${ago(r.created)}</span></div><button type="button" class="btn pub-del">Delete link</button></li>`).join('')}</ul>` : '';
    const body = document.createElement('div');
    body.className = 'srv-connect';
    body.innerHTML = `<p>A read-only link to version ${this.link.version}, to send or open on a phone. It opens in OpenSketch with
      Motion Review: the joints, what changed and the checks. It shares the shapes, not the feature history, needs no password and
      does not change when the model does.</p>
      <label class="pubrow">Title <input id="pub-title" value="${esc((this.link.name || 'Review'))}"></label>
      <label class="pubrow">Compare with <select id="pub-compare"><option value="">Nothing (no comparison)</option>${opts}</select></label>
      <label class="pubrow pubcol">Notes <textarea id="pub-notes" rows="4" placeholder="What changed and why, what is still open."></textarea></label>
      <div id="pub-result"></div>${prev}`;
    // Unpublish: the link stops working at once (DELETE /api/reviews/<token>)
    const unpublish = (token, gone) => dialog({ title: 'Delete review link', cls: 'fv-dlg',
      body: '<p class="fv-p">Delete this link? Anyone who has it can no longer open the review.</p>', buttons: [
        { label: 'Cancel' },
        { label: 'Delete link', primary: true, danger: true, run: () => {
          this.req('DELETE', `/api/reviews/${encodeURIComponent(token)}`).then(gone, (err) => message('Delete review link', esc(err.message)));
        } },
      ] });
    body.addEventListener('click', (e) => {
      const btn = e.target.closest('.pub-del');
      if (!btn) return;
      const row = btn.closest('[data-token]');
      unpublish(row.dataset.token, () => {
        row.remove();
        if (!body.querySelector('.pub-list .pubrev')) { body.querySelector('.pub-list')?.remove(); body.querySelector('.pub-prev')?.remove(); }
      });
    });
    const d = dialog({ title: 'Publish Review', body, cls: 'srv-dlg', buttons: [
      { label: 'Publish', primary: true, run: () => {
        const btn = d.el.querySelector('.dlg-f .btn.primary');
        const out = body.querySelector('#pub-result');
        btn.disabled = true; btn.textContent = 'Publishing...';
        out.innerHTML = '<p class="pm-note">Solving the joints and checking for clashes. This takes a few seconds.</p>';
        const cmp = body.querySelector('#pub-compare').value;
        this.req('POST', '/api/reviews', { doc_id: this.link.id, compare_version: cmp ? +cmp : null,
          title: body.querySelector('#pub-title').value, notes: body.querySelector('#pub-notes').value })
          .then((r) => {
            const c = r.checks, bits = [];
            bits.push(c.errors ? `${c.errors} rebuild or mate error(s)` : 'no errors');
            bits.push(c.clashes_as_shown ? `${c.clashes_as_shown} clash(es) as shown` : 'no clashes as shown');
            for (const j of c.joints) bits.push(`${esc(j.name)}: ${j.clashes ? j.clashes + ' clash(es) in its travel' : 'clear through its travel'}`);
            for (const k of c.contacts || []) bits.push(`${esc(k.name)}: ${k.apart ? `apart at ${k.apart} pose(s)` : 'touching'}`);
            out.innerHTML = `<p>Published. ${bits.join('; ')}.</p>
              <div class="srv-url" data-token="${esc(r.token)}"><input id="pub-url" readonly value="${esc(r.url)}"><button type="button" class="btn" id="pub-copy">Copy</button><a class="btn" href="${esc(r.url)}" target="_blank" rel="noopener">Open</a><button type="button" class="btn pub-del">Delete link</button></div>
              <p class="pm-note">Anyone with the link can view it until you delete it. Deleting the file for good deletes its links too.</p>`;
            body.querySelector('#pub-copy').onclick = async () => { try { await navigator.clipboard.writeText(r.url); } catch (_) { body.querySelector('#pub-url').select(); } };
            btn.textContent = 'Publish again'; btn.disabled = false;
          })
          .catch((err) => { out.innerHTML = `<p class="eqbad">Could not publish: ${esc(err.message)}</p>`; btn.textContent = 'Publish'; btn.disabled = false; });
        return false;
      } },
      { label: 'Close' },
    ] });
  }
}
