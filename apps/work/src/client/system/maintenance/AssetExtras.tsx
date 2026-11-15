// What an asset's page shows from stages M2 and M3: its site, meters and gauges with their readings, preventive
// maintenance schedules, prestart checklist and latest checks, and its QR label.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, patch, post, put } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { Icon } from '../../components/ui/Icon';
import { Loading } from '../../components/ui/ui';
import { Modal, useToast } from '../../components/ui/overlays';
import { dateTimeText, localToday, mtPage, mtPath, nextDueText, triggerText, useSites, type Meter, type Schedule } from './api';
import { Section } from './common';

export interface AssetExtrasData {
  meters: Meter[];
  schedules: Schedule[];
  prestartTemplate: { id: string; name: string } | null;
  prestarts: { id: string; result: string; templateName: string; failedItems: number; setOutOfService: boolean; performedAt: number; performedByName: string | null }[];
  qrUrl: string;
}

function useRun() {
  const toast = useToast();
  const qc = useQueryClient();
  return async (companyId: string, fn: () => Promise<any>, done: string | ((r: any) => string)) => {
    try {
      const r = await fn();
      toast(typeof done === 'string' ? done : done(r));
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
      return true;
    } catch (err) {
      toast(errorMessage(err), 'error');
      return false;
    }
  };
}

export function SiteField({ companyId, assetId, siteId, siteName, canEdit, hasChildren }: { companyId: string; assetId: string; siteId: string | null; siteName: string | null; canEdit: boolean; hasChildren: boolean }) {
  const sites = useSites(companyId);
  const run = useRun();
  const [withChildren, setWithChildren] = useState(true);
  if (!canEdit) return <p className="small">Site: <strong>{siteName ?? 'Not placed in a site'}</strong></p>;
  return (
    <div className="mt-add-line">
      <label className="sr-only" htmlFor="as-site">Site</label>
      <select id="as-site" className="select" value={siteId ?? ''} onChange={(e) => void run(companyId, () => put(mtPath(companyId, `/assets/${assetId}/site`), { siteId: e.target.value || null, includeChildren: hasChildren && withChildren }), (r) => `Site saved for ${r.assets} ${r.assets === 1 ? 'asset' : 'assets'}`)}>
        <option value="">Not placed in a site</option>
        {(sites.data?.sites ?? []).filter((s) => !s.archived || s.id === siteId).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}
      </select>
      {hasChildren ? <label className="checkbox small"><input type="checkbox" checked={withChildren} onChange={(e) => setWithChildren(e.target.checked)} /> With the assets under it</label> : null}
      {!sites.data?.sites.length ? <Link className="small" to={mtPage(companyId, '/settings')}>Add sites in Settings</Link> : null}
    </div>
  );
}

export function QrLabel({ companyId, assetId, number, qrUrl }: { companyId: string; assetId: string; number: string; qrUrl: string }) {
  return (
    <div className="mt-qr">
      <img src={appUrl(qrUrl)} alt={`QR label of ${number}`} width={120} height={132} loading="lazy" />
      <div className="small stack">
        <span>The label carries <span className="mt-num">ASSET:{number}</span>. Scan it to open the asset, its prestart check or a fault report.</span>
        <Link to={mtPage(companyId, `/labels?ids=${assetId}`)}><Icon name="download" size={14} /> Print this label</Link>
      </div>
    </div>
  );
}

