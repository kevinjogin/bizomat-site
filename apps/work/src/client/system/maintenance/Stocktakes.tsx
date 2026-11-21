// Stocktakes of the maintenance stores: ERP Inventory's own counts (src/worker/maintenance/routes-stock.ts). The list
// with its progress and due dates, starting one, and counting it on a phone: find a part or a location by typing or
// scanning, enter what is on the shelf, and it saves as you go. Someone with an ERP role that may move stock starts,
// submits and cancels a stocktake; a warehouse manager who did not submit it approves it in Inventory, which posts the
// differences. Nothing here posts anything.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import { dateText, localToday, mtPage, mtPath, type MtMe } from './api';
import { Section } from './common';
import { CameraReader } from './Field';
import { ReasonDialog } from './Requests';

interface Stocktake {
  id: string;
  number: string;
  kind: 'stocktake' | 'cycle';
  kindLabel: string;
  warehouseId: string;
  locationId: string | null;
  locationCode: string | null;
  status: 'open' | 'submitted' | 'posted' | 'cancelled';
  statusLabel: string;
  notes: string;
  dueDate: string | null;
  overdue: boolean;
  lines: number;
  counted: number;
  variances: number;
  createdByName: string | null;
  submittedByName: string | null;
  approvedByName: string | null;
  store: { id: string; code: string; name: string };
}

interface StoreOption {
  id: string;
  code: string;
  name: string;
  locations: { id: string; code: string; name: string }[];
}

interface CountLine {
  id: string;
  productId: string;
  productNumber: string;
  productName: string;
  uom: string;
  locationId: string;
  locationCode: string;
  lot: string;
  serial: string;
  expected: number;
  counted: number | null;
  variance: number | null;
  countedByName: string | null;
  movedSince: boolean;
}

const STATUS_TONE: Record<string, string> = { open: 'accent', submitted: 'warning', posted: 'success', cancelled: '' };
const SHOW: Record<string, string> = { active: 'Active', open: 'Counting', submitted: 'Waiting for approval', posted: 'Posted', cancelled: 'Cancelled', all: 'All' };
const SORT: Record<string, string> = { due_asc: 'Due date, soonest first', due_desc: 'Due date, latest first', number_desc: 'Number, newest first', number_asc: 'Number, oldest first' };
const inventoryCount = (companyId: string, id: string) => `/c/${encodeURIComponent(companyId)}/inventory/counts/${id}`;
const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);

