import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { z } from 'zod';
import type { AppConfigDTO } from '../../shared/types';
import { PRODUCT } from '../../shared/brand';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, newId, now, randomToken, sha256Hex } from '../lib/util';
import { hashPassword, passwordProblems, verifyPassword } from '../auth/password';
import { rateLimit, resetRateLimit } from '../auth/rate-limit';
import { checkOrigin, createSession, destroySession, isSecureEnv, requireAuth, resolveAuth } from '../auth/session';
// Inside the System (/system/tasks, ...) a provider returns to the tool's own address, the one registered with it.
import { appOf } from '../mount';
import { getProvider, pkceChallenge, providers } from '../auth/providers';
import { audit } from '../services/audit';
import { bumpMetric, eventStmt } from '../services/analytics';
import { createWorkspaceStmts, listWorkspaces, userDTO, type UserRow } from './helpers';
import { acceptInvitation, type InvitationRow } from '../services/invitations';
import { notify } from '../services/notify';
import { systemSvc } from '../services/context';
import { ROLE_LABELS } from '../../shared/permissions';
import type { WorkspaceRole } from '../../shared/types';
import { checkAddress, loadPolicy, refusalMetadata, type AddressCheck } from '../services/signup-guard';
import { confirmEmail, sendVerification, verificationActive } from '../services/email-verification';
import { getPlatformRole } from '../services/platform-admin';

/** A refused address: logged with its domain and reason only, answered with the reason in plain words. */
async function refuse(c: any, check: Extract<AddressCheck, { ok: false }>, where: 'signup' | 'login' | 'oauth', actorId: string | null = null): Promise<never> {
  await audit(c.env.DB, { actorId, action: `${where === 'login' ? 'auth.login' : 'signup'}.refused`, metadata: refusalMetadata(check, where), ip: clientIp(c) });
  await bumpMetric(c.env.DB, 'signup_refused');
  throw new HttpError(where === 'login' ? 403 : 400, check.message, { code: 'EMAIL_NOT_ALLOWED', reason: check.reason });
}

/** A pending, unexpired invitation for this token and email, or null. */
async function pendingInvite(db: D1Database, token: string | undefined, email: string): Promise<InvitationRow | null> {
  if (!token || token.length > 200) return null;
  const inv = await db.prepare('SELECT * FROM invitations WHERE token_hash = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?').bind(await sha256Hex(token), now()).first<InvitationRow>();
  return inv && inv.email.toLowerCase() === email.toLowerCase() ? inv : null;
}

/** Accept with the token after sign-up or sign-in, tell the inviter, and return where to go. */
async function acceptWithToken(c: any, token: string, user: { id: string; email: string; name: string }) {
  const r = await acceptInvitation(c.env.DB, token, user, clientIp(c));
  if (!r.already) await tellInviter(c, r.inv, user);
  return r;
}

async function tellInviter(c: any, inv: InvitationRow, user: { id: string; email: string; name: string }) {
  const ws = await c.env.DB.prepare('SELECT name FROM workspaces WHERE id = ?').bind(inv.workspace_id).first();
  const svc = { ...systemSvc(c.env, (p: Promise<unknown>) => c.executionCtx.waitUntil(p)), actor: user };
  await notify(svc, {
    workspaceId: inv.workspace_id,
    userIds: [inv.invited_by],
    type: 'invitation_accepted',
    title: `${user.name} accepted your invitation to ${ws?.name ?? 'the workspace'}`,
    body: `Role: ${ROLE_LABELS[inv.role as WorkspaceRole] ?? inv.role}`,
    link: `/w/${inv.workspace_id}/settings/members`,
    entityType: 'workspace',
    entityId: inv.workspace_id,
    email: { template: 'invitation_accepted', organisation: ws?.name ?? '', person: user.name, email: user.email, role: ROLE_LABELS[inv.role as WorkspaceRole] ?? inv.role, url: `/w/${inv.workspace_id}/settings/members` },
  });
}

export const authRoutes = new Hono<AppEnv>();

