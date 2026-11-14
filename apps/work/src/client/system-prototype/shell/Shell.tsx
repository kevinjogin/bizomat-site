// The System shell (information architecture, section 2): the prototype banner, the header (brand, company and site,
// search, quick create, notifications, help, user menu), the sidebar (Home, My Work, Favourites, Recent and the module
// sections for the role) and, on phones, a drawer and a bottom bar.
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Popover, useToast } from '../../components/ui/overlays';
import { BrandMark, Wordmark } from '../../components/ui/Icon';
import { isTypingTarget } from '../../lib/hooks';
import { COMPANIES } from '../data/core';
import { PHONE, useMedia } from '../format';
import { PIcon } from '../icons';
import { MenuButton, MenuEntry, MenuLink, StateBadges } from '../kit';
import { APP_URL, ROLES, roleById, sectionOf, visibleSections } from '../nav';
import { company, openWork, useErp } from '../state';
import type { ModuleId, SectionId } from '../types';
import { JourneysPanel } from './Journeys';
import { NotificationsDrawer } from './Notifications';
import { SearchDialog } from './Search';

const QUICK_CREATE: [string, string, string, string][] = [
  ['Task', '/projects/my-tasks/new', 'checkSquare', 'Project Management'],
  ['Customer', '/sales/customers/new', 'building', 'CRM'],
  ['Opportunity', '/sales/opportunities/new', 'kanban', 'CRM'],
  ['Quote', '/sales/quotes/new', 'file', 'Finance'],
  ['Invoice', '/finance/invoices/new', 'doc', 'Finance'],
  ['Bill', '/finance/bills/new', 'file', 'Finance'],
  ['Product', '/products/products/new', 'box', 'System'],
  ['Purchase requisition', '/procurement/requisitions/new', 'form', 'System'],
  ['Work order', '/manufacturing/work-orders/new', 'factory', 'System'],
  ['Inspection', '/quality/inspections/new', 'clipboard', 'System'],
];
const STANDALONE: ModuleId[] = ['CRM', 'Finance', 'Project Management', 'CAD Automation', 'Company'];

/** Finds the element a guided journey points at, scrolls to it and marks it for a few seconds. */
function useHighlight() {
  const { highlight } = useErp();
  const location = useLocation();
  useEffect(() => {
    if (!highlight) return;
    let tries = 0;
    let marked: HTMLElement | null = null;
    let clear: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      tries += 1;
      const el = Array.from(document.querySelectorAll<HTMLElement>(`[data-hl="${CSS.escape(highlight)}"]`)).find((x) => x.offsetParent !== null || x.getClientRects().length > 0);
      if (el) {
        clearInterval(timer);
        marked = el;
        el.classList.add('erp-hl');
        el.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        clear = setTimeout(() => el.classList.remove('erp-hl'), 6000);
      } else if (tries > 30) clearInterval(timer);
    }, 100);
    return () => {
      clearInterval(timer);
      if (clear) clearTimeout(clear);
      marked?.classList.remove('erp-hl');
    };
  }, [highlight, location.pathname, location.search]);
}

