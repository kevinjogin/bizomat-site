// FeatureManager filter: only typed words filter the tree (a browser autofilling a saved email emptied it,
// YZ 2026-10-19), and a filtered tree says so with Clear filter.
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><body><div id="tree"></div><form data-own-form><input id="treefilter" type="search"></form></body></html>');
globalThis.window = window;
globalThis.document = document;
class FakeInputEvent extends window.Event {}
globalThis.InputEvent = FakeInputEvent;
const { FeatureTree, typedInput } = await import('../../opensketch/static/js/ui/tree.js');

function makeTree() {
  const names = ['Plate<1>', 'Pin<1>', 'Concentric1', 'Coincident1'];
  const app = {
    shownDoc: { name: 'Assem1' }, statusById: {}, selection: [], isAsm: true,
    asm: { renderTree: (tree, node) => names.forEach((n, i) => node({ id: 'c' + i, kind: 'component', name: n, ic: 'part', depth: 1 })) },
  };
  const tree = new FeatureTree(app);
  tree.render();
  return tree;
}

const rows = () => document.querySelectorAll('#tree .tn').length;
const filter = () => document.getElementById('treefilter');

test('typed input counts; a plain input event (autofill) does not', () => {
  const el = filter();
  assert.equal(typedInput(new FakeInputEvent('input'), el), true);
  assert.equal(typedInput(new window.Event('input'), el), false);
});

test('an autofilled email never empties the tree', () => {
  const tree = makeTree();
  assert.equal(rows(), 4);
  filter().value = 'yyz.works@gmail.com';
  filter().dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(filter().value, '');
  assert.equal(rows(), 4);
  assert.equal(document.querySelector('.tree-filtering'), null);
  void tree;
});

test('a typed filter shows a note, and Clear filter brings everything back', () => {
  const tree = makeTree();
  filter().value = 'pin';
  filter().dispatchEvent(new FakeInputEvent('input', { bubbles: true }));
  assert.equal(rows(), 1);
  assert.match(document.querySelector('.tree-filtering').textContent, /1 item match "pin"/);
  filter().value = 'zzz';
  filter().dispatchEvent(new FakeInputEvent('input', { bubbles: true }));
  assert.equal(rows(), 0);
  assert.match(document.querySelector('.tree-filtering').textContent, /Nothing matches "zzz"/);
  tree.clearFilter();
  assert.equal(filter().value, '');
  assert.equal(rows(), 4);
  assert.equal(document.querySelector('.tree-filtering'), null);
});
