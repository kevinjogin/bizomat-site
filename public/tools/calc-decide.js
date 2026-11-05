// BIZOMAT calculations: Decide.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
window.GOCORE_CALC_PARTS.push(function (id) {
  switch (id) {
    case 'make-buy': {
      const q = val('qty'), mu = val('makeUnit'), mf = val('makeFixed'), bu = val('buyUnit'), bf = val('buyFixed');
      const make = q * mu + mf, buy = q * bu + bf, diff = buy - make;
      const den = bu - mu, be = den !== 0 ? (mf - bf) / den : Infinity, hasBe = Number.isFinite(be) && be > 0;
      const choice = diff >= 0 ? 'MAKE' : 'BUY';
      const room = hasBe ? (Math.abs(q - be) / Math.max(1, q)) * 100 : Infinity;
      return result(choice, choice === 'MAKE' ? 'good' : 'warn', `${choice === 'MAKE' ? 'Making internally' : 'Buying'} is cheaper by ${money(Math.abs(diff))} a year at ${num(q, 0)} units.`,
        [m('Make total / year', money(make)), m('Buy total / year', money(buy)), m('Difference', money(Math.abs(diff))), m('Crossover volume', hasBe ? `${num(be, 0)} units` : 'None at positive volume')],
        'Choose on cost only when capacity, quality, lead time and supply risk are acceptable for both options.',
        {
          primary: primary('Annual cost difference (buy − make)', diff, 'money'),
          checks: [
            hasBe
              ? check('Decision robust to volume changes', room >= 25 ? 'pass' : 'warn', `The cheaper option changes at ${num(be, 0)} units, ${num(room, 0)}% away from the entered volume.`)
              : check('Decision robust to volume changes', 'pass', 'One option is cheaper at every positive volume with these unit and fixed costs.'),
            check('Internal capacity and capability to make', 'verify', 'Confirm machine, labour and floor capacity and process capability for the annual quantity.'),
            check('Supplier quality, lead time and continuity', 'verify', 'Confirm the supplier can meet specification, lead time and volume, and assess single-source risk.'),
          ],
          actions: ['Confirm unit costs from your costing system and a written supplier quotation.', 'Use the detailed make-or-buy tool when freight, overhead and supplier set-up costs matter.', 'Record the decision basis so it can be reviewed when volume or prices change.'],
        });
    }
    case 'make-vs-buy-pro': {
      const q = Math.max(1, val('annualQty'));
      const makeVar = val('makeMaterial') + val('makeLabour') + val('makeVariableOH'), buyVar = val('buyUnit') + val('freightUnit');
      const make = q * makeVar + val('makeFixed'), buy = q * buyVar + val('supplierSetup'), diff = buy - make;
      const den = buyVar - makeVar, be = den !== 0 ? (val('makeFixed') - val('supplierSetup')) / den : Infinity, hasBe = Number.isFinite(be) && be > 0;
      const choice = diff >= 0 ? 'MAKE' : 'BUY';
      return result(choice, choice === 'MAKE' ? 'good' : 'warn', `${choice === 'MAKE' ? 'Making internally' : 'Buying externally'} is lower by ${money(Math.abs(diff))} a year at the entered volume.`,
        [m('Annual make cost', money(make)), m('Annual buy cost (landed)', money(buy)), m('Make cost / unit', money(make / q)), m('Buy cost / unit', money(buy / q)), m('Difference', money(Math.abs(diff))), m('Crossover volume', hasBe ? `${num(be, 0)} units` : 'None at positive volume')],
        'Also assess capacity, lead time, quality, intellectual property, supplier risk, cash flow and strategic capability before deciding.',
        {
          primary: primary('Annual cost difference (buy − make)', diff, 'money'),
          table: {
            caption: 'Annual cost build-up',
            head: ['Cost element', 'Make', 'Buy'],
            rows: [
              ['Material / purchase price', money(q * val('makeMaterial')), money(q * val('buyUnit'))],
              ['Direct labour', money(q * val('makeLabour')), '—'],
              ['Variable overhead', money(q * val('makeVariableOH')), '—'],
              ['Freight and landed cost', '—', money(q * val('freightUnit'))],
              ['Fixed / set-up cost', money(val('makeFixed')), money(val('supplierSetup'))],
              ['Total', money(make), money(buy)],
            ],
          },
          checks: [
            hasBe
              ? check('Decision robust to volume changes', Math.abs(q - be) / q >= 0.25 ? 'pass' : 'warn', `Preference changes at ${num(be, 0)} units a year.`)
              : check('Decision robust to volume changes', 'pass', 'One option is cheaper at every positive volume.'),
            check('Fixed costs are avoidable', 'verify', 'Only include internal fixed costs that would actually stop if you bought (relevant costs).'),
            check('Landed cost complete', 'verify', 'Include freight, duty, packaging, inspection and inventory costs of buying.'),
            check('Capacity, quality and supply risk', 'verify', 'Confirm internal capacity and the supplier’s capability, lead time and continuity.'),
          ],
          actions: ['Validate each cost with your costing system and a written quotation.', 'Check the decision at your low and high volume forecasts using the sensitivity table.', 'Agree quality and delivery terms before switching supply.'],
        });
    }
    case 'project-gate': {
      const ratio = val('benefit') / Math.max(1, val('cost'));
      const score = clamp((Math.min(ratio, 2) / 2) * 35 + (val('strategic') / 5) * 20 + (val('urgency') / 5) * 10 + ((6 - val('risk')) / 5) * 20 + (val('resource') / 5) * 15, 0, 100);
      const blocked = val('resource') <= 2 || val('risk') >= 5;
      let st = status(score, 'GO', 'HOLD / REVIEW', 'REWORK');
      if (blocked && st.text === 'GO') st = { text: 'HOLD / REVIEW', tone: 'warn' };
      return result(st.text, st.tone, `Gate score ${num(score, 0)}/100 from value, fit, urgency, risk and readiness.${blocked ? ' A readiness or risk condition prevents a GO decision.' : ''}`,
        [m('Gate score', `${num(score, 0)}/100`), m('Annual benefit / cost', `${num(ratio, 2)}×`), m('Risk', `${val('risk')}/5`), m('Readiness', `${val('resource')}/5`)],
        st.text === 'GO' ? 'Proceed to the next gate while validating the assumptions with the largest financial or delivery effect.' : st.text === 'HOLD / REVIEW' ? 'Resolve the blocking or weakest items before committing further cost.' : 'The case is not strong enough to proceed without redesign or better evidence.',
        {
          primary: primary('Gate score', score),
          checks: [
            check('Annual benefit covers initial cost', ratio >= 1 ? 'pass' : 'warn', `Benefit is ${num(ratio, 2)}× the initial cost in one year.`),
            check('Resources ready', val('resource') <= 2 ? 'fail' : val('resource') === 3 ? 'warn' : 'pass', 'A readiness score of 2 or less blocks a GO decision.'),
            check('Risk acceptable', val('risk') >= 5 ? 'fail' : val('risk') === 4 ? 'warn' : 'pass', 'A risk score of 5 blocks a GO decision until treatment actions are agreed.'),
            check('Benefit evidence', 'verify', 'Confirm the benefit estimate with an owner who will be accountable for delivering it.'),
          ],
          actions: ['Document the gate decision, conditions and owner.', 'Use the business case tool for discounted cash flow before major commitments.'],
        });
    }
    case 'priority': {
      const score = ((val('impact') * 0.35 + val('urgency') * 0.3 + val('risk') * 0.2 + (6 - val('effort')) * 0.15) / 5) * 100;
      const st = status(score, 'HIGH PRIORITY', 'MEDIUM PRIORITY', 'LOW PRIORITY');
      return result(st.text, st.tone, `Priority score ${num(score, 0)}/100 (impact 35%, urgency 30%, risk of delay 20%, ease 15%).`,
        [m('Impact', `${val('impact')}/5`), m('Urgency', `${val('urgency')}/5`), m('Risk if delayed', `${val('risk')}/5`), m('Effort', `${val('effort')}/5`)],
        'Rank work items with the same scale and weights. Mandatory safety, legal and compliance work is scheduled outside this scoring.',
        {
          primary: primary('Priority score', score),
          checks: [
            check('Mandatory obligations considered', val('risk') >= 5 ? 'verify' : 'pass', val('risk') >= 5 ? 'A risk-if-delayed score of 5 may indicate a safety, legal or compliance obligation that must not wait for scoring.' : 'No maximum delay risk entered.'),
            check('Effort justified by impact', val('effort') >= 4 && val('impact') <= 2 ? 'warn' : 'pass', 'High effort with low impact is usually a candidate to drop or redesign.'),
          ],
          actions: ['Score competing items in one session with the same people.', 'Revisit scores when urgency or risk changes.'],
        });
    }
    case 'option-compare': {
      const sc = (ben, cost, risk, days) => (ben / Math.max(1, cost)) * 50 + (6 - risk) * 8 + Math.max(0, 40 - days / 3);
      const a = sc(val('aBenefit'), val('aCost'), val('aRisk'), val('aDays')), b = sc(val('bBenefit'), val('bCost'), val('bRisk'), val('bDays'));
      const win = a >= b ? 'OPTION A' : 'OPTION B', close = Math.abs(a - b) / Math.max(a, b, 1) < 0.1;
      const bcA = val('aBenefit') / Math.max(1, val('aCost')), bcB = val('bBenefit') / Math.max(1, val('bCost'));
      return result(close ? 'TOO CLOSE TO CALL' : win, close ? 'warn' : 'good', close ? `The options score within 10% of each other (A ${num(a, 0)}, B ${num(b, 0)}).` : `${win} has the stronger combined value, risk and delivery score.`,
        [m('Option A score', num(a, 0)), m('Option B score', num(b, 0)), m('A benefit / cost', `${num(bcA, 2)}×`), m('B benefit / cost', `${num(bcB, 2)}×`)],
        'Use the score to structure the discussion, then test the assumptions that differ most between the options.',
        {
          primary: primary('Score margin (A − B)', a - b),
          table: { caption: 'Side-by-side comparison', head: ['Measure', 'Option A', 'Option B'], rows: [['Annual benefit', money(val('aBenefit')), money(val('bBenefit'))], ['Cost', money(val('aCost')), money(val('bCost'))], ['Benefit / cost', `${num(bcA, 2)}×`, `${num(bcB, 2)}×`], ['Delivery time', `${num(val('aDays'), 0)} days`, `${num(val('bDays'), 0)} days`], ['Risk (1–5)', val('aRisk'), val('bRisk')], ['Score', num(a, 0), num(b, 0)]] },
          checks: [
            check('Clear preference', close ? 'warn' : 'pass', close ? 'Within 10%: decide on factors outside the score or gather better data.' : 'The score gap exceeds 10%.'),
            check('Preferred option pays back its cost', (a >= b ? bcA : bcB) >= 1 ? 'pass' : 'warn', 'Annual benefit compared with cost for the higher-scoring option.'),
            check('Mandatory requirements met by both', 'verify', 'Exclude any option that fails a safety, legal or technical requirement before scoring.'),
          ],
          actions: ['Confirm benefits and costs on the same basis (annual, before tax) for both options.', 'Run the business case tool on the preferred option.'],
        });
    }
    case 'change-impact': {
      const costPct = (val('cost') / Math.max(1, val('baseCost'))) * 100, dayPct = (val('days') / Math.max(1, val('baseDays'))) * 100;
      const impact = clamp(costPct * 0.25 + dayPct * 0.25 + (val('risk') / 5) * 25 + (val('quality') / 5) * 25, 0, 100);
      const tone = impact < 30 ? 'good' : impact < 60 ? 'warn' : 'bad', txt = impact < 30 ? 'LOW IMPACT' : impact < 60 ? 'MODERATE IMPACT' : 'HIGH IMPACT';
      return result(txt, tone, `Estimated change impact ${num(impact, 0)}/100.`,
        [m('Cost increase', pct(costPct)), m('Schedule increase', pct(dayPct)), m('Benefit', money(val('benefit'))), m('Benefit − added cost', money(val('benefit') - val('cost')))],
        val('benefit') > val('cost') ? 'The benefit exceeds the direct added cost; schedule, risk and quality effects still need approval.' : 'The benefit does not exceed the added cost; strengthen the case or redesign the change.',
        {
          primary: primary('Impact score', impact),
          checks: [
            check('Benefit exceeds added cost', val('benefit') > val('cost') ? 'pass' : 'warn', `${money(val('benefit'))} benefit against ${money(val('cost'))} added cost.`),
            check('Schedule impact', dayPct > 10 ? 'warn' : 'pass', `${pct(dayPct)} of the remaining schedule.`),
            check('Quality and compliance review', val('quality') >= 4 ? 'verify' : 'pass', val('quality') >= 4 ? 'High quality impact: obtain quality or engineering sign-off before approval.' : 'Quality impact rated below 4.'),
            check('Contract and authority to approve', 'verify', 'Confirm who can approve the change and whether it alters contract scope or price.'),
          ],
          actions: ['Record the change, its reason, impact and approver in the change register.', 'Update the schedule, budget and risk register once approved.'],
        });
    }
    case 'risk-score': {
      const s = val('likelihood') * val('consequence');
      const tone = s <= 6 ? 'good' : s <= 14 ? 'warn' : 'bad', txt = s <= 6 ? 'LOW' : s <= 14 ? 'MEDIUM' : 'HIGH';
      return result(`${txt} RISK`, tone, `Risk score ${s}/25 (likelihood × consequence).`,
        [m('Likelihood', `${val('likelihood')}/5`), m('Consequence', `${val('consequence')}/5`), m('Risk score', `${s}/25`), m('Band', txt)],
        s >= 15 ? 'Define treatment actions, an owner and a review date before relying on the current plan.' : s >= 7 ? 'Monitor the risk and define a practical mitigation or contingency.' : 'Routine monitoring is likely sufficient unless the context changes.',
        {
          primary: primary('Risk score', s),
          table: { caption: 'Banding used (adjust to your organisation’s risk criteria)', head: ['Band', 'Score', 'Typical response'], rows: [['Low', '1–6', 'Accept and monitor'], ['Medium', '7–14', 'Mitigate and assign an owner'], ['High', '15–25', 'Treat before proceeding; escalate']] },
          checks: [
            check('Consequence scale defined', 'verify', 'Use your organisation’s defined consequence and likelihood descriptors so scores are comparable.'),
            check('Catastrophic consequence', val('consequence') >= 5 ? 'warn' : 'pass', val('consequence') >= 5 ? 'Severe consequences need controls even when likelihood is rated low.' : 'Consequence rated below 5.'),
          ],
          actions: ['Record the risk, controls, owner and review date in the risk register.', 'Re-rate the residual risk after treatment.'],
        });
    }
  }
  return null;
});
