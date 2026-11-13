// Documents: receipts, statements, contracts and reports kept in the workspace's file store, in folders and by account,
// searchable, with every version kept; and the files attached to transactions, invoices, bills, journals and contacts.
// A file is served only to people who may see what it belongs to (src/worker/fin/routes-files.ts).
import { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, del, errorMessage, get, patch } from '../lib/api';
import { useDebounced } from '../lib/hooks';
import { useSession } from '../lib/session';
import { formatBytes } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { Modal, useConfirm, useToast } from '../components/ui/overlays';
import { DOC_LABELS, type DocKind } from '../../shared/fin/settings';
import { accountLabel, appUrl, dateTime, download, fin, useAccounts, useCurrentOrg } from './lib';
import { AccountSelect, Hint } from './ui';

interface FileDTO {
  id: string;
  name: string;
  mime: string;
  size: number;
  parentType: 'none' | 'transaction' | 'doc' | 'journal' | 'contact';
  parentId: string | null;
  folder: string;
  accountId: string | null;
  version: number;
  replacesId: string | null;
  uploadedBy: string | null;
  uploadedByName: string | null;
  createdAt: number;
  url: string;
  deleted?: boolean;
}

const PARENT_LABELS: Record<FileDTO['parentType'], string> = { none: '', transaction: 'Transaction', doc: 'Invoice or bill', journal: 'Journal', contact: 'Contact' };

