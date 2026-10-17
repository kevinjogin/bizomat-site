// Task Pane (right): OpenSketch AI copilot, resources, appearances, custom properties.

import { icon } from '../icons.js';
import { describeFeature, featureIcon, SPECS } from '../features.js';
import { mateIcon } from '../asm.js';
import { escapeHtml as esc, safeUrl } from '../model-utils.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

const PANES = [
  { id: 'ai', icon: 'ai', title: 'OpenSketch AI' },
  { id: 'resources', icon: 'resources', title: 'OpenSketch Resources' },
  { id: 'library', icon: 'library', title: 'Design Library' },
  { id: 'explorer', icon: 'explorer', title: 'File Explorer' },
  { id: 'palette', icon: 'palette', title: 'View Palette' },
  { id: 'appearance', icon: 'appearance', title: 'Appearances, Scenes, and Decals' },
  { id: 'custprops', icon: 'custprops', title: 'Custom Properties' },
];

const TOOL_META = {
  propose_features: { title: 'Writing features', icon: 'feature' },
  create_part: { title: 'Building part', icon: 'part' },
  insert_component: { title: 'Inserting component', icon: 'insertcomp' },
  add_mate: { title: 'Adding mate', icon: 'mate' },
  delete_items: { title: 'Deleting items', icon: 'cancel' },
  check_interference: { title: 'Checking interference', icon: 'interference' },
  find_mate_candidates: { title: 'Looking for mates in the geometry', icon: 'mate' },
  standard_part: { title: 'Toolbox part', icon: 'toolbox' },
  request_part_file: { title: 'Asking for a bought part', icon: 'open' },
  web_search: { title: 'Searching the web', icon: 'web' },
  web_fetch: { title: 'Reading a page', icon: 'page' },
};
// add_<type> tools come from the feature registry: "Adding Draft".
const toolMetaFromRegistry = (name) => {
  const spec = Object.values(SPECS).find((sp) => sp.tool === name);
  return spec ? { title: `Adding ${spec.title}`, icon: spec.icon } : null;
};
// Links from the web are untrusted: only http(s) becomes a link.
const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (_) { return String(u || ''); } };
const WEB_ERRORS = {
  max_uses_exceeded: 'limit for this request reached', too_many_requests: 'too many requests, try again soon',
  url_not_accessible: 'page could not be reached', url_not_allowed: 'site not allowed', url_not_in_prior_context: 'link not found in the conversation',
  unsupported_content_type: 'page type not supported', query_too_long: 'search too long', unavailable: 'search service unavailable',
};
const featureIconFor = (f) => { try { return featureIcon(f); } catch (_) { return 'feature'; } };
const mateIconFor = (t) => mateIcon(t);

const COLORS = ['#b9c0c8', '#d0d4d8', '#8a96a3', '#3c4650', '#c8a050', '#b87333', '#d9372b', '#2f7fd8', '#2f9e44', '#f2c230', '#ffffff', '#202020'];

export class TaskPane {
  constructor(app) {
    this.app = app;
    this.strip = document.getElementById('taskstrip');
    this.panel = document.getElementById('taskpanel');
    this.open = null;
    this.log = [];
    this.conversation = null;
    this.busy = false;
    for (const p of PANES) {
      const b = h('div', 'ts', icon(p.icon, 20));
      b.title = p.title; b.dataset.id = p.id;
      b.onclick = () => this.toggle(p.id);
      this.strip.appendChild(b);
    }
  }

  toggle(id) { this.show(this.open === id ? null : id); }

  show(id) {
    this.open = id;
    [...this.strip.children].forEach((b) => b.classList.toggle('active', b.dataset.id === id));
    this.panel.classList.toggle('hidden', !id);
    if (id) this.render();
    this.app.viewer.resize();
  }

  render() {
    const p = PANES.find((x) => x.id === this.open);
    if (!p) return;
    this.panel.innerHTML = '';
    const head = h('div', 'tp-head', `${icon(p.icon, 18)}<span>${p.title}</span><span class="pin" title="Close">&#x2715;</span>`);
    head.querySelector('.pin').onclick = () => this.show(null);
    this.panel.appendChild(head);
    const body = h('div', 'tp-body');
    this.panel.appendChild(body);
    if (p.id === 'ai') return this.renderAI(body);
    if (p.id === 'resources') return this.renderResources(body);
    if (p.id === 'appearance') return this.renderAppearance(body);
    if (p.id === 'custprops') return this.renderProps(body);
    if (p.id === 'library') return this.app.toolbox.render(body);
    body.appendChild(h('div', 'pm-note', 'Not available yet in this version.'));
  }

