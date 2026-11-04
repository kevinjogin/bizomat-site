import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin, useRange } from '../api';
import { Card, Empty, Kpi, PageIntro, Percent, QueryState, RangeSelect, TableWrap, When, fmtDate, num } from '../ui';

interface Stage {
  key: string;
  label: string;
  count: number;
  note?: string;
  conversionFromPrevious: number | null;
  conversionFromRegistered: number | null;
}
interface BriefUser {
  id: string;
  name: string;
  email: string;
  registeredAt: number;
  lastActiveAt: number | null;
  projects: number;
  tasks: number;
  activeDays: number;
}
interface AdoptionResp {
  range: string;
  from: string;
  stages: Stage[];
  segments: Record<'registeredNoProject' | 'projectNoTasks' | 'notReturned' | 'consistentlyActive' | 'stoppedUsing', BriefUser[]>;
  definitions: Record<string, string>;
  medianTimeToFirstProjectMs: number | null;
}

const SEGMENTS: { key: keyof AdoptionResp['segments']; label: string; def: string }[] = [
  { key: 'registeredNoProject', label: 'No project yet', def: 'Registered but has not created a project.' },
  { key: 'projectNoTasks', label: 'Project, no tasks', def: 'Created a project but no tasks.' },
  { key: 'notReturned', label: 'Not returned', def: '' },
  { key: 'consistentlyActive', label: 'Consistently active', def: '' },
  { key: 'stoppedUsing', label: 'Stopped using', def: '' },
];

function duration(ms: number | null) {
  if (ms == null) return '—';
  const m = ms / 60_000;
  if (m < 60) return `${Math.max(1, Math.round(m))} min`;
  const h = m / 60;
  if (h < 48) return `${Math.round(h * 10) / 10} h`;
  return `${Math.round((h / 24) * 10) / 10} days`;
}

export default function Adoption() {
  const [range, setRange] = useRange();
  const q = useAdmin<AdoptionResp>(`/adoption?range=${range}`);
  const [seg, setSeg] = useState<keyof AdoptionResp['segments']>('registeredNoProject');
  return (
    <div className="ac-stack">
      <PageIntro actions={<RangeSelect value={range} onChange={setRange} />}>
        <p className="muted">Where new users get stuck: the journey of everyone who registered in the selected period.</p>
      </PageIntro>
      <QueryState q={q}>
        {() => {
          const d = q.data!;
          const registered = d.stages.find((s) => s.key === 'registered')?.count ?? 0;
          const max = Math.max(1, ...d.stages.map((s) => s.count));
          const list = d.segments[seg];
          const segDef = SEGMENTS.find((s) => s.key === seg)!;
          return (
            <>
              <div className="ac-kpis four">
                <Kpi label="Registered in period" value={registered} tone="brand" hint={`since ${fmtDate(Date.parse(d.from))}`} />
                <Kpi label="Reached first project" value={d.stages.find((s) => s.key === 'project')?.count} hint={<Percent value={d.stages.find((s) => s.key === 'project')?.conversionFromRegistered} />} />
                <Kpi label="Came back on a later day" value={d.stages.find((s) => s.key === 'returned')?.count} tone="success" hint={<Percent value={d.stages.find((s) => s.key === 'returned')?.conversionFromRegistered} />} />
                <Kpi label="Median time to first project" value={null} text={duration(d.medianTimeToFirstProjectMs)} hint="from registration" />
              </div>
              <Card title="Activation funnel" subtitle="Each bar is the number of users who reached that step. Percentages are of registered users and of the previous step.">
                <ol className="ac-funnel">
                  {d.stages.map((s, i) => (
                    <li key={s.key} className={s.key === 'visited' ? 'visits' : ''}>
                      <div className="ac-funnel-label">
                        <span className="ac-step">{i + 1}</span>
                        <span>
                          <b>{s.label}</b>
                          {s.note ? <span className="muted small ac-funnel-note">{s.note}</span> : null}
                        </span>
                      </div>
                      <div className="ac-funnel-bar">
                        <span style={{ width: `${(s.count / max) * 100}%` }} />
                      </div>
                      <div className="ac-funnel-nums">
                        <b>{num(s.count)}</b>
                        {s.key !== 'visited' && s.key !== 'registered' ? (
                          <span className="muted small">
                            <Percent value={s.conversionFromRegistered} /> of registered{s.conversionFromPrevious != null ? <> · <Percent value={s.conversionFromPrevious} /> of previous</> : null}
                          </span>
                        ) : s.key === 'visited' ? (
                          <span className="muted small">page views</span>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
              <Card title="Segments" subtitle="Who to follow up with.">
                <div className="ac-tabs" role="tablist">
                  {SEGMENTS.map((s) => (
                    <button key={s.key} role="tab" aria-selected={seg === s.key} className={seg === s.key ? 'on' : ''} onClick={() => setSeg(s.key)}>
                      {s.label} <span className="ac-tab-count">{num(d.segments[s.key].length)}</span>
                    </button>
                  ))}
                </div>
                <p className="muted small">{segDef.def || d.definitions[seg] || ''}</p>
                {list.length ? (
                  <TableWrap label={segDef.label}>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Registered</th>
                        <th>Last activity</th>
                        <th className="num">Active days</th>
                        <th className="num">Projects</th>
                        <th className="num">Tasks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <Link to={`/admin/users/${u.id}`} className="ac-user-cell">
                              <span className="ac-user-name">{u.email}</span>
                              <span className="muted small">{u.name}</span>
                            </Link>
                          </td>
                          <td>{fmtDate(u.registeredAt)}</td>
                          <td><When ts={u.lastActiveAt} /></td>
                          <td className="num">{num(u.activeDays)}</td>
                          <td className="num">{num(u.projects)}</td>
                          <td className="num">{num(u.tasks)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                ) : (
                  <Empty>Nobody in this segment.</Empty>
                )}
              </Card>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
