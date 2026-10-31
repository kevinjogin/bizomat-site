---
book: shaft-alignment-by-the-numbers
chapterSlug: indicators-brackets-and-sag
order: 5
title: "Dial indicators, brackets and sag"
description: "How dial indicator readings round a coupling relate to offset, how to measure and correct bracket sag, and how the validity rule catches a bad set of readings before it is used."
draft: false
---

Every alignment method in this book depends on readings, and readings depend on the instrument and how it is mounted. A dial indicator reading to 0.01 mm is easily good enough for the HW-3's 0.05 mm tolerance, but only if the bracket holding it is rigid, its sag is known, the shafts turn together, and nothing slips between readings. None of those can be assumed.

This chapter covers the dial indicator as an alignment instrument: what a rim reading measures, how bracket sag distorts it and how to measure and remove the sag, and the validity rule that checks a set of readings for internal consistency. It also shows the HW-3's first set of readings, which the rule rejected, and the sign error that nearly halved the offset.

## What a rim reading measures

For a rim reading, a bracket is clamped to one shaft, the stationary pump's for the HW-3, and reaches across the coupling to hold an indicator whose tip rests on the outside of the other shaft's coupling hub, the motor's. The indicator is zeroed at 12 o'clock, and both shafts are turned together, so that the tip stays on the same spot of the hub while the bracket swings round. Readings are taken at 3, 6 and 9 o'clock.

If the motor's shaft is offset from the pump's, the distance from the bracket to the hub's surface changes as they turn, and the indicator follows it. Turning from 12 to 6 o'clock carries the tip from one side of the offset to the other, so the reading at 6 o'clock is twice the vertical offset. The difference between the 9 and 3 o'clock readings is twice the horizontal offset. That doubled reading is called the total indicator reading, TIR.

Turning both shafts together has a further benefit: the tip stays on one spot of the hub, so any eccentricity or runout of the hub's surface does not enter the reading. Turning only the shaft with the bracket would let the tip run round the hub and add the hub's runout to every reading.

```figure
type: formula
title: Rim readings and offset
formula: vertical offset = (reading at 6 − reading at 12) ÷ 2
formula: horizontal offset = (reading at 9 − reading at 3) ÷ 2
formula: validity: reading at 12 + reading at 6 = reading at 3 + reading at 9
caption: With the indicator zeroed at 12 o'clock, the reading at 6 is the vertical TIR. Signs follow the indicator: positive when the plunger is pushed in. The sign convention that turns a positive reading into "add shims" or "move left" belongs to the method and tool used (Chapter 6).
- TIR | total indicator reading, twice the offset at the reading plane
- Validity rule | both sides equal twice the reading at the centre of the circle; a mismatch means a bad set
```

## Bracket sag

No bracket is perfectly rigid. Under its own weight and the indicator's, the end of the bracket droops slightly. At 12 o'clock the droop pushes the indicator's tip into the hub, and the indicator is zeroed there. At 6 o'clock the bracket hangs the other way, and the droop pulls the tip away from the hub. The indicator reads twice the droop as a negative value, even with the shafts perfectly aligned. That reading is the bracket's sag.

Sag depends on the bracket's length, stiffness and weight, and on the indicator. It can be calculated roughly but is far better measured. The HW-3 fitters clamp the same bracket, with the same indicator and the same span, to a straight length of pipe held in V-blocks on a bench, zero at 12 o'clock and turn the pipe to 6 o'clock. Their bracket read −0.08 mm. This is an illustration.

```figure
type: steps
title: Measuring sag on the bench
caption: The bracket must be set up exactly as it will be on the machine: same parts, same span, same indicator, same tip position. This is an illustration.
- Clamp the bracket to a straight pipe in V-blocks
- Set the span from clamp to tip to match the coupling: 200 mm for the HW-3
- Zero the indicator at 12 o'clock
- Turn the pipe to 6 o'clock and read: −0.08 mm
- * Turn to 3 and 9 o'clock: about −0.04 mm at each, half the sag
- Repeat twice; record the sag with the bracket's identity
```

At 3 and 9 o'clock the bracket is sideways and sags by half as much relative to its zero, about −0.04 mm at each. Because the sag at 3 and 9 is the same, it cancels in the horizontal difference, 9 minus 3. Sag affects vertical readings only.

### Correcting for sag

The vertical reading is corrected by subtracting the sag reading from it, with its sign: corrected = measured − sag. For the HW-3, the rim read +0.42 mm at 6 o'clock, so the corrected reading is 0.42 − (−0.08) = +0.50 mm, and the vertical offset is 0.25 mm. Without the correction, the offset would have been taken as 0.21 mm, 16% too small. The WORKOS rim and face tool's own limitations note that it does not include bracket sag, so the correction must be made before the readings go in.

