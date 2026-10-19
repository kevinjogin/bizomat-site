// Editor regressions (2026-10-19 audit): one rebuild per OK, the confirmation corner, the Design panel after OK,
// the Modify box's rounding, merged body meshes and their picking, the AI chat (no AI, follow-ups, one chat per file),
// the live build's pacing.
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML(`<html><body><div id="modal-layer"></div><div id="confirmcorner" class="confirmcorner hidden"></div>
  <div id="taskstrip"></div><div id="taskpanel" class="hidden"></div><div id="pm"></div><div id="sketchcursor" class="hidden"></div></body></html>`);
globalThis.window = window;
globalThis.document = document;
window.innerWidth = 1280; window.innerHeight = 900;
const THREE = await import('three');
const { App } = await import('../../opensketch/static/js/app.js');
const { PropertyManager } = await import('../../opensketch/static/js/ui/pm.js');
const { modifyBox } = await import('../../opensketch/static/js/ui/dialogs.js');
const { describeFeature } = await import('../../opensketch/static/js/features.js');
const { buildPartMesh, Viewer } = await import('../../opensketch/static/js/viewer.js');
const { TaskPane } = await import('../../opensketch/static/js/ui/taskpane.js');
const { LivePlayer } = await import('../../opensketch/static/js/live.js');
const noop = () => {};
const inputProto = Object.getPrototypeOf(document.createElement('input'));
if (!inputProto.select) inputProto.select = noop;
const key = (k) => Object.assign(new window.Event('keydown'), { key: k });

function featureApp(api) {
  const app = Object.create(App.prototype);
  Object.assign(app, { doc: { features: [], rollback: null }, mode: 'part', regenSeq: 0, undoStack: [], redoStack: [],
    viewer: { setBody: noop, setTool: noop }, api, drawSketches: noop, refreshSelectionDisplay: noop, bodyColor: () => 0,
    docChanged: noop, status: noop, toast: noop, tree: { render: noop }, regens: [], showPanel: noop, design: { refreshed: 0, refresh() { this.refreshed++; } } });
  app.regen = async (announce, label) => { app.regens.push(label); };
  app.pm = new PropertyManager(document.getElementById('pm'), app);
  const f = { id: 'f', name: 'Boss-Extrude1', type: 'extrude', depth: 10 };
  app.cmd = { key: 'extrude', f, spec: { okEnabled: () => true } };
  app.pm.open({ title: 'Boss-Extrude', sections: [], okEnabled: () => true });
  return app;
}
const good = { status: [{ id: 'f', preview: true, state: 'ok' }], body: { faces: [], edges: [] }, planes: {}, tool: null };

test('OK reuses the preview already built for the same parameters: one rebuild, not three', async () => {
  const calls = [];
  const app = featureApp(async (url, body) => { calls.push([url, !!body.preview]); return good; });
  assert.equal(await app.runPreview(), true); // the live preview while the PropertyManager is open
  await app.commitFeature();
  assert.deepEqual(calls, [['/api/regen', true]]); // OK asked the server for nothing new
  assert.equal(app.doc.features.length, 1);
  assert.deepEqual(app.regens, ['Applying Boss-Extrude1']); // the one rebuild of the committed model
  assert.equal(app.cmd, null);
  assert.ok(app.design.refreshed > 0, 'closing the command redraws the Design panel (no stale "finish the command" note)');
});

test('OK while the preview is still on its way waits for that answer instead of asking again', async () => {
  let finish; const calls = [];
  const app = featureApp((url, body) => { calls.push(body.preview ? 'preview' : 'regen'); return new Promise((r) => { finish = r; }); });
  const preview = app.runPreview();
  const ok = app.commitFeature();
  finish(good);
  await Promise.all([preview, ok]);
  assert.deepEqual(calls, ['preview']);
  assert.equal(app.doc.features.length, 1);
});

