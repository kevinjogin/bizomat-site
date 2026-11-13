// "Across your company" on a CRM deal or company, when the CRM organisation belongs to a BIZOMAT company that also runs
// Finance or Project Management (src/worker/company/links.ts): the deal's invoice and project, the company's customer
// record in Finance. Shown only when there is something to show; each action follows the other tool's permissions.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { errorMessage, get, post } from '../lib/api';
import { formatMoney } from '../../shared/crm/money';
import { useToast } from '../components/ui/overlays';

interface DealLinks {
  company: { id: string; name: string } | null;
  deal?: { status: string; value: number; currency: string };
  finance?: { access: boolean; canInvoice: boolean; sameCurrency: boolean; invoice: ({ id: string; number: string; status: string; total: number; currency: string; url: string } & { hidden?: undefined }) | { hidden: true } | null } | null;
  tasks?: { access: boolean; canStart: boolean; project: ({ id: string; name: string; url: string } & { hidden?: undefined }) | { hidden: true } | null } | null;
}

interface CompanyLinks {
  company: { id: string; name: string } | null;
  finance: { access: boolean; orgId?: string; canCreate?: boolean; contact?: { id: string; name: string; url: string } | null; receivables?: { openInvoices: number; owed: number; currency: string; lastIssued: string | null } | null } | null;
}

const STATUS: Record<string, string> = { draft: 'Draft', submitted: 'Awaiting approval', approved: 'Approved', part_paid: 'Part paid', paid: 'Paid', void: 'Void' };

export function DealCompanyLinks({ orgId, dealId }: { orgId: string; dealId: string }) {
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const q = useQuery({ queryKey: ['crm-links', orgId, 'deal', dealId], queryFn: () => get<DealLinks>(`/company/links/crm/${orgId}/deals/${dealId}`), retry: false });
  if (!q.data?.company || (!q.data.finance && !q.data.tasks)) return null;
  const { finance, tasks } = q.data;
  const act = async (what: 'invoice' | 'project') => {
    setBusy(what);
    try {
      const r = await post<{ url: string }>(`/company/links/crm/${orgId}/deals/${dealId}/${what}`);
      toast(what === 'invoice' ? 'Draft invoice made in Finance' : 'Project started in Project Management');
      await q.refetch();
      if (r.url) window.open(r.url, '_self');
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(null);
    }
  };
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">Across {q.data.company.name}</h2>
      {finance ? (
        <div className="stack">
          <strong className="small">Finance</strong>
          {finance.invoice && !('hidden' in finance.invoice && finance.invoice.hidden) ? (
            <a href={(finance.invoice as { url: string }).url}>
              Invoice {(finance.invoice as { number: string }).number} · {STATUS[(finance.invoice as { status: string }).status] ?? (finance.invoice as { status: string }).status} · {formatMoney((finance.invoice as { total: number }).total, (finance.invoice as { currency: string }).currency)}
            </a>
          ) : finance.invoice ? (
            <span className="muted small">This deal has an invoice in Finance.</span>
          ) : !finance.access ? (
            <span className="muted small">You have no access to Finance.</span>
          ) : q.data.deal?.status !== 'won' ? (
            <span className="muted small">When the deal is won, it can become a draft invoice.</span>
          ) : !finance.sameCurrency ? (
            <span className="muted small">The deal is in another currency than Finance: make the invoice in Finance.</span>
          ) : finance.canInvoice ? (
            <div>
              <button className="btn sm" disabled={busy !== null} onClick={() => act('invoice')}>{busy === 'invoice' ? 'Making…' : 'Make a draft invoice'}</button>
              <p className="muted small">One line with the deal’s title and value, for this deal’s company. A draft: check the amount, GST and account in Finance before approving.</p>
            </div>
          ) : (
            <span className="muted small">Your Finance role cannot create invoices.</span>
          )}
        </div>
      ) : null}
      {tasks ? (
        <div className="stack">
          <strong className="small">Project Management</strong>
          {tasks.project && !('hidden' in tasks.project && tasks.project.hidden) ? (
            <a href={(tasks.project as { url: string }).url}>Project: {(tasks.project as { name: string }).name}</a>
          ) : tasks.project ? (
            <span className="muted small">This deal has a project.</span>
          ) : tasks.canStart ? (
            <div>
              <button className="btn sm" disabled={busy !== null} onClick={() => act('project')}>{busy === 'project' ? 'Starting…' : 'Start a project'}</button>
              <p className="muted small">A project board named after the deal, in the company’s Project Management.</p>
            </div>
          ) : (
            <span className="muted small">You cannot create projects in Project Management.</span>
          )}
        </div>
      ) : null}
    </section>
  );
}

export function CustomerCompanyLinks({ orgId, companyId }: { orgId: string; companyId: string }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const q = useQuery({ queryKey: ['crm-links', orgId, 'company', companyId], queryFn: () => get<CompanyLinks>(`/company/links/crm/${orgId}/companies/${companyId}`), retry: false });
  if (!q.data?.company || !q.data.finance) return null;
  const f = q.data.finance;
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">In Finance</h2>
      {!f.access ? (
        <span className="muted small">You have no access to {q.data.company.name}’s Finance.</span>
      ) : f.contact ? (
        <>
          <a href={f.contact.url}>Customer: {f.contact.name}</a>
          {f.receivables ? (
            <span className="small">
              {f.receivables.openInvoices ? `${f.receivables.openInvoices} open ${f.receivables.openInvoices === 1 ? 'invoice' : 'invoices'}, ${formatMoney(f.receivables.owed, f.receivables.currency)} owed` : 'Nothing owed'}
            </span>
          ) : null}
        </>
      ) : f.canCreate ? (
        <div>
          <button
            className="btn sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              try {
                await post(`/company/links/crm/${orgId}/companies/${companyId}/customer`);
                toast('Customer added in Finance');
                await q.refetch();
              } catch (e) {
                toast(errorMessage(e), 'error');
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? 'Adding…' : 'Add as a customer in Finance'}
          </button>
          <p className="muted small">One customer record: Finance gets this company’s name, email, phone and address, and its invoices show here.</p>
        </div>
      ) : (
        <span className="muted small">Not a customer in Finance yet.</span>
      )}
    </section>
  );
}
