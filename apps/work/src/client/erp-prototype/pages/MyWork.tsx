// My Work: tasks, approvals, follow-ups, reviews and mentions from every module in one list (information
// architecture, section 6). Each item has one primary action that updates its state, with an undo.
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal, useToast } from '../../components/ui/overlays';
import type { WorkItem, WorkType } from '../data/work';
import { daysFrom, fmtDate, money, relDue, TODAY } from '../format';
import { PIcon } from '../icons';
import { Empty, ModuleBadge, OpenInApp, StatusBadge, Tabs } from '../kit';
import { PageHeader, useVisit } from '../shell/PageHeader';
import { openWork, useErp } from '../state';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'tasks', label: 'My tasks' },
  { id: 'approvals', label: 'Approvals' },
  { id: 'today', label: 'Due today' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'waiting', label: 'Waiting' },
  { id: 'mentions', label: 'Mentions' },
];
const TYPE_ICON: Record<WorkType, string> = { Task: 'checkSquare', 'Follow-up': 'phone', Approval: 'signature', Review: 'eye', Mention: 'message', 'Waiting for': 'clock' };
const ACTION: Record<WorkType, string> = { Task: 'Complete', 'Follow-up': 'Complete', Approval: 'Approve', Review: 'Review', Mention: 'Reply', 'Waiting for': 'Remind' };

function inTab(w: WorkItem, tab: string) {
  const open = ['Open', 'Waiting'].includes(w.status);
  switch (tab) {
    case 'tasks':
      return w.type === 'Task' || w.type === 'Follow-up';
    case 'approvals':
      return w.type === 'Approval';
    case 'today':
      return w.due === TODAY;
    case 'overdue':
      return !!w.due && w.due < TODAY && open;
    case 'waiting':
      return w.type === 'Waiting for';
    case 'mentions':
      return w.type === 'Mention';
    default:
      return true;
  }
}
function dueGroup(w: WorkItem) {
  if (!['Open', 'Waiting'].includes(w.status)) return 'Finished in this visit';
  if (!w.due) return 'No due date';
  const d = daysFrom(w.due);
  return d < 0 ? 'Overdue' : d === 0 ? 'Today' : d <= 7 ? 'This week' : 'Later';
}
const GROUP_ORDER = ['Overdue', 'Today', 'This week', 'Later', 'No due date', 'Finished in this visit'];

