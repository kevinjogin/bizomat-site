// Account avatar (title bar, right): who is signed in, account settings, invites, look, sign out.
// The server decides everything (auth.py, accounts.py); this only shows it.

import { contextMenu, dialog, message, secretField } from './ui/dialogs.js';
import { escapeHtml as esc } from './model-utils.js';
import { LOOK, LOOKS, setLook } from './skin.js';

const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const COLORS = ['#9747ff', '#0d99ff', '#14ae5c', '#f24822', '#ffa629', '#e0559b', '#1bc4c4'];
const initials = (n) => { const w = (n || '').trim().split(/\s+/).filter(Boolean); return (w.length > 1 ? w[0][0] + w[1][0] : (w[0] || '?').slice(0, 2)).toUpperCase(); };
const colorFor = (s) => COLORS[[...(s || '')].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
// an early-access tester who added their own sign-in (Keep my work): an email and password, or Google
const kept = (u) => !!(u && (u.has_password || u.google));

export class Account {
  constructor(app) {
    this.app = app;
    this.el = document.getElementById('account');
    this.info = null;
    this.ready = Promise.resolve(null);
    if (!this.el || typeof window.OPENSKETCH_REVIEW === 'string') return; // a shared review link has no account
    this.ready = this.load(); // app.startup waits for it: browser storage is per person (scope.js)
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
    a.title = u && u.tester && !kept(u) ? `${u.name} (early access)` : u && !u.legacy ? `${u.name} (${u.email})` : 'Account';
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
    if (u && u.tester && !kept(u)) { // early access: the account lives in this browser until they keep their work
      items.push({ head: `${u.name} - early access` });
      items.push({ label: 'Keep my work...', run: () => this.keepWork() });
      items.push({ label: 'Files', run: () => this.app.files?.open() });
      items.push({ label: 'Connect AI...', run: () => this.app.server?.connectDialog() });
    } else if (u && !u.legacy) {
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

  async signOut(force) {
    const u = this.user;
    if (!force && u && u.tester && !kept(u)) { // nothing else leads back to this account: say so first
      dialog({ title: 'Sign out?', cls: 'acct-dlg', body: '<div class="acct"><p>Your files are tied to this browser. After you sign out you cannot get back to them, '
        + 'and the access code makes a new, empty account.</p><p>Keep your work first: add an email and a password, then sign in with them anywhere.</p></div>',
      buttons: [{ label: 'Cancel' }, { label: 'Sign out anyway', danger: true, run: () => { this.signOut(true); } },
        { label: 'Keep my work...', primary: true, run: () => { setTimeout(() => this.keepWork(), 0); } }] });
      return;
    }
    try { await this.app.server?.flush?.(); } catch (_) { /* best effort */ }
    location.href = '/logout';
  }

  // Early access: the tester adds an email and password (or Google) to their account, so their files are not lost
  // when they sign out or change browser. They stay a tester (POST /api/account/keep, accounts.keep_tester).
  keepWork() {
    const body = h('div', 'acct');
    body.innerHTML = `<p class="fv-p">Add an email and a password to keep your files. Sign in with them from any browser.</p>
      <label class="acct-l" for="kw-name">Your name</label><input class="acct-i" id="kw-name" name="name" autocomplete="name">
      <label class="acct-l" for="kw-email">Email</label><input class="acct-i" id="kw-email" name="username" type="email" autocomplete="username">
      <label class="acct-l" for="kw-pw">Password</label><input class="acct-i" id="kw-pw" name="new" type="password" autocomplete="new-password" aria-describedby="kw-note">
      <div class="acct-note" id="kw-note">At least 8 characters.</div><div class="acct-err" role="alert"></div>`;
    if (this.info?.google) {
      const g = h('button', 'btn acct-gkeep', 'Use my Google account instead'); g.type = 'button';
      g.onclick = async () => {
        try { await this.app.server?.flush?.(); } catch (_) { /* best effort */ }
        location.href = '/auth/google?keep=1&next=' + encodeURIComponent(location.pathname + location.search);
      };
      body.appendChild(g);
    }
    body.querySelectorAll('input').forEach((i) => i.addEventListener('keydown', (e) => e.stopPropagation()));
    const err = body.querySelector('.acct-err');
    const d = dialog({ title: 'Keep my work', body, cls: 'acct-dlg', buttons: [
      { label: 'Cancel' },
      { label: 'Save', primary: true, run: () => {
        const val = (n) => body.querySelector(`[name=${n}]`).value.trim();
        if (!val('username') || !body.querySelector('[name=new]').value) { err.textContent = 'Enter an email and a password.'; return false; }
        fetch('/api/account/keep', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: val('name'), email: val('username'), password: body.querySelector('[name=new]').value }) })
          .then((r) => r.json()).then((j) => {
            if (j.error || j.detail) { err.textContent = j.error || (typeof j.detail === 'string' ? j.detail : 'Check the email and password.'); return; }
            d.close(); this.info.user = j.user; this.render();
            this.app.toast?.(`Saved. Sign in with ${j.user.email} next time.`);
          }).catch(() => { err.textContent = 'Could not save. Check your connection and try again.'; });
        return false;
      } }] });
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
      <div class="acct-note">At least 8 characters. Changing it signs you out everywhere, disconnects your AI apps and replaces your private AI address.</div><div class="acct-err" role="alert"></div>`;
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
    const allOff = h('button', 'btn', 'Disconnect all'); allOff.type = 'button'; allOff.hidden = true;
    allOff.onclick = async () => {
      allOff.disabled = true;
      try { const r = await fetch('/api/account/apps', { method: 'DELETE' }); if (!r.ok) throw new Error(r.statusText); draw([]); this.app.toast?.('Every AI app is disconnected. Each has to sign in again.'); }
      catch (_) { this.app.toast?.('Could not disconnect. Check your connection and try again.'); }
      allOff.disabled = false;
    };
    apps.append(list, allOff);
    // the private address (/mcp/<key>) for apps that cannot sign in: replace it if someone else may have seen it
    const addr = h('div', 'acct-apps');
    addr.append(h('div', 'acct-sep'), h('div', 'acct-sub', 'Private AI address'),
      h('div', 'acct-note', 'For AI apps that cannot sign in (Connect AI > App cannot sign in?). If someone else may have seen it, make a new one: the old one stops working at once.'));
    const addrRow = h('div', 'srv-url'); addrRow.hidden = true;
    const addrInp = h('input'); addrInp.readOnly = true; addrInp.setAttribute('aria-label', 'New private AI address');
    const addrCopy = h('button', 'btn', 'Copy'); addrCopy.type = 'button';
    addrCopy.onclick = () => { navigator.clipboard?.writeText(addrInp.value).then(() => { addrCopy.textContent = 'Copied'; }, () => addrInp.select()); };
    addrRow.append(addrInp, addrCopy);
    const addrNew = h('button', 'btn', 'Make a new address'); addrNew.type = 'button';
    addrNew.onclick = async () => {
      addrNew.disabled = true;
      try {
        const r = await fetch('/api/connect/new_address', { method: 'POST' }); const j = await r.json();
        if (!r.ok || j.error) throw new Error(j.error || r.statusText);
        addrInp.value = j.mcp_url; addrRow.hidden = false; addrCopy.textContent = 'Copy';
        this.app.toast?.('New private address made. Paste it into the apps that used the old one.');
      } catch (e) { this.app.toast?.(e.message || 'Could not make a new address.'); }
      addrNew.disabled = false;
    };
    addr.append(addrNew, addrRow);
    body.append(apps, addr);
    const when = (s) => { if (!s) return ''; const d = (Date.now() / 1000 - s) / 86400; return d < 1 ? 'today' : d < 2 ? 'yesterday' : `${Math.floor(d)} days ago`; };
    const draw = (items) => {
      list.innerHTML = '';
      allOff.hidden = items.length < 2;
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
    // who it is for first (shown in People, so a link sent to the wrong chat can be found and revoked), then the link
    const body = h('div', 'acct');
    body.innerHTML = `<label class="acct-l" for="inv-note">Who is it for? (optional)</label>
      <input class="acct-i" id="inv-note" name="note" maxlength="60" autocomplete="off" placeholder="For example: Alex">
      <div class="acct-note">The link works once and lasts 7 days. You can revoke it in People on this server.</div><div class="acct-err" role="alert"></div>`;
    const note = body.querySelector('[name=note]'), err = body.querySelector('.acct-err');
    note.addEventListener('keydown', (e) => e.stopPropagation());
    const d = dialog({ title: 'Invite people', body, cls: 'acct-dlg', buttons: [{ label: 'Cancel' }, { label: 'Make link', primary: true, run: () => {
      fetch('/api/account/invites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: note.value.trim() }) })
        .then((r) => r.json()).then((j) => {
          if (j.detail || j.error) { err.textContent = j.detail || j.error; return; }
          if (this.info) { this.info.invites = j.invites; this.info.pending_invites = (j.invites || []).length; }
          d.close(); this.showInvite(j);
        }).catch(() => { err.textContent = 'Could not make the link. Check your connection and try again.'; });
      return false;
    } }] });
  }

  showInvite(j) {
    const body = h('div', 'acct');
    body.appendChild(h('p', null, `Send this link to the person you want to invite. It works once and lasts ${j.days} days. They choose their own email and password.`));
    const row = h('div', 'srv-url'); const inp = h('input'); inp.readOnly = true; inp.value = j.url; inp.setAttribute('aria-label', 'Invite link');
    const copy = h('button', 'btn primary', 'Copy'); copy.type = 'button';
    copy.onclick = () => { navigator.clipboard?.writeText(j.url).then(() => { copy.textContent = 'Copied'; }, () => { inp.select(); }); };
    row.append(inp, copy); body.appendChild(row);
    dialog({ title: 'Invite people', body, cls: 'acct-dlg', buttons: [{ label: 'Done', primary: true }] });
  }

  // Owner: invite links not used yet, each with Revoke (the link stops working at once).
  inviteList(invites) {
    const box = h('div', 'acct-invites');
    const draw = (items) => {
      box.innerHTML = '';
      if (!items.length) return;
      box.appendChild(h('div', 'acct-l', `Invite links not used yet (${items.length})`));
      const left = (t) => { const d = Math.max(0, Math.ceil((t - Date.now() / 1000) / 86400)); return d <= 1 ? 'ends within a day' : `ends in ${d} days`; };
      for (const i of items) {
        const row = h('div', 'acct-p');
        const who = h('span', 'acct-who'); who.append(h('b', null, i.note || 'Invite link'), h('span', null, left(i.expires)));
        const rm = h('button', 'btn', 'Revoke'); rm.type = 'button';
        rm.onclick = async () => {
          rm.disabled = true;
          try {
            const r = await fetch('/api/account/invites/' + encodeURIComponent(i.id), { method: 'DELETE' });
            const j = await r.json().catch(() => ({}));
            if (!r.ok && r.status !== 404) throw new Error(j.detail || r.statusText);
            const next = j.invites || items.filter((x) => x.id !== i.id);
            if (this.info) { this.info.invites = next; this.info.pending_invites = next.length; }
            draw(next); this.app.toast?.('Invite link revoked. It no longer works.');
          } catch (_) { rm.disabled = false; this.app.toast?.('Could not revoke it. Check your connection and try again.'); }
        };
        row.append(who, rm); box.appendChild(row);
      }
    };
    draw(invites);
    return box;
  }

  async people() {
    await this.load();
    const body = h('div', 'acct');
    const list = h('div', 'acct-people');
    for (const p of this.info.users || []) {
      const row = h('div', 'acct-p');
      const av = h('span', 'avatar', initials(p.name)); av.style.background = colorFor(p.email);
      const who = h('span', 'acct-who'); who.append(h('b', null, p.name), h('span', null, p.tester && !kept(p) ? 'Early access code' : p.email));
      row.append(av, who, h('span', 'acct-role', p.role === 'owner' ? 'Owner' : p.tester ? 'Internal tester' : 'Member'));
      if (p.role !== 'owner') {
        const rm = h('button', 'btn', 'Remove');
        rm.onclick = () => dialog({ title: 'Remove person', cls: 'acct-dlg', body: `<p class="fv-p">Remove <b>${esc(p.name)}</b> (${esc(p.tester && !kept(p) ? 'early access' : p.email)})? They are signed out at once and can no longer sign in. ${p.tester ? 'Their files move to your Trash.' : 'Their files move to your Files.'}</p>`,
          buttons: [{ label: 'Cancel' }, { label: 'Remove', primary: true, danger: true, run: () => {
            fetch('/api/account/users/' + encodeURIComponent(p.id), { method: 'DELETE' }).then((x) => x.json()).then((r) => {
              if (r.error) { message('People', esc(r.error)); return; }
              row.remove();
              if (p.tester) this.accessBox?.dropTester?.(); // the early-access count says one fewer
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
    body.appendChild(this.inviteList(this.info.invites || []));
    if (this.info.access) body.appendChild(this.accessBox = this.accessSection(this.info.access, list));
    dialog({ title: 'People on this server', body, cls: 'acct-dlg', buttons: [{ label: 'Invite people...', run: () => { setTimeout(() => this.invite(), 0); } }, { label: 'Done', primary: true }] });
  }

  // Owner: the early-access code. People who type it skip sign-up, appear as "Internal tester N" and use the
  // server's AI key with no limit (accounts.create_tester, aikeys.effective).
  accessSection(st, list) {
    const box = h('div', 'acct-access');
    box.appendChild(h('div', 'acct-l', 'Early access'));
    const tog = h('label', 'acct-toggle');
    const cb = h('input'); cb.type = 'checkbox'; cb.checked = !!st.on;
    tog.append(cb, h('span', null, 'Anyone with the code can try OpenSketch without signing up'));
    const row = h('div', 'srv-url');
    const inp = h('input', 'acct-i'); inp.value = st.code || ''; inp.placeholder = 'access20'; inp.spellcheck = false; inp.autocomplete = 'off';
    inp.addEventListener('keydown', (e) => e.stopPropagation());
    const save = h('button', 'btn', 'Save code');
    row.append(inp, save);
    const link = h('div', 'acct-note');
    const note = h('div', 'acct-note');
    const err = h('div', 'acct-err'); err.setAttribute('role', 'alert');
    const testers = h('div', 'acct-g');
    const show = (a) => {
      st = a; cb.checked = !!a.on; inp.value = a.code || '';
      link.innerHTML = a.on ? `They go to <b>${esc(a.link)}</b> and type the code, or use <b>${esc(a.link)}?code=${esc(encodeURIComponent(a.code))}</b>.`
        : 'Off: the code does not work and testers have no AI. They can still open their own files.';
      note.textContent = 'Testers get their own Files, show up as Internal tester, and use your AI key with no limit while the code is on, so share it only with people you trust. '
        + 'Turning it off stops new testers and their AI at once. People who already came in keep their account and files until you remove them.';
      testers.innerHTML = '';
      testers.append(h('span', null, `${a.testers} internal tester${a.testers === 1 ? '' : 's'}.`));
      if (a.testers) {
        const rm = h('button', 'btn', 'Remove all testers');
        rm.onclick = () => dialog({ title: 'Remove all testers', cls: 'acct-dlg', body: `<p class="fv-p">Remove all ${a.testers} internal testers? They are signed out at once. Their files move to your Trash, where they are kept 30 days.</p>`,
          buttons: [{ label: 'Cancel' }, { label: 'Remove all', primary: true, danger: true, run: () => {
            fetch('/api/account/testers', { method: 'DELETE' }).then((x) => x.json()).then((r) => {
              if (r.error || r.detail) { message('People', esc(r.error || r.detail)); return; }
              list.querySelectorAll('.acct-p').forEach((el) => { if (el.querySelector('.acct-role')?.textContent === 'Internal tester') el.remove(); });
              show({ ...st, testers: 0 });
            }).catch(() => message('People', 'Could not remove them. Check your connection and try again.'));
          } }] });
        testers.appendChild(rm);
      }
    };
    const send = async (payload) => {
      err.textContent = '';
      try {
        const r = await fetch('/api/account/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const j = await r.json();
        if (!r.ok || j.error) throw new Error(j.error || j.detail || 'Could not save.');
        show(j.access); this.info.access = j.access;
        return true;
      } catch (e) { err.textContent = e.message; return false; }
    };
    cb.onchange = async () => { if (!(await send({ access_on: cb.checked, access_code: inp.value.trim() }))) cb.checked = !cb.checked; };
    save.onclick = async () => { if (await send({ access_code: inp.value.trim() })) this.app.toast?.('Access code saved.'); };
    box.append(tog, row, link, note, err, testers);
    show(st);
    box.dropTester = () => show({ ...st, testers: Math.max(0, (st.testers || 0) - 1) });
    return box;
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
