// The Finance postings tab of Fixed assets, Payroll and Revenue recognition: the accounts each part of a journal posts to
// in the company's Finance workspace (suggested from its chart until someone chooses), and, for depreciation and earned
// revenue, posting every record up to a date at once. The server (src/worker/erp/objects/postings.ts) checks every
// account, role and Finance permission again.
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post, put } from '../../../lib/api';
import { appUrl } from '../../../lib/base';
import { usePageTitle } from '../../../lib/hooks';
import { Icon } from '../../../components/ui/Icon';
import { ErrorBox, Loading } from '../../../components/ui/ui';
import { useToast } from '../../../components/ui/overlays';
import { Section } from '../../maintenance/common';
import { moneyText, xPath } from './api';

type Kind = 'depreciation' | 'payroll' | 'revenue';

interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
}

interface Settings {
  workspace: { id: string; name: string; currency: string; lockDate: string | null };
  canEdit: boolean;
  canPost: boolean;
  roles: { role: string; kind: Kind; label: string; help: string; types: string[]; ifUsed: boolean; account: Account | null; suggested: Account | null }[];
  accounts: Account[];
}

interface RunResult {
  label: string;
  upTo: string;
  checked: number;
  records: number;
  journals: number;
  problems: { number: string; title: string; message: string }[];
  more: boolean;
}

export const POSTING_KIND_OF_MODULE: Record<string, Kind> = { fixed_assets: 'depreciation', payroll: 'payroll', revenue: 'revenue' };

