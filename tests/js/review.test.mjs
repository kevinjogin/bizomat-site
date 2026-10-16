import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><body><div id="modal-layer"></div><div id="tree"></div><input id="treefilter"><div id="sb-editing"></div><div id="sb-defined"></div></body></html>');
globalThis.window = window;
globalThis.document = document;
window.innerWidth = 1280; window.innerHeight = 900;
// Layout is not simulated by these DOM tests.
const { App } = await import('../../opensketch/static/js/app.js');
const { TaskPane } = await import('../../opensketch/static/js/ui/taskpane.js');
const { FeatureTree } = await import('../../opensketch/static/js/ui/tree.js');
const { PropertyManager, evalExpr } = await import('../../opensketch/static/js/ui/pm.js');
const { buildCommands } = await import('../../opensketch/static/js/commands.js');
const { defaultsFor, buildSpec, featureIcon, metaKey, describeFeature } = await import('../../opensketch/static/js/features.js');
const { dependentFeatureIds, removeFeatures, measurementData, mateReferences } = await import('../../opensketch/static/js/model-utils.js');
const noop = () => {};

test('model and feature names render as text, including markup and angle brackets', () => {
  const name = '<img src=x onerror="alert(1)">';
  const app = { shownDoc: { name, material: { name }, features: [{ id: 's', name, type: 'sketch' }] },
    selection: [], statusById: {}, result: null, isAsm: false, treeHover: noop, treeClick: noop, treeContext: noop };
  const tree = new FeatureTree(app);
  tree.render();
  assert.equal(tree.el.querySelectorAll('img').length, 0);
  assert.ok(tree.el.textContent.includes(name));
  app.shownDoc.features[0].name = 'Bracket<1>';
  tree.render();
  assert.ok(tree.el.textContent.includes('Bracket<1>'));
});

test('supplier cards reject script links and escape quoted URLs', () => {
  const pane = Object.create(TaskPane.prototype);
  for (const url of ['javascript:alert(1)', 'data:text/html,test']) {
    const el = pane.entryEl({ role: 'request', description: 'Pin', part: 'p', url, done: 'pin.step' });
    assert.equal(el.querySelector('a'), null);
  }
  const el = pane.entryEl({ role: 'request', description: '<img src=x>', part: 'p',
    url: 'https://example.com/" onmouseover="alert(1)', done: 'pin.step' });
  assert.equal(el.querySelector('img'), null);
  assert.equal(el.querySelector('a').getAttribute('onmouseover'), null);
  assert.match(el.querySelector('a').getAttribute('href'), /^https:/);
});

test('PropertyManager titles and backend errors are plain text; confirmation is disabled', () => {
  const root = document.createElement('div');
  const pm = new PropertyManager(root, { showPanel: noop, pmOk: noop });
  pm.open({ title: '<img src=x>', error: '<svg onload=alert(1)>', sections: [
    { title: '<img src=x>', rows: [{ type: 'value', label: 'Name', get: () => '<img src=x>' }] },
  ], okEnabled: () => false });
  assert.equal(root.querySelector('img'), null);
  assert.ok(root.textContent.includes('<svg onload=alert(1)>'));
  assert.equal(root.querySelector('button[aria-label="OK"]').disabled, true);
});

test('numeric units accept uppercase inches and wheel obeys minimum', () => {
  assert.equal(evalExpr('1IN'), 25.4);
  let value = 1;
  const root = document.createElement('div');
  const pm = new PropertyManager(root, { showPanel: noop });
  pm.open({ title: 'Depth', sections: [{ title: 'Parameters', rows: [{ type: 'number', label: 'Depth', min: 1,
    get: () => value, set: (v) => { value = v; } }] }] });
  const input = root.querySelector('input');
  Object.defineProperty(document, 'activeElement', { value: input, configurable: true });
  const event = new window.Event('wheel', { cancelable: true });
  event.deltaY = 1; input.dispatchEvent(event);
  assert.equal(value, 1);
});

