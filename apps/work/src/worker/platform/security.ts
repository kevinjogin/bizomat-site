// Two-factor sign-in and re-authentication for platform admins (Admin Control Centre, R2; owner's brief, 2.1).
//
// - Enrolment: an authenticator app (TOTP). The secret is encrypted with the server's settings key; ten recovery codes
//   are shown once and kept only as SHA-256 hashes. A code is never accepted twice (user_mfa.last_step).
// - Each console session proves the second factor once (sessions.mfa_at). The Control Centre always requires it; the
//   rest of the console requires it as soon as the admin has enrolled, so nobody is locked out of today's console.
// - Dangerous actions (high-risk flags, the kill switch) need a re-authentication within the last 10 minutes: the
//   password and a code (sessions.reauth_at).
// Every step is written to audit_log; codes, secrets and passwords never are.

import { Hono, type Context, type MiddlewareHandler } from 'hono';
import { z } from 'zod';
import type { AppEnv, Env } from '../env';
import { body, clientIp, HttpError, now, sha256Hex } from '../lib/util';
import { auditStmt } from '../services/audit';
import { canEncrypt, decryptSecret, encryptSecret } from '../services/email/settings';
import { verifyPassword } from '../auth/password';
import { rateLimit } from '../auth/rate-limit';
import { qrSvg } from '../erp/qr';
import { matchStep, newSecret, otpauthUri, base32Encode } from './totp';

export const REAUTH_WINDOW_MS = 10 * 60_000;
const RECOVERY_CODES = 10;

interface MfaRow {
  user_id: string;
  secret_enc: string;
  confirmed_at: number | null;
  last_step: number;
  recovery_json: string;
}

async function mfaOf(db: D1Database, userId: string): Promise<MfaRow | null> {
  try {
    return await db.prepare('SELECT user_id, secret_enc, confirmed_at, last_step, recovery_json FROM user_mfa WHERE user_id = ?').bind(userId).first<MfaRow>();
  } catch {
    return null; // before migration 0029
  }
}

async function sessionMarks(db: D1Database, sessionId: string): Promise<{ mfa_at: number | null; reauth_at: number | null }> {
  try {
    return (await db.prepare('SELECT mfa_at, reauth_at FROM sessions WHERE id = ?').bind(sessionId).first<{ mfa_at: number | null; reauth_at: number | null }>()) ?? { mfa_at: null, reauth_at: null };
  } catch {
    return { mfa_at: null, reauth_at: null };
  }
}

const sessionId = (c: Context<AppEnv>) => {
  const s = c.get('session');
  if (!s) throw new HttpError(403, 'This needs a signed-in browser session.');
  return s.id;
};

