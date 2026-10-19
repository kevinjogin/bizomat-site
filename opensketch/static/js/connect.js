// Connect AI: the two ways to use AI with OpenSketch, in one dialog.
//
//  1. "Your AI app": ChatGPT, Claude, Codex, Cursor, VS Code... drive OpenSketch through its MCP address
//     (the subscription you already pay for; nothing to paste into OpenSketch). The address is the same for
//     everyone (<site>/mcp): the app signs in to OpenSketch once (OAuth) and sees only that person's Files.
//     The older private address (/mcp/<key>) stays as a fallback for apps that cannot sign in.
//  3. "SOLIDWORKS": the same AI app builds in SOLIDWORKS on your PC (sw_ tools) through the OpenSketch add-in,
//     which connects out to this server with a per-person SOLIDWORKS key (swbridge.py).
//  2. "Built-in AI": the OpenSketch AI pane with your own API key (Claude, OpenAI, Gemini, OpenRouter or
//     any OpenAI-compatible provider). The key goes to the server once and is stored encrypted on your
//     account; the page only ever gets back the provider, model and the last four characters.
//
// Client steps checked against each vendor's documentation in October 2026.

import { dialog, secretField } from './ui/dialogs.js';
import { FI } from './files.js';
import { refreshAIStatus } from './aikeys.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const t = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

async function json(url, opts) {
  const r = await fetch(url, { cache: 'no-store', ...opts });
  let j = {};
  try { j = await r.json(); } catch (_) { /* not JSON */ }
  if (!r.ok) throw new Error(j.error || j.detail || `HTTP ${r.status}`);
  return j;
}

function copyButton(get, label = 'Copy') {
  const b = h('button', 'btn cx-copy', `${FI.copy}<span>${label}</span>`);
  b.onclick = async () => {
    const v = get();
    try { await navigator.clipboard.writeText(v); } catch (_) {
      const ta = document.createElement('textarea'); ta.value = v; document.body.appendChild(ta); ta.select(); document.execCommand?.('copy'); ta.remove();
    }
    b.classList.add('done'); b.querySelector('span').textContent = 'Copied';
    setTimeout(() => { b.classList.remove('done'); b.querySelector('span').textContent = label; }, 1600);
  };
  return b;
}

function codeBlock(text, lang = '') {
  const w = h('div', 'cx-code');
  const pre = t('pre', null, text); pre.dataset.lang = lang;
  w.append(pre, copyButton(() => text));
  return w;
}

// ---------------------------------------------------------------- clients (MCP)
// Each: name, kind (app | code), mark (two letters on a tile), steps(url, signin) -> [text or {code, lang} or {copy}]
// signin: this server has sign-in, so the app signs in to OpenSketch once (OAuth, mcpauth.py) and stays connected.
const SIGNIN = 'Sign in and click Allow (once).';
// Kept short on purpose (YZ 2026-10-19: too much text). Each: name, optional one-click link, steps(url, signin).
const CLIENTS = [
  { id: 'claude', name: 'Claude',
    steps: (u, s) => [
      'Customize > Connectors > Add custom connector.',
      { text: 'Name it OpenSketch, with this address:', copy: u },
      s ? `Click Connect. ${SIGNIN}` : 'Click Add.',
    ] },
  { id: 'chatgpt', name: 'ChatGPT',
    steps: (u, s) => [
      'Settings > Apps & Connectors > Advanced settings: turn on Developer mode.',
      { text: 'Apps & Connectors > Create. Name it OpenSketch, with this URL:', copy: u },
      s ? `Authentication: OAuth. Click Create. ${SIGNIN}` : 'Authentication: none. Click Create.',
    ] },
  { id: 'claudecode', name: 'Claude Code',
    steps: (u, s) => [
      { code: `claude mcp add --transport http --scope user opensketch ${u}`, lang: 'shell' },
      ...(s ? [`Then /mcp > opensketch > Authenticate. ${SIGNIN}`] : []),
    ] },
  { id: 'codex', name: 'Codex',
    steps: (u, s) => [
      { code: `codex mcp add opensketch --url ${u}`, lang: 'shell' },
      ...(s ? [{ code: 'codex mcp login opensketch', lang: 'shell' }] : []),
    ] },
  { id: 'cursor', name: 'Cursor',
    link: (u) => ({ label: 'Add to Cursor', href: `cursor://anysphere.cursor-deeplink/mcp/install?name=opensketch&config=${encodeURIComponent(btoa(JSON.stringify({ url: u })))}` }),
    steps: (u, s) => [
      ...(s ? [`Then Cursor Settings > MCP > sign in next to opensketch. ${SIGNIN}`] : []),
    ] },
  { id: 'vscode', name: 'VS Code',
    link: (u) => ({ label: 'Add to VS Code', href: `vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: 'opensketch', type: 'http', url: u }))}` }),
    steps: (u, s) => [
      ...(s ? [`When VS Code asks, ${SIGNIN.toLowerCase()}`] : []),
    ] },
  { id: 'gemini', name: 'Gemini CLI',
    steps: (u, s) => [
      { code: `gemini mcp add --transport http -s user opensketch ${u}`, lang: 'shell' },
      ...(s ? [{ code: '/mcp auth opensketch', lang: 'shell' }] : []),
    ] },
  { id: 'other', name: 'Other',
    steps: (u, s) => [
      { text: 'Add a remote MCP server with this address:', copy: u },
      s ? 'Authentication: OAuth.' : 'Authentication: none.',
    ] },
];

