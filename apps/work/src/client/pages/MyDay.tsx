import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { useWorkspace } from '../lib/session';
import { formatDuration, todayISO } from '../lib/format';
import { addDays, startOfWeek } from '../../shared/dates';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Dropdown, MenuItem, Modal, useToast } from '../components/ui/overlays';
import { useMyWork, type WorkItem } from './MyWork';
import '../styles/admin.css';

interface PlannerEntry {
  id: string;
  itemId: string;
  itemName: string;
  boardId: string;
  boardName: string;
  day: string;
  position: number;
  done: boolean;
  itemCompleted: boolean;
}

interface Timer {
  id: string;
  item_id: string;
  started_at: number;
  item_name: string;
  board_id: string;
  workspace_id: string;
}

const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dayLabel(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export function RunningTimer() {
  const q = useQuery({ queryKey: ['timer'], queryFn: () => get<Timer | null>('/me/timer'), refetchInterval: 60_000 });
  const [now, setNow] = useState(Date.now());
  const qc = useQueryClient();
  const toast = useToast();
  useEffect(() => {
    if (!q.data) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [q.data]);
  if (!q.data) return null;
  const t = q.data;
  const secs = Math.max(0, Math.round((now - t.started_at) / 1000));
  const stop = async () => {
    try {
      await post(`/items/${t.item_id}/time/stop`);
      qc.invalidateQueries({ queryKey: ['timer'] });
      qc.invalidateQueries({ queryKey: ['item', t.item_id] });
      toast(`Logged ${formatDuration(secs)}`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="timer-bar" role="status">
      <Icon name="clock" />
      <span className="grow">
        Tracking time on{' '}
        <Link to={`/w/${t.workspace_id}/boards/${t.board_id}?item=${t.item_id}`}>
          <strong>{t.item_name}</strong>
        </Link>
      </span>
      <span className="mono" aria-label="Elapsed time">
        {String(Math.floor(secs / 3600)).padStart(2, '0')}:{String(Math.floor((secs % 3600) / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}
      </span>
      <button className="btn sm" onClick={stop}>
        <Icon name="stop" size={13} /> Stop
      </button>
    </div>
  );
}

export default function MyDay() {
  const ws = useWorkspace();
  const today = todayISO();
  const [weekStart, setWeekStart] = useState(startOfWeek(today));
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const from = days[0];
  const key = ['planner', ws.id, from, days[6]];
  const q = useQuery({ queryKey: key, queryFn: () => get<PlannerEntry[]>(`/workspaces/${ws.id}/planner?from=${from}&to=${days[6]}`) });
  const todayQ = useQuery({ queryKey: ['planner', ws.id, today, today], queryFn: () => get<PlannerEntry[]>(`/workspaces/${ws.id}/planner?from=${today}&to=${today}`) });
  const qc = useQueryClient();
  const toast = useToast();
  const [picker, setPicker] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropDay, setDropDay] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ['planner', ws.id] });
  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const toggle = (e: PlannerEntry) => run(() => patch(`/planner/${e.id}`, { done: !e.done }));
  const remove = (e: PlannerEntry) => run(() => del(`/planner/${e.id}`));
  const move = (e: PlannerEntry, day: string) => {
    if (day === e.day) return;
    return run(() => patch(`/planner/${e.id}`, { day }));
  };

  if (q.isLoading) return <Loading />;
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  const entries = q.data ?? [];
  const todays = todayQ.data ?? [];
  const doneToday = todays.filter((e) => e.done).length;

  const card = (e: PlannerEntry, compact = false) => (
    <div
      key={e.id}
      className={`planner-card${e.done ? ' done' : ''}`}
      draggable
      onDragStart={(ev) => {
        setDragId(e.id);
        ev.dataTransfer.setData('text/plain', e.id);
        ev.dataTransfer.effectAllowed = 'move';
      }}
      onDragEnd={() => {
        setDragId(null);
        setDropDay(null);
      }}
    >
      <input type="checkbox" checked={e.done} onChange={() => toggle(e)} aria-label={`Mark ${e.itemName} ${e.done ? 'not done' : 'done'}`} style={{ marginTop: 2, accentColor: 'var(--accent)' }} />
      <div className="planner-name">
        <Link to={`/w/${ws.id}/boards/${e.boardId}?item=${e.itemId}`} style={{ color: 'inherit' }}>{e.itemName}</Link>
        {!compact ? <div className="muted small ellipsis">{e.boardName}</div> : null}
      </div>
      <Dropdown
        align="end"
        label="Move to"
        trigger={(open, ref) => (
          <button ref={ref} className="btn ghost icon sm" aria-label={`Actions for ${e.itemName}`} onClick={open}>
            <Icon name="moreV" size={14} />
          </button>
        )}
      >
        {(close) => (
          <>
            {days.map((d, i) => (
              <MenuItem key={d} icon="calendar" active={d === e.day} onClick={() => { close(); move(e, d); }}>
                {DOW[i]} {dayLabel(d)}
              </MenuItem>
            ))}
            <MenuItem icon="trash" danger onClick={() => { close(); remove(e); }}>Remove from plan</MenuItem>
          </>
        )}
      </Dropdown>
    </div>
  );

  return (
    <div className="page">
      <PageHeader icon="sun" title="My Day" subtitle="Plan what you'll focus on today and through the week." />
      <RunningTimer />

      <section className="card card-pad" style={{ marginBottom: 20 }} aria-labelledby="today-h">
        <div className="row" style={{ marginBottom: 10 }}>
          <h2 id="today-h" className="grow">
            Today · {dayLabel(today)} <span className="muted small">{todays.length ? `${doneToday}/${todays.length} done` : ''}</span>
          </h2>
          <button className="btn primary sm" onClick={() => setPicker(today)}><Icon name="plus" size={14} /> Add to today</button>
        </div>
        {todays.length === 0 ? (
          <EmptyState icon="sun" title="Your day is wide open">Pick items assigned to you and plan them for today.</EmptyState>
        ) : (
          <div className="col" style={{ gap: 6 }}>{todays.map((e) => card(e))}</div>
        )}
      </section>

      <section aria-labelledby="week-h">
        <div className="row" style={{ marginBottom: 10 }}>
          <h2 id="week-h" className="grow">Weekly planning</h2>
          <button className="btn icon sm" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}><Icon name="chevronLeft" /></button>
          <button className="btn sm" onClick={() => setWeekStart(startOfWeek(today))}>This week</button>
          <button className="btn icon sm" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}><Icon name="chevronRight" /></button>
        </div>
        <div className="week-grid">
          {days.map((d, i) => {
            const list = entries.filter((e) => e.day === d);
            return (
              <div
                key={d}
                className={`day-col${d === today ? ' today' : ''}${dropDay === d ? ' drop-target' : ''}`}
                onDragOver={(ev) => {
                  if (!dragId) return;
                  ev.preventDefault();
                  setDropDay(d);
                }}
                onDragLeave={() => setDropDay((x) => (x === d ? null : x))}
                onDrop={(ev) => {
                  ev.preventDefault();
                  const e = entries.find((x) => x.id === (dragId ?? ev.dataTransfer.getData('text/plain')));
                  setDropDay(null);
                  setDragId(null);
                  if (e) move(e, d);
                }}
                aria-label={`${DOW[i]} ${dayLabel(d)}`}
              >
                <div className="day-col-head">
                  <span className="grow">{DOW[i]} <span className="muted">{dayLabel(d)}</span></span>
                  <button className="btn ghost icon sm" aria-label={`Add item to ${DOW[i]}`} onClick={() => setPicker(d)}><Icon name="plus" size={14} /></button>
                </div>
                {list.map((e) => card(e, true))}
                {!list.length ? <div className="muted small" style={{ padding: 4 }}>Drop items here</div> : null}
              </div>
            );
          })}
        </div>
      </section>
      {picker ? <ItemPicker wsId={ws.id} day={picker} planned={new Set(entries.filter((e) => e.day === picker).map((e) => e.itemId))} onClose={() => setPicker(null)} onAdded={refresh} /> : null}
    </div>
  );
}

function ItemPicker({ wsId, day, planned, onClose, onAdded }: { wsId: string; day: string; planned: Set<string>; onClose: () => void; onAdded: () => void }) {
  const work = useMyWork(wsId);
  const [q, setQ] = useState('');
  const toast = useToast();
  const items: WorkItem[] = work.data ? [...work.data.overdue, ...work.data.today, ...work.data.upcoming, ...work.data.later, ...work.data.noDate] : [];
  const filtered = items.filter((w) => !q || w.item.name.toLowerCase().includes(q.toLowerCase()) || w.boardName.toLowerCase().includes(q.toLowerCase()));
  const add = async (w: WorkItem) => {
    try {
      await post(`/workspaces/${wsId}/planner`, { itemId: w.item.id, day });
      onAdded();
      toast(`Planned "${w.item.name}"`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Modal title={`Plan for ${dayLabel(day)}`} onClose={onClose} wide footer={<button className="btn" onClick={onClose}>Done</button>}>
      <input className="input" placeholder="Filter your assigned items…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter items" style={{ marginBottom: 10 }} />
      {work.isLoading ? <Loading /> : null}
      {work.data && items.length === 0 ? <EmptyState icon="checkSquare" title="No open items assigned to you" /> : null}
      <div className="list">
        {filtered.map((w) => {
          const already = planned.has(w.item.id);
          return (
            <div key={w.item.id} className="list-row">
              <span className="grow" style={{ minWidth: 0 }}>
                <span className="ellipsis" style={{ display: 'block' }}>{w.item.name}</span>
                <span className="muted small">{w.boardName}{w.due ? ` · due ${w.due}` : ''}</span>
              </span>
              <button className="btn sm" disabled={already} onClick={() => add(w)}>{already ? 'Planned' : 'Add'}</button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
