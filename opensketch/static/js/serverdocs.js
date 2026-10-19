// Documents stored on the OpenSketch server, shared with Claude through the MCP endpoint.
//
// While a server document is open ("linked"), the page:
//   - follows it: polls /api/docs/<id>/head and loads each new version Claude saves (one undo step),
//   - saves your edits back about a second after you stop (PUT with the version they were based on),
//   - shows the bought parts Claude asked for as cards in the OpenSketch AI pane.
// If Claude and you both changed it, a bar asks which version to keep. Nothing is thrown away: the server
// keeps the last 50 versions.

import { dialog, message } from './ui/dialogs.js';
import { isAssembly } from './asm.js';
import { skey } from './scope.js';

const $ = (id) => document.getElementById(id);
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const POLL_MS = 1500;
const PUSH_MS = 1200;
const THUMB_MS = 20000; // at most one new picture of the model per 20 s while editing
const LAST = 'opensketch.lastDoc';
const DRAFT_LINK = 'opensketch.autosave.link';
export const LAST_KEYS = [LAST, DRAFT_LINK];
const store = { // per signed-in person (scope.js)
  get: (k) => { try { return localStorage.getItem(skey(k)); } catch (_) { return null; } },
  set: (k, v) => { try { if (v == null) localStorage.removeItem(skey(k)); else localStorage.setItem(skey(k), v); } catch (_) { /* storage off */ } },
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
    window.addEventListener('beforeunload', (e) => {
      if (this.link?.local || this.pushing) { this.flush(); e.preventDefault(); e.returnValue = ''; }
    });
    // the page is going away with unsent edits: a last save that outlives the page (small models only;
    // larger ones stay in this browser's copy and the next open asks which version to keep)
    window.addEventListener('pagehide', () => {
      const L = this.link;
      if (!L?.local || this.app.proposal) return;
      const body = JSON.stringify({ doc: this.app.rootDoc(), base_version: L.version, summary: '', requests: L.requests });
      if (body.length > 60000) return;
      try { fetch(`/api/docs/${encodeURIComponent(L.id)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }); } catch (_) { /* best effort */ }
    });
  }

  get linked() { return !!this.link; }
  static get lastDoc() { return store.get(LAST); }
  static get draftLink() { return store.get(DRAFT_LINK); }

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
    if (!r.ok) throw new Error(j.detail || j.error || `HTTP ${r.status}`);
    return j;
  }

  // ---------------------------------------------------------------- open / link
  async open(id, { quiet = false } = {}) {
    let rec;
    try { rec = await this.req('GET', `/api/docs/${encodeURIComponent(id)}`); } catch (err) {
      message('Open', `Could not open that document from the server: ${esc(err.message)}`);
      return false;
    }
    if (this.link && this.link.id !== rec.id) { this.leaveThumb(); this.flush(); clearInterval(this.pollTimer); }
    this.link = { id: rec.id, name: rec.name, version: rec.version, local: false, requests: rec.requests || [] };
    this.shownRequests = new Set();
    this.state = 'saved';
    store.set(LAST, rec.id); store.set(DRAFT_LINK, rec.id);
    await this.apply(rec, { fit: true, label: 'Open ' + rec.name });
    this.setUrl(rec.id);
    this.startPolling();
    if (!quiet) this.app.status(`Opened ${rec.name}. Your edits save by themselves; your AI's changes appear here.`);
    if (!rec.thumb || rec.thumb.version < rec.version || rec.thumb.source !== 'browser') this.scheduleThumb(1500);
    return true;
  }

  // A new empty part or assembly in the person's Files, opened.
  async createAndOpen(kind = 'part') {
    let rec;
    try { rec = await this.req('POST', '/api/docs', { name: '', kind }); } catch (err) {
      message('New', `Could not create it in your Files (${esc(err.message)}). Starting a draft in this browser instead.`);
      return false;
    }
    const ok = await this.open(rec.id, { quiet: true });
    if (ok) {
      this.app.ribbon.setTab(kind === 'assembly' ? 'Assembly' : 'Features');
      this.app.viewer.standardView('trimetric');
      if (kind === 'assembly') this.app.asm.insertPM();
      this.app.status(kind === 'assembly' ? `${rec.name} is in your Files. Insert components to start.` : `${rec.name} is in your Files. Select a plane and click Sketch to start.`);
    }
    return ok;
  }

  // Put the current draft in Files under a name the person chooses. Resolves true when saved.
  saveDraft() {
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
          dlg.close(); resolve(true);
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

  renamedOnServer(rec) {
    if (!this.link || this.link.id !== rec.id) return;
    this.link.name = rec.name; this.link.version = rec.version;
    const root = this.app.docStack.length ? this.app.docStack[0].doc : this.app.doc;
    root.name = rec.name;
    this.app.autosave();
    this.app.updateDocChrome(); this.app.tree?.render();
  }

  // Leaving a file with a picture still to send: draw it now (the snapshot is taken before the model is
  // replaced) and send it in the background.
  leaveThumb() {
    const L = this.link, app = this.app;
    if (!L || !this.thumbPending || app.proposal || app.reviewMode) return;
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

  async uploadThumb() {
    const L = this.link, app = this.app;
    if (!L || app.reviewMode) return;
    if (app.proposal || app.taskpane?.busy || app.live?.active || L.local || this.pushing) { this.scheduleThumb(3000); return; }
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
    const rec = await this.req('POST', '/api/docs', { name: name || d.name || 'Untitled', doc: d });
    this.link = { id: rec.id, name: rec.name, version: rec.version, local: false, requests: [] };
    this.state = 'saved';
    store.set(LAST, rec.id); store.set(DRAFT_LINK, rec.id);
    this.setUrl(rec.id);
    this.startPolling();
    app.dirty = false; app.updateDocChrome();
    app.status(`Saved ${rec.name} to your Files. It saves by itself from now on, and your AI can open it.`);
    this.scheduleThumb(300);
  }

  // Stop following the server document. keepAsDraft: the model stays open as an unsaved draft (its file
  // went to the Trash); otherwise the caller replaces it.
  unlink({ keepAsDraft = false } = {}) {
    if (!this.link) return;
    if (!keepAsDraft) this.flush();
    clearTimeout(this.thumbTimer);
    if (!keepAsDraft) this.leaveThumb();
    this.link = null;
    this.state = 'draft';
    clearInterval(this.pollTimer); this.pollTimer = null;
    this.hideBar();
    this.setUrl(null);
    store.set(DRAFT_LINK, null);
    if (keepAsDraft) { store.set(LAST, null); this.app.dirty = true; }
    this.app.updateDocChrome();
  }

  setUrl(id) {
    const u = new URL(location.href);
    if (id) u.searchParams.set('doc', id); else u.searchParams.delete('doc');
    history.replaceState(null, '', u);
  }

  // Load a stored record into the editor without echoing it back to the server.
  // Only the swap itself is hidden from changed(): an edit you make while it redraws is still saved.
  async apply(rec, { fit = false, label = null } = {}) {
    const app = this.app;
    app.hideContextToolbar();
    if (app.mode === 'sketch') app.exitSketch({ silent: true });
    app.closeCommand();
    if (app.docStack.length) { app.doc = app.cleanDoc(app.docStack[0].doc); app.undoStack = app.docStack[0].undo; app.redoStack = app.docStack[0].redo; app.docStack = []; }
    if (label) app.pushUndo(label);
    const wasAsm = isAssembly(app.doc);
    app.doc = rec.doc; app.doc.seq = app.doc.seq || 1000;
    app.proposal = null;
    this.applying = true;
    try { app.docChanged(); } finally { this.applying = false; }
    if (this.link) { this.link.version = rec.version; this.link.name = rec.name; this.link.local = false; this.link.requests = rec.requests || []; }
    app.dirty = false; app.updateDocChrome();
    if (fit || wasAsm !== isAssembly(app.doc)) app.ribbon.setTab(isAssembly(app.doc) ? 'Assembly' : 'Features');
    if (fit) app.viewer.setBody(null);
    this.showRequests();
    await app.regen();
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
      if (L.local || this.app.cmd || this.app.mode === 'sketch') {
        this.showBar(h); // you are in the middle of something: ask before replacing it
        return;
      }
      const rec = await this.req('GET', `/api/docs/${L.id}`);
      if (this.link !== L) return;
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

  showBar(h) {
    let bar = $('serverbar');
    if (!bar) { bar = document.createElement('div'); bar.id = 'serverbar'; bar.className = 'update-bar note'; ($('banners') || $('graphics')).appendChild(bar); }
    if (bar.dataset.v === String(h.version)) return;
    bar.dataset.v = String(h.version);
    const who = h.by === 'claude' ? 'Your AI' : 'Someone';
    this.setState('conflict');
    bar.innerHTML = `<span>${esc(who)} changed this model (${esc(h.summary || 'a change')}) while you were editing.</span>`;
    const take = document.createElement('button'); take.className = 'btn primary'; take.textContent = `Load ${who === 'Your AI' ? "the AI's" : 'their'} version`;
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
      } catch (err) { take.disabled = false; this.app.toast?.('Could not load it: ' + err.message); }
    };
    const keep = document.createElement('button'); keep.className = 'btn'; keep.textContent = 'Keep mine';
    keep.title = 'Save your version over it. Theirs stays in the version history.';
    keep.onclick = () => { this.hideBar(); this.link.version = h.version; this.link.local = true; this.push(); };
    bar.append(take, keep);
  }

  hideBar() { const b = $('serverbar'); if (b) b.remove(); if (this.state === 'conflict') this.setState(this.link?.local ? 'saving' : 'saved'); }

  // ---------------------------------------------------------------- save your edits back
  changed() {
    if (!this.link || this.applying) return;
    this.link.local = true;
    if (this.state !== 'conflict') this.setState('saving');
    clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => this.push(), PUSH_MS);
  }

  flush() { if (this.link?.local) { clearTimeout(this.pushTimer); this.push(); } }

  async push(summary = '') {
    const L = this.link;
    if (!L || !L.local || this.app.proposal) return;
    if (this.pushing) { this.pushTimer = setTimeout(() => this.push(summary), PUSH_MS); return; }
    const doc = this.app.rootDoc();
    const pushedAt = this.app.undoStack.length;
    this.pushing = (async () => {
      try {
        const rec = await this.req('PUT', `/api/docs/${L.id}`, { doc, base_version: L.version, summary, requests: L.requests });
        if (this.link !== L) return;
        L.version = rec.version; L.name = rec.name;
        if (this.app.undoStack.length === pushedAt && JSON.stringify(this.app.rootDoc()) === JSON.stringify(doc)) L.local = false;
        this.app.dirty = false;
        this.state = L.local ? 'saving' : 'saved';
        this.app.updateDocChrome();
        if (!L.local) this.scheduleThumb();
      } catch (err) {
        if (err.message === 'conflict' && err.current) this.showBar(err.current);
        else if (/No such document/.test(err.message)) { this.unlink({ keepAsDraft: true }); this.app.toast?.('This file is no longer in your Files. It stays open here as a draft: save it to keep it.', 8000); }
        else { this.setState('offline'); this.app.status('Could not save to the server (' + err.message + '). Trying again.'); }
        if (err.message !== 'conflict' && this.link === L) this.pushTimer = setTimeout(() => this.push(summary), 5000);
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
    if (added) { tp.show('ai'); this.app.status(`Claude asked for ${added} bought part${added === 1 ? '' : 's'}: see the OpenSketch AI pane.`); }
  }

  partReplaced(pid) {
    if (!this.link) return;
    this.link.requests = (this.link.requests || []).filter((r) => r.part !== pid);
  }

  // ---------------------------------------------------------------- dialogs
  // File > Open: the Files page (upload from the computer is there too).
  openDialog() { return this.app.files.open(); }

  // Connect AI: Claude, ChatGPT, Codex, Cursor... (connect.js)
  connectDialog(tab) { return import('./connect.js').then((m) => m.connectDialog(this.app, tab)); }

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
    const prev = earlier.length ? `<p class="pm-note" style="margin-top:10px">Published before:</p><ul class="srv-list" style="max-height:140px">${earlier.map((r) =>
      `<li class="srv-row"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a><span>Version ${r.version}${r.compare ? ' vs ' + r.compare : ''}, ${ago(r.created)}</span></li>`).join('')}</ul>` : '';
    const body = document.createElement('div');
    body.className = 'srv-connect';
    body.innerHTML = `<p>A read-only link to version ${this.link.version}, to send or open on a phone. It opens in OpenSketch with
      Motion Review: the joints, what changed and the checks. It shares the shapes, not the feature history, needs no password and
      does not change when the model does.</p>
      <label class="pubrow">Title <input id="pub-title" value="${esc((this.link.name || 'Review'))}"></label>
      <label class="pubrow">Compare with <select id="pub-compare"><option value="">Nothing (no comparison)</option>${opts}</select></label>
      <label class="pubrow pubcol">Notes <textarea id="pub-notes" rows="4" placeholder="What changed and why, what is still open."></textarea></label>
      <div id="pub-result"></div>${prev}`;
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
              <div class="srv-url"><input id="pub-url" readonly value="${esc(r.url)}"><button class="btn" id="pub-copy">Copy</button><a class="btn" href="${esc(r.url)}" target="_blank" rel="noopener">Open</a></div>
              <p class="pm-note">Anyone with the link can view it. Delete it from this list later if needed.</p>`;
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
