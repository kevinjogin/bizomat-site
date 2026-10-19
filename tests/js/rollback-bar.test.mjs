// The rollback bar: a 2 px line with a 14 px grab band that does not pan the tree on touch, and a drop line in the
// theme's colour (it was an inline #3c6fd1 border on the row in every look).
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';
import { loadRules, computed } from './css-cascade.mjs';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><body><div id="tree"></div><form data-own-form><input id="treefilter" type="search"></form></body></html>');
globalThis.window = window;
globalThis.document = document;
const { FeatureTree } = await import('../../opensketch/static/js/ui/tree.js');

const sketch = (id) => ({ id, type: 'sketch', name: 'Sketch ' + id, plane: { ref: 'Top Plane' }, entities: [], constraints: [] });
const doc = { name: 'Part', features: [sketch('s1'), { id: 'f1', type: 'extrude', name: 'Boss-Extrude1', sketch: 's1' }, sketch('s2'), { id: 'f2', type: 'extrude', name: 'Cut-Extrude1', sketch: 's2', op: 'cut' }] };

function ev(type, props) { const e = new window.Event(type, { bubbles: true }); Object.assign(e, { button: 0, pointerId: 1, preventDefault() {}, stopPropagation() {} }, props); return e; }

test('dragging the rollback bar marks the drop row with a class, then clears it', () => {
  let rolled;
  const app = { doc, shownDoc: doc, statusById: {}, selection: [], isAsm: false, result: null, proposedIds: [],
    sketchDefinedPrefix: () => '', setRollback(i) { rolled = i; } };
  const tree = new FeatureTree(app);
  tree.render();
  const rows = [...document.querySelectorAll('#tree .tn')];
  rows.forEach((r, i) => { r.getBoundingClientRect = () => ({ top: i * 20, height: 20, bottom: i * 20 + 20, left: 0, right: 200, width: 200 }); });
  const bar = document.querySelector('#tree .rollbar');
  tree.dragRollback(ev('pointerdown', { clientY: 400 }), bar);
  window.dispatchEvent(ev('pointermove', { clientY: rows.length * 20 - 25 }));
  const marked = rows.filter((r) => r.classList.contains('rb-drop'));
  assert.equal(marked.length, 1);
  assert.doesNotMatch(marked[0].getAttribute('style') || '', /border|#3c6fd1/, 'no inline colour on the row');
  window.dispatchEvent(ev('pointerup', { clientY: rows.length * 20 - 25 }));
  assert.equal(rows.filter((r) => r.classList.contains('rb-drop')).length, 0);
  assert.equal(rolled, 2, 'rolled back to after Boss-Extrude1 (index in features)');
});

test('the grab band is taller than the line, and touch drags do not pan the tree', () => {
  const R = loadRules();
  for (const look of ['dark', 'light', 'classic']) {
    const b = computed(R, look, ['div#tree.tree', 'div.rollbar']);
    assert.equal(b['touch-action'], 'none', look);
    const a = computed(R, look, ['div#tree.tree', 'div.rollbar'], { pseudoEl: 'after' });
    const band = parseFloat(b.height) - parseFloat(a.top) - parseFloat(a.bottom);
    assert.ok(band >= 14, `${look}: grab band ${band} px`);
    assert.ok(-parseFloat(a.top) <= parseFloat(b.margin.split(' ')[0]), `${look}: the band stays inside the bar's margin`);
    const drop = computed(R, look, ['div#tree.tree', 'div.tn.rb-drop']);
    assert.match(drop['box-shadow'] || '', /inset/, `${look}: drop line`);
  }
});
