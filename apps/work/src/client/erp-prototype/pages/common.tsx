// Page frame shared by every module page: header with breadcrumb, state badges and favourite star, then the state
// note, then the content.
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PIcon } from '../icons';
import { sectionOf } from '../nav';
import { ListView } from '../patterns/ListView';
import { ENTITIES } from '../registry';
import { PageHeader, StateNote, useVisit } from '../shell/PageHeader';
import type { NavPage } from '../types';

export function ModulePage({ page, children, actions, subtitle, title, wide }: { page: NavPage; children: ReactNode; actions?: ReactNode; subtitle?: ReactNode; title?: string; wide?: boolean }) {
  const section = sectionOf(page.path);
  useVisit(`/${page.path}`, page.label);
  return (
    <div className={`erp-page${wide ? ' wide' : ''}`}>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/' }, { label: section?.label ?? '', to: `/${section?.pages[0].path}` }, { label: page.label }]}
        title={title ?? page.label}
        states={page.state}
        pinPath={`/${page.path}`}
        pinLabel={page.label}
        subtitle={subtitle}
        actions={actions}
      />
      <StateNote page={page} />
      {children}
    </div>
  );
}

export function EntityListPage({ page }: { page: NavPage }) {
  const def = ENTITIES[page.entity!];
  return (
    <ModulePage
      page={page}
      actions={
        def.form ? (
          <Link to={`/${page.path}/new`} className="btn primary">
            <PIcon name="plus" /> New {def.label.toLowerCase()}
          </Link>
        ) : undefined
      }
    >
      <ListView def={def} basePath={page.path} label={page.label} />
    </ModulePage>
  );
}
