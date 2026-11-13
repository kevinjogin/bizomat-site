// One lead, contact, company or deal: its details, the unified timeline (history, activities, notes, documents, with
// what happened on its contacts and deals), notes and comments with mentions, documents with versions, related
// records, and the actions of each kind (convert a lead; move, win or lose a deal).
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ApiError, api, del, errorMessage, get, patch, post, put } from '../lib/api';
import { appUrl } from '../lib/base';
import { usePageTitle } from '../lib/hooks';
import { formatBytes, timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Loading } from '../components/ui/ui';
import { Dropdown, MenuItem, Modal, useConfirm, useToast } from '../components/ui/overlays';
import { COMPANY_SIZES, DEAL_STATUSES, PRIORITIES } from '../../shared/crm/defaults';
import { ENTITY_LABELS, FIELDS, type RecordEntity } from '../../shared/crm/fields';
import type { ActivityDTO, CompanyDTO, ContactDTO, DealDTO, FileDTO, LeadDTO, ListResult, NoteDTO, PipelineDTO, ProductDTO, TimelineItemDTO } from '../../shared/crm/types';
import { lineTotal } from '../../shared/crm/money';
import { Chip, MenuButton, MoneyInput, PersonChip, RecordLink, RecordPicker, TagChips } from './ui';
import { RecordFormDialog } from './RecordForm';
import { ActivityRow, EmailDialog, activityIcon } from './Activities';
import { ENTITY_PATH, crm, dateTime, labelOf, optionsOf, recordPath, shortDate, useCurrentOrg, useCustomFields, useMembers, useMoney, usePeople, usePipelines, useRefreshOrg } from './lib';

type AnyRecord = (ContactDTO | CompanyDTO | LeadDTO | DealDTO) & Record<string, any>;

/** The record's values for the edit form (links as {id, name}). */
function formInitial(entity: RecordEntity, r: AnyRecord) {
  if (entity === 'contact' || entity === 'deal') return { ...r, companyId: r.company };
  return { ...r };
}

function displayName(entity: RecordEntity, r: AnyRecord) {
  return entity === 'deal' ? r.title : r.name;
}

