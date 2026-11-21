// The one rule an inspection round adds to completing its work order (routes-work.ts): every asset on the round has its
// checklist completed first. Approvals never block completion, so a person working alone is never stuck. It imports
// nothing from the maintenance routes, so routes-work.ts can use it without an import cycle (routes-rounds.ts imports
// routes-work.ts).

import { HttpError } from '../lib/util';

/** Refuses (409 ROUND_INCOMPLETE) while any asset of the work order's round is open; does nothing for other work orders. */
export async function assertRoundDone(db: D1Database, companyId: string, w: { id: string; number: string }): Promise<void> {
  const [first, count] = await db.batch([
    db
      .prepare("SELECT a.number FROM mt_round_assets l JOIN mt_assets a ON a.company_id = l.company_id AND a.id = l.asset_id WHERE l.company_id = ? AND l.work_order_id = ? AND l.status = 'open' ORDER BY l.position LIMIT 5")
      .bind(companyId, w.id),
    db.prepare("SELECT COUNT(*) AS n FROM mt_round_assets l WHERE l.company_id = ? AND l.work_order_id = ? AND l.status = 'open'").bind(companyId, w.id),
  ]);
  const open = Number((count.results[0] as { n: number } | undefined)?.n ?? 0);
  if (!open) return;
  const numbers = (first.results as { number: string }[]).map((r) => r.number);
  const more = open - numbers.length;
  throw new HttpError(
    409,
    `${open} ${open === 1 ? 'asset on this inspection round is' : 'assets on this inspection round are'} not done yet: ${numbers.join(', ')}${more > 0 ? ` and ${more} more` : ''}. Complete their checklists, or take them off the round.`,
    { code: 'ROUND_INCOMPLETE', open },
  );
}
