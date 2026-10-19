// The three looks (Linear dark, Linear light, classic SOLIDWORKS colours) keep their meaning and stay readable:
// computed from the real stylesheets with a small cascade (css-cascade.mjs), no browser needed.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRules, computed, tokens, contrast, rgba, over } from './css-cascade.mjs';

const R = loadRules();
const LOOKS = ['dark', 'light', 'classic'];
const reddish = (c) => { const [r, g, b] = rgba(c); return r > g + 80 && r > b + 60; };

test('renaming a tree item shows a readable field in every look (it was a white box with white text in dark)', () => {
  for (const look of LOOKS) {
    for (const row of ['div.tn.selected', 'div.tn.suppressed', 'div.tn.error', 'div.tn.rolledback']) {
      const s = computed(R, look, ['div#tree.tree', row, 'span.nm.rename']);
      const bg = s['background-color'];
      const ratio = contrast(s.color, bg);
      assert.ok(ratio >= 7, `${look} ${row}: rename text ${s.color} on ${bg} is ${ratio.toFixed(2)}:1`);
      assert.equal(s['font-style'], 'normal', `${look} ${row}: the name is not italic while editing`);
    }
    const t = tokens(R, look);
    const s = computed(R, look, ['div#tree.tree', 'div.tn.selected', 'span.nm.rename']);
    assert.equal(rgba(s['background-color']).join(), rgba(t['--field'] || '#fff').join(), `${look}: the field colour of the theme`);
  }
});

test('over-defined dimensions and relations stay red in every look', () => {
  for (const look of LOOKS) {
    const d = computed(R, look, ['div#labels.labels', 'div.dimlbl.over']);
    assert.ok(reddish(d.color), `${look}: over-defined dimension is ${d.color}`);
    const g = computed(R, look, ['div#labels.labels', 'div.relglyph.over']);
    assert.ok(reddish(g['border-color']), `${look}: over-defined relation border is ${g['border-color']}`);
    if (look !== 'classic') {
      const t = tokens(R, look);
      const bg = over(rgba(d['background-color']), rgba(t['--content']));
      assert.ok(contrast(d.color, bg) >= 4.5, `${look}: red dimension text ${contrast(d.color, bg).toFixed(2)}:1`);
    }
    // selected or highlighted still wins, as in SOLIDWORKS
    const sel = computed(R, look, ['div#labels.labels', 'div.dimlbl.over.sel']);
    assert.ok(!reddish(sel.color), `${look}: a selected over-defined dimension shows the selection colour`);
  }
});

test('classic sketch dimensions sit on a backing, so the dimension line does not strike through the value', () => {
  const d = computed(R, 'classic', ['div#labels.labels', 'div.dimlbl']);
  assert.ok(rgba(d['background-color'])[3] >= 0.8, `classic dimension background ${d['background-color']}`);
  const p = computed(R, 'classic', ['div#labels.labels', 'div.dimlbl.preview']);
  assert.equal(rgba(p['background-color'])[3], 0, 'a preview dimension has no backing');
});

test('text tokens pass WCAG AA (4.5:1) on every surface of both Linear themes', () => {
  for (const look of ['dark', 'light']) {
    const t = tokens(R, look);
    for (const fg of ['--text', '--text-2', '--muted', '--accent-text', '--red', '--green']) {
      for (const bg of ['--side', '--content', '--raised', '--field']) {
        const k = contrast(t[fg], t[bg]);
        assert.ok(k >= 4.5, `${look}: ${fg} ${t[fg]} on ${bg} ${t[bg]} is ${k.toFixed(2)}:1`);
      }
    }
    // error text on its own tint (PropertyManager errors, chat errors, "Not accepted")
    const errBg = over(rgba(t['--err-bg']), rgba(t['--side']));
    assert.ok(contrast(t['--red'], errBg) >= 4.4, `${look}: red on the error tint ${contrast(t['--red'], errBg).toFixed(2)}:1`);
    // white on the accent and on red buttons, at rest and on hover
    for (const b of ['--accent', '--accent-h', t['--red-fill'] ? '--red-fill' : '--red']) {
      assert.ok(contrast('#ffffff', t[b]) >= 4.5, `${look}: white on ${b} ${t[b]} is ${contrast('#ffffff', t[b]).toFixed(2)}:1`);
    }
    // secondary text stays a visible step above muted text, and muted above faint (the dimmed look's hierarchy)
    assert.ok(contrast(t['--text-2'], t['--muted']) >= 1.3, `${look}: --text-2 and --muted are too close`);
    assert.ok(t['--faint'] && contrast(t['--muted'], t['--faint']) >= 1.3, `${look}: --faint is a step below --muted`);
  }
  const c = tokens(R, 'classic');
  for (const bg of ['#ffffff', c['--bg']]) assert.ok(contrast(c['--muted'], bg) >= 4.5, `classic muted on ${bg}`);
});