export function StocktakesPage({ companyId }: { companyId: string; me: MtMe }) {
  usePageTitle('Stocktakes');
  const [params, setParams] = useSearchParams();
  const status = params.get('status') ?? 'active';
  const storeId = params.get('storeId') ?? '';
  const sort = params.get('sort') ?? 'due_asc';
  const [starting, setStarting] = useState(false);
  const q = useQuery({
    queryKey: ['mt', companyId, 'stocktakes', status, storeId, sort],
    queryFn: () => get<{ stocktakes: Stocktake[]; stores: StoreOption[]; can: { start: boolean; approveInInventory: boolean } }>(mtPath(companyId, `/stocktakes?status=${status}&storeId=${encodeURIComponent(storeId)}&sort=${sort}&today=${localToday()}`)),
    retry: false,
  });
  const set = (k: string, v: string, fallback: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== fallback) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const d = q.data;
  return (
    <div className="stack">
      <div className="mt-head">
        <div>
          <h2 className="mt-title">Stocktakes</h2>
          <p className="muted small">Counts of the maintenance stores. Technicians count on a phone; someone who may move stock submits the count; a warehouse manager approves it in Inventory, which posts the differences.</p>
        </div>
        <div className="mt-head-actions">{d.can.start && d.stores.length ? <button className="btn primary" onClick={() => setStarting(true)}><Icon name="plus" /> Start a stocktake</button> : null}</div>
      </div>
      <div className="row wrap">
        <div className="field"><label htmlFor="st-show">Show</label><select id="st-show" className="select" value={status} onChange={(e) => set('status', e.target.value, 'active')}>{Object.entries(SHOW).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
        <div className="field">
          <label htmlFor="st-store">Store</label>
          <select id="st-store" className="select" value={storeId} onChange={(e) => set('storeId', e.target.value, '')}>
            <option value="">Every store</option>
            {d.stores.map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="st-sort">Sort</label><select id="st-sort" className="select" value={sort} onChange={(e) => set('sort', e.target.value, 'due_asc')}>{Object.entries(SORT).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      </div>
      {d.stocktakes.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Number</th><th>Store</th><th>Kind</th><th>Due</th><th>Status</th><th>Counted</th><th>Differences</th></tr></thead>
          <tbody>
            {d.stocktakes.map((s) => (
              <tr key={s.id}>
                <td data-label="Number"><Link className="mt-num mt-primary" to={mtPage(companyId, `/stocktakes/${s.id}`)}>{s.number}</Link></td>
                <td data-label="Store"><span className="mt-num">{s.store.code}</span> {s.store.name}{s.locationCode ? <div className="muted small">Part of the store: {s.locationCode}</div> : null}</td>
                <td data-label="Kind">{s.kindLabel}</td>
                <td data-label="Due">{s.dueDate ? dateText(s.dueDate) : <span className="muted">No due date</span>}{s.overdue ? <span className="badge danger"> Overdue</span> : null}</td>
                <td data-label="Status"><span className={`badge ${STATUS_TONE[s.status] ?? ''}`}>{s.statusLabel}</span></td>
                <td data-label="Counted"><progress className="mt-bar" value={s.counted} max={Math.max(s.lines, 1)} aria-label={`${s.counted} of ${s.lines} lines counted`} /> <span className="small">{s.counted} of {s.lines}</span></td>
                <td data-label="Differences" className="mt-num">{s.variances}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState icon="archive" title="No stocktakes">{d.stores.length ? 'Someone who may move stock starts one for a maintenance store.' : 'There is no maintenance store yet. A maintenance administrator marks warehouses as maintenance stores in Settings.'}</EmptyState>
      )}
      {starting ? <StartDialog companyId={companyId} stores={d.stores} defaultStore={storeId} onClose={() => setStarting(false)} /> : null}
    </div>
  );
}

function StartDialog({ companyId, stores, defaultStore, onClose }: { companyId: string; stores: StoreOption[]; defaultStore: string; onClose: () => void }) {
  const toast = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [f, setF] = useState({ warehouseId: stores.some((s) => s.id === defaultStore) ? defaultStore : (stores[0]?.id ?? ''), locationId: '', kind: 'stocktake', dueDate: addDays(localToday(), 7), notes: '' });
  const [busy, setBusy] = useState(false);
  const store = stores.find((s) => s.id === f.warehouseId);
  const go = async () => {
    setBusy(true);
    try {
      const r = await post<{ id: string; number: string; lines: number }>(mtPath(companyId, '/stocktakes'), { warehouseId: f.warehouseId, locationId: f.locationId || null, kind: f.kind, dueDate: f.dueDate || undefined, notes: f.notes.trim() || undefined });
      toast(`${r.number} started with ${r.lines} ${r.lines === 1 ? 'line' : 'lines'}`);
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      navigate(mtPage(companyId, `/stocktakes/${r.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title="Start a stocktake" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.warehouseId} onClick={go}>{busy ? 'Starting…' : 'Start'}</button></>}>
      <div className="field">
        <label htmlFor="st-new-store">Store</label>
        <select id="st-new-store" className="select" value={f.warehouseId} onChange={(e) => setF((x) => ({ ...x, warehouseId: e.target.value, locationId: '' }))}>
          {stores.map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="st-new-loc">Part of the store</label>
        <select id="st-new-loc" className="select" value={f.locationId} onChange={(e) => setF((x) => ({ ...x, locationId: e.target.value }))}>
          <option value="">The whole store</option>
          {(store?.locations ?? []).map((l) => <option key={l.id} value={l.id}>{l.code} {l.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="st-new-kind">Kind</label>
        <select id="st-new-kind" className="select" value={f.kind} onChange={(e) => setF((x) => ({ ...x, kind: e.target.value }))}>
          <option value="stocktake">Stocktake: every part in the store</option>
          <option value="cycle">Cycle count: one part of the store</option>
        </select>
      </div>
      <div className="field"><label htmlFor="st-new-due">Due</label><input id="st-new-due" className="input" type="date" value={f.dueDate} onChange={(e) => setF((x) => ({ ...x, dueDate: e.target.value }))} /></div>
      <div className="field"><label htmlFor="st-new-notes">Notes</label><textarea id="st-new-notes" className="textarea" rows={2} maxLength={1000} value={f.notes} onChange={(e) => setF((x) => ({ ...x, notes: e.target.value }))} /></div>
      <p className="muted small">Each part in stock there becomes a line with what Inventory expects. Nothing moves until a warehouse manager approves the count in Inventory.</p>
    </Modal>
  );
}

// ------------------------------------------------------------------ counting one

type Order = 'todo' | 'location';
type Filter = 'all' | 'todo' | 'done' | 'diff';
const MAX_ROWS = 200;

export function StocktakeDetail({ companyId }: { companyId: string; me: MtMe }) {
  const { countId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const q = useQuery({
    queryKey: ['mt', companyId, 'stocktake', countId],
    queryFn: () => get<{ stocktake: Stocktake; lines: CountLine[]; can: { count: boolean; submit: boolean; cancel: boolean; approveInInventory: boolean }; note: string | null }>(mtPath(companyId, `/stocktakes/${countId}?today=${localToday()}`)),
    retry: false,
  });
  usePageTitle(q.data?.stocktake.number ?? 'Stocktake');
  const [values, setValues] = useState<Record<string, string>>({});
  const dirty = useRef(new Map<string, string>());
  const [find, setFind] = useState('');
  const [camera, setCamera] = useState(false);
  const [order, setOrder] = useState<Order>('todo');
  const [filter, setFilter] = useState<Filter>('all');
  const [found, setFound] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const linesRef = useRef<CountLine[]>([]);
  const path = mtPath(companyId, `/stocktakes/${countId}`);
  const refresh = () => qc.invalidateQueries({ queryKey: ['mt', companyId] });

  // What is typed and not saved yet goes when the page closes.
  useEffect(() => {
    const pending = dirty.current;
    return () => {
      if (!pending.size) return;
      const lines = [...pending.entries()].map(([id, v]) => ({ id, counted: v.trim() === '' ? null : Number(v) }));
      void put(`${path}/counted`, { lines }).catch(() => undefined);
    };
  }, [path]);

  const save = async (line: CountLine) => {
    const raw = dirty.current.get(line.id);
    if (raw === undefined) return;
    dirty.current.delete(line.id);
    const counted = raw.trim() === '' ? null : Number(raw);
    if (counted !== null && !(counted >= 0)) {
      toast('Enter a number of zero or more', 'error');
      setValues((x) => ({ ...x, [line.id]: line.counted === null ? '' : String(line.counted) }));
      return;
    }
    if (counted === line.counted) return;
    try {
      await put(`${path}/counted`, { lines: [{ id: line.id, counted }] });
      await qc.invalidateQueries({ queryKey: ['mt', companyId, 'stocktake', countId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
      setValues((x) => ({ ...x, [line.id]: line.counted === null ? '' : String(line.counted) }));
    }
  };

  const look = useCallback(
    (raw: string, lines: CountLine[]) => {
      const code = raw.trim();
      if (!code) return;
      const loc = /^LOC:/i.test(code) ? code.replace(/^LOC:/i, '').split('/').pop()!.toLowerCase() : null;
      const hits = lines.filter((l) => (loc ? l.locationCode.toLowerCase() === loc : l.productNumber.toLowerCase() === code.toLowerCase()));
      if (!hits.length) {
        toast(`Nothing on this stocktake matches ${code}`, 'error');
        return;
      }
      setFind(code);
      if (hits.length === 1) {
        setFound(hits[0].id);
        setTimeout(() => {
          const el = inputs.current.get(hits[0].id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el?.focus();
        }, 0);
      } else setFound(null);
    },
    [toast],
  );
  // A steady callback, so the camera is not restarted each time the page draws again.
  const onScan = useCallback(
    (code: string) => {
      setCamera(false);
      look(code, linesRef.current);
    },
    [look],
  );

  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { stocktake: s, lines, can, note } = q.data;
  linesRef.current = lines;
  const open = s.status === 'open';
  const left = s.lines - s.counted;
  const term = find.trim().toLowerCase();
  const locTerm = /^loc:/i.test(term) ? term.replace(/^loc:/, '').split('/').pop()! : null;
  const shown = lines
    .filter((l) => (filter === 'todo' ? l.counted === null : filter === 'done' ? l.counted !== null : filter === 'diff' ? l.variance !== null && Math.abs(l.variance) > 1e-9 : true))
    .filter((l) => !term || (locTerm !== null ? l.locationCode.toLowerCase() === locTerm : `${l.productNumber} ${l.productName} ${l.locationCode} ${l.lot} ${l.serial}`.toLowerCase().includes(term)))
    .sort((a, b) => (order === 'todo' ? Number(a.counted !== null) - Number(b.counted !== null) : 0) || a.locationCode.localeCompare(b.locationCode) || a.productNumber.localeCompare(b.productNumber));
  const submit = async () => {
    setBusy(true);
    try {
      await post(`${path}/submit`, {});
      toast(`${s.number} submitted for approval in Inventory`);
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  const canCamera = typeof window !== 'undefined' && 'BarcodeDetector' in window && !!navigator.mediaDevices?.getUserMedia;
  return (
    <div className="stack">
      <div className="mt-head">
        <div>
          <h2 className="mt-title">{s.number}</h2>
          <div className="mt-badges">
            <span className={`badge ${STATUS_TONE[s.status] ?? ''}`}>{s.statusLabel}</span>
            <span className="badge">{s.kindLabel}</span>
            {s.overdue ? <span className="badge danger">Overdue</span> : null}
          </div>
          <p className="small"><span className="mt-num">{s.store.code}</span> {s.store.name}{s.locationCode ? `, part of the store: ${s.locationCode}` : ''}{s.dueDate ? ` · due ${dateText(s.dueDate)}` : ''}</p>
        </div>
        <div className="mt-head-actions">
          {can.approveInInventory ? <Link className="btn primary" to={inventoryCount(companyId, s.id)}>Approve in Inventory</Link> : null}
          <Link className="btn" to={inventoryCount(companyId, s.id)}>Open in Inventory</Link>
        </div>
      </div>
      <section className="card card-pad stack" aria-label="Progress">
        <progress className="mt-meter" value={s.counted} max={Math.max(s.lines, 1)} aria-label={`${s.counted} of ${s.lines} lines counted`} />
        <p className="small">{s.counted} of {s.lines} counted{s.variances ? `, ${s.variances} with a difference` : ''}.</p>
        {s.status === 'open' ? <p className="muted small">Enter what is on the shelf. Each count saves when you leave the box or press Enter.{note ? ` ${note}` : ''}</p> : null}
        {s.status === 'submitted' ? <p className="small">Waiting for approval in Inventory. A warehouse manager who did not submit it approves it there, and the differences are posted to stock then.</p> : null}
        {s.status === 'posted' ? <p className="small">Approved in Inventory{s.approvedByName ? ` by ${s.approvedByName}` : ''}: the differences are posted to stock.</p> : null}
        {s.status === 'cancelled' ? <p className="small">Cancelled. Nothing was posted.</p> : null}
      </section>

      <Section title="Lines">
        <form className="mt-scan-row" onSubmit={(e) => { e.preventDefault(); look(find, lines); }}>
          <div className="field grow">
            <label htmlFor="st-find">Type or scan a part or a location</label>
            <input id="st-find" className="input mt-scan-input" value={find} autoComplete="off" autoCapitalize="characters" enterKeyHint="search" onChange={(e) => { setFind(e.target.value); setFound(null); }} placeholder="Part number, or a location label" />
          </div>
          <button className="btn" type="submit" disabled={!find.trim()}>Find</button>
          {canCamera ? <button type="button" className="btn" onClick={() => setCamera(true)}><Icon name="eye" /> Scan</button> : null}
        </form>
        {camera ? <CameraReader label="Camera view: point it at a part's or a location's label" onClose={() => setCamera(false)} onCode={onScan} /> : null}
        <div className="row wrap">
          <div className="field"><label htmlFor="st-order">Order</label><select id="st-order" className="select" value={order} onChange={(e) => setOrder(e.target.value as Order)}><option value="todo">Not counted first</option><option value="location">By location</option></select></div>
          <div className="field"><label htmlFor="st-filter">Show</label><select id="st-filter" className="select" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}><option value="all">All</option><option value="todo">Not counted</option><option value="done">Counted</option><option value="diff">With a difference</option></select></div>
        </div>
        {shown.length ? (
          <ul className="mt-count-list">
            {shown.slice(0, MAX_ROWS).map((l) => {
              const value = values[l.id] ?? (l.counted === null ? '' : String(l.counted));
              return (
                <li key={l.id} className={`mt-count-line${l.counted !== null ? ' done' : ''}${found === l.id ? ' found' : ''}`}>
                  <div>
                    <div><span className="mt-num">{l.productNumber}</span> {l.productName}</div>
                    <div className="muted small">
                      {l.locationCode}{l.lot ? ` · lot ${l.lot}` : ''}{l.serial ? ` · serial ${l.serial}` : ''} · Expected {l.expected} {l.uom}
                      {l.variance !== null && Math.abs(l.variance) > 1e-9 ? <span className="mt-overdue"> · difference {l.variance > 0 ? `+${l.variance}` : l.variance}</span> : null}
                      {l.movedSince ? ' · stock moved here since the count started' : ''}
                    </div>
                    {l.countedByName ? <div className="muted small">Counted by {l.countedByName}</div> : null}
                  </div>
                  <div className="row">
                    {l.counted !== null ? <Icon name="check" size={16} /> : null}
                    {open && can.count ? (
                      <input
                        ref={(el) => { if (el) inputs.current.set(l.id, el); else inputs.current.delete(l.id); }}
                        className="input"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step={l.serial ? 1 : 'any'}
                        max={l.serial ? 1 : undefined}
                        aria-label={`Counted ${l.productNumber} ${l.productName} at ${l.locationCode}`}
                        value={value}
                        onChange={(e) => { setValues((x) => ({ ...x, [l.id]: e.target.value })); dirty.current.set(l.id, e.target.value); }}
                        onBlur={() => void save(l)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void save(l); } }}
                      />
                    ) : <strong className="mt-num">{l.counted ?? '–'}</strong>}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : <p className="muted small">{lines.length ? 'No line matches.' : 'This stocktake has no lines.'}</p>}
        {shown.length > MAX_ROWS ? <p className="muted small">Showing {MAX_ROWS} of {shown.length}: search to find a part.</p> : null}
      </Section>

      {open && can.cancel ? (
        <div className="mt-count-actions">
          <button className="btn primary" disabled={busy || left > 0 || !can.submit} onClick={submit}>{left > 0 ? `${left} still to count` : 'Submit for approval'}</button>
          <button className="btn ghost" onClick={() => setCancelling(true)}>Cancel the stocktake</button>
        </div>
      ) : null}
      {cancelling ? (
        <ReasonDialog
          danger
          title={`Cancel ${s.number}`}
          label="Why is it cancelled?"
          confirm="Cancel the stocktake"
          onClose={() => setCancelling(false)}
          onSubmit={async (reason) => {
            try {
              await post(`${path}/cancel`, { reason });
              toast(`${s.number} cancelled`);
              setCancelling(false);
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
