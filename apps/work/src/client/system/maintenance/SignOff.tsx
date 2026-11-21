// The sign-off when a work order is completed: the name of the person signing, their role and a signature drawn on the
// screen, kept as a picture with the work order. Someone who cannot draw on the screen (with a keyboard or a screen
// reader, for example) ticks a box and signs with the typed name alone: a typed sign-off, recorded as one, with no
// picture. Either shows who signed on this screen; neither is a verified electronic signature, and these screens never
// call one that. The server (src/worker/maintenance/signoff.ts) checks the picture and whether the company asks for a
// sign-off (a typed one counts).
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
  /** Signed with the typed name alone, by someone who cannot draw a signature on the screen: no picture. */
  typed: boolean;
}

export const emptySignOff = (): SignOffValue => ({ name: '', role: '', image: null, typed: false });

/** Why the sign-off cannot be sent as it is, or null. */
export function signOffProblem(v: SignOffValue, required: boolean): string | null {
  if (v.typed) return v.name.trim() ? null : 'Type the name of the person signing.';
  if (required && !v.image) return 'Draw the signature, or tick the box to sign with the typed name: your company asks for a sign-off when work is completed.';
  if (v.image && !v.name.trim()) return 'Type the name of the person signing.';
  if (v.name.trim() && !v.image) return 'Draw the signature, tick the box to sign with the typed name, or clear the name to complete without a sign-off.';
  return null;
}

/** Whether to show the problem: once the person has started a sign-off, or when the company asks for one. */
export const showSignOffProblem = (v: SignOffValue, required: boolean) => !!signOffProblem(v, required) && (!!v.name.trim() || !!v.image || v.typed || required);

/** What the server takes: the sign-off (drawn, or with the typed name alone), or nothing when there is none. */
export function signatureBody(v: SignOffValue) {
  const name = v.name.trim();
  const role = v.role.trim() || undefined;
  if (!name) return undefined;
  if (v.typed) return { name, role, typed: true as const };
  return v.image ? { name, role, image: v.image } : undefined;
}

/** Whether an error says the company now asks for a signature (the setting changed while the form was open). */
export const signatureRequired = (err: unknown) => err instanceof ApiError && (err.details as { code?: string } | undefined)?.code === 'SIGNATURE_REQUIRED';

export function SignOffFields({ me, value, onChange, idPrefix }: { me: MtMe; value: SignOffValue; onChange: (v: SignOffValue) => void; idPrefix: string }) {
  return (
    <fieldset className="mt-form-section stack">
      <legend>Sign-off</legend>
      <p className="muted small">{me.requireSignature ? 'Your company asks for a sign-off when work is completed.' : 'Optional: the signature of the person accepting the work, or your own.'}</p>
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
      <label className="checkbox">
        <input type="checkbox" checked={value.typed} onChange={(e) => onChange({ ...value, typed: e.target.checked, image: null })} /> I cannot draw a signature here: sign with my typed name
      </label>
      {value.typed ? (
        <p className="muted small">The sign-off is recorded as signed with the typed name, with no picture. It shows who signed on this screen; it is not a verified electronic signature.</p>
      ) : (
        <>
          <SignaturePad id={`${idPrefix}-pad`} label="Signature" onChange={(image) => onChange({ ...value, image })} />
          <p className="muted small">The signature is kept as a picture with the work order. It shows who signed on this screen; it is not a verified electronic signature.</p>
        </>
      )}
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
        {showSignOffProblem(sign, me.requireSignature) ? <p className="small mt-sign-problem" role="status">{problem}</p> : null}
      </div>
    </Modal>
  );
}

/** The sign-off of a completed or closed work order. */
export function SignOffSection({ w }: { w: WorkOrder }) {
  if (!(w.status === 'completed' || w.status === 'closed') || !w.signedAt || !w.signedByName) return null;
  if (!w.signatureUrl) {
    return (
      <Section title="Sign-off">
        <p className="small">
          Signed with a typed name by <strong>{w.signedByName}</strong>
          {w.signedByRole ? `, ${w.signedByRole}` : ''}, {dateTimeText(w.signedAt)}. No signature was drawn.
        </p>
        <p className="muted small">A typed sign-off records the name typed on this screen. It is not a verified electronic signature.</p>
      </Section>
    );
  }
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
