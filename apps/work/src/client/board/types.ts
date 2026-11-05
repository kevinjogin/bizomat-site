import type { BoardAccess, BoardBundle, ColumnDTO, ItemDTO, MemberDTO, ViewDTO, ViewSettings } from '../../shared/types';
import type { BoardActions } from './useBoard';

/**
 * Contract every board view implements. Views receive the SAME shared data:
 * `items` are the top-level items after the active view's filters/sort/search
 * (computed values included); `allItems` contains everything (incl. subitems).
 */
export interface BoardViewProps {
  bundle: BoardBundle;
  view: ViewDTO;
  items: ItemDTO[];
  allItems: ItemDTO[];
  columns: ColumnDTO[]; // visible columns for this view, in order
  members: MemberDTO[];
  access: BoardAccess;
  canEdit: boolean;
  actions: BoardActions;
  openItem: (itemId: string) => void;
  updateViewSettings: (patch: Partial<ViewSettings>) => void;
  memberName: (id: string) => string | undefined;
}
