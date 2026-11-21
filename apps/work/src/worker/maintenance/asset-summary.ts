// The asset summary on work orders and requests, and the duplicate warning (GET /assets/:id/summary). The field
// release, stream A (MEX a functional reference only): who and what the asset is, where it sits in the hierarchy, and the
// other outstanding requests and work orders on it. The asset register is company-wide, as on GET /assets/:id; the open
// work is counted and listed only as far as the person may see it (supervisors and administrators: the whole company;
// others: their own requests and the work orders made from them or assigned to them). No costs, no responsible person.
// An inspection round's work order sits on the asset above all of its assets, so it counts as open work on each asset
// whose checklist is still open on it too (routes-rounds.ts).

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { isManager, requestScope, requireMt, workOrderScope, type MtAccess } from './access';
import { assetDTO, assetPath, loadAsset } from './routes-assets';
import { openRoundLineSql, outstandingRequestSql } from './lists';
import { OUTSTANDING, sqlList } from './util';

export const assetSummaryRoutes = new Hono<AppEnv>();

/** The asset's identity, its path from the root and the other open work on it (up to 10 of each, with counts). */
export async function assetSummary(db: D1Database, a: MtAccess, assetId: string, exclude: { requestId?: string; workOrderId?: string } = {}) {
  const row = await loadAsset(db, a.companyId, assetId);
  const asset = assetDTO(row);
  const path = await assetPath(db, a.companyId, row.id);
  const rq = requestScope(a, 'r');
  const wo = workOrderScope(a, 'w');
  const exR = (exclude.requestId ?? '').slice(0, 64);
  const exW = (exclude.workOrderId ?? '').slice(0, 64);
  // Each statement names the company first (bind it first); the rest is the same for the rows and the count. The
  // requests already made into or attached to the excluded work order are part of it, not other open work.
  const reqWhere = `r.asset_id = ? AND r.id <> ? AND r.work_order_id IS NOT ? AND ${outstandingRequestSql('r')} AND ${rq.sql}`;
  const woWhere = `(w.asset_id = ? OR ${openRoundLineSql('w')}) AND w.id <> ? AND w.status IN (${sqlList(OUTSTANDING)}) AND ${wo.sql}`;
  const reqArgs = [a.companyId, row.id, exR, exW, ...rq.args];
  const woArgs = [a.companyId, row.id, row.id, exW, ...wo.args];
  const [reqRows, reqCount, woRows, woCount] = await db.batch([
    db
      .prepare(`SELECT r.id, r.number, substr(r.description, 1, 200) AS description, r.status, r.priority, u.name AS requester_name, r.created_at, ow.number AS wo_number FROM mt_requests r LEFT JOIN users u ON u.id = r.requested_by LEFT JOIN mt_work_orders ow ON ow.company_id = r.company_id AND ow.id = r.work_order_id WHERE r.company_id = ? AND ${reqWhere} ORDER BY r.created_at DESC LIMIT 10`)
      .bind(...reqArgs),
    db.prepare(`SELECT COUNT(*) AS n FROM mt_requests r WHERE r.company_id = ? AND ${reqWhere}`).bind(...reqArgs),
    db
      .prepare(`SELECT w.id, w.number, substr(w.description, 1, 200) AS description, w.status, w.priority, u.name AS assignee_name, w.due_finish FROM mt_work_orders w LEFT JOIN users u ON u.id = w.assigned_to WHERE w.company_id = ? AND ${woWhere} ORDER BY COALESCE(w.due_finish, '9999-12-31'), w.number LIMIT 10`)
      .bind(...woArgs),
    db.prepare(`SELECT COUNT(*) AS n FROM mt_work_orders w WHERE w.company_id = ? AND ${woWhere}`).bind(...woArgs),
  ]);
  return {
    asset: {
      id: asset.id,
      number: asset.number,
      name: asset.name,
      category: asset.category,
      type: asset.type,
      manufacturer: asset.manufacturer,
      model: asset.model,
      serialNumber: asset.serialNumber,
      registrationNumber: asset.registrationNumber,
      location: asset.location,
      criticality: asset.criticality,
      status: asset.status,
      archived: asset.archived,
      siteId: asset.siteId,
      siteCode: asset.siteCode,
      siteName: asset.siteName,
      parentId: asset.parentId,
      parentNumber: asset.parentNumber,
      parentName: asset.parentName,
    },
    path,
    scope: isManager(a) ? ('company' as const) : ('yours' as const),
    open: {
      requests: Number((reqCount.results[0] as any)?.n ?? 0),
      workOrders: Number((woCount.results[0] as any)?.n ?? 0),
      requestList: (reqRows.results as any[]).map((r) => ({ id: r.id, number: r.number, description: r.description, status: r.status, priority: r.priority, requestedByName: r.requester_name ?? null, createdAt: r.created_at, workOrderNumber: r.wo_number ?? null })),
      workOrderList: (woRows.results as any[]).map((w) => ({ id: w.id, number: w.number, description: w.description, status: w.status, priority: w.priority, assignedToName: w.assignee_name ?? null, dueFinish: w.due_finish ?? null })),
    },
  };
}

assetSummaryRoutes.get('/c/:company/assets/:id/summary', async (c) => {
  const a = await requireMt(c);
  return c.json(await assetSummary(c.env.DB, a, c.req.param('id'), { requestId: c.req.query('excludeRequestId'), workOrderId: c.req.query('excludeWorkOrderId') }));
});
