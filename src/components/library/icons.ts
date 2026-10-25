// Simple 24 × 24 stroke icons for library topic cards (drawn with currentColor, no fills).
export const LIBRARY_ICONS = {
  compass: 'M12 3v3M12 6l-5 14M12 6l5 14M8.6 15.5h6.8M12 6a1.5 1.5 0 1 0 0-.01',
  factory: 'M3 20V10l5 3V10l5 3V10l5 3V4h3v16H3ZM7 17h2M12 17h2M17 17h1',
  gear: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1',
  drop: 'M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11ZM9.5 15a2.5 2.5 0 0 0 2.5 2.5',
  check: 'M12 3l7 3v5c0 4.4-3 8.2-7 10-4-1.8-7-5.6-7-10V6l7-3ZM8.5 12l2.5 2.5 4.5-5',
  wrench: 'M14.5 5.5a4 4 0 0 0 5 5L11 19a2.1 2.1 0 0 1-3-3l8.5-8.5a4 4 0 0 0-2-2Z',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  briefcase: 'M3 8h18v11H3V8ZM9 8V5h6v3M3 13h18',
  ruler: 'M3 16 16 3l5 5L8 21l-5-5ZM7 12l2 2M10 9l2 2M13 6l2 2',
  flow: 'M4 6h6v4H4V6ZM14 14h6v4h-6v-4ZM10 8h4v8M14 8h3',
  chip: 'M7 7h10v10H7V7ZM10 10h4v4h-4v-4ZM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4',
  box: 'M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3ZM4 7.5l8 4.5 8-4.5M12 12v9',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z',
  book: 'M4 4.5A1.5 1.5 0 0 1 5.5 3H20v15H5.5A1.5 1.5 0 0 0 4 19.5v-15ZM4 19.5A1.5 1.5 0 0 0 5.5 21H20M8 7h8',
} as const;

export type LibraryIconName = keyof typeof LIBRARY_ICONS;
