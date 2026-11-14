// Small pieces shared by the ERP's Release 1 screens: status badges, CSV links, a pager, file upload and the history.
// Lists, property lists, sections and filters reuse the maintenance screens' pieces.
import { useRef, useState, type ReactNode } from 'react';
import { api, errorMessage } from '../../lib/api';
import { Icon } from '../../components/ui/Icon';
import { useToast } from '../../components/ui/overlays';
import { FileList as MtFileList } from '../maintenance/common';
import type { MtFile } from '../maintenance/api';
import { DOC_STATUS, ECO_STATUS, ECR_STATUS, LIFECYCLE, REVISION_STATUS, SUPPLIER_STATUS, csvHref, erpPath, type ErpFile } from './api';

export { History, Props, Section, FilterPanel, options } from '../maintenance/common';

const tone = (map: Record<string, string>, v: string) => map[v] ?? '';
const LIFECYCLE_TONE: Record<string, string> = { draft: '', active: 'success', phased_out: 'warning', obsolete: 'danger' };
const REV_TONE: Record<string, string> = { draft: '', in_change: 'warning', released: 'success', superseded: '' };
const ECR_TONE: Record<string, string> = { submitted: 'accent', under_review: 'warning', approved: 'success', rejected: 'danger' };
const ECO_TONE: Record<string, string> = { draft: '', submitted: 'accent', approved: 'warning', released: 'success', cancelled: 'danger' };
const DOC_TONE: Record<string, string> = { draft: '', approved: 'success', obsolete: 'danger' };
const SUP_TONE: Record<string, string> = { pending: 'warning', approved: 'success', on_hold: 'warning', blocked: 'danger' };

export const LifecycleBadge = ({ value }: { value: string }) => <span className={`badge ${tone(LIFECYCLE_TONE, value)}`}>{LIFECYCLE[value as keyof typeof LIFECYCLE] ?? value}</span>;
export const RevisionBadge = ({ value }: { value: string }) => <span className={`badge ${tone(REV_TONE, value)}`}>{REVISION_STATUS[value as keyof typeof REVISION_STATUS] ?? value}</span>;
export const EcrBadge = ({ value }: { value: string }) => <span className={`badge ${tone(ECR_TONE, value)}`}>{ECR_STATUS[value as keyof typeof ECR_STATUS] ?? value}</span>;
export const EcoBadge = ({ value }: { value: string }) => <span className={`badge ${tone(ECO_TONE, value)}`}>{ECO_STATUS[value as keyof typeof ECO_STATUS] ?? value}</span>;
export const DocBadge = ({ value }: { value: string }) => <span className={`badge ${tone(DOC_TONE, value)}`}>{DOC_STATUS[value as keyof typeof DOC_STATUS] ?? value}</span>;
export const SupplierBadge = ({ value }: { value: string }) => <span className={`badge ${tone(SUP_TONE, value)}`}>{SUPPLIER_STATUS[value as keyof typeof SUPPLIER_STATUS] ?? value}</span>;

/** A link that downloads the CSV of a list or report (the list's filters included). */
export function CsvLink({ companyId, path, label = 'Export CSV' }: { companyId: string; path: string; label?: string }) {
  return (
    <a className="btn" href={csvHref(companyId, path)} download>
      <Icon name="download" /> {label}
    </a>
  );
}

export function Pager({ offset, limit, total, setOffset }: { offset: number; limit: number; total: number; setOffset: (n: number) => void }) {
  if (total <= limit) return total ? <p className="muted small">{total.toLocaleString()} in all.</p> : null;
  return (
    <div className="row wrap erp-pager">
      <span className="muted small grow">
        {(offset + 1).toLocaleString()} to {Math.min(offset + limit, total).toLocaleString()} of {total.toLocaleString()}
      </span>
      <button className="btn sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>Previous</button>
      <button className="btn sm" disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>Next</button>
    </div>
  );
}

/** Upload files to a product or a supplier (photos and documents, checked as every upload is). */
export function ErpUpload({ companyId, target, onDone, label = 'Add images or documents' }: { companyId: string; target: { productId?: string; supplierId?: string }; onDone: () => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const pick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.set('file', f);
        for (const [k, v] of Object.entries(target)) if (v) fd.set(k, v);
        await api(erpPath(companyId, '/files'), { method: 'POST', form: fd });
      }
      toast(files.length === 1 ? 'File added' : `${files.length} files added`);
      onDone();
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };
  return (
    <>
      <input ref={input} type="file" multiple className="sr-only" accept="image/*,.pdf,.txt,.csv,.docx,.xlsx,.pptx,.odt,.ods,.zip,.md" onChange={(e) => void pick(e.target.files)} aria-label={label} tabIndex={-1} />
      <button type="button" className="btn" disabled={busy} onClick={() => input.current?.click()}>
        <Icon name="upload" /> {busy ? 'Uploading…' : label}
      </button>
    </>
  );
}

export function ErpFiles({ files, canRemove, onRemove }: { files: ErpFile[]; canRemove: boolean; onRemove: (f: ErpFile) => void }) {
  const list: MtFile[] = files.map((f) => ({ ...f, uploadedBy: f.uploadedBy ?? null }));
  return <MtFileList files={list} canRemove={() => canRemove} onRemove={(f) => onRemove(files.find((x) => x.id === f.id)!)} />;
}

/** A note under a heading when something is not built yet: says so, never shows numbers. */
export function NotYet({ children }: { children: ReactNode }) {
  return (
    <p className="muted small erp-not-yet">
      <Icon name="info" size={14} /> {children}
    </p>
  );
}
