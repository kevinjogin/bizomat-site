// View > Theme applies at once, without a reload (YZ: the reload lost undo history, an open sketch or
// PropertyManager and the AI chat): classes on <html>, the browser bar colour, every icon already on the page,
// the sketch colours and the 3D palette follow. And no icon keeps a pale tile in the dark theme.
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';
import { rgba } from './css-cascade.mjs';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><head><meta name="theme-color" content="#0c0d0e"></head><body><div id="ribbon"></div></body></html>');
globalThis.window = window;
globalThis.document = document;
globalThis.CustomEvent = window.CustomEvent;
const skin = await import('../../opensketch/static/js/skin.js');
const { icon, ICON_SOURCES } = await import('../../opensketch/static/js/icons.js');
const { SK } = await import('../../opensketch/static/js/sketch/draw.js');

const fillOf = (el) => el.querySelector('path').getAttribute('fill');
const lum = (hex) => { const c = rgba(hex); const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };

test('the look switches in place: classes, browser bar colour, icons on the page, sketch colours', () => {
  assert.equal(skin.LOOK, 'dark');
  const ribbon = document.getElementById('ribbon');
  ribbon.innerHTML = icon('plane_t', 16) + icon('nosuchicon', 16);
  const [plane, unknown] = ribbon.querySelectorAll('svg.ic');
  assert.equal(plane.getAttribute('data-i'), 'plane_t');
  assert.equal(unknown.getAttribute('data-i'), 'props', 'an unknown name falls back to a known icon');
  const darkFill = fillOf(plane);
  let heard = null;
  window.addEventListener('opensketch:look', (e) => { heard = e.detail.look; });

  skin.setLook('light');
  assert.equal(heard, 'light');
  assert.equal(document.documentElement.className.split(' ').sort().join(' '), 'skin-linear theme-light');
  assert.equal(document.querySelector('meta[name="theme-color"]').getAttribute('content'), skin.THEME_COLOR.light);
  assert.notEqual(fillOf(plane), darkFill, 'the icon already on the page was repainted');
  assert.equal(SK.fully, 0x000000, 'light sketches are drawn in black ink');

  skin.setLook('classic');
  assert.equal(skin.SKIN, 'classic');
  assert.equal(skin.ICON_SWAP, null);
  assert.equal(fillOf(plane), '#d7e6f7', 'classic icons keep their SOLIDWORKS colours');
  assert.equal(SK.sel, 0x2a8cff);

  skin.setLook('dark');
  assert.equal(fillOf(plane), darkFill);
  assert.equal(SK.fully, 0xf2f3f5, 'dark sketches are drawn in light ink');
  heard = null;
  skin.setLook('dark');
  assert.equal(heard, null, 'choosing the current look does nothing');
});

test('no icon keeps a pale tile in the dark theme', () => {
  const pale = new Set();
  for (const body of Object.values(ICON_SOURCES)) {
    for (const [, c] of body.matchAll(/fill="(#[0-9a-fA-F]{3,6})"/g)) if (lum(c) > 0.6) pale.add(c.toLowerCase());
  }
  const missing = [...pale].filter((c) => !skin.ICONS.dark[c]);
  assert.deepEqual(missing, [], 'pale icon fills without a dark colour');
  for (const c of pale) assert.ok(lum(skin.ICONS.dark[c]) < 0.1, `${c} is dark in the dark theme`);
});
