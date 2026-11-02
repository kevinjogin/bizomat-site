// KEVOS® calculations: Improvement.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'improvement-value': {
      const saveMin = Math.max(0, val('old') - val('new')), hours = (saveMin * val('freq') * val('weeks')) / 60, saving = hours * val('rate'), pay = saving > 0 ? val('cost') / saving : Infinity;
      return result(money(saving), saving > 0 ? 'good' : 'warn', `${num(hours, 1)} hours a year released, worth ${money(saving)} at the loaded labour rate.`,
        [m('Time saved / occurrence', `${num(saveMin, 1)} min`), m('Hours released', `${num(hours, 1)} hr/year`), m('Annual value', money(saving)), m('Payback', Number.isFinite(pay) ? `${num(pay * 12, 1)} months` : '—')],
        'Released time is not automatically a cash saving; show whether it avoids cost, raises output or frees capacity for other work.',
        {
          primary: primary('Annual value', saving, 'money'),
          checks: [
            check('Time saving measured', 'verify', 'Time the task before and after the change over several repetitions.'),
            check('Released time is used', 'verify', 'Name the work the released hours will do, or the cost they avoid.'),
            check('Pays back within a year', pay <= 1 ? 'pass' : Number.isFinite(pay) ? 'warn' : 'fail', Number.isFinite(pay) ? `${num(pay * 12, 1)} months.` : 'No saving entered.'),
          ],
          actions: ['Standardise the improved method so the saving sticks.'],
        });
    }
    case 'waste-check': {
      const keys = ['transport', 'inventory', 'motion', 'waiting', 'overproduction', 'overprocess', 'defects', 'talent'];
      const names = ['Transport', 'Inventory', 'Motion', 'Waiting', 'Overproduction', 'Over-processing', 'Defects', 'Unused talent'];
      const arr = keys.map((k, i) => [names[i], val(k)]).sort((a, b) => b[1] - a[1]), avg = arr.reduce((s, x) => s + x[1], 0) / arr.length;
      const top = arr.filter((x) => x[1] === arr[0][1]).map((x) => x[0]);
      return result(top.length > 1 ? 'SEVERAL WASTES TIED' : arr[0][0].toUpperCase(), avg <= 2 ? 'good' : avg <= 3.5 ? 'warn' : 'bad', `${top.join(', ')} ${top.length > 1 ? 'are' : 'is'} the strongest reported waste signal; average ${num(avg, 1)}/5.`,
        [m('Top waste', top.join(', ')), m('Top score', `${arr[0][1]}/5`), m('Average waste', `${num(avg, 1)}/5`), m('Second', arr[1][0])],
        'Observe the process directly (go and see) and quantify the top waste before choosing countermeasures.',
        {
          primary: primary('Average waste score', avg),
          table: { caption: 'Waste ranking', head: ['Waste', 'Score (1–5)'], rows: arr.map(([n, s]) => [n, s]) },
          checks: [
            check('Scores based on observation', 'verify', 'Rate after walking the process with the people who do the work.'),
            check('Defects and safety first', val('defects') >= 4 ? 'warn' : 'pass', 'High defect waste usually takes priority because it affects customers.'),
          ],
          actions: ['Measure the top waste (time, distance, inventory or defect count) to set a baseline.', 'Use the before-and-after tool to confirm the improvement.'],
        });
    }
    case 'before-after': {
      const time = ((val('oldTime') - val('newTime')) / Math.max(0.01, val('oldTime'))) * 100, cost = ((val('oldCost') - val('newCost')) / Math.max(0.01, val('oldCost'))) * 100, def = val('oldDefect') - val('newDefect');
      const dirs = [time, cost, def], better = dirs.filter((x) => x > 0).length, worse = dirs.filter((x) => x < 0).length;
      const txt = worse === 0 && better > 0 ? 'IMPROVED' : better === 0 && worse === 0 ? 'UNCHANGED' : better > 0 && worse > 0 ? 'MIXED RESULT' : 'WORSE';
      const tone = txt === 'IMPROVED' ? 'good' : txt === 'WORSE' ? 'bad' : 'warn';
      const fmt = (v) => (v === 0 ? 'no change' : `${pct(Math.abs(v))} ${v > 0 ? 'better' : 'worse'}`);
      return result(txt, tone, `${better} of 3 measures improved, ${worse} got worse.`,
        [m('Cycle time', fmt(time)), m('Unit cost', fmt(cost)), m('Defect rate', `${num(Math.abs(def), 1)} points ${def > 0 ? 'better' : def < 0 ? 'worse' : 'no change'}`), m('Direction', txt.toLowerCase())],
        txt === 'MIXED RESULT' ? 'Investigate the measure that got worse before standardising the change.' : 'Confirm the result over a representative period before standardising.',
        {
          primary: primary('Unit cost reduction', cost, 'pct'),
          table: { caption: 'Before and after', head: ['Measure', 'Before', 'After', 'Change'], rows: [['Cycle time (min)', num(val('oldTime'), 2), num(val('newTime'), 2), fmt(time)], ['Cost / unit', money(val('oldCost')), money(val('newCost')), fmt(cost)], ['Defect rate', pct(val('oldDefect')), pct(val('newDefect')), def === 0 ? 'no change' : `${num(Math.abs(def), 1)} points ${def > 0 ? 'better' : 'worse'}`]] },
          checks: [
            check('No measure got worse', worse === 0 ? 'pass' : 'warn', worse === 0 ? 'All measures held or improved.' : `${worse} measure(s) deteriorated.`),
            check('Comparable conditions', 'verify', 'Compare like with like: volume, product mix, staffing and operating conditions.'),
            check('Enough data', 'verify', 'Use enough samples for the difference to exceed normal variation.'),
          ],
          actions: ['Update the standard work once the improvement is confirmed.'],
        });
    }
    case 'automation-check': {
      const manual = val('hoursWeek') * val('rate') * val('weeks'), gross = (manual * val('reduction')) / 100, net = gross - val('maintenance'), pay = net > 0 ? val('investment') / net : Infinity;
      return result(net > 0 ? 'AUTOMATION CASE EXISTS' : 'WEAK AUTOMATION CASE', net > 0 ? 'good' : 'warn', `Estimated net annual benefit ${money(net)}; payback ${Number.isFinite(pay) ? `${num(pay, 2)} years` : 'not reached'}.`,
        [m('Manual annual cost', money(manual)), m('Labour cost removed', money(gross)), m('Net annual benefit', money(net)), m('Investment', money(val('investment'))), m('Payback', Number.isFinite(pay) ? `${num(pay, 2)} years` : '—')],
        'Include failure modes, support burden, process stability, safety and change management before automating.',
        {
          primary: primary('Net annual benefit', net, 'money'),
          checks: [
            check('Positive net benefit', net > 0 ? 'pass' : 'fail', money(net)),
            check('Process stable and standardised', 'verify', 'Automating an unstable process automates its problems; check with the process maturity tool.'),
            check('Safety risk assessment', 'verify', 'New machinery needs a hazard identification and risk assessment, guarding and safe-work procedures under WHS law.'),
            check('Labour reduction is real', 'verify', 'Confirm the hours removed will be redeployed or avoided.'),
          ],
          actions: ['Pilot the automation on one cell before scaling.', 'Use the business case tool for a discounted view over the asset life.'],
        });
    }
    case 'process-score': {
      const dims = [['Clarity', val('clarity')], ['Standardisation', val('standard')], ['Measurement', val('measure')], ['Ownership', val('ownership')], ['Improvement discipline', val('improve')]];
      const avg = dims.reduce((s, d) => s + d[1], 0) / dims.length, score = (avg / 5) * 100, low = [...dims].sort((a, b) => a[1] - b[1])[0];
      return result(avg >= 4 ? 'MATURE' : avg >= 3 ? 'DEVELOPING' : 'FRAGILE', avg >= 4 ? 'good' : avg >= 3 ? 'warn' : 'bad', `Process maturity ${num(score, 0)}/100; weakest dimension: ${low[0].toLowerCase()}.`,
        [m('Clarity', `${val('clarity')}/5`), m('Standardisation', `${val('standard')}/5`), m('Measurement', `${val('measure')}/5`), m('Ownership', `${val('ownership')}/5`), m('Improvement', `${val('improve')}/5`)],
        avg < 3 ? 'Agree a clear method, owner and measures before adding technology.' : `Make ${low[0].toLowerCase()} the next improvement focus.`,
        {
          primary: primary('Maturity score', score),
          checks: [
            check('No dimension critically weak', low[1] <= 1 ? 'fail' : low[1] === 2 ? 'warn' : 'pass', `${low[0]} ${low[1]}/5.`),
            check('Self-assessment bias', 'verify', 'Ask the people who run the process and a neutral reviewer to score independently.'),
          ],
          actions: [`Raise ${low[0].toLowerCase()} by one level within the next improvement cycle.`],
        });
    }
    case 'jig-fixture-roi': {
      const labour = (val('savingMin') / 60) * val('runsMonth') * val('labourRate'), monthly = labour + val('scrapSaving') - val('maintenance'), annual = monthly * 12;
      const payback = monthly > 0 ? val('investment') / monthly : Infinity, roi = val('investment') > 0 ? ((annual - val('investment')) / val('investment')) * 100 : 0;
      return result(monthly > 0 && payback <= 12 ? 'STRONG CASE' : monthly > 0 && payback <= 24 ? 'REVIEW / JUSTIFY' : 'WEAK CASE', monthly > 0 && payback <= 12 ? 'good' : monthly > 0 && payback <= 24 ? 'warn' : 'bad', monthly > 0 ? `Estimated payback ${num(payback, 1)} months.` : 'The entered savings do not recover the investment.',
        [m('Monthly labour saving', money(labour)), m('Net monthly benefit', money(monthly)), m('Annual benefit', money(annual)), m('Payback', Number.isFinite(payback) ? `${num(payback, 1)} months` : '—'), m('First-year ROI', pct(roi))],
        monthly <= 0 ? 'Recheck the time, quality and scrap benefits before investing.' : payback <= 12 ? 'The economics are attractive; confirm safety, quality, repeatability and expected usage before release.' : 'Consider a lower-cost design, higher utilisation or additional measurable benefits.',
        {
          primary: primary('Net monthly benefit', monthly, 'money'),
          checks: [
            check('Payback within 12 months (tool default)', payback <= 12 ? 'pass' : payback <= 24 ? 'warn' : 'fail', Number.isFinite(payback) ? `${num(payback, 1)} months; replace the 12 and 24-month bands with your own hurdle if different.` : 'No net benefit.'),
            check('Fixture design verified', 'verify', 'Confirm locating, clamping, operator safety and repeatability with a first-article trial.'),
            check('Usage will continue', 'verify', 'Confirm the part will run at this rate for longer than the payback period.'),
          ],
          actions: ['Measure the time saving on the first production runs.', 'Add the fixture to the preventive maintenance and calibration schedule.'],
        });
    }
  }
  return null;
});
