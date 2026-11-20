// BIZOMAT ERP: ERP roles in a company (Administration > ERP roles). An ERP administrator gives each member one
// or more roles; the company's owner and administrators are always ERP administrators. Everyone else sees their own.
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, errorMessage, get, put } from '../../lib/api';
import { usePageTitle } from '../../lib/hooks';
import { ErrorBox, Loading, PageHeader } from '../../components/ui/ui';
import { useToast } from '../../components/ui/overlays';
import '../../styles/maintenance.css';
import '../../styles/erp.css';
import { ROLE_LABELS, erpPath, useErpMe, type ErpRole } from './api';

interface RolesView {
  kind: 'registered' | 'own' | 'demo';
  roles: { value: ErpRole; label: string; help: string }[];
  people: { id: string; name: string; email: string; companyRole: 'owner' | 'admin' | 'manager' | 'employee' | 'read_only'; roles: ErpRole[]; rolesAreDefault: boolean }[];
}

export function ErpRolesPage({ companyId, companyName }: { companyId: string; companyName: string }) {
  usePageTitle('ERP roles');
  const me = useErpMe(companyId);
  const admin = !!me.data?.can['roles.manage'];
  const q = useQuery({ queryKey: ['erp', companyId, 'roles'], queryFn: () => get<RolesView>(erpPath(companyId, '/roles')), enabled: admin });
  if (me.error) {
    if (me.error instanceof ApiError && me.error.status === 404) return <div className="page crm-page"><PageHeader title="ERP roles" /><p className="muted">You have no ERP roles in {companyName}.</p></div>;
    return <div className="page"><ErrorBox error={me.error} retry={() => me.refetch()} /></div>;
  }
  if (!me.data) return <Loading />;
  return (
    <div className="page crm-page">
      <PageHeader title="ERP roles" subtitle={`Who may do what in ${companyName}'s Product Management, Engineering, Procurement and Warehouse. The server checks every action against these roles.`} />
      <section className="card card-pad stack">
        <h2 className="crm-subhead">Your roles</h2>
        <p>{me.data.roleLabels.join(', ')}</p>
        {me.data.solo ? <p className="muted small">You are the only person in this company, so you may approve your own change orders, suppliers, requisitions, purchase orders, adjustments and counts. Each time, the exception is recorded.</p> : <p className="muted small">Nobody approves what they drafted, created, raised, submitted or counted: someone else in the company must (segregation of duties).</p>}
      </section>
      {admin ? (
        q.error ? <ErrorBox error={q.error} retry={() => q.refetch()} /> : !q.data ? <Loading /> : (
          <>
            <section className="card card-pad stack">
              <h2 className="crm-subhead">The roles</h2>
              <dl className="crm-props">
                {q.data.roles.map((r) => <div key={r.value} className="crm-prop"><dt>{r.label}</dt><dd>{r.help}</dd></div>)}
              </dl>
            </section>
            <section className="card card-pad stack">
              <h2 className="crm-subhead">People</h2>
              {q.data.kind !== 'registered' ? <p className="muted small">{q.data.kind === 'demo' ? 'The example company has only you.' : 'Your own company has only you. Register a company to add people and give them roles.'}</p> : null}
              <div className="crm-table-scroll">
                <table className="data-table responsive erp-roles">
                  <thead><tr><th>Person</th><th>Roles</th></tr></thead>
                  <tbody>{q.data.people.map((p) => <PersonRow key={p.id} companyId={companyId} person={p} roles={q.data!.roles} editable={q.data!.kind === 'registered' && (p.companyRole !== 'owner' && p.companyRole !== 'admin')} />)}</tbody>
                </table>
              </div>
            </section>
          </>
        )
      ) : null}
    </div>
  );
}

function PersonRow({ companyId, person, roles, editable }: { companyId: string; person: RolesView['people'][number]; roles: RolesView['roles']; editable: boolean }) {
  const qc = useQueryClient();
  const toast = useToast();
  const [chosen, setChosen] = useState<Set<ErpRole>>(new Set(person.rolesAreDefault ? [] : person.roles));
  const [busy, setBusy] = useState(false);
  const dirty = editable && [...chosen].sort().join() !== (person.rolesAreDefault ? '' : [...person.roles].sort().join());
  const save = async () => {
    setBusy(true);
    try {
      await put(erpPath(companyId, `/roles/${person.id}`), { roles: [...chosen] });
      toast(`${person.name}: roles saved`);
      await qc.invalidateQueries({ queryKey: ['erp', companyId] });
    } catch (err) {
      toast(errorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };
  return (
    <tr>
      <td data-label="Person"><strong>{person.name}</strong><div className="muted small">{person.email}</div>{person.companyRole === 'owner' || person.companyRole === 'admin' ? <div className="muted small">Company {person.companyRole}: always an ERP administrator</div> : null}</td>
      <td data-label="Roles">
        {editable ? (
          <div className="stack">
            <div className="erp-role-grid">
              {roles.map((r) => (
                <label key={r.value} className="checkbox" title={r.help}>
                  <input type="checkbox" checked={chosen.has(r.value)} onChange={(e) => setChosen((s) => { const n = new Set(s); if (e.target.checked) n.add(r.value); else n.delete(r.value); return n; })} /> {r.label}
                </label>
              ))}
            </div>
            <div className="row">
              <span className="muted small grow">{chosen.size ? '' : 'No role chosen: a viewer.'}</span>
              <button className="btn sm primary" disabled={!dirty || busy} onClick={() => void save()}>{busy ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        ) : (
          <span>{person.roles.map((r) => ROLE_LABELS[r]).join(', ')}</span>
        )}
      </td>
    </tr>
  );
}
