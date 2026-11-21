// The ERP alerts bell in the top bar: the person's alerts in the company being worked in (erp_alerts, through
// GET /api/erp/c/:company/x/alerts), with the unread count; opening one marks it read and follows its link inside the ERP.
// It shows only where the person has Maintenance in that company (the maintenance /me answers), because Maintenance's
// alerts are what it was added for; the modules framework's alerts of the same company show in it too. Guests, and a
// company whose Maintenance is switched off, get no bell. It asks again every minute.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { get, post } from '../lib/api';
import { timeAgo } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { Popover } from '../components/ui/overlays';
import { useMtMe } from './maintenance/api';

interface ErpAlert {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string;
  at: number;
  read: boolean;
}

const short = (s: string) => (s.length > 140 ? `${s.slice(0, 139)}…` : s);

export function AlertsBell({ companyId }: { companyId?: string }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const mt = useMtMe(companyId ?? '');
  const key = ['system', 'alerts', companyId];
  const path = `/erp/c/${encodeURIComponent(companyId ?? '')}/x/alerts`;
  const q = useQuery({ queryKey: key, queryFn: () => get<{ alerts: ErpAlert[]; unread: number }>(path), enabled: !!companyId && !!mt.data, refetchInterval: 60_000, staleTime: 30_000, retry: false });
  if (!companyId || !mt.data || q.error) return null;
  const unread = q.data?.unread ?? 0;
  const refresh = () => qc.invalidateQueries({ queryKey: key });
  const readAll = async () => {
    await post(`${path}/read`, { all: true }).catch(() => null);
    await refresh();
  };
  const openAlert = async (a: ErpAlert) => {
    setOpen(false);
    if (!a.read) await post(`${path}/read`, { ids: [a.id] }).catch(() => null);
    void refresh();
    if (a.link.startsWith('/c/')) navigate(a.link);
  };
  return (
    <>
      <button ref={setAnchor} className="btn ghost icon crm-bell" aria-label={`Alerts${unread ? `, ${unread} unread` : ''}`} aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((o) => !o)}>
        <Icon name="bell" />
        {unread ? <span className="crm-bell-count" aria-hidden>{unread > 99 ? '99+' : unread}</span> : null}
      </button>
      {open && anchor ? (
        <Popover anchor={anchor} onClose={() => setOpen(false)} align="end" width={360} role="dialog" label="Alerts">
          <div className="row crm-pop-head">
            <strong className="grow">Alerts</strong>
            {unread ? <button className="btn ghost sm" onClick={readAll}>Mark all read</button> : null}
          </div>
          <div className="crm-notif-list">
            {!q.data ? <p className="muted small crm-pad">Loading…</p> : null}
            {(q.data?.alerts ?? []).map((a) => (
              <button key={a.id} className={`crm-notif${a.read ? '' : ' unread'}`} onClick={() => void openAlert(a)}>
                <span className="crm-notif-title">{a.title}</span>
                {a.body ? <span className="muted small">{short(a.body)}</span> : null}
                <span className="muted small">{timeAgo(a.at)}</span>
              </button>
            ))}
            {q.data && !q.data.alerts.length ? <p className="muted small crm-pad">No alerts yet.</p> : null}
          </div>
          <div className="crm-pop-foot muted">The 50 newest alerts in this company.</div>
        </Popover>
      ) : null}
    </>
  );
}
