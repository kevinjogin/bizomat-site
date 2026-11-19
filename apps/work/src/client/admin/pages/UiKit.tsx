// The UI kit (owner's UI brief of 19 Nov 2026, deliverable 4; docs/ui/README.md): every shared component of BIZOMAT
// ERP with its variants, sizes and states, for platform admins only (the console is guarded on the server). The preview
// switch shows the new UI in this browser tab before the flag new_ui_enabled is switched on for anyone.
import { useState, type ReactNode } from 'react';
import { useSession } from '../../lib/session';
import { setUiPreview, uiPreviewOn } from '../../lib/ui';
import { EmptyState, Loading } from '../../components/ui/ui';
import { Dropdown, MenuItem, MenuSep, Modal, useToast } from '../../components/ui/overlays';
import { Icon } from '../../components/ui/Icon';

/** A section of the kit, with the ERP's own card classes, so it reads the same in the ERP console and the older one. */
function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="card card-pad stack">
      <div>
        <h2 className="crm-subhead">{title}</h2>
        {subtitle ? <p className="muted small">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

const VARIANTS: [string, string][] = [
  ['primary', 'Primary'],
  ['', 'Secondary'],
  ['outline', 'Outline'],
  ['ghost', 'Ghost'],
  ['danger', 'Danger'],
  ['link', 'Link'],
];
const SIZES: [string, string][] = [
  ['sm', 'Small (32)'],
  ['lg', 'Medium (40)'],
  ['xl', 'Large (48)'],
];

export default function UiKit() {
  const { session } = useSession();
  const toast = useToast();
  const [preview, setPreview] = useState(uiPreviewOn() || document.documentElement.dataset.ui === 'new');
  const [density, setDensity] = useState(document.documentElement.dataset.density === 'compact');
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const flagOn = !!session?.ui?.newUi;

  const togglePreview = (on: boolean) => {
    setPreview(on);
    setUiPreview(on, session?.ui);
  };
  const toggleDensity = (on: boolean) => {
    setDensity(on);
    if (on) document.documentElement.dataset.density = 'compact';
    else delete document.documentElement.dataset.density;
  };

  return (
    <div className="stack">
      <div>
        <h2 className="crm-subhead">UI kit</h2>
        <p className="muted small">Every shared component of BIZOMAT ERP, with its variants, sizes and states. The flag new_ui_enabled is {flagOn ? 'on' : 'off'} for you.</p>
      </div>
      <Card title="Preview">
        <label className="row small">
          <input type="checkbox" checked={preview} disabled={flagOn} onChange={(e) => togglePreview(e.target.checked)} /> Show the new UI in this browser tab (no one else sees it)
        </label>
        <label className="row small">
          <input type="checkbox" checked={density} onChange={(e) => toggleDensity(e.target.checked)} /> Compact density (on this page only; people choose theirs in their profile)
        </label>
      </Card>

      <Card title="Buttons" subtitle="Variants by size. Hover lifts, pressing settles, the focus ring shows from the keyboard.">
        <div className="stack">
          {SIZES.map(([size, sizeLabel]) => (
            <div key={size} className="row wrap">
              <span className="small muted ui-kit-label">{sizeLabel}</span>
              {VARIANTS.map(([v, label]) => (
                <button key={v || 'secondary'} className={`btn ${v} ${size}`.trim()} type="button">{label}</button>
              ))}
              <button className={`btn icon ${size === 'sm' ? '' : 'lg'}`.trim()} type="button" aria-label="Icon button"><Icon name="plus" size={16} /></button>
            </div>
          ))}
          <div className="row wrap">
            <span className="small muted ui-kit-label">States</span>
            <button className="btn primary" type="button" disabled>Disabled</button>
            <button className="btn" type="button" disabled>Disabled</button>
            <button className="btn primary" type="button" aria-busy={busy} onClick={() => { setBusy(true); window.setTimeout(() => setBusy(false), 1500); }}>
              Save (shows loading)
            </button>
          </div>
        </div>
      </Card>

      <Card title="Links">
        <div className="main">
          <p>A sentence with <a href="#ui-kit">an inline link</a> in running text, and <a href="#ui-kit">another one</a>.</p>
        </div>
        <nav className="row" aria-label="Example navigation">
          <a className="nav-item active" href="#ui-kit">Active item</a>
          <a className="nav-item" href="#ui-kit">Item</a>
        </nav>
        <div className="tabs" role="tablist" aria-label="Example tabs">
          <button className="tab active" role="tab" aria-selected type="button">Current tab</button>
          <button className="tab" role="tab" aria-selected={false} type="button">Tab</button>
        </div>
      </Card>

      <Card title="Inputs">
        <div className="field">
          <label htmlFor="kit-name">Label</label>
          <input id="kit-name" className="input" placeholder="Text input" />
          <span className="hint">Help text says what to type.</span>
        </div>
        <div className="field">
          <label htmlFor="kit-select">Select</label>
          <select id="kit-select" className="select"><option>One</option><option>Two</option></select>
        </div>
        <div className="field">
          <label htmlFor="kit-error">With an error</label>
          <input id="kit-error" className="input" aria-invalid defaultValue="Not valid" />
          <span className="error">Say what is wrong and how to fix it.</span>
        </div>
        <div className="field">
          <label htmlFor="kit-area">Text area</label>
          <textarea id="kit-area" className="textarea" />
        </div>
      </Card>

      <Card title="Cards and badges">
        <div className="grid-cards">
          <div className="card card-pad"><strong>Card</strong><p className="small muted">Radius large, a small shadow, padding 24.</p></div>
          <a className="card card-pad" href="#ui-kit"><strong>Clickable card</strong><p className="small muted">Lifts on hover.</p></a>
        </div>
        <div className="row">
          <span className="badge">Neutral</span>
          <span className="badge accent">Accent</span>
          <span className="badge success">Success</span>
          <span className="badge warning">Warning</span>
          <span className="badge danger">Danger</span>
        </div>
        <div className="info-box">An information box.</div>
      </Card>

      <Card title="Table">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Status</th><th>Updated</th></tr></thead>
            <tbody>
              {['Bracket', 'Housing', 'Shaft'].map((n) => <tr key={n}><td>{n}</td><td><span className="badge success">Released</span></td><td>Today</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Overlays">
        <div className="row wrap">
          <button className="btn" type="button" onClick={() => setModal(true)}>Open a modal</button>
          <Dropdown label="Example menu" trigger={(open, ref) => <button ref={ref} className="btn" type="button" onClick={open}>Open a menu</button>}>
            {(close) => (
              <>
                <MenuItem icon="edit" onClick={() => { close(); toast('Menu item chosen'); }}>Edit</MenuItem>
                <MenuItem icon="copy" onClick={() => { close(); toast('Menu item chosen'); }}>Duplicate</MenuItem>
                <MenuSep />
                <MenuItem icon="trash" danger onClick={() => { close(); toast('Menu item chosen', 'error'); }}>Delete</MenuItem>
              </>
            )}
          </Dropdown>
          <button className="btn" type="button" onClick={() => toast('Saved')}>Show a toast</button>
          <button className="btn" type="button" onClick={() => toast('Something went wrong', 'error')}>Show an error toast</button>
        </div>
      </Card>

      <Card title="Loading and empty states">
        <Loading label="Loading the page" />
        <EmptyState icon="grid" title="Nothing here yet" action={<button className="btn primary" type="button">Add the first one</button>}>
          A short sentence says what will appear here.
        </EmptyState>
      </Card>

      {modal ? (
        <Modal title="A modal" onClose={() => setModal(false)} footer={<><button className="btn ghost" type="button" onClick={() => setModal(false)}>Cancel</button><button className="btn primary" type="button" onClick={() => setModal(false)}>Confirm</button></>}>
          <p>Modals fade and scale in, with the largest shadow.</p>
        </Modal>
      ) : null}
    </div>
  );
}
