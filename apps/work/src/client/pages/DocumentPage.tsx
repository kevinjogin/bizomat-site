import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, del, errorMessage, get, patch, post } from '../lib/api';
import { canEdit, useWorkspace } from '../lib/session';
import { useLocalState } from '../lib/hooks';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { ErrorBox, Loading } from '../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, useConfirm, useToast } from '../components/ui/overlays';
import { useBoards } from '../components/layout/CreateDialogs';
import { DocEditorContent, EditorToolbar, useDocEditor, type JSONContent } from './docs/Editor';
import { AttachmentsPanel, CommentsPanel, HistoryDialog, LinkBoardDialog, ShareDialog, type DocAttachment } from './docs/DocSide';
import '../styles/content.css';

interface DocDetail {
  id: string;
  workspaceId: string;
  title: string;
  content: JSONContent;
  boardId: string | null;
  itemId: string | null;
  visibility: 'workspace' | 'private';
  version: number;
  createdBy: string;
  updatedBy: string | null;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
  access: 'view' | 'edit' | 'admin';
  members: { user_id: string; role: string; name: string }[];
  attachments: DocAttachment[];
}

type SaveState = 'saved' | 'dirty' | 'saving' | 'error' | 'conflict';

export default function DocumentPage() {
  const { docId } = useParams();
  const q = useQuery({ queryKey: ['document', docId], queryFn: () => get<DocDetail>(`/documents/${docId}`), refetchOnWindowFocus: false, staleTime: Infinity });
  if (q.isLoading) return <Loading />;
  if (q.error) return <div className="page"><ErrorBox error={q.error} retry={() => q.refetch()} /></div>;
  // Re-mount the editor when the server-side version changes outside this editor (restore / reload).
  return <DocumentEditor key={`${q.data!.id}`} doc={q.data!} reload={() => q.refetch()} />;
}

