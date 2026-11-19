// Malware scanning of verification documents (owner, 19 Nov 2026; docs/platform/verification.md, "Malware scan").
//
// ClamAV needs about 1 GB of memory and this app's Machines have 512 MB, so the scanner runs on CAD Automation's
// Machine (kevinjogin/bizomat-cad, opensketch/evidencescan.py). It asks for work here with CAD's BIZOMAT client
// credentials (HTTP Basic, client "cad", the same as the CAD status report), so nothing calls out of this app and no
// new secret exists:
//
//   POST /company/api/id/scan/next     204: nothing waiting (or the flag evidence_scanning is off).
//                                      200: one document's bytes, X-Scan-Id and X-Scan-Sha256; it is "scanning" until a
//                                      verdict comes, or for CLAIM_MS, after which it is handed out again.
//   POST /company/api/id/scan/result   { id, sha256, verdict: clean | infected | error, signature, engine, database }
//
// A clean document can be opened and accepted by a platform admin; an infected one is deleted from storage at once and
// can never be opened (the company is asked for another copy); an error puts it back in the queue, and after
// MAX_ATTEMPTS it is "failed" (a platform admin asks for another copy). Until a document is clean nobody can download
// or accept it (verification-routes.ts), whether the flag is on or not.
import { Hono } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, body, clientIp, now } from '../lib/util';
import { rateLimit } from '../auth/rate-limit';
import { auditStmt } from '../services/audit';
import { flagOn } from '../platform/flags';
import { coAuditStmt } from './access';
import { clientFrom } from './id-provider';

export const CLAIM_MS = 15 * 60_000;
export const MAX_ATTEMPTS = 5;
export const SCAN_STATUSES = ['pending', 'scanning', 'clean', 'infected', 'failed'] as const;
export type ScanStatus = (typeof SCAN_STATUSES)[number];
export const SCAN_LABELS: Record<ScanStatus, string> = {
  pending: 'Waiting for the malware scan',
  scanning: 'Being scanned',
  clean: 'Scanned: no malware found',
  infected: 'Refused by the malware scan',
  failed: 'Could not be scanned',
};

export const scanRoutes = new Hono<AppEnv>();

const noStore = (c: any) => c.header('Cache-Control', 'no-store');

async function scanner(c: any): Promise<Response | null> {
  const client = await clientFrom(c, {});
  if (client === 'malformed' || !client) {
    noStore(c);
    return c.json({ error: 'invalid_client', error_description: 'Unknown client or wrong secret' }, 401);
  }
  if (client.id !== 'cad') {
    noStore(c);
    return c.json({ error: 'unauthorized_client', error_description: 'Only CAD Automation’s scanner takes documents to scan' }, 403);
  }
  return null;
}

