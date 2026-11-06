import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { BoardViewProps } from '../types';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Icon } from '../../components/ui/Icon';
import { useConfirm, useToast } from '../../components/ui/overlays';
import { del, errorMessage, get } from '../../lib/api';
import { formatBytes, timeAgo } from '../../lib/format';
import '../../styles/views.css';

interface BoardFile {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  url: string;
  itemId: string;
  itemName: string;
  uploaderName: string;
  createdAt: number;
}

type Kind = 'all' | 'image' | 'pdf' | 'doc' | 'other';

function kindOf(f: BoardFile): Exclude<Kind, 'all'> {
  if (f.contentType.startsWith('image/')) return 'image';
  if (f.contentType === 'application/pdf') return 'pdf';
  if (/word|sheet|presentation|opendocument|text\/|json|csv|markdown/.test(f.contentType)) return 'doc';
  return 'other';
}

export function FilesView(props: BoardViewProps) {
  const { bundle, canEdit, openItem } = props;
  const boardId = bundle.board.id;
  const q = useQuery({ queryKey: ['board-files', boardId], queryFn: () => get<BoardFile[]>(`/boards/${boardId}/files`) });
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [kind, setKind] = useState<Kind>('all');
  const [search, setSearch] = useState('');
  const confirm = useConfirm();
  const toast = useToast();
  const qc = useQueryClient();

  if (q.isLoading) return <Loading label="Loading files…" />;
  if (q.error) return <div className="files-view"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  const all = q.data ?? [];
  const files = all.filter((f) => (kind === 'all' || kindOf(f) === kind) && (!search || f.fileName.toLowerCase().includes(search.toLowerCase()) || f.itemName.toLowerCase().includes(search.toLowerCase())));

  const remove = async (f: BoardFile) => {
    if (!(await confirm({ title: 'Delete file?', message: `"${f.fileName}" will be permanently removed from "${f.itemName}".`, confirmLabel: 'Delete', danger: true }))) return;
    try {
      await del(`/files/${f.id}`);
      qc.invalidateQueries({ queryKey: ['board-files', boardId] });
      qc.invalidateQueries({ queryKey: ['board', boardId] });
      qc.invalidateQueries({ queryKey: ['item', f.itemId] });
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  const icon = (f: BoardFile) => (kindOf(f) === 'image' ? 'image' : kindOf(f) === 'pdf' ? 'doc' : 'file');

  return (
    <div className="files-view">
      <div className="row wrap" style={{ marginBottom: 12 }}>
        <input className="input sm" style={{ maxWidth: 240 }} placeholder="Search files" aria-label="Search files" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="seg" role="group" aria-label="File type">
          {(['all', 'image', 'pdf', 'doc', 'other'] as Kind[]).map((k) => (
            <button key={k} className={kind === k ? 'on' : ''} aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k === 'all' ? 'All' : k === 'image' ? 'Images' : k === 'pdf' ? 'PDF' : k === 'doc' ? 'Documents' : 'Other'}
            </button>
          ))}
        </div>
        <span className="spacer" />
        <span className="muted small">{files.length} of {all.length}</span>
        <div className="seg" role="group" aria-label="Layout">
          <button className={layout === 'grid' ? 'on' : ''} aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')} aria-label="Grid"><Icon name="grid" size={14} /></button>
          <button className={layout === 'list' ? 'on' : ''} aria-pressed={layout === 'list'} onClick={() => setLayout('list')} aria-label="List"><Icon name="list" size={14} /></button>
        </div>
      </div>
      {all.length === 0 ? (
        <EmptyState icon="paperclip" title="No files yet">Files attached to items on this board appear here. Open an item to upload files.</EmptyState>
      ) : files.length === 0 ? (
        <div className="muted">No files match.</div>
      ) : layout === 'grid' ? (
        <div className="files-grid">
          {files.map((f) => (
            <div key={f.id} className="file-card">
              <a className="file-thumb" href={f.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${f.fileName}`}>
                {kindOf(f) === 'image' ? <img src={f.url} alt={f.fileName} loading="lazy" /> : <Icon name={icon(f)} size={36} />}
              </a>
              <div className="file-meta">
                <span className="fname" title={f.fileName}>{f.fileName}</span>
                <button className="btn ghost sm ellipsis" style={{ padding: 0, justifyContent: 'flex-start', height: 18 }} onClick={() => openItem(f.itemId)}>{f.itemName}</button>
                <span className="muted">{formatBytes(f.size)} · {f.uploaderName} · {timeAgo(f.createdAt)}</span>
                <div className="row" style={{ marginTop: 4 }}>
                  <a className="btn sm" href={`${f.url}?download=1`}><Icon name="download" size={13} /> Download</a>
                  {canEdit ? <button className="btn ghost icon sm" aria-label={`Delete ${f.fileName}`} onClick={() => remove(f)}><Icon name="trash" size={14} /></button> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead><tr><th>File</th><th>Item</th><th>Size</th><th>Uploaded by</th><th>Date</th><th /></tr></thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id}>
                  <td><a className="row" href={f.url} target="_blank" rel="noopener noreferrer"><Icon name={icon(f)} /> <span className="ellipsis" style={{ maxWidth: 260 }}>{f.fileName}</span></a></td>
                  <td><button className="btn ghost sm" onClick={() => openItem(f.itemId)}>{f.itemName}</button></td>
                  <td>{formatBytes(f.size)}</td>
                  <td>{f.uploaderName}</td>
                  <td>{timeAgo(f.createdAt)}</td>
                  <td>
                    <div className="row">
                      <a className="btn ghost icon sm" href={`${f.url}?download=1`} aria-label={`Download ${f.fileName}`}><Icon name="download" /></a>
                      {canEdit ? <button className="btn ghost icon sm" aria-label={`Delete ${f.fileName}`} onClick={() => remove(f)}><Icon name="trash" /></button> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
