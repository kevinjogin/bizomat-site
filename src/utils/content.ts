/** A date as the site writes it (Sydney time): "8 November 2026", or "8 Nov 2026" with style 'short'. */
export const formatDate = (date: Date, style: 'long' | 'short' = 'long') =>
  date.toLocaleDateString('en-AU', { day: 'numeric', month: style === 'long' ? 'long' : 'short', year: 'numeric', timeZone: 'Australia/Sydney' });
