// What a customer sees through a secure online link (/finance/view/<kind>/<id>?k=...), without signing in: the
// document itself (its PDF, drawn by the same engine as every copy), a download, and for a quote, accepting or
// declining it. Opening the page records that the customer viewed it; it never marks an invoice paid.
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { errorMessage, get, post } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { appUrl } from '../lib/base';
import { formatMoney } from '../../shared/crm/money';
import { Icon, ProductLockup } from '../components/ui/Icon';
import { ErrorBox, Loading } from '../components/ui/ui';
import { useToast } from '../components/ui/overlays';
import { PlatformFooter } from '../components/layout/PlatformLinks';
import { longDate } from './lib';
import '../styles/crm.css';
import '../styles/fin.css';

interface PublicDoc {
  kind: 'quote' | 'invoice' | 'credit_note';
  number: string;
  organisation: { name: string; abn: string; email: string; phone: string };
  customer: string | null;
  issueDate: string;
  dueDate: string | null;
  expiryDate: string | null;
  currency: string;
  total: number;
  amountDue: number | null;
  status: string;
  version: number | null;
  canRespond: boolean;
  accepted: { name: string; at: number } | null;
  declined: boolean;
  pdf: string;
}

const TITLES = { quote: 'Quote', invoice: 'Invoice', credit_note: 'Credit note' } as const;
const STATUS_TEXT: Record<string, string> = {
  due: 'Due',
  overdue: 'Overdue',
  part_paid: 'Part paid',
  paid: 'Paid',
  void: 'Void: this invoice no longer applies',
  issued: 'Issued',
  sent: 'Waiting for your answer',
  accepted: 'Accepted',
  converted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
  cancelled: 'Cancelled by the sender',
  draft: 'Draft',
};

export function FinPublicView() {
  const { kind = '', id = '' } = useParams();
  const [params] = useSearchParams();
  const k = params.get('k') ?? '';
  const toast = useToast();
  const path = `/fin-public/view/${encodeURIComponent(kind)}/${encodeURIComponent(id)}?k=${encodeURIComponent(k)}`;
  const q = useQuery({ queryKey: ['fin-public', kind, id, k], queryFn: () => get<PublicDoc>(path), retry: false });
  const d = q.data;
  usePageTitle(d ? `${TITLES[d.kind]} ${d.number} from ${d.organisation.name}` : 'Document');
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const respond = async (action: 'accept' | 'decline') => {
    setBusy(true);
    try {
      await post(`/fin-public/view/quote/${encodeURIComponent(id)}/${action}?k=${encodeURIComponent(k)}`, action === 'accept' ? { name: name.trim(), agree: true } : { reason: reason.trim() || undefined, name: name.trim() || undefined });
      toast(action === 'accept' ? 'Thank you: the quote is accepted' : 'Your answer has been sent');
      await q.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const money = (n: number) => formatMoney(n, d?.currency ?? 'AUD');
  return (
    <div className="fin-public">
      <header className="fin-public-head">
        <ProductLockup height={15} />
      </header>
      {q.isLoading ? <Loading /> : null}
      {q.error ? <ErrorBox error={q.error} /> : null}
      {d ? (
        <div className="stack-lg">
          <section className="card card-pad">
            <div className="fin-public-head">
              <div>
                <h1>
                  {TITLES[d.kind]} {d.number}
                </h1>
                <p className="muted">
                  From {d.organisation.name}
                  {d.customer ? ` to ${d.customer}` : ''}
                  {d.version && d.version > 1 ? ` · version ${d.version}` : ''}
                </p>
              </div>
              <a className="btn primary" href={appUrl(`/${d.pdf}&download=1`)}>
                <Icon name="download" /> Download PDF
              </a>
            </div>
            <dl className="fin-detail">
              <dt>Status</dt>
              <dd>{STATUS_TEXT[d.status] ?? d.status}</dd>
              <dt>Date</dt>
              <dd>{longDate(d.issueDate)}</dd>
              {d.dueDate ? (
                <>
                  <dt>Due</dt>
                  <dd>{longDate(d.dueDate)}</dd>
                </>
              ) : null}
              {d.expiryDate ? (
                <>
                  <dt>Valid until</dt>
                  <dd>{longDate(d.expiryDate)}</dd>
                </>
              ) : null}
              <dt>{d.kind === 'credit_note' ? 'Credit' : 'Total'}</dt>
              <dd>
                <strong>{money(d.total)}</strong>
              </dd>
              {d.kind === 'invoice' && d.amountDue !== null ? (
                <>
                  <dt>Amount due</dt>
                  <dd>
                    <strong>{money(d.amountDue)}</strong>
                  </dd>
                </>
              ) : null}
              {d.organisation.email || d.organisation.phone ? (
                <>
                  <dt>Questions</dt>
                  <dd>{[d.organisation.email, d.organisation.phone].filter(Boolean).join(' · ')}</dd>
                </>
              ) : null}
            </dl>
            {d.kind === 'invoice' && d.status !== 'paid' && d.status !== 'void' ? <p className="muted small">Pay as the invoice describes. BIZOMAT does not take payments, and opening this page does not pay the invoice.</p> : null}
          </section>

          {d.kind === 'quote' && d.accepted ? (
            <div className="ok-box">
              Accepted by {d.accepted.name} on {new Date(d.accepted.at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </div>
          ) : null}
          {d.kind === 'quote' && d.declined ? <div className="warn-box">This quote was declined. Contact {d.organisation.name} if you would like a new one.</div> : null}
          {d.kind === 'quote' && d.status === 'expired' ? <div className="warn-box">This quote has expired. Contact {d.organisation.name} for a new one.</div> : null}

          {d.canRespond ? (
            <section className="card card-pad">
              <h2 className="crm-subhead">Your answer</h2>
              <div className="field">
                <label htmlFor="pub-name">Your full name</label>
                <input id="pub-name" className="input" maxLength={120} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {!declining ? (
                <>
                  <label className="row">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                    <span>
                      I accept quote {d.number} from {d.organisation.name}
                      {d.customer ? ` on behalf of ${d.customer}` : ''}, as shown below.
                    </span>
                  </label>
                  <div className="row wrap">
                    <button className="btn primary" disabled={busy || !agree || name.trim().length < 2} onClick={() => respond('accept')}>
                      <Icon name="check" /> Accept the quote
                    </button>
                    <button className="btn" disabled={busy} onClick={() => setDeclining(true)}>
                      Decline
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="field">
                    <label htmlFor="pub-reason">Reason (optional)</label>
                    <textarea id="pub-reason" className="input" rows={3} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} />
                  </div>
                  <div className="row wrap">
                    <button className="btn danger" disabled={busy} onClick={() => respond('decline')}>
                      Decline the quote
                    </button>
                    <button className="btn ghost" disabled={busy} onClick={() => setDeclining(false)}>
                      Back
                    </button>
                  </div>
                </>
              )}
              <p className="muted small">Your answer, your name and the time are recorded and sent to {d.organisation.name}.</p>
            </section>
          ) : null}

          <section className="card card-pad">
            <iframe className="fin-preview-frame" src={appUrl(`/${d.pdf}`)} title={`${TITLES[d.kind]} ${d.number}`} />
          </section>
        </div>
      ) : null}
      <PlatformFooter />
    </div>
  );
}
