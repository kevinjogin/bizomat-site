"""The CADOS dashboard (/dashboard; also / and /solidworks for a signed-in person): everything a person needs to set
up and use CADOS. Five setup steps (install, activate in SOLIDWORKS, connect the AI assistant, verify, self test), the
live connection state, their computers and connected assistants, the connector and private addresses, the add-in key.

Server-rendered shell on the shared design system (brand.py, static/ui/cados.css); the page script reads
/api/solidworks and /api/devices and keeps the state fresh while the page is open. Every control calls the same API
as before: /api/sw/key, /api/connect/new_address, /api/account/apps/<id>, /api/devices/<id>, /api/sw/download.
"""

from __future__ import annotations

from . import brand
from .brand import icon

BODY = """<main class="app-main" id="main"><div class="container">
<div class="page-head"><div><h1>Dashboard</h1><p>Set up CADOS and check your connection to SOLIDWORKS.</p></div>
<div class="status" id="state" data-state="checking" role="status" aria-live="polite"><span class="dot"></span><span id="state-t">Checking connection</span></div></div>
<div class="callout callout-err" id="err" role="alert" hidden></div>
<div class="callout callout-warn" id="update" hidden style="margin-bottom:var(--s-5)"></div>
<div class="app-grid"><div>
<div class="card card-pad progress" style="margin-bottom:var(--s-4)"><div class="progress-text"><b id="prog-t">Setup</b><span id="prog-n">0 of 5 complete</span></div>
<div class="progress-bar" role="progressbar" aria-labelledby="prog-t" aria-valuemin="0" aria-valuemax="5" aria-valuenow="0" id="prog"><i id="prog-bar"></i></div></div>
<div class="setup">

<section class="setup-step" id="s-install" aria-labelledby="h-install"><header><span class="num">1</span><div class="head-text">
<h2 id="h-install">Install CADOS for SOLIDWORKS</h2><p>Run the installer on the Windows computer that runs SOLIDWORKS. It adds the CADOS add-in to SOLIDWORKS.</p></div>
<span class="step-state badge" data-for="s-install">To do</span></header>
<div class="body"><div class="actions"><a class="btn btn-primary" id="bridge-dl" href="/download/solidworks">__DOWNLOAD_ICON__Download CADOS for SOLIDWORKS</a>
<span class="small muted">Windows installer (.msi): the CADOS add-in and the KEVOS Companion.</span></div>
<div class="actions small"><a href="/docs#install">Installation guide</a><a href="/docs#requirements">System requirements</a><a href="/docs#versions">Supported SOLIDWORKS versions</a></div>
<details class="disclosure"><summary>Manual installation, without the installer</summary><div class="disclosure-body">
<p>For development, or where you cannot run the installer. The package holds the same CADOS add-in, installed for your Windows user only, and links one SOLIDWORKS session directly, without the KEVOS Companion.</p>
<ol style="margin-top:var(--s-3)"><li>Download the add-in package and unzip it on the SOLIDWORKS computer.</li><li>Run the setup program in the folder and choose <b>Install for me</b>.</li>
<li>Continue with the direct link in step 2.</li></ol>
<div class="actions" style="margin-top:var(--s-3)"><a class="btn btn-secondary btn-sm" id="download" href="/api/sw/download">Download add-in package (.zip)</a></div>
<p class="small" id="no-download" hidden style="margin-top:var(--s-2);color:var(--err)">The add-in package is not on this server yet.</p></div></details></div></section>

<section class="setup-step" id="s-connect" aria-labelledby="h-connect"><header><span class="num">2</span><div class="head-text">
<h2 id="h-connect">Open SOLIDWORKS and activate CADOS</h2><p>Pair the computer when the KEVOS Companion asks, then open SOLIDWORKS. The CADOS tab and task pane show the link.</p></div>
<span class="step-state badge" data-for="s-connect">To do</span></header>
<div class="body"><div><div class="field-label" style="margin-bottom:var(--s-2)">Your computers</div>
<ul class="rows" id="pcs" aria-label="Your computers"></ul>
<p class="small muted" id="no-pcs">No computer paired yet. After installing, the KEVOS Companion opens a pairing window. You confirm its code on this site.</p></div>
<details class="disclosure"><summary>Direct link, without the Companion</summary><div class="disclosure-body">
<p>In SOLIDWORKS, open <b>CADOS &gt; Status</b> and paste these two values.</p>
<div class="field" style="margin-top:var(--s-3)"><label class="field-label" for="server">Service address</label>
<div class="input-group"><input class="input" id="server" readonly><button class="btn" type="button" data-copy="server">Copy</button></div></div>
<div class="field"><label class="field-label" for="key">Add-in key</label>
<div class="input-group"><input class="input" id="key" type="password" readonly autocomplete="off" aria-describedby="key-hint">
<button class="btn" type="button" id="show" aria-controls="key" aria-pressed="false">Show</button><button class="btn" type="button" data-copy="key">Copy</button></div>
<span class="field-hint" id="key-hint">Private to you. Making a new key disconnects the direct link until you paste the new one.</span></div>
<div class="actions" style="margin-top:var(--s-3)"><button class="link-btn danger small" type="button" id="newkey">Make a new key</button></div>
<p class="small muted" style="margin-top:var(--s-3)">No CADOS menu? Open Tools &gt; Add-Ins and tick CADOS. Where SOLIDWORKS does not list add-ins installed without administrator rights, the manual package also writes a launcher macro that only starts the CADOS add-in: Tools &gt; Macro &gt; Run, then <code>Documents\\OpenSketch\\OpenSketch.swb</code>.</p>
</div></details></div></section>

<section class="setup-step" id="s-ai" aria-labelledby="h-ai"><header><span class="num">3</span><div class="head-text">
<h2 id="h-ai">Connect your AI assistant</h2><p>Add this connector address to your assistant, then sign in to CADOS when it asks.</p></div>
<span class="step-state badge" data-for="s-ai">To do</span></header>
<div class="body"><div class="field"><label class="field-label" for="url">Connector address</label>
<div class="input-group"><input class="input" id="url" readonly><button class="btn" type="button" data-copy="url">Copy</button></div></div>
<div><div class="tabs" role="tablist" aria-label="Instructions for your assistant">
<button type="button" role="tab" id="t-claude" aria-selected="true" aria-controls="p-claude">Claude</button>
<button type="button" role="tab" id="t-chatgpt" aria-selected="false" aria-controls="p-chatgpt" tabindex="-1">ChatGPT</button>
<button type="button" role="tab" id="t-other" aria-selected="false" aria-controls="p-other" tabindex="-1">Other assistants</button></div>
<div class="tab-panel small" role="tabpanel" id="p-claude" aria-labelledby="t-claude" style="margin-top:var(--s-3)"><ol>
<li>Open Settings &gt; Connectors and choose <b>Add custom connector</b>.</li><li>Name it CADOS and paste the connector address.</li>
<li>Choose Connect, sign in to CADOS and choose <b>Allow</b>.</li></ol></div>
<div class="tab-panel small" role="tabpanel" id="p-chatgpt" aria-labelledby="t-chatgpt" hidden style="margin-top:var(--s-3)"><ol>
<li>Where your plan allows custom connectors, add a new connector.</li><li>Paste the connector address.</li>
<li>Sign in to CADOS when asked and choose <b>Allow</b>. Your workspace administrator may need to allow custom connectors first.</li></ol></div>
<div class="tab-panel small" role="tabpanel" id="p-other" aria-labelledby="t-other" hidden style="margin-top:var(--s-3)">
<p>Any app that supports remote MCP servers over Streamable HTTP can use the connector address. If it cannot sign in, use the private address below.</p></div></div>
<div><div class="field-label" style="margin-bottom:var(--s-2)">Connected assistants</div>
<ul class="rows" id="apps" aria-label="Connected AI assistants"></ul><p class="small muted" id="no-apps">None yet. An assistant appears here after you choose Allow.</p></div>
<details class="disclosure" id="private"><summary>Assistant cannot sign in?</summary><div class="disclosure-body">
<p>Use this private address instead. It works without sign-in, so anyone who has it can use your CAD connection. Keep it to yourself.</p>
<div class="field" style="margin-top:var(--s-3)"><label class="field-label" for="purl">Private address</label>
<div class="input-group"><input class="input" id="purl" type="password" readonly autocomplete="off">
<button class="btn" type="button" id="showp" aria-controls="purl" aria-pressed="false">Show</button><button class="btn" type="button" data-copy="purl">Copy</button></div></div>
<div class="actions" style="margin-top:var(--s-3)"><button class="link-btn danger small" type="button" id="newaddr">Make a new private address</button></div></div></details></div></section>

<section class="setup-step" id="s-verify" aria-labelledby="h-verify"><header><span class="num">4</span><div class="head-text">
<h2 id="h-verify">Verify the connection</h2><p>Both parts must be connected. This updates by itself every few seconds.</p></div>
<span class="step-state badge" data-for="s-verify">To do</span></header>
<div class="body"><ul class="rows" aria-label="Connection checks">
<li><span class="dot" id="v-cad-dot"></span><div class="row-main"><span class="row-title">SOLIDWORKS link</span><span class="row-sub" id="v-cad">Checking</span></div></li>
<li><span class="dot" id="v-ai-dot"></span><div class="row-main"><span class="row-title">AI assistant</span><span class="row-sub" id="v-ai">Checking</span></div></li></ul>
<div><p class="small" style="margin-bottom:var(--s-2)">Then ask your assistant:</p>
<div class="prompt"><span id="verify-prompt">Check the CADOS connection to SOLIDWORKS.</span><button class="btn btn-secondary btn-sm" type="button" data-copy-text="verify-prompt">Copy</button></div></div></div></section>

<section class="setup-step" id="s-try" aria-labelledby="h-try"><header><span class="num">5</span><div class="head-text">
<h2 id="h-try">Run the guided self test</h2><p>Checks sketches, features, an assembly and a drawing on this computer, step by step.</p></div>
<span class="step-state badge" data-for="s-try">To do</span></header>
<div class="body"><div class="prompt"><span id="prompt">Run the SOLIDWORKS self test, all three stages.</span><button class="btn btn-secondary btn-sm" type="button" data-copy-text="prompt">Copy</button></div>
<p class="small muted">The assistant reports each step as ok, check or failed, with the reason. Test files go in a selftest folder under your Documents.</p>
<div class="actions"><button class="btn btn-secondary btn-sm" type="button" id="tried">Mark as done</button></div></div></section>
</div></div>

<aside class="app-side" aria-label="Summary">
<section class="card"><div class="card-head"><h3>Connection</h3></div><div class="card-pad kv">
<div class="kv-row"><span class="k">SOLIDWORKS</span><span class="v" id="kv-sw">Checking</span></div>
<div class="kv-row"><span class="k">Computer</span><span class="v" id="kv-pc">None</span></div>
<div class="kv-row"><span class="k">Activity</span><span class="v" id="kv-work">Idle</span></div>
<div class="kv-row"><span class="k">AI assistants</span><span class="v" id="kv-ai">None</span></div></div></section>
<section class="card"><div class="card-head"><h3>Need help?</h3><a class="small" href="/docs#troubleshooting">All answers</a></div><div class="card-pad" style="padding-top:0">
<details class="disclosure" style="border-top:0"><summary>SOLIDWORKS shows no CADOS tab</summary><div class="disclosure-body small">Open Tools &gt; Add-Ins and tick CADOS under Active and Start Up. Do not run SOLIDWORKS as administrator.</div></details>
<details class="disclosure"><summary>The computer shows Offline</summary><div class="disclosure-body small">Check that the KEVOS Companion runs (tray icon) and that this site opens in a browser on that computer. Behind a company proxy, allow this address.</div></details>
<details class="disclosure"><summary>The assistant cannot sign in</summary><div class="disclosure-body small">Remove the connector in your assistant and add it again. If it still fails, use the private address in step 3.</div></details>
<details class="disclosure"><summary>The assistant reports a dialog or open sketch</summary><div class="disclosure-body small">Close the dialog or exit the sketch in SOLIDWORKS, then ask again.</div></details>
</div></section>
<p class="small muted">Signed in as <span id="who-side">you</span>. <a href="/docs">Documentation</a> &middot; <a href="/privacy">Privacy</a></p>
</aside></div></div></main>"""