test('recursive deletion removes all child features and counts every removed rollback entry', () => {
  const doc = { rollback: 5, features: [
    { id: 's', type: 'sketch' }, { id: 'e', type: 'extrude', sketch: 's' },
    { id: 'p', type: 'linear_pattern', features: ['e'] },
    { id: 'q', type: 'plane', base: { ref: 'p' } }, { id: 'keep', type: 'sketch' },
    { id: 'last', type: 'extrude', sketch: 'keep' },
  ] };
  const removed = dependentFeatureIds(doc, ['s']);
  assert.deepEqual([...removed], ['s', 'e', 'p', 'q']);
  removeFeatures(doc, removed);
  assert.deepEqual(doc.features.map((f) => f.id), ['keep', 'last']);
  assert.equal(doc.rollback, 1);
});

test('assembly measurements transform centres and normals without changing mate data', () => {
  const original = { center: [0, 0, 0], normal: [1, 0, 0], area: 20 };
  const world = measurementData(original, [0, -1, 0, 100, 1, 0, 0, 20, 0, 0, 1, 30, 0, 0, 0, 1]);
  assert.deepEqual(world.center, [100, 20, 30]);
  assert.deepEqual(world.normal, [0, 1, 0]);
  assert.deepEqual(original.center, [0, 0, 0]);
  assert.deepEqual(original.normal, [1, 0, 0]);
});

test('hinge dependencies include support and angular references', () => {
  assert.deepEqual(mateReferences({ refs: [{ component: 'a' }], planes: [{ component: 'b' }], angle_refs: [{ component: 'c' }] }).map((r) => r.component), ['a', 'b', 'c']);
});

function previewApp(api) {
  const app = Object.create(App.prototype);
  Object.assign(app, { doc: { features: [], rollback: null }, mode: 'part', regenSeq: 0, undoStack: [], redoStack: [],
    cmd: { f: { id: 'f', name: 'Boss', type: 'extrude', depth: 10, draft: 5 }, spec: { okEnabled: () => true } },
    viewer: { setBody: noop, setTool: noop }, pm: { isOpen: true, spec: {}, render: noop, close() { this.spec = null; } },
    api, drawSketches: noop, refreshSelectionDisplay: noop, bodyColor: () => 0,
    docChanged: noop, regen: noop, status: noop, toast: noop });
  return app;
}
const good = { status: [{ id: 'f', preview: true, state: 'ok' }], body: { faces: [] }, planes: {}, tool: null };

test('a failed preview request never commits a feature', async () => {
  const app = previewApp(async () => { throw new Error('offline'); });
  await app.commitFeature();
  assert.equal(app.doc.features.length, 0);
  assert.equal(app.undoStack.length, 0);
});

test('cancelling while OK waits for preview does not commit or access a closed panel', async () => {
  let finish;
  const app = previewApp(() => new Promise((resolve) => { finish = resolve; }));
  const pending = app.commitFeature();
  app.closeCommand();
  finish(good);
  await pending;
  assert.equal(app.doc.features.length, 0);
});

test('double confirmation commits once and preserves a draft that has no draftOn UI flag', async () => {
  let finish;
  const app = previewApp(() => new Promise((resolve) => { finish = resolve; }));
  const first = app.commitFeature();
  const second = app.commitFeature();
  finish(good);
  await Promise.all([first, second]);
  assert.equal(app.doc.features.length, 1);
  assert.equal(app.doc.features[0].draft, 5);
  assert.equal(app.undoStack.length, 1);
});

test('parameter edits invalidate an older confirmation response', async () => {
  let finish;
  const app = previewApp(() => new Promise((resolve) => { finish = resolve; }));
  const pending = app.commitFeature();
  app.cmd.f.depth = 40;
  app.schedulePreview(10000);
  clearTimeout(app.previewTimer);
  finish(good); await pending;
  assert.equal(app.doc.features.length, 0);
});

