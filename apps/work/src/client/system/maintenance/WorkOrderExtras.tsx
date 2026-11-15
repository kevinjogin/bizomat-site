// What a work order shows from stages M2 and M3: the preventive schedule behind it, its inspections (record each item,
// complete it; a failure makes its follow-up once), parts used from the maintenance stores (issued and returned through
// ERP Inventory), labour with time entered by hand and its cost, downtime, and meter readings.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { del, get, post, put } from '../../lib/api';
import { useDebounced } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { useToast } from '../../components/ui/overlays';
import { dateText, dateTimeText, localToday, localToMs, minutesText, money, msToLocal, mtPage, mtPath, requestKey, type InspItem, type InspResult, type Meter, type MtMe } from './api';
import { Section } from './common';
import { PersonSelect } from './pickers';

export interface WoExtras {
  inspections: { id: string; templateId: string; templateName: string; status: 'open' | 'passed' | 'failed'; completedAt: number | null; completedByName: string | null; followUp: { kind: 'work_order' | 'request'; id: string; number: string } | null; items: InspItem[]; results: InspResult[]; failed: number }[];
  stock: {
    moves: { id: string; type: string; typeLabel: string; productId: string; productNumber: string; productName: string; uom: string; locationId: string; location: string; lot: string; serial: string; quantity: number; unitCostCents?: number | null; valueCents?: number; byName: string | null; at: number }[];
    byProduct: { productId: string; number: string; name: string; uom: string; issued: number; costCents?: number }[];
    costCents?: number;
    financePosting: string;
  };
  labourCosts: { labourId: string; entry: 'timer' | 'manual'; workDate: string; minutes: number; userId: string | null; userName: string | null; note: string; rateCents?: number | null; rateSource?: string; costCents?: number | null }[];
  costs: { labourCents: number; labourUnpricedMinutes: number; partsCents: number; totalCents: number } | null;
  downtime: { startedAt: number; endedAt: number | null; minutes: number | null; cause: string; recordedByName: string | null } | null;
  readings: { id: string; meterId: string; meterName: string; unit: string; value: number; reset: boolean; outOfRange: boolean; readAt: number }[];
  preventive: { scheduleId: string; name: string; triggerKind: string; dueDate: string; dueMeter: number | null } | null;
}

type Act = (fn: () => Promise<unknown>, done?: string) => Promise<boolean>;
interface Props {
  companyId: string;
  me: MtMe;
  woId: string;
  assetId: string;
  d: WoExtras;
  canWork: boolean;
  seeCosts: boolean;
  act: Act;
}

const RATE_SOURCE: Record<string, string> = { person: 'person’s rate', work_order_trade: 'trade’s rate', person_trade: 'their trade’s rate', '': 'no rate set' };

export function PreventiveNote({ companyId, d }: { companyId: string; d: WoExtras }) {
  if (!d.preventive) return null;
  return (
    <p className="small mt-pm-note">
      <Icon name="calendar" size={14} /> Made by preventive maintenance <Link to={mtPage(companyId, `/preventive/${d.preventive.scheduleId}`)}>{d.preventive.name}</Link>, due {dateText(d.preventive.dueDate)}
      {d.preventive.dueMeter != null ? ` (meter at ${d.preventive.dueMeter})` : ''}. Completing it moves the schedule on.
    </p>
  );
}

// ------------------------------------------------------------------ inspections

export function InspectionsSection({ companyId, woId, d, canWork, act }: Props) {
  const templates = useQuery({ queryKey: ['mt', companyId, 'insp-templates'], queryFn: () => get<{ templates: { id: string; name: string }[] }>(mtPath(companyId, '/inspection-templates')), enabled: canWork });
  const [adding, setAdding] = useState('');
  const base = mtPath(companyId, `/work-orders/${woId}/inspections`);
  if (!d.inspections.length && !canWork) return null;
  return (
    <Section title={`Inspections (${d.inspections.length})`}>
      {d.inspections.map((i) => <Inspection key={i.id} insp={i} base={`${base}/${i.id}`} canWork={canWork} act={act} companyId={companyId} />)}
      {!d.inspections.length ? <p className="muted small">No inspection on this work order.</p> : null}
      {canWork ? (
        <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); if (adding) void act(() => post(base, { templateId: adding }), 'Inspection added').then((ok) => ok && setAdding('')); }}>
          <label className="sr-only" htmlFor="wo-add-insp">Add an inspection</label>
          <select id="wo-add-insp" className="select" value={adding} onChange={(e) => setAdding(e.target.value)}>
            <option value="">Add an inspection…</option>
            {(templates.data?.templates ?? []).filter((t) => !d.inspections.some((x) => x.templateId === t.id)).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="btn" disabled={!adding}>Add</button>
        </form>
      ) : null}
    </Section>
  );
}

