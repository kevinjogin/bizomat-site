// The page header of every ERP page: breadcrumb, title, identifier and status for records, the state badges
// (Working, Connected, Planned), the favourite star, primary actions and a secondary actions menu. Under it, a note
// says what the page is: an existing BIZOMAT screen, a connected ERP screen or a planned module.
import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PIcon } from '../icons';
import { MenuButton, OpenInApp, StateBadges, StatusBadge } from '../kit';
import { accessTo, roleById, STATE_LABEL } from '../nav';
import { useErp } from '../state';
import type { NavPage, PageState } from '../types';

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="erp-crumbs">
      <ol>
        {items.map((c, i) => (
          <li key={i}>
            {c.to && i < items.length - 1 ? <Link to={c.to}>{c.label}</Link> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Remembers the page in Recent and sets the browser tab title. */
export function useVisit(path: string, label: string) {
  const { pushRecent } = useErp();
  useEffect(() => {
    document.title = `${label} · BIZOMAT ERP design prototype`;
    pushRecent({ path, label });
  }, [path, label, pushRecent]);
}

export function PageHeader({
  crumbs,
  title,
  id,
  status,
  states,
  pinPath,
  pinLabel,
  subtitle,
  actions,
  more,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  id?: string;
  status?: string;
  states?: PageState[];
  pinPath?: string;
  pinLabel?: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  more?: (close: () => void) => ReactNode;
}) {
  const { favourites, toggleFavourite } = useErp();
  const pinned = !!pinPath && favourites.some((f) => f.path === pinPath);
  return (
    <header className="erp-page-header" data-hl="record-header">
      <Breadcrumbs items={crumbs} />
      <div className="erp-title-row">
        <div className="erp-title">
          <h1>{title}</h1>
          <div className="erp-title-meta">
            {id ? <span className="erp-id">{id}</span> : null}
            {status ? <StatusBadge status={status} /> : null}
            {states ? <StateBadges states={states} /> : null}
            {pinPath ? (
              <button
                type="button"
                className={`btn ghost icon sm erp-pin${pinned ? ' on' : ''}`}
                aria-pressed={pinned}
                aria-label={pinned ? `Unpin ${pinLabel} from favourites` : `Pin ${pinLabel} to favourites`}
                title={pinned ? 'Unpin from favourites' : 'Pin to favourites'}
                onClick={() => toggleFavourite({ path: pinPath, label: pinLabel ?? String(title) })}
                data-hl="pin"
              >
                <PIcon name="star" filled={pinned} />
              </button>
            ) : null}
          </div>
          {subtitle ? <p className="erp-subtitle">{subtitle}</p> : null}
        </div>
        {actions || more ? (
          <div className="erp-actions">
            {actions}
            {more ? (
              <MenuButton label="More actions" className="btn icon" content={<PIcon name="more" />} align="end" width={220}>
                {more}
              </MenuButton>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/** What the page is: Working (an existing screen), Connected or Planned, and the reader's access in this role. */
export function StateNote({ page, record }: { page: NavPage; record?: boolean }) {
  const { role } = useErp();
  const access = accessTo(role, page.path);
  const st = page.state;
  const what = record ? 'record' : 'page';
  let text: ReactNode;
  if (st.length > 1)
    text = (
      <>
        {st.includes('W') ? (
          <>
            This {what} opens the working {page.module} screen <code>{page.opens}</code>.{' '}
          </>
        ) : null}
        {page.stateNote}
      </>
    );
  else if (st[0] === 'W')
    text = (
      <>
        This {what} opens the working {page.module} screen <code>{page.opens}</code> inside ERP, with the same sign-in and data. The prototype shows a representative mock with demonstration data.
      </>
    );
  else if (st[0] === 'C') text = <>Connected: an ERP screen over records that already exist in Project Management, Finance and the CRM. {page.opens ? <>Source: {page.opens}.</> : null}</>;
  else text = <>Planned module: prototype screen. {page.opens}. Demonstration data only.</>;
  return (
    <div className={`erp-statenote s-${st[0]}`} role="note">
      <span className="erp-statenote-label">{st.map((s) => STATE_LABEL[s]).join(' / ')}</span>
      <span className="grow">{text}</span>
      {access === 'read' ? <span className="badge">Read only for the {roleById(role).label} role</span> : null}
      {access === 'none' ? <span className="badge">Not in the {roleById(role).label} role’s sections</span> : null}
      {st.includes('W') ? <OpenInApp module={page.module} /> : null}
    </div>
  );
}