SCRIPT = r"""<script>
(() => {
  const $ = (id) => document.getElementById(id);
  const err = (m) => { const e = $('err'); e.textContent = m || ''; e.hidden = !m; };
  let authFailed = false;
  async function api(path, opts) {
    const r = await fetch(path, Object.assign({ headers: { Accept: 'application/json' }, credentials: 'same-origin' }, opts || {}));
    if (r.status === 401) { authFailed = true; setState('auth', 'Authentication required'); location.href = '/login?next=' + encodeURIComponent(location.pathname); throw new Error('Sign in to continue.'); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.detail || ('Request failed (' + r.status + ').'));
    return j;
  }
  function setState(kind, text) { $('state').dataset.state = kind; $('state-t').textContent = text; }
  function swYear(v) { const m = /^(\d+)\./.exec(v || ''); return m && +m[1] > 20 ? 'SOLIDWORKS ' + (+m[1] + 1992) : 'SOLIDWORKS'; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { return null; } }

  let last = { status: null, apps: [], devices: [] };
  function render() {
    const st = last.status || {}; const on = !!st.connected; const devs = last.devices || []; const apps = last.apps || [];
    const online = devs.filter((d) => d.online);
    // the overall state
    if (on) setState('connected', st.ambiguous ? 'Connected: ' + st.machine : 'Connected: ' + swYear(st.sw_version) + (st.machine ? ' on ' + st.machine : ''));
    else if (devs.length) setState('disconnected', online.length ? 'Disconnected: SOLIDWORKS is not open' : 'Disconnected: computer offline');
    else setState('install', 'Installation required');
    // the update notice
    const up = $('update'); up.hidden = !st.update_needed; up.textContent = st.update_needed || '';
    // the summary
    $('kv-sw').textContent = on ? (st.ambiguous ? 'Several computers' : swYear(st.sw_version)) : 'Not connected';
    $('kv-pc').textContent = on && st.machine ? st.machine : (devs.length ? devs.length + (devs.length > 1 ? ' paired, ' : ' paired, ') + online.length + ' online' : 'None paired');
    $('kv-work').textContent = st.working_on ? 'Working (' + st.working_on.op + ')' : (on ? 'Ready' : 'Idle');
    $('kv-ai').textContent = apps.length ? apps.map((a) => a.name).join(', ') : 'None connected';
    // the verify step
    const dot = (id, ok) => { $(id).style.background = ok ? 'var(--ok)' : 'var(--idle)'; };
    $('v-cad').textContent = on ? 'Connected' + (st.machine ? ' to ' + st.machine : '') : (devs.length ? 'Disconnected. Open SOLIDWORKS on a paired computer.' : 'Not installed yet');
    $('v-ai').textContent = apps.length ? 'Connected: ' + apps.map((a) => a.name).join(', ') : 'No assistant connected yet';
    dot('v-cad-dot', on); dot('v-ai-dot', apps.length > 0);
    // the steps
    const tried = store('cados.selftest') === '1';
    const done = { 's-install': devs.length > 0 || on, 's-connect': on, 's-ai': apps.length > 0, 's-verify': on && apps.length > 0, 's-try': tried };
    const order = ['s-install', 's-connect', 's-ai', 's-verify', 's-try'];
    const current = order.find((k) => !done[k]);
    let n = 0;
    for (const k of order) {
      const el = $(k); el.classList.toggle('is-done', !!done[k]); el.classList.toggle('is-current', k === current);
      if (done[k]) n++;
      const b = document.querySelector('.step-state[data-for="' + k + '"]');
      b.textContent = done[k] ? 'Done' : (k === current ? 'Next' : 'To do');
      b.className = 'step-state badge' + (done[k] ? ' badge-ok' : (k === current ? ' badge-brand' : ''));
    }
    $('prog-n').textContent = n + ' of 5 complete'; $('prog-bar').style.width = (n * 20) + '%'; $('prog').setAttribute('aria-valuenow', n);
    $('prog-t').textContent = n === 5 ? 'Setup complete' : 'Setup';
    $('tried').textContent = tried ? 'Done' : 'Mark as done'; $('tried').classList.toggle('is-done', tried);
  }

  function row(title, sub, online) {
    const li = document.createElement('li');
    const d = document.createElement('span'); d.className = 'dot'; d.style.background = online ? 'var(--ok)' : 'var(--idle)';
    const m = document.createElement('div'); m.className = 'row-main';
    const t = document.createElement('span'); t.className = 'row-title'; t.textContent = title;
    const s = document.createElement('span'); s.className = 'row-sub'; s.textContent = sub;
    m.append(t, s); li.append(d, m);
    const a = document.createElement('div'); a.className = 'row-actions'; li.append(a);
    return [li, a];
  }
  function action(label, cls, aria, fn) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'link-btn ' + (cls || ''); b.textContent = label;
    if (aria) b.setAttribute('aria-label', aria); b.onclick = fn; return b;
  }
  let appsShown = '';
  function apps(list) {
    last.apps = list;
    const now = JSON.stringify(list);
    if (now === appsShown) return;  // redrawn only when it changed, so a focused button stays focused
    appsShown = now;
    const ul = $('apps'); ul.textContent = ''; $('no-apps').hidden = list.length > 0;
    for (const a of list) {
      const [li, act] = row(a.name, a.host || 'Connected', true);
      act.append(action('Disconnect', 'danger', 'Disconnect ' + a.name, async () => {
        if (!confirm('Disconnect ' + a.name + '? It loses access to CADOS until you connect it again.')) return;
        try { await api('/api/account/apps/' + encodeURIComponent(a.id), { method: 'DELETE' }); load(); } catch (e) { err(e.message); }
      }));
      ul.appendChild(li);
    }
  }
  let pcsShown = '';
  function pcs(list) {
    last.devices = list;
    const now = JSON.stringify(list);
    if (now === pcsShown) return;
    pcsShown = now;
    const ul = $('pcs'); ul.textContent = ''; $('no-pcs').hidden = list.length > 0;
    for (const d of list) {
      const sw = (d.solidworks || []).map((i) => i.solidworks + (i.busy ? ', working' : '')).join(', ');
      const [li, act] = row(d.name + (d.default ? ' (default)' : ''), d.online ? (sw || 'Online, SOLIDWORKS closed') : 'Offline', d.online);
      if (!d.default) act.append(action('Make default', '', 'Make ' + d.name + ' the default computer', async () => {
        try { await api('/api/devices/' + encodeURIComponent(d.id), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ default: true }) }); pcsShown = ''; loadPcs(); } catch (e) { err(e.message); }
      }));
      act.append(action('Remove', 'danger', 'Remove ' + d.name, async () => {
        if (!confirm('Remove ' + d.name + '? It stops taking commands at once. To use it again, pair it again from its KEVOS Companion.')) return;
        try { await api('/api/devices/' + encodeURIComponent(d.id), { method: 'DELETE' }); pcsShown = ''; loadPcs(); } catch (e) { err(e.message); }
      }));
      ul.appendChild(li);
    }
  }
  async function loadPcs() { try { pcs((await api('/api/devices')).devices || []); render(); } catch (_) { /* shown on the next check */ } }
  function take(d) { last.status = d.status || {}; apps(d.apps || []); pcs((d.status && d.status.devices) || []); render(); }
  async function load() {
    try {
      const d = await api('/api/solidworks');
      const who = d.user ? (d.user.email || d.user.name || '') : '';
      if ($('who')) $('who').textContent = who; $('who-side').textContent = who || 'this server';
      if ($('signout')) $('signout').hidden = !d.signin;
      $('server').value = d.server; $('key').value = d.key; $('url').value = d.url; $('purl').value = d.private_url;
      $('private').hidden = !d.private_url;
      if (!d.download) { $('download').setAttribute('aria-disabled', 'true'); $('no-download').hidden = false; }
      take(d); err('');
    } catch (e) { if (!authFailed) { setState('error', 'Connection error'); err(e.message === 'Failed to fetch' ? 'This page cannot reach CADOS. Check your network; it retries by itself.' : e.message); } }
  }
  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); } catch (_) {
      const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (_) { /* nothing more to try */ } t.remove();
    }
    const was = btn.textContent; btn.textContent = 'Copied'; btn.classList.add('is-done');
    setTimeout(() => { btn.textContent = was; btn.classList.remove('is-done'); }, 1400);
  }
  document.querySelectorAll('[data-copy]').forEach((b) => { b.onclick = () => copy($(b.dataset.copy).value, b); });
  document.querySelectorAll('[data-copy-text]').forEach((b) => { b.onclick = () => copy($(b.dataset.copyText).textContent, b); });
  document.querySelectorAll('.input-group input').forEach((i) => { i.onfocus = () => i.select(); });
  function toggle(btnId, inputId) {
    $(btnId).onclick = () => { const k = $(inputId); const show = k.type === 'password'; k.type = show ? 'text' : 'password';
      $(btnId).textContent = show ? 'Hide' : 'Show'; $(btnId).setAttribute('aria-pressed', String(show)); };
  }
  toggle('show', 'key'); toggle('showp', 'purl');
  $('newkey').onclick = async () => {
    if (!confirm('Make a new add-in key? The old key stops working, so a direct link disconnects until you paste the new one.')) return;
    try { $('key').value = (await api('/api/sw/key', { method: 'POST' })).key; } catch (e) { err(e.message); }
  };
  $('newaddr').onclick = async () => {
    if (!confirm('Make a new private address? The old one stops working at once.')) return;
    try { $('purl').value = (await api('/api/connect/new_address', { method: 'POST' })).mcp_url; } catch (e) { err(e.message); }
  };
  $('tried').onclick = () => { store('cados.selftest', store('cados.selftest') === '1' ? '0' : '1'); render(); };
  // tabs (arrow keys move between them)
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function pick(t) {
    for (const x of tabs) { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !on; }
    t.focus();
  }
  tabs.forEach((t, i) => { t.onclick = () => pick(t); t.onkeydown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); pick(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]); } }; });
  let timer = null;
  const tick = async () => {
    try { take(await api('/api/solidworks')); if (!$('err').hidden && $('state').dataset.state !== 'error') err(''); }
    catch (e) { if (!authFailed) setState('error', 'Connection error'); }
  };
  const run = () => { clearInterval(timer); timer = document.hidden ? null : setInterval(tick, 3000); };
  document.addEventListener('visibilitychange', () => { run(); if (!document.hidden) tick(); });
  load(); run();
})();
</script>"""


def page(base: str = "") -> bytes:
    body = BODY.replace("__DOWNLOAD_ICON__", icon("download"))
    return (brand.head("Dashboard", path="/dashboard", base=base) + "<body>" + brand.header("dashboard", app=True)
            + body + SCRIPT + brand.MENU_SCRIPT + "</body></html>").encode()
