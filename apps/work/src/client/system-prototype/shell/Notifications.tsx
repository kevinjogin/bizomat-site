// The notification centre: a drawer with unread state, All and Unread filters and "Mark all as read". On a phone it
// fills the screen; the full page is /notifications.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fmtDateTime } from '../format';
import { Drawer, Empty, ModuleBadge, Tabs } from '../kit';
import type { Notice } from '../data/work';
import { useErp } from '../state';

export function NoticeList({ items, onOpen }: { items: Notice[]; onOpen: (n: Notice) => void }) {
  if (!items.length) return <Empty icon="bell" title="You are up to date">New approvals, mentions and alerts appear here.</Empty>;
  return (
    <ul className="erp-notices">
      {items.map((n) => (
        <li key={n.id}>
          <button type="button" className={`erp-notice${n.read ? '' : ' unread'}`} onClick={() => onOpen(n)}>
            {!n.read ? <span className="erp-dot" aria-hidden /> : <span className="erp-dot-space" aria-hidden />}
            <span className="grow">
              <span className="erp-notice-title">
                {!n.read ? <span className="sr-only">Unread: </span> : null}
                {n.title}
              </span>
              <span className="erp-notice-body">{n.body}</span>
              <span className="erp-notice-meta">
                <ModuleBadge module={n.module} /> {fmtDateTime(n.at)}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function NotificationsDrawer() {
  const { notices, markRead, setNoticesOpen } = useErp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const unread = notices.filter((n) => !n.read).length;
  const items = tab === 'unread' ? notices.filter((n) => !n.read) : notices;
  const close = () => setNoticesOpen(false);
  return (
    <Drawer
      title="Notifications"
      onClose={close}
      footer={
        <>
          <Link to="/notifications" onClick={close} className="btn sm">
            Open the full page
          </Link>
          <span className="spacer" />
          <button type="button" className="btn sm" disabled={!unread} onClick={() => markRead()}>
            Mark all as read
          </button>
        </>
      }
    >
      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: notices.length },
          { id: 'unread', label: 'Unread', count: unread },
        ]}
        active={tab}
        onChange={setTab}
        label="Notification filter"
      />
      <NoticeList
        items={items}
        onOpen={(n) => {
          markRead(n.id);
          close();
          navigate(n.to);
        }}
      />
    </Drawer>
  );
}