const LOCK_THRESHOLD = 10;
const LOCK_MS = 15 * 60_000;

const signupAllowed = (env: AppEnv['Bindings']) => env.ALLOW_SIGNUP === 'true';

authRoutes.get('/config', (c) => {
  const cfg: AppConfigDTO = {
    appName: c.env.APP_NAME || PRODUCT.full,
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
  const input = await body(
    c,
    z.object({
      email: emailSchema,
      name: z.string().trim().min(1).max(100),
      password: z.string().max(256),
      inviteToken: z.string().max(200).optional(),
      // A field people never see (the sign-up form hides it): only form-filling robots put something in it.
      website: z.string().max(500).optional(),
    }),
  );
  if (input.website?.trim()) {
    await audit(c.env.DB, { action: 'signup.refused', metadata: { where: 'signup', reason: 'bot', domain: input.email.split('@').pop() }, ip });
    await bumpMetric(c.env.DB, 'signup_refused');
    throw new HttpError(400, 'The account could not be created. Please try again.');
  }
  // An invitation counts only with its token (from the email or the link the inviter shared): knowing that an address
  // was invited is not enough to join an organisation.
  const invite = await pendingInvite(c.env.DB, input.inviteToken, input.email);
  const hasInvite = !!invite;
  if (!signupAllowed(c.env) && !hasInvite) throw new HttpError(403, 'Sign-up is by invitation only');
  // Only addresses that can really receive mail (services/signup-guard.ts).
  const policy = await loadPolicy(c.env.DB);
  const check = await checkAddress(c.env, input.email, policy);
  if (!check.ok) await refuse(c, check, 'signup');
  const problem = passwordProblems(input.password, input.email);
  if (problem) throw new HttpError(400, problem);
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(input.email).first();
  if (existing) throw new HttpError(409, 'An account with this email already exists. Sign in instead.');
  const userId = newId();
  const t = now();
  // An invitation was sent to this address (and its token was presented), so the address counts as confirmed.
  const mustConfirm = !hasInvite && (await verificationActive(c.env, policy));
  const stmts = [
    c.env.DB.prepare('INSERT INTO users (id, email, name, password_hash, email_verified_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(
      userId,
      input.email,
      input.name,
      await hashPassword(input.password),
      hasInvite ? t : null,
      t,
      t,
    ),
  ];
  stmts.push(eventStmt(c.env.DB, { type: 'user.registered', userId, entityType: 'user', entityId: userId, metadata: { provider: 'password', invited: !!hasInvite }, at: t }));
  if (!hasInvite) stmts.push(...createWorkspaceStmts(c.env.DB, { name: `${input.name.split(' ')[0]}'s workspace`, ownerId: userId }).stmts);
  await c.env.DB.batch(stmts);
  let joined: string | null = null;
  if (invite && input.inviteToken) joined = (await acceptWithToken(c, input.inviteToken, { id: userId, email: input.email, name: input.name })).inv.workspace_id;
  await audit(c.env.DB, { actorId: userId, action: 'user.signup', targetType: 'user', targetId: userId, metadata: { confirmationSent: mustConfirm }, ip });
  if (mustConfirm) {
    // No session yet: the person signs in after opening the link sent to the address.
    await sendVerification(c.env, { id: userId, email: input.email, name: input.name });
    return c.json({ verificationRequired: true, email: input.email }, 202);
  }
  const session = await createSession(c, userId, 'password');
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>();
  return c.json({ user: userDTO(user!), csrfToken: session.csrfToken, workspaces: await listWorkspaces(c.env.DB, userId), joinedWorkspaceId: joined }, 201);
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
    await bumpMetric(c.env.DB, 'auth_login_failed');
    throw new HttpError(401, 'Invalid email or password');
  }
  await c.env.DB.prepare('UPDATE users SET failed_logins = 0, locked_until = NULL WHERE id = ?').bind(user.id).run();
  await resetRateLimit(c.env.DB, `login:email:${input.email}`);
  // Only after the password is right, so these answers never reveal whether an account exists. Platform admins are
  // never refused here, so a policy change cannot lock the founder out.
  if (!(await getPlatformRole(c.env.DB, user.id))) {
    const policy = await loadPolicy(c.env.DB);
    const check = await checkAddress(c.env, user.email, policy, { dns: false });
    if (!check.ok) await refuse(c, check, 'login', user.id);
    if (!user.email_verified_at && (await verificationActive(c.env, policy))) {
      const sent = await sendVerification(c.env, { id: user.id, email: user.email, name: user.name });
      await audit(c.env.DB, { actorId: user.id, action: 'auth.login_unconfirmed', metadata: { linkSent: sent }, ip });
      throw new HttpError(403, `Confirm your email address first. ${sent ? 'We have just sent a link' : 'A link was sent'} to ${user.email}: open it, then sign in.`, { code: 'EMAIL_UNVERIFIED', email: user.email });
    }
  }
  const session = await createSession(c, user.id, 'password');
  await audit(c.env.DB, { actorId: user.id, action: 'auth.login', ip });
  return c.json({ user: userDTO(user), csrfToken: session.csrfToken, workspaces: await listWorkspaces(c.env.DB, user.id), platformRole: await getPlatformRole(c.env.DB, user.id) });
});