function DocumentEditor({ doc, reload }: { doc: DocDetail; reload: () => Promise<unknown> }) {
  const ws = useWorkspace();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const boards = useBoards(ws.id);
  const readOnly = doc.access === 'view' || !!doc.archivedAt;
  const [title, setTitle] = useState(doc.title);
  const [state, setState] = useState<SaveState>('saved');
  const [savedAt, setSavedAt] = useState<number>(doc.updatedAt);
  const [conflict, setConflict] = useState<DocDetail | null>(null);
  const [sideOpen, setSideOpen] = useLocalState('workos:doc-side', true);
  const [dialog, setDialog] = useState<null | 'history' | 'share' | 'link'>(null);

  const version = useRef(doc.version);
  const pending = useRef<{ title?: string; content?: JSONContent } | null>(null);
  const saving = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const blocked = useRef(false);

  const flush = useCallback(async () => {
    if (saving.current || !pending.current || blocked.current) return;
    const payload = pending.current;
    pending.current = null;
    saving.current = true;
    setState('saving');
    try {
      const r = await patch<{ version: number; updatedAt: number }>(`/documents/${doc.id}`, { ...payload, baseVersion: version.current });
      version.current = r.version;
      setSavedAt(r.updatedAt);
      setState(pending.current ? 'dirty' : 'saved');
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) {
        blocked.current = true;
        pending.current = { ...payload, ...(pending.current ?? {}) };
        setConflict(e.body?.latest ?? null);
        setState('conflict');
      } else {
        pending.current = { ...payload, ...(pending.current ?? {}) };
        setState('error');
        toast(`Couldn't save: ${errorMessage(e)}`, 'error');
      }
    } finally {
      saving.current = false;
      if (pending.current && !blocked.current) {
        clearTimeout(timer.current);
        timer.current = setTimeout(flush, 800);
      }
    }
  }, [doc.id, toast]);

  const queue = useCallback(
    (part: { title?: string; content?: JSONContent }) => {
      if (readOnly) return;
      pending.current = { ...(pending.current ?? {}), ...part };
      setState(blocked.current ? 'conflict' : 'dirty');
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, 1000);
    },
    [flush, readOnly],
  );

  const editor = useDocEditor({ content: doc.content, editable: !readOnly, onChange: (json) => queue({ content: json }) });

  useEffect(() => {
    editor?.setEditable(!readOnly);
  }, [editor, readOnly]);

  // Save on leave; warn on unload when changes are pending.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pending.current || saving.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      clearTimeout(timer.current);
      if (pending.current && !blocked.current) {
        void patch(`/documents/${doc.id}`, { ...pending.current, baseVersion: version.current }).catch(() => {});
      }
      qc.invalidateQueries({ queryKey: ['documents', ws.id] });
    };
  }, [doc.id, qc, ws.id]);

  useEffect(() => {
    document.title = `${title || 'Untitled'} · KEVOS WorkOS`;
  }, [title]);

  const isFavQ = useQuery({ queryKey: ['favourites', ws.id], queryFn: () => get<any[]>(`/workspaces/${ws.id}/favourites`) });
  const isFav = !!isFavQ.data?.some((f) => f.type === 'document' && f.id === doc.id);

  const resolveConflict = async (mode: 'reload' | 'overwrite') => {
    if (mode === 'reload') {
      pending.current = null;
      blocked.current = false;
      setConflict(null);
      await qc.invalidateQueries({ queryKey: ['document', doc.id] });
      const fresh = await get<DocDetail>(`/documents/${doc.id}`);
      version.current = fresh.version;
      editor?.commands.setContent(fresh.content, { emitUpdate: false });
      setTitle(fresh.title);
      setState('saved');
      setSavedAt(fresh.updatedAt);
    } else {
      const latest = conflict ?? (await get<DocDetail>(`/documents/${doc.id}`));
      version.current = latest.version;
      blocked.current = false;
      setConflict(null);
      pending.current = { title, content: editor?.getJSON() };
      await flush();
    }
  };

  const linkedBoard = (boards.data ?? []).find((b) => b.id === doc.boardId);
  const statusText =
    state === 'saving' ? 'Saving…' : state === 'dirty' ? 'Unsaved changes' : state === 'error' ? 'Save failed — retrying' : state === 'conflict' ? 'Conflict' : `Saved ${timeAgo(savedAt)}`;

  const refreshDoc = async () => {
    const fresh = await get<DocDetail>(`/documents/${doc.id}`);
    qc.setQueryData(['document', doc.id], (old: DocDetail | undefined) => (old ? { ...old, members: fresh.members, attachments: fresh.attachments, visibility: fresh.visibility, boardId: fresh.boardId, itemId: fresh.itemId } : fresh));
  };

  const run = async (fn: () => Promise<unknown>, msg?: string) => {
    try {
      await fn();
      if (msg) toast(msg);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };

  return (
    <div className="page full">
      <div className="doc-topbar">
        <Link to={`/w/${ws.id}/docs`} className="btn ghost sm"><Icon name="chevronLeft" size={14} /> Documents</Link>
        {linkedBoard ? (
          <Link to={doc.itemId ? `/w/${ws.id}/boards/${linkedBoard.id}?item=${doc.itemId}` : `/w/${ws.id}/boards/${linkedBoard.id}`} className="badge accent"><Icon name="grid" size={11} /> {linkedBoard.name}{doc.itemId ? ' · item' : ''}</Link>
        ) : null}
        {doc.visibility === 'private' ? <span className="badge"><Icon name="lock" size={11} /> Private</span> : null}
        {readOnly ? <span className="badge warning">{doc.archivedAt ? 'Archived — read only' : 'View only'}</span> : null}
        <span className="spacer" />
        {!readOnly ? <span className={`small ${state === 'error' || state === 'conflict' ? 'danger-text' : 'muted'}`} aria-live="polite">{statusText}</span> : null}
        <button className="btn ghost icon sm" aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={isFav} style={{ color: isFav ? 'var(--warning)' : undefined }} onClick={() => run(async () => {
          if (isFav) await del(`/workspaces/${ws.id}/favourites/document/${doc.id}`);
          else await post(`/workspaces/${ws.id}/favourites`, { type: 'document', id: doc.id });
          qc.invalidateQueries({ queryKey: ['favourites', ws.id] });
        })}><Icon name="star" /></button>
        <button className="btn sm" onClick={() => setDialog('history')}><Icon name="history" size={14} /> History</button>
        {doc.access === 'admin' ? <button className="btn sm" onClick={() => setDialog('share')}><Icon name="share" size={14} /> Share</button> : null}
        <button className="btn sm" aria-pressed={sideOpen} onClick={() => setSideOpen(!sideOpen)}><Icon name="message" size={14} /> <span className="desktop-only">Comments</span></button>
        <Dropdown align="end" trigger={(open, ref) => <button ref={ref} className="btn ghost icon sm" aria-label="More document actions" onClick={open}><Icon name="more" /></button>}>
          {(close) => (
            <>
              {!readOnly ? <MenuItem icon="link" onClick={() => { close(); setDialog('link'); }}>Connect to board / item</MenuItem> : null}
              {canEdit(ws.role) ? <MenuItem icon="copy" onClick={() => { close(); run(async () => { const r = await post(`/documents/${doc.id}/duplicate`); navigate(`/w/${ws.id}/docs/${r.id}`); }, 'Document duplicated'); }}>Duplicate</MenuItem> : null}
              {doc.access === 'admin' ? (
                <>
                  <MenuItem icon={doc.archivedAt ? 'restore' : 'archive'} onClick={() => { close(); run(async () => { await post(`/documents/${doc.id}/archive`, { archived: !doc.archivedAt }); await reload(); }, doc.archivedAt ? 'Document restored' : 'Document archived'); }}>{doc.archivedAt ? 'Restore' : 'Archive'}</MenuItem>
                  <MenuSep />
                  <MenuItem icon="trash" danger onClick={async () => {
                    close();
                    if (await confirm({ title: 'Delete document?', message: 'This permanently deletes the document, its history, comments and attachments.', danger: true, confirmLabel: 'Delete', typeToConfirm: title || 'Untitled' })) {
                      pending.current = null;
                      blocked.current = true;
                      await run(() => del(`/documents/${doc.id}`), 'Document deleted');
                      navigate(`/w/${ws.id}/docs`);
                    }
                  }}>Delete</MenuItem>
                </>
              ) : null}
            </>
          )}
        </Dropdown>
      </div>
      <div className={`doc-layout${sideOpen ? ' with-side' : ''}`} style={{ flex: 1 }}>
        <div style={{ minWidth: 0, overflow: 'auto' }}>
          <div className="doc-wrap">
            {conflict || state === 'conflict' ? (
              <div className="error-box conflict-banner row wrap" role="alert">
                <span className="grow">
                  This document was changed by {conflict?.updatedBy ? 'someone else' : 'another session'} (version {conflict?.version ?? '?'}). Your latest edits have not been saved.
                </span>
                <button className="btn sm" onClick={() => resolveConflict('reload')}>Discard mine &amp; reload</button>
                <button className="btn sm danger" onClick={() => resolveConflict('overwrite')}>Keep mine (overwrite)</button>
              </div>
            ) : null}
            <input
              className="doc-title"
              aria-label="Document title"
              value={title}
              placeholder="Untitled"
              readOnly={readOnly}
              maxLength={300}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) queue({ title: e.target.value.trim() });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  editor?.commands.focus('start');
                }
              }}
            />
            {!readOnly && editor ? <EditorToolbar editor={editor} documentId={doc.id} /> : null}
            <DocEditorContent editor={editor} readOnly={readOnly} />
          </div>
        </div>
        {sideOpen ? (
          <aside className="doc-side" aria-label="Document sidebar">
            <AttachmentsPanel docId={doc.id} attachments={doc.attachments} editable={!readOnly} onChanged={refreshDoc} />
            <CommentsPanel docId={doc.id} wsId={ws.id} canModerate={doc.access === 'admin'} />
          </aside>
        ) : null}
      </div>
      {dialog === 'history' ? (
        <HistoryDialog
          docId={doc.id}
          canRestore={!readOnly}
          onClose={() => setDialog(null)}
          onRestored={async () => {
            const fresh = await get<DocDetail>(`/documents/${doc.id}`);
            pending.current = null;
            version.current = fresh.version;
            editor?.commands.setContent(fresh.content, { emitUpdate: false });
            setTitle(fresh.title);
            setState('saved');
            setSavedAt(fresh.updatedAt);
          }}
        />
      ) : null}
      {dialog === 'share' ? <ShareDialog docId={doc.id} wsId={ws.id} visibility={doc.visibility} docMembers={doc.members} createdBy={doc.createdBy} onClose={() => setDialog(null)} onChanged={refreshDoc} /> : null}
      {dialog === 'link' ? <LinkBoardDialog docId={doc.id} wsId={ws.id} boardId={doc.boardId} itemId={doc.itemId} onClose={() => setDialog(null)} onChanged={refreshDoc} /> : null}
    </div>
  );
}
