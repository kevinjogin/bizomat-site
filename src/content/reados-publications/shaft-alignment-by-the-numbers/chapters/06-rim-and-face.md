---
book: shaft-alignment-by-the-numbers
chapterSlug: rim-and-face
order: 6
title: "The rim and face method"
description: "How rim and face dial readings give offset and angularity at the coupling, how similar triangles turn them into corrections at the feet, and how to check the signs before moving."
draft: false
---

The rim and face method measures the movable shaft's position with two indicators mounted on the stationary shaft: one on the rim of the movable coupling hub, which reads offset, and one on its face, which reads angle. From those two numbers and three distances, simple geometry gives how much each pair of the movable machine's feet must be raised or lowered, or moved sideways, to bring its shaft into line.

This chapter works the method through on the HW-3 in both planes, using the WORKOS rim and face alignment tool, and draws the geometry the tool uses so that its answers can be checked by hand. Its mistake is a reversed face indicator, which would have doubled the angle instead of removing it.

## What the two readings give

The rim indicator, as Chapter 5 showed, reads twice the offset between the shafts at the plane where its tip touches the hub. The face indicator, mounted on the same bracket with its tip on the flat face of the movable hub, reads how the gap between the hub face and the bracket changes as they turn together. If the shafts are at an angle, the hub's face is tilted relative to the stationary shaft, and its tip moves along the axis by an amount that grows with the diameter of the circle it traces. The face reading divided by that circle's diameter is the slope between the shafts.

```figure
type: formula
title: The rim and face method
formula: offset at the reading plane = rim reading ÷ 2
formula: slope = face reading ÷ face circle diameter
formula: correction at a foot = offset + slope × distance from the reading plane to the foot
caption: Readings are taken at 6 o'clock with zero at 12 for the vertical plane, and at 9 o'clock with zero at 3 for the horizontal plane, after sag correction. In the WORKOS tool's convention, a positive correction means add shims, or move towards the side where the indicator was zeroed.
- Front distance | reading plane to the movable machine's front feet
- Back distance | reading plane to its back feet
```

### Similar triangles

The correction formula is the geometry of similar triangles. The movable shaft's centreline, extended, is a straight line. At the reading plane it sits a distance equal to the offset from the stationary shaft's line. It diverges from that line at the slope, so at any distance further along, it sits the offset plus the slope times that distance away. At the front feet, that is the correction the front feet need; at the back feet, likewise. Raising each pair of feet by its correction lifts the whole line onto the stationary shaft's line.

```figure
type: svg
title: Similar triangles from the reading plane to the feet
alt: A horizontal line represents the stationary shaft's centreline extended. Below it, a straight sloping line represents the movable shaft's centreline. At the reading plane on the left, the gap between them is labelled offset. Further right, at the front feet, the gap is larger and labelled front correction. Further right still, at the back feet, it is larger again and labelled back correction. The distances from the reading plane to the front and back feet are marked along the bottom.
caption: The gap between the two lines at each foot is the correction. The diagram is drawn for a positive slope; for the HW-3's vertical plane the slope is negative and the line rises towards the back feet.
viewbox: 0 0 640 280
body:
<path class="ln" d="M40 80H600"/>
<path class="la" d="M80 120L580 200"/>
<path class="ln dsh" d="M80 80V120M300 80V155M560 80V197"/>
<text class="tx txs" x="86" y="104">offset</text>
<text class="tx txs" x="306" y="122">front correction</text>
<text class="tx txs" x="480" y="140">back correction</text>
<path class="ln" d="M80 240H300M80 260H560"/>
<text class="tx txs" x="150" y="234">front distance</text>
<text class="tx txs" x="330" y="254">back distance</text>
<text class="txb" x="40" y="60">stationary centreline</text>
<text class="txb" x="380" y="230">movable centreline</text>
<text class="tx txs" x="60" y="40">reading plane</text>
```

## The HW-3 in the vertical plane

After sag correction, the HW-3's vertical rim reading at 6 o'clock was +0.50 mm. Its face reading at 6 o'clock, on a 150 mm circle, was −0.06 mm. The motor's front feet are 320 mm and its back feet 669 mm from the reading plane. This is an illustration.

The [rim and face alignment tool](/tools/rim-face-alignment/) takes the rim and face readings at 6 o'clock zeroed at 12, the face circle's diameter and the two distances. It returns the offset at the coupling, the angularity, and the correction at the front and back feet, as "add" or "remove". Its stated convention is the one in this book: indicators on the stationary shaft, readings on the movable coupling. Its limitations say it does not include bracket sag, soft foot or thermal growth, and its checks remind the user to confirm the convention and correct for sag.

