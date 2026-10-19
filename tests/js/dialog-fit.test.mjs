// Dialogs and menus fit the window: on a phone or a short laptop window the title, the body (scrolling) and the
// buttons stay reachable (Equations was 680 px wide at 390 px; People on this server ran off the bottom).
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';
import { loadRules, computed } from './css-cascade.mjs';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><body><div id="modal-layer"></div></body></html>');
globalThis.window = window;
globalThis.document = document;
Object.assign(window, { innerWidth: 390, innerHeight: 600 });
globalThis.innerWidth = 390; globalThis.innerHeight = 600;
const { contextMenu, closeMenus } = await import('../../opensketch/static/js/ui/dialogs.js');

test('dialogs are capped to the window and scroll their body, in every look', () => {
  const R = loadRules();
  for (const look of ['dark', 'light', 'classic']) {
    const d = computed(R, look, ['div#modal-layer', 'div.dlg-back.modal', 'div.dlg.eqdialog']);
    assert.match(d['max-height'] || '', /100dvh|100vh/, `${look}: dialog max-height`);
    assert.match(d['max-width'] || '', /100vw/, `${look}: dialog max-width`);
    assert.equal(d['min-width'], '0', `${look}: Equations no longer forces 680 px`);
    assert.equal(d.display, 'flex');
    const b = computed(R, look, ['div#modal-layer', 'div.dlg-back.modal', 'div.dlg', 'form.dlg-b']);
    assert.equal(b.overflow, 'auto', `${look}: the body scrolls`);
    assert.equal(b['min-height'], '0');
    const f = computed(R, look, ['div#modal-layer', 'div.dlg-back.modal', 'div.dlg', 'div.dlg-f']);
    assert.equal(f.flex, 'none', `${look}: the buttons never shrink away`);
    const m = computed(R, look, ['div.contextmenu']);
    assert.equal(m['overflow-y'], 'auto', `${look}: a tall menu scrolls`);
  }
});

test('a menu taller than the space below its anchor starts inside the window', () => {
  // the layout size (the opening animation scales the box on screen for a moment, so that must not be used)
  const proto = window.HTMLElement.prototype;
  const saved = ['offsetWidth', 'offsetHeight'].map((k) => [k, Object.getOwnPropertyDescriptor(proto, k)]);
  Object.defineProperty(proto, 'offsetWidth', { configurable: true, get: () => 220 });
  Object.defineProperty(proto, 'offsetHeight', { configurable: true, get: () => 640 });
  proto.getBoundingClientRect = function () { return { left: 0, top: 0, width: 220 * 0.98, height: 640 * 0.98, right: 216, bottom: 627 }; };
  try {
    const m = contextMenu(300, 120, [{ label: 'Line', run() {} }]);
    assert.equal(m.style.top, '4px');
    assert.equal(m.style.left, '166px', 'and its right edge stays inside');
  } finally {
    for (const [k, d] of saved) { if (d) Object.defineProperty(proto, k, d); else delete proto[k]; }
    delete proto.getBoundingClientRect;
    closeMenus();
  }
});
