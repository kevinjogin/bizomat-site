// BIZOMAT calculations: Manufacturing.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'batch-fit': {
      const W = val('rackW'), H = val('rackH'), g = val('gap'), w = val('partW'), h = val('partH');
      const fit = (pw, ph) => {
        const cols = Math.max(0, Math.floor((W + g) / (pw + g))), rows = Math.max(0, Math.floor((H + g) / (ph + g)));
        return { cols, rows, qty: cols * rows };
      };
      const a = fit(w, h), b = fit(h, w), best = b.qty > a.qty ? { ...b, label: 'Rotated 90°' } : { ...a, label: 'As entered' };
      const used = best.qty > 0 ? ((best.qty * w * h) / (W * H)) * 100 : 0;
      return result(`${best.qty} PARTS`, best.qty > 0 ? 'good' : 'bad', best.qty > 0 ? `${best.cols} across × ${best.rows} high (${best.label.toLowerCase()} orientation).` : 'The part does not fit the usable rack area with this clearance.',
        [m('Across', best.cols), m('High', best.rows), m('Batch quantity', best.qty), m('Area used by parts', pct(used))],
        'This geometric screen does not check coating access, load rating, hook geometry, drainage, orientation rules or edge clearance.',
        {
          primary: primary('Parts per rack', best.qty, 'units'),
          table: { caption: 'Orientation comparison', head: ['Orientation', 'Across', 'High', 'Parts'], rows: [['As entered', a.cols, a.rows, a.qty], ['Rotated 90°', b.cols, b.rows, b.qty]] },
          checks: [
            check('Part fits the rack', best.qty > 0 ? 'pass' : 'fail', `${num(w, 0)} × ${num(h, 0)} mm part in ${num(W, 0)} × ${num(H, 0)} mm usable area.`),
            check('Rack load rating', 'verify', 'Confirm total part mass is within the rack and conveyor rating.'),
            check('Process access and drainage', 'verify', 'Confirm coating, plating or washing access and drainage for the spacing chosen.'),
          ],
          actions: ['Trial-load one rack before releasing the layout.'],
        });
    }
    case 'machine-load': {
      const req = (val('demand') * val('cycle')) / 60 / Math.max(0.01, val('efficiency') / 100), util = (req / Math.max(0.01, val('available'))) * 100;
      return result(util <= 85 ? 'AVAILABLE' : util <= 100 ? 'TIGHT' : 'OVERLOADED', utilTone(util), `Required machine time is ${num(req, 1)} hours: ${pct(util)} of the hours available.`,
        [m('Required hours', `${num(req, 1)} hr`), m('Available hours', `${num(val('available'), 1)} hr`), m('Utilisation', pct(util)), m('Hour buffer', `${num(val('available') - req, 1)} hr`)],
        util > 100 ? 'Demand exceeds practical machine time; add capacity, improve cycle or efficiency, or move load.' : util > 85 ? 'Capacity is sufficient but fragile to disruption.' : 'Available machine time provides a reasonable buffer.',
        {
          primary: primary('Utilisation', util, 'pct'),
          checks: [
            check('Machine time covers demand', util <= 85 ? 'pass' : util <= 100 ? 'warn' : 'fail', `${pct(util)}.`),
            check('Set-up time included', 'verify', 'Add changeover time to required hours if it is not inside the cycle time or efficiency.'),
          ],
          actions: ['Check whether any other parts share this machine in the same period.'],
        });
    }
    case 'scrap-impact': {
      const scrapU = (val('units') * val('scrap')) / 100, cost = scrapU * val('unitCost');
      return result(money(cost), cost > 0 ? 'warn' : 'good', `${num(scrapU, 0)} units scrapped at ${pct(val('scrap'))}, costing ${money(cost)} in direct cost.`,
        [m('Scrap units', num(scrapU, 0)), m('Scrap rate', pct(val('scrap'))), m('Direct scrap cost', money(cost)), m('Good output', num(val('units') - scrapU, 0))],
        'Direct cost understates the impact; add lost capacity, rework, delay, inspection, freight and customer effects where relevant.',
        {
          primary: primary('Direct scrap cost', cost, 'money'),
          checks: [
            check('Cost per unit is cost at point of scrap', 'verify', 'Use the cost accumulated up to the step where the part is scrapped, not only material.'),
            check('Scrap rate from records', 'verify', 'Use measured scrap over a representative period.'),
          ],
          actions: ['Pareto the scrap by cause and attack the largest category.', 'Use the downtime and yield tools to capture lost capacity.'],
        });
    }
    case 'setup-worth': {
      const saveMin = Math.max(0, val('current') - val('target')), saved = (saveMin / 60) * val('changes') * val('rate'), hours = (saveMin * val('changes')) / 60, pay = saved > 0 ? val('investment') / saved : Infinity;
      return result(saved > 0 ? 'SAVING AVAILABLE' : 'NO TIME SAVING', saved > 0 ? (pay <= 1 ? 'good' : 'warn') : 'warn', `Shorter set-ups release ${num(hours, 0)} hours a year, worth ${money(saved)}.`,
        [m('Minutes saved / changeover', num(saveMin, 0)), m('Hours released / year', `${num(hours, 0)} hr`), m('Annual value', money(saved)), m('Payback', Number.isFinite(pay) ? `${num(pay, 2)} years` : '—')],
        'Released set-up time is valuable only if it becomes useful production, smaller batches or avoided overtime.',
        {
          primary: primary('Annual value', saved, 'money'),
          checks: [
            check('Payback within a year', pay <= 1 ? 'pass' : Number.isFinite(pay) ? 'warn' : 'fail', Number.isFinite(pay) ? `${num(pay, 2)} years.` : 'No time saving entered.'),
            check('Freed time is used', 'verify', 'Show where the released hours go: more output, smaller batches or less overtime.'),
            check('Target set-up time is proven', 'verify', 'Trial the improved set-up method before relying on the target time.'),
          ],
          actions: ['Separate internal and external set-up steps and move work outside machine stoppage.', 'Standardise the improved set-up with a checklist.'],
        });
    }
    case 'tooling-payback': {
      const per = val('oldCost') - val('newCost'), annual = per * val('volume'), pay = annual > 0 ? val('tooling') / annual : Infinity, unitsToPay = per > 0 ? val('tooling') / per : Infinity;
      return result(annual > 0 ? (pay <= 1 ? 'FAST PAYBACK' : 'ECONOMIC SAVING') : 'NO UNIT SAVING', annual > 0 ? (pay <= 2 ? 'good' : 'warn') : 'bad', annual > 0 ? `Saves ${money(per)} a unit; the tooling pays back after ${num(unitsToPay, 0)} units (${num(pay, 2)} years).` : 'The new unit cost is not lower than the current cost.',
        [m('Saving / unit', money(per)), m('Annual saving', money(annual)), m('Tooling', money(val('tooling'))), m('Units to pay back', Number.isFinite(unitsToPay) ? num(unitsToPay, 0) : '—'), m('Payback', Number.isFinite(pay) ? `${num(pay, 2)} years` : '—')],
        'Include tool maintenance, life, scrap and quality effects for a full investment case.',
        {
          primary: primary('Annual saving', annual, 'money'),
          checks: [
            check('Unit cost falls', per > 0 ? 'pass' : 'fail', money(per)),
            check('Tool life exceeds payback quantity', 'verify', Number.isFinite(unitsToPay) ? `The tool must survive at least ${num(unitsToPay, 0)} units (plus maintenance) to pay back.` : 'Not applicable.'),
            check('Demand will last', 'verify', 'Confirm the part will be made for longer than the payback period.'),
          ],
          actions: ['Confirm the new unit cost with a trial or supplier quotation.'],
        });
    }
    case 'downtime-cost': {
      const lost = val('hours') * val('contribution'), lab = val('hours') * val('idlePeople') * val('labourRate'), tot = lost + lab + val('restart');
      return result(money(tot), tot > 0 ? 'bad' : 'good', `Estimated economic cost of ${num(val('hours'), 1)} hours of downtime.`,
        [m('Lost contribution', money(lost)), m('Idle labour', money(lab)), m('Restart / recovery', money(val('restart'))), m('Estimated total', money(tot)), m('Cost per downtime hour', money(val('hours') > 0 ? tot / val('hours') : 0))],
        'Do not double-count labour if the contribution-per-hour figure already includes it.',
        {
          primary: primary('Total downtime cost', tot, 'money'),
          table: { caption: 'Cost composition', head: ['Element', 'Cost', 'Share'], rows: [['Lost contribution', money(lost), pct(tot > 0 ? (lost / tot) * 100 : 0)], ['Idle labour', money(lab), pct(tot > 0 ? (lab / tot) * 100 : 0)], ['Restart / recovery', money(val('restart')), pct(tot > 0 ? (val('restart') / tot) * 100 : 0)]] },
          checks: [
            check('Lost output not recovered later', 'verify', 'If the lost production is made up later (overtime or spare capacity), lost contribution is lower and overtime cost applies instead.'),
            check('No double counting', 'verify', 'Confirm the contribution rate excludes the labour counted separately.'),
          ],
          actions: ['Use this figure to rank maintenance or spares investments.'],
        });
    }
    case 'yield-check': {
      const started = Math.max(1, val('started')), good = val('good'), fp = val('firstPass');
      const y = (good / started) * 100, fpy = (fp / started) * 100, rework = Math.max(0, good - fp), loss = started - good;
      const ok = good <= started && fp <= good;
      return result(ok ? pct(y) : 'CHECK THE DATA', !ok ? 'warn' : y >= 98 ? 'good' : y >= 95 ? 'warn' : 'bad', `${num(loss, 0)} units did not become good output; ${num(rework, 0)} good units needed rework.`,
        [m('Final yield', pct(y)), m('First-pass yield', pct(fpy)), m('Lost units', num(loss, 0)), m('Reworked units', num(rework, 0))],
        'A large gap between final and first-pass yield shows hidden rework cost and lost capacity.',
        {
          primary: primary('Final yield', y, 'pct'),
          checks: [
            check('Good units not more than started', good <= started ? 'pass' : 'fail', `${num(good, 0)} good of ${num(started, 0)} started.`),
            check('First-pass count not more than good', fp <= good ? 'pass' : 'fail', `${num(fp, 0)} first-pass of ${num(good, 0)} good.`),
            check('Rework burden', y - fpy > 3 ? 'warn' : 'pass', `${pct(y - fpy)} of starts needed rework.`),
          ],
          actions: ['Track first-pass yield by defect type.', 'Multiply step yields to get rolled throughput yield for multi-step processes.'],
        });
    }
  }
  return null;
});
