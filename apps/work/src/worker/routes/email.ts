// Email: Brevo's transactional webhook (no session; authenticated with a shared bearer token) and the organisation
// administrators' email page (status, delays, failures, a test message to themselves, retry).

import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, notFound, now, timingSafeEqual } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { auditStmt } from '../services/audit';
import { requireWorkspace } from '../services/permissions';
import { applyWebhookEvents, enqueueEmail, outboxSummary, processOutbox, sentToday, suppressedAmong } from '../services/email/outbox';
import { BREVO_ENDPOINT, emailConfig } from '../services/email/provider';
import { emailEnv } from '../services/email/settings';

/** Mounted at /api/email-webhooks, before authentication. */
export const emailWebhookRoutes = new Hono<AppEnv>();

function tokenFrom(header: string | undefined): string | null {
  if (!header) return null;
  const bearer = /^Bearer\s+(.+)$/i.exec(header);
  if (bearer) return bearer[1].trim();
  const basic = /^Basic\s+(.+)$/i.exec(header);
  if (basic) {
    try {
      const decoded = atob(basic[1].trim());
      const i = decoded.indexOf(':');
      return i >= 0 ? decoded.slice(i + 1) : null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Brevo sends delivery events here. Configure the webhook in Brevo with authentication type "bearer" and the
 * BREVO_WEBHOOK_TOKEN value (docs/email/brevo-setup.md). Without the token configured, every call is refused.
 */
emailWebhookRoutes.post('/brevo', async (c) => {
  const expected = (await emailEnv(c.env)).BREVO_WEBHOOK_TOKEN;
  if (!expected) return c.json({ error: 'Webhook not configured' }, 503);
  await rateLimit(c.env.DB, `email-webhook:${clientIp(c)}`, 1200, 60_000);
  const got = tokenFrom(c.req.header('Authorization'));
  if (!got || !timingSafeEqual(got, expected)) return c.json({ error: 'Unauthorized' }, 401);
  const len = Number(c.req.header('Content-Length') ?? 0);
  if (len > 1024 * 1024) return c.json({ error: 'Payload too large' }, 413);
  let payload: unknown;
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON' }, 400);
  }
  const r = await applyWebhookEvents(c.env.DB, payload);
  return c.json({ ok: true, ...r });
});

/** Mounted with the authenticated API. */
export const emailAdminRoutes = new Hono<AppEnv>();

emailAdminRoutes.get('/workspaces/:ws/email', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'admin');
  const cfg = emailConfig(await emailEnv(c.env));
  const db = c.env.DB;
  const [summary, today, members] = await Promise.all([
    outboxSummary(db, wsId),
    sentToday(db),
    db.prepare("SELECT u.email FROM workspace_members m JOIN users u ON u.id = m.user_id WHERE m.workspace_id = ? AND m.status = 'active'").bind(wsId).all<{ email: string }>(),
  ]);
  const delayed = (summary.recent as { status: string; last_error: string | null }[]).filter((r) => r.status === 'deferred');
  return c.json({
    provider: cfg.provider,
    configured: cfg.provider === 'brevo' || cfg.provider === 'test',
    developmentMode: cfg.provider === 'log',
    endpoint: cfg.provider === 'brevo' ? BREVO_ENDPOINT : null,
    sender: cfg.from,
    replyTo: cfg.replyTo,
    sandbox: cfg.sandbox,
    webhookConfigured: cfg.webhookConfigured,
    // Brevo decides whether the sender and domain are verified; BIZOMAT cannot see that, so it says so.
    senderVerification: 'Check in Brevo: Senders, domains and dedicated IPs (BIZOMAT cannot read this setting)',
    dailyLimit: cfg.dailyLimit,
    criticalReserve: cfg.criticalReserve,
    sentToday: today,
    remainingToday: Math.max(0, cfg.dailyLimit - today),
    counts: summary.counts,
    delayed: delayed.length,
    recent: summary.recent,
    suppressed: await suppressedAmong(db, members.results.map((m) => m.email.toLowerCase())),
  });
});

/** Send a test message to the administrator's own address (never to anyone else). */
emailAdminRoutes.post('/workspaces/:ws/email/test', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  await rateLimit(c.env.DB, `email-test:${user.id}`, 5, 60 * 60_000);
  const cfg = emailConfig(await emailEnv(c.env));
  if (cfg.provider === 'none') throw new HttpError(409, 'Email is not configured yet: the founder adds the Brevo API key in the founder console (Email)');
  const ws = await c.env.DB.prepare('SELECT name FROM workspaces WHERE id = ?').bind(wsId).first<{ name: string }>();
  const at = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const r = await enqueueEmail(c.env, {
    workspaceId: wsId,
    userId: user.id,
    to: user.email,
    toName: user.name,
    data: { template: 'test', organisation: ws?.name ?? '', sentBy: user.name, provider: cfg.provider === 'brevo' ? `Brevo${cfg.sandbox ? ' (sandbox: accepted and dropped)' : ''}` : cfg.provider, at },
    idempotencyKey: `test:${user.id}:${now()}`,
  });
  await auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'email.test', ip: clientIp(c) }).run();
  if (!r.queued) return c.json({ ok: false, reason: r.reason });
  const result = await processOutbox(c.env, { max: 5 });
  const row = await c.env.DB.prepare('SELECT status, last_error, provider_message_id FROM email_outbox WHERE id = ?').bind(r.id).first<{ status: string; last_error: string | null; provider_message_id: string | null }>();
  return c.json({ ok: row?.status === 'sent', id: r.id, status: row?.status, error: row?.last_error ?? null, providerAccepted: row?.status === 'sent', processed: result });
});

/** Try a failed or delayed message again now (not invitations, whose links were cleared: resend those instead). */
emailAdminRoutes.post('/workspaces/:ws/email/:id/retry', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  await body(c, z.object({}).passthrough());
  const row = await c.env.DB.prepare('SELECT id, status, sensitive, html FROM email_outbox WHERE id = ? AND workspace_id = ?').bind(c.req.param('id'), wsId).first<{ id: string; status: string; sensitive: number; html: string }>();
  if (!row) throw notFound('Email');
  if (!['failed', 'deferred'].includes(row.status)) throw new HttpError(409, `This email is ${row.status}`);
  if (row.sensitive || !row.html) throw new HttpError(409, 'This message can no longer be sent again. For an invitation, use Resend on the Members page.');
  await c.env.DB.prepare("UPDATE email_outbox SET status = 'queued', next_attempt_at = ?, attempts = 0, last_error = NULL, updated_at = ? WHERE id = ?").bind(now(), now(), row.id).run();
  await auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'email.retry', targetId: row.id, ip: clientIp(c) }).run();
  const result = await processOutbox(c.env, { max: 5 });
  return c.json({ ok: true, processed: result });
});
