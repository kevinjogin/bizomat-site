import { Fragment, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import { Image } from '@tiptap/extension-image';
import { del, errorMessage, get, patch, post, put, upload } from '../../lib/api';
import { useMembers, useUser } from '../../lib/session';
import { formatBytes, timeAgo } from '../../lib/format';
import { Icon } from '../../components/ui/Icon';
import { Avatar, ErrorBox, Field, Loading, Spinner } from '../../components/ui/ui';
import { Dropdown, MenuItem, Modal, useConfirm, useToast } from '../../components/ui/overlays';
import { useBoards } from '../../components/layout/CreateDialogs';
import type { MemberDTO } from '../../../shared/types';

export interface DocComment {
  id: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  body: string;
  resolvedAt: number | null;
  createdAt: number;
}

/** Render `@[Name](user:id)` tokens as mention chips without using innerHTML. */
export function renderMentions(body: string): ReactNode {
  const parts: ReactNode[] = [];
  const re = /@\[([^\]]{1,80})\]\(user:[A-Za-z0-9_-]{1,64}\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(body))) {
    if (m.index > last) parts.push(<Fragment key={i++}>{body.slice(last, m.index)}</Fragment>);
    parts.push(<span key={i++} className="mention">@{m[1]}</span>);
    last = m.index + m[0].length;
  }
  if (last < body.length) parts.push(<Fragment key={i++}>{body.slice(last)}</Fragment>);
  return parts;
}

