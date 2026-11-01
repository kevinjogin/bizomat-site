---
book: whirling-shafts-by-the-numbers
chapterSlug: balancing-in-one-plane
order: 6
title: "Balancing in one plane"
description: "Balancing a narrow rotor in one plane: adding unbalances as vectors, sizing and placing a correction weight, the residual left by weight steps and angle errors, and trial-weight field balancing."
draft: false
---

A narrow rotor, one whose length along the shaft is small compared with its diameter, can usually be balanced in a single plane. A fan wheel, a pulley, a grinding wheel or a flywheel behaves almost as if all its mass lay in one plane, so any unbalance it has is effectively static: its centre of mass is off the axis, and one correction weight opposite the heavy side puts it back.

This chapter balances the HM-30's discharge fan wheel. It shows how known unbalances add as vectors, how a WORKOS tool works out the correction and the residual left by practical weights and placement, how to balance in place on the machine with a trial weight when the unbalance is not known, and how a correction placed at a mirror-image angle made the vibration worse.

## The discharge fan

This is an illustration. The HM-30 blows its ground meal out through a pneumatic discharge, driven by a fan with its own motor. The fan wheel is a welded steel paddle wheel, 450 mm in diameter and 18 kg, running at 2,950 rpm. Its width is about a fifth of its diameter, narrow enough to be balanced in one plane. The maker balances it to G 6.3, which for 18 kg at 2,950 rpm allows a residual unbalance of 20.4 µm × 18 kg = 367 g·mm.

## Unbalances add as vectors

Each source of unbalance on the wheel is a mass at a radius and an angle. Because each produces a force pointing outwards at its own angle, they add as vectors: the total unbalance is found by resolving each into two perpendicular components, adding the components, and recombining.

This is an illustration. Before balancing, the maker's quality engineer measured three known contributors on a sample wheel: a weld bead heavier on one blade than its neighbours, a blade cut slightly long, and the extra metal of a boss at the hub.

```figure
type: compare
title: Known unbalances on the HM-30 discharge fan wheel
cols: Mass, g | Radius, mm | Angle | Unbalance, g·mm | x component, g·mm | y component, g·mm
rowhead: Source
- Heavy weld bead | 12 | 200 | 0° | 2,400 | 2,400 | 0
- Long blade | 8 | 180 | 90° | 1,440 | 0 | 1,440
- Hub boss | 5 | 210 | 200° | 1,050 | −987 | −359
- * Total | | | 37.4° | 1,779 | 1,413 | 1,081
caption: This is an illustration. Angles measured in the direction of rotation from a reference mark on the hub. The total is √(1,413² + 1,081²) = 1,779 g·mm at an angle whose tangent is 1,081 ÷ 1,413.
```

The three contributions, totalling 4,890 g·mm if simply added, partly cancel: the resultant is 1,779 g·mm at 37.4°. Unbalances can never be added as plain numbers.

Before calculators, balancers added unbalances graphically: each one drawn to scale as an arrow from the end of the last, so that the line from the start of the first arrow to the tip of the last is the resultant. The method is still worth knowing, because a quick polar sketch on the back of a job card catches the commonest arithmetic slip, a component with the wrong sign. If the calculated resultant does not point roughly where the sketch says, one of the angles has been entered in the wrong quadrant. The figure below is that sketch for the fan wheel, drawn with each unbalance from the centre.