scanRoutes.post('/next', async (c) => {
  await rateLimit(c.env.DB, `id-scan:${clientIp(c)}`, 120, 60_000);
  const refused = await scanner(c);
  if (refused) return refused;
  noStore(c);
  const db = c.env.DB;
  if (!(await flagOn(db, 'evidence_scanning'))) return c.body(null, 204);
  const t = now();
  for (let tries = 0; tries < 3; tries++) {
    // The oldest document waiting (or handed out and never answered), across every company: the scanner is the
    // platform's. Claimed with a compare-and-set on its status and claim time, so two askers never get the same one.
    const next = await db
      .prepare(
        `SELECT id, company_id, file_key, sha256, scan_status, scan_claimed_at, scan_attempts FROM company_evidence
          WHERE (scan_status = 'pending' OR (scan_status = 'scanning' AND scan_claimed_at < ?)) AND scan_attempts < ?
          ORDER BY uploaded_at LIMIT 1`,
      )
      .bind(t - CLAIM_MS, MAX_ATTEMPTS)
      .first<{ id: string; company_id: string; file_key: string; sha256: string; scan_status: string; scan_claimed_at: number | null; scan_attempts: number }>();
    if (!next) return c.body(null, 204);
    const claimed = await db
      .prepare(
        `UPDATE company_evidence SET scan_status = 'scanning', scan_claimed_at = ?, scan_attempts = scan_attempts + 1
          WHERE company_id = ? AND id = ? AND scan_status = ? AND scan_attempts = ? AND scan_claimed_at IS ?`,
      )
      .bind(t, next.company_id, next.id, next.scan_status, next.scan_attempts, next.scan_claimed_at)
      .run();
    if (!claimed.meta.changes) continue;
    const obj = await c.env.FILES.get(next.file_key);
    if (!obj) {
      await db
        .prepare("UPDATE company_evidence SET scan_status = 'failed', scan_detail = 'The file is missing from storage', scanned_at = ? WHERE company_id = ? AND id = ?")
        .bind(t, next.company_id, next.id)
        .run();
      continue;
    }
    return new Response(obj.body, {
      headers: { 'Content-Type': 'application/octet-stream', 'X-Scan-Id': next.id, 'X-Scan-Sha256': next.sha256, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    });
  }
  return c.body(null, 204);
});

const resultSchema = z.object({
  id: z.string().min(1).max(64),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  verdict: z.enum(['clean', 'infected', 'error']),
  signature: z.string().max(300).default(''),
  engine: z.string().max(40).default(''),
  database: z.string().max(100).default(''),
});

scanRoutes.post('/result', async (c) => {
  await rateLimit(c.env.DB, `id-scan:${clientIp(c)}`, 120, 60_000);
  const refused = await scanner(c);
  if (refused) return refused;
  noStore(c);
  const input = await body(c, resultSchema);
  const db = c.env.DB;
  // The scanner names only the document: this finds its company (the id is unique), and every change below names it.
  const e = await db
    .prepare('SELECT id, company_id, file_key, sha256, scan_status, scan_attempts FROM company_evidence WHERE id = ?')
    .bind(input.id)
    .first<{ id: string; company_id: string; file_key: string; sha256: string; scan_status: string; scan_attempts: number }>();
  if (!e) return c.json({ error: 'not_found' }, 404);
  if (e.scan_status !== 'scanning') return c.json({ error: 'not_scanning', status: e.scan_status }, 409);
  const t = now();
  const engine = [input.engine, input.database].filter(Boolean).join(' ').slice(0, 140) || null;
  const detail = input.signature.trim().slice(0, 200) || null;
  if (input.sha256 !== e.sha256) {
    // Not the bytes that were uploaded: never a verdict on this document.
    await db
      .prepare("UPDATE company_evidence SET scan_status = ?, scan_detail = 'The scanned bytes did not match the upload', scanned_at = ? WHERE company_id = ? AND id = ?")
      .bind(e.scan_attempts >= MAX_ATTEMPTS ? 'failed' : 'pending', t, e.company_id, e.id)
      .run();
    return c.json({ error: 'sha256_mismatch' }, 409);
  }
  if (input.verdict === 'clean') {
    await db.batch([
      db.prepare("UPDATE company_evidence SET scan_status = 'clean', scan_detail = NULL, scan_engine = ?, scanned_at = ? WHERE company_id = ? AND id = ? AND scan_status = 'scanning'").bind(engine, t, e.company_id, e.id),
      coAuditStmt(db, { companyId: e.company_id, actorId: null, action: 'verification.evidence_scanned', targetType: 'evidence', targetId: e.id, metadata: { verdict: 'clean' } }),
    ]);
    return c.json({ ok: true, status: 'clean' });
  }
  if (input.verdict === 'infected') {
    // Deleted from storage at once: nobody can open it, whatever happens to the record.
    await c.env.FILES.delete(e.file_key);
    await db.batch([
      db
        .prepare("UPDATE company_evidence SET scan_status = 'infected', scan_detail = ?, scan_engine = ?, scanned_at = ?, status = 'rejected', review_note = ? WHERE company_id = ? AND id = ?")
        .bind(detail ?? 'unnamed', engine, t, 'Refused by the malware scan. Upload a clean copy of the document.', e.company_id, e.id),
      coAuditStmt(db, { companyId: e.company_id, actorId: null, action: 'verification.evidence_infected', targetType: 'evidence', targetId: e.id, metadata: { signature: detail } }),
      auditStmt(db, { actorId: null, action: 'platform.evidence_infected', targetType: 'company', targetId: e.company_id, metadata: { evidence: e.id, signature: detail } }),
    ]);
    return c.json({ ok: true, status: 'infected' });
  }
  const status: ScanStatus = e.scan_attempts >= MAX_ATTEMPTS ? 'failed' : 'pending';
  await db
    .prepare("UPDATE company_evidence SET scan_status = ?, scan_detail = ?, scan_engine = ?, scanned_at = ? WHERE company_id = ? AND id = ? AND scan_status = 'scanning'")
    .bind(status, detail ?? 'The scanner reported an error', engine, t, e.company_id, e.id)
    .run();
  return c.json({ ok: true, status });
});

/** Refuses to open or accept a document that has not been scanned clean. */
export function assertScannedClean(e: { scan_status?: string | null }): void {
  if (e.scan_status === 'clean') return;
  const status = (SCAN_STATUSES as readonly string[]).includes(e.scan_status ?? '') ? (e.scan_status as ScanStatus) : 'pending';
  throw new HttpError(409, `${SCAN_LABELS[status]}: the document cannot be opened or accepted until it is scanned clean.`, { code: 'NOT_SCANNED', scanStatus: status });
}