function Inspection({ insp, base, canWork, act, companyId }: { insp: WoExtras['inspections'][number]; base: string; canWork: boolean; act: Act; companyId: string }) {
  const recorded = new Map(insp.results.map((r) => [r.itemId, r]));
  const [values, setValues] = useState<Record<string, { passed?: boolean; value?: string; text?: string; note?: string }>>({});
  const open = insp.status === 'open' && canWork;
  const val = (id: string) => values[id] ?? {};
  const set = (id: string, v: { passed?: boolean; value?: string; text?: string; note?: string }) => setValues((x) => ({ ...x, [id]: { ...x[id], ...v } }));
  const save = async () => {
    const results = Object.entries(values)
      .map(([itemId, v]) => {
        const item = insp.items.find((x) => x.id === itemId);
        if (!item) return null;
        if (item.kind === 'pass_fail') return v.passed === undefined ? null : { itemId, passed: v.passed, note: v.note };
        if (item.kind === 'number') return v.value === undefined || v.value === '' ? null : { itemId, value: Number(v.value), note: v.note };
        return { itemId, text: v.text ?? '', note: v.note };
      })
      .filter(Boolean);
    if (!results.length) return;
    if (await act(() => put(`${base}/results`, { results }), 'Results saved')) setValues({});
  };
  return (
    <div className={`mt-insp ${insp.status}`}>
      <div className="row wrap">
        <strong className="grow">{insp.templateName}</strong>
        <span className={`badge ${insp.status === 'passed' ? 'success' : insp.status === 'failed' ? 'danger' : 'accent'}`}>{insp.status === 'open' ? 'Open' : insp.status === 'passed' ? 'Passed' : `Failed (${insp.failed})`}</span>
      </div>
      {insp.completedAt ? <p className="muted small">Completed {dateTimeText(insp.completedAt)}{insp.completedByName ? ` by ${insp.completedByName}` : ''}.</p> : null}
      {insp.followUp ? <p className="small">Follow-up: <Link to={mtPage(companyId, `/${insp.followUp.kind === 'work_order' ? 'work-orders' : 'requests'}/${insp.followUp.id}`)}>{insp.followUp.kind === 'work_order' ? 'work order' : 'request'} {insp.followUp.number}</Link></p> : null}
      <ol className="mt-insp-items">
        {insp.items.map((it) => {
          const r = recorded.get(it.id);
          const v = val(it.id);
          return (
            <li key={it.id} className={r?.passed === false ? 'failed' : ''}>
              <div className="row wrap">
                <span className="grow">{it.label}{it.critical ? <span className="badge danger"> Critical</span> : null}{it.kind === 'number' && (it.min != null || it.max != null) ? <span className="muted small"> ({it.min ?? '…'} to {it.max ?? '…'}{it.unit ? ` ${it.unit}` : ''})</span> : null}</span>
                {r ? <span className="small">{r.kind === 'pass_fail' ? (r.passed ? 'Pass' : 'Fail') : r.kind === 'number' ? `${r.value}${r.unit ? ` ${r.unit}` : ''}${r.passed === false ? ' (outside the limits)' : ''}` : r.text}</span> : <span className="muted small">Not recorded</span>}
              </div>
              {r?.note ? <div className="muted small">{r.note}</div> : null}
              {open ? (
                <div className="mt-add-line">
                  {it.kind === 'pass_fail' ? (
                    <span className="mt-passfail" role="group" aria-label={it.label}>
                      <button type="button" className={`btn sm${v.passed === true ? ' primary' : ''}`} aria-pressed={v.passed === true} onClick={() => set(it.id, { passed: true })}>Pass</button>
                      <button type="button" className={`btn sm${v.passed === false ? ' danger' : ''}`} aria-pressed={v.passed === false} onClick={() => set(it.id, { passed: false })}>Fail</button>
                    </span>
                  ) : it.kind === 'number' ? (
                    <input className="input mt-qty" type="number" step="any" inputMode="decimal" aria-label={`${it.label} value`} value={v.value ?? ''} onChange={(e) => set(it.id, { value: e.target.value })} />
                  ) : (
                    <input className="input" maxLength={2000} aria-label={it.label} value={v.text ?? ''} onChange={(e) => set(it.id, { text: e.target.value })} />
                  )}
                  {it.kind !== 'text' ? <input className="input" maxLength={1000} aria-label={`Note on ${it.label}`} placeholder="Note (optional)" value={v.note ?? ''} onChange={(e) => set(it.id, { note: e.target.value })} /> : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      {open ? (
        <div className="row wrap">
          <button className="btn" disabled={!Object.keys(values).length} onClick={save}>Save results</button>
          <button className="btn primary" onClick={() => act(() => post(`${base}/complete`, {}), 'Inspection completed')}>Complete the inspection</button>
        </div>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ parts

interface StoreStock {
  productId: string;
  productNumber: string;
  productName: string;
  uom: string;
  locationId: string;
  location: string;
  lot: string;
  serial: string;
  onHand: number;
  available: number;
  unitCostCents: number | null;
}

export function PartsSection({ companyId, woId, d, canWork, seeCosts, act }: Props) {
  const [q, setQ] = useState('');
  const term = useDebounced(q, 200);
  const [pick, setPick] = useState<StoreStock | null>(null);
  const [qty, setQty] = useState('1');
  const [ret, setRet] = useState<{ productId: string; locationId: string; qty: string }>({ productId: '', locationId: '', qty: '1' });
  const [key, setKey] = useState(requestKey);
  const stock = useQuery({ queryKey: ['mt', companyId, 'store-stock', term], queryFn: () => get<{ stock: StoreStock[] }>(mtPath(companyId, `/stores/stock?q=${encodeURIComponent(term)}`)), enabled: canWork });
  const base = mtPath(companyId, `/work-orders/${woId}/stock`);
  const issued = d.stock.byProduct.filter((p) => p.issued > 1e-9);
  const returnLocations = [...new Map(d.stock.moves.filter((m) => m.productId === ret.productId).map((m) => [m.locationId, m])).values()];
  return (
    <Section title="Parts used">
      {d.stock.moves.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Part</th><th>Movement</th><th>Quantity</th><th>Store location</th>{seeCosts ? <th>Cost</th> : null}</tr></thead>
          <tbody>
            {d.stock.moves.map((m) => (
              <tr key={m.id}>
                <td data-label="Part"><span className="mt-num">{m.productNumber}</span> {m.productName}{m.lot ? <div className="muted small">Lot {m.lot}</div> : null}{m.serial ? <div className="muted small">Serial {m.serial}</div> : null}</td>
                <td data-label="Movement">{m.typeLabel}<div className="muted small">{m.byName ?? ''} · {dateTimeText(m.at)}</div></td>
                <td data-label="Quantity" className="mt-num">{m.quantity} {m.uom}</td>
                <td data-label="Store location">{m.location}</td>
                {seeCosts ? <td data-label="Cost" className="mt-num">{money(m.valueCents)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted small">No parts issued from the stores yet.</p>}
      {seeCosts && d.stock.moves.length ? <p className="small"><strong>Parts cost: {money(d.stock.costCents)}</strong> (issued less returned, at the stock value of each movement). {d.stock.financePosting}</p> : null}
      {canWork ? (
        <div className="mt-issue">
          <div className="field">
            <label htmlFor="wo-part-q">Issue a part from a maintenance store</label>
            <input id="wo-part-q" className="input" type="search" value={q} onChange={(e) => { setQ(e.target.value); setPick(null); }} placeholder="Part number or name" />
          </div>
          {!pick && stock.data ? (
            stock.data.stock.length ? (
              <ul className="mt-picker-list" aria-label="Parts in the maintenance stores">
                {stock.data.stock.slice(0, 30).map((s) => (
                  <li key={`${s.productId}-${s.locationId}-${s.lot}-${s.serial}`}>
                    <button type="button" onClick={() => { setPick(s); setQty('1'); }}>
                      <span className="mt-num">{s.productNumber}</span>
                      <span className="grow">{s.productName}</span>
                      <span className="muted small">{s.location}{s.lot ? ` lot ${s.lot}` : ''}{s.serial ? ` serial ${s.serial}` : ''}: {s.available} {s.uom}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p className="muted small">Nothing in the maintenance stores matches. An administrator marks warehouses as maintenance stores in Settings; stock is received in Inventory.</p>
          ) : null}
          {pick ? (
            <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void act(() => post(`${base}/issue`, { lines: [{ productId: pick.productId, locationId: pick.locationId, lot: pick.lot || undefined, serial: pick.serial || undefined, quantity: Number(qty) }], requestKey: key }), 'Part issued').then((ok) => { if (ok) { setPick(null); setQ(''); setKey(requestKey()); } }); }}>
              <span className="mt-picked grow"><span className="mt-num">{pick.productNumber}</span> {pick.productName} from {pick.location} ({pick.available} {pick.uom} available)</span>
              <label className="sr-only" htmlFor="wo-part-qty">Quantity</label>
              <input id="wo-part-qty" className="input mt-qty" type="number" inputMode="decimal" min="0" step="any" value={qty} onChange={(e) => setQty(e.target.value)} />
              <button className="btn primary" disabled={!(Number(qty) > 0)}>Issue</button>
              <button type="button" className="btn ghost" onClick={() => setPick(null)}>Cancel</button>
            </form>
          ) : null}
          {issued.length ? (
            <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void act(() => post(`${base}/return`, { lines: [{ productId: ret.productId, locationId: ret.locationId, quantity: Number(ret.qty) }], requestKey: key }), 'Part returned').then((ok) => { if (ok) { setRet({ productId: '', locationId: '', qty: '1' }); setKey(requestKey()); } }); }}>
              <label className="sr-only" htmlFor="wo-ret-part">Return a part</label>
              <select id="wo-ret-part" className="select" value={ret.productId} onChange={(e) => setRet({ productId: e.target.value, locationId: '', qty: '1' })}>
                <option value="">Return a part not used…</option>
                {issued.map((p) => <option key={p.productId} value={p.productId}>{p.number} {p.name} ({p.issued} {p.uom} issued)</option>)}
              </select>
              {ret.productId ? (
                <>
                  <label className="sr-only" htmlFor="wo-ret-loc">To</label>
                  <select id="wo-ret-loc" className="select" value={ret.locationId} onChange={(e) => setRet((x) => ({ ...x, locationId: e.target.value }))}>
                    <option value="">To the store location…</option>
                    {returnLocations.map((m) => <option key={m.locationId} value={m.locationId}>{m.location}</option>)}
                  </select>
                  <label className="sr-only" htmlFor="wo-ret-qty">Quantity</label>
                  <input id="wo-ret-qty" className="input mt-qty" type="number" min="0" step="any" value={ret.qty} onChange={(e) => setRet((x) => ({ ...x, qty: e.target.value }))} />
                  <button className="btn" disabled={!ret.locationId || !(Number(ret.qty) > 0)}>Return</button>
                </>
              ) : null}
            </form>
          ) : null}
        </div>
      ) : null}
    </Section>
  );
}

// ------------------------------------------------------------------ labour

export function LabourSection({ companyId, me, woId, d, canWork, seeCosts, act }: Props) {
  const [f, setF] = useState({ date: localToday(), hours: '', minutes: '', note: '', userId: '' });
  const base = mtPath(companyId, `/work-orders/${woId}/labour`);
  const total = Math.round((Number(f.hours) || 0) * 60 + (Number(f.minutes) || 0));
  return (
    <Section title="Labour and costs">
      {d.labourCosts.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>Date</th><th>Person</th><th>Time</th><th>How</th>{seeCosts ? <th>Rate</th> : null}{seeCosts ? <th>Cost</th> : null}<th><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {d.labourCosts.map((l) => (
              <tr key={l.labourId}>
                <td data-label="Date">{dateText(l.workDate)}</td>
                <td data-label="Person">{l.userName ?? 'Someone'}{l.note ? <div className="muted small">{l.note}</div> : null}</td>
                <td data-label="Time" className="mt-num">{minutesText(l.minutes)}</td>
                <td data-label="How">{l.entry === 'timer' ? 'Timer' : 'Entered'}</td>
                {seeCosts ? <td data-label="Rate">{l.rateCents != null ? `${money(l.rateCents)} an hour (${RATE_SOURCE[l.rateSource ?? '']})` : <span className="muted">{RATE_SOURCE['']}</span>}</td> : null}
                {seeCosts ? <td data-label="Cost" className="mt-num">{money(l.costCents)}</td> : null}
                <td>{canWork && l.entry === 'manual' && (l.userId === me.user.id || me.can.manageWork) ? <button className="btn ghost icon sm" aria-label="Remove this time entry" onClick={() => act(() => del(`${base}/${l.labourId}`), 'Time entry removed')}><Icon name="trash" size={14} /></button> : null}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted small">No time with a cost line yet. Time from the timer is priced when it stops; time can also be entered by hand.</p>}
      {seeCosts && d.costs ? (
        <p className="small">
          <strong>Labour {money(d.costs.labourCents)} + parts {money(d.costs.partsCents)} = {money(d.costs.totalCents)}</strong>
          {d.costs.labourUnpricedMinutes ? ` (${minutesText(d.costs.labourUnpricedMinutes)} without a rate)` : ''}. Rates are set in Settings; past lines keep the rate they were priced at.
        </p>
      ) : null}
      {canWork ? (
        <form className="mt-labour-form" onSubmit={(e) => { e.preventDefault(); void act(() => post(base, { date: f.date, minutes: total, note: f.note || undefined, ...(f.userId ? { userId: f.userId } : {}) }), 'Time entered').then((ok) => ok && setF((x) => ({ ...x, hours: '', minutes: '', note: '' }))); }}>
          <div className="field"><label htmlFor="lab-date">Date</label><input id="lab-date" className="input" type="date" value={f.date} max={localToday()} onChange={(e) => setF((x) => ({ ...x, date: e.target.value }))} /></div>
          <div className="field"><label htmlFor="lab-h">Hours</label><input id="lab-h" className="input" type="number" inputMode="numeric" min="0" max="24" step="1" value={f.hours} onChange={(e) => setF((x) => ({ ...x, hours: e.target.value }))} /></div>
          <div className="field"><label htmlFor="lab-m">Minutes</label><input id="lab-m" className="input" type="number" inputMode="numeric" min="0" max="59" step="1" value={f.minutes} onChange={(e) => setF((x) => ({ ...x, minutes: e.target.value }))} /></div>
          {me.can.manageWork ? <PersonSelect me={me} id="lab-who" label="For" minRole="technician" value={f.userId} onChange={(v) => setF((x) => ({ ...x, userId: v }))} empty="Me" /> : null}
          <div className="field mt-labour-note"><label htmlFor="lab-note">Note</label><input id="lab-note" className="input" maxLength={500} value={f.note} onChange={(e) => setF((x) => ({ ...x, note: e.target.value }))} /></div>
          <button className="btn" disabled={total < 1 || total > 1440 || !f.date}>Enter time</button>
        </form>
      ) : null}
    </Section>
  );
}

// ------------------------------------------------------------------ downtime and readings

export function DowntimeSection({ companyId, woId, d, canWork, act }: Props) {
  const [f, setF] = useState({ start: msToLocal(d.downtime?.startedAt), end: msToLocal(d.downtime?.endedAt), cause: d.downtime?.cause ?? '' });
  const base = mtPath(companyId, `/work-orders/${woId}/downtime`);
  if (!d.downtime && !canWork) return null;
  const save = (end: number | null) => act(() => put(base, { startedAt: localToMs(f.start), endedAt: end, cause: f.cause }), end ? 'Downtime recorded' : 'Downtime started');
  return (
    <Section title="Downtime">
      {d.downtime ? (
        <p className="small">
          {d.downtime.endedAt ? `Down from ${dateTimeText(d.downtime.startedAt)} to ${dateTimeText(d.downtime.endedAt)}: ${minutesText(d.downtime.minutes)}.` : `Down since ${dateTimeText(d.downtime.startedAt)}.`}
          {d.downtime.cause ? ` ${d.downtime.cause}.` : ''}
        </p>
      ) : <p className="muted small">No downtime recorded. Record when the asset stopped and started again: breakdowns and corrective work with downtime count in the reliability reports.</p>}
      {canWork ? (
        <form className="mt-labour-form" onSubmit={(e) => { e.preventDefault(); void save(localToMs(f.end)); }}>
          <div className="field"><label htmlFor="dt-start">Down from</label><input id="dt-start" className="input" type="datetime-local" value={f.start} onChange={(e) => setF((x) => ({ ...x, start: e.target.value }))} /></div>
          <div className="field"><label htmlFor="dt-end">Back up at</label><input id="dt-end" className="input" type="datetime-local" value={f.end} onChange={(e) => setF((x) => ({ ...x, end: e.target.value }))} /></div>
          <div className="field mt-labour-note"><label htmlFor="dt-cause">Cause</label><input id="dt-cause" className="input" maxLength={500} value={f.cause} onChange={(e) => setF((x) => ({ ...x, cause: e.target.value }))} /></div>
          <button className="btn" disabled={!f.start}>Save downtime</button>
          {d.downtime && !d.downtime.endedAt ? <button type="button" className="btn primary" onClick={() => void save(Date.now())}>Back up now</button> : null}
        </form>
      ) : null}
    </Section>
  );
}

export function ReadingsSection({ companyId, woId, assetId, d, canWork, act }: Props) {
  const meters = useQuery({ queryKey: ['mt', companyId, 'meters', assetId], queryFn: () => get<{ meters: Meter[] }>(mtPath(companyId, `/meters?assetId=${assetId}`)), enabled: canWork });
  const [f, setF] = useState({ meterId: '', value: '', reset: false });
  const toast = useToast();
  if (!d.readings.length && !(canWork && meters.data?.meters.length)) return null;
  return (
    <Section title="Readings">
      {d.readings.length ? (
        <ul className="mt-docs small">
          {d.readings.map((r) => <li key={r.id}>{r.meterName}: <strong>{r.value}{r.unit ? ` ${r.unit}` : ''}</strong>{r.reset ? ' (reset)' : ''}{r.outOfRange ? <span className="mt-overdue"> outside the expected range</span> : null} · {dateTimeText(r.readAt)}</li>)}
        </ul>
      ) : null}
      {canWork && meters.data?.meters.length ? (
        <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void act(async () => { const r = await post<{ generated: { number: string }[] }>(mtPath(companyId, `/meters/${f.meterId}/readings`), { value: Number(f.value), reset: f.reset || undefined, workOrderId: woId, today: localToday() }); if (r.generated.length) toast(`Preventive work order made: ${r.generated.map((g) => g.number).join(', ')}`); }, 'Reading saved').then((ok) => ok && setF((x) => ({ ...x, value: '', reset: false }))); }}>
          <label className="sr-only" htmlFor="wo-meter">Meter</label>
          <select id="wo-meter" className="select" value={f.meterId} onChange={(e) => setF((x) => ({ ...x, meterId: e.target.value }))}>
            <option value="">Enter a reading…</option>
            {meters.data.meters.filter((m) => !m.archived).map((m) => <option key={m.id} value={m.id}>{m.name}{m.lastValue != null ? ` (last ${m.lastValue}${m.unit ? ` ${m.unit}` : ''})` : ''}</option>)}
          </select>
          <label className="sr-only" htmlFor="wo-reading">Reading</label>
          <input id="wo-reading" className="input mt-qty" type="number" inputMode="decimal" step="any" value={f.value} onChange={(e) => setF((x) => ({ ...x, value: e.target.value }))} />
          <label className="checkbox small"><input type="checkbox" checked={f.reset} onChange={(e) => setF((x) => ({ ...x, reset: e.target.checked }))} /> Meter reset or replaced</label>
          <button className="btn" disabled={!f.meterId || f.value === ''}>Save</button>
        </form>
      ) : null}
    </Section>
  );
}
