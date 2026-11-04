import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { z } from 'zod';
import type { AppConfigDTO } from '../../shared/types';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, now, randomToken, sha256Hex } from '../lib/util';
import { hashPassword, passwordProblems, verifyPassword } from '../auth/password';
import { rateLimit, resetRateLimit } from '../auth/rate-limit';
import { checkOrigin, createSession, destroySession, isSecureEnv, requireAuth, resolveAuth } from '../auth/session';
import { getProvider, pkceChallenge, providers } from '../auth/providers';
import { audit } from '../services/audit';
import { acceptPendingInvitations, createWorkspaceStmts, listWorkspaces, userDTO, type UserRow } from './helpers';

export const authRoutes = new Hono<AppEnv>();

const LOCK_THRESHOLD = 10;
const LOCK_MS = 15 * 60_000;

const signupAllowed = (env: AppEnv['Bindings']) => env.ALLOW_SIGNUP === 'true';

authRoutes.get('/config', (c) => {
  const cfg: AppConfigDTO = {
    appName: c.env.APP_NAME || 'WorkOS',
    environment: c.env.ENVIRONMENT,
    allowSignup: signupAllowed(c.env),
    providers: [
      { id: 'password', name: 'Email and password', enabled: true },
      ...providers.map((p) => ({ id: p.id, name: p.name, enabled: p.isConfigured(c.env) })),
    ],
  };
  return c.json(cfg);
});

const emailSchema = z.string().trim().toLowerCase().email().max(320);

authRoutes.post('/signup', async (c) => {
  checkOrigin(c);
  const ip = clientIp(c);
  await rateLimit(c.env.DB, `signup:ip:${ip}`, 10, 60 * 60_000);
  const input = await body(c, z.object({ email: emailSchema, name: z.string().trim().min(1).max(100), password: z.string().max(256) }));
  const hasInvite = await c.env.DB.prepare('SELECT 1 FROM invitations WHERE email = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?')
    .bind(input.email, now())
    .first();
  if (!signupAllowed(c.env) && !hasInvite) throw new HttpError(403, 'Sign-up is by invitation only');
  const problem = passwordProblems(input.password, input.email);
  if (problem) throw new HttpError(400, problem);
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(input.email).first();
  if (existing) throw new HttpError(409, 'An account with this email already exists. Sign in instead.');
  const userId = newId();
  const t = now();
  const stmts = [
    c.env.DB.prepare('INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').bind(
      userId,
      input.email,
      input.name,
      await hashPassword(input.password),
      t,
      t,
    ),
  ];
  if (!hasInvite) stmts.push(...createWorkspaceStmts(c.env.DB, { name: `${input.name.split(' ')[0]}'s workspace`, ownerId: userId }).stmts);
  await c.env.DB.batch(stmts);
  await acceptPendingInvitations(c.env.DB, userId, input.email);
  const session = await createSession(c, userId, 'password');
  await audit(c.env.DB, { actorId: userId, action: 'user.signup', targetType: 'user', targetId: userId, ip });
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>();
  return c.json({ user: userDTO(user!), csrfToken: session.csrfToken, workspaces: await listWorkspaces(c.env.DB, userId) }, 201);
});

authRoutes.post('/login', async (c) => {
  checkOrigin(c);
  const ip = clientIp(c);
  const input = await body(c, z.object({ email: emailSchema, password: z.string().max(256) }));
  await rateLimit(c.env.DB, `login:ip:${ip}`, 30, 15 * 60_000);
  await rateLimit(c.env.DB, `login:email:${input.email}`, 10, 15 * 60_000);
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(input.email).first<UserRow>();
  const t = now();
  if (user?.locked_until && user.locked_until > t) {
    throw new HttpError(423, 'This account is temporarily locked after repeated failed sign-ins. Try again later.');
  }
  const valid = await verifyPassword(input.password, user?.password_hash ?? null);
  if (!user || !valid || user.disabled_at) {
    if (user) {
      const fails = user.failed_logins + 1;
      await c.env.DB.prepare('UPDATE users SET failed_logins = ?, locked_until = ? WHERE id = ?')
        .bind(fails >= LOCK_THRESHOLD ? 0 : fails, fails >= LOCK_THRESHOLD ? t + LOCK_MS : null, user.id)
        .run();
      await audit(c.env.DB, { actorId: user.id, action: 'auth.login_failed', ip });
    }
    throw new HttpError(401, 'Invalid email or password');
  }
  await c.env.DB.prepare('UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = ?').bind(user.id).run();
  await resetRateLimit(c.env.DB, `login:email:${input.email}`);
  await acceptPendingInvitations(c.env.DB, user.id, user.email);
  const session = await createSession(c, user.id, 'password');
  await audit(c.env.DB, { actorId: user.id, action: 'auth.login', ip });
  return c.json({ user: userDTO(user), csrfToken: session.csrfToken, workspaces: await listWorkspaces(c.env.DB, user.id) });
});

