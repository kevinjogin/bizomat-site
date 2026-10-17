// Account avatar (title bar, right): who is signed in, account settings, invites, look, sign out.
// The server decides everything (auth.py, accounts.py); this only shows it.

import { contextMenu, dialog, message } from './ui/dialogs.js';
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
  }

  menu() {
    const r = this.el.getBoundingClientRect();
    const u = this.user, m = this.info?.mode;
    const items = [];
    if (u && !u.legacy) {
      items.push({ head: `${u.name} - ${u.email}` });
      items.push({ label: 'Account settings...', run: () => this.settings() });
      items.push({ label: 'AI model and key...', run: () => import('./aikeys.js').then((m) => m.aiKeyDialog(this.app)) });
      if (u.role === 'owner' && m === 'accounts') items.push({ label: 'Invite people...', run: () => this.invite() }, { label: 'People on this server...', run: () => this.people() });
    } else {
      items.push({ head: m === 'open' ? 'Not signed in. Anyone with the address can use this server.' : 'Signed in with the server password.' });
      items.push({ label: 'Create owner account...', run: () => { location.href = '/setup?next=' + encodeURIComponent(location.pathname + location.search); } });
      items.push({ label: 'AI model and key...', run: () => import('./aikeys.js').then((m) => m.aiKeyDialog(this.app)) });
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
    body.innerHTML = `<label class="acct-l">Name</label><input class="acct-i" name="name" autocomplete="name">
      <label class="acct-l">Email</label><div class="acct-v"></div>
      <div class="acct-sep"></div><div class="acct-sub">Change password</div>
      <label class="acct-l acct-cur">Current password</label><input class="acct-i acct-cur" name="cur" type="password" autocomplete="current-password">
      <label class="acct-l">New password</label><input class="acct-i" name="new" type="password" autocomplete="new-password">
      <div class="acct-note">At least 8 characters. Changing it signs you out everywhere.</div><div class="acct-err" role="alert"></div>`;
    body.querySelector('[name=name]').value = u.name;
    if (u.has_password === false) {
      body.querySelectorAll('.acct-cur').forEach((e) => e.remove());
      body.querySelector('.acct-sub').textContent = 'Set a password (you sign in with Google now)';
    }
    body.querySelector('.acct-v').textContent = u.email + (u.google ? '  (linked to Google)' : '');
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
          });
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
        rm.onclick = async () => {
          const r = await (await fetch('/api/account/users/' + encodeURIComponent(p.id), { method: 'DELETE' })).json();
          if (r.error) { message('People', esc(r.error)); return; }
          row.remove();
        };
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
    if (this.info.pending_invites) body.appendChild(h('div', 'acct-note', `${this.info.pending_invites} invite link(s) not used yet.`));
    dialog({ title: 'People on this server', body, cls: 'acct-dlg', buttons: [{ label: 'Invite people...', run: () => { setTimeout(() => this.invite(), 0); } }, { label: 'Done', primary: true }] });
  }
}
