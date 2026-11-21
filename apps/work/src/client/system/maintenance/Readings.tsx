// The Readings page (the field release; GET /meters?view=readings and POST /readings/batch in
// src/worker/maintenance/routes-meters.ts), made for a phone: every live meter and gauge the company has, narrowed by
// site, kind, how long since the last reading, a search, or a scanned asset and the assets under it. Type the readings
// in the rows, then send them together: each is saved on its own and shows its own result, so one refused reading
// never undoes the others. Anyone with access to maintenance may enter readings.
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, post } from '../../lib/api';
import { useDebounced, usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import { dateTimeText, localToMs, localToday, mtPage, mtPath, useSites, type Meter, type MtMe } from './api';
import { CodeField } from './Field';
import { useAssetLabel } from './pickers';

interface ReadingRow extends Meter {
  assetLocation: string;
  siteCode: string | null;
  siteName: string | null;
  lastOutOfRange: boolean;
}

interface Page {
  meters: ReadingRow[];
  total: number;
}

interface RowResult {
  meterId: string;
  ok: boolean;
  status?: number;
  error?: string;
  generated?: { number: string; workOrderId: string }[];
  /** Saved, but the preventive maintenance it may trigger is checked again by the scheduled run. */
  pmPending?: boolean;
}

const PAGE = 200;
const CHUNK = 50;
const DAY_MS = 86_400_000;

const withUnit = (v: number | null, unit: string) => (v === null || v === undefined ? '' : `${v}${unit ? ` ${unit}` : ''}`);

function readText(t: number | null) {
  if (!t) return 'Never';
  const days = Math.floor((Date.now() - t) / DAY_MS);
  return `${dateTimeText(t)} (${days <= 0 ? 'today' : days === 1 ? '1 day ago' : `${days} days ago`})`;
}

/** What to say about a value as it is typed: outside the expected range, or lower than the last reading of a meter. */
function hint(m: ReadingRow, raw: string, reset: boolean): string {
  if (raw.trim() === '' || !Number.isFinite(Number(raw))) return '';
  const v = Number(raw);
  const notes: string[] = [];
  if ((m.expectedMin !== null && v < m.expectedMin) || (m.expectedMax !== null && v > m.expectedMax)) notes.push(`Outside ${m.expectedMin ?? '…'} to ${m.expectedMax ?? '…'}`);
  if (m.rising && !reset && m.lastValue !== null && v < m.lastValue) notes.push('Lower than the last reading: tick Reset if the meter was reset or replaced');
  return notes.join('. ');
}

export function ReadingsPage({ companyId }: { companyId: string; me: MtMe }) {
  usePageTitle('Readings');
  const toast = useToast();
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) => setParams((p) => { const n = new URLSearchParams(p); if (v) n.set(k, v); else n.delete(k); return n; }, { replace: true });
  const sites = useSites(companyId);
  const term = useDebounced(g('q'), 300);
  const scoped = useAssetLabel(companyId, g('assetId'));
  const qs = new URLSearchParams({ view: 'readings' });
  if (g('siteId')) qs.set('siteId', g('siteId'));
  if (g('kind')) qs.set('kind', g('kind'));
  if (g('notRead')) qs.set('notReadForDays', g('notRead'));
  if (term.trim()) qs.set('q', term.trim());
  if (g('assetId')) {
    qs.set('assetId', g('assetId'));
    qs.set('includeChildren', '1');
  }
  const list = useInfiniteQuery({
    queryKey: ['mt', companyId, 'readings', qs.toString()],
    queryFn: ({ pageParam }) => get<Page>(mtPath(companyId, `/meters?${qs}&limit=${PAGE}&offset=${pageParam}`)),
    initialPageParam: 0,
    getNextPageParam: (last, all) => {
      const n = all.reduce((s, p) => s + p.meters.length, 0);
      return n < last.total ? n : undefined;
    },
  });
  const [entries, setEntries] = useState<Record<string, { value: string; reset: boolean }>>({});
  const [results, setResults] = useState<Record<string, RowResult>>({});
  const [takenAt, setTakenAt] = useState('');
  const [busy, setBusy] = useState(false);
  const rows = list.data?.pages.flatMap((p) => p.meters) ?? [];
  const total = list.data?.pages[0]?.total ?? 0;
  const entry = (id: string) => entries[id] ?? { value: '', reset: false };
  const setEntry = (id: string, e: Partial<{ value: string; reset: boolean }>) => setEntries((x) => ({ ...x, [id]: { ...entry(id), ...e } }));
  const ready = rows.filter((m) => entry(m.id).value.trim() !== '' && Number.isFinite(Number(entry(m.id).value)));
  const filters = ['siteId', 'kind', 'notRead', 'q'].filter((k) => g(k)).length;
  const send = async () => {
    setBusy(true);
    const readAt = localToMs(takenAt) ?? undefined;
    const all = ready.map((m) => ({ meterId: m.id, value: Number(entry(m.id).value), ...(m.rising && entry(m.id).reset ? { reset: true } : {}), ...(readAt ? { readAt } : {}) }));
    const got: RowResult[] = [];
    try {
      for (let i = 0; i < all.length; i += CHUNK) {
        const r = await post<{ saved: number; failed: number; results: RowResult[] }>(mtPath(companyId, '/readings/batch'), { entries: all.slice(i, i + CHUNK), today: localToday() });
        got.push(...r.results);
      }
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
    if (got.length) {
      setResults((x) => ({ ...x, ...Object.fromEntries(got.map((r) => [r.meterId, r])) }));
      setEntries((x) => {
        const n = { ...x };
        for (const r of got) if (r.ok) delete n[r.meterId];
        return n;
      });
      const saved = got.filter((r) => r.ok).length;
      const failed = got.length - saved;
      toast(failed ? `${saved} saved, ${failed} not saved: see the rows marked` : `${saved} ${saved === 1 ? 'reading' : 'readings'} saved`, failed ? 'error' : undefined);
    }
    setBusy(false);
    if (got.length) await qc.invalidateQueries({ queryKey: ['mt', companyId] });
  };
  return (
    <div className="stack mt-phone">
      <section className="card card-pad stack">
        <CodeField companyId={companyId} onFound={(s) => set('assetId', s.asset.id)} />
        {g('assetId') ? (
          <p className="row wrap small">
            <span className="grow">Showing <strong>{scoped?.number} {scoped?.name}</strong> and the assets under it.</span>
            <button type="button" className="btn sm" onClick={() => set('assetId', '')}>Show every meter</button>
          </p>
        ) : null}
        <div className="mt-filters" role="group" aria-label="Filters">
          <div className="field">
            <label htmlFor="rd-site">Site</label>
            <select id="rd-site" className="select" value={g('siteId')} onChange={(e) => set('siteId', e.target.value)}>
              <option value="">All sites</option>
              {(sites.data?.sites ?? []).map((s) => <option key={s.id} value={s.id}>{s.code} {s.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="rd-kind">Kind</label>
            <select id="rd-kind" className="select" value={g('kind')} onChange={(e) => set('kind', e.target.value)}>
              <option value="">All</option>
              <option value="meter">Meters (usage: hours, kilometres)</option>
              <option value="gauge">Gauges (condition: temperature, pressure)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="rd-not">Not read for</label>
            <select id="rd-not" className="select" value={g('notRead')} onChange={(e) => set('notRead', e.target.value)}>
              <option value="">Any time</option>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="rd-q">Search</label>
            <input id="rd-q" className="input" type="search" value={g('q')} onChange={(e) => set('q', e.target.value)} placeholder="Asset or meter" />
          </div>
        </div>
      </section>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {!list.data ? <Loading /> : !rows.length ? (
        <EmptyState icon="activity" title="No meters to read">{filters || g('assetId') ? 'Try another filter, or show every meter.' : 'Supervisors add meters and gauges on an asset’s page.'}</EmptyState>
      ) : (
        <div className="card crm-table-card">
          <div className="crm-table-scroll">
            <table className="data-table mt-table mt-readings">
              <thead><tr><th>Asset</th><th>Meter</th><th>Last reading</th><th>Read</th><th>New reading</th><th>Result</th></tr></thead>
              <tbody>
                {rows.map((m) => {
                  const e = entry(m.id);
                  const h = hint(m, e.value, e.reset);
                  const r = results[m.id];
                  return (
                    <tr key={m.id}>
                      <td data-label="Asset"><Link to={mtPage(companyId, `/assets/${m.assetId}`)}><strong className="mt-num">{m.assetNumber}</strong> {m.assetName}</Link>{m.siteCode ? <span className="muted small"> · {m.siteCode}</span> : null}</td>
                      <td data-label="Meter">
                        {m.name}
                        {!m.rising ? <span className="badge"> Gauge</span> : null}
                        {m.expectedMin !== null || m.expectedMax !== null ? <div className="muted small">Expected {m.expectedMin ?? '…'} to {m.expectedMax ?? '…'}{m.unit ? ` ${m.unit}` : ''}</div> : null}
                      </td>
                      <td data-label="Last reading" className={m.lastOutOfRange ? 'mt-overdue' : ''}>{m.lastValue !== null ? withUnit(m.lastValue, m.unit) : <span className="muted">None</span>}{m.lastOutOfRange ? ' (outside the range)' : ''}</td>
                      <td data-label="Read" className="small">{readText(m.lastReadAt)}</td>
                      <td data-label="New reading">
                        <label className="sr-only" htmlFor={`rd-v-${m.id}`}>New reading of {m.name} on {m.assetNumber}</label>
                        <input id={`rd-v-${m.id}`} className="input mt-reading-input" type="number" inputMode="decimal" step="any" value={e.value} onChange={(ev) => setEntry(m.id, { value: ev.target.value })} placeholder={m.unit || 'Value'} />
                        {m.rising ? <label className="checkbox small"><input type="checkbox" checked={e.reset} onChange={(ev) => setEntry(m.id, { reset: ev.target.checked })} /> Reset or replaced</label> : null}
                        {h ? <div className="mt-reading-hint">{h}</div> : null}
                      </td>
                      <td data-label="Result" aria-live="polite">
                        {r ? (
                          r.ok ? (
                            <span className="mt-reading-ok small"><Icon name="check" size={14} /> Saved{r.generated?.length ? `; made work order ${r.generated.map((x) => x.number).join(', ')}` : ''}{r.pmPending ? '; preventive maintenance is checked again by the scheduled run' : ''}</span>
                          ) : (
                            <span className="mt-reading-error small">{r.error}</span>
                          )
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {list.hasNextPage ? (
        <div className="row"><button className="btn" disabled={list.isFetchingNextPage} onClick={() => void list.fetchNextPage()}>{list.isFetchingNextPage ? 'Loading…' : `Show more (${rows.length} of ${total})`}</button></div>
      ) : null}
      <section className="card card-pad stack">
        <div className="field">
          <label htmlFor="rd-at">Taken at (empty: now)</label>
          <input id="rd-at" className="input" type="datetime-local" value={takenAt} onChange={(e) => setTakenAt(e.target.value)} />
        </div>
        <div className="mt-big-actions">
          <button className="btn primary" disabled={busy || !ready.length} onClick={() => void send()}>{busy ? 'Saving…' : `Save readings (${ready.length})`}</button>
        </div>
        <p className="muted small">Each reading is saved on its own. Where a preventive maintenance schedule follows the meter, a reading that makes it due makes its work order at once.</p>
      </section>
    </div>
  );
}
