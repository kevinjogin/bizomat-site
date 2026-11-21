// BIZOMAT ERP, Release 2: Inventory at /erp/c/<company>/inventory: stock per product and per location, lot and serial;
// warehouses and their location tree with QR labels; the movement ledger; reservations, issues, transfers, quarantine,
// returns and scrap; adjustments with approval above the company's threshold; stocktakes and cycle counts; valuation;
// traceability; and the warehouse screen for phones (WarehouseScreen.tsx). The server decides what each person may do.
import { useMemo, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, patch, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import {
  LOCATION_KINDS,
  LOCATION_LEVELS,
  apiHref,
  dateText,
  dayText,
  erpPath,
  inventoryPage,
  money,
  procurementPage,
  productsPage,
  qualityPage,
  manufacturingPage,
  supplyPage,
  qty,
  toCents,
  useErpMe,
  type ErpEvent,
  type ErpMe,
  type Location,
  type Move,
  type StockRow,
  type Warehouse,
} from './api';
import { AdjBadge, CountBadge, CsvLink, FilterPanel, History, Pager, Props, Section, options } from './common';
import { NoteDialog } from './Changes';
import { useListParams } from './Purchasing';
import { WarehouseScreen } from './WarehouseScreen';
import { ReplenishmentPage } from './Replenishment';

export function InventoryArea({ companyId, companyName }: { companyId: string; companyName: string }) {
  const me = useErpMe(companyId);
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) {
      return (
        <div className="page crm-page">
          <PageHeader title="Inventory" />
          <section className="co-prompt"><p>You do not have access to inventory in {companyName}. People in the company have access; people who only share a tool with it do not.</p></section>
        </div>
      );
    }
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading label="Opening Inventory…" />;
  const m = me.data;
  const tab = (to: string, icon: Parameters<typeof Icon>[0]['name'], label: string, end = false) => (
    <NavLink to={inventoryPage(companyId, to)} end={end} className={({ isActive }) => `tab${isActive ? ' active' : ''}`}><Icon name={icon} size={14} /> {label}</NavLink>
  );
  return (
    <div className="page crm-page">
      <PageHeader title="Stock" subtitle={`Warehouse: the stock and warehouses of ${m.company.name}: what is where, every movement, counts and value.`} />
      <nav className="tabs mt-tabs erp-area-tabs" aria-label="Inventory sections">
        {tab('', 'layers', 'Stock', true)}
        {tab('/warehouses', 'map', 'Warehouses')}
        {tab('/movements', 'activity', 'Movements')}
        {tab('/adjustments', 'edit', 'Adjustments')}
        {tab('/counts', 'checkSquare', 'Counts')}
        {tab('/valuation', 'dollar', 'Valuation')}
        {tab('/replenishment', 'refresh', 'Replenishment')}
        {tab('/scan', 'search', 'Warehouse screen')}
      </nav>
      <Routes>
        <Route index element={<StockPage companyId={companyId} me={m} />} />
        <Route path="stock/:productId" element={<ProductStock companyId={companyId} />} />
        <Route path="warehouses" element={<WarehousesPage companyId={companyId} me={m} />} />
        <Route path="warehouses/:id" element={<WarehouseDetail companyId={companyId} me={m} />} />
        <Route path="labels" element={<LabelsPage companyId={companyId} />} />
        <Route path="movements" element={<MovementsPage companyId={companyId} />} />
        <Route path="adjustments" element={<AdjustmentsPage companyId={companyId} me={m} />} />
        <Route path="counts" element={<CountsPage companyId={companyId} me={m} />} />
        <Route path="counts/:id" element={<CountDetail companyId={companyId} />} />
        <Route path="valuation" element={<ValuationPage companyId={companyId} />} />
        <Route path="replenishment" element={<ReplenishmentPage companyId={companyId} me={m} />} />
        <Route path="trace" element={<TracePage companyId={companyId} />} />
        <Route path="scan" element={<WarehouseScreen companyId={companyId} me={m} />} />
        <Route path="*" element={<Navigate to={inventoryPage(companyId)} replace />} />
      </Routes>
    </div>
  );
}

const useRefresh = (companyId: string) => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ['erp', companyId] });
};

export function useWarehouses(companyId: string) {
  return useQuery({ queryKey: ['erp', companyId, 'warehouses'], queryFn: () => get<{ warehouses: Warehouse[]; can: { setup: boolean } }>(erpPath(companyId, '/warehouses')) });
}

export function useLocations(companyId: string, warehouseId = '') {
  return useQuery({ queryKey: ['erp', companyId, 'locations', warehouseId || 'all'], queryFn: () => get<{ locations: Location[]; levels: { value: string; label: string }[]; kinds: { value: string; label: string }[] }>(erpPath(companyId, `/locations${warehouseId ? `?warehouseId=${warehouseId}` : ''}`)) });
}

const locLabel = (l: Location) => `${l.fullCode}${l.name ? ` ${l.name}` : ''}${l.kind !== 'normal' ? ` (${l.kindLabel})` : ''}`;

// ------------------------------------------------------------------ stock

interface StockSummary {
  productId: string;
  number: string;
  name: string;
  uom: string;
  onHand: number;
  reserved: number;
  available: number;
  quarantine: number;
  onOrder: number;
  reorderPoint: number | null;
  minQty: number | null;
  maxQty: number | null;
  valueCents: number;
  belowReorder: boolean;
  belowMin: boolean;
}

function StockPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Stock');
  const { g, set, offset } = useListParams();
  const whs = useWarehouses(companyId);
  const limit = 50;
  const detail = g('view') === 'detail';
  const filters = new URLSearchParams();
  for (const k of ['q', 'warehouseId', 'filter', 'sort', 'view']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'stock', filters.toString(), offset], queryFn: () => get<{ rows: (StockSummary | StockRow)[]; total: number; currency?: string; method?: string }>(erpPath(companyId, `/stock?${filters}&limit=${limit}&offset=${offset}`)) });
  const [adjusting, setAdjusting] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="row erp-toggle" role="group" aria-label="Show stock">
          <button className={`btn sm${detail ? '' : ' primary'}`} aria-pressed={!detail} onClick={() => set('view', '')}>By product</button>
          <button className={`btn sm${detail ? ' primary' : ''}`} aria-pressed={detail} onClick={() => set('view', 'detail')}>By location, lot and serial</button>
        </div>
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/stock?${filters}`} />
        {me.can['inventory.operate'] ? <button className="btn" onClick={() => setAdjusting(true)}>Adjust stock</button> : null}
        <Link className="btn primary" to={inventoryPage(companyId, '/scan')}><Icon name="search" /> Warehouse screen</Link>
      </div>
      <FilterPanel active={['q', 'warehouseId', 'filter'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="st-q">Search</label><input id="st-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder={detail ? 'Product, lot, serial' : 'Number, name, SKU'} /></div>
        <div className="field"><label htmlFor="st-wh">Warehouse</label><select id="st-wh" className="select" value={g('warehouseId')} onChange={(e) => set('warehouseId', e.target.value)}><option value="">All</option>{(whs.data?.warehouses ?? []).map((w) => <option key={w.id} value={w.id}>{w.code} {w.name}</option>)}</select></div>
        {!detail ? <div className="field"><label htmlFor="st-f">Show</label><select id="st-f" className="select" value={g('filter')} onChange={(e) => set('filter', e.target.value)}><option value="">Every stocked product</option><option value="in_stock">In stock</option><option value="below_reorder">At or below the reorder point</option><option value="below_min">Below the minimum</option></select></div> : null}
        <div className="field"><label htmlFor="st-sort">Sort by</label><select id="st-sort" className="select" value={g('sort')} onChange={(e) => set('sort', e.target.value)}>{detail ? <><option value="">Product</option><option value="location">Location</option><option value="expiry">Expiry</option><option value="qty">Quantity</option></> : <><option value="">Number</option><option value="name">Name</option><option value="on_hand">On hand</option><option value="available">Available</option><option value="value">Value</option></>}</select></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.rows.length ? (
          <EmptyState icon="layers" title={filters.toString() && filters.toString() !== 'view=detail' ? 'Nothing matches' : 'No stock yet'}>{whs.data && !whs.data.warehouses.length ? <>Set up a <Link to={inventoryPage(companyId, '/warehouses')}>warehouse and its locations</Link>, then receive goods against purchase orders.</> : 'Stock arrives through goods receipts, returns and adjustments.'}</EmptyState>
        ) : detail ? (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th>Location</th><th>Lot</th><th>Serial</th><th>Expiry</th><th className="num">On hand</th><th className="num">Reserved</th><th className="num">Available</th></tr></thead>
              <tbody>
                {(list.data.rows as StockRow[]).map((r) => (
                  <tr key={r.id}>
                    <td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.productNumber}</span> {r.productName}</Link></td>
                    <td data-label="Location">{r.warehouseCode}/{r.locationCode}{r.locationKind !== 'normal' ? <> <span className={`badge${r.locationKind === 'quarantine' ? ' warning' : ''}`}>{r.locationKindLabel}</span></> : null}</td>
                    <td data-label="Lot">{r.lot ? <Link to={inventoryPage(companyId, `/trace?productId=${r.productId}&lot=${encodeURIComponent(r.lot)}`)}>{r.lot}</Link> : ''}</td>
                    <td data-label="Serial">{r.serial ? <Link to={inventoryPage(companyId, `/trace?productId=${r.productId}&serial=${encodeURIComponent(r.serial)}`)}>{r.serial}</Link> : ''}</td>
                    <td data-label="Expiry">{dateText(r.expiry)}</td>
                    <td data-label="On hand" className="num">{qty(r.onHand)}</td>
                    <td data-label="Reserved" className="num">{r.reserved ? qty(r.reserved) : ''}</td>
                    <td data-label="Available" className="num">{qty(r.available)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Product</th><th className="num">On hand</th><th className="num">Reserved</th><th className="num">Available</th><th className="num">On order</th><th className="num">Reorder point</th><th className="num">Value</th></tr></thead>
              <tbody>
                {(list.data.rows as StockSummary[]).map((r) => (
                  <tr key={r.productId}>
                    <td data-label="Product"><Link className="mt-primary" to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link> {r.belowMin ? <span className="badge danger">Below minimum</span> : r.belowReorder ? <span className="badge warning">Reorder</span> : null}</td>
                    <td data-label="On hand" className="num">{qty(r.onHand)} <span className="muted small">{r.uom}</span>{r.quarantine ? <div className="muted small">+{qty(r.quarantine)} in quarantine</div> : null}</td>
                    <td data-label="Reserved" className="num">{r.reserved ? qty(r.reserved) : ''}</td>
                    <td data-label="Available" className="num">{qty(r.available)}</td>
                    <td data-label="On order" className="num">{r.onOrder ? qty(r.onOrder) : ''}</td>
                    <td data-label="Reorder point" className="num">{r.reorderPoint ?? ''}</td>
                    <td data-label="Value" className="num">{money(r.valueCents, list.data!.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {adjusting ? <AdjustmentDialog companyId={companyId} onClose={() => setAdjusting(false)} /> : null}
    </div>
  );
}

interface ProductStockView {
  product: { id: string; number: string; name: string; uom: string; type: string };
  settings: { trackLots: boolean; trackSerials: boolean; trackExpiry: boolean; inspectionRequired: boolean; reorderPoint: number | null; minQty: number | null; maxQty: number | null; defaultLocationId: string | null };
  totals: { onHand: number; reserved: number; available: number; quarantine: number; onOrder: number; valueCents: number; currency: string; unitCostCents: number | null; method: string };
  rows: StockRow[];
  can: { setup: boolean; operate: boolean };
}

type Op = 'issue' | 'transfer' | 'quarantine' | 'release' | 'customer-return' | 'supplier-return' | 'scrap' | 'reserve';
const OP_LABELS: Record<Op, string> = { issue: 'Issue', transfer: 'Move', quarantine: 'Quarantine', release: 'Release from quarantine', 'customer-return': 'Customer return', 'supplier-return': 'Return to supplier', scrap: 'Scrap', reserve: 'Reserve' };

function ProductStock({ companyId }: { companyId: string }) {
  const { productId = '' } = useParams();
  const q = useQuery({ queryKey: ['erp', companyId, 'product-stock', productId], queryFn: () => get<ProductStockView>(erpPath(companyId, `/products/${productId}/stock`)), retry: false });
  const moves = useQuery({ queryKey: ['erp', companyId, 'moves', 'product', productId], queryFn: () => get<{ moves: Move[] }>(erpPath(companyId, `/movements?productId=${productId}&limit=20`)) });
  const res = useQuery({ queryKey: ['erp', companyId, 'reservations'], queryFn: () => get<{ reservations: { id: string; productId: string; locationCode: string; warehouseCode: string; lot: string; serial: string; quantity: number; open: number; reference: string; byName: string | null; createdAt: number }[] }>(erpPath(companyId, '/reservations')) });
  const [op, setOp] = useState<{ op: Op; row?: StockRow } | null>(null);
  const [editing, setEditing] = useState(false);
  const refresh = useRefresh(companyId);
  const toast = useToast();
  usePageTitle(q.data ? `${q.data.product.number} stock` : 'Stock');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const p = v.product;
  const t = v.totals;
  const mine = (res.data?.reservations ?? []).filter((r) => r.productId === p.id);
  const resAct = async (id: string, action: 'release' | 'issue') => {
    try {
      await post(erpPath(companyId, `/reservations/${id}/${action}`), {});
      toast(action === 'issue' ? 'Issued' : 'Reservation released');
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={inventoryPage(companyId)}>Stock</Link><span className="sep">/</span><span>{p.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{p.number}</span> {p.name}</h2>
          <div className="mt-badges">{v.settings.trackLots ? <span className="badge">Lots</span> : null}{v.settings.trackSerials ? <span className="badge">Serial numbers</span> : null}{v.settings.trackExpiry ? <span className="badge">Expiry dates</span> : null}{v.settings.inspectionRequired ? <span className="badge warning">Inspection on receipt</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          <Link className="btn ghost" to={productsPage(companyId, `/${p.id}`)}>Product record</Link>
          <a className="btn ghost" href={apiHref(companyId, `/products/${p.id}/qr.svg`)} target="_blank" rel="noopener"><Icon name="grid" /> QR label</a>
          {v.can.operate ? <button className="btn" onClick={() => setOp({ op: 'customer-return' })}>Customer return</button> : null}
          {v.can.setup ? <button className="btn" onClick={() => setEditing(true)}><Icon name="settings" /> Stock settings</button> : null}
        </div>
      </div>
      <div className="erp-stats">
        <Stat label="On hand" value={`${qty(t.onHand)} ${p.uom}`} />
        <Stat label="Reserved" value={qty(t.reserved)} />
        <Stat label="Available" value={qty(t.available)} />
        <Stat label="In quarantine" value={qty(t.quarantine)} />
        <Stat label="On order" value={qty(t.onOrder)} />
        <Stat label="Value" value={money(t.valueCents, t.currency)} hint={t.unitCostCents !== null ? `${money(Math.round(t.unitCostCents), t.currency)} a unit, ${t.method === 'fifo' ? 'FIFO' : 'weighted average'}` : undefined} />
      </div>
      <Section title="Where it is">
        {!v.rows.length ? <p className="muted small">None in stock.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Location</th><th>Lot</th><th>Serial</th><th>Expiry</th><th className="num">On hand</th><th className="num">Reserved</th><th className="num">Available</th>{v.can.operate ? <th><span className="sr-only">Actions</span></th> : null}</tr></thead>
              <tbody>
                {v.rows.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Location">{r.warehouseCode}/{r.locationCode}{r.locationKind !== 'normal' ? <> <span className={`badge${r.locationKind === 'quarantine' ? ' warning' : ''}`}>{r.locationKindLabel}</span></> : null}</td>
                    <td data-label="Lot">{r.lot ? <Link to={inventoryPage(companyId, `/trace?productId=${p.id}&lot=${encodeURIComponent(r.lot)}`)}>{r.lot}</Link> : ''}</td>
                    <td data-label="Serial">{r.serial ? <Link to={inventoryPage(companyId, `/trace?productId=${p.id}&serial=${encodeURIComponent(r.serial)}`)}>{r.serial}</Link> : ''}</td>
                    <td data-label="Expiry">{dateText(r.expiry)}</td>
                    <td data-label="On hand" className="num">{qty(r.onHand)}</td>
                    <td data-label="Reserved" className="num">{r.reserved ? qty(r.reserved) : ''}</td>
                    <td data-label="Available" className="num">{qty(r.available)}</td>
                    {v.can.operate ? (
                      <td className="erp-actions">
                        <select className="select sm" aria-label={`Act on ${r.warehouseCode}/${r.locationCode}`} value="" onChange={(e) => e.target.value && setOp({ op: e.target.value as Op, row: r })}>
                          <option value="">Act…</option>
                          {(r.locationKind === 'quarantine' ? (['release', 'scrap', 'supplier-return'] as Op[]) : (['issue', 'transfer', 'reserve', 'quarantine', 'supplier-return', 'scrap'] as Op[])).map((o) => <option key={o} value={o}>{OP_LABELS[o]}</option>)}
                        </select>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      {mine.length ? (
        <Section title="Reservations">
          <ul className="erp-list">
            {mine.map((r) => (
              <li key={r.id} className="row wrap">
                <span className="grow">{qty(r.open)} of {qty(r.quantity)} at {r.warehouseCode}/{r.locationCode}{r.lot ? `, lot ${r.lot}` : ''} for <strong>{r.reference}</strong> <span className="muted small">{dayText(r.createdAt)}{r.byName ? ` by ${r.byName}` : ''}</span></span>
                {v.can.operate ? <><button className="btn sm" onClick={() => void resAct(r.id, 'issue')}>Issue it</button><button className="btn ghost sm" onClick={() => void resAct(r.id, 'release')}>Release</button></> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
      <div className="mt-grid">
        <Section title="Settings">
          <Props items={[['Reorder point', v.settings.reorderPoint ?? ''], ['Minimum', v.settings.minQty ?? ''], ['Maximum', v.settings.maxQty ?? ''], ['Tracking', [v.settings.trackLots ? 'lots' : '', v.settings.trackSerials ? 'serial numbers' : '', v.settings.trackExpiry ? 'expiry dates' : ''].filter(Boolean).join(', ') || 'None']]} />
        </Section>
        <Section title="Recent movements" actions={<Link className="btn sm" to={inventoryPage(companyId, `/movements?productId=${p.id}`)}>All movements</Link>}>
          <MovesList companyId={companyId} moves={moves.data?.moves ?? []} compact />
        </Section>
      </div>
      {op ? <OperationDialog companyId={companyId} productId={p.id} productLabel={`${p.number} ${p.name}`} op={op.op} row={op.row} trackLots={v.settings.trackLots} trackSerials={v.settings.trackSerials} trackExpiry={v.settings.trackExpiry} onClose={() => setOp(null)} /> : null}
      {editing ? <StockSettingsDialog companyId={companyId} view={v} onClose={() => setEditing(false)} /> : null}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="card card-pad erp-stat">
      <span className="muted small">{label}</span>
      <strong>{value}</strong>
      {hint ? <span className="muted small">{hint}</span> : null}
    </div>
  );
}

/** One stock operation on a product: the location, lot and serial, the quantity, and what it needs (reason, destination). */
export function OperationDialog({ companyId, productId, productLabel, op, row, trackLots, trackSerials, trackExpiry, onClose }: { companyId: string; productId: string; productLabel: string; op: Op; row?: StockRow; trackLots: boolean; trackSerials: boolean; trackExpiry: boolean; onClose: () => void }) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const locs = useLocations(companyId);
  const suppliers = useQuery({ queryKey: ['erp', companyId, 'supplier-options'], queryFn: () => get<{ suppliers: { id: string; number: string; name: string; status: string }[] }>(erpPath(companyId, '/supplier-options')), enabled: op === 'supplier-return' });
  const [f, setF] = useState({ locationId: row?.locationId ?? '', toLocationId: '', lot: row?.lot ?? '', serial: row?.serial ?? '', expiry: '', quantity: trackSerials ? '1' : '', reason: '', reference: '', supplierId: '', unitCost: '' });
  const [busy, setBusy] = useState(false);
  const all = (locs.data?.locations ?? []).filter((l) => !l.archived);
  const targets = all.filter((l) => l.id !== f.locationId && (op === 'quarantine' ? l.kind === 'quarantine' : op === 'release' ? l.kind !== 'quarantine' : true));
  const needsTo = op === 'transfer' || op === 'quarantine' || op === 'release';
  const needsReason = op === 'quarantine' || op === 'customer-return' || op === 'supplier-return' || op === 'scrap';
  const save = async () => {
    const quantity = Number(f.quantity);
    if (!(quantity > 0)) return toast('Use a quantity above zero', 'error');
    setBusy(true);
    try {
      const key = { productId, locationId: f.locationId, lot: f.lot || undefined, serial: f.serial || undefined, quantity };
      if (op === 'reserve') await post(erpPath(companyId, '/reservations'), { ...key, reference: f.reference });
      else {
        const cost = toCents(f.unitCost);
        if (cost === 'bad') throw new Error('Use a unit cost like 12.50');
        await post(erpPath(companyId, `/stock/${op}`), {
          ...key,
          toLocationId: needsTo ? f.toLocationId : undefined,
          reason: f.reason || undefined,
          reference: f.reference || undefined,
          supplierId: op === 'supplier-return' && f.supplierId ? f.supplierId : undefined,
          expiry: op === 'customer-return' ? f.expiry || null : undefined,
          unitCostCents: op === 'customer-return' ? cost : undefined,
        });
      }
      toast(`${OP_LABELS[op]}: done`);
      await refresh();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`${OP_LABELS[op]}: ${productLabel}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.locationId || (needsTo && !f.toLocationId)} onClick={() => void save()}>{busy ? 'Saving…' : OP_LABELS[op]}</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="op-loc">{op === 'customer-return' ? 'Into' : 'From'}</label><select id="op-loc" className="select" value={f.locationId} onChange={(e) => setF({ ...f, locationId: e.target.value })} disabled={!!row}><option value="">Choose…</option>{all.map((l) => <option key={l.id} value={l.id}>{locLabel(l)}</option>)}</select></div>
        {needsTo ? <div className="field span-2"><label htmlFor="op-to">To</label><select id="op-to" className="select" value={f.toLocationId} onChange={(e) => setF({ ...f, toLocationId: e.target.value })}><option value="">Choose…</option>{targets.map((l) => <option key={l.id} value={l.id}>{locLabel(l)}</option>)}</select>{op === 'quarantine' && !targets.length ? <span className="muted small">No quarantine location yet: add one in Warehouses.</span> : null}</div> : null}
        {trackLots ? <div className="field"><label htmlFor="op-lot">Lot</label><input id="op-lot" className="input" value={f.lot} maxLength={80} onChange={(e) => setF({ ...f, lot: e.target.value })} disabled={!!row} /></div> : null}
        {trackSerials ? <div className="field"><label htmlFor="op-sn">Serial number</label><input id="op-sn" className="input" value={f.serial} maxLength={80} onChange={(e) => setF({ ...f, serial: e.target.value })} disabled={!!row} /></div> : null}
        <div className="field"><label htmlFor="op-q">Quantity</label><input id="op-q" className="input" type="number" min="0" step="any" inputMode="decimal" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} />{row ? <span className="muted small">{qty(row.available)} available here</span> : null}</div>
        {op === 'customer-return' && trackExpiry ? <div className="field"><label htmlFor="op-exp">Expiry</label><input id="op-exp" className="input" type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} /></div> : null}
        {op === 'customer-return' ? <div className="field"><label htmlFor="op-cost">Unit cost</label><input id="op-cost" className="input" inputMode="decimal" value={f.unitCost} onChange={(e) => setF({ ...f, unitCost: e.target.value })} placeholder="The current cost" /></div> : null}
        {op === 'supplier-return' ? <div className="field span-2"><label htmlFor="op-sup">Supplier</label><select id="op-sup" className="select" value={f.supplierId} onChange={(e) => setF({ ...f, supplierId: e.target.value })}><option value="">Not recorded</option>{(suppliers.data?.suppliers ?? []).map((s) => <option key={s.id} value={s.id}>{s.number} {s.name}</option>)}</select></div> : null}
        <div className="field span-2"><label htmlFor="op-ref">{op === 'reserve' ? 'Reserved for' : 'Reference'}</label><input id="op-ref" className="input" value={f.reference} maxLength={200} onChange={(e) => setF({ ...f, reference: e.target.value })} placeholder={op === 'reserve' ? 'Job, order or customer' : 'Job, order or document'} /></div>
        {op !== 'reserve' ? <div className="field span-2"><label htmlFor="op-why">{needsReason ? 'Reason' : 'Note (optional)'}</label><input id="op-why" className="input" value={f.reason} maxLength={500} onChange={(e) => setF({ ...f, reason: e.target.value })} /></div> : null}
      </div>
      {op === 'scrap' ? <p className="muted small">Scrap worth more than the company’s approval threshold needs a warehouse manager.</p> : null}
    </Modal>
  );
}

