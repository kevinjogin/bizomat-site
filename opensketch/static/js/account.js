// Account avatar (title bar, right): who is signed in, account settings, invites, look, sign out.
// The server decides everything (auth.py, accounts.py); this only shows it.

import { contextMenu, dialog, message, secretField } from './ui/dialogs.js';
import { escapeHtml as esc } from './model-utils.js';
import { LOOK, LOOKS, setLook } from './skin.js';

const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const COLORS = ['#9747ff', '#0d99ff', '#14ae5c', '#f24822', '#ffa629', '#e0559b', '#1bc4c4'];
const initials = (n) => { const w = (n || '').trim().split(/\s+/).filter(Boolean); return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?').slice(0, 2)).toUpperCase(); };
const colorFor = (s) => COLORS[[...(s || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

export class Account {
  constructor(app) {
    this.app = app;
    this.el = document.getElementById('account');
    this.info = null;
    if (!this.el || typeof window.OPENSKETCH_REVIEW === 'string') return; // a shared review link has no account
    this.load();
  }

  async load() {
    try { this.info = await (await fetch('/api/account', { cache: 'no-store' })).json(); } catch (_) { this.info = null; }
    this.render();
  }

  get user() { return this.info?.user || null; }

  render() {
    this.el.innerHTML = '';
    const u = this.user;
    const a = h('div', 'avatar' + (u && !u.legacy ? '' : ' none'), u && !u.legacy ? initials(u.name) : '');
    if (u && !u.legacy) a.style.background = colorFor(u.email);
    else a.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    a.title = u && !u.legacy ? `${u.name} (${u.email})` : 'Account';
    a.setAttribute('role', 'button'); a.setAttribute('aria-label', 'Account menu'); a.tabIndex = 0;
    a.onclick = () => this.menu();
    a.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.menu(); } };
    this.el.appendChild(a);
    this.app.files?.syncAvatar?.();
  }

  menu(anchor) {
    const r = (anchor || this.el).getBoundingClientRect();
    const u = this.user, m = this.info?.mode;
    const items = [];
    if (u && !u.legacy) {
      items.push({ head: `${u.name} - ${u.email}` });
      items.push({ label: 'Account settings...', run: () => this.settings() });
      items.push({ label: 'Files', run: () => this.app.files?.open() });
      items.push({ label: 'Connect AI...', run: () => this.app.server?.connectDialog() });
      if (u.role === 'owner' && m === 'accounts') items.push({ label: 'Invite people...', run: () => this.invite() }, { label: 'People on this server...', run: () => this.people() },
        { label: this.info.google ? 'Sign in with Google: on' : 'Sign in with Google...', run: () => this.google() });
    } else {
      items.push({ head: m === 'open' ? 'Not signed in. Anyone with the address can use this server.' : 'Signed in with the server password.' });
      items.push({ label: 'Create owner account...', run: () => { location.href = '/setup?next=' + encodeURIComponent(location.pathname + location.search); } });
      items.push({ label: 'Connect AI...', run: () => this.app.server?.connectDialog() });
    }
    items.push('-', { head: 'Theme' }, ...LOOKS.map(([k, t]) => ({ label: t, icon: LOOK === k ? 'ok' : null, run: () => { if (LOOK !== k) setLook(k); } })));
    if (m !== 'open') items.push('-', { label: 'Sign out', run: () => this.signOut() });
    contextMenu(Math.max(4, r.right - 260), r.bottom + 6, items.map((it) => (it.head ? { head: it.head } : it)));
  }

  async signOut() {
    try { await this.app.server?.flush?.(); } catch (_) { /* best effort */ }
    location.href = '/logout';
  }

  settings() {
    const u = this.user;
    const body = h('div', 'acct');
    // the hidden username tells the browser whose password this is (it is a change-password form), so it never
    // puts the saved email into another field of the page
    body.innerHTML = `<input type="email" name="username" autocomplete="username" readonly hidden tabindex="-1">
      <label class="acct-l">Name</label><input class="acct-i" name="name" autocomplete="name">
      <label class="acct-l">Email</label><div class="acct-v"></div>
      <div class="acct-sep"></div><div class="acct-sub">Change password</div>
      <label class="acct-l acct-cur">Current password</label><input class="acct-i acct-cur" name="cur" type="password" autocomplete="current-password">
      <label class="acct-l">New password</label><input class="acct-i" name="new" type="password" autocomplete="new-password">
      <div class="acct-note">At least 8 characters. Changing it signs you out everywhere.</div><div class="acct-err" role="alert"></div>`;
    body.querySelector('[name=name]').value = u.name;
    body.querySelector('[name=username]').value = u.email || '';
    if (u.has_password === false) {
      body.querySelectorAll('.acct-cur').forEach((e) => e.remove());
      body.querySelector('.acct-sub').textContent = 'Set a password (you sign in with Google now)';
    }
    body.querySelector('.acct-v').textContent = u.email + (u.google ? '  (linked to Google)' : '');
    // AI apps that signed in to this account (Claude, ChatGPT, Codex...): see and disconnect them
    const apps = h('div', 'acct-apps');
    apps.append(h('div', 'acct-sep'), h('div', 'acct-sub', 'Connected AI apps'));
    const list = h('div', 'acct-applist', 'Loading...');
    apps.appendChild(list);
    body.appendChild(apps);
    const when = (s) => { if (!s) return ''; const d = (Date.now() / 1000 - s) / 86400; return d < 1 ? 'today' : d < 2 ? 'yesterday' : `${Math.floor(d)} days ago`; };
    const draw = (items) => {
      list.innerHTML = '';
      if (!items.length) { list.appendChild(h('div', 'acct-note', 'None yet. Connect Claude, ChatGPT or another AI app from Connect AI: it signs in here once.')); return; }
      for (const a of items) {
        const row = h('div', 'acct-app');
        const who = h('span', 'acct-who'); who.append(h('b', null, a.name), h('span', null, `${a.host ? a.host + ' - ' : ''}connected ${when(a.created)}, used ${when(a.last_used)}`));
        const off = h('button', 'btn', 'Disconnect');
        off.onclick = async () => {
          off.disabled = true;
          try { const r = await fetch('/api/account/apps/' + encodeURIComponent(a.id), { method: 'DELETE' }); if (!r.ok) throw new Error(r.statusText); draw((await r.json()).apps || []); this.app.toast?.(`${a.name} disconnected. It has to sign in again to use your files.`); }
          catch (_) { off.disabled = false; this.app.toast?.('Could not disconnect. Check your connection and try again.'); }
        };
        row.append(who, off); list.appendChild(row);
      }
    };
    fetch('/api/account/apps', { cache: 'no-store' }).then((r) => r.json()).then((j) => draw(j.apps || [])).catch(() => { list.textContent = 'Could not load the list.'; });
    body.querySelectorAll('input').forEach((i) => i.addEventListener('keydown', (e) => e.stopPropagation()));
    const err = body.querySelector('.acct-err');
    const d = dialog({ title: 'Account settings', body, cls: 'acct-dlg', buttons: [
      { label: 'Cancel' },
      { label: 'Save', primary: true, run: () => {
        const name = body.querySelector('[name=name]').value.trim();
        const cur = body.querySelector('[name=cur]')?.value || '', nw = body.querySelector('[name=new]').value;
        const req = {}; if (name && name !== u.name) req.name = name; if (nw) { req.new_password = nw; req.current_password = cur; }
        if (!Object.keys(req).length) return true;
        fetch('/api/account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req) })
          .then((r) => r.json()).then((j) => {
            if (j.error) { err.textContent = j.error; return; }
            d.close();
            if (j.signed_out) { location.href = '/login'; return; }
            this.info.user = j.user; this.render(); this.app.toast?.('Saved.');
          }).catch(() => { err.textContent = 'Could not save. Check your connection and try again.'; });
        return false;
      } }] });
  }

  async invite() {
    let j;
    try { j = await (await fetch('/api/account/invites', { method: 'POST' })).json(); } catch (e) { message('Invite people', esc(String(e))); return; }
    if (j.detail || j.error) { message('Invite people', esc(j.detail || j.error)); return; }
    const body = h('div', 'acct');
    body.appendChild(h('p', null, `Send this link to the person you want to invite. It works once and lasts ${j.days} days. They choose their own email and password.`));
    const row = h('div', 'srv-url'); const inp = h('input'); inp.readOnly = true; inp.value = j.url;
    const copy = h('button', 'btn primary', 'Copy');
    copy.onclick = () => { navigator.clipboard?.writeText(j.url).then(() => { copy.textContent = 'Copied'; }, () => { inp.select(); }); };
    row.append(inp, copy); body.appendChild(row);
    dialog({ title: 'Invite people', body, cls: 'acct-dlg', buttons: [{ label: 'Done', primary: true }] });
  }

  async people() {
    await this.load();
    const body = h('div', 'acct');
    const list = h('div', 'acct-people');
    for (const p of this.info.users || []) {
      const row = h('div', 'acct-p');
      const av = h('span', 'avatar', initials(p.name)); av.style.background = colorFor(p.email);
      const who = h('span', 'acct-who'); who.append(h('b', null, p.name), h('span', null, p.email));
      row.append(av, who, h('span', 'acct-role', p.role === 'owner' ? 'Owner' : 'Member'));
      if (p.role !== 'owner') {
        const rm = h('button', 'btn', 'Remove');
        rm.onclick = () => dialog({ title: 'Remove person', cls: 'acct-dlg', body: `<p class="fv-p">Remove <b>${esc(p.name)}</b> (${esc(p.email)})? They are signed out at once and can no longer sign in. Their files stay on the server.</p>`,
          buttons: [{ label: 'Cancel' }, { label: 'Remove', primary: true, danger: true, run: () => {
            fetch('/api/account/users/' + encodeURIComponent(p.id), { method: 'DELETE' }).then((x) => x.json()).then((r) => {
              if (r.error) { message('People', esc(r.error)); return; }
              row.remove();
            }).catch(() => message('People', 'Could not remove them. Check your connection and try again.'));
          } }] });
        row.appendChild(rm);
      }
      list.appendChild(row);
    }
    body.appendChild(list);
    const open = h('label', 'acct-toggle');
    const cb = h('input'); cb.type = 'checkbox'; cb.checked = !!this.info.open_signup;
    open.append(cb, h('span', null, this.info.google ? 'Anyone can create an account (email or Google)' : 'Anyone can create an account'));
    const openNote = h('div', 'acct-note', 'Off: only people with an invite link can join. Turn on only if you want strangers to be able to sign up.');
    cb.onchange = async () => {
      try { const r = await (await fetch('/api/account/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ open_signup: cb.checked }) })).json(); this.info.open_signup = r.open_signup; } catch (_) { cb.checked = !cb.checked; }
    };
    body.append(open, openNote);
    const g = h('div', 'acct-g');
    g.append(h('span', null, this.info.google ? 'Sign in with Google is on.' : 'Sign in with Google is off.'));
    const gb = h('button', 'btn', this.info.google ? 'Settings...' : 'Set up...'); gb.onclick = () => setTimeout(() => this.google(), 0);
    g.appendChild(gb); body.appendChild(g);
    if (this.info.pending_invites) body.appendChild(h('div', 'acct-note', `${this.info.pending_invites} invite link(s) not used yet.`));
    dialog({ title: 'People on this server', body, cls: 'acct-dlg', buttons: [{ label: 'Invite people...', run: () => { setTimeout(() => this.invite(), 0); } }, { label: 'Done', primary: true }] });
  }

  // Owner: turn on "Continue with Google" by pasting a Web application OAuth client from Google Cloud.
  async google() {
    let st;
    try { st = await (await fetch('/api/account/google', { cache: 'no-store' })).json(); } catch (_) { st = null; }
    if (!st || st.detail || st.error) { message('Sign in with Google', esc(st?.detail || st?.error || 'Could not reach the server.')); return; }
    const body = h('div', 'acct acct-google');
    const status = h('div', 'acct-gstate' + (st.enabled ? ' on' : ''));
    const setStatus = (s) => {
      status.className = 'acct-gstate' + (s.enabled ? ' on' : '');
      status.textContent = s.enabled ? (s.source === 'server' ? 'On. Set on the server, so it is changed there.' : 'On. The sign-in pages show Continue with Google.')
        : 'Off. People sign in with email and password.';
    };
    setStatus(st);
    body.appendChild(status);
    const steps = h('ol', 'acct-steps');
    steps.innerHTML = `<li>Open <a href="https://console.cloud.google.com/auth/overview" target="_blank" rel="noopener">Google Auth Platform</a> and pick or create a project (for example "OpenSketch").
        If it says it is not set up yet, click <b>Get started</b>: app name OpenSketch, your email, audience <b>External</b>.</li>
      <li>In <b>Audience</b>, click <b>Publish app</b> so anyone you invite can use it (name and email only, so Google does not need to review it).
        Or keep it in testing and add yourself under Test users.</li>
      <li>In <b>Clients</b>, click <b>Create client</b> and choose <b>Web application</b>. Under <b>Authorized redirect URIs</b>, add this address:</li>`;
    body.appendChild(steps);
    const row = h('div', 'srv-url'); const uri = h('input'); uri.readOnly = true; uri.value = st.redirect_uri;
    const copy = h('button', 'btn', 'Copy');
    copy.onclick = () => { navigator.clipboard?.writeText(st.redirect_uri).then(() => { copy.textContent = 'Copied'; }, () => { uri.select(); }); };
    row.append(uri, copy); body.appendChild(row);
    const last = h('ol', 'acct-steps'); last.start = 4;
    last.innerHTML = '<li>Click <b>Create</b>. Google shows the Client ID and Client secret once: paste both here.</li>';
    body.appendChild(last);
    body.insertAdjacentHTML('beforeend', `<label class="acct-l">Client ID</label><input class="acct-i" name="cid" autocomplete="off" spellcheck="false" placeholder="....apps.googleusercontent.com">
      <label class="acct-l">Client secret</label><input class="acct-i os-secret" name="sec" type="text" placeholder="${st.enabled && st.source === 'app' ? 'Saved. Paste a new one to change it.' : 'GOCSPX-...'}">
      <div class="acct-note">The secret is stored encrypted on this server and never shown again.</div><div class="acct-err" role="alert"></div>`);
    const cid = body.querySelector('[name=cid]'), sec = body.querySelector('[name=sec]'), err = body.querySelector('.acct-err');
    cid.value = st.client_id || '';
    secretField(cid); secretField(sec);
    if (st.source === 'server') { cid.disabled = true; sec.disabled = true; }
    body.querySelectorAll('input').forEach((i) => i.addEventListener('keydown', (e) => e.stopPropagation()));
    const call = async (method, payload) => {
      const r = await fetch('/api/account/google', { method, headers: { 'Content-Type': 'application/json' }, body: payload ? JSON.stringify(payload) : undefined });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || j.detail || r.statusText || 'Could not save.');
      return j;
    };
    const buttons = [{ label: st.enabled ? 'Done' : 'Cancel' }];
    if (st.enabled && st.source === 'app') buttons.unshift({ label: 'Turn off', danger: true, run: () => {
      call('DELETE').then((j) => { setStatus(j); this.info.google = false; cid.value = ''; this.app.toast?.('Sign in with Google is off.'); d.close(); })
        .catch((e) => { err.textContent = e.message; });
      return false;
    } });
    if (st.source !== 'server') buttons.push({ label: st.enabled ? 'Save' : 'Turn on', primary: true, run: () => {
      err.textContent = '';
      if (!cid.value.trim() || !sec.value.trim()) { err.textContent = st.enabled && !sec.value.trim() ? 'Paste the Client secret to change the settings.' : 'Paste the Client ID and the Client secret.'; return false; }
      call('POST', { client_id: cid.value.trim(), client_secret: sec.value.trim() }).then((j) => {
        this.info.google = true; d.close();
        this.app.toast?.('Sign in with Google is on. Sign out to see it on the sign-in page.');
      }).catch((e) => { err.textContent = e.message; });
      return false;
    } });
    const d = dialog({ title: 'Sign in with Google', body, cls: 'acct-dlg acct-google-dlg', buttons });
  }
}
