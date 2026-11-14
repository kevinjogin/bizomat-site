// Home: the dashboard of the person's role. Customise mode adds widgets from the catalogue, removes them, moves them
// (drag and drop, or Move earlier and Move later for keyboard users), resizes them and saves the layout for the role
// on this computer. Restore default brings back the role's layout.
import { useMemo, useState, type DragEvent } from 'react';
import { Modal, useToast } from '../../components/ui/overlays';
import { readStore, writeStore } from '../format';
import { PIcon } from '../icons';
import { ROLES, roleById } from '../nav';
import { PageHeader, useVisit } from '../shell/PageHeader';
import { company, useErp } from '../state';
import type { RoleId } from '../types';
import { DEFAULT_LAYOUTS, SIZE_LABEL, WIDGET_LIST, WIDGETS, type Size } from './catalog';

type Layout = { id: string; size: Size }[];
const loadLayout = (role: RoleId): Layout => readStore<Layout | null>(`layout:${role}`, null)?.filter((w) => WIDGETS[w.id]) ?? DEFAULT_LAYOUTS[role];

export function Dashboard() {
  const { role, setRole, companyId, site } = useErp();
  const toast = useToast();
  const r = roleById(role);
  useVisit('/', 'Home');
  const [saved, setSaved] = useState<Record<string, Layout>>({});
  const layout = saved[role] ?? loadLayout(role);
  const [draft, setDraft] = useState<Layout | null>(null);
  const [catalogue, setCatalogue] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [announce, setAnnounce] = useState('');
  const [filter, setFilter] = useState('');
  const editing = draft !== null;
  const items = draft ?? layout;
  const custom = !!readStore(`layout:${role}`, null);

  const move = (id: string, by: number) => {
    if (!draft) return;
    const i = draft.findIndex((w) => w.id === id);
    const j = i + by;
    if (j < 0 || j >= draft.length) return;
    const next = [...draft];
    [next[i], next[j]] = [next[j], next[i]];
    setDraft(next);
    setAnnounce(`${WIDGETS[id].title} moved to position ${j + 1} of ${next.length}.`);
    setTimeout(() => document.getElementById(`mv-${id}-${by < 0 ? 'up' : 'down'}`)?.focus(), 0);
  };
  const onDrop = (e: DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draft || !dragId || dragId === targetId) return;
    const from = draft.findIndex((w) => w.id === dragId);
    const to = draft.findIndex((w) => w.id === targetId);
    const next = [...draft];
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it);
    setDraft(next);
    setAnnounce(`${WIDGETS[dragId].title} moved to position ${to + 1} of ${next.length}.`);
    setDragId(null);
    setOverId(null);
  };
  const catalogueItems = useMemo(() => WIDGET_LIST.filter((w) => !filter || `${w.title} ${w.module} ${w.kind}`.toLowerCase().includes(filter.toLowerCase())), [filter]);

  return (
    <div className="erp-page erp-home">
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Dashboards' }, { label: r.label }]}
        title={`${r.layout} dashboard`}
        states={['C']}
        subtitle={`${company(companyId).name} · ${site} · demonstration figures`}
        actions={
          editing ? (
            <>
              <button type="button" className="btn" onClick={() => setCatalogue(true)}>
                <PIcon name="plus" /> Add widget
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setDraft(DEFAULT_LAYOUTS[role]);
                  setAnnounce('Default layout restored. Save to keep it.');
                }}
              >
                <PIcon name="restore" /> Restore default
              </button>
              <button type="button" className="btn" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  writeStore(`layout:${role}`, draft);
                  setSaved((s) => ({ ...s, [role]: draft! }));
                  setDraft(null);
                  toast(`Layout saved for the ${r.label} role on this computer.`);
                }}
              >
                Save layout
              </button>
            </>
          ) : (
            <>
              <label className="sr-only" htmlFor="dash-role">
                Role dashboard
              </label>
              <select id="dash-role" className="select erp-role-select" value={role} onChange={(e) => setRole(e.target.value as RoleId)} data-hl="role-select">
                {ROLES.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.label}
                  </option>
                ))}
              </select>
              <button type="button" className="btn" onClick={() => setDraft(layout)} data-hl="customise">
                <PIcon name="edit" /> Customise
              </button>
            </>
          )
        }
      />
      {editing ? (
        <div className="erp-alert info" role="note">
          <PIcon name="info" />
          <div>
            <strong>Customising the {r.label} dashboard.</strong>
            <p>Drag a widget by its handle, or use Move earlier and Move later. Change the size, remove widgets or add them from the catalogue. Save keeps the layout on this computer. Setting a role’s default layout for the whole company is for administrators, at a later stage.</p>
          </div>
        </div>
      ) : custom ? (
        <p className="muted small erp-custom-note">
          Your saved layout.{' '}
          <button
            type="button"
            className="erp-linkbtn"
            onClick={() => {
              writeStore(`layout:${role}`, undefined);
              setSaved((s) => ({ ...s, [role]: DEFAULT_LAYOUTS[role] }));
              toast('Default layout restored.');
            }}
          >
            Restore the default
          </button>
        </p>
      ) : null}
      <div className="sr-only" aria-live="polite">
        {announce}
      </div>
      <div className={`erp-dash${editing ? ' editing' : ''}`}>
        {items.map((w, i) => {
          const def = WIDGETS[w.id];
          if (!def) return null;
          return (
            <section
              key={w.id}
              className={`card erp-widget size-${w.size} kind-${def.kind.toLowerCase()}${dragId === w.id ? ' dragging' : ''}${overId === w.id && dragId !== w.id ? ' drop' : ''}`}
              aria-labelledby={`wt-${w.id}`}
              data-hl={`widget-${w.id}`}
              draggable={editing}
              onDragStart={(e) => {
                setDragId(w.id);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', w.id);
              }}
              onDragOver={(e) => {
                if (!editing) return;
                e.preventDefault();
                setOverId(w.id);
              }}
              onDragLeave={() => setOverId((o) => (o === w.id ? null : o))}
              onDrop={(e) => onDrop(e, w.id)}
              onDragEnd={() => {
                setDragId(null);
                setOverId(null);
              }}
            >
              <div className="erp-widget-head">
                {editing ? (
                  <span className="erp-drag" title="Drag to move" aria-hidden>
                    <PIcon name="drag" />
                  </span>
                ) : null}
                <h2 id={`wt-${w.id}`}>{def.title}</h2>
              </div>
              {editing ? (
                <div className="erp-widget-tools" role="group" aria-label={`Arrange ${def.title}`}>
                  <button id={`mv-${w.id}-up`} type="button" className="btn sm" disabled={i === 0} onClick={() => move(w.id, -1)} aria-label={`Move ${def.title} earlier`}>
                    <PIcon name="chevronLeft" size={14} /> Earlier
                  </button>
                  <button id={`mv-${w.id}-down`} type="button" className="btn sm" disabled={i === items.length - 1} onClick={() => move(w.id, 1)} aria-label={`Move ${def.title} later`}>
                    Later <PIcon name="chevronRight" size={14} />
                  </button>
                  <label className="sr-only" htmlFor={`sz-${w.id}`}>
                    Size of {def.title}
                  </label>
                  <select
                    id={`sz-${w.id}`}
                    className="select sm erp-size"
                    value={w.size}
                    onChange={(e) => {
                      setDraft(items.map((x) => (x.id === w.id ? { ...x, size: e.target.value as Size } : x)));
                      setAnnounce(`${def.title} is now ${SIZE_LABEL[e.target.value as Size].toLowerCase()}.`);
                    }}
                  >
                    {(Object.keys(SIZE_LABEL) as Size[]).map((s) => (
                      <option key={s} value={s}>
                        {SIZE_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn sm"
                    aria-label={`Remove ${def.title}`}
                    onClick={() => {
                      setDraft(items.filter((x) => x.id !== w.id));
                      setAnnounce(`${def.title} removed.`);
                    }}
                  >
                    <PIcon name="trash" size={14} /> Remove
                  </button>
                </div>
              ) : null}
              <div className="erp-widget-body" inert={editing ? true : undefined}>
                {def.render()}
              </div>
            </section>
          );
        })}
      </div>
      {catalogue ? (
        <Modal title="Add a widget" wide onClose={() => setCatalogue(false)}>
          <div className="field">
            <label htmlFor="cat-filter">Find a widget</label>
            <input id="cat-filter" className="input" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="For example: cash, stock, inspections" />
          </div>
          <ul className="erp-catalogue">
            {catalogueItems.map((w) => {
              const on = items.some((x) => x.id === w.id);
              return (
                <li key={w.id}>
                  <div className="grow">
                    <strong>{w.title}</strong>
                    <div className="muted small">
                      {w.kind} · {w.module}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn sm"
                    disabled={on}
                    onClick={() => {
                      setDraft([...(draft ?? layout), { id: w.id, size: w.size }]);
                      setAnnounce(`${w.title} added at the end.`);
                      toast(`${w.title} added at the end of the dashboard.`);
                    }}
                  >
                    {on ? 'On the dashboard' : 'Add'}
                  </button>
                </li>
              );
            })}
          </ul>
        </Modal>
      ) : null}
    </div>
  );
}
