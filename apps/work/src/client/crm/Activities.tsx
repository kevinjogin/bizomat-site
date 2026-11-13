// Activities, tasks and follow-ups: the grouped lists (mine, today, overdue, upcoming, team, completed), completing in
// one click, the calendar, logging emails and turning an activity into a project task.
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { appUrl } from '../lib/base';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { usePageTitle } from '../lib/hooks';
import { ACTIVITY_STATUSES, PRIORITIES, TASK_TYPES } from '../../shared/crm/defaults';
import { DEFAULT_VIEWS, type FilterCond, type ListQuery } from '../../shared/crm/fields';
import type { ActivityDTO, EmailTemplateDTO, ListResult } from '../../shared/crm/types';
import { Chip, MenuButton, PersonChip, RecordLink, UserSelect } from './ui';
import { RecordFormDialog } from './RecordForm';
import { addDaysIso, crm, dateTime, download, labelOf, recordPath, shortDate, todayLocal, useCurrentOrg, usePeople, useRefreshOrg } from './lib';

const TYPE_ICON: Record<string, string> = { call: 'phone', email: 'mail', meeting: 'users', appointment: 'calendar', follow_up: 'refresh', presentation: 'chart', demo: 'play', proposal: 'doc', visit: 'map', task: 'checkSquare', general: 'activity' };
export const activityIcon = (type: string) => TYPE_ICON[type] ?? 'activity';

/** The form's starting values from an activity (links as {id, name}). */
export function activityInitial(a: ActivityDTO) {
  return { ...a, contactId: a.contact, companyId: a.company, dealId: a.deal, leadId: a.lead };
}

