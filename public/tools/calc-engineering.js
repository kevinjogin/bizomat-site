// KEVOS® WORKOS calculations: Engineering. Retention Method Selector.
//
// Rules, in order of authority:
//   1. Technical rejection (REJECT) always overrides cost and scoring.
//   2. Missing safety-critical evidence (a rating, a design factor, a speed or temperature limit) gives VERIFY,
//      never PASS. The tool supplies no catalogue dimensions, strength ratings, safety factors or prices:
//      every rating and cost comes from the user (supplier datasheet, standard, calculation or test).
//   3. Only PASS candidates can be recommended; among them the lowest lifecycle cost is preferred.
// Method knowledge is general engineering practice and names the standards a designer would consult;
// confirm the edition against your organisation's approved standards list.
window.GOCORE_CALC_PARTS = window.GOCORE_CALC_PARTS || [];
(function () {
  const LEVEL = { never: 0, occasional: 1, frequent: 2 };
  const METHODS = {
    ring: {
      name: 'Retaining ring (circlip)', joints: ['shaft', 'bore'], maxService: 'frequent', impact: 'ok', speed: true, tempCritical: false, service: 'replace',
      standards: 'DIN 471 (shafts) / DIN 472 (bores), or the ring supplier’s catalogue standard',
      risks: [
        ['Ring lifts out of its groove at speed', 'Medium', 'Check the catalogue maximum speed for the ring size; consider a higher-speed ring design or a collar.'],
        ['Groove wall yields before the ring', 'Medium', 'Check the groove (abutment) capacity, which can be lower than the ring capacity, and the chamfer or radius on the retained part.'],
        ['Ring over-expanded during installation', 'Low', 'Use the correct pliers or applicator and do not exceed the catalogue expansion limit.'],
      ],
      assembly: ['Use ring pliers or an applicator matched to the ring size.', 'Check the ring is fully seated around the whole groove.', 'Follow the supplier’s orientation guidance for stamped rings.', 'Replace rings removed in service rather than reusing them.'],
      drawing: ['Groove diameter, width and depth with tolerances from the ring standard or catalogue.', 'Edge condition (chamfer or radius limits) of the retained part.', 'Ring designation, material and finish.'],
    },
    eclip: {
      name: 'E-clip / retaining washer', joints: ['shaft'], maxService: 'frequent', impact: 'reject', speed: true, tempCritical: false, service: 'replace',
      standards: 'DIN 6799, or the supplier’s catalogue',
      risks: [
        ['Clip dislodges under shock or vibration', 'High', 'Not suited to impact loads; use a retaining ring or pin instead.'],
        ['Low axial capacity', 'Medium', 'Confirm the catalogue axial rating covers the load with your design factor.'],
      ],
      assembly: ['Fit radially with an applicator; no expansion is needed.', 'Check full engagement in the groove.'],
      drawing: ['Groove dimensions and tolerances from the clip standard or catalogue.', 'Clip designation and material.'],
    },
    pin: {
      name: 'Spring pin through cross-hole', joints: ['shaft', 'bore'], maxService: 'occasional', impact: 'ok', speed: false, tempCritical: false, service: 'replace',
      standards: 'ISO 8752 (slotted, heavy duty) or ISO 8750 (coiled); supplier shear ratings',
      risks: [
        ['Cross-hole weakens the shaft', 'Medium', 'Check bending and torsional stress with the stress concentration of the cross-hole.'],
        ['Pin works loose under vibration', 'Low', 'Use the hole tolerance from the pin standard; coiled pins tolerate vibration better.'],
        ['Hole wear after repeated removal', 'Medium', 'Limit disassembly cycles or plan oversize pins for repair.'],
      ],
      assembly: ['Drill (and ream if specified) the cross-hole to the tolerance in the pin standard.', 'Drive or press the pin with a pin punch while supporting the part.', 'Chamfer hole entries.'],
      drawing: ['Cross-hole diameter, tolerance and position.', 'Pin standard designation, diameter, length and material.'],
    },
    collar: {
      name: 'Shaft collar (set screw or clamp)', joints: ['shaft'], maxService: 'frequent', impact: 'verify', speed: false, tempCritical: false, service: 'reuse',
      standards: 'Supplier axial holding rating; ISO 4026–4029 for hexagon socket set screws',
      risks: [
        ['Collar slips or set screw loosens', 'Medium', 'Use the supplier’s tightening torque, a flat or dimple for set screws, and a thread-locking method; clamp collars avoid shaft damage.'],
        ['Holding force depends on tightening', 'Medium', 'Control and record the tightening torque.'],
      ],
      assembly: ['Position the collar with a gauge or shoulder.', 'Tighten to the supplier’s torque; use threadlocker where specified.'],
      drawing: ['Collar part number and axial position.', 'Flat or dimple on the shaft for set screws.'],
    },
    nut: {
      name: 'Shoulder and locked nut', joints: ['shaft'], maxService: 'frequent', impact: 'ok', speed: false, tempCritical: false, service: 'reuse',
      standards: 'ISO 898-2 (nut property classes); ISO 898-1 for threaded parts',
      risks: [
        ['Self-loosening under vibration', 'Medium', 'Use positive locking (tab washer, lock nut or prevailing-torque nut) and controlled tightening.'],
        ['Thread root weakens the shaft', 'Medium', 'Check stress at the thread root and undercut.'],
      ],
      assembly: ['Tighten to the specified torque or method.', 'Engage the locking feature and record it.'],
      drawing: ['Thread specification and undercut.', 'Locking feature and tightening torque.'],
    },
    press: {
      name: 'Interference (press) fit', joints: ['shaft', 'bore'], maxService: 'never', impact: 'ok', speed: false, tempCritical: true, service: 'damage',
      standards: 'ISO 286 limits and fits; holding force from thick-cylinder (Lamé) interference calculations',
      risks: [
        ['Holding force varies with actual interference and finish', 'High', 'Calculate the minimum interference at worst-case tolerances and validate push-out force by test.'],
        ['Hub or housing over-stressed', 'Medium', 'Check hoop stress at maximum interference.'],
        ['Interference lost at temperature', 'Medium', 'Check differential expansion of the two materials at the service temperature.'],
      ],
      assembly: ['Press with controlled force and alignment, or assemble thermally (heat the hub or cool the shaft).', 'Record press force as evidence of the fit.'],
      drawing: ['Fit designation (hole and shaft tolerance classes) and surface finish.', 'Lead-in chamfers.'],
    },
    adhesive: {
      name: 'Anaerobic retaining compound', joints: ['shaft', 'bore'], maxService: 'occasional', impact: 'verify', speed: false, tempCritical: true, service: 'reapply',
      standards: 'The compound supplier’s technical datasheet (shear strength, gap range, temperature, cure)',
      risks: [
        ['Strength lost above the rated temperature', 'High', 'Confirm the datasheet temperature rating covers the service temperature.'],
        ['Contamination prevents cure', 'Medium', 'Clean, degrease and prime per the datasheet; control the process.'],
        ['Gap outside the compound’s range', 'Medium', 'Set fit tolerances within the datasheet gap limits.'],
      ],
      assembly: ['Clean and degrease both surfaces; prime if the datasheet requires.', 'Apply to the specified area and assemble with a twisting motion.', 'Do not load before the specified cure time.'],
      drawing: ['Compound product and grade, application area and cure requirement.', 'Diametral clearance limits compatible with the datasheet.'],
    },
    stake: {
      name: 'Staking or peening', joints: ['shaft', 'bore'], maxService: 'never', impact: 'verify', speed: false, tempCritical: false, service: 'destroy',
      standards: 'A process qualified by push-out testing on production-representative parts',
      risks: [
        ['Retention varies with staking depth', 'High', 'Control tool geometry and force or stroke; validate by push-out testing.'],
        ['Not serviceable', 'Medium', 'Use only where disassembly is never required.'],
      ],
      assembly: ['Use a staking tool with controlled geometry and force or stroke.', 'Inspect stake depth and coverage.'],
      drawing: ['Staking detail: number, position, depth and tool.'],
    },
  };

  function assess(L, ctx) {
    const key = sel(`method${L}`), M = METHODS[key];
    if (!M) return null;
    const c = { L, key, M, rating: val(`rating${L}`), maxRpm: val(`maxRpm${L}`), maxTemp: val(`maxTemp${L}`), part: val(`part${L}`), feature: val(`feature${L}`), time: val(`time${L}`), tooling: val(`tooling${L}`), checks: [], reasons: [] };
    const tag = `${L} · ${M.name}`;
    const add = (label, st, detail) => {
      c.checks.push(check(`${tag}: ${label}`, st, detail));
      if (st === 'fail' || st === 'verify') c.reasons.push(`${st === 'fail' ? 'Rejected' : 'Verify'}: ${label.toLowerCase()}`);
    };
    // 1. Joint type
    add('suits the joint', M.joints.includes(ctx.joint) ? 'pass' : 'fail', M.joints.includes(ctx.joint) ? `Applies to ${ctx.joint === 'shaft' ? 'shafts' : 'bores'}.` : `Not applicable to ${ctx.joint === 'shaft' ? 'shafts' : 'bores or housings'}.`);
    // 2. Disassembly
    const okService = LEVEL[ctx.service] <= LEVEL[M.maxService];
    add('supports the disassembly need', okService ? 'pass' : 'fail', okService ? `Supports ${M.maxService} disassembly.` : `Supports at most ${M.maxService} disassembly; ${ctx.service} is required.`);
    // 3. Load character
    if (ctx.loadType === 'impact') add('withstands impact or shock', M.impact === 'reject' ? 'fail' : M.impact === 'verify' ? 'verify' : 'pass', M.impact === 'reject' ? 'Not suited to shock loading.' : M.impact === 'verify' ? 'Shock capacity is not established by a static rating; confirm by test or with the supplier.' : 'Suitable for shock if the rated capacity and design factor are met.');
    if (ctx.loadType === 'cyclic') add('fatigue capacity under cyclic load', 'verify', 'Catalogue axial ratings are usually static; confirm fatigue performance for the load cycles expected.');
    // 4. Capacity against design factor
    if (ctx.load <= 0) add('rated capacity vs load', 'verify', 'No axial load entered; capacity cannot be checked.');
    else if (ctx.df <= 0) add('rated capacity vs load', 'verify', 'Required design factor not set; capacity cannot be accepted.');
    else if (c.rating <= 0) add('rated capacity vs load', 'verify', `No rated capacity supplied (source: ${M.standards}).`);
    else {
      const ratio = c.rating / ctx.load;
      c.ratio = ratio;
      add('rated capacity vs load', ratio >= ctx.df ? 'pass' : 'fail', `Capacity ${num(c.rating, 0)} N ÷ load ${num(ctx.load, 0)} N = ${num(ratio, 2)} against a required ${num(ctx.df, 2)}.`);
    }
    // 5. Speed
    if (ctx.rpm > 0 && M.speed) {
      if (c.maxRpm <= 0) add('rated for the speed', 'verify', `${num(ctx.rpm, 0)} rpm entered; supply the catalogue maximum speed for this size.`);
      else add('rated for the speed', ctx.rpm <= c.maxRpm ? 'pass' : 'fail', `${num(ctx.rpm, 0)} rpm against a rated ${num(c.maxRpm, 0)} rpm.`);
    } else if (ctx.rpm > 0 && c.maxRpm > 0) add('rated for the speed', ctx.rpm <= c.maxRpm ? 'pass' : 'fail', `${num(ctx.rpm, 0)} rpm against a rated ${num(c.maxRpm, 0)} rpm.`);
    // 6. Temperature
    if (c.maxTemp > 0) add('rated for the temperature', ctx.temp <= c.maxTemp ? 'pass' : 'fail', `${num(ctx.temp, 0)} °C against a rated ${num(c.maxTemp, 0)} °C.`);
    else if (M.tempCritical) add('rated for the temperature', 'verify', key === 'press' ? 'Check that interference is retained at the service temperature for the two materials.' : 'Supply the datasheet maximum service temperature.');
    // 7. Method-specific evidence
    if (key === 'press') add('holding force calculated from the fit', c.rating > 0 ? 'pass' : 'verify', c.rating > 0 ? 'A calculated or tested holding force has been entered as the rated capacity.' : 'Calculate the minimum holding force from the worst-case interference, then validate by test.');
    if (key === 'stake') add('push-out force validated by test', c.rating > 0 ? 'pass' : 'verify', c.rating > 0 ? 'A tested push-out force has been entered as the rated capacity.' : 'Qualify the staking process with push-out tests.');

    c.status = c.checks.some((x) => x.status === 'fail') ? 'REJECT' : c.checks.some((x) => x.status === 'verify') ? 'VERIFY' : 'PASS';
    // Lifecycle cost
    const labourUnit = (c.time / 3600) * ctx.rate;
    c.unit = c.part + c.feature + labourUnit;
    const produced = ctx.volume * ctx.years;
    const replace = M.service === 'replace' || M.service === 'reapply' ? c.part : 0;
    c.serviceUnit = ctx.services * (2 * labourUnit + replace);
    c.lifecycle = produced * (c.unit + c.serviceUnit) + c.tooling;
    c.costKnown = c.part + c.feature + c.time + c.tooling > 0;
    return c;
  }

  window.GOCORE_CALC_PARTS.push(function (id) {
    if (id !== 'retention-selector') return null;
    const ctx = { joint: sel('joint'), load: val('load'), loadType: sel('loadType'), rpm: val('rpm'), temp: val('temp'), service: sel('service'), df: val('designFactor'), volume: val('volume'), years: Math.max(1, val('years')), services: val('services'), rate: val('rate') };
    const cands = ['A', 'B', 'C'].map((L) => assess(L, ctx)).filter(Boolean);
    const passing = cands.filter((c) => c.status === 'PASS'), verifying = cands.filter((c) => c.status === 'VERIFY');
    // Cost only ranks candidates when every one being ranked has costs entered; a blank cost is unknown, not zero.
    const cheapest = (list) => (list.length === 1 ? list[0] : list.every((c) => c.costKnown) ? [...list].sort((a, b) => a.lifecycle - b.lifecycle)[0] : null);
    const names = (list) => list.map((c) => c.L).join(list.length === 2 ? ' and ' : ', ');
    const rec = passing.length ? cheapest(passing) : null;
    const uncosted = !rec && passing.length > 1 ? passing : null;
    const provisional = !passing.length && verifying.length ? cheapest(verifying) : null;
    const lead = rec || provisional;

    const text = rec ? `RECOMMENDED: ${rec.M.name.toUpperCase()}` : uncosted ? 'ELIGIBLE: ENTER COSTS TO CHOOSE' : verifying.length ? 'VERIFICATION REQUIRED' : 'NO ELIGIBLE METHOD';
    const tone = rec ? 'good' : uncosted || verifying.length ? 'warn' : 'bad';
    const summary = rec
      ? `Candidate ${rec.L} passes every technical check${passing.length > 1 ? ' and has the lowest lifecycle cost of the passing methods' : ''}.${rec.costKnown ? '' : ' No costs were entered, so cost was not compared.'}`
      : uncosted
        ? `Candidates ${names(passing)} pass every technical check, but not all of them have costs entered, so they cannot be ranked on cost.`
        : verifying.length
          ? `No candidate can pass yet: evidence is missing for ${names(verifying)}.${provisional && verifying.length > 1 ? ` On the costs entered, candidate ${provisional.L} (${provisional.M.name.toLowerCase()}) is the leading provisional option once its VERIFY items are closed.` : ''}`
          : 'Every candidate fails at least one technical check. Change the design, the requirement or the candidate methods.';
    const tableRows = cands.map((c) => [`${c.L}: ${c.M.name}`, c.status, Number.isFinite(c.ratio) ? `${num(c.ratio, 2)}×` : '—', c.costKnown ? money(c.unit, 2) : 'Not entered', c.costKnown ? money(c.lifecycle) : 'Not entered', c.reasons.length ? c.reasons.join('; ') : 'All checks pass']);
    const checks = [
      check('Required design factor', ctx.df > 0 ? 'pass' : 'verify', ctx.df > 0 ? `${num(ctx.df, 2)} (your approved value).` : 'Enter the design factor required by your design standard or company practice; the tool never assumes one.'),
      ...(ctx.service === 'never' && ctx.services > 0 ? [check('Service disassemblies vs requirement', 'warn', 'Service disassemblies are entered but the disassembly requirement is “never”.')] : []),
      ...cands.flatMap((c) => c.checks),
    ];
    const risks = cands.filter((c) => c.status !== 'REJECT').flatMap((c) => c.M.risks.map(([risk, level, response]) => ({ risk: `${c.L} · ${risk}`, level, response })));
    const guidance = [];
    for (const c of cands.filter((x) => x.status !== 'REJECT')) {
      guidance.push({ title: `Assembly guidance: ${c.L} · ${c.M.name}`, items: c.M.assembly });
      guidance.push({ title: `Drawing requirements: ${c.L} · ${c.M.name}`, items: [...c.M.drawing, `Reference: ${c.M.standards}.`] });
    }
    return result(text, tone, summary,
      [m('Axial load', `${num(ctx.load, 0)} N (${ctx.loadType})`), m('Speed / temperature', `${num(ctx.rpm, 0)} rpm / ${num(ctx.temp, 0)} °C`), m('Design factor', ctx.df > 0 ? `${num(ctx.df, 2)}` : 'Not set'), m('Candidates', `${passing.length} pass · ${verifying.length} verify · ${cands.length - passing.length - verifying.length} rejected`), ...(lead && lead.costKnown ? [m(rec ? 'Lifecycle cost (recommended)' : 'Lifecycle cost (provisional)', money(lead.lifecycle))] : [])],
      rec ? 'Close the remaining verification items on the drawing and in the first-article inspection before release.' : uncosted ? 'Enter part, feature, assembly time and tooling costs for every passing candidate; the lowest lifecycle cost will then be recommended.' : verifying.length ? 'Collect the missing ratings, limits and design factor, then re-run; no candidate may be released on VERIFY.' : 'Revisit the requirement (load, speed, temperature or disassembly) or consider a different retention design.',
      {
        // NaN when no candidate can be costed: the report and sensitivity analysis then omit the cost measure.
        primary: primary(rec ? 'Lifecycle cost of recommended method' : 'Lifecycle cost of leading candidate', lead && lead.costKnown ? lead.lifecycle : NaN, 'money'),
        checks,
        table: { caption: 'Candidate comparison (technical status overrides cost)', head: ['Candidate', 'Status', 'Capacity ÷ load', 'Cost / unit', 'Lifecycle cost', 'Reasons'], rows: tableRows },
        risks,
        guidance,
        verify: ['Use axial loads that include dynamic and misalignment effects, not only nominal loads.', 'Take every rating from the exact part number, size, material and finish in the supplier’s current datasheet.', 'Confirm the edition of each referenced standard against your approved standards list.', 'Validate the selected method on first articles (fit, seating, push-out or proof load as appropriate).'],
        actions: ['Record the selected method, ratings, sources and design factor in the design file.', 'Add the drawing requirements listed for the selected method.', 'Re-run this check if loads, speed, temperature or service needs change.'],
      });
  });
})();
