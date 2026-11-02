// KEVOS® calculations: Business.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'hire-outsource': {
      const emp = val('salary') * (1 + val('oncost') / 100) + val('hiring'), out = val('hours') * val('contractor'), diff = out - emp, hire = diff >= 0;
      const beHours = val('contractor') > 0 ? emp / val('contractor') : Infinity;
      return result(hire ? 'HIRE' : 'OUTSOURCE', hire ? 'good' : 'warn', `${hire ? 'Employment' : 'Outsourcing'} is cheaper by ${money(Math.abs(diff))} for ${num(val('hours'), 0)} hours of work in the first year.`,
        [m('Employee first-year cost', money(emp)), m('Outsource annual cost', money(out)), m('Difference', money(Math.abs(diff))), m('Break-even workload', Number.isFinite(beHours) ? `${num(beHours, 0)} hr/year` : '—')],
        'Cost is one factor; also weigh flexibility, knowledge retention, management load, employment obligations, availability and quality.',
        {
          primary: primary('Annual difference (outsource − employ)', diff, 'money'),
          checks: [
            check('Decision robust to workload', Number.isFinite(beHours) && Math.abs(val('hours') - beHours) / Math.max(1, val('hours')) >= 0.2 ? 'pass' : 'warn', `Preference changes at about ${Number.isFinite(beHours) ? num(beHours, 0) : '—'} hours a year.`),
            check('One employee can deliver the workload', 'verify', 'Compare the workload with one person’s productive hours after leave and non-project time.'),
            check('Employment on-costs complete', 'verify', 'Include superannuation, leave, payroll tax, insurance, equipment and management time.'),
            check('Contractor classification', 'verify', 'Check employment-law and tax rules on contractor engagement for ongoing work.'),
          ],
          actions: ['Re-run with the second-year cost (without hiring cost) for an ongoing comparison.'],
        });
    }
    case 'subscription-value': {
      const value = val('hours') * val('hourValue') + val('extra'), net = value - val('monthly'), ratio = value / Math.max(0.01, val('monthly'));
      return result(net >= 0 ? 'KEEP / REVIEW VALUE' : 'CANCEL / RENEGOTIATE', net >= 0 ? 'good' : 'warn', `Estimated net monthly value ${money(net)} (${num(ratio, 2)}× its cost).`,
        [m('Monthly cost', money(val('monthly'))), m('Estimated value', money(value)), m('Net value / month', money(net)), m('Net value / year', money(net * 12)), m('Value / cost', `${num(ratio, 2)}×`)],
        'Count only time savings that are actually used; also consider switching cost, dependency, data ownership and risk.',
        {
          primary: primary('Net monthly value', net, 'money'),
          checks: [
            check('Value exceeds cost', net >= 0 ? 'pass' : 'fail', money(net)),
            check('Hours saved are measured', 'verify', 'Base hours saved on usage data or observation, not vendor claims.'),
            check('Data export and exit terms', 'verify', 'Confirm you can export your data and the notice period before relying on the service.'),
          ],
          actions: ['Review usage and value at each renewal.'],
        });
    }
    case 'buy-lease': {
      const years = Math.max(1, Math.round(val('years'))), r = val('discountRate') / 100, rm = Math.pow(1 + r, 1 / 12) - 1, n = years * 12;
      const leaseAF = rm === 0 ? n : (1 - Math.pow(1 + rm, -n)) / rm;
      const pvBuy = val('buy') + val('maintenance') * annuityFactor(val('discountRate'), years) - val('residual') / Math.pow(1 + r, years);
      const pvLease = val('leaseUpfront') + val('lease') * leaseAF, diff = pvLease - pvBuy;
      const simpleBuy = val('buy') - val('residual') + val('maintenance') * years, simpleLease = val('lease') * 12 * years + val('leaseUpfront');
      const b = diff >= 0;
      return result(b ? 'BUY' : 'LEASE', b ? 'good' : 'warn', `${b ? 'Buying' : 'Leasing'} costs ${money(Math.abs(diff))} less in present value over ${years} years at ${pct(val('discountRate'))}.`,
        [m('Ownership cost (present value)', money(pvBuy)), m('Lease cost (present value)', money(pvLease)), m('Difference', money(Math.abs(diff))), m('Residual assumed', money(val('residual')))],
        'This excludes tax effects, accounting treatment, financing terms and differences in flexibility, obsolescence and maintenance cover.',
        {
          primary: primary('Present-value difference (lease − buy)', diff, 'money'),
          table: { caption: 'Undiscounted and present-value comparison', head: ['Basis', 'Buy', 'Lease'], rows: [['Undiscounted total', money(simpleBuy), money(simpleLease)], [`Present value at ${pct(val('discountRate'))}`, money(pvBuy), money(pvLease)]] },
          checks: [
            check('Residual value evidence', 'verify', 'Base resale value on dealer quotes or auction data for similar age and hours.'),
            check('Lease includes maintenance?', 'verify', 'If the lease covers maintenance, the ownership maintenance cost should be compared like for like.'),
            check('Tax and accounting', 'verify', 'Depreciation, interest deductibility and lease accounting (AASB 16) can change the answer; check with your accountant.'),
          ],
          actions: ['Ask for the lease’s implicit interest rate and end-of-term options.'],
        });
    }
    case 'process-or-software': {
      const foundation = ((val('clarity') + val('consistency') + val('data')) / 15) * 100, pressure = ((val('manual') + val('errors')) / 10) * 100;
      const txt = foundation < 55 ? 'FIX PROCESS FIRST' : pressure >= 60 ? 'SOFTWARE MAY HELP' : 'IMPROVE PROCESS';
      return result(txt, foundation < 55 ? 'warn' : pressure >= 60 ? 'good' : 'warn', `Process foundation ${num(foundation, 0)}/100; automation pressure ${num(pressure, 0)}/100.`,
        [m('Process foundation', `${num(foundation, 0)}/100`), m('Manual effort', `${val('manual')}/5`), m('Error exposure', `${val('errors')}/5`), m('Data readiness', `${val('data')}/5`)],
        foundation < 55 ? 'Clarify and standardise the process before digitising it; software can otherwise automate inconsistency.' : pressure >= 60 ? 'The process is stable enough, with enough pain to justify evaluating software.' : 'Improve the current process first and reassess whether software is needed.',
        {
          primary: primary('Process foundation', foundation),
          checks: [
            check('Process documented and consistent', foundation >= 55 ? 'pass' : 'fail', `${num(foundation, 0)}/100 (55 needed before software selection in this tool).`),
            check('Data ready to migrate', val('data') <= 2 ? 'warn' : 'pass', `Data readiness ${val('data')}/5.`),
          ],
          actions: ['Map the current process before writing software requirements.'],
        });
    }
    case 'build-buy-software': {
      const years = Math.max(1, val('years')), build = val('custom') + val('customAnnual') * years, buy = val('packageSetup') + val('packageMonthly') * 12 * years, fit = val('fit'), need = (val('unique') + val('control')) / 2;
      const choose = need >= 4 && fit <= 3 && build <= buy * 1.5 ? 'BUILD' : fit >= 4 ? 'BUY' : 'COMPARE IN DETAIL';
      return result(choose, choose === 'COMPARE IN DETAIL' ? 'warn' : 'good', `${num(years, 0)}-year custom TCO ${money(build)} vs package TCO ${money(buy)}.`,
        [m('Custom TCO', money(build)), m('Package TCO', money(buy)), m('Package fit', `${fit}/5`), m('Custom need', `${num(need, 1)}/5`)],
        choose === 'BUILD' ? 'Unique requirements and control needs support a custom option if delivery risk is acceptable.' : choose === 'BUY' ? 'Strong package fit normally favours buying unless integration or ownership constraints dominate.' : 'Run a requirements fit-gap and total-cost analysis before committing.',
        {
          primary: primary('TCO difference (package − custom)', buy - build, 'money'),
          checks: [
            check('Custom build risk', 'verify', 'Custom builds carry schedule, quality and key-person risk; include maintenance and hosting for the full life.'),
            check('Package fit tested', 'verify', 'Test the package with your real scenarios and data before rating fit.'),
            check('Exit and data ownership', 'verify', 'Confirm source code (custom) or data export (package) rights.'),
          ],
          actions: ['Score requirements as must-have or nice-to-have and rate both options against them.'],
        });
    }
  }
  return null;
});
