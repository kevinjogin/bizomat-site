// BIZOMAT ERP, Releases 2 and 3: the company's purchasing, inventory and manufacturing settings (Administration): the
// purchase order approval limit, the adjustment approval threshold, negative stock, and the costing method, chosen
// before the first stock movement and then locked; the over-completion tolerance of manufacturing orders, reserving
// materials on release, the finished-goods location and the MRP horizon. ERP administrators change them; everyone
// sees them.
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
  usePageTitle('Purchasing, inventory and manufacturing settings');
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
      <PageHeader title="Purchasing, inventory and manufacturing settings" subtitle={`${companyName}. ${edit ? 'ERP administrators change these.' : 'Only ERP administrators change these.'}`} />
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
      <MfgSettings companyId={companyId} edit={edit} />
    </div>
  );
}

interface MfgSettingsView { settings: { overCompletionPct: number; reserveOnRelease: boolean; fgLocationId: string | null; fgLocationCode: string | null; mrpHorizonDays: number } }

function MfgSettings({ companyId, edit }: { companyId: string; edit: boolean }) {
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({ queryKey: ['erp', companyId, 'mfg-settings'], queryFn: () => get<MfgSettingsView>(erpPath(companyId, '/mfg-settings')) });
  const locs = useQuery({ queryKey: ['erp', companyId, 'mo-options'], queryFn: () => get<{ locations: { id: string; code: string; name: string }[] }>(erpPath(companyId, '/mo-options')) });
  const [f, setF] = useState<null | { tolerance: string; reserve: boolean; fg: string; horizon: string }>(null);
  if (!q.data) return null;
  const s = q.data.settings;
  const form = f ?? { tolerance: String(s.overCompletionPct), reserve: s.reserveOnRelease, fg: s.fgLocationId ?? '', horizon: String(s.mrpHorizonDays) };
  const save = async () => {
    try {
      await put(erpPath(companyId, '/mfg-settings'), { overCompletionPct: Number(form.tolerance || 0), reserveOnRelease: form.reserve, fgLocationId: form.fg || null, mrpHorizonDays: Number(form.horizon || 90) });
      toast('Manufacturing settings saved');
      setF(null);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <section className="card card-pad stack">
      <h2 className="crm-subhead">Manufacturing</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="ms-tol">Over-completion tolerance (%)</label>
          <input id="ms-tol" className="input" type="number" min="0" max="100" step="any" disabled={!edit} value={form.tolerance} onChange={(e) => setF({ ...form, tolerance: e.target.value })} />
          <span className="muted small">How far above its quantity an order may be completed. 0: not at all. It applies to orders drafted after it is set.</span>
        </div>
        <div className="field">
          <label htmlFor="ms-hz">MRP horizon (days)</label>
          <input id="ms-hz" className="input" type="number" min="7" max="730" disabled={!edit} value={form.horizon} onChange={(e) => setF({ ...form, horizon: e.target.value })} />
          <span className="muted small">Demand due within this many days is planned.</span>
        </div>
        <div className="field">
          <label htmlFor="ms-fg">Finished goods go to</label>
          <select id="ms-fg" className="select" disabled={!edit} value={form.fg} onChange={(e) => setF({ ...form, fg: e.target.value })}><option value="">Not set (each product’s usual location)</option>{(locs.data?.locations ?? []).map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}</select>
        </div>
        <label className="row"><input type="checkbox" disabled={!edit} checked={form.reserve} onChange={(e) => setF({ ...form, reserve: e.target.checked })} /> Reserve materials when an order is released</label>
      </div>
      {edit ? <div className="row"><div className="grow" /><button className="btn primary" onClick={() => void save()}>Save</button></div> : null}
    </section>
  );
}
