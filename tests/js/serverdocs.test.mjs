// Files linked to the server (serverdocs.js) and the editor's document lifecycle (app.js): undo per file, saves,
// drafts, unsent edits. A fake server answers fetch; the editor is App's own methods on a bare object.
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><body><div id="modal-layer"></div><div id="graphics"></div><div id="tree"></div><input id="treefilter"><div id="sb-editing"></div><div id="sb-defined"></div></body></html>');
globalThis.window = window;
globalThis.document = document;
window.innerWidth = 1280; window.innerHeight = 900;
for (const k of ['select', 'focus']) if (!window.HTMLElement.prototype[k]) window.HTMLElement.prototype[k] = () => {};
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => { mem.set(k, String(v)); },
  removeItem: (k) => { mem.delete(k); }, clear: () => mem.clear(), key: (i) => [...mem.keys()][i] ?? null,
  get length() { return mem.size; },
};
globalThis.location = new URL('http://localhost/');
globalThis.history = { replaceState: (_s, _t, u) => { globalThis.location = new URL(String(u)); } };

// ---------------------------------------------------------------- a fake OpenSketch server
const server = { docs: new Map(), puts: [], calls: [], hold: null, next: 1 };
const part = (name, n = 0) => ({ version: 1, type: 'part', name, units: 'mm', rollback: null, seq: 10,
  features: Array.from({ length: n }, (_, i) => ({ id: 'f' + i, type: 'plane', name: 'Plane' + (i + 1) })) });
function addDoc(id, doc, extra = {}) {
  const rec = { id, name: doc.name, version: 1, by: 'you', summary: 'Created', doc, requests: [], ...extra };
  server.docs.set(id, rec);
  return rec;
}
const reply = (status, body) => ({ ok: status < 300, status, headers: { get: () => 'application/json' }, json: async () => JSON.parse(JSON.stringify(body)) });
globalThis.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  const u = new URL(String(url), 'http://localhost');
  const body = opts.body ? JSON.parse(opts.body) : null;
  server.calls.push(`${method} ${u.pathname}`);
  if (server.hold) await server.hold;
  if (server.down) throw new TypeError('Failed to fetch');
  const m = u.pathname.match(/^\/api\/docs\/([^/]+)(\/(\w+))?$/);
  if (method === 'POST' && u.pathname === '/api/docs') {
    const id = 'n' + server.next++;
    const doc = body.doc || (body.kind === 'assembly' ? { version: 1, type: 'assembly', name: '', parts: {}, components: [], mates: [] } : part(''));
    doc.name = body.name || (body.kind === 'assembly' ? 'Assembly 1' : 'Part 1');
    return reply(200, addDoc(id, doc));
  }
  if (!m) return reply(404, { detail: 'Not Found' });
  const rec = server.docs.get(m[1]);
  if (!rec) return reply(404, { detail: 'No such document' });
  if (method === 'GET' && !m[3]) return reply(200, rec);
  if (method === 'GET' && m[3] === 'head') return reply(200, { id: rec.id, name: rec.name, version: rec.version, by: rec.by, summary: rec.summary });
  if (method === 'PUT' && !m[3]) {
    server.puts.push({ id: rec.id, ...body });
    if (body.base_version !== rec.version) return reply(409, { error: 'conflict', current: { ...rec } });
    Object.assign(rec, { version: rec.version + 1, doc: { ...body.doc, name: rec.name }, by: 'you', summary: body.summary || 'Edited' });
    return reply(200, rec);
  }
  if (method === 'PATCH' && !m[3]) {
    Object.assign(rec, { version: rec.version + 1, name: body.name, doc: { ...rec.doc, name: body.name }, summary: 'Renamed' });
    return reply(200, { ...rec, doc: undefined });
  }
  if (method === 'POST' && m[3] === 'discard') {
    const empty = !(rec.doc.features || []).length && !(rec.doc.components || []).length;
    if (rec.version === 1 && empty) { server.docs.delete(rec.id); return reply(200, { discarded: true }); }
    return reply(409, { discarded: false });
  }
  if (method === 'DELETE') { rec.deleted = Date.now() / 1000; return reply(200, { ...rec, doc: undefined }); }
  return reply(404, { detail: 'Not Found' });
};

const { App } = await import('../../opensketch/static/js/app.js');
const { ServerDocs } = await import('../../opensketch/static/js/serverdocs.js');
const { setScope } = await import('../../opensketch/static/js/scope.js');
setScope(null);
const noop = () => {};
const apps = [];
test.after(() => { for (const a of apps) stopTimers(a); });
const tick = (ms = 0) => new Promise((ok) => setTimeout(ok, ms));

