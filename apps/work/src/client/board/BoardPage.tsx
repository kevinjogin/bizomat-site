import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ViewDTO, ViewSettings, ViewType } from '../../shared/types';
import { ApiError, del, get, post } from '../lib/api';
import { useSession, useWorkspace } from '../lib/session';
import { useBoardRealtime, usePageTitle, useShortcut } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Loading } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, Modal, useConfirm } from '../components/ui/overlays';
import { isUnsaved, resolveId, useBoardActions, useBoardQuery, useComputedItems } from './useBoard';
import { applyView, visibleColumns, type QuickFilters } from './filtering';
import { Toolbar } from './Toolbar';
import { ItemPanel } from './ItemPanel';
import { BoardSettingsDialog } from './BoardSettings';
import { VIEW_REGISTRY } from './views';
import type { BoardViewProps } from './types';
import { AutomationsPanel } from '../components/automations/AutomationBuilder';
import { ReportsDialog } from './ReportsDialog';
import { FinancePanel } from './FinancePanel';

export default function BoardPage() {
  const { boardId, viewId } = useParams();
  const ws = useWorkspace();
  const { session } = useSession();
  const userId = session!.user.id;
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = useBoardQuery(boardId);
  const actions = useBoardActions(boardId!);
  const live = useBoardRealtime(boardId, userId);
  const bundle = q.data;
  const members = bundle?.members ?? [];
  const nameMap = useMemo(() => new Map(members.map((m) => [m.id, m.name])), [members]);
  const memberName = useCallback((id: string) => nameMap.get(id), [nameMap]);
  const computed = useComputedItems(bundle, memberName);
  const [quick, setQuick] = useState<QuickFilters>({ search: '', personId: null });
  const [localSettings, setLocalSettings] = useState<Record<string, ViewSettings>>({});
  const [dialog, setDialog] = useState<null | 'settings' | 'members' | 'automations' | 'activity' | 'reports' | 'finance'>(params.get('automations') ? 'automations' : params.get('reports') ? 'reports' : null);
  const itemId = params.get('item');

  usePageTitle(bundle?.board.name);

  const canEdit = !!bundle && bundle.board.access !== 'view' && !bundle.board.archivedAt;
  const views = bundle?.views ?? [];
  const fallbackView: ViewDTO = { id: 'default', boardId: boardId!, name: 'Main table', type: 'table', settings: {}, position: 0, ownerId: null };
  const baseView = views.find((v) => v.id === viewId) ?? views[0] ?? fallbackView;
  const view: ViewDTO = { ...baseView, settings: { ...baseView.settings, ...(localSettings[baseView.id] ?? {}) } };

  const updateViewSettings = (p: Partial<ViewSettings>) => {
    const next = { ...view.settings, ...p };
    const canPersist = baseView.id !== 'default' && (baseView.ownerId === userId || canEdit);
    if (canPersist) {
      setLocalSettings((s) => ({ ...s, [baseView.id]: {} }));
      void actions.updateView(baseView.id, { settings: next });
    } else setLocalSettings((s) => ({ ...s, [baseView.id]: { ...(s[baseView.id] ?? {}), ...p } }));
  };

  const openItem = useCallback((id: string) => setParams((p) => { const n = new URLSearchParams(p); n.set('item', id); return n; }), [setParams]);
  const closeItem = useCallback(() => setParams((p) => { const n = new URLSearchParams(p); n.delete('item'); return n; }), [setParams]);
  // An item opened right after it was added still has its temporary id: once the server has saved it, the address
  // takes the real id (in place, so Back does not return to the temporary one). If the save failed, the panel closes.
  useEffect(() => {
    if (!itemId || !isUnsaved(itemId)) return;
    let current = true;
    void resolveId(itemId).then((id) => {
      if (current) setParams((p) => { const n = new URLSearchParams(p); if (id) n.set('item', id); else n.delete('item'); return n; }, { replace: true });
    });
    return () => { current = false; };
  }, [itemId, setParams]);

  const newItem = async () => {
    if (!canEdit || !bundle) return;
    const created = await actions.createItem({ name: 'New item', groupId: bundle.groups[0]?.id, position: 'top' });
    if (created) openItem(created.id);
  };
  useShortcut('n', newItem, canEdit);

  if (q.isLoading) return <Loading label="Loading board…" />;
  if (q.error) {
    const status = q.error instanceof ApiError ? q.error.status : 0;
    return (
      <div className="page">
        {status === 404 && itemId ? <TaskFallback wsId={ws.id} itemId={itemId} /> : status === 404 ? <EmptyState icon="lock" title="Board not found">It may have been deleted, or you don't have access.</EmptyState> : <ErrorBox error={q.error} retry={() => q.refetch()} />}
      </div>
    );
  }
  if (!bundle) return null;

  const items = applyView(computed, bundle.columns, view, quick, { currentUserId: userId, memberName });
  const columns = visibleColumns(bundle.columns, view);
  const reg = VIEW_REGISTRY[view.type] ?? VIEW_REGISTRY.table;
  const ViewComp = reg.component;
  const viewProps: BoardViewProps = {
    bundle,
    view,
    items,
    allItems: computed,
    columns,
    members,
    access: bundle.board.access ?? 'view',
    canEdit,
    actions,
    openItem,
    updateViewSettings,
    memberName,
  };

  return (
    <div className="page full">
      <BoardHeader bundle={bundle} canEdit={canEdit} live={live} onOpen={setDialog} actions={actions} wsId={ws.id} />
      <ViewTabs views={views} activeId={baseView.id} wsId={ws.id} boardId={bundle.board.id} canEdit={canEdit} actions={actions} userId={userId} navigate={navigate} />
      <Toolbar bundle={bundle} view={view} quick={quick} setQuick={setQuick} updateSettings={updateViewSettings} canEdit={canEdit} onNewItem={newItem} members={members} />
      {bundle.board.archivedAt ? <div className="info-box" style={{ margin: '8px 24px' }}><Icon name="archive" /> This board is archived and read-only. {bundle.board.access === 'admin' ? 'Restore it from board settings.' : ''}</div> : null}
      <div className="view-body">
        <Suspense fallback={<Loading />}>
          {items.length === 0 && computed.filter((i) => !i.parentItemId).length > 0 && view.type !== 'form' ? (
            <div className="info-box" style={{ margin: '12px 24px' }}>No items match the current filters. <button className="btn sm" onClick={() => { setQuick({ search: '', personId: null }); updateViewSettings({ filter: { op: 'and', rules: [] } }); }}>Clear filters</button></div>
          ) : null}
          <ViewComp {...viewProps} />
        </Suspense>
      </div>
      {itemId ? <ItemPanel itemId={itemId} bundle={bundle} computedItems={computed} actions={actions} canEdit={canEdit} onClose={closeItem} onOpen={openItem} members={members} memberName={memberName} /> : null}
      {dialog === 'settings' || dialog === 'members' ? <BoardSettingsDialog bundle={bundle} onClose={() => setDialog(null)} initialTab={dialog === 'members' ? 'members' : 'general'} /> : null}
      {dialog === 'automations' ? (
        <Modal title={`Automations · ${bundle.board.name}`} onClose={() => { setDialog(null); setParams((p) => { const n = new URLSearchParams(p); n.delete('automations'); return n; }); }} wide>
          <AutomationsPanel bundle={bundle} />
        </Modal>
      ) : null}
      {dialog === 'activity' ? <BoardActivity boardId={bundle.board.id} onClose={() => setDialog(null)} onOpenItem={(id) => { setDialog(null); openItem(id); }} /> : null}
      {dialog === 'reports' ? <ReportsDialog bundle={bundle} onClose={() => { setDialog(null); setParams((p) => { const n = new URLSearchParams(p); n.delete('reports'); return n; }); }} /> : null}
      {dialog === 'finance' ? <FinancePanel bundle={bundle} onClose={() => setDialog(null)} /> : null}
    </div>
  );
}

/** Someone with access to one task but not to its board followed a board link: open the task on its own. */
function TaskFallback({ wsId, itemId }: { wsId: string; itemId: string }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/w/${wsId}/tasks/${itemId}`, { replace: true });
  }, [navigate, wsId, itemId]);
  return <Loading label="Opening the task…" />;
}

function BoardHeader({ bundle, canEdit, live, onOpen, actions, wsId }: { bundle: NonNullable<ReturnType<typeof useBoardQuery>['data']>; canEdit: boolean; live: boolean; onOpen: (d: 'settings' | 'members' | 'automations' | 'activity' | 'reports' | 'finance') => void; actions: ReturnType<typeof useBoardActions>; wsId: string }) {
  const b = bundle.board;
  const [name, setName] = useState(b.name);
  useEffect(() => setName(b.name), [b.name]);
  const qc = useQueryClient();
  const favs = useQuery({ queryKey: ['favourites', wsId], queryFn: () => get<any[]>(`/workspaces/${wsId}/favourites`) });
  const isFav = (favs.data ?? []).some((f) => f.type === 'board' && f.id === b.id);
  const toggleFav = async () => {
    if (isFav) await del(`/workspaces/${wsId}/favourites/board/${b.id}`);
    else await post(`/workspaces/${wsId}/favourites`, { type: 'board', id: b.id });
    qc.invalidateQueries({ queryKey: ['favourites', wsId] });
  };
  const owners = bundle.boardMembers.map((bm) => bundle.members.find((m) => m.id === bm.userId)).filter(Boolean);
  const saveName = async () => {
    if (!name.trim() || name === b.name) return setName(b.name);
    await import('../lib/api').then((m) => m.patch(`/boards/${b.id}`, { name: name.trim() }));
    actions.refresh();
    qc.invalidateQueries({ queryKey: ['boards', wsId] });
  };
  return (
    <div className="board-header">
      <div className="row wrap">
        <input className="board-title" value={name} readOnly={!canEdit} aria-label="Board name" onChange={(e) => setName(e.target.value)} onBlur={saveName} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} size={Math.max(8, name.length)} maxLength={200} />
        <button className="btn ghost icon sm" aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={isFav} onClick={toggleFav} style={{ color: isFav ? '#f5a524' : undefined }}>
          <Icon name="star" />
        </button>
        {b.visibility === 'private' ? <span className="badge"><Icon name="lock" size={11} /> Private</span> : null}
        {b.kind === 'personal' ? <span className="badge accent">Personal</span> : null}
        <span className="badge" title={live ? 'Live updates connected' : 'Live updates offline (refreshing periodically)'} style={{ background: live ? 'rgba(0,163,108,.14)' : undefined, color: live ? 'var(--success)' : undefined }}>● {live ? 'Live' : 'Offline'}</span>
        <span className="spacer" />
        <button className="btn ghost sm" onClick={() => onOpen('members')} aria-label="Board members">
          <span className="avatar-stack">{owners.slice(0, 4).map((m) => <Avatar key={m!.id} id={m!.id} name={m!.name} url={m!.avatarUrl} size="sm" />)}</span>
          <span className="desktop-only">Members</span>
        </button>
        <button className="btn ghost sm" onClick={() => onOpen('activity')}><Icon name="activity" /> <span className="desktop-only">Activity</span></button>
        <button className="btn ghost sm" onClick={() => onOpen('automations')}><Icon name="bolt" /> <span className="desktop-only">Automate</span></button>
        {b.caps?.viewFinance && bundle.columns.some((c) => c.type === 'currency' || (c.type === 'number' && c.settings?.financial)) ? (
          <button className="btn ghost sm" onClick={() => onOpen('finance')} aria-label="Project finance"><Icon name="chart" /> <span className="desktop-only">Finance</span></button>
        ) : null}
        {b.caps?.generateReports ? <button className="btn ghost sm" onClick={() => onOpen('reports')} aria-label="Project reports"><Icon name="file" /> <span className="desktop-only">Reports</span></button> : null}
        <button className="btn ghost icon sm" aria-label="Board settings" onClick={() => onOpen('settings')}><Icon name="settings" /></button>
      </div>
      {b.description ? <p className="muted small" style={{ margin: '2px 0 0' }}>{b.description}</p> : null}
    </div>
  );
}

function ViewTabs({ views, activeId, wsId, boardId, canEdit, actions, userId, navigate }: { views: ViewDTO[]; activeId: string; wsId: string; boardId: string; canEdit: boolean; actions: ReturnType<typeof useBoardActions>; userId: string; navigate: ReturnType<typeof useNavigate> }) {
  const confirm = useConfirm();
  const [renaming, setRenaming] = useState<string | null>(null);
  const [text, setText] = useState('');
  const go = (id: string) => navigate(`/w/${wsId}/boards/${boardId}/views/${id}${location.search}`);
  const add = async (type: ViewType, personal: boolean) => {
    const v = await actions.createView({ name: VIEW_REGISTRY[type].label, type, personal });
    if (v) go(v.id);
  };
  const tabRef = useRef<HTMLDivElement>(null);
  return (
    <div className="board-header" style={{ paddingTop: 4 }}>
      <div className="tabs" role="tablist" ref={tabRef} style={{ borderBottom: 0 }}>
        {views.map((v) => (
          <div key={v.id} className="row" style={{ gap: 0 }}>
            {renaming === v.id ? (
              <input className="input sm" autoFocus value={text} onChange={(e) => setText(e.target.value)} aria-label="View name" onBlur={() => { setRenaming(null); if (text.trim()) actions.updateView(v.id, { name: text.trim() }); }} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} style={{ width: 140 }} />
            ) : (
              <button role="tab" aria-selected={v.id === activeId} className={`tab${v.id === activeId ? ' active' : ''}`} onClick={() => go(v.id)} onDoubleClick={() => (canEdit || v.ownerId === userId) && (setRenaming(v.id), setText(v.name))}>
                <Icon name={VIEW_REGISTRY[v.type]?.icon ?? 'table'} size={14} /> {v.name} {v.ownerId ? <Icon name="user" size={11} /> : null}
              </button>
            )}
            {v.id === activeId && (canEdit || v.ownerId === userId) ? (
              <Dropdown trigger={(open, ref) => <button ref={ref} className="btn ghost icon sm" aria-label={`${v.name} view options`} onClick={open}><Icon name="chevronDown" size={12} /></button>}>
                {(close) => (
                  <>
                    <MenuItem icon="edit" onClick={() => { close(); setRenaming(v.id); setText(v.name); }}>Rename view</MenuItem>
                    <MenuItem icon="copy" onClick={async () => { close(); const nv = await actions.createView({ name: `${v.name} (copy)`, type: v.type, settings: v.settings, personal: !!v.ownerId }); if (nv) go(nv.id); }}>Duplicate view</MenuItem>
                    {views.length > 1 ? (
                      <>
                        <MenuSep />
                        <MenuItem icon="trash" danger onClick={async () => { close(); if (await confirm({ title: `Delete view "${v.name}"?`, message: 'The view and its filters are removed; board data is not affected.', danger: true, confirmLabel: 'Delete view' })) { await actions.deleteView(v.id); go(views.find((x) => x.id !== v.id)!.id); } }}>Delete view</MenuItem>
                      </>
                    ) : null}
                  </>
                )}
              </Dropdown>
            ) : null}
          </div>
        ))}
        <Dropdown label="Add view" width={240} trigger={(open, ref) => <button ref={ref} className="tab" onClick={open} aria-label="Add view"><Icon name="plus" size={14} /> View</button>}>
          {(close) => (
            <>
              {(Object.keys(VIEW_REGISTRY) as ViewType[]).map((t) => (
                <MenuItem key={t} icon={VIEW_REGISTRY[t].icon} disabled={!canEdit} onClick={() => { close(); add(t, false); }}>{VIEW_REGISTRY[t].label}</MenuItem>
              ))}
              <MenuSep />
              <div className="menu-label">Personal saved view</div>
              {(['table', 'kanban', 'calendar'] as ViewType[]).map((t) => (
                <MenuItem key={`p-${t}`} icon="user" onClick={() => { close(); add(t, true); }}>My {VIEW_REGISTRY[t].label.toLowerCase()}</MenuItem>
              ))}
            </>
          )}
        </Dropdown>
      </div>
    </div>
  );
}

function BoardActivity({ boardId, onClose, onOpenItem }: { boardId: string; onClose: () => void; onOpenItem: (id: string) => void }) {
  const q = useQuery({ queryKey: ['board-activity', boardId], queryFn: () => get<any[]>(`/boards/${boardId}/activity`) });
  return (
    <Modal title="Board activity" onClose={onClose} wide>
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} /> : !q.data?.length ? <EmptyState icon="activity" title="No activity yet" /> : (
        <div>
          {q.data.map((a) => (
            <div key={a.id} className="activity-line">
              <strong>{a.actor_name ?? 'Automation'}</strong>
              <span className="grow">
                {String(a.action).replace(':automation', '').replace(/_/g, ' ')}{' '}
                {a.item_id && a.item_name ? <button className="btn ghost sm" onClick={() => onOpenItem(a.item_id)}>{a.item_name}</button> : null}
              </span>
              <span className="muted small">{timeAgo(a.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