// ------------------------------------------------------------ email confirmation

authRoutes.post('/verify-email', async (c) => {
  checkOrigin(c);
  const ip = clientIp(c);
  await rateLimit(c.env.DB, `verify:ip:${ip}`, 30, 15 * 60_000);
  const input = await body(c, z.object({ token: z.string().min(10).max(200) }));
  const r = await confirmEmail(c.env.DB, input.token);
  if (!r.ok) {
    const msg = {
      invalid: 'This confirmation link is not valid. Sign in to get a new one.',
      expired: 'This confirmation link has expired. Sign in to get a new one.',
      used: 'This confirmation link was already used. Sign in to get a new one.',
      changed: 'This link was for a different email address. Sign in to get a new one.',
    }[r.reason];
    throw new HttpError(400, msg, { code: 'LINK_' + r.reason.toUpperCase() });
  }
  if (!r.already) await audit(c.env.DB, { actorId: r.userId ?? null, action: 'auth.email_verified', targetType: 'user', targetId: r.userId, ip });
  return c.json({ ok: true, email: r.email });
});

/** A new confirmation link. The answer is the same whether or not the address has an account. */
authRoutes.post('/verify-email/resend', async (c) => {
  checkOrigin(c);
  const ip = clientIp(c);
  const input = await body(c, z.object({ email: emailSchema }));
  await rateLimit(c.env.DB, `verify-resend:ip:${ip}`, 10, 60 * 60_000);
  await rateLimit(c.env.DB, `verify-resend:email:${input.email}`, 5, 60 * 60_000);
  const user = await c.env.DB.prepare('SELECT id, email, name, email_verified_at, disabled_at FROM users WHERE email = ?').bind(input.email).first<{ id: string; email: string; name: string; email_verified_at: number | null; disabled_at: number | null }>();
  if (user && !user.email_verified_at && !user.disabled_at && (await verificationActive(c.env))) {
    await sendVerification(c.env, user);
  }
  return c.json({ ok: true });
});

authRoutes.post('/logout', requireAuth, async (c) => {
  await destroySession(c);
  return c.json({ ok: true });
});

