// Keyboard and focus in the editor (owner's rule, 2026-10-19): the SOLIDWORKS shortcuts act only when the focus is
// on the page, the graphics area or the FeatureManager tree; dialogs, the Files page, menus, text fields and
// focused buttons keep their own keys. Also dialog focus and button order, keyboard menus, command search
// ranking, menus per document kind, number fields, multi-select Delete and a sketch tool after the plane pick.
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML(`<html><body>
  <div id="app"><header><div id="menu-flyout"></div><nav id="menubar" class="hidden"></nav><div id="quickaccess"></div>
  <form><input id="cmdsearch"><div id="cmdsearch-results" class="hidden"></div></form></header>
  <div id="ribbon"></div><div id="cmdtabs"></div>
  <input id="treefilter"><div id="tree" tabindex="0"></div>
  <div id="gfx"><canvas id="cv"></canvas></div><button id="pmbtn">Delete All</button><input id="field">
  <div id="sb-defined"></div><div id="shortcutbar"></div><div id="viewcube"></div></div>
  <div id="modal-layer"></div></body></html>`);
globalThis.window = window;
globalThis.document = document;
globalThis.CSS = { escape: (s) => String(s) };
window.innerWidth = 1280; window.innerHeight = 900;
// linkedom does not track the focus: a small stand-in
let active = null;
Object.defineProperty(document, 'activeElement', { get: () => active || document.body, configurable: true });
window.HTMLElement.prototype.focus = function () { active = this; };
window.HTMLElement.prototype.blur = function () { if (active === this) active = null; };

const { App } = await import('../../opensketch/static/js/app.js');
const { dialog, contextMenu, closeMenus, asButton, orderButtons, initialFocus } = await import('../../opensketch/static/js/ui/dialogs.js');
const { rankCommands, menuItems } = await import('../../opensketch/static/js/ui/ribbon.js');
const { buildCommands, MENUS } = await import('../../opensketch/static/js/commands.js');
const { evalExpr, valueProblem } = await import('../../opensketch/static/js/ui/pm.js');
const { FeatureTree } = await import('../../opensketch/static/js/ui/tree.js');

const $ = (id) => document.getElementById(id);
const tick = () => new Promise((r) => setTimeout(r, 5));
function key(target, k, mods = {}) {
  const e = new window.Event('keydown', { bubbles: true, cancelable: true });
  Object.assign(e, { key: k, ctrlKey: false, metaKey: false, altKey: false, shiftKey: false }, mods);
  target.dispatchEvent(e);
  return e;
}

// One editor with the real key handler; what it would do is recorded in calls.
const calls = [];
let over = false;
const app = Object.create(App.prototype);
Object.assign(app, {
  files: { isOpen: false }, mode: 'part', cmd: null, lastCommand: 'fillet', selection: [], docStack: [], view: {},
  viewer: { canvas: $('cv'), zoomToFit: () => calls.push('fit'), rotateBy: () => calls.push('rotate'), zoomAt: () => calls.push('zoom') },
  pm: { isOpen: false }, commands: { fillet: { run: () => calls.push('repeat fillet') } },
  deleteSelection: () => calls.push('delete'), orientationPopup: () => calls.push('orient'), tabHide: () => calls.push('tabhide'),
  undo: () => calls.push('undo'), redo: () => calls.push('redo'), escapeKey: () => calls.push('escape'), shortcutBar: () => calls.push('S'),
  overGraphics: () => over,
});
app.bindKeys();
const reset = () => { calls.length = 0; active = null; over = false; app.files.isOpen = false; };

test('Enter or Space on a focused toolbar button presses it, and nothing else runs', () => {
  reset();
  const b = asButton(document.createElement('div'), 'Extruded Boss/Base');
  b.onclick = () => calls.push('clicked');
  $('ribbon').appendChild(b);
  b.focus();
  key(b, 'Enter');
  key(b, ' ');
  assert.deepEqual(calls, ['clicked', 'clicked']);
  assert.equal(b.getAttribute('role'), 'button');
  assert.equal(b.getAttribute('aria-label'), 'Extruded Boss/Base');
  assert.equal(b.getAttribute('tabindex'), '0');
});

