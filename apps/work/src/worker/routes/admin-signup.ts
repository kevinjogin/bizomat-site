// Founder console > Sign-up protection: who may create an account and sign in (services/signup-guard.ts). Platform
// admins only (mounted behind requirePlatformAdmin); only the founder changes the policy or confirms an account.

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, notFound, now, parseJson } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { audit } from '../services/audit';
import { DISPOSABLE_DOMAINS, REFUSAL_LABELS, checkAddress, inList, loadPolicy, normaliseDomain, savePolicy, type SignupPolicy } from '../services/signup-guard';
import { verificationActive } from '../services/email-verification';

export const adminSignupRoutes = new Hono<AppEnv>();

function requireFounder(c: any) {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can change sign-up protection');
}

const REFUSAL_ACTIONS = ['signup.refused', 'auth.login.refused', 'invitation.refused'];

adminSignupRoutes.get('/signup-protection', async (c) => {
  const db = c.env.DB;
  const policy = await loadPolicy(db);
  const since = now() - 30 * 24 * 60 * 60_000;
  const ph = REFUSAL_ACTIONS.map(() => '?').join(', ');
  // Administrators are never asked to confirm (routes/auth.ts), so they are not listed as waiting.
  const [recent, unconfirmed, unconfirmedCount, domains] = await Promise.all([
    db.prepare(`SELECT action, metadata_json, created_at FROM audit_log WHERE action IN (${ph}) AND created_at > ? ORDER BY created_at DESC LIMIT 500`).bind(...REFUSAL_ACTIONS, since).all<{ action: string; metadata_json: string; created_at: number }>(),
    db.prepare('SELECT id, name, email, created_at, (SELECT MAX(created_at) FROM email_verifications v WHERE v.user_id = u.id) AS last_link_at FROM users u WHERE email_verified_at IS NULL AND disabled_at IS NULL AND id NOT IN (SELECT user_id FROM platform_admins) ORDER BY created_at DESC LIMIT 100').all(),
    db.prepare('SELECT COUNT(*) AS n FROM users WHERE email_verified_at IS NULL AND disabled_at IS NULL AND id NOT IN (SELECT user_id FROM platform_admins)').first<{ n: number }>(),
    db.prepare("SELECT lower(substr(email, instr(email, '@') + 1)) AS domain, COUNT(*) AS n FROM users WHERE disabled_at IS NULL GROUP BY domain").all<{ domain: string; n: number }>(),
  ]);
  const refusals = recent.results.map((r) => {
    const m = parseJson<{ where?: string; reason?: string; domain?: string; mx?: string }>(r.metadata_json, {});
    return { at: r.created_at, where: m.where ?? r.action.split('.')[0], reason: m.reason ?? 'unknown', domain: m.domain ?? null };
  });
  const byReason: Record<string, number> = {};
  for (const r of refusals) byReason[r.reason] = (byReason[r.reason] ?? 0) + 1;
  // Accounts whose domain the policy refuses today (they cannot sign in unless the domain is allowed).
  const flaggedDomains = domains.results
    .filter((d) => !inList(d.domain, policy.allowedDomains) && (inList(d.domain, policy.blockedDomains) || (policy.blockDisposable && inList(d.domain, DISPOSABLE_DOMAINS))))
    .map((d) => d.domain);
  const flagged = flaggedDomains.length
    ? (
        await db
          .prepare(`SELECT id, name, email, created_at FROM users WHERE disabled_at IS NULL AND lower(substr(email, instr(email, '@') + 1)) IN (${flaggedDomains.map(() => '?').join(', ')}) ORDER BY created_at DESC LIMIT 200`)
          .bind(...flaggedDomains)
          .all()
      ).results
    : [];
  return c.json({
    policy,
    canChange: c.get('platformRole') === 'founder',
    confirmationActive: await verificationActive(c.env, policy),
    disposableCount: DISPOSABLE_DOMAINS.size,
    reasons: REFUSAL_LABELS,
    refusals: { last30Days: refusals.length, byReason, recent: refusals.slice(0, 50) },
    unconfirmed: { count: unconfirmedCount?.n ?? 0, accounts: unconfirmed.results },
    flagged,
  });
});

const DOMAINS = z.array(z.string().max(260)).max(500);

adminSignupRoutes.put('/signup-protection', async (c) => {
  requireFounder(c);
  const user = c.get('user');
  await rateLimit(c.env.DB, `admin-signup-save:${user.id}`, 30, 60 * 60_000);
  const input = await body(
    c,
    z.object({
      blockDisposable: z.boolean().optional(),
      requireMx: z.boolean().optional(),
      requireVerification: z.boolean().optional(),
      blockedDomains: DOMAINS.optional(),
      allowedDomains: DOMAINS.optional(),
    }),
  );
  const clean = (list: string[] | undefined, name: string) => {
    if (!list) return undefined;
    const out = new Set<string>();
    for (const raw of list) {
      if (!raw.trim()) continue;
      const d = normaliseDomain(raw);
      if (!d) throw badRequest(`“${raw.trim().slice(0, 80)}” in ${name} is not a domain (for example: example.com)`);
      out.add(d);
    }
    return Array.from(out).sort();
  };
  const cur = await loadPolicy(c.env.DB);
  const next: SignupPolicy = {
    blockDisposable: input.blockDisposable ?? cur.blockDisposable,
    requireMx: input.requireMx ?? cur.requireMx,
    requireVerification: input.requireVerification ?? cur.requireVerification,
    blockedDomains: clean(input.blockedDomains, 'blocked domains') ?? cur.blockedDomains,
    allowedDomains: clean(input.allowedDomains, 'always allowed domains') ?? cur.allowedDomains,
    updatedBy: user.email,
  };
  await savePolicy(c.env.DB, next);
  await audit(c.env.DB, {
    actorId: user.id,
    action: 'admin.signup_protection_changed',
    metadata: { blockDisposable: next.blockDisposable, requireMx: next.requireMx, requireVerification: next.requireVerification, blocked: next.blockedDomains.length, allowed: next.allowedDomains.length },
    ip: clientIp(c),
  });
  return c.json({ ok: true, policy: next });
});

/** What the policy would say about an address today (the mail-server check really asks DNS). */
adminSignupRoutes.post('/signup-protection/check', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `admin-signup-check:${user.id}`, 60, 60 * 60_000);
  const input = await body(c, z.object({ email: z.string().trim().toLowerCase().email().max(320) }));
  const r = await checkAddress(c.env, input.email, await loadPolicy(c.env.DB));
  return c.json(r);
});

/** The founder confirms an account's address by hand (for example after checking with the person). */
adminSignupRoutes.post('/users/:id/confirm-email', async (c) => {
  requireFounder(c);
  const actor = c.get('user');
  const id = c.req.param('id');
  await body(c, z.object({}).passthrough());
  const target = await c.env.DB.prepare('SELECT id, email_verified_at FROM users WHERE id = ?').bind(id).first<{ id: string; email_verified_at: number | null }>();
  if (!target) throw notFound('User');
  if (target.email_verified_at) return c.json({ ok: true, already: true });
  const t = now();
  await c.env.DB.prepare('UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?').bind(t, t, id).run();
  await audit(c.env.DB, { actorId: actor.id, action: 'admin.email_confirmed', targetType: 'user', targetId: id, ip: clientIp(c) });
  return c.json({ ok: true, already: false });
});
