// The record detail pattern: title, identifier, status, primary actions, then the tabs Overview, Details, the
// record's own tabs, Related records, Documents (with a preview), Activity timeline and Audit.
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../../components/ui/overlays';
import { COMPANIES } from '../data/core';
import { addDays, downloadCsv, exportMessage, fmtDate, fmtDateTime, money, TODAY } from '../format';
import { PIcon } from '../icons';
import { Empty, Facts, MenuEntry, Panel, StatusBadge, Tabs } from '../kit';
import { ENTITY_PATH, RecLink } from '../links';
import { sectionOf } from '../nav';
import { cellText, ENTITIES, findStatic, useRecord } from '../registry';
import { PageHeader, StateNote, useVisit } from '../shell/PageHeader';
import { useErp } from '../state';
import type { DocRef, EntityDef, NavPage, Row } from '../types';
import { ApprovalPanel } from './Approval';
import { LinesTable } from '../pages/recordParts';

export function RecordView({ def, id, page }: { def: EntityDef; id: string; page: NavPage }) {
  const r = useRecord(def.key, id);
  const section = sectionOf(page.path);
  const [params, setParams] = useSearchParams();
  const { patchRecord, toggleFavourite } = useErp();
  const toast = useToast();
  const navigate = useNavigate();
  useVisit(`/${page.path}/${id}`, id);
  if (!r)
    return (
      <div className="erp-page">
        <PageHeader crumbs={[{ label: 'Home', to: '/' }, { label: section?.label ?? '' }, { label: page.label, to: `/${page.path}` }, { label: id }]} title={`${def.label} not found`} />
        <Empty icon="search" title={`No ${def.label.toLowerCase()} ${id}`} action={<Link className="btn" to={`/${page.path}`}>Back to {page.label}</Link>}>
          The demonstration data has no record with this number.
        </Empty>
      </div>
    );
  const steps = def.workflow?.(r) ?? null;
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    ...(def.tabs ?? []).map((t) => ({ id: t.id, label: t.label })),
    ...(steps ? [{ id: 'approval', label: 'Approval' }] : []),
    { id: 'related', label: 'Related records' },
    { id: 'documents', label: 'Documents' },
    { id: 'activity', label: 'Activity' },
    { id: 'audit', label: 'Audit' },
  ];
  const tab = tabs.some((t) => t.id === params.get('tab')) ? (params.get('tab') as string) : 'overview';
  const setTab = (t: string) => {
    const p = new URLSearchParams(params);
    if (t === 'overview') p.delete('tab');
    else p.set('tab', t);
    setParams(p, { replace: true });
  };
  const actions = (def.actions?.(r) ?? []).filter((a) => !a.when || a.when(r));
  const run = (a: (typeof actions)[number]) => {
    if (a.external) return window.open(a.external, '_blank', 'noopener');
    if (a.to) return navigate(a.to);
    if (a.patch) {
      const before = Object.fromEntries(Object.keys(a.patch).map((k) => [k, r[k]]));
      patchRecord(def.key, r.id, a.patch);
      toast(a.toast ?? 'Done.', 'info', { label: 'Undo', run: () => patchRecord(def.key, r.id, before) });
      return;
    }
    if (a.toast) toast(a.toast);
  };
  const recordPath = `/${page.path}/${id}`;
  return (
    <div className="erp-page">
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: section?.label ?? '', to: `/${section?.pages[0].path}` }, { label: page.label, to: `/${page.path}` }, { label: id }]}
        title={def.title(r)}
        id={r.id}
        status={r.status ?? r.stage}
        states={page.state}
        pinPath={recordPath}
        pinLabel={r.id}
        subtitle={def.subtitle?.(r)}
        actions={actions.map((a) => (
          <button key={a.label} type="button" className={`btn${a.primary ? ' primary' : ''}`} onClick={() => run(a)}>
            {a.icon ? <PIcon name={a.icon} /> : null}
            {a.label}
          </button>
        ))}
        more={(close) => (
          <>
            <MenuEntry
              icon="link"
              onClick={() => {
                close();
                navigator.clipboard?.writeText(location.href).catch(() => undefined);
                toast('Link copied.');
              }}
            >
              Copy link
            </MenuEntry>
            <MenuEntry
              icon="star"
              onClick={() => {
                close();
                toggleFavourite({ path: recordPath, label: r.id });
              }}
            >
              Pin or unpin
            </MenuEntry>
            <MenuEntry
              icon="download"
              onClick={() => {
                close();
                void downloadCsv(`${r.id}.csv`, def.columns.map((c) => c.label), [def.columns.map((c) => (c.key === 'id' ? r.id : cellText(c, r)))]).then((o) => toast(exportMessage(o, r.id, `${r.id}.csv`)));
              }}
            >
              Export as CSV
            </MenuEntry>
            <MenuEntry
              icon="doc"
              onClick={() => {
                close();
                window.print();
              }}
            >
              Print
            </MenuEntry>
          </>
        )}
      />
      <StateNote page={page} record />
      <Tabs tabs={tabs} active={tab} onChange={setTab} label={`${def.label} sections`} />
      <div className="erp-tabpanel" role="tabpanel" aria-label={tabs.find((t) => t.id === tab)?.label}>
        {tab === 'overview' ? <Overview def={def} r={r} steps={steps} /> : null}
        {tab === 'details' ? <Details def={def} r={r} /> : null}
        {def.tabs?.find((t) => t.id === tab)?.render(r)}
        {tab === 'approval' && steps ? <ApprovalPanel entity={def.key} r={r} steps={steps} label={def.label} /> : null}
        {tab === 'related' ? <Related def={def} r={r} /> : null}
        {tab === 'documents' ? <Documents def={def} r={r} /> : null}
        {tab === 'activity' ? <ActivityTab def={def} r={r} /> : null}
        {tab === 'audit' ? <Audit def={def} r={r} /> : null}
      </div>
    </div>
  );
}

