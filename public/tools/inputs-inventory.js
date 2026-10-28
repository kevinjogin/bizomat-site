// KEVOS® WORKOS input guides: Inventory. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-inventory.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  'reorder-point': {
    daily: { what: 'How many units of the item are used or sold on an average day, from recent usage history or the forecast.', tip: 'Use the same kind of day as the lead time: if lead time is in working days, use demand per working day.', effect: 'Lead-time demand, and so the reorder point, rise in proportion.', fig: 'rate', sym: 'd' },
    lead: { what: 'The time from deciding to reorder until the stock is received and ready to use, including internal approval, supplier lead time, transit and receiving.', tip: 'Include your own ordering and receiving time, not just the supplier’s quoted lead time.', effect: 'Lead-time demand rises in proportion.', fig: 'time', sym: 'L' },
    safety: { what: 'The extra stock held as a buffer against higher-than-average demand or late deliveries during the lead time.', tip: 'Work it out with the safety stock tool rather than guessing; it is added unchanged to the reorder point.', effect: 'Adds unit for unit to the reorder point.', fig: 'count', sym: 'SS' },
  },
  'safety-stock': {
    maxDaily: { what: 'The highest daily demand seen in normal trading over recent history, leaving out one-off events you would not plan for.', tip: 'Used only by the max-minus-average method; once a standard deviation is entered, it appears only in the comparison table.', effect: 'In the max-minus-average method, a higher maximum raises safety stock.', fig: 'rate' },
    maxLead: { what: 'The longest normal lead time experienced from this supplier in recent history, from order to receipt.', tip: 'Ignore rare extreme delays such as a one-off port strike, or the buffer becomes very large.', effect: 'In the max-minus-average method, a longer maximum raises safety stock.', fig: 'time' },
    avgDaily: { what: 'The average number of units used per day over the same history as the maximum and the standard deviation.', tip: 'Use the same day basis (working or calendar) as the lead times.', effect: 'Used in both methods; in the statistical one it scales the effect of lead-time variation.', fig: 'rate', sym: 'd' },
    avgLead: { what: 'The average time from order to receipt over recent orders from this supplier.', tip: 'Measure it from receipt records rather than the supplier’s quoted lead time.', effect: 'In the statistical method, a longer average lead time exposes you to more demand variation.', fig: 'time', sym: 'L' },
    sdDaily: { what: 'How much daily demand scatters around its average, measured as the standard deviation of daily demand over 6 to 12 months of history.', tip: '0 means not known. If both standard deviations are 0, the tool falls back to the max-minus-average method.', effect: 'Statistical safety stock rises with this variation.', fig: 'tolerance', sym: 'σd' },
    sdLead: { what: 'How much the lead time scatters around its average, measured as the standard deviation of lead times from receipt records.', tip: 'Enter it in days. 0 means not known; demand variation alone can still drive the statistical method.', effect: 'Statistical safety stock rises with this variation, scaled by average daily demand.', fig: 'tolerance', sym: 'σL' },
    service: { what: 'The probability you want of not running out during one replenishment cycle. It sets the z value used by the statistical method.', tip: 'This is per cycle, not the fill rate. It has no effect unless a standard deviation is entered.', effect: 'A higher service level raises z and so the statistical safety stock, increasingly steeply.', fig: 'choice', sym: 'z' },
  },
  'inventory-cost': {
    avgUnits: { what: 'The average number of units held over the year, for example the average of month-end stock counts.', tip: 'Use the average, not the peak or the year-end figure, which may be unusually high or low.', effect: 'Carrying cost rises in proportion.', fig: 'count' },
    unitCost: { what: 'What one unit of stock is worth at cost, using the standard or average cost recorded in the inventory system.', tip: 'Use cost, not selling price.', effect: 'Carrying cost rises in proportion.', fig: 'unit-cost' },
    carry: { what: 'The yearly cost of holding stock as a percentage of its value, covering capital, storage, insurance, handling, damage and obsolescence.', tip: 'Agree the rate with finance. Type the percentage (22 for 22 %).', effect: 'Carrying cost rises in proportion.', fig: 'percent' },
  },
  'stock-days': {
    stock: { what: 'The units physically available in stock now, from the inventory system or a count.', tip: 'Leave out stock that is quarantined, damaged or already committed to orders.', effect: 'Days of cover rise in proportion.', fig: 'count' },
    daily: { what: 'How many units are used or sold on an average day, from recent history or the forecast for the coming period.', tip: 'Use the forecast if demand is about to change, such as a seasonal peak.', effect: 'Higher demand shortens the days of cover.', fig: 'rate' },
  },
  'order-quantity': {
    annual: { what: 'The number of units expected to be used or sold in a year, from the forecast or last year’s usage.', tip: 'Use annual demand even if you order monthly; the EOQ formula expects a yearly figure.', effect: 'EOQ rises with the square root of demand: four times the demand doubles the order quantity.', fig: 'count', sym: 'D' },
    orderCost: { what: 'The cost of placing and receiving one order, whatever its size: purchasing time, freight charged per order, receiving and inspection.', tip: 'Include only costs that recur with every order; costs that change with quantity belong in the unit price.', effect: 'EOQ rises with the square root of this cost.', fig: 'money', sym: 'S' },
    holding: { what: 'What it costs to hold one unit in stock for a year: unit cost multiplied by the annual carrying rate.', tip: 'This is dollars per unit per year, not a percentage.', effect: 'EOQ falls with the square root of holding cost.', fig: 'unit-cost', sym: 'H' },
  },
});