function clientPane(c, info) {
  const u = info.url || info.mcp_url;
  const box = h('div', 'cx-client');
  if (c.link) {
    const head = h('div', 'cx-chead');
    const l = c.link(u); const a = h('a', 'btn primary fv-pill', `<span>${l.label}</span>${FI.arrow}`); a.href = l.href; head.appendChild(a);
    box.appendChild(head);
  }
  const ol = h('ol', 'cx-steps');
  for (const s of c.steps(u, info.signin !== false)) {
    const li = document.createElement('li');
    if (typeof s === 'string') li.appendChild(t('span', null, s));
    else {
      if (s.text) li.appendChild(t('span', null, s.text));
      if (s.copy) { const row = h('div', 'cx-url'); const inp = h('input'); inp.readOnly = true; inp.value = s.copy; inp.onfocus = () => inp.select(); row.append(inp, copyButton(() => s.copy)); li.appendChild(row); }
      if (s.code) li.appendChild(codeBlock(s.code, s.lang));
      if (!s.text && !s.copy && !s.code) continue;
      if (!s.text) li.classList.add('bare');
    }
    ol.appendChild(li);
  }
  box.appendChild(ol);
  return box;
}

function appTab(app, info) {
  const wrap = h('div', 'cx-pane');
  const warn = [];
  if (!info.password_set && !info.accounts) warn.push('This server has no sign-in. Anyone with its address can use it. Set OPENSKETCH_PASSWORD where it runs, then restart it.');
  if (info.codespace) warn.push('Codespaces: make port 8000 public (Ports tab, right-click, Port Visibility > Public) or the AI cannot reach it.');
  if (/^http:\/\/(127\.|localhost)/.test(info.url || info.mcp_url)) warn.push('This address is on your own computer. ChatGPT and Claude on the web cannot reach it; desktop tools like Claude Code, Codex and Cursor can.');
  for (const w of warn) wrap.appendChild(t('div', 'cx-warn', w));
  const grid = h('div', 'cx-clients'); grid.setAttribute('role', 'tablist');
  const detail = h('div', 'cx-detail');
  let cur = null;
  const pick = (c) => {
    cur = c;
    try { localStorage.setItem('opensketch.connect.client', c.id); } catch (_) { /* */ }
    grid.querySelectorAll('.cx-chip').forEach((b) => { b.classList.toggle('on', b.dataset.id === c.id); b.setAttribute('aria-selected', b.dataset.id === c.id); });
    detail.innerHTML = '';
    detail.appendChild(clientPane(c, info));
  };
  for (const c of CLIENTS) {
    const b = h('button', 'cx-chip', `<span>${c.name}</span>`);
    b.dataset.id = c.id; b.setAttribute('role', 'tab');
    b.onclick = () => pick(c);
    grid.appendChild(b);
  }
  wrap.append(grid, detail);
  const keyNote = h('div', 'cx-foot');
  if (info.signin === false) {
    keyNote.append(t('span', null, 'This server has no sign-in, so anyone with its address can use it.'));
  } else {
    const more = t('button', 'cx-link', 'App cannot sign in?');
    const priv = h('div', 'cx-private'); priv.hidden = true;
    priv.append(t('p', null, 'Use this private address instead. Keep it secret: it opens your Files.'));
    const row = h('div', 'cx-url'); const inp = h('input'); inp.readOnly = true; inp.value = info.mcp_url; inp.onfocus = () => inp.select();
    row.append(inp, copyButton(() => info.mcp_url)); priv.appendChild(row);
    more.onclick = () => { priv.hidden = !priv.hidden; };
    keyNote.append(more);
    wrap.append(keyNote, priv);
    return finish();
  }
  wrap.appendChild(keyNote);
  return finish();
  function finish() {
    let saved = null; try { saved = localStorage.getItem('opensketch.connect.client'); } catch (_) { /* */ }
    pick(CLIENTS.find((c) => c.id === saved) || CLIENTS[0]);
    return wrap;
  }
}

