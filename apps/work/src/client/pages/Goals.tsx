import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { canEdit, isAdmin, useMembers, useUser, useWorkspace } from '../lib/session';
import { formatDate } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Field, Loading, PageHeader, ProgressBar } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, Modal, useConfirm, useToast } from '../components/ui/overlays';
import { useBoards } from '../components/layout/CreateDialogs';
import '../styles/content.css';

export interface GoalDTO {
  id: string;
  parentGoalId: string | null;
  title: string;
  description: string;
  ownerId: string | null;
  status: GoalStatus;
  progressMode: 'manual' | 'boards';
  startValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string | null;
  dueDate: string | null;
  boardIds: string[];
  progress: { percent: number; done?: number; total?: number };
  createdBy?: string;
  archivedAt: number | null;
}

type GoalStatus = 'on_track' | 'at_risk' | 'off_track' | 'achieved' | 'cancelled';

export const GOAL_STATUS: Record<GoalStatus, { label: string; cls: string; color: string }> = {
  on_track: { label: 'On track', cls: 'success', color: 'var(--success)' },
  at_risk: { label: 'At risk', cls: 'warning', color: 'var(--warning)' },
  off_track: { label: 'Off track', cls: 'danger', color: 'var(--danger)' },
  achieved: { label: 'Achieved', cls: 'accent', color: 'var(--accent)' },
  cancelled: { label: 'Cancelled', cls: '', color: 'var(--text-3)' },
};

