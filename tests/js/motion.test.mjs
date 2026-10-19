// Motion that keeps its place: overlays centred with translate keep their centring while an entrance animation
// runs (the busy pill and the bars used to slide in from the side), and AI chat entries re-drawn while the AI
// streams do not play their entrance again (the activity card blinked once per feature).
import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import { parseHTML } from 'linkedom';
import { loadRules, computed } from './css-cascade.mjs';

register('./three-loader.mjs', import.meta.url);
const { window, document } = parseHTML('<html><body><div id="taskstrip"></div><div id="taskpanel"></div></body></html>');
globalThis.window = window;
globalThis.document = document;
const { TaskPane } = await import('../../opensketch/static/js/ui/taskpane.js');
const R = loadRules();

test('overlays are centred with translate, so entrance animations (transform) keep them centred', () => {
  for (const look of ['dark', 'light', 'classic']) {
    for (const chain of [['section#graphics', 'div#busyind.busyind'], ['section#graphics', 'div#banners.banners'], ['section#graphics', 'div#headsup.headsup']]) {
      const s = computed(R, look, chain);
      assert.match(s.translate || '', /^-50%/, `${look} ${chain.at(-1)} translate`);
      assert.ok(!s.transform || s.transform === 'none', `${look} ${chain.at(-1)} has no transform of its own (${s.transform})`);
    }
  }
});

test('the edit, update and conflict bars stack in one column instead of covering each other', () => {
  for (const look of ['dark', 'light', 'classic']) {
    const b = computed(R, look, ['section#graphics', 'div#banners.banners']);
    assert.equal(b['flex-direction'], 'column');
    for (const chain of [['section#graphics', 'div#banners.banners', 'div#editbar.editbar'], ['section#graphics', 'div#banners.banners', 'div#serverbar.update-bar.note']]) {
      const s = computed(R, look, chain);
      assert.ok(!s.position || s.position === 'static', `${look} ${chain.at(-1)} flows in the stack (${s.position})`);
    }
  }
});

test('a chat entry re-drawn while streaming is settled; only its new step chips pop in', () => {
  const tp = new TaskPane({ viewer: { resize() {} } });
  tp.logEl = document.createElement('div'); tp.logEl.className = 'ai-log'; document.body.appendChild(tp.logEl);
  tp.bodyEl = document.createElement('div');
  const m = { role: 'activity', state: 'running', title: 'Writing features', items: [{ label: 'Sketch1' }] };
  tp.logEl.appendChild(tp.entryEl(m));
  assert.ok(!m.el.classList.contains('settled'), 'a new entry plays its entrance');
  m.items.push({ label: 'Boss-Extrude1' });
  tp.refresh(m);
  assert.ok(m.el.classList.contains('settled'));
  const chips = [...m.el.querySelectorAll('.ai-steps .st')];
  assert.deepEqual(chips.map((c) => c.classList.contains('new')), [false, true]);
  for (const look of ['dark', 'light']) {
    const fresh = computed(R, look, ['div.ai-log', 'div.ai-act.running']);
    assert.match(fresh.animation || '', /os-rise/, `${look}: a new card rises in`);
    const settled = computed(R, look, ['div.ai-log', 'div.ai-act.running.settled']);
    assert.equal(settled.animation, 'none', `${look}: a re-drawn card does not`);
    assert.equal(computed(R, look, ['div.ai-log', 'div.ai-act.settled', 'div.ai-steps', 'span.st.ok']).animation, 'none');
    assert.match(computed(R, look, ['div.ai-log', 'div.ai-act.settled', 'div.ai-steps', 'span.st.ok.new']).animation || '', /popin/);
  }
});