test('a focused button keeps Tab, Enter, Space, Delete, arrows and letters; Ctrl+Z and Escape still reach the editor', () => {
  reset();
  const b = $('pmbtn');
  b.focus();
  for (const k of ['Tab', 'Enter', ' ', 'Delete', 'Backspace', 'ArrowDown', 'f', 's']) assert.equal(key(b, k).defaultPrevented, false, k);
  assert.deepEqual(calls, []);
  key(b, 'z', { ctrlKey: true });
  key(b, 'Escape');
  assert.deepEqual(calls, ['undo', 'escape']);
  assert.ok(document.activeElement !== b); // Escape goes back to the model
});

test('text fields keep every key', () => {
  reset();
  for (const k of ['Delete', 'Enter', ' ', 'Tab', 'z']) key($('field'), k, k === 'z' ? { ctrlKey: true } : {});
  assert.deepEqual(calls, []);
});

test('on the page, the SOLIDWORKS keys work: Delete, Enter repeats, Space, F, arrows', () => {
  reset();
  const body = document.body;
  assert.equal(key(body, 'Delete').defaultPrevented, true);
  assert.equal(key(body, 'Enter').defaultPrevented, true);
  key(body, ' '); key(body, 'f'); key(body, 'ArrowLeft'); key(body, 's');
  assert.deepEqual(calls, ['delete', 'repeat fillet', 'orient', 'fit', 'rotate', 'S']);
});

test('Tab hides only over the graphics area with the focus on the page; elsewhere it moves the focus', () => {
  reset();
  assert.equal(key(document.body, 'Tab').defaultPrevented, false);
  assert.deepEqual(calls, []);
  over = true;
  assert.equal(key(document.body, 'Tab').defaultPrevented, true);
  assert.equal(key($('cv'), 'Tab', { shiftKey: true }).defaultPrevented, true);
  assert.deepEqual(calls, ['tabhide', 'tabhide']);
  calls.length = 0;
  $('tree').focus();
  assert.equal(key($('tree'), 'Tab').defaultPrevented, false); // from the tree, Tab moves on
  assert.deepEqual(calls, []);
});

test('after a tree click, Delete and F still act (the tree is part of the workspace)', () => {
  reset();
  $('tree').focus();
  key($('tree'), 'Delete'); key($('tree'), 'f');
  assert.deepEqual(calls, ['delete', 'fit']);
});

test('while a modal dialog is open nothing reaches the model, and the page behind it is inert', async () => {
  reset();
  over = true;
  const d = dialog({ title: 'About', body: '<p>Text</p>', buttons: [{ label: 'A' }, { label: 'B' }, { label: 'OK', primary: true }] });
  await tick();
  assert.equal($('app').inert, true);
  const ok = d.el.querySelector('.dlg-f .btn.primary');
  assert.ok(document.activeElement === ok);
  const a = [...d.el.querySelectorAll('.dlg-f .btn')].find((x) => x.textContent === 'A');
  a.focus();
  for (const [k, m] of [['Tab'], ['Enter'], [' '], ['Delete'], ['Backspace'], ['z', { ctrlKey: true }], ['ArrowLeft']]) assert.equal(key(a, k, m).defaultPrevented, false, k);
  key(document.body, 'Delete'); key(document.body, 'z', { ctrlKey: true });
  assert.deepEqual(calls, []);
  d.close();
  assert.equal($('app').inert, false);
  key(document.body, 'Delete');
  assert.deepEqual(calls, ['delete']);
});

test('while the Files page is open the hidden model gets no keys', () => {
  reset();
  app.files.isOpen = true;
  for (const [k, m] of [['Delete'], ['z', { ctrlKey: true }], ['Enter'], [' ']]) key(document.body, k, m);
  assert.deepEqual(calls, []);
});