export function Shell() {
  const erp = useErp();
  const { searchOpen, noticesOpen, journeyOpen, navOpen, setNavOpen, collapsed, openSearch } = erp;
  const location = useLocation();
  const phone = useMedia(PHONE);
  const main = useRef<HTMLElement>(null);
  const banner = useRef<HTMLDivElement>(null);
  useHighlight();
  // Drawers and dialogs open below the prototype banner, which stays visible on every screen.
  useEffect(() => {
    const el = banner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => document.documentElement.style.setProperty('--erp-top', `${el.offsetHeight}px`));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    setNavOpen(false);
    main.current?.scrollTo?.({ top: 0 });
  }, [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navOpen && !document.querySelector('[aria-modal="true"], .popover')) setNavOpen(false);
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTypingTarget(e.target) && !document.querySelector('[aria-modal="true"]')) {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openSearch, navOpen, setNavOpen]);
  return (
    <div className={`erp-app${collapsed && !phone ? ' collapsed' : ''}${navOpen ? ' nav-open' : ''}${journeyOpen ? ' with-journeys' : ''}`}>
      <button type="button" className="erp-skip" onClick={() => main.current?.focus()}>
        Skip to content
      </button>
      <div className="erp-banner" role="note" ref={banner}>
        <PIcon name="info" size={14} />
        <span>Design prototype: demonstration data, not connected to BIZOMAT.</span>
      </div>
      <Header />
      <div className="erp-body">
        {phone && navOpen ? <div className="erp-scrim" onClick={() => setNavOpen(false)} aria-hidden /> : null}
        <Sidebar />
        <main id="erp-main" className="erp-main" ref={main} tabIndex={-1}>
          <Outlet />
        </main>
        {journeyOpen ? <JourneysPanel /> : null}
      </div>
      {phone ? <BottomBar /> : null}
      {searchOpen ? <SearchDialog /> : null}
      {noticesOpen ? <NotificationsDrawer /> : null}
    </div>
  );
}

// ------------------------------------------------------------------ header

