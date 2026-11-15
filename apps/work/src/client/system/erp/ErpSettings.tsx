// BIZOMAT ERP, Release 2: the company's purchasing and inventory settings (Administration > Purchasing and inventory
// settings): the purchase order approval limit, the adjustment approval threshold, negative stock, and the costing
// method, chosen before the first stock movement and then locked. ERP administrators change them; everyone sees them.
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import { dollars, erpPath, money, toCents, useErpMe, type ErpSettings } from './api';

export function ErpSettingsPage({ companyId, companyName }: { companyId: string; companyName: string }) {
  usePageTitle('Purchasing and inventory settings');
  const me = useErpMe(companyId);
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['erp', companyId, 'settings'], queryFn: () => get<{ settings: ErpSettings; methods: { value: string; label: string }[] }>(erpPath(companyId, '/erp-settings')) });
  const [f, setF] = useState<null | { limit: string; threshold: string; negative: boolean; method: string; currency: string }>(null);
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data || !me.data) return <Loading />;
  const s = q.data.settings;
  const edit = me.data.can['settings.manage'];
  const form = f ?? { limit: s.poApprovalLimitCents === null ? '' : dollars(s.poApprovalLimitCents), threshold: s.adjustmentApprovalCents === null ? '' : dollars(s.adjustmentApprovalCents), negative: s.allowNegativeStock, method: s.costingMethod ?? '', currency: s.currency };
  const save = async () => {
    const limit = toCents(form.limit);
    const threshold = toCents(form.threshold);
    if (limit === 'bad' || threshold === 'bad') return toast('Use amounts like 2000.00', 'error');
    try {
      await put(erpPath(companyId, '/erp-settings'), { poApprovalLimitCents: limit, adjustmentApprovalCents: threshold, allowNegativeStock: form.negative, costingMethod: !s.costingLocked && form.method ? form.method : undefined, currency: !s.costingLocked ? form.currency : undefined });
      toast('Settings saved');
      setF(null);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="page crm-page">
      <PageHeader title="Purchasing and inventory settings" subtitle={`${companyName}. ${edit ? 'ERP administrators change these.' : 'Only ERP administrators change these.'}`} />
      <section className="card card-pad stack">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="es-limit">Purchase order approval limit ({form.currency})</label>
            <input id="es-limit" className="input" inputMode="decimal" disabled={!edit} value={form.limit} onChange={(e) => setF({ ...form, limit: e.target.value })} placeholder="Not set" />
            <span className="muted small">A buyer’s order up to this total (with tax, in {form.currency}) is approved when submitted. Above it, or in another currency, a procurement manager approves. Not set: a procurement manager approves every order. Now: {s.poApprovalLimitCents === null ? 'not set' : money(s.poApprovalLimitCents, s.currency)}.</span>
          </div>
          <div className="field">
            <label htmlFor="es-thr">Adjustment approval threshold ({form.currency})</label>
            <input id="es-thr" className="input" inputMode="decimal" disabled={!edit} value={form.threshold} onChange={(e) => setF({ ...form, threshold: e.target.value })} placeholder="Not set" />
            <span className="muted small">A stock adjustment or scrap worth more than this waits for a warehouse manager. Not set: every adjustment does.</span>
          </div>
          <div className="field">
            <label htmlFor="es-method">Costing method</label>
            <select id="es-method" className="select" disabled={!edit || s.costingLocked} value={form.method} onChange={(e) => setF({ ...form, method: e.target.value })}><option value="">Not chosen (weighted average at the first movement)</option>{q.data.methods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select>
            <span className="muted small">{s.costingLocked ? `Locked: ${s.costingLabel}. It was fixed by the first stock movement.` : 'Choose before the first stock movement: it cannot change after.'}</span>
          </div>
          <div className="field">
            <label htmlFor="es-cur">Stock currency</label>
            <input id="es-cur" className="input" maxLength={3} disabled={!edit || s.costingLocked} value={form.currency} onChange={(e) => setF({ ...form, currency: e.target.value.toUpperCase() })} />
            <span className="muted small">Stock is valued in this currency. Goods bought in another currency are valued at their standard cost (no exchange rates are kept).</span>
          </div>
          <label className="row span-2"><input type="checkbox" disabled={!edit} checked={form.negative} onChange={(e) => setF({ ...form, negative: e.target.checked })} /> Allow stock below zero (off: an issue of more than is there is refused)</label>
        </div>
        {edit ? <div className="row"><div className="grow" /><button className="btn primary" onClick={() => void save()}>Save</button></div> : null}
      </section>
    </div>
  );
}
