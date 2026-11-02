// KEVOS® calculations: Projects.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'project-health': {
      const sv = val('scheduleVar'), cv = val('costVar');
      const sch = Math.max(0, 100 - Math.max(0, sv) * 2), cost = Math.max(0, 100 - Math.max(0, cv) * 2);
      const score = sch * 0.2 + cost * 0.2 + (val('scope') / 5) * 20 + ((6 - val('risk')) / 5) * 20 + (val('resource') / 5) * 20;
      const st = status(score, 'HEALTHY', 'AT RISK', 'CRITICAL');
      const dims = [['Schedule', sch], ['Cost', cost], ['Scope stability', (val('scope') / 5) * 100], ['Risk', ((6 - val('risk')) / 5) * 100], ['Resources', (val('resource') / 5) * 100]].sort((a, b) => a[1] - b[1]);
      const sev = (v) => (v > 20 ? 'fail' : v > 10 ? 'warn' : 'pass');
      return result(st.text, st.tone, `Overall health ${num(score, 0)}/100. Weakest area: ${dims[0][0].toLowerCase()}.`,
        [m('Schedule signal', `${num(sch, 0)}/100`), m('Cost signal', `${num(cost, 0)}/100`), m('Risk', `${val('risk')}/5`), m('Resources', `${val('resource')}/5`)],
        score < 70 ? `Focus the next review on ${dims[0][0].toLowerCase()} and agree a named recovery action.` : 'Signals are broadly healthy; keep monitoring leading indicators, not only outcomes.',
        {
          primary: primary('Health score', score),
          checks: [
            check('Schedule variance', sev(sv), `${pct(sv)} (positive = behind plan).`),
            check('Cost variance', sev(cv), `${pct(cv)} (positive = over budget).`),
            check('Scope stable', val('scope') <= 2 ? 'warn' : 'pass', `Scope stability ${val('scope')}/5.`),
            check('Resources adequate', val('resource') <= 2 ? 'warn' : 'pass', `Resource adequacy ${val('resource')}/5.`),
            check('Variances from controlled data', 'verify', 'Use earned-value or baseline-controlled figures, not estimates from memory.'),
          ],
          actions: ['Agree recovery actions with owners and dates for any REVIEW or FAIL item.', 'Re-run the check at each reporting period to see the trend.'],
        });
    }
    case 'project-size': {
      const score = Math.min(val('budget') / 500000, 1) * 30 + Math.min(val('months') / 18, 1) * 20 + Math.min(val('stakeholders') / 10, 1) * 20 + (val('complexity') / 5) * 30;
      const txt = score < 35 ? 'SMALL' : score < 65 ? 'MEDIUM' : 'MAJOR';
      return result(txt, score < 35 ? 'good' : score < 65 ? 'warn' : 'bad', `Scale score ${num(score, 0)}/100.`,
        [m('Budget', money(val('budget'))), m('Duration', `${num(val('months'), 1)} months`), m('Stakeholder groups', num(val('stakeholders'), 0)), m('Complexity', `${val('complexity')}/5`)],
        'Match governance, reporting and assurance to the project’s size and complexity.',
        {
          primary: primary('Scale score', score),
          table: { caption: 'Indicative governance by size', head: ['Size', 'Governance', 'Reporting'], rows: [['Small', 'Sponsor and project lead; one-page plan', 'Fortnightly status'], ['Medium', 'Steering group; documented scope, schedule, risk register', 'Weekly status, monthly steering'], ['Major', 'Formal board, gates, independent assurance, change control', 'Weekly status, earned value, gate reviews']] },
          checks: [
            check('Scaling thresholds suit your organisation', 'verify', 'The A$500k and 18-month saturation points are screening defaults; replace with your own thresholds.'),
            check('Complexity drives risk', val('complexity') >= 4 ? 'warn' : 'pass', `Technical complexity ${val('complexity')}/5.`),
          ],
          actions: ['Set up the governance level indicated before detailed planning.'],
        });
    }
    case 'resource-fit': {
      const cap = val('people') * val('hoursPerson'), util = (val('required') / Math.max(1, cap)) * 100;
      return result(util <= 85 ? 'COMFORTABLE' : util <= 100 ? 'TIGHT' : 'OVERLOADED', utilTone(util), `Required effort uses ${pct(util)} of the available hours.`,
        [m('Required', `${num(val('required'), 0)} hr`), m('Available', `${num(cap, 0)} hr`), m('Utilisation', pct(util)), m('Buffer', `${num(cap - val('required'), 0)} hr`)],
        util > 100 ? 'Reduce scope, extend time or add capacity before committing.' : util > 85 ? 'There is little buffer for rework, leave or unplanned tasks.' : 'There is a reasonable planning buffer.',
        {
          primary: primary('Utilisation', util, 'pct'),
          checks: [
            check('Capacity covers required effort', util <= 100 ? (util <= 85 ? 'pass' : 'warn') : 'fail', `${pct(util)} utilisation.`),
            check('Available hours are net', 'verify', 'Exclude leave, meetings, support work and other projects from available hours.'),
          ],
          actions: ['Plan at no more than about 85% utilisation to absorb variation.', 'Confirm skills match the work, not only total hours.'],
        });
    }
    case 'schedule-risk': {
      const perDay = val('people') * val('hoursDay') * (val('efficiency') / 100);
      const cap = perDay * val('days'), ratio = (cap / Math.max(1, val('work'))) * 100, need = perDay > 0 ? val('work') / perDay : Infinity;
      return result(ratio >= 115 ? 'LOW DELIVERY RISK' : ratio >= 100 ? 'TIGHT' : 'HIGH DELIVERY RISK', ratio >= 115 ? 'good' : ratio >= 100 ? 'warn' : 'bad', `Productive capacity is ${pct(ratio)} of the remaining work; about ${Number.isFinite(need) ? num(need, 1) : '—'} working days are needed.`,
        [m('Remaining work', `${num(val('work'), 0)} hr`), m('Productive capacity', `${num(cap, 0)} hr`), m('Coverage', pct(ratio)), m('Days needed', Number.isFinite(need) ? `${num(need, 1)} days` : '—'), m('Days available', `${num(val('days'), 0)} days`), m('Buffer', `${num(cap - val('work'), 0)} hr`)],
        ratio < 100 ? 'The plan cannot absorb the remaining work without changing scope, resources, productivity or the date.' : ratio < 115 ? 'The date is possible but has limited contingency.' : 'The plan has a reasonable capacity buffer.',
        {
          primary: primary('Capacity coverage', ratio, 'pct'),
          checks: [
            check('Capacity covers remaining work', ratio >= 115 ? 'pass' : ratio >= 100 ? 'warn' : 'fail', `${pct(ratio)} coverage.`),
            check('Planning efficiency realistic', val('efficiency') > 90 ? 'warn' : 'pass', `${pct(val('efficiency'))} of hours assumed productive.`),
            check('Remaining work estimate current', 'verify', 'Re-estimate remaining work bottom-up rather than budget minus spent.'),
            check('Task dependencies', 'verify', 'Capacity coverage ignores sequencing; check the critical path separately.'),
          ],
          actions: ['If coverage is below 115%, agree which lever (scope, people, hours or date) will change.', 'Track remaining work weekly to see whether the gap is closing.'],
        });
    }
    case 'contingency': {
      const p = (val('uncertainty') + val('complexity') + val('risk')) / 15, rate = 5 + p * 20, amt = (val('base') * rate) / 100;
      return result(`${num(rate, 1)}% CONTINGENCY`, rate <= 15 ? 'good' : 'warn', `Indicative contingency allowance ${money(amt)} on a base of ${money(val('base'))}.`,
        [m('Base cost', money(val('base'))), m('Contingency rate', pct(rate)), m('Allowance', money(amt)), m('Total incl. contingency', money(val('base') + amt))],
        'A screening allowance only; quantified risk analysis or your estimating standard should set the final contingency.',
        {
          primary: primary('Contingency allowance', amt, 'money'),
          checks: [
            check('Screening method only', 'verify', 'The 9–25% range comes from three 1–5 ratings, not a quantified risk model.'),
            check('Large or uncertain project', val('base') >= 1000000 || val('uncertainty') >= 4 ? 'warn' : 'pass', 'Projects that are large or poorly defined should use range estimating or Monte Carlo analysis.'),
            check('Known risks costed separately', 'verify', 'Do not double-count risks that already carry their own budget allowances.'),
          ],
          actions: ['Record what the contingency covers and who can release it.', 'Reassess at each project gate as uncertainty reduces.'],
        });
    }
    case 'business-case': {
      const inv = val('investment'), years = Math.max(1, Math.round(val('years'))), rate = val('discountRate');
      const annual = val('benefit') - val('annualCost'), life = annual * years - inv;
      const npv = npvLevel(rate, inv, annual, years), down = npvLevel(rate, inv, val('benefit') * 0.8 - val('annualCost'), years);
      const pay = annual > 0 ? inv / annual : Infinity, dpay = annual > 0 ? discountedPayback(rate, inv, annual, years) : Infinity;
      const txt = npv > 0 && down > 0 ? 'STRONG CASE' : npv > 0 ? 'POSITIVE, SENSITIVE' : 'WEAK CASE', tone = npv > 0 && down > 0 ? 'good' : npv > 0 ? 'warn' : 'bad';
      return result(txt, tone, `NPV ${money(npv)} over ${years} years at ${pct(rate)}. With benefits 20% lower, NPV is ${money(down)}.`,
        [m('Annual net benefit', money(annual)), m('Simple payback', Number.isFinite(pay) ? `${num(pay, 2)} years` : '—'), m('Discounted payback', Number.isFinite(dpay) ? `${num(dpay, 2)} years` : 'Not within period'), m('Undiscounted net value', money(life)), m('NPV', money(npv)), m('Downside NPV (benefit −20%)', money(down))],
        tone === 'good' ? 'The case remains positive under a 20% benefit shortfall; confirm benefit ownership and delivery risk.' : tone === 'warn' ? 'The case is positive but depends on achieving most of the benefit; strengthen the evidence before approval.' : 'The case does not return the discount rate; redesign, phase or reconsider the investment.',
        {
          primary: primary('Net present value', npv, 'money'),
          checks: [
            check('NPV positive at the approved rate', npv > 0 ? 'pass' : 'fail', money(npv)),
            check('Robust to a 20% benefit shortfall', down > 0 ? 'pass' : 'warn', `Downside NPV ${money(down)}.`),
            check('Delivery risk', val('risk') >= 4 ? 'warn' : 'pass', `Delivery risk ${val('risk')}/5${val('risk') >= 4 ? ': add a quantified risk allowance or staged approval.' : '.'}`),
            check('Discount rate', rate > 0 ? 'pass' : 'warn', rate > 0 ? `${pct(rate)} (confirm it is your organisation’s approved rate).` : 'A 0% rate ignores the time value of money.'),
            check('Tax, financing and residual value', 'verify', 'Excluded here; include them with your finance team for a formal case.'),
          ],
          actions: ['Name an owner for each benefit and how it will be measured.', 'Compare at least one alternative, including doing nothing.', 'Use the sensitivity table to find the assumption that matters most.'],
        });
    }
  }
  return null;
});