export default function Goals() {
  const ws = useWorkspace();
  const user = useUser();
  const [params, setParams] = useSearchParams();
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [editing, setEditing] = useState<GoalDTO | 'new' | null>(null);
  const [parentForNew, setParentForNew] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const members = useMembers(ws.id);
  const editable = canEdit(ws.role);
  const q = useQuery({ queryKey: ['goals', ws.id, tab], queryFn: () => get<GoalDTO[]>(`/workspaces/${ws.id}/goals${tab === 'archived' ? '?archived=1' : ''}`) });

  useEffect(() => {
    if (params.get('new') === '1' && editable) {
      setEditing('new');
      params.delete('new');
      setParams(params, { replace: true });
    }
  }, [params, setParams, editable]);

  const refresh = () => qc.invalidateQueries({ queryKey: ['goals', ws.id] });
  const run = async (fn: () => Promise<unknown>, msg?: string) => {
    try {
      await fn();
      refresh();
      if (msg) toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const goals = q.data ?? [];
  const ids = new Set(goals.map((g) => g.id));
  const roots = goals.filter((g) => !g.parentGoalId || !ids.has(g.parentGoalId));
  const childrenOf = (id: string) => goals.filter((g) => g.parentGoalId === id);
  const memberName = (id: string | null) => members.data?.find((m) => m.id === id);
  const summary = useMemo(() => {
    const s: Record<string, number> = {};
    for (const g of goals) s[g.status] = (s[g.status] ?? 0) + 1;
    const avg = goals.length ? Math.round(goals.reduce((a, g) => a + g.progress.percent, 0) / goals.length) : 0;
    return { s, avg };
  }, [goals]);

  const row = (g: GoalDTO, depth: number): React.ReactNode => {
    const kids = childrenOf(g.id);
    const st = GOAL_STATUS[g.status] ?? GOAL_STATUS.on_track;
    const owner = memberName(g.ownerId);
    const isCollapsed = collapsed.has(g.id);
    return (
      <div key={g.id}>
        <div className="goal-row" style={{ paddingLeft: 14 + depth * 26 }}>
          <div className="row" style={{ minWidth: 0 }}>
            {kids.length ? (
              <button className="btn ghost icon sm" aria-label={isCollapsed ? 'Expand' : 'Collapse'} aria-expanded={!isCollapsed} onClick={() => {
                const n = new Set(collapsed);
                if (n.has(g.id)) n.delete(g.id);
                else n.add(g.id);
                setCollapsed(n);
              }}>
                <Icon name={isCollapsed ? 'chevronRight' : 'chevronDown'} size={14} />
              </button>
            ) : <span style={{ width: 26 }} />}
            <Icon name="target" />
            <div style={{ minWidth: 0 }}>
              <button className="goal-title ellipsis" style={{ maxWidth: '100%' }} onClick={() => editable && setEditing(g)} disabled={!editable}>{g.title}</button>
              <div className="muted small ellipsis">
                {g.progressMode === 'boards' ? `${g.progress.done ?? 0}/${g.progress.total ?? 0} items done across ${g.boardIds.length} board${g.boardIds.length === 1 ? '' : 's'}` : `${g.currentValue}${g.unit === '%' ? '%' : ` ${g.unit}`} of ${g.targetValue}${g.unit === '%' ? '%' : ` ${g.unit}`}`}
                {g.dueDate ? ` · due ${formatDate(g.dueDate)}` : ''}
              </div>
            </div>
          </div>
          <div className="col" style={{ gap: 2 }}>
            <ProgressBar value={g.progress.percent} color={st.color} />
            <span className="small muted">{g.progress.percent}%</span>
          </div>
          <span className={`badge ${st.cls}`}>{st.label}</span>
          <span className="row small hide-sm" style={{ minWidth: 0 }}>{owner ? <><Avatar name={owner.name} id={owner.id} url={owner.avatarUrl} size="sm" /> <span className="ellipsis">{owner.name}</span></> : <span className="muted">No owner</span>}</span>
          {editable ? (
            <Dropdown align="end" trigger={(open, ref) => <button ref={ref} className="btn ghost icon sm" aria-label={`Actions for ${g.title}`} onClick={open}><Icon name="more" /></button>}>
              {(close) => (
                <>
                  <MenuItem icon="edit" onClick={() => { close(); setEditing(g); }}>Edit</MenuItem>
                  <MenuItem icon="plus" onClick={() => { close(); setParentForNew(g.id); setEditing('new'); }}>Add sub-goal</MenuItem>
                  <MenuItem icon={g.archivedAt ? 'restore' : 'archive'} onClick={() => { close(); run(() => patch(`/goals/${g.id}`, { archived: !g.archivedAt }), g.archivedAt ? 'Goal restored' : 'Goal archived'); }}>{g.archivedAt ? 'Restore' : 'Archive'}</MenuItem>
                  {g.createdBy === user.id || isAdmin(ws.role) || g.createdBy === undefined ? (
                    <>
                      <MenuSep />
                      <MenuItem icon="trash" danger onClick={async () => { close(); if (await confirm({ title: 'Delete goal?', message: `"${g.title}" will be deleted. Sub-goals are kept and moved to the top level.`, danger: true, confirmLabel: 'Delete' })) run(() => del(`/goals/${g.id}`), 'Goal deleted'); }}>Delete</MenuItem>
                    </>
                  ) : null}
                </>
              )}
            </Dropdown>
          ) : <span />}
        </div>
        {!isCollapsed ? kids.map((k) => row(k, depth + 1)) : null}
      </div>
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="Goals"
        icon="target"
        subtitle="Track objectives with manual targets or live progress from linked boards."
        actions={editable ? <button className="btn primary" onClick={() => { setParentForNew(null); setEditing('new'); }}><Icon name="plus" /> New goal</button> : null}
      />
      {goals.length && tab === 'active' ? (
        <div className="row wrap" style={{ marginBottom: 14, gap: 10 }}>
          <span className="badge">Average progress {summary.avg}%</span>
          {(Object.keys(GOAL_STATUS) as GoalStatus[]).filter((k) => summary.s[k]).map((k) => <span key={k} className={`badge ${GOAL_STATUS[k].cls}`}>{GOAL_STATUS[k].label}: {summary.s[k]}</span>)}
        </div>
      ) : null}
      <div className="tabs" role="tablist" style={{ marginBottom: 12 }}>
        <button role="tab" aria-selected={tab === 'active'} className={`tab${tab === 'active' ? ' active' : ''}`} onClick={() => setTab('active')}>Active</button>
        <button role="tab" aria-selected={tab === 'archived'} className={`tab${tab === 'archived' ? ' active' : ''}`} onClick={() => setTab('archived')}>Archived</button>
      </div>
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !goals.length ? (
        <EmptyState icon="target" title={tab === 'archived' ? 'No archived goals' : 'No goals yet'} action={tab === 'active' && editable ? <button className="btn primary" onClick={() => setEditing('new')}>Set your first goal</button> : null}>
          {tab === 'active' ? 'Link goals to boards and progress updates automatically as items are completed.' : null}
        </EmptyState>
      ) : (
        <div className="card">{roots.map((g) => row(g, 0))}</div>
      )}
      {editing ? <GoalDialog wsId={ws.id} goal={editing === 'new' ? null : editing} parentId={editing === 'new' ? parentForNew : undefined} goals={goals} onClose={() => setEditing(null)} onSaved={refresh} /> : null}
    </div>
  );
}

function GoalDialog({ wsId, goal, parentId, goals, onClose, onSaved }: { wsId: string; goal: GoalDTO | null; parentId?: string | null; goals: GoalDTO[]; onClose: () => void; onSaved: () => void }) {
  const user = useUser();
  const members = useMembers(wsId);
  const boards = useBoards(wsId);
  const [title, setTitle] = useState(goal?.title ?? '');
  const [description, setDescription] = useState(goal?.description ?? '');
  const [ownerId, setOwnerId] = useState(goal?.ownerId ?? user.id);
  const [parent, setParent] = useState(goal?.parentGoalId ?? parentId ?? '');
  const [status, setStatus] = useState<GoalStatus>(goal?.status ?? 'on_track');
  const [mode, setMode] = useState<'manual' | 'boards'>(goal?.progressMode ?? 'manual');
  const [startValue, setStartValue] = useState(goal?.startValue ?? 0);
  const [targetValue, setTargetValue] = useState(goal?.targetValue ?? 100);
  const [currentValue, setCurrentValue] = useState(goal?.currentValue ?? 0);
  const [unit, setUnit] = useState(goal?.unit ?? '%');
  const [startDate, setStartDate] = useState(goal?.startDate ?? '');
  const [dueDate, setDueDate] = useState(goal?.dueDate ?? '');
  const [boardIds, setBoardIds] = useState<string[]>(goal?.boardIds ?? []);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Exclude self and descendants from parent choices to prevent cycles.
  const descendants = useMemo(() => {
    const out = new Set<string>();
    if (!goal) return out;
    const walk = (id: string) => goals.filter((g) => g.parentGoalId === id).forEach((g) => { out.add(g.id); walk(g.id); });
    walk(goal.id);
    out.add(goal.id);
    return out;
  }, [goal, goals]);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (dueDate && startDate && dueDate < startDate) {
      setError('Due date must be after the start date');
      return;
    }
    setBusy(true);
    setError(null);
    const body = {
      title: title.trim(),
      description,
      ownerId: ownerId || null,
      parentGoalId: parent || null,
      status,
      progressMode: mode,
      startValue: Number(startValue) || 0,
      targetValue: Number(targetValue) || 0,
      currentValue: Number(currentValue) || 0,
      unit: unit.trim() || '%',
      startDate: startDate || null,
      dueDate: dueDate || null,
      boardIds,
    };
    try {
      if (goal) await patch(`/goals/${goal.id}`, body);
      else await post(`/workspaces/${wsId}/goals`, body);
      onSaved();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={goal ? 'Edit goal' : 'New goal'} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" form="goal-form" disabled={busy}>{busy ? 'Saving…' : goal ? 'Save goal' : 'Create goal'}</button></>}>
      <form id="goal-form" onSubmit={save}>
        <Field label="Title" htmlFor="g-title"><input id="g-title" className="input" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Launch v2 to all customers" /></Field>
        <Field label="Description" htmlFor="g-desc"><textarea id="g-desc" className="textarea" value={description} maxLength={5000} onChange={(e) => setDescription(e.target.value)} /></Field>
        <div className="row wrap" style={{ gap: 16, alignItems: 'flex-start' }}>
          <Field label="Owner" htmlFor="g-owner">
            <select id="g-owner" className="select" value={ownerId ?? ''} onChange={(e) => setOwnerId(e.target.value)}>
              <option value="">No owner</option>
              {(members.data ?? []).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </Field>
          <Field label="Status" htmlFor="g-status">
            <select id="g-status" className="select" value={status} onChange={(e) => setStatus(e.target.value as GoalStatus)}>
              {(Object.keys(GOAL_STATUS) as GoalStatus[]).map((k) => <option key={k} value={k}>{GOAL_STATUS[k].label}</option>)}
            </select>
          </Field>
          <Field label="Parent goal" htmlFor="g-parent">
            <select id="g-parent" className="select" value={parent} onChange={(e) => setParent(e.target.value)}>
              <option value="">None (top level)</option>
              {goals.filter((g) => !descendants.has(g.id)).map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </Field>
        </div>
        <div className="row wrap" style={{ gap: 16, alignItems: 'flex-start' }}>
          <Field label="Start date" htmlFor="g-start"><input id="g-start" className="input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></Field>
          <Field label="Due date" htmlFor="g-due"><input id="g-due" className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
        </div>
        <Field label="Progress">
          <div className="row" style={{ gap: 16 }}>
            <label className="checkbox"><input type="radio" name="g-mode" checked={mode === 'manual'} onChange={() => setMode('manual')} /> Manual target</label>
            <label className="checkbox"><input type="radio" name="g-mode" checked={mode === 'boards'} onChange={() => setMode('boards')} /> From linked boards</label>
          </div>
        </Field>
        {mode === 'manual' ? (
          <div className="row wrap" style={{ gap: 16, alignItems: 'flex-start' }}>
            <Field label="Start value" htmlFor="g-sv"><input id="g-sv" className="input" type="number" value={startValue} onChange={(e) => setStartValue(Number(e.target.value))} /></Field>
            <Field label="Current value" htmlFor="g-cv"><input id="g-cv" className="input" type="number" value={currentValue} onChange={(e) => setCurrentValue(Number(e.target.value))} /></Field>
            <Field label="Target value" htmlFor="g-tv"><input id="g-tv" className="input" type="number" value={targetValue} onChange={(e) => setTargetValue(Number(e.target.value))} /></Field>
            <Field label="Unit" htmlFor="g-unit"><input id="g-unit" className="input" value={unit} maxLength={20} onChange={(e) => setUnit(e.target.value)} placeholder="%, USD, customers…" /></Field>
          </div>
        ) : (
          <Field label="Linked boards" hint="Progress = share of top-level items with a Done status across these boards.">
            <div className="row wrap" style={{ gap: 6 }}>
              {(boards.data ?? []).map((b) => (
                <button key={b.id} type="button" className={`chip${boardIds.includes(b.id) ? ' on' : ''}`} aria-pressed={boardIds.includes(b.id)} onClick={() => setBoardIds(boardIds.includes(b.id) ? boardIds.filter((x) => x !== b.id) : [...boardIds, b.id])}>{b.name}</button>
              ))}
              {!boards.data?.length ? <span className="muted small">No boards yet.</span> : null}
            </div>
          </Field>
        )}
        {error ? <div className="error-box">{error}</div> : null}
      </form>
    </Modal>
  );
}
