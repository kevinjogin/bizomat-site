// KEVOS® Tools input guides: Manufacturing. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-manufacturing.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  'batch-fit': {
    rackW: { what: 'The horizontal space on the rack, jig or carrier that parts can actually occupy, after the clearance needed at each edge has been taken off.', tip: 'Measure inside any edge clearance the process needs; the tool adds no clearance at the rack edges.', effect: 'More width fits more columns of parts.', fig: 'length', sym: 'W' },
    rackH: { what: 'The vertical space on the rack, jig or carrier available for parts, after top and bottom edge clearance.', tip: 'Allow for hooks and hangers above the top row before measuring.', effect: 'More height fits more rows of parts.', fig: 'height', sym: 'H' },
    partW: { what: 'The width of the rectangle that fully encloses one part as it hangs or sits on the rack, including any hook or protrusion.', tip: 'Use the overall envelope, not a nominal size; the tool also tries the part rotated 90° and keeps the better result.', effect: 'A wider part fits fewer columns.', fig: 'length', sym: 'w' },
    partH: { what: 'The height of the rectangle that fully encloses one part as it hangs or sits on the rack, including any hook or protrusion.', tip: 'Include the hanging point or fixture in the height if it adds to the envelope.', effect: 'A taller part fits fewer rows.', fig: 'height', sym: 'h' },
    gap: { what: 'The minimum space the process needs between neighbouring parts, for example for coating access, drainage, airflow or to stop parts touching.', tip: 'Use the gap your process specification requires; it applies between parts both across and down.', effect: 'A larger gap reduces how many parts fit in each direction.', fig: 'gap', sym: 'g' },
  },
  'machine-load': {
    demand: { what: 'The number of units this machine must produce in the period, from orders or the production plan.', tip: 'If several part numbers share the machine, run each one and add up the required hours.', effect: 'Required hours and utilisation rise in proportion.', fig: 'count' },
    cycle: { what: 'The machine time to produce one unit of this part, measured on the machine or taken from the routing.', tip: 'Enter minutes per unit. Include set-up time here or in efficiency, but not both.', effect: 'Required hours rise in proportion.', fig: 'time' },
    available: { what: 'The scheduled hours the machine is planned to run in the period, from the shift pattern minus planned shutdowns.', tip: 'Use scheduled hours for the same period as the demand.', effect: 'More hours lower utilisation.', fig: 'time' },
    efficiency: { what: 'The share of machine time that turns into good output after breakdowns, set-ups, slow running and scrap, from recent records.', tip: 'Use a demonstrated figure, not the target. Type the percentage (85 for 85 %).', effect: 'Lower efficiency raises the required hours.', fig: 'efficiency', sym: 'η' },
  },
  'scrap-impact': {
    units: { what: 'All units made in the period, including those later scrapped. Good output is this total minus scrap.', tip: 'Count everything produced, not only good units, or the scrap cost is understated.', effect: 'Scrap units and cost rise in proportion.', fig: 'count' },
    unitCost: { what: 'The cost already spent on one unit by the point where it is scrapped: material, labour and overhead added up to that stage.', tip: 'A part scrapped at final inspection carries more cost than one scrapped at the first operation.', effect: 'Scrap cost rises in proportion.', fig: 'unit-cost' },
    scrap: { what: 'The share of units produced that are thrown away, measured from scrap records over the period.', tip: 'Type a percentage (3 for 3 %), not a fraction. Reworked units that end up good are not scrap.', effect: 'Scrap units and cost rise in proportion.', fig: 'percent' },
  },
  'setup-worth': {
    current: { what: 'How long a changeover takes today, from the last good part of one job to the first good part of the next, measured on the floor.', tip: 'Time several changeovers and use the average, including trial runs and adjustments.', effect: 'Minutes saved are current minus target, so a longer current time raises the value.', fig: 'time' },
    target: { what: 'The changeover time expected after the improvement, preferably proven in a trial rather than estimated.', tip: 'Use a trialled time where possible; an optimistic target overstates the value.', effect: 'A shorter target raises the minutes saved and the annual value.', fig: 'time' },
    changes: { what: 'The number of changeovers made on this machine or line in a year, from production records.', tip: 'If faster set-ups will lead to more, smaller batches, the released hours are reused rather than banked.', effect: 'Hours released and annual value rise in proportion.', fig: 'rate' },
    rate: { what: 'The cost of one hour with the machine stopped for changeover, combining the machine rate and the crew who wait or do the set-up.', tip: 'Include everyone tied up in the changeover, not just the setter.', effect: 'Annual value rises in proportion.', fig: 'unit-cost' },
    investment: { what: 'The one-off cost of making set-ups faster: quick-change tooling, fixtures, presetting equipment and training.', tip: 'Include internal time spent on the improvement project, not only purchases.', effect: 'Payback is this divided by annual value.', fig: 'money' },
  },
  'tooling-payback': {
    tooling: { what: 'The one-off cost of the new tool, die, mould or fixture, from a quotation, including try-out and approval.', tip: 'Include sampling, try-out and first-article costs, not just the tool price.', effect: 'Payback and units to pay back rise in proportion.', fig: 'money' },
    oldCost: { what: 'What one unit costs to make now with the existing method or tooling.', tip: 'Use the same cost basis for old and new, for example both including scrap and labour.', effect: 'A higher current cost increases the saving per unit.', fig: 'unit-cost' },
    newCost: { what: 'What one unit is expected to cost with the new tooling, from a trial or the supplier’s quotation.', tip: 'Include tool maintenance and sharpening per unit if they change with the new tool.', effect: 'A lower new cost increases the saving and shortens payback.', fig: 'unit-cost' },
    volume: { what: 'The number of units expected to be made with the tooling each year, from the forecast.', tip: 'Check the tool life covers the payback quantity before relying on the result.', effect: 'Higher volume raises the annual saving and shortens payback in years.', fig: 'count' },
  },
  'downtime-cost': {
    hours: { what: 'How long the stoppage lasted, or is expected to last, from the stop to the return of normal production.', tip: 'Enter hours: 45 minutes is 0.75 hours.', effect: 'Lost contribution and idle labour rise in proportion.', fig: 'time' },
    contribution: { what: 'The margin lost for each hour the line is not producing: sales value of the missed output minus its variable cost.', tip: 'If the output is made up later on overtime, the real loss is the overtime cost, not this contribution.', effect: 'Lost contribution is hours × this figure.', fig: 'unit-cost' },
    idlePeople: { what: 'The number of people paid during the stoppage who cannot do productive work because of it.', tip: 'Leave out people moved to other useful work during the stop.', effect: 'Idle labour cost rises in proportion.', fig: 'count' },
    labourRate: { what: 'The full hourly cost of one affected person: wages plus on-costs such as superannuation, leave and payroll tax.', tip: 'Do not include labour here if the contribution figure already counts it.', effect: 'Idle labour cost rises in proportion.', fig: 'unit-cost' },
    restart: { what: 'One-off costs to get running again after the stop: scrapped start-up parts, cleaning, re-qualification and call-out charges.', tip: 'Enter the total for this stoppage, not a rate per hour.', effect: 'Added once to the total cost.', fig: 'money' },
  },
  'yield-check': {
    started: { what: 'The number of units that entered the process in the period, whether they finished good, were reworked or were scrapped.', tip: 'Count units started, not units finished; yields are measured against this.', effect: 'Both yields fall as more units are started for the same good output.', fig: 'count' },
    good: { what: 'Units that ended up acceptable, including those that needed rework to get there.', tip: 'It cannot exceed units started; the tool flags the data if it does.', effect: 'Final yield is good ÷ started.', fig: 'count' },
    firstPass: { what: 'Units that were acceptable the first time through, with no rework, repair or retest.', tip: 'It cannot exceed good units; reworked units count in good, not here.', effect: 'First-pass yield is this ÷ started; good minus this gives reworked units.', fig: 'count' },
  },
});
