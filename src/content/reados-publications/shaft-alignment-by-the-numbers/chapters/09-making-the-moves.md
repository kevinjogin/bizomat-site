---
book: shaft-alignment-by-the-numbers
chapterSlug: making-the-moves
order: 9
title: "Making the moves"
description: "How to combine readings and thermal growth into cold shim corrections, choose shims, make the vertical then horizontal moves against indicators, and confirm the running result."
draft: false
---

Everything so far has produced numbers. This chapter turns them into shims under feet and millimetres of sideways movement, and then proves that the machine ended where the numbers said it would. It is the part of an alignment that takes the least thought and the most care: a correction of 0.192 mm is easy to calculate and easy to get wrong with a shim pack, a spanner and a foot that has two neighbours.

The chapter uses the WORKOS shaft alignment plan tool, which combines Chapter 6's rim and face corrections with Chapter 8's thermal growth into cold shim corrections and a running check. It follows the HW-3 through its vertical and horizontal moves, and its mistake is the simplest one on the shop floor: the right shims under the wrong feet.

## The plan

The [shaft alignment plan tool](/tools/shaft-alignment-plan/) takes the movable machine's rim and face readings at 6 o'clock, zeroed at 12, with the face circle's diameter and the distances to the front and back feet, as the rim and face tool does. It also takes each machine's foot-to-centreline height, expansion coefficient and support temperature rise, as the thermal growth tool does, and the offset and angularity tolerances. It returns the offset and angularity as read, each machine's growth, the cold shim corrections at the front and back feet that give true alignment when hot, and the running offset if nothing were changed, checked against the tolerances. Its convention is the rim and face tool's, and it works in the vertical plane, with rigid feet.

```figure
type: steps
title: The HW-3 as found, in the shaft alignment plan tool
caption: This is an illustration. Rim +0.50 mm (sag-corrected), face −0.06 mm on 150 mm, front 320 mm, back 669 mm; pump H = 280 mm, 11 µm/(m·K), 45 K; motor H = 250 mm, 11 µm/(m·K), 25 K; tolerances 0.05 mm and 0.05 mm per 100 mm.
- Offset and angularity as read | 0.250 mm; −0.040 mm per 100 mm
- Thermal growth, stationary and movable | 0.139 mm and 0.069 mm
- Movable machine grows more by | −0.070 mm
- * Cold correction at the front feet | add 0.192 mm
- Cold correction at the back feet | add 0.052 mm
- Running offset if unchanged | 0.320 mm: REALIGN
```

The cold corrections are Chapter 6's corrections plus Chapter 8's target: add 0.122 + 0.070 = 0.192 mm at the front, and −0.018 + 0.070 = 0.052 mm at the back. Left as found, the HW-3 would run 0.320 mm out at the coupling, six times the tolerance. Its angularity of 0.040 mm per 100 mm is within the 0.05 tolerance on its own, but the offset is not.

## Choosing shims

Pre-cut stainless shims come in standard thicknesses. The HW-3's kit has 0.025, 0.05, 0.10, 0.20, 0.25, 0.50 and 1.00 mm shims. The corrections are rounded to what the kit can build with as few shims as possible.

```figure
type: compare
title: HW-3 vertical shim changes
cols: Correction, mm | Shims added | Built, mm | Left over, mm
rowhead: Feet
- * Front pair | add 0.192 | one 0.20 under each foot | 0.200 | 0.008 over
- Back pair | add 0.052 | one 0.05 under each foot | 0.050 | 0.002 under
caption: This is an illustration. Each foot of a pair gets the same change. Both feet already stand on the 2 mm starting pack from Chapter 3, so a removal would also have been possible.
```

The leftovers, 0.008 mm and 0.002 mm, are far below the tolerance and below what the indicators can reliably resolve. Chasing them would waste time. A useful rule is to stop correcting when the remaining correction is less than about a fifth of the tolerance.

### How to shim

1. Loosen all four holding-down bolts on the motor, not just one pair, so the frame is not twisted while one end is lifted.
2. Lift one end with a jack or the jacking screws just enough to slide shims in; do not lift more than needed.
3. Add the shims under both feet of that pair, fully under the foot, slots round the bolts.
4. Lower, then repeat for the other pair.
5. Tighten all four bolts in a cross pattern to the drawing torque, watching the indicators: if the readings move while the bolts are tightened, a foot has become soft.
6. Take a complete new set of readings and check the validity rule.

## Vertical first, then horizontal

Vertical moves come first because lifting a machine and adding shims nearly always shifts it sideways a little, while sliding it sideways does not change its height. If horizontal moves are made first, the vertical shimming spoils them and they must be repeated.

