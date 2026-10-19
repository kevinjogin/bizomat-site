// OpenSketch application controller.

import * as THREE from 'three';
import { Viewer, STD_FRAMES, COLORS, viewQuat } from './viewer.js';
import { Sketcher, TOOL_INFO } from './sketch/sketcher.js';
import { startOffset } from './sketch/offset-command.js';
import { drawInactiveSketch, pointsOf, entityPolyline } from './sketch/draw.js';
import { solveSketch } from './sketch/solver.js';
import { projSeg, fmt } from './sketch/geom2d.js';
import { PropertyManager } from './ui/pm.js';
import { dialog, message, modifyBox, contextMenu, closeMenus } from './ui/dialogs.js';
import { Ribbon } from './ui/ribbon.js';
import { FeatureTree } from './ui/tree.js';
import { TaskPane } from './ui/taskpane.js';
import { buildCommands } from './commands.js';
import { SPECS, metaFor, buildSpec, defaultsFor, nextName, metaKey, featureIcon } from './features.js';
import { icon } from './icons.js';
import { AssemblyMode, isAssembly, newAssembly, hexColor } from './asm.js';
import { LivePlayer } from './live.js';
import { Toolbox } from './toolbox.js';
import { SectionView } from './section.js';
import { ServerDocs } from './serverdocs.js';
import { Account } from './account.js';
import { DesignPanel } from './design.js';
import { MotionReview } from './review.js';
import { FilesView, FI } from './files.js';
import { escapeHtml as esc, featureSketchIds, dependentFeatureIds, removeFeatures, measurementData } from './model-utils.js';

const $ = (id) => document.getElementById(id);
const clone = (o) => JSON.parse(JSON.stringify(o));
const STD_PLANES = ['Front Plane', 'Top Plane', 'Right Plane'];
const MB = (n) => (n / 1e6).toFixed(1) + ' MB';
// When the upload never reached OpenSketch (the reply is not ours), say what the status means.
function importFailText(status, size) {
  if (status === 413) return `The upload (${MB(size)}) was too big for the connection to the server.`;
  if (status === 502 || status === 503 || status === 504) return 'The connection to the server gave up before the import finished. Try again; if it keeps failing, the file may be too big for the Codespaces connection.';
  if (status === 401 || status === 403) return 'The server refused the upload (signed out of the Codespace?). Reload the page and try again.';
  return `The server did not answer properly (HTTP ${status || 'no status'}). Reload the page and try again.`;
}
const AUTOSAVE = 'opensketch.autosave.v1';

const MATERIALS = [
  ['ABS', 1.02e-6], ['PC/ABS', 1.15e-6], ['Nylon 6/6', 1.14e-6], ['PLA', 1.24e-6], ['Polypropylene', 0.9e-6],
  ['1060 Alloy', 2.7e-6], ['6061 Alloy', 2.7e-6], ['AISI 1020', 7.9e-6], ['AISI 304', 8.0e-6], ['Brass', 8.5e-6], ['Copper', 8.9e-6], ['Titanium Ti-6Al-4V', 4.43e-6],
];

export function newDoc() {
  return { version: 1, name: 'Part1', units: 'mm', features: [], rollback: null, seq: 1 };
}

function frameForFace(normal, center) {
  const n = new THREE.Vector3(...normal).normalize();
  let x;
  if (Math.abs(n.y) > 0.99) x = new THREE.Vector3(1, 0, 0);
  else if (Math.abs(n.z) > 0.99) x = new THREE.Vector3(Math.sign(n.z), 0, 0);
  else if (Math.abs(n.x) > 0.99) x = new THREE.Vector3(0, 0, -Math.sign(n.x));
  else x = new THREE.Vector3(0, 1, 0).cross(n).normalize();
  const y = n.clone().cross(x).normalize();
  const o = n.clone().multiplyScalar(new THREE.Vector3(...center).dot(n));
  const r = (v) => [v.x, v.y, v.z].map((c) => Math.abs(c) < 1e-12 ? 0 : +c.toFixed(9));
  return { origin: r(o), xdir: r(x), ydir: r(y), normal: r(n) };
}

export class App {
  constructor() {
    this.doc = newDoc();
    this.undoStack = []; this.redoStack = [];
    this.selection = [];
    this.mode = 'part'; this.viewer?.setSketchDim?.(false);
    this.cmd = null;
    this.view = { planes: false, origins: true, sketches: true, relations: true };
    this.statusById = {};
    this.result = null;
    this.regenSeq = 0;
    this.labelsEl = $('labels');
    this.viewer = new Viewer($('viewport'), this.labelsEl);
    this.sketcher = new Sketcher(this);
    this.pm = new PropertyManager($('propmgr'), this);
    this.commands = buildCommands(this);
    this.ribbon = new Ribbon(this);
    this.tree = new FeatureTree(this);
    this.design = new DesignPanel(this);
    this.taskpane = new TaskPane(this);
    this.server = new ServerDocs(this);
    this.account = new Account(this);
    this.asm = new AssemblyMode(this);
    this.live = new LivePlayer(this);
    this.toolbox = new Toolbox(this);
    this.section = new SectionView(this);
    this.review = new MotionReview(this);
    this.files = new FilesView(this);
    this.reviewMode = typeof window.OPENSKETCH_REVIEW === 'string'; // a shared review link: read-only, no server
    this.docStack = []; // Open Part from an assembly: the assembly waits here
    this.forConstruction = false;
    this.polygonSides = 6;
    this.filletRadius = 5;
    this.buildMgrTabs();
    this.buildHeadsUp();
    this.bindCanvas();
    this.bindKeys();
    this.bindSplitter();
    this.viewer.afterRender.push(() => this.afterRender());
    $('fileinput').addEventListener('change', (e) => this.loadFile(e.target.files[0]));
    $('sb-help').onclick = () => this.shortcutsDialog();
    const th = document.querySelector('#titlebar .title-help');
    if (th) { th.setAttribute('role', 'button'); th.tabIndex = 0; th.onclick = () => this.helpMenu(th); th.onkeydown = (e) => { if (e.key === 'Enter') this.helpMenu(th); }; }
    $('sb-units').onclick = (e) => contextMenu(e.clientX, e.clientY - 120, [{ head: 'Unit system' }, { label: 'MMGS (millimeter, gram, second)', run: () => {} }]);
    this.bindDocTabs();
    if (this.reviewMode) {
      const b = document.querySelector('#titlebar .brand');
      if (b) b.innerHTML = '<span class="brand-text">OpenSketch</span>';
      this.review.loadShared(window.OPENSKETCH_REVIEW);
      this.status('Read-only review. Drag to rotate, scroll to zoom; move the joints in Motion Review.');
      return;
    }
    this.buildBrand();
    this.bindDrop();
    import('./aikeys.js').then((m) => m.refreshAIStatus(this));
    this.status('Ready. Select a plane and click Sketch to start.');
    this.watchActivity();
    this.watchVersion();
    this.startup();
  }

  // What opens first: a ?doc link (from the AI, or a reload), else the file this browser had open (fresh
  // from the server), else an unsaved draft kept in this browser, else the Files page.
  async startup() {
    const q = new URLSearchParams(location.search);
    const docId = q.get('doc');
    const draftLink = ServerDocs.draftLink;
    const hasDraft = this.restore();
    this.updateDocChrome();
    if (docId) {
      if (!(await this.server.open(docId, { quiet: true }))) { this.regen().then(() => this.viewer.zoomToFit(false)); this.files.open(); }
    } else if (draftLink) {
      const ok = await this.server.open(draftLink, { quiet: true }).catch(() => false);
      if (!ok) {
        this.regen().then(() => this.viewer.zoomToFit(false));
        if (hasDraft) { this.dirty = true; this.updateDocChrome(); this.status('Could not reach that file on the server. This is the copy kept in this browser.'); }
      }
    } else if (hasDraft) {
      this.dirty = true;
      this.updateDocChrome();
      await this.regen();
      this.viewer.zoomToFit(false);
      this.status('Unsaved draft from your last visit. Save it to keep it in your Files (Ctrl+S).');
    } else {
      this.regen().then(() => this.viewer.zoomToFit(false));
      this.files.open();
    }
    if (q.get('view') === 'files' && !this.files.isOpen) this.files.open();
    if (q.get('new') === 'part' || q.get('new') === 'assembly') this.files.newFile(q.get('new'));
    this.handleLaunchFiles();
    const u = new URL(location.href);
    for (const k of ['view', 'new', 'source']) u.searchParams.delete(k);
    history.replaceState(null, '', u);
  }

  // Installed app: .osk and STEP files opened with OpenSketch from the computer (File Handling API).
  handleLaunchFiles() {
    if (!('launchQueue' in window)) return;
    window.launchQueue.setConsumer(async (params) => {
      const files = [];
      for (const h of params.files || []) { try { files.push(await h.getFile()); } catch (_) { /* no access */ } }
      if (files.length) this.files.upload(files);
    });
  }

