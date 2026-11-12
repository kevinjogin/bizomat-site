// Founder console > Email: the Brevo connection for the whole platform. Platform admins only (mounted behind
// requirePlatformAdmin, so everyone else gets 404). The API key and webhook token are write-only: they are encrypted
// at rest and never returned, only whether they are set and the key's last four characters.

import { Hono } from 'hono';
import { appBase, appUrl, appUrlProblem, inviteUrl } from '../services/app-url';
import { checkEmailLink } from '../services/email/link-check';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, badRequest, body, clientIp, now, randomToken } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { audit } from '../services/audit';
import { BREVO_ENDPOINT, emailConfig } from '../services/email/provider';
import { canEncrypt, checkBrevo, emailEnv, encryptSecret, invalidateEmailSettings, loadEmailSettings, saveEmailSettings, type StoredEmailSettings } from '../services/email/settings';
import { enqueueEmail, outboxSummary, processOutbox, sentToday } from '../services/email/outbox';

export const adminEmailRoutes = new Hono<AppEnv>();

// Admins can read the status and send themselves a test; only the founder changes the connection.
function requireFounder(c: any) {
  if (c.get('platformRole') !== 'founder') throw new HttpError(403, 'Only the founder can change the email connection');
}

function webhookUrl(c: any): string {
  // The configured public address (services/app-url.ts); the request's host only if that is misconfigured.
  try {
    return appUrl(c.env, ['api', 'email-webhooks', 'brevo']);
  } catch {
    return `${new URL(c.req.url).origin}${c.env.BASE_PATH ?? ''}/api/email-webhooks/brevo`;
  }
}

adminEmailRoutes.get('/email', async (c) => {
  const s = await loadEmailSettings(c.env.DB);
  const merged = await emailEnv(c.env);
  const cfg = emailConfig(merged);
  const db = c.env.DB;
  const [summary, today, suppressed] = await Promise.all([
    outboxSummary(db, null),
    sentToday(db),
    db.prepare('SELECT email, reason, created_at FROM email_suppressions ORDER BY created_at DESC LIMIT 100').all(),
  ]);
  const source = (consoleValue: unknown, envValue: unknown) => (consoleValue ? 'console' : envValue ? 'environment' : 'default');
  return c.json({
    status: {
      provider: cfg.provider,
      configured: cfg.provider === 'brevo' || cfg.provider === 'test',
      keyUnreadable: merged.EMAIL_KEY_UNREADABLE === '1',
      canSaveSecrets: canEncrypt(c.env),
      canChange: c.get('platformRole') === 'founder',
      sentToday: today,
      counts: summary.counts,
    },
    settings: {
      enabled: s.enabled !== false,
      hasApiKey: !!s.apiKeyEnc,
      apiKeyLast4: s.apiKeyLast4 ?? null,
      apiKeySource: source(s.apiKeyEnc, c.env.BREVO_API_KEY),
      hasWebhookToken: !!s.webhookTokenEnc || !!c.env.BREVO_WEBHOOK_TOKEN,
      webhookTokenSource: source(s.webhookTokenEnc, c.env.BREVO_WEBHOOK_TOKEN),
      fromName: cfg.from.name,
      fromAddress: cfg.from.email,
      replyTo: cfg.replyTo,
      dailyLimit: cfg.dailyLimit,
      criticalReserve: cfg.criticalReserve,
      sandbox: cfg.sandbox,
      updatedAt: s.updatedAt ?? null,
      updatedBy: s.updatedBy ?? null,
    },
    // The address every email link is built from (never the request's host), and why it is unusable if it is.
    appAddress: { href: cfg.baseUrl || null, problem: appUrlProblem(c.env), invitationExample: cfg.baseUrl ? `${cfg.baseUrl}/invite/<token>` : null },
    webhookUrl: webhookUrl(c),
    endpoint: BREVO_ENDPOINT,
    // The console never shows content: no subjects, only the kind of message and its delivery.
    recent: (summary.recent as Record<string, unknown>[]).map(({ subject: _subject, ...r }) => r),
    suppressed: suppressed.results,
  });
});

