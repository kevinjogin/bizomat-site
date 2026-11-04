import { Hono } from 'hono';
import type { NotificationDTO } from '../../shared/types';
import type { AppEnv } from '../env';
import { notFound, now } from '../lib/util';

export const notificationRoutes = new Hono<AppEnv>();

notificationRoutes.get('/notifications', async (c) => {
  const user = c.get('user');
  const ws = c.req.query('workspaceId');
  const unread = c.req.query('unread') === '1';
  const type = c.req.query('type');
  const before = Number(c.req.query('before') ?? Date.now() + 1);
  const where = ['n.user_id = ?', 'n.created_at < ?'];
  const args: unknown[] = [user.id, before];
  if (ws) {
    where.push('n.workspace_id = ?');
    args.push(ws);
  }
  if (unread) where.push('n.read_at IS NULL');
  if (type) {
    where.push('n.type = ?');
    args.push(type);
  }
  // Only show notifications for workspaces the user still belongs to.
  const rows = await c.env.DB.prepare(
    `SELECT n.* FROM notifications n JOIN workspace_members m ON m.workspace_id = n.workspace_id AND m.user_id = n.user_id
     WHERE ${where.join(' AND ')} ORDER BY n.created_at DESC LIMIT 50`,
  )
    .bind(...args)
    .all<any>();
  const count = await c.env.DB.prepare(
    `SELECT COUNT(*) AS n FROM notifications n JOIN workspace_members m ON m.workspace_id = n.workspace_id AND m.user_id = n.user_id
     WHERE n.user_id = ? AND n.read_at IS NULL ${ws ? 'AND n.workspace_id = ?' : ''}`,
  )
    .bind(user.id, ...(ws ? [ws] : []))
    .first<{ n: number }>();
  const list: NotificationDTO[] = rows.results.map((r) => ({
    id: r.id,
    workspaceId: r.workspace_id,
    type: r.type,
    title: r.title,
    body: r.body,
    link: r.link,
    entityType: r.entity_type,
    entityId: r.entity_id,
    actorId: r.actor_id,
    readAt: r.read_at,
    createdAt: r.created_at,
  }));
  return c.json({ notifications: list, unreadCount: count?.n ?? 0 });
});

notificationRoutes.post('/notifications/:id/read', async (c) => {
  const read = c.req.query('unread') === '1' ? null : now();
  const r = await c.env.DB.prepare('UPDATE notifications SET read_at = ? WHERE id = ? AND user_id = ?').bind(read, c.req.param('id'), c.get('user').id).run();
  if (!r.meta.changes) throw notFound('Notification');
  return c.json({ ok: true });
});

notificationRoutes.post('/notifications/read-all', async (c) => {
  const ws = c.req.query('workspaceId');
  const r = await c.env.DB.prepare(`UPDATE notifications SET read_at = ? WHERE user_id = ? AND read_at IS NULL ${ws ? 'AND workspace_id = ?' : ''}`)
    .bind(now(), c.get('user').id, ...(ws ? [ws] : []))
    .run();
  return c.json({ updated: r.meta.changes });
});

notificationRoutes.delete('/notifications/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?').bind(c.req.param('id'), c.get('user').id).run();
  return c.json({ ok: true });
});
