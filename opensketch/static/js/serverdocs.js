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

const $ = (id) => document.getElementById(id);
const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const POLL_MS = 1500;
const PUSH_MS = 1200;

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
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.poll(); });
  }

  get linked() { return !!this.link; }

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
    this.link = { id: rec.id, name: rec.name, version: rec.version, local: false, requests: rec.requests || [] };
    this.shownRequests = new Set();
    await this.apply(rec, { fit: true, label: 'Open ' + rec.name });
    this.setUrl(rec.id);
    this.startPolling();
    if (!quiet) this.app.status(`Opened ${rec.name} from the server. Changes Claude makes appear here; your edits are saved back.`);
    return true;
  }

  // Put the current document on the server (or open it there) and link to it.
  async saveAsNew() {
    const app = this.app;
    const d = app.rootDoc();
    const rec = await this.req('POST', '/api/docs', { name: d.name || 'Untitled', doc: d });
    this.link = { id: rec.id, name: rec.name, version: rec.version, local: false, requests: [] };
    this.setUrl(rec.id);
    this.startPolling();
    app.dirty = false; app.updateDocChrome();
    app.status(`Saved ${rec.name} on the server. Claude can now open it (it is in list_documents).`);
  }

  unlink() {
    if (!this.link) return;
    this.flush();
    this.link = null;
    clearInterval(this.pollTimer); this.pollTimer = null;
    this.hideBar();
    this.setUrl(null);
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

  async poll() {
    const L = this.link;
    if (!L || document.hidden || this.polling || this.pushing) return;
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
      const who = rec.by === 'claude' ? 'Claude' : 'Another window';
      await this.apply(rec, { label: `${who}: ${rec.summary || 'change'}` });
      this.app.status(`${who}: ${rec.summary || 'changed the model'} (version ${rec.version}). Ctrl+Z undoes it.`);
    } catch (_) { /* offline or restarting: try again */ } finally { this.polling = false; }
  }

  showBar(h) {
    let bar = $('serverbar');
    if (!bar) { bar = document.createElement('div'); bar.id = 'serverbar'; bar.className = 'update-bar note'; $('graphics').appendChild(bar); }
    if (bar.dataset.v === String(h.version)) return;
    bar.dataset.v = String(h.version);
    const who = h.by === 'claude' ? 'Claude' : 'Someone';
    bar.innerHTML = `<span>${esc(who)} changed this model (${esc(h.summary || 'a change')}) while you were editing.</span>`;
    const take = document.createElement('button'); take.className = 'btn primary'; take.textContent = `Load ${who === 'Claude' ? "Claude's" : 'their'} version`;
    take.onclick = async () => {
      this.hideBar();
      if (this.app.mode === 'sketch') this.app.exitSketch({ silent: true });
      this.app.closeCommand();
      clearTimeout(this.pushTimer);
      const rec = await this.req('GET', `/api/docs/${this.link.id}`);
      await this.apply(rec, { label: `${who}: ${rec.summary || 'change'}` });
    };
    const keep = document.createElement('button'); keep.className = 'btn'; keep.textContent = 'Keep mine';
    keep.title = 'Save your version over it. Theirs stays in the version history.';
    keep.onclick = () => { this.hideBar(); this.link.version = h.version; this.link.local = true; this.push(); };
    bar.append(take, keep);
  }

  hideBar() { const b = $('serverbar'); if (b) b.remove(); }

  // ---------------------------------------------------------------- save your edits back
  changed() {
    if (!this.link || this.applying) return;
    this.link.local = true;
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
        this.app.dirty = false; this.app.updateDocChrome();
      } catch (err) {
        if (err.message === 'conflict' && err.current) this.showBar(err.current);
        else this.app.status('Could not save to the server (' + err.message + '). Will try again.');
        if (err.message !== 'conflict') this.pushTimer = setTimeout(() => this.push(summary), 5000);
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
  async openDialog() {
    let list;
    try { list = await this.req('GET', '/api/docs'); } catch (err) { message('Open from Server', esc(err.message)); return; }
    const body = document.createElement('div');
    body.className = 'srv-list';
    if (!list.length) body.innerHTML = '<div class="pm-note">No documents on the server yet. Ask Claude to create one, or use File > Save to Server.</div>';
    for (const r of list) {
      const row = document.createElement('button');
      row.className = 'srv-row' + (this.link?.id === r.id ? ' cur' : '');
      row.innerHTML = `<b>${esc(r.name)}</b><span>${r.kind === 'assembly' ? 'Assembly' : 'Part'} - ${esc(r.by === 'claude' ? 'Claude' : 'you')}: ${esc(r.summary || '')} - ${esc(ago(r.updated))}</span>`;
      row.onclick = () => { close(); this.open(r.id); };
      body.appendChild(row);
    }
    const d = dialog({ title: 'Open from Server', body, buttons: [{ label: 'Cancel' }], cls: 'srv-dlg' });
    const close = () => d?.close ? d.close() : document.querySelector('.srv-dlg')?.closest('.dlg-back')?.remove();
  }

  async connectDialog() {
    let c;
    try { c = await this.req('GET', '/api/connect'); } catch (err) { message('Connect Claude', esc(err.message)); return; }
    const warn = [];
    if (!c.password_set) warn.push(`<div class="srv-warn"><b>Set a password first.</b> Anyone with the OpenSketch address could use it, and the AI chat would bill your Anthropic key. ${c.codespace ? 'On GitHub: Settings &gt; Codespaces &gt; Secrets, add <code>OPENSKETCH_PASSWORD</code> for this repository, then restart the codespace.' : 'Set <code>OPENSKETCH_PASSWORD</code> where the server runs, then restart it.'}</div>`);
    if (c.codespace) warn.push('<div class="srv-warn"><b>Make the port public.</b> In the codespace, open the Ports tab, right-click port 8000, Port Visibility &gt; Public. Claude cannot reach a private port. Keep the codespace open while you use Claude with it.</div>');
    const body = `<div class="srv-connect">
      <p>Let Claude build in OpenSketch from the Claude app. You watch the model change here.</p>
      ${warn.join('')}
      <ol>
        <li>In Claude (claude.ai or the desktop app), go to Customize &gt; Connectors and click Add custom connector.</li>
        <li>Name it <b>OpenSketch</b>, paste this address as the server URL, and choose <b>No sign-in</b>:</li>
      </ol>
      <div class="srv-url"><input id="srv-mcp-url" readonly value="${esc(c.mcp_url)}"><button class="btn" id="srv-copy">Copy</button></div>
      <p class="pm-note">The address is the key: keep it private. Changing the password changes it.</p>
      <ol start="3"><li>In a chat, turn OpenSketch on (+ &gt; Connectors) and ask, for example: "In OpenSketch, design a wall bracket for a 20 kg shelf with off-the-shelf screws." Open the link Claude gives you to watch it.</li></ol>
    </div>`;
    dialog({ title: 'Connect Claude', body, buttons: [{ label: 'Close', primary: true }], cls: 'srv-dlg' });
    const btn = $('srv-copy'), inp = $('srv-mcp-url');
    if (btn) btn.onclick = async () => {
      try { await navigator.clipboard.writeText(inp.value); } catch (_) { inp.select(); document.execCommand?.('copy'); }
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
    };
  }
}