const EMAIL = z.string().trim().toLowerCase().email().max(320);

adminEmailRoutes.put('/email', async (c) => {
  requireFounder(c);
  const user = c.get('user');
  await rateLimit(c.env.DB, `admin-email-save:${user.id}`, 30, 60 * 60_000);
  const input = await body(
    c,
    z.object({
      enabled: z.boolean().optional(),
      // A new key replaces the saved one; null removes it (the environment's applies again); absent keeps it.
      apiKey: z.string().trim().max(200).nullable().optional(),
      fromName: z.string().trim().max(70).optional(),
      fromAddress: z.union([EMAIL, z.literal('')]).optional(),
      replyTo: z.union([EMAIL, z.literal('')]).optional(),
      dailyLimit: z.number().int().min(1).max(100_000).optional(),
      criticalReserve: z.number().int().min(0).max(100_000).optional(),
      sandbox: z.boolean().optional(),
    }),
  );
  const cur = await loadEmailSettings(c.env.DB);
  const next: StoredEmailSettings = { ...cur, updatedBy: user.email };
  if (input.enabled !== undefined) next.enabled = input.enabled;
  if (input.apiKey !== undefined) {
    if (input.apiKey === null || input.apiKey === '') {
      next.apiKeyEnc = null;
      next.apiKeyLast4 = null;
    } else {
      if (!/^[A-Za-z0-9_-]{20,200}$/.test(input.apiKey)) throw badRequest('That does not look like a Brevo API key');
      if (input.apiKey.startsWith('xsmtpsib-')) throw badRequest('This is an SMTP key. Create an API key in Brevo (SMTP & API > API keys); it starts with xkeysib-');
      if (!canEncrypt(c.env)) throw new HttpError(409, 'This server has no settings encryption key, so it cannot store the API key safely. Set it as the secret WORK_BREVO_API_KEY instead.');
      next.apiKeyEnc = await encryptSecret(c.env, input.apiKey);
      next.apiKeyLast4 = input.apiKey.slice(-4);
    }
  }
  if (input.fromName !== undefined) next.fromName = input.fromName || null;
  if (input.fromAddress !== undefined) next.fromAddress = input.fromAddress || null;
  if (input.replyTo !== undefined) next.replyTo = input.replyTo || null;
  if (input.dailyLimit !== undefined) next.dailyLimit = input.dailyLimit;
  if (input.criticalReserve !== undefined) next.criticalReserve = input.criticalReserve;
  if (input.sandbox !== undefined) next.sandbox = input.sandbox;
  await saveEmailSettings(c.env.DB, next);
  // What changed, never the values of secrets.
  await audit(c.env.DB, {
    actorId: user.id,
    action: 'admin.email_settings_changed',
    metadata: { ...Object.fromEntries(Object.entries(input).filter(([k]) => k !== 'apiKey')), apiKey: input.apiKey === undefined ? 'unchanged' : input.apiKey ? 'replaced' : 'removed' },
    ip: clientIp(c),
  });
  return c.json({ ok: true });
});

/** A new token for Brevo's webhook: shown once, to paste into Brevo; stored encrypted. */
adminEmailRoutes.post('/email/webhook-token', async (c) => {
  requireFounder(c);
  const user = c.get('user');
  if (!canEncrypt(c.env)) throw new HttpError(409, 'This server cannot store secrets safely. Set the secret WORK_BREVO_WEBHOOK_TOKEN instead.');
  const token = randomToken(32);
  const cur = await loadEmailSettings(c.env.DB);
  await saveEmailSettings(c.env.DB, { ...cur, webhookTokenEnc: await encryptSecret(c.env, token), updatedBy: user.email });
  await audit(c.env.DB, { actorId: user.id, action: 'admin.email_webhook_token_created', ip: clientIp(c) });
  return c.json({ token, webhookUrl: webhookUrl(c) });
});

