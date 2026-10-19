// Phones (<= 760 px) and touch screens: the heads-up toolbar is centred and whole, Undo / Redo and the menus stay
// in the title bar (a touch screen has no Ctrl+Z), and fields are 16 px so iOS does not zoom into them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRules, computed } from './css-cascade.mjs';

const R = loadRules();
const PHONE = '@media (max-width: 760px)';
const TOUCH = '@media (pointer: coarse)';
const LOOKS = ['dark', 'light', 'classic'];

test('the heads-up toolbar stays centred on phones and scrolls rather than being cut off', () => {
  for (const look of LOOKS) {
    const hu = computed(R, look, ['section#graphics', 'div#headsup.headsup'], { media: [PHONE] });
    assert.equal(hu.scale, '.9', `${look}: phones only scale the heads-up toolbar`);
    assert.match(hu.translate, /^-50%/, `${look}: and it stays centred`);
    assert.equal(hu['overflow-x'], 'auto', `${look}: a long toolbar scrolls`);
  }
});

test('phones keep Undo, Redo and the menus in the title bar', () => {
  for (const look of LOOKS) {
    const qa = (cmd) => computed(R, look, ['div#app', 'header#titlebar', 'div#quickaccess.quickaccess', `div.qa[data-cmd=${cmd}]`], { media: [PHONE] });
    for (const cmd of ['undo', 'redo']) assert.notEqual(qa(cmd).display, 'none', `${look}: ${cmd} shown`);
    for (const cmd of ['new', 'open', 'save', 'print', 'rebuild']) assert.equal(qa(cmd).display, 'none', `${look}: ${cmd} hidden on a phone`);
    const sep = computed(R, look, ['div#app', 'header#titlebar', 'div#quickaccess.quickaccess', 'span.qa-sep'], { media: [PHONE] });
    assert.equal(sep.display, 'none');
    const fly = computed(R, look, ['div#app', 'header#titlebar', 'div#menu-flyout.menu-flyout'], { media: [PHONE] });
    assert.notEqual(fly.display, 'none', `${look}: the menu button stays`);
    const bar = computed(R, look, ['div#app', 'header#titlebar', 'nav#menubar.menubar'], { media: [PHONE] });
    assert.equal(bar.position, 'absolute', `${look}: the opened menu bar drops below the title bar`);
    assert.equal(bar['overflow-x'], 'auto');
  }
});

test('quick access separators use the theme line colour (they were #ddd bars in the dark title bar)', () => {
  for (const look of LOOKS) {
    const s = computed(R, look, ['div#app', 'header#titlebar', 'div#quickaccess.quickaccess', 'span.qa-sep']);
    assert.notEqual(s['background-color'] || s.background, '#ddd', look);
    assert.ok(s['background-color'] || s.background, `${look}: separator has a colour`);
  }
});

test('touch screens get 16 px fields (no iOS zoom) and a full-height layout that excludes the browser bars', () => {
  for (const look of LOOKS) {
    for (const chain of [['div.pm-row', 'input[type=text]'], ['div.fv-search', 'input'], ['div.ai-input', 'textarea'], ['form.search', 'input#cmdsearch[type=search]']]) {
      const s = computed(R, look, chain, { media: [TOUCH] });
      assert.equal(s['font-size'], '16px', `${look} ${chain.join(' ')}`);
    }
    const app = computed(R, look, ['div#app']);
    assert.equal(app.height, '100dvh', `${look}: #app uses the dynamic viewport height`);
  }
});