function Header() {
  const { companyId, setCompany, site, setSite, role, setRole, theme, setTheme, notices, setNoticesOpen, setJourneyOpen, navOpen, setNavOpen, openSearch } = useErp();
  const navigate = useNavigate();
  const toast = useToast();
  const phone = useMedia(PHONE);
  const [about, setAbout] = useState<'about' | 'keys' | null>(null);
  const co = company(companyId);
  const unread = notices.filter((n) => !n.read).length;
  return (
    <header className="erp-header">
      {phone ? (
        <button type="button" className="btn ghost icon" aria-label="Menu" aria-expanded={navOpen} aria-controls="erp-sidebar" onClick={() => setNavOpen(!navOpen)}>
          <PIcon name="menu" />
        </button>
      ) : null}
      <Link to="/" className="erp-brand" aria-label="BIZOMAT System home">
        <BrandMark size={28} />
        {!phone ? <Wordmark height={15} /> : null}
        <span className="erp-product">System</span>
      </Link>
      {!phone ? <ContextSelectors co={co} site={site} setCompany={setCompany} setSite={setSite} /> : null}
      <button type="button" className="erp-search-trigger" onClick={() => openSearch()} aria-label="Search everything (press slash)">
        <PIcon name="search" />
        <span className="erp-search-label">Search everything…</span>
        <kbd>/</kbd>
      </button>
      <span className="spacer" />
      <MenuButton label="Create new" className="btn primary erp-new" content={<><PIcon name="plus" /><span className="erp-hide-sm">New</span></>} align="end" width={260} menuLabel="Quick create">
        {(close) => (
          <>
            <div className="menu-label">Create</div>
            {QUICK_CREATE.map(([label, to, icon, mod]) => (
              <MenuEntry
                key={label}
                icon={icon}
                hint={mod === 'System' ? 'System' : mod}
                onClick={() => {
                  close();
                  navigate(to);
                }}
              >
                {label}
              </MenuEntry>
            ))}
          </>
        )}
      </MenuButton>
      <button type="button" className="btn ghost icon erp-bell" aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} onClick={() => setNoticesOpen(true)}>
        <PIcon name="bell" />
        {unread ? (
          <span className="erp-bell-count" aria-hidden>
            {unread}
          </span>
        ) : null}
      </button>
      <MenuButton label="Help" className="btn ghost icon" content={<PIcon name="help" />} align="end" width={250}>
        {(close) => (
          <>
            <MenuEntry
              icon="map"
              onClick={() => {
                close();
                setJourneyOpen(true);
              }}
            >
              Guided journeys
            </MenuEntry>
            <MenuEntry
              icon="keyboard"
              onClick={() => {
                close();
                setAbout('keys');
              }}
            >
              Keyboard shortcuts
            </MenuEntry>
            <MenuEntry
              icon="info"
              onClick={() => {
                close();
                setAbout('about');
              }}
            >
              About this prototype
            </MenuEntry>
            <div className="menu-sep" role="separator" />
            <MenuLink icon="help" href="https://bizomat.ai/systems/finance/guide/" external onNavigate={close}>
              Finance user guide
            </MenuLink>
            <MenuLink icon="help" href="https://bizomat.ai/systems/crm/guide/" external onNavigate={close}>
              CRM user guide
            </MenuLink>
          </>
        )}
      </MenuButton>
      <MenuButton label={`Account menu for Alex Morgan, viewing as ${roleById(role).label}`} className="btn ghost erp-user" content={<span className="erp-avatar">AM</span>} align="end" width={290}>
        {(close) => (
          <>
            <div className="erp-user-head">
              <strong>Alex Morgan</strong>
              <span className="muted small">Demonstration user · {roleById(role).label}</span>
            </div>
            {phone ? (
              <>
                <div className="menu-label">Company</div>
                {COMPANIES.map((c) => (
                  <MenuEntry key={c.id} checked={c.id === companyId} onClick={() => { setCompany(c.id); close(); }}>
                    {c.name}
                  </MenuEntry>
                ))}
                <div className="menu-label">Site</div>
                {['All sites', ...co.sites].map((s) => (
                  <MenuEntry key={s} checked={s === site} onClick={() => { setSite(s); close(); }}>
                    {s}
                  </MenuEntry>
                ))}
              </>
            ) : null}
            <div className="menu-label">Theme</div>
            {(['light', 'dark', 'system'] as const).map((t) => (
              <MenuEntry key={t} icon={t === 'light' ? 'sun' : t === 'dark' ? 'moon' : 'settings'} checked={theme === t} onClick={() => setTheme(t)}>
                {t === 'system' ? 'System (this computer)' : t === 'light' ? 'Light' : 'Dark'}
              </MenuEntry>
            ))}
            <div className="menu-label">View as role (prototype)</div>
            <div className="erp-role-menu">
              {ROLES.map((r) => (
                <MenuEntry
                  key={r.id}
                  checked={r.id === role}
                  onClick={() => {
                    setRole(r.id);
                    close();
                    navigate('/');
                    toast(`Viewing as ${r.label}.`);
                  }}
                >
                  {r.label}
                </MenuEntry>
              ))}
            </div>
            <div className="menu-label">Open the standalone apps</div>
            {STANDALONE.map((m) => (
              <MenuLink key={m} icon="layers" href={APP_URL[m]} external onNavigate={close}>
                {m === 'CRM' ? 'Customer Relationship Management' : m}
              </MenuLink>
            ))}
            <div className="menu-sep" role="separator" />
            <MenuEntry
              icon="logout"
              onClick={() => {
                close();
                toast('The prototype has no sign-in, so there is nothing to sign out of.');
              }}
            >
              Sign out
            </MenuEntry>
          </>
        )}
      </MenuButton>
      {about ? (
        <Modal title={about === 'keys' ? 'Keyboard shortcuts' : 'About this prototype'} onClose={() => setAbout(null)}>
          {about === 'keys' ? (
            <dl className="erp-keys">
              <dt>
                <kbd>/</kbd>
              </dt>
              <dd>Search everything</dd>
              <dt>
                <kbd>Enter</kbd>
              </dt>
              <dd>In search: open the top or highlighted result</dd>
              <dt>
                <kbd>↑</kbd> <kbd>↓</kbd>
              </dt>
              <dd>Move through menus and search results</dd>
              <dt>
                <kbd>←</kbd> <kbd>→</kbd>
              </dt>
              <dd>Move between tabs</dd>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>Close a menu, dialog or drawer</dd>
            </dl>
          ) : (
            <div className="erp-about">
              <p>This is a clickable design prototype of BIZOMAT System. Every figure, name and record is invented demonstration data. Nothing is saved on a server and nothing is sent.</p>
              <p>Pages carry their state: Working (an existing BIZOMAT screen, shown here as a mock), Connected (a System screen over existing records) or Planned (a new module).</p>
              <p>Layouts, favourites, saved views and saved reports are kept on this computer only.</p>
            </div>
          )}
        </Modal>
      ) : null}
    </header>
  );
}

