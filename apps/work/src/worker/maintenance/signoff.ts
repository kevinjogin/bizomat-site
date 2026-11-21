// The sign-off when a work order is completed, and the company's two settings for completing work orders
// (migration 0040).
//
// A sign-off is the name the person signing typed, their role (optional) and a picture of the signature drawn on the
// screen. It records who signed on that screen. It is not a verified electronic signature: nothing here, on the screens
// or on the job card may call it one. The picture is checked as a PNG of a sensible size (its header only; it is not
// decoded), written to the file store before the transaction (the file store cannot join one), and recorded as an
// mt_files row of the work order by a guarded INSERT in the same transaction that completes it. When that transaction
// fails or loses a race with another completion, the stored picture is deleted again (discardSignature).
//
// Settings, per company (mt_settings, both off until a maintenance administrator switches one on):
//   require_signature        completing a work order needs a sign-off (400 SIGNATURE_REQUIRED without one);
//   technicians_record_work  technicians may record their own work already done (supervisors and administrators
//                            always may).

import type { Context } from 'hono';
import { z } from 'zod';
import type { AppEnv } from '../env';
import { HttpError, newId } from '../lib/util';
import { isManager, type MtAccess } from './access';
import { zText } from './util';

export interface WorkSettings {
  requireSignature: boolean;
  techniciansRecordWork: boolean;
}

/** The company's settings for completing work orders. No row: both off. */
export async function workSettings(db: D1Database, companyId: string): Promise<WorkSettings> {
  const s = await db.prepare('SELECT require_signature, technicians_record_work FROM mt_settings WHERE company_id = ?').bind(companyId).first<{ require_signature: number; technicians_record_work: number }>();
  return { requireSignature: !!s?.require_signature, techniciansRecordWork: !!s?.technicians_record_work };
}

/** Supervisors and administrators always record work already done; technicians only when the company allows it. */
export const canRecordWork = (a: Pick<MtAccess, 'role'>, s: WorkSettings) => isManager(a) || (a.role === 'technician' && s.techniciansRecordWork);

export const signatureSchema = z.object({
  name: zText(120).min(1, 'Type the name of the person signing'),
  role: zText(120).optional(),
  image: z.string().max(400_000, 'The signature picture is too large: clear the pad and sign again'),
});
export type SignatureInput = z.infer<typeof signatureSchema>;

/** Completing a work order: what was done, and an optional sign-off. */
export const completeSchema = z.object({ notes: zText(10000).min(1, 'Write what was done'), signature: signatureSchema.optional() });

export interface PreparedSignature {
  fileId: string;
  key: string;
  size: number;
  name: string;
  role: string;
  fileName: string;
}

const PREFIX = 'data:image/png;base64,';
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const invalid = () => new HttpError(400, 'The signature picture could not be read. Clear the pad and sign again.', { code: 'SIGNATURE_INVALID' });

/** The bytes of a signature picture: a PNG data address of 100 to 300,000 bytes, 50 to 4000 by 30 to 2000 pixels. */
export function decodeSignature(image: string): Uint8Array {
  if (!image.startsWith(PREFIX)) throw invalid();
  let bin: string;
  try {
    bin = atob(image.slice(PREFIX.length));
  } catch {
    throw invalid();
  }
  if (bin.length < 100 || bin.length > 300_000) throw invalid();
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  if (PNG_SIGNATURE.some((b, i) => bytes[i] !== b)) throw invalid();
  if (String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]) !== 'IHDR') throw invalid();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  if (width < 50 || width > 4000 || height < 30 || height > 2000) throw invalid();
  return bytes;
}

/**
 * The picture's bytes when a sign-off is given, null without one; 400 SIGNATURE_REQUIRED when the company asks for one
 * and none is given, 400 SIGNATURE_INVALID when the picture cannot be read. Nothing is stored.
 */
export function signatureBytes(s: SignatureInput | undefined, settings: WorkSettings): Uint8Array | null {
  if (!s) {
    if (settings.requireSignature) throw new HttpError(400, 'This company asks for a signature when work is completed. The person signing types their name and signs.', { code: 'SIGNATURE_REQUIRED' });
    return null;
  }
  return decodeSignature(s.image);
}

/** Writes the picture to the file store, under the work order's own files. */
export async function storeSignature(c: Context<AppEnv>, a: MtAccess, w: { id: string; number: string }, s: SignatureInput, bytes: Uint8Array): Promise<PreparedSignature> {
  const fileId = newId();
  const key = `mt/${a.companyId}/work_order/${w.id}/${fileId}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: 'image/png' }, customMetadata: { uploader: a.userId, purpose: 'signature' } });
  return { fileId, key, size: bytes.byteLength, name: s.name, role: s.role ?? '', fileName: `signature-${w.number}.png` };
}

/** The checks, then the picture stored: null without a sign-off. Call it last before the transaction. */
export async function prepareSignature(c: Context<AppEnv>, a: MtAccess, w: { id: string; number: string }, s: SignatureInput | undefined, settings?: WorkSettings): Promise<PreparedSignature | null> {
  const bytes = signatureBytes(s, settings ?? (await workSettings(c.env.DB, a.companyId)));
  return bytes && s ? storeSignature(c, a, w, s, bytes) : null;
}

/** The sign-off columns a completion writes (every completion writes them, so a new one replaces an earlier one). */
export const SIGN_OFF_SET = 'signed_by_name = ?, signed_by_role = ?, signed_at = ?, signature_file_id = ?';

export const signOffValues = (sig: PreparedSignature | null, t: number): unknown[] => (sig ? [sig.name, sig.role, t, sig.fileId] : [null, '', null, null]);

/** The picture as a file of the work order, written only when this completion is the one that named it. */
export function signatureFileStmts(db: D1Database, a: MtAccess, w: { id: string }, sig: PreparedSignature | null, t: number): D1PreparedStatement[] {
  if (!sig) return [];
  return [
    db
      .prepare("INSERT INTO mt_files (id, company_id, work_order_id, name, mime, size, r2_key, uploaded_by, created_at) SELECT ?, ?, ?, ?, 'image/png', ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM mt_work_orders WHERE company_id = ? AND id = ? AND signature_file_id = ?)")
      .bind(sig.fileId, a.companyId, w.id, sig.fileName, sig.size, sig.key, a.userId, t, a.companyId, w.id, sig.fileId),
  ];
}

/** Deletes a stored picture that no work order names (its transaction failed or lost). Never throws. */
export function discardSignature(c: Context<AppEnv>, sig: PreparedSignature | null) {
  if (!sig) return;
  try {
    const p = c.env.FILES.delete(sig.key).catch(() => undefined);
    try {
      c.executionCtx.waitUntil(p);
    } catch {
      void p;
    }
  } catch {
    // The picture stays in the file store, unnamed, as an upload whose record failed would.
  }
}
