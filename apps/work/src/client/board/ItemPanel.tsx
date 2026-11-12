import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getColumnType } from '../../shared/columns';
import type { ActivityDTO, AttachmentDTO, BoardBundle, ColumnDTO, ItemDTO, MemberDTO, UpdateDTO } from '../../shared/types';
import { del, errorMessage, get, patch, post, upload } from '../lib/api';
import { formatBytes, formatDuration, timeAgo, todayISO } from '../lib/format';
import { useUser } from '../lib/session';
import { Icon } from '../components/ui/Icon';
import { Avatar, EmptyState, ErrorBox, Loading, Spinner } from '../components/ui/ui';
import { MenuItem, MenuSep, Popover, useConfirm, useToast } from '../components/ui/overlays';
import { Cell, type CellCtx } from './cells/Cell';
import { isUnsaved, type BoardActions } from './useBoard';
import { useCreateDocument } from '../components/layout/CreateDialogs';
import { BASE, appUrl } from '../lib/base';
import { isFinancialColumn, type TaskCaps } from '../../shared/permissions';
import { TaskAccessTab } from './TaskAccess';

interface ItemDetail {
  item: ItemDTO;
  parent: { id: string; name: string } | null;
  board: { id: string; name: string; workspaceId: string; access: string };
  subitems: ItemDTO[];
  caps?: TaskCaps;
  attachments: AttachmentDTO[];
  timeEntries: { id: string; user_id: string; user_name: string; started_at: number; ended_at: number | null; duration_seconds: number | null; note: string }[];
}

type Tab = 'updates' | 'details' | 'subitems' | 'files' | 'activity' | 'time' | 'docs' | 'access';

/** What a person may change, column by column, from their rights on the task (src/shared/permissions.ts). */
export function columnEditable(caps: TaskCaps | undefined, fallback: boolean) {
  return (c: ColumnDTO) => {
    if (!caps) return fallback;
    if (isFinancialColumn(c)) return caps.editFinance;
    if (c.type === 'person' || c.type === 'people') return caps.manageAssignments;
    if (c.type === 'status') return caps.updateStatus || caps.edit;
    return caps.edit;
  };
}