export function ActivityRow({ a, showLinks = true, onChanged }: { a: ActivityDTO; showLinks?: boolean; onChanged?: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const confirm = useConfirm();
  const refresh = useRefreshOrg();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [toTask, setToTask] = useState(false);
  // The box follows the click at once; the server's answer then refreshes the lists (or puts it back on an error).
  const [pending, setPending] = useState<boolean | null>(null);
  const done = pending ?? a.status === 'done';
  const toggle = async () => {
    const next = !done;
    setPending(next);
    try {
      await patch(crm(org.id, `/activities/${a.id}`), { status: next ? 'done' : 'open' });
      await refresh();
      onChanged?.();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setPending(null);
    }
  };
  return (
    <div className={`crm-activity${done ? ' done' : ''}${a.overdue ? ' overdue' : ''}`}>
      <input type="checkbox" className="crm-activity-check" checked={done} disabled={a.status === 'cancelled'} onChange={toggle} aria-label={done ? `Reopen ${a.title}` : `Complete ${a.title}`} />
      <span className="crm-activity-icon" aria-hidden>
        <Icon name={activityIcon(a.type)} size={15} />
      </span>
      <div className="grow crm-activity-body">
        <div className="row wrap">
          <Link to={recordPath(org.id, 'activity', a.id)} className="crm-activity-title">{a.title}</Link>
          <span className="muted small">{labelOf(org.settings.activityTypes, a.type)}</span>
          {a.priority === 'high' || a.priority === 'urgent' ? <Chip list={PRIORITIES} value={a.priority} /> : null}
          {a.emailDirection ? <span className="badge">{a.emailDirection === 'outbound' ? 'Email sent' : 'Email received'} (logged)</span> : null}
          {a.pmItem ? <a className="badge accent" href={`/tasks/w/${a.pmItem.workspaceId}/tasks/${a.pmItem.itemId}`}>Project task</a> : null}
        </div>
        <div className="row wrap small muted">
          {a.dueDate ? (
            <span className={a.overdue ? 'danger-text' : undefined}>
              <Icon name="clock" size={12} /> {a.overdue ? 'Overdue: ' : ''}
              {shortDate(a.dueDate)}
              {a.dueTime ? ` ${a.dueTime}` : ''}
            </span>
          ) : null}
          {done && a.doneAt ? <span>Done {dateTime(a.doneAt)}</span> : null}
          <PersonChip id={a.assignedTo} small />
          {showLinks ? (
            <>
              {a.deal ? <RecordLink entity="deal" refDto={a.deal} /> : null}
              {a.contact ? <RecordLink entity="contact" refDto={a.contact} /> : null}
              {a.company && !a.deal && !a.contact ? <RecordLink entity="company" refDto={a.company} /> : null}
              {a.lead ? <RecordLink entity="lead" refDto={a.lead} /> : null}
            </>
          ) : null}
        </div>
        {done && a.outcome ? <div className="small crm-outcome">{a.outcome}</div> : null}
      </div>
      <MenuButton
        label={`Actions for ${a.title}`}
        items={[
          { label: 'Open', icon: 'eye', onClick: () => navigate(recordPath(org.id, 'activity', a.id)) },
          { label: 'Edit', icon: 'edit', onClick: () => setEditing(true), hidden: !a.can.edit },
          { label: 'Add to my calendar (.ics)', icon: 'calendar', onClick: () => download(appUrl(`/api${crm(org.id, `/activities/${a.id}/ics`)}`)), hidden: !a.dueDate },
          { label: 'Create a project task', icon: 'grid', onClick: () => setToTask(true), hidden: !!a.pmItem },
          {
            label: 'Delete',
            icon: 'trash',
            danger: true,
            hidden: !a.can.delete,
            onClick: async () => {
              if (!(await confirm({ title: `Delete “${a.title}”?`, message: 'It can be restored from Deleted.', confirmLabel: 'Delete', danger: true }))) return;
              await del(crm(org.id, `/activities/${a.id}`)).catch((e) => toast(errorMessage(e), 'error'));
              await refresh();
            },
          },
        ]}
      />
      {editing ? <RecordFormDialog entity="activity" initial={activityInitial(a)} onClose={() => setEditing(false)} onSaved={() => onChanged?.()} /> : null}
      {toTask ? <ProjectTaskDialog activity={a} onClose={() => setToTask(false)} /> : null}
    </div>
  );
}

/** Group activities under Overdue, Today, Tomorrow, This week, Later, No date, Completed. */
function groups(list: ActivityDTO[]) {
  const today = todayLocal();
  const tomorrow = addDaysIso(today, 1);
  const week = addDaysIso(today, 7);
  const out: { label: string; items: ActivityDTO[] }[] = [
    { label: 'Overdue', items: [] },
    { label: 'Today', items: [] },
    { label: 'Tomorrow', items: [] },
    { label: 'Next seven days', items: [] },
    { label: 'Later', items: [] },
    { label: 'No date', items: [] },
    { label: 'Completed', items: [] },
  ];
  for (const a of list) {
    if (a.status !== 'open') out[6].items.push(a);
    else if (!a.dueDate) out[5].items.push(a);
    else if (a.dueDate < today) out[0].items.push(a);
    else if (a.dueDate === today) out[1].items.push(a);
    else if (a.dueDate === tomorrow) out[2].items.push(a);
    else if (a.dueDate <= week) out[3].items.push(a);
    else out[4].items.push(a);
  }
  return out.filter((g) => g.items.length);
}

export function ActivitiesPage({ tasks = false }: { tasks?: boolean }) {
  const org = useCurrentOrg();
  const [params, setParams] = useSearchParams();
  const [creating, setCreating] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [type, setType] = useState('');
  const [person, setPerson] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const views = DEFAULT_VIEWS.activity;
  const viewKey = params.get('view') ?? 'mine';
  const view = views.find((v) => v.key === viewKey) ?? views[0];
  const typeKeys = tasks ? [...TASK_TYPES] : type ? [type] : [];
  const filters: FilterCond[] = [...(view.query.filters ?? []), ...(typeKeys.length ? [{ field: 'type', op: 'in' as const, value: typeKeys }] : []), ...(person ? [{ field: 'assignedTo', op: 'in' as const, value: [person] }] : [])];
  const query: ListQuery = { ...view.query, filters, page, pageSize: 100 };
  usePageTitle(tasks ? 'Tasks' : 'Activities');
  const list = useQuery({
    queryKey: ['crm', org.id, 'list', 'activity', 'grouped', JSON.stringify(query)],
    queryFn: () => get<ListResult<ActivityDTO>>(`${crm(org.id, '/activities')}?query=${encodeURIComponent(JSON.stringify(query))}`),
    placeholderData: keepPreviousData,
  });
  const grouped = useMemo(() => groups(list.data?.rows ?? []), [list.data]);
  return (
    <div className="page crm-page">
      <PageHeader
        title={tasks ? 'Tasks' : 'Activities'}
        subtitle={tasks ? 'Tasks and follow-ups for you and your colleagues.' : 'Calls, emails, meetings and every other customer interaction.'}
        icon={tasks ? 'checkSquare' : 'activity'}
        actions={
          org.perms.activities.create ? (
            <>
              {!tasks ? (
                <button className="btn" onClick={() => setEmailing(true)}>
                  <Icon name="mail" /> Log an email
                </button>
              ) : null}
              <button className="btn primary" onClick={() => setCreating(true)}>
                <Icon name="plus" /> {tasks ? 'New task' : 'New activity'}
              </button>
            </>
          ) : null
        }
      />
      <div className="crm-views" role="tablist" aria-label="Views">
        {views.map((v) => (
          <button key={v.key} role="tab" aria-selected={viewKey === v.key} className={`tab${viewKey === v.key ? ' active' : ''}`} onClick={() => { setParams((p) => (p.set('view', v.key), p)); setPage(1); }}>
            {v.name}
          </button>
        ))}
      </div>
      <div className="row wrap crm-toolbar">
        {!tasks ? (
          <select className="select" aria-label="Type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
            <option value="">All types</option>
            {org.settings.activityTypes.filter((t) => !t.archived).map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        ) : null}
        {viewKey !== 'mine' ? <UserSelect value={person} onChange={(v) => { setPerson(v); setPage(1); }} emptyLabel="Everyone" ariaLabel="Assigned to" /> : null}
        {list.isFetching ? <Spinner /> : null}
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      {list.isLoading ? (
        <Loading />
      ) : !grouped.length ? (
        <EmptyState icon={tasks ? 'checkSquare' : 'activity'} title={`Nothing in ${view.name.toLowerCase()}`}>
          {org.perms.activities.create ? 'Plan a call, a meeting or a follow-up and assign it to yourself or a colleague.' : null}
        </EmptyState>
      ) : (
        <div className="stack-lg">
          {grouped.map((g) => (
            <section key={g.label} className="card">
              <h2 className={`crm-group-head${g.label === 'Overdue' ? ' danger-text' : ''}`}>
                {g.label} <span className="muted small">{g.items.length}</span>
              </h2>
              <div className="crm-activity-list">
                {g.items.map((a) => (
                  <ActivityRow key={a.id} a={a} onChanged={() => list.refetch()} />
                ))}
              </div>
            </section>
          ))}
          {list.data && list.data.total > list.data.rows.length + (page - 1) * 100 ? (
            <button className="btn" onClick={() => setPage(page + 1)}>Show more</button>
          ) : null}
        </div>
      )}
      {creating ? <RecordFormDialog entity="activity" initial={tasks ? { type: 'task' } : undefined} onClose={() => setCreating(false)} onSaved={() => list.refetch()} /> : null}
      {emailing ? <EmailDialog onClose={() => setEmailing(false)} /> : null}
    </div>
  );
}

/** One activity on its own page. */
export function ActivityPage() {
  const org = useCurrentOrg();
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const q = useQuery({ queryKey: ['crm', org.id, 'record', 'activity', id], queryFn: () => get<ActivityDTO>(crm(org.id, `/activities/${id}`)) });
  usePageTitle(q.data?.title ?? 'Activity');
  if (q.error) return <div className="page"><ErrorBox error={q.error} /></div>;
  if (!q.data) return <Loading />;
  const a = q.data;
  return (
    <div className="page crm-page">
      <button className="btn ghost sm" onClick={() => navigate(-1)}>
        <Icon name="chevronLeft" size={14} /> Back
      </button>
      <PageHeader
        title={a.title}
        icon={activityIcon(a.type)}
        subtitle={`${labelOf(org.settings.activityTypes, a.type)} · ${labelOf(ACTIVITY_STATUSES, a.status)}`}
        actions={a.can.edit ? <button className="btn" onClick={() => setEditing(true)}><Icon name="edit" /> Edit</button> : null}
      />
      <div className="card card-pad stack">
        <ActivityRow a={a} onChanged={() => q.refetch()} />
        <dl className="crm-props">
          <dt>Due</dt>
          <dd>{a.dueDate ? `${shortDate(a.dueDate)}${a.dueTime ? ` at ${a.dueTime}` : ''}${a.durationMin ? ` for ${a.durationMin} minutes` : ''}` : 'No date'}</dd>
          <dt>Assigned to</dt>
          <dd><PersonChip id={a.assignedTo} /></dd>
          <dt>Priority</dt>
          <dd><Chip list={PRIORITIES} value={a.priority} /></dd>
          {a.location ? (<><dt>Location</dt><dd>{a.location}</dd></>) : null}
          {a.emailTo ? (<><dt>{a.emailDirection === 'inbound' ? 'From' : 'To'}</dt><dd>{a.emailTo}</dd></>) : null}
          <dt>Contact</dt>
          <dd><RecordLink entity="contact" refDto={a.contact} /></dd>
          <dt>Company</dt>
          <dd><RecordLink entity="company" refDto={a.company} /></dd>
          <dt>Deal</dt>
          <dd><RecordLink entity="deal" refDto={a.deal} /></dd>
          {a.lead ? (<><dt>Lead</dt><dd><RecordLink entity="lead" refDto={a.lead} /></dd></>) : null}
          <dt>Created</dt>
          <dd>{dateTime(a.createdAt)}</dd>
        </dl>
        {a.description ? <div className="crm-text">{a.description}</div> : null}
        {a.outcome ? (
          <div>
            <h3 className="crm-subhead">Outcome</h3>
            <div className="crm-text">{a.outcome}</div>
          </div>
        ) : null}
        {a.status === 'open' && a.can.edit ? <OutcomeForm activity={a} onDone={() => q.refetch()} /> : null}
      </div>
      {editing ? <RecordFormDialog entity="activity" initial={activityInitial(a)} onClose={() => setEditing(false)} onSaved={() => q.refetch()} /> : null}
    </div>
  );
}

function OutcomeForm({ activity, onDone }: { activity: ActivityDTO; onDone: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const [text, setText] = useState('');
  return (
    <form
      className="stack"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await patch(crm(org.id, `/activities/${activity.id}`), { status: 'done', outcome: text });
          toast('Completed');
          await refresh();
          onDone();
        } catch (err) {
          toast(errorMessage(err), 'error');
        }
      }}
    >
      <label htmlFor="outcome">What happened? (optional)</label>
      <textarea id="outcome" className="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Outcome, next steps…" />
      <div>
        <button className="btn primary" type="submit">
          <Icon name="check" /> Mark as done
        </button>
      </div>
    </form>
  );
}

