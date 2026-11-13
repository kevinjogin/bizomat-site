// Lead score: an explainable 0-100 figure from what is known about the lead and how engaged it is. Recalculated on
// every change to the lead and its activities, unless someone set the score by hand (score_locked).

export interface ScoreInput {
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  website: string;
  estimatedValue: number | null;
  source: string;
  statusKind: string;
  status: string;
  /** Completed activities on the lead. */
  doneActivities: number;
  /** The organisation's high-value threshold (minor units). */
  highValue: number;
}

export interface ScorePart {
  label: string;
  points: number;
}

const WARM_SOURCES = new Set(['referral', 'partner', 'existing']);

export function leadScore(l: ScoreInput): { score: number; parts: ScorePart[] } {
  const parts: ScorePart[] = [];
  const add = (cond: unknown, label: string, points: number) => {
    if (cond) parts.push({ label, points });
  };
  add(l.email, 'Email address known', 10);
  add(l.phone, 'Phone number known', 10);
  add(l.companyName, 'Company known', 10);
  add(l.jobTitle, 'Job title known', 5);
  add(l.website, 'Website known', 5);
  add((l.estimatedValue ?? 0) > 0, 'Estimated value given', 10);
  add(l.highValue > 0 && (l.estimatedValue ?? 0) >= l.highValue, 'High estimated value', 10);
  add(WARM_SOURCES.has(l.source), 'Warm source (referral, partner or existing customer)', 10);
  if (l.doneActivities > 0) parts.push({ label: `${l.doneActivities} completed ${l.doneActivities === 1 ? 'activity' : 'activities'}`, points: Math.min(20, l.doneActivities * 5) });
  add(l.status === 'engaged', 'Engaged', 10);
  add(l.statusKind === 'qualified' || l.statusKind === 'converted', 'Qualified', 20);
  let score = parts.reduce((s, p) => s + p.points, 0);
  if (l.statusKind === 'unqualified') {
    parts.push({ label: 'Unqualified', points: -score });
    score = 0;
  }
  return { score: Math.max(0, Math.min(100, score)), parts };
}
