// Screens for the field (stage M3), made for a phone: scan or type an asset's code to open it, do its prestart check or
// report a fault; the prestart check itself (large pass and fail buttons, an optional meter reading); and a sheet of QR
// labels to print. The camera is used only where the browser can read codes (BarcodeDetector) and the person allows it;
// typing the code always works.
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { ErrorBox, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { ASSET_STATUS_LABELS, dateTimeText, localToday, mtPage, mtPath, requestKey, useSites, type Asset, type InspItem, type MtMe } from './api';
import { AssetStatusBadge, Section } from './common';
import { AssetPicker, type PickedAsset } from './pickers';

interface Detector {
  detect(source: CanvasImageSource): Promise<{ rawValue: string }[]>;
}

function CameraReader({ onCode, onClose }: { onCode: (code: string) => void; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let stream: MediaStream | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;
    let stopped = false;
    (async () => {
      try {
        const Ctor = (window as unknown as { BarcodeDetector?: new (o: { formats: string[] }) => Detector }).BarcodeDetector!;
        const detector = new Ctor({ formats: ['qr_code', 'code_128', 'code_39', 'ean_13'] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        if (stopped || !video.current) return;
        video.current.srcObject = stream;
        await video.current.play();
        timer = setInterval(async () => {
          if (!video.current || video.current.readyState < 2) return;
          try {
            const found = await detector.detect(video.current);
            if (found[0]?.rawValue) {
              stopped = true;
              onCode(found[0].rawValue);
            }
          } catch {
            // a frame that cannot be read: try the next one
          }
        }, 350);
      } catch {
        setError('The camera is not available here. Type the code instead.');
      }
    })();
    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [onCode]);
  return (
    <div className="card card-pad stack">
      {error ? <p className="warn-box small">{error}</p> : <video ref={video} className="mt-camera" muted playsInline aria-label="Camera view: point it at the asset's label" />}
      <button className="btn" onClick={onClose}>Close the camera</button>
    </div>
  );
}

interface Scanned {
  asset: { id: string; number: string; name: string; status: string; criticality: string; archived: boolean; location: string };
  prestart: { templateId: string; name: string } | null;
  openWorkOrders: number;
}

function CodeField({ companyId, onFound }: { companyId: string; onFound: (s: Scanned) => void }) {
  const [code, setCode] = useState('');
  const [camera, setCamera] = useState(false);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const canCamera = typeof window !== 'undefined' && 'BarcodeDetector' in window && !!navigator.mediaDevices?.getUserMedia;
  const look = async (value: string) => {
    const v = value.trim();
    if (!v) return;
    setBusy(true);
    try {
      onFound(await get<Scanned>(mtPath(companyId, `/scan?code=${encodeURIComponent(v)}`)));
      setCode('');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack">
      <form className="mt-scan-row" onSubmit={(e) => { e.preventDefault(); void look(code); }}>
        <div className="field grow">
          <label htmlFor="mt-code">Asset code</label>
          <input id="mt-code" className="input mt-scan-input" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="characters" enterKeyHint="go" placeholder="Label, asset number, serial or registration" />
        </div>
        <button className="btn primary" type="submit" disabled={busy || !code.trim()}>Find</button>
        {canCamera ? <button type="button" className="btn" onClick={() => setCamera(true)}><Icon name="eye" /> Scan</button> : null}
      </form>
      {camera ? <CameraReader onClose={() => setCamera(false)} onCode={(c) => { setCamera(false); void look(c); }} /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ scan

export function ScanPage({ companyId, me }: { companyId: string; me: MtMe }) {
  usePageTitle('Scan an asset');
  const [found, setFound] = useState<Scanned | null>(null);
  return (
    <div className="stack mt-phone">
      <Section title="Scan or type a code">
        <CodeField companyId={companyId} onFound={setFound} />
        <p className="muted small">Asset labels carry a QR code with the asset number. You can also type the number, the serial number or the registration.</p>
      </Section>
      {found ? (
        <section className="card card-pad stack" aria-label="The asset">
          <div className="row wrap">
            <strong className="grow">{found.asset.number} {found.asset.name}</strong>
            <AssetStatusBadge value={found.asset.status} />
          </div>
          {found.asset.location ? <p className="muted small">{found.asset.location}</p> : null}
          {found.openWorkOrders ? <p className="small">{found.openWorkOrders} open {found.openWorkOrders === 1 ? 'work order' : 'work orders'}{me.can.manageWork ? '' : ' you can see'}.</p> : null}
          <div className="mt-big-actions">
            {found.prestart && !found.asset.archived ? <Link className="btn primary" to={mtPage(companyId, `/prestart/${found.asset.id}`)}><Icon name="checkSquare" /> Prestart check</Link> : null}
            {!found.asset.archived ? <Link className="btn" to={mtPage(companyId, `/requests/new?assetId=${found.asset.id}`)}><Icon name="alert" /> Report a fault</Link> : null}
            <Link className="btn" to={mtPage(companyId, `/assets/${found.asset.id}`)}><Icon name="layers" /> Open the asset</Link>
          </div>
          {!found.prestart ? <p className="muted small">This asset has no prestart checklist yet. A supervisor sets one on the asset’s page.</p> : null}
        </section>
      ) : null}
    </div>
  );
}

// ------------------------------------------------------------------ prestart

interface PrestartForm {
  asset: { id: string; number: string; name: string; status: string; archived: boolean };
  template: { id: string; name: string; items: InspItem[] } | null;
  meters: { id: string; name: string; unit: string; rising: boolean; lastValue: number | null }[];
  last: { id: string; result: string; performedAt: number; performedByName: string | null } | null;
}

interface Answer {
  passed?: boolean;
  value?: string;
  text?: string;
  note?: string;
}

export function PrestartPage({ companyId, me }: { companyId: string; me: MtMe }) {
  const { assetId = '' } = useParams();
  usePageTitle('Prestart check');
  const navigate = useNavigate();
  const [picked, setPicked] = useState<PickedAsset | null>(null);
  const recent = useQuery({ queryKey: ['mt', companyId, 'prestarts'], queryFn: () => get<{ prestarts: any[] }>(mtPath(companyId, '/prestarts')), enabled: !assetId });
  if (assetId) return <PrestartCheck companyId={companyId} assetId={assetId} me={me} />;
  return (
    <div className="stack mt-phone">
      <Section title="Which asset?">
        <CodeField companyId={companyId} onFound={(s) => navigate(mtPage(companyId, `/prestart/${s.asset.id}`))} />
        <AssetPicker companyId={companyId} id="ps-asset" label="Or choose it" value={picked} onChange={(a) => { setPicked(a); if (a) navigate(mtPage(companyId, `/prestart/${a.id}`)); }} />
      </Section>
      <Section title="Recent prestart checks">
        {!recent.data ? <Loading /> : recent.data.prestarts.length ? (
          <ul className="mt-docs">
            {recent.data.prestarts.slice(0, 20).map((p) => (
              <li key={p.id} className="row wrap">
                <span className={`badge ${p.result === 'failed' ? 'danger' : 'success'}`}>{p.result === 'failed' ? 'Failed' : 'Passed'}</span>
                <Link className="grow" to={mtPage(companyId, `/assets/${p.assetId}`)}>{p.assetNumber} {p.assetName}</Link>
                <span className="muted small">{p.performedByName} · {dateTimeText(p.performedAt)}</span>
                {p.requestId ? <Link className="small" to={mtPage(companyId, `/requests/${p.requestId}`)}>{p.requestNumber}</Link> : null}
              </li>
            ))}
          </ul>
        ) : <p className="muted small">None yet.</p>}
      </Section>
    </div>
  );
}

function PrestartCheck({ companyId, assetId }: { companyId: string; assetId: string; me: MtMe }) {
  const toast = useToast();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ['mt', companyId, 'prestart-form', assetId], queryFn: () => get<PrestartForm>(mtPath(companyId, `/assets/${assetId}/prestart`)), retry: false });
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [reading, setReading] = useState({ meterId: '', value: '' });
  const [notes, setNotes] = useState('');
  const [key] = useState(requestKey);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ prestart: any; request: { id: string; number: string } | null; outOfService: boolean } | null>(null);
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { asset, template, meters } = q.data;
  const set = (id: string, a: Answer) => setAnswers((x) => ({ ...x, [id]: { ...x[id], ...a } }));
  if (done) {
    return (
      <div className="stack mt-phone">
        <section className={`card card-pad stack mt-result ${done.prestart.result === 'failed' ? 'failed' : 'passed'}`} aria-live="polite">
          <h2 className="crm-subhead">{done.prestart.result === 'failed' ? 'Prestart check failed' : 'Prestart check passed'}</h2>
          <p>{asset.number} {asset.name}: {done.prestart.result === 'failed' ? `${done.prestart.failedItems} ${done.prestart.failedItems === 1 ? 'item' : 'items'} failed.` : 'every item passed.'}</p>
          {done.outOfService ? <p className="warn-box"><strong>The asset is now out of service</strong> because a critical item failed. Do not use it until a supervisor puts it back in service.</p> : null}
          {done.request ? <p>Request <Link to={mtPage(companyId, `/requests/${done.request.id}`)}>{done.request.number}</Link> was raised for the failure.</p> : null}
          <div className="mt-big-actions">
            <Link className="btn primary" to={mtPage(companyId, '/prestart')}>Another check</Link>
            <Link className="btn" to={mtPage(companyId, `/assets/${asset.id}`)}>Open the asset</Link>
          </div>
        </section>
      </div>
    );
  }
  if (!template) {
    return (
      <div className="stack mt-phone">
        <Section title={`${asset.number} ${asset.name}`}>
          <p>This asset has no prestart checklist yet. A supervisor sets one on the asset’s page.</p>
          <Link className="btn" to={mtPage(companyId, `/requests/new?assetId=${asset.id}`)}><Icon name="alert" /> Report a fault instead</Link>
        </Section>
      </div>
    );
  }
  const missing = template.items.filter((i) => i.required && i.kind !== 'text' && (i.kind === 'pass_fail' ? answers[i.id]?.passed === undefined : !(answers[i.id]?.value ?? '').trim()));
  const submit = async () => {
    setBusy(true);
    try {
      const results = template.items
        .map((i) => {
          const a = answers[i.id] ?? {};
          if (i.kind === 'pass_fail') return a.passed === undefined ? null : { itemId: i.id, passed: a.passed, note: a.note };
          if (i.kind === 'number') return (a.value ?? '').trim() === '' ? null : { itemId: i.id, value: Number(a.value), note: a.note };
          return (a.text ?? '').trim() ? { itemId: i.id, text: a.text } : null;
        })
        .filter(Boolean);
      const r = await post<any>(mtPath(companyId, '/prestarts'), { assetId: asset.id, templateId: template.id, results, notes: notes || undefined, reading: reading.meterId && reading.value !== '' ? { meterId: reading.meterId, value: Number(reading.value) } : null, requestKey: key, today: localToday() });
      setDone(r);
      await qc.invalidateQueries({ queryKey: ['mt', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack mt-phone">
      <section className="card card-pad stack">
        <div className="row wrap">
          <h2 className="crm-subhead grow">{asset.number} {asset.name}</h2>
          <AssetStatusBadge value={asset.status} />
        </div>
        <p className="muted small">{template.name}. A failed item raises a request; a failed critical item also sets the asset out of service.{q.data.last ? ` Last check: ${q.data.last.result === 'failed' ? 'failed' : 'passed'}, ${dateTimeText(q.data.last.performedAt)}.` : ''}</p>
        {asset.status === 'out_of_service' ? <p className="warn-box small">This asset is {ASSET_STATUS_LABELS.out_of_service.toLowerCase()}.</p> : null}
      </section>
      <ol className="mt-check">
        {template.items.map((i, n) => {
          const a = answers[i.id] ?? {};
          return (
            <li key={i.id} className={`card card-pad mt-check-item${a.passed === false ? ' failed' : a.passed ? ' passed' : ''}`}>
              <div className="mt-check-label">
                <span className="mt-num muted">{n + 1}.</span> {i.label}
                {i.critical ? <span className="badge danger">Critical</span> : null}
                {!i.required ? <span className="muted small"> (optional)</span> : null}
              </div>
              {i.kind === 'pass_fail' ? (
                <div className="mt-passfail" role="group" aria-label={i.label}>
                  <button type="button" className={`btn${a.passed === true ? ' primary' : ''}`} aria-pressed={a.passed === true} onClick={() => set(i.id, { passed: true })}><Icon name="check" /> Pass</button>
                  <button type="button" className={`btn${a.passed === false ? ' danger' : ''}`} aria-pressed={a.passed === false} onClick={() => set(i.id, { passed: false })}><Icon name="x" /> Fail</button>
                </div>
              ) : i.kind === 'number' ? (
                <div className="field">
                  <label htmlFor={`ps-${i.id}`}>{i.unit ? `Value (${i.unit})` : 'Value'}{i.min != null || i.max != null ? `, ${i.min ?? '…'} to ${i.max ?? '…'}` : ''}</label>
                  <input id={`ps-${i.id}`} className="input" type="number" inputMode="decimal" step="any" value={a.value ?? ''} onChange={(e) => set(i.id, { value: e.target.value })} />
                </div>
              ) : (
                <div className="field">
                  <label htmlFor={`ps-${i.id}`}>Notes</label>
                  <input id={`ps-${i.id}`} className="input" maxLength={2000} value={a.text ?? ''} onChange={(e) => set(i.id, { text: e.target.value })} />
                </div>
              )}
              {a.passed === false ? (
                <div className="field">
                  <label htmlFor={`ps-n-${i.id}`}>What is wrong?</label>
                  <input id={`ps-n-${i.id}`} className="input" maxLength={1000} value={a.note ?? ''} onChange={(e) => set(i.id, { note: e.target.value })} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <section className="card card-pad stack">
        {meters.length ? (
          <div className="mt-reading-row">
            <div className="field"><label htmlFor="ps-meter">Meter reading (optional)</label><select id="ps-meter" className="select" value={reading.meterId} onChange={(e) => setReading((x) => ({ ...x, meterId: e.target.value }))}><option value="">None</option>{meters.map((m) => <option key={m.id} value={m.id}>{m.name}{m.lastValue != null ? ` (last ${m.lastValue}${m.unit ? ` ${m.unit}` : ''})` : ''}</option>)}</select></div>
            <div className="field"><label htmlFor="ps-value">Reading</label><input id="ps-value" className="input" type="number" inputMode="decimal" step="any" value={reading.value} disabled={!reading.meterId} onChange={(e) => setReading((x) => ({ ...x, value: e.target.value }))} /></div>
          </div>
        ) : null}
        <div className="field"><label htmlFor="ps-notes">Notes (optional)</label><textarea id="ps-notes" className="textarea" rows={2} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        {missing.length ? <p className="muted small">Still to check: {missing.map((m) => m.label).join(', ')}.</p> : null}
        <div className="mt-big-actions">
          <button className="btn primary" disabled={busy || missing.length > 0} onClick={submit}>{busy ? 'Sending…' : 'Send the check'}</button>
        </div>
      </section>
    </div>
  );
}

// ------------------------------------------------------------------ QR labels

export function LabelsPage({ companyId }: { companyId: string; me: MtMe }) {
  usePageTitle('Asset labels');
  const [params, setParams] = useSearchParams();
  const site = params.get('siteId') ?? '';
  const ids = (params.get('ids') ?? '').split(',').filter(Boolean);
  const sites = useSites(companyId);
  const list = useQuery({ queryKey: ['mt', companyId, 'labels', site], queryFn: () => get<{ assets: Asset[] }>(mtPath(companyId, `/assets?limit=500${site ? `&siteId=${site}` : ''}`)) });
  const assets = (list.data?.assets ?? []).filter((a) => !ids.length || ids.includes(a.id));
  return (
    <div className="stack">
      <div className="row wrap mt-no-print">
        <div className="field">
          <label htmlFor="lb-site">Site</label>
          <select id="lb-site" className="select" value={site} onChange={(e) => setParams((p) => { const n = new URLSearchParams(p); if (e.target.value) n.set('siteId', e.target.value); else n.delete('siteId'); n.delete('ids'); return n; })}>
            <option value="">All sites</option>
            {(sites.data?.sites ?? []).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}
          </select>
        </div>
        <span className="grow" />
        <button className="btn primary" onClick={() => window.print()}><Icon name="download" /> Print labels</button>
      </div>
      <p className="muted small mt-no-print">Each label’s QR code holds ASSET: and the asset number. Scan it on the Scan screen, or with the phone’s camera on that screen where the browser can read codes.</p>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : !list.data ? <Loading /> : (
        <div className="mt-labels">
          {assets.map((a) => (
            <figure key={a.id} className="mt-label">
              <img src={appUrl(`/api${mtPath(companyId, `/assets/${a.id}/qr`)}`)} alt={`QR code of ${a.number}`} loading="lazy" />
              <figcaption><strong>{a.number}</strong><span className="small">{a.name}</span></figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
