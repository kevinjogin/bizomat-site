// Email confirmation for new accounts (sign-up protection, 12 Nov 2026). A new account signs in only after opening the
// link sent to its address, but only while email can actually be sent (Brevo connected): without email nobody could
// confirm, so nobody is asked to. Links are single use, valid 24 hours, stored as SHA-256 only, and the message is
// marked sensitive so its body is cleared from the outbox once sent.

import type { Env } from '../env';
import { now, randomToken, sha256Hex } from '../lib/util';
import { emailConfig } from './email/provider';
import { emailEnv } from './email/settings';
import { enqueueEmail, processOutbox } from './email/outbox';
import { absoluteLink } from './notify';
import { loadPolicy, type SignupPolicy } from './signup-guard';

const LINK_MS = 24 * 60 * 60_000;

/** Whether new accounts must confirm their address now: the policy asks for it and email can be sent. */
export async function verificationActive(env: Env, policy?: SignupPolicy): Promise<boolean> {
  const p = policy ?? (await loadPolicy(env.DB));
  if (!p.requireVerification) return false;
  const provider = emailConfig(await emailEnv(env)).provider;
  return provider === 'brevo' || provider === 'test';
}

/**
 * Sends a new confirmation link (earlier unused links stay valid until they expire). At most one message per account
 * every two minutes and ten a day, whatever asks for it; returns whether one was queued.
 */
export async function sendVerification(env: Env, user: { id: string; email: string; name: string }, waitUntil?: (p: Promise<unknown>) => void): Promise<boolean> {
  const db = env.DB;
  const t = now();
  const recent = await db
    .prepare('SELECT COUNT(*) AS day, SUM(CASE WHEN created_at > ?2 THEN 1 ELSE 0 END) AS last FROM email_verifications WHERE user_id = ?1 AND created_at > ?3')
    .bind(user.id, t - 2 * 60_000, t - 24 * 60 * 60_000)
    .first<{ day: number; last: number | null }>();
  if ((recent?.last ?? 0) > 0 || (recent?.day ?? 0) >= 10) return false;
  const cfg = emailConfig(await emailEnv(env));
  if (cfg.provider === 'none') return false;
  const token = randomToken(32);
  const hash = await sha256Hex(token);
  const expires = t + LINK_MS;
  await db.prepare('INSERT INTO email_verifications (token_hash, user_id, email, created_at, expires_at) VALUES (?, ?, ?, ?, ?)').bind(hash, user.id, user.email, t, expires).run();
  const r = await enqueueEmail(
    env,
    {
      userId: user.id,
      to: user.email,
      toName: user.name,
      data: {
        template: 'verify_email',
        name: user.name,
        email: user.email,
        url: absoluteLink(cfg.baseUrl, `/verify-email?token=${token}`),
        expires: new Date(expires).toISOString().replace('T', ' ').slice(0, 16) + ' UTC',
      },
      idempotencyKey: `verify:${hash}`,
      sensitive: true,
    },
    cfg,
  );
  if (!r.queued) return false;
  const send = processOutbox(env, { max: 5 }).catch((e) => console.error('verify_email_send_failed', e instanceof Error ? e.message : e));
  if (waitUntil) waitUntil(send);
  else await send;
  return true;
}

export type ConfirmResult = { ok: true; email: string; already: boolean } | { ok: false; reason: 'invalid' | 'expired' | 'used' | 'changed' };

/** Confirms the address the link was sent to, if it is still the account's address. */
export async function confirmEmail(db: D1Database, token: string): Promise<ConfirmResult & { userId?: string }> {
  if (!token || token.length > 200) return { ok: false, reason: 'invalid' };
  const hash = await sha256Hex(token);
  const row = await db
    .prepare('SELECT v.user_id, v.email, v.expires_at, v.used_at, u.email AS current_email, u.email_verified_at FROM email_verifications v JOIN users u ON u.id = v.user_id WHERE v.token_hash = ?')
    .bind(hash)
    .first<{ user_id: string; email: string; expires_at: number; used_at: number | null; current_email: string; email_verified_at: number | null }>();
  if (!row) return { ok: false, reason: 'invalid' };
  if (row.used_at) return row.email_verified_at ? { ok: true, email: row.email, already: true, userId: row.user_id } : { ok: false, reason: 'used' };
  if (row.expires_at < now()) return { ok: false, reason: 'expired' };
  if (row.email.toLowerCase() !== row.current_email.toLowerCase()) return { ok: false, reason: 'changed' };
  const t = now();
  // Single use: only the first request to mark the link used confirms.
  const used = await db.prepare('UPDATE email_verifications SET used_at = ? WHERE token_hash = ? AND used_at IS NULL').bind(t, hash).run();
  if (!used.meta.changes) return { ok: true, email: row.email, already: true, userId: row.user_id };
  await db.prepare('UPDATE users SET email_verified_at = COALESCE(email_verified_at, ?), updated_at = ? WHERE id = ?').bind(t, t, row.user_id).run();
  return { ok: true, email: row.email, already: !!row.email_verified_at, userId: row.user_id };
}
