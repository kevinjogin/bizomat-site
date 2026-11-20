// BIZOMAT ERP, Release 3: the shop floor, made for a phone or a terminal at the machine. Per work centre: its status and
// machines (down while their Maintenance asset has an open breakdown work order), the jobs in progress with their
// progress, the jobs ready to start, outstanding inspections, material shortages, and planned against actual output.
// Operators start and stop, run a labour timer, report good output, scrap and downtime, record inspections and
// complete operations. Each report carries its own key, so a double tap on a poor connection counts once.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get, post } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { Modal } from '../../components/ui/overlays';
import { dateText, erpPath, manufacturingPage, qty, type ErpMe } from './api';
import { requestKey, useAct } from './common';
import { RecordDrawings, useCadFlags } from '../cad/Cad';

interface Job {
  moId: string;
  moNumber: string;
  productNumber: string;
  productName: string;
  uom: string;
  priority: string;
  priorityLabel: string;
  requiredDate: string | null;
  operationId: string;
  opNo: number;
  name: string;
  status: string;
  statusLabel: string;
  machineCode: string | null;
  machineDown: boolean;
  planned: number;
  goodQty: number;
  scrapQty: number;
  progressPct: number;
  plannedStart: string | null;
  plannedFinish: string | null;
  inspection: boolean;
  inspectionResult: string | null;
  myTimerRunning: boolean;
  ready: boolean;
  late: boolean;
  shortages: { product: string; name: string; short: number }[];
}

interface Centre {
  id: string;
  code: string;
  name: string;
  status: string;
  statusLabel: string;
  down: boolean;
  machines: { id: string; code: string; name: string; status: string; down: boolean; breakdown: { number: string } | null }[];
  current: Job[];
  available: Job[];
  inspections: Job[];
  goodToday: number;
  plannedThisWeek: number;
  actualThisWeek: number;
}

interface FloorView {
  today: string;
  workCentres: Centre[];
  outsourced: Job[];
  shortages: { moId: string; moNumber: string; items: { product: string; name: string; short: number }[] }[];
  can: { execute: boolean; issue: boolean; receive: boolean };
  note: string;
}

type Ask = null | { job: Job; kind: 'good' | 'scrap' | 'downtime' | 'inspection' };