export function PostingsTab({ companyId, kind }: { companyId: string; kind: Kind }) {
  usePageTitle('Finance postings');
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['erp', companyId, 'x', 'postings'], queryFn: () => get<Settings>(xPath(companyId, '/postings')), retry: false });
  const [pick, setPick] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [upTo, setUpTo] = useState(() => {
    const d = new Date();
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 0)).toISOString().slice(0, 10);
  });
  const [run, setRun] = useState<RunResult | null>(null);
  useEffect(() => {
    if (!q.data) return;
    const next: Record<string, string> = {};
    for (const r of q.data.roles) if (r.kind === kind) next[r.role] = r.account?.id ?? r.suggested?.id ?? '';
    setPick(next);
  }, [q.data, kind]);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading label="Reading the Finance workspace…" />;
  const s = q.data;
  const roles = s.roles.filter((r) => r.kind === kind);
  const unsaved = roles.some((r) => (pick[r.role] ?? '') !== (r.account?.id ?? ''));
  const missing = roles.filter((r) => !r.ifUsed && !r.account);
  const save = async () => {
    setBusy(true);
    try {
      const next = await put<Settings>(xPath(companyId, '/postings'), { accounts: Object.fromEntries(roles.map((r) => [r.role, pick[r.role] || null])) });
      qc.setQueryData(['erp', companyId, 'x', 'postings'], next);
      toast('Posting accounts saved');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const postAll = async () => {
    setBusy(true);
    try {
      const r = await post<RunResult>(xPath(companyId, '/postings/run'), { kind, upTo });
      setRun(r);
      toast(r.journals ? `${r.journals} journals posted` : 'Nothing new to post');
      await qc.invalidateQueries({ queryKey: ['erp', companyId, 'x'] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const journals = appUrl(`/finance/o/${s.workspace.id}/accounting/journals`);
  return (
    <div className="stack">
      <p className="info-box small">
        Journals post to {s.workspace.name}, in {s.workspace.currency}, through Finance’s own ledger: they balance, never go into a locked period
        {s.workspace.lockDate ? ` (the books are locked up to ${s.workspace.lockDate}: earlier months post together on the first open day)` : ''}, and are corrected by reversing them. Ask your accountant which accounts to use. <a href={journals}>Open the journals in Finance</a>
      </p>
      <Section
        title="Posting accounts"
        actions={s.canEdit ? <button className="btn sm primary" disabled={busy || !unsaved} onClick={() => void save()}><Icon name="check" /> Save</button> : undefined}
      >
        <div className="crm-form-grid">
          {roles.map((r) => {
            const options = s.accounts.filter((acc) => r.types.includes(acc.type));
            const id = `pa-${r.role}`;
            return (
              <div key={r.role} className="field">
                <label htmlFor={id}>{r.label}{r.ifUsed ? ' (when used)' : ''}</label>
                <select id={id} className="select" disabled={!s.canEdit} value={pick[r.role] ?? ''} onChange={(e) => setPick((x) => ({ ...x, [r.role]: e.target.value }))}>
                  <option value="">Not chosen</option>
                  {options.map((acc) => <option key={acc.id} value={acc.id}>{acc.code} {acc.name}</option>)}
                </select>
                <span className="muted small">
                  {r.help}
                  {!r.account && r.suggested ? ` Suggested from your chart: ${r.suggested.code} ${r.suggested.name} (not saved yet).` : ''}
                  {!r.account && !r.suggested && !r.ifUsed ? ' Nothing in your chart fits: add the account in Finance, then choose it.' : ''}
                </span>
              </div>
            );
          })}
        </div>
        {!s.canEdit ? <p className="muted small">An ERP administrator or a finance controller chooses these accounts.</p> : null}
        {missing.length && !unsaved ? <p className="warning-text small">Nothing posts until these are saved: {missing.map((r) => r.label).join(', ')}.</p> : null}
      </Section>
      {kind !== 'payroll' ? (
        <Section title={kind === 'depreciation' ? 'Post every asset’s depreciation' : 'Post every schedule’s earned revenue'}>
          {s.canPost ? (
            <div className="row wrap">
              <div className="field">
                <label htmlFor="pa-upto">Months that end on or before</label>
                <input id="pa-upto" className="input" type="date" value={upTo} onChange={(e) => setUpTo(e.target.value)} />
              </div>
              <button className="btn primary" disabled={busy || !upTo || missing.length > 0 || unsaved} onClick={() => void postAll()}><Icon name="bolt" /> Post to Finance</button>
            </div>
          ) : <p className="muted small">Your Finance role cannot post journals. A Finance owner, administrator or accountant can.</p>}
          {run ? (
            <div className="stack">
              <p className="small">{run.checked} checked; {run.journals} journals posted for {run.records} records, up to {run.upTo}.{run.more ? ' More remain: post again.' : ''}</p>
              {run.problems.length ? <ul className="erp-list small">{run.problems.slice(0, 50).map((p) => <li key={p.number}><span className="mt-num">{p.number}</span> {p.title}: <span className="warning-text">{p.message}</span></li>)}</ul> : null}
            </div>
          ) : null}
        </Section>
      ) : <p className="muted small">Each approved pay run is posted from its own page with Post to Finance.</p>}
    </div>
  );
}

export function RecordPostings({ postings, currency }: { currency: string; postings: { journals: { number: number | null; date: string | null; amount: number; covers: string; reversed: boolean; reversalNumber: number | null }[]; url: string | null } }) {
  if (!postings.journals.length) return <p className="muted small">Nothing of this record is posted to Finance yet.</p>;
  return (
    <div className="stack">
      <div className="crm-table-scroll">
        <table className="data-table responsive">
          <thead><tr><th>Journal</th><th>Date</th><th>Covers</th><th className="num">Amount</th><th>State</th></tr></thead>
          <tbody>
            {postings.journals.map((j, i) => (
              <tr key={i}>
                <td data-label="Journal">{j.number ?? ''}</td>
                <td data-label="Date">{j.date ?? ''}</td>
                <td data-label="Covers">{j.covers}</td>
                <td className="num" data-label="Amount">{moneyText(j.amount, currency)}</td>
                <td data-label="State">{j.reversed ? `Reversed${j.reversalNumber ? ` by journal ${j.reversalNumber}` : ''}` : 'Posted'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {postings.url ? <p className="small"><a href={appUrl(postings.url.replace(/^\/erp/, ''))}>Open the journals in Finance</a></p> : null}
    </div>
  );
}