// ------------------------------------------------------------------ email

/**
 * Write an email to a contact from a template, open it in the person's own mail program (mailto:), and log it on the
 * timeline. BIZOMAT does not send customer email itself until a mailbox is connected, and says so.
 */
export function EmailDialog({ onClose, to, contact, company, deal, lead }: { onClose: () => void; to?: string; contact?: { id: string; name: string } | null; company?: { id: string; name: string } | null; deal?: { id: string; name: string } | null; lead?: { id: string; name: string } | null }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const templates = useQuery({ queryKey: ['crm', org.id, 'email-templates'], queryFn: () => get<EmailTemplateDTO[]>(crm(org.id, '/email-templates')) });
  const [direction, setDirection] = useState<'outbound' | 'inbound'>('outbound');
  const [address, setAddress] = useState(to ?? '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const fill = (t: string) => t.replace(/\{\{\s*(first_name|contact|company|deal|sender)\s*\}\}/g, (_m, k: string) => (k === 'first_name' ? (contact?.name ?? '').split(' ')[0] : k === 'contact' ? (contact?.name ?? '') : k === 'company' ? (company?.name ?? '') : k === 'deal' ? (deal?.name ?? '') : ''));
  const log = async (openMail: boolean) => {
    if (!subject.trim()) return toast('Give the email a subject', 'error');
    setBusy(true);
    try {
      if (openMail) window.location.href = `mailto:${encodeURIComponent(address)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      await post(crm(org.id, '/emails'), { direction, to: address, subject, body, contactId: contact?.id ?? null, companyId: company?.id ?? null, dealId: deal?.id ?? null, leadId: lead?.id ?? null });
      toast('Email logged on the timeline');
      await refresh();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      wide
      title={direction === 'outbound' ? 'Write an email' : 'Log a received email'}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy} onClick={() => log(false)}>Log only</button>
          {direction === 'outbound' ? (
            <button className="btn primary" disabled={busy || !address} onClick={() => log(true)}>
              <Icon name="mail" /> Open in my email and log
            </button>
          ) : null}
        </>
      }
    >
      <div className="stack">
        <div className="info-box small">
          The message opens in your own email program to send; BIZOMAT logs it on the timeline. Mailbox synchronisation (Gmail, Microsoft 365) is not connected yet: received emails are logged by hand.
        </div>
        <div className="row wrap">
          <label className="checkbox"><input type="radio" name="dir" checked={direction === 'outbound'} onChange={() => setDirection('outbound')} /> Sent</label>
          <label className="checkbox"><input type="radio" name="dir" checked={direction === 'inbound'} onChange={() => setDirection('inbound')} /> Received</label>
          {templates.data?.length ? (
            <select className="select" aria-label="Template" defaultValue="" onChange={(e) => {
              const t = templates.data!.find((x) => x.id === e.target.value);
              if (t) {
                setSubject(fill(t.subject));
                setBody(fill(t.body));
              }
            }}>
              <option value="">Use a template…</option>
              {templates.data.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="em-to">{direction === 'outbound' ? 'To' : 'From'}</label>
          <input id="em-to" className="input" type="email" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="em-subject">Subject</label>
          <input id="em-subject" className="input" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="em-body">Message</label>
          <textarea id="em-body" className="textarea" rows={8} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------ project task

function ProjectTaskDialog({ activity, onClose }: { activity: ActivityDTO; onClose: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const targets = useQuery({ queryKey: ['crm', 'project-targets'], queryFn: () => get<{ boardId: string; boardName: string; workspaceId: string; workspaceName: string }[]>('/crm/project-targets') });
  const [board, setBoard] = useState('');
  const [done, setDone] = useState<{ path: string } | null>(null);
  return (
    <Modal title="Create a project task" onClose={onClose}>
      {done ? (
        <div className="stack">
          <p>The task is in Project Management and links back here.</p>
          <a className="btn primary" href={done.path}>Open the task</a>
        </div>
      ) : targets.isLoading ? (
        <Loading />
      ) : !targets.data?.length ? (
        <p>You have no project in Project Management where you can add tasks. <a href="/tasks/">Open Project Management</a>.</p>
      ) : (
        <form
          className="stack"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const r = await post<{ path: string }>(crm(org.id, `/activities/${activity.id}/project-task`), { boardId: board });
              await refresh();
              setDone(r);
            } catch (err) {
              toast(errorMessage(err), 'error');
            }
          }}
        >
          <p className="muted small">“{activity.title}” becomes a task in the project you choose, with a link back to this CRM activity.</p>
          <div className="field">
            <label htmlFor="pm-board">Project</label>
            <select id="pm-board" className="select" value={board} onChange={(e) => setBoard(e.target.value)} required>
              <option value="">Choose a project</option>
              {targets.data.map((t) => (
                <option key={t.boardId} value={t.boardId}>{t.workspaceName}: {t.boardName}</option>
              ))}
            </select>
          </div>
          <button className="btn primary" type="submit" disabled={!board}>Create task</button>
        </form>
      )}
    </Modal>
  );
}

// ------------------------------------------------------------------ calendar

export function CalendarPage() {
  const org = useCurrentOrg();
  const people = usePeople();
  const [month, setMonth] = useState(() => todayLocal().slice(0, 7));
  const [mine, setMine] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);
  usePageTitle('Calendar');
  const first = `${month}-01`;
  const start = (() => {
    const d = new Date(`${first}T00:00:00`);
    const dow = (d.getDay() + 6) % 7; // Monday first
    d.setDate(d.getDate() - dow);
    return d;
  })();
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const query: ListQuery = {
    filters: [{ field: 'dueDate', op: 'after', value: addDaysIso(days[0], -1) }, { field: 'dueDate', op: 'before', value: addDaysIso(days[41], 1) }, { field: 'status', op: 'not_in', value: ['cancelled'] }, ...(mine ? [{ field: 'assignedTo', op: 'in' as const, value: ['me'] }] : [])],
    sort: { field: 'dueDate', dir: 'asc' },
    pageSize: 200,
  };
  const list = useQuery({ queryKey: ['crm', org.id, 'list', 'activity', 'calendar', JSON.stringify(query)], queryFn: () => get<ListResult<ActivityDTO>>(`${crm(org.id, '/activities')}?query=${encodeURIComponent(JSON.stringify(query))}`), placeholderData: keepPreviousData });
  const byDay = new Map<string, ActivityDTO[]>();
  for (const a of list.data?.rows ?? []) byDay.set(a.dueDate!, [...(byDay.get(a.dueDate!) ?? []), a]);
  for (const l of byDay.values()) l.sort((x, y) => String(x.dueTime ?? '99').localeCompare(String(y.dueTime ?? '99')));
  const shift = (n: number) => {
    const d = new Date(`${first}T00:00:00`);
    d.setMonth(d.getMonth() + n);
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };
  const today = todayLocal();
  return (
    <div className="page crm-page">
      <PageHeader
        title="Calendar"
        icon="calendar"
        subtitle="Meetings, calls and follow-ups by day. Subscribe from your own calendar in Settings."
        actions={
          <>
            <label className="checkbox">
              <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} /> Only mine
            </label>
            <Link className="btn" to={`/o/${org.id}/settings/calendar`}><Icon name="link" /> Calendar feed</Link>
          </>
        }
      />
      <div className="row crm-toolbar">
        <button className="btn icon" onClick={() => shift(-1)} aria-label="Previous month"><Icon name="chevronLeft" /></button>
        <h2 className="crm-month">{new Date(`${first}T00:00:00`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
        <button className="btn icon" onClick={() => shift(1)} aria-label="Next month"><Icon name="chevronRight" /></button>
        <button className="btn sm" onClick={() => setMonth(today.slice(0, 7))}>Today</button>
        {list.isFetching ? <Spinner /> : null}
      </div>
      <div className="crm-cal" role="grid" aria-label="Month">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="crm-cal-dow" role="columnheader">{d}</div>
        ))}
        {days.map((d) => (
          <div key={d} role="gridcell" className={`crm-cal-day${d.slice(0, 7) !== month ? ' other' : ''}${d === today ? ' today' : ''}`}>
            <div className="row">
              <span className="crm-cal-num">{Number(d.slice(8))}</span>
              <span className="grow" />
              {org.perms.activities.create ? (
                <button className="btn ghost icon sm crm-cal-add" aria-label={`New activity on ${d}`} onClick={() => setCreating(d)}>
                  <Icon name="plus" size={12} />
                </button>
              ) : null}
            </div>
            {(byDay.get(d) ?? []).slice(0, 4).map((a) => (
              <Link key={a.id} to={recordPath(org.id, 'activity', a.id)} className={`crm-cal-item${a.status === 'done' ? ' done' : ''}${a.overdue ? ' overdue' : ''}`} title={`${a.title} · ${people.name(a.assignedTo)}`}>
                <Icon name={activityIcon(a.type)} size={11} /> {a.dueTime ? `${a.dueTime} ` : ''}
                {a.title}
              </Link>
            ))}
            {(byDay.get(d)?.length ?? 0) > 4 ? <span className="muted small">+{byDay.get(d)!.length - 4} more</span> : null}
          </div>
        ))}
      </div>
      {creating ? <RecordFormDialog entity="activity" initial={{ type: 'meeting', dueDate: creating }} onClose={() => setCreating(null)} onSaved={() => list.refetch()} /> : null}
    </div>
  );
}