After the vertical shimming, the HW-3's new sag-corrected vertical readings were rim −0.175 mm and face +0.004 mm. This is an illustration.

```figure
type: steps
title: The HW-3 after the vertical moves, in the shaft alignment plan tool
caption: This is an illustration. Rim −0.175 mm (sag-corrected), face +0.004 mm; other inputs as before.
- Offset and angularity as read | −0.0875 mm; 0.003 mm per 100 mm
- Cold correction remaining at the front feet | remove 0.009 mm
- Cold correction remaining at the back feet | 0.000 mm
- * Running offset | −0.018 mm, against 0.05 mm
- Verdict | ALIGNMENT OK WHEN HOT
```

The motor now sits 0.0875 mm higher than the pump at the reading plane, cold, almost exactly the 0.070 mm target plus the 0.008 mm of over-shimming at the front, carried forward to the coupling. When it reaches running temperature, the pump will rise 0.070 mm more than the motor, leaving a running offset of 0.018 mm. The remaining corrections, under 0.01 mm, are left alone.

## The horizontal moves

The horizontal corrections from Chapter 6 were 0.342 mm at the front feet and 0.551 mm at the back, towards the 3 o'clock side. Thermal growth sideways was taken as zero for the HW-3. The vertical shimming had shifted the motor slightly, so the horizontal readings were taken again after the vertical moves: they had changed by less than 0.01 mm, so the original corrections stood.

Horizontal moves are made with the holding-down bolts just loose enough to let the feet slide, using jacking bolts on lugs welded to the base, or a soft-faced bar, never a hammer on the motor's feet or frame. Two dial indicators, one at the front feet and one at the back, mounted on the base with their tips on the side of the motor's feet, show each move directly. The fitter moves the front feet 0.34 mm and the back feet 0.55 mm on those indicators, tightens the bolts in a cross pattern while watching that nothing shifts, and then takes a full new set of alignment readings.

```figure
type: compare
title: HW-3 horizontal readings before and after the moves
cols: Rim at 9, zeroed at 3, mm | Face at 9, mm | Offset, mm | Angularity, mm per 100 mm
rowhead: Stage
- Before | +0.30 | +0.09 | 0.150 | 0.060
- * After | +0.02 | −0.003 | 0.010 | −0.002
caption: This is an illustration. Indicators on the stationary shaft, viewed from behind the motor. The final horizontal state is well within the running tolerance.
```

### When the movable machine cannot move far enough

Sometimes the plan asks for more than the movable machine can give: a removal larger than the shims under a foot, or a sideways move larger than the bolt hole allows. Then the stationary machine may have to move instead, or as well. For the HW-3 that would mean moving the pump, with its pipes, which is exactly why it was chosen as stationary; any such move would be followed by a fresh pipe strain check (Chapter 4). On a machine train, the plot of Chapter 7 shows which machine to move for the least total movement. The HW-3's corrections were well inside its limits, with 2 mm of shims under every foot and about 2 mm of clearance each way in its bolt holes, so the motor alone moved.

A move of a few hundredths of a millimetre is too small to judge by eye or feel, which is why every move is made against an indicator, not a guess. Tapping a foot with a soft mallet until "it looks right" moves it by an unknown amount, and usually too far. The foot indicators turn each push of a jacking bolt into a number, and the fitter stops when the number matches the plan.

## The mistake: the right shims under the wrong feet

On the first attempt, the HW-3's vertical shims went in the wrong way round: the 0.20 mm shims under the back feet and the 0.05 mm shims under the front. The fitter had read the plan's lines from the bottom up. The next set of readings was rim +0.675 mm and face −0.125 mm, sag-corrected: worse than before, not better.

Entered into the plan tool, those readings gave an offset of 0.338 mm, an angularity of −0.083 mm per 100 mm, cold corrections of add 0.141 mm at the front and remove 0.150 mm at the back, and a running offset of 0.407 mm. Raising the back of the motor more than its front had tipped its shaft down at the coupling, the opposite of what was wanted.

```figure
type: compare
title: The HW-3 after the swapped shims and after the correct shims
cols: Rim, mm | Face, mm | Running offset, mm | Verdict
rowhead: Shims
- Swapped: 0.05 front, 0.20 back | +0.675 | −0.125 | 0.407 | REALIGN
- * Correct: 0.20 front, 0.05 back | −0.175 | +0.004 | 0.018 | ALIGNMENT OK WHEN HOT
caption: This is an illustration. Sag-corrected vertical readings after each attempt.
```

The new readings caught the error at once, which is the point of taking a complete set after every move. The shims were swapped and the readings repeated. The site's procedure now has the fitter mark the corrections on the base beside each foot with a paint pen, from the plan sheet, before any foot is lifted.