test('a mouse click does not leave the focus parked on a toolbar button', () => {
  reset();
  const b = asButton(document.createElement('div'), 'Fillet');
  $('ribbon').appendChild(b);
  b.focus();
  const click = new window.Event('click', { bubbles: true });
  click.detail = 1;
  b.dispatchEvent(click);
  assert.ok(document.activeElement !== b);
  b.focus();
  b.click(); // from the keyboard (detail 0): the focus stays
  assert.ok(document.activeElement === b);
});

test('dialogs: the focus never starts on a destructive button or the close button; Cancel and Close go last', async () => {
  const purge = dialog({ title: 'Delete forever', body: '<p>Gone for good?</p>', buttons: [{ label: 'Cancel' }, { label: 'Delete forever', primary: true, danger: true }] });
  await tick();
  assert.deepEqual([...purge.el.querySelectorAll('.dlg-f .btn')].map((b) => b.textContent), ['Delete forever', 'Cancel']);
  assert.equal(document.activeElement.textContent, 'Cancel');
  purge.close();
  assert.deepEqual(orderButtons([{ label: "Don't save" }, { label: 'Cancel' }, { label: 'Save to Files', primary: true }]).map((b) => b.label), ['Save to Files', "Don't save", 'Cancel']);
  assert.deepEqual(orderButtons([{ label: 'Invite people...' }, { label: 'Done', primary: true }]).map((b) => b.label), ['Invite people...', 'Done']);
  // Connect AI: read-only addresses and tabs, no footer: the selected tab, not the close button
  const body = document.createElement('div');
  body.innerHTML = '<div role="tablist"><button aria-selected="false">API key</button><button aria-selected="true">AI app</button></div><input readonly value="https://x/mcp">';
  const cx = dialog({ title: 'Connect AI', body, buttons: [] });
  assert.equal(initialFocus(cx.el).textContent, 'AI app');
  cx.close();
  const eq = document.createElement('div');
  eq.innerHTML = '<label><input type="checkbox"> Delete absorbed</label>';
  const del = dialog({ title: 'Confirm Delete', body: eq, buttons: [{ label: 'Yes', primary: true }, { label: 'No' }] });
  assert.equal(initialFocus(del.el).textContent, 'Yes'); // a checkbox is not a field to type in
  del.close();
});

test('menus: arrows move, Enter runs, disabled rows are skipped, Escape gives the focus back', () => {
  const opener = asButton(document.createElement('div'), 'Edit');
  document.getElementById('menubar').appendChild(opener);
  opener.focus();
  const ran = [];
  const m = contextMenu(-50, 10, [{ label: 'Undo', run: () => ran.push('undo') }, '-', { label: 'Rib', disabled: true, run: () => ran.push('rib') }, { label: 'Delete', run: () => ran.push('delete') }], null, { keyboard: true, returnTo: opener });
  assert.equal(m.getAttribute('role'), 'menu');
  assert.equal(m.style.left, '4px'); // kept on screen
  assert.equal(document.activeElement.textContent, 'Undo');
  key(document.activeElement, 'ArrowDown');
  assert.equal(document.activeElement.textContent, 'Delete');
  key(document.activeElement, 'ArrowDown');
  assert.equal(document.activeElement.textContent, 'Undo'); // wraps
  assert.equal(key(document.activeElement, 'Delete').defaultPrevented, false);
  assert.deepEqual(calls.filter((c) => c === 'delete'), [], 'Delete in a menu never reaches the model');
  key(document.activeElement, 'End');
  key(document.activeElement, 'Enter');
  assert.deepEqual(ran, ['delete']);
  assert.ok(document.activeElement === opener);
  contextMenu(10, 10, [{ label: 'Undo', run: () => {} }], null, { keyboard: true, returnTo: opener });
  key(document.activeElement, 'Escape');
  assert.ok(document.activeElement === opener);
  closeMenus();
});

