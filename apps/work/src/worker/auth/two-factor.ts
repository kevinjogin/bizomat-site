// Two-factor sign-in for every account (batch 2, item 4; flag account_two_factor, off until the owner switches it on).
//
// - Anyone signed in turns it on in Settings, Security: an authenticator app (TOTP, the secret encrypted with the
//   server's settings key) confirmed with a first code, and ten recovery codes shown once, kept only as SHA-256 hashes.
//   The same enrolment (user_mfa) serves the ERP console's checks for platform admins (src/worker/platform/security.ts).
// - While the flag is on, a password or Google sign-in of a person who has it on makes no session: it answers with a
//   challenge (ten minutes, five tries, used once; login_challenges keeps only its hash), and POST /login/two-factor
//   with a code or a recovery code makes the session, already marked as having proved the second factor.
// - Turning it off, or new recovery codes, needs the password and a code. A founder removes it for someone who lost
//   their phone and recovery codes (src/worker/routes/admin.ts), after confirming who they are, with a re-authentication.
// Codes, secrets and passwords are never logged; every step is in the audit log.

import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { HttpError, body, clientIp, newId, now, randomToken, sha256Hex } from '../lib/util';
import { auditStmt } from '../services/audit';
import { canEncrypt, encryptSecret } from '../services/email/settings';
import { verifyPassword } from './password';
import { rateLimit } from './rate-limit';
import { qrSvg } from '../erp/qr';
import { flagOn } from '../platform/flags';
import { checkSecondFactor, mfaOf, newRecoveryCodes, normaliseRecovery } from '../platform/security';
import { newSecret, otpauthUri } from '../platform/totp';
import { requireAuth } from './session';
import { getPlatformRole } from '../services/platform-admin';

export const CHALLENGE_MS = 10 * 60_000;
const MAX_TRIES = 5;

export async function twoFactorAvailable(db: D1Database): Promise<boolean> {
  return flagOn(db, 'account_two_factor').catch(() => false);
}

/**
 * Whether a sign-in of this person must prove the second factor before a session is made. It never fails open: a
 * database error here is an error of the sign-in, not a sign-in without the code.
 */
export async function signInNeedsCode(env: Env, userId: string): Promise<boolean> {
  if (!(await flagOn(env.DB, 'account_two_factor'))) return false;
  const row = await env.DB.prepare('SELECT confirmed_at FROM user_mfa WHERE user_id = ?').bind(userId).first<{ confirmed_at: number | null }>();
  return !!row?.confirmed_at;
}

/** A challenge for a sign-in whose password (or Google) was right; the token is returned once. */
export async function startChallenge(c: Context<AppEnv>, userId: string, provider: string, redirectTo: string | null): Promise<string> {
  const token = randomToken(32);
  const t = now();
  await c.env.DB.batch([
    // an earlier challenge of the same person still open ends: only the newest works
    c.env.DB.prepare('UPDATE login_challenges SET used_at = ? WHERE user_id = ? AND used_at IS NULL').bind(t, userId),
    c.env.DB.prepare('INSERT INTO login_challenges (id, token_hash, user_id, provider, redirect_to, ip, attempts, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)').bind(newId(), await sha256Hex(token), userId, provider.slice(0, 40), redirectTo, clientIp(c), t, t + CHALLENGE_MS),
    auditStmt(c.env.DB, { actorId: userId, action: 'auth.second_factor_asked', metadata: { provider }, ip: clientIp(c) }),
  ]);
  return token;
}

/**
 * The code (or recovery code) for a challenge: the challenge is used up and the person's user id, provider and where to
 * go are returned for the session to be made. Throws 400 (wrong code, with the tries left) or 401 (no such challenge).
 */
