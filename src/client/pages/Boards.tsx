import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { canEdit, useWorkspace } from '../lib/session';
import { del, errorMessage, patch, post } from '../lib/api';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, useConfirm, useToast } from '../components/ui/overlays';
import { CreateBoardDialog, useBoards } from '../components/layout/CreateDialogs';
import type { BoardDTO, FolderDTO } from '../../shared/types';
import { FolderHeader, FolderIcon, FolderPanel, MoveToFolderItems, entityDragProps, useFolderFilter, useFolderSelection, useFolders } from '../components/folders/Folders';

type Tab = 'all' | 'personal' | 'archived';

export default function Boards() {
  const ws = useWorkspace();
  const [tab, setTab] = useState<Tab>('all');
  const [filter, setFilter] = useState('');
  const [create, setCreate] = useState<null | 'board' | 'personal'>(null);
  const q = useBoards(ws.id, tab === 'archived' ? { archived: true } : {});
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const refresh = () => qc.invalidateQueries({ queryKey: ['boards', ws.id] });
  const act = async (p: Promise<unknown>, msg: string) => {
    try {
      await p;
      toast(msg);
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const [folder, setFolder] = useFolderSelection();
  const folders = useFolders(ws.id, 'boards');
  const matching = (q.data ?? []).filter((b) => (tab === 'personal' ? b.kind === 'personal' : true) && (!filter || b.name.toLowerCase().includes(filter.toLowerCase())));
  const { visible: list, counts } = useFolderFilter(matching, folders.data ?? [], folder);
  const folderById = new Map((folders.data ?? []).map((f) => [f.id, f]));
  const fileInto = (boardId: string, folderId: string | null) => {
    const name = folderId ? folderById.get(folderId)?.name : null;
    void act(patch(`/boards/${boardId}`, { folderId }), name ? `Moved to "${name}"` : 'Removed from folder');
  };
  const newFolder = folder !== 'all' && folder !== 'unfiled' ? folder : null;
  return (
    <div className="page">
      <PageHeader
        title="Boards"
        icon="grid"
        subtitle={`Every board you can access in ${ws.name}.`}
        actions={canEdit(ws.role) ? (
          <>
            <button className="btn" onClick={() => setCreate('personal')}><Icon name="user" /> Personal board</button>
            <button className="btn primary" onClick={() => setCreate('board')}><Icon name="plus" /> New board</button>
          </>
        ) : (
          <button className="btn" onClick={() => setCreate('personal')}><Icon name="user" /> Personal board</button>
        )}
      />
      <div className="row wrap" style={{ marginBottom: 16 }}>
        <div className="tabs" role="tablist" style={{ flex: 1 }}>
          {(['all', 'personal', 'archived'] as Tab[]).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
        <input className="input" style={{ width: 220 }} placeholder="Filter boards" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter boards" />
      </div>
      <div className="folder-layout">
      <FolderPanel wsId={ws.id} scope="boards" label="Boards" selected={folder} onSelect={setFolder} counts={counts} canEdit={canEdit(ws.role)} onFile={fileInto} />
      <div style={{ minWidth: 0 }}>
      <FolderHeader folders={folders.data ?? []} selected={folder} onSelect={setFolder} counts={counts.byFolder} />
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : list.length === 0 ? (
        <EmptyState icon="grid" title={tab === 'archived' ? 'No archived boards' : 'No boards yet'} action={tab !== 'archived' && canEdit(ws.role) ? <button className="btn primary" onClick={() => setCreate('board')}>Create your first board</button> : undefined}>
          {tab === 'archived' ? 'Archived boards appear here and can be restored.' : 'Boards organise work into groups, items and columns. Start blank or from a template.'}
        </EmptyState>
      ) : (
        <div className="grid-cards">
          {list.map((b) => (
            <BoardTile key={b.id} board={b} wsId={ws.id} folders={folders.data ?? []} folder={folder === 'all' && b.folderId ? folderById.get(b.folderId) : undefined} draggable={b.access !== 'view'} onMove={(f) => fileInto(b.id, f)} onAction={(a) => {
              if (a === 'open') navigate(`/w/${ws.id}/boards/${b.id}`);
              if (a === 'duplicate') act(post(`/boards/${b.id}/duplicate`, { withItems: true }), 'Board duplicated');
              if (a === 'archive') act(post(`/boards/${b.id}/archive`), 'Board archived');
              if (a === 'restore') act(post(`/boards/${b.id}/restore`), 'Board restored');
              if (a === 'delete') {
                void confirm({ title: `Delete "${b.name}"?`, message: 'The board and everything on it will be permanently deleted.', danger: true, confirmLabel: 'Delete board', typeToConfirm: b.name }).then((ok) => { if (ok) void act(del(`/boards/${b.id}`, { confirmName: b.name }), 'Board deleted'); });
              }
            }} />
          ))}
        </div>
      )}
      </div>
      </div>
      {create ? <CreateBoardDialog wsId={ws.id} kind={create === 'personal' ? 'personal' : 'board'} folderId={newFolder} onClose={() => setCreate(null)} /> : null}
    </div>
  );
}

function BoardTile({ board: b, wsId, onAction, folders, folder, draggable, onMove }: { board: BoardDTO; wsId: string; onAction: (a: 'open' | 'duplicate' | 'archive' | 'restore' | 'delete') => void; folders: FolderDTO[]; folder?: FolderDTO; draggable: boolean; onMove: (folderId: string | null) => void }) {
  return (
    <div className="tile" style={{ position: 'relative' }} {...(draggable ? entityDragProps(b.id) : {})}>
      <Link to={`/w/${wsId}/boards/${b.id}`} style={{ color: 'inherit', textDecoration: 'none' }} className="col">
        <div className="row">
          <span className="empty-icon" style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={b.kind === 'personal' ? 'user' : b.icon || 'grid'} />
          </span>
          <strong className="grow ellipsis">{b.name}</strong>
        </div>
        <span className="muted small ellipsis">{b.description || `${b.itemCount ?? 0} item${b.itemCount === 1 ? '' : 's'}`}</span>
        <div className="row small muted">
          {b.visibility === 'private' ? <span className="badge"><Icon name="lock" size={11} /> Private</span> : <span className="badge"><Icon name="globe" size={11} /> Workspace</span>}
          <span className="badge">{b.access}</span>
          {folder ? <span className="badge" style={{ gap: 5 }}><FolderIcon color={folder.color} size={13} /> {folder.name}</span> : null}
          <span className="spacer" />
          <span>{timeAgo(b.updatedAt)}</span>
        </div>
      </Link>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <Dropdown align="end" trigger={(open, ref) => <button ref={ref} className="btn ghost icon sm" aria-label={`${b.name} actions`} onClick={(e) => { e.preventDefault(); open(); }}><Icon name="more" /></button>}>
          {(close) => (
            <>
              <MenuItem icon="chevronRight" onClick={() => { close(); onAction('open'); }}>Open</MenuItem>
              <MenuItem icon="copy" onClick={() => { close(); onAction('duplicate'); }}>Duplicate</MenuItem>
              {draggable ? <MoveToFolderItems folders={folders} current={b.folderId} onPick={(f) => { close(); onMove(f); }} /> : null}
              {b.access === 'admin' ? (
                <>
                  {b.archivedAt ? <MenuItem icon="restore" onClick={() => { close(); onAction('restore'); }}>Restore</MenuItem> : <MenuItem icon="archive" onClick={() => { close(); onAction('archive'); }}>Archive</MenuItem>}
                  <MenuSep />
                  <MenuItem icon="trash" danger onClick={() => { close(); onAction('delete'); }}>Delete</MenuItem>
                </>
              ) : null}
            </>
          )}
        </Dropdown>
      </div>
    </div>
  );
}