function keyFacts(def: EntityDef, r: Row): [string, ReactNode][] {
  return def.columns
    .filter((c) => c.key !== 'id' && c.kind !== 'status')
    .slice(0, 8)
    .map((c) => [c.label, c.kind === 'id' ? <RecLink key={c.key} id={r[c.key]} /> : cellText(c, r)]);
}

function Overview({ def, r, steps }: { def: EntityDef; r: Row; steps: ReturnType<NonNullable<EntityDef['workflow']>> }) {
  const rel = (def.related?.(r) ?? []).slice(0, 6);
  return (
    <div className="erp-record-grid">
      <div className="erp-record-main">
        <Panel title="Summary">
          <Facts items={keyFacts(def, r)} columns={4} />
        </Panel>
        {steps ? <ApprovalPanel entity={def.key} r={r} steps={steps} label={def.label} /> : null}
        {def.overview ? <OverviewBlock>{def.overview(r)}</OverviewBlock> : null}
      </div>
      <aside className="erp-record-side" aria-label="Related and recent">
        {def.side ? def.side(r) : null}
        <Panel title="Related records">
          {rel.length ? (
            <ul className="erp-rel-list">
              {rel.map((x) => (
                <RelatedItem key={`${x.entity}:${x.id}`} entity={x.entity} id={x.id} note={x.note} />
              ))}
            </ul>
          ) : (
            <p className="muted small">Nothing linked yet.</p>
          )}
        </Panel>
      </aside>
    </div>
  );
}

/** Record content in a card; nothing when the record has none. */
function OverviewBlock({ children }: { children: ReactNode }) {
  if (!children || (Array.isArray(children) && children.every((c) => !c))) return null;
  return (
    <section className="card erp-panel">
      <div className="erp-panel-body">{children}</div>
    </section>
  );
}

function RelatedItem({ entity, id, note }: { entity: string; id: string; note?: string }) {
  const { patches } = useErp();
  const base = findStatic(entity, id);
  const row = base ? { ...base, ...patches[`${entity}:${id}`] } : undefined;
  const e = ENTITIES[entity];
  return (
    <li>
      <Link to={`/${ENTITY_PATH[entity]}/${id}`} className="erp-rel">
        <span className="erp-rel-kind">{e?.label ?? entity}</span>
        <span className="erp-rel-id">{id}</span>
        <span className="erp-rel-title">{row && e ? e.title(row) : ''}</span>
        {note ? <span className="muted small">{note}</span> : null}
      </Link>
      {row?.status ? <StatusBadge status={row.status} /> : null}
    </li>
  );
}