/** Check the key with Brevo (account, senders, domains). Sends nothing. */
adminEmailRoutes.post('/email/check', async (c) => {
  requireFounder(c);
  const user = c.get('user');
  await rateLimit(c.env.DB, `admin-email-check:${user.id}`, 20, 60 * 60_000);
  const input = await body(c, z.object({ apiKey: z.string().trim().max(200).optional() }));
  const merged = await emailEnv(c.env);
  const key = input.apiKey || merged.BREVO_API_KEY;
  if (!key) throw badRequest('Enter the API key first');
  const r = await checkBrevo(key);
  const from = emailConfig(merged).from.email.toLowerCase();
  const domain = from.split('@')[1] ?? '';
  return c.json({
    ...r,
    sender: from,
    senderActive: r.senders ? r.senders.some((s) => s.email.toLowerCase() === from && s.active) : null,
    domainAuthenticated: r.domains ? r.domains.some((d) => d.name.toLowerCase() === domain && d.authenticated === true) : null,
  });
});

/** A test message to the signed-in founder's own address. */
adminEmailRoutes.post('/email/test', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `admin-email-test:${user.id}`, 10, 60 * 60_000);
  invalidateEmailSettings();
  const merged = await emailEnv(c.env);
  const cfg = emailConfig(merged);
  if (cfg.provider === 'none') throw new HttpError(409, merged.EMAIL_KEY_UNREADABLE ? 'The saved API key can no longer be read on this server: enter it again.' : 'Add the Brevo API key and save first.');
  const r = await enqueueEmail(c.env, {
    userId: user.id,
    to: user.email,
    toName: user.name,
    data: { template: 'test', organisation: 'BIZOMAT founder console', sentBy: user.name, provider: cfg.provider === 'brevo' ? `Brevo${cfg.sandbox ? ' (sandbox: accepted and dropped)' : ''}` : cfg.provider, at: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC', ...(cfg.baseUrl ? { url: inviteUrl(c.env, 'link-check') } : {}) },
    idempotencyKey: `admin-test:${user.id}:${now()}`,
  });
  if (!r.queued) return c.json({ ok: false, status: r.reason, error: r.reason === 'suppressed' ? 'Your address is on the suppression list (it bounced or was blocked before).' : r.reason });
  await processOutbox(c.env, { max: 5 });
  const row = await c.env.DB.prepare('SELECT status, last_error, provider_message_id FROM email_outbox WHERE id = ?').bind(r.id).first<{ status: string; last_error: string | null; provider_message_id: string | null }>();
  await audit(c.env.DB, { actorId: user.id, action: 'admin.email_test', metadata: { status: row?.status ?? null }, ip: clientIp(c) });
  return c.json({ ok: row?.status === 'sent', status: row?.status ?? 'unknown', error: row?.last_error ?? null, messageId: row?.provider_message_id ?? null, to: user.email });
});

/** Send delayed messages now (for example after fixing the key). */
adminEmailRoutes.post('/email/process', async (c) => {
  invalidateEmailSettings();
  await c.env.DB.prepare("UPDATE email_outbox SET next_attempt_at = ? WHERE status = 'deferred'").bind(now()).run();
  return c.json(await processOutbox(c.env, { max: 50 }));
});

/**
 * Follows a link copied from a received email (Brevo rewrites links for click tracking) and says where it ends:
 * DNS for the tracking host, HTTPS, each redirect, the final address (tokens masked).
 */
adminEmailRoutes.post('/email/link-check', async (c) => {
  const user = c.get('user');
  await rateLimit(c.env.DB, `admin-email-link-check:${user.id}`, 30, 60 * 60_000);
  const input = await body(c, z.object({ link: z.string().trim().min(8).max(4000) }));
  const problem = appUrlProblem(c.env);
  if (problem) throw new HttpError(409, `The app address is misconfigured: ${problem}`);
  const base = appBase(c.env);
  const r = await checkEmailLink(input.link, { appHost: new URL(base.origin).hostname, expected: `${base.href}/` });
  await audit(c.env.DB, { actorId: user.id, action: 'admin.email_link_check', metadata: { host: r.dns.host, ok: r.ok, hops: r.hops.length }, ip: clientIp(c) });
  return c.json(r);
});
