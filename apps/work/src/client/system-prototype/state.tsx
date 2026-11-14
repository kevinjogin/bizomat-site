// The prototype's state: role, company, site, favourites, recent pages, sidebar, My Work, notifications and the
// changes made to demonstration records during the visit. Choices about the layout are kept on this computer
// (localStorage); record changes last for the visit only.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { applyTheme, storedTheme, type ThemePref } from '../lib/hooks';
import { COMPANIES } from './data/core';
import { NOTICES, WORK_ITEMS, type Notice, type WorkItem } from './data/work';
import { readStore, writeStore } from './format';
import type { RoleId, Row } from './types';

export interface PinnedPage {
  path: string;
  label: string;
}
interface Activity {
  at: string;
  who: string;
  text: string;
}

interface ErpState {
  role: RoleId;
  setRole: (r: RoleId) => void;
  companyId: string;
  setCompany: (id: string) => void;
  site: string;
  setSite: (s: string) => void;
  theme: ThemePref;
  setTheme: (t: ThemePref) => void;
  favourites: PinnedPage[];
  toggleFavourite: (p: PinnedPage) => void;
  moveFavourite: (path: string, by: number) => void;
  recent: PinnedPage[];
  pushRecent: (p: PinnedPage) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  work: WorkItem[];
  updateWork: (id: string, patch: Partial<WorkItem>) => void;
  notices: Notice[];
  markRead: (id?: string) => void;
  patches: Record<string, Partial<Row>>;
  patchRecord: (entity: string, id: string, patch: Partial<Row>) => void;
  created: Record<string, Row[]>;
  createRecord: (entity: string, row: Row) => void;
  comments: Record<string, Activity[]>;
  addComment: (entity: string, id: string, text: string) => void;
  highlight: string | null;
  setHighlight: (h: string | null) => void;
  journeyOpen: boolean;
  setJourneyOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  searchSeed: string;
  openSearch: (seed?: string) => void;
  noticesOpen: boolean;
  setNoticesOpen: (v: boolean) => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
}

const Ctx = createContext<ErpState | null>(null);

export function ErpProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>(() => readStore<RoleId>('role', 'ceo'));
  const [companyId, setCompanyState] = useState(() => readStore('company', COMPANIES[0].id));
  const [site, setSiteState] = useState(() => readStore('site', 'All sites'));
  const [theme, setThemeState] = useState<ThemePref>(() => storedTheme());
  const [favourites, setFavourites] = useState<PinnedPage[]>(() =>
    readStore('favourites', [
      { path: '/manufacturing/work-orders', label: 'Production orders' },
      { path: '/inventory/stock', label: 'Stock on hand' },
    ]),
  );
  const [recent, setRecent] = useState<PinnedPage[]>(() => readStore('recent', []));
  const [collapsed, setCollapsedState] = useState(() => readStore('collapsed', typeof window !== 'undefined' && window.innerWidth < 1200 && window.innerWidth > 760));
  const [work, setWork] = useState(WORK_ITEMS);
  const [notices, setNotices] = useState(NOTICES);
  const [patches, setPatches] = useState<Record<string, Partial<Row>>>({});
  const [created, setCreated] = useState<Record<string, Row[]>>({});
  const [comments, setComments] = useState<Record<string, Activity[]>>({});
  const [highlight, setHighlight] = useState<string | null>(null);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSeed, setSearchSeed] = useState('');
  const openSearch = useCallback((seed = '') => {
    setSearchSeed(seed);
    setSearchOpen(true);
  }, []);
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const setRole = useCallback((r: RoleId) => {
    setRoleState(r);
    writeStore('role', r);
  }, []);
  const setCompany = useCallback((id: string) => {
    setCompanyState(id);
    writeStore('company', id);
    setSiteState('All sites');
    writeStore('site', 'All sites');
  }, []);
  const setSite = useCallback((s: string) => {
    setSiteState(s);
    writeStore('site', s);
  }, []);
  const setTheme = useCallback((t: ThemePref) => {
    setThemeState(t);
    applyTheme(t, true);
  }, []);
  const toggleFavourite = useCallback((p: PinnedPage) => {
    setFavourites((list) => {
      const next = list.some((f) => f.path === p.path) ? list.filter((f) => f.path !== p.path) : [...list, p];
      writeStore('favourites', next);
      return next;
    });
  }, []);
  const moveFavourite = useCallback((path: string, by: number) => {
    setFavourites((list) => {
      const i = list.findIndex((f) => f.path === path);
      const j = i + by;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      writeStore('favourites', next);
      return next;
    });
  }, []);
  const pushRecent = useCallback((p: PinnedPage) => {
    setRecent((list) => {
      if (list[0]?.path === p.path) return list;
      const next = [p, ...list.filter((x) => x.path !== p.path)].slice(0, 5);
      writeStore('recent', next);
      return next;
    });
  }, []);
  const setCollapsed = useCallback((v: boolean) => {
    setCollapsedState(v);
    writeStore('collapsed', v);
  }, []);
  const updateWork = useCallback((id: string, patch: Partial<WorkItem>) => setWork((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x))), []);
  const markRead = useCallback((id?: string) => setNotices((list) => list.map((n) => (!id || n.id === id ? { ...n, read: true } : n))), []);
  const patchRecord = useCallback((entity: string, id: string, patch: Partial<Row>) => setPatches((m) => ({ ...m, [`${entity}:${id}`]: { ...m[`${entity}:${id}`], ...patch } })), []);
  const createRecord = useCallback((entity: string, row: Row) => setCreated((m) => ({ ...m, [entity]: [row, ...(m[entity] ?? [])] })), []);
  const addComment = useCallback(
    (entity: string, id: string, text: string) =>
      setComments((m) => ({ ...m, [`${entity}:${id}`]: [...(m[`${entity}:${id}`] ?? []), { at: new Date().toISOString().slice(0, 16), who: 'Alex Morgan', text }] })),
    [],
  );

  const value = useMemo<ErpState>(
    () => ({
      role,
      setRole,
      companyId,
      setCompany,
      site,
      setSite,
      theme,
      setTheme,
      favourites,
      toggleFavourite,
      moveFavourite,
      recent,
      pushRecent,
      collapsed,
      setCollapsed,
      work,
      updateWork,
      notices,
      markRead,
      patches,
      patchRecord,
      created,
      createRecord,
      comments,
      addComment,
      highlight,
      setHighlight,
      journeyOpen,
      setJourneyOpen,
      searchOpen,
      setSearchOpen,
      searchSeed,
      openSearch,
      noticesOpen,
      setNoticesOpen,
      navOpen,
      setNavOpen,
    }),
    [role, companyId, site, theme, favourites, recent, collapsed, work, notices, patches, created, comments, highlight, journeyOpen, searchOpen, searchSeed, noticesOpen, navOpen, openSearch, setRole, setCompany, setSite, setTheme, toggleFavourite, moveFavourite, pushRecent, setCollapsed, updateWork, markRead, patchRecord, createRecord, addComment],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useErp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useErp outside ErpProvider');
  return v;
}

export const company = (id: string) => COMPANIES.find((c) => c.id === id) ?? COMPANIES[0];
/** Open items in My Work: the count in the sidebar. */
export const openWork = (items: WorkItem[]) => items.filter((i) => ['Open', 'Waiting'].includes(i.status));
