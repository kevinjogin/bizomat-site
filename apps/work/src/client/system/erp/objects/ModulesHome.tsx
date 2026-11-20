// All modules at /erp/c/<company>/modules: the 97 modules of BIZOMAT ERP's master catalogue, where each stands (live,
// extended, new, partly built or planned), what exists and what does not, and where it opens; one search across the
// modules' records and the ERP's products, suppliers and orders; what is waiting for the person; their favourites and the
// modules they used last (this computer only). And the full list of what waits for them at /erp/c/<company>/inbox.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../../lib/api';
import { SUITE } from '../../../lib/base';
import { usePageTitle } from '../../../lib/hooks';
import { timeAgo } from '../../../lib/format';
import { Icon } from '../../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../../../components/ui/ui';
import '../../../styles/maintenance.css';
import '../../../styles/erp.css';
import { Section } from '../../maintenance/common';
import { favourites, recentModules, recordPage, toggleFavourite, xPath, type CatalogueModule } from './api';

const STATUS_TONE: Record<CatalogueModule['status'], string> = { live: 'success', improved: 'success', new: 'accent', partial: 'warning', planned: '' };

interface Inbox {
  waiting: { id: string; object: string; module: string; objectLabel: string; number: string; title: string; statusLabel: string; dueDate: string | null; why: string; since: number }[];
  mine: Inbox['waiting'];
  dueSoon: number;
  today: string;
}

const useInbox = (companyId: string) => useQuery({ queryKey: ['erp', companyId, 'x', 'inbox'], queryFn: () => get<Inbox>(xPath(companyId, '/inbox')), staleTime: 30_000 });

/** Where a catalogue entry opens: an ERP page (/c/...) or a tool (/tasks/, /crm/, /finance/, /company/). */
function OpenLink({ m, children }: { m: CatalogueModule; children: React.ReactNode }) {
  if (!m.path || !m.opens || !m.switchOn) return null;
  if (m.path.startsWith('/c/') || m.path.startsWith('/reports')) return <Link className="btn sm" to={m.path}>{children}</Link>;
  return <a className="btn sm" href={`${SUITE}${m.path}`}>{children}</a>;
}