export function MentionInput({ value, onChange, members, placeholder, onSubmit, label }: { value: string; onChange: (v: string) => void; members: MemberDTO[]; placeholder: string; onSubmit: () => void; label: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const insert = (m: MemberDTO) => {
    const el = ref.current;
    const token = `@[${m.name.replace(/[[\]]/g, '')}](user:${m.id}) `;
    const pos = el?.selectionStart ?? value.length;
    // Replace a trailing "@" the user typed to trigger the picker.
    const before = value.slice(0, pos).replace(/@$/, '');
    onChange(before + token + value.slice(pos));
    setTimeout(() => el?.focus(), 0);
  };
  return (
    <div className="col" style={{ gap: 6 }}>
      <textarea
        ref={ref}
        className="textarea"
        aria-label={label}
        style={{ minHeight: 64 }}
        placeholder={placeholder}
        value={value}
        maxLength={5000}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="row">
        <Dropdown
          width={240}
          label="Mention someone"
          trigger={(open, r) => (
            <button ref={r} type="button" className="btn ghost sm" onClick={open} aria-label="Mention a person">
              @ Mention
            </button>
          )}
        >
          {(close) => members.map((m) => (
            <MenuItem key={m.id} onClick={() => { close(); insert(m); }}>
              <span className="row"><Avatar name={m.name} id={m.id} url={m.avatarUrl} size="sm" /> {m.name}</span>
            </MenuItem>
          ))}
        </Dropdown>
        <span className="spacer" />
        <button type="button" className="btn primary sm" disabled={!value.trim()} onClick={onSubmit}>Post</button>
      </div>
    </div>
  );
}

export function CommentsPanel({ docId, wsId, canModerate }: { docId: string; wsId: string; canModerate: boolean }) {
  const user = useUser();
  const members = useMembers(wsId);
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const q = useQuery({ queryKey: ['doc-comments', docId], queryFn: () => get<DocComment[]>(`/documents/${docId}/comments`) });
  const refresh = () => qc.invalidateQueries({ queryKey: ['doc-comments', docId] });
  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const top = (q.data ?? []).filter((c) => !c.parentId && (showResolved || !c.resolvedAt));
  const replies = (id: string) => (q.data ?? []).filter((c) => c.parentId === id);
  const resolvedCount = (q.data ?? []).filter((c) => !c.parentId && c.resolvedAt).length;
  return (
    <section aria-label="Comments">
      <div className="row" style={{ marginBottom: 8 }}>
        <h3 className="grow">Comments</h3>
        {resolvedCount ? <button className="btn ghost sm" onClick={() => setShowResolved((s) => !s)}>{showResolved ? 'Hide' : 'Show'} resolved ({resolvedCount})</button> : null}
      </div>
      <MentionInput label="New comment" value={text} onChange={setText} members={members.data ?? []} placeholder="Add a comment… (Ctrl+Enter to post)" onSubmit={() => run(async () => { await post(`/documents/${docId}/comments`, { body: text.trim() }); setText(''); })} />
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} /> : !top.length ? <p className="muted small" style={{ marginTop: 12 }}>No comments yet.</p> : null}
      {top.map((c) => (
        <div key={c.id} className={`comment${c.resolvedAt ? ' resolved' : ''}`}>
          <CommentLine c={c} />
          <div className="row" style={{ marginTop: 4 }}>
            <button className="btn ghost sm" onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText(''); }}>Reply</button>
            {canModerate || c.authorId === user.id ? (
              <button className="btn ghost sm" onClick={() => run(() => patch(`/document-comments/${c.id}`, { resolved: !c.resolvedAt }))}>{c.resolvedAt ? 'Reopen' : 'Resolve'}</button>
            ) : null}
            {canModerate || c.authorId === user.id ? (
              <button className="btn ghost sm" aria-label="Delete comment" onClick={async () => { if (await confirm({ title: 'Delete comment?', message: 'The comment and its replies will be removed.', danger: true, confirmLabel: 'Delete' })) run(() => del(`/document-comments/${c.id}`)); }}>
                <Icon name="trash" size={13} />
              </button>
            ) : null}
          </div>
          {replies(c.id).length || replyTo === c.id ? (
            <div className="replies">
              {replies(c.id).map((r) => (
                <div key={r.id}>
                  <CommentLine c={r} />
                  {canModerate || r.authorId === user.id ? (
                    <button className="btn ghost sm" aria-label="Delete reply" onClick={() => run(() => del(`/document-comments/${r.id}`))}><Icon name="trash" size={12} /></button>
                  ) : null}
                </div>
              ))}
              {replyTo === c.id ? (
                <MentionInput label="Reply" value={replyText} onChange={setReplyText} members={members.data ?? []} placeholder="Write a reply…" onSubmit={() => run(async () => { await post(`/documents/${docId}/comments`, { body: replyText.trim(), parentId: c.id }); setReplyText(''); setReplyTo(null); })} />
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
}

function CommentLine({ c }: { c: DocComment }) {
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <Avatar name={c.authorName} id={c.authorId} size="sm" />
      <div className="grow" style={{ minWidth: 0 }}>
        <div className="small"><strong>{c.authorName}</strong> <span className="muted">{timeAgo(c.createdAt)}</span> {c.resolvedAt ? <span className="badge success">Resolved</span> : null}</div>
        <div className="update-body small">{renderMentions(c.body)}</div>
      </div>
    </div>
  );
}

export interface DocAttachment {
  id: string;
  fileName: string;
  contentType: string;
  size: number;
  url: string;
  createdAt: number;
}

export function AttachmentsPanel({ docId, attachments, editable, onChanged }: { docId: string; attachments: DocAttachment[]; editable: boolean; onChanged: () => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      try {
        const form = new FormData();
        form.set('file', f);
        form.set('scope', 'document');
        form.set('documentId', docId);
        await upload(form);
      } catch (e) {
        toast(`${f.name}: ${errorMessage(e)}`, 'error');
      }
    }
    setBusy(false);
    if (ref.current) ref.current.value = '';
    onChanged();
  };
  return (
    <section aria-label="Attachments" style={{ marginBottom: 20 }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <h3 className="grow">Attachments</h3>
        {editable ? (
          <>
            <button className="btn sm" onClick={() => ref.current?.click()} disabled={busy}>{busy ? <Spinner /> : <Icon name="paperclip" size={14} />} Attach</button>
            <input ref={ref} type="file" multiple hidden onChange={(e) => onFiles(e.target.files)} />
          </>
        ) : null}
      </div>
      {!attachments.length ? <p className="muted small">No files attached. Max 25 MB per file.</p> : (
        <div className="list">
          {attachments.map((a) => (
            <div key={a.id} className="row small" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <Icon name="file" size={14} />
              <a className="grow ellipsis" href={a.url} target="_blank" rel="noopener noreferrer">{a.fileName}</a>
              <span className="muted">{formatBytes(a.size)}</span>
              <a className="btn ghost icon sm" href={`${a.url}?download=1`} aria-label={`Download ${a.fileName}`}><Icon name="download" size={13} /></a>
              {editable ? (
                <button className="btn ghost icon sm" aria-label={`Delete ${a.fileName}`} onClick={async () => {
                  if (!(await confirm({ title: 'Delete file?', message: a.fileName, danger: true, confirmLabel: 'Delete' }))) return;
                  try { await del(`/files/${a.id}`); onChanged(); } catch (e) { toast(errorMessage(e), 'error'); }
                }}><Icon name="trash" size={13} /></button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const PREVIEW_EXTENSIONS = [StarterKit, TaskList, TaskItem, Table, TableRow, TableHeader, TableCell, Image];

export function HistoryDialog({ docId, canRestore, onClose, onRestored }: { docId: string; canRestore: boolean; onClose: () => void; onRestored: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const list = useQuery({ queryKey: ['doc-versions', docId], queryFn: () => get<{ id: string; version: number; title: string; created_at: number; author: string }[]>(`/documents/${docId}/versions`) });
  const preview = useQuery({ queryKey: ['doc-version', docId, selected], queryFn: () => get(`/documents/${docId}/versions/${selected}`), enabled: !!selected });
  let html = '';
  try {
    // generateHTML renders from the server-sanitised JSON schema (no raw HTML from users).
    html = preview.data?.content ? generateHTML(preview.data.content, PREVIEW_EXTENSIONS) : '';
  } catch {
    html = '';
  }
  return (
    <Modal wide title="Version history" onClose={onClose}>
      {list.isLoading ? <Loading /> : list.error ? <ErrorBox error={list.error} /> : (
        <div className="row" style={{ alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 230, maxHeight: '55vh', overflow: 'auto' }} role="listbox" aria-label="Versions">
            {(list.data ?? []).map((v) => (
              <button key={v.id} role="option" aria-selected={selected === v.id} className={`version-row${selected === v.id ? ' active' : ''}`} onClick={() => setSelected(v.id)}>
                <span className="badge">v{v.version}</span>
                <span className="grow" style={{ minWidth: 0 }}>
                  <span className="ellipsis" style={{ display: 'block' }}>{v.title}</span>
                  <span className="muted small">{v.author} · {timeAgo(v.created_at)}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="grow" style={{ minWidth: 260 }}>
            {!selected ? <p className="muted">Select a version to preview it.</p> : preview.isLoading ? <Loading /> : (
              <>
                <h3 style={{ marginBottom: 8 }}>{preview.data?.title}</h3>
                <div className="version-preview ProseMirror" dangerouslySetInnerHTML={{ __html: html }} />
                {canRestore ? (
                  <button
                    className="btn primary"
                    style={{ marginTop: 12 }}
                    onClick={async () => {
                      if (!(await confirm({ title: `Restore version ${preview.data?.version}?`, message: 'The current content is kept in history, so you can undo this.', confirmLabel: 'Restore' }))) return;
                      try {
                        await post(`/documents/${docId}/versions/${selected}/restore`);
                        toast('Version restored');
                        onRestored();
                        onClose();
                      } catch (e) {
                        toast(errorMessage(e), 'error');
                      }
                    }}
                  >
                    <Icon name="restore" /> Restore this version
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export function ShareDialog({ docId, wsId, visibility, docMembers, createdBy, onClose, onChanged }: { docId: string; wsId: string; visibility: 'workspace' | 'private'; docMembers: { user_id: string; role: string; name: string }[]; createdBy: string; onClose: () => void; onChanged: () => void }) {
  const members = useMembers(wsId);
  const toast = useToast();
  const [addUser, setAddUser] = useState('');
  const [addRole, setAddRole] = useState<'editor' | 'viewer'>('viewer');
  const run = async (fn: () => Promise<unknown>) => {
    try {
      await fn();
      onChanged();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const candidates = (members.data ?? []).filter((m) => m.id !== createdBy && !docMembers.some((d) => d.user_id === m.id));
  return (
    <Modal title="Share document" onClose={onClose} footer={<button className="btn primary" onClick={onClose}>Done</button>}>
      <Field label="General access">
        <select className="select" aria-label="General access" value={visibility} onChange={(e) => run(() => patch(`/documents/${docId}`, { visibility: e.target.value }))}>
          <option value="workspace">Everyone in the workspace (members can edit, viewers can read)</option>
          <option value="private">Private — only people added below</option>
        </select>
      </Field>
      <Field label="People with explicit access">
        <div className="col" style={{ gap: 6 }}>
          {docMembers.length ? docMembers.map((m) => (
            <div key={m.user_id} className="row">
              <Avatar name={m.name} id={m.user_id} size="sm" />
              <span className="grow">{m.name}</span>
              <select className="select sm" style={{ width: 'auto' }} aria-label={`Role for ${m.name}`} value={m.role} onChange={(e) => run(() => put(`/documents/${docId}/members`, { userId: m.user_id, role: e.target.value }))}>
                <option value="editor">Can edit</option>
                <option value="viewer">Can view</option>
              </select>
              <button className="btn ghost icon sm" aria-label={`Remove ${m.name}`} onClick={() => run(() => del(`/documents/${docId}/members/${m.user_id}`))}><Icon name="x" size={14} /></button>
            </div>
          )) : <span className="muted small">No one added yet. Workspace owners/admins and the author always have access.</span>}
        </div>
      </Field>
      <div className="row">
        <select className="select" aria-label="Person to add" value={addUser} onChange={(e) => setAddUser(e.target.value)}>
          <option value="">Add a person…</option>
          {candidates.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
        </select>
        <select className="select" style={{ width: 120 }} aria-label="Role" value={addRole} onChange={(e) => setAddRole(e.target.value as any)}>
          <option value="viewer">Can view</option>
          <option value="editor">Can edit</option>
        </select>
        <button className="btn" disabled={!addUser} onClick={() => run(async () => { await put(`/documents/${docId}/members`, { userId: addUser, role: addRole }); setAddUser(''); })}>Add</button>
      </div>
    </Modal>
  );
}

export function LinkBoardDialog({ docId, wsId, boardId, itemId, onClose, onChanged }: { docId: string; wsId: string; boardId: string | null; itemId: string | null; onClose: () => void; onChanged: () => void }) {
  const boards = useBoards(wsId);
  const toast = useToast();
  const [b, setB] = useState(boardId ?? '');
  const [i, setI] = useState(itemId ?? '');
  const bundle = useQuery({ queryKey: ['board-meta', b], queryFn: () => get(`/boards/${b}`), enabled: !!b, staleTime: 60_000 });
  const save = async () => {
    try {
      await patch(`/documents/${docId}`, { boardId: b || null, itemId: i || null });
      onChanged();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Modal title="Connect to a board" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={save}>Save</button></>}>
      <Field label="Board" htmlFor="lb-board">
        <select id="lb-board" className="select" value={b} onChange={(e) => { setB(e.target.value); setI(''); }}>
          <option value="">Not connected</option>
          {(boards.data ?? []).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </Field>
      {b ? (
        <Field label="Item (optional)" htmlFor="lb-item">
          <select id="lb-item" className="select" value={i} onChange={(e) => setI(e.target.value)}>
            <option value="">Whole board</option>
            {(bundle.data?.items ?? []).filter((x: any) => !x.parentItemId).map((x: any) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </Field>
      ) : null}
    </Modal>
  );
}
