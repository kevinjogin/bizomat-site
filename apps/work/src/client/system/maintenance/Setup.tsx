// Maintenance settings for stages M2 and M3: sites, trades and technicians' labour rates, and maintenance stores (ERP
// warehouses; their stock and stocktakes stay in Inventory).
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, patch, post, put } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { ROLE_LABELS, dateTimeText, money, mtPage, mtPath, useSites, type MtMe, type MtRole } from './api';
import { Section } from './common';

function useRun(companyId: string) {
  const toast = useToast();
  const qc = useQueryClient();
  return async (fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      return true;
    } catch (err) {
      toast(errorMessage(err), 'error');
      return false;
    }
  };
}

const cents = (v: string) => (v.trim() === '' ? null : Math.round(Number(v) * 100));
const dollarsText = (c: number | null | undefined) => (c == null ? '' : (c / 100).toFixed(2));

export function SitesSection({ companyId, me }: { companyId: string; me: MtMe }) {
  const sites = useSites(companyId);
  const run = useRun(companyId);
  const [f, setF] = useState({ code: '', name: '', address: '' });
  return (
    <Section title="Sites">
      <p className="muted small">Places where assets are: a plant, a depot, a building. Lists, the calendar and the reports filter by site. Place assets on each asset’s page (with the assets under it, if you like).</p>
      {sites.error ? <ErrorBox error={sites.error} retry={() => sites.refetch()} /> : !sites.data ? <Loading /> : (
        <>
          {sites.data.sites.length ? (
            <table className="data-table mt-table">
              <thead><tr><th>Code</th><th>Name</th><th>Assets</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {sites.data.sites.map((s) => (
                  <tr key={s.id}>
                    <td data-label="Code" className="mt-num">{s.code}</td>
                    <td data-label="Name">{s.name}{s.address ? <div className="muted small">{s.address}</div> : null}{s.archived ? <span className="badge"> Archived</span> : null}</td>
                    <td data-label="Assets" className="mt-num">{s.assets}</td>
                    <td>{me.can.manageSetup ? <button className="btn ghost sm" onClick={() => run(() => patch(mtPath(companyId, `/sites/${s.id}`), { archived: !s.archived }), s.archived ? 'Restored' : 'Archived')}>{s.archived ? 'Restore' : 'Archive'}</button> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="muted small">No sites yet.</p>}
          {sites.data.unplaced ? <p className="small">{sites.data.unplaced} {sites.data.unplaced === 1 ? 'asset is' : 'assets are'} not in a site.</p> : null}
        </>
      )}
      {me.can.manageSetup ? (
        <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void run(() => post(mtPath(companyId, '/sites'), { code: f.code.trim(), name: f.name.trim(), address: f.address }), 'Site added').then((ok) => ok && setF({ code: '', name: '', address: '' })); }}>
          <input className="input mt-qty" aria-label="Site code" maxLength={40} placeholder="Code" value={f.code} onChange={(e) => setF((x) => ({ ...x, code: e.target.value }))} />
          <input className="input" aria-label="Site name" maxLength={200} placeholder="Name" value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} />
          <input className="input" aria-label="Address" maxLength={500} placeholder="Address (optional)" value={f.address} onChange={(e) => setF((x) => ({ ...x, address: e.target.value }))} />
          <button className="btn" disabled={!f.code.trim() || !f.name.trim()}><Icon name="plus" /> Add site</button>
        </form>
      ) : null}
    </Section>
  );
}

interface TradesData {
  trades: { id: string; name: string; rateCents?: number | null; archived: boolean; people: number }[];
  technicians: { id: string; name: string; role?: MtRole; rateCents?: number | null; tradeIds: string[] }[];
  can: { manage: boolean };
}

export function TradesSection({ companyId }: { companyId: string; me: MtMe }) {
  const q = useQuery({ queryKey: ['mt', companyId, 'trades'], queryFn: () => get<TradesData>(mtPath(companyId, '/trades')) });
  const run = useRun(companyId);
  const [f, setF] = useState({ name: '', rate: '' });
  const [rates, setRates] = useState<Record<string, string>>({});
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const manage = q.data.can.manage;
  // Roles are shown to supervisors and administrators; others see who works in which trade.
  const people = q.data.technicians.filter((p) => (p.role ? p.role !== 'requester' : p.tradeIds.length > 0));
  return (
    <Section title="Trades and technicians">
      <p className="muted small">Labour is priced when its time is recorded: the person’s own hourly rate, else the rate of the work order’s trade, else the highest rate of the person’s trades. A later change of rate never changes past costs. Rates are shown to supervisors and administrators only.</p>
      {q.data.trades.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Trade</th>{manage ? <th>Hourly rate</th> : null}<th>People</th><th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {q.data.trades.map((t) => (
              <tr key={t.id}>
                <td data-label="Trade">{t.name}{t.archived ? <span className="badge"> Archived</span> : null}</td>
                {manage ? (
                  <td data-label="Hourly rate">
                    <form className="row" onSubmit={(e) => { e.preventDefault(); void run(() => patch(mtPath(companyId, `/trades/${t.id}`), { rateCents: cents(rates[`t-${t.id}`] ?? dollarsText(t.rateCents)) }), 'Rate saved'); }}>
                      <input className="input mt-qty" aria-label={`Hourly rate of ${t.name} in dollars`} type="number" min="0" step="0.01" value={rates[`t-${t.id}`] ?? dollarsText(t.rateCents)} onChange={(e) => setRates((x) => ({ ...x, [`t-${t.id}`]: e.target.value }))} />
                      <button className="btn sm">Save</button>
                    </form>
                  </td>
                ) : null}
                <td data-label="People" className="mt-num">{t.people}</td>
                <td>{manage ? <button className="btn ghost sm" onClick={() => run(() => patch(mtPath(companyId, `/trades/${t.id}`), { archived: !t.archived }), t.archived ? 'Restored' : 'Archived')}>{t.archived ? 'Restore' : 'Archive'}</button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted small">No trades yet.</p>}
      {manage ? (
        <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void run(() => post(mtPath(companyId, '/trades'), { name: f.name.trim(), rateCents: cents(f.rate) }), 'Trade added').then((ok) => ok && setF({ name: '', rate: '' })); }}>
          <input className="input" aria-label="Trade" maxLength={80} placeholder="Trade, for example Electrician" value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} />
          <input className="input mt-qty" aria-label="Hourly rate in dollars" type="number" min="0" step="0.01" placeholder="Rate" value={f.rate} onChange={(e) => setF((x) => ({ ...x, rate: e.target.value }))} />
          <button className="btn" disabled={!f.name.trim()}><Icon name="plus" /> Add trade</button>
        </form>
      ) : null}
      {people.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Person</th><th>Role</th>{manage ? <th>Own hourly rate</th> : null}<th>Trades</th></tr></thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id}>
                <td data-label="Person">{p.name}</td>
                <td data-label="Role">{p.role ? ROLE_LABELS[p.role] : ''}</td>
                {manage ? (
                  <td data-label="Own hourly rate">
                    <form className="row" onSubmit={(e) => { e.preventDefault(); void run(() => put(mtPath(companyId, `/technicians/${p.id}`), { rateCents: cents(rates[`p-${p.id}`] ?? dollarsText(p.rateCents)) }), 'Rate saved'); }}>
                      <input className="input mt-qty" aria-label={`Hourly rate of ${p.name} in dollars`} type="number" min="0" step="0.01" placeholder={p.rateCents == null ? 'None' : ''} value={rates[`p-${p.id}`] ?? dollarsText(p.rateCents)} onChange={(e) => setRates((x) => ({ ...x, [`p-${p.id}`]: e.target.value }))} />
                      <button className="btn sm">Save</button>
                    </form>
                  </td>
                ) : null}
                <td data-label="Trades">
                  {manage ? (
                    <span className="row wrap">
                      {q.data!.trades.filter((t) => !t.archived).map((t) => (
                        <label key={t.id} className="checkbox small">
                          <input type="checkbox" checked={p.tradeIds.includes(t.id)} onChange={(e) => void run(() => put(mtPath(companyId, `/technicians/${p.id}`), { tradeIds: e.target.checked ? [...p.tradeIds, t.id] : p.tradeIds.filter((x) => x !== t.id) }), 'Trades saved')} /> {t.name}
                        </label>
                      ))}
                    </span>
                  ) : q.data!.trades.filter((t) => p.tradeIds.includes(t.id)).map((t) => t.name).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {manage && people.some((p) => p.rateCents != null) ? <p className="muted small">Rates shown: {people.filter((p) => p.rateCents != null).map((p) => `${p.name} ${money(p.rateCents)}`).join(', ')} an hour.</p> : null}
    </Section>
  );
}

export function StoresSection({ companyId }: { companyId: string; me: MtMe }) {
  const q = useQuery({ queryKey: ['mt', companyId, 'stores'], queryFn: () => get<{ warehouses: { id: string; code: string; name: string; archived: boolean; isStore: boolean; counts: { id: string; number: string; kind: string; status: string; createdAt: number }[] }[]; can: { manage: boolean } }>(mtPath(companyId, '/stores')) });
  const run = useRun(companyId);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <Section title="Maintenance stores">
      <p className="muted small">Spare parts are products of ERP Inventory, kept in its warehouses: there is no second stock system. Mark the warehouses technicians issue parts from. Stock is received and moved in Inventory; stocktakes of a store are Inventory’s counts, started and counted under Stocktakes and approved in Inventory.</p>
      {q.data.warehouses.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Warehouse</th><th>Maintenance store</th><th>Stocktakes</th></tr></thead>
          <tbody>
            {q.data.warehouses.map((w) => (
              <tr key={w.id}>
                <td data-label="Warehouse"><span className="mt-num">{w.code}</span> {w.name}{w.archived ? <span className="badge"> Archived</span> : null}</td>
                <td data-label="Maintenance store">
                  {q.data!.can.manage ? <label className="checkbox"><input type="checkbox" checked={w.isStore} onChange={(e) => void run(() => put(mtPath(companyId, `/stores/${w.id}`), { store: e.target.checked }), e.target.checked ? 'Marked as a maintenance store' : 'No longer a maintenance store')} /> {w.isStore ? 'Yes' : 'No'}</label> : w.isStore ? 'Yes' : 'No'}
                </td>
                <td data-label="Stocktakes">
                  {w.isStore ? (
                    <span className="small">
                      {w.counts.length ? w.counts.map((k) => `${k.number} (${k.status}, ${dateTimeText(k.createdAt)})`).join('; ') : 'None yet'} · <Link to={mtPage(companyId, `/stocktakes?storeId=${encodeURIComponent(w.id)}`)}>Stocktakes</Link>
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted small">The company has no warehouses yet. Make one in Inventory first.</p>}
      {!q.data.can.manage ? <p className="muted small">Only maintenance administrators mark maintenance stores.</p> : null}
    </Section>
  );
}