export function ShopFloor({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Shop floor');
  const [wc, setWc] = useState('');
  const q = useQuery({ queryKey: ['erp', companyId, 'shop-floor'], queryFn: () => get<FloorView>(erpPath(companyId, '/shop-floor')), refetchInterval: 30_000 });
  const act = useAct(companyId);
  const [ask, setAsk] = useState<Ask>(null);
  const [drawingsOf, setDrawingsOf] = useState<string | null>(null);
  const drawings = !!useCadFlags(companyId).data?.flags.manufacturing;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading label="Opening the shop floor…" />;
  const v = q.data;
  const can = v.can.execute && me.can['production.execute'];
  const centres = v.workCentres.filter((w) => !wc || w.id === wc);
  const opPath = (j: Job, x: string) => erpPath(companyId, `/mos/${j.moId}/operations/${j.operationId}/${x}`);
  const jobCard = (j: Job, current: boolean) => (
    <li key={j.operationId} className={`card card-pad stack erp-job${j.late ? ' erp-job-late' : ''}`}>
      <div className="row wrap">
        <Link className="grow erp-job-title" to={manufacturingPage(companyId, `/orders/${j.moId}`)}><span className="mt-num">{j.moNumber}</span> op {j.opNo} {j.name}</Link>
        {j.priority === 'urgent' || j.priority === 'high' ? <span className={`badge ${j.priority === 'urgent' ? 'danger' : 'warning'}`}>{j.priorityLabel}</span> : null}
        {j.late ? <span className="badge danger">Late</span> : null}
        {j.machineDown ? <span className="badge danger">Machine down</span> : null}
      </div>
      <p className="small">{j.productNumber} {j.productName}{j.machineCode ? ` · ${j.machineCode}` : ''}{j.plannedFinish ? ` · finish by ${dateText(j.plannedFinish)}` : ''}</p>
      <div className="erp-job-progress">
        <progress className="erp-progress" max={100} value={j.progressPct} aria-label={`${j.goodQty} of ${j.planned} good`} />
        <span className="small"><strong>{qty(j.goodQty)}</strong> of {qty(j.planned)} {j.uom} good{j.scrapQty ? `, ${qty(j.scrapQty)} scrapped` : ''}</span>
      </div>
      {drawings ? <div className="row"><button className="btn ghost sm" aria-expanded={drawingsOf === j.operationId} onClick={() => setDrawingsOf(drawingsOf === j.operationId ? null : j.operationId)}><Icon name="file" size={14} /> Drawings</button></div> : null}
      {drawings && drawingsOf === j.operationId ? <RecordDrawings companyId={companyId} kind="mos" id={j.moId} /> : null}
      {j.shortages.length ? <p className="warn-box small"><Icon name="alert" size={14} /> Short: {j.shortages.map((s) => `${qty(s.short)} ${s.product}`).join(', ')}</p> : null}
      {j.inspection && !j.inspectionResult && current ? <p className="small"><span className="badge warning">Inspection outstanding</span></p> : null}
      {can ? (
        current ? (
          <div className="erp-job-actions">
            {j.status === 'paused' ? <button className="btn primary erp-big" onClick={() => void act(() => post(opPath(j, 'start'), { timer: true }), 'Resumed, timer running')}><Icon name="play" /> Resume</button> : j.myTimerRunning ? <button className="btn erp-big" onClick={() => void act(() => post(opPath(j, 'time'), { kind: 'labour', action: 'stop' }), 'Timer stopped')}><Icon name="stop" /> Stop my timer</button> : <button className="btn erp-big" onClick={() => void act(() => post(opPath(j, 'time'), { kind: 'labour', action: 'start' }), 'Timer running')}><Icon name="clock" /> Start my timer</button>}
            <button className="btn primary erp-big" onClick={() => setAsk({ job: j, kind: 'good' })}><Icon name="plus" /> Good output</button>
            <button className="btn erp-big" onClick={() => setAsk({ job: j, kind: 'scrap' })}>Scrap</button>
            <button className="btn erp-big" onClick={() => setAsk({ job: j, kind: 'downtime' })}>Downtime</button>
            {j.inspection && !j.inspectionResult ? <button className="btn erp-big" onClick={() => setAsk({ job: j, kind: 'inspection' })}>Inspection</button> : null}
            {j.status === 'in_progress' ? <button className="btn erp-big" onClick={() => void act(() => post(opPath(j, 'pause'), {}), 'Paused')}><Icon name="stop" /> Pause</button> : null}
            <button className="btn erp-big" disabled={j.inspection && !j.inspectionResult} title={j.inspection && !j.inspectionResult ? 'Record the inspection first' : undefined} onClick={() => void act(() => post(opPath(j, 'complete'), {}), 'Operation completed')}><Icon name="check" /> Complete</button>
          </div>
        ) : (
          <div className="erp-job-actions"><button className="btn primary erp-big" onClick={() => void act(() => post(opPath(j, 'start'), { timer: true }), 'Started, timer running')}><Icon name="play" /> Start</button></div>
        )
      ) : null}
    </li>
  );
  return (
    <div className="stack erp-floor">
      <div className="row wrap erp-modes" role="group" aria-label="Work centre">
        <button type="button" className={`btn${wc ? '' : ' primary'}`} aria-pressed={!wc} onClick={() => setWc('')}>All</button>
        {v.workCentres.map((w) => <button key={w.id} type="button" className={`btn${wc === w.id ? ' primary' : ''}`} aria-pressed={wc === w.id} onClick={() => setWc(w.id)}>{w.code}{w.down ? ' (down)' : ''}</button>)}
      </div>
      {!v.workCentres.length ? <p className="muted">No work centres yet. A production manager sets them up under Work centres.</p> : null}
      {centres.map((w) => (
        <section key={w.id} className="card card-pad stack erp-centre" aria-labelledby={`wc-${w.id}`}>
          <div className="row wrap">
            <h2 className="crm-subhead grow" id={`wc-${w.id}`}><span className="mt-num">{w.code}</span> {w.name}</h2>
            <span className={`badge ${w.status === 'active' ? 'success' : 'warning'}`}>{w.statusLabel}</span>
            {w.down ? <span className="badge danger">Down</span> : null}
          </div>
          {w.machines.length ? <div className="row wrap small">{w.machines.map((m) => <span key={m.id} className={`badge${m.down ? ' danger' : m.status === 'active' ? ' success' : ''}`}>{m.code} {m.down ? `down${m.breakdown ? ` (${m.breakdown.number})` : ''}` : m.status === 'active' ? 'up' : 'inactive'}</span>)}</div> : null}
          <dl className="co-figures erp-floor-figures">
            <div><dt>Good today</dt><dd>{qty(w.goodToday)}</dd></div>
            <div><dt>Planned this week</dt><dd>{qty(w.plannedThisWeek)}</dd></div>
            <div><dt>Done this week</dt><dd>{qty(w.actualThisWeek)}</dd></div>
            <div><dt>Inspections</dt><dd className={w.inspections.length ? 'warning-text' : ''}>{w.inspections.length}</dd></div>
          </dl>
          <h3 className="erp-h3">In progress</h3>
          {w.current.length ? <ul className="erp-list">{w.current.map((j) => jobCard(j, true))}</ul> : <p className="muted small">Nothing running.</p>}
          <h3 className="erp-h3">Ready to start</h3>
          {w.available.length ? <ul className="erp-list">{w.available.map((j) => jobCard(j, false))}</ul> : <p className="muted small">No job is waiting here.</p>}
        </section>
      ))}
      {v.outsourced.length && !wc ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">With suppliers</h2>
          <ul className="erp-list">{v.outsourced.map((j) => <li key={j.operationId} className="small"><Link to={manufacturingPage(companyId, `/orders/${j.moId}`)}><span className="mt-num">{j.moNumber}</span> op {j.opNo} {j.name}</Link> · {j.statusLabel}</li>)}</ul>
        </section>
      ) : null}
      {v.shortages.length && !wc ? (
        <section className="card card-pad stack">
          <h2 className="crm-subhead">Material shortages</h2>
          <ul className="erp-list">{v.shortages.map((s) => <li key={s.moId} className="small"><Link to={manufacturingPage(companyId, `/orders/${s.moId}`)}><span className="mt-num">{s.moNumber}</span></Link>: {s.items.map((i) => `${qty(i.short)} ${i.product} ${i.name}`).join(', ')}</li>)}</ul>
        </section>
      ) : null}
      <p className="muted small"><Icon name="info" size={14} /> {v.note} The screen refreshes every 30 seconds.</p>
      {ask ? <FloorDialog companyId={companyId} ask={ask} onClose={() => setAsk(null)} /> : null}
    </div>
  );
}

