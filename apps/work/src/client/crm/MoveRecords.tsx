// Move CRM records to another company's CRM (owner, 20 Nov 2026: records entered in the wrong company, one at a time or
// many at once). One popup: the company, what moves and what stays, then the move. The server decides everything
// (src/worker/crm/transfer.ts); flag move_records, off until a platform admin switches it on for both companies.
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { errorMessage, get, post } from '../lib/api';
import { Modal, useToast } from '../components/ui/overlays';
import { crm } from './lib';

export type MovableEntity = 'contact' | 'lead' | 'company';
const PATH: Record<MovableEntity, string> = { contact: 'contacts', lead: 'leads', company: 'companies' };
const WORD: Record<MovableEntity, [string, string]> = { contact: ['contact', 'contacts'], lead: ['lead', 'leads'], company: ['company', 'companies'] };

interface Target {
  orgId: string;
  name: string;
  companyId: string;
  companyName: string;
  create: Record<MovableEntity, boolean>;
}

interface Preview {
  target: { orgId: string; orgName: string };
  records: {
    id: string;
    name: string;
    ok: boolean;
    error?: string;
    carries: { contacts: number; leads: number; notes: number; activities: number; files: number };
    notCarried: { field: string; reason: string }[];
  }[];
  moved: number;
}

export const isMovable = (entity: string): entity is MovableEntity => entity === 'contact' || entity === 'lead' || entity === 'company';

/** Whether records may be moved out of this CRM (one small call, cached). */
export function useCrmMoveEnabled(orgId: string, enabled = true): boolean {
  const q = useQuery({
    queryKey: ['crm', orgId, 'transfer-status'],
    queryFn: () => get<{ enabled: boolean }>(crm(orgId, '/transfer/status')),
    enabled: enabled && !!orgId,
    staleTime: 5 * 60_000,
    retry: false,
  });
  return !!q.data?.enabled;
}

const plural = (n: number, w: [string, string]) => `${n} ${n === 1 ? w[0] : w[1]}`;

function carries(c: Preview['records'][number]['carries']): string {
  const parts = [
    c.contacts ? plural(c.contacts, ['contact', 'contacts']) : '',
    c.leads ? plural(c.leads, ['lead', 'leads']) : '',
    c.notes ? plural(c.notes, ['note', 'notes']) : '',
    c.activities ? plural(c.activities, ['activity', 'activities']) : '',
    c.files ? plural(c.files, ['file', 'files']) : '',
  ].filter(Boolean);
  return parts.length ? `with ${parts.join(', ')}` : '';
}

export function MoveRecordsDialog({ orgId, entity, ids, name, onClose, onMoved }: { orgId: string; entity: MovableEntity; ids: string[]; name?: string; onClose: () => void; onMoved: (movedIds: string[], toOrgId: string) => void }) {
  const toast = useToast();
  const targets = useQuery({ queryKey: ['crm', orgId, 'transfer-targets'], queryFn: () => get<{ enabled: boolean; targets: Target[] }>(crm(orgId, '/transfer/targets')), retry: false });
  const list = (targets.data?.targets ?? []).filter((t) => t.create[entity]);
  const [toOrgId, setToOrgId] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!toOrgId && list.length) setToOrgId(list[0].orgId);
  }, [list, toOrgId]);
  useEffect(() => setPreview(null), [toOrgId]);

  const what = ids.length === 1 ? (name ? `"${name}"` : `this ${WORD[entity][0]}`) : plural(ids.length, WORD[entity]);
  const request = { ids, toOrgId };

  async function check() {
    setBusy(true);
    setError(null);
    try {
      setPreview(await post<Preview>(crm(orgId, `/${PATH[entity]}/transfer/preview`), request));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function move() {
    setBusy(true);
    setError(null);
    try {
      const r = await post<Preview & { ok: boolean }>(crm(orgId, `/${PATH[entity]}/transfer`), request);
      const left = r.records.filter((x) => !x.ok);
      const movedIds = r.records.filter((x) => x.ok).map((x) => x.id);
      toast(`${plural(r.moved, WORD[entity])} moved to ${r.target.orgName}${left.length ? `; ${left.length} stayed here` : ''}`, left.length ? 'error' : undefined);
      onMoved(movedIds, toOrgId);
      if (left.length) setPreview(r);
      else onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  const movable = preview ? preview.records.filter((x) => x.ok).length : 0;
  return (
    <Modal
      title={`Move ${what} to another company`}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          {preview ? (
            <button className="btn primary" disabled={busy || !movable} onClick={() => void move()}>{busy ? 'Moving...' : movable ? `Move ${plural(movable, WORD[entity])}` : 'Nothing to move'}</button>
          ) : (
            <button className="btn primary" disabled={busy || !toOrgId} onClick={() => void check()}>{busy ? 'Checking...' : 'Check what moves'}</button>
          )}
        </>
      }
    >
      <div className="stack">
        <p className="muted">
          Move to the CRM of another company you work in. Notes, activities, files and history go with {ids.length === 1 ? 'it' : 'them'}
          {entity === 'company' ? ', and so do its contacts' : ''}. Anything on a deal, a sales order or a Finance customer here stays here.
        </p>
        {targets.isLoading ? <p className="muted">Loading your other companies...</p> : null}
        {targets.error ? <p className="error-box">{errorMessage(targets.error)}</p> : null}
        {targets.data && !list.length ? <p className="muted">There is no other company's CRM you can add {WORD[entity][1]} to, where moving is switched on.</p> : null}
        {list.length ? (
          <label className="field">
            <span className="label">Company</span>
            <select className="select" value={toOrgId} onChange={(e) => setToOrgId(e.target.value)}>
              {list.map((t) => <option key={t.orgId} value={t.orgId}>{t.companyName}{t.name !== t.companyName ? ` (${t.name})` : ''}</option>)}
            </select>
          </label>
        ) : null}
        {error ? <p className="error-box" role="alert">{error}</p> : null}
        {preview ? (
          <div className="stack move-preview" aria-live="polite">
            <ul className="move-tasks">
              {preview.records.map((x) => (
                <li key={x.id} className={x.ok ? '' : 'refused'}>
                  <span className="move-task-name">{x.name} {x.ok ? <span className="muted">{carries(x.carries)}</span> : null}</span>
                  {x.error ? <span className="danger-text">{x.error}</span> : null}
                  {x.ok && x.notCarried.length ? <span className="muted">Not carried over: {x.notCarried.map((n) => `${n.field} (${n.reason})`).join('; ')}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