// ---------------------------------------------------------------- built-in AI (your own key)
function guessProvider(key, providers) {
  const k = (key || '').trim();
  for (const p of providers) if ((p.prefix || []).some((x) => x !== 'sk-' && k.startsWith(x))) return p.id;
  if (k.startsWith('sk-')) return 'openai';
  return null;
}

function keyTab(app, info, close) {
  const wrap = h('div', 'cx-pane');
  const cur = info.settings;
  const providers = info.providers;
  let prov = cur?.provider || 'anthropic';
  let models = [];
  let verified = false;
  let checking = 0;

  const status = h('div', 'cx-status');
  const drawStatus = () => {
    status.innerHTML = '';
    const s = app.aiInfo || {};
    let text, cls;
    if (info.early_access) { text = info.server_key ? 'AI is included with early access.' : 'AI is not available right now.'; cls = info.server_key ? 'ok' : 'none'; }
    else if (cur) { text = `Your ${providers.find((p) => p.id === cur.provider)?.label || cur.provider} key ${cur.hint}, ${cur.model}`; cls = 'ok'; }
    else if (info.server_key) { text = `Using the server's key (${s.model || 'claude'})`; cls = 'ok'; }
    else { text = 'No key yet'; cls = 'none'; }
    status.className = 'cx-status ' + cls;
    status.append(h('i', null, cls === 'ok' ? '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''), t('span', null, text));
    if (cur) {
      const rm = t('button', 'cx-link', 'Remove my key');
      rm.onclick = () => json('/api/ai/keys', { method: 'DELETE' }).then(() => { app.toast?.('Your key was removed.'); refreshAIStatus(app); close(); }, (e) => { err.textContent = e.message; });
      status.appendChild(rm);
    }
  };
  drawStatus();
  wrap.appendChild(status);
  if (info.early_access) return { el: wrap, focus: () => {} }; // testers use the owner's AI: no key form

  const cards = h('div', 'cx-provs'); cards.setAttribute('role', 'radiogroup'); cards.setAttribute('aria-label', 'Provider');
  for (const p of providers) {
    const b = h('button', 'cx-prov');
    b.dataset.id = p.id; b.setAttribute('role', 'radio');
    b.append(t('b', null, p.label));
    b.onclick = () => { setProv(p.id); key.focus(); };
    cards.appendChild(b);
  }
  wrap.appendChild(cards);

  const form = h('div', 'cx-form');
  const step1 = h('div', 'cx-row');
  step1.innerHTML = '<span class="cx-n">1</span>';
  const getKey = h('a', 'btn', `<span>Get a key</span>${FI.open}`); getKey.target = '_blank'; getKey.rel = 'noopener noreferrer';
  const where = t('span', 'cx-where');
  step1.append(getKey);

  const baseRow = h('div', 'cx-row cx-base');
  baseRow.innerHTML = '<span class="cx-n">+</span>';
  const base = h('input', 'acct-i'); base.placeholder = 'https://api.example.com/v1'; base.value = cur?.base_url || ''; base.setAttribute('aria-label', 'Provider address (base URL)'); base.spellcheck = false;
  baseRow.appendChild(base);

  const step2 = h('div', 'cx-row');
  step2.innerHTML = '<span class="cx-n">2</span>';
  const keyWrap = h('div', 'cx-keywrap');
  // a masked text field, not type=password: browsers treat any password field as a sign-in form and fill your
  // saved OpenSketch email and password into this dialog (and nearby fields)
  const key = h('input', 'acct-i cx-key os-secret'); key.type = 'text'; secretField(key); key.setAttribute('aria-label', 'API key');
  const eye = h('button', 'cx-eye', '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>');
  eye.title = 'Show or hide the key'; eye.type = 'button';
  eye.onclick = () => { const on = key.classList.toggle('shown'); eye.classList.toggle('on', on); };
  const badge = h('span', 'cx-badge');
  keyWrap.append(key, eye, badge);
  step2.appendChild(keyWrap);

  const step3 = h('div', 'cx-row');
  step3.innerHTML = '<span class="cx-n">3</span>';
  const model = h('select', 'acct-i cx-model'); model.setAttribute('aria-label', 'Model');
  const modelText = h('input', 'acct-i cx-model'); modelText.placeholder = 'Model name'; modelText.spellcheck = false; modelText.setAttribute('aria-label', 'Model');
  step3.append(model, modelText);
  const err = t('div', 'acct-err'); err.setAttribute('role', 'alert');
  form.append(step1, baseRow, step2, step3, err);
  wrap.appendChild(form);

  const spec = () => providers.find((p) => p.id === prov);
  const fillModels = (list, pickFirst) => {
    models = list;
    model.innerHTML = '';
    const want = (cur && cur.provider === prov && cur.model) || spec().model || '';
    const ids = [...new Set([...(want ? [want] : []), ...list])];
    for (const m of ids) { const o = t('option', null, m); o.value = m; model.appendChild(o); }
    const useSelect = ids.length > 0;
    model.hidden = !useSelect; modelText.hidden = useSelect;
    if (useSelect) model.value = pickFirst && !want ? ids[0] : (want || ids[0]);
  };
  const setBadge = (state, text) => { badge.className = 'cx-badge ' + state; badge.textContent = text || ''; };
  function setProv(id, keepKey = true) {
    prov = id;
    const p = spec();
    cards.querySelectorAll('.cx-prov').forEach((b) => { b.classList.toggle('on', b.dataset.id === id); b.setAttribute('aria-checked', b.dataset.id === id); });
    baseRow.hidden = id !== 'custom';
    getKey.hidden = !p.keys_url; if (p.keys_url) getKey.href = p.keys_url;
    where.textContent = p.keys_url ? `${p.keys}. Copy the key.` : `Get a key from ${p.keys}.`;
    const same = cur && cur.provider === id;
    key.placeholder = same ? `Saved key ${cur.hint}` : `Paste your ${p.label} key`;
    if (!keepKey) key.value = '';
    verified = !!same; err.textContent = '';
    setBadge(same ? 'ok' : '', same ? 'Saved' : '');
    if (same) fillModels([cur.model], false);
    else if (p.model) fillModels([p.model], true);
    else { model.innerHTML = ''; model.hidden = true; modelText.hidden = false; modelText.value = ''; modelText.placeholder = 'Paste the key to list the models'; }
  }

  let timer = null;
  const check = async () => {
    const k = key.value.trim();
    const p = spec();
    if (!k && !(cur && cur.provider === prov)) { setBadge('', ''); return; }
    if (prov === 'custom' && !base.value.trim()) { setBadge('', ''); err.textContent = 'Enter the provider address first.'; return; }
    const n = ++checking;
    setBadge('busy', 'Checking'); err.textContent = '';
    try {
      const r = await json('/api/ai/models', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ provider: prov, key: k || null, base_url: base.value.trim() || null }) });
      if (n !== checking) return;
      verified = true;
      setBadge('ok', 'Key works');
      fillModels(r.models, !p.model);
    } catch (e) {
      if (n !== checking) return;
      verified = false; setBadge('bad', 'Not accepted'); err.textContent = e.message;
    }
  };
  key.addEventListener('input', () => {
    const g = guessProvider(key.value, providers);
    if (g && g !== prov && !(prov === 'custom')) setProv(g, true);
    verified = false; setBadge('', '');
    clearTimeout(timer);
    if (key.value.trim().length >= 20) timer = setTimeout(check, 450);
  });
  key.addEventListener('paste', () => setTimeout(() => { clearTimeout(timer); check(); }, 0));
  base.addEventListener('change', () => { if (key.value.trim()) check(); });
  for (const i of [key, base, modelText]) i.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') save(); });

  const save = () => {
    err.textContent = '';
    const m = (model.hidden ? modelText.value : model.value).trim();
    if (!key.value.trim() && !(cur && cur.provider === prov)) { err.textContent = 'Paste your API key first.'; key.focus(); return; }
    if (!m) { err.textContent = 'Choose a model.'; return; }
    saveBtn.disabled = true; saveBtn.textContent = 'Saving...';
    json('/api/ai/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: prov, model: m, key: key.value.trim() || null, base_url: base.value.trim() || null }) })
      .then((r) => { close(); app.toast?.(`AI set to ${spec().label}, ${r.settings.model}.`); refreshAIStatus(app); },
        (e) => { err.textContent = e.message; saveBtn.disabled = false; saveBtn.textContent = 'Save'; });
  };
  const foot = h('div', 'cx-actions');
  const note = t('span', 'cx-fine', 'Stored encrypted.');
  const saveBtn = h('button', 'btn primary fv-pill', 'Save');
  saveBtn.onclick = save;
  foot.append(note, saveBtn);
  wrap.appendChild(foot);
  setProv(prov);
  return { el: wrap, focus: () => key.focus() };
}

