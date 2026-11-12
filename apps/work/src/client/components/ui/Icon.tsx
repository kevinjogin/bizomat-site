import { ARROW_PATH, BRAND_COLORS, B_PATH, MARK_RADIUS, MARK_SIZE, MARK_TRANSFORM, WORDMARK_PATH, WORDMARK_VIEWBOX } from '../../lib/bizomat-brand';
import { BRAND } from '../../lib/brand';

// Original line icon set (24x24 grid, 1.8 stroke).
const PATHS: Record<string, string> = {
  home: 'M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
  check: 'M5 12.5 10 17 19 7',
  checkSquare: 'M4 4h16v16H4zM8 12l3 3 5-6',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z',
  inbox: 'M4 13l2.5-8h11L20 13M4 13v6h16v-6M4 13h5l1 2h4l1-2h5',
  bell: 'M6 16V11a6 6 0 1 1 12 0v5l2 2H4l2-2ZM10 20a2 2 0 0 0 4 0',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17.5l9 5 9-5',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 12h.01',
  template: 'M4 4h16v5H4zM4 13h7v7H4zM15 13h5v7h-5z',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  plug: 'M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0V7ZM12 16v5',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
  plus: 'M12 5v14M5 12h14',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.5h.01',
  droplet: 'M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21a7 7 0 0 1 14 0M16 3.5a4 4 0 0 1 0 7.5M22 21a7 7 0 0 0-4-6.3',
  x: 'M6 6l12 12M18 6 6 18',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  chevronLeft: 'M15 6l-6 6 6 6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  moreV: 'M12 5h.01M12 12h.01M12 19h.01',
  drag: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  archive: 'M3 4h18v4H3zM5 8v12h14V8M10 12h4',
  restore: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  edit: 'M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5Z',
  sort: 'M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  eyeOff: 'M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.8M6.3 6.3C3.6 8 2 12 2 12s3.5 7 10 7c1.8 0 3.4-.5 4.7-1.3M9.9 9.9a3 3 0 0 0 4.2 4.2',
  group: 'M4 6h16M4 12h10M4 18h6',
  table: 'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14',
  kanban: 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  timeline: 'M4 6h9M8 12h10M6 18h8M4 3v18',
  workload: 'M4 20h16M6 16V9M10 16V5M14 16v-4M18 16V7',
  form: 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2ZM9 4v14M15 6v14',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4',
  paperclip: 'M20 11.5 12 19.5a5 5 0 0 1-7-7l8.5-8.5a3.5 3.5 0 0 1 5 5L10 17.5a2 2 0 0 1-3-3l7.5-7.5',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  message: 'M4 5h16v11H8l-4 4V5Z',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  menu: 'M4 6h16M4 12h16M4 18h16',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11',
  play: 'M7 4l13 8-13 8V4Z',
  stop: 'M6 6h12v12H6z',
  download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
  upload: 'M12 20V8M7 13l5-5 5 5M4 4h16',
  lock: 'M6 11h12v10H6zM8 11V7a4 4 0 1 1 8 0v4',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z',
  key: 'M14 10a4 4 0 1 0-3.5 4L8 16.5V19H5.5v-2.5L10 12M15 9h.01',
  bold: 'M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z',
  italic: 'M10 4h8M6 20h8M14 4 10 20',
  strike: 'M4 12h16M16 6a4 4 0 0 0-4-2c-2.5 0-4 1.3-4 3s1.5 2.4 4 3M8 18a4 4 0 0 0 4 2c2.5 0 4-1.3 4-3',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  listOrdered: 'M10 6h10M10 12h10M10 18h10M4 4v4M3 18h3l-3 3h3M3 12a1.5 1.5 0 1 1 3 0L3 15h3',
  quote: 'M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6',
  image: 'M4 4h16v16H4zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM20 15l-5-5L5 20',
  undo: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
  redo: 'M15 14l5-5-5-5M20 9H9a5 5 0 0 0 0 10h3',
  history: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5M12 8v4l3 2',
  share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  flag: 'M5 21V4M5 4h12l-2 4 2 4H5',
  diamond: 'M12 3l9 9-9 9-9-9 9-9Z',
  subitem: 'M6 4v10a2 2 0 0 0 2 2h10M14 12l4 4-4 4',
  pin: 'M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  keyboard: 'M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10',
  refresh: 'M20 11a8 8 0 0 0-14.3-4.9L4 8M4 4v4h4M4 13a8 8 0 0 0 14.3 4.9L20 16M20 20v-4h-4',
  folder: 'M3 6h6l2 2h10v11H3z',
  hash: 'M5 9h14M5 15h14M10 3 8 21M16 3l-2 18',
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 16, className, title }: { name: IconName | string; size?: number; className?: string; title?: string }) {
  const d = PATHS[name] ?? PATHS.grid;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      style={{ flex: 'none' }}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}

// ------------------------------------------------------------------ BIZOMAT brand
// Geometry comes from the generated bizomat-brand.ts (shared/brand/build.mjs); nothing here is hand-drawn.

const box = (viewBox: string) => viewBox.split(' ').map(Number) as [number, number, number, number];
const [, , WORD_W, WORD_H] = box(WORDMARK_VIEWBOX);

/** The BIZOMAT mark: the B on a navy rounded tile with the teal forward arrow (the app icon and favicon). */
export function BrandMark({ size = 26, title }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${MARK_SIZE} ${MARK_SIZE}`} className="brand-mark" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <rect width={MARK_SIZE} height={MARK_SIZE} rx={MARK_RADIUS} fill={BRAND_COLORS.navy} />
      <g transform={MARK_TRANSFORM}>
        <path fill="#ffffff" fillRule="evenodd" d={B_PATH} />
        <path fill={BRAND_COLORS.tealMark} d={ARROW_PATH} />
      </g>
    </svg>
  );
}

/**
 * The BIZOMAT wordmark. The word follows CSS (`--brand-ink`: navy on light, white on dark); the forward arrow in the B
 * is teal (`--brand-bar`). `height` is the drawing's height in pixels.
 */
export function Wordmark({ height = 16, className }: { height?: number; className?: string }) {
  return (
    <svg
      className={`wordmark${className ? ` ${className}` : ''}`}
      viewBox={WORDMARK_VIEWBOX}
      height={height}
      width={Math.round((height * WORD_W) / WORD_H)}
      role="img"
      aria-label={BRAND.platform}
      focusable="false"
    >
      <path className="wordmark-word" fillRule="evenodd" d={WORDMARK_PATH} />
      <path className="wordmark-bar" d={ARROW_PATH} />
    </svg>
  );
}

/** Product lockup: the BIZOMAT wordmark with the product name beneath it ("Project Management"). */
export function ProductLockup({ height = 15, className }: { height?: number; className?: string }) {
  return (
    <span className={`lockup${className ? ` ${className}` : ''}`}>
      <Wordmark height={height} />
      <span className="lockup-product" style={{ fontSize: Math.max(10, Math.round(height * 0.62 * 2) / 2) }}>
        {BRAND.product}
      </span>
    </span>
  );
}
