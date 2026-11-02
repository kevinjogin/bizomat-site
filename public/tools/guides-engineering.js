// KEVOS® tool guides: Engineering.
(function () {
  const candidate = {};
  for (const L of ['A', 'B', 'C']) {
    Object.assign(candidate, {
      [`method${L}`]: 'Candidate retention method to assess',
      [`rating${L}`]: 'Axial capacity for this exact size and material from the supplier datasheet, the standard, or your validated calculation or push-out test',
      [`maxRpm${L}`]: 'Maximum speed for this size from the supplier catalogue (rings and clips)',
      [`maxTemp${L}`]: 'Maximum service temperature from the datasheet (essential for adhesives)',
      [`part${L}`]: 'Supplier quotation for the retaining part or compound per unit',
      [`feature${L}`]: 'Machining cost of the groove, cross-hole, thread or fit per unit (routing × rate or supplier)',
      [`time${L}`]: 'Time study or estimate for assembling one unit',
      [`tooling${L}`]: 'Quotations for applicators, press tools, staking tools or fixtures',
    });
  }
  window.WORKOS_GUIDES = Object.assign(window.WORKOS_GUIDES || {}, {
    'retention-selector': {
      purpose: 'Screens up to three axial retention methods for a shaft or bore against load, speed, temperature and disassembly needs, then compares lifecycle cost, risks, assembly guidance and drawing requirements. Technical rejection always overrides cost.',
      uses: ['Choosing how to retain a bearing, gear, pulley or bush axially', 'Design-for-assembly and cost-down reviews', 'Documenting why a retention method was chosen'],
      users: ['Mechanical design engineers', 'Manufacturing and process engineers', 'Engineering managers approving design changes'],
      inputs: Object.assign(
        {
          joint: 'Design: whether the part is retained on a shaft or in a bore',
          dia: 'Design drawing: nominal shaft or bore diameter (used to choose catalogue sizes)',
          load: 'Load calculation: maximum axial load including dynamic effects',
          loadType: 'Load calculation or duty description',
          rpm: 'Specification: maximum rotational speed of the retained parts',
          temp: 'Specification: maximum service temperature at the joint',
          service: 'Maintenance concept: how often the joint must be taken apart',
          designFactor: 'Your design standard or company practice; the tool never assumes a value',
          volume: 'Production forecast',
          years: 'Planned production life',
          services: 'Maintenance plan: disassemblies per unit over its service life',
          rate: 'Loaded labour rate from finance',
        },
        candidate,
      ),
      outputs: ['RECOMMENDED method, ELIGIBLE: ENTER COSTS TO CHOOSE, VERIFICATION REQUIRED or NO ELIGIBLE METHOD', 'Candidate comparison with technical status, capacity ratio and lifecycle cost', 'Feasibility checks, risks, assembly guidance and drawing requirements'],
      method: [
        'Each candidate is checked against: joint type, disassembly need, load character, capacity ÷ load against the required design factor, rated speed and rated temperature, plus method-specific evidence (calculated press-fit force, tested staking force).',
        'Any failed check rejects the candidate. Missing ratings, limits or design factor give VERIFY, never PASS.',
        'Unit cost = part + feature machining + assembly time × labour rate.',
        'Lifecycle cost = units produced over the life × (unit cost + service cost) + tooling; service cost = disassemblies × (2 × assembly labour + replacement part where the method needs one).',
        'Only PASS candidates can be recommended; among them, the lowest lifecycle cost is preferred.',
        'Costs rank candidates only when every candidate being ranked has costs entered; a blank cost is treated as unknown, never as zero.',
      ],
      limitations: [
        'The tool holds no catalogue dimensions, strength ratings, speed limits, safety factors or prices: all must come from you and your sources.',
        'Method rules reflect general engineering practice; they are not a substitute for the supplier’s data, the standard or a qualified design check.',
        'Shaft and housing stresses (grooves, cross-holes, threads, hoop stress) are not calculated here.',
        'Interference-fit holding force and staking force must be calculated or tested separately and entered as the rated capacity.',
      ],
      interpret: [
        'A recommendation means every entered check passes; it is not design approval.',
        'VERIFICATION REQUIRED lists exactly which evidence is missing; close those items and re-run.',
        'Use the sensitivity table to see whether a modest load increase would reject the chosen method.',
      ],
      refs: [
        'DIN 471 and DIN 472, retaining rings for shafts and bores (confirm edition against your approved standards list)',
        'DIN 6799, retaining washers (E-clips) for shafts',
        'ISO 8750 (coiled) and ISO 8752 (slotted, heavy-duty) spring-type straight pins',
        'ISO 286-1 and ISO 286-2, ISO code system for tolerances on linear sizes (fits)',
        'ISO 898-1 and ISO 898-2, mechanical properties of fasteners (bolts and nuts)',
        'Budynas R. G. and Nisbett J. K., Shigley’s Mechanical Engineering Design (McGraw-Hill), press and shrink fits',
      ],
      verify: ['Have a competent engineer check the selected method and its supporting calculations before release.'],
    },
  });
})();