export function RecordPage({ entity }: { entity: RecordEntity }) {
  const org = useCurrentOrg();
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefreshOrg();
  const [editing, setEditing] = useState(false);
  const [composer, setComposer] = useState<null | 'activity' | 'email'>(null);
  const [tab, setTab] = useState<'timeline' | 'activities' | 'notes' | 'files'>('timeline');
  const q = useQuery({ queryKey: ['crm', org.id, 'record', entity, id], queryFn: () => get<AnyRecord>(crm(org.id, `/${ENTITY_PATH[entity]}/${id}`)) });
  usePageTitle(q.data ? displayName(entity, q.data) : ENTITY_LABELS[entity].one);
  if (q.error) return <div className="page"><ErrorBox error={q.error} /></div>;
  if (!q.data) return <Loading />;
  const r = q.data;
  const deleted = !!r.deletedAt;
  const act = async (fn: () => Promise<unknown>, done: string) => {
    try {
      await fn();
      toast(done);
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const links = { contact: entity === 'contact' ? { id: r.id, name: r.name } : null, company: entity === 'company' ? { id: r.id, name: r.name } : (r.company ?? null), deal: entity === 'deal' ? { id: r.id, name: r.title } : null, lead: entity === 'lead' ? { id: r.id, name: r.name } : null };
  const activityInitial = { contactId: links.contact, companyId: links.company, dealId: links.deal, leadId: links.lead, type: 'call' };

  return (
    <div className="page crm-page crm-record">
      <div className="row">
        <Link className="btn ghost sm" to={`/o/${org.id}/${ENTITY_PATH[entity]}`}>
          <Icon name="chevronLeft" size={14} /> {ENTITY_LABELS[entity].many}
        </Link>
      </div>
      <header className="crm-record-head">
        <RecordAvatar entity={entity} r={r} />
        <div className="grow">
          <h1>{displayName(entity, r)}</h1>
          <div className="row wrap muted small">
            {entity === 'contact' ? <>{r.jobTitle}{r.jobTitle && r.company ? ' at ' : ''}{r.company ? <RecordLink entity="company" refDto={r.company} /> : null}</> : null}
            {entity === 'lead' ? <>{[r.jobTitle, r.companyName].filter(Boolean).join(' at ')}</> : null}
            {entity === 'company' ? <>{labelOf(org.settings.industries, r.industry)}{r.website ? <> · <a href={/^https?:/.test(r.website) ? r.website : `https://${r.website}`} target="_blank" rel="noopener noreferrer">{r.domain || r.website}</a></> : null}</> : null}
            {entity === 'deal' ? <>{r.company ? <RecordLink entity="company" refDto={r.company} /> : 'No company'} · {r.stageName}</> : null}
            <TagChips tags={r.tags} />
            {deleted ? <span className="badge danger">Deleted</span> : r.archivedAt ? <span className="badge warning">Archived</span> : null}
          </div>
        </div>
        <div className="row wrap">
          {deleted ? (
            r.can.delete ? <button className="btn" onClick={() => act(() => post(crm(org.id, `/${ENTITY_PATH[entity]}/${r.id}/restore`)), 'Restored')}><Icon name="restore" /> Restore</button> : null
          ) : (
            <>
              {entity === 'lead' && !r.convertedAt && r.can.edit ? <ConvertButton lead={r as LeadDTO} /> : null}
              {entity === 'deal' && r.can.edit ? <DealOutcome deal={r as DealDTO} /> : null}
              {r.can.edit ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Edit</button> : null}
              <MenuButton
                label="More actions"
                items={[
                  { label: r.archivedAt ? 'Take out of the archive' : 'Archive', icon: 'archive', hidden: !r.can.edit, onClick: () => act(() => post(crm(org.id, `/${ENTITY_PATH[entity]}/${r.id}/archive`), { archived: !r.archivedAt }), r.archivedAt ? 'Back in the lists' : 'Archived') },
                  {
                    label: 'Delete',
                    icon: 'trash',
                    danger: true,
                    hidden: !r.can.delete,
                    onClick: async () => {
                      if (!(await confirm({ title: `Delete ${displayName(entity, r)}?`, message: 'It moves to Deleted, where it can be restored. Its history stays.', confirmLabel: 'Delete', danger: true }))) return;
                      await act(() => del(crm(org.id, `/${ENTITY_PATH[entity]}/${r.id}`)), 'Deleted');
                      navigate(`/o/${org.id}/${ENTITY_PATH[entity]}`);
                    },
                  },
                ]}
              />
            </>
          )}
        </div>
      </header>
      {entity === 'deal' ? <StageBar deal={r as DealDTO} /> : null}
      {entity === 'lead' && r.convertedAt ? (
        <div className="info-box">
          Converted {dateTime(r.convertedAt)}:{' '}
          {r.contactId ? <Link to={recordPath(org.id, 'contact', r.contactId)}>contact</Link> : null}
          {r.companyId ? <> · <Link to={recordPath(org.id, 'company', r.companyId)}>company</Link></> : null}
          {r.dealId ? <> · <Link to={recordPath(org.id, 'deal', r.dealId)}>deal</Link></> : null}
        </div>
      ) : null}
      <div className="crm-record-grid">
        <aside className="stack">
          <section className="card card-pad">
            <div className="row">
              <h2 className="crm-subhead grow">About</h2>
            </div>
            <Properties entity={entity} r={r} />
          </section>
          {entity === 'lead' ? <LeadScore lead={r as LeadDTO} /> : null}
          {entity === 'deal' ? <DealContacts deal={r as DealDTO} onChange={() => q.refetch()} /> : null}
          {entity === 'company' ? <RelatedContacts companyId={r.id} /> : null}
          {entity === 'company' || entity === 'contact' ? <RelatedDeals entity={entity} id={r.id} /> : null}
        </aside>
        <main className="stack">
          {!deleted && org.perms.activities.create ? (
            <div className="card card-pad crm-composer">
              <NoteComposer entity={entity} recordId={r.id} onAdded={() => setTab((t) => (t === 'files' ? 'notes' : t))} />
              <div className="row wrap">
                <button className="btn sm" onClick={() => setComposer('activity')}><Icon name="calendar" size={14} /> Plan an activity</button>
                <button className="btn sm" onClick={() => setComposer('email')}><Icon name="mail" size={14} /> Email</button>
                <UploadButton entity={entity} recordId={r.id} onDone={() => refresh()} />
              </div>
            </div>
          ) : null}
          {entity === 'deal' ? <DealItems deal={r as DealDTO} onChange={() => q.refetch()} /> : null}
          <div className="card">
            <div className="tabs crm-tabs" role="tablist">
              {(['timeline', 'activities', 'notes', 'files'] as const).map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                  {{ timeline: 'Timeline', activities: 'Activities', notes: 'Notes and comments', files: 'Documents' }[t]}
                </button>
              ))}
            </div>
            <div className="card-pad">
              {tab === 'timeline' ? <Timeline entity={entity} id={r.id} /> : null}
              {tab === 'activities' ? <RecordActivities entity={entity} id={r.id} /> : null}
              {tab === 'notes' ? <Notes entity={entity} id={r.id} /> : null}
              {tab === 'files' ? <Files entity={entity} id={r.id} /> : null}
            </div>
          </div>
          {entity === 'deal' ? <StageHistory dealId={r.id} /> : null}
        </main>
      </div>
      {editing ? <RecordFormDialog entity={entity} initial={formInitial(entity, r)} onClose={() => setEditing(false)} onSaved={() => q.refetch()} /> : null}
      {composer === 'activity' ? <RecordFormDialog entity="activity" initial={activityInitial} onClose={() => setComposer(null)} onSaved={() => refresh()} /> : null}
      {composer === 'email' ? <EmailDialog onClose={() => setComposer(null)} to={r.email ?? ''} {...links} /> : null}
    </div>
  );
}