## The HW-3 readings

The full set of rim readings on the HW-3, taken after the soft foot and pipe strain had been corrected, was 0 at 12 o'clock, +0.06 at 3, +0.42 at 6 and +0.36 at 9. This is an illustration.

```figure
type: compare
title: HW-3 rim readings, as taken and corrected
cols: As read, mm | Sag at this position, mm | Corrected, mm
rowhead: Position
- 12 o'clock | 0 | 0 | 0
- 3 o'clock | +0.06 | −0.04 | +0.10
- * 6 o'clock | +0.42 | −0.08 | +0.50
- 9 o'clock | +0.36 | −0.04 | +0.40
caption: This is an illustration. Vertical TIR 0.50 mm, offset 0.25 mm. Horizontal TIR, 9 minus 3, is 0.30 mm both as read and corrected: offset 0.15 mm. Both sets satisfy the validity rule: 0 + 0.42 = 0.06 + 0.36, and 0 + 0.50 = 0.10 + 0.40.
```

## The validity rule

As the indicator goes round the hub, its reading traces out the hub's position relative to the bracket's circle. At any two opposite positions, the readings average to the reading the indicator would show at the circle's centre. So the sum of the top and bottom readings must equal the sum of the left and right readings. Sag obeys the rule too, because it is symmetric, which is why the rule can be checked on the readings as taken.

The rule is a closure test. Going round the circle and adding opposite pairs must give the same answer by two routes; if it does not, something in the measurement did not close. The same idea checks a surveyor's traverse round a field, a four-gauge strain rosette, and, in the physics of crystals, the circuit drawn round a dislocation, which fails to close by exactly the dislocation's Burgers vector. In alignment, a set of readings that does not close has a defect in it, and the defect is in the measurement.

### The mistake: a set that did not close

The HW-3's first set of readings after the pipe work was 0, +0.06, +0.42 and +0.22, at 12, 3, 6 and 9 o'clock. Top plus bottom was 0.42; left plus right was 0.28. The difference of 0.14 mm was nearly three times the alignment tolerance.

```figure
type: decision
title: A set of readings fails the validity rule
question: What is the likely cause?
- The difference grows with each set | a bracket or clamp slipping on the shaft: tighten and re-zero
- The reading at one position jumps | indicator stem sticking or the tip on a burr or keyway edge: clean and check the stem moves freely
- The difference changes with how the shafts were turned | shafts not turned together, or backlash in the coupling: turn both by the coupling, in one direction
- Face readings disagree as well | axial float of one shaft between readings: push both shafts to the same end before each reading
- * Re-zeroed and repeated, the set now closes within 0.02 mm | accept the repeated set; discard the first
caption: The rule does not say which reading is wrong; it says that at least one is. Find the cause, then take a whole new set.
```

The bracket's clamp on the pump shaft had been tightened over a smear of anti-seize compound and was slipping a little each time the shafts were turned. Cleaned, re-clamped and re-zeroed, the set came out as 0, +0.06, +0.42 and +0.36, closing exactly, and a repeat set agreed within 0.01 mm at every position. Those are the readings in the table above.

## A second mistake: the sign of the sag

Before the readings went into the alignment calculation, a second fitter checking the sheet found that the corrected vertical reading had been entered as +0.34 mm, not +0.50 mm. The sag had been "subtracted" as a positive number: 0.42 − 0.08. The resulting offset of 0.17 mm would have left the motor 0.08 mm low after the moves, outside the 0.05 mm tolerance, and the next set of readings would have shown it.

The physical check settles the sign. At 6 o'clock the bracket droops away from the hub, so sag makes the reading less positive than it should be. The correction must therefore make the reading more positive: the sag reading is negative, and subtracting a negative adds. The site's alignment sheet now records the sag with its sign in its own box, and the correction as a separate line.

## Sag grows fast with span

A bracket is a small cantilever, and the deflection of a cantilever grows with the cube of its length under a load at its tip and with the fourth power under its own weight. So the HW-3 bracket's sag of −0.08 mm at a 200 mm span would grow to somewhere between −0.27 and −0.41 mm if the same bracket were extended to 300 mm, a factor of three to five for half as much length again. This is an illustration. Couplings with long spacers, which need long brackets, are where sag becomes the largest single correction, and where reverse indicator brackets (Chapter 7) can sag more than the misalignment they are measuring. That is why the sag must be measured with the bracket set to the actual span, every time the span changes, and why stiff, light brackets made from tube are worth their cost.

## Which way is 3 o'clock?