function Details({ def, r }: { def: EntityDef; r: Row }) {
  const groups = def.details ?? [{ group: 'Summary', keys: def.columns.map((c) => [c.key, c.label, c.kind] as [string, string, any]) }];
  const cIndex = Object.fromEntries(def.columns.map((c) => [c.key, c]));
  return (
    <div className="erp-stack">
      {groups.map((g) => (
        <Panel key={g.group} title={g.group}>
          <Facts columns={3} items={g.keys.map(([k, label, kind]) => [label, cIndex[k] ? cellText(cIndex[k], r) : kind === 'money' ? money(r[k]) : kind === 'date' ? fmtDate(r[k]) : r[k]])} />
        </Panel>
      ))}
      <Panel title="Record">
        <Facts columns={3} items={[['Company', COMPANIES[0].name], ['Site', r.site], ['Kept in', def.module === 'System' ? 'System (planned module)' : def.module]]} />
      </Panel>
    </div>
  );
}

function Related({ def, r }: { def: EntityDef; r: Row }) {
  const rel = def.related?.(r) ?? [];
  if (!rel.length) return <Empty icon="link" title="Nothing linked yet">Related orders, documents and records appear here.</Empty>;
  const groups = Array.from(new Set(rel.map((x) => x.entity)));
  return (
    <div className="erp-stack">
      {groups.map((g) => (
        <Panel key={g} title={ENTITIES[g]?.plural ?? g}>
          <ul className="erp-rel-list">
            {rel
              .filter((x) => x.entity === g)
              .map((x) => (
                <RelatedItem key={x.id} entity={x.entity} id={x.id} note={x.note} />
              ))}
          </ul>
        </Panel>
      ))}
    </div>
  );
}