export function ItemPanel({ itemId, bundle, computedItems, actions, canEdit, onClose, onOpen, members, memberName }: { itemId: string; bundle: BoardBundle; computedItems: ItemDTO[]; actions: BoardActions; canEdit: boolean; onClose: () => void; onOpen: (id: string) => void; members: MemberDTO[]; memberName: (id: string) => string | undefined }) {
  const [tab, setTab] = useState<Tab>('updates');
  // A just-added item opened before the server has saved it: BoardPage puts its real id in the address once saved.
  const unsaved = isUnsaved(itemId);
  const detail = useQuery({ queryKey: ['item', itemId], queryFn: () => get<ItemDetail>(`/items/${itemId}`), enabled: !unsaved });
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false);
  // Prefer the live board copy (optimistic + realtime) when available.
  const live = computedItems.find((i) => i.id === itemId);
  const item = live ?? detail.data?.item;
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['item', itemId] });
    qc.invalidateQueries({ queryKey: ['item-activity', itemId] });
    actions.refresh();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.querySelector('.popover, .overlay')) onClose();
    };
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const caps = detail.data?.caps;
  const editable = columnEditable(caps, canEdit);
  const editAll = caps ? caps.edit && canEdit : canEdit;
  const canShare = !!bundle.board.caps && (bundle.board.caps.manageMembers || bundle.board.caps.assignTasks) && detail.data?.board && (detail.data.board as { projectAccess?: boolean }).projectAccess !== false;
  const ctx: CellCtx = { members, items: computedItems, boardId: bundle.board.id, memberName, onUploaded: refresh, toast, memberAccess: bundle.memberAccess, canShareTask: !!canShare, workspaceId: bundle.board.workspaceId };
  const group = bundle.groups.find((g) => g.id === item?.groupId);
  const subitems = computedItems.filter((i) => i.parentItemId === itemId).sort((a, b) => a.position - b.position);

  const [name, setName] = useState(item?.name ?? '');
  useEffect(() => setName(item?.name ?? ''), [item?.name]);

  return createPortal(
    <>
      <div className="sidepanel-overlay" onClick={onClose} />
      <aside className="sidepanel" role="dialog" aria-modal="true" aria-label={item ? `Item ${item.name}` : 'Item'} ref={ref} tabIndex={-1}>
        {unsaved ? <Loading label="Saving the item…" /> : detail.isLoading && !item ? <Loading /> : detail.error && !item ? <div style={{ padding: 20 }}><ErrorBox error={detail.error} /></div> : item ? (
          <>
            <div className="panel-head">
              <div className="row small muted" style={{ marginBottom: 6 }}>
                <span className="icon-dot" style={{ background: group?.color }} />
                <span>{bundle.board.name}</span> <Icon name="chevronRight" size={12} /> <span>{group?.name}</span>
                {detail.data?.parent ? (<><Icon name="chevronRight" size={12} /><button className="btn ghost sm" onClick={() => onOpen(detail.data!.parent!.id)}>{detail.data.parent.name}</button></>) : null}
                <span className="spacer" />
                <button ref={menuRef} className="btn ghost icon sm" aria-label="Item actions" onClick={() => setMenu(true)}><Icon name="more" /></button>
                <button className="btn ghost icon sm" aria-label="Close panel" onClick={onClose}><Icon name="x" /></button>
              </div>
              <input
                className="panel-title"
                value={name}
                readOnly={!editAll}
                aria-label="Item name"
                onChange={(e) => setName(e.target.value)}
                onBlur={() => { if (name.trim() && name !== item.name) actions.updateItem(item.id, { name: name.trim() }); }}
                onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                maxLength={500}
              />
              <div className="tabs" role="tablist" style={{ marginTop: 8 }}>
                {(['updates', 'details', 'subitems', 'files', 'activity', 'time', 'docs', 'access'] as Tab[]).filter((t) => !(t === 'subitems' && item.parentItemId) && (t !== 'access' || canShare) && (t !== 'docs' || caps?.via !== 'task')).map((t) => (
                  <button key={t} role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                    {t === 'access' ? 'Access' : t === 'updates' ? `Updates${item.updateCount ? ` (${item.updateCount})` : ''}` : t === 'subitems' ? `Subitems (${subitems.length})` : t === 'files' ? `Files (${detail.data?.attachments.length ?? 0})` : t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-body">
              {tab === 'details' ? <DetailsTab item={item} columns={bundle.columns} ctx={ctx} canEdit={editAll} editable={editable} actions={actions} /> : null}
              {tab === 'updates' ? <UpdatesTab itemId={item.id} members={members} onPosted={refresh} canComment={caps ? caps.comment : true} /> : null}
              {tab === 'subitems' ? <SubitemsTab item={item} subitems={subitems} columns={bundle.columns} ctx={ctx} canEdit={editAll && (bundle.board.caps?.createTasks ?? canEdit)} actions={actions} onOpen={onOpen} /> : null}
              {tab === 'files' ? <FilesTab item={item} attachments={detail.data?.attachments ?? []} canEdit={caps ? caps.upload && canEdit : canEdit} refresh={refresh} /> : null}
              {tab === 'access' ? <TaskAccessTab item={item} bundle={bundle} canViewFinance={!!caps?.viewFinance} /> : null}
              {tab === 'activity' ? <ActivityTab itemId={item.id} columns={bundle.columns} ctx={ctx} /> : null}
              {tab === 'time' ? <TimeTab item={item} entries={detail.data?.timeEntries ?? []} canEdit={canEdit} refresh={refresh} /> : null}
              {tab === 'docs' ? <DocsTab item={item} workspaceId={bundle.board.workspaceId} canEdit={canEdit} /> : null}
            </div>
            {menu ? (
              <Popover anchor={menuRef} onClose={() => setMenu(false)} align="end">
                <MenuItem icon="link" onClick={() => { setMenu(false); navigator.clipboard?.writeText(`${location.origin}${BASE}/w/${bundle.board.workspaceId}/tasks/${item.id}`).then(() => toast('Link copied')); }}>Copy link</MenuItem>
                {canEdit && caps?.via !== 'task' ? (
                  <>
                    <MenuItem icon="copy" onClick={() => { setMenu(false); actions.duplicateItem(item.id); toast('Item duplicated'); }}>Duplicate</MenuItem>
                    <MenuSep />
                    <MenuItem icon="archive" onClick={() => { setMenu(false); actions.archiveItem(item.id); onClose(); toast('Item archived'); }}>Archive</MenuItem>
                    <MenuItem icon="trash" danger onClick={async () => { setMenu(false); if (await confirm({ title: `Delete "${item.name}"?`, message: 'This permanently deletes the item with its subitems, updates and files.', danger: true, confirmLabel: 'Delete' })) { await actions.deleteItem(item.id); onClose(); } }}>Delete</MenuItem>
                  </>
                ) : null}
              </Popover>
            ) : null}
          </>
        ) : (
          <EmptyState title="Item not found" icon="x">It may have been deleted or archived.</EmptyState>
        )}
      </aside>
    </>,
    document.body,
  );
}

function DetailsTab({ item, columns, ctx, canEdit, editable, actions }: { item: ItemDTO; columns: ColumnDTO[]; ctx: CellCtx; canEdit: boolean; editable: (c: ColumnDTO) => boolean; actions: BoardActions }) {
  const [desc, setDesc] = useState(item.description);
  useEffect(() => setDesc(item.description), [item.description]);
  return (
    <div className="stack-lg">
      <div className="props">
        {columns.map((c) => (
          <PropRow key={c.id} label={c.title} icon={iconFor(c.type)} hint={c.description}>
            <Cell column={c} item={item} value={item.values[c.id]} ctx={ctx} canEdit={editable(c)} onChange={(v) => actions.setValue(item.id, c.id, v)} variant="panel" />
          </PropRow>
        ))}
        <PropRow label="Created" icon="clock"><span className="small muted">{new Date(item.createdAt).toLocaleString()}</span></PropRow>
        <PropRow label="Last updated" icon="clock"><span className="small muted">{new Date(item.updatedAt).toLocaleString()}</span></PropRow>
        {item.completedAt ? <PropRow label="Completed" icon="check"><span className="small success-text">{new Date(item.completedAt).toLocaleString()}</span></PropRow> : null}
      </div>
      <div className="field">
        <label htmlFor="item-desc">Description</label>
        <textarea
          id="item-desc"
          className="textarea"
          rows={6}
          value={desc}
          readOnly={!canEdit}
          placeholder={canEdit ? 'Add a description…' : 'No description'}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={() => desc !== item.description && actions.updateItem(item.id, { description: desc })}
          maxLength={20000}
        />
      </div>
    </div>
  );
}

function PropRow({ label, icon, children, hint }: { label: string; icon: string; children: ReactNode; hint?: string }) {
  return (
    <>
      <div className="prop-label" title={hint || undefined}><Icon name={icon} size={14} /> <span className="ellipsis">{label}</span></div>
      <div className="prop-value">{children}</div>
    </>
  );
}

function iconFor(type: string) {
  const m: Record<string, string> = { status: 'flag', priority: 'flag', person: 'user', people: 'users', date: 'calendar', timeline: 'timeline', number: 'hash', currency: 'hash', percentage: 'hash', checkbox: 'checkSquare', tags: 'hash', dropdown: 'list', link: 'link', email: 'message', phone: 'message', progress: 'activity', files: 'paperclip', formula: 'code', dependency: 'link', rating: 'star', location: 'pin', long_text: 'doc' };
  return m[type] ?? 'edit';
}

// ------------------------------------------------------------------ updates

export function renderBody(body: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /@\[([^\]]{1,80})\]\(user:[A-Za-z0-9_-]+\)|(https?:\/\/[^\s<]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(body))) {
    if (m.index > last) out.push(body.slice(last, m.index));
    if (m[1]) out.push(<span key={k++} className="mention">@{m[1]}</span>);
    else out.push(<a key={k++} href={m[2]} target="_blank" rel="noopener noreferrer nofollow">{m[2]}</a>);
    last = m.index + m[0].length;
  }
  if (last < body.length) out.push(body.slice(last));
  return out;
}

export function MentionComposer({ members, onSubmit, placeholder, autoFocus, initial = '', submitLabel = 'Post update' }: { members: MemberDTO[]; onSubmit: (body: string) => Promise<boolean | void>; placeholder: string; autoFocus?: boolean; initial?: string; submitLabel?: string }) {
  const [text, setText] = useState(initial);
  const [mention, setMention] = useState<{ q: string; start: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const onChange = (v: string, caret: number) => {
    setText(v);
    const before = v.slice(0, caret);
    const m = /(^|\s)@([\w.-]{0,30})$/.exec(before);
    setMention(m ? { q: m[2], start: caret - m[2].length - 1 } : null);
  };
  const pick = (m: MemberDTO) => {
    if (!mention) return;
    const caret = ta.current?.selectionStart ?? text.length;
    const token = `@[${m.name.replace(/[[\]]/g, '')}](user:${m.id}) `;
    const next = text.slice(0, mention.start) + token + text.slice(caret);
    setText(next);
    setMention(null);
    requestAnimationFrame(() => ta.current?.focus());
  };
  const submit = async () => {
    if (!text.trim()) return;
    setBusy(true);
    const ok = await onSubmit(text.trim());
    setBusy(false);
    if (ok !== false) setText('');
  };
  const options = mention ? members.filter((m) => m.name.toLowerCase().includes(mention.q.toLowerCase())).slice(0, 6) : [];
  return (
    <div className="col" style={{ position: 'relative' }}>
      <textarea
        ref={ta}
        className="textarea"
        rows={3}
        value={text}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value, e.target.selectionStart)}
        onKeyDown={(e) => {
          if (mention && options.length && (e.key === 'Enter' || e.key === 'Tab')) {
            e.preventDefault();
            pick(options[0]);
          }
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
          if (e.key === 'Escape') setMention(null);
        }}
        maxLength={20000}
      />
      {mention && options.length ? (
        <div className="popover" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 900 }} role="listbox" aria-label="Mention someone">
          {options.map((m) => (
            <button key={m.id} className="menu-item" onMouseDown={(e) => { e.preventDefault(); pick(m); }}>
              <Avatar id={m.id} name={m.name} url={m.avatarUrl} size="sm" /> {m.name}
            </button>
          ))}
        </div>
      ) : null}
      <div className="row">
        <span className="muted small">Type @ to mention · Ctrl+Enter to send</span>
        <span className="spacer" />
        <button className="btn primary sm" disabled={busy || !text.trim()} onClick={submit}>{busy ? 'Posting…' : submitLabel}</button>
      </div>
    </div>
  );
}