export function ModulesHome({ companyId, companyName }: { companyId: string; companyName: string }) {
  usePageTitle('All modules');
  const cat = useQuery({ queryKey: ['erp', companyId, 'catalogue'], queryFn: () => get<{ counts: Record<string, number>; areas: Record<string, string>; modules: CatalogueModule[] }>(`/erp/c/${encodeURIComponent(companyId)}/catalogue`) });
  const inbox = useInbox(companyId);
  const [text, setText] = useState('');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState('');
  const [favs, setFavs] = useState(favourites());
  const [recent, setRecent] = useState(recentModules());
  const [q, setQ] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const on = () => {
      setFavs(favourites());
      setRecent(recentModules());
    };
    window.addEventListener('bizomat-modules-changed', on);
    // "/" puts the cursor in the search, as in most business software
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === '/' && !(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable))) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('bizomat-modules-changed', on);
      window.removeEventListener('keydown', key);
    };
  }, []);
  const search = useQuery({ queryKey: ['erp', companyId, 'x', 'search', q], queryFn: () => get<{ results: { kind: string; number: string; title: string; status: string; path: string }[] }>(xPath(companyId, `/search?q=${encodeURIComponent(q)}`)), enabled: q.trim().length >= 2, staleTime: 15_000 });
  const list = useMemo(() => {
    const t = text.trim().toLowerCase();
    return (cat.data?.modules ?? []).filter((m) => (!area || m.area === area) && (!status || m.status === status) && (!t || `${m.n} ${m.name} ${m.now} ${m.gaps ?? ''}`.toLowerCase().includes(t)));
  }, [cat.data, text, area, status]);
  if (cat.error) return <div className="page"><ErrorBox error={cat.error} retry={() => cat.refetch()} /></div>;
  if (!cat.data) return <Loading label="Opening the catalogue…" />;
  const c = cat.data.counts;
  const co = encodeURIComponent(companyId);
  const byPath = new Map(cat.data.modules.filter((m) => m.module).map((m) => [`m/${m.module}`, m]));
  const shortcut = (key: string) => {
    const m = byPath.get(key);
    return m ? { key, label: cat.data!.modules.filter((x) => x.module === m.module).map((x) => x.name).sort((a, b) => a.length - b.length)[0], to: `/c/${co}/${key}` } : null;
  };
  const favList = favs.map(shortcut).filter((x): x is NonNullable<typeof x> => !!x);
  const recentList = recent.filter((k) => !favs.includes(k)).map(shortcut).filter((x): x is NonNullable<typeof x> => !!x).slice(0, 6);
  return (
    <div className="page crm-page">
      <PageHeader title="All modules" subtitle={`The 97 modules of BIZOMAT ERP for ${companyName}: where each stands, what it does today and what it does not do yet.`} />
      <div className="crm-stats">
        <div className="card crm-stat"><span className="crm-stat-label">Live</span><span className="crm-stat-value">{(c.live ?? 0) + (c.improved ?? 0)}</span><span className="muted small">{c.improved ?? 0} extended in this release</span></div>
        <div className="card crm-stat"><span className="crm-stat-label">New</span><span className="crm-stat-value">{c.new ?? 0}</span><span className="muted small">Built on the modules framework</span></div>
        <div className="card crm-stat"><span className="crm-stat-label">Partly built</span><span className="crm-stat-value">{c.partial ?? 0}</span><span className="muted small">Each says what is missing</span></div>
        <div className="card crm-stat"><span className="crm-stat-label">Planned</span><span className="crm-stat-value">{c.planned ?? 0}</span><span className="muted small">Not built yet</span></div>
      </div>
      <div className="crm-record-grid">
        <Section title="Search everything">
          <label className="sr-only" htmlFor="mods-search">Search records</label>
          <input ref={searchRef} id="mods-search" className="input" type="search" placeholder="Search records across the modules (press /)" value={q} onChange={(e) => setQ(e.target.value)} />
          {q.trim().length >= 2 ? (
            search.isLoading ? <Loading /> : search.data?.results.length ? (
              <ul className="erp-list">
                {search.data.results.map((r, i) => <li key={i}><span className="muted small">{r.kind}</span> <Link to={r.path}><span className="mt-num">{r.number}</span> {r.title}</Link> <span className="muted small">{r.status.replace(/_/g, ' ')}</span></li>)}
              </ul>
            ) : <p className="muted small">Nothing found that you may see.</p>
          ) : <p className="muted small">Finds employees, contracts, tickets, assets, vehicles and every other record of the modules, and the ERP’s products, suppliers and orders, that your roles let you see.</p>}
        </Section>
        <Section title="Waiting for you" actions={<Link className="btn sm" to={`/c/${co}/inbox`}>Open the list</Link>}>
          {inbox.data ? (
            inbox.data.waiting.length || inbox.data.mine.length ? (
              <ul className="erp-list">
                {[...inbox.data.waiting, ...inbox.data.mine].slice(0, 6).map((x) => <li key={`${x.id}:${x.why}`}><Link to={recordPage(companyId, x.module, x.object, x.id)}><span className="mt-num">{x.number}</span> {x.title}</Link> <span className="muted small">{x.why}</span></li>)}
              </ul>
            ) : <p className="muted small">Nothing is waiting for you.</p>
          ) : <Loading />}
          {favList.length || recentList.length ? (
            <>
              <h3 className="erp-h3">{favList.length ? 'Favourites' : 'Recently used'}</h3>
              <div className="row wrap">{(favList.length ? favList : recentList).map((x) => <Link key={x.key} className="btn sm" to={x.to}>{favs.includes(x.key) ? <Icon name="star" size={14} /> : null} {x.label}</Link>)}</div>
              {favList.length && recentList.length ? <><h3 className="erp-h3">Recently used</h3><div className="row wrap">{recentList.map((x) => <Link key={x.key} className="btn sm ghost" to={x.to}>{x.label}</Link>)}</div></> : null}
            </>
          ) : null}
        </Section>
      </div>
      <div className="row wrap mt-filters">
        <div className="field grow"><label htmlFor="mods-text">Find a module</label><input id="mods-text" className="input" type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder="Name, number or what it does" /></div>
        <div className="field"><label htmlFor="mods-area">Area</label><select id="mods-area" className="select" value={area} onChange={(e) => setArea(e.target.value)}><option value="">Every area</option>{Object.entries(cat.data.areas).map(([k, l]) => <option key={k} value={k}>{k}. {l}</option>)}</select></div>
        <div className="field"><label htmlFor="mods-status">Status</label><select id="mods-status" className="select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Any</option><option value="live">Live</option><option value="improved">Live, extended</option><option value="new">New</option><option value="partial">Partly built</option><option value="planned">Planned</option></select></div>
      </div>
      {Object.entries(cat.data.areas).map(([key, label]) => {
        const items = list.filter((m) => m.area === key);
        if (!items.length) return null;
        return (
          <section key={key} className="stack" aria-labelledby={`area-${key}`}>
            <h2 className="crm-subhead" id={`area-${key}`}>{key}. {label}</h2>
            <div className="co-tools-grid">
              {items.map((m) => {
                const fk = m.module ? `m/${m.module}` : null;
                return (
                  <article key={m.n} className="card card-pad co-tool-card erp-module-card">
                    <div className="row">
                      <span className="mt-num muted small">{m.n}</span>
                      <h3 className="crm-card-title grow">{m.name}</h3>
                      <span className={`badge ${STATUS_TONE[m.status]}`}>{m.statusLabel}</span>
                    </div>
                    <p className="small">{m.now}</p>
                    {m.gaps ? <p className="muted small">Not yet: {m.gaps}</p> : null}
                    {!m.switchOn ? <p className="warning-text small">Switched off for this company.</p> : null}
                    <div className="row wrap">
                      <OpenLink m={m}>Open</OpenLink>
                      {m.path && !m.opens ? <span className="muted small">Your ERP roles do not include it</span> : null}
                      {fk ? <button type="button" className={`btn sm ghost${favs.includes(fk) ? ' active' : ''}`} aria-pressed={favs.includes(fk)} aria-label={favs.includes(fk) ? `Remove ${m.name} from favourites` : `Add ${m.name} to favourites`} onClick={() => setFavs(toggleFavourite(fk))}><Icon name="star" size={14} /></button> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
      {!list.length ? <EmptyState icon="search" title="No module matches">Try other words or another area.</EmptyState> : null}
    </div>
  );
}

export function InboxPage({ companyId }: { companyId: string }) {
  usePageTitle('Waiting for me');
  const q = useInbox(companyId);
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  if (!q.data) return <Loading />;
  const row = (x: Inbox['waiting'][number]) => (
    <tr key={`${x.id}:${x.why}`}>
      <td data-label="Record"><Link className="mt-primary" to={recordPage(companyId, x.module, x.object, x.id)}><span className="mt-num">{x.number}</span> {x.title}</Link></td>
      <td data-label="Kind">{x.objectLabel}</td>
      <td data-label="Status">{x.statusLabel}</td>
      <td data-label="Why">{x.why}</td>
      <td data-label="Due">{x.dueDate ? <span className={x.dueDate < q.data!.today ? 'danger-text' : undefined}>{new Date(`${x.dueDate}T00:00:00`).toLocaleDateString()}</span> : ''}</td>
      <td data-label="Since" className="muted small">{timeAgo(x.since)}</td>
    </tr>
  );
  const table = (rows: Inbox['waiting']) => (
    <div className="card crm-table-card">
      <table className="data-table responsive">
        <thead><tr><th>Record</th><th>Kind</th><th>Status</th><th>Why</th><th>Due</th><th>Since</th></tr></thead>
        <tbody>{rows.map(row)}</tbody>
      </table>
    </div>
  );
  return (
    <div className="page crm-page">
      <PageHeader title="Waiting for me" subtitle="Approvals waiting for you, and the records that are yours or given to you, across the modules." />
      <h2 className="crm-subhead">Approvals ({q.data.waiting.length})</h2>
      {q.data.waiting.length ? table(q.data.waiting) : <p className="muted small">No approval is waiting for you.</p>}
      <h2 className="crm-subhead">Yours and given to you ({q.data.mine.length})</h2>
      {q.data.mine.length ? table(q.data.mine) : <p className="muted small">Nothing open is yours or given to you.</p>}
    </div>
  );
}
