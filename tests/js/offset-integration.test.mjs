import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
register('./three-loader.mjs', import.meta.url);
const { Sketcher } = await import('../../opensketch/static/js/sketch/sketcher.js');

function harness() {
  const point = (id, x, y) => ({ id, type: 'point', x, y });
  const sketch = { id: 's', type: 'sketch', entities: [
    point('a', -20, 10), point('b', 20, 10), point('c', 20, -10), point('d', -20, -10),
    point('lc', -20, 0), point('rc', 20, 0),
    { id: 'top', type: 'line', p1: 'a', p2: 'b' },
    { id: 'right', type: 'arc', center: 'rc', start: 'c', end: 'b' },
    { id: 'bottom', type: 'line', p1: 'c', p2: 'd' },
    { id: 'left', type: 'arc', center: 'lc', start: 'a', end: 'd' },
  ], constraints: ['a', 'b', 'c', 'd', 'lc', 'rc'].map((id) => ({ id: 'fix'+id, type: 'fix', refs: [id] })) };
  const app = {
    doc: { features: [sketch], seq: 1 }, undo: [], changed: 0, errors: [],
    featureById(id) { return this.doc.features.find((f) => f.id === id); },
    pushUndo(label) { this.undo.push({ label, json: JSON.stringify(this.doc) }); },
    docChanged() { this.changed++; }, statusDefined() {}, toast(message) { this.errors.push(message); },
  };
  const sk = Object.create(Sketcher.prototype);
  Object.assign(sk, { app, skId: 's', sel: new Set(['left']), modelSel: new Map(), render() {} });
  return { app, sk };
}

test('converted line/arc chain commits a closed offset once and preserves its source', () => {
  const { app, sk } = harness();
  sk.solve();
  const source = structuredClone(sk.sk);
  const before = JSON.stringify(app.doc);
  assert.equal(sk.offsetSelection(2, { chain: true }), true);
  assert.equal(app.undo.length, 1);
  assert.equal(app.changed, 1);
  assert.equal(app.undo[0].json, before);
  assert.equal(sk.sel.size, 4);
  assert.deepEqual(sk.sk.entities.slice(0, source.entities.length), source.entities);
  const generated = [...sk.sel].map((id) => sk.ent(id));
  assert.equal(generated.filter((e) => e.type === 'arc').length, 2);
  const endpoints = new Map();
  for (const e of generated) for (const id of e.type === 'line' ? [e.p1, e.p2] : [e.start, e.end]) {
    endpoints.set(id, (endpoints.get(id) || 0) + 1);
  }
  assert.ok([...endpoints.values()].every((n) => n === 2), 'offset contour must stay closed');
  for (const e of generated.filter((e) => e.type === 'arc')) {
    const c = sk.ent(e.center), s = sk.ent(e.start), t = sk.ent(e.end);
    assert.ok(Math.abs(Math.hypot(s.x-c.x,s.y-c.y)-12) < 1e-7);
    assert.ok(Math.abs(Math.hypot(t.x-c.x,t.y-c.y)-12) < 1e-7);
  }
  app.doc = JSON.parse(app.undo[0].json);
  assert.deepEqual(app.doc.features[0], source, 'one undo restores source sketch');
});

test('collapsed offset and preview never edit the sketch or history', () => {
  const { app, sk } = harness();
  const before = JSON.stringify(app.doc);
  const plan = sk.prepareOffset(2, { chain: true });
  assert.equal(plan.curves.length, 4);
  assert.equal(JSON.stringify(app.doc), before);
  assert.equal(sk.offsetSelection(-11, { chain: true }), false);
  assert.equal(JSON.stringify(app.doc), before);
  assert.equal(app.undo.length, 0);
  assert.equal(app.changed, 0);
  assert.equal(app.errors.length, 1);
});

test('turning off chain offsets only the selected converted arc', () => {
  const { app, sk } = harness();
  assert.equal(sk.offsetSelection(-2, { chain: false }), true);
  assert.equal(sk.sel.size, 1);
  const arc = sk.ent([...sk.sel][0]);
  assert.equal(arc.type, 'arc');
  const c = sk.ent(arc.center), s = sk.ent(arc.start);
  assert.ok(Math.abs(Math.hypot(s.x-c.x,s.y-c.y)-8) < 1e-7);
  assert.equal(app.changed, 1);
});

test('window selection ignores included points and relations but point-only selection fails', () => {
  const { app, sk } = harness();
  sk.sel = new Set([...sk.sk.entities.map((e) => e.id), 'fixa']);
  assert.equal(sk.prepareOffset(2).curves.length, 4);
  sk.sel = new Set(['a', 'lc', 'fixa']);
  assert.equal(sk.offsetSelection(2), false);
  assert.equal(app.undo.length, 0);
  assert.match(app.errors[0], /Select at least one/);
});

test('ending a sketch clears its offset preview', () => {
  const { app, sk } = harness();
  sk.offsetPreview = sk.prepareOffset(2);
  sk.viewer = { clearGroup() {}, sketchOrigin: {}, originObj: {}, requestRender() {} };
  sk.labelEls = new Map(); sk.glyphEls = []; app.cursorFeedback = () => {};
  sk.end();
  assert.equal(sk.offsetPreview, null);
  assert.equal(sk.active, false);
});

test('Offset ignores underlying model-edge picks and preserves sketch-only selection', () => {
  const { app, sk } = harness();
  let updates = 0;
  app.cmd = { sketchSelectionOnly: true }; app.onSketchSelection = () => updates++;
  sk.hitTest = () => null;
  sk.viewer = { pick() { throw new Error('Offset must not pick model edges'); } };
  sk.selectDown(20, 30, [0, 0], {});
  assert.equal(sk.sel.size, 0);
  assert.equal(updates, 1);
  assert.equal(sk.box.x0, 20);
});

test('hidden On Edge references cannot branch an offset construction chain', () => {
  const { sk } = harness();
  sk.sk.entities.filter((e) => ['line', 'arc'].includes(e.type)).forEach((e) => { e.construction = true; });
  sk.sk.entities.push(
    { id: 'hidden', type: 'line', p1: 'a', p2: 'c', construction: true, ref: 'edge' },
  );
  assert.equal(sk.prepareOffset(2).curves.length, 4);
  sk.sel = new Set(['hidden']);
  assert.throws(() => sk.prepareOffset(2), /Select at least one/);
});