test('discarding sketch edits restores its history, so undo cannot resurrect discarded geometry', () => {
  const app = previewApp(async () => good);
  app.cmd = null;
  app.doc = { name: 'P', features: [{ id: 's', type: 'sketch', name: 'Sketch1', plane: { ref: 'Front Plane' }, entities: [] }] };
  app.undoStack = [{ label: 'Previous edit', json: JSON.stringify({ features: [] }) }];
  app.redoStack = [];
  Object.assign(app, { view: {}, sketcher: { begin: noop, end: noop }, ribbon: { setTab: noop, render: noop },
    setSelection: noop, hideContextToolbar: noop, updateConfirmCorner: noop, updateBreadcrumbs: noop });
  const snapshot = JSON.stringify(app.doc);
  app.enterSketch(app.doc.features[0], null, { isNew: false, snapshot });
  app.undoStack.push({ label: 'Line', json: snapshot }, { label: 'Circle', json: 'discarded' });
  app.doc.features[0].entities.push({ id: 'p', type: 'point', x: 1, y: 2 });
  app.discardSketch();
  document.querySelector('#modal-layer .dlg-f button').click();
  assert.equal(JSON.stringify(app.doc), snapshot);
  assert.deepEqual(app.undoStack.map((u) => u.label), ['Previous edit']);
  assert.deepEqual(app.redoStack, []);
});

test('discarding a new sketch restores redo and the rollback bar from before creation', () => {
  const app = previewApp(async () => good);
  app.cmd = null;
  app.doc = { name: 'P', features: [], rollback: 0, seq: 1 };
  app.redoStack = [{ label: 'Redo before sketch', json: 'previous' }];
  Object.assign(app, { view: {}, sketcher: { begin: noop, end: noop }, ribbon: { setTab: noop, render: noop },
    setSelection: noop, hideContextToolbar: noop, updateConfirmCorner: noop, updateBreadcrumbs: noop });
  app.viewer.normalTo = noop;
  const snapshot = JSON.stringify(app.doc);
  app.sketchOn({ kind: 'plane', id: 'Front Plane' });
  assert.equal(app.doc.rollback, 1);
  assert.deepEqual(app.redoStack, []);
  app.discardSketch();
  document.querySelector('#modal-layer .dlg-f button').click();
  assert.equal(JSON.stringify(app.doc), snapshot);
  assert.deepEqual(app.undoStack, []);
  assert.equal(app.redoStack[0].label, 'Redo before sketch');
});

test('editing AI-authored draft exposes its controls and renders sketch names once', () => {
  const name = 'Profile<&>';
  const app = { featureById: () => ({ name }) };
  const f = { name: 'Boss', type: 'extrude', sketch: 's', depth: 10, draft: 5 };
  const spec = buildSpec('extrude', app, f);
  assert.equal(f.draftOn, true);
  assert.ok(describeFeature(f, app).includes(name));
  const root = document.createElement('div');
  const pm = new PropertyManager(root, { showPanel: noop });
  pm.open({ title: 'Boss', sections: [{ title: 'Profile', rows: spec.sections[0].rows.filter((r) => r.type === 'selbox') }] });
  assert.ok(root.textContent.includes(name));
  assert.ok(!root.textContent.includes('&lt;'));
});

test('new commands dispatch to real feature editors and preserve edit/cut metadata', () => {
  const calls = [];
  const app = { selection: [], lastSketchId: () => null, featureById: () => null,
    featureCommand: (key) => calls.push(key), pm: { activeSelbox: 'profile' } };
  const commands = buildCommands(app);
  for (const key of ['sweep', 'sweepcut', 'loft', 'loftcut', 'hole']) {
    assert.notEqual(commands[key].disabled, true);
    commands[key].run();
    const f = defaultsFor(key, app);
    assert.equal(metaKey(f), key);
    assert.equal(featureIcon(f), key);
    assert.ok(buildSpec(key, app, f));
  }
  assert.deepEqual(calls, ['sweep', 'sweepcut', 'loft', 'loftcut', 'hole']);
  const f = defaultsFor('sweep', app), spec = buildSpec('sweep', app, f);
  spec.onPick({ kind: 'sketch', id: 'profile' });
  spec.onPick({ kind: 'sketch', id: 'path' });
  assert.ok(spec.okEnabled());
  assert.equal(f.path, 'path');
});
