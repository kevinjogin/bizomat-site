// KEVOS® WORKOS input guides: Planning. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-planning.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  'demand-capacity': {
    demand: { what: 'The number of units customers have ordered or are forecast to need in the planning period.', tip: 'Use the same period and the same unit of output as the capacity figure.', effect: 'Utilisation rises in proportion; buffer falls unit for unit.', fig: 'count' },
    capacity: { what: 'The output the operation has actually shown it can deliver in the same period, after normal downtime, changeovers and absence.', tip: 'Use demonstrated output, not nameplate or theoretical capacity, which overstates what you can make.', effect: 'More capacity lowers utilisation and raises the buffer.', fig: 'count' },
  },
  'deadline-check': {
    qty: { what: 'The number of units that must be finished by the deadline.', tip: 'Add an allowance for expected scrap if the quantity is for good units.', effect: 'Days needed rise in proportion; the buffer falls unit for unit.', fig: 'count' },
    cycle: { what: 'The time one resource takes to complete one unit, measured at the constraint step of the process.', tip: 'Enter minutes per unit on one resource, not the combined rate of all resources.', effect: 'Output per day falls in proportion as cycle time grows.', fig: 'time' },
    machines: { what: 'The number of machines, cells or people who can each make the product at the same time, so their output adds together.', tip: 'Count only resources free for this job for the whole period.', effect: 'Output per day rises in proportion.', fig: 'count' },
    hoursDay: { what: 'The hours each resource is scheduled to work on a working day, including any planned overtime.', tip: 'Use scheduled hours; efficiency then takes off the time lost to stops and slow running.', effect: 'Output per day rises in proportion.', fig: 'time' },
    days: { what: 'The number of working days between now and the deadline, leaving out weekends, public holidays and shutdowns.', tip: 'Allow for time after production, such as inspection, packing and dispatch, before the due date.', effect: 'Deliverable quantity rises in proportion; days needed does not change.', fig: 'time' },
    efficiency: { what: 'The share of scheduled hours that turns into good output after breakdowns, changeovers, slow running and scrap, from recent performance.', tip: 'Use demonstrated efficiency, not a target. Type the percentage (85 for 85 %).', effect: 'Output per day rises in proportion.', fig: 'efficiency', sym: 'η' },
  },
  workload: {
    work: { what: 'The total hours of work planned for the team in the period, added up from the task list, schedule or work orders.', tip: 'Include routine and support work, not only project tasks.', effect: 'Utilisation rises in proportion.', fig: 'time' },
    people: { what: 'The number of people in the team who share the planned work in the period.', tip: 'The total can hide one overloaded person; check individual loads as well.', effect: 'Team capacity rises in proportion.', fig: 'count' },
    hours: { what: 'The net hours each person can give to the planned work across the period, after leave, meetings, training and other duties.', tip: 'This is hours across the whole period, not per week; paid hours overstate capacity.', effect: 'Team capacity rises in proportion; utilisation falls.', fig: 'time' },
  },
  'what-if': {
    volume: { what: 'The number of units sold in the period in the current or budget position, before the scenario changes are applied.', tip: 'Use the same period as the fixed costs.', effect: 'Base profit changes by one contribution per unit for each unit of volume.', fig: 'count', sym: 'Q' },
    price: { what: 'The net amount received for one unit today, after discounts and rebates, excluding GST.', tip: 'Use the price actually achieved, not the list price.', effect: 'Each dollar of price adds one dollar of profit per unit sold.', fig: 'unit-cost', sym: 'P' },
    cost: { what: 'The cost that rises with each extra unit sold today: materials, direct labour paid per unit, packaging, freight and commission.', tip: 'Keep fixed costs out of this figure; they are entered separately.', effect: 'Each dollar of variable cost removes one dollar of profit per unit sold.', fig: 'unit-cost', sym: 'V' },
    fixed: { what: 'Costs for the period that do not change with volume, such as rent, salaries, insurance and depreciation. They are held the same in the scenario.', tip: 'If the scenario would need extra staff or equipment, this tool will not show it; fixed cost stays constant.', effect: 'Lowers base and scenario profit equally, so it does not change the profit difference.', fig: 'money', sym: 'F' },
    volChange: { what: 'How much the scenario changes sales volume from the base, as a percentage. Use a negative number for a fall.', tip: 'Type −10 for a 10 % fall. The tool does not link volume to price; set both if a price change would move volume.', effect: 'Scenario volume = base × (1 + change %).', fig: 'percent' },
    priceChange: { what: 'How much the scenario changes the unit price from the base, as a percentage. Use a negative number for a price cut.', tip: 'Type −5 for a 5 % cut. Volume is not adjusted automatically when price changes.', effect: 'Scenario price = base × (1 + change %).', fig: 'percent' },
    costChange: { what: 'How much the scenario changes the variable cost per unit from the base, as a percentage. Use a negative number for a saving.', tip: 'Type −3 for a 3 % saving. Fixed cost is not affected by this change.', effect: 'Scenario unit cost = base × (1 + change %).', fig: 'percent' },
  },
  'capacity-planner-pro': {
    machines: { what: 'The number of machines or production lines that can make this product family, working in parallel.', tip: 'Count only assets that can run the product at the entered cycle time.', effect: 'Capacity rises in proportion.', fig: 'count' },
    shifts: { what: 'How many shifts each machine or line runs on a working day.', tip: 'Use the shift pattern you can actually staff, not the one you hope to run.', effect: 'Capacity rises in proportion; the options table shows one extra shift.', fig: 'count' },
    hoursShift: { what: 'The productive hours in one shift after planned breaks and meetings.', tip: 'Take breaks off the shift length; uptime then covers breakdowns and changeovers.', effect: 'Capacity rises in proportion.', fig: 'time' },
    days: { what: 'The number of days a month the machines run, after weekends, public holidays and planned shutdowns.', tip: 'Use the days for the month you are planning; it varies month to month.', effect: 'Capacity rises in proportion.', fig: 'time' },
    uptime: { what: 'The share of scheduled time the machines actually produce at rate, after breakdowns, changeovers and slow running, from measured records.', tip: 'Use measured uptime, or availability × performance from OEE data; do not include quality losses unless demand is in good units.', effect: 'Effective capacity rises in proportion.', fig: 'efficiency' },
    cycleSec: { what: 'The average time one machine takes to produce one unit, across the product mix in the family.', tip: 'Enter seconds per unit, not minutes. Weight the average by the volume of each product.', effect: 'Capacity falls in proportion as cycle time grows.', fig: 'time' },
    demand: { what: 'The number of units required in the month, from orders and the forecast.', tip: 'Use monthly demand to match working days per month.', effect: 'Load rises in proportion; capacity does not change.', fig: 'count' },
  },
});
