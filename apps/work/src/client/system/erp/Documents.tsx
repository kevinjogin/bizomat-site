// BIZOMAT ERP, Release 1: engineering documents. Each belongs to a product (and, optionally, one of its revisions) and
// keeps every version: an uploaded file, or a CAD reference (where the SOLIDWORKS file is on the engineer's own
// computer; the server never has that file). Engineering approvers approve them. CAD Automation, where an AI assistant
// builds parts and drawings in SOLIDWORKS on the engineer's computer, is a link away; nothing here makes drawings.
import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorMessage, get, patch, post } from '../../lib/api';
import { appUrl } from '../../lib/base';
import { formatBytes } from '../../lib/format';
import { usePageTitle } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { EmptyState, ErrorBox, Loading } from '../../components/ui/ui';
import { Modal, useConfirm, useToast } from '../../components/ui/overlays';
import { DOC_KINDS, DOC_STATUS, dayText, erpPath, productsPage, type EngDocument, type ErpEvent, type ErpMe, type Revision } from './api';
import { CsvLink, DocBadge, History, Pager, Props, Section, options } from './common';
import { ProductPicker, type PickedProduct } from './Products';

const CAD_APP = 'https://bizomat.ai/cad/';

export function DocumentsPage({ companyId, me }: { companyId: string; me: ErpMe }) {
  usePageTitle('Engineering documents');
  const [params, setParams] = useSearchParams();
  const g = (k: string) => params.get(k) ?? '';
  const set = (k: string, v: string) =>
    setParams((p) => {
      const n = new URLSearchParams(p);
      if (v) n.set(k, v);
      else n.delete(k);
      if (k !== 'offset') n.delete('offset');
      return n;
    }, { replace: true });
  const offset = Number(g('offset')) || 0;
  const limit = 50;
  const filters = new URLSearchParams();
  for (const k of ['q', 'kind', 'status']) if (g(k)) filters.set(k, g(k));
  const list = useQuery({ queryKey: ['erp', companyId, 'documents', filters.toString(), offset], queryFn: () => get<{ documents: EngDocument[]; total: number }>(erpPath(companyId, `/documents?${filters}&limit=${limit}&offset=${offset}`)) });
  const [adding, setAdding] = useState(false);
  return (
    <div className="stack">
      <div className="row wrap">
        <p className="muted small grow">Drawings, models, PDFs, DXF and STEP files and specifications, with every version. A CAD reference records where a SOLIDWORKS file is on an engineer’s own computer; the file itself stays there.</p>
        <CsvLink companyId={companyId} path={`/documents?${filters}`} />
        {me.can['documents.edit'] ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="plus" /> New document</button> : null}
      </div>
      <div className="row wrap mt-toolbar">
        <div className="crm-search"><Icon name="search" /><input className="input" type="search" aria-label="Search documents" placeholder="Number, title, product" value={g('q')} onChange={(e) => set('q', e.target.value)} /></div>
        <select className="select" aria-label="Kind" value={g('kind')} onChange={(e) => set('kind', e.target.value)}><option value="">Any kind</option>{options(DOC_KINDS)}</select>
        <select className="select" aria-label="Status" value={g('status')} onChange={(e) => set('status', e.target.value)}><option value="">Any status</option>{options(DOC_STATUS)}</select>
      </div>
      {list.error ? <ErrorBox error={list.error} retry={() => list.refetch()} /> : null}
      <div className="card crm-table-card">
        {!list.data ? <Loading /> : !list.data.documents.length ? (
          <EmptyState icon="file" title={filters.toString() ? 'No documents match' : 'No documents yet'}>{filters.toString() ? 'Try other words or remove a filter.' : 'Add a drawing, model or specification to a product.'}</EmptyState>
        ) : (
          <div className="crm-table-scroll">
            <table className="data-table responsive">
              <thead><tr><th>Number</th><th>Title</th><th>Kind</th><th>Product</th><th>Version</th><th>Status</th></tr></thead>
              <tbody>
                {list.data.documents.map((d) => (
                  <tr key={d.id}>
                    <td data-label="Number"><Link className="mt-primary mt-num" to={productsPage(companyId, `/documents/${d.id}`)}>{d.number}</Link></td>
                    <td data-label="Title">{d.title}</td>
                    <td data-label="Kind">{d.kindLabel}</td>
                    <td data-label="Product"><Link to={productsPage(companyId, `/${d.productId}`)}>{d.productNumber}</Link>{d.revisionLabel ? <span className="muted small"> rev {d.revisionLabel}</span> : null}</td>
                    <td data-label="Version">{d.latestVersion}{d.latestDocRevision ? ` (${d.latestDocRevision})` : ''}{d.latestSource === 'cad_reference' ? <span className="muted small"> CAD reference</span> : null}</td>
                    <td data-label="Status"><DocBadge value={d.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {list.data ? <Pager offset={offset} limit={limit} total={list.data.total} setOffset={(n) => set('offset', n ? String(n) : '')} /> : null}
      {adding ? <NewDocumentDialog companyId={companyId} me={me} onClose={() => setAdding(false)} /> : null}
    </div>
  );
}

interface Version {
  id: string;
  version: number;
  docRevision: string;
  source: 'file' | 'cad_reference';
  fileName: string | null;
  mime: string | null;
  size: number | null;
  url: string | null;
  cadPath: string | null;
  cadConfig: string | null;
  cadFileName: string | null;
  note: string;
  createdByName: string | null;
  createdAt: number;
}

/** The fields of a new version: a file, or a CAD reference. */
function VersionFields({ source, setSource, setFile, cad, setCad, docRevision, setDocRevision, note, setNote }: {
  source: 'file' | 'cad';
  setSource: (s: 'file' | 'cad') => void;
  file: File | null;
  setFile: (f: File | null) => void;
  cad: { cadPath: string; cadConfig: string; cadFileName: string };
  setCad: (c: { cadPath: string; cadConfig: string; cadFileName: string }) => void;
  docRevision: string;
  setDocRevision: (s: string) => void;
  note: string;
  setNote: (s: string) => void;
}) {
  return (
    <div className="stack">
      <div className="row wrap" role="radiogroup" aria-label="What to add">
        <label className="checkbox"><input type="radio" name="erp-src" checked={source === 'file'} onChange={() => setSource('file')} /> Upload a file</label>
        <label className="checkbox"><input type="radio" name="erp-src" checked={source === 'cad'} onChange={() => setSource('cad')} /> Reference a CAD file on my computer</label>
      </div>
      {source === 'file' ? (
        <div className="field">
          <label htmlFor="erpd-file">File</label>
          <input id="erpd-file" className="input" type="file" accept="image/*,.pdf,.dxf,.step,.stp,.txt,.csv,.docx,.xlsx,.pptx,.odt,.ods,.zip,.md" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <span className="muted small">PDF, images and office files as usual. DXF and STEP files are accepted when their content checks out, and are only ever downloaded.</span>
        </div>
      ) : (
        <div className="crm-form-grid">
          <div className="field crm-span"><label htmlFor="erpd-path">Path on your computer (required)</label><input id="erpd-path" className="input" maxLength={1000} placeholder="C:\Users\you\Documents\Parts\Bracket.SLDPRT" value={cad.cadPath} onChange={(e) => setCad({ ...cad, cadPath: e.target.value })} /></div>
          <div className="field"><label htmlFor="erpd-cfg">Configuration</label><input id="erpd-cfg" className="input" maxLength={200} placeholder="Default" value={cad.cadConfig} onChange={(e) => setCad({ ...cad, cadConfig: e.target.value })} /></div>
          <div className="field"><label htmlFor="erpd-fn">File name</label><input id="erpd-fn" className="input" maxLength={260} placeholder="Taken from the path" value={cad.cadFileName} onChange={(e) => setCad({ ...cad, cadFileName: e.target.value })} /></div>
          <p className="muted small crm-span">The server keeps this reference only. The file stays on your computer; open it there, or with CAD Automation.</p>
        </div>
      )}
      <div className="crm-form-grid">
        <div className="field"><label htmlFor="erpd-rev">Document revision</label><input id="erpd-rev" className="input" maxLength={20} placeholder="For example A or 02" value={docRevision} onChange={(e) => setDocRevision(e.target.value)} /></div>
        <div className="field"><label htmlFor="erpd-note">Note</label><input id="erpd-note" className="input" maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} /></div>
      </div>
    </div>
  );
}

function useVersionState() {
  const [source, setSource] = useState<'file' | 'cad'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [cad, setCad] = useState({ cadPath: '', cadConfig: '', cadFileName: '' });
  const [docRevision, setDocRevision] = useState('');
  const [note, setNote] = useState('');
  const ready = source === 'file' ? !!file : !!cad.cadPath.trim();
  /** Sends the version with the extra fields (multipart for a file, JSON for a CAD reference). */
  const send = (path: string, extra: Record<string, string>) => {
    if (source === 'file' && file) {
      const fd = new FormData();
      fd.set('file', file);
      for (const [k, v] of Object.entries({ ...extra, docRevision, note })) if (v) fd.set(k, v);
      return api(path, { method: 'POST', form: fd });
    }
    return post(path, { ...extra, ...cad, docRevision, note });
  };
  return { props: { source, setSource, file, setFile, cad, setCad, docRevision, setDocRevision, note, setNote }, ready, send };
}

export function NewDocumentDialog({ companyId, product: fixed, revisions: fixedRevisions, onClose }: { companyId: string; me: ErpMe; product?: PickedProduct; revisions?: Revision[]; onClose: () => void }) {
  const qc = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<PickedProduct | null>(fixed ?? null);
  const revs = useQuery({ queryKey: ['erp', companyId, 'product', product?.id], queryFn: () => get<{ revisions: Revision[] }>(erpPath(companyId, `/products/${product!.id}`)), enabled: !!product && !fixedRevisions });
  const revisions = fixedRevisions ?? revs.data?.revisions ?? [];
  const [revisionId, setRevisionId] = useState('');
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<keyof typeof DOC_KINDS>('drawing');
  const v = useVersionState();
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!product) return;
    setBusy(true);
    try {
      const d = await v.send(erpPath(companyId, '/documents'), { productId: product.id, ...(revisionId ? { revisionId } : {}), title, kind });
      toast(`Document ${d.number} added`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
      onClose();
      navigate(productsPage(companyId, `/documents/${d.id}`));
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title="New engineering document" onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !product || !title.trim() || !v.ready} onClick={() => void save()}>{busy ? 'Saving…' : 'Add the document'}</button></>}>
      <div className="stack">
        {fixed ? <p className="small">For <strong>{fixed.number}</strong> {fixed.name}</p> : <ProductPicker companyId={companyId} id="erpd-prod" label="Product" value={product} onChange={setProduct} />}
        <div className="crm-form-grid">
          <div className="field crm-span"><label htmlFor="erpd-title">Title (required)</label><input id="erpd-title" className="input" maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="field"><label htmlFor="erpd-kind">Kind</label><select id="erpd-kind" className="select" value={kind} onChange={(e) => setKind(e.target.value as keyof typeof DOC_KINDS)}>{options(DOC_KINDS)}</select></div>
          <div className="field"><label htmlFor="erpd-prev">Product revision</label><select id="erpd-prev" className="select" value={revisionId} onChange={(e) => setRevisionId(e.target.value)} disabled={!product}><option value="">Any revision</option>{revisions.map((r) => <option key={r.id} value={r.id}>Revision {r.label} ({r.status})</option>)}</select></div>
        </div>
        <VersionFields {...v.props} />
      </div>
    </Modal>
  );
}

interface DocView {
  document: EngDocument;
  versions: Version[];
  history: ErpEvent[];
  can: { edit: boolean; approve: boolean; obsolete: boolean };
}

export function DocumentDetail({ companyId }: { companyId: string; me: ErpMe }) {
  const { documentId = '' } = useParams();
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const q = useQuery({ queryKey: ['erp', companyId, 'document', documentId], queryFn: () => get<DocView>(erpPath(companyId, `/documents/${documentId}`)), retry: false });
  const [adding, setAdding] = useState(false);
  const [renaming, setRenaming] = useState(false);
  usePageTitle(q.data ? `${q.data.document.number} ${q.data.document.title}` : 'Document');
  if (q.error) return <ErrorBox error={q.error} retry={() => q.refetch()} />;
  if (!q.data) return <Loading />;
  const { document: d, versions, can } = q.data;
  const refresh = () => qc.invalidateQueries({ queryKey: ['erp', companyId] });
  const act = async (path: 'approve' | 'obsolete') => {
    if (path === 'obsolete' && !(await confirm({ title: `Mark ${d.number} obsolete?`, message: 'It stays on record with every version, but takes no new versions.', confirmLabel: 'Mark obsolete', danger: true }))) return;
    try {
      await post(erpPath(companyId, `/documents/${d.id}/${path}`), {});
      toast(path === 'approve' ? `${d.number} approved` : `${d.number} marked obsolete`);
      await refresh();
    } catch (err) {
      toast(errorMessage(err), 'error');
    }
  };
  return (
    <div className="stack">
      <div className="mt-path"><Link to={productsPage(companyId, '/documents')}>Documents</Link><span className="sep">/</span><span>{d.number}</span></div>
      <div className="mt-head">
        <div>
          <h2 className="mt-title"><span className="mt-num">{d.number}</span> {d.title}</h2>
          <div className="mt-badges"><span className="badge">{d.kindLabel}</span><DocBadge value={d.status} /></div>
        </div>
        <div className="mt-head-actions">
          {can.edit ? <button className="btn" onClick={() => setRenaming(true)}><Icon name="edit" /> Edit</button> : null}
          {can.edit ? <button className="btn primary" onClick={() => setAdding(true)}><Icon name="upload" /> New version</button> : null}
          {can.approve ? <button className="btn primary" onClick={() => void act('approve')}><Icon name="check" /> Approve version {d.latestVersion}</button> : null}
          {can.obsolete ? <button className="btn ghost" onClick={() => void act('obsolete')}>Mark obsolete</button> : null}
        </div>
      </div>
      <div className="mt-grid">
        <div className="stack">
          <Section title="Details">
            <Props
              items={[
                ['Product', <Link key="p" to={productsPage(companyId, `/${d.productId}`)}>{d.productNumber} {d.productName}</Link>],
                ['Product revision', d.revisionLabel ?? 'Any'],
                ['Approved', d.approvedAt ? `${dayText(d.approvedAt)}${d.approvedByName ? ` by ${d.approvedByName}` : ''}` : ''],
                ['Created', `${dayText(d.createdAt)}${d.createdByName ? ` by ${d.createdByName}` : ''}`],
              ]}
            />
          </Section>
          <Section title="CAD Automation">
            <p className="small">CAD Automation connects your AI assistant to SOLIDWORKS on your own computer, where it builds native parts, assemblies and drawings. Open the referenced file there; this record keeps where it is.</p>
            <div className="row"><a className="btn" href={CAD_APP}><Icon name="diamond" /> Open CAD Automation</a></div>
          </Section>
        </div>
        <div className="stack">
          <Section title="Versions">
            <ol className="erp-versions" reversed>
              {versions.map((x) => (
                <li key={x.id}>
                  <div className="row wrap">
                    <strong>Version {x.version}</strong>
                    {x.docRevision ? <span className="badge">Revision {x.docRevision}</span> : null}
                    {x.version === d.latestVersion ? <DocBadge value={d.status} /> : null}
                    <span className="muted small grow">{dayText(x.createdAt)}{x.createdByName ? ` by ${x.createdByName}` : ''}</span>
                  </div>
                  {x.source === 'file' ? (
                    <div className="small"><Icon name="file" size={14} /> <a href={`${appUrl(x.url!)}?download=1`}>{x.fileName}</a> <span className="muted">{x.size ? formatBytes(x.size) : ''}</span>{x.mime === 'application/pdf' || x.mime?.startsWith('image/') ? <> · <a href={appUrl(x.url!)} target="_blank" rel="noopener">View</a></> : null}</div>
                  ) : (
                    <div className="small">
                      <Icon name="link" size={14} /> CAD reference: <code className="erp-path">{x.cadPath}</code>
                      <div className="muted">{[x.cadFileName ? `File ${x.cadFileName}` : '', x.cadConfig ? `configuration ${x.cadConfig}` : ''].filter(Boolean).join(', ')}. On the engineer’s computer, not on the server.</div>
                    </div>
                  )}
                  {x.note ? <div className="small mt-pre">{x.note}</div> : null}
                </li>
              ))}
            </ol>
          </Section>
          <Section title="History"><History events={q.data.history as any} /></Section>
        </div>
      </div>
      {adding ? <NewVersionDialog companyId={companyId} doc={d} onClose={() => { setAdding(false); void refresh(); }} /> : null}
      {renaming ? <EditDocumentDialog companyId={companyId} doc={d} onClose={() => { setRenaming(false); void refresh(); }} /> : null}
    </div>
  );
}

function NewVersionDialog({ companyId, doc, onClose }: { companyId: string; doc: EngDocument; onClose: () => void }) {
  const toast = useToast();
  const v = useVersionState();
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await v.send(erpPath(companyId, `/documents/${doc.id}/versions`), {});
      toast(doc.status === 'approved' ? 'New version added: the document is a draft until it is approved again' : 'New version added');
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal wide title={`New version of ${doc.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !v.ready} onClick={() => void save()}>{busy ? 'Saving…' : 'Add the version'}</button></>}>
      <VersionFields {...v.props} />
    </Modal>
  );
}

function EditDocumentDialog({ companyId, doc, onClose }: { companyId: string; doc: EngDocument; onClose: () => void }) {
  const toast = useToast();
  const [title, setTitle] = useState(doc.title);
  const [kind, setKind] = useState(doc.kind);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    try {
      await patch(erpPath(companyId, `/documents/${doc.id}`), { title, kind });
      toast('Saved');
      onClose();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal title={`Edit ${doc.number}`} onClose={onClose} footer={<><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy || !title.trim()} onClick={() => void save()}>Save</button></>}>
      <div className="stack">
        <div className="field"><label htmlFor="erpde-t">Title</label><input id="erpde-t" className="input" maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="field"><label htmlFor="erpde-k">Kind</label><select id="erpde-k" className="select" value={kind} onChange={(e) => setKind(e.target.value as keyof typeof DOC_KINDS)}>{options(DOC_KINDS)}</select></div>
      </div>
    </Modal>
  );
}
