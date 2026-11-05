import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { del, errorMessage, get, patch, post } from '../lib/api';
import { canEdit, isAdmin, useUser, useWorkspace } from '../lib/session';
import { timeAgo, plural } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, useConfirm, useToast } from '../components/ui/overlays';
import { CreateDashboardDialog } from '../components/layout/CreateDialogs';
import { FolderHeader, FolderIcon, FolderPanel, MoveToFolderItems, entityDragProps, useFolderFilter, useFolderSelection, useFolders } from '../components/folders/Folders';
import '../styles/content.css';

export interface DashboardDTO {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  boardIds: string[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
  folderId?: string | null;
}

export default function Dashboards() {
  const ws = useWorkspace();
  const user = useUser();
  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [creating, setCreating] = useState(false);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({
    queryKey: ['dashboards', ws.id, tab],
    queryFn: () => get<DashboardDTO[]>(`/workspaces/${ws.id}/dashboards${tab === 'archived' ? '?archived=1' : ''}`),
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ['dashboards', ws.id] });
  const act = async (fn: () => Promise<unknown>, msg?: string) => {
    try {
      await fn();
      refresh();
      if (msg) toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const editable = canEdit(ws.role);
  const [folder, setFolder] = useFolderSelection();
  const folders = useFolders(ws.id, 'dashboards');
  const { visible, counts } = useFolderFilter(q.data ?? [], folders.data ?? [], folder);
  const folderById = new Map((folders.data ?? []).map((f) => [f.id, f]));
  const fileInto = (id: string, folderId: string | null) => {
    const name = folderId ? folderById.get(folderId)?.name : null;
    void act(() => patch(`/dashboards/${id}`, { folderId }), name ? `Moved to "${name}"` : 'Removed from folder');
  };
  const newFolder = folder !== 'all' && folder !== 'unfiled' ? folder : null;
  return (
    <div className="page">
      <PageHeader
        title="Dashboards"
        icon="chart"
        subtitle="Live overviews built from your boards' real data."
        actions={editable ? <button className="btn primary" onClick={() => setCreating(true)}><Icon name="plus" /> New dashboard</button> : null}
      />
      <div className="tabs" role="tablist" style={{ marginBottom: 16 }}>
        <button role="tab" aria-selected={tab === 'active'} className={`tab${tab === 'active' ? ' active' : ''}`} onClick={() => setTab('active')}>Active</button>
        <button role="tab" aria-selected={tab === 'archived'} className={`tab${tab === 'archived' ? ' active' : ''}`} onClick={() => setTab('archived')}>Archived</button>
      </div>
      <div className="folder-layout">
      <FolderPanel wsId={ws.id} scope="dashboards" label="Dashboards" selected={folder} onSelect={setFolder} counts={counts} canEdit={editable} onFile={fileInto} />
      <div style={{ minWidth: 0 }}>
      <FolderHeader folders={folders.data ?? []} selected={folder} onSelect={setFolder} counts={counts.byFolder} />
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !visible.length ? (
        <EmptyState
          icon="chart"
          title={q.data?.length ? 'This folder is empty' : tab === 'archived' ? 'No archived dashboards' : 'No dashboards yet'}
          action={tab === 'active' && editable ? <button className="btn primary" onClick={() => setCreating(true)}>Create a dashboard</button> : null}
        >
          {tab === 'active' ? 'Combine status, workload, deadlines and progress from multiple boards in one place.' : null}
        </EmptyState>
      ) : (
        <div className="grid-cards">
          {visible.map((d) => (
            <div key={d.id} className="tile" {...(editable ? entityDragProps(d.id) : { style: { cursor: 'default' } })}>
              <div className="row">
                <Icon name="chart" />
                <Link to={`/w/${ws.id}/dashboards/${d.id}`} className="grow ellipsis" style={{ fontWeight: 650, color: 'var(--text)' }}>{d.name}</Link>
                {editable ? (
                  <Dropdown
                    align="end"
                    trigger={(open, ref) => (
                      <button ref={ref} className="btn ghost icon sm" aria-label={`Actions for ${d.name}`} onClick={open}><Icon name="more" /></button>
                    )}
                  >
                    {(close) => (
                      <>
                        <MenuItem icon="copy" onClick={() => { close(); act(() => post(`/dashboards/${d.id}/duplicate`), 'Dashboard duplicated'); }}>Duplicate</MenuItem>
                        <MoveToFolderItems folders={folders.data ?? []} current={d.folderId} onPick={(f) => { close(); fileInto(d.id, f); }} />
                        {d.archivedAt ? (
                          <MenuItem icon="restore" onClick={() => { close(); act(() => post(`/dashboards/${d.id}/archive`, { archived: false }), 'Dashboard restored'); }}>Restore</MenuItem>
                        ) : (
                          <MenuItem icon="archive" onClick={() => { close(); act(() => post(`/dashboards/${d.id}/archive`, { archived: true }), 'Dashboard archived'); }}>Archive</MenuItem>
                        )}
                        {d.createdBy === user.id || isAdmin(ws.role) ? (
                          <>
                            <MenuSep />
                            <MenuItem
                              icon="trash"
                              danger
                              onClick={async () => {
                                close();
                                if (await confirm({ title: 'Delete dashboard?', message: `"${d.name}" and its widgets will be permanently deleted. Board data is not affected.`, confirmLabel: 'Delete', danger: true })) {
                                  act(() => del(`/dashboards/${d.id}`), 'Dashboard deleted');
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
                ) : null}
              </div>
              {folder === 'all' && d.folderId && folderById.get(d.folderId) ? <span className="badge" style={{ gap: 5, alignSelf: 'flex-start' }}><FolderIcon color={folderById.get(d.folderId)!.color} size={13} /> {folderById.get(d.folderId)!.name}</span> : null}
              {d.description ? <div className="muted small">{d.description}</div> : null}
              <div className="muted small">
                {d.boardIds.length ? plural(d.boardIds.length, 'source board') : 'All accessible boards'} · updated {timeAgo(d.updatedAt)}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
      {creating ? <CreateDashboardDialog wsId={ws.id} folderId={newFolder} onClose={() => setCreating(false)} /> : null}
    </div>
  );
}
