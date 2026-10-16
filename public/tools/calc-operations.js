// KEVOS® WORKOS calculations: Operations.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'capacity': {
      const minutes = val('hours') * 60 * val('machines') * (val('efficiency') / 100), cap = minutes / Math.max(0.001, val('cycle')), util = (val('demand') / Math.max(0.001, cap)) * 100;
      return result(util <= 85 ? 'AVAILABLE CAPACITY' : util <= 100 ? 'TIGHT CAPACITY' : 'CAPACITY SHORTFALL', utilTone(util), `Practical capacity is about ${num(cap, 0)} units for the period; demand uses ${pct(util)} of it.`,
        [m('Practical capacity', `${num(cap, 0)} units`), m('Demand', `${num(val('demand'), 0)} units`), m('Utilisation', pct(util)), m('Buffer / shortfall', `${num(cap - val('demand'), 0)} units`)],
        util > 100 ? 'Increase effective time, add parallel capacity, improve efficiency or cycle time, or reduce or move demand.' : util > 85 ? 'Protect the plan against downtime and variation; the buffer is limited.' : 'There is a reasonable capacity buffer under these assumptions.',
        {
          primary: primary('Utilisation', util, 'pct'),
          checks: [
            check('Capacity covers demand', util <= 85 ? 'pass' : util <= 100 ? 'warn' : 'fail', `${pct(util)} utilisation.`),
            check('Efficiency realistic', val('efficiency') > 90 ? 'warn' : 'pass', `${pct(val('efficiency'))} assumed; sustained values above 90% are uncommon outside highly automated lines.`),
            check('Cycle time measured', 'verify', 'Use measured cycle time at the constraint, including handling, not the theoretical machine time.'),
          ],
          actions: ['Plan to about 85% utilisation to absorb breakdowns and variation.', 'Use the bottleneck tool if several process steps share the load.'],
        });
    }
    case 'bottleneck': {
      const takt = val('available') / Math.max(1, val('demand'));
      const steps = [['Step A', val('stepA')], ['Step B', val('stepB')], ['Step C', val('stepC')]].filter((s) => s[1] > 0);
      if (!steps.length) return result('ENTER CYCLE TIMES', 'warn', 'Enter at least one step cycle time.');
      const bn = [...steps].sort((a, b) => b[1] - a[1])[0], ratio = (bn[1] / takt) * 100;
      const balance = (steps.reduce((s, x) => s + x[1], 0) / (steps.length * bn[1])) * 100, dailyCap = val('available') / bn[1];
      return result(bn[1] > takt ? `${bn[0].toUpperCase()} IS THE CONSTRAINT` : `${bn[0].toUpperCase()} LEADS, ALL MEET TAKT`, bn[1] > takt ? 'bad' : 'good', `${bn[0]} has the longest cycle (${num(bn[1], 2)} min) against a required takt of ${num(takt, 2)} min/unit.`,
        [m('Required takt', `${num(takt, 2)} min`), m('Constraint cycle', `${num(bn[1], 2)} min`), m('Constraint load vs takt', pct(ratio)), m('Line capacity', `${num(dailyCap, 0)} units/day`), m('Line balance efficiency', pct(balance))],
        bn[1] > takt ? `${bn[0]} cannot meet takt; improve it first. Improving other steps will not raise output.` : 'All steps are within takt; check variation and downtime before concluding there is no constraint.',
        {
          primary: primary('Constraint load vs takt', ratio, 'pct'),
          table: { caption: 'Step loading against takt', head: ['Step', 'Cycle (min)', '% of takt', 'Status'], rows: steps.map(([n, c]) => [n, num(c, 2), pct((c / takt) * 100), c > takt ? 'Over takt' : c > 0.9 * takt ? 'Near takt' : 'OK']) },
          checks: [
            check('Constraint meets takt', ratio <= 90 ? 'pass' : ratio <= 100 ? 'warn' : 'fail', `${pct(ratio)} of takt.`),
            check('Line balance', balance >= 85 ? 'pass' : 'warn', `${pct(balance)}: lower values mean idle time at faster steps.`),
            check('Cycle times include variation', 'verify', 'Use observed cycle times over several cycles, not best-case times.'),
          ],
          actions: ['Remove waiting and non-value work at the constraint; protect it from starvation.', 'Rebalance work content between steps if line balance is low.'],
        });
    }
    case 'takt-time': {
      const t = val('available') / Math.max(1, val('demand'));
      return result(`${num(t, 2)} MIN / UNIT`, 'good', `The process must complete one unit every ${num(t, 2)} minutes (${num(t * 60, 0)} s) to meet demand.`,
        [m('Available time', `${num(val('available'), 0)} min`), m('Demand', `${num(val('demand'), 0)} units`), m('Takt time', `${num(t, 2)} min/unit`), m('Required rate', `${num(60 / t, 1)} units/hr`)],
        'Compare the constraint’s actual cycle time with takt, using net available production time rather than paid shift time.',
        {
          primary: primary('Takt time', t, 'minutes'),
          checks: [
            check('Available time is net', 'verify', 'Deduct breaks, meetings and planned maintenance from shift time.'),
            check('Demand matches the same period', 'verify', 'Demand and available time must refer to the same period (for example one day).'),
          ],
          actions: ['Use the cycle-time tool to compare actual cycle times with this takt.'],
        });
    }
    case 'oee': {
      const a = val('availability'), p = val('performance'), q = val('quality'), o = (a * p * q) / 10000;
      const losses = [['Availability', 100 - a], ['Performance', 100 - p], ['Quality', 100 - q]].sort((x, y) => y[1] - x[1]);
      return result(o >= 85 ? 'WORLD-CLASS RANGE' : o >= 65 ? 'IMPROVEMENT AVAILABLE' : 'LOW OEE', o >= 85 ? 'good' : o >= 65 ? 'warn' : 'bad', `OEE is ${pct(o)}. The largest loss is ${losses[0][0].toLowerCase()} (${pct(losses[0][1])}).`,
        [m('Availability', pct(a)), m('Performance', pct(p)), m('Quality', pct(q)), m('OEE', pct(o))],
        `Start with ${losses[0][0].toLowerCase()} losses; improving the weakest factor raises OEE fastest.`,
        {
          primary: primary('OEE', o, 'pct'),
          table: { caption: 'Losses by factor', head: ['Factor', 'Value', 'Loss'], rows: [['Availability', pct(a), pct(100 - a)], ['Performance', pct(p), pct(100 - p)], ['Quality', pct(q), pct(100 - q)]] },
          checks: [
            check('Factors measured from production data', 'verify', 'Use logged run time, counts and ideal cycle time; the detailed OEE tool calculates the factors for you.'),
            check('Benchmark context', 'pass', 'The 85% figure is a widely quoted world-class benchmark for discrete manufacturing, not a target for every process.'),
          ],
          actions: ['Track the three factors separately over time.', 'Use the OEE and Downtime Analysis tool to calculate them from raw data.'],
        });
    }
    case 'cycle-time': {
      const req = val('available') / Math.max(1, val('demand')), act = val('actual'), head = req - act, cap = act > 0 ? val('available') / act : Infinity;
      return result(head >= 0 ? 'MEETS REQUIRED PACE' : 'TOO SLOW', head >= 0 ? (head / req < 0.1 ? 'warn' : 'good') : 'bad', `Required cycle is ${num(req, 2)} min/unit against an actual ${num(act, 2)} min/unit.`,
        [m('Required cycle (takt)', `${num(req, 2)} min`), m('Actual cycle', `${num(act, 2)} min`), m('Headroom', `${num(head, 2)} min`), m('Output at actual cycle', Number.isFinite(cap) ? `${num(cap, 0)} units` : '—')],
        head < 0 ? 'Reduce cycle time, add parallel capacity or increase available net time.' : head / req < 0.1 ? 'Pace is met with under 10% headroom; variation could cause misses.' : 'The current cycle time is fast enough for the entered demand.',
        {
          primary: primary('Headroom (takt − actual)', head, 'minutes'),
          checks: [
            check('Actual cycle within takt', head >= 0 ? (head / req < 0.1 ? 'warn' : 'pass') : 'fail', `${pct((act / req) * 100)} of takt.`),
            check('Actual cycle time measured', 'verify', 'Time several cycles and use a representative (not best) value.'),
          ],
          actions: ['If too slow, study the work content and waiting within the cycle.'],
        });
    }
    case 'staffing-need': {
      const hours = (val('demand') * val('labourMin')) / 60, per = val('hoursPerson') * (val('efficiency') / 100), people = hours / Math.max(0.01, per);
      return result(`${Math.ceil(people)} ${Math.ceil(people) === 1 ? 'PERSON' : 'PEOPLE'}`, 'good', `Calculated requirement is ${num(people, 2)} full-time equivalents for the period.`,
        [m('Workload', `${num(hours, 1)} hr`), m('Productive hours / person', `${num(per, 1)} hr`), m('FTE requirement', num(people, 2)), m('Whole people', Math.ceil(people))],
        'Rounding up is a screen only; account for skill mix, coverage, supervision, leave and variation.',
        {
          primary: primary('FTE requirement', people),
          checks: [
            check('Labour minutes are standard times', 'verify', 'Use work-measured or observed standard minutes per unit.'),
            check('Coverage for leave and absence', 'verify', 'Add relief for leave, training and absence if available hours are not already net of them.'),
            check('Rounding margin', Math.ceil(people) - people < 0.15 && people > 0 ? 'warn' : 'pass', `${num(Math.ceil(people) - people, 2)} FTE spare after rounding.`),
          ],
          actions: ['Cross-check against the skills matrix before recruiting.'],
        });
    }
    case 'shift-output': {
      const net = val('shift') * 60 - val('breaks'), theo = (Math.max(0, net) * val('stations')) / Math.max(0.01, val('cycle')), out = theo * (val('efficiency') / 100);
      return result(`${num(out, 0)} UNITS / SHIFT`, net > 0 ? 'good' : 'bad', `Expected practical output from ${num(Math.max(0, net), 0)} net minutes at ${pct(val('efficiency'))} efficiency.`,
        [m('Net time', `${num(net, 0)} min`), m('Theoretical output', `${num(theo, 0)} units`), m('Practical output', `${num(out, 0)} units`), m('Hourly rate', `${num(net > 0 ? (out / net) * 60 : 0, 1)} units/hr`)],
        'Count unplanned downtime and changeovers either in efficiency or as explicit lost time, not both.',
        {
          primary: primary('Practical output per shift', out, 'units'),
          checks: [
            check('Net time positive', net > 0 ? 'pass' : 'fail', `${num(net, 0)} minutes after breaks and planned stops.`),
            check('Efficiency realistic', val('efficiency') > 90 ? 'warn' : 'pass', `${pct(val('efficiency'))} assumed.`),
          ],
          actions: ['Compare with actual output over several shifts to calibrate efficiency.'],
        });
    }
    case 'oee-downtime-pro': {
      const planned = Math.max(1, val('plannedMin')), down = Math.min(val('downtimeMin'), planned), run = planned - down, ideal = val('idealCycle'), total = val('totalCount'), good = val('goodCount');
      const A = run / planned, Praw = run > 0 ? (ideal * total) / (run * 60) : 0, P = Math.min(1, Math.max(0, Praw)), Q = total > 0 ? Math.min(1, good / total) : 0, oee = A * P * Q * 100;
      const perfLoss = Math.max(0, run - (ideal * total) / 60), qualLoss = (ideal * Math.max(0, total - good)) / 60, fpt = (ideal * Math.min(good, total)) / 60, cost = (down / 60) * val('downtimeRate');
      const dataOk = Praw <= 1 && good <= total && val('downtimeMin') <= val('plannedMin');
      return result(!dataOk ? 'CHECK THE DATA' : oee >= 85 ? 'WORLD-CLASS RANGE' : oee >= 65 ? 'IMPROVEMENT OPPORTUNITY' : 'PRIORITY LOSS', !dataOk ? 'warn' : oee >= 85 ? 'good' : oee >= 65 ? 'warn' : 'bad', `OEE ${pct(oee)} for the period (availability ${pct(A * 100)}, performance ${pct(P * 100)}, quality ${pct(Q * 100)}).`,
        [m('Availability', pct(A * 100)), m('Performance', pct(P * 100)), m('Quality', pct(Q * 100)), m('OEE', pct(oee)), m('Fully productive time', `${num(fpt, 0)} min`), m('Downtime cost', money(cost))],
        oee < 85 ? 'Attack the largest loss in the table first, then re-measure.' : 'Hold the result by tracking the three factors and investigating any deterioration early.',
        {
          primary: primary('OEE', oee, 'pct'),
          table: { caption: 'Where the planned time went', head: ['Time category', 'Minutes', 'Share of planned'], rows: [['Downtime (availability loss)', num(down, 0), pct((down / planned) * 100)], ['Slow running and small stops (performance loss)', num(perfLoss, 0), pct((perfLoss / planned) * 100)], ['Defects and rework (quality loss)', num(qualLoss, 0), pct((qualLoss / planned) * 100)], ['Fully productive time', num(fpt, 0), pct((fpt / planned) * 100)]] },
          checks: [
            check('Performance not above 100%', Praw <= 1 ? 'pass' : 'fail', Praw <= 1 ? `${pct(Praw * 100)}.` : `Calculated ${pct(Praw * 100)}: the ideal cycle time is too long or the count is wrong. Performance is capped at 100% in the OEE.`),
            check('Good units not more than total', good <= total ? 'pass' : 'fail', `${num(good, 0)} good of ${num(total, 0)} produced.`),
            check('Downtime within planned time', val('downtimeMin') <= val('plannedMin') ? 'pass' : 'fail', `${num(val('downtimeMin'), 0)} of ${num(planned, 0)} minutes.`),
            check('Ideal cycle time source', 'verify', 'Use the design or demonstrated best cycle time, not the standard or average.'),
          ],
          actions: ['Log downtime by reason code to find the biggest availability loss.', 'Separate rework from scrap to see first-pass quality.'],
        });
    }
  }
  return null;
});