export async function answerChallenge(c: Context<AppEnv>, token: string, input: { code?: string; recoveryCode?: string }): Promise<{ userId: string; provider: string; redirectTo: string | null; how: 'code' | 'recovery' }> {
  const db = c.env.DB;
  const row = await db.prepare('SELECT * FROM login_challenges WHERE token_hash = ?').bind(await sha256Hex(token)).first<any>();
  const t = now();
  if (!row || row.used_at || row.expires_at < t || row.attempts >= MAX_TRIES) throw new HttpError(401, 'That sign-in has ended. Sign in again with your password.', { code: 'CHALLENGE_ENDED' });
  // wrong codes are limited per account too, never reset by a right password: a new challenge is not five new tries
  await rateLimit(db, `login-2fa:user:${row.user_id}`, 10, 30 * 60_000);
  const user = await db.prepare('SELECT id, disabled_at FROM users WHERE id = ?').bind(row.user_id).first<{ id: string; disabled_at: number | null }>();
  const mfa = await mfaOf(db, row.user_id);
  if (!user || user.disabled_at || !mfa?.confirmed_at) throw new HttpError(401, 'That sign-in has ended. Sign in again with your password.', { code: 'CHALLENGE_ENDED' });
  // a try is counted before the code is checked, so two requests at once cannot both have a fifth try
  const counted = await db.prepare('UPDATE login_challenges SET attempts = attempts + 1 WHERE id = ? AND attempts = ? AND used_at IS NULL').bind(row.id, row.attempts).run();
  if (!counted.meta.changes) throw new HttpError(409, 'Another try is being checked: wait a moment and try again.');
  const how = await checkSecondFactor(c.env, mfa, input);
  if (!how) {
    await auditStmt(db, { actorId: row.user_id, action: 'auth.second_factor_failed', ip: clientIp(c) }).run();
    const left = MAX_TRIES - row.attempts - 1;
    throw new HttpError(400, left > 0 ? `That code is not right. ${left === 1 ? 'One try is' : `${left} tries are`} left.` : 'That code is not right. Sign in again with your password.', { code: left > 0 ? 'MFA_CODE_INVALID' : 'CHALLENGE_ENDED' });
  }
  const used = await db.prepare('UPDATE login_challenges SET used_at = ? WHERE id = ? AND used_at IS NULL').bind(t, row.id).run();
  if (!used.meta.changes) throw new HttpError(401, 'That sign-in has ended. Sign in again with your password.', { code: 'CHALLENGE_ENDED' });
  await auditStmt(db, { actorId: row.user_id, action: how === 'recovery' ? 'auth.recovery_code_used' : 'auth.second_factor_proved', ip: clientIp(c) }).run();
  return { userId: row.user_id, provider: row.provider, redirectTo: row.redirect_to, how };
}

/** Marks a session as having proved the second factor (so the ERP console does not ask again). */
export function markSession(db: D1Database, sessionId: string) {
  return db.prepare('UPDATE sessions SET mfa_at = ? WHERE id = ?').bind(now(), sessionId);
}

// ------------------------------------------------------------------ enrolment, in Settings, Security

export const twoFactorRoutes = new Hono<AppEnv>();
twoFactorRoutes.use('*', requireAuth);
// Only a person signed in in a browser manages their second factor: an API token (even a full one) never turns it on,
// off, or makes new recovery codes.
twoFactorRoutes.use('*', async (c, next) => {
  if (!c.get('session')) throw new HttpError(403, 'Two-factor sign-in is managed in a browser, signed in');
  await next();
});

/** The password (for an account that has one: a Google-only account gives a code alone) and a code, or a recovery code. */
async function passwordAndCode(c: Context<AppEnv>, input: { password?: string; code?: string; recoveryCode?: string }) {
  const db = c.env.DB;
  const user = c.get('user');
  await rateLimit(db, `mfa-manage:${user.id}`, 10, 900_000);
  const row = await mfaOf(db, user.id);
  if (!row?.confirmed_at) throw new HttpError(409, 'Two-factor sign-in is not on.');
  const u = await db.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first<{ password_hash: string | null }>();
  const ok = u?.password_hash ? await verifyPassword(input.password ?? '', u.password_hash) : true;
  const how = ok ? await checkSecondFactor(c.env, row, input) : null;
  if (!ok || !how) {
    await auditStmt(db, { actorId: user.id, action: 'account.mfa_check_failed', targetType: 'user', targetId: user.id, ip: clientIp(c) }).run();
    throw new HttpError(400, 'The password or the code is not right.', { code: 'REAUTH_INVALID' });
  }
  return row;
}

twoFactorRoutes.get('/', async (c) => {
  const user = c.get('user');
  const row = await mfaOf(c.env.DB, user.id);
  const platformAdmin = !!(await getPlatformRole(c.env.DB, user.id));
  const forEveryone = await twoFactorAvailable(c.env.DB);
  return c.json({
    available: forEveryone || platformAdmin,
    /** Signing in asks for the code only while two-factor sign-in is on for everyone; otherwise the ERP console asks. */
    askedAtSignIn: forEveryone,
    enrolled: !!row?.confirmed_at,
    pending: !!row && !row.confirmed_at,
    recoveryCodesLeft: row?.confirmed_at ? (JSON.parse(row.recovery_json || '[]') as string[]).length : 0,
    canEncrypt: canEncrypt(c.env),
    hasPassword: !!(await c.env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first<{ password_hash: string | null }>())?.password_hash,
  });
});

