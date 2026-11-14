// Screens built for phones first: stock scanning, the shop floor, notifications and quick record access. They work on
// a desktop too.
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../components/ui/overlays';
import * as OP from '../data/operations';
import { PIcon } from '../icons';
import { Facts, Panel, StatusBadge, Tabs } from '../kit';
import { hrefFor, RecLink } from '../links';
import { PageHeader, useVisit } from '../shell/PageHeader';
import { NoticeList } from '../shell/Notifications';
import { useErp } from '../state';
import type { NavPage } from '../types';
import { ModulePage } from './common';

// ------------------------------------------------------------------ scan

function lookup(code: string) {
  const c = code.trim().toUpperCase();
  if (!c) return null;
  const st = OP.stock.find((s) => s.item === c || s.bin === c || s.id === c);
  if (st) return { kind: 'stock' as const, st };
  const href = hrefFor(c);
  if (href) return { kind: 'record' as const, id: c, href };
  return { kind: 'none' as const, code: c };
}

export function Scan({ page }: { page: NavPage }) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<ReturnType<typeof lookup>>(null);
  const [scanning, setScanning] = useState(false);
  const toast = useToast();
  const run = (c: string) => {
    setCode(c);
    setResult(lookup(c));
  };
  return (
    <ModulePage page={page} subtitle="Scan a barcode or type a code: an item, a bin or a document number.">
      <div className="erp-scan">
        <div className="erp-camera" role="img" aria-label="Camera preview placeholder">
          <div className="erp-camera-frame" aria-hidden>
            <PIcon name="scan" size={44} />
          </div>
          <span>{scanning ? 'Looking for a barcode…' : 'Camera preview (placeholder: the prototype does not use the camera)'}</span>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setScanning(true);
              setTimeout(() => {
                setScanning(false);
                run('RM-2001');
                toast('Scanned RM-2001 (simulated).');
              }, 600);
            }}
          >
            <PIcon name="camera" /> Simulate a scan
          </button>
        </div>
        <form
          className="erp-scan-form"
          onSubmit={(e) => {
            e.preventDefault();
            run(code);
          }}
        >
          <label htmlFor="scan-code" className="label">
            Or type the code
          </label>
          <div className="row">
            <input id="scan-code" className="input erp-scan-input" inputMode="text" autoCapitalize="characters" placeholder="For example RM-2001, A-01-02 or GR-0215" value={code} onChange={(e) => setCode(e.target.value)} />
            <button type="submit" className="btn primary">
              Look up
            </button>
          </div>
        </form>
        <div aria-live="polite">
          {result?.kind === 'stock' ? (
            <section className="card erp-scan-result" aria-label="Scan result">
              <div className="erp-card-top">
                <span className="erp-id">{result.st.item}</span>
                <StatusBadge status={result.st.status} />
              </div>
              <h2>{result.st.name}</h2>
              <Facts
                columns={2}
                items={[
                  ['On hand', `${result.st.onHand} ${result.st.uom}`],
                  ['Available', `${result.st.available} ${result.st.uom}`],
                  ['Bin', `${result.st.warehouse} ${result.st.bin}`],
                  ['Reorder point', String(result.st.reorder)],
                ]}
              />
              <div className="erp-scan-actions">
                <button type="button" className="btn lg" onClick={() => toast(`Move ${result.st.item}: choose the new bin (prototype).`)}>
                  <PIcon name="refresh" /> Move
                </button>
                <button type="button" className="btn lg" onClick={() => toast(`Count of ${result.st.item} in ${result.st.bin} started (prototype).`)}>
                  <PIcon name="listOrdered" /> Count
                </button>
                <Link className="btn lg primary" to={`/inventory/stock/${result.st.id}`}>
                  Open record
                </Link>
              </div>
            </section>
          ) : result?.kind === 'record' ? (
            <section className="card erp-scan-result" aria-label="Scan result">
              <p>
                Document <strong>{result.id}</strong> found.
              </p>
              <Link className="btn lg primary" to={result.href}>
                Open {result.id}
              </Link>
            </section>
          ) : result?.kind === 'none' ? (
            <div className="erp-alert warning" role="alert">
              <PIcon name="alert" />
              <div>
                <strong>Nothing found for {result.code}.</strong>
                <p>Check the code and try again, or search everything with the search box.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ shop floor

export function ShopFloor({ page }: { page: NavPage }) {
  const [params] = useSearchParams();
  const toast = useToast();
  const open = OP.workOrders.filter((w) => ['In progress', 'Delayed', 'Released'].includes(w.status));
  const [wo, setWo] = useState(params.get('wo') ?? 'WO-1042');
  const [state, setState] = useState<'Waiting' | 'Running' | 'Paused' | 'Done'>('Waiting');
  const [good, setGood] = useState('1');
  const [scrap, setScrap] = useState('0');
  const w = open.find((x) => x.id === wo) ?? open[0];
  const ops = w.id === 'WO-1042' ? OP.WO1042_OPS : OP.OPERATIONS_1001.map((o, i) => ({ ...o, status: i < 2 ? 'Completed' : 'Waiting', planned: o.setup + o.run, actual: 0, who: '' }));
  const current = ops.find((o) => o.status !== 'Completed') ?? ops[ops.length - 1];
  return (
    <ModulePage page={page} subtitle="For operators at the work centre, on a tablet or phone.">
      <div className="erp-shop">
        <div className="field">
          <label htmlFor="sf-wo">Work order</label>
          <select id="sf-wo" className="select" value={w.id} onChange={(e) => { setWo(e.target.value); setState('Waiting'); }}>
            {open.map((x) => (
              <option key={x.id} value={x.id}>
                {x.id} · {x.itemName} × {x.qty}
              </option>
            ))}
          </select>
        </div>
        <section className="card erp-shop-op" aria-labelledby="sf-op">
          <span className="muted small">Operation {current.op} at {OP.workCentres.find((c) => c.id === current.centre)?.name}</span>
          <h2 id="sf-op">{current.name}</h2>
          <div className="row wrap">
            <StatusBadge status={state === 'Waiting' ? current.status : state === 'Running' ? 'In progress' : state === 'Paused' ? 'On hold' : 'Completed'} />
            <span className="muted small">Planned {current.planned} h</span>
          </div>
          {w.id === 'WO-1042' ? <p className="erp-flag warning small">Rework of joint W7 after inspection INS-0533. Grind out the undercut and re-weld to procedure WPS-07.</p> : null}
          <div className="erp-shop-buttons">
            <button type="button" className="btn lg primary" disabled={state === 'Running' || state === 'Done'} onClick={() => { setState('Running'); toast(`Started operation ${current.op}.`); }}>
              <PIcon name="play" /> Start
            </button>
            <button type="button" className="btn lg" disabled={state !== 'Running'} onClick={() => { setState('Paused'); toast('Paused.'); }}>
              <PIcon name="stop" /> Pause
            </button>
          </div>
          <div className="erp-form-grid">
            <div className="field">
              <label htmlFor="sf-good">Good quantity</label>
              <input id="sf-good" className="input" inputMode="numeric" value={good} onChange={(e) => setGood(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="sf-scrap">Scrap quantity</label>
              <input id="sf-scrap" className="input" inputMode="numeric" value={scrap} onChange={(e) => setScrap(e.target.value)} />
            </div>
          </div>
          <div className="erp-shop-buttons">
            <button type="button" className="btn lg primary" disabled={state === 'Done'} onClick={() => { setState('Done'); toast(`Operation ${current.op} completed: ${good} good, ${scrap} scrap.`); }}>
              <PIcon name="check" /> Complete operation
            </button>
            <Link to="/maintenance/requests/new" className="btn lg">
              <PIcon name="alert" /> Report a problem
            </Link>
          </div>
        </section>
        <Panel title="All operations">
          <ol className="erp-plain-list">
            {ops.map((o) => (
              <li key={o.op}>
                {o.op} {o.name} <StatusBadge status={o === current && state === 'Done' ? 'Completed' : o.status} />
              </li>
            ))}
          </ol>
          <Link to={`/manufacturing/work-orders/${w.id}`}>Open {w.id}</Link>
        </Panel>
      </div>
    </ModulePage>
  );
}

// ------------------------------------------------------------------ notifications and quick access

export function NotificationsPage() {
  const { notices, markRead } = useErp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  useVisit('/notifications', 'Notifications');
  const unread = notices.filter((n) => !n.read).length;
  return (
    <div className="erp-page erp-narrow">
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Notifications' }]}
        title="Notifications"
        states={['C']}
        actions={
          <button type="button" className="btn" disabled={!unread} onClick={() => markRead()}>
            Mark all as read
          </button>
        }
      />
      <Tabs tabs={[{ id: 'all', label: 'All', count: notices.length }, { id: 'unread', label: 'Unread', count: unread }]} active={tab} onChange={setTab} label="Notification filter" />
      <div role="tabpanel">
        <NoticeList
          items={tab === 'unread' ? notices.filter((n) => !n.read) : notices}
          onOpen={(n) => {
            markRead(n.id);
            navigate(n.to);
          }}
        />
      </div>
    </div>
  );
}

export function QuickAccess() {
  const { favourites, recent, openSearch } = useErp();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  useVisit('/quick', 'Quick access');
  return (
    <div className="erp-page erp-narrow">
      <PageHeader crumbs={[{ label: 'Home', to: '/' }, { label: 'Quick access' }]} title="Quick access" states={['C']} subtitle="Open a record by its number, or pick one you used lately." />
      <form
        className="erp-quick-form"
        onSubmit={(e) => {
          e.preventDefault();
          const href = hrefFor(code.trim().toUpperCase());
          if (href) navigate(href);
          else setError('No record has that number. Check it, or search everything.');
        }}
      >
        <label htmlFor="quick-code" className="label">
          Record number
        </label>
        <div className="row">
          <input id="quick-code" className="input erp-scan-input" placeholder="For example WO-1042" value={code} onChange={(e) => { setCode(e.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'quick-error' : undefined} autoCapitalize="characters" />
          <button type="submit" className="btn primary lg">
            Open
          </button>
        </div>
        {error ? (
          <p id="quick-error" className="error small" role="alert">
            {error}
          </p>
        ) : null}
      </form>
      <div className="erp-quick-buttons">
        <Link to="/inventory/scan" className="btn lg">
          <PIcon name="scan" /> Scan
        </Link>
        <button type="button" className="btn lg" onClick={() => openSearch()}>
          <PIcon name="search" /> Search everything
        </button>
      </div>
      <Panel title="Recent">
        {recent.length ? (
          <ul className="erp-quick-list">
            {recent.map((r) => (
              <li key={r.path}>
                <Link to={r.path}>
                  <PIcon name="clock" size={14} /> {r.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted small">Pages you open appear here.</p>
        )}
      </Panel>
      <Panel title="Favourites">
        <ul className="erp-quick-list">
          {favourites.map((r) => (
            <li key={r.path}>
              <Link to={r.path}>
                <PIcon name="star" filled size={14} /> {r.label}
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
      <p className="muted small">
        Examples: <RecLink id="SO-1048" />, <RecLink id="PO-0388" />, <RecLink id="INS-0533" />.
      </p>
    </div>
  );
}

