// BIZOMAT ERP, Release 2: the warehouse screen, made for a phone: receive against a purchase order, issue (pick), move
// and count, by typing or scanning location and product codes. The camera is used only where the browser can read
// codes itself (BarcodeDetector) and the person allows it; typing always works. Each submission carries its own key, so
// a double tap or a retry on a poor connection is done once.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { erpPath, inventoryPage, procurementPage, qty, supplyPage, type ErpMe, type Location, type PoLine, type PurchaseOrder, type StockRow } from './api';

type Mode = 'receive' | 'issue' | 'move' | 'count';
const MODES: { value: Mode; label: string; needs: 'receiving.post' | 'inventory.operate' }[] = [
  { value: 'receive', label: 'Receive', needs: 'receiving.post' },
  { value: 'issue', label: 'Issue', needs: 'inventory.operate' },
  { value: 'move', label: 'Move', needs: 'inventory.operate' },
  { value: 'count', label: 'Count', needs: 'inventory.operate' },
];

interface Scanned {
  type: 'location' | 'product';
  location?: Location;
  product?: { id: string; number: string; name: string; uom: string };
}

const key = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

interface Detector {
  detect(source: CanvasImageSource): Promise<{ rawValue: string }[]>;
}

/** Reads codes with the camera where the browser can (BarcodeDetector). */
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
        const detector = new Ctor({ formats: ['qr_code', 'code_128', 'ean_13', 'ean_8', 'code_39'] });
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
    <div className="card card-pad stack erp-camera">
      {error ? <p className="warn-box small">{error}</p> : <video ref={video} className="erp-camera-video" muted playsInline aria-label="Camera view: point it at a code" />}
      <button className="btn" onClick={onClose}>Close the camera</button>
    </div>
  );
}

/** A code field: type it and press Enter, or scan it with the camera where the browser can. */
function CodeField({ id, label, onScanned, companyId, hint }: { id: string; label: string; onScanned: (s: Scanned) => void; companyId: string; hint?: string }) {
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
      const r = await get<Scanned>(erpPath(companyId, `/scan?code=${encodeURIComponent(v)}`));
      onScanned(r);
      setCode('');
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack">
      <form className="row erp-scan-row" onSubmit={(e) => { e.preventDefault(); void look(code); }}>
        <div className="field grow">
          <label htmlFor={id}>{label}</label>
          <input id={id} className="input erp-scan-input" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="characters" enterKeyHint="go" placeholder={hint ?? 'Type or scan a code'} />
        </div>
        <button className="btn primary" type="submit" disabled={busy || !code.trim()}>Find</button>
        {canCamera ? <button type="button" className="btn" onClick={() => setCamera(true)} aria-label={`Scan ${label.toLowerCase()} with the camera`}><Icon name="eye" /> Scan</button> : null}
      </form>
      {camera ? <CameraReader onCode={(c) => { setCamera(false); void look(c); }} onClose={() => setCamera(false)} /> : null}
    </div>
  );
}