  // Title bar: the wordmark opens the Files page.
  buildBrand() {
    const b = document.querySelector('#titlebar .brand');
    if (!b) return;
    b.innerHTML = '<span class="brand-text">OpenSketch</span>';
    b.setAttribute('role', 'button'); b.tabIndex = 0; b.title = 'Files (Ctrl+O)';
    b.onclick = () => this.files.open();
    b.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.files.open(); } };
    const fb = document.createElement('button');
    fb.className = 'tb-files'; fb.innerHTML = `${FI.files}<span>Files</span>`; fb.title = 'Your files (Ctrl+O)';
    fb.onclick = () => this.files.open();
    b.after(fb);
    // phones: the FeatureManager slides over the model
    const tt = document.createElement('button');
    tt.className = 'tb-tree'; tt.title = 'FeatureManager'; tt.setAttribute('aria-label', 'Show the FeatureManager');
    tt.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h13"/></svg>';
    tt.onclick = () => document.body.classList.toggle('left-open');
    b.before(tt);
    $('graphics').addEventListener('pointerdown', () => document.body.classList.remove('left-open'));
  }

  // A model is on screen (anything to go back to from the Files page).
  hasModel() { const d = this.rootDoc(); return isAssembly(d) ? (d.components || []).length > 0 || Object.keys(d.parts || {}).length > 0 : (d.features || []).length > 0 || !!this.server.linked; }

  // The open model is an unsaved draft with something in it (not in Files).
  dirtyDraft() {
    if (this.server.linked || this.reviewMode) return false;
    const d = this.rootDoc();
    return !!this.dirty && (isAssembly(d) ? (d.components || []).length > 0 : (d.features || []).length > 0);
  }

  // Before something replaces an unsaved draft: offer to save it. Resolves true to go ahead.
  confirmLeaveDraft() {
    if (!this.dirtyDraft()) return Promise.resolve(true);
    const name = this.rootDoc().name || 'Untitled';
    return new Promise((resolve) => {
      let answered = false;
      const done = (v) => { if (!answered) { answered = true; resolve(v); } };
      dialog({ title: 'Save your draft?', cls: 'acct-dlg', onClose: () => done(false),
        body: `<p class="fv-p"><b>${esc(name)}</b> is only in this browser. Save it to your Files before you leave it?</p>`,
        buttons: [
          { label: "Don't save", run: () => { this.dirty = false; done(true); } },
          { label: 'Cancel', run: () => done(false) },
          { label: 'Save to Files', primary: true, run: () => { setTimeout(async () => done(await this.server.saveDraft()), 0); } },
        ] });
    });
  }

  // The codespace pulls each push to main and restarts the server (.devcontainer/run.sh). When the
  // server's version changes, offer a reload; the work in progress is kept by autosave.
  watchVersion() {
    let first = null;
    const check = async () => {
      if (!this.isActive()) { this.lastIdleSeen = true; return; } // let a hosted server sleep while nobody is looking
      let v;
      try { v = await (await fetch('/api/version', { cache: 'no-store' })).json(); } catch (_) { return; } // restarting
      if (first === null) first = v.version;
      this.showUpdateBar(v.version !== first, v.note || '');
    };
    check();
    setInterval(check, 30000);
    this.versionCheck = check;
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.markActive(); });
  }

  // The page talks to the server in the background (Claude's changes, update check) only while it is
  // in use: visible and touched in the last 15 minutes. A hosted server (Fly.io) stops when no requests
  // arrive, so an idle tab costs nothing; coming back catches up at once.
  watchActivity() {
    this.idleMs = 15 * 60 * 1000;
    this.lastActivity = Date.now();
    let last = 0;
    const mark = () => { const t = Date.now(); if (t - last > 1000) { last = t; this.markActive(); } };
    for (const ev of ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart']) window.addEventListener(ev, mark, { passive: true, capture: true });
  }

  isActive() { return !document.hidden && Date.now() - (this.lastActivity || 0) < (this.idleMs || 900000); }

  markActive() {
    const wasIdle = Date.now() - (this.lastActivity || 0) >= (this.idleMs || 900000) || this.lastIdleSeen; // a check was skipped
    this.lastActivity = Date.now();
    this.lastIdleSeen = false;
    if (wasIdle) { this.server?.poll(); this.versionCheck?.(); }
  }

  showUpdateBar(updated, note) {
    let bar = $('updatebar');
    if (!updated && !note) { if (bar) bar.remove(); return; }
    const key = (updated ? 'u' : '') + note;
    if (bar && bar.dataset.key === key) return;
    if (bar && bar.dataset.key === 'dismissed:' + key) return;
    if (!bar) { bar = document.createElement('div'); bar.id = 'updatebar'; $('graphics').appendChild(bar); }
    bar.dataset.key = key;
    bar.className = updated ? 'update-bar' : 'update-bar note';
    bar.innerHTML = `<span>${esc(updated ? 'OpenSketch was updated. Reload to use the new version. Your model is kept.' + (note ? ' ' + note : '') : note)}</span>`;
    if (updated) {
      const b = document.createElement('button'); b.className = 'btn primary'; b.textContent = 'Reload';
      b.onclick = () => { this.autosaveNow(); location.reload(); };
      bar.appendChild(b);
    }
    const x = document.createElement('button'); x.className = 'btn'; x.textContent = 'Later'; x.title = 'Hide this message';
    x.onclick = () => { bar.dataset.key = 'dismissed:' + key; bar.style.display = 'none'; };
    bar.appendChild(x);
    bar.style.display = '';
  }

  // ------------------------------------------------------------------ document
  get shownDoc() { return this.proposal || this.doc; }
  get isAsm() { return isAssembly(this.shownDoc); }
  featureById(id) { return (this.shownDoc.features || []).find((f) => f.id === id) || null; }
  lastSketchId() {
    const abs = this.absorbed();
    const s = [...(this.doc.features || [])].reverse().find((f) => f.type === 'sketch' && !abs.has(f.id));
    return s ? s.id : null;
  }

  uid(p) {
    const used = new Set();
    for (const f of this.doc.features || []) { used.add(f.id); for (const e of f.entities || []) used.add(e.id); for (const c of f.constraints || []) used.add(c.id); }
    let id;
    do { id = p + (this.doc.seq++); } while (used.has(id));
    return id;
  }

  cleanDoc(d = this.doc) { return JSON.parse(JSON.stringify(d, (k, v) => (k.startsWith('_') ? undefined : v))); }

  pushUndo(label) {
    if (this.proposal) this.rejectProposal(true);
    this.undoStack.push({ label, json: JSON.stringify(this.cleanDoc()) });
    if (this.undoStack.length > 200) this.undoStack.shift();
    this.redoStack = [];
  }

  restoreJSON(json) {
    this.doc = JSON.parse(json);
    if (this.mode === 'sketch') {
      if (this.featureById(this.sketcher.skId)) { this.sketcher.sel.clear(); this.sketcher.solve(); this.sketcher.render(); }
      else this.exitSketch({ silent: true });
    }
    this.closeCommand();
    this.setSelection([]);
    this.docChanged();
    this.regen();
  }

  undo() {
    if (this.mode === 'sketch' && this.sketcher.tool && this.sketcher.tool.stage > 0) { this.sketcher.cancelTool(); return; }
    const u = this.undoStack.pop();
    if (!u) { this.status('Nothing to undo'); return; }
    this.redoStack.push({ label: u.label, json: JSON.stringify(this.cleanDoc()) });
    this.restoreJSON(u.json);
    this.status('Undo ' + u.label);
  }

  redo() {
    const r = this.redoStack.pop();
    if (!r) return;
    this.undoStack.push({ label: r.label, json: JSON.stringify(this.cleanDoc()) });
    this.restoreJSON(r.json);
    this.status('Redo ' + r.label);
  }

  // Change the document, then rebuild.
  commit(label, fn, regen = true) {
    this.pushUndo(label);
    fn();
    this.docChanged();
    if (regen) this.regen(); else this.tree.render();
  }

  docChanged() {
    this.dirty = true;
    this.autosave();
    this.server?.changed(); // a server document: save the edit back (debounced)
    this.updateDocChrome();
    this.tree.render();
    this.design?.refresh();
  }

  // The document as saved: when a part is open from its assembly, the assembly with that part in it.
  rootDoc() {
    if (!this.docStack.length) return this.cleanDoc();
    const root = this.cleanDoc(this.docStack[0].doc);
    let cur = root;
    this.docStack.forEach((f, i) => {
      const inner = i + 1 < this.docStack.length ? this.cleanDoc(this.docStack[i + 1].doc) : { ...this.cleanDoc(), type: 'part' };
      cur.parts[f.pid] = inner;
      cur = inner;
    });
    return root;
  }

  // The open model is also kept in this browser (offline copy, unsaved drafts). Written at most a few times a
  // second: serialising a large model on every edit made dragging feel heavy.
  autosave() {
    if (this.reviewMode) return; // never overwrite the visitor's own work with a shared review
    if (this._autosaveTimer) return;
    this._autosaveTimer = setTimeout(() => this.autosaveNow(), 400);
    if (!this._autosaveBound) {
      this._autosaveBound = true;
      const flush = () => { if (this._autosaveTimer) this.autosaveNow(); };
      window.addEventListener('pagehide', flush);
      document.addEventListener('visibilitychange', () => { if (document.hidden) flush(); });
    }
  }

  autosaveNow() {
    clearTimeout(this._autosaveTimer); this._autosaveTimer = null;
    if (this.reviewMode) return;
    try { localStorage.setItem(AUTOSAVE, JSON.stringify(this.rootDoc())); } catch (_) { /* full or unavailable: Files keeps the record */ }
  }

  restore() {
    try {
      const s = localStorage.getItem(AUTOSAVE);
      if (s) {
        const d = JSON.parse(s);
        if (d && (Array.isArray(d.features) || isAssembly(d))) {
          this.doc = d;
          return isAssembly(d) ? (d.components || []).length > 0 : d.features.length > 0;
        }
      }
    } catch (_) { /* ignore */ }
    return false;
  }

  // Title, status bar and the "editing part in assembly" bar.
  updateDocChrome() {
    const f = this.docStack[this.docStack.length - 1];
    const root = this.docStack.length ? this.docStack[0].doc : this.doc;
    this.renderDocTitle(f, root);
    this.updateBreadcrumbs();
    $('sb-editing').textContent = this.isAsm ? 'Editing Assembly' : f ? 'Editing Part in Assembly' : 'Editing Part';
    const bar = $('editbar');
    if (f) {
      bar.innerHTML = `${icon('part', 16)}<span>Editing <b>${esc(this.doc.name)}</b> from <b>${esc(root.name)}</b></span>`;
      const b = document.createElement('button'); b.className = 'btn primary'; b.innerHTML = `${icon('returnasm', 14)} Return to Assembly`;
      b.onclick = () => this.asm.returnToAssembly();
      bar.appendChild(b);
    }
    bar.classList.toggle('hidden', !f);
    this.ribbon?.render();
  }

  // Title bar centre: the file name (click to rename) and whether it is saved.
  renderDocTitle(f, root) {
    const el = $('doctitle');
    if (!el) return;
    const sv = this.server;
    const st = this.reviewMode ? null : !sv?.linked ? 'draft' : sv.state;
    const label = { draft: 'Draft', saved: 'Saved', saving: 'Saving', offline: 'Offline', conflict: 'Changed elsewhere' }[st] || '';
    const tip = { draft: 'Only in this browser. Save it to your Files (Ctrl+S).', saved: 'Saved to your Files. Your AI sees this version.', saving: 'Saving to your Files...', offline: 'Cannot reach the server. Your edits are kept and saved when it is back.', conflict: 'The file changed elsewhere. Choose which version to keep.' }[st] || '';
    const name = f ? `${this.doc.name}` : (root.name || 'Untitled');
    const ctx = f ? ` in ${root.name}` : '';
    if (!this._dt) {
      el.innerHTML = '<button class="dt-name" title="Rename"></button><span class="dt-ctx"></span><button class="dt-state"></button>';
      this._dt = { name: el.querySelector('.dt-name'), ctx: el.querySelector('.dt-ctx'), state: el.querySelector('.dt-state') };
      this._dt.name.onclick = () => this.renameDoc();
      this._dt.state.onclick = () => { if (!this.server.linked) this.server.saveDraft(); else if (this.server.state === 'offline') this.server.flush(); };
    }
    this._dt.name.textContent = name;
    this._dt.ctx.textContent = ctx;
    this._dt.state.className = 'dt-state ' + (st || 'none');
    this._dt.state.innerHTML = st === 'draft' ? '<span>Draft</span><b>Save to Files</b>' : `<i></i><span>${label}</span>`;
    this._dt.state.title = tip;
    this._dt.state.hidden = !st;
    document.title = `${name}${st === 'draft' && this.dirty ? ' (draft)' : ''} - OpenSketch`;
  }

  // Rename the open file (title bar click): on the server when it is in Files.
  renameDoc() {
    if (this.reviewMode || this._renaming) return;
    const btn = this._dt?.name;
    if (!btn) return;
    const target = this.docStack.length ? this.doc : (this.docStack[0]?.doc || this.doc);
    const inp = document.createElement('input');
    inp.className = 'dt-rename'; inp.value = target.name || ''; inp.setAttribute('aria-label', 'File name');
    inp.style.width = Math.max(120, btn.offsetWidth + 40) + 'px';
    btn.replaceWith(inp); inp.focus(); inp.select();
    this._renaming = true;
    let done = false;
    const finish = async (save) => {
      if (done) return; done = true; this._renaming = false;
      inp.replaceWith(btn);
      const v = inp.value.trim().slice(0, 120);
      if (!save || !v || v === target.name) return;
      if (this.server.linked && !this.docStack.length) {
        this.server.flush();
        try {
          const r = await this.server.req('PATCH', `/api/docs/${encodeURIComponent(this.server.link.id)}`, { name: v });
          this.server.renamedOnServer(r);
        } catch (err) { message('Rename', esc(err.message)); }
      } else this.commit('Rename', () => { target.name = v; }, false);
      this.updateDocChrome();
    };
    inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') finish(true); if (e.key === 'Escape') finish(false); });
    inp.addEventListener('blur', () => finish(true));
  }

  bindDocTabs() {
    const tabs = [...document.querySelectorAll('#doctabs .doctab')];
    tabs.forEach((t, i) => {
      t.onclick = () => {
        tabs.forEach((x) => x.classList.toggle('active', x === t));
        if (i === 2) {
          if (!this.isAsm) { this.toast('Motion Study replays an assembly. Open or create an assembly first.'); tabs[0].click(); return; }
          this.asm.playSequence().then(() => tabs[0].classList.add('active'), () => {}).finally(() => tabs[2].classList.remove('active'));
        } else if (i === 1) { this.toast('3D Views are not available yet.'); tabs[0].click(); }
      };
    });
  }

  async api(url, body, method = 'POST') {
    const r = await fetch(url, method === 'GET' ? {} : { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const ct = r.headers.get('content-type') || '';
    if (ct.includes('json')) {
      const j = await r.json();
      if (!r.ok && !j.error) throw new Error(j.detail || r.statusText || `HTTP ${r.status}`);
      return j;
    }
    if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); throw new Error('Sign in again'); }
    if (!r.ok) throw new Error(r.statusText || `HTTP ${r.status}`);
    return r;
  }

  // ------------------------------------------------------------------ rebuild
  docForRegen() {
    const d = this.cleanDoc(this.shownDoc);
    if (this.mode === 'sketch') {
      const i = d.features.findIndex((f) => f.id === this.sketcher.skId);
      if (i >= 0) d.rollback = d.rollback === null || d.rollback === undefined ? i : Math.min(d.rollback, i);
    }
    return d;
  }

  // label: what the loading indicator says if the server takes a moment ("Opening Bracket")
  async regen(announce = false, label = null) {
    if (this.isAsm) return this.asm.regen(announce, null, label);
    const seq = ++this.regenSeq;
    const done = this.busy(label || (this.viewer.bodyData ? 'Rebuilding' : 'Loading model'));
    let res;
    try { res = await this.api('/api/regen', { doc: this.docForRegen() }); } catch (err) { done(); this.toast('Rebuild failed: ' + err.message); return; }
    if (seq !== this.regenSeq) { done(); return; }
    this.applyResult(res);
    done();
    if (announce) this.status('Rebuild complete');
  }

  // Loading indicator in the graphics area for server work (rebuilds, imports, previews). It appears only
  // when the work takes longer than a moment, so quick rebuilds do not flash it. Returns the "done" call.
  busy(label, delay = 250) {
    const el = $('busyind');
    if (!el) return () => {};
    this.busyJobs = this.busyJobs || [];
    const job = { label };
    this.busyJobs.push(job);
    const show = () => {
      const top = this.busyJobs[this.busyJobs.length - 1];
      if (!top) { el.classList.add('hidden'); return; }
      el.querySelector('.busy-label').textContent = top.label + '...';
      if (top.shown) el.classList.remove('hidden');
    };
    job.timer = setTimeout(() => { job.shown = true; show(); }, delay);
    return () => {
      clearTimeout(job.timer);
      const i = this.busyJobs.indexOf(job);
      if (i < 0) return;
      this.busyJobs.splice(i, 1);
      if (!this.busyJobs.some((j) => j.shown)) el.classList.add('hidden'); else show();
    };
  }

  applyResult(res) {
    this.asm.res = null;
    this.result = res;
    if (res.equations && this.mode !== 'sketch' && !this.proposal) {
      // numbers driven by equations: show what was built (no undo step; the equation owns the value)
      for (const [id, f] of Object.entries(res.equations.features)) { const mine = this.featureById(id); if (mine) Object.assign(mine, f); }
      const r = res.equations.recomputed[0];
      this.status(`Driven by an equation: ${r.field}@${this.featureById(r.feature)?.name || r.feature} = ${+(+r.new).toFixed(6)}`);
    }
    this.statusById = Object.fromEntries(res.status.map((s) => [s.id, s]));
    this.viewer.setTool(null);
    this.viewer.setBody(res.body, this.proposal ? { color: COLORS.proposal } : { color: this.bodyColor() });
    this.updatePlanes();
    this.drawSketches();
    this.tree.render();
    this.refreshSelectionDisplay();
    const errs = res.status.filter((s) => s.state === 'error' && !s.preview);
    if (errs.length) {
      const f = this.featureById(errs[0].id);
      this.status(`Rebuild error in ${f ? f.name : errs[0].id}: ${errs[0].message}`);
    }
  }

  bodyColor() { return this.doc.appearance ? parseInt(this.doc.appearance.slice(1), 16) : COLORS.body; }

  sketchFrame(id) {
    const r = this.result?.planes?.[id];
    if (r) return r;
    const f = this.featureById(id);
    return f ? this.frameForPlaneSpec(f.plane) : null;
  }

  frameForPlaneSpec(spec) {
    if (!spec) return null;
    if (spec.ref) return STD_FRAMES[spec.ref] || this.result?.planes?.[spec.ref] || null;
    const n = new THREE.Vector3(...spec.normal), x = new THREE.Vector3(...spec.xdir);
    const y = n.clone().cross(x);
    return { origin: spec.origin, xdir: spec.xdir, ydir: [y.x, y.y, y.z], normal: spec.normal };
  }

  absorbed() { return new Set((this.shownDoc.features || []).flatMap(featureSketchIds)); }

  sketchVisible(f) {
    if (this.mode === 'sketch' && f.id === this.sketcher.skId) return false;
    if (f.shown) return true;
    if (f.hidden || !this.view.sketches) return false;
    const rb = this.shownDoc.rollback ?? (this.shownDoc.features || []).length;
    if ((this.shownDoc.features || []).indexOf(f) >= rb) return false;
    if (this.cmd?.spec?.showSketch && this.cmd.spec.showSketch() === f.id) return true;
    return !this.absorbed().has(f.id);
  }

  drawSketches() {
    const g = this.viewer.otherSketches;
    this.viewer.clearGroup(g);
    if (this.isAsm) { this.viewer.requestRender(); return; }
    this.sketchPx = this.viewer.pxSize;
    const selIds = new Set(this.selection.filter((s) => s.kind === 'sketch').map((s) => s.id));
    for (const f of (this.shownDoc.features || [])) {
      if (f.type !== 'sketch' || !this.sketchVisible(f)) continue;
      const fr = this.sketchFrame(f.id);
      if (!fr) continue;
      const color = selIds.has(f.id) ? 0x2a8cff : this.hoverSketch === f.id ? 0xff8c00 : 0x3c3c3c;
      drawInactiveSketch(g, f, this.viewer.frameMatrix(fr), this.viewer.pxSize, color);
      if (this.cmd?.f?.axis && this.cmd.f.sketch === f.id) {
        const ax = f.entities.find((e) => e.id === this.cmd.f.axis);
        if (ax) drawInactiveSketch(g, { entities: [{ ...ax, construction: false }, ...f.entities.filter((e) => e.type === 'point')] }, this.viewer.frameMatrix(fr), this.viewer.pxSize * 1.6, 0x2a8cff);
      }
    }
    this.viewer.requestRender();
  }

  afterRender() {
    if (this.sketchPx && Math.abs(this.viewer.pxSize - this.sketchPx) > 1e-9 * this.sketchPx) this.drawSketches();
    this.updateStartHint();
  }

  // An empty part or assembly: a small card in the graphics area with the first steps.
  updateStartHint() {
    if (this.reviewMode || !this.doc || !$('graphics')) return;
    const d = this.doc;
    const asm = isAssembly(d);
    const empty = asm ? !(d.components || []).length : !(d.features || []).length;
    const show = empty && this.mode !== 'sketch' && !this.cmd && !this.proposal && !this.taskpane?.busy && !this.live?.active && !(this.docStack || []).length;
    let el = $('starthint');
    if (!show) { if (el && !el.classList.contains('hidden')) el.classList.add('hidden'); return; }
    if (!el) {
      el = document.createElement('div'); el.id = 'starthint'; el.className = 'starthint hidden';
      $('graphics').appendChild(el);
    }
    const kind = asm ? 'asm' : 'part';
    if (el.dataset.kind !== kind) {
      el.dataset.kind = kind;
      el.innerHTML = '';
      const card = document.createElement('div'); card.className = 'sh-card';
      const t = document.createElement('b'); const sub = document.createElement('span');
      card.append(t, sub);
      const row = document.createElement('div'); row.className = 'sh-row';
      const btn = (cls, label, run, html) => { const b = document.createElement('button'); b.className = cls; if (html) b.innerHTML = html; else b.textContent = label; b.onclick = run; return b; };
      if (asm) {
        t.textContent = 'Start your assembly';
        sub.textContent = 'Insert the parts, then mate them. Or let the AI build the whole product.';
        row.append(btn('btn primary fv-pill', 'Insert components', () => this.asm.insertPM()));
      } else {
        t.textContent = 'Start your part';
        sub.textContent = 'Pick a plane to sketch on, or describe the part and let the AI build it.';
        const planes = document.createElement('div'); planes.className = 'sh-planes';
        const P = { 'Front Plane': 'M5 6h14v12H5z', 'Top Plane': 'M3 15l6-6h12l-6 6z', 'Right Plane': 'M8 4l8 3v13l-8-3z' };
        for (const [id, path] of Object.entries(P)) {
          planes.append(btn('sh-plane', id, () => this.sketchOn({ kind: 'plane', id }), `<svg viewBox="0 0 24 24" width="22" height="22" fill="rgba(94,106,210,.18)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="${path}"/></svg><span>${id.replace(' Plane', '')}</span>`));
        }
        card.appendChild(planes);
      }
      row.append(btn('btn fv-pill', 'Describe it to the AI', () => { this.openTask('ai'); setTimeout(() => this.taskpane.input?.focus(), 50); }));
      row.append(btn('btn fv-pill sh-up', 'Upload STEP', () => this.openFromComputer()));
      card.appendChild(row);
      el.appendChild(card);
    }
    el.classList.remove('hidden');
  }

  updatePlanes() {
    const box = this.result?.bbox;
    let size = 100;
    if (box) size = Math.max(60, 1.25 * Math.max(...box[1].map((v, i) => Math.max(Math.abs(v), Math.abs(box[0][i])))) * 2);
    const sel = new Set(this.selection.filter((s) => s.kind === 'plane').map((s) => s.id));
    const sb = this.cmd?.spec && this.pm.activeSelboxSpec();
    const pickPlanes = this.cmd?.wantsPlanes || (sb && sb.kinds?.includes('plane') && !sb.items().length);
    const list = [];
    for (const p of STD_PLANES) {
      list.push({ id: p, name: p, frame: STD_FRAMES[p], size, visible: this.view.planes || sel.has(p) || this.hoverPlane === p || pickPlanes, state: sel.has(p) ? 'sel' : this.hoverPlane === p ? 'hl' : 'normal' });
    }
    for (const f of (this.shownDoc.features || [])) {
      if (f.type !== 'plane') continue;
      const fr = this.result?.planes?.[f.id];
      if (!fr) continue;
      list.push({ id: f.id, name: f.name, frame: fr, size, visible: !f.hidden || sel.has(f.id) || this.hoverPlane === f.id || pickPlanes, state: sel.has(f.id) ? 'sel' : this.hoverPlane === f.id ? 'hl' : 'normal' });
    }
    this.viewer.setPlanes(list);
    this.viewer.originObj.visible = this.view.origins && this.mode !== 'sketch';
  }

  // ------------------------------------------------------------------ selection
  setSelection(list) {
    this.selection = list;
    this.refreshSelectionDisplay();
    this.tree.render();
    this.design?.onSelection();
    if (this.taskpane) { this.taskpane.noSelection = false; this.taskpane.updateSelChip(); }
  }

  refreshSelectionDisplay() {
    const keys = this.selection.filter((s) => s.kind === 'face' || s.kind === 'edge' || s.kind === 'component').map((s) => (s.kind === 'component' ? `comp:${s.id}` : `${s.kind}:${s.id}`));
    const extra = this.cmd?.spec?.selectedKeys ? this.cmd.spec.selectedKeys() : [];
    this.viewer.setSelectedKeys([...keys, ...extra]);
    this.updatePlanes();
    this.drawSketches();
  }

  edgeData(i) { return this.viewer.bodyData?.edges?.[i] || null; }
  edgeKeysFor(refs) {
    const out = [];
    const edges = this.viewer.bodyData?.edges || [];
    for (const r of refs) {
      let best = null, bd = 1e-3;
      for (const e of edges) { const d = Math.hypot(e.mid[0] - r.mid[0], e.mid[1] - r.mid[1], e.mid[2] - r.mid[2]); if (d < bd) { bd = d; best = e; } }
      if (best) out.push('edge:' + best.id);
    }
    return out;
  }
  faceKeysFor(refs) {
    const out = [];
    const faces = this.viewer.bodyData?.faces || [];
    for (const r of refs) {
      let best = null, bd = 1e-3;
      for (const f of faces) { const d = Math.hypot(f.center[0] - r.center[0], f.center[1] - r.center[1], f.center[2] - r.center[2]); if (d < bd) { bd = d; best = f; } }
      if (best) out.push('face:' + best.id);
    }
    return out;
  }

  // ------------------------------------------------------------------ canvas events
  canvasRect() { return this.viewer.canvas.getBoundingClientRect(); }

  bindCanvas() {
    const c = this.viewer.canvas;
    let down = null;
    c.addEventListener('pointerdown', (e) => {
      closeMenus();
      this.hideContextToolbar();
      if (e.button !== 0 || e.altKey) { if (e.button === 2) down = { x: e.offsetX, y: e.offsetY, right: true }; return; }
      down = { x: e.offsetX, y: e.offsetY };
      if (this.zoomAreaMode) { this.zoomBox = { x0: e.offsetX, y0: e.offsetY, x1: e.offsetX, y1: e.offsetY }; c.setPointerCapture(e.pointerId); return; }
      if (this.mode === 'sketch' && !this.cmd?.modelPick) { c.setPointerCapture(e.pointerId); this.sketcher.pointerDown(e.offsetX, e.offsetY, e); return; }
      this.partDown(e);
    });
    c.addEventListener('pointermove', (e) => {
      if (this.viewer.isNavigating()) return;
      if (this.zoomBox) { this.zoomBox.x1 = e.offsetX; this.zoomBox.y1 = e.offsetY; this.showSelBox(this.zoomBox); return; }
      if (this.ctbAt && Math.hypot(e.clientX - this.ctbAt.x, e.clientY - this.ctbAt.y) > 160) this.hideContextToolbar();
      if (this.mode === 'sketch' && !this.cmd?.modelPick) { this.sketcher.pointerMove(e.offsetX, e.offsetY, e); return; }
      this.partMove(e);
    });
    c.addEventListener('pointerup', (e) => {
      if (this.zoomBox) { this.finishZoomArea(); return; }
      if (e.button === 2 && down?.right && Math.hypot(e.offsetX - down.x, e.offsetY - down.y) < 4) this.canvasContext(e);
      if (this.mode === 'sketch' && !this.cmd?.modelPick && e.button === 0) this.sketcher.pointerUp(e.offsetX, e.offsetY, e);
      if (this.isAsm && e.button === 0) this.asm.pointerUp(e);
      down = null;
    });
    c.addEventListener('dblclick', (e) => {
      if (this.mode === 'sketch') { if (!this.sketcher.dblClick()) this.sketchDblClick(e); return; }
      if (this.isAsm) { const it = this.asm.pickToItem(this.pickAt(e.offsetX, e.offsetY)); if (it?.kind === 'component' && !this.cmd) this.asm.openPart(it.id); return; }
      const p = this.pickAt(e.offsetX, e.offsetY);
      if (p && p.kind === 'sketch') this.editSketch(p.id);
    });
    c.addEventListener('pointerleave', () => { this.viewer.setHover(null); this.cursorFeedback(null); $('sb-coords').textContent = ''; });
  }

  sketchDblClick(e) {
    // double-click on empty space in a sketch with nothing active ends the chain; on a line selects the chain
    void e;
  }

  pickSketchEntity(x, y) {
    let best = null;
    for (const f of (this.shownDoc.features || [])) {
      if (f.type !== 'sketch' || !this.sketchVisible(f)) continue;
      const fr = this.sketchFrame(f.id);
      if (!fr) continue;
      const q = this.viewer.screenToPlane(x, y, fr);
      const tol = 6 * this.viewer.pxSize;
      const P = pointsOf(f);
      for (const e of f.entities) {
        const pl = entityPolyline(e, P);
        if (!pl) continue;
        for (let i = 0; i + 1 < pl.length; i++) {
          const d = projSeg([q.u, q.v], pl[i], pl[i + 1]).d;
          if (d < tol && (!best || d < best.d)) best = { d, sketch: f.id, id: e.id, type: e.type };
        }
      }
    }
    return best;
  }

  pickAt(x, y) {
    const s = this.pickSketchEntity(x, y);
    if (s) return s.type === 'line' && this.cmd?.spec && this.pm.activeSelboxSpec()?.kinds?.includes('sketchline') ? { kind: 'sketchline', sketch: s.sketch, id: s.id } : { kind: 'sketch', id: s.sketch };
    const showPlanes = [...this.viewer.planeObjs.values()].some((o) => o.visible);
    return this.viewer.pick(x, y, { planes: showPlanes });
  }

  partMove(e) {
    if (this.live.active) return;
    if (this.isAsm) return this.asm.pointerMove(e);
    const p = this.pickAt(e.offsetX, e.offsetY);
    this.viewer.setHover(p && (p.kind === 'face' || p.kind === 'edge') ? p : null);
    const hs = p && (p.kind === 'sketch' || p.kind === 'sketchline') ? (p.sketch || p.id) : null;
    const hp = p && p.kind === 'plane' ? p.id : null;
    if (hs !== this.hoverSketch) { this.hoverSketch = hs; this.drawSketches(); }
    if (hp !== this.hoverPlane) { this.hoverPlane = hp; this.updatePlanes(); }
    if (p && p.point) $('sb-coords').textContent = `${fmt(p.point.x)}mm  ${fmt(p.point.y)}mm  ${fmt(p.point.z)}mm`;
  }

  partDown(e) {
    if (this.live.active) return;
    if (this.isAsm) return this.asm.pointerDown(e);
    const p = this.pickAt(e.offsetX, e.offsetY);
    if (this.cmd) {
      if (p && this.routePick(p)) return;
      if (this.cmd.spec || this.cmd.onPick) return; // a PropertyManager is open: ignore empty clicks
    }
    if (!p) { if (!e.ctrlKey && !e.shiftKey) this.setSelection([]); return; }
    const item = { kind: p.kind === 'sketchline' ? 'sketch' : p.kind, id: p.kind === 'sketchline' ? p.sketch : p.id, data: p.data };
    const key = `${item.kind}:${item.id}`;
    if (e.ctrlKey || e.shiftKey) {
      const has = this.selection.some((s) => `${s.kind}:${s.id}` === key);
      this.setSelection(has ? this.selection.filter((s) => `${s.kind}:${s.id}` !== key) : [...this.selection, item]);
    } else this.setSelection([item]);
    this.showContextToolbar(item, e.clientX, e.clientY);
  }

  routePick(p) {
    const cmd = this.cmd;
    if (cmd.onPick) { const r = cmd.onPick(p); if (r) { this.pm.render(); this.refreshSelectionDisplay(); this.schedulePreview(); } return !!r; }
    if (!cmd.spec) return false;
    const box = this.pm.activeSelboxSpec();
    const r = cmd.spec.onPick(p, box);
    if (r === 'handled') return true;
    if (r) { this.pm.render(); this.refreshSelectionDisplay(); this.schedulePreview(); return true; }
    return false;
  }

  canvasContext(e) {
    const items = [];
    if (this.mode === 'sketch') {
      items.push({ label: 'Select', icon: 'select', run: () => this.selectTool() });
      for (const t of ['line', 'rectangle', 'circle', 'smartdim']) items.push({ label: this.commands[t].label, icon: this.commands[t].icon, run: () => this.sketchTool(t) });
      items.push('-');
      if (this.sketcher.sel.size) { items.push({ label: 'Delete', key: 'Del', run: () => this.sketcher.deleteSelection() }); items.push({ label: 'Construction Geometry', run: () => this.sketcher.toggleConstruction([...this.sketcher.sel]) }); items.push('-'); }
      items.push({ label: 'Exit Sketch', icon: 'exitsketch', run: () => this.exitSketch() });
      items.push({ label: 'Exit Sketch Without Saving', icon: 'cancel', run: () => this.discardSketch() });
    } else if (this.isAsm) {
      return this.asm.canvasContext(e);
    } else {
      const p = this.pickAt(e.offsetX, e.offsetY);
      if (p) {
        if (p.kind === 'plane' || (p.kind === 'face' && p.data?.plane)) items.push({ label: 'Sketch', icon: 'sketch', run: () => this.sketchOn(p) });
        if (p.kind === 'sketch') items.push({ label: 'Edit Sketch', icon: 'sketch', run: () => this.editSketch(p.id) });
        if (p.kind === 'face' && p.data?.plane) items.push({ label: 'Normal To', icon: 'normalto', run: () => this.viewer.normalTo(frameForFace(p.data.normal, p.data.center)) });
        if (p.kind === 'edge') { items.push({ label: 'Fillet', icon: 'fillet', run: () => { this.setSelection([{ kind: 'edge', id: p.id, data: p.data }]); this.featureCommand('fillet'); } }); items.push({ label: 'Chamfer', icon: 'chamfer', run: () => { this.setSelection([{ kind: 'edge', id: p.id, data: p.data }]); this.featureCommand('chamfer'); } }); }
        items.push('-');
      }
      items.push({ label: 'Zoom to Fit', icon: 'zoomfit', key: 'F', run: () => this.viewer.zoomToFit() });
      items.push({ label: 'Previous View', icon: 'prevview', run: () => this.viewer.previousView() });
      if (this.lastCommand) { const c = this.commands[this.lastCommand]; items.push('-', { head: 'Recent Commands' }, { label: typeof c.label === 'function' ? c.label() : c.label, icon: typeof c.icon === 'function' ? c.icon() : c.icon, key: 'Enter', run: () => c.run() }); }
    }
    contextMenu(e.clientX, e.clientY, items);
  }

  // ------------------------------------------------------------------ context toolbar
  showContextToolbar(item, x, y) {
    const tb = this.isAsm ? this.asm.contextToolbar(item) : [];
    if (this.isAsm && item.kind === 'plane') tb.push({ icon: 'normalto', title: 'Normal To', run: () => this.viewer.normalTo(this.planeFrame(item.id)) });
    if (this.isAsm) return this.renderContextToolbar(tb, x, y);
    if (item.kind === 'plane' || (item.kind === 'face' && item.data?.plane)) {
      tb.push({ icon: 'sketch', title: 'Sketch', run: () => this.sketchOn(item) });
      tb.push({ icon: 'normalto', title: 'Normal To', run: () => this.viewer.normalTo(item.kind === 'plane' ? this.planeFrame(item.id) : frameForFace(item.data.normal, item.data.center)) });
    }
    if (item.kind === 'sketch') {
      tb.push({ icon: 'sketch', title: 'Edit Sketch', run: () => this.editSketch(item.id) });
      tb.push({ icon: 'extrude', title: 'Extruded Boss/Base', run: () => this.featureCommand('extrude') });
      tb.push({ icon: 'cut', title: 'Extruded Cut', run: () => this.featureCommand('cut') });
      tb.push({ icon: 'hideshow', title: 'Hide/Show', run: () => this.toggleHidden(item.id) });
    }
    if (item.kind === 'feature') {
      const f = this.featureById(item.id);
      tb.push({ icon: featureIcon(f), title: 'Edit Feature', run: () => this.editFeature(item.id) });
      if (f.sketch) tb.push({ icon: 'sketch', title: 'Edit Sketch', run: () => this.editSketch(f.sketch) });
      tb.push({ icon: 'rebuild', title: f.suppressed ? 'Unsuppress' : 'Suppress', run: () => this.suppress(item.id, !f.suppressed) });
    }
    if (item.kind === 'edge') {
      tb.push({ icon: 'fillet', title: 'Fillet', run: () => this.featureCommand('fillet') });
      tb.push({ icon: 'chamfer', title: 'Chamfer', run: () => this.featureCommand('chamfer') });
    }
    this.renderContextToolbar(tb, x, y);
  }

  renderContextToolbar(tb, x, y) {
    if (!tb.length) return;
    const el = $('contexttb');
    el.innerHTML = '';
    for (const t of tb) { const b = document.createElement('div'); b.className = 'ct'; b.title = t.title; b.innerHTML = icon(t.icon, 20); b.onclick = () => { this.hideContextToolbar(); t.run(); }; el.appendChild(b); }
    const gr = $('graphics').getBoundingClientRect();
    el.style.left = Math.max(4, Math.min(gr.width - 200, x - gr.left + 12)) + 'px';
    el.style.top = Math.max(4, y - gr.top - 44) + 'px';
    el.classList.remove('hidden');
    this.ctbAt = { x, y };
  }

  hideContextToolbar() { $('contexttb').classList.add('hidden'); this.ctbAt = null; }

  planeFrame(id) { return STD_FRAMES[id] || this.result?.planes?.[id]; }

  // ------------------------------------------------------------------ tree callbacks
  treeClick(item, e, row) {
    if (item.kind === 'folder' || item.kind === 'root') { this.setSelection([]); return; }
    if (this.cmd) {
      const p = item.kind === 'plane' ? { kind: 'plane', id: item.id } : item.kind === 'sketch' ? { kind: 'sketch', id: item.id } : { kind: 'feature', id: item.id };
      if (this.routePick(p)) return;
    }
    if (this.mode === 'sketch') return;
    const r = row.getBoundingClientRect(); // before the tree re-renders and the row is replaced
    const key = `${item.kind}:${item.id}`;
    if (e.ctrlKey || e.shiftKey) {
      const has = this.selection.some((s) => `${s.kind}:${s.id}` === key);
      this.setSelection(has ? this.selection.filter((s) => `${s.kind}:${s.id}` !== key) : [...this.selection, item]);
    } else this.setSelection([item]);
    const gr = $('graphics').getBoundingClientRect();
    this.showContextToolbar(item, Math.max(r.right - 40, gr.left + 8), r.bottom + 46);
  }

  treeHover(item) {
    const hp = item && item.kind === 'plane' ? item.id : null;
    const hs = item && item.kind === 'sketch' ? item.id : null;
    if (hp !== this.hoverPlane) { this.hoverPlane = hp; this.updatePlanes(); }
    if (hs !== this.hoverSketch) { this.hoverSketch = hs; this.drawSketches(); }
  }

  treeContext(item, e) {
    const items = [];
    if (this.isAsm) {
      if (item.kind === 'plane') items.push({ label: 'Normal To', icon: 'normalto', run: () => this.viewer.normalTo(this.planeFrame(item.id)) }, { label: this.view.planes ? 'Hide Planes' : 'Show Planes', icon: 'hideshow', run: () => this.toggleView('planes') });
      else items.push(...this.asm.contextMenuItems(item));
      if (items.length) contextMenu(e.clientX, e.clientY, items);
      return;
    }
    const f = item.kind !== 'plane' || !STD_PLANES.includes(item.id) ? this.featureById(item.id) : null;
    if (item.kind === 'plane') {
      items.push({ label: 'Sketch', icon: 'sketch', run: () => this.sketchOn({ kind: 'plane', id: item.id }) });
      items.push({ label: 'Normal To', icon: 'normalto', run: () => this.viewer.normalTo(this.planeFrame(item.id)) });
      items.push({ label: this.view.planes ? 'Hide Planes' : 'Show Planes', icon: 'hideshow', run: () => this.toggleView('planes') });
      if (f) items.push('-', { label: 'Edit Feature', icon: 'plane', run: () => this.editFeature(f.id) }, { label: 'Delete...', run: () => this.deleteFeature(f.id) });
    } else if (item.kind === 'sketch') {
      items.push({ label: 'Edit Sketch', icon: 'sketch', run: () => this.editSketch(item.id) });
      items.push({ label: f.shown || (!f.hidden && !this.absorbed().has(f.id)) ? 'Hide' : 'Show', icon: 'hideshow', run: () => this.toggleHidden(item.id) });
      items.push({ label: 'Rename', key: 'F2', run: () => this.tree.rename(item.id) });
      items.push('-', { label: 'Delete...', key: 'Del', run: () => this.deleteFeature(item.id) });
    } else if (item.kind === 'feature') {
      items.push({ label: 'Edit Feature', icon: featureIcon(f), run: () => this.editFeature(f.id) });
      if (f.sketch) items.push({ label: 'Edit Sketch', icon: 'sketch', run: () => this.editSketch(f.sketch) });
      items.push({ label: f.suppressed ? 'Unsuppress' : 'Suppress', run: () => this.suppress(f.id, !f.suppressed) });
      items.push({ label: 'Rollback', run: () => this.setRollback(this.doc.features.indexOf(f)) });
      items.push({ label: 'Rename', key: 'F2', run: () => this.tree.rename(f.id) });
      items.push('-', { label: 'Delete...', key: 'Del', run: () => this.deleteFeature(f.id) });
    } else if (item.kind === 'material') {
      items.push({ label: 'Edit Material', icon: 'material', run: () => this.materialDialog() });
    } else if (item.kind === 'root') {
      items.push({ label: 'Rebuild', icon: 'rebuild', key: 'Ctrl+B', run: () => this.regen(true) });
      items.push({ label: 'Rollback to End', run: () => this.setRollback(null) });
    } else return;
    contextMenu(e.clientX, e.clientY, items);
  }

  toggleHidden(id) {
    this.commit('Hide/Show', () => {
      const f = this.featureById(id);
      const visible = this.sketchVisible(f);
      if (visible) { f.hidden = true; delete f.shown; } else { delete f.hidden; f.shown = true; }
    }, false);
    this.drawSketches();
  }

  setRollback(idx) {
    this.commit('Rollback', () => { this.doc.rollback = idx; });
  }

  suppress(id, on) { this.commit(on ? 'Suppress' : 'Unsuppress', () => { const f = this.featureById(id); if (on) f.suppressed = true; else delete f.suppressed; }); }

  suppressSelection(on) { for (const s of this.selection) if (s.kind === 'feature' || s.kind === 'sketch') this.suppress(s.id, on); }

  // Confirm Delete: the server works out what goes with the feature and what would break (edits.plan_delete),
  // the same rules Claude's delete_items uses. Children that would only break stay unless "Delete child
  // features" is ticked, as in SOLIDWORKS.
  async deleteFeature(id) {
    const f = this.featureById(id);
    if (!f) return;
    const names = (ids) => ids.map((x) => esc(this.featureById(x)?.name || x)).join(', ');
    const plan = async (ids, absorbed) => this.api('/api/delete_plan', { doc: this.cleanDoc(this.doc), features: ids, delete_absorbed: absorbed });
    let first;
    try { first = await plan([id], true); } catch (err) { this.status(`Cannot delete: ${err.message}`); return; }
    const kids = first.would_fail.map((x) => x.id);
    const body = document.createElement('div');
    body.innerHTML = `<div>Delete <b>${esc(f.name)}</b>?</div>` +
      (first.deleted_with_it.length ? `<div style="margin-top:6px">Also deleted (they need it): ${names(first.deleted_with_it)}</div>` : '') +
      (first.patterns_trimmed.length ? `<div style="margin-top:6px">Patterns that keep their other features: ${names(first.patterns_trimmed.map((x) => x.id))}</div>` : '') +
      (first.absorbed.length ? `<label style="display:block;margin-top:8px"><input type="checkbox" id="delabs" checked> Delete absorbed features (${names(first.absorbed)})</label>` : '') +
      (kids.length ? `<div style="margin-top:6px">Dependent items that will show errors: ${names(kids)}</div>` +
        `<label style="display:block;margin-top:4px"><input type="checkbox" id="delchild"> Delete child features</label>` : '');
    dialog({ title: 'Confirm Delete', body, buttons: [
      { label: 'Yes', primary: true, run: async () => {
        const delAbs = body.querySelector('#delabs')?.checked ?? true, delChild = body.querySelector('#delchild')?.checked;
        let p = first;
        if (!delAbs || delChild) {
          try { p = await plan(delChild ? [id, ...kids] : [id], delAbs); } catch (err) { this.status(`Cannot delete: ${err.message}`); return; }
        }
        const kill = new Set([...p.deleted, ...p.deleted_with_it, ...p.absorbed]);
        const trim = new Map(p.patterns_trimmed.map((x) => [x.id, x.keeps]));
        this.commit('Delete', () => {
          const rb = this.doc.rollback;
          if (rb !== null && rb !== undefined) this.doc.rollback = rb - this.doc.features.slice(0, rb).filter((x) => kill.has(x.id)).length;
          this.doc.features = this.doc.features.filter((x) => !kill.has(x.id));
          for (const x of this.doc.features) if (trim.has(x.id)) x.features = trim.get(x.id);
        });
        this.setSelection([]);
      } },
      { label: 'No' },
    ] });
  }

  deleteSelection() {
    if (this.mode === 'sketch') return this.sketcher.deleteSelection();
    if (this.isAsm) return this.asm.deleteSelection();
    const s = this.selection.find((x) => (x.kind === 'feature' || x.kind === 'sketch' || x.kind === 'plane') && !STD_PLANES.includes(x.id));
    if (s) this.deleteFeature(s.id);
  }

  // ------------------------------------------------------------------ PropertyManager plumbing
  showPanel(which) {
    $('featuremgr').classList.toggle('hidden', which === 'pm');
    $('propmgr').classList.toggle('hidden', which !== 'pm');
    [...$('mgrtabs').children].forEach((t, i) => t.classList.toggle('active', (which === 'pm' ? 1 : 0) === i));
  }

  closeCommand() {
    if (this.cmd) this.cmd.cancelled = true;
    if (this.cmd && this.cmd.onClose) this.cmd.onClose();
    this.cmd = null;
    clearTimeout(this.previewTimer);
    if (this.pm.isOpen) this.pm.close();
    this.viewer.setTool(null);
    this.refreshSelectionDisplay();
    this.design?.refresh(); // its "finish the open command first" note goes with the command
    this.updateStartHint();
  }

  pmOk() {
    const cmd = this.cmd;
    if (this.mode === 'sketch' && !cmd) { this.sketcher.setTool(null); this.sketcher.sel.clear(); this.onSketchSelection(); this.sketcher.render(); return; }
    if (!cmd) return this.pm.close();
    if (this.pm.spec?.okEnabled && !this.pm.spec.okEnabled()) { this.toast('Complete the required selections first.'); return; }
    if (cmd.onOk) { const keep = cmd.onOk(); if (keep === false) return; this.closeCommand(); return; }
    if (cmd.spec) return this.commitFeature();
  }

  pmCancel() {
    const cmd = this.cmd;
    if (this.mode === 'sketch' && !cmd) { this.sketcher.setTool(null); this.sketcher.sel.clear(); this.onSketchSelection(); this.sketcher.render(); return; }
    if (cmd?.onCancel) cmd.onCancel();
    this.closeCommand();
    if (cmd?.spec) this.regen();
  }

  // ------------------------------------------------------------------ feature commands
  featureCommand(key, existing = null) {
    if (this.isAsm) { this.toast('Features are added in a part. Select a component and click Open Part.'); return; }
    if (this.mode === 'sketch') {
      const sid = this.sketcher.skId;
      this.exitSketch();
      if (['extrude', 'cut', 'revolve', 'revcut', 'sweep', 'sweepcut', 'loft', 'loftcut'].includes(key)) this.selection = [{ kind: 'sketch', id: sid }];
    }
    if (this.cmd) this.pmCancel();
    const meta = metaFor(key);
    const f = existing ? clone(existing) : defaultsFor(key, this);
    if (!existing) { f.id = this.uid('f'); f.name = nextName(this.doc, meta.base); }
    const spec = buildSpec(key, this, f);
    this.cmd = { key, f, spec, existing };
    const msgs = {
      extrude: 'Select a sketch to extrude, or a plane or planar face to sketch on.',
      cut: 'Select a sketch to cut, or a plane or planar face to sketch on.',
      revolve: 'Select a sketch and an axis (centerline) to revolve about.',
      revcut: 'Select a sketch and an axis (centerline) to revolve about.',
      fillet: 'Select edges or faces to fillet.',
      chamfer: 'Select edges or faces to chamfer.',
      shell: 'Select faces to remove and set the wall thickness.',
      mirror: 'Select a mirror plane and the features to mirror.',
      linear_pattern: 'Select features to pattern and a direction.',
      circular_pattern: 'Select features to pattern and an axis.',
      plane: 'Select a plane or planar face and set the offset.',
      sweep: 'Select a closed profile sketch and a separate path sketch.',
      sweepcut: 'Select a closed profile sketch and a separate path sketch.',
      loft: 'Select at least two closed sketches in section order.',
      loftcut: 'Select at least two closed sketches in section order.',
      hole: 'Select a plane or planar face, then set the hole dimensions and position.',
    };
    this.pm.open({ title: existing ? f.name : meta.title, icon: meta.icon, sections: spec.sections, okEnabled: spec.okEnabled, activeSelbox: spec.activeSelbox,
      message: () => (spec.okEnabled() ? null : msgs[key] || SPECS[key]?.message), onChange: () => { this.refreshSelectionDisplay(); this.schedulePreview(); } });
    this.setSelection([]);
    // Looking straight at the sketch? Turn to trimetric so the preview reads in 3D (as SOLIDWORKS does).
    const sid = f.sketch;
    const fr = sid && this.sketchFrame(sid);
    if (fr && ['extrude', 'cut', 'revolve', 'revcut'].includes(key)) {
      const z = new THREE.Vector3(0, 0, 1).applyQuaternion(this.viewer.quat);
      if (Math.abs(z.dot(new THREE.Vector3(...fr.normal))) > 0.999) this.viewer.standardView('trimetric');
    }
    this.schedulePreview(0);
  }

  editFeature(id) {
    const f = this.featureById(id);
    if (!f) return;
    if (f.type === 'sketch') return this.editSketch(id);
    if (f.type === 'import') { message('Imported1', 'An imported body has no feature history to edit. Add features on top of it (cuts, fillets, shells), or ask OpenSketch AI to Rebuild as Features.'); return; }
    if (f.type === 'standard') return this.toolbox.editPM(f);
    this.featureCommand(metaKey(f), f);
  }

  schedulePreview(delay = 120) {
    if (this.cmd?.spec) this.cmd.previewVersion = (this.cmd.previewVersion || 0) + 1;
    clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(() => this.runPreview(), delay);
  }

  async runPreview() {
    const cmd = this.cmd;
    if (!cmd || !cmd.spec || cmd.cancelled) return false;
    const version = cmd.previewVersion || 0;
    this.drawSketches();
    if (!cmd.spec.okEnabled()) { this.viewer.setTool(null); return false; }
    const f = this.cleanDoc(cmd.f);
    if (f.draftOn === false) delete f.draft;
    const doc = this.docForRegen();
    if (cmd.existing) { const i = doc.features.findIndex((x) => x.id === cmd.existing.id); f._index = i; }
    const seq = ++this.regenSeq;
    let res;
    const done = this.busy('Updating preview', 400);
    try { res = await this.api('/api/regen', { doc, preview: f }); } catch (err) { this.toast('Preview failed: ' + err.message); return false; } finally { done(); }
    if (seq !== this.regenSeq || this.cmd !== cmd || cmd.cancelled || version !== (cmd.previewVersion || 0)) return false;
    if (!Array.isArray(res.status) || !res.body) { this.toast('The server did not return a valid preview.'); return false; }
    this.result = { ...this.result, planes: { ...(this.result?.planes || {}), ...res.planes } };
    this.viewer.setBody(res.body, { color: this.bodyColor() });
    this.viewer.setTool(res.tool);
    const pv = res.status.find((s) => s.preview);
    cmd.lastError = pv && pv.state === 'error' ? pv.message : null;
    this.pm.spec.error = cmd.lastError;
    this.pm.render();
    this.refreshSelectionDisplay();
    return !!pv && !cmd.lastError;
  }

  async commitFeature() {
    const cmd = this.cmd;
    if (!cmd?.spec || cmd.committing) return;
    if (!cmd.spec.okEnabled()) { this.toast('Complete the required selections first.'); return; }
    clearTimeout(this.previewTimer);
    cmd.committing = true;
    let valid;
    try { valid = await this.runPreview(); } finally { cmd.committing = false; }
    if (this.cmd !== cmd || cmd.cancelled) return;
    if (!valid) { if (cmd.lastError) { this.pm.spec.error = cmd.lastError; this.pm.render(); this.toast('Rebuild error: ' + cmd.lastError); } return; }
    let f = this.cleanDoc(cmd.f);
    if (f.draftOn === false) delete f.draft;
    if (f.edges?.length || f.faces?.length || f.direction?.edge || f.direction2?.edge) {
      // store each pick's persistent name with its point, so the pick stays put when earlier features change
      const before = this.cleanDoc(this.doc);
      const at = cmd.existing ? before.features.findIndex((x) => x.id === cmd.existing.id) : (before.rollback ?? before.features.length);
      before.rollback = at;
      try { f = (await this.api('/api/name_refs', { doc: before, feature: f })).feature; } catch (_) { /* keep the points */ }
      if (this.cmd !== cmd || cmd.cancelled) return;
    }
    this.commit(cmd.existing ? 'Edit ' + f.name : f.name, () => {
      if (cmd.existing) { const i = this.doc.features.findIndex((x) => x.id === cmd.existing.id); this.doc.features[i] = f; }
      else this.insertFeature(f);
    });
    this.cmd = null;
    this.pm.close();
    this.viewer.setTool(null);
    this.status(`${f.name} created`);
  }

  insertFeature(f) {
    const rb = this.doc.rollback;
    if (rb === null || rb === undefined) this.doc.features.push(f);
    else { this.doc.features.splice(rb, 0, f); this.doc.rollback = rb + 1; }
  }

  // Start a sketch from inside Extrude/Revolve (SOLIDWORKS: pick a plane in the Extrude PM)
  sketchForFeature(p, key) {
    this.closeCommand();
    this.sketchOn(p, key);
  }

  // ------------------------------------------------------------------ sketch mode
  sketchCommand() {
    if (this.isAsm) { this.toast('Sketches are drawn in a part. Select a component and click Open Part.'); return; }
    if (this.mode === 'sketch') return this.exitSketch();
    const s = this.selection.find((x) => x.kind === 'plane' || (x.kind === 'face' && x.data?.plane) || x.kind === 'sketch');
    if (s) { if (s.kind === 'sketch') return this.editSketch(s.id); return this.sketchOn(s); }
    if (this.cmd) this.pmCancel();
    this.cmd = {
      wantsPlanes: true,
      onPick: (p) => { if (p.kind === 'plane' || (p.kind === 'face' && p.data?.plane)) { setTimeout(() => { this.closeCommand(); this.sketchOn(p); }, 0); return true; } return false; },
    };
    this.pm.open({ title: 'Edit Sketch', icon: 'sketch', sections: [{ title: 'Message', rows: [{ type: 'text', text: 'Select a plane on which to create a sketch for the entity.' }] }], okEnabled: () => false });
    this.updatePlanes();
    this.status('Select a plane or a planar face');
  }

  sketchOn(p, pendingFeature = null) {
    let spec, frame;
    if (p.kind === 'plane') { spec = { ref: p.id }; frame = this.planeFrame(p.id); }
    else { frame = frameForFace(p.data.normal, p.data.center); spec = { type: 'face', origin: frame.origin, normal: frame.normal, xdir: frame.xdir }; }
    if (!frame) return;
    const before = JSON.stringify(this.cleanDoc());
    const history = { undo: [...this.undoStack], redo: [...this.redoStack] };
    const f = { id: this.uid('s'), type: 'sketch', name: nextName(this.doc, 'Sketch'), plane: spec, entities: [], constraints: [] };
    this.pushUndo('Sketch');
    this.insertFeature(f);
    this.docChanged();
    this.enterSketch(f, frame, { isNew: true, snapshot: before, pendingFeature, ...history });
    this.viewer.normalTo(frame);
  }

  editSketch(id) {
    if (this.mode === 'sketch') this.exitSketch();
    if (this.cmd) this.pmCancel();
    const f = this.featureById(id);
    if (!f) return;
    const frame = this.sketchFrame(id);
    if (!frame) { this.toast('The sketch plane could not be found.'); return; }
    this.enterSketch(f, frame, { isNew: false, snapshot: JSON.stringify(this.cleanDoc()) });
  }

  enterSketch(f, frame, opts) {
    this.mode = 'sketch'; this.viewer.setSketchDim?.(true);
    this.sketchCtx = { ...opts, undo: opts.undo || [...this.undoStack], redo: opts.redo || [...this.redoStack] };
    this.setSelection([]);
    this.hideContextToolbar();
    this.sketcher.showRelations = this.view.relations;
    this.sketcher.begin(f, frame);
    this.ribbon.setTab('Sketch');
    this.updateConfirmCorner();
    $('sb-editing').textContent = 'Editing ' + f.name;
    this.updateBreadcrumbs();
    this.regen();
    this.status('Sketch on ' + this.planeName(f.plane));
  }

  planeName(spec) { if (!spec) return ''; if (spec.ref) return this.featureById(spec.ref)?.name || spec.ref; return 'Face'; }

  exitSketch(opts = {}) {
    if (this.mode !== 'sketch') return;
    const id = this.sketcher.skId;
    const ctx = this.sketchCtx || {};
    if (this.cmd) this.closeCommand();
    this.sketcher.end();
    this.mode = 'part'; this.viewer?.setSketchDim?.(false);
    if (this.pm.isOpen) this.pm.close();
    this.updateConfirmCorner();
    $('sb-editing').textContent = 'Editing Part';
    $('sb-defined').textContent = '';
    this.updateBreadcrumbs();
    const f = this.featureById(id);
    if (f && ctx.isNew && !f.entities.length && !opts.keep) {
      this.doc = JSON.parse(ctx.snapshot);
      this.undoStack = ctx.undo; this.redoStack = ctx.redo;
      this.docChanged();
    }
    this.ribbon.render();
    if (opts.silent) return;
    this.regen();
    if (f && f.entities.length) {
      this.setSelection([{ kind: 'sketch', id }]);
      if (ctx.pendingFeature) setTimeout(() => this.featureCommand(ctx.pendingFeature), 0);
    }
  }

  discardSketch() {
    const ctx = this.sketchCtx;
    dialog({ title: 'OpenSketch', body: 'Discard all changes made to the sketch and exit?', buttons: [
      { label: 'Discard Changes and Exit', primary: true, run: () => {
        const snap = ctx.snapshot;
        this.closeCommand();
        this.sketcher.end(); this.mode = 'part'; this.viewer?.setSketchDim?.(false);
        this.doc = JSON.parse(snap);
        this.undoStack = ctx.undo; this.redoStack = ctx.redo;
        this.docChanged();
        this.updateConfirmCorner(); this.updateBreadcrumbs();
        $('sb-editing').textContent = 'Editing Part'; $('sb-defined').textContent = '';
        if (this.pm.isOpen) this.pm.close();
        this.cmd = null;
        this.ribbon.render();
        this.regen();
      } },
      { label: 'Cancel' },
    ] });
  }

  sketchTool(name) {
    if (this.mode !== 'sketch') {
      const s = this.selection.find((x) => x.kind === 'plane' || (x.kind === 'face' && x.data?.plane));
      if (s) this.sketchOn(s);
      else { const sk = this.selection.find((x) => x.kind === 'sketch'); if (sk) this.editSketch(sk.id); else { this.sketchCommand(); this.pendingTool = name; return; } }
    }
    if (this.mode !== 'sketch') return;
    if (this.cmd) this.closeCommand();
    this.sketcher.setTool(this.sketcher.tool?.name === name && name !== 'smartdim' ? null : name);
  }

  selectTool() {
    if (this.mode === 'sketch') this.sketcher.setTool(null);
    else if (this.cmd) this.pmCancel();
  }

  onSketchToolChanged(name) {
    this.ribbon.render();
    if (!name) { if (!this.sketcher.sel.size && this.pm.isOpen && !this.cmd) this.pm.close(); this.onSketchSelection(); return; }
    const info = TOOL_INFO[name] || { title: name, icon: name };
    const rows = [];
    if (!['smartdim', 'trim', 'point'].includes(name)) rows.push({ type: 'check', label: 'For construction', get: () => this.forConstruction || name === 'centerline', set: (v) => { this.forConstruction = v; } });
    if (name === 'polygon') rows.push({ type: 'number', icon: 'count_i', unit: '', int: true, label: 'Sides', get: () => this.polygonSides, set: (v) => { this.polygonSides = Math.max(3, Math.min(40, v)); }, min: 3, max: 40 });
    if (name === 'sketchfillet') rows.push({ type: 'number', icon: 'radius_i', label: 'Radius', get: () => this.filletRadius, set: (v) => { this.filletRadius = v; }, min: 0.001 });
    const sections = [{ title: 'Message', rows: [{ type: 'text', text: info.msg }] }];
    if (rows.length) sections.push({ title: 'Options', rows });
    this.pm.open({ title: info.title, icon: info.icon, sections, okEnabled: () => true });
  }

  onSketchSelection() {
    if (this.mode !== 'sketch' || this.sketcher.tool) return;
    if (this.cmd) { this.cmd.onSketchSelection?.(); return; }
    const sk = this.sketcher, ids = [...sk.sel];
    if (!ids.length) { if (this.pm.isOpen && !this.cmd) this.pm.close(); return; }
    const skf = sk.sk;
    const cons = skf.constraints.filter((c) => ids.includes(c.id));
    if (cons.length === 1 && ids.length === 1 && ['distance', 'diameter', 'radius', 'angle'].includes(cons[0].type)) return this.dimensionPM(cons[0]);
    const ents = ids.map((id) => sk.ent(id)).filter(Boolean);
    const existing = skf.constraints.filter((c) => !['distance', 'diameter', 'radius', 'angle'].includes(c.type) && (ids.includes(c.id) || c.refs.some((r) => ids.includes(r))));
    const relLabel = (c) => esc(`${c.type[0].toUpperCase() + c.type.slice(1)}${c.refs.length ? ' (' + c.refs.join(', ') + ')' : ''}`);
    const one = ents.length === 1 ? ents[0] : null;
    const title = one ? ({ point: 'Point', line: one.construction ? 'Centerline' : 'Line Properties', circle: 'Circle', arc: 'Arc' }[one.type] || 'Properties') : 'Properties';
    const sections = [
      { title: 'Existing Relations', rows: [
        { type: 'list', items: () => existing.map((c) => ({ label: relLabel(c), icon: 'r_' + c.type, selected: sk.sel.has(c.id), over: sk.state?.conflicts.has(c.id), select: () => { sk.sel = new Set([c.id]); sk.render(); this.onSketchSelection(); } })), empty: 'None' },
        { type: 'text', text: () => (sk.state?.status === 'over' ? 'Over Defined' : one && sk.state?.entityState.get(one.id) === 'fully' ? 'Fully Defined' : 'Under Defined') },
        { type: 'buttons', buttons: [{ label: 'Delete', run: () => sk.deleteSelection() }] },
      ] },
      { title: 'Add Relations', visible: () => ents.length > 0, rows: [
        { type: 'relbuttons', items: () => sk.applicableRelations(ids.filter((id) => sk.ent(id))).map((t) => ({ icon: 'r_' + t, label: { fix: 'Fix', coincident: 'Coincident', midpoint: 'Midpoint', horizontal: 'Horizontal', vertical: 'Vertical', parallel: 'Parallel', perpendicular: 'Perpendicular', collinear: 'Collinear', equal: 'Equal', tangent: 'Tangent', concentric: 'Concentric', symmetric: 'Symmetric' }[t], run: () => { sk.addRelation(t, ids.filter((id) => sk.ent(id))); this.onSketchSelection(); } })) },
      ] },
    ];
    if (ents.some((e) => e.type !== 'point')) sections.push({ title: 'Options', rows: [{ type: 'check', label: 'For construction', get: () => ents.every((e) => e.type === 'point' || e.construction), set: () => sk.toggleConstruction(ents.filter((e) => e.type !== 'point').map((e) => e.id)) }] });
    if (one && one.type === 'point' && one.id !== 'origin') sections.push({ title: 'Parameters', rows: [
      { type: 'number', label: 'X', get: () => sk.ent(one.id).x, set: (v) => this.dragTo([{ key: one.id + '.x', value: v }, { key: one.id + '.y', value: sk.ent(one.id).y }]) },
      { type: 'number', label: 'Y', get: () => sk.ent(one.id).y, set: (v) => this.dragTo([{ key: one.id + '.x', value: sk.ent(one.id).x }, { key: one.id + '.y', value: v }]) },
    ] });
    if (one && one.type === 'circle') sections.push({ title: 'Parameters', rows: [{ type: 'number', icon: 'radius_i', get: () => sk.ent(one.id).r, set: (v) => this.dragTo([{ key: one.id + '.r', value: v }]), min: 0.0001 }] });
    if (one && one.type === 'line') {
      const P = pointsOf(skf), a = P.get(one.p1), b = P.get(one.p2);
      sections.push({ title: 'Parameters', rows: [{ type: 'value', label: 'Length', get: () => fmt(Math.hypot(b[0] - a[0], b[1] - a[1])) + ' mm' }, { type: 'value', label: 'Angle', get: () => fmt(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI) + '°' }] });
    }
    this.pm.open({ title, icon: one ? (one.type === 'point' ? 'point' : one.type) : 'addrelation', sections, okEnabled: () => true });
  }

  dragTo(drag) {
    this.sketcher.edit('Edit', () => {});
    this.sketcher.solve(drag);
    this.sketcher.render();
    this.docChanged();
  }

  dimensionPM(c) {
    const sk = this.sketcher;
    this.pm.open({ title: 'Dimension', icon: 'smartdim', okEnabled: () => true, sections: [
      { title: 'Primary Value', rows: [
        { type: 'value', label: 'Name', get: () => `${c.name || c.id}@${sk.sk.name}` },
        { type: 'number', icon: c.type === 'angle' ? 'angle_i' : c.type === 'radius' || c.type === 'diameter' ? 'radius_i' : 'depth', unit: c.type === 'angle' ? 'deg' : 'mm', get: () => +c.value, set: (v) => this.applyDimValue(c, v), min: 0 },
        { type: 'check', label: 'Driven (reference)', get: () => !!c.driven, set: (v) => sk.edit('Driven', () => { const k = sk.sk.constraints.find((x) => x.id === c.id); if (v) k.driven = true; else delete k.driven; }) },
      ] },
    ] });
  }

  applyDimValue(c, v) {
    const sk = this.sketcher;
    const before = JSON.stringify(this.cleanDoc());
    const st = sk.setDimValue(c.id, v);
    if (!st.ok) {
      this.doc = JSON.parse(before);
      this.undoStack.pop();
      sk.solve(); sk.render(); this.docChanged();
      message('OpenSketch', `The sketch cannot be solved with ${fmt(v)}. The dimension was not changed.`);
      return false;
    }
    return true;
  }

  modifyDimension(c, x, y) {
    const r = this.canvasRect();
    const orig = +c.value;
    const sk = this.sketcher;
    modifyBox({ value: orig, unit: c.type === 'angle' ? '°' : 'mm', name: `${c.name || c.id}@${sk.sk.name}`, x: r.left + x + 12, y: r.top + y + 12,
      onApply: (v) => { if (Math.abs(v - (+sk.sk.constraints.find((k) => k.id === c.id)?.value)) > 1e-12) this.applyDimValue(c, v); },
      onPreview: (v) => this.applyDimValue(c, v),
      onCancel: () => { const cur = +sk.sk.constraints.find((k) => k.id === c.id)?.value; if (Math.abs(cur - orig) > 1e-12) this.applyDimValue(c, orig); },
    });
  }

  askDriven(c, cb) {
    const body = document.createElement('div');
    body.innerHTML = `<div style="margin-bottom:8px">Adding this dimension will make the sketch over defined or it cannot be solved. Do you want to add it as a driven dimension instead?</div>
      <label class="pm-radio"><input type="radio" name="drv" value="1" checked> Make this dimension driven</label>
      <label class="pm-radio"><input type="radio" name="drv" value="0"> Leave this dimension driving</label>`;
    dialog({ title: 'Make Dimension Driven?', body, buttons: [
      { label: 'OK', primary: true, run: () => cb(body.querySelector('input[name=drv]:checked').value === '1') },
      { label: 'Cancel', run: () => cb(true) },
    ] });
  }

  convertEntities() {
    if (this.mode !== 'sketch') { this.toast('Edit a sketch, then select model edges or faces to convert.'); return; }
    if (this.cmd) this.closeCommand();
    // edges selected first (click them in the sketch): convert at once, like SOLIDWORKS
    const pre = [...this.sketcher.modelSel.values()].filter((p) => p.kind === 'edge' && p.data).map((p) => p.data);
    if (pre.length) {
      this.sketcher.convertEdges(pre);
      this.sketcher.clearModelSel();
      this.status(`Converted ${pre.length} edge${pre.length === 1 ? '' : 's'} into the sketch.`);
      return;
    }
    const picks = [];
    this.cmd = { modelPick: true,
      onPick: (p) => { if (p.kind === 'edge') { picks.push(p.data); return true; } if (p.kind === 'face') { for (const ei of p.data.edges || []) { const e = this.edgeData(ei); if (e) picks.push(e); } return true; } return false; },
      onOk: () => { if (picks.length) this.sketcher.convertEdges(picks); },
      onClose: () => { this.sketcher.render(); } };
    this.sketcher.setTool(null);
    this.pm.open({ title: 'Convert Entities', icon: 'convert', okEnabled: () => picks.length > 0, sections: [{ title: 'Entities to Convert', rows: [
      { type: 'selbox', id: 'conv', placeholder: 'Select model edges or faces', items: () => picks, label: (e, i) => `Edge<${i + 1}>`, remove: (i) => picks.splice(i, 1), kinds: ['edge', 'face'] },
    ] }] });
  }

  offsetEntities() {
    startOffset(this);
  }

  relationsPM() {
    if (this.mode !== 'sketch') { this.toast('Edit a sketch to display its relations.'); return; }
    if (this.cmd) this.closeCommand();
    const sk = this.sketcher;
    let chosen = null;
    this.cmd = { onOk: () => {} };
    const render = () => this.pm.render();
    this.pm.open({ title: 'Display/Delete Relations', icon: 'relations', okEnabled: () => true, sections: [{ title: 'Relations', rows: [
      { type: 'list', items: () => sk.sk.constraints.map((c) => ({ label: esc(`${c.name ? c.name + ' ' : ''}${c.type} (${c.refs.join(', ')})`), icon: c.type in { distance: 1, diameter: 1, radius: 1, angle: 1 } ? 'smartdim' : 'r_' + c.type, selected: chosen === c.id, over: sk.state?.conflicts.has(c.id), select: () => { chosen = c.id; sk.sel = new Set([c.id]); sk.render(); render(); } })), empty: 'No relations' },
      { type: 'buttons', buttons: [{ label: 'Delete', run: () => { if (chosen) { sk.sel = new Set([chosen]); sk.deleteSelection(); chosen = null; render(); } } }, { label: 'Delete All', run: () => { sk.edit('Delete all relations', () => { sk.sk.constraints = []; }); render(); } }] },
    ] }] });
  }

  addRelationPM() {
    if (this.mode !== 'sketch') { this.toast('Edit a sketch and select entities to relate.'); return; }
    this.sketcher.setTool(null);
    if (!this.sketcher.sel.size) this.toast('Select sketch entities, then pick a relation.');
    this.onSketchSelection();
  }

  repairSketch() {
    if (this.mode !== 'sketch') { this.toast('Edit a sketch to repair it.'); return; }
    const sk = this.sketcher;
    let merged = 0, removed = 0;
    sk.edit('Repair Sketch', () => {
      const pts = sk.sk.entities.filter((e) => e.type === 'point');
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        if (!pts[i] || !pts[j]) continue;
        if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < 1e-6 && sk.sk.entities.includes(pts[j])) { sk.mergePoints(pts[i].id, pts[j].id); merged++; pts[j] = null; }
      }
      const before = sk.sk.entities.length;
      sk.sk.entities = sk.sk.entities.filter((e) => !(e.type === 'line' && e.p1 === e.p2));
      removed = before - sk.sk.entities.length;
    });
    message('Repair Sketch', `${merged} overlapping point(s) merged, ${removed} zero-length line(s) removed.`);
  }

  // ------------------------------------------------------------------ evaluate
  // Tools > Equations (SOLIDWORKS "Equations, Global Variables, and Dimensions"): global variables and the
  // equations on feature fields and sketch dimensions. Values come from the server (params.py), as you type.
  equationsDialog() {
    if (this.isAsm) { this.toast('Open a part to edit its equations.'); return; }
    const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const dims = ['distance', 'diameter', 'radius', 'angle'];
    const targets = [];
    for (const f of this.doc.features) {
      if (f.type === 'sketch') {
        for (const c of f.constraints || []) if (dims.includes(c.type) && !c.driven) targets.push({ key: `${f.id}|${c.id}`, label: `${c.name || c.id}@${f.name}`, feature: f.id, cid: c.id, eq: c.eq });
      } else {
        const add = (obj, path) => { for (const [k, v] of Object.entries(obj || {})) { if (k === 'eq' || k === 'rollback') continue; if (typeof v === 'number') targets.push({ key: `${f.id}|${path}${k}`, label: `${path}${k}@${f.name}`, feature: f.id, field: `${path}${k}`, eq: (f.eq || {})[`${path}${k}`] }); else if (v && typeof v === 'object' && !Array.isArray(v) && !path) add(v, `${k}.`); } };
        add(f, '');
      }
    }
    const vars = (this.doc.parameters || []).map((p) => ({ ...p }));
    const eqs = targets.filter((t) => t.eq).map((t) => ({ key: t.key, expr: t.eq }));
    const body = document.createElement('div');
    body.className = 'eqdlg';
    let last = null;
    const draft = () => {
      const d = this.cleanDoc(this.doc);
      d.parameters = vars.filter((v) => v.name).map((v) => ({ name: v.name.trim(), expression: String(v.expression ?? ''), unit: v.unit || 'mm', ...(v.comment ? { comment: v.comment } : {}) }));
      if (!d.parameters.length) delete d.parameters;
      for (const f of d.features) { delete f.eq; for (const c of f.constraints || []) delete c.eq; }
      for (const e of eqs) {
        const t = targets.find((x) => x.key === e.key); if (!t || !String(e.expr).trim()) continue;
        const f = d.features.find((x) => x.id === t.feature);
        const ex = String(e.expr).trim().replace(/^=/, '');
        if (t.cid) f.constraints.find((c) => c.id === t.cid).eq = ex; else (f.eq ||= {})[t.field] = ex;
      }
      return d;
    };
    const render = () => {
      const vrow = (v, i) => {
        const row = last?.parameters?.find((r) => r.name === v.name);
        const val = row?.problem ? `<span class="eqbad">${esc(row.problem)}</span>` : row?.value != null ? +(+row.value).toFixed(6) : '';
        return `<tr><td><input data-v="${i}" data-k="name" value="${esc(v.name)}" placeholder="Name"></td><td><input data-v="${i}" data-k="expression" value="${esc(v.expression)}" placeholder="Value or equation"></td>` +
          `<td class="eqval">${val}</td><td><input data-v="${i}" data-k="comment" value="${esc(v.comment)}" placeholder="Comments"></td><td><span class="eqx" data-dv="${i}" title="Delete">&#x2715;</span></td></tr>`;
      };
      const erow = (e, i) => {
        const t = targets.find((x) => x.key === e.key);
        const r = last?.equations?.find((x) => `${x.feature}|${x.constraint || x.field}` === e.key);
        const prob = t && last?.problems?.[t.feature];
        const val = prob ? `<span class="eqbad">${esc(prob)}</span>` : r ? +(+r.value).toFixed(6) : '';
        return `<tr><td>"${esc(t?.label)}"</td><td><input data-e="${i}" value="${esc(e.expr)}" placeholder="= equation"></td><td class="eqval">${val}</td><td></td><td><span class="eqx" data-de="${i}" title="Delete">&#x2715;</span></td></tr>`;
      };
      const free = targets.filter((t) => !eqs.some((e) => e.key === t.key));
      body.innerHTML = `<table class="eqt"><thead><tr><th>Name</th><th>Value / Equation</th><th>Evaluates to</th><th>Comments</th><th></th></tr></thead><tbody>` +
        `<tr class="eqsec"><td colspan="5">Global Variables</td></tr>${vars.map(vrow).join('')}<tr><td colspan="5"><span class="eqadd" data-add="var">Add global variable</span></td></tr>` +
        `<tr class="eqsec"><td colspan="5">Equations</td></tr>${eqs.map(erow).join('')}` +
        `<tr><td colspan="5"><select data-add="eq"><option value="">Add equation to a dimension...</option>${free.map((t) => `<option value="${esc(t.key)}">${esc(t.label)}</option>`).join('')}</select></td></tr></tbody></table>` +
        `<div class="eqfoot">Units: mm, cm, m, in, deg, rad. Functions: abs, min, max, sqrt, round, floor, ceil, sin, cos, tan (degrees).</div>`;
      body.querySelectorAll('input[data-v]').forEach((inp) => { inp.oninput = () => { vars[+inp.dataset.v][inp.dataset.k] = inp.value; refresh(); }; });
      body.querySelectorAll('input[data-e]').forEach((inp) => { inp.oninput = () => { eqs[+inp.dataset.e].expr = inp.value; refresh(); }; });
      body.querySelectorAll('[data-dv]').forEach((x) => { x.onclick = () => { vars.splice(+x.dataset.dv, 1); refresh(true); }; });
      body.querySelectorAll('[data-de]').forEach((x) => { x.onclick = () => { eqs.splice(+x.dataset.de, 1); refresh(true); }; });
      body.querySelector('[data-add=var]').onclick = () => { vars.push({ name: '', expression: '', unit: 'mm' }); render(); body.querySelector(`input[data-v="${vars.length - 1}"][data-k=name]`).focus(); };
      body.querySelector('select[data-add=eq]').onchange = (ev) => { if (!ev.target.value) return; eqs.push({ key: ev.target.value, expr: '' }); render(); body.querySelector(`input[data-e="${eqs.length - 1}"]`).focus(); };
    };
    let timer = null, seq = 0;
    const evaluate = async () => { const my = ++seq; try { const r = await this.api('/api/params', { doc: draft() }); if (my === seq) last = r; } catch (err) { last = { error: err.message }; } return last; };
    const refresh = (now = false) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await evaluate();
        // keep typing focus: update only the value cells unless rows changed
        const focus = document.activeElement; const sel = focus?.dataset ? { ...focus.dataset } : null; const pos = focus?.selectionStart;
        render();
        if (sel) { const q = Object.entries(sel).map(([k, v]) => `[data-${k}="${v}"]`).join(''); const el = q && body.querySelector('input' + q); if (el) { el.focus(); if (pos != null) el.setSelectionRange(pos, pos); } }
      }, now ? 0 : 250);
    };
    const bad = (r) => r.error || (r.parameters || []).some((p) => p.problem) || Object.keys(r.problems || {}).length ||
      eqs.some((e) => !String(e.expr).trim()) || vars.some((v) => !v.name || !String(v.expression ?? '').trim());
    const d = dialog({ title: 'Equations, Global Variables, and Dimensions', body, cls: 'eqdialog', buttons: [
      { label: 'OK', primary: true, run: () => {
        (async () => {
          clearTimeout(timer);
          const r = await evaluate();
          if (bad(r)) { render(); this.status('Fix the items in red (or empty rows) first.'); return; }
          const dd = draft();
          this.commit('Equations', () => {
            this.doc.parameters = dd.parameters; if (!dd.parameters) delete this.doc.parameters;
            const byId = Object.fromEntries(r.features.map((f) => [f.id, f]));
            for (const f of this.doc.features) {
              const n = byId[f.id]; if (!n) continue;
              delete f.eq; for (const c of f.constraints || []) delete c.eq;
              Object.assign(f, n);
            }
          });
          d.close();
        })();
        return false;
      } },
      { label: 'Cancel' },
    ] });
    render();
    refresh(true);
  }

  async massProperties() {
    if (this.isAsm) return this.asm.massProperties();
    let r;
    try { r = await this.api('/api/mass', { doc: this.cleanDoc() }); } catch (err) { this.toast(String(err)); return; }
    if (r.error) { message('Mass Properties', esc(r.error)); return; }
    const m = this.doc.material;
    const g = (v) => fmt(v * 1000, 2);
    message('Mass Properties', `<table class="mass-table">
      <tr><td>Material</td><td>${esc(m?.name || 'not specified (density 1000 kg/m^3)')}</td></tr>
      <tr><td>Density</td><td>${fmt(r.density * 1e9, 1)} kg/m^3</td></tr>
      <tr><td>Mass</td><td>${g(r.mass)} grams</td></tr>
      <tr><td>Volume</td><td>${fmt(r.volume, 2)} mm^3</td></tr>
      <tr><td>Surface area</td><td>${fmt(r.area, 2)} mm^2</td></tr>
      <tr><td>Center of mass</td><td>X = ${fmt(r.center_of_mass[0], 3)}<br>Y = ${fmt(r.center_of_mass[1], 3)}<br>Z = ${fmt(r.center_of_mass[2], 3)}</td></tr>
      <tr><td>Bounding box</td><td>${r.bbox[1].map((v, i) => fmt(v - r.bbox[0][i], 2)).join(' x ')} mm</td></tr>
      <tr><td>Solid bodies</td><td>${r.bodies}</td></tr></table>`);
  }

  measurePM() {
    if (this.mode === 'sketch') this.exitSketch();
    const picks = [];
    const result = () => {
      if (!picks.length) return 'Select edges or faces.';
      const out = [];
      const edges = picks.filter((p) => p.kind === 'edge'), faces = picks.filter((p) => p.kind === 'face');
      if (edges.length) out.push(`Length: ${fmt(edges.reduce((s, e) => s + e.data.length, 0), 3)} mm`);
      if (faces.length) out.push(`Area: ${fmt(faces.reduce((s, f) => s + f.data.area, 0), 3)} mm^2`);
      if (faces.length === 2 && faces[0].data.normal && faces[1].data.normal) {
        const [a, b] = faces.map((f) => f.data);
        const dt = a.normal[0] * b.normal[0] + a.normal[1] * b.normal[1] + a.normal[2] * b.normal[2];
        if (Math.abs(Math.abs(dt) - 1) < 1e-6) out.push(`Normal distance: ${fmt(Math.abs((b.center[0] - a.center[0]) * a.normal[0] + (b.center[1] - a.center[1]) * a.normal[1] + (b.center[2] - a.center[2]) * a.normal[2]), 3)} mm`);
        else out.push(`Angle: ${fmt(Math.acos(Math.max(-1, Math.min(1, dt))) * 180 / Math.PI, 2)}°`);
      }
      if (picks.length === 2) {
        const c = picks.map((p) => p.kind === 'edge' ? p.data.mid : p.data.center);
        out.push(`Center distance: ${fmt(Math.hypot(c[1][0] - c[0][0], c[1][1] - c[0][1], c[1][2] - c[0][2]), 3)} mm`);
      }
      return out.join('<br>');
    };
    this.closeCommand();
    this.cmd = { onPick: (p) => { if (p.kind !== 'edge' && p.kind !== 'face') return false; const i = picks.findIndex((x) => x.kind === p.kind && x.id === p.id); if (i >= 0) picks.splice(i, 1); else {
      const matrix = this.isAsm ? this.asm.resComp(String(p.id).split('/')[0])?.matrix : null;
      picks.push({ ...p, data: measurementData(p.data, matrix) });
    } this.viewer.setSelectedKeys(picks.map((x) => `${x.kind}:${x.id}`)); return true; }, onOk: () => {} };
    this.pm.open({ title: 'Measure', icon: 'measure', okEnabled: () => true, noCancel: true, sections: [
      { title: 'Selections', rows: [{ type: 'selbox', id: 'm', placeholder: 'Select edges or faces', items: () => picks, label: (p, i) => `${p.kind === 'edge' ? 'Edge' : 'Face'}<${i + 1}>`, remove: (i) => picks.splice(i, 1), kinds: ['edge', 'face'] }] },
      { title: 'Results', rows: [{ type: 'custom', render: (row) => { row.innerHTML = `<div>${result()}</div>`; } }] },
    ] });
  }

  sectionPM() { this.section.toggle(); }

  checkModel() {
    if (this.isAsm) {
      const bad = (this.asm.res?.mates || []).filter((m) => m.state === 'error').map((m) => `${icon('error', 14)} <b>${esc(this.asm.mate(m.id)?.name)}</b>: ${esc(m.message)}`);
      const badp = Object.entries(this.asm.res?.parts || {}).flatMap(([pid, p]) => p.status.filter((s) => s.state === 'error').map((s) => `${icon('error', 14)} <b>${esc(this.asm.partName(pid))}</b>: ${esc(s.message)}`));
      message(bad.length || badp.length ? 'What\'s Wrong' : 'Check Entity', [...badp, ...bad].join('<br>') || 'No errors found. All mates are satisfied.');
      return;
    }
    const errs = (this.result?.status || []).filter((s) => s.state === 'error' || s.state === 'warning');
    if (!errs.length) { message('Check Entity', 'No errors found. The model rebuilds cleanly.'); return; }
    message('What\'s Wrong', errs.map((s) => `${icon(s.state === 'error' ? 'error' : 'warning', 14)} <b>${esc(this.featureById(s.id)?.name || s.id)}</b>: ${esc(s.message)}`).join('<br>'));
  }

  async statsDialog() {
    const t0 = performance.now();
    await this.regen();
    const dt = performance.now() - t0;
    message('Performance Evaluation', `${this.isAsm ? 'Components: ' + this.doc.components.length : 'Features: ' + this.doc.features.length}<br>Full rebuild (including transfer): ${fmt(dt, 0)} ms`);
  }

  // ------------------------------------------------------------------ files
  newDoc() {
    const go = (kind) => {
      this.server.unlink();
      this.hideContextToolbar();
      if (this.mode === 'sketch') this.exitSketch({ silent: true });
      this.closeCommand();
      if (this.docStack.length) { this.doc = this.cleanDoc(this.docStack[0].doc); this.undoStack = this.docStack[0].undo; this.redoStack = this.docStack[0].redo; this.docStack = []; }
      this.pushUndo('New');
      this.doc = kind === 'assembly' ? newAssembly() : newDoc();
      this.proposal = null;
      this.docChanged();
      this.dirty = false; this.updateDocChrome();
      this.ribbon.setTab(kind === 'assembly' ? 'Assembly' : 'Features');
      this.setSelection([]);
      this.viewer.setBody(null);
      this.regen().then(() => { this.viewer.standardView('trimetric'); this.viewer.zoomToFit(); if (kind === 'assembly') this.asm.insertPM(); });
    };
    const body = document.createElement('div');
    body.className = 'newdoc';
    body.innerHTML = `<button class="nd" data-k="part">${icon('part', 48)}<b>Part</b><span>a 3D representation of a single design component</span></button>
      <button class="nd" data-k="assembly">${icon('assembly', 48)}<b>Assembly</b><span>a 3D arrangement of parts and other assemblies</span></button>`;
    const dlg = dialog({ title: 'New OpenSketch Document', body, buttons: [{ label: 'Cancel' }] });
    body.querySelectorAll('.nd').forEach((n) => {
      n.onclick = async () => {
        dlg.close();
        if (!(await this.confirmLeaveDraft())) return;
        if (!(await this.server.createAndOpen(n.dataset.k))) go(n.dataset.k); // no server: a draft here
      };
    });
    setTimeout(() => body.querySelector('.nd')?.focus(), 0);
  }

  openFile() { this.files.open(); }
  openFromComputer() { $('fileinput').value = ''; $('fileinput').click(); }

  // STEP or EAGLE XML (and a clear message for SOLIDWORKS files) -> document, via the server.
  // The file goes up as raw bytes, gzipped when the browser can (STEP is text: about 5x smaller),
  // so large files fit through the Codespaces tunnel. Errors always say something.
  async importFile(file) {
    this.status(`Importing ${file.name}...`);
    const done = this.busy(`Importing ${file.name}`, 0);
    try { return await this.uploadImport(file); } finally { done(); }
  }

  async uploadImport(file) {
    let body = file, gz = false;
    if (typeof CompressionStream === 'function' && !/\.zip$/i.test(file.name)) {  // a zip is already compressed
      try { body = await new Response(file.stream().pipeThrough(new CompressionStream('gzip'))).blob(); gz = true; } catch { body = file; }
    }
    const headers = { 'Content-Type': 'application/octet-stream' };
    if (gz) headers['X-OpenSketch-Gzip'] = '1';
    let r;
    try {
      r = await fetch('/api/import/raw?filename=' + encodeURIComponent(file.name), { method: 'POST', headers, body });
    } catch {
      throw new Error('The connection to the OpenSketch server dropped during the upload. Check the server is still running, then try again.');
    }
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.doc) return j.doc;
    throw new Error(j.error || j.detail || importFailText(r.status, body.size));
  }

  isImportable(file) { return /\.(step|stp|brd|zip|sldprt|sldasm)$/i.test(file?.name || ''); }

  // Any file the user opens, drops or inserts -> part or assembly document, with a plain message
  // for files OpenSketch cannot read (instead of a JSON parser error).
  async readDocFile(file) {
    if (this.isImportable(file)) return this.importFile(file);
    const name = file?.name || 'the file';
    if (!/\.(osk|json)$/i.test(name)) {
      const ext = (name.match(/\.[^.]+$/) || [''])[0];
      throw new Error(`OpenSketch cannot open ${ext ? ext + ' files' : name}. Use STEP (.step, .stp), EAGLE XML (.brd), a .zip holding one CAD file, or an OpenSketch file (.osk).`);
    }
    try { return JSON.parse(await file.text()); } catch { throw new Error(`${name} is not a valid OpenSketch file.`); }
  }

  async loadFile(file) {
    if (!file) return;
    if (!this.reviewMode) { this.files.upload([file]); return; } // into Files, then opened (asks about a draft first)
    try {
      const d = await this.readDocFile(file);
      if (!Array.isArray(d.features) && !isAssembly(d)) throw new Error('Not an OpenSketch part or assembly');
      this.server.unlink(); // a file from disk is a new document, not the server one
      this.hideContextToolbar();
      if (this.mode === 'sketch') this.exitSketch({ silent: true });
      this.closeCommand();
      if (this.docStack.length) { this.doc = this.cleanDoc(this.docStack[0].doc); this.undoStack = this.docStack[0].undo; this.redoStack = this.docStack[0].redo; this.docStack = []; }
      this.pushUndo('Open');
      this.doc = d; this.doc.seq = this.doc.seq || 1000;
      this.proposal = null;
      this.docChanged();
      this.dirty = false; this.updateDocChrome();
      this.ribbon.setTab(isAssembly(d) ? 'Assembly' : 'Features');
      this.viewer.setBody(null);
      await this.regen(false, isAssembly(d) ? `Loading ${d.components.length} components` : 'Loading model');
      this.viewer.zoomToFit();
      if (this.isImportable(file)) {
        this.status(isAssembly(d)
          ? `Imported ${d.components.length} components. Add mates with Mate, or OpenSketch AI > Add Mates.`
          : d.pcb?.format === 'eagle-xml'
            ? 'Imported PCB as editable outline, thickness and mechanical-hole features.'
            : 'Imported as Imported1. Add features on top, or ask the AI to rebuild it as features.');
      }
    } catch (err) { message('Open', 'Could not open the file: ' + esc(err.message)); }
  }

  // Replace a part (an AI placeholder) with a downloaded STEP. Works on a pending proposal or the doc.
  async replacePartFromFile(pid, file) {
    let d;
    try { d = await this.importFile(file); } catch (err) { message('Import', esc(err.message)); return false; }
    if (isAssembly(d)) { message('Import', 'That STEP has several bodies. Pick a single-part STEP to replace the placeholder.'); return false; }
    const target = this.proposal || this.doc;
    if (!isAssembly(target) || !target.parts[pid]) { message('Import', `Part ${esc(pid)} is not in this assembly any more.`); return false; }
    const apply = (doc) => { const old = doc.parts[pid]; doc.parts[pid] = { ...d, name: d.name || old.name, appearance: old.appearance }; };
    this.server.partReplaced(pid);
    if (this.proposal) { apply(this.proposal); await this.regen(); } else this.commit('Replace ' + pid, () => apply(this.doc));
    this.status(`Replaced ${pid} with ${file.name}. Check its mates: the new faces may sit differently.`);
    return true;
  }

  // Drop a file on the graphics area: STEP or .osk. In an assembly it is inserted, otherwise opened.
  bindDrop() {
    const g = $('graphics');
    g.addEventListener('dragover', (e) => { e.preventDefault(); g.classList.add('dropping'); });
    g.addEventListener('dragleave', () => g.classList.remove('dropping'));
    g.addEventListener('drop', (e) => {
      e.preventDefault(); g.classList.remove('dropping');
      const f = e.dataTransfer?.files?.[0];
      if (!f) return;
      if (this.isAsm && !this.proposal) this.asm.insertFile(f); else this.loadFile(f);
    });
  }

  download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  saveFile() {
    if (this.reviewMode) return;
    if (this.server.linked) { // a file in Files saves itself; Save just does it now
      this.server.flush();
      this.server.scheduleThumb(400);
      this.dirty = false; this.updateDocChrome();
      this.toast('Saved to your Files.');
      return;
    }
    this.server.saveDraft();
  }

  downloadOsk() {
    const d = this.rootDoc();
    this.download(new Blob([JSON.stringify(d, null, 1)], { type: 'application/json' }), `${d.name}.osk`);
    if (!this.server.linked) { this.dirty = false; this.updateDocChrome(); }
    this.status('Saved ' + d.name + '.osk');
  }

  saveAs() {
    const opts = [
      { id: 'files', t: this.server.linked ? 'A copy in Files' : 'Save to Files', d: this.server.linked ? 'A new file with this model, opened here.' : 'Saves itself from then on, with version history. Your AI can open it.', run: () => (this.server.linked ? this.server.saveAsNew(`${this.rootDoc().name} copy`) : this.server.saveDraft()) },
      { id: 'osk', t: this.isAsm ? 'OpenSketch assembly (.osk)' : 'OpenSketch part (.osk)', d: 'Download the full model with its feature tree.', run: () => this.downloadOsk() },
      { id: 'step', t: 'STEP AP214 (.step)', d: 'For SOLIDWORKS, Fusion, Onshape and most CAD.', run: () => this.exportAs('step') },
      { id: 'stl', t: 'STL (.stl)', d: 'A mesh for 3D printing.', run: () => this.exportAs('stl') },
      { id: 'bas', t: 'SOLIDWORKS macro (.bas)', d: 'Rebuilds the parts and mates as native SOLIDWORKS features.', run: () => this.exportMacro() },
    ];
    const body = document.createElement('div');
    body.className = 'saveas';
    const d = dialog({ title: 'Save As', body, cls: 'saveas-dlg', buttons: [{ label: 'Cancel' }] });
    for (const o of opts) {
      const b = document.createElement('button');
      b.className = 'saveas-opt';
      b.innerHTML = '<b></b><span></span>';
      b.children[0].textContent = o.t; b.children[1].textContent = o.d;
      b.onclick = () => { d.close(); o.run(); };
      body.appendChild(b);
    }
    setTimeout(() => body.querySelector('button')?.focus(), 0);
  }

  async exportAs(fmtName) {
    // An assembly with a part left rolled back would export without that part's later features (or with
    // no body at all). Say which part, and offer to roll it forward first (one undo step).
    if (this.isAsm && !this.proposal) {
      const rb = this.asm.rolledBackComponents();
      if (rb.length) {
        const seen = new Set();
        const lines = rb.filter((x) => !seen.has(x.pid) && seen.add(x.pid)).map((x) => {
          const built = this.asm.res?.parts?.[x.pid];
          const what = built && !built.bbox ? 'so it has no body' : 'so the features from there down are left out';
          return `<li><b>${esc(x.comp.name)}</b>: the rollback bar is above ${esc(x.feature.name)}, ${what}.</li>`;
        }).join('');
        const one = rb.length === 1;
        message('Export', `<p style="margin:0 0 8px">${one ? 'This part is' : 'These parts are'} rolled back:</p><ul style="margin:0 0 8px;padding-left:18px">${lines}</ul><p style="margin:0">Roll ${one ? 'it' : 'them'} to the end and export?</p>`, [
          { label: 'Cancel' },
          { label: 'Roll to End and Export', primary: true, run: () => { this.asm.rollPartsToEnd(rb.map((x) => x.pid)); setTimeout(() => this.exportAs(fmtName), 0); } },
        ]);
        return;
      }
    }
    try {
      const r = await fetch('/api/export/' + fmtName, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ doc: this.cleanDoc() }) });
      if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.detail || r.statusText); }
      this.download(await r.blob(), `${this.doc.name}.${fmtName}`);
    } catch (err) { message('Export', esc(err.message || err)); }
  }

  // SOLIDWORKS macro: a background job on the server (the macro is checked before it is handed over).
  exportMacro() {
    if (this.proposal) { this.toast('Accept or reject the AI proposal first.'); return; }
    const doc = this.rootDoc();
    const asm = doc.type === 'assembly';
    const body = document.createElement('div');
    body.className = 'macro-dlg';
    body.innerHTML = `<div class="pm-note">Writes a macro that rebuilds ${asm ? 'every part as SOLIDWORKS features, then the assembly with its mates' : 'the part as SOLIDWORKS features'}. Parts the macro cannot build as features are sent as STEP files it imports.</div>
      <label class="pm-radio macro-full"><input type="checkbox" checked> Full checks: every sketch solved, about 50 SOLIDWORKS scenarios run against the macro and the result rebuilt. Takes several minutes${asm ? ' (up to 10 for a large assembly)' : ''}. Without it: grammar, names${asm ? ' and the assembly stand-in' : ''} only, about a minute.</label>
      <div class="macro-log hidden"></div><div class="macro-sum"></div>`;
    const log = body.querySelector('.macro-log');
    const sum = body.querySelector('.macro-sum');
    const full = body.querySelector('.macro-full input');
    let stop = false;
    let jid = null;
    let started = false;
    const go = async () => {
      started = true;
      btn.textContent = 'Download';
      btn.disabled = true;
      full.disabled = true;
      log.classList.remove('hidden');
      try {
        const r = await this.api('/api/export/sldmacro/start', { doc, verify: full.checked });
        jid = r.job;
        for (;;) {
          await new Promise((ok) => setTimeout(ok, 1000));
          if (stop) return;
          const st = await this.api('/api/export/sldmacro/' + jid, null, 'GET');
          log.textContent = (st.log || []).slice(-6).join('\n') + (st.state === 'running' ? `\n(${st.seconds} s)` : '');
          if (st.state === 'error') { sum.innerHTML = `<div class="ai-msg err">${esc(st.error || 'The export failed')}</div>`; return; }
          if (st.state === 'done') {
            sum.innerHTML = macroSummary(st.report);
            body.dataset.done = '1';
            btn.disabled = false;
            this.status('SOLIDWORKS macro ready: ' + st.report.name + '.bas');
            return;
          }
        }
      } catch (err) { sum.innerHTML = `<div class="ai-msg err">${esc(String(err.message || err))}</div>`; }
    };
    const dl = dialog({ title: 'Export SOLIDWORKS Macro', body, cls: 'macro', buttons: [
      { label: 'Write Macro', primary: true, run: () => {
        if (!started) { go(); return false; }
        if (jid && body.dataset.done) this.download2(`/api/export/sldmacro/${jid}/zip`);
        return false;
      } },
      { label: 'Close', run: () => { stop = true; } },
    ], onClose: () => { stop = true; } });
    const btn = dl.el.querySelector('.dlg-f .btn.primary');
  }

  download2(url) {
    const a = document.createElement('a');
    a.href = url; a.download = '';
    document.body.appendChild(a); a.click(); a.remove();
  }

  materialDialog() {
    const body = document.createElement('div');
    const sel = document.createElement('select'); sel.size = 12; sel.style.width = '260px';
    for (const [n, d] of MATERIALS) { const o = document.createElement('option'); o.value = n; o.textContent = `${n}  (${fmt(d * 1e9, 0)} kg/m^3)`; sel.appendChild(o); }
    sel.value = this.doc.material?.name || 'ABS';
    body.appendChild(sel);
    dialog({ title: 'Material', body, buttons: [
      { label: 'Apply', primary: true, run: () => { const m = MATERIALS.find((x) => x[0] === sel.value); this.commit('Material', () => { this.doc.material = { name: m[0], density: m[1] }; }, false); } },
      { label: 'Remove Material', run: () => this.commit('Material', () => { delete this.doc.material; }, false) },
      { label: 'Close' },
    ] });
  }

  setAppearance(hex) {
    if (this.isAsm) {
      const comps = this.selection.filter((s) => s.kind === 'component').map((s) => this.asm.comp(s.id)).filter(Boolean);
      if (!comps.length) { this.toast('Select a component first. Its part takes the colour.'); return; }
      for (const c of comps) this.doc.parts[c.part].appearance = hex;
      this.docChanged();
      this.asm.draw();
      return;
    }
    this.doc.appearance = hex;
    this.docChanged();
    for (const f of this.viewer.faceObjs) f.userData.baseColor = this.bodyColor();
    this.viewer.applyDisplayStyle(); this.viewer.refreshHighlights();
  }

  optionsDialog() {
    const body = document.createElement('div');
    body.innerHTML = `<b>System Options</b><br><br>
      <label class="pm-radio"><input type="checkbox" id="opt-wheel" ${this.viewer.reverseWheel ? 'checked' : ''}> Reverse direction of mouse wheel zoom</label><br>
      <label class="pm-radio"><input type="checkbox" id="opt-rel" ${this.view.relations ? 'checked' : ''}> Display sketch relations</label><br>
      <b>Document Properties</b><br><br>Units: MMGS (millimeter, gram, second)<br>Decimals: 0.12`;
    dialog({ title: 'System Options - General', body, buttons: [{ label: 'OK', primary: true, run: () => {
      this.viewer.reverseWheel = body.querySelector('#opt-wheel').checked;
      this.view.relations = body.querySelector('#opt-rel').checked; this.sketcher.showRelations = this.view.relations; this.sketcher.render();
    } }, { label: 'Cancel' }] });
  }

  helpMenu(anchor) {
    const r = anchor.getBoundingClientRect();
    contextMenu(Math.max(4, r.right - 220), r.bottom + 6, [
      { label: 'Getting started', run: () => this.openTask('resources') },
      { label: 'Keyboard shortcuts', run: () => this.shortcutsDialog() },
      { label: 'Connect AI...', run: () => this.server.connectDialog() },
      '-',
      { label: 'About OpenSketch', run: () => this.aboutDialog() },
    ]);
  }

  shortcutsDialog() {
    const rows = [['Middle drag', 'Rotate'], ['Ctrl + Middle drag', 'Pan'], ['Shift + Middle drag', 'Zoom'], ['Alt + Left drag', 'Rotate (trackpad)'], ['Wheel', 'Zoom at cursor'],
      ['Space', 'View Orientation'], ['Tab / Shift+Tab', 'Hide / show the component under the cursor'], ['Ctrl+1 ... Ctrl+7', 'Front, Back, Left, Right, Top, Bottom, Isometric'], ['Ctrl+8', 'Normal To'], ['F', 'Zoom to Fit'], ['Z / Shift+Z', 'Zoom out / in'],
      ['Arrows', 'Rotate 15 deg'], ['Shift+Arrows', 'Rotate 90 deg'], ['Alt+Left/Right', 'Roll'], ['Ctrl+Arrows', 'Pan'],
      ['Ctrl+Z / Ctrl+Y', 'Undo / Redo'], ['Ctrl+B', 'Rebuild'], ['Ctrl+S / Ctrl+O / Ctrl+N', 'Save to Files / Files / New'], ['Enter', 'Repeat last command'], ['S', 'Shortcut toolbar'], ['Esc', 'Cancel / clear selection'], ['Delete', 'Delete selection'],
      ['L, C, R, D', 'Line, Circle, Rectangle, Smart Dimension (in a sketch)'], ['Ctrl+L', 'OpenSketch AI'], ['Ctrl+K', 'Search commands (search files on the Files page)']];
    message('Keyboard Shortcuts', `<table class="kbd-table">${rows.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('')}</table>`);
  }

  aboutDialog() { message('About OpenSketch', 'OpenSketch 0.6<br>Parametric parts and assemblies on build123d (OpenCascade), with an AI design copilot that builds in front of you. Exports SOLIDWORKS macros that rebuild parts and mated assemblies.<br>Interface modelled on the SOLIDWORKS workflow. Not affiliated with Dassault Systemes.'); }

  // ------------------------------------------------------------------ AI proposals
  openTask(id) { this.taskpane.show(id); }
  aiQuick(prompt) { this.taskpane.send(prompt); }

  async showProposal(doc, ids, fit = true) {
    if (this.mode === 'sketch') this.exitSketch();
    this.closeCommand();
    this.proposal = doc;
    this.proposedIds = ids;
    if (this.isAsm) { this.viewer.setBody(null); this.ribbon.setTab('Assembly'); } else this.viewer.setAssembly([], {});
    this.updateDocChrome();
    await this.regen();
    if (fit) this.viewer.zoomToFit();
  }

  acceptProposal() {
    const p = this.proposal;
    if (!p) return;
    const wasAsm = this.isAsm;
    this.proposal = null;
    this.pushUndo('AI change');
    this.doc = { ...p, seq: Math.max(this.doc.seq || 1, p.seq || 1) };
    this.proposedIds = [];
    this.docChanged();
    if (wasAsm) this.ribbon.setTab('Assembly');
    this.regen();
  }

  rejectProposal(silent = false) {
    if (!this.proposal) return;
    this.proposal = null; this.proposedIds = [];
    for (const m of this.taskpane.log) if (m.state === 'pending') m.state = 'rejected';
    this.updateDocChrome();
    if (!this.isAsm) this.viewer.setAssembly([], {});
    if (!silent) { this.regen(); this.taskpane.render(); }
  }

  // ------------------------------------------------------------------ chrome
  status(msg) { $('sb-msg').textContent = msg; }
  coords(t) { $('sb-coords').textContent = t; }
  statusDefined(text, cls) { const e = $('sb-defined'); e.textContent = text; e.className = 'sb-cell ' + (cls || ''); this.tree.render(); }
  sketchDefinedPrefix(f) {
    if (this.mode === 'sketch' && this.sketcher.skId === f.id) return this.sketcher.state?.status === 'under' ? '(-) ' : this.sketcher.state?.status === 'over' ? '(+) ' : '';
    // every tree redraw asks for every sketch: solve each version of a sketch once
    const key = JSON.stringify(f);
    this._defCache = this._defCache || new Map();
    if (this._defCache.has(key)) return this._defCache.get(key);
    let out = '';
    try { const s = solveSketch(clone(f)); out = s.status === 'under' ? '(-) ' : s.status === 'over' ? '(+) ' : ''; } catch (_) { out = ''; }
    if (this._defCache.size > 300) this._defCache.clear();
    this._defCache.set(key, out);
    return out;
  }

  // Short notes at the bottom centre. ms 0 = until closed. action {label, run}. Returns {close}.
  toast(msg, ms = 3200, action = null) {
    let host = $('toasts');
    if (!host) { host = document.createElement('div'); host.id = 'toasts'; host.setAttribute('role', 'status'); host.setAttribute('aria-live', 'polite'); document.body.appendChild(host); }
    while (host.children.length > 2) host.firstChild.remove();
    const t = document.createElement('div');
    t.className = 'toast2';
    const span = document.createElement('span'); span.textContent = msg; t.appendChild(span);
    let timer = null;
    const close = () => { clearTimeout(timer); t.classList.add('out'); setTimeout(() => t.remove(), 180); };
    if (action) {
      const b = document.createElement('button'); b.className = 'toast-act'; b.textContent = action.label;
      b.onclick = () => { close(); action.run(); };
      t.appendChild(b);
    }
    host.appendChild(t);
    if (ms) timer = setTimeout(close, ms);
    return { close };
  }

  cursorFeedback(fb) {
    const el = $('sketchcursor');
    if (!fb || (!fb.glyph && !fb.value)) { el.classList.add('hidden'); return; }
    el.innerHTML = (fb.glyph ? `<span class="glyph">${icon(fb.glyph, 14)}</span>` : '') + (fb.value ? `<span class="val">${fb.value}</span>` : '');
    el.style.left = fb.x + 16 + 'px'; el.style.top = fb.y + 14 + 'px';
    el.classList.remove('hidden');
  }

  showSelBox(b) {
    const el = $('selbox');
    if (!b) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    el.classList.toggle('crossing', b.x1 < b.x0 && !this.zoomAreaMode);
    el.style.left = Math.min(b.x0, b.x1) + 'px'; el.style.top = Math.min(b.y0, b.y1) + 'px';
    el.style.width = Math.abs(b.x1 - b.x0) + 'px'; el.style.height = Math.abs(b.y1 - b.y0) + 'px';
  }

  finishZoomArea() {
    const b = this.zoomBox; this.zoomBox = null; this.zoomAreaMode = false; this.showSelBox(null);
    $('headsup').querySelector('[data-id=zoomarea]')?.classList.remove('on');
    const w = Math.abs(b.x1 - b.x0), h = Math.abs(b.y1 - b.y0);
    if (w < 5 || h < 5) return;
    const v = this.viewer;
    v.zoomAt(1, 0, 0);
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    v.panBy(v.w / 2 - cx, v.h / 2 - cy);
    v.zoomAt(Math.max(w / v.w, h / v.h), v.w / 2, v.h / 2);
  }

  updateConfirmCorner() {
    const el = $('confirmcorner');
    el.innerHTML = '';
    if (this.mode !== 'sketch') { el.classList.add('hidden'); return; }
    const a = document.createElement('div'); a.className = 'cc'; a.title = 'Exit Sketch'; a.innerHTML = icon('exitsketch', 30); a.onclick = () => this.exitSketch();
    const b = document.createElement('div'); b.className = 'cc'; b.title = 'Discard changes and exit'; b.innerHTML = icon('cancel', 26); b.onclick = () => this.discardSketch();
    el.append(a, b);
    el.classList.remove('hidden');
  }

  updateBreadcrumbs() {
    const el = $('breadcrumbs');
    if (!el) return;
    el.innerHTML = `<span class="bc">${icon(isAssembly(this.doc) ? 'assembly' : 'part', 14)}${esc(this.doc.name)}</span>` + (this.mode === 'sketch' ? `<span class="bc">${icon('sketch_t', 14)}${esc(this.sketcher.sk?.name || '')}</span>` : '');
  }

  buildMgrTabs() {
    const tabs = [['feature_mgr', 'FeatureManager Design Tree', 'tree'], ['property_mgr', 'PropertyManager', 'pm'], ['config_mgr', 'ConfigurationManager', null], ['dimxpert', 'DimXpertManager', null], ['display_mgr', 'DisplayManager', null]];
    const el = $('mgrtabs');
    tabs.forEach(([ic, title, panel], i) => {
      const t = document.createElement('div'); t.className = 'mgrtab' + (i === 0 ? ' active' : ''); t.title = title; t.innerHTML = icon(ic, 18);
      t.onclick = () => { if (panel === 'tree') this.showPanel('tree'); else if (panel === 'pm' && this.pm.isOpen) this.showPanel('pm'); else if (!panel) this.toast(title + ' is not available yet.'); };
      el.appendChild(t);
    });
  }

  buildHeadsUp() {
    const el = $('headsup');
    const v = this.viewer;
    const add = (id, ic, title, run, caret = false) => {
      const b = document.createElement('div'); b.className = 'hu'; b.dataset.id = id; b.title = title;
      b.innerHTML = icon(ic, 20) + (caret ? '<span class="caret">&#9660;</span>' : '');
      b.onclick = (e) => run(b, e);
      el.appendChild(b); return b;
    };
    const sep = () => { const s = document.createElement('div'); s.className = 'hu-sep'; el.appendChild(s); };
    const fly = (anchor, items) => {
      const r = anchor.getBoundingClientRect();
      contextMenu(r.left, r.bottom + 2, items);
    };
    add('zoomfit', 'zoomfit', 'Zoom to Fit (F)', () => v.zoomToFit());
    add('zoomarea', 'zoomarea', 'Zoom to Area', (b) => { this.zoomAreaMode = !this.zoomAreaMode; b.classList.toggle('on', this.zoomAreaMode); });
    add('prevview', 'prevview', 'Previous View', () => v.previousView());
    sep();
    add('section', 'sectionview', 'Section View', () => this.sectionPM());
    sep();
    add('orient', 'vieworient', 'View Orientation (Spacebar)', (b) => this.orientationPopup(b), true);
    add('display', 'displaystyle', 'Display Style', (b) => fly(b, [
      ['shadedEdges', 'Shaded With Edges'], ['shaded', 'Shaded'], ['hlr', 'Hidden Lines Removed'], ['hlv', 'Hidden Lines Visible'], ['wireframe', 'Wireframe']].map(([s, l]) => ({ label: l, icon: 'displaystyle', run: () => v.setDisplayStyle(s) }))), true);
    add('hideshow', 'hideshow', 'Hide/Show Items', (b) => fly(b, [
      { label: (this.view.planes ? '✓ ' : '') + 'View Planes', icon: 'plane', run: () => this.toggleView('planes') },
      { label: (this.view.origins ? '✓ ' : '') + 'View Origins', icon: 'origin', run: () => this.toggleView('origins') },
      { label: (this.view.sketches ? '✓ ' : '') + 'View Sketches', icon: 'sketch_t', run: () => this.toggleView('sketches') },
      { label: (this.view.relations ? '✓ ' : '') + 'View Sketch Relations', icon: 'r_coincident', run: () => this.toggleView('relations') },
    ]), true);
    add('appearance', 'appearance', 'Edit Appearance', () => this.openTask('appearance'), true);
    add('scene', 'scene', 'Apply Scene', () => this.openTask('appearance'), true);
    add('viewsettings', 'viewsettings', 'View Settings', (b) => fly(b, [{ label: 'Reverse mouse wheel zoom', run: () => { v.reverseWheel = !v.reverseWheel; } }]), true);
  }

  orientationPopup(anchor) {
    const el = $('viewcube');
    if (!el.classList.contains('hidden')) { el.classList.add('hidden'); return; }
    const views = [['front', 'front', 'Front (Ctrl+1)'], ['back', 'front', 'Back (Ctrl+2)'], ['left', 'right', 'Left (Ctrl+3)'], ['right', 'right', 'Right (Ctrl+4)'], ['top', 'top', 'Top (Ctrl+5)'], ['bottom', 'top', 'Bottom (Ctrl+6)'], ['isometric', 'iso', 'Isometric (Ctrl+7)'], ['trimetric', 'iso', 'Trimetric'], ['dimetric', 'iso', 'Dimetric'], ['normal', 'normalto', 'Normal To (Ctrl+8)']];
    el.innerHTML = '<div style="margin-bottom:4px;font-weight:600">Orientation</div>';
    const grid = document.createElement('div'); grid.className = 'vo-grid';
    for (const [k, ic, t] of views) {
      const b = document.createElement('div'); b.className = 'fo'; b.title = t; b.innerHTML = icon(ic, 22);
      b.onclick = () => { el.classList.add('hidden'); this.orient(k); };
      grid.appendChild(b);
    }
    el.appendChild(grid);
    el.classList.remove('hidden');
    void anchor;
  }

  orient(k) {
    if (k !== 'normal') return this.viewer.standardView(k);
    if (this.mode === 'sketch') return this.viewer.normalTo(this.sketcher.frame);
    const s = this.selection.find((x) => x.kind === 'plane' || x.kind === 'sketch' || (x.kind === 'face' && x.data?.plane));
    if (!s) { this.toast('Select a plane, planar face or sketch for Normal To.'); return; }
    if (s.kind === 'plane') this.viewer.normalTo(this.planeFrame(s.id));
    else if (s.kind === 'sketch') this.viewer.normalTo(this.sketchFrame(s.id));
    else this.viewer.normalTo(frameForFace(s.data.normal, s.data.center));
  }

  toggleView(k) {
    this.view[k] = !this.view[k];
    if (k === 'relations') { this.sketcher.showRelations = this.view.relations; this.sketcher.render(); }
    this.updatePlanes(); this.drawSketches();
  }

  bindSplitter() {
    const s = $('splitter');
    s.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const mv = (ev) => { const w = Math.max(180, Math.min(520, ev.clientX)); document.getElementById('main').style.setProperty('--left-w', w + 'px'); this.viewer.resize(); };
      const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    });
  }

  shortcutBar(x, y) {
    const el = $('shortcutbar');
    const ids = this.isAsm ? ['insertcomp', 'mate', 'fixfloat', 'interference', 'playback', 'openpart', 'massprops', 'ai'] : this.mode === 'sketch'
      ? ['line', 'centerline', 'rectangle', 'centerrect', 'circle', 'arc', 'threeptarc', 'tangentarc', 'slot', 'polygon', 'point', 'smartdim', 'trim', 'sketchfillet', 'offset', 'convert', 'sketchmirror', 'addrelation']
      : ['sketch', 'extrude', 'cut', 'revolve', 'revcut', 'fillet', 'chamfer', 'shell', 'linpattern', 'circpattern', 'mirror', 'plane', 'measure', 'massprops', 'section', 'ai'];
    el.innerHTML = '';
    for (const id of ids) {
      const c = this.commands[id];
      const b = document.createElement('div'); b.className = 'ct'; b.title = typeof c.label === 'function' ? c.label() : c.label;
      b.innerHTML = icon(typeof c.icon === 'function' ? c.icon() : c.icon, 20);
      b.onclick = () => { el.classList.add('hidden'); this.lastCommand = id; c.run(); this.ribbon.render(); };
      el.appendChild(b);
    }
    const gr = $('graphics').getBoundingClientRect();
    el.style.left = Math.min(gr.width - 180, x - gr.left) + 'px'; el.style.top = Math.min(gr.height - 120, y - gr.top) + 'px';
    el.classList.remove('hidden');
  }

  // SOLIDWORKS: Tab hides the component (or body) under the cursor, Shift+Tab shows hidden ones there.
  tabHide(mouse, show) {
    const r = this.canvasRect();
    const x = mouse.x - r.left, y = mouse.y - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) return;
    if (this.isAsm) return this.asm.tabHide(x, y, show);
    if (this.mode === 'sketch') return;
    if (show) { if (this.bodyHidden) { this.bodyHidden = false; this.viewer.bodyGroup.visible = true; this.viewer.requestRender(); this.status('Body shown'); } return; }
    const p = this.pickAt(x, y);
    if (p && (p.kind === 'face' || p.kind === 'edge')) { this.bodyHidden = true; this.viewer.bodyGroup.visible = false; this.viewer.requestRender(); this.status('Body hidden. Shift+Tab over it shows it again.'); }
  }

  bindKeys() {
    let mouse = { x: 300, y: 300 };
    window.addEventListener('pointermove', (e) => { mouse = { x: e.clientX, y: e.clientY }; });
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      const k = e.key, ctrl = e.ctrlKey || e.metaKey, v = this.viewer;
      if (ctrl && k.toLowerCase() === 'z') { e.preventDefault(); return this.undo(); }
      if (ctrl && k.toLowerCase() === 'y') { e.preventDefault(); return this.redo(); }
      if (ctrl && k.toLowerCase() === 's') { e.preventDefault(); return this.saveFile(); }
      if (ctrl && k.toLowerCase() === 'o') { e.preventDefault(); return this.openFile(); }
      if (ctrl && k.toLowerCase() === 'n') { e.preventDefault(); return this.newDoc(); }
      if (ctrl && (k.toLowerCase() === 'b' || k.toLowerCase() === 'q')) { e.preventDefault(); return this.regen(true); }
      if (ctrl && k.toLowerCase() === 'k') { e.preventDefault(); const q = document.getElementById('cmdsearch'); q?.focus(); q?.select(); return; }
      if (ctrl && k.toLowerCase() === 'l') { e.preventDefault(); return this.openTask('ai'); }
      if (ctrl && /^[1-8]$/.test(k)) { e.preventDefault(); return this.orient(['front', 'back', 'left', 'right', 'top', 'bottom', 'isometric', 'normal'][+k - 1]); }
      if (ctrl && k.startsWith('Arrow')) { e.preventDefault(); const d = 40; return v.panBy(k === 'ArrowLeft' ? -d : k === 'ArrowRight' ? d : 0, k === 'ArrowUp' ? -d : k === 'ArrowDown' ? d : 0); }
      if (e.altKey && (k === 'ArrowLeft' || k === 'ArrowRight')) { e.preventDefault(); return v.rollBy((k === 'ArrowLeft' ? 1 : -1) * Math.PI / 12); }
      if (k.startsWith('Arrow')) { e.preventDefault(); const a = (e.shiftKey ? 90 : 15) * Math.PI / 180; return v.rotateBy(k === 'ArrowLeft' ? -a : k === 'ArrowRight' ? a : 0, k === 'ArrowUp' ? -a : k === 'ArrowDown' ? a : 0); }
      if (k === 'Escape') {
        closeMenus(); this.hideContextToolbar(); $('shortcutbar').classList.add('hidden'); $('viewcube').classList.add('hidden');
        if (this.zoomAreaMode) { this.zoomAreaMode = false; $('headsup').querySelector('[data-id=zoomarea]')?.classList.remove('on'); return; }
        if (this.mode === 'sketch' && !this.cmd) { if (this.sketcher.cancelTool()) return; return; }
        if (this.cmd) return this.pmCancel();
        return this.setSelection([]);
      }
      if (k === 'Delete' || k === 'Backspace') { e.preventDefault(); return this.deleteSelection(); }
      if (k === 'Enter') { if (this.pm.isOpen && (this.cmd || this.mode === 'sketch')) return this.pmOk(); if (this.lastCommand) return this.commands[this.lastCommand].run(); }
      if (k === ' ') { e.preventDefault(); return this.orientationPopup(); }
      if (k === 'Tab') { e.preventDefault(); return this.tabHide(mouse, e.shiftKey); }
      if (ctrl || e.altKey) return;
      if (k === 'f' || k === 'F') return v.zoomToFit();
      if (k === 'z') return v.zoomAt(1.25, v.w / 2, v.h / 2);
      if (k === 'Z') return v.zoomAt(0.8, v.w / 2, v.h / 2);
      if (k === 's') return this.shortcutBar(mouse.x, mouse.y);
      if (this.mode === 'sketch') {
        const map = { l: 'line', c: 'circle', r: 'rectangle', d: 'smartdim', a: 'arc', p: 'point', t: 'trim' };
        if (map[k]) return this.sketchTool(map[k]);
      }
    });
  }
}