// ---------------------------------------------------------------- SOLIDWORKS (the add-in on your PC)
function swTab(sw) {
  const wrap = h('div', 'cx-pane');
  const state = t('div', 'cx-warn', '');
  const paint = (st) => {
    if (st && st.connected) {
      state.className = 'cx-ok';
      state.textContent = `Connected: ${st.machine || 'PC'}` + (st.working_on ? `, working on ${st.working_on.op}` : '');
    } else {
      state.className = 'cx-warn';
      state.textContent = 'Not connected' + (st && st.note ? `. ${st.note}` : '');
    }
  };
  paint(sw.status);
  wrap.appendChild(state);
  const ol = h('ol', 'cx-steps');
  const li = (...kids) => { const x = document.createElement('li'); x.append(...kids); ol.appendChild(x); return x; };
  if (sw.download) {
    const a = h('a', 'btn primary fv-pill', `<span>Download the add-in</span>${FI.arrow}`);
    a.href = '/api/sw/download';
    li(t('span', null, 'On the SOLIDWORKS PC, download and unzip it.'), a);
  } else {
    li(t('span', null, 'The add-in is not on this server yet.'));
  }
  li(t('span', null, 'Run OpenSketchSW.exe > Install for me.'));
  li(t('span', null, 'In SOLIDWORKS: OpenSketch > Connect. (No menu? Tools > Macro > Run > Documents\\OpenSketch\\OpenSketch.swb)'));
  const addr = h('div', 'cx-url'); const ai = h('input'); ai.readOnly = true; ai.value = sw.server; ai.onfocus = () => ai.select();
  addr.append(ai, copyButton(() => sw.server));
  li(t('span', null, 'Address:'), addr);
  const keyRow = h('div', 'cx-url'); const ki = h('input'); ki.readOnly = true; ki.type = 'password'; ki.value = sw.key; ki.onfocus = () => ki.select();
  const showBtn = t('button', 'btn', 'Show'); showBtn.onclick = () => { ki.type = ki.type === 'password' ? 'text' : 'password'; showBtn.textContent = ki.type === 'password' ? 'Show' : 'Hide'; };
  keyRow.append(ki, showBtn, copyButton(() => ki.value));
  li(t('span', null, 'Key (keep it private):'), keyRow);
  li(t('span', null, 'First time: ask Claude to "run the SOLIDWORKS self test".'));
  wrap.appendChild(ol);
  const foot = h('div', 'cx-foot');
  const renew = t('button', 'cx-link', 'New key');
  renew.onclick = async () => {
    try { const r = await json('/api/sw/key', { method: 'POST' }); ki.value = r.key; paint({ connected: false, note: 'Paste the new key in SOLIDWORKS.' }); } catch (e) { state.textContent = String(e.message || e); }
  };
  foot.append(t('span', null, 'Log: %LOCALAPPDATA%\\OpenSketch\\SolidWorks\\log.txt'), renew);
  wrap.appendChild(foot);
  const timer = setInterval(async () => {
    if (!wrap.isConnected) { clearInterval(timer); return; }
    try { paint((await json('/api/sw')).status); } catch (_) { /* offline */ }
  }, 3000);
  return wrap;
}