export function MetersSection({ companyId, assetId, meters, canManage, archived }: { companyId: string; assetId: string; meters: Meter[]; canManage: boolean; archived: boolean }) {
  const run = useRun();
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<Meter | null>(null);
  const [vals, setVals] = useState<Record<string, { value: string; reset: boolean }>>({});
  const live = meters.filter((m) => !m.archived);
  return (
    <Section title={`Meters and gauges (${live.length})`} actions={canManage && !archived ? <button className="btn sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add</button> : null}>
      {live.length ? (
        <ul className="mt-meters">
          {live.map((m) => {
            const v = vals[m.id] ?? { value: '', reset: false };
            return (
              <li key={m.id} className="mt-meter-row">
                <div className="row wrap">
                  <button className="mt-linkbtn grow" onClick={() => setOpen(m)}>{m.name}</button>
                  <span className="mt-num"><strong>{m.lastValue ?? 'No reading'}</strong>{m.lastValue != null && m.unit ? ` ${m.unit}` : ''}</span>
                </div>
                <div className="muted small">
                  {m.rising ? 'Meter' : 'Gauge'}
                  {m.rising && m.lastTotal != null && m.lastTotal !== m.lastValue ? `, life total ${m.lastTotal}` : ''}
                  {m.expectedMin != null || m.expectedMax != null ? `, expected ${m.expectedMin ?? '…'} to ${m.expectedMax ?? '…'}` : ''}
                  {m.lastReadAt ? `, read ${dateTimeText(m.lastReadAt)}` : ''}
                </div>
                {!archived ? (
                  <form className="mt-add-line" onSubmit={(e) => { e.preventDefault(); void run(companyId, () => post(mtPath(companyId, `/meters/${m.id}/readings`), { value: Number(v.value), reset: v.reset || undefined, today: localToday() }), (r) => (r.generated.length ? `Reading saved; preventive work order ${r.generated.map((g: any) => g.number).join(', ')} made` : 'Reading saved')).then((ok) => ok && setVals((x) => ({ ...x, [m.id]: { value: '', reset: false } }))); }}>
                    <label className="sr-only" htmlFor={`rd-${m.id}`}>New reading of {m.name}</label>
                    <input id={`rd-${m.id}`} className="input mt-qty" type="number" inputMode="decimal" step="any" placeholder="Reading" value={v.value} onChange={(e) => setVals((x) => ({ ...x, [m.id]: { ...v, value: e.target.value } }))} />
                    {m.rising ? <label className="checkbox small"><input type="checkbox" checked={v.reset} onChange={(e) => setVals((x) => ({ ...x, [m.id]: { ...v, reset: e.target.checked } }))} /> Reset or replaced</label> : null}
                    <button className="btn sm" disabled={v.value === ''}>Save</button>
                  </form>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : <p className="muted small">No meters or gauges. A meter (hours, kilometres, cycles) drives meter-based maintenance; a gauge (temperature, pressure) drives condition-based maintenance.</p>}
      {adding ? <AddMeter companyId={companyId} assetId={assetId} onClose={() => setAdding(false)} /> : null}
      {open ? <MeterReadings companyId={companyId} meter={open} canManage={canManage} onClose={() => setOpen(null)} /> : null}
    </Section>
  );
}

function AddMeter({ companyId, assetId, onClose }: { companyId: string; assetId: string; onClose: () => void }) {
  const run = useRun();
  const [f, setF] = useState({ name: '', unit: '', rising: 'meter', rollover: '', min: '', max: '' });
  const n = (v: string) => (v.trim() === '' ? null : Number(v));
  const save = async () => {
    if (await run(companyId, () => post(mtPath(companyId, '/meters'), { assetId, name: f.name.trim(), unit: f.unit, rising: f.rising === 'meter', rolloverValue: f.rising === 'meter' ? n(f.rollover) : null, expectedMin: n(f.min), expectedMax: n(f.max) }), 'Added')) onClose();
  };
  return (
    <Modal title="Add a meter or gauge" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={!f.name.trim()} onClick={save}>Add</button></>}>
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="mm-name">Name</label><input id="mm-name" className="input" maxLength={120} value={f.name} onChange={(e) => setF((x) => ({ ...x, name: e.target.value }))} placeholder="Hours, Odometer, Bearing temperature" /></div>
        <div className="field"><label htmlFor="mm-unit">Unit</label><input id="mm-unit" className="input" maxLength={20} value={f.unit} onChange={(e) => setF((x) => ({ ...x, unit: e.target.value }))} placeholder="h, km, C, bar" /></div>
        <div className="field"><label htmlFor="mm-kind">Kind</label><select id="mm-kind" className="select" value={f.rising} onChange={(e) => setF((x) => ({ ...x, rising: e.target.value }))}><option value="meter">Meter (only rises)</option><option value="gauge">Gauge (any value)</option></select></div>
        {f.rising === 'meter' ? <div className="field"><label htmlFor="mm-roll">Rolls over at (optional)</label><input id="mm-roll" className="input" type="number" min="0" step="any" value={f.rollover} onChange={(e) => setF((x) => ({ ...x, rollover: e.target.value }))} /></div> : null}
        <div className="field"><label htmlFor="mm-min">Expected minimum</label><input id="mm-min" className="input" type="number" step="any" value={f.min} onChange={(e) => setF((x) => ({ ...x, min: e.target.value }))} /></div>
        <div className="field"><label htmlFor="mm-max">Expected maximum</label><input id="mm-max" className="input" type="number" step="any" value={f.max} onChange={(e) => setF((x) => ({ ...x, max: e.target.value }))} /></div>
      </div>
      <p className="muted small">A meter refuses a lower reading unless it is marked as a reset. A reading outside the expected range is flagged, and can trigger condition-based maintenance.</p>
    </Modal>
  );
}

function MeterReadings({ companyId, meter, canManage, onClose }: { companyId: string; meter: Meter; canManage: boolean; onClose: () => void }) {
  const q = useQuery({ queryKey: ['mt', companyId, 'meter', meter.id], queryFn: () => get<{ readings: { id: string; value: number; delta: number | null; total: number | null; reset: boolean; outOfRange: boolean; source: string; workOrderId: string | null; workOrderNumber: string | null; readAt: number; enteredByName: string | null; note: string }[] }>(mtPath(companyId, `/meters/${meter.id}`)) });
  const run = useRun();
  return (
    <Modal wide title={`${meter.name}: readings`} onClose={onClose} footer={<>{canManage ? <button className="btn ghost" onClick={() => void run(companyId, () => patch(mtPath(companyId, `/meters/${meter.id}`), { archived: true }), 'Archived').then((ok) => ok && onClose())}>Archive this meter</button> : null}<button className="btn" onClick={onClose}>Close</button></>}>
      {!q.data ? <Loading /> : q.data.readings.length ? (
        <table className="data-table mt-table">
          <thead><tr><th>When</th><th>Reading</th>{meter.rising ? <th>Added</th> : null}<th>From</th></tr></thead>
          <tbody>
            {q.data.readings.map((r) => (
              <tr key={r.id}>
                <td data-label="When">{dateTimeText(r.readAt)}<div className="muted small">{r.enteredByName ?? ''}</div></td>
                <td data-label="Reading" className={`mt-num${r.outOfRange ? ' mt-overdue' : ''}`}>{r.value}{meter.unit ? ` ${meter.unit}` : ''}{r.reset ? ' (reset)' : ''}{r.outOfRange ? ' (outside the range)' : ''}</td>
                {meter.rising ? <td data-label="Added" className="mt-num">{r.delta ?? ''}</td> : null}
                <td data-label="From">{r.source === 'work_order' && r.workOrderId ? <Link to={mtPage(companyId, `/work-orders/${r.workOrderId}`)}>{r.workOrderNumber}</Link> : r.source === 'prestart' ? 'Prestart check' : 'Entered'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="muted">No readings yet.</p>}
    </Modal>
  );
}

export function PreventiveOfAsset({ companyId, assetId, schedules, canManage, archived }: { companyId: string; assetId: string; schedules: Schedule[]; canManage: boolean; archived: boolean }) {
  return (
    <Section title={`Preventive maintenance (${schedules.length})`} actions={canManage && !archived ? <Link className="btn sm" to={mtPage(companyId, `/preventive/new?assetId=${assetId}`)}><Icon name="plus" size={14} /> Schedule</Link> : null}>
      {schedules.length ? (
        <ul className="mt-docs">
          {schedules.map((s) => (
            <li key={s.id} className="row wrap">
              <Link className="mt-primary grow" to={mtPage(companyId, `/preventive/${s.id}`)}>{s.name}</Link>
              <span className="small muted">{triggerText(s)}</span>
              <span className="small">{nextDueText(s)}</span>
              {s.active ? null : <span className="badge">Paused</span>}
            </li>
          ))}
        </ul>
      ) : <p className="muted small">No preventive maintenance for this asset.</p>}
    </Section>
  );
}

export function PrestartOfAsset({ companyId, assetId, data, canManage, archived }: { companyId: string; assetId: string; data: AssetExtrasData; canManage: boolean; archived: boolean }) {
  const run = useRun();
  const templates = useQuery({ queryKey: ['mt', companyId, 'insp-templates'], queryFn: () => get<{ templates: { id: string; name: string }[] }>(mtPath(companyId, '/inspection-templates')), enabled: canManage });
  return (
    <Section title="Prestart checks" actions={data.prestartTemplate && !archived ? <Link className="btn sm primary" to={mtPage(companyId, `/prestart/${assetId}`)}><Icon name="checkSquare" size={14} /> Do a check</Link> : null}>
      {canManage ? (
        <div className="mt-add-line">
          <label className="sr-only" htmlFor="as-prestart">Prestart checklist</label>
          <select id="as-prestart" className="select" value={data.prestartTemplate?.id ?? ''} onChange={(e) => void run(companyId, () => put(mtPath(companyId, `/assets/${assetId}/prestart`), { templateId: e.target.value || null }), 'Prestart checklist saved')}>
            <option value="">No prestart checklist</option>
            {(templates.data?.templates ?? []).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      ) : <p className="small">{data.prestartTemplate ? `Checklist: ${data.prestartTemplate.name}` : 'No prestart checklist.'}</p>}
      {data.prestarts.length ? (
        <ul className="mt-docs small">
          {data.prestarts.map((p) => (
            <li key={p.id} className="row wrap">
              <span className={`badge ${p.result === 'failed' ? 'danger' : 'success'}`}>{p.result === 'failed' ? `Failed (${p.failedItems})` : 'Passed'}</span>
              <span className="grow">{p.performedByName ?? ''} · {dateTimeText(p.performedAt)}</span>
              {p.setOutOfService ? <span className="mt-overdue">Set out of service</span> : null}
            </li>
          ))}
        </ul>
      ) : <p className="muted small">No checks yet.</p>}
    </Section>
  );
}
