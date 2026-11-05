// BIZOMAT Tools input guides: handbook4. What each input means, how to get it right and which figure explains it.
// Read with public/tools/input-guides.js; units, accepted ranges and examples come from data-handbook4.js.
window.WORKOS_INPUTS = Object.assign(window.WORKOS_INPUTS || {}, {
  'circular-segment': {
    mode: { what: 'Which pair of values you already have. With radius and height the tool solves the segment; with chord and height it works out the radius of the arc first, which suits measuring an existing curved part.', tip: 'Only the inputs for the chosen pair are used; the other value is ignored, so a stale number there does no harm.', fig: 'choice' },
    radius: { what: 'The radius of the circle the arc belongs to, from the arc centre to the curved edge, as given on the drawing.', tip: 'Use the radius, not the diameter: halve a diameter first. This value is ignored when the chord and height pair is selected.', fig: 'radius', sym: 'r' },
    chord: { what: 'The straight-line distance between the two ends of the arc, across the open side of the segment.', tip: 'Used only with the chord and height pair. Measure end to end in a straight line, not along the curve.', fig: 'length', sym: 'c' },
    height: { what: 'The height of the segment (sagitta): the distance from the middle of the chord to the arc, measured square to the chord.', tip: 'Measure at the exact midpoint of the chord. When the height is small compared with the chord, a small error in it changes the calculated radius a lot.', fig: 'height', sym: 'h' },
  },
  'regular-polygon': {
    sides: { what: 'How many equal sides the regular shape has, for example a hexagon bar, square drive or octagon stock.', tip: 'The tool assumes all sides and angles are equal; a stretched or irregular shape will not match.', fig: 'count', sym: 'n' },
    basis: { what: 'Which size you already know: across flats (between two opposite sides), across corners (between two opposite corners) or the length of one side.', tip: 'Spanner sizes and hexagon bar are normally specified across flats; across corners is the round stock needed to make the shape.', fig: 'choice' },
    size: { what: 'The measured or specified size of the dimension chosen above: across flats, across corners or one side length.', tip: 'Check it matches the dimension type selected; an across-corners value entered as across flats gives every result too large.', effect: 'All lengths scale in proportion to it and the area with its square.', fig: 'length' },
  },
  'triangle-solver': {
    mode: { what: 'Which combination of sides and angles you know. The tool uses only the inputs that belong to the chosen combination and calculates the rest of the triangle.', tip: 'For two sides, the angle used is the one between them (C between a and b); for two angles, the side used is the one between them (c).', fig: 'choice' },
    a: { what: 'The length of side a, the side opposite angle A. Used when three sides or two sides and the included angle are known.', tip: 'Label the triangle on your sketch first so each side sits opposite the angle with the same letter.', fig: 'length', sym: 'a' },
    b: { what: 'The length of side b, the side opposite angle B. Used when three sides or two sides and the included angle are known.', tip: 'With three sides, each side must be shorter than the sum of the other two or no triangle exists.', fig: 'length', sym: 'b' },
    c: { what: 'The length of side c, the side opposite angle C. Used when three sides are known, or as the side between angles A and B.', tip: 'Not used for two sides and the included angle; there c is calculated.', fig: 'length', sym: 'c' },
    A: { what: 'The interior angle at the corner opposite side a. Used only when two angles and the side between them are known.', tip: 'Angles A and B must add to less than 180°, because the three interior angles add to exactly 180°.', fig: 'angle', sym: 'A' },
    B: { what: 'The interior angle at the corner opposite side b. Used only when two angles and the side between them are known.', tip: 'Use the inside angle of the triangle, not the outside angle of a sketch line.', fig: 'angle', sym: 'B' },
    C: { what: 'The interior angle between sides a and b, opposite side c. Used only when two sides and this included angle are known.', tip: 'It must be the angle between the two known sides; an angle at another corner gives a different triangle.', fig: 'angle', sym: 'C' },
  },
  'tank-volume': {
    orient: { what: 'Whether the tank lies on its side with the axis level, or stands upright with the axis vertical. This decides how the liquid depth turns into a volume.', tip: 'A horizontal tank’s volume does not rise in proportion to depth; a vertical tank’s does.', fig: 'choice' },
    diameter: { what: 'The diameter across the inside of the cylindrical shell, inside the walls, where the liquid sits.', tip: 'Use the inside, not the outside, diameter; if you measured the outside circumference, divide by π and take off twice the wall thickness.', effect: 'Capacity rises with the square of the diameter.', fig: 'diameter', sym: 'D' },
    length: { what: 'The straight inside length of the cylindrical shell between flat ends: the horizontal length of a lying tank, or the shell height of an upright tank.', tip: 'The tool treats the ends as flat. Volume in dished or rounded ends is not included and must be added separately.', effect: 'Liquid volume and capacity rise in proportion to the length.', fig: 'length', sym: 'L' },
    depth: { what: 'How deep the liquid is, measured straight up from the lowest point inside the tank to the liquid surface, for example with a dip stick.', tip: 'For a horizontal tank it cannot exceed the inside diameter; for an upright tank it cannot exceed the shell height. A sloping tank gives a false reading.', fig: 'depth', sym: 'h' },
  },
  'frustum-volume': {
    shape: { what: 'Whether the hopper or transition is round (a cone with its tip cut off) or rectangular (a pyramid with its tip cut off).', tip: 'For a round shape the two width inputs are ignored.', fig: 'choice' },
    top1: { what: 'At the wide top opening: the inside diameter for a round hopper, or the inside length of one side for a rectangular hopper.', tip: 'Use inside dimensions for capacity; outside dimensions overstate the volume by the plate thickness.', fig: 'diameter', sym: 'D' },
    top2: { what: 'The inside width of the top opening of a rectangular hopper, measured at right angles to the top length.', tip: 'Ignored for a round hopper.', fig: 'length' },
    bot1: { what: 'At the small bottom outlet: the inside diameter for a round hopper, or the inside length for a rectangular hopper, on the same side as the top length.', tip: 'Set it to 0 for a full cone or pyramid that comes to a point.', fig: 'diameter', sym: 'd' },
    bot2: { what: 'The inside width of the bottom outlet of a rectangular hopper, on the same side as the top width.', tip: 'Ignored for a round hopper. Match it to the top width, not the top length, or the sides will be wrong.', fig: 'length' },
    height: { what: 'The vertical distance between the plane of the top opening and the plane of the outlet, not the sloping length of a side.', tip: 'Measure square to the openings; the slant height is calculated from this.', effect: 'Volume rises in proportion to the height for the same openings.', fig: 'height', sym: 'h' },
  },
  ellipse: {
    major: { what: 'The full length of the ellipse along its longest direction, from one end to the other through the centre.', tip: 'Enter the full length, not the semi-axis; the tool halves it. If the two values are swapped, the larger one is used as the major axis.', fig: 'length', sym: '2a' },
    minor: { what: 'The full width of the ellipse along its shortest direction, at right angles to the major axis through the centre.', tip: 'Enter the full width, not the semi-axis.', fig: 'length', sym: '2b' },
  },
  'compound-angle': {
    angleA: { what: 'The slope of the surface as it appears in a first vertical plane, for example the angle seen from the front view, measured from horizontal.', tip: 'Both angles must be slopes of the same flat surface seen in two vertical planes at 90° to each other.', fig: 'angle', sym: 'A' },
    angleB: { what: 'The slope of the same surface as it appears in the vertical plane at right angles to the first one, for example the angle seen from the side view.', tip: 'Measure from horizontal, like the first angle; an angle measured from vertical gives a wrong result.', fig: 'angle', sym: 'B' },
  },
  'polar-coordinates': {
    mode: { what: 'The direction of the conversion: from a radius and angle to X and Y positions, or from X and Y positions to a radius and angle.', tip: 'Only the inputs for the chosen direction are used.', fig: 'choice' },
    radius: { what: 'The straight distance from the origin (for example a bolt circle centre) to the point. Used when converting radius and angle to X and Y.', tip: 'For a bolt circle this is half the bolt circle diameter.', fig: 'radius', sym: 'r' },
    angle: { what: 'The direction of the point from the origin, measured anticlockwise from the positive X axis. Used when converting radius and angle to X and Y.', tip: 'Check where the drawing puts zero and which way it measures; a clockwise angle is entered as a negative number.', fig: 'angle', sym: 'θ' },
    x: { what: 'The point’s horizontal position from the origin along the X axis, positive to the right. Used when converting X and Y to radius and angle.', tip: 'Keep the sign: a point left of the origin has a negative X, which changes the angle.', fig: 'length', sym: 'X' },
    y: { what: 'The point’s vertical position from the origin along the Y axis, positive upwards. Used when converting X and Y to radius and angle.', tip: 'Keep the sign: a point below the origin has a negative Y.', fig: 'length', sym: 'Y' },
  },
  'dovetail-measurement': {
    type: { what: 'Whether you are measuring the male dovetail (the tongue, measured over two rods) or the female dovetail (the slot, measured between two rods).', tip: 'The width input means a different edge for each type, so set this first.', fig: 'choice' },
    angle: { what: 'The angle between the sloping flank of the dovetail and its base, as given on the drawing.', tip: 'Use the flank-to-base angle, not the angle from vertical or the included angle between two flanks.', fig: 'angle', sym: 'α' },
    width: { what: 'The theoretical sharp-corner width at the base: for a male dovetail across the corners where the flanks meet the base (narrowest), for a female slot across its bottom corners (widest).', tip: 'Use the sharp-corner drawing dimension; corner reliefs or radii do not change it.', effect: 'The reading over or between rods changes by the same amount as this width.', fig: 'length', sym: 'a' },
    rod: { what: 'The actual diameter of the gauge rods or pins placed in the dovetail corners, both the same size.', tip: 'Measure the rods themselves; a small rod size error is multiplied in the reading.', fig: 'diameter', sym: 'D' },
    depth: { what: 'The height of the dovetail flank, from the base up to the top edge. The tool uses it to check that the rods touch the flanks below the edge and to give the width at the top.', tip: 'If the rod contact point is above this depth, choose smaller rods.', fig: 'depth', sym: 'h' },
  },
  'v-groove-pin': {
    angle: { what: 'The included angle of the V-groove: the full angle between its two flanks, as given on the drawing.', tip: 'Use the full included angle, not the half angle from the centre line.', fig: 'angle', sym: 'β' },
    width: { what: 'The theoretical width of the groove at the top surface, where the two flanks would meet the surface with sharp edges.', tip: 'Use the sharp-edge width; a chamfered or rounded edge measures wider than the value the formula needs.', fig: 'length', sym: 'W' },
    pin: { what: 'The actual diameter of the gauge pin laid in the groove, measured with a micrometer.', tip: 'If the pin is too large it rests on the groove edges instead of the flanks and the tool reports it.', fig: 'diameter', sym: 'D' },
  },
  'gauge-block-stack': {
    set: { what: 'The gauge block set you have: an 88-piece metric set or an 81-piece inch set. It decides which block sizes the tool may combine and the unit of the length.', tip: 'Check your set’s inventory; missing or worn blocks may need a different combination.', fig: 'choice' },
    target: { what: 'The exact length you want the wrung stack of gauge blocks to make, in millimetres for the metric set or inches for the inch set.', tip: 'Match the unit to the set chosen above. The length must be a whole multiple of the set’s smallest step, or no stack can be found.', fig: 'length' },
  },
  'abbe-error': {
    offset: { what: 'The distance at right angles between the line along which the instrument’s scale reads and the line along which the part is actually measured, for example how far a caliper’s jaws reach out from its beam.', tip: 'Measure square to the measuring direction; the error is zero only when the scale and the measured line coincide.', effect: 'The Abbe error rises in proportion to the offset.', fig: 'length', sym: 'h' },
    tilt: { what: 'The small angle by which the slide or moving jaw tips as it travels, from play or straightness error, taken from the instrument specification or a test.', tip: 'Enter arc-seconds, not degrees or minutes: 1 arc-minute is 60 arc-seconds.', effect: 'For these small angles the error rises almost in proportion to the tilt.', fig: 'angle', sym: 'φ' },
    tolerance: { what: 'The full tolerance band of the feature being checked: upper limit minus lower limit. The tool shows how much of it the Abbe error alone uses up.', tip: 'Enter the total band; for ±0.025 that is 0.05, not 0.025.', fig: 'tolerance', sym: 'T' },
  },
  'rss-tolerance-stack': {
    dir1: { what: 'Whether this dimension in the stack makes the gap bigger (adds) or smaller (subtracts) as it grows, or is not part of the stack.', tip: 'Walk the loop round the assembly from one side of the gap to the other; dimensions pointing the same way as the gap add.', fig: 'choice' },
    nom1: { what: 'The basic size of this dimension in the stack, as shown on the drawing, before tolerance.', tip: 'If the tolerance is unequal, use the mid-limit size as the nominal and half the band as the ± tolerance.', fig: 'length' },
    tol1: { what: 'The equal plus-or-minus tolerance on this dimension: half its tolerance band.', tip: 'Enter the ± value, not the full band. Convert an unequal tolerance to a mid-limit nominal with an equal ± first.', effect: 'Each tolerance adds directly to the worst case but only as its square to the RSS result, so the largest ones dominate.', fig: 'tolerance', sym: 't' },
    dir2: { what: 'Whether this dimension in the stack makes the gap bigger (adds) or smaller (subtracts) as it grows, or is not part of the stack.', tip: 'Walk the loop round the assembly from one side of the gap to the other; dimensions pointing the same way as the gap add.', fig: 'choice' },
    nom2: { what: 'The basic size of this dimension in the stack, as shown on the drawing, before tolerance.', tip: 'If the tolerance is unequal, use the mid-limit size as the nominal and half the band as the ± tolerance.', fig: 'length' },
    tol2: { what: 'The equal plus-or-minus tolerance on this dimension: half its tolerance band.', tip: 'Enter the ± value, not the full band. Convert an unequal tolerance to a mid-limit nominal with an equal ± first.', fig: 'tolerance', sym: 't' },
    dir3: { what: 'Whether this dimension in the stack makes the gap bigger (adds) or smaller (subtracts) as it grows, or is not part of the stack.', tip: 'Walk the loop round the assembly from one side of the gap to the other; dimensions pointing the same way as the gap add.', fig: 'choice' },
    nom3: { what: 'The basic size of this dimension in the stack, as shown on the drawing, before tolerance.', tip: 'If the tolerance is unequal, use the mid-limit size as the nominal and half the band as the ± tolerance.', fig: 'length' },
    tol3: { what: 'The equal plus-or-minus tolerance on this dimension: half its tolerance band.', tip: 'Enter the ± value, not the full band. Convert an unequal tolerance to a mid-limit nominal with an equal ± first.', fig: 'tolerance', sym: 't' },
    dir4: { what: 'Whether this dimension in the stack makes the gap bigger (adds) or smaller (subtracts) as it grows, or is not part of the stack.', tip: 'Walk the loop round the assembly from one side of the gap to the other; dimensions pointing the same way as the gap add.', fig: 'choice' },
    nom4: { what: 'The basic size of this dimension in the stack, as shown on the drawing, before tolerance.', tip: 'If the tolerance is unequal, use the mid-limit size as the nominal and half the band as the ± tolerance.', fig: 'length' },
    tol4: { what: 'The equal plus-or-minus tolerance on this dimension: half its tolerance band.', tip: 'Enter the ± value, not the full band. Convert an unequal tolerance to a mid-limit nominal with an equal ± first.', fig: 'tolerance', sym: 't' },
    dir5: { what: 'Whether this dimension in the stack makes the gap bigger (adds) or smaller (subtracts) as it grows, or is not part of the stack.', tip: 'Choose not used when the stack has fewer dimensions; its nominal and tolerance are then ignored.', fig: 'choice' },
    nom5: { what: 'The basic size of this dimension in the stack, as shown on the drawing, before tolerance.', tip: 'Ignored when the direction is set to not used.', fig: 'length' },
    tol5: { what: 'The equal plus-or-minus tolerance on this dimension: half its tolerance band.', tip: 'Enter the ± value, not the full band. Ignored when the direction is set to not used.', fig: 'tolerance', sym: 't' },
    reqMin: { what: 'The smallest gap the assembly can accept and still work, from the design requirement. A negative value means a minimum interference.', tip: 'Take it from the functional requirement, not from the nominal gap the stack happens to give.', fig: 'gap' },
    reqMax: { what: 'The largest gap the assembly can accept and still work, from the design requirement.', tip: 'It must not be smaller than the minimum allowed gap.', fig: 'gap' },
    inflate: { what: 'A multiplier applied to the plain root-sum-square result to allow for processes that are off-centre or not normally distributed. A value of 1 gives plain RSS.', tip: 'Use the factor your organisation’s tolerancing rule specifies; do not choose it to make a stack pass.', effect: 'The RSS range widens in proportion to this factor; the worst case is unchanged.', fig: 'factor', sym: 'k' },
  },
  'it-tolerance-grade': {
    size: { what: 'The basic size of the feature, such as a shaft or hole diameter, as shown on the drawing. It selects the ISO 286 size step used in the formula.', tip: 'A size exactly on a step boundary belongs to the lower step: 18 mm falls in the over 10 to 18 mm step.', fig: 'diameter' },
    grade: { what: 'The international tolerance (IT) grade specified on the drawing or under consideration. A higher grade number means a wider tolerance band.', tip: 'The tool gives the formula value; drawings and inspection use the rounded ISO 286-1 table value.', fig: 'choice' },
  },
  'length-converter': {
    value: { what: 'The length you want to convert, exactly as written on the drawing, data sheet or quote.', tip: 'Copy the number with all its decimals; round only the converted result.', fig: 'length' },
    from: { what: 'The unit the length was given in. The tool converts from this unit to every other listed length unit.', tip: 'Check the prefix carefully: mm, µm and m differ by factors of 1000, and a thou (mil) is one thousandth of an inch.', fig: 'choice' },
  },
  'force-converter': {
    value: { what: 'The force you want to convert, exactly as written on the drawing, data sheet or quote.', tip: 'A mass in kg or lb is not a force; use kgf or lbf only when the source means a force.', fig: 'force' },
    from: { what: 'The unit the force was given in. The tool converts from this unit to every other listed force unit.', tip: 'Check prefixes such as k and M, and whether a “ton” means tonne-force or another ton.', fig: 'choice' },
  },
  'pressure-converter': {
    value: { what: 'The pressure or stress you want to convert, exactly as written on the gauge, drawing, data sheet or quote.', tip: 'Converting units does not change gauge pressure to absolute pressure; keep track of which one the source gives.', fig: 'pressure' },
    from: { what: 'The unit the pressure or stress was given in. The tool converts from this unit to every other listed pressure unit.', tip: 'MPa and N/mm² are the same unit; check prefixes such as k, M and G carefully.', fig: 'choice' },
  },
  'torque-converter': {
    value: { what: 'The torque or moment you want to convert, exactly as written on the drawing, data sheet or tightening specification.', tip: 'Copy the number with all its decimals; round only the converted result.', fig: 'torque' },
    from: { what: 'The unit the torque was given in. The tool converts from this unit to every other listed torque unit.', tip: 'lbf·ft and lbf·in differ by a factor of 12, and N·m and N·mm by 1000; check which one the source uses.', fig: 'choice' },
  },
  'power-converter': {
    value: { what: 'The power you want to convert, exactly as written on the nameplate, data sheet or quote.', tip: 'Mechanical horsepower (hp) and metric horsepower (PS) are different units; check which one the source uses.', fig: 'power' },
    from: { what: 'The unit the power was given in. The tool converts from this unit to every other listed power unit.', tip: 'BTU/h and tons of refrigeration describe heat flow rates; choose them only when the source does.', fig: 'choice' },
  },
  'energy-converter': {
    value: { what: 'The energy or work you want to convert, exactly as written on the bill, data sheet or quote.', tip: 'Energy is not power: kWh is an amount of energy, kW is a rate. Use the power converter for rates.', fig: 'energy' },
    from: { what: 'The unit the energy was given in. The tool converts from this unit to every other listed energy unit.', tip: 'Check whether a calorie value is in cal or kcal; food labels often write kcal as “Calories”.', fig: 'choice' },
  },
  'flow-converter': {
    value: { what: 'The volume flow rate you want to convert, exactly as written on the pump curve, data sheet or quote.', tip: 'US and UK gallons are different sizes; check which one the source uses.', fig: 'flow' },
    from: { what: 'The unit the flow rate was given in. The tool converts from this unit to every other listed flow unit.', tip: 'Check the time base as well as the volume: per second, per minute and per hour differ by factors of 60.', fig: 'choice' },
  },
  'mass-converter': {
    value: { what: 'The mass you want to convert, exactly as written on the drawing, data sheet, label or quote.', tip: 'Copy the number with all its decimals; round only the converted result.', fig: 'mass' },
    from: { what: 'The unit the mass was given in. The tool converts from this unit to every other listed mass unit.', tip: 'A “ton” may be a tonne, a short ton or a long ton; check which one the source means.', fig: 'choice' },
  },
  'velocity-converter': {
    value: { what: 'The speed or feed rate you want to convert, exactly as written on the data sheet, program or quote.', tip: 'This converts linear speeds only; a spindle speed in rpm needs a diameter to become a surface speed.', fig: 'velocity' },
    from: { what: 'The unit the speed was given in. The tool converts from this unit to every other listed speed unit.', tip: 'Check the time base: per second and per minute differ by a factor of 60. Surface feet per minute (sfm) is ft/min.', fig: 'choice' },
  },
  'angle-converter': {
    value: { what: 'The angle you want to convert, exactly as written on the drawing, specification or instrument.', tip: 'Write degrees, minutes and seconds as decimal degrees first, or convert each part separately.', fig: 'angle' },
    from: { what: 'The unit the angle was given in. The tool converts from this unit to every other listed angle unit.', tip: 'Calculators and software often work in radians; check which one the source used.', fig: 'choice' },
  },
  'temperature-converter': {
    kind: { what: 'Whether the number is a temperature reading (a point on the scale) or a temperature difference (a change or rise). Readings convert with the scale offsets; differences do not.', tip: 'A rise of 10 °C is 18 °F, but a reading of 10 °C is 50 °F; choose difference for rises and changes.', fig: 'choice' },
    value: { what: 'The temperature reading or temperature change you want to convert, as written.', tip: 'A reading below absolute zero is rejected; check the sign and the scale.', fig: 'temperature' },
    from: { what: 'The temperature scale the value is in: Celsius, Fahrenheit, kelvin or Rankine.', tip: 'Kelvin and Rankine are absolute scales that start at absolute zero.', fig: 'choice' },
  },
  'decimal-fraction': {
    value: { what: 'The decimal number to express as a fraction: a size in inches for drill, bar or tool selection, or a plain ratio.', tip: 'For a size in millimetres, divide by 25.4 first to get inches.', fig: 'number', sym: 'x' },
    denom: { what: 'The finest fraction step you can actually use, for example the step between fractional drill or reamer sizes. The nearest fraction is rounded to this step.', tip: 'A finer step gets closer to the value but may give a size you cannot buy.', fig: 'choice' },
    maxDen: { what: 'The largest denominator allowed when the tool searches for the closest possible fraction, for example the largest gear tooth count available in a change-gear train.', tip: 'Used only for the best-fraction result, not for the nearest fractional-inch size.', effect: 'A larger limit allows a closer best fraction.', fig: 'count', sym: 'N' },
  },
});