// ---------------------------------------------------------------- dialog
export async function connectDialog(app, tab = null) {
  let info, keys, sw;
  try { [info, keys, sw] = await Promise.all([json('/api/connect'), json('/api/ai/keys'), json('/api/sw')]); } catch (e) {
    dialog({ title: 'Connect AI', body: t('div', null, String(e.message || e)), buttons: [{ label: 'OK', primary: true }] });
    return;
  }
  const body = h('div', 'cx');
  const hero = h('div', 'cx-hero');
  hero.innerHTML = '<div><h2>Connect AI</h2></div>';
  const tabs = h('div', 'cx-tabs'); tabs.setAttribute('role', 'tablist');
  const tA = h('button', 'cx-tab', '<b>AI app</b>');
  const tB = h('button', 'cx-tab', '<b>API key</b>');
  const tC = h('button', 'cx-tab', '<b>SOLIDWORKS</b>');
  tabs.append(tA, tB, tC);
  const panes = h('div', 'cx-panes');
  body.append(hero, tabs, panes);
  const d = dialog({ title: 'Connect AI', body, cls: 'cx-dlg', buttons: [] });
  const A = appTab(app, info);
  const B = keyTab(app, keys, () => d.close());
  const C = swTab(sw);
  const show = (which) => {
    try { localStorage.setItem('opensketch.connect.tab', which); } catch (_) { /* */ }
    tA.classList.toggle('on', which === 'app'); tB.classList.toggle('on', which === 'key'); tC.classList.toggle('on', which === 'sw');
    tA.setAttribute('aria-selected', which === 'app'); tB.setAttribute('aria-selected', which === 'key'); tC.setAttribute('aria-selected', which === 'sw');
    panes.innerHTML = ''; panes.appendChild(which === 'app' ? A : which === 'sw' ? C : B.el);
    if (which === 'key') setTimeout(() => B.focus(), 30);
    // keep the dialog on screen as its height changes
    const r = d.el.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 8) d.el.style.top = Math.max(8, window.innerHeight - r.height - 8) + 'px';
  };
  tA.onclick = () => show('app'); tB.onclick = () => show('key'); tC.onclick = () => show('sw');
  let saved = null; try { saved = localStorage.getItem('opensketch.connect.tab'); } catch (_) { /* */ }
  show(tab || saved || 'app');
  d.el.style.top = Math.max(8, (window.innerHeight - d.el.getBoundingClientRect().height) / 2.6) + 'px';
}