function StockSettingsDialog({ companyId, view, onClose }: { companyId: string; view: ProductStockView; onClose: () => void }) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const locs = useLocations(companyId);
  const s = view.settings;
  const [f, setF] = useState({ trackLots: s.trackLots, trackSerials: s.trackSerials, trackExpiry: s.trackExpiry, inspectionRequired: s.inspectionRequired, reorderPoint: s.reorderPoint?.toString() ?? '', minQty: s.minQty?.toString() ?? '', maxQty: s.maxQty?.toString() ?? '', defaultLocationId: s.defaultLocationId ?? '' });
  const num = (v: string) => (v.trim() === '' ? null : Number(v));
  const save = async () => {
    try {
      await put(erpPath(companyId, `/products/${view.product.id}/stock-settings`), { ...f, reorderPoint: num(f.reorderPoint), minQty: num(f.minQty), maxQty: num(f.maxQty), defaultLocationId: f.defaultLocationId || null });
      toast('Stock settings saved');
      await refresh();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const check = (k: 'trackLots' | 'trackSerials' | 'trackExpiry' | 'inspectionRequired', label: string) => <label className="row"><input type="checkbox" checked={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} /> {label}</label>;
  return (
    <Modal title={`Stock settings: ${view.product.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={() => void save()}>Save</button></>}>
      <fieldset className="erp-checks">
        <legend className="label">Tracking (changes only while there is no stock)</legend>
        {check('trackLots', 'Lot numbers')}
        {check('trackSerials', 'Serial numbers (one unit each)')}
        {check('trackExpiry', 'Expiry dates')}
        {check('inspectionRequired', 'Inspection required on receipt')}
      </fieldset>
      <div className="form-grid">
        <div className="field"><label htmlFor="ss-rop">Reorder point</label><input id="ss-rop" className="input" type="number" min="0" step="any" value={f.reorderPoint} onChange={(e) => setF({ ...f, reorderPoint: e.target.value })} /></div>
        <div className="field"><label htmlFor="ss-min">Minimum</label><input id="ss-min" className="input" type="number" min="0" step="any" value={f.minQty} onChange={(e) => setF({ ...f, minQty: e.target.value })} /></div>
        <div className="field"><label htmlFor="ss-max">Maximum</label><input id="ss-max" className="input" type="number" min="0" step="any" value={f.maxQty} onChange={(e) => setF({ ...f, maxQty: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="ss-loc">Usual location (receipts go here unless chosen)</label><select id="ss-loc" className="select" value={f.defaultLocationId} onChange={(e) => setF({ ...f, defaultLocationId: e.target.value })}><option value="">None</option>{(locs.data?.locations ?? []).map((l) => <option key={l.id} value={l.id}>{locLabel(l)}</option>)}</select></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ warehouses and locations

function WarehousesPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Warehouses');
  const whs = useWarehouses(companyId);
  const [creating, setCreating] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Each warehouse holds a tree of locations: stores, zones, racks, shelves and bins.</p>
        {me.can['inventory.setup'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New warehouse</button> : null}
      </div>
      {whs.error ? <ErrorBox error={whs.error} retry={() => whs.refetch()} /> : null}
      <div className="card crm-table-card">
        {!whs.data ? <Loading /> : !whs.data.warehouses.length ? <EmptyState icon="map" title="No warehouses yet">{me.can['inventory.setup'] ? 'Add a warehouse, then its locations.' : 'A warehouse manager sets up warehouses and locations.'}</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Code</th><th>Name</th><th className="num">Locations</th><th className="num">Units on hand</th></tr></thead>
              <tbody>
                {whs.data.warehouses.map((w) => (
                  <tr key={w.id}>
                    <td data-label="Code"><Link className="mt-primary mt-num" to={inventoryPage(companyId, `/warehouses/${w.id}`)}>{w.code}</Link></td>
                    <td data-label="Name">{w.name}{w.address ? <div className="muted small">{w.address}</div> : null}</td>
                    <td data-label="Locations" className="num">{w.locations}</td>
                    <td data-label="Units on hand" className="num">{qty(w.onHand)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {creating ? <WarehouseDialog companyId={companyId} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}

function WarehouseDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const navigate = useNavigate();
  const [f, setF] = useState({ code: '', name: '', address: '' });
  const save = async () => {
    try {
      const w = await post<{ id: string }>(erpPath(companyId, '/warehouses'), f);
      await refresh();
      navigate(inventoryPage(companyId, `/warehouses/${w.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Modal title="New warehouse" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.code || !f.name} onClick={() => void save()}>Create</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="wh-code">Code</label><input id="wh-code" className="input" value={f.code} maxLength={40} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="MAIN" /></div>
        <div className="field"><label htmlFor="wh-name">Name</label><input id="wh-name" className="input" value={f.name} maxLength={120} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="field span-2"><label htmlFor="wh-addr">Address</label><textarea id="wh-addr" className="textarea" rows={2} maxLength={500} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
      </div>
    </Modal>
  );
}

function WarehouseDetail({ companyId, me }: { companyId: string; me: ErpMe }) {
  const { id = '' } = useParams();
  const whs = useWarehouses(companyId);
  const locs = useLocations(companyId, id);
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const [adding, setAdding] = useState<{ parent: Location | null } | null>(null);
  const w = whs.data?.warehouses.find((x) => x.id === id);
  usePageTitle(w ? `${w.code} warehouse` : 'Warehouse');
  const tree = useMemo(() => {
    const list = locs.data?.locations ?? [];
    const kids = new Map<string | null, Location[]>();
    for (const l of list) {
      const k = l.parentId && list.some((x) => x.id === l.parentId) ? l.parentId : null;
      if (!kids.has(k)) kids.set(k, []);
      kids.get(k)!.push(l);
    }
    const out: { l: Location; depth: number }[] = [];
    const walk = (parent: string | null, depth: number) => {
      for (const l of kids.get(parent) ?? []) {
        out.push({ l, depth });
        if (depth < 8) walk(l.id, depth + 1);
      }
    };
    walk(null, 0);
    return out;
  }, [locs.data]);
  if (whs.error) return <ErrorBox error={whs.error} retry={() => whs.refetch()} />;
  if (!whs.data || !locs.data) return <Loading />;
  if (!w) return <p className="muted">Warehouse not found.</p>;
  const setup = me.can['inventory.setup'];
  const change = async (l: Location, body: Record<string, unknown>) => {
    try {
      await patch(erpPath(companyId, `/locations/${l.id}`), body);
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={inventoryPage(companyId, '/warehouses')}>Warehouses</Link><span className="sep">/</span><span>{w.code}</span></div>
      <div className="mt-head">
        <div><h2 className="mt-title"><span className="mt-num">{w.code}</span> {w.name}</h2>{w.address ? <p className="muted small">{w.address}</p> : null}</div>
        <div className="mt-head-actions">
          <Link className="btn" to={inventoryPage(companyId, `/labels?warehouseId=${w.id}`)}><Icon name="grid" /> Print QR labels</Link>
          <Link className="btn" to={inventoryPage(companyId, `?warehouseId=${w.id}&view=detail`)}>Its stock</Link>
          {setup ? <button className="btn primary" onClick={() => setAdding({ parent: null })}><Icon name="plus" /> Add a location</button> : null}
        </div>
      </div>
      <Section title="Locations">
        {!tree.length ? <p className="muted small">No locations yet.{setup ? ' Start with a store, then zones, racks, shelves and bins.' : ''}</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Location</th><th>Level</th><th>Kind</th><th className="num">Units</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {tree.map(({ l, depth }) => (
                  <tr key={l.id}>
                    <td data-label="Location"><div className={`erp-indent erp-d${Math.min(depth, 6)}`}><span className="mt-num">{l.code}</span> {l.name}</div></td>
                    <td data-label="Level">{l.levelLabel}</td>
                    <td data-label="Kind">{setup ? <select className="select sm" aria-label={`Kind of ${l.code}`} value={l.kind} onChange={(e) => void change(l, { kind: e.target.value })}>{options(LOCATION_KINDS)}</select> : l.kindLabel}</td>
                    <td data-label="Units" className="num">{l.onHand ? qty(l.onHand) : ''}</td>
                    <td className="erp-actions">
                      <a className="btn ghost sm" href={apiHref(companyId, `/locations/${l.id}/qr.svg`)} target="_blank" rel="noopener">QR</a>
                      {setup && l.level !== 'bin' ? <button className="btn ghost sm" onClick={() => setAdding({ parent: l })}><Icon name="plus" size={14} /> Inside</button> : null}
                      {setup ? <button className="btn ghost icon sm" aria-label={`Archive ${l.code}`} onClick={() => void change(l, { archived: true })}><Icon name="archive" size={14} /></button> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      {adding ? <LocationDialog companyId={companyId} warehouseId={w.id} parent={adding.parent} onClose={() => setAdding(null)} /> : null}
    </div>
  );
}

function LocationDialog({ companyId, warehouseId, parent, onClose }: { companyId: string; warehouseId: string; parent: Location | null; onClose: () => void }) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const levels = Object.keys(LOCATION_LEVELS) as (keyof typeof LOCATION_LEVELS)[];
  const next = parent ? levels[Math.min(levels.indexOf(parent.level) + 1, levels.length - 1)] : 'store';
  const [f, setF] = useState({ code: '', name: '', level: next as string, kind: parent?.kind === 'quarantine' ? 'quarantine' : 'normal' });
  const save = async () => {
    try {
      await post(erpPath(companyId, '/locations'), { warehouseId, parentId: parent?.id ?? null, ...f });
      toast(`Location ${f.code} added`);
      await refresh();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Modal title={parent ? `New location inside ${parent.code}` : 'New location'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.code} onClick={() => void save()}>Add</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="loc-code">Code</label><input id="loc-code" className="input" value={f.code} maxLength={40} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="A1-01" /></div>
        <div className="field"><label htmlFor="loc-name">Name</label><input id="loc-name" className="input" value={f.name} maxLength={120} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="field"><label htmlFor="loc-level">Level</label><select id="loc-level" className="select" value={f.level} onChange={(e) => setF({ ...f, level: e.target.value })}>{options(LOCATION_LEVELS)}</select></div>
        <div className="field"><label htmlFor="loc-kind">Kind</label><select id="loc-kind" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{options(LOCATION_KINDS)}</select></div>
      </div>
    </Modal>
  );
}

/** A page of QR labels to print: each location of a warehouse, or chosen products. */
function LabelsPage({ companyId }: { companyId: string }) {
  const [params] = useSearchParams();
  const wh = params.get('warehouseId') ?? '';
  const productIds = params.get('productIds') ?? '';
  const q = useQuery({ queryKey: ['erp', companyId, 'labels', wh, productIds], queryFn: () => get<{ labels: { kind: string; id: string; title: string; subtitle: string; code: string; svg: string }[] }>(erpPath(companyId, `/labels?${wh ? `warehouseId=${wh}` : `productIds=${productIds}`}`)) });
  usePageTitle('QR labels');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  return (
    <div className="stack">
      <div className="row wrap no-print">
        <p className="muted small grow">QR codes made by BIZOMAT itself (no outside service). Scan them with the warehouse screen, or type the code under each.</p>
        <button className="btn primary" onClick={() => window.print()}><Icon name="file" /> Print</button>
      </div>
      <div className="erp-labels">
        {q.data.labels.map((l) => (
          <figure key={l.id} className="erp-label">
            <img src={apiHref(companyId, l.svg.replace(`/api/erp/c/${companyId}`, ''))} alt={`QR code for ${l.title}`} width={120} height={120} />
            <figcaption><strong className="mt-num">{l.title}</strong>{l.subtitle ? <div className="small">{l.subtitle}</div> : null}<div className="muted small">{l.code}</div></figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ movements

function MovesList({ companyId, moves, compact }: { companyId: string; moves: Move[]; compact?: boolean }) {
  if (!moves.length) return <p className="muted small">No movements.</p>;
  const source = (m: Move) => {
    if (m.sourceType === 'receipt' && m.sourceId) return <Link to={procurementPage(companyId, `/receipts/${m.sourceId}`)}>{m.reference || 'Receipt'}</Link>;
    if (m.sourceType === 'count' && m.sourceId) return <Link to={inventoryPage(companyId, `/counts/${m.sourceId}`)}>{m.reference || 'Count'}</Link>;
    return m.reference;
  };
  return (
    <div className="crm-table-scroll">
      <table className="data-table responsive">
        <thead><tr><th>When</th><th>Movement</th>{compact ? null : <th>Product</th>}<th>Location</th><th className="num">Quantity</th><th className="num">Value</th><th>Document</th></tr></thead>
        <tbody>
          {moves.map((m) => (
            <tr key={m.id}>
              <td data-label="When">{dayText(m.at)}<div className="muted small">{m.byName}</div></td>
              <td data-label="Movement">{m.typeLabel}{m.reason ? <div className="muted small">{m.reason}</div> : null}</td>
              {compact ? null : <td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${m.productId}`)}><span className="mt-num">{m.productNumber}</span> {m.productName}</Link></td>}
              <td data-label="Location">{m.warehouseCode}/{m.locationCode}{m.lot ? <div className="muted small">Lot {m.lot}</div> : null}{m.serial ? <div className="muted small">Serial {m.serial}</div> : null}</td>
              <td data-label="Quantity" className="num">{m.quantity ? `${m.quantity > 0 ? '+' : ''}${qty(m.quantity)}` : m.reserved ? `${m.reserved > 0 ? 'reserve ' : 'release '}${qty(Math.abs(m.reserved))}` : ''}</td>
              <td data-label="Value" className="num">{m.valueCents ? money(m.valueCents) : ''}</td>
              <td data-label="Document">{source(m)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MovementsPage({ companyId }: { companyId: string }) {
  usePageTitle('Stock movements');
  const { g, set, offset } = useListParams();
  const whs = useWarehouses(companyId);
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'type', 'warehouseId', 'productId', 'from', 'to', 'source', 'sourceId']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'moves', filters.toString(), offset], queryFn: () => get<{ moves: Move[]; total: number; types: { value: string; label: string }[] }>(erpPath(companyId, `/movements?${filters}&limit=${limit}&offset=${offset}`)) });
  return (
    <div className="stack">
      <div className="row wrap"><p className="muted small grow">The movement ledger: every change to stock, with its document. Nothing in it is ever changed or deleted.</p><CsvLink companyId={companyId} path={`/movements?${filters}`} /></div>
      <FilterPanel active={['q', 'type', 'warehouseId', 'from', 'to'].filter((k) => g(k)).length}>
        <div className="field"><label htmlFor="mv-q">Search</label><input id="mv-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Product, reference, lot, serial" /></div>
        <div className="field"><label htmlFor="mv-type">Movement</label><select id="mv-type" className="select" value={g('type')} onChange={(e) => set('type', e.target.value)}><option value="">Any</option>{(list.data?.types ?? []).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
        <div className="field"><label htmlFor="mv-wh">Warehouse</label><select id="mv-wh" className="select" value={g('warehouseId')} onChange={(e) => set('warehouseId', e.target.value)}><option value="">All</option>{(whs.data?.warehouses ?? []).map((w) => <option key={w.id} value={w.id}>{w.code}</option>)}</select></div>
        <div className="field"><label htmlFor="mv-from">From</label><input id="mv-from" className="input" type="date" value={g('from')} onChange={(e) => set('from', e.target.value)} /></div>
        <div className="field"><label htmlFor="mv-to">To</label><input id="mv-to" className="input" type="date" value={g('to')} onChange={(e) => set('to', e.target.value)} /></div>
      </FilterPanel>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">{!list.data ? <Loading /> : <MovesList companyId={companyId} moves={list.data.moves} />}</div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ adjustments

interface Adjustment {
  id: string;
  number: string;
  productId: string;
  productNumber: string;
  productName: string;
  uom: string;
  locationCode: string;
  warehouseCode: string;
  lot: string;
  serial: string;
  quantity: number;
  valueCents: number;
  reason: string;
  status: string;
  requestedByName: string | null;
  decidedByName: string | null;
  decidedAt: number | null;
  decisionNote: string;
  sodException: boolean;
  createdAt: number;
  canDecide?: boolean;
}

function AdjustmentsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Adjustments');
  const [status, setStatus] = useState('');
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const list = useQuery({ queryKey: ['erp', companyId, 'adjustments', status], queryFn: () => get<{ adjustments: Adjustment[] }>(erpPath(companyId, `/adjustments${status ? `?status=${status}` : ''}`)) });
  const [creating, setCreating] = useState(false);
  const [deciding, setDeciding] = useState<{ a: Adjustment; approve: boolean } | null>(null);
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Corrections to stock, each with a reason. Above the company’s approval threshold a warehouse manager who did not ask for it approves.</p>
        <select className="select" aria-label="Show" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Every adjustment</option><option value="pending">Waiting for approval</option><option value="posted">Posted</option><option value="rejected">Rejected</option></select>
        {me.can['inventory.operate'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New adjustment</button> : null}
      </div>
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.adjustments.length ? <EmptyState icon="edit" title="No adjustments">Adjustments correct stock that does not match what is there.</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Product</th><th>Location</th><th className="num">Quantity</th><th className="num">Value</th><th>Reason</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {list.data.adjustments.map((a) => (
                  <tr key={a.id}>
                    <td data-label="Number" className="mt-num">{a.number}</td>
                    <td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${a.productId}`)}><span className="mt-num">{a.productNumber}</span> {a.productName}</Link></td>
                    <td data-label="Location">{a.warehouseCode}/{a.locationCode}{a.lot ? <div className="muted small">Lot {a.lot}</div> : null}</td>
                    <td data-label="Quantity" className="num">{a.quantity > 0 ? '+' : ''}{qty(a.quantity)} {a.uom}</td>
                    <td data-label="Value" className="num">{money(a.valueCents)}</td>
                    <td data-label="Reason" className="small">{a.reason}<div className="muted">{a.requestedByName} {dayText(a.createdAt)}</div></td>
                    <td data-label="Status"><AdjBadge value={a.status} />{a.decidedByName ? <div className="muted small">{a.decidedByName}{a.decisionNote ? `: ${a.decisionNote}` : ''}</div> : null}{a.sodException ? <div className="badge warning">Recorded exception</div> : null}</td>
                    <td className="erp-actions">{a.canDecide ? <><button className="btn sm primary" onClick={() => setDeciding({ a, approve: true })}>Approve</button><button className="btn ghost sm" onClick={() => setDeciding({ a, approve: false })}>Reject</button></> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {creating ? <AdjustmentDialog companyId={companyId} onClose={() => setCreating(false)} /> : null}
      {deciding ? (
        <NoteDialog
          title={`${deciding.approve ? 'Approve' : 'Reject'} ${deciding.a.number}`}
          label={deciding.approve ? 'Note (optional)' : 'Why'}
          confirm={deciding.approve ? 'Approve and post' : 'Reject'}
          required={!deciding.approve}
          danger={!deciding.approve}
          onClose={() => setDeciding(null)}
          onSave={async (note) => {
            try {
              await post(erpPath(companyId, `/adjustments/${deciding.a.id}/${deciding.approve ? 'approve' : 'reject'}`), { note });
              toast(deciding.approve ? 'Approved and posted' : 'Rejected');
              setDeciding(null);
              await refresh();
            } catch (err) {
              toast(errorMessage(err), 'error');
            }
          }}
        />
      ) : null}
    </div>
  );
}

function AdjustmentDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const locs = useLocations(companyId);
  const products = useQuery({ queryKey: ['erp', companyId, 'product-options'], queryFn: () => get<{ products: { id: string; number: string; name: string; type: string; uom: string }[] }>(erpPath(companyId, '/products?limit=500')) });
  const [f, setF] = useState({ productId: '', locationId: '', lot: '', serial: '', expiry: '', direction: 'out', quantity: '', unitCost: '', reason: '' });
  const save = async () => {
    const q = Number(f.quantity);
    if (!(q > 0)) return toast('Use a quantity above zero', 'error');
    const cost = toCents(f.unitCost);
    if (cost === 'bad') return toast('Use a unit cost like 12.50', 'error');
    try {
      const r = await post<{ number: string; status: string }>(erpPath(companyId, '/adjustments'), { productId: f.productId, locationId: f.locationId, lot: f.lot || undefined, serial: f.serial || undefined, expiry: f.expiry || null, quantity: f.direction === 'in' ? q : -q, unitCostCents: f.direction === 'in' ? cost : undefined, reason: f.reason });
      toast(r.status === 'pending' ? `${r.number} waits for a warehouse manager` : `${r.number} posted`);
      await refresh();
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Modal title="New stock adjustment" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.productId || !f.locationId || !f.reason.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="form-grid">
        <div className="field span-2"><label htmlFor="adj-p">Product</label><select id="adj-p" className="select" value={f.productId} onChange={(e) => setF({ ...f, productId: e.target.value })}><option value="">Choose…</option>{(products.data?.products ?? []).filter((p) => p.type !== 'service').map((p) => <option key={p.id} value={p.id}>{p.number} {p.name}</option>)}</select></div>
        <div className="field span-2"><label htmlFor="adj-l">Location</label><select id="adj-l" className="select" value={f.locationId} onChange={(e) => setF({ ...f, locationId: e.target.value })}><option value="">Choose…</option>{(locs.data?.locations ?? []).map((l) => <option key={l.id} value={l.id}>{locLabel(l)}</option>)}</select></div>
        <div className="field"><label htmlFor="adj-dir">Change</label><select id="adj-dir" className="select" value={f.direction} onChange={(e) => setF({ ...f, direction: e.target.value })}><option value="out">Less stock (take off)</option><option value="in">More stock (add)</option></select></div>
        <div className="field"><label htmlFor="adj-q">Quantity</label><input id="adj-q" className="input" type="number" min="0" step="any" value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} /></div>
        <div className="field"><label htmlFor="adj-lot">Lot (if tracked)</label><input id="adj-lot" className="input" value={f.lot} maxLength={80} onChange={(e) => setF({ ...f, lot: e.target.value })} /></div>
        <div className="field"><label htmlFor="adj-sn">Serial (if tracked)</label><input id="adj-sn" className="input" value={f.serial} maxLength={80} onChange={(e) => setF({ ...f, serial: e.target.value })} /></div>
        {f.direction === 'in' ? <div className="field"><label htmlFor="adj-cost">Unit cost</label><input id="adj-cost" className="input" inputMode="decimal" value={f.unitCost} onChange={(e) => setF({ ...f, unitCost: e.target.value })} placeholder="The current cost" /></div> : null}
        {f.direction === 'in' ? <div className="field"><label htmlFor="adj-exp">Expiry (if tracked)</label><input id="adj-exp" className="input" type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} /></div> : null}
        <div className="field span-2"><label htmlFor="adj-why">Reason</label><input id="adj-why" className="input" value={f.reason} maxLength={500} onChange={(e) => setF({ ...f, reason: e.target.value })} placeholder="Damaged, found, miscounted…" /></div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ counts

interface CountRow {
  id: string;
  number: string;
  kind: string;
  kindLabel: string;
  warehouseId: string;
  warehouseCode: string;
  locationCode: string | null;
  status: string;
  notes: string;
  lines: number;
  counted: number;
  variances: number;
  createdByName: string | null;
  submittedByName: string | null;
  approvedByName: string | null;
  approvedAt: number | null;
  sodException: boolean;
  groupId: string | null;
  createdAt: number;
}

function CountsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Counts');
  const list = useQuery({ queryKey: ['erp', companyId, 'counts'], queryFn: () => get<{ counts: CountRow[] }>(erpPath(companyId, '/counts')) });
  const [creating, setCreating] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Stocktakes count a whole warehouse; cycle counts one location at a time. A warehouse manager who did not count approves the variances, which then post as movements.</p>
        {me.can['inventory.operate'] ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New count</button> : null}
      </div>
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.counts.length ? <EmptyState icon="checkSquare" title="No counts yet">Open a count to check what is on the shelves against the records.</EmptyState> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Kind</th><th>Where</th><th>Status</th><th className="num">Counted</th><th className="num">Variances</th></tr></thead>
              <tbody>
                {list.data.counts.map((n) => (
                  <tr key={n.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={inventoryPage(companyId, `/counts/${n.id}`)}>{n.number}</Link></td>
                    <td data-label="Kind">{n.kindLabel}</td>
                    <td data-label="Where">{n.warehouseCode}{n.locationCode ? `/${n.locationCode}` : ''}</td>
                    <td data-label="Status"><CountBadge value={n.status} /></td>
                    <td data-label="Counted" className="num">{n.counted} of {n.lines}</td>
                    <td data-label="Variances" className="num">{n.variances}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {creating ? <CountDialog companyId={companyId} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}

function CountDialog({ companyId, onClose }: { companyId: string; onClose: () => void }) {
  const toast = useToast();
  const navigate = useNavigate();
  const refresh = useRefresh(companyId);
  const whs = useWarehouses(companyId);
  const [f, setF] = useState({ kind: 'stocktake', warehouseId: '', locationId: '', notes: '' });
  const locs = useLocations(companyId, f.warehouseId);
  const save = async () => {
    try {
      const r = await post<{ id: string; number: string }>(erpPath(companyId, '/counts'), { kind: f.kind, warehouseId: f.warehouseId, locationId: f.locationId || null, notes: f.notes });
      toast(`${r.number} opened`);
      await refresh();
      navigate(inventoryPage(companyId, `/counts/${r.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <Modal title="New count" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.warehouseId} onClick={() => void save()}>Open the count</button></>}>
      <div className="form-grid">
        <div className="field"><label htmlFor="cn-kind">Kind</label><select id="cn-kind" className="select" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}><option value="stocktake">Stocktake</option><option value="cycle">Cycle count</option></select></div>
        <div className="field"><label htmlFor="cn-wh">Warehouse</label><select id="cn-wh" className="select" value={f.warehouseId} onChange={(e) => setF({ ...f, warehouseId: e.target.value, locationId: '' })}><option value="">Choose…</option>{(whs.data?.warehouses ?? []).map((w) => <option key={w.id} value={w.id}>{w.code} {w.name}</option>)}</select></div>
        {f.warehouseId ? <div className="field span-2"><label htmlFor="cn-loc">Only this location (and what is inside it)</label><select id="cn-loc" className="select" value={f.locationId} onChange={(e) => setF({ ...f, locationId: e.target.value })}><option value="">The whole warehouse</option>{(locs.data?.locations ?? []).map((l) => <option key={l.id} value={l.id}>{locLabel(l)}</option>)}</select></div> : null}
        <div className="field span-2"><label htmlFor="cn-notes">Notes</label><input id="cn-notes" className="input" value={f.notes} maxLength={1000} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
      </div>
      <p className="muted small">The count lists every stock record there with its quantity now. Variances are worked out against those quantities, so count when nothing is moving.</p>
    </Modal>
  );
}

interface CountView {
  count: CountRow;
  lines: { id: string; productId: string; productNumber: string; productName: string; uom: string; locationId: string; locationCode: string; lot: string; serial: string; expected: number; counted: number | null; variance: number | null; countedByName: string | null; movedSince: boolean }[];
  history: ErpEvent[];
  can: { count: boolean; submit: boolean; approve: boolean; cancel: boolean; segregation: string | null };
}

function CountDetail({ companyId }: { companyId: string }) {
  const { id = '' } = useParams();
  const toast = useToast();
  const refresh = useRefresh(companyId);
  const q = useQuery({ queryKey: ['erp', companyId, 'count', id], queryFn: () => get<CountView>(erpPath(companyId, `/counts/${id}`)), retry: false });
  const [entered, setEntered] = useState<Record<string, string>>({});
  const [ask, setAsk] = useState('');
  usePageTitle(q.data ? q.data.count.number : 'Count');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const v = q.data;
  const n = v.count;
  const act = async (fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      setEntered({});
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  const saveCounts = () => {
    const lines = Object.entries(entered).map(([lid, val]) => ({ id: lid, counted: val.trim() === '' ? null : Number(val) }));
    if (!lines.length) return toast('Nothing changed', 'error');
    void act(() => put(erpPath(companyId, `/counts/${n.id}/counted`), { lines }), 'Counts saved');
  };
  const moved = v.lines.some((l) => l.movedSince);
  return (
    <div className="stack">
      <div className="mt-path"><Link to={inventoryPage(companyId, '/counts')}>Counts</Link><span className="sep">/</span><span>{n.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{n.number}</span> {n.kindLabel} of {n.warehouseCode}{n.locationCode ? `/${n.locationCode}` : ''}</h2>
          <div className="mt-badges"><CountBadge value={n.status} /><span className="badge">{n.counted} of {n.lines} counted</span>{n.variances ? <span className="badge warning">{n.variances} variance{n.variances === 1 ? '' : 's'}</span> : null}{n.sodException ? <span className="badge warning">Recorded exception (one-person company)</span> : null}</div>
        </div>
        <div className="mt-head-actions">
          <CsvLink companyId={companyId} path={`/counts/${n.id}`} label="Count sheet (CSV)" />
          {v.can.count ? <button className="btn" onClick={saveCounts} disabled={!Object.keys(entered).length}>Save counts</button> : null}
          {v.can.submit ? <button className="btn primary" onClick={() => void act(() => post(erpPath(companyId, `/counts/${n.id}/submit`), {}), 'Submitted for approval')}>Submit</button> : null}
          {v.can.approve ? <button className="btn primary" onClick={() => setAsk('approve')}><Icon name="check" /> Approve and post</button> : null}
          {v.can.cancel ? <button className="btn ghost" onClick={() => setAsk('cancel')}>Cancel</button> : null}
        </div>
      </div>
      {v.can.segregation ? <p className="warn-box small"><Icon name="info" size={14} /> {v.can.segregation}</p> : null}
      {moved ? <p className="warn-box small"><Icon name="alert" size={14} /> Stock moved at some of these places since the count was opened (marked). Variances are against the quantities when it was opened.</p> : null}
      {n.groupId ? <p className="small"><Link to={inventoryPage(companyId, `/movements?source=count&sourceId=${n.id}`)}>The movements it posted</Link></p> : null}
      <Section title="Count sheet">
        {!v.lines.length ? <p className="muted small">Nothing in stock there when it was opened.</p> : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Location</th><th>Product</th><th>Lot or serial</th><th className="num">Expected</th><th className="num">Counted</th><th className="num">Variance</th></tr></thead>
              <tbody>
                {v.lines.map((l) => {
                  const val = entered[l.id] ?? (l.counted === null ? '' : String(l.counted));
                  const variance = val.trim() === '' ? null : Number(val) - l.expected;
                  return (
                    <tr key={l.id}>
                      <td data-label="Location" className="mt-num">{l.locationCode}{l.movedSince ? <> <span className="badge warning">Moved</span></> : null}</td>
                      <td data-label="Product"><span className="mt-num">{l.productNumber}</span> {l.productName}</td>
                      <td data-label="Lot or serial">{[l.lot, l.serial].filter(Boolean).join(' / ')}</td>
                      <td data-label="Expected" className="num">{qty(l.expected)} <span className="muted small">{l.uom}</span></td>
                      <td data-label="Counted" className="num">{v.can.count ? <input className="input erp-qty-input" type="number" min="0" step="any" inputMode="decimal" aria-label={`Counted ${l.productNumber} at ${l.locationCode}`} value={val} onChange={(e) => setEntered({ ...entered, [l.id]: e.target.value })} /> : l.counted === null ? '' : qty(l.counted)}</td>
                      <td data-label="Variance" className="num">{variance === null || Number.isNaN(variance) ? '' : variance === 0 ? <span className="muted">0</span> : <strong className={variance < 0 ? 'erp-neg' : undefined}>{variance > 0 ? '+' : ''}{qty(variance)}</strong>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      <Section title="History"><History events={v.history} /></Section>
      {ask === 'approve' ? <NoteDialog title={`Approve ${n.number}`} label="Note (optional): the variances post as stock movements" confirm="Approve and post" onClose={() => setAsk('')} onSave={async () => { await act(() => post(erpPath(companyId, `/counts/${n.id}/approve`), {}), 'Approved: variances posted'); setAsk(''); }} /> : null}
      {ask === 'cancel' ? <NoteDialog title={`Cancel ${n.number}`} label="Note (optional)" confirm="Cancel the count" danger onClose={() => setAsk('')} onSave={async () => { await act(() => post(erpPath(companyId, `/counts/${n.id}/cancel`), {}), 'Cancelled'); setAsk(''); }} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ valuation and traceability

function ValuationPage({ companyId }: { companyId: string }) {
  usePageTitle('Stock valuation');
  const [wh, setWh] = useState('');
  const whs = useWarehouses(companyId);
  const q = useQuery({ queryKey: ['erp', companyId, 'valuation', wh], queryFn: () => get<{ method: string; methodLabel: string; locked: boolean; currency: string; rows: { productId: string; number: string; name: string; uom: string; quantity: number; unitCostCents: number | null; valueCents: number; standardCostCents: number | null }[]; totalCents: number; note: string | null; financePosting: string }>(erpPath(companyId, `/valuation${wh ? `?warehouseId=${wh}` : ''}`)) });
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  return (
    <div className="stack">
      <div className="row wrap">
        <div className="field"><label htmlFor="val-wh">Warehouse</label><select id="val-wh" className="select" value={wh} onChange={(e) => setWh(e.target.value)}><option value="">All</option>{(whs.data?.warehouses ?? []).map((w) => <option key={w.id} value={w.id}>{w.code}</option>)}</select></div>
        <div className="grow" />
        <CsvLink companyId={companyId} path={`/valuation${wh ? `?warehouseId=${wh}` : ''}`} />
      </div>
      {!q.data ? <Loading /> : (
        <>
          <div className="erp-stats">
            <Stat label="Stock value" value={money(q.data.totalCents, q.data.currency)} />
            <Stat label="Costing method" value={q.data.methodLabel} hint={q.data.locked ? 'Locked by the first stock movement' : 'Not locked yet'} />
          </div>
          {q.data.note ? <p className="muted small">{q.data.note}</p> : null}
          <p className="muted small">{q.data.financePosting}</p>
          <div className="card crm-table-card">
            {!q.data.rows.length ? <EmptyState icon="dollar" title="Nothing in stock">Stock value appears once goods are received.</EmptyState> : (
              <div className="crm-table-scroll">
                <table className="data-table responsive">
                  <thead><tr><th>Product</th><th className="num">Quantity</th><th className="num">Unit cost</th><th className="num">Value</th><th className="num">Standard cost</th></tr></thead>
                  <tbody>
                    {q.data.rows.map((r) => (
                      <tr key={r.productId}>
                        <td data-label="Product"><Link to={inventoryPage(companyId, `/stock/${r.productId}`)}><span className="mt-num">{r.number}</span> {r.name}</Link></td>
                        <td data-label="Quantity" className="num">{qty(r.quantity)} <span className="muted small">{r.uom}</span></td>
                        <td data-label="Unit cost" className="num">{r.unitCostCents === null ? '' : money(Math.round(r.unitCostCents), q.data!.currency)}</td>
                        <td data-label="Value" className="num">{money(r.valueCents, q.data!.currency)}</td>
                        <td data-label="Standard cost" className="num">{money(r.standardCostCents, q.data!.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface TraceDelivery {
  id: string;
  number: string;
  status: string;
  salesOrderId: string;
  salesOrderNumber: string;
  customerName: string;
  carrierName: string | null;
  trackingNumber: string;
  dispatchedAt: number | null;
  deliveredAt: number | null;
  receivedBy: string;
}

const TraceShipment = ({ companyId, s }: { companyId: string; s: TraceDelivery }) => (
  <>
    Shipped on <Link className="mt-num" to={supplyPage(companyId, `/shipments/${s.id}`)}>{s.number}</Link> to {s.customerName} (<Link to={supplyPage(companyId, `/orders/${s.salesOrderId}`)}>{s.salesOrderNumber}</Link>){s.carrierName ? ` with ${s.carrierName}` : ''}{s.trackingNumber ? `, tracking ${s.trackingNumber}` : ''}{s.dispatchedAt ? `, dispatched ${dayText(s.dispatchedAt)}` : ''}{s.deliveredAt ? `, delivered ${dayText(s.deliveredAt)} to ${s.receivedBy}` : ''}
  </>
);

function TracePage({ companyId }: { companyId: string }) {
  const [params, setParams] = useSearchParams();
  const productId = params.get('productId') ?? '';
  const lot = params.get('lot') ?? '';
  const serial = params.get('serial') ?? '';
  const [f, setF] = useState({ lot, serial });
  usePageTitle('Traceability');
  const q = useQuery({ queryKey: ['erp', companyId, 'trace', productId, lot, serial], queryFn: () => get<{ origins: { receiptId: string; receiptNumber: string; receivedDate: string; deliveryRef: string; poId: string; poNumber: string; supplierId: string; supplierNumber: string; supplierName: string }[]; moves: Move[]; current: StockRow[]; quality?: { inspections: { id: string; number: string; kind: string; status: string; result: string | null; productNumber: string | null; quantity: number | null; at: number }[]; ncrs: { id: string; number: string; title: string; status: string; severity: string; productNumber: string | null; at: number }[] }; deliveries?: TraceDelivery[]; downstream?: { moId: string; moNumber: string; moStatus: string; productNumber: string; productName: string; finishedLots: string[]; shipments: TraceDelivery[] }[] }>(erpPath(companyId, `/trace?${new URLSearchParams({ ...(productId ? { productId } : {}), ...(lot ? { lot } : {}), ...(serial ? { serial } : {}) })}`)), enabled: !!(lot || serial) });
  return (
    <div className="stack">
      <form className="row wrap" onSubmit={(e) => { e.preventDefault(); const n = new URLSearchParams(); if (productId) n.set('productId', productId); if (f.lot) n.set('lot', f.lot); if (f.serial) n.set('serial', f.serial); setParams(n); }}>
        <div className="field"><label htmlFor="tr-lot">Lot</label><input id="tr-lot" className="input" value={f.lot} onChange={(e) => setF({ ...f, lot: e.target.value })} /></div>
        <div className="field"><label htmlFor="tr-sn">Serial number</label><input id="tr-sn" className="input" value={f.serial} onChange={(e) => setF({ ...f, serial: e.target.value })} /></div>
        <button className="btn primary" type="submit">Trace</button>
      </form>
      {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {!lot && !serial ? <p className="muted">Give a lot or a serial number to see where it came from and everywhere it went.</p> : !q.data ? <Loading /> : (
        <>
          <Section title="Where it came from">
            {!q.data.origins.length ? <p className="muted small">Not received on a purchase order (an adjustment or a return brought it in).</p> : (
              <ul className="erp-list">
                {q.data.origins.map((o) => <li key={o.receiptId}><Link to={procurementPage(companyId, `/suppliers/${o.supplierId}`)}>{o.supplierNumber} {o.supplierName}</Link>, order <Link className="mt-num" to={procurementPage(companyId, `/purchase-orders/${o.poId}`)}>{o.poNumber}</Link>, receipt <Link className="mt-num" to={procurementPage(companyId, `/receipts/${o.receiptId}`)}>{o.receiptNumber}</Link> on {dateText(o.receivedDate)}{o.deliveryRef ? ` (${o.deliveryRef})` : ''}</li>)}
              </ul>
            )}
          </Section>
          <Section title="Where it is now">
            {!q.data.current.length ? <p className="muted small">None in stock.</p> : <ul className="erp-list">{q.data.current.map((r) => <li key={r.id}>{qty(r.onHand)} of <span className="mt-num">{r.productNumber}</span> at {r.warehouseCode}/{r.locationCode}{r.expiry ? `, expires ${dateText(r.expiry)}` : ''}</li>)}</ul>}
          </Section>
          {/* Release 4: the lot's or serial's inspections and nonconformances */}
          <Section title="Inspections and nonconformances">
            {!q.data.quality?.inspections.length && !q.data.quality?.ncrs.length ? <p className="muted small">No inspection or nonconformance names it.</p> : (
              <ul className="erp-list">
                {q.data.quality?.inspections.map((i) => <li key={i.id} className="small"><Link className="mt-num" to={qualityPage(companyId, `/inspections/${i.id}`)}>{i.number}</Link> inspection{i.productNumber ? ` of ${i.productNumber}` : ''}: <span className={`badge ${i.result === 'failed' ? 'danger' : i.result ? 'success' : ''}`}>{i.result === 'conditional' ? 'accepted on condition' : (i.result ?? i.status)}</span> <span className="muted">{dayText(i.at)}</span></li>)}
                {q.data.quality?.ncrs.map((n) => <li key={n.id} className="small"><Link className="mt-num" to={qualityPage(companyId, `/ncrs/${n.id}`)}>{n.number}</Link> {n.title} <span className="badge">{n.status}</span> <span className="muted">{dayText(n.at)}</span></li>)}
              </ul>
            )}
          </Section>
          {/* Release 5: where it went: the deliveries that took it, and what was made of it and delivered */}
          <Section title="Where it went">
            {!q.data.deliveries?.length && !q.data.downstream?.length ? <p className="muted small">Not shipped to a customer, and not used in a manufacturing order.</p> : (
              <ul className="erp-list">
                {q.data.deliveries?.map((s) => <li key={s.id} className="small"><TraceShipment companyId={companyId} s={s} /></li>)}
                {q.data.downstream?.map((d) => (
                  <li key={d.moId} className="small">
                    Used in <Link className="mt-num" to={manufacturingPage(companyId, `/orders/${d.moId}`)}>{d.moNumber}</Link> to make {d.productNumber} {d.productName}{d.finishedLots.length ? ` (lot ${d.finishedLots.join(', ')})` : ''}
                    {d.shipments.length ? <ul className="erp-list">{d.shipments.map((s) => <li key={s.id}><TraceShipment companyId={companyId} s={s} /></li>)}</ul> : <span className="muted">: not delivered yet</span>}
                  </li>
                ))}
              </ul>
            )}
          </Section>
          <Section title="Every movement"><MovesList companyId={companyId} moves={q.data.moves} /></Section>
        </>
      )}
    </div>
  );
}

