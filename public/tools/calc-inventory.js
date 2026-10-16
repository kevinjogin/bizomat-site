// KEVOS® WORKOS calculations: Inventory.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'reorder-point': {
      const ltd = val('daily') * val('lead'), rp = ltd + val('safety');
      return result(`${num(rp, 0)} UNITS`, 'good', `Reorder when the inventory position falls to ${num(rp, 0)} units (${num(ltd, 0)} lead-time demand + ${num(val('safety'), 0)} safety stock).`,
        [m('Lead-time demand', num(ltd, 0)), m('Safety stock', num(val('safety'), 0)), m('Reorder point', num(rp, 0)), m('Safety stock in days', `${num(val('daily') > 0 ? val('safety') / val('daily') : 0, 1)} days`)],
        'Inventory position normally means on hand plus on order minus committed demand.',
        {
          primary: primary('Reorder point', rp, 'units'),
          checks: [
            check('Safety stock set', val('safety') > 0 ? 'pass' : 'warn', val('safety') > 0 ? `${num(val('safety'), 0)} units.` : 'No safety stock: any demand or lead-time variation causes a stock-out.'),
            check('Lead time is supplier-confirmed', 'verify', 'Use the actual order-to-receipt time, including internal processing.'),
          ],
          actions: ['Use the safety stock tool to size the buffer from demand and lead-time variation.'],
        });
    }
    case 'safety-stock': {
      const maxD = val('maxDaily'), maxL = val('maxLead'), d = val('avgDaily'), L = val('avgLead'), sdD = val('sdDaily'), sdL = val('sdLead');
      const svc = Number(sel('service') || 95), z = Z_SERVICE[svc] ?? 1.6449;
      const ma = Math.max(0, maxD * maxL - d * L), hasStats = sdD > 0 || sdL > 0;
      const stat = hasStats ? z * Math.sqrt(L * sdD * sdD + d * d * sdL * sdL) : NaN;
      const ss = hasStats ? stat : ma;
      return result(`${num(ss, 0)} UNITS`, hasStats ? 'good' : 'warn', hasStats ? `Statistical safety stock for a ${pct(svc)} cycle service level (z = ${num(z, 2)}).` : 'Max-minus-average estimate. Enter demand and lead-time variation for a service-level method.',
        [m('Statistical method', hasStats ? `${num(stat, 0)} units` : 'Needs variation data'), m('Max − average method', `${num(ma, 0)} units`), m('Average lead-time demand', num(d * L, 0)), m('Safety stock in days', `${num(d > 0 ? ss / d : 0, 1)} days`)],
        'For critical stock, prefer the statistical method with at least 6–12 months of demand and lead-time history.',
        {
          primary: primary('Safety stock', ss, 'units'),
          table: { caption: 'Method comparison', head: ['Method', 'Formula', 'Result'], rows: [['Service level (statistical)', 'z × √(L × σd² + d² × σL²)', hasStats ? `${num(stat, 0)} units` : 'Not available'], ['Max minus average', 'max daily × max lead − avg daily × avg lead', `${num(ma, 0)} units`]] },
          checks: [
            check('Maximums not below averages', maxD >= d && maxL >= L ? 'pass' : 'fail', `Max daily ${num(maxD, 0)} vs average ${num(d, 0)}; max lead ${num(maxL, 0)} vs average ${num(L, 0)} days.`),
            check('Variation data supplied', hasStats ? 'pass' : 'verify', hasStats ? 'Standard deviations entered.' : 'Without variation data the result is a rule of thumb, not a service-level calculation.'),
            check('Demand roughly normal and independent', hasStats ? 'verify' : 'pass', 'The statistical formula assumes independent, roughly normal daily demand; lumpy or seasonal demand needs a different method.'),
          ],
          actions: ['Recalculate quarterly or when demand patterns change.', 'Feed the result into the reorder point tool.'],
        });
    }
    case 'inventory-cost': {
      const value = val('avgUnits') * val('unitCost'), cost = (value * val('carry')) / 100;
      return result(money(cost), 'warn', `Carrying ${money(value)} of average stock costs about ${money(cost)} a year.`,
        [m('Average stock value', money(value)), m('Carrying rate', pct(val('carry'))), m('Annual carrying cost', money(cost)), m('Monthly equivalent', money(cost / 12))],
        'The carrying rate should include capital, storage, insurance, handling, damage and obsolescence.',
        {
          primary: primary('Annual carrying cost', cost, 'money'),
          checks: [
            check('Carrying rate defined by finance', 'verify', 'Agree the rate with finance; it varies widely between businesses and products.'),
            check('Average, not peak, stock', 'verify', 'Use average inventory over the year.'),
          ],
          actions: ['Target slow-moving items first when reducing stock.'],
        });
    }
    case 'stock-days': {
      const d = val('stock') / Math.max(0.01, val('daily'));
      return result(`${num(d, 1)} DAYS`, 'good', `Stock covers about ${num(d, 1)} days (${num(d / 7, 1)} weeks) at average demand.`,
        [m('Stock', num(val('stock'), 0)), m('Daily demand', num(val('daily'), 1)), m('Days cover', num(d, 1)), m('Weeks cover', num(d / 7, 1))],
        'Variation and open orders can make actual cover shorter or longer than this average.',
        {
          primary: primary('Days of cover', d),
          checks: [
            check('Cover compared with lead time', 'verify', 'Compare days of cover with the replenishment lead time plus safety stock days.'),
            check('Demand rate current', 'verify', 'Use recent or forecast demand, not a long-run average, if demand is changing.'),
          ],
          actions: ['Flag items with cover far above lead time as candidates to reduce.'],
        });
    }
    case 'order-quantity': {
      const D = val('annual'), S = val('orderCost'), H = Math.max(0.01, val('holding')), eoq = Math.sqrt((2 * D * S) / H);
      const tc = (q) => (q > 0 ? (D / q) * S + (q / 2) * H : Infinity), orders = eoq > 0 ? D / eoq : 0;
      return result(`${num(eoq, 0)} UNITS`, 'good', `Economic order quantity ${num(eoq, 0)} units: about ${num(orders, 1)} orders a year, total ordering and holding cost ${money(tc(eoq))}.`,
        [m('EOQ', num(eoq, 0)), m('Orders / year', num(orders, 1)), m('Days between orders', num(orders > 0 ? 365 / orders : 0, 0)), m('Annual ordering + holding cost', money(tc(eoq)))],
        'EOQ assumes steady demand and costs; supplier pack sizes, price breaks, freight, shelf life and service levels can change the practical quantity.',
        {
          primary: primary('EOQ', eoq, 'units'),
          table: { caption: 'Cost is flat near the EOQ', head: ['Order quantity', 'Annual ordering + holding cost', 'vs EOQ'], rows: [0.5, 0.75, 1, 1.5, 2].map((k) => [num(eoq * k, 0), money(tc(eoq * k)), k === 1 ? 'EOQ' : `+${pct((tc(eoq * k) / tc(eoq) - 1) * 100)}`]) },
          checks: [
            check('Holding cost per unit per year', 'verify', 'Typically unit cost × carrying rate; confirm with finance.'),
            check('Supplier pack size and MOQ', 'verify', 'Round to pack sizes and check minimum order quantities and price breaks.'),
          ],
          actions: ['Choose a practical quantity near the EOQ; small deviations cost little (see table).'],
        });
    }
  }
  return null;
});
