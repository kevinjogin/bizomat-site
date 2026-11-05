import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { ViewType } from '../../../shared/types';
import type { BoardViewProps } from '../types';
import { TableView } from '../TableView';

/**
 * View registry. Adding a new view type = add an entry here (plus the type in
 * shared/types ViewType and the server's VIEW_TYPES). All views share the same
 * BoardViewProps contract and data.
 */
export const VIEW_REGISTRY: Record<ViewType, { label: string; icon: string; component: ComponentType<BoardViewProps> | LazyExoticComponent<ComponentType<BoardViewProps>> }> = {
  table: { label: 'Table', icon: 'table', component: TableView },
  kanban: { label: 'Kanban', icon: 'kanban', component: lazy(() => import('./KanbanView').then((m) => ({ default: m.KanbanView }))) },
  calendar: { label: 'Calendar', icon: 'calendar', component: lazy(() => import('./CalendarView').then((m) => ({ default: m.CalendarView }))) },
  timeline: { label: 'Timeline / Gantt', icon: 'timeline', component: lazy(() => import('./TimelineView').then((m) => ({ default: m.TimelineView }))) },
  chart: { label: 'Chart', icon: 'chart', component: lazy(() => import('./ChartView').then((m) => ({ default: m.ChartView }))) },
  workload: { label: 'Workload', icon: 'workload', component: lazy(() => import('./WorkloadView').then((m) => ({ default: m.WorkloadView }))) },
  form: { label: 'Form', icon: 'form', component: lazy(() => import('./FormView').then((m) => ({ default: m.FormView }))) },
  map: { label: 'Map', icon: 'map', component: lazy(() => import('./MapView').then((m) => ({ default: m.MapView }))) },
  files: { label: 'Files', icon: 'paperclip', component: lazy(() => import('./FilesView').then((m) => ({ default: m.FilesView }))) },
};
