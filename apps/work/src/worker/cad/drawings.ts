// Drawings where the work is done (owner's brief 5.3 and 5.4; docs/cad/README.md, "ERP connections"):
//   - a manufacturing order shows the approved drawings of the exact revision it builds (its bill of materials
//     revision, released before the order could be released), on its page and on the shop floor (flag cad_manufacturing);
//   - a nonconformance report shows those of its revision, an inspection plan those of its product's released revision
//     (flag cad_quality).
// Only approved documents with a file are shown (a CAD reference to a file on someone's computer cannot be opened
// here). The file is served through the order, report or plan, so a person who may see that record sees its drawings
// without needing access to Products and Engineering. Each sub-flag acts only where cad_in_erp is on.

import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { HttpError, notFound } from '../lib/util';
import { requireErp } from '../erp/access';
import { cadOn } from './access';

export const drawingRoutes = new Hono<AppEnv>();

const KINDS = "('drawing','pdf','dxf','image')";

export interface Drawing {
  documentId: string;
  number: string;
  title: string;
  kind: string;
  versionId: string;
  version: number;
  docRevision: string;
  fileName: string;
  size: number;
  approvedAt: number | null;
  fromCad: boolean;
}

/** The approved drawings of a revision: each document's latest version, when that version is a file. */
export async function drawingsOf(db: D1Database, companyId: string, revisionId: string): Promise<Drawing[]> {
  const rows = await db
    .prepare(
      `SELECT d.id, d.number, d.title, d.kind, d.approved_at, v.id AS version_id, v.version, v.doc_revision, v.file_name, v.size,
              (SELECT 1 FROM cad_document_sources s WHERE s.company_id = d.company_id AND s.version_id = v.id) AS from_cad
         FROM erp_documents d
         JOIN erp_document_versions v ON v.company_id = d.company_id AND v.document_id = d.id
              AND v.version = (SELECT MAX(x.version) FROM erp_document_versions x WHERE x.company_id = d.company_id AND x.document_id = d.id)
        WHERE d.company_id = ? AND d.revision_id = ? AND d.status = 'approved' AND d.kind IN ${KINDS} AND v.source = 'file'
        ORDER BY d.number COLLATE NOCASE LIMIT 50`,
    )
    .bind(companyId, revisionId)
    .all<any>();
  return rows.results.map((r) => ({
    documentId: r.id,
    number: r.number,
    title: r.title,
    kind: r.kind,
    versionId: r.version_id,
    version: r.version,
    docRevision: r.doc_revision,
    fileName: r.file_name,
    size: r.size,
    approvedAt: r.approved_at,
    fromCad: !!r.from_cad,
  }));
}

async function revisionInfo(db: D1Database, companyId: string, revisionId: string | null) {
  if (!revisionId) return null;
  return db.prepare('SELECT r.id, r.label, r.status, p.number AS product_number FROM erp_revisions r JOIN erp_products p ON p.company_id = r.company_id AND p.id = r.product_id WHERE r.company_id = ? AND r.id = ?').bind(companyId, revisionId).first<{ id: string; label: string; status: string; product_number: string }>();
}

/** The revision a record's drawings come from, or null; 404 when the record is not the company's. */
async function revisionOfRecord(db: D1Database, companyId: string, kind: 'mos' | 'ncrs' | 'qc-plans', id: string): Promise<string | null> {
  if (kind === 'mos') {
    const r = await db.prepare('SELECT bom_revision_id FROM erp_mfg_orders WHERE company_id = ? AND id = ?').bind(companyId, id).first<{ bom_revision_id: string }>();
    if (!r) throw notFound('Manufacturing order');
    return r.bom_revision_id;
  }
  if (kind === 'ncrs') {
    const r = await db.prepare('SELECT product_id, revision_id FROM erp_qc_ncrs WHERE company_id = ? AND id = ?').bind(companyId, id).first<{ product_id: string | null; revision_id: string | null }>();
    if (!r) throw notFound('Nonconformance report');
    if (r.revision_id) return r.revision_id;
    if (!r.product_id) return null;
    const rel = await db.prepare("SELECT id FROM erp_revisions WHERE company_id = ? AND product_id = ? AND status = 'released' LIMIT 1").bind(companyId, r.product_id).first<{ id: string }>();
    return rel?.id ?? null;
  }
  const r = await db.prepare('SELECT product_id FROM erp_qc_plans WHERE company_id = ? AND id = ?').bind(companyId, id).first<{ product_id: string | null }>();
  if (!r) throw notFound('Inspection plan');
  if (!r.product_id) return null;
  const rel = await db.prepare("SELECT id FROM erp_revisions WHERE company_id = ? AND product_id = ? AND status = 'released' LIMIT 1").bind(companyId, r.product_id).first<{ id: string }>();
  return rel?.id ?? null;
}

const SETUP = {
  mos: { cap: 'manufacturing.view', flag: 'cad_manufacturing' },
  ncrs: { cap: 'quality.view', flag: 'cad_quality' },
  'qc-plans': { cap: 'quality.view', flag: 'cad_quality' },
} as const;

for (const kind of ['mos', 'ncrs', 'qc-plans'] as const) {
  drawingRoutes.get(`/c/:company/${kind}/:id/drawings`, async (c) => {
    const a = await requireErp(c, SETUP[kind].cap);
    const db = c.env.DB;
    if (!(await cadOn(db, a.companyId, SETUP[kind].flag))) return c.json({ enabled: false, revision: null, drawings: [] });
    const revisionId = await revisionOfRecord(db, a.companyId, kind, c.req.param('id'));
    const rev = await revisionInfo(db, a.companyId, revisionId);
    return c.json({
      enabled: true,
      revision: rev ? { id: rev.id, label: rev.label, status: rev.status, productNumber: rev.product_number } : null,
      drawings: rev ? await drawingsOf(db, a.companyId, rev.id) : [],
    });
  });

  drawingRoutes.get(`/c/:company/${kind}/:id/drawings/:versionId/file`, async (c) => {
    const a = await requireErp(c, SETUP[kind].cap);
    const db = c.env.DB;
    if (!(await cadOn(db, a.companyId, SETUP[kind].flag))) throw notFound('Drawing');
    const revisionId = await revisionOfRecord(db, a.companyId, kind, c.req.param('id'));
    if (!revisionId) throw notFound('Drawing');
    const d = (await drawingsOf(db, a.companyId, revisionId)).find((x) => x.versionId === c.req.param('versionId'));
    if (!d) throw notFound('Drawing');
    const v = await db.prepare('SELECT r2_key, mime FROM erp_document_versions WHERE company_id = ? AND id = ?').bind(a.companyId, d.versionId).first<{ r2_key: string; mime: string }>();
    const obj = v ? await c.env.FILES.get(v.r2_key) : null;
    if (!obj) throw new HttpError(404, 'The file is missing from storage');
    const inline = /^(application\/pdf|image\/(png|jpeg))$/.test(v!.mime ?? '');
    return new Response(obj.body, {
      headers: {
        'Content-Type': v!.mime || 'application/octet-stream',
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(d.fileName)}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  });
}
