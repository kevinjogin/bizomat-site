// The custom fields of one kind of record, for ERP administrators: add a field (text, long text, number, money, date, a
// choice or yes or no), rename it, change its choices, make it required or shown in lists, archive and restore it. The
// server (src/worker/erp/objects/custom.ts) checks everything again; values are kept when a field is archived.
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { errorMessage, get, patch, post } from '../../../lib/api';
import { Icon } from '../../../components/ui/Icon';
import { ErrorBox, Loading } from '../../../components/ui/ui';
import { Modal, useToast } from '../../../components/ui/overlays';
import { xPath } from './api';

interface Field {
  key: string;
  label: string;
  type: string;
  typeLabel: string;
  options: { key: string; label: string }[];
  required: boolean;
  list: boolean;
  help: string;
  archived: boolean;
}

export function CustomFieldsDialog({ companyId, object, plural, onClose }: { companyId: string; object: string; plural: string; onClose: () => void }) {
  const toast = useToast();
  const qc = useQueryClient();
  const key = ['erp', companyId, 'x', 'fields', object];
  const q = useQuery({ queryKey: key, queryFn: () => get<{ fields: Field[]; types: { value: string; label: string }[] }>(xPath(companyId, `/fields/${object}`)), retry: false });
  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');
  const [options, setOptions] = useState('');
  const [required, setRequired] = useState(false);
  const [list, setList] = useState(false);
  const [busy, setBusy] = useState(false);
  const done = async (fields: Field[]) => {
    qc.setQueryData(key, { ...(q.data ?? { types: [] }), fields });
    await qc.invalidateQueries({ queryKey: ['erp', companyId, 'x'] });
  };
  const add = async () => {
    setBusy(true);
    try {
      const r = await post<{ fields: Field[] }>(xPath(companyId, `/fields/${object}`), { label, type, required, list, ...(type === 'select' ? { options: options.split(',').map((o) => o.trim()).filter(Boolean) } : {}) });
      await done(r.fields);
      setLabel('');
      setOptions('');
      toast(`${label} added`);
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setBusy(false);
    }
  };
  const change = async (f: Field, body: Record<string, unknown>) => {
    try {
      const r = await patch<{ fields: Field[] }>(xPath(companyId, `/fields/${object}/${f.key}`), body);
      await done(r.fields);
    } catch (e) {
      toast(errorMessage(e), 'error');
    }
  };
  return (
    <Modal wide title={`Custom fields of ${plural.toLowerCase()}`} onClose={onClose} footer={<button className="btn" onClick={onClose}>Close</button>}>
      <div className="stack">
        <p className="muted small">Fields of your own, for this company only. They show in a Custom fields section of the form and the record, in CSV export and import, and in the list when you choose. Archiving a field hides it and keeps what was entered.</p>
        {q.error ? <ErrorBox error={q.error} /> : null}
        {!q.data && !q.error ? <Loading /> : null}
        {q.data ? (
          q.data.fields.length ? (
            <div className="crm-table-scroll">
              <table className="data-table">
                <thead><tr><th>Field</th><th>Kind</th><th>Required</th><th>In the list</th><th /></tr></thead>
                <tbody>
                  {q.data.fields.map((f) => (
                    <tr key={f.key} className={f.archived ? 'muted' : undefined}>
                      <td>{f.label}{f.options.length ? <span className="muted small"> ({f.options.map((o) => o.label).join(', ')})</span> : null}{f.archived ? <span className="badge">Archived</span> : null}</td>
                      <td>{f.typeLabel}</td>
                      <td><input type="checkbox" aria-label={`${f.label} required`} checked={f.required} disabled={f.archived} onChange={(e) => void change(f, { required: e.target.checked })} /></td>
                      <td><input type="checkbox" aria-label={`${f.label} in the list`} checked={f.list} disabled={f.archived} onChange={(e) => void change(f, { list: e.target.checked })} /></td>
                      <td>{f.archived ? <button className="btn sm" onClick={() => void change(f, { archived: false })}><Icon name="restore" /> Restore</button> : <button className="btn sm ghost" onClick={() => void change(f, { archived: true })}><Icon name="archive" /> Archive</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="muted small">No custom fields yet.</p>
        ) : null}
        <div className="card card-pad crm-form-grid">
          <div className="field"><label htmlFor="cf-label">Name</label><input id="cf-label" className="input" maxLength={80} value={label} onChange={(e) => setLabel(e.target.value)} /></div>
          <div className="field">
            <label htmlFor="cf-type">Kind</label>
            <select id="cf-type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
              {(q.data?.types ?? []).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          {type === 'select' ? <div className="field"><label htmlFor="cf-options">Choices, separated by commas</label><input id="cf-options" className="input" value={options} onChange={(e) => setOptions(e.target.value)} /></div> : null}
          <label className="row small"><input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} /> Required</label>
          <label className="row small"><input type="checkbox" checked={list} onChange={(e) => setList(e.target.checked)} /> Show in the list</label>
          <div className="row"><button className="btn primary" disabled={busy || !label.trim() || (type === 'select' && options.split(',').filter((o) => o.trim()).length < 2)} onClick={() => void add()}><Icon name="plus" /> Add the field</button></div>
        </div>
      </div>
    </Modal>
  );
}