test('command search: name matches first ("fil" finds Fillet), and only commands for this document', () => {
  const fake = { mode: 'part', toast() {}, featureworks: {} };
  const C = buildCommands(fake);
  const labels = (q, asm = false) => rankCommands(C, q, asm).map((c) => (typeof c.label === 'function' ? c.label() : c.label));
  assert.equal(labels('fil')[0], 'Fillet');
  assert.equal(labels('cut')[0], 'Extruded Cut');
  assert.equal(labels('line')[0], 'Line');
  assert.equal(labels('sk')[0], 'Sketch');
  assert.ok(!labels('mate').includes('Mate'), 'Mate is not offered in a part');
  assert.equal(labels('mate', true)[0], 'Mate');
  assert.ok(!labels('ext', true).includes('Extruded Boss/Base'), 'features are not offered in an assembly');
  const rib = rankCommands(C, 'rib', false);
  assert.equal(rib[0].id, 'rib'); // not built yet, still listed (SOLIDWORKS lists it greyed)
});

test('menus offer each document only its own commands, with no stray separators', () => {
  const C = buildCommands({ mode: 'part', toast() {}, featureworks: {} });
  const insert = MENUS.find((m) => m.name === 'Insert').items;
  const part = menuItems(insert, C, false);
  assert.equal(part[0], 'extrude');
  assert.ok(!part.includes('mate') && !part.includes('insertcomp') && part.includes('hole'));
  const asm = menuItems(insert, C, true);
  assert.deepEqual(asm.slice(0, 4), ['insertcomp', 'newpart', 'mate', 'coupler']);
  assert.ok(!asm.includes('extrude') && !asm.includes('sketch'));
  assert.deepEqual(asm.slice(-2), [{ head: 'FeatureWorks' }, 'recognize']);
  for (const list of [part, asm]) list.forEach((it, i) => assert.ok(!(it === '-' && (i === 0 || list[i - 1] === '-' || i === list.length - 1))));
  const win = MENUS.find((m) => m.name === 'Window').items;
  const rows = win({ docStack: [], doc: { name: 'Bracket' }, files: {} });
  assert.equal(rows[0].label, 'Bracket');
  assert.equal(rows[0].checked, true);
  const inAsm = win({ docStack: [{ doc: { name: 'Press' } }], doc: { name: 'Plate' }, asm: {}, files: {} });
  assert.deepEqual(inAsm.slice(0, 2).map((r) => [r.label, r.checked]), [['Press', false], ['Plate', true]]);
});

test('number fields read decimal commas and units, and say why a value is refused', () => {
  assert.equal(evalExpr('2,5', 'mm'), 2.5);
  assert.equal(evalExpr('1.5cm', 'mm'), 15);
  assert.equal(evalExpr('0.1 m', 'mm'), 100);
  assert.equal(evalExpr('1in', 'mm'), 25.4);
  assert.equal(evalExpr('=10+5', 'mm'), 15);
  assert.ok(Number.isNaN(evalExpr('30deg', 'mm')));
  assert.equal(evalExpr('30deg', 'deg'), 30);
  assert.ok(Math.abs(evalExpr('0.5rad', 'deg') - 28.6479) < 1e-3);
  assert.ok(Number.isNaN(evalExpr('5cm', 'deg')));
  assert.equal(evalExpr('30deg'), 30); // callers that give no unit (Design panel) keep both kinds
  assert.equal(valueProblem('abc', { unit: 'mm' }), 'Type a length, like 2.5 or 10mm.');
  assert.equal(valueProblem('0', { unit: 'mm', min: 0.01 }), 'At least 0.01mm.');
  assert.equal(valueProblem('50', { unit: 'deg', max: 45 }), 'At most 45deg.');
  assert.equal(valueProblem('2,5', { unit: 'mm', min: 0 }), null);
});

