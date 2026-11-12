// One task on its own: for people who were given access to this task but not to its project (an external contractor
// on one maintenance job). Project members are sent to the task on its board.

import { useCallback, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { BoardBundle } from '../../shared/types';
import { ApiError, get } from '../lib/api';
import { usePageTitle } from '../lib/hooks';
import { useWorkspace } from '../lib/session';
import { EmptyState, ErrorBox, Loading, PageHeader } from '../components/ui/ui';
import { ItemPanel } from '../board/ItemPanel';
import { useBoardActions, useComputedItems } from '../board/useBoard';

type Context = BoardBundle & { projectAccess: boolean };

export default function TaskPage() {
  const { itemId } = useParams();
  const ws = useWorkspace();
  const navigate = useNavigate();
  const first = useQuery({ queryKey: ['task-context', itemId], queryFn: () => get<Context>(`/items/${itemId}/context`), retry: false });
  const boardId = first.data?.board.id;
  // The board's own query key, filled from this task's context, so the board actions (edits, refreshes) work here.
  const ctxQuery = useQuery({ queryKey: ['board', boardId], queryFn: () => get<Context>(`/items/${itemId}/context`), enabled: !!boardId && first.data?.projectAccess === false, initialData: first.data });
  const bundle = ctxQuery.data ?? first.data;
  const actions = useBoardActions(boardId ?? 'none');
  const nameMap = useMemo(() => new Map((bundle?.members ?? []).map((m) => [m.id, m.name])), [bundle?.members]);
  const memberName = useCallback((id: string) => nameMap.get(id), [nameMap]);
  const computed = useComputedItems(bundle, memberName);
  usePageTitle(bundle?.items.find((i) => i.id === itemId)?.name);

  if (first.isLoading) return <Loading label="Opening the task…" />;
  if (first.error) {
    const status = first.error instanceof ApiError ? first.error.status : 0;
    return <div className="page">{status === 404 ? <EmptyState icon="lock" title="Task not found">It may have been deleted, or it is no longer shared with you.</EmptyState> : <ErrorBox error={first.error} retry={() => first.refetch()} />}</div>;
  }
  if (!bundle) return null;
  if (bundle.projectAccess) return <Navigate to={`/w/${ws.id}/boards/${bundle.board.id}?item=${itemId}`} replace />;
  return (
    <div className="page">
      <PageHeader icon="lock" title="Shared task" subtitle={`${bundle.board.name}: you can see this task, not the rest of the project.`} />
      <ItemPanel
        itemId={itemId!}
        bundle={bundle}
        computedItems={computed}
        actions={actions}
        canEdit={!bundle.board.archivedAt}
        onClose={() => navigate(`/w/${ws.id}/my-work`)}
        onOpen={(id) => navigate(`/w/${ws.id}/tasks/${id}`)}
        members={bundle.members}
        memberName={memberName}
      />
    </div>
  );
}
