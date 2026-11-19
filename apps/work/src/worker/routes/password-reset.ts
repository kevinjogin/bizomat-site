// Self-service password reset (Stage 1, R7; audit S6; flag self_service_password_reset, off). A person asks with their
// email; if the account exists, is active and its address is proven, a one-use link valid for an hour goes to that
// address. The answer is the same either way, so nobody learns which addresses have accounts. Setting the new password
// ends every session and API token of the account and is audited. Rate limited by address and by network address.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, now, randomToken, sha256Hex } from '../lib/util';
import { hashPassword, passwordProblems } from '../auth/password';
import { rateLimit } from '../auth/rate-limit';
import { audit } from '../services/audit';
import { enqueueEmail } from '../services/email/outbox';
import { flagOn } from '../platform/flags';
import { appBase } from '../services/app-url';

export const RESET_TTL_MS = 60 * 60_000;
export const passwordResetRoutes = new Hono<AppEnv>();

const DONE = { ok: true, message: 'If an account with a confirmed address exists, a link to choose a new password is on its way. It works for one hour.' };

passwordResetRoutes.post('/password-reset', async (c) => {
  const db = c.env.DB;
  if (!(await flagOn(db, 'self_service_password_reset'))) throw new HttpError(404, 'Not found');
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email().max(320) }));
  await rateLimit(db, `pw-reset-ip:${clientIp(c) ?? 'unknown'}`, 10, 60 * 60_000);
  await rateLimit(db, `pw-reset:${input.email}`, 3, 60 * 60_000);
  const u = await db.prepare('SELECT id, email, name, email_verified_at FROM users WHERE email = ? AND disabled_at IS NULL').bind(input.email).first<{ id: string; email: string; name: string; email_verified_at: number | null }>();
  // Only to a proven address: a link to an address nobody proved could hand the account to whoever typed it.
  if (!u || !u.email_verified_at) return c.json(DONE);
  const token = randomToken(32);
  const t = now();
  await db.prepare('INSERT INTO password_resets (token_hash, user_id, created_at, expires_at, ip) VALUES (?, ?, ?, ?, ?)').bind(await sha256Hex(token), u.id, t, t + RESET_TTL_MS, clientIp(c)).run();
  // The ERP is where everyone signs in (bizomat.ai/erp), so the link opens there.
  const url = `${appBase(c.env).origin}/erp/reset-password#${encodeURIComponent(token)}`;
  await enqueueEmail(c.env, {
    userId: u.id,
    to: u.email,
    toName: u.name,
    data: { template: 'notification', organisation: 'BIZOMAT', title: 'Choose a new password', body: `Someone asked to reset the password of your BIZOMAT account. If it was you, open the link within an hour to choose a new one. If it was not, ignore this email: your password stays as it is.`, url },
    idempotencyKey: `pw-reset:${u.id}:${t}`,
    sensitive: true,
  }).catch(() => null);
  await audit(db, { actorId: u.id, action: 'auth.password_reset_requested', ip: clientIp(c) });
  return c.json(DONE);
});

passwordResetRoutes.post('/password-reset/confirm', async (c) => {
  const db = c.env.DB;
  if (!(await flagOn(db, 'self_service_password_reset'))) throw new HttpError(404, 'Not found');
  const input = await body(c, z.object({ token: z.string().min(20).max(200), password: z.string().max(256) }));
  await rateLimit(db, `pw-reset-confirm:${clientIp(c) ?? 'unknown'}`, 20, 60 * 60_000);
  const hash = await sha256Hex(input.token);
  const r = await db.prepare('SELECT r.user_id, r.expires_at, r.used_at, u.email FROM password_resets r JOIN users u ON u.id = r.user_id AND u.disabled_at IS NULL WHERE r.token_hash = ?').bind(hash).first<{ user_id: string; expires_at: number; used_at: number | null; email: string }>();
  if (!r || r.used_at || r.expires_at <= now()) throw new HttpError(400, 'This link has expired or was already used. Ask for a new one.');
  const problem = passwordProblems(input.password, r.email);
  if (problem) throw badRequest(problem);
  const t = now();
  const used = await db.prepare('UPDATE password_resets SET used_at = ? WHERE token_hash = ? AND used_at IS NULL').bind(t, hash).run();
  if (!used.meta.changes) throw new HttpError(400, 'This link has expired or was already used. Ask for a new one.');
  await db.batch([
    db.prepare('UPDATE users SET password_hash = ?, password_reset_required = 0, failed_logins = 0, locked_until = NULL, updated_at = ? WHERE id = ?').bind(await hashPassword(input.password), t, r.user_id),
    db.prepare("UPDATE sessions SET revoked_at = ?1, ended_at = ?1, end_reason = 'password_reset' WHERE user_id = ?2 AND revoked_at IS NULL").bind(t, r.user_id),
    db.prepare("UPDATE api_tokens SET revoked_at = ?1, revoked_reason = 'password_reset' WHERE user_id = ?2 AND revoked_at IS NULL").bind(t, r.user_id),
    db.prepare('UPDATE password_resets SET used_at = ? WHERE user_id = ? AND used_at IS NULL').bind(t, r.user_id),
  ]);
  await audit(db, { actorId: r.user_id, action: 'auth.password_reset', ip: clientIp(c) });
  return c.json({ ok: true });
});
