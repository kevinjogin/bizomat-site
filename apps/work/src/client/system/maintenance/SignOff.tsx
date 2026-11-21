// The sign-off when a work order is completed: the name of the person signing, their role and a signature drawn on the
// screen, kept as a picture with the work order. It shows who signed on this screen; it is not a verified electronic
// signature, and these screens never call it one. The server (src/worker/maintenance/signoff.ts) checks the picture and
// whether the company asks for a signature.
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, post } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { Modal, useToast } from '../../components/ui/overlays';
import { dateTimeText, mtPath, type MtMe, type WorkOrder } from './api';
import { Section } from './common';
import { SignaturePad } from './SignaturePad';

export interface SignOffValue {
  name: string;
  role: string;
  image: string | null;
}

export const emptySignOff = (): SignOffValue => ({ name: '', role: '', image: null });

/** Why the sign-off cannot be sent as it is, or null. */
export function signOffProblem(v: SignOffValue, required: boolean): string | null {
  if (required && !v.image) return 'Draw the signature: your company asks for one when work is completed.';
  if (v.image && !v.name.trim()) return 'Type the name of the person signing.';
  if (v.name.trim() && !v.image) return 'Draw the signature, or clear the name to complete without a sign-off.';
  return null;
}

/** What the server takes: the sign-off, or nothing when there is none. */
export const signatureBody = (v: SignOffValue) => (v.image && v.name.trim() ? { name: v.name.trim(), role: v.role.trim() || undefined, image: v.image } : undefined);

/** Whether an error says the company now asks for a signature (the setting changed while the form was open). */
export const signatureRequired = (err: unknown) => err instanceof ApiError && (err.details as { code?: string } | undefined)?.code === 'SIGNATURE_REQUIRED';

export function SignOffFields({ me, value, onChange, idPrefix }: { me: MtMe; value: SignOffValue; onChange: (v: SignOffValue) => void; idPrefix: string }) {
  return (
    <fieldset className="mt-form-section stack">
      <legend>Sign-off</legend>
      <p className="muted small">{me.requireSignature ? 'Your company asks for a signature when work is completed.' : 'Optional: the signature of the person accepting the work, or your own.'}</p>
      <div className="crm-form-grid">
        <div className="field">
          <label htmlFor={`${idPrefix}-name`}>Name of the person signing</label>
          <input id={`${idPrefix}-name`} className="input" maxLength={120} autoComplete="off" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor={`${idPrefix}-role`}>Their role (optional)</label>
          <input id={`${idPrefix}-role`} className="input" maxLength={120} autoComplete="off" placeholder="For example: Technician, Site supervisor, Customer" value={value.role} onChange={(e) => onChange({ ...value, role: e.target.value })} />
        </div>
      </div>
      <SignaturePad id={`${idPrefix}-pad`} label="Signature" onChange={(image) => onChange({ ...value, image })} />
      <p className="muted small">The signature is kept as a picture with the work order. It shows who signed on this screen; it is not a verified electronic signature.</p>
    </fieldset>
  );
}

/** Completing a work order: what was done and found, and the sign-off. */
export function CompleteDialog({ companyId, me, w, onClose, onDone }: { companyId: string; me: MtMe; w: WorkOrder; onClose: () => void; onDone: () => Promise<unknown> | void }) {
  const toast = useToast();
  const qc = useQueryClient();
  const [notes, setNotes] = useState('');
  const [sign, setSign] = useState<SignOffValue>(emptySignOff);
  const [busy, setBusy] = useState(false);
  const problem = signOffProblem(sign, me.requireSignature);
  const signing = !!signatureBody(sign);
  const submit = async () => {
    setBusy(true);
    try {
      await post(mtPath(companyId, `/work-orders/${w.id}/complete`), { notes: notes.trim(), signature: signatureBody(sign) });
      toast(signing ? 'Completed and signed off' : 'Completed');
      await onDone();
    } catch (err) {
      toast(errorMessage(err), 'error');
      if (signatureRequired(err)) await qc.invalidateQueries({ queryKey: ['mt', companyId, 'me'] });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      wide
      title={`Complete ${w.number}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy || !notes.trim() || !!problem} onClick={submit}>{busy ? 'Completing…' : signing ? 'Complete and sign off' : 'Complete'}</button>
        </>
      }
    >
      <div className="stack">
        <div className="field">
          <label htmlFor="mt-complete-notes">What was done and what was found (required)</label>
          <textarea id="mt-complete-notes" className="textarea" rows={4} maxLength={10000} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <SignOffFields me={me} value={sign} onChange={setSign} idPrefix="mt-complete-sign" />
        {problem && (sign.name.trim() || sign.image || me.requireSignature) ? <p className="small mt-sign-problem" role="status">{problem}</p> : null}
      </div>
    </Modal>
  );
}

/** The sign-off of a completed or closed work order. */
export function SignOffSection({ w }: { w: WorkOrder }) {
  if (!(w.status === 'completed' || w.status === 'closed') || !w.signedAt || !w.signatureUrl) return null;
  return (
    <Section title="Sign-off">
      <figure className="mt-signoff">
        <img src={appUrl(w.signatureUrl)} alt={`Signature of ${w.signedByName ?? 'the person signing'}`} />
        <figcaption className="small">
          Signed by <strong>{w.signedByName}</strong>
          {w.signedByRole ? `, ${w.signedByRole}` : ''}, {dateTimeText(w.signedAt)}
        </figcaption>
      </figure>
      <p className="muted small">Drawn on screen and kept as a picture. It is not a verified electronic signature.</p>
    </Section>
  );
}