export function WarehouseScreen({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Warehouse screen');
  const allowed = MODES.filter((m) => me.can[m.needs]);
  const [mode, setMode] = useState<Mode>(allowed[0]?.value ?? 'issue');
  if (!allowed.length) return <p className="muted">Your ERP roles do not include warehouse work. A warehouse manager or operator receives, issues, moves and counts stock.</p>;
  return (
    <div className="stack erp-warehouse">
      <div className="row erp-modes" role="tablist" aria-label="What to do">
        {allowed.map((m) => (
          <button key={m.value} role="tab" aria-selected={mode === m.value} className={`btn${mode === m.value ? ' primary' : ''}`} onClick={() => setMode(m.value)}>{m.label}</button>
        ))}
      </div>
      {mode === 'receive' ? <ReceiveMode companyId={companyId} /> : mode === 'count' ? <CountMode companyId={companyId} /> : <MoveMode key={mode} companyId={companyId} mode={mode} />}
      {/* Release 5: customer shipments are picked, packed and dispatched from their own phone screens */}
      {me.can['shipping.pick'] || me.can['shipping.dispatch'] ? <Link className="btn erp-big" to={supplyPage(companyId, '/floor')}><Icon name="globe" /> Pick and dispatch customer shipments</Link> : null}
      <p className="muted small">Codes: a location is WAREHOUSE/LOCATION (its QR label reads LOC:WAREHOUSE/LOCATION); a product is its number or SKU. <Link to={inventoryPage(companyId, '/warehouses')}>Print labels</Link> from a warehouse’s page.</p>
    </div>
  );
}

/** Issue or move: the location, then the product, then the lot or serial there, then the quantity (and where to). */
function MoveMode({ companyId, mode }: { companyId: string; mode: 'issue' | 'move' }) {
  const toast = useToast();
  const qc = useQueryClient();
  const [from, setFrom] = useState<Location | null>(null);
  const [product, setProduct] = useState<Scanned['product'] | null>(null);
  const [row, setRow] = useState<StockRow | null>(null);
  const [to, setTo] = useState<Location | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [requestKey, setRequestKey] = useState(key);
  const stock = useQuery({ queryKey: ['erp', companyId, 'product-stock', product?.id], queryFn: () => get<{ rows: StockRow[] }>(erpPath(companyId, `/products/${product!.id}/stock`)), enabled: !!product });
  const rows = (stock.data?.rows ?? []).filter((r) => !from || r.locationId === from.id);
  useEffect(() => {
    if (rows.length === 1 && !row) setRow(rows[0]);
  }, [rows, row]);
  const reset = () => {
    setProduct(null);
    setRow(null);
    setTo(null);
    setQuantity('1');
    setReference('');
    setRequestKey(key());
  };
  const scanned = (s: Scanned) => {
    if (s.type === 'location') {
      if (!from) setFrom(s.location!);
      else if (mode === 'move' && product) setTo(s.location!);
      else setFrom(s.location!);
    } else {
      setProduct(s.product!);
      setRow(null);
    }
  };
  const submit = async () => {
    if (!row) return;
    const q = Number(quantity);
    if (!(q > 0)) return toast('Use a quantity above zero', 'error');
    setBusy(true);
    try {
      await post(erpPath(companyId, `/stock/${mode === 'issue' ? 'issue' : 'transfer'}`), { productId: row.productId, locationId: row.locationId, lot: row.lot || undefined, serial: row.serial || undefined, quantity: q, toLocationId: mode === 'move' ? to?.id : undefined, reference: reference || undefined, requestKey });
      toast(mode === 'issue' ? `Issued ${qty(q)} of ${product!.number}` : `Moved ${qty(q)} of ${product!.number} to ${to!.fullCode}`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      reset();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="stack">
      <section className="card card-pad stack">
        <p className="erp-step"><strong>1.</strong> {from ? <>From <span className="mt-num">{from.fullCode}</span> <button className="btn ghost sm" onClick={() => { setFrom(null); reset(); }}>Change</button></> : 'Scan or type the location'}</p>
        <p className="erp-step"><strong>2.</strong> {product ? <><span className="mt-num">{product.number}</span> {product.name} <button className="btn ghost sm" onClick={reset}>Change</button></> : 'Scan or type the product'}</p>
        {!from || !product || (mode === 'move' && row && !to) ? <CodeField id="wh-code" companyId={companyId} label={!from ? 'Location' : !product ? 'Product' : 'Move to (location)'} onScanned={scanned} /> : null}
      </section>
      {product && from ? (
        <section className="card card-pad stack">
          {!stock.data ? <Loading /> : !rows.length ? <p className="warn-box small">No {product.number} at {from.fullCode}.</p> : (
            <fieldset className="erp-checks">
              <legend className="label">3. Which stock</legend>
              {rows.map((r) => (
                <label key={r.id} className="row erp-big-choice">
                  <input type="radio" name="wh-row" checked={row?.id === r.id} onChange={() => setRow(r)} /> {[r.lot ? `Lot ${r.lot}` : '', r.serial ? `Serial ${r.serial}` : '', r.expiry ? `expires ${r.expiry}` : ''].filter(Boolean).join(', ') || 'No lot or serial'}: {qty(r.available)} available
                </label>
              ))}
            </fieldset>
          )}
          {row ? (
            <>
              <div className="field"><label htmlFor="wh-q">Quantity</label><input id="wh-q" className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
              {mode === 'move' ? <p className="erp-step"><strong>4.</strong> {to ? <>To <span className="mt-num">{to.fullCode}</span></> : 'Scan or type where it goes (above)'}</p> : null}
              <div className="field"><label htmlFor="wh-ref">Reference (optional)</label><input id="wh-ref" className="input" value={reference} maxLength={200} onChange={(e) => setReference(e.target.value)} placeholder="Job or order" /></div>
              <button className="btn primary erp-big" disabled={busy || (mode === 'move' && !to)} onClick={() => void submit()}>{busy ? 'Saving…' : mode === 'issue' ? 'Issue' : 'Move'}</button>
            </>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

/** Receive against an open purchase order: one line at a time, into a scanned location. */
function ReceiveMode({ companyId }: { companyId: string }) {
  const toast = useToast();
  const qc = useQueryClient();
  const pos = useQuery({ queryKey: ['erp', companyId, 'pos', 'to_receive'], queryFn: () => get<{ purchaseOrders: PurchaseOrder[] }>(erpPath(companyId, '/purchase-orders?status=to_receive&limit=100')) });
  const [poId, setPoId] = useState('');
  const po = useQuery({ queryKey: ['erp', companyId, 'po', poId], queryFn: () => get<{ purchaseOrder: PurchaseOrder; lines: PoLine[] }>(erpPath(companyId, `/purchase-orders/${poId}`)), enabled: !!poId });
  const [lineId, setLineId] = useState('');
  const [loc, setLoc] = useState<Location | null>(null);
  const [f, setF] = useState({ received: '', lot: '', serials: '', expiry: '', deliveryRef: '' });
  const [busy, setBusy] = useState(false);
  const [requestKey, setRequestKey] = useState(key);
  const line = po.data?.lines.find((l) => l.id === lineId);
  const submit = async () => {
    if (!line) return;
    const received = Number(f.received || line.outstanding);
    setBusy(true);
    try {
      const r = await post<{ number: string; inspectionRequired: boolean }>(erpPath(companyId, `/purchase-orders/${poId}/receipts`), { requestKey, deliveryRef: f.deliveryRef, lines: [{ poLineId: line.id, received, locationId: loc?.id ?? null, lot: f.lot, serials: f.serials.split(/[\s,]+/).filter(Boolean), expiry: f.expiry || null }] });
      toast(`${r.number}: ${qty(received)} received${r.inspectionRequired ? ', inspection required' : ''}`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      setLineId('');
      setLoc(null);
      setF({ received: '', lot: '', serials: '', expiry: '', deliveryRef: f.deliveryRef });
      setRequestKey(key());
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  if (!pos.data) return <Loading />;
  if (!pos.data.purchaseOrders.length) return <p className="muted">No purchase orders are waiting to be received.</p>;
  return (
    <div className="stack">
      <section className="card card-pad stack">
        <div className="field"><label htmlFor="wr-po">Purchase order</label><select id="wr-po" className="select erp-scan-input" value={poId} onChange={(e) => { setPoId(e.target.value); setLineId(''); }}><option value="">Choose…</option>{pos.data.purchaseOrders.map((o) => <option key={o.id} value={o.id}>{o.number} {o.supplierName}</option>)}</select></div>
        {po.data ? (
          <fieldset className="erp-checks">
            <legend className="label">Line</legend>
            {po.data.lines.filter((l) => l.outstanding > 0).map((l) => (
              <label key={l.id} className="row erp-big-choice"><input type="radio" name="wr-line" checked={lineId === l.id} onChange={() => { setLineId(l.id); setF({ ...f, received: String(l.outstanding) }); }} /> {l.productNumber ? `${l.productNumber} ` : ''}{l.item}: {qty(l.outstanding)} {l.uom} to come</label>
            ))}
          </fieldset>
        ) : poId ? <Loading /> : null}
      </section>
      {line ? (
        <section className="card card-pad stack">
          {line.productId ? (loc ? <p className="erp-step">Into <span className="mt-num">{loc.fullCode}</span> <button className="btn ghost sm" onClick={() => setLoc(null)}>Change</button></p> : <CodeField id="wr-loc" companyId={companyId} label="Put away at (location)" hint="Leave empty for the product’s usual location" onScanned={(s) => (s.type === 'location' ? setLoc(s.location!) : toast('That is a product: scan the location', 'error'))} />) : null}
          <div className="field"><label htmlFor="wr-q">Quantity received</label><input id="wr-q" className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" value={f.received} onChange={(e) => setF({ ...f, received: e.target.value })} /></div>
          {line.productId ? <div className="field"><label htmlFor="wr-lot">Lot (if tracked)</label><input id="wr-lot" className="input" value={f.lot} onChange={(e) => setF({ ...f, lot: e.target.value })} /></div> : null}
          {line.productId ? <div className="field"><label htmlFor="wr-sn">Serial numbers (if tracked)</label><textarea id="wr-sn" className="textarea" rows={2} value={f.serials} onChange={(e) => setF({ ...f, serials: e.target.value })} /></div> : null}
          {line.productId ? <div className="field"><label htmlFor="wr-exp">Expiry (if tracked)</label><input id="wr-exp" className="input" type="date" value={f.expiry} onChange={(e) => setF({ ...f, expiry: e.target.value })} /></div> : null}
          <div className="field"><label htmlFor="wr-ref">Delivery reference</label><input id="wr-ref" className="input" value={f.deliveryRef} maxLength={200} onChange={(e) => setF({ ...f, deliveryRef: e.target.value })} /></div>
          <button className="btn primary erp-big" disabled={busy} onClick={() => void submit()}>{busy ? 'Saving…' : 'Receive'}</button>
          <p className="muted small">Damaged or rejected goods: receive from the <Link to={procurementPage(companyId, `/purchase-orders/${poId}`)}>order’s page</Link>, which records the reasons.</p>
        </section>
      ) : null}
    </div>
  );
}

/** Count: pick an open count, scan a location and a product, type what is there. */
function CountMode({ companyId }: { companyId: string }) {
  const toast = useToast();
  const qc = useQueryClient();
  const counts = useQuery({ queryKey: ['erp', companyId, 'counts', 'open'], queryFn: () => get<{ counts: { id: string; number: string; warehouseCode: string; kindLabel: string; counted: number; lines: number }[] }>(erpPath(companyId, '/counts?status=open')) });
  const [countId, setCountId] = useState('');
  const view = useQuery({ queryKey: ['erp', companyId, 'count', countId], queryFn: () => get<{ lines: { id: string; productId: string; productNumber: string; productName: string; locationId: string; locationCode: string; lot: string; serial: string; counted: number | null; uom: string }[] }>(erpPath(companyId, `/counts/${countId}`)), enabled: !!countId });
  const [loc, setLoc] = useState<Location | null>(null);
  const [productId, setProductId] = useState('');
  const [values, setValues] = useState<Record<string, string>>({});
  const lines = (view.data?.lines ?? []).filter((l) => (!loc || l.locationId === loc.id) && (!productId || l.productId === productId));
  const save = async () => {
    const changed = Object.entries(values).filter(([, v]) => v.trim() !== '');
    if (!changed.length) return;
    try {
      await put(erpPath(companyId, `/counts/${countId}/counted`), { lines: changed.map(([id, v]) => ({ id, counted: Number(v) })) });
      toast('Counts saved');
      setValues({});
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  if (!counts.data) return <Loading />;
  if (!counts.data.counts.length) return <p className="muted">No count is open. <Link to={inventoryPage(companyId, '/counts')}>Open one</Link> first.</p>;
  return (
    <div className="stack">
      <section className="card card-pad stack">
        <div className="field"><label htmlFor="wc-count">Count</label><select id="wc-count" className="select erp-scan-input" value={countId} onChange={(e) => setCountId(e.target.value)}><option value="">Choose…</option>{counts.data.counts.map((c) => <option key={c.id} value={c.id}>{c.number} {c.kindLabel} {c.warehouseCode} ({c.counted} of {c.lines})</option>)}</select></div>
        {countId ? <CodeField id="wc-code" companyId={companyId} label={loc ? 'Product (optional)' : 'Location'} onScanned={(s) => (s.type === 'location' ? (setLoc(s.location!), setProductId('')) : setProductId(s.product!.id))} /> : null}
        {loc ? <p className="erp-step">At <span className="mt-num">{loc.fullCode}</span> <button className="btn ghost sm" onClick={() => { setLoc(null); setProductId(''); }}>Change</button></p> : null}
      </section>
      {countId && view.data && loc ? (
        <section className="card card-pad stack">
          {!lines.length ? <p className="muted small">Nothing on the count here. Add found stock from the count’s page.</p> : lines.map((l) => (
            <div key={l.id} className="field">
              <label htmlFor={`wc-${l.id}`}><span className="mt-num">{l.productNumber}</span> {l.productName}{l.lot ? `, lot ${l.lot}` : ''}{l.serial ? `, serial ${l.serial}` : ''}</label>
              <input id={`wc-${l.id}`} className="input erp-scan-input" type="number" min="0" step="any" inputMode="decimal" placeholder={l.counted === null ? `How many ${l.uom}` : `Counted ${l.counted}`} value={values[l.id] ?? ''} onChange={(e) => setValues({ ...values, [l.id]: e.target.value })} />
            </div>
          ))}
          <button className="btn primary erp-big" onClick={() => void save()}>Save counts</button>
        </section>
      ) : null}
    </div>
  );
}