function ContextSelectors({ co, site, setCompany, setSite }: { co: (typeof COMPANIES)[number]; site: string; setCompany: (id: string) => void; setSite: (s: string) => void }) {
  return (
    <div className="erp-context">
      <MenuButton label={`Company: ${co.name}. Change company`} className="btn erp-ctx" content={<><PIcon name="building" /><span className="erp-ctx-text">{co.short}</span><PIcon name="chevronDown" size={14} /></>} width={300} menuLabel="Company">
        {(close) => (
          <>
            <div className="menu-label">Company</div>
            {COMPANIES.map((c) => (
              <MenuEntry
                key={c.id}
                checked={c.id === co.id}
                onClick={() => {
                  setCompany(c.id);
                  close();
                }}
              >
                {c.name}
              </MenuEntry>
            ))}
          </>
        )}
      </MenuButton>
      <MenuButton label={`Site: ${site}. Change site`} className="btn erp-ctx" content={<><PIcon name="map" /><span className="erp-ctx-text">{site}</span><PIcon name="chevronDown" size={14} /></>} width={220} menuLabel="Site">
        {(close) => (
          <>
            <div className="menu-label">Site or branch</div>
            {['All sites', ...co.sites].map((s) => (
              <MenuEntry
                key={s}
                checked={s === site}
                onClick={() => {
                  setSite(s);
                  close();
                }}
              >
                {s}
              </MenuEntry>
            ))}
          </>
        )}
      </MenuButton>
    </div>
  );
}

// ------------------------------------------------------------------ sidebar