test('the FeatureManager: arrows move the selection and never turn the model; the root shows just the name', () => {
  reset();
  const sel = [];
  const tapp = {
    shownDoc: { name: 'Bracket', features: [{ id: 's1', type: 'sketch', name: 'Sketch1' }, { id: 'f1', type: 'extrude', name: 'Boss-Extrude1', sketch: 's1' }, { id: 'f2', type: 'fillet', name: 'Fillet1' }] },
    selection: [], statusById: {}, result: { body: { faces: [{}] } }, isAsm: false, cmd: null, mode: 'part',
    treeHover() {}, treeClick() {}, treeContext() {}, sketchDefinedPrefix: () => '',
    setSelection(list) { this.selection = list; sel.push(list.map((x) => x.id).join(',')); tree.render(); },
  };
  const tree = new FeatureTree(tapp);
  tree.render();
  const root = $('tree').querySelector('.tn.root');
  assert.equal(root.querySelector('.nm').textContent, 'Bracket');
  assert.match(root.title, /Default/);
  assert.equal($('tree').getAttribute('role'), 'tree');
  const rows = () => [...$('tree').querySelectorAll('.tn')];
  assert.ok(rows().every((r) => r.getAttribute('role') === 'treeitem'));
  tree.cursor = 'feature:f1';
  $('tree').focus();
  const e = key($('tree'), 'ArrowDown');
  assert.equal(e.defaultPrevented, true);
  assert.deepEqual(sel, ['f2']);
  assert.equal($('tree').getAttribute('aria-activedescendant'), rows().find((r) => r.dataset.key === 'feature:f2').id);
  key($('tree'), 'ArrowUp');
  assert.deepEqual(sel, ['f2', 'f1']);
  assert.ok(!calls.includes('rotate'));
  // Solid Bodies opens to the body, named after the last feature that changed it
  const bodies = rows().find((r) => r.dataset.key === 'folder:bodies');
  assert.equal(bodies.getAttribute('aria-expanded'), 'false');
  tree.cursor = 'folder:bodies';
  key($('tree'), 'ArrowRight');
  assert.ok(rows().some((r) => r.querySelector('.nm').textContent === 'Fillet1' && r.getAttribute('aria-level') === '3'));
  assert.equal(rows().find((r) => r.dataset.key === 'folder:history').getAttribute('aria-expanded'), null); // nothing to open
});

test('Delete with several features selected deletes them all in one Confirm Delete', () => {
  const asked = [];
  const a = Object.create(App.prototype);
  Object.defineProperty(a, 'isAsm', { value: false });
  Object.assign(a, { mode: 'part', selection: [{ kind: 'feature', id: 'f1' }, { kind: 'feature', id: 'f2' }, { kind: 'plane', id: 'Front Plane' }, { kind: 'sketch', id: 's3' }],
    deleteFeature: (ids) => asked.push(ids) });
  a.deleteSelection();
  assert.deepEqual(asked, [['f1', 'f2', 's3']]);
});

test('a sketch tool clicked with no sketch open starts once the plane is picked', async () => {
  const tools = [];
  const a = Object.create(App.prototype);
  Object.defineProperty(a, 'isAsm', { value: false });
  Object.assign(a, { mode: 'part', selection: [], cmd: null, pm: { open() {}, isOpen: false }, updatePlanes() {}, status() {},
    closeCommand() { this.cmd = null; }, sketchOn() { this.mode = 'sketch'; }, sketcher: { setTool: (t) => tools.push(t) } });
  a.sketchTool('rectangle');
  assert.equal(a.cmd.onPick({ kind: 'plane', id: 'Front Plane' }), true);
  await tick();
  assert.deepEqual(tools, ['rectangle']);
  // cancelled before the pick lands: no tool later
  a.mode = 'part';
  a.sketchTool('circle');
  a.cmd.onPick({ kind: 'plane', id: 'Top Plane' });
  a.cmd = null;
  await tick();
  assert.deepEqual(tools, ['rectangle']);
});
