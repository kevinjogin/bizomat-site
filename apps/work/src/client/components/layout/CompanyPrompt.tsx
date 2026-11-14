// In Project Management, the CRM and Finance: a short prompt for people who are not in a company yet (owner,
// 13 Nov 2026: "access as company, not as individual"). It links to registration in the company area. Their work keeps
// working as it is; the prompt can be put away for this browser session.
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../../lib/api';
import '../../styles/company.css';
import { toolUrl } from '../../lib/base';

const KEY = 'bizomat:company-prompt-hidden';

export function CompanyPrompt() {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  });
  const q = useQuery({ queryKey: ['company', 'mine'], queryFn: () => get<{ companies: unknown[]; invitations: unknown[] }>('/company/mine'), staleTime: 5 * 60_000, retry: false, enabled: !hidden });
  if (hidden || !q.data || q.data.companies.length) return null;
  const invited = q.data.invitations.length > 0;
  return (
    <div className="co-prompt" role="note">
      <p>
        {invited
          ? 'You have an invitation to join a company on BIZOMAT. Open it to work with its people, departments and tools on this same sign-in.'
          : 'BIZOMAT works as a company. Register your business, or yourself if you work in your own name, to bring your people, departments, Project Management, CRM and Finance together.'}
      </p>
      <a className="btn primary sm" href={toolUrl(invited ? '/company/' : '/company/new')}>
        {invited ? 'See the invitation' : 'Register your company'}
      </a>
      <button
        className="btn ghost sm"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(KEY, '1');
          } catch {
            /* ignore */
          }
        }}
      >
        Not now
      </button>
    </div>
  );
}