```figure
type: steps
title: The HW-3 vertical readings in the rim and face alignment tool
caption: This is an illustration. Rim +0.50 mm (sag-corrected), face −0.06 mm, face circle 150 mm, front feet 320 mm, back feet 669 mm.
- Offset at the coupling | 0.250 mm
- Angularity | −0.400 mm/m
- * Front feet | add 0.122 mm
- Back feet | remove 0.018 mm
```

By hand: the offset is 0.50 ÷ 2 = 0.250 mm and the slope −0.06 ÷ 150 = −0.0004. At the front feet the correction is 0.250 − 0.0004 × 320 = 0.122 mm; at the back feet 0.250 − 0.0004 × 669 = −0.018 mm. The motor is low at the coupling and slightly high at its back: its front needs lifting and its back lowering very slightly. These are the corrections to bring the shafts into line cold. Chapter 8 changes the target to allow for thermal growth, and Chapter 9 makes the moves.

## The horizontal plane

For the horizontal plane, the same indicators are zeroed at 3 o'clock and read at 9 o'clock, viewed from behind the motor towards the pump. The HW-3 read +0.30 mm on the rim and +0.09 mm on the face. Sag cancels sideways, so no correction is needed.

The same tool, used for the horizontal plane as its description allows, gives an offset of 0.150 mm, an angularity of +0.600 mm/m, and corrections of 0.342 mm at the front feet and 0.551 mm at the back feet. By the tool's convention, a positive horizontal correction means moving the feet towards the side where the indicators were zeroed, here the 3 o'clock side. This is an illustration.

```figure
type: compare
title: HW-3 cold corrections from rim and face readings
cols: Rim, mm | Face, mm | Offset, mm | Slope, mm/m | Front feet, mm | Back feet, mm
rowhead: Plane
- * Vertical | +0.50 | −0.06 | 0.250 | −0.400 | add 0.122 | remove 0.018
- Horizontal | +0.30 | +0.09 | 0.150 | +0.600 | 0.342 towards 3 o'clock | 0.551 towards 3 o'clock
caption: This is an illustration. Face circle 150 mm; front feet 320 mm and back feet 669 mm from the reading plane. These corrections align the shafts cold; Chapter 8 adds the allowance for thermal growth in the vertical plane.
```

## Checking the answer before moving

A correction of a tenth of a millimetre in the wrong direction does as much harm as a missing one. Three quick checks catch most errors before anything is moved.

1. **Does the picture make sense?** A positive rim reading at 6 o'clock means the movable shaft is low. If the result says to remove shims at both feet, something is wrong.
2. **Does the slope agree with the rough check?** The fitters had already measured the gap between the coupling faces with feelers at top and bottom during the rough alignment. The HW-3's gap was slightly wider at the bottom, which means the motor's shaft tips up towards its back feet: a negative slope in the tool's convention.
3. **Do the corrections differ by the slope times the foot spacing?** The difference between the back and front corrections must equal the slope times 349 mm: −0.0004 × 349 = −0.140 mm, and −0.018 − 0.122 = −0.140 mm.

Once the signs are confirmed and the corrections agree with the plot and the difference rule, the fitter writes them on the sheet beside each foot, as "add" or "remove" with the amount, before anyone picks up a shim. That simple step separates calculating from moving, and stops a correction being applied from memory to the wrong foot.

### The mistake: a reversed face indicator

The first entry of the HW-3's vertical readings into the tool used a face reading of +0.06 mm, not −0.06. The apprentice who set up the bracket had mounted the face indicator to read the back of the hub's flange, because the front was obstructed by the coupling's bolts. From that side, the plunger moves in the opposite sense: when the gap at the front closes, the plunger on the back face extends. The reading's sign was reversed.

With +0.06 mm, the tool gave corrections of add 0.378 mm at the front and add 0.518 mm at the back. Applied, they would have left the motor's shaft at +0.0004 slope instead of zero: the angle doubled, and in the opposite direction. The second check above caught it: the feeler gauge record showed a gap wider at the bottom, which cannot go with a positive slope in the tool's convention. The face reading was re-entered as −0.06 mm, and the site's procedure now asks the person mounting the face indicator to note which face it reads and to push the shaft gently towards the pump while watching the dial, to confirm which way it moves.

```figure
type: decision
title: Sign checks for rim and face readings
question: Before entering readings, confirm:
- Rim indicator zeroed at 12 or 3, read at 6 or 9 | then a positive rim reading means the movable shaft is displaced towards the reading position
- Face indicator reads the front of the movable hub | a positive face reading at 6 means the shaft slopes down away from the coupling
- * Face indicator reads the back of a flange | reverse the sign, or remount it
- Indicators on the movable shaft, reading the stationary hub | reverse both signs, or use a tool built for that convention
caption: The WORKOS rim and face tool states its convention: indicators on the stationary shaft, readings on the movable coupling. A set-up that differs must be converted before the readings go in.
```

