// KEVOS® WORKOS calculations: Planning.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'demand-capacity': {
      const util = (val('demand') / Math.max(0.01, val('capacity'))) * 100, buf = val('capacity') - val('demand');
      return result(util <= 85 ? 'COMFORTABLE' : util <= 100 ? 'TIGHT' : 'SHORTFALL', utilTone(util), `Demand uses ${pct(util)} of practical capacity.`,
        [m('Demand', num(val('demand'), 0)), m('Capacity', num(val('capacity'), 0)), m('Buffer / shortfall', num(buf, 0)), m('Utilisation', pct(util))],
        util > 100 ? 'Capacity is below demand; change capacity, schedule, demand or sourcing.' : util > 85 ? 'Plan for variation; the buffer is limited.' : 'Capacity provides a reasonable buffer.',
        {
          primary: primary('Utilisation', util, 'pct'),
          checks: [
            check('Capacity covers demand', util <= 85 ? 'pass' : util <= 100 ? 'warn' : 'fail', `${pct(util)}.`),
            check('Capacity is practical, not theoretical', 'verify', 'Use demonstrated output after downtime, changeovers and absence.'),
          ],
          actions: ['Check the constraint resource with the capacity or bottleneck tools.'],
        });
    }
    case 'deadline-check': {
      const perDay = (val('hoursDay') * 60 * val('machines') * (val('efficiency') / 100)) / Math.max(0.01, val('cycle'));
      const cap = perDay * val('days'), gap = cap - val('qty'), need = perDay > 0 ? val('qty') / perDay : Infinity;
      return result(gap >= 0 ? 'ACHIEVABLE' : 'NOT ACHIEVABLE', gap >= 0 ? (gap / Math.max(1, val('qty')) < 0.1 ? 'warn' : 'good') : 'bad', `About ${num(cap, 0)} units can be made in ${num(val('days'), 0)} days; the requirement needs ${Number.isFinite(need) ? num(need, 1) : '—'} days.`,
        [m('Required', num(val('qty'), 0)), m('Deliverable', num(cap, 0)), m('Buffer / shortfall', num(gap, 0)), m('Days needed', Number.isFinite(need) ? num(need, 1) : '—'), m('Output / day', num(perDay, 0))],
        gap < 0 ? 'The resources and time cannot meet the quantity; add capacity, cut cycle time, add hours or days, or change the requirement.' : 'Achievable under these assumptions; protect the plan from disruption.',
        {
          primary: primary('Buffer (deliverable − required)', gap, 'units'),
          checks: [
            check('Quantity achievable', gap >= 0 ? (gap / Math.max(1, val('qty')) < 0.1 ? 'warn' : 'pass') : 'fail', gap >= 0 ? `${pct((gap / Math.max(1, val('qty'))) * 100)} spare.` : `${num(-gap, 0)} units short.`),
            check('Materials and labour available', 'verify', 'Machine time alone does not guarantee delivery; confirm materials and people.'),
          ],
          actions: ['Agree the delivery date only after confirming materials and the constraint resource.'],
        });
    }
    case 'workload': {
      const cap = val('people') * val('hours'), util = (val('work') / Math.max(1, cap)) * 100;
      return result(util <= 85 ? 'AVAILABLE' : util <= 100 ? 'FULL' : 'OVERLOADED', utilTone(util), `Planned work uses ${pct(util)} of team capacity.`,
        [m('Work', `${num(val('work'), 0)} hr`), m('Capacity', `${num(cap, 0)} hr`), m('Utilisation', pct(util)), m('Buffer', `${num(cap - val('work'), 0)} hr`)],
        util > 100 ? 'Remove, defer or reassign work, add capacity or extend the window.' : util > 85 ? 'There is little allowance for unplanned work.' : 'A reasonable planning buffer remains.',
        {
          primary: primary('Utilisation', util, 'pct'),
          checks: [
            check('Workload within capacity', util <= 85 ? 'pass' : util <= 100 ? 'warn' : 'fail', `${pct(util)}.`),
            check('Hours net of leave and meetings', 'verify', 'Use available hours after leave, meetings and support work.'),
          ],
          actions: ['Review individual loads too; a balanced total can hide overloaded people.'],
        });
    }
    case 'what-if': {
      const base = val('volume') * (val('price') - val('cost')) - val('fixed');
      const v = val('volume') * (1 + val('volChange') / 100), p = val('price') * (1 + val('priceChange') / 100), c = val('cost') * (1 + val('costChange') / 100);
      const scen = v * (p - c) - val('fixed'), delta = scen - base, beBase = val('price') - val('cost') > 0 ? val('fixed') / (val('price') - val('cost')) : Infinity, beScen = p - c > 0 ? val('fixed') / (p - c) : Infinity;
      return result(delta >= 0 ? 'IMPROVES PROFIT' : 'REDUCES PROFIT', delta >= 0 ? 'good' : 'bad', `The scenario changes profit by ${money(delta)} (${base !== 0 ? pct((delta / Math.abs(base)) * 100) : '—'}).`,
        [m('Base profit', money(base)), m('Scenario profit', money(scen)), m('Change', money(delta)), m('Scenario volume', num(v, 0))],
        'Test several scenarios to find which assumption has the most leverage on profit.',
        {
          primary: primary('Scenario profit', scen, 'money'),
          table: { caption: 'Base vs scenario', head: ['Measure', 'Base', 'Scenario'], rows: [['Volume', num(val('volume'), 0), num(v, 0)], ['Price', money(val('price')), money(p)], ['Variable cost', money(val('cost')), money(c)], ['Contribution / unit', money(val('price') - val('cost')), money(p - c)], ['Fixed cost', money(val('fixed')), money(val('fixed'))], ['Profit', money(base), money(scen)], ['Break-even volume', Number.isFinite(beBase) ? num(beBase, 0) : '—', Number.isFinite(beScen) ? num(beScen, 0) : '—']] },
          checks: [
            check('Scenario stays profitable', scen > 0 ? 'pass' : 'fail', money(scen)),
            check('Fixed costs unchanged by the scenario', 'verify', 'Large volume changes often need extra capacity, which changes fixed cost.'),
            check('Price change effect on volume', 'verify', 'Price and volume changes usually interact; check customer response.'),
          ],
          actions: ['Run the break-even tool on the scenario prices.'],
        });
    }
    case 'capacity-planner-pro': {
      const seconds = val('machines') * val('shifts') * val('hoursShift') * 3600 * val('days'), theoretical = seconds / Math.max(0.01, val('cycleSec'));
      const effective = (theoretical * clamp(val('uptime'), 0, 100)) / 100, demand = val('demand'), load = (demand / Math.max(1, effective)) * 100, gap = effective - demand;
      return result(load <= 85 ? 'CAPACITY AVAILABLE' : load <= 100 ? 'TIGHT CAPACITY' : 'CAPACITY SHORTFALL', utilTone(load), `Demand uses about ${pct(load)} of effective monthly capacity.`,
        [m('Theoretical capacity', num(theoretical, 0)), m('Effective capacity', num(effective, 0)), m('Demand', num(demand, 0)), m('Capacity gap', num(gap, 0)), m('Load', pct(load))],
        load > 100 ? 'Increase uptime, cut cycle time, add shifts or assets, outsource overflow or smooth demand before committing dates.' : load > 85 ? 'Little buffer remains for changeovers, breakdowns, absence or demand variation.' : 'The capacity buffer appears reasonable.',
        {
          primary: primary('Load', load, 'pct'),
          table: { caption: 'Capacity options (one change at a time)', head: ['Option', 'Effective capacity', 'Load'], rows: [['As entered', num(effective, 0), pct(load)], ['One extra shift / day', num((effective * (val('shifts') + 1)) / Math.max(1, val('shifts')), 0), pct((demand / Math.max(1, (effective * (val('shifts') + 1)) / Math.max(1, val('shifts')))) * 100)], ['Uptime +5 points', num((theoretical * clamp(val('uptime') + 5, 0, 100)) / 100, 0), pct((demand / Math.max(1, (theoretical * clamp(val('uptime') + 5, 0, 100)) / 100)) * 100)], ['Cycle time −10%', num(effective / 0.9, 0), pct((demand / Math.max(1, effective / 0.9)) * 100)]] },
          checks: [
            check('Capacity covers demand', load <= 85 ? 'pass' : load <= 100 ? 'warn' : 'fail', `${pct(load)} load.`),
            check('Uptime from records', 'verify', 'Use measured uptime (or availability × performance) rather than an aspiration.'),
            check('Labour for extra shifts', 'verify', 'Extra shifts need trained people, supervision and maintenance cover.'),
          ],
          actions: ['Compare the options in the table, then cost the preferred one.'],
        });
    }
  }
  return null;
});
