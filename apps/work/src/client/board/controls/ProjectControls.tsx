import type { BoardBundle } from '../../../shared/types';
import { Modal } from '../../components/ui/overlays';

export default function ProjectControls({ bundle, onClose }: { bundle: BoardBundle; onClose: () => void; onOpenItem: (id: string) => void }) {
  return (
    <Modal title={`Project controls · ${bundle.board.name}`} onClose={onClose} xl>
      <p className="muted">Loading…</p>
    </Modal>
  );
}
