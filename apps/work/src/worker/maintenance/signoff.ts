// The sign-off when a work order is completed, and the company's two settings for completing work orders
// (migration 0040).
//
// A sign-off is the name the person signing typed, their role (optional) and a picture of the signature drawn on the
// screen. Someone who cannot draw on the screen (keyboard or screen reader users, for example) signs with the typed name
// alone instead: a typed sign-off, recorded as one, with no picture. Either records who signed on that screen. Neither is
// a verified electronic signature: nothing here, on the screens or on the job card may call one that. The picture is
// checked as a PNG of a sensible size (its header only; it is not decoded), written to the file store before the
// transaction (the file store cannot join one), under a key of its own (signature-<id>, never given to an upload, so a
// sign-off picture is told apart from photos for good), and recorded as an mt_files row of the work order by a guarded
// INSERT in the same transaction that completes it. When that transaction fails or loses a race with another
// completion, the stored picture is deleted again (discardSignature).
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
import { SIGNATURE_KEY_PART, zText } from './util';

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

export const signatureSchema = z
  .object({
    name: zText(120).min(1, 'Type the name of the person signing'),
    role: zText(120).optional(),
    image: z.string().max(400_000, 'The signature picture is too large: clear the pad and sign again').optional(),
    // Signed with the typed name alone, by someone who cannot draw a signature on the screen: no picture is kept.
    typed: z.boolean().optional(),
  })
  .refine((s) => (s.typed ? !s.image : !!s.image), { message: 'Draw the signature, or sign with the typed name (not both)', path: ['image'] });
export type SignatureInput = z.infer<typeof signatureSchema>;

/** Completing a work order: what was done, and an optional sign-off. */
export const completeSchema = z.object({ notes: zText(10000).min(1, 'Write what was done'), signature: signatureSchema.optional() });

export interface PreparedSignature {
  /** The picture's file and its key in the file store; null for a typed sign-off. */
  fileId: string | null;
  key: string | null;
  size: number;
  name: string;
  role: string;
  fileName: string;
  /** Signed with the typed name alone (no picture). */
  typed: boolean;
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

/** A sign-off checked: the picture's bytes, or null when it is signed with the typed name. */
export interface CheckedSignOff {
  input: SignatureInput;
  bytes: Uint8Array | null;
}

/**
 * The sign-off checked, null without one; 400 SIGNATURE_REQUIRED when the company asks for one and none is given (a
 * typed sign-off counts), 400 SIGNATURE_INVALID when the picture cannot be read. Nothing is stored.
 */
export function checkSignOff(s: SignatureInput | undefined, settings: WorkSettings): CheckedSignOff | null {
  if (!s) {
    if (settings.requireSignature) {
      throw new HttpError(400, 'This company asks for a sign-off when work is completed. The person signing types their name and draws a signature, or signs with the typed name.', { code: 'SIGNATURE_REQUIRED' });
    }
    return null;
  }
  return { input: s, bytes: s.typed ? null : decodeSignature(s.image ?? '') };
}

/** Writes the picture, if any, to the file store under the work order's own files (a typed sign-off stores nothing). */
export async function storeSignOff(c: Context<AppEnv>, a: MtAccess, w: { id: string; number: string }, checked: CheckedSignOff | null): Promise<PreparedSignature | null> {
  if (!checked) return null;
  const { input: s, bytes } = checked;
  if (!bytes) return { fileId: null, key: null, size: 0, name: s.name, role: s.role ?? '', fileName: '', typed: true };
  const fileId = newId();
  const key = `mt/${a.companyId}/work_order/${w.id}/${SIGNATURE_KEY_PART}${fileId}`;
  await c.env.FILES.put(key, bytes, { httpMetadata: { contentType: 'image/png' }, customMetadata: { uploader: a.userId, purpose: 'signature' } });
  return { fileId, key, size: bytes.byteLength, name: s.name, role: s.role ?? '', fileName: `signature-${w.number}.png`, typed: false };
}

/** The checks, then the picture stored: null without a sign-off. Call it last before the transaction. */
export async function prepareSignature(c: Context<AppEnv>, a: MtAccess, w: { id: string; number: string }, s: SignatureInput | undefined, settings?: WorkSettings): Promise<PreparedSignature | null> {
  return storeSignOff(c, a, w, checkSignOff(s, settings ?? (await workSettings(c.env.DB, a.companyId))));
}

/** The sign-off columns a completion writes (every completion writes them, so a new one replaces an earlier one). */
export const SIGN_OFF_SET = 'signed_by_name = ?, signed_by_role = ?, signed_at = ?, signature_file_id = ?';

/** A typed sign-off is a name and a time with no picture. */
export const signOffValues = (sig: PreparedSignature | null, t: number): unknown[] => (sig ? [sig.name, sig.role, t, sig.fileId] : [null, '', null, null]);

/** The words the history adds for the sign-off, saying when it was signed with a typed name. */
export const signedOffText = (sig: PreparedSignature | null) => (!sig ? '' : sig.typed ? `, signed off by ${sig.name} with a typed name (no signature drawn)` : `, signed off by ${sig.name}`);

/** What the history line keeps of the sign-off. */
export const signOffAfter = (sig: PreparedSignature | null) => (sig ? { signedBy: sig.name, signedByRole: sig.role, ...(sig.typed ? { signedTyped: true } : {}) } : {});

/** The picture as a file of the work order, written only when this completion is the one that named it. */
export function signatureFileStmts(db: D1Database, a: MtAccess, w: { id: string }, sig: PreparedSignature | null, t: number): D1PreparedStatement[] {
  if (!sig?.fileId) return [];
  return [
    db
      .prepare("INSERT INTO mt_files (id, company_id, work_order_id, name, mime, size, r2_key, uploaded_by, created_at) SELECT ?, ?, ?, ?, 'image/png', ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM mt_work_orders WHERE company_id = ? AND id = ? AND signature_file_id = ?)")
      .bind(sig.fileId, a.companyId, w.id, sig.fileName, sig.size, sig.key, a.userId, t, a.companyId, w.id, sig.fileId),
  ];
}

/** Deletes a stored picture that no work order names (its transaction failed or lost). Never throws. */
export function discardSignature(c: Context<AppEnv>, sig: PreparedSignature | null) {
  if (!sig?.key) return;
  const key = sig.key;
  try {
    const p = c.env.FILES.delete(key).catch(() => undefined);
    try {
      c.executionCtx.waitUntil(p);
    } catch {
      void p;
    }
  } catch {
    // The picture stays in the file store, unnamed, as an upload whose record failed would.
  }
}