test('changed parameters are built again on OK; an edit says "changed", not "created"', async () => {
  const calls = []; const said = [];
  const app = featureApp(async (url, body) => { calls.push(body.preview.depth); return good; });
  app.status = (t) => said.push(t);
  await app.runPreview();
  app.cmd.f.depth = 20; app.schedulePreview(10000); clearTimeout(app.previewTimer);
  app.cmd.existing = { id: 'f' }; app.doc.features = [{ id: 'f', name: 'Boss-Extrude1', type: 'extrude', depth: 10 }];
  await app.commitFeature();
  assert.deepEqual(calls, [10, 20]);
  assert.equal(app.doc.features[0].depth, 20);
  assert.ok(said.includes('Boss-Extrude1 changed'));
});

test('the confirmation corner shows OK and Cancel for a PropertyManager, follows its OK state, and Exit Sketch in a sketch', () => {
  const app = Object.create(App.prototype);
  let ok = 0, cancel = 0, enabled = false;
  Object.assign(app, { mode: 'part', reviewMode: false, cmd: { key: 'x' }, pmOk: () => ok++, pmCancel: () => cancel++, showPanel: noop });
  app.pm = new PropertyManager(document.getElementById('pm'), app);
  app.pm.open({ title: 'Fillet', sections: [], okEnabled: () => enabled });
  const cc = document.getElementById('confirmcorner');
  const btn = (l) => cc.querySelector(`button[aria-label="${l}"]`);
  assert.equal(cc.classList.contains('hidden'), false);
  assert.equal(btn('OK').getAttribute('aria-disabled'), 'true');
  btn('OK').onclick(); assert.equal(ok, 0);
  enabled = true; app.pm.refreshFeedback();
  assert.equal(btn('OK').getAttribute('aria-disabled'), null);
  btn('OK').onclick(); btn('Cancel').onclick();
  assert.deepEqual([ok, cancel], [1, 1]);
  app.pm.open({ title: 'Measure', sections: [], noCancel: true, okEnabled: () => true });
  assert.equal(btn('Cancel'), null);
  app.cmd = null; app.pm.close();
  assert.equal(cc.classList.contains('hidden'), true);
  app.mode = 'sketch'; app.exitSketch = noop; app.discardSketch = noop; app.updateConfirmCorner();
  assert.ok(btn('Exit Sketch'));
});

test('the Modify box shows the value as the label does, and Enter on an unchanged value keeps it exactly', () => {
  const got = [];
  let d = modifyBox({ value: 59.999988, name: 'D1@Sketch1', x: 10, y: 10, onApply: (v) => got.push(v) });
  let inp = d.el.querySelector('.mod-val input');
  assert.equal(inp.value, '60mm');
  inp.dispatchEvent(key('Enter'));
  assert.deepEqual(got, [59.999988]);
  d = modifyBox({ value: 12.3456, name: 'D2@Sketch1', x: 10, y: 10, onApply: (v) => got.push(v) });
  inp = d.el.querySelector('.mod-val input');
  assert.equal(inp.value, '12.35mm');
  inp.value = '25';
  inp.dispatchEvent(key('Enter'));
  assert.deepEqual(got, [59.999988, 25]);
});

test('undo while a sketch tool is armed keeps the tool and brings its PropertyManager back', () => {
  const app = Object.create(App.prototype);
  const seen = [];
  Object.assign(app, { mode: 'sketch', cmd: null, sketcher: { skId: 's', tool: { name: 'rectangle', stage: 0 }, sel: new Set(), solve: noop, render: noop },
    doc: { features: [] }, pm: { isOpen: true, close: noop }, viewer: { setTool: noop }, refreshSelectionDisplay: noop, updateStartHint: noop,
    onSketchToolChanged: (n) => seen.push(n), cursorFeedback: (fb) => seen.push(fb), setSelection: noop, docChanged: noop, regen: noop });
  app.restoreJSON(JSON.stringify({ features: [{ id: 's', type: 'sketch', entities: [], constraints: [] }] }));
  assert.deepEqual(seen, ['rectangle', null]);
});