function FloorDialog({ companyId, ask, onClose }: { companyId: string; ask: NonNullable<Ask>; onClose: () => void }) {
  const act = useAct(companyId);
  const j = ask.job;
  const [value, setValue] = useState(ask.kind === 'good' ? String(Math.max(0, j.planned - j.goodQty)) : '');
  const [reason, setReason] = useState('');
  const [key] = useState(requestKey);
  const path = (x: string) => erpPath(companyId, `/mos/${j.moId}/operations/${j.operationId}/${x}`);
  const save = async (result?: 'pass' | 'fail') => {
    const ok =
      ask.kind === 'inspection'
        ? await act(() => post(path('inspection'), { result, comment: reason || undefined }), result === 'pass' ? 'Inspection passed' : 'Inspection failed: recorded')
        : await act(() => post(path('report'), { kind: ask.kind, quantity: ask.kind === 'downtime' ? undefined : Number(value), minutes: ask.kind === 'downtime' ? Number(value) : undefined, reason: reason || undefined, requestKey: key }), 'Reported');
    if (ok) onClose();
  };
  const title = { good: 'Good output', scrap: 'Scrap', downtime: 'Downtime', inspection: 'Inspection' }[ask.kind];
  return (
    <Modal
      title={`${title}: ${j.moNumber} op ${j.opNo}`}
      onClose={onClose}
      footer={
        ask.kind === 'inspection' ? (
          <><button className="btn erp-big" onClick={onClose}>Back</button><button className="btn danger erp-big" disabled={!reason.trim()} onClick={() => void save('fail')}>Fail</button><button className="btn primary erp-big" onClick={() => void save('pass')}>Pass</button></>
        ) : (
          <><button className="btn erp-big" onClick={onClose}>Back</button><button className="btn primary erp-big" disabled={!(Number(value) > 0) || (ask.kind !== 'good' && !reason.trim())} onClick={() => void save()}>Save</button></>
        )
      }
    >
      <div className="stack">
        {ask.kind !== 'inspection' ? (
          <div className="field"><label htmlFor="fl-v">{ask.kind === 'downtime' ? 'Minutes' : `Quantity (${j.uom})`}</label><input id="fl-v" className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} /></div>
        ) : null}
        {ask.kind !== 'good' ? <div className="field"><label htmlFor="fl-r">{ask.kind === 'inspection' ? 'Note (say what failed)' : 'Reason'}</label><input id="fl-r" className="input erp-scan-input" maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} /></div> : null}
        {ask.kind === 'good' ? <p className="muted small">{qty(j.goodQty)} of {qty(j.planned)} good so far.</p> : null}
      </div>
    </Modal>
  );
}