function makeApp() {
  const app = Object.create(App.prototype);
  Object.assign(app, {
    doc: part('Part1'), undoStack: [], redoStack: [], docStack: [], mode: 'part', cmd: null, selection: [], proposal: null,
    reviewMode: false, regenSeq: 0, toasts: [], statusText: '',
    viewer: { setBody: noop, zoomToFit: noop, standardView: noop, snapshot: async () => null, setAssembly: noop },
    ribbon: { setTab: noop, render: noop }, tree: { render: noop }, design: { refresh: noop },
    taskpane: { log: [], render: noop, add: noop, show: noop, busy: false }, live: { active: false },
    asm: {}, pm: { isOpen: false },
    hideContextToolbar: noop, closeCommand: noop, setSelection: noop, updateDocChrome: noop, updateBreadcrumbs: noop,
    regen: async () => {}, status(t) { this.statusText = t; }, toast(t) { this.toasts.push(t); return { close: noop }; },
    isActive: () => true,
  });
  app.server = new ServerDocs(app);
  apps.push(app);
  return app;
}

function stopTimers(app) {
  clearTimeout(app.server.pushTimer); clearTimeout(app.server.thumbTimer); clearInterval(app.server.pollTimer);
  clearTimeout(app._autosaveTimer); app._autosaveTimer = null;
}

async function settle(app) {
  for (let i = 0; i < 20; i++) { await tick(5); if (!app.server.pushing) break; }
  stopTimers(app);
}

test('opening a file starts its own undo history: Ctrl+Z never pours the previous model into it', async () => {
  server.docs.clear(); server.puts = [];
  addDoc('A', part('Housing', 2)); addDoc('B', part('Bracket', 3));
  const app = makeApp();
  assert.equal(await app.server.open('A'), true);
  app.commit('Plane3', () => app.doc.features.push({ id: 'x', type: 'plane', name: 'Plane3' }), false);
  await app.server.flush();
  assert.equal(app.undoStack.length, 1);
  assert.equal(await app.server.open('B'), true);
  assert.equal(app.undoStack.length, 0, 'the new file has no undo steps');
  assert.equal(app.redoStack.length, 0);
  app.undo();
  assert.equal(app.doc.name, 'Bracket');
  assert.equal(app.doc.features.length, 3);
  await settle(app);
  assert.equal(server.puts.filter((p) => p.id === 'B').length, 0, 'nothing was saved into Bracket');
  assert.equal(server.docs.get('B').version, 1);
  assert.equal(server.docs.get('A').doc.features.length, 3, "Housing's edit reached the server before the switch");
});

test('a newer version of the open file is one undo step, and a part open from its assembly keeps its edits', async () => {
  server.docs.clear(); server.puts = [];
  const asm = { version: 1, type: 'assembly', name: 'Press', parts: { p1: part('Plate', 1) }, components: [{ id: 'c1', part: 'p1', name: 'Plate<1>' }], mates: [] };
  addDoc('S', asm);
  const app = makeApp();
  await app.server.open('S');
  // Open Part (asm.openPart): the assembly waits on the stack while the part is edited
  app.docStack.push({ doc: app.doc, undo: app.undoStack, redo: app.redoStack, pid: 'p1' });
  app.doc = JSON.parse(JSON.stringify(asm.parts.p1)); app.undoStack = []; app.redoStack = [];
  app.doc.features.push({ id: 'e', type: 'plane', name: 'Edited' });
  // the poll leaves a part being edited alone: it asks instead
  assert.equal(app.server.busyHere(), true);
  // "Load their version": the undo step is the assembly with the part's edits in it
  const theirs = JSON.parse(JSON.stringify(asm)); theirs.mates.push({ id: 'm1', type: 'coincident' });
  await app.server.apply({ id: 'S', name: 'Press', version: 5, doc: theirs }, { label: 'Your AI: added a mate' });
  assert.equal(app.docStack.length, 0);
  assert.equal(app.undoStack.length, 1);
  const snap = JSON.parse(app.undoStack[0].json);
  assert.equal(snap.parts.p1.features.length, 2, 'the part edit is in the undo step');
  assert.equal(app.doc.mates.length, 1);
});

const click = (label) => {
  const b = [...document.querySelectorAll('#modal-layer .dlg-back:not(.closing) button')].reverse().find((x) => x.textContent === label);
  assert.ok(b, 'button ' + label);
  b.onclick();
};

test('Save to Files resolves true once saved, and a second Save makes no second copy', async () => {
  server.docs.clear(); server.calls = [];
  const app = makeApp();
  app.doc = part('Bracket', 2); app.dirty = true;
  const p = app.server.saveDraft();
  await tick(); click('Save');
  assert.equal(await p, true);
  assert.equal(server.calls.filter((c) => c === 'POST /api/docs').length, 1);
  assert.equal(await app.server.saveDraft(), true);
  assert.equal(server.calls.filter((c) => c === 'POST /api/docs').length, 1);
  stopTimers(app);
});

