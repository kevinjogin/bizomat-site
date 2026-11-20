// The company a person is working in, shared by the ERP and every tool inside it (owner, 20 Nov 2026: "when logged in
// to that particular company all tools should link or auto select that company"). The ERP remembers the company last
// opened on this computer; the module rail and My Work then open that company's own Project Management workspace, CRM
// and Finance, never whichever one was used last. A company without one of the tools falls back to the tool's own home.
// The server still decides who may open what.
import { useQuery } from '@tanstack/react-query';
import { get } from './api';

export const COMPANY_KEY = 'bizomat-system-company';

export function currentCompany(): string | null {
  try {
    return localStorage.getItem(COMPANY_KEY);
  } catch {
    return null;
  }
}

export function setCurrentCompany(id: string): void {
  try {
    localStorage.setItem(COMPANY_KEY, id);
  } catch {
    /* private mode */
  }
}

export type ToolApp = 'tasks' | 'crm' | 'finance';
export interface CompanyToolPaths {
  tasks?: string;
  crm?: string;
  finance?: string;
  myWork?: string;
}

/** Where each tool of the current company opens, as paths inside the ERP ('/crm/o/<id>/overview'). */
export function useCompanyToolPaths(enabled = true): CompanyToolPaths {
  const id = currentCompany();
  const q = useQuery({
    queryKey: ['system', 'company-tools', id],
    queryFn: () => get<{ tools: { app: string; id: string }[] }>(`/system/companies/${encodeURIComponent(id!)}`),
    enabled: enabled && !!id,
    staleTime: 60_000,
    retry: false,
  });
  const out: CompanyToolPaths = {};
  for (const t of q.data?.tools ?? []) {
    const tid = encodeURIComponent(t.id);
    if (t.app === 'tasks' && !out.tasks) {
      out.tasks = `/tasks/w/${tid}/home`;
      out.myWork = `/tasks/w/${tid}/my-work`;
    } else if (t.app === 'crm' && !out.crm) out.crm = `/crm/o/${tid}/overview`;
    else if (t.app === 'finance' && !out.finance) out.finance = `/finance/o/${tid}/dashboard`;
  }
  return out;
}
