// KEVOS® calculations: Money.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'roi': {
      const inv = val('investment'), years = Math.max(1, Math.round(val('years'))), rate = val('discountRate');
      const net = val('annualBenefit') - val('annualCost');
      const roi = (net / Math.max(1, inv)) * 100, pay = net > 0 ? inv / net : Infinity;
      const total = net * years - inv, npv = npvLevel(rate, inv, net, years), dpay = net > 0 ? discountedPayback(rate, inv, net, years) : Infinity;
      const txt = npv > 0 ? 'POSITIVE NPV' : total > 0 ? 'MARGINAL' : 'NEGATIVE', tone = npv > 0 ? 'good' : total > 0 ? 'warn' : 'bad';
      return result(txt, tone, `Net present value ${money(npv)} over ${years} years at ${pct(rate)}; simple annual return ${pct(roi)}.`,
        [m('Annual net benefit', money(net)), m('Simple annual ROI', pct(roi)), m('Simple payback', Number.isFinite(pay) ? `${num(pay, 2)} years` : 'Not reached'), m('Discounted payback', Number.isFinite(dpay) ? `${num(dpay, 2)} years` : 'Not within period'), m(`Undiscounted ${years}-year net`, money(total)), m('NPV', money(npv))],
        npv > 0 ? 'The investment earns more than the discount rate over the period entered; confirm the benefits are realistic and owned.' : 'At this discount rate the investment does not recover its cost in present-value terms; improve benefits, reduce cost or reconsider.',
        {
          primary: primary('Net present value', npv, 'money'),
          checks: [
            check('Pays back within the evaluation period', Number.isFinite(dpay) ? 'pass' : 'fail', Number.isFinite(dpay) ? `Discounted payback ${num(dpay, 2)} years within ${years}.` : 'The discounted cash flows do not recover the investment within the period.'),
            check('Discount rate set', rate > 0 ? 'pass' : 'warn', rate > 0 ? `${pct(rate)} applied.` : 'A 0% rate ignores the time value of money.'),
            check('Benefits are cash or capacity you will use', 'verify', 'Confirm each benefit is real cash, avoided cost or capacity that will be used.'),
          ],
          actions: ['Use your organisation’s approved discount (hurdle) rate.', 'Test the downside using the sensitivity table (benefit −10%).', 'Add tax, financing and residual value through your finance team for a formal case.'],
        });
    }
    case 'break-even': {
      const c = val('price') - val('variable'), be = c > 0 ? val('fixed') / c : Infinity, exp = val('expected');
      const profit = exp * c - val('fixed'), mos = Number.isFinite(be) && exp > 0 ? ((exp - be) / exp) * 100 : -Infinity;
      const txt = c <= 0 ? 'NO CONTRIBUTION' : mos >= 20 ? 'ABOVE BREAK-EVEN' : mos >= 0 ? 'THIN MARGIN OF SAFETY' : 'BELOW BREAK-EVEN';
      const tone = c <= 0 || mos < 0 ? 'bad' : mos >= 20 ? 'good' : 'warn';
      return result(txt, tone, c > 0 ? `Each unit contributes ${money(c)}. Break-even is ${num(be, 0)} units; at ${num(exp, 0)} units profit is ${money(profit)}.` : 'Variable cost is at or above the selling price, so no volume breaks even.',
        [m('Contribution / unit', money(c)), m('Contribution margin', pct((c / Math.max(0.01, val('price'))) * 100)), m('Break-even units', Number.isFinite(be) ? num(be, 0) : '—'), m('Break-even revenue', Number.isFinite(be) ? money(be * val('price')) : '—'), m('Profit at expected volume', money(profit)), m('Margin of safety', Number.isFinite(mos) ? pct(mos) : '—')],
        'Check that price and variable cost stay representative at the break-even volume and that you have capacity to reach it.',
        {
          primary: primary('Profit at expected volume', profit, 'money'),
          checks: [
            check('Positive contribution', c > 0 ? 'pass' : 'fail', c > 0 ? `${money(c)} per unit.` : 'Raise price or cut variable cost before considering volume.'),
            check('Margin of safety', !Number.isFinite(mos) ? 'fail' : mos >= 20 ? 'pass' : mos >= 0 ? 'warn' : 'fail', Number.isFinite(mos) ? `Expected volume is ${pct(mos)} above break-even.` : 'Not applicable without positive contribution.'),
            check('Capacity to reach break-even', 'verify', 'Confirm production and sales capacity at the break-even volume.'),
          ],
          actions: ['Confirm fixed costs for the same period as the expected volume.', 'Separate genuinely variable costs from semi-fixed costs.'],
        });
    }
    case 'margin': {
      const p = val('price'), c = val('cost'), gp = p - c, margin = (gp / Math.max(0.01, p)) * 100, markup = c > 0 ? (gp / c) * 100 : Infinity;
      return result(margin >= 30 ? 'HEALTHY MARGIN' : margin >= 10 ? 'THIN MARGIN' : margin > 0 ? 'VERY LOW MARGIN' : 'LOSS', margin >= 30 ? 'good' : margin >= 10 ? 'warn' : 'bad', `Gross profit is ${money(gp)} per unit: ${pct(margin)} margin, ${Number.isFinite(markup) ? pct(markup) : '—'} markup.`,
        [m('Gross profit', money(gp)), m('Gross margin (on price)', pct(margin)), m('Markup (on cost)', Number.isFinite(markup) ? pct(markup) : '—'), m('Cost share of price', pct((c / Math.max(0.01, p)) * 100))],
        'Margin is calculated on price and markup on cost; quoting one as the other is a common pricing error.',
        {
          primary: primary('Gross margin', margin, 'pct'),
          checks: [
            check('Price above cost', gp > 0 ? 'pass' : 'fail', gp > 0 ? 'Each unit makes a gross profit.' : 'Each unit loses money before overheads.'),
            check('Cost is complete', 'verify', 'Include freight, warranty, commissions, packaging and any allocated overhead your pricing policy requires.'),
          ],
          actions: ['Compare the margin with your pricing policy for this product or customer.', 'Use the price-from-target-margin tool to set a new price.'],
        });
    }
    case 'true-cost': {
      const lab = val('labourHours') * val('labourRate'), parts = [['Material', val('material')], ['Labour', lab], ['Overhead allocation', val('overhead')], ['Other', val('other')]];
      const total = parts.reduce((s, x) => s + x[1], 0), price = val('price');
      const margin = price > 0 ? ((price - total) / price) * 100 : null;
      const txt = margin === null ? money(total) : margin >= 30 ? 'HEALTHY MARGIN' : margin >= 10 ? 'THIN MARGIN' : margin > 0 ? 'VERY LOW MARGIN' : 'LOSS';
      const tone = margin === null ? 'good' : margin >= 30 ? 'good' : margin >= 10 ? 'warn' : 'bad';
      const biggest = [...parts].sort((a, b) => b[1] - a[1])[0];
      return result(txt, tone, `Fully loaded unit cost ${money(total)}${margin === null ? '' : `; ${pct(margin)} margin at ${money(price)}`}. The largest element is ${biggest[0].toLowerCase()}.`,
        [m('Material', money(val('material'))), m('Labour', money(lab)), m('Overhead + other', money(val('overhead') + val('other'))), m('True cost / unit', money(total)), ...(margin === null ? [] : [m('Gross margin', pct(margin))])],
        'Use this structure with your organisation’s approved costing method and overhead rates.',
        {
          primary: primary('True cost per unit', total, 'money'),
          table: { caption: 'Cost breakdown', head: ['Element', 'Cost / unit', 'Share'], rows: parts.map(([k, v]) => [k, money(v), pct(total > 0 ? (v / total) * 100 : 0)]) },
          checks: [
            check('Labour rate is fully loaded', 'verify', 'Include on-costs (superannuation, leave, payroll tax, insurance) as your costing policy defines.'),
            check('Overhead allocation basis', 'verify', 'Confirm the overhead rate and basis (labour hours, machine hours or activity) used by your finance team.'),
            ...(margin === null ? [] : [check('Selling price covers true cost', margin > 0 ? 'pass' : 'fail', `${pct(margin)} margin.`)]),
          ],
          actions: ['Attack the largest cost element first when looking for savings.', 'Refresh the cost when material prices or labour rates change.'],
        });
    }
    case 'investment-check': {
      const inv = val('investment'), net = val('annualNet'), pay = net > 0 ? inv / net : Infinity, roi = (net / Math.max(1, inv)) * 100;
      const payOk = pay <= val('maxPayback'), roiOk = roi >= val('minROI'), pass = payOk && roiOk;
      return result(pass ? 'PASSES HURDLES' : 'BELOW HURDLE', pass ? 'good' : 'warn', pass ? 'The investment clears both entered commercial thresholds.' : `${!payOk && !roiOk ? 'Both thresholds are' : 'One threshold is'} not met.`,
        [m('Payback', Number.isFinite(pay) ? `${num(pay, 2)} years` : 'Not reached'), m('Payback limit', `${num(val('maxPayback'), 2)} years`), m('Simple annual ROI', pct(roi)), m('ROI hurdle', pct(val('minROI')))],
        'Thresholds are management choices; add risk, cash timing and strategic factors before approval.',
        {
          primary: primary('Simple annual ROI', roi, 'pct'),
          checks: [
            check('Payback within limit', payOk ? 'pass' : 'fail', `${Number.isFinite(pay) ? `${num(pay, 2)} years` : 'No payback'} against ${num(val('maxPayback'), 2)} years.`),
            check('Return meets hurdle', roiOk ? 'pass' : 'fail', `${pct(roi)} against ${pct(val('minROI'))}.`),
            check('Thresholds approved', 'verify', 'Use the payback and return thresholds approved by your organisation.'),
          ],
          actions: ['Use the ROI and NPV tool for a discounted view.', 'Document the assumptions behind the annual net benefit.'],
        });
    }
    case 'savings-check': {
      const perWeek = val('savingEach') * val('frequency'), gross = perWeek * val('weeks'), net = gross - val('implementation');
      const payWeeks = perWeek > 0 ? val('implementation') / perWeek : Infinity;
      return result(net > 0 ? 'POSITIVE FIRST YEAR' : 'NEGATIVE FIRST YEAR', net > 0 ? 'good' : 'warn', `Recurring annual saving ${money(gross)}; first-year net ${money(net)}.`,
        [m('Annual gross saving', money(gross)), m('Implementation', money(val('implementation'))), m('First-year net', money(net)), m('Payback', Number.isFinite(payWeeks) ? `${num(payWeeks, 1)} working weeks` : 'Not reached')],
        'Confirm the saving releases cash or capacity you will use, not only a theoretical saving.',
        {
          primary: primary('First-year net saving', net, 'money'),
          checks: [
            check('Pays back within a year', payWeeks <= val('weeks') ? 'pass' : 'warn', Number.isFinite(payWeeks) ? `${num(payWeeks, 1)} of ${num(val('weeks'), 0)} working weeks.` : 'No recurring saving entered.'),
            check('Saving is cash-releasing or capacity used', 'verify', 'Identify the budget line that falls or the extra output the freed capacity produces.'),
          ],
          actions: ['Measure the saving per occurrence before and after the change.', 'Track realised savings monthly against this estimate.'],
        });
    }
  }
  return null;
});
