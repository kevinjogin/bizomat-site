// Deals: the pipeline board (drag and drop between stages, into Won or Lost) and the list. Every move is saved on the
// server (one row changes: fractional positions) and recorded in the deal's stage history.
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { errorMessage, get, post } from '../lib/api';
import { useDebounced, useLocalState, usePageTitle } from '../lib/hooks';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ErrorBox, Loading, PageHeader, Spinner } from '../components/ui/ui';
import { Dropdown, MenuItem, useToast } from '../components/ui/overlays';
import type { DealDTO } from '../../shared/crm/types';
import { PRIORITIES } from '../../shared/crm/defaults';
import { RecordList } from './RecordList';
import { RecordFormDialog } from './RecordForm';
import { Chip, PersonChip, UserSelect } from './ui';
import { LostDialog } from './RecordPage';
import { crm, recordPath, shortDate, todayLocal, useCurrentOrg, useMoney, usePipelines, useRefreshOrg } from './lib';

export function DealsPage() {
  const [mode, setMode] = useLocalState<'board' | 'list'>('workos:crm:deals-mode', 'board');
  const toggle = (
    <div className="crm-seg" role="group" aria-label="Show deals as">
      <button className={`btn${mode === 'board' ? ' active' : ''}`} aria-pressed={mode === 'board'} onClick={() => setMode('board')}>
        <Icon name="kanban" /> Board
      </button>
      <button className={`btn${mode === 'list' ? ' active' : ''}`} aria-pressed={mode === 'list'} onClick={() => setMode('list')}>
        <Icon name="table" /> List
      </button>
    </div>
  );
  return mode === 'board' ? <DealBoard toggle={toggle} /> : <RecordList entity="deal" extraActions={toggle} />;
}