function RecordAvatar({ entity, r }: { entity: RecordEntity; r: AnyRecord }) {
  const org = useCurrentOrg();
  const refresh = useRefreshOrg();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const url = entity === 'contact' ? r.avatarUrl : entity === 'company' ? r.logoUrl : null;
  const canUpload = (entity === 'contact' || entity === 'company') && r.can.edit;
  const upload = async (file: File) => {
    const form = new FormData();
    form.set('file', file);
    try {
      await api(crm(org.id, `/${ENTITY_PATH[entity]}/${r.id}/${entity === 'contact' ? 'avatar' : 'logo'}`), { method: 'POST', form });
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const inner = url ? <img className="crm-avatar-img" src={appUrl(url)} alt="" /> : entity === 'deal' || entity === 'company' ? <span className="crm-avatar-icon"><Icon name={entity === 'deal' ? 'dollar' : 'building'} size={22} /></span> : <Avatar name={displayName(entity, r)} id={r.id} size="lg" />;
  return canUpload ? (
    <>
      <button className="crm-avatar" onClick={() => input.current?.click()} aria-label={entity === 'contact' ? 'Change profile picture' : 'Change logo'} title={entity === 'contact' ? 'Change profile picture' : 'Change logo'}>
        {inner}
      </button>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/gif,image/webp" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
    </>
  ) : (
    <span className="crm-avatar">{inner}</span>
  );
}

function Properties({ entity, r }: { entity: RecordEntity; r: AnyRecord }) {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const cfs = (useCustomFields().data ?? []).filter((f) => f.entity === entity && !f.archived);
  const rows: [string, ReactNode][] = [];
  const add = (label: string, v: ReactNode) => {
    if (v !== null && v !== undefined && v !== '' && v !== false) rows.push([label, v]);
  };
  const mail = (e: string) => (e ? <a href={`mailto:${e}`}>{e}</a> : null);
  const tel = (p: string) => (p ? <a href={`tel:${p.replace(/[^\d+]/g, '')}`}>{p}</a> : null);
  const web = (w: string) => (w ? <a href={/^https?:/.test(w) ? w : `https://${w}`} target="_blank" rel="noopener noreferrer">{w}</a> : null);
  const address = [r.address, r.city, r.region, r.postcode, r.country].filter(Boolean).join(', ');
  switch (entity) {
    case 'contact':
      add('Email', mail(r.email));
      for (const e of r.emails ?? []) add(e.label || 'Other email', mail(e.value));
      add('Phone', tel(r.phone));
      add('Mobile', tel(r.mobile));
      add('Website', web(r.website));
      add('Address', address);
      add('Status', <Chip list={org.settings.contactStatuses} value={r.status} />);
      add('Priority', <Chip list={PRIORITIES} value={r.priority} />);
      add('Source', labelOf(org.settings.sources, r.source));
      add('Owner', <PersonChip id={r.ownerId} />);
      add('Next follow-up', r.nextFollowUp ? <span className={r.nextFollowUp < new Date().toISOString().slice(0, 10) ? 'danger-text' : undefined}>{shortDate(r.nextFollowUp)}</span> : null);
      add('Last contacted', r.lastContactedAt ? timeAgo(r.lastContactedAt) : 'Never');
      break;
    case 'company':
      add('Relationship', <Chip list={org.settings.companyStatuses} value={r.status} />);
      add('Phone', tel(r.phone));
      add('Email', mail(r.email));
      add('Size', labelOf(COMPANY_SIZES, r.size));
      add('Annual revenue', r.annualRevenue !== null ? fmt(r.annualRevenue) : null);
      add('Address', address);
      add('Owner', <PersonChip id={r.ownerId} />);
      add('Contacts', String(r.contactCount));
      add('Open deals', String(r.openDealCount));
      add('Last activity', r.lastActivityAt ? timeAgo(r.lastActivityAt) : null);
      break;
    case 'lead':
      add('Status', <Chip list={org.settings.leadStatuses} value={r.status} />);
      add('Email', mail(r.email));
      add('Phone', tel(r.phone));
      add('Website', web(r.website));
      add('Country', r.country);
      add('Industry', labelOf(org.settings.industries, r.industry));
      add('Source', labelOf(org.settings.sources, r.source));
      add('Estimated value', r.estimatedValue !== null ? fmt(r.estimatedValue) : null);
      add('Priority', <Chip list={PRIORITIES} value={r.priority} />);
      add('Owner', <PersonChip id={r.ownerId} />);
      add('Follow-up', r.followUpDate ? shortDate(r.followUpDate) : null);
      add('Unqualified because', r.unqualifiedReason);
      break;
    case 'deal':
      add('Value', fmt(r.value));
      add('Probability', `${r.effectiveProbability}%${r.probability === null && r.status === 'open' ? ' (from the stage)' : ''}`);
      add('Weighted value', fmt(r.weightedValue));
      add('Status', <Chip list={DEAL_STATUSES} value={r.status} />);
      add('Expected close', r.expectedCloseDate ? shortDate(r.expectedCloseDate) : null);
      add('Owner', <PersonChip id={r.ownerId} />);
      add('Priority', <Chip list={PRIORITIES} value={r.priority} />);
      add('Source', labelOf(org.settings.sources, r.source));
      add('Competitors', r.competitors);
      add('Lost reason', r.lostReason ? labelOf(org.settings.lostReasons, r.lostReason) : null);
      add('In this stage since', shortDate(new Date(r.stageEnteredAt).toISOString()));
      add('Flag', r.flagged ? <span className="row"><Icon name="flag" size={14} /> {r.flagReason || 'Flagged'}</span> : null);
      break;
  }
  for (const f of cfs) {
    const v = r.custom?.[f.id];
    if (v === undefined || v === null || v === '') continue;
    add(f.label, f.type === 'money' ? fmt(Number(v)) : f.type === 'checkbox' ? (v ? 'Yes' : 'No') : f.type === 'date' ? shortDate(String(v)) : Array.isArray(v) ? v.join(', ') : f.type === 'url' ? web(String(v)) : String(v));
  }
  add('Created', dateTime(r.createdAt));
  return (
    <>
      <dl className="crm-props">
        {rows.map(([k, v]) => (
          <div key={k} className="crm-prop">
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {r.description ? <div className="crm-text crm-description">{r.description}</div> : null}
    </>
  );
}

// ------------------------------------------------------------------ timeline

const EVENT_ICON: Record<string, string> = { created: 'plus', updated: 'edit', assigned: 'user', status_changed: 'refresh', stage_changed: 'kanban', won: 'trophy', lost: 'x', reopened: 'restore', converted: 'check', file_uploaded: 'paperclip', file_deleted: 'trash', archive: 'archive', unarchive: 'restore', delete: 'trash', restore: 'restore', completed: 'checkSquare', flagged: 'flag', automation: 'bolt', project_task: 'grid' };

export function Timeline({ entity, id }: { entity: RecordEntity; id: string }) {
  const org = useCurrentOrg();
  const [before, setBefore] = useState<number | null>(null);
  const [pages, setPages] = useState<TimelineItemDTO[]>([]);
  const q = useQuery({ queryKey: ['crm', org.id, 'timeline', entity, id, before], queryFn: () => get<{ items: TimelineItemDTO[]; next: number | null }>(`${crm(org.id, `/timeline/${entity}/${id}`)}${before ? `?before=${before}` : ''}`) });
  const items = useMemo(() => {
    const seen = new Set<string>();
    return [...pages, ...(q.data?.items ?? [])].filter((i) => (seen.has(`${i.kind}:${i.id}`) ? false : (seen.add(`${i.kind}:${i.id}`), true)));
  }, [pages, q.data]);
  if (q.error) return <ErrorBox error={q.error} />;
  if (!q.data && !pages.length) return <Loading />;
  if (!items.length) return <EmptyState icon="history" title="Nothing yet">Activities, notes, documents and changes appear here.</EmptyState>;
  return (
    <ol className="crm-timeline">
      {items.map((i) => (
        <li key={`${i.kind}:${i.id}`} className={`crm-tl-item crm-tl-${i.kind}`}>
          <span className="crm-tl-icon" aria-hidden>
            <Icon name={i.kind === 'activity' ? activityIcon(i.type) : i.kind === 'note' ? 'message' : i.kind === 'file' ? 'paperclip' : (EVENT_ICON[i.type] ?? 'activity')} size={14} />
          </span>
          <div className="grow">
            <div className="row wrap">
              {i.kind === 'activity' ? <Link to={recordPath(org.id, 'activity', i.id)} className="crm-tl-title">{i.title}</Link> : i.kind === 'file' ? <a className="crm-tl-title" href={appUrl(String(i.data?.url ?? ''))} target="_blank" rel="noopener">{i.title}</a> : <span className="crm-tl-title">{i.title}</span>}
              {i.kind === 'activity' ? <span className="muted small">{labelOf(org.settings.activityTypes, i.type)}{i.data?.status === 'open' ? ' · planned' : i.data?.status === 'done' ? ' · done' : ''}{i.data?.emailDirection ? ' · logged' : ''}</span> : null}
              {i.via ? <span className="muted small">on <Link to={recordPath(org.id, i.via.entity, i.via.id)}>{i.via.name}</Link></span> : null}
            </div>
            {i.body ? <div className="crm-text small">{i.kind === 'note' ? <NoteBody body={i.body} /> : i.body}</div> : null}
            <div className="muted small">
              {i.actorName ?? 'Automation'} · <time dateTime={new Date(i.at).toISOString()} title={dateTime(i.at)}>{timeAgo(i.at)}</time>
            </div>
          </div>
        </li>
      ))}
      {q.data?.next ? (
        <li>
          <button className="btn sm" onClick={() => { setPages(items); setBefore(q.data!.next); }}>Show older</button>
        </li>
      ) : null}
    </ol>
  );
}

function RecordActivities({ entity, id }: { entity: RecordEntity; id: string }) {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['crm', org.id, 'record-activities', entity, id], queryFn: () => get<ActivityDTO[]>(crm(org.id, `/${ENTITY_PATH[entity]}/${id}/activities`)) });
  if (!q.data) return <Loading />;
  if (!q.data.length) return <EmptyState icon="calendar" title="No activities yet">Plan a call, meeting or follow-up with the buttons above.</EmptyState>;
  return (
    <div className="crm-activity-list">
      {q.data.map((a) => (
        <ActivityRow key={a.id} a={a} showLinks={entity === 'company'} onChanged={() => q.refetch()} />
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ notes

/** "@[Name](id)" tokens show as highlighted names. */
export function NoteBody({ body }: { body: string }) {
  const parts = body.split(/(@\[[^\]]{1,100}\]\([A-Za-z0-9_-]{8,40}\))/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = /^@\[([^\]]+)\]\(/.exec(p);
        return m ? <span key={i} className="mention">@{m[1]}</span> : <span key={i}>{p}</span>;
      })}
    </>
  );
}

function NoteComposer({ entity, recordId, onAdded }: { entity: RecordEntity; recordId: string; onAdded: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const members = useMembers().data ?? [];
  const [body, setBody] = useState('');
  const [kind, setKind] = useState<'note' | 'comment' | 'meeting'>('note');
  const ref = useRef<HTMLTextAreaElement>(null);
  const mention = (m: { userId: string; name: string }) => {
    const token = `@[${m.name}](${m.userId}) `;
    const el = ref.current;
    const at = el ? el.selectionStart : body.length;
    setBody(body.slice(0, at) + token + body.slice(at));
    setTimeout(() => el?.focus(), 0);
  };
  const submit = async () => {
    if (!body.trim()) return;
    try {
      await post(crm(org.id, '/notes'), { entity, recordId, kind, body });
      setBody('');
      await refresh('notes', 'timeline');
      onAdded();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <textarea ref={ref} className="textarea" rows={2} placeholder="Write a note, a comment for the team or meeting notes. Mention someone to tell them." value={body} onChange={(e) => setBody(e.target.value)} aria-label="Note" onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(); }} />
      <div className="row wrap">
        <select className="select sm" aria-label="Kind of note" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)}>
          <option value="note">Note</option>
          <option value="comment">Internal comment</option>
          <option value="meeting">Meeting notes</option>
        </select>
        <Dropdown label="Mention" width={240} trigger={(open, r) => <button ref={r} type="button" className="btn sm" onClick={open}>@ Mention</button>}>
          {(close) => <>{members.map((m) => <MenuItem key={m.userId} onClick={() => { close(); mention(m); }}>{m.name}</MenuItem>)}</>}
        </Dropdown>
        <span className="grow" />
        <button className="btn primary sm" disabled={!body.trim()} onClick={submit}>Add</button>
      </div>
    </div>
  );
}

function Notes({ entity, id }: { entity: RecordEntity; id: string }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['crm', org.id, 'notes', entity, id], queryFn: () => get<NoteDTO[]>(`${crm(org.id, '/notes')}?entity=${entity}&recordId=${id}`) });
  if (!q.data) return <Loading />;
  if (!q.data.length) return <EmptyState icon="message" title="No notes yet" />;
  return (
    <div className="stack">
      {q.data.map((n) => (
        <article key={n.id} className={`crm-note${n.pinned ? ' pinned' : ''}`}>
          <div className="row">
            <strong>{n.authorName ?? 'Former member'}</strong>
            <span className="muted small">{n.kind === 'comment' ? 'Internal comment' : n.kind === 'meeting' ? 'Meeting notes' : 'Note'} · {timeAgo(n.createdAt)}</span>
            {n.pinned ? <span className="badge accent">Pinned</span> : null}
            <span className="grow" />
            <MenuButton
              label="Note actions"
              items={[
                { label: n.pinned ? 'Unpin' : 'Pin to the top', icon: 'pin', hidden: !org.perms.activities.create, onClick: async () => { await patch(crm(org.id, `/notes/${n.id}`), { pinned: !n.pinned }).catch((e) => toast(errorMessage(e), 'error')); q.refetch(); } },
                { label: 'Delete', icon: 'trash', danger: true, hidden: !n.can.delete, onClick: async () => { if (await confirm({ title: 'Delete this note?', confirmLabel: 'Delete', danger: true })) { await del(crm(org.id, `/notes/${n.id}`)).catch((e) => toast(errorMessage(e), 'error')); q.refetch(); } } },
              ]}
            />
          </div>
          <div className="crm-text"><NoteBody body={n.body} /></div>
        </article>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------ documents

function UploadButton({ entity, recordId, previousId, onDone, label = 'Upload a document' }: { entity: RecordEntity; recordId: string; previousId?: string; onDone: () => void; label?: string }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState('document');
  const [busy, setBusy] = useState(false);
  const [asking, setAsking] = useState<File | null>(null);
  const send = async (file: File) => {
    setBusy(true);
    const form = new FormData();
    form.set('file', file);
    form.set('entity', entity);
    form.set('recordId', recordId);
    form.set('kind', kind);
    if (previousId) form.set('previousId', previousId);
    try {
      await api(crm(org.id, '/files'), { method: 'POST', form });
      toast('Uploaded');
      onDone();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
      setAsking(null);
    }
  };
  return (
    <>
      <button className="btn sm" disabled={busy} onClick={() => input.current?.click()}>
        <Icon name="paperclip" size={14} /> {busy ? 'Uploading…' : label}
      </button>
      <input ref={input} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (!f) return; if (previousId) send(f); else setAsking(f); }} />
      {asking ? (
        <Modal title={`Upload ${asking.name}`} onClose={() => setAsking(null)} footer={<><button className="btn" onClick={() => setAsking(null)}>Cancel</button><button className="btn primary" disabled={busy} onClick={() => send(asking)}>Upload</button></>}>
          <div className="field">
            <label htmlFor="doc-kind">Kind of document</label>
            <select id="doc-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="document">Document</option>
              <option value="proposal">Proposal</option>
              <option value="quote">Quote</option>
              <option value="contract">Contract</option>
              <option value="other">Other</option>
            </select>
          </div>
          <p className="muted small">PDF, Office and OpenDocument files, images, text and CSV, up to 25 MB.</p>
        </Modal>
      ) : null}
    </>
  );
}

function Files({ entity, id }: { entity: RecordEntity; id: string }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['crm', org.id, 'files', entity, id], queryFn: () => get<FileDTO[]>(`${crm(org.id, '/files')}?entity=${entity}&recordId=${id}`) });
  if (!q.data) return <Loading />;
  if (!q.data.length) return <EmptyState icon="paperclip" title="No documents yet">Proposals, quotes, contracts and other files for this record.</EmptyState>;
  const replaced = new Set(q.data.map((f) => f.previousId).filter(Boolean));
  return (
    <table className="data-table">
      <thead>
        <tr><th>Document</th><th>Kind</th><th>Version</th><th>Uploaded</th><th aria-label="Actions" /></tr>
      </thead>
      <tbody>
        {q.data.map((f) => (
          <tr key={f.id} className={replaced.has(f.id) ? 'muted' : undefined}>
            <td><a href={appUrl(f.url)} target="_blank" rel="noopener">{f.fileName}</a> <span className="muted small">{formatBytes(f.size)}</span></td>
            <td className="small">{f.kind[0].toUpperCase() + f.kind.slice(1)}</td>
            <td className="small">{f.version}{replaced.has(f.id) ? ' (replaced)' : ''}</td>
            <td className="small">{f.uploaderName ?? 'Former member'}, {timeAgo(f.createdAt)}</td>
            <td>
              <div className="row">
                <a className="btn ghost icon sm" href={appUrl(`${f.url}?download=1`)} aria-label={`Download ${f.fileName}`}><Icon name="download" size={14} /></a>
                {!replaced.has(f.id) && org.perms.activities.create ? <UploadButton entity={entity} recordId={id} previousId={f.id} label="New version" onDone={() => q.refetch()} /> : null}
                <button className="btn ghost icon sm" aria-label={`Delete ${f.fileName}`} onClick={async () => { if (await confirm({ title: `Delete ${f.fileName}?`, confirmLabel: 'Delete', danger: true })) { await del(crm(org.id, `/files/${f.id}`)).catch((e) => toast(errorMessage(e), 'error')); q.refetch(); } }}>
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ------------------------------------------------------------------ related records

function RelatedContacts({ companyId }: { companyId: string }) {
  const org = useCurrentOrg();
  const [adding, setAdding] = useState(false);
  const q = useQuery({ queryKey: ['crm', org.id, 'related', 'company-contacts', companyId], queryFn: () => get<ListResult<ContactDTO>>(crm(org.id, `/companies/${companyId}/contacts`)) });
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">Contacts ({q.data?.total ?? 0})</h2>
        {org.perms.contacts.create ? <button className="btn ghost sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add</button> : null}
      </div>
      <ul className="crm-related">
        {(q.data?.rows ?? []).map((c) => (
          <li key={c.id}>
            <Link to={recordPath(org.id, 'contact', c.id)}>{c.name}</Link>
            <span className="muted small">{c.jobTitle}</span>
          </li>
        ))}
      </ul>
      {adding ? <RecordFormDialog entity="contact" initial={{ companyId: { id: companyId, name: '' } }} onClose={() => setAdding(false)} onSaved={() => q.refetch()} /> : null}
    </section>
  );
}

function RelatedDeals({ entity, id }: { entity: 'company' | 'contact'; id: string }) {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const [adding, setAdding] = useState(false);
  const q = useQuery({ queryKey: ['crm', org.id, 'related', `${entity}-deals`, id], queryFn: () => get<ListResult<DealDTO>>(crm(org.id, `/${ENTITY_PATH[entity]}/${id}/deals`)) });
  const open = (q.data?.rows ?? []).filter((d) => d.status === 'open');
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">Deals ({q.data?.total ?? 0})</h2>
        {org.perms.deals.create && entity === 'company' ? <button className="btn ghost sm" onClick={() => setAdding(true)}><Icon name="plus" size={14} /> Add</button> : null}
      </div>
      {open.length ? <p className="muted small">Open: {fmt(open.reduce((s, d) => s + d.value, 0))}</p> : null}
      <ul className="crm-related">
        {(q.data?.rows ?? []).map((d) => (
          <li key={d.id}>
            <Link to={recordPath(org.id, 'deal', d.id)}>{d.title}</Link>
            <span className="muted small">{fmt(d.value)} · {d.status === 'open' ? d.stageName : labelOf(DEAL_STATUSES, d.status)}</span>
          </li>
        ))}
      </ul>
      {adding ? <RecordFormDialog entity="deal" initial={{ companyId: { id, name: '' } }} onClose={() => setAdding(false)} onSaved={() => q.refetch()} /> : null}
    </section>
  );
}

// ------------------------------------------------------------------ leads

function LeadScore({ lead }: { lead: LeadDTO }) {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['crm', org.id, 'score', lead.id, lead.updatedAt], queryFn: () => get<{ score: number; parts: { label: string; points: number }[]; locked: boolean; stored: number }>(crm(org.id, `/leads/${lead.id}/score`)) });
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">Lead score</h2>
        <span className="crm-score big" data-level={lead.score >= 70 ? 'high' : lead.score >= 40 ? 'mid' : 'low'}>{lead.score}</span>
      </div>
      {lead.scoreLocked ? <p className="muted small">Set by hand. Clear it in Edit to let the CRM calculate it again.</p> : null}
      <ul className="crm-score-parts small">
        {(q.data?.parts ?? []).map((p) => (
          <li key={p.label}><span>{p.label}</span><span>{p.points > 0 ? `+${p.points}` : p.points}</span></li>
        ))}
      </ul>
    </section>
  );
}

function ConvertButton({ lead }: { lead: LeadDTO }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>
        <Icon name="check" /> Convert
      </button>
      {open ? <ConvertDialog lead={lead} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ConvertDialog({ lead, onClose }: { lead: LeadDTO; onClose: () => void }) {
  const org = useCurrentOrg();
  const navigate = useNavigate();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const pipelines = (usePipelines().data ?? []).filter((p) => !p.archived);
  const preview = useQuery({ queryKey: ['crm', org.id, 'convert-preview', lead.id], queryFn: () => get<{ contacts: { id: string; name: string; detail: string; reason: string }[]; companies: { id: string; name: string; reason: string }[] }>(crm(org.id, `/leads/${lead.id}/convert-preview`)) });
  const [contact, setContact] = useState<string>('create');
  const [company, setCompany] = useState<string>(lead.companyName ? 'create' : 'none');
  const [companyName, setCompanyName] = useState(lead.companyName);
  const [deal, setDeal] = useState(true);
  const [title, setTitle] = useState(`${lead.companyName || lead.name} deal`);
  const [value, setValue] = useState<number | null>(lead.estimatedValue);
  const [pipelineId, setPipelineId] = useState(pipelines.find((p) => p.isDefault)?.id ?? pipelines[0]?.id ?? '');
  const [stageId, setStageId] = useState('');
  const [close, setClose] = useState('');
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [busy, setBusy] = useState(false);
  const stages = pipelines.find((p) => p.id === pipelineId)?.stages ?? [];
  const exactEmail = preview.data?.contacts.some((c) => c.reason.includes('email'));
  const submit = async () => {
    setBusy(true);
    try {
      const r = await post<{ contactId: string; dealId: string | null }>(crm(org.id, `/leads/${lead.id}/convert`), {
        contact: contact === 'create' ? { mode: 'create' } : { mode: 'existing', id: contact },
        company: company === 'create' ? { mode: 'create', name: companyName } : company === 'none' ? { mode: 'none' } : { mode: 'existing', id: company },
        deal: deal ? { create: true, title, value, pipelineId, stageId: stageId || stages[0]?.id, expectedCloseDate: close || null } : { create: false },
        allowDuplicate,
      });
      toast('Lead converted');
      await refresh();
      onClose();
      navigate(r.dealId ? recordPath(org.id, 'deal', r.dealId) : recordPath(org.id, 'contact', r.contactId));
    } catch (e) {
      if (e instanceof ApiError && (e.details as any)?.code === 'DUPLICATE_CONTACT') setContact((e.details as any).contactId);
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`Convert ${lead.name}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy} onClick={submit}>{busy ? 'Converting…' : 'Convert'}</button></>}>
      <div className="stack-lg">
        <fieldset className="crm-fieldset">
          <legend>Contact</legend>
          <label className="checkbox"><input type="radio" name="ct" checked={contact === 'create'} onChange={() => setContact('create')} /> Create a new contact from the lead</label>
          {(preview.data?.contacts ?? []).map((c) => (
            <label key={c.id} className="checkbox"><input type="radio" name="ct" checked={contact === c.id} onChange={() => setContact(c.id)} /> Use {c.name} {c.detail ? `(${c.detail})` : ''} <span className="muted small">{c.reason}</span></label>
          ))}
          {contact === 'create' && exactEmail ? (
            <label className="checkbox warning-text"><input type="checkbox" checked={allowDuplicate} onChange={(e) => setAllowDuplicate(e.target.checked)} /> A contact with this email exists: create a second one anyway</label>
          ) : null}
        </fieldset>
        <fieldset className="crm-fieldset">
          <legend>Company</legend>
          <label className="checkbox"><input type="radio" name="co" checked={company === 'create'} onChange={() => setCompany('create')} /> Create a company</label>
          {company === 'create' ? <input className="input" aria-label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} /> : null}
          {(preview.data?.companies ?? []).map((c) => (
            <label key={c.id} className="checkbox"><input type="radio" name="co" checked={company === c.id} onChange={() => setCompany(c.id)} /> Use {c.name} <span className="muted small">{c.reason}</span></label>
          ))}
          <label className="checkbox"><input type="radio" name="co" checked={company === 'none'} onChange={() => setCompany('none')} /> No company</label>
        </fieldset>
        <fieldset className="crm-fieldset">
          <legend>Deal</legend>
          <label className="checkbox"><input type="checkbox" checked={deal} onChange={(e) => setDeal(e.target.checked)} /> Create a deal</label>
          {deal ? (
            <div className="crm-form-grid">
              <div className="field crm-span"><label htmlFor="cv-title">Title</label><input id="cv-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div className="field"><label htmlFor="cv-value">Value</label><MoneyInput id="cv-value" currency={org.currency} value={value} onChange={setValue} /></div>
              <div className="field"><label htmlFor="cv-close">Expected close</label><input id="cv-close" className="input" type="date" value={close} onChange={(e) => setClose(e.target.value)} /></div>
              <div className="field"><label htmlFor="cv-pipe">Pipeline</label><select id="cv-pipe" className="select" value={pipelineId} onChange={(e) => { setPipelineId(e.target.value); setStageId(''); }}>{pipelines.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div className="field"><label htmlFor="cv-stage">Stage</label><select id="cv-stage" className="select" value={stageId || stages[0]?.id || ''} onChange={(e) => setStageId(e.target.value)}>{stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
            </div>
          ) : null}
        </fieldset>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ deals

function StageBar({ deal }: { deal: DealDTO }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const pipelines = usePipelines().data ?? [];
  const p = pipelines.find((x) => x.id === deal.pipelineId);
  if (!p) return null;
  const idx = p.stages.findIndex((s) => s.id === deal.stageId);
  const move = async (stageId: string) => {
    try {
      await post(crm(org.id, `/deals/${deal.id}/move`), { stageId });
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <nav className="crm-stagebar" aria-label={`Stages of ${p.name}`}>
      {p.stages.map((s, i) => (
        <button key={s.id} className={`crm-stage${i < idx ? ' past' : ''}${i === idx ? ' current' : ''}`} aria-current={i === idx ? 'step' : undefined} disabled={!deal.can.edit || deal.status !== 'open' || i === idx} onClick={() => move(s.id)} title={`${s.name} (${s.probability}%)`}>
          <span className="ellipsis">{s.name}</span>
        </button>
      ))}
      {deal.status !== 'open' ? <span className={`badge ${deal.status === 'won' ? 'success' : 'danger'}`}>{deal.status === 'won' ? 'Won' : 'Lost'}</span> : null}
    </nav>
  );
}

export function DealOutcome({ deal, compact }: { deal: DealDTO; compact?: boolean }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const [losing, setLosing] = useState(false);
  const close = async (outcome: 'won' | 'lost' | 'open', reason?: string) => {
    try {
      await post(crm(org.id, `/deals/${deal.id}/close`), { outcome, reason });
      toast(outcome === 'won' ? 'Deal won' : outcome === 'lost' ? 'Deal marked as lost' : 'Deal reopened');
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  if (deal.status !== 'open') return <button className="btn" onClick={() => close('open')}><Icon name="restore" /> Reopen</button>;
  return (
    <>
      <button className={`btn${compact ? ' sm' : ''} crm-won`} onClick={() => close('won')}><Icon name="trophy" size={compact ? 14 : 16} /> Won</button>
      <button className={`btn${compact ? ' sm' : ''}`} onClick={() => setLosing(true)}><Icon name="x" size={compact ? 14 : 16} /> Lost</button>
      {losing ? <LostDialog onClose={() => setLosing(false)} onLost={(r) => { setLosing(false); close('lost', r); }} /> : null}
    </>
  );
}

export function LostDialog({ onClose, onLost }: { onClose: () => void; onLost: (reason: string) => void }) {
  const org = useCurrentOrg();
  const [reason, setReason] = useState(org.settings.lostReasons[0]?.key ?? '');
  return (
    <Modal title="Why was the deal lost?" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn danger" disabled={!reason} onClick={() => onLost(reason)}>Mark as lost</button></>}>
      <div className="field">
        <label htmlFor="lost-reason">Reason</label>
        <select id="lost-reason" className="select" value={reason} onChange={(e) => setReason(e.target.value)}>
          {org.settings.lostReasons.filter((r) => !r.archived).map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
      </div>
    </Modal>
  );
}

function DealContacts({ deal, onChange }: { deal: DealDTO; onChange: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const save = async (list: { contactId: string; role: string }[]) => {
    try {
      await put(crm(org.id, `/deals/${deal.id}/contacts`), { contacts: list });
      onChange();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const current = deal.contacts.map((c) => ({ contactId: c.id, role: c.role }));
  return (
    <section className="card card-pad">
      <h2 className="crm-subhead">Contacts on the deal</h2>
      <ul className="crm-related">
        {deal.contacts.map((c) => (
          <li key={c.id}>
            <Link to={recordPath(org.id, 'contact', c.id)}>{c.name}</Link>
            {deal.can.edit ? (
              <input className="input sm" aria-label={`Role of ${c.name}`} placeholder="Role, e.g. decision maker" defaultValue={c.role} onBlur={(e) => e.target.value !== c.role && save(current.map((x) => (x.contactId === c.id ? { ...x, role: e.target.value } : x)))} />
            ) : (
              <span className="muted small">{c.role}</span>
            )}
            {deal.can.edit ? <button className="btn ghost icon sm" aria-label={`Remove ${c.name}`} onClick={() => save(current.filter((x) => x.contactId !== c.id))}><Icon name="x" size={12} /></button> : null}
          </li>
        ))}
      </ul>
      {deal.can.edit ? <RecordPicker entity="contact" value={null} placeholder="Add a contact" onChange={(v) => v && !current.some((x) => x.contactId === v.id) && save([...current, { contactId: v.id, role: '' }])} /> : null}
    </section>
  );
}

function DealItems({ deal, onChange }: { deal: DealDTO; onChange: () => void }) {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const toast = useToast();
  const products = useQuery({ queryKey: ['crm', org.id, 'products'], queryFn: () => get<ProductDTO[]>(crm(org.id, '/products')) });
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState(deal.items.map((i) => ({ ...i })));
  const total = items.reduce((s, i) => s + lineTotal(i.unitPrice, Math.round(i.quantity * 1000), Math.round(i.discountPct * 100)), 0);
  const save = async () => {
    try {
      await put(crm(org.id, `/deals/${deal.id}/items`), { items: items.map((i) => ({ productId: i.productId, name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, discountPct: i.discountPct })) });
      setEditing(false);
      onChange();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  if (!deal.items.length && !editing) {
    return deal.can.edit ? (
      <div className="row">
        <button className="btn sm" onClick={() => { setItems([]); setEditing(true); }}><Icon name="plus" size={14} /> Add products or services</button>
      </div>
    ) : null;
  }
  return (
    <section className="card card-pad">
      <div className="row">
        <h2 className="crm-subhead grow">Products and services</h2>
        {deal.can.edit && !editing ? <button className="btn ghost sm" onClick={() => { setItems(deal.items.map((i) => ({ ...i }))); setEditing(true); }}><Icon name="edit" size={14} /> Edit</button> : null}
      </div>
      <div className="crm-table-scroll">
        <table className="data-table">
          <thead><tr><th>Item</th><th>Quantity</th><th>Unit price</th><th>Discount</th><th>Total</th>{editing ? <th aria-label="Remove" /> : null}</tr></thead>
          <tbody>
            {(editing ? items : deal.items).map((i, n) => (
              <tr key={i.id ?? n}>
                <td>{editing ? <input className="input sm" aria-label="Item" value={i.name} onChange={(e) => setItems(items.map((x, j) => (j === n ? { ...x, name: e.target.value } : x)))} /> : i.name}</td>
                <td>{editing ? <input className="input sm crm-num" type="number" min={0} step="any" aria-label="Quantity" value={i.quantity} onChange={(e) => setItems(items.map((x, j) => (j === n ? { ...x, quantity: Number(e.target.value) } : x)))} /> : i.quantity}</td>
                <td>{editing ? <MoneyInput currency={org.currency} ariaLabel="Unit price" value={i.unitPrice} onChange={(v) => setItems(items.map((x, j) => (j === n ? { ...x, unitPrice: v ?? 0 } : x)))} /> : fmt(i.unitPrice)}</td>
                <td>{editing ? <input className="input sm crm-num" type="number" min={0} max={100} aria-label="Discount percent" value={i.discountPct} onChange={(e) => setItems(items.map((x, j) => (j === n ? { ...x, discountPct: Number(e.target.value) } : x)))} /> : `${i.discountPct}%`}</td>
                <td className="crm-num-cell">{fmt(lineTotal(i.unitPrice, Math.round(i.quantity * 1000), Math.round(i.discountPct * 100)))}</td>
                {editing ? <td><button className="btn ghost icon sm" aria-label="Remove item" onClick={() => setItems(items.filter((_, j) => j !== n))}><Icon name="x" size={12} /></button></td> : null}
              </tr>
            ))}
            <tr className="summary-row"><td colSpan={4}>Total (the deal's value)</td><td className="crm-num-cell">{fmt(editing ? total : deal.value)}</td>{editing ? <td /> : null}</tr>
          </tbody>
        </table>
      </div>
      {editing ? (
        <div className="row wrap">
          <select className="select sm" aria-label="Add a product" value="" onChange={(e) => {
            const p = products.data?.find((x) => x.id === e.target.value);
            if (p) setItems([...items, { id: '', productId: p.id, name: p.name, quantity: 1, unitPrice: p.unitPrice, discountPct: 0, total: p.unitPrice }]);
          }}>
            <option value="">Add from the catalogue…</option>
            {(products.data ?? []).filter((p) => p.active).map((p) => <option key={p.id} value={p.id}>{p.name} ({fmt(p.unitPrice)})</option>)}
          </select>
          <button className="btn sm" onClick={() => setItems([...items, { id: '', productId: null, name: '', quantity: 1, unitPrice: 0, discountPct: 0, total: 0 }])}>Add a line</button>
          <span className="grow" />
          <button className="btn sm" onClick={() => setEditing(false)}>Cancel</button>
          <button className="btn primary sm" disabled={items.some((i) => !i.name.trim())} onClick={save}>Save</button>
        </div>
      ) : null}
      <p className="muted small">With products and services, the deal's value is their total.</p>
    </section>
  );
}

function StageHistory({ dealId }: { dealId: string }) {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['crm', org.id, 'deal-history', dealId], queryFn: () => get<{ id: string; fromStage: string | null; toStage: string | null; fromStatus: string | null; toStatus: string; timeInStageMs: number | null; by: string | null; at: number }[]>(crm(org.id, `/deals/${dealId}/history`)) });
  if (!q.data?.length) return null;
  return (
    <section className="card card-pad">
      <h2 className="crm-subhead">Stage history</h2>
      <ol className="crm-history small">
        {q.data.map((h) => (
          <li key={h.id}>
            <strong>{h.fromStatus === null ? `Created in ${h.toStage}` : h.toStatus !== h.fromStatus ? (h.toStatus === 'won' ? 'Won' : h.toStatus === 'lost' ? 'Lost' : 'Reopened') : `${h.fromStage} → ${h.toStage}`}</strong>
            {h.timeInStageMs !== null && h.fromStatus !== null ? <span className="muted"> after {Math.max(0, Math.round(h.timeInStageMs / 86_400_000))} days in {h.fromStage}</span> : null}
            <span className="muted"> · {h.by ?? 'Automation'} · {dateTime(h.at)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export { FIELDS, optionsOf, usePeople };
export type { PipelineDTO };