export function Documents() {
  const org = useCurrentOrg();
  const [params, setParams] = useSearchParams();
  const folder = params.get('folder') ?? '';
  const [account, setAccount] = useState<string | null>(null);
  const [text, setText] = useState('');
  const search = useDebounced(text, 250).trim();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<FileDTO | null>(null);
  const [versions, setVersions] = useState<FileDTO | null>(null);
  const toast = useToast();
  const confirm = useConfirm();
  const qc = useQueryClient();
  const accounts = useAccounts().data ?? [];
  const versionInput = useRef<HTMLInputElement>(null);
  const myId = useSession().session?.user.id ?? null;
  const [versionOf, setVersionOf] = useState<FileDTO | null>(null);
  const p = org.perms.documents;
  const qs = new URLSearchParams();
  if (folder) qs.set('folder', folder);
  if (account) qs.set('account', account);
  if (search) qs.set('q', search);
  const q = useQuery({
    queryKey: ['fin', org.id, 'files', qs.toString()],
    queryFn: () => get<{ files: FileDTO[]; folders: { folder: string; n: number }[] }>(`${fin(org.id, '/files')}?${qs.toString()}`),
    enabled: p.view !== 'none',
  });
  const reload = () => qc.invalidateQueries({ queryKey: ['fin', org.id, 'files'] });
  if (p.view === 'none') {
    return (
      <div className="page crm-page">
        <PageHeader title="Documents" icon="folder" />
        <EmptyState icon="lock" title="Your role does not include documents" />
      </div>
    );
  }
  const mine = (f: FileDTO, scope: 'all' | 'own' | 'none') => scope === 'all' || (scope === 'own' && !!myId && f.uploadedBy === myId);
  // A file in the library follows the documents permissions; an attached file follows its record's (the server checks).
  const parentEditable = (f: FileDTO) => {
    const perms = org.perms;
    if (f.parentType === 'transaction') return perms.banking.edit !== 'none';
    if (f.parentType === 'doc') return perms.sales.edit !== 'none' || perms.purchases.edit !== 'none';
    if (f.parentType === 'contact') return perms.contacts.view !== 'none' && p.edit !== 'none';
    return perms.accounting.view && p.edit !== 'none';
  };
  const canEdit = (f: FileDTO) => (f.parentType === 'none' ? mine(f, p.edit) : parentEditable(f));
  const canDelete = (f: FileDTO) => (f.parentType === 'none' ? mine(f, p.delete) : parentEditable(f));
  const remove = async (f: FileDTO) => {
    if (!(await confirm({ title: `Delete ${f.name}?`, message: 'It disappears from the library and from the record it is attached to. The deletion is recorded in the audit trail.', confirmLabel: 'Delete', danger: true }))) return;
    try {
      await del(fin(org.id, `/files/${f.id}`));
      toast(`${f.name} deleted`);
      await reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const newVersion = async (f: FileDTO, file: File) => {
    const form = new FormData();
    form.set('file', file);
    form.set('replacesId', f.id);
    form.set('parentType', f.parentType);
    if (f.parentId) form.set('parentId', f.parentId);
    if (f.folder) form.set('folder', f.folder);
    if (f.accountId) form.set('accountId', f.accountId);
    try {
      const r = await api<{ version: number }>(fin(org.id, '/files'), { method: 'POST', form });
      toast(`Version ${r.version} of ${f.name} saved`);
      await reload();
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  const files = q.data?.files ?? [];
  const folders = q.data?.folders ?? [];
  const setFolder = (name: string) => {
    const next = new URLSearchParams(params);
    if (name) next.set('folder', name);
    else next.delete('folder');
    setParams(next, { replace: true });
  };
  return (
    <div className="page crm-page">
      <PageHeader
        title="Documents"
        icon="folder"
        subtitle={`${org.name}: receipts, statements, contracts and reports, kept with every version`}
        actions={
          p.create ? (
            <button className="btn primary" onClick={() => setUploading(true)}>
              <Icon name="upload" /> Upload
            </button>
          ) : null
        }
      />
      <Hint>Files are private to this workspace. A file attached to a transaction, invoice or bill is shown only to people who can see that record. Scheduled reports are saved in the Reports folder.</Hint>
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Folders">
          <button className={`nav-item${!folder ? ' active' : ''}`} onClick={() => setFolder('')}>
            <Icon name="folder" /> All documents
          </button>
          {folders.map((f) => (
            <button key={f.folder} className={`nav-item${folder === f.folder ? ' active' : ''}`} onClick={() => setFolder(f.folder)}>
              <Icon name="folder" /> <span className="grow ellipsis">{f.folder}</span> <span className="muted small">{f.n}</span>
            </button>
          ))}
          {folder && !folders.some((f) => f.folder === folder) ? (
            <button className="nav-item active" onClick={() => setFolder(folder)}>
              <Icon name="folder" /> {folder}
            </button>
          ) : null}
        </nav>
        <div className="stack crm-settings-body">
          <div className="row fin-toolbar">
            <input className="input" type="search" placeholder="Search by name or folder" aria-label="Search documents" value={text} onChange={(e) => setText(e.target.value)} />
            <AccountSelect ariaLabel="Account" value={account} onChange={setAccount} allowEmpty emptyLabel="Every account" />
          </div>
          {q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : null}
          {!q.data ? (
            <Loading />
          ) : !files.length ? (
            <EmptyState icon="folder" title={folder || account || search ? 'No documents match' : 'No documents yet'}>
              {p.create && !folder && !account && !search ? 'Upload receipts, statements and contracts, or attach them to transactions, invoices and bills.' : null}
            </EmptyState>
          ) : (
            <div className="card">
              <div className="crm-table-scroll">
                <table className="data-table crm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Folder</th>
                      <th>Account</th>
                      <th>Attached to</th>
                      <th>Uploaded</th>
                      <th className="fin-num">Size</th>
                      <th aria-label="Actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((f) => (
                      <tr key={f.id}>
                        <td>
                          <button className="btn ghost sm" onClick={() => download(appUrl(f.url))} title="Download">
                            <Icon name="file" size={14} /> {f.name}
                          </button>
                          {f.version > 1 ? <span className="badge">Version {f.version}</span> : null}
                        </td>
                        <td className="small">{f.folder ? <button className="btn ghost sm" onClick={() => setFolder(f.folder)}>{f.folder}</button> : null}</td>
                        <td className="small">{f.accountId ? accountLabel(accounts.find((a) => a.id === f.accountId)) : ''}</td>
                        <td className="small"><ParentLink file={f} /></td>
                        <td className="small">
                          {dateTime(f.createdAt)}
                          {f.uploadedByName ? <div className="muted">{f.uploadedByName}</div> : null}
                        </td>
                        <td className="fin-num small">{formatBytes(f.size)}</td>
                        <td>
                          <div className="row">
                            {f.version > 1 || f.replacesId ? <button className="btn ghost sm" onClick={() => setVersions(f)}>Versions</button> : null}
                            {canEdit(f) ? (
                              <>
                                <button className="btn ghost sm" onClick={() => setEditing(f)}>Edit</button>
                                <button className="btn ghost sm" onClick={() => { setVersionOf(f); versionInput.current?.click(); }}>New version</button>
                              </>
                            ) : null}
                            {canDelete(f) ? (
                              <button className="btn ghost sm" aria-label={`Delete ${f.name}`} onClick={() => remove(f)}>
                                <Icon name="trash" size={14} />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {files.length >= 500 ? <p className="muted small crm-pad">Showing the latest 500. Search or choose a folder to find older documents.</p> : null}
            </div>
          )}
        </div>
      </div>
      <input
        ref={versionInput}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file && versionOf) newVersion(versionOf, file);
          setVersionOf(null);
        }}
      />
      {uploading ? <UploadDialog folders={folders.map((f) => f.folder)} folder={folder} account={account} onClose={() => setUploading(false)} onDone={reload} /> : null}
      {editing ? <EditDialog file={editing} folders={folders.map((f) => f.folder)} onClose={() => setEditing(null)} onDone={reload} /> : null}
      {versions ? <VersionsDialog file={versions} onClose={() => setVersions(null)} /> : null}
    </div>
  );
}

/** Where a file is attached, as a link to that record. Invoices and bills are looked up to find their kind. */
function ParentLink({ file }: { file: FileDTO }) {
  const org = useCurrentOrg();
  const navigate = useNavigate();
  const toast = useToast();
  if (file.parentType === 'none' || !file.parentId) return <span className="muted">Library</span>;
  const base = `/o/${org.id}`;
  if (file.parentType === 'transaction') return <Link to={`${base}/transactions/${file.parentId}`}>Transaction</Link>;
  if (file.parentType === 'contact') return <Link to={`${base}/contacts/${file.parentId}`}>Contact</Link>;
  if (file.parentType === 'journal') return <Link to={`${base}/accounting/journals`}>Journal</Link>;
  return (
    <button
      className="btn ghost sm"
      onClick={async () => {
        try {
          const d = await get<{ kind: DocKind }>(fin(org.id, `/docs/${file.parentId}`));
          navigate(`${base}/${DOC_LABELS[d.kind].path}/${file.parentId}`);
        } catch (e) {
          toast(errorMessage(e), 'error');
        }
      }}
    >
      {PARENT_LABELS.doc}
    </button>
  );
}

function UploadDialog({ folders, folder, account, onClose, onDone }: { folders: string[]; folder: string; account: string | null; onClose: () => void; onDone: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState<File[]>([]);
  const [f, setF] = useState({ folder, accountId: account });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const upload = async () => {
    setBusy(true);
    setDone(0);
    let ok = 0;
    for (const file of chosen) {
      const form = new FormData();
      form.set('file', file);
      form.set('parentType', 'none');
      if (f.folder.trim()) form.set('folder', f.folder.trim());
      if (f.accountId) form.set('accountId', f.accountId);
      try {
        await api(fin(org.id, '/files'), { method: 'POST', form });
        ok++;
        setDone(ok);
      } catch (e) {
        toast(`${file.name}: ${errorMessage(e)}`, 'error');
      }
    }
    setBusy(false);
    if (ok) {
      toast(ok === 1 ? 'Uploaded' : `${ok} files uploaded`);
      onDone();
    }
    if (ok === chosen.length) onClose();
    else setChosen((list) => list.slice(ok));
  };
  return (
    <Modal
      title="Upload documents"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy || !chosen.length} onClick={upload}>{busy ? `Uploading ${done + 1} of ${chosen.length}…` : chosen.length > 1 ? `Upload ${chosen.length} files` : 'Upload'}</button>
        </>
      }
    >
      <div className="stack">
        <div className="fin-dropzone">
          <input ref={input} type="file" multiple hidden onChange={(e) => setChosen(Array.from(e.target.files ?? []))} />
          <button className="btn" onClick={() => input.current?.click()}>
            <Icon name="paperclip" /> Choose files
          </button>
          {chosen.length ? (
            <ul className="crm-mini-list small">
              {chosen.map((c) => (
                <li key={`${c.name}-${c.size}`}>
                  {c.name} <span className="muted">{formatBytes(c.size)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">PDF, images, spreadsheets and documents, up to the app's file size limit.</p>
          )}
        </div>
        <div className="crm-form-grid">
          <div className="field">
            <label htmlFor="up-folder">Folder</label>
            <input id="up-folder" className="input" list="fin-folders" maxLength={80} value={f.folder} onChange={(e) => setF({ ...f, folder: e.target.value })} placeholder="For example: Receipts 2026" />
            <datalist id="fin-folders">
              {folders.map((x) => (
                <option key={x} value={x} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label htmlFor="up-account">Account (optional)</label>
            <AccountSelect id="up-account" value={f.accountId} onChange={(v) => setF({ ...f, accountId: v })} allowEmpty emptyLabel="No account" />
          </div>
        </div>
      </div>
    </Modal>
  );
}

function EditDialog({ file, folders, onClose, onDone }: { file: FileDTO; folders: string[]; onClose: () => void; onDone: () => void }) {
  const org = useCurrentOrg();
  const toast = useToast();
  const [f, setF] = useState({ name: file.name, folder: file.folder, accountId: file.accountId });
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await patch(fin(org.id, `/files/${file.id}`), { name: f.name.trim(), folder: f.folder.trim(), accountId: f.accountId });
      toast('Saved');
      onDone();
      onClose();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`Edit ${file.name}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !f.name.trim()} onClick={save}>{busy ? 'Saving…' : 'Save'}</button></>}>
      <div className="crm-form-grid">
        <div className="field crm-span">
          <label htmlFor="ed-name">Name</label>
          <input id="ed-name" className="input" maxLength={200} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="ed-folder">Folder</label>
          <input id="ed-folder" className="input" list="fin-edit-folders" maxLength={80} value={f.folder} onChange={(e) => setF({ ...f, folder: e.target.value })} />
          <datalist id="fin-edit-folders">
            {folders.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </div>
        <div className="field">
          <label htmlFor="ed-account">Account</label>
          <AccountSelect id="ed-account" value={f.accountId} onChange={(v) => setF({ ...f, accountId: v })} allowEmpty emptyLabel="No account" />
        </div>
      </div>
    </Modal>
  );
}

function VersionsDialog({ file, onClose }: { file: FileDTO; onClose: () => void }) {
  const org = useCurrentOrg();
  const q = useQuery({ queryKey: ['fin', org.id, 'files', 'versions', file.id], queryFn: () => get<FileDTO[]>(fin(org.id, `/files/${file.id}/versions`)) });
  return (
    <Modal title={`Versions of ${file.name}`} onClose={onClose} footer={<button className="btn" onClick={onClose}>Close</button>}>
      {q.error ? (
        <ErrorBox error={q.error} retry={() => q.refetch()} />
      ) : !q.data ? (
        <Loading />
      ) : (
        <div className="crm-table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Name</th>
                <th>Uploaded</th>
                <th aria-label="Download" />
              </tr>
            </thead>
            <tbody>
              {q.data.map((v) => (
                <tr key={v.id}>
                  <td>
                    {v.version} {v.deleted ? <span className="badge">Deleted</span> : null}
                  </td>
                  <td className="small">{v.name}</td>
                  <td className="small">
                    {dateTime(v.createdAt)}
                    {v.uploadedByName ? ` by ${v.uploadedByName}` : ''}
                  </td>
                  <td>{!v.deleted ? <button className="btn ghost sm" onClick={() => download(appUrl(v.url))}><Icon name="download" size={14} /> Download</button> : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}