test('real labels use readable text colours; only inactive rows and decoration use the faint one', () => {
  const cases = [
    [['div#cmdmgr', 'div.cmdtabs', 'div.cmdtab'], '--side'],
    [['footer#statusbar', 'span#sb-editing.sb-cell'], '--side'],
    [['div.fv-card', 'div.fv-meta', 'span'], '--raised'],
    [['div.dlg', 'form.dlg-b', 'div.eqfoot'], '--raised'],
    [['div.pm', 'div.pm-note'], '--side'],
  ];
  for (const look of ['dark', 'light']) {
    const t = tokens(R, look);
    for (const [chain, bg] of cases) {
      const s = computed(R, look, chain);
      const k = contrast(s.color, t[bg]);
      assert.ok(k >= 4.5, `${look}: ${chain.at(-1)} ${s.color} on ${bg} is ${k.toFixed(2)}:1`);
    }
    // the active Files filter shows its count on the selected pill, and the current version row on the accent tint
    const nav = computed(R, look, ['nav.fv-nav', 'button.fv-navi.on', 'i']);
    const pill = over(rgba(t['--active-bg']), rgba(t['--side']));
    assert.ok(contrast(nav.color, pill) >= 4.5, `${look}: nav count ${contrast(nav.color, pill).toFixed(2)}:1`);
    const v = computed(R, look, ['div.fv-hist', 'div.fv-hrow.cur', 'span.t']);
    const row = over(rgba(t['--accent-bg']), rgba(t['--raised']));
    assert.ok(contrast(v.color, row) >= 4.5, `${look}: current version row ${contrast(v.color, row).toFixed(2)}:1`);
    const off = computed(R, look, ['div#tree.tree', 'div.tn.suppressed', 'span.nm']);
    assert.equal(off.color, t['--faint'], `${look}: suppressed rows stay dimmer than normal rows`);
  }
});

test('fields look like fields: a resting edge in the Linear themes, and component rules win without !important', () => {
  for (const look of ['dark', 'light']) {
    const t = tokens(R, look);
    const f = computed(R, look, ['aside#leftpanel', 'div.pm', 'div.pm-row', 'div.pm-num', 'input[type=text]']);
    assert.notEqual(rgba(f['border-color'])[3], 0, `${look}: PropertyManager number field has a visible edge (${f['border-color']})`);
    assert.equal(rgba(f['background-color']).join(), rgba(t['--field']).join(), `${look}: PropertyManager field uses the field colour`);
    const s = computed(R, look, ['header#titlebar', 'form.search', 'input#cmdsearch[type=search]']);
    assert.equal(s['border-radius'], '6px', `${look}: the command search keeps its own radius`);
    const m = computed(R, look, ['div.dlg.modify', 'form.dlg-b', 'div.mod-val', 'input']);
    assert.equal(rgba(m['border-color']).join(), rgba(t['--accent']).join(), `${look}: the Modify box value has the accent edge`);
  }
  const c = computed(R, 'classic', ['aside#leftpanel', 'div.pm', 'div.pm-row', 'div.pm-num', 'input[type=text]']);
  assert.equal(rgba(c['background-color']).join(), rgba('#ffffff').join(), 'classic PropertyManager fields stay white');
});
