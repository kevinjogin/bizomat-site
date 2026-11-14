// Pickers used by the maintenance forms: an asset (searched by number or name), a person and a department.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import { useDebounced } from '../../lib/hooks';
import { Icon } from '../../components/ui/Icon';
import { mtPath, type Asset, type MtMe, type MtRole } from './api';

export interface PickedAsset {
  id: string;
  number: string;
  name: string;
}

/** Choose an asset of the company by typing part of its number, name, maker, model, serial or location. */
export function AssetPicker({ companyId, value, onChange, id, label = 'Asset', exclude, allowNone = true }: { companyId: string; value: PickedAsset | null; onChange: (a: PickedAsset | null) => void; id: string; label?: string; exclude?: string; allowNone?: boolean }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const term = useDebounced(q, 200);
  const list = useQuery({
    queryKey: ['mt', companyId, 'asset-pick', term],
    queryFn: () => get<{ assets: Asset[] }>(mtPath(companyId, `/assets?limit=20&q=${encodeURIComponent(term)}`)),
    enabled: open,
  });
  const results = (list.data?.assets ?? []).filter((a) => a.id !== exclude);
  if (value && !open) {
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <div className="mt-picked">
          <span className="grow"><strong>{value.number}</strong> {value.name}</span>
          <button type="button" id={id} className="btn sm" onClick={() => setOpen(true)}>Change</button>
          {allowNone ? <button type="button" className="btn ghost sm" onClick={() => onChange(null)}>Remove</button> : null}
        </div>
      </div>
    );
  }
  return (
    <div className="field mt-picker">
      <label htmlFor={id}>{label}</label>
      <div className="crm-search">
        <Icon name="search" />
        <input id={id} className="input" type="search" autoComplete="off" placeholder="Search by asset number or name" value={q} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setOpen(true); }} />
      </div>
      {open ? (
        <ul className="mt-picker-list" aria-label="Matching assets">
          {list.isLoading ? <li className="muted small crm-pad">Searching…</li> : null}
          {!list.isLoading && !results.length ? <li className="muted small crm-pad">No asset matches.</li> : null}
          {results.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => { onChange({ id: a.id, number: a.number, name: a.name }); setOpen(false); setQ(''); }}>
                <strong className="mt-num">{a.number}</strong> <span className="grow">{a.name}</span>
                {a.location ? <span className="muted small">{a.location}</span> : null}
              </button>
            </li>
          ))}
          {value ? <li><button type="button" onClick={() => setOpen(false)}>Keep {value.number}</button></li> : null}
        </ul>
      ) : null}
    </div>
  );
}

/** The number and name of an asset given by id (for a filter kept in the address). */
export function useAssetLabel(companyId: string, assetId: string): PickedAsset | null {
  const q = useQuery({ queryKey: ['mt', companyId, 'asset-label', assetId], queryFn: () => get<{ asset: Asset }>(mtPath(companyId, `/assets/${encodeURIComponent(assetId)}`)), enabled: !!assetId, retry: false, staleTime: 60_000 });
  if (!assetId) return null;
  return q.data ? { id: q.data.asset.id, number: q.data.asset.number, name: q.data.asset.name } : { id: assetId, number: '…', name: '' };
}

/** A person of the company, optionally only those with a given maintenance role or higher. */
export function PersonSelect({ me, value, onChange, id, label, minRole, empty = 'Nobody' }: { me: MtMe; value: string; onChange: (v: string) => void; id: string; label: string; minRole?: MtRole; empty?: string }) {
  const rank: Record<MtRole, number> = { requester: 1, technician: 2, supervisor: 3, admin: 4 };
  const people = minRole ? me.people.filter((p) => p.role && rank[p.role] >= rank[minRole]) : me.people;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{empty}</option>
        {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
    </div>
  );
}

/** A department of a registered company (when it has any), else free text. */
export function DepartmentField({ me, id, departmentId, department, onChange }: { me: MtMe; id: string; departmentId: string; department: string; onChange: (v: { departmentId: string; department: string }) => void }) {
  if (me.departments.length) {
    return (
      <div className="field">
        <label htmlFor={id}>Department</label>
        <select id={id} className="select" value={departmentId} onChange={(e) => onChange({ departmentId: e.target.value, department: me.departments.find((d) => d.id === e.target.value)?.name ?? '' })}>
          <option value="">None</option>
          {me.departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div className="field">
      <label htmlFor={id}>Department</label>
      <input id={id} className="input" maxLength={120} value={department} onChange={(e) => onChange({ departmentId: '', department: e.target.value })} />
    </div>
  );
}
