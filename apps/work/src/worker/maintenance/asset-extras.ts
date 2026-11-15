// What an asset's page adds in stages M2 and M3: its site, meters and gauges, preventive maintenance schedules, prestart
// checklist and latest prestarts, and the address of its QR label.

import type { MtAccess } from './access';
import { meterDTO } from './routes-meters';
import { loadSchedulesOfAsset } from './pm';

export async function assetExtras(db: D1Database, a: MtAccess, assetId: string) {
  const [meters, prestart, prestarts] = await db.batch([
    db.prepare('SELECT * FROM mt_meters WHERE company_id = ? AND asset_id = ? ORDER BY archived_at IS NOT NULL, name COLLATE NOCASE').bind(a.companyId, assetId),
    db.prepare('SELECT t.id, t.name FROM mt_asset_prestart p JOIN mt_insp_templates t ON t.company_id = p.company_id AND t.id = p.template_id WHERE p.company_id = ? AND p.asset_id = ?').bind(a.companyId, assetId),
    db.prepare('SELECT p.id, p.result, p.template_name, p.failed_items, p.set_out_of_service, p.performed_at, u.name AS performer FROM mt_prestarts p LEFT JOIN users u ON u.id = p.performed_by WHERE p.company_id = ? AND p.asset_id = ? ORDER BY p.performed_at DESC LIMIT 10').bind(a.companyId, assetId),
  ]);
  const p = prestart.results[0] as any;
  return {
    meters: (meters.results as any[]).map(meterDTO),
    schedules: await loadSchedulesOfAsset(db, a.companyId, assetId),
    prestartTemplate: p ? { id: p.id, name: p.name } : null,
    prestarts: (prestarts.results as any[]).map((x) => ({ id: x.id, result: x.result, templateName: x.template_name, failedItems: x.failed_items, setOutOfService: !!x.set_out_of_service, performedAt: x.performed_at, performedByName: x.performer ?? null })),
    qrUrl: `/api/maintenance/c/${a.companyId}/assets/${assetId}/qr`,
  };
}
