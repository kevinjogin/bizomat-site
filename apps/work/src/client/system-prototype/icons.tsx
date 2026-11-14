// Icons of the System prototype: the app's own line icon set (components/ui/Icon.tsx) plus a few drawn here for the
// operations modules, on the same 24 x 24 grid and 1.8 stroke.
import { Icon } from '../components/ui/Icon';

const EXTRA: Record<string, string> = {
  chevronUp: 'M6 15l6-6 6 6',
  truck: 'M2 6h11v10H2zM13 9h4l4 4v3h-8M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  box: 'M12 3 3 7.5v9L12 21l9-4.5v-9L12 3ZM3 7.5l9 4.5 9-4.5M12 12v9',
  factory: 'M3 21V10l5 3V10l5 3V10l5 3V4h3v17H3ZM7 17h2M12 17h2M17 17h2',
  wrench: 'M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6Z',
  scan: 'M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 9v6M10 9v6M13 9v6M16 9v6',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  clipboard: 'M9 3h6v3H9zM9 4.5H6V21h12V4.5h-3M9 13l2 2 4-4',
  alert: 'M12 3 2 20h20L12 3ZM12 10v4.5M12 17.5h.01',
  cart: 'M3 4h2l2.5 11h11L21 7H6.5M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  gauge: 'M4 18a8 8 0 1 1 16 0M12 18l4-6',
  route: 'M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 16V9a3 3 0 0 1 3-3h7M18 8v7a3 3 0 0 1-3 3H8',
  returnArrow: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  warehouse: 'M3 9l9-5 9 5v11H3V9ZM7 20v-7h10v7M7 16h10',
  tree: 'M5 4h5v4H5zM14 10h5v4h-5zM14 17h5v4h-5zM7.5 8v11h6.5M7.5 12h6.5',
  compare: 'M8 4v16M16 4v16M4 8h4M16 16h4M4 14h4M16 10h4',
  pencilRuler: 'M4 20 15 9l-4-4L4 12v8ZM14 4l6 6M17 14l3 3-3 3-3-3',
  signature: 'M3 17c3-1 4-9 6-9s1 8 3 8 2-4 4-4 2 3 5 3M3 21h18',
  thumbsUp: 'M7 11v9H4v-9h3ZM7 11l4-7c1.5 0 2.5 1 2.2 2.6L12.5 10H19a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 17.8 20H7',
};

/** An icon by name. `filled` fills the shape (a pinned star). */
export function PIcon({ name, size = 16, className, filled, label }: { name: string; size?: number; className?: string; filled?: boolean; label?: string }) {
  const d = EXTRA[name];
  if (!d && !filled) return <Icon name={name} size={size} className={className} title={label} />;
  const path = d ?? STAR;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`erp-icon${className ? ` ${className}` : ''}`}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}
const STAR = 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z';