test('a registry-valid feature with fields left out is described, never throws (shell with no faces)', () => {
  const app = { featureById: () => null };
  assert.match(describeFeature({ type: 'shell', name: 'Shell1', thickness: 2 }, app), /closed/);
  assert.doesNotThrow(() => describeFeature({ type: 'fillet', name: 'Fillet1' }, app));
  assert.ok(!describeFeature({ type: 'fillet', name: 'Fillet1', radius: 2 }, app).includes('NaN'));
});

// A unit cube's six faces and twelve edges, as the server sends a body.
function cube() {
  const faces = [], edges = [];
  const q = (id, a, b, c, d, n) => faces.push({ id, positions: [...a, ...b, ...c, ...d], indices: [0, 1, 2, 0, 2, 3], normal: n, center: a.map((v, i) => (a[i] + c[i]) / 2) });
  q(0, [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]); q(1, [0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0], [0, 0, -1]);
  q(2, [0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1], [0, -1, 0]); q(3, [0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]);
  q(4, [0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0], [-1, 0, 0]); q(5, [1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1], [1, 0, 0]);
  const e = (id, a, b) => edges.push({ id, points: [...a, ...b], mid: a.map((v, i) => (a[i] + b[i]) / 2) });
  e(0, [0, 0, 1], [1, 0, 1]); e(1, [1, 0, 1], [1, 1, 1]); e(2, [1, 1, 1], [0, 1, 1]); e(3, [0, 1, 1], [0, 0, 1]);
  return { faces, edges };
}

test('a body is one geometry with face and edge ranges, and picking finds the face and edge under a ray', () => {
  const pm = buildPartMesh(cube());
  assert.equal(pm.geo.index.count, 36);
  assert.equal(pm.faces[3].i0, 18);
  assert.equal(pm.egeo.attributes.position.count, 8);
  const v = Object.create(Viewer.prototype);
  const group = new THREE.Group(); group.matrixAutoUpdate = false; group.matrix.makeTranslation(10, 0, 0); group.updateMatrixWorld(true);
  const inst = { pm, comp: 'c1', group, mesh: { visible: true }, lines: { visible: true } };
  // straight down onto the top face (z = 1) of the cube placed at x = 10
  const ray = new THREE.Ray(new THREE.Vector3(10.3, 0.4, 50), new THREE.Vector3(0, 0, -1));
  const hits = v.rayFaces(ray, [inst]);
  assert.equal(pm.faces[hits[0].i].id, 0);
  assert.ok(Math.abs(hits[0].point.z - 1) < 1e-9 && Math.abs(hits[0].point.x - 10.3) < 1e-9);
  assert.equal(hits.length, 2); // top and bottom
  const near = v.rayEdges(new THREE.Ray(new THREE.Vector3(10.5, 0.02, 50), new THREE.Vector3(0, 0, -1)), 0.05, [inst]);
  assert.equal(pm.edges[near[0].i].id, 0);
  assert.equal(v.rayEdges(ray, 0.05, [inst]).length, 0);
});

function paneApp(extra = {}) {
  const app = {
    viewer: { el: { getBoundingClientRect: () => ({ left: 0, width: 800, top: 0, bottom: 600, height: 600 }) }, resize: noop, panBy: noop, sceneBox: () => null, followBox: noop },
    server: { link: { id: 'A' }, dialogs: [], connectDialog(tab) { this.dialogs.push(tab); } },
    doc: { name: 'Part A', features: [] }, docStack: [], mode: 'part', proposal: null, aiAvailable: true,
    cleanDoc(d = this.doc) { return JSON.parse(JSON.stringify(d)); }, closeCommand: noop, hideContextToolbar: noop, status: noop,
    live: { start: noop, stop: noop, finish: async () => {}, push: noop, hint: noop, hurryUp: noop, skip: noop },
    design: null, ...extra,
  };
  const tp = new TaskPane(app);
  app.taskpane = tp;
  return { app, tp };
}

