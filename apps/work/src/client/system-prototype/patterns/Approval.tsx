// The workflow and approval pattern: the steps of an approval with who and when, and Approve or Return with a
// comment. Used by purchase orders, requisitions, engineering changes, nonconformances, bills, credit notes and
// expense claims.
import { useState } from 'react';
import { Modal, useToast } from '../../components/ui/overlays';
import { fmtDateTime } from '../format';
import { PIcon } from '../icons';
import { useErp } from '../state';
import type { Row, WorkflowStep } from '../types';

const STATE_TEXT: Record<WorkflowStep['state'], string> = { done: 'Done', current: 'Waiting for action', waiting: 'Not started', returned: 'Returned' };
const STATE_ICON: Record<WorkflowStep['state'], string> = { done: 'check', current: 'clock', waiting: 'more', returned: 'undo' };

export function ApprovalSteps({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="erp-steps">
      {steps.map((s, i) => (
        <li key={i} className={`erp-step ${s.state}`}>
          <span className="erp-step-dot" aria-hidden>
            <PIcon name={STATE_ICON[s.state]} size={14} />
          </span>
          <div className="erp-step-body">
            <div className="row wrap">
              <strong>{s.label}</strong>
              <span className="sr-only">: </span>
              <span className={`erp-step-state ${s.state}`}>{STATE_TEXT[s.state]}</span>
            </div>
            <div className="muted small">
              {s.who}
              {s.when ? ` · ${fmtDateTime(s.when)}` : ''}
            </div>
            {s.comment ? <p className="erp-step-comment">“{s.comment}”</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ApprovalPanel({ entity, r, steps, label }: { entity: string; r: Row; steps: WorkflowStep[]; label: string }) {
  const { patchRecord } = useErp();
  const toast = useToast();
  const [dialog, setDialog] = useState<'approve' | 'return' | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const current = steps.find((s) => s.state === 'current');
  const canDecide = !!current && ['Awaiting approval', 'In review', 'Open', 'Awaiting review'].includes(r.status);
  const now = new Date().toISOString().slice(0, 16);
  const decide = () => {
    if (dialog === 'return' && !comment.trim()) {
      setError('Say what needs to change, so the person who submitted it knows what to fix.');
      return;
    }
    const before = { status: r.status, approvedBy: r.approvedBy, approvedAt: r.approvedAt, approvalComment: r.approvalComment, returnComment: r.returnComment, returnedAt: r.returnedAt };
    if (dialog === 'approve') {
      patchRecord(entity, r.id, { status: entity === 'ncr' ? 'Rework' : 'Approved', approvedBy: 'Alex Morgan (you)', approvedAt: now, approvalComment: comment.trim() || undefined });
      toast(`${r.id} approved.`, 'info', { label: 'Undo', run: () => patchRecord(entity, r.id, before) });
    } else {
      patchRecord(entity, r.id, { status: 'Returned', returnComment: comment.trim(), returnedAt: now });
      toast(`${r.id} returned with your comment.`, 'info', { label: 'Undo', run: () => patchRecord(entity, r.id, before) });
    }
    setDialog(null);
    setComment('');
    setError('');
  };
  return (
    <section className="card erp-panel erp-approval" aria-labelledby={`appr-${r.id}`} data-hl="approval">
      <div className="erp-panel-head">
        <h2 id={`appr-${r.id}`}>Approval</h2>
        {canDecide ? (
          <div className="row wrap">
            <button type="button" className="btn" onClick={() => setDialog('return')}>
              <PIcon name="undo" /> Return
            </button>
            <button type="button" className="btn primary" onClick={() => setDialog('approve')} data-hl="approve-button">
              <PIcon name="check" /> Approve
            </button>
          </div>
        ) : null}
      </div>
      <div className="erp-panel-body">
        {canDecide ? <p className="muted small">You can decide on this {label.toLowerCase()} for the demonstration. In BIZOMAT only the named approver can.</p> : null}
        <ApprovalSteps steps={steps} />
      </div>
      {dialog ? (
        <Modal
          title={dialog === 'approve' ? `Approve ${r.id}` : `Return ${r.id}`}
          onClose={() => setDialog(null)}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDialog(null)}>
                Cancel
              </button>
              <button type="button" className="btn primary" onClick={decide}>
                {dialog === 'approve' ? 'Approve' : 'Return with comment'}
              </button>
            </>
          }
        >
          <div className="field">
            <label htmlFor="appr-comment">{dialog === 'approve' ? 'Comment (optional)' : 'What needs to change'}</label>
            <textarea
              id="appr-comment"
              className={`textarea${error ? ' invalid' : ''}`}
              value={comment}
              aria-invalid={!!error}
              aria-describedby={error ? 'appr-error' : 'appr-hint'}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
            />
            {error ? (
              <span id="appr-error" className="error" role="alert">
                {error}
              </span>
            ) : (
              <span id="appr-hint" className="hint">
                {dialog === 'approve' ? 'Kept with the approval in the activity timeline.' : 'Sent to the person who submitted it.'}
              </span>
            )}
          </div>
        </Modal>
      ) : null}
    </section>
  );
}
