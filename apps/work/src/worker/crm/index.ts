// BIZOMAT CRM: the API under /api/crm (signed-in) and /api/crm-public (invitation previews and calendar feeds, whose
// token is the secret). Mounted by src/worker/app.ts; runs in the same Worker, database and file store as Project
// Management, on the same accounts and sessions.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, newId, notFound, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { validateUpload } from '../routes/files';
import { orgRoutes, publicInviteRoutes } from './routes-orgs';
import { recordRoutes } from './routes-records';
import { configRoutes } from './routes-config';
import { workRoutes, publicCalendarRoutes } from './routes-work';
import { insightRoutes } from './routes-insights';
import { automationRoutes } from './routes-automations';
import { mailboxStatus } from './mailbox';
import { assertRecord, requireOrg } from './access';
import { ENTITIES, getRow } from './entities';
import { eventStmt } from './util';

export const crmRoutes = new Hono<AppEnv>();

crmRoutes.route('/', orgRoutes);
crmRoutes.route('/', configRoutes);
crmRoutes.route('/', workRoutes);
crmRoutes.route('/', insightRoutes);
crmRoutes.route('/', automationRoutes);

crmRoutes.get('/integrations', (c) => c.json({ mailbox: mailboxStatus(c.env) }));

// Contact photos and company logos (images only, checked by content).
for (const [path, entity, column] of [
  ['contacts', 'contact', 'avatar_key'],
  ['companies', 'company', 'logo_key'],
] as const) {
  const segment = entity === 'contact' ? 'avatar' : 'logo';
  crmRoutes.post(`/orgs/:org/${path}/:id/${segment}`, async (c) => {
    const a = await requireOrg(c);
    const cfg = ENTITIES[entity];
    const row = await getRow(c.env.DB, cfg, a.orgId, c.req.param('id'));
    if (!row || row.deleted_at) throw notFound('Record');
    assertRecord(a, cfg.module, 'edit', row);
    await rateLimit(c.env.DB, `crm-upload:${a.userId}`, 60, 60_000);
    const form = await c.req.formData().catch(() => null);
    const file = form?.get('file');
    if (!(file instanceof File)) throw new HttpError(400, 'Missing file');
    const { type, bytes } = await validateUpload(file, { imagesOnly: true });
    const key = `crm/${a.orgId}/${entity}/${row.id}/${segment}-${newId()}`;
    await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: type } });
    await c.env.DB.batch([
      c.env.DB.prepare(`UPDATE ${cfg.table} SET ${column} = ?, updated_at = ? WHERE org_id = ? AND id = ?`).bind(key, now(), a.orgId, row.id),
      eventStmt(c.env.DB, { orgId: a.orgId, type: 'updated', actorId: a.userId, refs: { [`${entity}Id`]: row.id }, summary: entity === 'contact' ? 'Profile picture changed' : 'Logo changed' }),
    ]);
    if (row[column]) c.executionCtx.waitUntil(c.env.FILES.delete(row[column]));
    return c.json({ url: `/api/crm/orgs/${a.orgId}/${path}/${row.id}/${segment}?v=${key.slice(-8)}` }, 201);
  });
  crmRoutes.get(`/orgs/:org/${path}/:id/${segment}`, async (c) => {
    const a = await requireOrg(c);
    const cfg = ENTITIES[entity];
    const row = await getRow(c.env.DB, cfg, a.orgId, c.req.param('id'));
    if (!row || !row[column]) throw notFound('Image');
    assertRecord(a, cfg.module, 'view', row);
    const obj = await c.env.FILES.get(row[column]);
    if (!obj) throw notFound('Image');
    return new Response(obj.body, { headers: { 'Content-Type': obj.httpMetadata?.contentType ?? 'image/png', 'Cache-Control': 'private, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox" } });
  });
}

// The record routes last: their per-type paths include /:id.
crmRoutes.route('/', recordRoutes);

export const crmPublicRoutes = new Hono<AppEnv>();
crmPublicRoutes.route('/', publicInviteRoutes);
crmPublicRoutes.route('/', publicCalendarRoutes);

export { runCrmScheduled } from './automations';