test('without an AI, Send keeps the request in the box and opens Connect AI; nothing is sent', async () => {
  const { app, tp } = paneApp({ aiAvailable: false });
  let fetched = 0;
  globalThis.fetch = async () => { fetched++; throw new Error('no'); };
  await tp.send('A 40 mm cube');
  assert.equal(fetched, 0);
  assert.equal(tp.draft, 'A 40 mm cube');
  assert.deepEqual(app.server.dialogs, ['key']);
  assert.equal(tp.log.length, 0);
});

function streamOf(events) {
  const text = events.map((e) => JSON.stringify(e)).join('\n') + '\n';
  return { ok: true, status: 200, headers: { get: () => 'application/x-ndjson' }, body: new Response(text).body };
}

test('a follow-up while a result waits builds on that result instead of throwing it away', async () => {
  const proposal = { name: 'Part A', features: [{ id: 'e1', type: 'extrude', name: 'Boss-Extrude1', depth: 5 }] };
  const shown = [];
  const { app, tp } = paneApp({ proposal, proposedIds: ['e1'], showProposal: async (p, ids) => { shown.push(ids); app.proposal = p; } });
  tp.log.push({ role: 'proposal', state: 'pending', features: [] });
  let sent = null;
  const next = { ...proposal, features: [...proposal.features, { id: 'h1', type: 'hole', name: 'Hole1', diameter: 8 }] };
  globalThis.fetch = async (url, init) => { sent = JSON.parse(init.body); return streamOf([{ ev: 'start', conversation: 'c' }, { ev: 'done', proposal: next, reply: '' }]); };
  await tp.send('make the holes 8 mm');
  assert.deepEqual(sent.doc, proposal); // the AI works on its own pending result
  assert.equal(tp.log[0].state, 'superseded');
  assert.equal(tp.log.filter((m) => m.role === 'proposal' && m.state === 'pending').length, 1);
  assert.deepEqual(shown[0].sort(), ['e1', 'h1']);
});

test('a failed request puts the prompt back and offers Retry; the server\'s own words are shown', async () => {
  const { tp } = paneApp();
  globalThis.fetch = async () => ({ ok: false, status: 429, headers: { get: () => 'application/json' }, json: async () => ({ error: 'Your AI is still busy with another request.' }) });
  await tp.send('add four holes');
  const err = tp.log.find((m) => m.role === 'error');
  assert.equal(err.text, 'Your AI is still busy with another request.');
  assert.deepEqual(err.retry.prompt, 'add four holes');
  assert.equal(tp.draft, 'add four holes');
});

test('each file keeps its own chat', () => {
  const { app, tp } = paneApp();
  tp.docSwitched();
  tp.log.push({ role: 'user', text: 'about A' }); tp.conversation = 'convA';
  app.server.link = { id: 'B' }; app.doc = { name: 'B' };
  tp.docSwitched();
  assert.deepEqual(tp.log, []); assert.equal(tp.conversation, null);
  app.server.link = { id: 'A' };
  tp.docSwitched();
  assert.equal(tp.log[0].text, 'about A'); assert.equal(tp.conversation, 'convA');
});

test('live build: what is queued plays in a few seconds, faster once the AI has finished', () => {
  const lp = Object.create(LivePlayer.prototype);
  lp.queue = Array.from({ length: 16 }, (_, i) => ({ ev: 'assembly', action: { kind: 'mate', mate: 'm' + i } }));
  const s = lp.speed();
  assert.ok(16 * 870 * s < 3200, `16 mates take ${16 * 870 * s} ms`);
  lp.hurryUp();
  assert.ok(lp.speed() < s);
  lp.queue = [{ ev: 'assembly', action: { kind: 'mate' } }];
  lp.hurry = false;
  assert.equal(lp.speed(), 1);
});
