"""OpenSketch's home page (/, also /solidworks): everything a person needs to use the connector. Sign in (the gate
sends them to the sign-in page and back), download the add-in, connect SOLIDWORKS with the address and key, add the
connector address to their AI app, see what is connected.

Server-rendered shell in the sign-in pages' look (auth.PAGE: dark, the gradient band, the text wordmark); the page
script reads /api/solidworks and keeps the SOLIDWORKS status fresh while the page is open.
"""

from __future__ import annotations

PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>OpenSketch for SOLIDWORKS</title><meta name="theme-color" content="#0c0d0e">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/fonts/fonts.css">
<style>
:root{--bg:#0c0d0e;--card:#141517;--field:#1b1c1f;--line:rgba(255,255,255,.08);--line2:rgba(255,255,255,.14);--text:#e3e4e8;--text2:#a3a6ad;
--muted:#868a93;--accent:#5e6ad2;--accent-h:#6b77de;--link:#8b93ff;--ok:#4cb782;--warn:#f2c94c;--err:#eb5757;
--display:"Inter Tight",Inter,system-ui,-apple-system,"Segoe UI",sans-serif;--mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;--ease:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;background:var(--bg);font:14px/1.5 Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--text);
-webkit-font-smoothing:antialiased;color-scheme:dark;overflow-x:hidden}
.band{position:fixed;left:-10vw;right:-10vw;top:-38vh;height:78vh;transform:skewY(-9deg);transform-origin:0 0;overflow:hidden;z-index:0;
background:linear-gradient(100deg,#2a2f7a 0%,#4a51c2 28%,#6670e0 48%,#8b6ad8 66%,#c0569c 86%,#e0559b 100%);opacity:.92}
.band:before{content:"";position:absolute;inset:-20%;background:radial-gradient(30% 50% at 20% 60%,rgba(163,170,255,.75),transparent 70%),
radial-gradient(28% 45% at 70% 40%,rgba(74,81,194,.8),transparent 70%);filter:blur(30px);animation:drift 16s ease-in-out infinite alternate;mix-blend-mode:screen}
.band i{position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(to bottom,transparent,var(--bg))}
@keyframes drift{to{transform:translate3d(8%,-6%,0) rotate(8deg)}}
header{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:16px;max-width:1080px;margin:0 auto;padding:24px 32px}
.brand{display:flex;align-items:baseline;gap:8px;color:#fff;text-decoration:none}
.brand b{font-family:var(--display);font-weight:800;font-size:21px;letter-spacing:-.04em;line-height:1}
.brand span{font-family:var(--display);font-weight:600;font-size:15px;letter-spacing:-.02em;color:rgba(255,255,255,.78)}
.who{display:flex;align-items:center;gap:14px;font-size:13px;color:rgba(255,255,255,.8);min-width:0}
.who span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.who a{color:#fff;text-decoration:none;opacity:.85}.who a:hover{opacity:1}
main{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,520px);gap:56px;max-width:1080px;margin:0 auto;padding:40px 32px 64px;align-items:start}
.pitch{position:sticky;top:40px;padding-top:24px}
.pitch h1{margin:0;font-family:var(--display);font-weight:750;font-size:52px;line-height:1.02;letter-spacing:-.045em;color:#fff;text-wrap:balance}
.pitch p{margin:16px 0 0;font-size:16px;color:rgba(255,255,255,.82);max-width:30em}
.state{display:inline-flex;align-items:center;gap:10px;margin-top:28px;padding:9px 16px 9px 14px;border-radius:999px;background:rgba(12,13,14,.55);
backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12);font-weight:550;font-size:13.5px;color:#fff}
.dot{width:8px;height:8px;border-radius:50%;background:var(--muted);flex:none}
.state.on .dot{background:var(--ok);box-shadow:0 0 0 4px rgba(76,183,130,.22);animation:pulse 2.4s var(--ease) infinite}
.state.off .dot{background:var(--warn)}
@keyframes pulse{50%{box-shadow:0 0 0 7px rgba(76,183,130,.06)}}
.steps{display:grid;gap:12px;counter-reset:step}
.step{position:relative;background:var(--card);border-radius:16px;padding:24px 24px 24px 68px;box-shadow:0 0 0 1px rgba(255,255,255,.07),0 24px 48px -16px rgba(0,0,0,.55);
animation:rise .22s var(--ease) both}
.step:nth-child(2){animation-delay:.03s}.step:nth-child(3){animation-delay:.06s}.step:nth-child(4){animation-delay:.09s}
@keyframes rise{from{opacity:0;transform:translateY(8px)}}
.step:before{counter-increment:step;content:counter(step);position:absolute;left:24px;top:22px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;
font:650 13px/1 var(--display);color:var(--text2);box-shadow:inset 0 0 0 1px var(--line2);transition:background .18s,color .18s,box-shadow .18s}
.step.done:before{content:"";background:var(--ok) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5' fill='none' stroke='%23fff' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/16px no-repeat;box-shadow:none}
h2{margin:0;font-family:var(--display);font-weight:700;font-size:19px;letter-spacing:-.025em;line-height:28px;color:var(--text)}
.step p{margin:4px 0 0;color:var(--text2)}
.step p b{color:var(--text);font-weight:600}
.row{display:flex;gap:8px;margin-top:14px;align-items:center}
.row label{flex:none;width:68px;font-size:12.5px;font-weight:550;color:var(--muted)}
.row input{flex:1;min-width:0;height:38px;padding:0 12px;border:1px solid var(--line2);border-radius:8px;font:13px var(--mono);color:var(--text);background:var(--field);outline:none}
.row input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(94,106,210,.25)}
.btn{flex:none;height:38px;padding:0 14px;border:0;border-radius:19px;background:transparent;box-shadow:inset 0 0 0 1px var(--line2);color:var(--text);font:inherit;font-weight:600;
cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;transition:background .12s,transform .12s,box-shadow .12s;white-space:nowrap}
.btn:hover{background:rgba(255,255,255,.06)}.btn:active{transform:scale(.97)}
.btn.copied{box-shadow:inset 0 0 0 1px var(--ok);color:var(--ok)}
.pill{height:42px;padding:0 20px;border-radius:21px;background:var(--accent);box-shadow:0 1px 0 rgba(255,255,255,.15) inset,0 6px 16px -6px rgba(94,106,210,.8);color:#fff;margin-top:16px}
.pill:hover{background:var(--accent-h)}
.pill svg{width:15px;height:15px;transition:transform .2s var(--ease)}.pill:hover svg{transform:translateY(2px)}
.pill[aria-disabled=true]{opacity:.5;pointer-events:none}
.links{display:flex;gap:16px;flex-wrap:wrap;margin-top:12px;font-size:12.5px;color:var(--muted)}
.links button,.links a{background:none;border:0;padding:0;font:inherit;color:var(--link);cursor:pointer;text-decoration:none}
.links button:hover,.links a:hover{text-decoration:underline}
.hint{margin-top:8px!important;font-size:12.5px;color:var(--muted)!important;overflow-wrap:anywhere}
details{margin-top:12px;font-size:12.5px;color:var(--muted)}
summary{cursor:pointer;color:var(--link);list-style:none;width:max-content}summary::-webkit-details-marker{display:none}
summary:hover{text-decoration:underline}
.apps{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:6px}
.apps li{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:var(--field);font-size:13px}
.apps li b{font-weight:600}.apps li span{color:var(--muted);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.apps li button{background:none;border:0;padding:0;font:inherit;font-size:12.5px;color:var(--muted);cursor:pointer}.apps li button:hover{color:var(--err)}
.ask{margin-top:14px;padding:12px 14px;border-radius:10px;background:var(--field);font-size:13.5px;color:var(--text);display:flex;gap:12px;align-items:center;justify-content:space-between}
.err{display:none;margin-top:12px;color:#ffb4b4;background:rgba(235,87,87,.14);border:1px solid rgba(235,87,87,.3);border-radius:8px;padding:9px 12px;font-size:13px}
footer{position:relative;z-index:1;display:flex;justify-content:space-between;gap:12px;max-width:1080px;margin:0 auto;padding:0 32px 24px;color:var(--muted);font-size:12px}
footer a{color:var(--muted);text-decoration:none}footer a:hover{color:var(--text)}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--link);outline-offset:3px;border-radius:6px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (max-width:900px){header{padding:20px 16px}main{grid-template-columns:1fr;gap:28px;padding:16px 16px 48px;max-width:560px}
.pitch{position:static;padding-top:8px}.pitch h1{font-size:36px}.step{padding:20px 16px 20px 56px}.step:before{left:16px;top:18px}
.row{flex-wrap:wrap}.row label{width:100%}footer{padding:0 16px 20px;max-width:560px}.who span{display:none}.band{height:56vh}}
@media (pointer:coarse){.row input{font-size:16px}}
@media (prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}
</style></head><body><div class="band"><i></i></div>
<header><a class="brand" href="/"><b>OpenSketch</b><span>for SOLIDWORKS</span></a>
<div class="who"><span id="who"></span><a href="/logout" id="signout">Sign out</a></div></header>
<main>
<section class="pitch"><h1>Your AI, building in SOLIDWORKS.</h1>
<p>Claude or ChatGPT makes native features in your own files: sketches, holes, fillets, patterns, mates.</p>
<div class="state" id="state" role="status" aria-live="polite"><span class="dot"></span><span id="state-t">Checking SOLIDWORKS</span></div></section>
<section class="steps">
<article class="step" id="s-install"><h2>Install the add-in</h2>
<p>On the SOLIDWORKS PC: unzip, run <b>OpenSketchSW.exe</b>, then <b>Install for me</b>.</p>
<a class="btn pill" id="download" href="/api/sw/download"><span>Download</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v12M7 12l5 5 5-5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
<p class="err" id="no-download" style="display:none">The add-in download is not on this server yet.</p></article>
<article class="step" id="s-connect"><h2>Connect SOLIDWORKS</h2>
<p>In SOLIDWORKS: <b>Tools &gt; KEVOS &gt; KEVOS status</b>. Paste these two. Not needed with KEVOS Bridge (below).</p>
<div class="row"><label for="server">Address</label><input id="server" readonly><button class="btn" data-copy="server">Copy</button></div>
<div class="row"><label for="key">Key</label><input id="key" type="password" readonly autocomplete="off"><button class="btn" id="show">Show</button><button class="btn" data-copy="key">Copy</button></div>
<div class="links"><button id="newkey">New key</button></div>
<p class="hint">No menu? Tools &gt; Macro &gt; Run &gt; Documents\\OpenSketch\\OpenSketch.swb</p></article>
<article class="step" id="s-pcs"><h2>Your computers</h2>
<p>Install <b>KEVOS Bridge</b> once on each SOLIDWORKS computer. Its Companion opens this site to add the computer, then connects by itself.</p>
<a class="btn pill" id="bridge-dl" href="https://github.com/jogkev-creator/CADOS/releases/tag/bridge-latest" rel="noopener"><span>Get KEVOS Bridge</span></a>
<ul class="apps" id="pcs" aria-label="Your computers"></ul>
<p class="hint" id="no-pcs">No computer added yet. The steps above connect one SOLIDWORKS without the installer.</p></article>
<article class="step" id="s-ai"><h2>Add the connector</h2>
<p>In Claude or ChatGPT, add a custom connector with this address and sign in.</p>
<div class="row"><label for="url">Connector</label><input id="url" readonly><button class="btn" data-copy="url">Copy</button></div>
<details id="private"><summary>Your app cannot sign in?</summary>
<p>Use this private address instead. Anyone with it can use your SOLIDWORKS link, so keep it to yourself.</p>
<div class="row"><label for="purl">Private</label><input id="purl" type="password" readonly autocomplete="off"><button class="btn" data-copy="purl">Copy</button></div>
<div class="links"><button id="newaddr">New address</button></div></details>
<ul class="apps" id="apps" aria-label="Connected AI apps"></ul></article>
<article class="step" id="s-try"><h2>Try it</h2>
<p>The first time, ask your AI app:</p>
<div class="ask"><span id="prompt">Run the SOLIDWORKS self test, all three stages.</span><button class="btn" data-copy-text="prompt">Copy</button></div></article>
<p class="err" id="err" role="alert"></p>
</section></main>
<footer><span>OpenSketch for SOLIDWORKS</span><span><a href="/privacy">Privacy</a></span></footer>
<script>
(() => {
  const $ = (id) => document.getElementById(id);
  const err = (m) => { const e = $('err'); e.textContent = m; e.style.display = m ? 'block' : 'none'; };
  async function api(path, opts) {
    const r = await fetch(path, Object.assign({ headers: { Accept: 'application/json' }, credentials: 'same-origin' }, opts || {}));
    if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname); throw new Error('Sign in first.'); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.detail || ('Error ' + r.status));
    return j;
  }
  function swYear(v) { const m = /^(\\d+)\\./.exec(v || ''); return m && +m[1] > 20 ? 'SOLIDWORKS ' + (+m[1] + 1992) : 'SOLIDWORKS'; }
  function paint(st) {
    const on = !!(st && st.connected);
    $('state').className = 'state ' + (on ? 'on' : 'off');
    $('state-t').textContent = on
      ? (st.ambiguous ? 'Connected: ' + st.machine : 'Connected: ' + swYear(st.sw_version) + (st.machine ? ' on ' + st.machine : '') + (st.working_on ? ', working' : ''))
      : 'SOLIDWORKS not connected';
    $('s-connect').classList.toggle('done', on);
    if (on) $('s-install').classList.add('done');
  }
  let shown = '';
  function apps(list) {
    const now = JSON.stringify(list);
    if (now === shown) return;  // the list is redrawn only when it changed, so a focused button stays focused
    shown = now;
    const ul = $('apps'); ul.textContent = '';
    for (const a of list) {
      const li = document.createElement('li');
      const b = document.createElement('b'); b.textContent = a.name;
      const s = document.createElement('span'); s.textContent = a.host || '';
      const x = document.createElement('button'); x.textContent = 'Disconnect';
      x.setAttribute('aria-label', 'Disconnect ' + a.name);
      x.onclick = async () => { try { await api('/api/account/apps/' + encodeURIComponent(a.id), { method: 'DELETE' }); load(); } catch (e) { err(e.message); } };
      li.append(b, s, x); ul.appendChild(li);
    }
    $('s-ai').classList.toggle('done', list.length > 0);
  }
  let pcsShown = '';
  function pcs(list) {
    const now = JSON.stringify(list);
    if (now === pcsShown) return;
    pcsShown = now;
    const ul = $('pcs'); ul.textContent = '';
    $('no-pcs').style.display = list.length ? 'none' : '';
    for (const d of list) {
      const li = document.createElement('li');
      const b = document.createElement('b'); b.textContent = d.name + (d.default ? ' (default)' : '');
      const s = document.createElement('span');
      const sw = (d.solidworks || []).map((i) => i.solidworks + (i.busy ? ', working' : '')).join(', ');
      s.textContent = d.online ? (sw || 'online, SOLIDWORKS closed') : 'offline';
      li.append(b, s);
      if (!d.default) {
        const m = document.createElement('button'); m.textContent = 'Make default';
        m.onclick = async () => { try { await api('/api/devices/' + encodeURIComponent(d.id), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ default: true }) }); pcsShown = ''; loadPcs(); } catch (e) { err(e.message); } };
        li.append(m);
      }
      const x = document.createElement('button'); x.textContent = 'Remove';
      x.setAttribute('aria-label', 'Remove ' + d.name);
      x.onclick = async () => {
        if (!confirm('Remove ' + d.name + '? It stops taking commands at once. To use it again, pair it again from its KEVOS Companion.')) return;
        try { await api('/api/devices/' + encodeURIComponent(d.id), { method: 'DELETE' }); pcsShown = ''; loadPcs(); } catch (e) { err(e.message); }
      };
      li.append(x); ul.appendChild(li);
    }
    $('s-pcs').classList.toggle('done', list.some((d) => d.online));
  }
  async function loadPcs() { try { pcs((await api('/api/devices')).devices || []); } catch (_) { /* shown on the next tick */ } }
  async function load() {
    try {
      const d = await api('/api/solidworks');
      $('who').textContent = d.user ? (d.user.email || d.user.name || '') : '';
      $('signout').style.display = d.signin ? '' : 'none';
      $('server').value = d.server; $('key').value = d.key; $('url').value = d.url; $('purl').value = d.private_url;
      $('private').style.display = d.private_url ? '' : 'none';
      if (!d.download) { $('download').setAttribute('aria-disabled', 'true'); $('no-download').style.display = 'block'; }
      paint(d.status); apps(d.apps || []); pcs(d.status.devices || []); err('');
    } catch (e) { err(e.message); }
  }
  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); } catch (_) {
      const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch (_) { /* */ } t.remove();
    }
    const was = btn.textContent; btn.textContent = 'Copied'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = was; btn.classList.remove('copied'); }, 1400);
  }
  document.querySelectorAll('[data-copy]').forEach((b) => { b.onclick = () => copy($(b.dataset.copy).value, b); });
  document.querySelectorAll('[data-copy-text]').forEach((b) => { b.onclick = () => copy($(b.dataset.copyText).textContent, b); });
  document.querySelectorAll('.row input').forEach((i) => { i.onfocus = () => i.select(); });
  $('show').onclick = () => { const k = $('key'); k.type = k.type === 'password' ? 'text' : 'password'; $('show').textContent = k.type === 'password' ? 'Show' : 'Hide'; };
  $('newkey').onclick = async () => {
    if (!confirm('Make a new key? The old one stops working, so SOLIDWORKS disconnects until you paste the new one.')) return;
    try { $('key').value = (await api('/api/sw/key', { method: 'POST' })).key; paint({ connected: false }); } catch (e) { err(e.message); }
  };
  $('newaddr').onclick = async () => {
    if (!confirm('Make a new private address? The old one stops working at once.')) return;
    try { $('purl').value = (await api('/api/connect/new_address', { method: 'POST' })).mcp_url; } catch (e) { err(e.message); }
  };
  let timer = null;
  const tick = async () => { try { const d = await api('/api/solidworks'); paint(d.status); apps(d.apps || []); pcs(d.status.devices || []); } catch (_) { /* offline: try again */ } };
  const run = () => { clearInterval(timer); timer = document.hidden ? null : setInterval(tick, 3000); };
  document.addEventListener('visibilitychange', () => { run(); if (!document.hidden) tick(); });
  load(); run();
})();
</script></body></html>"""


def page() -> bytes:
    return PAGE.encode()
