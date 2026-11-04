import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { badRequest, body, clientIp, newId, notFound, now, parseJson, randomToken } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { auditStmt } from '../services/audit';
import { svcFromContext } from '../services/context';
import { EVENT_TYPES, PROVIDERS, deliver, validateWebhookUrl, type IntegrationRow } from '../services/integrations';
import { requireBoard, requireWorkspace } from '../services/permissions';

export const integrationRoutes = new Hono<AppEnv>();

function dto(i: IntegrationRow) {
  const config = parseJson<Record<string, unknown>>(i.config_json, {});
  return {
    id: i.id,
    provider: i.provider,
    name: i.name,
    boardId: i.board_id,
    status: i.status,
    events: parseJson<string[]>(i.events_json, []),
    // Secrets are never returned: only a masked hint.
    endpointHint: i.secret ? `${new URL(i.secret).host}/…` : null,
    hasSigningSecret: !!config.signingSecret,
    lastStatus: i.last_status,
    lastError: i.last_error,
    lastDeliveryAt: i.last_delivery_at,
    createdAt: i.created_at,
  };
}

integrationRoutes.get('/integrations/providers', (c) => c.json({ providers: PROVIDERS, events: EVENT_TYPES }));

integrationRoutes.get('/workspaces/:ws/integrations', async (c) => {
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, c.get('user').id, 'member');
  const rows = await c.env.DB.prepare('SELECT * FROM integrations WHERE workspace_id = ? ORDER BY created_at DESC').bind(wsId).all<IntegrationRow>();
  return c.json(rows.results.map(dto));
});

integrationRoutes.post('/workspaces/:ws/integrations', async (c) => {
  const user = c.get('user');
  const wsId = c.req.param('ws');
  await requireWorkspace(c.env.DB, wsId, user.id, 'admin');
  const input = await body(
    c,
    z.object({
      provider: z.string(),
      name: z.string().trim().min(1).max(100),
      url: z.string().url().max(2000),
      boardId: z.string().nullable().optional(),
      events: z.array(z.enum(EVENT_TYPES)).max(10).default(['item.created']),
    }),
  );
  const provider = PROVIDERS.find((p) => p.id === input.provider);
  if (!provider) throw badRequest('Unknown provider');
  if (provider.availability !== 'available') throw badRequest(`${provider.name} requires platform setup: ${provider.setupNote}`);
  const urlErr = validateWebhookUrl(input.url, provider.id);
  if (urlErr) throw badRequest(urlErr);
  if (input.boardId) {
    const { board } = await requireBoard(c.env.DB, input.boardId, user.id, 'view');
    if (board.workspace_id !== wsId) throw notFound('Board');
  }
  const id = newId();
  const t = now();
  const signingSecret = provider.id === 'webhook' ? `whsec_${randomToken(24)}` : undefined;
  await c.env.DB.batch([
    c.env.DB.prepare('INSERT INTO integrations (id, workspace_id, provider, name, board_id, status, config_json, secret, events_json, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(
      id,
      wsId,
      provider.id,
      input.name,
      input.boardId ?? null,
      'pending',
      JSON.stringify(signingSecret ? { signingSecret } : {}),
      input.url,
      JSON.stringify(input.events),
      user.id,
      t,
      t,
    ),
    auditStmt(c.env.DB, { workspaceId: wsId, actorId: user.id, action: 'integration.created', targetType: 'integration', targetId: id, metadata: { provider: provider.id }, ip: clientIp(c) }),
  ]);
  const row = await c.env.DB.prepare('SELECT * FROM integrations WHERE id = ?').bind(id).first<IntegrationRow>();
  // The signing secret is shown exactly once, at creation.
  return c.json({ ...dto(row!), signingSecret }, 201);
});

async function loadIntegration(c: any) {
  const row = (await c.env.DB.prepare('SELECT * FROM integrations WHERE id = ?').bind(c.req.param('id')).first()) as IntegrationRow | null;
  if (!row) throw notFound('Integration');
  await requireWorkspace(c.env.DB, row.workspace_id, c.get('user').id, 'admin');
  return row;
}

integrationRoutes.patch('/integrations/:id', async (c) => {
  const row = await loadIntegration(c);
  const input = await body(c, z.object({ name: z.string().trim().min(1).max(100).optional(), events: z.array(z.enum(EVENT_TYPES)).max(10).optional(), enabled: z.boolean().optional() }));
  const status = input.enabled === false ? 'disabled' : input.enabled === true && row.status === 'disabled' ? 'pending' : row.status;
  await c.env.DB.prepare('UPDATE integrations SET name = ?, events_json = ?, status = ?, updated_at = ? WHERE id = ?')
    .bind(input.name ?? row.name, input.events ? JSON.stringify(input.events) : row.events_json, status, now(), row.id)
    .run();
  return c.json({ ok: true });
});

integrationRoutes.delete('/integrations/:id', async (c) => {
  const row = await loadIntegration(c);
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM integrations WHERE id = ?').bind(row.id),
    auditStmt(c.env.DB, { workspaceId: row.workspace_id, actorId: c.get('user').id, action: 'integration.deleted', targetType: 'integration', targetId: row.id }),
  ]);
  return c.json({ ok: true });
});

/** Sends a real test delivery. The integration becomes `connected` only if it succeeds. */
integrationRoutes.post('/integrations/:id/test', async (c) => {
  const row = await loadIntegration(c);
  await rateLimit(c.env.DB, `integration-test:${row.id}`, 10, 60_000);
  const result = await deliver(svcFromContext(c), { ...row, status: row.status === 'disabled' ? 'disabled' : row.status }, 'test', { message: 'Test delivery from WorkOS' });
  return c.json(result, result.ok ? 200 : 502);
});

integrationRoutes.get('/integrations/:id/deliveries', async (c) => {
  const row = await loadIntegration(c);
  const rows = await c.env.DB.prepare('SELECT * FROM integration_deliveries WHERE integration_id = ? ORDER BY created_at DESC LIMIT 50').bind(row.id).all();
  return c.json(rows.results);
});