test('"Save your draft?" > Save to Files goes on to what was asked once the draft is saved', async () => {
  server.docs.clear(); server.calls = [];
  const app = makeApp();
  app.doc = part('Sketchy', 1); app.dirty = true;
  const go = app.confirmLeaveDraft();
  await tick(); click('Save to Files');
  await tick(5); click('Save');
  assert.equal(await go, true);
  assert.equal(app.server.linked, true);
  stopTimers(app);
});

test('a rename takes the new version number only when nothing else changed on the server', async () => {
  server.docs.clear(); server.puts = []; server.down = false;
  addDoc('R', part('Plate', 1));
  const app = makeApp();
  await app.server.open('R');
  const L = app.server.link;
  // only the rename happened: the page follows it, and the next save goes through
  const r1 = await app.server.req('PATCH', '/api/docs/R', { name: 'Base plate' });
  app.server.renamedOnServer(r1);
  assert.equal(L.version, 2);
  app.commit('Plane2', () => app.doc.features.push({ id: 'p2', type: 'plane', name: 'Plane2' }), false);
  assert.equal(await app.server.flush(), true);
  assert.equal(server.docs.get('R').version, 3);
  assert.equal(server.docs.get('R').name, 'Base plate');
  // the AI saved a version this page never loaded, then a rename: the page must not skip past it
  const rec = server.docs.get('R');
  Object.assign(rec, { version: rec.version + 1, by: 'claude', summary: 'Added a hole', doc: { ...rec.doc, features: [...rec.doc.features, { id: 'h', type: 'plane', name: 'AIPlane' }] } });
  const r2 = await app.server.req('PATCH', '/api/docs/R', { name: 'Plate 2' });
  app.server.renamedOnServer(r2);
  assert.equal(L.version, 3, 'not jumped past the AI version');
  app.commit('Plane3', () => app.doc.features.push({ id: 'p3', type: 'plane', name: 'Plane3' }), false);
  assert.equal(await app.server.flush(), false);
  assert.equal(app.server.state, 'conflict', 'the bar asks which version to keep');
  assert.ok(server.docs.get('R').doc.features.some((f) => f.id === 'h'), "the AI's change is still on the server");
  app.server.hideBar(); stopTimers(app);
});

test('Ctrl+S says what happened: saved, or kept in this browser while the server is away', async () => {
  server.docs.clear(); server.puts = []; server.down = false;
  addDoc('K', part('Clip', 1));
  const app = makeApp();
  await app.server.open('K');
  app.commit('Plane2', () => app.doc.features.push({ id: 'p2', type: 'plane', name: 'Plane2' }), false);
  await app.saveFile();
  assert.equal(app.toasts.at(-1), 'Saved to your Files.');
  server.down = true;
  app.commit('Plane3', () => app.doc.features.push({ id: 'p3', type: 'plane', name: 'Plane3' }), false);
  await app.saveFile();
  assert.match(app.toasts.at(-1), /^Not saved yet: the server is not answering/);
  assert.equal(app.server.state, 'offline');
  server.down = false;
  stopTimers(app);
});

test('edits that never reached the server come back when the file is opened again', async () => {
  server.docs.clear(); server.puts = []; server.down = false; mem.clear();
  addDoc('U', part('Gear', 1));
  const tab1 = makeApp();
  await tab1.server.open('U');
  server.down = true;
  tab1.commit('Plane2', () => tab1.doc.features.push({ id: 'p2', type: 'plane', name: 'Plane2' }), false);
  assert.equal(await tab1.server.flush(), false);
  tab1.autosaveNow(); // the page goes away (pagehide flushes the browser copy)
  stopTimers(tab1);
  assert.ok([...mem.keys()].some((k) => k.startsWith('opensketch.unsent.U')), 'kept in this browser');
  assert.equal(mem.get('opensketch.autosave.v1'), undefined, 'a file never goes into the draft slot');
  server.down = false;
  // next visit: nobody changed the file since, so the edits simply go back in and are saved
  const tab2 = makeApp();
  await tab2.server.open('U');
  assert.equal(tab2.doc.features.length, 2);
  assert.match(tab2.toasts.at(-1), /had not reached the server/);
  assert.equal(await tab2.server.flush(), true);
  assert.equal(server.docs.get('U').doc.features.length, 2);
  assert.ok(![...mem.keys()].some((k) => k.startsWith('opensketch.unsent.U')), 'dropped once saved');
  stopTimers(tab2);
});

