// Global search (keyboard "/"): results as you type, grouped by type with module badges and status, Enter opens the
// top result, arrow keys move, and recent searches are kept on this computer (information architecture, section 7).
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { readStore, writeStore } from '../format';
import { PIcon } from '../icons';
import { ModuleBadge, StatusBadge } from '../kit';
import { ENTITY_PATH } from '../links';
import { PAGES } from '../nav';
import { ENTITIES } from '../registry';
import { useErp } from '../state';
import type { ModuleId } from '../types';

const SCOPES = ['Everything', 'Customers', 'Contacts', 'Opportunities', 'Quotes', 'Invoices', 'Products', 'Purchase orders', 'Work orders', 'Projects', 'Tasks', 'Documents'];
const ORDER = ['customer', 'contact', 'opportunity', 'quote', 'salesOrder', 'invoice', 'product', 'purchaseOrder', 'workOrder', 'receipt', 'inspection', 'ncr', 'project', 'task', 'supplier', 'drawing', 'certificate', 'bom', 'eco', 'requisition'];

interface Hit {
  key: string;
  group: string;
  id: string;
  title: string;
  sub?: string;
  status?: string;
  module: ModuleId;
  to: string;
  score: number;
}

function search(q: string, scope: string, patches: Record<string, any>): Hit[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const hits: Hit[] = [];
  ORDER.forEach((k) => {
    const e = ENTITIES[k];
    if (!e) return;
    if (scope !== 'Everything' && e.scope !== scope) return;
    e.rows.forEach((base) => {
      const r = { ...base, ...patches[`${k}:${base.id}`] };
      const title = e.title(r);
      const hay = `${r.id} ${title} ${r.customer ?? ''} ${r.supplier ?? ''} ${r.name ?? ''}`.toLowerCase();
      if (!hay.includes(s)) return;
      const score = r.id.toLowerCase() === s ? 0 : r.id.toLowerCase().startsWith(s) ? 1 : title.toLowerCase().startsWith(s) ? 2 : 3;
      hits.push({ key: `${k}:${r.id}`, group: e.plural, id: r.id, title, sub: e.subtitle?.(r), status: r.status ?? r.stage, module: e.module, to: `/${ENTITY_PATH[k]}/${r.id}`, score });
    });
  });
  if (scope === 'Everything')
    PAGES.filter((p) => p.label.toLowerCase().includes(s)).forEach((p) => hits.push({ key: `page:${p.path}`, group: 'Pages', id: p.label, title: `Go to ${p.label}`, module: p.module, to: `/${p.path}`, score: 4 }));
  // Group in a stable order; within a group the best match first; at most six per group.
  const groups = Array.from(new Set(hits.map((h) => h.group)));
  const firstScore = (g: string) => Math.min(...hits.filter((h) => h.group === g).map((h) => h.score));
  groups.sort((a, b) => firstScore(a) - firstScore(b));
  return groups.flatMap((g) =>
    hits
      .filter((h) => h.group === g)
      .sort((a, b) => a.score - b.score)
      .slice(0, 6),
  );
}

export function SearchDialog() {
  const { setSearchOpen, patches, searchSeed } = useErp();
  const navigate = useNavigate();
  const [q, setQ] = useState(searchSeed);
  const [scope, setScope] = useState('Everything');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>(() => readStore('searches', ['WO-1042', 'Coastline']));
  const input = useRef<HTMLInputElement>(null);
  const hits = useMemo(() => search(q, scope, patches), [q, scope, patches]);
  const close = () => setSearchOpen(false);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    input.current?.focus();
    return () => prev?.focus?.();
  }, []);
  useEffect(() => setActive(0), [q, scope]);
  const open = (h: Hit) => {
    const next = [q.trim(), ...recent.filter((x) => x.toLowerCase() !== q.trim().toLowerCase())].filter(Boolean).slice(0, 6);
    setRecent(next);
    writeStore('searches', next);
    close();
    navigate(h.to);
  };
  let lastGroup = '';
  return createPortal(
    <div className="overlay erp-search-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div
        className="modal wide erp-search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search everything"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.stopPropagation();
            close();
          }
          if (e.key === 'Tab') {
            const f = e.currentTarget.querySelectorAll<HTMLElement>('input, select, button');
            if (e.shiftKey && document.activeElement === f[0]) {
              e.preventDefault();
              f[f.length - 1].focus();
            } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
              e.preventDefault();
              f[0].focus();
            }
          }
        }}
      >
        <div className="erp-search-bar">
          <PIcon name="search" />
          <label htmlFor="erp-search-input" className="sr-only">
            Search everything
          </label>
          <input
            ref={input}
            id="erp-search-input"
            className="erp-search-input"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls="erp-search-results"
            aria-activedescendant={hits[active] ? `sr-${active}` : undefined}
            aria-autocomplete="list"
            placeholder="Search customers, orders, products, people…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(hits.length - 1, a + 1));
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(0, a - 1));
              }
              if (e.key === 'Enter' && hits[active]) {
                e.preventDefault();
                open(hits[active]);
              }
            }}
            autoComplete="off"
          />
          <label htmlFor="erp-search-scope" className="sr-only">
            Search in
          </label>
          <select id="erp-search-scope" className="select sm erp-scope" value={scope} onChange={(e) => setScope(e.target.value)}>
            {SCOPES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button type="button" className="btn ghost icon sm" onClick={close} aria-label="Close search">
            <PIcon name="x" />
          </button>
        </div>
        <div className="erp-search-body">
          {!q.trim() ? (
            <div>
              <h2 className="menu-label">Recent searches</h2>
              {recent.length ? (
                <ul className="erp-recent-searches">
                  {recent.map((r) => (
                    <li key={r}>
                      <button type="button" className="menu-item" onClick={() => setQ(r)}>
                        <PIcon name="history" size={14} /> {r}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted small">None yet.</p>
              )}
              <p className="muted small erp-search-tip">
                Try “Harbour”, “PO-0388” or “steel”. Press <kbd>Enter</kbd> to open the top result.
              </p>
            </div>
          ) : hits.length ? (
            <ul id="erp-search-results" role="listbox" aria-label="Results" className="erp-results">
              {hits.map((h, i) => {
                const head = h.group !== lastGroup;
                lastGroup = h.group;
                return (
                  <li key={h.key} role="presentation">
                    {head ? (
                      <div className="menu-label erp-result-group" role="presentation">
                        {h.group}
                      </div>
                    ) : null}
                    <div
                      id={`sr-${i}`}
                      role="option"
                      aria-selected={i === active}
                      className={`erp-result${i === active ? ' active' : ''}`}
                      onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => open(h)}
                      data-hl={`result-${h.id}`}
                    >
                      <span className="erp-result-main">
                        <span className="erp-result-title">
                          {h.group !== 'Pages' ? <span className="erp-id">{h.id}</span> : null} {h.title}
                        </span>
                        {h.sub ? <span className="muted small">{h.sub}</span> : null}
                      </span>
                      {h.status ? <StatusBadge status={h.status} /> : null}
                      <ModuleBadge module={h.module} />
                      {i === 0 ? <kbd className="erp-enter">Enter</kbd> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted erp-noresults">
              No results for “{q}” in {scope.toLowerCase()}.
            </p>
          )}
        </div>
        <div className="erp-search-foot muted small">Each module answers from its own data and permissions. In the prototype, demonstration data only.</div>
      </div>
    </div>,
    document.body,
  );
}