function newRecoveryCodes(): string[] {
  return Array.from({ length: RECOVERY_CODES }, () => {
    const raw = base32Encode(crypto.getRandomValues(new Uint8Array(8))).toLowerCase().slice(0, 12);
    return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}`;
  });
}
const normaliseRecovery = (code: string) => String(code ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** Checks a code (or a recovery code, used up when it matches) for a confirmed enrolment. */
async function checkSecondFactor(env: Env, row: MfaRow, input: { code?: string; recoveryCode?: string }): Promise<'code' | 'recovery' | null> {
  const db = env.DB;
  if (input.code) {
    const secret = await decryptSecret(env, row.secret_enc);
    if (!secret) throw new HttpError(503, 'The authenticator secret cannot be read on this server (the settings key changed). Use a recovery code.');
    const step = await matchStep(secret, input.code, now(), row.last_step);
    if (step === null) return null;
    // Conditional: two requests with the same code race, and only one wins.
    const r = await db.prepare('UPDATE user_mfa SET last_step = ?, updated_at = ? WHERE user_id = ? AND last_step < ?').bind(step, now(), row.user_id, step).run();
    return r.meta.changes ? 'code' : null;
  }
  if (input.recoveryCode) {
    const hash = await sha256Hex(normaliseRecovery(input.recoveryCode));
    const list = JSON.parse(row.recovery_json || '[]') as string[];
    if (!list.includes(hash)) return null;
    const left = list.filter((h) => h !== hash);
    const r = await db.prepare('UPDATE user_mfa SET recovery_json = ?, updated_at = ? WHERE user_id = ? AND recovery_json = ?').bind(JSON.stringify(left), now(), row.user_id, row.recovery_json).run();
    return r.meta.changes ? 'recovery' : null;
  }
  return null;
}

/** The Control Centre: a confirmed enrolment and a session that proved it. */
export const requireMfa: MiddlewareHandler<AppEnv> = async (c, next) => {
  const row = await mfaOf(c.env.DB, c.get('user').id);
  if (!row?.confirmed_at) throw new HttpError(403, 'Set up two-factor sign-in (Security) before using the Control Centre.', { code: 'MFA_ENROLMENT_REQUIRED' });
  const marks = await sessionMarks(c.env.DB, sessionId(c));
  if (!marks.mfa_at) throw new HttpError(403, 'Enter a code from your authenticator app to continue.', { code: 'MFA_REQUIRED' });
  await next();
};

/** The rest of the console: once an admin has enrolled, every session must prove the second factor. Paths that let a
 * person enrol or prove it stay open. */
export const consoleMfaGate: MiddlewareHandler<AppEnv> = async (c, next) => {
  const path = new URL(c.req.url).pathname.replace(/^.*?\/api\/admin/, '');
  if (path === '/me' || path.startsWith('/platform/security')) return next();
  const row = await mfaOf(c.env.DB, c.get('user').id);
  if (row?.confirmed_at) {
    const marks = await sessionMarks(c.env.DB, sessionId(c));
    if (!marks.mfa_at) throw new HttpError(403, 'Enter a code from your authenticator app to continue.', { code: 'MFA_REQUIRED' });
  }
  await next();
};

/** Throws 403 REAUTH_REQUIRED unless this session re-authenticated within the last 10 minutes. */
export async function requireReauth(c: Context<AppEnv>): Promise<void> {
  const marks = await sessionMarks(c.env.DB, sessionId(c));
  if (!marks.reauth_at || now() - marks.reauth_at > REAUTH_WINDOW_MS) {
    throw new HttpError(403, 'Confirm your password and a code from your authenticator app to do this.', { code: 'REAUTH_REQUIRED' });
  }
}

export const securityRoutes = new Hono<AppEnv>();

securityRoutes.get('/', async (c) => {
  const row = await mfaOf(c.env.DB, c.get('user').id);
  const marks = await sessionMarks(c.env.DB, sessionId(c));
  return c.json({
    mfa: { enrolled: !!row?.confirmed_at, pending: !!row && !row.confirmed_at, recoveryCodesLeft: row?.confirmed_at ? (JSON.parse(row.recovery_json || '[]') as string[]).length : 0 },
    session: { verified: !!marks.mfa_at, reauthenticatedAt: marks.reauth_at, reauthValidUntil: marks.reauth_at ? marks.reauth_at + REAUTH_WINDOW_MS : null },
    canEncrypt: canEncrypt(c.env),
  });
});

/** Starts (or restarts) an enrolment: a new secret, shown once with its QR code. Replacing a confirmed enrolment (a
 * new phone) needs a recent re-authentication. */
securityRoutes.post('/mfa/start', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  if (!canEncrypt(c.env)) throw new HttpError(503, 'Two-factor sign-in needs the server’s settings key, which is not set here.');
  await rateLimit(db, `mfa-start:${user.id}`, 10, 3_600_000);
  const existing = await mfaOf(db, user.id);
  if (existing?.confirmed_at) await requireReauth(c);
  const secret = newSecret();
  const t = now();
  await db.batch([
    db.prepare('INSERT INTO user_mfa (user_id, secret_enc, confirmed_at, last_step, recovery_json, created_at, updated_at) VALUES (?, ?, NULL, 0, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET secret_enc = excluded.secret_enc, confirmed_at = NULL, last_step = 0, recovery_json = excluded.recovery_json, updated_at = excluded.updated_at').bind(user.id, await encryptSecret(c.env, secret), '[]', t, t),
    auditStmt(db, { actorId: user.id, action: existing?.confirmed_at ? 'platform_admin.mfa_replaced' : 'platform_admin.mfa_started', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  const uri = otpauthUri(secret, user.email);
  let qr: string | null = null;
  try {
    qr = `data:image/svg+xml;base64,${btoa(qrSvg(uri))}`;
  } catch {
    qr = null; // a very long email address: the secret is shown to type in instead
  }
  return c.json({ secret, uri, qr });
});

/** Confirms the enrolment with a first code; returns the recovery codes, once. */
securityRoutes.post('/mfa/confirm', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  await rateLimit(db, `mfa-code:${user.id}`, 10, 900_000);
  const input = await body(c, z.object({ code: z.string().trim().min(6).max(8) }));
  const row = await mfaOf(db, user.id);
  if (!row || row.confirmed_at) throw new HttpError(409, row ? 'Two-factor sign-in is already set up.' : 'Start the setup first.');
  if ((await checkSecondFactor(c.env, row, { code: input.code })) !== 'code') throw new HttpError(400, 'That code is not right. Check the time on your phone and try the next code.', { code: 'MFA_CODE_INVALID' });
  const codes = newRecoveryCodes();
  const hashes = await Promise.all(codes.map((x) => sha256Hex(normaliseRecovery(x))));
  const t = now();
  await db.batch([
    db.prepare('UPDATE user_mfa SET confirmed_at = ?, recovery_json = ?, updated_at = ? WHERE user_id = ?').bind(t, JSON.stringify(hashes), t, user.id),
    db.prepare('UPDATE sessions SET mfa_at = ? WHERE id = ?').bind(t, sessionId(c)),
    auditStmt(db, { actorId: user.id, action: 'platform_admin.mfa_enrolled', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, recoveryCodes: codes });
});

/** Proves the second factor for this session (a code, or a recovery code, which is then used up). */
securityRoutes.post('/verify', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  await rateLimit(db, `mfa-code:${user.id}`, 10, 900_000);
  const input = await body(c, z.object({ code: z.string().trim().max(8).optional(), recoveryCode: z.string().trim().max(20).optional() }));
  const row = await mfaOf(db, user.id);
  if (!row?.confirmed_at) throw new HttpError(409, 'Set up two-factor sign-in first.', { code: 'MFA_ENROLMENT_REQUIRED' });
  const how = await checkSecondFactor(c.env, row, input);
  if (!how) {
    await auditStmt(db, { actorId: user.id, action: 'platform_admin.mfa_failed', targetType: 'user', targetId: user.id, ip: clientIp(c) }).run();
    throw new HttpError(400, 'That code is not right.', { code: 'MFA_CODE_INVALID' });
  }
  await db.batch([
    db.prepare('UPDATE sessions SET mfa_at = ? WHERE id = ?').bind(now(), sessionId(c)),
    auditStmt(db, { actorId: user.id, action: how === 'recovery' ? 'platform_admin.mfa_recovery_used' : 'platform_admin.mfa_verified', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, usedRecoveryCode: how === 'recovery' });
});

/** Re-authentication for a dangerous action: the password and a code (or a recovery code). Valid for 10 minutes. */
securityRoutes.post('/reauth', async (c) => {
  const user = c.get('user');
  const db = c.env.DB;
  await rateLimit(db, `reauth:${user.id}`, 10, 900_000);
  const input = await body(c, z.object({ password: z.string().min(1).max(200), code: z.string().trim().max(8).optional(), recoveryCode: z.string().trim().max(20).optional() }));
  const row = await mfaOf(db, user.id);
  if (!row?.confirmed_at) throw new HttpError(409, 'Set up two-factor sign-in first.', { code: 'MFA_ENROLMENT_REQUIRED' });
  const u = await db.prepare('SELECT password_hash FROM users WHERE id = ?').bind(user.id).first<{ password_hash: string | null }>();
  const passwordOk = await verifyPassword(input.password, u?.password_hash ?? null);
  const how = passwordOk ? await checkSecondFactor(c.env, row, input) : null;
  if (!passwordOk || !how) {
    await auditStmt(db, { actorId: user.id, action: 'platform_admin.reauth_failed', targetType: 'user', targetId: user.id, ip: clientIp(c) }).run();
    throw new HttpError(400, 'The password or the code is not right.', { code: 'REAUTH_INVALID' });
  }
  const t = now();
  await db.batch([
    db.prepare('UPDATE sessions SET reauth_at = ?, mfa_at = COALESCE(mfa_at, ?) WHERE id = ?').bind(t, t, sessionId(c)),
    auditStmt(db, { actorId: user.id, action: 'platform_admin.reauthenticated', targetType: 'user', targetId: user.id, ip: clientIp(c) }),
  ]);
  return c.json({ ok: true, validUntil: t + REAUTH_WINDOW_MS });
});