test('when the file changed since, the browser copy is offered, not forced', async () => {
  server.docs.clear(); server.puts = []; server.down = false; mem.clear();
  document.getElementById('graphics').innerHTML = '';
  addDoc('V', part('Lid', 1));
  const tab1 = makeApp();
  await tab1.server.open('V');
  server.down = true;
  tab1.commit('Mine', () => tab1.doc.features.push({ id: 'm', type: 'plane', name: 'Mine' }), false);
  await tab1.server.flush(); tab1.autosaveNow(); stopTimers(tab1);
  server.down = false;
  const rec = server.docs.get('V');
  Object.assign(rec, { version: 2, by: 'claude', doc: { ...rec.doc, features: [...rec.doc.features, { id: 'ai', type: 'plane', name: 'Theirs' }] } });
  const tab2 = makeApp();
  await tab2.server.open('V');
  assert.deepEqual(tab2.doc.features.map((f) => f.id), ['f0', 'ai'], 'the server version opens');
  const bar = document.getElementById('serverbar');
  assert.match(bar.textContent, /never reached the server/);
  [...bar.querySelectorAll('button')].find((b) => b.textContent === 'Restore my changes').onclick();
  assert.deepEqual(tab2.doc.features.map((f) => f.id), ['f0', 'm']);
  assert.equal(tab2.undoStack.at(-1).label, 'Unsaved changes from this browser');
  assert.equal(await tab2.server.flush(), true);
  assert.equal(server.docs.get('V').version, 3);
  stopTimers(tab2);
});

test('browser storage stays off until the page knows who is signed in', async () => {
  const scope = await import('../../opensketch/static/js/scope.js?fresh');
  assert.equal(scope.scopeKnown(), false);
  mem.clear();
  mem.set('opensketch.autosave.v1', 'someone else\'s draft');
  scope.setScope('owner1');
  scope.adopt(['opensketch.autosave.v1']);
  assert.equal(mem.get('opensketch.autosave.v1.owner1'), "someone else's draft");
  mem.set('opensketch.autosave.v1', 'written later by an older page');
  scope.adopt(['opensketch.autosave.v1']);
  assert.equal(mem.get('opensketch.autosave.v1.owner1'), "someone else's draft", 'adopted once only');
});

test('moving the open file to the Trash closes it: no draft to save, now or next time', async () => {
  server.docs.clear(); server.calls = []; server.down = false; mem.clear();
  addDoc('T', part('Bracket', 2));
  const app = makeApp();
  await app.server.open('T');
  app.commit('Plane3', () => app.doc.features.push({ id: 'p3', type: 'plane', name: 'Plane3' }), false);
  const { FilesView } = await import('../../opensketch/static/js/files.js');
  const files = new FilesView(app);
  app.files = files;
  await files.trashFile({ id: 'T', name: 'Bracket' });
  assert.equal(server.docs.get('T').doc.features.length, 3, 'the last edit went into the file first');
  assert.equal(app.server.linked, false);
  assert.equal(app.dirtyDraft(), false, 'nothing asks to be saved');
  assert.equal(app.doc.features.length, 0);
  app.autosaveNow();
  assert.equal(app.restore(), false, 'no draft comes back at the next start');
  stopTimers(app);
});

test('an edit while an AI change waits keeps that change (accepted first, its own undo step)', async () => {
  const app = makeApp();
  app.doc = part('Plate', 1);
  const card = { role: 'proposal', state: 'pending' };
  app.taskpane.log = [card];
  app.proposalBase = JSON.stringify(app.cleanDoc());
  app.proposal = { ...part('Plate', 1), features: [...part('Plate', 1).features, { id: 'ai1', type: 'plane', name: 'AIPlane' }] };
  app.commit('Fillet1', () => app.doc.features.push({ id: 'x1', type: 'plane', name: 'Fillet1' }), false);
  assert.equal(app.proposal, null);
  assert.deepEqual(app.doc.features.map((f) => f.id), ['f0', 'ai1', 'x1'], 'the edit is on top of the AI change');
  assert.equal(card.state, 'accepted');
  assert.match(app.toasts.at(-1), /Kept the AI's change/);
  app.undo(); app.undo();
  assert.deepEqual(app.doc.features.map((f) => f.id), ['f0'], 'Ctrl+Z twice goes back to before the AI');
  stopTimers(app);
});

test('leaving a model with an AI change waiting asks first; the card says what became of it', async () => {
  const app = makeApp();
  app.doc = part('Plate', 1);
  const card = { role: 'proposal', state: 'pending' };
  app.taskpane.log = [card];
  app.proposal = part('Plate', 2);
  let go = app.confirmLeaveDraft();
  await tick(); click('Cancel');
  assert.equal(await go, false);
  assert.ok(app.proposal, 'still waiting');
  go = app.confirmLeaveDraft();
  await tick(); click('Accept');
  await tick(); click("Don't save"); // an unsaved draft is asked about next
  assert.equal(await go, true);
  assert.equal(card.state, 'accepted');
  assert.equal(app.doc.features.length, 2);
  stopTimers(app);
});