```figure
type: svg
title: Three unbalances and their resultant on the fan wheel
alt: A polar diagram centred on the hub. An arrow points right, at 0 degrees, for the 2,400 gram-millimetre weld bead. A shorter arrow points straight up, at 90 degrees, for the 1,440 gram-millimetre long blade. A short arrow points down and to the left, at 200 degrees, for the 1,050 gram-millimetre hub boss. A thicker arrow from the centre points up and to the right at about 37 degrees: the 1,779 gram-millimetre resultant. Opposite it, at about 217 degrees, a small filled circle marks where the correction weight goes.
caption: The resultant points to the heavy side; the correction weight goes directly opposite, at 37.4° + 180° = 217.4°. Scale: 100 px = 1,000 g·mm.
viewbox: 0 0 640 360
body:
<circle class="li" cx="320" cy="180" r="150"/>
<path class="cl" d="M150 180H490M320 20V340"/>
<path class="ln" d="M320 180H560"/>
<path class="ah" d="M548 174L560 180L548 186Z"/>
<text class="tx txs" x="500" y="168">weld bead 2,400</text>
<path class="ln" d="M320 180V36"/>
<path class="ah" d="M314 48L320 36L326 48Z"/>
<text class="tx txs" x="330" y="110">long blade 1,440</text>
<path class="ln" d="M320 180L221 216"/>
<text class="tx txs" x="40" y="250">hub boss 1,050</text>
<path class="la draw" pathLength="1" d="M320 180L461 72"/>
<path class="ah" d="M448 74L461 72L455 84Z"/>
<text class="txb" x="470" y="70">resultant 1,779 at 37.4°</text>
<circle class="fa pulse" cx="201" cy="271" r="8"/>
<text class="txb" x="40" y="330">correction at 217.4°</text>
```

## Working out the correction

The correction is a mass m_c placed at a chosen radius r_c, opposite the resultant, with m_c × r_c equal to the resultant unbalance. In practice there are two limitations. Weights come in steps, say 1 g washers or 5 g clips, so the exact mass must be rounded. And a weight is never placed at exactly the right angle; a few degrees' error is normal. Both leave a residual unbalance.

The WORKOS [Single-plane balance correction check](/tools/balance-correction-check/) tool does the whole calculation. From up to four known unbalance masses, each with its radius and angle, it gives the resultant unbalance and its angle, the centrifugal force it produces at the rotor's speed, the exact correction mass at your correction radius and its angle opposite, and the correction rounded to your weight step. It then works out the residual unbalance left by the rounded weight placed with your angle error, and compares it with the permissible residual for the rotor's mass, maximum speed and balance grade.

```figure
type: steps
title: The fan wheel in the single-plane balance correction tool
caption: This is an illustration. Correction radius 210 mm; weights in 1 g steps; an angle placement error of 3°; rotor 18 kg at 2,950 rpm, G 6.3.
- Resultant unbalance | 1,779 g·mm at 37.4°
- Force at 2,950 rpm before correction | 169.8 N
- Exact correction | 1,779 ÷ 210 = 8.47 g at 217.4°
- Rounded to the 1 g step | 8 g
- Permissible residual at G 6.3 | 367 g·mm (e = 20.4 µm)
- * Residual with 8 g placed 3° off | 134 g·mm: grade reached
```

### How placement error matters

The residual from an angle error grows quickly. A correction exactly the right size but placed θ degrees off leaves a residual of about 2 × U × sin(θ ÷ 2), which for small angles is roughly U times θ in radians: 1.7% of the original unbalance per degree.

```figure
type: compare
title: Residual unbalance on the fan wheel for different weights and placement
cols: Correction used | Angle error | Residual, g·mm | Within 367 g·mm?
rowhead: Case
- 1 g steps, careful placement | 8 g | 3° | 134 | yes
- 1 g steps, rough placement | 8 g | 10° | 317 | yes, just
- 1 g steps, careless placement | 8 g | 20° | 609 | no
- 5 g clip steps, careful placement | 10 g | 3° | 336 | yes, just
caption: This is an illustration. From the single-plane tool. Both weight step and angle error use up the tolerance; together they can use it all.
```

A fan wheel that started at nearly five times its tolerance ends within it only if the correction is placed within about 10° of the right angle with fine weights. Marking the angle with a protractor template on the hub, rather than by eye, is a small investment that pays every time.

## Balancing in place with a trial weight