## When moves do not go as planned

Moves rarely land exactly. A remaining correction of a few hundredths after the first round is normal, and a second, smaller round of moves usually finishes the job. Three patterns point to something other than ordinary variation.

```figure
type: decision
title: The readings after a move are not as predicted
question: What happened?
- The change is in the right direction but much smaller than the move | soft foot, or shims not fully under the feet: recheck each foot
- The change is the right size but the wrong way | shims swapped, or a sign error in the plan: recheck the sheet against the base marks
- The readings change when the bolts are tightened | induced soft foot or a bolt-bound foot: loosen, find the cause, repeat
- * The change matches the plan within a few hundredths | normal: make a second, smaller round of moves if still outside tolerance
caption: Each round ends with a complete, validated set of readings. A move that cannot be explained should be found and understood before the next one.
```

## The axial gap

Before the final readings, the gap between the coupling hubs is checked. Every flexible coupling has a specified distance between its hub faces, with a tolerance, so that its flexible element sits as designed and the shafts' axial float and thermal growth along their axes do not push the hubs together. The HW-3 coupling maker specifies the gap on its installation sheet; the fitters set it with a gauge block between the hub faces while the motor was loose for the horizontal moves, with the motor's shaft pushed to the middle of its end float. A coupling installed with the wrong gap can be perfectly aligned and still fail, because its element is permanently stretched or crushed.

## Bolts, torque and the final set

The holding-down bolts are part of the alignment. Each is tightened to the torque on the base maker's drawing, in a cross pattern, in two passes, with the alignment indicators still mounted and watched. A reading that moves by more than about 0.02 mm while a bolt is tightened means that the foot under it is not sitting squarely, and the alignment that existed before tightening is not the one that will remain. The soft foot check of Chapter 3 is repeated at this stage for every foot of the motor, because the shims added during the moves can themselves create soft foot if one is creased or not fully home.

Only after the bolts are at torque and the soft foot check has passed is the final set of readings taken, in both planes, with the validity rule and a repeat set. That set, not any earlier one, is the as-left alignment.

## Using the plan for the horizontal plane

The shaft alignment plan tool is built for the vertical plane, where thermal growth acts. For the HW-3's horizontal plane, where the growth was taken as zero, the rim and face tool of Chapter 6 gives the same corrections the plan tool would give with zero growth, and is the simpler choice. Where a machine does grow sideways, for example one with a hot pipe on one side, the sideways growth is estimated separately and added to the horizontal corrections by hand, as a target offset, in the same way the plan tool adds the vertical one, and the sheet says so.

## Recording the moves

The record of the moves is short and valuable: for each foot, the shims before, the shims added or removed, and the shims after; the horizontal moves made, read from the foot indicators; and the readings after each round. At the next alignment it shows how many shims are under each foot and how much room is left, and if the machine has moved since, the record of what was done helps separate a real change from an installation error. The HW-3 record also notes the room temperature and that the machines were cold, because the thermal targets assume it.

## Safety while moving machines

Lifting and sliding a 390 kg motor on a base calls for its own care. The motor stays isolated and locked out throughout, as it has been since Chapter 1. Jacks are placed at the lifting points the maker shows, hands stay out from under feet while shims are inserted, and no one stands where a sliding machine could trap them. The coupling guard is refitted before the isolation is removed, and Safe Work Australia's Code of Practice for plant covers both the isolation and the guarding.

## Exercise: a different cold reading after shimming

Suppose that after shimming, the HW-3's vertical readings had been rim −0.10 mm and face +0.02 mm, sag-corrected. With the same distances, thermal growth and tolerances, what would the plan tool give for the running offset and the remaining cold corrections, and would the alignment pass?

**Worked answer.** The offset as read is −0.10 ÷ 2 = −0.050 mm and the slope +0.02 ÷ 150 = +0.000133, or 0.013 mm per 100 mm. The rim and face corrections would be −0.050 + 0.000133 × 320 = −0.007 mm at the front and −0.050 + 0.000133 × 669 = 0.039 mm at the back.

The movable machine grows less by 0.070 mm, so the cold corrections are −0.007 + 0.070 = add 0.063 mm at the front and 0.039 + 0.070 = add 0.109 mm at the back. The running offset would be −0.050 + 0.070 = 0.020 mm, within 0.05 mm, and the angularity 0.013 mm per 100 mm, within 0.05: the tool would report ALIGNMENT OK WHEN HOT. The running check passes, but the cold corrections show the motor tilted: its back feet sit 0.109 mm below their cold target, while its front is close to it. Whether to make another round of moves is a judgement against how much of the tolerance the site wants to keep in hand. This is an illustration.
