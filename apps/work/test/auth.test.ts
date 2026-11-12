import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { PASSWORD, login, raw, signup, signupWith, uniqueEmail } from './helpers';

describe('authentication', () => {
  it('rejects weak passwords and duplicate accounts', async () => {
    const email = uniqueEmail();
    let res = await raw('POST', '/api/auth/signup', { body: { email, name: 'W', password: 'short' } });
    expect(res.status).toBe(400);
    res = await raw('POST', '/api/auth/signup', { body: { email, name: 'W', password: 'alllettersonly' } });
    expect(res.status).toBe(400);
    await signup('Dup', email);
    res = await raw('POST', '/api/auth/signup', { body: { email, name: 'W', password: PASSWORD } });
    expect(res.status).toBe(409);
  });

  it('stores passwords hashed, never in plain text', async () => {
    const c = await signup();
    const row = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(c.userId).first<{ password_hash: string }>();
    expect(row!.password_hash).toMatch(/^pbkdf2\$100000\$/);
    expect(row!.password_hash).not.toContain(PASSWORD);
    const sess = await env.DB.prepare('SELECT token_hash FROM sessions WHERE user_id = ?').bind(c.userId).first<{ token_hash: string }>();
    expect(c.cookie).not.toContain(sess!.token_hash);
  });

  it('login with correct credentials works; wrong password gives a generic error', async () => {
    const c = await signup();
    const again = await login(c.email);
    expect(again.userId).toBe(c.userId);
    const bad = await raw('POST', '/api/auth/login', { body: { email: c.email, password: 'wrong-password-1' } });
    expect(bad.status).toBe(401);
    const unknown = await raw('POST', '/api/auth/login', { body: { email: uniqueEmail(), password: 'wrong-password-1' } });
    expect(unknown.status).toBe(401);
    expect(((await bad.json()) as any).error).toBe(((await unknown.json()) as any).error);
  });

  it('session cookie is HttpOnly and SameSite', async () => {
    const res = await raw('POST', '/api/auth/signup', { body: { email: uniqueEmail(), name: 'C', password: PASSWORD } });
    const cookie = res.headers.get('Set-Cookie')!;
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).toMatch(/Path=\//);
  });

  it('logout revokes the session', async () => {
    const c = await signup();
    expect((await c.req('GET', '/api/workspaces')).status).toBe(200);
    expect((await c.req('POST', '/api/auth/logout', {})).status).toBe(200);
    expect((await c.req('GET', '/api/workspaces')).status).toBe(401);
  });

  it('expired sessions are rejected', async () => {
    const c = await signup();
    await env.DB.prepare('UPDATE sessions SET expires_at = ? WHERE user_id = ?').bind(Date.now() - 1000, c.userId).run();
    expect((await c.req('GET', '/api/workspaces')).status).toBe(401);
  });

  it('can list and revoke other sessions; password change revokes others', async () => {
    const a = await signup();
    const b = await login(a.email);
    const sessions = await a.json('GET', '/api/me/sessions');
    expect(sessions.length).toBe(2);
    expect(sessions.filter((s: any) => s.current)).toHaveLength(1);
    const other = sessions.find((s: any) => !s.current);
    await a.json('DELETE', `/api/me/sessions/${other.id}`);
    expect((await b.req('GET', '/api/workspaces')).status).toBe(401);

    const c = await login(a.email);
    let res = await a.req('POST', '/api/me/password', { currentPassword: 'nope-nope-1', newPassword: 'another-pass-99' });
    expect(res.status).toBe(403);
    res = await a.req('POST', '/api/me/password', { currentPassword: PASSWORD, newPassword: 'another-pass-99' });
    expect(res.status).toBe(200);
    expect((await c.req('GET', '/api/workspaces')).status).toBe(401);
    expect((await a.req('GET', '/api/workspaces')).status).toBe(200);
    await login(a.email, 'another-pass-99');
  });

  it('rate limits login attempts per email and locks the account', async () => {
    const c = await signup();
    let last = 0;
    for (let i = 0; i < 11; i++) {
      const r = await raw('POST', '/api/auth/login', { body: { email: c.email, password: `bad-password-${i}` } });
      last = r.status;
    }
    expect(last).toBe(429);
    // Lockout is recorded after 10 failures.
    const row = await env.DB.prepare('SELECT locked_until FROM users WHERE id = ?').bind(c.userId).first<{ locked_until: number | null }>();
    expect(row!.locked_until).toBeGreaterThan(Date.now());
    await env.DB.prepare("DELETE FROM rate_limits WHERE key LIKE 'login:email:%'").run();
    const locked = await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } });
    expect(locked.status).toBe(423);
  });

  it('rate limits login per IP', async () => {
    const ip = '203.0.113.77';
    let status = 0;
    for (let i = 0; i < 31; i++) {
      const r = await raw('POST', '/api/auth/login', { body: { email: uniqueEmail(), password: 'x-password-1' }, headers: { 'CF-Connecting-IP': ip } });
      status = r.status;
    }
    expect(status).toBe(429);
  });

  it('config endpoint reports google disabled without credentials', async () => {
    const res = await raw('GET', '/api/auth/config');
    const cfg = (await res.json()) as any;
    expect(cfg.providers.find((p: any) => p.id === 'google').enabled).toBe(false);
    const start = await raw('GET', '/api/auth/oauth/google/start');
    expect(start.status).toBe(503);
    const cb = await raw('GET', '/api/auth/oauth/google/callback?code=x&state=y');
    expect(cb.status).toBe(302);
    expect(cb.headers.get('Location')).toContain('/login?error=');
  });

  it('API tokens authenticate and revoked tokens fail', async () => {
    const c = await signup();
    const t = await c.json('POST', '/api/me/tokens', { name: 'ci' });
    expect(t.token).toMatch(/^wos_/);
    const list = await c.json('GET', '/api/me/tokens');
    expect(JSON.stringify(list)).not.toContain(t.token);
    expect(JSON.stringify(list)).not.toContain('token_hash');
    const ok = await raw('GET', '/api/workspaces', { headers: { Authorization: `Bearer ${t.token}` } });
    expect(ok.status).toBe(200);
    // Bearer requests do not need CSRF tokens.
    const post = await raw('POST', `/api/workspaces/${c.workspaceId}/boards`, { body: { name: 'via api' }, headers: { Authorization: `Bearer ${t.token}`, Origin: '' } });
    expect(post.status).toBe(201);
    // Tokens cannot mint tokens.
    const mint = await raw('POST', '/api/me/tokens', { body: { name: 'x' }, headers: { Authorization: `Bearer ${t.token}` } });
    expect(mint.status).toBe(403);
    await c.json('DELETE', `/api/me/tokens/${t.id}`);
    const revoked = await raw('GET', '/api/workspaces', { headers: { Authorization: `Bearer ${t.token}` } });
    expect(revoked.status).toBe(401);
    const garbage = await raw('GET', '/api/workspaces', { headers: { Authorization: 'Bearer wos_garbage' } });
    expect(garbage.status).toBe(401);
  });

  it('disabled users cannot sign in or use sessions', async () => {
    const c = await signup();
    await env.DB.prepare('UPDATE users SET disabled_at = ? WHERE id = ?').bind(Date.now(), c.userId).run();
    expect((await c.req('GET', '/api/workspaces')).status).toBe(401);
    const r = await raw('POST', '/api/auth/login', { body: { email: c.email, password: PASSWORD } });
    expect(r.status).toBe(401);
  });
});