The known-unbalance calculation needs every unbalance to be known, which is rarely true of a machine in service. A rotor that has worn, collected build-up or been repaired has an unknown unbalance. It can still be balanced in place, on its own bearings at its own speed, by measuring the vibration it causes.

The method uses a vibration meter with a phase reference, a once-per-revolution signal from a reflective mark on the shaft, so that each reading has a size and an angle. Three runs are needed:

1. **Original run.** Measure the vibration O, size and phase, at the bearing nearest the rotor.
2. **Trial run.** Stop, fit a known trial weight T at a marked angle, run again, and measure the new vibration O + T.
3. **Calculate.** The trial weight's effect is the vector difference (O + T) − O. The correction is the trial weight scaled and rotated so that its effect exactly cancels O.

This is an illustration. The HM-30's fan, after a year's service, vibrated at 7.2 mm/s at a phase of 40°. The technician fitted a 20 g trial weight at 0° on the 210 mm radius. The vibration became 4.1 mm/s at 110°.

```figure
type: steps
title: Field balancing the fan with a trial weight
caption: This is an illustration. Vectors in mm/s; phases from the shaft's reference mark, measured in the same direction as the weight angles. The sensitivity of 0.348 mm/s per gram is specific to this fan, its supports and its speed.
- Original vibration | O = 7.2 mm/s at 40°
- With 20 g trial at 0° | O + T = 4.1 mm/s at 110°
- Effect of the trial weight | T = (O + T) − O = 6.96 mm/s at 186.4°
- Sensitivity | 6.96 ÷ 20 = 0.348 mm/s per gram, with a lag of 186.4° from weight to response
- Correction needed to cancel O | 7.2 ÷ 0.348 = 20.7 g
- * Correction angle | 0° + (40° + 180° − 186.4°) = 33.6°
```

The technician removed the trial weight, fitted 21 g at 35°, the nearest available weight and a marked hole, and ran the fan again: 0.2 mm/s, well within the maker's acceptance level. The trial-weight method needs no knowledge of the unbalance's cause or the rotor's mass, only consistent measurement, which is why it is the everyday tool of field balancing.

### Choosing and fixing the trial weight

The trial weight has to be large enough to change the vibration clearly, by roughly a quarter or more in size or a few tens of degrees in phase, so that its effect stands out from the reading's normal scatter. Too small, and the calculated sensitivity is mostly noise; too large, and the trial run itself may shake the machine harder than is safe. A technician who has balanced the same model before starts from the sensitivity found last time: on the HM-30 fan, 0.348 mm/s per gram means a 20 g trial changes a 7.2 mm/s reading by about 7 mm/s, which is clear without being alarming.

The trial weight is also a projectile. This is an illustration. At 2,950 rpm, a 20 g weight at a radius of 210 mm pulls outwards with a force of 0.020 × 0.210 × 308.9² = 401 N, about the weight of a 40 kg bag. A trial weight held on by tape, magnet or a loose clip can leave the wheel at about 65 m/s. Trial and correction weights are bolted, welded by a qualified welder, or clamped in a purpose-made fixing, and the guard goes back on before every run.

### Using the sensitivity again

The sensitivity found in a field balance, 0.348 mm/s per gram with a lag of 186.4° on the HM-30 fan, is a property of that fan, its shaft, its bearings, its supports and its speed. On an identical machine on an identical foundation it will be very nearly the same. A service technician who keeps it on record can balance the next identical fan in one run instead of two: measure the original vibration, calculate the correction from the stored sensitivity, fit it and check. The maker's service department keeps a sensitivity for each fan size on a standard base.

The stored value is only as good as the "identical". Chapter 4 showed how much a soft foundation changes a rotor's response; a fan on a mezzanine will have a different sensitivity, and usually a different lag, from the same fan on a plinth. If a one-run correction does not bring the vibration down as predicted, the technician goes back to the full trial-weight method rather than trying a second guess.

### Before balancing machines: knife edges