// features.js waits for the feature registry (top-level await), so the page may have finished parsing
// before this module runs.
// Only on the real page: tests import this module into a bare DOM to use App's methods without a viewport.
const start = () => { if (document.getElementById('viewport')) window.app = new App(); };
if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', start); else start();


// What the export made, in a few lines: parts (features or STEP), mates, checks.
export function macroSummary(rep) {
  const rows = rep.parts.map((p) => `<tr><td>${esc(p.title)}</td><td>${p.mode === 'features' ? `${p.features} feature${p.features === 1 ? '' : 's'}` : 'STEP import'}</td><td class="why">${esc(p.mode === 'features' ? '' : p.why)}</td></tr>`).join('');
  const ck = rep.checks || {};
  const line = (label, v) => `<li>${label}: <b class="${v === true ? 'ok' : v === false ? 'bad' : ''}">${v === true ? 'pass' : v === false ? 'fail' : 'not run'}</b></li>`;
  const fin = ck.final || {};
  let engine = ck.engine_ok;
  if (!engine && ck.engine_ok_except_known) engine = true;
  const items = [];
  if (rep.parts.some((p) => p.mode === 'features')) items.push(line('Feature macro (sketches, stand-in, grammar)', ck.engine ? engine : null));
  items.push(line('Final file (grammar, names)', fin.grammar?.ok === false || fin.names?.ok === false ? false : fin.grammar?.ok ?? null));
  if (rep.assembly) items.push(line(`Assembly stand-in (${esc(ck.assembly_standin?.summary || '')})`, ck.assembly_standin?.ok ?? null));
  const mates = rep.assembly ? `<div>${rep.mates.exported} mates go to SOLIDWORKS${rep.mates.skipped.length ? `; ${rep.mates.skipped.length} left out (see REPORT.md)` : ''}.</div>` : '';
  return `<table class="macro-parts">${rows}</table>${mates}<ul class="macro-checks">${items.join('')}</ul>
    <div class="pm-note">Not yet run in SOLIDWORKS. Unzip, then Tools &gt; Macro &gt; New, save it in the unzipped folder, paste ${esc(rep.name)}.bas and press F5. REPORT.md has the details.</div>`;
}