describe('invitations', () => {
  it('invite link lets the invited email join; other users cannot accept', async () => {
    const owner = await signup('Owner');
    const invitee = await signup('Invitee');
    const stranger = await signup('Stranger');
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: invitee.email, role: 'member' });
    expect(inv.emailDelivery).toBe('not_configured');
    const token = inv.inviteUrl.split('/invite/')[1];
    const info = (await (await raw('GET', `/api/auth/invitations/${token}`)).json()) as any;
    expect(info.status).toBe('pending');
    expect((await stranger.req('POST', `/api/auth/invitations/${token}/accept`, {})).status).toBe(403);
    await invitee.json('POST', `/api/auth/invitations/${token}/accept`, {});
    const ws = await invitee.json('GET', '/api/workspaces');
    expect(ws.map((w: any) => w.id)).toContain(owner.workspaceId);
    // Invitation notification for existing user.
    const n = await invitee.json('GET', '/api/notifications');
    expect(n.notifications.some((x: any) => x.type === 'invitation')).toBe(true);
  });

  it('invited people can sign up even when signup is otherwise allowed and land in the workspace', async () => {
    const owner = await signup('Owner2');
    const email = uniqueEmail('new');
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email, role: 'viewer' });
    // Since 12 Nov 2026 the invitation's token (from the email or the shared link) is what joins the workspace.
    const fresh = await signupWith('Newbie', email, inv.inviteUrl.split('/invite/')[1]);
    const ws = await fresh.json('GET', '/api/workspaces');
    expect(ws).toHaveLength(1);
    expect(ws[0].id).toBe(owner.workspaceId);
    expect(ws[0].role).toBe('viewer');
  });

  it('knowing an invited address is not enough: signing up with it but without the token joins nothing', async () => {
    const owner = await signup('Owner3');
    const email = uniqueEmail('target');
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email, role: 'admin' });
    const impostor = await signup('Impostor', email);
    const ws = await impostor.json('GET', '/api/workspaces');
    expect(ws.some((w: any) => w.id === owner.workspaceId)).toBe(false);
    expect((await impostor.req('GET', `/api/workspaces/${owner.workspaceId}/boards`)).status).toBe(404);
    // Signing in again does not accept it either.
    const again = await login(email);
    expect((await again.json('GET', '/api/workspaces')).some((w: any) => w.id === owner.workspaceId)).toBe(false);
    const list = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/invitations`);
    expect(list.find((i: any) => i.id === inv.id).status).toBe('pending');
  });

  it('an invitation token works once', async () => {
    const owner = await signup();
    const invitee = await signup();
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: invitee.email });
    const token = inv.inviteUrl.split('/invite/')[1];
    await invitee.json('POST', `/api/auth/invitations/${token}/accept`, {});
    // The same person again: fine (idempotent); the stored hash is never returned.
    expect((await invitee.req('POST', `/api/auth/invitations/${token}/accept`, {})).status).toBe(200);
    const list = await owner.json('GET', `/api/workspaces/${owner.workspaceId}/invitations`);
    expect(list[0].status).toBe('accepted');
    expect(list[0].token_hash).toBeUndefined();
    const rows = await env.DB.prepare('SELECT token_hash FROM invitations WHERE id = ?').bind(inv.id).all<{ token_hash: string }>();
    expect(rows.results[0].token_hash).not.toContain(token);
  });

  it('revoked or expired invitations cannot be used', async () => {
    const owner = await signup();
    const invitee = await signup();
    const inv = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: invitee.email });
    await owner.json('DELETE', `/api/workspaces/${owner.workspaceId}/invitations/${inv.id}`);
    const token = inv.inviteUrl.split('/invite/')[1];
    expect((await invitee.req('POST', `/api/auth/invitations/${token}/accept`, {})).status).toBe(404);
    const inv2 = await owner.json('POST', `/api/workspaces/${owner.workspaceId}/invitations`, { email: invitee.email });
    await env.DB.prepare('UPDATE invitations SET expires_at = ? WHERE id = ?').bind(Date.now() - 1, inv2.id).run();
    expect((await invitee.req('POST', `/api/auth/invitations/${inv2.inviteUrl.split('/invite/')[1]}/accept`, {})).status).toBe(410);
  });
});
