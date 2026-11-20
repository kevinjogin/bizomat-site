// CAD Automation's notices in BIZOMAT ERP (owner's approval of 20 Nov 2026, the audit's G5; docs/cad/README.md,
// "Notices"): a failed run (from the sync), a review asked of the person, and a revision released whose documents the
// person saved from CAD Automation or asked to have reviewed. They are the company's member notices
// (co_member_notices), shown on the CAD Automation module's Overview; a review request is also emailed (members' notify)
// unless Projects already tells the reviewer because the task was given to them.

import { newId, now } from '../lib/util';
import { cadOn } from './access';

export const CAD_NOTICE_KINDS = ['cad.run_failed', 'cad.review_requested', 'cad.revision_released'] as const;

export function cadNoticeStmts(db: D1Database, n: { companyId: string; userIds: string[]; kind: (typeof CAD_NOTICE_KINDS)[number]; title: string; body?: string; link?: string | null }) {
  const t = now();
  return Array.from(new Set(n.userIds.filter(Boolean))).map((uid) =>
    db
      .prepare('INSERT INTO co_member_notices (id, company_id, user_id, kind, title, body, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(newId(), n.companyId, uid, n.kind, n.title.slice(0, 200), (n.body ?? '').slice(0, 1000), n.link ?? null, t),
  );
}

/** The people still in the company (an active member of a registered company, or the owner of an own company). */
async function stillIn(db: D1Database, companyId: string, ids: string[]): Promise<string[]> {
  const out: string[] = [];
  for (const id of ids) {
    const m =
      (await db.prepare("SELECT 1 FROM co_members WHERE company_id = ? AND user_id = ? AND COALESCE(status, 'active') = 'active'").bind(companyId, id).first()) ??
      (await db.prepare('SELECT 1 FROM sys_companies WHERE id = ? AND owner_id = ?').bind(companyId, id).first());
    if (m) out.push(id);
  }
  return out;
}

/**
 * After a change order released revisions: a notice for each person who saved a CAD Automation export to a document
 * of one of them, or asked for a review of one, other than the person who released it. Only where CAD Automation in
 * the ERP is on for the company. Never stops the release: a failure here is ignored.
 */
export async function noticeRevisionsReleased(db: D1Database, companyId: string, actorId: string, revisions: { id: string; label: string; productId: string; productNumber: string }[]): Promise<number> {
  try {
    if (!revisions.length || !(await cadOn(db, companyId))) return 0;
    let sent = 0;
    for (const r of revisions) {
      const rows = await db
        .prepare(
          `SELECT s.saved_by AS uid FROM cad_document_sources s JOIN erp_documents d ON d.company_id = s.company_id AND d.id = s.document_id
            WHERE s.company_id = ? AND d.revision_id = ? AND s.saved_by IS NOT NULL
           UNION
           SELECT t.requested_by AS uid FROM cad_review_tasks t JOIN erp_documents d ON d.company_id = t.company_id AND d.id = t.document_id
            WHERE t.company_id = ? AND d.revision_id = ? AND t.requested_by IS NOT NULL`,
        )
        .bind(companyId, r.id, companyId, r.id)
        .all<{ uid: string }>();
      const ids = await stillIn(db, companyId, rows.results.map((x) => x.uid).filter((u) => u !== actorId));
      if (!ids.length) continue;
      await db.batch(
        cadNoticeStmts(db, {
          companyId,
          userIds: ids,
          kind: 'cad.revision_released',
          title: `Revision ${r.label} of ${r.productNumber} released`,
          body: 'A revision with documents you saved from CAD Automation, or asked to have reviewed, is released. Manufacturing and quality now use it.',
          link: `/erp/c/${encodeURIComponent(companyId)}/products/${encodeURIComponent(r.productId)}`,
        }),
      );
      sent += ids.length;
    }
    return sent;
  } catch {
    return 0;
  }
}