authRoutes.get('/me', async (c) => {
  const auth = await resolveAuth(c);
  if (!auth) throw new HttpError(401, 'Authentication required');
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(auth.user.id).first<UserRow>();
  const { getPlatformRole } = await import('../services/platform-admin');
  const platformRole = auth.kind === 'session' ? await getPlatformRole(c.env.DB, auth.user.id) : null;
  return c.json({ user: userDTO(user!), csrfToken: auth.session?.csrfToken ?? null, workspaces: await listWorkspaces(c.env.DB, auth.user.id), platformRole });
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
  const redirectUri = `${new URL(c.req.url).origin}${appOf(c.env.BASE_PATH ?? '')}/api/auth/oauth/${provider.id}/callback`;
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
    profile = await provider.exchange(c.env, { code, codeVerifier: row.code_verifier, redirectUri: `${new URL(c.req.url).origin}${appOf(c.env.BASE_PATH ?? '')}/api/auth/oauth/${provider.id}/callback` });
  } catch (e) {
    console.warn('oauth exchange failed', e);
    return fail('exchange_failed');
  }
  const db = c.env.DB;
  const t = now();
  let userId: string | null = null;
  const identity = await db.prepare('SELECT user_id FROM user_identities WHERE provider = ? AND provider_subject = ?').bind(provider.id, profile.subject).first<{ user_id: string }>();
  const policy = await loadPolicy(db);
  if (identity) userId = identity.user_id;
  else if (row.link_user_id) {
    userId = row.link_user_id;
    await db.prepare('INSERT INTO user_identities (id, user_id, provider, provider_subject, email, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), userId, provider.id, profile.subject, profile.email, t).run();
  } else {
    if (!profile.emailVerified) return fail('email_not_verified');
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(profile.email).first<{ id: string }>();
    if (existing) userId = existing.id;
    else {
      const check = await checkAddress(c.env, profile.email, policy);
      if (!check.ok) {
        await audit(db, { action: 'signup.refused', metadata: refusalMetadata(check, 'oauth'), ip: clientIp(c) });
        return fail('email_not_allowed');
      }
      // Google verifies the address, so an invitation to it lets the person create an account; joining the
      // organisation still happens on the invitation page with its token.
      const invited = await db.prepare('SELECT 1 FROM invitations WHERE email = ? AND accepted_at IS NULL AND revoked_at IS NULL AND expires_at > ?').bind(profile.email, t).first();
      if (!signupAllowed(c.env) && !invited) return fail('signup_disabled');
      userId = newId();
      const stmts = [
        // Google verified the address.
        db.prepare('INSERT INTO users (id, email, name, email_verified_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').bind(userId, profile.email, profile.name.slice(0, 100), t, t, t),
        eventStmt(db, { type: 'user.registered', userId, entityType: 'user', entityId: userId, metadata: { provider: provider.id, invited: !!invited }, at: t }),
      ];
      if (!invited) stmts.push(...createWorkspaceStmts(db, { name: `${profile.name.split(' ')[0]}'s workspace`, ownerId: userId }).stmts);
      await db.batch(stmts);
    }
    await db.prepare('INSERT INTO user_identities (id, user_id, provider, provider_subject, email, created_at) VALUES (?, ?, ?, ?, ?, ?)').bind(newId(), userId, provider.id, profile.subject, profile.email, t).run();
  }
  let user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>();
  if (!user || user.disabled_at) return fail('account_disabled');
  // Google vouches for the address it signed in with: that confirms the account's address when they are the same.
  if (!user.email_verified_at && profile.emailVerified && profile.email.toLowerCase() === user.email.toLowerCase()) {
    await db.prepare('UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?').bind(t, t, user.id).run();
    user = { ...user, email_verified_at: t };
  }
  if (!row.link_user_id && !(await getPlatformRole(db, user.id))) {
    const check = await checkAddress(c.env, user.email, policy, { dns: false });
    if (!check.ok) {
      await audit(db, { actorId: user.id, action: 'auth.login.refused', metadata: refusalMetadata(check, 'oauth'), ip: clientIp(c) });
      return fail('email_not_allowed');
    }
    if (!user.email_verified_at && (await verificationActive(c.env, policy))) {
      await sendVerification(c.env, { id: user.id, email: user.email, name: user.name });
      return fail('email_unverified');
    }
  }
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
  await rateLimit(c.env.DB, `invite-accept:${user.id}`, 30, 15 * 60_000);
  const r = await acceptWithToken(c, c.req.param('token'), user);
  const grants = r.already ? [] : (r.grants ?? []);
  const onlyItem = grants.length === 1 && grants[0].kind === 'item' && r.valid?.items.has(grants[0].id) ? grants[0].id : null;
  return c.json({ workspaceId: r.inv.workspace_id, itemId: onlyItem });
});