## Offset and angle in the corrections

It is worth seeing how much of each correction comes from offset and how much from angle. For the HW-3's vertical plane, the offset contributes 0.250 mm at both pairs of feet. The angle contributes −0.0004 × 320 = −0.128 mm at the front and −0.0004 × 669 = −0.268 mm at the back. The angle term grows with distance, so on a long machine, such as a large motor with widely spaced feet or a pump driven through a long gearbox, a small angle at the coupling becomes a large correction at the back feet. A face reading error of 0.01 mm on the HW-3's 150 mm circle would change the back correction by 0.01 ÷ 150 × 669 = 0.045 mm, almost the whole tolerance. That sensitivity is why the face circle should be as large as the hub allows, and why face readings deserve the same care as rim readings.

## Room to move

Before any move, two practical limits are checked. Vertically, a foot can only be lowered as far as the shims already under it allow. The HW-3's back feet need 0.018 mm removed, and they stand on the 2 mm starting pack fitted in Chapter 3, so there is ample room. Horizontally, a foot can only move as far as the clearance between its holding-down bolt and the hole in the foot. The HW-3's motor feet have holes 4 mm larger than their bolts, about 2 mm each way when the bolt is centred, so the 0.551 mm back correction fits easily. A machine whose bolts are already hard against one side of their holes is "bolt-bound", and must be moved by moving the stationary machine instead, by opening the holes, or in the worst case by moving the whole base.

Recording where each bolt sits in its hole after the final alignment saves time at the next one, because it shows at a glance how much room each foot still has.

## The tool's result as a record

The rim and face tool's output is also the alignment record's core. For each plane, the HW-3 sheet records the readings as taken, the sag, the corrected readings, the face circle diameter and distances, the tool's offset, angularity and corrections, and the moves actually made. A reader can then repeat the calculation and see whether the moves matched it. When a later check finds the alignment changed, the record shows whether the machine moved or the calculation was wrong.

Laser systems store the same information electronically, often with a photograph and a report. A printed or exported report filed with the machine's records serves the same purpose, provided it states the sign convention, the view direction and whether thermal targets were included.

## Where rim and face works best

The rim and face method suits couplings with large hubs and short distances between shaft ends, where a face reading on a large circle gives good resolution of the angle. It is less suited to small hubs, where the face circle is small and the angle is poorly resolved, and to machines with axial float, where face readings are unreliable unless controlled (Chapter 5). For those, and for long spacer couplings, the reverse indicator method of Chapter 7 is usually better.

A useful property of the method is that it needs to turn only the two shafts together and does not need the motor's bracket to reach the pump. A disadvantage is that both indicators are on one bracket, so a single loose clamp corrupts both readings at once. The validity rule on the rim readings, and a repeat set, guard against that.

### Reading the other way round

Sometimes the bracket can only be clamped to the movable shaft, with the indicators reading the stationary hub. The geometry is the same, but the readings describe the stationary shaft's position relative to the movable one, so both signs reverse, and the distances to the feet are measured from a reading plane that is now on the stationary hub, so they become longer by the distance between the hub faces. The WORKOS tool is built for indicators on the stationary shaft. With the other set-up, the safe course is to convert the readings and distances explicitly on the sheet before entering them, and to check the result against a plot, rather than relying on remembering to flip signs in the head.

### Plotting as a check

Before calculators were common, fitters plotted the corrections. On squared paper, with the horizontal scale in hundreds of millimetres and the vertical scale in hundredths, mark the stationary centreline as a horizontal line, the offset at the reading plane, and a line through it at the measured slope. The vertical distance from that line to the stationary centreline at each foot position is the correction. A plot takes five minutes, shows the whole situation at a glance and catches the sign errors that a column of numbers hides. Many fitters still draw one beside the tool's result.

## Exercise: another set of readings

On a smaller pump set with the same layout, front feet 320 mm and back feet 669 mm from the reading plane and a face circle of 150 mm, the sag-corrected vertical readings are rim +0.20 mm and face +0.03 mm. Find the offset, slope and corrections, and check them with the difference rule.

**Worked answer.** The offset is 0.20 ÷ 2 = 0.100 mm and the slope +0.03 ÷ 150 = +0.0002, or +0.200 mm/m. The front correction is 0.100 + 0.0002 × 320 = 0.164 mm and the back correction 0.100 + 0.0002 × 669 = 0.234 mm: add shims at both.

The difference rule: 0.234 − 0.164 = 0.070 mm, and the slope times the foot spacing is 0.0002 × 349 = 0.070 mm. The two agree. Here the motor is low and sloping down away from the coupling, so its back feet need more shims than its front feet. This is an illustration.