function UpdatesTab({ itemId, members, onPosted, canComment = true }: { itemId: string; members: MemberDTO[]; onPosted: () => void; canComment?: boolean }) {
  const q = useQuery({ queryKey: ['updates', itemId], queryFn: () => get<UpdateDTO[]>(`/items/${itemId}/updates`) });
  const user = useUser();
  const toast = useToast();
  const confirm = useConfirm();
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const post_ = async (body: string, parentUpdateId?: string) => {
    try {
      await post(`/items/${itemId}/updates`, { body, parentUpdateId });
      setReplyTo(null);
      await q.refetch();
      onPosted();
      return true;
    } catch (e) {
      toast(errorMessage(e), 'error');
      return false;
    }
  };
  const remove = async (id: string) => {
    if (!(await confirm({ title: 'Delete this update?', danger: true, confirmLabel: 'Delete' }))) return;
    await del(`/updates/${id}`).catch((e) => toast(errorMessage(e), 'error'));
    q.refetch();
  };
  const save = async (id: string, body: string) => {
    try {
      await patch(`/updates/${id}`, { body });
      setEditing(null);
      q.refetch();
      return true;
    } catch (e) {
      toast(errorMessage(e), 'error');
      return false;
    }
  };
  const renderOne = (u: UpdateDTO, isReply = false) => (
    <div key={u.id} className={isReply ? '' : 'update'}>
      <div className="row" style={{ marginBottom: 6 }}>
        <Avatar id={u.authorId} name={u.authorName} url={members.find((m) => m.id === u.authorId)?.avatarUrl} size="sm" />
        <strong>{u.authorName}</strong>
        <span className="muted small">{timeAgo(u.createdAt)}{u.editedAt ? ' · edited' : ''}</span>
        <span className="spacer" />
        {u.authorId === user.id ? (
          <>
            <button className="btn ghost sm" onClick={() => setEditing(u.id)}>Edit</button>
            <button className="btn ghost sm" onClick={() => remove(u.id)}>Delete</button>
          </>
        ) : null}
      </div>
      {editing === u.id ? (
        <MentionComposer members={members} initial={u.body} placeholder="Edit update" autoFocus submitLabel="Save" onSubmit={(b) => save(u.id, b)} />
      ) : (
        <div className="update-body">{renderBody(u.body)}</div>
      )}
      {!isReply ? (
        <>
          {u.replies?.length ? <div className="replies">{u.replies.map((r) => renderOne(r, true))}</div> : null}
          {replyTo === u.id ? (
            <div style={{ marginTop: 10 }}>
              <MentionComposer members={members} placeholder="Write a reply…" autoFocus submitLabel="Reply" onSubmit={(b) => post_(b, u.id)} />
            </div>
          ) : canComment ? (
            <button className="btn ghost sm" style={{ marginTop: 6 }} onClick={() => setReplyTo(u.id)}><Icon name="message" size={13} /> Reply</button>
          ) : null}
        </>
      ) : null}
    </div>
  );
  return (
    <div className="stack">
      {canComment ? <MentionComposer members={members} placeholder="Write an update… use @ to mention" onSubmit={(b) => post_(b)} /> : <p className="muted small">Your access to this task does not include comments.</p>}
      {q.isLoading ? <Loading /> : q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
      {q.data && q.data.length === 0 ? <EmptyState icon="message" title="No updates yet">Share progress, ask questions and @mention teammates.</EmptyState> : null}
      {q.data?.map((u) => renderOne(u))}
    </div>
  );
}

function SubitemsTab({ item, subitems, columns, ctx, canEdit, actions, onOpen }: { item: ItemDTO; subitems: ItemDTO[]; columns: ColumnDTO[]; ctx: CellCtx; canEdit: boolean; actions: BoardActions; onOpen: (id: string) => void }) {
  const [name, setName] = useState('');
  const keyCols = columns.filter((c) => ['status', 'person', 'people', 'date'].includes(c.type)).slice(0, 3);
  return (
    <div className="stack">
      {subitems.length === 0 ? <EmptyState icon="subitem" title="No subitems">Break this item into smaller steps.</EmptyState> : (
        <table className="grid-table" style={{ width: '100%' }}>
          <tbody>
            {subitems.map((s) => (
              <tr key={s.id}>
                <td><div className="name-cell"><span className="name-text" role="button" tabIndex={0} onClick={() => onOpen(s.id)} onKeyDown={(e) => e.key === 'Enter' && onOpen(s.id)}>{s.name}</span></div></td>
                {keyCols.map((c) => (
                  <td key={c.id} style={{ width: 130 }}><Cell column={c} item={s} value={s.values[c.id]} ctx={ctx} canEdit={canEdit} onChange={(v) => actions.setValue(s.id, c.id, v)} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {canEdit ? (
        <form className="row" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { actions.createItem({ name: name.trim(), parentItemId: item.id }); setName(''); } }}>
          <input className="input" placeholder="New subitem name" value={name} onChange={(e) => setName(e.target.value)} aria-label="New subitem name" maxLength={500} />
          <button className="btn primary" disabled={!name.trim()}>Add</button>
        </form>
      ) : null}
    </div>
  );
}

function FilesTab({ item, attachments, canEdit, refresh }: { item: ItemDTO; attachments: AttachmentDTO[]; canEdit: boolean; refresh: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const toast = useToast();
  const confirm = useConfirm();
  const send = async (files: FileList | File[] | null) => {
    if (!files || !files.length) return;
    setBusy(true);
    for (const f of Array.from(files)) {
      const form = new FormData();
      form.set('file', f);
      form.set('scope', 'item');
      form.set('itemId', item.id);
      try {
        await upload(form);
      } catch (e) {
        toast(`${f.name}: ${errorMessage(e)}`, 'error');
      }
    }
    setBusy(false);
    refresh();
  };
  return (
    <div className="stack">
      {canEdit ? (
        <div
          className="card card-pad"
          style={{ borderStyle: 'dashed', textAlign: 'center', background: dragOver ? 'var(--accent-soft)' : undefined }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); send(e.dataTransfer.files); }}
        >
          <input ref={input} type="file" multiple hidden onChange={(e) => send(e.target.files)} />
          <button className="btn" disabled={busy} onClick={() => input.current?.click()}>{busy ? <Spinner /> : <Icon name="upload" />} Upload files</button>
          <div className="muted small" style={{ marginTop: 6 }}>or drop files here · max 25 MB · images, PDF, Office, text, CSV, ZIP</div>
        </div>
      ) : null}
      {attachments.length === 0 ? <EmptyState icon="paperclip" title="No files">Files attached to this item appear here.</EmptyState> : (
        <div className="list card">
          {attachments.map((a) => (
            <div key={a.id} className="list-row">
              {a.contentType.startsWith('image/') ? <img src={a.url} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} /> : <Icon name="file" size={22} />}
              <div className="grow">
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="ellipsis" style={{ display: 'block' }}>{a.fileName}</a>
                <span className="muted small">{formatBytes(a.size)} · {timeAgo(a.createdAt)}</span>
              </div>
              <a className="btn ghost icon sm" href={`${a.url}?download=1`} aria-label={`Download ${a.fileName}`}><Icon name="download" /></a>
              {canEdit ? (
                <button className="btn ghost icon sm" aria-label={`Delete ${a.fileName}`} onClick={async () => { if (await confirm({ title: `Delete ${a.fileName}?`, danger: true, confirmLabel: 'Delete' })) { await del(`/files/${a.id}`).catch((e) => toast(errorMessage(e), 'error')); refresh(); } }}><Icon name="trash" /></button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function describe(a: ActivityDTO, columns: ColumnDTO[], ctx: CellCtx): ReactNode {
  const action = a.action.replace(':automation', '');
  const col = columns.find((c) => c.id === a.columnId);
  const fmt = (v: unknown) => (col ? getColumnType(col.type).toText(v, col.settings, { userName: ctx.memberName, itemName: (id) => ctx.items.find((i) => i.id === id)?.name }) : String(v ?? '')) || 'empty';
  switch (action) {
    case 'item_created': return 'created this item';
    case 'subitem_created': return <>added subitem <strong>{(a.newValue as any)?.name}</strong></>;
    case 'value_changed': return <>changed <strong>{col?.title ?? 'a column'}</strong> from <em>{fmt(a.oldValue)}</em> to <em>{fmt(a.newValue)}</em></>;
    case 'renamed': return <>renamed from <em>{String(a.oldValue)}</em> to <em>{String(a.newValue)}</em></>;
    case 'description_changed': return 'edited the description';
    case 'moved': return <>moved to group <strong>{String(a.newValue)}</strong></>;
    case 'archived': return 'archived this item';
    case 'restored': return 'restored this item';
    case 'update_posted': return 'posted an update';
    case 'reply_posted': return 'replied to an update';
    case 'file_uploaded': return <>uploaded <strong>{String(a.newValue)}</strong></>;
    case 'file_deleted': return <>deleted file <strong>{String(a.oldValue)}</strong></>;
    default: return action.replace(/_/g, ' ');
  }
}

function ActivityTab({ itemId, columns, ctx }: { itemId: string; columns: ColumnDTO[]; ctx: CellCtx }) {
  const q = useQuery({ queryKey: ['item-activity', itemId], queryFn: () => get<ActivityDTO[]>(`/items/${itemId}/activity`) });
  if (q.isLoading) return <Loading />;
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data?.length) return <EmptyState icon="activity" title="No activity yet" />;
  return (
    <div>
      {q.data.map((a) => (
        <div key={a.id} className="activity-line">
          {a.actorId ? <Avatar id={a.actorId} name={a.actorName ?? '?'} size="sm" /> : <span className="avatar sm" style={{ background: 'var(--warning)' }}><Icon name="bolt" size={12} /></span>}
          <div className="grow">
            <strong>{a.actorName ?? 'Automation'}</strong> {describe(a, columns, ctx)}
            {a.action.endsWith(':automation') ? <span className="badge warning" style={{ marginLeft: 6 }}>automation</span> : null}
          </div>
          <span className="muted small" title={new Date(a.createdAt).toLocaleString()}>{timeAgo(a.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}

function TimeTab({ item, entries, canEdit, refresh }: { item: ItemDTO; entries: ItemDetail['timeEntries']; canEdit: boolean; refresh: () => void }) {
  const user = useUser();
  const toast = useToast();
  const [minutes, setMinutes] = useState('30');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const running = entries.find((e) => !e.ended_at && e.user_id === user.id);
  const [, tick] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  const total = entries.reduce((s, e) => s + (e.duration_seconds ?? Math.round((Date.now() - e.started_at) / 1000)), 0);
  const act = async (p: Promise<unknown>) => {
    try {
      await p;
      refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="card card-pad row wrap">
        <div className="grow">
          <div className="muted small">Total tracked</div>
          <div className="big-number" style={{ fontSize: 28 }}>{formatDuration(total)}</div>
        </div>
        {canEdit ? (
          running ? (
            <button className="btn danger" onClick={() => act(post(`/items/${item.id}/time/stop`))}><Icon name="stop" /> Stop · {formatDuration(Math.round((Date.now() - running.started_at) / 1000))}</button>
          ) : (
            <button className="btn primary" onClick={() => act(post(`/items/${item.id}/time/start`))}><Icon name="play" /> Start timer</button>
          )
        ) : null}
      </div>
      {canEdit ? (
        <form className="row wrap" onSubmit={(e) => { e.preventDefault(); act(post(`/items/${item.id}/time`, { minutes: Number(minutes), date, note })); setNote(''); }}>
          <input className="input" style={{ width: 90 }} type="number" min={1} max={1440} value={minutes} onChange={(e) => setMinutes(e.target.value)} aria-label="Minutes" />
          <span className="muted small">min on</span>
          <input className="input" style={{ width: 150 }} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
          <input className="input grow" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Note" maxLength={500} />
          <button className="btn">Log time</button>
        </form>
      ) : null}
      <div className="list card">
        {entries.length === 0 ? <div className="muted small" style={{ padding: 12 }}>No time logged yet.</div> : entries.map((e) => (
          <div key={e.id} className="list-row">
            <Avatar id={e.user_id} name={e.user_name} size="sm" />
            <div className="grow">
              <strong>{e.user_name}</strong> <span className="muted small">{new Date(e.started_at).toLocaleDateString()}</span>
              {e.note ? <div className="small">{e.note}</div> : null}
            </div>
            <span>{e.ended_at ? formatDuration(e.duration_seconds ?? 0) : <span className="badge success">running</span>}</span>
            {e.user_id === user.id ? <button className="btn ghost icon sm" aria-label="Delete time entry" onClick={() => act(del(`/time/${e.id}`))}><Icon name="trash" /></button> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsTab({ item, workspaceId, canEdit }: { item: ItemDTO; workspaceId: string; canEdit: boolean }) {
  const q = useQuery({ queryKey: ['documents', workspaceId, 'item', item.id], queryFn: () => get<any[]>(`/workspaces/${workspaceId}/documents?itemId=${item.id}`) });
  const create = useCreateDocument(workspaceId);
  return (
    <div className="stack">
      {canEdit ? <button className="btn" onClick={() => create({ title: `${item.name} — notes`, itemId: item.id })}><Icon name="plus" /> New linked document</button> : null}
      {q.isLoading ? <Loading /> : q.data?.length ? (
        <div className="list card">
          {q.data.map((d) => (
            <a key={d.id} className="list-row" href={appUrl(`/w/${workspaceId}/docs/${d.id}`)}>
              <Icon name="doc" /> <span className="grow ellipsis">{d.title}</span> <span className="muted small">{timeAgo(d.updatedAt)}</span>
            </a>
          ))}
        </div>
      ) : <EmptyState icon="doc" title="No linked documents">Create specs, notes or meeting minutes connected to this item.</EmptyState>}
    </div>
  );
}
