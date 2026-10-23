// Deterministic SEO decision engine. It never edits the site: it turns verified data into proposals with
// evidence, a hypothesis, risk, tests and a rollback plan. Technical defects are blocked at build time by the
// SEO gate (scripts/seo/validate.mjs); everything here that would change wording or structure needs review.

// Minimum evidence before any proposal. Low-traffic pages are noisy, so small samples are ignored.
export const THRESHOLDS = {
  ctrMinImpressions: 200, // over the window, per page
  ctrMaxPosition: 10, // only pages already shown on page one on average
  ctrRelative: 0.5, // CTR below half the site's own median for the same position band
  strikingMinImpressions: 50, // per query–page pair
  strikingPositions: [4, 20],
  declineMinPriorClicks: 20,
  declineDrop: 0.3, // 30% fewer clicks than the previous equal window
  cannibalShare: 0.2, // each of two or more pages takes at least 20% of a query's impressions
  cannibalMinImpressions: 100,
};

/** Sum rows by a key into { key, clicks, impressions, ctr, position } with impression-weighted position. */
export function aggregate(rows, keyFn) {
  const map = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    const a = map.get(k) ?? { key: k, clicks: 0, impressions: 0, posWeighted: 0 };
    a.clicks += r.clicks;
    a.impressions += r.impressions;
    a.posWeighted += r.position * r.impressions;
    map.set(k, a);
  }
  return [...map.values()].map(({ posWeighted, ...a }) => ({ ...a, ctr: a.impressions ? a.clicks / a.impressions : 0, position: a.impressions ? posWeighted / a.impressions : null }));
}

const band = (position) => (position <= 3 ? '1-3' : position <= 6 ? '4-6' : position <= 10 ? '7-10' : '11+');
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : null;
};

const proposal = (fields) => ({
  status: 'proposed',
  approval: 'review', // nothing in this engine is auto-applied
  rollback: 'Revert the commit that made the change; the previous state is recorded above.',
  ...fields,
});

/**
 * analyse({ rows, priorRows, inventory }) → { proposals, alerts, stats }
 * rows / priorRows: Search Console rows for the current and previous equal windows.
 * inventory: url-inventory pages ({ path, url, title, description, section }).
 */
export function analyse({ rows = [], priorRows = [], inventory = [] } = {}, t = THRESHOLDS) {
  const proposals = [];
  const alerts = [];
  const pages = new Map(inventory.map((p) => [p.url, p]));
  const byPage = aggregate(rows, (r) => r.page);

  // 1. Page-one pages with unusually low CTR for their position band: title and description review.
  const bandCtrs = {};
  for (const p of byPage) if (p.impressions >= t.ctrMinImpressions && p.position != null) (bandCtrs[band(p.position)] ??= []).push(p.ctr);
  for (const p of byPage) {
    if (p.impressions < t.ctrMinImpressions || p.position == null || p.position > t.ctrMaxPosition) continue;
    const m = median(bandCtrs[band(p.position)] ?? []);
    if (m == null || (bandCtrs[band(p.position)]?.length ?? 0) < 3 || p.ctr >= m * t.ctrRelative) continue;
    const page = pages.get(p.key);
    proposals.push(proposal({
      type: 'ctr-review',
      url: p.key,
      evidence: { impressions: p.impressions, clicks: p.clicks, ctr: +p.ctr.toFixed(4), averagePosition: +p.position.toFixed(1), siteMedianCtrForBand: +m.toFixed(4) },
      previousState: { title: page?.title ?? 'UNKNOWN', description: page?.description ?? 'UNKNOWN' },
      proposedState: 'Rewrite the title and description to match the main queries for this page, without changing the H1 or URL.',
      intent: 'Match the snippet to what searchers on this page are looking for.',
      hypothesis: 'A snippet that better matches the queries could raise CTR towards the site median for this position band.',
      risk: 'medium',
      tests: ['SEO gate passes', 'Title under about 60 characters, description 120–160', 'Compare 28-day CTR at the same position band after at least four weeks'],
    }));
  }

  // 2. Striking distance: queries where a page averages positions 4–20 with real impressions.
  const pairs = aggregate(rows, (r) => `${r.query}\u0000${r.page}`);
  for (const q of pairs) {
    const [query, url] = q.key.split('\u0000');
    if (q.impressions < t.strikingMinImpressions || q.position == null || q.position < t.strikingPositions[0] || q.position > t.strikingPositions[1]) continue;
    proposals.push(proposal({
      type: 'striking-distance',
      url,
      query,
      evidence: { impressions: q.impressions, clicks: q.clicks, averagePosition: +q.position.toFixed(1) },
      previousState: { title: pages.get(url)?.title ?? 'UNKNOWN' },
      proposedState: 'Review whether the page fully answers this query; consider a clearer section, internal links from related pages, or an updated example.',
      intent: query,
      hypothesis: 'More complete, better-linked content for this query could improve its average position over several weeks.',
      risk: 'low',
      tests: ['SEO gate passes', 'Content reviewed for accuracy', 'Track this query–page pair for at least four weeks'],
    }));
  }

  // 3. Cannibalisation: one query split across several pages.
  const byQuery = new Map();
  for (const r of rows) (byQuery.get(r.query) ?? byQuery.set(r.query, []).get(r.query)).push(r);
  for (const [query, qrows] of byQuery) {
    const total = qrows.reduce((s, r) => s + r.impressions, 0);
    if (total < t.cannibalMinImpressions) continue;
    const competing = aggregate(qrows, (r) => r.page).filter((p) => p.impressions / total >= t.cannibalShare);
    if (competing.length < 2) continue;
    proposals.push(proposal({
      type: 'cannibalisation',
      url: competing[0].key,
      query,
      evidence: { totalImpressions: total, pages: competing.map((p) => ({ url: p.key, impressions: p.impressions, position: +(p.position ?? 0).toFixed(1) })) },
      previousState: 'Several pages compete for the same query.',
      proposedState: 'Choose one page as the main answer for this intent and link to it from the others; do not merge or remove pages without review.',
      intent: query,
      hypothesis: 'One clearly preferred page may rank more consistently than several partial answers.',
      risk: 'medium',
      tests: ['SEO gate passes', 'Internal links checked', 'Compare query impressions per page after four weeks'],
    }));
  }

  // 4. Declines against the previous equal window.
  if (priorRows.length) {
    const prior = new Map(aggregate(priorRows, (r) => r.page).map((p) => [p.key, p]));
    for (const p of byPage) {
      const before = prior.get(p.key);
      if (!before || before.clicks < t.declineMinPriorClicks) continue;
      const drop = 1 - p.clicks / before.clicks;
      if (drop >= t.declineDrop) alerts.push({ type: 'click-decline', url: p.key, previousClicks: before.clicks, currentClicks: p.clicks, drop: +drop.toFixed(2), note: 'Check for seasonality, indexing problems or a recent change before acting.' });
    }
  }

  const totals = aggregate(rows, () => 'all')[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: null };
  proposals.sort((a, b) => (b.evidence.impressions ?? b.evidence.totalImpressions ?? 0) - (a.evidence.impressions ?? a.evidence.totalImpressions ?? 0));
  return { proposals, alerts, stats: { rows: rows.length, clicks: totals.clicks, impressions: totals.impressions, ctr: totals.ctr, averagePosition: totals.position } };
}
