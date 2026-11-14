// "Report a fault" from anywhere in BIZOMAT ERP (the button at the foot of the module rail): a maintenance request in
// one of the person's companies, without leaving the page they are on.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { SUITE } from '../../lib/base';
import { Modal } from '../../components/ui/overlays';
import { Loading } from '../../components/ui/ui';
import '../../styles/maintenance.css';
import { mtPage, useMtMe, type MtRequest, type MtRole } from './api';
import { RequestForm } from './Requests';

const LAST_KEY = 'bizomat-system-company';

function lastCompany(): string | null {
  try {
    return localStorage.getItem(LAST_KEY);
  } catch {
    return null;
  }
}

export default function ReportFault({ onClose }: { onClose: () => void }) {
  const list = useQuery({ queryKey: ['mt', 'companies'], queryFn: () => get<{ companies: { id: string; name: string; kind: 'registered' | 'own'; role: MtRole }[] }>('/maintenance/companies') });
  const companies = list.data?.companies ?? [];
  const [chosen, setChosen] = useState('');
  const companyId = chosen || (companies.find((c) => c.id === lastCompany()) ?? companies.find((c) => c.kind === 'registered') ?? companies[0])?.id || '';
  const me = useMtMe(companyId);
  const [done, setDone] = useState<MtRequest | null>(null);
  const link = done ? `${SUITE || '/erp'}${mtPage(companyId, `/requests/${done.id}`)}` : '';
  return (
    <Modal wide title="Report a fault" onClose={onClose}>
      {!list.data ? <Loading /> : !companies.length ? (
        <p>You are not in a company with maintenance yet.</p>
      ) : done ? (
        <div className="stack">
          <div className="ok-box">Request {done.number} sent. {done.status === 'awaiting_approval' ? 'A supervisor will look at it.' : 'It is with the maintenance team.'}</div>
          <div className="row wrap">
            <a className="btn primary" href={link}>Open {done.number}</a>
            <button className="btn" onClick={() => setDone(null)}>Report another</button>
            <button className="btn ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      ) : (
        <div className="stack">
          {companies.length > 1 ? (
            <div className="field">
              <label htmlFor="rf-company">Company</label>
              <select id="rf-company" className="select" value={companyId} onChange={(e) => setChosen(e.target.value)}>
                {companies.map((c) => <option key={c.id} value={c.id}>{c.name}{c.kind === 'own' ? ' (your own)' : ''}</option>)}
              </select>
            </div>
          ) : null}
          {companyId ? <RequestForm key={companyId} companyId={companyId} me={me.data ?? null} compact onDone={setDone} onCancel={onClose} /> : null}
        </div>
      )}
    </Modal>
  );
}