export function MyWork() {
  const { work, updateWork } = useErp();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = TABS.some((t) => t.id === params.get('tab')) ? (params.get('tab') as string) : 'all';
  const [groupBy, setGroupBy] = useState<'due' | 'module' | 'type'>('due');
  const [dialog, setDialog] = useState<{ item: WorkItem; mode: 'approve' | 'return' | 'reply' | 'review' } | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  useVisit('/my-work', 'My Work');
  const items = work.filter((w) => inTab(w, tab));
  const keyOf = (w: WorkItem) => (groupBy === 'due' ? dueGroup(w) : groupBy === 'module' ? w.module : w.type);
  const groups = Array.from(new Set(items.map(keyOf))).sort((a, b) => (groupBy === 'due' ? GROUP_ORDER.indexOf(a) - GROUP_ORDER.indexOf(b) : a.localeCompare(b)));

  const finish = (w: WorkItem, status: string, note?: string) => {
    const before = w.status;
    updateWork(w.id, { status });
    toast(`${note ?? `${ACTION[w.type]}d`}: ${w.title}`, 'info', { label: 'Undo', run: () => updateWork(w.id, { status: before }) });
  };
  const primary = (w: WorkItem) => {
    if (w.type === 'Approval') return setDialog({ item: w, mode: 'approve' });
    if (w.type === 'Mention') return setDialog({ item: w, mode: 'reply' });
    if (w.type === 'Review') return setDialog({ item: w, mode: 'review' });
    if (w.type === 'Waiting for') return finish(w, 'Reminded', 'Reminder sent');
    finish(w, 'Done', 'Completed');
  };
  const submitDialog = () => {
    if (!dialog) return;
    const { item, mode } = dialog;
    if ((mode === 'return' || mode === 'reply') && !comment.trim()) {
      setError(mode === 'return' ? 'Say what needs to change.' : 'Write a reply.');
      return;
    }
    if (mode === 'approve') finish(item, 'Approved', 'Approved');
    if (mode === 'return') finish(item, 'Returned', 'Returned with comment');
    if (mode === 'reply') finish(item, 'Replied', 'Reply sent');
    if (mode === 'review') finish(item, 'Reviewed', 'Reviewed');
    setDialog(null);
    setComment('');
    setError('');
  };
  const counts = Object.fromEntries(TABS.map((t) => [t.id, openWork(work).filter((w) => inTab(w, t.id)).length]));
  return (
    <div className="erp-page erp-mywork">
      <PageHeader crumbs={[{ label: 'Home', to: '/' }, { label: 'My Work' }]} title="My Work" states={['C']} pinPath="/my-work" pinLabel="My Work" subtitle="Tasks from Project Management, approvals from Finance and ERP, follow-ups from the CRM, reviews and mentions. Demonstration items." />
      <Tabs tabs={TABS.map((t) => ({ ...t, count: counts[t.id] }))} active={tab} onChange={(t) => setParams(t === 'all' ? {} : { tab: t }, { replace: true })} label="My Work filters" />
      <div className="erp-toolbar">
        <label htmlFor="mw-group" className="small muted">
          Group by
        </label>
        <select id="mw-group" className="select sm erp-size" value={groupBy} onChange={(e) => setGroupBy(e.target.value as 'due' | 'module' | 'type')}>
          <option value="due">Due date</option>
          <option value="module">Module</option>
          <option value="type">Type</option>
        </select>
        <span className="spacer" />
        <span className="muted small" aria-live="polite">
          {items.filter((w) => ['Open', 'Waiting'].includes(w.status)).length} open
        </span>
      </div>
      <div role="tabpanel" aria-label={TABS.find((t) => t.id === tab)?.label}>
        {!items.length ? (
          <Empty icon="checkSquare" title="Nothing here">
            Items assigned to you, waiting for your approval or mentioning you appear here.
          </Empty>
        ) : (
          groups.map((g) => (
            <section key={g} className="erp-mw-group" aria-labelledby={`g-${g.replace(/\W+/g, '')}`}>
              <h2 id={`g-${g.replace(/\W+/g, '')}`} className="erp-mw-head">
                {g} <span className="muted">({items.filter((w) => keyOf(w) === g).length})</span>
              </h2>
              <ul className="erp-mw-list">
                {items
                  .filter((w) => keyOf(w) === g)
                  .map((w) => {
                    const open = ['Open', 'Waiting'].includes(w.status);
                    const overdue = open && w.due && w.due < TODAY;
                    return (
                      <li key={w.id} className={`erp-mw-item${open ? '' : ' finished'}`} data-hl={w.id}>
                        <span className={`erp-mw-icon t-${w.type.replace(/\W+/g, '').toLowerCase()}`} aria-hidden>
                          <PIcon name={TYPE_ICON[w.type]} />
                        </span>
                        <div className="erp-mw-main">
                          <div className="erp-mw-title">
                            <span className="sr-only">{w.type}: </span>
                            <Link to={w.to}>{w.title}</Link>
                          </div>
                          <div className="erp-mw-meta">
                            <span className="erp-mw-type">{w.type}</span>
                            <ModuleBadge module={w.module} />
                            <span className={overdue ? 'danger-text' : undefined}>{w.due ? `${relDue(w.due)} · ${fmtDate(w.due)}` : 'No due date'}</span>
                            <span>{w.who}</span>
                            {w.amount ? <span>{money(w.amount, true)}</span> : null}
                          </div>
                        </div>
                        <div className="erp-mw-actions">
                          <StatusBadge status={overdue ? 'Overdue' : w.status} />
                          {open ? (
                            <>
                              <button type="button" className="btn primary sm" onClick={() => primary(w)} data-hl={`action-${w.id}`}>
                                {ACTION[w.type]}
                              </button>
                              {w.type === 'Approval' ? (
                                <button type="button" className="btn sm" onClick={() => setDialog({ item: w, mode: 'return' })}>
                                  Return
                                </button>
                              ) : null}
                            </>
                          ) : (
                            <button type="button" className="btn ghost sm" onClick={() => updateWork(w.id, { status: w.type === 'Waiting for' ? 'Waiting' : 'Open' })}>
                              Undo
                            </button>
                          )}
                          {w.module === 'ERP' ? (
                            <Link className="btn ghost sm" to={w.to}>
                              Open in ERP
                            </Link>
                          ) : (
                            <OpenInApp module={w.module} className="btn ghost sm" />
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))
        )}
      </div>
      {dialog ? (
        <Modal
          title={dialog.mode === 'approve' ? 'Approve' : dialog.mode === 'return' ? 'Return with comment' : dialog.mode === 'reply' ? 'Reply' : 'Review'}
          onClose={() => setDialog(null)}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDialog(null)}>
                Cancel
              </button>
              <button type="button" className="btn primary" onClick={submitDialog}>
                {dialog.mode === 'approve' ? 'Approve' : dialog.mode === 'return' ? 'Return' : dialog.mode === 'reply' ? 'Send reply' : 'Mark as reviewed'}
              </button>
            </>
          }
        >
          <p>
            <strong>{dialog.item.title}</strong>
          </p>
          <p className="muted small">
            {dialog.item.who}
            {dialog.item.amount ? ` · ${money(dialog.item.amount, true)}` : ''}
          </p>
          <div className="field">
            <label htmlFor="mw-comment">{dialog.mode === 'return' ? 'What needs to change' : dialog.mode === 'reply' ? 'Your reply' : 'Comment (optional)'}</label>
            <textarea
              id="mw-comment"
              className={`textarea${error ? ' invalid' : ''}`}
              value={comment}
              aria-invalid={!!error}
              aria-describedby={error ? 'mw-error' : undefined}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
            />
            {error ? (
              <span id="mw-error" className="error" role="alert">
                {error}
              </span>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