function Documents({ def, r }: { def: EntityDef; r: Row }) {
  const docs: DocRef[] = def.docs?.(r) ?? [{ name: `${r.id}.pdf`, kind: `${def.label} (PDF)`, size: '64 KB', date: TODAY }];
  const [sel, setSel] = useState(0);
  const toast = useToast();
  const d = docs[sel] ?? docs[0];
  return (
    <div className="erp-docs">
      <Panel title="Documents">
        <ul className="erp-doclist" role="listbox" aria-label="Documents">
          {docs.map((doc, i) => (
            <li key={doc.name}>
              <button type="button" role="option" aria-selected={i === sel} className={`erp-doc${i === sel ? ' active' : ''}`} onClick={() => setSel(i)}>
                <PIcon name="file" />
                <span className="grow">
                  <strong className="erp-doc-name">{doc.name}</strong>
                  <span className="muted small">
                    {doc.kind} · {doc.size} · {fmtDate(doc.date)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn sm" onClick={() => toast('Upload is not part of the prototype.')}>
          <PIcon name="upload" size={14} /> Upload
        </button>
      </Panel>
      <section className="card erp-preview" aria-label={`Preview of ${d.name}`}>
        <div className="erp-panel-head">
          <h2>Preview</h2>
          <button type="button" className="btn sm" onClick={() => toast(`${d.name} is a demonstration document; nothing to download.`)}>
            <PIcon name="download" size={14} /> Download
          </button>
        </div>
        <div className="erp-paper">
          <div className="erp-paper-head">
            <div>
              <strong>{COMPANIES[0].name}</strong>
              <div className="muted small">Demonstration document, not a real record</div>
            </div>
            <div className="erp-paper-kind">
              <strong>{d.kind.replace(/ \(.*\)$/, '')}</strong>
              <div>{r.id}</div>
            </div>
          </div>
          {d.kind.startsWith('Photo') ? (
            <div className="erp-photo" role="img" aria-label="Photo placeholder">
              <PIcon name="camera" size={32} />
              <span>Photo placeholder</span>
            </div>
          ) : (
            <>
              <Facts columns={2} items={keyFacts(def, r).slice(0, 4)} />
              {r.lines ? <LinesTable lines={r.lines} caption="Lines" /> : <p className="muted small">{def.title(r)}</p>}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function ActivityTab({ def, r }: { def: EntityDef; r: Row }) {
  const { comments, addComment } = useErp();
  const [text, setText] = useState('');
  const created = r.issued ?? r.ordered ?? r.raised ?? r.date ?? r.start ?? r.created ?? addDays(TODAY, -10);
  const events = useMemo(() => {
    const e: { at: string; who: string; text: string; icon: string }[] = [{ at: `${created}T09:00`, who: r.owner ?? r.buyer ?? r.requester ?? r.inspector ?? r.manager ?? 'Alex Morgan', text: `Created ${def.label.toLowerCase()} ${r.id}`, icon: 'plus' }];
    (r.payments ?? []).forEach((p: any) => e.push({ at: `${p.date}T10:12`, who: p.by, text: `Payment of ${money(p.amount, true)} received (${p.method}, ${p.reference})`, icon: 'dollar' }));
    if (r.delayReason) e.push({ at: `${TODAY}T08:02`, who: 'BIZOMAT (automatic)', text: `Marked ${String(r.status).toLowerCase()}: ${r.delayReason}`, icon: 'alert' });
    if (r.approvedAt) e.push({ at: r.approvedAt, who: r.approvedBy, text: `Approved${r.approvalComment ? `: “${r.approvalComment}”` : ''}`, icon: 'check' });
    if (r.returnedAt) e.push({ at: r.returnedAt, who: 'Alex Morgan (you)', text: `Returned: “${r.returnComment}”`, icon: 'undo' });
    (comments[`${def.key}:${r.id}`] ?? []).forEach((c) => e.push({ ...c, text: `Commented: “${c.text}”`, icon: 'message' }));
    return e.sort((a, b) => (a.at < b.at ? 1 : -1));
  }, [r, comments, def, created]);
  return (
    <div className="erp-activity">
      <Panel title="Activity timeline">
        <form
          className="erp-comment"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            addComment(def.key, r.id, text.trim());
            setText('');
          }}
        >
          <label htmlFor={`c-${r.id}`} className="sr-only">
            Add a comment
          </label>
          <textarea id={`c-${r.id}`} className="textarea" rows={2} placeholder="Add a comment. Use @ to mention someone." value={text} onChange={(e) => setText(e.target.value)} />
          <button type="submit" className="btn primary sm" disabled={!text.trim()}>
            Post comment
          </button>
        </form>
        <ol className="erp-timeline">
          {events.map((ev, i) => (
            <li key={i}>
              <span className="erp-tl-icon" aria-hidden>
                <PIcon name={ev.icon} size={14} />
              </span>
              <div>
                <div>{ev.text}</div>
                <div className="muted small">
                  {ev.who} · {fmtDateTime(ev.at)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}

function Audit({ def, r }: { def: EntityDef; r: Row }) {
  const base = findStatic(def.key, r.id) ?? r;
  const changes = Object.keys(r)
    .filter((k) => typeof r[k] !== 'object' && r[k] !== base[k])
    .map((k) => ({ at: 'This visit', who: 'Alex Morgan (you)', field: k, from: String(base[k] ?? ''), to: String(r[k] ?? '') }));
  const created = r.issued ?? r.ordered ?? r.raised ?? r.date ?? r.start ?? '2026-10-01';
  const rows = [...changes, { at: fmtDateTime(`${created}T09:00`), who: r.owner ?? r.buyer ?? 'Alex Morgan', field: 'Record', from: '', to: 'Created' }, ...(r.status ? [{ at: fmtDateTime(`${created}T09:05`), who: r.owner ?? r.buyer ?? 'Alex Morgan', field: 'status', from: 'Draft', to: base.status }] : [])];
  return (
    <Panel title="Audit trail">
      <p className="muted small">Every change to the record, kept by the system that owns it. Changes made in this visit are listed first.</p>
      <div className="erp-table-scroll">
        <table className="data-table erp-table">
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Who</th>
              <th scope="col">Field</th>
              <th scope="col">Before</th>
              <th scope="col">After</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x, i) => (
              <tr key={i}>
                <td>{x.at}</td>
                <td>{x.who}</td>
                <td>{x.field}</td>
                <td>{x.from || <span className="muted">–</span>}</td>
                <td>{x.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