  // ---------------------------------------------------------------- AI
  // The chat streams: thinking summary, a sentence per step, and an activity row per tool call
  // (features ticking off as they are rebuilt, components inserted, mates solved).
  renderAI(body) {
    const logEl = h('div', 'ai-log');
    this.logEl = logEl;
    this.bodyEl = body;
    body.appendChild(logEl);
    if (!this.log.length) {
      logEl.appendChild(h('div', 'ai-msg bot', 'Describe a part, a change, or a whole product. I build parts as real features (sketches with relations and dimensions, extrudes, fillets). For products with several pieces I build an assembly: each part, then the components and mates. You watch it being built in the graphics area. Proposals show in purple until you accept them.'));
      const ex = h('div', 'ai-examples');
      for (const t of ['A 60 x 40 x 10 mm plate with four 5 mm corner holes, 6 mm from the edges', 'A flanged bushing: 30 mm OD, 12 mm bore, 25 mm long, 45 mm flange 5 mm thick',
        'A hand press assembly: base plate, four guide columns, a crown, a sliding platen and a cylinder', 'A pillow block bearing housing with a 20 mm shaft, as an assembly', 'Add 2 mm fillets to all vertical edges']) {
        const sp = h('span', null, esc(t)); sp.onclick = () => { this.input.value = t; this.input.focus(); }; ex.appendChild(sp);
      }
      logEl.appendChild(ex);
      if (this.app.aiAvailable === false || this.app.aiDemo) {
        const off = h('div', 'ai-msg ' + (this.app.aiDemo ? 'bot' : 'err'), this.app.aiDemo ? 'Demo mode: requests play a recorded session.' : 'The AI is offline. Start the server with ANTHROPIC_API_KEY set to use it.');
        logEl.appendChild(off);
      }
      const demo = h('button', 'btn ai-demo', `${icon('playback', 14)} Watch a demo: AI builds a hand press assembly`);
      demo.onclick = () => this.send('Build a hand press assembly (demo)', { demo: true });
      logEl.appendChild(demo);
    }
    for (const m of this.log) logEl.appendChild(this.entryEl(m));
    const inp = h('div', 'ai-input');
    const ta = h('textarea'); ta.placeholder = 'Describe the part or the change...';
    ta.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); this.send(); } });
    if (this.draft) ta.value = this.draft;
    ta.oninput = () => { this.draft = ta.value; };
    this.input = ta;
    const row = h('div', 'row');
    row.appendChild(h('span', 'hint', this.busy ? 'Building... you can rotate and zoom the view' : 'Ctrl+Enter to send'));
    const reset = h('button', 'btn', 'New chat'); reset.onclick = () => { if (this.busy) return; this.log = []; this.conversation = null; this.render(); };
    reset.disabled = this.busy;
    const send = this.busy ? h('button', 'btn danger', `${icon('ai_stop', 12)} Stop`) : h('button', 'btn primary', 'Send');
    send.onclick = () => (this.busy ? this.stop() : this.send());
    row.append(reset, send);
    inp.append(ta, row);
    this.panel.appendChild(inp);
    this.scroll(true);
    if (!this.busy) setTimeout(() => ta.focus(), 0);
  }

  scroll(force = false) {
    const b = this.bodyEl;
    if (!b) return;
    if (force || b.scrollHeight - b.scrollTop - b.clientHeight < 120) b.scrollTop = b.scrollHeight;
  }

  entryEl(m) {
    let el;
    if (m.role === 'proposal') {
      el = h('div', 'ai-proposal');
      el.innerHTML = `<b>${esc(m.summary || 'Proposed change')}</b><div class="feats">${m.features.map((f) => '&bull; ' + esc(f)).join('<br>')}</div>`;
      if (m.state === 'pending') {
        const btns = h('div', 'btns');
        const ok = h('button', 'btn primary', 'Accept'); ok.onclick = () => { this.app.acceptProposal(); m.state = 'accepted'; this.render(); };
        const no = h('button', 'btn danger', 'Reject'); no.onclick = () => { this.app.rejectProposal(); m.state = 'rejected'; this.render(); };
        btns.append(ok, no);
        if (m.assembly) { const pb = h('button', 'btn ai-inline', `${icon('playback', 12)}<span>Replay</span>`); pb.title = 'Replay the assembly order'; pb.onclick = () => this.app.asm.playSequence(); btns.append(pb); }
        el.appendChild(btns);
      } else el.appendChild(h('div', 'pm-note', m.state === 'accepted' ? 'Accepted' : 'Rejected'));
    } else if (m.role === 'request') {
      el = h('div', 'ai-request');
      const url = safeUrl(m.url);
      el.innerHTML = `<div class="ah">${icon('open', 14)}<b>Bought part: ${esc(m.description)}</b></div>` +
        (url ? `<div>1. Open <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${m.mcmaster ? 'McMaster-Carr ' + esc(m.mcmaster) : esc(url)}</a> and download the 3D STEP file.</div>` : '<div>1. Download a STEP file of this part from its supplier.</div>') +
        `<div>2. Drop it here or choose it. It replaces the placeholder <code>${esc(m.part)}</code>.</div>`;
      if (m.done) el.appendChild(h('div', 'pm-note', 'Replaced with ' + esc(m.done)));
      else {
        const b = h('button', 'btn', 'Choose STEP file...');
        const pick = (file) => this.app.replacePartFromFile(m.part, file).then((ok) => { if (ok) { m.done = file.name; this.refresh(m); } });
        b.onclick = () => { const i = document.createElement('input'); i.type = 'file'; i.accept = '.step,.stp,.zip'; i.onchange = () => i.files[0] && pick(i.files[0]); i.click(); };
        el.addEventListener('dragover', (e) => { e.preventDefault(); el.classList.add('drop'); });
        el.addEventListener('dragleave', () => el.classList.remove('drop'));
        el.addEventListener('drop', (e) => { e.preventDefault(); e.stopPropagation(); el.classList.remove('drop'); const f = e.dataTransfer?.files?.[0]; if (f) pick(f); });
        el.appendChild(b);
      }
    } else if (m.role === 'sources') {
      el = h('div', 'ai-sources');
      el.appendChild(h('div', 'sh', 'Sources'));
      for (const it of m.items) {
        const url = safeUrl(it.url);
        if (!url) continue;
        const a = h('a', '', `${esc(it.title || url)}<span class="host">${esc(hostOf(url))}</span>`);
        a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        el.appendChild(a);
      }
    } else if (m.role === 'thinking') {
      el = h('div', 'ai-think' + (m.open ? ' open' : ''));
      const head = h('div', 'th', `${m.live ? '<span class="spinner"></span>' : icon('ai', 12)}<span>${m.live ? 'Thinking' : 'Thought'}</span><span class="chev">${m.open ? '&#9650;' : '&#9660;'}</span>`);
      head.onclick = () => { m.open = !m.open; this.refresh(m); };
      const txt = h('div', 'tx'); txt.textContent = m.text;
      el.append(head, txt);
    } else if (m.role === 'activity') {
      el = h('div', 'ai-act ' + (m.state || 'running'));
      const st = m.state === 'running' ? '<span class="spinner"></span>' : m.state === 'error' ? icon('error', 13) : icon('ok', 13);
      el.innerHTML = `<div class="ah">${st}${icon(m.icon || 'ai', 14)}<b>${esc(m.title)}</b>${m.detail ? `<span class="ad">${esc(m.detail)}</span>` : ''}</div>`;
      if (m.items?.length) {
        const list = h('div', 'ai-steps');
        for (const it of m.items) list.appendChild(h('span', 'st ' + (it.state || 'ok'), `${icon(it.icon || 'feature', 12)}${esc(it.label)}`));
        el.appendChild(list);
      }
    } else {
      el = h('div', 'ai-msg ' + (m.role === 'user' ? 'user' : m.role === 'error' ? 'err' : 'bot'));
      el.textContent = m.text;
      if (m.live) el.classList.add('live');
    }
    m.el = el;
    return el;
  }

  // Re-draw one chat entry in place (keeps the input box and scroll position).
  refresh(m) {
    if (!m.el || !m.el.isConnected) return;
    const old = m.el;
    old.replaceWith(this.entryEl(m));
    this.scroll();
  }

  add(m) {
    this.log.push(m);
    if (this.open === 'ai' && this.logEl) { this.logEl.appendChild(this.entryEl(m)); this.scroll(); }
    return m;
  }

  stop() {
    if (this.abort) this.abort.abort();
  }

  async send(text, opts = {}) {
    const prompt = (text ?? this.input?.value ?? '').trim();
    if (!prompt || this.busy) return;
    const app = this.app;
    if (app.mode === 'sketch') app.exitSketch();
    if (app.proposal) app.rejectProposal(true);
    this.show('ai');
    if (text === undefined && this.input) { this.input.value = ''; this.draft = ''; }
    this.busy = true;
    this.log.push({ role: 'user', text: prompt });
    this.render();
    const ctl = new AbortController();
    this.abort = ctl;
    const before = app.cleanDoc();
    const S = { text: null, think: null, acts: new Map(), proposal: null, done: null, error: null };
    try {
      const r = await fetch('/api/ai/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: ctl.signal,
        body: JSON.stringify({ doc: before, prompt, conversation: this.conversation, demo: opts.demo || false }) });
      if (!r.ok || !r.body) throw new Error(`Server error ${r.status}`);
      const reader = r.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
          if (line) this.onEvent(JSON.parse(line), S);
        }
      }
      if (buf.trim()) this.onEvent(JSON.parse(buf), S);
    } catch (err) {
      S.error = ctl.signal.aborted ? 'Stopped.' : String(err.message || err);
    }
    // close any open entries
    if (S.text) { S.text.live = false; this.refresh(S.text); }
    if (S.think) { S.think.live = false; S.think.open = false; this.refresh(S.think); }
    for (const a of S.acts.values()) if (a.state === 'running') { a.state = S.error ? 'error' : 'done'; this.refresh(a); }
    if (S.error) {
      app.live.stop();
      this.add({ role: 'error', text: S.error });
      if (S.proposal && ctl.signal.aborted) this.add({ role: 'bot', text: 'The partial result was discarded.' });
    } else if (S.done) {
      const d = S.done;
      this.conversation = d.conversation || this.conversation;
      await app.live.finish();
      if (d.proposal) await this.showResult(d, before); // drawn under the live view, then revealed
      else if (d.reply && !(S.lastText && S.lastText.trim() === d.reply.trim())) this.add({ role: 'bot', text: d.reply });
      if (d.sources?.length) this.add({ role: 'sources', items: d.sources });
      app.live.stop();
      if (d.proposal) app.viewer.followBox(app.viewer.sceneBox());
    } else app.live.stop();
    this.busy = false;
    this.abort = null;
    this.render();
  }

  showResult(d, before) {
    const app = this.app;
    const p = d.proposal;
    let ids, lines, assembly = false;
    if (p.type === 'assembly') {
      assembly = true;
      const old = before.type === 'assembly' ? before : { parts: {}, components: [], mates: [] };
      const oldC = new Set(old.components.map((c) => JSON.stringify([c.id, c.part])));
      const oldM = new Set(old.mates.map((m) => JSON.stringify(m)));
      const newC = p.components.filter((c) => !oldC.has(JSON.stringify([c.id, c.part])));
      const newM = p.mates.filter((m) => !oldM.has(JSON.stringify({ ...m, align: m.align })));
      const changedParts = Object.entries(p.parts).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(old.parts[k])).map(([, v]) => v.name);
      ids = [...newC.map((c) => c.id), ...newM.map((m) => m.id)];
      lines = [
        ...(changedParts.length ? [`Parts: ${changedParts.join(', ')}`] : []),
        ...(newC.length ? [`Components: ${newC.map((c) => c.name).join(', ')}`] : []),
        ...(newM.length ? [`Mates: ${newM.length}`] : []),
      ];
      if (!ids.length) ids = p.components.map((c) => c.id);
    } else {
      const prev = new Set((before.features || []).map((f) => JSON.stringify(f)));
      const changed = p.features.filter((f) => !prev.has(JSON.stringify(f)));
      ids = changed.map((f) => f.id);
      lines = changed.map((f) => describeFeature(f, this.app));
    }
    if (d.reply && !(this.lastStreamed && this.lastStreamed.trim() === d.reply.trim())) this.add({ role: 'bot', text: d.reply });
    this.add({ role: 'proposal', summary: assembly ? `Assembly: ${p.name}` : d.summary, features: lines, state: 'pending', assembly });
    return app.showProposal(p, ids, false);
  }

  onEvent(ev, S) {
    const app = this.app;
    const endText = () => { if (S.text) { S.text.live = false; this.refresh(S.text); S.text = null; } };
    const endThink = () => { if (S.think) { S.think.live = false; S.think.open = false; this.refresh(S.think); S.think = null; } };
    switch (ev.ev) {
      case 'start':
        this.conversation = ev.conversation;
        app.live.start(ev);
        break;
      case 'thinking_start':
        endText();
        S.think = this.add({ role: 'thinking', text: '', live: true, open: true });
        app.live.hint('Thinking...');
        break;
      case 'thinking':
        if (!S.think) S.think = this.add({ role: 'thinking', text: '', live: true, open: true });
        S.think.text += ev.delta;
        if (S.think.el) { S.think.el.querySelector('.tx').textContent = S.think.text; this.scroll(); }
        break;
      case 'text':
        endThink();
        if (!S.text) S.text = this.add({ role: 'bot', text: '', live: true });
        S.text.text += ev.delta;
        S.lastText = S.text.text; this.lastStreamed = S.text.text;
        if (S.text.el) { S.text.el.textContent = S.text.text; this.scroll(); }
        break;
      case 'tool_start': {
        endText(); endThink();
        const meta = TOOL_META[ev.tool] || toolMetaFromRegistry(ev.tool) || { title: ev.tool, icon: 'ai' };
        const a = this.add({ role: 'activity', title: meta.title, icon: meta.icon, items: [], state: 'running', tool: ev.tool });
        S.acts.set(ev.index, a);
        S.cur = a;
        app.live.hint(meta.title + '...');
        break;
      }
      case 'build_start': {
        const a = S.acts.get(ev.index);
        if (a && ev.name) { a.title = `Building ${ev.name}`; this.refresh(a); }
        app.live.push(ev);
        break;
      }
      case 'build_step': {
        const a = S.acts.get(ev.index);
        if (a && ev.feature) { a.items.push({ label: ev.feature.name || ev.feature.type, icon: featureIconFor(ev.feature), state: ev.state }); this.refresh(a); }
        app.live.push(ev);
        break;
      }
      case 'tool_progress': {
        const a = S.acts.get(ev.index);
        if (a) { a.detail = ev.names.slice(-3).join(' '); this.refresh(a); }
        break;
      }
      case 'tool_done': {
        const a = S.acts.get(ev.index);
        if (a) {
          if (a.state === 'running') a.state = ev.clean ? 'done' : 'error';
          if (ev.tool === 'delete_items' && ev.summary) a.title = 'Deleted items';
          if (!ev.clean && ev.summary?.startsWith('Could not')) a.detail = ev.summary;
          this.refresh(a);
        }
        break;
      }
      case 'assembly': {
        const act = ev.action || {};
        const a = S.acts.get(ev.index);
        const names = Object.fromEntries(ev.doc.components.map((c) => [c.id, c.name]));
        if (a && act.kind === 'mate') {
          const m = ev.doc.mates.find((x) => x.id === act.mate);
          const st = ev.result.mates.find((x) => x.id === act.mate);
          a.title = `${m?.name}: ${(m?.refs || []).map((r) => names[r.component] || r.ref).join(' to ')}`;
          a.icon = mateIconFor(m?.type);
          a.detail = '';
          if (st?.state === 'error') { a.state = 'error'; a.detail = st.message; }
          this.refresh(a);
        } else if (a && act.kind === 'insert') {
          const c = ev.doc.components.find((x) => x.id === act.component);
          const rc = ev.result.components.find((x) => x.id === act.component);
          a.title = `${act.new === false ? 'Moved' : 'Inserted'} ${c?.name || act.component}`; a.icon = 'insertcomp';
          a.detail = rc?.state === 'fixed' ? 'fixed' : '';
          this.refresh(a);
        }
        S.proposal = ev.doc;
        app.live.push(ev);
        break;
      }
      case 'interference': {
        const a = S.acts.get(ev.index);
        if (a) { a.title = ev.items.length ? `${ev.items.length} interference(s) found` : 'No interferences'; a.state = ev.items.length ? 'error' : 'done'; this.refresh(a); }
        app.live.push(ev);
        break;
      }
      case 'proposal': S.proposal = ev.doc; break;
      case 'request_file': {
        const a = S.acts.get(ev.index);
        if (a) { a.title = 'Asked for ' + (ev.mcmaster ? 'McMaster ' + ev.mcmaster : 'a STEP file'); a.state = 'done'; this.refresh(a); }
        this.add({ role: 'request', ...ev });
        break;
      }
      case 'web_query': {
        const a = S.acts.get(ev.index);
        if (a) { a.detail = ev.query || (ev.url ? hostOf(ev.url) + new URL(ev.url, 'http://x').pathname.replace(/\/$/, '') : ''); this.refresh(a); }
        app.live.hint(ev.tool === 'web_fetch' ? 'Reading a page...' : 'Searching the web...');
        break;
      }
      case 'web_result': {
        const a = S.acts.get(ev.index);
        if (!a) break;
        const fetch = ev.tool === 'web_fetch';
        if (ev.error) {
          a.state = 'error';
          a.title = (fetch ? 'Could not read the page: ' : 'Search failed: ') + (WEB_ERRORS[ev.error] || ev.error.replace(/_/g, ' '));
        } else {
          a.state = 'done';
          a.title = fetch ? 'Read a page' : `Searched the web: ${ev.results.length} result${ev.results.length === 1 ? '' : 's'}`;
          if (fetch && ev.results[0]) a.detail = ev.results[0].title;
          else a.items = ev.results.slice(0, 5).map((r) => ({ label: r.title.length > 48 ? r.title.slice(0, 47) + '...' : r.title, icon: 'page' }));
        }
        this.refresh(a);
        break;
      }
      case 'note': break;
      case 'done': S.done = ev; break;
      case 'error': S.error = ev.message; break;
      default: break;
    }
  }

  // ---------------------------------------------------------------- other panes
  renderResources(body) {
    body.innerHTML = `<b>Getting started</b>
      <p>1. Select <i>Front Plane</i> in the FeatureManager tree and click <b>Sketch</b>.</p>
      <p>2. Draw with Line, Rectangle or Circle. Add <b>Smart Dimension</b>s until the status bar says <i>Fully Defined</i>.</p>
      <p>3. Exit the sketch and click <b>Extruded Boss/Base</b>.</p>
      <p>4. Select edges and click <b>Fillet</b>.</p>
      <b>Mouse</b><p>Middle drag: rotate. Ctrl + middle drag: pan. Wheel: zoom. Alt + left drag also rotates (trackpads).</p>`;
    const b = h('button', 'btn', 'Keyboard shortcuts'); b.onclick = () => this.app.shortcutsDialog();
    body.appendChild(b);
  }

  renderAppearance(body) {
    body.appendChild(h('div', null, '<b>Part color</b>'));
    const grid = h('div'); grid.style.cssText = 'display:grid;grid-template-columns:repeat(6,36px);gap:6px;margin:8px 0';
    for (const c of COLORS) {
      const s = h('div'); s.style.cssText = `height:30px;background:${c};border:1px solid #999;cursor:pointer`;
      s.title = c;
      s.onclick = () => this.app.setAppearance(c);
      grid.appendChild(s);
    }
    body.appendChild(grid);
    const inp = h('input'); inp.type = 'color'; inp.value = this.app.doc.appearance || '#b9c0c8';
    inp.oninput = () => this.app.setAppearance(inp.value);
    body.appendChild(inp);
    body.appendChild(h('div', null, '<br><b>Scene</b>'));
    for (const [n, bg] of [['Plain White', '#ffffff'], ['Grey Gradient', 'linear-gradient(#f4f4f4,#b8b8b8)'], ['Studio (default)', '']]) {
      const b = h('button', 'btn', n); b.style.margin = '4px 4px 0 0';
      b.onclick = () => { document.getElementById('graphics').style.background = bg; };
      body.appendChild(b);
    }
  }

  renderProps(body) {
    const d = this.app.doc;
    const row = (label, value, set) => {
      const r = h('div', 'pm-row'); r.style.marginBottom = '6px';
      r.appendChild(h('label', null, label)).style.width = '90px';
      const i = h('input'); i.type = 'text'; i.value = value; i.style.cssText = 'flex:1;height:22px;border:1px solid #c8c8c8;padding:0 4px';
      i.addEventListener('keydown', (e) => e.stopPropagation());
      i.onchange = () => set(i.value);
      r.appendChild(i); body.appendChild(r);
    };
    row('Part name', d.name, (v) => this.app.commit('Rename part', () => { this.app.doc.name = v || 'Part1'; }, false));
    row('Description', d.description || '', (v) => this.app.commit('Description', () => { this.app.doc.description = v; }, false));
    row('Designer', d.designer || '', (v) => this.app.commit('Designer', () => { this.app.doc.designer = v; }, false));
    const b = h('button', 'btn', 'Edit Material...'); b.onclick = () => this.app.materialDialog();
    body.appendChild(b);
  }
}
