// Report section K, Categories: one entry per board group (a category) with its description and the state of its
// tasks at the end of the reporting period. Built from the same task rows as the rest of the report, so its counts
// add up to the overview's. Financial totals are included only when the report includes the financial summary
// (section H), which already requires the person generating the report to be allowed to see the project's finances:
// a report is then marked as containing financial data and is shown only to people who may see it.

import type { FinanceSummary } from '../../../shared/finance';
import { isHexColor } from '../../../shared/workspace-colors';
import type { GroupRow } from '../mappers';
import type { TaskRow } from './build';

export interface CategoryFinanceTotal {
  columnId: string;
  column: string;
  role: string | null;
  currency: string | null;
  /** Decimal string at the currency's minor unit. */
  amount: string;
  display: string;
  /** Tasks in the category with an amount in this column. */
  count: number;
}

export interface CategoryRow {
  groupId: string;
  name: string;
  color: string;
  description: string;
  total: number;
  completed: number;
  inProgress: number;
  /** Not completed: in progress, not started, blocked or awaiting approval. */
  outstanding: number;
  overdue: number;
  /** Everyone assigned to at least one of the category's tasks, by name. */
  owners: string[];
  unassigned: number;
  /** Per financial column (each in its own currency), or null when the report has no financial data. */
  finance: CategoryFinanceTotal[] | null;
}

export interface CategorySection {
  rows: CategoryRow[];
  financeIncluded: boolean;
  note: string;
}

export function buildCategorySection(input: {
  groups: GroupRow[];
  /** The report's tasks at the end of the period (top-level, not archived), with the group each is in. */
  tasks: { groupId: string; row: TaskRow }[];
  /** The last millisecond of the period. */
  end: number;
  /** The report's financial summary, or null when the report has none. */
  finance: FinanceSummary | null;
}): CategorySection {
  const byGroup = new Map<string, TaskRow[]>();
  for (const t of input.tasks) byGroup.set(t.groupId, [...(byGroup.get(t.groupId) ?? []), t.row]);
  const groups = input.groups
    .filter((g) => (g.archived_at == null || g.archived_at > input.end) && (g.created_at <= input.end || byGroup.has(g.id)))
    .sort((a, b) => a.position - b.position);
  const finCols = new Map((input.finance?.columns ?? []).map((c) => [c.columnId, c]));
  const rows: CategoryRow[] = groups.map((g) => {
    const tasks = byGroup.get(g.id) ?? [];
    const open = tasks.filter((t) => t.statusClass !== 'done');
    const owners = Array.from(new Set(tasks.flatMap((t) => t.owners))).sort((a, b) => a.localeCompare(b));
    const fin = input.finance?.groups.find((x) => x.groupId === g.id);
    return {
      groupId: g.id,
      name: g.name,
      color: isHexColor(g.color) ? g.color : '#64748b',
      description: g.description ?? '',
      total: tasks.length,
      completed: tasks.length - open.length,
      inProgress: tasks.filter((t) => t.statusClass === 'in_progress').length,
      outstanding: open.length,
      overdue: open.filter((t) => t.overdue).length,
      owners,
      unassigned: tasks.filter((t) => !t.owners.length).length,
      finance: input.finance
        ? (fin?.totals ?? []).map((t) => {
            const col = finCols.get(t.columnId);
            return { columnId: t.columnId, column: col?.title ?? '', role: col?.roleLabel ?? null, currency: t.total.currency, amount: t.total.amount, display: t.total.display, count: t.count };
          })
        : null,
    };
  });
  return {
    rows,
    financeIncluded: !!input.finance,
    note:
      'Each category is a group on the board. Tasks are counted in the group they are in today, with their status, owners and dates as recorded at the end of the period; every task is counted, whatever the list filters. Descriptions are as written on the board when the report was generated.' +
      (input.finance ? ' Amounts are summed per financial column, each in its own currency; different currencies are never added together.' : ''),
  };
}
