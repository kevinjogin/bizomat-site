/* CADOS app script: fills the Home, CAD Assistant, SOLIDWORKS, Tools, History and Settings pages (app_pages.py) from
   the server's API. One file for every page; each part runs only when its elements are on the page. No secret is ever
   written into the page source: keys and addresses are fetched after sign-in and shown only on request. */
(() => {
  const page = document.body.dataset.page || '';
  const $ = (id) => document.getElementById(id);
  const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { return null; } };
  let authFailed = false;

  function err(msg) { const e = $('err'); if (e) { e.textContent = msg || ''; e.hidden = !msg; } }
  function setState(kind, text) { const s = $('state'); if (s) { s.dataset.state = kind; $('state-t').textContent = text; } }

  async function api(path, opts) {
    const r = await fetch(path, Object.assign({ headers: { Accept: 'application/json' }, credentials: 'same-origin' }, opts || {}));
    if (r.status === 401) {
      authFailed = true; setState('auth', 'Authentication required');
      location.href = '/login?next=' + encodeURIComponent(location.pathname); throw new Error('Sign in to continue.');
    }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || j.detail || ('Request failed (' + r.status + ').'));
    return j;
  }

  async function copy(text, btn) {
    let ok = true;
    try { await navigator.clipboard.writeText(text); } catch (_) {
      const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { ok = document.execCommand('copy'); } catch (_) { ok = false; } t.remove();
    }
    if (btn) {
      const was = btn.dataset.label || btn.textContent; btn.dataset.label = was;
      btn.textContent = ok ? 'Copied' : 'Copy failed'; btn.classList.add('is-done');
      setTimeout(() => { btn.textContent = was; btn.classList.remove('is-done'); }, 1400);
    }
    return ok;
  }
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => copy($(b.dataset.copy).value, b)));
  document.querySelectorAll('[data-copy-text]').forEach((b) => b.addEventListener('click', () => copy($(b.dataset.copyText).textContent, b)));
  document.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
    const i = $(b.dataset.toggle); const show = i.type === 'password'; i.type = show ? 'text' : 'password';
    b.textContent = show ? 'Hide' : 'Show'; b.setAttribute('aria-pressed', String(show));
  }));
  document.querySelectorAll('.input-group input').forEach((i) => i.addEventListener('focus', () => i.select()));

  // tabs (arrow keys move between them)
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function pick(t) {
    for (const x of tabs) { const sel = x === t; x.setAttribute('aria-selected', String(sel)); x.tabIndex = sel ? 0 : -1; $(x.getAttribute('aria-controls')).hidden = !sel; }
    t.focus();
  }
  tabs.forEach((t, i) => { t.addEventListener('click', () => pick(t)); t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); pick(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]); } }); });

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function dot(okay) { const d = el('span', 'dot'); d.style.background = okay ? 'var(--ok)' : 'var(--idle)'; return d; }
  function swYear(v) { const m = /^(\d+)\./.exec(v || ''); return m && +m[1] > 20 ? 'SOLIDWORKS ' + (+m[1] + 1992) : 'SOLIDWORKS'; }
  function when(iso) {
    const t = Date.parse(iso || ''); if (!t) return '';
    const s = (Date.now() - t) / 1000;
    if (s < 60) return 'just now'; if (s < 3600) return Math.round(s / 60) + ' min ago'; if (s < 86400) return Math.round(s / 3600) + ' h ago';
    return new Date(t).toLocaleString();
  }
  const STATUS = { succeeded: ['Done', 'badge-ok'], failed: ['Failed', 'badge-err'], cancelled: ['Cancelled', ''], expired: ['Expired', 'badge-err'],
    rejected: ['Refused', 'badge-err'], denied: ['Declined', 'badge-wait'], unknown: ['Unknown', 'badge-wait'], created: ['Queued', 'badge-wait'],
    queued: ['Queued', 'badge-wait'], delivered: ['Sent', 'badge-wait'], accepted: ['Started', 'badge-wait'], running: ['Running', 'badge-wait'] };
  function badge(status) { const [t, c] = STATUS[status] || [status || 'Unknown', '']; return el('span', 'badge ' + c, t); }
  // a destructive change the person declined in SOLIDWORKS is on record as failed with APPROVAL_DENIED
  function shown(c) { return c.error && c.error.code === 'APPROVAL_DENIED' ? 'denied' : c.status; }

  // ---------------------------------------------------------------- the shared state (/api/solidworks)
  let last = { status: {}, apps: [], devices: [] };
  function paintState() {
    const st = last.status || {}; const devs = last.devices || []; const online = devs.filter((d) => d.online);
    if (st.connected) setState('connected', st.ambiguous ? 'Connected: ' + st.machine : 'Connected: ' + swYear(st.sw_version) + (st.machine ? ' on ' + st.machine : ''));
    else if (devs.length) setState('disconnected', online.length ? 'Disconnected: SOLIDWORKS is not open' : 'Disconnected: computer offline');
    else setState('install', 'Installation required');
    const up = $('update'); if (up) { up.hidden = !st.update_needed; up.textContent = st.update_needed || ''; }
  }
  async function loadShared() {
    const d = await api('/api/solidworks');
    last.status = d.status || {}; last.apps = d.apps || []; last.devices = (d.status && d.status.devices) || [];
    const who = d.user ? (d.user.email || d.user.name || '') : '';
    if ($('who')) $('who').textContent = who;
    if ($('signout')) $('signout').hidden = !d.signin;
    return d;
  }
  function failed(e) { if (!authFailed) { setState('error', 'Connection error'); err(e && e.message === 'Failed to fetch' ? 'This page cannot reach CADOS. Check your network; it retries by itself.' : (e && e.message) || 'Something went wrong.'); } }
  function poll(fn, ms) {
    let timer = null;
    const run = () => { clearInterval(timer); timer = document.hidden ? null : setInterval(fn, ms); };
    document.addEventListener('visibilitychange', () => { run(); if (!document.hidden) fn(); });
    run();
  }

  // ---------------------------------------------------------------- lists: assistants and computers
  let appsShown = '';
  function renderApps() {
    const ul = $('apps'); if (!ul) return;
    const list = last.apps; const now = JSON.stringify(list); if (now === appsShown) return; appsShown = now;
    ul.textContent = ''; $('no-apps').hidden = list.length > 0;
    for (const a of list) {
      const li = el('li'); const m = el('div', 'row-main');
      m.append(el('span', 'row-title', a.name), el('span', 'row-sub', a.host || 'Connected'));
      const act = el('div', 'row-actions'); const x = el('button', 'link-btn danger', 'Disconnect'); x.type = 'button';
      x.setAttribute('aria-label', 'Disconnect ' + a.name);
      x.addEventListener('click', async () => {
        if (!confirm('Disconnect ' + a.name + '? It loses access to CADOS until you connect it again.')) return;
        try { await api('/api/account/apps/' + encodeURIComponent(a.id), { method: 'DELETE' }); await refresh(); } catch (e) { err(e.message); }
      });
      act.append(x); li.append(dot(true), m, act); ul.append(li);
    }
  }
  let pcsShown = '';
  function renderPcs() {
    const ul = $('pcs'); if (!ul) return;
    const list = last.devices; const now = JSON.stringify(list); if (now === pcsShown) return; pcsShown = now;
    ul.textContent = ''; $('no-pcs').hidden = list.length > 0;
    for (const d of list) {
      const sw = (d.solidworks || []).map((i) => i.solidworks + (i.busy ? ', working' : '')).join(', ');
      const li = el('li'); const m = el('div', 'row-main');
      m.append(el('span', 'row-title', d.name + (d.default ? ' (default)' : '')), el('span', 'row-sub', d.online ? (sw || 'Online, SOLIDWORKS closed') : 'Offline'));
      const act = el('div', 'row-actions');
      if (!d.default) {
        const b = el('button', 'link-btn', 'Make default'); b.type = 'button'; b.setAttribute('aria-label', 'Make ' + d.name + ' the default computer');
        b.addEventListener('click', async () => {
          try { await api('/api/devices/' + encodeURIComponent(d.id), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ default: true }) }); pcsShown = ''; await refresh(); } catch (e) { err(e.message); }
        });
        act.append(b);
      }
      const x = el('button', 'link-btn danger', 'Remove'); x.type = 'button'; x.setAttribute('aria-label', 'Remove ' + d.name);
      x.addEventListener('click', async () => {
        if (!confirm('Remove ' + d.name + '? It stops taking commands at once. To use it again, pair it again from its KEVOS Companion.')) return;
        try { await api('/api/devices/' + encodeURIComponent(d.id), { method: 'DELETE' }); pcsShown = ''; await refresh(); } catch (e) { err(e.message); }
      });
      act.append(x); li.append(dot(d.online), m, act); ul.append(li);
    }
  }

  // ---------------------------------------------------------------- Home
  function paintHome() {
    const st = last.status || {}; const devs = last.devices; const apps = last.apps; const online = devs.filter((d) => d.online);
    $('t-sw').textContent = st.connected ? (st.ambiguous ? 'Several computers' : swYear(st.sw_version) + (st.machine ? ' on ' + st.machine : '')) : 'Not connected';
    $('t-sw').className = 'v ' + (st.connected ? 'state-ok' : 'state-idle');
    $('t-pc').textContent = devs.length ? devs.length + ' paired, ' + online.length + ' online' : 'None paired';
    $('t-ai').textContent = apps.length ? apps.map((a) => a.name).join(', ') : 'None connected';
    $('t-ai').className = 'v ' + (apps.length ? 'state-ok' : 'state-idle');
    $('t-work').textContent = st.working_on ? 'Working (' + st.working_on.op + ')' : (st.connected ? 'Ready' : 'Idle');
    $('no-assistant').hidden = apps.length > 0;
    const tried = store('cados.selftest') === '1';
    const done = { install: devs.length > 0 || !!st.connected, connect: !!st.connected, ai: apps.length > 0, test: tried };
    let n = 0;
    for (const k of Object.keys(done)) { $('ck-' + k).classList.toggle('done', done[k]); if (done[k]) n++; }
    $('setup-n').textContent = n + ' of 4 done';
    $('setup').hidden = n === 4;
    $('tried').textContent = tried ? 'Undo' : 'Mark done';
  }
  async function loadRecent() {
    const ul = $('recent'); if (!ul) return;
    try {
      const list = (await api('/api/commands?limit=5')).commands || [];
      ul.textContent = ''; $('recent-empty').hidden = list.length > 0;
      for (const c of list) {
        const li = el('li'); const m = el('div');
        m.append(el('div', '', c.title), el('div', 'meta', [c.device, c.app, when(c.created_at)].filter(Boolean).join(' · ')));
        li.append(m, badge(shown(c))); ul.append(li);
      }
    } catch (_) { /* the next refresh tries again */ }
  }
  if (page === 'home') {
    const task = $('task');
    document.querySelectorAll('[data-example]').forEach((b) => b.addEventListener('click', () => { task.value = b.dataset.example; task.focus(); }));
    on('task-copy', 'click', () => {
      if (!task.value.trim()) { task.focus(); $('task-note').textContent = 'Write your task first.'; return; }
      copy(task.value.trim(), $('task-copy')); $('task-note').textContent = 'Copied. Paste it into your AI assistant.';
    });
    document.querySelectorAll('[data-copy-first]').forEach((a) => a.addEventListener('click', () => { if (task.value.trim()) copy(task.value.trim()); }));
    on('tried', 'click', () => { store('cados.selftest', store('cados.selftest') === '1' ? '0' : '1'); paintHome(); });
  }

  // ---------------------------------------------------------------- Tools
  if (page === 'tools') {
    on('tool-q', 'input', () => {
      const q = $('tool-q').value.trim().toLowerCase(); let shown = 0;
      document.querySelectorAll('.tool-card').forEach((c) => { const hit = !q || c.dataset.text.includes(q); c.hidden = !hit; if (hit) shown++; });
      document.querySelectorAll('.tool-group').forEach((g) => { g.hidden = !g.querySelector('.tool-card:not([hidden])'); });
      $('tool-none').hidden = shown > 0;
    });
  }

  // ---------------------------------------------------------------- History
  async function loadHistory() {
    $('h-loading').hidden = false;
    try {
      const list = (await api('/api/commands?limit=100')).commands || [];
      const body = $('h-rows'); body.textContent = '';
      for (const c of list) {
        const tr = el('tr');
        const t1 = el('td', '', when(c.created_at)); t1.title = c.created_at || '';
        const t2 = el('td'); t2.append(el('span', '', c.title)); if (c.error && c.error.message) t2.append(el('span', 'meta', c.error.message));
        const t5 = el('td', 'status'); t5.append(badge(shown(c)));
        tr.append(t1, t2, el('td', '', c.device || ''), el('td', '', c.app || ''), t5); body.append(tr);
      }
      $('h-wrap').hidden = list.length === 0; $('h-empty').hidden = list.length > 0; err('');
    } catch (e) { failed(e); } finally { $('h-loading').hidden = true; }
  }
  if (page === 'history') { on('h-refresh', 'click', loadHistory); loadHistory(); }

  // ---------------------------------------------------------------- Settings
  if (page === 'settings') {
    on('newkey', 'click', async () => {
      if (!confirm('Make a new add-in key? The old key stops working, so a direct link disconnects until you paste the new one.')) return;
      try { $('key').value = (await api('/api/sw/key', { method: 'POST' })).key; } catch (e) { err(e.message); }
    });
    on('newaddr', 'click', async () => {
      if (!confirm('Make a new private address? The old one stops working at once.')) return;
      try { $('purl').value = (await api('/api/connect/new_address', { method: 'POST' })).mcp_url; } catch (e) { err(e.message); }
    });
  }

  // ---------------------------------------------------------------- Settings: change password
  on('pw-form', 'submit', async (e) => {
    e.preventDefault();
    const msg = $('pw-msg'); msg.textContent = '';
    try {
      const r = await api('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: $('pw-current').value, new_password: $('pw-new').value }) });
      msg.textContent = 'Password changed. Sign in again with the new password.';
      if (r.signed_out) setTimeout(() => { location.href = '/login'; }, 1500);
    } catch (er) { msg.textContent = er.message; }
  });

  // ---------------------------------------------------------------- Admin (the owner only; the server checks it too)
  function strongPassword() {
    const a = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const v = new Uint32Array(16); crypto.getRandomValues(v);
    return Array.from(v, (x) => a[x % a.length]).join('').replace(/(.{4})(?!$)/g, '$1-');
  }
  // who chose each password (the server keeps only a one-way hash, so nobody can read a password back)
  function pwCell(u) {
    const by = u.password_by;
    const text = !u.has_password ? (u.google ? 'Google sign-in only' : 'None yet')
      : by === 'owner' ? 'Set by you' : by === 'suggested' ? 'Kept the suggested one'
      : by === 'self' ? (u.role === 'owner' ? 'Yours' : 'Chosen by them') : 'Not recorded';
    const td = el('td'); td.append(el('span', '', text));
    if (u.has_password && u.password_at) td.append(el('span', 'meta', 'Changed ' + new Date(u.password_at * 1000).toLocaleDateString()));
    return td;
  }
  async function loadPeople() {
    try {
      const d = await api('/api/admin/people');
      const body = $('people'); body.textContent = '';
      $('people-n').textContent = d.people.length + (d.people.length === 1 ? ' person' : ' people');
      for (const u of d.people) {
        const tr = el('tr');
        const who = el('td'); who.append(el('span', '', u.name || u.email), el('span', 'meta', u.email));
        const role = { owner: 'Owner', member: 'Member', tester: 'Tester' }[u.role] || u.role;
        const pcs = u.computers ? u.computers + ' (' + u.online + ' online)' : 'None';
        const act = el('td'); act.style.whiteSpace = 'nowrap';
        if (u.role !== 'owner') {
          const pw = el('button', 'link-btn small', 'Set password'); pw.type = 'button';
          pw.addEventListener('click', async () => {
            const np = prompt('New password for ' + u.email + ' (at least ' + d.min_password + ' characters). They are signed out everywhere and their AI assistants must sign in again.', strongPassword());
            if (!np) return;
            try { await api('/api/account/users/' + encodeURIComponent(u.id) + '/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: np }) });
              await copy(np); alert('Password set and copied. Give it to ' + u.email + '.'); } catch (er) { err(er.message); }
          });
          const rm = el('button', 'link-btn danger small', 'Remove'); rm.type = 'button'; rm.style.marginLeft = '12px';
          rm.addEventListener('click', async () => {
            if (!confirm('Remove ' + u.email + '? Their account, AI assistant connections and paired computers stop working at once.')) return;
            try { await api('/api/account/users/' + encodeURIComponent(u.id), { method: 'DELETE' }); loadPeople(); } catch (er) { err(er.message); }
          });
          act.append(pw, rm);
        }
        tr.append(who, el('td', '', role), pwCell(u), el('td', '', pcs), el('td', '', u.apps.length ? u.apps.join(', ') : 'None'), act);
        body.append(tr);
      }
      const ul = $('invites'); ul.textContent = '';
      for (const i of d.invites) {
        const li = el('li'); const m = el('div');
        m.append(el('div', '', i.note || 'Invite link'), el('div', 'meta', 'Expires ' + new Date((i.expires || 0) * 1000).toLocaleDateString()));
        const x = el('button', 'link-btn danger small', 'Revoke'); x.type = 'button';
        x.addEventListener('click', async () => { try { await api('/api/account/invites/' + encodeURIComponent(i.id), { method: 'DELETE' }); loadPeople(); } catch (er) { err(er.message); } });
        li.append(m, x); ul.append(li);
      }
      $('open-signup').checked = !!(d.settings && d.settings.open_signup);
      err('');
    } catch (er) { failed(er); }
  }
  if (page === 'admin') {
    $('add-pw').value = strongPassword();
    on('add-gen', 'click', () => { $('add-pw').value = strongPassword(); });
    on('add-form', 'submit', async (e) => {
      e.preventDefault(); $('add-msg').textContent = ''; $('add-done').hidden = true;
      const email = $('add-email').value.trim(); const pw = $('add-pw').value;
      try {
        await api('/api/account/users', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: $('add-name').value.trim(), password: pw }) });
        const box = $('add-done'); box.textContent = '';
        box.append(el('div', '', 'Account created for ' + email + '. Give them: the address ' + location.origin + ', their email and this password. '
          + 'They install CADOS for SOLIDWORKS and sign in when the pairing step opens the browser. This is the last time CADOS shows it.'));
        const row = el('div', 'input-group'); row.style.marginTop = 'var(--s-3)';
        const shown = el('input', 'input'); shown.readOnly = true; shown.defaultValue = pw; shown.spellcheck = false; shown.setAttribute('aria-label', 'Password for ' + email);
        const cb = el('button', 'btn', 'Copy'); cb.type = 'button'; cb.addEventListener('click', () => copy(pw, cb));
        row.append(shown, cb); box.append(row); box.style.flexDirection = 'column'; box.style.alignItems = 'stretch';
        box.hidden = false; $('add-form').reset(); $('add-pw').value = strongPassword(); loadPeople();
      } catch (er) { $('add-msg').textContent = er.message; }
    });
    on('inv-new', 'click', async () => {
      try { const r = await api('/api/account/invites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: $('inv-note').value.trim() }) });
        $('inv-url').value = r.url; $('inv-out').hidden = false; $('inv-note').value = ''; loadPeople(); } catch (er) { err(er.message); }
    });
    on('open-signup', 'change', async () => {
      try { await api('/api/account/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ open_signup: $('open-signup').checked }) }); }
      catch (er) { err(er.message); $('open-signup').checked = !$('open-signup').checked; }
    });
    loadPeople();
    api('/api/admin/server-password').then((r) => {
      if (r.server_password) $('spw').value = r.server_password; else $('spw-none').hidden = false;
    }).catch((er) => err(er.message));
  }

  // ---------------------------------------------------------------- load and keep fresh
  async function refresh(first) {
    try {
      const d = await loadShared();
      if (first) {
        if ($('url')) $('url').value = d.url;
        if ($('server')) $('server').value = d.server;
        if ($('key')) $('key').value = d.key;
        if ($('purl')) { $('purl').value = d.private_url; if (!d.private_url) $('private').hidden = true; }
        if ($('acc-name')) { $('acc-name').textContent = (d.user && d.user.name) || 'Server owner'; $('acc-email').textContent = (d.user && d.user.email) || 'No email (server password sign-in)'; }
        if ($('acc-signout')) $('acc-signout').hidden = !d.signin;
        if ($('ownerpw')) $('ownerpw').hidden = !(d.user && d.user.password_by === 'owner');
        if ($('download') && !d.download) { $('download').setAttribute('aria-disabled', 'true'); $('no-download').hidden = false; }
      }
      paintState(); renderApps(); renderPcs(); if (page === 'home') paintHome();
      if (!$('err').hidden && $('state') && $('state').dataset.state !== 'error') err('');
    } catch (e) { failed(e); }
  }
  if (['home', 'assistant', 'solidworks', 'settings', 'tools', 'admin'].includes(page)) {
    refresh(true);
    if (!['tools', 'settings', 'admin'].includes(page)) poll(refresh, 4000);
  }
  if (page === 'home') { loadRecent(); poll(loadRecent, 15000); showNewPassword(); }

  // ---------------------------------------------------------------- Home: the password CADOS made at sign-up, once
  async function showNewPassword() {
    try {
      const r = await api('/api/account/new-password');
      if (!r.password || !$('newpw')) return;
      $('newpw-v').value = r.password; $('newpw').hidden = false;
      on('newpw-ok', 'click', async () => {
        $('newpw').hidden = true; $('newpw-v').value = '';
        try { await api('/api/account/new-password', { method: 'DELETE' }); } catch (_) { /* gone in 30 minutes anyway */ }
      });
    } catch (_) { /* no notice */ }
  }
})();