The oldest way to balance a narrow rotor needs no instrument at all. The rotor, on its shaft, is laid across two hardened, levelled knife edges or rollers. Its heavy side rolls to the bottom. Weights are added opposite the heavy side until the rotor stays put in any position it is turned to. This static balancing finds only static unbalance, which is all a narrow rotor has, and its sensitivity is limited by friction at the edges: a small enough unbalance cannot overcome the rolling resistance, so it is never found. For a small, slow wheel that can be enough. For a fan at 2,950 rpm balanced to G 6.3, the few hundred gram-millimetres of permissible residual are usually below what knife edges can detect, which is why the maker uses a balancing machine for new wheels and the trial-weight method in the field.

### When one plane is not enough

One-plane balancing assumes the rotor's unbalance is static, which is true when the rotor is narrow. A check is built into the readings: measure the vibration at both bearings. If the two bearings move roughly in phase, the unbalance is mainly static and one plane will do. If they move roughly in opposite phase, there is couple unbalance, which a single correction weight cannot remove, however carefully it is placed; correcting the static part may even make one bearing worse. The rotor then needs two planes, as Chapter 7 describes. The HM-30's fan, with a width a fifth of its diameter, showed its two bearings within about 20° of each other in phase, so one plane was right for it.

### Recording the job

A field balance is complete only when it is written down: the machine and its speed, the instrument and its phase reference, the original, trial and final readings with their phases, the trial weight and its position, the correction fitted and its position, and the final vibration against the acceptance level. A photograph of the weights in place helps the next technician, who will otherwise wonder whether the weld bead on blade 4 is a correction or a defect. The maker's service report form has a line for each of those items.

## The error: the mirror-image angle

This is an illustration. On another HM-30, a newer technician followed the same procedure and calculated a correction of 20.7 g at 33.6°. After fitting it, the vibration was worse than before: 8.0 mm/s.

The calculation was right. The placement was not. The technician had measured the weight angles on the fan hub against the direction of rotation, while the instrument's phase angles were measured with it. A weight at 33.6° in one convention is at 326.4° in the other, the mirror image about the reference mark. Placed there, the correction's effect, instead of cancelling the original vibration, added to it at an awkward angle.

```figure
type: compare
title: The same 20.7 g correction at two angles
cols: Predicted vibration after correction
rowhead: Where it was placed
- * At 33.6°, measured in the direction of rotation (correct) | about 0 mm/s
- At 326.4°, the mirror-image angle | 8.0 mm/s at 96°
- Original, before any correction | 7.2 mm/s at 40°
caption: This is an illustration. Predicted from the measured sensitivity. A correction at the mirror angle makes things worse whenever the original phase is far from 0° or 180°.
```

The rule the maker added to its field balancing instruction is simple: before fitting the trial weight, write on the guard which way the shaft turns and which way angles are counted, and count both the weight positions and the phase readings the same way. A warning sign that a convention is crossed is a trial run whose phase moves the "wrong" way; checking it costs one more run.

## Exercise: a heavier trial weight

This is an illustration. A technician balancing an HM-30 fan measures an original vibration of 5.0 mm/s at 300°. With a 30 g trial weight at 90°, the reading becomes 6.5 mm/s at 20°.

1. Find the trial weight's effect, size and angle.
2. What is the sensitivity, and the lag from weight to response?
3. What correction, size and angle, cancels the original vibration?

**Worked answer.**

1. O = 5.0 at 300°: (2.50, −4.33). O + T = 6.5 at 20°: (6.11, 2.22). T = (3.61, 6.55), which is **7.48 mm/s at 61.2°**.
2. Sensitivity 7.48 ÷ 30 = **0.249 mm/s per gram**; lag 61.2° − 90° = **−28.8°** (the response leads the weight by 28.8°).
3. Correction mass 5.0 ÷ 0.249 = **20.1 g**. Its effect must point at 300° + 180° = 120°, so the weight goes at 120° − (−28.8°) = **148.8°**, about 149°. Remove the trial weight before fitting it.
