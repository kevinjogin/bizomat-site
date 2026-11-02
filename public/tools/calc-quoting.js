// KEVOS® calculations: Quoting.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'quote-check': {
      const cost = val('material') + val('labour') + val('overhead'), price = val('price'), profit = price - cost, margin = (profit / Math.max(0.01, price)) * 100, target = val('target');
      const needed = target < 100 ? cost / (1 - target / 100) : Infinity;
      return result(margin >= target ? 'TARGET MET' : margin > 0 ? 'BELOW TARGET' : 'LOSS', margin >= target ? 'good' : margin > 0 ? 'warn' : 'bad', `Gross margin ${pct(margin)} against a ${pct(target)} target.`,
        [m('Total cost', money(cost)), m('Gross profit', money(profit)), m('Gross margin', pct(margin)), m('Vs target', `${margin - target >= 0 ? '+' : ''}${num(margin - target, 1)} points`), m('Price for target margin', money(needed))],
        margin < target ? `Raise the price towards ${money(needed)}, reduce cost or narrow scope before accepting at this target.` : 'The quote clears the target, subject to cost completeness and commercial risk.',
        {
          primary: primary('Gross margin', margin, 'pct'),
          checks: [
            check('Margin meets target', margin >= target ? 'pass' : margin > 0 ? 'warn' : 'fail', `${pct(margin)} vs ${pct(target)}.`),
            check('All costs included', 'verify', 'Include freight, packaging, inspection, warranty, travel and contingency where they apply.'),
            check('Commercial terms', 'verify', 'Check payment terms, liquidated damages and price-validity period before submitting.'),
          ],
          actions: ['Record the cost basis and assumptions with the quote.'],
        });
    }
    case 'price-builder': {
      const cost = val('cost'), mg = val('margin'), ok = mg < 100, price = ok ? cost / (1 - mg / 100) : Infinity, markup = ok && mg < 100 ? (mg / (100 - mg)) * 100 : Infinity;
      return result(ok ? money(price) : 'MARGIN TOO HIGH', ok ? 'good' : 'bad', ok ? `Selling price for a ${pct(mg)} gross margin on ${money(cost)} cost.` : 'A gross margin of 100% or more cannot be reached at any price.',
        [m('Cost', money(cost)), m('Target margin', pct(mg)), m('Required price', ok ? money(price) : '—'), m('Equivalent markup', Number.isFinite(markup) ? pct(markup) : '—'), m('Gross profit', ok ? money(price - cost) : '—')],
        'Margin is on price, markup is on cost. Prices here exclude GST; add tax, commissions and freight separately.',
        {
          primary: primary('Required price', ok ? price : NaN, 'money'),
          checks: [
            check('Margin achievable', ok ? 'pass' : 'fail', ok ? `${pct(mg)} margin = ${pct(markup)} markup.` : 'Use a margin below 100%.'),
            check('Price acceptable to the market', 'verify', 'Compare with competitor and customer reference prices.'),
          ],
          actions: ['Round to your price-point policy and confirm GST treatment.'],
        });
    }
    case 'labour-quote': {
      const loaded = val('rate') * (1 + val('oncost') / 100), cost = val('hours') * loaded, mg = val('margin'), price = mg < 100 ? cost / (1 - mg / 100) : Infinity;
      return result(Number.isFinite(price) ? money(price) : 'MARGIN TOO HIGH', Number.isFinite(price) ? 'good' : 'bad', `Labour sell value for ${num(val('hours'), 1)} hours at a ${pct(mg)} margin.`,
        [m('Loaded hourly rate', money(loaded)), m('Labour cost', money(cost)), m('Target margin', pct(mg)), m('Sell value', Number.isFinite(price) ? money(price) : '—'), m('Effective sell rate', Number.isFinite(price) && val('hours') > 0 ? `${money(price / val('hours'))}/hr` : '—')],
        'Add materials, travel, supervision, equipment and minimum charges separately.',
        {
          primary: primary('Labour sell value', Number.isFinite(price) ? price : NaN, 'money'),
          checks: [
            check('On-cost covers employment costs', 'verify', 'Confirm the on-cost rate covers superannuation, leave, payroll tax, workers’ compensation and overheads per your policy.'),
            check('Hours estimate', 'verify', 'Base hours on similar past jobs or a task breakdown, plus an allowance for travel and set-up.'),
          ],
          actions: ['Compare the effective sell rate with your published rates.'],
        });
    }
    case 'job-cost': {
      const lab = val('hours') * val('rate'), parts = [['Materials', val('material')], ['Labour', lab], ['Equipment / subcontract', val('equipment')], ['Allocated overhead', val('overhead')]];
      const base = parts.reduce((s, x) => s + x[1], 0), cont = (base * val('contingency')) / 100, total = base + cont;
      return result(money(total), 'good', `Estimated job cost ${money(total)} including ${pct(val('contingency'))} contingency.`,
        [m('Base cost', money(base)), m('Contingency', money(cont)), m('Total cost', money(total)), m('Labour', money(lab))],
        'This is a cost estimate, not a selling price; add margin, tax and commercial risk separately.',
        {
          primary: primary('Total job cost', total, 'money'),
          table: { caption: 'Cost breakdown', head: ['Element', 'Cost', 'Share of base'], rows: [...parts.map(([k, v]) => [k, money(v), pct(base > 0 ? (v / base) * 100 : 0)]), ['Contingency', money(cont), pct(val('contingency'))]] },
          checks: [
            check('Contingency proportionate to uncertainty', val('contingency') < 5 ? 'warn' : 'pass', `${pct(val('contingency'))} applied.`),
            check('Quotes for subcontract and equipment', 'verify', 'Use written quotations for subcontract and hire items.'),
          ],
          actions: ['Use the price-from-target-margin tool to convert this cost to a price.'],
        });
    }
    case 'supplier-compare': {
      const W = { p: val('wPrice'), l: val('wLead'), q: val('wQuality'), r: val('wReliability') }, wsum = W.p + W.l + W.q + W.r || 1;
      const S = (k) => ({ price: val(`${k}Price`), lead: val(`${k}Lead`), q: val(`${k}Quality`), r: val(`${k}Reliability`) });
      const A = S('a'), B = S('b'), minP = Math.min(A.price, B.price), minL = Math.min(A.lead, B.lead);
      const crit = (s) => ({ p: (minP / Math.max(0.01, s.price)) * 100, l: (minL / Math.max(0.01, s.lead)) * 100, q: (s.q / 5) * 100, r: (s.r / 5) * 100 });
      const tot = (c) => (c.p * W.p + c.l * W.l + c.q * W.q + c.r * W.r) / wsum;
      const cA = crit(A), cB = crit(B), a = tot(cA), b = tot(cB);
      const rejA = A.q <= 2 || A.r <= 2, rejB = B.q <= 2 || B.r <= 2;
      let text, tone;
      if (rejA && rejB) { text = 'BOTH REJECTED'; tone = 'bad'; }
      else if (rejA) { text = 'SUPPLIER B'; tone = 'warn'; }
      else if (rejB) { text = 'SUPPLIER A'; tone = 'warn'; }
      else if (Math.abs(a - b) < 3) { text = 'TOO CLOSE TO CALL'; tone = 'warn'; }
      else { text = a > b ? 'SUPPLIER A' : 'SUPPLIER B'; tone = 'good'; }
      return result(text, tone, rejA || rejB ? `${rejA && rejB ? 'Both suppliers fall' : `Supplier ${rejA ? 'A' : 'B'} falls`} below the minimum quality or reliability rating; scores cannot override this.` : `Weighted score A ${num(a, 0)} vs B ${num(b, 0)} out of 100.`,
        [m('Supplier A score', num(a, 0)), m('Supplier B score', num(b, 0)), m('A price', money(A.price)), m('B price', money(B.price))],
        'Weights reflect what matters for this purchase; agree them before scoring suppliers.',
        {
          primary: primary('Score margin (A − B)', a - b),
          table: { caption: 'Weighted scoring (each criterion scored 0–100)', head: ['Criterion', 'Weight', 'Supplier A', 'Supplier B'], rows: [['Price (lowest = 100)', pct((W.p / wsum) * 100, 0), num(cA.p, 0), num(cB.p, 0)], ['Lead time (shortest = 100)', pct((W.l / wsum) * 100, 0), num(cA.l, 0), num(cB.l, 0)], ['Quality (rating / 5)', pct((W.q / wsum) * 100, 0), num(cA.q, 0), num(cB.q, 0)], ['Delivery reliability (rating / 5)', pct((W.r / wsum) * 100, 0), num(cA.r, 0), num(cB.r, 0)], ['Weighted total', '100%', num(a, 0), num(b, 0)]] },
          checks: [
            check('Supplier A meets minimum quality and reliability', rejA ? 'fail' : 'pass', 'A rating of 1–2 on quality or reliability excludes the supplier regardless of price.'),
            check('Supplier B meets minimum quality and reliability', rejB ? 'fail' : 'pass', 'A rating of 1–2 on quality or reliability excludes the supplier regardless of price.'),
            check('Weights add to 100%', Math.abs(wsum - 100) < 0.01 ? 'pass' : 'warn', `Weights sum to ${num(wsum, 1)}%; they are normalised.`),
            check('Ratings based on evidence', 'verify', 'Base quality and reliability ratings on audits, delivery records or references.'),
          ],
          actions: ['Compare total landed cost (freight, duty, inspection), not only unit price.', 'Request samples or a trial order before switching.'],
        });
    }
    case 'moq-check': {
      const monthly = Math.max(0.01, val('monthly')), months = val('moq') / monthly, value = val('moq') * val('unitCost');
      const hold = (value / 2) * (val('carry') / 100) * (months / 12), shelf = val('shelfMonths'), shelfOk = shelf <= 0 || months <= shelf;
      return result(!shelfOk ? 'EXCEEDS SHELF LIFE' : `${num(months, 1)} MONTHS STOCK`, !shelfOk ? 'bad' : months <= 3 ? 'good' : months <= 6 ? 'warn' : 'bad', `The MOQ covers about ${num(months, 1)} months of expected demand and ties up ${money(value)}.`,
        [m('MOQ value', money(value)), m('Months of stock', num(months, 1)), m('Holding cost while consumed', money(hold)), m('Average monthly demand', num(val('monthly'), 0))],
        months > 6 ? 'The MOQ creates substantial stock exposure; negotiate quantity, price breaks or scheduled call-offs.' : 'The MOQ is reasonably aligned with expected usage, subject to obsolescence and storage risk.',
        {
          primary: primary('Months of stock', months),
          checks: [
            check('Within shelf life or obsolescence horizon', shelfOk ? (shelf > 0 ? 'pass' : 'verify') : 'fail', shelf > 0 ? `${num(months, 1)} months vs ${num(shelf, 0)} months allowed.` : 'No shelf life entered; confirm the item will not expire or become obsolete.'),
            check('Storage space available', 'verify', 'Confirm storage for the full MOQ quantity at delivery.'),
          ],
          actions: ['Ask the supplier for split deliveries or a blanket order with call-offs.'],
        });
    }
    case 'manufacturing-quote': {
      const qty = Math.max(1, val('qty')), material = qty * val('materialUnit'), labour = val('labourHours') * val('labourRate'), machine = val('machineHours') * val('machineRate');
      const direct = material + labour + machine, oh = (direct * val('overhead')) / 100, cost = direct + oh, gm = clamp(val('margin'), 0, 95) / 100, quote = cost / (1 - gm);
      return result(`${money(quote / qty)} / UNIT`, 'good', `Quote ${money(quote)} for ${num(qty, 0)} units (${money(quote / qty)} each) at a ${pct(gm * 100)} gross margin.`,
        [m('Total cost', money(cost)), m('Quote total', money(quote)), m('Quote / unit', money(quote / qty)), m('Gross profit', money(quote - cost))],
        'Review set-up, tooling, inspection, packaging, freight, minimum order quantity, terms and contingency before issuing.',
        {
          primary: primary('Quote total', quote, 'money'),
          table: { caption: 'Cost build-up', head: ['Element', 'Cost', 'Per unit'], rows: [['Material', money(material), money(material / qty)], ['Labour', money(labour), money(labour / qty)], ['Machine', money(machine), money(machine / qty)], [`Overhead (${pct(val('overhead'))})`, money(oh), money(oh / qty)], ['Total cost', money(cost), money(cost / qty)], ['Margin', money(quote - cost), money((quote - cost) / qty)], ['Quote', money(quote), money(quote / qty)]] },
          checks: [
            check('Margin within the tool range', val('margin') <= 95 ? 'pass' : 'warn', 'Margins above 95% are capped.'),
            check('Set-up and tooling included', 'verify', 'Spread set-up and tooling across the order or quote them separately.'),
            check('Machine and labour hours from routing', 'verify', 'Take hours from the routing or a time study for this part.'),
          ],
          actions: ['Quote price breaks at other quantities if set-up is significant.'],
        });
    }
  }
  return null;
});