authRoutes.post('/logout', requireAuth, async (c) => {
  await destroySession(c);
  return c.json({ ok: true });
});

authRoutes.get('/me', async (c) => {
  const auth = await resolveAuth(c);
  if (!auth) throw new HttpError(401, 'Authentication required');
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(auth.user.id).first<UserRow>();
  return c.json({ user: userDTO(user!), csrfToken: auth.session?.csrfToken ?? null, workspaces: await listWorkspaces(c.env.DB, auth.user.id) });
});

// ------------------------------------------------------------------ OAuth

const STATE_COOKIE = 'workos_oauth_state';

authRoutes.get('/oauth/:provider/start', async (c) => {
  const provider = getProvider(c.req.param('provider'));
  if (!provider) throw new HttpError(404, 'Unknown provider');
  if (!provider.isConfigured(c.env)) throw new HttpError(503, `${provider.name} sign-in is not configured on this deployment`);
  await rateLimit(c.env.DB, `oauth:ip:${clientIp(c)}`, 30, 15 * 60_000);
  const next = c.req.query('next');
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/';
  let linkUserId: string | null = null;
  if (c.req.query('link') === '1') {
    const auth = await resolveAuth(c);
    if (!auth) throw new HttpError(401, 'Sign in before linking an account');
    linkUserId = auth.user.id;
  }
  const state = randomToken(24);
  const verifier = randomToken(48);
  const t = now();
  await c.env.DB.prepare('INSERT INTO oauth_states (state, provider, code_verifier, redirect_to, link_user_id, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(state, provider.id, verifier, safeNext, linkUserId, t, t + 10 * 60_000)
    .run();
  setCookie(c, STATE_COOKIE, state, { httpOnly: true, secure: isSecureEnv(c.env), sameSite: 'Lax', path: '/api/auth/oauth', maxAge: 600 });
  const redirectUri = `${new URL(c.req.url).origin}/api/auth/oauth/${provider.id}/callback`;
  return c.redirect(provider.authorizeUrl(c.env, { state, codeChallenge: await pkceChallenge(verifier), redirectUri }), 302);
});

authRoutes.get('/oauth/:provider/callback', async (c) => {
  const provider = getProvider(c.req.param('provider'));
  const fail = (code: string) => c.redirect(`/login?error=${code}`, 302);
  if (!provider || !provider.isConfigured(c.env)) return fail('provider_unavailable');
  const state = c.req.query('state') ?? '';
  const code = c.req.query('code') ?? '';
  const cookieState = getCookie(c, STATE_COOKIE);
  deleteCookie(c, STATE_COOKIE, { path: '/api/auth/oauth' });
  if (!state || !code || state !== cookieState) return fail('invalid_state');
  const row = await c.env.DB.prepare('DELETE FROM oauth_states WHERE state = ? AND provider = ? RETURNING *')
    .bind(state, provider.id)
    .first<{ code_verifier: string; redirect_to: string | null; link_user_id: string | null; expires_at: number }>();
  if (!row || row.expires_at < now()) return fail('expired_state');
  let profile;
  try {
    profile = await provider.exchange(c.env, { code, codeVerifier: row.code_verifier, redirectUri: `${new URL(c.req.url).origin}/api/auth/oauth/${provider.id}/callback` });
  } catch (e) {
    console.warn('oauth exchange failed', e);
    return fail('exchange_failed');
  }
  const db = c.env.DB;
  const t = now();
  let userId: string | null = null;
  const identity = await db.prepare('SELECT user_id FROM user_identities WHERE provider = ? AND provider_subject = ?').bind(provider.id, profile.subject).first<{ user_id: string }>();
  if (identity) userId = identity.user_id;
  else if (row.link_user_id) {
    userId = row.link_user_id;
    await db.prepare('INSERT INTO user_identities (id, user_id, provider, provider_subject, email, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), userId, provider.id, profile.subject, profile.email, t).run();
  } else {
    if (!profile.emailVerified) return fail('email_not_verified');
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(profile.email).first<{ id: string }>();
    if (existing) userId = existing.id;
    else {
      const invited = await db.prepare('SELECT 1 FROM invitations WHERE email = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?').bind(profile.email, t).first();
      if (!signupAllowed(c.env) && !invited) return fail('signup_disabled');
      userId = newId();
      const stmts = [db.prepare('INSERT INTO users (id, email, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)').bind(userId, profile.email, profile.name.slice(0, 100), t, t)];
      if (!invited) stmts.push(...createWorkspaceStmts(db, { name: `${profile.name.split(' ')[0]}'s workspace`, ownerId: userId }).stmts);
      await db.batch(stmts);
    }
    await db.prepare('INSERT INTO user_identities (id, user_id, provider, provider_subject, email, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), userId, provider.id, profile.subject, profile.email, t).run();
  }
  const user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>();
  if (!user || user.disabled_at) return fail('account_disabled');
  await acceptPendingInvitations(db, user.id, user.email);
  if (!row.link_user_id) await createSession(c, user.id, provider.id);
  await audit(db, { actorId: user.id, action: row.link_user_id ? 'auth.identity_linked' : 'auth.login', metadata: { provider: provider.id }, ip: clientIp(c) });
  return c.redirect(row.link_user_id ? '/settings/security?linked=1' : row.redirect_to ?? '/', 302);
});

// ------------------------------------------------------------ invitations

authRoutes.get('/invitations/:token', async (c) => {
  await rateLimit(c.env.DB, `invite:ip:${clientIp(c)}`, 60, 15 * 60_000);
  const inv = await c.env.DB.prepare(
    `SELECT i.email, i.role, i.expires_at, i.accepted_at, i.revoked_at, w.name AS workspace_name, u.name AS inviter
     FROM invitations i JOIN workspaces w ON w.id = i.workspace_id JOIN users u ON u.id = i.invited_by WHERE i.token_hash = ?`,
  )
    .bind(await sha256Hex(c.req.param('token')))
    .first<{ email: string; role: string; expires_at: number; accepted_at: number | null; revoked_at: number | null; workspace_name: string; inviter: string }>();
  if (!inv) throw new HttpError(404, 'Invitation not found');
  const status = inv.revoked_at ? 'revoked' : inv.accepted_at ? 'accepted' : inv.expires_at < now() ? 'expired' : 'pending';
  return c.json({ email: inv.email, role: inv.role, workspaceName: inv.workspace_name, inviterName: inv.inviter, status });
});

authRoutes.post('/invitations/:token/accept', requireAuth, async (c) => {
  const user = c.get('user');
  const inv = await c.env.DB.prepare('SELECT * FROM invitations WHERE token_hash = ?')
    .bind(await sha256Hex(c.req.param('token')))
    .first<{ id: string; workspace_id: string; email: string; role: string; expires_at: number; accepted_at: number | null; revoked_at: number | null }>();
  if (!inv || inv.revoked_at) throw new HttpError(404, 'Invitation not found');
  if (inv.expires_at < now()) throw new HttpError(410, 'This invitation has expired');
  if (inv.email.toLowerCase() !== user.email.toLowerCase()) throw new HttpError(403, `This invitation was sent to ${inv.email}. Sign in with that account to accept it.`);
  const t = now();
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT OR IGNORE INTO workspace_members (workspace_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)').bind(inv.workspace_id, user.id, inv.role, t),
    c.env.DB.prepare('UPDATE invitations SET accepted_at = COALESCE(accepted_at, ?) WHERE id = ?').bind(t, inv.id),
  ]);
  await audit(c.env.DB, { workspaceId: inv.workspace_id, actorId: user.id, action: 'member.joined', targetType: 'user', targetId: user.id });
  return c.json({ workspaceId: inv.workspace_id });
});
