import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { canEdit, useUser, useWorkspace, isAdmin } from '../lib/session';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, useConfirm, useToast } from '../components/ui/overlays';
import { useBoards, useCreateDocument } from '../components/layout/CreateDialogs';
import { FolderHeader, FolderIcon, FolderPanel, MoveToFolderItems, entityDragProps, useFolderFilter, useFolderSelection, useFolders } from '../components/folders/Folders';
import '../styles/content.css';

interface DocListItem {
  id: string;
  title: string;
  boardId: string | null;
  itemId: string | null;
  visibility: 'workspace' | 'private';
  excerpt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: number;
  createdAt: number;
  archivedAt: number | null;
  folderId: string | null;
}

export default function Documents() {
  const ws = useWorkspace();
  const user = useUser();
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [q, setQ] = useState('');
  const [owner, setOwner] = useState<'all' | 'mine'>('all');
  const [boardFilter, setBoardFilter] = useState('');
  const createDoc = useCreateDocument(ws.id);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const boards = useBoards(ws.id);
  const docs = useQuery({
    queryKey: ['documents', ws.id, tab],
    queryFn: () => get<DocListItem[]>(`/workspaces/${ws.id}/documents${tab === 'archived' ? '?archived=1' : ''}`),
  });
  const [folder, setFolder] = useFolderSelection();
  const folders = useFolders(ws.id, 'documents');
  const boardName = useMemo(() => new Map((boards.data ?? []).map((b) => [b.id, b.name])), [boards.data]);
  const matching = (docs.data ?? []).filter((d) => {
    if (owner === 'mine' && d.createdBy !== user.id) return false;
    if (boardFilter && d.boardId !== boardFilter) return false;
    if (q && !`${d.title} ${d.excerpt}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  const { visible: filtered, counts } = useFolderFilter(matching, folders.data ?? [], folder);
  const folderById = useMemo(() => new Map((folders.data ?? []).map((f) => [f.id, f])), [folders.data]);
  const fileInto = (docId: string, folderId: string | null) => {
    const name = folderId ? folderById.get(folderId)?.name : null;
    act(() => patch(`/documents/${docId}`, { folderId }), name ? `Moved to "${name}"` : 'Removed from folder');
  };
  const newDocFolder = folder !== 'all' && folder !== 'unfiled' ? folder : null;
  const editable = canEdit(ws.role);
  const refresh = () => qc.invalidateQueries({ queryKey: ['documents', ws.id] });
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try {
      await fn();
      refresh();
      toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="page">
      <PageHeader
        title="Documents"
        icon="doc"
        subtitle="Rich documents for specs, notes and plans — linkable to boards and items."
        actions={editable ? <button className="btn primary" onClick={() => createDoc({ folderId: newDocFolder })}><Icon name="plus" /> New document{newDocFolder ? ' here' : ''}</button> : null}
      />
      <div className="tabs" role="tablist" style={{ marginBottom: 12 }}>
        <button role="tab" aria-selected={tab === 'active'} className={`tab${tab === 'active' ? ' active' : ''}`} onClick={() => setTab('active')}>All documents</button>
        <button role="tab" aria-selected={tab === 'archived'} className={`tab${tab === 'archived' ? ' active' : ''}`} onClick={() => setTab('archived')}>Archived</button>
      </div>
      <div className="row wrap" style={{ marginBottom: 14 }}>
        <div className="row" style={{ flex: '1 1 240px', maxWidth: 360 }}>
          <input className="input" placeholder="Filter by title or content…" aria-label="Filter documents" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="select" style={{ width: 'auto' }} aria-label="Owner" value={owner} onChange={(e) => setOwner(e.target.value as any)}>
          <option value="all">Anyone</option>
          <option value="mine">Created by me</option>
        </select>
        <select className="select" style={{ width: 'auto' }} aria-label="Linked board" value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
          <option value="">Any board</option>
          {(boards.data ?? []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div className="folder-layout">
      <FolderPanel wsId={ws.id} scope="documents" label="Documents" selected={folder} onSelect={setFolder} counts={counts} canEdit={editable} onFile={fileInto} />
      <div style={{ minWidth: 0 }}>
      <FolderHeader folders={folders.data ?? []} selected={folder} onSelect={setFolder} counts={counts.byFolder} />
      {docs.isLoading ? <Loading /> : docs.error ? <ErrorBox error={docs.error} retry={() => docs.refetch()} /> : !filtered.length ? (
        <EmptyState icon="doc" title={docs.data?.length ? (folder !== 'all' && !matching.length ? 'No documents match your filters' : folder !== 'all' ? 'This folder is empty' : 'No documents match your filters') : tab === 'archived' ? 'No archived documents' : 'No documents yet'} action={tab === 'active' && editable && (!docs.data?.length || newDocFolder) ? <button className="btn primary" onClick={() => createDoc({ folderId: newDocFolder })}>{newDocFolder ? 'New document in this folder' : 'Write your first document'}</button> : null}>
          {!docs.data?.length && tab === 'active' ? 'Documents support headings, checklists, tables, images, attachments, comments and full version history.' : null}
        </EmptyState>
      ) : (
        <div className="card list">
          {filtered.map((d) => (
            <div key={d.id} className="list-row" style={{ cursor: 'pointer' }} onClick={() => navigate(`/w/${ws.id}/docs/${d.id}`)} {...(editable ? entityDragProps(d.id) : {})}>
              <Icon name="doc" />
              <div className="grow" style={{ minWidth: 0 }}>
                <Link to={`/w/${ws.id}/docs/${d.id}`} onClick={(e) => e.stopPropagation()} style={{ fontWeight: 600, color: 'var(--text)' }}>{d.title || 'Untitled'}</Link>
                <div className="muted small ellipsis">{d.excerpt.replace(/^[^\n]*\n/, '') || 'Empty document'}</div>
              </div>
              {folder === 'all' && d.folderId && folderById.get(d.folderId) ? (
                <span className="badge desktop-only" style={{ gap: 5 }}><FolderIcon color={folderById.get(d.folderId)!.color} size={13} /> {folderById.get(d.folderId)!.name}</span>
              ) : null}
              {d.visibility === 'private' ? <span className="badge"><Icon name="lock" size={11} /> Private</span> : null}
              {d.boardId ? <span className="badge accent desktop-only"><Icon name="grid" size={11} /> {boardName.get(d.boardId) ?? 'Board'}</span> : null}
              <span className="muted small desktop-only" style={{ width: 150, textAlign: 'right' }}>{d.createdByName} · {timeAgo(d.updatedAt)}</span>
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown align="end" trigger={(open, ref) => <button ref={ref} className="btn ghost icon sm" aria-label={`Actions for ${d.title}`} onClick={open}><Icon name="more" /></button>}>
                  {(close) => (
                    <>
                      <MenuItem icon="edit" onClick={() => { close(); navigate(`/w/${ws.id}/docs/${d.id}`); }}>Open</MenuItem>
                      {editable ? <MenuItem icon="copy" onClick={() => { close(); act(() => post(`/documents/${d.id}/duplicate`), 'Document duplicated'); }}>Duplicate</MenuItem> : null}
                      {editable ? <MoveToFolderItems folders={folders.data ?? []} current={d.folderId} onPick={(f) => { close(); fileInto(d.id, f); }} /> : null}
                      {d.createdBy === user.id || isAdmin(ws.role) ? (
                        <>
                          {d.archivedAt ? (
                            <MenuItem icon="restore" onClick={() => { close(); act(() => post(`/documents/${d.id}/archive`, { archived: false }), 'Document restored'); }}>Restore</MenuItem>
                          ) : (
                            <MenuItem icon="archive" onClick={() => { close(); act(() => post(`/documents/${d.id}/archive`, { archived: true }), 'Document archived'); }}>Archive</MenuItem>
                          )}
                          <MenuSep />
                          <MenuItem
                            icon="trash"
                            danger
                            onClick={async () => {
                              close();
                              if (await confirm({ title: 'Delete document?', message: `"${d.title}", its history, comments and attachments will be permanently deleted.`, confirmLabel: 'Delete', danger: true })) {
                                act(() => del(`/documents/${d.id}`), 'Document deleted');
                              }
                            }}
                          >
                            Delete
                          </MenuItem>
                        </>
                      ) : null}
                    </>
                  )}
                </Dropdown>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
    </div>
  );
}