Clock positions only mean something once the viewing direction is fixed. Looking from the motor towards the pump, 3 o'clock is on the right; looking from the pump towards the motor, it is on the left. A horizontal correction calculated in one view and applied in the other moves the motor the wrong way, doubling the misalignment instead of removing it. The HW-3 site's alignment sheet fixes the view as "standing behind the motor, looking towards the pump", prints a small sketch of the clock face in that view, and labels the two sides of the base with their compass directions as well, so that "move towards 3 o'clock" can be checked against "move towards the north wall". Laser systems ask for the same choice when they are set up, and the same care applies.

## Resolution and repeatability

A dial indicator graduated in 0.01 mm can be read to about half a division with care, so a single reading carries an uncertainty of around ±0.005 mm, and a TIR made from two readings slightly more. Against a tolerance of 0.05 mm on offset, which is a TIR of 0.10 mm, that is comfortably small. For tighter tolerances, indicators graduated in 0.002 mm or a laser system are used.

The larger uncertainty usually comes from the set-up, not the dial: a bracket that settles, a tip on a slightly rough surface, a shaft turned with a jerk. That is what repeat sets reveal. The HW-3 procedure takes every set twice and accepts it if the two agree within 0.02 mm at each position; otherwise it finds out why. Averaging two sets that disagree, without finding the cause, hides a problem rather than solving it.

## Face readings and axial float

Face readings, used in the rim and face method of Chapter 6, measure the gap between the coupling faces as the shafts turn, and so the angle between them. The face indicator is much less affected by sag, because its tip moves along the shaft's axis rather than across it; the HW-3's face bracket sag measured under 0.01 mm and was ignored.

Face readings have their own enemy: axial float. Motors with sleeve bearings run on their magnetic centre and can move axially by a millimetre or more; even rolling bearing machines have some end play. If either shaft moves axially between readings, the face indicator reads that movement as if it were angle. The remedies are to push both shafts to the same end before each reading, or to use two face indicators 180° apart and take the difference between them, which cancels axial movement.

## Instruments and readings to trust

```figure
type: checklist
title: Before readings are used
caption: The HW-3 site's checks on every set. This is an illustration.
- x Indicator stems move freely and return to the same reading
- x Bracket sag measured on the bench with the same set-up, recorded with its sign
- x Both shafts turned together, in one direction, by the coupling
- x Validity rule checked: top plus bottom equals left plus right, within 0.02 mm
- x A repeat set agrees within 0.02 mm at every position
- x Axial float controlled for face readings
- x Sag correction applied to vertical readings as a separate, signed line
```

### Mounting the bracket

Brackets for alignment are clamped to the shaft or the coupling hub with chains, straps or V-clamps, not magnetic bases, because a magnet on a curved surface can rock and the base's own flex adds to the sag. The clamp sits on a clean, dry part of the shaft away from the keyway, and the indicator's tip rests on a machined, undamaged surface of the hub with its stem square to it. The stem is preloaded to about the middle of its travel at 12 o'clock, so that it can read both positive and negative changes without running out of travel or lifting off.

## Laser systems

Laser alignment systems replace brackets and indicators with a laser and a detector on each shaft. They have no bracket sag in the mechanical sense, because the beam does not droop, and they calculate the offsets and angles directly. They have their own sources of error: brackets that slip, sensors not rigidly mounted, heat shimmer in the air between the sensors bending the beam, and bright sunlight on the detectors. Good systems include their own repeatability checks, the electronic version of the validity rule. A fitter who understands the dial indicator version can recognise when a laser result is suspect.

## Exercise: a different bracket

A shorter bracket for a smaller pump has a measured sag of −0.05 mm. On that pump, the rim readings, zeroed at 12 o'clock, are 0 at 12, +0.05 at 3, +0.30 at 6 and +0.25 at 9. Check the validity rule, correct the readings for sag, and find the vertical and horizontal offsets.

**Worked answer.** Top plus bottom is 0 + 0.30 = 0.30 mm; left plus right is 0.05 + 0.25 = 0.30 mm. The set closes.

The sag is −0.05 mm at 6 o'clock and about −0.025 mm at 3 and 9 o'clock. Corrected readings: 12 o'clock 0; 3 o'clock 0.05 + 0.025 = 0.075; 6 o'clock 0.30 + 0.05 = 0.35; 9 o'clock 0.25 + 0.025 = 0.275. The corrected set still closes: 0 + 0.35 = 0.075 + 0.275.

The vertical offset is 0.35 ÷ 2 = 0.175 mm. The horizontal offset is (0.275 − 0.075) ÷ 2 = 0.10 mm, the same as from the readings as taken, (0.25 − 0.05) ÷ 2, because sag cancels sideways. This is an illustration.