twoFactorRoutes.post('/start', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  if (!(await twoFactorAvailable(db)) && !(await getPlatformRole(db, user.id))) throw new HttpError(404, 'Two-factor sign-in is not available yet.');
  if (!canEncrypt(c.env)) throw new HttpError(503, 'Two-factor sign-in needs the server’s settings key, which is not set here.');
  await rateLimit(db, `mfa-start:${user.id}`, 10, 3_600_000);
  const existing = await mfaOf(db, user.id);
  if (existing?.confirmed_at) throw new HttpError(409, 'Two-factor sign-in is already on. Turn it off first to move it to a new phone.');
  const secret = newSecret();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO user_mfa (user_id, secret_enc, confirmed_at, last_step, recovery_json, created_at, updated_at) VALUES (?, ?, NULL, 0, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET secret_enc = excluded.secret_enc, confirmed_at = NULL, last_step = 0, recovery_json = excluded.recovery_json, updated_at = excluded.updated_at').bind(user.id, await encryptSecret(c.env, secret), '[]', t, t),
    auditStmt(db, { actorId: user.id, action: 'account.mfa_started', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  const uri = otpauthUri(secret, user.email);
  let qr: string | null = null;
  try {
    qr = `data:image/svg+xml;base64,${btoa(qrSvg(uri))}`;
  } catch {
    qr = null;
  }
  return c.json({ secret, uri, qr });
});

twoFactorRoutes.post('/confirm', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  await rateLimit(db, `mfa-code:${user.id}`, 10, 900_000);
  const input = await body(c, z.object({ code: z.string().trim().min(6).max(8) }));
  const row = await mfaOf(db, user.id);
  if (!row || row.confirmed_at) throw new HttpError(409, row ? 'Two-factor sign-in is already on.' : 'Start the setup first.');
  if ((await checkSecondFactor(c.env, row, { code: input.code })) !== 'code') throw new HttpError(400, 'That code is not right. Check the time on your phone and try the next code.', { code: 'MFA_CODE_INVALID' });
  const codes = newRecoveryCodes();
  const hashes = await Promise.all(codes.map((x) => sha256Hex(normaliseRecovery(x))));
  const t = now();
  const session = c.get('session');
  await db.batch([
    db.prepare('UPDATE user_mfa SET confirmed_at = ?, recovery_json = ?, updated_at = ? WHERE user_id = ?').bind(t, JSON.stringify(hashes), t, user.id),
    ...(session ? [markSession(db, session.id)] : []),
    auditStmt(db, { actorId: user.id, action: 'account.mfa_enrolled', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, recoveryCodes: codes });
});

twoFactorRoutes.post('/recovery-codes', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const input = await body(c, z.object({ password: z.string().max(256).optional(), code: z.string().trim().max(8).optional(), recoveryCode: z.string().trim().max(20).optional() }));
  await passwordAndCode(c, input);
  const codes = newRecoveryCodes();
  const hashes = await Promise.all(codes.map((x) => sha256Hex(normaliseRecovery(x))));
  await db.batch([db.prepare('UPDATE user_mfa SET recovery_json = ?, updated_at = ? WHERE user_id = ?').bind(JSON.stringify(hashes), now(), user.id), auditStmt(db, { actorId: user.id, action: 'account.mfa_recovery_codes', targetType: 'user', targetId: user.id, ip: clientIp(c) })]);
  return c.json({ ok: true, recoveryCodes: codes });
});

twoFactorRoutes.post('/disable', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  const input = await body(c, z.object({ password: z.string().max(256).optional(), code: z.string().trim().max(8).optional(), recoveryCode: z.string().trim().max(20).optional() }));
  await passwordAndCode(c, input);
  await db.batch([
    db.prepare('DELETE FROM user_mfa WHERE user_id = ?').bind(user.id),
    db.prepare('UPDATE login_challenges SET used_at = ? WHERE user_id = ? AND used_at IS NULL').bind(now(), user.id),
    auditStmt(db, { actorId: user.id, action: 'account.mfa_disabled', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true });
});