function DealBoard({ toggle }: { toggle: React.ReactNode }) {
  const org = useCurrentOrg();
  const { fmt } = useMoney();
  const toast = useToast();
  const refresh = useRefreshOrg();
  const pipelines = (usePipelines().data ?? []).filter((p) => !p.archived);
  const [params, setParams] = useSearchParams();
  const pipelineId = params.get('pipeline') ?? pipelines.find((p) => p.isDefault)?.id ?? pipelines[0]?.id;
  const pipeline = pipelines.find((p) => p.id === pipelineId);
  const [owner, setOwner] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState<string | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [losing, setLosing] = useState<string | null>(null);
  usePageTitle('Deals');
  const q = useDebounced(search, 250);
  const query = { filters: owner ? [{ field: 'ownerId', op: 'in', value: [owner] }] : [] };
  const board = useQuery({
    queryKey: ['crm', org.id, 'list', 'deal', 'board', pipelineId, JSON.stringify(query), q],
    queryFn: () => get<{ deals: DealDTO[]; total: number; truncated: boolean }>(`${crm(org.id, `/pipelines/${pipelineId}/board`)}?query=${encodeURIComponent(JSON.stringify(query))}&q=${encodeURIComponent(q)}`),
    enabled: !!pipelineId,
    placeholderData: keepPreviousData,
  });
  const [optimistic, setOptimistic] = useState<Record<string, { stageId: string; position: number } | 'gone'>>({});
  const deals = useMemo(() => {
    const list = (board.data?.deals ?? []).map((d) => {
      const o = optimistic[d.id];
      return o && o !== 'gone' ? { ...d, stageId: o.stageId, position: o.position } : d;
    });
    return list.filter((d) => optimistic[d.id] !== 'gone');
  }, [board.data, optimistic]);
  const byStage = (stageId: string) => deals.filter((d) => d.stageId === stageId).sort((a, b) => a.position - b.position);
  const today = todayLocal();

  const move = async (dealId: string, stageId: string, beforeId?: string | null) => {
    const col = byStage(stageId).filter((d) => d.id !== dealId);
    const idx = beforeId ? col.findIndex((d) => d.id === beforeId) : col.length;
    const above = idx > 0 ? col[idx - 1] : null;
    const below = idx >= 0 && idx < col.length ? col[idx] : null;
    const position = above && below ? (above.position + below.position) / 2 : above ? above.position + 1000 : below ? below.position - 1000 : 1000;
    setOptimistic((o) => ({ ...o, [dealId]: { stageId, position } }));
    try {
      await post(crm(org.id, `/deals/${dealId}/move`), { stageId, beforeId: above?.id ?? null, afterId: below?.id ?? null });
      await board.refetch();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setOptimistic((o) => {
        const { [dealId]: _gone, ...rest } = o;
        return rest;
      });
    }
  };
  const close = async (dealId: string, outcome: 'won' | 'lost', reason?: string) => {
    setOptimistic((o) => ({ ...o, [dealId]: 'gone' }));
    try {
      await post(crm(org.id, `/deals/${dealId}/close`), { outcome, reason });
      toast(outcome === 'won' ? 'Deal won' : 'Deal marked as lost');
      await refresh();
    } catch (e) {
      toast(errorMessage(e), 'error');
    } finally {
      setOptimistic((o) => {
        const { [dealId]: _gone, ...rest } = o;
        return rest;
      });
    }
  };
  const onDrop = (e: React.DragEvent, stageId: string, beforeId?: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData('application/x-crm-deal') || drag;
    setDrag(null);
    setOver(null);
    if (id) move(id, stageId, beforeId);
  };

  if (!pipelines.length) return <div className="page"><EmptyState icon="kanban" title="No pipeline yet">An administrator creates one in Settings.</EmptyState></div>;
  return (
    <div className="page full crm-board-page">
      <div className="crm-board-head">
        <PageHeader
          title="Deals"
          icon="dollar"
          subtitle={pipeline ? `${pipeline.name}: ${deals.length} open, ${fmt(deals.reduce((s, d) => s + d.value, 0))}, weighted ${fmt(deals.reduce((s, d) => s + d.weightedValue, 0))}` : undefined}
          actions={
            <>
              {toggle}
              {org.perms.deals.create ? (
                <button className="btn primary" onClick={() => setCreating(pipeline?.stages[0]?.id ?? '')}>
                  <Icon name="plus" /> New deal
                </button>
              ) : null}
            </>
          }
        />
        <div className="row wrap crm-toolbar">
          {pipelines.length > 1 ? (
            <select className="select" aria-label="Pipeline" value={pipelineId} onChange={(e) => setParams((p) => (p.set('pipeline', e.target.value), p))}>
              {pipelines.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          ) : null}
          <div className="crm-search">
            <Icon name="search" />
            <input className="input" type="search" placeholder="Search deals" aria-label="Search deals" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <UserSelect value={owner} onChange={setOwner} emptyLabel="All owners" ariaLabel="Owner" />
          {board.isFetching ? <Spinner /> : null}
          {board.data?.truncated ? <span className="muted small">Showing the first 1,000 deals: filter to see the rest.</span> : null}
        </div>
      </div>
      {board.error ? <ErrorBox error={board.error} retry={() => board.refetch()} /> : null}
      {!board.data ? (
        <Loading />
      ) : (
        <div className="kanban crm-kanban" aria-label="Pipeline board">
          {pipeline!.stages.map((s) => {
            const col = byStage(s.id);
            return (
              <section
                key={s.id}
                className={`lane${over === s.id ? ' drop-target' : ''}`}
                aria-label={`${s.name}: ${col.length} deals`}
                onDragOver={(e) => { if (drag) { e.preventDefault(); setOver(s.id); } }}
                onDragLeave={() => setOver((o) => (o === s.id ? null : o))}
                onDrop={(e) => onDrop(e, s.id)}
              >
                <header className="lane-head crm-lane-head">
                  <div className="grow">
                    <div className="row"><span className="ellipsis">{s.name}</span><span className="muted small">{s.probability}%</span></div>
                    <div className="muted small crm-lane-sum">{col.length} · {fmt(col.reduce((t, d) => t + d.value, 0), true)}</div>
                  </div>
                  {org.perms.deals.create ? <button className="btn ghost icon sm" aria-label={`New deal in ${s.name}`} onClick={() => setCreating(s.id)}><Icon name="plus" size={14} /></button> : null}
                </header>
                <div className="lane-body">
                  {col.map((d) => (
                    <article
                      key={d.id}
                      className={`kcard crm-deal-card${drag === d.id ? ' dragging' : ''}${d.flagged ? ' flagged' : ''}`}
                      draggable={d.can.edit}
                      onDragStart={(e) => { e.dataTransfer.setData('application/x-crm-deal', d.id); e.dataTransfer.effectAllowed = 'move'; setDrag(d.id); }}
                      onDragEnd={() => { setDrag(null); setOver(null); }}
                      onDragOver={(e) => drag && e.preventDefault()}
                      onDrop={(e) => onDrop(e, s.id, d.id)}
                    >
                      <div className="row">
                        <Link to={recordPath(org.id, 'deal', d.id)} className="crm-card-title grow">{d.title}</Link>
                        {d.can.edit ? (
                          <Dropdown align="end" label={`Move ${d.title}`} trigger={(open, ref) => <button ref={ref} className="btn ghost icon sm" aria-label={`Move ${d.title}`} onClick={open}><Icon name="moreV" size={14} /></button>}>
                            {(closeMenu) => (
                              <>
                                {pipeline!.stages.filter((x) => x.id !== d.stageId).map((x) => (
                                  <MenuItem key={x.id} icon="chevronRight" onClick={() => { closeMenu(); move(d.id, x.id); }}>Move to {x.name}</MenuItem>
                                ))}
                                <MenuItem icon="trophy" onClick={() => { closeMenu(); close(d.id, 'won'); }}>Won</MenuItem>
                                <MenuItem icon="x" onClick={() => { closeMenu(); setLosing(d.id); }}>Lost</MenuItem>
                              </>
                            )}
                          </Dropdown>
                        ) : null}
                      </div>
                      <div className="kmeta">
                        <strong className="crm-card-value">{fmt(d.value)}</strong>
                        {d.company ? <span className="ellipsis">{d.company.name}</span> : null}
                      </div>
                      <div className="kmeta">
                        <PersonChip id={d.ownerId} small />
                        {d.expectedCloseDate ? <span className={d.expectedCloseDate < today ? 'danger-text' : undefined}><Icon name="calendar" size={11} /> {shortDate(d.expectedCloseDate)}</span> : null}
                        {d.priority === 'high' || d.priority === 'urgent' ? <Chip list={PRIORITIES} value={d.priority} /> : null}
                        {d.flagged ? <span title={d.flagReason}><Icon name="flag" size={12} /> Flagged</span> : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
      {drag ? (
        <div className="crm-drop-zones" aria-hidden>
          <div className="crm-drop won" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('application/x-crm-deal') || drag; setDrag(null); if (id) close(id, 'won'); }}>
            <Icon name="trophy" /> Won
          </div>
          <div className="crm-drop lost" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const id = e.dataTransfer.getData('application/x-crm-deal') || drag; setDrag(null); if (id) setLosing(id); }}>
            <Icon name="x" /> Lost
          </div>
        </div>
      ) : null}
      {losing ? <LostDialog onClose={() => setLosing(null)} onLost={(r) => { const id = losing; setLosing(null); close(id, 'lost', r); }} /> : null}
      {creating !== null ? <RecordFormDialog entity="deal" initial={{ pipelineId, stageId: creating || undefined }} onClose={() => setCreating(null)} onSaved={() => board.refetch()} /> : null}
    </div>
  );
}