function Sidebar() {
  const { role, work, favourites, recent, collapsed, setCollapsed, moveFavourite, toggleFavourite } = useErp();
  const location = useLocation();
  const phone = useMedia(PHONE);
  const path = location.pathname.split('/').slice(1, 3).join('/');
  const current = sectionOf(path)?.id ?? null;
  const [openSec, setOpenSec] = useState<SectionId | null>(current);
  const [manage, setManage] = useState(false);
  useEffect(() => {
    if (current) setOpenSec(current);
  }, [current]);
  const visible = visibleSections(role);
  const count = openWork(work).length;
  const icons = collapsed && !phone;
  return (
    <nav id="erp-sidebar" className={`erp-sidebar${icons ? ' icons' : ''}`} aria-label="Main navigation">
      <div className="erp-nav-top">
        <NavLink to="/" end className={({ isActive }) => `erp-nav-item${isActive ? ' active' : ''}`} title={icons ? 'Home' : undefined}>
          <PIcon name="home" />
          <span className="erp-nav-label">Home</span>
          {!icons ? <StateBadges states={['C']} compact /> : null}
        </NavLink>
        <NavLink to="/my-work" className={({ isActive }) => `erp-nav-item${isActive ? ' active' : ''}`} title={icons ? `My Work, ${count} open` : undefined}>
          <PIcon name="inbox" />
          <span className="erp-nav-label">My Work</span>
          <span className="erp-count" aria-label={`${count} open`}>
            {count}
          </span>
          {!icons ? <StateBadges states={['C']} compact /> : null}
        </NavLink>
      </div>
      {icons ? (
        <>
          <Flyout icon="star" label="Favourites" items={favourites.map((f) => ({ to: f.path, label: f.label }))} empty="Pin pages with the star in their header." />
          <Flyout icon="clock" label="Recent" items={recent.map((f) => ({ to: f.path, label: f.label }))} empty="Pages you open appear here." />
        </>
      ) : (
        <>
          <div className="erp-nav-group" role="group" aria-labelledby="nav-fav">
            <div className="erp-nav-heading">
              <span id="nav-fav">Favourites</span>
              {favourites.length > 1 ? (
                <button type="button" className="erp-linkbtn small" onClick={() => setManage(true)}>
                  Reorder
                </button>
              ) : null}
            </div>
            {favourites.length ? (
              favourites.map((f) => (
                <NavLink key={f.path} to={f.path} className={({ isActive }) => `erp-nav-item sub${isActive ? ' active' : ''}`}>
                  <PIcon name="star" filled size={14} className="erp-fav-star" />
                  <span className="erp-nav-label">{f.label}</span>
                </NavLink>
              ))
            ) : (
              <p className="erp-nav-empty">Pin pages with the star in their header.</p>
            )}
          </div>
          <div className="erp-nav-group" role="group" aria-labelledby="nav-recent">
            <div className="erp-nav-heading">
              <span id="nav-recent">Recent</span>
            </div>
            {recent.length ? (
              recent.map((f) => (
                <Link key={f.path} to={f.path} className="erp-nav-item sub">
                  <PIcon name="clock" size={14} />
                  <span className="erp-nav-label">{f.label}</span>
                </Link>
              ))
            ) : (
              <p className="erp-nav-empty">Pages you open appear here.</p>
            )}
          </div>
        </>
      )}
      <div className="erp-nav-sep" role="separator" />
      <div className="erp-nav-sections">
        {visible.map(({ section, pages, read, note }) =>
          icons ? (
            <Flyout key={section.id} icon={section.icon} label={section.label} active={current === section.id} items={pages.map((pg) => ({ to: `/${pg.path}`, label: pg.label, states: pg.state }))} />
          ) : (
            <div key={section.id} className={`erp-nav-section${openSec === section.id ? ' open' : ''}`}>
              <button type="button" className={`erp-nav-item erp-sec-btn${current === section.id ? ' current' : ''}`} aria-expanded={openSec === section.id} aria-controls={`sec-${section.id}`} onClick={() => setOpenSec(openSec === section.id ? null : section.id)}>
                <PIcon name={section.icon} />
                <span className="erp-nav-label">{section.label}</span>
                {read ? <span className="erp-read">Read</span> : note ? <span className="erp-read">{note}</span> : null}
                <PIcon name={openSec === section.id ? 'chevronDown' : 'chevronRight'} size={14} className="erp-chev" />
              </button>
              {openSec === section.id ? (
                <ul id={`sec-${section.id}`} className="erp-nav-pages">
                  {pages.map((pg) => (
                    <li key={pg.path}>
                      <NavLink to={`/${pg.path}`} className={({ isActive }) => `erp-nav-item sub${isActive || location.pathname.startsWith(`/${pg.path}/`) ? ' active' : ''}`}>
                        <span className="erp-nav-label">{pg.label}</span>
                        <StateBadges states={pg.state} compact />
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ),
        )}
      </div>
      <div className="erp-nav-foot">
        {!icons ? (
          <p className="erp-legend-states">
            <StateBadges states={['W']} compact /> Working <StateBadges states={['C']} compact /> Connected <StateBadges states={['P']} compact /> Planned
          </p>
        ) : null}
        {!phone ? (
          <button type="button" className="erp-nav-item erp-collapse" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand the sidebar' : 'Collapse the sidebar to icons'} aria-pressed={collapsed}>
            <PIcon name={collapsed ? 'chevronRight' : 'chevronLeft'} />
            <span className="erp-nav-label">Collapse</span>
          </button>
        ) : null}
      </div>
      {manage ? (
        <Modal title="Reorder favourites" onClose={() => setManage(false)}>
          <ol className="erp-fav-manage">
            {favourites.map((f, i) => (
              <li key={f.path}>
                <span className="grow">{f.label}</span>
                <button type="button" className="btn sm" disabled={i === 0} onClick={() => moveFavourite(f.path, -1)} aria-label={`Move ${f.label} up`}>
                  Up
                </button>
                <button type="button" className="btn sm" disabled={i === favourites.length - 1} onClick={() => moveFavourite(f.path, 1)} aria-label={`Move ${f.label} down`}>
                  Down
                </button>
                <button type="button" className="btn sm" onClick={() => toggleFavourite(f)} aria-label={`Unpin ${f.label}`}>
                  Unpin
                </button>
              </li>
            ))}
          </ol>
        </Modal>
      ) : null}
    </nav>
  );
}

/** In the icon sidebar, a section opens its pages in a small menu beside it. */
function Flyout({ icon, label, items, empty, active }: { icon: string; label: string; items: { to: string; label: string; states?: ('W' | 'C' | 'P')[] }[]; empty?: string; active?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (open) setTimeout(() => document.querySelector<HTMLElement>('.popover .erp-flyout-inner .menu-item')?.focus(), 0);
  }, [open]);
  return (
    <>
      <button ref={ref} type="button" className={`erp-nav-item${active ? ' current' : ''}`} aria-haspopup="menu" aria-expanded={open} aria-label={label} title={label} onClick={() => setOpen((o) => !o)}>
        <PIcon name={icon} />
      </button>
      {open ? (
        <FlyoutMenu anchor={ref} label={label} onClose={() => { setOpen(false); ref.current?.focus(); }}>
          <div className="menu-label">{label}</div>
          {items.length ? (
            items.map((it) => (
              <button
                key={it.to}
                type="button"
                role="menuitem"
                className="menu-item"
                onClick={() => {
                  setOpen(false);
                  navigate(it.to);
                }}
              >
                <span className="grow ellipsis">{it.label}</span>
                {it.states ? <StateBadges states={it.states} compact /> : null}
              </button>
            ))
          ) : (
            <p className="muted small erp-pad">{empty}</p>
          )}
        </FlyoutMenu>
      ) : null}
    </>
  );
}
function FlyoutMenu({ anchor, label, onClose, children }: { anchor: RefObject<HTMLButtonElement | null>; label: string; onClose: () => void; children: ReactNode }) {
  return (
    <Popover anchor={anchor} onClose={onClose} width={260} label={label}>
      <div className="erp-flyout-inner">{children}</div>
    </Popover>
  );
}

// ------------------------------------------------------------------ phone bottom bar

function BottomBar() {
  const { work, setNavOpen, navOpen } = useErp();
  const location = useLocation();
  const approvals = openWork(work).filter((w) => w.type === 'Approval').length;
  const is = (p: string, q?: string) => location.pathname === p && (!q || location.search.includes(q));
  return (
    <nav className="erp-bottombar" aria-label="Shortcuts">
      <Link to="/" className={is('/') ? 'active' : undefined} aria-current={is('/') ? 'page' : undefined}>
        <PIcon name="home" />
        <span>Home</span>
      </Link>
      <Link to="/my-work" className={is('/my-work') && !location.search.includes('approvals') ? 'active' : undefined}>
        <PIcon name="inbox" />
        <span>My Work</span>
        <span className="erp-bb-count" aria-label={`${openWork(work).length} open`}>
          {openWork(work).length}
        </span>
      </Link>
      <Link to="/inventory/scan" className={is('/inventory/scan') ? 'active' : undefined}>
        <PIcon name="scan" />
        <span>Scan</span>
      </Link>
      <Link to="/my-work?tab=approvals" className={is('/my-work', 'approvals') ? 'active' : undefined}>
        <PIcon name="signature" />
        <span>Approvals</span>
        {approvals ? (
          <span className="erp-bb-count" aria-label={`${approvals} waiting`}>
            {approvals}
          </span>
        ) : null}
      </Link>
      <button type="button" aria-expanded={navOpen} aria-controls="erp-sidebar" onClick={() => setNavOpen(!navOpen)}>
        <PIcon name="menu" />
        <span>More</span>
      </button>
    </nav>
  );
}

